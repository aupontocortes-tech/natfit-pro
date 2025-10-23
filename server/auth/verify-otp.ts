import type { NextApiRequest, NextApiResponse } from 'next'
import { getOtp, clearOtp } from '../../lib/otpStore'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, code } = req.body || {}
  if (!email || typeof email !== 'string' || !code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Parâmetros inválidos' })
  }
  const rec = getOtp(email)
  if (!rec) return res.status(400).json({ ok: false, error: 'Código expirado ou não encontrado' })
  const ok = rec.code === code.trim()
  if (!ok) return res.status(401).json({ ok: false, error: 'Código incorreto' })
  clearOtp(email)
  return res.status(200).json({ ok: true })
}