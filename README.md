# Finance Dashboard Frontend

A modern React dashboard for managing financial transactions with role-based access control.

## Features

- 🔐 JWT Authentication with auto role detection
- 📊 Interactive charts (Line, Area, Pie charts)
- 💰 Transaction management with CRUD operations
- 👥 User management (Admin only)
- 🎨 Dark mode support
- 📱 Fully responsive design
- 🔍 Advanced filtering and pagination
- ⚡ Connection animations for login
- 🎯 Role-based access control (Viewer/Analyst/Admin)

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Axios
- Recharts
- React Router v6
- React Hook Form + Zod
- Lucide React Icons
- React Hot Toast

## Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/finance-dashboard-frontend.git

# Navigate to project
cd finance-dashboard-frontend

# Install dependencies
npm install

# Create .env file
echo VITE_API_URL=http://localhost:8000 > .env

# Start development server
npm run dev