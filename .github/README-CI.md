# CI Pipeline for MuseTrip360

This document explains how to set up and use the CI pipeline for the MuseTrip360 project.

## Overview

The CI pipeline is implemented using GitHub Actions. It automates the following processes:

1. **Continuous Integration (CI)**:
   - Dependency installation
   - Linting
   - Building
   - (Future: Testing)

## Required Secrets and Variables

To set up the CI pipeline, you need to configure the following secrets and variables in your GitHub repository:

### Repository Secrets

1. **`TURBO_TOKEN`** (optional): Token for Turborepo remote caching
   - Generate from Vercel dashboard → Settings → Tokens
   - This can be added as a regular repository secret

### GitHub Variables

1. **`TURBO_TEAM`** (optional): Your team name for Turborepo remote caching
   - Usually your Vercel account or team name
   - Add this as a repository variable

## How the Pipeline Works

### On Pull Requests

1. The pipeline runs the CI steps (install, lint, build)
2. Build artifacts are stored for potential manual deployment

### On Merge to Main

1. The pipeline runs the CI steps (install, lint, build)
2. Build artifacts are stored for potential manual deployment

### Manual Trigger

You can also manually trigger the workflow from the GitHub Actions tab.

## Troubleshooting

If you encounter issues with the CI pipeline:

1. Check the GitHub Actions logs for detailed error messages
2. Verify that all required secrets and variables are correctly set
3. Check that your build commands are working correctly

### Common Issues

#### Build Failures

Error: `Web build failed or output directory not found`

Solution:

1. Check that your Next.js configuration is correct
2. Ensure all dependencies are properly installed
3. Verify that the build command works locally

#### Linting Errors

Error: `Command failed with exit code 1` during lint step

Solution:

1. Run the lint command locally to identify the issues
2. Fix the linting errors in your code
3. Commit the changes and push again

## Future Improvements

- Add automated testing
- Add code coverage reporting
- Implement code quality checks
- Add performance benchmarking
