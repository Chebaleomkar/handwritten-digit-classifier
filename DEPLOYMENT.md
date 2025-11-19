# Deployment Guide

## Backend Deployment (Render)

### Option 1: Using Render Blueprint (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Blueprint**
3. Connect your GitHub repository: `Chebaleomkar/handwritten-digit-classifier`
4. Render will detect `render.yaml` and configure everything automatically
5. Click **Apply** to deploy

### Option 2: Manual Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `handwritten-digit-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Docker`
   - **Plan**: Free
   - **Health Check Path**: `/model_info`
5. Click **Create Web Service**

### After Deployment
- Render will provide a URL like: `https://handwritten-digit-backend.onrender.com`
- Test it by visiting: `https://your-url.onrender.com/model_info`
- Copy this URL for frontend configuration

---

## Frontend Deployment (Vercel)

### Prerequisites
- Update the API URL in frontend before deploying

### Steps
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add Environment Variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-url.onrender.com` (from backend deployment)
6. Click **Deploy**

---

## Local Docker Testing

Before deploying, test locally with Docker:

```bash
# Build and run with docker-compose
docker-compose up --build

# Access:
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

---

## Troubleshooting

### Backend Issues
- **Models not loading**: Ensure `.keras` files are in `backend/models/` directory
- **Port binding error**: Render assigns dynamic ports; ensure Dockerfile uses `${PORT:-8000}`
- **Import errors**: Check `backend/custom_metrics.py` exists and is properly imported

### Frontend Issues
- **API connection failed**: Verify `NEXT_PUBLIC_API_URL` environment variable
- **Build errors**: Run `npm run build` locally first to catch issues
- **CORS errors**: Backend already has CORS enabled with `allow_origins=["*"]`

### Docker Issues
- **Large image size**: Models are included; this is expected
- **Build failures**: Check `.dockerignore` files are properly configured
