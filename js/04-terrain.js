"use strict";
/* LOW DESERT MOTEL · 04-terrain.js
   heightfield, LOD grids, the pads cut into it
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   4 · TERRAIN — flat motel pad blended into open desert and a mesa ring
   ---------------------------------------------------------------------- */
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
    {x:-330, z: 430, h: 96, r:190, flat:0.80},
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
    const cut=smoothstep(0, 210-slot*186, boxDist(CORR,x,z));
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
    return dinerPad(x,z, dishPad(x,z, aditCut(x,z,h)));
  }
  return {heightAt:heightAt, fbm:fbm, PAD:PAD, PAD_Y:PAD_Y, ADIT:ADIT, DISH:DISH, DINER:DINER};
})();

const NEAR_SITE={x0:-118, x1:82, z0:-104, z1:74};
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
       from each border node and fills them. Both windings, so it shows
       whichever side the crack opens on.                                  */
    if(skirt){
      const base=P.length/3, border=[];
      for(let i=0;i<=nx;i++) border.push(i);
      for(let j=1;j<=nz;j++) border.push(j*(nx+1)+nx);
      for(let i=nx-1;i>=0;i--) border.push(nz*(nx+1)+i);
      for(let j=nz-1;j>=1;j--) border.push(j*(nx+1));
      for(const v of border){
        P.push(P[v*3], P[v*3+1]-skirt, P[v*3+2]);
        C.push(C[v*3], C[v*3+1], C[v*3+2]);
        U.push(U[v*2], U[v*2+1]);
      }
      for(let k=0;k<border.length-1;k++){
        const a1=border[k], b1=border[k+1], a2=base+k, b2=base+k+1;
        IDX.push(a1,a2,b1, b1,a2,b2, a1,b1,a2, b1,b2,a2);
      }
    }
    const g=new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(P,3));
    g.setAttribute("color",    new T.Float32BufferAttribute(C,3));
    g.setAttribute("uv",       new T.Float32BufferAttribute(U,2));
    g.setIndex(IDX); g.computeVertexNormals();
    const m=new T.MeshStandardMaterial({vertexColors:true, map:TEX.sand, roughness:0.97, metalness:0});
    const mesh=new T.Mesh(g,m); mesh.receiveShadow=true; mesh.name=name;
    scene.add(mesh); return mesh;
  }
  // Three rings: a coarse horizon, a 5 m band across the canyon country where
  // the strata and cliff faces need to read, and a 2 m grid over the site.
  const MID={x0:-1008, x1:1008, z0:-1078, z1:938};
  // The bench is a 4 m step in the ground and the middle ring's 7 m cells
  // would smear it into a dimple, so it gets 2 m cells of its own. Its box is
  // on the 7 m lattice exactly (MID.x0 + 7k, MID.z0 + 7k) so the coarse grid
  // drops precisely those cells and the two meshes meet without a seam.
  const ADIT_SITE={x0:-588, x1:-546, z0:14, z1:56};
  /* A hole is only punched for a cell that falls ENTIRELY inside it, so a
     hole whose edge lands mid-cell leaves the coarse grid covering up to a
     whole cell of ground the fine grid also covers. NEAR_SITE's edges were
     not on the 7 m lattice, so the middle ring overlapped the near one by
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
  const NEAR_G=snapOut(NEAR_SITE, 14, MID.x0, MID.z0);      // 7 m ring, 2 m patch
  grid(-1800,1800,-1740,1860, 24, [MID], "desert-far");
  grid(MID.x0, MID.x1, MID.z0, MID.z1, 7, [NEAR_G, ADIT_SITE], "desert-mid", 6);
  // Half-metre cells here, not two. The cut's back wall is a 4.5 m step and
  // the grid triangle that carries it has to land inside the thickness of the
  // rock face: at 2 m that triangle ramps out of the floor and up through the
  // doorway, which is the sand that was covering the entrance.
  grid(ADIT_SITE.x0, ADIT_SITE.x1, ADIT_SITE.z0, ADIT_SITE.z1, 0.5, [], "desert-adit", 6);
  grid(NEAR_G.x0, NEAR_G.x1, NEAR_G.z0, NEAR_G.z1, 2, [POOL.deck], "desert-near", 6);
})();
