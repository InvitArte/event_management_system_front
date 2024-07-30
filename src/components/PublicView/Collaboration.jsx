// src/components/PublicView/Collaboration.jsx
import React, { useEffect } from "react";
import logo from "../../assets/imgs/logo_eslogan.png";
import sello from "../../assets/imgs/sello.png";
import "../../styles/PublicView/Collaboration.css";
import { useBackgroundImage } from "../../context/BackgroundImageContext";

const Collaboration = () => {
  const { backgroundImages, setBackgroundImage } = useBackgroundImage();

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        // Cargar la imagen de fondo de manera dinamica
        const imageModule = await import("../../assets/imgs/collaboration.jpg");
        setBackgroundImage("collaboration", imageModule.default);
      } catch (error) {
        console.error(
          "Error loading background image:",
          error.message || error
        );
      }
    };
    loadBackgroundImage();
  }, [setBackgroundImage]);

  return (
    <div
      className="collaboration"
      style={{ backgroundImage: `url(${backgroundImages.collaboration})` }}
    >
      <div className="collaboration-overlay">
        <h3>EN COLABORACIÓN CON</h3>
        <img src={logo} alt="Logo" className="collaboration-logo" />
        <img src={sello} alt="Sello" className="collaboration-sello" />
      </div>
    </div>
  );
};

export default Collaboration;
