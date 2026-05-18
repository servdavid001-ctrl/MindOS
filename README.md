# MindOS

Sistema de pensamiento asistido por IA completamente privado y auto-soberano.

## Stack

- Next.js 15 (App Router)
- Supabase (Auth + DB + Storage)
- Tailwind CSS + shadcn/ui
- Vercel (Deploy)
- Konva.js (Canvas interactivo)
- pgvector (RAG)
- ElevenLabs/OpenAI TTS (Voz)

## Autorización

- Email + Password + MFA TOTP obligatorio
- Gestión de sesiones por dispositivo
- RLS en todas las tablas
- Cifrado AES-256-GCM para API keys

## Estructura

- `/login` - Página de inicio de sesión
- `/login/mfa` - Verificación MFA
- `/login/mfa/setup` - Configuración MFA
- `/dashboard` - Dashboard principal
- `/settings/devices` - Gestión de dispositivos

## Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MASTER_KEY=
NEXT_PUBLIC_APP_URL=
```

## Comandos

```bash
pnpm dev
pnpm build
pnpm start
```