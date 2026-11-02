/* ============ VENA TECH — main.js ============ */

const WHATSAPP_NUMBER = '972543844204';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 760px)').matches;
const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

if (hasGsap) gsap.registerPlugin(ScrollTrigger);

/* ---------- Lenis smooth scroll ---------- */
let lenis = null;
if (!prefersReduced && typeof window.Lenis !== 'undefined' && hasGsap) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target) {
  const el = document.querySelector(target);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      scrollToTarget(href);
      closeMobileMenu();
    }
  });
});

/* ---------- Nav ---------- */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');

function onScrollNav() {
  nav.classList.toggle('is-solid', window.scrollY > 10 || nav.classList.contains('is-open'));
}
window.addEventListener('scroll', onScrollNav, { passive: true });
onScrollNav();

function closeMobileMenu() {
  nav.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  onScrollNav();
}
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(open));
  onScrollNav();
});

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Split text prep ---------- */
document.querySelectorAll('[data-split] .line').forEach((line) => {
  const inner = document.createElement('span');
  inner.innerHTML = line.innerHTML;
  line.innerHTML = '';
  line.appendChild(inner);
});

/* ---------- Reveal animations ---------- */
function setupReveals() {
  if (!hasGsap || prefersReduced) return;

  // generic fade-up reveals
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
  });

  // split-line headline reveals (hero handled by intro timeline)
  document.querySelectorAll('[data-split]').forEach((block) => {
    if (block.closest('.hero')) return;
    const lines = block.querySelectorAll('.line > span');
    gsap.fromTo(lines,
      { yPercent: 115 },
      {
        yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: block, start: 'top 85%' }
      });
  });

  // how-it-works connective line draws with scroll
  const howPath = document.getElementById('howPath');
  if (howPath) {
    const len = howPath.getTotalLength();
    gsap.set(howPath, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(howPath, {
      strokeDashoffset: 0, ease: 'none',
      scrollTrigger: { trigger: '.how__track', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 }
    });
  }
}

/* ---------- Intro ---------- */
const intro = document.getElementById('intro');
let introDone = false;
let igniteScene = null; // set by the 3D module

function finishIntro(skip = false) {
  if (introDone) return;
  introDone = true;
  const heroLines = document.querySelectorAll('.hero [data-split] .line > span');
  const heroReveals = document.querySelectorAll('.hero [data-reveal]');

  if (!hasGsap || prefersReduced || skip) {
    intro.classList.add('is-done');
    if (hasGsap) gsap.set([...heroLines, ...heroReveals], { clearProps: 'all', autoAlpha: 1, yPercent: 0, y: 0 });
    if (igniteScene) igniteScene(true);
    return;
  }

  const tl = gsap.timeline();
  tl.to(intro, { autoAlpha: 0, duration: 0.5, ease: 'power2.out', onComplete: () => intro.classList.add('is-done') })
    .add(() => { if (igniteScene) igniteScene(false); }, '<')
    .fromTo(heroLines, { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0.15)
    .fromTo(heroReveals, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09 }, 0.55);
}

function playIntro() {
  if (!hasGsap || prefersReduced) { finishIntro(true); return; }
  intro.classList.add('is-on');

  // pre-hide hero content
  gsap.set(document.querySelectorAll('.hero [data-split] .line > span'), { yPercent: 115 });
  gsap.set(document.querySelectorAll('.hero [data-reveal]'), { autoAlpha: 0 });

  const words = intro.querySelectorAll('.intro__word');
  const sweep = intro.querySelector('.intro__sweep');
  const tl = gsap.timeline({ onComplete: () => finishIntro() });
  tl.fromTo(words, { yPercent: 120 }, { yPercent: 0, duration: 0.7, ease: 'expo.out', stagger: 0.12 })
    .fromTo(sweep, { left: '-60%' }, { left: '120%', duration: 0.7, ease: 'power2.inOut' }, '-=0.25')
    .to({}, { duration: 0.25 });

  // skippable
  const skip = () => finishIntro(true);
  window.addEventListener('wheel', skip, { once: true, passive: true });
  window.addEventListener('touchstart', skip, { once: true, passive: true });
  window.addEventListener('keydown', skip, { once: true });
  intro.addEventListener('click', skip, { once: true });
}

/* ---------- 3D scene ---------- */
const NODE_DEFS = [
  { label: 'וואטסאפ', pos: [2.3, 1.8, -0.4] },
  { label: 'CRM', pos: [-2.7, 1.3, -0.6] },
  { label: 'יומן', pos: [2.5, -1.7, 0.2] },
  { label: 'אימייל', pos: [-3.0, -0.9, 0.1] },
  { label: "צ'אטבוט", pos: [1.2, 2.5, -1.2] },
  { label: 'אנליטיקס', pos: [-1.7, -2.2, -0.3] },
  { label: 'טפסים', pos: [0.2, -2.6, -1.0] },
];

async function initScene() {
  const canvas = document.getElementById('gl');
  let THREE;
  try {
    THREE = await import('three');
  } catch (err) {
    document.body.classList.add('no-webgl');
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (err) {
    document.body.classList.add('no-webgl');
    return;
  }

  const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
  renderer.setPixelRatio(DPR);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030511);
  scene.fog = new THREE.Fog(0x030511, 9, 18);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  const CAM_BASE = { x: 0, y: 0.35, z: 7.6 };
  camera.position.set(CAM_BASE.x, CAM_BASE.y, CAM_BASE.z);

  const world = new THREE.Group();
  scene.add(world);
  // shift the network toward the visual left so the RTL text column breathes
  world.position.x = isMobile ? 0 : -2.05;
  if (isMobile) world.scale.setScalar(0.72);

  /* --- lighting --- */
  scene.add(new THREE.AmbientLight(0x223055, 0.8));
  const key = new THREE.DirectionalLight(0x9db8ff, 1.4);
  key.position.set(4, 6, 6);
  scene.add(key);
  const coreLight = new THREE.PointLight(0x4d7cfe, 0, 14, 1.8);
  world.add(coreLight);

  /* --- core: fresnel energy sphere + wireframe shell --- */
  const uniforms = {
    uTime: { value: 0 },
    uIntensity: { value: prefersReduced ? 1 : 0.05 },
    uColorA: { value: new THREE.Color(0x1b3fae) },
    uColorB: { value: new THREE.Color(0x3be0f8) },
  };
  const coreMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      uniform float uTime;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec3 p = position + normal * 0.025 * sin(uTime * 1.4 + position.y * 5.0);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vView;
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      void main() {
        float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.2);
        float pulse = 0.85 + 0.15 * sin(uTime * 2.0);
        vec3 col = mix(uColorA, uColorB, fres) * (0.45 + fres * 1.6) * pulse * uIntensity;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 4), coreMat);
  world.add(core);

  const shellMat = new THREE.MeshBasicMaterial({
    color: 0x6fa3ff, wireframe: true, transparent: true, opacity: 0.14,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.22, 1), shellMat);
  world.add(shell);

  /* --- orbit rings --- */
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x4d7cfe, transparent: true, opacity: 0.32,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.012, 8, 160), ringMat);
  ring1.rotation.x = Math.PI / 2.25;
  world.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.008, 8, 160), ringMat.clone());
  ring2.material.opacity = 0.18;
  ring2.rotation.x = Math.PI / 1.75;
  ring2.rotation.y = 0.5;
  world.add(ring2);

  /* --- glow sprite texture (shared) --- */
  function makeGlowTexture(inner, outer) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, inner);
    g.addColorStop(0.35, outer);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  const glowTex = makeGlowTexture('rgba(190,235,255,1)', 'rgba(60,150,255,0.55)');
  const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0x5d8cff, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  coreGlow.scale.setScalar(4.6);
  world.add(coreGlow);

  /* --- nodes + connections + pulses --- */
  const nodeGroup = new THREE.Group();
  world.add(nodeGroup);
  const curves = [];
  const pulses = [];
  const pulseMat = new THREE.SpriteMaterial({
    map: glowTex, color: 0x3be0f8, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });

  const nodeGeo = new THREE.SphereGeometry(0.075, 20, 20);
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0x0c1430, emissive: 0x3be0f8, emissiveIntensity: 1.6, roughness: 0.3, metalness: 0.2,
  });
  const lineMat = new THREE.MeshBasicMaterial({
    color: 0x3f6cf0, transparent: true, opacity: 0.4,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });

  const labelEls = [];
  const labelWrap = document.getElementById('heroLabels');
  const visibleNodes = isMobile ? NODE_DEFS.slice(0, 4) : NODE_DEFS;

  visibleNodes.forEach((def, i) => {
    const pos = new THREE.Vector3(...def.pos);
    const node = new THREE.Mesh(nodeGeo, nodeMat);
    node.position.copy(pos);
    nodeGroup.add(node);

    const nGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: 0x3be0f8, transparent: true, opacity: 0.6,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    nGlow.position.copy(pos);
    nGlow.scale.setScalar(0.55);
    nodeGroup.add(nGlow);

    // curved connection toward core surface
    const dir = pos.clone().normalize();
    const end = dir.clone().multiplyScalar(1.0);
    const mid = pos.clone().multiplyScalar(0.5).add(
      new THREE.Vector3(0, (i % 2 ? 0.55 : -0.45), 0.25)
    );
    const curve = new THREE.QuadraticBezierCurve3(pos, mid, end);
    curves.push(curve);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 36, 0.0085, 6, false), lineMat);
    nodeGroup.add(tube);

    // 2 pulses per line
    for (let k = 0; k < 2; k++) {
      const sp = new THREE.Sprite(pulseMat.clone());
      sp.scale.setScalar(0.17);
      sp.userData = { curve, t: Math.random(), speed: 0.16 + Math.random() * 0.1 };
      nodeGroup.add(sp);
      pulses.push(sp);
    }

    // DOM label
    const el = document.createElement('span');
    el.className = 'hero-label';
    el.textContent = def.label;
    labelWrap.appendChild(el);
    labelEls.push({ el, pos });
  });

  /* --- particle field --- */
  const pCount = isMobile ? 500 : 1300;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const r = 4 + Math.random() * 9;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
    pPos[i * 3 + 2] = r * Math.cos(phi) * 0.7 - 2;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x7aa0ff, size: 0.025, transparent: true, opacity: 0.4,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  }));
  scene.add(particles);

  /* --- sizing --- */
  const stage = document.getElementById('stage');
  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* --- pointer parallax --- */
  const pointer = { x: 0, y: 0 };
  if (!prefersReduced && !isMobile) {
    window.addEventListener('pointermove', (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  /* --- scroll progress (camera push-in + fade) --- */
  let scrollP = 0;
  if (hasGsap && !prefersReduced) {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom 20%',
      scrub: 0.5,
      onUpdate: (self) => { scrollP = self.progress; },
    });
    gsap.to('.hero__stage', {
      autoAlpha: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: '55% top', end: 'bottom top', scrub: 0.4 },
    });
  }

  /* --- ignition (called when intro hands off) --- */
  let ignited = prefersReduced;
  igniteScene = (instant) => {
    ignited = true;
    if (!hasGsap || instant || prefersReduced) {
      uniforms.uIntensity.value = 1;
      coreLight.intensity = 14;
      coreGlow.material.opacity = 0.55;
      labelEls.forEach(({ el }) => { el.style.opacity = 1; });
      return;
    }
    gsap.to(uniforms.uIntensity, { value: 1, duration: 1.4, ease: 'power2.out' });
    gsap.to(coreLight, { intensity: 14, duration: 1.4, ease: 'power2.out' });
    gsap.to(coreGlow.material, { opacity: 0.55, duration: 1.6, ease: 'power2.out' });
    gsap.to(labelEls.map((l) => l.el), { opacity: 1, duration: 0.8, stagger: 0.07, delay: 0.5 });
  };

  /* --- label projection --- */
  const v3 = new THREE.Vector3();
  function updateLabels() {
    const w = stage.clientWidth, h = stage.clientHeight;
    labelEls.forEach(({ el, pos }) => {
      v3.copy(pos).applyMatrix4(nodeGroup.matrixWorld);
      v3.project(camera);
      const x = (v3.x * 0.5 + 0.5) * w;
      const y = (-v3.y * 0.5 + 0.5) * h;
      el.style.right = 'auto';
      el.style.left = '0';
      el.style.top = '0';
      el.style.transform = `translate(${x}px, ${y - 26}px) translate(-50%, -50%)`;
    });
  }

  /* --- render loop --- */
  const clock = new THREE.Clock();
  let inView = true;
  new IntersectionObserver((entries) => { inView = entries[0].isIntersecting; }, { threshold: 0 })
    .observe(stage);

  let camX = 0, camY = 0;

  function frame() {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;

    world.rotation.y = t * 0.06 + scrollP * 0.7;
    shell.rotation.y = -t * 0.12;
    shell.rotation.x = t * 0.05;
    ring1.rotation.z = t * 0.1;
    ring2.rotation.z = -t * 0.08;
    particles.rotation.y = t * 0.012;

    if (ignited) {
      pulses.forEach((sp) => {
        sp.userData.t += sp.userData.speed * 0.016;
        if (sp.userData.t > 1) sp.userData.t = 0;
        const p = sp.userData.curve.getPoint(sp.userData.t);
        sp.position.copy(p);
        sp.material.opacity = 0.9 * Math.sin(sp.userData.t * Math.PI);
      });
    }

    // camera: parallax + scroll push-in
    camX += ((pointer.x * 0.45) - camX) * 0.04;
    camY += ((-pointer.y * 0.3) - camY) * 0.04;
    camera.position.x = CAM_BASE.x + camX;
    camera.position.y = CAM_BASE.y + camY;
    camera.position.z = CAM_BASE.z - scrollP * 2.1;
    camera.lookAt(world.position.x, 0, 0);

    renderer.render(scene, camera);
    updateLabels();
  }

  if (prefersReduced) {
    // static premium frame, no loop
    uniforms.uIntensity.value = 1;
    coreLight.intensity = 14;
    coreGlow.material.opacity = 0.55;
    labelEls.forEach(({ el }) => { el.style.opacity = 1; });
    frame();
    window.addEventListener('resize', () => { resize(); frame(); });
    return renderer;
  }

  renderer.setAnimationLoop(() => { if (inView) frame(); });
  renderer.compile(scene, camera);
  return renderer;
}

/* ---------- Demo chat loop ---------- */
const DEMO_SCRIPT = [
  { who: 'in', text: 'היי, ראיתי את המודעה שלכם. אפשר לשמוע פרטים?' },
  { who: 'out', text: 'היי! כיף שפנית. כדי שאתאים לך מענה מדויק — באיזה תחום העסק שלך?' },
  { who: 'in', text: 'יש לי קליניקה. מחפש אוטומציה לתיאום תורים.' },
  { who: 'out', text: 'מעולה, זה בדיוק מה שאנחנו עושים. מתאים לך שיחת היכרות קצרה מחר ב־10:30?' },
  { who: 'in', text: 'כן, מתאים לי.' },
  { who: 'out', text: 'קבעתי לך ביומן ושלחתי אישור למייל. נתראה מחר!' },
];

function initDemo() {
  const thread = document.getElementById('demoThread');
  if (!thread) return;
  let visible = false;
  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0.3 })
    .observe(thread);

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const waitVisible = async () => { while (!visible) await wait(400); };

  function addMsg(who, text) {
    const el = document.createElement('div');
    el.className = `demo-msg demo-msg--${who}`;
    el.textContent = text;
    thread.appendChild(el);
    if (hasGsap && !prefersReduced) {
      gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' });
    } else {
      el.style.opacity = 1;
      el.style.transform = 'none';
    }
    return el;
  }

  function addTyping() {
    const el = document.createElement('div');
    el.className = 'demo-msg demo-msg--in demo-msg--out demo-msg--typing';
    el.classList.remove('demo-msg--in');
    el.innerHTML = '<i></i><i></i><i></i>';
    el.style.opacity = 1;
    el.style.transform = 'none';
    thread.appendChild(el);
    return el;
  }

  (async function loop() {
    // honour reduced motion: render the conversation statically, once
    if (prefersReduced) {
      DEMO_SCRIPT.forEach((m) => addMsg(m.who, m.text));
      return;
    }
    for (;;) {
      await waitVisible();
      thread.innerHTML = '';
      for (const m of DEMO_SCRIPT) {
        await waitVisible();
        if (m.who === 'out') {
          const typing = addTyping();
          await wait(900);
          typing.remove();
        } else {
          await wait(600);
        }
        addMsg(m.who, m.text);
        await wait(1300);
      }
      await wait(3200);
    }
  })();
}

/* ---------- Lead form → WhatsApp ---------- */
function initForm() {
  const form = document.getElementById('leadForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameF = form.querySelector('#f-name');
    const phoneF = form.querySelector('#f-phone');
    const msgF = form.querySelector('#f-msg');
    let ok = true;

    [[nameF, (v) => v.trim().length >= 2], [phoneF, (v) => /^0\d{1,2}-?\d{7}$/.test(v.trim())]]
      .forEach(([field, test]) => {
        const valid = test(field.value);
        field.closest('.field').classList.toggle('is-invalid', !valid);
        if (!valid) ok = false;
      });
    if (!ok) return;

    const lines = [
      'היי, אשמח לקבוע שיחת אסטרטגיה.',
      `שם: ${nameF.value.trim()}`,
      `טלפון: ${phoneF.value.trim()}`,
    ];
    if (msgF.value.trim()) lines.push(`מה מעניין אותי: ${msgF.value.trim()}`);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  });

  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => input.closest('.field').classList.remove('is-invalid'));
  });
}

/* ---------- boot ---------- */
setupReveals();
initDemo();
initForm();

(async () => {
  // start intro + scene together; intro ends → scene ignites
  const scenePromise = initScene().catch(() => document.body.classList.add('no-webgl'));
  if (document.fonts && document.fonts.ready) {
    try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]); } catch (e) { /* ignore */ }
  }
  playIntro();
  await scenePromise;
  // if the intro already finished before the scene loaded, ignite now
  if (introDone && igniteScene) igniteScene(true);
})();
