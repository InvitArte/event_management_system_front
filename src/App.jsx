import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicView from './views/PublicView';
import LoginView from './views/LoginView';
import GuestView from './views/GuestView';
import ProtectedRoute from './components/Utils/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<PublicView />} />
        <Route path="/login" element={<LoginView />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/guests" element={<GuestView />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;