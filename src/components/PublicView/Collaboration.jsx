import logo from "../../assets/imgs/logo_eslogan.png";
import "../../styles/PublicView/Collaboration.css";
const Collaboration = () => {
  return (
    <div className="collaboration">
      <div className="collaboration-overlay">
        <h3>EN COLARORACIÓN CON</h3>
        <img src={logo} alt="Logo" className="collaboration-logo" />
      </div>
    </div>
  );
};

export default Collaboration;
