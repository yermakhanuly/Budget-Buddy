# BudgetBuddy

BudgetBuddy is a modern web application for tracking income and expenses by categories. It helps users manage their budget effectively and monitor their current balance.

## Features

- Add, edit, and delete transactions
- Categorize transactions (income/expense)
- Filter transactions by date and category
- View current balance, total income, and expenses
- Responsive and intuitive user interface
- Real-time balance updates
- Data persistence across sessions

## Tech Stack

### Frontend
- React.js - For building a dynamic and responsive user interface
- Material-UI - For modern and consistent UI components
- Redux Toolkit - For state management
- React Router - For navigation
- Axios - For API communication

### Backend
- Node.js with Express - For building a robust and scalable API
- MongoDB - For data persistence
- Mongoose - For MongoDB object modeling
- JWT - For authentication
- Express Validator - For input validation

### Development Tools
- ESLint - For code linting
- Prettier - For code formatting
- Jest - For testing
- Docker - For containerization

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Budget-Buddy.git
cd Budget-Buddy
```

2. Set up the backend:
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Required environment variables:
# - PORT (default: 5000)
# - MONGODB_URI (default: mongodb://localhost:27017/budget-buddy)
# - JWT_SECRET (change this to a secure random string)
# - NODE_ENV (development/production)

# Start the development server
npm run dev
```

3. Set up the frontend:
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start the development server
npm start
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Running Tests

1. Backend tests:
```bash
cd backend
npm test
```

2. Frontend tests:
```bash
cd frontend
npm test
```

## API Documentation

### Authentication Endpoints

#### Register User
- POST `/api/auth/register`
- Body: `{ name, email, password }`
- Returns: `{ token, user: { id, name, email } }`

#### Login
- POST `/api/auth/login`
- Body: `{ email, password }`
- Returns: `{ token, user: { id, name, email } }`

#### Get Current User
- GET `/api/auth/me`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ id, name, email }`

### Transaction Endpoints

#### Get All Transactions
- GET `/api/transactions`
- Headers: `Authorization: Bearer <token>`
- Returns: Array of transactions

#### Create Transaction
- POST `/api/transactions`
- Headers: `Authorization: Bearer <token>`
- Body: `{ amount, type, category, description, date }`
- Returns: Created transaction

#### Update Transaction
- PUT `/api/transactions/:id`
- Headers: `Authorization: Bearer <token>`
- Body: `{ amount?, type?, category?, description?, date? }`
- Returns: Updated transaction

#### Delete Transaction
- DELETE `/api/transactions/:id`
- Headers: `Authorization: Bearer <token>`
- Returns: Success message

#### Get Balance Summary
- GET `/api/transactions/summary/balance`
- Headers: `Authorization: Bearer <token>`
- Returns: `{ income, expenses, balance }`

#### Get Category Summary
- GET `/api/transactions/summary/categories`
- Headers: `Authorization: Bearer <token>`
- Returns: Object with category summaries

## Development Process

1. **Planning Phase**
   - Defined core features and requirements
   - Created wireframes and UI/UX design
   - Selected appropriate technologies

2. **Implementation Phase**
   - Set up project structure and configuration
   - Implemented core features incrementally
   - Added authentication and data persistence
   - Implemented error handling and validation

3. **Testing Phase**
   - Unit testing for critical components
   - Integration testing for API endpoints
   - User acceptance testing

## Known Issues and Limitations

- Currently, the application doesn't support multiple currencies
- No export functionality for transaction history
- Limited to single-user access (no multi-user support yet)

## Future Improvements

- Add support for multiple currencies
- Implement data export functionality
- Add budget planning features
- Implement recurring transactions
- Add data visualization and reports
- Support for multiple users and sharing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.