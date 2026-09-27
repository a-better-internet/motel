"use strict";
/* LOW DESERT MOTEL · 14d-diner.js
   a streamline diner car, nine hundred metres east down the highway
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* Continues 14-desert.js; uses the G / mk / mkPi defined there. */

/* ----------------------------------------------------------------------
   11d · THE DINER CAR
   A prefabricated diner, built like a railway carriage and trucked out here
   on a lowboy: a rounded box with a barrel roof, a clerestory monitor along
   the top of it, fluted stainless above and below a band of windows, and a
   glazed checkerboard skirt round the bottom. It has been shut long enough
   that the desert has taken the apron back and the roof is under an inch of
   blown sand.

   Everything is built in the car's own frame — x along its length, z across
   it — and the frame is turned to face the road at the end.
   ---------------------------------------------------------------------- */
(function dinerCar(){
  const D=Terrain.DINER;
  const m=mk(D.x, D.z);
  const L=15.2, W=4.60, HL=L/2, HW=W/2;      // length, width, and the halves
  const FY=0.62;                              // floor, above the apron
  const SK=0.86;                              // top of the tile skirt
  const CH=2.96;                              // top of the wall, under the cornice
  const CT=3.26;                              // top of the cornice band
  const RR=2.34;                              // the barrel roof's radius
  const STL="#b3b8b0", STLD="#9aa09a", CRM="#c8c2b1", RUSTD="#7a4526";
  const DARKM="#4e5450";

  /* ---- the apron it was dropped on -------------------------------------- */
  {
    const cap=new T.CircleGeometry(D.r, 40), uv=cap.attributes.uv;
    for(let i=0;i<uv.count;i++) uv.setXY(i, uv.getX(i)*D.r, uv.getY(i)*D.r);
    m.P("concrete", cap, 0, 0.03, 0, 0, "#7c7360", -Math.PI/2, 0);
    m.flat(-D.r, D.r, -D.r, D.r, 0.03);
    let sd=7717; const r2=()=>{ sd=(sd*1103515245+12345)%2147483648; return sd/2147483648; };
    let lay=0;
    const dec=(w,h,rr,a,ry,c)=>m.P("concrete", planeGeo(w,h,0.5), Math.cos(a)*rr,
        0.034+(lay++)*0.0004, Math.sin(a)*rr, ry, c, -Math.PI/2, 0);
    for(let i=0;i<16;i++) dec(3.0+r2()*4.0, 1.0+r2()*1.6, r2()*(D.r-2), r2()*6.283,
                              0.3+(r2()-0.5)*0.4, "#877c66");
    for(let i=0;i<12;i++) dec(2.0+r2()*3.4, 1.6+r2()*2.4, r2()*(D.r-3), r2()*6.283,
                              r2()*6.283, "#6b6353");
    for(let i=0;i<20;i++) dec(0.08+r2()*0.08, 2.0+r2()*4.0, 1.5+r2()*(D.r-3),
                              r2()*6.283, r2()*6.283, "#56503f");
    for(let i=0;i<10;i++){                    // weeds through the cracks
      const a=r2()*6.283, rr=3+r2()*(D.r-4);
      for(let k=0;k<5;k++)
        m.C("foliage", 0.009,0.015,0.16+r2()*0.22,4, Math.cos(a)*rr+(r2()-0.5)*0.3, 0.12,
            Math.sin(a)*rr+(r2()-0.5)*0.3, r2()<0.5?"#7d7448":"#6d7048",
            (r2()-0.5)*0.5, k*1.3, (r2()-0.5)*0.4);
    }
  }

  /* ---- the plinth the car sits on --------------------------------------- */
  m.B("concrete", L+0.5, FY, W+0.5, 0, FY/2, 0, 0.5, 0, "#9a9182");
  for(let i=0;i<9;i++)                         // and the blocks under the ends
    m.B("concrete", 0.46, FY+0.06, 0.46, -HL+0.5+i*(L-1)/8, (FY+0.06)/2,
        (i%2?1:-1)*(HW-0.55), 0.5, 0, "#8d8474");

  /* ---- the shell --------------------------------------------------------
     A diner car has no square corners: the walls turn through a quarter
     circle at each end. Flat boxes for the long runs, a quarter cylinder at
     each corner, and the same profile repeated for the skirt, the wall, the
     cornice and the roof so the silhouette stays one shape all the way up. */
  const CR=0.80;                               // corner radius
  const band=(bk, y0, y1, col, inset, uv)=>{
    const h=y1-y0, cy=(y0+y1)/2, ix=inset||0;
    m.B(bk, (L-CR*2)-ix*2, h, W-ix*2, 0, cy, 0, uv===undefined?0.5:uv, 0, col);
    for(const sx of [-1,1])
      m.B(bk, CR*2-ix*2, h, W-CR*2-ix*2, sx*(HL-CR), cy, 0, uv===undefined?0.5:uv, 0, col);
    for(const sx of [-1,1]) for(const sz of [-1,1])
      m.C(bk, CR-ix, CR-ix, h, 14, sx*(HL-CR), cy, sz*(HW-CR), col, 0, 0, 0);
  };
  band("dinertile", 0.02, SK, "#ffffff", 0, 1.9);          // the glazed skirt
  m.B("metal", L+0.12, 0.10, W+0.12, 0, SK+0.05, 0, 0.4, 0, STL);   // its capping
  for(const sx of [-1,1]) for(const sz of [-1,1])
    m.C("metal", CR+0.06, CR+0.06, 0.10, 14, sx*(HL-CR), SK+0.05, sz*(HW-CR), STL);

  // the wall: fluted stainless below the glass, and again above it
  band("galv", SK+0.10, 1.34, CRM, 0.03, 2.6);
  band("galv", 2.40, CH,     CRM, 0.03, 2.6);
  // the cornice: a deeper band with vertical ribs cut into it
  band("metal", CH, CT, STLD, -0.04, 0.6);
  for(let i=0;i<64;i++){                       // the ribs, round three sides
    const t=i/64, px=-HL+0.3+t*(L-0.6);
    for(const sz of [-1,1])
      m.B("metal", 0.05, CT-CH-0.06, 0.05, px, (CH+CT)/2, sz*(HW+0.02), 0, 0, "#8a918b");
  }
  /* The shell's collider is four walls with a hole in one of them, not one
     box round the lot — wrapped whole it seals its own front door. */
  const DOORW0=1.24, DX0=1.9;                  // (the entry, repeated up here)
  m.col(-HL-0.2, HL+0.2,  HW-0.2, HW+0.2, 0, CT);           // the back
  for(const sx of [-1,1])
    m.col(sx*HL-0.2*sx-0.2, sx*HL+0.2, -HW-0.2, HW+0.2, 0, CT);   // the two ends
  m.col(-HL-0.2, DX0-DOORW0/2, -HW-0.2, -HW+0.2, 0, CT);    // and the road side,
  m.col(DX0+DOORW0/2, HL+0.2, -HW-0.2, -HW+0.2, 0, CT);     // either side of the door
  // the header, measured from the FLOOR — at 2.10 above the apron it was
  // 1.5 m above a floor that is itself 0.63 up, i.e. through the doorway
  m.col(DX0-DOORW0/2, DX0+DOORW0/2, -HW-0.2, -HW+0.2, FY+2.06, CT);

  /* ---- the window band --------------------------------------------------
     The road side is one long run of glass; the back has two small ones over
     the kitchen and the ends have a single light each.                    */
  const GY0=1.34, GY1=2.40;
  const glassRun=(x0,x1,z,ry)=>{
    m.B("glass", x1-x0, GY1-GY0, 0.05, (x0+x1)/2, (GY0+GY1)/2, z, 0, ry||0, "#5f6f70");
    m.B("metal", x1-x0+0.10, 0.07, 0.11, (x0+x1)/2, GY0+0.02, z, 0, ry||0, STL);
    m.B("metal", x1-x0+0.10, 0.07, 0.11, (x0+x1)/2, GY1-0.02, z, 0, ry||0, STL);
  };
  const DOORW=1.24, DX=1.9;                     // the entry, off centre
  // south face (the road side): glass either side of the door
  glassRun(-HL+CR, DX-DOORW/2-0.12, -HW+0.02);
  glassRun(DX+DOORW/2+0.12, HL-CR,  -HW+0.02);
  for(let i=0;i<11;i++){                        // mullions
    const px=-HL+CR+0.1+i*((DX-DOORW/2-0.12)-(-HL+CR))/11;
    if(px>DX-DOORW/2-0.3) continue;
    m.B("metal", 0.07, GY1-GY0, 0.13, px, (GY0+GY1)/2, -HW+0.02, 0, 0, STL);
  }
  for(let i=0;i<5;i++)
    m.B("metal", 0.07, GY1-GY0, 0.13, DX+DOORW/2+0.3+i*1.02, (GY0+GY1)/2, -HW+0.02,
        0, 0, STL);
  // north face: two over the kitchen end, smaller and higher
  for(const px of [-4.6,-2.4])
    m.B("glass", 1.70, 0.86, 0.05, px, 1.94, HW-0.02, 0, 0, "#5f6f70");
  // and one light in each end wall
  for(const sx of [-1,1])
    m.B("glass", 0.05, 0.92, 1.50, sx*(HL-0.02), 1.90, 0, 0, 0, "#5f6f70");

  /* ---- the barrel roof and its monitor ---------------------------------- */
  {
    const seg=[];
    for(let i=0;i<=20;i++){                     // a half cylinder, capped
      const a=Math.PI*(i/20);
      seg.push([Math.cos(a)*(HW+0.06), Math.sin(a)*RR*0.52]);
    }
    for(let i=0;i<20;i++){
      const p0=seg[i], p1=seg[i+1];
      const w=Math.hypot(p1[0]-p0[0], p1[1]-p0[1]);
      m.B("roof", L+0.16, 0.10, w, 0, CT+(p0[1]+p1[1])/2, (p0[0]+p1[0])/2, 0.5,
          0, (i%3) ? "#6b6258" : "#645c52",
          Math.atan2(p1[1]-p0[1], p1[0]-p0[0])+Math.PI/2);
    }
    for(const sx of [-1,1]){                    // the ends of the barrel
      // half a disc, because the barrel is half a cylinder — a full circle
      // hangs a metre of roof down through the wall below it
      const cp=new T.CircleGeometry(RR*0.52, 22, 0, Math.PI);
      m.P("roof", cp, sx*(HL+0.05), CT, 0, sx>0?Math.PI/2:-Math.PI/2, "#6b6258", 0, 0);
    }
    for(let i=0;i<26;i++)                       // sand and leaf litter on top
      m.P("soot", planeGeo(1.4+((i*7)%4)*0.9, 0.9+((i*5)%3)*0.5, 0),
          -HL+0.6+((i*2.31)%(L-1.2)), CT+RR*0.52+0.03, ((i*5)%7-3)*0.28,
          i*1.1, ["#a1957a","#8d8268","#b0a488"][i%3], -Math.PI/2, 0);
    // the clerestory monitor: a long low box riding the crown
    const MY=CT+RR*0.52;
    m.B("metal", L-3.2, 0.62, 2.30, 0, MY+0.31, 0, 0.5, 0, "#6f756f");
    m.B("metal", L-3.0, 0.10, 2.46, 0, MY+0.66, 0, 0.4, 0, "#5e645f");
    for(const sx of [-1,1]){                    // the louvred vent in each end
      m.B("bin", 0.06, 0.40, 0.74, sx*((L-3.2)/2-0.02), MY+0.32, 0, 0, 0, "#2b2f2e");
      for(let i=0;i<5;i++)
        m.B("metal", 0.08, 0.04, 0.70, sx*((L-3.2)/2+0.03), MY+0.16+i*0.08, 0,
            0, 0, "#878d87");
    }
    for(let i=0;i<8;i++)                        // rivet lines down the monitor
      for(const sz of [-1,1])
        m.B("metal", L-3.6, 0.03, 0.03, 0, MY+0.14+i*0.07, sz*1.16, 0, 0, "#7d837e");
    // the flue cluster, and a vent cowl beside it
    for(let i=0;i<4;i++)
      m.C("metal", 0.055,0.055, 0.95+((i*5)%3)*0.28, 8, -5.4+i*0.34, MY+1.16, 1.5,
          i%2?"#6e746f":RUSTD, ((i*7)%5-2)*0.03, 0, ((i*3)%5-2)*0.03);
    m.C("metal", 0.26,0.30,0.44,12, 4.3, MY+0.90, 1.2, "#6e746f");
    m.C("metal", 0.34,0.34,0.10,12, 4.3, MY+1.16, 1.2, "#5e645f");
  }

  /* ---- the roof sign ----------------------------------------------------- */
  {
    const SY=CT+RR*0.52+1.06;
    for(const sx of [-1,1])
      m.C("metal", 0.055,0.065, 1.30, 8, sx*2.2, SY-0.65+0.10, -0.3, DARKM,
          0.05*sx, 0, 0.03*sx);
    m.B("metal", 6.40, 0.62, 0.16, 0, SY+0.22, -0.3, 0.4, 0, "#8d8478");
    m.B("metal", 6.52, 0.07, 0.22, 0, SY+0.55, -0.3, 0.4, 0, "#7a7266");
    m.B("metal", 6.52, 0.07, 0.22, 0, SY-0.11, -0.3, 0.4, 0, "#7a7266");
    const tex=hosted("dinerSign", signTex(768, 176, (x,W2,H2)=>{
      x.fillStyle="#a89f90"; x.fillRect(0,0,W2,H2);
      const g=x.createLinearGradient(0,0,0,H2);
      g.addColorStop(0,"rgba(255,255,255,0.20)"); g.addColorStop(1,"rgba(0,0,0,0.26)");
      x.fillStyle=g; x.fillRect(0,0,W2,H2);
      x.fillStyle="#3a352c";
      fitText(x, "ROXIE'S DINER", W2*0.86, 112, W2/2, H2*0.54);
      x.globalAlpha=0.5; x.fillStyle="#a89f90";      // and the half of it that is gone
      for(let i=0;i<34;i++) x.fillRect(Math.random()*W2, Math.random()*H2,
                                       5+Math.random()*26, 3+Math.random()*18);
      x.globalAlpha=1;
      for(let i=0;i<60;i++){
        x.fillStyle="rgba(78,58,38,"+(0.05+Math.random()*0.20).toFixed(2)+")";
        x.fillRect(Math.random()*W2, Math.random()*H2, 2+Math.random()*12,
                   2+Math.random()*9);
      }
    }), {aspect:768/176});
    for(const sd of [-1,1])
      NEON.push(signPanel(6.30, 1.444, tex, D.x, m.y+SY+0.22, D.z-0.3+sd*0.10,
                          sd>0 ? 0 : Math.PI, true));
  }

  /* ---- the entry --------------------------------------------------------- */
  {
    const Z=-HW;
    m.B("metal", DOORW+0.34, CH-SK-0.10, 0.30, DX, (SK+0.10+CH)/2, Z-0.06, 0.4, 0, STLD);
    m.B("metal", DOORW+0.50, 0.16, 0.44, DX, CH+0.02, Z-0.10, 0.4, 0, STL);
    for(const q of [-1,1])                       // the jambs, standing proud
      m.B("metal", 0.14, CH-SK-0.10, 0.40, DX+q*(DOORW/2+0.10), (SK+0.10+CH)/2, Z-0.11,
          0.4, 0, STL);
    // three concrete steps, cracked, with the rail that is left
    for(let i=0;i<3;i++){
      const sy=0.20+i*0.20, sz0=Z-0.52-i*0.22;
      m.B("concrete", 1.90-i*0.16, 0.20, 0.52+i*0.30, DX, sy-0.10, sz0,
          0.5, 0, i?"#9a9182":"#8d8474");
      // a tread to stand on, or the step is only something to walk into
      m.flat(DX-(1.90-i*0.16)/2, DX+(1.90-i*0.16)/2,
             sz0-(0.52+i*0.30)/2, sz0+(0.52+i*0.30)/2, sy);
    }
    // the sill has to reach the interior floor's own edge at IZ0, or there is
    // a hand's width of threshold that drops you back onto the apron
    m.flat(DX-0.7, DX+0.7, Z-0.34, Z+0.30, FY+0.012);
    m.C("metal", 0.030,0.030,0.94,8, DX+0.92, 0.66, Z-0.62, "#7d837e");
    m.C("metal", 0.030,0.030,0.62,8, DX+0.92, 1.10, Z-0.34, "#7d837e", 0, 0, 1.15);
    // makeDoor's frame origin is the hinge; the leaf hangs half its own width
    // across from it, and the leaf centre is what the door probe walks. Shift
    // the frame by that half width so the opening lands on DX, where the hole
    // in the wall collider and the steps below it already are.
    makeDoor(XF(D.x+DX+0.49, D.z+Z-0.03, Math.PI), 0, m.y+FY-0.02, 0,
             "ROXIE'S DINER", true, 0.42, "booth");
  }

  /* ---- what forty years in the sun does to stainless ---------------------- */
  for(let i=0;i<26;i++){                          // rust weeping from the seams
    const px=-HL+0.8+((i*2.17)%(L-1.6)), sz=(i%2)?1:-1;
    m.P("rust", planeGeo(0.20+((i*5)%3)*0.10, 0.70+((i*7)%4)*0.55, 0),
        px, CH-0.30, sz*(HW+0.09), sz>0?0:Math.PI, "#7c4526", 0, 0);
  }
  for(const sz of [-1,1])                          // the dirt line off the apron
    m.P("soot", planeGeo(L-1.4, 0.44, 0), 0, SK+0.26, sz*(HW+0.09),
        sz>0?0:Math.PI, "#6d6455", 0, 0);
  for(let i=0;i<7;i++){                            // sand banked against the ends
    const g=blobGeo(0.60+((i*5)%3)*0.26); g.scale(1.5, 0.22, 1.0);
    m.P("sand", g, (i<4?-1:1)*(HL+0.18+((i*3)%3)*0.14), 0.06,
        -1.6+((i*7)%5)*0.8, i*0.9, "#b09b79", 0, 0);
  }
  m.zone(D.r+5, "ROXIE'S DINER");

  /* ======================================================================
     INSIDE
     One long room. The counter runs down the kitchen side with the stools
     in front of it and the quilted panel behind; the booths take the window
     side. The kitchen is walled off at the west end behind a door with a
     porthole in it.
     ====================================================================== */
  const IX0=-HL+0.22, IX1=HL-0.22, IZ0=-HW+0.22, IZ1=HW-0.22;
  const KX=-4.10;                                  // the kitchen bulkhead
  const RED="#8e3a32", REDD="#6e2c26", CREAM2="#cfc6ae", WOOD="#5a4a34";

  m.P("hexfloor", planeGeo(IX1-IX0, IZ1-IZ0, 1.3), (IX0+IX1)/2, FY+0.012, 0, 0,
      "#b8b2a4", -Math.PI/2, 0);
  m.flat(IX0, IX1, IZ0, IZ1, FY+0.012);
  m.voidAt(IX0, IX1, IZ0, IZ1, FY-1.0, FY+CH, FY+0.012);

  // the ceiling: ribbed metal, curved a little where the barrel starts
  for(let i=0;i<16;i++){
    const t=(i+0.5)/16, pz=IZ0+(IZ1-IZ0)*t;
    const drop=Math.cos((t-0.5)*Math.PI)*0.16;
    m.B("metal", IX1-IX0, 0.05, (IZ1-IZ0)/16+0.02, (IX0+IX1)/2, CH-0.16+drop, pz,
        0.5, 0, (i%2)?"#4a504c":"#434845");
  }
  // the ribs hang BELOW the boards — at CH-0.24 they were behind them, which
  // is why the ceiling read as one flat slab
  for(let i=0;i<11;i++)
    m.B("metal", 0.09, 0.11, IZ1-IZ0, IX0+0.8+i*((IX1-IX0)-1.6)/10, CH-0.34, 0,
        0.4, 0, "#8d948e");
  for(let i=0;i<24;i++)                             // damp and soot up there
    m.P("soot", planeGeo(0.7+((i*5)%3)*0.5, 0.5+((i*3)%3)*0.4, 0),
        IX0+0.7+((i*1.87)%(IX1-IX0-1.4)), CH-0.27, ((i*7)%9-4)*0.42,
        i*1.1, "#4a4237", Math.PI/2, 0);

  /* ---- the walls --------------------------------------------------------- */
  // the quilted panel behind the counter, which is the thing you see first
  m.P("quilt", planeGeo(IX1-KX-0.3, 1.34, 3.1), (KX+IX1)/2+0.15, FY+1.52, IZ1-0.03,
      Math.PI, "#ffffff", 0, 0);
  m.B("metal", IX1-KX-0.3, 0.07, 0.09, (KX+IX1)/2+0.15, FY+0.84, IZ1-0.04, 0.4, 0, STL);
  m.B("metal", IX1-KX-0.3, 0.07, 0.09, (KX+IX1)/2+0.15, FY+2.20, IZ1-0.04, 0.4, 0, STL);
  // vertical boarding on the window side and the ends, below the glass
  for(const w of [[IZ0+0.03, 0, IX0, IX1],[0,0,0,0]]){
    if(w[2]===w[3]) continue;
    m.P("plank", planeGeo(w[3]-w[2], GY0-FY-0.05, 1.7), (w[2]+w[3])/2,
        FY+(GY0-FY)/2, w[0], 0, WOOD, 0, 0);
  }
  for(const sx of [IX0+0.03, IX1-0.03])
    m.P("plank", planeGeo(IZ1-IZ0, 1.05, 1.5), sx, FY+1.90, 0,
        sx<0 ? Math.PI/2 : -Math.PI/2, WOOD, 0, 0);
  // and the dado rail that stops the boarding
  m.B("oak", IX1-IX0, 0.07, 0.05, (IX0+IX1)/2, FY+(GY0-FY)-0.02, IZ0+0.05, 0.4, 0, "#6d5a3e");

  /* ---- the kitchen bulkhead and its porthole door ------------------------ */
  m.B("plank", 0.14, CH-FY-0.20, IZ1-IZ0, KX, FY+(CH-FY-0.20)/2, 0, 0.5, 0, WOOD);
  m.col(KX-0.12, KX+0.12, IZ0, IZ1-1.30, 0, FY+CH);
  m.B("metal", 0.10, 2.02, 0.94, KX+0.02, FY+1.01, IZ1-0.78, 0.4, 0, "#8d938d");
  m.C("bin", 0.19,0.19,0.13,16, KX+0.10, FY+1.52, IZ1-0.78, "#22262a", 0, 0, Math.PI/2);
  m.C("glass", 0.155,0.155,0.14,16, KX+0.11, FY+1.52, IZ1-0.78, "#3d4a48", 0, 0, Math.PI/2);
  m.B("metal", 0.05, 0.26, 0.05, KX+0.13, FY+0.98, IZ1-1.16, 0, 0, STL);
  // a strip of kitchen visible past it: shelving and a range hood
  m.B("metal", 3.20, 0.06, 0.70, KX-1.7, FY+0.92, IZ1-0.60, 0.4, 0, "#7d837e");
  m.B("metal", 3.20, 0.06, 0.70, KX-1.7, FY+1.62, IZ1-0.60, 0.4, 0, "#7d837e");
  for(let i=0;i<7;i++)
    m.C("plaster", 0.055,0.048,0.11,10, KX-3.1+i*0.42, FY+0.99, IZ1-0.60, "#cfc6ae");
  m.B("metal", 2.20, 0.46, 0.80, KX-2.2, FY+2.30, IZ1-0.62, 0.4, 0, "#8d938d");

  /* ---- the counter ------------------------------------------------------- */
  const CZ=IZ1-1.42, CX0=KX+0.55, CX1=IX1-0.9, CY=FY+1.02;
  m.B("dinertile", CX1-CX0, CY-FY-0.10, 0.86, (CX0+CX1)/2, FY+(CY-FY-0.10)/2, CZ,
      1.8, 0, "#ffffff");                            // the checkerboard front
  for(let i=0;i<5;i++)                               // fluted stainless at the foot
    m.B("metal", CX1-CX0, 0.045, 0.90, (CX0+CX1)/2, FY+0.04+i*0.055, CZ, 0.4, 0,
        i%2?"#8d938d":"#7d837e");
  m.B("track", CX1-CX0+0.14, 0.09, 1.02, (CX0+CX1)/2, CY, CZ, 1.4, 0, "#9a9382");
  m.C("metal", 0.055,0.055, CX1-CX0+0.14, 20, (CX0+CX1)/2, CY+0.01, CZ-0.51, STL,
      0, 0, Math.PI/2);                              // the bullnose edge
  m.col(CX0-0.1, CX1+0.1, CZ-0.52, CZ+0.46, 0, CY);
  // the back counter under the quilted panel
  m.B("metal", CX1-CX0, 0.86, 0.52, (CX0+CX1)/2, FY+0.43, IZ1-0.30, 0.45, 0, "#6e746f");
  m.B("track", CX1-CX0, 0.07, 0.58, (CX0+CX1)/2, FY+0.89, IZ1-0.30, 1.4, 0, "#8d8676");
  for(let i=0;i<6;i++)                               // its doors
    m.B("bin", (CX1-CX0)/6-0.06, 0.74, 0.03, CX0+((CX1-CX0)/6)*(i+0.5), FY+0.45,
        IZ1-0.56, 0, 0, "#555b56");
  for(let i=0;i<2;i++)                               // two shelves of crockery
    m.B("oak", CX1-CX0-0.8, 0.05, 0.24, (CX0+CX1)/2, FY+1.72+i*0.40, IZ1-0.18,
        0.4, 0, "#4a3d2c");
  for(let i=0;i<16;i++){
    const px=CX0+0.5+((i*1.31)%(CX1-CX0-1.2));
    const g=blobGeo(0.075); g.scale(1, 0.55, 1);
    m.P("plaster", g, px, FY+1.79+((i%2)?0.40:0), IZ1-0.18, i, "#a99f88", 0, 0);
  }
  // a boomerang clock on the quilted wall, and the menu board over the pass
  m.P("bin", planeGeo(0.92, 0.30, 0), CX0+2.4, FY+2.36, IZ1-0.05, Math.PI,
      "#4a3f33", 0, 0.22);
  m.C("bin", 0.17,0.17,0.06,18, CX0+3.0, FY+2.40, IZ1-0.08, "#2b3230", 0, 0, Math.PI/2);
  m.C("plaster", 0.145,0.145,0.03,18, CX0+3.0, FY+2.40, IZ1-0.10, "#b8b2a0", 0, 0, Math.PI/2);
  m.P("bin", planeGeo(1.90, 0.72, 0), KX+2.0, FY+2.34, IZ1-0.06, Math.PI, "#23282a", 0, 0.05);
  for(let i=0;i<5;i++)
    m.P("chalk", planeGeo(1.30-((i*5)%3)*0.25, 0.055, 0), KX+1.85, FY+2.56-i*0.115,
        IZ1-0.08, Math.PI, "#cfc8b4", 0, 0.05);

  /* ---- the stools -------------------------------------------------------- */
  for(let i=0;i<8;i++){
    const px=CX0+0.62+i*((CX1-CX0)-1.3)/7, over=(i===2||i===6);
    const sz=CZ-0.92;
    if(over){                                        // two of them went over
      m.C("metal", 0.055,0.055,0.62,10, px+0.30, FY+0.16, sz-0.34, "#7d837e",
          Math.PI/2, 0.6, 0);
      m.C("metal", 0.20,0.20,0.05,14, px+0.30, FY+0.16, sz-0.62, "#6e746f", Math.PI/2, 0.6, 0);
      m.C("fabric", 0.19,0.19,0.13,16, px+0.30, FY+0.17, sz-0.05, RED, Math.PI/2, 0.6, 0);
      continue;
    }
    m.C("metal", 0.175,0.20,0.045,16, px, FY+0.022, sz, "#6e746f");   // the foot
    m.C("metal", 0.055,0.055,0.60,10, px, FY+0.33, sz, "#7d837e");
    m.P("metal", new T.TorusGeometry(0.19,0.016,5,14), px, FY+0.24, sz, 0,
        "#7d837e", Math.PI/2, 0);                                     // the foot ring
    m.C("metal", 0.115,0.115,0.05,14, px, FY+0.645, sz, STL);
    m.C("fabric", 0.205,0.205,0.115,18, px, FY+0.725, sz, (i%3)?RED:REDD);
    m.C("metal", 0.208,0.208,0.03,18, px, FY+0.672, sz, "#8d938d");   // the chrome ring
  }

  /* ---- the booths -------------------------------------------------------- */
  for(let i=0;i<4;i++){
    const bx0=IX0+0.55+i*3.05;
    if(bx0+2.5>DX-DOORW/2-0.2 && bx0<DX+DOORW/2+0.2) continue;   // not across the door
    const zb=IZ0+0.62;
    for(const q of [0,1]){                           // two benches facing each other
      const px=bx0+q*2.20;
      m.B("fabric", 0.60, 0.42, 1.26, px, FY+0.42, zb+0.30, 0.6, 0, (i%2)?RED:REDD);
      m.B("fabric", 0.22, 0.74, 1.26, px+(q?0.22:-0.22), FY+0.98, zb+0.30, 0.6, 0,
          (i%2)?RED:REDD);
      m.B("fabric", 0.24, 0.30, 1.20, px+(q?0.21:-0.21), FY+1.16, zb+0.30, 0.6, 0, CREAM2);
      m.B("metal", 0.30, 0.06, 1.30, px, FY+1.40, zb+0.30, 0.4, 0, "#8d938d");
      m.B("bin", 0.62, 0.12, 1.30, px, FY+0.16, zb+0.30, 0.4, 0, "#3a3f3c");
      // addSeat takes (x, z, y), not (x, y, z)
      addSeat(D.x+px, D.z+zb+0.30, m.y+FY+0.44, Math.PI/2*(q?1:-1), "A BOOTH", false);
    }
    m.B("track", 1.46, 0.06, 1.16, bx0+1.10, FY+0.74, zb+0.30, 1.3, 0, "#8d8676");
    m.C("metal", 0.075,0.075,0.72,10, bx0+1.10, FY+0.36, zb+0.30, "#7d837e");
    m.C("metal", 0.22,0.22,0.04,14, bx0+1.10, FY+0.03, zb+0.30, "#6e746f");
    // the blind over the window above it, half down and buckled
    for(let k=0;k<9;k++)
      m.B("metal", 2.30, 0.035, 0.03, bx0+1.10, GY1-0.10-k*0.075, IZ0+0.07,
          0, ((k*7)%5-2)*0.012, "#a49c8c");
  }

  /* ---- the lamps, and what is still on the tables ------------------------- */
  for(let i=0;i<5;i++){
    const px=IX0+1.5+i*((IX1-IX0)-3.0)/4;
    // the shade has to hang BELOW the boards: at FY+2.18 it was inside the
    // ceiling, which is why none of the five ever showed
    m.C("metal", 0.020,0.020,0.30, 8, px, FY+2.16, -0.5, "#6e746f");
    m.C("lampshade", 0.27,0.10,0.18,16, px, FY+1.93, -0.5, "#cfc6ae");
    m.lamp(px, FY+1.82, -0.5, {color:0xffe2a8, intensity:0.13, dist:5.2, decay:1.7,
                               indoor:true, flicker:(i===3),
                               // vol is read as [x0,x1,z0,z1,y0,y1] and mk's wx
                               // ADDS where mkPi's subtracts, so these go in
                               // min-first — reversed, the test never passes
                               // and the lamp never lights
                               vol:[m.wx(IX0,0), m.wx(IX1,0), m.wz(0,IZ0), m.wz(0,IZ1),
                                    m.y, m.y+FY+CH]});
  }
  for(let i=0;i<34;i++)                              // paper, and what blew in
    m.P("paper", planeGeo(0.16+((i*5)%3)*0.07, 0.22+((i*7)%3)*0.06, 0),
        IX0+0.6+((i*2.13)%(IX1-IX0-1.2)), FY+0.016+i*0.0009,
        IZ0+0.5+((i*1.37)%(IZ1-IZ0-1.0)), i*1.3, "#cec7b0", -Math.PI/2, 0);
  for(let i=0;i<9;i++){                              // cups and a bottle or two
    const px=CX0+0.7+((i*1.91)%(CX1-CX0-1.4));
    m.C("plaster", 0.048,0.040,0.095,12, px, CY+0.09, CZ-0.16, "#c6bda6");
    if(i%3===0) m.C("glass", 0.036,0.030,0.22,10, px+0.22, CY+0.15, CZ+0.04, "#6a5a3a");
  }
  m.C("metal", 0.17,0.15,0.40,14, CX0+0.5, CY+0.24, CZ+0.14, "#8d938d");   // the urn
  m.C("metal", 0.19,0.19,0.05,14, CX0+0.5, CY+0.46, CZ+0.14, "#7d837e");
  m.P("metal", boxGeo(0.44,0.30,0.30,0.4), CX1-1.1, CY+0.19, CZ+0.10, 0.4, "#6e746f",
      -1.35, 0);                                     // one that went over
  for(let i=0;i<11;i++)                              // broken glass under the window
    m.P("glass", planeGeo(0.09+((i*5)%3)*0.05, 0.07+((i*3)%3)*0.04, 0),
        IX0+1.0+((i*2.7)%(IX1-IX0-2.0)), FY+0.02, IZ0+0.34, i*1.1, "#8a9a94",
        -Math.PI/2, 0);
  m.rect(IX0, IX1, IZ0, IZ1, "ROXIE'S DINER");
  addZone(D.x+IX0, D.x+IX1, D.z+IZ0, D.z+IZ1, m.y+FY-0.3, m.y+FY+CH,
          "ROXIE'S DINER", true);
})();
