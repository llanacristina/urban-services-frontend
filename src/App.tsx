import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import CreateRequest from './pages/CreateRequest';
import ListRequests from './pages/ListRequests';

function App() {
  return (
    <Routes>
       <Route path="/" element={<CreateRequest />} />
        <Route path="/login" element={<LoginPage />} />
      <Route path="/list" element={<ListRequests />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;
