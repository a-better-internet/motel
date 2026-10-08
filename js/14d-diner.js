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
   glazed checkerboard skirt round the bottom.

   It stands on the NORTH shoulder with its entrance square to the highway,
   because that is the only side a diner ever faces and the only side the
   drive can come in from. Everything is built in the car's own frame — x
   along its length, z across it, -z toward the road.

   Nothing in here is lit. There is no power to it, there has not been for
   forty years, and the one thing that would give that away is a warm pool of
   light under a pendant. So the fittings are all still hanging and every one
   of them is dead: by day it is lit through the window band and the door
   somebody left open, and at night it is as dark as the desert and you go in
   with the torch or not at all.
   ---------------------------------------------------------------------- */
(function dinerCar(){
  const D=Terrain.DINER;
  const m=mk(D.x, D.z);
  const WY=y=>y-m.y;                          // a world height, in local terms

  /* ---- the car's dimensions --------------------------------------------
     Wider than the first cut of this, because the cross section has to carry
     a back bar, a working aisle, the counter, a row of stools, a walking
     aisle and a booth — six things — and at 4.6 m inside two of them had to
     give up 20 cm each and the aisle came out the width of one shoulder. */
  const L=15.2, W=5.10, HL=L/2, HW=W/2;
  const FY=0.62;                              // floor, above the apron
  const SK=0.86;                              // top of the tile skirt
  const GY0=1.34, GY1=2.40;                   // the window band
  const CH=2.96;                              // top of the wall, under the cornice
  const CT=3.26;                              // top of the cornice band
  const RR=2.34;                              // the barrel roof's radius
  const CR=0.80;                              // corner radius
  const WT=0.14;                              // how thick the shell reads
  const STL="#a8ada6", STLD="#8f958f", CRM="#b6b0a0", RUSTD="#7a4526";
  const DARKM="#4e5450";
  const CHR="#b2b8b1", CHRD="#8b918b", CHRX="#6e746f";        // chrome, dulled
  const VIN="#8e3a32", VIND="#6e2c26", VINX="#57231f";        // red vinyl
  const FOAM="#a89c80", LAM="#c9c2ae", LAMD="#b6b0a0";        // foam, laminate
  /* The linings are painted panel, in the roomwall bucket. They were in the
     plank bucket, whose texture is brown boards: tinting that sage gives you
     a muddy brown board, and the inside of the car read as a log cabin. */
  const WOOD="#93a089";      // the painted wainscot under the windows, sage
  const BULK="#a59d89";      // and the kitchen bulkhead, a shade warmer

  const DOORW=1.24, DX=5.50;                  // the entry, up at the east end
  const DOX0=DX-DOORW/2, DOX1=DX+DOORW/2, DOTOP=FY+2.06;

  let sd=7717; const r2=()=>{ sd=(sd*1103515245+12345)%2147483648; return sd/2147483648; };

  /* Rolls and bullnoses. Everything in a diner is a box with its arris taken
     off — the counter nose, the seat fronts, the cap rails, the table edges —
     and it is most of what separates one from a row of crates. */
  const rollX=(bk,r,len,x,y,z,c)=>m.C(bk,r,r,len,10, x,y,z, c, 0,0,Math.PI/2);
  const rollZ=(bk,r,len,x,y,z,c)=>m.C(bk,r,r,len,10, x,y,z, c, Math.PI/2,0,0);
  const ball =(bk,r,x,y,z,c)=>m.P(bk, new T.SphereGeometry(r,9,7), x,y,z, 0, c);
  const bullnose=(bk,w,d,cx,cy,cz,r,col)=>{
    rollX(bk,r,w, cx,cy,cz-d/2,col);  rollX(bk,r,w, cx,cy,cz+d/2,col);
    rollZ(bk,r,d, cx-w/2,cy,cz,col);  rollZ(bk,r,d, cx+w/2,cy,cz,col);
    for(const c of [[-1,-1],[1,-1],[-1,1],[1,1]])
      ball(bk,r, cx+c[0]*w/2, cy, cz+c[1]*d/2, col);
  };
  // a strip tilted about the x axis, for the barrel roof and the barrel
  // ceiling under it. m.B takes ten arguments and stops, so anything that
  // leans has to be pushed as geometry.
  const tilt=(bk,len,th,z0,y0,z1,y1,col,uv,xc)=>{
    const dz=z1-z0, dy=y1-y0, w=Math.hypot(dz,dy);
    m.P(bk, boxGeo(len, th, w, uv===undefined?0.5:uv), xc||0, (y0+y1)/2, (z0+z1)/2,
        0, col, Math.atan2(-dy, dz), 0);
  };

  /* ---- the shell --------------------------------------------------------
     A diner car has no square corners: the walls turn through a quarter
     circle at each end. The courses are stacked the same way all the way up
     — skirt, wall, window band, wall, cornice — so the silhouette stays one
     shape from the ground to the roof.

     Every course is a RING and not a slab. A slab reads correctly from the
     apron and is a disaster from inside: the underside of the course above
     the windows becomes the ceiling of the room, two and a half metres of
     barrel roof disappear behind it, and the course at eye level is not
     there at all, so the back wall of the diner is open desert. */
  const runZ=ix=>HW-ix-WT/2, runX=ix=>HL-ix-WT/2;
  const face=(bk,x0,x1,y0,y1,sz,ix,col,uv)=>
    m.B(bk, x1-x0, y1-y0, WT, (x0+x1)/2, (y0+y1)/2, sz*runZ(ix),
        uv===undefined?0.5:uv, 0, col);
  const endf=(bk,z0,z1,y0,y1,sx,ix,col,uv)=>
    m.B(bk, WT, y1-y0, z1-z0, sx*runX(ix), (y0+y1)/2, (z0+z1)/2,
        uv===undefined?0.5:uv, 0, col);
  // the quarter turn at each corner, as a short run of boxes round the arc
  const corners=(bk,y0,y1,col,ix,uv)=>{
    const h=y1-y0, cy=(y0+y1)/2, R=CR-ix-WT/2, N=5, seg=(Math.PI/2)/N;
    const aw=2*R*Math.tan(seg/2)+0.02;
    for(const sx of [-1,1]) for(const sz of [-1,1]){
      const ox2=sx*(HL-CR), oz2=sz*(HW-CR);
      for(let k=0;k<N;k++){
        const a=(k+0.5)*seg;
        // the box's long axis has to lie along the tangent, and which way
        // round that is depends on the quadrant
        const ry = sx>0 ? (sz>0 ? -(a+Math.PI/2) : (a+Math.PI/2))
                        : (sz>0 ?  (a-Math.PI/2) : (Math.PI/2-a));
        m.P(bk, boxGeo(aw, h, WT, uv===undefined?0.5:uv),
            ox2+sx*Math.cos(a)*R, cy, oz2+sz*Math.sin(a)*R, ry, col, 0, 0);
      }
    }
  };
  /* `gap` leaves the doorway out of the road-side run. Every course was laid
     as one continuous band down each face, so the skirt, its capping and the
     stainless below the glass all ran STRAIGHT ACROSS THE FRONT DOOR — three
     quarters of a metre of wall standing in the opening from the floor up.
     Nothing there has a collider, so the door probe walked the lane happily
     and reported it clear; you simply could not see in, and from the apron
     the entrance read as bricked up. Anything whose course is below the door
     head has to be told about the hole. */
  /* `gap` is either true — split this whole course round the door — or the
     height of the door head, in which case only the part BELOW it splits
     and the part above runs across. One band from GY1 to CH rather than two
     stacked ones, because two bands draw two sets of corner arcs and two
     sets of end faces, and the pairs land on each other's planes. */
  const band=(bk,y0,y1,col,ix,uv,gap)=>{
    const top = (typeof gap==="number" && gap>y0 && gap<y1) ? gap : null;
    for(const sz of [-1,1]){
      if(sz<0 && gap){
        const yg = top===null ? y1 : top;
        face(bk, -HL+CR, DOX0, y0,yg, sz, ix||0, col, uv);
        face(bk, DOX1,  HL-CR, y0,yg, sz, ix||0, col, uv);
        if(top!==null) face(bk, -HL+CR, HL-CR, top,y1, sz, ix||0, col, uv);
      }else face(bk, -HL+CR, HL-CR, y0,y1, sz, ix||0, col, uv);
    }
    for(const sx of [-1,1]) endf(bk, -HW+CR, HW-CR, y0,y1, sx, ix||0, col, uv);
    corners(bk, y0,y1, col, ix||0, uv);
  };

  /* ---- the apron it was dropped on, and the drive in off the highway ----
     A gravel lot with a slab of cracked concrete under the car, not a
     hardstanding: forty years of nobody sweeping turns concrete back into
     ground. The drive rides over the walk and the painted kerb on blown
     dirt, which is what happens to a kerb nobody ever dropped. */
  {
    const cap=new T.CircleGeometry(D.r, 44), uv=cap.attributes.uv;
    for(let i=0;i<uv.count;i++) uv.setXY(i, uv.getX(i)*D.r, uv.getY(i)*D.r);
    // NOT the gravel bucket: its texture is based on #8a5f45, and a vertex
    // colour can only ever darken it, so anything drawn in it comes out the
    // red-brown of a xeriscape bed — which beside pale desert and grey
    // asphalt reads as a carpet
    m.P("concrete", cap, 0, 0.03, 0, 0, "#6f6552", -Math.PI/2, 0);
    m.flat(-D.r, D.r, -D.r, D.r, 0.03);
    /* A lot does not end on a drawn arc. Overlapping discs round the rim,
       sitting just under the main one so they only show where they run past
       it, break the circle into something the desert has been taking back. */
    for(let i=0;i<20;i++){
      const a=(i/20)*6.283+r2()*0.22, rr=D.r-1.2+r2()*3.4, sc=2.2+r2()*3.4;
      const fr=new T.CircleGeometry(sc, 11), fu=fr.attributes.uv;
      for(let k=0;k<fu.count;k++) fu.setXY(k, fu.getX(k)*sc, fu.getY(k)*sc);
      /* 2 mm a rung, six rungs, all under the cap. At 0.3 mm a step the rim
         discs and the cap above them were separated by less than the depth
         buffer can resolve beyond about twenty-five metres, and the whole
         forecourt shimmered as you came up the road. Neighbours round the
         rim are never on the same rung. */
      m.P("concrete", fr, Math.cos(a)*rr, 0.018+(i%6)*0.002, Math.sin(a)*rr, a,
          (i%3===0)?"#7a7060":((i%3===1)?"#6b6252":"#746b5b"), -Math.PI/2, 0);
    }
    /* And the desert taking the gravel back. The lot read as one clean pale
       disc twenty-six metres across with a building in the middle of it,
       which is a car park somebody still sweeps. Sand lies over it in
       tongues now, heaviest at the rim where nothing has driven for forty
       years and thinning towards the middle where they did. They sit between
       the gravel cap and the concrete slab, so the slab still reads as the
       harder thing under them — and they are the colour of the ground they
       blew off. The first cut of them was a pale grey-tan over TEX.sand,
       which is already a bright texture and a vertex colour can only darken
       it, so what came out was eight-metre tongues of near-white lying
       across the lot like spilled cement. The desert out here is a warm
       red-brown; so is what it drops. (The bucket had no grain at all until
       round 46, which is why these were flat yellow ellipses; they are the
       terrain's floor and dune colours on the terrain's grain now.) */
    for(let i=0;i<20;i++){
      const a=(i/20)*6.283+r2()*0.30, rr=4.2+Math.pow(r2(),0.7)*(D.r+1.2);
      // twenty segments, not twelve: at four metres across a twelve-sided
      // disc is a visible dodecagon lying on the ground
      const sc=0.8+r2()*1.9, g=new T.CircleGeometry(1, 20), u=g.attributes.uv;
      for(let k=0;k<u.count;k++) u.setXY(k, u.getX(k)*sc*2, u.getY(k)*sc*2);
      g.scale(sc*1.5, sc*(0.7+r2()*0.5), 1);
      // 1.5 mm a rung (it was 0.06 mm — a twentieth of what reads at ten metres)
      m.P("sand", g, Math.cos(a)*rr, 0.032+(i%7)*0.0015, Math.sin(a)*rr, a+r2(),
          ["#b99165","#a47a4e","#b08a60"][i%3], -Math.PI/2, 0);
    }
    /* Everything scattered on the slab shares one counter and one step, so
       the order it is written in is the order it stacks — and the step has
       to be small enough that three hundred of them do not end up as a deck
       of cards five centimetres off the ground. */
    /* EACH DECAL ONE RUNG ABOVE THE HIGHEST ONE IT TOUCHES. The step used
       to be 0.14 mm for every one of three hundred, in a single climbing
       stack: small enough not to make a deck of cards, and also small enough
       that beyond about twenty metres the depth buffer could not tell the
       layers apart and the whole forecourt shimmered. A rung is 0.6 mm now,
       which holds to forty-five metres — but three hundred of those would be
       eighteen centimetres. So a decal only climbs above the ones it actually
       overlaps (bounding circles, which is generous), and anything with
       nothing under it goes on rung 0. Later still sits on top of anything
       earlier that it touches, which was the point of the old ladder. */
    const placed=[];
    const LY=(x,z,r)=>{
      let k=0;
      for(const q of placed)
        if((q[0]-x)*(q[0]-x)+(q[1]-z)*(q[1]-z) < (q[2]+r)*(q[2]+r)) k=Math.max(k, q[3]+1);
      k=Math.min(k, 59);
      placed.push([x,z,r,k]);
      return 0.046+k*0.0006;
    };
    const dec=(bk,w,h,x,z,ry,c)=>m.P(bk, planeGeo(w,h,0.5), x, LY(x,z,Math.hypot(w,h)/2), z,
                                     ry, c, -Math.PI/2, 0);
    /* A stain is not a rectangle. Every blotch on this slab was a rotated
       quad, so from standing height the apron read as a heap of dark cards
       dropped on a white floor — the hardest edge in the whole lot was a
       patch of weathering. A disc with its uv scaled to world size takes the
       concrete texture the same way and has no corner to catch the eye. */
    const blot=(bk,rx,rz,x,z,ry,c)=>{
      const g=new T.CircleGeometry(1, 13), u=g.attributes.uv;
      for(let k=0;k<u.count;k++) u.setXY(k, u.getX(k)*rx*2, u.getY(k)*rz*2);
      g.scale(rx, rz, 1);
      m.P(bk, g, x, LY(x,z,Math.max(rx,rz)), z, ry, c, -Math.PI/2, 0);
    };
    /* The concrete apron, only as far as the cars ever parked — and aged
       properly. Scattered rectangles in two greys read as a clean slab with
       some dirt on it; what ages concrete is the crack pattern, and a crack
       is a line that wanders and forks, not a box. */
    m.P("concrete", planeGeo(19.0, 10.4, 0.9), 0, 0.044, -1.6, 0, "#67624f", -Math.PI/2, 0);
    /* And the slab does not end on a drawn rectangle any more than the lot
       ends on a drawn arc. Discs of the same grey lapped over the edge, and
       drifts of the lot's colour lapped back in, so the boundary is a line
       the sand has been working at rather than a ruler's edge. */
    for(let i=0;i<16;i++){
      const t=i/16, ed=i%2;
      const ex=ed? (t<0.5?-9.5:9.5) : -9.5+((t*2)%1)*19.0;
      const ez=ed? -6.8+((t*2)%1)*10.4 : (t<0.5?-6.8:3.6);
      blot("concrete", 0.7+r2()*1.5, 0.6+r2()*1.2, ex+(r2()-0.5)*1.2,
           ez+(r2()-0.5)*1.2, r2()*6.283, r2()<0.5?"#67624f":"#6f6957");
    }
    for(let i=0;i<14;i++){
      const a=(i/14)*6.283, rr=5.4+r2()*4.6;
      blot("concrete", 0.5+r2()*1.3, 0.4+r2()*1.0, Math.cos(a)*rr*1.7,
           -1.6+Math.sin(a)*rr, r2()*6.283, r2()<0.5?"#6b6252":"#746b5b");
    }
    // a plane laid flat has its width along (cos ry, -sin ry), so a segment
    // running (dx,dz) wants ry = atan2(-dz, dx)
    const seg=(x0,z0,x1,z1,w,col)=>{
      const dx2=x1-x0, dz2=z1-z0, ln=Math.hypot(dx2,dz2);
      if(ln<0.02) return;
      m.P("concrete", planeGeo(ln*1.08, w, 0.5), (x0+x1)/2, LY((x0+x1)/2,(z0+z1)/2,ln*0.54+w),
          (z0+z1)/2, Math.atan2(-dz2, dx2), col, -Math.PI/2, 0);
    };
    const crack=(x0,z0,a0,steps,w,col,depth)=>{
      let px=x0, pz=z0, a=a0;
      for(let i=0;i<steps;i++){
        const sl=0.35+r2()*0.75;
        a += (r2()-0.5)*0.85;
        const nx=px+Math.cos(a)*sl, nz=pz+Math.sin(a)*sl;
        if(Math.abs(nx)>9.4 || nz<-6.9 || nz>3.5) break;
        seg(px,pz,nx,nz, w*(1-i/steps*0.45), col);
        if(depth>0 && r2()<0.34)                 // and it forks
          crack(nx, nz, a+(r2()<0.5?0.9:-0.9), 2+((r2()*3)|0), w*0.6, col, depth-1);
        px=nx; pz=nz;
      }
    };
    for(let i=0;i<5;i++){                        // tar patches over the worst of it
      // these ARE poured as a shape with an edge, so they keep theirs — but
      // a ragged one, three overlapping lobes rather than one rectangle
      const px=-8+r2()*16, pz=-6+r2()*8.6, pw=0.7+r2()*1.5, pd=0.55+r2()*1.1;
      for(let k=0;k<2;k++)
        blot("asphalt", pw*(0.7+r2()*0.5), pd*(0.7+r2()*0.5),
             px+(r2()-0.5)*pw*0.9, pz+(r2()-0.5)*pd*0.9, r2()*6.283,
             k?"#6f6a5d":"#78736a");
    }
    /* NOT the gravel bucket, for the reason written at the top of this block:
       its texture is built on #8a5f45 and a vertex colour can only darken it,
       so two dozen spalled patches came out as orange-red tiles scattered
       over grey concrete. Broken concrete shows paler aggregate, not rust. */
    for(let i=0;i<14;i++)
      blot("concrete", 0.30+r2()*0.60, 0.24+r2()*0.48, -8.6+r2()*17.2, -6.4+r2()*9.4,
           r2()*6.283, r2()<0.5?"#8e8672":"#847c68");
    /* Weathering goes on in three passes of falling size and rising contrast,
       every one of them a soft disc: broad pale bloom first, then the damp
       that sits in the low spots, then fine speckle. Sixteen big dark
       rectangles is what it was, and that is a tarpaulin, not a stain. */
    for(let i=0;i<10;i++)
      blot("concrete", 1.6+r2()*2.6, 1.1+r2()*1.8, -8+r2()*16, -6.2+r2()*9.0,
           r2()*6.283, r2()<0.5?"#857c6b":"#8e8676");
    for(let i=0;i<12;i++)
      blot("concrete", 0.55+r2()*1.35, 0.40+r2()*1.00, -8.4+r2()*16.8,
           -6.4+r2()*9.4, r2()*6.283, r2()<0.5?"#6e6757":"#7a7363");
    for(let i=0;i<26;i++)
      blot("concrete", 0.07+r2()*0.20, 0.06+r2()*0.16, -9.0+r2()*18.0,
           -6.7+r2()*9.9, r2()*6.283, r2()<0.5?"#5f5849":"#6b6454");
    /* And the joints and the cracks go on LAST, over the weathering rather
       than under it. They were laid first and then three passes of blotches
       were drawn on top of them, which left an apron of soft grey clouds
       with no crack pattern in it at all — and the crack pattern is the
       whole point: what ages concrete is a line that wanders and forks, not
       a stain. */
    for(let i=0;i<8;i++)                         // the slab joints, wandering
      for(let k=0;k<6;k++)
        seg(-8.8+i*2.2+(r2()-0.5)*0.1, -6.8+k*1.5, -8.8+i*2.2+(r2()-0.5)*0.1,
            -6.8+(k+1)*1.5, 0.055, "#544d3d");
    for(let i=0;i<4;i++)
      for(let k=0;k<8;k++)
        seg(-9.4+k*2.1, -6.2+i*2.1+(r2()-0.5)*0.08, -9.4+(k+1)*2.1,
            -6.2+i*2.1+(r2()-0.5)*0.08, 0.05, "#544d3d");
    for(let i=0;i<8;i++)                         // and the cracks across them
      crack(-8.4+r2()*16.8, -6.4+r2()*9.4, r2()*6.283, 5+((r2()*5)|0),
            0.075+r2()*0.05, r2()<0.5?"#4a4334":"#413b2e", 2);
    /* Four stall lines, nearly gone — and "nearly gone" has to survive the
       paint bucket, which is a bright texture a vertex colour can only pull
       down. At #918872 they came out as fresh white lines on an abandoned
       lot. Each one is broken into short lengths with gaps, and the lengths
       are different shades, because that is how a painted line wears. */
    for(let i=0;i<4;i++){
      const lx=-6.0+i*2.9;
      for(let k=0;k<9;k++){
        if(r2()<0.30) continue;                  // and here it has gone entirely
        dec("paint", 0.075+r2()*0.02, 0.30+r2()*0.22, lx+(r2()-0.5)*0.05,
            -6.9+k*0.54, 0, r2()<0.5?"#565044":"#665f50");
      }
    }
    for(let i=0;i<5;i++){                        // oil where each of them stood
      const ox2=-6.0+i*2.9+1.45, oz=-5.4+r2()*1.2;
      for(let k=0;k<3;k++)                       // the pool, soaked in and spread
        blot("concrete", 0.24+r2()*0.26, 0.32+r2()*0.30, ox2+(r2()-0.5)*0.5,
             oz+(r2()-0.5)*0.6, r2()*6.28, k?"#5a5245":"#4c443a");
      for(let k=0;k<4;k++)                       // and the drips round it
        blot("concrete", 0.04+r2()*0.05, 0.05+r2()*0.06, ox2+(r2()-0.5)*1.1,
             -5.6+r2()*1.6, r2()*6.28, "#453e34");
    }
    for(let i=0;i<10;i++){                       // and the tracks coming off the drive
      const t=i/10, tz=-11.6+t*7.4;
      for(const sd2 of [-1,1])
        blot("concrete", 0.16, 0.62, sd2*(1.3+t*2.2), tz, sd2*t*0.22, "#6a6152");
    }
    for(let i=0;i<22;i++){                      // weeds through the cracks
      const ax=-11+r2()*22, az=-9+r2()*15;
      if(Math.hypot(ax, az)>D.r-1) continue;
      for(let k=0;k<5;k++)
        m.C("foliage", 0.009,0.015,0.16+r2()*0.26,4, ax+(r2()-0.5)*0.34, 0.12,
            az+(r2()-0.5)*0.34, r2()<0.5?"#7d7448":"#6d7048",
            (r2()-0.5)*0.5, k*1.3, (r2()-0.5)*0.4);
    }
    /* The drive. Heights are taken in WORLD terms and handed back through WY,
       because the corridor the highway runs in is graded to one level and the
       pad to another: measuring this in local offsets put the crossing a
       hand's width UNDER the pavement it was supposed to ride over.

       WP is the SURFACE, and tilt() centres its box on the line it is given,
       so the line goes in half a thickness low. Handing tilt the surface
       directly buries everything scattered on top of the drive inside it,
       which is why the first one was eight metres of blank concrete. */
    const WP=[[-12.6,0.06],[-15.4,0.14],[-17.2,0.30],[-17.9,0.40],[-19.0,0.40],
              [-20.0,0.28],[-20.7,0.11],[-21.7,0.01]];
    const TH=0.12;
    const driveY=z=>{
      for(let i=0;i<WP.length-1;i++){
        const p0=WP[i], p1=WP[i+1];
        if(z<=p0[0] && z>=p1[0])
          return p0[1]+(p1[1]-p0[1])*((p0[0]-z)/(p0[0]-p1[0]));
      }
      return z>WP[0][0] ? WP[0][1] : WP[WP.length-1][1];
    };
    /* Built up thick and sunk into the ground rather than laid on it as
       plates. At 12 cm the sides and the undersides of these showed, and
       from a car's eye height the drive read as a handful of grey boards
       dropped in the sand. */
    for(let i=0;i<WP.length-1;i++){
      const p0=WP[i], p1=WP[i+1], wid=6.6-i*0.06;
      tilt("concrete", wid, 0.80, p0[0], WY(p0[1]-0.40), p1[0], WY(p1[1]-0.40),
           (i%2)?"#6f6550":"#786d55", 0.22, 0);
      m.flat(-wid/2, wid/2, p1[0], p0[0], WY(Math.max(p0[1],p1[1])+0.01));
    }
    for(let i=0;i<34;i++){                      // ruts worn down it
      const rz=-13.2-r2()*8.0;
      m.P("soot", planeGeo(0.42+r2()*0.4, 1.8+r2()*2.2, 0),
          (i%2?1:-1)*(1.25+r2()*0.4), WY(driveY(rz)+0.012), rz, 0, "#463d2e",
          -Math.PI/2, 0);
    }
    for(let i=0;i<22;i++){                      // and the dirt blown over it
      const rz=-12.9-r2()*8.6;
      m.P("soot", planeGeo(1.2+r2()*2.0, 0.9+r2()*1.6, 0), (r2()-0.5)*6.4,
          WY(driveY(rz)+0.016), rz, r2()*6.28,
          ["#6a5f47","#7a6e55","#5c5240"][i%3], -Math.PI/2, 0);
    }
    /* And NOTHING scattered on top of it. A blob squashed to five
       centimetres is not a drift of sand, it is a flat angular shard, and
       eleven of them fanned out beside the highway with a scatter of little
       spikes through them read as a pile of rubbish somebody had tipped at
       the end of the drive. The drift is drawn as a low wedge against each
       shoulder of the causeway, where sand actually collects. */
    // and nothing laid on top of it at all: a tilted plate at the edge of the
    // causeway is another slab dropped in the sand, whichever bucket it is in
  }

  /* ---- the plinth the car sits on --------------------------------------- */
  m.B("concrete", L+0.5, FY, W+0.5, 0, FY/2, 0, 0.5, 0, "#8d8474");
  for(let i=0;i<9;i++)                          // and the blocks under the ends
    m.B("concrete", 0.46, FY+0.06, 0.46, -HL+0.5+i*(L-1)/8, (FY+0.06)/2,
        (i%2?1:-1)*(HW-0.55), 0.5, 0, "#7f7767");
  // each on its own plane: twenty decals at one depth is twenty overlapping
  // pairs of coplanar faces, and every overlap of them flickers
  for(let i=0;i<20;i++)
    for(const sz of [-1,1])
      m.P("soot", planeGeo(0.26+r2()*0.5, FY*0.9, 0), -HL+0.4+r2()*(L-0.8), FY*0.5,
          sz*(W/2+0.26+i*0.0035), sz>0?0:Math.PI, "#4f483c", 0, 0);

  /* ---- the courses ------------------------------------------------------ */
  band("dinertile", 0.02, SK, "#ffffff", 0, 1.9, true);    // the glazed skirt
  band("metal", SK, SK+0.10, STL, -0.06, 0.4, true);       // its capping
  band("galv", SK+0.10, GY0, CRM, 0.03, 2.6, true);        // stainless below the glass
  /* The course above the glass runs from 2.40 and the door head is at 2.68,
     so this one crossed the top 28 cm of the opening as well — the three
     below it were the obvious 72 cm and this was the quiet bit nobody looks
     at until they are standing in the doorway. Split at the head: broken
     round the door below it, solid across above. */
  band("galv", GY1, CH,     CRM, 0.03, 2.6, DOTOP);        // and again above it
  // fluting. Both stainless courses are rolled sheet, and flat paint is what
  // they read as without something for the light to break on.
  for(let k=0;k<5;k++){
    for(const sz of [-1,1]){
      if(sz<0){                                 // broken round the doorway
        m.B("metal", DOX0-(-HL+CR*0.7), 0.035, 0.035, ((-HL+CR*0.7)+DOX0)/2,
            SK+0.20+k*0.055, sz*(HW-0.005), 0,0, STLD);
        m.B("metal", (HL-CR*0.7)-DOX1, 0.035, 0.035, (DOX1+(HL-CR*0.7))/2,
            SK+0.20+k*0.055, sz*(HW-0.005), 0,0, STLD);
      }else m.B("metal", L-CR*1.4, 0.035, 0.035, 0, SK+0.20+k*0.055, sz*(HW-0.005),
                0,0, STLD);
    }
  }
  for(let k=0;k<4;k++){
    const fy=GY1+0.10+k*0.075;
    for(const sz of [-1,1]){
      if(sz<0 && fy<DOTOP+0.04){                // the lowest of these cross the head
        m.B("metal", DOX0-(-HL+CR*0.7), 0.030, 0.035, ((-HL+CR*0.7)+DOX0)/2, fy,
            sz*(HW-0.005), 0,0, STLD);
        m.B("metal", (HL-CR*0.7)-DOX1, 0.030, 0.035, (DOX1+(HL-CR*0.7))/2, fy,
            sz*(HW-0.005), 0,0, STLD);
      }else m.B("metal", L-CR*1.4, 0.030, 0.035, 0, fy, sz*(HW-0.005), 0,0, STLD);
    }
  }
  // the cornice: a deeper band with vertical ribs cut into it
  band("metal", CH, CT, STLD, -0.04, 0.6);
  for(let i=0;i<64;i++){                        // the ribs, round three sides
    const t=i/64, px=-HL+0.3+t*(L-0.6);
    for(const sz of [-1,1])
      m.B("metal", 0.05, CT-CH-0.06, 0.05, px, (CH+CT)/2, sz*(HW+0.02), 0, 0, "#8a918b");
  }

  /* ---- the window band --------------------------------------------------
     The road side is one long run of glass; the back has two small ones over
     the kitchen and the ends have a single light each. Everything at this
     height that is NOT a window is wall, or the back of the diner is a
     hundred-and-forty-millimetre slot you can see the desert through. */
  const KWIN=[-6.10,-4.90], KWW=0.94, KWY0=1.51, KWY1=2.37;      // kitchen lights
  const EWH=0.78, EWY0=1.44, EWY1=2.36;                          // the end lights
  {
    const glassRun=(x0,x1)=>{
      m.B("glass", x1-x0, GY1-GY0, 0.05, (x0+x1)/2, (GY0+GY1)/2, -HW+0.02, 0, 0, "#5f6f70");
      m.B("metal", x1-x0+0.10, 0.07, 0.11, (x0+x1)/2, GY0+0.02, -HW+0.02, 0, 0, STL);
      m.B("metal", x1-x0+0.10, 0.07, 0.11, (x0+x1)/2, GY1-0.02, -HW+0.02, 0, 0, STL);
    };
    glassRun(-HL+CR, DOX0-0.12);
    glassRun(DOX1+0.12, HL-CR);
    const MULL=[];
    for(let i=0;i<14;i++){
      const px=-HL+CR+0.42+i*0.92;
      if(px>DOX0-0.30) break;
      MULL.push(px);
      m.B("metal", 0.07, GY1-GY0, 0.13, px, (GY0+GY1)/2, -HW+0.02, 0, 0, STL);
    }
    m.B("metal", 0.07, GY1-GY0, 0.13, DOX1+0.62, (GY0+GY1)/2, -HW+0.02, 0, 0, STL);
    // a pane is out and somebody boarded it over from the outside
    const BP=MULL[5]+0.46;
    m.B("plank", 1.05, 1.02, 0.06, BP, (GY0+GY1)/2-0.02, -HW-0.04, 1.1, 0, "#6e5f47");
    for(const q of [-0.36,0.36])
      m.B("plank", 1.02, 0.09, 0.03, BP, (GY0+GY1)/2+q, -HW-0.08, 0.8, 0, "#5e5039");
    // the north face: wall, split round the two kitchen lights
    const nseg=[[-HL+CR, KWIN[0]-KWW/2],[KWIN[0]+KWW/2, KWIN[1]-KWW/2],
                [KWIN[1]+KWW/2, HL-CR]];
    for(const s of nseg) face("galv", s[0], s[1], GY0, GY1, 1, 0.03, CRM, 2.6);
    for(const px of KWIN){
      face("galv", px-KWW/2, px+KWW/2, GY0, KWY0, 1, 0.03, CRM, 2.6);
      face("galv", px-KWW/2, px+KWW/2, KWY1, GY1, 1, 0.03, CRM, 2.6);
      m.B("glass", KWW-0.08, KWY1-KWY0, 0.05, px, (KWY0+KWY1)/2, HW-0.02, 0,0, "#5f6f70");
    }
    // the south face has no gap in it but the door: the glass runs meet the
    // corner arcs at the tangent, so a filler past -HL+CR hangs off the end
    face("galv",  DOX0-0.14, DOX0, GY0, GY1, -1, 0.03, CRM, 2.6);
    face("galv",  DOX1, DOX1+0.14, GY0, GY1, -1, 0.03, CRM, 2.6);
    // the two ends, split round their one light each
    for(const sx of [-1,1]){
      endf("galv", -HW+CR, -EWH, GY0, GY1, sx, 0.03, CRM, 2.6);
      endf("galv",  EWH,  HW-CR, GY0, GY1, sx, 0.03, CRM, 2.6);
      endf("galv", -EWH, EWH, GY0, EWY0, sx, 0.03, CRM, 2.6);
      endf("galv", -EWH, EWH, EWY1, GY1, sx, 0.03, CRM, 2.6);
      m.B("glass", 0.05, EWY1-EWY0, EWH*2-0.10, sx*(HL-0.02), (EWY0+EWY1)/2, 0, 0,0,
          "#5f6f70");
    }
    corners("galv", GY0, GY1, CRM, 0.03, 2.6);
    // a service door on the back, screwed shut years ago
    m.B("metal", 0.96, 2.04, 0.10, -2.2, FY+1.02, HW-0.05, 0.4, 0, "#8d938d");
    for(const q of [FY+0.70, FY+1.46])
      m.B("plank", 1.06, 0.22, 0.05, -2.2, q, HW+0.03, 0.9, 0, "#6e5f47");
    m.B("metal", 0.14, 0.04, 0.05, -1.80, FY+1.00, HW+0.03, 0, 0, CHRD);
  }

  /* ---- the shell's collider ---------------------------------------------
     Four walls with a hole in one of them, not one box round the lot —
     wrapped whole it seals its own front door. */
  m.col(-HL-0.2, HL+0.2,  HW-0.2, HW+0.2, 0, CT);           // the back
  for(const sx of [-1,1])
    m.col(sx*HL-0.2*sx-0.2, sx*HL+0.2, -HW-0.2, HW+0.2, 0, CT);   // the two ends
  m.col(-HL-0.2, DOX0, -HW-0.2, -HW+0.2, 0, CT);            // and the road side,
  m.col(DOX1, HL+0.2, -HW-0.2, -HW+0.2, 0, CT);             // either side of the door
  // the header, measured from the FLOOR — at 2.10 above the apron it is
  // 1.5 m above a floor that is itself 0.62 up, i.e. through the doorway
  m.col(DOX0, DOX1, -HW-0.2, -HW+0.2, DOTOP, CT);

  /* ---- the barrel roof and its monitor ---------------------------------- */
  const MY=CT+RR*0.52;
  {
    const seg=[];
    for(let i=0;i<=22;i++){                     // a half cylinder, capped
      const a=Math.PI*(i/22);
      seg.push([Math.cos(a)*(HW+0.06), Math.sin(a)*RR*0.52]);
    }
    for(let i=0;i<22;i++){
      const p0=seg[i], p1=seg[i+1];
      // the strips LEAN, which the first cut of this did not: they were
      // stacked flat and the barrel read as a flight of stairs
      tilt("roof", L+0.16, 0.10, p0[0], CT+p0[1], p1[0], CT+p1[1],
           (i%3) ? "#6b6258" : "#645c52", 0.5, 0);
    }
    for(const sx of [-1,1]){                    // the ends of the barrel
      // half a disc, because the barrel is half a cylinder — a full circle
      // hangs a metre of roof down through the wall below it
      const cp=new T.CircleGeometry(RR*0.52, 22, 0, Math.PI);
      m.P("roof", cp, sx*(HL+0.05), CT, 0, sx>0?Math.PI/2:-Math.PI/2, "#6b6258", 0, 0);
    }
    for(let i=0;i<30;i++)                       // sand and leaf litter on top
      m.P("soot", planeGeo(1.4+((i*7)%4)*0.9, 0.9+((i*5)%3)*0.5, 0),
          -HL+0.6+((i*2.31)%(L-1.2)), CT+RR*0.52+0.03, ((i*5)%7-3)*0.30,
          i*1.1, ["#a1957a","#8d8268","#b0a488"][i%3], -Math.PI/2, 0);
    // the clerestory monitor: a long low box riding the crown
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
    /* The flue cluster and the cowl stand on the BARREL, out past the edge of
       the monitor, so they have to be set on the curve of it — at a height
       measured off the monitor they hung the better part of a metre in the
       air above the roof, which is what the float probe found. */
    const roofY=z=>CT + Math.sqrt(Math.max(0, 1-(z/(HW+0.06))*(z/(HW+0.06))))*RR*0.52;
    for(let i=0;i<4;i++){
      const fz=1.46+((i*3)%2)*0.10, ln=0.95+((i*5)%3)*0.28;
      m.C("metal", 0.055,0.055, ln, 8, -5.4+i*0.34, roofY(fz)-0.16+ln/2, fz,
          i%2?"#6e746f":RUSTD, ((i*7)%5-2)*0.03, 0, ((i*3)%5-2)*0.03);
    }
    m.C("metal", 0.26,0.30,0.44,12, 4.3, roofY(1.34)-0.10+0.22, 1.34, "#6e746f");
    m.C("metal", 0.34,0.34,0.10,12, 4.3, roofY(1.34)-0.10+0.49, 1.34, "#5e645f");
    /* The swamp cooler that used to keep it bearable, seized solid. It sat
       on the ROAD side of the roof, which put a metre of grey box between
       the highway and the middle of the name board. It lives at the back
       now, where the flue and the cowl are. */
    {
      const cz=1.44, cy=roofY(cz)-0.14+0.46;     // sat on the curve, not in the air
      m.B("metal", 1.10, 0.92, 1.10, -2.6, cy, cz, 0.45, 0, "#8a8f88");
      for(const q of [-1,1])
        m.B("bin", 0.94, 0.70, 0.04, -2.6, cy, cz+q*0.55, 0, 0, "#3f443f");
      m.C("metal", 0.30,0.30,0.16,14, -2.6, cy+0.54, cz, RUSTD);
      for(const q of [-1,1])                     // and the bearers under it
        m.B("weathered", 1.24, 0.10, 0.12, -2.6, cy-0.50, cz+q*0.42, 0.4, 0, "#6f6656");
    }
  }

  /* ---- the roof sign -----------------------------------------------------
     Painted steel on two posts. It is NOT in NEON and it is not drawn with an
     unlit material: there is no power to this building, and a sign that comes
     up at dusk with everything else on the highway says there is. */
  {
    const SY=MY+1.06;
    for(const sx of [-1,1])
      m.C("metal", 0.055,0.065, 1.30, 8, sx*2.2, SY-0.55, -0.3, DARKM,
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
    for(const sd2 of [-1,1])
      signPanel(6.30, 1.444, tex, D.x, m.y+SY+0.22, D.z-0.3+sd2*0.10,
                sd2>0 ? 0 : Math.PI, false);
    /* The neon that used to trace the board, most of it broken off at the
       supports. Plain glass, unlit, like everything else here — the tubes
       are what is left, not what they did. */
    for(const sd2 of [-1,1]){
      const nz=-0.3+sd2*0.13;
      for(let i=0;i<13;i++){                     // the top and bottom runs
        const px=-2.9+i*0.48;
        if(i===4 || i===9) continue;             // where a length is gone
        for(const q of [SY+0.52, SY-0.08])
          m.C("glass", 0.018,0.018,0.44,7, px, q, nz, "#b6c4bc", 0, 0, Math.PI/2);
      }
      for(const q of [-3.14, 3.14])              // and the two returns
        m.C("glass", 0.018,0.018,0.58,7, q, SY+0.22, nz, "#b6c4bc");
      for(let i=0;i<8;i++)                       // the tube supports
        m.C("metal", 0.010,0.010,0.09,5, -2.9+i*0.86, SY+0.52, nz-sd2*0.05,
            "#6e746f", Math.PI/2*sd2, 0, 0);
    }
    // the transformer box it all ran off, hanging open
    m.B("metal", 0.30, 0.22, 0.16, -3.0, SY-0.42, -0.30, 0.4, 0, "#6b716b");
    m.P("metal", boxGeo(0.30,0.20,0.02,0.4), -3.0, SY-0.46, -0.44, 0.5, "#5f655f", 0, 0.3);
    m.C("metal", 0.008,0.008,0.50,5, -2.86, SY-0.58, -0.36, "#3a3f3c", 0.4, 0, 0.2);
    // the lamps that used to wash it, hanging off their conduit, all dead
    for(const q of [-1.9, 0, 1.9]){
      m.C("metal", 0.03,0.03,0.46,8, q, SY-0.62, -0.72, DARKM, 0.6, 0, 0);
      m.C("metal", 0.11,0.13,0.16,10, q, SY-0.44, -0.92, q===0?RUSTD:DARKM, 1.1, 0, 0);
    }
  }

  /* ---- the entry ---------------------------------------------------------
     Jambs and a head, not a slab across the opening: the first cut of this
     stood two metres of stainless in front of its own front door. */
  {
    const Z=-HW;
    for(const q of [-1,1])
      m.B("metal", 0.20, DOTOP-SK+0.16, 0.34, DX+q*(DOORW/2+0.12), (SK+DOTOP+0.16)/2,
          Z-0.10, 0.4, 0, STL);
    m.B("metal", DOORW+0.64, 0.18, 0.34, DX, DOTOP+0.09, Z-0.10, 0.4, 0, STL);
    m.B("metal", DOORW+0.64, 0.14, 0.40, DX, CH+0.04, Z-0.12, 0.4, 0, STLD);
    /* A stoop, in three risers from the apron to the floor. The first cut of
       this ran the other way: the tread FURTHEST from the door was the
       tallest and the one against the threshold the shortest, so the flight
       climbed away from the building and walking in meant going down two
       steps and then up over a knee-high sill. Nearest the door highest, and
       each tread is a real walkable plate at its own top. */
    const APR=0.03, TRD=0.36, SW=2.10;
    for(let i=0;i<3;i++){
      // the bottom tread 4 cm above the apron, not AT it: level with the lot
      // it was a slab lying in the lot's own plane, and the two fought
      const top=FY-(i+1)*((FY-APR-0.04)/3);    // about 0.43, 0.25, 0.07
      const z1=Z-0.34-i*TRD, z0=z1-TRD;        // and each one further out
      const w=SW-i*0.10;
      m.B("concrete", w, top-APR+0.26, TRD+0.02, DX, (APR+top)/2-0.13, (z0+z1)/2,
          0.5, 0, (i%2)?"#8d8474":"#847b6b");
      m.flat(DX-w/2, DX+w/2, z0, z1, top);
      // the nosing, and the crack across it that every one of these has
      // 3 mm proud of the tread, not 0.5 mm under its surface
      m.B("concrete", w, 0.035, 0.05, DX, top-0.0145, z0+0.025, 0.4, 0, "#9a9182");
      m.P("soot", planeGeo(0.05+((i*7)%3)*0.04, TRD*0.9, 0),
          DX-0.5+((i*5)%3)*0.5, top+0.004, (z0+z1)/2, 0.2*(i-1), "#57503f",
          -Math.PI/2, 0);
    }
    for(const q of [-1,1]){                    // a low cheek wall either side
      m.B("concrete", 0.22, 0.52, 3*TRD+0.36, DX+q*(SW/2+0.06), 0.22, Z-0.34-1.5*TRD,
          0.5, 0, "#8d8474");
      m.B("concrete", 0.30, 0.06, 3*TRD+0.44, DX+q*(SW/2+0.06), 0.51, Z-0.34-1.5*TRD,
          0.4, 0, "#9a9182");
    }
    m.col(DX-SW/2-0.20, DX-SW/2+0.06, Z-0.34-3*TRD-0.2, Z-0.28, 0, 0.52);
    m.col(DX+SW/2-0.06, DX+SW/2+0.20, Z-0.34-3*TRD-0.2, Z-0.28, 0, 0.52);
    // the sill has to reach the interior floor's own edge, or there is a
    // hand's width of threshold that drops you back onto the apron
    m.flat(DX-0.7, DX+0.7, Z-0.34, Z+0.34, FY+0.012);
    m.B("metal", 1.34, 0.04, 0.40, DX, FY+0.01, Z+0.08, 0.4, 0, CHRD);
    /* THE HANDRAIL IS GONE, and this is the third thing in a row to be
       standing in this doorway. It was a metre off the door centre and it
       topped out at 1.13, which is chest height on a 1.24 m opening — so
       from anywhere on the apron the rake crossed the entrance, and because
       it had no collider the doorway probe went on saying the lane was
       clear. A three-riser stoop with cheek walls either side does not need
       a rail. What is left is the two sockets it was bolted into, cut off
       flush and weeping rust, which says more about the place than the rail
       did. Nothing else goes within the door's lane at any height: see
       clear36.js, which walks the geometry rather than the colliders. */
    for(const q of [-1,1]) for(const zz of [Z-0.50, Z-1.42]){
      m.C("metal", 0.034,0.034,0.05,8, DX+q*(SW/2+0.06), 0.545, zz, "#6e746f");
      m.P("rust", streakGeo(0.06, 0.30, 0), DX+q*(SW/2+0.06)+q*0.112, 0.38, zz,
          q>0?Math.PI/2:-Math.PI/2, "#6b5a45", 0, 0);
    }
    // a CLOSED card taped inside the glass, and the hours nobody reads
    m.P("paper", planeGeo(0.30,0.20,0), DX-0.78, FY+1.62, Z+0.06, 0, "#cfc6ae", 0, 0.18);
    m.P("paper", planeGeo(0.22,0.30,0), DX+0.80, FY+1.50, Z+0.06, 0, "#c4bba3", 0, -0.06);
    // makeDoor's frame origin is the hinge; the leaf hangs half its own width
    // across from it, and the leaf centre is what the door probe walks. Shift
    // the frame by that half width so the opening lands on DX, where the hole
    // in the wall collider and the steps below it already are.
    makeDoor(XF(D.x+DX+0.49, D.z+Z-0.03, Math.PI), 0, m.y+FY-0.02, 0,
             "ROXIE'S DINER", true, 0.42, "bar");
  }

  /* ---- what forty years in the sun does to stainless ---------------------- */
  /* A decal hung on the outside of the road face is still in the doorway if
     it is drawn over the hole — you are looking through the opening at a
     plane floating in front of it. `overDoor` is the one test everything
     scattered on this face goes through. */
  const overDoor=(px,hw)=>(px+hw>DOX0-0.06 && px-hw<DOX1+0.06);
  for(let i=0;i<34;i++){                          // rust weeping from the seams
    const px=-HL+0.8+((i*2.17)%(L-1.6)), sz=(i%2)?1:-1;
    const w=0.20+((i*5)%3)*0.10;
    if(sz<0 && overDoor(px, w/2)) continue;
    m.P("rust", streakGeo(w, 0.70+((i*7)%4)*0.55, 0),
        // just proud of the trim strips (2.60 out); laddered by i it drifted
        // up to 15 cm off the side of the car
        px, CH-0.30, sz*(HW+0.056+(i%4)*0.0012), sz>0?0:Math.PI, "#7c4526", 0, 0);
  }
  /* Large-scale tone on the stainless. The soot bucket is 16% and the rust
     bucket 30%, which reads on asphalt and reads as nothing at all on a pale
     sunlit wall — so the weathering that has to carry at a distance is opaque
     panels in the wall's own bucket, a shade off it. */
  for(let i=0;i<26;i++){
    const px=-HL+0.6+r2()*(L-1.2), sz=(i%2)?1:-1;
    const y0=(i%3===0) ? SK+0.14 : GY1+0.06, y1=(i%3===0) ? GY0-0.04 : CH-0.04;
    const h=(y1-y0)*(0.35+r2()*0.6), w=0.5+r2()*2.2;
    m.B("galv", w, h, 0.03, px, y0+(y1-y0)*r2()*0.4+h/2, sz*(HW-0.015-i*0.0011), 2.6, 0,
        ["#a49d8c","#9b9484","#ada695"][i%3]);
  }
  for(let i=0;i<10;i++){                          // and a few dents in the sheet
    const px=-HL+1.0+r2()*(L-2.0), sz=(i%2)?1:-1;
    m.P("galv", boxGeo(0.34+r2()*0.4, 0.22+r2()*0.3, 0.03, 2.6), px,
        GY1+0.20+r2()*0.44, sz*(HW-0.047-i*0.0013), 0, "#8d8878",
        (r2()-0.5)*0.3, (r2()-0.5)*0.3);
  }
  for(let i=0;i<22;i++){                          // streaks off the window heads
    const px=-HL+0.9+((i*3.11)%(L-1.8)), sz=(i%2)?1:-1, w=0.24+r2()*0.30;
    if(sz<0 && overDoor(px, w/2)) continue;
    m.P("soot", planeGeo(w, 0.8+r2()*0.6, 0), px, GY0-0.44, sz*(HW+0.09+i*0.0035),
        sz>0?0:Math.PI, "#6a6053", 0, 0);
  }
  for(const sz of [-1,1]){                         // the dirt line off the apron
    if(sz<0){                                      // and round the door, not over it
      for(const q of [[-HL+0.7, DOX0-0.06],[DOX1+0.06, HL-0.7]])
        m.P("soot", planeGeo(q[1]-q[0], 0.44, 0), (q[0]+q[1])/2, SK+0.26,
            sz*(HW+0.148), Math.PI, "#6d6455", 0, 0);
    }else m.P("soot", planeGeo(L-1.4, 0.44, 0), 0, SK+0.26, sz*(HW+0.148),
              0, "#6d6455", 0, 0);
  }
  /* Sand banked against the ends. A blobGeo is a lumpy polyhedron and
     squashing one to a fifth of its height does not make a drift — it makes
     a flat angular shard with a hard silhouette, and nine of them stacked
     against the end of the building read as a pile of broken plasterboard.
     A squashed sphere stays convex and smooth, which is what a drift is. */
  for(let i=0;i<9;i++){
    const g=new T.SphereGeometry(0.60+((i*5)%3)*0.26, 14, 8);
    g.scale(1.5, 0.30, 1.0);
    m.P("sand", g, (i<5?-1:1)*(HL+0.16+((i*3)%3)*0.12), 0.02,
        -1.6+((i*7)%5)*0.9, i*0.9, "#b08a60", 0, 0);
  }
  /* And along the foot of both long sides, where the sand banks up against
     the plinth and nobody has swept it back in forty years. Lower and longer
     than the drifts at the ends, broken round the steps so the stoop still
     reads as something you walk up. */
  for(const sz of [-1,1]) for(let i=0;i<16;i++){
    const px=-HL+0.5+i*((L-1.0)/15);
    if(sz<0 && px>DX-1.5 && px<DX+1.5) continue;       // not across the steps
    const g=new T.SphereGeometry(0.42+((i*5)%4)*0.16, 12, 7);
    g.scale(1.9, 0.20+((i*3)%3)*0.05, 0.85);
    m.P("sand", g, px, 0.02, sz*(HW+0.30+((i*7)%3)*0.07), (i%2?1:-1)*0.09,
        ["#b08a60","#b99165","#a47a4e"][i%3], 0, 0);
  }
  /* And what blew in and stopped against the front of it. A sphere in the
     foliage bucket is not a tumbleweed, it is a large olive pea — four of
     them sitting at the bottom of the steps looked like garden ornaments.
     A thistle is a tangle, so it is drawn as one: stems out of a crown, each
     one leaning somewhere else. */
  for(let i=0;i<4;i++){
    const wx2=[DX-1.85, DX+1.75, -HL-0.8, HL+0.65][i];
    const wz2=-HW-0.55-((i*3)%3)*0.28, R=0.22+((i*5)%3)*0.07;
    for(let k=0;k<13;k++){
      const th=(k*2.399)+i, ph=Math.acos(1-2*((k+0.5)/13));
      const dx2=Math.sin(ph)*Math.cos(th), dy=Math.cos(ph), dz2=Math.sin(ph)*Math.sin(th);
      m.C("foliage", 0.007,0.010, R*(1.25+((k*7)%3)*0.30), 4,
          wx2+dx2*R*0.5, R*0.9+dy*R*0.4, wz2+dz2*R*0.5,
          (k%3)?"#7d7448":"#6d6448",
          Math.atan2(dz2, dy)*0.8, th, Math.atan2(dx2, dy)*0.8);
    }
  }

  /* ---- the ground round it ----------------------------------------------
     There was nothing out here at all. The desert scatter runs to five
     hundred metres from the motel and the pole line stopped at seven
     hundred, so the diner stood on a bare plain with a clean circular edge
     to its lot and open sand to the horizon. Rocks, brush, a fence line, the
     tank and the bins that belong behind a kitchen.               */
  {
    const GY=(x,z)=>Terrain.groundAt(D.x+x, D.z+z)-m.y;
    for(let i=0;i<26;i++){                      // rocks, outside the lot
      const a=r2()*6.283, rr=D.r+1.5+r2()*26;
      const rx=Math.cos(a)*rr, rz=Math.sin(a)*rr*0.8;
      if(rz<-17) continue;                      // not out on the highway
      const sc=0.28+r2()*0.95;
      /* Sunk, not perched. heightAt is the analytic ground and the mesh that
         draws it samples that on a six-metre lattice, so on the face of a
         mesa the triangle you can see is metres below the number a rock was
         placed with — and the rock hangs in the air off the slope. A rock
         half-buried in sand is what the desert does with them anyway, and it
         cannot float. */
      m.P("rock", rockGeo(sc, (i*37)|0), rx, GY(rx,rz)-sc*0.30, rz, r2()*6.283,
          r2()<0.5?"#8a7a62":"#7d6e57", (r2()-0.5)*0.2, (r2()-0.5)*0.2);
    }
    for(let i=0;i<22;i++){                      // creosote and dead brush
      const a=r2()*6.283, rr=D.r-1+r2()*30;
      const bx2=Math.cos(a)*rr, bz=Math.sin(a)*rr*0.85;
      if(bz<-16) continue;
      const gy=GY(bx2,bz), dead=r2()<0.4;
      for(let k=0;k<7;k++){
        const an=k*0.9, ln=0.22+r2()*0.34;
        m.C("foliage", 0.012,0.020,ln, 4, bx2+Math.cos(an)*0.10, gy+ln*0.42,
            bz+Math.sin(an)*0.10, dead?"#6d6144":(r2()<0.5?"#4f6b3a":"#57713f"),
            (r2()-0.5)*0.7, an, (r2()-0.5)*0.7);
      }
    }
    // the fence that used to mark the back of the lot, most of it down
    for(let i=0;i<11;i++){
      const px=-15+i*3.0, pz=15.5+((i*7)%3)*0.4, gy=GY(px,pz);
      const lean=(i===4||i===8) ? 0.9 : (i%3===0 ? 0.18 : 0.05);
      m.P("weathered", boxGeo(0.10, 1.45, 0.10, 0.4), px, gy+0.70*Math.cos(lean), pz,
          i*0.4, "#7a6c52", 0, lean*((i%2)?1:-1));
      if(i<10 && lean<0.5)
        for(const wy of [0.42, 0.86, 1.24])
          m.P("metal", boxGeo(3.0, 0.016, 0.016, 0), px+1.5, gy+wy+((i%2)?0.03:0), pz,
              0, "#6b6255", 0, ((i%3)-1)*0.012);
    }
    // a propane tank on its cradle, and the bins, round the back
    m.C("metal", 0.44,0.44,1.90,16, -6.2, GY(-6.2,4.6)+0.62, 4.6, "#b0b4ac", 0,0,Math.PI/2);
    for(const q of [-1,1]){
      m.P("metal", new T.SphereGeometry(0.44,14,9), -6.2+q*0.95, GY(-6.2,4.6)+0.62, 4.6,
          0, "#b0b4ac");
      m.B("weathered", 0.14, 0.62, 0.62, -6.2+q*0.70, GY(-6.2,4.6)+0.31, 4.6, 0.4, 0,
          "#6f6656");
    }
    m.C("metal", 0.05,0.05,0.34,8, -6.2, GY(-6.2,4.6)+1.20, 4.6, "#8a908a");
    m.col(-7.4, -5.0, 4.0, 5.2, 0, 1.2);
    for(let i=0;i<2;i++){                       // two bins, one on its side
      const bx3=-2.6+i*1.5, bz3=4.4;
      if(i===0){
        m.C("bin", 0.34,0.30,0.92,14, bx3, GY(bx3,bz3)+0.46, bz3, "#4a5a4e");
        m.C("bin", 0.36,0.36,0.05,14, bx3, GY(bx3,bz3)+0.94, bz3, "#3f4f45");
        m.col(bx3-0.36, bx3+0.36, bz3-0.36, bz3+0.36, 0, 0.98);
      }else{
        m.P("bin", new T.CylinderGeometry(0.34,0.30,0.92,14), bx3, GY(bx3,bz3)+0.34,
            bz3-0.2, 0.6, "#4a5a4e", Math.PI/2, 0);
        for(let k=0;k<6;k++)
          m.P("paper", planeGeo(0.16+r2()*0.12, 0.20+r2()*0.12, 0), bx3+0.5+r2()*1.4,
              GY(bx3,bz3)+0.02, bz3-0.6+r2()*1.2, r2()*6.28, "#c9c1aa", -Math.PI/2, 0);
      }
    }
    // a dead pole at the lot entrance with the bracket its sign hung off
    m.C("weathered", 0.09,0.11,3.40,8, -9.4, GY(-9.4,-10.6)+1.70, -10.6, "#7a6c52",
        0.02, 0, 0.03);
    m.B("metal", 0.70, 0.06, 0.06, -9.08, GY(-9.4,-10.6)+3.24, -10.6, 0.4, 0, RUSTD);
    m.C("metal", 0.012,0.012,0.30,6, -8.78, GY(-9.4,-10.6)+3.10, -10.6, RUSTD);
    m.col(-9.55, -9.25, -10.75, -10.45, 0, 3.4);
  }

  m.zone(D.r+5, "ROXIE'S DINER");

  /* ======================================================================
     INSIDE
     One long room with the kitchen walled off at the west end. The counter
     runs down the back wall with the stools in front of it and the quilted
     panel behind; the booths take the window side; the entry bay is the
     three metres east of both, which is where the door is.
     ====================================================================== */
  const IX1=HL-0.03-WT, IX0=-IX1, IZ1=HW-0.03-WT, IZ0=-IZ1;   // the shell's inner faces
  const KX=-4.30;                                  // the kitchen bulkhead
  /* The cross section, measured against a player who is 0.68 m across. The
     working aisle between the counter's back rail and the back bar has to be
     wider than he is or the kitchen is unreachable, and the same goes for the
     gap between the counter's west end and the bulkhead, and for the gap
     between the first booth and the bulkhead. All three came out at a
     handful of centimetres on the first pass. */
  const BBZ0=IZ1-0.36;                             // the back bar, against the wall
  const CBZ0=0.44, CBZ1=1.00;                      // the counter carcass
  const CTZ0=0.36, CTZ1=1.06;                      // and the top, overhanging both ways
  const CY=FY+1.04;                                // the counter top surface
  const SZ=CTZ0-0.41;                              // where the stools stand
  const CX0=-2.95, CX1=4.34;                       // the counter's two ends
  // -2.55, not -2.80: at -2.80 the first booth's west bench stood 20 cm into
  // the lane the door probe walks through the kitchen doorway
  const BX0=-2.55, BPITCH=1.90;                    // the first booth, and the pitch
  const PZ0=0.60, PZ1=1.92;                        // the pass, over the counter's back
  const KDZ0=IZ0+0.10, KDZ1=-1.10;                 // the kitchen door, on the window side
  const CEILW=CH-0.10, RISE=0.58;
  const ceilY=z=>CEILW+RISE*Math.cos((z/IZ1)*Math.PI/2);

  /* ---- the floor --------------------------------------------------------- */
  // +0.2 and no more: the shell's outer face is only 0.17 beyond IX1, and a
  // floor that overhangs it is a slab of tile sticking out of the building
  m.P("hexfloor", planeGeo(IX1-(KX-0.08)+0.2, IZ1-IZ0+0.2, 1.4), ((KX-0.08)+IX1)/2,
      FY+0.012, 0, 0, "#b0aa9c", -Math.PI/2, 0);
  m.flat(IX0-0.1, IX1+0.1, IZ0-0.1, IZ1+0.1, FY+0.012);
  m.voidAt(IX0-0.1, IX1+0.1, IZ0-0.1, IZ1+0.1, FY-1.0, FY+CH+0.8, FY+0.012);
  for(const q of [IZ0+0.14, IZ1-0.14])             // the dark border tile
    m.P("hexfloor", planeGeo(IX1-(KX-0.08), 0.28, 1.4), ((KX-0.08)+IX1)/2, FY+0.0205, q, 0,
        "#6b6a63", -Math.PI/2, 0);
  for(const q of [KX-0.08+0.14, IX1-0.14])
    m.P("hexfloor", planeGeo(0.28, IZ1-IZ0, 1.4), q, FY+0.0205, 0, 0,
        "#6b6a63", -Math.PI/2, 0);
  for(let i=0;i<18;i++)                            // where forty years of feet went
    m.P("soot", planeGeo(1.5+r2()*1.6, 0.8+r2()*0.7, 0), CX0+r2()*(CX1-CX0),
        FY+0.018+i*0.0006, SZ+(r2()-0.5)*0.8, r2()*6.28, "#4e463a", -Math.PI/2, 0);
  for(let i=0;i<12;i++)                            // and where the roof let weather in
    m.P("soot", planeGeo(0.7+r2()*1.2, 0.7+r2()*1.1, 0), IX0+0.8+r2()*(IX1-IX0-1.6),
        FY+0.030+i*0.0006, IZ0+0.4+r2()*(IZ1-IZ0-0.8), r2()*6.28, "#3f3a30",
        -Math.PI/2, 0);
  /* Sand in under the door — and ONLY under the door. At three metres wide
     and half a metre across this reached the fourth booth, so there was a
     pale drift sitting in somebody's seat. It stays in the lane you walk in
     along, it is flatter, and it is the colour of what blew in rather than
     of fresh sand. */
  for(let i=0;i<9;i++){
    const g=new T.SphereGeometry(0.34+r2()*0.30, 12, 7); g.scale(1.5, 0.038, 1.0);
    m.P("sand", g, DX-1.15+r2()*2.3, FY+0.012, IZ0+0.22+r2()*0.72, r2()*6.28,
        i%3?"#c0a07a":"#b4946c", 0, 0);
  }

  /* ---- the ceiling -------------------------------------------------------
     The barrel comes down inside as well as out: strips across the car, each
     one leaning to the arc, with transverse ribs under them the way the roof
     has them over. */
  for(let i=0;i<20;i++){
    const z0=IZ0+(IZ1-IZ0)*(i/20), z1=IZ0+(IZ1-IZ0)*((i+1)/20);
    // a ceiling faces DOWN, and what a downward face gets from the hemisphere
    // light is the ground colour, which out here is 0x4a2a18. Anything but a
    // near-white up here comes out the brown of a ship's hull.
    tilt("metal", IX1-IX0+0.3, 0.05, z0, ceilY(z0), z1, ceilY(z1),
         (i%2)?"#f2eee2":"#e9e5d7", 0.5, 0);
  }
  for(let i=0;i<13;i++){                           // the ribs, hanging below
    const px=IX0+0.60+i*((IX1-IX0)-1.2)/12;
    for(let k=0;k<12;k++){
      const z0=IZ0+(IZ1-IZ0)*(k/12), z1=IZ0+(IZ1-IZ0)*((k+1)/12);
      tilt("metal", 0.065, 0.075, z0, ceilY(z0)-0.058, z1, ceilY(z1)-0.058,
           "#e2ddcd", 0.4, px);
    }
  }
  for(let i=0;i<28;i++){                           // damp and soot up there
    const pz=((i*7)%9-4)*0.46;
    m.P("soot", planeGeo(0.7+((i*5)%3)*0.6, 0.5+((i*3)%3)*0.5, 0),
        IX0+0.7+((i*1.87)%(IX1-IX0-1.4)), ceilY(pz)-0.02, pz, i*1.1, "#4a4237",
        Math.PI/2, 0);
  }
  m.P("metal", boxGeo(1.20,0.05,0.86,0.5), -1.1, FY+0.06, -0.45, 0.4, "#7d817b", 0.08, 0.05);
  /* Two panels out of the barrel and one hanging off its fixing. The dark
     behind them is the roof space, which is the only thing up there that is
     supposed to be black. */
  for(const g of [[1.9,-0.9],[-2.6,0.7]]){
    const z0=g[1]-0.34, z1=g[1]+0.34;
    tilt("bin", 1.10, 0.05, z0, ceilY(z0)+0.055, z1, ceilY(z1)+0.055, "#1d1f1c", 0.5, g[0]);
    for(let k=0;k<3;k++)                        // the batten behind, catching light
      tilt("metal", 0.05, 0.05, z0, ceilY(z0)+0.10, z1, ceilY(z1)+0.10, "#6e746f",
           0.4, g[0]-0.34+k*0.34);
  }
  m.P("metal", boxGeo(0.88, 0.04, 0.60, 0.5), 4.6, ceilY(0.6)-0.36, 0.62, 0.15,
      "#cbc6b7", 0.88, 0.06);                   // the one that is still hanging
  for(let i=0;i<7;i++)                          // and the dust coming through
    m.P("soot", planeGeo(0.6+r2()*0.9, 0.5+r2()*0.7, 0), 1.9+(r2()-0.5)*1.6,
        FY+0.024+i*0.0007, -0.9+(r2()-0.5)*1.4, r2()*6.28, "#4a4237", -Math.PI/2, 0);

  /* ---- the wall finishes -------------------------------------------------
     The shell's inner faces ARE the walls now, so these are linings over them
     rather than the walls themselves. */
  /* The quilted panel behind the counter, which is the thing you see first.
     It was drawn as two panels, and the height of the lower one worked out at
     GY0-FY-0.90 = minus eighteen centimetres, so the wall behind the counter
     was bare shell. One panel, floor-to-cornice, and three chrome bands. */
  {
    const qw=CX1-KX-0.2, qx=(KX+CX1)/2+0.10, q0=FY+0.92, q1=CH-0.04;
    m.P("quilt", planeGeo(qw, q1-q0, 3.2), qx, (q0+q1)/2, IZ1-0.02,
        Math.PI, "#ffffff", 0, 0);
    for(const q of [q0, GY1-0.02, q1])
      m.B("metal", qw+0.04, 0.05, 0.07, qx, q, IZ1-0.045, 0.4, 0, CHRD);
  }
  /* THE WAINSCOT ON THE WINDOW SIDE, AND THE DOOR IN THE MIDDLE OF IT.

     This is what the railing across the front entrance actually was. The
     lining, its chrome cap rail, its stiles, its kick and the sill ledge over
     it were each drawn as one piece IX1-IX0 long — the whole interior width
     of the car — and the front door is in the middle of that wall. So a
     chrome bar ran across the opening at 1.29, a laminate ledge at 1.37 and
     seventy centimetres of panelling under both, and because a lining
     carries no collider the doorway probe went on calling the lane clear.

     `road()` runs a piece down the road side in the two lengths either side
     of the door instead of one length through it. Everything at this height
     on this wall goes through it, and clear36.js is the thing that checks. */
  const road=(fn)=>{ fn(IX0, DOX0-0.02); fn(DOX1+0.02, IX1); };
  road((a,b)=>{
    const w=b-a, cx=(a+b)/2;
    m.P("roomwall", planeGeo(w, GY0-FY-0.05, 2.4), cx, FY+(GY0-FY)/2, IZ0+0.02,
        0, WOOD, 0, 0);
    m.B("metal", w, 0.07, 0.06, cx, GY0-0.05, IZ0+0.05, 0.4, 0, CHRD);
    m.B("roomwall", w, 0.045, 0.030, cx, FY+0.10, IZ0+0.045, 0.5, 0, "#879475");
    // 0.12 and tucked back: at 0.16 it stood out to IZ0+0.17 and the booth
    // benches began at IZ0+0.08, so the ledge ran through the end of every one
    m.B("lino", w, 0.05, 0.12, cx, GY0+0.03, IZ0+0.07, 0.5, 0, LAMD);         // the sill
  });
  // stiles down the wainscot, so it reads as panelling and not as paint
  for(let i=0;i<17;i++){
    const px=IX0+0.35+i*((IX1-IX0)-0.7)/16;
    if(px>DOX0-0.10 && px<DOX1+0.10) continue;                 // not across the door
    m.B("roomwall", 0.055, GY0-FY-0.10, 0.030, px, FY+(GY0-FY)/2, IZ0+0.045,
        0.5, 0, "#879475");
  }
  /* And the reveal, so the cut ends of all that read as a finished opening
     rather than as a lining somebody sawed through: a stile down each side
     of the doorway and a return across the head of the wainscot. */
  for(const q of [DOX0-0.02, DOX1+0.02])
    m.B("roomwall", 0.055, GY0-FY-0.05, 0.048, q, FY+(GY0-FY)/2, IZ0+0.048,
        0.5, 0, "#7d8a6c");
  for(const q of [DOX0-0.02, DOX1+0.02])
    m.C("metal", 0.030,0.030,0.11,8, q, GY0-0.05, IZ0+0.05, CHRD, 0, 0, Math.PI/2);
  // the end walls, taken up to the barrel in strips — and stopping short of
  // the one light in each end, or the lining boards straight over the window
  for(const sx of [-1,1])
    for(let k=0;k<12;k++){
      const z0=IZ0+(IZ1-IZ0)*(k/12), z1=IZ0+(IZ1-IZ0)*((k+1)/12), zc=(z0+z1)/2;
      const top=ceilY(zc), ry=sx<0 ? Math.PI/2 : -Math.PI/2;
      if(Math.abs(zc)<EWH){
        m.P("roomwall", planeGeo(z1-z0, EWY0-FY, 2.2), sx*(IX1-0.02), FY+(EWY0-FY)/2, zc,
            ry, WOOD, 0, 0);
        m.P("roomwall", planeGeo(z1-z0, top-EWY1, 2.2), sx*(IX1-0.02), EWY1+(top-EWY1)/2, zc,
            ry, WOOD, 0, 0);
      }else{
        m.P("roomwall", planeGeo(z1-z0, top-FY, 2.2), sx*(IX1-0.02), FY+(top-FY)/2, zc,
            ry, WOOD, 0, 0);
      }
    }
  /* Aluminium blinds over two of the four booths, half down and buckled. All
     four had them and the window band read as a fence: half of them are up in
     a stack at the head instead, so there is somewhere to see the desert
     through and somewhere the light is cut. */
  for(let b=0;b<4;b++){
    const bx0=BX0+b*BPITCH;
    if(b%2){
      for(let k=0;k<11;k++)
        m.B("metal", 1.70, 0.030, 0.026, bx0+0.65, GY1-0.09-k*0.068, IZ0+0.07,
            0, ((k*7+b*3)%5-2)*0.014, (k%2)?"#a49c8c":"#9a9284");
      m.C("metal", 0.020,0.020,0.30,6, bx0+1.46, GY1-0.44, IZ0+0.07, "#8e8878",
          0.2,0,0.1);
    }else{
      for(let k=0;k<5;k++)                                  // stacked at the head
        m.B("metal", 1.70, 0.030, 0.030, bx0+0.65, GY1-0.06-k*0.040, IZ0+0.07,
            0, ((k*5+b)%3-1)*0.010, (k%2)?"#a49c8c":"#9a9284");
      m.B("metal", 1.74, 0.05, 0.05, bx0+0.65, GY1-0.02, IZ0+0.07, 0, 0, "#8e8878");
      m.C("metal", 0.006,0.006,0.62,5, bx0+1.46, GY1-0.36, IZ0+0.05, "#8e8878");
    }
  }

  /* ---- the kitchen bulkhead, its pass and the doorway through it ---------- */
  {
    const BKT=0.14;
    // in pieces, so both holes are real holes, and taken up to the barrel in
    // strips or you can see straight over it into the kitchen
    const solid=(z0,z1,y0,y1)=>
      m.B("roomwall", BKT, y1-y0, z1-z0, KX, (y0+y1)/2, (z0+z1)/2, 0.6, 0, BULK);
    const upTo=(z0,z1,y0)=>{
      const N=6;
      for(let k=0;k<N;k++){
        const a=z0+(z1-z0)*(k/N), b2=z0+(z1-z0)*((k+1)/N);
        solid(a, b2, y0, ceilY((a+b2)/2));
      }
    };
    solid(IZ0, KDZ0, FY, FY+2.20);   upTo(IZ0, KDZ0, FY+2.20);
    solid(KDZ0, KDZ1, FY+2.12, FY+2.20); upTo(KDZ0, KDZ1, FY+2.20);   // the door head
    solid(KDZ1, PZ0, FY, FY+2.20);   upTo(KDZ1, PZ0, FY+2.20);
    solid(PZ0, PZ1, FY, FY+1.02);                                     // under the pass
    solid(PZ0, PZ1, FY+1.92, FY+2.20); upTo(PZ0, PZ1, FY+2.20);
    solid(PZ1, IZ1, FY, FY+2.20);    upTo(PZ1, IZ1, FY+2.20);
    m.col(KX-0.12, KX+0.12, IZ0, KDZ0, 0, FY+CH);
    m.col(KX-0.12, KX+0.12, KDZ1, PZ0, 0, FY+CH);
    m.col(KX-0.12, KX+0.12, PZ1, IZ1, 0, FY+CH);
    m.col(KX-0.12, KX+0.12, PZ0, PZ1, 0, FY+1.02);          // under the pass
    m.col(KX-0.12, KX+0.12, PZ0, PZ1, FY+1.92, FY+CH);      // and over it
    m.col(KX-0.12, KX+0.12, KDZ0, KDZ1, FY+2.12, FY+CH);    // the door head
    // the pass: a stainless shelf, a heat lamp bar with no lamps in it, and
    // three checks still on the wheel
    m.B("metal", 0.46, 0.05, PZ1-PZ0+0.10, KX+0.04, FY+1.04, (PZ0+PZ1)/2, 0.4, 0, "#9aa09a");
    rollZ("metal", 0.026, PZ1-PZ0+0.10, KX-0.19, FY+1.06, (PZ0+PZ1)/2, CHR);
    m.B("metal", 0.10, 0.09, PZ1-PZ0-0.06, KX+0.02, FY+1.84, (PZ0+PZ1)/2, 0.4, 0, "#6e746f");
    for(let i=0;i<3;i++)
      m.C("glass", 0.038,0.038,0.13,10, KX+0.02, FY+1.75, PZ0+0.32+i*0.34, "#3b3128");
    m.C("metal", 0.012,0.012,0.30,6, KX+0.06, FY+1.60, PZ1-0.14, CHRD);
    for(let i=0;i<4;i++)
      m.P("paper", planeGeo(0.09,0.13,0), KX+0.07, FY+1.48-i*0.03,
          PZ1-0.14+((i%2)?0.03:-0.03), 0, "#cfc6ae", 0, 0.2+i*0.3);
    /* The swing door itself, and a real one: it was a slab of geometry stuck
       at a fixed angle, so the one door in the building you would actually
       push was the one that could not move. XF at +pi/2 sends the leaf's own
       +x down the bulkhead in -z, so hinging it at KDZ1 swings it across the
       opening toward KDZ0. */
    makeDoor(XF(D.x+KX, D.z+KDZ1, Math.PI/2), 0, m.y+FY, 0,
             "THE KITCHEN", true, 0.30, "swing");
    /* THE JAMBS OVERLAP THE BULKHEAD, they do not butt onto it. At 0.06
       thick and offset 0.03 their outer face landed EXACTLY on the plane
       where the bulkhead's run ends — two surfaces on one plane, which is
       the flicker you see down both sides of this doorway. Interpenetration
       is free; sharing a plane is what costs you. Same for the head. */
    for(const q of [-1,1])                       // the jamb it hangs on
      m.B("metal", 0.20, 2.10, 0.11, KX, FY+1.05, (q>0?KDZ1+0.015:KDZ0-0.015), 0.4, 0,
          "#8a908a");
    m.B("metal", 0.20, 0.11, KDZ1-KDZ0+0.12, KX, FY+2.105, (KDZ0+KDZ1)/2, 0.4, 0, "#8a908a");
    // what hangs on a bulkhead: the punch clock, the rack the cards went in,
    // an extinguisher on its bracket and a calendar nobody turned over
    /* KDZ1 is the doorway's NEAR edge, not a piece of wall: KDZ1-0.55 and
       KDZ1-0.90 are both inside the opening, so the punch clock, the card
       rack and the extinguisher were all screwed to thin air in the middle
       of the doorway. They go on the wall EAST of it, between the door and
       the pass, which is the only solid bulkhead on this side. */
    const BFX=KX+0.08, BW1=KDZ1+0.30, BW2=KDZ1+0.86;
    m.B("bin", 0.06, 0.34, 0.26, BFX, FY+1.58, BW1, 0.4, 0, "#4a4f4b");
    m.C("clockface", 0.085,0.085,0.02,16, BFX+0.04, FY+1.66, BW1, "#b8b2a0",
        0, 0, Math.PI/2);
    m.B("metal", 0.05, 0.16, 0.30, BFX, FY+1.28, BW1, 0.4, 0, "#8a908a");
    for(let i=0;i<6;i++)
      m.P("paper", planeGeo(0.05,0.12,0), BFX+0.03, FY+1.30, BW1-0.13+i*0.05,
          -Math.PI/2, "#cfc6ae", 0, 0.06*((i%3)-1));
    m.C("bin", 0.075,0.075,0.44,14, BFX+0.09, FY+1.02, BW2, "#8e3a26");
    m.C("metal", 0.035,0.035,0.10,10, BFX+0.09, FY+1.28, BW2, CHRX);
    m.B("metal", 0.10, 0.03, 0.13, BFX+0.04, FY+0.94, BW2, 0, 0, "#5f655f");
    m.B("metal", 0.03, 0.05, 0.19, BFX+0.02, FY+1.14, BW2, 0.4, 0, "#5f655f");   // and the strap
    for(const q of [-1,1])                                      // screwed to the wall
      m.C("metal", 0.008,0.008,0.03,6, BFX+0.01, FY+1.14, BW2+q*0.085, CHRX,
          0, 0, Math.PI/2);
    m.P("rust", streakGeo(0.09, 0.26, 0), BFX+0.015, FY+0.80, BW2, -Math.PI/2,
        "#6b5a45", 0, 0);                                       // and weeping below it
    m.P("paper", planeGeo(0.26, 0.36, 0), BFX+0.02, FY+1.52, PZ1+0.22, -Math.PI/2,
        "#cbc3ac", 0, 0.05);
    m.P("bin", planeGeo(0.26, 0.09, 0), BFX+0.03, FY+1.67, PZ1+0.22, -Math.PI/2,
        "#7a3a2e", 0, 0.05);
  }

  /* ---- the counter -------------------------------------------------------
     A diner counter is five things stacked: a recessed kick, a tiled front, a
     chrome band, a laminate top with a bullnose on the customers' side, and a
     back rail. Everything else in the room takes its height from it. */
  {
    const w=CX1-CX0, cx=(CX0+CX1)/2;
    m.B("metal", w, 0.13, CBZ1-CBZ0-0.10, cx, FY+0.065, (CBZ0+CBZ1)/2, 0.4, 0, "#6c726c");
    for(let i=0;i<4;i++)                            // fluted kick plate
      m.B("metal", w, 0.030, CBZ1-CBZ0, cx, FY+0.035+i*0.035, CBZ0-0.012, 0.4, 0,
          i%2?"#9aa09a":"#848a84");
    m.B("dinertile", w, CY-FY-0.24, CBZ1-CBZ0, cx, FY+0.13+(CY-FY-0.24)/2,
        (CBZ0+CBZ1)/2, 1.9, 0, "#ffffff");           // the checkerboard front
    m.B("metal", w+0.02, 0.055, CBZ1-CBZ0+0.02, cx, CY-0.085, (CBZ0+CBZ1)/2, 0.4, 0, CHRD);
    m.B("lino", w+0.10, 0.055, CTZ1-CTZ0, cx, CY, (CTZ0+CTZ1)/2, 0.9, 0, LAM);
    rollX("metal", 0.034, w+0.10, cx, CY+0.003, CTZ0, CHR);   // the nose
    rollX("metal", 0.022, w+0.10, cx, CY+0.010, CTZ1, CHRD);
    for(const sx of [-1,1]){
      ball("metal", 0.034, cx+sx*(w+0.10)/2, CY+0.003, CTZ0, CHR);
      rollZ("metal", 0.034, CTZ1-CTZ0, cx+sx*(w+0.10)/2, CY+0.003, (CTZ0+CTZ1)/2, CHR);
    }
    m.col(CX0-0.05, CX1+0.05, CTZ0-0.04, CTZ1+0.04, 0, CY);
    // the service side: drawers, a lowerator well, and the undershelf
    for(let i=0;i<6;i++){
      const dx0=CX0+0.35+i*1.26;
      if(dx0+0.9>CX1) break;
      m.B("metal", 0.88, 0.22, 0.04, dx0+0.45, CY-0.22, CBZ1+0.01, 0.4, 0, "#8a908a");
      m.C("metal", 0.016,0.016,0.30,8, dx0+0.45, CY-0.22, CBZ1+0.04, CHRD, 0,0,Math.PI/2);
    }
    m.B("metal", w-0.4, 0.04, 0.46, cx, FY+0.52, CBZ1-0.26, 0.4, 0, "#7d837e");
    m.C("metal", 0.20,0.20,0.34,16, CX0+1.30, FY+0.70, CBZ1-0.22, "#6e746f");
    for(let i=0;i<8;i++)                             // plates down in the well
      m.C("plaster", 0.155,0.155,0.02,16, CX0+1.30, FY+0.88+i*0.022, CBZ1-0.22, "#c2b9a2");
    for(let i=0;i<5;i++)                             // a stack of trays
      m.B("bin", 0.40,0.025,0.30, CX1-0.70, FY+0.55+i*0.028, CBZ1-0.20, 0.4, 0, "#5c6258");
  }

  /* ---- the back bar ------------------------------------------------------ */
  {
    const w=CX1-KX-0.30, cx=(KX+CX1)/2+0.15, bz=(BBZ0+IZ1)/2;
    m.B("metal", w, 0.12, 0.38, cx, FY+0.06, bz, 0.4, 0, "#6c726c");
    m.B("metal", w, 0.74, IZ1-BBZ0, cx, FY+0.49, bz, 0.45, 0, "#7d837e");
    for(let i=0;i<7;i++){                            // sliding doors, two off
      const px=KX+0.35+i*(w-0.4)/7;
      if(px+0.5>CX1) break;
      m.B("bin", 0.48, 0.60, 0.03, px+0.24, FY+0.50, BBZ0-0.02, 0, 0,
          (i===2)?"#3d423d":"#565c56");
      m.B("metal", 0.30, 0.03, 0.03, px+0.24, FY+0.74, BBZ0-0.04, 0, 0, CHRD);
    }
    m.B("lino", w+0.06, 0.05, IZ1-BBZ0+0.06, cx, FY+0.88, bz-0.02, 0.9, 0, LAMD);
    rollX("metal", 0.024, w+0.06, cx, FY+0.888, BBZ0-0.03, CHRD);
    m.col(KX+0.10, CX1+0.05, BBZ0-0.06, IZ1, 0, FY+0.90);
    // two shelves on the quilted panel, and what is left standing on them
    for(let k=0;k<2;k++){
      m.B("metal", w-0.5, 0.035, 0.22, cx, FY+1.54+k*0.44, IZ1-0.14, 0.4, 0, "#8a908a");
      for(const sx of [-1,1])
        m.C("metal", 0.016,0.016,0.20,6, cx+sx*(w-0.6)/2, FY+1.44+k*0.44, IZ1-0.14, CHRD);
    }
    for(let i=0;i<22;i++){
      const px=KX+0.55+((i*1.37)%(w-0.9)), sy=FY+1.60+((i%2)?0.44:0);
      if(r2()<0.18) continue;                        // where a row went over
      if(i%3===0){ const g=blobGeo(0.075); g.scale(1, 0.55, 1);
        m.P("plaster", g, px, sy+0.02, IZ1-0.14, i, "#a99f88", 0, 0); }
      else for(let k=0;k<3+((i*5)%4);k++)            // stacked plates
        m.C("plaster", 0.088,0.088,0.016,14, px, sy+0.012+k*0.018, IZ1-0.14, "#bfb6a0");
    }
    // the twin coffee urns: the one thing on a diner back bar you see first
    for(const q of [0,1]){
      const ux=KX+0.95+q*0.58;
      m.C("metal", 0.155,0.175,0.60,18, ux, FY+1.20, BBZ0+0.04, q?CHRD:"#a7ada6");
      m.C("metal", 0.150,0.160,0.05,18, ux, FY+1.52, BBZ0+0.04, CHR);
      m.C("metal", 0.115,0.075,0.09,16, ux, FY+1.57, BBZ0+0.04, CHR);
      m.C("metal", 0.030,0.030,0.05,10, ux, FY+1.63, BBZ0+0.04, CHRX);
      m.C("metal", 0.020,0.020,0.12,8, ux-0.16, FY+0.99, BBZ0-0.08, CHRD, 0.5,0,0);
      m.B("metal", 0.05,0.04,0.05, ux-0.16, FY+1.05, BBZ0-0.11, 0,0, CHRX);
      m.C("glass", 0.014,0.014,0.34,8, ux+0.15, FY+1.14, BBZ0-0.06, "#4a4034");
    }
    // the milkshake mixer, three spindles, seized
    m.B("metal", 0.46,0.09,0.20, KX+2.30, FY+0.96, BBZ0+0.06, 0.4, 0, CHRD);
    for(let i=0;i<3;i++){
      m.C("metal", 0.026,0.026,0.44,10, KX+2.14+i*0.16, FY+1.22, BBZ0+0.06, CHRD);
      m.B("metal", 0.10,0.13,0.10, KX+2.14+i*0.16, FY+1.48, BBZ0+0.06, 0.4, 0, "#8a908a");
      if(i!==1) m.C("metal", 0.048,0.038,0.17,12, KX+2.14+i*0.16, FY+1.08, BBZ0+0.06,
                    "#a7ada6");
    }
    // a pie case, three shelves, the glass gone from one side
    {
      const px=KX+3.45;
      m.B("metal", 0.52,0.05,0.42, px, FY+0.93, BBZ0+0.04, 0.4, 0, CHRD);
      m.B("glass", 0.02,0.52,0.42, px-0.26, FY+1.21, BBZ0+0.04, 0, 0, "#6a7a78");
      m.B("glass", 0.52,0.52,0.02, px, FY+1.21, BBZ0-0.16, 0, 0, "#5f6f70");
      m.B("metal", 0.56,0.05,0.46, px, FY+1.50, BBZ0+0.04, 0.4, 0, CHRD);
      for(let k=0;k<2;k++)
        m.C("glass", 0.22,0.22,0.02,18, px, FY+1.04+k*0.24, BBZ0+0.04, "#8a9a94");
      m.C("plaster", 0.10,0.10,0.035,14, px-0.08, FY+1.30, BBZ0+0.02, "#a1917a");
    }
    // the register, up at the door end where you pay on the way out
    {
      const px=CX1-0.56;
      m.B("metal", 0.44,0.14,0.40, px, CY+0.10, CTZ1-0.26, 0.4, 0, "#5f676b");
      m.B("metal", 0.40,0.30,0.34, px, CY+0.32, CTZ1-0.24, 0.4, 0, "#6d7579");
      m.B("bin", 0.30,0.14,0.02, px, CY+0.50, CTZ1-0.42, 0, 0, "#20262a");
      for(let r=0;r<3;r++) for(let k=0;k<5;k++)
        m.C("bell", 0.017,0.017,0.02,8, px-0.13+k*0.065, CY+0.205, CTZ1-0.30+r*0.05,
            "#b9b2a0");
      m.B("metal", 0.34,0.05,0.03, px, CY+0.19, CTZ1-0.44, 0, 0, CHRD);   // the drawer, out
      m.C("bell", 0.035,0.035,0.03,12, px+0.30, CY+0.045, CTZ1-0.30, "#9a9484");
    }
    // a menu board over the pass, and a boomerang clock stopped at ten past
    m.P("bin", planeGeo(2.10, 0.78, 0), KX+1.45, GY1+0.30, IZ1-0.06, Math.PI,
        "#23282a", 0, 0.03);
    m.B("metal", 2.16, 0.04, 0.05, KX+1.45, GY1+0.70, IZ1-0.08, 0.4, 0, CHRD);
    for(let i=0;i<6;i++)
      m.P("chalk", planeGeo(1.50-((i*5)%3)*0.32, 0.055, 0), KX+1.36, GY1+0.58-i*0.105,
          IZ1-0.08, Math.PI, "#cfc8b4", 0, 0.03);
    m.P("bin", planeGeo(0.96, 0.32, 0), KX+4.30, GY1+0.34, IZ1-0.05, Math.PI,
        "#4a3f33", 0, 0.20);
    m.C("bin", 0.18,0.18,0.06,18, KX+4.30, GY1+0.36, IZ1-0.08, "#2b3230", 0, 0, Math.PI/2);
    m.C("clockface", 0.150,0.150,0.03,18, KX+4.30, GY1+0.36, IZ1-0.11, "#b8b2a0",
        0, 0, Math.PI/2);
    for(const a of [0.9, 3.9])                       // the hands, stopped
      m.P("bin", planeGeo(0.012, 0.11, 0), KX+4.30+Math.sin(a)*0.045,
          GY1+0.36+Math.cos(a)*0.045, IZ1-0.125, 0, "#2b3230", 0, -a);
    // grease and smoke up the wall over the urns, rust down the back bar
    m.P("grease", planeGeo(2.4, 1.10, 0), KX+1.7, GY1+0.10, IZ1-0.035, Math.PI,
        "#5a4f3e", 0, 0);
    for(let i=0;i<9;i++)
      m.P("rust", streakGeo(0.10+r2()*0.08, 0.28+r2()*0.30, 0), KX+0.4+r2()*(w-0.6),
          FY+0.70, BBZ0-0.07, Math.PI, "#7c4526", 0, 0);
  }

  /* ---- the stools --------------------------------------------------------
     Cast base, tapered chrome column, a foot ring on three brackets, the
     swivel sleeve, and a buttoned pad with a rolled rim on top of it. Two are
     down to the floor flange, one is over on its side, and two have had the
     vinyl out of them. */
  {
    const stool=(px, state)=>{
      // the flange is bolted down and stays whatever else went
      m.C("metal", 0.21,0.215,0.030,16, px, FY+0.027, SZ, "#5f655f");
      for(let i=0;i<4;i++)
        m.C("metal", 0.020,0.020,0.016,6, px+Math.cos(i*1.571)*0.155, FY+0.048,
            SZ+Math.sin(i*1.571)*0.155, "#4e544e");
      if(state==="gone"){
        m.P("rust", streakGeo(0.44,0.44,0), px, FY+0.045, SZ, 0, "#7c4526", -Math.PI/2, 0);
        return;
      }
      if(state==="over"){                        // the whole column on the floor
        const a=0.55;
        m.P("metal", new T.CylinderGeometry(0.050,0.062,0.66,10), px+0.34, FY+0.10,
            SZ-0.36, a, CHRD, Math.PI/2, 0);
        m.P("metal", new T.TorusGeometry(0.195,0.016,6,16), px+0.16, FY+0.10, SZ-0.22,
            a, CHRD, 0, Math.PI/2);
        m.P("fabric", new T.CylinderGeometry(0.205,0.205,0.10,18), px+0.62, FY+0.11,
            SZ-0.55, a, VIND, Math.PI/2, 0);
        m.P("metal", new T.CylinderGeometry(0.212,0.212,0.026,18), px+0.68, FY+0.11,
            SZ-0.58, a, CHRD, Math.PI/2, 0);
        return;
      }
      m.C("metal", 0.150,0.185,0.055,16, px, FY+0.068, SZ, "#6b716b");     // the boss
      m.C("metal", 0.056,0.070,0.40,12, px, FY+0.26, SZ, CHRD);            // the column
      m.P("metal", new T.TorusGeometry(0.195,0.016,6,16), px, FY+0.235, SZ, 0,
          CHRD, Math.PI/2, 0);                                             // the foot ring
      for(let i=0;i<3;i++)
        m.C("metal", 0.011,0.011,0.14,6, px+Math.cos(i*2.094)*0.10, FY+0.235,
            SZ+Math.sin(i*2.094)*0.10, CHRD, 0, -i*2.094, Math.PI/2);
      m.C("metal", 0.047,0.047,0.30,10, px, FY+0.56, SZ, CHR);             // the spindle
      m.C("metal", 0.064,0.064,0.10,12, px, FY+0.64, SZ, CHRD);            // the swivel
      m.C("metal", 0.214,0.214,0.026,18, px, FY+0.695, SZ, CHR);           // the seat plate
      if(state==="torn"){
        m.C("bin", 0.198,0.198,0.030,18, px, FY+0.722, SZ, "#4b4a44");     // the pan
        const g=blobGeo(0.155); g.scale(1.15, 0.42, 1.05);
        m.P("fabric", g, px, FY+0.752, SZ, 0.6, FOAM, 0, 0);               // the foam
        for(let i=0;i<5;i++)                                               // torn flaps
          m.P("fabric", planeGeo(0.09+r2()*0.09, 0.13+r2()*0.10, 0),
              px+Math.cos(i*1.257)*0.17, FY+0.76, SZ+Math.sin(i*1.257)*0.17,
              -i*1.257, VINX, -0.9, 0);
        return;
      }
      const col=(state==="dark")?VIND:VIN;
      m.C("fabric", 0.196,0.206,0.085,18, px, FY+0.756, SZ, col);
      { const g=new T.SphereGeometry(0.200,16,8); g.scale(1,0.30,1);       // the crown
        m.P("fabric", g, px, FY+0.782, SZ, 0, col, 0, 0); }
      m.P("fabric", new T.TorusGeometry(0.180,0.036,7,18), px, FY+0.788, SZ, 0,
          col, Math.PI/2, 0);                                              // the rolled rim
      for(let i=0;i<8;i++)                                                 // the pleats
        m.P("fabric", boxGeo(0.014,0.012,0.16,0), px+Math.cos(i*0.785)*0.10, FY+0.800,
            SZ+Math.sin(i*0.785)*0.10, -i*0.785, VINX, 0, 0);
      ball("fabric", 0.024, px, FY+0.812, SZ, VINX);                       // the button
      addSeat(m.wx(px,SZ), m.wz(px,SZ), m.y+FY+0.74, Math.PI, "THE COUNTER");
    };
    const N=12, step=(CX1-CX0-0.70)/(N-1);
    const STATE=["","dark","gone","","torn","","over","","dark","torn","","gone"];
    for(let i=0;i<N;i++) stool(CX0+0.35+i*step, STATE[i]);
  }

  /* ---- the booths --------------------------------------------------------
     Four of them down the window side on a 1.90 m pitch, backs to the window
     wall and to each other. Each bench is a plinth, a squab with a rolled
     nose, a channelled back and an aluminium cap rail over the top; the table
     between them is laminate on a cast pedestal with a chrome band round the
     edge. */
  {
    // off the wall by 0.22, not 0.06 — clear of the window ledge above it,
    // and a booth that is not jammed into the panelling
    const BZ0=IZ0+0.22, BL=1.16, BZC=BZ0+BL/2+0.02;
    for(let b=0;b<4;b++){
      const bx0=BX0+b*BPITCH;                          // west bench centre line
      const gone=(b===2), split=(b===1);
      for(const q of [0,1]){
        const px=bx0+q*1.30;
        const col=(b%2)?VIN:VIND;
        m.B("bin", 0.56, 0.16, BL-0.04, px, FY+0.08, BZC, 0.4, 0, "#33383a");
        m.B("metal", 0.58, 0.035, BL, px, FY+0.175, BZC, 0.4, 0, CHRX);
        if(gone && q===1){                             // the squab somebody took
          m.B("plank", 0.54, 0.05, BL-0.06, px, FY+0.21, BZC, 0.6, 0, "#6b5c44");
          for(let i=0;i<3;i++)
            m.C("metal", 0.06,0.06,0.02,10, px-0.16+i*0.16, FY+0.245, BZC+0.2, "#6e6a60");
        }else{
          /* Channel tufting runs FRONT TO BACK across a bench seat, and it is
             a row of padded bolsters with a stitch pulled down between them —
             not a set of rods laid across the cushion, which is what the
             first cut of this put there and which read as a cattle grid. */
          m.B("fabric", 0.56, 0.20, BL, px, FY+0.315, BZC, 0.6, 0, col);
          for(let k=0;k<5;k++)
            rollX("fabric", 0.058, 0.56, px, FY+0.437, BZC-BL/2+0.116+k*0.232, col);
          for(let k=0;k<4;k++)
            m.P("fabric", planeGeo(0.56,0.016,0), px, FY+0.452,
                BZC-BL/2+0.232+k*0.232, 0, VINX, -Math.PI/2, 0);
          // the nose is the edge your knees go over, on the table side
          rollZ("fabric", 0.115, BL, px+(q?-0.28:0.28), FY+0.345, BZC, col);
          rollX("fabric", 0.100, 0.56, px, FY+0.350, BZC+BL/2, col);   // the aisle end
          if(split && q===0){                                          // and one split
            m.P("fabric", planeGeo(0.34,0.10,0), px, FY+0.500, BZC+0.10, 0, "#2f2622",
                -Math.PI/2, 0);
            const g=blobGeo(0.10); g.scale(1.5,0.5,0.7);
            m.P("fabric", g, px, FY+0.515, BZC+0.10, 0.4, FOAM, 0, 0);
          }
          addSeat(m.wx(px,BZC), m.wz(px,BZC), m.y+FY+0.50, q?Math.PI/2:-Math.PI/2,
                  "A BOOTH");
        }
        // the back: a channelled panel with buttons pulled into it
        m.B("fabric", 0.15, 0.74, BL, px+(q?0.21:-0.21), FY+0.82, BZC, 0.6, 0, col);
        rollZ("fabric", 0.075, BL, px+(q?0.21:-0.21), FY+1.19, BZC, col);
        for(let k=0;k<5;k++)                                 // the same channels, upright
          m.C("fabric", 0.050,0.050,0.70,10, px+(q?0.09:-0.09), FY+0.83,
              BZC-BL/2+0.116+k*0.232, col);
        for(let k=0;k<4;k++)
          m.P("fabric", planeGeo(0.016,0.70,0), px+(q?0.075:-0.075), FY+0.83,
              BZC-BL/2+0.232+k*0.232, q?-Math.PI/2:Math.PI/2, VINX, 0, 0);
        for(let r=0;r<2;r++) for(let k=0;k<2;k++)            // buttons pulled into it
          ball("fabric", 0.021, px+(q?0.075:-0.075), FY+0.70+r*0.30,
               BZC-0.23+k*0.46, VINX);
        // the aluminium cap rail, and the end cap where you walk past it
        m.B("metal", 0.24, 0.05, BL+0.06, px+(q?0.21:-0.21), FY+1.245, BZC, 0.4, 0,
            "#9aa09a");
        rollZ("metal", 0.026, BL+0.06, px+(q?0.32:-0.32), FY+1.252, BZC, CHRD);
        rollX("metal", 0.026, 0.24, px+(q?0.21:-0.21), FY+1.252, BZC-BL/2-0.03, CHRD);
        ball("metal", 0.026, px+(q?0.32:-0.32), FY+1.252, BZC-BL/2-0.03, CHRD);
        // a coat hook on the aisle end of each divider
        m.C("metal", 0.012,0.012,0.05,6, px+(q?0.30:-0.30), FY+1.06, BZC-BL/2+0.06,
            CHRD, 0,0,Math.PI/2);
        m.C("metal", 0.010,0.010,0.05,6, px+(q?0.33:-0.33), FY+1.03, BZC-BL/2+0.06, CHRD);
        m.col(px-0.30, px+0.30, BZC-BL/2-0.06, BZC+BL/2+0.06, 0, FY+1.24);
      }
      // the table
      const tx=bx0+0.65, tz=BZC-0.04, TW=0.74, TD=BL+0.06;
      if(b===3){                                        // one off its pedestal
        // resting on the bench it fell against, not floating over the floor
        m.P("lino", boxGeo(TW, 0.045, TD, 0.9), tx+0.06, FY+0.52, tz-0.16,
            0.08, LAM, 0.62, 0.05);
        bullnose("metal", TW, TD, tx+0.06, FY+0.52, tz-0.16, 0.024, CHRD);
        m.C("metal", 0.075,0.135,0.44,12, tx, FY+0.24, tz, "#4a4440");   // the stump
        m.C("metal", 0.25,0.27,0.035,14, tx, FY+0.035, tz, "#4a4440");
        for(let k=0;k<4;k++)                            // and what was on it
          m.C("plaster", 0.045,0.038,0.09,12, tx-0.2+k*0.16, FY+0.06, tz+0.36+((k%2)*0.1),
              "#c6bda6", 1.3, k*1.1, 0);
      }else{
        m.B("lino", TW, 0.045, TD, tx, FY+0.745, tz, 0.9, 0, LAM);
        bullnose("metal", TW, TD, tx, FY+0.745, tz, 0.024, CHR);
        m.C("metal", 0.075,0.135,0.70,12, tx, FY+0.37, tz, "#4a4440");
        m.C("metal", 0.25,0.27,0.035,14, tx, FY+0.035, tz, "#4a4440");
        m.col(tx-TW/2, tx+TW/2, tz-TD/2, tz+TD/2, 0, FY+0.77);
        // what lives on a booth table and never moves
        if(b!==1){
          m.B("metal", 0.115,0.155,0.095, tx-0.20, FY+0.815, tz+0.30, 0.4, 0, "#a7ada6");
          m.P("paper", planeGeo(0.085,0.075,0), tx-0.20, FY+0.826, tz+0.245, 0,
              "#cfc6ae", 0, 0);
        }
        if(b!==2){
          m.C("glass", 0.050,0.045,0.105,12, tx+0.02, FY+0.820, tz+0.30, "#cfc6b0");
          m.C("metal", 0.048,0.042,0.022,12, tx+0.02, FY+0.884, tz+0.30, CHRD);
        }
        for(const q of [-1,1])
          m.C("glass", 0.021,0.024,0.075,8, tx+0.18+q*0.05, FY+0.805, tz+0.30,
              q>0?"#e8e2cf":"#3a332e");
        if(b===0){
          m.C("glass", 0.036,0.030,0.22,10, tx+0.22, FY+0.878, tz-0.24, "#6a2a1e");
          m.C("bin", 0.022,0.022,0.028,10, tx+0.22, FY+0.998, tz-0.24, "#9a9484");
        }
        if(b===2)
          m.P("bin", new T.CylinderGeometry(0.062,0.052,0.028,12), tx-0.14, FY+0.782,
              tz-0.26, 0, "#5a5048");
        m.P("paper", planeGeo(0.17,0.24,0), tx-0.08, FY+0.772, tz-0.10, 1.1,
            "#cbc3ac", -Math.PI/2, 0);
      }
    }
  }

  /* ---- the wall boxes on the window ledge ---------------------------------
     A chrome selector at every booth, wired back to a jukebox that is not
     there any more. Four pages of titles behind the glass, a coin slot and
     the flipper knob. */
  for(let b=0;b<4;b++){
    const wx2=BX0+b*BPITCH+0.65, wz=IZ0+0.17, wy=GY0+0.15;
    m.B("metal", 0.30, 0.20, 0.14, wx2, wy, wz, 0.4, 0, (b===2)?"#7d837e":CHR);
    m.B("metal", 0.34, 0.04, 0.17, wx2, wy+0.11, wz, 0.4, 0, CHRD);
    m.B("metal", 0.34, 0.04, 0.17, wx2, wy-0.11, wz, 0.4, 0, CHRD);
    if(b!==2){
      m.B("tvglass", 0.22, 0.13, 0.02, wx2, wy+0.01, wz-0.08, 0, 0, "#1b2220");
      for(let k=0;k<5;k++)                       // the titles, behind the glass
        m.P("paper", planeGeo(0.18, 0.012, 0), wx2, wy+0.05-k*0.022, wz-0.09, 0,
            "#cfc6ae", 0, 0);
      m.C("metal", 0.022,0.022,0.04,10, wx2+0.11, wy-0.05, wz-0.08, CHRD, Math.PI/2,0,0);
      m.B("metal", 0.03, 0.012, 0.03, wx2-0.10, wy+0.07, wz-0.09, 0, 0, "#3a3f3c");
    }else{                                       // this one has been prised open
      m.P("metal", boxGeo(0.22,0.13,0.02,0.4), wx2, wy+0.02, wz-0.11, 0.2, CHRD,
          0.5, 0.1);
      m.B("bin", 0.20, 0.11, 0.02, wx2, wy+0.01, wz-0.06, 0, 0, "#20262a");
    }
  }

  /* ---- the entry bay, east of the counter --------------------------------
     Everything in here stands clear of the lane through the door: x from 4.88
     to 6.12 is what you walk in along, and the door probe walks it. */
  {
    /* The north wall east of the counter was bare shell, and it is the first
       thing you see when you come through the door — so it gets the things
       that hang by a till: a mirror strip, the licences, a hat rail. */
    {
      const wz2=IZ1-0.03, x0=CX1+0.24, x1=IX1-0.90, cxm=(x0+x1)/2;
      m.P("mirror", planeGeo(x1-x0, 0.86, 0), cxm, GY0+0.34, wz2, Math.PI,
          "#b6c6cc", 0, 0);
      for(const q of [GY0-0.10, GY0+0.78])
        m.B("metal", x1-x0+0.08, 0.05, 0.06, cxm, q, wz2-0.02, 0.4, 0, CHRD);
      for(const q of [-1,1])
        m.B("metal", 0.05, 0.92, 0.06, cxm+q*((x1-x0)/2+0.02), GY0+0.34, wz2-0.02,
            0.4, 0, CHRD);
      for(let i=0;i<9;i++)                       // the silvering gone at the edges
        m.P("rust", streakGeo(0.10+r2()*0.14, 0.10+r2()*0.20, 0), x0+r2()*(x1-x0),
            GY0-0.06+r2()*0.86, wz2-0.035, Math.PI, "#6b6255", 0, 0);
      m.B("oak", x1-x0, 0.05, 0.14, cxm, GY1+0.28, wz2-0.05, 0.5, 0, "#5c4a30");
      for(let i=0;i<5;i++)                       // hooks under the hat rail
        m.C("metal", 0.010,0.010,0.07,6, x0+0.22+i*((x1-x0)-0.44)/4, GY1+0.22,
            wz2-0.06, CHRD);
      for(const q of [[0.30,0.38],[0.70,0.30]]){ // the licences, in cheap frames
        const fx=x0+(x1-x0)*q[0];
        m.P("oak", planeGeo(q[1], q[1]*1.28, 0), fx, GY1+0.74, wz2, Math.PI,
            "#4a3d2c", 0, (q[0]<0.5?0.03:-0.04));
        m.P("paper", planeGeo(q[1]*0.86, q[1]*1.10, 0), fx, GY1+0.74, wz2-0.012,
            Math.PI, "#cfc6ae", 0, (q[0]<0.5?0.03:-0.04));
      }
    }
    // a cigarette machine in the far corner, pulled off the wall and emptied
    m.B("bin", 0.62, 1.42, 0.44, IX1-0.42, FY+0.71, IZ1-0.36, 0.45, 0, "#4a4f4b");
    m.B("metal", 0.64, 0.10, 0.46, IX1-0.42, FY+1.44, IZ1-0.36, 0.4, 0, CHRD);
    m.B("tvglass", 0.52, 0.60, 0.03, IX1-0.42, FY+0.98, IZ1-0.58, 0, 0, "#20282a");
    for(let i=0;i<7;i++)
      m.C("metal", 0.018,0.018,0.10,8, IX1-0.68+i*0.085, FY+0.60, IZ1-0.58, CHRD);
    m.col(IX1-0.75, IX1-0.09, IZ1-0.60, IZ1, 0, FY+1.44);
    // the pay phone, handset hanging
    m.B("bin", 0.30, 0.56, 0.20, IX1-0.20, FY+1.50, 0.55, 0.4, 0, "#2f3a38");
    m.B("metal", 0.26, 0.10, 0.18, IX1-0.20, FY+1.80, 0.55, 0.4, 0, CHRD);
    m.C("bin", 0.035,0.035,0.24,10, IX1-0.30, FY+1.00, 0.43, "#22262a", 0.3, 0, 0.2);
    m.C("metal", 0.008,0.008,0.62,5, IX1-0.30, FY+1.24, 0.49, "#3a3f3c", 0.5, 0, 0.1);
    for(let i=0;i<5;i++)                             // the numbers somebody wrote up
      m.P("paper", planeGeo(0.07,0.04,0), IX1-0.032, FY+1.74-i*0.07, 0.22+((i%2)*0.06),
          -Math.PI/2, "#c9c1aa", 0, 0.1);
    // a coat rack with one wire hanger on it
    m.C("metal", 0.030,0.036,1.58,10, IX1-0.40, FY+0.79, -1.60, CHRX);
    m.C("metal", 0.30,0.30,0.03,14, IX1-0.40, FY+0.02, -1.60, "#5f655f");
    for(let i=0;i<4;i++)
      m.C("metal", 0.013,0.013,0.16,6, IX1-0.40+Math.cos(i*1.571)*0.09, FY+1.52,
          -1.60+Math.sin(i*1.571)*0.09, CHRD, 0, -i*1.571, 1.1);
    m.P("metal", new T.TorusGeometry(0.075,0.006,5,14), IX1-0.48, FY+1.42, -1.54,
        0.4, "#8e948e", 0.2, 0);
    /* Everything here lives EAST of the lane through the door, which runs
       from 4.88 to 6.12. The bin stood at 4.50 — inside the last booth's
       bench — and the paper rack at 6.85 was in the corner the coat rack
       wanted. */
    m.B("bin", 0.40, 0.52, 0.34, 6.60, FY+0.28, IZ0+0.32, 0.4, 0, "#46504c");
    m.B("tvglass", 0.34, 0.26, 0.02, 6.60, FY+0.42, IZ0+0.15, 0, 0, "#20282a");
    m.col(6.38, 6.82, IZ0, IZ0+0.52, 0, FY+0.56);
    for(let i=0;i<7;i++)
      m.P("paper", planeGeo(0.22,0.28,0), 6.3+r2()*0.7, FY+0.021+i*0.001,
          IZ0+0.30+r2()*0.7, r2()*6.28, "#c9c1aa", -Math.PI/2, 0);
    // the host's stand, standing off the wall the way one does
    {
      const hx=6.60, hz=-1.05;
      m.B("oak", 0.52, 0.96, 0.42, hx, FY+0.48, hz, 0.5, 0, "#5c4a30");
      m.B("lino", 0.58, 0.05, 0.48, hx, FY+0.97, hz, 0.8, 0, LAMD);
      bullnose("metal", 0.58, 0.48, hx, FY+0.97, hz, 0.018, CHRD);
      m.B("oak", 0.44, 0.03, 0.34, hx, FY+0.62, hz, 0.5, 0, "#4a3d2c");   // the shelf
      for(let k=0;k<7;k++)                                    // the menus on it
        m.P("paper", planeGeo(0.21,0.30,0), hx-0.04+((k%2)*0.03), FY+0.636+k*0.006,
            hz+((k%3)-1)*0.03, 0.2*((k%3)-1), (k%2)?"#c9c1aa":"#bdb49c",
            -Math.PI/2, 0);
      m.P("paper", planeGeo(0.24,0.32,0), hx+0.02, FY+1.001, hz-0.02, 0.18,
          "#cfc6ae", -Math.PI/2, 0);                          // the book, open
      m.C("oak", 0.005,0.005,0.15,5, hx+0.16, FY+1.00, hz+0.10, "#c8a23c",
          1.5, 0.8, 0);                                       // and a pencil
      m.col(hx-0.31, hx+0.31, hz-0.27, hz+0.27, 0, FY+1.00);
      m.P("paper", planeGeo(0.30,0.14,0), hx-0.30, FY+0.74, hz, -Math.PI/2,
          "#cfc6ae", 0, 0.03);                                // PLEASE WAIT
    }
    // and the bin that nobody emptied, over in the corner
    m.C("bin", 0.19,0.16,0.52,14, 7.05, FY+0.26, -0.30, "#4f5a52");
    m.C("metal", 0.20,0.20,0.03,14, 7.05, FY+0.53, -0.30, CHRX);
    m.col(6.84, 7.26, -0.51, -0.09, 0, FY+0.54);
  }

  /* ======================================================================
     THE KITCHEN — through the bulkhead at the west end. You can walk in.
     ====================================================================== */
  {
    const KW0=IX0, KW1=KX-0.08;
    /* 0.016, not 0.013. The main floor is a single sheet of hex tile from
       end to end of the car at 0.012, and this quarry tile was laid a
       millimetre over it across the whole kitchen — sixteen square metres
       of two floors on one plane, which is the worst single case of it in
       the building. Four millimetres clear, and the sheet underneath it
       stops at the bulkhead now rather than running under the whole room. */
    m.P("dinertile", planeGeo(KW1-KW0+0.2, IZ1-IZ0+0.2, 2.6), (KW0+KW1)/2, FY+0.016, 0, 0,
        "#6f6a60", -Math.PI/2, 0);
    for(let i=0;i<11;i++)                           // grease worked into the tile
      m.P("soot", planeGeo(0.7+r2()*0.9, 0.6+r2()*0.8, 0), KW0+0.5+r2()*(KW1-KW0-1.0),
          FY+0.02+i*0.0007, IZ0+0.5+r2()*(IZ1-IZ0-1.0), r2()*6.28, "#3a3228",
          -Math.PI/2, 0);
    m.C("bin", 0.09,0.09,0.02,12, KW0+1.6, FY+0.022, 0.2, "#3f443f");   // the floor drain
    /* The east 1.2 m of the kitchen is kept clear of equipment on BOTH walls,
       because the door is in the east wall's south corner and a player is
       0.68 m across: with a sink on one side and a fryer on the other, the
       lane in from that door came out 16 cm wide and the flood fill reached
       nought square metres of this room. */
    // the cook line down the back wall: range, griddle, hood and flue
    const RX=KW0+1.00;                               // the range's centre
    m.B("metal", 1.90, 0.80, 0.70, RX, FY+0.40, IZ1-0.38, 0.45, 0, "#7d837e");
    m.B("metal", 1.94, 0.06, 0.74, RX, FY+0.83, IZ1-0.38, 0.4, 0, "#9aa09a");
    m.B("bin",   0.86, 0.03, 0.62, RX-0.48, FY+0.865, IZ1-0.38, 0.4, 0, "#3a3733");
    for(let i=0;i<6;i++){                            // burner grates
      const gx=RX+0.20+((i%3)*0.30), gz=IZ1-0.54+(((i/3)|0)*0.32);
      m.C("bin", 0.125,0.125,0.02,6, gx, FY+0.872, gz, "#2f3330");
      m.C("metal", 0.080,0.080,0.03,10, gx, FY+0.845, gz, "#6b716b");
    }
    for(let i=0;i<4;i++)                             // the control knobs
      m.C("bin", 0.030,0.030,0.03,10, RX-0.42+i*0.28, FY+0.70, IZ1-0.74, "#2f3330",
          Math.PI/2, 0, 0);
    m.col(RX-0.97, RX+0.97, IZ1-0.74, IZ1, 0, FY+0.86);
    m.B("metal", 2.20, 0.54, 0.86, RX, FY+1.86, IZ1-0.46, 0.45, 0, "#8d938d");
    m.P("metal", boxGeo(2.20,0.40,0.30,0.45), RX, FY+1.50, IZ1-0.80, 0,
        "#8d938d", 0.72, 0);                          // the hood's sloped lip
    for(let i=0;i<3;i++)
      m.P("bin", boxGeo(0.62,0.34,0.03,0.4), RX-0.66+i*0.66, FY+1.52, IZ1-0.815, 0,
          "#4c5450", 0.72, 0);                        // filters
    m.C("metal", 0.17,0.17,0.90,12, RX, FY+2.50, IZ1-0.46, "#7d837e");
    m.P("grease", planeGeo(2.2,1.0,0), RX, FY+1.30, IZ1-0.03, Math.PI, "#4b4134", 0, 0);
    // the fryer, west of the range and well short of the lobby
    {
      const fx=KW0+2.22;
      m.B("metal", 0.52, 0.80, 0.64, fx, FY+0.40, IZ1-0.40, 0.4, 0, "#7d837e");
      m.B("bin", 0.40, 0.06, 0.48, fx, FY+0.79, IZ1-0.40, 0.4, 0, "#2b2f2c");
      for(const q of [-1,1]){
        m.C("metal", 0.010,0.010,0.34,6, fx+q*0.10, FY+0.94, IZ1-0.62, CHRD, 0.7,0,0);
        m.B("metal", 0.16, 0.14, 0.16, fx+q*0.10, FY+0.86, IZ1-0.40, 0.4, 0, "#8e948e");
      }
      m.col(fx-0.28, fx+0.28, IZ1-0.74, IZ1, 0, FY+0.84);
    }
    // the dish sink and its drainboards, the whole of the window side
    {
      const sx2=KW0+0.88;
      m.B("metal", 1.56, 0.80, 0.68, sx2, FY+0.42, IZ0+0.38, 0.45, 0, "#8a908a");
      m.B("metal", 1.60, 0.05, 0.72, sx2, FY+0.845, IZ0+0.38, 0.4, 0, "#9aa09a");
      for(const q of [-1,1])                          // two bowls, sunk
        m.B("bin", 0.42, 0.03, 0.46, sx2+q*0.30, FY+0.838, IZ0+0.38, 0.4, 0, "#5d635e");
      for(let i=0;i<7;i++)                            // the drainboard's ribs
        m.B("metal", 0.025, 0.02, 0.56, sx2+0.44+i*0.055, FY+0.862, IZ0+0.38, 0, 0, CHRD);
      m.C("metal", 0.020,0.020,0.34,8, sx2, FY+1.02, IZ0+0.12, CHRD);
      m.C("metal", 0.018,0.018,0.26,8, sx2, FY+1.18, IZ0+0.24, CHRD, 1.25, 0, 0);
      m.col(sx2-0.82, sx2+0.82, IZ0, IZ0+0.72, 0, FY+0.86);
      for(let i=0;i<5;i++)                            // pans stacked in the bowl
        m.C("metal", 0.105,0.095,0.04,14, sx2-0.30, FY+0.80+i*0.042, IZ0+0.38,
            (i%2)?"#7d837e":"#6e746f");
    }
    // a prep table standing in the middle, clear of the lane either side
    {
      const px=KW0+1.10, pz=0.35;
      m.B("metal", 1.40, 0.05, 0.70, px, FY+0.86, pz, 0.4, 0, "#9aa09a");
      for(const c of [[-1,-1],[1,-1],[-1,1],[1,1]])
        m.C("metal", 0.024,0.024,0.86,8, px+c[0]*0.62, FY+0.43, pz+c[1]*0.28, CHRD);
      m.B("metal", 1.40, 0.04, 0.58, px, FY+0.20, pz, 0.4, 0, "#8a908a");
      m.col(px-0.72, px+0.72, pz-0.38, pz+0.38, 0, FY+0.88);
      m.P("bin", new T.CylinderGeometry(0.16,0.14,0.10,14), px+0.40, FY+0.93, pz-0.10,
          0.3, "#5d635e");
      m.C("metal", 0.012,0.012,0.30,6, px-0.30, FY+0.90, pz+0.10, CHRD, 1.4, 0.6, 0);
    }
    // wire shelving on the end wall, with pans and a stack of plates
    for(let k=0;k<4;k++){
      m.B("metal", 0.44, 0.03, 2.10, KW0+0.26, FY+0.55+k*0.46, 0.15, 0.4, 0, "#8a908a");
      for(let i=0;i<9;i++)
        m.C("metal", 0.006,0.006,0.44,4, KW0+0.26, FY+0.55+k*0.46, -0.90+i*0.26,
            "#7d837e", 0, 0, Math.PI/2);
    }
    for(const q of [-0.85, 1.15])
      m.C("metal", 0.016,0.016,1.90,8, KW0+0.26, FY+0.96, q, CHRD);
    for(let i=0;i<10;i++){
      const py=FY+0.58+((i%4)*0.46), pz=-0.80+((i*0.47)%1.9);
      if(i%3===0) for(let k=0;k<5;k++)
        m.C("plaster", 0.095,0.095,0.017,14, KW0+0.26, py+0.012+k*0.019, pz, "#bfb6a0");
      else m.C("metal", 0.115,0.100,0.055,14, KW0+0.26, py+0.04, pz,
               (i%2)?"#7d837e":"#6e746f");
    }
    /* A reach-in, not a walk-in. The end wall of a diner car has the desert
       on the other side of it, so a cooler door in it opened onto nothing —
       and it could not be made to work either, because the lane a door probe
       walks would have run straight into the shell. A cabinet standing
       against the wall is the thing that was actually in these. */
    {
      const rx2=KW0+0.42, rz2=IZ1-1.05;
      m.B("metal", 0.80, 1.94, 1.10, rx2, FY+0.97, rz2, 0.45, 0, "#9aa09a");
      m.B("metal", 0.84, 0.08, 1.14, rx2, FY+1.97, rz2, 0.4, 0, "#8a908a");
      m.B("bin",   0.03, 1.66, 0.94, rx2+0.40, FY+0.92, rz2, 0, 0, "#3a423e");
      m.B("tvglass",0.02, 1.42, 0.78, rx2+0.42, FY+0.98, rz2, 0, 0, "#1d2724");
      for(let k=0;k<3;k++)                          // what is left on the shelves
        m.B("metal", 0.02, 0.02, 0.74, rx2+0.41, FY+0.54+k*0.42, rz2, 0, 0, "#6e746f");
      m.C("metal", 0.022,0.022,0.70,8, rx2+0.45, FY+1.00, rz2-0.40, CHR);
      m.B("metal", 0.05,0.05,0.05, rx2+0.45, FY+1.30, rz2-0.40, 0, 0, CHRD);
      m.B("metal", 0.05,0.05,0.05, rx2+0.45, FY+0.70, rz2-0.40, 0, 0, CHRD);
      m.B("metal", 0.70, 0.22, 0.98, rx2, FY+2.12, rz2, 0.4, 0, "#7d837e");   // the deck
      for(let k=0;k<5;k++)
        m.B("metal", 0.64, 0.02, 0.03, rx2, FY+2.06+k*0.045, rz2, 0, 0, "#6b716b");
      m.col(rx2-0.44, rx2+0.44, rz2-0.58, rz2+0.58, 0, FY+1.96);
      for(let i=0;i<9;i++)                          // rust up the foot of it
        m.P("rust", streakGeo(0.09+r2()*0.09, 0.22+r2()*0.22, 0), rx2+0.44,
            FY+0.22, rz2-0.44+r2()*0.88, -Math.PI/2, "#7c4526", 0, 0);
    }
    // a mop, a bucket and a crate of empties
    m.C("bin", 0.17,0.14,0.26,14, KW0+2.95, FY+0.13, 0.55, "#4f5a52");
    m.C("oak", 0.017,0.017,1.32,8, KW0+2.85, FY+0.66, 0.67, "#6d5a3e", 0.16, 0, 0.10);
    { const g=blobGeo(0.11); g.scale(1.1,0.6,1.1);
      m.P("fabric", g, KW0+2.76, FY+1.26, 0.80, 0.4, "#8a8f7e", 0, 0); }
    m.B("oak", 0.42, 0.28, 0.32, KW0+2.60, FY+0.14, -0.85, 0.5, 0, "#5c4a30");
    for(let i=0;i<6;i++)
      m.C("glass", 0.030,0.030,0.20,8, KW0+2.46+((i%3)*0.13), FY+0.22,
          -0.96+(((i/3)|0)*0.16), "#3f5a34");
    // and the light fittings in here, as dead as the ones out front
    for(const q of [KW0+0.95, KW0+2.55]){
      m.B("metal", 0.14, 0.09, 1.10, q, ceilY(0)-0.12, 0.10, 0.4, 0, "#7d837e");
      m.C("glass", 0.036,0.036,1.02,10, q, ceilY(0)-0.18, 0.10, "#4a4a44", 0,0,Math.PI/2);
    }
  }

  /* ---- the pendants, and every one of them cold --------------------------
     The shades are still on their stems. One has lost its glass, one came
     down altogether. Nothing here is in LAMPS and nothing here is in a
     glowing bucket: the point of the building is that the power went off and
     never came back. */
  for(let i=0;i<5;i++){
    const px=IX0+1.7+i*((IX1-IX0)-3.4)/4, cy=ceilY(-0.45);
    if(i===3){                                     // this one came down
      m.C("metal", 0.014,0.014,0.56,6, px, cy-0.26, -0.45, "#6e746f", 0.5, 0, 0.3);
      m.P("glass", new T.SphereGeometry(0.20,14,8), px+0.34, FY+0.10, -0.95, 0.4,
          "#6a6a62", 0.9, 0);
      for(let k=0;k<6;k++)
        m.P("glass", planeGeo(0.10+r2()*0.07, 0.08+r2()*0.06, 0), px+0.1+r2()*0.9,
            FY+0.021, -1.3+r2()*0.9, r2()*6.28, "#8a9a94", -Math.PI/2, 0);
      continue;
    }
    m.C("metal", 0.020,0.020,0.30, 8, px, cy-0.15, -0.45, "#6e746f");
    m.C("metal", 0.075,0.075,0.05,12, px, cy-0.02, -0.45, "#7d837e");
    if(i===1){                                     // shade gone, holder bare
      m.C("metal", 0.042,0.048,0.10,10, px, cy-0.34, -0.45, "#8a908a");
      m.C("glass", 0.024,0.030,0.12,8, px, cy-0.44, -0.45, "#6f6f66");
    }else{
      // NOT the lampshade bucket: that one is emissive, and an emissive
      // material is lit whether or not a lamp is pointed at it
      m.C("plaster", 0.10,0.27,0.18,16, px, cy-0.40, -0.45, "#9d978a");
      m.P("plaster", new T.TorusGeometry(0.265,0.020,6,18), px, cy-0.49, -0.45, 0,
          "#8e8a7e", Math.PI/2, 0);
    }
  }

  /* ---- what is left lying about ------------------------------------------ */
  for(let i=0;i<40;i++)                              // paper, and what blew in
    m.P("paper", planeGeo(0.16+((i*5)%3)*0.07, 0.22+((i*7)%3)*0.06, 0),
        IX0+0.6+((i*2.13)%(IX1-IX0-1.2)), FY+0.018+i*0.0008,
        IZ0+0.5+((i*1.37)%(IZ1-IZ0-1.0)), i*1.3, "#cec7b0", -Math.PI/2, 0);
  for(let i=0;i<11;i++){                             // cups and a bottle or two
    const px=CX0+0.7+((i*1.91)%(CX1-CX0-1.4));
    m.C("plaster", 0.048,0.040,0.095,12, px, CY+0.075, CTZ0+0.30, "#c6bda6");
    if(i%3===0) m.C("glass", 0.036,0.030,0.22,10, px+0.22, CY+0.14, CTZ0+0.46, "#6a5a3a");
    if(i%4===1) m.C("plaster", 0.088,0.088,0.016,14, px-0.18, CY+0.036, CTZ0+0.22,
                    "#bfb6a0");
  }
  for(let i=0;i<7;i++){                              // napkin dispensers down the counter
    const px=CX0+0.9+i*((CX1-CX0)-1.8)/6;
    m.B("metal", 0.115,0.150,0.095, px, CY+0.075, CTZ0+0.16, 0.4, 0,
        (i%3===1)?"#8a908a":"#a7ada6");
    if(i%3!==1) m.P("paper", planeGeo(0.085,0.075,0), px, CY+0.086, CTZ0+0.11, 0,
                    "#cfc6ae", 0, 0);
    for(const q of [-1,1])                           // and the pair beside it
      m.C("glass", 0.021,0.024,0.075,8, px+0.13+q*0.045, CY+0.065, CTZ0+0.16,
          q>0?"#e8e2cf":"#3a332e");
  }
  {                                                  // a cake stand with the dome on
    const px=CX1-1.55;
    m.C("metal", 0.150,0.170,0.030,16, px, CY+0.045, CTZ1-0.26, CHR);
    m.C("metal", 0.030,0.030,0.090,10, px, CY+0.10, CTZ1-0.26, CHRD);
    m.C("plaster", 0.145,0.145,0.024,16, px, CY+0.155, CTZ1-0.26, "#bfb6a0");
    { const g=new T.SphereGeometry(0.155,16,10); g.scale(1,0.92,1);
      m.P("glass", g, px, CY+0.165, CTZ1-0.26, 0, "#8a9a94", 0, 0); }
    m.C("metal", 0.022,0.022,0.035,10, px, CY+0.315, CTZ1-0.26, CHRD);
  }
  {                                                  // a coffee pot left on the warmer
    const px=KX+2.95;
    m.C("metal", 0.085,0.085,0.030,14, px, FY+0.90, BBZ0+0.02, CHRD);
    m.C("glass", 0.070,0.058,0.155,14, px, FY+0.99, BBZ0+0.02, "#4a3a28");
    m.C("glass", 0.062,0.070,0.035,14, px, FY+1.085, BBZ0+0.02, "#8a9a94");
    m.P("bin", boxGeo(0.10,0.030,0.030,0.4), px+0.08, FY+1.02, BBZ0+0.02, 0.5, "#2b3230");
  }
  {                                                  // a broom nobody put away
    const px=KX+5.40;
    m.C("oak", 0.016,0.016,1.32,8, px, FY+0.68, BBZ0-0.12, "#8a7248", 0.20, 0, 0.06);
    m.B("bin", 0.26, 0.07, 0.10, px+0.13, FY+0.07, BBZ0-0.24, 0.4, 0.06, "#6a5f42");
    for(let k=0;k<9;k++)
      m.C("foliage", 0.006,0.006,0.16,4, px+0.02+k*0.026, FY+0.06, BBZ0-0.24,
          "#7a6a46", 0.1, 0, 0.05);
  }
  for(let i=0;i<5;i++)                               // a bus tub of plates, never cleared
    m.C("plaster", 0.088,0.088,0.016,14, CX1-1.95, CY+0.135+i*0.019, CTZ1-0.30, "#bfb6a0");
  m.B("bin", 0.42, 0.14, 0.32, CX1-1.95, CY+0.10, CTZ1-0.30, 0.4, 0, "#4b5450");
  for(let i=0;i<14;i++)                              // broken glass under the window
    m.P("glass", planeGeo(0.09+((i*5)%3)*0.05, 0.07+((i*3)%3)*0.04, 0),
        IX0+1.0+((i*2.7)%(IX1-IX0-2.0)), FY+0.022, IZ0+0.30, i*1.1, "#8a9a94",
        -Math.PI/2, 0);
  /* ---- the menu board over the back bar ---------------------------------
     A diner's prices are the loudest thing in the room and they are the one
     thing a place that closed in the seventies still has on the wall. Black
     letterboard, white plastic letters, and a third of them gone — fallen
     out of the slots and lying on the back bar under it. */
  {
    const bx0=KX+0.95, bx1=KX+4.05, by0=FY+1.62, by1=FY+2.26;
    /* A FRAME, not a slab behind the board. A box the size of the board sat
       3 mm behind it, which is two square metres of two surfaces on one
       plane — the single biggest patch of it in the car. Four strips round
       the edge and there is nothing behind the face at all. */
    for(const q of [[0,(by0+by1)/2, bx1-bx0+0.10, 0.07],[1,(by0+by1)/2, bx1-bx0+0.10, 0.07]])
      m.B("metal", q[2], q[3], 0.06, (bx0+bx1)/2, q[0]?by1+0.035:by0-0.035, IZ1-0.045,
          0.4, 0, CHRD);
    for(const q of [-1,1])
      m.B("metal", 0.07, by1-by0, 0.06, q<0?bx0-0.035:bx1+0.035, (by0+by1)/2, IZ1-0.045,
          0.4, 0, CHRD);
    m.P("bin", planeGeo(bx1-bx0, by1-by0, 0), (bx0+bx1)/2, (by0+by1)/2, IZ1-0.072,
        Math.PI, "#2a2b28", 0, 0);                            // the board
    for(let r=0;r<5;r++){                                     // the slats
      const ly=by1-0.10-r*0.125;
      m.B("metal", bx1-bx0, 0.012, 0.022, (bx0+bx1)/2, ly-0.062, IZ1-0.095, 0.4, 0, "#4a4b46");
      for(let c=0;c<22;c++){                                  // and the letters in them
        const px=bx0+0.10+c*((bx1-bx0)-0.20)/21;
        const h2=((r*7+c*3)%11);
        if(h2<3) continue;                                    // this one has gone
        m.B("paper", 0.035, 0.052, 0.010, px, ly, IZ1-0.098, 0.4, 0,
            (c>16)?"#d8c47e":"#e8e4d6");
      }
    }
    for(let i=0;i<7;i++)                                      // where they ended up
      m.P("paper", planeGeo(0.035,0.052,0), KX+1.3+((i*1.7)%2.6), FY+0.955,
          BBZ0-0.10+((i*5)%3)*0.07, i*1.1, "#e8e4d6", -Math.PI/2, 0);
    m.C("metal", 0.016,0.016,0.16,6, bx0-0.02, by1+0.12, IZ1-0.07, CHRD, 0.5, 0, 0.3);
  }

  /* ---- the entry, from the inside --------------------------------------
     Now the doorway is actually open this is the first thing you see, so it
     gets the four things that are always in one: something to wipe your
     feet on, a bell over the door, a sign telling you to wait, and a rack
     of papers nobody has taken since. Everything here stands clear of the
     lane through the door — x 4.88 to 6.12 — because that is the rule now. */
  {
    m.P("fabric", planeGeo(1.30, 0.80, 0.8), DX, FY+0.022, IZ0+0.58, 0,
        "#4e4a40", -Math.PI/2, 0);                            // the mat
    m.B("metal", 1.36, 0.02, 0.06, DX, FY+0.026, IZ0+0.18, 0.4, 0, "#7f857f");
    m.B("metal", 1.36, 0.02, 0.06, DX, FY+0.026, IZ0+0.98, 0.4, 0, "#7f857f");
    for(let i=0;i<9;i++)                                      // worn through in the middle
      m.P("soot", planeGeo(0.16+r2()*0.20, 0.14+r2()*0.18, 0), DX-0.4+r2()*0.8,
          FY+0.026, IZ0+0.34+r2()*0.48, r2()*6.28, "#3f3a31", -Math.PI/2, 0);
    // the bell on its bracket, set back off the head so it is not in the hole
    m.C("metal", 0.010,0.010,0.22,6, DX, FY+2.16, IZ0+0.26, CHRD, 0, 0, Math.PI/2);
    m.C("metal", 0.010,0.010,0.13,6, DX, FY+2.16, IZ0+0.15, CHRD, Math.PI/2);
    { const g=new T.SphereGeometry(0.055,12,8); g.scale(1,0.78,1);
      m.P("metal", g, DX, FY+2.10, IZ0+0.26, 0, "#a89a5e"); }
    m.C("metal", 0.008,0.008,0.10,5, DX, FY+2.02, IZ0+0.26, "#8a7c48");
    // PLEASE WAIT TO BE SEATED, on a stand, knocked half round
    { const sx=DX-1.52, sz=IZ0+0.92;
      m.C("metal", 0.14,0.17,0.02,14, sx, FY+0.02, sz, CHRD);
      m.C("metal", 0.022,0.022,1.02,8, sx, FY+0.53, sz, CHRD);
      m.B("bin", 0.42, 0.28, 0.03, sx, FY+1.12, sz, 0.4, 0.42, "#2f312c");
      m.P("paper", planeGeo(0.36, 0.22, 0), sx+Math.sin(0.42)*0.02, FY+1.12,
          sz-Math.cos(0.42)*0.02, 0.42, "#cfc6ae", 0, 0);
      m.col(sx-0.18, sx+0.18, sz-0.18, sz+0.18, 0, FY+1.20); }
    // the paper rack, empty but for one that never got picked up
    { const rx=DX+1.44, rz=IZ0+0.34;
      for(const q of [-1,1]) m.C("metal", 0.016,0.016,0.94,6, rx+q*0.22, FY+0.47, rz, CHRD);
      for(let k=0;k<3;k++)
        m.B("metal", 0.50, 0.018, 0.22, rx, FY+0.30+k*0.30, rz+0.04, 0.4, 0, CHRD);
      m.P("paper", planeGeo(0.30, 0.40, 0), rx-0.05, FY+0.63, rz+0.05, 0.1, "#c9c1a8",
          -0.9, 0.06);
      m.col(rx-0.26, rx+0.26, rz-0.16, rz+0.18, 0, FY+0.96); }
    // and the path worn from the door to the counter
    for(let i=0;i<13;i++){
      const t=i/12;
      m.P("soot", planeGeo(0.62+r2()*0.5, 0.70+r2()*0.5, 0),
          DX-t*(DX-CX1+0.4)+((i%2)?0.10:-0.12), FY+0.020+i*0.0004,
          IZ0+0.70+t*(SZ-IZ0-0.7), r2()*6.28, "#4a4237", -Math.PI/2, 0);
    }
  }

  /* ---- and the service end, outside ------------------------------------- */
  {
    const ex=IX0-0.14;                                       // the west end wall
    m.C("metal", 0.30,0.30,0.16,14, ex-0.06, FY+1.62, -0.90, "#8a908a", 0, 0, Math.PI/2);
    m.C("metal", 0.34,0.34,0.05,14, ex-0.14, FY+1.62, -0.90, "#6e746f", 0, 0, Math.PI/2);
    for(let k=0;k<4;k++)                                      // the extract fan behind it
      m.B("metal", 0.03, 0.52, 0.10, ex-0.10, FY+1.62, -0.90, 0.4, k*0.8, "#5f655f");
    m.P("soot", planeGeo(0.70, 1.20, 0), ex-0.16, FY+0.92, -0.90, -Math.PI/2,
        "#544c40", 0, 0);                                     // the grease run under it
    m.C("metal", 0.018,0.018,0.20,6, ex-0.06, FY+0.10, 0.90, "#8a908a", 0, 0, Math.PI/2);
    for(let k=0;k<9;k++){                                     // the hose, coiled on its hook
      const a=k*0.72;
      m.P("bin", new T.TorusGeometry(0.17+k*0.004, 0.017, 5, 14), ex-0.14,
          FY+0.42, 0.90, 0, "#3f4a42", 0, Math.PI/2+0.06*Math.sin(a));
    }
    m.C("metal", 0.014,0.014,0.10,5, ex-0.10, FY+0.62, 0.90, "#8a908a", 0, 0, Math.PI/2);
    for(let i=0;i<6;i++)                                      // milk crates by the back door
      m.B("bin", 0.34, 0.26, 0.34, IX0+0.55+((i%2)?0.38:0), 0.15+((i/2)|0)*0.27,
          IZ1+0.62+((i%3)*0.06), 0.5, ((i*7)%5-2)*0.10,
          ["#3f5c6a","#5c3f4a","#4a5c3f"][i%3]);
    m.col(D.x+IX0+0.35, D.x+IX0+1.30, D.z+IZ1+0.40, D.z+IZ1+0.90, 0, 1.0);
  }

  /* zoneAt takes the LAST zone that matches, so the order here is the
     answer. The volume that keeps the blown sand out covers the whole car and
     goes down first; the two rooms name themselves over the top of it. The
     kitchen named itself inside its own block to begin with and the car-wide
     volume, registered afterwards, simply won everywhere. */
  addZone(D.x+IX0-0.3, D.x+IX1+0.3, D.z+IZ0-0.3, D.z+IZ1+0.3,
          m.y+FY-0.3, m.y+FY+CH+0.9, "ROXIE'S DINER", true);
  m.rect(KX, IX1, IZ0, IZ1, "ROXIE'S DINER");
  m.rect(IX0, KX, IZ0, IZ1, "THE KITCHEN");
})();
