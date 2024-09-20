import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
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
import { useUserConfig } from "./context/UserConfigContext";
import LoadingComponent from "./components/Ui/LoadingComponent";

const AppContent = () => {
  const { userConfig, isLoading: isConfigLoading } = useUserConfig();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isConfigLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConfigLoading]);

  console.log(
    "AppContent - userConfig:",
    userConfig,
    "isLoading:",
    isLoading,
    "isConfigLoading:",
    isConfigLoading
  );

  const loadingType = location.pathname === "/carmen" ? "svg" : "bar";

  if (isLoading || isConfigLoading || !userConfig) {
    return <LoadingComponent isLoading={true} type={loadingType} />;
  }

  return (
    <>
      <LoadingComponent isLoading={isLoading} type={loadingType} />
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

export default AppContent;
