# Deployment Guide

## Recommended Production Setup

- Frontend: Vercel, Netlify, or Nginx static hosting.
- Backend: Render, Railway, Fly.io, AWS ECS, or a VPS.
- Database: Managed PostgreSQL.
- Cache: Managed Redis.
- Storage: S3-compatible bucket for profile images and recipe media.

## Environment Variables

Backend:

- `DATABASE_URL`
- `REDIS_URL`
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `CORS_ORIGINS`

Frontend:

- `VITE_API_URL`

## Production Checklist

- Replace demo `SECRET_KEY`.
- Enable HTTPS.
- Configure CORS to the deployed frontend domain.
- Run database migrations before seeding.
- Use a real SMTP provider for verification and password reset emails.
- Put API rate limiting behind Redis.
- Serve uploaded media through object storage/CDN.
- Run frontend Lighthouse checks on mobile and desktop.

