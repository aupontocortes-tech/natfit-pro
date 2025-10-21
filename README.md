# NatFit Pro (ShadCN Demo)

Projeto Next.js com Tailwind CSS e componentes shadcn-ui, servindo como base para o app NatFit Pro.

## Stack
- Next.js
- React
- Tailwind CSS
- shadcn-ui

## Requisitos
- Node.js 18+ (recomendado)
- npm (ou pnpm/yarn)

## Como rodar localmente
```bash
# clonar o repo (se ainda não tiver local)
# git clone https://github.com/aupontocortes-tech/natfitpro.git

cd shadcn-demo
npm install
npm run dev
# app em http://localhost:3000
```

## Rotas principais
- `/` — Home
- `/app` — Área principal
- `/servicos` — Serviços (NatFit Pro - Serviços)
- `/empresa` — Página da empresa
- `/admin` — Admin
- `/aluno` — Área do aluno
- `/login` — Login

## Branding
O branding foi padronizado para "NatFit Pro" em cabeçalhos e títulos principais.

## Variáveis de ambiente (opcional)
O projeto atual não depende de variáveis obrigatórias. Caso queira configurar valores públicos:
```
# .env.local (exemplos)
NEXT_PUBLIC_SITE_NAME=NatFit Pro
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Build
```bash
npm run build
npm run start
```

## Deploy (Vercel)
1. Acesse https://vercel.com e faça login.
2. Clique em "Add New" → "Project" e selecione o repositório `aupontocortes-tech/natfitpro`.
3. Framework: Next.js (detectado automaticamente).
4. Build Command: `npm run build` (padrão). Output: `.next`.
5. (Opcional) Adicione variáveis em "Environment Variables".
6. Clique em Deploy. A cada push em `main`, o deploy será atualizado.

## Convenções
- Branch principal: `main`.
- Commits semânticos quando possível (ex.: `chore:`, `feat:`, `fix:`).

## Suporte
Em caso de dúvidas, abra uma issue no repositório ou entre em contato com os responsáveis pelo projeto.