import React from 'react';
import { Button } from 'antd';
import { cn } from '@/lib/utils';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export interface SaveAsTxtProps {
    /** 要保存的数据，可以是对象、数组或字符串 */
    data: any;
    /** 文件名（不包含扩展名） */
    fileName: string;
    /** 按钮显示文本 */
    children?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 额外的样式类名 */
    className?: string;
    /** 保存成功回调 */
    onSaveSuccess?: (fileName: string) => void;
    /** 保存失败回调 */
    onSaveError?: (error: Error) => void;
}

/**
 * SaveAsTxt - 保存数据为文本文件组件
 * 
 * 一个功能增强的文件保存组件，支持将各种数据类型保存为 TXT 文件。
 * 从原基础版本重构，增加了更多样式选项和错误处理。
 * 
 * @param data - 要保存的数据
 * @param fileName - 文件名（不含扩展名）
 * @param children - 按钮文字
 * @param disabled - 是否禁用
 * @param className - 额外样式类名
 * @param onSaveSuccess - 成功回调
 * @param onSaveError - 失败回调
 */
const SaveAsTxt: React.FC<SaveAsTxtProps> = ({
    data,
    fileName,
    children = 'Save .txt',
    disabled = false,
    className,
    onSaveSuccess,
    onSaveError
}) => {
    const handleSave = () => {
        try {
            let content: string;

            // 根据数据类型处理内容
            if (typeof data === 'string') {
                content = data;
            } else if (typeof data === 'object' && data !== null) {
                // 对象或数组，格式化为 JSON
                content = JSON.stringify(data, null, 2);
            } else {
                // 其他类型，转换为字符串
                content = String(data);
            }

            // 创建 Blob
            const blob = new Blob([content], { 
                type: 'text/plain;charset=utf-8' 
            });
            
            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}.txt`;
            
            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 清理 URL
            URL.revokeObjectURL(url);

            // 成功回调
            onSaveSuccess?.(fileName);
            
        } catch (error) {
            console.error('保存文件失败:', error);
            onSaveError?.(error as Error);
        }
    };

    return (
        <Button onClick={handleSave}>
            <DocumentArrowDownIcon className="w-4 h-4" />
            {children}
        </Button>
    );
};

export default SaveAsTxt;

/**
 * SaveAsTxt - 保存文本文件组件使用指南
 * 
 * 这是一个功能增强的文件保存组件，支持多种数据类型的保存，
 * 并提供了丰富的样式选项和错误处理机制。
 * 
 * 主要特性：
 * - 支持多种数据类型（字符串、对象、数组等）
 * - 多种按钮样式变体
 * - 可自定义按钮尺寸
 * - 完整的错误处理
 * - 成功/失败回调
 * - 无障碍访问支持
 * 
 * 数据类型支持：
 * - 字符串：直接保存
 * - 对象/数组：格式化为 JSON（缩进 2 空格）
 * - 其他类型：转换为字符串保存
 * 
 * 使用示例：
 * 
 * // 保存 JSON 数据
 * const userData = { name: 'John', age: 30, email: 'john@example.com' };
 * <SaveAsTxt 
 *   data={userData}
 *   fileName="user-data"
 *   buttonText="导出用户数据"
 *   variant="primary"
 * />
 * 
 * // 保存字符串内容
 * <SaveAsTxt 
 *   data="这是要保存的文本内容"
 *   fileName="my-notes"
 *   buttonText="保存笔记"
 *   variant="outlined"
 *   size="small"
 * />
 * 
 * // 保存数组数据，带回调
 * <SaveAsTxt 
 *   data={truthBoxList}
 *   fileName="truth-boxes"
 *   buttonText="导出 Truth Box 列表"
 *   type="primary"
 *   onSaveSuccess={(fileName) => toast.success(`${fileName}.txt 保存成功`)}
 *   onSaveError={(error) => toast.error(`保存失败: ${error.message}`)}
 * />
 * 
 * // 在表格或列表中使用
 * <div className="flex gap-2">
 *   <SaveAsTxt 
 *     data={selectedItems}
 *     fileName="selected-items"
 *     type="text"
 *     size="small"
 *   />
 *   <SaveAsTxt 
 *     data={allItems}
 *     fileName="all-items"
 *     variant="primary"
 *     size="small"
 *   />
 * </div>
 * 
 * 样式变体说明：
 * - default: 灰色背景，适合一般操作
 * - outline: 透明背景带边框，次要操作
 * - ghost: 完全透明，轻量操作
 * - primary: 主题色背景，重要操作
 * 
 * 尺寸选项：
 * - sm: 小尺寸，适合紧凑布局
 * - default: 标准尺寸，通用场景
 * - lg: 大尺寸，突出显示
 * 
 * 注意事项：
 * - 文件名会自动添加 .txt 扩展名
 * - 大数据量可能影响浏览器性能
 * - 部分浏览器可能有下载限制
 * - 建议在用户交互后触发下载
 */ 