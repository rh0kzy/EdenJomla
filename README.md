# Parfum Depot Stock Management

A professional Windows desktop application built with Electron, React, and Prisma.

## Features
- **Strict Clean Architecture**: Separation of UI, Business Logic, and Database layers.
- **Secure IPC**: All database operations go through isolated IPC channels.
- **Stock Management**: Reference-based stock tracking (Grammes/Kilogrammes).
- **Modern UI**: Material UI v5 with Dark/Light mode support.
- **Local Database**: SQLite with Prisma ORM.

## Architecture
- `/electron`: Main process and Preload scripts (Security Layer).
- `/backend`: Services, Repositories, and IPC Handlers (Logic Layer).
- `/frontend`: React UI with Zustand state management (Presentation Layer).
- `/prisma`: Database schema and migrations.

## Getting Started

### Installation
```bash
npm install
```

### Database Setup
```bash
npx prisma migrate dev --name init
npm run seed
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Business Rules
- A parfum can have multiple references.
- Stock is managed per reference.
- Reference codes are unique across the system.
- Units are not auto-converted to maintain data integrity.
