"use strict";
/* LOW DESERT MOTEL · 14j-observe.js
   the corridor off the rink, the observation room, and the room it observes
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   OBSERVATION

   The STAFF ONLY door in the rink's north-east corner opens on a service
   corridor thirty metres long: painted block, vinyl tile, two pipes along
   the ceiling, a strip light every three metres and one of them going. At
   the end, under a red lamp that says SESSION IN PROGRESS, a door.

   Behind it is a small dark room with a console along one wall, and the
   wall over the console is glass. On the other side of the glass, lit like
   a stage, is a living room from about 1955: atomic-print paper, a picture
   window onto a painted afternoon, a turquoise sofa under it, a kidney
   table, a coral chair and a mustard one, a console television showing the
   test card, a sunburst clock stopped at twenty to four, a sputnik light,
   a tripod lamp, a bar cart, a snake plant. Everything is clean. The
   cushions have never been sat on. There is no door into it.

   On the console: a tape recorder with its reels threaded, a microphone,
   headphones, a log with nothing written in it since the first line, and
   a monitor showing the same room, from a camera you cannot find.

   Same frame as the rink (mk(-80, 340)), same floor.
   ---------------------------------------------------------------------- */
(function observe(){
  const SX=-80, SZ=340;
  const m=mk(SX,SZ), GY=m.y;
  const W=(x)=>SX+x, Z=(z)=>SZ+z;
  let _s=19550417;
  const R=()=>((_s=(_s*16807)%2147483647)-1)/2147483646;

  /* --- the one page of numbers --------------------------------------- */
  const FY=-11.40, OS=0.08, AD=ARENA_DOOR, DZ=AD.z;
  // the corridor, from the rink's east wall (outer face) running east
  const CX0=AD.x+AD.wt, CX1=CX0+32.0, CZ0=DZ-1.20, CZ1=DZ+1.20, CH=2.70, CWT=0.30;
  // the observation room
  const OWT=0.30, OX0=CX1+OWT, OX1=OX0+5.50, OZ0=DZ-3.50, OZ1=DZ+3.50, OH=2.70;
  // the glass wall, and the living room on the far side of it
  const GWT=0.30, GZ0=DZ-2.60, GZ1=DZ+2.60, GY0=0.95, GY1=2.35;
  const LX0=OX1+GWT, LX1=LX0+8.0, LZ0=DZ-4.20, LZ1=DZ+4.20, LH=2.75, LWT=0.30;
  const DW=0.54, DH=2.14;

  const VOLC=[W(CX0-0.3), W(CX1+0.3), Z(CZ0-0.4), Z(CZ1+0.4), GY+FY-1, GY+FY+CH+0.6];
  const VOLO=[W(OX0-0.3), W(OX1+0.2), Z(OZ0-0.4), Z(OZ1+0.4), GY+FY-1, GY+FY+OH+0.6];
  // the living room's lamps burn for whoever is watching it: their volume is
  // the observation room as well (a lamp with a vol is on only while the
  // camera is inside it, and nobody is ever inside the living room)
  const VOLL=[W(OX0-0.3), W(LX1+0.4), Z(LZ0-0.4), Z(LZ1+0.4), GY+FY-1, GY+FY+LH+0.6];

  const wall=(bk,x0,x1,z0,z1,y0,y1,c,uv)=>{
    m.B(bk, x1-x0, y1-y0, z1-z0, (x0+x1)/2, FY+(y0+y1)/2, (z0+z1)/2, uv||0.833, 0, c);
    m.col(x0, x1, z0, z1, FY+y0-(y0<=0?0.5:0), FY+y1);
  };
  const band=(bk, ax, a0, a1, c, n, y0, y1, col, off, uv)=>{
    const L=a1-a0, mid=(a0+a1)/2, o=off||0.010;
    if(ax==="x") m.P(bk, planeGeo(L, y1-y0, uv||0.833), mid, FY+(y0+y1)/2, c+n*o, n>0?0:Math.PI, col, 0, 0);
    else         m.P(bk, planeGeo(L, y1-y0, uv||0.833), c+n*o, FY+(y0+y1)/2, mid, n>0?Math.PI/2:-Math.PI/2, col, 0, 0);
  };
  const sign=(w,h,txt,bg,fg,x,y,z,ry,lit)=>signPanel(w, h, signTex(Math.round(w*240), Math.round(h*240), (t,cw,ch)=>{
    t.fillStyle=bg; t.fillRect(0,0,cw,ch); t.fillStyle=fg; fitText(t, txt, cw, ch*0.62, cw/2, ch/2+2);
  }), W(x), GY+FY+y, Z(z), ry, !!lit);
  // a door in a wall that runs along z, hinged on its north jamb
  const doorZ=(xw, wt, label, opensIn)=>{
    for(const z of [DZ-DW-0.03, DZ+DW+0.03])
      m.B("metal", wt+0.12, DH+0.08, 0.08, xw+wt/2, FY+(DH+0.08)/2, z, 0.4, 0, "#4a4e50");
    m.B("metal", wt+0.14, 0.08, 2*DW+0.16, xw+wt/2, FY+DH+0.04, DZ, 0.4, 0, "#4a4e50");
    m.flat(xw-0.2, xw+wt+0.2, DZ-DW, DZ+DW, FY);
    makeDoor(XF(W(xw+wt/2), Z(DZ+DW-0.06), Math.PI/2), 0, GY+FY+0.02, 0, label, opensIn, 0, "steel");
  };

  /* ==================================================================
     THE CORRIDOR
     ================================================================== */
  {
    const CRM="#d8d0bc", BRN="#6a5444", STR="#3a2e26";
    // from the rink slab's oversail to the observation room's own slab: butted, not lapped
    m.B("concrete", CX1-(CX0+OS), 0.50, (CZ1+CWT+OS)-(CZ0-CWT-OS), (CX0+OS+CX1)/2, FY-0.25, DZ, 0.5, 0, "#6e6a62");
    m.P("lino", planeGeo(CX1-CX0, CZ1-CZ0, 0.6), (CX0+CX1)/2, FY+0.006, DZ, 0, "#8a8474", -Math.PI/2, 0);
    m.flat(CX0-0.1, CX1+0.1, CZ0, CZ1, FY);
    wall("block", CX0, CX1, CZ0-CWT, CZ0, -0.1, CH+0.4, CRM);
    wall("block", CX0, CX1, CZ1, CZ1+CWT, -0.1, CH+0.4, CRM);
    m.B("concrete", (CX1+OS)-CX0, 0.30, (CZ1+CWT+OS)-(CZ0-CWT-OS), (CX0+CX1+OS)/2, FY+CH+0.15, DZ, 0.5, 0, "#5a5852");
    m.voidAt(CX0-0.3, CX1+0.2, CZ0-CWT-0.3, CZ1+CWT+0.3, FY-1.0, FY+CH+0.6, FY);
    for(const q of [[CZ0, 1],[CZ1, -1]]){
      band("block", "x", CX0, CX1, q[0], q[1], 0, 1.10, BRN);
      band("block", "x", CX0, CX1, q[0], q[1], 1.10, 1.16, STR, 0.011);
    }
    // two pipes and a conduit along the ceiling, on brackets
    m.C("metal", 0.06,0.06,CX1-CX0,10, (CX0+CX1)/2, FY+CH-0.22, CZ1-0.22, "#6a7a6a", 0, 0, Math.PI/2);
    m.C("metal", 0.04,0.04,CX1-CX0,10, (CX0+CX1)/2, FY+CH-0.22, CZ1-0.42, "#8a6a4a", 0, 0, Math.PI/2);
    m.C("metal", 0.016,0.016,CX1-CX0,6, (CX0+CX1)/2, FY+CH-0.08, CZ0+0.15, "#9a9e9e", 0, 0, Math.PI/2);
    for(let x=CX0+1.0; x<CX1; x+=2.4)
      m.B("metal", 0.04, 0.26, 0.40, x, FY+CH-0.15, CZ1-0.32, 0, 0, "#4a4e50");
    // strip lights every 3.2 m: the ninth is dead, the fourth is going
    for(let i=0;i<10;i++){
      const x=CX0+1.6+i*3.2, dead=(i===8);
      m.B("metal", 1.24, 0.05, 0.10, x, FY+CH-0.04, DZ-0.3, 0.4, 0, "#c8c6be");
      m.P(dead?"glass":"hbcold", boxGeo(1.18, 0.03, 0.03, 0), x, FY+CH-0.08, DZ-0.3, 0, dead?"#6a6c66":"#ffffff", 0, 0);
      if((i%2===0 || i===3) && !dead)
        m.lamp(x, FY+CH-0.35, DZ-0.3, {color:0xf0f2e8, intensity:0.42, dist:8, decay:1.5, indoor:true,
                                         vol:VOLC, flicker:(i===3)});
    }
    // signs, an extinguisher, an alarm, a phone nobody answers
    sign(0.90, 0.20, "OBSERVATION  →", "#e6e0cc", "#3a2e26", CX0+2.2, 1.70, CZ1-0.012, Math.PI);
    m.C("paint", 0.08,0.08,0.46,12, CX0+14.0, FY+0.80, CZ0+0.10, "#b8282a");
    m.B("metal", 0.12, 0.05, 0.03, CX0+14.0, FY+0.80, CZ0+0.015, 0.4, 0, "#2a2c30");
    m.B("paint", 0.10, 0.14, 0.05, CX0+14.6, FY+1.30, CZ0+0.025, 0.4, 0, "#c8302a");
    m.B("paint", 0.20, 0.28, 0.08, CX0+22.0, FY+1.45, CZ1-0.04, 0.4, 0, "#2a2c2a");
    m.B("paint", 0.05, 0.20, 0.06, CX0+21.92, FY+1.47, CZ1-0.10, 0.4, 0, "#1a1c1a");
    m.C("paint", 0.006,0.006,0.60,5, CX0+21.92, FY+1.05, CZ1-0.10, "#1a1c1a");
    // the end: the lamp over the door, and the door
    m.B("paint", 0.10, 0.22, 0.86, CX1-0.05, FY+2.42, DZ, 0.4, 0, "#2a1a1a");
    sign(0.80, 0.18, "SESSION IN PROGRESS", "#5a0e0a", "#ff5a3a", CX1-0.102, 2.42, DZ, -Math.PI/2, true);
    m.lamp(CX1-0.6, FY+2.3, DZ, {color:0xff4a2a, intensity:0.14, dist:3.5, decay:2.0, indoor:true, vol:VOLC});
    sign(0.80, 0.18, "OBSERVATION", "#e6e0cc", "#3a2e26", CX1-1.30, 1.70, CZ0+0.012, 0);
    addBuried(W(CX0-0.2), W(CX1), Z(CZ0-CWT-0.6), Z(CZ1+CWT+0.6), GY+FY-1.0, GY+FY+CH+0.8, 0xd8dcd4);
    addZone(W(CX0), W(CX1), Z(CZ0), Z(CZ1), GY+FY-1, GY+FY+CH, "A SERVICE CORRIDOR", true);
  }

  /* ==================================================================
     THE OBSERVATION ROOM
     ================================================================== */
  {
    const DARK="#3e4240";
    m.B("concrete", (OX1+GWT/2)-CX1, 0.50, (OZ1+OWT+OS)-(OZ0-OWT-OS), (CX1+OX1+GWT/2)/2,
        FY-0.25, DZ, 0.5, 0, "#6e6a62");
    m.P("lino", planeGeo(OWT, 2*DW, 0.6), CX1+OWT/2, FY+0.006, DZ, 0, "#8a8474", -Math.PI/2, 0);   // the threshold
    m.P("carpet", planeGeo(OX1-OX0, OZ1-OZ0, 0.6), (OX0+OX1)/2, FY+0.006, DZ, 0, "#3a3a38", -Math.PI/2, 0);
    m.flat(OX0, OX1, OZ0, OZ1, FY);
    // the west wall, with the door in it from the corridor
    wall("block", CX1, OX0, OZ0-OWT, DZ-DW-0.06, -0.1, OH+0.4, DARK);
    wall("block", CX1, OX0, DZ+DW+0.06, OZ1+OWT, -0.1, OH+0.4, DARK);
    wall("block", CX1, OX0, DZ-DW-0.06, DZ+DW+0.06, DH+0.06, OH+0.4, DARK);
    doorZ(CX1, OWT, "OBSERVATION", true);
    wall("block", OX0, OX1, OZ0-OWT, OZ0, -0.1, OH+0.4, DARK);       // south
    wall("block", OX0, OX1, OZ1, OZ1+OWT, -0.1, OH+0.4, DARK);       // north
    m.B("ceil", (OX1+GWT/2)-(OX0-OWT-OS), 0.30, (OZ1+OWT+OS)-(OZ0-OWT-OS), (OX0-OWT-OS+OX1+GWT/2)/2,
        FY+OH+0.15, DZ, 0.45, 0, "#5a5a56");
    m.voidAt(OX0-0.2, OX1+0.1, OZ0-OWT-0.3, OZ1+OWT+0.3, FY-1.0, FY+OH+0.6, FY);
    // acoustic panels on three walls: dark cloth between dado and ceiling
    band("fabric", "x", OX0+0.1, OX1-0.1, OZ0, 1, 0.90, 2.45, "#2e3230", 0.012, 0.6);
    band("fabric", "x", OX0+0.1, OX1-0.1, OZ1, -1, 0.90, 2.45, "#2e3230", 0.012, 0.6);
    band("fabric", "z", OZ0+0.1, DZ-DW-0.25, OX0, 1, 0.90, 2.45, "#2e3230", 0.012, 0.6);
    band("fabric", "z", DZ+DW+0.25, OZ1-0.1, OX0, 1, 0.90, 2.45, "#2e3230", 0.012, 0.6);

    // the console along the glass, and what is on it
    const KX=OX1-0.35, KZ0=OZ0+0.45, KZ1=OZ1-0.45, TOP=FY+0.76;
    m.B("oak", 0.62, 0.72, KZ1-KZ0, KX, FY+0.36, DZ, 0.5, 0, "#3a3430");
    m.B("lino", 0.66, 0.04, KZ1-KZ0+0.04, KX, TOP-0.02, DZ, 0.6, 0, "#4a4a46");
    m.col(KX-0.33, OX1, KZ0, KZ1, FY, TOP);
    // the tape recorder, threaded, its reels and its meters
    const tz=DZ-1.4;
    m.B("paint", 0.42, 0.16, 0.56, KX, TOP+0.08, tz, 0.4, 0, "#8a8a84");
    for(const o of [-0.14, 0.14]){
      m.C("metal", 0.12, 0.12, 0.012, 20, KX+0.02, TOP+0.166, tz+o, "#c8ccc8");
      m.C("paint", 0.10, 0.10, 0.016, 20, KX+0.02, TOP+0.170, tz+o, "#4a3a2a");
    }
    m.B("paint", 0.10, 0.01, 0.30, KX-0.15, TOP+0.161, tz, 0.4, 0, "#2a2a2a");
    for(const o of [-0.08, 0.08]) m.B("tvglass", 0.01, 0.05, 0.08, KX-0.212, TOP+0.10, tz+o, 0, 0, "#c8b060");
    // the microphone on its stand, the headphones, the log and a pen
    m.C("metal", 0.06,0.07,0.02,12, KX, TOP+0.01, DZ-0.2, "#2a2a2a");
    m.C("metal", 0.008,0.008,0.26,6, KX, TOP+0.15, DZ-0.2, "#8a8e90");
    m.C("metal", 0.03,0.035,0.10,12, KX, TOP+0.31, DZ-0.2, "#9a9e9e", 0, 0, 0.3);
    m.P("metal", new T.TorusGeometry(0.08, 0.012, 6, 14, Math.PI), KX-0.05, TOP+0.02, DZ+0.35, 0.4, "#2a2a2a", -Math.PI/2+0.3, 0);
    for(const o of [-0.08, 0.08]) m.C("fabric", 0.04,0.04,0.03,12, KX-0.05+o*0.4, TOP+0.02, DZ+0.35+o, "#1e1e1e");
    m.B("paper", 0.24, 0.012, 0.32, KX-0.08, TOP+0.006, DZ+0.95, 0.4, 0.2, "#e6e0cc");
    m.B("metal", 0.25, 0.006, 0.05, KX-0.08, TOP+0.015, DZ+0.80, 0.4, 0.2, "#8a8e90");
    m.C("paint", 0.004,0.004,0.14,6, KX-0.02, TOP+0.016, DZ+1.0, "#1a1a1a", 0, 0.5, Math.PI/2);
    m.C("plaster", 0.04, 0.034, 0.09, 12, KX+0.12, TOP+0.045, DZ+1.55, "#d8d4c8");
    m.C("metal", 0.06, 0.06, 0.02, 14, KX+0.10, TOP+0.01, DZ+1.75, "#8a9498");
    // the monitor: the same room, from a camera you cannot find
    const mz=DZ+2.35;
    m.B("paint", 0.36, 0.32, 0.38, KX+0.04, TOP+0.16, mz, 0.4, 0, "#5a5a54");
    signPanel(0.28, 0.22, signTex(224,176,(t,w,h)=>{
      t.fillStyle="#0e1612"; t.fillRect(0,0,w,h);
      t.strokeStyle="#7fd8a8"; t.fillStyle="#7fd8a8"; t.globalAlpha=0.75; t.lineWidth=2;
      t.strokeRect(70,40,84,46);                                         // the window
      t.fillRect(56,104,112,22); t.fillRect(56,90,112,14);              // the sofa
      t.beginPath(); t.ellipse(112,140,46,12,0,0,7); t.fill();          // the table
      t.fillRect(18,96,26,40); t.fillRect(180,96,26,40);                 // the chairs
      t.globalAlpha=0.18; for(let y=0;y<h;y+=3) t.fillRect(0,y,w,1);     // the scan lines
      t.globalAlpha=1; t.font="700 12px 'JetBrains Mono', monospace"; t.textAlign="left";
      t.fillText("CAM 2", 24, 26);
    }), W(KX-0.142), GY+TOP+0.17, Z(mz), -Math.PI/2, true);
    // the lamp, the only light on in here
    m.B("brass", 0.18, 0.02, 0.12, KX+0.05, TOP+0.01, DZ+1.75-0.5, 0.4, 0, "#a8883a");
    m.C("brass", 0.01,0.01,0.30,6, KX+0.05, TOP+0.16, DZ+1.25, "#a8883a");
    m.P("lampshade", shadeGeo(0.08,0.10,0.10,12), KX, TOP+0.32, DZ+1.25, 0, "#2a6a3a");
    m.lamp(KX-0.1, TOP+0.24, DZ+1.25, {color:0xffd8a0, intensity:0.16, dist:3.6, decay:2.0, indoor:true, vol:VOLO});
    // two chairs at the console, facing the glass
    for(const cz of [DZ-0.9, DZ+0.9]){
      const qx=OX1-1.20;
      m.C("metal", 0.26,0.26,0.03,10, qx, FY+0.06, cz, "#2a2a2a");
      m.C("metal", 0.025,0.025,0.38,8, qx, FY+0.27, cz, "#2a2a2a");
      m.B("fabric", 0.46, 0.08, 0.46, qx, FY+0.50, cz, 0.5, 0, "#3a3e44");
      m.B("fabric", 0.07, 0.50, 0.44, qx-0.22, FY+0.82, cz, 0.5, 0, "#3a3e44", 0, 0.10);
      addSeat(W(qx), Z(cz), GY+FY+0.56, -Math.PI/2, "THE OBSERVER'S CHAIR");
      m.col(qx-0.25, qx+0.25, cz-0.25, cz+0.25, FY, FY+0.5);
    }
    // the back of the room: a cabinet, a clock, a coat hook, the rule
    m.B("paint", 0.48, 1.32, 0.62, OX0+0.26, FY+0.66, OZ1-0.40, 0.5, 0, "#4a4e48");
    m.col(OX0, OX0+0.52, OZ1-0.72, OZ1, FY, FY+1.35);
    m.C("paint", 0.15,0.15,0.04,18, OX0+0.02, FY+2.30, OZ0+1.2, "#1a1c1e", 0, 0, Math.PI/2);
    m.P("clockface", new T.CircleGeometry(0.125, 24), OX0+0.042, FY+2.30, OZ0+1.2, Math.PI/2, "#d8d4c8");
    signPanel(0.90, 0.40, signTex(360,160,(t,w,h)=>{ t.fillStyle="#1e2220"; t.fillRect(0,0,w,h);
      t.fillStyle="#c8c0a8"; fitText(t, "SILENCE", w*0.70, h*0.30, w/2, h*0.34);
      fitText(t, "DO NOT TAP THE GLASS", w*0.80, h*0.16, w/2, h*0.70); }),
      W(OX0+0.014), GY+FY+2.05, Z(OZ0+2.25), Math.PI/2, false);
    m.C("metal", 0.012,0.012,0.12,6, OX0+0.06, FY+1.75, OZ1-1.3, "#8a8e90", 0, 0, Math.PI/2);
    m.B("fabric", 0.10, 0.85, 0.40, OX0+0.12, FY+1.32, OZ1-1.3, 0.5, 0, "#4a3e30");
    addBuried(W(OX0-0.3), W(OX1+0.05), Z(OZ0-OWT-0.6), Z(OZ1+OWT+0.6), GY+FY-1.0, GY+FY+OH+0.8, 0x585c5c);
    addZone(W(OX0), W(OX1), Z(OZ0), Z(OZ1), GY+FY-1, GY+FY+OH, "THE OBSERVATION ROOM", true);
  }

  /* ==================================================================
     THE GLASS
     ================================================================== */
  {
    const GX=OX1, GC="#3e4240";
    // the wall the glass is set in: below it, above it, either side of it
    wall("block", GX, GX+GWT, LZ0-LWT, GZ0, -0.1, LH+0.4, GC);
    wall("block", GX, GX+GWT, GZ1, LZ1+LWT, -0.1, LH+0.4, GC);
    wall("block", GX, GX+GWT, GZ0, GZ1, -0.1, GY0, GC);
    wall("block", GX, GX+GWT, GZ0, GZ1, GY1, LH+0.4, GC);
    m.col(GX, GX+GWT, GZ0, GZ1, FY, FY+LH);                           // and you cannot go through it
    // the pane, a steel frame round it, and on the far side a mirror
    // barely tinted: a dark pane took a third of the light out of the room it is there to show
    m.P("glass", boxGeo(0.02, GY1-GY0, GZ1-GZ0, 0), GX+GWT/2, FY+(GY0+GY1)/2, DZ, 0, "#a8b0b2", 0, 0);
    for(const y of [GY0, GY1]) m.B("metal", GWT+0.06, 0.05, GZ1-GZ0+0.10, GX+GWT/2, FY+y, DZ, 0.4, 0, "#2a2c2e");
    for(const z of [GZ0, GZ1]) m.B("metal", GWT+0.06, GY1-GY0+0.10, 0.05, GX+GWT/2, FY+(GY0+GY1)/2, z, 0.4, 0, "#2a2c2e");
    // (a mirror faces the living room; from this side its back is culled and you see through)
    m.P("mirror", planeGeo(GZ1-GZ0, GY1-GY0, 0), GX+GWT-0.004, FY+(GY0+GY1)/2, DZ, Math.PI/2, "#d8dcd8", 0, 0);
  }

  /* ==================================================================
     THE LIVING ROOM, 1955
     ================================================================== */
  {
    const AQUA="#b8d8d0", WALNUT="#6a4428", WALNUTD="#4a2e1a", BRASS="#b8963a";
    const mid=(LX0+LX1)/2;
    m.B("concrete", (LX1+LWT+OS)-(LX0), 0.50, (LZ1+LWT+OS)-(LZ0-LWT-OS), (LX0+LX1+LWT+OS)/2, FY-0.25, DZ, 0.5, 0, "#6e6a62");
    m.P("plank", planeGeo(LX1-LX0, LZ1-LZ0, 0.7), mid, FY+0.006, DZ, Math.PI/2, "#b88a5a", -Math.PI/2, 0);
    wall("block", LX0, LX1, LZ0-LWT, LZ0, -0.1, LH+0.4, AQUA);
    wall("block", LX0, LX1, LZ1, LZ1+LWT, -0.1, LH+0.4, AQUA);
    // the back wall, with its picture window
    const WZ0=DZ-1.25, WZ1=DZ+1.25, WY0=1.05, WY1=2.25;
    wall("block", LX1, LX1+LWT, LZ0-LWT, WZ0, -0.1, LH+0.4, AQUA);
    wall("block", LX1, LX1+LWT, WZ1, LZ1+LWT, -0.1, LH+0.4, AQUA);
    wall("block", LX1, LX1+LWT, WZ0, WZ1, -0.1, WY0, AQUA);
    wall("block", LX1, LX1+LWT, WZ0, WZ1, WY1, LH+0.4, AQUA);
    // a popcorn ceiling, matte: the plaster one held the stage lights as two hot ovals
    m.B("ceil", (LX1+LWT+OS)-LX0, 0.30, (LZ1+LWT+OS)-(LZ0-LWT-OS), (LX0+LX1+LWT+OS)/2, FY+LH+0.15, DZ, 0.45, 0, "#f2eee4");
    m.voidAt(LX0, LX1+LWT+0.3, LZ0-LWT-0.3, LZ1+LWT+0.3, FY-1.0, FY+LH+0.6, FY);
    // the paper on the back wall and the two sides, a white skirting
    for(const r of [[LZ0, WZ0],[WZ1, LZ1]]) band("atomic", "z", r[0], r[1], LX1, -1, 0, LH, "#ffffff", 0.010, 1.667);
    band("atomic", "z", WZ0, WZ1, LX1, -1, 0, WY0, "#ffffff", 0.010, 1.667);
    band("atomic", "z", WZ0, WZ1, LX1, -1, WY1, LH, "#ffffff", 0.010, 1.667);
    for(const q of [[LZ0, 1],[LZ1, -1]]) band("atomic", "x", LX0, LX1, q[0], q[1], 0, LH, "#ffffff", 0.010, 1.667);
    for(const q of [[LZ0, 1],[LZ1, -1]]) band("paint", "x", LX0, LX1, q[0], q[1], 0, 0.12, "#f4f0e6", 0.014, 0);
    band("paint", "z", LZ0, LZ1, LX1, -1, 0, 0.12, "#f4f0e6", 0.014, 0);
    // the window: a frame, a sill, the afternoon outside it (painted, and lit)
    for(const z of [WZ0, WZ1]) m.B("paint", LWT+0.06, WY1-WY0+0.10, 0.07, LX1+LWT/2, FY+(WY0+WY1)/2, z, 0.4, 0, "#f4f0e6");
    for(const y of [WY0, WY1]) m.B("paint", LWT+0.08, 0.07, WZ1-WZ0+0.14, LX1+LWT/2-0.01, FY+y, DZ, 0.4, 0, "#f4f0e6");
    m.B("paint", 0.05, WY1-WY0, 0.04, LX1+0.05, FY+(WY0+WY1)/2, DZ, 0.4, 0, "#f4f0e6");          // the mullion
    signPanel(WZ1-WZ0, WY1-WY0, signTex(500,240,(t,w,h)=>{
      const g=t.createLinearGradient(0,0,0,h); g.addColorStop(0,"#7ab8e8"); g.addColorStop(0.6,"#c8e4f2");
      t.fillStyle=g; t.fillRect(0,0,w,h);
      t.fillStyle="#7ab05a"; t.fillRect(0,h*0.66,w,h*0.34);                     // the lawn
      t.fillStyle="#f2ece0"; t.beginPath(); t.moveTo(300,h*0.66); t.lineTo(300,h*0.42); t.lineTo(370,h*0.30);
      t.lineTo(440,h*0.42); t.lineTo(440,h*0.66); t.fill();                      // the house across the street
      t.fillStyle="#d87a6a"; t.beginPath(); t.moveTo(290,h*0.43); t.lineTo(370,h*0.27); t.lineTo(450,h*0.43); t.fill();
      t.fillStyle="#5a8ab0"; t.fillRect(325,h*0.48,26,22); t.fillRect(390,h*0.48,26,22);
      t.fillStyle="#6a4a2a"; t.fillRect(120,h*0.40,14,h*0.30);                    // the tree
      t.fillStyle="#4a8a3a"; t.beginPath(); t.arc(127,h*0.36,46,0,7); t.fill();
      t.fillStyle="#f8f8f2"; for(let x=0;x<w;x+=18) t.fillRect(x,h*0.74,8,h*0.14);   // the picket fence
      t.fillRect(0,h*0.76,w,5); t.fillRect(0,h*0.84,w,5);
    }), W(LX1+0.20), GY+FY+(WY0+WY1)/2, Z(DZ), -Math.PI/2, true);   // set back in the reveal, behind the mullion
    // drapes either side, and the pelmet over them
    for(const sd of [-1,1]){
      const ez=sd<0 ? WZ0-0.10 : WZ1+0.10;
      for(let k=0;k<4;k++)
        m.B("fabric", 0.05, 2.30, 0.13, LX1-0.10-(k%2)*0.03, FY+1.33, ez-sd*0.04+sd*k*0.11, 0.6, 0, k%2?"#c89a3a":"#d8aa48");
    }
    m.B("oak", 0.14, 0.22, WZ1-WZ0+1.20, LX1-0.09, FY+2.46, DZ, 0.5, 0, WALNUT);

    // the sofa under the window, turquoise, on tapered legs
    const sx=LX1-0.48, SL=2.30;
    m.B("fabric", 0.86, 0.20, SL, sx, FY+0.32, DZ, 0.5, 0, "#3a9a92");
    for(const o of [-0.575, 0.575]) m.B("fabric", 0.66, 0.12, 1.12, sx-0.08, FY+0.48, DZ+o, 0.5, 0, "#48aaa2");
    m.B("fabric", 0.20, 0.46, SL, sx+0.33, FY+0.65, DZ, 0.5, 0, "#3a9a92");
    for(const o of [-1,1]) m.B("fabric", 0.90, 0.32, 0.14, sx, FY+0.50, DZ+o*(SL/2-0.06), 0.5, 0, "#3a9a92");
    for(const a of [[-0.36,-1.05],[0.36,-1.05],[-0.36,1.05],[0.36,1.05]])
      m.C("oak", 0.022,0.014,0.24,8, sx+a[0], FY+0.11, DZ+a[1], WALNUTD, a[1]>0?-0.12:0.12, 0, a[0]>0?-0.12:0.12);
    m.P("fabric", boxGeo(0.12, 0.34, 0.34, 0.5), sx+0.12, FY+0.70, DZ-0.85, 0, "#e07a5a", 0, -0.18);   // cushions
    m.P("fabric", boxGeo(0.12, 0.34, 0.34, 0.5), sx+0.12, FY+0.70, DZ+0.85, 0, "#d8aa48", 0, -0.18);
    m.col(sx-0.43, LX1, DZ-SL/2, DZ+SL/2, FY, FY+0.9);
    // the rug: an oval, mustard with a cream border and a teal ring
    const rx2=LX1-1.85;
    for(const q of [[1.70, 1.15, "#efe6cf", 0.009],[1.58, 1.03, "#c89a3a", 0.0098],[1.10, 0.62, "#3a8a82", 0.0106],[1.02, 0.54, "#c89a3a", 0.0114]]){
      const g=new T.CircleGeometry(1, 40); g.scale(q[0], q[1], 1); g.rotateX(-Math.PI/2);
      m.P("fabric", g, rx2, FY+q[3], DZ, Math.PI/2, q[2]);
    }
    // the kidney table, walnut, splayed legs, what is on it
    { const g=new T.Shape();
      g.moveTo(-0.70,0.05); g.bezierCurveTo(-0.72,0.40,-0.15,0.40,0,0.18); g.bezierCurveTo(0.15,0.40,0.72,0.40,0.70,0.05);
      g.bezierCurveTo(0.68,-0.32,-0.68,-0.32,-0.70,0.05);
      const tg=new T.ExtrudeGeometry(g, {depth:0.035, bevelEnabled:false}); tg.rotateX(-Math.PI/2);
      m.P("oak", tg, rx2, FY+0.40, DZ, Math.PI/2, WALNUT);
      for(const a of [[-0.50,0.05],[0.50,0.05],[-0.20,-0.18],[0.20,-0.18]])
        m.C("oak", 0.018,0.010,0.40,8, rx2-a[1], FY+0.20, DZ+a[0], WALNUTD, a[1]>0?0.15:-0.15, 0, a[0]>0?-0.15:0.15);
      m.col(rx2-0.36, rx2+0.30, DZ-0.72, DZ+0.72, FY, FY+0.44);
      m.C("glass", 0.10,0.10,0.04,16, rx2+0.05, FY+0.455, DZ-0.30, "#a8c8c0");                 // the ashtray
      m.P("plaster", new T.SphereGeometry(0.09,14,6,0,Math.PI*2,Math.PI/2,Math.PI/2), rx2-0.02, FY+0.525, DZ+0.25, 0, "#d86a4a"); // candy dish
      for(let k=0;k<3;k++)
        m.B("paper", 0.22, 0.008, 0.30, rx2+0.10, FY+0.441+k*0.009, DZ+0.05, 0.4, 0.3+k*0.25, ["#c8302a","#2a6aa8","#e8c040"][k]);
    }
    // two armchairs, facing each other across the table
    const arm=(cx, cz, ry, col)=>{
      const S=(dx,dz)=>[cx+dx*Math.cos(ry)+dz*Math.sin(ry), cz-dx*Math.sin(ry)+dz*Math.cos(ry)];
      m.B("fabric", 0.70, 0.14, 0.66, cx, FY+0.36, cz, 0.5, ry, col);
      let q=S(0,-0.30); m.P("fabric", boxGeo(0.70, 0.62, 0.12, 0.5), q[0], FY+0.66, q[1], ry, col, -0.14, 0);
      for(const sd of [-1,1]){ q=S(sd*0.36,0); m.P("fabric", boxGeo(0.06, 0.18, 0.60, 0.5), q[0], FY+0.52, q[1], ry, col, 0, 0); }
      for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]]){ q=S(a[0]*0.28, a[1]*0.26);
        m.C("oak", 0.020,0.012,0.30,8, q[0], FY+0.14, q[1], WALNUTD); }
      m.col(cx-0.40, cx+0.40, cz-0.40, cz+0.40, FY, FY+0.9);
    };
    arm(rx2+0.05, DZ+1.85, Math.PI+0.25, "#d06a50");
    arm(rx2+0.05, DZ-1.85, -0.25, "#c8a03a");
    // the console television on the north wall, on, showing the test card
    const tvx=LX0+3.4, tvz=LZ1-0.30;
    m.B("oak", 1.10, 0.72, 0.52, tvx, FY+0.53, tvz, 0.5, 0, WALNUT);
    for(const a of [[-0.48,-0.20],[0.48,-0.20],[-0.48,0.20],[0.48,0.20]])
      m.C("oak", 0.020,0.012,0.17,8, tvx+a[0], FY+0.085, tvz+a[1], WALNUTD);
    m.B("paint", 0.56, 0.44, 0.02, tvx-0.20, FY+0.60, tvz-0.265, 0.4, 0, "#c8b890");
    signPanel(0.48, 0.36, signTex(240,180,(t,w,h)=>{
      t.fillStyle="#8a8a8a"; t.fillRect(0,0,w,h);
      const bars=["#e8e8e8","#d8d040","#40c8c8","#40c040","#c040c0","#c84040","#4040c8","#202020"];
      bars.forEach((c,i)=>{ t.fillStyle=c; t.fillRect(20+i*25, 26, 25, 70); });
      t.strokeStyle="#f0f0f0"; t.lineWidth=3; t.beginPath(); t.arc(w/2, 112, 44, 0, 7); t.stroke();
      t.beginPath(); t.moveTo(w/2, 60); t.lineTo(w/2, 164); t.moveTo(w/2-70, 112); t.lineTo(w/2+70, 112); t.stroke();
      t.fillStyle="#202020"; t.fillRect(w/2-32, 124, 64, 20);
      t.fillStyle="#f0f0f0"; t.font="700 13px Arial"; t.textAlign="center"; t.textBaseline="middle";
      t.fillText("CHANNEL 7", w/2, 134);
    }), W(tvx-0.20), GY+FY+0.60, Z(tvz-0.278), Math.PI, true);
    m.B("fabric", 0.36, 0.44, 0.02, tvx+0.33, FY+0.60, tvz-0.265, 0.5, 0, "#b8a070");          // the speaker cloth
    for(let k=0;k<2;k++) m.C("brass", 0.025,0.025,0.03,12, tvx+0.33, FY+0.30+k*0.08, tvz-0.28, BRASS, Math.PI/2);
    for(const sd of [-1,1]) m.C("metal", 0.005,0.004,0.60,5, tvx+0.05+sd*0.06, FY+1.15, tvz, "#c8c8c0", 0, 0, sd*0.45);
    m.C("metal", 0.04,0.05,0.04,10, tvx+0.05, FY+0.91, tvz, "#2a2a2a");
    m.col(tvx-0.58, tvx+0.58, tvz-0.28, LZ1, FY, FY+0.9);
    m.lamp(tvx-0.2, FY+0.65, tvz-0.9, {color:0xc8d8ff, intensity:0.16, dist:3.5, decay:2.0, indoor:true, vol:VOLL});
    // the hi-fi, low, near the glass, a record on it and the rest in the rack
    const hx=LX0+1.2, hz=LZ1-0.25;
    m.B("oak", 1.30, 0.62, 0.42, hx, FY+0.40, hz, 0.5, 0, WALNUT);
    for(const a of [[-0.58,-0.16],[0.58,-0.16],[-0.58,0.16],[0.58,0.16]]) m.C("oak", 0.018,0.012,0.10,8, hx+a[0], FY+0.05, hz+a[1], WALNUTD);
    m.C("paint", 0.15,0.15,0.008,24, hx-0.25, FY+0.716, hz, "#1a1a1a");
    m.C("paint", 0.04,0.04,0.010,12, hx-0.25, FY+0.718, hz, "#c83a2a");
    for(let k=0;k<6;k++) m.B("paper", 0.008, 0.30, 0.30, hx+0.30+k*0.025, FY+0.86, hz, 0.4, 0, ["#e07a5a","#2a6aa8","#e8c040","#3a3a3a","#5fb0a6","#c8302a"][k]);
    m.col(hx-0.66, hx+0.66, hz-0.22, LZ1, FY, FY+0.72);
    // the end table by the sofa: the telephone and a lamp
    const ex=LX1-0.45, ez=DZ-1.55;
    m.B("oak", 0.46, 0.04, 0.46, ex, FY+0.56, ez, 0.5, 0, WALNUT);
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]]) m.C("oak", 0.016,0.010,0.54,8, ex+a[0]*0.19, FY+0.28, ez+a[1]*0.19, WALNUTD);
    m.B("paint", 0.20, 0.08, 0.16, ex+0.05, FY+0.62, ez-0.10, 0.4, 0, "#1a1a1a");                   // the telephone
    m.C("paint", 0.05,0.05,0.012,14, ex+0.05, FY+0.664, ez-0.10, "#d8d4c8");
    m.P("paint", boxGeo(0.20, 0.04, 0.05, 0), ex+0.05, FY+0.69, ez-0.10, 0, "#1a1a1a", 0, 0);
    m.C("plaster", 0.06,0.09,0.24,14, ex-0.06, FY+0.70, ez+0.10, "#e07a5a");
    m.P("lampshade", shadeGeo(0.13,0.15,0.20,16), ex-0.06, FY+0.96, ez+0.10, 0, "#f2ead8");
    m.lamp(ex-0.06, FY+0.95, ez+0.10, {color:0xffd8a8, intensity:0.50, dist:5.0, decay:1.7, indoor:true, vol:VOLL});
    m.col(ex-0.25, ex+0.25, ez-0.25, ez+0.25, FY, FY+0.6);
    // the tripod lamp in the far corner, three cones
    const fx=LX1-0.45, fz=LZ1-0.45;
    for(let k=0;k<3;k++){ const a=k*2.094;
      m.C("brass", 0.012,0.012,1.50,6, fx+Math.cos(a)*0.12, FY+0.74, fz+Math.sin(a)*0.12, BRASS, Math.sin(a)*0.12, 0, -Math.cos(a)*0.12); }
    for(let k=0;k<3;k++){ const a=k*2.094+0.5;
      m.P("lampshade", shadeGeo(0.05,0.11,0.20,12), fx+Math.cos(a)*0.16, FY+1.40+k*0.10, fz+Math.sin(a)*0.16, 0,
          ["#e07a5a","#efe6cf","#5fb0a6"][k], Math.sin(a)*0.4, -Math.cos(a)*0.4); }
    m.lamp(fx, FY+1.45, fz, {color:0xffdcb0, intensity:0.55, dist:6, decay:1.7, indoor:true, vol:VOLL});
    m.col(fx-0.2, fx+0.2, fz-0.2, fz+0.2, FY, FY+1.7);
    // the south wall: a credenza, a bar on it, the sunburst clock over it, a print
    const cx2=LX0+4.3, cz2=LZ0+0.26;
    m.B("oak", 1.70, 0.66, 0.46, cx2, FY+0.45, cz2, 0.5, 0, WALNUT);
    for(const a of [[-0.78,-0.18],[0.78,-0.18],[-0.78,0.18],[0.78,0.18]]) m.C("oak", 0.018,0.012,0.12,8, cx2+a[0], FY+0.06, cz2+a[1], WALNUTD);
    for(const o of [-0.42, 0.42]) m.B("oak", 0.80, 0.56, 0.01, cx2+o, FY+0.46, cz2+0.235, 0.5, 0, o<0?"#7a5030":"#6a4428");
    m.C("glass", 0.07,0.09,0.24,14, cx2-0.45, FY+0.90, cz2, "#c89a5a");                              // the decanter
    m.C("glass", 0.025,0.025,0.06,12, cx2-0.45, FY+1.05, cz2, "#c8d8d8");
    for(let k=0;k<4;k++) m.C("glass", 0.03,0.025,0.09,12, cx2-0.15+k*0.08, FY+0.825, cz2+0.05, "#d8e8e8");
    m.B("metal", 0.40, 0.02, 0.26, cx2-0.05, FY+0.79, cz2, 0.4, 0, BRASS);
    m.col(cx2-0.86, cx2+0.86, LZ0, cz2+0.24, FY, FY+0.8);
    // the sunburst: a gold disc and its rays, stopped at twenty to four
    const sy=FY+1.80, sz2=LZ0+0.04;
    m.C("brass", 0.12,0.12,0.04,20, cx2, sy, sz2, BRASS, Math.PI/2);
    m.P("clockface", new T.CircleGeometry(0.095, 24), cx2, sy, sz2+0.022, 0, "#f2ead8");
    for(let k=0;k<20;k++){ const a=k*Math.PI/10, L=k%2?0.26:0.36;
      m.P("brass", boxGeo(L, 0.012, 0.012, 0), cx2+Math.cos(a)*(0.12+L/2), sy+Math.sin(a)*(0.12+L/2), sz2, 0, BRASS, 0, a); }
    m.P("paint", boxGeo(0.004, 0.07, 0.003, 0), cx2-0.015, sy+0.01, sz2+0.026, 0, "#1a1a1a", 0, 0.9);
    m.P("paint", boxGeo(0.004, 0.05, 0.003, 0), cx2+0.02, sy-0.005, sz2+0.026, 0, "#1a1a1a", 0, -2.1);
    m.B("oak", 0.70, 0.52, 0.03, LX0+1.9, FY+1.70, LZ0+0.015, 0.4, 0, "#1a1a1a");                 // a print
    signPanel(0.62, 0.44, signTex(248,176,(t,w,h)=>{
      t.fillStyle="#f2ead8"; t.fillRect(0,0,w,h);
      for(const q of [[40,30,90,60,"#e07a5a"],[120,70,70,80,"#3a8a82"],[60,100,50,50,"#c8a03a"],[170,30,40,40,"#2a2a2a"]]){
        t.fillStyle=q[4]; t.beginPath(); t.ellipse(q[0]+q[2]/2, q[1]+q[3]/2, q[2]/2, q[3]/2, 0.4, 0, 7); t.fill(); }
      t.strokeStyle="#2a2a2a"; t.lineWidth=3; t.beginPath(); t.moveTo(20,150); t.bezierCurveTo(80,40,160,180,230,60); t.stroke();
    }), W(LX0+1.9), GY+FY+1.70, Z(LZ0+0.033), 0, false);
    // the snake plant in the south-east corner, in a pot on legs
    const px=LX1-0.40, pz=LZ0+0.40;
    m.C("plaster", 0.17,0.13,0.30,14, px, FY+0.36, pz, "#efe6cf");
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]]) m.C("metal", 0.008,0.008,0.22,6, px+a[0]*0.10, FY+0.11, pz+a[1]*0.10, "#2a2a2a");
    for(let k=0;k<9;k++)
      m.P("foliage", boxGeo(0.05, 0.55+((k*7)%4)*0.12, 0.012, 0), px+Math.cos(k*0.7)*0.06, FY+0.75+((k*7)%4)*0.06,
          pz+Math.sin(k*0.7)*0.06, k*0.7, "#4a7a3a", Math.cos(k*1.3)*0.18, Math.sin(k*1.3)*0.18);
    m.col(px-0.2, px+0.2, pz-0.2, pz+0.2, FY, FY+1.2);
    // and the sputnik over the middle of the room
    const kx=LX1-2.2, ky=FY+LH-0.62;
    m.C("brass", 0.006,0.006,0.50,5, kx, FY+LH-0.25, DZ, BRASS);
    m.P("brass", new T.SphereGeometry(0.07,14,10), kx, ky, DZ, 0, BRASS);
    for(let k=0;k<14;k++){
      const th=k*2.399, ph=Math.acos(1-2*((k+0.5)/14)), dx=Math.sin(ph)*Math.cos(th), dy=Math.cos(ph), dz=Math.sin(ph)*Math.sin(th);
      m.C("brass", 0.005,0.005,0.34,5, kx+dx*0.20, ky+dy*0.20, DZ+dz*0.20, BRASS,
          Math.atan2(dz, dy), 0, -Math.atan2(dx, Math.hypot(dy,dz)));
      m.P("ceilfix", new T.SphereGeometry(0.022,8,6), kx+dx*0.38, ky+dy*0.38, DZ+dz*0.38, 0, "#fff2d8");
    }
    m.lamp(kx, ky-0.10, DZ, {color:0xffe2b8, intensity:1.25, dist:10, decay:1.3, indoor:true, vol:VOLL});
    /* AND IT IS LIT LIKE A SET. Two lamps you cannot see, in the ceiling on
       the glass side, throw light on the faces of everything turned to the
       mirror — which is how a room built to be watched is lit. */
    for(const sz of [-2.2, 2.2])
      m.lamp(LX0+1.4, FY+LH-0.45, DZ+sz, {color:0xfff0dc, intensity:0.85, dist:9, decay:1.4, indoor:true, vol:VOLL});
    addBuried(W(LX0), W(LX1+LWT+0.6), Z(LZ0-LWT-0.6), Z(LZ1+LWT+0.6), GY+FY-1.0, GY+FY+LH+0.8, 0xffe8cc);
  }
})();
