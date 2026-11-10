/* Saliha Shums portfolio: vanilla JS, no dependencies */
const PROFILE = {
  email: "salihashums@gmail.com",
  linkedin: "https://www.linkedin.com/in/fathima-saliha-shums/",            // paste your LinkedIn URL here to show the LinkedIn button
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* contact buttons */
$("#mail-btn").href = "mailto:" + PROFILE.email;
$("#mail-btn").textContent = PROFILE.email;
if (PROFILE.linkedin) { const l = $("#li-btn"); l.href = PROFILE.linkedin; l.hidden = false; }
/* show "Download CV" only if assets/Saliha_Shums_CV.pdf has been added to the repo */
fetch("assets/Saliha_Shums_CV.pdf", { method: "HEAD" }).then(r => { if (r.ok) $("#cv-btn").hidden = false; }).catch(() => {});
$("#yr").textContent = new Date().getFullYear();

/* nav: scroll state, progress bar, burger */
const nav = $("#nav"), bar = $(".progress"), burger = $(".burger"), menu = $("#menu");
function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  nav.classList.toggle("stuck", y > 30);
  bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
$$("#menu a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));

/* active nav link */
const links = $$("#menu a[href^='#']");
const sectionObs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(l => l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach(s => sectionObs.observe(s));

/* typewriter */
(function () {
  const el = $("#typed"); if (!el) return;
  const words = JSON.parse(el.dataset.words.replace(/&amp;/g, "&"));
  if (reduce) return;
  let w = 0, c = el.textContent.length, del = true;
  (function tick() {
    const word = words[w];
    if (!del) { c++; if (c >= word.length) { del = true; return setTimeout(tick, 1800); } }
    else { c--; if (c <= 0) { del = false; w = (w + 1) % words.length; c = 0; } }
    el.textContent = words[w].slice(0, Math.max(c, 0));
    setTimeout(tick, del ? 38 : 70);
  })();
})();

/* reveal on scroll + counters + chart triggers */
function countUp(el) {
  const to = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
  if (reduce) { el.textContent = pre + to + suf; return; }
  const t0 = performance.now(), dur = 1400;
  (function f(t) {
    const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = pre + Math.round(to * e) + suf;
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
const revealObs = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target; el.classList.add("in"); revealObs.unobserve(el);
  $$(".num", el).forEach(countUp);
  $$(".arc", el).forEach(a => a.setAttribute("stroke-dasharray", a.dataset.val + " 100"));
}), { threshold: .18 });
$$(".reveal, .grow").forEach(el => revealObs.observe(el));
$$(".stats .num").forEach(n => { if (reduce) countUp(n); });

/* parallax stickers: pointer in hero + scroll everywhere */
if (!reduce) {
  const stks = $$(".stk[data-depth]");
  let mx = 0, my = 0, tx = 0, ty = 0, ticking = false;
  const fine = matchMedia("(pointer:fine)").matches;
  if (fine) addEventListener("pointermove", e => { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; });
  function frame() {
    mx += (tx - mx) * .08; my += (ty - my) * .08;
    stks.forEach(s => {
      const d = +s.dataset.depth, r = s.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const sy = (innerHeight / 2 - (r.top + r.height / 2)) * d * 1.4;
      const inHero = s.closest(".hero-art");
      const px = inHero ? mx * d * 700 : 0, py = (inHero ? my * d * 700 : 0) + sy;
      s.style.transform = "translate3d(" + px.toFixed(1) + "px," + py.toFixed(1) + "px,0)";
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* click the beaker for a burst of bubbles */
const lab = $(".lab");
if (lab && !reduce) {
  lab.style.pointerEvents = "auto"; lab.style.cursor = "pointer";
  lab.addEventListener("click", e => {
    const b = lab.getBoundingClientRect();
    for (let i = 0; i < 14; i++) {
      const d = document.createElement("i");
      Object.assign(d.style, { position: "absolute", left: 30 + Math.random() * 40 + "%", top: "30%", width: 8 + Math.random() * 16 + "px", height: 8 + Math.random() * 16 + "px", borderRadius: "50%", background: "rgba(127,209,168,.75)", border: "2px solid #fff", pointerEvents: "none", zIndex: 5 });
      lab.appendChild(d);
      d.animate([{ transform: "translateY(0) scale(.4)", opacity: 1 }, { transform: `translate(${(Math.random() - .5) * 120}px,${-80 - Math.random() * 160}px) scale(1.1)`, opacity: 0 }], { duration: 900 + Math.random() * 700, easing: "cubic-bezier(.2,.8,.3,1)" }).onfinish = () => d.remove();
    }
  });
}
