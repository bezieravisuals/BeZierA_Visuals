# BeZierA

Public website: `http://beziera_visuals.com/`

Premium creative technology studio website with a React/Vite frontend and Express REST API.

## Run in Visual Studio

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set `JWT_SECRET` and `MONGODB_URI`.
4. Run `npm run dev`.
5. Open `http://localhost:5173`.

The API runs at `http://localhost:4000`. It uses an in-memory store when MongoDB is not running, so the demo can be explored immediately. The production integration point is `server/server.js`, where the suggested User, Project, Portfolio, Message and ProjectActivity collections can be wired to Mongoose.

Demo admin: `admin` / `BeZierA2026!`

API: `GET /api/health`, `GET /api/portfolio`, `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/projects`, `POST /api/projects`, `PATCH /api/projects/:id`, `POST /api/contact`, `GET /api/admin/analytics`.
