import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BackgroundImageProvider } from "./context/BackgroundImageContext";
import { UserConfigProvider } from "./context/UserConfigContext";
import AppContent from "./AppContent";

const App = () => {
  return (
    <BackgroundImageProvider>
      <UserConfigProvider>
        <Router>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
          />
          <AppContent />
        </Router>
      </UserConfigProvider>
    </BackgroundImageProvider>
  );
};

export default App;
