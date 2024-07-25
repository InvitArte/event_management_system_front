import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
<<<<<<< HEAD
import ProtectedRoute from "./components/Utils/ProtectedRoute";
import PublicView from "./views/PublicView";
import LoginView from "./views/LoginView";
=======
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicView from "./views/PublicView";
import LoginView from "./views/LoginView";
import GuestView from "./views/GuestView";
import TagView from "./views/TagView";
import ProfileView from "./views/ProfileView";
import ProtectedRoute from "./components/Utils/ProtectedRoute";
import ProtectedLayout from "./components/Utils/ProtectedLayout";
import {
  userId,
  guestViewColumns,
  guestViewFilters,
  guestFormFields,
  profileViewFields,
} from "./config/Config";
>>>>>>> 0fdac939f07f34368a85da7eb5f19cafde1f153f

const App = () => {
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
<<<<<<< HEAD
        {/* Aquí dentro iran las rutas protegidas */}
        <Route element={<ProtectedRoute />}></Route>
=======
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route
              path="/guests"
              element={
                <GuestView
                  visibleColumns={guestViewColumns}
                  visibleFilters={guestViewFilters}
                  visibleFormFields={guestFormFields}
                />
              }
            />
            <Route path="/tags" element={<TagView />} />
            <Route
              path="/profile"
              element={<ProfileView visibleFields={profileViewFields} />}
            />
          </Route>
        </Route>
>>>>>>> 0fdac939f07f34368a85da7eb5f19cafde1f153f
      </Routes>
    </Router>
  );
};

export default App;
