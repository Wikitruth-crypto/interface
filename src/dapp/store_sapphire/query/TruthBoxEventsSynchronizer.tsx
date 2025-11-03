"use client";

import { useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ContractName } from '@/dapp/contractsConfig/types';
import type { RuntimeScope } from '@/dapp/oasisQuery/types/searchScope';
import { useRuntimeContractEvents, UseRuntimeContractEventsParams } from '@/dapp/oasisQuery/app/hooks/useRuntimeContractEvents';
import { uploadTruthBoxEvents } from '../upload/uploadTruthBoxEvents';
import { useQueryStatus } from '../useQueryStatus';

const DEFAULT_SCOPE: RuntimeScope = {
  network: 'testnet',
  layer: 'sapphire',
};

export interface TruthBoxEventsSynchronizerProps{
  scope?: RuntimeScope;
  limit?: number;
  offset?: number;
  fromRound?: number;
  fromTimestamp?: number;
  enabled?: boolean;
  eventNames?: readonly string[] | undefined;
  debug?: boolean;
  renderFallback?: (state: { isFetching: boolean; lastSyncedAt?: number }) => ReactNode;
}

export const TruthBoxEventsSynchronizer = ({
  scope = DEFAULT_SCOPE,
  limit = 100,
  offset = 0,
  fromRound = undefined,
  fromTimestamp = undefined,
  enabled = true,
  eventNames,
  debug = false,
  renderFallback,
}: TruthBoxEventsSynchronizerProps) => {

  const queryConfig = useMemo(
    () => ({
      scope,
      contract: ContractName.TRUTH_BOX,
      limit,
      offset,
      fromRound,
      fromTimestamp,
      eventNames,
      enabled,
    }),
    [enabled, eventNames, limit, offset, scope],
  );

  const { events, query } = useRuntimeContractEvents(queryConfig);
  const { setIsLoading_truthBox, updateLastSyncTimestamp, addSyncError, clearSyncErrors } = useQueryStatus();

  // 同步加载状态到 useQueryStatus
  useEffect(() => {
    setIsLoading_truthBox(query.isFetching);
  }, [query.isFetching, setIsLoading_truthBox]);

  // 同步错误状态到 useQueryStatus
  useEffect(() => {
    if (query.error) {
      addSyncError(String(query.error));
    } else {
      clearSyncErrors();
    }
  }, [query.error, addSyncError, clearSyncErrors]);

  useEffect(() => {
    if (debug) {
      console.log('[TruthBoxEventsSynchronizer] query status', {
        status: query.status,
        fetchStatus: query.fetchStatus,
        isFetching: query.isFetching,
        decoded: events.length,
        error: query.error,
      });
    }
  }, [debug, events.length, query.error, query.fetchStatus, query.isFetching, query.status]);

  useEffect(() => {
    if (!events.length) return;
    uploadTruthBoxEvents(events);
    // 更新同步时间戳
    updateLastSyncTimestamp();
  }, [events, updateLastSyncTimestamp]);

  if (debug || renderFallback) {
    const content =
      renderFallback?.({
        isFetching: query.isFetching,
        lastSyncedAt: events.length ? Date.now() : undefined,
      }) ?? (
        <div className="rounded-lg border border-dashed border-white/10 p-3 text-xs text-white/70 space-y-1">
          <div className="font-semibold text-white">TruthBox events synchronizer</div>
          <div>Status: {query.isFetching ? 'fetching' : query.isError ? 'error' : 'idle'}</div>
          <div>Query status: {query.status}</div>
          <div>Events decoded: {events.length}</div>
          {events.length > 0 && <div>Last synced at: {new Date().toLocaleTimeString()}</div>}
          {query.isError ? (
            <div className="text-red-400 break-all">Error: {String(query.error)}</div>
          ) : null}
        </div>
      );

    return <>{content}</>;
  }

  return null;
};

export default TruthBoxEventsSynchronizer;
