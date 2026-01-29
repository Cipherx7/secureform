# Deployment Guide

This guide details how to deploy the CyberX Community Platform to Vercel.

## Prerequisites

1.  A [GitHub](https://github.com/) account.
2.  A [Vercel](https://vercel.com/) account (can log in via GitHub).
3.  The project code pushed to your GitHub repository.

## Step 1: Import to Vercel

1.  Log in to your **Vercel Dashboard**.
2.  Click **"Add New..."** -> **"Project"**.
3.  In the "Import Git Repository" section, find your repository (`CyberX-Hiring` or similar) and click **Import**.

## Step 2: Configure Project

Vercel should automatically detect the framework settings:
*   **Framework Preset**: `Next.js`
*   **Root Directory**: `./` (default)
*   **Build Command**: `next build` (default)
*   **Output Directory**: `.next` (default)

## Step 3: Environment Variables (Critical)

You must configure the following environment variables for the application to function correctly.
Expand the **"Environment Variables"** section and add them one by one:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `MONGODB_URI` | Your MongoDB Connection String | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for signing session tokens | `your-super-long-random-secret-key` |
| `DEFAULT_ADMIN_EMAIL` | Email for the initial admin account | `admin@cyberx.com` |
| `DEFAULT_ADMIN_PASSWORD` | Password for the initial admin account | `SecurePassword123!` |
| `NEXTAUTH_URL` | The URL of your deployed app | `https://your-project.vercel.app` (Add this *after* deployment if unknown, or guess it based on project name) |

> **Security Note**: Never commit these values to GitHub. Only set them in the Vercel dashboard.

## Step 4: Deploy

1.  Click **Deploy**.
2.  Wait for the build to complete.
3.  Once finished, you will see a "Congratulations!" screen with a screenshot of your app.

## Step 5: Post-Deployment Setup (First Run)

1.  Visit your new Vercel URL (e.g., `https://cyberx-hiring.vercel.app`).
2.  To set up the admin account, you need to trigger the setup route. Since the setup route now checks for environment variables, it is secure.
3.  Open your browser or a tool like Postman.
4.  Send a request to: `https://your-project.vercel.app/api/setup-admin`
    *   **Method**: `GET`
    *   **Header**: `x-setup-secret` (If you added `SETUP_SECRET` to env vars, otherwise it relies on the header match in the code - *Check `src/app/api/setup-admin/route.js` logic if you changed it*).
    *   *Correction*: In the latest secured version, we removed the hardcoded check and rely on `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` env vars. You just need to visit the URL or hit the endpoint once to initialize the DB if the admin doesn't exist.
    *   Actually, strictly speaking, the code checks `process.env.SETUP_SECRET`. If you didn't set `SETUP_SECRET` in Vercel, you might need to add it or the route might block you.
    *   **Recommendation**: Add `SETUP_SECRET` to your Vercel Environment Variables as well, and use that as the header `x-setup-secret` if you kept that logic.

    *Current Logic Check*: The code checks:
    ```javascript
    const setupSecret = process.env.SETUP_SECRET;
    const authHeader = request.headers.get('x-setup-secret');
    if (!setupSecret || setupSecret !== authHeader) { ... }
    ```
    **Action**: You **MUST** add `SETUP_SECRET` to Vercel env vars and pass it as a header, OR temporarily remove that check in the code if you want public setup (not recommended).

    **To run setup:**
    1. Add `SETUP_SECRET` = `my-temporary-secret` to Vercel Env Vars.
    2. Run: `curl -H "x-setup-secret: my-temporary-secret" https://your-project.vercel.app/api/setup-admin`

5.  Login at `/hot_admin` with the credentials you set in `DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD`.

## troubleshooting

- **500 Error on Login**: Check `MONGODB_URI` and `JWT_SECRET`.
- **Database Connection Error**: Ensure your MongoDB Atlas IP Access List allows access from anywhere (`0.0.0.0/0`) since Vercel IPs are dynamic.
