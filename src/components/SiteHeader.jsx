import "./SiteHeader.css";
import umurangaLogo from "../assets/umuranga.logo/UMURANGA.COM.png";

function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-logo">
        <img
          src={umurangaLogo}
          alt="UMURANGA.COM"
        />
      </div>
    </header>
  );
}

export default SiteHeader;