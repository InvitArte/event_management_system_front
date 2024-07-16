import React from "react";
import ReactDOM from "react-dom/client";
import FrontPage from "./components/PublicView/FrontPage.jsx";
import Countdown from "./components/PublicView/Countdown.jsx";
import EventDetails from "./components/PublicView/EventDetails.jsx";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FrontPage />
    <Countdown />
    <EventDetails />
  </React.StrictMode>
);
