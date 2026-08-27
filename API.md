# SMARTLIGHT API

Base URL:
http://localhost:5000/api

## Public

GET /health
GET /services
GET /services/:slug
POST /auth/register
POST /auth/login
POST /contact

## Authenticated

GET /auth/me
GET /requests
POST /requests
GET /requests/:id

Use:
Authorization: Bearer YOUR_TOKEN

## Admin

GET /admin/stats
GET /admin/users
GET /admin/requests
PATCH /admin/requests/:id
POST /admin/services
PATCH /admin/services/:id
DELETE /admin/services/:id
GET /admin/messages
PATCH /admin/messages/:id

Admin routes require a JWT belonging to a user whose role is `admin`.

## Notes

This backend intentionally does not contain payment integration.

For production, use HTTPS, a strong JWT secret, a restricted MongoDB user, a restricted CORS origin, and secure deployment secrets.
