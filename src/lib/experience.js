// Vijayawada Utsav interaction layer: loader, custom cursor, magnetic buttons, scroll choreography,
// programme panels, competition finder, detail overlay, poster viewer and registration flow.
// Plain JS + Web APIs; no animation library is required.
import { LINKS, FEST, PROGS, EVENTS, GENERAL, GALLERY, IMG, LOGO } from '../data/events.js';
import { TE } from '../data/te.js';

let started = false;
export function initExperience(){
if (started) return; started = true;

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),lerp=(a,b,t)=>a+(b-a)*t;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const root=document.documentElement;
/* ---------- language (English default; Telugu toggle) ---------- */
let lang='en';try{if(localStorage.getItem('vu-lang')==='te')lang='te'}catch(e){}
const t=s=>(lang==='te'&&TE[s]!==undefined)?TE[s]:s;
const L=(en,te)=>lang==='te'?te:en;
const cnt=n=>L(`${n} competition${n>1?'s':''}`,`${n} పోటీలు`);
const P=Object.fromEntries(PROGS.map(p=>[p.id,p]));
const pname=p=>[p.pre,p.main,p.post].filter(Boolean).map(t).join(' ');
const pnameEn=p=>[p.pre,p.main,p.post].filter(Boolean).join(' ');
const pcount=id=>EVENTS.filter(e=>e.p===id).length;
function rng(seed){let s=seed*9301+49297;return()=>((s=(s*9301+49297)%233280)/233280)}
function edge(seed,n,base,amp){const r=rng(seed),pts=[];for(let i=0;i<=n;i++)pts.push(`${(i/n*100).toFixed(2)}% ${(base+r()*amp).toFixed(2)}%`);return pts}
const sheet=(seed,base)=>`polygon(${edge(seed,22,base,7).join(',')},100% 100%,0% 100%)`;
const allTorn=(seed,a=2.5)=>{const r=rng(seed),p=[],n=12;for(let i=0;i<=n;i++)p.push(`${i/n*100}% ${r()*a}%`);for(let i=1;i<=n;i++)p.push(`${100-r()*a/2}% ${i/n*100}%`);for(let i=n-1;i>=0;i--)p.push(`${i/n*100}% ${100-r()*a}%`);for(let i=n-1;i>0;i--)p.push(`${r()*a/2}% ${i/n*100}%`);return`polygon(${p.join(',')})`};
root.lang=lang;
root.style.setProperty('--sh-hidden',sheet(5,106));root.style.setProperty('--sh-shown',sheet(5,-9));
root.style.setProperty('--ld-shown',`polygon(0% 0%,100% 0%,${edge(9,22,109,-7).reverse().join(',')})`);
root.style.setProperty('--ld-gone',`polygon(0% 0%,100% 0%,${edge(9,22,-9,-7).reverse().join(',')})`);
root.style.setProperty('--rclip',allTorn(21,2));root.style.setProperty('--fclip',allTorn(3,6));root.style.setProperty('--pclip',allTorn(40,1.2));
$$('.sheet').forEach((s,i)=>s.style.setProperty('--tear',`polygon(${edge(i*7+3,30,15,75).join(',')},100% 100%,0% 100%)`));
$$('.logo-img').forEach(i=>i.src=LOGO);
$$('.head-img').forEach(i=>i.src=IMG.header);
$$('.poster-img').forEach(i=>i.src=IMG[i.dataset.key]);
$$('.xb-fan img').forEach(i=>i.src=IMG[i.dataset.k]);root.style.setProperty('--xclip',allTorn(77,5));
let VH=innerHeight,VW=innerWidth;
const setVH=()=>{VH=innerHeight;VW=innerWidth;root.style.setProperty('--vh',VH/100+'px')};setVH();
let lastW=innerWidth;addEventListener('resize',()=>{if(Math.abs(innerWidth-lastW)>40||!('ontouchstart' in window)){lastW=innerWidth;setVH();layout()}else{VW=innerWidth}});

/* ---------- loader ---------- */
const loader=$('#loader'),hero=$('#top');
let seen=false;try{seen=sessionStorage.getItem('vu-seen')==='1';sessionStorage.setItem('vu-seen','1')}catch(e){}
function startHero(){hero.classList.remove('intro-anim');hero.classList.add('intro-go')}
if(reduce||seen){loader.remove();startHero()}
else{setTimeout(()=>{loader.classList.add('gone');setTimeout(startHero,250);setTimeout(()=>loader.remove(),900)},1150)}

/* ---------- hero collage ---------- */
const collage=$('#collage');
const order=['idol','crown','champs','quiz','talent','family','wonder'];
const spotsMte=[[.00,.00,-5,-1,-1,.5],[.50,.005,4,1,-1,.7],[.00,.665,3,-1.2,.3,.6],[.48,.655,-4,1.2,.3,.5],[.00,.835,-2,-1,1,.7],[.335,.845,3,0,1.2,.4],[.685,.83,-3,1,1,.6]];
const spotsD=[[.02,.06,-6,-1.2,-.8,.5],[.40,-.02,-2,0,-1.3,.3],[.76,.04,5,1.2,-.9,.7],[.00,.43,4,-1.5,0,.8],[.80,.38,-5,1.5,.1,.45],[.03,.76,-3,-1.2,1,.65],[.77,.72,6,1.2,1,.55]];
const spotsM=[[.00,.00,-5,-1,-1,.5],[.50,.005,4,1,-1,.7],[.00,.665,3,-1.2,.3,.6],[.48,.655,-4,1.2,.3,.5],[.00,.835,-2,-1,1,.7],[.33,.845,3,0,1.2,.4],[.64,.83,-3,1,1,.6]];
const swHTML=(p,n)=>`<span class="sw-in">${p.pre?`<span class="pre">${t(p.pre)}</span>`:''}<span class="main">${t(p.main)}</span>${p.post?`<span class="post">${t(p.post)}</span>`:''}<span class="cnt">${cnt(n)}</span></span>`;
const sws=order.map((id,i)=>{const p=P[id],a=document.createElement('a');a.className='sw';a.href='#explore';a.dataset.cursor='Explore';
 a.style.cssText=`--c:${p.color};--i:${i+1};clip-path:${allTorn(i+11,4)}`;a.dataset.pid=id;
 a.addEventListener('click',()=>setProg(id,true));collage.appendChild(a);return a});
function renderSwatches(){sws.forEach(a=>{const p=P[a.dataset.pid],n=pcount(p.id);a.innerHTML=swHTML(p,n);a.setAttribute('aria-label',`${pname(p)}, ${cnt(n)}`)})}
renderSwatches();
const paper=$('#paper'),strip=$('#strip'),bigword=$('#bigword');
paper.style.clipPath=allTorn(99,3);strip.style.clipPath=allTorn(42,8);
let heroGeo=null;
function heroLayout(){const w=collage.clientWidth,h=collage.clientHeight,m=w<760,sp=m?(lang==='te'?spotsMte:spotsM):spotsD;
 heroGeo=sws.map((el,i)=>{const [x,y,r,vx,vy,d]=sp[i];return{el,x:x*w,y:y*h,r,vx,vy,d}});
 if(m){const py=h*.15;paper.dataset.base=JSON.stringify({x:w*.09,y:py});strip.dataset.base=JSON.stringify({x:w*.5,y:py+paper.offsetHeight-18})}else{strip.style.top=(h*.45+paper.offsetHeight/2-26)+'px'}}
/* mouse for hero */
let mx=0,my=0,tmx=0,tmy=0;
if(fine&&!reduce)hero.addEventListener('pointermove',e=>{tmx=e.clientX/VW*2-1;tmy=e.clientY/VH*2-1});

/* countdown */
/* Counts whole calendar days in India time (IST) until 10 October, so it drops by one every midnight IST:
   27 Sep = 13 days, 28 Sep = 12 days, 29 Sep = 11 days ... 9 Oct = 1 day. Rechecks every minute. */
function tickCountdown(){const k=$('#cd-k'),v=$('#cd');
 const today=new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'});
 const dayNum=s=>Date.UTC(+s.slice(0,4),+s.slice(5,7)-1,+s.slice(8,10))/864e5;
 const left=dayNum(FEST.start.slice(0,10))-dayNum(today),end=dayNum(FEST.end.slice(0,10))-dayNum(today);
 if(left>0){k.textContent=L('Starts in','ప్రారంభానికి');v.textContent=L(left+(left===1?' day':' days'),left+(left===1?' రోజు':' రోజులు'))}
 else if(end>=0){k.textContent=L('Status','స్థితి');v.textContent=L('Happening now','ఇప్పుడు జరుగుతోంది')}
 else{k.textContent=L('Status','స్థితి');v.textContent=L('Concluded','ముగిసింది')}}
tickCountdown();setInterval(tickCountdown,60000);

/* ---------- manifesto words ---------- */
const mani=$('#mani');let mwords=[];
const MANI_EN='Five days. Forty-six competitions. Seven titles. From six-year-olds to sixty-plus, the whole city takes the stage.';
const MANI_TE='ఐదు రోజులు. నలభై ఆరు పోటీలు. ఏడు టైటిల్స్. ఆరేళ్ల చిన్నారుల నుంచి అరవై ఏళ్లు దాటిన వారి వరకు, నగరమంతా వేదికపైకి.';
function buildMani(){const HL=L(['Forty-six','Seven','sixty-plus,','six-year-olds'],['నలభై','ఆరు','ఏడు','ఆరేళ్ల','అరవై']);
 mani.innerHTML=L(MANI_EN,MANI_TE).split(' ').map(w=>`<span class="w${HL.includes(w)?' hl':''}">${w}</span>`).join(' ');mwords=$$('#mani .w')}
buildMani();

/* ---------- programme panels ---------- */
const track=$('#track');
function panHTML(p,i){const n=pcount(p.id),segs=[...new Set(EVENTS.filter(e=>e.p===p.id).map(e=>e.seg))];
 return `<div class="post-wrap"><button class="pimg tilt" type="button" data-view="comp:${i}" data-cursor="View" aria-label="${esc(L('View the '+pname(p)+' poster',pname(p)+' పోస్టర్‌ను చూడండి'))}"><img src="${IMG[p.poster]}" alt="" loading="lazy"></button></div>
 <div><span class="pno">${L('Title '+(i+1)+' of 7','టైటిల్ '+(i+1)+' / 7')}</span><h3>${p.pre?`<small>${t(p.pre)}</small>`:''}${t(p.main)}${p.post?`<small>${t(p.post)}</small>`:''}</h3>
 <p class="ptag">${esc(t(p.tag))}. ${cnt(n)}.</p><ul class="segs">${segs.map(s=>`<li>${esc(t(s))}</li>`).join('')}</ul>
 <a class="btn btn-line mag" href="#explore" data-cursor="Explore" data-prog="${p.id}"><span class="t">${n>1?L('See all '+n,'మొత్తం '+n+' పోటీలు చూడండి'):L('See the competition','పోటీని చూడండి')}</span><span class="ar" aria-hidden="true"></span></a></div>`}
const endHTML=()=>`<div><span class="kick" style="color:var(--marigold)">${L('All seven titles','మొత్తం ఏడు టైటిల్స్')}</span><h3 style="margin:14px 0 22px">${L('46 ways in. Find yours.','46 అవకాశాలు. మీదైనది కనుగొనండి.')}</h3><a class="btn btn-gold mag burst" href="#explore" data-cursor="Explore"><span class="t">${L('Browse every competition','అన్ని పోటీలను చూడండి')}</span><span class="ar" aria-hidden="true"></span></a></div>`;
const panEls=PROGS.map((p,i)=>{const d=document.createElement('article');d.className='pan pan-p';d.style.setProperty('--c',p.color);d.style.clipPath='';track.appendChild(d);return d});
const endP=document.createElement('div');endP.className='pan pan-end';track.appendChild(endP);
function renderPanels(){panEls.forEach((d,i)=>{d.innerHTML=panHTML(PROGS[i],i)});endP.innerHTML=endHTML()}
renderPanels();
track.addEventListener('click',e=>{const a=e.target.closest('[data-prog]');if(a)setProg(a.dataset.prog,true)});
const progsSec=$('#programmes'),pstick=$('#pstick'),pword=$('#pword'),pans=$$('.pan-p');
let progNative=false;
function progLayout(){progNative=reduce||VW<760;progsSec.classList.toggle('native',progNative);$('#phint').innerHTML=(progNative?L('Swipe sideways','పక్కకు స్వైప్ చేయండి'):L('Keep scrolling','స్క్రోల్ చేస్తూ ఉండండి'))+' <i></i>';
 if(!progNative){progsSec.style.height=(track.scrollWidth-VW+VH)+'px'}else{progsSec.style.height='';pans.forEach(p=>p.style.setProperty('--rv',1))}}
if(progNative||true)pstick.addEventListener('scroll',()=>{if(progNative)pans.forEach(p=>{const r=p.getBoundingClientRect();p.style.setProperty('--rv',clamp((VW-r.left)/(VW*.7)).toFixed(3))})},{passive:true});

/* ---------- explorer ---------- */
const st={prog:'all',seg:'all',q:''};
const tabs=$('#tabs'),ind=$('#tabind'),rowsEl=$('#rows');
function renderTabs(){tabs.querySelectorAll('.tab').forEach(x=>x.remove());
 tabs.insertAdjacentHTML('beforeend',[`<button class="tab" role="tab" data-id="all" aria-selected="${st.prog==='all'}" tabindex="${st.prog==='all'?0:-1}" style="--c:var(--marigold)"><i style="--c:var(--marigold)"></i>${L('All','అన్నీ')}<sup>${EVENTS.length}</sup></button>`,...PROGS.map(p=>`<button class="tab" role="tab" data-id="${p.id}" aria-selected="${st.prog===p.id}" tabindex="${st.prog===p.id?0:-1}" style="--c:${p.color}"><i></i>${esc(pname(p))}<sup>${pcount(p.id)}</sup></button>`)].join(''))}
renderTabs();
function moveInd(){const t=tabs.querySelector('[aria-selected="true"]');ind.style.width=t.offsetWidth+'px';ind.style.transform=`translateX(${t.offsetLeft}px)`;ind.style.setProperty('--c',t.style.getPropertyValue('--c'))}
tabs.addEventListener('click',e=>{const t=e.target.closest('.tab');if(t)setProg(t.dataset.id,false)});
tabs.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft'].includes(e.key))return;const ts=$$('.tab'),i=ts.findIndex(t=>t.getAttribute('aria-selected')==='true'),n=ts[(i+(e.key==='ArrowRight'?1:-1)+ts.length)%ts.length];setProg(n.dataset.id,false);n.focus()});
function setProg(id,jump){st.prog=id;st.seg='all';$$('.tab').forEach(t=>{const on=t.dataset.id===id;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;if(on)tabs.scrollTo({left:t.offsetLeft-tabs.clientWidth/2+t.offsetWidth/2,behavior:reduce?'auto':'smooth'})});moveInd();refresh();
 if(id!=='all')setFeat(id,null);else setFeat(featProg||'idol',null);if(typeof restartTick==='function')restartTick()}
const q=$('#q'),qc=$('#qclear');let qt;
q.addEventListener('input',()=>{qc.hidden=!q.value;clearTimeout(qt);qt=setTimeout(()=>{st.q=q.value.trim().toLowerCase();refresh()},140)});
qc.onclick=()=>{q.value='';qc.hidden=true;st.q='';refresh();q.focus()};
$('#segs').addEventListener('click',e=>{const c=e.target.closest('.segchip');if(c){st.seg=c.dataset.seg;refresh()}});
/* search haystack holds both English and Telugu text, so either language finds a competition */
EVENTS.forEach(e=>{const f=[e.name,e.desc,e.seg,e.fmt,pnameEn(P[e.p]),e.elig||'',e.aka||'',...e.rules];e._h=[...f,...f.map(x=>TE[x]!==undefined?TE[x]:''),...[P[e.p].pre,P[e.p].main,P[e.p].post].map(x=>x&&TE[x]?TE[x]:'')].join(' ').toLowerCase()});
let current=[];
function filtered(){const w=st.q.split(/\s+/).filter(Boolean);return EVENTS.filter(e=>(st.prog==='all'||e.p===st.prog)&&(st.seg==='all'||e.seg===st.seg)&&w.every(x=>e._h.includes(x)))}
function rowHTML(e,i){const p=P[e.p];return`<li class="row enter" style="--c:${p.color};transition-delay:${Math.min(i,14)*30}ms"><button class="row-btn" type="button" data-n="${e.n}" data-cursor="Explore"><span class="r-no">${String(e.n).padStart(2,'0')}</span><span class="r-name">${esc(t(e.name))}</span><span class="r-desc">${esc(t(e.desc))}${st.prog==='all'?` <span class="sr">, ${esc(pname(p))}</span>`:''}</span><span class="r-meta"><span>${esc(t(e.fmt))}</span>${e.time?`<span>${esc(t(e.time))}</span>`:''}<i class="r-go" aria-hidden="true">→</i></span></button></li>`}
function refresh(){
 const inProg=EVENTS.filter(e=>st.prog==='all'||e.p===st.prog),segs=st.prog==='all'?[]:[...new Set(inProg.map(e=>e.seg))];
 $('#segs').innerHTML=segs.length>1?[['all',L('All','అన్నీ')],...segs.map(s=>[s,t(s)])].map(([v,l])=>`<button class="segchip" data-seg="${esc(v)}" aria-pressed="${st.seg===v}">${esc(l)}</button>`).join(''):'';
 current=filtered();
 $('#rmeta').textContent=L(`${current.length} competition${current.length===1?'':'s'}${st.prog==='all'?'':' in '+pname(P[st.prog])}${st.q?` matching “${q.value.trim()}”`:''}`,`${st.prog==='all'?'':pname(P[st.prog])+'\u200cలో '}${current.length} పోటీలు${st.q?` — “${q.value.trim()}” కోసం`:''}`);
 const old=$$('#rows .row');rowsEl.style.minHeight=rowsEl.offsetHeight+'px';old.forEach(r=>r.classList.add('out'));
 setTimeout(()=>{rowsEl.innerHTML=current.length?current.map(rowHTML).join(''):`<li class="empty"><p>${L('Nothing matches “'+esc(q.value.trim())+'” here.','ఇక్కడ “'+esc(q.value.trim())+'”కు సరిపోయేది ఏదీ లేదు.')}</p><button class="btn btn-line" type="button" id="reset"><span class="t">${L('Show all competitions','అన్ని పోటీలను చూపించు')}</span><span class="ar" aria-hidden="true"></span></button></li>`;
  const r=$('#reset');if(r)r.onclick=()=>{q.value='';qc.hidden=true;st.q='';setProg('all')};
  requestAnimationFrame(()=>requestAnimationFrame(()=>{$$('#rows .row').forEach(r=>r.classList.remove('enter'));rowsEl.style.minHeight=''}))},old.length&&!reduce?200:0)}
rowsEl.addEventListener('click',e=>{const b=e.target.closest('.row-btn');if(b)openOv(+b.dataset.n,b)});
/* featured poster */
const fframe=$('#fframe'),fBase=$('#fimg'),fTop=document.createElement('img'),fTick=document.createElement('i');
fTop.className='nx';fTop.alt='';fTick.className='feat-tick';fframe.append(fTop,fTick);
let featProg=null,swapT=null,hoverList=false,loopI=0;
function showPoster(pid){if(featProg===pid)return;featProg=pid;const src=IMG[P[pid].poster];
 if(reduce||!fBase.getAttribute('src')){fBase.src=src;return}
 clearTimeout(swapT);fTop.style.transition='none';fTop.classList.remove('go');fTop.src=src;void fTop.offsetWidth;fTop.style.transition='';fTop.classList.add('go');
 swapT=setTimeout(()=>{fBase.src=src;fTop.style.transition='none';fTop.classList.remove('go');void fTop.offsetWidth;fTop.style.transition=''},600)}
function setFeat(pid,name){const p=P[pid];$('#fprog').textContent=pname(p);$('#fprog').style.setProperty('--c',p.color);
 const fn=$('#fname');const txt=name||cnt(pcount(pid));if(fn.textContent!==txt){fn.classList.add('sw8');setTimeout(()=>{fn.textContent=txt;fn.classList.remove('sw8')},150)}
 showPoster(pid)}
/* continuous poster loop: cycles all programme posters while browsing "All"; holds on the chosen programme otherwise */
const LOOP_MS=3600;
function restartTick(){fTick.classList.remove('run');void fTick.offsetWidth;if(st.prog==='all'&&!hoverList&&!reduce)fTick.classList.add('run')}
setInterval(()=>{if(hoverList||document.hidden||st.prog!=='all')return;const r=fframe.getBoundingClientRect();if(r.bottom<0||r.top>VH)return;
 loopI=(PROGS.findIndex(p=>p.id===featProg)+1)%PROGS.length;setFeat(PROGS[loopI].id,null);restartTick()},LOOP_MS);
rowsEl.addEventListener('pointerover',e=>{const b=e.target.closest('.row-btn');if(!b)return;const ev=EVENTS.find(x=>x.n===+b.dataset.n);setFeat(ev.p,t(ev.name))});
rowsEl.addEventListener('focusin',e=>{const b=e.target.closest('.row-btn');if(!b)return;const ev=EVENTS.find(x=>x.n===+b.dataset.n);setFeat(ev.p,t(ev.name))});
rowsEl.addEventListener('pointerenter',()=>{hoverList=true;fTick.classList.remove('run')});
rowsEl.addEventListener('pointerleave',()=>{hoverList=false;setFeat(st.prog==='all'?featProg||'idol':st.prog,null);restartTick()});

/* ---------- overlay ---------- */
const ov=$('#ov'),ovs=$('#ovscroll'),ovf=$('#ovfoot');let ovCur=null,ovOpen=false,ovFrom=null;
/* Competition dates (updated schedule): 8 Oct Wonder Women; 9 Oct Crown (Miss, Mrs, Mr, Golden Lady, Jodi) and Senior Nritya/Joru/Udaan; 10–12 Oct everything else. */
function whenFor(e){const d=(en,te)=>L(en,te);
 if(e.p==='wonder')return d('8 Oct','అక్టోబర్ 8');
 if(e.p==='crown'&&[40,41,42,43,44].includes(e.n))return d('9 Oct','అక్టోబర్ 9');
 if([1,2,3].includes(e.n))return d('9 Oct (Seniors), 10–12 Oct (others)','అక్టోబర్ 9 (సీనియర్లు), అక్టోబర్ 10–12 (ఇతరులు)');
 return d('10–12 Oct','అక్టోబర్ 10–12')}
function regInfo(e){const p=P[e.p];if(p.reg==='crown')return{kind:'crown',url:LINKS.crownForm};if(p.reg==='wonder')return{kind:'wonder',url:LINKS.wonderForm};return{kind:'main',url:LINKS.mainForm,section:p.formSection,opt:e.form}}
function fillOv(n){const e=EVENTS.find(x=>x.n===n),p=P[e.p],ri=regInfo(e);ovCur=n;
 ov.style.setProperty('--c',p.color);$('#ovimg').src=IMG[p.poster];$('#ovimg').alt=L(`${pname(p)} poster`,`${pname(p)} పోస్టర్`);$('#ovbig').textContent=t(p.main);
 $('#ovposter').dataset.view='comp:'+PROGS.indexOf(p);$('#ovposter').setAttribute('aria-label',L(`View the ${pname(p)} poster`,`${pname(p)} పోస్టర్‌ను చూడండి`));
 $('#ovcrumb').textContent=L(`${pname(p)}  /  No. ${e.n}`,`${pname(p)}  /  సంఖ్య ${e.n}`);
 const sg=p.guides[e.seg]||p.guides['*']||[],sibs=EVENTS.filter(x=>x.p===e.p);
 const facts=[[L('Title','టైటిల్'),pname(p)],[L('Segment','విభాగం'),t(e.seg)],[L('Format','రూపం'),t(e.fmt)],[L('Time limit','సమయ పరిమితి'),e.time?t(e.time):L('Not specified','పేర్కొనలేదు')],
  [L('Eligibility','అర్హత'),e.elig?t(e.elig):(e.p==='wonder'?L('Women','మహిళలు'):L('Open, judged by age group','అందరికీ; వయస్సు వర్గాల వారీగా న్యాయనిర్ణయం'))],
  [L('When and where','ఎప్పుడు, ఎక్కడ'),whenFor(e)+', '+L('Tummalapalli Kalakshetram','తుమ్మలపల్లి కళాక్షేత్రం')]];
 let i=0;const s=()=>`style="--i:${i++}"`;
 const nm=esc(t(e.name));
 ovs.innerHTML=`<span class="ov-chip st" ${s()}>${esc(pname(p))}</span><h2 class="ov-title st" id="ov-title" ${s()}>${nm}</h2><p class="ov-sub st" ${s()}>${esc(t(e.desc))}</p>
 <dl class="facts st" ${s()}>${facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
 ${e.aka?`<div class="note st" ${s()}>${L('Listed as '+esc(e.aka)+'. Same competition.',esc(t(e.aka))+'. అదే పోటీ.')}</div>`:''}
 ${e.rules.length?`<div class="st" ${s()}><h4>${L('Rules for '+nm,nm+' నియమాలు')}</h4><ul class="rl">${e.rules.map(r=>`<li>${esc(t(r))}</li>`).join('')}</ul></div>`:''}
 ${sg.length?`<div class="st" ${s()}><h4>${L((p.guides['*']?esc(pname(p)):esc(e.seg))+' guidelines',(p.guides['*']?esc(pname(p)):esc(t(e.seg)))+' మార్గదర్శకాలు')}</h4><ul class="rl">${sg.map(r=>`<li>${esc(t(r))}</li>`).join('')}</ul></div>`:''}
 ${sibs.length>1?`<div class="st" ${s()}><h4>${L('More in '+esc(pname(p)),esc(pname(p))+'‌లో మరిన్ని')}</h4><div class="sibs">${sibs.map(x=>`<button type="button" data-sib="${x.n}" aria-current="${x.n===e.n}">${esc(t(x.name))}</button>`).join('')}</div></div>`:''}`;
 {const tips=ri.kind==='main'?[
   L(`Under <b>${esc(ri.section)}</b>, tick <span class="opt">${esc(ri.opt)}</span>.`,`ఫారంలో <b>${esc(ri.section)}</b> కింద <span class="opt">${esc(ri.opt)}</span> ఎంచుకోండి.`),
   L('Choose your age category: Sub Junior (6–12), Junior (13–18) or Senior (19+).','వయస్సు వర్గాన్ని ఎంచుకోండి: Sub Junior (6–12), Junior (13–18) లేదా Senior (19+).')]
  :ri.kind==='crown'?[
   L('Crown of Vijayawada has its own registration. This is the link printed as a QR code on the Crown of Vijayawada poster.','క్రౌన్ ఆఫ్ విజయవాడకు ప్రత్యేక నమోదు ఉంది. ఇది క్రౌన్ ఆఫ్ విజయవాడ పోస్టర్‌పై QR కోడ్‌గా ముద్రించిన లింక్.'),
   L(`Say which pageant you're entering: <span class="opt">${esc(e.name)}</span>.`,`మీరు ఏ పోటీలో పాల్గొంటున్నారో తెలపండి: <span class="opt">${esc(e.name)}</span>.`)]
  :[
   L('Wonder Women has its own form. This is the link printed as a QR code on the Wonder Women poster.','వండర్ ఉమెన్‌కు ప్రత్యేక ఫారం ఉంది. ఇది వండర్ ఉమెన్ పోస్టర్‌పై QR కోడ్‌గా ముద్రించిన లింక్.'),
   L(`Say which competition you're entering: <span class="opt">${esc(e.name)}</span>.`,`మీరు ఏ పోటీలో పాల్గొంటున్నారో తెలపండి: <span class="opt">${esc(e.name)}</span>.`)];
  if(/Group|Team|Band/.test(e.fmt))tips.push(L('Every member of your group registers separately.','మీ బృందంలోని ప్రతి సభ్యుడూ విడివిడిగా నమోదు చేసుకోవాలి.'));
  if(e.fmt==='Couple')tips.push(t('Both partners take part together.'));
  tips.push(L('After you submit, tap the WhatsApp group link to join.','సమర్పించిన తర్వాత, వాట్సాప్ గ్రూప్ లింక్‌ను నొక్కి చేరండి.'));
  ovf.innerHTML=`<div class="rp" id="rp"><div><h5>${L('Before you open the form','ఫారం తెరవడానికి ముందు')}</h5><ol>${tips.map(x=>`<li>${x}</li>`).join('')}</ol></div></div>
  <button class="tk tk-full mag" type="button" id="regbtn" aria-controls="rp" aria-expanded="false" data-cursor="Register"><span class="tk-main"><small class="tk-k">${L(`Competition no. ${e.n}, ${esc(e.fmt)}`,`పోటీ సంఖ్య ${e.n}, ${esc(t(e.fmt))}`)}</small><span class="tk-l t">${L('Register for '+nm,nm+' కోసం నమోదు')}</span><i class="tk-shine" aria-hidden="true"></i></span><span class="tk-stub" aria-hidden="true"><i class="tk-ring"></i><i class="tk-ar">→</i></span></button>
  <a class="tk tk-full tk-gold mag burst" id="regopen" href="${ri.url}" target="_blank" rel="noopener" data-cursor="Open" hidden><span class="tk-main"><small class="tk-k">${L('Opens in a new tab','కొత్త ట్యాబ్‌లో తెరుచుకుంటుంది')}</small><span class="tk-l t">${L('Open the registration form','నమోదు ఫారం తెరవండి')}</span><i class="tk-shine" aria-hidden="true"></i></span><span class="tk-stub" aria-hidden="true"><i class="tk-ring"></i><i class="tk-ar">↗</i></span></a>
  <a class="foot-alt" href="${LINKS.guidelines}" target="_blank" rel="noopener">${L('Read the full guidelines','పూర్తి మార్గదర్శకాలు చదవండి')}</a>`;
  $('#regbtn').onclick=()=>{$('#rp').classList.add('open');$('#regbtn').hidden=true;const o=$('#regopen');o.hidden=false;o.focus()};
  $('#regopen').addEventListener('click',()=>toast(L('The registration form opened in a new tab.','నమోదు ఫారం కొత్త ట్యాబ్‌లో తెరుచుకుంది.')))}
 bindMag(ov);ovs.scrollTop=0;$('#ovgrid').scrollTop=0}
function openOv(n,from){ovFrom=from||document.activeElement;fillOv(n);ov.classList.add('on');ovOpen=true;document.body.style.overflow='hidden';setTimeout(()=>$(VW<=900?'#ovmclose':'#ovclose').focus(),80)}
function closeOv(){ov.classList.remove('on');ovOpen=false;document.body.style.overflow='';ovFrom&&ovFrom.focus&&ovFrom.focus()}
function stepOv(d){const list=current.length?current:EVENTS;let i=list.findIndex(x=>x.n===ovCur);if(i<0)i=0;const n=list[(i+d+list.length)%list.length].n;swapOv(n)}
function swapOv(n){if(reduce){fillOv(n);return}ovs.classList.add('swap');setTimeout(()=>{fillOv(n);ovs.classList.remove('swap')},190)}
$('#ovclose').onclick=closeOv;$('#ovmclose').onclick=closeOv;$('#ovprev').onclick=()=>stepOv(-1);$('#ovnext').onclick=()=>stepOv(1);
ovs.addEventListener('click',e=>{const b=e.target.closest('[data-sib]');if(b&&+b.dataset.sib!==ovCur)swapOv(+b.dataset.sib)});

/* ---------- viewer ---------- */
const buildSets=()=>({comp:PROGS.map(p=>({k:p.poster,t:pname(p),c:L('Competition poster','పోటీ పోస్టర్')})),gal:GALLERY.map(g=>({k:g.k,t:t(g.alt),c:L('Vijayawada Utsav, last year','విజయవాడ ఉత్సవ్, గత ఏడాది')}))});
let SETS=buildSets();
const vw=$('#vw'),vimg=$('#vwimg');let vset=null,vi=0,vFrom=null;
function showV(i,dir){const s=SETS[vset];vi=(i+s.length)%s.length;const it=s[vi];
 const put=()=>{vimg.src=IMG[it.k];vimg.alt=it.t+L(' poster',' పోస్టర్');$('#vwttl').textContent=it.t;$('#vwcat').textContent=it.c;$$('#vwthumbs button').forEach((b,j)=>b.setAttribute('aria-current',j===vi))};
 if(!dir||reduce){put();return}vimg.className=dir>0?'l':'r';setTimeout(()=>{put();vimg.className=dir>0?'r':'l';vimg.getBoundingClientRect();vimg.className=''},200)}
function openV(set,i){vFrom=document.activeElement;vset=set;$('#vwthumbs').innerHTML=SETS[set].map((it,j)=>`<button type="button" data-j="${j}" aria-label="${esc(it.t)}"><img src="${IMG[it.k]}" alt=""></button>`).join('');
 $('#vwprev').hidden=$('#vwnext').hidden=SETS[set].length<2;showV(i);vw.classList.add('on');document.body.style.overflow='hidden';setTimeout(()=>$('#vwclose').focus(),60)}
function closeV(){vw.classList.remove('on');if(!ovOpen)document.body.style.overflow='';vFrom&&vFrom.focus()}
$('#vwthumbs').addEventListener('click',e=>{const b=e.target.closest('[data-j]');if(b){const j=+b.dataset.j;showV(j,j>vi?1:-1)}});
$('#vwclose').onclick=closeV;$('#vwprev').onclick=()=>showV(vi-1,-1);$('#vwnext').onclick=()=>showV(vi+1,1);
let tx=null;$('#vwstage').addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
$('#vwstage').addEventListener('touchend',e=>{if(tx==null)return;const d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)showV(vi+(d<0?1:-1),d<0?1:-1);tx=null});
document.addEventListener('click',e=>{const v=e.target.closest('[data-view]');if(!v)return;const[s,i]=v.dataset.view.split(':');openV(s,+i)});
function trap(e,rootEl){const f=[...rootEl.querySelectorAll('a[href],button,input')].filter(x=>!x.hidden&&x.offsetParent!==null);if(!f.length)return;const a=f[0],z=f[f.length-1];
 if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}
document.addEventListener('keydown',e=>{
 if(vw.classList.contains('on')){if(e.key==='Escape')closeV();else if(e.key==='ArrowRight')showV(vi+1,1);else if(e.key==='ArrowLeft')showV(vi-1,-1);else if(e.key==='Tab')trap(e,vw);return}
 if(ovOpen){if(e.key==='Escape')closeOv();else if(e.key==='Tab')trap(e,ov);return}
 if(menu.classList.contains('on')&&e.key==='Escape')toggleMenu(false)});


/* ---------- last year's gallery slider ---------- */
const galEl=$('#gal'),galBar=$('#galbar'),galCount=$('#galcount');
galEl.innerHTML=GALLERY.map((g,i)=>`<button class="gi" type="button" data-view="gal:${i}" data-cursor="View" style="--ar:${g.w}/${g.h};--r:${(i%3-1)*1.2}deg;--i:${Math.min(i,7)}" aria-label="${esc(L('View photo: '+g.alt,'ఫొటో చూడండి: '+t(g.alt)))}"><img src="${IMG[g.k]}" alt="${esc(t(g.alt))}" width="${g.w}" height="${g.h}" loading="${i<6?'eager':'lazy'}" decoding="async" draggable="false"></button>`).join('');
const gis=$$('#gal .gi');
function renderGalleryLabels(){gis.forEach((b,i)=>{const g=GALLERY[i];b.setAttribute('aria-label',L('View photo: '+g.alt,'ఫొటో చూడండి: '+t(g.alt)));b.querySelector('img').alt=t(g.alt)})}
let galIdx=0,galHover=false,galTouch=0,galVisible=false;
function galCurrent(){const L=galEl.scrollLeft+parseFloat(getComputedStyle(galEl).scrollPaddingLeft||0);let best=0,bd=1e9;gis.forEach((g,i)=>{const d=Math.abs(g.offsetLeft-L);if(d<bd){bd=d;best=i}});return best}
function galUpdate(){const max=galEl.scrollWidth-galEl.clientWidth;galBar.style.transform=`scaleX(${max>0?clamp(galEl.scrollLeft/max):1})`;galIdx=galCurrent();galCount.textContent=`${String(galIdx+1).padStart(2,'0')} / ${gis.length}`}
function galGo(i){const max=galEl.scrollWidth-galEl.clientWidth;if(i>=gis.length||(i>galIdx&&galEl.scrollLeft>=max-4))i=0;if(i<0)i=gis.length-1;
 const pad=parseFloat(getComputedStyle(galEl).scrollPaddingLeft||0);galEl.scrollTo({left:gis[i].offsetLeft-pad,behavior:reduce?'auto':'smooth'})}
galEl.addEventListener('scroll',galUpdate,{passive:true});
$('#galprev').onclick=()=>galGo(galIdx-1);$('#galnext').onclick=()=>galGo(galIdx+1);
galEl.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();galGo(galIdx+1)}else if(e.key==='ArrowLeft'){e.preventDefault();galGo(galIdx-1)}});
galEl.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')galHover=true});galEl.addEventListener('pointerleave',()=>galHover=false);
galEl.addEventListener('touchstart',()=>{galTouch=Date.now()},{passive:true});
/* mouse drag to scroll */
let gdx=null,gsl=0,gmoved=false;
galEl.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;gdx=e.clientX;gsl=galEl.scrollLeft;gmoved=false});
addEventListener('pointermove',e=>{if(gdx===null)return;const dx=e.clientX-gdx;if(!gmoved&&Math.abs(dx)>6){gmoved=true;galEl.classList.add('drag')}if(gmoved)galEl.scrollLeft=gsl-dx});
addEventListener('pointerup',()=>{if(gdx===null)return;gdx=null;if(gmoved){galEl.classList.remove('drag');const i=galCurrent();galGo(i);setTimeout(()=>gmoved=false,0)}});
galEl.addEventListener('click',e=>{if(gmoved){e.stopPropagation();e.preventDefault()}},true);
new IntersectionObserver(es=>{galVisible=es[0].isIntersecting},{threshold:.3}).observe(galEl);
if(!reduce)setInterval(()=>{if(!galVisible||galHover||document.hidden||gdx!==null||Date.now()-galTouch<6000||vw.classList.contains('on'))return;galGo(galIdx+1)},3400);
galUpdate();
$$('.gi img').forEach(im=>im.addEventListener('load',galUpdate,{once:true}));


/* ---------- video thumbnails ----------
   The YouTube thumbnail and the Instagram reel embed come from YouTube/Instagram.
   Where outside media is blocked (e.g. a sandboxed preview), a designed cover shows instead;
   on a normal website both load. */
(function(){const yt=$('#ytthumb');if(!yt)return;
 yt.addEventListener('load',()=>{if(yt.naturalWidth>200){yt.classList.add('ok');
   const m=$('#igmedia');if(m&&!m.querySelector('iframe')){const f=document.createElement('iframe');f.src=LINKS.instagramReelEmbed;f.title=L('Instagram reel from Vijayawada Utsav','విజయవాడ ఉత్సవ్ ఇన్‌స్టాగ్రామ్ రీల్');f.loading='lazy';f.setAttribute('scrolling','no');f.setAttribute('allowtransparency','true');f.allow='autoplay; encrypted-media; picture-in-picture; clipboard-write';m.appendChild(f)}}},{once:true});
 const io2=new IntersectionObserver(es=>{if(es[0].isIntersecting){yt.src=yt.dataset.src;io2.disconnect()}},{rootMargin:'400px'});io2.observe(yt)})();

/* ---------- register routes + rules ---------- */
const mainP=PROGS.filter(p=>p.reg==='main');
const tkHTML=(cls,href,small,label,arrow)=>`<a class="tk ${cls} mag burst" href="${href}" target="_blank" rel="noopener" data-cursor="Register" data-toast="1"><span class="tk-main"><small class="tk-k">${small}</small><span class="tk-l t">${label}</span><i class="tk-shine" aria-hidden="true"></i></span><span class="tk-stub" aria-hidden="true"><i class="tk-ring"></i><i class="tk-ar">${arrow}</i></span></a>`;
function renderRoutes(re){
const was=re&&!!$('#routes .route.in');
$('#routes').innerHTML=`<div class="route lead rv${was?' in':''}" style="--c:var(--marigold)"><h3>${L('Main registration form','ప్రధాన నమోదు ఫారం')}</h3><p>${L('One form covers these five titles. Tick every competition you want to enter.','ఈ ఐదు టైటిల్స్‌కూ ఒకే ఫారం. మీరు పాల్గొనాలనుకునే ప్రతి పోటీని ఎంచుకోండి.')}</p><ul class="pl">${mainP.map(p=>`<li style="--c2:${p.color}">${esc(pname(p))}</li>`).join('')}</ul>${tkHTML('',LINKS.mainForm,L('8–12 October, Vijayawada','అక్టోబర్ 8–12, విజయవాడ'),L('Register now','ఇప్పుడే నమోదు'),'↗')}</div>
<div class="route rv${was?' in':''}" style="--c:${P.wonder.color}"><h3>${esc(pname(P.wonder))}</h3><p>${L('Separate registration for all 10 women\'s competitions, from the QR code on the Wonder Women poster.','మహిళల 10 పోటీలన్నింటికీ ప్రత్యేక నమోదు, వండర్ ఉమెన్ పోస్టర్‌పై ఉన్న QR కోడ్ నుంచి.')}</p>${tkHTML('tk-gold',LINKS.wonderForm,L('Separate form, 10 competitions','ప్రత్యేక ఫారం, 10 పోటీలు'),L('Register for Wonder Women','వండర్ ఉమెన్ కోసం నమోదు'),'↗')}</div>
<div class="route rv${was?' in':''}" style="--c:${P.crown.color}"><h3>${esc(pname(P.crown))}</h3><p>${L('Separate registration for all 7 pageants, from the QR code on the Crown of Vijayawada poster.','మొత్తం 7 అందాల పోటీలకు ప్రత్యేక నమోదు, క్రౌన్ ఆఫ్ విజయవాడ పోస్టర్‌పై ఉన్న QR కోడ్ నుంచి.')}</p>${tkHTML('',LINKS.crownForm,L('Separate form, 7 pageants','ప్రత్యేక ఫారం, 7 అందాల పోటీలు'),L('Register for Crown of Vijayawada','క్రౌన్ ఆఫ్ విజయవాడ కోసం నమోదు'),'↗')}</div>`;
$$('.route').forEach((r,i)=>r.style.clipPath=allTorn(60+i,1.6));bindMag($('#routes'));if(re&&!was)$$('#routes .route').forEach(r=>io.observe(r))}
renderRoutes();

document.addEventListener('click',e=>{const a=e.target.closest('[data-toast]');if(a)toast(L('The registration form opened in a new tab.','నమోదు ఫారం కొత్త ట్యాబ్‌లో తెరుచుకుంది.'))});
function renderRules(){$('#gl').innerHTML=GENERAL.map(g=>`<li>${esc(t(g))}</li>`).join('')}
renderRules();

/* ---------- toast + confetti ---------- */
let tt;function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2800)}
const cols=PROGS.map(p=>p.color).concat('#F2B01E','#8C1D40');
function burst(x,y){if(reduce)return;for(let i=0;i<14;i++){const d=document.createElement('i');d.className='cf';d.style.background=cols[i%cols.length];d.style.clipPath=allTorn(i+x,10);document.body.appendChild(d);
 const a=Math.random()*Math.PI*2,r=60+Math.random()*90;d.animate([{transform:`translate(${x}px,${y}px) rotate(0)`,opacity:1},{transform:`translate(${x+Math.cos(a)*r}px,${y+Math.sin(a)*r+40}px) rotate(${Math.random()*540-270}deg)`,opacity:0}],{duration:800+Math.random()*300,easing:'cubic-bezier(.15,.8,.3,1)'}).onfinish=()=>d.remove()}}
document.addEventListener('pointerdown',e=>{const b=e.target.closest('.burst');if(b)burst(e.clientX,e.clientY)});

/* ---------- nav + menu ---------- */
const nav=$('#nav'),menu=$('#menu'),mb=$('#menubtn'),dock=$('#dock');
function toggleMenu(o){mb.setAttribute('aria-expanded',o);mb.setAttribute('aria-label',t(o?'Close menu':'Open menu'));menu.classList.toggle('on',o);nav.classList.toggle('dark',o||navDark);document.body.style.overflow=o?'hidden':'';root.classList.toggle('menu-open',o)}
mb.onclick=()=>toggleMenu(mb.getAttribute('aria-expanded')!=='true');
menu.addEventListener('click',e=>{if(e.target.tagName==='A')toggleMenu(false)});
const darkSecs=$$('.dark-sec, footer, .reg');let navDark=false;

/* ---------- cursor + magnetic + tilt ---------- */
const cur=$('#cur'),cring=$('#cring'),cdot=$('#cdot'),clab=$('#clab');
let cx=-100,cy=-100,rx=-100,ry=-100,rot=0,curOn=false,hov=0;
if(fine){root.classList.add('cur-on');curOn=true;
 addEventListener('pointermove',e=>{cx=e.clientX;cy=e.clientY},{passive:true});
 addEventListener('pointerdown',()=>cur.classList.add('down'));addEventListener('pointerup',()=>cur.classList.remove('down'));
 document.addEventListener('pointerover',e=>{const t_=e.target.closest('[data-cursor]'),inp=e.target.closest('input,textarea');
  cur.classList.toggle('hide',!!inp);
  if(t_){clab.textContent=t(t_.dataset.cursor);cur.classList.add('lab');hov=0}else{const a=e.target.closest('a,button,[role=tab]');cur.classList.remove('lab');hov=a?1:0}});
 document.addEventListener('pointerleave',()=>{cx=cy=-100})}
function bindMag(scope){if(!fine||reduce)return;(scope||document).querySelectorAll('.mag').forEach(el=>{if(el._mag)return;el._mag=1;const t=el.querySelector('.t');
 el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);el.style.transform=`translate(${dx*.22}px,${dy*.35}px)`;if(t)t.style.transform=`translate(${dx*.08}px,${dy*.12}px)`});
 el.addEventListener('pointerleave',()=>{el.style.transform='';if(t)t.style.transform=''})})}
bindMag();
function bindTilt(){if(!fine||reduce)return;document.addEventListener('pointermove',e=>{const t=e.target.closest('.tilt,.b-post .fr,.ov-poster');$$('.tilting').forEach(x=>{if(x!==t){x.classList.remove('tilting');x.style.transform=''}});if(!t)return;
 const r=t.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;t.classList.add('tilting');t.style.transform=`rotateY(${px*10}deg) rotateX(${-py*10}deg) scale(1.02)`},{passive:true})}
bindTilt();

/* ---------- reveals ---------- */
function buildSp(h){let i=0;h.innerHTML=t(h.dataset.en).trim().split(/\s+/).map(w=>`<span class="w"><span style="--i:${i++}">${esc(w)}</span></span>`).join(' ')}
$$('.sp').forEach(h=>{h.dataset.en=h.textContent.trim();buildSp(h)});
const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const t=en.target;t.classList.add('in');io.unobserve(t);
 if(!reduce)t.querySelectorAll('[data-count]').forEach(el=>{const v=+el.dataset.count,t0=performance.now();const f=n=>{const k=Math.min(1,(n-t0)/1100);el.textContent=Math.round(v*(1-Math.pow(1-k,4)));if(k<1)requestAnimationFrame(f)};el.textContent='0';requestAnimationFrame(f)})}),{threshold:.2,rootMargin:'0px 0px -8% 0px'});
$$('.rv,.sp,.rvm').forEach(el=>io.observe(el));

/* ---------- language toggle: applies Telugu (or English) to the whole page ---------- */
const TITLE_EN='Vijayawada Utsav 2026 — Competitions',DESC_EN='46 competitions across 7 titles, 8–12 October 2026 at Tummalapalli Kalakshetram, Vijayawada.';
const i18nText=new WeakMap(),i18nAttr=new WeakMap();
const SKIP='.sw,.pan-p,.pan-end,#tabs,#segs,#rmeta,#rows,.feat-cap,#routes,#gl,#gal,#ovscroll,#ovfoot,#ovcrumb,#ovbig,#vwttl,#vwcat,#vwthumbs,#mani,.sp,#cd,#cd-k,#galcount,#phint,#toast,#lang,.soc-lang';
function translateStatic(){
 const te=lang==='te';
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){const p=n.parentElement;return(!p||p.closest('script,style,'+SKIP))?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});
 let n;while(n=walker.nextNode()){
  const raw=n.nodeValue;
  if(!i18nText.has(n)){const key=raw.replace(/\s+/g,' ').trim();if(!key||TE[key]===undefined)continue;i18nText.set(n,raw)}
  const orig=i18nText.get(n),k=orig.replace(/\s+/g,' ').trim();
  n.nodeValue=te?orig.match(/^\s*/)[0]+TE[k]+orig.match(/\s*$/)[0]:orig}
 document.querySelectorAll('[aria-label],[placeholder],[alt],[title]').forEach(el=>{
  if(el.closest(SKIP))return;
  ['aria-label','placeholder','alt','title'].forEach(at=>{
   if(!el.hasAttribute(at))return;
   let m=i18nAttr.get(el);if(!m){m={};i18nAttr.set(el,m)}
   if(!(at in m)){const v=el.getAttribute(at).replace(/\s+/g,' ').trim();if(TE[v]===undefined)return;m[at]=el.getAttribute(at)}
   el.setAttribute(at,te?TE[m[at].replace(/\s+/g,' ').trim()]:m[at])})})}
function applyChrome(){
 root.lang=lang;document.title=t(TITLE_EN);
 const md=document.querySelector('meta[name="description"]');if(md)md.setAttribute('content',t(DESC_EN));
 const lg=$('#lang');lg.dataset.l=lang;lg.setAttribute('aria-label',t('Language'));lg.querySelectorAll('.lang-b').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===lang));
 const sl=$('#soclang');sl.textContent=lang==='te'?'EN':'తె';sl.lang=lang==='te'?'en':'te';sl.setAttribute('aria-label',L('Switch to Telugu','ఇంగ్లీష్‌కు మారండి'));
 translateStatic();
 $('#tabs').setAttribute('aria-label',t('Titles'));$('#segs').setAttribute('aria-label',t('Filter by segment'));$('#gal').setAttribute('aria-label',t("Photos from last year's Vijayawada Utsav"));
 mb.setAttribute('aria-label',t(mb.getAttribute('aria-expanded')==='true'?'Close menu':'Open menu'))}
function applyLang(){
 applyChrome();
 $$('.sp').forEach(buildSp);buildMani();
 renderSwatches();renderPanels();renderTabs();renderRoutes(true);renderRules();renderGalleryLabels();
 tickCountdown();refresh();setFeat(featProg||'idol',null);
 SETS=buildSets();
 if(ovCur!==null)fillOv(ovCur);
 if(vw.classList.contains('on')){$$('#vwthumbs button').forEach((b,j)=>b.setAttribute('aria-label',SETS[vset][j].t));showV(vi)}
 bindMag(document);lastY=-1;
 requestAnimationFrame(()=>requestAnimationFrame(layout));
 document.fonts&&document.fonts.ready.then(layout)}
function setLang(l){if(l===lang)return;lang=l;try{localStorage.setItem('vu-lang',l)}catch(e){}applyLang()}
$$('.lang-b').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
$('#soclang').addEventListener('click',()=>setLang(lang==='te'?'en':'te'));

/* ---------- scroll engine ---------- */
const prog=$('#prog'),marq=$('#marq'),fmarq=$('#fmarq'),tebg=$('#tebg'),maniSec=$('#about'),tl=$('#tl'),regSec=$('#register'),footerEl=$('#contact');
let lastY=-1,lastDir=0,geo={},HH=0,lastOff=-1;
const siteHead=$('#sitehead');
function layout(){HH=siteHead.offsetHeight;root.style.setProperty('--hh',HH+'px');setHeadOff(scrollY);heroLayout();progLayout();
 geo.mani={top:maniSec.offsetTop,h:maniSec.offsetHeight};geo.prog={top:progsSec.offsetTop,h:progsSec.offsetHeight};
 geo.tw=track.scrollWidth;moveInd();lastY=-1}
/* the partner header scrolls away; fixed bars sit just below it until it's gone */
function setHeadOff(y){const off=Math.max(0,HH-Math.max(0,y));if(off===lastOff)return false;lastOff=off;root.style.setProperty('--hoff',off+'px');return true}
function onScroll(y){
 if(setHeadOff(y)&&!reduce)heroLayout();
 const docH=document.documentElement.scrollHeight-VH;prog.style.transform=`scaleX(${clamp(y/docH)})`;
 if(y>lastY+4&&y>200&&!menu.classList.contains('on'))nav.classList.add('up');else if(y<lastY-4)nav.classList.remove('up');
 nav.classList.toggle('solid',y>30);
 dock.classList.toggle('show',y>VH*.6);
 navDark=darkSecs.some(s=>{const r=s.getBoundingClientRect();return r.top<=40&&r.bottom>40});nav.classList.toggle('dark',navDark||menu.classList.contains('on'));
 if(reduce){mwords.forEach(w=>w.classList.add('on'));return}
 /* manifesto */
 const mp=clamp((y-geo.mani.top+VH*.3)/((geo.mani.h-VH)*.95));const lit=Math.floor(mp*(mwords.length+1));mwords.forEach((w,i)=>w.classList.toggle('on',i<lit));
 tebg.style.transform=`translate(${-mp*18}vw,-50%)`;
 /* programmes */
 if(!progNative){const pp=clamp((y-geo.prog.top)/(geo.prog.h-VH)),x=-pp*(geo.tw-VW);track.style.transform=`translate3d(${x}px,0,0)`;pword.style.transform=`translate3d(${-x*.35}px,0,0)`;
  pans.forEach(p=>{const l=p.offsetLeft+x;p.style.setProperty('--rv',clamp((VW-l)/(VW*.7)).toFixed(3))})}
 /* marquees */
 const rr=regSec.getBoundingClientRect();marq.style.transform=`translate3d(${-(VH-rr.top)*.35}px,0,0)`;
 const fr=footerEl.getBoundingClientRect();fmarq.style.transform=`translate3d(${-(VH-fr.top)*.3}px,0,0)`;
 const tr=tl.getBoundingClientRect();tl.style.setProperty('--tl',clamp((VH*.85-tr.top)/tr.height).toFixed(3));
}
function heroFrame(y){if(!heroGeo)return;const p=reduce?0:clamp(y/VH),m=VW<760;
 mx=lerp(mx,tmx,.07);my=lerp(my,tmy,.07);const k=m?VW*.5:VW*.45;
 heroGeo.forEach(g=>{const px=mx*g.d*-26,py=my*g.d*-20;g.el.style.transform=`translate3d(${g.x+g.vx*p*k+px}px,${g.y+g.vy*p*k*.7+py}px,0) rotate(${g.r+p*g.vx*18}deg)`});
 const ps=1-p*.18;
 if(m){const b=JSON.parse(paper.dataset.base||'{"x":0,"y":0}'),sb=JSON.parse(strip.dataset.base||'{"x":0,"y":0}');paper.style.left='0';paper.style.top='0';paper.style.transform=`translate3d(${b.x}px,${b.y-p*60}px,0) scale(${ps})`;
  strip.style.left='0';strip.style.top='0';strip.style.transform=`translate3d(calc(${sb.x}px - 50%),${sb.y-p*20}px,0) rotate(${-3-p*8}deg)`}
 else{paper.style.left='';paper.style.top='';paper.style.transform=`translate3d(calc(-50% + ${mx*8}px),calc(-50% + ${my*6-p*80}px),0) scale(${ps})`;
  strip.style.left='';strip.style.transform=`translate3d(calc(-50% + ${mx*-14}px),${my*-10-p*30}px,0) rotate(${-3-p*10}deg)`}
 bigword.style.transform=`translate3d(calc(-50% + ${mx*-30-p*VW*.25}px),calc(-50% + ${my*-20}px),0)`}
function frame(){const y=scrollY;
 if(y!==lastY){onScroll(y);lastY=y}
 if(y<VH*1.2)heroFrame(y);
 if(curOn){rx=lerp(rx,cx,.2);ry=lerp(ry,cy,.2);const v=Math.hypot(cx-rx,cy-ry);rot+=v*.25;cdot.style.transform=`translate3d(${cx}px,${cy}px,0)`;
  cring.style.transform=`translate3d(${rx}px,${ry}px,0) rotate(${cur.classList.contains('lab')?0:rot}deg) scale(${1+hov*.3})`}
 requestAnimationFrame(frame)}
document.fonts&&document.fonts.ready.then(layout);
addEventListener('load',layout);
applyChrome();layout();setProg('all');requestAnimationFrame(frame);

}
