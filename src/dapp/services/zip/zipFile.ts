import CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';

/**
 * 分片元数据
 */
export interface ChunkMetadata {
    index: number;          // 分片索引
    hash: string;          // 分片哈希值（用于验证完整性）
    size: number;          // 分片大小
    name: string;          // 分片文件名
}

/**
 * 分割结果
 */
export interface SplitResult {
    chunks: Blob[];  
    json: Blob | null;              // 所有分片
    metadata: {
        totalChunks: number;         // 总分片数
        totalSize: number;           // 原始文件总大小
        chunkSize: number;           // 每个分片大小
        originalName: string;        // 原始文件名
        chunksInfo: ChunkMetadata[]; // 每个分片的详细信息
    };
}

/**
 * 合并结果
 */
export interface MergeResult {
    zipBlob: Blob;
    isValid: boolean;              // 是否验证通过
    message: string;               // 验证信息
}

/**
 * Zip文件分割与合并服务
 */
export const zipFileService = {

    /**
     * 分割zip文件
     * @param zipBlob - 要分割的zip文件
     * @param originalName - 原始文件名
     * @param chunkSize - 每个分片的大小（字节），默认2MB
     * @param autoSave - 是否自动保存分片文件
     */
    splitZipFile: async (
        zipBlob: Blob,
        originalName: string,
        chunkSize: number = 2 * 1024 * 1024, // 默认2MB
        autoSave: boolean = false
    ): Promise<SplitResult> => {
        try {
            const chunks: Blob[] = [];
            const chunksInfo: ChunkMetadata[] = [];
            const totalSize = zipBlob.size;
            const totalChunks = Math.ceil(totalSize / chunkSize);

            // 分割文件
            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, totalSize);
                const chunk = zipBlob.slice(start, end);

                // 计算分片哈希
                const arrayBuffer = await chunk.arrayBuffer();
                const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer) as any);
                const hash = CryptoJS.SHA256(wordArray).toString();

                // 生成分片文件名
                const chunkName = `${originalName}.part${String(i + 1).padStart(3, '0')}`;

                chunks.push(chunk);
                chunksInfo.push({
                    index: i,
                    hash,
                    size: chunk.size,
                    name: chunkName
                });

                // 自动保存分片
                if (autoSave) {
                    saveAs(chunk, chunkName);
                }
            }


            const result: SplitResult = {
                chunks,
                json: null,
                metadata: {
                    totalChunks,
                    totalSize,
                    chunkSize,
                    originalName,
                    chunksInfo
                }
            };

            // 测试合并分片文件，是否与原始文件一致
            if (result.metadata) {
                const mergedBlob = await zipFileService.mergeZipFiles(chunks, result.metadata);
                if (mergedBlob.zipBlob.size !== zipBlob.size) {
                    throw new Error('The merged file size is not consistent with the original file');
                }
            }
            result.json = new Blob(
                [JSON.stringify(result.metadata, null, 2)],
                { type: 'application/json' }
            );

            // 保存元数据文件
            if (autoSave) {
                saveAs(result.json, `${originalName}.metadata.json`);
            }

            return result;
        } catch (error) {
            console.error('Split zip file failed:', error);
            throw error;
        }
    },

    /**
     * 合并分片文件
     * @param chunks - 分片数组（必须按顺序）
     * @param metadata - 分片元数据（用于验证）
     * @param allowWithoutMetadata - 是否允许在没有元数据的情况下合并（不推荐）
     */
    mergeZipFiles: async (
        chunks: Blob[],
        metadata?: SplitResult['metadata'],
        allowWithoutMetadata: boolean = false
    ): Promise<MergeResult> => {
        try {
            // 检查分片数量
            if (chunks.length === 0) {
                throw new Error('No chunks provided');
            }

            // 检查是否有元数据
            if (!metadata && !allowWithoutMetadata) {
                return {
                    zipBlob: new Blob(),
                    isValid: false,
                    message: 'Missing metadata file, cannot merge safely. Please provide the metadata.json file or set allowWithoutMetadata=true (not recommended)'
                };
            }

            // 如果提供了元数据，进行验证
            if (metadata) {
                // 验证分片数量
                if (chunks.length !== metadata.totalChunks) {
                    return {
                        zipBlob: new Blob(),
                        isValid: false,
                        message: `The number of chunks does not match. Expected: ${metadata.totalChunks}, Actual: ${chunks.length}`
                    };
                }

                // 验证每个分片的哈希
                for (let i = 0; i < chunks.length; i++) {
                    const chunk = chunks[i];
                    const expectedHash = metadata.chunksInfo[i].hash;

                    const arrayBuffer = await chunk.arrayBuffer();
                    const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer) as any);
                    const actualHash = CryptoJS.SHA256(wordArray).toString();

                    if (actualHash !== expectedHash) {
                        return {
                            zipBlob: new Blob(),
                            isValid: false,
                            message: `Chunk ${i + 1} hash verification failed. The file may be damaged.`
                        };
                    }
                }
            }

            // 合并所有分片
            const mergedBlob = new Blob(chunks, { type: 'application/zip' });

            // 验证合并后的总大小
            if (metadata && mergedBlob.size !== metadata.totalSize) {
                return {
                    zipBlob: mergedBlob,
                    isValid: false,
                    message: `The merged file size does not match. Expected: ${metadata.totalSize}, Actual: ${mergedBlob.size}`
                };
            }

            // 根据是否有元数据返回不同的消息
            const message = metadata 
                ? 'File merged successfully and verified' 
                : 'File merged successfully, but not verified (missing metadata)';

            return {
                zipBlob: mergedBlob,
                isValid: true,
                message
            };
        } catch (error) {
            console.error('Merge zip files failed:', error);
            throw error;
        }
    },

    /**
     * 从文件列表中提取分片和元数据
     * @param files - 文件列表（包含分片和元数据文件）
     */
    extractChunksFromFiles: async (files: File[]): Promise<{
        chunks: Blob[];
        metadata?: SplitResult['metadata'];
    }> => {
        try {
            let metadata: SplitResult['metadata'] | undefined;
            const chunkFiles: { index: number; file: File }[] = [];

            // 分离元数据和分片文件
            for (const file of files) {
                if (file.name.endsWith('.metadata.json')) {
                    // 读取元数据
                    const text = await file.text();
                    metadata = JSON.parse(text);
                } else if (file.name.includes('.part')) {
                    // 提取分片索引
                    const match = file.name.match(/\.part(\d+)$/);
                    if (match) {
                        const index = parseInt(match[1]) - 1;
                        chunkFiles.push({ index, file });
                    }
                }
            }

            // 按索引排序分片
            chunkFiles.sort((a, b) => a.index - b.index);
            const chunks = chunkFiles.map(item => item.file);

            return { chunks, metadata };
        } catch (error) {
            console.error('Extract chunks from files failed:', error);
            throw error;
        }
    },

    /**
     * 安全合并分片文件（推荐使用）
     * 必须有元数据文件才能合并
     */
    safeMergeZipFiles: async (
        chunks: Blob[],
        metadata: SplitResult['metadata']
    ): Promise<MergeResult> => {
        return zipFileService.mergeZipFiles(chunks, metadata, false);
    },

    /**
     * 强制合并分片文件（不推荐，仅用于紧急情况）
     * 即使没有元数据也会尝试合并
     */
    forceMergeZipFiles: async (chunks: Blob[]): Promise<MergeResult> => {
        return zipFileService.mergeZipFiles(chunks, undefined, true);
    }
};