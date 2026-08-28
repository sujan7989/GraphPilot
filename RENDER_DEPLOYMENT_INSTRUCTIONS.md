# Render Backend Deployment Instructions

## Current Status

The backend on Render has NOT automatically redeployed with the latest code. The `render.yaml` file was added but Render may not be configured to use it for automatic deployments.

## Manual Redeployment Steps

### Option 1: Trigger via Render Dashboard (Recommended)

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Navigate to your `graphpilot-backend` service
3. Click "Manual Deploy" in the top right
4. Select "Deploy latest commit"
5. Wait for deployment to complete (2-5 minutes)

### Option 2: Connect GitHub Repository to Render

If your Render service is not connected to GitHub:

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `sujan7989/GraphPilot`
4. Configure:
   - **Name**: graphpilot-backend
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `COGNODB_URI` - Your CognoDB connection string
   - `COGNODB_USERNAME` - Your CognoDB username
   - `COGNODB_PASSWORD` - Your CognoDB password
   - `OPENAI_API_KEY` - Your OpenAI API key (optional)
   - `CORS_ORIGINS` - `https://graph-pilot.vercel.app`
6. Deploy

### Option 3: Use Render CLI

```bash
# Install Render CLI
npm install -g @renderinc/render

# Login
render login

# Link your service
render link graphpilot-backend

# Trigger redeploy
render deploy
```

## Verification After Deployment

Once the backend has redeployed, verify:

```bash
# Test impact-analysis endpoint
curl -X POST https://graphpilot.onrender.com/api/graph/impact-analysis \
  -H "Content-Type: application/json" \
  -d '{"service_id": "svc-payment", "depth": 2}'
```

Expected response (200 OK):
```json
{
  "target_service": "svc-payment",
  "affected_services": [...],
  "total_affected": 0,
  "max_hops": 2
}
```

## Latest Backend Changes

### Commit 7130eef
- Added graceful error handling for impact-analysis
- Returns 200 with error message instead of 500
- Backend logs actual errors for debugging

### Commit 78cc3b0
- Added service existence validation
- Improved error logging
- Fixed render.yaml build command

### Commit ae8f497
- Fixed impact-analysis endpoint to use typed request
- Added proper request validation

## Frontend Status

The frontend on Vercel should automatically rebuild with the latest changes (commit ae8f497) which fixes the 404 errors by using the correct API_BASE in production.

## Summary

- **Frontend**: Should work after Vercel rebuild (automatic)
- **Backend**: Needs manual redeploy on Render (not automatic)
- **Impact Analysis**: Will work after backend redeploy
- **All other endpoints**: Already working on production backend

## Contact

If you need assistance with Render deployment, refer to:
- [Render Documentation](https://render.com/docs)
- [Render GitHub Integration](https://render.com/docs/deploy-git-repo)
