import CryptoJS from 'crypto-js';
import { saveAs } from 'file-saver';

/**
 * Chunk Metadata
 */
export interface ChunkMetadata {
    index: number;          // Chunk index
    hash: string;          // Chunk hash (used for integrity verification)
    size: number;          // Chunk size
    name: string;          // Chunk file name
}

/**
 * Split Result
 */
export interface SplitResult {
    chunks: Blob[];  
    json: Blob | null;              // All chunks JSON blob
    metadata: {
        totalChunks: number;         // Total chunks
        totalSize: number;           // Original total file size
        chunkSize: number;           // Chunk size
        originalName: string;        // Original file name
        chunksInfo: ChunkMetadata[]; // Detailed info of each chunk
    };
}

/**
 * Merge Result
 */
export interface MergeResult {
    zipBlob: Blob;
    isValid: boolean;              // Whether verification passed
    message: string;               // Verification message
}

/**
 * Zip file split and merge service
 */
export const zipFileService = {

    /**
     * Split zip file
     * @param zipBlob - Zip file to split
     * @param originalName - Original file name
     * @param chunkSize - Size of each chunk (bytes), default 2MB
     * @param autoSave - Whether to auto save chunk files
     */
    splitZipFile: async (
        zipBlob: Blob,
        originalName: string,
        chunkSize: number = 2 * 1024 * 1024, // Default 2MB
        autoSave: boolean = false
    ): Promise<SplitResult> => {
        try {
            const chunks: Blob[] = [];
            const chunksInfo: ChunkMetadata[] = [];
            const totalSize = zipBlob.size;
            const totalChunks = Math.ceil(totalSize / chunkSize);

            // Split file
            for (let i = 0; i < totalChunks; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, totalSize);
                const chunk = zipBlob.slice(start, end);

                // Calculate chunk hash
                const arrayBuffer = await chunk.arrayBuffer();
                const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer) as any);
                const hash = CryptoJS.SHA256(wordArray).toString();

                // Generate chunk file name
                const chunkName = `${originalName}.part${String(i + 1).padStart(3, '0')}`;

                chunks.push(chunk);
                chunksInfo.push({
                    index: i,
                    hash,
                    size: chunk.size,
                    name: chunkName
                });

                // Auto save chunks
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

            // Test merge chunk files, check if consistent with original file
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

            // Save metadata file
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
     * Merge chunk files
     * @param chunks - Chunk array (must be in order)
     * @param metadata - Chunk metadata (used for verification)
     * @param allowWithoutMetadata - Whether to allow merging without metadata (not recommended)
     */
    mergeZipFiles: async (
        chunks: Blob[],
        metadata?: SplitResult['metadata'],
        allowWithoutMetadata: boolean = false
    ): Promise<MergeResult> => {
        try {
            // Check chunk count
            if (chunks.length === 0) {
                throw new Error('No chunks provided');
            }

            // Check if metadata exists
            if (!metadata && !allowWithoutMetadata) {
                return {
                    zipBlob: new Blob(),
                    isValid: false,
                    message: 'Missing metadata file, cannot merge safely. Please provide the metadata.json file or set allowWithoutMetadata=true (not recommended)'
                };
            }

            // If metadata provided, verify
            if (metadata) {
                // Verify chunk count
                if (chunks.length !== metadata.totalChunks) {
                    return {
                        zipBlob: new Blob(),
                        isValid: false,
                        message: `The number of chunks does not match. Expected: ${metadata.totalChunks}, Actual: ${chunks.length}`
                    };
                }

                // Verify hash of each chunk
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

            // Merge all chunks
            const mergedBlob = new Blob(chunks, { type: 'application/zip' });

            // Verify total size after merge
            if (metadata && mergedBlob.size !== metadata.totalSize) {
                return {
                    zipBlob: mergedBlob,
                    isValid: false,
                    message: `The merged file size does not match. Expected: ${metadata.totalSize}, Actual: ${mergedBlob.size}`
                };
            }

            // Return different messages based on whether metadata exists
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
     * Extract chunks and metadata from file list
     * @param files - File list (contains chunks and metadata files)
     */
    extractChunksFromFiles: async (files: File[]): Promise<{
        chunks: Blob[];
        metadata?: SplitResult['metadata'];
    }> => {
        try {
            let metadata: SplitResult['metadata'] | undefined;
            const chunkFiles: { index: number; file: File }[] = [];

            // Separate metadata and chunk files
            for (const file of files) {
                if (file.name.endsWith('.metadata.json')) {
                    // Read metadata
                    const text = await file.text();
                    metadata = JSON.parse(text);
                } else if (file.name.includes('.part')) {
                    // Extract chunk index
                    const match = file.name.match(/\.part(\d+)$/);
                    if (match) {
                        const index = parseInt(match[1]) - 1;
                        chunkFiles.push({ index, file });
                    }
                }
            }

            // Sort chunks by index
            chunkFiles.sort((a, b) => a.index - b.index);
            const chunks = chunkFiles.map(item => item.file);

            return { chunks, metadata };
        } catch (error) {
            console.error('Extract chunks from files failed:', error);
            throw error;
        }
    },

    /**
     * Safe merge chunk files (recommended)
     * Must have metadata file to merge
     */
    safeMergeZipFiles: async (
        chunks: Blob[],
        metadata: SplitResult['metadata']
    ): Promise<MergeResult> => {
        return zipFileService.mergeZipFiles(chunks, metadata, false);
    },

    /**
     * Force merge chunk files (not recommended, only for emergencies)
     * Try to merge even without metadata
     */
    forceMergeZipFiles: async (chunks: Blob[]): Promise<MergeResult> => {
        return zipFileService.mergeZipFiles(chunks, undefined, true);
    }
};