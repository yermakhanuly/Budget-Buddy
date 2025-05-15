import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Dashboard from './components/Dashboard';
import TransactionList from './components/transactions/TransactionList';
import TransactionForm from './components/transactions/TransactionForm';

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionList />} />
          <Route path="/transactions/add" element={<TransactionForm />} />
          <Route path="/transactions/edit/:id" element={<TransactionForm />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
