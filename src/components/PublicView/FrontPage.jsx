import React, { useEffect } from "react";
import { useBackgroundImage } from "../../context/BackgroundImageContext";
import "../../styles/PublicView/FrontPage.css";
import logo from "../../assets/imgs/logo.png";

const FrontPage = () => {
  const { backgroundImages, setBackgroundImage } = useBackgroundImage();

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
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
      className="front-page snap-section"
      style={{ backgroundImage: `url(${backgroundImages.frontPage})` }}
    >
      <div className="frontPage-overlay">
        <h1>Lucas y Marina</h1>
        <h2>¡NOS CASAMOS!</h2>
        <p>
          Y NADA NOS HARÍA MÁS FELICES QUE CONTAR CON VOSOTROS EN ESTE DÍA TAN
          ESPECIAL.
        </p>
      </div>
    </div>
  );
};

export default FrontPage;
