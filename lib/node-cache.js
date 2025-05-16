import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 0, checkperiod: 600 }); // No expiration unless set

export async function getCachedCallIds(assistantId) {
  const ids = cache.get(assistantId);
  return new Set(ids || []);
}

export async function cacheCallId(assistantId, callId) {
  const current = new Set(cache.get(assistantId) || []);
  current.add(callId);
  cache.set(assistantId, Array.from(current));
}
