# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a monorepo with three projects:

1. **Root** (`/`): A CommonJS project stub with basic package.json setup. Currently no production code.
2. **my-react-app** (`./my-react-app/`): The active React application built with Create React App (CRA).
3. **my-react-app/my-express-api** (`./my-react-app/my-express-api/`): Express.js backend API.

Most frontend development happens in `my-react-app/`, and backend development in `my-react-app/my-express-api/`.

## Development Commands

### Setup (my-react-app)
```bash
cd my-react-app
npm install
npm start
```

### Testing
```bash
cd my-react-app
npm test              # Run tests in watch mode
npm test -- --coverage  # Generate coverage report
```

### Building
```bash
cd my-react-app
npm run build         # Build for production
```

### Running a Single Test
```bash
cd my-react-app
npm test -- --testNamePattern="test name pattern" --watch
```

### Linting (my-react-app)
```bash
cd my-react-app
npm start    # Shows lint errors in console during development
# ESLint is configured via react-scripts (react-app preset)
```

### Setup (my-express-api)
```bash
cd my-react-app/my-express-api
npm install
npm start  # (once start script is configured)
```

## Architecture Notes

### my-react-app
- **Framework**: React 19
- **Build Tool**: Create React App (react-scripts)
- **Testing**: Jest with Testing Library (React Testing Library, @testing-library/user-event)
- **Linting**: ESLint (react-app configuration)
- **Entry Point**: `src/index.js`
- **Main Component**: `src/App.js`

Key dependencies:
- `react`: Core React library
- `react-dom`: DOM rendering
- `@testing-library/react`: Component testing utilities
- `web-vitals`: Performance monitoring

### my-express-api
- **Framework**: Express.js 5.2.1
- **Module System**: CommonJS
- **Entry Point**: `app.js` (currently empty, ready for implementation)
- **Status**: Stub/ready for development

### Root Project
- **Module System**: CommonJS
- **Status**: Placeholder/infrastructure only

## Build Outputs

- **my-react-app**: Production build output in `my-react-app/build/` directory (optimized and minified)
- **my-express-api**: Currently no build process configured

## Quick Reference

### Common Commands
```bash
# Frontend development
cd my-react-app && npm start

# Frontend tests
cd my-react-app && npm test

# Frontend production build
cd my-react-app && npm run build

# Backend setup
cd my-react-app/my-express-api && npm install
```

### Project Entry Points
- **Frontend**: `my-react-app/src/index.js` → renders `App.js`
- **Backend**: `my-react-app/my-express-api/app.js` (awaiting implementation)

## Deployment

The React app is optimized for production via `npm run build`. The build output is in the `build/` directory. See the app's README.md for deployment options.
