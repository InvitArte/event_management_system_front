import React, { useState, useEffect } from "react";
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
import api from "./services/Api";
import { defaultConfig } from "./config/Config";

const App = () => {
  const [userConfig, setUserConfig] = useState(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserConfig = async () => {
      try {
        setIsLoading(true);
        const config = await api.userConfig.getUserConfig();
        setUserConfig(config);
      } catch (error) {
        console.error("Error fetching user config:", error);
        // Si hay un error, mantenemos la configuración por defecto
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserConfig();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // O un componente de carga más elaborado
  }

  return (
    <BackgroundImageProvider>
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
    </BackgroundImageProvider>
  );
};

export default App;
