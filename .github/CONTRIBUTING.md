# Contributing Guide

Thank you for your interest in contributing to the Screaming Architecture Starter! This guide will help you understand our workflow, branching model, and coding standards.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Workflow](#workflow)
- [Branching Model](#branching-model)
- [Pull Requests](#pull-requests)
- [Coding Standards](#coding-standards)
- [Commits](#commits)
- [Testing](#testing)
- [Documentation](#documentation)

## 🚀 Getting Started

1. **Fork the repository** (if contributing externally)
2. **Clone your fork** and set up the upstream remote:
   ```bash
   git clone https://github.com/YOUR_USERNAME/screaming-architecture-starter.git
   cd screaming-architecture-starter
   git remote add upstream https://github.com/ORIGINAL_OWNER/screaming-architecture-starter.git
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Create a branch** from `develop`:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

## 🔄 Workflow

1. **Create a branch** from `develop` following the [branching model](#branching-model)
2. **Implement changes** following folder boundaries and conventions
3. **Add tests** and update documentation
4. **Open a PR** to `develop` with a clear description and checklist
5. **Maintainers review** and provide feedback
6. **After approval**, maintainers will merge (typically via squash merge)

### For Maintainers

- Periodically create `release/*` branches from `develop` and PR them to `main`
- Urgent fixes go via `hotfix/*` from `main`, then back-merge to `develop`

## 🌳 Branching Model

### Main Branches

- **`main`**: Production-ready code, tagged releases only. Protected branch.
- **`develop`**: Integration branch for the next release. Protected branch.

### Feature Branches

- **`feature/<scope>`**: New features
  - Branch from: `develop`
  - PR to: `develop`
  - Example: `feature/auth-login`

- **`fix/<scope>`**: Non-urgent bug fixes
  - Branch from: `develop`
  - PR to: `develop`
  - Example: `fix/landing-hero-image`

- **`chore/<scope>`**: Tooling, dependencies, maintenance
  - Branch from: `develop`
  - PR to: `develop`
  - Example: `chore/update-dependencies`

### Release Branches

- **`release/<version>`**: Stabilization for release
  - Branch from: `develop`
  - PR to: `main` (and then merge back to `develop`)
  - Example: `release/1.2.0`

### Hotfix Branches

- **`hotfix/<version>`**: Critical production fixes
  - Branch from: `main`
  - PR to: `main` (and then merge back to `develop`)
  - Example: `hotfix/1.1.1`

## 🔀 Pull Requests

### PR Checklist

Before submitting a PR, ensure:

- [ ] Code follows project conventions and coding standards
- [ ] All tests pass (`pnpm run test`)
- [ ] Type checking passes (`pnpm run typecheck`)
- [ ] Linting passes (`pnpm run lint`)
- [ ] No build errors (`pnpm run build`)
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated (if applicable)
- [ ] PR description is clear and follows the template
- [ ] Architectural boundaries are respected (see `boundaries.mdc`)

### PR Description

Use the PR template provided in `.github/PULL_REQUEST_TEMPLATE.md`. Include:

- Clear description of changes
- Type of change (bug fix, feature, etc.)
- Related issues
- Testing instructions
- Screenshots (if UI changes)

### PR Targets

- Feature/fix/chore → `develop`
- Release → `main` (and then merge back to `develop`)
- Hotfix → `main` (and then merge back to `develop`)

### Merge Strategy

- **Feature/fix/chore PRs**: Prefer squash merge
- **Release/hotfix PRs**: Keep history explicit (no squash) if changelog relies on it
- **Keep branches up to date**: Rebase on `develop` before merge to avoid noisy merges

## 💻 Coding Standards

### Architecture

- **Follow folder boundaries**: See `.cursor/rules/boundaries.mdc`
- **Keep domains self-contained**: Domain code should not depend on UI framework details
- **Use TypeScript**: Maintain type safety throughout
- **Respect module boundaries**: Follow allowed import rules

### Code Style

- **ESLint**: Run `pnpm run lint` before committing
- **Prettier**: Code is auto-formatted via `pnpm run format`
- **TypeScript**: Use strict mode and proper types
- **React**: Follow React best practices and hooks rules

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Files**: Match component/function name
- **Hooks**: Start with `use` (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)

See `.cursor/rules/quality/conventions.mdc` for detailed conventions.

## 📝 Commits

### Conventional Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependencies
- `ci`: CI/CD changes
- `perf`: Performance improvements

### Examples

```bash
feat(auth): add refresh token rotation
fix(landing): correct hero image alt text
docs(readme): update installation instructions
chore(deps): update react to 19.2.0
```

### Commit Guidelines

- Write clear, descriptive commit messages
- Use present tense ("add feature" not "added feature")
- Reference issues when applicable: `fix(auth): resolve login issue (#123)`
- Keep commits focused and atomic

## ✅ Testing

### Unit Tests

- Write tests for domain logic and utilities
- Use Vitest for unit testing
- Test files should be co-located or in `tests/`
- Run tests: `pnpm run test`
- Watch mode: `pnpm run test:watch`

### E2E Tests

- Use Playwright for end-to-end tests
- E2E tests in `e2e/` directory
- Run E2E tests: `pnpm run test:e2e`

### Testing Requirements

- New features should include tests
- Bug fixes should include regression tests
- Maintain or improve test coverage

## 📚 Documentation

### Code Documentation

- Document complex logic and algorithms
- Use JSDoc for public APIs
- Include examples in README files when applicable

### Documentation Updates

- Update README if adding new features or changing setup
- Update architecture docs if structure changes
- Keep inline comments up to date

## 🔒 Security

- **Never commit secrets**: Use environment variables
- **Review dependencies**: Check for security vulnerabilities (`pnpm audit`)
- **Report vulnerabilities**: See [SECURITY.md](../SECURITY.md)

## 🎯 Module Boundaries

This project enforces strict module boundaries:

- **Domains** (`src/domains/*`): Self-contained, minimal external dependencies
- **Core** (`src/core/*`): Framework-agnostic utilities, no domain dependencies
- **Infrastructure** (`src/infrastructure/*`): Adapters for external services
- **Shared** (`src/shared/*`): Reusable composites across domains

See `.cursor/rules/boundaries.mdc` for detailed boundary rules.

## 🚨 CI/CD

All PRs must pass CI checks:

- ✅ TypeScript type checking
- ✅ ESLint linting
- ✅ Unit tests
- ✅ Build verification

CI runs automatically on PR creation and updates. Ensure all checks pass before requesting review.

## 📞 Getting Help

- **Documentation**: Check `.cursor/rules/` for detailed guides
- **Issues**: Open an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Maintainers**:
  - Guillermo Astorga Calvo (CTO) - guillermo@brighthub.es
  - Masa Jebril (CEO) - masaj@brighthub.es

## 🙏 Thank You

Thank you for contributing! Your contributions help make this project better for everyone.
