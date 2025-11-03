# Security Policy

## Supported Versions

We actively support security updates for the latest version of this starter template. For projects based on this template, please maintain your own security policy.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue. Instead, please report it via one of the following methods:

### Preferred Method

1. **Email**: Contact the repository maintainers directly
2. **Private Security Advisory**: If this repository has private security advisories enabled, create a draft security advisory

### What to Include

When reporting a vulnerability, please include:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact and severity
- Suggested fix (if you have one)
- Any additional context or references

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Depends on severity and complexity

### Vulnerability Severity Levels

- **Critical**: Immediate security risk (e.g., authentication bypass, remote code execution)
- **High**: Significant security risk (e.g., data exposure, privilege escalation)
- **Medium**: Moderate security risk (e.g., information disclosure, CSRF)
- **Low**: Minor security risk (e.g., minor information leakage)

## Security Best Practices

When using this starter template, consider:

1. **Environment Variables**: Never commit sensitive data (API keys, secrets) to version control
2. **Dependencies**: Keep dependencies up to date and review security advisories
3. **Input Validation**: Validate and sanitize all user inputs
4. **Authentication**: Implement proper authentication and authorization
5. **HTTPS**: Always use HTTPS in production
6. **CSP**: Consider implementing Content Security Policy headers
7. **Dependency Scanning**: Regularly scan dependencies for known vulnerabilities

### Dependency Security

```bash
# Check for known vulnerabilities in dependencies
pnpm audit

# Update dependencies to latest secure versions
pnpm update
```

### Security Headers

When deploying to production, ensure appropriate security headers are configured:

- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Strict-Transport-Security`
- `Referrer-Policy`

## Security Tools

This template includes:

- `eslint-plugin-security` - Identifies potential security issues in code
- Dependabot or similar - Automated dependency vulnerability scanning (if configured)

## Responsible Disclosure

We appreciate responsible disclosure. We will:

1. Acknowledge receipt of your report
2. Investigate the vulnerability
3. Work on a fix
4. Release a security update if needed
5. Credit you (unless you prefer to remain anonymous)

## Disclaimer

This starter template is provided as-is. Security is a shared responsibility. When using this template:

- Review and adapt security practices to your use case
- Perform security audits before production deployment
- Keep dependencies up to date
- Implement proper authentication and authorization
- Follow security best practices for your stack

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://react.dev/learn/escape-hatches)
- [TypeScript Security](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Vite Security](https://vitejs.dev/guide/security.html)
