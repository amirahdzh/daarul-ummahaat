/**
 * A small in-memory limiter: at most `limit` hits per `windowMs` for each key.
 * State lives in this one server process, which is enough for a single-server site
 * and is only a soft guard. Cloudflare rules are the real shield.
 */
export const createRateLimiter = (limit: number, windowMs: number) => {
  const hits = new Map<string, number[]>()

  return (key: string, now: number = Date.now()): boolean => {
    const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs)
    if (recent.length >= limit) {
      hits.set(key, recent)
      return false
    }
    recent.push(now)
    hits.set(key, recent)
    // Keep memory bounded on a long-running process.
    if (hits.size > 5_000) {
      for (const [k, times] of hits)
        if (times.every((time) => now - time >= windowMs)) hits.delete(k)
    }
    return true
  }
}
