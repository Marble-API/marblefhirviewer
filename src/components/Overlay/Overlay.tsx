import * as React from "react";
import "./Overlay.scss";

interface OverlayProps {
  showLoading?: boolean;
  children?: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ children, showLoading }) => {
  return (
    <div className="overlay">
      <div className="overlay-content">{showLoading && <p>Loading...</p>}</div>
      {children}
    </div>
  );
};

export default Overlay;
