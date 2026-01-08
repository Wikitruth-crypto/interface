/**
 * Workflow Data Preparation
 * 
 * Collect and validate data before workflow starts
 * This avoids polling for data during workflow execution
 */

import { WorkflowInitialData, WorkflowValidationError } from './types';
import { useNFTCreateStore } from '../../store/useNFTCreateStore';
// import { useCreateWorkflowStore } from '../../store/useCreateWorkflowStore';

/**
 * Prepare initial data required for the workflow
 * 
 * Principle:
 * 1. Synchronously get all required data
 * 2. Immediately validate data integrity
 * 3. Fail fast (if data is incomplete)
 * 4. Return complete initial data object
 * 
 * ❌ Do not: Poll for data during workflow execution
 * ✅ Correct: Prepare all data before starting
 */
export function prepareWorkflowData(): WorkflowInitialData {
  
  // 1. Get Store state (synchronous operation)
  const nftState = useNFTCreateStore.getState();
  // const workflowState = useCreateWorkflowStore.getState();

  // 2. Extract data
  const { boxInfoForm, fileData, isTestMode } = nftState;

  // 3. Validate required fields
  validateRequiredFields(boxInfoForm,fileData,isTestMode);

  // 4. Extract file objects
  const files = extractFiles(fileData.fileList);
  const boxImages = extractFiles(fileData.boxImageList);

  // 6. Build and return initial data object
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
 * Validate required fields
 * 
 * Validate using stepRequirements config
 * Collect all missing fields, display all errors at once
 * 
 * @private
 */
function validateRequiredFields(
  boxInfoForm: any,
  fileData: any,
  isTestMode: boolean
): void {
  const errors: string[] = [];

  // Build complete data object for validation
  const data = {
    boxInfo: boxInfoForm,
    files: fileData.fileList.map((f: any) => f.originFileObj || f),
    boxImages: fileData.boxImageList.map((f: any) => f.originFileObj || f),
    isTestMode,
  };

  // Get initial required fields config (from new metadata system)
  const requiredFields = [
    { path: 'boxInfo.title', label: 'Title' },
    { path: 'boxInfo.description', label: 'Description' },
    { path: 'boxInfo.typeOfCrime', label: 'Type of Crime' },
    { path: 'boxInfo.country', label: 'Country' },
    { path: 'boxInfo.eventDate', label: 'Event Date' },
    { path: 'boxInfo.nftOwner', label: 'NFT Owner' },
    { path: 'boxInfo.mintMethod', label: 'Mint Method' },
    { path: 'files', label: 'Files' },
    { path: 'boxImages', label: 'Box Images' },
    { path: 'isTestMode', label: 'Is Test Mode' },
  ];

  // Iterate to validate each required field
  for (const field of requiredFields) {
    const value = getValueByPath(data, field.path);

    // Check if field exists
    if (value === undefined || value === null || value === '') {
      errors.push(field.label);
      continue;
    }

    // Simplified validation logic (skipping custom validation for now)
    // Can integrate new metadata validation system later
  }

  // If errors exist, throw exception containing all errors
  if (errors.length > 0) {
    const errorMessage = `Please complete the following required fields:\n\n${errors.join('\n')}`;
    console.error('[prepareWorkflowData] Validation failed:', `Please complete the following required fields:\n\n${errors.join('\n')}`);
    throw new WorkflowValidationError('validation', errorMessage);
  }
}

/**
 * Get object value by path
 * 
 * @param obj - Data object
 * @param path - Field path, e.g. 'boxInfo.title'
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
 * Extract original File objects from UploadFile array
 * 
 * @private
 */
function extractFiles(uploadFiles: any[]): File[] {
  const files: File[] = [];

  for (const uploadFile of uploadFiles) {
    // Check if originFileObj exists
    if (uploadFile.originFileObj && uploadFile.originFileObj instanceof File) {
      files.push(uploadFile.originFileObj);
    } else {
      // If no originFileObj, try to use directly
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
 * Check if data is ready (for UI judgment)
 * 
 * This function will not throw error, only returns boolean
 * Suitable for use in button disabled attribute
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
 * Get data validation error messages (for UI display)
 * 
 * @returns Error message array, empty array if no error
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

