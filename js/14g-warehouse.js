"use strict";
/* LOW DESERT MOTEL · 14g-warehouse.js
   the stores: a door in the end of the backstage corridor, and what is
   behind it
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   THE STORES

   The backstage corridor ends in a small room with one chair in it facing
   the corner. That was the end of it. There is a steel door in that room's
   west wall now, stencilled STORES, and behind it a short concrete passage
   and a strip curtain, and behind the curtain the largest room anywhere
   under the mesa: fifty-six metres by forty-three, ten high, racked out to
   the roof in seven aisles, and left.

   Nobody cleared it. That is the whole of what it says. The racking is
   half full, the freight still on its pallets, a forklift stopped with a
   load raised halfway into a slot, another nosed into a bay that came down
   on it, a third up on blocks with a wheel off and the toolbox open beside
   it. The outbound lanes by the dock doors are still staged. One dock
   shutter is stuck a couple of feet up, and there is nothing behind it.
   Eleven of the thirty-six high-bays still strike — sodium, mostly, and two
   mercury lamps that have gone the colour of cold water — and the dark
   between them is most of the room.

   Everything here is in the frame the speakeasy, the hall and the
   backstage share (mk(-80, 340)), and the floor is the backstage's floor,
   STLY = -11.40 under that frame's ground. Nothing reaches the surface:
   the mesa stands nine to ninety metres over the roof.
   ---------------------------------------------------------------------- */
(function stores(){
  const SX=-80, SZ=340;
  const m=mk(SX,SZ), GY=m.y;
  const W=(x)=>SX+x, Z=(z)=>SZ+z;
  let _s=90731;                                     // one seed, so it is the same room every time
  const R=()=>((_s=(_s*16807)%2147483647)-1)/2147483646;
  const pick=a=>a[Math.floor(R()*a.length)];

  /* --- the one page of numbers --------------------------------------- */
  const FY  = -11.40;                   // the backstage floor
  const EX0 = -118.40, EWT=0.50;        // the end room's west face, and its wall
  // the passage, from the end room's wall out to the stores' east wall
  const PX1 = EX0-EWT, PX0=-121.30;     // -118.90 .. -121.30
  const PZ0 = 13.90,  PZ1=15.70, PH=2.40;
  // the hall of the stores
  const HX1 = -121.80, HX0=-177.80;     // east (inner) face to west
  const HZ0 =  -6.20,  HZ1= 36.60;      // south to north
  const HH  =  10.0,   WT =  0.50;      // clear height, wall thickness
  const OS  =  0.08;                    // slabs oversail every outer face (see 14f)
  // racking: seven aisles of it, running east-west
  const RX0 = -169.00, RX1=-133.00, NB=13, BW=(RX1-RX0)/NB;   // 2.77 m bays
  const RH  =  7.60;                    // upright height
  const LV  = [0, 1.95, 3.75, 5.55];    // beam centre heights of the four storage levels
  const TOPB= 7.35;                     // and the empty top beam
  const ROWZ= [-0.05, 6.05, 12.15, 18.25, 24.35, 30.45];      // double rows, by flue centre
  const SINGLE=[[HZ0+0.25, HZ0+1.35], [HZ1-1.35, HZ1-0.25]];  // single rows on the long walls
  // aisle centres, south to north; the fourth one is the one the door opens on
  const AISLE=[-3.10, 3.00, 9.10, 15.20, 21.30, 27.40, 33.50];
  // roof beams, every third rack frame and one beyond each end
  const BEAMX=[-124.69, -133.00, -141.31, -149.62, -157.92, -166.23, -174.54];

  const CONC="#77736b", CONCD="#5f5b54", FLR="#7b776f", PAINTD="#55605a";
  const UPR="#2f5a8a", BEAMC="#c4602a", YEL="#d4a62a", STEEL="#4d5458";
  const KRAFT=["#a8845a","#9c7a50","#b39064","#8f7048","#a07c52","#b8966a"];
  const VOL=[W(HX0-WT), W(PX1+0.2), Z(HZ0-WT), Z(HZ1+WT), GY+FY-1, GY+FY+HH+0.6];

  /* --- the shell ------------------------------------------------------
     The same rules as the backstage: slabs oversail the walls' outer faces
     by OS and butt where they meet; at every corner one wall owns it and
     the other stops at its face. ------------------------------------- */
  // floor slab and its face
  m.B("concrete", HX1-HX0+2*WT+2*OS, 0.50, HZ1-HZ0+2*WT+2*OS, (HX0+HX1)/2, FY-0.25,
      (HZ0+HZ1)/2, 0.5, 0, CONCD);
  m.P("concrete", planeGeo(HX1-HX0, HZ1-HZ0, 0.25), (HX0+HX1)/2, FY+0.006, (HZ0+HZ1)/2,
      0, FLR, -Math.PI/2, 0);
  // the roof slab
  m.B("concrete", HX1-HX0+2*WT+2*OS, 0.50, HZ1-HZ0+2*WT+2*OS, (HX0+HX1)/2, FY+HH+0.25,
      (HZ0+HZ1)/2, 0.5, 0, "#4a4741");
  const wall=(x0,x1,z0,z1,y0,y1)=>{
    m.B("concrete", x1-x0, y1-y0, z1-z0, (x0+x1)/2, FY+(y0+y1)/2, (z0+z1)/2, 0.35, 0, CONC);
    m.col(x0, x1, z0, z1, FY+y0-0.5, FY+y1);
  };
  // west: owns both its corners, and has the fire door in it (POOL_DOOR, in
  // 14h-pool.js's terms: what is through it is built there)
  const FD0=AISLE[3]-0.54, FD1=AISLE[3]+0.54, FDH=2.14;
  wall(HX0-WT, HX0, HZ0-WT, FD0, -0.1, HH+0.4);
  wall(HX0-WT, HX0, FD1, HZ1+WT, -0.1, HH+0.4);
  wall(HX0-WT, HX0, FD0, FD1, FDH, HH+0.4);
  wall(HX0, HX1+WT, HZ0-WT, HZ0, -0.1, HH+0.4);      // south
  wall(HX0, HX1+WT, HZ1, HZ1+WT, -0.1, HH+0.4);      // north
  wall(HX1, HX1+WT, HZ0, PZ0, -0.1, HH+0.4);         // east, either side of the passage
  wall(HX1, HX1+WT, PZ1, HZ1, -0.1, HH+0.4);
  wall(HX1, HX1+WT, PZ0, PZ1, PH, HH+0.4);           // and over it
  m.flat(HX0, HX1, HZ0, HZ1, FY);
  m.voidAt(HX0-WT-0.3, HX1+WT, HZ0-WT-0.3, HZ1+WT+0.3, FY-1.0, FY+HH+0.6, FY);

  /* Tilt-up panels: a joint every six metres and a painted band to 1.4 m,
     which is where forty years of pallets and fork tines have been. The
     band is its own plane a centimetre off the wall, and so is every joint,
     so nothing printed on a wall shares the wall's plane. */
  const wallFace=(ax, a0, a1, c, n)=>{       // ax "x": a wall running along x at z=c, facing n
    const L=a1-a0, mid=(a0+a1)/2;
    if(ax==="x"){
      m.P("paint", planeGeo(L, 1.40, 0.5), mid, FY+0.70, c+n*0.010, n>0?0:Math.PI, PAINTD, 0, 0);
      m.P("paint", planeGeo(L, 0.10, 0), mid, FY+1.45, c+n*0.011, n>0?0:Math.PI, YEL, 0, 0);
      for(let u=a0+6.0; u<a1-1.0; u+=6.0)
        m.P("soot", planeGeo(0.05, HH-1.6, 0), u, FY+1.6+(HH-1.6)/2, c+n*0.012, n>0?0:Math.PI,
            "#2a2620", 0, 0);
    }else{
      const ry=n>0?Math.PI/2:-Math.PI/2;
      m.P("paint", planeGeo(L, 1.40, 0.5), c+n*0.010, FY+0.70, mid, ry, PAINTD, 0, 0);
      m.P("paint", planeGeo(L, 0.10, 0), c+n*0.011, FY+1.45, mid, ry, YEL, 0, 0);
      for(let u=a0+6.0; u<a1-1.0; u+=6.0)
        m.P("soot", planeGeo(0.05, HH-1.6, 0), c+n*0.012, FY+1.6+(HH-1.6)/2, u, ry,
            "#2a2620", 0, 0);
    }
  };
  wallFace("x", HX0, HX1, HZ0, 1);
  wallFace("x", HX0, HX1, HZ1, -1);
  wallFace("z", HZ0, FD0-0.08, HX0, 1);
  wallFace("z", FD1+0.08, HZ1, HX0, 1);
  wallFace("z", HZ0, PZ0-0.05, HX1, -1);
  wallFace("z", PZ1+0.05, HZ1, HX1, -1);

  /* --- the roof steel, and what holds it up --------------------------
     Seven beams across the short way, each carried on a column at every
     double row. Inside the racking the columns stand in the flue between
     the two halves of a row, which is where a column in a racked
     warehouse always is; out on the open floor they get a yellow guard. */
  const COLW=0.26;
  for(const bxp of BEAMX){
    m.B("teal", 0.34, 0.80, HZ1-HZ0, bxp, FY+HH-0.40, (HZ0+HZ1)/2, 0.4, 0, STEEL);
    m.B("teal", 0.34, 0.05, HZ1-HZ0, bxp, FY+HH-0.825, (HZ0+HZ1)/2, 0.4, 0, "#40464a");
    for(const zc of ROWZ){
      m.B("teal", COLW, HH-0.80, COLW, bxp, FY+(HH-0.80)/2, zc, 0.4, 0, STEEL);
      m.col(bxp-COLW/2, bxp+COLW/2, zc-COLW/2, zc+COLW/2, FY, FY+HH);
      const open=(bxp>RX1+0.5 || bxp<RX0-0.5);
      if(open){
        m.B("paint", 0.44, 1.10, 0.44, bxp, FY+0.55, zc, 0.5, 0, YEL);
        for(let k=0;k<3;k++)
          m.B("paint", 0.452, 0.10, 0.452, bxp, FY+0.22+k*0.30, zc, 0, 0, "#1d1c1a");
        m.col(bxp-0.24, bxp+0.24, zc-0.24, zc+0.24, FY, FY+1.2);
      }
    }
  }
  // a sprinkler main and two conduit runs the length of the room, and the
  // drops off the main to heads that would not have done anything anyway
  // (all three run under the beams' bottom flanges, at FY+HH-0.85, and touch them)
  m.C("paint", 0.065,0.065, HX1-HX0, 10, (HX0+HX1)/2, FY+HH-0.915, 5.0, "#8a2a22", 0, 0, Math.PI/2);
  m.C("metal", 0.026,0.026, HX1-HX0, 6, (HX0+HX1)/2, FY+HH-0.876, 20.0, "#5a5450", 0, 0, Math.PI/2);
  m.C("metal", 0.026,0.026, HX1-HX0, 6, (HX0+HX1)/2, FY+HH-0.876, 20.12, "#5a5450", 0, 0, Math.PI/2);
  for(let x=HX1-3.0; x>HX0+1; x-=4.2){
    m.C("paint", 0.016,0.016,0.40,6, x, FY+HH-1.18, 5.0, "#8a2a22");
    m.C("metal", 0.030,0.040,0.05,8, x, FY+HH-1.40, 5.0, "#b8a67e");
  }

  /* --- racking --------------------------------------------------------
     A line is one depth of rack: uprights in frames at every bay line,
     orange beams at four levels and an empty one at the top. A double row
     is two lines back to back with a 0.40 flue between them. Pallets sit
     1.2 deep across 1.1 of frame, which is right: the front and back
     boards overhang the beams by five centimetres. */
  const gUp=boxGeo(0.09, RH, 0.07, 0.4);
  const gBeam=boxGeo(BW-0.09, 0.12, 0.05, 0.4);
  const LDEP=1.10, FDEP=LDEP-0.07;
  const gDiag=boxGeo(0.035, Math.hypot(FDEP, 1.25), 0.035, 0);
  const gHor =boxGeo(0.035, 0.035, FDEP, 0);
  const DIAG=Math.atan2(FDEP, 1.25);
  const RACKS=[];                     // [z0, z1, aisle side (-1 south / +1 north)]
  RACKS.push([SINGLE[0][0], SINGLE[0][1], 1]);
  for(const zc of ROWZ){ RACKS.push([zc-1.30, zc-0.20, -1]); RACKS.push([zc+0.20, zc+1.30, 1]); }
  RACKS.push([SINGLE[1][0], SINGLE[1][1], -1]);
  // the bay that came down: line 9 (row 4's south half), bays 5 and 6
  const FALLEN_LINE=9, FALLEN_BAYS=[5,6], BENT_FRAME=6;
  const frameAt=i=>RX0+i*BW;
  RACKS.forEach((rk,li)=>{
    const [z0,z1]=rk, zm=(z0+z1)/2;
    for(let i=0;i<=NB;i++){
      const x=frameAt(i);
      const bent=(li===FALLEN_LINE && i===BENT_FRAME);
      for(const zz of [z0+0.035, z1-0.035]){
        if(bent){
          /* the upright the forklift hit: folded at about a metre, the top
             leaning over into the next bay */
          m.P("teal", boxGeo(0.09, 1.05, 0.07, 0.4), x, FY+0.525, zz, 0, UPR);
          const La=RH-1.2, th=0.36;
          m.P("teal", boxGeo(0.09, La, 0.07, 0.4), x-Math.sin(th)*La/2, FY+1.05+Math.cos(th)*La/2,
              zz, 0, UPR, 0, th);
        }else m.P("teal", gUp, x, FY+RH/2, zz, 0, UPR);
      }
      if(bent) continue;
      // frame bracing: a horizontal at the foot and the head, diagonals between
      m.P("teal", gHor, x, FY+0.15, zm, 0, UPR);
      m.P("teal", gHor, x, FY+RH-0.10, zm, 0, UPR);
      for(let k=0;k<6;k++)
        m.P("teal", gDiag, x, FY+0.15+1.25*(k+0.5), zm, 0, UPR, (k%2?1:-1)*DIAG, 0);
    }
    // beams
    for(let b=0;b<NB;b++){
      const cx=frameAt(b)+BW/2;
      const fallen=(li===FALLEN_LINE && FALLEN_BAYS.includes(b));
      const lv=LV.slice(1).concat([TOPB]);
      for(const y of lv){
        if(fallen) continue;
        for(const zz of [z0+0.035, z1-0.035]) m.P("teal", gBeam, cx, FY+y, zz, 0, BEAMC);
      }
    }
    // row-end guards on the aisle side, where the forks come round
    for(const i of [0, NB]){
      const x=frameAt(i)+(i===0?-0.10:0.10);
      const za=rk[2]<0 ? z0+0.10 : z1-0.10;
      m.B("paint", 0.12, 0.40, 0.30, x, FY+0.20, za, 0.4, 0, YEL);
    }
    m.col(RX0-0.10, RX1+0.10, z0-0.04, z1+0.04, FY, FY+RH);
  });

  /* --- pallets and what is on them ----------------------------------- */
  const PL={w:1.00, d:1.20, h:0.144};
  const gDeck=boxGeo(PL.w, 0.022, PL.d, 0.5), gRun=boxGeo(0.10, 0.122, PL.d, 0.5);
  const gBoard=boxGeo(PL.w, 0.022, 0.10, 0.5), gBot=boxGeo(PL.w, 0.022, 0.14, 0.5);
  const WOOD=["#9a8466","#8d7a5e","#a38d6c","#857258"];
  // a pallet seen in a rack: a deck and three runners is all you can see of it
  function palletLow(x,y,z,ry){
    const c=pick(WOOD), s=Math.sin(ry||0), k=Math.cos(ry||0);
    m.P("oak", gDeck, x, y+0.133, z, ry||0, c);
    for(const o of [-0.45,0,0.45]) m.P("oak", gRun, x+o*k, y+0.061, z-o*s, ry||0, c);
  }
  // a loose one, close enough to see the boards
  function palletFull(x,y,z,ry,c){
    c=c||pick(WOOD); const s=Math.sin(ry||0), k=Math.cos(ry||0);
    const L=(lx,lz)=>[x+lx*k+lz*s, z-lx*s+lz*k];
    for(let i=0;i<7;i++){ const q=L(0, -0.55+i*(1.10/6)); m.P("oak", gBoard, q[0], y+0.133, q[1], ry||0, c); }
    for(const o of [-0.45,0,0.45]){ const q=L(o,0); m.P("oak", gRun, q[0], y+0.061, q[1], ry||0, c); }
    for(const o of [-0.525,0,0.525]){ const q=L(0,o); m.P("oak", gBot, q[0], y+0.011, q[1], ry||0, c); }
  }
  const gDrum=new T.CylinderGeometry(0.25,0.25,0.88,10), gHoop=new T.CylinderGeometry(0.253,0.253,0.04,10,1,true);
  const gCart=[boxGeo(0.48,0.36,0.58,0.6), boxGeo(0.48,0.44,0.58,0.6), boxGeo(0.48,0.48,0.58,0.6)];
  function load(x,y,z,maxH,kind){
    const t=y+PL.h;
    if(kind<0.58){                                  // cartons, two by two, one to three high
      const gi=Math.floor(R()*3), g=gCart[gi], ch=[0.36,0.44,0.48][gi];
      const n=Math.max(1, Math.min(3, Math.floor((maxH-0.05)/ch), 1+Math.floor(R()*3)));
      for(let l=0;l<n;l++){
        const top=(l===n-1);
        for(const a of [[-0.245,-0.295],[0.245,-0.295],[-0.245,0.295],[0.245,0.295]]){
          if(top && R()<0.22) continue;             // somebody took one
          m.P("bin", g, x+a[0]+(R()-0.5)*0.012, t+ch*(l+0.5)+0.001*l, z+a[1]+(R()-0.5)*0.012,
              (R()-0.5)*0.03, pick(KRAFT));
        }
      }
    }else if(kind<0.74){                            // a wrapped load, gone grey with dust
      const h=Math.min(maxH-0.06, 0.8+R()*0.6);
      m.P("plaster", boxGeo(0.98, h, 1.18, 0.5), x, t+h/2, z, 0, pick(["#c4c8c2","#b9beb9","#cdc9bc"]));
      m.P("paint", boxGeo(1.00, 0.03, 1.20, 0), x, t+h*0.62, z, 0, "#3a3a38");      // a strap
    }else if(kind<0.84){                            // drums, four to a pallet
      const c=pick(["#2f4f7a","#6e2a22","#3e5a3c","#5a5248","#2f4f7a"]);
      for(const a of [[-0.255,-0.30],[0.255,-0.30],[-0.255,0.30],[0.255,0.30]]){
        if(R()<0.12) continue;
        // ten sides and one rolling hoop: there are a couple of hundred of these
        m.P("paint", gDrum, x+a[0], t+0.44, z+a[1], 0, c);
        m.P("metal", gHoop, x+a[0], t+0.44, z+a[1], 0, "#6a6660");
      }
    }else if(kind<0.92){                            // sacks, slumped
      for(let l=0;l<2;l++) for(const a of [[-0.24,0],[0.24,0]])
        m.P("fabric", boxGeo(0.44, 0.17, 1.08, 0.6), x+a[0], t+0.085+l*0.17, z+a[1],
            (R()-0.5)*0.12, pick(["#cfc3a6","#c2b494","#d6cdb4"]), (R()-0.5)*0.06, (R()-0.5)*0.08);
    }                                               // and the rest: an empty pallet
  }

  const RESERVED=new Set(["5,7,2,-0.62"]);         // the slot forklift 1 is loading
  RACKS.forEach((rk,li)=>{
    const zm=(rk[0]+rk[1])/2;
    const thin=R()<0.25;                            // some lines were mostly cleared
    for(let b=0;b<NB;b++){
      const cx=frameAt(b)+BW/2;
      const fallen=(li===FALLEN_LINE && FALLEN_BAYS.includes(b));
      for(let l=0;l<LV.length;l++){
        if(fallen) continue;
        const fill=[0.58,0.52,0.46,0.36][l]*(thin?0.35:1);
        const y=FY+(l===0?0:LV[l]+0.06);
        const maxH=(l<LV.length-1?LV[l+1]:TOPB)-(l===0?0:LV[l]+0.06)-0.12-PL.h;
        for(const o of [-0.62,0.62]){
          if(R()>fill || RESERVED.has(li+","+b+","+l+","+o)) continue;
          palletLow(cx+o, y, zm, 0);
          load(cx+o, y, zm, maxH, R());
        }
      }
    }
  });

  /* --- the bay that came down ----------------------------------------
     Line 9 is the south half of the fifth row, facing aisle five. The
     forklift that hit it is still in the aisle with its nose in the frame;
     the upper beams of two bays let go, and what was on them is on the
     floor. */
  {
    const z0=RACKS[FALLEN_LINE][0], xA=frameAt(5), xB=frameAt(7), xF=frameAt(BENT_FRAME);
    // the beams, down across the heap, one end up on a pallet
    for(const b of [[-2.50, -1.40, 0.50, 0.04],[1.40, -1.30, -0.60, 0.03],[1.40, -0.50, 0.15, 0.22]])
      m.P("teal", gBeam, xF+b[0], FY+0.09+Math.abs(b[3])*1.2, z0+b[1], b[2], BEAMC, 0, b[3]);
    // the pallets that came off them
    for(const h of [[-2.20,-0.80,0.35],[-2.00,-2.00,-0.50],[1.00,-1.00,0.90],[1.90,-2.10,0.20],[0.90,-2.40,-0.30]]){
      palletFull(xF+h[0], FY, z0+h[1], h[2]);
      if(h[1]>-1.5) m.P("oak", gDeck, xF+h[0], FY+0.17, z0+h[1], h[2], pick(WOOD), 0.30, 0.10);
    }
    // and the cartons, where they landed, clear of the truck still in the aisle
    for(let i=0;i<34;i++){
      const side=R()<0.5, x=xF+(side ? -2.6+R()*1.35 : 0.25+R()*2.3), z=z0-0.2-R()*2.6;
      const crushed=R()<0.35, lying=!crushed && R()<0.4;
      const h=crushed?0.14+R()*0.10:0.36+R()*0.12;
      const up=lying?0.58:h;
      m.P("bin", boxGeo(0.48, h, 0.58, 0.6), x, FY+up/2+(R()<0.3?0.144:0)+i*0.0011, z, R()*3,
          pick(KRAFT), lying?Math.PI/2:(crushed?(R()-0.5)*0.3:0), crushed?(R()-0.5)*0.2:0);
    }
    for(let i=0;i<9;i++)                             // flattened ones
      m.P("bin", boxGeo(0.62, 0.010, 0.80, 0.6), xA-0.4+R()*6.0, FY+0.032+i*0.0012,
          z0-0.3-R()*2.9, R()*3, pick(KRAFT));
    m.col(xA, xB, z0-2.7, z0, FY, FY+0.9);
  }

  /* --- forklifts ------------------------------------------------------
     Built facing their own +z, forks forward, the cab on top of a counter-
     weighted body; `fh` is the fork height. Returns nothing; registers its
     own collider and a seat. */
  function forklift(cx, cz, ry, fh, o){
    o=o||{};
    const s=Math.sin(ry), k=Math.cos(ry);
    const L=(lx,lz)=>[cx+lx*k+lz*s, cz-lx*s+lz*k];
    const BODY=o.body||"#d1a01e", DARK="#2a2a28", TY="#1b1a19";
    const B=(bk,w,h,d,lx,ly,lz,c,rx,rz)=>{ const q=L(lx,lz); m.P(bk, boxGeo(w,h,d,0.5), q[0], FY+ly, q[1], ry, c, rx||0, rz||0); };
    const C=(bk,r,h,lx,ly,lz,c,seg,rx,rz)=>{ const q=L(lx,lz); m.P(bk, new T.CylinderGeometry(r,r,h,seg||14), q[0], FY+ly, q[1], ry, c, rx||0, rz||0); };
    // body, counterweight, hood
    // (the body is 4 cm narrower than the wheels' outer faces, the round
    // back 2 cm shorter than the counterweight it ends, and the counterweight
    // a centimetre lower than the body, so no two of them share a face)
    B("paint", 1.04, 0.52, 1.90, 0, 0.56, 0.05, BODY);
    B("paint", 1.12, 0.74, 0.52, 0, 0.66, -1.02, o.cw||"#a87e18");
    C("paint", 0.37, 1.10, 0, 0.66, -1.26, o.cw||"#a87e18", 16, 0, Math.PI/2);
    B("paint", 0.98, 0.20, 0.90, 0, 0.92, -0.45, BODY);
    B("paint", 0.96, 0.34, 0.26, 0, 0.98, 0.50, BODY);                 // the cowl
    // the seat and the wheel
    B("leather", 0.48, 0.12, 0.46, 0, 1.08, -0.30, "#1e1d1c");
    B("leather", 0.48, 0.44, 0.10, 0, 1.34, -0.55, "#1e1d1c", -0.12);
    C("metal", 0.025, 0.46, 0, 1.22, 0.30, DARK, 8, -0.55);
    { const q=L(0,0.18); m.P("paint", new T.TorusGeometry(0.17,0.022,6,16), q[0], FY+1.42, q[1], ry, "#262524", -0.95, 0); }
    // the overhead guard: posts, rails, slats
    for(const sx of [-0.50,0.50]){
      B("paint", 0.07, 1.22, 0.07, sx, 1.42, -0.80, DARK);
      B("paint", 0.07, 1.30, 0.07, sx, 1.46, 0.58, DARK, 0.10);
      B("paint", 0.07, 0.07, 1.46, sx, 2.10, -0.10, DARK);
    }
    for(let i=0;i<6;i++) B("paint", 1.00, 0.05, 0.06, 0, 2.12, -0.74+i*0.26, DARK);
    // the wheels
    for(const sx of [-0.43,0.43]){
      if(!(o.wheelOff && sx>0)) C("tyre", 0.30, 0.22, sx, 0.30, 0.60, TY, 16, 0, Math.PI/2);
      C("metal", 0.15, 0.23, sx, 0.30, 0.60, "#7a7a74", 12, 0, Math.PI/2);
      C("tyre", 0.24, 0.18, sx, 0.24, -0.82, TY, 14, 0, Math.PI/2);
    }
    if(o.wheelOff) B("oak", 0.30, 0.15, 0.34, 0.43, 0.075, 0.60, "#7a6448");    // the hub, on a block
    // the mast, its inner stage up with the forks when they are high
    const lift=Math.max(0, fh-1.30);
    for(const sx of [-0.33,0.33]){
      B("paint", 0.10, 2.40, 0.12, sx, 1.25, 0.96, DARK);
      B("paint", 0.08, 2.30, 0.10, sx*0.80, 1.20+lift, 1.02, "#33332f");
    }
    B("paint", 0.76, 0.10, 0.10, 0, 2.40, 0.96, DARK);
    B("paint", 0.76, 0.10, 0.10, 0, 0.62, 0.96, DARK);
    C("metal", 0.045, 1.80, 0, 1.05+lift*0.5, 0.90, "#8a8a84", 10);
    // carriage, backrest and the two forks
    B("paint", 0.92, 0.40, 0.06, 0, fh+0.25, 1.10, DARK);
    for(let i=0;i<4;i++) B("paint", 0.04, 0.62, 0.03, -0.33+i*0.22, fh+0.76, 1.11, DARK);
    B("paint", 0.92, 0.04, 0.04, 0, fh+1.06, 1.11, DARK);
    for(const sx of [-0.26,0.26]){
      B("paint", 0.10, 0.52, 0.05, sx, fh+0.26, 1.16, "#3a3936");
      B("paint", 0.10, 0.045, 1.10, sx, fh+0.0225, 1.73, "#3a3936");
    }
    // a propane bottle on the back, the dead lamps and the beacon
    C("plaster", 0.16, 0.78, 0, 1.18, -0.92, "#c7c3b8", 14, 0, Math.PI/2);
    for(const sx of [-0.50,0.50]) B("glass", 0.10, 0.08, 0.06, sx, 1.95, 0.64, "#c8b890");
    { const q=L(0,-0.60); m.P("glass", new T.SphereGeometry(0.07,10,6,0,Math.PI*2,0,Math.PI/2), q[0], FY+2.15, q[1], 0, "#c8641e"); }
    // a collider round the body and one round the forks
    const ext=[[-0.6,-1.65],[0.6,-1.65],[-0.6,1.05],[0.6,1.05]].map(a=>L(a[0],a[1]));
    const xs=ext.map(e=>e[0]), zs=ext.map(e=>e[1]);
    m.col(Math.min(...xs), Math.max(...xs), Math.min(...zs), Math.max(...zs), FY, FY+2.2);
    const fe=[[-0.32,1.10],[0.32,1.10],[-0.32,2.30],[0.32,2.30]].map(a=>L(a[0],a[1]));
    const fx=fe.map(e=>e[0]), fz=fe.map(e=>e[1]);
    m.col(Math.min(...fx), Math.max(...fx), Math.min(...fz), Math.max(...fz), FY+fh, FY+fh+0.25);
    const st=L(0,-0.28);
    addSeat(W(st[0]), Z(st[1]), GY+FY+1.16, ry+Math.PI, "THE FORKLIFT");
  }

  // 1 · in aisle three, stopped with a load halfway into a slot at level two
  //     (not in aisle four, the one the door opens on: there it left 0.6 m
  //     to get past, and the walk probe could not)
  {
    const cx=frameAt(7)+BW/2-0.62, lineZ0=RACKS[5][0];   // row 2's south half, facing aisle three
    const fh=LV[2]+0.06+0.002;
    const pz=lineZ0+0.05;                            // the pallet half in
    forklift(cx, pz-1.73, 0, fh);
    palletLow(cx, FY+fh, pz, 0);
    load(cx, FY+fh, pz, 1.4, 0.10);
  }
  // 2 · the one that brought the bay down, in aisle five, its forks run in
  //     under the frame it folded
  forklift(frameAt(BENT_FRAME)-0.55, RACKS[FALLEN_LINE][0]+0.90-2.28, 0.0, 0.05,
           {body:"#c8641e", cw:"#9c4c18"});
  // 3 · in the staging bay by the docks, an empty pallet on its forks
  forklift(-127.6, 21.4, -2.25, 0.12);
  { const fs=Math.sin(-2.25), fc=Math.cos(-2.25);
    palletFull(-127.6+1.73*fs, FY+0.165, 21.4+1.73*fc, -2.25); }
  // 4 · up on blocks at the back with a wheel off, and the job never finished
  forklift(-173.6, 3.2, 1.35, 0.05, {wheelOff:true, body:"#c9a227"});
  {
    const q=[-173.6+0.43*Math.cos(1.35)+0.60*Math.sin(1.35), 3.2-0.43*Math.sin(1.35)+0.60*Math.cos(1.35)];
    m.C("tyre", 0.30,0.30,0.22,16, q[0]+1.10, FY+0.11, q[1]-0.30, "#1b1a19");   // the wheel, laid down
    m.C("metal", 0.15,0.15,0.23,12, q[0]+1.10, FY+0.115, q[1]-0.30, "#7a7a74");
    m.B("paint", 0.52, 0.24, 0.26, -171.4, FY+0.12, 4.6, 0.5, 0, "#8a2a22");            // the toolbox,
    m.P("paint", boxGeo(0.52, 0.26, 0.03, 0.5), -171.4, FY+0.37, 4.745, 0, "#8a2a22", -0.25, 0);  // open
    for(let i=0;i<5;i++)
      m.B("metal", 0.20, 0.018, 0.03, -171.0+R()*0.8, FY+0.009, 4.2+R()*0.9, 0, R()*3, "#9a9a94");
    m.P("stain", streakGeo(2.2, 1.6, 0), -173.4, FY+0.013, 3.4, 0.6, "#1e1a14", -Math.PI/2, 0);
    m.col(-171.8, -171.0, 4.3, 4.9, FY, FY+0.4);
  }

  /* --- the staging bay, between the door and the racks --------------- */
  // outbound lanes, still staged: two rows of pallets with lane lines
  for(let r=0;r<2;r++) for(let i=0;i<5;i++){
    const x=-131.4+i*1.35, z=4.6+r*1.75;
    if((r*5+i)%4===3) continue;
    palletFull(x, FY, z, 0);
    load(x, FY, z, 1.6, R()*0.9);
    m.col(x-0.52, x+0.52, z-0.62, z+0.62, FY, FY+1.4);
  }
  for(let i=0;i<=5;i++)
    m.P("paint", boxGeo(0.06, 0.003, 3.60, 0), -132.10+i*1.35, FY+0.0085, 5.47, 0, YEL);
  // a carton stack that went over in the lane
  for(let i=0;i<7;i++)
    m.P("bin", gCart[1], -126.4+i*0.36+R()*0.1, FY+(i%2?0.29:0.22), 8.2+R()*0.5, R()*0.6, pick(KRAFT),
        Math.PI/2*(i%2), 0);
  // empty pallets in stacks, one of them leaning
  for(const st of [[-131.6,25.6,12,0],[-131.6,27.1,7,0],[-130.2,25.6,9,0.04],[-175.2,27.5,14,0],[-175.2,29.0,5,0]]){
    for(let i=0;i<st[2];i++) palletFull(st[0]+i*st[3]*0.144, FY+i*0.144, st[1], (i%3)*0.01);
    m.col(st[0]-0.55, st[0]+0.55+st[2]*st[3]*0.144, st[1]-0.62, st[1]+0.62, FY, FY+st[2]*0.144);
  }
  // a pallet jack, handle down, where it was let go
  {
    const jx=-124.6, jz=10.2, jr=0.4;
    const s=Math.sin(jr), k=Math.cos(jr);
    for(const o of [-0.28,0.28])
      m.P("paint", boxGeo(0.16, 0.07, 1.15, 0.5), jx+o*k+0.55*s, FY+0.05, jz-o*s+0.55*k, jr, "#b8322a");
    m.P("paint", boxGeo(0.62, 0.30, 0.22, 0.5), jx, FY+0.22, jz, jr, "#b8322a");
    m.P("metal", boxGeo(0.04, 1.20, 0.04, 0), jx-0.40*s, FY+0.40, jz-0.40*k, jr, "#3a3936", -1.15, 0);
    m.col(jx-0.6, jx+0.6, jz-0.6, jz+0.6, FY, FY+0.4);
  }
  // the dock doors in the south wall, and the one that stuck
  for(const dk of [{x:-129.8, open:0.70},{x:-125.0, open:0}]){
    const dw=3.20, dh=3.60, z=HZ0;
    for(const sd of [-1,1])
      m.B("metal", 0.16, dh+0.10, 0.10, dk.x+sd*(dw/2+0.08), FY+(dh+0.10)/2, z+0.05, 0.4, 0, "#5a5f62");
    m.B("paint", dw+0.50, 0.55, 0.42, dk.x, FY+dh+0.38, z+0.21, 0.4, 0, "#3a3e40");   // the barrel housing
    const sh=dh-dk.open;
    m.B("siding", dw, sh, 0.05, dk.x, FY+dk.open+sh/2, z+0.035, 0.5, 0, "#9aa0a0");
    m.B("metal", dw, 0.06, 0.07, dk.x, FY+dk.open+0.03, z+0.045, 0.4, 0, "#4a4e50");
    if(dk.open>0)                                     // and nothing behind it
      m.P("paint", planeGeo(dw, dk.open, 0), dk.x, FY+dk.open/2, z+0.014, 0, "#050505", 0, 0);
    for(const sd of [-1,1])                           // bumpers
      m.B("tyre", 0.26, 0.42, 0.14, dk.x+sd*1.05, FY+0.50, z+0.07, 0.4, 0, "#1b1a19");
    m.B("metal", 2.0, 0.025, 2.20, dk.x, FY+0.0125, z+1.10, 0.4, 0, "#6a6e6e");      // leveller plate
    for(let i=0;i<8;i++)                              // its hazard edge
      m.P("paint", boxGeo(0.25, 0.004, 0.10, 0), dk.x-0.875+i*0.25, FY+0.027, z+2.12, 0,
          i%2?YEL:"#1d1c1a");
    for(const sd of [-1,1]){                          // bollards
      m.C("paint", 0.09,0.09,1.10,12, dk.x+sd*(dw/2+0.55), FY+0.55, z+0.45, YEL);
      m.col(dk.x+sd*(dw/2+0.55)-0.1, dk.x+sd*(dw/2+0.55)+0.1, z+0.35, z+0.55, FY, FY+1.1);
    }
  }
  for(const c of [[-127.5,-3.4,0],[-127.0,-2.4,0],[-122.9,-4.6,1]]){   // cones, one knocked over
    m.C("paint", 0.03,0.17,0.46,12, c[0], FY+(c[2]?0.17:0.24), c[1], "#d9541e", 0, 0, c[2]?Math.PI/2:0);
    m.C("plaster", 0.09,0.12,0.08,12, c[0], FY+(c[2]?0.17:0.26), c[1], "#e8e4d8", 0, 0, c[2]?Math.PI/2:0);
    if(!c[2]) m.B("paint", 0.36, 0.03, 0.36, c[0], FY+0.015, c[1], 0, 0, "#d9541e");
  }

  /* --- the foreman's cabin, in the north-east corner ------------------
     Block walls to the window sill, glass above, a door on its west side.
     The desk faces the window onto the floor, and so does the chair. */
  {
    const cx0=-127.70, cx1=HX1, cz0=31.30, cz1=HZ1, ch=2.70, t=0.15;
    const CW="#c4bca8";
    const cw=(x0,x1,z0,z1)=>{                         // a wall: block to 1.05, glass to 2.30, block over
      const w=x1-x0, d=z1-z0, xm=(x0+x1)/2, zm=(z0+z1)/2;
      m.B("paint", w, 1.05, d, xm, FY+0.525, zm, 0.5, 0, CW);
      m.B("paint", w, ch-2.30, d, xm, FY+(2.30+ch)/2, zm, 0.5, 0, CW);
      m.B("metal", w+0.002, 0.05, d+0.04, xm, FY+1.075, zm, 0.4, 0, "#5a5f62");      // the sill
      m.P("glass", boxGeo(w>d?w-0.02:0.012, 1.18, w>d?0.012:d-0.02, 0), xm, FY+1.69, zm, 0, "#a9b8b6");
      m.col(x0, x1, z0, z1, FY, FY+ch);
    };
    cw(cx0, cx1, cz0, cz0+t);                         // south side, the long window
    cw(cx0, cx0+t, cz0+t, cz1-1.6);                   // west side, up to the door
    m.B("paint", t, ch-2.10, 1.0, cx0+t/2, FY+(2.10+ch)/2, cz1-1.1, 0.5, 0, CW);   // over the door
    m.B("paint", t, ch, 0.60, cx0+t/2, FY+ch/2, cz1-0.30, 0.5, 0, CW);
    m.col(cx0, cx0+t, cz1-0.60, cz1, FY, FY+ch);
    m.B("paint", cx1-cx0, 0.10, cz1-cz0, (cx0+cx1)/2, FY+ch+0.05, (cz0+cz1)/2, 0.5, 0, "#8a857a"); // its roof
    // the door, standing open into the room, and a dead tube on the ceiling
    { // hung on the north jamb, swung a hundred degrees in, along the wall
      const dr=-0.175, ux=Math.cos(dr), uz=-Math.sin(dr), hx=cx0+t, hz=cz1-0.62;
      m.P("paint", boxGeo(0.92, 2.04, 0.045, 0.5), hx+0.46*ux, FY+1.04, hz+0.46*uz, dr, "#7d8478");
      m.P("metal", boxGeo(0.12, 0.03, 0.10, 0), hx+0.84*ux, FY+1.02, hz+0.84*uz, dr, "#b8b4a8");
    }
    m.B("paint", 1.22, 0.07, 0.16, (cx0+cx1)/2, FY+ch-0.035, (cz0+cz1)/2, 0.4, 0, "#d8d4c8");
    m.B("glass", 1.14, 0.03, 0.10, (cx0+cx1)/2, FY+ch-0.085, (cz0+cz1)/2, 0, 0, "#9a9a92");
    // inside: the desk at the window, the chair at the desk, a cabinet
    const dX=-124.8, dZ=cz0+0.62;
    m.B("paint", 1.50, 0.04, 0.72, dX, FY+0.74, dZ, 0.5, 0, "#6b7468");
    for(const sd of [-1,1]) m.B("paint", 0.42, 0.70, 0.66, dX+sd*0.52, FY+0.36, dZ, 0.5, 0, "#5f685c");
    m.col(dX-0.76, dX+0.76, dZ-0.38, dZ+0.38, FY, FY+0.78);
    m.B("paint", 0.40, 0.30, 0.36, dX-0.30, FY+0.91, dZ+0.05, 0.4, 0, "#cfc8b4");     // a dead monitor
    m.B("tvglass", 0.32, 0.22, 0.01, dX-0.30, FY+0.92, dZ+0.235, 0, 0, "#1b2226");
    for(let i=0;i<6;i++)
      m.P("paper", boxGeo(0.21, 0.004, 0.30, 0.5), dX+0.25+R()*0.35, FY+0.7635+i*0.0045, dZ+(R()-0.5)*0.3,
          R()*0.8, "#d8d2c0");
    { // the chair, pulled in to the desk and facing it
      const qx=dX+0.05, qz=dZ+0.78;
      m.C("metal", 0.26,0.26,0.03,10, qx, FY+0.06, qz, "#3a3936");
      m.C("metal", 0.025,0.025,0.40,8, qx, FY+0.27, qz, "#3a3936");
      m.B("fabric", 0.46, 0.08, 0.44, qx, FY+0.50, qz, 0.5, 0, "#2f3a44");
      m.B("fabric", 0.44, 0.46, 0.07, qx, FY+0.80, qz+0.22, 0.5, 0, "#2f3a44", -0.10);
      addSeat(W(qx), Z(qz), GY+FY+0.56, 0, "THE FOREMAN'S CHAIR");
      m.col(qx-0.25, qx+0.25, qz-0.25, qz+0.25, FY, FY+0.5);
    }
    m.B("paint", 0.48, 1.32, 0.62, cx1-0.32, FY+0.66, cz1-0.42, 0.5, 0, "#7d8478");   // filing cabinet
    for(let i=0;i<4;i++) m.B("metal", 0.03, 0.025, 0.16, cx1-0.575, FY+0.25+i*0.32, cz1-0.42, 0, 0, "#b8b4a8");
    m.col(cx1-0.58, cx1, cz1-0.75, cz1, FY, FY+1.35);
    m.P("oak", boxGeo(0.02, 0.60, 0.90, 0), cx1-0.025, FY+1.55, cz0+2.0, 0, "#6b4a2c");   // a pin board
    for(let i=0;i<5;i++)
      m.P("paper", planeGeo(0.18, 0.24, 0), cx1-0.037, FY+1.45+(i%2)*0.22, cz0+1.68+i*0.15, -Math.PI/2,
          ["#d8d2c0","#e0d8b8","#cfd6d8"][i%3], 0, (R()-0.5)*0.2);
  }

  /* --- the far wall: the fire door, and somebody cut the chain ---------
     It opens now, onto the passage to the old baths (14h-pool.js). The
     chain hangs off one side of the frame where it was cut, and the
     padlock is still locked, on the floor. */
  {
    const fz=AISLE[3], xw=HX0-WT/2;
    for(const z of [FD0+0.05, FD1-0.05])                                       // the frame
      m.B("metal", WT+0.12, FDH+0.10, 0.10, xw, FY+(FDH+0.10)/2, z, 0.4, 0, "#4a4e50");
    m.B("metal", WT+0.14, 0.11, FD1-FD0, xw, FY+FDH+0.035, fz, 0.4, 0, "#4a4e50");
    m.flat(HX0-WT-0.3, HX0+0.3, FD0, FD1, FY);
    makeDoor(XF(W(xw), Z(FD1-0.10), Math.PI/2), 0, GY+FY+0.02, 0, "THE BATHS", false, 0, "steel");
    for(let i=0;i<6;i++)                                                       // the cut chain
      m.P("metal", new T.TorusGeometry(0.035, 0.010, 5, 10), HX0+0.07, FY+1.00-i*0.06,
          FD0+0.11, 0, "#6a6660", (i%2)*Math.PI/2, 0);
    m.B("brass", 0.06, 0.07, 0.04, HX0+0.45, FY+0.035, fz+0.30, 0, 0.6, "#8a7a40");   // the padlock
    m.P("metal", new T.TorusGeometry(0.022, 0.006, 5, 10), HX0+0.45, FY+0.075, fz+0.30, 0.6, "#8a8a84");
  }

  /* --- the floor: lines, oil, tyre marks, paper ----------------------- */
  {
    /* Each decal takes the rung above the highest one already under it
       (the diner's LY rule): cycling a counter put two overlapping marks
       on the same rung whenever the count came round. Rungs are 0.6 mm,
       from 10 mm up; 24 of them stay under the 25 mm the lane lines and
       anything else standing on the floor start at. */
    const placed=[];
    const decAt=(x,z,r)=>{
      let k=0;
      for(const q of placed) if(Math.hypot(q[0]-x, q[1]-z)<q[2]+r) k=Math.max(k, q[3]+1);
      k=Math.min(k, 23); placed.push([x,z,r,k]);
      return FY+0.0115+k*0.0006;
    };
    // aisle edge lines, worn through in places
    RACKS.forEach(rk=>{
      const za=rk[2]<0 ? rk[0]-0.20 : rk[1]+0.20;
      let x=RX0;
      while(x<RX1-0.5){
        const len=1.5+R()*5.5, e=Math.min(RX1, x+len);
        m.P("paint", boxGeo(e-x, 0.003, 0.08, 0), (x+e)/2, FY+0.0085, za, 0, "#b8902a");
        x=e+0.3+R()*1.6;
      }
    });
    // oil, under where things stood and stand
    for(let i=0;i<26;i++){
      const z=pick(AISLE)+(R()-0.5)*2.0, x=RX0+R()*(RX1-RX0+8), w=0.6+R()*1.6, d=0.5+R()*1.2;
      m.P("stain", streakGeo(w, d, 0), x, decAt(x,z,Math.hypot(w,d)/2), z, R()*3, "#2a241c", -Math.PI/2, 0);
    }
    // tyre tracks: long dark arcs out of the staging bay and down the aisles
    for(let i=0;i<9;i++){
      const z0=pick(AISLE)+(R()-0.5)*1.4, x0=-128-R()*4, len=8+R()*20;
      for(let k=0;k<6;k++){
        const x=x0-k*len/6, z=z0+Math.sin(k*0.5+i)*0.3;
        m.P("soot", planeGeo(len/6+0.2, 0.16, 0), x, decAt(x,z,len/12+0.1), z, 0, "#151210", -Math.PI/2, 0);
      }
    }
    // paper, shrink wrap, a glove
    for(let i=0;i<40;i++){
      const z=pick(AISLE)+(R()-0.5)*3.0, x=RX0-6+R()*(RX1-RX0+14);
      m.P("paper", planeGeo(0.21, 0.30, 0), x, decAt(x,z,0.19), z, R()*3, pick(["#d8d2c0","#cfc8b4","#e2dccb"]),
          -Math.PI/2, 0);
    }
    // shrink wrap, balled up and trodden flat: a crumpled sheet, not a stone
    for(let i=0;i<14;i++){
      const g=new T.IcosahedronGeometry(0.22+R()*0.12, 0); g.scale(1.0, 0.16+R()*0.10, 0.75);
      m.P("plaster", g, RX0-5+R()*(RX1-RX0+10), FY+0.025, pick(AISLE)+(R()-0.5)*2.6, R()*3,
          "#d4d8d2", 0, 0);
    }
  }

  /* --- the leak in the north-west corner ------------------------------ */
  {
    const lx=-174.2, lz=33.6;
    m.P("mirrorw", planeGeo(3.4, 2.2, 0), lx, FY+0.016, lz, 0.3, "#20262a", -Math.PI/2, 0);
    m.P("stain", streakGeo(4.2, 3.0, 0), lx, FY+0.0145, lz, 0.3, "#3a3024", -Math.PI/2, 0);
    m.P("stain", streakGeo(1.2, 3.0, 0), HX0+0.015, FY+HH-2.2, lz, Math.PI/2, "#3a3024", 0, 0);
    m.C("paint", 0.17,0.14,0.30,14, lx+0.4, FY+0.15, lz-0.2, "#5a6a72");          // a bucket, full
    m.C("mirrorw", 0.16,0.16,0.01,14, lx+0.4, FY+0.27, lz-0.2, "#20262a");
    m.col(lx+0.2, lx+0.6, lz-0.4, lz, FY, FY+0.3);
  }

  /* --- cobwebs in the racking ----------------------------------------- */
  for(let i=0;i<30;i++){
    const rk=pick(RACKS), x=frameAt(Math.floor(R()*(NB+1))), y=FY+pick([2.0,3.8,5.6,7.4])-0.04;
    const za=rk[2]<0 ? rk[0] : rk[1];
    m.P("soot", planeGeo(0.6, 0.6, 0), x+0.30, y-0.30, za+rk[2]*0.012, 0, "#d2cdbe", 0, 0.7);
  }

  /* --- light ------------------------------------------------------------
     Thirty-six high-bays on drop rods between the roof beams, over every
     aisle and down both cross aisles. Eleven still strike. The live ones
     carry a real lamp and a pool on the floor; the dead ones are drawn
     exactly the same with a dark lamp in them, so you read them as dead
     rather than as missing. */
  const FIXX=[-137.15, -145.46, -153.77, -162.08];
  const FIX=[];
  for(const z of AISLE) for(const x of FIXX) FIX.push([x,z]);
  for(const z of [-1.5, 9.15, 21.35, 30.0]) FIX.push([-127.3, z]);
  for(const z of [-1.5, 9.15, 21.35, 30.0]) FIX.push([-173.4, z]);
  FIX.push([-127.3, AISLE[3]]); FIX.push([-173.4, AISLE[3]]);
  const SOD=0xffb064, MERC=0xcfe6ff;
  const LIVE=[                                    // [x, z, colour, intensity, flickers]
    [-127.3,  AISLE[3], SOD, 1.05],               // the first thing you see through the curtain
    [-145.46, AISLE[3], SOD, 1.05],
    [-162.08, AISLE[3], SOD, 0.95],
    [-173.4,  AISLE[3], MERC,0.85, true],         // and the last, cold, at the far wall
    [-137.15, AISLE[1], SOD, 0.95],
    [-153.77, AISLE[0], SOD, 0.90],
    [-162.08, AISLE[5], SOD, 0.95],
    [-137.15, AISLE[6], MERC,0.80],
    [-127.3,  30.0,     SOD, 0.95],
    [-127.3,  -1.5,     SOD, 0.95, true],
    [-153.77, AISLE[4], SOD, 1.00],
  ];
  const liveAt=(x,z)=>LIVE.find(l=>Math.abs(l[0]-x)<0.01 && Math.abs(l[1]-z)<0.01);
  const gRefl=shadeGeo(0.12, 0.34, 0.36, 16), gLine=shadeGeo(0.112, 0.33, 0.35, 16);
  for(const f of FIX){
    const [x,z]=f, L=liveAt(x,z), lv=L?{c:L[2], i:L[3], f:!!L[4]}:null, y=FY+HH-1.55;
    m.C("metal", 0.012,0.012,1.21,6, x, FY+HH-0.605, z, "#5a5450");             // the drop rod
    m.C("paint", 0.10,0.12,0.16,12, x, y+0.26, z, "#3a3e40");                   // the ballast can
    m.P("metal", gRefl, x, y, z, 0, "#6d7274");
    m.P("shadein", gLine, x, y-0.002, z, 0, "#cfcabc");
    m.P(lv?(lv.c===MERC?"hbcold":"bulkhead"):"glass", domeGeo(0.20, 0.09, 14), x, y-0.17, z, 0,
        lv?"#ffffff":"#5a5a54");
    if(!lv) continue;
    const o={color:lv.c, intensity:lv.i, dist:19, decay:1.45, indoor:true, vol:VOL};
    if(lv.f) o.flicker=true;
    m.lamp(x, y-0.35, z, o);
    m.P("floorglowb", planeGeo(7.0, 7.0, 0), x, FY+0.020+FIX.indexOf(f)*0.0007, z, 0,
        lv.c===SOD?"#ffb064":"#bcd8ff", -Math.PI/2, 0);
  }

  /* --- the passage, and the curtain at the end of it ------------------ */
  {
    // floor and roof slabs: the floor runs from the stores' own slab edge to
    // the end room's (both oversail), and its face covers the threshold
    m.B("concrete", (PX1-OS)-(HX1+WT+OS), 0.50, PZ1-PZ0+2*WT+2*OS, ((PX1-OS)+(HX1+WT+OS))/2, FY-0.25,
        (PZ0+PZ1)/2, 0.5, 0, CONCD);
    m.P("concrete", planeGeo((PX1-OS)-HX1, PZ1-PZ0, 0.5), ((PX1-OS)+HX1)/2, FY+0.006, (PZ0+PZ1)/2,
        0, FLR, -Math.PI/2, 0);
    m.B("concrete", PX1-PX0, 0.50, PZ1-PZ0+2*WT+2*OS, (PX0+PX1)/2, FY+PH+0.25, (PZ0+PZ1)/2, 0.5, 0, "#4a4741");
    wall(PX0, PX1, PZ0-WT, PZ0, -0.1, PH+0.4);
    wall(PX0, PX1, PZ1, PZ1+WT, -0.1, PH+0.4);
    for(const q of [[PZ0, 1],[PZ1, -1]]){
      m.P("paint", planeGeo(PX1-PX0, 1.20, 0.5), (PX0+PX1)/2, FY+0.60, q[0]+q[1]*0.010,
          q[1]>0?0:Math.PI, PAINTD, 0, 0);
      m.P("stain", streakGeo(1.6, 1.4, 0), (PX0+PX1)/2+(q[1]*0.4), FY+1.5, q[0]+q[1]*0.013,
          q[1]>0?0:Math.PI, "#3e3228", 0, 0);
    }
    m.flat(HX1, PX1+0.3, PZ0, PZ1, FY);
    m.voidAt(HX1, PX1+0.6, PZ0-WT-0.3, PZ1+WT+0.3, FY-1.0, FY+PH+0.6, FY);
    // one caged bulkhead on the passage ceiling, working
    const bxp=(PX0+PX1)/2;
    m.C("metal", 0.10,0.10,0.04,12, bxp, FY+PH-0.02, (PZ0+PZ1)/2, "#4e4a44");
    m.P("bulkhead", domeGeo(0.085, 0.07, 12), bxp, FY+PH-0.04, (PZ0+PZ1)/2, 0, "#ffffff");
    for(let k=0;k<3;k++)
      m.C("metal", 0.008,0.008,0.17,5, bxp, FY+PH-0.07, (PZ0+PZ1)/2, "#3e3a34", 0, k*1.05, Math.PI/2);
    m.lamp(bxp, FY+PH-0.20, (PZ0+PZ1)/2, {color:0xffdcae, intensity:0.42, dist:5.5, decay:1.7,
           indoor:true, vol:[W(HX1-4), W(EX0+3.5), Z(PZ0-3), Z(PZ1+3), GY+FY-1, GY+FY+PH+0.8]});
    /* What is left of the strip curtain: two strips at each side and one
       torn off at head height in the middle. A full curtain of milky PVC
       across the opening read, from the passage, as a grey wall with the
       room faintly behind it — and nothing in the way in should be hidden.
       The middle metre is clear. */
    m.B("metal", 0.06, 0.06, PZ1-PZ0+0.10, HX1-0.03, FY+PH+0.03, (PZ0+PZ1)/2, 0.4, 0, "#5a5f62");
    for(let i=0;i<9;i++){
      if(i>1 && i<7 && i!==4) continue;
      const len=(i===4)?0.42:PH-0.06;
      m.P("glass", boxGeo(0.004, len, 0.22, 0), HX1-0.036+(i%2)*0.006, FY+PH-len/2, PZ0+0.09+i*0.20,
          0, "#cfdcd8", 0, 0);
    }
  }

  /* --- signs: EXIT over both doors, and the aisle boards --------------- */
  const exitTex=signTex(256,96,(x,w,h)=>{
    x.fillStyle="#0e2a16"; x.fillRect(0,0,w,h);
    x.fillStyle="#4cff7a"; fitText(x, "EXIT", w*0.70, 74, w/2, h/2+3);
  });
  for(const e of [[HX1, -1, (PZ0+PZ1)/2, FY+PH+0.42],[HX0, 1, AISLE[3], FY+2.75]]){
    m.B("paint", 0.10, 0.20, 0.44, e[0]+e[1]*0.05, e[3], e[2], 0.4, 0, "#d8d6cc");
    signPanel(0.38, 0.14, exitTex, W(e[0]+e[1]*0.106), GY+e[3], Z(e[2]), e[1]*Math.PI/2, true);
  }
  AISLE.forEach((az,i)=>{
    const t=signTex(256,128,(x,w,h)=>{
      x.fillStyle="#e2ddcc"; x.fillRect(0,0,w,h);
      x.fillStyle="#1f2a36"; x.fillRect(6,6,w-12,h-12);
      x.fillStyle="#e2ddcc"; fitText(x, "AISLE", w*0.6, 30, w/2, 30);
      x.fillStyle="#f0c23a"; fitText(x, String(i+1).padStart(2,"0"), w*0.6, 72, w/2, 84);
    });
    const x=RX1, y=FY+8.05, top=FY+HH-0.85;          // hung from the beam over the racks' east end
    m.B("paint", 0.04, 0.62, 1.22, x, y, az, 0.4, 0, "#1f2a36");
    for(const o of [-0.45,0.45]) m.C("metal", 0.006,0.006, top-(y+0.31), 4, x, (y+0.31+top)/2, az+o, "#5a5450");
    signPanel(1.18, 0.59, t, W(x+0.025), GY+y, Z(az), Math.PI/2, false);
  });

  addBuried(W(HX0-WT-1.0), W(PX1+0.4), Z(HZ0-WT-1.0), Z(HZ1+WT+1.0), GY+FY-1.0, GY+FY+HH+1.4);
  addZone(W(HX0), W(HX1), Z(HZ0), Z(HZ1), GY+FY-1, GY+FY+HH, "THE STORES", true);
  addZone(W(HX1), W(PX1), Z(PZ0), Z(PZ1), GY+FY-1, GY+FY+PH, "THE STORES", true);
})();
