import logo from "../../assets/imgs/logo.png";
import "../../styles/PublicView/FrontPage.css";
const PublicView = () => {
  return (
    <div className="front-page">
      <div className="frontPage-overlay">
        <h1>PRESENTACIÓN NUEVA COLECCIÓN</h1>
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default PublicView;
