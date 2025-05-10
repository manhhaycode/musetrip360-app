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

GitHub provides two types of secrets for managing sensitive information:

- **GitHub Environment Secrets**: These are tied to specific environments (e.g., `production`) and are used to manage secrets that vary between environments. They are ideal for deployment-related secrets.
- **Repository Secrets**: These are repository-wide and are not tied to any specific environment. They are suitable for secrets that apply globally across the repository.
### GitHub Environment Secrets

This project uses GitHub Environment Secrets for deployment. You need to:

1. Create an environment named `production` in your GitHub repository

   - Go to your repository → Settings → Environments → New environment
   - Name it `production`

2. Add the following secrets to the `production` environment:

   a. **`VERCEL_TOKEN`**: Your Vercel API token

   - Generate from Vercel dashboard → Settings → Tokens

   b. **`VERCEL_ORG_ID`**: Your Vercel organization ID

   - Found in Vercel dashboard → Settings → General → Organization ID

   c. **`VERCEL_PROJECT_ID_WEB`**: Project ID for the web application

   - Found in Vercel dashboard → Select web project → Settings → General → Project ID

   d. **`VERCEL_PROJECT_ID_DOCS`**: Project ID for the docs application

   - Found in Vercel dashboard → Select docs project → Settings → General → Project ID

### Repository Secrets

1. **`TURBO_TOKEN`** (optional): Token for Turborepo remote caching
   - Generate from Vercel dashboard → Settings → Tokens
   - This can be added as a regular repository secret

### GitHub Variables

1. **`TURBO_TEAM`** (optional): Your team name for Turborepo remote caching
   - Usually your Vercel account or team name
   - Add this as a repository variable

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

### Common Issues

#### Missing Vercel Token

Error: `VERCEL_TOKEN is not set. Please add it to your repository secrets.`

Solution:

1. Go to Vercel dashboard → Settings → Tokens
2. Create a new token with appropriate permissions
3. Add it to your GitHub repository's `production` environment secrets as `VERCEL_TOKEN`
   - Go to your repository → Settings → Environments → production → Add secret

#### Authentication Errors

Error: `Error: You defined "--token", but it's missing a value`

Solution:

1. Check that your `VERCEL_TOKEN` secret is correctly set in the `production` environment
2. Ensure the token has not expired
3. Regenerate the token if necessary
4. Verify that your workflow is using the `environment: production` setting

#### Project ID Issues

Error: `Error: The project you're trying to access does not exist or you don't have access to it.`

Solution:

1. Verify the project IDs in your Vercel dashboard
2. Make sure you're using the correct organization ID
3. Check that your token has access to the projects
4. Ensure that the project IDs are correctly set in the `production` environment secrets

## Future Improvements

- Add automated testing
- Implement deployment approval process
- Add notifications for deployment status
- Configure environment-specific variables
