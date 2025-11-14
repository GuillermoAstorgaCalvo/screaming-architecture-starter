# Contributing Guide

Thank you for your interest in contributing to the Screaming Architecture Starter! This guide will help you understand our workflow, branching model, and coding standards.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Workflow](#workflow)
- [Branching Model](#branching-model)
- [Pull Requests](#pull-requests)
- [Code Review Guidelines](#code-review-guidelines)
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

## 👀 Code Review Guidelines

Code reviews are essential for maintaining code quality, sharing knowledge, and ensuring consistency across the codebase. This section outlines expectations for both reviewers and contributors.

### Review Process

1. **Automatic Assignment**: CODEOWNERS are automatically assigned based on the `CODEOWNERS` file. All code requires approval from at least one code owner.
2. **Review Timeline**: Aim to provide initial feedback within 2 business days. For urgent fixes, reviews should be prioritized.
3. **Review Completion**: All CI checks must pass and at least one approval is required before merging.

### For Reviewers

#### What to Review

**Architecture & Boundaries**

- [ ] Code follows the project's folder structure and module boundaries
- [ ] No forbidden imports across boundaries (see `.cursor/rules/boundaries.mdc`)
- [ ] Imports use path aliases where available (no deep relative paths)
- [ ] No re-export barrels (`index.ts` re-exports) introduced
- [ ] Domain code is self-contained and framework-agnostic where appropriate

**Code Quality**

- [ ] Code follows project conventions (see `.cursor/rules/quality/conventions.mdc`)
- [ ] TypeScript types are properly defined and used
- [ ] No `any` types without justification
- [ ] Error handling is appropriate and consistent
- [ ] Code is readable and maintainable
- [ ] Complex logic is documented with comments

**Testing**

- [ ] Adequate test coverage for new functionality
- [ ] Tests are well-written and follow testing best practices
- [ ] Edge cases and error scenarios are covered
- [ ] E2E tests added for user-facing features (if applicable)

**Performance & Accessibility**

- [ ] No obvious performance issues (unnecessary re-renders, missing memoization)
- [ ] Accessibility requirements met (ARIA labels, keyboard navigation, focus management)
- [ ] Images have appropriate alt text
- [ ] Color contrast meets WCAG standards

**Security**

- [ ] No secrets or sensitive data committed
- [ ] Input validation and sanitization where needed
- [ ] Safe handling of user data and external APIs
- [ ] Dependencies reviewed for known vulnerabilities

**Documentation**

- [ ] README updated if adding features or changing setup
- [ ] Architecture docs updated if structure changes
- [ ] JSDoc comments for public APIs
- [ ] Complex algorithms or business logic explained

#### How to Provide Feedback

**Be Constructive**

- Focus on the code, not the person
- Explain the "why" behind suggestions, not just the "what"
- Offer specific solutions or examples when possible
- Acknowledge good practices and improvements

**Use Review Comments Effectively**

- **Blocking comments**: Use for critical issues that must be fixed before merge
- **Suggestions**: Use for improvements that are nice-to-have
- **Questions**: Use when you need clarification or want to understand the approach
- **Praise**: Recognize good solutions and patterns

**Review Tone**

- Be respectful and professional
- Ask questions rather than making demands
- Use "we" language to foster collaboration
- Remember that everyone is learning and improving

**Example Good Feedback**

```
Great use of the Result type for error handling!

One suggestion: Could we extract the validation logic into a separate function?
This would make it easier to test and reuse. Something like:

function validateUserInput(input: string): Result<User, ValidationError> {
  // validation logic
}
```

**Example Poor Feedback**

```
This is wrong. Do it differently.
```

### For Contributors

#### Before Requesting Review

- [ ] Complete the PR checklist in the PR template
- [ ] Ensure all CI checks pass
- [ ] Self-review your code
- [ ] Update documentation as needed
- [ ] Add tests for new functionality
- [ ] Keep PRs focused and reasonably sized (aim for < 500 lines when possible)

#### Responding to Feedback

**Be Open to Feedback**

- View reviews as learning opportunities
- Ask for clarification if feedback is unclear
- Discuss trade-offs when you disagree with suggestions
- Remember that reviewers are trying to help improve the codebase

**Addressing Comments**

- Respond to all review comments (even if just acknowledging)
- Make requested changes or explain why an alternative approach is better
- Mark conversations as resolved when you've addressed the feedback
- Request re-review when ready for another look

**Iterative Improvement**

- It's normal for PRs to go through multiple review cycles
- Don't take feedback personally
- Focus on improving the code together
- Thank reviewers for their time and feedback

### Review Criteria Checklist

When reviewing a PR, verify:

**Must Have (Blocking)**

- [ ] All CI checks pass
- [ ] Code follows architectural boundaries
- [ ] No security vulnerabilities introduced
- [ ] Tests pass and coverage is adequate
- [ ] No breaking changes without documentation
- [ ] TypeScript compiles without errors

**Should Have (Important)**

- [ ] Code follows project conventions
- [ ] Error handling is appropriate
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Documentation updated

**Nice to Have (Suggestions)**

- [ ] Code could be more readable
- [ ] Additional edge cases could be tested
- [ ] Performance could be optimized further
- [ ] Documentation could be enhanced

### Review Approval

**When to Approve**

- All blocking criteria are met
- Code quality is acceptable
- You understand the changes and their impact
- You're confident the code won't break production

**When to Request Changes**

- Critical issues that must be fixed
- Security concerns
- Architectural violations
- Missing essential tests
- Breaking changes without proper documentation

**When to Comment (Without Blocking)**

- Suggestions for improvement
- Questions about implementation
- Alternative approaches to consider
- Future refactoring opportunities

### Special Cases

**Large PRs**

- Consider breaking into smaller, reviewable chunks
- If large PR is necessary, provide a high-level overview
- Reviewers may focus on critical paths first

**Urgent Fixes (Hotfixes)**

- Reviews should be prioritized but not rushed
- Security and critical bugs may require faster turnaround
- Still maintain quality standards

**Conflicting Feedback**

- Discuss with other reviewers to reach consensus
- Maintainer has final say on architectural decisions
- Document decisions in PR comments for future reference

### Continuous Improvement

- Review your own code before requesting review
- Learn from feedback and apply it to future PRs
- Share knowledge gained from reviews with the team
- Suggest improvements to this review process

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

For detailed information on how the CI pipeline works, setting it up, and customizing it, see the [CI/CD Setup Guide](../docs/ci-cd-setup.md).

## 📞 Getting Help

- **Documentation**: Check `.cursor/rules/` for detailed guides
- **Issues**: Open an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Maintainers**:
  - Guillermo Astorga Calvo (CTO) - guillermo@brighthub.es
  - Masa Jebril (CEO) - masaj@brighthub.es

## 🙏 Thank You

Thank you for contributing! Your contributions help make this project better for everyone.
