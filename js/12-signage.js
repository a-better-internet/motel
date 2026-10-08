"use strict";
/* LOW DESERT MOTEL · 12-signage.js
   the pole sign and the boards on it
   (fitText / fitSerif / signTex / signPanel moved to 02-textures.js: the
   motel and the office are built before this file loads and both need
   them, and a function declaration only hoists within its own script.)
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   11 · SIGNAGE — the pole sign is the building's face from the highway
   ---------------------------------------------------------------------- */
(function buildSigns(){
  // The posts stand OUTSIDE the boards, flush with their ends — a pole sign
  // whose legs cross its own face is a pole sign you cannot read.
  // the posts lap 40 mm onto the cream frame either side. Butted exactly to
  // the board's edge, post and board shared a plane and fought over it.
  const sx=-38, sz=-30.5, postH=6.4, BOARD_W=6.9, postD=BOARD_W/2+0.13;
  for(const d of [-postD, postD]){
    bx("paint", 0.34, postH, 0.34, sx+d, postH/2, sz, 0, 0, "#eae6da");
    addCol(sx+d-0.24, sx+d+0.24, sz-0.24, sz+0.24, 0, postH);
  }
  bx("concrete", 8.4, 0.5, 1.6, sx, 0.24, sz, 0.3, 0, "#8a6a4c");
  // main navy board. Every string is fitted inside a stated margin rather
  // than to the canvas edge, so nothing runs up against its own border.
  const mainTex=hosted("sign:name", signTex(1024,276,(x,W,H)=>{
    x.fillStyle="#13405e"; x.fillRect(0,0,W,H);
    x.strokeStyle="#e6e2d6"; x.lineWidth=9;  x.strokeRect(13,13,W-26,H-26);
    x.strokeStyle="#7fd2ff"; x.lineWidth=3;  x.strokeRect(30,30,W-60,H-60);
    x.fillStyle="#f1ead6"; fitText(x,"Low Desert Motel", W-150, 116, W/2, H/2+6);
  }), {aspect:6.6/1.78});
  bx("paint", BOARD_W, 1.95, 0.28, sx, 5.35, sz, 0, 0, "#e6e2d6");
  NEON.push(signPanel(6.6,1.78,mainTex, sx, 5.35, sz-0.20, Math.PI, true));
  NEON.push(signPanel(6.6,1.78,mainTex, sx, 5.35, sz+0.20, 0, true));
  // rates board — same width as the name board, so the stack reads as one
  // cabinet hung between the posts
  const rateTex=hosted("sign:rates", signTex(768,319,(x,W,H)=>{
    const PAD=W*0.10;
    x.fillStyle="#f1ead6"; x.fillRect(0,0,W,H);
    x.strokeStyle="#c3311f"; x.lineWidth=5; x.strokeRect(15,15,W-30,H-30);
    x.fillStyle="#c3311f"; fitText(x,"LOW WEEKLY RATES", W-2*PAD, 50, W/2, 56);
    x.fillStyle="#13405e"; fitText(x,"FREE", W*0.24, 60, W/2, 122);
    x.fillStyle="#13405e"; fitText(x,"HIGH SPEED INTERNET", W-2*PAD, 42, W/2, 178);
    x.fillStyle="#13405e"; fitText(x,"MICROWAVE & FRIDGE", W-2*PAD, 42, W/2, 226);
    x.fillStyle="#c3311f"; x.fillRect(PAD,268,W-2*PAD,7);
  }), {aspect:6.6/2.74});
  // the reader board stops just under the name board. Overlapping, its
  // printed face landed on the plane of the name board's cream frame.
  bx("paint", BOARD_W-0.06, 2.92, 0.24, sx, 2.91, sz, 0, 0, "#e6e2d6");
  NEON.push(signPanel(6.6,2.74,rateTex, sx, 2.91, sz-0.18, Math.PI, true));
  NEON.push(signPanel(6.6,2.74,rateTex, sx, 2.91, sz+0.18, 0, true));
  // VACANCY neon strip on top
  const vacTex=hosted("sign:vacancy", signTex(512,105,(x,W,H)=>{
    x.fillStyle="#150c08"; x.fillRect(0,0,W,H);
    x.fillStyle="#ff8a3a"; fitText(x,"VACANCY", W*0.68, 60, W/2, H/2+3);
  }), {aspect:3.8/0.78});
  /* The VACANCY cabinet SITS ON the name board. It used to hang 7 cm above
     it — the name board's top is 6.325 and this started at 6.40 — between
     posts it does not reach, held up by nothing. It stands on the board's
     top now, on two steel shoes bolted through into it. */
  const VY=5.35+1.95/2+0.45;
  bx("paint", 4.0, 0.9, 0.26, sx, VY, sz, 0, 0, "#22201c");
  for(const d of [-1.5,1.5])
    bx("metal", 0.16, 0.10, 0.34, sx+d, VY-0.40, sz, 0, 0, "#6f767a");
  // the VACANCY tube has never quite struck properly since about 1988
  VAC_NEON.push(signPanel(3.8,0.78,vacTex, sx, VY, sz-0.19, Math.PI, true));
  VAC_NEON.push(signPanel(3.8,0.78,vacTex, sx, VY, sz+0.19, 0, true));
  /* Gooseneck lamps over the name board: an arm out of the board's top
     edge, a neck down, and the hood at the end of it. The neck used to
     stand 28 cm in front of the board with nothing joining the two. */
  for(const d of [-1.6,1.6]){
    bx("metal", 0.06,0.06,0.42, sx+d, 6.31, sz-0.33, 0, 0, "#b8bcbc");     // the arm
    bx("metal", 0.06,0.30,0.06, sx+d, 6.19, sz-0.54, 0, 0, "#b8bcbc");     // the neck
    push("ceilfix", new T.CylinderGeometry(0.11,0.17,0.14,12), sx+d, 6.00, sz-0.54, 0, "#e8dcc0");
  }
  LAMPS.push({x:sx, y:6.0, z:sz-1.0, color:0xffd9a0, intensity:0.75, dist:16, decay:1.5});

  /* --- walkway sconces on both wings, plus lot pole lights ----------- */
  let sconceN=0;
  function sconce(x,y,z,ry){
    push("lampshade", shadeGeo(0.12,0.17,0.16,12), x, y, z, ry, "#e8dcc0");
    push("ceilfix", shadeBulb(0.040), x, y-0.02, z, 0, "#f2e9cf");
    bx("metal", 0.06,0.22,0.06, x, y+0.16, z, 0, 0, "#8f9aa0");
    // a soot halo on the soffit above every fixture — thirty summers of them
    push("soot", planeGeo(0.85,0.85,0), x, y+0.30, z, 0, "#2a241c", -Math.PI/2, 0);
    LAMPS.push({x:x, y:y-0.1, z:z, color:0xffd9a0, intensity:0.52, dist:11, decay:1.4,
                mothy:(sconceN++%3===0)});
  }
  for(let i=0;i<NORTH.bays;i++){
    const x=-27+i*BAY_W+BAY_W/2;
    sconce(x, BASE+2.62, NORTH.z-0.55, 0);
    sconce(x, lvlY(1)+2.62, NORTH.z-0.55, 0);
  }
  for(let i=0;i<EAST.bays;i++){
    const z=EAST.z0+i*BAY_W+BAY_W/2;
    sconce(EAST.x-0.55, BASE+2.62, z, 0);
    sconce(EAST.x-0.55, lvlY(1)+2.62, z, 0);
  }
  for(const p of [[-30,-31],[-4,-31],[22,-31],[-30,-14],[10,-16]]){
    cyl("metal", 0.13,0.18,7.4,10, p[0], 3.7, p[1], "#8f9aa0");
    bx("metal", 0.9,0.22,0.5, p[0], 7.35, p[1]+0.3, 0, 0, "#8f9aa0");
    push("ceilfix", boxGeo(0.78,0.10,0.42,0), p[0], 7.22, p[1]+0.3, 0, "#f2e9cf");
    addCol(p[0]-0.2,p[0]+0.2,p[1]-0.2,p[1]+0.2, 0, 7.4);
    LAMPS.push({x:p[0], y:7.0, z:p[1]+0.3, color:0xffe0a8, intensity:0.90, dist:30, decay:1.6,
                pole:true, mothy:true});
  }
  // pool rules copy + the room-door number strip get their painted faces
  NEON.push(signPanel(0.84,0.56, hosted("poolRules", signTex(384,256,(x,W,H)=>{
    x.fillStyle="#e8e4d6"; x.fillRect(0,0,W,H);
    x.fillStyle="#13405e"; fitText(x,"POOL RULES", W*0.82, H*0.18, W/2, H*0.16);
    x.fillStyle="#3a3a36";
    const lines=["NO LIFEGUARD ON DUTY","SWIM AT YOUR OWN RISK","NO GLASS · NO DIVING","POOL CLOSES 10 PM"];
    x.font=Math.round(H*0.082)+"px 'JetBrains Mono', monospace"; x.textAlign="center";
    lines.forEach((L,i)=>x.fillText(L, W/2, H*0.42+i*H*0.165));
  })), POOL.deck.x0+2.6, 0.10+1.42, POOL.deck.z0+0.78, 0, false));
})();
