"use strict";
/* LOW DESERT MOTEL · 14h-pool.js
   the old baths: through the fire door at the far end of the stores
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   THE BATHS

   The fire door at the far end of the stores was chained, and somebody cut
   the chain. Behind it is a tiled passage with a drinking fountain that
   has not run in forty years, and at the end of the passage a swimming
   bath: twenty-five metres by twelve, a metre deep at this end and three
   and a half at the other, in a hall of green glazed brick seven metres
   high. There is no water in it. There are chairs in it — school chairs
   and desks, hundreds, heaped into the deep end and spilling up the slope
   as if someone had cleared a building into the one hole big enough to
   take it and then turned the lights off.

   Most of the lights are off. Five of the round ceiling fittings still
   strike, cold, and the ambient down here is cold too (addBuried's tint):
   the green tile, the dark ceiling and the beige basin are the photograph
   this was built from, without its windows, because there is a mesa on top
   of it.

   Wear is applied the way it happens rather than everywhere: water has come
   through the ceiling in three places and run down the walls; tiles are
   missing where a trolley hit them and in a patch the damp lifted; the
   basin is grimy at its corners and along its floor joint; the deck is
   dirtiest at the edges, where nobody walked.

   Same frame as the stores and the hall (mk(-80, 340)), same floor.
   ---------------------------------------------------------------------- */
(function baths(){
  const SX=-80, SZ=340;
  const m=mk(SX,SZ), GY=m.y;
  const W=(x)=>SX+x, Z=(z)=>SZ+z;
  let _s=51713;
  const R=()=>((_s=(_s*16807)%2147483647)-1)/2147483646;
  const pick=a=>a[Math.floor(R()*a.length)];

  /* --- the one page of numbers --------------------------------------- */
  const FY  = -11.40;
  const DOORZ = 15.20;                  // the fire door's centre line (the stores' fourth aisle)
  const OS  = 0.08;                     // slabs oversail outer faces
  // the passage, from the stores' west wall (outer face -178.30) to the hall
  const CX1 = -178.30, CX0=-183.30, CZ0=DOORZ-1.00, CZ1=DOORZ+1.00, CH=2.70, CWT=0.40;
  // the hall
  const QX1 = -183.80, QX0=-216.80, QZ0=5.70, QZ1=24.70, QH=7.60, WT=0.50;
  // the basin, and its floor: shallow flat, slope, deep flat
  const BX1 = -188.30, BX0=-213.30, BZ0=9.20, BZ1=21.20;
  const DS=1.00, DD=3.40, SL1=-197.30, SL0=-203.30;
  const floorAt=x=> x>=SL1 ? FY-DS : x<=SL0 ? FY-DD : FY-DD+(DD-DS)*(x-SL0)/(SL1-SL0);
  // the steps into the shallow end, at its south-east corner
  const STZ0=10.20, STZ1=12.80;

  const TILE="#5f8b78", TILED="#3f6556", TRIM="#1f2a26", CEIL="#4a4640", DECK="#8a8274";
  const BASIN="#cdc2a6", BASINW="#d4cab0", LANE="#2a3036", STONE="#c8bea4";
  const VOL=[W(QX0-WT), W(CX1+0.3), Z(QZ0-WT), Z(QZ1+WT), GY+FY-4.0, GY+FY+QH+0.6];

  const wall=(bk,x0,x1,z0,z1,y0,y1,c,uv)=>{
    m.B(bk, x1-x0, y1-y0, z1-z0, (x0+x1)/2, FY+(y0+y1)/2, (z0+z1)/2, uv||0.833, 0, c);
    m.col(x0, x1, z0, z1, FY+y0-(y0<=0?0.5:0), FY+y1);   // a lintel stops where it is
  };

  /* --- the passage ----------------------------------------------------- */
  {
    // from CX0+OS: the hall's east deck strip oversails to there
    m.B("concrete", (CX1-OS)-(CX0+OS), 0.50, CZ1-CZ0+2*CWT+2*OS, (CX0+CX1)/2, FY-0.25,
        DOORZ, 0.5, 0, "#6e6a62");
    m.P("lino", planeGeo((CX1+0.50)-QX1, CZ1-CZ0, 0.6), (QX1+CX1+0.50)/2, FY+0.006, DOORZ,
        0, "#b8b2a2", -Math.PI/2, 0);
    m.B("concrete", CX1-CX0, 0.50, CZ1-CZ0+2*CWT+2*OS, (CX0+CX1)/2, FY+CH+0.25, DOORZ, 0.5, 0, "#5a564e");
    wall("glazed", CX0, CX1, CZ0-CWT, CZ0, -0.1, CH+0.4, "#c9d2c2");
    wall("glazed", CX0, CX1, CZ1, CZ1+CWT, -0.1, CH+0.4, "#c9d2c2");
    for(const q of [[CZ0, 1],[CZ1, -1]]){
      const ry=q[1]>0?0:Math.PI;
      m.P("glazed", planeGeo(CX1-CX0, 1.10, 0.833), (CX0+CX1)/2, FY+0.55, q[0]+q[1]*0.010, ry, TILE, 0, 0);
      m.P("glazed", planeGeo(CX1-CX0, 0.10, 0.833), (CX0+CX1)/2, FY+1.15, q[0]+q[1]*0.011, ry, TRIM, 0, 0);
    }
    m.P("plaster", planeGeo(CX1-CX0, CZ1-CZ0, 0.5), (CX0+CX1)/2, FY+CH-0.006, DOORZ, 0, "#bdb6a4",
        Math.PI/2, 0);
    m.flat(QX1, CX1+0.3, CZ0, CZ1, FY);
    m.voidAt(QX1, CX1+0.3, CZ0-CWT-0.3, CZ1+CWT+0.3, FY-1.0, FY+CH+0.6, FY);
    // one caged bulkhead, working
    const bx2=(CX0+CX1)/2;
    m.C("metal", 0.10,0.10,0.04,12, bx2, FY+CH-0.02, DOORZ, "#4e4a44");
    m.P("bulkhead", domeGeo(0.085, 0.07, 12), bx2, FY+CH-0.04, DOORZ, 0, "#ffffff");
    m.lamp(bx2, FY+CH-0.25, DOORZ, {color:0xe8f2e8, intensity:0.40, dist:6.0, decay:1.7,
           indoor:true, vol:[W(CX0-1.0), W(CX1+1.5), Z(CZ0-2), Z(CZ1+2), GY+FY-1, GY+FY+CH+1]});
    // a drinking fountain that has not run in forty years, and a sign
    {
      const fx=bx2-1.0, fz=CZ1-0.02;
      m.B("plaster", 0.42, 0.18, 0.30, fx, FY+0.86, fz-0.15, 0.5, 0, "#d8d4c6");
      m.B("plaster", 0.30, 0.04, 0.20, fx, FY+0.96, fz-0.16, 0.5, 0, "#bdb8a8");
      m.C("metal", 0.025,0.035,0.10,8, fx, FY+1.00, fz-0.22, "#9aa1a6");
      m.C("metal", 0.035,0.035,0.62,8, fx, FY+0.46, fz-0.06, "#8a8f92");
      m.P("stain", streakGeo(0.30, 0.60, 0), fx, FY+0.45, fz-0.003, Math.PI, "#5a4a3a", 0, 0);
      m.col(fx-0.24, fx+0.24, fz-0.32, fz, FY, FY+1.0);
    }
    const st=signTex(256,96,(x,w,h)=>{
      x.fillStyle="#e6e0cc"; x.fillRect(0,0,w,h);
      x.fillStyle="#1f3a30"; fitText(x, "SWIMMING BATHS", w*0.86, 34, w/2, 36);
      x.fillStyle="#7a2a22"; fitText(x, "NO RUNNING  ·  NO OUTDOOR SHOES", w*0.86, 18, w/2, 72);
    });
    m.B("paint", 0.92, 0.36, 0.03, bx2+1.2, FY+1.70, CZ0+0.015, 0.4, 0, "#2a2a26");
    signPanel(0.86, 0.32, st, W(bx2+1.2), GY+FY+1.70, Z(CZ0+0.034), 0, false);
  }

  /* --- the hall's shell --------------------------------------------------
     Floor slabs with the basin as a hole in them; the basin's own walls and
     floor below; walls that own their corners; a ceiling. Every outer face
     oversailed, every meeting butted. */
  // the deck: four strips round the hole
  const deck=(x0,x1,z0,z1)=>{
    m.B("concrete", x1-x0, 0.50, z1-z0, (x0+x1)/2, FY-0.25, (z0+z1)/2, 0.5, 0, "#6e6a62");
  };
  deck(QX0-WT-OS, QX1+WT+OS, QZ0-WT-OS, BZ0-0.30);
  deck(QX0-WT-OS, QX1+WT+OS, BZ1+0.30, QZ1+WT+OS);
  deck(QX0-WT-OS, BX0-0.30, BZ0-0.30, BZ1+0.30);
  deck(BX1+0.30, QX1+WT+OS, BZ0-0.30, BZ1+0.30);
  // the deck's surface, the same four strips, stopping at the basin's lip
  const deckTop=(x0,x1,z0,z1)=>{
    m.P("concrete", planeGeo(x1-x0, z1-z0, 0.4), (x0+x1)/2, FY+0.006, (z0+z1)/2, 0, DECK, -Math.PI/2, 0);
    m.flat(x0, x1, z0, z1, FY);
  };
  deckTop(QX0, QX1, QZ0, BZ0-0.30);
  deckTop(QX0, QX1, BZ1+0.30, QZ1);
  deckTop(QX0, BX0-0.30, BZ0-0.30, BZ1+0.30);
  deckTop(BX1+0.30, QX1, BZ0-0.30, BZ1+0.30);
  // walls
  wall("glazed", QX0-WT, QX0, QZ0-WT, QZ1+WT, -0.1, QH+0.4, TILE);       // west, owns corners
  wall("glazed", QX0, QX1+WT, QZ0-WT, QZ0, -0.1, QH+0.4, TILE);          // south
  wall("glazed", QX0, QX1+WT, QZ1, QZ1+WT, -0.1, QH+0.4, TILE);          // north
  wall("glazed", QX1, QX1+WT, QZ0, CZ0, -0.1, QH+0.4, TILE);             // east, either side
  wall("glazed", QX1, QX1+WT, CZ1, QZ1, -0.1, QH+0.4, TILE);             // of the way in
  wall("glazed", QX1, QX1+WT, CZ0, CZ1, CH, QH+0.4, TILE);               // and over it
  // the ceiling, and its tile grid
  m.B("ceil", QX1-QX0+2*WT+2*OS, 0.50, QZ1-QZ0+2*WT+2*OS, (QX0+QX1)/2, FY+QH+0.25, (QZ0+QZ1)/2,
      0.45, 0, CEIL);
  for(let x=QX0+1.2; x<QX1; x+=1.2)
    m.P("soot", planeGeo(0.025, QZ1-QZ0, 0), x, FY+QH-0.004, (QZ0+QZ1)/2, 0, "#141210", Math.PI/2, 0);
  for(let z=QZ0+1.2; z<QZ1; z+=1.2)
    m.P("soot", planeGeo(QX1-QX0, 0.025, 0), (QX0+QX1)/2, FY+QH-0.005, z, 0, "#141210", Math.PI/2, 0);
  m.voidAt(QX0-WT-0.3, QX1+WT, QZ0-WT-0.3, QZ1+WT+0.3, FY-1.0, FY+QH+0.6, FY);

  /* The walls' faces: a darker band to the dado, a black trim course over it
     and again under the ceiling, and a row of vent grilles low down on the
     long walls — the dark slots in the photograph. All planes, a centimetre
     off the brick. */
  const face=(ax, a0, a1, c, n)=>{
    const L=a1-a0, mid=(a0+a1)/2;
    const P=(geo,y,o,col)=> ax==="x"
      ? m.P("glazed", geo, mid, FY+y, c+n*o, n>0?0:Math.PI, col, 0, 0)
      : m.P("glazed", geo, c+n*o, FY+y, mid, n>0?Math.PI/2:-Math.PI/2, col, 0, 0);
    P(planeGeo(L, 1.05, 0.833), 0.525, 0.010, TILED);
    P(planeGeo(L, 0.10, 0.833), 1.10, 0.011, TRIM);
    P(planeGeo(L, 0.10, 0.833), QH-0.35, 0.011, TRIM);
  };
  face("x", QX0, QX1, QZ0, 1);
  face("x", QX0, QX1, QZ1, -1);
  face("z", QZ0, QZ1, QX0, 1);
  face("z", QZ0, CZ0-0.06, QX1, -1);
  face("z", CZ1+0.06, QZ1, QX1, -1);
  for(const zw of [[QZ0, 1],[QZ1, -1]])
    for(let x=QX0+3.0; x<QX1-2.0; x+=3.6)
      m.P("paint", planeGeo(0.62, 0.16, 0), x, FY+0.62, zw[0]+zw[1]*0.013, zw[1]>0?0:Math.PI, "#141816", 0, 0);

  /* --- the basin ------------------------------------------------------- */
  {
    // its walls, from below the floor to the deck slab, in the rock behind
    // the faces you see (the mosaic boxes ARE the visible faces)
    const BW=0.30, by0=FY-DD-0.40, by1=FY-0.50;
    m.B("mosaic", BX1-BX0+2*BW, by1-by0, BW, (BX0+BX1)/2, (by0+by1)/2, BZ0-BW/2, 1.667, 0, BASINW);
    m.B("mosaic", BX1-BX0+2*BW, by1-by0, BW, (BX0+BX1)/2, (by0+by1)/2, BZ1+BW/2, 1.667, 0, BASINW);
    m.B("mosaic", BW, by1-by0, BZ1-BZ0, BX0-BW/2, (by0+by1)/2, (BZ0+BZ1)/2, 1.667, 0, BASINW);
    m.B("mosaic", BW, by1-by0, BZ1-BZ0, BX1+BW/2, (by0+by1)/2, (BZ0+BZ1)/2, 1.667, 0, BASINW);
    // the top half-metre of each, under the deck slab's edge: the deck slab
    // stops 30 cm back from the lip, so the basin wall runs up to the coping
    const cw=(x0,x1,z0,z1)=>m.B("mosaic", x1-x0, 0.50, z1-z0, (x0+x1)/2, FY-0.25, (z0+z1)/2, 1.667, 0, BASINW);
    cw(BX0-BW, BX1+BW, BZ0-BW, BZ0); cw(BX0-BW, BX1+BW, BZ1, BZ1+BW);
    cw(BX0-BW, BX0, BZ0, BZ1); cw(BX1, BX1+BW, BZ0, BZ1);
    // the floor: shallow, slope, deep
    m.B("mosaic", BX1-SL1, 0.40, BZ1-BZ0, (BX1+SL1)/2, FY-DS-0.20, (BZ0+BZ1)/2, 1.667, 0, BASIN);
    m.B("mosaic", SL0-BX0, 0.40, BZ1-BZ0, (BX0+SL0)/2, FY-DD-0.20, (BZ0+BZ1)/2, 1.667, 0, BASIN);
    {
      const th=Math.atan2(DD-DS, SL1-SL0), Ls=Math.hypot(SL1-SL0, DD-DS);
      const cx=(SL0+SL1)/2+0.20*Math.sin(th), cy=FY-(DS+DD)/2-0.20*Math.cos(th);
      m.P("mosaic", boxGeo(Ls+0.02, 0.40, BZ1-BZ0, 1.667), cx, cy, (BZ0+BZ1)/2, 0, BASIN, 0, th);
    }
    // the dark band under the coping, where the water line was
    for(const q of [[BZ0, 1],[BZ1, -1]])
      m.P("mosaic", planeGeo(BX1-BX0, 0.16, 1.667), (BX0+BX1)/2, FY-0.13, q[0]+q[1]*0.006,
          q[1]>0?0:Math.PI, "#33413c", 0, 0);
    for(const q of [[BX0, 1],[BX1, -1]])
      m.P("mosaic", planeGeo(BZ1-BZ0, 0.16, 1.667), q[0]+q[1]*0.006, FY-0.13, (BZ0+BZ1)/2,
          q[1]>0?Math.PI/2:-Math.PI/2, "#33413c", 0, 0);
    // the coping: a pale stone kerb with a rounded nose over the water side
    const cope=(x0,x1,z0,z1,nx,nz)=>{
      m.B("weathered", x1-x0, 0.10, z1-z0, (x0+x1)/2, FY-0.03, (z0+z1)/2, 0.5, 0, STONE);
      const L=nx?z1-z0:x1-x0;
      m.C("weathered", 0.055,0.055,L,10, nx?(nx>0?x1:x0):(x0+x1)/2, FY-0.025,
          nz?(nz>0?z1:z0):(z0+z1)/2, STONE, nx?Math.PI/2:0, 0, nx?0:Math.PI/2);
    };
    cope(BX0-0.30, BX1+0.30, BZ0-0.30, BZ0, 0, 1);
    cope(BX0-0.30, BX1+0.30, BZ1, BZ1+0.30, 0, -1);
    cope(BX0-0.30, BX0, BZ0, BZ1, 1, 0);
    cope(BX1, BX1+0.30, BZ0, BZ1, -1, 0);
    // lane lines on the floor, T-ended, and up the slope
    for(let k=1;k<=5;k++){
      const lz=BZ0+k*2.0;
      m.B("mosaic", BX1-1.6-SL1, 0.006, 0.24, (BX1-1.6+SL1)/2, FY-DS+0.003, lz, 1.667, 0, LANE);
      m.B("mosaic", SL0-(BX0+1.6), 0.006, 0.24, (SL0+BX0+1.6)/2, FY-DD+0.003, lz, 1.667, 0, LANE);
      const th=Math.atan2(DD-DS, SL1-SL0), Ls=Math.hypot(SL1-SL0, DD-DS);
      m.P("mosaic", boxGeo(Ls, 0.006, 0.24, 1.667), (SL0+SL1)/2, FY-(DS+DD)/2+0.003, lz, 0, LANE, 0, th);
      for(const ex of [BX1-1.6, BX0+1.6])
        m.B("mosaic", 0.24, 0.006, 1.0, ex, floorAt(ex)+0.004, lz, 1.667, 0, LANE);
      // and the target on each end wall
      for(const q of [[BX0, 1],[BX1, -1]]){
        const fy=floorAt(q[0]+q[1]*0.5);
        m.P("mosaic", planeGeo(0.24, (FY-0.3)-(fy+0.1), 1.667), q[0]+q[1]*0.004, (fy+0.1+FY-0.3)/2, lz,
            q[1]>0?Math.PI/2:-Math.PI/2, LANE, 0, 0);
        m.P("mosaic", planeGeo(0.80, 0.24, 1.667), q[0]+q[1]*0.005, FY-0.55, lz,
            q[1]>0?Math.PI/2:-Math.PI/2, LANE, 0, 0);
      }
    }
    // the steps into the shallow end: three risers, so two treads and then
    // the floor, and a handrail
    for(let i=0;i<2;i++){
      // each tread's block starts on the one below it; both run from the
      // floor, their ends were the same face twice
      const ty=FY-(i+1)*(DS/3), tx0=BX1-(i+1)*0.36, y0=FY-(i+2)*(DS/3);
      m.B("mosaic", BX1-tx0, ty-y0+0.002, STZ1-STZ0, (tx0+BX1)/2, (ty+y0)/2+0.001,
          (STZ0+STZ1)/2, 1.667, 0, BASIN);
      m.B("mosaic", 0.06, 0.008, STZ1-STZ0, tx0+0.03, ty+0.005, (STZ0+STZ1)/2, 1.667, 0, LANE);
      m.flat(tx0, BX1, STZ0, STZ1, ty);
    }
    for(const z of [STZ0+0.10, STZ1-0.10]){
      m.C("metal", 0.022,0.022,1.10,8, BX1+0.16, FY+0.52, z, "#b8bcbc");
      m.C("metal", 0.022,0.022,1.20,8, BX1-0.45, FY-0.12, z, "#b8bcbc", 0, 0, -0.98);
    }
    // walkable: the shallow floor, the slope (the deep floor is the void's)
    m.flat(SL1, BX1, BZ0, BZ1, FY-DS);
    addRamp(W(SL0), W(SL1), Z(BZ0), Z(BZ1), "x", W(SL0), W(SL1), GY+FY-DD, GY+FY-DS);
    m.voidAt(BX0, BX1, BZ0, BZ1, FY-DD-0.5, FY+QH, FY-DD);
    /* The basin's sides are a wall to anyone standing in it: without these,
       stepping from the shallow floor towards a side wall asked surfaceY
       for the deck's height and lifted you a metre onto it. They stop at
       the deck, so they block nobody walking along the coping. The east
       one leaves the steps open. */
    m.col(BX0-0.3, BX1+0.3, BZ0-0.3, BZ0, FY-DD-0.5, FY);
    m.col(BX0-0.3, BX1+0.3, BZ1, BZ1+0.3, FY-DD-0.5, FY);
    m.col(BX0-0.3, BX0, BZ0, BZ1, FY-DD-0.5, FY);
    m.col(BX1, BX1+0.3, BZ0, STZ0, FY-DD-0.5, FY);
    m.col(BX1, BX1+0.3, STZ1, BZ1, FY-DD-0.5, FY);
    // ladders at the deep end, rails curling over the coping
    for(const z of [BZ0+1.2, BZ1-1.2]){
      const zx=BX0+2.4, zin=z<15?1:-1;
      for(const o of [-0.25,0.25]){
        m.C("metal", 0.021,0.021,2.2,8, zx+o, FY-1.0, z+zin*0.12, "#b8bcbc");
        m.P("metal", new T.TorusGeometry(0.16,0.021,6,10,Math.PI), zx+o, FY+0.10, z-zin*0.04, Math.PI/2,
            "#b8bcbc", 0, 0);
      }
      for(let k=0;k<4;k++) m.B("metal", 0.56, 0.03, 0.08, zx, FY-0.5-k*0.32, z+zin*0.12, 0.4, 0, "#9aa1a4");
      m.P("rust", planeGeo(0.7, 1.4, 0), zx, FY-1.0, z+zin*0.004, z<15?0:Math.PI, "#7a4a2a", 0, 0);
    }
    // depth markings under the coping, both sides, both ends
    const depth=(txt)=>signTex(128,64,(x,w,h)=>{
      x.fillStyle="#d4cab0"; x.fillRect(0,0,w,h);
      x.fillStyle="#2a3036"; fitText(x, txt, w*0.84, 40, w/2, h/2+2);
    });
    const dS=depth("3 FT"), dD=depth("11 FT"), dM=depth("6 FT");
    for(const q of [[BZ0+0.007, 0],[BZ1-0.007, Math.PI]]){
      signPanel(0.44, 0.22, dS, W(BX1-1.2), GY+FY-0.42, Z(q[0]), q[1], false);
      signPanel(0.44, 0.22, dM, W((SL0+SL1)/2), GY+FY-0.42, Z(q[0]), q[1], false);
      signPanel(0.44, 0.22, dD, W(BX0+1.2), GY+FY-0.42, Z(q[0]), q[1], false);
    }
  }

  /* --- what is in it --------------------------------------------------
     School chairs and desks, heaped into the deep end and spilling up the
     slope: a mound highest over the deep floor's middle, every piece
     tumbled any way up. Each chair is eight boxes in its own frame, turned
     as one. */
  {
    const e=new T.Euler(0,0,0,"YXZ"), v=new T.Vector3();
    const gSeat=boxGeo(0.40,0.025,0.38,0.6), gBack=boxGeo(0.38,0.20,0.025,0.6);
    const gLeg=boxGeo(0.022,0.44,0.022,0), gPost=boxGeo(0.022,0.42,0.022,0);
    const gTop=boxGeo(0.62,0.025,0.46,0.6), gDLeg=boxGeo(0.026,0.68,0.026,0), gRack=boxGeo(0.56,0.02,0.36,0);
    const SEATC=["#b8783c","#a8662e","#c48a4c","#7f9a62","#8c9ca6","#c47c3c","#a87a48","#b88a50"];
    const put=(bk,g,ox,oy,oz,cx,cy,cz,rx,ry,rz,col)=>{
      e.set(rx,ry,rz); v.set(ox,oy,oz).applyEuler(e);
      m.P(bk, g, cx+v.x, cy+v.y, cz+v.z, ry, col, rx, rz);
    };
    const chair=(cx,cy,cz,rx,ry,rz)=>{
      const sc=pick(SEATC), fr="#4a4e52";
      put("oak", gSeat, 0,0.44,0, cx,cy,cz, rx,ry,rz, sc);
      put("oak", gBack, 0,0.74,-0.17, cx,cy,cz, rx,ry,rz, sc);
      for(const a of [[-0.17,-0.16],[0.17,-0.16],[-0.17,0.16],[0.17,0.16]])
        put("metal", gLeg, a[0],0.22,a[1], cx,cy,cz, rx,ry,rz, fr);
      for(const sx of [-0.17,0.17]) put("metal", gPost, sx,0.62,-0.18, cx,cy,cz, rx,ry,rz, fr);
    };
    const desk=(cx,cy,cz,rx,ry,rz)=>{
      put("oak", gTop, 0,0.70,0, cx,cy,cz, rx,ry,rz, pick(["#a07a50","#8e6a42","#b08a5a"]));
      put("metal", gRack, 0,0.52,0.02, cx,cy,cz, rx,ry,rz, "#4a4e52");
      for(const a of [[-0.27,-0.19],[0.27,-0.19],[-0.27,0.19],[0.27,0.19]])
        put("metal", gDLeg, a[0],0.35,a[1], cx,cy,cz, rx,ry,rz, "#4a4e52");
    };
    /* The mound: a dome over the deep end that comes up over the deck at
       its middle and is still a metre deep against the
       side walls, running out up the slope towards the shallow end — the
       basin in the photograph is full. What you see of a heap is its
       surface and its open face, so most pieces go in the top metre of it
       and the rest fill the face up the slope. */
    const MX=-206.6, MZ=(BZ0+BZ1)/2;
    const mound=(x,z)=>{
      const dx=(x-MX)/8.6, dz=(z-MZ)/7.6, r2=dx*dx+dz*dz;
      return Math.max(0, 3.7*(1-r2));
    };
    let placed=0;
    for(let i=0;i<2800 && placed<760;i++){
      const x=BX0+0.30+R()*(SL1-1.0-(BX0+0.30)), z=BZ0+0.32+R()*(BZ1-BZ0-0.64);
      const h=mound(x,z); if(h<0.10 && R()<0.85) continue;
      const y=floorAt(x)+Math.max(0.22, h-R()*Math.min(h, x>SL0?h:1.1));
      const tumble=R()<0.8;
      const rx=tumble?(R()-0.5)*Math.PI*2:0, rz=tumble?(R()-0.5)*Math.PI*2:0, ry=R()*Math.PI*2;
      if(R()<0.10) desk(x, y, z, rx, ry, rz); else chair(x, y, z, rx, ry, rz);
      placed++;
    }
    // a few left standing upright on the shallow floor, as if somebody began
    // to set them out in rows and stopped
    for(let k=0;k<7;k++) chair(-194.2+(k%4)*0.70, FY-DS, 15.6+Math.floor(k/4)*0.85, 0, Math.PI*0.5, 0);
    m.col(-194.5, -191.8, 15.3, 16.8, FY-DS, FY-DS+0.9);
    // two folding tables, one on its edge against the heap, and a ladder
    m.P("oak", boxGeo(1.80,0.04,0.76,0.6), -199.4, FY-1.75, 13.4, 0.3, "#8a7a5a", 0, 1.15);
    m.P("oak", boxGeo(1.80,0.04,0.76,0.6), -201.0, FY-1.95, 18.1, -0.5, "#8a7a5a", 0.2, -0.35);
    for(const sd of [-1,1])
      m.P("metal", boxGeo(0.05, 3.2, 0.05, 0), -199.2+sd*0.20, FY-1.2, 11.1, 0.35, "#b0a060", 0, -0.55);
    for(let k=0;k<8;k++)
      m.P("metal", boxGeo(0.44, 0.03, 0.04, 0), -199.2-0.70+k*0.18, FY-2.2+k*0.30*0.84, 11.1, 0.35,
          "#b0a060", 0, -0.55);
    /* The deck has its share, the way the photograph's does: chairs
       stacked against the north wall and strewn by the deep end, a desk on
       its back, a stepladder against the brick, a tall cabinet with its
       door hanging, a cleaning cart and a pile of boxes in the far corner. */
    for(const st of [[-208.6, 23.9, 6],[-207.7, 23.9, 4],[-189.8, 6.5, 5]])
      // each one nests a little off the one under it: square on, their backs
      // were one plane and fought
      for(let k=0;k<st[2];k++) chair(st[0]+k*0.012, FY+k*0.085, st[1]+(st[1]>15?-1:1)*k*0.011, 0, Math.PI, 0);
    m.col(-209.0, -207.3, 23.5, 24.3, FY, FY+1.4);
    m.col(-190.2, -189.4, 6.1, 6.9, FY, FY+1.3);
    // strewn: [x, z, heading, 0 standing | 1 on its side | 2 on its back]
    for(const c of [[-214.8, 9.8, 1.4, 0],[-215.6, 12.4, 2.6, 1],[-214.2, 19.6, 0.8, 2],
                    [-215.2, 21.9, 3.9, 1],[-205.0, 6.9, 2.2, 0],[-199.5, 23.6, 0.4, 2]]){
      if(c[3]===0) chair(c[0], FY, c[1], 0, c[2], 0);
      else if(c[3]===1) chair(c[0], FY+0.20, c[1], 0, c[2], Math.PI/2);
      else chair(c[0], FY+0.21, c[1], -Math.PI/2, c[2], 0);
    }
    desk(-215.0, FY+0.72, 16.8, Math.PI, 0.5, 0);                       // a desk on its back
    m.col(-215.5, -214.5, 16.4, 17.2, FY, FY+0.8);
    // the stepladder against the north wall
    for(const sd of [-1,1])
      m.P("metal", boxGeo(0.05, 2.6, 0.05, 0), -196.0+sd*0.22, FY+1.27, QZ1-0.30, 0, "#b0a060", 0.18, 0);
    for(let k=0;k<7;k++)
      m.B("metal", 0.44, 0.03, 0.06, -196.0, FY+0.30+k*0.34, QZ1-0.30-(1.27-(0.30+k*0.34))*Math.tan(0.18), 0.4, 0, "#b0a060");
    m.col(-196.3, -195.7, QZ1-0.6, QZ1, FY, FY+2.6);
    // a tall cabinet, door hanging open
    m.B("paint", 0.90, 1.95, 0.45, -211.6, FY+0.975, QZ1-0.23, 0.4, 0, "#5f6a62");
    m.P("paint", boxGeo(0.44, 1.85, 0.025, 0.4), -211.0+0.22*Math.cos(1.2), FY+0.98, QZ1-0.46-0.22*Math.sin(1.2),
        1.2, "#5f6a62", 0, 0);
    for(let k=0;k<4;k++) m.B("metal", 0.84, 0.02, 0.40, -211.6, FY+0.30+k*0.42, QZ1-0.24, 0.4, 0, "#4a524c");
    m.col(-212.1, -211.1, QZ1-0.48, QZ1, FY, FY+2.0);
    // a cleaning cart, and boxes in the far corner
    m.B("paint", 0.90, 0.06, 0.50, -192.3, FY+0.86, 22.9, 0.4, 0, "#c8a83a");
    m.B("paint", 0.90, 0.06, 0.50, -192.3, FY+0.30, 22.9, 0.4, 0, "#c8a83a");
    for(const a2 of [[-0.42,-0.22],[0.42,-0.22],[-0.42,0.22],[0.42,0.22]])
      m.B("metal", 0.03, 0.86, 0.03, -192.3+a2[0], FY+0.53, 22.9+a2[1], 0, 0, "#8a8f92");
    m.C("bin", 0.16,0.13,0.36,12, -192.6, FY+1.07, 22.9, "#3a5a6a");
    m.col(-192.8, -191.8, 22.6, 23.2, FY, FY+1.2);
    for(let k=0;k<7;k++){
      const bx2=-215.6+(k%3)*0.52+(R()-0.5)*0.05, bz2=23.8-Math.floor(k/3)*0.0, by2=FY+0.21+Math.floor(k/3)*0.42;
      m.B("bin", 0.48, 0.42, 0.58, bx2, by2, bz2, 0.6, (R()-0.5)*0.2, pick(["#a8845a","#9c7a50","#b39064"]));
    }
    m.col(-216.0, -214.0, 23.4, 24.3, FY, FY+1.3);
    // the heap is solid to walk into; the shallow end is not
    m.col(BX0, SL1-1.0, BZ0, BZ1, FY-DD, FY+0.6);
    /* Grime, where an empty basin collects it: along the joint of floor and
       wall, in the corners, and in runs down the walls under every gutter
       outlet. A few, not a wash over everything. */
    for(const q of [[BZ0+0.25, 0],[BZ1-0.25, Math.PI]])
      for(let k=0;k<3;k++){
        const x=SL1+0.8+k*2.8;
        m.P("stain", streakGeo(2.6, 0.55, 0), x, FY-DS+0.008+k*0.0006, q[0], q[1], "#4a3e2c", -Math.PI/2, 0);
      }
    for(const q of [[BZ0, 1],[BZ1, -1]])
      for(let x=BX1-2.0; x>SL1; x-=2.6)
        m.P("stain", streakGeo(0.30, DS-0.25, 0), x, FY-0.6, q[0]+q[1]*0.008, q[1]>0?0:Math.PI, "#5a4a36", 0, 0);
    for(const c of [[BX1-0.5, BZ0+0.5],[BX1-0.5, BZ1-0.5]])
      m.P("stain", streakGeo(1.2, 1.2, 0), c[0], FY-DS+0.0095, c[1], 0.7, "#3e3426", -Math.PI/2, 0);
    // and what puddles in the bottom of an empty pool: dark water, leaves
    m.P("puddle", puddleGeo(1.25, 0.85, 3), -191.6, FY-DS+0.012, 18.4, 0.4, "#1e2826", 0, 0);
    m.P("puddle", puddleGeo(0.45, 0.30, 7), -190.1, FY-DS+0.012, 17.5, 1.1, "#1e2826", 0, 0);
    m.P("stain", streakGeo(3.6, 2.8, 0), -191.4, FY-DS+0.010, 18.2, 0.4, "#3a3024", -Math.PI/2, 0);
    for(let i=0;i<22;i++)
      m.P("paper", planeGeo(0.06, 0.04, 0), -193.0+R()*3.2, FY-DS+0.014+i*0.0005, 17.2+R()*2.6, R()*6,
          pick(["#6a5a3a","#7a6440","#5a4a30"]), -Math.PI/2, 0);
  }

  /* --- the deck -------------------------------------------------------- */
  {
    // a lifeguard's chair, north side, half way down, its seat split
    const lx=-201.0, lz=BZ1+1.6;
    for(const a of [[-0.32,-0.32],[0.32,-0.32],[-0.32,0.32],[0.32,0.32]])
      m.P("oak", boxGeo(0.06, 2.0, 0.06, 0), lx+a[0]*0.8, FY+1.0, lz+a[1]*0.8, 0, "#9a8462",
          -a[1]*0.12, a[0]*0.12);
    m.B("oak", 0.62, 0.05, 0.50, lx, FY+1.92, lz, 0.5, 0, "#a08a66");
    m.B("oak", 0.60, 0.50, 0.05, lx, FY+2.20, lz+0.26, 0.5, 0, "#a08a66");
    for(let k=0;k<5;k++) m.B("oak", 0.56, 0.04, 0.06, lx, FY+0.35+k*0.34, lz-0.34, 0.5, 0, "#8a7452");
    m.col(lx-0.4, lx+0.4, lz-0.4, lz+0.4, FY, FY+2.4);
    // the diving board's pedestal at the deep end, and the board, snapped
    const dx=BX0-1.6, dz=(BZ0+BZ1)/2;
    m.B("concrete", 1.0, 0.70, 0.80, dx, FY+0.35, dz, 0.5, 0, "#8a8476");
    m.P("oak", boxGeo(2.0, 0.06, 0.50, 0.6), dx+1.1, FY+0.74, dz, 0, "#b8ac90", 0, 0.03);
    m.P("oak", boxGeo(1.3, 0.06, 0.50, 0.6), BX0+0.9, FY-DD+0.55, dz+0.3, 0.3, "#b8ac90", 0, 0.42);
    m.col(dx-0.5, dx+0.5, dz-0.4, dz+0.4, FY, FY+0.8);
    // lockers along the south wall, one open, one on its face
    for(let k=0;k<8;k++){
      const kx=-189.0-k*0.46, kz=QZ0+0.26;
      if(k===5) continue;
      m.B("paint", 0.44, 1.80, 0.46, kx, FY+0.90, kz, 0.4, 0, "#4f6a74");
      m.B("metal", 0.03, 0.12, 0.02, kx+0.14, FY+1.05, kz+0.24, 0, 0, "#9aa1a4");
      for(let v2=0;v2<3;v2++) m.B("paint", 0.30, 0.02, 0.01, kx, FY+1.55+v2*0.05, kz+0.235, 0, 0, "#2a363a");
    }
    m.P("paint", boxGeo(0.44, 1.80, 0.46, 0.4), -191.6, FY+0.23, QZ0+1.25, 0.2, "#4f6a74", -Math.PI/2, 0);
    m.col(-192.5, -188.7, QZ0, QZ0+0.52, FY, FY+1.8);
    m.col(-192.6, -190.6, QZ0+0.8, QZ0+1.7, FY, FY+0.5);
    // the doors to the changing rooms, north wall, neither opening
    for(const q of [[-188.6, "MEN"],[-193.4, "WOMEN"]]){
      m.B("paint", 1.00, 2.10, 0.06, q[0], FY+1.05, QZ1-0.03, 0.4, 0, "#5a3a2a");
      m.B("metal", 1.12, 2.18, 0.04, q[0], FY+1.09, QZ1-0.01, 0.4, 0, "#2e3430");
      m.B("metal", 0.04, 0.14, 0.04, q[0]+0.38, FY+1.0, QZ1-0.08, 0, 0, "#9aa1a4");
      const t=signTex(128,48,(x,w,h)=>{ x.fillStyle="#e6e0cc"; x.fillRect(0,0,w,h);
        x.fillStyle="#1f3a30"; fitText(x, q[1], w*0.8, 30, w/2, h/2+2); });
      signPanel(0.40, 0.15, t, W(q[0]), GY+FY+2.32, Z(QZ1-0.012), Math.PI, false);
    }
    // benches on the east deck, a hose reel, a pile of kickboards, a mop
    for(const bz of [7.4, 22.8]){                       // (along the wall, not into it)
      m.B("oak", 0.36, 0.05, 2.4, QX1-0.22, FY+0.44, bz, 0.5, 0, "#8a6a42");
      for(const o of [-1.0,1.0]) m.B("metal", 0.32, 0.42, 0.05, QX1-0.22, FY+0.21, bz+o, 0, 0, "#3a3e40");
      m.col(QX1-0.42, QX1, bz-1.25, bz+1.25, FY, FY+0.5);
    }
    m.C("metal", 0.30,0.30,0.10,14, QX1-0.08, FY+1.20, 20.0, "#8a2a22", 0, 0, Math.PI/2);
    m.C("tyre", 0.22,0.22,0.12,12, QX1-0.16, FY+1.20, 20.0, "#2a2e2a", 0, 0, Math.PI/2);
    for(let k=0;k<6;k++)
      m.B("plaster", 0.48, 0.035, 0.30, -186.4+(R()-0.5)*0.06, FY+0.02+k*0.036, 8.0+(R()-0.5)*0.06, 0, R()*0.2,
          pick(["#c8d4cc","#d8c8a8","#a8c0c8"]));
    m.C("bin", 0.20,0.17,0.34,12, -187.2, FY+0.17, 7.2, "#c8a83a");
    m.P("oak", boxGeo(0.03, 1.40, 0.03, 0), -186.95, FY+0.62, 7.25, 0, "#8a7452", 0, 0.32);
    // grime: dirtiest at the edges, where nobody walked
    let rung=0;
    for(let i=0;i<18;i++){
      const side=i%4, along=R();
      const x = side<2 ? QX0+0.5+along*(QX1-QX0-1.0) : (side===2?QX0+0.5:QX1-0.5);
      const z = side<2 ? (side===0?QZ0+0.6:QZ1-0.6) : QZ0+0.6+along*(QZ1-QZ0-1.2);
      m.P("stain", streakGeo(1.0+R()*1.6, 0.6+R()*0.6, 0), x, FY+0.012+(rung++%14)*0.0006, z, R()*3,
          "#2e2a22", -Math.PI/2, 0);
    }
  }

  /* --- the walls: water, missing tiles, the red marks ------------------ */
  {
    // where the ceiling has let water through, and it has run down the brick
    for(const q of [[QX0, 1, 11.4],[QX0, 1, 19.6],[0, 0, -195.0]]){
      if(q[1]) m.P("stain", streakGeo(1.4, QH-1.2, 0), q[0]+0.014, FY+QH/2+0.3, q[2], Math.PI/2, "#2c3a30", 0, 0);
      else     m.P("stain", streakGeo(1.6, QH-1.0, 0), q[2], FY+QH/2+0.4, QZ1-0.014, Math.PI, "#2c3a30", 0, 0);
    }
    // tiles gone: a few where a trolley went into them, a patch the damp lifted
    const gone=(ax,c,n,a,y,w,h)=>{
      const ry=ax==="x"?(n>0?0:Math.PI):(n>0?Math.PI/2:-Math.PI/2);
      if(ax==="x") m.P("paint", planeGeo(w,h,0), a, FY+y, c+n*0.015, ry, "#5a5448", 0, 0);
      else         m.P("paint", planeGeo(w,h,0), c+n*0.015, FY+y, a, ry, "#5a5448", 0, 0);
    };
    gone("x", QZ0, 1, -197.2, 0.95, 0.60, 0.20); gone("x", QZ0, 1, -198.0, 0.85, 0.30, 0.10);
    gone("x", QZ1, -1, -205.6, 3.10, 0.90, 0.40); gone("x", QZ1, -1, -205.2, 3.45, 0.60, 0.30);
    gone("z", QX0, 1, 7.6, 0.55, 0.30, 0.20);
    // the red marks: an arch of dashes up and over the far wall above the
    // deep end, like footprints walked up one side and down the other
    const AZc=(QZ0+QZ1)/2, AR=2.6, AY=2.5;
    for(let i=0;i<=22;i++){
      const a=Math.PI*i/22, zz=AZc+Math.cos(a)*AR, yy=AY+Math.sin(a)*AR*1.15;
      m.P("paint", planeGeo(0.10, 0.26, 0), QX0+0.016, FY+yy, zz, Math.PI/2, "#d2402a", 0, -(a-Math.PI/2));
    }
    for(let i=0;i<5;i++)
      for(const sd of [-1,1])
        m.P("paint", planeGeo(0.10, 0.26, 0), QX0+0.016, FY+AY-0.45-i*0.42, AZc+sd*AR, Math.PI/2, "#d2402a", 0, 0);
    // and a sign on the east wall, NO DIVING, in the same red
    const nd=signTex(256,96,(x,w,h)=>{ x.fillStyle="#e2dcc6"; x.fillRect(0,0,w,h);
      x.fillStyle="#b23a2a"; fitText(x, "NO DIVING", w*0.84, 52, w/2, 40);
      x.fillStyle="#1f3a30"; fitText(x, "SHALLOW END · 3 FT", w*0.80, 22, w/2, 78); });
    signPanel(1.10, 0.42, nd, W(QX1-0.012), GY+FY+2.30, Z(10.2), -Math.PI/2, false);
    // a clock over the way in, stopped
    m.C("weathered", 0.25,0.25,0.05,18, QX1-0.03, FY+3.40, DOORZ, "#2a2e2a", 0, 0, Math.PI/2);
    m.P("clockface", new T.CircleGeometry(0.21, 28), QX1-0.057, FY+3.40, DOORZ, -Math.PI/2, "#e6e0cc");
  }

  /* --- the light: round ceiling fittings, five of twenty-four working -- */
  {
    const live=new Set(["1,1","3,0","2,2","4,3","0,2"]);
    for(let i=0;i<6;i++) for(let j=0;j<4;j++){
      const x=QX0+3.3+i*5.3, z=QZ0+2.6+j*4.6, on=live.has(i+","+j);
      m.C("metal", 0.27,0.27,0.04,16, x, FY+QH-0.02, z, "#5a5650");
      m.P(on?"hbcold":"glass", domeGeo(0.22, 0.07, 16), x, FY+QH-0.04, z, 0, on?"#ffffff":"#56584f");
      if(on) m.lamp(x, FY+QH-0.6, z, {color:0xd6efe2, intensity:0.85, dist:15, decay:1.4,
                                     indoor:true, vol:VOL, flicker:(i===4)});
    }
    // and one working bulkhead on the east wall by the way in
    m.B("metal", 0.16, 0.26, 0.10, QX1-0.05, FY+2.9, CZ0-0.6, 0.4, 0, "#4e4a44");
    m.P("bulkhead", new T.SphereGeometry(0.075, 10, 8), QX1-0.13, FY+2.9, CZ0-0.6, 0, "#ffffff");
    m.lamp(QX1-0.5, FY+2.8, CZ0-0.6, {color:0xffdcae, intensity:0.35, dist:7, decay:1.6, indoor:true, vol:VOL});
  }

  addBuried(W(QX0-WT-1.0), W(CX1+0.2), Z(QZ0-WT-1.0), Z(QZ1+WT+1.0), GY+FY-4.5, GY+FY+QH+1.4, 0xb8d6c8);
  addZone(W(QX0), W(QX1), Z(QZ0), Z(QZ1), GY+FY-4, GY+FY+QH, "THE BATHS", true);
  addZone(W(QX1), W(CX1), Z(CZ0), Z(CZ1), GY+FY-1, GY+FY+CH, "THE BATHS", true);
})();
