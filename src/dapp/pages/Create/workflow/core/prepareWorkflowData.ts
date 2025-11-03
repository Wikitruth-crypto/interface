/**
 * 工作流数据准备
 * 
 * 在工作流开始前进行数据收集和验证
 * 这样就不需要在工作流执行过程中轮询等待数据
 */

import { WorkflowInitialData, WorkflowValidationError } from './types';
import { useNFTCreateStore } from '../../store/useNFTCreateStore';
// import { useCreateWorkflowStore } from '../../store/useCreateWorkflowStore';

/**
 * 准备工作流所需的初始数据
 * 
 * 原理：
 * 1. 同步获取所有需要的数据
 * 2. 立即验证数据完整性
 * 3. 快速失败（如果数据不完整）
 * 4. 返回完整的初始数据对象
 * 
 * ❌ 不要：在工作流执行中轮询等待数据
 * ✅ 正确：在开始前准备好所有数据
 */
export function prepareWorkflowData(): WorkflowInitialData {
  
  // 1. 获取 Store 状态（同步操作）
  const nftState = useNFTCreateStore.getState();
  // const workflowState = useCreateWorkflowStore.getState();

  // 2. 提取数据
  const { boxInfoForm, fileData, isTestMode } = nftState;

  // 3. 验证必填字段
  validateRequiredFields(boxInfoForm,fileData,isTestMode);

  // 4. 提取文件对象
  const files = extractFiles(fileData.fileList);
  const boxImages = extractFiles(fileData.boxImageList);

  // 6. 构建并返回初始数据对象
  const initialData = {
    boxInfo: {
      title: boxInfoForm.title,
      description: boxInfoForm.description,
      label: boxInfoForm.label,
      country: boxInfoForm.country,
      state: boxInfoForm.state,
      typeOfCrime: boxInfoForm.typeOfCrime,
      eventDate: boxInfoForm.eventDate,
      nftOwner: boxInfoForm.nftOwner,
      price: boxInfoForm.price,
      mintMethod: boxInfoForm.mintMethod,
    },
    files,
    boxImages,
    isTestMode: isTestMode,
  };
  
  return initialData;
}

/**
 * 验证必填字段
 * 
 * 使用 stepRequirements 配置进行验证
 * 收集所有缺失的字段，一次性显示所有错误
 * 
 * @private
 */
function validateRequiredFields(
  boxInfoForm: any,
  fileData: any,
  isTestMode: boolean
): void {
  const errors: string[] = [];

  // 构建完整的数据对象用于验证
  const data = {
    boxInfo: boxInfoForm,
    files: fileData.fileList.map((f: any) => f.originFileObj || f),
    boxImages: fileData.boxImageList.map((f: any) => f.originFileObj || f),
    isTestMode,
  };

  // 获取初始必需字段配置（从新的元数据系统）
  const requiredFields = [
    { path: 'boxInfo.title', label: '标题' },
    { path: 'boxInfo.description', label: '描述' },
    { path: 'boxInfo.typeOfCrime', label: '犯罪类型' },
    { path: 'boxInfo.country', label: '国家' },
    { path: 'boxInfo.eventDate', label: '事件日期' },
    { path: 'boxInfo.nftOwner', label: 'NFT所有者' },
    { path: 'boxInfo.mintMethod', label: '铸造模式' },
    { path: 'files', label: '文件列表' },
    { path: 'boxImages', label: '盒子封面图片列表' },
    { path: 'isTestMode', label: '是否是测试模式' },
  ];

  // 遍历验证每个必需字段
  for (const field of requiredFields) {
    const value = getValueByPath(data, field.path);

    // 检查字段是否存在
    if (value === undefined || value === null || value === '') {
      errors.push(field.label);
      continue;
    }

    // 简化的验证逻辑（暂时跳过自定义验证）
    // 后续可以集成新的元数据验证系统
  }

  // 如果有错误，抛出包含所有错误的异常
  if (errors.length > 0) {
    const errorMessage = `请完善以下必填字段：\n\n${errors.join('\n')}`;
    console.error('[prepareWorkflowData] Validation failed:', errorMessage);
    throw new WorkflowValidationError('validation', errorMessage);
  }
}

/**
 * 根据路径获取对象的值
 * 
 * @param obj - 数据对象
 * @param path - 字段路径，如 'boxInfo.title'
 */
function getValueByPath(obj: any, path: string): any {
  const keys = path.split('.');
  let value = obj;

  for (const key of keys) {
    if (value === undefined || value === null) {
      return undefined;
    }
    value = value[key];
  }

  return value;
}

/**
 * 从 UploadFile 数组中提取原始 File 对象
 * 
 * @private
 */
function extractFiles(uploadFiles: any[]): File[] {
  const files: File[] = [];

  for (const uploadFile of uploadFiles) {
    // 检查是否有 originFileObj
    if (uploadFile.originFileObj && uploadFile.originFileObj instanceof File) {
      files.push(uploadFile.originFileObj);
    } else {
      // 如果没有 originFileObj，尝试直接使用
      if (uploadFile instanceof File) {
        files.push(uploadFile);
      } else {
        throw new WorkflowValidationError(
          'files',
          `Invalid file object: ${uploadFile.name || 'unknown'}`
        );
      }
    }
  }

  return files;
}

/**
 * 检查数据是否已准备好（用于 UI 判断）
 * 
 * 此函数不会抛出错误，只返回布尔值
 * 适合在按钮的 disabled 属性中使用
 */
export function isWorkflowDataReady(): boolean {
  try {
    prepareWorkflowData();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 获取数据验证错误信息（用于 UI 显示）
 * 
 * @returns 错误信息数组，如果没有错误则返回空数组
 */
export function getValidationErrors(): string[] {
  try {
    prepareWorkflowData();
    return [];
  } catch (error) {
    if (error instanceof WorkflowValidationError) {
      return [error.message];
    }
    return [String(error)];
  }
}

