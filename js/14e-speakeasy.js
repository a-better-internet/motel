"use strict";
/* LOW DESERT MOTEL · 14e-speakeasy.js
   the equipment shelter, the shaft, the tunnel and what is at the end of it
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   11e · WHAT IS UNDER THE DESERT
   ----------------------------------------------------------------------
   Walk south past the phone booth for another hundred and forty metres and
   there is a chain-link compound with a flat-roofed concrete hut in it and
   nothing else: no sign that says what it is, a utility number stencilled
   on the door, a meter, a vent, a whip aerial. It is the least interesting
   object in the world, which is the whole point of it. The gate opens. The
   door opens. Behind the door the floor is not there: a flight of two dozen
   steps goes down into the ground, and at the bottom a tunnel runs for the
   better part of seventy metres, lit by caged bulkheads every eight, with
   cable tray down one wall and water marks down the other. And then there
   is a door with brass on it.

   HOW IT IS LAID OUT. Everything is in one local frame, `m`, pinned at the
   compound's centre, so the hut and the fence sit on the real desert while
   the whole underground is at fixed depths below that one point — nothing
   down there has any business asking the terrain anything. The route was
   chosen off a ground probe along its whole length: the corridor box runs
   between 1.25 and 2.74 m of elevation against an origin at 1.95, so a
   tunnel crown at 2.6 m below the origin keeps at least 1.9 m of cover on
   it everywhere, and the room's ceiling keeps more than two.

   WHY IT IS DARK DOWN THERE. The hemisphere light in this scene is the sky
   and the ground bouncing into everything, and the key is the sun; under
   four metres of ground there is neither. Each volume below registers with
   addBuried, which fades both out while the camera is inside it, and the
   fixtures down here are in the "buried" glow kind, which is not on the
   clock. That is what makes the stair a transition: you walk out of the
   noon glare and down into evening, and it stays evening.
   ---------------------------------------------------------------------- */
(function undergroundRoom(){
  const SX=-80, SZ=340;                       // the compound, 144 m south of the booth
  const m=mk(SX, SZ), GY=m.y;
  const W=(x)=>SX+x, Z=(z)=>SZ+z;             // local to world, for zones and volumes

  /* --- the one page of numbers everything else is measured off --------- */
  const F   = 0.16;                           // the hut's slab, over the desert
  const TD  =-4.90;                           // the tunnel floor
  const TH  = 2.34;                           // tunnel clear height
  const TW  = 1.30;                           // tunnel half width
  const TCL = 3.00;                           // tunnel centre-line, in x, for leg A
  const BCL = 44.00;                          // and in z, for leg B
  const RX0 =-53.0, RX1=-34.34, RZ0=37.2, RZ1=50.4;    // the speakeasy
  const AX0 =-34.0, AX1=-26.0, AZ0=40.6, AZ1=47.4;     // the anteroom before it
  /* The speakeasy's wall thickness, declared with the plan rather than
     inside room(), because the ANTEROOM's door reveal is measured off it —
     the wall between the two rooms belongs to the speakeasy and is built
     once, so anything lining the hole through it has to know how thick it
     is. A `const` further down the file is not merely untidy here: the
     anteroom is built BEFORE the room, so it would still be in its
     temporal dead zone and the whole page throws on load. */
  const WT3= 0.34;
  const SWW= 0.26;        // the shaft's own walls; the hut's slab needs it too
  const CX0 =-9.5, CX1=9.5, CZ0=-8.5, CZ1=9.5;         // the compound fence
  const GT0 =-0.75, GT1=0.75;                          // the gate opening, north run
  const HX0 = 1.20, HX1=4.80, HZ0=0.40, HZ1=5.20;      // the hut, outside faces
  const WT  = 0.22, HH=2.95;                           // its wall, its height
  const IX0 =HX0+WT, IX1=HX1-WT, IZ0=HZ0+WT, IZ1=HZ1-WT;
  /* THE DOOR IS IN LINE WITH THE STAIR, and that is not a style choice.
     It was offset a metre west of the shaft, which made the only route from
     the threshold to the stairhead a 58 cm landing you had to walk ALONG —
     and the player is 68 cm across. You could open the door, see the
     flight, and not be able to reach it. A door into a room whose whole
     purpose is one opening goes opposite that opening.
     Two metres of lane the whole way as well: at 1.6 m a crate against one
     wall of the tunnel left 40 cm for the player's centre, which is passable
     arithmetic and an unpleasant squeeze to walk. */
  const DR0 = 2.47, DR1=3.53;                          // the steel door's opening
  const SW0 = 2.00, SW1=4.00;                          // the stair shaft, inside faces
  const RISE= 0.2108, GO=0.295, STEPS=24;              // 5.06 m in twenty-four
  /* THE FLIGHT STARTS AT THE THRESHOLD.
     It used to start 58 cm in, which gave a landing you stood on and a
     stretch of floor between you and the opening — and from the doorway
     that floor is what you see. "The floor is blocking what should be a
     clear opening to the stairs" is a precise description of a landing
     nobody asked for. There is 18 cm of sill now and then the first tread,
     so the moment the door swings the ground is gone.
     Which also means the door has to open OUTWARD: a leaf swinging in over
     a stairwell is the one thing worse than a landing. Plant room doors
     open out anyway. */
  const STOP= 0.80;                                    // where the flight starts
  const SEND= STOP+STEPS*GO;                           // and where it ends

  const CONC="#a6a096", CONCD="#8d877c", GALV="#9aa1a6", GALVD="#7f857f";
  const RUSTY="#7a4a2a";
  const R=n=>((Math.sin(n*91.73+41.3)*43758.5)%1+1)%1;

  /* ====================================================================
     1 · THE COMPOUND
     A fence is a thing you look through, so it goes in as the alpha-mapped
     wire it is rather than as a grey panel, and the posts sample their own
     ground instead of the compound's — over nineteen metres of desert the
     difference is a third of a metre, which is a fence with daylight under
     one end of it.
     ==================================================================== */
  (function compound(){
    const POST=(x,z,h,r)=>{
      const g0=Terrain.groundAt(W(x), Z(z));
      cyl("metal", r||0.055, (r||0.055)*1.15, h+0.5, 8, W(x), g0+h/2-0.25, Z(z), GALVD);
      push("metal", new T.SphereGeometry((r||0.055)*1.25,8,6), W(x), g0+h, Z(z), 0, GALV);
      return g0;
    };
    const FH=2.10;
    // the four runs, with the gate left out of the north one
    const run=(x0,z0,x1,z1,skip)=>{
      const horiz=Math.abs(x1-x0)>Math.abs(z1-z0);
      const a0=horiz?x0:z0, a1=horiz?x1:z1;
      const segs=[];
      if(skip){ segs.push([a0,skip[0]]); segs.push([skip[1],a1]); }
      else segs.push([a0,a1]);
      for(const sg of segs){
        if(sg[1]-sg[0]<0.3) continue;
        const c=(sg[0]+sg[1])/2, L=sg[1]-sg[0];
        const px=horiz?c:x0, pz=horiz?z0:c;
        const g0=Terrain.groundAt(W(px), Z(pz));
        push("chainlink", planeGeo(L, FH, 2.2), W(px), g0+FH/2-0.06, Z(pz),
             horiz?0:Math.PI/2, "#b4b9bc");
        bx("metal", horiz?L:0.05, 0.05, horiz?0.05:L, W(px), g0+FH-0.04, Z(pz), 0, 0, GALV);
        bx("metal", horiz?L:0.04, 0.04, horiz?0.04:L, W(px), g0+FH*0.50, Z(pz), 0, 0, GALVD);
        // barbed wire on a canted arm, which is what says KEEP OUT at distance
        for(let i=0;i<3;i++)
          bx("metal", horiz?L:0.016, 0.016, horiz?0.016:L, W(px)+(horiz?0:-0.10-i*0.09),
             g0+FH+0.14+i*0.15, Z(pz)+(horiz?-0.10-i*0.09:0), 0, 0, GALVD);
        const n=Math.max(2, Math.round(L/2.6));
        for(let i=0;i<=n;i++){
          const a=sg[0]+(sg[1]-sg[0])*i/n;
          const g1=POST(horiz?a:x0, horiz?z0:a, FH, 0.052);
          // the arm the barbed strands are carried out on
          push("metal", boxGeo(0.030,0.46,0.030,0), W(horiz?a:x0),
               g1+FH+0.20, Z(horiz?z0:a), horiz?0:Math.PI/2, GALVD, -0.52, 0);
        }
        /* The collider's foot is the GROUND under that run, not a round
           number. At -2 it reached four metres down, and the tunnel passes
           under the south fence on its way out of the compound — so the
           fence stood across the tunnel as well, invisibly, forty metres
           from the nearest post. Anything buried has to be asked how deep
           it actually goes. */
        if(horiz) addCol(W(sg[0]), W(sg[1]), Z(pz)-0.10, Z(pz)+0.10, g0-1.0, g0+FH+0.4);
        else      addCol(W(px)-0.10, W(px)+0.10, Z(sg[0]), Z(sg[1]), g0-1.0, g0+FH+0.4);
      }
    };
    run(CX0, CZ0, CX1, CZ0, [GT0-0.06, GT1+0.06]);     // north, with the gate in it
    run(CX0, CZ1, CX1, CZ1);
    run(CX0, CZ0, CX0, CZ1);
    run(CX1, CZ0, CX1, CZ1);
    for(const x of [GT0-0.06, GT1+0.06]) POST(x, CZ0, 2.30, 0.075);   // gate posts
    /* The gate itself. makeDoor hangs no collider of its own — it never has
       — so the opening is simply a gap in the fence's collider runs above,
       and the leaf swings through it into the compound. */
    makeDoor(XF(W(GT0+0.03), Z(CZ0), 0), 0, Terrain.groundAt(W(GT0), Z(CZ0))+0.04, 0,
             "THE GATE", true, 0, "gate");
    // and the sign wired to it, which says nothing anybody wants to read
    const sgy=Terrain.groundAt(W(GT1-0.4), Z(CZ0))+1.28;
    bx("paint", 0.52, 0.34, 0.02, W(GT1-0.42), sgy, Z(CZ0)-0.05, 0.4, 0, "#b8b4a2");
    push("art", planeGeo(0.46,0.28,0), W(GT1-0.42), sgy, Z(CZ0)-0.065, Math.PI, "#7a7668", 0, 0);
    for(const q of [[-2.9,-0.5],[3.4,0.3]]){           // tumbleweed caught in the wire
      const g0=Terrain.groundAt(W(q[0]), Z(CZ0+q[1]));
      for(let i=0;i<9;i++)
        push("foliage", boxGeo(0.015,0.40+R(i)*0.3,0.015,0), W(q[0])+R(i+3)*0.3-0.15,
             g0+0.32, Z(CZ0+q[1])+R(i+7)*0.2-0.1, R(i)*3.1, "#8d8459", R(i+1)*1.4-0.7, R(i+2)*1.4-0.7);
    }
    addZone(W(CX0), W(CX1), Z(CZ0), Z(CZ1), GY-3, GY+6, "AN EQUIPMENT SHELTER");
  })();

  /* ====================================================================
     2 · THE HUT
     Poured concrete, a flat roof with a drip, a steel door, a louvre, a
     meter box and a whip aerial. Nothing on it is decorative and nothing
     on it is explained.
     ==================================================================== */
  (function hut(){
    /* THE SLAB HAS THE HOLE IN IT. This is the third time the stairwell has
       been reported blocked and the first time the right thing was looked
       at: the floor above it was correctly built in three pieces round the
       opening, and then the 80 cm mass underneath was poured as ONE box
       across the whole footprint. It filled the shaft from 6 cm under the
       floor down to 86, which buries the first four treads and leaves you
       looking at a continuous surface where the stair should be. A ray
       probe put 64% of the frame on it and did not hit a single tread.
       ANYTHING WITH A HOLE IN IT HAS TO BE BUILT WITH THE HOLE IN IT — the
       flats, the finish AND the mass. The three pieces butt, so none of
       their faces fight, and the shaft's own walls close the two sides of
       the gap they leave.
       The mass also stops 6 cm below the finished floor rather than level
       with it, so the surface you walk on is one layer and the thing under
       it is another. */
    for(const q of [[HX0-0.55, HX1+0.55, HZ0-0.55, STOP-0.15],
                    [HX0-0.55, SW0-SWW, STOP-0.15, HZ1+0.55],
                    [SW1+SWW, HX1+0.55, STOP-0.15, HZ1+0.55]])
      m.B("concrete", q[1]-q[0], 0.80, q[3]-q[2], (q[0]+q[1])/2, F-0.46,
          (q[2]+q[3])/2, 0.45, 0, "#9b948a");
    /* THE APRON IS A RING, NOT A RECTANGLE, and the floor inside is three
       pieces rather than one. A flat laid across the whole footprint is a
       flat across the stairwell as well, and surfaceY takes the highest
       surface it can reach — so you would have walked out over the hole on
       thin air. Anything with a hole in it has to be registered with the
       hole in it. */
    /* THE FLATS OVERLAP; THE CONCRETE BUTTS. addFlat's bounds are strict, so
       two surfaces that merely MEET leave a line with no surface on it, and
       on that line you fall to whatever is underneath — here, the desert,
       21 cm down. walk39 caught it standing in the doorway at z = HZ0
       exactly, which is the one line every visitor crosses. Each flat is
       grown 10 cm into its neighbours; the only edges left un-grown are the
       ones that face the stairwell, because a flat laid over the hole is
       the floor across the opening the user asked us to clear. */
    const OV=0.10;
    for(const q of [[HX0-0.55, HX1+0.55, HZ0-0.55, HZ0+OV],
                    [HX0-0.55, HX1+0.55, HZ1,      HZ1+0.55],
                    [HX0-0.55, HX0+OV,   HZ0,      HZ1],
                    [HX1-OV,   HX1+0.55, HZ0,      HZ1]])
      m.flat(q[0], q[1], q[2], q[3], F);
    for(const q of [[HX0-0.55, HX1+0.55, HZ0-0.55, HZ0],
                    [HX0-0.55, HX1+0.55, HZ1, HZ1+0.55],
                    [HX0-0.55, HX0, HZ0, HZ1],
                    [HX1, HX1+0.55, HZ0, HZ1]])
      m.B("concrete", q[1]-q[0], 0.05, q[3]-q[2], (q[0]+q[1])/2, F-0.025,
          (q[2]+q[3])/2, 0.5, 0, "#9b948a");
    for(const q of [[HX0, HX1, HZ0, STOP, HX0-OV, HX1+OV, HZ0-OV, STOP],
                    [HX0, SW0, STOP, HZ1, HX0-OV, SW0,    STOP-OV, HZ1+OV],
                    [SW1, HX1, STOP, HZ1, SW1,    HX1+OV, STOP-OV, HZ1+OV]])
      if(q[1]-q[0]>0.05){
        m.flat(q[4], q[5], q[6], q[7], F);
        /* THE FLOOR STOPS 4 CM INSIDE THE HUT'S OUTER LINE, on every edge
           that IS that line, and its top sits exactly at F rather than 4 cm
           above it. It used to run out to HX0/HX1/HZ1 and stand proud, so
           its outer faces and the walls' outer faces were the same planes
           and flickered as you turned — the probe found it at x = -75.20.
           Interior edges (the stairwell lip, the sides of the shaft) keep
           their full extent, because there is no wall face there to share
           a plane with and a gap there would be a slot in the floor. */
        const e=0.04;
        const x0=q[0]===HX0?q[0]+e:q[0], x1=q[1]===HX1?q[1]-e:q[1];
        const z0=q[2]===HZ0?q[2]+e:q[2], z1=q[3]===HZ1?q[3]-e:q[3];
        m.B("concrete", x1-x0, 0.05, z1-z0, (x0+x1)/2, F-0.025,
            (z0+z1)/2, 0.5, 0, "#948d83");
      }
    /* The walls start 12 cm BELOW the slab, not level with its top. A wall
       whose underside is the same plane as the thing it stands on is two
       coplanar faces however thick the wall is; sinking its foot into the
       pad is both how it is actually built and the end of that seam. */
    const wall=(x0,x1,z0,z1,c)=> m.B("concrete", x1-x0, HH+0.12, z1-z0, (x0+x1)/2,
                                     F+HH/2-0.06, (z0+z1)/2, 0.42, 0, c||CONC);
    wall(HX0, DR0, HZ0, HZ0+WT);
    wall(DR1, HX1, HZ0, HZ0+WT);
    m.B("concrete", DR1-DR0, HH-2.12, WT, (DR0+DR1)/2, F+2.12+(HH-2.12)/2, HZ0+WT/2,
        0.42, 0, CONC);
    wall(HX0, HX1, HZ1-WT, HZ1);
    wall(HX0, HX0+WT, HZ0+WT, HZ1-WT);
    wall(HX1-WT, HX1, HZ0+WT, HZ1-WT);
    m.col(HX0, DR0, HZ0, HZ0+WT, -1, F+HH);
    m.col(DR1, HX1, HZ0, HZ0+WT, -1, F+HH);
    /* The south wall is a LINTEL over the stair. Its collider ran from a
       metre under the slab the whole way across, and the flight is only
       2.8 m down by the time it passes beneath — so the wall you cannot
       see stood in the middle of the stair and stopped you dead on the
       thirteenth tread. Over the shaft it starts at the soffit instead. */
    m.col(HX0, SW0, HZ1-WT, HZ1, -1, F+HH);
    m.col(SW1, HX1, HZ1-WT, HZ1, -1, F+HH);
    m.col(SW0, SW1, HZ1-WT, HZ1, F-0.50, F+HH);
    m.col(HX0, HX0+WT, HZ0, HZ1, -1, F+HH);
    m.col(HX1-WT, HX1, HZ0, HZ1, -1, F+HH);
    m.col(DR0, DR1, HZ0, HZ0+WT, F+2.12, F+HH);        // over the head
    /* THE REVEAL STRADDLES THE JAMB. It used to sit flush against it —
       0.06 of lining starting exactly at DR0 — so its back face and the
       wall's cut face were the same plane, and two opposite-facing faces on
       one plane flicker. That is the "glitching round the door frames".
       It overlaps the wall by 3 cm now and stands 5 cm proud into the
       opening, which is what a reveal does in a real building; the
       structural opening was widened by the same 10 cm so the clear width
       is unchanged and the leaf still fits it exactly. */
    for(const q of [DR0, DR1]){
      const sd=q===DR0?1:-1;
      m.B("concrete", 0.08, 2.14, WT+0.08, q+sd*0.01, F+1.07, HZ0+WT/2, 0.5, 0, CONCD);
    }
    m.B("concrete", DR1-DR0-0.08, 0.08, WT+0.08, (DR0+DR1)/2, F+2.13, HZ0+WT/2, 0.5, 0, CONCD);
    makeDoor(XF(W(DR0+0.05), Z(HZ0+0.02), 0), 0, GY+F+0.02, 0, "THE SHELTER", false, 0, "steel");
    // roof: a slab with a lip, a drip and forty years of weather on it
    m.B("concrete", HX1-HX0+0.44, 0.22, HZ1-HZ0+0.44, (HX0+HX1)/2, F+HH+0.11, (HZ0+HZ1)/2,
        0.45, 0, "#9c958b");
    m.B("concrete", HX1-HX0+0.52, 0.09, HZ1-HZ0+0.52, (HX0+HX1)/2, F+HH+0.26, (HZ0+HZ1)/2,
        0.45, 0, CONCD);
    /* STREAKS UNDER THE DRIP — AND NOT ACROSS THE DOOR. The north run was
       one 3 m plane 1 cm off the wall, and the closed leaf's outer face sits
       1.25 cm off that same wall: the streak and the door were the same
       plane to within two millimetres, which is the flicker on the door
       itself. The north face gets two narrow runs either side of the opening
       instead, and every run stands 3.5 cm proud so nothing decal-thin can
       ever reach it. */
    const drip=(w,wx,wy,wz,ry)=>push("rust", streakGeo(w, 1.5, 0), wx, wy, wz, ry,
                                     "#6b5a45", 0, 0);
    const DY=GY+F+HH*0.55, DO=0.035;
    for(const q of [-1,1])
      drip(1.6, W((HX0+HX1)/2 + q*((HX1-HX0)/2+DO)), DY, Z((HZ0+HZ1)/2), q*Math.PI/2);
    drip(3.0, W((HX0+HX1)/2), DY, Z(HZ1+DO), 0);
    for(const q of [[HX0+0.52, 1.0],[HX1-0.52, 1.0]])
      drip(q[1], W(q[0]), DY, Z(HZ0-DO), Math.PI);   // facing out, like the wall
    // a vent hood on the south wall, a meter box, a conduit and the aerial
    m.B("metal", 0.70, 0.48, 0.16, 3.4, F+2.05, HZ1+0.06, 0.4, 0, GALV);
    for(let i=0;i<4;i++)
      m.P("metal", boxGeo(0.64,0.045,0.03,0), 3.4, F+1.90+i*0.10, HZ1+0.14, 0, GALVD, -0.40, 0);
    m.B("paint", 0.34, 0.46, 0.20, HX0-0.12, F+1.42, 3.20, 0.4, 0, "#8e9a94");
    m.B("glass", 0.22, 0.20, 0.02, HX0-0.23, F+1.52, 3.20, 0, 0, "#cfe0e6");
    m.C("metal", 0.030,0.030,1.40,6, HX0-0.06, F+0.70, 3.20, GALVD);
    m.C("metal", 0.030,0.030,0.90,6, HX0-0.06, F+1.88, 3.50, GALVD, Math.PI/2);
    m.C("metal", 0.012,0.008,2.20,5, HX1-0.30, F+HH+1.40, HZ1-0.40, "#b8bcbc", 0.03, 0, 0.02);
    m.B("metal", 0.12, 0.20, 0.12, HX1-0.30, F+HH+0.34, HZ1-0.40, 0.4, 0, GALVD);
    // the stencilled number, and the one lamp over the door
    push("art", planeGeo(0.52, 0.15, 0), W(4.20), GY+F+1.76, Z(HZ0-0.012), Math.PI, "#6e6a5c", 0, 0);
    m.B("metal", 0.26, 0.09, 0.22, (DR0+DR1)/2, F+2.42, HZ0-0.10, 0.4, 0, GALVD);
    m.P("bulkhead", new T.SphereGeometry(0.075,10,8), (DR0+DR1)/2, F+2.355, HZ0-0.14,
        0, "#ffe6bc");
    m.lamp((DR0+DR1)/2, F+2.30, HZ0-0.20,
           {color:0xffd9a0, intensity:0.30, dist:7.0, decay:1.6, mothy:true});
    // a dead junction box and a coil of cable, OUTSIDE — the hut is a
    // stairhead and there is no floor in it to leave anything on
    m.B("paint", 0.30, 0.34, 0.18, HX1+0.16, F+0.86, 2.20, 0.4, 0, "#6f7a74");
    for(let i=0;i<7;i++)
      m.P("teal", new T.TorusGeometry(0.26-i*0.012, 0.022, 5, 14), HX0-0.55,
          F+0.05+i*0.045, 1.30, 0, "#3a3a36", Math.PI/2, 0);
  })();

  /* ====================================================================
     3 · THE SHAFT, AND THE FLIGHT DOWN IT
     Twenty-four at 211 by 295, which is a real stair and not a ramp with
     lines on it. The landing is only 58 cm deep on purpose: by the time the
     flight passes under the hut's south wall it is nearly three metres
     down, which is what lets the buried lid sit just under the desert and
     still leave standing headroom. climb37.js walks it.
     ==================================================================== */
  (function shaft(){
    // (the landing and the two strips of floor either side of the hole are
    //  laid with the hut's own slab, above — one owner per surface)
    /* THE WALLS START WHERE THE HUT ENDS.
       They used to run the whole length of the flight, which put a 26 cm
       slab of concrete inside the hut 24 cm behind the door — so the door
       opened onto a wall and the two strips of floor either side of the
       hole were walled off from the room they are in. Inside the hut the
       stair is simply a hole in the floor with a rail round it, which is
       what the thing actually looks like and what makes it read as a
       staircase the moment the door swings. */
    /* The walls are drawn the WHOLE length; it is only the collider that
       changes at the hut's back wall. Stopping the geometry there as well
       left the stairwell open-sided for the four metres that are inside the
       hut — you stood on the landing and looked out through the ground at
       the desert sky, which is a hole in the world of exactly the kind this
       project keeps having to close. Draw the solid; vary the collider. */
    for(const q of [[SW0-SWW, SW0],[SW1, SW1+SWW]])
      m.B("concrete", q[1]-q[0], F-TD+1.1, SEND+1.6-STOP+0.6, (q[0]+q[1])/2,
          (TD-0.9+F)/2, (STOP-0.4+SEND+1.6)/2, 0.42, 0, CONCD);
    // a kerb round the lip of the hole, which is what you see from the door
    /* The kerb used to be exactly as tall as the shaft wall it caps, so
       1.25 m2 of kerb top and wall top were the same plane — right at the
       stairhead, in the first thing you see when the door opens. It stands
       4 cm proud of the wall now and its underside is sunk below the slab,
       so neither of its horizontal faces meets anything. */
    for(const q of [[SW0-SWW, SW0],[SW1, SW1+SWW]])
      m.B("concrete", q[1]-q[0]+0.06, 0.24, HZ1-STOP+0.4, (q[0]+q[1])/2, F+0.02,
          (STOP-0.2+HZ1)/2, 0.5, 0, "#9a948a");
    // the head wall behind the top tread, and the far wall at the bottom
    // between the shaft's own walls, not across their tops: at SW0-SWW..SW1+SWW
    // its top face and theirs were one plane, right at the stairhead.
    m.B("concrete", SW1-SW0, F-TD+1.1, 0.30, (SW0+SW1)/2, (TD-0.9+F)/2, STOP-0.15,
        0.42, 0, CONCD);
    /* THE STAIR. The nosing line is the only thing anything else is
       measured from: the treads hang off it, the soffit is a box laid
       parallel to it, and the rail follows it. Build those three off three
       different numbers and they disagree on the second landing. */
    for(let i=1;i<=STEPS;i++){
      const ty=F-i*RISE, z0=STOP+(i-1)*GO;
      m.B("stairs", SW1-SW0, 0.055, GO+0.03, (SW0+SW1)/2, ty-0.027, z0+GO/2, 0.7, 0,
          i%2 ? "#b4ac9c" : "#b8b0a0");
      /* THE RISER CLOSES THE FACE ABOVE ITS OWN TREAD, not below it. It was
         at ty-RISE/2 — the gap between this tread and the NEXT one down,
         which is behind the tread and can never be seen — so the flight had
         no risers at all and read from above as a ramp. It goes from this
         tread's top to the one above's, at the back of the tread, with both
         ends buried a couple of centimetres inside the treads they meet so
         nothing is coplanar with anything. */
      m.B("concrete", SW1-SW0, RISE+0.01, 0.05, (SW0+SW1)/2, ty+RISE/2-0.025,
          z0-0.015, 0.5, 0, CONCD);
      // wider than the hole it is in, so there is no sliver of nothing
      // down either side of the flight to drop through
      m.flat(SW0-0.10, SW1+0.10, z0-0.03, z0+GO+0.03, ty);
      // the nosing strip, which is the only thing you can see from above
      m.B("metal", SW1-SW0-0.08, 0.012, 0.045, (SW0+SW1)/2, ty+0.004, z0+GO-0.02,
          0.4, 0, "#8e8274");
    }
    m.flat(SW0-0.10, SW1+0.10, SEND-0.04, SEND+1.2, TD);
    m.B("concrete", SW1-SW0+0.1, 0.30, 1.6, (SW0+SW1)/2, TD-0.15, SEND+0.6, 0.5, 0, "#948d83");
    /* THE RAKING SOFFIT, and where it starts.
       Inside the hut the roof over the stair is the hut's own, so the rake
       only covers the length of shaft that is actually buried: from the
       hut's south wall to the bottom landing. It is placed by its two end
       points on the soffit line — 2.42 m above the nosing at each — rather
       than by a centre and a guessed length, because a tilted box put at a
       guessed centre is the one thing in this whole file that cannot be
       checked by eye. */
    {
      const pitch=Math.atan2(RISE, GO);
      const nose=z=>F-((z-STOP)/GO)*RISE;            // the line the treads make
      const za=HZ1, zb=SEND, HEAD=2.42;
      const ya=nose(za)+HEAD, yb=nose(zb)+HEAD;
      const L=Math.hypot(zb-za, ya-yb)+0.5;
      m.P("concrete", boxGeo(SW1-SW0+SWW*2, 0.34, L, 0.45), (SW0+SW1)/2,
          (ya+yb)/2, (za+zb)/2, 0, "#8d877c", pitch, 0);
      // and the skirt that closes the slot under the hut's south wall
      m.B("concrete", SW1-SW0+0.1, 0.60, WT+0.06, (SW0+SW1)/2, F-0.30, HZ1-WT/2,
          0.45, 0, CONCD);
    }
    m.B("concrete", SW1-SW0+SWW*2, 0.34, 1.6, (SW0+SW1)/2, TD+TH+0.17, SEND+0.6,
        0.45, 0, "#8d877c");
    /* A pipe rail round the open side of the hole, which is the only thing
       stopping it reading as a trap. Its collider sits ABOVE the slab only,
       so it guards the hut's floor and leaves the flight itself 92 cm of
       clear lane down the middle. */
    /* Down the two OPEN sides and no further. A rail across the head of a
       stair is a barrier across the way in — which is what the first one
       was, and the walk probe walked into it on the mat. */
    for(const q of [SW0-0.13, SW1+0.13]){
      const L2=HZ1-STOP-0.1, c2=(STOP+0.1+HZ1)/2;
      m.C("metal", 0.026,0.026,L2, 8, q, F+0.98, c2, GALV, Math.PI/2, 0, 0);
      m.C("metal", 0.026,0.026,L2, 8, q, F+0.52, c2, GALVD, Math.PI/2, 0, 0);
      for(const z2 of [STOP+0.14, c2, HZ1-0.15])
        m.C("metal", 0.030,0.030,1.04,8, q, F+0.50, z2, GALV);
      m.col(q-0.07, q+0.07, STOP+0.10, HZ1, F+0.04, F+1.05);
    }
    /* A HANDRAIL ON BOTH WALLS. There was one, on the west side, and the
       east wall carried the conduit instead at 2.08 m above the nosing —
       so from the stairhead one side had a rail at hand height and the
       other had a pipe up by the ceiling, which reads as a railing in the
       wrong place rather than as a service run. Both sides get the same
       rail at the same height now, and the conduit moved into the corner
       where the soffit meets the wall, which is where it would be. */
    for(const sd of [1,-1]){
      const wx=sd>0 ? SW0+0.10 : SW1-0.10, rx=sd>0 ? SW0+0.21 : SW1-0.21;
      for(let i=0;i<=STEPS;i+=3){
        const ty=F-i*RISE, z0=STOP+i*GO;
        m.C("metal", 0.016,0.016,0.22,6, wx, ty+0.78, z0, GALVD, 0, 0, Math.PI/2);
      }
      const pitch=Math.atan2(RISE, GO);
      const L=Math.hypot(SEND-STOP, STEPS*RISE);
      m.P("metal", new T.CylinderGeometry(0.024,0.024,L,8), rx,
          F-(STEPS*RISE)/2+0.86, (STOP+SEND)/2, 0, "#b0b6b4", Math.PI/2+pitch, 0);
    }
    // colliders: the shaft is a slot you cannot step out of sideways
    /* Inside the hut the shaft walls go up to the roof; outside it they
       stop below grade, because past the hut they are buried and anything
       buried that reaches the surface is an invisible wall in open desert —
       here, two of them 1.6 m apart running eight metres out the back. */
    /* Inside the hut the fill is solid up to just under the slab, so you
       cannot step sideways off the flight; it stops 4 cm BELOW the floor so
       the hut's own floor is still walkable over the top of it. Outside,
       where the ground closes over, it stops well under grade — anything
       buried that reaches the surface is an invisible wall in open desert. */
    m.col(SW0-SWW, SW0, STOP-0.4, HZ1, TD-1.0, F+0.04);
    m.col(SW1, SW1+SWW, STOP-0.4, HZ1, TD-1.0, F+0.04);
    m.col(SW0-SWW, SW0, HZ1, SEND+1.6, TD-1.0, F-0.45);
    m.col(SW1, SW1+SWW, HZ1, SEND+1.6, TD-1.0, F-0.45);
    /* The wall under the landing stops at F-0.26, not F-0.05. Its job is
       to stop you walking INTO the fill from halfway down the flight; at
       F-0.05 it also caught the player standing on the very first tread,
       whose feet are at F-0.21 and whose collision band starts four
       centimetres below that. A collider under a stair has to clear the
       first tread's own band, not the floor above it. */
    m.col(SW0-SWW, SW1+SWW, STOP-0.45, STOP-0.15, TD-1.0, F-0.26);
    m.voidAt(SW0, SW1, STOP-0.1, SEND+1.6, TD-1.2, F+0.30, TD);
    addBuried(W(SW0-0.3), W(SW1+0.3), Z(HZ1-0.2), Z(SEND+1.6), GY+TD-1, GY+F-0.6);
    addZone(W(SW0-0.4), W(SW1+0.4), Z(STOP-0.4), Z(SEND+1.2), GY+TD-1, GY+F+0.4,
            "THE STAIR", true);
    // bulkhead lamps down the shaft, caged, every eight steps
    for(const i of [4, 12, 20]){
      const ty=F-i*RISE, z0=STOP+i*GO;
      m.B("metal", 0.10, 0.22, 0.30, SW1-0.02, ty+1.90, z0, 0.4, 0, GALVD);
      m.P("bulkhead", new T.SphereGeometry(0.085,10,8), SW1-0.12, ty+1.90, z0, 0, "#ffe6bc");
      for(let k=0;k<3;k++)
        m.C("metal", 0.009,0.009,0.26,5, SW1-0.12, ty+1.90, z0, GALVD, 0, 0, k*1.05);
      m.lamp(SW1-0.22, ty+1.90, z0,
             {color:0xffdcae, intensity:0.52, dist:7.5, decay:1.5, indoor:true,
              vol:[W(SW0-0.5), W(SW1+0.5), Z(STOP-0.6), Z(SEND+2.3), GY+TD-1.2, GY+F+0.6]});
    }
    // conduit down the wall, and a stencil at the bottom
    {
      const pitch=Math.atan2(RISE, GO);
      const L=Math.hypot(SEND-STOP, STEPS*RISE);
      // 2.30, tight under the soffit line at 2.42, and thinner: at 2.08 it
      // sat out in the middle of the wall at exactly the height a pipe is
      // not, and read as a handrail hung near the ceiling.
      m.P("metal", new T.CylinderGeometry(0.022,0.022,L,6), SW1-0.05,
          F-(STEPS*RISE)/2+2.30, (STOP+SEND)/2, 0, "#8e8274", Math.PI/2+pitch, 0);
      for(let i=2;i<=STEPS;i+=5){                      // on saddles, like a pipe
        const ty=F-i*RISE, z0=STOP+i*GO;
        m.C("metal", 0.012,0.012,0.09,6, SW1-0.02, ty+2.30, z0, GALVD, 0, 0, Math.PI/2);
      }
    }
    push("art", planeGeo(0.40,0.12,0), W(SW0+0.012), GY+TD+1.55, Z(SEND+0.6),
         Math.PI/2, "#6e6a5c", 0, 0);
  })();

  /* ====================================================================
     4 · THE TUNNEL
     Seventy-odd metres in two legs, 1.6 m wide and 2.34 m to the soffit —
     a cable tunnel, which is what anybody looking at the compound on a map
     would assume it was. It is built as one function run twice, because a
     tunnel that turns a corner is two straight tunnels and a box, and
     writing it twice is how the second one ends up 4 cm off the first.
     ==================================================================== */
  const TN0=SW0, TN1=SW1;                       // it keeps the shaft's own width
  const TZ0=SEND+1.2, TZ1=BCL+0.80;             // leg A, running south
  const BZ0=BCL-0.80, BZ1=BCL+0.80;             // leg B, running west
  /* Leg B starts at the OUTER face of the anteroom's east wall, not at its
     inner face. At -26 the tunnel's own side walls ran 30 cm back inside
     the anteroom's, and the two shared their z faces over a third of a
     square metre — which is a seam that flickers right where you walk out
     of the tunnel and look at the door. Walls that meet butt; they do not
     overlap. */
  const BX0=-25.70, BX1=TN0;  // leg B ends at leg A's west wall line
  (function tunnel(){
    const TWW=0.30;
    /* `axis` is the direction of travel: "z" for the leg that runs south,
       "x" for the one that runs west. Everything else — invert, soffit,
       walls, lamps, cable tray, the lot — is written once against it. */
    /* `hole` is the one thing a tunnel that meets another tunnel needs:
       [side, lo, hi] in along-axis coordinates, where side 0 is the c0 wall
       and 1 the c1 wall. Without it the two legs wall each other off at the
       corner and the whole route is a dead end you cannot see the end of. */
    const bore=(axis, a0, a1, c0, c1, seed, hole)=>{
      const mid=(c0+c1)/2, len=a1-a0, mida=(a0+a1)/2;
      const X=(a,c)=>axis==="z" ? c : a, ZZ=(a,c)=>axis==="z" ? a : c;
      // invert and soffit
      m.B("concrete", axis==="z"?(c1-c0+TWW*2):len+TWW*2, 0.32,
          axis==="z"?len:(c1-c0+TWW*2), X(mida,mid), TD-0.16, ZZ(mida,mid), 0.5, 0, "#948d83");
      m.B("concrete", axis==="z"?(c1-c0+TWW*2):len+TWW*2, 0.34,
          axis==="z"?len:(c1-c0+TWW*2), X(mida,mid), TD+TH+0.17, ZZ(mida,mid), 0.45, 0, "#8d877c");
      m.flat(axis==="z"?c0+0.02:a0, axis==="z"?c1-0.02:a1,
             axis==="z"?a0:c0+0.02, axis==="z"?a1:c1-0.02, TD);
      for(let sd=0; sd<2; sd++){
        const q = sd ? [c1, c1+TWW] : [c0-TWW, c0];
        const segs = (hole && hole[0]===sd)
          ? [[a0, hole[1]],[hole[2], a1]].filter(g=>g[1]-g[0]>0.06)
          : [[a0, a1]];
        for(const g of segs){
          const gl=g[1]-g[0], gm=(g[0]+g[1])/2;
          m.B("concrete", axis==="z"?(q[1]-q[0]):gl, TH+1.0, axis==="z"?gl:(q[1]-q[0]),
              X(gm,(q[0]+q[1])/2), TD+TH/2, ZZ(gm,(q[0]+q[1])/2), 0.42, 0, CONCD);
          if(axis==="z") m.col(q[0], q[1], g[0], g[1], TD-1, TD+TH+0.5);
          else           m.col(g[0], g[1], q[0], q[1], TD-1, TD+TH+0.5);
        }
      }
      /* TWO VOIDS THAT MEET HAVE TO OVERLAP, for exactly the reason two
         flats do: voidAt's bounds test is strict, so a point that lands on
         the seam between the shaft and the tunnel, or the tunnel and the
         anteroom, belongs to neither — and the surface under your feet is
         suddenly the desert four metres overhead. It is worse than the flat
         version of this bug, because surfaceY asks voidAt about the height
         you are ALREADY at: one step on the seam puts you on the roof and
         there is no way back down. So every one of them runs 40 cm long. */
      m.voidAt(axis==="z"?c0:a0-0.4, axis==="z"?c1:a1+0.4,
               axis==="z"?a0-0.4:c0, axis==="z"?a1+0.4:c1, TD-1.2, TD+TH+0.2, TD);
      addBuried(W(axis==="z"?c0-0.4:a0-0.4), W(axis==="z"?c1+0.4:a1+0.4),
                Z(axis==="z"?a0-0.4:c0-0.4), Z(axis==="z"?a1+0.4:c1+0.4),
                GY+TD-1, GY+TD+TH+0.4);
      /* The dressing. A concrete tunnel is boring in a way that reads as
         unfinished rather than as plain, so it gets the four things that
         are actually in one: ring joints every couple of metres where the
         pour stopped, cable tray down one side, a water stain down the
         other, and a bulkhead every eight metres with the cable looping
         between them. */
      /* A RING joint is a band round the bore, not a slab across it. This
         was one box the full width and the full height every 2.1 m — a
         concrete sheet 5 cm thick partitioning the tunnel into bays, which
         from inside is a wall two metres in front of you wherever you
         stand, and which you then walk straight through because it carries
         no collider. Three pieces: one down each wall and one under the
         soffit. */
      const n=Math.max(2, Math.round(len/2.1));
      for(let i=0;i<=n;i++){
        const a=a0+len*i/n;
        for(const sd of [-1,1])
          m.B("concrete", axis==="z"?0.07:0.05, TH-0.06, axis==="z"?0.05:0.07,
              X(a, mid+sd*((c1-c0)/2-0.02)), TD+TH/2, ZZ(a, mid+sd*((c1-c0)/2-0.02)),
              0.5, 0, "#9a948a");
        m.B("concrete", axis==="z"?(c1-c0-0.04):0.05, 0.07, axis==="z"?0.05:(c1-c0-0.04),
            X(a,mid), TD+TH-0.04, ZZ(a,mid), 0.5, 0, "#9a948a");
      }
      for(let i=0;i<Math.round(len/0.9);i++){
        const a=a0+0.4+i*0.9, s2=R(seed+i*3);
        if(s2<0.35) continue;
        push("rust", streakGeo(0.5+s2*0.7, TH*0.8, 0), W(X(a,c0+0.015)), GY+TD+TH*0.44,
             Z(ZZ(a,c0+0.015)), axis==="z"?Math.PI/2:0, "#6b5a45", 0, 0);
      }
      // cable tray, on brackets, down the far wall
      for(let i=0;i<Math.round(len/1.6);i++){
        const a=a0+0.8+i*1.6;
        m.B("metal", axis==="z"?0.22:0.05, 0.03, axis==="z"?0.05:0.22,
            X(a,c1-0.11), TD+1.86, ZZ(a,c1-0.11), 0.4, 0, GALVD);
      }
      for(const yy of [1.90, 2.02]){
        m.B("metal", axis==="z"?0.05:len, 0.035, axis==="z"?len:0.05,
            X(mida,c1-0.17), TD+yy, ZZ(mida,c1-0.17), 0.4, 0, GALV);
        m.B("metal", axis==="z"?0.05:len, 0.035, axis==="z"?len:0.05,
            X(mida,c1-0.05), TD+yy, ZZ(mida,c1-0.05), 0.4, 0, GALV);
      }
      for(let k=0;k<4;k++)
        m.P("teal", new T.CylinderGeometry(0.022,0.022,len,6),
            X(mida, c1-0.08-(k<2?0:0.045)), TD+2.065+(k%2)*0.045,
            ZZ(mida, c1-0.08-(k<2?0:0.045)), 0, "#3a3a36",
            axis==="z"?Math.PI/2:0, axis==="z"?0:Math.PI/2);
      // and the lamps
      const nl=Math.max(1, Math.round(len/6.4));
      for(let i=0;i<nl;i++){
        const a=a0+len*(i+0.5)/nl;
        m.B("metal", axis==="z"?0.26:0.12, 0.17, axis==="z"?0.12:0.26,
            X(a,c0+0.06), TD+2.02, ZZ(a,c0+0.06), 0.4, 0, GALVD);
        m.P("bulkhead", new T.SphereGeometry(0.085,10,8), X(a,c0+0.18), TD+2.02,
            ZZ(a,c0+0.18), 0, "#ffe6bc");
        for(let k=0;k<3;k++)
          m.C("metal", 0.009,0.009,0.26,5, X(a,c0+0.18), TD+2.02, ZZ(a,c0+0.18),
              GALVD, 0, 0, k*1.05);
        m.lamp(X(a,c0+0.30), TD+2.00, ZZ(a,c0+0.30),
               {color:0xffdcae, intensity:0.72, dist:12.0, decay:1.35, indoor:true,
                vol:[W(Math.min(TN0,BX0)-1), W(Math.max(TN1,BX1)+1),
                     Z(TZ0-1), Z(Math.max(TZ1,BZ1)+1), GY+TD-1.2, GY+TD+TH+0.6]});
      }
    };
    bore("z", TZ0, TZ1, TN0, TN1, 11, [0, BZ0, BZ1]);   // leg B comes in here
    bore("x", BX0, BX1, BZ0, BZ1, 73);
    // leg A stops at the corner, so it needs an end wall of its own
    m.B("concrete", TN1-TN0+TWW*2, TH+1.0, TWW, (TN0+TN1)/2, TD+TH/2, TZ1+TWW/2,
        0.42, 0, CONCD);
    m.col(TN0-TWW, TN1+TWW, TZ1, TZ1+TWW, TD-1, TD+TH+0.5);
    addZone(W(TN0-0.5), W(TN1+0.5), Z(TZ0-0.5), Z(TZ1+0.5), GY+TD-1, GY+TD+TH+0.5,
            "A SERVICE TUNNEL", true);
    addZone(W(BX0-0.5), W(BX1+0.5), Z(BZ0-0.5), Z(BZ1+0.5), GY+TD-1, GY+TD+TH+0.5,
            "A SERVICE TUNNEL", true);
    /* What somebody left in it over the years. Kept to one side so the
       walking lane stays clear end to end — reach33 floods this, and a
       crate in the middle of a 1.6 m tunnel is a cork. */
    /* Hard against a wall, and the collider says which. Two metres of
       tunnel minus a 52 cm crate minus the player's own 68 leaves 74 cm of
       lane, which is a walk; it was 40, which is a shuffle. */
    const junk=[[2.30, 17.4, "crate"],[3.72, 26.0, "drum"],[2.24, 33.8, "mop"],
                [3.76, 12.6, "ext"],[2.30, 40.2, "crate"]];
    for(let i=0;i<junk.length;i++){
      const q=junk[i], x=q[0], z=q[1];
      if(q[2]==="crate"){
        for(let k=0;k<2;k++)
          m.B("oak", 0.46, 0.26, 0.56, x, TD+0.13+k*0.27, z, 0.5, R(i+k)*0.3-0.15, "#6a5236");
        m.col(x-0.26, x+0.26, z-0.32, z+0.32, TD, TD+0.56);
      }else if(q[2]==="drum"){
        m.C("metal", 0.26,0.26,0.84,14, x, TD+0.42, z, "#7f6a4a");
        for(const yy of [0.22,0.62]) m.C("metal", 0.272,0.272,0.05,14, x, TD+yy, z, "#6a5840");
        m.col(x-0.3, x+0.3, z-0.3, z+0.3, TD, TD+0.86);
      }else if(q[2]==="mop"){
        m.C("oak", 0.016,0.016,1.42,6, x, TD+0.70, z, "#9a8356", 0.10, 0, 0.05);
        m.B("fabric", 0.14, 0.22, 0.09, x-0.02, TD+0.11, z+0.08, 0.5, 0, "#8a8a74");
        m.C("bin", 0.17,0.14,0.30,14, x+0.22, TD+0.15, z-0.30, "#5f6560");
      }else{
        m.C("paint", 0.075,0.075,0.52,12, x, TD+0.72, z, "#b03a2a");
        m.B("metal", 0.07, 0.10, 0.06, x, TD+1.02, z, 0.4, 0, "#9aa1a6");
        m.B("metal", 0.05, 0.26, 0.05, x, TD+0.73, z-0.09, 0.4, 0, GALVD);
      }
    }
    // the puddle at the low point, and the drip that keeps making it
    push("mirror", planeGeo(1.1, 1.5, 0), W(2.9), GY+TD+0.012, Z(31.0), 0.2,
         "#4a5250", -Math.PI/2, 0);
    push("soot", planeGeo(1.5, 1.9, 0), W(2.9), GY+TD+0.008, Z(31.0), 0.2,
         "#6e6558", -Math.PI/2, 0);
  })();

  /* ====================================================================
     5 · THE ANTEROOM, AND THE DOOR
     The tunnel stops being a tunnel here: a square room with a tiled floor,
     a bench, a hat shelf, one good lamp — and a black lacquer door with
     brass on it, which is the first thing down here that anybody chose.
     ==================================================================== */
  const DZ0=BCL-0.55, DZ1=BCL+0.55;             // the deco door's opening
  (function anteroom(){
    const WT2=0.30;
    m.B("concrete", AX1-AX0+WT2*2, 0.32, AZ1-AZ0+WT2*2, (AX0+AX1)/2, TD-0.16,
        (AZ0+AZ1)/2, 0.5, 0, "#948d83");
    m.flat(AX0, AX1, AZ0, AZ1, TD);
    // a chequered floor, because somebody wanted you to know you had arrived
    for(let i=0;i<Math.ceil((AX1-AX0)/0.62);i++)
      for(let k=0;k<Math.ceil((AZ1-AZ0)/0.62);k++){
        const px=AX0+0.31+i*0.62, pz=AZ0+0.31+k*0.62;
        if(px>AX1-0.1 || pz>AZ1-0.1) continue;
        m.P("dinertile", planeGeo(0.60,0.60,0), px, TD+0.012, pz, 0,
            (i+k)%2 ? "#2e2a28" : "#b6ae9a", -Math.PI/2, 0);
      }
    /* Walls on three sides only. The fourth — the one with the door in it
       — is the speakeasy's own east wall, built once in section 6 and
       standing between the two rooms. Two walls on the same plane is the
       oldest mistake in this file's family and it buzzes. */
    const aw=(x0,x1,z0,z1)=> m.B("plaster", x1-x0, 3.00, z1-z0, (x0+x1)/2, TD+1.50,
                                 (z0+z1)/2, 0.42, 0, "#5e4238");
    aw(AX0, AX1+WT2, AZ0-WT2, AZ0);
    aw(AX0, AX1+WT2, AZ1, AZ1+WT2);
    aw(AX1, AX1+WT2, AZ0, BZ0);  aw(AX1, AX1+WT2, BZ1, AZ1);
    m.B("plaster", WT2, 3.00-TH, BZ1-BZ0, AX1+WT2/2, TD+TH+(3.00-TH)/2, (BZ0+BZ1)/2,
        0.42, 0, "#5e4238");
    m.B("concrete", AX1-AX0+WT2*2, 0.34, AZ1-AZ0+WT2*2, (AX0+AX1)/2, TD+3.17,
        (AZ0+AZ1)/2, 0.45, 0, "#3a2e28");
    m.col(AX0, AX1+WT2, AZ0-WT2, AZ0, TD-1, TD+3.2);
    m.col(AX0, AX1+WT2, AZ1, AZ1+WT2, TD-1, TD+3.2);
    m.col(AX1, AX1+WT2, AZ0, BZ0, TD-1, TD+3.2);
    m.col(AX1, AX1+WT2, BZ1, AZ1, TD-1, TD+3.2);
    m.voidAt(AX0-0.5, AX1+0.5, AZ0, AZ1, TD-1.2, TD+3.1, TD);
    addBuried(W(AX0-0.4), W(AX1+0.4), Z(AZ0-0.4), Z(AZ1+0.4), GY+TD-1, GY+TD+3.4);
    addZone(W(AX0), W(AX1), Z(AZ0), Z(AZ1), GY+TD-1, GY+TD+3.3, "THE ANTEROOM", true);
    // the reveal round the door, lined in oak, and the door itself
    /* THE REVEAL IS CENTRED ON THE WALL IT LINES, not on a number of its
       own. The wall between the anteroom and the room is the speakeasy's,
       0.34 thick from RX1 to RX1+0.34; the reveal was built 0.30 deep off
       AX0 and its far face landed exactly on the wall's, which is two
       surfaces on one plane and flickers from the length of the tunnel.
       Lining a hole means standing PROUD of the thing you are lining, on
       both faces, every time. */
    const RVC=RX1+WT3/2, RVD=WT3+0.10;
    for(const q of [DZ0, DZ1]){
      const sd=q===DZ0?1:-1;        // straddling the jamb, not flush with it
      m.B("oak", RVD, 2.24, 0.09, RVC, TD+1.12, q+sd*0.005, 0.5, 0, "#4a3426");
    }
    m.B("oak", RVD, 0.09, DZ1-DZ0+0.16, RVC, TD+2.26, (DZ0+DZ1)/2, 0.5, 0, "#4a3426");
    m.B("brass", 0.05, 0.05, DZ1-DZ0+0.22, RX1-0.04, TD+2.33, (DZ0+DZ1)/2, 0.4, 0, "#c9a24a");
    makeDoor(XF(W(AX0-0.17), Z(DZ0+0.02), -Math.PI/2), 0, GY+TD+0.02, 0,
             "THE DRY WELL", true, 0, "deco");
    // the brass plate beside it, and the lamp over it
    m.B("brass", 0.03, 0.17, 0.30, AX0+0.015, TD+1.52, DZ1+0.34, 0.4, 0, "#c9a24a");
    push("art", planeGeo(0.24,0.12,0), W(AX0+0.040), GY+TD+1.52, Z(DZ1+0.34),
         Math.PI/2, "#7a6228", 0, 0);
    m.B("brass", 0.26, 0.10, 0.34, AX0+0.14, TD+2.52, (DZ0+DZ1)/2, 0.4, 0, "#b08f3e");
    m.P("sconce", planeGeo(0.22, 0.30, 0), AX0+0.145, TD+2.46, (DZ0+DZ1)/2,
        Math.PI/2, "#ffd9a0", 0.5, 0);
    m.lamp(AX0+0.42, TD+2.40, (DZ0+DZ1)/2,
           {color:0xffcf8a, intensity:0.88, dist:9.0, decay:1.5, indoor:true,
            vol:[W(AX0-0.5), W(AX1+0.5), Z(AZ0-0.5), Z(AZ1+0.5), GY+TD-1, GY+TD+3.4]});
    /* The bench goes on the SOUTH wall. It was against the east one,
       centred — which is to say dead in the mouth of the tunnel you arrive
       through, a 2 m bench across a 1.6 m opening. A room with one way in
       and one way out has exactly two walls you may put furniture on. */
    const BNX=(AX0+AX1)/2+0.6, BNZ=AZ1-0.30;
    m.B("oak", 2.00, 0.08, 0.46, BNX, TD+0.46, BNZ, 0.6, 0, "#4a3426");
    m.B("leather", 1.96, 0.10, 0.44, BNX, TD+0.54, BNZ, 0.5, 0, "#5e2420");
    for(const q of [-0.80, 0.80])
      m.B("oak", 0.09, 0.44, 0.38, BNX+q, TD+0.23, BNZ, 0.5, 0, "#3e2c20");
    m.col(BNX-1.05, BNX+1.05, BNZ-0.26, AZ1, TD, TD+0.60);
    addSeat(W(BNX), Z(BNZ-0.06), GY+TD+0.56, Math.PI, "A BENCH");
    m.B("oak", 2.00, 0.05, 0.30, BNX, TD+1.86, AZ1-0.22, 0.6, 0, "#4a3426");
    for(let i=0;i<4;i++)
      m.C("brass", 0.012,0.012,0.10,6, BNX-0.75+i*0.50, TD+1.80, AZ1-0.14,
          "#c9a24a", Math.PI/2);
    m.C("brass", 0.16,0.17,0.56,12, AX0+0.52, TD+0.28, AZ0+0.52, "#9c7c34");
    for(let i=0;i<3;i++)
      m.C("oak", 0.014,0.014,0.86,6, AX0+0.52+R(i)*0.10-0.05, TD+0.62, AZ0+0.52+R(i+4)*0.10-0.05,
          "#4a3426", R(i)*0.14-0.07, i, R(i+2)*0.14-0.07);
    // a runner from the tunnel mouth to the door, worn down the middle
    m.P("carpet", boxGeo(AX1-AX0-1.4, 0.016, 1.30, 0.6), (AX0+AX1)/2-0.1, TD+0.022, BCL,
        0, "#6a3430", 0, 0);
    m.P("stain", streakGeo(AX1-AX0-2.0, 0.80, 0), (AX0+AX1)/2-0.1, TD+0.034, BCL,
        0, "#6e6558", -Math.PI/2, 0);
  })();

  /* ====================================================================
     6 · THE DRY WELL
     ----------------------------------------------------------------------
     Nineteen metres by thirteen, four and a half under the desert. Oak to
     the sill and warm plaster above it, a dark red ceiling with the joists
     and the ductwork left showing, lamplight at head height and nothing
     overhead — which is the whole trick of the rooms this is drawn from:
     every light in here is BELOW eye level or on a wall, so the floor and
     the faces are lit and the ceiling stays as dark as the desert it is
     under.

     You come in on a platform and go down three steps into it, because
     arriving above a room and then descending into it is worth more than
     any amount of furniture. The long run of buttoned velvet is on the
     north wall with the low tables and the stump stools in front of it;
     the bar is the whole of the south; the snug in the north-west corner
     is done in oxblood hide and gold frames and is up two steps again, so
     it reads as a different room without being one.
     ==================================================================== */
  const RD=TD-0.65, RH=3.18;
  /* THE SECOND DOOR, in the west wall beside the piano. What is behind it
     is built in 14f; all that belongs here is the hole, and the hole has to
     be cut through every course the wall is made of — the mass, the
     collider, the oak lining and the plaster above it. Every time one of
     those has been forgotten the door has been "blocked", so they are all
     listed together here rather than each near its own course. */
  /* 1.20 STRUCTURAL FOR A 1.06 LEAF. The reveals straddle the jambs and so
     stand 4.5 cm proud into the opening on each side; a 1.10 structural
     opening would have left 1.00 of clear width for a 1.06 door, which is
     the arithmetic that blocks a doorway without anybody drawing a wall
     across it. Clear width is the structural opening MINUS what you line
     it with. */
  const PZ0=44.75, PZ1=45.95;                       // the opening, in z
  const PHD=2.24;                                   // and how high it goes
  const PLX=RX1-2.90;                               // the entry platform's edge
  const SB0=42.70, SB1=45.30;                       // the stair bay, in z
  const BARX0=-48.6, BARX1=-38.6, BARZ=48.45;       // the counter
  const BQX0=-48.6, BQX1=-38.4, BQZ=37.30;          // the banquette run
  const SNX0=RX0, SNX1=-49.20, SNZ0=37.30, SNZ1=44.20, SNR=0.42;   // the snug
  const OAKD="#4a3426", OAKM="#6b4a2c", PLAS="#7a5c3c", CEIL="#4a2420";
  const OX="#5e2420", OXD="#471a18", VEL="#6e5a3a", BR="#c9a24a", BRD="#8e6f2e";
  const RVOL=[W(RX0-0.6), W(RX1+0.6), Z(RZ0-0.6), Z(RZ1+0.6), GY+RD-1, GY+RD+RH+0.6];

  (function room(){
    /* ---- the box ---------------------------------------------------- */
    m.B("concrete", RX1-RX0+WT3*2, 0.40, RZ1-RZ0+WT3*2, (RX0+RX1)/2, RD-0.20,
        (RZ0+RZ1)/2, 0.5, 0, "#948d83");
    // the floor: one plank plane at world scale, with worn boards over it
    m.P("plank", planeGeo(RX1-RX0, RZ1-RZ0, 0.42), (RX0+RX1)/2, RD+0.01, (RZ0+RZ1)/2,
        0, "#9a7a52", -Math.PI/2, 0);
    /* Each worn board gets its OWN height, a fifth of a millimetre apart.
       Twenty-six of them at one height meant every pair that happened to
       cross was exactly coplanar — the same mistake as the wall stains, in
       the floor. A fifth of a millimetre is fifteen times the depth
       buffer's resolution at this range and nothing you could measure. */
    for(let i=0;i<26;i++)
      m.P("plank", planeGeo(1.4+R(i)*3.0, 0.19, 0.42), RX0+1.0+R(i+3)*(RX1-RX0-2.0),
          RD+0.014+i*0.00022, RZ0+0.8+R(i+9)*(RZ1-RZ0-1.6), 0,
          R(i)<0.5?"#7d6241":"#a98a5e", -Math.PI/2, 0);
    m.flat(RX0, RX1, RZ0, RZ1, RD);
    // the platform you arrive on, and the three steps off it
    /* THE WORST SEAM IN THE WHOLE PLACE WAS HERE. The platform's concrete
       mass topped out at TD+0.01 and the boards that cover it were laid at
       TD+0.01 as well — thirty-eight square metres of two surfaces on one
       plane, which is the shimmer you see standing at the top of the steps
       looking into the room. The mass stops 2 cm short; the boards are the
       floor. A slab and its finish are never the same height. */
    m.B("concrete", RX1-PLX, 0.64, RZ1-RZ0, (PLX+RX1)/2, RD+0.32, (RZ0+RZ1)/2,
        0.5, 0, "#8d877c");
    m.P("plank", planeGeo(RX1-PLX, RZ1-RZ0, 0.42), (PLX+RX1)/2, TD+0.01, (RZ0+RZ1)/2,
        0, "#8d7049", -Math.PI/2, 0);
    m.flat(PLX, RX1, RZ0, RZ1, TD);
    for(let i=1;i<=3;i++){
      const tx=PLX-i*0.32, ty=TD-i*0.2167;
      m.B("oak", 0.34, 0.06, SB1-SB0, tx+0.17-0.17, ty-0.03, (SB0+SB1)/2, 0.6, 0, OAKM);
      m.B("oak", 0.05, 0.22, SB1-SB0, tx+0.325, ty-0.11, (SB0+SB1)/2, 0.5, 0, OAKD);
      m.flat(tx-0.02, tx+0.34, SB0+0.03, SB1-0.03, ty);
    }
    m.B("oak", 0.06, 0.70, RZ1-RZ0, PLX-0.03, TD-0.35, (RZ0+RZ1)/2, 0.5, 0, OAKD);
    // a balustrade along the platform, broken for the steps
    for(const g of [[RZ0+0.1, SB0],[SB1, RZ1-0.1]]){
      m.B("oak", 0.09, 0.09, g[1]-g[0], PLX+0.04, TD+0.92, (g[0]+g[1])/2, 0.5, 0, OAKD);
      for(let i=0;i<Math.round((g[1]-g[0])/0.26);i++)
        m.C("brass", 0.018,0.018,0.88,8, PLX+0.04, TD+0.46, g[0]+0.13+i*0.26, BRD);
      m.col(PLX-0.02, PLX+0.12, g[0], g[1], TD, TD+1.0);
    }
    for(const q of [RZ0+0.1, SB0, SB1, RZ1-0.1])
      m.C("brass", 0.034,0.034,1.00,10, PLX+0.04, TD+0.50, q, BR);
    /* ---- walls: oak to the sill, plaster over, joists overhead -------- */
    const DADO=1.16;
    const wallRun=(x0,x1,z0,z1)=>{
      m.B("concrete", x1-x0, RH+0.65, z1-z0, (x0+x1)/2, RD+(RH+0.65)/2, (z0+z1)/2,
          0.42, 0, "#8d877c");
    };
    wallRun(RX0-WT3, RX1+WT3, RZ0-WT3, RZ0);
    wallRun(RX0-WT3, RX1+WT3, RZ1, RZ1+WT3);
    wallRun(RX0-WT3, RX0, RZ0, PZ0);
    wallRun(RX0-WT3, RX0, PZ1, RZ1);
    m.B("concrete", WT3, RH+0.65-PHD, PZ1-PZ0, RX0-WT3/2, RD+PHD+(RH+0.65-PHD)/2,
        (PZ0+PZ1)/2, 0.42, 0, "#8d877c");
    wallRun(RX1, RX1+WT3, RZ0, DZ0);
    wallRun(RX1, RX1+WT3, DZ1, RZ1);
    m.B("concrete", WT3, RH+0.65-2.22-0.65, DZ1-DZ0, RX1+WT3/2, TD+2.22+(RH-2.22)/2,
        (DZ0+DZ1)/2, 0.42, 0, "#8d877c");
    m.col(RX0-WT3, RX1+WT3, RZ0-WT3, RZ0, RD-1, RD+RH+0.6);
    m.col(RX0-WT3, RX1+WT3, RZ1, RZ1+WT3, RD-1, RD+RH+0.6);
    m.col(RX0-WT3, RX0, RZ0, PZ0, RD-1, RD+RH+0.6);
    m.col(RX0-WT3, RX0, PZ1, RZ1, RD-1, RD+RH+0.6);
    m.col(RX0-WT3, RX0, PZ0, PZ1, RD+PHD, RD+RH+0.6);
    m.col(RX1, RX1+WT3, RZ0, DZ0, RD-1, RD+RH+0.6);
    m.col(RX1, RX1+WT3, DZ1, RZ1, RD-1, RD+RH+0.6);
    m.col(RX1, RX1+WT3, DZ0, DZ1, TD+2.22, RD+RH+0.6);
    /* WHICH WAY A WALL LINING FACES.
       A PlaneGeometry's normal is +z and `ry` turns it, so the direction it
       looks is (sin ry, 0, cos ry) — and the direction it has to look is
       INTO the room. The north wall is at the small-z end here, so the room
       is on its +z side and its lining is ry = 0; the apartment's north
       wall in 10-office.js has the room on its -z side and takes pi, which
       is how the two came to be written the same and be opposite. The cap
       rail and anything else standing proud of the lining is offset ALONG
       that same normal rather than by a hand-written sign, so the two can
       never disagree again. */
    let _wr=0;
    const WR=n=>((Math.sin((n+(_wr+=0.37))*41.7+7.13)*43758.5)%1+1)%1;
    const line=(ry, px, pz, a0, a1, base)=>{
      const L=a1-a0, c=(a0+a1)/2, flat=(ry===0||Math.abs(ry)>3);
      const X2=flat?c:px, Z2=flat?pz:c;
      const nx=Math.sin(ry), nz=Math.cos(ry);
      m.P("oak", planeGeo(L, DADO-0.10, 1.9), X2, base+(DADO-0.10)/2+0.10, Z2, ry, OAKM, 0, 0);
      /* 0.55, not 1.2. At 1.2 a nineteen-metre wall carried twenty-three
         repeats of a fine plaster mottle, which reads as patterned
         wallpaper rather than as a wall. Halving it doubles the feature
         size; what actually kills the tiling is the tonal work below,
         which lays irregular soft patches over the whole run so no two
         metres of it are the same brightness. */
      m.P("plaster", planeGeo(L, RH-DADO-0.10, 0.55), X2, base+DADO+(RH-DADO-0.10)/2, Z2,
          ry, PLAS, 0, 0);
      /* AGE ON IT. A repeating map is only obvious while nothing else is
         happening on the surface. Eleven soft blooms per run at different
         sizes, a couple of damp streaks off the ceiling line, and the eye
         stops reading the tile and starts reading the wall. */
      /* TWO THINGS WERE WRONG WITH THESE PATCHES, and they are the same
         fault twice. They all carried the whole of TEX.soot, which is one
         centred blob, so eleven damp patches were eleven copies of one
         circle ending on one square edge — "the same cut off repeating
         texture". And they all sat 12 mm off the wall, so wherever two of
         them overlapped they were EXACTLY coplanar and fought: the probe
         found 0.23 m2 of it on the east wall alone. So: each patch is a
         different crop of the stain field, and each sits at its own
         distance from the plaster, 8 mm out to 25 mm, which is under the
         cap rail and ends the fighting for good. */
      for(let i=0;i<11;i++){
        const t=(i+0.5)/11, u=a0+L*(t+(WR(i)-0.5)*0.12);
        const w2=0.8+WR(i+3)*2.6, h2=0.5+WR(i+7)*1.3;
        const yy=base+DADO+0.15+WR(i+5)*(RH-DADO-0.7);
        const o=0.008+i*0.0016;
        m.P("stain", streakGeo(w2, h2, 0), flat?u:X2+nx*o, yy, flat?Z2+nz*o:u,
            ry, WR(i+2)<0.45 ? "#56402a" : "#6b5236", 0, 0);
      }
      // damp coming down out of the ceiling line, where it always comes from
      for(let i=0;i<3;i++){
        const u=a0+L*((i+0.35+WR(i+13)*0.4)/3);
        const h3=0.9+WR(i+17)*1.5, w3=0.30+WR(i+19)*0.52;
        const yy=base+RH-0.16-h3/2, o=0.0268+i*0.0014;
        m.P("stain", streakGeo(w3, h3, 0), flat?u:X2+nx*o, yy, flat?Z2+nz*o:u,
            ry, "#4e3a26", 0, 0);
      }
      m.B("oak", flat?L:0.07, 0.09, flat?0.07:L, X2+nx*0.035, base+DADO+0.045,
          Z2+nz*0.035, 0.4, 0, OAKD);
      m.B("oak", flat?L:0.06, 0.13, flat?0.06:L, X2+nx*0.025, base+0.065,
          Z2+nz*0.025, 0.4, 0, OAKD);
    };
    line(0, 0, RZ0+0.02, RX0+0.05, RX1-0.05, RD);                          // north
    line(Math.PI, 0, RZ1-0.02, RX0+0.05, RX1-0.05, RD);                    // south
    for(const g of [[RZ0+0.05, PZ0-0.12],[PZ1+0.12, RZ1-0.05]])            // west,
      line(Math.PI/2, RX0+0.02, 0, g[0], g[1], RD);                        // round the door
    m.P("oak", planeGeo(PZ1-PZ0+0.24, RH-PHD, 1.9), RX0+0.02, RD+PHD+(RH-PHD)/2,
        (PZ0+PZ1)/2, Math.PI/2, OAKM, 0, 0);
    /* The reveal STRADDLES each jamb — 9 cm of lining across a line, not 8
       butted up against it. Flush, its back face and the wall's cut face
       are one plane and the frame flickers; this is the rule the shelter
       door had to learn in round 40 and it applies to every opening. */
    for(const q of [PZ0, PZ1]){
      const sd=q===PZ0?1:-1;
      m.B("oak", WT3+0.10, 2.32, 0.09, RX0-WT3/2, RD+1.16, q+sd*0.005, 0.5, 0, "#4a3426");
    }
    m.B("oak", WT3+0.10, 0.09, PZ1-PZ0+0.16, RX0-WT3/2, RD+PHD+0.02, (PZ0+PZ1)/2,
        0.5, 0, "#4a3426");
    m.B("brass", 0.05, 0.05, PZ1-PZ0+0.22, RX0-0.04, RD+PHD+0.09, (PZ0+PZ1)/2,
        0.4, 0, "#c9a24a");
    makeDoor(XF(W(RX0-0.12), Z(PZ1-0.07), Math.PI/2), 0, GY+RD+0.02, 0,
             "THE AUDITORIUM", false, 0, "deco");
    // the lamp over it, so the second door reads as a way out rather than a panel
    m.B("brass", 0.26, 0.10, 0.34, RX0-0.14, RD+PHD+0.30, (PZ0+PZ1)/2, 0.4, 0, "#b08f3e");
    m.P("sconce", planeGeo(0.22, 0.30, 0), RX0-0.145, RD+PHD+0.24, (PZ0+PZ1)/2,
        -Math.PI/2, "#ffd9a0", 0.5, 0);
    m.lamp(RX0-0.42, RD+PHD+0.18, (PZ0+PZ1)/2,
           {color:0xffcf8a, intensity:0.80, dist:8.0, decay:1.5, indoor:true, vol:RVOL});
    for(const g of [[RZ0+0.05, DZ0-0.12],[DZ1+0.12, RZ1-0.05]])            // east, round the door
      line(-Math.PI/2, RX1-0.02, 0, g[0], g[1], TD);
    m.P("oak", planeGeo(DZ1-DZ0+0.24, RH-2.30, 1.9), RX1-0.02, TD+2.30+(RH-2.30)/2,
        (DZ0+DZ1)/2, -Math.PI/2, OAKM, 0, 0);
    // the ceiling: dark boards, joists across, one duct and a sprinkler run
    m.B("plank", RX1-RX0, 0.10, RZ1-RZ0, (RX0+RX1)/2, RD+RH+0.05, (RZ0+RZ1)/2,
        0.42, 0, CEIL);
    for(let i=0;i<Math.round((RX1-RX0)/0.92);i++)
      m.B("plank", 0.11, 0.21, RZ1-RZ0, RX0+0.46+i*0.92, RD+RH-0.11, (RZ0+RZ1)/2,
          0.5, 0, "#3e1e1c");
    m.C("metal", 0.30,0.30,RX1-RX0-1.0, 10, (RX0+RX1)/2, RD+RH-0.40, 46.1, "#5a2e28",
        0, 0, Math.PI/2);
    for(let i=0;i<Math.round((RX1-RX0)/2.3);i++)
      m.C("metal", 0.33,0.33,0.07,10, RX0+1.1+i*2.3, RD+RH-0.40, 46.1, "#4e2824",
          0, 0, Math.PI/2);
    m.C("teal", 0.030,0.030,RX1-RX0-1.0, 6, (RX0+RX1)/2, RD+RH-0.26, 40.6, "#5a2e28",
        0, 0, Math.PI/2);
    m.voidAt(RX0, RX1+0.5, RZ0, RZ1, RD-1.2, RD+RH+0.2, RD);
    addBuried(W(RX0-0.5), W(RX1+0.5), Z(RZ0-0.5), Z(RZ1+0.5), GY+RD-1, GY+RD+RH+0.5);
    addZone(W(RX0), W(RX1), Z(RZ0), Z(RZ1), GY+RD-1, GY+RD+RH+0.3, "THE DRY WELL", true);
  })();

  /* ---- the bar, the whole of the south wall -------------------------- */
  (function bar(){
    const CW=0.70, TOPY=RD+1.12, L=BARX1-BARX0, CX=(BARX0+BARX1)/2;
    m.B("oak", L, TOPY-0.10, CW, CX, RD+(TOPY-0.10)/2, BARZ+CW/2, 0.6, 0, OAKD);
    // the panelled front, which is what you actually look at from a stool
    for(let i=0;i<Math.round(L/1.05);i++){
      const px=BARX0+0.52+i*1.05;
      m.B("oak", 0.92, 0.70, 0.04, px, RD+0.56, BARZ-0.02, 0.5, 0, OAKM);
      m.B("oak", 0.80, 0.56, 0.03, px, RD+0.56, BARZ-0.04, 0.5, 0, "#5a3a24");
    }
    m.B("oak", L, 0.16, 0.06, CX, RD+0.08, BARZ-0.02, 0.5, 0, OAKD);
    m.B("oak", L+0.24, 0.07, CW+0.34, CX, TOPY+0.035, BARZ+CW/2-0.10, 0.7, 0, "#7a4a28");
    m.P("oak", new T.CylinderGeometry(0.035,0.035,L+0.24,10), CX, TOPY+0.035, BARZ-0.27,
        0, "#8a5630", 0, Math.PI/2);                     // the bullnose edge
    m.P("brass", new T.CylinderGeometry(0.030,0.030,L,10), CX, RD+0.19, BARZ-0.19,
        0, BR, 0, Math.PI/2);                            // and the foot rail
    for(let i=0;i<=Math.round(L/2.2);i++)
      m.B("brass", 0.05, 0.22, 0.05, BARX0+i*(L/Math.round(L/2.2)), RD+0.10, BARZ-0.19,
          0.4, 0, BRD);
    m.col(BARX0-0.14, BARX1+0.14, BARZ-0.30, BARZ+CW+0.10, RD, TOPY+0.10);
    /* The back bar. A mirror the length of it, three shelves, and enough
       bottles that the row reads as a row — ninety-odd cylinders in one
       bucket is one draw call and it is the single thing that makes a bar
       look like a bar rather than like a counter. */
    const BB=RZ1-0.36;
    m.B("oak", L+0.4, 0.92, 0.62, CX, RD+0.46, BB-0.10, 0.6, 0, OAKD);
    m.B("oak", L+0.5, 0.06, 0.70, CX, RD+0.95, BB-0.10, 0.7, 0, "#7a4a28");
    /* The mirror's vertex colour is pulled well down. The bucket carries a
       standing emissive, which in a room with no daylight makes it the
       brightest surface in the world — a sheet of white behind the bottles
       rather than a mirror in a dark bar. Darkening the diffuse leaves the
       emissive doing what it is for: a dull sheen the bottles stand out of. */
    m.P("mirrorw", planeGeo(L-0.3, 1.70, 0), CX, RD+1.95, RZ1-0.035, Math.PI, "#6a5844", 0, 0);
    for(const q of [RD+1.08, RD+2.82])
      m.B("oak", L-0.2, 0.08, 0.10, CX, q, RZ1-0.09, 0.5, 0, OAKD);
    for(let sh=0;sh<3;sh++){
      const sy=RD+1.30+sh*0.52;
      m.B("oak", L-0.3, 0.05, 0.26, CX, sy, RZ1-0.17, 0.6, 0, "#5a3a24");
      for(const br2 of [-0.33,0,0.33])
        m.B("oak", 0.05, 0.50, 0.24, CX+br2*L, sy+0.25, RZ1-0.17, 0.5, 0, OAKD);
      const n=Math.round((L-0.6)/0.115);
      for(let i=0;i<n;i++){
        const px=BARX0+0.35+i*0.115, s2=R(sh*31+i);
        if(s2<0.18) continue;
        const h2=0.22+s2*0.14, col=["#2e4a2a","#5a3a1e","#3a2a46","#7a6a2a","#6a2a24","#2a3a4a"][(i+sh)%6];
        /* The bottles are SOLID, not the glass bucket. At 34% opacity on a
           lit mirror they came out as pale stripes you could see the shelf
           through — a row of ghosts. A full bottle is very nearly opaque,
           and the point of ninety of them is the block of colour. */
        m.C("paint", 0.035,0.040,h2,8, px, sy+0.025+h2/2, RZ1-0.17, col);
        m.C("paint", 0.013,0.013,0.085,6, px, sy+0.025+h2+0.04, RZ1-0.17, col);
        if(s2>0.72) m.P("paper", planeGeo(0.055,0.07,0), px, sy+0.025+h2*0.55, RZ1-0.206,
                        0, "#cfc6ae", 0, 0);
      }
      // and the light that makes the glass worth drawing
      m.P("sconce", planeGeo(L-0.4, 0.05, 0), CX, sy+0.47, RZ1-0.26, 0, "#ffc87a", 1.3, 0);
    }
    for(let i=0;i<4;i++)
      m.lamp(BARX0+1.6+i*2.3, RD+2.10, RZ1-0.5,
             {color:0xffc078, intensity:0.62, dist:8.2, decay:1.6, indoor:true, vol:RVOL});
    // what is on the counter: a till, a soda gun, glasses, a bowl, an ashtray
    m.B("metal", 0.44, 0.34, 0.40, BARX1-0.75, TOPY+0.24, BARZ+0.34, 0.5, 0, "#8a7a56");
    m.B("brass", 0.40, 0.08, 0.32, BARX1-0.75, TOPY+0.45, BARZ+0.34, 0.4, 0, BRD);
    for(let i=0;i<7;i++)
      m.C("glass", 0.038,0.028,0.13,10, BARX0+0.6+i*0.26, TOPY+0.10, BARZ+0.46, "#9aa8a4");
    for(let i=0;i<9;i++)
      m.P("glass", new T.CylinderGeometry(0.040,0.024,0.14,10), BARX0+2.5+(i%5)*0.24,
          TOPY+0.11, BARZ+0.30+((i/5)|0)*0.22, 0, "#a6b4b0", Math.PI, 0);
    m.C("plaster", 0.11,0.09,0.07,14, BARX0+5.2, TOPY+0.07, BARZ+0.30, "#c6bda6");
    m.C("brass", 0.085,0.085,0.030,14, BARX0+6.6, TOPY+0.05, BARZ+0.26, BRD);
    for(let i=0;i<3;i++)
      m.C("paper", 0.008,0.008,0.055,6, BARX0+6.6+R(i)*0.06-0.03, TOPY+0.07,
          BARZ+0.26+R(i+5)*0.06-0.03, "#d8d2c0", 0.4, i*1.3, 0.3);
    // a candle every two metres down the counter, which is most of the light
    for(let i=0;i<5;i++){
      const px=BARX0+0.9+i*2.1;
      m.C("brass", 0.055,0.065,0.040,12, px, TOPY+0.09, BARZ+0.18, BRD);
      m.C("plaster", 0.028,0.028,0.085,10, px, TOPY+0.15, BARZ+0.18, "#e4dcc2");
      m.P("flame", new T.SphereGeometry(0.030,8,6), px, TOPY+0.215, BARZ+0.18, 0, "#ffb55a");
    }
    // the stools
    for(let i=0;i<9;i++){
      const px=BARX0+0.6+i*1.10;
      m.C("brass", 0.21,0.23,0.045,14, px, RD+0.03, BARZ-0.58, BRD);
      m.C("brass", 0.038,0.038,0.66,10, px, RD+0.36, BARZ-0.58, BR);
      m.C("brass", 0.17,0.17,0.028,14, px, RD+0.30, BARZ-0.58, BRD);
      /* A buttoned stool seat is a shallow PAD — a disc with a rolled edge
         and a slight dish in the middle. A whole sphere on a post is a
         mushroom, and nine of them down a bar is a row of mushrooms. */
      m.C("leather", 0.205,0.215,0.085,20, px, RD+0.735, BARZ-0.58, OXD);
      { const g=new T.SphereGeometry(0.195,18,10); g.scale(1, 0.17, 1);
        m.P("leather", g, px, RD+0.785, BARZ-0.58, 0, OX); }
      m.P("brass", new T.TorusGeometry(0.205, 0.013, 6, 20), px, RD+0.735,
          BARZ-0.58, 0, BRD, Math.PI/2, 0);
      for(let k=0;k<4;k++)                                   // the buttons in it
        m.P("brass", new T.SphereGeometry(0.012,8,6), px+Math.cos(k*1.571)*0.085,
            RD+0.800, BARZ-0.58+Math.sin(k*1.571)*0.085, 0, BRD);
      m.P("brass", new T.SphereGeometry(0.013,8,6), px, RD+0.805, BARZ-0.58, 0, BRD);
      m.col(px-0.22, px+0.22, BARZ-0.80, BARZ-0.36, RD, RD+0.70);
      addSeat(W(px), Z(BARZ-0.58), GY+RD+0.82, Math.PI, "THE BAR");
    }
  })();

  /* ---- the velvet run down the north wall ---------------------------- */
  (function banquette(){
    const L=BQX1-BQX0, CX=(BQX0+BQX1)/2, SEATY=RD+0.46;
    m.B("oak", L+0.2, 0.42, 0.22, CX, RD+0.21, BQZ+0.11, 0.6, 0, OAKD);
    m.B("velvet", L, 0.16, 0.78, CX, SEATY-0.08, BQZ+0.58, 0.5, 0, VEL);
    // the buttoned cushion, as a row of pads with a dimple between each
    for(let i=0;i<Math.round(L/0.62);i++){
      const px=BQX0+0.31+i*0.62;
      m.P("velvet", boxGeo(0.58, 0.17, 0.74, 0.5), px, SEATY, BQZ+0.58, 0, "#6a2420", 0, 0);
      const g=new T.SphereGeometry(0.30,12,8); g.scale(0.96,0.22,1.18);
      m.P("velvet", g, px, SEATY+0.035, BQZ+0.58, 0, "#7c2c26", 0, 0);
    }
    /* A PIPED FRONT EDGE down the whole run. Without it the bays read as a
       row of cushions floating over a shadow; the roll is what turns them
       into one piece of furniture with a front to it. */
    m.P("velvet", new T.CylinderGeometry(0.075,0.075,L,12), CX, SEATY+0.04, BQZ+0.94,
        0, "#49120f", 0, Math.PI/2);
    m.B("oak", L, 0.26, 0.10, CX, SEATY-0.17, BQZ+0.92, 0.5, 0, OAKD);
    // the back: three courses of buttoned pads up to the cap rail
    for(let r=0;r<3;r++)
      for(let i=0;i<Math.round(L/0.52);i++){
        const px=BQX0+0.26+i*0.52;
        m.P("velvet", boxGeo(0.48, 0.30, 0.16, 0.5), px, SEATY+0.24+r*0.30, BQZ+0.30,
            0, r%2?"#6a2420":"#5e1c18", 0, 0);
        m.P("brass", new T.SphereGeometry(0.018,8,6), px, SEATY+0.24+r*0.30, BQZ+0.21,
            0, BRD);
      }
    m.B("oak", L+0.14, 0.10, 0.22, CX, SEATY+1.22, BQZ+0.30, 0.5, 0, OAKD);
    m.col(BQX0-0.1, BQX1+0.1, BQZ, BQZ+1.00, RD, RD+0.44);
    for(let i=0;i<5;i++)
      addSeat(W(BQX0+1.0+i*2.05), Z(BQZ+0.62), GY+SEATY+0.12, Math.PI, "THE LONG SEAT");
    /* The low tables, which are the thing the room is actually arranged
       around: 46 cm high, two stump stools on the far side of each, and a
       candle on every one. They line up with the banquette's own bays, not
       with the room, so the whole run reads as one piece of furniture. */
    for(let i=0;i<4;i++){
      const tx=BQX0+1.25+i*2.55, tz=BQZ+1.82;
      m.B("oak", 1.34, 0.07, 0.68, tx, RD+0.44, tz, 0.7, 0, "#7a4a28");
      m.B("oak", 1.20, 0.09, 0.56, tx, RD+0.21, tz, 0.6, 0, OAKD);
      for(const q of [[-1,-1],[1,-1],[-1,1],[1,1]])
        m.B("oak", 0.07, 0.40, 0.07, tx+q[0]*0.58, RD+0.20, tz+q[1]*0.26, 0.5, 0, OAKD);
      m.col(tx-0.72, tx+0.72, tz-0.40, tz+0.40, RD, RD+0.48);
      m.C("brass", 0.050,0.060,0.035,12, tx-0.30, RD+0.50, tz, BRD);
      m.C("plaster", 0.026,0.026,0.10,10, tx-0.30, RD+0.57, tz, "#e4dcc2");
      m.P("flame", new T.SphereGeometry(0.028,8,6), tx-0.30, RD+0.635, tz, 0, "#ffb55a");
      m.C("glass", 0.034,0.026,0.10,10, tx+0.18, RD+0.52, tz-0.14, "#9aa8a4");
      m.C("glass", 0.034,0.026,0.10,10, tx+0.34, RD+0.52, tz+0.12, "#9aa8a4");
      m.P("paper", boxGeo(0.14,0.012,0.18,0.4), tx+0.46, RD+0.485, tz-0.16, 0.3, "#cfc6ae", 0, 0);
      // the stump stools, which are a slice of mesquite and nothing else
      for(const q of [-0.46, 0.46]){
        const sx=tx+q, sz=tz+0.88;
        m.C("oak", 0.21,0.23,0.42,14, sx, RD+0.21, sz, "#7a5a32");
        m.C("oak", 0.225,0.225,0.05,14, sx, RD+0.44, sz, "#8a6a3c");
        m.col(sx-0.24, sx+0.24, sz-0.24, sz+0.24, RD, RD+0.44);
        addSeat(W(sx), Z(sz), GY+RD+0.46, 0, "A STUMP");
      }
    }
  })();

  /* ---- the snug: the one corner done in hide and gold ----------------- */
  (function snug(){
    const SY=RD+SNR, CZ=(SNZ0+SNZ1)/2;
    m.B("oak", SNX1-SNX0, SNR+0.10, SNZ1-SNZ0, (SNX0+SNX1)/2, RD+(SNR-0.10)/2,
        CZ, 0.5, 0, OAKD);
    /* Herringbone, which is the one place in this world it is worth the
       primitive count: a hundred and sixty staves at forty-five degrees,
       all in the plank bucket, one draw call. It is four square metres of
       floor doing the work of a sign that says this corner is different. */
    for(let i=0;i<13;i++)
      for(let k=0;k<13;k++){
        const px=SNX0+0.30+i*0.26, pz=SNZ0+0.30+k*0.50;
        if(px>SNX1-0.12 || pz>SNZ1-0.12) continue;
        for(const q of [0,1])
          m.P("plank", planeGeo(0.52, 0.13, 0.9), px, SY+0.012, pz+q*0.25,
              q?Math.PI/4:-Math.PI/4, q?"#6a4524":"#7d5230", -Math.PI/2, 0);
      }
    m.flat(SNX0, SNX1, SNZ0, SNZ1, SY);
    for(let i=1;i<=2;i++)                                  // two steps up into it
      m.B("oak", 0.30, 0.06, SNZ1-SNZ0-0.6, SNX1+0.15+(2-i)*0.30, RD+i*0.21-0.03,
          CZ, 0.6, 0, "#7a4a28");
    for(let i=1;i<=2;i++)
      m.flat(SNX1+(2-i)*0.30, SNX1+0.32+(2-i)*0.30, SNZ0+0.3, SNZ1-0.3, RD+i*0.21);
    // the partition: panelled to the rail, obscure glass over, open at the end
    m.B("oak", 0.14, 1.26, SNZ1-SNZ0-2.1, SNX1-0.07, SY+0.63, SNZ0+(SNZ1-SNZ0-2.1)/2,
        0.5, 0, OAKD);
    m.B("oak", 0.17, 0.10, SNZ1-SNZ0-2.1, SNX1-0.07, SY+1.31, SNZ0+(SNZ1-SNZ0-2.1)/2,
        0.5, 0, "#7a4a28");
    m.P("glass", planeGeo(SNZ1-SNZ0-2.1, 1.30, 0), SNX1-0.07, SY+2.01,
        SNZ0+(SNZ1-SNZ0-2.1)/2, Math.PI/2, "#8a9a94", 0, 0);
    for(let i=0;i<Math.round((SNZ1-SNZ0-2.1)/0.46);i++)
      m.B("oak", 0.16, 1.32, 0.05, SNX1-0.07, SY+2.00, SNZ0+0.23+i*0.46, 0.5, 0, OAKD);
    m.col(SNX1-0.16, SNX1+0.02, SNZ0, SNZ0+(SNZ1-SNZ0-2.1), RD, SY+2.7);
    // the hide banquette, an L along the west and north walls
    const hide=(x0,x1,z0,z1,back)=>{
      m.B("oak", x1-x0, 0.40, z1-z0, (x0+x1)/2, SY+0.20, (z0+z1)/2, 0.5, 0, OAKD);
      m.B("leather", x1-x0, 0.14, z1-z0, (x0+x1)/2, SY+0.47, (z0+z1)/2, 0.5, 0, OX);
      for(let i=0;i<Math.max(1,Math.round((back==="w"?(z1-z0):(x1-x0))/0.42));i++)
        for(let r=0;r<3;r++){
          const a=0.21+i*0.42;
          const px=back==="w" ? x0+0.10 : x0+a, pz=back==="w" ? z0+a : z0+0.10;
          if(back==="w" ? pz>z1-0.08 : px>x1-0.08) continue;
          m.P("leather", boxGeo(back==="w"?0.16:0.38, 0.28, back==="w"?0.38:0.16, 0.5),
              px, SY+0.70+r*0.28, pz, 0, r%2?OX:OXD, 0, 0);
          m.P("brass", new T.SphereGeometry(0.016,8,6),
              px+(back==="w"?0.09:0), SY+0.70+r*0.28, pz+(back==="w"?0:0.09), 0, BRD);
        }
      m.col(x0, x1, z0, z1, RD, SY+0.46);
    };
    hide(SNX0+0.10, SNX0+0.86, SNZ0+0.10, SNZ1-0.10, "w");
    hide(SNX0+0.86, SNX1-0.50, SNZ0+0.10, SNZ0+0.86, "n");
    addSeat(W(SNX0+0.58), Z(SNZ0+1.30), GY+SY+0.56, -Math.PI/2, "THE SNUG");
    addSeat(W(SNX0+0.58), Z(SNZ0+2.60), GY+SY+0.56, -Math.PI/2, "THE SNUG");
    addSeat(W(SNX0+0.58), Z(SNZ0+3.90), GY+SY+0.56, -Math.PI/2, "THE SNUG");
    addSeat(W(SNX0+1.60), Z(SNZ0+0.58), GY+SY+0.56, Math.PI, "THE SNUG");
    addSeat(W(SNX0+2.50), Z(SNZ0+0.58), GY+SY+0.56, Math.PI, "THE SNUG");
    // the buttoned ottoman they all look at, with a tray on it
    {
      const ox=SNX0+1.70, oz=SNZ0+2.30;
      m.B("oak", 1.26, 0.10, 0.94, ox, SY+0.07, oz, 0.5, 0, OAKD);
      m.B("leather", 1.22, 0.36, 0.90, ox, SY+0.30, oz, 0.5, 0, OX);
      for(let i=0;i<4;i++) for(let k=0;k<3;k++)
        m.P("brass", new T.SphereGeometry(0.018,8,6), ox-0.42+i*0.28, SY+0.485,
            oz-0.28+k*0.28, 0, BRD);
      m.col(ox-0.66, ox+0.66, oz-0.50, oz+0.50, RD, SY+0.50);
      m.B("brass", 0.46, 0.025, 0.34, ox, SY+0.50, oz, 0.5, 0.2, BRD);
      for(let i=0;i<3;i++)
        m.C("glass", 0.033,0.024,0.095,10, ox-0.12+i*0.12, SY+0.56, oz+(i%2)*0.08,
            "#a6b4b0");
      m.C("brass", 0.065,0.070,0.045,12, ox+0.44, SY+0.53, oz-0.22, BRD);
      m.C("plaster", 0.026,0.026,0.09,10, ox+0.44, SY+0.60, oz-0.22, "#e4dcc2");
      m.P("flame", new T.SphereGeometry(0.028,8,6), ox+0.44, SY+0.665, oz-0.22, 0, "#ffb55a");
    }
    /* Gold frames, hung as a block rather than in a line — the reference is
       a wall of photographs somebody added to for thirty years, and the
       thing that makes that read is that they are different sizes and the
       spacing between them is tight. */
    const pics=[[1.10, 1.78, 0.62, 0.44],[1.86, 1.80, 0.52, 0.40],
                [2.58, 1.76, 0.46, 0.36],[1.12, 1.26, 0.40, 0.30],
                [1.74, 1.24, 0.36, 0.28],[2.34, 1.22, 0.44, 0.32],
                [2.96, 1.50, 0.34, 0.46]];
    for(const q of pics){
      m.B("brass", q[2]+0.07, q[3]+0.07, 0.035, SNX0+q[0], SY+q[1], SNZ0+0.035, 0.4, 0, BR);
      m.P("art", planeGeo(q[2], q[3], 0), SNX0+q[0], SY+q[1], SNZ0+0.056, 0,
          "#8a7a5e", 0, 0);
      m.B("brass", q[2]+0.10, 0.03, 0.045, SNX0+q[0], SY+q[1]+q[3]/2+0.055, SNZ0+0.04,
          0.4, 0, BRD);
    }
    for(const q of [[0.70,2.30],[0.70,3.70]]){            // and two on the west wall
      m.B("brass", 0.07, 0.56, 0.44, SNX0+0.035, SY+q[0]+1.0, SNZ0+q[1], 0.4, 0, BR);
      m.P("art", planeGeo(0.38, 0.50, 0), SNX0+0.056, SY+q[0]+1.0, SNZ0+q[1],
          Math.PI/2, "#8a7a5e", 0, 0);
    }
    // picture lights, which is the whole of the light in here
    for(const q of [[1.60, 2.12],[2.70, 2.08]]){
      m.B("brass", 0.34, 0.07, 0.14, SNX0+q[0], SY+q[1], SNZ0+0.16, 0.4, 0, BR);
      m.P("sconce", planeGeo(0.28, 0.10, 0), SNX0+q[0], SY+q[1]-0.04, SNZ0+0.18,
          0, "#ffcf8a", 1.2, 0);
      m.lamp(SNX0+q[0], SY+q[1]-0.12, SNZ0+0.44,
             {color:0xffc078, intensity:0.64, dist:6.2, decay:1.7, indoor:true, vol:RVOL});
    }
    m.lamp(SNX0+0.80, SY+1.90, SNZ0+2.60,
           {color:0xffb86a, intensity:0.58, dist:6.0, decay:1.7, indoor:true, vol:RVOL});
    addZone(W(SNX0), W(SNX1), Z(SNZ0), Z(SNZ1), GY+RD, GY+RD+RH, "THE SNUG", true);
  })();

  /* ---- the middle of the room, the piano, and the light on the walls -- */
  (function dressing(){
    /* Two velvet armchairs and a low table, twice, out in the floor. They
       are turned a few degrees off square on purpose: four chairs set
       parallel to the walls is a waiting room, and the one thing this room
       must not read as is a waiting room. */
    /* THE ARMCHAIR, REBUILT. The old one was a 84x46 cm slab with a short
       panel leaning on the back of it, in a bucket whose map was TEX.carpet
       — a coarse loop pile, which on a chair is camouflage. From across the
       room it was a lump. A chair is read from its SILHOUETTE: legs you can
       see daylight under, arms that stand clear of the seat, a back that is
       taller than the arms and rolls over at the top, and a cushion with a
       front edge. Everything here is one of those four things. */
    const chair=(cx,cz,ry,col,dark)=>{
      const S=(dx,dz)=>[cx+dx*Math.cos(ry)-dz*Math.sin(ry), cz+dx*Math.sin(ry)+dz*Math.cos(ry)];
      const P=(g,dx,y,dz,rx,rz,b,c)=>{ const q=S(dx,dz);
        m.P(b, g, q[0], RD+y, q[1], ry, c, rx||0, rz||0); };
      const D=dark||"#2e1a14";
      // four turned legs, so there is daylight under it
      for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]]){
        const q=S(a[0]*0.36, a[1]*0.34);
        m.C("oak", 0.030,0.042,0.17,10, q[0], RD+0.085, q[1], OAKD);
        m.C("brass", 0.026,0.026,0.022,10, q[0], RD+0.008, q[1], BRD);   // castors
      }
      // the frame rail the upholstery sits in, and the seat box above it
      P(boxGeo(0.86, 0.08, 0.84, 0.5), 0, 0.205, 0, 0, 0, "oak", OAKD);
      P(boxGeo(0.80, 0.16, 0.78, 0.5), 0, 0.325, 0, 0, 0, "velvet", col);
      // the loose cushion: proud at the front, with a piped edge
      P(boxGeo(0.76, 0.17, 0.74, 0.5), 0, 0.485, 0.02, 0, 0, "velvet", col);
      P(new T.CylinderGeometry(0.055,0.055,0.76,10), 0, 0.485, 0.40, 0, Math.PI/2, "velvet", D);
      // arms: a panel each side, standing well clear of the cushion, with a
      // rolled top — the roll is what stops them reading as two more boxes
      for(const q of [-1,1]){
        P(boxGeo(0.15, 0.44, 0.82, 0.5), q*0.385, 0.42, -0.01, 0, 0, "velvet", col);
        P(new T.CylinderGeometry(0.064,0.064,0.86,12), q*0.385, 0.652, -0.01,
          Math.PI/2, 0, "velvet", col);
        // the piping that runs over the roll and down the scroll front
        P(new T.CylinderGeometry(0.020,0.020,0.86,8), q*0.385, 0.706, -0.01,
          Math.PI/2, 0, "velvet", D);
        P(boxGeo(0.13, 0.10, 0.14, 0.4), q*0.385, 0.265, 0.41, 0, 0, "oak", OAKD);
      }
      // the back: taller than the arms, raked, rolled over at the top
      P(boxGeo(0.80, 0.70, 0.17, 0.5), 0, 0.76, -0.355, -0.13, 0, "velvet", col);
      P(new T.CylinderGeometry(0.090,0.090,0.80,12), 0, 1.095, -0.425,
        Math.PI/2, 0, "velvet", col);
      P(boxGeo(0.84, 0.06, 0.07, 0.4), 0, 0.395, -0.40, 0, 0, "oak", OAKD);
      // buttons, on the diamond they are always on
      for(let r2=0;r2<3;r2++) for(let i=0;i<(r2%2?2:3);i++){
        const dx=(r2%2? -0.14+i*0.28 : -0.28+i*0.28), y=0.56+r2*0.17;
        // the back is raked by -0.13, so its front face moves BACK as it rises
        const q=S(dx, -0.270-(y-0.76)*0.13);
        m.P("brass", new T.SphereGeometry(0.017,8,6), q[0], RD+y, q[1], 0, BRD);
      }
      m.col(cx-0.50, cx+0.50, cz-0.50, cz+0.50, RD, RD+0.52);
      addSeat(W(cx), Z(cz+0.04), GY+RD+0.56, ry, "AN ARMCHAIR");
    };
    const lowTable=(tx,tz)=>{
      m.B("oak", 1.16, 0.07, 0.74, tx, RD+0.42, tz, 0.7, 0, "#7a4a28");
      for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
        m.C("oak", 0.035,0.035,0.38,8, tx+a[0]*0.46, RD+0.19, tz+a[1]*0.28, OAKD);
      m.B("oak", 1.04, 0.05, 0.10, tx, RD+0.16, tz, 0.5, 0, OAKD);
      m.col(tx-0.62, tx+0.62, tz-0.42, tz+0.42, RD, RD+0.46);
      m.C("brass", 0.052,0.062,0.038,12, tx-0.26, RD+0.48, tz, BRD);
      m.C("plaster", 0.026,0.026,0.095,10, tx-0.26, RD+0.55, tz, "#e4dcc2");
      m.P("flame", new T.SphereGeometry(0.028,8,6), tx-0.26, RD+0.615, tz, 0, "#ffb55a");
      m.C("brass", 0.085,0.085,0.028,14, tx+0.30, RD+0.46, tz-0.12, BRD);
      m.P("paper", boxGeo(0.17,0.014,0.22,0.4), tx+0.16, RD+0.455, tz+0.20, 0.24, "#cfc6ae", 0, 0);
    };
    // the rugs the groups stand on
    for(const q of [[-44.6, 43.9],[-40.4, 44.6]]){
      m.P("carpet", boxGeo(3.00, 0.018, 2.30, 0.55), q[0], RD+0.022, q[1], 0.1, "#6a3a34", 0, 0);
      m.P("carpet", boxGeo(2.64, 0.012, 1.96, 0.55), q[0], RD+0.034, q[1], 0.1, "#8a5a46", 0, 0);
    }
    lowTable(-44.6, 43.9);
    chair(-45.9, 43.3, -1.05, "#6a2420", "#3a1210");
    chair(-43.4, 44.6,  2.05, "#7a5c24", "#3e2c0e");
    lowTable(-40.4, 44.9);
    chair(-41.7, 44.3, -1.20, "#7a5c24", "#3e2c0e");
    chair(-39.2, 45.6,  1.95, "#6a2420", "#3a1210");
    /* The piano. An upright against the west wall with the lid up, a stool
       pushed in, and a glass left on the top — which is the detail that
       says somebody played it tonight rather than that one is kept here. */
    {
      const px=RX0+0.78, pz=47.3;
      m.B("oak", 0.62, 1.26, 1.52, px, RD+0.63, pz, 0.6, 0, "#4e3220");
      m.B("oak", 0.70, 0.07, 1.60, px, RD+1.29, pz, 0.7, 0, "#5e3a24");
      m.B("oak", 0.30, 0.09, 1.44, px+0.33, RD+0.74, pz, 0.6, 0, "#5e3a24");
      for(let i=0;i<34;i++)                              // the keys
        m.B("plaster", 0.20, 0.022, 0.034, px+0.40, RD+0.785, pz-0.70+i*0.042,
            0.4, 0, "#e8e2d2");
      for(let i=0;i<24;i++){
        const k=[0,1,0,1,1,0,1,0,1,0,1,1][i%12];
        if(!k) continue;
        m.B("paint", 0.13, 0.026, 0.022, px+0.36, RD+0.80, pz-0.66+i*0.059, 0.4, 0, "#241e1c");
      }
      m.B("brass", 0.04, 0.05, 1.30, px+0.33, RD+0.68, pz, 0.4, 0, BRD);
      m.P("oak", boxGeo(0.56, 0.05, 1.50, 0.6), px-0.02, RD+1.42, pz, 0, "#5e3a24", 0, -0.30);
      m.col(px-0.34, px+0.52, pz-0.84, pz+0.84, RD, RD+1.34);
      m.C("oak", 0.20,0.22,0.09,14, px+0.86, RD+0.52, pz, "#5e3a24");
      for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
        m.C("oak", 0.026,0.022,0.50,8, px+0.86+a[0]*0.14, RD+0.24, pz+a[1]*0.14, OAKD);
      m.col(px+0.62, px+1.10, pz-0.24, pz+0.24, RD, RD+0.50);
      addSeat(W(px+0.86), Z(pz), GY+RD+0.58, -Math.PI/2, "THE PIANO");
      m.C("glass", 0.034,0.026,0.11,10, px-0.10, RD+1.38, pz+0.50, "#9aa8a4");
      m.P("paper", boxGeo(0.26,0.014,0.34,0.4), px-0.02, RD+1.34, pz-0.34, 0.14, "#cfc6ae", 0, 0);
      m.lamp(px+0.5, RD+1.80, pz, {color:0xffb86a, intensity:0.52, dist:6.4, decay:1.7,
             indoor:true, vol:RVOL});
      m.B("brass", 0.10, 0.26, 0.30, px-0.18, RD+1.92, pz, 0.4, 0, BR);
      m.P("sconce", planeGeo(0.22, 0.12, 0), px-0.06, RD+1.82, pz, Math.PI/2, "#ffcf8a", 1.1, 0);
    }
    /* ---- the sconces, which are the room's own light ----------------- */
    const sconce=(x,z,ry)=>{
      const nx=Math.sin(ry), nz=Math.cos(ry);
      m.B("brass", 0.08, 0.30, 0.09, x, RD+1.92, z, 0.4, ry, BRD);
      m.P("brass", boxGeo(0.05, 0.34, 0.05, 0), x+nx*0.03, RD+2.12, z+nz*0.03, ry, BR, 0, 0);
      // the shade, open top and bottom, which is why it lights the wall
      // 0.075, not 0.055: the brass stem's own front face is at 0.055 and the
      // shade was laid exactly on it, which made every sconce in the room
      // shimmer. The shade hangs in FRONT of the stem it hangs off.
      m.P("sconce", planeGeo(0.26, 0.30, 0), x+nx*0.075, RD+2.08, z+nz*0.075,
          ry, "#ffab52", 0, 0);
      /* +1.2, not -1.2: a plane's normal is +z and rx of +pi/2 turns it
         DOWN, so the negative sign aimed every open-bottomed shade in this
         room at the ceiling, where nobody can see it. (Floor decals all
         use -pi/2 for exactly the same reason, pointing up.) */
      m.P("sconce", planeGeo(0.26, 0.10, 0), x+nx*0.105, RD+1.94, z+nz*0.105,
          ry, "#ffb24a", 1.2, 0);
      m.lamp(x+nx*0.30, RD+2.02, z+nz*0.30,
             {color:0xffb86a, intensity:0.78, dist:8.0, decay:1.55, indoor:true, vol:RVOL});
    };
    for(const x of [-46.8, -43.2, -39.6]) sconce(x, RZ0+0.08, 0);         // over the velvet
    for(const x of [-47.4, -43.6, -39.8]) sconce(x, RZ1-0.08, Math.PI);   // over the bar
    sconce(RX0+0.08, 41.2,  Math.PI/2);
    sconce(RX1-0.08, 40.0, -Math.PI/2);
    sconce(RX1-0.08, 48.2, -Math.PI/2);
    /* ---- pictures on the plaster, a clock, and a console by the door -- */
    const frame=(x,z,ry,w,h,y)=>{
      const flat=(ry===0||Math.abs(ry)>3), nx=Math.sin(ry), nz=Math.cos(ry);
      m.B("oak", flat?w+0.06:0.04, h+0.06, flat?0.04:w+0.06, x, RD+y, z, 0.4, 0, "#5a3a24");
      m.P("art", planeGeo(w, h, 0), x+nx*0.026, RD+y, z+nz*0.026, ry, "#9c8a6a", 0, 0);
    };
    frame(-45.2, RZ0+0.03, 0, 0.56, 0.42, 1.72);
    frame(-41.6, RZ0+0.03, 0, 0.44, 0.58, 1.78);
    frame(-38.2, RZ0+0.03, 0, 0.50, 0.38, 1.66);
    frame(-45.6, RZ1-0.03, Math.PI, 0.62, 0.44, 2.46);
    frame(-41.4, RZ1-0.03, Math.PI, 0.46, 0.60, 2.44);
    frame(RX0+0.03, 39.4, Math.PI/2, 0.52, 0.40, 1.80);
    frame(RX0+0.03, 43.2, Math.PI/2, 0.40, 0.52, 1.74);
    m.C("paint", 0.16,0.16,0.05,18, RX1-0.06, RD+2.42, 46.6, "#3f3a34", 0, 0, Math.PI/2);
    m.C("clockface", 0.138,0.138,0.012,18, RX1-0.09, RD+2.42, 46.6, "#e8e2cf", 0, 0, Math.PI/2);
    {                                                   // a console under the clock
      const cx=RX1-0.38, cz=39.0;
      m.B("oak", 0.46, 0.05, 1.20, cx, TD+0.78, cz, 0.6, 0, "#7a4a28");
      for(const a of [-1,1])
        m.B("oak", 0.08, 0.78, 0.08, cx, TD+0.39, cz+a*0.52, 0.5, 0, OAKD);
      m.B("oak", 0.40, 0.04, 1.04, cx, TD+0.22, cz, 0.5, 0, OAKD);
      m.col(cx-0.26, cx+0.26, cz-0.66, cz+0.66, TD, TD+0.82);
      m.C("brass", 0.11,0.13,0.04,14, cx, TD+0.82, cz-0.30, BRD);
      m.C("brass", 0.016,0.016,0.30,8, cx, TD+0.97, cz-0.30, BR);
      m.P("sconce", new T.CylinderGeometry(0.11,0.16,0.19,16), cx, TD+1.21, cz-0.30,
          0, "#ffd9a0");
      m.lamp(cx-0.3, TD+1.18, cz-0.30, {color:0xffc078, intensity:0.62, dist:6.6,
             decay:1.7, indoor:true, vol:RVOL});
      for(let i=0;i<4;i++)
        m.P("paper", boxGeo(0.13,0.028,0.19,0.4), cx+0.02, TD+0.81+i*0.03, cz+0.30+i*0.02,
            0.12*i, "#cfc6ae", 0, 0);
      m.C("plaster", 0.09,0.07,0.22,14, cx-0.02, TD+0.91, cz+0.54, "#c6bda6");
      for(let i=0;i<5;i++)
        m.C("foliage", 0.010,0.014,0.30+R(i)*0.2, 5, cx-0.02+R(i)*0.1-0.05, TD+1.14,
            cz+0.54+R(i+3)*0.1-0.05, "#6b7a52", R(i)*0.5-0.25, i, R(i+1)*0.5-0.25);
    }
    /* ---- what the room was still missing ----------------------------
       The shell and the furniture were right and it still read as a set:
       a bar with bottles on it rather than a bar somebody works behind.
       What follows is the second pass — the things that are at eye level,
       catch the light, and would be the first things you noticed in the
       room this is drawn from. */
    // the gantry over the counter, with the stemware hung off it
    {
      const GX0=BARX0+1.2, GX1=BARX1-1.2, GCX=(GX0+GX1)/2, GY2=RD+2.26;
      m.B("brass", GX1-GX0, 0.07, 0.10, GCX, GY2, BARZ+0.34, 0.5, 0, BR);
      m.B("brass", GX1-GX0, 0.07, 0.10, GCX, GY2, BARZ+0.64, 0.5, 0, BR);
      for(const q of [GX0, GCX, GX1])
        m.C("brass", 0.022,0.022,0.80,10, q, GY2+0.40, BARZ+0.49, BRD);
      for(let i=0;i<Math.round((GX1-GX0)/0.17);i++){
        const px=GX0+0.09+i*0.17, zz=BARZ+(i%2?0.34:0.64);
        m.C("glass", 0.038,0.014,0.085,10, px, GY2-0.11, zz, "#aab8b4");
        m.C("glass", 0.009,0.009,0.075,6, px, GY2-0.035, zz, "#aab8b4");
        m.C("glass", 0.034,0.034,0.008,10, px, GY2-0.005, zz, "#aab8b4");
      }
    }
    // a vase of ostrich feathers on the end of the counter, which is the
    // one frankly silly thing in the room and the thing you remember
    {
      const vx=BARX1-0.30, vy=RD+1.15, vz=BARZ+0.30;
      m.C("glass", 0.075,0.055,0.26,14, vx, vy+0.13, vz, "#2a3a46");
      m.C("brass", 0.078,0.078,0.025,14, vx, vy+0.27, vz, BRD);
      for(let i=0;i<9;i++){
        const a2=i*0.698, ln=0.44+R(i)*0.26;
        m.P("fabric", boxGeo(0.075, ln, 0.022, 0), vx+Math.cos(a2)*0.07,
            vy+0.28+ln*0.44, vz+Math.sin(a2)*0.07, a2, "#efe6d2",
            (R(i)-0.5)*0.5, (R(i+3)-0.5)*0.6);
      }
    }
    // two palms in brass planters, which is what every one of these had
    for(const q of [[-37.6, 39.2],[-37.4, 48.6]]){
      m.C("brass", 0.28,0.24,0.46,16, q[0], RD+0.23, q[1], BRD);
      m.C("brass", 0.295,0.295,0.035,16, q[0], RD+0.44, q[1], BR);
      m.C("gravel", 0.24,0.24,0.06,12, q[0], RD+0.47, q[1], "#6a6054");
      m.C("oak", 0.035,0.028,0.52,6, q[0], RD+0.72, q[1], "#6a5a34");
      for(let i=0;i<11;i++){
        const a2=i*0.571, ln=0.46+R(i+7)*0.34;
        m.P("foliage", boxGeo(0.12, ln, 0.02, 0), q[0]+Math.cos(a2)*0.10,
            RD+0.96+ln*0.26, q[1]+Math.sin(a2)*0.10, a2, "#5e7048",
            -0.55-R(i)*0.5, (R(i+2)-0.5)*0.4);
      }
      m.col(q[0]-0.32, q[0]+0.32, q[1]-0.32, q[1]+0.32, RD, RD+0.50);
    }
    // a coat stand by the steps, with two things on it
    {
      const cx=PLX-1.05, cz=RZ1-1.30;
      m.C("oak", 0.17,0.19,0.05,14, cx, RD+0.03, cz, OAKD);
      m.C("oak", 0.035,0.030,1.74,10, cx, RD+0.89, cz, "#6a4524");
      m.C("oak", 0.075,0.075,0.07,12, cx, RD+1.79, cz, OAKD);
      for(let i=0;i<4;i++){
        const a2=i*1.571;
        m.P("brass", new T.TorusGeometry(0.055,0.012,5,10), cx+Math.cos(a2)*0.07,
            RD+1.70, cz+Math.sin(a2)*0.07, a2, BRD, 0.9, 0);
      }
      m.P("fabric", boxGeo(0.34, 0.78, 0.13, 0.6), cx+0.08, RD+1.28, cz+0.10, 0.3, "#3e4438", 0, 0);
      m.P("fabric", new T.CylinderGeometry(0.135,0.145,0.11,14), cx-0.10, RD+1.62,
          cz-0.06, 0, "#5a5042", 0.35, 0.2);
      m.col(cx-0.26, cx+0.26, cz-0.26, cz+0.26, RD, RD+0.55);
    }
    /* A CANDLE THROWS A POOL. Every low table has a flame on it and none of
       them was lighting anything: the flame is an emissive, and emissives do
       not illuminate. An additive disc under each one does the work for a
       hundredth of the cost of a real light, and nine of them are what make
       the room read as candlelit rather than as lamplit. */
    for(const q of [[-47.35, 39.12],[-44.80, 39.12],[-42.25, 39.12],[-39.70, 39.12],
                    [-44.86, 43.90],[-40.66, 44.90],
                    [BARX0+0.9, BARZ+0.18],[BARX0+3.0, BARZ+0.18],
                    [BARX0+5.1, BARZ+0.18],[BARX0+7.2, BARZ+0.18],[BARX0+9.3, BARZ+0.18]])
      // the tables' tops are at RD+0.475 and the bar's at RD+1.12; a pool of
      // candlelight sits just above the wood, not 2 cm down inside it
      m.P("floorglow", planeGeo(0.86, 0.86, 0), q[0], RD+(q[1]>46?1.13:0.487), q[1],
          0, "#ffb75a", -Math.PI/2, 0);
    // an ice bucket, a bottle in it and two coupes, on the near table
    {
      const tx=-44.60, tz=43.90;
      m.C("brass", 0.115,0.098,0.20,16, tx+0.30, RD+0.56, tz-0.10, BR);
      m.C("brass", 0.122,0.122,0.022,16, tx+0.30, RD+0.655, tz-0.10, BRD);
      for(const q of [-1,1])
        m.P("brass", new T.TorusGeometry(0.030,0.008,5,10), tx+0.30+q*0.115, RD+0.62,
            tz-0.10, 0, BRD, 0, Math.PI/2);
      m.C("glass", 0.038,0.042,0.26,10, tx+0.30, RD+0.78, tz-0.10, "#2e4a2a");
      m.C("glass", 0.014,0.014,0.07,6, tx+0.30, RD+0.945, tz-0.10, "#2e4a2a");
      for(const q of [[-0.14,0.16],[0.02,0.22]]){
        m.C("glass", 0.050,0.016,0.045,12, tx+q[0], RD+0.515, tz+q[1], "#a6b4b0");
        m.C("glass", 0.008,0.008,0.055,6, tx+q[0], RD+0.52, tz+q[1], "#a6b4b0");
        m.C("glass", 0.030,0.030,0.007,10, tx+q[0], RD+0.495, tz+q[1], "#a6b4b0");
      }
    }
    // the hatch to the cellar, and the crate of empties beside it
    m.P("oak", boxGeo(0.90, 0.05, 1.20, 0.6), -37.9, RD+0.035, 49.4, 0.08, "#6a4524", 0, 0);
    m.B("brass", 0.10, 0.02, 0.16, -37.9, RD+0.065, 49.4, 0.4, 0.08, BRD);
    for(let k=0;k<2;k++)
      m.B("oak", 0.42, 0.24, 0.52, -36.0, RD+0.12+k*0.25, 49.6, 0.5, 0.12*k, "#6a5236");
    for(let i=0;i<6;i++)
      m.C("glass", 0.034,0.038,0.21,8, -36.12+(i%3)*0.13, RD+0.47, 49.48+((i/3)|0)*0.17,
          i%2?"#2e4a2a":"#5a3a1e");
    m.col(-36.26, -35.74, 49.32, 49.88, RD, RD+0.38);
  })();
})();
