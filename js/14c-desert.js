"use strict";
/* LOW DESERT MOTEL · 14c-desert.js
   part three: the graves, the adit, the trailer, site ambience
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* Continues 14-desert.js; uses the G / mk / mkPi defined there. */
  /* --- three graves and a wire fence ----------------------------------- */
  (function(){
    const m=mk(-517,-222);
    // Scraped ground, so the plot reads as a plot and not as three sticks
    // standing in open desert.
    {
      for(let ix=0; ix<7; ix++) for(let iz=0; iz<4; iz++){   // conforming tiles
        const lx=-6.0+ix*2.00, lz=-2.6+iz*2.00;
        const ty=Terrain.groundAt(-517+lx, -222+lz)-m.y+0.03;
        m.P("track", new T.PlaneGeometry(2.40, 2.40), lx, ty, lz, 0, "#a99a80",
            -Math.PI/2, 0);
      }
      let sd=2207; const r2=()=>{ sd=(sd*1103515245+12345)%2147483648; return sd/2147483648; };
      for(let i=0;i<12;i++){
        const lx=(r2()-0.5)*12, lz=0.4+(r2()-0.5)*6.6;
        m.P("soot", planeGeo(1.4+r2()*2.4, 1.0+r2()*1.8, 0), lx,
            Terrain.groundAt(-517+lx,-222+lz)-m.y+0.045+i*0.0004, lz, r2()*6,
            r2()<0.45?"#7a6f5c":"#c3b79a", -Math.PI/2, 0);
      }
      for(let i=0;i<16;i++){
        const px=(r2()-0.5)*12.6, pz=0.4+(r2()-0.5)*7.0;
        for(let k=0;k<4;k++)
          m.C("foliage", 0.008,0.013,0.15+r2()*0.18,4, px+(r2()-0.5)*0.20, 0.12,
              pz+(r2()-0.5)*0.20, r2()<0.5?"#8d8459":"#7a7448",
              (r2()-0.5)*0.5, k*1.5, (r2()-0.5)*0.4);
      }
    }
    for(let i=0;i<3;i++){
      const px=(i-1)*1.7, lean=((i*13)%5-2)*0.06;
      m.P("oak", boxGeo(0.10,1.12,0.10,0), px,0.53,0, 0, "#7d6a52", 0, lean);
      m.P("oak", boxGeo(0.60,0.10,0.10,0), px+lean*0.3,0.80,0, 0, "#7d6a52", 0, lean);
      // the nail plate where the two pieces cross, and the name long gone
      m.P("metal", boxGeo(0.15,0.15,0.012,0), px+lean*0.2,0.80,0.055, 0, "#8a7f6c", 0, lean);
      const md=blobGeo(0.92); md.scale(0.48, 0.24, 1.00);
      m.P("gravel", md, px, 0.03, 0.95, lean*0.5, i%2?"#8b8168":"#7c7462", 0, 0);
      for(const q of [-1,1])                                  // a kerb of field stone
        for(let k=0;k<5;k++)
          m.P("rock", rockGeo(0.085+((i*3+k)%3)*0.03, 700+i*31+k*7), px+q*0.44,
              0.05, 0.28+k*0.34, k*1.3, "#9a8f78", 0, 0);
    }
    for(let i=-4;i<=4;i++){                                                // the fence
      for(const sd of [-1,1]){
        m.C("oak", 0.055,0.07,0.95,6, i*1.5, 0.42, sd*3.2, "#6d5942", 0,0,((i*11)%5-2)*0.035);
        m.col(i*1.5-0.10, i*1.5+0.10, sd*3.2-0.10, sd*3.2+0.10, 0, 0.92);
      }
      // 10 mm of wire is under a pixel from the road; 26 holds together
      if(i<4) for(const sd of [-1,1]) for(const wy of [0.42,0.72])
        m.P("metal", boxGeo(1.5,0.026,0.026,0), i*1.5+0.75, wy, sd*3.2, 0, "#8d8474");
    }
    for(const sd of [-1,1]) for(let j=-2;j<=2;j++){
      m.C("oak", 0.055,0.07,0.95,6, sd*6.0, 0.42, j*1.6, "#6d5942", 0,0,((j*7)%5-2)*0.035);
      m.col(sd*6.0-0.10, sd*6.0+0.10, j*1.6-0.10, j*1.6+0.10, 0, 0.92);
      if(j<2) for(const wy of [0.42,0.72])
        m.P("metal", boxGeo(0.026,0.026,1.6,0), sd*6.0, wy, j*1.6+0.8, 0, "#8d8474");
    }
    // a jar somebody left, and the paper flowers in it gone the colour of dust
    m.C("glass", 0.055,0.045,0.15,9, -1.05, 0.075, -0.42, "#8a9a94");
    for(let i=0;i<5;i++)
      m.P("foliage", new T.IcosahedronGeometry(0.038,0), -1.05+Math.cos(i*1.2)*0.07,
          0.17, -0.42+Math.sin(i*1.2)*0.07, i*1.1, ["#8a7f63","#9a8f70","#7d7357"][i%3]);
    m.zone(13, "THREE GRAVES");
  })();

  /* --- a burying ground, a long way west of everything ------------------
     Twelve stones behind a wire, three of them down, one plot that never got
     a stone at all. Whatever was here to bury people for is not here now.  */
  (function(){
    const m=mk(-630,-68), GX=-14.5;                 // a few metres off the shoulder
    const STONE="#b6ae9c", DARK="#9c9484";
    /* Ground first. A burying ground is a piece of desert somebody cleared
       and then kept clearing, and from the road that difference in the dirt
       is the thing that says a plot is here at all — without it the stones
       read as litter on open sand. Scraped pale, with the scrub only coming
       back at the edges and between the rows. */
    {
      // One big plane at a fixed height is buried wherever the desert rises
      // under it — this ground is not flat. Tiles that each sit on the
      // terrain at their own centre follow it, and overlapping them by a
      // fifth hides the steps between.
      for(let ix=0; ix<12; ix++) for(let iz=0; iz<6; iz++){
        const lx=-12.6+ix*2.30, lz=-5.4+iz*2.15;
        const ty=Terrain.groundAt(-630+lx, -68+lz)-m.y+0.03;
        m.P("track", new T.PlaneGeometry(2.75, 2.58), lx, ty, lz, 0, "#a99a80",
            -Math.PI/2, 0);
      }
      let sd=9311; const r2=()=>{ sd=(sd*1103515245+12345)%2147483648; return sd/2147483648; };
      for(let i=0;i<22;i++){                        // scuff and shadow across it
        const lx=(r2()-0.5)*25, lz=(r2()-0.5)*11;
        m.P("soot", planeGeo(2.0+r2()*4.0, 1.4+r2()*2.6, 0), lx,
            Terrain.groundAt(-630+lx,-68+lz)-m.y+0.045+i*0.0004, lz, r2()*6,
            r2()<0.45?"#7a6f5c":"#c3b79a", -Math.PI/2, 0);
      }
      for(let i=0;i<34;i++){                        // dry grass the wind seeded back
        const px=(r2()-0.5)*26, pz=(r2()-0.5)*11.6;
        for(let k=0;k<5;k++)
          m.C("foliage", 0.008,0.013,0.16+r2()*0.20,4, px+(r2()-0.5)*0.22, 0.12,
              pz+(r2()-0.5)*0.22, r2()<0.5?"#8d8459":"#7a7448",
              (r2()-0.5)*0.5, k*1.3, (r2()-0.5)*0.4);
      }
      // the track worn in from the gate, which is the only way anyone walked
      for(let i=0;i<9;i++){
        const lx=0.65+Math.sin(i*0.7)*0.5, lz=-5.0+i*1.25;
        m.P("soot", planeGeo(1.25, 1.5, 0), lx,
            Terrain.groundAt(-630+lx,-68+lz)-m.y+0.05, lz, 0.1, "#8d8168", -Math.PI/2, 0);
      }
    }
    // the plot: a low kerb of rubble and a gate that stopped closing
    for(let i=-9;i<=9;i++){                                          // the wire fence
      const lean=((i*17)%7-3)*0.045;
      if(i===0 || i===1) continue;                                   // the gateway
      for(const sd of [-1,1]){
        m.C("oak", 0.055,0.07,1.05,6, i*1.35, 0.46, sd*5.6, "#6d5942", 0,0,lean);
        m.col(i*1.35-0.10, i*1.35+0.10, sd*5.6-0.10, sd*5.6+0.10, 0, 1.0);
      }
      // 10 mm of wire is under a pixel at twenty metres and the whole fence
      // disappears, leaving a row of sticks. 26 mm holds together from the road.
      if(i<9) for(const sd of [-1,1]) for(const wy of [0.40,0.70,0.96])
        m.P("metal", boxGeo(1.35,0.026,0.026,0), i*1.35+0.675, wy-0.03, sd*5.6, 0, "#8d8474",
            0, ((i*5)%5-2)*0.012);
    }
    for(const sd of [-1,1]) for(let j=-3;j<=3;j++){
      m.C("oak", 0.055,0.07,1.05,6, sd*12.6, 0.46, j*1.6, "#6d5942", 0,0,((j*11)%5-2)*0.04);
      m.col(sd*12.6-0.10, sd*12.6+0.10, j*1.6-0.10, j*1.6+0.10, 0, 1.0);
      if(j<3) for(const wy of [0.40,0.70,0.96])
        m.P("metal", boxGeo(0.026,0.026,1.6,0), sd*12.6, wy-0.03, j*1.6+0.8, 0, "#8d8474");
    }
    for(const q of [-0.7, 2.0])                                      // the gateposts
      m.C("oak", 0.09,0.11,1.55,7, q, 0.72, -5.6, "#5b4632");
    m.C("oak", 0.055,0.055,2.90,6, 0.65, 1.52, -5.6, "#5b4632", 0,0,Math.PI/2);
    m.P("metal", boxGeo(1.05,0.86,0.03,0), 0.10, 0.52, -5.62, 0.26, "#6b6156", 0, 0.2);
    // the stones. Nine standing, three down, and a plot with a wooden marker
    const PLOT=[[-9.6,-3.0,0,1],[-7.2,-2.6,1,0],[-4.9,-3.2,0,0],[-2.2,-2.8,2,1],
                [ 0.6,-3.1,0,0],[ 3.2,-2.7,1,1],[ 5.8,-3.0,0,1],[ 8.4,-2.9,3,0],
                [-8.4, 1.4,0,0],[-5.6, 1.8,2,1],[-1.8, 1.5,0,1],[ 1.2, 1.9,1,0],
                [ 4.4, 1.6,0,0],[ 7.6, 1.7,3,1]];
    for(let i=0;i<PLOT.length;i++){
      const px=PLOT[i][0], pz=PLOT[i][1], kind=PLOT[i][2], down=PLOT[i][3] && (i%3===0);
      const lean=((i*19)%9-4)*0.035;
      const col=(i%3)?STONE:DARK;
      // the mound, and the kerb round it where there is one
      // A grave is a mound. Seven centimetres of gravel lying flat reads as a
      // stain on the ground; a rounded heap twenty-five high reads as a plot.
      {
        const md=blobGeo(0.95); md.scale(0.50, 0.26, 1.06);
        m.P("gravel", md, px, 0.03, pz+1.25, ((i*7)%5-2)*0.04, i%2?"#8b8168":"#7c7462", 0, 0);
      }
      if(i%4===0){
        for(const sd of [-1,1]) m.B("concrete", 0.07,0.10,1.95, px+sd*0.50, 0.05, pz+1.25,
                                    0.5,0,"#a9a192");
        m.B("concrete", 1.07,0.10,0.07, px, 0.05, pz+2.22, 0.5,0,"#a9a192");
      }
      if(down){                                 // this one came off its base years ago
        m.B("concrete", 0.62,0.13,0.26, px, 0.065, pz, 0.5, 0, "#a9a192");
        m.P("concrete", boxGeo(0.54,0.72,0.10,0.5), px+0.12, 0.09, pz+0.62,
            lean*3, col, -Math.PI/2+0.08, 0);
        if(kind===2)                            // and it broke when it went
          m.P("concrete", boxGeo(0.30,0.34,0.10,0.5), px-0.34, 0.08, pz+0.34,
              1.1, col, -Math.PI/2-0.05, 0);
        continue;
      }
      if(kind===3){                             // no stone: two boards and a wire
        m.P("oak", boxGeo(0.07,0.90,0.07,0), px, 0.42, pz, 0, "#6b5947", 0, lean);
        m.P("oak", boxGeo(0.44,0.07,0.07,0), px+lean*0.3, 0.64, pz, 0, "#6b5947", 0, lean);
        continue;
      }
      m.B("concrete", 0.70,0.14,0.30, px, 0.07, pz, 0.5, 0, "#a9a192");      // the base
      if(kind===0){                             // a plain tablet with a rounded head
        m.P("concrete", boxGeo(0.50,0.68,0.11,0.5), px, 0.48, pz, 0, col, 0, lean);
        m.P("concrete", new T.CylinderGeometry(0.25,0.25,0.11,14), px-lean*0.34, 0.82, pz,
            0, col, Math.PI/2, lean);
      }else if(kind===1){                       // a squarer one, with a cap
        m.P("concrete", boxGeo(0.46,0.86,0.13,0.5), px, 0.57, pz, 0, col, 0, lean);
        m.P("concrete", boxGeo(0.56,0.08,0.20,0.5), px-lean*0.5, 1.03, pz, 0, col, 0, lean);
      }else{                                    // a cross, with a corner off it
        m.P("concrete", boxGeo(0.22,1.02,0.12,0.5), px, 0.63, pz, 0, col, 0, lean);
        m.P("concrete", boxGeo(0.74,0.21,0.12,0.5), px-lean*0.56, 0.92, pz, 0, col, 0, lean);
        m.P("concrete", boxGeo(0.16,0.18,0.13,0.5), px+0.30, 0.03, pz+0.30, 0.6, col,
            -Math.PI/2, 0);
      }
      // the lettering has gone; what is left is the weathering
      for(let k=0;k<3;k++)
        m.P("soot", planeGeo(0.30,0.09,0), px, 0.72-k*0.16, pz+0.07, 0, "#6b6252", 0, lean);
    }
    // one bunch of flowers, from a long time ago, and the desert taking it back
    for(let i=0;i<7;i++)
      m.P("foliage", new T.IcosahedronGeometry(0.045,0), 0.6+Math.cos(i*0.9)*0.10, 0.10,
          -2.6+Math.sin(i*0.9)*0.10, i*1.3, ["#8a7f63","#9a8f70","#7d7357"][i%3]);
    m.C("glass", 0.055,0.045,0.16,9, 0.6, 0.08, -2.6, "#8a9a94");
    // a dead tree at the corner, which is the only thing you see from the road
    (function(){
      const tx=-11.8, tz=4.2;
      m.C("oak", 0.16,0.24,2.40,7, tx, 1.20, tz, "#7d7053", 0.04, 0.6, 0.03);
      const put=(x,y,z,r,h,lean,a)=>{
        const si=Math.sin(lean), co=Math.cos(lean);
        const dx=Math.sin(a)*si, dz=Math.cos(a)*si;   // see stem(): same maths
        m.C("oak", r*0.6,r, h, 6, x+dx*h/2, y+co*h/2, z+dz*h/2, "#7d7053", lean, a, 0);
        return [x+dx*h, y+co*h, z+dz*h];
      };
      for(let i=0;i<5;i++){
        const a=i*1.3+0.4;
        const t1=put(tx, 1.35+i*0.26, tz, 0.085, 1.10, 0.75+((i*7)%4)*0.10, a);
        const t2=put(t1[0],t1[1],t1[2], 0.050, 0.80, 0.55+((i*5)%3)*0.14, a+0.6);
        if(i%2===0) put(t2[0],t2[1],t2[2], 0.028, 0.55, 0.85, a-0.9);
      }
    })();
    m.rect(-16,16,-8,9, "THE BURYING GROUND");
  })();

  /* --- the adit, and whatever was going on at the end of it -------------
     Cut into the south flank of the mesa west of everything, where the
     ground climbs from eight metres to thirty over sixty. There is no new
     landform here — the hill was already there. From the highway it is a
     notch in a slope behind a spur of rock; you have to be nearly on top of
     it to see there is a hole. Thirty-odd metres of passage behind it,
     turning twice, so by the end there is no daylight at all.            */
  (function(){
    // The floor is the bench, and the bench is cut into the terrain itself
    // (see aditCut in section 4) rather than built on top of it. Taking both
    // from one constant is the whole trick: the ground arrives at the portal
    // four metres below grade, so the face the portal is cut into is real
    // landform and the drive has rock over it from the first metre in.
    const MX=Terrain.ADIT.x, MZ=Terrain.ADIT.zFace;    // the face
    const FY0=Terrain.ADIT.y;                          // the working level
    const m=mkPi(MX, MZ+20, FY0);                      // local +z runs back out
    // Sampled off the terrain ramp that paints this hillside: dune and mountain
    // with the iron-red band through it. The old set was a pale grey-tan and
    // read as somebody else's rock tipped against an orange mesa.
    const ROCKC=["#ad6f4c","#9c6547","#bb8259","#8f563d","#c59166"];
    const F=0.0, PH=2.50, CH=3.70;
    const PW=1.35;
    const PORT=[-PW,PW];
    const holes=(a0,a1,hs)=>{ const out=[]; let c=a0;
      for(const h of hs){ if(h[0]>c) out.push([c,h[0]]); c=Math.max(c,h[1]); }
      if(c<a1) out.push([c,a1]); return out; };
    const lightRock=["#7a5a48","#856450","#6e5040","#8d6c55"];

    // the ground here, relative to the floor — the slope falls away in front
    // of the portal and everything outside has to sit on it, not on the level
    const gh=(x,z)=> G(m.wx(x,z), m.wz(x,z)) - FY0;
    // A rock is either something you walk round or something you step over,
    // never something you walk through. Everything with a body gets a
    // collider; only gravel does not. The old approach was a hundred and
    // forty loose lumps with no colliders at all, half of them hanging over
    // the drive to cover a roof that was above grade — which is why it read
    // as a heap of boulders with a hole behind it.
    const boulder=(lx,lz,r,seed,i)=>{
      const y=gh(lx,lz);
      // bedded into the fan rather than balanced on it
      m.P("rock", rockGeo(r, seed), lx, y+r*0.26, lz, i*1.1, ROCKC[i%5],
          ((i*7)%5-2)*0.18, ((i*3)%5-2)*0.18);
      if(r>=0.45) m.col(lx-r*0.72, lx+r*0.72, lz-r*0.72, lz+r*0.72, y-1.2, y+r*0.95);
    };
    // how wide the cut is at a given local z, straight off the terrain's own
    // numbers, so rock and ground cannot drift apart
    const A=Terrain.ADIT;
    const cutHW=(lz)=>{ const wz=m.wz(0,lz);
      const t=clamp((wz-A.zLip)/(A.zFace-A.zLip),0,1);
      return A.hwLip+(A.hwFace-A.hwLip)*t; };

    /* ---- the face, and the hole in it ----------------------------------
       Boxes read as boxes. Two rounds of this face were built out of box
       primitives — first one slab, then a run of terrain-following columns —
       and however carefully they were placed they came out as a stockade of
       vertical panels, which is the "confusing and fragmented" of it: a
       retaining wall with a door in it, not a hole in a hill.
       The face is one interlocking mass of rock now. Lumps are laid on a grid
       across and up, each one bigger than the spacing so they overlap into a
       single craggy surface with no straight seam anywhere in it, and the
       grid's top follows the hillside behind while its foot follows the
       ground in front. A thin box buried well back does the sealing, so you
       cannot see daylight through the mass however it falls.               */
    const FH=5.0, FZ=20.25, FHW=5.9, JAMB=PW+0.26;
    const hillTop =(lx)=>gh(lx, 19.5);                 // the hill behind the face
    const benchTop=(lx)=>gh(lx, 21.2);                 // the ground in front of it
    // the seal: buried, never seen, and the reason the mass can be as loose
    // as it likes without opening a gap to the sky
    // Its top has to sit UNDER the crest of the mass or it shows through as a
    // dark band across the face, and it is dark rock so that anywhere the
    // lumps do part it reads as shadow between them rather than as a wall.
    const SEALTOP=F+3.9, SEALC="#5d3c2b";
    for(const g of [[-FHW-0.6,-JAMB],[JAMB,FHW+0.6]])
      m.B("rock", g[1]-g[0], SEALTOP+2.6-F, 0.55, (g[0]+g[1])/2, (F-2.6+SEALTOP)/2,
          FZ+0.78, 0.45, 0, SEALC);
    m.B("rock", JAMB*2, SEALTOP-(F+PH+0.26), 0.55, 0,
        F+PH+0.26+(SEALTOP-(F+PH+0.26))/2, FZ+0.78, 0.45, 0, SEALC);
    // the mass
    let fseed=4100;
    for(let c=0;c<15;c++){
      const cx=-FHW+c*(FHW*2/14);
      const top=Math.min(F+FH+0.35, hillTop(cx)+0.30), bot=Math.min(F-0.7, benchTop(cx)-0.9);
      for(let y=bot; y<top+0.55; y+=0.70){             // one row past the crest
        const r=0.86+((c*5+((y*3)|0))%4)*0.17;
        const px=cx+((c*7)%5-2)*0.16, py=y+((c*3)%3-1)*0.14;
        // rockGeo jitters its vertices out to about 1.2r, so clearing the
        // opening by r*0.55 let lumps reach to within a metre of the
        // centreline — inside the 1.35 m walkway, while the collider starts
        // at the jamb. That is rock you can see across the doorway and walk
        // straight through, which is exactly what it looked like.
        if(Math.abs(px)<JAMB+r*1.25 && py<F+PH+0.55) continue;
        m.P("rock", rockGeo(r, fseed+=17), px, py, FZ-0.30+((c*11)%5-2)*0.13,
            c*1.3+y, ROCKC[(c+((y*2)|0))%5], ((c*7)%5-2)*0.22, ((c*3)%5-2)*0.22);
      }
    }
    // Between the jamb and where the main mass is allowed to start there was
    // a band six metres wide and three high with no lumps in it at all —
    // just the flat seal, reading as a dark panel around the doorway. It is
    // filled with a graded course: the further out a stone sits the bigger
    // it can be, because what has to clear the opening is its own jitter.
    for(let c=0;c<4;c++){
      const dx=JAMB+0.42+c*0.78;
      const r=Math.min(0.92, (dx-JAMB)/1.30);
      if(r<0.16) continue;
      for(let k=0;;k++){
        const py=F+0.18+k*(r*1.25);
        if(py>F+PH+0.60) break;
        for(const q of [-1,1])
          m.P("rock", rockGeo(r*(0.86+((k*5+c)%3)*0.12), 4900+k*23+c*61+(q>0?7:0)),
              q*dx, py, FZ-0.58+((k*7+c)%3-1)*0.12, k*1.4+c,
              ROCKC[(k+c+2)%5], ((k*7)%5-2)*0.24, ((k*3)%5-2)*0.24);
      }
    }
    for(let c=0;c<5;c++){                              // and over the lintel
      const r=0.34+((c*5)%3)*0.14;
      m.P("rock", rockGeo(r, 5300+c*37), -1.2+c*0.6, F+PH+0.42+((c*3)%3)*0.16,
          FZ-0.55+((c*7)%3-1)*0.10, c*1.3, ROCKC[(c+1)%5],
          ((c*7)%5-2)*0.22, ((c*3)%5-2)*0.22);
    }
    for(const g of [[-FHW-0.6,-JAMB],[JAMB,FHW+0.6]])  // and it is solid, all of it
      m.col(g[0], g[1], FZ-1.15, FZ+0.95, 0, F+FH+1.2);

    /* ---- the two sides of the cut, in the same rock -------------------- */
    for(let i=0;i<11;i++){
      const lz=21.6+i*1.06, hw=cutHW(lz);
      const bank=Math.max(0.45, gh(hw+6.8, lz));
      for(const q of [-1,1]){
        const k=i*2+(q>0?1:0);
        for(let y=F-0.6; y<F+bank+0.2; y+=0.80){
          const r=0.72+((k*7)%4)*0.19;
          m.P("rock", rockGeo(r, 4600+k*29+((y*5)|0)), q*(hw+r*0.42+((k*5)%3)*0.10),
              y+((k*3)%3-1)*0.12, lz+((k*11)%5-2)*0.16, k*1.1+y,
              ROCKC[(i+(q>0?2:0))%5], ((k*7)%5-2)*0.2, ((k*3)%5-2)*0.2);
        }
        m.col(q>0?hw-0.15:-(hw+1.5), q>0?(hw+1.5):-(hw-0.15), lz-0.60, lz+0.60,
              0, F+Math.max(bank,1.1));
      }
    }

    /* ---- the waste, tipped over the lip and fanned out downhill --------
       Off to the flanks, so the way up the tip is clean. Loose rock strewn
       across the approach is the other half of what made this read as a
       muddle: you could not tell what was the way in.                     */
    for(let i=0;i<13;i++){
      const q=(i%2)?1:-1, t=((i/2)|0)/6;
      const lx=q*(4.4+t*3.2+((i*5)%3)*0.7), lz=32.2+t*9.0+((i*7)%3)*0.8;
      boulder(lx, lz, 0.42+((i*7)%4)*0.22, 6100+i*13, i);
    }
    for(let i=0;i<16;i++)                               // and the gravel it shed
      m.P("rock", rockGeo(0.11+((i*5)%3)*0.07, 6900+i*29),
          ((i*13)%11-5)*1.25, gh(((i*13)%11-5)*1.25, 32.8+((i*7)%9)*1.15)+0.04,
          32.8+((i*7)%9)*1.15, i*1.3, ROCKC[i%5],
          ((i*7)%5-2)*0.3, ((i*3)%5-2)*0.3);
    for(let i=0;i<20;i++)                               // the floor is compacted waste
      m.P("soot", planeGeo(1.1+((i*7)%4)*0.6, 0.8+((i*5)%3)*0.5, 0),
          ((i*13)%9-4)*1.0, F+0.012, 21.8+((i*7)%11)*1.05, i*1.3,
          ["#6a4a33","#7a5a40","#5e4230"][i%3], -Math.PI/2, 0);

    // ---- passage A: back into the hill ----------------------------------
    // The walls were a run of boxes that overlapped their neighbours by a
    // quarter of a metre and each carried its own small rotation, so every
    // joint was two nearly-parallel faces fighting over the same depth — the
    // seams and the flicker down the drive. And because each box was a
    // different width about a fixed centre, the wall's inner face wandered
    // between 1.10 and 1.35 while the collider stayed at 1.35, so sometimes
    // you could touch the rock and sometimes your face went through it.
    //
    // One continuous slab per side now, with its inner face exactly on a
    // plane. Relief is separate blocks standing proud of that plane, none of
    // them touching another, and the collider is pulled in to the deepest one
    // so nothing ever protrudes through it. WD is that budget.
    const WD=0.16;
    const wallRun=(a0,a1,axis,q)=>{                    // one slab, no joints
      const mid=(a0+a1)/2, len=a1-a0;
      if(axis==="z") m.B("rock", 1.5, PH+1.2, len, q*(PW+0.75), F+PH/2, mid, 0.5, 0,
                         lightRock[q>0?0:2]);
      else           m.B("rock", len, PH+1.2, 1.5, mid, F+PH/2, q*(PW+0.75)+5.0, 0.5, 0,
                         lightRock[q>0?1:3]);
    };
    // Rock broken along the drill lines stands in vertical facets. Blocks that
    // are wide and short, quantised onto a handful of heights, merge with
    // their neighbours into continuous horizontal ledges and the drive reads
    // as shelving — which is what a denser pass of them made it look like.
    // Tall and narrow, each standing off by its own amount, reads as hewn.
    const relief=(a,axis,q,i)=>{
      const d=0.030+((i*7)%5)*0.026;                 // how far it stands proud
      const y0=F+0.03+((i*13)%4)*0.11;
      const h2=PH-0.18-((i*5)%5)*0.30-(y0-F);        // most of the way up, and varied
      if(h2<0.55) return;
      const w=0.28+((i*3)%5)*0.13, y=y0+h2/2;
      if(axis==="z") m.B("rock", d*2, h2, w, q*(PW-d), y, a, 0.5, 0, lightRock[(i+1)%4]);
      else           m.B("rock", w, h2, d*2, a, y, q*(PW-d)+5.0, 0.5, 0, lightRock[(i+2)%4]);
    };
    for(const q of [-1,1]) wallRun(3.2, 20.9, "z", q);
    for(let i=0;i<41;i++)
      for(const q of [-1,1]) relief(3.9+i*0.418, "z", q, i*3+(q>0?1:0));
    m.B("rock", PW*2+2.2, 0.9, 15.4, 0, F-0.45, 12.3, 0.5, 0, "#7f6a58");
    m.B("rock", PW*2+2.2, 1.0, 15.4, 0, F+PH+0.5, 12.3, 0.5, 0, "#8a7360");
    m.flat(-PW, PW, 3.4, 20.6, F);
    m.voidAt(-PW, PW, 3.4, 20.6, F-1.2, F+PH, F);
    m.col(PW-WD, PW+1.8, 3.66, 20.9, 0, F+PH+0.6);
    m.col(-PW-1.8, -PW+WD, 6.34, 20.9, 0, F+PH+0.6);
    // ---- passage B: the turn --------------------------------------------
    for(const q of [-1,1]) wallRun(-8.8, 1.6, "x", q);
    for(let i=0;i<24;i++)
      for(const q of [-1,1]) relief(-8.3+i*0.435, "x", q, i*5+(q>0?2:0));
    m.B("rock", 11.6, 0.9, PW*2+2.2, -3.0, F-0.45, 5.0, 0.5, 0, "#7f6a58");
    m.B("rock", 11.6, 1.0, PW*2+2.2, -3.0, F+PH+0.5, 5.0, 0.5, 0, "#8a7360");
    m.flat(-8.6, 1.4, 5.0-PW, 5.0+PW, F);
    m.voidAt(-8.6, 1.4, 5.0-PW, 5.0+PW, F-1.2, F+PH, F);
    m.col(-8.8, PW+1.8, 3.06, 3.66+WD, 0, F+PH+0.6);
    m.col(-8.8, -PW+WD, 6.34-WD, 6.94, 0, F+PH+0.6);
    // ---- the chamber ------------------------------------------------------
    const CX0=-18.2, CX1=-8.0, CZ0=-2.4, CZ1=7.6;
    const hew=(cx,cz,w,d,i,col2)=> m.B("rock", w, CH+1.4, d, cx+((i*5)%3-1)*0.10,
        F+CH/2, cz+((i*7)%3-1)*0.10, 0.45, ((i*7)%5-2)*0.04, col2);
    for(let i=0;i<8;i++){
      const cz=CZ0+(CZ1-CZ0)*(i/8)+(CZ1-CZ0)/16, sd=(CZ1-CZ0)/8+0.3;
      hew(CX0-0.35, cz, 1.1, sd, i, lightRock[i%4]);
      const cx=CX0+(CX1-CX0)*(i/8)+(CX1-CX0)/16, sw=(CX1-CX0)/8+0.3;
      hew(cx, CZ0-0.35, sw, 1.1, i+1, lightRock[(i+1)%4]);
      hew(cx, CZ1+0.35, sw, 1.1, i+3, lightRock[(i+2)%4]);
    }
    for(const g of holes(CZ0, CZ1, [[3.66, 6.34]]))
      m.B("rock", 1.1, CH+1.4, g[1]-g[0]+0.3, CX1+0.35, F+CH/2, (g[0]+g[1])/2,
          0.45, 0, lightRock[3]);
    m.B("rock", CX1-CX0+2.4, 1.0, CZ1-CZ0+2.4, (CX0+CX1)/2, F-0.50, (CZ0+CZ1)/2,
        0.5, 0, "#7f6a58");
    m.B("rock", CX1-CX0+2.4, 1.2, CZ1-CZ0+2.4, (CX0+CX1)/2, F+CH+0.6, (CZ0+CZ1)/2,
        0.5, 0, "#8a7360");
    for(let i=0;i<14;i++)
      m.P("rock", rockGeo(0.7+((i*5)%4)*0.35, 1300+i*29),
          CX0+1.0+((i*2.3)%(CX1-CX0-2.0)), F+CH-0.22,
          CZ0+1.0+((i*1.7)%(CZ1-CZ0-2.0)), i*1.1, lightRock[i%4],
          ((i*7)%5-2)*0.2, ((i*3)%5-2)*0.2);
    m.flat(CX0+0.4, CX1-0.2, CZ0+0.4, CZ1-0.4, F);
    m.voidAt(CX0+0.4, CX1-0.2, CZ0+0.4, CZ1-0.4, F-1.2, F+CH, F);
    m.col(CX0-0.9, CX0+0.4, CZ0-0.9, CZ1+0.9, 0, F+CH+0.6);
    m.col(CX0-0.9, CX1+0.9, CZ0-0.9, CZ0+0.4, 0, F+CH+0.6);
    m.col(CX0-0.9, CX1+0.9, CZ1-0.4, CZ1+0.9, 0, F+CH+0.6);
    for(const g of holes(CZ0-0.9, CZ1+0.9, [[3.66, 6.34]]))
      m.col(CX1-0.2, CX1+0.9, g[0], g[1], 0, F+CH+0.6);

    /* ---- the mouth, from outside ---------------------------------------- */
    for(const q of [-1,1])
      m.B("oak", 0.26, PH+0.70, 0.34, q*(PW+0.20), F+(PH+0.70)/2, 19.45, 0.5, 0, "#5a4630");
    m.B("oak", PW*2+0.86, 0.30, 0.38, 0, F+PH+0.85, 19.45, 0.5, 0, "#4a3826");
    for(let i=0;i<7;i++)
      m.P("oak", boxGeo(0.30,0.06,0.42,0.5), -PW-0.22+i*(PW*2+0.44)/6, F+PH+1.04, 19.45,
          ((i*5)%5-2)*0.03, "#5a4630", 0, ((i*7)%5-2)*0.03);
    m.P("oak", boxGeo(0.52,0.30,0.05,0), 0, F+PH+0.52, 19.16, 0, "#6a5236", 0, 0.06);
    for(let i=0;i<4;i++)
      m.P("ochre", planeGeo(0.045,0.16,0), -0.16+i*0.105, F+PH+0.52, 19.13, 0,
          "#3a332e", 0, 0);
    (function(){                                        // the windlass, still rigged
      const wx=3.1, wz=26.4, g0=gh(wx,wz);   // well off the way in
      for(const q of [-1,1]) m.B("oak", 0.16, 1.05, 0.16, wx, g0+0.52, wz+q*0.62, 0.5, 0, "#4a3826");
      m.C("oak", 0.17,0.17,1.30,10, wx, g0+0.92, wz, "#5a4630", Math.PI/2, 0, 0);
      for(let i=0;i<9;i++)
        m.P("teal", new T.TorusGeometry(0.20,0.017,5,12), wx, g0+0.92, wz-0.45+i*0.11,
            0, "#6a5f4a", 0, Math.PI/2);
      m.col(wx-0.4, wx+0.4, wz-0.8, wz+0.8, -1, g0+1.2);
    })();
    m.P("oak", boxGeo(1.20,0.72,0.05,0.5), -3.1, gh(-3.1,25.4)+0.10, 25.4, 0.7, "#8a7a5e",
        -Math.PI/2+0.1, 0);
    for(let i=0;i<4;i++)
      m.P("ochre", planeGeo(0.74,0.08,0), -3.1, gh(-3.1,25.4)+0.13, 25.22+i*0.13, 0.7,
          "#4a3f34", -Math.PI/2+0.1, 0);
    // Claim stakes, in a line along the edge of the workings rather than
    // scattered across the way in, where six of them read as a thicket of
    // dark posts standing in the middle of everything.
    for(let i=0;i<4;i++){
      const px=8.4+((i*5)%3)*0.6, pz=29.0+i*3.4, g0=gh(px,pz);
      m.C("oak", 0.075,0.095,1.05,6, px, g0+0.48, pz, "#5b4632", ((i*7)%5-2)*0.05, i, 0);
      m.P("fabric", boxGeo(0.12,0.24,0.035,0.5), px, g0+0.90, pz, i, "#8a3a30", 0, 0.3);
    }
    // No track in. Somebody drove up here for eight months in 1977 and the
    // desert has had forty-odd years to take it back; a graded two-metre
    // scar running off the graves was a signpost saying LOOK HERE.
    /* ---- what is in the passage ---------------------------------------- */
    let ds=90211;
    const dr=()=>{ ds=(ds*1103515245+12345)%2147483648; return ds/2147483648; };
    const TIMB="#5a4630", TIMB2="#4a3826", RUST2="#7a4a2a";
    // the sets: two legs and a cap every couple of metres, some of them gone
    const setAt=(cx,cz,axis,i)=>{
      const lean=((i*7)%5-2)*0.035, half=PW+0.16;
      if(axis==="z"){
        for(const q of [-1,1])
          m.B("oak", 0.17, PH+0.10, 0.19, cx+q*half, F+(PH+0.10)/2, cz, 0.5, 0,
              (i%4)?TIMB:TIMB2);
        m.B("oak", half*2+0.34, 0.20, 0.21, cx, F+PH+0.14, cz, 0.5, 0, TIMB);
        for(let k=0;k<5;k++)                            // lagging over the cap
          m.P("oak", boxGeo(0.34,0.05,0.24,0.5), cx-half+0.3+k*(half*2-0.6)/4,
              F+PH+0.27, cz, lean*2, TIMB2, 0, lean);
      }else{
        for(const q of [-1,1])
          m.B("oak", 0.19, PH+0.10, 0.17, cx, F+(PH+0.10)/2, cz+q*half, 0.5, 0,
              (i%4)?TIMB:TIMB2);
        m.B("oak", 0.21, 0.20, half*2+0.34, cx, F+PH+0.14, cz, 0.5, 0, TIMB);
      }
    };
    for(let i=0;i<7;i++) if(i!==4) setAt(0, 18.8-i*2.15, "z", i);
    // one that came down, and the rock that came down with it
    m.P("oak", boxGeo(0.17,PH+0.10,0.19,0.5), -0.9, F+0.55, 10.5, 0.2, TIMB2, 0, 1.15);
    m.P("oak", boxGeo(2.9,0.20,0.21,0.5), 0.1, F+0.62, 10.9, 0.1, TIMB, 0, -0.42);
    for(let i=0;i<9;i++)
      m.P("rock", rockGeo(0.16+((i*5)%4)*0.13, 2100+i*17), ((i*7)%5-2)*0.42,
           F+0.10+((i*3)%3)*0.14, 10.3+((i*5)%4)*0.30, i*1.1, "#8a7360",
           ((i*7)%5-2)*0.3, ((i*3)%5-2)*0.3);
    for(let i=0;i<5;i++) setAt(-0.6-i*1.7, 5.0, "x", i+2);
    // rail and sleepers, and the cart that came off them
    for(let i=0;i<19;i++)
      m.B("oak", 1.30, 0.06, 0.16, 0, F+0.03, 5.6+i*0.76, 0.5, ((i*5)%5-2)*0.02, "#4e3c28");
    for(const q of [-0.44, 0.44])
      m.B("metal", 0.05, 0.07, 14.6, q, F+0.085, 12.6, 0, 0, "#6a5a4a");
    (function(){
      // It came off the rails, so it is over against the wall rather than
      // parked across the drive: its collider used to straddle the centre and
      // leave 0.40 m on one side, which is 2 cm less than you can walk through.
      const kx=0.86, kz=12.4;
      m.P("metal", boxGeo(0.86,0.62,1.22,0.45), kx, F+0.44, kz, 0.42, RUST2, 0, 0.38);
      m.P("metal", boxGeo(0.90,0.10,1.26,0.45), kx-0.10, F+0.74, kz, 0.42, "#8a5a36", 0, 0.38);
      for(const c of [[-1,-1],[1,-1],[-1,1],[1,1]])
        m.P("metal", new T.CylinderGeometry(0.17,0.17,0.06,12), kx+c[0]*0.30, F+0.14,
            kz+c[1]*0.46, 0.42, "#5f4a38", Math.PI/2, 0);
      m.col(kx-0.48, PW, kz-0.68, kz+0.68, 0, F+0.9);
    })();
    // rubble against the walls, and the dust of eighty years on the floor
    for(let i=0;i<26;i++){
      const t=dr(), alongA=t<0.66;
      const px=alongA ? (dr()<0.5?-1:1)*(PW-0.25+dr()*0.3) : -0.6-dr()*7.6;
      const pz=alongA ? 5.4+dr()*14.6 : 5.0+(dr()<0.5?-1:1)*(PW-0.25+dr()*0.3);
      m.P("rock", rockGeo(0.10+dr()*0.22, 2500+i*13), px, F+0.06+dr()*0.10,
           pz, dr()*6, ["#93806c","#8a7360","#9c8470"][i%3], dr()*0.8-0.4, dr()*0.8-0.4);
    }
    for(let i=0;i<30;i++){
      const alongA=(i%3)!==0;
      const px=alongA ? (dr()-0.5)*2.2 : -0.6-dr()*7.4;
      const pz=alongA ? 5.2+dr()*15.0 : 5.0+(dr()-0.5)*2.2;
      m.P("soot", planeGeo(0.5+dr()*0.9, 0.4+dr()*0.8, 0), px, F+0.013+i*0.0009, pz,
          dr()*6, "#6a5a48", -Math.PI/2, 0);
    }
    // Water has been coming through the roof for a very long time. This used
    // to be a 2 m opaque panel per stain, which lit up under the torch as a
    // blank white slab either side of the drive — the one thing down here you
    // could not read. A stain is a dark streak with a band where it stood.
    for(let i=0;i<12;i++){
      const q=(i%2)?1:-1, fw=q>0?-Math.PI/2:Math.PI/2, wxp=q*(PW-0.02);
      const cz=5.4+i*1.30;
      m.P("soot", planeGeo(0.14+dr()*0.16, 1.2+dr()*0.7, 0), wxp, F+1.32, cz, fw,
          "#4e4438", 0, 0);                             // the run, top to bottom
      m.P("soot", planeGeo(0.09+dr()*0.10, 0.9+dr()*0.5, 0), wxp+q*0.004,
          F+1.50, cz+0.16+dr()*0.3, fw, "#40382e", 0, 0);
      m.P("soot", planeGeo(0.95+dr()*0.7, 0.10+dr()*0.07, 0), wxp+q*0.008,
          F+0.52+dr()*0.16, cz, fw, "#3a3128", 0, 0);   // and where it stood
      if(i%3===0)                                       // the mineral it left behind
        m.P("ochre", planeGeo(0.05+dr()*0.05, 0.30+dr()*0.22, 0), wxp+q*0.012,
            F+1.05, cz-0.1, fw, "#a89a7c", 0, 0);
    }
    // candle stubs on ledges, all of them long out
    for(let i=0;i<9;i++){
      const alongA=i<6;
      const q=(i%2)?1:-1;
      const px=alongA ? q*(PW-0.10) : -1.4-i*0.9;
      const pz=alongA ? 7.0+i*2.1 : 5.0+q*(PW-0.10);
      m.B("rock", 0.26, 0.07, 0.26, px, F+1.12, pz, 0.5, 0, "#9c8470");
      m.C("plaster", 0.032,0.038, 0.06+((i*5)%4)*0.05, 8, px, F+1.18, pz, "#ddd5bc");
      m.P("soot", planeGeo(0.24,0.34,0), px+ (alongA? -q*0.012 : 0), F+1.30,
          pz + (alongA? 0 : -q*0.012), alongA?(q>0?-Math.PI/2:Math.PI/2):0,
          "#3a332a", 0, 0);
    }
    // A rope on spikes — which wanted the spikes. Each span now runs between
    // two of them and dips in the middle the way a slack rope does.
    for(let i=0;i<9;i++){
      const sz=6.4+i*1.9;
      m.C("metal", 0.016,0.020,0.26,6, -PW+0.10, F+1.46, sz, "#6f6558", 0, 0, Math.PI/2);
      m.P("metal", new T.TorusGeometry(0.040,0.009,4,10), -PW+0.21, F+1.46, sz,
          0, "#6f6558", 0, Math.PI/2);
      if(i<8) for(let k=0;k<3;k++){                     // the span, sagging between them
        const t=(k+0.5)/3, sag=Math.sin(t*Math.PI)*0.085;
        m.C("teal", 0.013,0.013,0.66,5, -PW+0.21, F+1.46-sag, sz+t*1.9-0.32,
            "#6a5f4a", Math.PI/2, 0, (t-0.5)*0.42);
      }
    }
    // and a lantern that will not be lit again, on the spike it was left on
    (function(){
      const lz=16.4, lxp=-PW+0.13;
      m.C("metal", 0.015,0.019,0.30,6, lxp, F+1.78, lz, "#6f6558", 0, 0, Math.PI/2);
      m.P("metal", new T.TorusGeometry(0.055,0.010,4,12), lxp+0.13, F+1.72, lz,
          0, "#5f4a38", 0, 0);                          // the bail, over the spike
      m.C("metal", 0.075,0.085,0.20,10, lxp+0.13, F+1.56, lz, "#5f4a38");
      m.P("glass", boxGeo(0.12,0.16,0.12,0), lxp+0.13, F+1.56, lz, 0, "#6f7a72");
      m.C("metal", 0.088,0.070,0.05,10, lxp+0.13, F+1.68, lz, "#5f4a38");
      m.C("metal", 0.070,0.088,0.05,10, lxp+0.13, F+1.44, lz, "#5f4a38");
    })();
    // its twin, on the floor where it was dropped, and the tools that stayed
    m.C("metal", 0.075,0.085,0.20,10, PW-0.42, F+0.09, 13.8, "#5f4a38", Math.PI/2, 0.6, 0);
    m.P("glass", boxGeo(0.12,0.12,0.16,0), PW-0.42, F+0.09, 13.8, 0.6, "#6f7a72");
    for(let i=0;i<5;i++)                                // drill steels against the wall
      m.C("metal", 0.016,0.020,1.15+((i*5)%3)*0.25, 6, -PW+0.22+((i*3)%3)*0.05,
          F+0.56, 8.4+i*0.16, "#6a6154", 0.34, 0.3+i*0.35, 0.16+((i*7)%3)*0.05);
    m.C("metal", 0.115,0.115,0.17,12, PW-0.34, F+0.085, 9.6, "#7a5a3a");   // a powder tin
    m.C("bin",   0.100,0.100,0.02,12, PW-0.34, F+0.175, 9.6, "#2b2622");
    for(let i=0;i<6;i++)                                // and the fuse off its spool
      m.P("teal", new T.TorusGeometry(0.085-i*0.004,0.010,4,12), PW-0.52, F+0.02, 10.3,
          i*0.7, "#6a5f4a", Math.PI/2, 0);
    // and somebody kept count of something, near the mouth
    for(let i=0;i<34;i++)
      m.P("ochre", planeGeo(0.022, 0.16, 0), PW-0.02, F+1.52+((i/12)|0)*0.20,
          18.1-((i%12)*0.085), -Math.PI/2, "#3a332a", 0, (i%5===4)?0.9:0);

    /* ---- and what is in the chamber ------------------------------------- */
    const AX=-13.0, AZ=1.6;                            // the altar
    const OCH="#9a3a26", OCH2="#7a2e20", BONE="#a1957a";
    // the altar itself: field stone, a slab on top, and sixty years of wax
    for(let i=0;i<14;i++)
      m.P("rock", rockGeo(0.24+((i*5)%4)*0.09, 3100+i*23), AX+((i%5)-2)*0.36,
           F+0.14+((i/5)|0)*0.30, AZ+((i%3)-1)*0.30, i*1.1, "#8a7a66",
           ((i*7)%5-2)*0.15, ((i*3)%5-2)*0.15);
    m.B("rock", 2.10, 0.17, 1.14, AX, F+0.94, AZ, 0.4, 0.06, "#7f6f5c");
    m.col(AX-1.1, AX+1.1, AZ-0.62, AZ+0.62, 0, F+1.05);
    // Wax, run down and set. Flat pale panels a hand wide read as sheets of
    // paper taped to the front of the altar; a run of wax is a narrow rope
    // that starts under a candle, varies in length, and is the colour of
    // tallow rather than of paper.
    for(let i=0;i<34;i++){
      const wx2=AX-0.98+i*0.058+dr()*0.02, len=0.10+dr()*0.44;
      m.C("plaster", 0.014+dr()*0.012, 0.020+dr()*0.014, len, 6,
          wx2, F+0.93-len/2, AZ+0.585, ["#c4b694","#b3a482","#cdc0a0"][i%3],
          0, 0, (dr()-0.5)*0.12);
      if(i%4===0)                                    // and the pool it set in
        m.P("plaster", blobGeo(0.045+dr()*0.03), wx2, F+0.93-len, AZ+0.585, 0,
            "#bdb08e", 0, 0);
    }
    m.C("metal", 0.26,0.22,0.15,16, AX-0.30, F+1.10, AZ, RUST2);      // the bowl
    m.C("bin",   0.22,0.19,0.06,16, AX-0.30, F+1.14, AZ, "#2b2622");   // and the ash in it
    m.P("metal", boxGeo(0.30,0.012,0.045,0), AX+0.46, F+1.035, AZ-0.10, 0.4, "#6f6a60", 0, 0);
    m.P("oak",   boxGeo(0.11,0.020,0.038,0), AX+0.62, F+1.036, AZ-0.16, 0.4, "#3f2f22", 0, 0);
    for(let i=0;i<7;i++){                              // candle stubs, three still going
      const cxx=AX-0.80+i*0.27, alive=(i===1||i===3||i===5);
      m.C("plaster", 0.034,0.040, 0.05+((i*5)%4)*0.06, 8, cxx, F+1.06, AZ+0.34, "#e2dac4");
      if(alive){
        m.C("ember", 0.012,0.004,0.055,6, cxx, F+1.12+((i*5)%4)*0.03, AZ+0.34, "#ff8a2a");
        m.lamp(AX+(i-3)*0.27, F+1.22, AZ+0.34, {color:0xff7a30,
                    intensity:0.085, dist:4.4, decay:1.9, indoor:true, flicker:true,
                    vol:[m.wx(CX1,0), m.wx(CX0,0), m.wz(0,CZ1), m.wz(0,CZ0),
                         0, m.y+F+CH]});
      }
    }
    m.P("fabric", boxGeo(0.46,0.09,0.34,0.5), AX+0.72, F+1.07, AZ+0.16, 0.5, "#5a2a2a", 0, 0.1);
    // the ring of stakes, wrapped, and what is on top of some of them
    for(let i=0;i<9;i++){
      const a=(i/9)*Math.PI*2+0.3, R2=3.15, H2=1.44+((i*5)%4)*0.16;
      const px=AX+Math.cos(a)*R2, pz=AZ+Math.sin(a)*R2;
      m.C("oak", 0.055,0.075,H2,7, px, F+H2/2, pz, (i%3)?TIMB:TIMB2,
          ((i*7)%5-2)*0.03, a, 0);
      for(const hy of [H2*0.52, H2*0.80])              // cord, wound round it
        for(let k=0;k<4;k++)
          m.P("teal", new T.TorusGeometry(0.068,0.011,4,9), px, F+hy+k*0.026, pz,
              0, "#6a5f4a", Math.PI/2, 0);
      if(i%3===0){                                     // a skull on this one
        // A sphere with two dots on it is a snowman. A skull is a cranium
        // that is wider than it is tall, a brow, a short muzzle and a jaw
        // under it, and it is the colour of old ivory, not of paper.
        const cr=blobGeo(0.105); cr.scale(1.00, 0.86, 1.12);
        m.P("plaster", cr, px, F+H2+0.075, pz, a, BONE, 0, 0);
        m.P("plaster", boxGeo(0.155,0.045,0.07,0), px, F+H2+0.075, pz+0.075, a,
            "#b6aa8c", 0, 0);                            // the brow
        m.P("plaster", boxGeo(0.105,0.085,0.10,0), px, F+H2+0.005, pz+0.085, a,
            "#b0a486", 0, 0);                            // the muzzle
        m.P("plaster", boxGeo(0.115,0.035,0.09,0), px, F+H2-0.048, pz+0.075, a,
            "#a89c7e", -0.18, 0);                        // the jaw, dropped
        for(const q of [-1,1]){
          m.P("bin", blobGeo(0.030), px+q*0.045, F+H2+0.052, pz+0.088, a, "#241f1b");
          m.P("bin", planeGeo(0.028,0.022,0), px+q*0.045, F+H2+0.052, pz+0.112, a,
              "#1a1614", 0, 0);
        }
        m.P("bin", planeGeo(0.026,0.030,0), px, F+H2+0.010, pz+0.118, a, "#1a1614", 0, 0);
      }else if(i%3===1){                               // a bundle of feathers and bone
        for(let k=0;k<5;k++)
          m.C("plaster", 0.008,0.012,0.22+((k*5)%3)*0.07,5, px+((k%3)-1)*0.03,
              F+H2+0.10, pz+((k%2)-0.5)*0.04, k%2?"#cfc6ac":"#8a7f63",
              0.25*((k%3)-1), a, 0.2*((k%2)-0.5));
        m.P("fabric", boxGeo(0.11,0.13,0.05,0.5), px, F+H2-0.02, pz, a, "#6a3a30", 0, 0);
      }
    }
    /* The circle on the floor, and the star inside it. Unbroken bars of
       bright red read as tape laid down last week; ochre ground into a rock
       floor sixty years ago is dark, uneven, and gone altogether in the
       places people walked. Widths vary, some segments are missing, and the
       colour sits close enough to the rock that you have to look. */
    for(let i=0;i<40;i++){
      if(i%9===3 || i%13===7) continue;                // worn through
      const a=(i/40)*Math.PI*2;
      m.P("ochre", planeGeo(0.52+((i*5)%4)*0.06, 0.032+((i*7)%4)*0.014, 0),
          AX+Math.cos(a)*(3.40+((i*3)%5-2)*0.035), F+0.014,
          AZ+Math.sin(a)*(3.40+((i*3)%5-2)*0.035), -a,
          (i%3)?"#4e2318":"#5a2b1d", -Math.PI/2, 0);
    }
    for(let i=0;i<20;i++){
      if(i%7===2) continue;
      const a=(i/20)*Math.PI*2;
      m.P("ochre", planeGeo(0.40+((i*3)%3)*0.05, 0.024+((i*5)%3)*0.010, 0),
          AX+Math.cos(a)*2.72, F+0.015, AZ+Math.sin(a)*2.72, -a,
          (i%2)?"#452017":"#502619", -Math.PI/2, 0);
    }
    for(let k=0;k<5;k++){                              // the five strokes of it
      const a0=(k/5)*Math.PI*2-Math.PI/2, a1=(((k+2)%5)/5)*Math.PI*2-Math.PI/2;
      const x0=AX+Math.cos(a0)*3.28, z0=AZ+Math.sin(a0)*3.28;
      const x1=AX+Math.cos(a1)*3.28, z1=AZ+Math.sin(a1)*3.28;
      const L=Math.hypot(x1-x0,z1-z0);
      m.P("ochre", planeGeo(L, 0.050, 0), (x0+x1)/2, F+0.017, (z0+z1)/2,
          -Math.atan2(z1-z0, x1-x0), "#4e2318", -Math.PI/2, 0);
    }
    for(let i=0;i<24;i++){                             // and the marks between the points
      const a=(i/24)*Math.PI*2+0.13;
      m.P("ochre", planeGeo(0.09+((i*5)%4)*0.05, 0.09, 0), AX+Math.cos(a)*(3.85+((i*3)%3)*0.22),
          F+0.016, AZ+Math.sin(a)*(3.85+((i*3)%3)*0.22), -a+((i*7)%5-2)*0.3,
          "#4a2317", -Math.PI/2, 0);
    }
    // the eye, on the far wall, where the torch finds it last
    (function(){
      const ex=CX0+0.42, ey=F+1.95, ez=AZ+0.4;
      for(let i=0;i<22;i++){                           // the almond, in two arcs
        const t=(i/21)*2-1, w=1.55;
        for(const q of [-1,1])
          m.P("ochre", planeGeo(0.18, 0.085, 0), ex, ey+q*Math.cos(t*1.35)*0.60,
              ez+t*w, Math.PI/2, "#552818", 0, -q*t*0.62);
      }
      for(let i=0;i<13;i++){                           // the iris
        const a=(i/13)*Math.PI*2;
        m.P("ochre", planeGeo(0.24, 0.10, 0), ex+0.006, ey+Math.sin(a)*0.44,
            ez+Math.cos(a)*0.44, Math.PI/2, "#4a2317", 0, a);
      }
      m.P("ochre", planeGeo(0.40, 0.40, 0), ex+0.010, ey, ez, Math.PI/2, "#2b2420", 0, 0);
      for(let i=0;i<11;i++)                            // and the rays off it
        m.P("ochre", planeGeo(0.05, 0.42+((i*5)%4)*0.16, 0), ex, ey+Math.sin(i*0.57)*1.15,
            ez+Math.cos(i*0.57)*2.15, Math.PI/2, "#552818", 0, i*0.57);
    })();
    // sigils on the other two walls, and a row of hands
    for(let i=0;i<16;i++){
      const nsz=(i%2)? CZ0+0.42 : CZ1-0.42, sx=CX0+1.4+((i*1.43)%(CX1-CX0-2.6));
      const ry=(i%2)?0:Math.PI;
      for(let k=0;k<3;k++)
        m.P("ochre", planeGeo(0.06, 0.20+((i+k)%3)*0.10, 0), sx+((k)-1)*0.11,
            F+1.30+((i*5)%4)*0.34, nsz, ry, (i%3)?"#552818":"#4a2317", 0, ((i*7)%5-2)*0.42+k*0.5);
    }
    for(let i=0;i<9;i++){
      const hx=CX0+2.0+i*0.86;
      m.P("ochre", planeGeo(0.15, 0.20, 0), hx, F+1.44+((i*5)%3)*0.07, CZ0+0.42, 0,
          "#552818", 0, ((i*7)%5-2)*0.10);
      for(let k=0;k<4;k++)
        m.P("ochre", planeGeo(0.035, 0.11, 0), hx-0.055+k*0.037,
            F+1.58+((i*5)%3)*0.07, CZ0+0.42, 0, "#552818", 0, (k-1.5)*0.18);
    }
    // things hung from the roof on cords
    for(let i=0;i<15;i++){
      const hx=CX0+1.1+((i*1.87)%(CX1-CX0-1.8)), hz=CZ0+0.9+((i*1.31)%(CZ1-CZ0-1.6));
      const L=0.5+((i*5)%5)*0.28;
      m.P("teal", boxGeo(0.016,L,0.016,0), hx, F+CH-L/2-0.05, hz, 0, "#6a5f4a", 0, 0);
      const kind=i%4;
      if(kind===0) m.C("glass", 0.042,0.032,0.17,9, hx, F+CH-L-0.13, hz, "#5f6e58");
      else if(kind===1) m.C("plaster", 0.016,0.020,0.20,6, hx, F+CH-L-0.13, hz, BONE,
                            0.2, i, 0.15);
      else if(kind===2){ m.P("fabric", boxGeo(0.10,0.17,0.07,0.5), hx, F+CH-L-0.11, hz,
                             i, "#5a3a30", 0, 0.1); }
      else m.C("bell", 0.035,0.050,0.07,10, hx, F+CH-L-0.09, hz, "#8a7a4a");
    }
    // the fire they kept in, and what is left of it
    (function(){
      const fx=CX0+1.9, fz=CZ1-1.9;
      for(let i=0;i<13;i++){
        const a=(i/13)*Math.PI*2;
        m.P("rock", rockGeo(0.17+((i*5)%3)*0.06, 3700+i*19), fx+Math.cos(a)*0.82,
             F+0.10, fz+Math.sin(a)*0.82, a, "#7a6a58", 0.2, 0.2);
      }
      m.P("soot", planeGeo(1.70,1.70,0), fx, F+0.014, fz, 0, "#221e19", -Math.PI/2, 0);
      for(let i=0;i<7;i++)
        m.C("bin", 0.030,0.045,0.34+((i*5)%3)*0.12, 6, fx+((i%3)-1)*0.22, F+0.07,
            fz+(((i/3)|0)-1)*0.22, "#2b2622", 1.25, i*0.9, 0);
      m.C("metal", 0.17,0.14,0.22,12, fx+0.72, F+0.11, fz-0.5, "#4a423a");
      m.C("metal", 0.010,0.010,0.30,6, fx+0.72, F+0.24, fz-0.5, "#4a423a", 0,0,Math.PI/2);
      m.col(fx-0.9, fx+0.9, fz-0.9, fz+0.9, 0, F+0.3);
    })();
    // and the rest of it: wax, bottles, bones, a chair somebody broke
    // These were thirteen near-white spheres at up to 200 mm and they read as
    // golf balls scattered on the floor. A fragment lying in dirt is flat,
    // angular and the colour of the dirt around it — bone in a dark room
    // lit by three candles is nowhere near white.
    for(let i=0;i<13;i++){
      const wx=AX+Math.cos(i*1.7)*(1.6+((i*5)%4)*0.7), wz=AZ+Math.sin(i*1.7)*(1.6+((i*5)%4)*0.7);
      const g=rockGeo(0.055+((i*3)%4)*0.030, 5100+i*37); g.scale(1.25, 0.34, 0.95);
      m.P("plaster", g, wx, F+0.022, wz, i*1.1,
          ["#7f7660","#726a56","#8a7f68"][i%3], ((i*5)%5-2)*0.06, ((i*7)%5-2)*0.06);
    }
    for(let i=0;i<11;i++)
      m.C("glass", 0.038,0.045,0.24,9, CX0+1.2+((i*2.11)%(CX1-CX0-2.2)), F+0.045,
          CZ0+1.0+((i*1.53)%(CZ1-CZ0-1.8)), ["#5f6e58","#6a5a3a","#4a5a60"][i%3],
          Math.PI/2, i*1.3, 0);
    for(let i=0;i<14;i++)
      m.C("plaster", 0.016,0.022,0.13+((i*5)%4)*0.09, 6, CX0+1.0+((i*1.77)%(CX1-CX0-2.0)),
          F+0.035, CZ0+0.9+((i*1.19)%(CZ1-CZ0-1.6)), BONE, Math.PI/2, i*0.9, 0.3);
    m.P("oak", boxGeo(0.42,0.05,0.42,0.5), CX1-1.5, F+0.05, CZ0+1.0, 0.7, "#5c4029", 0.3, 0);
    for(let i=0;i<3;i++)
      m.P("oak", boxGeo(0.05,0.44,0.05,0.5), CX1-1.7+i*0.20, F+0.12, CZ0+1.3, i, "#5c4029",
          1.2, i*0.6);
    m.P("fabric", boxGeo(0.68,0.12,0.52,0.5), CX0+2.4, F+0.06, CZ0+1.5, 0.4, "#4a4038", 0.1, 0);
    for(let i=0;i<9;i++)
      m.P("paper", planeGeo(0.22,0.29,0), CX0+1.6+((i*1.63)%(CX1-CX0-2.4)), F+0.012+i*0.0008,
          CZ0+1.1+((i*1.09)%(CZ1-CZ0-1.9)), i*1.7, "#b8ad90", -Math.PI/2, 0);
    // hundreds of tallies, scratched into the rock by the door
    for(let i=0;i<120;i++)
      m.P("ochre", planeGeo(0.016, 0.10, 0), CX1-0.42, F+0.80+((i/24)|0)*0.17,
          CZ0+0.9+((i%24)*0.075), -Math.PI/2, "#3f372e", 0, (i%5===4)?0.9:0);

    m.zone(CX0, CX1, CZ0, CZ1, F-1, F+CH, "THE CHAMBER", true);
    m.zone(-PW-0.4, PW+0.4, 4.6, 20.4, F-1, F+PH, "THE ADIT", true);
    m.zone(-9.0, 1.6, 5.0-PW-0.4, 5.0+PW+0.4, F-1, F+PH, "THE ADIT", true);
  })();


  /* --- somebody camped here, a while ago ------------------------------- */
  (function(){
    const m=mk(-70, -129);
    for(let i=0;i<11;i++)                                              // the fire ring
      m.P("gravel", new T.DodecahedronGeometry(0.13+((i*5)%3)*0.04,0),
          Math.cos(i*0.57)*0.72, 0.08, Math.sin(i*0.57)*0.72, i, "#6b6055");
    m.P("oak", new T.CylinderGeometry(0.05,0.07,0.66,6), 0.1,0.06,0, 0, "#2a241c", 0, 1.3);
    m.P("oak", new T.CylinderGeometry(0.05,0.07,0.60,6), -0.1,0.06,0.1, 0.8, "#2a241c", 0, 1.4);
    for(const d of [[2.4,1.1,0.2,"#8a4a2a"],[3.0,0.3,1.5,"#5a6b4a"],[2.1,-0.9,0.9,"#7a4a30"]])
      m.C("weathered", 0.30,0.30,0.88,14, d[0],0.44,d[1], d[3], 0,0,d[2]);
    m.P("fabric", boxGeo(1.35,0.22,1.95,0.5), -2.6,0.09,0.9, 0.6, "#8f8878", 0.07, 0.05);
    m.P("fabric", boxGeo(1.16,0.06,1.72,0.5), -2.6,0.20,0.9, 0.6, "#6e6656", 0.07, 0.05);
    m.P("rust", streakGeo(1.1,1.5,0), -2.5,0.21,1.0, 0.6, "#6a4028", -Math.PI/2, 0);
    for(const t2 of [[1.2,-2.2],[-1.6,-1.4],[3.6,-1.9]])
      m.P("bin", new T.CylinderGeometry(0.05,0.045,0.12,8), t2[0],0.06,t2[1], 0, "#9aa1a6", 1.4, 0);
    m.col(2.0,3.4,-1.2,1.9, 0,0.9);
    m.zone(10, "A COLD FIRE");
  })();

  /* --- a trailer somebody walked out of and never came back to ---------
     Eight and a half metres of 1960s single-wide up on cinder blocks, with
     the door hanging open and forty years of weather in it. You can walk
     in: the floor is a real surface, the windows are real holes, and the
     inside is knee-deep in what got left behind.                        */
  (function(){
    const OX=-356, OZ=-246;                  // a good two hundred metres off the drive-in
    const m=mk(OX,OZ);
    let sd=20260913;                       // one seed, so the mess bakes the same
    const rn=()=>{ sd=(sd*1103515245+12345)%2147483648; return sd/2147483648; };
    const rr2=(a,b)=>a+rn()*(b-a);

    const L=9.00, W=3.00, TT=0.10, FY=0.62, IH=2.06, RY=FY+IH;
    const X0=-L/2, X1=L/2, ZS=W/2, ZN=-W/2;      // south wall is +z, north is -z
    // the shell's inner faces. Everything inside laps INTO them by at least
    // twenty millimetres — nothing lands flush, or it buzzes at range.
    const IX0=X0+TT/2, IX1=X1-TT/2, IZ0=ZN+TT/2, IZ1=ZS-TT/2, PT=0.08;
    const DOOR=[1.70,2.60], DH=1.88;             // the door opening
    const SKIN="#cfc6b0", TRIM="#7e9aa6", DARK="#8d8474";

    // the runs of wall left between a list of openings
    const segs=(a0,a1,holes)=>{
      const out=[]; let c=a0;
      for(const h of holes){ if(h[0]>c) out.push([c,h[0]]); c=Math.max(c,h[1]); }
      if(c<a1) out.push([c,a1]);
      return out;
    };
    const band=(bk, zc, th, a0,a1, holes, yc, h, col)=>{
      for(const g of segs(a0,a1,holes))
        m.B(bk, g[1]-g[0], h, th, (g[0]+g[1])/2, yc, zc, 0.55, 0, col);
    };

    const WS=[[-3.95,-2.75],[-1.35,-0.15],[3.05,4.05]];      // south windows
    const WN=[[-4.05,-2.85],[-0.60,0.60],[2.55,3.85]];       // north windows
    const YS=FY+0.45, YW=FY+1.26, YH=FY+1.84;                // the three bands
    const HS=0.90, HW=0.72, HH=0.44;

    // ---- shell --------------------------------------------------------
    m.B("weathered", L, 0.18, W, 0, FY-0.11, 0, 0.45, 0, DARK);          // the deck
    const SDOOR=WS.concat([DOOR]).sort((a,b)=>a[0]-b[0]);
    band("siding", ZS, TT, X0, X1, [DOOR], YS, HS, SKIN);                 // south
    band("siding", ZS, TT, X0, X1, SDOOR,  YW, HW, SKIN);
    band("siding", ZS, TT, X0, X1, [DOOR], YH, HH, SKIN);
    m.B("siding", DOOR[1]-DOOR[0], RY-(FY+DH), TT,                        // lintel
        (DOOR[0]+DOOR[1])/2, (FY+DH+RY)/2, ZS, 0.55, 0, SKIN);
    band("siding", ZN, TT, X0, X1, [],     YS, HS, SKIN);                 // north
    band("siding", ZN, TT, X0, X1, WN,     YW, HW, SKIN);
    band("siding", ZN, TT, X0, X1, [],     YH, HH, SKIN);
    for(const sx of [-1,1])                                               // the ends
      m.B("siding", TT, IH, W-TT*2, sx*(L/2-TT/2), FY+IH/2, 0, 0.55, 0, SKIN);
    // panelling on the inside, because nobody lined a trailer in aluminium.
    // The sill band runs below the floor and the header above the ceiling, so
    // neither ends on a plane the floor or the ceiling also ends on.
    const PAN="#a48a63", PX0=X0+0.02, PX1=X1-0.02;
    const inset=hs=>hs.map(h=>[h[0]+0.02, h[1]-0.02]);   // a reveal at every opening
    // Its own three bands, stacked, and not one of them ending on a plane
    // the aluminium outside also ends on.
    for(const pz of [[IZ1-0.02, [DOOR], SDOOR], [IZ0+0.02, [], WN]]){
      band("oak", pz[0], PT, PX0, PX1, inset(pz[1]), FY+0.44, 1.00, PAN);
      band("oak", pz[0], PT, PX0, PX1, inset(pz[2]), FY+1.30, 0.72, PAN);
      band("oak", pz[0], PT, PX0, PX1, inset(pz[1]),
           (FY+1.66+RY+0.10)/2, (RY+0.10)-(FY+1.66), PAN);
    }
    for(const sx of [-1,1])
      m.B("oak", PT, IH+0.16, (IZ1-IZ0)+0.11, sx*(IX1-0.02), FY+IH/2, 0, 0.5, 0, PAN);
    // and sheet flooring, gone the colour of the dust on it
    m.B("weathered", IX1-IX0, 0.04, IZ1-IZ0, 0, FY-0.02, 0, 0.30, 0, "#8a7a5c");
    m.B("weathered", L+0.34, 0.14, W+0.26, 0, RY+0.07, 0, 0.40, 0, "#c8c0ae");  // roof
    m.B("weathered", L+0.10, 0.07, W-0.30, 0, RY+0.16, 0, 0.40, 0, "#d2cab8");  // camber
    for(const g of segs(X0-0.06, X1+0.06, [DOOR]))                        // belt line
      m.B("teal", g[1]-g[0], 0.07, 0.05, (g[0]+g[1])/2, FY+0.92, ZS+0.05, 0, 0, TRIM);
    m.B("teal", L+0.12, 0.07, 0.05, 0, FY+0.92, ZN-0.05, 0, 0, TRIM);
    // rust weeping down the skin
    for(let i=0;i<9;i++){
      const zc=(i%2)?ZS+0.06:ZN-0.06;
      m.P("rust", streakGeo(0.50,1.30,0), rr2(X0+0.5,X1-0.5), FY+1.10, zc,
          (i%2)?0:Math.PI, "#6a3a20", 0, 0);
    }
    // ---- up on blocks, with the tongue still hitched to nothing --------
    for(const px of [-3.5,0,3.5]) for(const pz of [-1.05,1.05]){
      m.B("concrete", 0.42,0.44,0.22, px, 0.22, pz, 0.5, 0, "#9d968a");
      m.B("concrete", 0.46,0.05,0.26, px, 0.46, pz, 0.5, 0, "#8b8478");
    }
    m.B("siding", L-0.4, 0.50, 0.06, 0, 0.26, ZN+0.02, 0.55, 0, "#b9b09c");  // skirting
    for(const sx of [-1,1])                                                  // drawbar
      m.P("teal", boxGeo(1.70,0.11,0.11,0), -L/2-0.70, 0.44, sx*0.42,
          sx*0.26, "#6e6a62", 0, 0);
    m.B("teal", 0.14,0.12,0.90, -L/2-1.46, 0.44, 0, 0, 0, "#6e6a62");
    m.C("teal", 0.05,0.05,0.52,8, -L/2-1.40, 0.22, 0, "#6e6a62");
    m.C("tyre",  0.13,0.13,0.07,10, -L/2-1.40, 0.06, 0, "#1b1914", 0,0,Math.PI/2);
    // ---- the door itself, swung out and dropped on its hinges ----------
    // hung from the jamb at DOOR[0], so it opens where a door would
    const DA=-0.95, DW=0.86, DCX=DOOR[0]+DW/2*Math.cos(DA), DCZ=ZS-DW/2*Math.sin(DA);
    m.P("siding", boxGeo(DW,DH,0.05,0.6), DCX, FY+DH/2-0.06, DCZ, DA, "#c3b9a2", 0, 0.05);
    m.P("oak", boxGeo(DW-0.10,0.62,0.02,0.5), DCX-0.03, FY+0.28, DCZ-0.03, DA, "#8e8064", 0, 0.05);
    m.P("glass", boxGeo(0.44,0.42,0.02,0), DCX+0.02, FY+1.34, DCZ-0.03, DA, "#93a49f", 0, 0.05);
    m.P("teal", boxGeo(0.10,0.05,0.05,0), DOOR[0]+0.74, FY+0.96, ZS+0.10, DA, "#8e877a", 0, 0.05);
    for(const hy of [FY+0.22, FY+1.66])                                  // the hinge straps
      m.B("teal", 0.13,0.09,0.06, DOOR[0]+0.05, hy, ZS+0.04, 0, 0, "#7d766a");
    // a notice nobody was left to read
    m.P("paper", planeGeo(0.20,0.27,0), DOOR[1]-0.06, FY+1.44, ZS+0.03, 0, "#d8cfae", 0, 0.07);
    // ---- two blocks for a step ----------------------------------------
    m.B("concrete", 0.90,0.34,0.58, 2.15, 0.17, ZS+0.44, 0.5, 0, "#9d968a");
    m.B("concrete", 0.94,0.04,0.62, 2.15, 0.36, ZS+0.44, 0.5, 0, "#8b8478");
    // ---- where you may stand ------------------------------------------
    m.flat(IX0, IX1, IZ0, IZ1, FY);                       // the floor
    m.flat(DOOR[0]+0.04, DOOR[1]-0.04, IZ1-0.06, ZS+0.09, FY);   // the threshold
    m.flat(1.72, 2.58, ZS+0.16, ZS+0.73, 0.34);           // the step
    // ---- and where you may not -----------------------------------------
    for(const g of segs(X0,X1,[DOOR])){                   // the walls, all three bands
      m.col(g[0], g[1], ZS-TT/2, ZS+TT/2, FY, RY);
      m.col(g[0], g[1], ZN-TT/2, ZN+TT/2, FY, RY);
    }
    for(const g of segs(X0,X1,[]))                        // the north wall has no door
      m.col(g[0], g[1], ZN-TT/2, ZN+TT/2, FY, RY);
    for(const sx of [-1,1]) m.col(sx*L/2-TT/2, sx*L/2+TT/2, ZN, ZS, FY, RY);
    for(const g of segs(X0,X1,[DOOR]))                    // and the underbelly
      m.col(g[0], g[1], ZN, ZS, -0.2, FY-0.03);

    /* ---- the kitchen end, such as it is ------------------------------- */
    m.B("lino", 2.30,0.86,0.60, -3.25, FY+0.41, IZ0+0.26, 0.5, 0, "#b6ac92");  // counter
    m.B("oak",  2.36,0.06,0.62, -3.25, FY+0.83, IZ0+0.28, 0.5, 0, "#8e7f62");
    m.B("teal", 0.56,0.10,0.40, -3.60, FY+0.83, IZ0+0.28, 0, 0, "#9aa29c");   // the sink
    m.C("metal", 0.02,0.02,0.22,7, -3.60, FY+0.96, IZ0+0.12, "#9aa1a4");
    m.B("oak",  1.50,0.52,0.30, -3.40, FY+1.62, IZ0+0.15, 0.5, 0, "#7d6f55");  // uppers
    m.P("oak",  boxGeo(0.62,0.48,0.04,0.5), -2.40, FY+1.60, IZ0+0.44, -1.15, "#6f624a");
    m.B("weathered", 0.60,1.28,0.58, -4.05, FY+0.64, IZ1-0.36, 0.4, 0, "#cdc6b4"); // icebox
    m.P("weathered", boxGeo(0.05,1.16,0.54,0.4), -3.62, FY+0.64, IZ1-0.66, -1.05, "#c2bba8");
    m.B("weathered", 0.52,0.96,0.54, -2.05, FY+0.40, IZ0+0.20, 0.4, 0, "#b8b1a0"); // stove
    m.B("teal", 0.54,0.05,0.50, -2.05, FY+0.86, IZ0+0.26, 0, 0, "#7c8286");
    m.col(-4.4,-1.7, IZ0, IZ0+0.62, FY, FY+0.9);
    m.col(-4.4,-3.6, IZ1-0.7, IZ1, FY, FY+1.4);

    /* ---- the dinette, one bench down --------------------------------- */
    m.B("oak", 0.96,0.05,0.66, -0.55, FY+0.68, 0.05, 0.5, 0, "#8a7c60");       // table
    m.C("metal", 0.05,0.09,0.66,10, -0.55, FY+0.34, 0.05, "#8d9498");
    m.B("fabric", 1.00,0.40,0.52, -0.55, FY+0.20, IZ0+0.30, 0.5, 0, "#6f7a62"); // bench
    m.B("fabric", 1.00,0.44,0.10, -0.55, FY+0.62, IZ0+0.06, 0.5, 0, "#65705a");
    m.P("fabric", boxGeo(1.00,0.38,0.50,0.5), -0.55, FY+0.16, IZ1-0.34, 0, "#5d6754", 0.30, 0);
    m.P("oak",   boxGeo(0.90,0.05,0.44,0.5), -0.55, FY+0.03, IZ1-0.62, 0, "#7b6e54", 0.12, 0);
    addSeat(OX-0.55, OZ+IZ0+0.34, m.y+FY+0.42, Math.PI, "THE DINETTE");
    m.col(-1.1,0.0, IZ0, IZ0+0.60, FY, FY+0.8);

    /* ---- the bed end -------------------------------------------------- */
    m.B("oak", 1.32,0.28,1.88, 3.55, FY+0.14, 0.10, 0.5, 0, "#7a6c52");
    m.P("fabric", boxGeo(1.22,0.20,1.78,0.5), 3.55, FY+0.36, 0.10, 0, "#b3a88e", 0.03, 0.02);
    m.P("fabric", boxGeo(0.70,0.09,0.90,0.5), 3.20, FY+0.50, 0.55, 0.4, "#8e8878", 0.05, 0.03);
    m.B("oak", 0.80,0.74,0.44, 2.35, FY+0.37, IZ0+0.24, 0.5, 0, "#6f6249");     // dresser
    m.P("oak", boxGeo(0.68,0.16,0.40,0.5), 2.45, FY+0.09, IZ0+0.66, 0.22, "#7f7256", 0, 0.1);
    m.P("oak", boxGeo(0.66,0.15,0.38,0.5), 1.80, FY+0.08, 0.25, -0.5, "#7f7256", 0.06, 0);
    m.col(2.9,4.4, -0.9, 1.1, FY, FY+0.5);
    m.col(2.0,2.8, IZ0, IZ0+0.5, FY, FY+0.8);

    /* ---- ceiling, and the bit of it that came down -------------------- */
    m.B("ceil", IX1-IX0, 0.10, IZ1-IZ0, 0, RY-0.02, 0, 0.5, 0, "#cdc5ae");
    // The panel that came down used to hang out across the middle of the van
    // at head height, which from the doorway is a slab floating in the room
    // and nothing else. It is on the floor where it landed.
    m.P("ceil", boxGeo(1.10,0.05,1.00,0.5), 1.35, FY+0.04, IZ1-0.62, 0.6, "#a89e86",
        0.05, 0.03);
    m.P("fabric", boxGeo(1.00,0.14,0.86,0.5), 1.05, FY+0.09, IZ1-0.78, 0.5, "#a89b80",
        0.04, 0.02);
    for(let i=0;i<5;i++)                               // and the hole it left
      m.P("soot", planeGeo(0.34+((i*5)%3)*0.16, 0.30+((i*7)%3)*0.14, 0),
          0.70+((i*7)%3-1)*0.30, RY-0.07, -0.30+((i*5)%3-1)*0.28, i*1.2,
          "#3a332a", Math.PI/2, 0);
    for(const wx of [-2.2, 1.1])                       // insulation on the floor
      m.P("fabric", boxGeo(0.86,0.10,0.62,0.5), wx, FY+0.05, rr2(IZ0+0.3,IZ1-0.3),
          rr2(0,3), "#a2977e", 0.04, 0.03);
    // a curtain still on one window, a rag on another
    m.P("curtain", planeGeo(1.05,0.80,0), -3.35, FY+1.22, IZ1-0.02, 0, "#9c8f74", 0, 0.05);
    m.P("curtain", planeGeo(0.42,0.62,0), 3.70, FY+1.28, IZ1-0.02, 0, "#8e8368", 0, -0.12);

    /* ---- what got left behind ----------------------------------------- */
    // papers, everywhere: on the floor, drifted into the corners, one or two
    // still pinned where somebody put them
    for(let i=0;i<62;i++){
      const px=rr2(IX0+0.25, IX1-0.25), pz=rr2(IZ0+0.18, IZ1-0.18);
      m.P("paper", planeGeo(rr2(0.16,0.24), rr2(0.22,0.31), 0), px, FY+0.012+i*0.0016, pz,
          rr2(0,6.28), "#ffffff", -Math.PI/2 + rr2(-0.05,0.05), rr2(-0.05,0.05));
    }
    for(let i=0;i<7;i++){                              // banked against the walls
      const px=rr2(IX0+0.4, IX1-0.4), pz=(i%2)?IZ1-0.09:IZ0+0.09;
      m.P("paper", planeGeo(0.20,0.28,0), px, FY+0.13, pz, (i%2)?0:Math.PI, "#ffffff",
          -1.05, rr2(-0.2,0.2));
    }
    // sand that has come in through the door and the broken windows
    m.P("gravel", boxGeo(1.30,0.07,0.80,0.5), 2.15, FY+0.03, IZ1-0.34, 0.1, "#c0a87e", 0.03, 0);
    m.P("gravel", boxGeo(0.90,0.05,0.55,0.5), -3.30, FY+0.02, IZ1-0.30, 0.3, "#c0a87e", 0.02, 0);
    m.P("gravel", boxGeo(1.10,0.05,0.60,0.5), 3.55, FY+0.02, IZ1-0.30, -0.2, "#c0a87e", 0.02, 0);
    // cans, a bottle, a bucket, a cassette, glass out of the east window
    for(let i=0;i<19;i++)
      m.C("teal", 0.033,0.033,0.12,9, rr2(IX0+0.3,IX1-0.3), FY+0.034, rr2(IZ0+0.2,IZ1-0.2),
          ["#9aa1a6","#b4915c","#8c9a8e"][i%3], Math.PI/2, rr2(0,3.1), 0);
    for(let i=0;i<4;i++)
      m.C("glass", 0.037,0.037,0.24,9, rr2(IX0+0.4,IX1-0.4), FY+0.038, rr2(IZ0+0.25,IZ1-0.25),
          "#6f7a5e", Math.PI/2, rr2(0,3.1), 0);
    m.C("bin", 0.16,0.13,0.28,12, 0.60, FY+0.14, IZ0+0.36, "#8c9498", 0, 0, 0.22);
    for(let i=0;i<9;i++)                               // glass on the floor, east end
      m.P("glass", boxGeo(rr2(0.03,0.07),0.012,rr2(0.03,0.08),0),
          rr2(3.4,4.3), FY+0.01, rr2(IZ0+0.2,IZ1-0.2), rr2(0,3.1), "#b9c6c2", 0, 0);
    // a television with nothing left in it
    m.B("weathered", 0.52,0.48,0.40, 1.15, FY+0.21, IZ0+0.17, 0.4, 0, "#b0a892");
    m.B("tvglass", 0.40,0.32,0.03, 1.15, FY+0.24, IZ0-0.04, 0, 0, "#14191c");
    // a chair on its side and a suitcase somebody gave up on
    m.P("oak", boxGeo(0.42,0.05,0.40,0.5), 0.15, FY+0.24, IZ1-0.42, 0.7, "#7b6e54", 1.55, 0);
    m.P("oak", boxGeo(0.40,0.44,0.05,0.5), 0.15, FY+0.45, IZ1-0.42, 0.7, "#7b6e54", 1.55, 0);
    m.P("weathered", boxGeo(0.60,0.18,0.42,0.5), -1.55, FY+0.09, IZ1-0.36, -0.4, "#7c6a52", 0, 0.04);
    m.P("weathered", boxGeo(0.58,0.16,0.40,0.5), -1.30, FY+0.17, IZ1-0.52, -0.9, "#8a7860", 0.55, 0);
    // magazines gone to pulp, and a hand of cards somebody never finished
    for(let i=0;i<5;i++)
      m.P("paper", boxGeo(rr2(0.20,0.26), rr2(0.02,0.05), rr2(0.26,0.32), 0),
          rr2(IX0+0.5,IX1-0.5), FY+0.03, rr2(IZ0+0.3,IZ1-0.3), rr2(0,3.1), "#c9bfa2", 0, 0);
    for(let i=0;i<9;i++)
      m.P("paper", planeGeo(0.055,0.082,0), rr2(-1.4,0.4), FY+0.014, rr2(IZ0+0.4,IZ1-0.4),
          rr2(0,6.28), "#efe9d6", -Math.PI/2, 0);
    // a calendar, still on a month in 1979
    m.P("paper", planeGeo(0.26,0.34,0), -1.20, FY+1.52, IZ0+0.02, 0, "#ded4b4", 0, 0.03);

    /* ---- outside ------------------------------------------------------ */
    // the awning: bolted on high, sloping away, one leg gone and that corner
    // sagging. You walk under it to reach the door.
    m.P("weathered", boxGeo(3.40,0.05,1.60,0.5), 1.10, FY+1.74, ZS+0.92, 0, "#b6aa90", 0.21, 0.07);
    m.P("weathered", boxGeo(3.44,0.10,0.07,0), 1.10, FY+1.52, ZS+1.70, 0, "#9d9280", 0, 0.07);
    m.C("teal", 0.035,0.035,2.06,8, 2.72, 1.05, ZS+1.66, "#9aa1a4");         // the leg left
    m.P("teal", boxGeo(0.05,1.90,0.05,0), -0.55, 0.20, ZS+2.20, 0.4, "#9aa1a4", 1.42, 0);
    m.C("weathered", 0.16,0.16,0.62,12, -L/2+0.5, 0.31, ZS+0.70, "#b8613a", 0, 0, 0.08); // propane
    m.C("metal", 0.05,0.05,0.10,8, -L/2+0.5, 0.66, ZS+0.70, "#8e877a");
    m.B("weathered", 0.66,0.36,0.52, 3.90, 0.18, ZS+0.90, 0.4, 0.4, "#a89c84");   // a cooler
    m.C("tyre", 0.34,0.34,0.22,14, -2.60, 0.11, ZS+1.90, "#1b1914", Math.PI/2, 0.3, 0);
    m.P("oak", boxGeo(0.44,0.05,0.42,0.5), 0.90, 0.30, ZS+2.10, 0.9, "#6f624a", 1.4, 0);
    // a swamp cooler that stopped cooling, up on the roof
    m.B("weathered", 0.74,0.62,0.74, -1.80, RY+0.46, 0.20, 0.4, 0, "#b0a892");
    m.B("teal", 0.68,0.42,0.03, -1.80, RY+0.46, -0.18, 0, 0, "#8d9498");
    m.B("teal", 0.03,0.42,0.68, -2.18, RY+0.46, 0.20, 0, 0, "#8d9498");
    m.C("teal", 0.07,0.07,0.70,8, -1.20, RY+0.40, 0.20, "#8e877a", 0, 0, 1.57);
    // a clothesline with nothing on it but two pegs
    for(const sx of [-1,1]){
      m.C("oak", 0.06,0.07,2.10,7, 5.6, 1.05, sx*2.2, "#6b5947");
      m.B("oak", 0.05,0.05,0.90, 5.6, 2.00, sx*1.85, 0, 0, "#6b5947");
    }
    m.P("teal", boxGeo(0.012,0.012,4.20,0), 5.6, 1.96, 0, 0, "#8a8274", 0, 0.03);
    // weeds have taken the shady side
    for(let i=0;i<12;i++)
      m.P("foliage", new T.IcosahedronGeometry(rr2(0.12,0.28),0),
          rr2(-5.4,5.4), 0.16, ZN-rr2(0.6,2.4), rr2(0,3), "#6d7a4e");
    // the mailbox that stopped being checked
    m.C("teal", 0.06,0.06,1.05,7, 7.2, 0.52, ZS+0.4, "#6e6a62");
    m.B("weathered", 0.22,0.20,0.36, 7.2, 1.14, ZS+0.4, 0.4, 0.25, "#9a9284");


    /* ---- the rest of the detail --------------------------------------- */
    // a half-partition where the bathroom door was, with the folding door
    // still hanging off one of its runners
    const WVIS0=IZ0+0.06, WVIS1=IZ1-0.06;
    m.B("oak", 0.09, IH-0.10, 0.82, 1.42, FY+0.98, WVIS1-0.41, 0.5, 0, "#9c8259");
    m.B("oak", 0.09, IH-0.10, 0.52, 1.42, FY+0.98, WVIS0+0.26, 0.5, 0, "#9c8259");
    m.P("oak", boxGeo(0.04,1.74,0.54,0.5), 1.47, FY+0.90, WVIS0+0.62, 0, "#8a7350", 0, 0.16);
    // the bathroom itself: a pan with no lid, a basin, and where a mirror was
    m.B("plaster", 0.36,0.40,0.34, 1.90, FY+0.20, WVIS0+0.24, 0.5, 0, "#cdc6b6");
    push("plaster", new T.CylinderGeometry(0.17,0.19,0.16,14), OX+1.90, m.y+FY+0.46, OZ+WVIS0+0.24,
         0, new T.Color("#cdc6b6"));
    m.B("plaster", 0.34,0.14,0.28, 2.42, FY+0.74, WVIS0+0.20, 0.5, 0, "#c7c0b0");
    m.B("teal",   0.02,0.02,0.16, 2.42, FY+0.84, WVIS0+0.30, 0, 0, "#9aa1a4");
    m.B("oak",    0.42,0.52,0.03, 2.42, FY+1.40, WVIS0+0.07, 0.5, 0, "#6f6048");   // mirror, gone
    m.P("glass",  boxGeo(0.16,0.20,0.01,0), 2.34, FY+1.44, WVIS0+0.09, 0, "#9fb0ab", 0, 0.2);
    // fittings: a fixture hanging by its wires, switches, a stopped clock
    m.C("teal", 0.015,0.015,0.34,6, -0.30, RY-0.24, 0.10, "#6e6a62", 0.3, 0, 0.2);
    m.P("ceil", new T.SphereGeometry(0.15,12,8), -0.34, RY-0.44, 0.16, 0, "#d8d0b8", 0.4, 0.2);
    m.B("plaster", 0.10,0.14,0.02, 2.90, FY+1.26, WVIS1-0.02, 0, 0, "#ded6c2");     // switch
    m.B("plaster", 0.09,0.12,0.02, -2.60, FY+0.36, WVIS0+0.02, 0, 0, "#ded6c2");    // outlet
    m.B("plaster", 0.14,0.10,0.02, -1.05, FY+1.34, WVIS0+0.02, 0, 0, "#e2dac6");    // thermostat
    m.P("clockface", planeGeo(0.24,0.24,0), 0.35, FY+1.44, WVIS0+0.03, 0, "#e8e2cf", 0, 0);
    // kitchen: what was on the counter when they left
    m.C("teal", 0.09,0.10,0.17,12, -2.05, FY+0.95, IZ0+0.36, "#b2b8b8");            // kettle
    m.B("teal", 0.06,0.02,0.09, -1.94, FY+1.00, IZ0+0.36, 0, 0.5, "#b2b8b8");
    for(let i=0;i<4;i++)
      push("plaster", new T.CylinderGeometry(0.11,0.11,0.02,14),
           OX-3.90, m.y+FY+0.87+i*0.022, OZ+IZ0+0.30, 0, new T.Color("#d6cfbc"));   // plates
    for(let i=0;i<6;i++)                                                            // cans
      m.C("teal", 0.035,0.035,0.11,10, -3.05+((i%3)*0.10), FY+1.44+((i/3)|0)*0.13,
          IZ0+0.20, ["#9a5a3a","#5f7a52","#8a8256"][i%3]);
    m.P("paper", planeGeo(0.05,0.44,0), -2.55, RY-0.30, IZ0+0.30, 0.4, "#d8cfa8", 0, 0.05);// fly strip
    // the rest of what is on the floor
    m.P("weathered", boxGeo(0.30,0.11,0.42,0.5), -1.05, FY+0.06, WVIS1-0.34, 0.8, "#6a5a48", 0, 0.05);
    m.P("weathered", boxGeo(0.12,0.09,0.27,0.5), 0.62, FY+0.05, WVIS0+0.40, -0.6, "#4a3c2e", 0.05, 0.1);
    m.C("teal", 0.02,0.02,1.16,7, -0.10, FY+0.10, WVIS0+0.30, "#8a8274", 1.50, 0.7, 0);  // broom
    m.P("fabric", boxGeo(0.22,0.06,0.20,0.5), -0.02, FY+0.09, WVIS0+0.62, 0.7, "#9a9482", 0, 0);
    m.C("bin", 0.19,0.16,0.30,12, -4.05, FY+0.15, WVIS1-0.34, "#7f8a86", 0, 0, 0.10);    // pail
    for(let i=0;i<5;i++)                                                                  // bottle crate
      m.C("glass", 0.036,0.036,0.22,9, 0.92+((i%3)*0.09), FY+0.11, WVIS1-0.52+((i/3)|0)*0.09,
          "#5f7a4a", 0, 0, 0);
    m.P("weathered", boxGeo(0.34,0.24,0.28,0.5), 0.95, FY+0.12, WVIS1-0.48, 0.15, "#8a6a42", 0, 0);
    // the bed end: bedding half off it, a case, a photograph face down
    m.P("fabric", boxGeo(1.18,0.10,0.92,0.5), 3.40, FY+0.50, -0.55, 0.1, "#8e8266", 0.10, 0.05);
    m.P("fabric", boxGeo(0.62,0.09,0.70,0.5), 2.90, FY+0.07, -0.72, 0.5, "#8e8266", 0.03, 0.02);
    m.P("weathered", boxGeo(0.54,0.16,0.38,0.5), 4.05, FY+0.09, WVIS1-0.36, 0.25, "#7a6850", 0, 0.03);
    m.P("oak", boxGeo(0.20,0.02,0.26,0.5), 2.72, FY+0.03, 0.62, 0.9, "#6f6048", -Math.PI/2, 0);
    // stains: water down the panelling, soot where a heater was
    for(const st of [[-2.30,WVIS0+0.02,0],[2.05,WVIS1-0.02,Math.PI],[3.95,WVIS0+0.02,0]])
      m.P("soot", planeGeo(0.80,1.30,0), st[0], FY+1.05, st[1], st[2], "#6a5a3a", 0, 0);
    m.P("soot", planeGeo(1.60,0.90,0), 0.20, RY-0.11, -0.20, 0, "#5a4a30", -Math.PI/2, 0);

    /* ---- and outside --------------------------------------------------- */
    // the aerial that never got taken down
    m.C("teal", 0.035,0.035,1.60,8, 2.60, RY+0.86, -0.90, "#9aa1a4");
    for(let i=0;i<7;i++){
      const w=0.86-i*0.09;
      m.B("teal", 0.02,0.02,w, 2.60, RY+0.34+i*0.20, -0.90, 0, 0, "#9aa1a4");
    }
    // a window unit that quit, and the bracket under it
    m.B("weathered", 0.62,0.42,0.38, -0.75, FY+1.16, ZS+0.16, 0.4, 0, "#b6ae9a");
    m.B("teal", 0.56,0.03,0.30, -0.75, FY+0.93, ZS+0.16, 0, 0, "#8d9498");
    for(let i=0;i<6;i++) m.B("teal", 0.50,0.02,0.02, -0.75, FY+1.02+i*0.055, ZS+0.34, 0, 0, "#79807f");
    // a handrail beside the step
    m.C("teal", 0.030,0.030,1.15,8, 1.62, 0.58, ZS+0.52, "#8a8274");
    m.C("teal", 0.030,0.030,0.72,8, 1.62, 1.10, ZS+0.22, "#8a8274", 0, 0, 1.25);
    // a barbecue, a jerry can, a stack of tyres, a bowl on a chain
    m.C("weathered", 0.26,0.26,0.20,14, 4.60, 0.62, ZS+1.10, "#6e6862");
    for(let i=0;i<3;i++) m.C("teal", 0.02,0.02,0.56,6, 4.60+Math.cos(i*2.1)*0.20, 0.28,
                             ZS+1.10+Math.sin(i*2.1)*0.20, "#6e6a62", 0.18, i*2.1, 0.12);
    m.B("weathered", 0.24,0.36,0.16, 5.40, 0.18, ZS+0.55, 0.4, 0.3, "#8a6a3a");
    for(let i=0;i<3;i++)
      m.C("tyre", 0.33,0.33,0.19,14, -4.10, 0.10+i*0.19, ZS+1.30, "#1b1914");
    push("plaster", new T.CylinderGeometry(0.13,0.10,0.07,14), OX+3.10, m.y+0.04, OZ+ZS+1.60,
         0, new T.Color("#b9b2a2"));
    // stepping stones from the track to the step
    for(let i=0;i<6;i++)
      m.P("concrete", boxGeo(0.42,0.06,0.40,0.5), 2.15+Math.sin(i*1.4)*0.55, 0.03,
          ZS+1.35+i*0.95, i*0.5, "#a09888", 0, 0);
    // the skirting torn open, and what has got in under there
    m.P("siding", boxGeo(0.90,0.52,0.05,0.55), -1.30, 0.30, ZN-0.16, 0.25, "#b0a793", 0.12, 0.30);
    for(let i=0;i<5;i++)
      m.P("paper", planeGeo(0.18,0.25,0), rr2(-4.0,4.0), 0.02, ZN-rr2(0.5,1.9),
          rr2(0,6.28), "#ffffff", -Math.PI/2, 0);
    // sand banked up the shaded side, and a drift across the north skirt
    m.P("gravel", boxGeo(7.40,0.34,1.10,0.4), -0.40, 0.10, ZN-0.52, 0, "#c0a87e", 0, 0.02);
    // a plate nailed to the end wall, and the number the mail came to
    m.P("paint", planeGeo(0.30,0.16,0), -L/2-0.06, FY+1.30, -0.35, -Math.PI/2, "#c8c2ae", 0, 0);
    m.P("paint", planeGeo(0.34,0.12,0), 7.2, 1.30, ZS+0.30, 0, "#d8d2be", 0, 0);

    m.rect(-9, 11, -6, 7, "SOMEBODY'S TRAILER");
    addZone(OX+IX0, OX+IX1, OZ+IZ0, OZ+IZ1, m.y+FY-0.2, m.y+RY,
            "SOMEBODY'S TRAILER", true);
  })();

/* --- site ambience: the service yard, the walkway clutter, the roadside -
   Any one of these is a box or two. Together they are what stops the lot
   reading as an empty plane with a building on it.                       */
(function ambience(){
  const CHAIN="#b4b9bc", RUSTC="#9c5232", GALV="#9aa1a6";
  // chain-link back fence around the property, with a wire-frame mesh panel
  bucketOf("chainlink", ()=>new T.MeshStandardMaterial({map:TEX.chain, transparent:true,
    alphaTest:0.30, side:T.DoubleSide, roughness:0.6, metalness:0.35}));
  function fence(x0,z0,x1,z1){
    const horiz=Math.abs(x1-x0)>Math.abs(z1-z0), len=horiz?(x1-x0):(z1-z0);
    const cx=(x0+x1)/2, cz=(z0+z1)/2;
    push("chainlink", planeGeo(len, 2.10, 2.2), cx, 1.05, cz, horiz?0:Math.PI/2, CHAIN);
    if(horiz){ bx("metal", len, 0.06, 0.06, cx, 2.12, cz, 0, 0, GALV);
               for(let x=x0;x<=x1;x+=3.0) cyl("metal", 0.05,0.05,2.30,8, x, 1.15, cz, GALV);
               addCol(x0,x1, cz-0.12, cz+0.12, 0, 2.2); }
    else     { bx("metal", 0.06, 0.06, len, cx, 2.12, cz, 0, 0, GALV);
               for(let z=z0;z<=z1;z+=3.0) cyl("metal", 0.05,0.05,2.30,8, cx, 1.15, z, GALV);
               addCol(cx-0.12, cx+0.12, z0,z1, 0, 2.2); }
  }
  fence(-50, 25.6, 38, 25.6);      // back of the property
  fence(38, -22, 38, 25.6);        // east side, beyond wing B
  fence(-50, -13, -50, 25.6);      // west side, beyond the office

  // service yard behind wing A
  bx("paint", 2.30,1.30,1.20, -20.0, 0.65, 23.4, 0.4, 0, "#3f5c46");        // dumpster
  bx("paint", 2.34,0.14,1.24, -20.0, 1.36, 23.4, 0, 0, "#4a6b52");
  bx("metal", 0.10,0.30,0.10, -21.0, 1.50, 23.4, 0, 0, GALV);
  addCol(-21.2,-18.8, 22.7, 24.1, 0, 1.5);
  cyl("metal", 0.55,0.55,2.60,14, 14.0, 1.30, 23.2, "#c8c4b4");             // propane tank
  cyl("metal", 0.62,0.62,0.14,14, 14.0, 2.68, 23.2, "#9aa1a6");
  addCol(13.4,14.6, 22.6, 23.8, 0, 2.7);
  for(let i=0;i<6;i++){                                                      // condensers on the back wall
    const cx=-24+i*9.5;
    bx("metal", 1.05,0.95,0.85, cx, 0.62, 21.6, 0.4, 0, GALV);
    // 21.165, not 21.19: at 21.19 the louvre's own back face landed exactly on
    // the condenser's front face at 21.175 and the two fought all down the wall
    for(let k=0;k<5;k++) bx("metal", 0.95,0.04,0.03, cx, 0.36+k*0.13, 21.165, 0, 0, "#5f676b");
    addCol(cx-0.6, cx+0.6, 21.1, 22.1, 0, 1.1);
  }
  cyl("metal", 0.30,0.30,0.22,12, -9.0, 0.90, 21.5, RUSTC, 0,0,Math.PI/2);  // hose reel
  cyl("metal", 0.05,0.05,1.30,8, -9.0, 0.65, 21.5, GALV);
  for(let i=0;i<4;i++) bx("oak", 1.15,0.11,0.95, 6.0, 0.06+i*0.13, 22.8, 0.6, 0, "#6a5236");
  addCol(5.3,6.7, 22.2, 23.4, 0, 0.7);
  for(let i=0;i<5;i++){                                                      // oil drums
    const dx=-14.5+i*1.0+(i%2)*0.25, dz=23.6+(i%2)*0.9;
    cyl("metal", 0.30,0.30,0.88,12, dx, 0.44, dz, ["#9c5232","#3f5c46","#7a6a4c"][i%3]);
    addCol(dx-0.34,dx+0.34, dz-0.34, dz+0.34, 0, 0.9);
  }
  for(let i=0;i<3;i++)                                                       // stacked old mattresses
    bx("spread", 1.95,0.24,1.42, 20.0, 0.13+i*0.26, 23.2, 0.4, 0, ["#8f5a4a","#5e7c6e","#8a7440"][i]);
  addCol(19.0,21.0, 22.4, 24.0, 0, 0.9);
  for(const q of [[-7.6,22.2],[0.4,22.2]]){                                  // two posts
    cyl("metal", 0.05,0.06,2.30,8, q[0], 1.15, q[1], GALV);
    addCol(q[0]-0.08,q[0]+0.08, q[1]-0.08,q[1]+0.08, 0, 2.3);
  }
  push("metal", boxGeo(8.0,0.014,0.014,0), -3.6, 2.22, 22.2, 0, GALV, 0, 0);  // and one line
  /* HUNG OFF THE LINE, NOT FLOATING UNDER IT. The sheets were centred at
     1.62 with a 0.90 drop, so every one of them ended 15 cm short of the
     wire it was supposedly pegged to — six rectangles hovering in a row.
     And there were two more posts here on top of the two above: a second
     2.60 one buried inside the west post, and a lone one at -0.6 that
     matched nothing, a metre in from the end of the line. Both gone. */
  for(let i=0;i<6;i++){
    const sx=-6.6+i*0.9;
    bx("fabric", 0.70,0.90,0.03, sx, 2.22-0.45, 22.2, 0, 0,
       ["#e6e2d6","#dfe6e4","#e8dcc0"][i%3]);
    for(const pg of [-0.28, 0.28])                                   // two pegs each
      cyl("paint", 0.010,0.010,0.07,6, sx+pg, 2.235, 22.2, "#9a6a42");
  }
  bx("paint", 1.60,1.10,0.10, 30.0, 0.60, 24.4, 0, 0, "#8a5a3a");            // leaning old sign
  bx("metal", 0.90,0.60,0.06, 32.4, 0.32, 23.6, 0, 0, "#7a6a5c");

  // walkway clutter along wing A
  const props=[[-24.4,"bench"],[-21.2,"urn"],[-15.4,"plant"],[-3.2,"chest"],
               [8.6,"plant"],[15.4,"bench"],[21.0,"urn"]];
  // Nothing may stand in a doorway lane. The bench at 15.4 was parked square
  // across 107's door — which is the one door left ajar, so you could see
  // into a room you could not walk into. Anything that lands on a lane now
  // gets pushed off the nearer end of it.
  const LANES=[];
  for(let i=0;i<NORTH.bays;i++){
    const c=NORTH.x0+i*BAY_W+BAY_W/2;
    LANES.push([c-2.55, c-1.20]);
  }
  const clearOf=(x,half)=>{
    for(const L of LANES) if(x+half>L[0] && x-half<L[1])
      return (x < (L[0]+L[1])/2) ? L[0]-half-0.15 : L[1]+half+0.15;
    return x;
  };
  for(const pr of props){
    const px=clearOf(pr[0], pr[1]==="bench" ? 0.92 : (pr[1]==="chest" ? 0.62 : 0.38));
    const pz=13.55, y=BASE;
    if(pr[1]==="bench"){
      bx("oak", 1.70,0.09,0.44, px, y+0.44, pz, 0.6, 0, "#5c4029");
      bx("oak", 1.70,0.36,0.09, px, y+0.66, pz+0.20, 0.6, 0, "#5c4029");
      for(const d of [-0.72,0.72]){ bx("metal", 0.09,0.44,0.40, px+d, y+0.22, pz, 0, 0, "#4b4f52"); }
      addCol(px-0.9,px+0.9, pz-0.3, pz+0.3, y, y+0.9);
    }else if(pr[1]==="urn"){
      cyl("metal", 0.17,0.20,0.72,12, px, y+0.36, pz, "#5b5f62");
      cyl("gravel", 0.15,0.15,0.06,12, px, y+0.74, pz, "#8a7a5e");
      addCol(px-0.22,px+0.22, pz-0.22, pz+0.22, y, y+0.8);
    }else if(pr[1]==="plant"){
      cyl("gravel", 0.30,0.23,0.42,12, px, y+0.21, pz, "#a35a34");
      push("foliage", new T.IcosahedronGeometry(0.40,1), px, y+0.68, pz, 0, "#4f6b3a");
      push("foliage", new T.IcosahedronGeometry(0.26,1), px+0.22, y+0.52, pz-0.10, 0, "#57713f");
      addCol(px-0.36,px+0.36, pz-0.36, pz+0.36, y, y+1.0);
    }else{
      bx("paint", 1.05,0.80,0.62, px, y+0.40, pz, 0, 0, "#b8332a");         // ice chest
      bx("paint", 1.09,0.10,0.66, px, y+0.85, pz, 0, 0, "#d8d4c8");
      addCol(px-0.6,px+0.6, pz-0.4, pz+0.4, y, y+0.95);
    }
  }

  /* --- the things nobody came back for ------------------------------- */
  // a luggage cart abandoned in the middle of the lot
  (function strayCart(){
    const lx=-11.4, lz=-15.6, ry=0.7;
    const at=(a,b2)=>[lx+a*Math.cos(ry)+b2*Math.sin(ry), lz-a*Math.sin(ry)+b2*Math.cos(ry)];
    const C2=(bk,w2,h2,d2,a,y2,b2,c)=>{ const q=at(a,b2);
      push(bk, boxGeo(w2,h2,d2,0.4), q[0], y2, q[1], ry, c); };
    C2("metal", 1.10,0.06,0.62, 0,0.28,0, "#b8bcbc");
    for(const c2 of [[-0.48,-0.24],[0.48,-0.24],[-0.48,0.24],[0.48,0.24]]){
      const q=at(c2[0],c2[1]);
      push("metal", new T.CylinderGeometry(0.08,0.08,0.05,10), q[0],0.09,q[1], ry, "#3a3a36", 0, Math.PI/2);
      C2("metal", 0.05,0.20,0.05, c2[0],0.18,c2[1], "#b8bcbc");
    }
    for(const c2 of [-0.48,0.48]) C2("metal", 0.05,1.42,0.05, c2,0.99,-0.26, "#b8bcbc");
    C2("metal", 1.06,0.05,0.05, 0,1.68,-0.26, "#b8bcbc");
    addCol(lx-0.62,lx+0.62, lz-0.48, lz+0.48, 0, 1.7);
  })();
  // a plastic chair someone carried out onto a balcony and left facing the lot
  bx("paint", 0.46,0.05,0.46, -8.6, BASE+FLOOR_H+0.44, 12.2, 0, 0.3, "#c8c4b4");
  bx("paint", 0.46,0.48,0.05, -8.6, BASE+FLOOR_H+0.68, 12.42, 0, 0.3, "#c8c4b4");
  for(const d2 of [[-0.18,-0.18],[0.18,-0.18],[-0.18,0.18],[0.18,0.18]])
    bx("paint", 0.04,0.44,0.04, -8.6+d2[0], BASE+FLOOR_H+0.22, 12.2+d2[1], 0, 0, "#b8b4a6");
  addCol(-8.9,-8.3, 11.9, 12.5, BASE+FLOOR_H, BASE+FLOOR_H+0.9);
  // a traffic cone and a coiled hose by the office
  push("paint", new T.CylinderGeometry(0.03,0.20,0.62,10), -30.6, 0.31, -12.4, 0, "#c85a24");
  bx("paint", 0.46,0.05,0.46, -30.6, 0.03, -12.4, 0, 0, "#c85a24");
  bx("paint", 0.30,0.05,0.30, -30.6, 0.36, -12.4, 0, 0, "#e6e2d6");
  for(let k=0;k<3;k++)
    push("foliage", new T.TorusGeometry(0.34-k*0.06,0.035,6,16), -47.6, 0.05+k*0.07, 0.9, 0, "#3f5c46", Math.PI/2, 0);
  // a single shoe on the pool deck
  bx("oak", 0.13,0.09,0.28, POOL.deck.x0+4.2, 0.15, POOL.deck.z0+0.9, 0, 0.5, "#3f2f22");

  // roadside: billboard, mailbox, newspaper boxes, a bus bench, a water tower
  (function billboard(){
    const bx0=62, bz=ROADZ-13, yaw=Math.PI;
    // the legs are deeper than the board, so they straddle it rather than
    // stopping on its faces
    // The legs stood at +/- 3.6 on a 10.4 m board, straight up through
    // GAS . FOOD . ICE. The board is painted on both faces, so there is no
    // back to hide a frame behind: the posts go outside its ends and it hangs
    // between them, the way the motel's own pole sign does.
    for(const d of [-5.55,5.55]){
      bx("metal", 0.36,9.00,0.44, bx0+d, 4.50, bz, 0, 0, "#6b6156");
      addCol(bx0+d-0.26, bx0+d+0.26, bz-0.30, bz+0.30, 0, 9.0); }
    for(const yy of [4.56, 8.64])                     // a rail over and under it
      bx("metal", 11.5,0.16,0.26, bx0, yy, bz, 0, 0, "#5f564d");
    // the board fills the frame: rail to rail (it was 6 cm short of both,
    // and 17 cm short of the posts, hanging in its frame on nothing)
    bx("paint", 10.74,3.92,0.34, bx0, 6.6, bz, 0, 0, "#e6e2d6");
    const tex=signTex(768,280,(x,W,H)=>{
      x.fillStyle="#d8cdae"; x.fillRect(0,0,W,H);
      x.fillStyle="#13405e"; x.fillRect(0,0,W,54);
      x.fillStyle="#f1ead6"; fitText(x,"NEXT SERVICES 74 MILES", W*0.9, 40, W/2, 28);
      x.fillStyle="#c3311f"; fitText(x,"GAS · FOOD · ICE", W*0.86, 88, W/2, 120);
      x.fillStyle="#3a3a36"; fitText(x,"KEEP LEFT AT THE JUNCTION", W*0.8, 44, W/2, 210);
    });
    NEON.push(signPanel(10.0,3.5,tex, bx0, 6.6, bz-0.23, Math.PI, true));
    NEON.push(signPanel(10.0,3.5,tex, bx0, 6.6, bz+0.23, 0, true));
    for(const d of [-2.6,2.6]){                       // two lamps, on the top rail
      bx("metal", 0.09,0.34,0.09, bx0+d, 8.86, bz, 0, 0, "#6b6156");
      push("metal", new T.CylinderGeometry(0.15,0.20,0.16,12), bx0+d, 9.06, bz-0.16,
           0, "#5f564d", 0.9, 0);
      push("ceilfix", new T.CylinderGeometry(0.135,0.135,0.02,12), bx0+d, 9.00, bz-0.24,
           0, "#e8e2cf", 0.9, 0);
    }
  })();
  bx("oak", 0.12,1.10,0.12, -47.0, 0.55, -42.6, 0, 0, "#5b4632");            // mailbox
  bx("metal", 0.26,0.26,0.46, -47.0, 1.24, -42.6, 0, 0, "#8f9aa0");
  for(let i=0;i<3;i++){                                                       // newspaper boxes
    bx("paint", 0.42,0.86,0.40, -41.5+i*0.52, 0.43, -42.4, 0, 0,
       ["#c3311f","#3f6ea8","#e0d24a"][i]);
    bx("metal", 0.10,0.34,0.06, -41.5+i*0.52, 0.72, -42.62, 0, 0, "#3a3a36");
  }
  addCol(-42.0,-40.2, -42.7,-42.1, 0, 0.9);
  bx("oak", 1.90,0.09,0.42, 30.0, 0.50, -43.0, 0.6, 0, "#5c4029");            // bus bench
  bx("oak", 1.90,0.40,0.09, 30.0, 0.72, -43.2, 0.6, 0, "#5c4029");
  for(const d of [-0.8,0.8]) bx("metal", 0.09,0.46,0.38, 30.0+d, 0.25, -43.0, 0, 0, "#4b4f52");
  addSeat(30.0, -42.9, 0.55, Math.PI, "THE BUS BENCH");        // watching the road
  addCol(29.0,31.0, -43.4,-42.7, 0, 0.95);
  /* --- the mast on the butte -------------------------------------------
     Five hundred and seventy metres north, on the tabletop of the nearer
     butte, and the only thing on this map you navigate by after dark. By
     day it is a scratch of lattice against the sky and you might not notice
     it at all; at night the obstruction light on the crown is the one thing
     burning anywhere off the property, and it is a beacon rather than a
     lamp — a flash every three seconds with two and a half of nothing in
     between, which is what makes it read across a kilometre of desert.
     Nothing at the foot of it has been switched on since the cabinets were
     stripped: the light runs off the solar panel on the hut roof. */
  (function mast(){
    const mx=250, mz=520, gy=Terrain.groundAt(mx,mz);
    const H=72, BAYS=16, SB=3.40, ST=1.50;        // base and top face widths
    const RC=s2=>s2/Math.sqrt(3);                 // circumradius of the triangle
    const LEGA=[Math.PI/2, Math.PI*7/6, Math.PI*11/6];
    const node=(i,k)=>{                           // leg k at bay level i
      const t=i/BAYS, r=RC(SB+(ST-SB)*t);
      return [mx+Math.cos(LEGA[k])*r, gy+t*H, mz+Math.sin(LEGA[k])*r];
    };
    // a cylinder's axis is +y, and with Euler "YXZ" and rz=0 the axis lands
    // on (sin ry sin rx, cos rx, cos ry sin rx) — so rx is the angle off
    // vertical and ry the compass bearing, which is all a strut needs
    const strut=(bk,a,b,r,col,seg)=>{
      const dx=b[0]-a[0], dy=b[1]-a[1], dz=b[2]-a[2], L=Math.hypot(dx,dy,dz);
      if(L<0.01) return;
      push(bk, new T.CylinderGeometry(r,r,L,seg||6), (a[0]+b[0])/2, (a[1]+b[1])/2,
           (a[2]+b[2])/2, Math.atan2(dx,dz), col, Math.acos(Math.max(-1,Math.min(1,dy/L))), 0);
    };
    const STEEL="#9aa1a6", STEELD="#7b8288";
    for(let i=0;i<BAYS;i++){
      for(let k=0;k<3;k++){
        const r=0.30-0.11*(i/BAYS);
        strut("metal", node(i,k), node(i+1,k), r, STEEL);       // the legs
        strut("metal", node(i,k), node(i,(k+1)%3), r*0.55, STEELD);
        // one diagonal per face per bay, alternating hand, which is what
        // makes a lattice read as a zigzag rather than as a ladder
        const a=node(i,k), b=node(i+1,(k+1)%3), c=node(i+1,k), d=node(i,(k+1)%3);
        strut("metal", (i%2)?a:d, (i%2)?b:c, r*0.42, STEELD);
      }
    }
    for(let k=0;k<3;k++) strut("metal", node(BAYS,k), node(BAYS,(k+1)%3), 0.12, STEELD);
    for(const lv of [0.36, 0.76]){                 // two sets of guys, three each
      const i=Math.round(lv*BAYS);
      for(let k=0;k<3;k++){
        const a=node(i,k), ang=LEGA[k];
        // on ITS OWN ground, not the mast's. Thirty-four metres out on a
        // tabletop with a metre and a half of noise in it, six anchor
        // blocks placed at the mast's own height hang in the air.
        const bg=Terrain.groundAt(mx+Math.cos(ang)*34, mz+Math.sin(ang)*34);
        const b=[mx+Math.cos(ang)*34, bg+0.6, mz+Math.sin(ang)*34];
        strut("metal", a, b, 0.055, "#6e757a", 4);
        if(lv<0.5){                                // the anchor block it lands on
          bx("concrete", 1.5,0.9,1.5, b[0], bg+0.30, b[2], 0.4, 0, "#8d8474");
          cyl("metal", 0.07,0.07,1.1,6, b[0], bg+1.0, b[2], STEELD, 0.3, 0, 0.2);
        }
      }
    }
    cyl("metal", 0.09,0.09,3.2,6, mx, gy+H+1.6, mz, STEEL);      // the lightning finial
    for(const l of [[0,1],[1,2],[2,0]])                          // and the crown frame
      strut("metal", node(BAYS,l[0]), [mx, gy+H+0.5, mz], 0.06, STEELD, 4);
    /* The two lamps. A sprite rather than geometry, because what has to
       carry over half a kilometre is a point of colour and not a shape, and
       with fog off it stays a hard red dot when the mast behind it has gone
       soft in the haze. The lower one runs at half the crown's brightness
       and on the same flash, the way a real pair does. */
    const lampTex=(()=>{
      const c=cvs(64,64), x=c.getContext("2d");
      /* A wide, soft falloff and a small hot core reads as a smudge at half
         a kilometre. The core has to hold most of the radius, and only the
         last third may fade, or the lamp is dimmer than the stars behind
         it — which is what the first cut of this looked like. */
      const g=x.createRadialGradient(32,32,0,32,32,32);
      g.addColorStop(0,"rgba(255,244,238,1)");    g.addColorStop(0.22,"rgba(255,138,98,1)");
      g.addColorStop(0.40,"rgba(240,54,28,0.92)"); g.addColorStop(0.64,"rgba(206,26,14,0.40)");
      g.addColorStop(1,"rgba(180,16,10,0)");
      x.fillStyle=g; x.fillRect(0,0,64,64);
      return setSRGB(new T.CanvasTexture(c));
    })();
    for(const L of [[H+0.9, 19.0, 1.00],[H*0.52, 11.0, 0.55]]){
      const mt=new T.SpriteMaterial({map:lampTex, transparent:true, opacity:0,
        depthWrite:false, fog:false, blending:T.AdditiveBlending});
      const sp=new T.Sprite(mt);
      sp.scale.set(L[1], L[1], 1); sp.position.set(mx, gy+L[0], mz);
      scene.add(sp);
      GLOW.push({m:mt, basic:true, max:L[2], blink:2.6, duty:0.20});
      cyl("metal", 0.13,0.13,0.26,8, mx, gy+L[0], mz, "#6b2018");   // the housing
    }
    // the hut at the foot of it, and the compound nobody has opened
    bx("concrete", 3.10, 2.45, 2.30, mx+5.2, gy+1.22, mz-1.4, 0.5, 0, "#a49b88");
    bx("concrete", 3.30, 0.16, 2.50, mx+5.2, gy+2.50, mz-1.4, 0.4, 0, "#8d8474");
    bx("paint", 0.06, 1.95, 0.86, mx+3.63, gy+0.98, mz-1.4, 0.4, 0, "#5b6b62");   // the door
    push("metal", boxGeo(1.30,0.05,0.90,0.4), mx+5.4, gy+2.66, mz-1.9, 0.5,
         "#2c3038", -0.42, 0);                                     // the solar panel
    for(const q of [-1,1])
      cyl("metal", 0.05,0.05,0.50,6, mx+5.4+q*0.55, gy+2.44, mz-1.6, STEELD);
    addCol(mx+3.6, mx+6.8, mz-2.6, mz-0.2, 0, 2.5);
    for(let k=0;k<3;k++) addCol(node(0,k)[0]-0.4, node(0,k)[0]+0.4,
                                node(0,k)[2]-0.4, node(0,k)[2]+0.4, 0, 3.0);
  })();

  /* --- the fire lookout on the mesa rim ---------------------------------
     Five hundred and thirty metres north-west and a hundred metres up, at
     the top of the fire road cut into the butte's flank in 04-terrain.js.
     It is the only place in this world you can stand above the motel and
     look down on the whole of it — the wings, the pool, the sign, the road
     going both ways — which is the entire reason it is here. Everything
     else about it follows from what a live-in lookout actually was: one
     glazed room on legs, a catwalk all the way round so you can walk to
     whichever side the smoke is on, a firefinder in the middle of the
     floor, and a bed, a stove and a radio round the edges of it.
     Nothing is powered. The radio has been off since the last season.  */
  (function firelookout(){
    const LK=Terrain.LOOK;
    const P=Terrain.trailPath(), TOP=P[P.length-1];
    const lx=-302, lz=374, gy=Terrain.groundAt(lx,lz);
    const FLR=5.40, CAB=4.40, HC=CAB/2, WALK=1.05, CHh=2.32;
    const TIM="#6f5a3e", TIMD="#54432e", GALV2="#9aa1a6", GALVD="#767d82";
    const F=gy+FLR;                                // the catwalk / cab floor
    const OUT=HC+WALK;

    /* the legs. Four of them, cross-braced on all four faces, standing on
       footings rather than on the dirt — a tower that meets the ground in
       four points is the one thing that makes a lookout read as built
       rather than dropped. */
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]]){
      const px=lx+a[0]*HC, pz=lz+a[1]*HC;
      const g2=Terrain.groundAt(px,pz);
      bx("concrete", 0.62,0.50,0.62, px, g2+0.10, pz, 0.4, 0, "#a49b88");
      bx("oak", 0.22, F-g2+0.3, 0.22, px, (g2+F)/2, pz, 0.5, 0, TIM);
    }
    for(let k=0;k<4;k++){                          // and the braces up each face
      const s2=[[-1,-1,1,-1],[1,-1,1,1],[1,1,-1,1],[-1,1,-1,-1]][k];
      const ax=lx+s2[0]*HC, az=lz+s2[1]*HC, bx2=lx+s2[2]*HC, bz=lz+s2[3]*HC;
      const g1=Terrain.groundAt(ax,az), g2=Terrain.groundAt(bx2,bz);
      for(let t=0;t<3;t++){                        // three bays, X-braced
        const y0b=Math.min(g1,g2)+0.5+t*((F-Math.min(g1,g2)-0.7)/3);
        const y1b=Math.min(g1,g2)+0.5+(t+1)*((F-Math.min(g1,g2)-0.7)/3);
        for(const dir of [0,1]){
          const A=[dir?ax:bx2, y0b, dir?az:bz], B=[dir?bx2:ax, y1b, dir?bz:az];
          const dxx=B[0]-A[0], dyy=B[1]-A[1], dzz=B[2]-A[2], L=Math.hypot(dxx,dyy,dzz);
          push("oak", new T.CylinderGeometry(0.055,0.055,L,5),
               (A[0]+B[0])/2, (A[1]+B[1])/2, (A[2]+B[2])/2, Math.atan2(dxx,dzz), TIMD,
               Math.acos(dyy/L), 0);
        }
        bx("oak", (k%2)?0.10:CAB+0.2, 0.10, (k%2)?CAB+0.2:0.10,
           (ax+bx2)/2, y1b, (az+bz)/2, 0.4, 0, TIM);
      }
      // only the legs collide, not the whole face. A collider per face walls
      // the space under the tower into a sealed box you cannot walk through
      for(const c2 of [[ax,az],[bx2,bz]])
        addCol(c2[0]-0.16, c2[0]+0.16, c2[1]-0.16, c2[1]+0.16, gy-1, F-0.3);
    }

    /* the deck and the catwalk round it. One plate, and the cab sits in the
       middle of it — the catwalk IS the floor, continued past the walls. */
    bx("oak", OUT*2, 0.16, OUT*2, lx, F-0.08, lz, 0.6, 0, TIM);
    for(let i=0;i<19;i++)                          // joists under it, seen from below
      bx("oak", OUT*2, 0.12, 0.09, lx, F-0.22, lz-OUT+i*(OUT*2/18), 0.4, 0, TIMD);
    addFlat(lx-OUT, lx+OUT, lz-OUT, lz+OUT, F);
    addZone(lx-OUT-0.4, lx+OUT+0.4, lz-OUT-0.4, lz+OUT+0.4, F-0.6, F+CHh+1.2,
            "THE FIRE LOOKOUT");
    // the pipe rail round the catwalk, with the gap where the stair lands
    for(let e=0;e<4;e++){
      const hx=(e%2)?0:1, sg=e<2?-1:1;
      for(const hgt of [0.46, 0.96]){
        if(hx){                                    // rails running in x
          if(sg<0){                                // the south side, split at the stair
            bx("metal", (OUT-0.75)*1.0, 0.045, 0.045, lx-OUT+(OUT-0.75)/2, F+hgt, lz+sg*OUT, 0.4, 0, GALV2);
            bx("metal", (OUT-0.75)*1.0, 0.045, 0.045, lx+OUT-(OUT-0.75)/2, F+hgt, lz+sg*OUT, 0.4, 0, GALV2);
          }else bx("metal", OUT*2, 0.045, 0.045, lx, F+hgt, lz+sg*OUT, 0.4, 0, GALV2);
        }else bx("metal", 0.045, 0.045, OUT*2, lx+sg*OUT, F+hgt, lz, 0.4, 0, GALV2);
      }
      for(let i=0;i<7;i++){                        // the stanchions
        const t=i/6;
        const px=hx ? lx-OUT+t*OUT*2 : lx+sg*OUT;
        const pz=hx ? lz+sg*OUT : lz-OUT+t*OUT*2;
        if(hx && sg<0 && Math.abs(px-lx)<0.80) continue;
        cyl("metal", 0.028,0.028,1.02,6, px, F+0.51, pz, GALVD);
      }
    }
    for(const sg of [-1,1]){                       // and a kick board, as there is a drop
      bx("oak", OUT*2, 0.14, 0.05, lx, F+0.09, lz+sg*OUT, 0.4, 0, TIMD);
      bx("oak", 0.05, 0.14, OUT*2, lx+sg*OUT, F+0.09, lz, 0.4, 0, TIMD);
    }
    /* The rail's collider has to have the same gap in it the rail does. The
       geometry was split either side of the stair head and the collider was
       not, so you climbed thirty-one treads and hit an invisible rail
       across the top of them. That — with the footing below — is why the
       stair could not be climbed. */
    addCol(lx-OUT-0.1, lx+OUT+0.1, lz+OUT-0.06, lz+OUT+0.1, F, F+1.05);
    addCol(lx-OUT-0.1, lx-0.78, lz-OUT-0.1, lz-OUT+0.06, F, F+1.05);
    addCol(lx+0.78,   lx+OUT+0.1, lz-OUT-0.1, lz-OUT+0.06, F, F+1.05);
    addCol(lx+OUT-0.06, lx+OUT+0.1, lz-OUT-0.1, lz+OUT+0.1, F, F+1.05);
    addCol(lx-OUT-0.1, lx-OUT+0.06, lz-OUT-0.1, lz+OUT+0.1, F, F+1.05);

    /* THE STAIR RUNS SOUTH, and which way it runs is not a free choice.
       The first cut of it ran north, because north is where the door is —
       and the ground north of this tower climbs 2.9 m in the 3.6 m the
       flight covers, so twelve of its treads were underground and the
       handrail came out of the hillside. A probe over the four sides says
       the tabletop falls away south and is dead level at about 95.4 from
       three metres out, which is the only side a flight can land on. It is
       also the side the fire road arrives from, so you come up the butte
       and the stair is facing you.

       The flight sizes itself: the drop from the deck to the ground it is
       actually landing on decides the number of treads, rather than a
       number picked in advance and hoped over. */
    const SW=1.24, GO=0.27;           // wide enough to walk up without hunting
    const gLand=Terrain.groundAt(lx, lz-OUT-5.6);
    const NT=Math.max(20, Math.round((F-gLand)/0.2261));
    const RIS=(F-gLand)/NT;
    /* tread i counts down from the deck, and tread 1 has to TOUCH the deck.
       It was set back 0.16 m and then stepped a further 0.27, which left a
       43 cm hole between the top of the flight and the catwalk — so you
       climbed thirty-one treads, walked off the end of the last one and
       fell seven metres to the dirt. Every plate overlaps its neighbour,
       and the top one overlaps the catwalk. */
    const tz=i=>lz-OUT-i*GO;                       // tread i, counting down from the deck
    for(let i=1;i<=NT;i++){
      const ty=F-i*RIS, pz=tz(i);
      bx("oak", SW, 0.075, GO+0.06, lx, ty-0.038, pz, 0.4, 0, TIM);
      addFlat(lx-SW/2, lx+SW/2, pz-GO/2-0.04,
              i===1 ? lz-OUT+0.06 : pz+GO/2+0.04, ty);   // the top one laps the deck
      if(i%4===0){                                 // posted down to the real ground
        for(const q of [-1,1]){
          const g3=Terrain.groundAt(lx+q*SW/2, pz);
          if(ty-g3<0.25) continue;
          cyl("oak", 0.065,0.075, ty-g3, 6, lx+q*SW/2, (g3+ty)/2, pz, TIMD);
        }
      }
    }
    for(const q of [-1,1]){                        // the stringers and the handrails
      const a=[lx+q*(SW/2+0.06), F-0.20, lz-OUT-0.10];
      const b2=[lx+q*(SW/2+0.06), F-NT*RIS-0.20, tz(NT)-0.10];
      const dyy=b2[1]-a[1], dzz=b2[2]-a[2], L=Math.hypot(dyy,dzz);
      push("oak", boxGeo(0.09, 0.30, L, 0.5), (a[0]+b2[0])/2, (a[1]+b2[1])/2,
           (a[2]+b2[2])/2, 0, TIMD, Math.atan2(dyy, -dzz), 0);
      /* A cylinder's axis is +y, and with Euler "YXZ", ry = 0 and rz = 0 it
         lands on (0, cos rx, sin rx) — so rx is atan2 of the run over the
         rise, and nothing else. The first cut had pi/2 minus the other
         atan2, which pointed both handrails off into the sky above the
         cab. */
      push("metal", new T.CylinderGeometry(0.028,0.028,L,6), a[0], (a[1]+b2[1])/2+1.02,
           (a[2]+b2[2])/2, 0, GALV2, Math.atan2(dzz, dyy), 0);
      for(let i=2;i<NT;i+=4)
        cyl("metal", 0.024,0.024,1.02,6, a[0], F-i*RIS+0.31, tz(i), GALVD);
    }
    /* and NOTHING across the foot of it. There was a footing collider here
       0.7 m tall and the full length of the flight, which is a wall at
       shin height over every tread on the bottom third of the stair. The
       treads are their own walkable plates; the stair needs no collider of
       its own at all. */

    /* the cab. Waist-high boarding, then glass the whole way round, which
       is what a lookout is for — you have to be able to see every bearing
       from the middle of the floor without standing up. */
    /* The cab, and a real hole in the side of it for the door. The first
       cut of this ran the boarding, the sill, the head, the glass and the
       mullions the full width of all four sides and then hung a door leaf
       on the south one — so the one door on the mesa opened onto a sheet of
       glass. clear36.js reported six things in the opening. `gapA`/`gapB`
       are the door's edges and every course on the south side is drawn in
       the two lengths either side of them. */
    const SILL=0.92, HEAD=1.98, DXC=lx-0.42, DWC=0.92;
    const gapA=DXC-DWC/2, gapB=DXC+DWC/2;
    bx("plank", CAB, 0.06, CAB, lx, F+0.03, lz, 1.1, 0, "#8a7c58");
    for(let e=0;e<4;e++){
      const hx=(e%2), sg=e<2?-1:1;
      const door=(hx && sg<0);                     // only the south side has one
      const W2=hx?CAB:0.10, D3=hx?0.10:CAB;
      const px=hx?lx:lx+sg*HC, pz=hx?lz+sg*HC:lz;
      const spans = door ? [[lx-CAB/2, gapA],[gapB, lx+CAB/2]] : [[null,null]];
      for(const sp of spans){
        const w3 = door ? sp[1]-sp[0] : W2, cx3 = door ? (sp[0]+sp[1])/2 : px;
        if(door && w3<0.05) continue;
        bx("plank", door?w3:W2, SILL, D3, cx3, F+SILL/2, pz, 0.9, 0, "#93805c");
        /* the sill's 10 cm overhang goes on the OUTER end of a split run
           only: put it on both and each half pokes 5 cm back into the
           doorway, which is the whole class of bug this door already had */
        const over = door ? 0.10 : 0.20, sh = door ? ((sp[0]===lx-CAB/2)?-1:1) : 0;
        bx("oak", (door?w3:W2)+over, 0.07, D3+0.10, cx3+sh*over/2, F+SILL+0.03, pz,
           0.5, 0, TIM);
        push("glass", boxGeo(hx?(door?w3:CAB)-0.10:0.04, HEAD-SILL-0.06, hx?0.04:CAB-0.10, 0),
             cx3, F+(SILL+HEAD)/2, pz, 0, "#8fa4a8");
      }
      bx("oak", W2+0.10, 0.10, D3+0.10, px, F+HEAD+0.05, pz, 0.5, 0, TIM);   // head, unbroken
      for(let i=1;i<4;i++){                        // three mullions a side
        const q=-CAB/2+i*CAB/4;
        if(door && lx+q>gapA-0.08 && lx+q<gapB+0.08) continue;
        bx("oak", hx?0.07:0.12, HEAD-SILL, hx?0.12:0.07, hx?lx+q:px, F+(SILL+HEAD)/2,
           hx?pz:lz+q, 0.4, 0, TIM);
      }
      if(door){                                    // and the jambs round the opening
        for(const q of [gapA, gapB])
          bx("oak", 0.08, HEAD, 0.14, q, F+HEAD/2, pz, 0.4, 0, TIM);
        addCol(lx-CAB/2, gapA, pz-0.09, pz+0.09, F, F+CHh);
        addCol(gapB, lx+CAB/2, pz-0.09, pz+0.09, F, F+CHh);
        addCol(gapA, gapB, pz-0.09, pz+0.09, F+HEAD, F+CHh);
      }else addCol(px-(hx?CAB/2:0.09), px+(hx?CAB/2:0.09),
                   pz-(hx?0.09:CAB/2), pz+(hx?0.09:CAB/2), F, F+CHh);
    }
    addFlat(lx-HC+0.1, lx+HC-0.1, lz-HC+0.1, lz+HC-0.1, F+0.06);
    addZone(lx-HC, lx+HC, lz-HC, lz+HC, F-0.3, F+CHh+0.3, "THE FIRE LOOKOUT", true);
    makeDoor(XF(gapA+0.02, lz-HC-0.02, 0), 0, F+0.06, 0, "THE FIRE LOOKOUT", true, 0.62);
    // the hip roof, its eaves, and the cupola over the middle of it
    for(let e=0;e<4;e++){
      const hx=(e%2), sg=e<2?-1:1;
      push("roofG", boxGeo(hx?CAB+1.9:1.35, 0.10, hx?1.35:CAB+1.9, 0.5),
           hx?lx:lx+sg*(HC+0.42), F+CHh+0.30, hx?lz+sg*(HC+0.42):lz,
           0, "#6b6f62", hx?sg*0.30:0, hx?0:-sg*0.30);
    }
    bx("oak", CAB+2.0, 0.09, CAB+2.0, lx, F+CHh+0.06, lz, 0.5, 0, TIM);
    /* The four hip panels are a ring: they rise inward to F+CHh+0.50 at
       1.97 m from the middle and stop. The middle was open — a four-metre
       pit in the roof with the ceiling deck at the bottom of it and the
       cupola standing a third of a metre over that on nothing. A flat lead
       closes it at the panels' inner edge, and the cupola sits on that. */
    push("roofG", boxGeo(4.02, 0.08, 4.02, 0.5), lx, F+CHh+0.50, lz, 0, "#6b6f62");
    bx("metal", 1.10, 0.36, 1.10, lx, F+CHh+0.72, lz, 0.5, 0, GALV2);          // the cupola
    push("roofG", boxGeo(1.40,0.08,1.40,0.5), lx, F+CHh+0.94, lz, 0, "#6b6f62");
    for(const q of [-1,1]) bx("metal", 1.12, 0.16, 0.03, lx, F+CHh+0.72, lz+q*0.56, 0.4, 0, GALVD);
    cyl("metal", 0.10,0.10,1.30,8, lx+1.32, F+CHh+0.80, lz+1.10, "#5f5348");   // the stove flue
    cyl("metal", 0.14,0.14,0.16,8, lx+1.32, F+CHh+1.50, lz+1.10, "#5f5348");
    cyl("metal", 0.020,0.020,2.10,6, lx-1.90, F+CHh+1.10, lz-1.70, GALVD);     // the aerial
    for(let i=0;i<3;i++)
      bx("metal", 0.62, 0.02, 0.02, lx-1.90, F+CHh+1.70+i*0.20, lz-1.70, 0.4, 0, GALVD);

    /* --- inside: the firefinder in the middle, and one person's season -- */
    // the Osborne firefinder, which is the whole job: a brass ring on a
    // pedestal in the dead centre of the floor with a sighting bar across it
    cyl("oak", 0.26,0.32,0.88,10, lx, F+0.50, lz, TIM);
    bx("oak", 0.78, 0.06, 0.78, lx, F+0.95, lz, 0.5, 0, "#7a6444");
    cyl("metal", 0.34,0.34,0.05,24, lx, F+1.00, lz, "#9a8248");
    cyl("paper", 0.30,0.30,0.012,24, lx, F+1.03, lz, "#d6cdb2");
    for(let i=0;i<24;i++)                          // the bearing ring
      bx("metal", 0.05, 0.014, 0.014, lx+Math.cos(i*Math.PI/12)*0.32, F+1.035,
         lz+Math.sin(i*Math.PI/12)*0.32, 0, i*Math.PI/12, "#6e6250");
    bx("metal", 0.74, 0.016, 0.030, lx, F+1.06, lz, 0.4, 0.42, "#b0a070");     // sighting bar
    for(const q of [-1,1])
      bx("metal", 0.03, 0.17, 0.02, lx+q*0.34*Math.cos(0.42), F+1.14,
         lz-q*0.34*Math.sin(0.42), 0.4, 0.42, "#b0a070");
    addCol(lx-0.38, lx+0.38, lz-0.38, lz+0.38, F, F+1.10);
    // the cot under the north window, made up, because he did make that
    bx("metal", 1.86, 0.06, 0.74, lx+0.30, F+0.44, lz+HC-0.52, 0.5, 0, GALVD);
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
      cyl("metal", 0.020,0.020,0.42,6, lx+0.30+a[0]*0.86, F+0.21, lz+HC-0.52+a[1]*0.30, GALVD);
    bx("bedding", 1.80, 0.16, 0.70, lx+0.30, F+0.54, lz+HC-0.52, 0.42, 0, "#cfc6ae");
    push("spread", boxGeo(1.80,0.10,0.72,0.42), lx+0.30, F+0.64, lz+HC-0.52, 0, "#6b5a44");
    { const g2=new T.SphereGeometry(0.26,10,7); g2.scale(0.80,0.30,1.00);
      push("bedding", g2, lx-0.42, F+0.66, lz+HC-0.52, 0.1, "#e8e2d2"); }
    addCol(lx-0.62, lx+1.22, lz+HC-0.88, lz+HC-0.16, F, F+0.62);
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])  // glass insulators under the legs
      push("glass", new T.CylinderGeometry(0.055,0.048,0.07,10), lx+0.30+a[0]*0.86,
           F+0.035, lz+HC-0.52+a[1]*0.30, 0, "#7fa89a");
    // the stove in the corner, and the wood beside it
    bx("metal", 0.52, 0.56, 0.42, lx+1.32, F+0.30, lz+1.10, 0.5, 0, "#4a443c");
    cyl("metal", 0.10,0.10,1.28,8, lx+1.32, F+1.22, lz+1.10, "#5f5348");
    bx("metal", 0.30, 0.22, 0.03, lx+1.32, F+0.30, lz+0.88, 0.4, 0, "#2f2b26");
    for(let i=0;i<7;i++)
      cyl("oak", 0.045,0.040,0.34,6, lx+1.38+((i%3)-1)*0.09, F+0.05+((i/3)|0)*0.09,
          lz+0.58+((i%2)?0.06:-0.05), "#6a5436", Math.PI/2, ((i*5)%4)*0.3, 0);
    addCol(lx+1.02, lx+1.58, lz+0.84, lz+1.36, F, F+0.60);
    /* The map table goes ALONG the west wall, not out from it. Standing off
       the wall it left a 48 cm slot between its end and the firefinder's
       pedestal, and a reach probe over the cab floor came back at 74%: a
       player is 84 cm across, so a third of the room — the whole north-west
       quarter, the cot end — was walled off behind a table. Turned through
       ninety degrees it is against the glass where a map table belongs and
       the floor is one room again. */
    const mtx=lx-HC+0.34, mtz=lz-0.30;
    bx("oak", 0.62, 0.05, 1.30, mtx, F+0.74, mtz, 0.6, 0, "#6f4a2c");
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
      cyl("oak", 0.030,0.030,0.72,6, mtx+a[0]*0.24, F+0.38, mtz+a[1]*0.58, TIMD);
    push("paper", planeGeo(0.52, 1.10, 0), mtx, F+0.772, mtz, 0.04, "#cfc6ae", -Math.PI/2, 0);
    push("art", planeGeo(0.34, 0.70, 0), mtx-0.02, F+0.774, mtz-0.06, 0.04,
         "#9aa07e", -Math.PI/2, 0);
    push("bin", boxGeo(0.32,0.03,0.24,0.5), mtx+0.02, F+0.79, mtz+0.44, 0.22, "#5a4a3a");
    cyl("plaster", 0.042,0.036,0.090,12, mtx+0.04, F+0.81, mtz-0.42, "#c6bda6");
    addCol(lx-HC+0.02, mtx+0.32, mtz-0.68, mtz+0.68, F, F+0.76);
    // the stool, the radio on its shelf, and the glasses on the sill
    cyl("oak", 0.17,0.17,0.05,12, lx-HC+1.02, F+0.50, lz-0.34, "#7a6444");
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
      cyl("metal", 0.016,0.016,0.48,6, lx-HC+1.02+a[0]*0.12, F+0.24, lz-0.34+a[1]*0.12, GALVD);
    /* The radio shelf goes on the EAST wall. It was on the south one, at
       1.34 over a door head at 1.98 — a shelf, a set and a clock hanging in
       the doorway. Nothing goes on the wall the door is in. */
    bx("oak", 0.26, 0.04, 0.72, lx+HC-0.16, F+1.34, lz-0.50, 0.5, 0, TIM);
    bx("paint", 0.20, 0.24, 0.44, lx+HC-0.18, F+1.48, lz-0.50, 0.5, 0, "#4e4a42");
    for(let i=0;i<4;i++)
      cyl("metal", 0.022,0.022,0.018,10, lx+HC-0.09, F+1.44, lz-0.66+i*0.11, "#b0a070",
          0, 0, Math.PI/2);
    push("clockface", new T.CylinderGeometry(0.05,0.05,0.012,14), lx+HC-0.08, F+1.50,
         lz-0.16, 0, "#cfc6ae", 0, Math.PI/2);
    for(const q of [0, 0.10])                      // the glasses, on the same shelf
      cyl("metal", 0.040,0.034,0.14,10, lx+HC-0.20, F+1.44, lz+0.02+q, "#3a3733",
          0, 0, Math.PI/2);
    // and the things a season leaves: a kettle, a lamp, boots, a jacket
    cyl("metal", 0.070,0.058,0.13,12, lx+1.32, F+0.64, lz+1.10, "#9aa1a6");
    cyl("metal", 0.05,0.06,0.03,10, mtx+0.16, F+0.775, mtz+0.52, "#b8a67e");
    cyl("glass", 0.055,0.048,0.16,12, mtx+0.16, F+0.86, mtz+0.52, "#c8bb8a");
    cyl("metal", 0.045,0.045,0.06,10, mtx+0.16, F+0.95, mtz+0.52, "#8e948e");
    for(const q of [-1,1])
      bx("fabric", 0.11, 0.13, 0.27, lx+HC-0.30+q*0.07, F+0.07, lz-HC+0.44, 0.5, 0, "#4e4438");
    for(let i=0;i<3;i++)
      cyl("metal", 0.008,0.008,0.05,5, lx+HC-0.06, F+1.70, lz-0.4+i*0.34, GALVD, 0,0,Math.PI/2);
    push("fabric", boxGeo(0.05,0.62,0.38,0.6), lx+HC-0.10, F+1.36, lz-0.06, 0, "#5e6a52");

    /* --- and what is round the foot of it -------------------------------- */
    /* EACH ON ITS OWN GROUND. These were all set off `gy`, the height under
       the middle of the tower, and this is a mesa top with a metre and a
       half of roll in it — so the butt sank, the woodpile sank and the
       weather screen stood a metre clear of the dirt on stilts. Anything
       outside the footprint of a building gets the ground at its own x,z. */
    const wbx=lx-OUT-0.9, wbz=lz+0.6, wbg=Terrain.groundAt(wbx,wbz);
    cyl("metal", 0.44,0.44,0.90,14, wbx, wbg+0.45, wbz, "#7d7466");             // water butt
    cyl("metal", 0.46,0.46,0.05,14, wbx, wbg+0.92, wbz, "#6b6357");
    addCol(wbx-0.5, wbx+0.5, wbz-0.5, wbz+0.5, wbg, wbg+0.95);
    for(let i=0;i<11;i++){                                                       // the woodpile
      const px=lx-OUT-0.4+((i%4))*0.12;
      cyl("oak", 0.055,0.050,0.80,6, px, Terrain.groundAt(px, lz-1.5)+0.06+((i/4)|0)*0.10,
          lz-1.5, "#6a5436", 0, Math.PI/2, 0);
    }
    // a Stevenson screen on legs, because a lookout also reported the weather
    const ssx=lx+OUT+1.5, ssz=lz-1.2, ssg=Terrain.groundAt(ssx,ssz);
    bx("paint", 0.52, 0.44, 0.44, ssx, ssg+1.24, ssz, 0.5, 0, "#e2ddcc");
    push("roofG", boxGeo(0.62,0.05,0.54,0.4), ssx, ssg+1.48, ssz, 0, "#cfc7b2");
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
      cyl("oak", 0.035,0.035,1.02,6, ssx+a[0]*0.20, ssg+0.51, ssz+a[1]*0.16, TIMD);
    addCol(ssx-0.3, ssx+0.3, ssz-0.3, ssz+0.3, ssg, ssg+1.5);
    // the outhouse, a decent distance off and downwind
    {
      const ox=lx+7.4, oz=lz+5.2, og=Terrain.groundAt(ox,oz);
      bx("plank", 1.10, 2.05, 1.20, ox, og+1.02, oz, 0.7, 0, "#8a7654");
      push("roofG", boxGeo(1.36,0.08,1.44,0.4), ox, og+2.12, oz, 0, "#6b6f62", -0.14);
      bx("plank", 0.06, 1.70, 0.62, ox-0.55, og+0.90, oz, 0.6, 0, "#7d6a4a");
      cyl("metal", 0.020,0.020,0.07,6, ox-0.60, og+1.00, oz+0.22, GALVD, 0,0,Math.PI/2);
      push("soot", planeGeo(0.16,0.22,0), ox-0.585, og+1.52, oz, -Math.PI/2, "#4a4338", 0, 0);
      addCol(ox-0.6, ox+0.6, oz-0.65, oz+0.65, og, og+2.1);
    }
    // the trailhead: a gate across the road at the toe, and a sign on it
    {
      const T0=P[0], T1=P[3];
      const ang=Math.atan2(T1.z-T0.z, T1.x-T0.x);
      const gx=T0.x, gz=T0.z, gg=Terrain.groundAt(gx,gz);
      for(const q of [-1,1])
        cyl("metal", 0.075,0.075,1.50,8, gx-Math.sin(ang)*q*3.4, gg+0.75,
            gz+Math.cos(ang)*q*3.4, GALVD);
      push("metal", boxGeo(6.8,0.10,0.10,0), gx, gg+1.02, gz, ang+Math.PI/2, "#b03a2a");
      push("metal", boxGeo(6.8,0.06,0.06,0), gx, gg+0.62, gz, ang+Math.PI/2, "#b03a2a");
      push("plank", boxGeo(1.30,0.62,0.05,0.6), gx+0.9, gg+1.46, gz, ang+Math.PI/2, "#b6a680");
      for(const q of [-1,1])
        cyl("oak", 0.05,0.05,1.70,6, gx+0.9-Math.sin(ang)*q*0.55, gg+0.85,
            gz+Math.cos(ang)*q*0.55, TIMD);
      addCol(gx-3.6, gx+3.6, gz-0.3, gz+0.3, 0, 1.2);
    }
    /* --- the running surface of the fire road ---------------------------
       The bench cut into the hillside reads as a set of terraces from a
       distance and as nothing at all from on it, because it is the same
       rock as the slope it is cut out of. A graded road is paler and
       flatter than the country it crosses — it is crushed and compacted —
       so the surface goes on as a strip of the pale bucket down the middle
       of the bench, with two ruts worn into it and the spoil pushed over
       the outside edge. That is what turns four shelves on a hillside into
       something you can see is a road. */
    for(let i=1;i<P.length;i++){
      const a=P[i-1], b2=P[i];
      const dxx=b2.x-a.x, dzz=b2.z-a.z, L=Math.hypot(dxx,dzz);
      if(L<0.2) continue;
      const mx2=(a.x+b2.x)/2, mz2=(a.z+b2.z)/2, my=(a.y+b2.y)/2;
      /* LAID ON THE GRADE, not flat. These were horizontal planes dropped on
         a bench that climbs at one in eight, so each one's far end was 36 cm
         off the ground — buried at one end, floating at the other — and the
         road came out as a chain of pale slabs with gaps between them, like
         runway lights up the hillside. They were too pale as well: a graded
         road in red country is a shade greyer and DARKER than what it is
         cut through, not brighter than the sunlit slope beside it.

         A plane's normal is +z and its length runs along its own +y here,
         so rx of -pi/2 lays it flat and anything past that is the grade;
         ry then swings it onto the bearing of the segment. */
      const dyy=b2.y-a.y, Ln=Math.hypot(L, dyy);
      const g3=Math.asin(dyy/Ln);
      const bear=Math.atan2(-dxx/L, -dzz/L);
      /* THE COLOUR OF THE HILL IT IS CUT THROUGH. At #6a5c45 on the pale
         sand bucket this came out a cold grey-brown lying across red rock,
         which reads as something poured rather than something graded. An
         old desert road is the mesa's own colour with the saturation
         knocked out of it by forty years of traffic and dust — same hue,
         a little paler, a lot flatter. */
      /* THE GRAVEL BUCKET, not the sand one. A vertex colour can only ever
         darken the texture under it, so a road drawn in a pale bucket can
         be made dark but never made RED — and in sand it came out a cream
         ribbon laid over red rock however far the colour was pulled down.
         TEX.gravel is built on #8a5f45, which is the mesa's own hue, so the
         road is now the hill with the saturation walked out of it. It also
         reads brighter than the slope either side whatever colour it is,
         because a graded bench faces straight up into the sun and a
         forty-degree flank does not — which is true of a real one. */
      /* ONE COURSE, AND THAT IS ALL IT NEEDS.
         This had five layers on it — the running surface, two ruts, a
         crown between them, drifted dust along both edges and a spoil
         mound every seventh segment — and from the valley floor, which is
         where you actually look at this hill, all of that stacks into a
         bright busy scribble climbing the flank. The butte is meant to be
         the view; the road is meant to be the thing you notice second.
         So: a single strip of the pale-on-red gravel bucket, one colour,
         one width, and nothing laid on top of it. Up close it still reads
         as graded ground, and from a mile off it reads as a line.
         The rule, for the next time: a surface that will be seen from a
         long way away gets ONE layer. Detail you cannot resolve at that
         distance does not disappear, it averages — into noise. */
      push("gravel", planeGeo(4.9, Ln*1.16, 1.6), mx2, my+0.05, mz2, bear,
           "#c9bca8", -Math.PI/2+g3, 0);
      if(i%19===0){                                // and a marker post on the outside
        const ox2=(mx2-LK.x), oz2=(mz2-LK.z), on=Math.hypot(ox2,oz2)||1;
        const px2=mx2+ox2/on*2.6, pz2=mz2+oz2/on*2.6;
        cyl("oak", 0.055,0.055,1.05,5, px2, my+0.42, pz2, "#7a6a4a", 0.06, 0, 0.05);
        bx("paint", 0.10, 0.14, 0.10, px2, my+0.92, pz2, 0.4, 0, "#c8c0a8");
      }
    }
    // cairns at the hairpins, which is where you look for the next leg
    for(let i=1;i<5;i++){
      const q=P[i*30];
      if(!q) continue;
      const cg=Terrain.groundAt(q.x+2.6, q.z+2.6);
      for(let k=0;k<4;k++)
        push("rock", rockGeo(0.24-k*0.04, i*7+k), q.x+2.6, cg+0.12+k*0.17, q.z+2.6,
             k*1.2, k%2?"#8a7a62":"#7d6e57", 0, 0);
    }
  })();

  (function watertower(){
    const wx=-168, wz=88, gy=Terrain.groundAt(wx,wz);
    for(const l of [[-2.6,-2.6],[2.6,-2.6],[-2.6,2.6],[2.6,2.6]])
      cyl("metal", 0.20,0.26,17,8, wx+l[0], gy+8.5, wz+l[1], GALV);
    for(const yy of [5,10,14]){
      bx("metal", 5.4,0.16,0.16, wx, gy+yy, wz-2.6, 0, 0, GALV);
      bx("metal", 5.4,0.16,0.16, wx, gy+yy, wz+2.6, 0, 0, GALV);
      bx("metal", 0.16,0.16,5.4, wx-2.6, gy+yy, wz, 0, 0, GALV);
      bx("metal", 0.16,0.16,5.4, wx+2.6, gy+yy, wz, 0, 0, GALV);
    }
    cyl("metal", 3.6,3.6,5.2,18, wx, gy+19.6, wz, "#b6b1a4");
    push("roofG", new T.CylinderGeometry(0.06,3.9,2.2,18), wx, gy+23.3, wz, 0, "#8a3a2a");
  })();
})();
