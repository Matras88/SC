/* SCANCOMING — shared behaviour for content pages */

/* ---------- sticky header ---------- */
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, {passive:true});

/* ---------- scroll reveal ---------- */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
},{threshold:0.12, rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* hero content is in view on load — reveal it immediately */
requestAnimationFrame(()=>{
  document.querySelectorAll('.page-hero .reveal').forEach(el=>{ io.unobserve(el); el.classList.add('in'); });
});

/* failsafe: ensure nothing ever stays hidden */
window.addEventListener('load', ()=>{ setTimeout(()=>{
  document.querySelectorAll('.reveal:not(.in)').forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight) el.classList.add('in');
  });
}, 1500); });

/* ---------- focus trap ---------- */
function trapFocus(container, e){
  if(e.key !== 'Tab') return;
  const focusables = container.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if(!focusables.length) return;
  const first = focusables[0], last = focusables[focusables.length-1];
  if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
}

/* ---------- mobile menu drawer ---------- */
(function(){
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('mobileMenu');
  if(!btn || !menu) return;
  function open(){ menu.classList.add('open'); menu.setAttribute('aria-hidden','false');
    btn.setAttribute('aria-expanded','true'); document.body.classList.add('menu-open');
    document.addEventListener('keydown', onKey);
    const closeBtn = menu.querySelector('.mm-close'); if(closeBtn) closeBtn.focus(); }
  function close(){ menu.classList.remove('open'); menu.setAttribute('aria-hidden','true');
    btn.setAttribute('aria-expanded','false'); document.body.classList.remove('menu-open');
    document.removeEventListener('keydown', onKey); btn.focus(); }
  function onKey(e){ if(e.key === 'Escape') close(); trapFocus(menu, e); }
  btn.addEventListener('click', open);
  menu.querySelectorAll('[data-mm-close]').forEach(el=> el.addEventListener('click', close));
})();
