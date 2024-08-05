import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicView from "./views/PublicView";
import LoginView from "./views/LoginView";
import GuestView from "./views/GuestView";
import ContactView from "./views/ContactView";
import TagView from "./views/TagView";
import ProfileView from "./views/ProfileView";
import SettingsView from "./views/SettingsView";
import ProtectedRoute from "./components/Utils/ProtectedRoute";
import ProtectedLayout from "./components/Utils/ProtectedLayout";
import { BackgroundImageProvider } from "./context/BackgroundImageContext";
import { UserConfigProvider, useUserConfig } from "./context/UserConfigContext";
import { LinearProgress } from "@mui/material";

const AppContent = () => {
  const { userConfig, isLoading } = useUserConfig();

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <Routes>
        <Route path="/" element={<PublicView userId={userConfig.userId} />} />
        <Route path="/login" element={<LoginView />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route
              path="/guests"
              element={
                <GuestView
                  visibleColumns={userConfig.guestViewColumns}
                  visibleFilters={userConfig.guestViewFilters}
                  visibleFormFields={userConfig.guestFormFields}
                />
              }
            />
            <Route path="/tags" element={<TagView />} />
            <Route path="/contacts" element={<ContactView />} />
            <Route
              path="/profile"
              element={
                <ProfileView visibleFields={userConfig.profileViewFields} />
              }
            />
            <Route path="/settings" element={<SettingsView />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <BackgroundImageProvider>
      <UserConfigProvider>
        <AppContent />
      </UserConfigProvider>
    </BackgroundImageProvider>
  );
};

export default App;
