// React y hooks
import React, { useState, useEffect } from "react";

// React Router
import { Route, Routes, useLocation } from "react-router-dom";

// Componentes propios
import { ProtectedRoute, ProtectedLayout, LoadingComponent } from "./components";

// Vistas
import {
  CarmenView,
  LoginView,
  GuestView,
  TagView,
  ContactView,
  ProfileView,
  SettingsView,
  NotFoundView,
  PublicView
} from "./views";

// Hooks personalizados y contexto
import { useUserConfig } from "./context";

const AppContent = () => {
  const { userConfig, isLoading: isConfigLoading } = useUserConfig();
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isConfigLoading && userConfig) {
      setIsInitialLoad(false);
    }
  }, [isConfigLoading, userConfig]);

  if (isInitialLoad) {
    return <LoadingComponent isLoading={true} type="bar" />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<CarmenView userId={userConfig?.userId} />} />
        {/* <Route path="/public" element={<PublicView />} /> ahora mismo es la del desfile en master*/}
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