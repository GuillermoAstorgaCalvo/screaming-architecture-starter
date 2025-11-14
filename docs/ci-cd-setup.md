# CI/CD Setup Guide

This guide explains how the CI/CD pipeline works, how to set it up for your project, and how to customize it for your needs.

## 📋 Table of Contents

- [Overview](#overview)
- [How the CI Pipeline Works](#how-the-ci-pipeline-works)
- [Setting Up CI for Your Project](#setting-up-ci-for-your-project)
- [Workflow Details](#workflow-details)
- [Customizing Workflows](#customizing-workflows)
- [Adding New Checks](#adding-new-checks)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Overview

This project uses **GitHub Actions** for continuous integration and deployment. The CI/CD setup includes:

- **Main CI Pipeline** (`.github/workflows/ci.yml`): Runs on every push and pull request to `main` and `develop` branches
- **Nightly Pipeline** (`.github/workflows/nightly.yml`): Runs scheduled checks including E2E tests and Lighthouse audits

### Pipeline Checks

The main CI pipeline validates:

- ✅ **TypeScript type checking** - Ensures code is type-safe
- ✅ **ESLint linting** - Enforces code quality and module boundaries
- ✅ **Unit tests with coverage** - Validates functionality
- ✅ **Build verification** - Ensures the project builds successfully
- ✅ **Bundle size checks** - Prevents bundle size regressions

## How the CI Pipeline Works

### Workflow Triggers

The CI pipeline runs automatically when:

1. **Push events**: Code is pushed to `main` or `develop` branches
2. **Pull requests**: PRs are opened or updated targeting `main` or `develop`

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

### Concurrency Control

The pipeline uses concurrency groups to cancel in-progress runs when new commits are pushed:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

This prevents wasted CI minutes and ensures only the latest commit is tested.

### Pipeline Steps

The CI pipeline executes the following steps in sequence:

1. **Checkout code** - Retrieves the repository code
2. **Setup pnpm** - Installs the specified pnpm version (10.22.0)
3. **Setup Node.js** - Installs Node.js 22.21.1 with pnpm cache
4. **Install dependencies** - Runs `pnpm install --frozen-lockfile`
5. **Typecheck** - Runs `pnpm run typecheck`
6. **Lint** - Runs `pnpm run lint`
7. **Run tests** - Runs `pnpm run test:coverage` and uploads coverage artifacts
8. **Build** - Runs `pnpm run build`
9. **Check bundle size** - Runs `pnpm run check:bundle-size`
10. **CI Summary** - Generates a summary report

### Security

The workflow uses explicit, minimal permissions following the principle of least privilege:

```yaml
permissions:
  contents: read
  pull-requests: read
```

### Timeout Protection

Each job has a timeout to prevent runaway processes:

```yaml
timeout-minutes: 30
```

## Setting Up CI for Your Project

### Prerequisites

1. **GitHub repository** with Actions enabled
2. **Node.js 22.21.1** (or compatible version)
3. **pnpm 10.22.0** (or compatible version)

### Initial Setup

1. **Verify workflows exist**: Ensure `.github/workflows/ci.yml` and `.github/workflows/nightly.yml` are present

2. **Configure branch protection** (recommended):
   - Go to your repository Settings → Branches
   - Add branch protection rules for `main` and `develop`
   - Require status checks to pass before merging
   - Require branches to be up to date before merging

3. **Test the pipeline**:
   - Create a test branch: `git checkout -b test/ci-setup`
   - Make a small change and push: `git push origin test/ci-setup`
   - Open a PR to `develop` and verify CI runs

### Required Secrets (Optional)

For advanced features, you may need to configure secrets:

- **Lighthouse CI** (for nightly audits): `LHCI_GITHUB_APP_TOKEN`
  - Go to Settings → Secrets and variables → Actions
  - Add a new repository secret with your Lighthouse CI token

### Environment Variables

The pipeline sets these environment variables automatically:

```yaml
env:
  CI: true
  NODE_ENV: test  # or 'production' for nightly builds
```

## Workflow Details

### Main CI Workflow (`.github/workflows/ci.yml`)

**Purpose**: Validates code quality and build integrity on every push/PR

**Runs on**: `ubuntu-latest`

**Steps**:
- Typecheck, lint, test, build, bundle size check

**Artifacts**:
- Test coverage reports (retained for 7 days)

### Nightly Workflow (`.github/workflows/nightly.yml`)

**Purpose**: Runs comprehensive checks that are too slow for every PR

**Runs on**: Schedule (3 AM UTC daily) or manual trigger

**Jobs**:
- **E2E Tests** (currently disabled): Runs Playwright tests
- **Lighthouse Audit**: Performance and accessibility audits

**Artifacts**:
- Playwright reports (if enabled)
- Lighthouse reports (retained for 30 days)

## Customizing Workflows

### Modifying Existing Steps

To modify an existing step, edit the workflow file:

```yaml
# Example: Change the Node.js version
- name: Setup Node.js
  uses: actions/setup-node@v6
  with:
    node-version: 22.21.1  # Change this version
    cache: 'pnpm'
```

### Adding Environment Variables

Add project-specific environment variables:

```yaml
env:
  CI: true
  NODE_ENV: test
  MY_CUSTOM_VAR: ${{ secrets.MY_CUSTOM_VAR }}  # Add your variable
```

### Changing Triggers

Modify when workflows run:

```yaml
on:
  push:
    branches: [main, develop, 'release/**']  # Add more branches
  pull_request:
    branches: [main, develop]
  workflow_dispatch:  # Allow manual triggering
```

### Adjusting Timeouts

Change job timeouts based on your needs:

```yaml
timeout-minutes: 45  # Increase for slower builds
```

### Modifying Bundle Size Thresholds

The bundle size check uses default thresholds. To customize:

1. Edit `scripts/check-bundle-size.js` to change default thresholds
2. Or pass arguments in the workflow:

```yaml
- name: Check bundle size
  run: pnpm run check:bundle-size --max-main-kb=250 --max-css-kb=120
```

## Adding New Checks

### Adding a New Step to CI

To add a new validation step:

1. **Add the step** after an existing step in `.github/workflows/ci.yml`:

```yaml
- name: Your New Check
  id: your-check
  run: pnpm run your-check-command
  continue-on-error: false  # Set to true if it's optional
```

2. **Update the summary** to include your check:

```yaml
- name: CI Summary
  if: always()
  run: |
    echo "| Your Check | ${{ steps.your-check.outcome == 'success' && '✅ Passed' || '❌ Failed' }} |" >> $GITHUB_STEP_SUMMARY
```

### Adding a New Job

For checks that should run in parallel:

```yaml
jobs:
  ci:
    # ... existing job ...
  
  your-new-job:
    name: Your New Job
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: read
    steps:
      - name: Checkout code
        uses: actions/checkout@v5
      # ... your steps ...
```

### Adding a New Workflow

Create a new file in `.github/workflows/`:

```yaml
name: Your New Workflow

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  your-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      # ... your steps ...
```

### Example: Adding Security Scanning

```yaml
- name: Run security audit
  id: security-audit
  run: pnpm audit --audit-level=high
  continue-on-error: false
```

### Example: Adding Dependency Review

```yaml
- name: Dependency Review
  uses: actions/dependency-review-action@v4
  if: github.event_name == 'pull_request'
  with:
    fail-on-severity: moderate
```

### Example: Adding Code Coverage Upload

```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
  with:
    files: ./coverage/coverage-final.json
    flags: unittests
    name: codecov-umbrella
```

## Troubleshooting

### CI Fails Locally but Passes in CI

- **Check Node.js version**: Ensure local version matches CI (22.21.1)
- **Check pnpm version**: Ensure local version matches CI (10.22.0)
- **Clear caches**: Run `pnpm store prune` and reinstall
- **Check lockfile**: Ensure `pnpm-lock.yaml` is committed

### CI Fails with "frozen-lockfile" Error

- **Update lockfile**: Run `pnpm install` locally and commit `pnpm-lock.yaml`
- **Check for conflicts**: Resolve any merge conflicts in `pnpm-lock.yaml`

### Tests Pass Locally but Fail in CI

- **Check environment variables**: Ensure all required env vars are set in CI
- **Check file paths**: CI uses absolute paths; ensure relative paths work
- **Check timing**: Some tests may be flaky; add retries or increase timeouts

### Bundle Size Check Fails

- **Review recent changes**: Check what dependencies or code was added
- **Run bundle analyzer**: `VITE_ANALYZE=true pnpm run build`
- **Check for duplicates**: Look for duplicate dependencies
- **Adjust thresholds**: If the increase is justified, update thresholds

### Workflow Not Running

- **Check Actions tab**: Verify Actions are enabled for your repository
- **Check branch**: Ensure you're pushing to a branch that triggers the workflow
- **Check workflow file**: Verify YAML syntax is valid
- **Check permissions**: Ensure GitHub Actions has necessary permissions

### Nightly Workflow Not Running

- **Check schedule**: Verify the cron expression is correct
- **Check timezone**: Cron uses UTC; adjust if needed
- **Manual trigger**: Use `workflow_dispatch` to test manually

## Best Practices

### Performance

1. **Use caching**: The workflow caches pnpm dependencies automatically
2. **Parallel jobs**: Split slow checks into separate parallel jobs
3. **Conditional steps**: Use `if` conditions to skip unnecessary steps
4. **Artifact retention**: Set appropriate retention days to save storage

### Security

1. **Minimal permissions**: Always use the least privilege principle
2. **Secrets management**: Never hardcode secrets; use GitHub Secrets
3. **Dependency updates**: Keep actions and dependencies up to date
4. **Lockfile**: Always commit `pnpm-lock.yaml` for reproducible builds

### Maintainability

1. **Clear step names**: Use descriptive names for steps and jobs
2. **Error handling**: Use `continue-on-error` appropriately
3. **Summaries**: Add summary steps for better visibility
4. **Documentation**: Document any custom workflows or checks

### Testing Workflows

1. **Test locally first**: Run commands locally before adding to CI
2. **Use test branches**: Test workflow changes on feature branches
3. **Manual triggers**: Add `workflow_dispatch` for easy testing
4. **Incremental changes**: Make small, testable changes

### Monitoring

1. **Check regularly**: Review CI runs for patterns or issues
2. **Track metrics**: Monitor build times and failure rates
3. **Update dependencies**: Keep Node.js, pnpm, and actions updated
4. **Review artifacts**: Check coverage and bundle size trends

## Related Documentation

- [Contributing Guide](../.github/CONTRIBUTING.md) - Workflow and branching model
- [Testing Guide](./testing.md) - Testing strategy and best practices
- [Release Hygiene](../.cursor/rules/quality/release-hygiene.mdc) - Release process and CI gates
- [CI/CD Readiness](../.cursor/rules/quality/ci-cd.mdc) - Required and optional pipelines

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [pnpm Documentation](https://pnpm.io/)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)

