"use strict";
/* LOW DESERT MOTEL · 14-desert.js
   what is out there, part one: the roadside and the drive-in
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   11b · WHAT IS OUT THERE
   Seven things to walk out and find. They are far enough away to be a
   decision — a hundred and fifty to three hundred and fifty metres, one to
   three minutes on foot — and each one names itself on the HUD when you get
   there, so finding it registers as having found something.
   ---------------------------------------------------------------------- */
  const G=(x,z)=>Terrain.groundAt(x,z);
  // world-space helpers with the ground baked in
  /* The same, turned through 180 degrees and with the ground height given
     rather than taken from the origin — for anything cut INTO a slope, where
     the floor is the terrain at the mouth and not at the middle of the thing.
     Half a turn keeps every AABB an AABB: bounds just negate and swap.    */
  const mkPi=(ox,oz,gy)=>{
    const X=(x,z)=>ox-x, Z=(x,z)=>oz-z;
    return {
      y:gy, ox:ox, oz:oz,
      B:(bk,w,h,d,x,y,z,uv,ry,c)=>bx(bk,w,h,d, X(x,z), gy+y, Z(x,z), uv, (ry||0)+Math.PI, c),
      C:(bk,rt,rb,h,seg,x,y,z,c,rx,ry,rz)=>cyl(bk,rt,rb,h,seg, X(x,z), gy+y, Z(x,z), c,
                                               rx, (ry||0)+Math.PI, rz),
      P:(bk,geo,x,y,z,ry,c,rx,rz)=>push(bk, geo, X(x,z), gy+y, Z(x,z),
                                        (ry||0)+Math.PI, c, rx, rz),
      col:(x0,x1,z0,z1,h0,h1)=>addCol(ox-x1,ox-x0, oz-z1,oz-z0, gy+h0, gy+h1),
      flat:(x0,x1,z0,z1,h)=>addFlat(ox-x1,ox-x0, oz-z1,oz-z0, gy+h),
      voidAt:(x0,x1,z0,z1,h0,h1,f)=>addVoid(ox-x1,ox-x0, oz-z1,oz-z0, gy+h0, gy+h1, gy+f),
      zone:(x0,x1,z0,z1,h0,h1,n,ind)=>addZone(ox-x1,ox-x0, oz-z1,oz-z0, gy+h0, gy+h1, n, ind),
      lamp:(x,y,z,o)=>{ o.x=X(x,z); o.y=gy+y; o.z=Z(x,z); LAMPS.push(o); },
      wx:X, wz:Z
    };
  };
  const mk=(ox,oz)=>{
    const gy=G(ox,oz);
    return {
      y:gy,
      B:(bk,w,h,d,x,y,z,uv,ry,c)=>bx(bk,w,h,d, ox+x, gy+y, oz+z, uv, ry||0, c),
      C:(bk,rt,rb,h,seg,x,y,z,c,rx,ry,rz)=>cyl(bk,rt,rb,h,seg, ox+x, gy+y, oz+z, c, rx,ry,rz),
      P:(bk,geo,x,y,z,ry,c,rx,rz)=>push(bk, geo, ox+x, gy+y, oz+z, ry||0, c, rx, rz),
      col:(x0,x1,z0,z1,h0,h1)=>addCol(ox+x0,ox+x1,oz+z0,oz+z1, gy+h0, gy+h1),
      zone:(r,name)=>addZone(ox-r,ox+r,oz-r,oz+r, gy-4, gy+14, name),
      flat:(x0,x1,z0,z1,h)=>addFlat(ox+x0,ox+x1,oz+z0,oz+z1, gy+h),
      rect:(x0,x1,z0,z1,name)=>addZone(ox+x0,ox+x1,oz+z0,oz+z1, gy-4, gy+18, name),
      // the four mkPi has had all along, so a block with an inside to it can
      // be built either way round
      voidAt:(x0,x1,z0,z1,h0,h1,f)=>addVoid(ox+x0,ox+x1,oz+z0,oz+z1, gy+h0, gy+h1, gy+f),
      lamp:(x,y,z,o)=>{ o.x=ox+x; o.y=gy+y; o.z=oz+z; LAMPS.push(o); },
      wx:(x,z)=>ox+x, wz:(x,z)=>oz+z
    };
  };

/* The three helpers above, and every block below, used to sit inside one
   `desertFinds` IIFE three thousand lines long. The blocks were already
   self-contained IIFEs of their own, so lifting the wrapper off and
   promoting G / mk / mkPi to file scope let the desert be read and
   edited in three pieces instead of one. 14b and 14c carry on from
   here and rely on those three; nothing else crosses between them. */

  /* --- a descanso on the shoulder, for somebody who did not make it ---- */
  (function(){
    const m=mk(-168, ROADZ+9.5);
    m.B("paint", 0.11,1.35,0.11, 0,0.62,0, 0, 0, "#e8e4d6");
    m.B("paint", 0.70,0.11,0.11, 0,1.02,0, 0, 0, "#e8e4d6");
    m.B("paint", 0.13,0.24,0.13, 0,0.06,0, 0, 0, "#cfc7b4");        // the footing
    [[-0.22,0.16,"#b8332a"],[0.20,0.10,"#c9a24b"],[0.02,0.24,"#8a3f6e"],
     [-0.08,0.05,"#3f6ea8"]].forEach(f=>
      m.P("foliage", new T.IcosahedronGeometry(0.09,0), f[0],0.18+f[1],0.10, 0, f[2]));
    m.P("glass", new T.CylinderGeometry(0.07,0.07,0.17,10), 0.26,0.09,0.06, 0, "#b4402a");
    for(let i=0;i<9;i++)                                              // a ring of stones
      m.P("gravel", new T.DodecahedronGeometry(0.09+((i*7)%4)*0.03,0),
          Math.cos(i)*0.55, 0.05, Math.sin(i)*0.55, i, "#8a7a62");
    m.col(-0.1,0.1,-0.1,0.1, 0,1.3);
    m.zone(7, "A CROSS BY THE ROAD");
  })();

  /* --- a pickup nobody came back for ----------------------------------- */
  (function(){
    const m=mk(182, -128), R="#8a5236", D="#5a3a28";
    m.B("weathered", 2.00,0.30,4.30, 0,0.36,0, 0.4, 0.22, D);         // pan, sunk
    m.B("weathered", 1.94,0.50,4.18, 0,0.62,0, 0.4, 0.22, R);
    m.B("weathered", 1.78,0.16,1.24, 0.28,0.84,1.20, 0.4, 0.30, R);   // hood, sprung
    m.B("weathered", 1.80,0.15,1.05, 0,0.98,0.56, 0.4, 0.22, R);
    m.B("weathered", 1.42,0.12,1.06, 0,1.34,0.54, 0.4, 0.22, R);      // cab roof
    m.B("weathered", 0.11,0.40,0.98, -0.70,1.16,0.54, 0.4, 0.22, R);  // cab pillars
    m.B("weathered", 0.11,0.40,0.98,  0.70,1.16,0.54, 0.4, 0.22, R);
    m.B("weathered", 0.13,0.40,2.00, -0.90,1.06,-1.10, 0.4, 0.22, R); // bed sides
    m.B("weathered", 0.13,0.40,2.00,  0.90,1.06,-1.10, 0.4, 0.22, R);
    m.B("weathered", 1.70,0.06,1.90, 0,0.90,-1.10, 0.4, 0.22, D);
    m.B("weathered", 1.90,0.44,0.13, -0.30,0.62,-2.30, 0.4, 0.62, D); // tailgate, dropped
    m.B("weathered", 0.10,0.46,0.62, -1.06,0.96,0.80, 0.4, 0.9, R);   // a door, hanging
    for(const w of [[-0.88,1.40],[0.88,-1.40]])                        // two wheels left
      m.C("tyre", 0.34,0.34,0.28,14, w[0],0.30,w[1], "#17150f", 0,0.22,Math.PI/2);
    m.P("gravel", new T.DodecahedronGeometry(0.5,0), 1.6,0.16,-1.2, 0, "#8a7a62");
    m.col(-1.2,1.2,-2.4,2.4, 0,1.6);
    m.zone(9, "SOMEBODY'S TRUCK");
  })();

  /* --- windmill and a stock tank, still turning ------------------------ */
  (function(){
    const m=mk(-262, 118), ST="#9c9488", TOP=7.2, BW=0.92, TW=0.30;
    const legAt=h=>BW+(TW-BW)*(h/TOP), tilt=Math.atan2(BW-TW, TOP);
    for(const q of [[-1,-1],[1,-1],[-1,1],[1,1]])          // four legs, leaning in
      m.P("weathered", boxGeo(0.11, TOP*1.01, 0.11, 0),
          q[0]*(BW+TW)/2, TOP/2, q[1]*(BW+TW)/2, 0, ST, -q[1]*tilt, q[0]*tilt);
    for(let k=1;k<=4;k++){                                  // girts and cross bracing
      const h=k*1.55, w=legAt(h);
      m.B("weathered", w*2,0.055,0.055, 0,h, w, 0,0, ST);
      m.B("weathered", w*2,0.055,0.055, 0,h,-w, 0,0, ST);
      m.B("weathered", 0.055,0.055,w*2, w,h, 0, 0,0, ST);
      m.B("weathered", 0.055,0.055,w*2,-w,h, 0, 0,0, ST);
      if(k<4){                                              // one diagonal per face
        const w2=legAt(h+1.55), dl=Math.hypot(1.55, w+w2), an=Math.atan2(1.55, w+w2);
        for(const sd of [-1,1]){
          m.P("weathered", boxGeo(dl,0.04,0.04,0), 0, h+0.78, sd*(w+w2)/2, 0, ST, 0,  an);
          m.P("weathered", boxGeo(0.04,0.04,dl,0), sd*(w+w2)/2, h+0.78, 0, 0, ST, -an, 0);
        }
      }
    }
    m.B("weathered", 0.86,0.26,0.74, 0,TOP+0.32,0, 0.5,0, ST);        // the gearbox head
    m.P("weathered", new T.CylinderGeometry(0.09,0.09,0.36,10), 0,TOP+0.32,0.44, 0, ST,
        Math.PI/2, 0);
    for(let i=0;i<18;i++){                                            // the fan wheel
      const a=i*Math.PI/9;
      m.P("weathered", boxGeo(0.26,0.62,0.02,0),
          Math.cos(a)*0.78, TOP+0.32+Math.sin(a)*0.78, 0.58, 0, "#d3ccbe", 0, a+0.52);
    }
    for(const r2 of [0.36,0.78])                                      // the wheel rims
      m.P("weathered", new T.TorusGeometry(r2,0.025,6,22), 0,TOP+0.32,0.58, 0, ST);
    m.B("weathered", 0.05,1.05,1.55, 0,TOP+0.36,-1.25, 0.5,0, "#d3ccbe");   // the vane
    m.B("weathered", 0.05,0.10,1.40, 0,TOP+0.32,-0.72, 0,0, ST);
    m.C("weathered", 1.55,1.55,1.00,20, 3.3,0.50,1.5, "#8d867a");     // stock tank
    m.P("weathered", new T.TorusGeometry(1.55,0.05,6,24), 3.3,1.00,1.5, 0, "#a29a8c",
        Math.PI/2, 0);
    m.C("weathered", 1.44,1.44,0.04,20, 3.3,0.80,1.5, "#44605a");     // the water in it
    m.C("weathered", 0.045,0.045,3.10,8, 1.75,1.34,1.5, ST, 0,0,Math.PI/2);  // the pipe
    m.C("weathered", 0.045,0.045,0.60,8, 3.25,1.10,1.5, ST);
    m.col(-1.0,1.0,-1.0,1.0, 0,7.4);
    m.col(1.7,4.9,-0.1,3.1, 0,1.1);
    m.zone(14, "WINDMILL AND TANK");
  })();

  /* --- the drive-in, dark since 1979 ----------------------------------- */
  (function(){
    // across the highway, on the flattest ground within a quarter mile, with
    // the screen facing back toward the road
    const OX=-173, OZ=-182, m=mk(OX, OZ);   // well back off the highway
    m.B("paint", 26.0,12.0,0.55, 0,6.9,0, 0.30, 0, "#d8d2c4");        // the screen
    m.B("paint", 27.2,0.60,0.90, 0,13.2,0, 0.30, 0, "#b9b2a2");
    m.B("paint", 27.2,0.70,0.90, 0,0.60,0, 0.30, 0, "#b9b2a2");
    for(const bx2 of [-11.5,-5.5,0,5.5,11.5]){                        // the back frame
      m.P("weathered", boxGeo(0.24,13.4,0.24,0), bx2,6.9,-0.62, 0, "#6b6f72");
      m.P("weathered", boxGeo(0.16,0.16,Math.hypot(13.0,4.2),0), bx2,6.5,-2.9, 0, "#6b6f72",
          -Math.atan2(13.0,4.2), 0);
    }
    /* ---- the projection room, which you can let yourself into --------- */
    (function(){
      const PX0=-3.70, PX1=1.70, PZ0=42.00, PZ1=46.00, PT=0.22, PH=3.00, PF=0.10;
      const QX0=PX0+PT, QX1=PX1-PT, QZ0=PZ0+PT, QZ1=PZ1-PT;   // inner faces
      const DOOR=[-0.22,0.80], WALLC="#8e9cb4";
      const runs=(a0,a1,holes)=>{
        const out=[]; let c=a0;
        for(const h of holes){ if(h[0]>c) out.push([c,h[0]]); c=Math.max(c,h[1]); }
        if(c<a1) out.push([c,a1]); return out;
      };
      m.B("concrete", PX1-PX0+0.7, 0.30, PZ1-PZ0+0.7, (PX0+PX1)/2, PF-0.15, (PZ0+PZ1)/2,
          0.45, 0, "#9b948a");
      m.flat(PX0-0.35, PX1+0.35, PZ0-0.35, PZ1+0.35, PF);
      // the wall facing the screen, with two projection ports cut in it
      const PORT=[[-2.45,-1.75],[-1.15,-0.45]], PS=PF+1.62, PHd=PF+2.22;
      for(const g of runs(PX0,PX1,[])) {
        m.B("stucco", g[1]-g[0], PS-PF, PT, (g[0]+g[1])/2, (PF+PS)/2, PZ0+PT/2, 0.3, 0, WALLC);
        m.B("stucco", g[1]-g[0], PF+PH-PHd, PT, (g[0]+g[1])/2, (PHd+PF+PH)/2, PZ0+PT/2,
            0.3, 0, WALLC);
      }
      for(const g of runs(PX0,PX1,PORT))
        m.B("stucco", g[1]-g[0], PHd-PS, PT, (g[0]+g[1])/2, (PS+PHd)/2, PZ0+PT/2, 0.3, 0, WALLC);
      for(const w of PORT){                                    // the glass, filthy
        m.B("glass", w[1]-w[0], PHd-PS, PT*0.5, (w[0]+w[1])/2, (PS+PHd)/2, PZ0+PT/2,
            0, 0, "#93a49f");
        m.B("metal", w[1]-w[0]+0.10, 0.06, 0.06, (w[0]+w[1])/2, PS-0.05, PZ0+0.02, 0,0,"#6b6f72");
      }
      // the back wall, with the door
      for(const g of runs(PX0,PX1,[DOOR]))
        m.B("stucco", g[1]-g[0], PH, PT, (g[0]+g[1])/2, PF+PH/2, PZ1-PT/2, 0.3, 0, WALLC);
      m.B("stucco", DOOR[1]-DOOR[0], PH-2.07, PT, (DOOR[0]+DOOR[1])/2, PF+2.07+(PH-2.07)/2,
          PZ1-PT/2, 0.3, 0, WALLC);
      for(const sx of [PX0+PT/2, PX1-PT/2])                    // the ends
        m.B("stucco", PT, PH, PZ1-PZ0-PT*2, sx, PF+PH/2, (PZ0+PZ1)/2, 0.3, 0, WALLC);
      m.B("roofG", PX1-PX0+0.6, 0.24, PZ1-PZ0+0.6, (PX0+PX1)/2, PF+PH+0.12, (PZ0+PZ1)/2,
          0.3, 0, "#4b7a62");
      m.B("stucco", PX1-PX0+0.7, 0.26, 0.20, (PX0+PX1)/2, PF+PH+0.35, PZ1+0.25, 0.3,0,"#7c8a9e");
      // colliders: everything but the doorway
      m.col(PX0, PX1, PZ0, PZ0+PT, 0, PF+PH);
      m.col(PX0, PX0+PT, PZ0, PZ1, 0, PF+PH);
      m.col(PX1-PT, PX1, PZ0, PZ1, 0, PF+PH);
      for(const g of runs(PX0,PX1,[DOOR])) m.col(g[0], g[1], PZ1-PT, PZ1, 0, PF+PH);
      // a step up to the door and a rail
      m.B("concrete", 1.70, 0.24, 1.00, (DOOR[0]+DOOR[1])/2, PF-0.13, PZ1+0.48, 0.45,0,"#a8a094");
      m.flat(DOOR[0]-0.8, DOOR[1]+0.8, PZ1, PZ1+0.95, PF-0.02);
      makeDoor(XF(OX+DOOR[1]-0.02, OZ+PZ1-0.03, Math.PI), 0, m.y+PF+0.02, 0,
               "PROJECTION ROOM", true, 0, "booth");

      /* ---- inside ---------------------------------------------------- */
      m.B("concrete", QX1-QX0, 0.05, QZ1-QZ0, (QX0+QX1)/2, PF-0.015, (QZ0+QZ1)/2,
          0.5, 0, "#8d877c");
      m.B("plaster", QX1-QX0, 0.08, QZ1-QZ0, (QX0+QX1)/2, PF+PH-0.05, (QZ0+QZ1)/2,
          0.4, 0, "#a49e92");
      // the projector: off its mount, lens down, one reel arm snapped
      (function(){
        const jx=-1.55, jz=PZ0+1.30, jy=PF+0.62;
        m.B("metal", 0.70,0.10,0.52, jx, PF+0.30, jz, 0.4, 0, "#5e6468");     // the pedestal
        m.C("metal", 0.10,0.13,0.52,10, jx, PF+0.26, jz, "#5e6468");
        m.P("weathered", boxGeo(0.86,0.46,0.42,0.4), jx, jy, jz, 0.06, "#4a4f52", -0.22, 0.05);
        m.P("weathered", boxGeo(0.40,0.40,0.40,0.4), jx-0.52, jy+0.04, jz+0.05, 0.06,
            "#3f4447", -0.22, 0.05);                                           // lamp house
        m.P("metal", new T.CylinderGeometry(0.075,0.095,0.44,12), jx+0.62, jy-0.10, jz-0.04,
            0.06, "#2b2f31", 1.35, 0.05);                                      // the lens, drooping
        m.P("glass", new T.CylinderGeometry(0.068,0.068,0.02,12), jx+0.62, jy-0.31, jz-0.04,
            0.06, "#9fb0ab", 1.35, 0.05);
        for(const q of [[0.30,0.52],[-0.34,-0.40]]){                           // reel arms
          m.P("metal", boxGeo(0.05,0.44,0.05,0), jx+q[0], jy+q[1], jz, 0.06, "#5e6468",
              -0.22+ (q[1]<0?0.9:0), 0.05);
          m.P("metal", new T.CylinderGeometry(0.30,0.30,0.035,18), jx+q[0], jy+q[1]+0.26, jz+0.16,
              0.06, "#6b7072", 1.35, 0.05);
        }
        m.P("weathered", boxGeo(0.34,0.03,0.30,0.4), jx+0.10, PF+0.02, jz+0.70, 0.7,
            "#3a3f42", 0, 0.02);                                               // a cover on the floor
      })();
      // film: reels stacked, cans on the shelf, and a spool unwound across it all
      const REEL=["#4a4f52","#6b4a2a","#3f4447","#5a4030"];
      for(let i=0;i<7;i++)
        m.P("metal", new T.CylinderGeometry(0.19,0.19,0.035,16), QX0+0.55+((i%3)*0.44),
            PF+0.02+(((i/3)|0)*0.045), QZ1-0.52, i, REEL[i%4], 0, 0);   // lying flat, stacked
      /* A shelf ON the wall (QX1 is its face) on two brackets, with the
         reels standing on edge along it. The shelf stood 21 cm out from the
         wall on nothing, with the reels sunk halfway through it. */
      for(let i=0;i<5;i++)
        m.P("metal", new T.CylinderGeometry(0.17,0.17,0.06,16), QX1-0.21,
            PF+1.525+0.17, QZ0+0.62+i*0.11, 0, REEL[(i+1)%4], Math.PI/2, 0);
      m.B("oak", 0.42, 0.05, 1.40, QX1-0.21, PF+1.50, QZ0+1.10, 0.5, 0, "#6f6048");
      for(const bz of [QZ0+0.55, QZ0+1.65])
        m.B("metal", 0.30, 0.04, 0.03, QX1-0.15, PF+1.455, bz, 0, 0, "#5e6468");
      for(let i=0;i<16;i++){                                   // film, unspooled
        const t=i/15, ax=QX0+0.6+t*3.2+Math.sin(t*9.1)*0.26, az=QZ1-0.9-Math.sin(t*5.7)*0.55;
        m.P("soot", planeGeo(0.34,0.035,0), ax, PF+0.026, az, Math.sin(t*7.3)*1.4,
            "#2a2420", -Math.PI/2, 0);
      }
      // two filing cabinets, one drawer never closed
      for(let k=0;k<2;k++){
        const fx=QX0+0.42+k*0.58;
        m.B("metal", 0.52, 1.28, 0.62, fx, PF+0.64, QZ0+0.46, 0.45, 0, "#6d7377");
        for(let d=0;d<4;d++){
          m.B("metal", 0.46, 0.27, 0.06, fx, PF+0.22+d*0.31, QZ0+0.11, 0, 0, "#7d8387");
          m.B("metal", 0.14, 0.03, 0.03, fx, PF+0.22+d*0.31, QZ0+0.06, 0, 0, "#9aa1a4");
        }
        if(k===1){                                             // one hanging open
          m.B("metal", 0.43, 0.25, 0.46, fx, PF+0.845, QZ0-0.06, 0.4, 0, "#7d8387");
          for(let f=0;f<5;f++)
            m.P("paper", planeGeo(0.20,0.27,0), fx-0.15+f*0.07, PF+1.00, QZ0-0.10,
                0, "#ffffff", -0.25, 0.02);
        }
        m.col(fx-0.3, fx+0.3, QZ0, QZ0+0.8, 0, PF+1.3);
      }
      // a rewind bench, a stool, a bulb, and the paperwork nobody filed
      m.B("oak", 2.10, 0.06, 0.58, (QX0+QX1)/2-0.4, PF+0.86, QZ1-0.42, 0.5, 0, "#7a6746");
      for(const lx of [QX0+0.7, QX0+2.5])
        m.C("metal", 0.035,0.035,0.84,8, lx, PF+0.43, QZ1-0.42, "#5e6468");
      m.col(QX0, -0.35, QZ1-0.75, QZ1, 0, PF+0.9);
      // tucked under the bench, not in the doorway
      m.C("metal", 0.04,0.05,0.62,8, -1.40, PF+0.31, QZ1-1.02, "#5e6468");
      m.C("fabric", 0.17,0.17,0.07,12, -1.40, PF+0.65, QZ1-1.02, "#6d3540");
      addSeat(OX-1.40, OZ+QZ1-1.02, m.y+PF+0.70, Math.PI, "THE REWIND BENCH");
      m.C("teal", 0.012,0.012,0.62,6, -1.0, PF+PH-0.33, (QZ0+QZ1)/2, "#6e6a62");
      m.P("glass", new T.SphereGeometry(0.075,10,8), -1.0, PF+PH-0.72, (QZ0+QZ1)/2, 0, "#6a6458");
      for(let i=0;i<9;i++)                                     // schedules on the wall (beside
        m.P("paper", planeGeo(0.19,0.26,0), -0.20+(i%5)*0.30, PF+1.95+(((i/5)|0)*0.34),  // the ports, not on them)
            QZ0+0.012, 0, "#ffffff", 0, ((i*7)%5-2)*0.03);
      for(let i=0;i<11;i++)                                    // and on the floor
        m.P("paper", planeGeo(0.19,0.26,0), QX0+0.4+((i*0.37)%3.9), PF+0.014+i*0.0015,
            QZ0+0.9+((i*0.53)%2.0), i*1.7, "#ffffff", -Math.PI/2, 0);
      m.P("clockface", planeGeo(0.30,0.30,0), QX1-0.012, PF+2.10, (QZ0+QZ1)/2, -Math.PI/2,
          "#e8e2cf");
      for(const st of [[QX1-1.25, QZ0+0.014, 0],[QX0+1.95, QZ1-0.014, Math.PI]])
        m.P("soot", planeGeo(1.10,1.50,0), st[0], PF+1.34, st[1], st[2], "#6a5a3a", 0, 0);
      // the rest of what is in here: a toolboard, a spares shelf, cable, and
      // the calendar that stopped being turned over
      m.B("oak", 0.90, 0.72, 0.05, QX0+1.30, PF+1.86, QZ1-0.03, 0.5, 0, "#5b4632");
      for(let i=0;i<7;i++){
        m.C("metal", 0.012,0.012,0.16+((i*7)%4)*0.05,6, QX0+0.95+i*0.12, PF+1.84,
            QZ1-0.067, "#8a8274");
        m.B("metal", 0.05,0.03,0.02, QX0+0.95+i*0.12, PF+1.95, QZ1-0.065, 0, 0, "#9aa1a4");
      }
      m.B("oak", 1.30, 0.05, 0.28, QX1-0.85, PF+2.34, QZ1-0.14, 0.5, 0, "#6f6048");   // on the wall
      for(const bx2 of [QX1-1.35, QX1-0.35])
        m.B("metal", 0.03, 0.04, 0.22, bx2, PF+2.295, QZ1-0.13, 0, 0, "#5e6468");
      for(let i=0;i<5;i++)
        m.C("metal", 0.055,0.055,0.15,10, QX1-1.35+i*0.24, PF+2.44, QZ1-0.14,
            ["#7a5a2a","#4a5f52","#6d6a62"][i%3]);
      m.P("paper", planeGeo(0.24,0.34,0), QX0+2.55, PF+1.92, QZ1-0.012, Math.PI,
          "#ded4b4", 0, 0.02);
      m.C("metal", 0.075,0.075,0.40,12, QX1-0.09, PF+0.20, QZ0+0.60, "#a82e22");  // extinguisher, on the floor by the wall
      for(let i=0;i<9;i++){                                    // cable, looped along the wall
        const t=i/8;
        m.P("teal", boxGeo(0.60,0.02,0.02,0), QX0+0.6+t*3.6, PF+2.62-Math.sin(t*3.14)*0.12,
            QZ0+0.012, 0, "#3a342e", 0, Math.sin(t*3.14)*0.22);
      }
      addZone(OX+QX0, OX+QX1, OZ+QZ0, OZ+QZ1, m.y+PF-0.3, m.y+PF+PH,
              "THE PROJECTION ROOM", true);
    })();
    for(let r=0;r<6;r++) for(let k=-4;k<=4;k++){                       // the speaker posts
      if((r*9+k+4)%7===3) continue;
      const px=k*4.4+(r%2)*1.1, pz=11+r*5.4;
      m.C("metal", 0.05,0.06,1.15,6, px,0.55,pz, "#5b5f62");
      m.B("paint", 0.17,0.24,0.13, px,1.20,pz, 0, ((r*k)%5)*0.3, "#4a4640");
      m.B("gravel", 3.6,0.05,0.5, px,0.03,pz-2.2, 0.5, 0, "#8a7a62");  // the ramp
    }
    m.col(-13.6,13.6,-0.5,1.0, 0,13.4);
    m.rect(-26,26,-8,54, "THE DRIVE-IN");
  })();

  /* --- one phone booth, miles from anywhere ----------------------------
     WHAT MAKES A PHONE BOOTH A PHONE BOOTH, and what the first one of these
     was missing. It was a blue box with glass in it, and that is a shower
     cubicle. The things your eye is actually looking for are: the lit
     header with TELEPHONE across all four faces and the bell on it; the
     FOLDING door, two narrow leaves on a centre hinge, standing half open
     because they always are; the solid kick panels under the glazing; the
     mullions that break each face into lights rather than leaving one slab
     of glass; the shelf and the directory on its swing arm; and the dome
     in the ceiling that comes on when the door shuts. Built in that order,
     every one of them earns its primitives.                             */
  (function(){
    const m=mk(-96, 196);
    const AL="#b9c2c6", ALD="#8d979c", BLU="#2f6ea8", BLUD="#24547e";
    const GLS="#cfe0e6", CHR="#c8cfd2", DRK="#2a2a28";
    const HW=0.49;                                  // half the booth, inside the posts
    const TOP=2.26, KICK=0.44, GLZ0=0.50, GLZ1=2.14;
    const R2=n=>((Math.sin(n*53.17+9.3)*43758.5)%1+1)%1;
    // the pad it stands on, kerbed, with the desert drifted up against it
    m.B("concrete", 1.44, 0.16, 1.44, 0,0.04,0, 0.45, 0, "#a8a196");
    m.B("concrete", 1.52, 0.07, 1.52, 0,0.015,0, 0.45, 0, "#968f85");
    m.flat(-0.76,0.76,-0.76,0.76, 0.12);
    for(let i=0;i<7;i++)
      m.P("track", planeGeo(0.5+R2(i)*0.6, 0.4+R2(i+4)*0.5, 0), (R2(i)-0.5)*1.5, 0.125,
          (R2(i+9)-0.5)*1.5, R2(i+2)*3.1, "#cdbb97", -Math.PI/2, 0);
    // the frame: four corner posts and the rails that tie them
    for(const q of [[-1,-1],[1,-1],[-1,1],[1,1]])
      m.B("metal", 0.075, TOP, 0.075, q[0]*HW, 0.12+TOP/2, q[1]*HW, 0.4, 0, AL);
    for(const yy of [0.14, KICK, GLZ1+0.10, TOP+0.08])
      for(const ax of [0,1]) for(const q of [-1,1])
        m.B("metal", ax?0.065:HW*2+0.075, 0.065, ax?HW*2+0.075:0.065,
            ax?q*HW:0, 0.12+yy, ax?0:q*HW, 0.4, 0, yy===TOP+0.08?ALD:AL);
    /* THREE SIDES ARE GLAZED, THE FOURTH IS THE DOOR. Each glazed side is a
       kick panel, two lights and a transom — the mullions are what stop it
       reading as one sheet of perspex. */
    const side=(ry, sx, sz)=>{
      m.B("paint", ry?0.05:HW*2, KICK-0.16, ry?HW*2:0.05, sx*HW, 0.12+0.14+(KICK-0.16)/2,
          sz*HW, 0.5, 0, BLU);
      m.B("metal", ry?0.055:HW*2+0.04, 0.05, ry?HW*2+0.04:0.055, sx*HW, 0.12+KICK-0.02,
          sz*HW, 0.4, 0, AL);
      for(const g of [[GLZ0, 1.28],[1.34, GLZ1]])
        m.B("glass", ry?0.03:HW*2-0.02, g[1]-g[0], ry?HW*2-0.02:0.03, sx*HW,
            0.12+(g[0]+g[1])/2, sz*HW, 0, 0, GLS);
      m.B("metal", ry?0.05:HW*2, 0.055, ry?HW*2:0.05, sx*HW, 0.12+1.31, sz*HW, 0.4, 0, AL);
      for(const q of [-0.33, 0.33])                 // the vertical mullions
        m.B("metal", ry?0.05:0.045, GLZ1-GLZ0, ry?0.045:0.05,
            ry?sx*HW:q*HW*2*0.5, 0.12+(GLZ0+GLZ1)/2, ry?q*HW*2*0.5:sz*HW, 0.4, 0, AL);
    };
    side(0, 0, 1); side(1, -1, 0); side(1, 1, 0);
    /* THE FOLDING DOOR, standing a third open. Two leaves: the first hinged
       on the left post and swung in, the second hinged off the first and
       folded back on it, which is the shape everybody recognises and the
       reason you can see into one of these at all. */
    const leaf=(cx,cz,ry,w2)=>{
      m.B("metal", w2, GLZ1-0.10, 0.05, cx, 0.12+(KICK+GLZ1)/2-0.05, cz, 0.4, ry, AL);
      m.B("paint", w2-0.07, KICK-0.18, 0.055, cx, 0.12+0.15+(KICK-0.18)/2, cz, 0.5, ry, BLU);
      m.B("glass", w2-0.09, GLZ1-KICK-0.14, 0.03, cx, 0.12+(KICK+GLZ1)/2+0.05, cz, 0, ry, GLS);
      m.B("metal", w2-0.09, 0.04, 0.04, cx, 0.12+1.31, cz, 0.4, ry, AL);
    };
    {
      const a=0.72, b=-1.05;                        // the two leaves' bearings
      const x1=-HW+Math.cos(a)*0.24, z1=-HW+Math.sin(a)*0.24;
      leaf(x1, z1, a, 0.48);
      const hx=-HW+Math.cos(a)*0.48, hz=-HW+Math.sin(a)*0.48;
      leaf(hx+Math.cos(b)*0.24, hz+Math.sin(b)*0.24, b, 0.48);
      m.C("metal", 0.016,0.016,0.52,8, hx, 0.12+1.46, hz, CHR);   // the centre pull
      m.C("metal", 0.016,0.016,0.52,8, -HW+0.06, 0.12+1.46, -HW+0.06, CHR);
    }
    /* THE HEADER. Lit, on all four faces, which is the only part of one of
       these you can read from the road at night. */
    const telTex=signTex(256,96,(x,W,H)=>{
      const g=x.createLinearGradient(0,0,0,H);
      g.addColorStop(0,"#3f84c4"); g.addColorStop(1,"#245f93");
      x.fillStyle=g; x.fillRect(0,0,W,H);
      x.fillStyle="#eef3f6"; x.fillRect(5,5,W-10,3); x.fillRect(5,H-8,W-10,3);
      x.fillStyle="#eef3f6"; fitText(x,"TELEPHONE", W-78, 46, W/2+16, H/2+2);
      x.save(); x.translate(34,H/2); x.fillStyle="#eef3f6";       // the bell
      x.beginPath(); x.moveTo(-15,13); x.quadraticCurveTo(-13,-10,0,-13);
      x.quadraticCurveTo(13,-10,15,13); x.closePath(); x.fill();
      x.fillRect(-18,13,36,4);
      x.beginPath(); x.arc(0,21,4.5,0,7); x.fill(); x.restore();
    });
    m.B("paint", HW*2+0.20, 0.30, HW*2+0.20, 0, 0.12+TOP+0.17, 0, 0.4, 0, BLUD);
    for(let k=0;k<4;k++){
      const ry=k*Math.PI/2, nx=Math.sin(ry), nz=Math.cos(ry);
      signPanel(0.90, 0.24, telTex, m.wx(nx*(HW+0.106), 0), m.y+0.12+TOP+0.17,
                m.wz(0, nz*(HW+0.106)), ry, true);
    }
    m.B("metal", HW*2+0.34, 0.07, HW*2+0.34, 0, 0.12+TOP+0.35, 0, 0.4, 0, ALD);
    m.B("metal", HW*2+0.40, 0.035, HW*2+0.40, 0, 0.12+TOP+0.30, 0, 0.4, 0, AL);
    /* WHAT IS ACTUALLY IN IT. A payphone is a steel case with a chrome
       faceplate, three coin slots, a return cup, and a handset on a hook
       with an armoured cord — and under it a shelf with the directory
       hanging off a swing arm, because that is where you put the phone
       number you were given. */
    const BZ=HW-0.06;
    m.B("paint", 0.30, 0.62, 0.13, 0.02, 0.12+1.28, BZ, 0.4, 0, "#33373a");
    m.B("metal", 0.26, 0.34, 0.015, 0.02, 0.12+1.44, BZ-0.072, 0.4, 0, CHR);
    for(let i=0;i<3;i++)                            // the coin slots
      m.B("paint", 0.018, 0.045, 0.012, -0.05+i*0.05, 0.12+1.58, BZ-0.082, 0.4, 0, DRK);
    m.C("metal", 0.055,0.055,0.014,16, 0.02, 0.12+1.40, BZ-0.082, ALD);   // the dial
    for(let i=0;i<10;i++)
      m.C("paint", 0.009,0.009,0.016,8, 0.02+Math.cos(i*0.63)*0.036, 0.12+1.40,
          BZ-0.090+Math.sin(i*0.63)*0.0, DRK, Math.PI/2, 0, 0);
    m.B("metal", 0.13, 0.055, 0.035, 0.02, 0.12+1.07, BZ-0.075, 0.4, 0, CHR);  // return cup
    m.B("paint", 0.11, 0.03, 0.02, 0.02, 0.12+1.075, BZ-0.088, 0.4, 0, DRK);
    // the number card, in its frame on the case's top edge (case top 1.59;
    // it stood 12 cm over it in front of the glass)
    m.B("paint", 0.15, 0.10, 0.02, -0.02, 0.12+1.65, BZ-0.075, 0.4, 0, "#e4e0d2");
    m.B("metal", 0.17, 0.12, 0.012, -0.02, 0.12+1.65, BZ-0.070, 0.4, 0, CHR);
    // the handset, on its hook, with the cord hanging in a loose coil
    m.B("metal", 0.05, 0.10, 0.05, -0.17, 0.12+1.46, BZ-0.06, 0.4, 0, CHR);
    m.P("paint", boxGeo(0.055,0.23,0.055,0), -0.17, 0.12+1.40, BZ-0.095, 0.1, DRK, 0.06, 0);
    for(const q of [-1,1])
      m.P("paint", boxGeo(0.075,0.055,0.075,0), -0.17, 0.12+1.40+q*0.125, BZ-0.095,
          0.1, DRK, 0.06, 0);
    for(let i=0;i<11;i++)
      m.P("teal", new T.TorusGeometry(0.035,0.008,5,12), -0.14, 0.12+1.24-i*0.052,
          BZ-0.055, 0, "#2b2b29", 0.35, 0);
    // the shelf, the directory on its arm, and a pencil somebody left
    m.B("metal", 0.52, 0.025, 0.20, 0.02, 0.12+0.98, BZ-0.10, 0.5, 0, ALD);
    for(const q of [-1,1])
      m.B("metal", 0.03, 0.10, 0.03, 0.02+q*0.22, 0.12+0.93, BZ-0.05, 0.4, 0, ALD);
    m.C("metal", 0.012,0.012,0.26,6, 0.24, 0.12+0.86, BZ-0.06, ALD, 0, 0, 0.4);
    m.P("oak", boxGeo(0.21,0.05,0.16,0.5), 0.30, 0.12+0.74, BZ-0.11, 0.25, "#b8ab8c", 0.12, 0.2);
    m.P("paper", boxGeo(0.20,0.025,0.15,0.5), 0.30, 0.12+0.77, BZ-0.11, 0.25, "#d8d2bc", 0.12, 0.2);
    m.C("paint", 0.006,0.006,0.13,5, -0.18, 0.12+0.995, BZ-0.13, "#b8a23a", 0, 0.7, Math.PI/2);
    // the dome in the ceiling, and the light it throws
    m.C("metal", 0.085,0.085,0.02,14, 0, 0.12+TOP-0.03, 0, ALD);
    m.P("ceilfix", new T.SphereGeometry(0.075,12,8), 0, 0.12+TOP-0.07, 0, 0, "#f4ecd2");
    m.lamp(0, 0.12+TOP-0.12, 0, {color:0xffeec8, intensity:0.46, dist:7.0, decay:1.5,
                                 mothy:true, flicker:true});
    m.lamp(0, 0.12+TOP+0.17, -HW-0.3, {color:0xdfd8bc, intensity:0.30, dist:9.0, decay:1.5});
    /* AND FORTY YEARS OF NOBODY MINDING IT. One light out of the east face,
       its frame still there; the glass crazed where somebody put a boot
       through the kick panel; scratched initials; a drift of sand in the
       corner the wind favours; flyers stapled to the post. */
    m.P("soot", planeGeo(0.34, 0.26, 0), HW-0.022, 0.12+1.62, 0.16, Math.PI/2,
        "#8a8272", 0, 0);
    for(let i=0;i<9;i++)
      m.P("glass", boxGeo(0.02,0.05,0.07,0), HW-0.02, 0.135, 0.10+R2(i)*0.5-0.25,
          R2(i+3)*3.1, GLS, 0, R2(i+6)*2.4-1.2);
    m.P("soot", planeGeo(0.30, 0.42, 0), -HW+0.022, 0.12+1.30, -0.10, -Math.PI/2,
        "#7d7668", 0, 0);
    for(let i=0;i<4;i++)
      m.P("paper", planeGeo(0.11+R2(i)*0.05, 0.15+R2(i+2)*0.06, 0), -HW-0.042,
          0.12+1.05+i*0.22, -HW+0.02, -Math.PI/2, ["#cfc6ae","#c8bda0","#d4ccb4","#bfb6a0"][i],
          0, R2(i+5)*0.3-0.15);
    m.col(-0.62,0.62,-0.62,0.62, 0, 2.6);
    m.zone(8, "A TELEPHONE");
  })();

  /* --- the snack bar, west of the drive-in ------------------------------
     Nobody has sold a box of popcorn in here since 1979. It is a concrete
     block shed with a serving counter down the lot side, and everything in
     it either rusted, went soft, or was already rubbish when the last
     projectionist locked up.                                             */
  (function(){
    const m=mk(-206,-158);
    const SW=11.4, SD=7.2, ST=0.26, SH=3.10, SF=0.14;         // walls, height, floor
    const X0=-SW/2, X1=SW/2, Z0=-SD/2, Z1=SD/2;
    const QX0=X0+ST, QX1=X1-ST, QZ0=Z0+ST, QZ1=Z1-ST;         // inner faces
    const WALLC="#a79e8c", TRIM="#7d6a4a";
    const SERVE=[-3.30, 3.30], SDOOR=[0.72, 1.77];            // hatch on +z, door on +x
    const HS=SF+1.06, HH=SF+2.16;                             // the hatch sill and head
    const runs=(a0,a1,holes)=>{
      const out=[]; let c=a0;
      for(const h of holes){ if(h[0]>c) out.push([c,h[0]]); c=Math.max(c,h[1]); }
      if(c<a1) out.push([c,a1]); return out;
    };
    const Bn=(bk,w,d,cx,cy,cz,r,col)=>{                       // a rolled edge, as the bar has
      m.C(bk, r,r,w,8, cx,cy,cz-d/2, col, 0,0,Math.PI/2);
      m.C(bk, r,r,w,8, cx,cy,cz+d/2, col, 0,0,Math.PI/2);
      m.C(bk, r,r,d,8, cx-w/2,cy,cz, col, Math.PI/2,0,0);
      m.C(bk, r,r,d,8, cx+w/2,cy,cz, col, Math.PI/2,0,0);
    };
    // ---- the shell -----------------------------------------------------
    m.B("concrete", SW+0.8, 0.30, SD+0.8, 0, SF-0.15, 0, 0.45, 0, "#9b948a");
    m.flat(X0-0.4, X1+0.4, Z0-0.4, Z1+0.4, SF);
    // the lot side, with the serving hatch cut out of it
    for(const g of runs(X0,X1,[SERVE]))
      m.B("stucco", g[1]-g[0], SH, ST, (g[0]+g[1])/2, SF+SH/2, Z1-ST/2, 0.42, 0, WALLC);
    m.B("stucco", SERVE[1]-SERVE[0], HS-SF, ST, 0, (SF+HS)/2, Z1-ST/2, 0.42, 0, WALLC);
    m.B("stucco", SERVE[1]-SERVE[0], SF+SH-HH, ST, 0, (HH+SF+SH)/2, Z1-ST/2, 0.42, 0, WALLC);
    // the shutter, jammed two thirds up, and the counter slab under it
    m.B("metal", SERVE[1]-SERVE[0]-0.06, 0.52, 0.05, 0, HH-0.26, Z1-0.05, 0.6, 0, "#7a6f5e");
    for(let i=0;i<5;i++)
      m.B("metal", SERVE[1]-SERVE[0]-0.06, 0.02, 0.07, 0, HH-0.48+i*0.10, Z1-0.05, 0,0,"#6a604f");
    m.B("stairs", SERVE[1]-SERVE[0]+0.50, 0.08, 0.62, 0, HS+0.04, Z1-0.06, 0.5, 0, "#9aa1a4");
    Bn("metal", SERVE[1]-SERVE[0]+0.50, 0.62, 0, HS+0.04, Z1-0.06, 0.042, "#9aa1a4");
    // the back and the two ends, the near one with the door
    m.B("stucco", SW, SH, ST, 0, SF+SH/2, Z0+ST/2, 0.42, 0, WALLC);
    m.B("stucco", ST, SH, SD-ST*2, X0+ST/2, SF+SH/2, 0, 0.42, 0, WALLC);
    for(const g of runs(Z0+ST, Z1-ST, [SDOOR]))
      m.B("stucco", ST, SH, g[1]-g[0], X1-ST/2, SF+SH/2, (g[0]+g[1])/2, 0.42, 0, WALLC);
    m.B("stucco", ST, SH-2.07, SDOOR[1]-SDOOR[0], X1-ST/2, SF+2.07+(SH-2.07)/2,
        (SDOOR[0]+SDOOR[1])/2, 0.42, 0, WALLC);
    // flat roof, parapet, and the fascia the letters came off
    m.B("weathered", SW+0.7, 0.24, SD+0.7, 0, SF+SH+0.12, 0, 0.4, 0, "#8c8477");
    for(const q of [[0, Z1+0.30, SW+0.7, 0.20],[0, Z0-0.30, SW+0.7, 0.20],
                    [X0-0.30, 0, 0.20, SD+0.3],[X1+0.30, 0, 0.20, SD+0.3]])
      m.B("stucco", q[2], 0.52, q[3], q[0], SF+SH+0.48, q[1], 0.42, 0, "#9c937f");
    m.B("paint", SW-0.6, 0.70, 0.10, 0, SF+SH+0.52, Z1+0.42, 0.4, 0, "#c8bda4");
    // colliders: every wall but the doorway
    m.col(X0, X1, Z0, Z0+ST, 0, SF+SH);
    m.col(X0, X1, Z1-ST, Z1, 0, SF+SH);
    m.col(X0, X0+ST, Z0, Z1, 0, SF+SH);
    for(const g of runs(Z0+ST, Z1-ST, [SDOOR])) m.col(X1-ST, X1, g[0], g[1], 0, SF+SH);
    m.B("concrete", 1.10, 0.22, 1.70, X1+0.50, SF-0.12, (SDOOR[0]+SDOOR[1])/2, 0.45,0,"#a8a094");
    m.flat(X1, X1+1.05, SDOOR[0]-0.7, SDOOR[1]+0.7, SF-0.01);
    makeDoor(XF(-206+X1-0.04, -158+SDOOR[0]+0.02, -Math.PI/2), 0, m.y+SF+0.02, 0,
             "THE SNACK BAR", true, 0, "booth");
    // ---- inside: the floor, the ceiling, and what is left of the wiring -
    m.B("checker", QX1-QX0, 0.05, QZ1-QZ0, 0, SF-0.015, 0, 0.55, 0, "#ffffff");
    m.B("plaster", QX1-QX0, 0.07, QZ1-QZ0, 0, SF+SH-0.04, 0, 0.4, 0, "#8e897e");
    for(const fx of [-3.2, 0.4, 3.4]){                        // fixtures, stripped
      m.B("metal", 1.26, 0.09, 0.22, fx, SF+SH-0.085, -0.6, 0.4, 0, "#7d8387");
      for(let k=0;k<3;k++){                                   // the wires left hanging
        const L=0.30+k*0.18, ln=0.5+k*0.3;
        m.C("teal", 0.008,0.008, L, 5, fx-0.3+k*0.3, SF+SH-0.13-Math.cos(ln)*L/2, -0.6,
            "#2e2a26", ln, k*2.1, 0);
      }
    }
    // grease up the wall behind where the fryers stood, and damp down the block
    const GRS=[[-4.2, 2.10, 2.4],[-1.0, 2.20, 2.0],[2.4, 2.05, 2.6],[4.6, 1.95, 1.6]];
    for(let j=0;j<GRS.length;j++){
      const q=GRS[j];
      for(let k=0;k<3;k++)                                    // three passes: it builds up
        m.P("grease", planeGeo(q[2]-k*0.42, 2.20-k*0.40, 0), q[0], SF+q[1]+k*0.12,
            QZ0+0.016+(j*3+k)*0.004, 0, "#3e3325", 0, 0);
    }
    for(let i=0;i<7;i++)                                      // each on its own plane
      m.P("grease", planeGeo(0.9+((i*7)%5)*0.4, 1.3, 0), QX0+0.9+i*1.5, SF+0.75,
          QZ0+0.070+i*0.005, 0, "#5a5040", 0, 0);
    for(const fx of [-3.2, 0.4, 3.4])                         // smoke round the fittings
      m.P("grease", planeGeo(2.0, 1.1, 0), fx, SF+SH-0.05, -0.6, 0, "#4a4032", -Math.PI/2, 0);
    // ---- the long stainless counter down the back ----------------------
    for(const q of [[-3.7, 3.4],[1.9, 3.0]]){
      m.B("metal", q[1], 0.86, 0.72, q[0], SF+0.43, QZ0+0.40, 0.45, 0, "#8d9498");
      m.B("stairs", q[1]+0.06, 0.05, 0.78, q[0], SF+0.885, QZ0+0.40, 0.5, 0, "#a4abae");
      Bn("metal", q[1]+0.06, 0.78, q[0], SF+0.885, QZ0+0.40, 0.032, "#a4abae");
      m.col(q[0]-q[1]/2, q[0]+q[1]/2, QZ0, QZ0+0.80, 0, SF+0.92);
      for(let i=0;i<3;i++)                                    // the doors underneath
        m.B("metal", q[1]/3-0.08, 0.62, 0.03, q[0]-q[1]/3+i*q[1]/3, SF+0.40, QZ0+0.76,
            0, 0, "#7d8387");
    }
    for(const q of [[-3.7, 3.4],[1.9, 3.0]])                  // rust running down it
      for(let i=0;i<4;i++)
        m.P("rust", streakGeo(0.10, 0.60, 0), q[0]-q[1]/2+0.4+i*(q[1]-0.8)/3, SF+0.52,
            QZ0+0.785, 0, "#6a3a20");
    // ---- two popcorn poppers, both seized -------------------------------
    for(const px of [-4.4, -2.6]){
      m.B("metal", 0.80, 0.16, 0.62, px, SF+0.965, QZ0+0.42, 0.4, 0, "#6f767a");
      for(const c of [[-1,-1],[1,-1],[-1,1],[1,1]])           // the legs
        m.C("metal", 0.020,0.020,0.16,6, px+c[0]*0.33, SF+0.965, QZ0+0.42+c[1]*0.24, "#6f767a");
      m.B("rust", 0.78, 0.86, 0.60, px, SF+1.48, QZ0+0.42, 0.4, 0, "#9c6a3a");   // the case
      m.B("tvglass", 0.66, 0.66, 0.02, px, SF+1.46, QZ0+0.12, 0, 0, "#20302e");  // the glass
      m.B("tvglass", 0.02, 0.66, 0.50, px-0.355, SF+1.46, QZ0+0.42, 0, 0, "#20302e");
      m.C("metal", 0.17,0.17,0.24,12, px, SF+1.74, QZ0+0.42, "#8a8076");         // the kettle
      m.C("metal", 0.012,0.012,0.30,6, px+0.20, SF+1.74, QZ0+0.42, "#8a8076", 0,0,Math.PI/2);
      m.B("rust", 0.78, 0.10, 0.60, px, SF+1.95, QZ0+0.42, 0.4, 0, "#8a5a2e");
      for(let i=0;i<9;i++)                                    // what never got swept out
        m.P("paper", new T.SphereGeometry(0.018,6,4), px-0.30+((i*0.29)%0.62),
            SF+1.06, QZ0+0.22+((i*0.17)%0.40), 0, "#e8dcb6");
      m.col(px-0.44, px+0.44, QZ0+0.08, QZ0+0.76, 0, SF+2.0);
    }
    // ---- the fountain, with one arm hanging off -------------------------
    (function(){
      const fx=1.6, fz=QZ0+0.40;
      m.B("metal", 0.92, 0.62, 0.50, fx, SF+1.21, fz, 0.4, 0, "#7d8387");
      m.B("rust", 0.94, 0.14, 0.52, fx, SF+1.56, fz, 0.4, 0, "#9c6a3a");
      for(let i=0;i<5;i++){                                   // the valves
        const vx=fx-0.34+i*0.17;
        if(i===2){                                            // this one came away
          m.C("metal", 0.026,0.026,0.20,7, vx, SF+1.06, fz-0.28, "#8d9498", 1.15, 0.4, 0);
          m.B("paint", 0.07,0.05,0.09, vx+0.05, SF+0.96, fz-0.36, 0, 0.4, "#b03a2a");
          continue;
        }
        m.C("metal", 0.024,0.024,0.16,7, vx, SF+1.03, fz-0.27, "#8d9498");
        m.B("paint", 0.06,0.05,0.08, vx, SF+0.95, fz-0.30, 0, 0, ["#b03a2a","#2f5e8a","#d8a42a"][i%3]);
      }
      m.B("metal", 0.90, 0.03, 0.46, fx, SF+0.905, fz-0.02, 0.5, 0, "#6f767a");  // the drip tray
      for(let i=0;i<4;i++)                                    // cup sleeves, gone soft
        m.C("paper", 0.042,0.048,0.11,9, fx+0.60, SF+0.95+i*0.012, fz-0.22+i*0.02,
            "#c8b894", 0.06*i, i*1.1, 0.03*i);
      m.col(fx-0.5, fx+0.5, fz-0.30, fz+0.30, 0, SF+1.6);
    })();
    // ---- the menu boards, most of the letters gone ----------------------
    for(let b=0;b<3;b++){
      const bx2=-3.5+b*3.5;
      m.B("weathered", 3.10, 1.05, 0.07, bx2, SF+2.42, QZ0+0.06, 0.4, 0, "#2f2a26");
      for(let r=0;r<3;r++) for(let k=0;k<11;k++){
        if(((b*7+r*5+k*3)%4)===0) continue;                   // the tiles that fell off
        m.B("paint", 0.19, 0.20, 0.015, bx2-1.36+k*0.27, SF+2.74-r*0.31, QZ0+0.10,
            0, 0, ((b+k)%5)===0 ? "#c8443a" : "#dcd2b4");
      }
      m.B("metal", 3.16, 0.04, 0.10, bx2, SF+2.96, QZ0+0.08, 0, 0, "#6f767a");
    }
    // ---- storage: boxes, cups, napkins, and what the birds left ---------
    for(let i=0;i<11;i++){
      const bxx=QX0+0.6+((i*1.31)%(SW-1.8)), bzz=QZ1-0.55-((i*0.53)%1.5);
      const w=0.44+((i*7)%3)*0.10, h=0.30+((i*5)%3)*0.08;
      m.B("paper", w, h, w*0.82, bxx, SF+h/2, bzz, 0.5, ((i*11)%7)*0.22, "#a08a64");
      if(i%3===0) m.B("paper", w*0.94, 0.02, w*0.78, bxx, SF+h+0.01, bzz,
                      0.5, ((i*11)%7)*0.22, "#8e7a56");        // a flap left open
    }
    for(let i=0;i<4;i++)                                      // stacks of cups
      for(let k=0;k<6;k++)
        m.C("paper", 0.040,0.034,0.05,9, -3.85+i*0.22, SF+0.94+k*0.046, QZ0+0.62,
            "#ddd2b8");
    for(let i=0;i<3;i++)                                      // napkins, welded together
      m.B("paper", 0.24, 0.05+((i*3)%3)*0.03, 0.20, -3.55+i*0.30, SF+0.95, QZ0+0.26,
          0.5, ((i*5)%4)*0.3, "#cdc4ae");
    for(let i=0;i<3;i++){                                     // condiment pumps, rotting
      const cx2=[3.15, 2.25, 0.78][i];
      m.C("metal", 0.075,0.085,0.24,10, cx2, SF+1.05, QZ0+0.30, "#8a8076");
      m.C("metal", 0.022,0.022,0.14,6, cx2, SF+1.23, QZ0+0.30, "#7d8387");
      m.B("rust", 0.10,0.04,0.09, cx2, SF+1.29, QZ0+0.24, 0, 0, "#8a5a2e");
    }
    // a register that was open when they walked out
    m.B("metal", 0.40, 0.26, 0.34, 2.75, SF+1.02, QZ0+0.40, 0.4, 0, "#7d8387");
    m.B("metal", 0.36, 0.10, 0.28, 2.75, SF+1.20, QZ0+0.40, 0.4, 0, "#6f767a");
    m.B("paper", 0.30, 0.02, 0.24, 2.75, SF+0.91, QZ0+0.16, 0.4, 0.2, "#cdc4ae");
    m.C("paper", 0.028,0.028,0.07,8, 2.83, SF+1.29, QZ0+0.40, "#e2dac4");
    // a chest freezer, lid up, long defrosted
    m.B("weathered", 1.50, 0.86, 0.68, QX0+1.4, SF+0.43, QZ1-0.52, 0.4, 0, "#b6ada0");
    m.P("weathered", boxGeo(1.54,0.10,0.72,0.4), QX0+1.4, SF+0.94, QZ1-0.52, 0,
        "#c2b9ab", -0.52, 0);
    m.B("metal", 0.40, 0.04, 0.04, QX0+1.4, SF+0.66, QZ1-0.88, 0, 0, "#8d9498");
    m.col(QX0+0.6, QX0+2.2, QZ1-0.9, QZ1-0.14, 0, SF+0.95);
    for(let i=0;i<5;i++)                                      // what is still in it
      m.B("paper", 0.16,0.10,0.12, QX0+0.9+i*0.26, SF+0.84, QZ1-0.52, 0.5, i*0.7, "#b8a884");
    // a mop that set solid in its bucket
    m.C("bin", 0.19,0.16,0.28,12, QX1-0.55, SF+0.14, QZ1-0.50, "#4e5a4e");
    m.C("oak", 0.020,0.020,1.34,7, QX1-0.62, SF+0.82, QZ1-0.58, "#8a7a5a", 0.18, 0.7, 0);
    m.C("fabric", 0.07,0.10,0.24,9, QX1-0.50, SF+0.20, QZ1-0.46, "#8e8a78");
    // the shelf of stock that never sold, and what is left on it
    m.B("oak", 3.20, 0.05, 0.30, -2.2, SF+1.72, QZ0+0.18, 0.5, 0, "#6f6048");
    for(const q of [-1.55, 1.55]) m.B("oak", 0.05, 0.62, 0.30, -2.2+q, SF+1.44, QZ0+0.18,
                                      0.5, 0, "#6f6048");
    for(let i=0;i<13;i++){
      if((i*5)%4===0) continue;                               // gaps where it went
      m.B("paint", 0.13, 0.19, 0.09, -3.6+i*0.24, SF+1.845, QZ0+0.18, 0, ((i*7)%5)*0.12,
          ["#c8443a","#2f6e8a","#d8a42a","#4f7a4a"][i%4]);
    }
    // wrappers and popcorn bags, where they stopped
    const WRAP=["#c8443a","#2f6e8a","#d8a42a","#4f7a4a","#dcd2b4"];
    for(let i=0;i<34;i++){
      const wx=QX0+0.3+((i*1.03)%(SW-1.2)), wz=QZ0+0.5+((i*0.71)%(SD-1.4));
      m.P("paper", planeGeo(0.10+((i*3)%4)*0.04, 0.06+((i*5)%3)*0.03, 0),
          wx, SF+0.012+i*0.0004, wz, i*1.7, WRAP[i%WRAP.length], -Math.PI/2, 0);
    }
    for(let i=0;i<9;i++){                                     // popcorn bags, half crushed
      const wx=QX0+0.8+((i*1.7)%(SW-2.2)), wz=QZ0+0.9+((i*1.1)%(SD-2.4));
      m.B("paper", 0.13, 0.17, 0.09, wx, SF+0.085, wz, 0.5, i*0.9, "#d8c9a4");
      m.B("paint", 0.02, 0.13, 0.085, wx+0.01, SF+0.10, wz, 0, i*0.9, "#c8443a");
    }
    for(let i=0;i<24;i++)                                     // broken glass
      m.P("glass", planeGeo(0.05+((i*3)%3)*0.03, 0.04, 0), QX0+0.4+((i*1.37)%(SW-1.2)),
          SF+0.006, QZ0+0.4+((i*0.93)%(SD-1.2)), i*2.1, "#cfe0e6", -Math.PI/2, 0);
    for(let i=0;i<30;i++)                                     // and what the birds left
      m.P("plaster", planeGeo(0.05+((i*5)%4)*0.02, 0.05, 0), QX0+0.5+((i*0.97)%(SW-1.4)),
          SF+0.008, QZ0+0.35+((i*1.23)%(SD-1.0)), i*1.3, "#e8e4d8", -Math.PI/2, 0);
    // a bird has been getting in through the hatch for years
    for(let i=0;i<14;i++)
      m.P("plaster", planeGeo(0.06,0.06,0), -3.0+((i*0.62)%6.0), HS+0.09,
          Z1-0.20-((i*0.13)%0.30), i*1.1, "#e8e4d8", -Math.PI/2, 0);
    // ---- the cook line down the east wall -------------------------------
    (function(){
      const lz0=-2.90, lz1=0.20, lx=QX1-0.36;
      m.B("metal", 0.72, 0.86, lz1-lz0, lx, SF+0.43, (lz0+lz1)/2, 0.45, 0, "#8d9498");
      m.B("stairs", 0.78, 0.05, lz1-lz0+0.06, lx, SF+0.885, (lz0+lz1)/2, 0.5, 0, "#a4abae");
      Bn("metal", 0.78, lz1-lz0+0.06, lx, SF+0.885, (lz0+lz1)/2, 0.032, "#a4abae");
      m.col(QX1-0.74, QX1, lz0, lz1, 0, SF+0.92);
      for(const c of [[-1,-1],[1,-1],[-1,1],[1,1]])        // it stands on legs
        m.C("metal", 0.022,0.022,0.14,6, lx+c[0]*0.28, SF+0.07, (lz0+lz1)/2+c[1]*1.42,
            "#6f767a");
      // a twin fryer, the oil long since gone to varnish
      for(let k=0;k<2;k++){
        const fz=lz0+0.52+k*0.44;
        m.B("metal", 0.52, 0.26, 0.38, lx, SF+1.04, fz, 0.45, 0, "#7d8387");
        m.B("rust", 0.48, 0.05, 0.34, lx, SF+1.175, fz, 0.45, 0, "#5a4028");
        m.C("metal", 0.020,0.020,0.30,6, lx-0.34, SF+1.24, fz, "#8d9498", 0, 0, 0.55);
        m.B("metal", 0.22, 0.14, 0.24, lx-0.02, SF+1.26, fz, 0.45, 0, "#9aa1a4");
        for(let i=0;i<4;i++)                               // the basket mesh
          m.P("metal", boxGeo(0.21,0.010,0.010,0), lx-0.02, SF+1.20+i*0.04, fz, 0, "#b8bcbc");
      }
      // a griddle with a trough at the front and forty years of carbon on it
      m.B("metal", 0.60, 0.20, 0.86, lx, SF+1.01, lz0+1.62, 0.45, 0, "#7d8387");
      m.B("bin", 0.50, 0.03, 0.80, lx, SF+1.125, lz0+1.62, 0.45, 0, "#2b2723");
      m.B("metal", 0.09, 0.07, 0.80, lx-0.30, SF+1.08, lz0+1.62, 0, 0, "#6f767a");
      for(let i=0;i<5;i++)
        m.P("grease", planeGeo(0.44, 0.14, 0), lx, SF+1.142, lz0+1.30+i*0.16, i*0.6,
            "#2a231a", -Math.PI/2, 0);
      // a hot dog roller that stopped mid-turn
      m.B("metal", 0.48, 0.24, 0.62, lx, SF+1.03, lz1-0.42, 0.45, 0, "#7d8387");
      for(let i=0;i<6;i++)
        m.C("rust", 0.026,0.026,0.44,10, lx-0.16+i*0.065, SF+1.17, lz1-0.42, "#9c6a3a",
            Math.PI/2, 0, 0);
      m.B("tvglass", 0.02, 0.30, 0.58, lx-0.24, SF+1.20, lz1-0.42, 0, 0, "#20302e");
      // the hood over the lot of it, and the filter nobody ever changed
      m.B("metal", 0.86, 0.44, lz1-lz0+0.20, lx-0.06, SF+1.94, (lz0+lz1)/2, 0.45, 0, "#8d9498");
      m.B("metal", 0.10, 0.50, lz1-lz0+0.20, QX1-0.03, SF+1.52, (lz0+lz1)/2, 0, 0, "#7d8387");
      for(let i=0;i<9;i++)
        m.P("grease", planeGeo(0.27, 0.26, 0), lx-0.28, SF+1.74, lz0+0.28+i*0.31,
            Math.PI/2, "#2a231a", 0, 0);
      m.C("metal", 0.14,0.14,0.90,12, lx-0.06, SF+2.60, lz0+0.40, "#7d8387");
      for(let i=0;i<4;i++)                                 // grease down the wall behind
        m.P("grease", planeGeo(0.16, 1.10, 0), QX1-0.02, SF+0.30, lz0+0.5+i*0.72,
            -Math.PI/2, "#2a231a", 0, 0);
    })();
    // ---- an upright cooler against the west wall, door standing open ----
    (function(){
      const cx2=QX0+0.38, cz2=-1.20;
      m.B("weathered", 0.70, 1.92, 0.76, cx2, SF+0.96, cz2, 0.4, 0, "#b6ada0");
      m.B("weathered", 0.74, 0.14, 0.80, cx2, SF+1.99, cz2, 0.4, 0, "#a89f92");
      m.B("paint", 0.66, 0.30, 0.72, cx2, SF+1.82, cz2, 0, 0, "#8f2c22");     // the header
      for(let r=0;r<4;r++)                                 // empty shelves
        m.B("metal", 0.58, 0.02, 0.66, cx2+0.02, SF+0.34+r*0.40, cz2, 0, 0, "#9aa1a4");
      m.P("tvglass", boxGeo(0.04, 1.54, 0.68, 0), cx2+0.68, SF+0.86, cz2-0.30, 0.55,
          "#20302e");                                       // the door, hanging open
      m.P("metal", boxGeo(0.05, 1.58, 0.05, 0), cx2+0.68, SF+0.86, cz2-0.30, 0.55, "#8d9498");
      m.col(QX0, QX0+0.78, cz2-0.42, cz2+0.42, 0, SF+2.0);
      for(let i=0;i<4;i++)                                  // three cans, one on its side
        m.C("metal", 0.033,0.033,0.11,10, cx2+0.10+((i%2)*0.14), SF+0.36+((i/2)|0)*0.40,
            cz2-0.18+((i%3)*0.16), ["#c8443a","#2f6e8a","#4f7a4a"][i%3], i===3?1.4:0, 0, 0);
    })();
    // ---- a ceiling fan, and the nest on the fitting in the corner -------
    m.C("metal", 0.030,0.030,0.47,8, 0.4, SF+SH-0.235, 0.6, "#6f767a");    // up to the ceiling
    m.C("weathered", 0.13,0.13,0.13,12, 0.4, SF+SH-0.52, 0.6, "#8c8477");
    for(let i=0;i<4;i++)
      m.P("oak", boxGeo(1.00,0.02,0.18,0.5), 0.4+Math.cos(i*1.571)*0.58, SF+SH-0.56,
          0.6+Math.sin(i*1.571)*0.58, -i*1.571, "#6a5236", 0, 0.04);
    for(let i=0;i<11;i++)
      m.P("foliage", boxGeo(0.10,0.012,0.012,0), -3.2+((i*7)%5-2)*0.05, SF+SH-0.19+((i*5)%3)*0.012,
          -0.6+((i*11)%5-2)*0.05, i*1.3, ["#9a8f70","#8a7f63","#7d7357"][i%3], 0, i*0.3);
    // ---- a serving shelf under the hatch, and what got left on it -------
    m.B("oak", SERVE[1]-SERVE[0]-0.4, 0.05, 0.30, 0, HS-0.34, Z1-0.42, 0.5, 0, "#6f6048");
    for(let i=0;i<6;i++)
      m.C("paper", 0.048,0.042,0.055,9, -2.2+i*0.88, HS-0.28, Z1-0.42, "#ddd2b8");
    m.B("metal", 0.26, 0.10, 0.20, 2.5, HS-0.26, Z1-0.42, 0.4, 0.3, "#8d9498");
    // ---- outside: the apron, the bins, the sign that fell ---------------
    m.B("gravel", SW+3.0, 0.05, 2.6, 0, SF-0.03, Z1+1.7, 0.5, 0, "#9a9182");
    m.flat(X0-1.5, X1+1.5, Z1, Z1+3.0, SF-0.02);
    for(let i=0;i<4;i++){                                     // where people queued
      m.C("metal", 0.05,0.06,0.95,8, -3.6+i*2.4, SF+0.45, Z1+1.35, "#6b6156");
      m.col(-3.68+i*2.4, -3.52+i*2.4, Z1+1.27, Z1+1.43, 0, SF+0.95);
    }
    m.B("metal", 8.2, 0.10, 0.14, -0.1, SF+0.92, Z1+1.35, 0, 0, "#6b6156");
    for(const q of [[X0-1.1, Z1+1.2],[X1+1.3, Z1+0.6]]){      // bins, long since full
      m.C("bin", 0.34,0.30,0.84,12, q[0], SF+0.42, q[1], "#4e5a4e");
      m.C("bin", 0.36,0.36,0.05,12, q[0], SF+0.88, q[1], "#3e4a3e");
      m.col(q[0]-0.36, q[0]+0.36, q[1]-0.36, q[1]+0.36, 0, SF+0.9);
    }
    // the SNACK BAR sign, off its bracket and leaning on the wall
    m.B("paint", 2.60, 0.62, 0.08, X0+2.2, SF+0.34, Z1+0.62, 0.4, 0, "#c8bda4");
    m.P("weathered", boxGeo(2.60,0.62,0.05,0), X0+2.2, SF+0.34, Z1+0.66, 0, "#8c8477", 0.22, 0);
    m.C("metal", 0.04,0.04,1.30,6, X0+3.7, SF+0.06, Z1+0.90, "#6b6156", Math.PI/2, 0.5, 0);
    // the roof sign, half its letters off the board
    (function(){
      for(const q of [-3.0, 3.0])
        m.C("metal", 0.06,0.07,1.30,8, q, SF+SH+1.28, Z1+0.10, "#6b6156");
      m.B("paint", 7.40, 1.06, 0.12, 0, SF+SH+1.92, Z1+0.10, 0.4, 0, "#cdc2a8");
      // the letters, minus the two that came off in some wind
      NEON.push(signPanel(7.10, 0.94, signTex(768,102,(x,W,H2)=>{
        x.fillStyle="#a89e88"; x.fillRect(0,0,W,H2);
        x.fillStyle="#b03a2a"; fitSerif(x,"SNACK BAR", W*0.88, H2*0.80, W/2, H2*0.56, "bold");
        x.fillStyle="#a89e88";                          // where two of them used to be
        x.fillRect(W*0.352, 0, W*0.075, H2);
        x.fillRect(W*0.735, 0, W*0.070, H2);
        x.globalAlpha=0.30; x.fillStyle="#6a6052";      // and the ghost they left
        x.fillRect(W*0.356, H2*0.16, W*0.066, H2*0.66);
        x.fillRect(W*0.739, H2*0.16, W*0.061, H2*0.66);
        x.globalAlpha=1;
      }), -206+0, m.y+SF+SH+1.92, -158+Z1+0.18, 0, false));
      for(let i=0;i<6;i++)                             // the fixings the letters left
        m.C("metal", 0.012,0.012,0.05,6, -1.30+((i/3)|0)*4.06+((i%3)-1)*0.16,
            SF+SH+1.92+((i%2)-0.5)*0.30, Z1+0.16, "#6b6156", Math.PI/2, 0, 0);
    })();
    // the restrooms, round the side, which is where they always were
    for(let k=0;k<2;k++){
      const dz=-1.10+k*1.90;
      m.B("weathered", 0.10, 2.04, 0.92, X0-0.06, SF+1.02, dz, 0.5, 0, "#7b7a6e");
      m.B("paint", 0.05, 2.14, 1.06, X0-0.11, SF+1.06, dz, 0.5, 0, "#6d6a5e");
      m.C("metal", 0.030,0.030,0.10,8, X0-0.13, SF+0.96, dz+0.34, "#8d9498", 0,0,Math.PI/2);
      m.B("paint", 0.02, 0.26, 0.20, X0-0.12, SF+1.62, dz, 0, 0, k ? "#7a2a2a" : "#2a3a5a");
      for(let i=0;i<3;i++)                             // rust running out from the hinges
        m.P("rust", streakGeo(0.09, 0.50, 0), X0-0.115, SF+0.70+i*0.42, dz-0.40,
            -Math.PI/2, "#6a3a20", 0, 0);
    }
    m.B("concrete", 1.10, 0.20, 3.60, X0-0.62, SF-0.11, -0.10, 0.45, 0, "#a8a094");
    m.flat(X0-1.15, X0, -2.0, 1.8, SF-0.01);
    // weeds through the cracks in the apron, and the sand that came for it
    for(let i=0;i<26;i++){
      const wx=X0-1.0+((i*2.31)%(SW+3.4)), wz=Z1+0.35+((i*0.97)%2.4);
      for(let k2=0;k2<5+((i*3)%4);k2++){
        const a=((i*7+k2*13)%360)*0.01745, lean=0.35+((k2*5)%4)*0.16, L=0.16+((i*5)%4)*0.09;
        const si=Math.sin(lean), co=Math.cos(lean);
        m.P("foliage", boxGeo(0.018, L, 0.008, 0), wx+Math.sin(a)*si*L/2, SF-0.02+co*L/2,
            wz+Math.cos(a)*si*L/2, a, ((i+k2)%3) ? "#7a7f4e" : "#9a8f70", lean, 0);
      }
    }
    for(let i=0;i<7;i++)                               // and drifts against the wall
      m.P("gravel", new T.SphereGeometry(0.34+((i*5)%3)*0.14,10,6), X1+0.2+((i*1.3)%1.4),
          SF-0.24, -2.6+i*0.86, i*0.7, "#c2a878", 0, 0);
    m.rect(X0-4, X1+4, Z0-4, Z1+5, "THE SNACK BAR");
    addZone(-206+QX0, -206+QX1, -158+QZ0, -158+QZ1, m.y+SF-0.3, m.y+SF+SH,
            "THE SNACK BAR", true);
  })();

  /* --- a fence that stops mattering halfway ---------------------------- */
  (function(){
    const m=mk(74, 246);
    for(let i=-14;i<=14;i++){
      const px=i*3.1, lean=((i*13)%7-3)*0.05, py=Terrain.groundAt(74+px,246)-m.y;
      if(i>7 && (i%2)) continue;                                       // posts missing
      m.C("oak", 0.07,0.09,1.45,6, px,py+0.68,0, "#5b4632", 0,0,lean);
      if(i<14) for(const wy of [0.55,0.95,1.28])
        m.P("metal", boxGeo(3.1,0.012,0.012,0), px+1.55,py+wy-0.03,0, 0, "#7d7466",
            0, ((i*5)%5-2)*0.01);
    }
    m.P("paint", new T.SphereGeometry(0.22,10,8), 22.0,0.18,1.4, 0.7, "#ded6c0");  // a skull
    m.P("paint", new T.CylinderGeometry(0.05,0.07,0.52,7), 22.2,0.30,1.1, 0, "#ded6c0", 1.2, 0.6);
    m.P("paint", new T.CylinderGeometry(0.05,0.07,0.52,7), 21.8,0.30,1.1, 0, "#ded6c0", 1.2,-0.6);
    m.zone(16, "A FENCE LINE");
  })();

  /* --- two-track roads, so the desert has a grain to it ----------------
     REACH, and why most of these now stop in the middle of nowhere.
     Every landmark out here used to sit on the end of its own graded line
     running back to the highway, and from the air that turns the desert
     into a map with the answers printed on it: the graves, the camp, the
     trailer, the mast — each one had an arrow pointing at it from four
     hundred metres away, so nothing was ever found, only followed.
     A track now gets a `reach`: the fraction of the run that was ever
     maintained. Past three quarters of that it narrows away to a pair of
     wheel marks and then to nothing, which is what a ranch road does when
     whoever needed it stopped needing it. The two places that were
     businesses on this road — the filling station and the drive-in — keep
     a way in all the way to the door, because a business has to be
     reachable. Everything else you have to go and look for.             */
  function dirtTrack(x0,z0,x1,z1,w,reach){
    const R=(reach===undefined)?1:reach;
    const dx=x1-x0, dz=z1-z0, L0=Math.hypot(dx,dz), L=L0*R;
    const n=Math.max(2,Math.round(L/5));
    const ux=dx/L0, uz=dz/L0, px=-uz, pz=ux, yaw=Math.atan2(-ux,-uz), seg=L/n+1.0;
    for(let i=0;i<n;i++){
      const t=(i+0.5)/n, wob=Math.sin(t*8.1+x0*0.013)*w*0.9+Math.sin(t*19.7)*w*0.3;
      const x=x0+dx*t*R+px*wob, z=z0+dz*t*R+pz*wob;
      const tw=w*(t<0.74 ? 1 : Math.max(0.10, 1-(t-0.74)/0.26*0.94));
      const g=new T.PlaneGeometry(tw, seg), a=g.attributes.uv;
      for(let k=0;k<a.count;k++) a.setXY(k, a.getX(k), a.getY(k)*seg/3.2);
      a.needsUpdate=true;
      push("track", g, x, Terrain.groundAt(x,z)+0.04, z, yaw, "#ffffff", -Math.PI/2, 0);
    }
  }
  const TRK=-56;                                     // just off the highway shoulder
  dirtTrack(-118,TRK, -145,-359, 3.1);               // in to the filling station
  dirtTrack(-173,-74, -173,-182, 4.2);               // the long run in to the drive-in
  // and these go out into the country and give up partway, which is the
  // only honest reason for a road in a place where nobody lives
  dirtTrack(  42,TRK,  176,-433, 3.0, 0.46);
  dirtTrack(  12,TRK,    0,-528, 2.6, 0.38);
  dirtTrack(-378,TRK, -517,-222, 2.6, 0.30);
  dirtTrack(-232,TRK, -356,-246, 2.8, 0.34);
  dirtTrack( 232,TRK,  298,-212, 2.4, 0.55);         // to nothing whatsoever
  dirtTrack(-452,TRK, -470,-320, 2.2, 0.42);         // nor this one
