# Task Manager
(live loom video demo )
https://www.loom.com/share/900e36b352c042f58469595724422da1  
This workspace contains two independent projects:

* `backend/` - Node.js, Express.js, MongoDB, JWT auth
* `frontend/` - React.js with Vite

## Backend setup

1. `cd backend`
2. Copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret.
3. Run `npm install`
4. Start the API with `npm run dev`

## GitHub safety

* Keep `.env` files out of Git.
* Keep generated uploads out of Git.
* Use the `.env.example` files as templates only.
* Do not add passwords, tokens, or database connection strings to the repository.

## Required env values

* `PORT`
* `MONGODB_URI`
* `JWT_SECRET`
* `ADMIN_INVITE_CODE`
* `FRONTEND_URL`
* `SEED_ADMIN_NAME`
* `SEED_ADMIN_EMAIL`
* `SEED_ADMIN_PASSWORD`

## Frontend setup

1. `cd frontend`
2. Copy `.env.example` to `.env` if you want a custom API URL.
3. Run `npm install`
4. Start the Vite app with `npm run dev`

## Required env values

* `VITE_API_URL`

## Features implemented

* User registration and login
* JWT authentication
* Protected routes
* Role support for admin and user
* Hashed, one-time admin invite codes created from the admin dashboard
* Task create, update, delete, view, and status toggle
* Responsive UI inspired by the provided screenshots
* MongoDB-backed user and task schemas

## Notes

* Admins can generate invite codes from the dashboard. The database stores only the hash, and the plain code is shown once when created.
* The app uses bearer tokens stored in local storage for session persistence.
* The seed script now creates only one admin account from backend env vars, so old demo users are removed when you reseed.
* Profile photos are uploaded locally during development and are not committed to Git.
