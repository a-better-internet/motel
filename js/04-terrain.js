"use strict";
/* LOW DESERT MOTEL · 04-terrain.js
   heightfield, LOD grids, the pads cut into it
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   4 · TERRAIN — flat motel pad blended into open desert and a mesa ring
   ---------------------------------------------------------------------- */
/* AN APRON IS A CURTAIN IF YOU DIG UNDER IT.
   Every ring hangs a skirt off its border and off the inside of each hole,
   to cover the crack where two levels of detail disagree. Forty and fifty
   metres of it, because a mesa's worth of ground can fall away at a seam.
   That is fine while the only thing under the desert is more desert — and
   it stopped being fine the moment there was a room down there. The LOOK
   ring's east edge is at x = -120 exactly, and The Dry Well in
   14e-speakeasy.js runs from -133 to -114, so BOTH that ring's apron and
   the middle ring's matching hole apron hung straight down through the
   middle of the bar: a fifty-metre sheet of desert standing between the
   banquette and the counter, lit like a wall, which is exactly what it
   looked like.
   Where an apron crosses one of these boxes it drops 1.2 m instead. The
   ground there is flat to within a few centimetres, so a metre still
   covers the crack several times over, and nothing reaches the ceiling of
   anything. Anything excavated under this terrain has to be listed here.*/
/* Two boxes now: the speakeasy, and the hall west of it. The hall's ceiling
   climbs with the mesa it is cut into, so the cap has to hold all the way
   out to x = -194 — the apron is 1.2 m there as everywhere else, which is
   several times the crack between two levels of detail and nowhere near
   anything's roof. ANYTHING EXCAVATED UNDER THIS TERRAIN GOES IN THIS LIST. */
const SKIRT_GAPS=[{x0:-141, x1:-106, z0:370, z1:398, drop:1.2},
                  {x0:-196, x1:-130, z0:344, z1:402, drop:1.2},
                  // the shelter patch, whose rims cross the tunnel below
                  {x0: -86, x1: -70, z0:336, z1:358, drop:1.2},
                  // and the stairwell itself: NO apron. Even 10 cm of one
                  // hung on the shaft walls' faces and across the shaft at
                  // the hut's back wall, in sand colour — the orange bands
                  // down both walls of the stair. The bore's rim is now
                  // behind the walls and under the hut's floor, where there
                  // is no crack for an apron to cover.
                  {x0: -79, x1: -75, z0:339.5, z1:346, drop:0.0}];
/* The SMALLEST drop of every box the point is in, not the first box's.
   With the first-match rule the shelter patch's 1.2 m (listed third)
   swallowed the stairwell's own setting (listed fourth, and inside it),
   so the "10 cm behind the kerb" apron round the bore was 1.2 m all
   along — hanging down both shaft walls and across the flight. */
function skirtDrop(x,z,drop){
  let d=drop;
  for(let i=0;i<SKIRT_GAPS.length;i++){
    const g=SKIRT_GAPS[i];
    if(x>g.x0 && x<g.x1 && z>g.z0 && z<g.z1) d=Math.min(d, g.drop);
  }
  return d;
}

const Terrain=(function(){
  const fract=x=>x-Math.floor(x);
  const hash=(x,y)=>fract(Math.sin(x*127.1+y*311.7)*43758.5453123);
  function vnoise(x,y){
    const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi;
    const a=hash(xi,yi), b=hash(xi+1,yi), c=hash(xi,yi+1), d=hash(xi+1,yi+1);
    const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf);
    return a*(1-u)*(1-v)+b*u*(1-v)+c*(1-u)*v+d*u*v;
  }
  function fbm(x,y){ let f=0,a=0.5,fr=1; for(let i=0;i<5;i++){ f+=a*vnoise(x*fr,y*fr); fr*=2; a*=0.5; } return f; }

  // the graded pad: the lot plus the highway corridor, all dead flat at y = 0
  // west of the motel the pad now carries the bar's lot as well
  const PAD={x0:LOT.x0-50, x1:LOT.x1+14, z0:ROADZ-16, z1:LOT.z1+12};
  // The highway keeps going after the pad does. Its corridor is graded flat
  // out to the edge of the world, and the badlands and buttes it crosses are
  // cut away on either side of it, so the road runs off to a vanishing point
  // instead of stopping in mid-desert.
  const CORR={x0:-1760, x1:1760, z0:ROADZ-26, z1:ROADZ+26};
  function boxDist(B,x,z){
    return Math.hypot(Math.max(B.x0-x, 0, x-B.x1), Math.max(B.z0-z, 0, z-B.z1));
  }
  function padDist(x,z){ return Math.min(boxDist(PAD,x,z), boxDist(CORR,x,z)); }
  // Named buttes so the horizon has a memorable silhouette. `flat` is how
  // much of the radius is tabletop: the higher it is, the more the sides read
  // as a cliff rather than a hill.
  const MESAS=[
    {x:-880, z: 640, h:190, r:520, flat:0.62},
    {x: 820, z: 470, h:230, r:600, flat:0.68},
    {x: 140, z:1120, h:170, r:470, flat:0.60},
    {x:-620, z:-980, h:150, r:430, flat:0.55},
    {x: 980, z:-660, h:180, r:520, flat:0.62},
    // nearer buttes, steep-sided, that stand clear of the escarpment
    // flat 0.42, not 0.80. This is the butte the fire road climbs, and at
    // 0.80 its flank was thirty-eight metres wide for a ninety-six metre
    // rise — a cliff, with nowhere to put a trail. The tabletop is still
    // a hundred and sixty metres across; the flank is now a hundred and ten.
    {x:-330, z: 430, h: 96, r:190, flat:0.42},
    {x: 250, z: 520, h:118, r:220, flat:0.82},
    {x: 560, z: 180, h: 74, r:150, flat:0.78},
    {x:-520, z: 130, h: 62, r:140, flat:0.76},
    {x: 470, z:-330, h: 70, r:160, flat:0.78},
  ];
  // Two escarpments — one behind the motel, one across the highway — whose
  // rim lines wander, so the canyon wall breaks into headlands and bays.
  function rim(x,z,base,sign,height,depth){
    const line=base + (fbm(x*0.0016+40, 7.3)-0.5)*230 + (fbm(x*0.0068+3, 2.1)-0.5)*60;
    const t=smoothstep(line, line+depth, sign*z);
    if(t<=0) return 0;
    const face=(fbm(x*0.02, z*0.02)-0.5)*height*0.12;
    return height*t + face*t;
  }
  const PAD_Y=-0.25;                       // graded sub-base, under every slab
  /* The adit bench. This is the only place on the map where the ground has
     been dug, and it has to be the ground rather than scenery: piling rock on
     an untouched slope is what made the mine read as a heap of boulders with
     a hole behind it instead of something cut into a hill.
     A level working platform, narrowing as it goes in, with the waste tipped
     over its front edge in a fan. The natural slope climbs about half a metre
     per metre here, so a platform held level from z = 33 to z = 46 arrives at
     the face four and a bit metres below grade — and that face is the thing
     the portal is cut into. You walk up the fan, into the cut, and the hill
     closes over your head.                                                 */
  const ADIT={x:-566, y:10.0, zFace:46, zLip:33, zToe:24, hwFace:3.6, hwLip:6.0};
  function aditCut(x,z,h){
    if(z>ADIT.zFace || z<ADIT.zToe-4) return h;          // behind the face, untouched
    const dx=Math.abs(x-ADIT.x);
    if(z>=ADIT.zLip){                                    // the cut itself
      const t=(z-ADIT.zLip)/(ADIT.zFace-ADIT.zLip);
      const hw=ADIT.hwLip+(ADIT.hwFace-ADIT.hwLip)*t;
      const s=smoothstep(hw, hw+4.2, dx);                // banked back into the hill
      return Math.min(h, ADIT.y+(h-ADIT.y)*s);
    }
    const t=Math.min(1,(ADIT.zLip-z)/(ADIT.zLip-ADIT.zToe));
    const hw=ADIT.hwLip+t*5.5;                           // the fan spreads as it falls
    const s=smoothstep(hw+2.5, hw-2.0, dx);
    if(s<=0) return h;
    const fan=ADIT.y+(h-ADIT.y)*Math.pow(t,1.45)
            + (fbm(x*0.22+9, z*0.22+9)-0.5)*1.1*s*(1-t*0.5);
    return h+(fan-h)*s;
  }
  /* The tracking station's pad. A dish on a mount needs ground that was
     graded flat and then left, which is a circle of level fill with the
     desert running back up to meet it — the same trick as the adit bench,
     but a disc rather than a cut, and a long way further out.           */
  const DISH={x:-250, z:-650, y:5.0, r:44, blend:26};
  function dishPad(x,z,h){
    const d=Math.hypot(x-DISH.x, z-DISH.z);
    if(d>DISH.r+DISH.blend) return h;
    const s2=smoothstep(DISH.r, DISH.r+DISH.blend, d);
    return h+(DISH.y-h)*(1-s2);
  }
  /* The diner's apron. A diner car was trucked in on a lowboy and dropped on
     a graded pad beside the road, and it needs level ground under it for the
     same reason the tracking station does — the middle ring is seven metre
     cells out here and a building on raw desert sits on a facet.        */
  // North of the road, because the entrance is on the car's -z face and a
  // diner's door faces the highway it was put there to catch.
  const DINER={x:902, z:ROADZ+25, y:0.02, r:13, blend:10};
  function dinerPad(x,z,h){
    const d=Math.hypot(x-DINER.x, z-DINER.z);
    if(d>DINER.r+DINER.blend) return h;
    return h+(DINER.y-h)*(1-smoothstep(DINER.r, DINER.r+DINER.blend, d));
  }
  /* ---- the fire road up the lookout butte -----------------------------
     A trail on a mesa flank is not scenery you lay on the ground, it is a
     bench somebody cut into it, and it has to be the ground for the same
     reason the adit bench does: a path drawn on a forty-degree slope either
     floats off it or is buried in it, and you cannot walk on either.

     Five legs traversing back and forth across a seventy-degree sector of
     the south flank, the radius closing from 184 m at the toe to 76 m at
     the rim, climbing at a steady grade the whole way. The bench is 6.4 m
     wide — a fire road, not a footpath, because at three metres it would
     vanish into one cell of the grid that draws it — and it blends out
     over seven more, which is the cut bank above it and the fill below.

     Five across seventy, and not six across a hundred and forty: the wide
     version measured out at 1963 m of trail for a 65 m climb, which is a
     3.3% grade — a highway, and an eight-minute walk to get up a hill you
     can see the top of. This one is about eight hundred metres at 12%,
     which is what a fire road actually is.                              */
  const LOOK={x:-330, z:430, r:190, r0:184, r1:76,
              a0:-Math.PI*0.70, a1:-Math.PI*0.31, legs:5,
              half:3.2, blend:7.0};
  let TRAIL=null, _noTrail=false;
  function trailPath(){
    if(TRAIL) return TRAIL;
    const pts=[];
    for(let i=0;i<LOOK.legs;i++){
      const t0=i/LOOK.legs, t1=(i+1)/LOOK.legs, up=(i%2)===0;
      /* 44 samples a leg, not 30, and the sweep eased at both ends with a
         smoothstep. A leg that starts and stops its turn abruptly meets the
         next one at a corner, and the bench — and the surface laid on it —
         came out of the hairpins as a crossed pair of straight runs rather
         than a turn. Eased, the radius is already closing as the angle
         stops, so the two legs hand over to each other on a curve. */
      for(let k=(i?1:0);k<=44;k++){
        const u=k/44, t=t0+(t1-t0)*u;
        const e=u*u*(3-2*u);                     // ease the swing, not the climb
        const rr=LOOK.r0+(LOOK.r1-LOOK.r0)*t;
        const a=up ? LOOK.a0+(LOOK.a1-LOOK.a0)*e : LOOK.a1+(LOOK.a0-LOOK.a1)*e;
        pts.push({x:LOOK.x+Math.cos(a)*rr, z:LOOK.z+Math.sin(a)*rr, y:0, s:0});
      }
    }
    let run=0;
    for(let i=1;i<pts.length;i++){
      run+=Math.hypot(pts[i].x-pts[i-1].x, pts[i].z-pts[i-1].z);
      pts[i].s=run;
    }
    /* The two ends are sampled off the untouched ground, and everything
       between them is a straight grade from one to the other. Sampling
       every point off the ground instead would give a trail that follows
       the gullies up and down, which is a goat track, not a graded road. */
    _noTrail=true;
    const y0=heightAt(pts[0].x, pts[0].z), y1=heightAt(pts[pts.length-1].x, pts[pts.length-1].z);
    _noTrail=false;
    for(const q of pts) q.y=y0+(y1-y0)*(q.s/run);
    TRAIL=pts; return TRAIL;
  }
  function trailCut(x,z,h){
    if(_noTrail) return h;
    const dx=x-LOOK.x, dz=z-LOOK.z;
    if(dx*dx+dz*dz > (LOOK.r+30)*(LOOK.r+30)) return h;     // nowhere near it
    const P=trailPath(), lim=LOOK.half+LOOK.blend;
    let best=1e9, ty=h;
    for(let i=1;i<P.length;i++){
      const a=P[i-1], b=P[i];
      if(x<Math.min(a.x,b.x)-lim || x>Math.max(a.x,b.x)+lim ||
         z<Math.min(a.z,b.z)-lim || z>Math.max(a.z,b.z)+lim) continue;
      const ex=b.x-a.x, ez=b.z-a.z, L2=ex*ex+ez*ez;
      const t=L2>0 ? Math.max(0, Math.min(1, ((x-a.x)*ex+(z-a.z)*ez)/L2)) : 0;
      const px=a.x+ex*t, pz=a.z+ez*t;
      const d=Math.hypot(x-px, z-pz);
      if(d<best){ best=d; ty=a.y+(b.y-a.y)*t; }
    }
    if(best>=lim) return h;
    const s2=smoothstep(lim, LOOK.half, best);
    // the bench falls a little to the outside, the way a graded road drains
    return h+(ty-h)*s2 - s2*0.10*Math.min(1, best/LOOK.half);
  }
  function heightAt(x,z){
    const d=padDist(x,z);
    // The apron is graded up out of the highway corridor and its blend runs
    // back down into it, so it has to be applied on this path too. Returning
    // the flat sub-base here put a six-centimetre step through the middle of
    // the building, along the line where the corridor ends.
    if(d<=0.001) return dinerPad(x,z,PAD_Y);
    const t=smoothstep(0,46,d);                                   // graded shoulder
    const dune=(fbm(x*0.0060+31, z*0.0060+31)-0.5)*10
             + (fbm(x*0.0210,    z*0.0210)   -0.5)*1.9;
    let h=PAD_Y + smoothstep(0,7,d)*0.25 + t*(1.1+dune);
    /* Far ring: ground lifts into broken badlands past ~430 m, cut away
       either side of the highway so the road runs off to a vanishing point.

       That cut is 210 m of graded flat on each side, and held at 210 m all
       the way to the end of the world it left a four-hundred-metre-wide
       valley floor running straight at the horizon — so looking east past
       the diner the walls never closed and the view ended on a notch of open
       sky. The ramp tightens with distance instead: near the motel it is the
       full 210 m, and by a mile out it is twenty-odd, which brings the walls
       in against the shoulder and turns the far highway into a slot. The
       road still runs to a vanishing point; there is just canyon behind it
       now rather than a hole. */
    const slot=smoothstep(700, 1350, Math.abs(x));
    const cut=smoothstep(0, 210-slot*170, boxDist(CORR,x,z));
    const dc=Math.hypot(x, z+8);
    const ring=smoothstep(600, 1400, dc)*cut;
    if(ring>0){
      const silh=fbm(x*0.0042+80, z*0.0042+80);
      const crag=(fbm(x*0.017,z*0.017)-0.5)*0.5;
      h += ring*(110*(0.35+1.05*silh)+crag*60);
    }
    h=Math.max(h, rim(x,z, 760,  1, 135, 150));                   // northern canyon wall
    h=Math.max(h, rim(x,z, 900, -1, 118, 170));                   // wall across the highway
    for(const m of MESAS){                                        // flat-topped buttes
      const dm=Math.hypot(x-m.x, z-m.z);
      if(dm<m.r){
        const u=1-dm/m.r;
        const shoulder=smoothstep(0,1-m.flat,u);
        const top=m.h*shoulder*cut;
        const rough =(fbm(x*0.0075+m.x*0.001, z*0.0075+m.z*0.001)-0.5)*top*0.42;
        const ridge =(fbm(x*0.022, z*0.022)-0.5)*top*0.28;         // gullies down the flanks
        const fine  =(fbm(x*0.060, z*0.060)-0.5)*Math.min(top,60)*0.22;
        h=Math.max(h, top+rough+ridge+fine);
      }
    }
    return trailCut(x,z, dinerPad(x,z, dishPad(x,z, aditCut(x,z,h))));
  }
  return {heightAt:heightAt, fbm:fbm, PAD:PAD, PAD_Y:PAD_Y, ADIT:ADIT, DISH:DISH,
          DINER:DINER, LOOK:LOOK, trailPath:trailPath};
})();

const NEAR_SITE={x0:-118, x1:82, z0:-104, z1:74};
/* EVERY GRID BUILT, FINEST FIRST — so anything outside this file can ask for
   the height of the ground it can SEE rather than the height of the field
   the ground was sampled from. Those are not the same number. `heightAt` is
   a continuous analytic field; the terrain is drawn by sampling it on a
   lattice of 0.5, 2, 3, 6 or 12 m and joining the samples with flat
   triangles. On the flat that difference is millimetres. On the flank of a
   mesa, where the field climbs most of a metre per metre, a 6 m cell can cut
   ten metres off a spur or bridge ten metres over a gully — so a player
   walking at `heightAt` sinks into the hillside they can see, or strides out
   into the air above it, and a rock placed at `heightAt` hangs over the
   slope it is supposed to be lying on. That is the hollow mesa.
   `Terrain.groundAt` interpolates the same triangle the renderer draws. */
const TERRAIN_RINGS=[];
(function buildTerrain(){
  const floorC=new T.Color(0xb99165), duneC=new T.Color(0xa47a4e),
        mountC=new T.Color(0x8a5540), peakC=new T.Color(0xbb9068), rockC=new T.Color(0x5e4032);
  // sedimentary banding: alternating iron-red and buff layers, strongest on the
  // cliff faces, with a pale caprock on the tabletops
  const strA=new T.Color(0x8a3f28),   // iron-red sandstone
        strB=new T.Color(0xd9c49c),   // pale buff
        strC=new T.Color(0x7d7466),   // grey mudstone
        capC=new T.Color(0xe0cfa8);   // bleached caprock
  const _b=new T.Color();
  function tint(x,y,slope,out){
    out.copy(floorC).lerp(duneC, smoothstep(2,12,y));
    out.lerp(mountC, smoothstep(16,60,y));
    out.lerp(peakC, smoothstep(95,175,y));
    const band=Math.sin(y*0.115)*0.5+0.5, thin=Math.sin(y*0.34+1.1)*0.5+0.5;
    _b.copy(strA).lerp(strB, band).lerp(strC, thin*0.42);
    out.lerp(_b, Math.min(0.92, 0.42+slope*0.95)*smoothstep(6,24,y));
    out.lerp(capC, smoothstep(0.26,0.05,slope)*smoothstep(46,110,y)*0.6);
    out.lerp(rockC, slope*0.34);
  }
  // A grid built by hand rather than PlaneGeometry, so cells can be dropped:
  // the pool tank needs a real hole in the ground, and the fine grid around
  // the site must not double up on the coarse one that covers the horizon.
  function grid(x0,x1,z0,z1,cell,holes,name,skirt){
    const nx=Math.round((x1-x0)/cell), nz=Math.round((z1-z0)/cell);
    TERRAIN_RINGS.push({x0:x0, x1:x1, z0:z0, z1:z1, cell:cell, holes:holes||[], name:name});
    const P=[], C=[], U=[], IDX=[], c=new T.Color();
    for(let j=0;j<=nz;j++) for(let i=0;i<=nx;i++){
      const x=x0+i*cell, z=z0+j*cell, y=Terrain.heightAt(x,z);
      const h1=Terrain.heightAt(x+2.5,z), h2=Terrain.heightAt(x,z+2.5);
      const slope=Math.min(1,(Math.abs(h1-y)+Math.abs(h2-y))*0.5);
      tint(x,y,slope,c);
      const macro=(Terrain.fbm(x*0.09,z*0.09)-0.5)*0.18;
      const micro=(Math.sin(x*12.9+z*78.2)*0.5+0.5)*0.11;
      const hsh=((Math.sin(x*127.1+z*311.7)*43758.5)%1+1)%1;
      const g=0.93+macro+micro+(hsh>0.986?-0.24:0)+(hsh<0.009?0.2:0);
      P.push(x,y,z); U.push(x*0.045, z*0.045); C.push(c.r*g, c.g*g, c.b*g);
    }
    const inHole=(cx0,cx1,cz0,cz1)=>{
      for(const h of holes||[]) if(cx0>=h.x0 && cx1<=h.x1 && cz0>=h.z0 && cz1<=h.z1) return true;
      return false;
    };
    for(let j=0;j<nz;j++) for(let i=0;i<nx;i++){
      const cx0=x0+i*cell, cz0=z0+j*cell;
      if(inHole(cx0, cx0+cell, cz0, cz0+cell)) continue;
      const a=j*(nx+1)+i, b=a+1, d=a+nx+1, e=d+1;
      IDX.push(a,d,b, b,d,e);
    }
    /* A fine grid butts against a coarse one along a straight line, but the
       two only agree at the coarse grid's own nodes: seven metres apart on
       one side, half a metre on the other, and between them the edges bow
       away from each other. That is a hairline crack with the sky behind it,
       all the way round every inner ring. A skirt hangs a short apron down
       from each border node and fills them.                               */
    /* Hang an apron off a ring of nodes.

       The first version of this emitted every skirt quad twice, once each
       way round, so it would show whichever side the crack opened on. It
       did — as a black line. computeVertexNormals sums the face normals at
       each vertex, and two faces with opposite winding sum to zero, so the
       whole bottom row came out with no normal at all and shaded pure
       black. The apron was hiding the sky behind a strip of void.
       So: one winding, its own copy of the top row (the terrain rim keeps
       its own flat-ground normal that way), and the material is
       double-sided, which makes three.js flip the normal on back faces for
       us. The apron now shades like the cliff it hangs off.              */
    const hangSkirt=(ring,drop)=>{
      const base=P.length/3;
      for(let pass=0;pass<2;pass++) for(const v of ring){
        const d = pass ? skirtDrop(P[v*3], P[v*3+2], drop) : 0;
        P.push(P[v*3], P[v*3+1]-d, P[v*3+2]);
        C.push(C[v*3]*(pass?0.86:1), C[v*3+1]*(pass?0.86:1), C[v*3+2]*(pass?0.86:1));
        U.push(U[v*2], U[v*2+1]+d*0.045);
      }
      const n=ring.length;
      for(let k=0;k<n-1;k++){
        const a1=base+k, b1=base+k+1, a2=base+n+k, b2=base+n+k+1;
        IDX.push(a1,a2,b1, b1,a2,b2);
      }
    };
    if(skirt){
      const border=[];
      for(let i=0;i<=nx;i++) border.push(i);
      for(let j=1;j<=nz;j++) border.push(j*(nx+1)+nx);
      for(let i=nx-1;i>=0;i--) border.push(nz*(nx+1)+i);
      for(let j=nz-1;j>=1;j--) border.push(j*(nx+1));
      border.push(0);                                  // close the loop
      hangSkirt(border, skirt);
      /* And round the inside of every hole. A skirt on the outer border only
         covers the crack when the ring that owns the skirt is the HIGHER of
         the two; where the coarse ring rides above the fine one instead, you
         were looking in under the rim of the hole and out at the sky. One
         apron each way and it is covered whichever way the two disagree. */
      for(const h of holes||[]){
        const i0=Math.round((h.x0-x0)/cell), i1=Math.round((h.x1-x0)/cell);
        const j0=Math.round((h.z0-z0)/cell), j1=Math.round((h.z1-z0)/cell);
        if(i0<0 || j0<0 || i1>nx || j1>nz || i1-i0<1 || j1-j0<1) continue;
        const ring=[];
        for(let i=i0;i<=i1;i++) ring.push(j0*(nx+1)+i);
        for(let j=j0+1;j<=j1;j++) ring.push(j*(nx+1)+i1);
        for(let i=i1-1;i>=i0;i--) ring.push(j1*(nx+1)+i);
        for(let j=j1-1;j>=j0;j--) ring.push(j*(nx+1)+i0);
        hangSkirt(ring, skirt);
      }
    }
    const g=new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(P,3));
    g.setAttribute("color",    new T.Float32BufferAttribute(C,3));
    g.setAttribute("uv",       new T.Float32BufferAttribute(U,2));
    g.setIndex(IDX); g.computeVertexNormals();
    const m=new T.MeshStandardMaterial({vertexColors:true, map:TEX.sand, roughness:0.97,
                                        metalness:0, side:T.DoubleSide});
    const mesh=new T.Mesh(g,m); mesh.receiveShadow=true; mesh.name=name;
    scene.add(mesh); return mesh;
  }
  // Three rings: a coarse horizon, a 5 m band across the canyon country where
  // the strata and cliff faces need to read, and a 2 m grid over the site.
  const MID={x0:-1008, x1:1008, z0:-1078, z1:938};
  // The bench is a 4 m step in the ground and the middle ring's 6 m cells
  // would smear it into a dimple, so it gets 2 m cells of its own. Its box is
  // on the 6 m lattice exactly (MID.x0 + 6k, MID.z0 + 6k) so the coarse grid
  // drops precisely those cells and the two meshes meet without a seam.
  const ADIT_SITE={x0:-588, x1:-546, z0:14, z1:56};
  /* THE SHELTER NEEDS A HOLE IN THE GROUND, not just a hole in its floor.
     The stairwell was reported blocked three times. Twice it was the
     concrete; the third time the concrete was open and what you were
     looking at was THE DESERT — the terrain mesh runs straight across the
     bore sixteen centimetres under the hut's floor, so with the slab cut
     away you saw sand where the first four treads are. A shaft that breaks
     the surface has to be cut out of the surface. Half-metre cells here so
     a 2 x 4.5 m hole can be drawn at all (the 6 m ring can only drop whole
     6 m cells, which would take the compound with it), and the patch runs
     out to z = 356 so the mid ring's own rim never lands on the tunnel
     running south underneath it. */
  const SHELTER_SITE={x0:-84, x1:-72, z0:338, z1:356};
  /* The bore is cut to the shaft walls' OUTER faces (-78.26 / -75.74),
     rounded out to this patch's half-metre lattice — not to the shaft's
     clear width. Cut to the clear width, the ground's edge ran exactly
     along the inside face of each wall, and the sand fought the concrete
     for the top metre of the stair. Out here the edge is behind the walls
     and under the hut's floor mass, where nothing can see it. */
  const SHELTER_BORE={x0:-78.5, x1:-75.5, z0:340.5, z1:345.0};
  /* A hole is only punched for a cell that falls ENTIRELY inside it, so a
     hole whose edge lands mid-cell leaves the coarse grid covering up to a
     whole cell of ground the fine grid also covers. NEAR_SITE's edges were
     not on the middle ring's lattice, so it overlapped the near one by
     part of a cell the whole way round — and along the highway corridor,
     where both are dead flat at y = -0.25, the two were exactly coplanar.
     That is the colour fringing down the edge of the road.
     Snapping outward to the lowest common multiple of the two cell sizes
     puts the boundary on both lattices at once, so every coarse cell is
     either wholly in the hole or wholly out, and the fine grid's own cells
     divide the span evenly. No overlap, and no gap either. */
  const snapOut=(r, step, ox, oz)=>({
    x0: ox+Math.floor((r.x0-ox)/step)*step, x1: ox+Math.ceil((r.x1-ox)/step)*step,
    z0: oz+Math.floor((r.z0-oz)/step)*step, z1: oz+Math.ceil((r.z1-oz)/step)*step });
  const NEAR_G=snapOut(NEAR_SITE, 6, MID.x0, MID.z0);       // 6 m ring, 2 m patch
  /* The lookout butte gets three-metre cells of its own. The fire road is a
     6.4 m bench and the middle ring is six: at that size the bench is one
     cell wide and the grid smears it into a slight lean on the hillside,
     which is a trail you can walk up and cannot see. The box is on the
     middle ring's own lattice at all four edges — (MID.x0 + 6k, MID.z0 + 6k)
     — so every coarse cell inside it is dropped whole, and 3 divides 6, so
     the fine grid's own cells land on the coarse nodes along the seam. */
  const LOOK_G={x0:-540, x1:-120, z0:218, z1:644};
  /* The horizon ring and the middle ring, and the seam between them.

     A hole in the world can only ever happen AT A SEAM — inside one mesh the
     ground is continuous however steep it gets. So there are exactly two
     things to get right here, and both of them were wrong.

     One: the hole punched in the coarse ring has to land on the coarse
     ring's own lattice at all four edges, or the cells that straddle an edge
     are not dropped and the two meshes overlap. The x edges did; the z edges
     did not, because -1740 and 1860 are not a whole number of cells from
     -1078 and 938. Moving the coarse ring's z bounds two metres fixes all
     four at once.

     Two: the two rings have to sample the border in step. The coarse ring
     had 12 m cells and the middle one 7 m, so along the shared line the two
     edges only touched ground at the same place every 84 m; everywhere
     between, one ring was reading a cliff the other had not reached yet. A
     probe walking the border said the ground changes by up to 46 m across
     ONE coarse cell where the escarpment crosses it, and that whole 46 m
     could open as sky. Six metres of cell is the fix: 12 is a whole number
     of 6, so every coarse node on the border now falls on a fine node too
     and the two meshes agree exactly there. What is left between them is
     one triangle's worth of bow, and the skirts swallow that. */
  grid(-1800,1800,-1738,1862, 12, [MID], "desert-far", 40);
  grid(MID.x0, MID.x1, MID.z0, MID.z1, 6, [NEAR_G, ADIT_SITE, LOOK_G, SHELTER_SITE],
       "desert-mid", 55);
  grid(LOOK_G.x0, LOOK_G.x1, LOOK_G.z0, LOOK_G.z1, 3, [], "desert-look", 22);
  // Half-metre cells here, not two. The cut's back wall is a 4.5 m step and
  // the grid triangle that carries it has to land inside the thickness of the
  // rock face: at 2 m that triangle ramps out of the floor and up through the
  // doorway, which is the sand that was covering the entrance.
  grid(ADIT_SITE.x0, ADIT_SITE.x1, ADIT_SITE.z0, ADIT_SITE.z1, 0.5, [], "desert-adit", 6);
  grid(SHELTER_SITE.x0, SHELTER_SITE.x1, SHELTER_SITE.z0, SHELTER_SITE.z1, 0.5,
       [SHELTER_BORE], "desert-shelter", 3);
  grid(NEAR_G.x0, NEAR_G.x1, NEAR_G.z0, NEAR_G.z1, 2, [POOL.deck], "desert-near", 6);
  TERRAIN_RINGS.sort((a,b)=>a.cell-b.cell);          // finest ring wins
})();

/* The height of the ground you can SEE at (x,z): find the finest ring that
   actually draws a triangle there, work out which of the cell's two
   triangles the point is in, and interpolate it. `grid` splits each cell
   as (a,d,b) and (b,d,e) with a at the low corner, so the diagonal runs
   u + v = 1 and the two halves are either side of it. Four heightAt calls
   per query, which the player makes a handful of times a frame. */
function groundAt(x,z){
  for(let r=0;r<TERRAIN_RINGS.length;r++){
    const R=TERRAIN_RINGS[r];
    if(x<R.x0 || x>R.x1 || z<R.z0 || z>R.z1) continue;
    const c=R.cell;
    let i=Math.floor((x-R.x0)/c), j=Math.floor((z-R.z0)/c);
    const nx=Math.round((R.x1-R.x0)/c), nz=Math.round((R.z1-R.z0)/c);
    if(i<0) i=0; if(j<0) j=0; if(i>=nx) i=nx-1; if(j>=nz) j=nz-1;
    const cx0=R.x0+i*c, cz0=R.z0+j*c;
    let holed=false;                                 // this cell was dropped
    for(let k=0;k<R.holes.length;k++){
      const h=R.holes[k];
      if(cx0>=h.x0 && cx0+c<=h.x1 && cz0>=h.z0 && cz0+c<=h.z1){ holed=true; break; }
    }
    if(holed) continue;                              // a finer ring draws it, or nothing does
    const u=Math.min(1,Math.max(0,(x-cx0)/c)), v=Math.min(1,Math.max(0,(z-cz0)/c));
    const ha=Terrain.heightAt(cx0, cz0);
    if(u+v<=1){
      const hb=Terrain.heightAt(cx0+c, cz0), hd=Terrain.heightAt(cx0, cz0+c);
      return ha + (hb-ha)*u + (hd-ha)*v;
    }
    const he=Terrain.heightAt(cx0+c, cz0+c);
    const hb=Terrain.heightAt(cx0+c, cz0), hd=Terrain.heightAt(cx0, cz0+c);
    return he + (hd-he)*(1-u) + (hb-he)*(1-v);
  }
  return Terrain.heightAt(x,z);
}
Terrain.groundAt=groundAt;
