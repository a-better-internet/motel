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
/* ----------------------------------------------------------------------
   A SHOULDER, NOT A CURVE.

   Every colour in this world is a painted hex, and with NoToneMapping it
   arrives on screen exactly as painted — which is the whole point, and
   which worked right up until something was lit by more than one unit of
   light. A white-painted lounger in the sun carries an albedo of about
   0.89 and sits under sun 1.12 plus hemisphere 0.72 plus ambient 0.15, so
   it leaves the shader at 1.8 and hard-clips. Every face of it clips to
   exactly 255,255,255: no shading, no edges, no form. The same thing was
   happening to the coping, the office fluorescents, the roller screen in
   the bar and any lamp you stood close to — "blown out with harsh white
   light", precisely.

   Rather than repaint a thousand hexes or dim the sun until the desert
   looks overcast, this adds a shoulder to the top of the range and leaves
   the rest alone. Below 0.76 the output is the input to the last bit: the
   painted colours stay literal, which was the reason for NoToneMapping in
   the first place. Above it each channel rolls off exponentially and
   approaches 1.0 without ever reaching it, so a bright surface keeps its
   gradients and a lamp keeps its colour instead of going to paper white.
   Per channel, not per luminance, so a warm highlight stays warm rather
   than being pulled towards grey the way a filmic curve would pull it.
   ---------------------------------------------------------------------- */
T.ShaderChunk.tonemapping_pars_fragment =
  T.ShaderChunk.tonemapping_pars_fragment.replace(
    "vec3 CustomToneMapping( vec3 color ) { return color; }",
    [ "vec3 CustomToneMapping( vec3 color ) {",
      "  color *= toneMappingExposure;",
      "  const float K = 0.76;",                 // where the shoulder starts
      "  vec3 lo = min( color, vec3( K ) );",
      "  vec3 hi = max( color - vec3( K ), vec3( 0.0 ) );",
      "  return lo + ( 1.0 - K ) * ( vec3( 1.0 ) - exp( -hi / ( 1.0 - K ) ) );",
      "}" ].join("\n"));
renderer.toneMapping=T.CustomToneMapping;      // painted colours stay literal
renderer.toneMappingExposure=1.0;              // below 0.76 this is a no-op
app.appendChild(renderer.domElement);
const MAXANISO=Math.min(8, renderer.capabilities.getMaxAnisotropy());
for(const k in TEX){ if(TEX[k] && TEX[k].isTexture) TEX[k].anisotropy=MAXANISO; }

const scene=new T.Scene();
// Depth precision is set by the near plane far more than the far one. At 0.08
// the buffer had about 19 cm of resolution half a kilometre out, which is why
// distant signs and panels buzzed; 0.24 brings that to 6 cm. The player can
// never get closer than the collision radius anyway.
/* A FIELD OF VIEW THAT DOES NOT STRETCH.
   three.js takes a VERTICAL angle, and this one was 72°: on a 16:9 screen
   that is 104° across, a wide-angle lens, and a wide angle stretches
   whatever is off-centre — a car near the edge of the frame was half again
   as long as the same car in the middle, so turning your head a few
   degrees visibly squashed and pulled it. The wheel could take it to 95°
   (122° across). The angle is now worked out from the screen's shape so the
   view is about 88° across on any screen, held between 50° and 66°
   vertically, and the wheel only zooms in from there or opens it a little. */
const FOV_ACROSS=88, FOV_MIN=50, FOV_MAX=66;
function baseFov(aspect){
  const h=FOV_ACROSS*Math.PI/180;
  const v=2*Math.atan(Math.tan(h/2)/Math.max(aspect,0.2))*180/Math.PI;
  return Math.max(FOV_MIN, Math.min(FOV_MAX, v));
}
let fovZoom=0;                         // the wheel's offset from the base, in degrees
const camera=new T.PerspectiveCamera(baseFov(innerWidth/innerHeight), innerWidth/innerHeight, 0.24, 4000);
const ortho=new T.OrthographicCamera(-60,60,45,-45,0.1,600);
let view="fp", fov=camera.fov;
function applyFov(){
  fov=Math.max(30, Math.min(72, baseFov(camera.aspect)+fovZoom));
  camera.fov=fov; camera.updateProjectionMatrix();
}

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
// to read. 3072 texels across it is 2 cm a texel at 64 m and 3 cm at 92 —
// either is finer than the 10 cm features the scene is full of (the
// waterline tile band, the coping, the walkway joints), and 64 was not
// enough world: standing at the far side of the car park, the motel was
// forty metres off and cast nothing at all onto its own forecourt. 92 m
// holds the whole court from anywhere you can stand in it.
/* The key sits KEY_D metres out along the sun direction from a target at the
   player, and the depth map only has to span the 92 m box around that
   target: ±100 m of depth, not the 1-520 m it used to cover from a light
   parked 200-280 m away. Depth precision is what a bias is measured in, so
   halving the range halves the bias needed for the same protection. */
const KEY_D=110;
ksc.near=KEY_D-100; ksc.far=KEY_D+100; ksc.left=-46; ksc.right=46; ksc.top=46; ksc.bottom=-46;
/* AND THEN TELL IT. An OrthographicCamera builds its projection matrix in its
   constructor and never again on its own; three.js's shadow pass only
   recomputes the VIEW matrix each frame. So every one of the six numbers
   above was being written into a camera that went on projecting the default
   DirectionalLightShadow frustum — a ten-metre box, near 0.5, far 500 —
   which is why the motel cast no shadow on its own car park at nine in the
   morning and the only shadows in the world were the ones within five
   metres of your feet. The far plane is 520 because the key sits up to
   280 m from its target when the sun is high, and anything past far is
   simply not drawn into the map.
   Any later change to ksc has to be followed by this call. */
ksc.updateProjectionMatrix();
/* SHADOWS THAT TOUCH WHAT CASTS THEM. Bias and normalBias both buy freedom
   from acne by moving the shadow away from its caster: at -0.00022 over a
   519 m range and 0.046 normalBias, a post stood on the lot had an 11 cm
   strip of sunlight between its foot and its shadow at an evening sun (24
   on the textured asphalt), which is the "gap" that made every shadow in
   the world look pasted on. Most of that bias was only ever needed because
   flat decals were casting onto the surfaces they lie on — see bakeBuckets.
   With those out of the depth map, measured with sgap45.js at 9, 13 and 17
   o'clock: gap 0.6-1.8 cm (the PCF soft edge itself), and no acne on the
   lot, the motel front or the pool deck. */
key.shadow.bias=-0.00005; key.shadow.normalBias=0.012;
const SHADOW_SNAP=(ksc.right-ksc.left)/key.shadow.mapSize.x*2;   // kills the crawl
scene.add(key); scene.add(key.target);
