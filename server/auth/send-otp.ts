import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'
import { setOtp } from '../../../lib/otpStore'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email } = req.body || {}
  if (!email || typeof email !== 'string') return res.status(400).json({ error: 'Email inválido' })

  const apiKey = process.env.RESEND_API_KEY
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  setOtp(email, code)

  if (!apiKey) {
    console.warn('RESEND_API_KEY não configurada. Modo dev: código gerado e logado no servidor.')
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[OTP DEV] ${email} -> ${code}`)
    }
    return res.status(200).json({ ok: true })
  }

  const resend = new Resend(apiKey)
  try {
    await resend.emails.send({
      from: 'NATFIT PRO <onboarding@resend.dev>',
      to: email,
      subject: 'Seu código de acesso (OTP) - NATFIT PRO',
      text: `Seu código de login é ${code}. Ele expira em 10 minutos.\n\nSe você não solicitou, ignore este e-mail.`,
    })
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[OTP] ${email} -> ${code}`)
    }
    return res.status(200).json({ ok: true })
  } catch (e: any) {
    console.error('Erro ao enviar OTP via Resend:', e)
    return res.status(500).json({ error: 'Falha ao enviar código' })
  }
}