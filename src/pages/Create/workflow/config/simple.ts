import { AllInputFieldNames } from '../../types/stateType';
import { StepNameType, allSteps } from '../../types/workflowStateType';

export interface PlanResult {
  executionSteps: StepNameType[];
  skippableSteps: StepNameType[];
}

export class WorkflowOrchestrator {
  static generateExecutionPlan(
    completedSteps: StepNameType[] = [],
    changedFields: AllInputFieldNames[] = [],
  ): PlanResult {
    const completedSet = new Set<StepNameType>(completedSteps);

    if (changedFields.length === 0) {
      const executionSteps = allSteps.filter(step => !completedSet.has(step));
      const skippableSteps = allSteps.filter(step => completedSet.has(step));

      return {
        executionSteps: executionSteps.length > 0 ? executionSteps : [...allSteps],
        skippableSteps,
      };
    }

    const affectedSteps = new Set(this.getAffectedSteps(changedFields));

    const executionSteps = allSteps.filter(step => {
      if (!completedSet.has(step)) return true;
      return affectedSteps.has(step);
    });

    const skippableSteps = allSteps.filter(step => completedSet.has(step) && !affectedSteps.has(step));

    return {
      executionSteps: executionSteps.length > 0 ? executionSteps : [...allSteps],
      skippableSteps,
    };
  }

  static getFieldImpact(fieldId: AllInputFieldNames): StepNameType[] {
    return FIELD_IMPACT_MAP[fieldId] || [];
  }

  static getAffectedSteps(changedFields: AllInputFieldNames[]): StepNameType[] {
    const affectedSteps = new Set<StepNameType>();
    changedFields.forEach(field => {
      const impact = this.getFieldImpact(field);
      impact.forEach(step => affectedSteps.add(step));
    });
    const ordered = Array.from(affectedSteps) as StepNameType[];
    return ordered.sort((a, b) => allSteps.indexOf(a) - allSteps.indexOf(b));
  }
}

export const FIELD_IMPACT_MAP: Record<AllInputFieldNames, StepNameType[]> = {
  title: ['createNFTImage', 'uploadNFTImage', 'metadataNFT', 'metadataBox', 'mint', 'uploadResultData'],
  description: ['metadataBox', 'mint', 'uploadResultData'],
  typeOfCrime: ['createNFTImage', 'uploadNFTImage', 'metadataNFT', 'metadataBox', 'mint', 'uploadResultData'],
  label: ['metadataBox', 'mint', 'uploadResultData'],
  country: ['metadataNFT','metadataBox',  'mint', 'uploadResultData'],
  state: ['metadataNFT', 'metadataBox', 'mint', 'uploadResultData'],
  eventDate: ['metadataNFT', 'metadataBox', 'mint', 'uploadResultData'],
  nftOwner: ['mint', 'uploadResultData'],
  price: ['mint', 'uploadResultData'],
  mintMethod: ['compressFiles', 'uploadFiles', 'encryptData', 'metadataBox', 'mint', 'uploadResultData'],
  boxImageList: ['uploadBoxImage', 'createNFTImage', 'uploadNFTImage', 'metadataNFT', 'metadataBox', 'mint', 'uploadResultData'],
  fileList: ['compressFiles', 'uploadFiles', 'encryptData', 'metadataBox', 'mint', 'uploadResultData'],
};
