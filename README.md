# Provably Fair Keno Game

A beautiful and engaging Keno game with Supabase authentication and provably fair gameplay.

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your Supabase credentials:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase project's anon/public key

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## Features

- Supabase Authentication
- Three difficulty levels
- Provably fair gameplay
- Real-time balance updates
- Beautiful UI/UX