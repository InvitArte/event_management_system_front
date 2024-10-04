import React, { useEffect, useState } from "react";
import logo from "../../../assets/imgs/logo_eslogan.png";
import sello from "../../../assets/imgs/sello.png";
import "../../../styles/PublicView/Collaboration.css";
import { useBackgroundImage } from "../../../context";

const Collaboration = () => {
  const { backgroundImages, setBackgroundImage } = useBackgroundImage();
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadBackgroundImage = async () => {
      try {
        const imageModule = await import("../../../assets/imgs/collaboration.jpg");
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

  useEffect(() => {
    const logoImg = new Image();
    const selloImg = new Image();
    let mounted = true;

    Promise.all([
      new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.src = logo;
      }),
      new Promise((resolve) => {
        selloImg.onload = resolve;
        selloImg.src = sello;
      }),
    ]).then(() => {
      if (mounted) setImagesLoaded(true);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      className="collaboration snap-section"
      style={{ backgroundImage: `url(${backgroundImages.collaboration})` }}
    >
      <div className="collaboration-overlay">
        <h3>EN COLABORACIÓN CON</h3>
        {imagesLoaded && (
          <>
            <img src={logo} alt="Logo" className="collaboration-logo" />
            <img src={sello} alt="Sello" className="collaboration-sello" />
          </>
        )}
      </div>
    </div>
  );
};

export default Collaboration;
