import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import CarmenView from "./views/CarmenView/CarmenView";
import LoginView from "./views/LoginView/LoginView";
import GuestView from "./views/GuestView/GuestView";
import ContactView from "./views/CoctactView/ContactView";
import TagView from "./views/TagView";
import ProfileView from "./views/ProfileView/ProfileView";
import SettingsView from "./views/SettingsView/SettingsView";
import NotFoundView from "./views/NotFoundView/NotFoundView";
import ProtectedRoute from "./components/Utils/ProtectedRoute";
import ProtectedLayout from "./components/Utils/ProtectedLayout";
import { useUserConfig } from "./context/UserConfigContext";
import LoadingComponent from "./components/Ui/LoadingComponent";

const AppContent = () => {
  const { userConfig, isLoading: isConfigLoading } = useUserConfig();
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isConfigLoading && userConfig) {
      setIsInitialLoad(false);
    }
  }, [isConfigLoading, userConfig]);


  // Show loading only during initial load
  if (isInitialLoad) {
    return <LoadingComponent isLoading={true} type="bar" />;
  }

  return (
    <>
      {/* Remove LoadingComponent from here */}
      <Routes>
        <Route path="/" element={<CarmenView userId={userConfig?.userId} />} />
        <Route path="/login" element={<LoginView />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route
              path="/guests"
              element={
                <GuestView
                  visibleColumns={userConfig?.guestViewColumns}
                  visibleFilters={userConfig?.guestViewFilters}
                  visibleFormFields={userConfig?.guestFormFields}
                />
              }
            />
            <Route path="/tags" element={<TagView />} />
            <Route path="/contacts" element={<ContactView />} />
            <Route
              path="/profile"
              element={
                <ProfileView visibleFields={userConfig?.profileViewFields} />
              }
            />
            <Route path="/settings" element={<SettingsView />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </>
  );
};

export default AppContent;