// Liquid-metal ZH mark: chrome letters, glossy blue wave, molten orange bolt.
// Inspired by Paper's liquid-logo; masks are drawn live so it stays sharp at any size.
import * as THREE from './vendor/three.module.js';
import { NOISE } from './gradient.js';

const W = 1400, H = 900;

function drawMasks(font) {
  // three layers: letters, wave, bolt
  const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
  const letters = mk(), wave = mk(), bolt = mk();
  let g = letters.getContext('2d');
  g.fillStyle = '#fff'; g.textBaseline = 'alphabetic';
  g.save(); g.translate(W / 2 - 30, 640); g.transform(1, 0, -0.2, 1, 0, 0);
  g.font = `900 560px ${font}`; g.textAlign = 'center';
  g.letterSpacing = '-30px';
  g.fillText('ZH', 0, 0); g.restore();
  // carve the wave channel out of the letters (like the logo)
  const wavePath = (ctx, off = 0, thick = 1) => {
    ctx.beginPath();
    ctx.moveTo(250, 560 + off);
    ctx.bezierCurveTo(520, 520 + off, 640, 330 + off, 1060, 330 + off);
    ctx.bezierCurveTo(1110, 330 + off, 1140, 345 + off, 1160, 360 + off);
    ctx.bezierCurveTo(1120, 390 + off + 40 * thick, 1060, 380 + off + 40 * thick, 980, 395 + off + 40 * thick);
    ctx.bezierCurveTo(700, 430 + off + 40 * thick, 560, 600 + off + 30 * thick, 250, 560 + off);
    ctx.closePath();
  };
  g.globalCompositeOperation = 'destination-out';
  g.lineWidth = 34; g.strokeStyle = '#000'; wavePath(g, 0, 1.4); g.stroke(); g.fill();
  g.globalCompositeOperation = 'source-over';
  g = wave.getContext('2d'); g.fillStyle = '#fff'; wavePath(g, 0, 1.4); g.fill();
  g = bolt.getContext('2d'); g.fillStyle = '#fff'; g.beginPath();
  [[1225, 230], [1120, 470], [1190, 470], [1135, 680], [1310, 400], [1235, 400], [1300, 230]].forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y));
  g.closePath(); g.fill();
  // pack: R letters, G wave, B bolt   +  blurred copy for bevel height
  const pack = (blur) => {
    const c = mk(), x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
    x.globalCompositeOperation = 'lighter'; if (blur) x.filter = `blur(${blur}px)`;
    const tint = (src, col) => { const t = mk(), tx = t.getContext('2d'); tx.drawImage(src, 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = col; tx.fillRect(0, 0, W, H); x.drawImage(t, 0, 0); };
    tint(letters, '#f00'); tint(wave, '#0f0'); tint(bolt, '#00f');
    return c;
  };
  return { sharp: pack(0), soft: pack(26) };
}

export async function createLogo(canvas, state) {
  try { await document.fonts.load('900 200px Unbounded'); } catch {}
  const { sharp, soft } = drawMasks('Unbounded, Arial Black, sans-serif');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0, 0);
  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const tex = c => { const t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; return t; };
  const uniforms = { uMask: { value: tex(sharp) }, uSoft: { value: tex(soft) }, uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uRes: { value: new THREE.Vector2(W, H) }, uIntro: { value: 0 } };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: false, blending: THREE.NoBlending,
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
    fragmentShader: NOISE + /* glsl */`
      uniform sampler2D uMask, uSoft; uniform float uTime, uIntro; uniform vec2 uMouse, uRes; varying vec2 vUv;
      vec3 chrome(float t){ // banded studio-reflection ramp
        t=fract(t);
        vec3 a=vec3(.03,.08,.2), b=vec3(.93,.96,1.), c=vec3(.42,.5,.62), d=vec3(1.);
        return t<.22?mix(a,c,t/.22): t<.45?mix(c,b,(t-.22)/.23): t<.55?mix(b,d,(t-.45)/.1): t<.75?mix(d,vec3(.35,.42,.55),(t-.55)/.2): mix(vec3(.35,.42,.55),a,(t-.75)/.25);
      }
      void main(){
        vec2 uv=vUv;
        float t=uTime*.25;
        // liquid wobble of the sampling coords
        vec2 w=vec2(snoise(vec3(uv*2.,t)),snoise(vec3(uv*2.+7.,t)))*.0015;
        vec4 m=texture2D(uMask,uv+w);
        float a=max(m.r,max(m.g,m.b));
        if(a<.01) discard;
        vec2 px=1./uRes*7.;
        // smoothed central differences (canvas blur is dithered, so average taps)
        #define SS(o) (texture2D(uSoft,uv+(o)+vec2(px.x,px.y)*.5).rgb+texture2D(uSoft,uv+(o)-vec2(px.x,px.y)*.5).rgb+texture2D(uSoft,uv+(o)+vec2(px.x,-px.y)*.5).rgb+texture2D(uSoft,uv+(o)-vec2(px.x,-px.y)*.5).rgb)*.25
        vec3 hgt=SS(vec2(0.));
        vec3 dx=(SS(vec2(px.x,0.))-SS(vec2(-px.x,0.)))*.5, dy=(SS(vec2(0.,px.y))-SS(vec2(0.,-px.y)))*.5;
        float layerL=step(.5,m.r), layerW=step(.5,m.g), layerB=step(.5,m.b);
        float ddx=dot(dx,vec3(layerL,layerW,layerB)), ddy=dot(dy,vec3(layerL,layerW,layerB));
        float hh=dot(hgt,vec3(layerL,layerW,layerB));
        vec3 n=normalize(vec3(-ddx*5.,-ddy*5.,.4));
        // flowing reflection coordinate
        float flow=snoise(vec3(uv*vec2(1.1,.8)+uMouse*.12,t*.6));
        float r=(dot(n.xy,vec2(.5,.85))*.75+uv.y*1.1-uv.x*.3+flow*.16+uMouse.x*.2)*1.55+t*.3;
        vec3 col;
        if(layerB>.5){ // molten orange bolt
          float k=fract(r*1.2);
          col=mix(vec3(.85,.25,0.),vec3(1.,.62,.08),smoothstep(.0,.5,k));
          col=mix(col,vec3(1.,.93,.7),smoothstep(.62,.72,k)*(1.-smoothstep(.72,.9,k)));
        } else if(layerW>.5){ // glossy blue wave
          float k=fract(r*.9+.3);
          col=mix(vec3(.02,.3,.85),vec3(.2,.78,1.),smoothstep(.1,.6,k)+uv.x*.25);
          col=mix(col,vec3(.85,.97,1.),smoothstep(.55,.62,k)*(1.-smoothstep(.62,.8,k)));
        } else {
          col=chrome(r);
          col=mix(col,col*vec3(.75,.85,1.05),smoothstep(.55,.2,uv.y)); // cool blue base like the brand mark
        }
        float rim=pow(1.-clamp(n.z,0.,1.),2.);
        col+=rim*.25;
        col*=.9+.2*hh;
        float alpha=smoothstep(.0,.5,a)*uIntro;
        gl_FragColor=vec4(col*alpha,alpha);
      }`
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
  function resize() { const r = canvas.getBoundingClientRect(); renderer.setSize(r.width, r.height, false); }
  addEventListener('resize', resize); resize();
  const clock = (() => { let last = performance.now(); return { getDelta() { const now = performance.now(), d = (now - last) / 1000; last = now; return d; } }; })(); let visible = true;
  new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(canvas);
  const sm = new THREE.Vector2();
  (function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .05);
    if (!visible || document.hidden) return;
    uniforms.uTime.value += dt * (state.reduce ? .2 : 1);
    sm.lerp(state.mouse, 1 - Math.pow(.03, dt)); uniforms.uMouse.value.copy(sm);
    if (state.started) uniforms.uIntro.value = Math.min(1, uniforms.uIntro.value + dt * .8);
    renderer.render(scene, camera);
  })();
}
