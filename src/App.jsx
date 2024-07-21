import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/Utils/ProtectedRoute";
import PublicView from "./views/PublicView";
import LoginView from "./views/LoginView";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicView />} />
        <Route path="/login" element={<LoginView />} />
        {/* Aquí dentro iran las rutas protegidas */}
        <Route element={<ProtectedRoute />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
