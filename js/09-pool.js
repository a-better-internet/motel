"use strict";
/* LOW DESERT MOTEL · 09-pool.js
   the pool, its water shader and its deck
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   9 · THE POOL — the reason to come back after dark
   ---------------------------------------------------------------------- */
const POOL_LIGHTS=[]; let waterMat=null, poolFloorCaustic=null, poolGlow=null;
let waterGeo=null, waterMesh=null;
(function buildPool(){
  const D=POOL.deck, P=POOL, dy=0.10;
  // deck apron in four plates so the tank itself stays open to walk into
  const plate=(x0,x1,z0,z1)=>{
    bx("concrete", x1-x0, 0.22, z1-z0, (x0+x1)/2, dy-0.11, (z0+z1)/2, 0.45, 0, "#b3ada0");
    addFlat(x0-0.1,x1+0.1,z0-0.1,z1+0.1, dy);   // walkable right up to the coping
  };
  // The apron's inner edge and the shell wall's inner face were the same
  // plane all the way round the tank — a couple of square metres of concrete
  // and plaster arguing over the depth buffer at exactly the waterline. The
  // apron now stops 60 mm short and the shell wall fills the gap.
  const TE=0.06;
  plate(D.x0, D.x1, D.z0, P.z0-TE);
  plate(D.x0, D.x1, P.z1+TE, D.z1);
  plate(D.x0, P.x0-TE, P.z0-TE, P.z1+TE);
  plate(P.x1+TE, D.x1, P.z0-TE, P.z1+TE);
  addZone(D.x0,D.x1,D.z0,D.z1, -3.2, 2.4, "POOL DECK");
  addZone(P.x0,P.x1,P.z0,P.z1, -3.2, 0.05, "IN THE POOL");

  // shell walls + sloping floor
  // the shell tops out 20 mm UNDER the deck slab and the coping covers both,
  // so the rim you walk on is one surface rather than two on the same plane
  const wallT=0.28, deep=-2.30, shal=-1.05, wallH=2.70, wallC=dy-0.02-wallH/2;
  bx("plaster", P.x1-P.x0+wallT*2, wallH, wallT, (P.x0+P.x1)/2, wallC, P.z0-wallT/2, 0.4, 0, "#dbeef2");
  bx("plaster", P.x1-P.x0+wallT*2, wallH, wallT, (P.x0+P.x1)/2, wallC, P.z1+wallT/2, 0.4, 0, "#dbeef2");
  bx("plaster", wallT, wallH, P.z1-P.z0, P.x0-wallT/2, wallC, (P.z0+P.z1)/2, 0.4, 0, "#dbeef2");
  bx("plaster", wallT, wallH, P.z1-P.z0, P.x1+wallT/2, wallC, (P.z0+P.z1)/2, 0.4, 0, "#dbeef2");
  bx("plaster", 1.6, 0.24, P.z1-P.z0, P.x0+0.8, shal-0.12, (P.z0+P.z1)/2, 0.4, 0, "#dbeef2");
  bx("plaster", 1.6, 0.24, P.z1-P.z0, P.x1-0.8, deep-0.12, (P.z0+P.z1)/2, 0.4, 0, "#dbeef2");
  // push() takes (name, geo, x,y,z, ry, colour, rx, rz) — this had one zero too
  // many, so the tilt fell off the end of the argument list and the tank floor
  // was a flat plate at mid-depth with a step at each end. Those steps, seen
  // through the water, were the rectangles in the pool.
  const rampL=Math.hypot(P.x1-P.x0-3.2, deep-shal);
  push("plaster", boxGeo(rampL, 0.24, P.z1-P.z0, 0.4),
       (P.x0+P.x1)/2, (shal+deep)/2-0.12, (P.z0+P.z1)/2, 0, "#dbeef2", 0,
       Math.atan2(deep-shal, P.x1-P.x0-3.2));
  // waterline tile band + white coping cap
  // the two long bands run the full width; the short ones butt into them
  for(const s of [[P.x0-0.02,P.x1+0.02,P.z0-0.02,P.z0+0.10],[P.x0-0.02,P.x1+0.02,P.z1-0.10,P.z1+0.02],
                  [P.x0-0.02,P.x0+0.10,P.z0+0.10,P.z1-0.10],
                  [P.x1-0.10,P.x1+0.02,P.z0+0.10,P.z1-0.10]]){
    bx("pooltile", s[1]-s[0], 0.42, s[3]-s[2], (s[0]+s[1])/2, dy-0.26, (s[2]+s[3])/2, 0.8, 0, "#2f9fc9");
  }
  // the cap laps 30 mm out over the water, so its inner edge is not on the
  // same plane as the deck slab's, and the long runs own the corners
  const cop=0.36, lip=0.03;
  for(const s of [[P.x0-cop,P.x1+cop,P.z0-cop,P.z0+lip],[P.x0-cop,P.x1+cop,P.z1-lip,P.z1+cop],
                  [P.x0-cop,P.x0+lip,P.z0+lip,P.z1-lip],[P.x1-lip,P.x1+cop,P.z0+lip,P.z1-lip]]){
    bx("paint", s[1]-s[0], 0.14, s[3]-s[2], (s[0]+s[1])/2, dy+0.04, (s[2]+s[3])/2, 0, 0, "#eae6da");
  }
  // coping colliders — the whole rim except the entry steps
  const B=0.34;
  addCol(P.x0-B,P.x1+B, P.z0-B, P.z0+0.05, -3.2, dy+0.55);
  addCol(P.x0-B,P.x1+B, P.z1-0.05, P.z1+B, -3.2, dy+0.55);
  const ladZ=(P.z0+P.z1)/2;
  addCol(P.x1-0.05,P.x1+B, P.z0, ladZ-0.55, -3.2, dy+0.55);
  addCol(P.x1-0.05,P.x1+B, ladZ+0.55, P.z1, -3.2, dy+0.55);
  // climbing out at the ladder: a hidden ramp from the tank floor to the coping
  addRamp(P.x1-1.9, P.x1+0.34, ladZ-0.50, ladZ+0.50, "x", P.x1-1.9, P.x1+0.34, -2.30, dy);
  addCol(P.x0-B,P.x0+0.05, P.z0, POOL_STEPS.z0, -3.2, dy+0.55);
  addCol(P.x0-B,P.x0+0.05, POOL_STEPS.z1, P.z1, -3.2, dy+0.55);
  // entry steps in the shallow west corner
  for(let i=0;i<3;i++){
    const w=(3-i)*0.62;
    bx("plaster", w, 0.30, POOL_STEPS.z1-POOL_STEPS.z0, P.x0-0.05+w/2, -0.37-i*0.29,
       (POOL_STEPS.z0+POOL_STEPS.z1)/2, 0.6, 0, "#e2f2f5");
  }
  /* --- the deep-end ladder ---------------------------------------------
     WHAT WAS WRONG WITH IT. Three sticks that did not touch each other.
     The stiles ran from 35 cm above the tank floor to 4 cm above the
     coping, so the ladder floated in the water and stopped at your ankles
     instead of giving you anything to hold. The hand grips were two more
     loose bars hanging 20 cm clear of the coping and 14 cm out of line
     with the stiles, joined to nothing. And three rungs covered the top
     85 cm of a 2.5 m climb, so the bottom of the ladder had none at all.

     A pool ladder is ONE bent tube per side: up from the tank floor, over
     the coping in a quarter bend, across, and back down to a flange bolted
     to the deck. Built that way it cannot come apart, because every piece
     starts where the last one ended. The numbers below are chained — each
     is derived from the one before it rather than eyeballed — which is the
     only reason this now closes.                                        */
  {
    const LZ=(P.z0+P.z1)/2, HALF=0.28;      // the two stiles, 56 cm apart
    const LX=P.x1-0.26;                     // standing 26 cm off the wall
    const TOP=dy+0.11;                      // the top of the coping cap
    const BOT=deep;                         // the tank floor at the deep end
    const RISE=0.84, BR=0.20, HL=0.14;      // rail height, bend radius, the span
    const TUBE=0.035, CHR="#cfd6d8";
    const SY=TOP+RISE-BR;                   // where the stile stops and bends
    for(const q of [-1,1]){
      const zz=LZ+q*HALF;
      cyl("metal", TUBE,TUBE, SY-BOT, 10, LX, (BOT+SY)/2, zz, CHR);        // the stile
      cyl("metal", 0.055,0.055,0.03,12, LX, BOT+0.015, zz, CHR);           // its foot
      // over the coping: bend, span, bend, and down onto the deck flange
      push("metal", new T.TorusGeometry(BR, TUBE, 7, 12, Math.PI/2),
           LX+BR, SY, zz, 0, CHR, 0, Math.PI/2);
      cyl("metal", TUBE,TUBE, HL, 10, LX+BR+HL/2, TOP+RISE, zz, CHR, 0,0,Math.PI/2);
      push("metal", new T.TorusGeometry(BR, TUBE, 7, 12, Math.PI/2),
           LX+BR+HL, SY, zz, 0, CHR, 0, 0);
      cyl("metal", TUBE,TUBE, RISE-BR, 10, LX+BR+HL+BR, TOP+(RISE-BR)/2, zz, CHR);
      cyl("metal", 0.075,0.075,0.025,12, LX+BR+HL+BR, TOP+0.012, zz, "#b6bcbc");
      for(const b of [-1,1])                                               // its bolts
        cyl("metal", 0.010,0.010,0.012,8, LX+BR+HL+BR, TOP+0.022, zz+b*0.048, "#9aa1a6");
    }
    /* SEVEN RUNGS, not three, and spaced off the climb rather than off a
       round number: the top one sits just under the waterline where your
       hand finds it, the bottom one a hand's width off the floor. */
    const R0=BOT+0.30, R1=P.water-0.10, NR=7;
    for(let i=0;i<NR;i++)
      cyl("metal", 0.030,0.030, HALF*2, 8, LX, R0+(R1-R0)*i/(NR-1), LZ, CHR, Math.PI/2);
  }
  /* --- chrome grab rails at the shallow steps --------------------------
     Same disease, milder: an upright and a cross piece that passed each
     other with 6 cm of air at the corner. They turn now. */
  for(const z of [POOL_STEPS.z0+0.25, POOL_STEPS.z1-0.25]){
    const GX=P.x0-0.18, GY=dy+0.11, GR=0.18, GH=1.08, GL=0.34;
    cyl("metal", 0.035,0.035, GH-GR, 10, GX, GY+(GH-GR)/2, z, "#cfd6d8");
    push("metal", new T.TorusGeometry(GR, 0.035, 7, 12, Math.PI/2),
         GX+GR, GY+GH-GR, z, 0, "#cfd6d8", 0, Math.PI/2);
    cyl("metal", 0.035,0.035, GL, 10, GX+GR+GL/2, GY+GH, z, "#cfd6d8", 0,0,Math.PI/2);
    push("metal", new T.SphereGeometry(0.038,10,8), GX+GR+GL, GY+GH, z, 0, "#cfd6d8");
    cyl("metal", 0.075,0.075,0.025,12, GX, GY+0.012, z, "#b6bcbc");
  }

  /* --- the water ---------------------------------------------------------
     Built the way the Super Mario Sunshine breakdown argues water should be
     built: not as a simulation but as a stack of cheap, independently
     controllable illusions. Two wave patterns moving in different directions
     so their interference never repeats; Fresnel, so it is glass at a
     grazing angle and a window when you look straight down; depth, taken
     analytically from the tank's own floor profile, so the shallow end is
     pale and see-through and the drain end is dark; a shore blend and a foam
     band so the water does not end in a hard line at the wall; a tight
     specular for the glitter; caustics; and a distance band so the same
     pattern is not equally obvious everywhere. One draw call, no render
     targets, no per-frame CPU work at all — the swell and its normals are
     computed in the vertex shader.                                        */
  const wLap=0.08, wHX=(P.x1-P.x0)/2+wLap, wHZ=(P.z1-P.z0)/2+wLap;
  const wcx=(P.x0+P.x1)/2, wcz=(P.z0+P.z1)/2;
  waterGeo=new T.PlaneGeometry(wHX*2, wHZ*2, 56, 34);
  waterGeo.rotateX(-Math.PI/2);
  {
    const wp=waterGeo.attributes.position, fall=new Float32Array(wp.count);
    for(let i=0;i<wp.count;i++){
      const e=Math.min(wHX-Math.abs(wp.getX(i)), wHZ-Math.abs(wp.getZ(i)));
      fall[i]=clamp(e/0.55, 0, 1);            // the swell dies at the wall
    }
    waterGeo.setAttribute("aFall", new T.BufferAttribute(fall,1));
  }
  const WATER_VS = [
"attribute float aFall;",
"uniform float uTime;  uniform vec2 uPlayer;  uniform float uRipple;",
"varying vec3 vWorld;  varying vec3 vNrm;  varying float vFall;",
"void main(){",
"  vec4 wp = modelMatrix * vec4(position,1.0);",
"  vec2 p = wp.xz;  float t = uTime;  float h = 0.0;  vec2 g = vec2(0.0);",
// three long swells crossing at unrelated angles
"  vec2 d1=vec2(0.95,0.31); float k1=1.15, a1=0.020, w1=1.05;",
"  h += a1*sin(dot(p,d1)*k1 - t*w1);  g += a1*k1*d1*cos(dot(p,d1)*k1 - t*w1);",
"  vec2 d2=vec2(-0.42,0.91); float k2=1.83, a2=0.013, w2=1.37;",
"  h += a2*sin(dot(p,d2)*k2 - t*w2);  g += a2*k2*d2*cos(dot(p,d2)*k2 - t*w2);",
"  vec2 d3=vec2(0.66,-0.75); float k3=3.10, a3=0.007, w3=2.10;",
"  h += a3*sin(dot(p,d3)*k3 - t*w3);  g += a3*k3*d3*cos(dot(p,d3)*k3 - t*w3);",
// and a ring travelling out from wherever the player is standing
"  float r = max(distance(p, uPlayer), 0.001);",
"  float env = uRipple * exp(-r*0.62);",
"  h += env*0.020*sin(r*5.4 - t*4.6);",
"  g += normalize(p-uPlayer) * (env*0.020*5.4*cos(r*5.4 - t*4.6));",
"  h *= aFall;  g *= aFall;",
"  wp.y += h;  vWorld = wp.xyz;  vFall = aFall;",
"  vNrm = normalize(vec3(-g.x, 1.0, -g.y));",
"  gl_Position = projectionMatrix * viewMatrix * wp;",
"}"].join("\n");

  const WATER_FS = [
"precision highp float;",
"uniform float uTime, uDark, uReflect, uFoam, uGlow, uSunStr;",
"uniform vec3 uShallow, uDeep, uSky, uHorizon, uSunCol, uSunDir, uNight;",
"uniform vec4 uRect;  uniform vec4 uProf;   // x0,x1 of the slope, shallowY, deepY",
"uniform float uSurfY;",
"varying vec3 vWorld;  varying vec3 vNrm;  varying float vFall;",
// one pattern: four sinusoids with analytic slopes, drifting on its own vector
"vec3 pat(vec2 p, vec2 flow, float sc, float t){",
"  vec2 q = p*sc + flow*t;  float h=0.0;  vec2 g=vec2(0.0);",
"  vec2 a=vec2(0.99,0.14);  h+=0.50*sin(dot(q,a));      g+=0.50*a*cos(dot(q,a));",
"  vec2 b=vec2(-0.28,0.96); h+=0.36*sin(dot(q,b)*1.7);  g+=0.36*1.7*b*cos(dot(q,b)*1.7);",
"  vec2 c=vec2(0.61,-0.79); h+=0.24*sin(dot(q,c)*2.9);  g+=0.24*2.9*c*cos(dot(q,c)*2.9);",
"  vec2 d=vec2(-0.88,-0.47);h+=0.15*sin(dot(q,d)*4.7);  g+=0.15*4.7*d*cos(dot(q,d)*4.7);",
"  return vec3(h, g*sc);",
"}",
"void main(){",
"  vec3 V = normalize(cameraPosition - vWorld);",
"  float dist = distance(cameraPosition, vWorld);",
// Sunshine's distance trick: calm right under you, busiest in the mid field,
// simplifying again far off so the pattern is never equally obvious
"  float band = smoothstep(0.8, 6.0, dist) * (1.0 - smoothstep(24.0, 64.0, dist)*0.62);",
"  vec3 A = pat(vWorld.xz, vec2( 0.055, 0.034), 1.95, uTime);",
"  vec3 B = pat(vWorld.xz, vec2(-0.041, 0.068), 1.02, uTime);",
// a third, much finer pattern that only exists close to you. Water has ripples
// smaller than the swell, but at fifteen metres they alias into noise, so they
// fade out rather than being drawn everywhere
"  float fine = 1.0 - smoothstep(2.5, 15.0, dist);",
"  vec3 C = pat(vWorld.xz, vec2( 0.112,-0.086), 4.60, uTime);",
"  float chop = A.x + B.x + C.x*0.42*fine;",
"  vec2  slope = (A.yz + B.yz) * 0.155 * band * vFall",
"              +  C.yz * 0.052 * fine * vFall;",
"  vec3 N = normalize(vNrm + vec3(-slope.x, 0.0, -slope.y));",
"  if(!gl_FrontFacing) N = -N;",
// depth, straight off the tank's own floor profile
// The depth this pixel reads is displaced by the surface slope, which is what
// refraction actually does to the floor you are looking at: the shallow end
// wobbles instead of sitting behind flat glass.
"  float u = clamp((vWorld.x - uProf.x) / (uProf.y - uProf.x) + slope.x*0.085, 0.0, 1.0);",
"  float floorY = mix(uProf.z, uProf.w, u);",
"  float depth = max(0.0, uSurfY - floorY);",
"  float dN = clamp(depth / 1.85, 0.0, 1.0);",
// water absorbs on a curve, not a straight line — the first half metre takes
// far less out of the light than the last
"  float dA = dN*dN*0.62 + dN*0.38;",
// the shore: how close this pixel is to a wall
"  float edge = min(min(vWorld.x-uRect.x, uRect.y-vWorld.x),",
"                   min(vWorld.z-uRect.z, uRect.w-vWorld.z));",
"  float shore = 1.0 - smoothstep(0.0, 0.70, edge);",
"  vec3 body = mix(uShallow, uDeep, dA);",
"  body *= 1.0 - shore*0.09;",          // the wet ring just inside the wall
"  float alpha = mix(0.48, 0.93, dA) * (1.0 - shore*0.40);",
// Fresnel: a window from above, a mirror across
"  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 5.0);",
"  fres = clamp(0.02 + 0.98*fres, 0.0, 1.0) * uReflect;",
"  vec3 refl = mix(uHorizon, uSky, clamp(V.y*1.4, 0.0, 1.0));",
"  vec3 col = mix(body, refl, fres);",
"  alpha = mix(alpha, 1.0, fres*0.8);",
// the glitter, and a broader sheen behind it
"  vec3 H = normalize(uSunDir + V);",
"  float sp = pow(max(dot(N,H), 0.0), 130.0);",
"  float sh = pow(max(dot(N,H), 0.0), 18.0);",
"  col += uSunCol * (sp*2.2 + sh*0.10) * uSunStr * band;",
// caustic filaments where the two patterns pile up, strongest over shallow water
// caustics: where the two swells pile up AND the fine ripple agrees, which is
// what makes them read as filaments rather than as a second sine wave
"  vec3 K = pat(vWorld.xz, vec2( 0.086, 0.052), 5.20, uTime*0.92);",
"  float kn = clamp((K.x + C.x*0.55) * 0.40, -1.0, 1.0);",
"  float caus = pow(max(kn, 0.0), 3.6) * 0.72 * (1.0 - smoothstep(16.0, 40.0, dist));",
"  caus *= 0.50 + 0.50*max(A.x*0.8, 0.0);",
"  col += vec3(0.62,0.92,1.00) * caus * (0.18 + 0.62*(1.0-dN)) * band;",
"  alpha += caus*0.08;",
// a foam line at the wall, moving with the swell, so the edge is never hard
"  float f = shore * (0.42 + 0.58*sin(edge*19.0 - uTime*1.9 + chop*2.4));",
"  f = clamp(f,0.0,1.0) * uFoam * shore;",
"  col = mix(col, vec3(0.95,0.99,1.0), f*0.75);",
"  alpha = max(alpha, f*0.55);",
// after dark the niche lights take over and the whole sheet glows
"  col += uNight * uGlow * (0.42 + 0.18*chop + caus*0.7);",
"  alpha = clamp(mix(alpha, alpha*0.80 + 0.34, uDark), 0.0, 1.0);",
"  if(!gl_FrontFacing){",         // seen from underneath: bright, near-mirrored
"    col = mix(col, vec3(0.72,0.92,1.00), 0.42);",
"    alpha = clamp(alpha*0.7 + 0.25, 0.0, 1.0);",
"  }",
"  gl_FragColor = vec4(col, alpha);",
"}"].join("\n");

  waterMat=new T.ShaderMaterial({
    vertexShader:WATER_VS, fragmentShader:WATER_FS,
    transparent:true, depthWrite:false, side:T.DoubleSide,
    uniforms:{
      uTime:{value:0}, uPlayer:{value:new T.Vector2(999,999)}, uRipple:{value:0},
      uDark:{value:0}, uReflect:{value:0.72}, uFoam:{value:0.55}, uGlow:{value:0},
      uSunStr:{value:1}, uSurfY:{value:P.water},
      uShallow:{value:new T.Color(0x63c7d8)}, uDeep:{value:new T.Color(0x0d4f6b)},
      uSky:{value:new T.Color(0x9fc4de)},      uHorizon:{value:new T.Color(0xcfd8d2)},
      uSunCol:{value:new T.Color(0xffeed0)},   uSunDir:{value:new T.Vector3(0.4,0.8,0.4)},
      uNight:{value:new T.Color(0x2ea8d8)},
      uRect:{value:new T.Vector4(P.x0,P.x1,P.z0,P.z1)},
      uProf:{value:new T.Vector4(POOL_STEPS.x1, P.x1, -1.05, -2.30)}
    }
  });
  const water=new T.Mesh(waterGeo, waterMat);
  water.position.set(wcx, P.water, wcz);
  water.receiveShadow=false; water.castShadow=false; water.frustumCulled=false;
  water.renderOrder=2; scene.add(water);
  waterMesh=water;

  // The only thing left outside the shader is the caustic net on the tank
  // floor, which has to be projected onto the floor's own slope rather than
  // living on the surface.
  const caMat=o=>new T.MeshBasicMaterial({map:TEX.caustic.clone(), transparent:true,
    blending:T.AdditiveBlending, depthWrite:false, opacity:o, toneMapped:false});
  const fg=new T.PlaneGeometry(P.x1-P.x0-0.3, P.z1-P.z0-0.3, 28, 14); fg.rotateX(-Math.PI/2);
  {
    const fp=fg.attributes.position;
    for(let i=0;i<fp.count;i++) fp.setY(i, poolFloorY(wcx+fp.getX(i))+0.045);
    fp.needsUpdate=true; fg.computeVertexNormals();
  }
  poolFloorCaustic=new T.Mesh(fg, caMat(0.0)); poolFloorCaustic.material.map.repeat.set(3.0,1.8);
  poolFloorCaustic.position.set(wcx, 0, wcz); scene.add(poolFloorCaustic);

  for(const nx of [P.x0+3.0, P.x1-3.0]){                 // niche lights on the long wall
    push("niche", boxGeo(0.34,0.24,0.06,0), nx, -0.72, P.z0+0.06, 0, "#a8ecff");
    push("niche", boxGeo(0.34,0.24,0.06,0), nx, -0.72, P.z1-0.06, 0, "#a8ecff");
  }
  for(const p of [[P.x0+2.4,-0.75],[ (P.x0+P.x1)/2,-1.05],[P.x1-2.4,-1.30]]){
    const L=new T.PointLight(0x63d8ff, 0, 19, 2.1);
    L.position.set(p[0], p[1], (P.z0+P.z1)/2);
    scene.add(L); POOL_LIGHTS.push(L);
  }
  // soft column of light hanging over the water
  const gc=cvs(128,128), gx=gc.getContext("2d");
  const rg=gx.createRadialGradient(64,64,0,64,64,64);
  rg.addColorStop(0,"rgba(150,236,255,0.55)"); rg.addColorStop(0.45,"rgba(90,200,240,0.16)");
  rg.addColorStop(1,"rgba(60,160,210,0)");
  gx.fillStyle=rg; gx.fillRect(0,0,128,128);
  poolGlow=new T.Sprite(new T.SpriteMaterial({map:setSRGB(new T.CanvasTexture(gc)), transparent:true,
    depthWrite:false, blending:T.AdditiveBlending, opacity:0, fog:false}));
  poolGlow.scale.set(26,14,1);
  poolGlow.position.set((P.x0+P.x1)/2, 2.4, (P.z0+P.z1)/2); scene.add(poolGlow);

  /* --- teal pool fence with a gate, loungers, and the rules sign ------ */
  const F={x0:D.x0-0.2, x1:D.x1+0.2, z0:D.z0-0.2, z1:D.z1+0.2}, fh=1.28;
  function fenceRun(x0,x1,z0,z1){
    const horiz=Math.abs(x1-x0)>Math.abs(z1-z0);
    const len=horiz?(x1-x0):(z1-z0), cx=(x0+x1)/2, cz=(z0+z1)/2;
    if(horiz){
      bx("teal", len,0.10,0.09, cx, dy+fh,      cz, 0, 0, TEAL_D);
      bx("teal", len,0.07,0.07, cx, dy+fh-0.52, cz, 0, 0, TEAL_D);
      for(let x=x0+0.16;x<x1;x+=0.24) bx("teal", 0.05,fh,0.05, x, dy+fh/2, cz, 0, 0, TEAL);
      addCol(x0,x1, cz-0.16, cz+0.16, dy, dy+fh+0.1);
    }else{
      bx("teal", 0.09,0.10,len, cx, dy+fh,      cz, 0, 0, TEAL_D);
      bx("teal", 0.07,0.07,len, cx, dy+fh-0.52, cz, 0, 0, TEAL_D);
      for(let z=z0+0.16;z<z1;z+=0.24) bx("teal", 0.05,fh,0.05, cx, dy+fh/2, z, 0, 0, TEAL);
      addCol(cx-0.16, cx+0.16, z0,z1, dy, dy+fh+0.1);
    }
  }
  fenceRun(F.x0,F.x1,F.z0,F.z0);                 // south run (toward the lot)
  fenceRun(F.x0,F.x1,F.z1,F.z1);                 // north run
  fenceRun(F.x1,F.x1,F.z0,F.z1);                 // east run
  fenceRun(F.x0,F.x0,F.z0, 1.2);                 // west run, split for the gate
  fenceRun(F.x0,F.x0, 3.4, F.z1);
  for(const p of [[F.x0,1.2],[F.x0,3.4]]) bx("teal", 0.13,fh+0.3,0.13, p[0], dy+(fh+0.3)/2, p[1], 0, 0, TEAL_D);
  // bullnose along the pool coping, so the rim is not a knife edge
  for(const r of [[P.x0-cop, P.x1+cop, P.z0-cop, "x"],[P.x0-cop, P.x1+cop, P.z1+cop, "x"],
                  [P.z0-cop, P.z1+cop, P.x0-cop, "z"],[P.z0-cop, P.z1+cop, P.x1+cop, "z"]]){
    const len=r[1]-r[0], mid2=(r[0]+r[1])/2;
    if(r[3]==="x") push("paint", new T.CylinderGeometry(0.055,0.055,len,10), mid2, dy+0.075, r[2], 0, "#eae6da", 0, Math.PI/2);
    else           push("paint", new T.CylinderGeometry(0.055,0.055,len,10), r[2], dy+0.075, mid2, 0, "#eae6da", Math.PI/2, 0);
  }
  // Loungers on the south deck. The seat runs north-south, the back rises at
  // the south end, so you recline facing the water rather than away from it.
  for(let i=0;i<5;i++){
    const lx=D.x0+2.6+i*3.1, lz=-2.35;
    bx("paint", 0.70,0.07,1.74, lx, dy+0.44, lz, 0, 0, "#e4e0d2");
    push("paint", boxGeo(0.70,0.07,0.80,0), lx, dy+0.60, lz-1.08, 0, "#e4e0d2", 0.70);
    push("paint", new T.CylinderGeometry(0.035,0.035,0.70,10), lx, dy+0.475, lz+0.86,
         0, "#e4e0d2", 0, Math.PI/2);                                   // rolled foot edge
    push("fabric", boxGeo(0.44,0.09,0.26,0), lx, dy+0.90, lz-1.40, 0, "#cfd8d2", 0.70);  // head pillow
    for(const d of [[-0.30,-0.66],[0.30,-0.66],[-0.30,0.72],[0.30,0.72]])
      bx("metal", 0.05,0.42,0.05, lx+d[0], dy+0.21, lz+d[1], 0, 0, "#b8bcbc");
    bx("metal", 0.05,0.05,1.50, lx-0.34, dy+0.44, lz-0.1, 0, 0, "#b8bcbc");
    bx("metal", 0.05,0.05,1.50, lx+0.34, dy+0.44, lz-0.1, 0, 0, "#b8bcbc");
    addCol(lx-0.42,lx+0.42, lz-1.55, lz+1.05, dy, dy+0.55);
    addSeat(lx, lz+0.10, dy+0.48, Math.PI, "LOUNGER");   // facing the water
    if(i%2===0 && i<4){                                                 // side table with a drink
      const tx=lx+1.55;
      push("metal", new T.CylinderGeometry(0.26,0.26,0.05,14), tx, dy+0.50, lz-0.2, 0, "#c8c4b4");
      push("metal", new T.CylinderGeometry(0.04,0.05,0.50,8), tx, dy+0.25, lz-0.2, 0, "#b8bcbc");
      push("glass", new T.CylinderGeometry(0.045,0.038,0.13,10), tx+0.06, dy+0.59, lz-0.24, 0, "#cfe0e6");
      addCol(tx-0.28,tx+0.28, lz-0.48, lz+0.08, dy, dy+0.55);
    }
  }
  bx("metal", 0.06,2.20,0.06, D.x0+1.0, dy+1.10, D.z0+1.2, 0, 0, "#b8bcbc");     // life ring post
  push("paint", new T.TorusGeometry(0.34,0.10,8,16), D.x0+1.0, dy+1.75, D.z0+1.3, 0, "#d94b2a");
  bx("metal", 0.07,1.60,0.07, D.x0+2.6, dy+0.80, D.z0+0.8, 0, 0, "#b8bcbc");     // rules sign
  push("rules", boxGeo(0.90,0.66,0.04,0), D.x0+2.6, dy+1.42, D.z0+0.8, 0, "#e8e4d6");
})();
