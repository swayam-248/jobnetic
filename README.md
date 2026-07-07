# Jobnetic

AI-powered full-stack job search platform.

## Local setup

### Server

1. Go to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `server/.env` from `server/.env.example` and fill in your values.
4. Start the backend:
   ```bash
   npm run dev
   ```

### Client

1. Go to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `client/.env` from `client/.env.example`.
4. Start the frontend:
   ```bash
   npm run dev
   ```

## Environment variables

### Server

- `PORT`
- `NODE_ENV`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

### Client

- `VITE_API_URL`
