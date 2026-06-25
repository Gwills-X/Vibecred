This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `app/page.js`. The page auto-updates
as you edit the file.

This project uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to automatically optimize and load [Geist](https://vercel.com/font), a new font
family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out
[the Next.js GitHub repository](https://github.com/vercel/next.js) - your
feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our
[Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying)
for more details. "# Vibecred"

# Full-Stack Interactive Social Timeline Application

A modern, high-performance web application designed to handle content
publishing, user engagement tracking, and authentication. The platform is built
around a decoupled data engine capable of routing traffic across different
database environments dynamically based on configuration layers.

## 🚀 Key Application Features

- **User Authentication & Profiles:** Custom secure session validation
  supporting user registration, login profiles, and automated cookie session
  state clearing on logout.
- **Dynamic Post Creation:** Allows users to create long-form posts,
  micro-updates, or nested replies.
- **Optimistic Interactions:** A fast like-toggle interaction utility with state
  rollbacks that seamlessly syncs interactions to the backend.
- **Sleek UI/UX:** A responsive layout crafted with Tailwind CSS, customized
  dashboard view counters, and clear operational status feedback logs.

---

## 🏗️ System Architecture

The core engineering highlight of this application is its **Decoupled Data
Pipeline**. Instead of binding the application logic to a single database type,
all data mutations and reads pass through an execution abstraction gateway
(`dataEngine` and `authEngine`).

┌─────────────────────────┐ │ Next.js UI / Forms │ └────────────┬────────────┘ │
┌────────────▼────────────┐ │ Server Actions (Auth) │
└────────────┬────────────┘ │ ┌────────────▼────────────┐ │ Central Data Engine
│ │ (Generates App UUID) │ └──────┬────────────┬─────┘ │ │
┌─────────────▼─────┐┌─────▼──────────────┐ │ MySQL Relational ││ Firebase
Firestore │ │ (VARCHAR 36) ││ (NoSQL Document) │
└───────────────────┘└────────────────────┘

### 1. Application-Layer UUID Key Strategy

To support completely interchangeable database systems, this application moves
primary key generation out of the database layer. Traditional relational
`INT AUTO_INCREMENT` mechanics are replaced with standard 36-character string
identifiers via `crypto.randomUUID()`.

Because unique IDs are assigned at the application's front gate before any
queries are built, the relational tables (`VARCHAR(36)`) and NoSQL document
pathways sync instantly using matching identifier keys.

### 2. Flexible Database Provider Engine

By adjusting your environment parameters (`process.env.DATABASE_PROVIDER`), the
application alters how it saves records behind the scenes:

- **`MYSQL` Mode:** Reads and updates happen entirely inside local relational
  schemas.
- **`FIREBASE` Mode:** Fully transitions into a NoSQL cloud infrastructure
  engine via Firestore collections.
- **`DUAL_WRITE` Mode:** The application runs parallel storage executions. It
  safely maps entries into MySQL first, extracts the execution context, and
  pairs it straight into cloud document references concurrently.

---

## 🛠️ Tech Stack Breakdown

- **Frontend & Backend Engine:** Next.js 15 (App Router, Server Actions, Client
  Context Management)
- **Security Processing:** Cryptographic hashing via Bcrypt for secure local
  credential validation
- **Relational Backend:** MySQL Database Pool Connection
- **Cloud Backend:** Firebase v10+ SDK Integration (Firestore Document Store)
- **Styling UI:** Tailwind CSS Layout Systems
