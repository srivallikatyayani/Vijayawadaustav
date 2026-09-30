// Last year's photo slider (built from GALLERY data at runtime) and the curtain raiser YouTube link.
export default function Gallery() {
  return (
    <section className="sheet beyond dark-sec" id="gallery" aria-labelledby="gal-h">
 <div className="wrap gal-head">
  <div><span className="kick" style={{"color": "var(--marigold)"}}>Vijayawada Utsav, last year</span><h2 id="gal-h" className="sp" style={{"marginTop": "14px"}}>Last year's Utsav</h2></div>
  <div className="gal-ctrl"><span className="gal-count" id="galcount" aria-live="polite">01 / 24</span><button className="icon-btn" id="galprev" type="button" aria-label="Previous photo">←</button><button className="icon-btn" id="galnext" type="button" aria-label="Next photo">→</button></div>
 </div>
 <div className="gal rvm" id="gal" role="region" aria-label="Photos from last year's Vijayawada Utsav" tabIndex="0"></div>
 <div className="wrap">
  <div className="gal-prog" aria-hidden="true"><i id="galbar"></i></div>
  <a className="vid rv" href="https://www.youtube.com/live/2DurlDlOLL4?si=8_qszguu5W6IhUHT" target="_blank" rel="noopener" data-cursor="Watch">
   <span className="vid-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>
   <span className="vid-txt"><small>Watch on YouTube</small><b>The 2026 curtain raiser</b><span>The launch of Vijayawada Utsav 2026, streamed live.</span></span>
   <span className="vid-logo" aria-hidden="true"><img className="logo-img" alt="" /></span>
  </a>
  <div className="vtiles">
   <a className="vt vt-yt rv" href="https://www.youtube.com/watch?v=xrbupg3sUtI" target="_blank" rel="noopener" data-cursor="Watch">
    <span className="vt-media">
     <span className="vt-fb" aria-hidden="true"><span className="vt-logo"><img className="logo-img" alt="" /></span></span>
     <img className="vt-img" id="ytthumb" data-src="https://img.youtube.com/vi/xrbupg3sUtI/hqdefault.jpg" alt="Thumbnail of the Vijayawada Utsav video on YouTube" />
     <span className="vt-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span>
    </span>
    <span className="vt-cap"><span className="vc-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span><span className="vc-txt"><small>Watch on YouTube</small><b>Vijayawada Utsav on video</b></span><span className="vc-ar" aria-hidden="true">↗</span></span>
   </a>
   <div className="vt vt-ig rv">
    <div className="vt-media vt-reel" id="igmedia">
     <a className="vt-fb" href="https://www.instagram.com/reel/DPOEtmSCSLS/?stkn=MW9xYWhlNThreXY3Mw==" target="_blank" rel="noopener" data-cursor="Watch" aria-label="Watch the reel on Instagram"><span className="vt-logo"><img className="logo-img" alt="" /></span><span className="vt-play vt-play-ig"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.9"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.9"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg></span></a>
    </div>
    <a className="vt-cap" href="https://www.instagram.com/reel/DPOEtmSCSLS/?stkn=MW9xYWhlNThreXY3Mw==" target="_blank" rel="noopener" data-cursor="Watch"><span className="vc-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.9"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.9"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg></span><span className="vc-txt"><small>Watch on Instagram</small><b>The festival in a reel</b></span><span className="vc-ar" aria-hidden="true">↗</span></a>
   </div>
  </div>
 </div>
</section>
  );
}
