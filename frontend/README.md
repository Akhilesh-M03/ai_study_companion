# ai_study_companion

## How to run the Frontend locally

If you have Node.js installed, you can run this project on your laptop by following these steps:

1. **Pull the latest code**

   ```bash
   git pull origin main
   ```

2. **Navigate into the frontend folder**

   ```bash
   cd frontend
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Optional: configure API base URL for deployed builds**

   ```bash
   copy .env.example .env
   ```

   By default, local development uses `/api` and Vite proxies requests to `http://localhost:8000`.

5. **Start the development server**
   ```bash
   npm run dev
   ```

Once the server is running, open your browser and go to http://localhost:5173.

## Backend integration notes

- Dev proxy: `vite.config.js` forwards `/api/*` to `http://localhost:8000/*`.
- Auth: login/signup use JSON payloads; protected APIs require `Authorization: Bearer <token>`.
- Make sure backend is running before opening quiz/chat/report/profile flows.
