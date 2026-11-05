// Hero background: a ShaderGradient-style noise-displaced surface in ZH brand colours.
import * as THREE from './vendor/three.module.js';

const NOISE = /* glsl */`
// 3D simplex noise — Ashima Arts / Stefan Gustavson (MIT)
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;
export { NOISE };

export function createGradient(canvas, state) {
  const mobile = matchMedia('(max-width: 720px)').matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 6.2);

  const uniforms = {
    uTime: { value: 0 }, uTemp: { value: 0.2 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2() },
    uFreq: { value: 0.32 }, uAmp: { value: 0.75 }, uDensity: { value: 1.6 }, uSpeed: { value: 0.14 }
  };
  const geo = new THREE.PlaneGeometry(26, 16, mobile ? 120 : 220, mobile ? 80 : 140);
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: NOISE + /* glsl */`
      uniform float uTime, uFreq, uAmp, uDensity, uSpeed; uniform vec2 uMouse;
      varying float vH; varying vec2 vUv; varying vec3 vPos; varying vec3 vN;
      float field(vec3 p){
        float t=uTime*uSpeed;
        float n=snoise(vec3(p.x*uFreq*.6+t, p.y*uFreq*uDensity-t*.6, t*.8));
        n+=.35*snoise(vec3(p.x*uFreq*1.7-t*1.3, p.y*uFreq*1.9, t*1.4+4.));
        return n;
      }
      void main(){
        vUv=uv; vec3 p=position;
        float h=field(p);
        float md=length(p.xy-uMouse*vec2(6.,3.5));
        h+=.35*exp(-md*md*.35);           // pointer swell
        float e=.08; vec3 q=position;
        float hx=field(q+vec3(e,0.,0.)), hy=field(q+vec3(0.,e,0.));
        vN=normalize(vec3(-(hx-h)*uAmp/e,-(hy-h)*uAmp/e,1.));
        p.z+=h*uAmp; vH=h; vPos=p;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
      }`,
    fragmentShader: /* glsl */`
      uniform float uTime, uTemp; uniform vec2 uRes; varying float vH; varying vec2 vUv; varying vec3 vPos; varying vec3 vN;
      // ZH brand palette
      const vec3 SNOW=vec3(.957,.972,.992), ICE=vec3(.74,.87,1.), SKY=vec3(.23,.63,1.), ROYAL=vec3(.05,.36,.84), NAVY=vec3(.04,.12,.27), ORANGE=vec3(1.,.48,.0), AMBER=vec3(1.,.72,.22);
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){
        vec3 n=normalize(vN);
        float h=vH*.5+.5;
        float band=h+vUv.y*.25;
        vec3 c=mix(SNOW,ICE,smoothstep(.2,.5,band));
        c=mix(c,SKY,smoothstep(.62,.86,band)*.85);
        c=mix(c,ROYAL,smoothstep(.88,1.1,band)*.8);
        c=mix(c,NAVY,smoothstep(.95,1.2,band)*.6);
        // warm side follows temperature
        float warm=smoothstep(.15,1.,vUv.x+uTemp*.55-.15)*smoothstep(.35,.9,h);
        c=mix(c,mix(ORANGE,AMBER,h),warm*.75*clamp(uTemp+.55,0.,1.));
        // soft light
        vec3 L=normalize(vec3(-.4,.6,.9));
        float dif=clamp(dot(n,L),0.,1.);
        float spec=pow(clamp(dot(reflect(-L,n),vec3(0.,0.,1.)),0.,1.),18.);
        c*= .86+.2*dif; c+=spec*.22;
        // fade into page at the bottom & left for legibility
        vec2 sp=gl_FragCoord.xy/uRes;
        c=mix(c,SNOW,smoothstep(.45,.0,sp.y)*.9);          // calm bottom for text
        c=mix(c,SNOW,smoothstep(.62,.05,sp.x)*.62);         // calm left for headline
        c+=(hash(gl_FragCoord.xy+fract(uTime))-.5)*.035; // grain
        gl_FragColor=vec4(c,1.);
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.set(-0.55, 0.1, 0.42);
  mesh.position.set(0.8, -0.4, -1.4);
  scene.add(mesh);

  function resize() {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    uniforms.uRes.value.set(r.width * renderer.getPixelRatio(), r.height * renderer.getPixelRatio());
    camera.aspect = r.width / Math.max(1, r.height); camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();

  const clock = (() => { let last = performance.now(); return { getDelta() { const now = performance.now(), d = (now - last) / 1000; last = now; return d; } }; })(); let visible = true;
  new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(canvas);
  const sm = new THREE.Vector2();
  (function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .05);
    if (!visible || document.hidden) return;
    uniforms.uTime.value += dt * (state.reduce ? 0.15 : 1);
    sm.lerp(state.mouse, 1 - Math.pow(.02, dt));
    uniforms.uMouse.value.copy(sm);
    uniforms.uTemp.value += ((state.temp ?? .2) - uniforms.uTemp.value) * (1 - Math.pow(.05, dt));
    mesh.rotation.z = .42 + sm.x * .05; mesh.rotation.x = -.55 + sm.y * .04;
    renderer.render(scene, camera);
  })();
  return { resize };
}
