"use strict";
/* LOW DESERT MOTEL · 06-collision.js
   AABB colliders, walkable surfaces, the collider grid
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   6 · COLLISION & WALKABLE SURFACES
   Colliders are AABBs with a vertical span, so the same footprint can block
   the ground floor and the balcony independently. Walkable surfaces are flat
   plates or ramps; the player picks the highest one within step-up reach,
   which is all a two-storey motel with outdoor stairs actually needs.
   ---------------------------------------------------------------------- */
const COL=[];    // {x0,x1,z0,z1,y0,y1} — static, indexed into a grid below
const COL_DYN=[];// colliders that move: the cars, and only the cars
/* Every rock, cactus and fence post out in the desert is solid now, which
   takes the collider count from a few hundred into the thousands, and
   blocked() is called several times a frame by the player and six times a
   step by each car. A linear scan over that is the whole frame budget.
   So the static colliders go into a uniform grid once the world is built
   and every query looks at one cell. The bounds are padded when indexing so
   a query point near a cell edge still sees a collider just over the line,
   and anything spanning a silly number of cells is kept in a short list
   that is always checked. */
const COL_BIG=[], CG=12, CPAD=1.4;
/* The highway traffic. It is solid to a car and NOT to a pedestrian: a
   sedan doing thirty sweeps its box over you in a third of a second, and
   blocked() would simply hold you still inside it until it had gone by,
   which reads as being stuck rather than as being hit. So it gets its own
   list, checked by carHits and by nothing else. TRAFFIC is built in
   05-sky.js, which loads before this file, so the boxes can be collected
   here once; updateTraffic keeps each one in step with its vehicle. */
const COL_TRAF=TRAFFIC.map(v=>v.col);
let COLG=null;
function buildColGrid(){
  COLG=new Map(); COL_BIG.length=0;
  for(let i=0;i<COL.length;i++){
    const c=COL[i];
    const gx0=Math.floor((c.x0-CPAD)/CG), gx1=Math.floor((c.x1+CPAD)/CG);
    const gz0=Math.floor((c.z0-CPAD)/CG), gz1=Math.floor((c.z1+CPAD)/CG);
    if((gx1-gx0+1)*(gz1-gz0+1)>64){ COL_BIG.push(c); continue; }
    for(let gx=gx0;gx<=gx1;gx++) for(let gz=gz0;gz<=gz1;gz++){
      const k=gx*131071+gz;
      let a=COLG.get(k); if(!a){ a=[]; COLG.set(k,a); }
      a.push(c);
    }
  }
}
const _noCols=[];
function colsNear(x,z){
  if(!COLG) return COL;                       // before the grid is built
  return COLG.get(Math.floor(x/CG)*131071+Math.floor(z/CG)) || _noCols;
}
const SEATS=[];  // somewhere to sit: the cushion's x/z/height, which way it
                 // faces, and what the prompt should call it
function addSeat(x,z,y,yaw,label,lie){
  SEATS.push({x:x, z:z, y:y, yaw:yaw, label:label, lie:!!lie});
}
const SURF=[];   // flat {x0,x1,z0,z1,y} | ramp {axis:'x'|'z',a0,a1,y0,y1}
const ZONES=[];  // {x0,x1,z0,z1,y0,y1,name}

function addCol(x0,x1,z0,z1,y0,y1){
  COL.push({x0:Math.min(x0,x1), x1:Math.max(x0,x1),
            z0:Math.min(z0,z1), z1:Math.max(z0,z1),
            y0:(y0===undefined?-2:y0), y1:(y1===undefined?60:y1)});
}
// wall helper: centre + size, straight into both the collider list and a bucket
function wall(bucketName, x,y,z, w,h,d, uvScale, color){
  bx(bucketName, w,h,d, x,y,z, uvScale, 0, color);
  addCol(x-w/2, x+w/2, z-d/2, z+d/2, y-h/2, y+h/2);
}
function addFlat(x0,x1,z0,z1,y){ SURF.push({flat:true,x0:x0,x1:x1,z0:z0,z1:z1,y:y}); }
function addRamp(x0,x1,z0,z1,axis,a0,a1,y0,y1){
  SURF.push({flat:false,x0:x0,x1:x1,z0:z0,z1:z1,axis:axis,a0:a0,a1:a1,y0:y0,y1:y1});
}
// `indoor` marks a volume that has a roof on it. Blown sand and lot dust are
// drawn as a field around the camera with no idea what it is standing in, so
// without this the storm came inside with you.
function addZone(x0,x1,z0,z1,y0,y1,name,indoor){
  ZONES.push({x0:x0,x1:x1,z0:z0,z1:z1,y0:y0,y1:y1,name:name,indoor:!!indoor});
}
function indoorsAt(x,z,y){
  for(let i=0;i<ZONES.length;i++){
    const q=ZONES[i];
    if(q.indoor && x>q.x0&&x<q.x1&&z>q.z0&&z<q.z1&&y>=q.y0&&y<q.y1) return true;
  }
  return false;
}

const PAVED={x0:LOT.x0, x1:LOT.x1, z0:ROADZ+4.5, z1:LOT.z1};
// pool basin profile — the ground itself dips inside the tank
function poolFloorY(x,z){
  const t=clamp((x-POOL.x0-1.6)/(POOL.x1-POOL.x0-3.2),0,1);
  return -1.05 - t*1.25;                             // -1.05 shallow, -2.30 deep
}
const POOL_STEPS={x0:POOL.x0, x1:POOL.x0+2.0, z0:1.6, z1:3.6};
function inRect(r,x,z){ return x>r.x0&&x<r.x1&&z>r.z0&&z<r.z1; }

function groundY(x,z){
  if(inRect(POOL,x,z)){
    if(inRect(POOL_STEPS,x,z)){                      // graded entry steps
      const u=clamp((x-POOL_STEPS.x0)/(POOL_STEPS.x1-POOL_STEPS.x0),0,1);
      return lerp(0, -1.05, u);
    }
    return poolFloorY(x,z);
  }
  if(x>PAVED.x0 && x<PAVED.x1 && z>PAVED.z0 && z<PAVED.z1) return 0;   // asphalt apron
  return Terrain.heightAt(x,z);
}
const STEP_UP=0.62;
/* A tunnel goes INTO a hill, and the rock over your head is the terrain.
   surfaceY starts from the heightfield, so without this the moment you step
   inside you are lifted through the roof and put back on the hilltop. A void
   says: within this box, the ground is the floor I hand you, not the
   heightfield. The y test is against where you already are, so standing on
   the hill above the tunnel still gets you the hill.                      */
const VOIDS=[];
function addVoid(x0,x1,z0,z1,y0,y1,floor){
  VOIDS.push({x0:x0,x1:x1,z0:z0,z1:z1,y0:y0,y1:y1,floor:floor});
}
function voidAt(x,z,y){
  for(let i=VOIDS.length-1;i>=0;i--){
    const v=VOIDS[i];
    if(x>v.x0&&x<v.x1&&z>v.z0&&z<v.z1&&y>=v.y0&&y<v.y1) return v;
  }
  return null;
}
function surfaceY(x,z,curY){
  const _v=voidAt(x,z,curY);
  let best=_v ? _v.floor : groundY(x,z);
  for(let i=0;i<SURF.length;i++){
    const s=SURF[i];
    if(x<=s.x0||x>=s.x1||z<=s.z0||z>=s.z1) continue;
    let y;
    if(s.flat) y=s.y;
    else{
      const a=(s.axis==="x"?x:z);
      y=lerp(s.y0, s.y1, clamp((a-s.a0)/(s.a1-s.a0),0,1));
    }
    if(y>best && y<=curY+STEP_UP) best=y;
  }
  return best;
}
function hitsAny(list,x,z,r,lo,hi,skip){
  for(let i=0;i<list.length;i++){
    const c=list[i]; if(c===skip) continue;
    if(x>c.x0-r && x<c.x1+r && z>c.z0-r && z<c.z1+r && hi>c.y0 && lo<c.y1) return true;
  }
  return false;
}
function blocked(x,z,feetY){
  const r=PLAYER_R, lo=feetY+0.12, hi=feetY+1.72;
  return hitsAny(colsNear(x,z), x,z,r,lo,hi) ||
         hitsAny(COL_BIG,       x,z,r,lo,hi) ||
         hitsAny(COL_DYN,       x,z,r,lo,hi);
}
function zoneAt(x,z,y){
  let hit=null;
  for(let i=0;i<ZONES.length;i++){
    const q=ZONES[i];
    if(x>q.x0&&x<q.x1&&z>q.z0&&z<q.z1&&y>=q.y0&&y<q.y1) hit=q;
  }
  return hit?hit.name:null;
}
