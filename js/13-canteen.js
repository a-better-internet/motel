"use strict";
/* LOW DESERT MOTEL · 13-canteen.js
   The Rusty Canteen, inside and out
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   11c · THE RUSTY CANTEEN
   A separate business on the next lot west, fenced off from the motel's
   asphalt and about twice the size of the office: a brick roadhouse with
   an L of bar down one side, a pool table, booths, and the kind of gig
   posters that go up and never come down. You can walk in.
   ---------------------------------------------------------------------- */
const BAR={x0:-88.0, x1:-67.0, z0:-30.0, z1:-14.5};
(function buildBar(){
  const T2=0.26, H=4.20, FY=0.16;                       // wall, height, floor
  const X0=BAR.x0, X1=BAR.x1, Z0=BAR.z0, Z1=BAR.z1;
  const IX0=X0+T2, IX1=X1-T2, IZ0=Z0+T2, IZ1=Z1-T2;     // inner faces
  const CY=FY+H/2, TOPY=FY+H;
  const DOORW=1.02, DHX0=-80.72, DHX1=DHX0+DOORW;       // the front door opening
  const BRICKC="#9d685a", TRIMC="#2a2622", VINYL="#7e3f4a", BARTOP="#241f1d",
        WOODC="#7a5734", CHROME="#9aa4a8";
  let sd=7734199;
  const rn=()=>{ sd=(sd*1103515245+12345)%2147483648; return sd/2147483648; };
  const rr=(a,b)=>a+rn()*(b-a);

  // ---- the lot it stands on -------------------------------------------
  // it runs back as far as the motel's own lot does, so the two read as one
  // graded site with a fence down the middle rather than an island of asphalt
  const L={x0:-96.5, x1:-52.0, z0:-39.6, z1:26.0};
  bx("asphalt", L.x1-L.x0, 0.30, L.z1-L.z0, (L.x0+L.x1)/2, -0.16, (L.z0+L.z1)/2, 0.62);
  lotTop(L.x0, L.x1, L.z0, L.z1);
  /* a hair proud on every side: the motel's lot starts at exactly x = -52
     and this one ends there, and surfaceY's bounds test is strict, so a
     line one sample wide between them belonged to neither and dropped you
     25 cm to the sub-base. Two flats that meet have to overlap. */
  addFlat(L.x0-0.08, L.x1+0.08, L.z0-0.08, L.z1+0.08, 0);
  addZone(L.x0,L.x1,L.z0,L.z1, -1, 2.4, "THE RUSTY CANTEEN — LOT");
  bx("asphalt", L.x1-L.x0+6, 0.20, 3.2, (L.x0+L.x1)/2, -0.14, L.z0-1.6, 0.42);   // sand shoulder
  // ...which you drive across to get off the road, so it is a surface too
  addFlat(L.x0-3, L.x1+3, L.z0-3.2, L.z0, -0.04);
  for(let i=0;i<9;i++){                                  // stalls facing the road
    bx("paint", 0.11, 0.02, 5.0, L.x0+3.0+i*2.9, 0.008, L.z0+3.1, 0, 0, "#6a5b2e");
  }
  for(let i=0;i<7;i++){                                  // and a rank down the west side
    bx("paint", 5.0, 0.02, 0.11, L.x0+3.0, 0.008, -26.0+i*2.9, 0, 0, "#6a5b2e");
  }
  // the fence that makes it somebody else's business, all the way to the back
  (function(){
    const fx=-52.0, fz0=-38.0, fz1=25.0;
    push("chainlink", planeGeo(fz1-fz0, 2.10, 2.2), fx, 1.05, (fz0+fz1)/2, Math.PI/2, "#b4b9bc");
    bx("metal", 0.06, 0.06, fz1-fz0, fx, 2.12, (fz0+fz1)/2, 0, 0, "#9aa1a6");
    for(let z=fz0;z<=fz1;z+=3.0) cyl("metal", 0.05,0.05,2.30,8, fx, 1.15, z, "#9aa1a6");
    addCol(fx-0.12, fx+0.12, fz0, fz1, 0, 2.2);
    // and along the back of the bar's own yard
    push("chainlink", planeGeo(44.0, 2.10, 2.2), -74.0, 1.05, 25.6, 0, "#b4b9bc");
    bx("metal", 44.0, 0.06, 0.06, -74.0, 2.12, 25.6, 0, 0, "#9aa1a6");
    for(let x2=-96;x2<=-52;x2+=3.0) cyl("metal", 0.05,0.05,2.30,8, x2, 1.15, 25.6, "#9aa1a6");
    addCol(-96.2, -52.0, 25.4, 25.8, 0, 2.2);
  })();

  /* ---- the open lot between the Canteen and the office -----------------
     Twenty metres of asphalt with a fence down the middle of it and nothing
     on it, which is the one stretch of the site you cross every time and the
     only one with nothing to look at. What ends up on a lot like this is
     whatever was too big to move: a catering truck that stopped going out,
     the bins the bar is not allowed to keep out front, and everything
     somebody meant to deal with.                                         */
  (function(){
    const TX=-61.5, TZ=-7.0, TA=0.42;                  // the truck, parked askew
    const c0=Math.cos(TA), s0=Math.sin(TA);
    const K=(lx,lz)=>[TX+lx*c0+lz*s0, TZ-lx*s0+lz*c0];
    const BODY="#d8cdb4", TRIM2="#9c3f2e", GLASS2="#7f9296", RUST3="#7a4526";
    // a step van: box body, cab dropped in front of it, on four flat tyres
    {
      const [bx2,bz2]=K(0,0.55);
      bx("siding", 2.28, 2.22, 4.60, bx2, 1.52, bz2, 0.45, TA, BODY);
      bx("siding", 2.32, 0.30, 4.64, bx2, 2.72, bz2, 0.45, TA, "#cfc2a4");   // the roof cap
      // The body is 2.28 wide, so its flank is at 1.14. The band was centred
      // on 1.16 and 40 mm thick, putting its inner face exactly on the flank
      // and its outer face exactly where the rust plane sat — two coplanar
      // pairs, which is the glitching. The band is buried into the body now
      // and everything after it steps outward.
      for(const q of [-1,1]){                          // a band down each side
        const [px,pz]=K(q*1.145, 0.55);
        push("paint", boxGeo(0.06, 0.42, 4.30, 0.5), px, 1.62, pz, TA, TRIM2);
        const [rx2,rz2]=K(q*1.21, 0.55);
        push("rust", streakGeo(1.90, 1.30, 0), rx2, 0.72, rz2,
             TA+(q>0?Math.PI/2:-Math.PI/2), RUST3);
      }
      const [fx2,fz2]=K(0,3.35);                       // the cab
      bx("siding", 2.10, 1.62, 1.55, fx2, 1.16, fz2, 0.45, TA, BODY);
      // cab front is at 4.125 and its flank at 1.05: the glass used to stop
      // dead on both, so both flickered. Stand it proud.
      bx("carglass", 1.84, 0.86, 0.06, K(0,4.17)[0], 1.62, K(0,4.17)[1], 0, TA, GLASS2);
      for(const q of [-1,1])
        bx("carglass", 0.06, 0.72, 1.10, K(q*1.09,3.45)[0], 1.58, K(q*1.09,3.45)[1],
           0, TA, GLASS2);
      bx("chrome", 2.16, 0.22, 0.14, K(0,4.20)[0], 0.62, K(0,4.20)[1], 0, TA, "#9aa1a6");
      for(const q of [-1,1])                           // headlamps, one of them gone
        cyl("glass", 0.16,0.16,0.10,12, K(q*0.74,4.18)[0], 0.98, K(q*0.74,4.18)[1],
            q>0?"#cfd6d2":"#2b2723", Math.PI/2, TA, 0);
      // A torus reads as a doughnut. A tyre is a cylinder with a sidewall, a
      // rim and a hub, and these two at the front have been flat so long the
      // van is sitting on its rims at that corner.
      for(const w of [[-1.02,2.95,1],[1.02,2.95,1],[-1.02,-1.15,0],[1.02,-1.15,0]]){
        const [wx2,wz2]=K(w[0],w[1]);
        const flat=w[2], r0=flat?0.31:0.40, yc=flat?0.30:0.40;
        const tg=new T.CylinderGeometry(r0,r0,0.30,16);
        if(flat) tg.scale(1, 1, 0.80);             // squatting, not round
        push("tyre", tg, wx2, yc, wz2, TA, "#1e1c1a", 0, Math.PI/2);
        cyl("tyre",  r0*0.70, r0*0.70, 0.315, 14, wx2, yc, wz2, "#33302c", 0, TA, Math.PI/2);
        cyl("metal", r0*0.52, r0*0.52, 0.33, 12, wx2, yc, wz2, "#7c837f", 0, TA, Math.PI/2);
        cyl("metal", 0.075,0.075,0.35,8, wx2, yc, wz2, "#5e6462", 0, TA, Math.PI/2);
        for(let k=0;k<5;k++){                      // wheel nuts
          const a3=k*1.257;
          push("metal", boxGeo(0.035,0.035,0.34,0), wx2, yc+Math.sin(a3)*r0*0.30, wz2,
               TA, "#8a908c", 0, Math.PI/2+Math.cos(a3)*0);
        }
        // the arch it sits in, so the wheel is let into the body not stuck on
        const [ax,az]=K(w[0]*1.10, w[1]);
        push("siding", boxGeo(0.06,0.10,1.00,0.5), ax, yc+r0+0.06, az, TA, "#c0b59a");
      }
      for(const q of [-1,1]){                      // mud flaps behind the rears
        const [fx3,fz3]=K(q*1.00, -1.72);
        push("tyre", boxGeo(0.44,0.40,0.03,0), fx3, 0.26, fz3, TA, "#1c1a18", 0.12, 0);
      }
      // the serving hatch, propped open, and what is still behind it
      const [hx,hz]=K(1.15,1.20);
      push("siding", boxGeo(1.70,1.05,0.05,0.5), hx, 2.42, hz, TA, "#c6b995", -1.15, 0);
      bx("metal", 1.66, 0.06, 0.52, K(1.42,1.20)[0], 1.72, K(1.42,1.20)[1], 0, TA,
         "#8e9498");                                   // the shelf under it
      for(let i=0;i<4;i++)
        cyl("metal", 0.012,0.012,0.62,6, K(1.30,0.55+i*0.42)[0], 2.05,
            K(1.30,0.55+i*0.42)[1], "#8e9498", 0.5, TA, 0);
      bx("metal", 1.50, 0.62, 0.50, K(0.55,1.30)[0], 1.30, K(0.55,1.30)[1], 0, TA,
         "#8e9498");                                   // a counter gone over inside
      /* ---- the fittings a truck that fed people actually carried -------- */
      {
        const P=(bk,w,h,d,lx,ly,lz,c,rx,rz)=>{ const [qx,qz]=K(lx,lz);
          push(bk, boxGeo(w,h,d,0.45), qx, ly, qz, TA, c, rx||0, rz||0); };
        const C2=(bk,rt,rb,h,seg,lx,ly,lz,c,rx,rz)=>{ const [qx,qz]=K(lx,lz);
          cyl(bk, rt,rb,h,seg, qx, ly, qz, c, rx||0, TA, rz||0); };
        // roof: an air conditioner, a cowl vent and the flue off the griddle
        P("weathered", 1.00,0.34,1.05, 0,3.04,0.10, "#c8c2b0");
        for(let i=0;i<5;i++) P("bin", 0.86,0.03,0.05, 0,3.02+i*0.06,-0.38, "#4e5250");
        C2("metal", 0.17,0.20,0.42,12, -0.55,3.08,2.10, "#9aa09a");
        C2("metal", 0.23,0.23,0.06,12, -0.55,3.32,2.10, "#8d938d");
        C2("metal", 0.10,0.10,0.90,10, 0.60,3.32,-1.30, "#7e8480");   // the flue
        C2("metal", 0.16,0.13,0.14,10, 0.60,3.82,-1.30, "#6e7470");
        // a roof rack and the ladder up to it
        for(const q of [-1,1]) P("metal", 0.05,0.05,3.80, q*0.92,3.20,0.40, "#8a908c");
        for(let i=0;i<5;i++) P("metal", 1.90,0.04,0.04, 0,3.20,-1.30+i*0.86, "#8a908c");
        for(let i=0;i<7;i++) C2("metal", 0.020,0.020,0.46,7, 0,0.58+i*0.40,-1.98,
                                "#8a908c", 0, Math.PI/2);
        for(const q of [-1,1]) C2("metal", 0.024,0.024,2.80,7, q*0.23,1.66,-1.98, "#8a908c");
        // a propane bottle and a generator on the tail, strapped down
        C2("paint", 0.21,0.21,0.74,14, -0.62,0.62,-2.10, "#b8b2a2");
        C2("metal", 0.07,0.07,0.10,10, -0.62,1.04,-2.10, "#8a908c");
        P("weathered", 0.68,0.44,0.46, 0.60,0.50,-2.10, "#6f7a6a");
        P("bin", 0.56,0.05,0.40, 0.60,0.74,-2.10, "#3a403c");
        C2("metal", 0.05,0.05,0.30,8, 0.86,0.60,-2.28, "#8a908c", 0, Math.PI/2);
        // rear roller shutter, half up, with the slats reading
        P("metal", 1.90,1.10,0.06, 0,1.92,-1.78, "#a8a294");
        for(let i=0;i<7;i++) P("bin", 1.86,0.02,0.02, 0,1.44+i*0.16,-1.81, "#8d8578");
        P("bin", 1.94,0.10,0.08, 0,1.34,-1.80, "#5e6260");
        P("metal", 1.80,0.90,0.05, 0,0.92,-1.76, "#2b2f2e");        // the dark inside
        // the step, and the crate somebody used as a second one
        P("metal", 0.90,0.06,0.42, 1.34,0.44,1.20, "#8a908c");
        for(const q of [-1,1]) C2("metal", 0.02,0.02,0.44,6, 1.34+q*0.40,0.22,1.20, "#8a908c");
        P("oak", 0.52,0.34,0.40, 1.95,0.17,1.05, "#8a7148");
        // front: grille, plate, wipers, mirrors
        P("bin", 1.46,0.34,0.05, 0,1.06,4.16, "#33383a");
        for(let i=0;i<6;i++) P("chrome", 1.42,0.025,0.02, 0,0.94+i*0.055,4.19, "#9aa1a6");
        P("paint", 0.34,0.14,0.04, 0.45,0.60,4.24, "#cfc8ae");
        for(const q of [-1,1]) P("metal", 0.52,0.02,0.02, q*0.42,1.26,4.20, "#5e6462", 0, 0.12);
        for(const q of [-1,1]){
          C2("metal", 0.022,0.022,0.40,6, q*1.14,1.72,3.92, "#8a908c", 0.5, 0);
          P("metal", 0.06,0.30,0.22, q*1.26,1.90,3.86, "#6e7470");
        }
        // exhaust, and the sag in the back axle
        C2("metal", 0.055,0.055,1.30,8, -0.70,0.26,-0.60, "#5e5a54", Math.PI/2, 0);
        C2("metal", 0.075,0.075,0.20,8, -0.70,0.30,-1.90, "#4e4a46", Math.PI/2, 0);
        // inside the hatch: a griddle, an urn, and the shelf of cups
        P("metal", 1.10,0.10,0.56, 0.30,1.66,1.20, "#9aa1a6");
        P("bin", 0.92,0.06,0.46, 0.30,1.73,1.20, "#33383a");
        C2("metal", 0.14,0.14,0.42,12, -0.30,1.92,1.80, "#a8aeb0");
        C2("bin", 0.04,0.04,0.10,8, -0.30,1.70,1.66, "#2b2f2e", Math.PI/2, 0);
        for(let i=0;i<5;i++) C2("plaster", 0.045,0.038,0.09,10, -0.55+i*0.16,2.16,1.55,
                                "#d8d2c0");
      }
      // the name, painted on and half gone
      NEON.push(signPanel(3.20, 0.80, signTex(640,160,(x,W,H2)=>{
        x.fillStyle="#d8cdb4"; x.fillRect(0,0,W,H2);
        x.fillStyle="#9c3f2e"; fitSerif(x,"Dot's", W*0.30, H2*0.60, W*0.24, H2*0.58);
        x.fillStyle="#3a3a36"; fitText(x,"LUNCH  ·  COLD DRINKS", W*0.46, H2*0.22,
                                       W*0.66, H2*0.50);
        x.globalAlpha=0.55; x.fillStyle="#d8cdb4";     // and the half that is gone
        for(let i=0;i<26;i++) x.fillRect(Math.random()*W, Math.random()*H2,
                                         6+Math.random()*30, 4+Math.random()*22);
      }), K(-1.19,0.90)[0], 1.72, K(-1.19,0.90)[1], TA+Math.PI/2, false));
      addCol(TX-2.6, TX+2.6, TZ-3.4, TZ+4.2, 0, 2.9);
      // and the stain it has left on the asphalt after all this time
      push("soot", planeGeo(5.2,3.4,0), TX, 0.018, TZ+0.4, TA, "#2f2a24", -Math.PI/2, 0);
    }
    // the bin corral: three sides of breeze block, two skips, and the overflow
    {
      const CX=-56.6, CZ=-24.0;
      for(const w of [[-2.35,0,0.30,3.40],[2.35,0,0.30,3.40],[0,-1.70,5.00,0.30]])
        bx("concrete", w[2], 1.55, w[3], CX+w[0], 0.78, CZ+w[1], 0.70, 0, "#b8b1a0");
      for(let k=0;k<7;k++)                             // the courses, picked out
        for(const w of [[-2.35,0,0.32,3.42],[2.35,0,0.32,3.42],[0,-1.70,5.02,0.32]])
          push("soot", boxGeo(w[2]+0.01, 0.015, w[3]+0.01, 0), CX+w[0],
               0.05+k*0.215, CZ+w[1], 0, "#8a8274");
      for(const w of [[-2.35,0,0.44,3.54],[2.35,0,0.44,3.54],[0,-1.70,5.14,0.44]])
        bx("concrete", w[2], 0.10, w[3], CX+w[0], 1.60, CZ+w[1], 0.5, 0, "#a49c90");
      addCol(CX-2.6, CX-2.1, CZ-1.8, CZ+1.8, 0, 1.6);
      addCol(CX+2.1, CX+2.6, CZ-1.8, CZ+1.8, 0, 1.6);
      addCol(CX-2.6, CX+2.6, CZ-1.9, CZ-1.5, 0, 1.6);
      for(let k=0;k<2;k++){
        const dx=CX-1.15+k*2.30;
        bx("paint", 2.02,1.16,1.14, dx, 0.58, CZ+0.2, 0.4, 0, k?"#3f5c46":"#4a4f56");
        bx("paint", 2.06,0.10,1.18, dx, 1.18, CZ+0.2, 0, 0, k?"#4a6b52":"#565c64");
        if(k) push("paint", boxGeo(1.94,0.08,1.02,0.4), dx, 1.62, CZ+0.78, 0,
                   "#4a6b52", 1.05, 0);                // one lid thrown back
        for(const q of [-1,1]) cyl("metal", 0.15,0.15,0.12,12, dx+q*0.82, 0.08, CZ+0.42,
                                   "#3a3632", 0, 0, Math.PI/2);
        push("rust", streakGeo(1.40,0.90,0), dx, 0.62, CZ-0.40, 0, "#6a3a20");
        addCol(dx-1.05, dx+1.05, CZ-0.62, CZ+0.62, 0, 1.3);
      }
      for(let i=0;i<9;i++)                             // what did not make it in
        push("paper", boxGeo(0.22,0.008,0.28,0), CX+((i*7)%9-4)*0.85,
             0.014+i*0.0008, CZ+2.1+((i*5)%4)*0.55, i*1.1, "#cfc6ac", 0.05, 0.03);
      for(let i=0;i<5;i++)
        cyl("metal", 0.033,0.033,0.11,10, CX+((i*11)%7-3)*0.7, 0.033,
            CZ+2.4+((i*3)%3)*0.5, "#9aa0a2", Math.PI/2, i*1.3, 0);
    }
    // a stack of pallets, a drum on its side, and the propane cage
    {
      for(let k=0;k<5;k++)
        for(let i=0;i<5;i++)
          bx("plank", 1.15, 0.05, 0.14, -65.6, 0.09+k*0.17, -19.4-0.56+i*0.28,
             0.5, 0.18, "#8a7550");
      for(let k=0;k<5;k++)
        for(const q of [-0.48,0,0.48])
          bx("plank", 0.13, 0.12, 1.12, -65.6+q*0.0, 0.09+k*0.17-0.07, -19.4+q,
             0.5, 0.18, "#7a6646");
      addCol(-66.3,-64.9, -20.1,-18.7, 0, 0.95);
      cyl("metal", 0.30,0.30,0.88,14, -63.4, 0.30, -16.6, "#7a4526", 0, 0.7, Math.PI/2);
      addCol(-63.9,-62.9, -17.1,-16.1, 0, 0.7);
      for(const q of [-1,1]){                          // the propane cage on the wall
        bx("metal", 0.05, 1.30, 0.05, -67.9, 0.65, -12.4+q*0.62, 0, 0, "#8e9498");
        bx("metal", 0.05, 0.05, 1.24, -67.9, 0.04+(q>0?1.26:0), -12.4, 0, 0, "#8e9498");
      }
      push("chainlink", planeGeo(1.24,1.28,2.0), -67.9, 0.66, -12.4, Math.PI/2, "#b4b9bc");
      for(let k=0;k<3;k++)
        cyl("paint", 0.16,0.16,0.62,12, -68.4+((k%2)*0.30), 0.31, -12.85+k*0.42,
            k?"#b8bcc0":"#9c3f2e");
      addCol(-68.7,-67.7, -13.1,-11.7, 0, 1.4);
    }
    // a light on a pole over the middle of it, and the pool it throws
    {
      const px=-58.8, pz=-14.8;
      cyl("metal", 0.10,0.13,6.40,10, px, 3.20, pz, "#6f6a60");
      bx("metal", 1.10, 0.10, 0.10, px+0.55, 6.32, pz, 0, 0, "#6f6a60");
      cyl("ceilfix", 0.30,0.42,0.22,12, px+1.02, 6.18, pz, "#e8e2cf", Math.PI, 0, 0);
      LAMPS.push({x:px+1.02, y:6.05, z:pz, color:0xffe9c4, intensity:0.62,
                  dist:17, decay:1.6, mothy:true});
      addCol(px-0.2, px+0.2, pz-0.2, pz+0.2, 0, 6.4);
    }
    // weeds through every crack, because nobody has swept this in years.
    // (scatterDesert's tussock() is closed over in its own IIFE, so this is
    // the same idea written out: a core with blades growing out of it, and
    // the blades offset along the axis they actually point down.)
    for(let i=0;i<24;i++){
      const wx=-67.0+((i*13.7)%14.0), wz=-30.2+((i*9.3)%26.0), sc=0.5+((i*5)%3)*0.2;
      const col=["#5f6b40","#7a7250","#54613a"][i%3];
      push("foliage", blobGeo(0.11*sc), wx, 0.05*sc, wz, i, col);
      for(let k=0;k<7+((i*3)%4);k++){
        const a2=((i*29+k*47)%360)*0.01745, lean=0.28+((k*5)%4)*0.16;
        const L=(0.19+((k*7)%4)*0.09)*sc, si=Math.sin(lean), co=Math.cos(lean);
        push("foliage", boxGeo(0.045*sc, L, 0.020*sc, 0),
             wx+Math.sin(a2)*si*L/2, 0.04*sc+co*L/2, wz+Math.cos(a2)*si*L/2,
             a2, col, lean, 0);
      }
    }
    addZone(-68.0,-52.0, -31.0, 2.0, -1, 3.0, "THE BACK LOT");
  })();

  /* ---- the back yard: where the bar keeps what it does not want seen ---- */
  (function(){
    const RUSTC="#9c5232", GALV="#9aa1a6";
    // a shed you can get into, where the cold stock and the dead kegs live
    (function(){
      const sx=-90.0, sz=9.0, SW=5.20, SD=4.00, SH=2.62, ST=0.12, SF=0.24;
      const SX0=sx-SW/2, SX1=sx+SW/2, SZ0=sz-SD/2, SZ1=sz+SD/2;
      const QX0=SX0+ST, QX1=SX1-ST, QZ0=SZ0+ST, QZ1=SZ1-ST;      // inner faces
      const SDOOR=[sx-0.51, sx+0.51];                            // 1.02 m opening, centred
      const runs=(a0,a1,holes)=>{
        const out=[]; let c=a0;
        for(const h of holes){ if(h[0]>c) out.push([c,h[0]]); c=Math.max(c,h[1]); }
        if(c<a1) out.push([c,a1]); return out;
      };
      bx("concrete", SW+0.6, 0.26, SD+0.6, sx, SF-0.13, sz, 0.45, 0, "#9b948a");
      addFlat(SX0-0.3, SX1+0.3, SZ0-0.3, SZ1+0.3, SF);
      for(const g of runs(SX0,SX1,[SDOOR]))                       // front, with the door
        bx("siding", g[1]-g[0], SH, ST, (g[0]+g[1])/2, SF+SH/2, SZ0+ST/2, 0.55, 0, "#9aa8a2");
      bx("siding", SDOOR[1]-SDOOR[0], SH-2.07, ST, (SDOOR[0]+SDOOR[1])/2,
         SF+2.07+(SH-2.07)/2, SZ0+ST/2, 0.55, 0, "#9aa8a2");
      bx("siding", SW, SH, ST, sx, SF+SH/2, SZ1-ST/2, 0.55, 0, "#9aa8a2");
      for(const q of [-1,1])
        bx("siding", ST, SH, SD-ST*2, sx+q*(SW/2-ST/2), SF+SH/2, sz, 0.55, 0, "#8c9a94");
      /* THE ROOF, AND THE HOLE THAT WAS UNDER IT.
         A single slab 30 cm clear of the wall heads, tilted 0.13 rad so it
         sheds to the back. Tilt a plate over square-topped walls and the
         two do not meet: the fall is 52 cm over the depth, so where the
         back edge sat down on the wall head the FRONT edge stood half a
         metre proud of it — an open slot right across the front of the
         shed and tapering down both sides, which from the yard is a shed
         with daylight between its walls and its roof.
         A pitched roof needs the walls built up to meet it. So: an upstand
         over the front wall, a closer over the back, and a raking infill
         up each side laid at the SAME tilt as the roof and hung off the
         roof's own frame rather than measured by eye — if the roof moves,
         they move with it. Everything below the old wall head is inside
         the existing siding and never shows. */
      const RTY=SF+SH+0.30, RTH=0.10, FALL=0.13;
      const cf=Math.cos(FALL), sf2=Math.sin(FALL);
      // the underside of the roof, as a function of distance back from sz
      const soffit=d=>RTY-(RTH/2)*cf-d*sf2;
      push("siding", boxGeo(SW+0.5, RTH, SD+0.7, 0.5), sx, RTY, sz, 0,
           "#7f8d88", FALL, 0);                                   // a roof with a fall on it
      {
        const WT=SF+SH;                                           // the old wall head
        // the raking infill up each side, laid on the roof's own plane
        const IH=0.74, off=RTH/2+IH/2;
        for(const q of [-1,1])
          push("siding", boxGeo(ST, IH, SD+0.12, 0.55), sx+q*(SW/2-ST/2),
               RTY-off*cf, sz-off*sf2, 0, "#8c9a94", FALL, 0);
        // the upstand over the front wall, where the slot was widest
        const FY=soffit(SZ0+ST/2-sz);
        bx("siding", SW, FY+0.07-(WT-0.06), ST, sx, (WT-0.06+FY+0.07)/2, SZ0+ST/2,
           0.55, 0, "#9aa8a2");
        // and a closer over the back, where it was only ever a hairline
        const BY=soffit(SZ1-ST/2-sz);
        bx("siding", SW, Math.max(0.10, BY+0.07-(WT-0.06)), ST, sx,
           (WT-0.06+BY+0.07)/2, SZ1-ST/2, 0.55, 0, "#9aa8a2");
        // a fascia on the low edge and a bargeboard up each rake, so the
        // roof reads as built rather than balanced
        push("plank", boxGeo(SW+0.5, 0.16, 0.035, 0.6), sx, soffit(SD/2+0.33)-0.05,
             sz+SD/2+0.35, 0, "#6f7a74", FALL, 0);
        for(const q of [-1,1])
          push("plank", boxGeo(0.035, 0.14, SD+0.7, 0.6), sx+q*(SW/2+0.24),
               RTY-(RTH/2+0.07)*cf, sz-(RTH/2+0.07)*sf2, 0, "#6f7a74", FALL, 0);
      }
      bx("plaster", QX1-QX0, 0.06, QZ1-QZ0, sx, SF+SH-0.03, sz, 0.4, 0, "#8e897e");
      bx("concrete", QX1-QX0, 0.05, QZ1-QZ0, sx, SF-0.015, sz, 0.5, 0, "#8d877c");
      for(const g of runs(SX0,SX1,[SDOOR])) addCol(g[0], g[1], SZ0, SZ0+ST, 0, SF+SH);
      addCol(SX0, SX1, SZ1-ST, SZ1, 0, SF+SH);
      addCol(SX0, SX0+ST, SZ0, SZ1, 0, SF+SH);
      addCol(SX1-ST, SX1, SZ0, SZ1, 0, SF+SH);
      makeDoor(XF(SDOOR[0]+0.02, SZ0+0.04, 0), 0, SF+0.02, 0, "THE SHED", true, 0, "booth");
      bx("glass", 0.62, 0.42, 0.06, sx+1.50, SF+1.70, SZ0+ST/2, 0, 0, "#8e9a94");
      bx("oak", 0.70, 0.05, 0.05, sx+1.50, SF+1.94, SZ0-0.02, 0, 0, "#6b5947");
      for(let i=0;i<4;i++)                                        // rust down the seams
        push("rust", streakGeo(0.44,1.60,0), SX0+0.5+i*1.35, 1.20, SZ0-0.07, 0, "#6a3a20");
      /* ---- and what is in it ---------------------------------------- */
      for(let k=0;k<2;k++){                                       // chest coolers
        const cx2=QX0+0.78+k*1.62;
        bx("weathered", 1.42, 0.86, 0.70, cx2, SF+0.43, QZ1-0.44, 0.45, 0, k?"#b6ada0":"#9cb0b4");
        push("weathered", boxGeo(1.46,0.10,0.74,0.45), cx2, SF+0.90, QZ1-0.44, 0,
             k?"#c2b9ab":"#a9bdc1", k?0.0:-0.42, 0);              // one lid propped open
        bx("metal", 0.30, 0.05, 0.04, cx2, SF+0.62, QZ1-0.80, 0, 0, "#8d9498");
        addCol(cx2-0.75, cx2+0.75, QZ1-0.82, QZ1-0.06, 0, SF+0.95);
      }
      for(let k=0;k<5;k++){                                       // kegs, dead and stacked
        const kx=QX0+0.55+((k%3)*0.58), kz=QZ0+0.62+(((k/3)|0)*0.62);
        cyl("metal", 0.23,0.23,0.58,14, kx, SF+0.29, kz, k%2?"#8d9498":"#7d858a");
        cyl("metal", 0.25,0.25,0.05,14, kx, SF+0.60, kz, "#6d7377");
        addCol(kx-0.26, kx+0.26, kz-0.26, kz+0.26, 0, SF+0.62);
      }
      cyl("metal", 0.23,0.23,0.58,14, QX0+0.84, SF+0.91, QZ0+0.62, "#8d9498", 0.12, 0.4, 0.1);
      bx("oak", 0.36, 1.70, 1.30, QX1-0.20, SF+0.85, sz+0.40, 0.5, 0, "#5b4632");  // shelving
      for(let r=0;r<3;r++){
        bx("oak", 0.34, 0.04, 1.26, QX1-0.21, SF+0.46+r*0.52, sz+0.40, 0.5, 0, "#6f6048");
        for(let i=0;i<4;i++)
          cyl("glass", 0.035,0.035,0.22,9, QX1-0.21, SF+0.59+r*0.52, sz-0.08+i*0.30,
              ["#3f8a46","#8a6026","#9a8a34"][(i+r)%3]);
      }
      addCol(QX1-0.40, QX1, sz-0.30, sz+1.05, 0, SF+1.7);
      cyl("teal", 0.020,0.020,1.20,6, QX0+0.30, SF+0.60, sz+0.30, "#8a8274", 0.22, 0.8, 0.15);
      push("fabric", boxGeo(0.24,0.08,0.20,0.5), QX0+0.34, SF+1.18, sz+0.44, 0.8, "#9a9482", 0.22, 0);
      for(let i=0;i<3;i++)                                        // a stack of crates
        bx("oak", 0.42,0.26,0.56, QX0+0.45, SF+0.14+i*0.27, QZ1-1.55, 0.5, 0.2, "#5f4a2c");
      cyl("teal", 0.012,0.012,0.36,6, sx, SF+SH-0.26, sz, "#6e6a62");
      push("ceilfix", new T.SphereGeometry(0.075,10,8), sx, SF+SH-0.50, sz, 0, "#f2e9cf");
      LAMPS.push({x:sx, y:SF+SH-0.54, z:sz, color:0xffd6a2, intensity:0.52, dist:6,
                  decay:1.8, indoor:true});
      addZone(QX0, QX1, QZ0, QZ1, SF-0.3, SF+SH, "THE SHED", true);
      addZone(sx-5, sx+5, sz-5, sz+5, -1, 4, "BEHIND THE CANTEEN");
      // what is stacked against it
      for(let i=0;i<5;i++)
        push("oak", boxGeo(1.15,0.11,0.95,0.5), sx+2.9, 0.06+i*0.13, sz+0.4+(i%2)*0.12,
             0.25+i*0.04, "#6a5236", 0, 0.01);                    // pallets
      for(let i=0;i<4;i++)
        cyl("metal", 0.22,0.22,0.56,14, sx-2.6+((i%2)*0.52), 0.28, sz+1.5+(((i/2)|0)*0.52),
            "#8d9498");                                           // kegs
      cyl("metal", 0.30,0.30,0.88,12, sx+2.6, 0.44, sz-1.5, RUSTC);
      cyl("metal", 0.32,0.32,0.06,12, sx+2.6, 0.90, sz-1.5, "#6d7377");
    })();
    // two dumpsters against the back of the bar, lids up
    for(let k=0;k<2;k++){
      const dx=-84.0+k*3.6, dz=-11.4;
      bx("paint", 2.30,1.32,1.24, dx, 0.66, dz, 0.4, 0, k? "#3f5c46":"#2f5068");
      bx("paint", 2.34,0.12,1.28, dx, 1.34, dz, 0, 0, k? "#4a6b52":"#3a5f7c");
      push("paint", boxGeo(2.20,0.09,1.10,0.4), dx, 1.86, dz+0.66, 0,
           k? "#4a6b52":"#3a5f7c", 1.15, 0);                      // the lid, thrown back
      for(const q of [-1,1]) cyl("metal", 0.17,0.17,0.14,12, dx+q*0.95, 0.09, dz+0.45,
                                 "#3a3632", 0, 0, Math.PI/2);
      push("rust", streakGeo(1.60,1.00,0), dx, 0.70, dz-0.63, 0, "#6a3a20");
      addCol(dx-1.2, dx+1.2, dz-0.7, dz+0.7, 0, 1.5);
      for(let i=0;i<5;i++)                                        // what missed
        push("paper", planeGeo(0.20,0.27,0), dx-1.4+i*0.7, 0.015, dz-1.2-((i*0.37)%1.4),
             i*1.9, "#ffffff", -Math.PI/2, 0);
    }
    // bins by the back door, and a crate of empties nobody took in
    for(let i=0;i<4;i++){
      const bx2=-77.5+i*0.96, bz=-12.2+((i%2)*0.5);
      cyl("bin", 0.30,0.26,0.86,14, bx2, 0.43, bz, ["#3e443f","#4a4640","#5f5348"][i%3]);
      cyl("bin", 0.32,0.32,0.05,14, bx2, 0.88, bz, "#2e332f");
      addCol(bx2-0.34, bx2+0.34, bz-0.34, bz+0.34, 0, 0.9);
    }
    for(let k=0;k<2;k++){
      bx("oak", 0.42,0.26,0.56, -74.6, 0.14+k*0.27, -12.4, 0.5, 0.2, "#5f4a2c");
      for(let i=0;i<8;i++)
        cyl("glass", 0.030,0.030,0.20,8, -74.72+((i%2)*0.24), 0.33+k*0.27,
            -12.62+(((i/2)|0)*0.14), "#3f8a46");
    }
    // a service door in the back wall, and the light over it
    bx("teal", 1.06, 2.10, 0.10, -80.4, 1.21, BAR.z1+0.03, 0, 0, "#3f5c46");
    bx("metal", 1.30, 0.10, 0.50, -80.4, 2.44, BAR.z1+0.22, 0, 0, "#6d7377");
    push("ceilfix", new T.SphereGeometry(0.09,10,8), -80.4, 2.30, BAR.z1+0.34, 0, "#f2e9cf");
    LAMPS.push({x:-80.4, y:2.26, z:BAR.z1+0.5, color:0xffd8a0, intensity:0.80, dist:13,
                decay:1.6, mothy:true});
    // somewhere to stand outside and smoke
    bx("oak", 1.80,0.09,0.42, -70.0, 0.46, -11.0, 0.5, 0, "#6a5236");
    for(const q of [-0.72,0.72]) bx("metal", 0.07,0.42,0.36, -70.0+q, 0.25, -11.0, 0,0,"#4a4640");
    addSeat(-70.0, -11.0, 0.52, Math.PI, "OUT THE BACK");
    addCol(-71.1,-68.9, -11.3,-10.7, 0, 0.55);
    cyl("bin", 0.19,0.17,0.70,12, -68.4, 0.35, -11.0, "#5f5348");
    cyl("gravel", 0.18,0.18,0.06,12, -68.4, 0.72, -11.0, "#8a7a62");
    for(let i=0;i<22;i++)                                          // ends, ground out
      push("plaster", boxGeo(0.045,0.012,0.012,0), -70.6+((i*0.31)%3.0), 0.012,
           -10.4-((i*0.23)%1.5), i*1.3, "#e8e2cf", 0, 0);
    // two yard lights on poles
    for(const q of [[-92.0,-2.0],[-64.0,14.0]]){
      cyl("metal", 0.10,0.13,6.20,10, q[0], 3.10, q[1], "#5b5f62");
      bx("metal", 0.62,0.16,0.34, q[0]+0.28, 6.18, q[1], 0, 0, "#5b5f62");
      push("ceilfix", boxGeo(0.46,0.09,0.28,0), q[0]+0.46, 6.06, q[1], 0, "#f2e9cf");
      addCol(q[0]-0.16, q[0]+0.16, q[1]-0.16, q[1]+0.16, 0, 6.2);
      LAMPS.push({x:q[0]+0.46, y:6.0, z:q[1], color:0xffe0b0, intensity:1.05, dist:26,
                  decay:1.5, mothy:true});
    }
    // oil where the delivery truck stands, and weeds through the cracks
    for(const q of [[-80.0,-8.0,3.2],[-88.0,4.0,2.4],[-66.0,2.0,2.0]])
      push("soot", planeGeo(q[2], q[2]*0.7, 0), q[0], 0.012, q[1], q[0]*0.1, "#2a2420",
           -Math.PI/2, 0);
    // grass in the cracks, not boulders on the tarmac: thin blades, low and
    // dark, and only where a crack would actually be — the edges and the fence
    for(let i=0;i<30;i++){
      const edge=i%3;
      const wx = edge===0 ? -52.6 : edge===1 ? -96.0 : -95+((i*5.3)%43);
      const wz = edge===2 ? 25.1 : -6+((i*7.3)%30);
      for(let k=0;k<5;k++){
        const h2=0.10+((i*k)%4)*0.045;
        push("foliage", boxGeo(0.018,h2,0.018,0), wx+((k-2)*0.045), h2/2,
             wz+(((i+k)%3)-1)*0.05, i+k, "#5a6a3c", ((k%3)-1)*0.22, ((i%3)-1)*0.22);
      }
    }
    // a stack of stools that gave out, and a sand pile
    for(let i=0;i<4;i++){
      cyl("fabric", 0.19,0.19,0.10,14, -95.0, 0.30+i*0.13, 20.0, "#7e3f4a");
      cyl("metal", 0.05,0.06,0.72,10, -95.0, 0.36, 20.0, "#9aa4a8");
    }
    push("gravel", new T.ConeGeometry(2.0, 1.1, 14), -92.0, 0.55, 20.5, 0, "#b5a17c");
    addCol(-94.0,-90.0, 18.5,22.5, 0, 1.1);
    // stall stripes down the back, so the yard reads as parking too
    for(let i=0;i<7;i++) bx("paint", 5.0, 0.02, 0.11, -93.5, 0.008, -4.0+i*2.9, 0, 0, "#6a5b2e");
    for(let i=0;i<7;i++) bx("paint", 5.0, 0.02, 0.11, -57.5, 0.008, -2.0+i*2.9, 0, 0, "#6a5b2e");
  })();

  // ---- shell ------------------------------------------------------------
  // runs of wall either side of an opening
  const segs=(a0,a1,holes)=>{
    const out=[]; let c=a0;
    for(const h of holes){ if(h[0]>c) out.push([c,h[0]]); c=Math.max(c,h[1]); }
    if(c<a1) out.push([c,a1]); return out;
  };
  // its top sits a hundred millimetres BELOW the boards — both were landing
  // on FY and fighting over it, which is why the floor came out white
  bx("concrete", X1-X0+1.4, 0.34, Z1-Z0+1.4, (X0+X1)/2, FY-0.27, (Z0+Z1)/2, 0.45, 0, "#9b948a");
  addFlat(X0-0.7, X1+0.7, Z0-0.7, Z1+0.7, FY);
  // North wall, in three bands so the windows are holes in the MIDDLE band
  // only. The first version cut the whole 2.42 m lower band away at every
  // window, which left the wall open from the floor up — that is where the
  // light and the blown sand were getting in.
  const WINN=[[-85.9,-84.3],[-72.6,-71.0]];
  const WSILL=FY+1.17, WHEAD=FY+2.27, DOORTOP=FY+2.07;
  const DOORH=[[DHX0,DHX1]];
  const band3=(a0,a1,holes,y0,y1)=>{
    for(const g of segs(a0,a1,holes))
      bx("brick", g[1]-g[0], y1-y0, T2, (g[0]+g[1])/2, (y0+y1)/2, Z0+T2/2, 0.42, 0, BRICKC);
  };
  band3(X0, X1, DOORH, FY, WSILL);                                     // under the sills
  band3(X0, X1, DOORH.concat(WINN).sort((a,b)=>a[0]-b[0]), WSILL, WHEAD);
  band3(X0, X1, DOORH, WHEAD, TOPY);                                   // over the heads
  bx("brick", DOORW, TOPY-DOORTOP, T2, (DHX0+DHX1)/2, (DOORTOP+TOPY)/2, Z0+T2/2,
     0.42, 0, BRICKC);                                                 // and over the door
  for(const w of WINN){                                   // glass block, filling the hole
    bx("breeze", w[1]-w[0], WHEAD-WSILL, T2*0.62, (w[0]+w[1])/2, (WSILL+WHEAD)/2,
       Z0+T2/2, 0.5, 0, "#8e9a94");
  }
  bx("brick", X1-X0, H, T2, (X0+X1)/2, CY, Z1-T2/2, 0.42, 0, BRICKC);            // south
  for(const sx of [X0+T2/2, X1-T2/2])                                            // ends
    bx("brick", T2, H, Z1-Z0-T2*2, sx, CY, (Z0+Z1)/2, 0.42, 0, BRICKC);
  addCol(X0, X1, Z1-T2, Z1, 0, TOPY);
  addCol(X0, X0+T2, Z0, Z1, 0, TOPY);
  addCol(X1-T2, X1, Z0, Z1, 0, TOPY);
  for(const g of segs(X0, X1, [[DHX0,DHX1]])) addCol(g[0], g[1], Z0, Z0+T2, 0, TOPY);
  // roof, parapet and a swamp cooler
  bx("roofG", X1-X0+0.5, 0.26, Z1-Z0+0.5, (X0+X1)/2, TOPY+0.13, (Z0+Z1)/2, 0.35, 0, "#6d6660");
  for(const e of [[0,Z0+0.05],[0,Z1-0.05]])
    bx("brick", X1-X0+0.7, 0.62, 0.22, (X0+X1)/2, TOPY+0.57, e[1], 0.42, 0, "#a36653");
  for(const sx of [X0+0.05, X1-0.05])
    bx("brick", 0.22, 0.62, Z1-Z0+0.7, sx, TOPY+0.59, (Z0+Z1)/2, 0.42, 0, "#a36653");
  bx("weathered", 1.10,0.92,1.10, X0+4.2, TOPY+0.72, Z0+4.0, 0.4, 0, "#b0a892");
  cyl("metal", 0.14,0.14,1.30,10, X1-3.4, TOPY+0.9, Z1-3.0, "#8e877a");
  cyl("metal", 0.26,0.26,0.30,12, X1-3.4, TOPY+1.6, Z1-3.0, "#8e877a");
  // stoop, a step and a rail
  bx("concrete", 3.20, 0.30, 1.50, (DHX0+DHX1)/2, FY-0.14, Z0-0.70, 0.45, 0, "#a8a094");
  addFlat(DHX0-1.6, DHX1+1.6, Z0-1.45, Z0, FY-0.01);
  for(const sx of [-1.45,1.45]){
    const hx=(DHX0+DHX1)/2+sx;
    for(const hz of [Z0-1.22, Z0-0.14])                  // a post at each end of it
      cyl("metal", 0.035,0.035,0.98,8, hx, 0.54, hz, CHROME);
    bx("metal", 0.05,0.05,1.18, hx, 1.01, Z0-0.68, 0, 0, CHROME);
  }
  makeDoor(XF(DHX0+0.02, Z0+0.05, 0), 0, FY+0.02, 0, "THE RUSTY CANTEEN", true, 0, "bar");
  // A bench one side of the door and a bin the other, which is what every bar
  // on this road has and this one did not. Both sit on whatever the lot is
  // doing underneath them rather than on the building's own floor level.
  (function(){
    const LY=(x,z)=>{ const t=Terrain.groundAt(x,z), f=surfaceY(x,z,t+0.9);
                      return (f>t && f<t+0.9) ? f : t; };
    {                                                   // the bench
      const bx2=X0+3.30, bz2=Z0-0.92, by=LY(bx2,bz2);
      for(const sd of [-1,1]){                          // two concrete ends
        bx("concrete", 0.12, 0.42, 0.62, bx2+sd*0.78, by+0.21, bz2, 0.4, 0, "#a49c90");
        bx("concrete", 0.16, 0.06, 0.70, bx2+sd*0.78, by+0.03, bz2, 0.4, 0, "#8f887c");
      }
      for(let i=0;i<3;i++)                              // three slats, one of them split
        bx("plank", 1.88, 0.055, 0.155, bx2, by+0.44, bz2-0.20+i*0.20, 0.5, 0,
i===1?"#6a5a3c":"#7a6746");
      for(let i=0;i<3;i++)                              // and a back on two uprights
        bx("plank", 1.88, 0.055, 0.145, bx2, by+0.68+i*0.16, bz2+0.26, 0.5, 0, "#7a6746");
      for(const sd of [-1,1])
        bx("metal", 0.06, 0.62, 0.07, bx2+sd*0.70, by+0.62, bz2+0.30, 0, 0, "#6f6a60");
      push("soot", planeGeo(1.80,0.34,0), bx2, by+0.475, bz2, 0, "#4a4136", -Math.PI/2, 0);
      addCol(bx2-0.95, bx2+0.95, bz2-0.36, bz2+0.36, by, by+0.50);
      addSeat(bx2-0.55, bz2-0.04, by+0.47, 0, "A BENCH");
      addSeat(bx2+0.55, bz2-0.04, by+0.47, 0, "A BENCH");
      for(let i=0;i<9;i++)                              // the ends ground out under it
        push("soot", planeGeo(0.05,0.014,0), bx2-0.8+((i*7)%9)*0.19, by+0.008,
             bz2-0.55-((i*5)%4)*0.16, i*0.9, "#4a443a", -Math.PI/2, 0);
    }
    {                                                   // the bin
      const cx3=DHX1+1.95, cz3=Z0-0.95, cy=LY(cx3,cz3);
      cyl("weathered", 0.30,0.26,0.86,14, cx3, cy+0.43, cz3, "#4e5a4a");
      for(let i=0;i<4;i++)                              // the ribs round it
        push("weathered", new T.TorusGeometry(0.295-i*0.010,0.020,5,16), cx3,
             cy+0.16+i*0.21, cz3, 0, "#46523f", Math.PI/2, 0);
      cyl("weathered", 0.33,0.33,0.05,14, cx3, cy+0.885, cz3, "#3d4838");     // the lid
      cyl("bin", 0.17,0.17,0.03,12, cx3, cy+0.915, cz3, "#221f1c");           // and its mouth
      push("rust", streakGeo(0.36,0.60,0), cx3, cy+0.40, cz3-0.27, 0, "#6a4028");
      push("paper", boxGeo(0.14,0.006,0.18,0), cx3+0.36, cy+0.012, cz3-0.22, 0.7,
           "#cfc6ac", 0.05, 0.03);                      // and what missed it
      cyl("metal", 0.033,0.033,0.11,10, cx3-0.40, cy+0.033, cz3+0.16, "#9aa0a2",
          Math.PI/2, 1.1, 0);
      addCol(cx3-0.32, cx3+0.32, cz3-0.32, cz3+0.32, cy, cy+0.90);
    }
  })();

  // ---- the sign, and the other one on a pole ---------------------------
  const nameTex=hosted("barSign", signTex(1408, 320, (x,W,H2)=>{
    const PAD=W*0.055;                            // the board's own margin
    x.fillStyle="#1b1614"; x.fillRect(0,0,W,H2);
    x.strokeStyle="#caa23c"; x.lineWidth=6;
    x.strokeRect(PAD*0.52, PAD*0.52, W-PAD*1.04, H2-PAD*1.04);
    x.strokeStyle="rgba(202,162,60,0.42)"; x.lineWidth=2;
    x.strokeRect(PAD*0.90, PAD*0.90, W-PAD*1.80, H2-PAD*1.80);
    // One line, and sized to the board rather than the other way round: fit
    // the whole string, measure the two runs at that size, and lay them out
    // from the middle so the two colours stay one line with even padding.
    const inner=W-PAD*3.4;
    const all="The Rusty Canteen";
    let fs=Math.round(H2*0.50);
    do{ x.font="700 "+fs+"px Georgia, 'Times New Roman', Times, serif"; fs-=1; }
    while(x.measureText(all).width>inner && fs>8);
    x.textAlign="left"; x.textBaseline="middle";
    const wa=x.measureText("The Rusty ").width, wb=x.measureText("Canteen").width;
    const x0=(W-(wa+wb))/2, cy=H2*0.54;
    x.fillStyle="#efe0b2"; x.fillText("The Rusty ", x0, cy);
    x.fillStyle="#d4573a"; x.fillText("Canteen", x0+wa, cy);
    x.textAlign="center";
  }), {aspect:22/5});
  NEON.push(signPanel(7.40, 1.682, nameTex, (X0+X1)/2, FY+3.10, Z0-0.06, Math.PI, true));
  const smallTex=hosted("barPole", signTex(1024, 512, (x,W,H2)=>{
    x.fillStyle="#141211"; x.fillRect(0,0,W,H2);
    x.strokeStyle="rgba(202,162,60,0.55)"; x.lineWidth=3;
    x.strokeRect(11,11,W-22,H2-22);
    const inner=W*0.76;
    x.fillStyle="#efe0b2"; fitSerif(x,"Cold Beer",    inner, H2*0.22, W/2, H2*0.295);
    x.fillStyle="#8fdfd0"; fitSerif(x,"Pool · Darts", inner, H2*0.19, W/2, H2*0.565);
    x.fillStyle="#d4573a"; fitSerif(x,"Open Til Two", inner, H2*0.17, W/2, H2*0.825);
  }), {aspect:2/1});
  for(const px of [-94.0]){                               // the pole sign by the road
    bx("paint", 0.28, 5.6, 0.28, px, 2.8, -36.0, 0, 0, "#cfc8bc");
    bx("paint", 0.28, 5.6, 0.28, px+3.6, 2.8, -36.0, 0, 0, "#cfc8bc");
    bx("weathered", 4.5, 0.22, 0.30, px+1.8, 5.62, -36.0, 0.4, 0, "#6e6862");
    NEON.push(signPanel(4.0, 2.0, smallTex, px+1.8, 4.30, -36.16, Math.PI, true));
    NEON.push(signPanel(4.0, 2.0, smallTex, px+1.8, 4.30, -35.84, 0, true));
    addCol(px-0.2, px+3.8, -36.2, -35.8, 0, 5.8);
    LAMPS.push({x:px+1.8, y:4.3, z:-36.6, color:0xffcf8a, intensity:0.55, dist:16, decay:1.5});
  }
  // a beer sign in one window and a bare bulb over the door
  NEON.push(signPanel(1.30, 0.8667, hosted("beerSign", signTex(900,600,(x,W,H2)=>{
    x.fillStyle="#120f0e"; x.fillRect(0,0,W,H2);
    x.strokeStyle="rgba(224,64,42,0.45)"; x.lineWidth=6; x.strokeRect(24,24,W-48,H2-48);
    x.fillStyle="#e0402a"; fitSerif(x,"Beer",   W*0.60, H2*0.38, W/2, H2*0.44);
    x.fillStyle="#8fdfd0"; fitSerif(x,"On Tap", W*0.48, H2*0.21, W/2, H2*0.80);
  }), {aspect:3/2}), -85.1, FY+1.72, Z0-0.02, Math.PI, true));
  push("ceilfix", new T.SphereGeometry(0.11,12,8), (DHX0+DHX1)/2, FY+2.50, Z0-0.34, 0, "#f2e9cf");
  LAMPS.push({x:(DHX0+DHX1)/2, y:FY+2.4, z:Z0-0.45, color:0xffd8a0, intensity:0.85,
              dist:14, decay:1.6, mothy:true});

  /* ---- inside ---------------------------------------------------------- */
  bx("plank", IX1-IX0, 0.06, IZ1-IZ0, (IX0+IX1)/2, FY-0.03, (IZ0+IZ1)/2, 0.52, 0, "#c0a074");
  bx("ceil",  IX1-IX0, 0.10, IZ1-IZ0, (IX0+IX1)/2, TOPY-0.05, (IZ0+IZ1)/2, 0.4, 0, "#5a5048");
  for(let i=0;i<6;i++)                                    // ceiling joists
    bx("oak", IX1-IX0, 0.18, 0.16, (IX0+IX1)/2, TOPY-0.19, IZ0+1.3+i*2.4, 0.4, 0, "#4e4238");
  addZone(IX0, IX1, IZ0, IZ1, 0, TOPY, "THE RUSTY CANTEEN", true);

  /* Everything in here was cut from boxes, and a box has a 90-degree arris on
     it that catches the light like a knife. Rolling the edges is most of what
     separates a bar from a stack of crates, so the tops, the counter nose, the
     seats and the booth backs all get one.                                  */
  // a rolled edge round a rectangular top: a roll along each side and a ball
  // at each corner, laid in world axes
  function bullnose(bk, w,d, cx,cy,cz, r, col){
    cyl(bk, r,r, w, 10, cx, cy, cz-d/2, col, 0,0,Math.PI/2);
    cyl(bk, r,r, w, 10, cx, cy, cz+d/2, col, 0,0,Math.PI/2);
    cyl(bk, r,r, d, 10, cx-w/2, cy, cz, col, Math.PI/2,0,0);
    cyl(bk, r,r, d, 10, cx+w/2, cy, cz, col, Math.PI/2,0,0);
    for(const c of [[-1,-1],[1,-1],[-1,1],[1,1]])
      push(bk, new T.SphereGeometry(r,9,7), cx+c[0]*w/2, cy, cz+c[1]*d/2, 0, col);
  }
  // a horizontal roll of length L lying along the heading `a` (as the chairs
  // use it), for rails and cushion noses that are not axis-aligned
  function roll(bk, r, L, x,y,z, col, a){
    cyl(bk, r,r, L, 10, x,y,z, col, Math.PI/2, Math.PI-a, 0);
  }

  // ---- the bar: a long run down the east side with a return ------------
  const BX=IX1-2.20, BZ0=-27.4, BZ1=-16.9, BH2=1.16;     // counter front face / extent
  bx("oak",  0.70, BH2+0.08, BZ1-BZ0, BX+0.35, FY+BH2/2-0.04, (BZ0+BZ1)/2, 0.45, 0, WOODC);
  bx("stairs", 0.92, 0.13, BZ1-BZ0+0.10, BX+0.30, FY+BH2+0.045, (BZ0+BZ1)/2, 0.5, 0, BARTOP);
  bx("metal", 0.06, 0.06, BZ1-BZ0-0.16, BX-0.16, FY+0.17, (BZ0+BZ1)/2, 0, 0, BRASS); // foot rail
  cyl("stairs", 0.065,0.065, BZ1-BZ0+0.10, 12, BX-0.16, FY+BH2+0.045,               // the nose
      (BZ0+BZ1)/2, BARTOP, Math.PI/2, 0, 0);
  addCol(BX, BX+0.72, BZ0, BZ1, 0, FY+BH2);
  // The return BUTTS the long run rather than crossing it: the two carcasses
  // meet on one plane with their faces back to back, and the long run's own
  // overhanging top caps the corner. Overlapping them put four coincident
  // planes in the corner where you lean on the bar.
  const RX0=IX1-6.60, RZ=BZ1-0.35;                       // the return along the north end
  bx("oak", BX-RX0, BH2+0.08, 0.70, (RX0+BX)/2, FY+BH2/2-0.04, RZ, 0.45, 0, WOODC);
  bx("stairs", BX-RX0-0.43, 0.13, 0.92, (RX0-0.05+BX-0.48)/2, FY+BH2+0.045, RZ-0.05,
     0.5, 0, BARTOP);
  bx("metal", BX-RX0-0.35, 0.06, 0.06, (RX0+0.05+BX-0.30)/2, FY+0.17, RZ-0.44, 0, 0, BRASS);
  cyl("stairs", 0.065,0.065, BX-RX0-0.43, 12, (RX0-0.05+BX-0.48)/2, FY+BH2+0.045,
      RZ-0.51, BARTOP, 0, 0, Math.PI/2);
  addCol(RX0, BX+0.72, RZ-0.36, RZ+0.36, 0, FY+BH2);
  // back bar: shelving, bottles and a stopped clock
  // a back panel and two ends, NOT a solid box — the first version buried
  // every bottle inside its own carcass
  bx("oak", 0.09, 2.70, BZ1-BZ0+0.7, IX1-0.045, FY+1.35, (BZ0+BZ1)/2-0.35, 0.45, 0, "#4c3a26");
  for(const ez of [BZ0-0.6+0.045, BZ1+0.3-0.045])
    bx("oak", 0.42, 2.74, 0.09, IX1-0.26, FY+1.37, ez, 0.45, 0, "#513f2a");
  bx("oak", 0.38, 0.10, BZ1-BZ0+0.7, IX1-0.26, FY+2.75, (BZ0+BZ1)/2-0.35, 0.45, 0, "#513f2a");
  addCol(IX1-0.50, IX1, BZ0-0.4, BZ1+0.4, 0, FY+2.7);
  // The back bar was four shelves of one bottle repeated eighty times, which
  // reads as a warehouse rack. A real one is mostly brown and clear — whiskey
  // and well vodka — in a dozen different heights, with gaps where something
  // ran out, labels on about half of it, and a top shelf of dusty display
  // bottles nobody has poured from in years.
  const BOT=["#8a5a24","#6a4018","#7c4a1c","#cfd8d4","#dfe4e0","#3f8a46","#2f5a8a",
             "#9a2a26","#c8b070","#4a3018","#b98a3a"];
  const LAB=["#e8dcc0","#d8c07a","#c8443a","#2f3a4a","#1d1a17","#dfd4a8"];
  for(let r=0;r<4;r++){
    const sy=FY+0.945+r*0.46;
    bx("oak", 0.34, 0.05, BZ1-BZ0+0.5, IX1-0.30, sy-0.028, (BZ0+BZ1)/2-0.25, 0.45, 0, "#6a5236");
    const gap=(r===3?0.30:0.128);
    let z2=BZ0-0.20+gap*0.6;
    while(z2 < BZ1+0.22){
      if(rn() < (r===3?0.36:0.16)){ z2+=gap; continue; }        // where one ran out
      const tall=(r===3?0.30:0.21)+rn()*(r===3?0.13:0.17);
      const rad=0.039+rn()*0.021, col=BOT[(rn()*BOT.length)|0];
      cyl("glass", rad, rad*1.10, tall*0.70, 10, IX1-0.30, sy+tall*0.35, z2, col);
      cyl("glass", rad*0.96, rad*0.40, tall*0.17, 9, IX1-0.30, sy+tall*0.785, z2, col);
      cyl("glass", rad*0.33, rad*0.33, tall*0.22, 7, IX1-0.30, sy+tall*0.98, z2, col);
      if(rn()<0.58)
        cyl("paper", rad*1.05, rad*1.05, tall*0.28, 10, IX1-0.30, sy+tall*0.33, z2,
            LAB[(rn()*LAB.length)|0]);
      if(rn()<0.14)                                            // a pourer left in
        cyl("metal", rad*0.22, rad*0.30, 0.055, 6, IX1-0.30, sy+tall*1.12, z2, "#b8bcbc");
      z2+=gap*(0.88+rn()*0.42);
    }
  }
  // the mirror they all stand in front of
  bx("mirror", 0.02, 1.86, BZ1-BZ0+0.2, IX1-0.118, FY+1.82, (BZ0+BZ1)/2-0.1, 0, 0, "#cfd8dc");
  // the speed rail on the working side, and what lives under the counter
  bx("metal", 0.10, 0.06, 1.90, BX+0.80, FY+0.86, BZ0+2.6, 0, 0, "#8d9498");
  for(let i=0;i<7;i++)
    cyl("glass", 0.036,0.040,0.29,9, BX+0.80, FY+1.04, BZ0+1.78+i*0.26,
        ["#cfd8d4","#8a5a24","#6a4018","#3f8a46"][i%4]);
  (function(){                                                 // a bottle fridge
    const fx=IX1-0.62, fz=BZ0+4.6;
    bx("weathered", 0.58, 0.86, 0.56, fx, FY+0.43, fz, 0.4, 0, "#8d9498");
    bx("tvglass", 0.46, 0.66, 0.03, fx-0.30, FY+0.46, fz, 0, Math.PI/2, "#20302e");
    for(let i=0;i<9;i++)
      cyl("glass", 0.030,0.030,0.20,8, fx-0.08+((i%3)*0.09), FY+0.24+(((i/3)|0)*0.24), fz-0.16,
          "#3f8a46");
    addCol(fx-0.34, fx+0.34, fz-0.34, fz+0.34, 0, FY+0.9);
  })();
  // stacked cups, a blender that has seen things, limes, a jar of eggs
  for(let i=0;i<7;i++)
    cyl("plaster", 0.043,0.037,0.055,10, BX+0.42, FY+BH2+0.14+i*0.048, BZ0+5.9, "#e6e0d0");
  bx("weathered", 0.16,0.16,0.16, BX+0.34, FY+BH2+0.14, BZ0+6.5, 0.4, 0, "#3a3632");
  cyl("glass", 0.055,0.045,0.24,10, BX+0.34, FY+BH2+0.34, BZ0+6.5, "#c6d2d0");
  cyl("bin", 0.10,0.10,0.06,12, BX+0.30, FY+BH2+0.12, BZ0+7.1, "#5f7a4a");
  for(let i=0;i<5;i++)
    push("foliage", new T.SphereGeometry(0.028,8,6), BX+0.30+Math.cos(i*1.3)*0.05,
         FY+BH2+0.17, BZ0+7.1+Math.sin(i*1.3)*0.05, 0, "#8aa83a");
  cyl("glass", 0.075,0.075,0.22,12, BX+0.26, FY+BH2+0.20, BZ0+7.7, "#d8d2b8");
  cyl("metal", 0.078,0.078,0.03,12, BX+0.26, FY+BH2+0.32, BZ0+7.7, "#9aa1a4");
  push("clockface", planeGeo(0.44,0.44,0), IX1-0.50, FY+3.10, BZ0-0.9, -Math.PI/2, "#e8e2cf");
  for(const bz2 of [BZ0+2.2, (BZ0+BZ1)/2, BZ1-2.2]){     // the strip that lights the bottles
    bx("ceilfix", 0.10,0.05,1.60, IX1-0.45, FY+2.672, bz2, 0, 0, "#f2e9cf");
    LAMPS.push({x:IX1-0.75, y:FY+2.52, z:bz2, color:0xffd8a8, intensity:0.62, dist:5.5,
                decay:1.8, indoor:true});
  }
  // taps, a till, glasses drying, an ashtray somebody forgot
  for(let i=0;i<6;i++){
    cyl("metal", 0.026,0.026,0.30,8, BX+0.26, FY+BH2+0.19, -25.9+i*0.20, CHROME);
    bx("metal", 0.05,0.05,0.14, BX+0.19, FY+BH2+0.32, -25.9+i*0.20, 0, 0, BRASS);
  }
  bx("metal", 0.44,0.34,0.40, BX+0.30, FY+BH2+0.22, -19.6, 0.4, 0, "#5f676b");
  bx("tvglass", 0.34,0.14,0.02, BX+0.10, FY+BH2+0.30, -19.6, 0, 0, "#18201f");
  for(let i=0;i<14;i++)
    cyl("glass", 0.038,0.030,0.13,9, BX+0.20+((i%2)*0.22), FY+BH2+0.155, -23.4+((i/2)|0)*0.21, "#cfe0e6");
  // stools, and somewhere to sit on each of them. The seat is a pad with a
  // rolled rim and a dish in the middle, not a hockey puck.
  function stool(sx, sz){
    cyl("metal", 0.05,0.06,0.72,10, sx, FY+0.36, sz, CHROME);
    cyl("metal", 0.20,0.20,0.03,12, sx, FY+0.06, sz, CHROME);
    cyl("metal", 0.16,0.16,0.02,12, sx, FY+0.30, sz, CHROME);          // the foot ring
    cyl("metal", 0.21,0.21,0.02,14, sx, FY+0.715, sz, CHROME);         // the seat plate
    cyl("fabric", 0.185,0.195,0.085,14, sx, FY+0.768, sz, VINYL);
    { const g=new T.SphereGeometry(0.195,14,8); g.scale(1,0.30,1);      // the crown
      push("fabric", g, sx, FY+0.796, sz, 0, VINYL); }
    push("fabric", new T.TorusGeometry(0.175,0.035,7,16), sx, FY+0.800, sz,
         0, VINYL, Math.PI/2, 0);                                       // the rolled rim
    push("fabric", new T.SphereGeometry(0.020,8,6), sx, FY+0.820, sz, 0, "#4e222c");
  }
  for(let i=0;i<12;i++){
    const z2=BZ0+0.55+i*0.86;
    if(z2>BZ1-0.4) break;
    stool(BX-0.62, z2);
    addSeat(BX-0.62, z2, FY+0.82, -Math.PI/2, "THE BAR");
  }
  for(let i=0;i<5;i++){
    const x2=RX0+0.55+i*0.86;
    stool(x2, RZ-0.98);
    addSeat(x2, RZ-0.98, FY+0.82, Math.PI, "THE BAR");   // facing the counter
  }

  // ---- the pool table ---------------------------------------------------
  (function(){
    const px=-83.2, pz=-25.4, PW=2.34, PD=1.30;
    for(const c of [[-1,-1],[1,-1],[-1,1],[1,1]])
      bx("oak", 0.16,0.72,0.16, px+c[0]*(PW/2-0.18), FY+0.36, pz+c[1]*(PD/2-0.16), 0.4, 0, "#4a3526");
    bx("oak", PW, 0.22, PD, px, FY+0.83, pz, 0.45, 0, "#5c4029");
    bx("baize", PW-0.22, 0.05, PD-0.22, px, FY+0.955, pz, 0, 0, "#2f7a44");   // cloth
    for(const sd2 of [-1,1]){                                                 // rails
      bx("oak", PW, 0.11, 0.13, px, FY+0.99, pz+sd2*(PD/2-0.065), 0.45, 0, "#4a3526");
      bx("oak", 0.13, 0.11, PD-0.26, px+sd2*(PW/2-0.065), FY+0.99, pz, 0.45, 0, "#4a3526");
    }
    for(const c of [[-1,-1],[0,-1],[1,-1],[-1,1],[0,1],[1,1]])               // pockets
      push("bin", new T.CylinderGeometry(0.07,0.06,0.10,10),
           px+c[0]*(PW/2-0.10), FY+0.985, pz+c[1]*(PD/2-0.07), 0, "#1d1a17");
    const BALLC=["#e8d24a","#2f5eb4","#c8342a","#6a3a8e","#e07a1e","#2f7a44",
                 "#8a2a2a","#1d1a17","#e8d24a","#2f5eb4","#c8342a","#6a3a8e","#e07a1e","#2f7a44"];
    let n=0;
    for(let r=0;r<5;r++) for(let k=0;k<=r;k++){                               // the rack
      push("plaster", new T.SphereGeometry(0.029,10,8),
           px+0.52+r*0.050, FY+1.008, pz-(r*0.029)+k*0.058, 0, BALLC[n%BALLC.length]);
      n++;
    }
    push("plaster", new T.SphereGeometry(0.029,10,8), px-0.62, FY+1.008, pz+0.05, 0, "#efe9dc");
    push("oak", new T.CylinderGeometry(0.008,0.017,1.45,8), px-0.15, FY+1.010, pz-0.34,
         0.34, "#b08c52", 0, Math.PI/2);                                      // a cue left on it
    addCol(px-PW/2, px+PW/2, pz-PD/2, pz+PD/2, 0, FY+1.02);
    // two pendants over it, which is where the light in here comes from
    for(const sd2 of [-0.62, 0.62]){
      cyl("metal", 0.012,0.012,1.30,6, px+sd2, TOPY-0.75, pz, "#3a342e");
      push("lampshade", new T.CylinderGeometry(0.26,0.10,0.20,14), px+sd2, TOPY-1.48, pz, 0, "#2e2822");
      push("ceilfix", new T.SphereGeometry(0.075,10,8), px+sd2, TOPY-1.60, pz, 0, "#f2e9cf");
      LAMPS.push({x:px+sd2, y:TOPY-1.62, z:pz, color:0xffd2a0, intensity:1.0, dist:9,
                  decay:1.7, indoor:true});
    }
    // A cue rack on the north wall, square on to the table. It used to be on
    // the west wall at IX0, which is where the first booth backs onto — the
    // cues were behind the seat and you could not get at them.
    bx("oak", 0.90, 1.05, 0.10, px+0.20, FY+1.30, IZ0+0.06, 0.45, 0, "#4c3a26");
    for(let i=0;i<4;i++)
      push("oak", new T.CylinderGeometry(0.010,0.019,1.42,8), px-0.12+i*0.21, FY+1.02,
           IZ0+0.13, 0, "#b08c52", 0, 0.06);
    push("oak", boxGeo(0.86,0.04,0.09,0.5), px+0.20, FY+1.76, IZ0+0.11, 0, "#42311f");
    push("plaster", boxGeo(0.05,0.05,0.05,0), px+0.52, FY+1.80, IZ0+0.12, 0.4, "#3f6b7a");
  })();

  // ---- booths down the west wall ---------------------------------------
  const BKX=IX0+0.92, BKW=1.60;
  for(let i=0;i<3;i++){
    const bz=-27.4+i*3.9;
    for(const sd2 of [-1,1]){
      // a stained plinth, upholstery sitting on it, and a rolled nose on the
      // front of the squab — the edge you actually put your legs against
      bx("oak",    BKW-0.06, 0.21, 0.52, BKX, FY+0.105, bz+sd2*0.88, 0.5, 0, "#3f2e20");
      bx("fabric", BKW,      0.20, 0.46, BKX, FY+0.315, bz+sd2*0.89, 0.5, 0, VINYL);
      cyl("fabric", 0.105,0.105, BKW, 12, BKX, FY+0.318, bz+sd2*0.66, VINYL, 0,0,Math.PI/2);
      // the back: buttoned vinyl, rolled at the top, with a capping rail over it
      bx("fabric", BKW, 0.98, 0.13, BKX, FY+0.96, bz+sd2*1.21, 0.5, 0, "#6d3540");
      cyl("fabric", 0.072,0.072, BKW, 12, BKX, FY+1.45, bz+sd2*1.21, "#6d3540", 0,0,Math.PI/2);
      cyl("oak",   0.032,0.032, BKW+0.08, 10, BKX, FY+1.528, bz+sd2*1.21, "#4a3526",
          0,0,Math.PI/2);
      for(let r=0;r<2;r++) for(let k=0;k<3;k++)              // buttons pulled into it
        push("fabric", new T.SphereGeometry(0.022,8,6),
             BKX+(k-1)*0.44, FY+0.78+r*0.34, bz+sd2*1.132, 0, "#4e222c");
      for(const q of [-1,1])                                 // and the seams between them
        bx("fabric", 0.018, 0.92, 0.015, BKX+q*0.22, FY+0.96, bz+sd2*1.138, 0, 0, "#4e222c");
    }
    for(const sd2 of [-1,1])
      addSeat(BKX, bz+sd2*0.86, FY+0.44, sd2>0?0:Math.PI, "A BOOTH");
    // The exposed end of each divider is the hard edge you actually walk past,
    // so it gets a vertical roll and a ball where it meets the top roll. (An
    // end PANEL went in here first and stood square across the opening, in
    // front of the table: this booth runs east-west, it is not closed at the
    // near end.)
    for(const sd2 of [-1,1]) for(const q of [-1,1]){
      cyl("fabric", 0.070,0.070, 0.98, 10, BKX+q*(BKW/2), FY+0.96, bz+sd2*1.21, "#6d3540");
      push("fabric", new T.SphereGeometry(0.071,9,7), BKX+q*(BKW/2), FY+1.45,
           bz+sd2*1.21, 0, "#6d3540");
    }
    // a booth table with a rolled edge and a chrome band round it
    bx("oak", 1.36, 0.05, 0.74, BKX, FY+0.725, bz, 0.5, 0, "#6a4a2c");
    bullnose("metal", 1.36, 0.74, BKX, FY+0.725, bz, 0.030, CHROME);
    cyl("metal", 0.07,0.13,0.68,12, BKX, FY+0.36, bz, "#4a4440");
    cyl("metal", 0.24,0.26,0.035,14, BKX, FY+0.035, bz, "#4a4440");        // the foot
    for(let k=0;k<2;k++)                                    // glasses left on it
      cyl("glass", 0.036,0.030,0.12,9, IX0+0.70+k*0.34, FY+0.79, bz+(k?0.18:-0.16), "#cfe0e6");
    cyl("glass", 0.033,0.038,0.24,9, IX0+1.30, FY+0.87, bz+0.20, "#2f5e34");
    // the things that live on a booth table and never move
    cyl("glass", 0.055,0.050,0.11,10, BKX-0.42, FY+0.805, bz-0.22, "#d8d2b8");  // sugar
    bx("metal", 0.11,0.16,0.09, BKX-0.42, FY+0.83, bz+0.04, 0.4, 0, "#b8bcbc");  // napkins
    for(const q of [-1,1])                                  // salt and pepper
      cyl("glass", 0.021,0.024,0.075,8, BKX-0.26+q*0.05, FY+0.787, bz+0.22,
          q>0?"#e8e2cf":"#3a332e");
    push("bin", new T.CylinderGeometry(0.062,0.052,0.028,12), BKX+0.40, FY+0.764, bz-0.16,
         0, "#5a5048");                                      // an ashtray, never emptied
    for(let k=0;k<3;k++)
      cyl("paper", 0.006,0.006,0.05,5, BKX+0.40+Math.cos(k*2.2)*0.03, FY+0.782,
          bz-0.16+Math.sin(k*2.2)*0.03, "#d8d2c0", 1.3, k*2.0, 0);
    addCol(IX0, IX0+1.8, bz-1.35, bz+1.35, 0, FY+1.5);
  }

  // ---- loose tables in the middle of the room --------------------------
  // One chair, built round the direction it faces. The back used to be a
  // 0.42-wide box left thin on the z axis and then turned with the chair, so
  // it ended up across the seat instead of behind it.
  function chair(cxx, czz, a, tx, tz){
    const ca=Math.cos(a), sa=Math.sin(a);
    // the seat: a dished pad with its edge rolled all the way round
    bx("oak", 0.42, 0.05, 0.42, cxx, FY+0.455, czz, 0.5, -a, "#5c4029");
    for(const q of [-1,1]){
      roll("oak", 0.028, 0.42, cxx+ca*q*0.21, FY+0.455, czz+sa*q*0.21, "#5c4029", a);
      roll("oak", 0.028, 0.42, cxx-sa*q*0.21, FY+0.455, czz+ca*q*0.21, "#5c4029", a+Math.PI/2);
    }
    for(const c of [[-1,-1],[1,-1],[-1,1],[1,1]])
      push("oak", new T.SphereGeometry(0.028,8,6),
           cxx+(c[0]*0.21)*ca-(c[1]*0.21)*sa, FY+0.455, czz+(c[0]*0.21)*sa+(c[1]*0.21)*ca,
           0, "#5c4029");
    // the back: two stiles, three slats and a rail rolled over the top
    for(const q of [-1,1])
      bx("oak", 0.05, 0.54, 0.05, cxx+ca*0.185-sa*q*0.185, FY+0.75, czz+sa*0.185+ca*q*0.185,
         0.5, -a, "#4a3526");
    for(let i=0;i<3;i++)                                                     // back slats
      bx("oak", 0.035, 0.05, 0.34, cxx+ca*0.175, FY+0.62+i*0.14, czz+sa*0.175, 0.5, -a,
         "#4a3526");
    roll("oak", 0.034, 0.42, cxx+ca*0.185, FY+1.022, czz+sa*0.185, "#4a3526", a);
    for(const q of [-1,1])
      push("oak", new T.SphereGeometry(0.034,8,6), cxx+ca*0.185-sa*q*0.21,
           FY+1.022, czz+sa*0.185+ca*q*0.21, 0, "#4a3526");
    for(const c of [[-1,-1],[1,-1],[-1,1],[1,1]]){                           // legs, turned
      const lx=cxx + (c[0]*0.17)*ca - (c[1]*0.17)*sa;
      const lz=czz + (c[0]*0.17)*sa + (c[1]*0.17)*ca;
      cyl("metal", 0.020, 0.028, 0.44, 8, lx, FY+0.215, lz, "#3a3632");
      cyl("metal", 0.030, 0.030, 0.02, 8, lx, FY+0.006, lz, "#3a3632");      // the ferrule
    }
    for(const q of [-1,1])                                                   // stretchers
      roll("metal", 0.012, 0.34, cxx+ca*q*0.17, FY+0.165, czz+sa*q*0.17, "#3a3632", a);
    addCol(cxx-0.28, cxx+0.28, czz-0.28, czz+0.28, 0, FY+0.44);
    addSeat(cxx, czz, FY+0.49, Math.atan2(cxx-tx, czz-tz), "A TABLE");       // facing in
  }
  // Two rows parallel to the bar with a clear lane between them, the way the
  // reference lays them out. The first arrangement was scattered at random and
  // two of them were standing in the booths.
  // Two rows on a 3.8 m pitch with a walking lane between them and a metre of
  // daylight off the booths. Nothing sits west of -84.7, which is where the
  // booth backs and the pool table's cueing room begin.
  // Two rows parallel to the bar with a wide lane between them, spread the
  // length of the room: four metres between tables down a row, four and a
  // half across, and both rows clear of the pool table's cueing side, the
  // oche, the door lane and the counter return.
  const TBL=[[-75.8,-26.0,2],[-75.8,-22.0,4],[-75.8,-17.8,2],
             [-80.4,-23.0,2],[-80.4,-19.0,2],[-80.4,-16.0,2]];
  for(let t=0;t<TBL.length;t++){
    const tx=TBL[t][0], tz=TBL[t][1];
    bx("oak", 0.92, 0.06, 0.92, tx, FY+0.745, tz, 0.5, 0, "#7a5734");
    bullnose("oak", 0.92, 0.92, tx, FY+0.745, tz, 0.032, "#6a4a2c");
    cyl("metal", 0.06,0.16,0.70,10, tx, FY+0.37, tz, "#3e3a36");
    cyl("metal", 0.27,0.30,0.035,14, tx, FY+0.035, tz, "#3e3a36");          // the cast foot
    cyl("metal", 0.10,0.10,0.025,12, tx, FY+0.725, tz, "#3e3a36");          // the top plate
    for(let k=0;k<2;k++)                                                     // beer mats
      cyl("paper", 0.048,0.048,0.004,10, tx+Math.cos(k*2.6+1.1)*0.30, FY+0.778,
          tz+Math.sin(k*2.6+1.1)*0.30, k?"#c8b070":"#b8402f");
    addCol(tx-0.5, tx+0.5, tz-0.5, tz+0.5, 0, FY+0.8);
    for(let k=0;k<3;k++){                                   // candle, glasses
      cyl("glass", 0.034,0.028,0.12,9, tx+Math.cos(k*2.1)*0.26, FY+0.83, tz+Math.sin(k*2.1)*0.26,
          "#cfe0e6");
    }
    push("ceilfix", new T.CylinderGeometry(0.035,0.035,0.09,10), tx, FY+0.82, tz-0.02, 0, "#f2e4c0");
    const ch=TBL[t][2];                       // two facing across it, or four round
    for(let k=0;k<ch;k++){
      const a=(ch===2 ? (k?Math.PI:0) : k*Math.PI/2);
      chair(tx+Math.cos(a)*0.86, tz+Math.sin(a)*0.86, a, tx, tz);
    }
  }

  // ---- what is on the walls --------------------------------------------
  // every poster is 0.85 x 1.19 m — a 5:7 sheet — whichever wall it is on
  const PW=0.85, PH2=1.19;
  function poster(i,x,y,z,ry){ push("pic:poster:"+i, new T.PlaneGeometry(PW,PH2),
                                    x, y, z, ry, "#ffffff"); }
  // Two of these were hung on wall nobody can see: one at z = -16.2 on the
  // west wall, which is the stage, behind the 4x12 and the bass rig; and one
  // at IX1 near IZ1, which is where the jukebox stands. Six on the walls that
  // are actually walls.
  const PW2=[[0,IX0+0.04,-25.0,Math.PI/2],[1,IX0+0.04,-21.9,Math.PI/2],
             [2,-86.4,IZ0+0.04,0],[3,-74.6,IZ0+0.04,0],
             [4,IX1-0.06,-23.6,-Math.PI/2],[5,-77.4,IZ1-0.04,Math.PI]];
  for(const q of PW2) poster(q[0], q[1], FY+1.95+rr(-0.12,0.12), q[2], q[3]);
  poster(3, -83.2, FY+2.66, IZ0+0.04, 0);
  poster(5, -71.8, FY+1.90, IZ1-0.04, Math.PI);
  // dartboard, with the throw line scuffed into the boards
  push("bin", new T.CylinderGeometry(0.24,0.24,0.06,18), -75.6, FY+1.72, IZ0+0.07,
       0, "#2a2622", Math.PI/2, 0);
  push("baize", new T.CylinderGeometry(0.21,0.21,0.02,18), -75.6, FY+1.72, IZ0+0.11,
       0, "#1f5c38", Math.PI/2, 0);
  push("plaster", new T.CylinderGeometry(0.035,0.035,0.02,12), -75.6, FY+1.72, IZ0+0.13,
       0, "#e8e2cf", Math.PI/2, 0);
  bx("oak", 1.00, 1.00, 0.06, -75.6, FY+1.72, IZ0+0.04, 0.5, 0, "#3e342c");
  bx("paint", 0.90, 0.02, 0.08, -75.6, FY+0.02, IZ0+2.38, 0, 0, "#c9bb92");
  // a screen nobody is watching, and a jukebox
  bx("weathered", 1.58, 1.28, 0.10, IX0+0.10, FY+2.62, -20.6, 0.4, Math.PI/2, "#3a342e");
  push("pic:tv:1", new T.PlaneGeometry(1.44, 1.08), IX0+0.16, FY+2.62, -20.6,
       Math.PI/2, "#ffffff");
  for(const q of [-0.62,0.62])                              // the bracket it hangs off
    bx("metal", 0.06, 0.34, 0.06, IX0+0.22, FY+3.34, -20.6+q, 0, 0, "#5b5f62");
  (function(){
    const jx=IX1-1.10, jz=IZ1-0.90;
    bx("oak", 0.86, 1.42, 0.56, jx, FY+0.71, jz, 0.45, 0, "#5c3a28");
    bx("tvglass", 0.70, 0.46, 0.04, jx, FY+1.08, jz-0.30, 0, 0, "#1b2226");
    NEON.push(signPanel(0.72, 0.16, signTex(256,64,(x,W,H2)=>{
      x.fillStyle="#120f0e"; x.fillRect(0,0,W,H2);
      x.fillStyle="#f0b83a"; fitSerif(x,"Make Your Selection", W*0.78, H2*0.56, W/2, H2*0.56);
    }), jx, FY+1.38, jz-0.31, 0, true));
    addCol(jx-0.5, jx+0.5, jz-0.35, jz+0.35, 0, FY+1.5);
    LAMPS.push({x:jx, y:FY+1.3, z:jz-0.6, color:0xffb84a, intensity:0.42, dist:5,
                decay:1.7, indoor:true});
  })();
  // pendants over the bar and the tables
  for(const q of [[BX-0.5,-25.6],[BX-0.5,-21.0],[RX0+1.8,RZ-1.4],[-84.4,-21.4],[-77.6,-19.6]]){
    cyl("metal", 0.012,0.012,1.05,6, q[0], TOPY-0.62, q[1], "#3a342e");
    push("lampshade", new T.ConeGeometry(0.22,0.22,14), q[0], TOPY-1.24, q[1], 0, "#3a3028");
    push("ceilfix", new T.SphereGeometry(0.065,10,8), q[0], TOPY-1.34, q[1], 0, "#f2e9cf");
    LAMPS.push({x:q[0], y:TOPY-1.36, z:q[1], color:0xffcf96, intensity:0.80, dist:8,
                decay:1.7, indoor:true});
  }
  // a cigarette machine, a chalkboard, an extinguisher, coat hooks, a bin
  bx("oak", 0.62, 1.60, 0.42, -86.6, FY+0.80, IZ0+0.24, 0.45, 0, "#4a3a2c");
  bx("tvglass", 0.52, 0.66, 0.03, -86.6, FY+1.16, IZ0+0.04, 0, 0, "#1a2022");
  for(let i=0;i<5;i++) bx("metal", 0.03,0.10,0.03, -86.82+i*0.11, FY+0.70, IZ0+0.03, 0,0,CHROME);
  bx("oak", 1.50, 0.96, 0.07, -73.0, FY+2.10, IZ0+0.06, 0.5, 0, "#3e342c");
  bx("baize", 1.34, 0.80, 0.03, -73.0, FY+2.10, IZ0+0.10, 0, 0, "#20241f");
  cyl("metal", 0.075,0.075,0.44,12, IX1-0.60, FY+0.30, IZ0+0.55, "#a82e22");
  cyl("metal", 0.05,0.05,0.10,10, IX1-0.60, FY+0.56, IZ0+0.55, "#3a3632");
  bx("oak", 2.20, 0.10, 0.08, -78.4, FY+1.86, IZ1-0.06, 0.5, 0, "#4a3a2c");
  for(let i=0;i<6;i++) cyl("metal", 0.016,0.016,0.10,6, -79.4+i*0.40, FY+1.80, IZ1-0.14,
                           CHROME, Math.PI/2, 0, 0);
  cyl("bin", 0.23,0.19,0.52,14, -87.2, FY+0.26, IZ1-0.70, "#3e443f");
  // a high top by the window, and one against the dado under the screen
  /* One high top, not two, and nowhere near the door or the darts. The
     pair stood at -77.9 and -74.2: the first a metre and a half inside the
     front door, so walking in you came face to face with a table and two
     stools, and the second square in the throwing lane between the
     dartboard (x -75.6) and its oche. */
  for(const q of [[-71.6,-28.55]]){
    bx("oak", 0.76, 0.07, 0.76, q[0], FY+1.04, q[1], 0.5, 0, "#7a5734");
    cyl("metal", 0.06,0.15,1.02,10, q[0], FY+0.51, q[1], "#3e3a36");
    cyl("metal", 0.34,0.34,0.03,14, q[0], FY+0.03, q[1], "#4a4640");
    addCol(q[0]-0.42, q[0]+0.42, q[1]-0.42, q[1]+0.42, 0, FY+1.1);
    push("ceilfix", new T.CylinderGeometry(0.035,0.035,0.09,10), q[0], FY+1.12, q[1], 0, "#f2e4c0");
    for(const sd2 of [-1,1]){                              // two bar stools at it
      const sx2=q[0]+sd2*0.82;
      cyl("metal", 0.05,0.06,0.74,10, sx2, FY+0.37, q[1], CHROME);
      cyl("metal", 0.20,0.20,0.03,12, sx2, FY+0.06, q[1], CHROME);
      cyl("fabric", 0.19,0.19,0.10,14, sx2, FY+0.79, q[1], VINYL);
      addSeat(sx2, q[1], FY+0.84, sd2>0?Math.PI/2:-Math.PI/2, "A HIGH TOP");
    }
  }
  /* Stools stacked in a corner — the front-left one. They were in the
     back-left, which became the stage afterwards: the stack stood on the
     floor up through the stage deck and inside the 4x12 on it. */
  for(let i=0;i<3;i++)
    cyl("fabric", 0.19,0.19,0.10,14, IX0+0.40, FY+0.30+i*0.13, IZ0+0.50, VINYL);
  cyl("metal", 0.05,0.06,0.72,10, IX0+0.40, FY+0.36, IZ0+0.50, CHROME);
  addCol(IX0+0.18, IX0+0.62, IZ0+0.28, IZ0+0.72, 0, FY+0.75);
  // the door to the rest of it, which does not open
  // standing on the stage deck (FY+0.35), which was built across it later;
  // from the floor it disappeared 35 cm down into the stage
  bx("oak", 0.96, 2.05, 0.08, -86.2, FY+0.35+1.025, IZ1-0.05, 0.5, 0, "#4a3a2c");
  bx("paint", 0.22, 0.16, 0.02, -86.2, FY+0.35+1.80, IZ1-0.10, 0, 0, "#d8d2be");
  // and the bits that make it a bar: a mat, crates, a mop bucket, a sign
  bx("fabric", 2.60, 0.03, 1.10, (DHX0+DHX1)/2, FY+0.02, Z0+1.10, 0.5, 0, "#3a342e");
  for(let i=0;i<3;i++)
    bx("oak", 0.46,0.30,0.34, IX1-0.9, FY+0.15+i*0.31, BZ0-1.5, 0.5, 0.3, "#6a4a2c");
  cyl("bin", 0.20,0.17,0.32,12, IX1-0.8, FY+0.16, BZ1+1.2, "#5f7a6b");
  addCol(IX1-1.3, IX1-0.4, BZ0-1.9, BZ0-1.1, 0, FY+1.1);

  /* ---- the rest of the room -------------------------------------------- */
  // the screen they used to show fights on, hung off the west wall
  bx("oak", 0.09, 1.66, 2.70, IX0+0.10, FY+2.72, -24.6, 0.45, 0, "#3a3028");
  /* A FORTY-YEAR-OLD ROLLER SCREEN IS NOT WHITE. At #cfcabb this read as a
     blank blown-out panel hanging on the back wall — the brightest thing in
     a bar lit by forty-watt tungsten. Dirty canvas, and a stain line where
     it has hung rolled. */
  bx("plaster", 0.04, 1.50, 2.54, IX0+0.17, FY+2.72, -24.6, 0.55, 0, "#8d8878");
  bx("plaster", 0.04, 0.26, 2.48, IX0+0.178, FY+3.38, -24.6, 0.6, 0, "#7d7868");
  bx("oak", 0.09, 0.09, 2.70, IX0+0.13, FY+3.58, -24.6, 0, 0, "#2e261f");
  // bar-top furniture: napkins, caddies, a tip jar, ashtrays
  for(let i=0;i<7;i++){
    const z2=BZ0+0.9+i*1.45;
    if(z2>BZ1-0.5) break;
    cyl("plaster", 0.055,0.055,0.13,12, BX-0.06, FY+BH2+0.17, z2, "#e6e0d0");     // napkins
    bx("oak", 0.12,0.09,0.16, BX+0.10, FY+BH2+0.15, z2+0.30, 0.5, 0, "#6a4a2c");  // caddy
    if(i%2) push("bin", new T.CylinderGeometry(0.075,0.065,0.03,12),
                 BX-0.02, FY+BH2+0.12, z2-0.52, 0, "#3a3632");                    // ashtray
  }
  cyl("glass", 0.075,0.075,0.17,12, BX+0.14, FY+BH2+0.19, BZ1-1.1, "#cfe0e6");    // tip jar
  cyl("glass", 0.072,0.072,0.02,12, BX+0.14, FY+BH2+0.29, BZ1-1.1, "#b9c6c2");
  // crates of empties stacked along the wall, and a keg
  for(let k=0;k<3;k++){
    const kx=IX1-0.55, kz=BZ1+1.9+k*0.02, ky=FY+0.14+k*0.27;
    bx("oak", 0.40,0.26,0.56, kx, ky, kz, 0.5, 0, "#5f4a2c");
    for(let i=0;i<8;i++)
      cyl("glass", 0.030,0.030,0.20,8, kx-0.12+((i%2)*0.24), ky+0.19,
          kz-0.21+(((i/2)|0)*0.14), "#3f8a46");
  }
  cyl("metal", 0.22,0.22,0.56,14, IX1-0.62, FY+0.28, BZ0-2.4, "#8d9498");
  cyl("metal", 0.24,0.24,0.05,14, IX1-0.62, FY+0.58, BZ0-2.4, "#6d7377");
  // a proper spirits gantry over the back bar
  for(let i=0;i<10;i++){
    const z2=BZ0+0.9+i*0.95;
    if(z2>BZ1-0.4) break;
    cyl("glass", 0.042,0.048,0.26,9, IX1-0.62, FY+2.06, z2,
        ["#8a6026","#3a5060","#9a8a34"][i%3]);
    cyl("metal", 0.016,0.016,0.10,6, IX1-0.62, FY+1.88, z2, "#b8bcbc");
  }
  bx("oak", 0.28, 0.06, BZ1-BZ0-0.6, IX1-0.62, FY+1.86, (BZ0+BZ1)/2, 0.45, 0, "#4c3a26");
  // the restrooms, with the sign nobody has repainted
  // 25 cm east of where it was: its west jamb ran 10 cm into the stage's edge
  bx("oak", 1.00, 2.08, 0.08, -83.95, FY+1.04, IZ1-0.05, 0.5, 0, "#4a3a2c");
  bx("paint", 0.26, 0.20, 0.02, -83.95, FY+1.86, IZ1-0.10, 0, 0, "#d8d2be");
  push("bin", new T.CylinderGeometry(0.035,0.035,0.02,10), -84.03, FY+1.90, IZ1-0.12,
       0, "#2a2622", Math.PI/2, 0);
  push("bin", new T.CylinderGeometry(0.035,0.035,0.02,10), -83.87, FY+1.90, IZ1-0.12,
       0, "#2a2622", Math.PI/2, 0);
  // six more posters, because they go up and they do not come down
  for(const q of [[2,IX0+0.04,-28.0,Math.PI/2],[5,IX0+0.04,-19.4,Math.PI/2],
                  [1,-84.55,IZ0+0.04,0],[4,-69.9,IZ0+0.04,0],
                  // poster 0 east of the payphone: at -84.9 it ran over the
                  // restroom door's jamb and the stage edge
                  [0,-81.9,IZ1-0.04,Math.PI],[3,-74.2,IZ1-0.04,Math.PI]])
    poster(q[0], q[1], FY+2.06+rr(-0.14,0.14), q[2], q[3]);
  // two speakers up in the corners, wired back along the joists
  for(const q of [[IX0+0.55, IZ0+0.45, 0.5],[IX1-0.55, IZ0+0.45, -0.5]]){
    bx("weathered", 0.38, 0.58, 0.32, q[0], FY+3.26, q[1], 0.4, q[2], "#4a423a");
    push("bin", new T.CylinderGeometry(0.11,0.11,0.03,12), q[0], FY+3.34, q[1]-0.16,
         q[2], "#2a2622", Math.PI/2, 0);
  }
  // a ceiling fan that has not turned in a while
  cyl("metal", 0.030,0.030,0.34,8, -79.0, TOPY-0.34, -21.8, "#3a342e");
  cyl("weathered", 0.13,0.13,0.14,12, -79.0, TOPY-0.56, -21.8, "#4a423a");
  for(let i=0;i<4;i++)
    push("oak", boxGeo(1.10,0.02,0.20,0.5), -79.0+Math.cos(i*1.571)*0.62, TOPY-0.60,
         -21.8+Math.sin(i*1.571)*0.62, -i*1.571, "#5c4029", 0, 0.05);
  // The chalk and the triangle were at (-84.9, -21.4) at waist height with
  // nothing under them — four metres off the table they belong to. On the rail.
  bx("oak", 0.26, 0.04, 0.26, -84.10, FY+1.065, -25.92, 0.5, 0.4, "#4a3526");
  push("baize", new T.BoxGeometry(0.05,0.05,0.05), -82.40, FY+1.070, -24.88, 0.4, "#2f7a44");
  /* ---- fairy lights, up since some Christmas and never taken down ------ */
  const XCOL=["#ff2f26","#2fd84a","#2f7cff","#ffb62a","#ff3fd0","#f4efd6"];
  function lights(pts, sag, spacing){
    let seq=0;
    for(let i=0;i<pts.length-1;i++){
      const a=pts[i], b2=pts[i+1];
      const dx=b2[0]-a[0], dy=b2[1]-a[1], dz=b2[2]-a[2];
      const Ln=Math.hypot(dx,dy,dz), n=Math.max(2, Math.round(Ln/spacing));
      for(let k=0;k<n;k++){
        const t0=k/n, t1=(k+1)/n;
        const p0=[a[0]+dx*t0, a[1]+dy*t0-Math.sin(t0*Math.PI)*sag, a[2]+dz*t0];
        const p1=[a[0]+dx*t1, a[1]+dy*t1-Math.sin(t1*Math.PI)*sag, a[2]+dz*t1];
        const sx=p1[0]-p0[0], sy=p1[1]-p0[1], sz=p1[2]-p0[2], SL=Math.hypot(sx,sy,sz);
        push("teal", boxGeo(SL,0.012,0.012,0), (p0[0]+p1[0])/2, (p0[1]+p1[1])/2,
             (p0[2]+p1[2])/2, Math.atan2(-sz,sx), "#2e2a26", 0, Math.asin(sy/SL));
        // on the middle of each little span, not its end — two runs that meet
        // at a corner would otherwise drop two bulbs in exactly one place
        push("xmas", new T.SphereGeometry(0.031,6,5), (p0[0]+p1[0])/2,
             (p0[1]+p1[1])/2-0.035, (p0[2]+p1[2])/2, 0, XCOL[seq++%XCOL.length]);
      }
    }
  }
  {
    const LY=TOPY-0.30, a=IX0+0.30, b2=IX1-0.30, c2=IZ0+0.30, d2=IZ1-0.30;
    lights([[a,LY,c2],[b2,LY,c2]], 0.16, 0.30);                  // round the walls
    lights([[b2,LY,c2],[b2,LY,d2]], 0.16, 0.30);
    lights([[b2,LY,d2],[a,LY,d2]], 0.16, 0.30);
    lights([[a,LY,d2],[a,LY,c2]], 0.16, 0.30);
    lights([[a,LY,c2],[b2,LY-0.55,(c2+d2)/2],[a,LY,d2]], 0.42, 0.32);   // and two swags
    lights([[b2,LY,c2],[a,LY-0.55,(c2+d2)/2],[b2,LY,d2]], 0.42, 0.32);
    lights([[BX-0.30,FY+2.30,BZ0-0.4],[BX-0.30,FY+2.30,BZ1+0.3]], 0.10, 0.26);  // over the bar
    // and along the front eave outside, which is how you find the place at night
    // hung high enough that the sag never touches the roof slab's underside
    lights([[X0+0.5,TOPY+0.52,Z0-0.34],[X1-0.5,TOPY+0.52,Z0-0.34]], 0.34, 0.34);
    lights([[X0-0.32,TOPY+0.52,Z0+0.6],[X0-0.32,TOPY+0.52,Z1-0.6]], 0.30, 0.36);
    LAMPS.push({x:-79.0, y:TOPY-0.6, z:IZ0+0.9, color:0xff4a3a, intensity:0.30, dist:9,
                decay:1.8, indoor:true});
    LAMPS.push({x:-76.0, y:TOPY-0.6, z:IZ1-0.9, color:0x35b0ff, intensity:0.26, dist:9,
                decay:1.8, indoor:true});
    LAMPS.push({x:-85.5, y:TOPY-0.6, z:-24.0,   color:0x3fd85a, intensity:0.24, dist:9,
                decay:1.8, indoor:true});
  }

  /* ---- a dado of panelling, because every bar like this has one -------- */
  {
    // It stands two centimetres proud of the brick and laps two into it, and
    // every run stops inside the wall it meets rather than on that wall's own
    // plane — flush was forty-six overlapping faces.
    const DY0=FY-0.10, DY1=FY+1.06, DT=0.08, DC="#6b4a2c";
    const EY1=DY1+0.006;                     // the side runs stand a hair taller
    const NS=(zc,holes)=>{ for(const g of segs(IX0-0.01, IX1+0.01, holes))
        bx("oak", g[1]-g[0], DY1-DY0, DT, (g[0]+g[1])/2, (DY0+DY1)/2, zc, 0.5, 0, DC); };
    const EW=(xc)=>{ bx("oak", DT, EY1-DY0, Z1-Z0-0.12, xc, (DY0+EY1)/2, (Z0+Z1)/2,
                        0.5, 0, DC); };
    NS(IZ0+0.02, [[DHX0-0.06, DHX1+0.06]]);
    NS(IZ1-0.02, []);
    EW(IX0+0.02); EW(IX1-0.02);
    // the capping rails mitre with a hair's gap rather than crossing, or the
    // four of them share a plane in every corner
    // and it stops either side of the doorway, which it was running clean
    // across at waist height
    for(const zc of [IZ0+0.04, IZ1-0.04]){
      const holes = zc<(IZ0+IZ1)/2 ? [[DHX0-0.10, DHX1+0.10]] : [];
      for(const g of segs(IX0+0.13, IX1-0.13, holes))
        bx("oak", g[1]-g[0], 0.060, 0.13, (g[0]+g[1])/2, DY1+0.010, zc, 0.5, 0, "#4e3720");
    }
    for(const xc of [IX0+0.04, IX1-0.04])
      bx("oak", 0.13, 0.064, Z1-Z0-0.12, xc, DY1+0.014, (Z0+Z1)/2, 0.5, 0, "#4e3720");
  }

  /* ---- the clutter that makes it somebody's bar ------------------------ */
  // a shelf of caps over the back bar
  bx("oak", 0.40, 0.05, BZ1-BZ0-1.0, IX1-0.27, FY+2.92, (BZ0+BZ1)/2, 0.5, 0, "#4c3a26");
  for(let i=0;i<12;i++){
    const cz=BZ0+0.9+i*0.72;
    if(cz>BZ1-0.5) break;
    const g2=new T.SphereGeometry(0.105,10,7); g2.scale(1,0.62,1.05);
    push("fabric", g2, IX1-0.30, FY+3.00, cz, i,
         ["#1d3a5c","#7a2a22","#2f4a2a","#3a3632","#6a5a2a"][i%5]);
    push("fabric", boxGeo(0.12,0.015,0.12,0.5), IX1-0.42, FY+2.985, cz, i,
         ["#1d3a5c","#7a2a22","#2f4a2a","#3a3632","#6a5a2a"][i%5]);
  }
  // framed photographs, a crisps rack, a microwave, a till receipt spike
  for(let i=0;i<5;i++)
    bx("art", 0.26, 0.20, 0.03, IX1-0.60, FY+1.62+((i%2)*0.30), BZ0+1.4+i*0.62, 0, 0, "#cfc4a8");
  bx("metal", 0.34, 0.86, 0.22, BX+0.18, FY+BH2+0.60, BZ0+0.30, 0.4, 0, "#8d9498");
  for(let i=0;i<5;i++)
    bx("paper", 0.28, 0.17, 0.03, BX+0.18, FY+BH2+0.28+i*0.17, BZ0+0.18, 0, 0,
       ["#e8c44a","#d8542a","#4a8a3a","#e0e0d0","#c8a24a"][i%5]);
  bx("weathered", 0.50, 0.30, 0.38, IX1-0.62, FY+1.12, BZ1-1.9, 0.4, 0, "#d2ccbc");
  bx("tvglass", 0.34, 0.20, 0.02, IX1-0.82, FY+1.12, BZ1-1.9, 0, 0, "#20262a");
  cyl("metal", 0.012,0.012,0.22,6, BX+0.30, FY+BH2+0.11, BZ1-2.6, "#b8bcbc");
  for(let i=0;i<6;i++)
    push("paper", planeGeo(0.09,0.13,0), BX+0.30, FY+BH2+0.07+i*0.004, BZ1-2.6, i*0.9,
         "#ffffff", -Math.PI/2+0.1, 0);
  // bar towels over the rail, and beads on a hook
  for(const q of [BZ0+3.1, BZ1-3.4])
    push("fabric", boxGeo(0.26,0.30,0.05,0.5), BX-0.02, FY+BH2-0.14, q, 0, "#c8cdc4", 0, 0.06);
  for(let i=0;i<14;i++)
    push("xmas", new T.SphereGeometry(0.016,6,5), IX1-0.66+Math.sin(i*0.9)*0.05,
         FY+2.34-i*0.035, BZ0+0.75, 0, ["#f0c93a","#7a2aa0","#2fd84a"][i%3]);
  // two more neon signs inside, where you can see them from the door
  NEON.push(signPanel(1.10, 0.66, signTex(512,307,(x,W,H2)=>{
    x.fillStyle="#0e0c0b"; x.fillRect(0,0,W,H2);
    x.strokeStyle="#2fd0c0"; x.lineWidth=7; x.strokeRect(16,16,W-32,H2-32);
    x.fillStyle="#f4d98a"; fitSerif(x,"Ice Cold", W*0.62, H2*0.30, W/2, H2*0.38);
    x.fillStyle="#e0402a"; fitSerif(x,"Longnecks", W*0.70, H2*0.26, W/2, H2*0.74);
  }), IX1-0.09, FY+3.24, BZ1-1.6, -Math.PI/2, true));
  NEON.push(signPanel(0.92, 0.55, signTex(512,306,(x,W,H2)=>{
    x.fillStyle="#0e0c0b"; x.fillRect(0,0,W,H2);
    x.strokeStyle="#ff8a2a"; x.lineWidth=6; x.strokeRect(14,14,W-28,H2-28);
    x.fillStyle="#ffb03a"; fitSerif(x,"Live Music", W*0.68, H2*0.28, W/2, H2*0.40);
    x.fillStyle="#9fe8d8"; fitSerif(x,"Fridays", W*0.52, H2*0.24, W/2, H2*0.76);
  }), IX0+0.09, FY+3.20, -17.4, Math.PI/2, true));
  // bunting over the pool table end
  for(let i=0;i<13;i++){
    const t=i/12, px2=IX0+0.7+t*6.4, py=FY+3.30-Math.sin(t*Math.PI)*0.22;
    push("fabric", new T.ConeGeometry(0.11,0.24,3), px2, py-0.12, IZ0+0.55, i*0.7,
         ["#c8202a","#f0a01e","#1d6f4e","#2b2f7a"][i%4], Math.PI, 0);
  }
  /* ---- a corner stage, for the Fridays the neon still advertises -------
     Nothing has played on it in years, but the backline never went home. */
  (function(){
    const SX0=IX0, SX1=-84.60, SZ0=-18.00, SZ1=IZ1, SH2=0.30;
    const cx2=(SX0+SX1)/2, cz2=(SZ0+SZ1)/2, SY=FY+SH2;
    bx("oak", SX1-SX0, SH2, SZ1-SZ0, cx2, FY+SH2/2, cz2, 0.5, 0, "#4a3a2c");   // the deck
    bx("stairs", SX1-SX0, 0.05, SZ1-SZ0, cx2, SY+0.02, cz2, 0.5, 0, "#3a342e");
    bx("paint", SX1-SX0, 0.08, 0.05, cx2, SY-0.06, SZ0+0.02, 0, 0, "#c8b870");  // the nosing
    bx("paint", 0.05, 0.08, SZ1-SZ0, SX1-0.02, SY-0.06, cz2, 0, 0, "#c8b870");
    addFlat(SX0, SX1, SZ0, SZ1, SY+0.045);
    addCol(SX0, SX1, SZ0, SZ0+0.10, 0, SY);                  // you step up, not through
    bx("concrete", 0.90, 0.15, 0.50, SX1-1.20, FY+0.075, SZ0-0.26, 0.5, 0, "#8d877c");
    addFlat(SX1-1.65, SX1-0.75, SZ0-0.52, SZ0, FY+0.15);
    // a 4x12 against the wall with a head on it, and a combo beside it
    bx("weathered", 0.78, 0.76, 0.36, SX0+0.62, SY+0.38, SZ1-0.44, 0.45, 0, "#2b2723");
    for(let i=0;i<4;i++)
      push("bin", new T.CylinderGeometry(0.15,0.15,0.03,14), SX0+0.44+((i%2)*0.36),
           SY+0.20+(((i/2)|0)*0.36), SZ1-0.62, 0, "#4a4038", 0, Math.PI/2);
    bx("weathered", 0.74, 0.22, 0.30, SX0+0.62, SY+0.87, SZ1-0.44, 0.45, 0, "#3a342c");
    for(let i=0;i<6;i++)
      cyl("metal", 0.018,0.018,0.03,8, SX0+0.34+i*0.11, SY+0.93, SZ1-0.60, "#c9b06a",
          Math.PI/2, 0, 0);
    push("ember", boxGeo(0.02,0.012,0.012,0), SX0+0.90, SY+0.93, SZ1-0.60, "#ff5a1e");
    bx("weathered", 0.56, 0.48, 0.30, SX0+1.62, SY+0.24, SZ1-0.46, 0.45, 0.22, "#3b322a");
    push("bin", new T.CylinderGeometry(0.16,0.16,0.03,14), SX0+1.62, SY+0.22, SZ1-0.62,
         0.22, "#4a4038", 0, Math.PI/2);
    // a wedge, a mic on a boom, a stool and a lead somebody coiled badly
    push("weathered", boxGeo(0.52,0.26,0.36,0.45), SX1-0.90, SY+0.13, SZ0+0.52, 0.5,
         "#2b2723", -0.42, 0);
    cyl("metal", 0.030,0.030,1.40,8, SX1-1.30, SY+0.70, cz2+0.10, "#4e5458");
    cyl("metal", 0.16,0.16,0.03,12, SX1-1.30, SY+0.02, cz2+0.10, "#4e5458");
    cyl("metal", 0.020,0.020,0.46,7, SX1-1.48, SY+1.38, cz2+0.10, "#4e5458", 0,0,Math.PI/2);
    cyl("metal", 0.026,0.022,0.14,9, SX1-1.70, SY+1.36, cz2+0.10, "#2b2723", 0,0,1.2);
    cyl("oak", 0.26,0.30,0.05,14, SX1-0.55, SY+0.62, SZ1-0.80, "#5c4029");
    for(const c of [[-1,-1],[1,-1],[-1,1],[1,1]])
      cyl("metal", 0.016,0.020,0.60,7, SX1-0.55+c[0]*0.18, SY+0.30, SZ1-0.80+c[1]*0.18,
          "#4e5458", c[1]*0.10, 0, -c[0]*0.10);
    for(let i=0;i<9;i++){                                   // the lead, coiled badly
      const a=i*0.78, r=0.22+((i*7)%3)*0.05;
      push("teal", new T.TorusGeometry(r,0.013,5,12), SX1-2.10+Math.cos(a)*0.10,
           SY+0.016+i*0.004, cz2-0.55+Math.sin(a)*0.10, a*0.3, "#22201e", Math.PI/2, 0);
    }
    for(let i=0;i<5;i++)                                    // gaffer over the cable run
      push("soot", planeGeo(0.09,0.50,0), SX1-1.30, SY+0.05, cz2+0.32+i*0.30, 0,
           "#2a2724", -Math.PI/2, 0);
    // two par cans on a bar, one of them still warm
    cyl("metal", 0.026,0.026,SX1-SX0-0.5,8, cx2, FY+2.96, SZ0+0.34, "#3a3632", 0,0,Math.PI/2);
    for(const q of [-1.1, 1.1])                            // and the drops it hangs on
      cyl("metal", 0.008,0.008, TOPY-0.18-(FY+2.96), 6, cx2+q,
          (TOPY-0.18+FY+2.96)/2, SZ0+0.34, "#6e6a62");
    for(const q of [-0.9, 0.55]){
      cyl("weathered", 0.11,0.13,0.22,12, cx2+q, FY+2.80, SZ0+0.34, "#2b2723", 0.5, 0, 0);
      cyl("metal", 0.020,0.020,0.16,6, cx2+q, FY+2.90, SZ0+0.34, "#3a3632");
    }
    LAMPS.push({x:cx2-0.9, y:FY+2.60, z:SZ0+0.60, color:0xff8a4a, intensity:0.34,
                dist:7, decay:1.7, indoor:true});
    // the board somebody hand-lettered, leaning where it was left
    push("oak", boxGeo(0.66,0.92,0.04,0.5), SX0+2.30, SY+0.46, SZ1-0.16, 0, "#d8cba8",
         0, 0.16);
    for(let i=0;i<4;i++)
      push("soot", planeGeo(0.44,0.07,0), SX0+2.34, SY+0.72-i*0.18, SZ1-0.20, 0,
           "#3a2f22", 0, 0.16);
    // ---- the backline nobody came back for --------------------------
    // The kit sits on its rug in the corner the two walls make, facing the
    // open diagonal, because that is the only way a kit fits a corner stage.
    const KX=-86.70, KZ=-16.30, KA=-0.72;               // centre, and which way it faces
    const cosK=Math.cos(KA), sinK=Math.sin(KA);
    const K=(lx,lz)=>[KX+lx*cosK+lz*sinK, KZ-lx*sinK+lz*cosK];
    const SHELL="#8a2f2a", HW="#b9bdbd", HEAD="#e6dfcd", BRASS2="#b8992f";
    push("carpet", boxGeo(1.70,0.02,1.55,0.8), KX, SY+0.055, KZ, KA, "#5a2a28");
    {                                                   // the kick, on its side
      const [bx2,bz2]=K(0,0.10);
      cyl("weathered", 0.285,0.285,0.42,16, bx2, SY+0.35, bz2, SHELL, Math.PI/2, KA, 0);
      for(const sd of [-1,1])                           // the hoops, front and back
        push("oak", new T.TorusGeometry(0.288,0.022,5,18), K(0,0.10+sd*0.215)[0], SY+0.35,
             K(0,0.10+sd*0.215)[1], KA, "#d8cba8", 0, 0);
      const [hx,hz]=K(0,-0.11);
      cyl("bell", 0.270,0.270,0.02,16, hx, SY+0.35, hz, HEAD, Math.PI/2, KA, 0);
      for(const sd of [-1,1]){                          // the spurs it stands on
        const [lx2,lz2]=K(sd*0.27, 0.06);
        cyl("metal", 0.012,0.012,0.34,7, lx2, SY+0.17, lz2, HW, 0.30, KA, sd*0.42);
      }
      const [px,pz]=K(0.02,-0.34);                      // and the pedal
      push("metal", boxGeo(0.10,0.03,0.26,0), px, SY+0.07, pz, KA, "#6f767a");
      cyl("metal", 0.030,0.030,0.13,8, K(0.02,-0.25)[0], SY+0.20, K(0.02,-0.25)[1],
          "#3a3632", 0.5, KA, 0);
    }
    {                                                   // two rack toms off the kick
      const mts=K(0,0.10);
      cyl("metal", 0.016,0.016,0.30,7, mts[0], SY+0.70, mts[1], HW);
      for(const sd of [-1,1]){
        const [tx,tz]=K(sd*0.21, -0.02);
        cyl("weathered", 0.145+0.02*(sd<0?1:0), 0.150, 0.24, 14, tx, SY+0.86, tz,
            SHELL, 0.42, KA, -sd*0.26);
        cyl("bell", 0.140,0.140,0.02,14, tx, SY+0.955, tz, HEAD, 0.42, KA, -sd*0.26);
      }
    }
    {                                                   // floor tom on three legs
      const [fx,fz]=K(0.46,-0.30);
      cyl("weathered", 0.205,0.205,0.34,14, fx, SY+0.50, fz, SHELL);
      cyl("bell", 0.200,0.200,0.02,14, fx, SY+0.675, fz, HEAD);
      for(let i=0;i<3;i++){
        const b=i*2.09+0.4;
        cyl("metal", 0.011,0.011,0.44,6, fx+Math.cos(b)*0.19, SY+0.24, fz+Math.sin(b)*0.19,
            HW, Math.cos(b)*0.10, 0, -Math.sin(b)*0.10);
      }
    }
    {                                                   // snare, hats, ride, crash
      const [sx3,sz3]=K(-0.30,-0.28);
      cyl("metal", 0.150,0.150,0.135,14, sx3, SY+0.545, sz3, HW, 0.10, KA, 0);
      cyl("bell", 0.148,0.148,0.02,14, sx3, SY+0.617, sz3, HEAD, 0.10, KA, 0);
      for(let i=0;i<3;i++){
        const b=i*2.09+1.1;
        cyl("metal", 0.010,0.010,0.48,6, sx3+Math.cos(b)*0.15, SY+0.25, sz3+Math.sin(b)*0.15,
            HW, Math.cos(b)*0.14, 0, -Math.sin(b)*0.14);
      }
      const cym=(lx,lz,h,r,tilt)=>{
        const [cx3,cz3]=K(lx,lz);
        cyl("metal", 0.010,0.013,h,6, cx3, SY+h/2, cz3, HW);
        cyl("bell", r,r,0.010,18, cx3, SY+h, cz3, BRASS2, tilt, KA, 0);
        cyl("bell", 0.035,0.035,0.030,10, cx3, SY+h+0.018, cz3, BRASS2, tilt, KA, 0);
      };
      cym(-0.60,-0.10, 0.80, 0.175, 0.16);              // the hats, closed
      const [hh,hz2]=K(-0.60,-0.10);
      cyl("bell", 0.175,0.175,0.010,18, hh, SY+0.755, hz2, BRASS2, -0.10, KA, 0);
      cym( 0.52, 0.22, 1.20, 0.245, 0.26);              // the ride
      cym(-0.46, 0.30, 1.32, 0.205, -0.30);             // and the crash
      const [thx,thz]=K(0,-0.72);                       // the throne
      cyl("fabric", 0.165,0.170,0.085,14, thx, SY+0.545, thz, "#2b2723");
      cyl("metal", 0.035,0.045,0.50,8, thx, SY+0.25, thz, HW);
      for(let i=0;i<3;i++){
        const b=i*2.09;
        cyl("metal", 0.012,0.012,0.30,6, thx+Math.cos(b)*0.13, SY+0.10, thz+Math.sin(b)*0.13,
            HW, Math.cos(b)*0.55, 0, -Math.sin(b)*0.55);
      }
    }
    addCol(KX-0.62, KX+0.52, KZ-0.58, KZ+0.58, 0, SY+0.70);
    // a bass rig stacked beside the guitar cab, and two guitars on stands
    bx("weathered", 0.60, 0.74, 0.40, SX0+0.50, SY+1.13, SZ1-1.08, 0.45, 0.20, "#241f1c");
    for(let i=0;i<4;i++)
      push("bin", new T.CylinderGeometry(0.115,0.115,0.025,12), SX0+0.36+((i%2)*0.28),
           SY+0.98+(((i/2)|0)*0.30), SZ1-1.26, 0.20, "#3e352e", 0, Math.PI/2);
    const gtr=(gx2,gz2,ga,body,neck)=>{
      for(const sd of [-1,1])                           // the stand's two legs
        cyl("metal", 0.012,0.012,0.42,6, gx2+Math.cos(ga+sd*0.5)*0.11, SY+0.20,
            gz2+Math.sin(ga+sd*0.5)*0.11, "#3a3632", Math.cos(ga)*0.18, 0, -Math.sin(ga)*0.18);
      const lean=0.22, si2=Math.sin(lean), co2=Math.cos(lean);
      const dx2=Math.sin(ga)*si2, dz2=Math.cos(ga)*si2;
      push("oak", boxGeo(0.33,0.42,0.055,0.5), gx2+dx2*0.32, SY+0.42+co2*0.32,
           gz2+dz2*0.32, ga, body, lean, 0);
      push("oak", blobGeo(0.155), gx2+dx2*0.26, SY+0.40+co2*0.26, gz2+dz2*0.26, ga, body);
      push("oak", boxGeo(0.058,0.78,0.030,0), gx2+dx2*0.92, SY+0.42+co2*0.92,
           gz2+dz2*0.92, ga, neck, lean, 0);
      push("oak", boxGeo(0.085,0.20,0.028,0), gx2+dx2*1.34, SY+0.42+co2*1.34,
           gz2+dz2*1.34, ga, "#2f2722", lean, 0);
      push("metal", boxGeo(0.30,0.09,0.035,0), gx2+dx2*0.30, SY+0.40+co2*0.30,
           gz2+dz2*0.30, ga, "#a9aeb2", lean, 0);
    };
    gtr(SX0+2.42, SZ1-0.52, 0.30, "#6b3a22", "#c0a06a");
    gtr(SX0+2.74, SZ1-0.86, 0.55, "#2f3f5c", "#c0a06a");
    // two PA columns, one at each open corner, on their own poles
    for(const q of [[SX0+0.34, SZ0+0.40], [SX1-0.34, SZ0+0.40]]){
      cyl("metal", 0.038,0.048,1.34,8, q[0], SY+0.67, q[1], "#3a3632");
      cyl("metal", 0.22,0.22,0.03,12, q[0], SY+0.02, q[1], "#3a3632");
      bx("weathered", 0.36, 0.72, 0.30, q[0], SY+1.66, q[1], 0.45, 0.12, "#241f1c");
      for(let i=0;i<2;i++)
        push("bin", new T.CylinderGeometry(0.105,0.105,0.022,12), q[0], SY+1.48+i*0.34,
             q[1]-0.14, 0.12, "#3e352e", 0, Math.PI/2);
      push("bin", new T.CylinderGeometry(0.045,0.045,0.020,10), q[0], SY+1.92, q[1]-0.14,
           0.12, "#3e352e", 0, Math.PI/2);
    }
    // a second mic, a setlist taped to the deck, and what was left on the amp
    cyl("metal", 0.028,0.028,1.32,8, SX1-0.62, SY+0.66, SZ0+1.05, "#4e5458");
    cyl("metal", 0.15,0.15,0.03,12, SX1-0.62, SY+0.02, SZ0+1.05, "#4e5458");
    cyl("metal", 0.024,0.020,0.13,9, SX1-0.62, SY+1.34, SZ0+1.02, "#2b2723", 0.5, 0, 0);
    push("paper", boxGeo(0.17,0.006,0.24,0), SX1-1.05, SY+0.055, SZ0+0.42, 0.18, "#ded6bc");
    for(let i=0;i<6;i++)
      push("soot", planeGeo(0.11,0.012,0), SX1-1.05, SY+0.062, SZ0+0.35+i*0.028, 0.18,
           "#3a332a", -Math.PI/2, 0);
    for(const q of [[SX0+0.42,SZ1-0.30],[SX0+1.48,SZ1-0.34],[SX0+1.70,SZ1-0.30]])
      cyl("glass", 0.033,0.028,0.22,10, q[0], SY+1.36, q[1], "#3f5a2e");
    // the banner that went up for one Friday and stayed up
    push("fabric", planeGeo(2.30,0.60,0), SX0+0.09, FY+2.60, (SZ0+SZ1)/2+0.30,
         Math.PI/2, "#3a1f1e");
    push("fabric", planeGeo(2.30,0.05,0), SX0+0.10, FY+2.90, (SZ0+SZ1)/2+0.30,
         Math.PI/2, "#8a6a2a");
    push("fabric", planeGeo(2.30,0.05,0), SX0+0.10, FY+2.31, (SZ0+SZ1)/2+0.30,
         Math.PI/2, "#8a6a2a");
    addCol(SX0, SX0+1.1, SZ1-0.7, SZ1, 0, SY+1.0);
    addZone(SX0, SX1, SZ0, SZ1, 0, FY+2.2, "THE STAGE");
  })();

  /* ---- the working side of the bar ------------------------------------ */
  (function(){
    const wx=(BX+0.72+IX1-0.50)/2;                    // the bartender's lane
    push("soot", planeGeo(0.82, BZ1-BZ0-1.4, 0), wx, FY+0.012, (BZ0+BZ1)/2, Math.PI/2,
         "#2e2a26", -Math.PI/2, 0);                   // the rubber mat
    for(let i=0;i<18;i++)
      push("bin", boxGeo(0.70,0.012,0.030,0), wx, FY+0.020, BZ0+1.0+i*0.48, 0, "#26241f");
    // a sink with a drainer and one glass still in it
    bx("metal", 0.58, 0.14, 0.86, wx, FY+0.86, BZ0+3.5, 0.5, 0, "#8d9498");
    push("metal", boxGeo(0.44,0.10,0.72,0.5), wx, FY+0.855, BZ0+3.5, 0, "#6f767a");
    cyl("metal", 0.016,0.016,0.30,8, wx-0.20, FY+1.02, BZ0+3.5, CHROME);
    cyl("metal", 0.012,0.012,0.18,8, wx-0.14, FY+1.16, BZ0+3.5, CHROME, 0,0,Math.PI/2);
    for(let i=0;i<4;i++)
      cyl("glass", 0.036,0.030,0.12,9, wx+0.10+((i%2)*0.14), FY+0.93, BZ0+3.2+((i/2)|0)*0.26,
          "#cfe0e6", Math.PI, 0, 0);
    // the ice well, and a soda gun on its hose
    bx("metal", 0.46, 0.44, 0.62, wx, FY+0.66, BZ0+5.2, 0.5, 0, "#7d8387");
    push("plaster", boxGeo(0.38,0.10,0.54,0.4), wx, FY+0.86, BZ0+5.2, 0, "#e6eef0");
    cyl("metal", 0.026,0.026,0.16,8, wx-0.18, FY+1.02, BZ0+5.0, "#5f676b", 0.5, 0, 0);
    for(let i=0;i<6;i++)
      push("teal", new T.TorusGeometry(0.09,0.011,5,10), wx-0.20, FY+0.72-i*0.05, BZ0+4.9,
           0, "#2a2724", Math.PI/2+i*0.12, 0);
    // a register on the counter, a tip jar, and a bell
    bx("metal", 0.42, 0.28, 0.36, BX+0.30, FY+BH2+0.14, BZ0+6.9, 0.45, 0, "#6f5a3a");
    bx("metal", 0.36, 0.10, 0.28, BX+0.30, FY+BH2+0.33, BZ0+6.9, 0.45, 0, "#5b4a30");
    for(let r=0;r<3;r++) for(let c=0;c<5;c++)
      push("plaster", new T.CylinderGeometry(0.018,0.018,0.012,8),
           BX+0.16+c*0.075, FY+BH2+0.29, BZ0+6.78+r*0.08, 0, "#d8d2c0", Math.PI/2, 0);
    cyl("glass", 0.075,0.065,0.19,12, BX+0.26, FY+BH2+0.095, BZ0+7.9, "#cfe0e6");
    for(let i=0;i<5;i++)
      push("paper", boxGeo(0.10,0.005,0.06,0), BX+0.26+((i*5)%3-1)*0.02, FY+BH2+0.03+i*0.012,
           BZ0+7.9+((i*7)%3-1)*0.02, i*1.4, "#9aa882", i*0.2, i*0.3);
    push("bell", new T.SphereGeometry(0.055,12,9), BX+0.30, FY+BH2+0.06, BZ0+6.2, 0, "#caa23c");
  })();

  /* ---- the ceiling nobody has looked at since it went up -------------- */
  {
    bx("metal", 0.62, 0.05, 0.62, -72.4, TOPY-0.12, -22.8, 0.5, 0, "#7d8387");   // a vent
    for(let i=0;i<7;i++)
      bx("metal", 0.56, 0.012, 0.030, -72.4, TOPY-0.145, -23.06+i*0.086, 0, 0, "#5f676b");
    // a mirror ball somebody put up one New Year and left
    cyl("metal", 0.008,0.008,0.46,6, -77.4, TOPY-0.25, -21.0, "#6e6a62");
    push("mirror", new T.SphereGeometry(0.17,12,9), -77.4, TOPY-0.62, -21.0, 0, "#c8d2d6");
    for(let i=0;i<20;i++)                                   // and the facets that survived
      push("mirror", boxGeo(0.055,0.055,0.012,0), -77.4+Math.cos(i*1.9)*0.165,
           TOPY-0.62+Math.sin(i*0.7)*0.15, -21.0+Math.sin(i*1.9)*0.165, i*0.8, "#dfe8ea",
           i*0.3, i*0.5);
    for(const q of [[-79.0,-24.6],[-74.0,-19.4],[-83.0,-20.2]])   // smoke on the boards above
      push("soot", planeGeo(3.0,2.2,0), q[0], TOPY-0.115, q[1], 0.3, "#3a332a", Math.PI/2, 0);
  }

  /* ---- what is pinned up by the door ---------------------------------- */
  (function(){
    const nx=-77.2, nz=IZ0+0.06;
    bx("oak", 1.40, 0.90, 0.05, nx, FY+1.80, nz, 0.5, 0, "#5b4632");
    bx("bath", 1.28, 0.78, 0.02, nx, FY+1.80, nz+0.02, 0.5, 0, "#8a7f63");
    for(let i=0;i<17;i++){                                  // cards, polaroids, a rota
      const cw=0.10+((i*7)%4)*0.045, ch=0.07+((i*5)%3)*0.05;
      push("paper", planeGeo(cw,ch,0), nx-0.54+((i*0.29)%1.12), FY+1.48+((i*0.23)%0.62),
           nz+0.035+i*0.0008, ((i*11)%7-3)*0.08,
           ["#efeade","#e6d9a8","#dfe6e4","#d8c8a8","#cfe0e6"][i%5], 0, 0);
      if(i%4===0) push("plaster", new T.CylinderGeometry(0.008,0.008,0.012,6),
                       nx-0.54+((i*0.29)%1.12), FY+1.48+((i*0.23)%0.62)+ch*0.4, nz+0.045,
                       0, "#c8342a", Math.PI/2, 0);
    }
    for(let i=0;i<5;i++){                                   // coat hooks, one coat
      bx("metal", 0.05,0.05,0.09, nx+1.35+i*0.24, FY+1.74, nz+0.04, 0, 0, "#8d9498");
      push("metal", new T.SphereGeometry(0.026,8,6), nx+1.35+i*0.24, FY+1.70, nz+0.09,
           0, "#8d9498");
    }
    push("fabric", boxGeo(0.36,0.80,0.14,0.5), nx+1.83, FY+1.30, nz+0.12, 0.15,
         "#5a4a38", 0, -0.08);
    // and the fish somebody caught, in a hat that is not his
    bx("oak", 0.72, 0.34, 0.05, -71.6, FY+2.40, IZ0+0.06, 0.5, 0, "#4e3720");
    { const g=new T.SphereGeometry(0.15,12,9); g.scale(2.0,0.70,0.45);
      push("foliage", g, -71.6, FY+2.40, IZ0+0.12, 0, "#4e6a58"); }
    push("foliage", new T.ConeGeometry(0.11,0.20,6), -71.94, FY+2.40, IZ0+0.12, 0,
         "#4e6a58", 0, Math.PI/2);
    push("fabric", new T.CylinderGeometry(0.075,0.095,0.09,12), -71.30, FY+2.52, IZ0+0.13,
         0, "#6a5236", 0.35, 0);
    push("fabric", new T.CylinderGeometry(0.15,0.15,0.015,14), -71.30, FY+2.48, IZ0+0.13,
         0, "#6a5236", 0.35, 0);
    // a shelf of things won at darts, none of it recent
    bx("oak", 1.10, 0.05, 0.22, -73.6, FY+2.66, IZ0+0.13, 0.5, 0, "#5b4632");
    for(let i=0;i<5;i++){
      const tx2=-74.04+i*0.22;
      cyl("bell", 0.035,0.055,0.04,10, tx2, FY+2.705, IZ0+0.13, "#caa23c");
      cyl("bell", 0.012,0.012,0.09,8, tx2, FY+2.77, IZ0+0.13, "#caa23c");
      cyl("bell", 0.042,0.030,0.07,10, tx2, FY+2.85, IZ0+0.13, "#caa23c");
    }
  })();

  /* ---- the feeling that everyone left in the middle of something ------- */
  (function(){
    // dust hanging in the light off the glass block, which is the only thing
    // in here that moves and it is not moving either
    for(const w of [[-85.1,1],[-71.8,-1]])
      for(let i=0;i<4;i++){
        const t=i/3;
        for(const a2 of [0.45, 2.02])                // crossed, so it has no flat side
          push("haze", planeGeo(2.6+t*2.2, 2.4-t*0.5, 0), w[0]+w[1]*t*1.9,
               FY+1.90-t*0.55, IZ0+0.35+t*3.2, a2, "#fff0d2", 0, 0);
      }
    // somebody's drink, half finished, and their cigarette still going, at a
    // stool with nobody on it
    const sx2=BX-0.62, sz2=BZ0+0.55+4*0.86;
    cyl("glass", 0.040,0.032,0.16,10, BX+0.28, FY+BH2+0.16, sz2, "#c8b070");
    cyl("glass", 0.038,0.030,0.055,10, BX+0.28, FY+BH2+0.11, sz2, "#7a5a24");
    push("bin", new T.CylinderGeometry(0.068,0.055,0.028,12), BX+0.46, FY+BH2+0.094,
         sz2-0.16, 0, "#4a443c");
    push("paint", new T.CylinderGeometry(0.010,0.010,0.085,7), BX+0.42, FY+BH2+0.108,
         sz2-0.16, 0, "#efeade", 0, Math.PI/2);
    push("ember", boxGeo(0.018,0.015,0.015,0), BX+0.375, FY+BH2+0.108, sz2-0.16, "#ff5a1e");
    push("smoke", planeGeo(0.10,0.70,0), BX+0.38, FY+BH2+0.46, sz2-0.16, 0, "#c8c4bc");
    push("smoke", planeGeo(0.10,0.70,0), BX+0.38, FY+BH2+0.46, sz2-0.16, Math.PI/2, "#c8c4bc");
    {                                                 // and their coat, dumped on it
      const CC="#3a4a52";
      for(const q of [[0,0,0.155],[0.10,0.06,0.125],[-0.09,-0.05,0.115],[0.02,-0.11,0.10]]){
        const g=new T.SphereGeometry(q[2],10,7); g.scale(1.25,0.62,1.05);
        push("fabric", g, sx2+q[0], FY+0.885, sz2+q[1], 0.4, CC);
      }
      const sl=new T.SphereGeometry(0.075,9,7); sl.scale(0.9,2.6,0.9);
      push("fabric", sl, sx2-0.20, FY+0.72, sz2+0.08, 0.4, CC, 0.22, 0.10);
      push("fabric", blobGeo(0.062), sx2-0.24, FY+0.55, sz2+0.11, 0, CC);
    }
    // keys, a folded paper with a date on it, and change nobody picked up
    for(let i=0;i<4;i++)
      push("metal", boxGeo(0.055,0.004,0.016,0), BX+0.22+((i*5)%3)*0.02, FY+BH2+0.086,
           BZ0+7.2+i*0.016, i*0.7, "#9aa1a6", 0, 0.1);
    push("metal", new T.TorusGeometry(0.022,0.004,4,10), BX+0.19, FY+BH2+0.088,
         BZ0+7.2, 0, "#9aa1a6", Math.PI/2, 0);
    push("paper", boxGeo(0.28,0.014,0.20,0), BX+0.30, FY+BH2+0.092, BZ0+2.3, 0.18, "#ded6bc");
    for(let i=0;i<5;i++)
      push("soot", planeGeo(0.20,0.012,0), BX+0.30, FY+BH2+0.100, BZ0+2.24+i*0.028,
           0.18, "#4a443a", -Math.PI/2, 0);
    for(let i=0;i<7;i++)
      cyl("bell", 0.013,0.013,0.002,10, BX+0.40+((i*7)%4)*0.04, FY+BH2+0.087,
          BZ1-3.1+((i*5)%3)*0.05, "#b8a24a", Math.PI/2, 0, 0);
    // coats left over two chair backs, and a hat on a table
    for(const q of [[-75.8,-22.0+0.86,0],[-80.4,-19.0-0.86,Math.PI]])
      push("fabric", boxGeo(0.40,0.52,0.14,0.5), q[0]+Math.cos(q[2])*0.20, FY+0.86,
           q[1], q[2], "#4a3f36", 0.1, 0.05);
    push("fabric", new T.CylinderGeometry(0.115,0.135,0.10,14), -75.5, FY+0.83, -26.3,
         0, "#5c4a30", 0.2, 0);
    push("fabric", new T.CylinderGeometry(0.205,0.205,0.018,16), -75.5, FY+0.79, -26.3,
         0, "#5c4a30", 0.2, 0);
    // flies, which are the only thing in here still in business
    for(let i=0;i<11;i++)
      push("bin", new T.SphereGeometry(0.013,5,4), -80.0+((i*2.31)%13.0),
           FY+1.55+((i*5)%5)*0.22, -27.0+((i*1.77)%11.0), i, "#2b2622");
    // a flight off a dart, a cue butt, and the arcs chairs have worn in the boards
    push("paint", boxGeo(0.045,0.004,0.030,0), -75.4, FY+0.011, IZ0+2.10, 0.8, "#c8443a");
    push("oak", new T.CylinderGeometry(0.014,0.019,0.62,7), -84.9, FY+0.022, -22.6,
         0.9, "#b08c52", Math.PI/2, 0);
    for(const q of [[-75.8,-26.0],[-75.8,-22.0],[-80.4,-23.0],[-80.4,-19.0]])
      for(let k=0;k<4;k++){
        const a=k*1.4+0.5;
        push("soot", planeGeo(0.62,0.16,0), q[0]+Math.cos(a)*0.95, FY+0.013,
             q[1]+Math.sin(a)*0.95, a+1.57, "#4a3f30", -Math.PI/2, 0);
      }
    // a clock on the brick that stopped at twenty past four
    push("art", boxGeo(0.06,0.42,0.42,0), IX0+0.06, FY+2.72, -21.0, 0, "#3e342c");
    signPanel(0.34,0.34, signTex(128,128,(x,W,H2)=>{
      x.fillStyle="#d8d0b8"; x.beginPath(); x.arc(64,64,60,0,7); x.fill();
      x.strokeStyle="#2f2a20"; x.lineWidth=3;
      for(let k=0;k<12;k++){ const a=k*Math.PI/6;
        x.beginPath(); x.moveTo(64+Math.sin(a)*50, 64-Math.cos(a)*50);
        x.lineTo(64+Math.sin(a)*44, 64-Math.cos(a)*44); x.stroke(); }
      x.lineWidth=5; x.beginPath(); x.moveTo(64,64);
      x.lineTo(64+Math.sin(2.09)*28, 64-Math.cos(2.09)*28); x.stroke();
      x.lineWidth=3; x.beginPath(); x.moveTo(64,64);
      x.lineTo(64+Math.sin(2.09)*42, 64-Math.cos(2.09)*42); x.stroke();
      x.fillStyle="#2f2a20"; x.beginPath(); x.arc(64,64,4,0,7); x.fill();
    }), IX0+0.10, FY+2.72, -21.0, Math.PI/2, false);
    // and one bulb over the booths that is nearly out
    LAMPS.push({x:-86.0, y:TOPY-1.30, z:-23.5, color:0xffc98a, intensity:0.12,
                dist:5.5, decay:1.9, indoor:true, flicker:true});
  })();

  /* ---- and the things that make it feel like nobody is coming --------- */
  // one tube over the pool table has been going for weeks
  LAMPS.push({x:-83.2, y:TOPY-1.62, z:-25.4, color:0xe6dcbc, intensity:0.42, dist:8,
              decay:1.7, indoor:true, flicker:true});
  // a payphone by the restrooms with the receiver off the hook
  (function(){
    const px2=-83.10, pz2=IZ1-0.12;
    bx("paint", 0.28,0.52,0.18, px2, FY+1.34, pz2, 0, 0, "#2b3b34");
    bx("metal", 0.22,0.07,0.04, px2, FY+1.60, pz2-0.10, 0, 0, "#b8bcbc");
    push("paint", new T.CylinderGeometry(0.035,0.035,0.26,8), px2-0.20, FY+0.92, pz2-0.14,
         0, "#1a1a19", 0.35, 0);                                  // hanging off its cord
    push("paint", new T.CylinderGeometry(0.010,0.010,0.52,6), px2-0.16, FY+1.22, pz2-0.13,
         0, "#222", 0.15, 0.22);
    bx("paper", 0.16,0.20,0.02, px2+0.30, FY+1.46, pz2-0.02, 0, 0, "#d8d2bc");
    addCol(px2-0.3, px2+0.3, pz2-0.25, pz2+0.12, 0, FY+1.7);
  })();
  // an OUT OF ORDER card, a NO MINORS notice, a coat nobody came back for
  bx("paper", 0.22,0.14,0.02, -86.6, FY+1.38, IZ0+0.06, 0, 0, "#e6dcbe");
  bx("paper", 0.20,0.26,0.02, -75.0, FY+1.64, IZ0+0.05, 0, 0, "#ded4b4");
  push("fabric", boxGeo(0.34,0.72,0.16,0.5), -74.4, FY+1.46, IZ1-0.12, 0.2, "#3a4a52", 0, 0.06);
  // rings where glasses have stood, and the pools the pendants throw
  for(const q of [[-75.8,-26.0],[-75.8,-22.0],[-75.8,-17.8],[-80.4,-23.0],
                  [-80.4,-19.0],[-80.4,-16.0]])
    for(let k=0;k<3;k++)
      push("soot", planeGeo(0.10,0.10,0), q[0]+Math.cos(k*2.3)*0.24, FY+0.782,
           q[1]+Math.sin(k*2.3)*0.24, k, "#5a4a32", -Math.PI/2, 0);
  for(const q of [[-83.2,-25.4],[-76.2,-22.6],[BX-0.5,-25.6],[BX-0.5,-21.0],[-77.6,-19.6]])
    push("soot", planeGeo(2.6,2.6,0), q[0], FY+0.034, q[1], 0, "#6a5a3a", -Math.PI/2, 0);
  // a cobweb in the corner the mop never reaches
  for(let i=0;i<4;i++)
    push("soot", planeGeo(0.5-i*0.10, 0.5-i*0.10, 0), IX0+0.35+i*0.10, TOPY-0.35-i*0.09,
         IZ1-0.35-i*0.10, -Math.PI/4, "#cfcabb", -0.7, 0);
  // one glass left standing on the bar, and the stool pushed out
  cyl("glass", 0.038,0.030,0.13,10, BX+0.30, FY+BH2+0.155, BZ1-4.2, "#cfe0e6");
  push("soot", planeGeo(0.13,0.13,0), BX+0.30, FY+BH2+0.092, BZ1-4.2, 0, "#5a4a32",
       -Math.PI/2, 0);
  // the years on the brick: smoke above the bar, a wear patch on the boards
  for(const q of [[-88.0+0.30, -23.0, Math.PI/2],[IX1-0.02, -20.0, -Math.PI/2],
                  [-80.0, IZ1-0.02, Math.PI]])
    push("soot", planeGeo(2.20, 1.60, 0), q[0], FY+3.10, q[1], q[2], "#4a3a2a");
  push("soot", planeGeo(9.0, 2.2, 0), BX-1.6, FY+0.010, (BZ0+BZ1)/2, Math.PI/2, "#6a5a3a",
       -Math.PI/2, 0);
  push("soot", planeGeo(3.4, 2.6, 0), -81.6, FY+0.018, -21.4, 0.2, "#6a5a3a", -Math.PI/2, 0);
  push("soot", planeGeo(2.2, 7.0, 0), -79.6, FY+0.026, -24.6, 0.05, "#6a5a3a", -Math.PI/2, 0);
  // ends and caps trodden into the boards
  for(let i=0;i<40;i++){
    const fx=IX0+0.8+((i*1.37)%18.4), fz=IZ0+0.8+((i*2.11)%13.0);
    if(i%3) push("plaster", boxGeo(0.042,0.011,0.011,0), fx, FY+0.011, fz, i*1.1,
                 "#e8e2cf", 0, 0);
    else    push("bin", new T.CylinderGeometry(0.014,0.014,0.006,8), fx, FY+0.010, fz,
                 0, ["#c8342a","#2f7a44","#d8b23a"][i%3], Math.PI/2, 0);
  }
})();
