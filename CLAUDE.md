# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Demo application for the Marlowe Project-Based Learning Course from Gimbalabs. Built with Next.js and MeshJS for Cardano wallet integration.

**Design principles:** Light styling, simple, elegant, developer-friendly.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

**Tech Stack:**
- Next.js 15 with Pages Router
- MeshJS (`@meshsdk/core`, `@meshsdk/react`) for Cardano integration
- Tailwind CSS for styling
- TypeScript

**Project Structure:**
```
src/
├── pages/
│   ├── _app.tsx      # MeshProvider wrapper for wallet context
│   ├── _document.tsx # Custom HTML document
│   └── index.tsx     # Home page with CardanoWallet component
└── styles/
    └── globals.css   # Global styles + Tailwind imports
```

**Key Patterns:**
- The `MeshProvider` in `_app.tsx` provides wallet state throughout the app
- `@meshsdk/react/styles.css` must be imported for MeshJS component styling
- Path alias `@/*` maps to `./src/*`

## MeshJS Integration

The app uses MeshJS components:
- `CardanoWallet` - Connect wallet button with built-in wallet selection
- `MeshBadge` - Attribution badge component

For extending with Cardano functionality, refer to:
- [MeshJS APIs](https://meshjs.dev/apis)
- [MeshJS Guides](https://meshjs.dev/guides)
- [MeshJS Smart Contracts](https://meshjs.dev/smart-contracts)
