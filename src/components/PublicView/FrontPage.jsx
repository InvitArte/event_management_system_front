// src/components/PublicView.jsx
import { useEffect } from "react";
import { useBackgroundImage } from "../../context/BackgroundImageContext";
import "../../styles/PublicView/FrontPage.css";
import logo from "../../assets/imgs/logo.png";

const PublicView = () => {
  const { backgroundImages, setBackgroundImage } = useBackgroundImage();

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        // Cargar la imagen de fondo de manera dinámica
        const imageModule = await import(
          "../../assets/imgs/front-page-background.jpg"
        );
        setBackgroundImage("frontPage", imageModule.default);
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
      className="front-page"
      style={{ backgroundImage: `url(${backgroundImages.frontPage})` }}
    >
      <div className="frontPage-overlay">
        <h1>PRESENTACIÓN NUEVA COLECCIÓN</h1>
        <div className="container-logo">
          <h2>Germinar</h2>
          <img src={logo} alt="Logo" className="logo" />
        </div>
      </div>
    </div>
  );
};

export default PublicView;
