# Contributing Guidelines

Thank you for your interest in contributing to this project! Please take a moment to read these guidelines before getting started.

## Branch Protection

Even if you have write access or push permissions to this repository, **never commit directly to `main`**.

The `main` branch is protected and represents the stable, production-ready state of the project. All changes — no matter how small — must go through a Pull Request.

## How to Contribute

1. **Fork or create a branch** from the latest `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** and commit using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add new feature
   fix: correct a bug
   docs: update documentation
   chore: update dependencies
   ```
   > This project uses `semantic-release`, so commit messages directly affect versioning. Please follow the convention carefully.

3. **Push your branch** and open a Pull Request targeting `main`:
   ```bash
   git push origin feat/your-feature-name
   ```

4. **Wait for review.** At least one approval is required before merging.

## Pull Request Rules

- Keep PRs focused — one feature or fix per PR
- Write a clear title and description explaining **what** changed and **why**
- Link any related issues in the PR description
- Do not merge your own PR without a review from another contributor

## Commit Message Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Examples:

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `chore` | Build process, dependency updates |
| `perf` | Performance improvements |

## Questions?

Open an issue and we'll be happy to help.