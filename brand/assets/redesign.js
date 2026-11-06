/* Scancoming redesign: sticky nav hairline, mobile menu, enquiry picker, route map loop */

/* ---------- nav hairline once scrolled ---------- */
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, {passive:true});

/* ---------- focus trap (mobile menu + modal) ---------- */
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

/* ---------- enquiry office picker (ask after Send) ---------- */
(function(){
  const btn = document.getElementById('enquiryBtn');
  const modal = document.getElementById('enquiryModal');
  if(!btn || !modal) return;
  const choices = modal.querySelectorAll('.enquiry-choice');

  function buildMailto(office, region){
    const subject = encodeURIComponent('Enquiry: ' + region);
    const body = encodeURIComponent(
      'Hi Scancoming team,\r\n\r\n' +
      'Destination: ' + region + '\r\n\r\n' +
      'Goal/brief: \r\nGroup size: \r\nDates: \r\nBudget: \r\n\r\nThanks,'
    );
    return 'mailto:' + office + '?subject=' + subject + '&body=' + body;
  }
  function open(){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.addEventListener('keydown', onKey);
    if(choices.length) choices[0].focus(); }
  function close(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.removeEventListener('keydown', onKey); btn.focus(); }
  function onKey(e){ if(e.key === 'Escape') close(); trapFocus(modal, e); }

  btn.addEventListener('click', open);
  modal.querySelectorAll('[data-close]').forEach(el=> el.addEventListener('click', close));
  choices.forEach(c=>{
    c.addEventListener('click', ()=>{
      window.location.href = buildMailto(c.dataset.office, c.dataset.region);
      close();
    });
  });
})();

/* ---------- route map: runs on screen, pauses on hover, focus or the button ---------- */
document.querySelectorAll('[data-loop]').forEach((el) => {
  const btn = el.querySelector('[data-loop-toggle]');
  const area = el.querySelector('svg'); /* hover and focus on the map itself, so the button's own focus cannot hold it paused */
  const s = { seen: false, hover: false, focus: false, held: matchMedia('(prefers-reduced-motion: reduce)').matches };
  const sync = () => {
    el.classList.toggle('is-running', s.seen && !s.hover && !s.focus && !s.held);
    btn.textContent = s.held ? 'Play the map' : 'Pause the map';
  };
  btn.addEventListener('click', () => { s.held = !s.held; sync(); });
  [['pointerenter', 'hover', true], ['pointerleave', 'hover', false], ['focusin', 'focus', true], ['focusout', 'focus', false]]
    .forEach(([t, k, v]) => area.addEventListener(t, () => { s[k] = v; sync(); }));
  new IntersectionObserver(([e]) => { s.seen = e.isIntersecting; sync(); }).observe(el);
});

/* ---------- hero: cross-fades through the photographs; the first one needs no script ---------- */
(function(){
  const fig = document.getElementById('heroRotator');
  const tpl = document.getElementById('heroSlides');
  if(!fig || !tpl) return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return; /* stays on the first photo */
  const btn = fig.querySelector('[data-hero-toggle]');
  const caption = fig.querySelector('[data-hero-caption]');
  const INTERVAL = 6000;
  const s = { seen: true, hover: false, focus: false, held: false };
  const running = () => s.seen && !s.hover && !s.focus && !s.held;
  const slides = [fig.querySelector(':scope > img')];
  let i = 0;

  /* the other photos wait for the page to load, so the first is never held up */
  function load(){
    tpl.content.querySelectorAll('img').forEach((src)=>{
      const im = src.cloneNode();
      im.setAttribute('aria-hidden','true');
      slides.push(im);
      fig.insertBefore(im, fig.querySelector('figcaption'));
    });
  }
  function next(){
    if(!running() || slides.length < 2) return;
    const cur = slides[i];
    do { i = (i + 1) % slides.length; } while(!(slides[i].complete && slides[i].naturalWidth) && slides[i] !== cur); /* set order, skipping any photo not ready */
    const nxt = slides[i];
    if(nxt === cur) return;
    cur.classList.remove('is-active'); cur.setAttribute('aria-hidden','true');
    nxt.classList.add('is-active'); nxt.removeAttribute('aria-hidden');
    caption.textContent = nxt.dataset.caption;
  }
  if(document.readyState === 'complete') load(); else window.addEventListener('load', load, {once:true});
  setInterval(next, INTERVAL);

  btn.addEventListener('click', ()=>{ s.held = !s.held; s.hover = false; btn.textContent = s.held ? 'Play photos' : 'Pause photos'; });
  fig.addEventListener('pointerenter', ()=>{ s.hover = true; });
  fig.addEventListener('pointerleave', ()=>{ s.hover = false; });
  fig.addEventListener('focusin', (e)=>{ if(e.target !== btn) s.focus = true; });
  fig.addEventListener('focusout', ()=>{ s.focus = false; });
  new IntersectionObserver(([e])=>{ s.seen = e.isIntersecting; }).observe(fig);
})();
