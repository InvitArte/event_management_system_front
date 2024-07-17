import logo from "../../assets/imgs/logo.png";
import "../../styles/PublicView/FrontPage.css";
const PublicView = () => {
  return (
    <div className="front-page">
      <div className="frontPage-overlay">
        <h2>Nueva colección</h2>
        <h1>-nombre-</h1>
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default PublicView;
