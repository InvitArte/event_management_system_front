import FrontPage from "../components/PublicView/FrontPage.jsx";
import Countdown from "../components/PublicView/Countdown.jsx";
import EventDetails from "../components/PublicView/EventDetails.jsx";

const PublicView = () => {
  return (
    <>
      <FrontPage />
      <Countdown />
      <EventDetails />
    </>
  );
};

export default PublicView;
