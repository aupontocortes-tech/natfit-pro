type OtpRecord = { code: string; expiresAt: number }

const store = new Map<string, OtpRecord>()

export function setOtp(email: string, code: string, ttlMs = 10 * 60 * 1000) {
  const key = email.trim().toLowerCase()
  store.set(key, { code, expiresAt: Date.now() + ttlMs })
}

export function getOtp(email: string): OtpRecord | undefined {
  const key = email.trim().toLowerCase()
  const rec = store.get(key)
  if (!rec) return undefined
  if (Date.now() > rec.expiresAt) {
    store.delete(key)
    return undefined
  }
  return rec
}

export function clearOtp(email: string) {
  const key = email.trim().toLowerCase()
  store.delete(key)
}