// Fixed Register button plus floating WhatsApp and Instagram buttons.
export default function Dock() {
  return (
    <>
<div className="dock" id="dock">
 <a className="tk tk-sm mag burst dock-reg" href="#register" data-cursor="Register"><span className="tk-main"><span className="tk-l t">Register now</span><i className="tk-shine" aria-hidden="true"></i></span><span className="tk-stub" aria-hidden="true"><i className="tk-ring"></i><i className="tk-ar">→</i></span></a>
 <div className="dock-soc">
  <button className="soc soc-lang mag" id="soclang" type="button" data-cursor="Language" aria-label="Switch to Telugu" lang="te">తె</button>
  <a className="soc soc-wa mag" href="https://chat.whatsapp.com/GVGs7ABgrvALMh6cOLvZC8" target="_blank" rel="noopener" aria-label="Join the official WhatsApp group" data-cursor="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.6l1.3-4.3A8.6 8.6 0 1 1 7.8 19.4z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"/><path d="M9 8.1c.3-.6.6-.6.9-.6h.6c.2 0 .4.1.5.4l.8 1.8c.1.2 0 .5-.1.6l-.6.7c.6 1.2 1.6 2.2 2.8 2.8l.7-.6c.2-.2.4-.2.6-.1l1.8.8c.3.1.4.3.4.5v.6c0 .3 0 .6-.6.9-.6.3-1.8.6-3.6-.3-1.8-.9-3.3-2.4-4.2-4.2-.9-1.8-.6-3-.3-3.6z" fill="currentColor"/></svg></a>
  <a className="soc soc-ig mag" href="https://www.instagram.com/jignasa_artverse/" target="_blank" rel="noopener" aria-label="JIGNASA Artverse on Instagram" data-cursor="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.9"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.9"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg></a>
 </div>
</div>
    </>
  );
}
