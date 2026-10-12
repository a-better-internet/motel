"use strict";
/* LOW DESERT MOTEL · 14i-rink.js
   the locker rooms and the rink: through the doorway in the baths' north wall
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   THE LOCKER ROOMS, AND THE ICE

   The doorway in the north wall of the baths, under CHANGING ROOMS, is not
   a changing room. It is a long hallway of lockers with benches down the
   middle, rubber underfoot, every tube in the ceiling working — the first
   place down here that somebody is still looking after. The lockers are
   shut. There is an open shower bay off one side and a whiteboard with a
   play drawn on it off the other, and at the end a steel door that says
   ICE.

   Behind it is a rink. Not an old one: the ice is fresh, the paint under it
   is bright, the boards are white and the glass is clean, the seats are all
   down and the scoreboard over centre ice is lit and reads nothing to
   nothing in the first period with twenty minutes on the clock. There is
   nobody here. There is nobody here and the lights are on.

   It is under the lookout butte, so there is ninety metres of rock over the
   roof and room for a building the size of an arena. Same frame as the
   stores, the hall and the baths (mk(-80, 340)), same floor.
   ---------------------------------------------------------------------- */
(function rink(){
  const SX=-80, SZ=340;
  const m=mk(SX,SZ), GY=m.y;
  const W=(x)=>SX+x, Z=(z)=>SZ+z;
  let _s=90127;
  const R=()=>((_s=(_s*16807)%2147483647)-1)/2147483646;

  /* --- the one page of numbers --------------------------------------- */
  const FY=-11.40, OS=0.08;
  const BD=BATHS_DOOR;                                   // the doorway out of the baths
  // the hallway, from the baths' north wall (outer face z 25.20) to the rink
  const LX0=-192.60, LX1=-188.60, LXC=(LX0+LX1)/2, LZ0=BD.z+0.50, LZ1=54.00;
  const LH=2.80, LWT=0.30;
  const SB0=38.00, SB1=41.00, SBX=LX0-2.40;              // the shower bay off its west side
  // the rink: a hall 47 x 63, ice 24 x 54 with 7.5 m corners, stands either side
  const RWT=0.50, RX0=LXC-23.5, RX1=LXC+23.5, RZ0=LZ1+0.40, RZ1=RZ0+63.0, RH=13.0;
  const CX=LXC, CZ=(RZ0+RZ1)/2, IW=12.0, IL=27.0, CR=7.5;
  const DW0=LXC-0.54, DW1=LXC+0.54, DH=2.14;             // the door into it

  const WALLC="#d8d5ca", NAVY="#24365a", STRIPE="#a8322a", RUBBER="#3a3d42";
  const VOLH=[W(SBX-0.5), W(LX1+LWT+0.3), Z(LZ0-0.3), Z(LZ1+0.4), GY+FY-1, GY+FY+LH+0.6];
  const VOLR=[W(RX0-0.5), W(RX1+0.5), Z(RZ0-0.6), Z(RZ1+0.5), GY+FY-1, GY+FY+RH+0.6];

  // a wall that starts on the floor goes half a metre under it; one that
  // starts higher (a lintel) stops where it is
  const wall=(bk,x0,x1,z0,z1,y0,y1,c,uv)=>{
    m.B(bk, x1-x0, y1-y0, z1-z0, (x0+x1)/2, FY+(y0+y1)/2, (z0+z1)/2, uv||0.833, 0, c);
    m.col(x0, x1, z0, z1, FY+y0-(y0<=0?0.5:0), FY+y1);
  };
  // a painted band on one face of a wall: ax "x" runs along x at z=c facing
  // n (+1 = +z); ax "z" runs along z at x=c
  const band=(ax, a0, a1, c, n, y0, y1, col, off)=>{
    const L=a1-a0, mid=(a0+a1)/2, o=off||0.010;
    if(ax==="x") m.P("block", planeGeo(L, y1-y0, 0.833), mid, FY+(y0+y1)/2, c+n*o, n>0?0:Math.PI, col, 0, 0);
    else         m.P("block", planeGeo(L, y1-y0, 0.833), c+n*o, FY+(y0+y1)/2, mid, n>0?Math.PI/2:-Math.PI/2, col, 0, 0);
  };
  const sign=(w,h,txt,bg,fg,x,y,z,ry,size)=>signPanel(w, h, signTex(Math.round(w*240), Math.round(h*240), (t,cw,ch)=>{
    t.fillStyle=bg; t.fillRect(0,0,cw,ch); t.fillStyle=fg; fitText(t, txt, cw*0.88, size||ch*0.62, cw/2, ch/2+2);
  }), W(x), GY+FY+y, Z(z), ry, false);

  /* ==================================================================
     THE HALLWAY
     ================================================================== */
  {
    // the slab, the rubber on it, and the walking surface
    m.B("concrete", (LX1+LWT+OS)-(LX0-LWT-OS), 0.50, LZ1-(LZ0+OS), LXC, FY-0.25, (LZ0+OS+LZ1)/2, 0.5, 0, "#6e6a62");
    m.B("concrete", (LX0-LWT-OS)-(SBX-LWT-OS), 0.50, (SB1+LWT+OS)-(SB0-LWT-OS), (SBX-LWT-OS+LX0-LWT-OS)/2,
        FY-0.25, (SB0+SB1)/2, 0.5, 0, "#6e6a62");
    m.P("lino", planeGeo(LX1-LX0, LZ1-LZ0, 0.6), LXC, FY+0.006, (LZ0+LZ1)/2, 0, RUBBER, -Math.PI/2, 0);
    m.flat(LX0, LX1, LZ0-0.1, LZ1+0.1, FY);
    m.flat(SBX, LX0, SB0, SB1, FY);

    // walls: the west one in two pieces round the shower bay, which owns its own
    wall("block", LX0-LWT, LX0, LZ0, SB0-LWT, -0.1, LH+0.4, WALLC);
    wall("block", LX0-LWT, LX0, SB1+LWT, LZ1, -0.1, LH+0.4, WALLC);
    wall("block", LX1, LX1+LWT, LZ0, LZ1, -0.1, LH+0.4, WALLC);
    wall("bath", SBX-LWT, SBX, SB0-LWT, SB1+LWT, -0.1, LH+0.4, "#d8dcd8", 1.2);
    wall("bath", SBX, LX0, SB0-LWT, SB0, -0.1, LH+0.4, "#d8dcd8", 1.2);
    wall("bath", SBX, LX0, SB1, SB1+LWT, -0.1, LH+0.4, "#d8dcd8", 1.2);
    // the ceiling: acoustic tile in a grid, and a light in every other tile
    m.B("ceil", (LX1+LWT+OS)-(SBX-LWT-OS), 0.30, LZ1-LZ0, (LX1+LWT+OS+SBX-LWT-OS)/2, FY+LH+0.15,
        (LZ0+LZ1)/2, 0.45, 0, "#d8d6ce");
    for(let x=LX0+0.6; x<LX1-0.1; x+=0.6)
      m.P("soot", planeGeo(0.022, LZ1-LZ0, 0), x, FY+LH-0.004, (LZ0+LZ1)/2, 0, "#3a3a3a", Math.PI/2, 0);
    for(let z=LZ0+1.2; z<LZ1; z+=1.2)
      m.P("soot", planeGeo(LX1-LX0, 0.022, 0), LXC, FY+LH-0.005, z, 0, "#3a3a3a", Math.PI/2, 0);
    for(let i=0;i<8;i++){
      const z=LZ0+2.4+i*3.6;
      m.B("metal", 0.64, 0.03, 1.24, LXC, FY+LH-0.012, z, 0.4, 0, "#c8c8c4");
      m.P("hbcold", planeGeo(0.56, 1.16, 0), LXC, FY+LH-0.029, z, 0, "#ffffff", Math.PI/2, 0);
      if(i%2===0) m.lamp(LXC, FY+LH-0.4, z, {color:0xeef2ff, intensity:0.62, dist:10, decay:1.5, indoor:true, vol:VOLH});
    }
    m.voidAt(SBX-LWT-0.3, LX1+LWT+0.3, LZ0-0.3, LZ1+0.2, FY-1.0, FY+LH+0.6, FY);

    // painted block: navy to the dado, a red stripe, off-white above
    for(const q of [["z", LZ0, SB0-LWT, LX0, 1],["z", SB1+LWT, LZ1, LX0, 1],["z", LZ0, LZ1, LX1, -1]]){
      band(q[0], q[1], q[2], q[3], q[4], 0, 1.20, NAVY);
      band(q[0], q[1], q[2], q[3], q[4], 1.20, 1.30, STRIPE, 0.011);
    }
    // the far end, round the door into the rink
    band("x", LX0, DW0-0.10, LZ1, -1, 0, 1.20, NAVY); band("x", DW1+0.10, LX1, LZ1, -1, 0, 1.20, NAVY);
    band("x", LX0, DW0-0.10, LZ1, -1, 1.20, 1.30, STRIPE, 0.011); band("x", DW1+0.10, LX1, LZ1, -1, 1.20, 1.30, STRIPE, 0.011);
    /* and the near end, which is the back of the baths' north wall: green
       glazed brick on this side too until it is painted like the rest */
    for(const q of [[LX0, BD.x0],[BD.x1, LX1]]){
      band("x", q[0], q[1], LZ0, 1, 0, LH, WALLC, 0.009);
      band("x", q[0], q[1], LZ0, 1, 0, 1.20, NAVY, 0.010);
      band("x", q[0], q[1], LZ0, 1, 1.20, 1.30, STRIPE, 0.011);
    }
    band("x", BD.x0, BD.x1, LZ0, 1, BD.h, LH, WALLC, 0.009);

    /* The lockers: tall steel, blue, on a plinth, in banks down both walls,
       every one shut and every one numbered. The breaks in the banks are
       where the shower bay and the whiteboard are. */
    let num=1;
    const bank=(xw, n, z0, z1)=>{                       // n: +1 west wall (faces +x), -1 east wall
      const D=0.45, cxw=xw+n*D/2;
      m.B("concrete", D, 0.10, z1-z0, cxw, FY+0.05, (z0+z1)/2, 0.5, 0, "#2a2c30");
      for(let z=z0+0.20; z<z1-0.10; z+=0.40){
        m.B("paint", D-0.02, 1.86, 0.39, cxw, FY+0.10+0.93, z, 0.4, 0, "#2c4f86");
        const fx=xw+n*(D-0.01);                          // the door face
        for(let v=0;v<5;v++)
          m.B("paint", 0.006, 0.02, 0.24, fx+n*0.003, FY+1.62+v*0.045, z, 0, 0, "#1a2c4c");
        for(let v=0;v<3;v++)
          m.B("paint", 0.006, 0.02, 0.24, fx+n*0.003, FY+0.30+v*0.045, z, 0, 0, "#1a2c4c");
        m.B("metal", 0.03, 0.14, 0.04, fx+n*0.015, FY+1.08, z+0.12, 0, 0, "#b8bcbe");
        m.B("brass", 0.006, 0.05, 0.09, fx+n*0.004, FY+1.40, z, 0, 0, "#c8a850");
        if(R()<0.22)                                    // a name on tape
          m.P("paper", planeGeo(0.20, 0.035, 0), fx+n*0.008, FY+1.50, z, n>0?Math.PI/2:-Math.PI/2, "#e8e4d6", 0, 0);
        num++;
      }
      m.col(Math.min(xw, xw+n*D), Math.max(xw, xw+n*D), z0, z1, FY, FY+2.0);
    };
    bank(LX0, 1, LZ0+0.6, SB0-LWT-0.1);
    bank(LX0, 1, SB1+LWT+0.1, LZ1-0.3);
    bank(LX1, -1, LZ0+0.6, SB0-0.4);
    bank(LX1, -1, SB1+0.4, LZ1-0.3);

    // benches down the middle, slatted, on steel legs; a gap at the bay
    const bench=(z0,z1)=>{
      for(let k=0;k<3;k++)
        m.B("oak", 0.11, 0.04, z1-z0, LXC-0.13+k*0.13, FY+0.46, (z0+z1)/2, 0.5, 0, "#b08a5a");
      for(let z=z0+0.25; z<=z1-0.2; z+=1.5)
        for(const sx of [-0.15,0.15]) m.B("metal", 0.04, 0.44, 0.04, LXC+sx, FY+0.22, z, 0, 0, "#5a5e62");
      m.col(LXC-0.21, LXC+0.21, z0, z1, FY, FY+0.48);
    };
    bench(LZ0+2.0, SB0-0.8); bench(SB1+0.8, LZ1-2.6);
    // and what was left on them: a bag, a pair of skates, tape, a bottle
    m.B("fabric", 0.36, 0.30, 0.80, LXC, FY+0.63, 31.0, 0.5, 0.08, "#1e2a40");
    m.C("metal", 0.02, 0.02, 0.36, 8, LXC, FY+0.80, 31.0, "#b8bcbe", 0, 0.08, Math.PI/2);
    for(const sz of [-0.1, 0.1]){
      m.B("fabric", 0.10, 0.16, 0.28, LXC+sz, FY+0.56, 46.0, 0.5, 0, "#2a2a2c");
      m.B("metal", 0.012, 0.03, 0.30, LXC+sz, FY+0.465, 46.0, 0, 0, "#d8dcde");
    }
    m.C("fabric", 0.05, 0.05, 0.025, 12, LXC+0.08, FY+0.49, 47.2, "#e8e8e4");
    m.C("plaster", 0.035, 0.035, 0.24, 10, LXC-0.10, FY+0.60, 49.0, "#c83a2a");
    // a stick against the lockers
    m.P("oak", boxGeo(0.03, 1.55, 0.02, 0), LX1-0.50, FY+0.76, 35.4, 0, "#c8a46a", 0, 0.08);
    m.P("oak", boxGeo(0.03, 0.06, 0.30, 0), LX1-0.56, FY+0.03, 35.5, 0, "#2a2a2c", 0, 0);

    /* The shower bay: open to the hallway, white tile, four heads, a drain,
       dry. */
    m.P("bath", planeGeo(LX0-SBX, SB1-SB0, 1.2), (SBX+LX0)/2, FY+0.007, (SB0+SB1)/2, 0, "#c8ccc8", -Math.PI/2, 0);
    m.C("metal", 0.06, 0.06, 0.006, 12, (SBX+LX0)/2, FY+0.011, (SB0+SB1)/2, "#4a4e50");
    for(let k=0;k<4;k++){
      const z=SB0+0.45+k*0.70;
      m.C("metal", 0.012, 0.012, 0.26, 6, SBX+0.13, FY+2.05, z, "#b8bcbe", 0, 0, Math.PI/2);
      m.C("metal", 0.05, 0.035, 0.05, 10, SBX+0.26, FY+2.02, z, "#b8bcbe", 0, 0, -0.6);
      m.C("metal", 0.03, 0.03, 0.03, 8, SBX+0.02, FY+1.15, z, "#b8bcbe", 0, 0, Math.PI/2);
    }
    m.lamp(SBX+1.2, FY+LH-0.3, (SB0+SB1)/2, {color:0xeef2ff, intensity:0.30, dist:5, decay:1.6, indoor:true, vol:VOLH});
    sign(0.80, 0.18, "SHOWERS", "#e6e2d6", "#24365a", SBX+0.012, 2.40, (SB0+SB1)/2, Math.PI/2);

    // across from it: the whiteboard with a play on it, and the stick rack
    m.B("metal", 0.03, 1.00, 1.70, LX1-0.015, FY+1.55, (SB0+SB1)/2, 0.4, 0, "#b8bcbe");
    signPanel(1.62, 0.92, signTex(486,276,(t,w,h)=>{
      t.fillStyle="#f4f4f0"; t.fillRect(0,0,w,h);
      t.strokeStyle="#9aa8b8"; t.lineWidth=2;                     // half a rink, in outline
      t.strokeRect(20,20,w-40,h-40); t.beginPath(); t.arc(w/2, h-20, 60, Math.PI, 0); t.stroke();
      t.fillStyle="#c83a2a"; t.font="700 22px Arial"; t.textAlign="center"; t.textBaseline="middle";
      for(const q of [[150,90,"X"],[330,90,"X"],[240,150,"X"]]) t.fillText(q[2], q[0], q[1]);
      t.fillStyle="#24365a";
      for(const q of [[120,200],[360,200],[240,230]]){ t.beginPath(); t.arc(q[0],q[1],12,0,7); t.stroke(); }
      t.strokeStyle="#24365a"; t.lineWidth=3; t.setLineDash([10,7]);
      t.beginPath(); t.moveTo(120,188); t.quadraticCurveTo(140,110, 230,96); t.stroke();
      t.beginPath(); t.moveTo(360,188); t.lineTo(300,130); t.stroke(); t.setLineDash([]);
      t.font="700 20px Arial"; t.fillStyle="#24365a"; t.textAlign="left"; t.fillText("2ND PERIOD — SAME AS 1ST", 30, 40);
    }), W(LX1-0.032), GY+FY+1.55, Z((SB0+SB1)/2), -Math.PI/2, false);
    // a shelf under it: pucks, tape, a crate of bottles
    m.B("oak", 0.30, 0.04, 1.60, LX1-0.15, FY+0.80, (SB0+SB1)/2, 0.5, 0, "#6a4a2c");
    for(const sz of [-0.6, 0.6]) m.B("metal", 0.28, 0.03, 0.03, LX1-0.15, FY+0.76, (SB0+SB1)/2+sz, 0, 0, "#5a5e62");
    for(let k=0;k<6;k++)
      m.C("paint", 0.038, 0.038, 0.025, 12, LX1-0.12-(k%2)*0.09, FY+0.835+Math.floor(k/4)*0.026,
          (SB0+SB1)/2-0.55+(k%4)*0.09, "#141416");
    m.C("fabric", 0.05, 0.05, 0.025, 12, LX1-0.16, FY+0.835, (SB0+SB1)/2+0.05, "#e8e8e4");
    m.B("paint", 0.28, 0.24, 0.40, LX1-0.15, FY+0.94, (SB0+SB1)/2+0.45, 0.4, 0, "#2a3a5a");
    for(let k=0;k<6;k++)
      m.C("plaster", 0.035, 0.035, 0.24, 10, LX1-0.22+(k%2)*0.12, FY+1.06, (SB0+SB1)/2+0.32+Math.floor(k/2)*0.13,
          k%3?"#c83a2a":"#2a5a9a");
    m.col(LX1-0.32, LX1, SB0+0.6, SB1-0.6, FY, FY+0.82);

    // the far end: the door, ICE over it, the clock, an extinguisher
    sign(1.00, 0.30, "ICE", "#24365a", "#e8e6dc", LXC, 2.62, LZ1-0.012, Math.PI, 0.24*240);
    m.C("paint", 0.18, 0.18, 0.04, 18, LX0+0.70, FY+2.35, LZ1-0.02, "#2a2c30", Math.PI/2, 0, 0);
    m.P("clockface", new T.CircleGeometry(0.155, 24), LX0+0.70, FY+2.35, LZ1-0.042, Math.PI, "#f0eee6");
    // the extinguisher on the end wall, on its bracket, clear of the door
    m.C("paint", 0.08, 0.08, 0.46, 12, DW1+0.55, FY+0.80, LZ1-0.10, "#b8282a");
    m.C("metal", 0.03, 0.03, 0.08, 8, DW1+0.55, FY+1.07, LZ1-0.10, "#2a2c30");
    m.B("metal", 0.12, 0.05, 0.03, DW1+0.55, FY+0.80, LZ1-0.015, 0.4, 0, "#2a2c30");
    sign(0.90, 0.18, "LOCKER ROOMS", "#e6e2d6", "#24365a", (BD.x0+BD.x1)/2, 2.60, LZ0+0.013, 0);

    addBuried(W(SBX-LWT-0.6), W(LX1+LWT+0.6), Z(LZ0), Z(LZ1+0.2), GY+FY-1.0, GY+FY+LH+0.8, 0xdde4ea);
    addZone(W(SBX), W(LX1), Z(LZ0), Z(LZ1), GY+FY-1, GY+FY+LH, "THE LOCKER ROOMS", true);
  }

  /* ==================================================================
     THE RINK
     ================================================================== */
  {
    // the slab, the rubber floor round the ice, the walls, the roof
    m.B("concrete", (RX1+RWT+OS)-(RX0-RWT-OS), 0.50, (RZ1+RWT+OS)-LZ1, CX, FY-0.25, (LZ1+RZ1+RWT+OS)/2, 0.5, 0, "#6e6a62");
    m.P("lino", planeGeo(RX1-RX0, RZ1-RZ0, 0.5), CX, FY+0.006, CZ, 0, RUBBER, -Math.PI/2, 0);
    m.flat(RX0, RX1, LZ1-0.1, RZ1, FY);
    wall("block", RX0-RWT, RX0, LZ1, RZ1+RWT, -0.1, RH+0.4, WALLC);           // west, owns corners
    wall("block", RX1, RX1+RWT, LZ1, RZ1+RWT, -0.1, RH+0.4, WALLC);           // east
    wall("block", RX0, RX1, RZ1, RZ1+RWT, -0.1, RH+0.4, WALLC);               // north
    wall("block", RX0, DW0-0.06, LZ1, RZ0, -0.1, RH+0.4, WALLC);              // south, round the door
    wall("block", DW1+0.06, RX1, LZ1, RZ0, -0.1, RH+0.4, WALLC);
    wall("block", DW0-0.06, DW1+0.06, LZ1, RZ0, DH+0.06, RH+0.4, WALLC);
    m.B("ceil", (RX1+RWT+OS)-(RX0-RWT-OS), 0.50, (RZ1+RWT+OS)-(LZ1-OS), CX, FY+RH+0.25, (LZ1-OS+RZ1+RWT+OS)/2,
        0.45, 0, "#34363a");
    m.voidAt(RX0-RWT-0.3, RX1+RWT+0.3, LZ1-0.2, RZ1+RWT+0.3, FY-1.0, FY+RH+0.6, FY);
    // the door: a frame, the leaf, and the floor through it
    for(const x of [DW0-0.03, DW1+0.03])
      m.B("metal", 0.08, DH+0.08, RWT*0.4+0.10, x, FY+(DH+0.08)/2, (LZ1+RZ0)/2, 0.4, 0, "#4a4e50");
    m.B("metal", DW1-DW0+0.16, 0.08, RWT*0.4+0.12, LXC, FY+DH+0.04, (LZ1+RZ0)/2, 0.4, 0, "#4a4e50");
    m.flat(DW0, DW1, LZ1-0.2, RZ0+0.2, FY);
    m.P("lino", planeGeo(DW1-DW0, RZ0-LZ1, 0.6), LXC, FY+0.006, (LZ1+RZ0)/2, 0, RUBBER, -Math.PI/2, 0);
    makeDoor(XF(W(DW0), Z((LZ1+RZ0)/2), 0), 0, GY+FY+0.02, 0, "THE ICE", true, 0, "steel");

    // painted block: navy band low on the ends, high over the concourse on
    // the sides, and the arena's name on the south wall over the door
    band("x", RX0, DW0-0.10, RZ0, 1, 0, 1.40, NAVY); band("x", DW1+0.10, RX1, RZ0, 1, 0, 1.40, NAVY);
    band("x", RX0, RX1, RZ1, -1, 0, 1.40, NAVY);
    for(const q of [[RX0, 1],[RX1, -1]]){
      band("z", RZ0, RZ1, q[0], q[1], 4.40, 5.60, NAVY);
      band("z", RZ0, RZ1, q[0], q[1], 5.60, 5.72, STRIPE, 0.011);
    }
    signPanel(14.0, 1.6, signTex(1400,160,(t,w,h)=>{
      t.fillStyle=WALLC; t.fillRect(0,0,w,h);
      t.fillStyle=NAVY; t.font="900 118px 'Arial Black', Impact, Arial, sans-serif";
      t.textAlign="center"; t.textBaseline="middle"; t.fillText("LOW DESERT ICE ARENA", w/2, h/2+6);
    }), W(CX), GY+FY+8.2, Z(RZ0+0.012), 0, false);

    /* --- the ice ------------------------------------------------------ */
    {
      const sh=new T.Shape();
      const x0=-IW, x1=IW, z0=-IL, z1=IL;
      sh.moveTo(x0+CR, z0); sh.lineTo(x1-CR, z0); sh.absarc(x1-CR, z0+CR, CR, -Math.PI/2, 0, false);
      sh.lineTo(x1, z1-CR); sh.absarc(x1-CR, z1-CR, CR, 0, Math.PI/2, false);
      sh.lineTo(x0+CR, z1); sh.absarc(x0+CR, z1-CR, CR, Math.PI/2, Math.PI, false);
      sh.lineTo(x0, z0+CR); sh.absarc(x0+CR, z0+CR, CR, Math.PI, Math.PI*1.5, false);
      const g=new T.ShapeGeometry(sh, 16), p=g.attributes.position, uv=g.attributes.uv;
      // v from the north end, so the lettering at centre ice reads the right
      // way up from the door you come in by
      for(let i=0;i<p.count;i++) uv.setXY(i, (p.getX(i)+IW)/(2*IW), (IL-p.getY(i))/(2*IL));
      uv.needsUpdate=true;
      g.rotateX(-Math.PI/2);                             // facing up; shape y -> -z
      g.computeVertexNormals();
      m.P("ice", g, CX, FY+0.014, CZ, 0, "#ffffff");
    }

    /* --- the boards and the glass ---------------------------------------
       Round the sheet as a chain of short segments: straight runs in 1.8 m
       panels, each corner in sixteen. Every segment is a white board with a
       yellow kick plate and a red cap, and a pane of glass on the cap —
       shoulder height along the sides, high at the ends behind the nets.
       The gates are gaps: the players' benches on the west side, the
       penalty boxes on the east, one in the south end facing the door you
       came in by, and the resurfacer's at the north end. */
    {
      const segs=[];                                     // [x0,z0,x1,z1,nx,nz,end]
      const gates={W:[[CZ-5.9,CZ-5.0],[CZ+5.0,CZ+5.9]], E:[[CZ-2.5,CZ-1.6],[CZ+1.6,CZ+2.5]],
                   S:[[CX-0.55,CX+0.55]], N:[[CX-1.6,CX+1.6]]};
      const run=(a0,a1,fix,ax,nx,nz,gs,end)=>{
        const cuts=[a0]; for(const g of gs){ cuts.push(g[0], g[1]); } cuts.push(a1);
        for(let i=0;i<cuts.length;i+=2){
          const s0=cuts[i], s1=cuts[i+1], n=Math.max(1, Math.round((s1-s0)/1.8));
          for(let k=0;k<n;k++){
            const u0=s0+(s1-s0)*k/n, u1=s0+(s1-s0)*(k+1)/n;
            segs.push(ax==="z" ? [fix,u0,fix,u1,nx,nz,end,false] : [u0,fix,u1,fix,nx,nz,end,false]);
          }
        }
      };
      run(CZ-IL+CR, CZ+IL-CR, CX-IW, "z", -1, 0, gates.W, false);
      run(CZ-IL+CR, CZ+IL-CR, CX+IW, "z",  1, 0, gates.E, false);
      run(CX-IW+CR, CX+IW-CR, CZ-IL, "x", 0, -1, gates.S, true);
      run(CX-IW+CR, CX+IW-CR, CZ+IL, "x", 0,  1, gates.N, true);
      for(const c of [[CX+IW-CR, CZ-IL+CR, -Math.PI/2],[CX+IW-CR, CZ+IL-CR, 0],
                      [CX-IW+CR, CZ+IL-CR, Math.PI/2],[CX-IW+CR, CZ-IL+CR, Math.PI]])
        for(let k=0;k<16;k++){
          const a0=c[2]+k*(Math.PI/2)/16, a1=c[2]+(k+1)*(Math.PI/2)/16, am=(a0+a1)/2;
          segs.push([c[0]+Math.cos(a0)*CR, c[1]+Math.sin(a0)*CR, c[0]+Math.cos(a1)*CR, c[1]+Math.sin(a1)*CR,
                     Math.cos(am), Math.sin(am), true, true]);
        }
      const BH=1.07, BT=0.12;
      for(const s of segs){
        const dx=s[2]-s[0], dz=s[3]-s[1], L=Math.hypot(dx,dz), ry=Math.atan2(-dz, dx);
        const mx=(s[0]+s[2])/2, mz=(s[1]+s[3])/2, nx=s[4], nz=s[5], gh=s[6]?2.30:1.40;
        // corner pieces overlap a little to close their joints; straight ones
        // butt exactly, or the overlap is two faces in one plane at every joint
        const ex=s[7]?1:0;
        const at=(o)=>[mx+nx*o, mz+nz*o];
        let q=at(BT/2);      m.P("paint", boxGeo(L+0.012*ex, BH, BT, 0.5), q[0], FY+BH/2, q[1], ry, "#f2f1ec", 0, 0);
        q=at(-0.006);        m.P("paint", boxGeo(L+0.004*ex, 0.22, 0.012, 0.5), q[0], FY+0.11, q[1], ry, "#e8c02a", 0, 0);
        // (alternate corner caps a millimetre apart: their tops overlap at the joints)
        q=at(BT/2);          m.P("paint", boxGeo(L+0.014*ex, 0.06, BT+0.08, 0.5), q[0], FY+BH+0.03+ex*(segs.indexOf(s)%2)*0.001,
                                 q[1], ry, "#b8322a", 0, 0);
        // dark tint: clean glass under arena lights is nearly invisible, and a
        // pale one read as a milky wall round the sheet
        q=at(BT/2+0.01);     m.P("glass", boxGeo(L-0.03, gh, 0.014, 0), q[0], FY+BH+0.063+gh/2, q[1], ry, "#6e8088", 0, 0);
                             m.P("metal", boxGeo(0.05, gh, 0.06, 0), s[0]+nx*(BT/2+0.01), FY+BH+0.06+gh/2,
                                 s[1]+nz*(BT/2+0.01), ry, "#b8bcbe", 0, 0);
        const ax0=Math.min(s[0],s[2]), ax1=Math.max(s[0],s[2]), az0=Math.min(s[1],s[3]), az1=Math.max(s[1],s[3]);
        m.col(Math.min(ax0, ax0+nx*BT)-0.02, Math.max(ax1, ax1+nx*BT)+0.02,
              Math.min(az0, az0+nz*BT)-0.02, Math.max(az1, az1+nz*BT)+0.02, FY, FY+BH+0.06+gh);
      }

      // what is printed on the boards: the town's own advertisers
      const ads=[["LOW DESERT MOTEL · VACANCY","#24365a"],["ROXIE'S DINER · OPEN 24 HRS","#a8322a"],
                 ["THE RUSTY CANTEEN","#5a3a24"],["GAS · OIL · TIRES","#2a5a3a"],
                 ["DRIVE-IN · TWO FEATURES","#3a2a5a"],["ICE TIME · CALL THE OFFICE","#24365a"]];
      ads.forEach((a,i)=>{
        const west=i<3, zc=CZ-13.5+(i%3)*13.5;
        signPanel(3.0, 0.62, signTex(600,124,(t,w,h)=>{
          t.fillStyle="#f6f5f0"; t.fillRect(0,0,w,h); t.fillStyle=a[1];
          fitText(t, a[0], w*0.92, 70, w/2, h/2+3);
        }), W(west?CX-IW+0.004:CX+IW-0.004), GY+FY+0.62, Z(zc), west?Math.PI/2:-Math.PI/2, false);
      });
    }

    /* --- the nets ------------------------------------------------------ */
    for(const e of [-1,1]){
      const gz=CZ+e*(IL-3.4), back=e;                   // the net hangs back toward its end
      const post=(x)=>m.C("paint", 0.03,0.03,1.22,10, x, FY+0.61, gz, "#c8302a");
      post(CX-0.915); post(CX+0.915);
      m.C("paint", 0.03,0.03,1.86,10, CX, FY+1.22, gz, "#c8302a", 0, 0, Math.PI/2);
      for(const sx of [-1,1]){
        m.C("paint", 0.022,0.022,0.50,8, CX+sx*0.915, FY+1.22, gz+back*0.25, "#c8302a", Math.PI/2, 0, 0);
        // from the back of the top shelf down to the base hoop
        m.C("paint", 0.022,0.022,1.32,8, CX+sx*0.88, FY+0.61, gz+back*0.75, "#c8302a", -back*Math.atan2(0.5,1.22), 0, 0);
      }
      m.C("paint", 0.022,0.022,1.80,8, CX, FY+1.22, gz+back*0.50, "#c8302a", 0, 0, Math.PI/2);
      // the base hoop, low on the ice, in five pieces
      for(let k=0;k<6;k++){
        const a0=Math.PI*k/6, a1=Math.PI*(k+1)/6;
        const p0=[CX+Math.cos(a0)*0.915, gz+back*Math.sin(a0)*1.0], p1=[CX+Math.cos(a1)*0.915, gz+back*Math.sin(a1)*1.0];
        const L=Math.hypot(p1[0]-p0[0], p1[1]-p0[1]);
        m.P("paint", boxGeo(L+0.02, 0.04, 0.04, 0), (p0[0]+p1[0])/2, FY+0.035, (p0[1]+p1[1])/2,
            Math.atan2(-(p1[1]-p0[1]), p1[0]-p0[0]), "#d8d8d4", 0, 0);
      }
      // the mesh: back and two sides, white netting
      m.P("chainlink", planeGeo(1.80, 1.32, 5.0), CX, FY+0.61, gz+back*0.75, 0, "#f0f0ec", -back*Math.atan2(0.5,1.22), 0);
      for(const sx of [-1,1])
        m.P("chainlink", planeGeo(0.95, 1.20, 5.0), CX+sx*0.90, FY+0.60, gz+back*0.48, Math.PI/2, "#f0f0ec", 0, 0);
      m.P("chainlink", planeGeo(1.80, 0.50, 5.0), CX, FY+1.21, gz+back*0.25, 0, "#f0f0ec", -Math.PI/2, 0);
      m.col(CX-0.98, CX+0.98, Math.min(gz, gz+back*1.05), Math.max(gz, gz+back*1.05), FY, FY+1.25);
    }

    /* --- the stands ------------------------------------------------------
       Ten rows a side, each forty centimetres above the last, from behind a
       walkway round the boards up to a concourse along the back wall; four
       sections a side between five aisles; blue seats, all folded up the way
       the last person to leave left them, which is everyone. */
    {
      const ROWS=10, RD=0.80, RR=0.40, S0=CX-IW-2.0, SB=CZ-25.0, SE=CZ+25.0;   // S0: front of the west stand
      const AIS=[0,1,2,3,4].map(k=>SB+k*(SE-SB)/4);
      for(const sd of [-1,1]){
        const fx=k=>CX+sd*(IW+2.0+k*RD);                  // front edge of row k
        for(let k=0;k<ROWS;k++){
          const xa=fx(k), xb=fx(k+1), top=RR*(k+1);
          m.B("concrete", RD, top+0.1, SE-SB+1.2, (xa+xb)/2, FY+(top+0.1)/2-0.1, (SB+SE)/2, 0.5, 0, "#8c8a86");
          m.P("paint", planeGeo(SE-SB+1.2, 0.06, 0), xa-sd*0.003, FY+top-0.03, (SB+SE)/2,
              sd>0?-Math.PI/2:Math.PI/2, "#e8c02a", 0, 0);                 // a yellow nosing on every step
          m.flat(Math.min(xa,xb), Math.max(xa,xb), SB-0.6, SE+0.6, FY+top);
          // the seats, in their sections
          for(let j=0;j<4;j++){
            const z0=AIS[j]+0.65, z1=AIS[j+1]-0.65, n=Math.floor((z1-z0)/0.52);
            for(let i=0;i<n;i++){
              const z=z0+0.26+i*((z1-z0-0.52)/(n-1)), sx=xa+sd*0.42, ty=FY+top;
              m.B("metal", 0.06, 0.40, 0.06, sx, ty+0.20, z, 0, 0, "#3a3e42");
              // folded up: the pan stands on end in front of the back
              m.B("paint", 0.05, 0.40, 0.44, sx-sd*0.06, ty+0.58, z, 0.4, 0, k>=8?"#9a2e2a":"#2c4f86");
              m.B("paint", 0.05, 0.46, 0.44, sx+sd*0.16, ty+0.64, z, 0.4, 0, k>=8?"#8a2824":"#26467a");
            }
          }
        }
        // the concourse along the back wall, and its rail
        const xc0=fx(ROWS), xc1=sd>0?RX1:RX0;
        m.B("concrete", Math.abs(xc1-xc0), RR*(ROWS+1)+0.1, SE-SB+1.2, (xc0+xc1)/2, FY+(RR*(ROWS+1)+0.1)/2-0.1,
            (SB+SE)/2, 0.5, 0, "#8c8a86");
        m.flat(Math.min(xc0,xc1), Math.max(xc0,xc1), SB-0.6, SE+0.6, FY+RR*(ROWS+1));
        // handrails up the middle of every aisle
        const L=Math.hypot(ROWS*RD, (ROWS-1)*RR), th=Math.atan2((ROWS-1)*RR, ROWS*RD);
        for(const az of AIS){
          const xm=(fx(0)+fx(ROWS))/2;
          m.C("metal", 0.025,0.025,L,8, xm, FY+RR*(ROWS+1)/2+0.82, az, "#b8bcbe", 0, 0, -sd*(Math.PI/2-th));
          for(const k of [0, ROWS-1]) m.C("metal", 0.025,0.025,0.86,8, fx(k)+sd*0.4, FY+RR*(k+1)+0.43, az, "#b8bcbe");
        }
        // the ends of the stand: plain concrete, with the section letters
        for(let j=0;j<4;j++)
          sign(0.34, 0.34, String.fromCharCode(65+j+(sd>0?4:0)), "#24365a", "#e8e6dc",
               fx(0)-sd*0.004, 0.19, (AIS[j]+AIS[j+1])/2, sd>0?-Math.PI/2:Math.PI/2);
      }
      // the teams' benches on the west walkway, the penalty boxes on the east
      for(const g of [[CZ-9.5,CZ-6.3],[CZ+6.3,CZ+9.5]]){
        m.B("paint", 0.45, 0.45, g[1]-g[0], CX-IW-1.78, FY+0.225, (g[0]+g[1])/2, 0.4, 0, "#2a2c30");
        m.col(CX-IW-2.0, CX-IW-1.55, g[0], g[1], FY, FY+0.45);
      }
      for(const g of [[CZ-5.2,CZ-2.8],[CZ+2.8,CZ+5.2]]){
        m.B("paint", 0.45, 0.45, g[1]-g[0], CX+IW+1.78, FY+0.225, (g[0]+g[1])/2, 0.4, 0, "#2a2c30");
        m.col(CX+IW+1.55, CX+IW+2.0, g[0], g[1], FY, FY+0.45);
      }
      m.B("oak", 0.60, 0.90, 1.6, CX+IW+1.70, FY+0.45, CZ, 0.4, 0, "#6a4a2c");     // the timekeeper's desk
      m.B("paint", 0.30, 0.14, 0.40, CX+IW+1.70, FY+0.97, CZ+0.3, 0.4, 0, "#1a1c20");
      m.col(CX+IW+1.40, CX+IW+2.0, CZ-0.8, CZ+0.8, FY, FY+0.95);
      // a mat from the door to the gate in the south end
      m.P("lino", planeGeo(1.20, (CZ-IL)-RZ0-0.2, 0.6), CX, FY+0.010, (RZ0+CZ-IL)/2-0.05, 0, "#1c1e22", -Math.PI/2, 0);
    }

    /* --- the roof: steel trusses, lights hung from them, the scoreboard,
       and the banners at the north end --------------------------------- */
    {
      const TY=FY+RH-0.35, BY=FY+RH-2.20, TC="#3a3d42";
      for(let z=RZ0+3.5; z<RZ1-1.0; z+=7.0){
        m.B("metal", RX1-RX0, 0.24, 0.24, CX, TY, z, 0.4, 0, TC);
        m.B("metal", RX1-RX0, 0.20, 0.20, CX, BY, z, 0.4, 0, TC);
        for(let x=RX0+1.0; x<=RX1-0.9; x+=3.5){
          m.B("metal", 0.10, TY-BY, 0.10, x, (TY+BY)/2, z, 0, 0, TC);
          if(x+3.5<=RX1-0.9){
            const L=Math.hypot(3.5, TY-BY), a=Math.atan2(TY-BY, 3.5);
            m.P("metal", boxGeo(L, 0.08, 0.08, 0), x+1.75, (TY+BY)/2, z, 0, TC, 0, ((Math.round((x-RX0)/3.5))%2?a:-a));
          }
        }
      }
      for(const x of [CX-14, CX-7, CX, CX+7, CX+14])
        m.B("metal", 0.16, 0.16, RZ1-RZ0, x, TY+0.05, CZ, 0.4, 0, TC);
      // the high-bay lights: a grid of them over the ice and the stands
      // hung on rods from the purlins that run the length of the roof
      const lit=new Set(["-7,-24","7,-24","-7,-8","7,-8","-7,8","7,8","-7,24","7,24","0,-16","0,16"]);
      for(const dx of [-14,-7,0,7,14]) for(const dz of [-24,-16,-8,0,8,16,24]){
        if(Math.abs(dx)===14 && (dz%16)) continue;
        const x=CX+dx, z=CZ+dz, y=BY-0.55, rod=(TY-0.08)-(y+0.36);
        m.C("metal", 0.26,0.34,0.36,14, x, y+0.18, z, "#5a5e62");
        m.C("metal", 0.015,0.015,rod,6, x, y+0.36+rod/2, z, "#3a3d42");
        m.P("hbcold", domeGeo(0.31, 0.10, 16), x, y-0.002, z, 0, "#ffffff");
        if(lit.has(dx+","+dz))
          m.lamp(x, y-0.6, z, {color:0xf0f4ff, intensity:0.50, dist:30, decay:1.25, indoor:true, vol:VOLR});
      }
      // the scoreboard over centre ice, nothing to nothing, twenty minutes
      const SY=FY+8.6;
      m.B("paint", 3.6, 2.0, 3.6, CX, SY, CZ, 0.4, 0, "#1a1c20");
      m.B("paint", 3.0, 0.6, 3.0, CX, SY-1.35, CZ, 0.4, 0, "#22242a");
      for(const c of [[-1.6,-1.6],[1.6,-1.6],[-1.6,1.6],[1.6,1.6]])
        m.C("metal", 0.012,0.012,(BY-0.1)-(SY+1.0),5, CX+c[0], (SY+1.0+BY-0.1)/2, CZ+c[1], "#8a8e92");
      const board=signTex(512,284,(t,w,h)=>{
        t.fillStyle="#0c0d10"; t.fillRect(0,0,w,h);
        t.fillStyle="#e8e6dc"; t.font="700 34px Arial"; t.textAlign="center"; t.textBaseline="middle";
        t.fillText("HOME", 96, 40); t.fillText("GUEST", w-96, 40); t.fillText("PERIOD", w/2, 190);
        t.fillStyle="#ff3a2a"; t.font="700 96px 'Courier New', monospace";
        t.fillText("0", 96, 120); t.fillText("0", w-96, 120);
        t.fillStyle="#ffb02a"; t.font="700 74px 'Courier New', monospace"; t.fillText("20:00", w/2, 105);
        t.fillStyle="#ff3a2a"; t.font="700 54px 'Courier New', monospace"; t.fillText("1", w/2, 245);
      });
      for(let k=0;k<4;k++){
        const ry=k*Math.PI/2, nx=Math.sin(ry), nz=Math.cos(ry);
        signPanel(3.2, 1.78, board, W(CX+nx*1.812), GY+SY, Z(CZ+nz*1.812), ry, true);
        signPanel(2.8, 0.44, signTex(400,64,(t,w,h)=>{ t.fillStyle="#0c0d10"; t.fillRect(0,0,w,h);
          t.fillStyle="#ffb02a"; fitText(t, "LOW DESERT ICE", w*0.9, 44, w/2, h/2+2); }),
          W(CX+nx*1.512), GY+SY-1.35, Z(CZ+nz*1.512), ry, true);
      }
      // banners from the last truss but one: three titles and two numbers
      const ban=[["CHAMPIONS","1979","#24365a"],["CHAMPIONS","1983","#24365a"],["9","D. REYES","#a8322a"],
                 ["CHAMPIONS","1991","#24365a"],["17","K. TALLMAN","#a8322a"]];
      ban.forEach((b,i)=>{
        const bxp=CX-9.0+i*4.5, bz=RZ1-3.5-0.16;             // just in front of the last truss
        m.C("metal", 0.015,0.015,1.7,6, bxp, BY-0.17, bz, "#8a8e92", 0, 0, Math.PI/2);
        for(const sx of [-0.8,0.8]) m.C("metal", 0.008,0.008,0.14,4, bxp+sx, BY-0.10, bz, "#8a8e92");
        signPanel(1.6, 2.7, signTex(240,404,(t,w,h)=>{
          t.fillStyle=b[2]; t.fillRect(0,0,w,h); t.strokeStyle="#e8e6dc"; t.lineWidth=8; t.strokeRect(14,14,w-28,h-28);
          t.fillStyle="#e8e6dc"; t.textAlign="center"; t.textBaseline="middle";
          t.font="700 26px Arial"; t.fillText("LOW DESERT", w/2, 60);
          if(b[0]==="CHAMPIONS"){ t.font="700 30px Arial"; t.fillText("LEAGUE", w/2, 104);
            t.fillText("CHAMPIONS", w/2, 146); t.font="900 74px 'Arial Black', Impact, Arial"; t.fillText(b[1], w/2, 260); }
          else { t.font="900 150px 'Arial Black', Impact, Arial"; t.fillText(b[0], w/2, 210);
            t.font="700 30px Arial"; t.fillText(b[1], w/2, 330); }
        }), W(bxp), GY+BY-1.56, Z(bz-0.02), Math.PI, false);
      });
      // the resurfacer's door in the north wall, shut
      m.B("siding", 6.0, 4.2, 0.10, CX, FY+2.1, RZ1-0.05, 0.6, 0, "#8a929a");
      for(const sx of [-1,1]) m.B("metal", 0.20, 4.4, 0.16, CX+sx*3.1, FY+2.2, RZ1-0.08, 0.4, 0, "#4a4e50");
      m.B("metal", 6.4, 0.30, 0.20, CX, FY+4.40, RZ1-0.10, 0.4, 0, "#4a4e50");
      m.P("paint", planeGeo(6.0, 0.10, 0), CX, FY+0.012, RZ1-3.0, 0, "#e8c02a", -Math.PI/2, 0);
      sign(2.4, 0.30, "KEEP CLEAR · ICE RESURFACER", "#e8c02a", "#1a1c20", CX, 4.85, RZ1-0.012, Math.PI, 0.20*240);
    }

    addBuried(W(RX0-RWT-1.0), W(RX1+RWT+1.0), Z(LZ1+0.2), Z(RZ1+RWT+1.0), GY+FY-1.5, GY+FY+RH+1.4, 0xe4ecf2);
    addZone(W(RX0), W(RX1), Z(RZ0), Z(RZ1), GY+FY-1, GY+FY+RH, "THE ICE", true);
  }
})();
