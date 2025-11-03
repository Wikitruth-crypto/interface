/**
 * 输入变更追踪 Hook
 *
 * 作用：追踪用户输入的变化，并标记相应的变更状态。
 *
 * 设计原则：
 * 1. 只监听输入数据的变化
 * 2. 只更新变更标记（不触发其他状态的级联更新）
 * 3. 使用浅层依赖避免不必要的触发
 * 4. 细粒度字段变更追踪，并支持初始化/重置
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

  // 监听 BoxInfo 字段
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

  // 监听文件列表
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

  // 监听图片列表
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

// 这个函数用于比较两个值是否相等
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
