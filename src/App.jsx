import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicView from "./views/PublicView";
import CarmenView from "./views/CarmenView";
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
import LoadingComponent from "./components/Ui/LoadingComponent";

const AppContent = () => {
  const { userConfig, isLoading: isConfigLoading } = useUserConfig();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConfigLoading) {
      // Simula un tiempo de carga adicional
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConfigLoading]);

  const loadingType = location.pathname === "/carmen" ? "svg" : "bar";

  return (
    <>
      <LoadingComponent isLoading={isLoading} type={loadingType} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
      />
      <Routes>
        <Route
          path="/carmen"
          element={
            <CarmenView userId={userConfig.userId} isLoading={isLoading} />
          }
        />
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
    </>
  );
};

const App = () => {
  return (
    <BackgroundImageProvider>
      <UserConfigProvider>
        <Router>
          <AppContent />
        </Router>
      </UserConfigProvider>
    </BackgroundImageProvider>
  );
};

export default App;
