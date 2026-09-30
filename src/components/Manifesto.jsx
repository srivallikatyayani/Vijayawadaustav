// Pinned statement whose words light up on scroll, plus the at-a-glance stats and theme.
export default function Manifesto() {
  return (
    <>
<section className="sheet mani dark-sec" id="about" aria-labelledby="mani-h">
 <div className="mani-stick">
  <div className="te-bg" id="tebg" aria-hidden="true" lang="te">ఉత్సవ్</div>
  <div className="wrap" style={{"position": "relative"}}>
   <h2 className="sr" id="mani-h">About the competitions</h2>
   <p className="mani-text" id="mani">Five days. Forty-six competitions. Seven titles. From six-year-olds to sixty-plus, the whole city takes the stage.</p>
   <p className="mani-side muted">Vijayawada Utsav Contests is being organised by the Society for Vibrant Vijayawada, Government of Andhra Pradesh – Department of Tourism, and the Office of the Hon’ble Member of Parliament, Vijayawada Constituency, in association with JIGNASA Artverse, South India’s Largest Culture Education Company.</p>
  </div>
 </div>
</section>
<div className="stats dark-sec" aria-label="At a glance">
 <div className="wrap">
  <div className="stat-row rv">
   <div className="stat"><span className="n" data-count="46">46</span><span className="l">competitions</span></div>
   <div className="stat"><span className="n" data-count="7">7</span><span className="l">titles</span></div>
   <div className="stat"><span className="n" data-count="5">5</span><span className="l">days, 8–12 October</span></div>
   <div className="stat"><span className="n" data-count="3">3</span><span className="l">age categories</span></div>
  </div>
  <div className="themes rv"><b>This year's theme</b><span>Dussehra</span><span>Devi avatars</span><span>Vijayawada heritage</span><span>Telugu culture &amp; tradition</span></div>
 </div>
</div>
    </>
  );
}
