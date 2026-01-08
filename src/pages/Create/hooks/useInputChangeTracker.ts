/**
 * Input Change Tracker Hook
 *
 * Purpose: Track changes in user input and mark corresponding change states.
 *
 * Design Principles:
 * 1. Only listen to input data changes
 * 2. Only update change flags (no cascading updates of other states)
 * 3. Use shallow dependencies to avoid unnecessary triggers
 * 4. Fine-grained field change tracking, supports initialization/reset
 */

import { useEffect, useRef } from 'react';
import { useNFTCreateStore } from '../store/useNFTCreateStore';
import { AllInputFieldNames, BOX_INFO_FIELDS } from '../types/stateType';

type BoxInfoSnapshot = ReturnType<typeof cloneBoxInfo>;


export const useInputChangeTracker = () => {
  const nftStore = useNFTCreateStore();

  const initialBoxInfoRef = useRef<BoxInfoSnapshot>(cloneBoxInfo(nftStore.boxInfoForm));
  const initialFileListLengthRef = useRef(nftStore.fileData.fileList.length);
  const initialImageListLengthRef = useRef(nftStore.fileData.boxImageList.length);

  const boxInfoInitialisedRef = useRef(false);
  const fileListInitialisedRef = useRef(false);
  const imageListInitialisedRef = useRef(false);

  const changedFieldsRef = useRef<Set<AllInputFieldNames>>(new Set());

  const updateChangedFields = (mutator: (draft: Set<AllInputFieldNames>) => void) => {
    const next = new Set(changedFieldsRef.current);
    mutator(next);
    if (!areSetsEqual(next, changedFieldsRef.current)) {
      changedFieldsRef.current = next;
      nftStore.setChangedFields(Array.from(next));
    }
  };

  const commitBaseline = (options: { syncStore?: boolean } = {}) => {
    const state = useNFTCreateStore.getState();
    initialBoxInfoRef.current = cloneBoxInfo(state.boxInfoForm);
    initialFileListLengthRef.current = state.fileData.fileList.length;
    initialImageListLengthRef.current = state.fileData.boxImageList.length;
    boxInfoInitialisedRef.current = true;
    fileListInitialisedRef.current = true;
    imageListInitialisedRef.current = true;
    if (changedFieldsRef.current.size > 0) {
      changedFieldsRef.current.clear();
    }
    if (options.syncStore !== false && state.changedFields.length > 0) {
      state.setChangedFields([]);
    }
  };

  const lastBaselineVersionRef = useRef(nftStore.baselineVersion);

  useEffect(() => {
    if (lastBaselineVersionRef.current !== nftStore.baselineVersion) {
      lastBaselineVersionRef.current = nftStore.baselineVersion;
      commitBaseline();
    }
  }, [nftStore.baselineVersion]);

  // Listen to BoxInfo fields
  useEffect(() => {
    const current = nftStore.boxInfoForm;
    const initial = initialBoxInfoRef.current;

    if (!boxInfoInitialisedRef.current) {
      boxInfoInitialisedRef.current = true;
      initialBoxInfoRef.current = cloneBoxInfo(current);
      return;
    }

    const changedFields = BOX_INFO_FIELDS.filter((field) => !isFieldEqual(current[field], initial[field]));

    updateChangedFields((draft) => {
      BOX_INFO_FIELDS.forEach((field) => draft.delete(field));
      changedFields.forEach((field) => draft.add(field));
    });
  }, [
    nftStore.boxInfoForm.title,
    nftStore.boxInfoForm.description,
    nftStore.boxInfoForm.typeOfCrime,
    nftStore.boxInfoForm.label,
    nftStore.boxInfoForm.country,
    nftStore.boxInfoForm.state,
    nftStore.boxInfoForm.eventDate,
    nftStore.boxInfoForm.nftOwner,
    nftStore.boxInfoForm.price,
    nftStore.boxInfoForm.mintMethod,
  ]);

  // Listen to file list
  useEffect(() => {
    const currentLength = nftStore.fileData.fileList.length;

    if (!fileListInitialisedRef.current) {
      fileListInitialisedRef.current = true;
      initialFileListLengthRef.current = currentLength;
      return;
    }

    updateChangedFields((draft) => {
      if (currentLength !== initialFileListLengthRef.current) {
        draft.add('fileList');
      } else {
        draft.delete('fileList');
      }
    });
  }, [nftStore.fileData.fileList.length]);

  // Listen to image list
  useEffect(() => {
    const currentLength = nftStore.fileData.boxImageList.length;

    if (!imageListInitialisedRef.current) {
      imageListInitialisedRef.current = true;
      initialImageListLengthRef.current = currentLength;
      return;
    }

    updateChangedFields((draft) => {
      if (currentLength !== initialImageListLengthRef.current) {
        draft.add('boxImageList');
      } else {
        draft.delete('boxImageList');
      }
    });
  }, [nftStore.fileData.boxImageList.length]);

  const resetTracking = () => {
    commitBaseline();
  };

  return {
    resetTracking,
    commitBaseline,
    changedFields: Array.from(changedFieldsRef.current),
  };
};

function cloneBoxInfo(boxInfo: ReturnType<typeof useNFTCreateStore.getState>['boxInfoForm']) {
  return {
    ...boxInfo,
    label: Array.isArray(boxInfo.label) ? [...boxInfo.label] : [],
  };
}

// This function compares if two values are equal
function isFieldEqual(current: any, initial: any) {
  if (Array.isArray(current) && Array.isArray(initial)) {
    if (current.length !== initial.length) return false;
    for (let i = 0; i < current.length; i++) {
      if (current[i] !== initial[i]) return false;
    }
    return true;
  }
  return current === initial;
}

function areSetsEqual(a: Set<AllInputFieldNames>, b: Set<AllInputFieldNames>) {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}
