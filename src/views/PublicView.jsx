import FrontPage from "../components/PublicView/FrontPage.jsx";
import Countdown from "../components/PublicView/Countdown.jsx";
import EventDetails from "../components/PublicView/EventDetails.jsx";
import Footer from "../components/Ui/Footer.jsx";

const PublicView = () => {
  return (
    <>
      <FrontPage />
      <Countdown />
      <EventDetails />
      <Footer />
    </>
  );
};

export default PublicView;
