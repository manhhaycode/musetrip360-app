# CI/CD Pipeline for MuseTrip360

This document explains how to set up and use the CI/CD pipeline for the MuseTrip360 project.

## Overview

The CI/CD pipeline is implemented using GitHub Actions and Vercel. It automates the following processes:

1. **Continuous Integration (CI)**:
   - Dependency installation
   - Linting
   - Building
   - (Future: Testing)

2. **Continuous Deployment (CD)**:
   - Automatic deployment to Vercel for both web and docs applications
   - Production deployments on merges to the main branch
   - Preview deployments for pull requests

## Required Secrets and Variables

To set up the CI/CD pipeline, you need to configure the following secrets and variables in your GitHub repository:

### GitHub Secrets

1. **`VERCEL_TOKEN`**: Your Vercel API token
   - Generate from Vercel dashboard → Settings → Tokens

2. **`VERCEL_ORG_ID`**: Your Vercel organization ID
   - Found in Vercel dashboard → Settings → General → Organization ID

3. **`VERCEL_PROJECT_ID_WEB`**: Project ID for the web application
   - Found in Vercel dashboard → Select web project → Settings → General → Project ID

4. **`VERCEL_PROJECT_ID_DOCS`**: Project ID for the docs application
   - Found in Vercel dashboard → Select docs project → Settings → General → Project ID

5. **`TURBO_TOKEN`** (optional): Token for Turborepo remote caching
   - Generate from Vercel dashboard → Settings → Tokens

### GitHub Variables

1. **`TURBO_TEAM`** (optional): Your team name for Turborepo remote caching
   - Usually your Vercel account or team name

## Setting Up Vercel Projects

1. Create two projects in Vercel:
   - One for the web application (`apps/web`)
   - One for the docs application (`apps/docs`)

2. For each project:
   - Link to your GitHub repository
   - Set the root directory to the respective app folder
   - Configure the build settings according to the `vercel.json` files
   - Disable automatic deployments (they will be handled by GitHub Actions)

## How the Pipeline Works

### On Pull Requests

1. The pipeline runs the CI steps (install, lint, build)
2. No automatic deployment occurs

### On Merge to Main

1. The pipeline runs the CI steps (install, lint, build)
2. If successful, it deploys both applications to Vercel production

### Manual Trigger

You can also manually trigger the workflow from the GitHub Actions tab.

## Troubleshooting

If you encounter issues with the CI/CD pipeline:

1. Check the GitHub Actions logs for detailed error messages
2. Verify that all required secrets and variables are correctly set
3. Ensure your Vercel token has the necessary permissions
4. Check that your Vercel projects are correctly configured

## Future Improvements

- Add automated testing
- Implement deployment approval process
- Add notifications for deployment status
- Configure environment-specific variables
