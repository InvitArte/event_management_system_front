// React y bibliotecas de terceros
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Componentes propios
import AppContent from "./AppContent";

// Contextos propios
import { BackgroundImageProvider, UserConfigProvider } from "./context";

// Estilos
import "react-toastify/dist/ReactToastify.css";

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
