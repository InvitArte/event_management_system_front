import React, { useRef, useEffect } from "react";
import FrontPage from "../components/PublicView/FrontPage.jsx";
import Countdown from "../components/PublicView/Countdown.jsx";
import EventDetails from "../components/PublicView/EventDetails.jsx";
import Collaboration from "../components/PublicView/Collaboration.jsx";
import "../styles/PublicView/Footer.css";

const PublicView = ({ userId }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let isScrolling = false;
    let targetSection = null;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        window.requestAnimationFrame(() => {
          const sections = container.querySelectorAll(".snap-section");
          const containerRect = container.getBoundingClientRect();
          let closestSection = null;
          let minDistance = Infinity;

          sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top - containerRect.top);
            if (distance < minDistance) {
              minDistance = distance;
              closestSection = section;
            }
          });

          if (closestSection && closestSection !== targetSection) {
            targetSection = closestSection;
            closestSection.scrollIntoView({ behavior: "smooth" });
          }

          isScrolling = false;
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef}>
      <FrontPage userId={userId} />
      <Countdown userId={userId} />
      <EventDetails userId={userId} />
      <Collaboration userId={userId} />
      <footer className="footer">
        <div className="footer-content">
          <p>
            Los datos de carácter personal que proporcione en el presente
            formulario serán tratados por J Roldán Atelier como responsable de
            este evento. Sus datos no se compartirán con ninguna empresa
            participante, patrocinadores, colaboradores u otros.
          </p>
          <p>
            <a
              href="https://www.jroldanatelier.com/politica-privacidad/"
              className="footer-link"
            >
              Política de Privacidad
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicView;
