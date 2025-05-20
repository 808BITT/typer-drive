# CI/CD Pipeline Setup

Generate a basic CI/CD pipeline configuration.

- **Inputs:**
  - `repoName` (string): name of repository
  - `buildCommands` (array): e.g., ['npm install', 'npm run build']
- **Desired Output:**
  - A `.github/workflows/ci.yml` file that:
    - Triggers on pushes and pull requests
    - Checks out code, sets up Node.js and Go
    - Runs frontend build and Go server build
    - Optionally runs tests if defined
