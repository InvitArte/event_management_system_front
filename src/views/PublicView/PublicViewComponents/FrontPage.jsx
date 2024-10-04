import React, { useEffect } from "react";
import { useBackgroundImage } from "../../../context";
import "../../../styles/PublicView/FrontPage.css";
import logo from "../../../assets/imgs/logo.png";

const FrontPage = () => {
  const { backgroundImages, setBackgroundImage } = useBackgroundImage();

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const imageModule = await import(
          "../../../assets/imgs/front-page-background.jpg"
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
        <h1>PRESENTACIÓN NUEVA COLECCIÓN</h1>
        <div className="container-logo">
          <h2>Germinar</h2>
          <img src={logo} alt="Logo" className="logo" />
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
