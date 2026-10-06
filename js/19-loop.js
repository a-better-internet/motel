"use strict";
/* LOW DESERT MOTEL · 19-loop.js
   fixed-timestep loop, cameras, day/night, MOTEL handle
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   16 · FIXED-TIMESTEP LOOP
   ---------------------------------------------------------------------- */
const wetEl=document.getElementById("wet");
const bootEl=document.getElementById("boot");
function begin(){
  if(started) return;
  started=true; bootEl.classList.add("hidden");
  setTimeout(()=>toast("PRESS N FOR NIGHTFALL","#6fe3ff"), 2200);
}
bootEl.addEventListener("click", begin);
addEventListener("keydown",e=>{ if(!started && (e.code==="Space"||e.code==="Enter")) begin(); });

/* --- tumbleweeds -------------------------------------------------------
   A Russian thistle is not a hedgehog of equal spokes through a point: it is
   a tangle. Each one here grows nine stems out of the crown, and every stem
   kinks and forks twice more, so the silhouette is ragged, the interior is
   denser than the rim, and no two are alike. They roll on a lumpy ball, so
   they hop.                                                               */
const WEEDS=[];
(function makeWeeds(){
  const UP=V3(0,1,0);
  for(let i=0;i<7;i++){
    const ent=[], hue=0.085+rnd()*0.035, R=(0.42+rnd()*0.26)*0.75;
    const col=new T.Color();
    function twig(from, dir, len, rad, depth){
      const to=from.clone().addScaledVector(dir, len);
      col.setHSL(hue, 0.20+rnd()*0.18, 0.34+rnd()*0.26);
      ent.push({geo:new T.CylinderGeometry(rad*0.60, rad, len, 4, 1, true),
        matrix:new T.Matrix4().compose(from.clone().add(to).multiplyScalar(0.5),
          new T.Quaternion().setFromUnitVectors(UP, dir), new T.Vector3(1,1,1)),
        color:col.clone()});
      if(depth<=0) return;
      const n=2+(rnd()<0.62?1:0);
      for(let k=0;k<n;k++){
        const d2=dir.clone().add(V3(rnd()-0.5, rnd()-0.5, rnd()-0.5).multiplyScalar(1.05)).normalize();
        twig(to, d2, len*(0.64+rnd()*0.24), rad*0.76, depth-1);
      }
    }
    for(let k=0;k<16;k++){
      const th=rnd()*Math.PI*2, ph=Math.acos(2*rnd()-1);
      twig(V3(0,0,0), V3(Math.sin(ph)*Math.cos(th), Math.cos(ph), Math.sin(ph)*Math.sin(th)).normalize(),
           R*0.40, 0.016+rnd()*0.007, 3);
    }
    const g=mergeEntries(ent);
    g.scale(1, 0.80+rnd()*0.24, 0.86+rnd()*0.22);      // lumpy, never a sphere
    const m=new T.Mesh(g, new T.MeshStandardMaterial({vertexColors:true, roughness:1,
      side:T.DoubleSide}));
    m.castShadow=true; scene.add(m);
    WEEDS.push({m:m, pos:V3(rr(-160,160), 0, rr(-140,120)), spin:0, R:R,
                hop:rnd()*6, drift:rnd()*6,
                axis:new T.Vector3(rnd()-0.5, rnd()*0.3, rnd()-0.5).normalize()});
  }
})();
const WIND=new T.Vector3(0.78,0,0.62).normalize();
const WIND_L=new T.Vector3(-WIND.z,0,WIND.x);          // across the wind

/* --- the wind itself ---------------------------------------------------
   Three slow beats multiplied together: mostly it is calm, and then every
   couple of minutes a gust comes through for half a minute. Everything loose
   in the scene reads off Wind.gust — the weeds run, litter flies further, the
   ground starts to smoke and the haze closes in.                          */
const Wind={gust:0, hold:false};
const DUSTC=new T.Color(0xc2a172);
function updateWind(t, dt){
  if(Wind.hold) return;                 // tooling pins it to inspect a gust
  const a=Math.sin(t*0.055+1.7)*0.5+0.5,
        b=Math.sin(t*0.021+4.2)*0.5+0.5,
        c=Math.sin(t*0.013)*0.5+0.5;
  const raw=Math.max(0,(a*b*c-0.17)/0.83);
  Wind.gust += (Math.pow(raw,0.85)-Wind.gust)*Math.min(1, dt*0.55);
}
const SAND={n:1100, m:170, sn:230};
(function buildSand(){
  const grain=(a0,a1)=>{
    const c=cvs(32,32), x=c.getContext("2d");
    const g=x.createRadialGradient(16,16,0,16,16,16);
    g.addColorStop(0,"rgba(228,203,161,"+a0+")");
    g.addColorStop(0.45,"rgba(208,180,136,"+a1+")");
    g.addColorStop(1,"rgba(198,170,128,0)");
    x.fillStyle=g; x.fillRect(0,0,32,32);
    return setSRGB(new T.CanvasTexture(c));
  };
  const layer=(n, size, tex, yfn)=>{
    const pos=new Float32Array(n*3), off=new Float32Array(n);
    for(let i=0;i<n;i++){
      pos[i*3]=rr(-SAND.m/2,SAND.m/2); pos[i*3+2]=rr(-SAND.m/2,SAND.m/2);
      off[i]=yfn();                       // height above whatever ground it is over
    }
    const g=new T.BufferGeometry();
    g.setAttribute("position", new T.BufferAttribute(pos,3));
    const p=new T.Points(g, new T.PointsMaterial({map:tex, size:size, sizeAttenuation:true,
      transparent:true, opacity:0, depthWrite:false, fog:true}));
    p.frustumCulled=false; p.visible=false; scene.add(p);
    return {p:p, pos:pos, off:off, n:n};
  };
  SAND.fine =layer(SAND.n,  1.05, grain(0.85,0.30), ()=>0.1+Math.pow(rnd(),2.2)*13);
  SAND.sheet=layer(SAND.sn, 9.00, grain(0.30,0.12), ()=>0.2+Math.pow(rnd(),1.8)*2.4);
})();
/* --- a dust devil, but only in a real gust ---------------------------- */
/* The dust devil is gone: a column of turning dust reads as a special
   effect standing on the desert however carefully it is built, and the
   blown sand and the gusting wind carry the weather on their own.      */
function updateSand(dt, dark){
  const g=Wind.gust;
  const shelter=indoorsAt(camera.position.x, camera.position.z, camera.position.y) ? 0 : 1;
  const on=g>0.03 && shelter>0;
  SAND.fine.p.visible=on; SAND.sheet.p.visible=on;
  if(!on) return;
  SAND.fine.p.material.opacity =g*0.50*(0.30+0.70*(1-dark));
  SAND.sheet.p.material.opacity=g*0.34*(0.30+0.70*(1-dark));
  const px=player.pos.x, pz=player.pos.z, half=SAND.m/2;
  for(const L of [SAND.fine, SAND.sheet]){
    const step=(2.2+g*22)*dt*(L===SAND.sheet?0.82:1), pos=L.pos, off=L.off;
    for(let i=0;i<L.n;i++){
      let x=pos[i*3]+WIND.x*step, z=pos[i*3+2]+WIND.z*step;
      x=px+(((x-px+half)%SAND.m)+SAND.m)%SAND.m-half;   // wrap around the player
      z=pz+(((z-pz+half)%SAND.m)+SAND.m)%SAND.m-half;
      pos[i*3]=x; pos[i*3+2]=z;
      // heightAt here, not groundAt: this is thirteen hundred particles a
      // frame and groundAt costs four field samples each. A grain of blown
      // sand half a metre to thirteen metres up does not need to agree with
      // the drawn triangle to the millimetre; a foot standing on it does.
      pos[i*3+1]=Terrain.heightAt(x,z)+off[i]*(0.45+0.55*g);
    }
    L.p.geometry.attributes.position.needsUpdate=true;
  }
}
function updateWeeds(dt){
  const t=performance.now()*0.001;
  for(const w of WEEDS){
    const sp=(5.2+Math.sin(w.R*40+t*0.3)*1.9)*(1+Wind.gust*1.7);
    w.pos.addScaledVector(WIND, sp*dt);
    w.pos.addScaledVector(WIND_L, Math.sin(t*0.55+w.drift)*1.4*dt);   // wanders
    w.spin+=dt*sp/w.R;
    // a lopsided ball does not roll smoothly — it bounces off its own knuckles
    const hop=Math.max(0, Math.sin(w.spin*1.7+w.hop))*w.R*0.34;
    w.pos.y=Terrain.groundAt(w.pos.x,w.pos.z)+w.R*0.94+hop;
    w.m.position.copy(w.pos);
    w.m.quaternion.setFromAxisAngle(w.axis, w.spin);
    // They roll with nothing to stop them, so they were rolling through walls
    // and coming to rest in the middle of a room. Anything that ends up under
    // a roof is picked up and put back out upwind.
    const gone=Math.hypot(w.pos.x-player.pos.x, w.pos.z-player.pos.z)>210;
    if(gone || indoorsAt(w.pos.x, w.pos.z, w.pos.y)){
      const a=rnd()*Math.PI*2, r=90+rnd()*70;
      w.pos.set(player.pos.x - WIND.x*r + Math.cos(a)*40, 0, player.pos.z - WIND.z*r + Math.sin(a)*40);
    }
  }
}

/* --- geckos ------------------------------------------------------------
   Twelve of them, sitting out on warm rock near the things worth walking to.
   They hold absolutely still until you are about four metres off, then bolt a
   couple of metres and freeze again, which is the whole of a gecko's
   behavioural repertoire and exactly what makes you notice one.          */
const GECKOS=[];
(function makeGeckos(){
  const mk=(col)=>{
    const ent=[], c=new T.Color(col), dark2=new T.Color(col).multiplyScalar(0.62);
    const m4=(x,y,z)=>new T.Matrix4().makeTranslation(x,y,z);
    ent.push({geo:boxGeo(0.055,0.030,0.115,0), matrix:m4(0,0.022,0), color:c});   // body
    ent.push({geo:boxGeo(0.040,0.024,0.045,0), matrix:m4(0,0.024,0.075), color:c});// head
    for(let k=0;k<4;k++)                                                           // tail
      ent.push({geo:boxGeo(0.026-k*0.005,0.016-k*0.003,0.045,0),
                matrix:m4(0,0.020,-0.070-k*0.042), color:k%2?dark2:c});
    for(const q of [[-1,0.035],[1,0.035],[-1,-0.040],[1,-0.040]])                  // legs
      ent.push({geo:boxGeo(0.048,0.010,0.014,0), matrix:m4(q[0]*0.036,0.010,q[1]), color:dark2});
    for(let k=0;k<3;k++)                                                           // banding
      ent.push({geo:boxGeo(0.058,0.032,0.012,0), matrix:m4(0,0.022,-0.030+k*0.030), color:dark2});
    const mesh=new T.Mesh(mergeEntries(ent),
      new T.MeshStandardMaterial({vertexColors:true, roughness:0.82}));
    mesh.castShadow=true; return mesh;
  };
  const SPOTS=[[-95.2,194.4],[-97.1,197.8],[-71.6,-127.2],[-68.4,-131.0],
               [-172.0,-96.0],[-147.5,-355.0],[-259.0,120.6],[181.0,-125.4],
               [-166.6,-41.0],[75.5,244.0],[-516.0,-224.5],[-15.0,-63.0]];
  for(let i=0;i<SPOTS.length;i++){
    const sp=SPOTS[i], g=mk(["#7a7a52","#6b6b46","#8a7a56","#5f6b4a"][i%4]);
    g.position.set(sp[0], Terrain.groundAt(sp[0],sp[1])+0.012, sp[1]);
    g.rotation.y=rnd()*6.28;
    scene.add(g);
    GECKOS.push({m:g, hx:sp[0], hz:sp[1], t:0, run:0, dir:rnd()*6.28, wait:rr(0,4)});
  }
})();
function updateGeckos(dt){
  for(const k of GECKOS){
    const d=Math.hypot(player.pos.x-k.m.position.x, player.pos.z-k.m.position.z);
    if(k.run>0){
      k.run-=dt;
      const sp=3.4*Math.min(1, k.run*3);
      k.m.position.x += Math.sin(k.dir)*sp*dt;
      k.m.position.z += Math.cos(k.dir)*sp*dt;
      k.m.position.y  = Terrain.groundAt(k.m.position.x, k.m.position.z)+0.012;
      k.m.rotation.y  = k.dir + Math.sin(k.run*38)*0.22;      // the tail whips
    }else if(d<4.0 && d>0.2){
      k.dir=Math.atan2(k.m.position.x-player.pos.x, k.m.position.z-player.pos.z)
            + (rnd()-0.5)*1.1;
      k.run=0.45+rnd()*0.5;
    }else{
      k.wait-=dt;
      if(k.wait<0){                                            // the odd head-bob
        k.wait=2.5+rnd()*6;
        k.dir=k.m.rotation.y+(rnd()-0.5)*2.2;
        k.m.rotation.y=k.dir;
      }
      if(d>70){ k.m.position.set(k.hx, Terrain.groundAt(k.hx,k.hz)+0.012, k.hz); }
    }
  }
}

/* --- litter on the wind ------------------------------------------------
   Not a constant stream of it: one sheet of newspaper or one carrier bag
   goes past every minute or two, tumbling, and then the lot is empty again.
   That sporadic quality is the whole effect — a permanent supply of flying
   paper would read as weather, not as somewhere nobody has swept.        */
const FLYERS=[]; let flyerWait=rr(14,40);
(function makeFlyers(){
  const sheet=(head)=>{                       // a page of newsprint
    const c=cvs(96,128), x=c.getContext("2d");
    x.fillStyle="#e9e4d4"; x.fillRect(0,0,96,128);
    x.fillStyle="#2a2722";
    if(head){ x.fillRect(8,9,80,7); x.fillRect(8,20,52,5); }
    for(let r=0;r<22;r++){
      const y=(head?34:12)+r*4;
      if(y>120) break;
      x.globalAlpha=0.30+Math.random()*0.35;
      x.fillRect(8, y, 36+Math.random()*44, 1.6);
      x.fillRect(50, y, Math.random()*36, 1.6);
    }
    x.globalAlpha=1;
    if(head){ x.fillStyle="#9c9482"; x.fillRect(50,60,38,34); }   // a photo
    return setSRGB(new T.CanvasTexture(c));
  };
  const papers=[sheet(true), sheet(false)];
  for(let i=0;i<3;i++){
    let m;
    if(i<2){
      m=new T.Mesh(new T.PlaneGeometry(0.30,0.40,2,2),
        new T.MeshStandardMaterial({map:papers[i], roughness:0.95, side:T.DoubleSide}));
    }else{                                     // a supermarket bag, half inflated
      const g=new T.IcosahedronGeometry(0.17,1); g.scale(1.0,1.25,0.62);
      m=new T.Mesh(g, new T.MeshStandardMaterial({color:0xe6e9e6, roughness:0.55,
        transparent:true, opacity:0.72, side:T.DoubleSide}));
    }
    m.visible=false; m.castShadow=false; scene.add(m);
    FLYERS.push({m:m, live:false, t:0, life:0, sp:0, lift:0, ph:0,
                 from:V3(), spin:V3(rr(2,5), rr(1,4), rr(2,6))});
  }
})();
function updateFlyers(dt){
  flyerWait-=dt;
  if(flyerWait<=0){
    const f=FLYERS.find(q=>!q.live);
    if(f){
      const r=54+rnd()*26, lat=rr(-26,26);
      f.from.set(player.pos.x - WIND.x*r + WIND_L.x*lat, 0,
                 player.pos.z - WIND.z*r + WIND_L.z*lat);
      f.live=true; f.t=0; f.life=rr(13,20); f.sp=rr(7.5,12.5)*(1+Wind.gust*0.9);
      f.lift=rr(0.9,2.6); f.ph=rnd()*6; f.m.visible=true;
    }
    // a gust shakes more of it loose; otherwise nothing for a good while
    flyerWait=rr(38,105)*(1-Wind.gust*0.62);
  }
  for(const f of FLYERS){
    if(!f.live) continue;
    f.t+=dt;
    if(f.t>f.life){ f.live=false; f.m.visible=false; continue; }
    const d=f.sp*f.t;
    const x=f.from.x + WIND.x*d + WIND_L.x*Math.sin(f.t*0.7+f.ph)*2.4;
    const z=f.from.z + WIND.z*d + WIND_L.z*Math.sin(f.t*0.7+f.ph)*2.4;
    // it skitters along the ground, lifts, stalls, drops back
    const climb=Math.max(0, Math.sin(f.t*0.62+f.ph))*f.lift;
    f.m.position.set(x, Terrain.groundAt(x,z)+0.10+climb, z);
    f.m.rotation.set(f.t*f.spin.x, f.t*f.spin.y, f.t*f.spin.z);
  }
}

let acc=0, last=performance.now()/1000, lastGifPush=0;
let buriedMix=0;          // 0 under the sky, 1 under the ground; see below
const BURIED_SKY=new T.Color(0xffd2a0), BURIED_GND=new T.Color(0x3a2418);
const BURIED_AMB=new T.Color(0xffdcb4), AMB_BASE=new T.Color(0xfff0dc);
function frame(){
  requestAnimationFrame(frame);
  const now=performance.now()/1000;
  let delta=now-last; last=now;
  if(delta>0.1) delta=0.1;

  if(started){
    acc+=delta; const STEP=1/60; let guard=0;
    // dronePrev has to be exactly ONE step behind dronePos. Copying it once
    // before the loop left it up to six steps back, and lerping across that
    // gap threw the drone backwards every frame — which is the shaking.
    while(acc>=STEP && guard++<6){
      if(droneMode){ dronePrev.copy(dronePos); droneUpdate(STEP); }
      else{
        // the car needs the same one-step history the drone does, and for
        // the same reason: drawn straight off the physics state it steps
        if(driving) driving.veh.savePrev();
        fixedUpdate(STEP);
      }
      acc-=STEP;
    }
    stepAlpha=clamp(acc/STEP, 0, 1);
    updateDoors(delta);
    updateWind(now, delta);
    updateWeeds(delta);
    updateFlyers(delta);
    updateGeckos(delta);
    if(NEXT_SCENE_URL && !leaving && player.pos.z<ROADZ-6){
      leaving=true;
      if(document.pointerLockElement===dom) document.exitPointerLock();
      document.getElementById("xfade").style.opacity="1";
      setTimeout(()=>{ location.href=NEXT_SCENE_URL; }, 700);
    }
  }

  /* ---- camera ---- */
  if(droneMode){
    // draw it where it actually is between the two fixed steps either side
    droneShown.lerpVectors(dronePrev, dronePos, stepAlpha);
    drone.position.copy(droneShown);
    drone.rotation.set(droneTiltX, droneYaw, droneTiltZ);
    for(const r of drone.userData.rotors) r.rotation.y += delta*55;   // spinning blades
    // it pulls back a little as it picks up speed, the way a chase cam should
    const sp2=Math.min(1, Math.hypot(droneVel.x,droneVel.z)/26);
    const horiz=(3.6+sp2*2.9)*Math.cos(dronePitch), camY=0.7+(3.2+sp2*1.4)*Math.sin(dronePitch);
    _dtmp.set(droneShown.x-Math.sin(droneYaw)*horiz, droneShown.y+camY,
              droneShown.z-Math.cos(droneYaw)*horiz);
    // exponential, not a fixed fraction per frame: a lerp by delta*k lags by
    // an amount that changes with the frame time, and at 26 m/s that reads as
    // the whole world shuddering
    camera.position.lerp(_dtmp, 1-Math.exp(-11*delta));
    if(droneLook.lengthSq()===0) droneLook.copy(droneShown);
    droneLook.lerp(droneShown, 1-Math.exp(-16*delta));                // and so does the aim
    camera.up.set(0,1,0);
    camera.lookAt(droneLook.x, droneLook.y+0.25, droneLook.z);
    wetEl.classList.remove("on");
  }else if(driving){
    // The shell is placed first, and the camera then follows THE SHELL, not
    // the physics body. Aimed at the body while the car was drawn
    // interpolated, the two were a fraction of a step apart every frame and
    // the car appeared to shiver against the background.
    showCar(driving);
    const cp=driving.g.position;
    const a2=carYaw(driving.g.quaternion)+Math.PI+carCamYaw;
    const sp3=Math.min(1, Math.abs(driving.veh.speed)/28);
    const horiz=(7.6+sp3*3.0)*Math.cos(carCamPitch);
    _carTmp.set(cp.x+Math.sin(a2)*horiz,
                cp.y+2.20+(3.4+sp3*1.3)*Math.sin(carCamPitch),
                cp.z+Math.cos(a2)*horiz);
    const gy=surfaceY(_carTmp.x, _carTmp.z, _carTmp.y)+0.9;   // never under the ground
    if(_carTmp.y<gy) _carTmp.y=gy;
    camera.position.lerp(_carTmp, 1-Math.exp(-10*delta));
    if(_carLook.lengthSq()===0) _carLook.copy(cp);
    _carLook.lerp(cp, 1-Math.exp(-15*delta));
    camera.up.set(0,1,0);
    camera.lookAt(_carLook.x, _carLook.y+0.85, _carLook.z);
    wetEl.classList.remove("on");
  }else{
    droneLook.set(0,0,0);
    _carLook.set(0,0,0);
  const eyeY=player.feetY+EYE+player.bob-player.sit*sitDrop;  // seated low, lying lower
  camera.position.set(player.pos.x, eyeY, player.pos.z);
  const cp=Math.cos(player.pitch);
  camera.lookAt(player.pos.x - Math.sin(player.yaw)*cp,
                eyeY + Math.sin(player.pitch),
                player.pos.z - Math.cos(player.yaw)*cp);
  wetEl.classList.toggle("on", eyeY < POOL.water && inPool(player.pos.x, player.pos.z));
  }

  /* ---- the flashlight follows the eye, wherever the eye is ---- */
  {
    torchLvl += ((torchOn?1:0)-torchLvl)*Math.min(1, delta*9);
    const lit=torchLvl>0.003;
    torch.visible=lit; torchSpill.visible=lit;
    if(lit){
      torch.position.copy(camera.position);
      camera.getWorldDirection(_torchDir);
      torchSpill.position.copy(camera.position).addScaledVector(_torchDir, 0.5);
      torchTarget.position.copy(camera.position).addScaledVector(_torchDir, 12);
      torch.intensity      = 2.45*torchLvl;
      torchSpill.intensity = 0.26*torchLvl;
    }
  }

  /* ---- day / night ---- */
  const dn=DayNight.tick(started?delta:delta*0.25);
  const dark=dn.dark;
  DayNight.paint();
  skyDome.position.copy(camera.position);
  starPivot.position.copy(camera.position);
  const ang=dn.t*Math.PI*2, R=190;
  // snap the shadow frustum to whole texels, or it crawls as you walk
  const kx=Math.round(camera.position.x/SHADOW_SNAP)*SHADOW_SNAP,
        kz=Math.round(camera.position.z/SHADOW_SNAP)*SHADOW_SNAP;
  key.position.set(kx+Math.cos(ang)*R, Math.max(14, Math.sin(ang)*R+6), kz+70);
  key.target.position.set(kx, camera.position.y*0.3, kz);
  key.intensity=dn.sunIntensity;
  // the moon is far too weak to cast anything but acne, so stop shadowing with it
  key.castShadow = dn.sunHeight > 0.04;
  key.color.copy(DayNight.P.dayLight)
    .lerp(DayNight.P.setLight, Math.min(1,dn.sunsetAmount*1.2))
    .lerp(DayNight.P.nightLight, dn.nightAmount);
  const discY=placeCelestial(sunDisc, ang, 1, 70/R);
  placeCelestial(moonDisc, ang, -1, 70/R);
  const lowW=1-clamp((dn.sunHeight+0.06)/0.45,0,1);
  sunDisc.material.color.copy(SUN_HIGH).lerp(SUN_LOW, lowW);
  sunDisc.material.opacity=clamp((discY+0.10)/0.10,0,1);
  const ss=320+lowW*260; sunDisc.scale.set(ss,ss,1);
  moonDisc.material.opacity=0.9*dn.nightAmount;
  starPivot.visible=dn.nightAmount>0.01;
  starSky.rotation.y=DayNight.state.hour*(Math.PI/12);
  for(const L of STAR_LAYERS)                    // each class scintillates on its own beat
    L.p.material.opacity=dn.nightAmount*L.base*(0.88+0.12*Math.sin(now*L.sp+L.ph));
  hemi.intensity=dn.hemiIntensity;
  hemi.color.copy(DayNight.P.dayHemi).lerp(DayNight.P.nightHemi, dn.nightAmount);
  hemi.groundColor.copy(DayNight.P.dayGround).lerp(DayNight.P.nightGround, dn.nightAmount);
  amb.intensity=0.15+dn.nightAmount*0.06;
  /* UNDER THE GROUND THERE IS NO SKY.
     The hemisphere light is the sky and the ground bouncing into everything,
     and the key is the sun; neither is available forty feet down. Left on,
     the tunnel came out as a corridor lit from above by nothing at all, and
     at noon the speakeasy read like a conference room. Inside a BURIED
     volume both are pulled almost all the way out and the fixtures down
     there do the whole job — which is also what makes carrying the torch
     down the stair worth doing. Faded over about a third of a second so the
     stair is a transition and not a cut. */
  const wantBuried = buriedAt(camera.position.x, camera.position.z, camera.position.y) ? 1 : 0;
  buriedMix += (wantBuried-buriedMix)*Math.min(1, delta*3.4);
  if(buriedMix>0.002){
    /* What replaces them is not nothing. Killing the sky outright gave a
       room lit by seven point lights and a black hole where the bounce used
       to be — correct, and unreadable. A lamplit room four metres under the
       ground still has light coming off its own floor and walls, and it is
       warm, so the hemisphere keeps about a seventh of its strength with
       its colours pulled to lamplight and the ambient is recoloured and
       raised. The sun is the only thing taken away outright. */
    hemi.intensity *= 1-buriedMix*0.86;
    hemi.color.lerp(BURIED_SKY, buriedMix);
    hemi.groundColor.lerp(BURIED_GND, buriedMix);
    key.intensity  *= 1-buriedMix;
    amb.color.copy(AMB_BASE).lerp(BURIED_AMB, buriedMix);
    amb.intensity   = amb.intensity*(1-buriedMix) + 0.30*buriedMix;
  }else if(amb.color.getHex()!==AMB_BASE.getHex()) amb.color.copy(AMB_BASE);
  // At night the haze must sit DARKER than the sky, or the mountains wash out
  // into it; by day it matches the horizon so distance reads as heat and dust.
  scene.fog.color.copy(skyImg.hz).lerp(NIGHT_HAZE, dn.nightAmount*0.72);
  if(Wind.gust>0.01) scene.fog.color.lerp(DUSTC, Wind.gust*0.50*(1-dn.nightAmount*0.55));
  // Linear fog reaches full strength at `far`, so a mesa at 700 m was sitting
  // at three quarters haze and reading as one flat orange silhouette. Pushing
  // near and far out halves that without losing the distance cue: the same
  // mesa now keeps about half its strata and its shading.
  scene.fog.near=185+dn.nightAmount*52;
  scene.fog.far =(1460+dn.nightAmount*330)*(1-Wind.gust*0.46);
  updateSand(delta, dark);
  scene.background=skyImg.hz;

  /* ---- artificial light: emissives ramp, real lights follow the player -- */
  for(const g of GLOW){
    if(g.basic){
      let a=(g.day?(1-dark):dark)*(g.max===undefined?1:g.max);
      /* An obstruction light on a mast is not a lamp that comes on at dusk
         and sits there: it is a beacon, and what makes it read across a
         kilometre of dark desert is the gap between flashes. `blink` is the
         period in seconds and `duty` the fraction of it the lamp is lit,
         with a short ramp either side so it pulses rather than switching. */
      if(g.blink){
        const u=(now/g.blink)%1, d2=g.duty===undefined?0.16:g.duty;
        a *= u<d2 ? Math.sin(Math.PI*(u/d2)) : 0;
      }
      g.m.opacity=a;
      continue;
    }
    // "buried" is not on the clock: see the note over its buckets in 15-bake
    const k=g.kind==="buried" ? 2.35
          : g.kind==="pool"   ? 0.30+dark*2.0
          : 0.10+dark*3.0;
    if(g.base) g.m.emissive.copy(g.base);
    g.m.emissiveIntensity=g.baseInt*k;
  }
  // A lit sign is a box with lamps in it. By day the sun is brighter than
  // the lamps and the face reads as paint; after dark the face is the only
  // thing making light. The old ramp went 0.78 to 1.06, which is barely a
  // change and is why they read as flat planes lying in the world rather
  // than as cabinets with something switched on inside them.
  // The top of the ramp has to stop at 1: these faces are unlit basic
  // material with toneMapped off, so anything above that clips to white and
  // the lettering goes with it. The width of the range is what sells a
  // cabinet with lamps in it, and it is the day end that had to come down.
  for(const n of NEON) n.material.color.setScalar(0.40+0.60*dark);
  {                                   // the bad tube in the VACANCY sign
    const b=Math.sin(now*13.1)*Math.sin(now*4.3)*Math.sin(now*1.7);
    const f=(dark>0.15 && b>0.62) ? 0.22+0.5*Math.abs(Math.sin(now*41.0)) : 1.0;
    for(const n of VAC_NEON) n.material.color.setScalar((0.72+0.28*dark+0.06)*f);
  }
  if(TVWIN_MAT){                      // the blue stutter of a set left running
    const f=0.5+0.5*Math.sin(now*6.1)+0.35*Math.sin(now*17.7);
    TVWIN_MAT.color.setRGB(0.16*dark*f, 0.26*dark*f, 0.42*dark*(0.6+0.4*f));
  }
  if(ANIM.length && now-lastGifPush>0.055){ lastGifPush=now; tickAnim(now); }
  tickFlicker(delta);
  updateLights(dark, camera.position);

  /* ---- the pool: the whole point of coming back after dark ----
     All the per-frame work is eight uniforms. The swell, its normals, the
     two drifting patterns, the Fresnel, the depth tint, the foam and the
     caustics all live on the GPU now. */
  const tt=now, U=waterMat.uniforms;
  U.uTime.value   = tt;
  U.uDark.value   = dark;
  U.uSunStr.value = Math.max(0.08, 1.0-dark*0.92);
  U.uGlow.value   = 0.05 + dark*0.62;
  U.uReflect.value= 0.46 - dark*0.22;          // less mirror, more glow at night
  U.uFoam.value   = 0.42 + dark*0.18;
  U.uSky.value.copy(skyImg.mid).lerp(WHITE_C, 0.18);
  U.uHorizon.value.copy(skyImg.hz);
  U.uSunCol.value.copy(key.color);
  U.uSunDir.value.copy(key.position).sub(key.target.position).normalize();
  U.uShallow.value.setRGB(0.20+0.06*dark, 0.62, 0.71);
  U.uDeep.value.setRGB(0.02, 0.21+0.06*dark, 0.35+0.09*dark);
  U.uPlayer.value.set(player.pos.x, player.pos.z);
  // the ring only exists while you are actually in the water and moving
  const wading = inPool(player.pos.x, player.pos.z) && player.feetY < POOL.water+0.9;
  U.uRipple.value += ((wading ? (player.moving?1.0:0.42) : 0.0) - U.uRipple.value)
                     * Math.min(1, delta*2.4);
  poolFloorCaustic.material.opacity=0.26+dark*0.18;
  poolFloorCaustic.material.map.offset.set(tt*0.009, -tt*0.014);
  poolGlow.material.opacity=dark*0.48;
  poolGlow.scale.set(26+Math.sin(tt*0.7)*0.9, 14+Math.cos(tt*0.6)*0.6, 1);

  // clouds drift downwind and are tinted by whatever the sky is doing
  for(let i=0;i<CLOUDS.length;i++){
    const c=CLOUDS[i];
    c.ox += c.sp*delta;
    if(c.ox>2100) c.ox=-2100;
    c.s.position.set(camera.position.x+c.ox, c.s.position.y, camera.position.z+c.oz);
    const far=clamp((Math.abs(c.oz)-380)/1700, 0, 1);
    c.s.material.opacity = (0.18+0.76*(1-dn.nightAmount))*(0.78+0.22*Math.sin(i*1.7))
                         * (1-far*0.30);
    c.s.material.color.copy(skyImg.mid).lerp(WHITE_C, 0.70-dn.nightAmount*0.62)
       .lerp(scene.fog.color, far*0.46*(1-dn.nightAmount*0.7));
  }
  for(let i=0;i<ALTO.length;i++){
    const c=ALTO[i];
    c.ox += c.sp*delta;
    if(c.ox>2200) c.ox=-2200;
    c.s.position.set(camera.position.x+c.ox, c.s.position.y, camera.position.z+c.oz);
    c.s.material.opacity = 0.46*(1-dn.nightAmount*0.88)*(0.62+0.38*Math.sin(i*1.9));
    c.s.material.color.copy(skyImg.mid).lerp(WHITE_C, 0.80-dn.nightAmount*0.6);
  }
  for(let i=0;i<CIRRUS.length;i++){
    const c=CIRRUS[i];
    c.ox += c.sp*delta;
    if(c.ox>2200) c.ox=-2200;
    c.s.position.set(camera.position.x+c.ox, c.s.position.y, camera.position.z+c.oz);
    c.s.material.opacity = 0.28*(1-dn.nightAmount*0.85)*(0.6+0.4*Math.sin(i*2.3));
    c.s.material.color.copy(skyImg.low).lerp(WHITE_C, 0.74-dn.nightAmount*0.6);
  }
  {                                    // balloons: only once you are out there
    const far=Math.hypot(player.pos.x, player.pos.z+8);
    const show=smoothstep(240, 620, far)*(1-dn.nightAmount*0.86);
    for(let i=0;i<BALLOONS.length;i++){
      const b2=BALLOONS[i];
      b2.s.position.x += b2.sp*delta;
      // the sky dome is a 2400 m shell round the camera; drift them well
      // inside it or they get cut in half by it as they cross
      if(b2.s.position.x> 1700) b2.s.position.x=-1700;
      b2.s.position.y += Math.sin(now*0.07+b2.ph)*delta*0.9;
      // they sit in the same haze as the mountains behind them, or they read
      // as decals pasted on the sky
      const d2=b2.s.position.distanceTo(camera.position);
      const haze=clamp((d2-scene.fog.near)/Math.max(1,(scene.fog.far*1.35-scene.fog.near)),0,1);
      b2.s.visible = show>0.01 && haze<0.97;
      b2.s.material.opacity = show*0.95*(1-haze*0.80);
      b2.s.material.color.copy(skyImg.mid).lerp(WHITE_C, 0.82).lerp(scene.fog.color, haze*0.72);
    }
  }
  updateTraffic(delta, dark);
  for(const b of BIRDS){
    b.a += b.sp*delta;
    b.s.position.set(camera.position.x+b.cx+Math.cos(b.a)*b.r, b.y+Math.sin(b.a*2.3)*3.0,
                     camera.position.z+b.cz+Math.sin(b.a)*b.r);
    b.s.material.opacity = 0.75*(1-dn.nightAmount);
    b.s.visible = dn.nightAmount<0.85;
  }
  /* the vulture: on a thermal for a couple of minutes, then gone for
     several, and never at night — nothing soars in the dark */
  if(VULTURE){
    const V=VULTURE, day=1-dn.nightAmount;
    V.t-=delta;
    if(V.t<=0){
      V.on=!V.on;
      if(V.on){                                    // it finds a new thermal
        V.t=70+Math.random()*90;
        V.r=90+Math.random()*80;
        V.y=125+Math.random()*80;
        V.sp=(0.055+Math.random()*0.045)*(Math.random()<0.5?-1:1);
        V.a=Math.random()*6.28;
        V.cx=camera.position.x+(Math.random()-0.5)*260;
        V.cz=camera.position.z+(Math.random()-0.5)*260;
        V.drift=Math.random()*6.28;
      } else V.t=110+Math.random()*190;            // and then it is finished
    }
    const want=(V.on && day>0.35) ? 1 : 0;
    V.fade += (want-V.fade)*Math.min(1, delta*0.45);
    if(V.fade>0.004){
      V.a += V.sp*delta;
      V.drift += delta*0.11;
      // it climbs as it turns, and the circle wanders with the thermal
      const rr=V.r*(1+Math.sin(V.drift*0.7)*0.16);
      const px=V.cx+Math.cos(V.drift*0.3)*40+Math.cos(V.a)*rr;
      const pz=V.cz+Math.sin(V.drift*0.4)*40+Math.sin(V.a)*rr;
      const py=V.y+Math.sin(V.drift*0.5)*18;
      V.s.position.set(px, py, pz);
      // A sprite always faces you, so the wingspan has to be foreshortened
      // by hand: side-on it is a plank, coming at you it is a line. And it
      // teeters, the way one does on a shallow dihedral.
      const view=Math.atan2(px-camera.position.x, pz-camera.position.z);
      const head=V.a+(V.sp>0?Math.PI/2:-Math.PI/2);
      const side=Math.abs(Math.sin(head-view));
      const teeter=1+Math.sin(V.drift*2.3)*0.10;
      const span=19.0;
      V.s.scale.set(span*(0.22+0.78*side)*teeter, span*0.5/(teeter*0.6+0.5), 1);
      V.s.material.opacity=0.80*V.fade*day;
      V.s.visible=true;
    } else V.s.visible=false;
  }

  // moths orbit whichever fixtures the light pool is currently driving
  for(let i=0;i<MOTHS.length;i++){
    const m=MOTHS[i], L=LIGHT_POOL[i%LIGHT_POOL.length];
    if(!L || !L.userData.mothy || L.intensity<0.02 || dark<0.25){ m.s.material.opacity=0; continue; }
    m.a += m.sp*delta;
    m.s.position.set(L.position.x + Math.cos(m.a)*m.r,
                     L.position.y - 0.18 + Math.sin(m.a*2.7+m.ph)*0.16,
                     L.position.z + Math.sin(m.a)*m.r);
    m.s.material.opacity = 0.75*Math.min(1,(dark-0.25)*3);
  }
  // dust lifting off the lot in the daytime wind — not once you are inside
  const shelteredNow=indoorsAt(camera.position.x, camera.position.z, camera.position.y);
  for(const d of DUST){
    d.life -= delta*0.16;
    if(d.life<=0){
      d.life=1;
      d.p.set(camera.position.x + (Math.random()-0.5)*70 - WIND.x*30,
              0.5+Math.random()*1.6,
              camera.position.z + (Math.random()-0.5)*70 - WIND.z*30);
    }
    d.p.addScaledVector(WIND, d.v*delta*4.0);
    d.p.y += delta*0.22;
    d.s.position.copy(d.p);
    d.s.material.opacity = shelteredNow ? 0 :
                           0.16*Math.sin(d.life*Math.PI)*(1-dn.nightAmount);
  }

  // Where the car is drawn is presentation, not physics, and it must not
  // depend on which camera happens to be active — hung off the chase-camera
  // branch, the shell stayed behind whenever anything else was looking.
  if(driving && (droneMode || view==="plan")) showCar(driving);
  if(SLOW_GREEN){
    // eleven seconds a cycle, never fully off — a sweep, not a blink
    const q=0.36+0.64*(0.5-0.5*Math.cos(tt*0.571));
    SLOW_GREEN.scr.material.opacity=0.13+0.30*q;
    SLOW_GREEN.hal.material.opacity=0.05+0.17*q;
  }
  updateCarLights(dark, delta);
  updateHUD();
  drawPlan();

  if(view==="plan"){
    const half=64, aspect=innerWidth/innerHeight;
    ortho.left=-half*aspect; ortho.right=half*aspect; ortho.top=half; ortho.bottom=-half;
    ortho.position.set(player.pos.x, 210, player.pos.z+0.01);
    ortho.up.set(0,0,-1); ortho.lookAt(player.pos.x, 0, player.pos.z);
    ortho.updateProjectionMatrix();
    renderer.render(scene, ortho);
  }else{
    renderer.render(scene, camera);
  }
}
requestAnimationFrame(frame);

// small handle for tooling / future scenes: jump the camera, scrub the clock
window.MOTEL={ player:player, rooms:ROOMS, doors:DOORS, dayNight:DayNight, keys:keys,
               renderer:renderer, scene:scene,
               go:(x,z,yaw,y)=>{ player.pos.set(x,0,z); if(yaw!==undefined) player.yaw=yaw;
                                 player.feetY=surfaceY(x,z, y===undefined?0:y); },
               sim:n=>{ for(let i=0;i<n;i++){ fixedUpdate(1/60); updateDoors(1/60); } },
               weeds:WEEDS, flyers:FLYERS, blowLitter:()=>{ flyerWait=0; },
               glow:GLOW,     // so a probe can hold a beacon lit for a frame
               wind:Wind, blow:(g)=>{ Wind.gust=(g===undefined?0.9:g); Wind.hold=Wind.gust>0; },
               terrain:Terrain, camera:camera, images:()=>IMG_STATUS,
               gifDecode:gifDecode, gifFrames:gifFrames,
               seats:SEATS, geckos:GECKOS, seatedNow:()=>!!seated, sit:sitToggle,
               cols:COL, colsDyn:COL_DYN, showCar:showCar,
               traffic:TRAFFIC, colsTraf:COL_TRAF,
               stepTraffic:(dt)=>updateTraffic(dt, 0),
               setStepAlpha:(a)=>{ stepAlpha=a; },
               cars:CARS, drivingNow:()=>driving, enterCar:enterCar, exitCar:exitCar,
               nearestCar:nearestCar,
               drone:setDrone, dronePos:dronePos, droneOn:()=>droneMode,
               zoneNow:()=>zoneAt(camera.position.x, camera.position.z, camera.position.y),
               indoorsNow:()=>indoorsAt(player.pos.x, player.pos.z, player.feetY+EYE),
               indoorsAt:indoorsAt, zoneAt:zoneAt,
               sandOn:()=>SAND.fine.p.visible,
               droneSet:(x,y,z,yaw,pitch)=>{ dronePos.set(x,y,z); droneVel.set(0,0,0);
                 droneYaw=yaw; if(pitch!==undefined) dronePitch=pitch; },
               droneStep:droneUpdate,
               press:(c)=>{ keys[c]=true; interact(); keys[c]=false; },
               testGif:(u)=>{ IMAGES['tv:0']=u;
                 const m=BUCKETS.get('pic:tv:0'); if(m&&m.mat) playGif('tv:0',u,m.mat.map); },
               pool:()=>({water:waterMesh, floor:poolFloorCaustic, glow:poolGlow,
                          mat:waterMat}),
               torch:()=>torchOn, torchToggle:()=>{ torchOn=!torchOn; },
               cols:COL, vulture:()=>VULTURE,
               vultureNow:()=>{ if(VULTURE){ VULTURE.on=true; VULTURE.t=200;
                 VULTURE.fade=1; VULTURE.r=120; VULTURE.y=185;
                 VULTURE.cx=camera.position.x+40; VULTURE.cz=camera.position.z+40; } },
               probe:(x,z,y)=>blocked(x,z,y===undefined?BASE:y),
               surf:(x,z,y)=>surfaceY(x,z,y===undefined?BASE:y) };

addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
});
