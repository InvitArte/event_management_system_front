// src/context/BackgroundImageContext.jsx
import { createContext, useState, useContext } from "react";

// creamos el contexto
const BackgroundImageContext = createContext();

// proveedor del contexto
export const BackgroundImageProvider = ({ children }) => {
  const [backgroundImages, setBackgroundImages] = useState({
    frontPage: null,
    countdown: null,
    eventDetails: null,
    collaboration: null,
  });

  const setBackgroundImage = (component, src) => {
    setBackgroundImages((prevState) => ({
      ...prevState,
      [component]: src,
    }));
  };

  return (
    <BackgroundImageContext.Provider
      value={{ backgroundImages, setBackgroundImage }}
    >
      {children}
    </BackgroundImageContext.Provider>
  );
};

// hook para usar el contexto
export const useBackgroundImage = () => useContext(BackgroundImageContext);
