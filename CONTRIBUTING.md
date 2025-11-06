# Contributing to Auto-Sweep Loyalty System

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/auto-sweep-loyalty-system.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests: `npm test`
6. Run linter: `npm run lint`
7. Commit your changes: `git commit -m "Add feature description"`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Create a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your local configuration

# Start development server
npm run dev
```

## Code Style

- We use ESLint for code linting
- 2 spaces for indentation
- Single quotes for strings
- Semicolons are required
- Follow existing code patterns

Run linter:
```bash
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## Commit Messages

Use clear and descriptive commit messages:

- `feat: Add new payment processor integration`
- `fix: Resolve tier upgrade calculation bug`
- `docs: Update API documentation`
- `test: Add tests for loyalty service`
- `refactor: Improve payment service structure`
- `style: Fix linting issues`

## Pull Request Process

1. **Update Documentation**: If you change APIs, update DOCUMENTATION.md
2. **Add Tests**: Include tests for new functionality
3. **Update README**: Add any new dependencies or setup steps
4. **Check CI**: Ensure all checks pass
5. **Describe Changes**: Provide clear description in PR

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Express middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Utility functions
```

## Adding New Features

### Adding a New Payment Processor

1. Add integration to `src/services/paymentService.js`
2. Add webhook handler if needed
3. Update `.env.example` with required keys
4. Update DOCUMENTATION.md with setup instructions
5. Add tests in `tests/`

### Adding a New Reward Type

1. Update `Reward` model schema if needed
2. Add business logic to `src/services/loyaltyService.js`
3. Update controller and routes
4. Update admin dashboard UI
5. Add tests

### Adding a New Integration

1. Create new service in `src/services/`
2. Add controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Update server.js to include routes
5. Add configuration to `.env.example`
6. Document in DOCUMENTATION.md

## Code Review Process

All submissions require review. We aim to review PRs within 2-3 days.

Reviewers will check:
- Code quality and style
- Test coverage
- Documentation updates
- Breaking changes
- Security implications

## Security

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Follow OWASP security best practices
- Report security vulnerabilities privately

## Questions?

- Open an issue for bugs or feature requests
- Use discussions for questions and ideas
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Enforcement

Unacceptable behavior may be reported to the project maintainers.

---

Thank you for contributing to Auto-Sweep Loyalty System! 🎉
