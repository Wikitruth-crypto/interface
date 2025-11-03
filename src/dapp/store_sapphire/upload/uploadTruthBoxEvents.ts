import { BoxStatus } from '../types';
import { TruthBoxEventName, TruthBoxEventStored } from '../typesBox';
import { useQueryStore } from '../useQueryStore';
import type { DecodedRuntimeEvent } from '@/dapp/oasisQuery/app/services/events';

const TRUTH_BOX_EVENT_SET: ReadonlySet<TruthBoxEventName> = new Set<TruthBoxEventName>([
  'BoxInfoChanged',
  'BoxCreated',
  'BoxStatusChanged',
  'PriceChanged',
  'DeadlineChanged',
  'PrivateKeyPublished',
]);

const BOX_STATUS_LOOKUP: Record<number, BoxStatus> = {
  0: BoxStatus.Storing,
  1: BoxStatus.Selling,
  2: BoxStatus.Auctioning,
  3: BoxStatus.Paid,
  4: BoxStatus.Refunding,
  5: BoxStatus.InSecrecy,
  6: BoxStatus.Published,
  7: BoxStatus.Blacklisted,
};

type TruthBoxDecodedEvent = DecodedRuntimeEvent<Record<string, unknown>>;

const toDecimalString = (value: unknown): string | undefined => {
  if (typeof value === 'bigint') return value.toString();
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return undefined;
    return Math.trunc(value).toString();
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  }
  return undefined;
};

const toText = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'bigint' || typeof value === 'number' || typeof value === 'boolean') {
    return value.toString();
  }
  return undefined;
};

const toHexString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  return undefined;
};

const pickArg = (args: Record<string, unknown>, ...candidates: string[]) => {
  for (const key of candidates) {
    if (key in args) {
      return args[key];
    }
  }
  return undefined;
};

const pickBoxId = (args: Record<string, unknown>): string | undefined =>
  toDecimalString(pickArg(args, 'boxId', 'boxID', 'box_id'));

const selectTransactionHash = (event: TruthBoxDecodedEvent): string | undefined => {
  const hash = event.raw.eth_tx_hash ?? event.raw.tx_hash;
  return typeof hash === 'string' && hash.length ? hash : undefined;
};

const buildPayload = (
  eventName: TruthBoxEventName,
  args: Record<string, unknown>,
): Record<string, string | boolean | number> | null => {
  switch (eventName) {
    case 'BoxInfoChanged': {
      const cid = toText(pickArg(args, 'boxInfoCID', 'boxInfoCid', 'cid'));
      if (!cid) return null;
      return {
        boxInfoCID: cid,
      };
    }
    case 'BoxCreated': {
      const userId = toDecimalString(pickArg(args, 'userId', 'userID'));
      if (!userId) return null;
      return {
        userId,
      };
    }
    case 'BoxStatusChanged': {
      const rawStatus = pickArg(args, 'status', 'newStatus');
      const statusIndex = toDecimalString(rawStatus);
      if (!statusIndex) return null;
      const index = Number(statusIndex);
      const statusLabel = Number.isFinite(index) ? BOX_STATUS_LOOKUP[index] : undefined;
      const isInBlacklist = statusLabel === BoxStatus.Blacklisted;
      return {
        statusIndex,
        status: statusLabel ?? statusIndex,
        isInBlacklist,
      };
    }
    case 'PriceChanged': {
      const price = toDecimalString(pickArg(args, 'price', 'newPrice'));
      if (price === undefined) return null;
      return { price };
    }
    case 'DeadlineChanged': {
      const deadline = toDecimalString(pickArg(args, 'deadline', 'newDeadline'));
      if (deadline === undefined) return null;
      return { deadline };
    }
    case 'PrivateKeyPublished': {
      const privateKey = toHexString(pickArg(args, 'privateKey', 'key'));
      if (!privateKey) return null;
      const userId = toDecimalString(pickArg(args, 'userId', 'userID'));
      const payload: Record<string, string | boolean | number> = { privateKey };
      if (userId) {
        payload.userId = userId;
      }
      return payload;
    }
    default:
      return null;
  }
};

const normalizeTruthBoxEvent = (event: TruthBoxDecodedEvent): TruthBoxEventStored | null => {
  const eventName = event.eventName as TruthBoxEventName;
  if (!TRUTH_BOX_EVENT_SET.has(eventName)) {
    return null;
  }

  const args = event.args ?? {};
  const boxId = pickBoxId(args);
  if (!boxId) {
    return null;
  }

  const payload = buildPayload(eventName, args);
  if (!payload) {
    return null;
  }

  const blockNumber = toDecimalString(event.raw.round) ?? '0';
  const timestamp = toText(event.raw.timestamp) ?? new Date().toISOString();

  return {
    id: `${eventName}:${boxId}`,
    tokenId: boxId,
    eventType: eventName,
    boxId,
    blockNumber,
    transactionHash: selectTransactionHash(event),
    timestamp,
    payload,
  };
};

export const uploadTruthBoxEvents = (events: TruthBoxDecodedEvent[]): void => {
  if (!events?.length) return;

  const normalizedEvents: TruthBoxEventStored[] = [];
  for (const event of events) {
    const normalized = normalizeTruthBoxEvent(event);
    if (normalized) {
      normalizedEvents.push(normalized);
    }
  }

  if (!normalizedEvents.length) return;

  useQueryStore.getState().ingestTruthBoxEvents(normalizedEvents);
};
