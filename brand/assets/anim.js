/* SCANCOMING — hero animations for destination pages (motion-safe) */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* headline word cascade — preserves styled spans (e.g. .serif-accent) */
  const h1 = document.querySelector('.page-hero h1');
  if(h1){
    h1.classList.remove('reveal');
    h1.classList.add('in');
    let i = 0, out = '';
    h1.childNodes.forEach(n=>{
      const cls = n.nodeType === 1 ? n.className : '';
      n.textContent.split(/\s+/).filter(Boolean).forEach(w=>{
        out += '<span class="w"><span' + (cls ? ' class="' + cls + '"' : '') +
               ' style="--wd:' + (0.25 + i * 0.05).toFixed(3) + 's">' + w + '</span></span> ';
        i++;
      });
    });
    h1.innerHTML = out.trim();
  }

  /* count-up numbers in hero meta (e.g. "Since 1977") */
  document.querySelectorAll('.page-hero .hm b').forEach(el=>{
    const m = el.textContent.match(/\d+/); if(!m) return;
    const target = +m[0], tpl = el.textContent,
          start = target > 100 ? target - 77 : 0, dur = 1800, t0 = performance.now();
    const tick = t=>{
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = tpl.replace(m[0], String(Math.round(start + (target - start) * e)));
      if(p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  /* pointer-only effects */
  if(!matchMedia('(hover: hover)').matches) return;

  /* magnetic buttons */
  document.querySelectorAll('.btn').forEach(b=>{
    b.addEventListener('mousemove',e=>{
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      b.style.transform = 'translate(' + (x * 14).toFixed(1) + 'px,' + (y * 10).toFixed(1) + 'px)';
    });
    b.addEventListener('mouseleave',()=>{ b.style.transform = ''; });
  });

  /* 3D tilt on cards */
  document.querySelectorAll('.place-card,.service-card').forEach(c=>{
    c.addEventListener('mousemove',e=>{
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transition = 'transform .08s linear';
      c.style.transform = 'perspective(900px) rotateX(' + (-y * 6).toFixed(2) + 'deg) rotateY(' + (x * 8).toFixed(2) + 'deg) translateY(-5px)';
    });
    c.addEventListener('mouseleave',()=>{
      c.style.transition = 'transform .6s var(--ease)';
      c.style.transform = '';
    });
  });
})();
