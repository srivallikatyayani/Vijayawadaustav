// Sticky navigation and the full-screen mobile menu.
export default function Nav() {
  return (
    <>
<header className="nav" id="nav">
 <div className="wrap">
  <a className="brand" href="#top" aria-label="Vijayawada Utsav, back to top"><img className="logo-img" alt="" /><span><b>Utsav 2026</b><small>Competitions</small></span></a>
  <nav aria-label="Main"><ul className="nav-links">
   <li><a href="#programmes">Titles</a></li><li><a href="#explore">Competitions</a></li><li><a href="#gallery">Last year</a></li><li><a href="#rules">Dates &amp; rules</a></li>
  </ul></nav>
  <div className="lang" id="lang" data-l="en" role="group" aria-label="Language"><i className="lang-ind" aria-hidden="true"></i><button type="button" className="lang-b" data-lang="en" lang="en" aria-pressed="true" aria-label="English"><span>EN</span></button><button type="button" className="lang-b" data-lang="te" lang="te" aria-pressed="false" aria-label="తెలుగు"><span className="lg-l">తెలుగు</span><span className="lg-s">తె</span></button></div>
  <button className="menu-btn" id="menubtn" aria-expanded="false" aria-controls="menu" aria-label="Open menu"><span></span><span></span></button>
 </div>
</header>
<div className="menu" id="menu" aria-label="Menu">
 <ul>
  <li><a href="#programmes" style={{"--i": "0"}}>Titles</a></li><li><a href="#explore" style={{"--i": "1"}}>Competitions</a></li><li><a href="#gallery" style={{"--i": "2"}}>Last year</a></li><li><a href="#register" style={{"--i": "3"}}>Register</a></li><li><a href="#rules" style={{"--i": "4"}}>Dates &amp; rules</a></li>
 </ul>
 <p>8–12 October 2026<br />Tummalapalli Kalakshetram, Vijayawada</p>
</div>
    </>
  );
}
