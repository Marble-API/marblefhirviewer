import { Link } from "react-router-dom";
import "./Layout.scss";

interface ILayout {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayout) => {
  return (
    <>
      <div className="content">
        <div className="menu">
          Views: <Link to="/Resources">Resources</Link> |{" "}
          <Link to="/Prescriptions">Prescriptions</Link>
        </div>
        <div className="main-content">{children}</div>
      </div>
    </>
  );
};

export default Layout;
