# Backend

Express + MongoDB API for the task manager.

## Setup

1. Copy `.env.example` to `.env`
2. Install dependencies with `npm install`
3. Run `npm run dev`

## Environment

Do not commit `.env` or any real secrets to GitHub.

Required local values:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_INVITE_CODE`
- `FRONTEND_URL`
- `SEED_ADMIN_NAME`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

## Uploads

Profile images are stored locally in `backend/uploads/` during development. The folder is ignored by Git and will be created automatically when the server starts.

## Important routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`
- `GET /api/users` for admin
- `PATCH /api/users/me/avatar` for profile uploads
