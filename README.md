# Summercamp Score Tracker

A Next.js application for tracking team scores during the Summercamp tournament.

## Features

- Create and manage teams
- Add events and points to teams
- Create multi-team events
- Export team and event data
- Google authentication for admin access
- Responsive design for mobile and desktop

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Upstash Redis
- NextAuth.js
- shadcn/ui components

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sc-scoretracker.git
cd sc-scoretracker
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file with the following variables:
```env
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

MIT 