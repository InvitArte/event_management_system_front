import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicView from "./views/PublicView";
import LoginView from "./views/LoginView";
import GuestView from "./views/GuestView";
import TagView from "./views/TagView";
import ProfileView from "./views/ProfileView";
import ProtectedRoute from "./components/Utils/ProtectedRoute";
import ProtectedLayout from "./components/Utils/ProtectedLayout";

const App = () => {
  const guestViewColumns = {
    id: true,
    fullName: true,
    email: true,
    phone: true,
    validated: true,
    menu: true,
    allergy: true,
    needs_hotel: true,
    needs_transport: true,
    disability: true,
    observations: true,
    accommodation_plan: true,
    isMainGuest: true,
    tags: true,
  };

  const userId = 4;

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <Routes>
        <Route path="/" element={<PublicView userId={userId} />} />
        <Route path="/login" element={<LoginView />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route
              path="/guests"
              element={<GuestView visibleColumns={guestViewColumns} />}
            />
            <Route path="/tags" element={<TagView />} />
            <Route path="/profile" element={<ProfileView />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
