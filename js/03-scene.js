"use strict";
/* LOW DESERT MOTEL · 03-scene.js
   renderer, scene, cameras
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   3 · RENDERER / SCENE / CAMERAS
   ---------------------------------------------------------------------- */
const app=document.getElementById("app");
const renderer=new T.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=T.PCFSoftShadowMap;
try{ renderer.outputColorSpace=T.SRGBColorSpace; }catch(e){ renderer.outputEncoding=T.sRGBEncoding; }
renderer.toneMapping=T.NoToneMapping;          // painted colours stay literal
app.appendChild(renderer.domElement);
const MAXANISO=Math.min(8, renderer.capabilities.getMaxAnisotropy());
for(const k in TEX){ if(TEX[k] && TEX[k].isTexture) TEX[k].anisotropy=MAXANISO; }

const scene=new T.Scene();
// Depth precision is set by the near plane far more than the far one. At 0.08
// the buffer had about 19 cm of resolution half a kilometre out, which is why
// distant signs and panels buzzed; 0.24 brings that to 6 cm. The player can
// never get closer than the collision radius anyway.
const camera=new T.PerspectiveCamera(72, innerWidth/innerHeight, 0.24, 4000);
const ortho=new T.OrthographicCamera(-60,60,45,-45,0.1,600);
let view="fp", fov=72;

/* --- Layer 1 · base fill ------------------------------------------------ */
const hemi=new T.HemisphereLight(0xffe7c4, 0x4a2a18, 0.72); scene.add(hemi);
const amb =new T.AmbientLight(0xfff0dc, 0.10); scene.add(amb);

/* --- the flashlight ----------------------------------------------------
   One spot, parented to nothing: it is moved onto the camera every frame and
   aimed down the view. No shadows — a shadow-casting spot on a scene this
   size costs more than the whole rest of the lighting — but a tight cone, a
   soft edge and a short throw read as a torch beam well enough, and there is
   a little spill at the lens so your own hands-width of floor is lit.    */
const torch=new T.SpotLight(0xfff0d0, 0.0, 34, 0.40, 0.55, 1.35);
torch.castShadow=false;
const torchTarget=new T.Object3D();
scene.add(torch); scene.add(torchTarget);
torch.target=torchTarget;
const torchSpill=new T.PointLight(0xffe9c0, 0.0, 6.0, 1.7);
scene.add(torchSpill);
let torchOn=false, torchLvl=0;
const _torchDir=new T.Vector3();

/* --- Layer 2 · the one shadow-casting key (sun, becomes moon at night) -- */
const key=new T.DirectionalLight(0xffeed0, 1.10);
key.position.set(70,110,50); key.castShadow=true;
key.shadow.mapSize.set(3072,3072);
const ksc=key.shadow.camera;
// The frustum follows the player, so it only has to cover what is near enough
// to read: 64 m across 3072 texels is 2 cm a texel, against 5.5 cm before.
// That matters because the scene is full of 10 cm features — the waterline
// tile band, the coping, the walkway joints — and a normalBias wide enough to
// stop banding on the big slabs was wider than the features themselves, which
// is what broke the pool rim into blocks.
ksc.near=1; ksc.far=260; ksc.left=-32; ksc.right=32; ksc.top=32; ksc.bottom=-32;
key.shadow.bias=-0.00022; key.shadow.normalBias=0.032;
const SHADOW_SNAP=(ksc.right-ksc.left)/key.shadow.mapSize.x*2;   // kills the crawl
scene.add(key); scene.add(key.target);
