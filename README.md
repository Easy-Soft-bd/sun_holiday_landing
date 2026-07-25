# Sun Tourism Ltd. - Landing Page

This is a [Next.js](https://nextjs.org) project for the Sun Tourism Ltd. landing page.

## Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites

- Node.js (v18+ recommended)
- MySQL Database

### 2. Installation

Install the dependencies:

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory with your database and JWT configuration:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_NAME=sun_holidays
DB_USER=root
DB_PASS=your_password

# JWT Secret (for auth)
JWT_SECRET=your_jwt_secret

# Public "Development Mode" top banner (true/false)
DEVELOPMENT_MODE=true
```

### 4. Database Synchronization

This project uses Sequelize for ORM. To create/update tables (like `users`, `page_home`) based on the models, run:

```bash
npm run dbsync
```

This command will:
- Connect to the database using credentials from `.env.local`.
- Create tables if they don't exist.
- Alter tables to match the model definitions (without dropping data).

### 5. Running the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 6. Admin Login (Development)

Seed the default admin user (first time):

```text
http://localhost:3000/api/test-db?seed=true
```

Reset the admin password if login fails:

```text
http://localhost:3000/api/test-db?seed=true&reset=true
```

Default credentials:

- Email: `admin@sunholidays.com`
- Password: `adminpassword123`

Admin portal: [http://localhost:3000/portal/admin/login](http://localhost:3000/portal/admin/login)

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `src/components/`: Reusable React components.
- `src/models/`: Sequelize database models (e.g., `User`, `HomePage`).
- `src/lib/`: Utilities, database connection (`db.ts`), authentication (`auth.ts`), and seed scripts.
- `src/view/`: View-specific components (e.g., Home page sections).
- `scripts/`: Maintenance scripts (e.g., `db_model_sync.ts`).