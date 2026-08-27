# SMARTLIGHT Full Stack - TypeScript + Next.js

## Start backend

1. Create `backend/.env` from `.env.example` and set your MongoDB URI and a JWT secret of at least 32 characters.
2. Set `CLIENT_URL=http://localhost:3000`.
3. From `backend`:

```bash
npm install
npm run seed
npm run dev
```

Backend: `http://localhost:5000`

## Start frontend

From `frontend`:

```bash
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## Login

Customer: `http://localhost:3000/login`
Admin: `http://localhost:3000/admin/login`

Seeded admin:
- Email: `admin@smartlight.ng`
- Password: `@Edemattoe1`

Change the seeded password before production use.

## Admin controls

The administrator control centre manages:
- users and administrator roles
- customer service requests and statuses
- public services (create, edit, activate/deactivate)
- dashboard statistics

Authentication uses the backend HTTP-only cookie; the frontend sends requests with credentials enabled.
