"use strict";
/* LOW DESERT MOTEL · 16-lighting.js
   the pool of real lights that follows the player
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   13 · NIGHT LIGHTING — a small pool of real lights follows the player,
   everything else glows through emissive materials.
   ---------------------------------------------------------------------- */
const LIGHT_POOL=[];
/* Nine, not seven. Seven was comfortable while the biggest lit room in the
   world was a motel bay; The Dry Well is nineteen metres by thirteen with a
   dozen fixtures in it and no daylight at all, and at seven the far half of
   the room simply had no lamp assigned to it. */
for(let i=0;i<9;i++){
  const L=new T.PointLight(0xffe9c4, 0, 10, 1.4); L.castShadow=false;
  scene.add(L); LIGHT_POOL.push(L);
}
const _lampSort=[];
// a bad ballast somewhere on the property: one fixture per alcove stutters
const FLICKER={v:1, t:0};
function tickFlicker(dt){
  FLICKER.t+=dt;
  const n=Math.sin(FLICKER.t*37.1)*Math.sin(FLICKER.t*11.3)*Math.sin(FLICKER.t*2.7);
  FLICKER.v = n>0.34 ? 0.18+Math.random()*0.25 : (n>0.18 ? 0.72 : 1.0);
}
function updateLights(dark, camPos){
  _lampSort.length=0;
  for(const l of LAMPS){
    // a lamp with a volume is behind a wall unless you are inside that volume
    if(l.vol && !(camPos.x>l.vol[0] && camPos.x<l.vol[1] &&
                  camPos.z>l.vol[2] && camPos.z<l.vol[3] &&
                  camPos.y>l.vol[4] && camPos.y<l.vol[5])) continue;
    const d2=(l.x-camPos.x)*(l.x-camPos.x)+(l.y-camPos.y)*(l.y-camPos.y)+(l.z-camPos.z)*(l.z-camPos.z);
    if(d2 < 46*46) _lampSort.push({l:l, d2:d2});
  }
  _lampSort.sort((a,b)=>a.d2-b.d2);
  for(let i=0;i<LIGHT_POOL.length;i++){
    const L=LIGHT_POOL[i], e=_lampSort[i];
    // indoor fixtures stay on through the day — a motel room has no daylight
    // to speak of once the drapes are drawn
    const mult=e ? (e.l.indoor ? Math.max(dark,0.70) : dark) : 0;
    if(!e || mult<0.02){ L.intensity=0; continue; }
    L.position.set(e.l.x, e.l.y, e.l.z);
    L.color.setHex(e.l.color);
    L.distance=e.l.dist;
    L.decay=e.l.decay||1.5;              // gentler than physical, so no hot spots
    L.intensity=e.l.intensity*mult;
    L.userData.mothy=!!e.l.mothy;        // only some outdoor fixtures draw insects
    if(e.l.flicker) L.intensity *= FLICKER.v;
  }
  for(const L of POOL_LIGHTS) L.intensity=0.16+dark*1.00;
}
