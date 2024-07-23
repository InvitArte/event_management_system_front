import React, { useRef, useEffect } from "react";
import FrontPage from "../components/PublicView/FrontPage.jsx";
import Countdown from "../components/PublicView/Countdown.jsx";
import EventDetails from "../components/PublicView/EventDetails.jsx";
import Footer from "../components/Ui/Footer.jsx";

const PublicView = () => {
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
    <div
      ref={containerRef}
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      <div
        className="snap-section"
        style={{ height: "100vh", scrollSnapAlign: "start" }}
      >
        <FrontPage />
      </div>
      <div
        className="snap-section"
        style={{ height: "100vh", scrollSnapAlign: "start" }}
      >
        <Countdown />
      </div>
      <div
        className="snap-section"
        style={{ height: "100vh", scrollSnapAlign: "start" }}
      >
        <EventDetails />
      </div>
      <div
        className="snap-section"
        style={{ height: "100vh", scrollSnapAlign: "start" }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default PublicView;
