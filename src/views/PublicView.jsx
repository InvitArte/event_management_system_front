import React, { useRef, useEffect } from "react";
import FrontPage from "../components/PublicView/FrontPage.jsx";
import Countdown from "../components/PublicView/Countdown.jsx";
import EventDetails from "../components/PublicView/EventDetails.jsx";
import Collaboration from "../components/PublicView/Collaboration.jsx";
import "../styles/PublicView/Footer.css";
import { useUserConfig } from "../context/UserConfigContext";
import { defaultConfig } from "../config/Config";

const PublicView = () => {
  const containerRef = useRef(null);
  const { userConfig } = useUserConfig();

  const effectiveUserId = userConfig?.userId || defaultConfig.userId;

  useEffect(() => {
    const container = containerRef.current;
    let isScrolling = false;
    let lastScrollTop = 0;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        window.requestAnimationFrame(() => {
          const sections = Array.from(
            container.querySelectorAll(".snap-section")
          );
          const containerRect = container.getBoundingClientRect();
          const currentScrollTop = container.scrollTop;
          const scrollDirection = currentScrollTop > lastScrollTop ? 1 : -1;

          const visibleSections = sections.filter((section) => {
            const rect = section.getBoundingClientRect();
            return (
              rect.top < containerRect.bottom && rect.bottom > containerRect.top
            );
          });

          if (visibleSections.length > 0) {
            const targetSection =
              scrollDirection > 0
                ? visibleSections[visibleSections.length - 1]
                : visibleSections[0];

            targetSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }

          lastScrollTop = currentScrollTop;
          isScrolling = false;
        });
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="public-view-container">
      <FrontPage userId={effectiveUserId} />
      <Countdown userId={effectiveUserId} />
      <EventDetails userId={effectiveUserId} />
      {/* <Collaboration userId={effectiveUserId} /> */}
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
