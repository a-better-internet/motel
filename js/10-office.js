"use strict";
/* LOW DESERT MOTEL · 10-office.js
   front desk office, and the cars parked outside it
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   10 · FRONT DESK OFFICE
   ---------------------------------------------------------------------- */
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
  bx("stucco", w-0.44, h, 0.22, cx, y0+h/2, O.z1-0.11, 0.3, 0, SLATE);
  addCol(O.x0,O.x1, O.z1-0.22, O.z1, y0, y0+h);
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
  // coffee urn station
  bx("oak", 1.30,0.90,0.50, O.x0+1.9, y0+0.45, O.z1-0.6, 0.6, 0, "#5c4029");
  cyl("metal", 0.16,0.18,0.46,12, O.x0+1.6, y0+1.13, O.z1-0.6, "#c9cdcd");
  cyl("metal", 0.16,0.18,0.46,12, O.x0+2.2, y0+1.13, O.z1-0.6, "#c9cdcd");
  addCol(O.x0+1.2,O.x0+2.6, O.z1-0.9, O.z1-0.3, y0, y0+1.0);
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
  for(const wl of [[cx,O.z1-0.30,w-0.5,0.06],
                   [(O.x0+glazeX0)/2, O.z0+0.30, glazeX0-O.x0-0.25, 0.06],
                   [(glazeX1+O.x1)/2, O.z0+0.30, O.x1-glazeX1-0.25, 0.06],
                   [O.x0+0.30,cz,0.06,d-0.5],
                   [O.x1-0.30,(O.z0+doorZ0)/2,0.06,doorZ0-O.z0-0.25],
                   [O.x1-0.30,(doorZ1+O.z1)/2,0.06,O.z1-doorZ1-0.25]])
    bx("roomwall", wl[2], h-1.35, wl[3], wl[0], y0+1.14+(h-1.35)/2, wl[1], 0.45, 0, "#ded3b6");
  // header liner over the door, so the reveal reads as a doorway
  bx("roomwall", 0.06, h-2.34, doorZ1-doorZ0, O.x1-0.30, y0+2.20+(h-2.34)/2, cz, 0.45, 0, "#ded3b6");
  bx("oak", 0.30, 0.10, doorZ1-doorZ0+0.30, O.x1-0.16, y0+2.16, cz, 0.6, 0, "#5c4029");

  /* --- the kitsch: what actually makes a 1962 motel office ------------ */
  const O_=(bk,ww,hh,dd,px,py,pz,uv,c)=>bx(bk,ww,hh,dd,px,y0+py,pz,uv,0,c);
  const OC=(bk,rt,rb,hh,seg,px,py,pz,c,rx,rz)=>cyl(bk,rt,rb,hh,seg,px,y0+py,pz,c,rx,0,rz);
  // knotty-pine dado around the whole lobby, capped with a chair rail
  // NB: split around the entrance — a chair rail must never span a doorway
  const dadoRuns=[[cx,O.z1-0.24,w-0.5,0.10],
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
  // The office read as one flat wash of amber. The chandelier stays warm but
  // goes paler, and three low fills — a cool one off the shopfront glazing and
  // two soft ones down the room — give it somewhere for the light to fall off
  // to instead of a single colour everywhere.
  LAMPS.push({x:cx+1.2, y:y0+h-0.75, z:cz+0.4, color:0xfff0d8, intensity:0.50,
              dist:15, decay:1.25, indoor:true});
  LAMPS.push({x:O.x1-2.4, y:y0+2.10, z:O.z0+1.40, color:0xd8e6f2, intensity:0.30,
              dist:12, decay:1.5, indoor:true});                    // daylight off the glass
  LAMPS.push({x:O.x0+4.4, y:y0+2.30, z:(O.z0+O.z1)/2, color:0xf6efdf, intensity:0.26,
              dist:11, decay:1.5, indoor:true});
  LAMPS.push({x:O.x1-4.6, y:y0+2.30, z:O.z1-2.2, color:0xf2ead8, intensity:0.24,
              dist:11, decay:1.5, indoor:true});
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
  // soda machine and a cigarette machine against the north wall
  O_("paint", 1.00,1.86,0.66, O.x0+4.6, 0.93, O.z1-0.58, 0, "#8f2c22");
  push("pic:vendFront:snack", planeGeo(0.76,1.52,0), O.x0+4.6, y0+1.04, O.z1-0.955,
       Math.PI, "#ffffff");
  addCol(O.x0+4.1,O.x0+5.1, O.z1-1.0, O.z1-0.3, y0, y0+1.9);
  O_("paint", 0.62,1.40,0.46, O.x0+5.9, 0.70, O.z1-0.48, 0, "#3a4a52");
  O_("metal", 0.54,0.10,0.04, O.x0+5.9, 1.16, O.z1-0.74, 0, "#b8bcbc");
  addCol(O.x0+5.6,O.x0+6.2, O.z1-0.8, O.z1-0.25, y0, y0+1.5);
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

  // three warm ceiling pans
  for(const p of [[O.x0+2.6,cz-2.4],[O.x0+6.4,cz],[O.x1-2.4,cz+2.2]]){
    push("ceilfix", new T.CylinderGeometry(0.34,0.40,0.14,14), p[0], y0+h-0.30, p[1], 0, "#e8dcc0");
    LAMPS.push({x:p[0], y:y0+h-0.45, z:p[1], color:0xfff2e0, intensity:0.62, dist:16, decay:1.2, indoor:true});
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
