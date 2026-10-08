"use strict";
/* LOW DESERT MOTEL · 14b-desert.js
   part two: the filling station, the mast and the tracking station
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* Continues 14-desert.js; uses the G / mk / mkPi defined there. */
  /* --- a filling station that stopped selling anything ------------------
     Two bays' worth of building: a shop you can walk into and a service bay
     with the shutter jammed part way up, an island under a canopy with two
     pumps on it, and a price sign out by the track with nothing on it.   */
  (function(){
    const m=mk(-145,-359);
    const GT=0.22, GH=3.30, F=0.12;                       // wall, height, floor
    const SX0=-6.30, SX1=1.10, BX0=-12.00, BX1=SX0;       // shop / bay
    const Z0g=-0.60, Z1g=5.00;
    const QX0=SX0+GT, QX1=SX1-GT, QZ0=Z0g+GT, QZ1=Z1g-GT; // shop inner faces
    const YX0=BX0+GT, YX1=BX1-GT;                         // bay inner faces
    // Nothing out here has been painted since about 1979 and it showed —
    // crisp cream walls, a bright green band and two pillar-box pumps read as
    // a station that shut last week. Everything is sun-bleached and chalked
    // back, and the streaks and the drift below do the rest.
    const WALLC="#b0a691", TRIMG="#4a6a60", GALV2="#8d9490";
    const DOORG=[-3.20,-2.18];                            // the shop door
    const BAYO=[-10.90,-7.30];                            // the shutter opening
    const holes=(a0,a1,hs)=>{ const out=[]; let c=a0;
      for(const h of hs){ if(h[0]>c) out.push([c,h[0]]); c=Math.max(c,h[1]); }
      if(c<a1) out.push([c,a1]); return out; };
    const roll2=(bk,r,L,x,y,z,col,horiz)=>            // a rolled edge, as the bar has
      m.C(bk, r,r,L,8, x,y,z, col, horiz?0:Math.PI/2, 0, horiz?Math.PI/2:0);

    // ---- the apron, and what has come up through it --------------------
    m.B("concrete", 26.0,0.26,13.0, -3.5,0.13,0, 0.45,0, "#968e80");
    m.flat(-16.5,9.5,-6.5,6.5, F+0.02);
    for(let i=0;i<9;i++){                                  // the slab joints
      m.P("soot", planeGeo(13.0,0.05,0), -15.0+i*3.0, F+0.028, 0, Math.PI/2, "#6e675c",
          -Math.PI/2, 0);
    }
    for(let i=0;i<34;i++){                                 // weeds through the cracks
      const wx=-15.6+((i*2.17)%24.0), wz=-5.8+((i*1.37)%11.4);
      if(wx>BX0-0.6 && wx<SX1+0.6 && wz>Z0g-0.6) continue;
      for(let k=0;k<4+((i*3)%4);k++){
        const a=((i*13+k*29)%360)*0.01745, lean=0.35+((k*5)%4)*0.18, L=0.15+((i*7)%4)*0.10;
        const si=Math.sin(lean), co=Math.cos(lean);
        m.P("foliage", boxGeo(0.018, L, 0.008, 0), wx+Math.sin(a)*si*L/2, F+co*L/2,
            wz+Math.cos(a)*si*L/2, a, ((i+k)%3) ? "#7a7f4e" : "#9a8f70", lean, 0);
      }
    }
    for(let i=0;i<8;i++)                                   // and the oil that never lifted
      m.P("soot", planeGeo(1.6+((i*5)%3)*0.7, 1.2+((i*7)%3)*0.5, 0),
          -1.0+((i*3.1)%9.0), F+0.03+i*0.002, -3.4+((i*1.9)%3.0), i*0.7, "#3a332a",
          -Math.PI/2, 0);

    // ---- the shell: shop, bay, and one roof over both -------------------
    m.B("concrete", SX1-BX0+0.6, 0.24, Z1g-Z0g+0.6, (BX0+SX1)/2, F-0.12, (Z0g+Z1g)/2,
        0.45, 0, "#9b948a");
    for(const g of holes(BX0,SX1,[BAYO,DOORG]))            // the front wall
      m.B("stucco", g[1]-g[0], GH, GT, (g[0]+g[1])/2, F+GH/2, Z0g+GT/2, 0.3, 0, WALLC);
    m.B("stucco", DOORG[1]-DOORG[0], GH-2.07, GT, (DOORG[0]+DOORG[1])/2,
        F+2.07+(GH-2.07)/2, Z0g+GT/2, 0.3, 0, WALLC);
    m.B("stucco", SX1-BX0, GH, GT, (BX0+SX1)/2, F+GH/2, Z1g-GT/2, 0.3, 0, WALLC);
    for(const xc of [BX0+GT/2, SX1-GT/2, SX0])             // ends and the party wall
      m.B("stucco", GT, GH, Z1g-Z0g-GT*2, xc, F+GH/2, (Z0g+Z1g)/2, 0.3, 0, WALLC);
    m.B("roofG", SX1-BX0+0.9, 0.26, Z1g-Z0g+0.9, (BX0+SX1)/2, F+GH+0.13, (Z0g+Z1g)/2,
        0.3, 0, "#7d7466");
    m.B("signlit", SX1-BX0-0.4, 0.86, 0.16, (BX0+SX1)/2, F+GH-0.20, Z0g-0.10, 0, 0, "#d8d2c4");
    roll2("signlit", 0.09, SX1-BX0-0.4, (BX0+SX1)/2, F+GH+0.21, Z0g-0.10, "#d8d2c4", true);
    m.B("teal", SX1-BX0-0.4, 0.14, 0.08, (BX0+SX1)/2, F+GH-0.66, Z0g-0.135, 0, 0, TRIMG);
    for(const g of holes(BX0,SX1,[BAYO,DOORG])) m.col(g[0], g[1], Z0g, Z0g+GT, 0, F+GH);
    m.col(BX0, SX1, Z1g-GT, Z1g, 0, F+GH);
    for(const xc of [BX0, SX0-GT/2, SX1-GT])
      m.col(xc, xc+GT, Z0g, Z1g, 0, F+GH);
    // the glazing either side of the shop door, and the bars over it
    for(const w of [[-5.90,-3.60],[-1.80,0.70]]){
      // forty years of dust on the inside and nobody to wash it off
      m.B("glass", w[1]-w[0], 1.86, GT*0.5, (w[0]+w[1])/2, F+1.45, Z0g+GT/2, 0, 0, "#8a9088");
      for(let i=0;i<5;i++)                              // the grime, in runs
        m.P("soot", planeGeo(0.18+((i*5)%3)*0.12, 1.70, 0), w[0]+0.3+i*(w[1]-w[0]-0.6)/4,
            F+1.45, Z0g+GT*0.30, 0, "#6e6a5e", 0, 0);
      m.B("teal", w[1]-w[0]+0.14, 0.12, 0.20, (w[0]+w[1])/2, F+2.44, Z0g+0.04, 0, 0, TRIMG);
      m.B("teal", w[1]-w[0]+0.14, 0.14, 0.24, (w[0]+w[1])/2, F+0.46, Z0g+0.02, 0, 0, TRIMG);
      for(let i=0;i<5;i++)
        m.C("metal", 0.016,0.016,1.90,6, w[0]+0.24+i*(w[1]-w[0]-0.48)/4, F+1.45,
            Z0g-0.04, "#6b6156");
      for(let i=0;i<3;i++)                                 // and what is taped inside it
        m.P("paper", planeGeo(0.24,0.32,0), w[0]+0.5+i*0.7, F+1.55+((i*5)%3)*0.2,
            Z0g+GT*0.72, ((i*7)%5-2)*0.09, "#c8c0a6", 0, 0);
      // one pane gone and boarded from inside, another starred where it went
      m.B("plank", 0.98, 1.70, 0.05, w[0]+0.72, F+1.45, Z0g+GT*0.34, 0.5, 0, "#8a7550");
      for(let i=0;i<3;i++)
        m.B("plank", 1.02, 0.22, 0.045, w[0]+0.72, F+0.85+i*0.60, Z0g+GT*0.22,
            0.5, ((i*7)%5-2)*0.02, "#7a6646");
      for(let i=0;i<9;i++){
        const a5=i*0.70;
        m.P("soot", planeGeo(0.02, 0.24+((i*5)%4)*0.18, 0),
            w[1]-0.55+Math.cos(a5)*0.14, F+1.62+Math.sin(a5)*0.14, Z0g+GT*0.30,
            0, "#d8d4c8", 0, -a5);
      }
    }
    makeDoor(XF(-145+DOORG[0]+0.02, -359+Z0g+0.04, 0), 0, m.y+F+0.02, 0,
             "THE FILLING STATION", true, 0, "booth");
    // the bay: a roller shutter jammed two thirds up, and the track it runs on
    m.B("stucco", BAYO[1]-BAYO[0], GH-2.92, GT, (BAYO[0]+BAYO[1])/2, F+2.92+(GH-2.92)/2,
        Z0g+GT/2, 0.3, 0, WALLC);
    m.B("weathered", BAYO[1]-BAYO[0], 1.02, 0.07, (BAYO[0]+BAYO[1])/2, F+2.41,
        Z0g+0.04, 0.5, 0, "#8c8477");
    for(let i=0;i<9;i++)
      m.B("weathered", BAYO[1]-BAYO[0], 0.025, 0.10, (BAYO[0]+BAYO[1])/2,
          F+1.94+i*0.115, Z0g+0.04, 0, 0, "#7b7368");
    m.C("weathered", 0.13,0.13,BAYO[1]-BAYO[0]+0.2, 12, (BAYO[0]+BAYO[1])/2, F+2.96,
        Z0g+0.12, "#8c8477", 0, 0, Math.PI/2);
    for(const q of BAYO) m.B("metal", 0.10, 2.92, 0.12, q, F+1.46, Z0g+0.10, 0, 0, GALV2);

    for(let i=0;i<5;i++)                                   // rust running down the shutter
      m.P("rust", streakGeo(0.13, 0.80, 0), BAYO[0]+0.5+i*0.65, F+2.35, Z0g-0.01,
          0, "#6a3a20", 0, 0);

    // ---- inside the shop -----------------------------------------------
    m.B("checker", QX1-QX0, 0.05, QZ1-QZ0, (QX0+QX1)/2, F-0.015, (QZ0+QZ1)/2, 0.5, 0, "#ffffff");
    m.B("plaster", QX1-QX0, 0.07, QZ1-QZ0, (QX0+QX1)/2, F+GH-0.05, (QZ0+QZ1)/2, 0.4, 0, "#a49e92");
    for(const fx of [-4.4, -1.0]){                         // two strips, both dead
      m.B("metal", 1.20, 0.08, 0.20, fx, F+GH-0.13, 2.6, 0.4, 0, "#7d8387");
      m.C("teal", 0.008,0.008,0.26,5, fx-0.4, F+GH-0.28, 2.6, "#2e2a26", 0.6, 1.2, 0);
    }
    // the counter, with the register that was open when they left
    m.B("oak", 2.60, 0.98, 0.62, -4.30, F+0.49, QZ1-0.70, 0.5, 0, "#6a4b30");
    m.B("stairs", 2.72, 0.06, 0.70, -4.30, F+1.01, QZ1-0.70, 0.5, 0, "#8a5c34");
    roll2("stairs", 0.035, 2.72, -4.30, F+1.035, QZ1-1.05, "#8a5c34", true);
    m.col(-5.62, -2.98, QZ1-1.02, QZ1-0.38, 0, F+1.05);
    m.B("metal", 0.40, 0.26, 0.34, -3.60, F+1.17, QZ1-0.70, 0.4, 0, "#7d8387");
    m.B("metal", 0.34, 0.10, 0.28, -3.60, F+1.35, QZ1-0.70, 0.4, 0, "#6f767a");
    m.B("paper", 0.28, 0.02, 0.22, -3.60, F+1.05, QZ1-1.00, 0.4, 0.2, "#cdc4ae");
    for(let i=0;i<9;i++)                                   // the cigarette rack behind
      m.B("paper", 0.11, 0.17, 0.05, -5.30+i*0.15, F+1.12, QZ1-0.40, 0, 0,
          ["#c8443a","#2f6e8a","#d8a42a","#4f7a4a","#dcd2b4"][i%5]);
    m.B("oak", 1.20, 0.60, 0.16, -5.10, F+1.95, QZ1-0.12, 0.5, 0, "#5b4632");
    for(let i=0;i<14;i++)                                  // a board of keys
      m.C("metal", 0.008,0.008,0.07,5, -5.62+i*0.08, F+1.86, QZ1-0.20, "#9aa1a6");
    // shelving down the middle, emptied years ago. Two gondolas to a row with
    // an aisle between them on the line of the door — one long run across the
    // doorway is a wall, and you walked into it.
    for(let r=0;r<2;r++){
      const sz=QZ0+1.80+r*1.40;
      for(const g of [[-5.20,-3.34],[-2.06,-0.80]]){
        const cw=g[1]-g[0], cx2=(g[0]+g[1])/2;
        m.B("metal", cw, 0.05, 0.42, cx2, F+0.06, sz, 0.5, 0, "#7d8387");
        for(const q of [-cw/2+0.03, cw/2-0.03])
          m.B("metal", 0.06, 1.62, 0.42, cx2+q, F+0.81, sz, 0.5, 0, "#7d8387");
        for(let k=0;k<4;k++){
          m.B("metal", cw-0.10, 0.035, 0.40, cx2, F+0.42+k*0.40, sz, 0.5, 0, "#8d9498");
          for(let i=0;i<4;i++){                            // what is still on them
            if(((r*7+k*3+i)%3)!==0) continue;
            m.B("paper", 0.15, 0.20, 0.13, g[0]+0.30+i*(cw-0.6)/3, F+0.53+k*0.40, sz, 0.5,
                ((i*5)%4)*0.2, ["#c8443a","#2f6e8a","#d8a42a","#4f7a4a"][(i+k)%4]);
          }
        }
        m.col(g[0], g[1], sz-0.26, sz+0.26, 0, F+1.7);
      }
    }
    // a chest cooler with the lid up, a map rack, and a calendar that stopped
    m.B("weathered", 1.44, 0.88, 0.70, QX0+0.86, F+0.44, QZ0+0.52, 0.4, 0, "#9cb0b4");
    m.P("weathered", boxGeo(1.48,0.10,0.74,0.4), QX0+0.86, F+0.95, QZ0+0.52, 0,
        "#a9bdc1", -0.48, 0);
    m.col(QX0, QX0+1.62, QZ0, QZ0+0.90, 0, F+0.95);
    // the map rack is a shallow case ON the east wall with the maps in its
    // face; it was a deep box standing 10 cm off the wall with the maps
    // inside it
    m.B("metal", 0.16, 1.10, 0.86, QX1-0.08, F+1.40, QZ0+1.23, 0.5, 0, "#7d8387");
    for(let i=0;i<8;i++)
      m.P("paper", planeGeo(0.17,0.24,0), QX1-0.165, F+1.06+((i%4)*0.29), QZ0+1.02+((i/4)|0)*0.42,
          -Math.PI/2, "#dcd2b4", 0, ((i*7)%5-2)*0.05);
    m.P("art", boxGeo(0.02,0.46,0.34,0), QX1-0.02, F+1.90, QZ0+2.40, 0, "#e2dac4");
    // a sink in the corner and a door that says STAFF and never opens
    // in the corner: against both walls (it stood 9 and 20 cm off them)
    m.B("plaster", 0.50,0.16,0.40, QX1-0.25, F+0.86, QZ1-0.20, 0.5, 0, "#dcdcd4");
    m.C("metal", 0.016,0.016,0.12,8, QX1-0.25, F+1.00, QZ1-0.04, "#9aa4a8");
    m.C("metal", 0.025,0.025,0.70,8, QX1-0.25, F+0.43, QZ1-0.06, "#9aa4a8");     // its trap and pipe
    m.B("oak", 0.10, 2.04, 0.92, QX1-0.03, F+1.02, QZ0+3.40, 0.5, 0, "#6a4b30");
    m.B("paint", 0.02, 0.22, 0.16, QX1-0.09, F+1.62, QZ0+3.40, 0, 0, "#2a3a5a");
    // what blew in, and the glass that got broken
    for(let i=0;i<22;i++)
      m.P("paper", planeGeo(0.09+((i*3)%4)*0.04, 0.06+((i*5)%3)*0.03, 0),
          QX0+0.3+((i*0.93)%(QX1-QX0-0.6)), F+0.012+i*0.0005,
          QZ0+0.4+((i*0.71)%(QZ1-QZ0-0.9)), i*1.7,
          ["#c8443a","#2f6e8a","#d8a42a","#4f7a4a","#dcd2b4"][i%5], -Math.PI/2, 0);
    for(let i=0;i<14;i++)
      m.P("glass", planeGeo(0.05+((i*3)%3)*0.03, 0.04, 0), QX0+0.5+((i*1.31)%(QX1-QX0-1.0)),
          F+0.006, QZ0+0.5+((i*0.87)%(QZ1-QZ0-1.0)), i*2.1, "#cfe0e6", -Math.PI/2, 0);
    addZone(-145+QX0, -145+QX1, -359+QZ0, -359+QZ1, m.y+F-0.3, m.y+F+GH,
            "THE FILLING STATION", true);

    // ---- inside the bay -------------------------------------------------
    m.B("concrete", YX1-YX0, 0.05, Z1g-Z0g-GT*2, (YX0+YX1)/2, F-0.015, (Z0g+Z1g)/2,
        0.5, 0, "#8d877c");
    m.B("plaster", YX1-YX0, 0.07, Z1g-Z0g-GT*2, (YX0+YX1)/2, F+GH-0.05, (Z0g+Z1g)/2,
        0.4, 0, "#a49e92");
    for(let i=0;i<6;i++)                                   // oil worked into the slab
      m.P("soot", planeGeo(1.4+((i*5)%3)*0.6, 1.0+((i*7)%3)*0.5, 0),
          YX0+0.9+((i*1.7)%4.2), F+0.014+i*0.003, Z0g+1.0+((i*1.3)%3.4), i*0.8,
          "#2e281f", -Math.PI/2, 0);
    // the pit, boarded over, and a hoist that never came down
    m.B("bin", 1.30, 0.05, 3.60, YX0+2.40, F+0.02, 2.10, 0.5, 0, "#3a352e");
    for(let i=0;i<7;i++)
      m.B("oak", 1.34, 0.05, 0.42, YX0+2.40, F+0.045, 0.70+i*0.50, 0.5, 0, "#6a5236");
    m.C("metal", 0.10,0.12,GH-0.2, 10, YX0+0.70, F+(GH-0.2)/2, 3.60, GALV2);
    m.B("metal", 2.20, 0.16, 0.16, YX0+1.70, F+GH-0.34, 3.60, 0, 0, GALV2);
    m.C("metal", 0.010,0.010,0.90,5, YX0+2.60, F+GH-0.82, 3.60, "#5f676b");
    m.B("metal", 0.30, 0.10, 0.22, YX0+2.60, F+GH-1.32, 3.60, 0, 0, "#7d8387");
    // a bench down the back with a vice and what was left on it
    m.B("oak", YX1-YX0-0.9, 0.09, 0.66, (YX0+YX1)/2, F+0.88, Z1g-GT-0.36, 0.5, 0, "#6a5236");
    for(const q of [-2.0, 0, 2.0])
      m.B("metal", 0.08, 0.84, 0.60, (YX0+YX1)/2+q, F+0.44, Z1g-GT-0.36, 0.5, 0, "#6f767a");
    m.col(YX0+0.3, YX1-0.3, Z1g-GT-0.72, Z1g-GT, 0, F+0.92);
    m.B("metal", 0.22, 0.26, 0.20, YX0+1.20, F+1.05, Z1g-GT-0.36, 0.4, 0, "#5f676b");
    m.C("metal", 0.020,0.020,0.34,6, YX0+1.20, F+1.22, Z1g-GT-0.36, "#8d9498", 0,0,Math.PI/2);
    for(let i=0;i<9;i++)                                   // spanners on a board
      m.C("metal", 0.012,0.012,0.18+((i*7)%4)*0.06, 6, YX0+2.6+i*0.16, F+1.72,
          Z1g-GT-0.05, "#9aa1a6");
    m.B("oak", 1.70, 0.62, 0.05, YX0+3.2, F+1.72, Z1g-GT-0.02, 0.5, 0, "#5b4632");
    // a compressor, a drum, and a stack of tyres nobody collected
    m.C("metal", 0.26,0.26,1.00,14, YX1-0.60, F+0.50, Z0g+1.30, "#7a3f2e", Math.PI/2, 0, 0);
    m.C("metal", 0.16,0.16,0.40,10, YX1-0.60, F+0.92, Z0g+1.30, "#5f676b");
    m.col(YX1-0.92, YX1-0.28, Z0g+0.76, Z0g+1.84, 0, F+1.1);
    m.C("weathered", 0.29,0.29,0.88,14, YX0+0.70, F+0.44, Z0g+0.72, "#6b6156");
    m.col(YX0+0.40, YX0+1.00, Z0g+0.42, Z0g+1.02, 0, F+0.90);
    for(let i=0;i<4;i++)
      m.P("tyre", new T.TorusGeometry(0.30,0.11,7,16), YX0+4.30, F+0.11+i*0.20,
          Z0g+0.90, i*0.8, "#26252a", Math.PI/2, 0);
    m.col(YX0+3.90, YX0+4.70, Z0g+0.50, Z0g+1.30, 0, F+0.90);
    addZone(-145+YX0, -145+YX1, -359+Z0g+GT, -359+Z1g-GT, m.y+F-0.3, m.y+F+GH,
            "THE SERVICE BAY", true);

    // ---- the island, the pumps and the canopy ---------------------------
    const IZ=-3.20;
    m.B("concrete", 7.4,0.34,3.0, 4.0,0.34,IZ, 0.45,0, "#a49c8c");
    roll2("concrete", 0.085, 7.4, 4.0, 0.425, IZ-1.50, "#b9b2a2", true);
    roll2("concrete", 0.085, 7.4, 4.0, 0.425, IZ+1.50, "#b9b2a2", true);
    m.flat(0.3,7.7, IZ-1.5, IZ+1.5, 0.51);
    for(const px of [2.0, 6.0]){                           // the pumps
      m.B("weathered", 0.68,1.44,0.54, px,F+1.16,IZ, 0.4,0, "#8a4432");
      roll2("weathered", 0.07, 1.44, px-0.34, F+1.16, IZ-0.27, "#8a4432", false);
      roll2("weathered", 0.07, 1.44, px+0.34, F+1.16, IZ-0.27, "#8a4432", false);
      m.B("weathered", 0.76,0.22,0.62, px,F+1.98,IZ, 0.4,0, "#b8b2a2");
      m.C("weathered", 0.11,0.11,0.76,12, px,F+2.14,IZ, "#b8b2a2", 0,0,Math.PI/2);
      for(const sd of [-1,1]){                             // the dials, both at zero
        m.B("tvglass", 0.46,0.34,0.03, px,F+1.62,IZ+sd*0.29, 0,0, "#1d262b");
        for(let i=0;i<4;i++)
          m.B("paint", 0.07,0.13,0.01, px-0.16+i*0.105, F+1.62, IZ+sd*0.31, 0,0, "#c9c4b4");
      }
      m.C("metal", 0.05,0.05,0.30,8, px+0.40,F+1.50,IZ-0.20, "#4a4640", 0,0,1.3);
      for(let i=0;i<7;i++)                                 // the hose, hanging where it fell
        m.P("teal", new T.TorusGeometry(0.11,0.022,5,10), px+0.46, F+1.32-i*0.15,
            IZ-0.24, i*0.5, "#22201e", Math.PI/2-i*0.06, 0);
      m.B("bin", 0.12,0.22,0.08, px+0.46, F+0.28, IZ-0.24, 0, 0.3, "#3a3632");
      m.P("paper", planeGeo(0.24,0.17,0), px, F+1.96, IZ-0.32, 0, "#e2dac4", -0.3, 0);
      m.col(px-0.42,px+0.42,IZ-0.34,IZ+0.34, 0,F+2.0);
    }
    for(const px of [0.8, 7.2]){                           // canopy posts
      m.B("weathered", 0.30,4.30,0.30, px,F+2.15,IZ, 0.4,0, "#aea698");
      roll2("weathered", 0.055, 4.30, px-0.15, F+2.15, IZ-0.15, "#aea698", false);
      roll2("weathered", 0.055, 4.30, px+0.15, F+2.15, IZ-0.15, "#aea698", false);
      m.col(px-0.22,px+0.22,IZ-0.22,IZ+0.22, 0,4.3);
    }
    m.B("weathered", 10.0,0.50,6.2, 4.0,F+4.52,IZ, 0.35,0, "#b6b0a0");
    roll2("weathered", 0.10, 10.0, 4.0, F+4.27, IZ-3.10, "#b6b0a0", true);
    roll2("weathered", 0.10, 10.0, 4.0, F+4.27, IZ+3.10, "#b6b0a0", true);
    m.B("teal", 10.2,0.34,0.18, 4.0,F+4.10,IZ-3.12, 0,0, TRIMG);
    m.B("teal", 10.2,0.34,0.18, 4.0,F+4.10,IZ+3.12, 0,0, TRIMG);
    for(const px of [1.6, 4.0, 6.4]){                      // the lights under it
      m.B("ceilfix", 0.90,0.10,0.34, px, F+4.24, IZ, 0, 0, "#e8e2cf");
      LAMPS.push({x:-145+px, y:m.y+F+4.10, z:-359+IZ, color:0xf0e2c0, intensity:0.30,
                  dist:11, decay:1.5, mothy:true});
    }
    // Streaks off the canopy fascia, where the water has come over the edge
    // at the same points every storm since the Ford administration.
    for(let i=0;i<22;i++){
      const sx=-0.6+((i*2.17)%11.2), w=0.10+((i*5)%4)*0.09;
      for(const sd of [-1,1])
        // 4 mm off the fascia: at IZ+-3.21 they were ON its outer face
        m.P("rust", streakGeo(w, 0.34+((i*7)%4)*0.13, 0), 4.0-5.0+sx, F+4.30,
            IZ+sd*3.214, sd>0?0:Math.PI, "#6a4a2c", 0, 0);
    }
    for(let i=0;i<9;i++)                               // and down the posts
      for(const px of [0.8, 7.2])
        m.P("rust", streakGeo(0.13, 0.70+((i*5)%3)*0.4, 0), px+((i*7)%3-1)*0.11,
            F+0.9+((i*3)%4)*0.85, IZ-0.16, 0, "#6a4a2c", 0, 0);
    for(let i=0;i<14;i++)                              // bird mess on the soffit edge
      m.P("soot", planeGeo(0.16+((i*5)%3)*0.10, 0.20+((i*7)%3)*0.12, 0),
          -0.4+((i*1.87)%9.0), F+4.245, IZ-2.4+((i*1.31)%4.8), i*1.3,
          "#d6d2c6", -Math.PI/2, 0);
    // a panel gone out of the soffit, and the framing behind it
    // its underside 3 mm below the soffit's, not in the soffit's plane
    m.B("bin", 1.30, 0.06, 1.05, 2.4, F+4.297, IZ+1.1, 0.4, 0, "#2b2723");
    for(let i=0;i<4;i++)
      m.B("metal", 1.26, 0.05, 0.05, 2.4, F+4.44, IZ+0.66+i*0.29, 0, 0, "#6f6a60");
    // one pump with its nozzle off and the hose on the ground
    for(let i=0;i<7;i++)
      m.P("teal", new T.TorusGeometry(0.11,0.022,5,10), 6.62+i*0.12, F+0.06,
          IZ-1.30-i*0.10, i*0.8, "#22201e", Math.PI/2, 0);
    m.B("bin", 0.12,0.09,0.22, 7.40, F+0.07, IZ-1.98, 0, 0.5, "#3a3632");
    // sand across the apron, banked up the windward side of everything
    for(let i=0;i<16;i++){
      // A half-buried sphere is a ball, not a drift. Squashed flat and drawn
      // out downwind it reads as sand that blew there.
      const g2=new T.SphereGeometry(0.44+((i*5)%4)*0.32,10,6);
      g2.scale(2.1+((i*7)%3)*0.5, 0.30, 1.35);
      m.P("gravel", g2, -14.0+((i*2.71)%23.0), F-0.10+((i*3)%3)*0.05,
          -5.4+((i*1.91)%10.6), i*0.9, "#b49a72", 0, 0);
    }
    for(let i=0;i<20;i++)                              // and the drift it has left
      m.P("soot", planeGeo(2.2+((i*7)%4)*1.3, 1.4+((i*5)%3)*0.9, 0),
          -14.5+((i*2.31)%24.0), F+0.032, -5.9+((i*1.63)%11.6), i*1.1,
          ["#b09772","#a68d68","#bda37c"][i%3], -Math.PI/2, 0);
    // an air and water column, and a bin that has not been emptied
    m.C("weathered", 0.16,0.18,1.20,12, 8.8, F+0.60, IZ+1.2, "#6b6156");
    m.B("weathered", 0.34,0.30,0.26, 8.8, F+1.32, IZ+1.2, 0.4, 0, "#8a4432");
    for(let i=0;i<6;i++)
      m.P("teal", new T.TorusGeometry(0.12,0.020,5,10), 8.66, F+1.02-i*0.16, IZ+1.06,
          i*0.6, "#22201e", Math.PI/2, 0);
    m.col(8.5,9.1, IZ+0.9, IZ+1.5, 0, F+1.5);
    m.C("bin", 0.30,0.26,0.80,12, -0.6, F+0.40, IZ+0.4, "#4e5a4e");
    m.col(-0.92,-0.28, IZ+0.08, IZ+0.72, 0, F+0.85);
    // ---- the price sign out by the track, with nothing on it ------------
    for(const q of [-0.9, 0.9])
      m.C("metal", 0.10,0.12,5.20,10, 10.6+q, F+2.60, -5.6, "#6b6156");
    m.B("paint", 3.00,1.70,0.20, 10.6, F+5.10, -5.6, 0.4, 0, "#d8d2c4");
    roll2("paint", 0.11, 3.00, 10.6, F+5.95, -5.6, "#d8d2c4", true);
    NEON.push(signPanel(2.70, 1.40, signTex(384,199,(x,W,H2)=>{
      x.fillStyle="#e4ddc8"; x.fillRect(0,0,W,H2);
      x.fillStyle="#b8442e"; x.fillRect(0,0,W,H2*0.30);
      x.fillStyle="#f1ead6"; fitSerif(x,"GASOLINE", W*0.72, H2*0.22, W/2, H2*0.19, "bold");
      x.fillStyle="#2b2f33";
      for(let r=0;r<3;r++){
        x.fillRect(W*0.12, H2*(0.40+r*0.19), W*0.34, H2*0.14);
        for(let c=0;c<3;c++) x.fillRect(W*(0.54+c*0.13), H2*(0.40+r*0.19), W*0.10, H2*0.14);
      }
      x.globalAlpha=0.55; x.fillStyle="#e4ddc8";           // the digits all fell out
      for(let r=0;r<3;r++) for(let c=0;c<3;c++)
        if((r+c)%2===0) x.fillRect(W*(0.54+c*0.13), H2*(0.40+r*0.19), W*0.10, H2*0.14);
      x.globalAlpha=1;
    }), -145+10.6, m.y+F+5.10, -359-5.72, Math.PI, false));
    m.col(9.5,11.7, -5.8,-5.4, 0, F+5.9);
    m.rect(-18,12,-9,8, "A FILLING STATION");
  })();

  /* --- a radio mast, still blinking ------------------------------------ */
  (function(){
    const m=mk(0,-528), H2=44, BW=3.2, TW=0.9, ST="#8f9aa0";
    const legAt=h=>BW+(TW-BW)*(h/H2), tl=Math.atan2(BW-TW,H2);
    for(const q of [[-1,-1],[1,-1],[-1,1],[1,1]])
      m.P("metal", boxGeo(0.17,H2*1.01,0.17,0), q[0]*(BW+TW)/2, H2/2, q[1]*(BW+TW)/2,
          0, ST, -q[1]*tl, q[0]*tl);
    for(let k=1;k<=13;k++){
      const h=k*3.2, w=legAt(h);
      m.B("metal", w*2,0.09,0.09, 0,h, w, 0,0, ST);
      m.B("metal", w*2,0.09,0.09, 0,h,-w, 0,0, ST);
      m.B("metal", 0.09,0.09,w*2, w,h, 0, 0,0, ST);
      m.B("metal", 0.09,0.09,w*2,-w,h, 0, 0,0, ST);
      const w2=legAt(h+3.2), dl=Math.hypot(3.2,w+w2), an=Math.atan2(3.2,w+w2);
      if(k<13) for(const sd of [-1,1]){
        m.P("metal", boxGeo(dl,0.06,0.06,0), 0,h+1.6,sd*(w+w2)/2, 0, ST, 0, an);
        m.P("metal", boxGeo(0.06,0.06,dl,0), sd*(w+w2)/2,h+1.6,0, 0, ST, -an, 0);
      }
    }
    // the legs stop at H2+0.22 in a 1.8 m square: a cap plate across them and
    // a stub to carry the beacon, which used to sit half a metre over the
    // middle of that square on nothing
    m.B("metal", 2.0, 0.08, 2.0, 0, H2+0.18, 0, 0, 0, ST);
    m.C("metal", 0.07, 0.07, 0.32, 8, 0, H2+0.37, 0, ST);
    m.P("neonbox", new T.SphereGeometry(0.42,10,8), 0,H2+0.7,0, 0, "#ff3a2a");
    m.B("concrete", 1.4,0.5,1.4, 0,0.25,0, 0.45,0, "#a9a294");
    m.col(-2.0,2.0,-2.0,2.0, 0,44);
    m.zone(26, "A RADIO MAST");
    LAMPS.push({x:0, y:m.y+H2+0.7, z:-528, color:0xff3a2a, intensity:0.5, dist:30, decay:1.4});
  })();

  /* --- a motel that did not make it ------------------------------------ */
  (function(){
    const m=mk(176,-433);
    m.B("concrete", 28.0,0.26,7.2, 0,0.13,0, 0.45,0, "#a29a8c");           // the slab
    for(let i=0;i<6;i++){                                                  // stubs of wall
      const px=-11.5+i*4.6, h2=0.5+((i*11)%5)*0.35;
      m.B("stucco", 0.24,h2,7.0, px,0.26+h2/2,0, 0.3,0, "#b6a992");
      m.col(px-0.2,px+0.2,-3.5,3.5, 0,0.3+h2);
    }
    m.B("stucco", 27.6,0.9,0.24, 0,0.72,3.5, 0.3,0, "#b6a992");
    m.col(-13.8,13.8,3.3,3.7, 0,1.2);
    // the pool, full of sand
    m.B("concrete", 9.4,0.30,6.4, 2.0,0.15,13.0, 0.45,0, "#a29a8c");
    m.B("plaster", 7.0,1.40,4.0, 2.0,-0.55,13.0, 0.4,0, "#c4cfc8");
    m.B("gravel",  6.8,0.90,3.8, 2.0,-0.28,13.0, 0.5,0, "#b5a17c");        // sand to the brim
    for(let i=0;i<7;i++)
      m.P("foliage", new T.IcosahedronGeometry(0.16+((i*5)%3)*0.09,0),
          -0.4+i*0.8, 0.24, 13.0+Math.sin(i*2.1)*1.3, i, "#6a7a4a");
    m.B("teal", 0.10,1.05,0.10, -2.2,0.70,10.0, 0,0, "#2f6c62");           // a rail left
    m.B("teal", 0.10,0.10,1.30, -2.2,1.20,10.6, 0,0, "#2f6c62");
    m.P("weathered", boxGeo(2.6,1.7,0.14,0.4), -6.0,1.35,-6.0, 0.3, "#cfc4ad");  // the sign
    m.B("weathered", 0.20,2.30,0.20, -6.0,1.15,-6.0, 0,0, "#a9a294");
    m.col(-6.1,-5.9,-6.1,-5.9, 0,2.4);
    m.rect(-17,17,-9,19, "WHAT IS LEFT OF A MOTEL");
  })();

  /* --- a tracking station, six hundred metres back from the road --------
     A parabolic dish on an alt-az mount over a lattice pedestal, a control
     room and a plant hut on a graded circle, and a ring of little white
     marker posts round the edge of it. Far enough out that from the highway
     it is a shape on the horizon, which is the point: it should not stand
     over the rest of the world.                                          */
  (function(){
    const D=Terrain.DISH, m=mk(D.x, D.z);
    const PAINT="#b8b2a4", STEEL="#8e9490", RUSTD="#7a4526", DARK="#4e5450";
    const AZ=0.62, EL=0.58;                        // where it was left pointing
    const cA=Math.cos(AZ), sA=Math.sin(AZ);
    const A=(lx,lz)=>[lx*cA+lz*sA, -lx*sA+lz*cA];  // into the dish's own frame
    // A box runs along its own +Y. After push()'s YXZ euler its axis points
    // along (sin ry · sin rx, cos rx, cos ry · sin rx), so to lay a member
    // between two points: rx = acos(dy), ry = atan2(dx, dz). Everything
    // structural here goes through this, or it comes out a vertical stick.
    const strut=(p0,p1,r,col)=>{
      const dx=p1[0]-p0[0], dy=p1[1]-p0[1], dz=p1[2]-p0[2];
      const L=Math.hypot(dx,dy,dz); if(L<0.01) return;
      m.P("metal", boxGeo(r, L, r, 0), (p0[0]+p1[0])/2, (p0[1]+p1[1])/2, (p0[2]+p1[2])/2,
          Math.atan2(dx,dz), col||STEEL, Math.acos(Math.max(-1,Math.min(1,dy/L))), 0);
    };

    // ---- the pad, its kerb and the posts round it ---------------------
    // A CylinderGeometry's end cap carries UVs that run 0..1 across the whole
    // disc, so the gravel would be magnified eighty-eight metres wide and the
    // pad came out as a few soft pink blotches. The cap is its own circle with
    // the UVs scaled to a sane grain; the cylinder is only the rim now.
    {
      // The surface is compacted fill, not decorative gravel: TEX.gravel is a
      // sheet of hard coloured dots that works on a two-metre planting bed
      // and reads as confetti across ninety, at every tiling that was tried.
      const cap=new T.CircleGeometry(D.r, 48), uv=cap.attributes.uv;
      for(let i=0;i<uv.count;i++) uv.setXY(i, uv.getX(i)*D.r, uv.getY(i)*D.r);
      m.P("concrete", cap, 0, 0.22, 0, 0, "#8e846c", -Math.PI/2, 0);
      // open-ended, or its own cap lands on the same plane as the disc above
      // with the stretched UVs the disc was made to avoid, and fights it
      m.P("concrete", new T.CylinderGeometry(D.r, D.r-0.5, 0.22, 48, 1, true),
          0, 0.11, 0, 0, "#857c66");
    }
    m.flat(-D.r, D.r, -D.r, D.r, 0.22);
    for(let i=0;i<64;i++){                         // the marker posts
      const a=(i/64)*Math.PI*2;
      if(i%8===3) continue;                        // a few knocked out
      m.C("paint", 0.055,0.070,0.62,6, Math.cos(a)*(D.r-1.2), 0.30,
          Math.sin(a)*(D.r-1.2), i%5 ? "#d8d2c2" : "#b8331f", ((i*7)%5-2)*0.05, 0, 0);
    }
    /* Wear on the pad. Twice now this was laid in the soot bucket, which is
       a sixteen-per-cent overlay: that reads on the parking lot because the
       decals are nearly black on asphalt, and reads as nothing at all here
       because sunlit pale fill has no headroom left for a thin dark wash.
       Ninety metres of flat ground needs real tonal variation, so the wear
       is opaque planes in the pad's own texture, just tinted — staggered a
       third of a millimetre apart so no two of them fight.              */
    {
      let sd=4471; const r2=()=>{ sd=(sd*1103515245+12345)%2147483648; return sd/2147483648; };
      /* Each patch one 0.8 mm rung above the highest patch it overlaps
         (bounding circles), rung 0 if it overlaps none. A third of a
         millimetre a step only holds to about thirty metres and this pad is
         ninety across. Same rule as the diner's forecourt. */
      const placed=[];
      const dec=(w,h,rr,a2,ry,c)=>{
        const x=Math.cos(a2)*rr, z=Math.sin(a2)*rr, r=Math.hypot(w,h)/2;
        let k=0;
        for(const q of placed)
          if((q[0]-x)*(q[0]-x)+(q[1]-z)*(q[1]-z) < (q[2]+r)*(q[2]+r)) k=Math.max(k, q[3]+1);
        k=Math.min(k, 39); placed.push([x,z,r,k]);
        m.P("concrete", planeGeo(w,h,0.5), x, 0.226+k*0.0008, z, ry, c, -Math.PI/2, 0);
      };
      for(let i=0;i<24;i++){                       // sand drifting back across it
        const a2=r2()*6.283, rr=r2()*(D.r-3);
        dec(6.0+r2()*8.0, 1.4+r2()*2.0, rr, a2, 0.42+(r2()-0.5)*0.3, "#9b9077");
      }
      for(let i=0;i<16;i++){                       // whole areas gone lighter
        const a2=r2()*6.283, rr=r2()*(D.r-5);
        dec(4.0+r2()*7.0, 3.0+r2()*5.0, rr, a2, r2()*6.283, "#958b74");
      }
      for(let i=0;i<14;i++){                       // and darker
        const a2=r2()*6.283, rr=r2()*(D.r-5);
        dec(3.0+r2()*6.0, 2.4+r2()*4.0, rr, a2, r2()*6.283, "#7d7462");
      }
      for(let i=0;i<34;i++){                       // cracks
        const a2=r2()*6.283, rr=2+r2()*(D.r-4);
        dec(0.09+r2()*0.09, 3.0+r2()*6.0, rr, a2, r2()*6.283, "#5a5346");
      }
      for(let i=0;i<12;i++){                       // grime where things stood
        const a2=r2()*6.283, rr=r2()*(D.r-7);
        dec(1.2+r2()*2.6, 1.0+r2()*2.2, rr, a2, r2()*6.283, "#544e42");
      }
    }

    // ---- the plinth and the lattice pedestal ---------------------------
    const PY=0.22;
    m.C("concrete", 4.6,5.0,1.30,24, 0, PY+0.65, 0, "#a49c8c");
    m.P("concrete", new T.TorusGeometry(4.62,0.10,6,28), 0, PY+1.30, 0, 0, "#b0a898",
        Math.PI/2, 0);
    m.col(-4.8,4.8, -4.8,4.8, 0, PY+1.30);
    const TH=7.2;                                  // the tower
    // The legs stand on the corners the bracing spans between — put them on a
    // smaller radius than the frame and the frame has nothing to brace, which
    // is what turned this into a zigzag ladder rather than a pedestal.
    for(const c of [[-1,-1],[1,-1],[-1,1],[1,1]])
      strut([c[0]*2.05, PY+1.30, c[1]*2.05],
            [c[0]*1.40, PY+1.30+TH, c[1]*1.40], 0.19);
    for(let k=0;k<6;k++){                          // its bracing
      const y=PY+1.60+k*1.16, w=2.05-k*0.13;
      for(const sd of [0,1]){
        m.B("metal", sd?0.10:w*2, 0.10, sd?w*2:0.10, 0, y, sd? 0:  w, 0.4,0, STEEL);
        m.B("metal", sd?0.10:w*2, 0.10, sd?w*2:0.10, sd? w:0, y, sd? 0: -w, 0.4,0, STEEL);
      }
      if(k<5){                                     // a diagonal on each face
        const w2=2.05-(k+1)*0.13, y2=y+1.16;
        for(const f of [[1,0],[0,1],[-1,0],[0,-1]]){
          const px0=f[0]? f[0]*w : -w, pz0=f[1]? f[1]*w :  w;
          const px1=f[0]? f[0]*w2:  w2, pz1=f[1]? f[1]*w2: -w2;
          strut([px0,y,pz0], [px1,y2,pz1], 0.07);
        }
      }
    }
    const HUB=PY+1.30+TH;                          // the elevation axis
    m.C("metal", 1.30,1.30,1.00,20, 0, HUB-0.30, 0, DARK, 0, 0, 0);
    m.col(-2.4,2.4, -2.4,2.4, 0, HUB);

    // ---- the yoke, and the dish hung in it -----------------------------
    const RD=6.6, DEPTH=1.55;                      // radius, and how deep the bowl is
    const yk=(q)=>{ const [px,pz]=A(q*1.55, 0);
      m.B("metal", 0.34, 2.10, 0.50, px, HUB+0.85, pz, 0.4, AZ, STEEL); };
    yk(-1); yk(1);
    for(const q of [-1,1]){                        // the trunnions
      const [px,pz]=A(q*1.55, 0);
      m.C("metal", 0.30,0.30,0.44,12, px, HUB+1.90, pz, DARK, 0, 0, Math.PI/2);
    }
    // the reflector: radial ribs with panels between them, so it reads as a
    // built dish and not a saucer
    const cE=Math.cos(EL), sE=Math.sin(EL);
    const FACE=(r,a)=>{                            // a point on the bowl
      const dx=Math.cos(a)*r, dy=Math.sin(a)*r, dep=(r*r)/(4*3.4)-DEPTH*0.28;
      // tilt about the elevation axis, then swing to azimuth
      const yy=dy*sE + dep*cE, zz=-dy*cE + dep*sE;
      const [px,pz]=A(dx, zz);
      return [px, HUB+1.90+yy, pz];
    };
    for(let i=0;i<24;i++){                         // the ribs
      const a=(i/24)*Math.PI*2;
      for(let k=0;k<5;k++) strut(FACE(RD*(k/5),a), FACE(RD*((k+1)/5),a), 0.09);
    }
    for(let i=0;i<24;i++) for(let k=1;k<=5;k++){   // and the skin, panel by panel
      const a0=(i/24)*Math.PI*2, a1=((i+1)/24)*Math.PI*2;
      const r0=RD*((k-1)/5), r1=RD*(k/5);
      // Panels come off in patches where a rib let go, not one here and one
      // there: a whole sector is stripped, plus a scatter elsewhere.
      if(i>=7 && i<=10 && k>=3) continue;
      if((i*5+k)%17===4 || (i*7+k*3)%29===11) continue;
      const p=[FACE(r0,a0),FACE(r1,a0),FACE(r1,a1),FACE(r0,a1)];
      const g=new T.BufferGeometry();
      // both windings: the bucket material is single-sided, and a dish seen
      // from behind should show the back of its panels, not straight through
      g.setAttribute("position", new T.Float32BufferAttribute(
        [].concat(p[0],p[1],p[2], p[0],p[2],p[3],
                  p[2],p[1],p[0], p[3],p[2],p[0]), 3));
      g.setAttribute("uv", new T.Float32BufferAttribute(
        [0,0,1,0,1,1, 0,0,1,1,0,1, 1,1,1,0,0,0, 0,1,1,1,0,0],2));
      g.computeVertexNormals();
      // FACE() is in the station's own frame, so the panel has to be offset
      // like everything m.* places, or the skin ends up at the world origin
      // Aluminium that has sat thirty years is not one colour. A third of
      // the skin has gone chalky and a few panels have rusted at the fixings.
      const PC=["#9aa09a","#93998f","#8b8f88","#a29f91","#7d766a","#8a6a4e","#7a5a3f"];
      push("metal", g, D.x, m.y, D.z, 0, PC[(i*3+k*5)%7]);
    }
    for(let k=0;k<4;k++){                          // hoops round the back
      const rr=RD*(0.35+k*0.21);
      for(let i=0;i<24;i++)
        strut(FACE(rr,(i/24)*Math.PI*2), FACE(rr,((i+1)/24)*Math.PI*2), 0.07);
    }
    {                                              // the feed, on its tripod
      const foc=(3.4*0.98);
      const dep=(0)/(4*3.4)-DEPTH*0.28+foc;
      const yy=dep*cE, zz=dep*sE;
      const [fx,fz]=A(0, zz);
      const FY2=HUB+1.90+yy;
      m.C("metal", 0.30,0.22,0.90,14, fx, FY2, fz, "#b8b2a2",
          -(Math.PI/2-EL), AZ, 0);
      for(let i=0;i<3;i++)
        strut(FACE(RD*0.92, i*2.094+0.4), [fx,FY2,fz], 0.075);
    }
    for(let i=0;i<14;i++){                         // rust weeping down the legs
      const c=[[-1,-1],[1,-1],[-1,1],[1,1]][i%4], t=(i%4===0?0.2:0.1)+((i*7)%5)*0.16;
      m.P("rust", streakGeo(0.17+((i*5)%3)*0.07, 0.9+((i*3)%4)*0.7, 0),
          c[0]*(2.05-t*0.65)+c[0]*0.12, PY+1.30+t*TH+0.6, c[1]*(2.05-t*0.65),
          (i%2)?0:Math.PI/2, "#7c4526", 0, 0);
    }
    for(let i=0;i<5;i++)                           // and staining the plinth
      m.P("rust", streakGeo(0.9+((i*5)%3)*0.4, 0.8, 0), Math.cos(i*1.31)*4.66, PY+0.70,
          Math.sin(i*1.31)*4.66, Math.atan2(Math.cos(i*1.31), Math.sin(i*1.31)),
          "#6a3a20", 0, 0);
    {                                              // the counterweight boom
      const dep=-DEPTH*0.28-2.9;
      const yy=dep*cE, zz=dep*sE;
      const [bx2,bz2]=A(0, zz);
      strut([0,HUB+1.90,0], [bx2,HUB+1.90+yy,bz2], 0.24);
      m.B("metal", 1.10, 0.70, 1.10, bx2, HUB+1.90+yy, bz2, 0.4, AZ, DARK);
    }

    /* ---- the control room, which you can walk into -------------------- */
    (function(){
      const OX=13.5, OZ=6.0, W2=9.4, DP=5.2, WT=0.20, RH=2.95, FL=0.30;
      const X0=OX-W2/2, X1=OX+W2/2, Z0=OZ-DP/2, Z1=OZ+DP/2;
      const DOOR=[OX-0.55, OX+0.55];
      const hol=(a0,a1,hs)=>{ const out=[]; let c=a0;
        for(const h of hs){ if(h[0]>c) out.push([c,h[0]]); c=Math.max(c,h[1]); }
        if(c<a1) out.push([c,a1]); return out; };
      m.B("concrete", W2+0.9, FL, DP+0.9, OX, FL/2+0.22, OZ, 0.5, 0, "#a49c8c");
      m.flat(X0-0.45, X1+0.45, Z0-0.45, Z1+0.45, 0.22+FL);
      const F2=0.22+FL;
      const WC="#9c9686", WC2="#948e7e";          // sun-bleached, not painted
      // The front wall has three holes in it, not one: a window is an
      // opening with a sill under it and a header over it, and a frame hung
      // on solid wall is a picture frame. Sill 1.02, head 2.12.
      const WIN=[[OX-3.95, OX-2.25],[OX+2.25, OX+3.95]];
      const HOLES=[WIN[0], DOOR, WIN[1]];
      for(const g of hol(X0,X1,HOLES))             // the full-height piers
        m.B("siding", g[1]-g[0], RH, WT, (g[0]+g[1])/2, F2+RH/2, Z0, 0.45,0, WC);
      m.B("siding", DOOR[1]-DOOR[0], RH-2.10, WT, OX, F2+2.10+(RH-2.10)/2, Z0, 0.45,0, WC);
      for(const w of WIN){                         // sill below, header above
        m.B("siding", w[1]-w[0], 1.02, WT, (w[0]+w[1])/2, F2+0.51, Z0, 0.45,0, WC);
        m.B("siding", w[1]-w[0], RH-2.12, WT, (w[0]+w[1])/2, F2+2.12+(RH-2.12)/2, Z0,
            0.45,0, WC);
      }
      m.B("siding", W2, RH, WT, OX, F2+RH/2, Z1, 0.45,0, WC2);
      for(const sx of [X0,X1]) m.B("siding", WT, RH, DP, sx, F2+RH/2, OZ, 0.45,0, WC2);
      m.B("roof", W2+0.5, 0.16, DP+0.5, OX, F2+RH+0.08, OZ, 0.35,0, "#8d9490");
      m.B("ceil", W2-WT, 0.08, DP-WT, OX, F2+RH-0.06, OZ, 0.5,0, "#cdc5ae");
      m.B("lino", W2-WT, 0.03, DP-WT, OX, F2+0.015, OZ, 0.7,0, "#7e7a6e");
      m.col(X0, X1, Z1-WT, Z1, 0, F2+RH);
      for(const sx of [[X0,X0+WT],[X1-WT,X1]]) m.col(sx[0],sx[1], Z0,Z1, 0, F2+RH);
      for(const g of hol(X0,X1,[DOOR])) m.col(g[0],g[1], Z0,Z0+WT, 0, F2+RH);
      // two windows in the front, both gone
      for(const wx of [OX-3.1, OX+3.1]){         // the frames, in the openings
        m.B("teal", 1.70, 0.10, WT+0.10, wx, F2+2.12, Z0, 0,0, "#5f6b66");
        m.B("teal", 1.70, 0.10, WT+0.10, wx, F2+1.02, Z0, 0,0, "#5f6b66");
        for(const q of [-1,1]) m.B("teal", 0.10, 1.10, WT+0.10, wx+q*0.85, F2+1.57, Z0,
                                   0,0, "#5f6b66");
        for(let i=0;i<4;i++)                       // the glass that is left
          m.P("glass", planeGeo(0.30+((i*5)%3)*0.14, 0.26, 0), wx-0.6+i*0.4,
              F2+1.96-((i*7)%3)*0.10, Z0+0.02, 0, "#8a9088", 0, ((i*3)%5-2)*0.2);
      }
      makeDoor(XF(D.x+DOOR[0]+0.02, D.z+Z0+0.04, 0), 0, m.y+F2+0.02, 0,
               "THE CONTROL ROOM", true, 0.85, "booth");
      // Decades of nothing. A dirt line where the rain splashes back off the
      // apron, rust running out from under the roof edge, and blown sand
      // banked against the windward wall. The soot and rust buckets are
      // sixteen and thirty per cent overlays — a wash that thin does not
      // age a wall on its own, so the streaks hang from under the eave where
      // the run actually starts, and the walls are a grubbier colour to
      // begin with. Both buckets are DoubleSide, so which way they face
      // does not matter; clearing the wall box does — WT/2 is inside it.
      const OFF=WT/2+0.02;
      const streak=(x,y,z,w,h,ry)=>m.P("rust", streakGeo(w, h, 0), x, y-h/2, z, ry,
                                       "#7c4526", 0, 0);
      for(const wl of [[Z0,-OFF],[Z1,OFF]]){
        m.P("soot", planeGeo(W2-0.3, 0.60, 0), OX, F2+0.30, wl[0]+wl[1], 0, "#6d6455", 0, 0);
        for(let i=0;i<9;i++)
          streak(X0+0.55+i*1.04, F2+RH-0.06, wl[0]+wl[1],
                 0.20+((i*7)%4)*0.13, 0.55+((i*5)%5)*0.52, 0);
      }
      for(const sx of [[X0,-OFF],[X1,OFF]]){
        m.P("soot", planeGeo(DP-0.3, 0.60, 0), sx[0]+sx[1], F2+0.30, OZ, Math.PI/2,
            "#6d6455", 0, 0);
        for(let i=0;i<5;i++)
          streak(sx[0]+sx[1], F2+RH-0.06, Z0+0.7+i*0.95,
                 0.18+((i*3)%3)*0.12, 0.50+((i*7)%4)*0.60, Math.PI/2);
      }
      for(let i=0;i<7;i++){                        // sand banked up the west end
        // A half-buried sphere reads as a ball, so squash it to a drift
        const g=blobGeo(0.62+((i*5)%3)*0.26); g.scale(1.5, 0.22, 1.0);
        m.P("sand", g, X0-0.22+((i*3)%3)*0.16, 0.235, Z0+0.5+i*0.60, i*0.9, "#b09b79", 0, 0);
      }
      // racks down the back wall, and the console facing the window
      for(let k=0;k<5;k++){
        const rx=X0+1.1+k*1.55;
        m.B("weathered", 1.20, 1.95, 0.62, rx, F2+0.98, Z1-0.42, 0.45,0,
            (k%2)?"#5e6a66":"#54605c");
        for(let i=0;i<7;i++)                       // blank panels and dead lamps
          m.B("bin", 1.02, 0.18, 0.04, rx, F2+0.36+i*0.24, Z1-0.72, 0,0, "#2b2f2e");
        if(k!==2) for(let i=0;i<5;i++)
          m.C("ember", 0.018,0.018,0.02,6, rx-0.40+i*0.20, F2+1.62, Z1-0.735,
              (k*i)%3 ? "#3a2a1e" : "#ff6a2a", Math.PI/2, 0, 0);
        m.col(rx-0.62, rx+0.62, Z1-0.74, Z1-0.10, 0, F2+1.95);
      }
      // The console runs along the front wall under the west window, NOT
      // across the middle of it: centred on OX it put a collider a metre
      // inside the doorway and you could not get through the door.
      const CX=X0+2.05;
      m.B("weathered", 3.40, 0.86, 0.80, CX, F2+0.43, Z0+1.35, 0.45,0, "#5a5f5a");
      m.B("bin", 3.30, 0.10, 0.72, CX, F2+0.90, Z0+1.35, 0.5,0, "#33383a");
      for(let i=0;i<14;i++)                        // the switches on it
        m.C("paint", 0.022,0.022,0.045,6, CX-1.50+i*0.22, F2+0.95, Z0+1.18,
            (i%3)?"#c9c4b4":"#b8331f", 0, 0, 0);
      m.col(CX-1.70, CX+1.70, Z0+0.95, Z0+1.75, 0, F2+0.95);
      m.P("metal", boxGeo(0.52,0.06,0.52,0.4), CX+0.5, F2+0.54, Z0+2.15, 0.6, DARK, 0, 0);
      m.C("metal", 0.05,0.05,0.48,8, CX+0.5, F2+0.28, Z0+2.15, DARK);
      m.C("metal", 0.26,0.26,0.05,10, CX+0.5, F2+0.04, Z0+2.15, DARK);
      /* ---- what makes it a control room and not an office ------------
         A station that talked to something a long way off needed four
         things in the room with it: a way to see the signal, a way to keep
         it, a way to write it down, and a way to route it. So: scopes on
         the console, tape on the racks, a chart recorder inking a trace
         nobody came back for, and a patch field with the cords still in. */
      const GRN="#1d2b26", CASE="#4a5450";
      /* One screen is still alive. Not blinking, not flickering — breathing:
         a phosphor screen with a slow sweep on it swells and fades over
         about eleven seconds, which is long enough that you notice it only
         after you have been standing in the room a while. That is the whole
         effect, and it is worth more than anything else in here. */
      {
        // On its own bench against the west wall, facing the room. Centred on
        // the console it stood square in the doorway.
        const mx=X0+0.62, mz=OZ+0.30;
        m.B("weathered", 0.52, 0.06, 1.10, mx+0.16, F2+0.78, mz, 0.5,0, "#6a6558");
        for(const q of [[-1,-1],[1,-1],[-1,1],[1,1]])
          m.C("metal", 0.022,0.022,0.78,6, mx+0.16+q[0]*0.20, F2+0.39, mz+q[1]*0.48, DARK);
        m.col(mx-0.12, mx+0.46, mz-0.58, mz+0.58, 0, F2+0.82);
        m.B("weathered", 0.56, 0.52, 0.62, mx+0.18, F2+1.07, mz, 0.5,0, CASE);
        // The tube faces INTO the room, which is +X: a plane's normal is +Z and
        // Ry(-PI/2) swings that to -X, so the first cut had the screen and
        // its glow pointed at the wall it was standing against.
        m.B("bin", 0.04, 0.40, 0.50, mx+0.48, F2+1.10, mz, 0,0, "#101a15");
        const scr=new T.Mesh(new T.PlaneGeometry(0.44,0.34),
          new T.MeshBasicMaterial({color:0x3df08a, transparent:true, opacity:0.20,
            depthWrite:false, blending:T.AdditiveBlending, fog:false, toneMapped:false}));
        scr.position.set(D.x+mx+0.515, m.y+F2+1.10, D.z+mz);
        scr.rotation.y=Math.PI/2; scene.add(scr);
        const hal=new T.Mesh(new T.PlaneGeometry(1.6,1.3),
          new T.MeshBasicMaterial({map:GLOW_TEX, color:0x2fe07a, transparent:true,
            opacity:0.10, depthWrite:false, blending:T.AdditiveBlending, fog:false,
            toneMapped:false}));
        hal.position.set(D.x+mx+0.60, m.y+F2+1.10, D.z+mz);
        hal.rotation.y=Math.PI/2; scene.add(hal);
        LAMPS.push({x:D.x+mx+1.20, y:m.y+F2+1.16, z:D.z+mz, color:0x46ff96,
                    intensity:0.17, dist:4.6, decay:1.5, indoor:true, slow:true});
        SLOW_GREEN={scr:scr, hal:hal};
        for(let k=0;k<9;k++)                     // the trace it is still drawing
          m.C("ember", 0.008,0.008,0.03,4, mx+0.495, F2+1.10+Math.sin(k*1.4)*0.075,
              mz-0.17+k*0.042, "#49d98a", 0, 0, Math.PI/2);
      }
      for(let i=0;i<2;i++){                      // two scopes on the console
        const sx2=CX-0.95+i*1.30;
        m.B("weathered", 0.56, 0.48, 0.46, sx2, F2+1.19, Z0+1.45, 0.5,0, CASE);
        m.B("bin", 0.42, 0.34, 0.03, sx2, F2+1.23, Z0+1.21, 0,0, GRN);
        // the trace: a green line still on a tube with nothing feeding it
        for(let k=0;k<11;k++)
          m.C("ember", 0.008,0.008,0.035,4, sx2-0.16+k*0.032,
              F2+1.23+Math.sin(k*0.9+i)*0.055, Z0+1.19, "#49d98a", Math.PI/2, 0, 0);
        for(const q of [-1,1])                   // the two knobs under it
          m.C("bin", 0.035,0.035,0.03,10, sx2+q*0.17, F2+1.02, Z0+1.21,
              "#20242a", Math.PI/2, 0, 0);
      }
      for(let i=0;i<6;i++)                       // meters across the console face
        m.C("glass", 0.055,0.055,0.02,12, CX-1.35+i*0.54, F2+0.62, Z0+0.96,
            (i%3)?"#c8cfc6":"#9aa8a0", Math.PI/2, 0, 0);
      // tape transports in two of the racks — the one thing that says this
      // room was recording something rather than running something
      for(const k of [1,3]){
        const rx=X0+1.1+k*1.55;
        m.B("bin", 1.02, 0.66, 0.05, rx, F2+1.28, Z1-0.735, 0,0, "#20262a");
        for(const q of [-1,1]){
          m.C("metal", 0.20,0.20,0.035,20, rx+q*0.26, F2+1.36, Z1-0.765,
              "#8d958f", Math.PI/2, 0, 0);
          m.C("bin", 0.205,0.205,0.02,20, rx+q*0.26, F2+1.36, Z1-0.778,
              "#2a2f2c", Math.PI/2, 0, 0);       // the tape wound on it
          m.C("paint", 0.035,0.035,0.05,10, rx+q*0.26, F2+1.36, Z1-0.795,
              "#b8b2a2", Math.PI/2, 0, 0);       // the hub
        }
        m.B("metal", 0.17, 0.15, 0.05, rx, F2+1.19, Z1-0.775, 0,0, "#9aa29c");
        for(let i=0;i<4;i++)                     // transport buttons
          m.C("paint", 0.020,0.020,0.03,8, rx-0.30+i*0.20, F2+1.03, Z1-0.775,
              i===3?"#b8331f":"#cfc9b8", Math.PI/2, 0, 0);
      }
      {                                          // the patch field, cords still in
        const rx=X0+1.1+4*1.55;
        m.B("bin", 1.02, 0.60, 0.04, rx, F2+1.30, Z1-0.735, 0,0, "#262b2c");
        for(let r2=0;r2<4;r2++) for(let c2=0;c2<12;c2++)
          m.C("bin", 0.012,0.012,0.02,6, rx-0.44+c2*0.08, F2+1.10+r2*0.13, Z1-0.755,
              "#12161a", Math.PI/2, 0, 0);
        for(let i=0;i<5;i++){                    // and five cords looping out
          const jx=rx-0.36+i*0.17, jy=F2+1.10+(i%3)*0.13;
          for(let k=0;k<5;k++){                  // a slack loop, drawn in links
            const f=k/4;
            m.C("bin", 0.010,0.010,0.10,5, jx+f*0.13,
                jy-Math.sin(f*Math.PI)*0.20-f*0.06, Z1-0.80-f*0.02,
                ["#8a3320","#2f5f8a","#7a6a22","#2f7a52","#5a2f7a"][i],
                Math.PI/2-f*1.1, 0, 0);
          }
        }
      }
      {                                          // the chart recorder, east end
        const tx=X1-1.45, tz=Z0+1.15;
        m.B("weathered", 1.30, 0.06, 0.66, tx, F2+0.74, tz, 0.5,0, "#6a6558");
        for(const q of [[-1,-1],[1,-1],[-1,1],[1,1]])
          m.C("metal", 0.025,0.025,0.74,6, tx+q[0]*0.58, F2+0.37, tz+q[1]*0.27, DARK);
        m.col(tx-0.66, tx+0.66, tz-0.36, tz+0.36, 0, F2+0.78);
        m.B("weathered", 0.86, 0.34, 0.50, tx, F2+0.94, tz, 0.5,0, CASE);
        m.C("metal", 0.13,0.13,0.62,16, tx, F2+1.12, tz, "#b4ab96", 0, 0, Math.PI/2);
        // m.B takes ten arguments and stops; a rotation handed to it as an
        // eleventh is silently dropped, so anything that tilts goes via m.P
        m.P("metal", boxGeo(0.42,0.02,0.03,0), tx+0.16, F2+1.21, tz-0.13, 0,
            "#9aa29c", 0, -0.22);                // the pen arm, still down
        m.C("paint", 0.014,0.014,0.05,6, tx+0.36, F2+1.18, tz-0.13, "#b8331f", 0, 0, 0);
        // the trace it was drawing, run off the drum and onto the floor
        m.P("paper", planeGeo(0.30, 0.92, 0), tx+0.02, F2+0.70, tz-0.34, 0,
            "#e2dcc8", -0.42, 0);
        for(let i=0;i<7;i++)
          m.P("paper", planeGeo(0.30, 0.34, 0), tx+0.02+((i*3)%3-1)*0.06, F2+0.010+i*0.001,
              tz-0.78-i*0.26, ((i*5)%5-2)*0.07, "#e2dcc8", -Math.PI/2, 0);
      }
      {                                          // three clocks over the door
        // On the INNER face of the front wall, so the face and hands stand
        // proud towards the room (+z), not sunk back into the wall.
        const cz=Z0+0.115;
        for(let i=0;i<3;i++){
          const kx=OX-0.86+i*0.86, hr=[0.9,-2.1,2.6][i];
          m.C("bin", 0.135,0.135,0.045,16, kx, F2+2.46, cz, "#20252a", Math.PI/2, 0, 0);
          m.C("plaster", 0.112,0.112,0.02,16, kx, F2+2.46, cz+0.028, "#ddd7c4",
              Math.PI/2, 0, 0);
          m.P("bin", boxGeo(0.011,0.075,0.008,0), kx+Math.sin(hr)*0.030,
              F2+2.46+Math.cos(hr)*0.030, cz+0.042, 0, "#20252a", 0, -hr);
          m.P("bin", boxGeo(0.009,0.105,0.008,0), kx+Math.sin(hr*2.3)*0.046,
              F2+2.46+Math.cos(hr*2.3)*0.046, cz+0.042, 0, "#20252a", 0, -hr*2.3);
          m.B("paint", 0.20, 0.035, 0.012, kx, F2+2.26, cz+0.02, 0,0, "#b8b2a2");
        }
      }
      // the pass board, and the poster somebody hung crooked and never
      // straightened — both on the east wall, which is the only clear one
      // Clear of the wall box, not inside it: the east wall is a box centred
      // on X1 and WT thick, so anything at X1 minus half of that is buried.
      const EW=X1-WT/2-0.02;
      m.P("pic:passboard", planeGeo(1.50, 1.00, 0), EW, F2+1.86, OZ+0.85,
          -Math.PI/2, "#ffffff", 0, 0);
      m.P("pic:believe", planeGeo(0.78, 1.09, 0), EW-0.004, F2+1.62, OZ-1.05,
          -Math.PI/2, "#ffffff", 0, 0.085);
      for(const q of [[-1,1],[1,1],[-1,-1],[1,-1]])  // the tape at its corners
        m.P("paper", planeGeo(0.07, 0.05, 0), EW-0.012,
            F2+1.62+q[1]*0.53-q[0]*0.033, OZ-1.05+q[0]*0.38, -Math.PI/2,
            "#d8cfae", 0, 0.085);
      // A cable tray is one continuous run on hangers, not a row of separate
      // plates — spaced out they read as objects hanging in mid-air.
      {
        const ty=F2+RH-0.17, tz=Z1-1.00;
        m.B("metal", W2-1.2, 0.035, 0.30, OX, ty, tz, 0.4,0, "#77807b");
        for(const q of [-1,1])                   // its turned-up edges
          m.B("metal", W2-1.2, 0.09, 0.03, OX, ty+0.05, tz+q*0.155, 0.4,0, "#6b736e");
        for(let i=0;i<7;i++)                     // hangers up to the ceiling
          m.C("metal", 0.012,0.012,0.13,5, X0+0.9+i*1.27, ty+0.10, tz, "#6b736e");
        // One run each from the tray down into the top of the racks. Two
        // stubs at guessed angles leave gaps and read as dashes in mid-air,
        // so each drop is aimed: rx = acos(dy/len) for a +Y cylinder.
        const ry2=F2+1.95, rz2=Z1-0.72;
        for(let i=0;i<7;i++){
          const dx=X0+1.1+i*1.25, dy=ry2-ty, dz=rz2-tz;
          const L=Math.hypot(dy,dz);
          m.C("bin", 0.030,0.030, L, 6, dx, (ty+ry2)/2, (tz+rz2)/2, "#1c2024",
              Math.acos(dy/L), 0, 0);
        }
      }
      // paper, everywhere, and a mug nobody took home
      for(let i=0;i<26;i++)
        m.P("paper", planeGeo(0.18+((i*5)%3)*0.06, 0.24+((i*7)%3)*0.05, 0),
            X0+0.5+((i*1.93)%(W2-1.0)), F2+0.012+i*0.0012, Z0+0.5+((i*1.31)%(DP-1.0)),
            i*1.3, "#d8d2be", -Math.PI/2, 0);
      m.C("plaster", 0.045,0.040,0.09,12, CX-0.8, F2+0.94, Z0+1.12, "#dcd6c4");
      LAMPS.push({x:D.x+OX, y:m.y+F2+2.70, z:D.z+OZ, color:0xeadfc4, intensity:0.22,
                  dist:7.5, decay:1.8, indoor:true, flicker:true});
      // a batten, not a bollard — a fat 8-sided cylinder on end reads as a
      // lump hanging out of the ceiling whatever it is meant to be
      m.B("metal", 1.30, 0.07, 0.22, OX, F2+2.88, OZ, 0.4,0, "#8d9490");
      m.B("ceilfix", 1.22, 0.09, 0.15, OX, F2+2.82, OZ, 0.4,0, "#e8e2cf");
      for(const q of [-1,1])
        m.C("metal", 0.010,0.010,0.10,5, OX+q*0.56, F2+2.90, OZ, "#8d9490");
      addZone(D.x+X0, D.x+X1, D.z+Z0, D.z+Z1, m.y+F2-0.4, m.y+F2+RH,
              "THE CONTROL ROOM", true);
    })();

    /* ---- the plant hut, shut, and the cable run to the mount ---------- */
    m.B("siding", 4.2, 2.45, 3.4, -13.0, 0.22+1.22, 8.0, 0.45,0, "#a8a294");
    m.B("roof", 4.6, 0.14, 3.8, -13.0, 0.22+2.51, 8.0, 0.35,0, "#8d9490");
    m.B("teal", 1.02, 2.05, 0.10, -13.0, 0.22+1.02, 8.0-1.72, 0,0, "#4e5a56");
    m.P("rust", streakGeo(1.60, 1.90, 0), -13.0, 0.22+1.10, 8.0-1.76, 0, "#6a3a20");
    m.P("soot", planeGeo(4.0, 0.46, 0), -13.0, 0.22+0.23, 8.0-1.78, 0, "#6d6455", 0, 0);
    for(let i=0;i<4;i++)
      m.P("rust", streakGeo(0.22, 0.80+((i*5)%3)*0.4, 0), -14.4+i*0.95, 0.22+1.95,
          8.0-1.78, 0, "#7c4526", 0, 0);
    m.col(-15.2,-10.8, 6.2,9.8, 0, 0.22+2.45);
    for(let i=0;i<3;i++)                           // vents in its flank
      m.B("bin", 0.06, 0.46, 0.80, -10.9, 0.22+1.40, 7.0+i*1.0, 0,0, "#3a423f");
    for(let i=0;i<22;i++){                         // the cable duct, half buried
      const t=i/21, px=lerp(-11.0, -4.4, t), pz=lerp(8.0, 1.2, t);
      m.B("concrete", 0.62, 0.22, 0.62, px, 0.30, pz, 0.5, 0.6, "#9c9484");
      if(i%4===0) m.B("concrete", 0.80, 0.09, 0.80, px, 0.44, pz, 0.5, 0.6, "#a8a090");
    }
    // a truck that was here when it shut, and the drums nobody took
    for(let i=0;i<5;i++)
      m.C("metal", 0.30,0.30,0.88,14, 18.0+((i*5)%3)*0.75, 0.66, -3.0+i*0.8,
          i%2 ? RUSTD : "#5e6a56");
    m.col(17.4, 20.2, -3.6, 1.2, 0, 1.1);
    for(let i=0;i<9;i++)                           // tyre tracks, still there
      m.P("soot", planeGeo(0.42, 9.0+((i*5)%3)*3.0, 0), -20.0+i*5.0, 0.234,
          -18.0-((i*7)%4)*2.0, ((i*3)%5-2)*0.06, "#8a7a5e", -Math.PI/2, 0);
    /* ---- the things a dish has that a bowl on a stick does not ------- */
    {
      // a cable loom off the feed, down a rib and into the hub, hanging
      const fpt=FACE(RD*0.10, 0.0);
      let prev=[fpt[0], fpt[1]+0.30, fpt[2]];
      for(let i=1;i<=7;i++){
        const t=i/7;
        const nxt=[lerp(fpt[0],0,t), lerp(fpt[1]+0.30, HUB+1.60, t)-Math.sin(t*Math.PI)*0.85,
                   lerp(fpt[2],0,t)];
        strut(prev, nxt, 0.045, "#2a2b28"); prev=nxt;
      }
      // the ladder up the pedestal, and the little service platform on top
      for(const q of [-1,1]) strut([q*0.22, PY+1.40, 2.00],[q*0.22, PY+1.30+TH, 1.42], 0.035);
      for(let i=0;i<11;i++){
        const t=i/10, y2=PY+1.45+t*(TH-0.30);
        strut([-0.22, y2, lerp(2.00,1.42,t)], [0.22, y2, lerp(2.00,1.42,t)], 0.024);
      }
      m.P("metal", boxGeo(1.70,0.05,1.10,0.5), 0, HUB-0.86, 1.30, 0, "#79807b", 0, 0);
      for(let i=0;i<7;i++)                          // its handrail
        m.C("metal", 0.022,0.022,0.86,6, -0.75+i*0.25, HUB-0.44, 1.82, "#79807b");
      m.C("metal", 0.026,0.026,1.70,6, 0, HUB-0.02, 1.82, "#79807b", 0, 0, Math.PI/2);
      // the counterweight is a stack of plates, not one block
      const dep=-DEPTH*0.28-2.9, yy2=dep*cE, zz2=dep*sE;
      const [bx3,bz3]=A(0, zz2);
      for(let i=0;i<5;i++)
        m.B("metal", 1.16, 0.12, 1.16, bx3, HUB+1.90+yy2-0.28+i*0.145, bz3, 0.4, AZ,
            i%2?"#5a615d":"#4e5450");
      // and the azimuth ring the whole mount turns on
      m.P("metal", new T.TorusGeometry(2.55,0.09,6,30), 0, PY+1.36, 0, 0, "#79807b",
          Math.PI/2, 0);
      for(let i=0;i<8;i++){
        const a4=(i/8)*Math.PI*2;
        m.C("metal", 0.10,0.10,0.26,8, Math.cos(a4)*2.55, PY+1.44, Math.sin(a4)*2.55,
            "#6b736e");
      }
    }
    /* ---- what thirty years of nobody looks like ---------------------- */
    for(let i=0;i<6;i++){                          // panels that came down
      const a=1.9+i*0.6, rr=9+((i*7)%4)*2.4;
      const g=new T.BufferGeometry();
      const w2=1.5+((i*5)%3)*0.5, h2=1.1+((i*3)%3)*0.4, lean=0.04+((i*5)%4)*0.03;
      g.setAttribute("position", new T.Float32BufferAttribute(
        [-w2/2,0,-h2/2,  w2/2,lean,-h2/2,  w2/2,0,h2/2,
         -w2/2,0,-h2/2,   w2/2,0, h2/2,   -w2/2,lean*0.4,h2/2], 3));
      g.setAttribute("uv", new T.Float32BufferAttribute([0,0,1,0,1,1, 0,0,1,1,0,1],2));
      g.computeVertexNormals();
      m.P("metal", g, Math.cos(a)*rr, 0.25, Math.sin(a)*rr, a*1.7,
          ["#8a8f88","#7d766a","#8a6a4e"][i%3], 0, 0);
    }
    for(let i=0;i<9;i++){                          // weeds up through the cracks
      const a=i*0.84, rr=6+((i*11)%5)*6.5;
      const px=Math.cos(a)*rr, pz=Math.sin(a)*rr;
      for(let k=0;k<5;k++)
        m.C("foliage", 0.010,0.016,0.30+((i+k)%3)*0.16, 4,
            px+((k*7)%5-2)*0.055, 0.36, pz+((k*3)%5-2)*0.055,
            (i+k)%3 ? "#6d7048" : "#877f4e", ((k*5)%5-2)*0.16, k*1.1, ((k*3)%5-2)*0.13);
    }
    for(let i=0;i<12;i++)                          // the kerb broken up
      m.P("concrete", rockGeo(0.22+((i*7)%3)*0.10, i*13), Math.cos(i*0.9)*(D.r-1.9),
          0.26, Math.sin(i*0.9)*(D.r-1.9), i, "#9a9182", 0, 0);
    m.zone(D.r+6, "THE TRACKING STATION");
  })();
