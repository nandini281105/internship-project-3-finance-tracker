# 🧾 FinTrack — Personal Finance & Budget Tracker

A modern, responsive full-stack **Personal Finance Tracker** built with **React.js, Tailwind CSS, Node.js, Express.js, MongoDB (Mongoose), Recharts, and JWT Authentication**.

Designed with clean software engineering principles, layered MVC architecture, dynamic data visualizations, and production deployment readiness.

---

## 🎯 Highlights & Key Features

- **🔐 Secure JWT Authentication**: User registration, hashed passwords with `bcryptjs`, persistent token authorization, and protected REST routes.
- **⚡ Instant 1-Click Demo Login**: Explore live charts and seed transactions with a single click without having to register first.
- **📊 Interactive Data Visualizations**:
  - **Category Spending Donut Chart** (Recharts) with live percentage breakdowns and custom tooltips.
  - **Monthly Cash Flow Trends** (Income vs. Expense toggle between Bar Chart and Area Chart).
- **💰 Complete Transaction CRUD**:
  - Add income or expense with category, date, amount, payment method, and notes.
  - Edit or delete transactions with real-time UI balance updates.
- **🔍 Advanced Filtering & Search**:
  - Filter by transaction type (Income / Expense / All).
  - Filter by category and custom date ranges.
  - Real-time text search across titles and notes.
- **🏷️ Monthly Budget Management**:
  - Establish monthly spending limits per category.
  - Dynamic visual progress bars with threshold alerts (**Green** on track, **Amber** near limit, **Red** exceeded).
- **📤 CSV Data Export**: One-click export of transactions to CSV for accounting and spreadsheets.
- **🌓 Dark / Light Mode Toggle**: Smooth theme switching with preference stored in `localStorage`.
- **📱 Fully Responsive Design**: Mobile-first UI optimized for phones, tablets, and desktop workstations.

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + Vite | Lightning-fast SPA with Context API |
| **Styling** | Tailwind CSS + Lucide Icons | Responsive modern styling & clean icons |
| **Charts** | Recharts | Interactive Donut, Bar, and Area charts |
| **Backend** | Node.js + Express.js | Layered RESTful API, validation, error handler |
| **Database** | MongoDB + Mongoose | Schema modeling, indexing, aggregation pipelines |
| **Auth** | JSON Web Tokens (JWT) + BcryptJS | Secure token-based user sessions |
| **Deployment** | Vercel (Client) + Render/Railway (API) | Cloud production hosting |

---

## 📁 Project Architecture & Clean File Structure

```text
finance tracker/
├── package.json               # Root scripts (run dev, seed, build)
├── README.md                  # Comprehensive documentation
├── .gitignore
│
├── server/                    # Express + MongoDB Backend
│   ├── config/
│   │   └── db.js              # Mongoose database connection
│   ├── controllers/
│   │   ├── authController.js        # Register, login, profile
│   │   ├── transactionController.js # CRUD, filtering, stats aggregation, CSV export
│   │   └── budgetController.js      # Monthly budget caps & progress
│   ├── middleware/
│   │   ├── auth.js            # JWT Bearer token protection
│   │   └── errorHandler.js    # Global centralized error handling
│   ├── models/
│   │   ├── User.js            # User schema with bcrypt pre-save
│   │   ├── Transaction.js     # Indexed transaction schema & categories
│   │   └── Budget.js          # Monthly category budget limits
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth
│   │   ├── transactionRoutes.js # /api/transactions
│   │   └── budgetRoutes.js    # /api/budgets
│   ├── scripts/
│   │   └── seed.js            # Realistic seed script (30+ transactions & budgets)
│   ├── .env                   # Environment secrets
│   ├── .env.example           # Example template
│   ├── package.json
│   └── server.js              # Express entry point
│
└── client/                    # React + Vite + Tailwind Frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx            # Responsive navigation & theme switch
    │   │   ├── StatsCard.jsx         # Summary KPI cards
    │   │   ├── CategoryPieChart.jsx  # Recharts donut visualization
    │   │   ├── MonthlyTrendChart.jsx # Recharts bar & area chart
    │   │   ├── BudgetProgressBar.jsx # Progress bar with alert thresholds
    │   │   ├── TransactionItem.jsx   # Individual row with actions
    │   │   └── TransactionModal.jsx  # Add/Edit transaction dialog
    │   ├── context/
    │   │   ├── AuthContext.jsx       # Auth state, login/register/logout
    │   │   ├── TransactionContext.jsx# CRUD state, filters, pagination, CSV
    │   │   ├── ThemeContext.jsx      # Light/dark mode toggle
    │   │   └── ToastContext.jsx      # In-app toast feedback
    │   ├── pages/
    │   │   ├── DashboardPage.jsx     # Overview, stats, charts & recent records
    │   │   ├── TransactionsPage.jsx  # History, multi-filter toolbar, pagination
    │   │   ├── BudgetsPage.jsx       # Category budgets & spending caps
    │   │   ├── AnalyticsPage.jsx     # In-depth financial metrics & rankings
    │   │   └── AuthPage.jsx          # Login & registration with demo button
    │   ├── utils/
    │   │   └── formatters.js         # Currency (Intl), dates, category colors
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **MongoDB** (Local `mongodb://127.0.0.1:27017` or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 2. Install Dependencies
In the root directory, install dependencies for both server and client:
```bash
# Using root shortcut
npm run install:all

# Or individually
cd server && npm install
cd ../client && npm install
```

### 3. Environment Variables
Check `server/.env` (pre-configured for local development):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance_tracker
JWT_SECRET=supersecret_finance_tracker_jwt_key_2026_xyz123
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Seed Realistic Demo Data
Populate the database with realistic demo user records, 30+ transactions across multiple months, and monthly budgets:
```bash
npm run seed
```
> **Default Demo Account**:
> - Email: `demo@financetracker.com`
> - Password: `password123`

### 5. Run the Application
Run both backend API and frontend React client concurrently:
```bash
npm run dev
```
- Frontend runs at: **http://localhost:3000**
- Backend API runs at: **http://localhost:5000**

---

## 📡 RESTful API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated profile |
| `PUT` | `/api/auth/me` | Private | Update preferences (currency, budget goal) |

### 💳 Transactions (`/api/transactions`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/transactions` | Private | List transactions with search, filter & pagination |
| `POST` | `/api/transactions` | Private | Add new transaction |
| `GET` | `/api/transactions/:id` | Private | Get single transaction |
| `PUT` | `/api/transactions/:id` | Private | Update existing transaction |
| `DELETE`| `/api/transactions/:id` | Private | Delete transaction |
| `GET` | `/api/transactions/stats/summary`| Private | Aggregated income, expense, balance, charts |
| `GET` | `/api/transactions/export/csv` | Private | Stream transactions as CSV attachment |
| `GET` | `/api/transactions/categories` | Public | List system categories |

### 🎯 Budgets (`/api/budgets`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/budgets?month=10&year=2026` | Private | Fetch monthly budgets with actual spent |
| `POST` | `/api/budgets` | Private | Upsert category budget limit |
| `DELETE`| `/api/budgets/:id` | Private | Delete budget limit |

---

## 🌐 Production Deployment Guide

### Backend on Render / Railway
1. Push your repository to GitHub.
2. In Render or Railway, create a new **Web Service** pointing to the `server/` directory.
3. Set the build and start commands:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Set Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection URI string.
   - `JWT_SECRET`: A long random secret key.
   - `NODE_ENV`: `production`

### Frontend on Vercel
1. In Vercel, import your GitHub repository.
2. Set Root Directory to `client`.
3. Framework Preset: **Vite**.
4. Configure environment variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://your-api.onrender.com`).
5. Click **Deploy**!

---

## 🧠 Key Industry Skills Demonstrated

- **Security & Authorization**: JWT token lifecycle, bcrypt salted password hashing, Bearer auth middleware.
- **RESTful API & Database Architecture**: Express controllers, robust Mongoose schemas, compound indexes, aggregation pipelines (`$group`, `$match`, `$sort`).
- **State Management & React Architecture**: Modular React Contexts (`AuthContext`, `TransactionContext`, `ThemeContext`, `ToastContext`), reusable presentation components.
- **Data Visualization**: Recharts configuration, responsive SVG containers, customized tooltips, category palette design.
- **Enterprise Product Polish**: Dark/light modes, optimistic UI, CSV generation, input validation, and user feedback toast alerts.
