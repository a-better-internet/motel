"use strict";
/* LOW DESERT MOTEL · 10-office.js
   front desk office, and the cars parked outside it
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   10 · FRONT DESK OFFICE
   ---------------------------------------------------------------------- */
/* The opening between the office and the room behind it. Both sides of the
   wall read these, so the door cannot end up in a different place in each. */
const APT = { x0:-44.0, x1:-36.0, z1:6.20, h:2.62 };
/* WHERE THE DOOR IS, AND WHY IT IS NOT WHERE IT WAS.

   A doorway probe tests the hole. It does not test whether you can get to
   the hole. This door passed clear36 and doors18 and was still unusable in
   play, because the route to it ran through a 20 cm slot between the north
   end of the front desk and the soda machine — technically passable, and in
   practice you bump along the furniture and never find it.

   So the door moved EAST of the desk, into the 2.1 m gap between the desk's
   east face and the credenza, and the two vending machines moved west out
   of the approach. You now walk straight at it from the middle of the
   office floor with nothing in the way. A flood fill from the office's own
   front door is the test that catches this, and it is the one that has to
   be run every time a door goes into a room that already has furniture. */
const APT_DX=-41.30, APT_DW=0.98, APT_DH=2.08;
(function buildOffice(){
  const O=OFFICE, y0=BASE, h=O.h, cx=(O.x0+O.x1)/2, cz=(O.z0+O.z1)/2;
  const w=O.x1-O.x0, d=O.z1-O.z0;
  bx("concrete", w+1.8, 0.32, d+1.8, cx, y0-0.16, cz, 0.45, 0, "#b6afa0");
  addFlat(O.x0-0.9,O.x1+0.9,O.z0-0.9,O.z1+0.9, y0);
  bx("lino", w-0.4, 0.04, d-0.4, cx, y0+0.02, cz, 0.85, 0, "#c4baa2");
  addZone(O.x0,O.x1,O.z0,O.z1, y0-0.5, y0+3.0, "FRONT DESK OFFICE", true);

  const glazeX0=O.x0+3.4, glazeX1=O.x1-1.2, doorZ0=cz-0.5, doorZ1=cz+0.5;
  // north / west solid walls
  // The north and south walls stop short of the corners so the east and west
  // walls own them outright — two slabs that end on the same plane buzz.
  /* The north wall, with the door to the manager's apartment in it. It was
     one slab; the apartment is on the other side of it, so it runs in two
     lengths with a header over the opening — and the collider is split the
     same way, because a hole in the wall that the collider does not know
     about is a door you walk into. APT_DX/APT_DW are shared with the
     apartment block below so the two halves of the opening cannot drift. */
  bx("stucco", APT_DX-APT_DW/2-(O.x0+0.22), h, 0.22, (O.x0+0.22+APT_DX-APT_DW/2)/2,
     y0+h/2, O.z1-0.11, 0.3, 0, SLATE);
  bx("stucco", (O.x1-0.22)-(APT_DX+APT_DW/2), h, 0.22, (APT_DX+APT_DW/2+O.x1-0.22)/2,
     y0+h/2, O.z1-0.11, 0.3, 0, SLATE);
  bx("stucco", APT_DW+0.04, h-APT_DH, 0.22, APT_DX, y0+APT_DH+(h-APT_DH)/2, O.z1-0.11,
     0.3, 0, SLATE);
  /* The reveal, lined proud of the render on both faces. At 0.05 by 0.26 it
     left a couple of centimetres of raw blue stucco showing down each side
     of the opening — a doorway is three surfaces, not two, and the cut
     edges of the wall are the ones you look straight at. */
  for(const q of [-1,1])
    bx("roomwall", 0.08, APT_DH+0.05, 0.30, APT_DX+q*(APT_DW/2+0.03), y0+APT_DH/2,
       O.z1-0.11, 0.4, 0, "#cfc7b2");
  bx("roomwall", APT_DW+0.20, 0.08, 0.30, APT_DX, y0+APT_DH+0.03, O.z1-0.11, 0.4, 0, "#cfc7b2");
  addCol(O.x0, APT_DX-APT_DW/2, O.z1-0.22, O.z1, y0, y0+h);
  addCol(APT_DX+APT_DW/2, O.x1, O.z1-0.22, O.z1, y0, y0+h);
  addCol(APT_DX-APT_DW/2, APT_DX+APT_DW/2, O.z1-0.22, O.z1, y0+APT_DH, y0+h);
  /* It hangs CLOSED. This is somebody's home behind the front desk, and a
     private door standing permanently ajar reads as a cupboard. It swings
     on approach like every other door here and falls shut behind you. */
  makeDoor(XF(APT_DX-APT_DW/2+0.02, O.z1-0.02, 0), 0, y0+0.02, 0, "PRIVATE", true, 0);
  /* and the card that says so — screwed to the WALL beside the door, not to
     the door's own centre-line, where the last one sat squarely in the
     opening. Nothing but the leaf belongs between the two jambs. */
  const CZ=O.z1-0.345, CDX=APT_DX+APT_DW/2+0.46;
  bx("paint", 0.28, 0.10, 0.02, CDX, y0+1.62, CZ, 0.4, 0, "#2b3a44");
  push("paint", planeGeo(0.24, 0.07, 0), CDX, y0+1.62, CZ-0.012, Math.PI,
       "#d8d4c8", 0, 0);
  bx("stucco", 0.22, h, d, O.x0+0.11, y0+h/2, cz, 0.3, 0, SLATE);
  addCol(O.x0, O.x0+0.22, O.z0,O.z1, y0, y0+h);
  // south wall: solid pier + the big glazed lobby wall with gold drapes
  bx("stucco", glazeX0-O.x0-0.22, h, 0.22, (O.x0+0.22+glazeX0)/2, y0+h/2, O.z0+0.11, 0.3, 0, SLATE);
  addCol(O.x0,glazeX0, O.z0, O.z0+0.22, y0, y0+h);
  bx("stucco", O.x1-glazeX1-0.22, h, 0.22, (glazeX1+O.x1-0.22)/2, y0+h/2, O.z0+0.11, 0.3, 0, SLATE);
  addCol(glazeX1,O.x1, O.z0, O.z0+0.22, y0, y0+h);
  bx("stucco", glazeX1-glazeX0, 0.62, 0.24, (glazeX0+glazeX1)/2, y0+h-0.31, O.z0+0.11, 0.3, 0, SLATE);
  push("glass", boxGeo(glazeX1-glazeX0, h-1.0, 0.05, 0), (glazeX0+glazeX1)/2, y0+(h-1.0)/2+0.32, O.z0+0.10, 0, "#cfe0e6");
  bx("curtain", glazeX1-glazeX0-0.2, h-0.72, 0.04, (glazeX0+glazeX1)/2, y0+(h-0.72)/2+0.20, O.z0+0.34, 0.6, 0, "#cbb066");
  bx("oak", glazeX1-glazeX0+0.2, 0.09, 0.44, (glazeX0+glazeX1)/2, y0+0.30, O.z0+0.30, 0.6, 0, "#7a5636");
  push("oak", new T.CylinderGeometry(0.045,0.045,glazeX1-glazeX0+0.2,12),
       (glazeX0+glazeX1)/2, y0+0.325, O.z0+0.50, 0, "#7a5636", 0, Math.PI/2);
  bx("oak", glazeX1-glazeX0+0.3, 0.16, 0.12, (glazeX0+glazeX1)/2, y0+h-0.42, O.z0+0.40, 0.6, 0, "#5c4029");
  addCol(glazeX0,glazeX1, O.z0, O.z0+0.24, y0, y0+h);
  for(let x=glazeX0;x<=glazeX1+0.01;x+=1.55)
    bx("paint", 0.09, h-0.9, 0.28, x, y0+(h-0.9)/2+0.30, O.z0+0.10, 0, 0, "#e6e2d6");
  bx("paint", glazeX1-glazeX0+0.2, 0.12, 0.30, (glazeX0+glazeX1)/2, y0+0.36, O.z0+0.10, 0, 0, "#e6e2d6");
  // east wall with the entrance
  bx("stucco", 0.22, h, doorZ0-O.z0, O.x1-0.11, y0+h/2, (O.z0+doorZ0)/2, 0.3, 0, SLATE);
  addCol(O.x1-0.22,O.x1, O.z0, doorZ0, y0, y0+h);
  bx("stucco", 0.22, h, O.z1-doorZ1, O.x1-0.11, y0+h/2, (doorZ1+O.z1)/2, 0.3, 0, SLATE);
  addCol(O.x1-0.22,O.x1, doorZ1, O.z1, y0, y0+h);
  bx("stucco", 0.22, h-2.12, doorZ1-doorZ0, O.x1-0.11, y0+2.12+(h-2.12)/2, cz, 0.3, 0, SLATE);
  bx("teal", 0.28, 0.17, 1.2, O.x1-0.11, y0+2.155, cz, 0, 0, TEAL_D);
  makeDoor(XF(O.x1-0.08, cz-0.49, -Math.PI/2), 0, y0+0.02, 0, "OFFICE", true);
  // green roof: shallow gable with a deep eave, plus the drive-through canopy
  const rw=w+2.6, rd=d+2.6, ry=y0+h;
  push("roofG", boxGeo(rw, 0.22, rd/2+0.4, 0.30), cx, ry+0.52, cz-rd/4, 0, "#4b7a62", -0.16);
  push("roofG", boxGeo(rw, 0.22, rd/2+0.4, 0.30), cx, ry+0.52, cz+rd/4, 0, "#4b7a62",  0.16);
  bx("paint", rw, 0.24, 0.16, cx, ry+0.10, cz-rd/2, 0, 0, "#e6e2d6");
  bx("paint", rw, 0.24, 0.16, cx, ry+0.10, cz+rd/2, 0, 0, "#e6e2d6");
  bx("paint", 0.16, 0.24, rd, O.x0-1.3, ry+0.16, cz, 0, 0, "#e6e2d6");
  bx("paint", 0.16, 0.24, rd, O.x1+1.3, ry+0.16, cz, 0, 0, "#e6e2d6");
  // porte-cochere over the drive between office and north wing
  bx("roofG", 8.6, 0.26, 7.0, O.x1+4.6, y0+3.30, cz+1.0, 0.3, 0, "#4b7a62");
  bx("paint", 8.8, 0.20, 0.18, O.x1+4.6, y0+3.12, cz-2.5, 0, 0, "#e6e2d6");
  bx("paint", 8.8, 0.20, 0.18, O.x1+4.6, y0+3.12, cz+4.5, 0, 0, "#e6e2d6");
  for(const p of [[O.x1+1.0,cz-2.2],[O.x1+8.2,cz-2.2],[O.x1+8.2,cz+4.2]]){
    bx("teal", 0.24,3.30,0.24, p[0], y0+1.65, p[1], 0, 0, TEAL);
    addCol(p[0]-0.16,p[0]+0.16,p[1]-0.16,p[1]+0.16, y0, y0+3.3);
  }
  // OFFICE sign over the door + a small neon VACANCY box
  push("signlit", boxGeo(2.2,0.62,0.10,0), O.x1+0.16, y0+2.62, cz, -Math.PI/2, "#e8e4d6");
  const sg=new T.Mesh(new T.PlaneGeometry(2.1,0.55),
    new T.MeshBasicMaterial({map:signTex(320,84,(x,W,H)=>{
      x.fillStyle="#13405e"; x.fillRect(0,0,W,H);
      x.fillStyle="#ede0c2"; fitText(x,"OFFICE",W*0.86,52,W/2,H/2+2);
    }), transparent:false, toneMapped:false}));
  sg.position.set(O.x1+0.22, y0+2.62, cz); sg.rotation.y=Math.PI/2; scene.add(sg);

  /* --- lobby: desk, key rack, seating, the small stuff --------------- */
  const dx=O.x0+3.0;
  bx("oak", 1.00, 1.12, 6.0, dx, y0+0.56, cz, 0.5, 0, "#6f4a2c");        // counter
  bx("oak", 1.24, 0.10, 6.3, dx, y0+1.16, cz, 0.5, 0, "#8a5c34");        // counter top
  push("oak", new T.CylinderGeometry(0.055,0.055,6.3,12), dx-0.62, y0+1.185, cz, 0, "#8a5c34", Math.PI/2, 0);
  push("oak", new T.CylinderGeometry(0.055,0.055,6.3,12), dx+0.62, y0+1.185, cz, 0, "#8a5c34", Math.PI/2, 0);
  addCol(dx-0.62,dx+0.62, cz-3.15, cz+3.15, y0, y0+1.3);
  bx("paint", 0.06, 0.44, 5.9, dx-0.56, y0+0.80, cz, 0, 0, "#cdb98f");   // apron panel
  bx("oak", 0.30, 2.00, 4.6, O.x0+0.5, y0+1.55, cz, 0.5, 0, "#5c4029");  // key pigeonholes
  for(let r=0;r<4;r++){
    bx("paint", 0.26, 0.03, 4.5, O.x0+0.62, y0+0.68+r*0.42, cz, 0, 0, "#e0d6bc");   // shelf
    for(let c=0;c<11;c++)
      bx("paint", 0.28, 0.38, 0.03, O.x0+0.62, y0+0.88+r*0.42, cz-2.25+c*0.45, 0, 0, "#4a3a26");
    for(let c=0;c<10;c++)                                                            // room keys on fobs
      if((r*10+c)%3) bx("paint", 0.10,0.16,0.05, O.x0+0.56, y0+0.80+r*0.42, cz-2.03+c*0.45, 0, 0, "#c9a24b");
  }
  bx("paint", 0.34,0.30,0.44, dx-0.1, y0+1.36, cz-1.0, 0, 0, "#3a3b3d");  // register
  bx("paint", 0.30,0.04,0.34, dx-0.1, y0+1.53, cz-1.0, 0, 0, "#1d262b");
  push("bell", new T.SphereGeometry(0.09,10,8), dx+0.2, y0+1.27, cz+0.9, 0, "#caa23c");
  bx("metal", 0.16,0.03,0.16, dx+0.2, y0+1.22, cz+0.9, 0, 0, "#caa23c");
  bx("oak", 0.26,1.10,0.44, dx+0.1, y0+1.70, cz+2.2, 0.6, 0, "#5c4029");  // brochure rack
  for(let r=0;r<3;r++) for(let c2=0;c2<2;c2++){
    const bz2=cz+2.10+c2*0.20, by=y0+1.32+r*0.30;
    bx("oak", 0.05,0.035,0.15, dx-0.03, by-0.142, bz2, 0, 0, "#4a3524");   // the lip
    push("pic:brochure:"+(r*2+c2), planeGeo(0.12,0.27,0),
         dx-0.062, by, bz2, -Math.PI/2, "#ffffff");
  }
  // lobby seating by the glazed wall
  // back against the glazed wall, so you sit looking into the lobby
  const sofaX=O.x1-3.9, sofaZ=O.z0+0.95;
  bx("oak",   2.30,0.34,0.92, sofaX, y0+0.32, sofaZ, 0.6, 0, "#5c4029");
  bx("spread",2.20,0.26,0.82, sofaX, y0+0.60, sofaZ, 0.5, 0, "#5e7c6e");
  bx("spread",2.20,0.62,0.22, sofaX, y0+0.88, sofaZ-0.35, 0.5, 0, "#5e7c6e");   // back at the window
  addSeat(sofaX-0.55, sofaZ+0.08, y0+0.66, Math.PI, "THE SOFA");
  addSeat(sofaX+0.55, sofaZ+0.08, y0+0.66, Math.PI, "THE SOFA");
  bx("spread",0.22,0.40,0.86, sofaX-1.06, y0+0.76, sofaZ, 0.5, 0, "#4e6c5e");   // arms
  bx("spread",0.22,0.40,0.86, sofaX+1.06, y0+0.76, sofaZ, 0.5, 0, "#4e6c5e");
  push("spread", new T.CylinderGeometry(0.11,0.11,2.20,12), sofaX, y0+0.96, sofaZ-0.35,
       0, "#5e7c6e", 0, Math.PI/2);                                             // rolled back edge
  for(const cu of [-0.62,0,0.62])
    bx("spread",0.66,0.16,0.76, sofaX+cu, y0+0.71, sofaZ+0.02, 0.5, 0, "#688878");
  addCol(O.x1-4.8,O.x1-2.4, sofaZ-0.55, sofaZ+0.55, y0, y0+0.9);
  bx("oak", 1.20,0.06,0.72, sofaX, y0+0.46, sofaZ+1.40, 0.7, 0, "#6f4a2c");
  push("oak", new T.CylinderGeometry(0.035,0.035,1.20,10), sofaX, y0+0.47, sofaZ+1.04,
       0, "#6f4a2c", 0, Math.PI/2);
  for(const dd of [[-0.50,-0.26],[0.50,-0.26],[-0.50,0.26],[0.50,0.26]])
    bx("oak", 0.07,0.44,0.07, sofaX+dd[0], y0+0.23, sofaZ+1.40+dd[1], 0, 0, "#5c4029");
  cyl("gravel", 0.34,0.27,0.58,12, O.x1-0.95, y0+0.29, O.z1-1.05, "#a35a34");
  for(const b2 of [[0,0.86,0.34],[-0.22,0.74,0.24],[0.20,0.78,0.26],[0.04,1.02,0.22],[-0.14,0.98,0.19]])
    push("foliage", new T.IcosahedronGeometry(b2[2],1), O.x1-0.95+b2[0], y0+b2[1], O.z1-1.05+(b2[0]*0.6), 0,
         ["#4f6b3a","#57713f","#465f34"][(b2[2]*100|0)%3]);
  addCol(O.x1-1.4,O.x1-0.5, O.z1-1.5, O.z1-0.6, y0, y0+1.4);

  /* --- an armchair angled at the coffee table ------------------------- */
  (function armchair(){
    const ax=sofaX-2.05, az=sofaZ+1.25, ry=0.55;
    const A=(bk,ww,hh,dd,lx,ly,lz,uv,c)=>{
      const q=[ax+lx*Math.cos(ry)+lz*Math.sin(ry), az-lx*Math.sin(ry)+lz*Math.cos(ry)];
      push(bk, boxGeo(ww,hh,dd,uv||0.5), q[0], y0+ly, q[1], ry, c);
    };
    A("oak",   0.94,0.32,0.90, 0,0.31,0, 0.6,"#5c4029");
    A("spread",0.88,0.26,0.82, 0,0.58,0, 0.5,"#7a5a52");
    A("spread",0.88,0.60,0.22, 0,0.86,-0.34, 0.5,"#7a5a52");
    A("spread",0.20,0.38,0.84, -0.38,0.74,0, 0.5,"#6a4c46");
    A("spread",0.20,0.38,0.84,  0.38,0.74,0, 0.5,"#6a4c46");
    push("spread", new T.CylinderGeometry(0.10,0.10,0.88,12),
         ax+(-0.34)*Math.sin(ry), y0+0.94, az+(-0.34)*Math.cos(ry), ry, "#7a5a52", 0, Math.PI/2);
    addCol(ax-0.58,ax+0.58, az-0.58, az+0.58, y0, y0+0.9);
  })();
  // standing lamp in the corner beside the sofa
  cyl("metal", 0.20,0.22,0.04,14, sofaX-1.55, y0+0.03, sofaZ-0.30, "#6b6156");
  cyl("metal", 0.03,0.03,1.52,8,  sofaX-1.55, y0+0.78, sofaZ-0.30, "#6b6156");
  push("lampshade", new T.CylinderGeometry(0.20,0.28,0.30,14),
       sofaX-1.55, y0+1.66, sofaZ-0.30, 0, "#e2d2a8");
  LAMPS.push({x:sofaX-1.55, y:y0+1.60, z:sofaZ-0.30, color:0xffeed6,
              intensity:0.30, dist:8, decay:1.3, indoor:true});
  addCol(sofaX-1.78,sofaX-1.32, sofaZ-0.53, sofaZ-0.07, y0, y0+1.8);
  /* Coffee urn station, shifted 0.7 m west into the corner. The back wall
     of this office runs urn station, soda machine, cigarette machine,
     credenza, water cooler, bench — end to end with nothing between them —
     and the door to the apartment has to come through it. This is the one
     joint wide enough to take a door, and it is only wide enough with the
     urns pushed up against the west wall. */
  bx("oak", 1.30,0.90,0.50, O.x0+1.2, y0+0.45, O.z1-0.6, 0.6, 0, "#5c4029");
  cyl("metal", 0.16,0.18,0.46,12, O.x0+0.9, y0+1.13, O.z1-0.6, "#c9cdcd");
  cyl("metal", 0.16,0.18,0.46,12, O.x0+1.5, y0+1.13, O.z1-0.6, "#c9cdcd");
  addCol(O.x0+0.5,O.x0+1.9, O.z1-0.9, O.z1-0.3, y0, y0+1.0);
  // a wall clock that stopped some time ago
  push("art", boxGeo(0.52,0.52,0.06,0), O.x0+0.32, y0+2.45, cz+1.8, 0, "#5c4029");
  signPanel(0.44,0.44, signTex(128,128,(x,W,H)=>{
    x.fillStyle="#efe9d8"; x.beginPath(); x.arc(64,64,62,0,7); x.fill();
    x.strokeStyle="#2f2a20"; x.lineWidth=3;
    for(let k=0;k<12;k++){ const a=k*Math.PI/6;
      x.beginPath(); x.moveTo(64+Math.sin(a)*52, 64-Math.cos(a)*52);
      x.lineTo(64+Math.sin(a)*46, 64-Math.cos(a)*46); x.stroke(); }
    x.lineWidth=5; x.beginPath(); x.moveTo(64,64);                // stopped at 3:47
    x.lineTo(64+Math.sin(2.0)*30, 64-Math.cos(2.0)*30); x.stroke();
    x.lineWidth=3; x.beginPath(); x.moveTo(64,64);
    x.lineTo(64+Math.sin(4.9)*44, 64-Math.cos(4.9)*44); x.stroke();
    x.fillStyle="#2f2a20"; x.beginPath(); x.arc(64,64,4,0,7); x.fill();
  }), O.x0+0.38, y0+2.45, cz+1.8, Math.PI/2, false);

  /* --- the bare north wall: coffee credenza, water cooler, a bench ----- */
  // credenza with the coffee setup
  const crX=O.x0+7.0, crZ=O.z1-0.62;
  bx("oak", 2.50,0.86,0.56, crX, y0+0.43, crZ, 0.6, 0, "#6f4a2c");
  bx("oak", 2.58,0.07,0.62, crX, y0+0.89, crZ, 0.6, 0, "#8a5c34");
  push("oak", new T.CylinderGeometry(0.04,0.04,2.58,12), crX, y0+0.915, crZ-0.31, 0, "#8a5c34", 0, Math.PI/2);
  for(const dd of [-0.62,0.62]) bx("oak", 0.04,0.60,0.50, crX+dd, y0+0.50, crZ, 0, 0, "#5c4029");
  addCol(crX-1.29,crX+1.29, crZ-0.32, crZ+0.32, y0, y0+0.95);
  bx("paint", 0.34,0.26,0.30, crX-0.85, y0+1.05, crZ, 0, 0, "#2b2b2b");        // coffee maker
  bx("metal", 0.30,0.03,0.26, crX-0.85, y0+1.19, crZ, 0, 0, "#b8bcbc");
  push("glass", new T.CylinderGeometry(0.09,0.075,0.17,12), crX-0.85, y0+1.01, crZ-0.04, 0, "#9c5a3a");
  bx("metal", 0.22,0.02,0.22, crX-0.42, y0+0.94, crZ, 0, 0, "#b8bcbc");        // hot plate
  push("glass", new T.CylinderGeometry(0.09,0.075,0.17,12), crX-0.42, y0+1.03, crZ, 0, "#9c5a3a");
  for(let k=0;k<7;k++)                                                          // stack of cups
    push("bin", new T.CylinderGeometry(0.042,0.034,0.03,10), crX+0.05, y0+0.94+k*0.026, crZ+0.04, 0, "#efeee6");
  bx("oak", 0.26,0.10,0.18, crX+0.36, y0+0.98, crZ, 0, 0, "#7a5636");           // sugar caddy
  push("glass", new T.CylinderGeometry(0.05,0.05,0.13,10), crX+0.62, y0+0.99, crZ, 0, "#cfe0e6");
  bx("paint", 0.20,0.14,0.16, crX+0.92, y0+1.00, crZ, 0, 0, "#d8d4c8");         // creamer tin
  bx("art", 0.30,0.02,0.22, crX+0.55, y0+0.94, crZ+0.18, 0, 0, "#d8cfae");      // paper napkins

  // bottle-top water cooler
  const wcX=O.x0+9.9, wcZ=O.z1-0.70;
  bx("paint", 0.42,0.98,0.42, wcX, y0+0.49, wcZ, 0, 0, "#e0ddd2");
  bx("paint", 0.46,0.10,0.46, wcX, y0+1.02, wcZ, 0, 0, "#c8c4b8");
  push("glass", new T.CylinderGeometry(0.21,0.13,0.50,14), wcX, y0+1.32, wcZ, 0, "#8fd0e2");
  push("glass", new T.CylinderGeometry(0.07,0.07,0.10,10), wcX, y0+1.62, wcZ, 0, "#cfe0e6");
  bx("paint", 0.10,0.14,0.06, wcX-0.09, y0+0.80, wcZ-0.24, 0, 0, "#4a6b8a");    // taps
  bx("paint", 0.10,0.14,0.06, wcX+0.09, y0+0.80, wcZ-0.24, 0, 0, "#8a4a4a");
  bx("paint", 0.10,0.34,0.10, wcX+0.32, y0+0.78, wcZ-0.14, 0, 0, "#d8d4c8");    // cup dispenser
  addCol(wcX-0.26,wcX+0.30, wcZ-0.30, wcZ+0.26, y0, y0+1.1);

  // The second bench used to sit here, a metre from the water cooler and in
  // the way of it. The lamp table it shared stays; the bench does not.
  const bnX=O.x1-2.9, bnZ=O.z1-1.00;
  bx("oak", 0.52,0.05,0.52, bnX+1.42, y0+0.54, bnZ+0.05, 0.7, 0, "#6f4a2c");    // side table
  for(const dd of [[-0.20,-0.20],[0.20,-0.20],[-0.20,0.20],[0.20,0.20]])
    bx("oak", 0.06,0.52,0.06, bnX+1.42+dd[0], y0+0.27, bnZ+0.05+dd[1], 0, 0, "#5c4029");
  bx("metal",0.09,0.24,0.09, bnX+1.42, y0+0.68, bnZ+0.05, 0, 0, "#b8a67e");
  push("lampshade", new T.CylinderGeometry(0.14,0.19,0.22,12), bnX+1.42, y0+0.91, bnZ+0.05, 0, "#e8dcc0");
  addCol(bnX+1.14,bnX+1.70, bnZ-0.23, bnZ+0.33, y0, y0+0.6);
  bx("art", 0.26,0.02,0.20, bnX+1.34, y0+0.58, bnZ-0.10, 0, 0, "#c9a24b");      // an old magazine
  bx("fabric", 2.30,0.03,1.60, bnX+0.5, y0+0.04, bnZ+0.95, 0, 0, "#6a5a4e");    // the rug it stood on
  bx("fabric", 2.26,0.015,1.50, bnX+0.1, y0+0.052, bnZ+0.75, 0, 0, "#9a8468");
  LAMPS.push({x:bnX+1.42, y:y0+0.95, z:bnZ+0.05, color:0xffd9a0,
              intensity:0.26, dist:7, decay:1.35, indoor:true});
  // a table lamp on the credenza, and something green beside the cooler
  bx("metal",0.10,0.26,0.10, crX+1.02, y0+1.05, crZ, 0, 0, "#b8a67e");
  push("lampshade", new T.CylinderGeometry(0.15,0.21,0.24,12), crX+1.02, y0+1.30, crZ, 0, "#e8dcc0");
  LAMPS.push({x:crX+1.02, y:y0+1.26, z:crZ, color:0xffd9a0,
              intensity:0.28, dist:7, decay:1.35, indoor:true});
  cyl("gravel", 0.30,0.24,0.52,12, wcX+0.95, y0+0.26, wcZ, "#a35a34");
  for(const b3 of [[0,0.78,0.30],[-0.20,0.66,0.21],[0.18,0.70,0.23],[0.03,0.94,0.19]])
    push("foliage", new T.IcosahedronGeometry(b3[2],1), wcX+0.95+b3[0], y0+b3[1], wcZ+b3[0]*0.6,
         0, ["#4f6b3a","#57713f","#465f34"][(b3[2]*100|0)%3]);
  addCol(wcX+0.58,wcX+1.32, wcZ-0.36, wcZ+0.36, y0, y0+1.3);

  // a luggage cart parked by the door and a fire extinguisher
  (function cart(){
    const lx=O.x1-1.9, lz=cz-1.9;
    bx("metal", 1.10,0.06,0.62, lx, y0+0.28, lz, 0, 0, "#b8bcbc");
    for(const c2 of [[-0.48,-0.24],[0.48,-0.24],[-0.48,0.24],[0.48,0.24]]){
      push("metal", new T.CylinderGeometry(0.08,0.08,0.05,10), lx+c2[0], y0+0.09, lz+c2[1], 0, "#3a3a36", 0, Math.PI/2);
      bx("metal", 0.05,0.20,0.05, lx+c2[0], y0+0.18, lz+c2[1], 0, 0, "#b8bcbc");
    }
    for(const c2 of [-0.48,0.48]) bx("metal", 0.05,1.42,0.05, lx+c2, y0+0.99, lz-0.26, 0, 0, "#b8bcbc");
    bx("metal", 1.06,0.05,0.05, lx, y0+1.68, lz-0.26, 0, 0, "#b8bcbc");
    bx("metal", 1.06,0.04,0.04, lx, y0+1.30, lz-0.26, 0, 0, "#b8bcbc");
    bx("oak", 0.52,0.30,0.40, lx-0.22, y0+0.46, lz+0.04, 0.6, 0, "#4a3524");    // one forgotten case
    addCol(lx-0.60,lx+0.60, lz-0.36, lz+0.36, y0, y0+1.7);
  })();
  cyl("paint", 0.09,0.09,0.46,12, O.x1-0.40, y0+1.18, cz-2.9, "#b8302a");
  bx("metal", 0.08,0.10,0.08, O.x1-0.40, y0+1.46, cz-2.9, 0, 0, "#9aa1a6");
  // bulletin board and a stack of yellowed newspapers by the door
  push("art", boxGeo(0.05,0.62,0.92,0), O.x1-0.36, y0+1.72, cz+2.9, 0, "#5c4029");
  signPanel(0.52,0.80, signTex(256,384,(x,W,H)=>{
    x.fillStyle="#8a7a5e"; x.fillRect(0,0,W,H);
    const notes=[[18,22,90,64,"#efe9d8"],[122,16,104,72,"#e6d9a8"],[26,108,110,76,"#dfe6e4"],
                 [150,104,84,90,"#efe9d8"],[40,214,120,70,"#e6d9a8"],[168,212,64,58,"#dfe6e4"],
                 [30,300,90,58,"#efe9d8"],[136,296,96,66,"#e6d9a8"]];
    for(const n of notes){ x.save(); x.translate(n[0]+n[2]/2, n[1]+n[3]/2);
      x.rotate((Math.random()-0.5)*0.16); x.fillStyle=n[4];
      x.fillRect(-n[2]/2,-n[3]/2,n[2],n[3]);
      x.fillStyle="rgba(60,52,38,0.55)";
      for(let l=0;l<4;l++) x.fillRect(-n[2]/2+7, -n[3]/2+10+l*11, n[2]-16, 3);
      x.restore(); }
  }), O.x1-0.40, y0+1.72, cz+2.9, -Math.PI/2, false);
  for(let k=0;k<4;k++) bx("art", 0.32,0.035,0.24, O.x1-0.58, y0+0.03+k*0.036, cz+3.9, 0, 0, "#cfc6a4");
  // a floor ashtray urn, because every lobby had one
  cyl("metal", 0.15,0.18,0.66,12, O.x1-0.62, y0+0.33, cz+1.5, "#5b5f62");
  cyl("gravel", 0.13,0.13,0.05,12, O.x1-0.62, y0+0.68, cz+1.5, "#8a7a5e");
  addCol(O.x1-0.82,O.x1-0.42, cz+1.3, cz+1.7, y0, y0+0.7);
  bx("ceil", w-0.4, 0.10, d-0.4, cx, y0+h-0.16, cz, 0.42, 0, "#e8dfc8");     // ceiling
  /* THE WALL LINING, AND THE LESSON THAT KEEPS COSTING A ROUND.
     The dado below was carefully split round the apartment doorway. This
     course — the plaster above it — was not, and it ran the full width of
     the office straight across the opening at 1.29 to 3.39, eight
     centimetres proud of the wall. From inside the lobby it looked exactly
     like a wall where the door should be, which is what it was.
     A doorway is a hole in EVERY course. Not the one with the frame in it.
     The reason this one survived two rounds of probing is that the test
     prism only reached through the wall slab itself (z -1.22..-0.90); the
     lining stands clear of the wall on the room side, so the probe missed
     it. A clearance prism has to run a good metre into the room on BOTH
     sides of the opening, or it only ever proves the hole is a hole. */
  const LN=APT_DX-APT_DW/2-0.13, RN=APT_DX+APT_DW/2+0.13;
  for(const wl of [[(O.x0+0.25+LN)/2, O.z1-0.30, LN-O.x0-0.25, 0.06],
                   [(RN+O.x1-0.25)/2, O.z1-0.30, O.x1-0.25-RN, 0.06],
                   [(O.x0+glazeX0)/2, O.z0+0.30, glazeX0-O.x0-0.25, 0.06],
                   [(glazeX1+O.x1)/2, O.z0+0.30, O.x1-glazeX1-0.25, 0.06],
                   [O.x0+0.30,cz,0.06,d-0.5],
                   [O.x1-0.30,(O.z0+doorZ0)/2,0.06,doorZ0-O.z0-0.25],
                   [O.x1-0.30,(doorZ1+O.z1)/2,0.06,O.z1-doorZ1-0.25]])
    bx("roomwall", wl[2], h-1.35, wl[3], wl[0], y0+1.14+(h-1.35)/2, wl[1], 0.45, 0, "#ded3b6");
  // and the same course carried over the apartment head, clear of the opening
  { const hy0=y0+APT_DH+0.14, hy1=y0+1.14+(h-1.35);
    bx("roomwall", RN-LN, hy1-hy0, 0.06, (LN+RN)/2, (hy0+hy1)/2, O.z1-0.30, 0.45, 0, "#ded3b6"); }
  // header liner over the door, so the reveal reads as a doorway
  bx("roomwall", 0.06, h-2.34, doorZ1-doorZ0, O.x1-0.30, y0+2.20+(h-2.34)/2, cz, 0.45, 0, "#ded3b6");
  bx("oak", 0.30, 0.10, doorZ1-doorZ0+0.30, O.x1-0.16, y0+2.16, cz, 0.6, 0, "#5c4029");

  /* --- the kitsch: what actually makes a 1962 motel office ------------ */
  const O_=(bk,ww,hh,dd,px,py,pz,uv,c)=>bx(bk,ww,hh,dd,px,y0+py,pz,uv,0,c);
  const OC=(bk,rt,rb,hh,seg,px,py,pz,c,rx,rz)=>cyl(bk,rt,rb,hh,seg,px,y0+py,pz,c,rx,0,rz);
  // knotty-pine dado around the whole lobby, capped with a chair rail
  /* NB: split around EVERY doorway — a chair rail must never span one. The
     east entrance and the shopfront were already broken round; the door
     through to the manager's apartment is new in this wall, and the north
     run went straight across it at 1.18, which is precisely the chrome-bar
     -across-the-diner-door mistake in a different room. clear36.js caught
     it before it shipped, which is the whole reason that probe exists. */
  const NL=LN, NR=RN;
  const dadoRuns=[[(O.x0+0.25+NL)/2, O.z1-0.24, NL-O.x0-0.25, 0.10],
                  [(NR+O.x1-0.25)/2, O.z1-0.24, O.x1-0.25-NR, 0.10],
                  [(O.x0+glazeX0)/2, O.z0+0.24, glazeX0-O.x0-0.25, 0.10],   // split around
                  [(glazeX1+O.x1)/2, O.z0+0.24, O.x1-glazeX1-0.25, 0.10],   // the shopfront
                  [O.x0+0.24,cz,0.10,d-0.5],
                  [O.x1-0.24,(O.z0+doorZ0)/2,0.10,doorZ0-O.z0-0.25],
                  [O.x1-0.24,(doorZ1+O.z1)/2,0.10,O.z1-doorZ1-0.25]];
  for(const wl of dadoRuns){
    O_("oak", wl[2],1.14,wl[3], wl[0],0.57,wl[1], 0.7, "#7a5636");
    O_("oak", wl[2]+0.06,0.09,wl[3]+0.06, wl[0],1.18,wl[1], 0.7, "#5c4029");
  }
  // wagon-wheel chandelier over the lobby
  push("oak", new T.TorusGeometry(0.62,0.055,8,20), cx+1.2, y0+h-0.60, cz+0.4, 0, "#5c4029", Math.PI/2);
  for(let k=0;k<6;k++){
    const a=k*Math.PI/3;
    // each spoke spans the full diameter, so only three of them are drawn —
    // six would lay the second three exactly on top of the first three
    if(k<3) push("oak", boxGeo(1.20,0.05,0.05,0), cx+1.2, y0+h-0.60, cz+0.4, a, "#5c4029");
    push("lampshade", new T.CylinderGeometry(0.05,0.06,0.16,8),
         cx+1.2+Math.cos(a)*0.52, y0+h-0.50, cz+0.4+Math.sin(a)*0.52, 0, "#f0e0b0");
  }
  OC("metal", 0.02,0.02,0.50,6, cx+1.2, h-0.30, cz+0.4, "#6b6f72");
  /* The office read as one flat wash of amber, then as a room lit by three
     neutral fills, which is the same problem the other way: an evenly lit box
     is an office at four in the afternoon and nothing else. What makes a room
     cosy is not more light, it is fewer sources that fall off faster — a warm
     pool under the chandelier, a second under the desk lamp, a third at the
     sofa, and dimmer air between them. The one cool source stays, because it
     is daylight off the shopfront and the room would be a cave without it. */
  LAMPS.push({x:cx+1.2, y:y0+h-0.78, z:cz+0.4, color:0xffe2b0, intensity:0.62,
              dist:9.5, decay:1.9, indoor:true});                   // the chandelier
  LAMPS.push({x:O.x1-2.4, y:y0+2.10, z:O.z0+1.40, color:0xdde8f0, intensity:0.22,
              dist:12, decay:1.6, indoor:true});                    // daylight off the glass
  LAMPS.push({x:O.x0+4.4, y:y0+1.95, z:(O.z0+O.z1)/2, color:0xffd9a2, intensity:0.30,
              dist:8.0, decay:1.9, indoor:true});
  LAMPS.push({x:O.x1-4.6, y:y0+1.90, z:O.z1-2.2, color:0xffd296, intensity:0.26,
              dist:7.5, decay:1.9, indoor:true});
  /* And a banker's lamp on the desk, which is the one fitting that makes a
     room read as an office AND as somewhere somebody sits: a green glass
     shade throws a small hard pool on the register and leaves everything
     past the counter to the chandelier. */
  {
    const lx=dx-0.10, lz=cz+1.55;
    OC("metal", 0.085,0.095,0.022,14, lx, 1.228, lz, "#8a6a2e");       // the foot
    OC("metal", 0.016,0.016,0.24,8,  lx, 1.35, lz, "#8a6a2e");         // the stem
    push("lampshade", new T.CylinderGeometry(0.115,0.115,0.10,16,1,true),
         lx, y0+1.485, lz, 0, "#2f5f42", Math.PI/2, 0);                // the shade
    push("lampshade", boxGeo(0.30,0.02,0.16,0), lx, y0+1.535, lz, 0, "#2f5f42");
    for(const q of [-1,1])
      push("lampshade", boxGeo(0.02,0.11,0.16,0), lx+q*0.15, y0+1.485, lz, 0, "#2a5439");
    OC("metal", 0.012,0.012,0.09,8, lx, 1.30, lz+0.07, "#8a6a2e", Math.PI/2);
    LAMPS.push({x:lx, y:y0+1.40, z:lz, color:0xffdda6, intensity:0.42,
                dist:3.4, decay:2.2, indoor:true});
  }
  // longhorn skull over the key board, and a jackalope beside it
  O_("paint", 0.22,0.26,0.52, O.x0+0.40, 2.30, cz-1.6, 0, "#e6e0cc");
  for(const sd of [-1,1]){
    push("paint", new T.TorusGeometry(0.30,0.035,6,12), O.x0+0.42, y0+2.42, cz-1.6+sd*0.34,
         0, "#e6e0cc", Math.PI/2, sd*0.6);
  }
  O_("oak", 0.10,0.30,0.26, O.x0+0.40, 2.28, cz+2.4, 0, "#5c4029");
  O_("paint", 0.18,0.22,0.20, O.x0+0.46, 2.46, cz+2.4, 0, "#7a5b3a");
  for(const sd of [-1,1]) O_("paint", 0.05,0.34,0.05, O.x0+0.50, 2.72, cz+2.4+sd*0.08, 0, "#c8b48a");
  // a big saguaro in a terracotta pot by the glass
  const cacX=O.x1-1.15, cacZ=O.z0+0.95;
  OC("gravel", 0.40,0.30,0.50,14, cacX, 0.25, cacZ, "#a35a34");
  OC("gravel", 0.36,0.36,0.08,14, cacX, 0.53, cacZ, "#7c6a4a");
  OC("foliage", 0.21,0.25,1.70,12, cacX, 1.35, cacZ, "#4f6b3a");
  for(const sd of [-1,1]){
    OC("foliage", 0.13,0.15,0.62,10, cacX+sd*0.34, 1.50, cacZ, "#4f6b3a", 0,Math.PI/2);
    OC("foliage", 0.12,0.14,0.78,10, cacX+sd*0.62, 1.86, cacZ, "#4f6b3a");
    push("foliage", new T.SphereGeometry(0.13,10,8), cacX+sd*0.62, y0+2.25, cacZ, 0, "#57713f");
  }
  push("foliage", new T.SphereGeometry(0.22,12,9), cacX, y0+2.20, cacZ, 0, "#57713f");
  addCol(cacX-0.44, cacX+0.44, cacZ-0.44, cacZ+0.44, y0, y0+2.3);

  // rotating postcard rack
  OC("metal", 0.05,0.05,1.55,8, O.x1-1.5, 0.78, cz-2.8, "#8f9aa0");
  // Each card faces radially outward: a plane with yaw f has normal
  // (sin f, 0, cos f), so f = pi/2 - a puts it square to the radius. Four
  // tiers, and each tier carries one of the four brochures the wall rack
  // did not get.
  for(let t=0;t<4;t++) for(let k=0;k<4;k++){
    const a=k*Math.PI/2+t*0.2, f=Math.PI/2-a;
    const px=O.x1-1.5+Math.cos(a)*0.155, pz=cz-2.8+Math.sin(a)*0.155;
    push("art", boxGeo(0.135,0.30,0.012,0), px, y0+0.70+t*0.325, pz, f, "#d8d2c0");
    push("pic:brochure:"+(6+t), planeGeo(0.132,0.297,0), px+Math.cos(a)*0.011,
         y0+0.70+t*0.325, pz+Math.sin(a)*0.011, f, "#ffffff");
  }
  addCol(O.x1-1.85,O.x1-1.15, cz-3.15, cz-2.45, y0, y0+1.6);
  /* Soda and cigarette machines, shifted two metres west. They used to sit
     either side of where the apartment door now is, and between them and
     the north end of the desk they closed the approach to it. West of the
     desk they are out of everyone's way: behind the counter is staff side,
     and nobody has to squeeze past them to get anywhere. */
  O_("paint", 1.00,1.86,0.66, O.x0+2.6, 0.93, O.z1-0.58, 0, "#8f2c22");
  push("pic:vendFront:snack", planeGeo(0.76,1.52,0), O.x0+2.6, y0+1.04, O.z1-0.955,
       Math.PI, "#ffffff");
  addCol(O.x0+2.1,O.x0+3.1, O.z1-1.0, O.z1-0.3, y0, y0+1.9);
  O_("paint", 0.62,1.40,0.46, O.x0+3.7, 0.70, O.z1-0.48, 0, "#3a4a52");
  O_("metal", 0.54,0.10,0.04, O.x0+3.7, 1.16, O.z1-0.74, 0, "#b8bcbc");
  addCol(O.x0+3.4,O.x0+4.0, O.z1-0.8, O.z1-0.25, y0, y0+1.5);
  // payphone by the door
  O_("paint", 0.30,0.56,0.20, O.x1-0.36, 1.42, cz-1.6, 0, "#22303a");
  O_("paint", 0.10,0.24,0.08, O.x1-0.52, 1.44, cz-1.6, 0, "#12191f");
  // framed road map and an aerial of the property, both drawn in canvas
  const mapTex=hosted("map", signTex(512,384,(x,W,H)=>{
    x.fillStyle="#e6dcbe"; x.fillRect(0,0,W,H);
    x.strokeStyle="#b9ac86"; x.lineWidth=1;
    for(let i=0;i<26;i++){ x.beginPath(); x.moveTo(0,i*15); x.lineTo(W,i*15+((i*37)%25)-12); x.stroke(); }
    x.strokeStyle="#c3311f"; x.lineWidth=5;                       // the highways
    x.beginPath(); x.moveTo(0,214); x.bezierCurveTo(150,190,320,250,W,206); x.stroke();
    x.beginPath(); x.moveTo(206,0); x.bezierCurveTo(232,120,180,250,244,H); x.stroke();
    x.strokeStyle="#3f6ea8"; x.lineWidth=3;
    x.beginPath(); x.moveTo(0,60); x.bezierCurveTo(160,120,300,70,W,140); x.stroke();
    x.fillStyle="#2f2a20";
    for(const t of [[70,150,"GALLUP"],[250,120,"GRANTS"],[380,250,"LAGUNA"],[150,300,"ZUNI"],[420,90,"THOREAU"]]){
      x.beginPath(); x.arc(t[0],t[1],5,0,7); x.fill();
      x.font="700 15px 'JetBrains Mono', monospace"; x.textAlign="left";
      x.fillText(t[2], t[0]+9, t[1]+5);
    }
    x.fillStyle="#13405e"; fitText(x,"NEW MEXICO", W*0.5, 34, W*0.30, 36);
    x.strokeStyle="#8a7e5e"; x.lineWidth=8; x.strokeRect(4,4,W-8,H-8);
  }));
  const aerialTex=hosted("aerial", signTex(512,384,(x,W,H)=>{
    x.fillStyle="#b9a075"; x.fillRect(0,0,W,H);                    // desert
    for(let i=0;i<2600;i++){ x.fillStyle="rgba(0,0,0,"+(Math.random()*0.10).toFixed(2)+")";
      x.fillRect(Math.random()*W, Math.random()*H, 2,2); }
    x.fillStyle="#3b3833"; x.fillRect(28,300,456,34);              // the highway
    x.fillStyle="#d6c07a"; for(let px2=36;px2<484;px2+=26) x.fillRect(px2,315,14,3);
    x.fillStyle="#4a4642"; x.fillRect(52,120,392,168);             // the lot
    x.fillStyle="#8e9cb4"; x.fillRect(70,58,300,50);               // wing A
    x.fillStyle="#5f829a"; x.fillRect(66,50,308,14);
    x.fillStyle="#8e9cb4"; x.fillRect(352,58,52,206);              // wing B
    x.fillStyle="#5f829a"; x.fillRect(346,54,14,214);
    x.fillStyle="#8e9cb4"; x.fillRect(52,196,74,58);               // the office
    x.fillStyle="#416b56"; x.fillRect(46,190,86,14);
    x.fillStyle="#b3ada0"; x.fillRect(196,128,132,62);             // pool deck
    x.fillStyle="#2f9fc9"; x.fillRect(214,140,96,38);              // the water
    x.fillStyle="#cfd4d6";
    for(let k=0;k<7;k++) x.fillRect(78+k*38, 234, 22, 12);         // cars
    for(let k=0;k<4;k++) x.fillRect(360+k*0, 150+k*26, 12, 20);
    x.fillStyle="rgba(0,0,0,0.22)"; x.fillRect(70,108,300,10);     // shadow under the eave
    x.fillStyle="#f1ead6"; x.fillRect(0,H-40,W,40);
    x.fillStyle="#13405e"; fitText(x,"LOW DESERT MOTEL  ·  ROUTE 66", W*0.86, 26, W/2, H-20);
  }));
  push("art", boxGeo(0.05,0.64,0.92,0), O.x1-0.36, y0+2.02, cz+1.5, 0, "#5c4029");
  signPanel(0.84,0.56, mapTex, O.x1-0.40, y0+2.02, cz+1.5, -Math.PI/2, false);
  push("art", boxGeo(1.20,0.92,0.05,0), O.x0+7.2, y0+2.00, O.z1-0.38, 0, "#5c4029");
  signPanel(1.04,0.78, aerialTex, O.x0+7.2, y0+2.00, O.z1-0.42, Math.PI, false);
  push("art", boxGeo(0.05,0.44,0.60,0), O.x1-0.36, y0+2.06, cz+4.0, 0, "#9a7a4c");
  // a second framed map on the north wall, beside the aerial
  push("art", boxGeo(0.68,0.48,0.05,0), O.x0+9.4, y0+2.02, O.z1-0.38, 0, "#7a6a4c");
  signPanel(0.60,0.40, mapTex, O.x0+9.4, y0+2.02, O.z1-0.42, Math.PI, false);
  // television on a bracket in the corner
  O_("metal", 0.30,0.06,0.30, O.x1-1.4, 2.10, O.z1-0.7, 0, "#8f9aa0");
  O_("paint", 0.56,0.46,0.52, O.x1-1.4, 2.36, O.z1-0.7, 0, "#2f2f2e");
  push("paint", boxGeo(0.46,0.36,0.03,0), O.x1-1.4, y0+2.36, O.z1-0.97, 0, "#191919");
  push("pic:tv:2", planeGeo(0.40,0.30,0), O.x1-1.4, y0+2.36, O.z1-0.995, Math.PI, "#ffffff");
  // rag rug, guest register, mint bowl, desk fan, NO VACANCY box in the window
  O_("fabric", 2.80,0.03,2.30, O.x1-3.6, 0.04, O.z0+1.9, 0, "#6f4a42");
  O_("fabric", 2.36,0.01,1.86, O.x1-3.6, 0.055, O.z0+1.9, 0, "#8a6f52");
  // magazines on the coffee table, a hat rack by the door, a print on the north wall
  O_("art", 0.30,0.02,0.22, O.x1-3.7, 0.50, O.z0+2.70, 0, "#c9a24b");
  O_("art", 0.28,0.02,0.20, O.x1-3.5, 0.53, O.z0+2.64, 0, "#3f6ea8");
  OC("metal", 0.05,0.05,1.75,8, O.x1-0.9, 0.88, O.z1-2.2, "#6b6156");
  for(let k=0;k<3;k++){ const a=k*2.09;
    O_("metal", 0.16,0.05,0.05, O.x1-0.9+Math.cos(a)*0.10, 1.66, O.z1-2.2+Math.sin(a)*0.10, 0, "#6b6156"); }
  O_("paint", 0.34,0.14,0.34, O.x1-0.9, 1.80, O.z1-2.2, 0, "#8a6a3c");
  // hung clear above the machines, not behind them
  push("oak", boxGeo(1.14,0.78,0.04,0), O.x0+5.2, y0+2.50, O.z1-0.38, 0, "#7a6a4c");
  push("pic:artLand:office", planeGeo(1.05,0.70,0), O.x0+5.2, y0+2.50, O.z1-0.405,
       Math.PI, "#ffffff");
  O_("paint", 0.42,0.06,0.32, O.x0+3.3, 1.24, cz+0.2, 0, "#e6e0cc");
  O_("oak",   0.44,0.04,0.34, O.x0+3.3, 1.21, cz+0.2, 0.6, "#4a3524");
  push("bin", new T.SphereGeometry(0.10,10,8), O.x0+3.3, y0+1.24, cz-1.9, 0, "#cfe0e6");
  OC("metal", 0.13,0.13,0.05,12, O.x0+3.2, 1.36, cz+1.6, "#8f9aa0", Math.PI/2);
  OC("metal", 0.02,0.02,0.22,6, O.x0+3.2, 1.28, cz+1.6, "#8f9aa0");
  push("neonbox", boxGeo(0.92,0.30,0.05,0), O.x1-3.0, y0+2.60, O.z0+0.42, 0, "#ff5a3a");
  /* --- the working side of the desk -------------------------------------
     A front desk is not a counter with a bell on it. It is somebody's desk,
     and everything on it is there because it gets used every day.        */
  (function(){
    const tY=y0+1.21, ax2=dx-0.06;                 // the counter top, staff side
    // an adding machine with a tail of tape
    O_("paint", 0.22,0.11,0.30, ax2-0.18, 1.27, cz-1.62, 0, "#d8d2c0");
    O_("paint", 0.20,0.05,0.12, ax2-0.18, 1.35, cz-1.72, 0, "#3a3b3d");
    for(let r=0;r<3;r++) for(let c=0;c<4;c++)
      push("plaster", new T.CylinderGeometry(0.013,0.013,0.010,8),
           ax2-0.25+c*0.045, tY+0.115, cz-1.56+r*0.055, 0, "#4a4a48", Math.PI/2, 0);
    for(let i=0;i<7;i++)                            // the tape, run out on the floor
      push("paper", planeGeo(0.045,0.14,0), ax2-0.18+Math.sin(i*1.1)*0.05,
           tY+0.06-i*0.16, cz-1.50-i*0.03, i*0.5, "#efeade", -0.4+i*0.12, 0.2);
    // the knuckle-buster, for the cards nobody takes any more
    O_("metal", 0.26,0.07,0.17, ax2-0.16, 1.245, cz-0.38, 0, "#4e5458");
    O_("metal", 0.22,0.04,0.05, ax2-0.16, 1.295, cz-0.30, 0, "#8d9498");
    push("metal", boxGeo(0.10,0.03,0.19,0), ax2-0.30, tY+0.075, cz-0.38, 0.1, "#8d9498");
    // a receipt spike, a stamp and its pad, a tray of matchbooks
    OC("metal", 0.030,0.030,0.012,10, ax2+0.14, 1.216, cz-0.02, "#8d9498");
    OC("metal", 0.0045,0.0045,0.16,6, ax2+0.14, 1.29, cz-0.02, "#8d9498");
    for(let i=0;i<9;i++)
      push("paper", planeGeo(0.085,0.11,0), ax2+0.14, tY+0.010+i*0.004, cz-0.02, i*0.8,
           "#efeade", -Math.PI/2+0.04, 0);
    O_("oak", 0.09,0.07,0.06, ax2-0.02, 1.245, cz+0.30, 0, "#4a3524");
    O_("oak", 0.05,0.05,0.04, ax2-0.02, 1.30, cz+0.30, 0, "#6a4b30");
    O_("paint", 0.13,0.03,0.10, ax2+0.11, 1.225, cz+0.30, 0, "#2b2f33");
    O_("metal", 0.17,0.02,0.13, ax2+0.11, 1.243, cz+0.30, 0, "#8d9498");
    O_("oak", 0.18,0.035,0.14, ax2+0.30, 1.228, cz+0.62, 0.6, "#4a3524");
    for(let i=0;i<8;i++)
      push("paper", boxGeo(0.035,0.012,0.045,0), ax2+0.24+((i%4)*0.035), tY+0.030+((i/4)|0)*0.013,
           cz+0.58+((i%2)*0.05), i*0.4, ["#c8342a","#e0c04a","#2f5e8a"][i%3]);
    // a pen on a chain, because they walked
    OC("metal", 0.012,0.012,0.11,7, dx+0.30, 1.265, cz+1.42, "#2b2f33", 0.5, 0.3);
    for(let i=0;i<8;i++)
      push("metal", new T.TorusGeometry(0.010,0.0028,4,7), dx+0.34+i*0.022,
           tY+0.035-i*0.004, cz+1.44+i*0.012, i*0.7, "#9aa1a6", 1.2, 0.3);
    // a jar of something nobody has taken one of in years
    OC("glass", 0.085,0.075,0.20,14, dx+0.26, 1.31, cz+1.90, "#d8dcd4");
    OC("paint", 0.088,0.088,0.025,14, dx+0.26, 1.425, cz+1.90, "#8a2a22");
    for(let i=0;i<11;i++)
      push("paint", new T.SphereGeometry(0.022,7,5), dx+0.26+Math.cos(i*2.1)*0.045,
           y0+1.25+((i/4)|0)*0.045, cz+1.90+Math.sin(i*2.1)*0.045, 0,
           ["#e0c04a","#c8342a","#4f8a4a","#e08a2a"][i%4]);
    // PLEASE RING FOR SERVICE, propped against the register
    push("art", boxGeo(0.26,0.16,0.02,0), dx+0.22, y0+1.34, cz+0.72, 0, "#efeade", -0.34, 0);
    for(let i=0;i<3;i++)
      push("soot", planeGeo(0.18,0.018,0), dx+0.208, y0+1.37-i*0.035, cz+0.715, 0,
           "#3a352e", -0.34, 0);
    // an ashtray that belongs to whoever works nights
    push("glass", new T.CylinderGeometry(0.075,0.058,0.030,12), ax2-0.02, tY+0.015,
         cz-2.30, 0, "#cfe0e6");
    push("paint", new T.CylinderGeometry(0.009,0.009,0.075,7), ax2-0.05, tY+0.028,
         cz-2.30, 0, "#efeade", 0, Math.PI/2);
    // burns along the edge, from sixty years of the same thing
    for(let i=0;i<9;i++)
      push("soot", planeGeo(0.055,0.016,0), dx+0.58, tY+0.056, cz-2.6+i*0.62, i*0.3,
           "#2e2822", -Math.PI/2, 0);
    // a card index of everyone who ever stayed
    O_("metal", 0.20,0.13,0.42, dx-0.22, 1.275, cz+2.44, 0, "#6f767a");
    for(let i=0;i<22;i++)
      push("paper", planeGeo(0.16,0.10,0), dx-0.22, y0+1.295, cz+2.25+i*0.017, 0,
           "#efeade", 0, 0);
    // a fan that has been oscillating since 1974
    OC("metal", 0.17,0.19,0.03,14, dx-0.22, 1.23, cz+2.72, "#6b6156");
    OC("metal", 0.026,0.026,0.24,8, dx-0.22, 1.36, cz+2.72, "#6b6156");
    push("metal", new T.CylinderGeometry(0.075,0.075,0.14,12), dx-0.24, y0+1.54, cz+2.72,
         0, "#6f767a", 0, Math.PI/2);                       // just the motor
    for(let i=0;i<3;i++)
      push("metal", boxGeo(0.014,0.30,0.075,0), dx-0.29, y0+1.54, cz+2.72, i*2.09,
           "#b8bcbc", 0, 0.32);
    for(let i=0;i<4;i++)                                    // and a wire guard you see through
      push("metal", new T.TorusGeometry(0.055+i*0.045,0.0045,4,16), dx-0.33, y0+1.54,
           cz+2.72, 0, "#9aa1a6", 0, Math.PI/2);
    for(let i=0;i<8;i++)
      push("metal", boxGeo(0.005,0.38,0.005,0), dx-0.33, y0+1.54, cz+2.72, 0, "#9aa1a6",
           0, i*0.393);
    // a radio on the back shelf, tuned to whatever still comes in
    O_("oak", 0.20,0.15,0.30, O.x0+0.78, 1.52, cz+1.30, 0.6, "#6a4b30");
    O_("paint", 0.03,0.10,0.22, O.x0+0.66, 1.53, cz+1.30, 0, "#d8cfae");
    OC("metal", 0.026,0.026,0.026,10, O.x0+0.67, 1.44, cz+1.18, "#8d9498", 0, Math.PI/2);
    OC("metal", 0.006,0.006,0.44,6, O.x0+0.80, 1.80, cz+1.42, "#b8bcbc", 0.4, 0.25);
    // and the cat, which has the warm end of the counter
    (function(){
      const kx=dx+0.06, kz=cz-2.86, ky=y0+1.30;
      const GIN="#9a7a4e", DRK="#6a5236";
      const bdy=new T.SphereGeometry(0.15,12,9); bdy.scale(1.5,0.78,0.92);
      push("fabric", bdy, kx, ky, kz, 0.4, GIN);
      for(let i=0;i<5;i++)                         // and he is a tabby
        push("fabric", boxGeo(0.035,0.055,0.20,0), kx-0.13+i*0.065, ky+0.085,
             kz+0.03, 0.4, DRK, 0, 0);
      push("fabric", new T.SphereGeometry(0.086,11,8), kx+0.20, ky+0.055, kz+0.08, 0, GIN);
      push("fabric", new T.SphereGeometry(0.042,9,7), kx+0.27, ky+0.030, kz+0.11, 0, "#e2d8c4");
      for(const q of [-1,1])
        push("fabric", new T.ConeGeometry(0.038,0.070,5), kx+0.19+q*0.020, ky+0.125,
             kz+0.08+q*0.058, 0, DRK, 0.2*q, 0.2);
      for(let i=0;i<7;i++)                         // the tail, curled round
        push("fabric", new T.SphereGeometry(0.032-i*0.0022,7,5),
             kx-0.20-Math.sin(i*0.55)*0.13, ky-0.035, kz-0.05+Math.cos(i*0.55)*0.14,
             0, i%2?GIN:DRK);
    })();
  })();

  /* --- the rest of the room --------------------------------------------- */
  // a door to whatever is behind the desk, which is not for guests
  (function(){
    const px2=O.x0+0.11, pz2=cz-3.90;
    bx("oak", 0.10, 2.06, 0.94, px2, y0+1.03, pz2, 0.5, 0, "#6a4b30");
    bx("teal", 0.05, 2.14, 1.06, px2+0.07, y0+1.07, pz2, 0.5, 0, TEAL_D);
    push("metal", new T.SphereGeometry(0.042,10,8), px2+0.12, y0+1.02, pz2+0.36,
         0, "#caa23c");
    push("art", boxGeo(0.02,0.11,0.20,0), px2+0.10, y0+1.54, pz2, 0, "#efeade");
    for(let i=0;i<2;i++)
      push("soot", planeGeo(0.016,0.13,0), px2+0.112, y0+1.57-i*0.055, pz2, Math.PI/2,
           "#3a352e", 0, 0);
    push("soot", planeGeo(0.70,0.04,0), px2+0.16, y0+0.03, pz2, Math.PI/2, "#d8cf9a",
         -Math.PI/2, 0);                            // the light under it
  })();
  // guests, over thirty summers, pinned up by the door
  (function(){
    const nx2=O.x1-0.30, nz2=cz+2.54;
    push("oak", boxGeo(0.05,0.86,1.30,0), nx2, y0+1.74, nz2, 0, "#5b4632");
    push("bath", boxGeo(0.02,0.76,1.20,0), nx2-0.035, y0+1.74, nz2, 0, "#8a7f63");
    for(let i=0;i<19;i++){
      const pw=0.08+((i*7)%4)*0.026, ph=pw*1.2;
      push("paper", planeGeo(pw,ph,0), nx2-0.05-i*0.0006, y0+1.44+((i*0.21)%0.58),
           nz2-0.50+((i*0.31)%1.00), -Math.PI/2, "#efeade", 0, ((i*11)%7-3)*0.09);
      if(i%3===0) push("plaster", new T.CylinderGeometry(0.007,0.007,0.010,6),
                       nx2-0.062, y0+1.44+((i*0.21)%0.58)+ph*0.42, nz2-0.50+((i*0.31)%1.00),
                       0, ["#c8342a","#2f5e8a","#e0c04a"][i%3], 0, Math.PI/2);
    }
  })();
  // venetian blinds over the bay nearest the desk, half drawn
  for(let i=0;i<13;i++)
    push("paint", boxGeo(0.02,0.045,2.30,0), O.x1-0.14, y0+2.44-i*0.075, O.z0+2.60,
         0, "#d8d2c0", 0, 0.34);
  push("paint", boxGeo(0.06,0.09,2.36,0), O.x1-0.14, y0+2.52, O.z0+2.60, 0, "#c8c2ae");
  push("metal", new T.CylinderGeometry(0.005,0.005,0.60,6), O.x1-0.17, y0+2.16, O.z0+1.46,
       0, "#9aa1a6");
  // a floor fan in the corner, and the extension lead it runs off
  (function(){
    const fx2=O.x1-1.05, fz2=O.z1-1.10;
    OC("metal", 0.24,0.26,0.05,14, fx2, 0.025, fz2, "#5f676b");
    OC("metal", 0.030,0.030,0.72,8, fx2, 0.39, fz2, "#5f676b");
    push("metal", new T.CylinderGeometry(0.085,0.085,0.16,12), fx2, y0+0.86, fz2, 0.6,
         "#6f767a", 0, Math.PI/2);
    for(let i=0;i<3;i++)
      push("metal", boxGeo(0.016,0.34,0.085,0), fx2-0.03, y0+0.86, fz2, i*2.09+0.6,
           "#b8bcbc", 0, 0.32);
    for(let i=0;i<4;i++)
      push("metal", new T.TorusGeometry(0.062+i*0.052,0.005,4,16), fx2-0.08, y0+0.86, fz2,
           0.6, "#9aa1a6", 0, Math.PI/2);
    for(let i=0;i<8;i++)
      push("metal", boxGeo(0.006,0.44,0.006,0), fx2-0.08, y0+0.86, fz2, 0.6, "#9aa1a6",
           0, i*0.393);
    for(let i=0;i<8;i++)
      push("teal", boxGeo(0.42,0.014,0.014,0), fx2-0.30-i*0.40, y0+0.012,
           fz2+0.10+Math.sin(i*0.9)*0.16, Math.sin(i*0.9)*0.4, "#2e2a26");
    addCol(fx2-0.28, fx2+0.28, fz2-0.28, fz2+0.28, y0, y0+1.0);
  })();
  // the papers nobody took, and the mat they are standing on
  push("soot", planeGeo(1.30,0.85,0), O.x1-0.90, y0+0.012, cz-0.40, 0, "#4a443a",
       -Math.PI/2, 0);
  for(let i=0;i<7;i++)
    push("paper", boxGeo(0.30,0.012,0.24,0), O.x1-1.80, y0+0.018+i*0.012, cz+3.30,
         ((i*7)%5-2)*0.06, "#ded6c0");
  // the ceiling has been letting go over the corner for years
  for(let i=0;i<3;i++)
    push("soot", planeGeo(1.5-i*0.34, 1.2-i*0.28, 0), O.x0+2.1, y0+h-0.075+i*0.004,
         O.z1-1.9, i*0.6, "#8a7a56", Math.PI/2, 0);
  cyl("bin", 0.15,0.13,0.20,12, O.x0+2.1, y0+0.10, O.z1-1.9, "#5f676b");
  push("glass", new T.CylinderGeometry(0.115,0.115,0.05,12), O.x0+2.1, y0+0.13, O.z1-1.9,
       0, "#9ab4b8");
  // something green that has outlived three owners
  (function(){
    const gx=O.x1-1.30, gz=O.z0+0.80;
    OC("gravel", 0.24,0.19,0.36,14, gx, 0.18, gz, "#a35a34");
    OC("gravel", 0.26,0.26,0.05,14, gx, 0.375, gz, "#8a6a4c");
    for(let i=0;i<9;i++){
      const a=i*0.72, lean=0.5+((i*5)%4)*0.16, L=0.34+((i*7)%4)*0.13;
      const si=Math.sin(lean), co=Math.cos(lean);
      push("foliage", boxGeo(0.11, L, 0.012, 0), gx+Math.sin(a)*si*L/2,
           y0+0.40+co*L/2, gz+Math.cos(a)*si*L/2, a, "#3f6b3a", lean, 0);
    }
    addCol(gx-0.28, gx+0.28, gz-0.28, gz+0.28, y0, y0+0.9);
  })();

  /* Three ceiling pans. The rest of this room was relit round a warm pool
     under the chandelier, one at the desk and one at the sofa — and then
     these three went on throwing 0.62 of near-white sixteen metres with a
     decay of 1.2, which is a flat even wash over the whole box and undoes
     every one of them. An office ceiling fitting is still a ceiling
     fitting, so they stay on: warmer, a third as bright, and falling off
     fast enough to leave dim air between them. */
  for(const p of [[O.x0+2.6,cz-2.4],[O.x0+6.4,cz],[O.x1-2.4,cz+2.2]]){
    push("ceilfix", new T.CylinderGeometry(0.34,0.40,0.14,14), p[0], y0+h-0.30, p[1], 0, "#e8d4ac");
    LAMPS.push({x:p[0], y:y0+h-0.45, z:p[1], color:0xffe6c2, intensity:0.34, dist:9.0, decay:1.9, indoor:true});
  }
})();

/* --- cars you can get into ---------------------------------------------
   Same body language as before — an interpenetrating stack of primitives,
   chrome bumpers, lens pieces, wheels inset into the flanks — but each car
   is now its own Group rather than a contribution to the world's merge
   buckets, because a thing you can drive away cannot be baked into the
   scenery. Per car that is two body meshes (opaque and glass, both vertex
   coloured off three shared materials) and four wheels that steer and roll.
   Frustum culling keeps the draw calls to whatever is actually in front of
   you, which in a parking lot is a handful.                              */
const CAR_BODY_MAT =new T.MeshStandardMaterial({vertexColors:true, roughness:0.38, metalness:0.34});
const CAR_GLASS_MAT=new T.MeshStandardMaterial({vertexColors:true, transparent:true, opacity:0.80,
                          roughness:0.08, metalness:0.45});
const CAR_WHEEL_MAT=new T.MeshStandardMaterial({vertexColors:true, map:TEX.rubber, roughness:0.95});
const CARS=[];
let driving=null;                       // the car you are sitting in, or null

/* Tuning. Suspension rest length and wheel radius set where the chassis
   floats: at equilibrium each spring carries a quarter of the weight, so it
   sits mass*g/(4*springK) into its travel, and the body rides that much
   lower than its rest length. CAR_RIDE is that number worked out once so the
   parked cars stand at exactly the height the physics will hold them at —
   otherwise every car drops or jumps the moment you get in.            */
const CARC={ mass:1200, engineForce:9000, brakeConstant:12000, dragConstant:5.0,
             rollingResist:15.0, corneringFront:-5.0, corneringRear:-5.2,
             maxGrip:2.6, maxSteer:0.42, steerSpeedBias:40,
             restLength:0.34, springK:34000, damping:4200, wheelRadius:0.36,
             gravity:9.81 };
const CAR_WHEEL_Y=-0.35;                                   // mount, in car space
const CAR_SAG=CARC.mass*CARC.gravity/(4*CARC.springK);
const CAR_RIDE=(CARC.restLength-CAR_SAG+CARC.wheelRadius)-CAR_WHEEL_Y;
(function parkedCars(){
  const BODY=["#7c1f14","#21386e","#b0b3b8","#2f5a34","#8a5a1e","#3a3735","#a8452b","#6d6b5e"];
  const GLASS="#20303a", TYRE="#0c0b0a", HUB="#9a9284", CHR="#b8b0a0";
  const R=0.36, HW=0.90, WB=1.56;            // wheel radius, track, wheelbase
  // Where the chassis floats above the ground once the springs have taken
  // the weight, and how far the hub hangs below its mount at that point.
  const RIDE=CAR_RIDE, REST_DROP=R-RIDE;
  // [x, z, yaw, kind]   kind 0 sedan · 1 pickup · 2 van
  const SLOTS=[
    [-44.6,-35.6, 0.02, 0],[-38.8,-35.6,-0.03, 1],[-15.9,-35.6, 0.01, 0],
    [  7.3,-35.6, 0.04, 2],[ 24.7,-35.6,-0.02, 0],
    [-27.2,-26.4, 0.00, 1],[ -4.2,-26.4, 0.03, 0],[ 15.2,-26.4,-0.01, 0],
    [-18.0,  8.70, 0.02, 0],[ -9.6,  8.70,-0.02, 1],
    [ 21.4,-12.0, Math.PI/2+0.02, 0],[ 21.4,-19.0, Math.PI/2-0.02, 2],
    [-27.4, -3.2, Math.PI/2, 0],   // pulled up under the porte-cochere
    // and four in front of the bar next door
    [-92.0,-36.6, 0.02, 1],[-86.2,-36.6,-0.03, 0],[-71.8,-36.6, 0.03, 2],
    [-93.6,-21.4, Math.PI/2-0.02, 0],
  ];
  // Local car space, origin at the chassis centre of mass: x right, y up,
  // z forward, with the wheels' rest height taken off so the suspension has
  // somewhere to move. The old builder wrote straight to world coordinates.
  const _ce=new T.Euler(), _cq=new T.Quaternion(), _cs=new T.Vector3(1,1,1);
  const ent=(list,geo,x,y,z,ry,color,rx,rz)=>{
    _ce.set(rx||0, ry||0, rz||0, "YXZ"); _cq.setFromEuler(_ce);
    list.push({geo:geo, matrix:new T.Matrix4().compose(new T.Vector3(x,y,z), _cq, _cs),
               color:color?new T.Color(color):null});
  };
  // one wheel, axle along local X so steering is a Y turn and rolling an X one
  const wheelGeo=(()=>{
    const L=[];
    ent(L, new T.CylinderGeometry(R,R,0.30,18), 0,0,0, 0, TYRE, 0, Math.PI/2);
    ent(L, new T.CylinderGeometry(R*0.64,R*0.64,0.315,16), 0,0,0, 0, "#cdc8ba", 0, Math.PI/2);
    ent(L, new T.CylinderGeometry(R*0.50,R*0.50,0.33,12), 0,0,0, 0, HUB, 0, Math.PI/2);
    ent(L, new T.CylinderGeometry(R*0.14,R*0.14,0.35,8),  0,0,0, 0, CHR, 0, Math.PI/2);
    ent(L, boxGeo(0.02,R*0.90,0.336,0), 0,0,0, 0, "#6d675c", 0, 0);   // a spoke or two
    ent(L, boxGeo(R*0.90,0.02,0.336,0), 0,0,0, 0, "#6d675c", 0, 0);
    return mergeEntries(L);
  })();
  for(let i=0;i<SLOTS.length;i++){
    const S=SLOTS[i], col=BODY[i%BODY.length], yaw=S[2], kind=S[3];
    const OP=[], GL=[];
    const B=(bucket,w,h,d,lx,ly,lz,c)=>
      ent(OP, boxGeo(w,h,d,0.45), lx, ly-RIDE, lz, 0, c||col);
    const CY=(bucket,rt,rb,h,seg,lx,ly,lz,c,rx,rz)=>
      ent(OP, new T.CylinderGeometry(rt,rb,h,seg), lx, ly-RIDE, lz, 0, c, rx||0, rz||0);
    const G=(w,h,d,lx,ly,lz,rx)=>
      ent(GL, boxGeo(w,h,d,0), lx, ly-RIDE, lz, 0, GLASS, rx||0);

    /* ---- shared lower body -------------------------------------------- */
    B("carpaint", 2.04,0.30,4.22, 0,0.39,0,   "#1b1a18");     // rocker / pan
    B("carpaint", 1.98,0.52,4.10, 0,0.67,0);                  // main body (top 0.93)
    B("carpaint", 1.82,0.18,1.26, 0,0.89, 1.24);              // hood deck
    B("carpaint", 2.06,0.28,0.22, 0,0.53, 2.14, CHR);         // front bumper
    B("carpaint", 2.06,0.28,0.22, 0,0.53,-2.14, CHR);         // rear bumper
    B("carpaint", 1.24,0.22,0.10, 0,0.80, 2.10, "#2b2a28");   // grille
    B("carpaint", 1.28,0.03,0.03, 0,0.89, 2.11, CHR);         // grille surround
    B("carpaint", 1.28,0.03,0.03, 0,0.70, 2.11, CHR);
    B("carpaint", 0.34,0.14,0.04, 0,0.53,-2.26, "#d8d2bc");   // plate
    CY("carpaint", 0.125,0.125,0.12,14, -0.66,0.80,2.10, "#ffe9a8", Math.PI/2);
    CY("carpaint", 0.125,0.125,0.12,14,  0.66,0.80,2.10, "#ffe9a8", Math.PI/2);
    CY("chrome",   0.150,0.150,0.05,14, -0.66,0.80,2.08, CHR, Math.PI/2);  // headlamp bezels
    CY("chrome",   0.150,0.150,0.05,14,  0.66,0.80,2.08, CHR, Math.PI/2);
    B("carpaint", 0.34,0.15,0.12, -0.68,0.80,-2.12, "#8c2418");
    B("carpaint", 0.34,0.15,0.12,  0.68,0.80,-2.12, "#8c2418");
    B("carpaint", 2.01,0.04,2.74, 0,0.945,-0.16, "#b9b2a2");  // beltline chrome strip
    // door shut lines and handles — what tells you where the car comes apart
    for(const sd of [-1,1]) for(const dz of [0.54,-0.96]){
      B("carpaint", 0.02,0.44,0.022, sd*1.00, 0.70, dz, "#26241f");
      B("chrome",   0.03,0.045,0.16, sd*1.00, 0.86, dz-0.34, CHR);
    }

    /* ---- greenhouse, per body style ----------------------------------- */
    if(kind===1){                                             // pickup
      B("carpaint", 1.82,0.16,1.06, 0,0.90, 0.58);            // cab base
      G(1.52,0.44,1.26, 0,1.20,0.58);
      G(1.46,0.48,0.05, 0,1.21, 1.16, 0.40);                  // raked windscreen
      B("carpaint", 1.44,0.14,1.10, 0,1.41, 0.56);            // cab roof
      B("carpaint", 1.90,0.44,0.10, 0,1.14,-0.04);            // bulkhead
      B("carpaint", 0.13,0.40,2.02, -0.92,1.12,-1.12);        // bed sides
      B("carpaint", 0.13,0.40,2.02,  0.92,1.12,-1.12);
      B("carpaint", 1.94,0.40,0.13, 0,1.12,-2.15);            // tailgate
      B("carpaint", 1.72,0.06,1.92, 0,0.96,-1.12, "#3a352e");  // bed floor
      for(let k=0;k<4;k++) B("carpaint", 0.06,0.02,1.86, -0.62+k*0.42,1.00,-1.12, "#2c2822");
    }else if(kind===2){                                       // panel van
      B("carpaint", 1.92,0.90,3.04, 0,1.20,-0.50);            // box
      G(1.56,0.42,0.84, 0,1.30,0.92);
      B("carpaint", 1.80,0.12,2.86, 0,1.66,-0.50);            // roof cap
      G(0.10,0.36,0.86, -0.94,1.34,-0.28);
      G(0.10,0.36,0.86,  0.94,1.34,-0.28);
      B("carpaint", 1.62,0.62,0.08, 0,1.14,-2.06, "#c8c2b4");  // rear doors
    }else{                                                    // sedan
      B("carpaint", 1.82,0.16,0.98, 0,0.88,-1.34);            // trunk deck
      B("carpaint", 1.70,0.16,1.80, 0,0.97,-0.04);            // cowl lip
      G(1.50,0.42,1.48, 0,1.21,-0.06);
      G(1.44,0.50,0.05, 0,1.22, 0.70, 0.42);                  // raked windshield
      G(1.40,0.44,0.05, 0,1.22,-0.82,-0.52);                  // raked backlight
      B("carpaint", 1.40,0.14,1.24, 0,1.40,-0.08);            // roof cap
      B("carpaint", 1.46,0.04,1.30, 0,1.32,-0.08, CHR);       // window surround
      B("carpaint", 0.08,0.18,0.16, -1.02,1.02, 0.86, CHR);   // mirrors
      B("carpaint", 0.08,0.18,0.16,  1.02,1.02, 0.86, CHR);
      CY("carpaint", 0.012,0.012,0.80,6, 0.94,1.30,1.02, CHR, 0.16); // antenna
    }

    /* ---- arches: the wheels themselves are separate objects ----------- */
    for(const w of [[-HW,WB],[HW,WB],[-HW,-WB],[HW,-WB]]){
      B("carpaint", 0.10,0.30,1.14, w[0]*1.02, R+0.30, w[1], "#171614");  // arch shadow
      B("carpaint", 0.05,0.09,1.22, w[0]*1.045, R+0.26, w[1]);            // fender lip
    }

    /* ---- assemble ----------------------------------------------------- */
    const g=new T.Group();
    g.position.set(S[0], RIDE, S[1]);
    g.rotation.y=yaw;
    const body=new T.Mesh(mergeEntries(OP), CAR_BODY_MAT);
    body.castShadow=true; body.receiveShadow=true;
    g.add(body);
    g.add(new T.Mesh(mergeEntries(GL), CAR_GLASS_MAT));
    const wheels=[];
    for(const w of [[-HW*0.98,WB],[HW*0.98,WB],[-HW*0.98,-WB],[HW*0.98,-WB]]){
      const wm=new T.Mesh(wheelGeo, CAR_WHEEL_MAT);
      wm.rotation.order="YXZ";                 // steer about Y, then roll about X
      wm.position.set(w[0], REST_DROP, w[1]);
      wm.castShadow=true;
      g.add(wm); wheels.push(wm);
    }
    scene.add(g);
    const hx=Math.abs(Math.cos(yaw))*1.03+Math.abs(Math.sin(yaw))*2.28;
    const hz=Math.abs(Math.sin(yaw))*1.03+Math.abs(Math.cos(yaw))*2.28;
    // A car's collider moves, so it stays out of the static grid
    const cc={x0:S[0]-hx, x1:S[0]+hx, z0:S[1]-hz, z1:S[1]+hz, y0:0, y1:1.5};
    COL_DYN.push(cc);
    CARS.push({g:g, wheels:wheels, kind:kind, col:cc,
               home:{x:S[0], z:S[1], yaw:yaw}, veh:null, spin:0});
  }
})();


/* ----------------------------------------------------------------------
   10b · THE MANAGER'S APARTMENT — behind the office, through the door
         behind the desk
   ----------------------------------------------------------------------
   Whoever ran this place did not go home at the end of a shift; they went
   through a door behind the front desk into one room, and that room is the
   only private space on the property. So it is deliberately NOT dressed
   like a guest room: guest rooms are six variations on one layout, done by
   somebody who ordered four of everything. This is one person's life in
   seven metres by eight — a bed that has not been made, a plate in the
   sink, a chair pushed back from the table, and the ledger brought through
   from the desk because the light is better in here.

   LAID OUT FROM A PLAN, and that is not a stylistic note. The first cut of
   this room had the bed and the fridge inside each other and the door
   opening onto the bed, because everything was placed by eye against the
   nearest wall. So: the four walls are named, every piece is hung off one
   of them, and LANE is the strip from the door into the room that nothing
   is allowed into. That is the same rule the doorways now get from
   clear36.js, applied to a room instead of an opening.                  */
(function managerFlat(){
  const y0=BASE, A=APT, O=OFFICE;
  /* The INNER FACES, which is +0.22 and not +0.11. The shell walls are
     0.22 slabs centred on A.x0+0.11, so A.x0+0.11 is the middle of the
     wall, not the face of it — and a wall lining hung on that plane is
     buried inside the render, which is why the first cut of this room was
     still showing the office's cold blue exterior stucco from the inside.
     Everything in here is placed off these four numbers, so getting them
     wrong moves the whole room a hand's width into the walls. */
  const IX0=A.x0+0.22, IX1=A.x1-0.22;     // west and east inner faces
  const IZ0=O.z1,      IZ1=A.z1-0.22;     // the office's north wall is our south
  const CH=A.h, W=A.x1-A.x0, D2=A.z1-O.z1;
  const WOOD="#7a5636", WOODD="#5c4029", STEEL="#a7ada6", STEELD="#7f857f";
  const R=n=>((Math.sin(n*127.1+311.7)*43758.5)%1+1)%1;

  // --- the plan. Everything below is placed off these and nothing else ---
  const LANE=[APT_DX-0.56, APT_DX+0.56, IZ0, IZ0+1.70];   // keep this empty
  const KZ0=IZ0+3.35, KZ1=IZ0+6.60;       // the kitchen run, down the west wall
  const FRZ=IZ0+2.80;                     // the fridge, at the south end of it
  const WINW=[IZ0+4.55, IZ0+5.85];        // the window over the sink
  const WINN=[A.x0+2.10, A.x0+3.50];      // and one in the north wall
  const BEDX=[IX1-3.62, IX1-2.22], BEDZ=[IZ1-2.05, IZ1-0.06];
  const TVX=IX1-0.40, TVZ=IZ1-1.60;
  const TBX=IX1-1.95, TBZ=IZ0+1.30;
  const RLZ=[IZ0+2.70, IZ0+3.80];

  /* --- shell -----------------------------------------------------------
     A lean-to off the back of the office: lower than it, roof falling away
     north so it tucks under the office's own eave rather than fighting it.
     It has no south wall of its own — the office's north wall is that wall,
     and building a second one on the same plane is two slabs z-fighting. */
  bx("concrete", W+1.0, 0.32, D2+0.9, (A.x0+A.x1)/2, y0-0.16, (IZ0+A.z1)/2+0.2, 0.45, 0, "#b6afa0");
  addFlat(A.x0-0.5, A.x1+0.5, IZ0-0.2, A.z1+0.45, y0);
  bx("lino", W-0.3, 0.04, D2-0.3, (A.x0+A.x1)/2, y0+0.02, (IZ0+A.z1)/2, 0.85, 0, "#b9ad91");
  addZone(A.x0, A.x1, IZ0-0.25, A.z1, y0-0.5, y0+CH+0.4, "THE MANAGER'S APARTMENT", true);

  for(const sx of [-1,1]){
    const px = sx<0 ? A.x0+0.11 : A.x1-0.11;
    if(sx<0){                              // the west wall carries the sink window
      bx("stucco", 0.22, CH, WINW[0]-IZ0, px, y0+CH/2, (IZ0+WINW[0])/2, 0.3, 0, SLATE);
      bx("stucco", 0.22, CH, A.z1-WINW[1], px, y0+CH/2, (WINW[1]+A.z1)/2, 0.3, 0, SLATE);
      bx("stucco", 0.22, 1.06, WINW[1]-WINW[0], px, y0+0.53, (WINW[0]+WINW[1])/2, 0.3, 0, SLATE);
      bx("stucco", 0.22, CH-2.20, WINW[1]-WINW[0], px, y0+2.20+(CH-2.20)/2,
         (WINW[0]+WINW[1])/2, 0.3, 0, SLATE);
      push("glass", boxGeo(0.05, 1.10, WINW[1]-WINW[0]-0.09, 0), px+0.02, y0+1.61,
           (WINW[0]+WINW[1])/2, 0, "#7f9098");
      bx("paint", 0.08, 1.18, 0.07, px+0.04, y0+1.61, (WINW[0]+WINW[1])/2, 0, 0, "#e2ddcc");
      bx("paint", 0.08, 0.07, WINW[1]-WINW[0], px+0.04, y0+1.61, (WINW[0]+WINW[1])/2, 0, 0, "#e2ddcc");
    }else bx("stucco", 0.22, CH, D2, px, y0+CH/2, (IZ0+A.z1)/2, 0.3, 0, SLATE);
    addCol(px-0.11, px+0.11, IZ0-0.05, A.z1, y0, y0+CH);
  }
  bx("stucco", WINN[0]-A.x0, CH, 0.22, (A.x0+WINN[0])/2, y0+CH/2, A.z1-0.11, 0.3, 0, SLATE);
  bx("stucco", A.x1-WINN[1], CH, 0.22, (WINN[1]+A.x1)/2, y0+CH/2, A.z1-0.11, 0.3, 0, SLATE);
  bx("stucco", WINN[1]-WINN[0], 1.06, 0.22, (WINN[0]+WINN[1])/2, y0+0.53, A.z1-0.11, 0.3, 0, SLATE);
  bx("stucco", WINN[1]-WINN[0], CH-2.20, 0.22, (WINN[0]+WINN[1])/2, y0+2.20+(CH-2.20)/2,
     A.z1-0.11, 0.3, 0, SLATE);
  push("glass", boxGeo(WINN[1]-WINN[0]-0.09, 1.10, 0.05, 0), (WINN[0]+WINN[1])/2,
       y0+1.61, A.z1-0.14, 0, "#7f9098");
  bx("paint", 0.07, 1.18, 0.08, (WINN[0]+WINN[1])/2, y0+1.61, A.z1-0.16, 0, 0, "#e2ddcc");
  bx("lino", WINN[1]-WINN[0]+0.16, 0.05, 0.16, (WINN[0]+WINN[1])/2, y0+1.00,
     A.z1-0.20, 0.5, 0, "#b3a88e");
  addCol(A.x0, A.x1, A.z1-0.22, A.z1, y0, y0+CH);
  // a blind on the north window, pulled most of the way down and crooked
  for(let k=0;k<9;k++)
    bx("metal", WINN[1]-WINN[0]-0.10, 0.030, 0.024, (WINN[0]+WINN[1])/2,
       y0+2.14-k*0.072, A.z1-0.22, 0, ((k*7)%5-2)*0.010, (k%2)?"#a49c8c":"#9a9284");
  cyl("metal", 0.006,0.006,0.44,5, WINN[1]-0.18, y0+1.94, A.z1-0.22, "#8e8878");

  /* THE WALLS NEED A FINISH. Without this you are standing inside the
     office's exterior stucco — a cold blue-grey render, which is right for
     the outside of the building and reads, from in here, as a room nobody
     ever lined. Boarding to the sill, painted plaster above it, and a
     skirting, split round both windows and round the door. */
  {
    const DADO=1.00, PAINT="#cfc5a8", BOARD="#8f9a7e", SKIRT="#6f6a55";
    const WY0=1.06, WY1=2.16;                        // the glass, over the floor
    const patch=(ry, px, pz, a, b2, ya, yb, col)=>{
      const L=b2-a, c=(a+b2)/2, flat=(ry===0||ry===Math.PI);
      push("roomwall", planeGeo(L, yb-ya, 2.2), flat?c:px, y0+(ya+yb)/2, flat?pz:c,
           ry, col, 0, 0);
    };
    const run=(ry, px, pz, a, b2, skipA, skipB)=>{
      const segs=[];
      if(skipA===undefined) segs.push([a,b2]);
      else { if(skipA-a>0.12) segs.push([a,skipA]); if(b2-skipB>0.12) segs.push([skipB,b2]); }
      for(const q of segs){
        const L=q[1]-q[0], c=(q[0]+q[1])/2;
        const X=(ry===0||ry===Math.PI) ? c : px, Z=(ry===0||ry===Math.PI) ? pz : c;
        push("roomwall", planeGeo(L, DADO-0.10, 2.2), X, y0+(DADO-0.10)/2+0.10, Z, ry, BOARD, 0, 0);
        push("roomwall", planeGeo(L, CH-DADO-0.02, 2.2), X, y0+DADO+(CH-DADO-0.02)/2, Z, ry, PAINT, 0, 0);
        bx("roomwall", (ry===0||ry===Math.PI)?L:0.04, 0.05, (ry===0||ry===Math.PI)?0.04:L,
           X+((ry===0||ry===Math.PI)?0:(ry>0?0.03:-0.03)), y0+DADO+0.02,
           Z+((ry===0||ry===Math.PI)?(ry?0.03:-0.03):0), 0.4, 0, "#8a8266");
        bx("roomwall", (ry===0||ry===Math.PI)?L:0.05, 0.11, (ry===0||ry===Math.PI)?0.05:L,
           X, y0+0.055, Z, 0.4, 0, SKIRT);
      }
    };
    run(Math.PI/2, IX0+0.015, 0, IZ0+0.10, IZ1-0.02, WINW[0]-0.06, WINW[1]+0.06);   // west
    run(-Math.PI/2, IX1-0.015, 0, IZ0+0.10, IZ1-0.02);                              // east
    run(Math.PI, 0, IZ1-0.015, A.x0+0.24, A.x1-0.24, WINN[0]-0.06, WINN[1]+0.06);  // north
    run(0, 0, IZ0+0.015, A.x0+0.24, A.x1-0.24, APT_DX-0.60, APT_DX+0.60);           // south
    // and over the door, for the same reason as over the windows
    patch(0, 0, IZ0+0.015, APT_DX-0.60, APT_DX+0.60, APT_DH+0.06, CH-0.02, PAINT);
    bx("roomwall", 1.26, 0.05, 0.05, APT_DX, y0+APT_DH+0.04, IZ0+0.04, 0.4, 0, "#8a8266");
    /* And the wall ABOVE and BELOW each window. Splitting the lining round
       an opening leaves the whole strip from floor to ceiling unlined, not
       just the hole — so each window sat in a full-height panel of bare
       blue exterior render. A window is a hole in the middle of a wall, and
       the wall goes on above it and under it. */
    for(const q of [[WINW[0],WINW[1],1],[WINN[0],WINN[1],0]]){
      const ry = q[2] ? Math.PI/2 : Math.PI;
      const px = q[2] ? IX0+0.015 : 0, pz = q[2] ? 0 : IZ1-0.015;
      patch(ry, px, pz, q[0]-0.06, q[1]+0.06, 0.10, WY0, BOARD);
      patch(ry, px, pz, q[0]-0.06, q[1]+0.06, WY1, CH-0.02, PAINT);
      bx("roomwall", q[2]?0.05:(q[1]-q[0]+0.12), 0.05, q[2]?(q[1]-q[0]+0.12):0.05,
         q[2]?IX0+0.04:(q[0]+q[1])/2, y0+WY0+0.02, q[2]?(q[0]+q[1])/2:IZ1-0.04,
         0.4, 0, "#8a8266");
      for(const e of [q[0],q[1]])                    // and the reveals down the sides
        bx("roomwall", q[2]?0.20:0.05, WY1-WY0, q[2]?0.05:0.20,
           q[2]?IX0-0.09:e, y0+(WY0+WY1)/2, q[2]?e:IZ1+0.09, 0.4, 0, PAINT);
    }
  }
  // reaching the walls, not stopped 15 cm short of them: an inset ceiling
  // leaves a band of bare exterior render running round the top of the room
  bx("ceil", W-0.08, 0.10, D2-0.08, (A.x0+A.x1)/2, y0+CH-0.05, (IZ0+A.z1)/2, 0.42, 0, "#e4dcc6");
  push("roofG", boxGeo(W+1.3, 0.20, D2+1.5, 0.30), (A.x0+A.x1)/2, y0+CH+0.30,
       (IZ0+A.z1)/2+0.24, 0, "#4b7a62", 0.085);
  bx("paint", W+1.3, 0.20, 0.14, (A.x0+A.x1)/2, y0+CH+0.02, A.z1+0.60, 0, 0, "#e6e2d6");
  for(const sx of [-1,1])
    bx("paint", 0.14, 0.20, D2+1.5, (A.x0+A.x1)/2+sx*(W/2+0.62), y0+CH+0.20,
       (IZ0+A.z1)/2+0.24, 0, 0, "#e6e2d6");
  cyl("metal", 0.045,0.045,CH+0.2, 6, A.x1+0.60, y0+(CH+0.2)/2, A.z1+0.30, STEELD);
  push("rust", planeGeo(0.34, 1.90, 0), A.x1+0.63, y0+1.1, A.z1+0.30, Math.PI/2, "#6b5a45", 0, 0);

  /* --- the bed, against the north wall, and nobody made it ------------- */
  {
    const cx2=(BEDX[0]+BEDX[1])/2, cz2=(BEDZ[0]+BEDZ[1])/2, BW=BEDX[1]-BEDX[0];
    bx("oak", BW+0.10, 0.94, 0.08, cx2, y0+0.51, BEDZ[1]+0.04, 0.7, 0, WOODD);   // headboard
    push("oak", new T.CylinderGeometry(0.035,0.035,BW+0.10,10), cx2, y0+0.98,
         BEDZ[1]+0.04, 0, WOOD, 0, Math.PI/2);
    bx("oak", BW, 0.22, BEDZ[1]-BEDZ[0]-0.06, cx2, y0+0.24, cz2, 0.6, 0, "#4c3b2a");
    bx("spread", BW+0.06, 0.18, BEDZ[1]-BEDZ[0], cx2, y0+0.13, cz2, 0.42, 0, "#3b3128");
    bx("bedding", BW-0.04, 0.26, BEDZ[1]-BEDZ[0]-0.08, cx2, y0+0.48, cz2, 0.42, 0, "#ddd6c4");
    push("bedding", new T.CylinderGeometry(0.068,0.068,BW-0.04,10), cx2, y0+0.58,
         BEDZ[0]+0.05, 0, "#ddd6c4", 0, Math.PI/2);
    // the spread thrown back to the foot in a heap, not folded
    push("spread", boxGeo(BW-0.12,0.20,0.62,0.42), cx2, y0+0.70, BEDZ[0]+0.42, 0.10, "#7d5f48", 0.14, 0);
    push("spread", boxGeo(BW-0.40,0.16,0.46,0.42), cx2+0.16, y0+0.71, BEDZ[0]+0.72, -0.22, "#8a6a50", 0, 0.09);
    push("bedding", boxGeo(BW-0.26,0.06,0.90,0.4), cx2-0.06, y0+0.615, cz2+0.18, 0.05, "#efeadb", -0.04, 0);
    for(const q of [[-0.34,-0.06,0.13,"#f2eee0"],[0.32,0.04,-0.06,"#ece7d8"]]){
      const g=new T.SphereGeometry(0.30,12,8); g.scale(1.10,0.32,0.92);
      push("bedding", g, cx2+q[0], y0+0.655+q[1]*0.2, BEDZ[1]-0.34, q[2], q[3]);
    }
    addCol(BEDX[0]-0.06, BEDX[1]+0.06, BEDZ[0]-0.04, BEDZ[1]+0.10, y0, y0+0.62);
    /* And you can get into it. The head is at +z, so lying down you are
       looking back down the room at the door — which is the whole point of
       lying on a bed in a place like this. */
    addSeat(cx2, cz2+0.10, y0+0.63, 0, "THE MANAGER'S BED", true);
    // and what is on the table beside it
    const nx=BEDX[1]+0.46, nz=BEDZ[1]-0.30;
    bx("oak", 0.48, 0.56, 0.44, nx, y0+0.28, nz, 0.6, 0, WOOD);
    bx("oak", 0.52, 0.05, 0.48, nx, y0+0.58, nz, 0.6, 0, "#6b4a2c");
    bx("oak", 0.40, 0.13, 0.03, nx, y0+0.40, nz-0.23, 0.5, 0, "#6b4a2c");
    cyl("metal", 0.018,0.018,0.05,8, nx, y0+0.40, nz-0.25, "#b8a67e", Math.PI/2);
    addCol(nx-0.26, nx+0.26, nz-0.25, nz+0.25, y0, y0+0.60);
    cyl("metal", 0.10,0.12,0.03,12, nx-0.07, y0+0.62, nz, "#b8a67e");
    cyl("metal", 0.016,0.016,0.24,8, nx-0.07, y0+0.74, nz, "#b8a67e");
    push("lampshade", new T.CylinderGeometry(0.11,0.15,0.18,14), nx-0.07, y0+0.94, nz, 0, "#e8dcc0");
    LAMPS.push({x:nx-0.07, y:y0+0.90, z:nz, color:0xffd9a0, intensity:0.36, dist:4.8,
                decay:2.0, indoor:true, vol:[A.x0,A.x1, IZ0-0.3, A.z1, y0-0.5, y0+CH+0.3]});
    cyl("metal", 0.055,0.055,0.055,14, nx+0.14, y0+0.625, nz+0.11, "#8e9a94");
    for(let i=0;i<3;i++)
      cyl("paper", 0.008,0.008,0.055,6, nx+0.14+((i%2)?0.03:-0.02), y0+0.655,
          nz+0.11+i*0.012, "#d8d2c0", 0.3, i*1.1, 0.2);
    cyl("glass", 0.033,0.028,0.085,12, nx+0.15, y0+0.645, nz-0.13, "#8a9a94");
    bx("paint", 0.10,0.10,0.05, nx-0.18, y0+0.63, nz-0.14, 0.4, 0, "#c8c0a8");
    cyl("clockface", 0.040,0.040,0.012,14, nx-0.18, y0+0.63, nz-0.17, "#e8e2cf", 0,0,Math.PI/2);
    push("paper", boxGeo(0.14,0.028,0.20,0.4), nx+0.02, y0+0.60, nz+0.16, 0.3, "#cbc3ac");
  }

  /* --- the television at the foot of the bed --------------------------- */
  {
    bx("oak", 0.46, 0.04, 0.62, TVX, y0+0.54, TVZ, 0.6, 0, WOOD);
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
      cyl("metal", 0.014,0.014,0.52,6, TVX+a[0]*0.18, y0+0.27, TVZ+a[1]*0.26, STEELD);
    bx("metal", 0.44, 0.03, 0.60, TVX, y0+0.20, TVZ, 0.5, 0, STEELD);
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
      cyl("paint", 0.030,0.030,0.04,8, TVX+a[0]*0.18, y0+0.02, TVZ+a[1]*0.26, "#2f2f2e");
    bx("paint", 0.40, 0.40, 0.54, TVX, y0+0.78, TVZ, 0.5, 0, "#3a3733");
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
      cyl("paint", 0.026,0.026,0.40,8, TVX+a[0]*0.19, y0+0.78, TVZ+a[1]*0.26, "#3a3733");
    push("tvwin", planeGeo(0.30,0.40,0), TVX-0.205, y0+0.78, TVZ, -Math.PI/2, "#14161a", 0, 0);
    bx("paint", 0.03, 0.34, 0.11, TVX-0.21, y0+0.78, TVZ-0.20, 0.4, 0, "#2b2926");
    for(let i=0;i<2;i++)
      cyl("metal", 0.012,0.012,0.022,10, TVX-0.225, y0+0.88-i*0.10, TVZ-0.20, "#9a9284",
          0, 0, Math.PI/2);
    for(const q of [-1,1])                     // rabbit ears, one wrapped in foil
      cyl("metal", 0.008,0.006,0.62,6, TVX+0.10, y0+1.28, TVZ, q>0?"#b8b4a8":"#cfcabc",
          0.55, q>0?0.6:2.4, 0);
    cyl("metal", 0.020,0.020,0.05,8, TVX+0.10, y0+1.00, TVZ, STEELD);
    addCol(TVX-0.26, TVX+0.26, TVZ-0.34, TVZ+0.34, y0, y0+1.00);
    push("paper", boxGeo(0.17,0.02,0.23,0.4), TVX-0.06, y0+0.57, TVZ+0.20, 0.22, "#cbc3ac");
    cyl("plaster", 0.042,0.036,0.085,12, TVX+0.02, y0+0.60, TVZ-0.20, "#c6bda6");
  }

  /* --- the kitchen run down the west wall, and the plate in the sink --- */
  {
    const KX=IX0+0.32, CT=0.90;              // counter centre-line and top
    bx("oak", 0.60, CT-0.06, KZ1-KZ0, KX, y0+(CT-0.06)/2, (KZ0+KZ1)/2, 0.55, 0, WOOD);
    bx("lino", 0.66, 0.05, KZ1-KZ0+0.05, KX-0.02, y0+CT, (KZ0+KZ1)/2, 0.8, 0, "#a89e86");
    push("lino", new T.CylinderGeometry(0.026,0.026,KZ1-KZ0+0.05,10), KX+0.31, y0+CT,
         (KZ0+KZ1)/2, 0, "#a89e86", Math.PI/2, 0);                     // bullnose
    bx("oak", 0.08, 0.14, KZ1-KZ0, KX-0.26, y0+0.07, (KZ0+KZ1)/2, 0.5, 0, "#4e3a24");
    for(let i=0;i<3;i++){
      const dz2=KZ0+0.55+i*((KZ1-KZ0)-1.1)/2;
      bx("oak", 0.03, 0.50, 0.62, KX+0.31, y0+0.36, dz2, 0.5, 0, "#6b4a2c");
      bx("oak", 0.03, 0.18, 0.62, KX+0.31, y0+0.70, dz2, 0.5, 0, "#6b4a2c");
      for(const yy of [0.70, 0.55])
        cyl("metal", 0.010,0.010,0.13,6, KX+0.34, y0+yy, dz2, "#b8a67e", Math.PI/2);
    }
    // the sink, under the window
    const sz2=(WINW[0]+WINW[1])/2;
    bx("metal", 0.48, 0.02, 0.62, KX, y0+CT+0.012, sz2, 0.5, 0, STEEL);
    bx("metal", 0.38, 0.16, 0.52, KX, y0+CT-0.08, sz2, 0.5, 0, "#9aa19a");
    bx("bin",   0.34, 0.02, 0.48, KX, y0+CT-0.155, sz2, 0.5, 0, "#5f6560");
    cyl("metal", 0.016,0.016,0.24,8, KX-0.20, y0+CT+0.12, sz2, STEEL);
    cyl("metal", 0.013,0.013,0.17,8, KX-0.12, y0+CT+0.235, sz2, STEEL, 0, 0, Math.PI/2);
    for(const q of [-1,1])
      cyl("metal", 0.012,0.012,0.07,6, KX-0.20, y0+CT+0.20, sz2+q*0.10, STEEL, Math.PI/2);
    /* THE PLATE. Propped against the side of the bowl at an angle, the way
       one plate left in a sink actually sits — laid flat in the bottom it
       reads as a plate somebody put away in a strange cupboard. */
    push("plaster", new T.CylinderGeometry(0.105,0.105,0.014,18), KX-0.02, y0+CT-0.085,
         sz2-0.09, 1.9, "#c9c1ad", 0.10, 0.44);
    push("plaster", new T.CylinderGeometry(0.092,0.092,0.010,18), KX+0.04, y0+CT-0.115,
         sz2+0.06, 0.4, "#c4bca8", 0, 0.16);
    cyl("plaster", 0.040,0.034,0.080,12, KX-0.05, y0+CT-0.105, sz2+0.15, "#c6bda6",
        0.4, 0.55, 0);                                                  // and the mug
    push("metal", new T.CylinderGeometry(0.010,0.010,0.13,6), KX+0.10, y0+CT-0.14,
         sz2+0.05, 1.1, STEELD, 0, Math.PI/2);                          // a fork
    push("fabric", boxGeo(0.20,0.012,0.14,0.4), KX-0.13, y0+CT+0.24, sz2+0.02, 0.4,
         "#9fa8a0", 0, 0.5);
    push("soot", planeGeo(0.30,0.46,0), KX, y0+CT-0.149, sz2, 0.2, "#6e7168", -Math.PI/2, 0);
    // the two-ring hob at the north end, a kettle on the back ring
    const hz=KZ1-0.52;
    bx("metal", 0.46, 0.03, 0.52, KX, y0+CT+0.02, hz, 0.5, 0, "#b0b4ad");
    for(const q of [[-0.10,-0.12],[0.09,0.12]]){
      cyl("metal", 0.085,0.085,0.012,14, KX+q[0], y0+CT+0.04, hz+q[1], "#4a4f4b");
      for(let k=0;k<7;k++)
        cyl("metal", 0.006,0.006,0.15,4, KX+q[0], y0+CT+0.045, hz+q[1], "#6e746f",
            Math.PI/2, k*0.45, 0);
    }
    cyl("metal", 0.075,0.062,0.14,14, KX+0.09, y0+CT+0.115, hz+0.12, "#9aa1a6");
    cyl("metal", 0.020,0.014,0.09,8, KX+0.09, y0+CT+0.15, hz+0.19, "#9aa1a6", 0.7);
    push("metal", new T.SphereGeometry(0.018,8,6), KX+0.09, y0+CT+0.195, hz+0.12, 0, "#6e746f");
    push("soot", planeGeo(0.52,0.60,0), IX0+0.02, y0+1.42, hz, Math.PI/2, "#6b6357", 0, 0);
    /* The wall cupboard goes SOUTH of the window, over the south end of the
       run. Hung at the north end it was straight across the glass — a
       cupboard covering the only window in the kitchen, which is the same
       mistake as a rail across a doorway and just as easy to make by
       putting a thing next to another thing without checking what is in
       the wall behind it. */
    const CUZ=(KZ0+WINW[0])/2;
    bx("oak", 0.32, 0.62, WINW[0]-KZ0-0.10, IX0+0.16, y0+1.86, CUZ, 0.5, 0, WOOD);
    bx("oak", 0.03, 0.58, 0.52, IX0+0.33, y0+1.86, CUZ-0.28, 0.5, 0, "#6b4a2c");
    push("oak", boxGeo(0.03,0.56,0.50,0.5), IX0+0.44, y0+1.86, CUZ+0.42, -0.75, "#6b4a2c");
    for(let i=0;i<5;i++)
      cyl("metal", 0.038,0.038,0.11,12, IX0+0.22, y0+1.72, CUZ+0.14+i*0.09,
          ["#9a6a3a","#7a8a5a","#8a5a4a"][i%3]);
    addCol(IX0, KX+0.36, KZ0-0.06, KZ1+0.06, y0, y0+CT);
    // the fridge, at the south end of the run, and what is stuck to it
    bx("paint", 0.62, 1.42, 0.66, IX0+0.33, y0+0.71, FRZ, 0.5, 0, "#d8d4c8");
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
      cyl("paint", 0.034,0.034,1.42,8, IX0+0.33+a[0]*0.28, y0+0.71, FRZ+a[1]*0.30, "#d8d4c8");
    bx("paint", 0.02, 0.03, 0.64, IX0+0.66, y0+1.00, FRZ, 0.4, 0, "#c2beb2");
    cyl("metal", 0.016,0.016,0.30,8, IX0+0.65, y0+1.16, FRZ-0.24, "#b8b4a8");
    push("paper", planeGeo(0.17,0.13,0), IX0+0.662, y0+1.14, FRZ+0.10, Math.PI/2, "#cfc6ae", 0, 0.06);
    push("paper", planeGeo(0.06,0.09,0), IX0+0.662, y0+0.88, FRZ-0.06, Math.PI/2, "#c4bba3", 0, -0.12);
    push("metal", new T.SphereGeometry(0.016,8,6), IX0+0.666, y0+1.22, FRZ+0.10, 0, "#b03a2a");
    addCol(IX0, IX0+0.68, FRZ-0.36, FRZ+0.36, y0, y0+1.44);
  }

  /* --- the table, and the chair pushed back from it -------------------- */
  {
    bx("oak", 0.80, 0.05, 1.10, TBX, y0+0.735, TBZ, 0.7, 0, "#6f4a2c");
    push("lino", boxGeo(0.82,0.014,1.12,0.9), TBX, y0+0.765, TBZ, 0, "#b6ab90");
    for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
      cyl("metal", 0.020,0.020,0.72,8, TBX+a[0]*0.33, y0+0.37, TBZ+a[1]*0.48, STEEL);
    for(const q of [-1,1]) bx("metal", 0.02, 0.02, 0.94, TBX+q*0.33, y0+0.16, TBZ, 0.4, 0, STEELD);
    addCol(TBX-0.42, TBX+0.42, TBZ-0.56, TBZ+0.56, y0, y0+0.76);
    const chair=(cx2,cz2,ry)=>{
      const S=(dx2,dz2)=>[cx2+dx2*Math.cos(ry)-dz2*Math.sin(ry), cz2+dx2*Math.sin(ry)+dz2*Math.cos(ry)];
      bx("oak", 0.42, 0.04, 0.42, cx2, y0+0.40, cz2, 0.5, ry, WOOD);
      bx("spread", 0.40, 0.06, 0.40, cx2, y0+0.44, cz2, 0.4, ry, "#7d6a4e");
      for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]]){
        const q=S(a[0]*0.17, a[1]*0.17);
        cyl("metal", 0.016,0.016,0.40,8, q[0], y0+0.20, q[1], STEEL);
      }
      const b2=S(0,-0.19);
      bx("spread", 0.40, 0.34, 0.05, b2[0], y0+0.64, b2[1], 0.4, ry, "#7d6a4e");
      for(const q of [-1,1]){
        const e=S(q*0.18, -0.19);
        cyl("metal", 0.016,0.016,0.46,8, e[0], y0+0.61, e[1], STEEL);
      }
      addCol(cx2-0.25, cx2+0.25, cz2-0.25, cz2+0.25, y0, y0+0.50);
    };
    chair(TBX-0.72, TBZ-0.12, Math.PI/2);            // pushed back and turned away
    chair(TBX+0.05, TBZ+0.88, 3.05);
    // the ledger brought through from the desk, and the rest of the evening
    push("paper", boxGeo(0.30,0.035,0.40,0.5), TBX+0.02, y0+0.79, TBZ-0.18, 0.16, "#cbc3ac");
    push("bin",   boxGeo(0.31,0.012,0.41,0.5), TBX+0.02, y0+0.808, TBZ-0.18, 0.16, "#5a4a3a");
    for(let i=0;i<5;i++)
      push("paper", planeGeo(0.20,0.27,0), TBX-0.16+R(i)*0.24, y0+0.775+i*0.0012,
           TBZ+0.16+R(i+9)*0.34, R(i+3)*3.1, "#cfc6ae", -Math.PI/2, 0);
    cyl("plaster", 0.042,0.036,0.090,12, TBX+0.22, y0+0.81, TBZ-0.36, "#c6bda6");
    push("soot", planeGeo(0.11,0.11,0), TBX+0.22, y0+0.773, TBZ-0.36, 0, "#7a7263", -Math.PI/2, 0);
    cyl("metal", 0.062,0.062,0.030,14, TBX-0.18, y0+0.78, TBZ+0.30, "#8e9a94");
    for(let i=0;i<5;i++)
      cyl("paper", 0.008,0.008,0.05,6, TBX-0.18+R(i)*0.05-0.02, y0+0.80,
          TBZ+0.30+R(i+4)*0.05-0.02, "#d8d2c0", 0.4, i*1.3, 0.3);
    cyl("glass", 0.031,0.024,0.11,12, TBX-0.14, y0+0.82, TBZ-0.30, "#8a7a52");
  }

  /* --- a clothes rail on the east wall, because there is no wardrobe --- */
  {
    const rx=IX1-0.42;
    for(const z2 of RLZ) cyl("metal", 0.018,0.018,1.72,8, rx, y0+0.86, z2, STEEL);
    cyl("metal", 0.016,0.016,RLZ[1]-RLZ[0],8, rx, y0+1.70, (RLZ[0]+RLZ[1])/2, STEEL, Math.PI/2);
    for(const z2 of RLZ) bx("metal", 0.46, 0.02, 0.30, rx, y0+0.02, z2, 0.4, 0, STEELD);
    for(let i=0;i<4;i++){
      const hz2=RLZ[0]+0.16+i*(RLZ[1]-RLZ[0]-0.32)/3;
      const col=["#8e9a86","#cfc6ae","#6b7a8a","#4e4a42"][i];
      cyl("metal", 0.006,0.006,0.09,5, rx, y0+1.66, hz2, "#b8b4a8");
      bx("metal", 0.012, 0.012, 0.17, rx, y0+1.61, hz2, 0.4, 0, "#b8b4a8");
      push("fabric", boxGeo(0.05, 0.66, 0.34, 0.6), rx, y0+1.28, hz2, R(i)*0.12-0.06, col);
      for(const q of [-1,1])
        push("fabric", boxGeo(0.05, 0.22, 0.12, 0.6), rx, y0+1.52, hz2+q*0.16, 0, col);
    }
    addCol(rx-0.30, rx+0.42, RLZ[0]-0.28, RLZ[1]+0.28, y0, y0+1.74);
    bx("fabric", 0.34, 0.26, 0.42, rx-0.10, y0+0.13, RLZ[1]+0.44, 0.5, 0, "#5f5a4e");
    bx("metal", 0.05, 0.03, 0.44, rx-0.10, y0+0.26, RLZ[1]+0.44, 0.4, 0, "#8a8274");
  }

  /* --- the rug, the walls, and the light ------------------------------- */
  {
    push("fabric", boxGeo(2.00, 0.02, 2.40, 0.7), (IX0+IX1)/2+0.5, y0+0.035, IZ0+2.60, 0, "#6a5a4e");
    push("fabric", boxGeo(1.80, 0.012, 2.20, 0.7), (IX0+IX1)/2+0.5, y0+0.048, IZ0+2.60, 0, "#94806a");
    // worn through on the line the door takes to the kitchen and the bed
    push("soot", planeGeo(0.84, 2.20, 0), APT_DX+0.5, y0+0.056, IZ0+1.9, 0.18, "#6e6558", -Math.PI/2, 0);
    // a calendar that stopped, and a photograph that did not
    push("paper", planeGeo(0.28, 0.38, 0), APT_DX+1.35, y0+1.60, IZ0+0.03, 0, "#d4ccb4", 0, 0);
    push("art", planeGeo(0.26, 0.20, 0), APT_DX+1.35, y0+1.70, IZ0+0.035, 0, "#8a7a5a", 0, 0);
    bx("oak", 0.26, 0.32, 0.03, IX1-1.30, y0+1.74, IZ0+0.02, 0.4, 0, "#5c4029");
    push("art", planeGeo(0.24, 0.18, 0), IX1-1.30, y0+1.74, IZ0+0.038, 0, "#b6a888", 0, 0);
    /* The key board brought through, with three keys still on it — and
       hung 2.3 m along the wall from the door, not over it. The first cut
       of this put it at APT_DX, which is the door's own centre-line: a
       board of keys floating in the opening. This wall is the office's
       north wall seen from the other side, so anything hung on it has to
       clear the same hole everything else on that wall clears. */
    const KBX=APT_DX+2.30;
    bx("oak", 0.46, 0.34, 0.03, KBX, y0+1.52, IZ0+0.02, 0.4, 0, "#6b4a2c");
    for(let i=0;i<5;i++){
      const kx2=KBX-0.18+i*0.09;
      cyl("metal", 0.006,0.006,0.035,5, kx2, y0+1.64, IZ0+0.045, "#b8b4a8", Math.PI/2);
      if(i===1||i===3||i===4) continue;
      bx("metal", 0.022, 0.075, 0.012, kx2, y0+1.60, IZ0+0.052, 0.4, 0, "#c8b47e");
      push("paper", planeGeo(0.05,0.035,0), kx2, y0+1.545, IZ0+0.060, 0, "#cfc6ae", 0, 0);
    }
    // a mirror by the door, and the switch beside it
    push("mirror", planeGeo(0.40, 0.56, 0), IX1-0.022, y0+1.56, IZ0+1.05, -Math.PI/2, "#b6c6cc", 0, 0);
    bx("oak", 0.03, 0.62, 0.46, IX1-0.012, y0+1.56, IZ0+1.05, 0.4, 0, "#5c4029");
    bx("paint", 0.09, 0.11, 0.02, APT_DX+0.72, y0+1.18, IZ0+0.02, 0.4, 0, "#e2ddcc");
    // the ceiling rose, and the shade that has been up there since before him
    const lcx=(IX0+IX1)/2+0.5, lcz=IZ0+2.90;
    cyl("metal", 0.04,0.04,0.10,10, lcx, y0+CH-0.16, lcz, "#cfc7b2");
    push("lampshade", new T.CylinderGeometry(0.19,0.26,0.24,16), lcx, y0+CH-0.38, lcz, 0, "#e2d2a8");
    LAMPS.push({x:lcx, y:y0+CH-0.45, z:lcz, color:0xffe2b0, intensity:0.30, dist:6.4,
                decay:2.0, indoor:true, vol:[A.x0,A.x1, IZ0-0.3, A.z1, y0-0.5, y0+CH+0.3]});
    void LANE;    // the plan's clear strip; asserted by clear36.js, not by code
  }

  /* ====================================================================
     AND THE REST OF SOMEBODY'S LIFE
     --------------------------------------------------------------------
     The first cut of this room had a bed, a TV, a kitchen run and a table,
     which is a floor plan rather than a home. What was missing is all the
     things a person accretes in a room they have lived in for nineteen
     years and never expected to: the chair he actually sits in, which is
     not at the table; the stock for the motel kept in here because there
     is nowhere else; the boots by the door; the cooler on the roof that
     has run every summer since 1968.

     Everything below is still hung off the plan's named anchors, and
     everything stays out of LANE. The chair faces the television, which
     means it faces north-east across the room — placed by the line
     between the two, not by "against the nearest wall", which is the
     mistake that put the bed and the fridge inside each other.
     ==================================================================== */
  {
    const WOOD="#7a5636", WOODD="#5c4029", STEEL="#a7ada6", STEELD="#7f857f";
    const R2=n=>((Math.sin(n*78.233+12.9898)*43758.5)%1+1)%1;

    /* --- the chair he actually sits in, in the south-west corner ------ */
    const ACX=-42.42, ACZ=1.08;
    {
      // aimed at the television, which is diagonally across the room
      const ry=Math.PI+Math.atan2(TVX-ACX, TVZ-ACZ);
      const S=(dx2,dz2)=>[ACX+dx2*Math.cos(ry)-dz2*Math.sin(ry),
                          ACZ+dx2*Math.sin(ry)+dz2*Math.cos(ry)];
      // a low sprung chair that has given up: seat dished, back leaning
      bx("fabric", 0.86, 0.34, 0.80, ACX, y0+0.22, ACZ, 0.55, ry, "#4f4636");
      push("fabric", boxGeo(0.72, 0.16, 0.66, 0.55), ACX, y0+0.41, ACZ, ry, "#5e5542", 0, 0);
      {                                     // the cushion, sat into a hollow
        const g=new T.SphereGeometry(0.34,14,9); g.scale(1.06,0.26,0.98);
        push("fabric", g, ACX, y0+0.44, ACZ, ry, "#6a6049", -0.03, 0);
      }
      {
        const b2=S(0,-0.40);
        push("fabric", boxGeo(0.84, 0.72, 0.22, 0.55), b2[0], y0+0.70, b2[1], ry, "#4f4636", -0.17, 0);
        const c2=S(0,-0.31);
        push("fabric", boxGeo(0.70, 0.56, 0.14, 0.55), c2[0], y0+0.72, c2[1], ry, "#5e5542", -0.19, 0);
      }
      for(const q of [-1,1]){               // arms, worn pale where the hands go
        const a2=S(q*0.41, -0.02);
        push("fabric", boxGeo(0.14, 0.26, 0.74, 0.55), a2[0], y0+0.52, a2[1], ry, "#4f4636", 0, 0);
        push("fabric", boxGeo(0.16, 0.08, 0.40, 0.55), a2[0], y0+0.66, a2[1], ry, "#7d7257", 0, 0);
      }
      for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]]){
        const q=S(a[0]*0.34, a[1]*0.32);
        cyl("oak", 0.026,0.020,0.10,8, q[0], y0+0.05, q[1], WOODD);
      }
      // a blanket thrown over the back, because the nights get cold out here
      {
        const b2=S(0.10,-0.44);
        push("spread", boxGeo(0.46, 0.62, 0.10, 0.5), b2[0], y0+0.74, b2[1], ry+0.06, "#8a6a50", -0.14, 0);
        const c2=S(0.10,-0.30);
        push("spread", boxGeo(0.42, 0.14, 0.26, 0.5), c2[0], y0+1.02, c2[1], ry+0.06, "#8a6a50", 0.5, 0);
      }
      addCol(ACX-0.52, ACX+0.52, ACZ-0.52, ACZ+0.52, y0, y0+0.56);
      addSeat(ACX, ACZ+0.04, y0+0.46, ry, "THE CHAIR");
    }

    /* --- what is within reach of it ----------------------------------- */
    {
      const SX=-43.26, SZ=0.52;             // a little table at his left hand
      bx("oak", 0.44, 0.04, 0.44, SX, y0+0.54, SZ, 0.6, 0, WOOD);
      for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
        cyl("oak", 0.018,0.014,0.52,8, SX+a[0]*0.17, y0+0.27, SZ+a[1]*0.17, WOODD);
      bx("oak", 0.38, 0.03, 0.38, SX, y0+0.22, SZ, 0.5, 0, "#6b4a2c");
      addCol(SX-0.25, SX+0.25, SZ-0.25, SZ+0.25, y0, y0+0.56);
      // a glass with an inch left in it, an ashtray, and the evening's reading
      cyl("glass", 0.034,0.027,0.105,12, SX+0.09, y0+0.61, SZ-0.09, "#8a9a94");
      cyl("glass", 0.030,0.030,0.030,12, SX+0.09, y0+0.575, SZ-0.09, "#6d5a38");
      cyl("metal", 0.064,0.064,0.028,14, SX-0.10, y0+0.57, SZ+0.09, "#8e9a94");
      for(let i=0;i<4;i++)
        cyl("paper", 0.008,0.008,0.048,6, SX-0.10+R2(i)*0.05-0.025, y0+0.59,
            SZ+0.09+R2(i+6)*0.05-0.025, "#d8d2c0", 0.4, i*1.21, 0.3);
      push("soot", planeGeo(0.09,0.09,0), SX-0.10, y0+0.563, SZ+0.09, 0.3, "#7a7263", -Math.PI/2, 0);
      for(let i=0;i<3;i++)                  // paperbacks, spines out, read soft
        push("paper", boxGeo(0.11,0.028,0.17,0.5), SX+0.11+i*0.004, y0+0.575+i*0.030,
             SZ+0.13+i*0.012, 0.12+i*0.09, ["#9a6a3a","#6b7a8a","#8a5a4a"][i], 0, 0);
      // the transistor radio, on all evening, tuned to whatever comes in
      bx("paint", 0.21, 0.13, 0.07, SX-0.02, y0+0.625, SZ-0.16, 0.4, 0, "#8a7a56");
      bx("metal", 0.13, 0.09, 0.012, SX-0.05, y0+0.625, SZ-0.20, 0.4, 0, "#6e6a5c");
      cyl("paint", 0.021,0.021,0.014,12, SX+0.06, y0+0.625, SZ-0.20, "#c8b47e", Math.PI/2);
      cyl("metal", 0.005,0.003,0.40,5, SX+0.08, y0+0.78, SZ-0.14, STEEL, 0.42, 0.9, 0);
      // and the standard lamp behind his shoulder, the only light he puts on
      const LX=-43.42, LZ=-0.18;
      cyl("metal", 0.13,0.13,0.025,14, LX, y0+0.02, LZ, STEELD);
      cyl("metal", 0.016,0.016,1.42,8, LX, y0+0.73, LZ, STEELD);
      push("lampshade", new T.CylinderGeometry(0.15,0.21,0.26,16), LX, y0+1.56, LZ, 0, "#ddc9a2");
      cyl("metal", 0.030,0.030,0.05,10, LX, y0+1.42, LZ, "#b8a67e");
      LAMPS.push({x:LX, y:y0+1.48, z:LZ, color:0xffd6a2, intensity:0.30, dist:5.2,
                  decay:2.0, indoor:true, vol:[A.x0,A.x1, IZ0-0.3, A.z1, y0-0.5, y0+CH+0.3]});
      addCol(LX-0.16, LX+0.16, LZ-0.16, LZ+0.16, y0, y0+1.70);
    }

    /* --- a chest of drawers on the south wall, west of the door ------- */
    {
      const CX=-42.74, CZ=IZ0+0.30, CW=1.12, CD=0.52, CHh=0.84;
      bx("oak", CW, CHh, CD, CX, y0+CHh/2, CZ, 0.55, 0, WOOD);
      bx("oak", CW+0.06, 0.04, CD+0.05, CX, y0+CHh+0.02, CZ, 0.55, 0, "#6b4a2c");
      for(let i=0;i<3;i++){
        const dy=y0+0.17+i*0.23;
        bx("oak", CW-0.08, 0.19, 0.03, CX, dy, CZ-CD/2-0.015, 0.5, 0, "#6b4a2c");
        for(const q of [-1,1])
          cyl("metal", 0.020,0.020,0.030,10, CX+q*0.26, dy, CZ-CD/2-0.035, "#b8a67e", Math.PI/2);
      }
      for(const q of [-1,1])
        bx("oak", 0.07, 0.10, CD-0.06, CX+q*(CW/2-0.04), y0+0.05, CZ, 0.4, 0, WOODD);
      addCol(CX-CW/2-0.03, CX+CW/2+0.03, CZ-CD/2-0.05, CZ+CD/2, y0, y0+CHh+0.05);
      // what lives on top of it
      const TY=y0+CHh+0.04;
      bx("fabric", 0.34, 0.012, 0.30, CX-0.34, TY+0.006, CZ-0.02, 0.5, 0.2, "#b6ab90");
      for(let i=0;i<3;i++)                  // folded towels off the laundry cart
        bx("bath", 0.30, 0.055, 0.24, CX-0.34, TY+0.04+i*0.055, CZ-0.02, 0.5,
           0.2+i*0.04, ["#c2bda8","#b4b9ae","#c8c0a6"][i]);
      cyl("plaster", 0.052,0.046,0.11,14, CX+0.42, TY+0.055, CZ+0.02, "#c6bda6");  // a tin
      cyl("metal", 0.053,0.053,0.012,14, CX+0.42, TY+0.116, CZ+0.02, "#9aa1a6");
      bx("oak", 0.17, 0.21, 0.025, CX+0.12, TY+0.105, CZ+0.08, 0.4, -0.22, WOODD);  // a photo
      push("art", planeGeo(0.13,0.17,0), CX+0.12, TY+0.105, CZ+0.065, -0.22, "#9c8e70", 0, 0);
      bx("oak", 0.04, 0.12, 0.04, CX+0.12, TY+0.015, CZ+0.12, 0.4, -0.22, WOODD);
      for(let i=0;i<4;i++)                  // loose change and a key, swept there
        cyl("metal", 0.009,0.009,0.003,10, CX-0.02+R2(i)*0.10, TY+0.004,
            CZ-0.14+R2(i+3)*0.10, i%2?"#b8a67e":"#9aa1a6");
      bx("metal", 0.020, 0.004, 0.058, CX+0.02, TY+0.004, CZ-0.17, 0.4, 0.6, "#c8b47e");
    }

    /* --- the door end: boots, hooks, and the office's second bell ----- */
    {
      // the mat is the only thing allowed in LANE, and it is 2 cm thick
      push("fabric", boxGeo(0.86, 0.022, 0.52, 0.8), APT_DX+0.02, y0+0.032, IZ0+0.38,
           0.03, "#5a5346", 0, 0);
      push("soot", planeGeo(0.78, 0.44, 0), APT_DX+0.02, y0+0.046, IZ0+0.38, 0.03,
           "#6e6558", -Math.PI/2, 0);
      // boots, east of the lane, one fallen over
      for(const q of [[-40.44, -0.62, 0.0],[-40.28, -0.54, 0.22]]){
        push("oak", boxGeo(0.11, 0.13, 0.27, 0.5), q[0], y0+0.07, q[1], q[2], "#4e3a24", 0, 0);
        push("oak", boxGeo(0.105, 0.20, 0.13, 0.5), q[0], y0+0.17, q[1]-0.06, q[2], "#44321f", 0, 0);
      }
      // a rail of hooks on the south wall, with the working coat on one
      const HX=-40.00;
      bx("oak", 0.86, 0.09, 0.035, HX, y0+1.74, IZ0+0.025, 0.4, 0, WOODD);
      for(let i=0;i<3;i++){
        const hx2=HX-0.30+i*0.30;
        cyl("metal", 0.009,0.009,0.075,6, hx2, y0+1.72, IZ0+0.06, "#b8b4a8", Math.PI/2);
        push("metal", new T.SphereGeometry(0.015,8,6), hx2, y0+1.72, IZ0+0.096, 0, "#b8b4a8");
      }
      /* A COAT IS NOT A SLAB. The first one was a single 44 by 84 box on
         the wall and read as a locker door. Clothing hangs: narrow
         shoulders, a body that falls, and two sleeves down the sides. */
      const CTY=y0+1.62;                                     // where it hangs from
      push("fabric", boxGeo(0.38, 0.13, 0.11, 0.6), HX-0.30, CTY, IZ0+0.115, 0.04, "#454c3e", 0, 0);
      push("fabric", boxGeo(0.30, 0.56, 0.10, 0.6), HX-0.30, CTY-0.37, IZ0+0.110, 0.04, "#4e5548", 0, 0);
      push("fabric", boxGeo(0.26, 0.22, 0.09, 0.6), HX-0.30, CTY-0.73, IZ0+0.105, 0.04, "#454c3e", 0, 0);
      for(const q of [-1,1])                                 // the sleeves
        push("fabric", boxGeo(0.10, 0.50, 0.09, 0.6), HX-0.30+q*0.19, CTY-0.30,
             IZ0+0.105, 0.04, "#4e5548", 0, q*0.07);
      push("fabric", new T.CylinderGeometry(0.035,0.035,0.09,8), HX-0.30, CTY+0.08,
           IZ0+0.10, 0, "#454c3e", Math.PI/2, 0);            // the collar roll
      // and the hat on the next hook: a brim with a crown in it
      push("fabric", new T.CylinderGeometry(0.175,0.175,0.014,16), HX+0.30, y0+1.66,
           IZ0+0.15, 0, "#8a7a56", Math.PI/2-0.22, 0);
      push("fabric", new T.CylinderGeometry(0.105,0.115,0.13,14), HX+0.30, y0+1.655,
           IZ0+0.215, 0, "#7d6e4c", Math.PI/2-0.22, 0);
      push("fabric", new T.CylinderGeometry(0.119,0.119,0.035,14), HX+0.30, y0+1.657,
           IZ0+0.185, 0, "#5f5438", Math.PI/2-0.22, 0);
      /* The office telephone rings in here too. A manager who lives behind
         the desk does not get to stop answering it at six o'clock, and the
         extension bell on his own wall is the detail that says so. */
      const PX=-39.10;
      bx("oak", 0.17, 0.22, 0.09, PX, y0+1.58, IZ0+0.06, 0.4, 0, WOODD);
      for(const q of [-1,1])
        push("metal", new T.SphereGeometry(0.052,12,9), PX+q*0.05, y0+1.70, IZ0+0.085,
             0, "#9a8a5e");
      cyl("metal", 0.012,0.012,0.09,8, PX, y0+1.70, IZ0+0.10, "#6e6a5c", Math.PI/2);
      push("paper", planeGeo(0.13,0.09,0), PX, y0+1.49, IZ0+0.056, 0, "#cfc6ae", 0, 0.05);
    }

    /* --- the motel's stock, kept in here because there is nowhere else - */
    {
      const bxs=[[-41.26, IZ1-0.52, 0.00, 0.52, 0.40, 0.38],
                 [-41.26, IZ1-0.50, 0.40, 0.46, 0.32, 0.34],
                 [-42.08, IZ1-0.46, 0.00, 0.58, 0.44, 0.40]];
      for(const q of bxs){
        bx("bin", q[3], q[4], q[5], q[0], y0+q[2]+q[4]/2, q[1], 0.5, (q[2]?0.22:0.05), "#8a7a5e");
        bx("bin", q[3]-0.05, 0.012, q[5]-0.05, q[0], y0+q[2]+q[4]-0.004, q[1], 0.5,
           (q[2]?0.22:0.05), "#7a6a50");
        push("paper", planeGeo(q[3]*0.5, 0.07, 0), q[0], y0+q[2]+q[4]*0.62, q[1]-q[5]/2-0.004,
             q[2]?0.22:0.05, "#cfc6ae", 0, 0);
      }
      addCol(-42.42, -40.96, IZ1-0.78, IZ1, y0, y0+0.90);
      // and what came out of the top one: soap, bulbs, a stack of folded cards
      for(let i=0;i<5;i++)
        bx("paper", 0.05, 0.022, 0.035, -40.84+((i%3)*0.07), y0+0.012,
           IZ1-0.86-((i/3)|0)*0.06, 0.4, R2(i)*0.9, "#e2ddcc");
      push("plaster", new T.SphereGeometry(0.030,10,8), -40.70, y0+0.034, IZ1-0.98, 0, "#ddd6c4");
      // a broom and a dustpan in the corner where the two runs meet
      cyl("oak", 0.014,0.014,1.34, 8, -42.86, y0+0.70, IZ1-0.16, "#9a8356", 0.12, 0, 0.06);
      bx("fabric", 0.18, 0.22, 0.07, -42.94, y0+0.11, IZ1-0.24, 0.5, 0.06, "#8a7a4e");
      bx("metal", 0.26, 0.05, 0.22, -42.52, y0+0.03, IZ1-0.16, 0.4, 0.3, "#8e8274");
      bx("metal", 0.26, 0.17, 0.03, -42.52, y0+0.10, IZ1-0.05, 0.4, 0.3, "#8e8274");
    }

    /* --- a trunk at the foot of the bed, and a fan pointed at it ------ */
    {
      const TKX=(BEDX[0]+BEDX[1])/2, TKZ=BEDZ[0]-0.42;
      bx("oak", 1.18, 0.40, 0.46, TKX, y0+0.20, TKZ, 0.55, 0.02, "#5e4428");
      bx("oak", 1.22, 0.06, 0.50, TKX, y0+0.42, TKZ, 0.55, 0.02, "#4c3620");
      for(const q of [-1,1])
        bx("metal", 0.04, 0.44, 0.50, TKX+q*0.46, y0+0.21, TKZ, 0.4, 0.02, "#8e8274");
      bx("metal", 0.12, 0.09, 0.03, TKX, y0+0.30, TKZ-0.24, 0.4, 0.02, "#b8a67e");
      addCol(TKX-0.62, TKX+0.62, TKZ-0.27, TKZ+0.27, y0, y0+0.46);
      push("spread", boxGeo(0.72,0.10,0.34,0.5), TKX-0.14, y0+0.49, TKZ+0.04, 0.09, "#7d6a4e", 0.05, 0);
      // the pedestal fan, which is the only air conditioning in here
      const FX=-41.58, FZ=3.46;
      cyl("metal", 0.17,0.19,0.03,16, FX, y0+0.02, FZ, STEELD);
      cyl("metal", 0.020,0.020,1.00,8, FX, y0+0.52, FZ, STEEL);
      push("metal", new T.CylinderGeometry(0.058,0.062,0.14,14), FX, y0+1.10, FZ+0.08,
           0, "#9aa1a6", Math.PI/2, 0);
      for(let i=0;i<4;i++)                 // blades, in front of the motor can
        push("metal", boxGeo(0.112,0.016,0.052,0), FX, y0+1.10, FZ+0.02, 0,
             "#b2b8b0", 0, 0.42+i*1.571);
      for(let i=0;i<5;i++)
        push("metal", new T.TorusGeometry(0.045+i*0.027, 0.004, 5, 20), FX, y0+1.10, FZ+0.015,
             0.5, "#c0c4bc", 0, 0);
      addCol(FX-0.20, FX+0.20, FZ-0.20, FZ+0.20, y0, y0+1.20);
    }

    /* --- the walls, up where you look when you cannot sleep ----------- */
    {
      // a damp bloom on the ceiling, where the cooler has leaked for years
      push("soot", planeGeo(1.30, 1.00, 0), -41.10, y0+CH-0.105, IZ0+4.30, 0.3,
           "#9a9284", Math.PI/2, 0);
      push("soot", planeGeo(0.70, 0.56, 0), -41.26, y0+CH-0.107, IZ0+4.42, 0.9,
           "#8a8274", Math.PI/2, 0);
      // flypaper, hung off the rose and black since July
      cyl("paper", 0.016,0.016,0.52,6, -40.20, y0+CH-0.30, IZ0+2.10, "#b39a5e", 0, 0, 0.05);
      for(let i=0;i<7;i++)
        push("paint", boxGeo(0.012,0.012,0.012,0), -40.20+R2(i)*0.022-0.011,
             y0+CH-0.14-R2(i+5)*0.44, IZ0+2.10+R2(i+2)*0.022-0.011, 0, "#2b2722", 0, 0);
      // a pinboard on the east wall by the table: rotas, a card, a clipping
      const PBZ=IZ0+2.05;
      bx("oak", 0.03, 0.46, 0.62, IX1-0.015, y0+1.66, PBZ, 0.4, 0, "#6b4a2c");
      push("fabric", planeGeo(0.40, 0.56, 0), IX1-0.032, y0+1.66, PBZ, -Math.PI/2, "#8a7a5e", 0, 0);
      for(const q of [[0.12,-0.18,"#cfc6ae",0.11,0.15],[-0.06,0.14,"#dfd7bd",0.13,0.09],
                      [0.14,0.16,"#c8bda0",0.09,0.12],[-0.14,-0.08,"#d4ccb4",0.10,0.08]]){
        push("paper", planeGeo(q[3], q[4], 0), IX1-0.040, y0+1.66+q[0], PBZ+q[1],
             -Math.PI/2, q[2], 0, R2(q[3]*31)*0.3-0.15);
        push("metal", new T.SphereGeometry(0.008,6,5), IX1-0.046, y0+1.72+q[0], PBZ+q[1], 0, "#b03a2a");
      }
      // a wall clock over the television, stopped or not you cannot tell
      cyl("paint", 0.115,0.115,0.045,18, IX1-0.04, y0+2.04, IZ1-1.58, "#3f4a44", 0,0,Math.PI/2);
      cyl("clockface", 0.098,0.098,0.012,18, IX1-0.066, y0+2.04, IZ1-1.58, "#e8e2cf", 0,0,Math.PI/2);
      // a framed desert print on the north wall, hung low and crooked
      bx("oak", 0.40, 0.30, 0.03, A.x0+1.26, y0+1.78, IZ1-0.02, 0.4, 0, WOODD);
      push("art", planeGeo(0.34, 0.24, 0), A.x0+1.26, y0+1.78, IZ1-0.040, Math.PI, "#a8936c", 0, 0.035);
    }

    /* --- over the sink, and over the stove ---------------------------- */
    {
      const KX=IX0+0.32, CT=0.90, sz2=(WINW[0]+WINW[1])/2;
      /* UNDER THE CUPBOARD MEANS UNDER THE CUPBOARD. The strip light was
         put at "the sink window minus 30 cm", which is nowhere near the
         cupboard — it hung in front of the glass. It is hung off the
         cupboard's own centre-line now, which is where it cannot drift. */
      const CUZ2=(KZ0+WINW[0])/2;
      bx("metal", 0.26, 0.055, 0.78, IX0+0.19, y0+1.52, CUZ2, 0.4, 0, "#b2b8b0");
      push("lampshade", planeGeo(0.20, 0.74, 0), IX0+0.19, y0+1.492, CUZ2,
           0, "#efe6cc", Math.PI/2, 0);      // faces DOWN at the counter
      LAMPS.push({x:IX0+0.44, y:y0+1.44, z:CUZ2, color:0xfff0cc, intensity:0.26,
                  dist:3.8, decay:2.0, indoor:true,
                  vol:[A.x0,A.x1, IZ0-0.3, A.z1, y0-0.5, y0+CH+0.3]});
      /* The sink window had no sill, so the first cut of the cactus and the
         soap stood on air three centimetres under the glass. The north
         window has one; this one now does too, and everything on it is
         placed off the sill's top rather than off the glass. */
      bx("lino", 0.18, 0.05, WINW[1]-WINW[0]+0.16, IX0+0.07, y0+1.00, sz2,
         0.5, 0, "#b3a88e");
      const SILL=y0+1.025;                  // the top of it, which things sit on
      cyl("metal", 0.055,0.050,0.105,14, IX0+0.10, SILL+0.053, sz2-0.34, "#9a7a4e");
      push("paper", planeGeo(0.10, 0.07, 0), IX0+0.156, SILL+0.053, sz2-0.34, Math.PI/2, "#c8bda0", 0, 0);
      for(let i=0;i<3;i++)
        cyl("foliage", 0.028,0.034,0.17+i*0.05, 7, IX0+0.10+(i-1)*0.028,
            SILL+0.13+i*0.025, sz2-0.34+(i%2?0.02:-0.02), "#6b7a52",
            (i-1)*0.16, 0, (i-1)*0.10);
      bx("plaster", 0.07, 0.030, 0.045, IX0+0.10, SILL+0.015, sz2+0.10, 0.4, 0.3, "#ddd6c4");
      bx("fabric", 0.08, 0.030, 0.06, IX0+0.10, SILL+0.015, sz2+0.26, 0.4, -0.2, "#7a8a6e");
      // a tea towel over the oven door handle, and the bin beside the run
      push("fabric", boxGeo(0.03, 0.30, 0.22, 0.6), KX+0.34, y0+0.52, KZ0+1.72, 0.0, "#9fa8a0", 0, 0.04);
      /* THE WALL IS AT IZ1, NOT AT THE END OF THE COUNTER. The kitchen run
         stops at KZ0+6.60 and the north wall is 38 cm further on, so the
         bin and the chair, placed "just past the end of the counter", went
         straight through it into the yard. Anything placed off one piece of
         furniture still has to be checked against the room. */
      const BNX=KX+0.52, BNZ=KZ1-0.20;
      cyl("bin", 0.14,0.12,0.42,14, BNX, y0+0.21, BNZ, "#6b7068");
      cyl("bin", 0.145,0.145,0.025,14, BNX, y0+0.435, BNZ, "#5a605a");
      push("paper", boxGeo(0.10,0.07,0.09,0), BNX+0.04, y0+0.47, BNZ-0.03, 0.6, "#cfc6ae", 0.3, 0);
      addCol(BNX-0.17, BNX+0.17, BNZ-0.17, BNZ+0.17, y0, y0+0.46);
      // a kitchen chair nobody sits on, standing out in the room with the
      // laundry on it, because there is nowhere else to put either
      const CCX=IX0+1.23, CCZ=IZ0+3.55;
      bx("oak", 0.40, 0.04, 0.40, CCX, y0+0.44, CCZ, 0.5, -0.5, WOOD);
      for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
        cyl("metal", 0.015,0.015,0.44,8, CCX+a[0]*0.16, y0+0.22, CCZ+a[1]*0.16, STEEL);
      bx("oak", 0.38, 0.30, 0.04, CCX+0.09, y0+0.70, CCZ+0.17, 0.5, -0.5, WOOD);
      for(let i=0;i<4;i++)
        bx("bath", 0.32, 0.055, 0.26, CCX, y0+0.48+i*0.055, CCZ-0.02, 0.5,
           -0.5+R2(i)*0.14, ["#c2bda8","#b4b9ae","#c8c0a6","#bfb8a2"][i]);
      addCol(CCX-0.26, CCX+0.26, CCZ-0.26, CCZ+0.26, y0, y0+0.74);
    }

    /* --- outside: the swamp cooler that has run every summer since 68 - */
    {
      const CX=(A.x0+A.x1)/2+1.10, CZ=(IZ0+A.z1)/2+0.70, RY=y0+CH+0.40;
      for(const a of [[-1,-1],[1,-1],[-1,1],[1,1]])
        bx("metal", 0.07, 0.16, 0.07, CX+a[0]*0.40, RY+0.08, CZ+a[1]*0.40, 0.4, 0, "#6e6a5c");
      bx("metal", 0.96, 0.84, 0.96, CX, RY+0.58, CZ, 0.5, 0, "#9aa1a6");
      for(const q of [-1,1]){               // the pads in their louvred frames
        bx("metal", 0.03, 0.62, 0.82, CX+q*0.49, RY+0.56, CZ, 0.4, 0, "#7f857f");
        for(let i=0;i<7;i++)
          push("metal", boxGeo(0.05,0.035,0.80,0), CX+q*0.51, RY+0.30+i*0.085, CZ,
               0, "#8e9a94", 0, -0.42);
      }
      bx("metal", 0.84, 0.03, 0.84, CX, RY+1.01, CZ, 0.5, 0, "#8e9a94");
      cyl("metal", 0.085,0.085,0.10,12, CX, RY+1.06, CZ, "#7f857f");
      push("rust", planeGeo(0.52, 0.70, 0), CX+0.505, RY+0.52, CZ+0.18, Math.PI/2, "#7a6246", 0, 0);
      push("rust", planeGeo(0.60, 0.46, 0), CX, RY+0.16, CZ-0.485, Math.PI, "#7a6246", 0, 0);
      // the duct down into the ceiling, and the drip line that stains the wall
      bx("metal", 0.46, 0.44, 0.46, CX, RY-0.10, CZ, 0.4, 0, "#9aa1a6");
      cyl("metal", 0.010,0.010,1.20,6, CX+0.46, RY-0.42, CZ+0.40, "#8e8274", 0.1, 0, 0.06);
      push("rust", planeGeo(0.26, 1.60, 0), A.x1+0.004, y0+1.50, CZ+0.30, Math.PI/2, "#6b5a45", 0, 0);
    }
  }
})();
