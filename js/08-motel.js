"use strict";
/* LOW DESERT MOTEL · 08-motel.js
   two wings of bays and everything in them
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   8 · THE MOTEL — two wings of bays in an L around the courtyard
   Each wing is authored in a local frame (rooms face -Z, interior toward +Z)
   and placed by a transform, so the same bay code builds the north wing and
   the east wing without a second copy.
   ---------------------------------------------------------------------- */
const BASE=0.15;                       // building pad, one step above the lot
const lvlY=l=>BASE+l*FLOOR_H;
const WALL_H0=FLOOR_H, WALL_H1=3.00;   // exterior wall height per level
const DOORS=[], ROOMS=[], LAMPS=[];
const NEON=[], VAC_NEON=[];   // painted panels that brighten after dark
let SLOW_GREEN=null;          // the one screen in the control room still lit

function XF(ox,oz,ry){
  const c=Math.cos(ry), s=Math.sin(ry);
  return {
    ry:ry, swap:Math.abs(s)>0.5,
    x:(lx,lz)=>ox+lx*c+lz*s,
    z:(lx,lz)=>oz-lx*s+lz*c
  };
}
function lbx(xf, name, w,h,d, lx,ly,lz, uv, color){
  push(name, boxGeo(w,h,d,uv===undefined?0.35:uv), xf.x(lx,lz), ly, xf.z(lx,lz), xf.ry, color);
}
function lcol(xf, w,d, lx,lz, y0,y1){
  const wx=xf.x(lx,lz), wz=xf.z(lx,lz);
  const ww=xf.swap?d:w, dd=xf.swap?w:d;
  addCol(wx-ww/2, wx+ww/2, wz-dd/2, wz+dd/2, y0, y1);
}
function lwall(xf, name, w,h,d, lx,ly,lz, uv, color){
  lbx(xf,name,w,h,d,lx,ly,lz,uv,color);
  lcol(xf,w,d,lx,lz, ly-h/2, ly+h/2);
}
function lflat(xf, lx0,lx1,lz0,lz1, y){
  const a=[xf.x(lx0,lz0),xf.z(lx0,lz0)], b=[xf.x(lx1,lz1),xf.z(lx1,lz1)];
  addFlat(Math.min(a[0],b[0]),Math.max(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[1],b[1]), y);
}
// the same rectangle as an array, for a lamp that must not shine through walls
function lvol(xf, lx0,lx1,lz0,lz1, y0,y1){
  const a=[xf.x(lx0,lz0),xf.z(lx0,lz0)], b=[xf.x(lx1,lz1),xf.z(lx1,lz1)];
  return [Math.min(a[0],b[0]),Math.max(a[0],b[0]),
          Math.min(a[1],b[1]),Math.max(a[1],b[1]), y0,y1];
}
function lzone(xf, lx0,lx1,lz0,lz1, y0,y1, name, indoor){
  const a=[xf.x(lx0,lz0),xf.z(lx0,lz0)], b=[xf.x(lx1,lz1),xf.z(lx1,lz1)];
  addZone(Math.min(a[0],b[0]),Math.max(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[1],b[1]),
          y0,y1, name, indoor);
}

/* --- door leaf: its own little merged mesh so it can swing ------------- */
// `ajar` leaves a door standing part-open for good: the one down the far end
// of the walkway with the light on behind it and nobody in the room.
// Three doors, because three different businesses hung them. `style` picks
// which: the motel's painted panel door, the Canteen's oxblood steel one with
// a brass kick plate and a push bar, or the drive-in booth's louvred grey one
// with a hasp on it.
function makeDoor(xf, lx, ly, lz, roomNo, opensIn, ajar, style){
  const ent=[], leafH=2.02, leafT=0.055;
  const leafW = style ? 0.98 : 0.92;
  const m4=(x,y,z)=>new T.Matrix4().makeTranslation(x,y,z);
  const rot=(x,y,z,rx,ry,rz)=>new T.Matrix4().compose(new T.Vector3(x,y,z),
    new T.Quaternion().setFromEuler(new T.Euler(rx||0,ry||0,rz||0)), new T.Vector3(1,1,1));
  const cream=new T.Color(0xd9d3c1), tealc=new T.Color(0x2f8b83), brass=new T.Color(0xcaa23c);
  const steel=new T.Color(0x8e968c), dark=new T.Color(0x3a332e);
  if(style==="bar"){
    const ox=new T.Color(0x5e2a24), edge=new T.Color(0x7a3a30), gl=new T.Color(0x17201f);
    ent.push({geo:boxGeo(leafW,leafH,leafT,0.5), matrix:m4(leafW/2, leafH/2, 0), color:ox});
    for(const sd of [1,-1]){
      ent.push({geo:boxGeo(leafW-0.05,0.30,0.012,0.5),                     // kick plate
                matrix:m4(leafW/2, 0.17, sd*(leafT/2+0.007)), color:brass});
      ent.push({geo:boxGeo(leafW-0.05,0.025,0.012,0.5),                    // a rail line
                matrix:m4(leafW/2, 1.78, sd*(leafT/2+0.006)), color:edge});
      ent.push({geo:boxGeo(0.40,0.40,0.02,0.5),                            // the port
                matrix:m4(leafW*0.50, 1.44, sd*(leafT/2+0.008)), color:edge});
      ent.push({geo:boxGeo(0.32,0.32,0.02,0.5),
                matrix:m4(leafW*0.50, 1.44, sd*(leafT/2+0.013)), color:gl});
      ent.push({geo:boxGeo(leafW-0.22,0.055,0.055,0.5),                    // the push bar
                matrix:m4(leafW/2, 1.02, sd*(leafT/2+0.055)), color:brass});
      for(const q of [-1,1])
        ent.push({geo:boxGeo(0.05,0.05,0.07,0.5),
                  matrix:m4(leafW/2+q*(leafW/2-0.13), 1.02, sd*(leafT/2+0.028)), color:brass});
    }
  }else if(style==="booth"){
    const oliv=new T.Color(0x6f7566), rib=new T.Color(0x5b6154);
    ent.push({geo:boxGeo(leafW,leafH,leafT,0.5), matrix:m4(leafW/2, leafH/2, 0), color:oliv});
    for(const sd of [1,-1]){
      for(let i=0;i<4;i++)                                                 // louvres
        ent.push({geo:boxGeo(leafW-0.26,0.045,0.03,0.5),
                  matrix:rot(leafW/2, 1.52+i*0.09, sd*(leafT/2+0.010), -0.34*sd), color:rib});
      ent.push({geo:boxGeo(leafW-0.20,0.60,0.015,0.5),                     // a dented panel
                matrix:m4(leafW/2, 0.52, sd*(leafT/2+0.006)), color:rib});
      ent.push({geo:boxGeo(0.16,0.09,0.02,0.5),                            // the hasp plate
                matrix:m4(leafW-0.10, 1.10, sd*(leafT/2+0.010)), color:steel});
      ent.push({geo:boxGeo(0.13,0.030,0.030,0.5),                          // a lever handle
                matrix:m4(leafW-0.20, 0.98, sd*(leafT/2+0.030)), color:steel});
      ent.push({geo:boxGeo(0.035,0.035,0.045,0.5),
                matrix:m4(leafW-0.13, 0.98, sd*(leafT/2+0.020)), color:steel});
    }
    ent.push({geo:new T.CylinderGeometry(0.030,0.030,0.020,10),
              matrix:rot(leafW-0.10, 1.03, 0, Math.PI/2), color:dark});
  }else if(style==="swing"){
    // the kitchen's swing door: a painted slab with a porthole, a push plate
    // and a kick plate, and nothing to hold it shut — it works from both
    // sides because a cook comes through it with both hands full
    const grn=new T.Color(0x77806e), gl2=new T.Color(0x3d4a48);
    ent.push({geo:boxGeo(leafW,leafH,leafT,0.5), matrix:m4(leafW/2, leafH/2, 0), color:grn});
    for(const sd of [1,-1]){
      ent.push({geo:new T.CylinderGeometry(0.200,0.200,0.020,18),
                matrix:rot(leafW/2, 1.46, sd*(leafT/2+0.008), Math.PI/2), color:steel});
      ent.push({geo:new T.CylinderGeometry(0.163,0.163,0.020,18),
                matrix:rot(leafW/2, 1.46, sd*(leafT/2+0.015), Math.PI/2), color:gl2});
      ent.push({geo:boxGeo(leafW-0.14,0.34,0.012,0.5),                  // push plate
                matrix:m4(leafW/2, 1.02, sd*(leafT/2+0.008)), color:steel});
      ent.push({geo:boxGeo(leafW-0.04,0.26,0.012,0.5),                  // kick plate
                matrix:m4(leafW/2, 0.17, sd*(leafT/2+0.008)), color:steel});
      ent.push({geo:boxGeo(leafW-0.04,0.022,0.016,0.5),
                matrix:m4(leafW/2, 0.31, sd*(leafT/2+0.010)), color:dark});
    }
  }else{
    // pivot sits at the hinge edge; leaf extends +x from it
    ent.push({geo:boxGeo(leafW,leafH,leafT,0.5), matrix:m4(leafW/2, leafH/2, 0), color:cream});
    for(const sd of [1,-1]){                    // panels on BOTH faces of the leaf
      ent.push({geo:boxGeo(leafW-0.16,0.50,0.02,0.5), matrix:m4(leafW/2, 0.46, sd*(leafT/2+0.012)), color:tealc});
      ent.push({geo:boxGeo(leafW-0.16,0.74,0.02,0.5), matrix:m4(leafW/2, 1.42, sd*(leafT/2+0.012)), color:tealc});
      ent.push({geo:boxGeo(leafW-0.10,0.03,0.03,0.5), matrix:m4(leafW/2, 0.99, sd*(leafT/2+0.010)), color:cream});
    }
    for(const sd of [1,-1]){
      ent.push({geo:new T.CylinderGeometry(0.035,0.035,0.10,10),
                matrix:rot(leafW-0.14,1.02,sd*(leafT/2+0.05), Math.PI/2), color:brass});
      ent.push({geo:new T.SphereGeometry(0.055,10,8),
                matrix:m4(leafW-0.14,1.02,sd*(leafT/2+0.10)), color:brass});
    }
  }
  const mesh=new T.Mesh(mergeEntries(ent), new T.MeshStandardMaterial({vertexColors:true,
    roughness: style==="booth" ? 0.78 : 0.6, metalness: style ? 0.22 : 0}));
  mesh.castShadow=true; mesh.receiveShadow=true;
  const g=new T.Group();
  g.position.set(xf.x(lx,lz), ly, xf.z(lx,lz));
  g.rotation.y=xf.ry;
  g.add(mesh); scene.add(g);
  const wx=xf.x(lx+leafW/2, lz), wz=xf.z(lx+leafW/2, lz);
  DOORS.push({g:g, open:0, target:0, x:wx, z:wz, y:ly, base:xf.ry, manual:0,
              ajar:ajar||0, swing:(opensIn?-1:1)*1.52, label:roomNo});
  return g;
}

/* --- one bay --------------------------------------------------------- */
function buildBay(xf, level, kind, roomNo, lit){
  const y0=lvlY(level), wallH=(level===0?WALL_H0:WALL_H1), top=y0+wallH;
  const cy=y0+wallH/2;

  // party wall on the local -x side (each bay adds one; the wing caps the end)
  // NB: stops short of z=0 so its front face is not coplanar with the facade
  lwall(xf,"roomwall", 0.30, wallH, 6.62, -2.85, cy, 3.49, 0.4, "#cfc4ad");

  if(kind==="alcove"){
    // Open service alcove: ice and vending downstairs, guest laundry and the
    // housekeeping store upstairs. The slab runs the full bay depth and is as
    // thick as the walkway deck, so there is no gap at the stair head.
    // slab and ceiling stop inside the back wall rather than flush with its
    // outer face, which is a face of the rear elevation
    lbx(xf,"concrete", 5.44,0.30,6.70, 0, y0-0.15, 3.39, 0.45, "#a9a294");
    lflat(xf, -2.7,2.7, -0.05,6.7, y0);
    lwall(xf,"roomwall", 5.40, wallH, 0.20, 0, cy, 6.70, 0.4, "#cfc4ad");
    lbx(xf,"ceil", 5.44,0.16,6.80, 0, y0+ROOM_H, 3.34, 0.45, "#ded4c0");
    // side returns so the alcove reads as a recess in the facade
    lwall(xf,"stucco", 0.24, wallH, 2.20, -2.60, cy, 1.30, 0.3, SLATE);
    lwall(xf,"stucco", 0.24, wallH, 2.20,  2.60, cy, 1.30, 0.3, SLATE);
    lbx(xf,"roomwall", 0.05, ROOM_H, 4.20, -2.66, y0+ROOM_H/2, 4.55, 0.4, "#cdc2ab");
    lbx(xf,"roomwall", 0.05, ROOM_H, 4.20,  2.66, y0+ROOM_H/2, 4.55, 0.4, "#cdc2ab");
    const A =(bk,w2,h2,d2,x2,y2,z2,uv,c)=>lbx(xf,bk,w2,h2,d2,x2,y0+y2,z2,uv,c);
    // NB: AP takes an ABSOLUTE y (every call site already adds y0); A takes a
    // floor-relative one. Keeping them different is deliberate — the props that
    // need a world height are the ones pushed as raw geometry.
    const AP=(bk,geo,x2,y2,z2,c,rx,rz)=>push(bk,geo, xf.x(x2,z2), y2, xf.z(x2,z2), xf.ry, c, rx, rz);
    const AC=(w2,d2,x2,z2,h2)=>lcol(xf,w2,d2,x2,z2,y0,y0+(h2||1.2));
    // conduit and a junction box, run along the back wall in both alcoves
    A("metal", 4.90,0.05,0.05, 0, 2.32, 6.58, 0, "#8f9aa0");
    A("metal", 0.05,0.44,0.05, -2.10, 2.10, 6.58, 0, "#8f9aa0");
    A("metal", 0.16,0.22,0.10, -2.10, 1.82, 6.56, 0, "#6b6f72");
    A("paint", 0.10,0.14,0.04, 2.30, 1.24, 6.62, 0, "#e2ded0");          // light switch
    AP("soot", planeGeo(1.10,1.10,0), -0.4, y0+ROOM_H-0.14, 5.40, "#2a241c", -Math.PI/2, 0);

    if(level===0){
      /* ---- ice, vending and somewhere to wait --------------------------- */
      // the three machines stand well apart along the back wall
      A("paint", 1.06,1.86,0.76, -1.95, 0.93, 6.04, 0, "#cfd4d6");        // ice machine
      A("metal", 0.92,0.44,0.06, -1.95, 1.44, 5.65, 0, "#8f9aa0");
      AP("iceglow", boxGeo(0.74,0.24,0.02,0), -1.95, y0+0.94, 5.63, "#7fd2ff");
      A("metal", 1.10,0.10,0.80, -1.95, 1.88, 6.04, 0, "#b6bcbe");
      AP("signlit", boxGeo(0.90,0.34,0.05,0), -1.95, y0+2.18, 5.70, "#e8e4d6");
      NEON.push(signPanel(0.78,0.26, hosted("vendHeader", signTex(384,128,(x,W,H)=>{
        x.fillStyle="#13405e"; x.fillRect(0,0,W,H);
        x.fillStyle="#bfe9ff"; fitText(x,"I C E", W*0.62, H*0.62, W/2, H/2+2);
      })), xf.x(-1.95,5.66), y0+2.18, xf.z(-1.95,5.66), xf.ry+Math.PI, true));
      AC(1.10,0.80, -1.95,6.04, 1.92);
      A("paint", 1.04,1.92,0.74, -0.30, 0.96, 6.06, 0, "#8f2c22");        // snack machine
      push("pic:vendFront:snack", planeGeo(0.80,1.60,0), xf.x(-0.30,5.676), y0+1.02,
           xf.z(-0.30,5.676), xf.ry+Math.PI, "#ffffff");
      A("metal", 0.86,0.20,0.06, -0.30, 0.36, 5.66, 0, "#6b6f72");
      AC(1.06,0.76, -0.30,6.06, 1.95);
      A("paint", 1.02,1.94,0.72, 1.35, 0.97, 6.07, 0, "#2f4a8a");        // soda machine
      push("pic:vendFront:soda", planeGeo(0.76,1.52,0), xf.x(1.35,5.696), y0+1.06,
           xf.z(1.35,5.696), xf.ry+Math.PI, "#ffffff");
      A("paint", 0.76,0.22,0.05, 1.35, 0.42, 5.69, 0, "#d8d4c8");
      AC(1.04,0.74, 1.35,6.07, 1.96);
      // an OUT OF ORDER card taped to the soda machine
      AP("art", boxGeo(0.26,0.20,0.02,0), 1.35, y0+1.86, 5.68, "#e6e0c4", 0, 0.14);
      /* ---- the alcove after hours ------------------------------------
         Three lit machines and nobody using them is the whole picture. Give
         them their spill on the slab, put a zapper on the return that has
         been killing moths since 1971, and let the corners go unswept.   */
      for(const g of [[-1.95,"#ffd9a0"],[-0.30,"#ffc98a"],[1.35,"#bfe0ff"]]){
        AP("floorglow", planeGeo(2.5,2.5,0), xf.x(g[0],4.85), y0+0.022, xf.z(g[0],4.85),
           g[1], -Math.PI/2, 0);
        LAMPS.push({x:xf.x(g[0],5.30), y:y0+0.9, z:xf.z(g[0],5.30), color:0xffd2a0,
                    intensity:0.22, dist:6.0, decay:1.35, indoor:true});
      }
      // bug zapper, high on the right return
      A("metal", 0.10,0.34,0.26, 2.52, 2.10, 3.40, 0, "#6b6f72");
      AP("zapper", boxGeo(0.05,0.26,0.18,0), xf.x(2.44,3.40), y0+2.10, xf.z(2.44,3.40), "#c9a8ff");
      LAMPS.push({x:xf.x(2.20,3.40), y:y0+2.10, z:xf.z(2.20,3.40), color:0x9a6cff,
                  intensity:0.20, dist:4.6, decay:1.5, indoor:true, mothy:true});
      // cobwebs in the two ceiling corners
      for(const cw of [[-2.52,6.42],[2.52,6.42]])
        AP("soot", planeGeo(0.62,0.62,0), xf.x(cw[0],cw[1]), y0+ROOM_H-0.30, xf.z(cw[0],cw[1]),
           "#d2cdbe", 0.9, cw[0]<0?0.7:-0.7);
      // a wet-floor sign left out days after the floor dried
      A("paint", 0.30,0.62,0.05, 0.62, 0.31, 4.35, 0, "#e8b32a");
      A("paint", 0.30,0.62,0.05, 0.62, 0.31, 4.55, 0, "#e8b32a");
      A("paint", 0.26,0.05,0.22, 0.62, 0.60, 4.45, 0, "#d8a520");
      AC(0.40,0.36, 0.62,4.45, 0.66);
      // change machine and a wall telephone on the right return
      A("paint", 0.18,0.50,0.40, 2.56, 1.30, 5.10, 0, "#6b6f72");
      A("metal", 0.06,0.10,0.24, 2.44, 1.16, 5.10, 0, "#caa23c");
      A("paint", 0.16,0.34,0.22, -2.54, 1.36, 1.60, 0, "#22303a");        // wall phone
      A("paint", 0.08,0.20,0.08, -2.44, 1.34, 1.60, 0, "#12191f");
      AP("metal", new T.CylinderGeometry(0.012,0.012,0.42,6), -2.42, y0+1.02, 1.72, "#2a2a28");
      // a bench tucked against the left return, out of the walking line
      A("oak", 0.42,0.09,1.56, -2.28, 0.46, 3.50, 0.6, "#5c4029");
      A("oak", 0.09,0.34,1.56, -2.50, 0.68, 3.50, 0.6, "#5c4029");
      addSeat(xf.x(-2.26,3.50), xf.z(-2.26,3.50), y0+0.52, xf.ry-Math.PI/2, "THE BENCH");
      for(const d2 of [-0.62,0.62]) A("metal", 0.38,0.44,0.09, -2.28, 0.23, 3.50+d2, 0, "#4b4f52");
      AC(0.56,1.66, -2.28,3.50, 0.9);
      AP("bin", new T.CylinderGeometry(0.27,0.23,0.72,14), 2.28, y0+0.36, 5.70, "#3f4a44");
      AP("bin", new T.CylinderGeometry(0.29,0.29,0.06,14), 2.28, y0+0.75, 5.70, "#2f3a34");
      AC(0.60,0.60, 2.28,5.70, 0.8);
      for(let k=0;k<3;k++) A("paint", 0.46,0.26,0.42, 2.30, 0.14+k*0.27, 4.30, 0, ["#b8332a","#2f5c8a","#d8b43a"][k]);
      AC(0.50,0.46, 2.30,4.30, 0.85);
      AP("metal", new T.CylinderGeometry(0.015,0.015,1.40,6), -2.46, y0+0.72, 5.60, "#8f8a7c", 0, -0.13);
      AP("paint", new T.CylinderGeometry(0.10,0.07,0.22,10), -2.32, y0+0.11, 5.60, "#c8c4b4");
      // a drain and a hose bib, the things that are always underfoot
      AP("metal", new T.CylinderGeometry(0.11,0.11,0.02,12), -0.2, y0+0.015, 4.30, "#5b5f62");
      A("metal", 0.10,0.10,0.10, 2.52, 0.30, 6.20, 0, "#8f9aa0");
      // a couple of paper cups that never made the bin
      AP("bin", new T.CylinderGeometry(0.042,0.034,0.09,10), 1.12, y0+0.045, 2.40, "#efeee6", 0.6, 0.2);
      AP("bin", new T.CylinderGeometry(0.042,0.034,0.09,10), -1.40, y0+0.045, 1.60, "#e6e2d2", 1.2, 0.5);
      lzone(xf,-2.6,2.6, 0.0,6.6, y0-0.5, y0+2.4, "ICE & VENDING", true);
      LAMPS.push({x:xf.x(-0.4,5.4), y:y0+2.30, z:xf.z(-0.4,5.4), color:0xbfe9ff,
                  intensity:0.55, dist:10, decay:1.4, indoor:true});
    }else{
      /* ---- guest laundry and the housekeeping store --------------------- */
      for(const wx of [-1.95,-1.05]){                                     // washer, dryer
        A("paint", 0.82,0.92,0.74, wx, 0.46, 6.05, 0, "#dedbd0");
        A("paint", 0.86,0.09,0.78, wx, 0.95, 6.05, 0, "#c8c4b8");
        AP("metal", new T.CylinderGeometry(0.40,0.40,0.03,4), wx, y0+0.99, 6.05, "#b6bcbe");
        AP("glass", new T.CylinderGeometry(0.20,0.20,0.05,16), wx, y0+0.52, 5.67, "#2a3a42", 0, Math.PI/2);
        A("paint", 0.62,0.16,0.05, wx, 0.82, 5.67, 0, "#b6bcbe");
        for(let k=0;k<4;k++) A("paint", 0.05,0.05,0.03, wx-0.22+k*0.15, 0.84, 5.63, 0, "#4b4f52");
        AC(0.86,0.80, wx,6.05, 1.05);
      }
      A("paint", 0.36,0.62,0.22, -1.50, 1.60, 6.52, 0, "#3f6ea8");        // soap vending box
      AP("art", boxGeo(0.26,0.34,0.02,0), -1.50, y0+1.66, 6.38, "#e6e0c4");
      // folding counter along the back-right, with linen and a basket
      A("oak", 2.20,0.86,0.56, 1.55, 0.43, 6.18, 0.6, "#7a5636");
      A("oak", 2.28,0.07,0.62, 1.55, 0.89, 6.18, 0.6, "#8a5c34");
      AP("oak", new T.CylinderGeometry(0.04,0.04,2.28,12), 1.55, y0+0.915, 5.87, "#8a5c34", 0, Math.PI/2);
      AC(2.26,0.62, 1.55,6.18, 0.95);
      for(let k=0;k<4;k++) A("paint", 0.40,0.09,0.30, 0.86, 0.97+k*0.09, 6.18, 0, k%2?"#e4e2d6":"#eceadf");
      A("paint", 0.52,0.24,0.40, 2.30, 1.05, 6.18, 0, "#b8c0c4");         // plastic basket
      AP("bin", new T.CylinderGeometry(0.05,0.05,0.16,10), 1.60, y0+1.00, 6.10, "#4a6b8a");
      // wire shelving on the right return, stacked with linen
      for(let k=0;k<3;k++){
        A("metal", 0.46,0.03,1.60, 2.42, 0.60+k*0.56, 4.20, 0, "#9aa1a6");
        for(let j=0;j<3;j++)
          A("paint", 0.36,0.22,0.40, 2.42, 0.73+k*0.56, 3.62+j*0.58, 0, ["#eceadf","#e4e2d6","#dfe6e4"][(k+j)%3]);
      }
      for(const d2 of [-0.76,0.76]) A("metal", 0.05,1.74,0.05, 2.42, 0.87, 4.20+d2, 0, "#9aa1a6");
      AC(0.52,1.70, 2.42,4.20, 1.80);
      // housekeeping cart: shelves, bottles, a bag ring
      (function cart(){
        const kx=0.60, kz=3.40;
        A("paint", 1.06,0.06,0.62, kx, 0.70, kz, 0, "#b8bcc0");
        A("paint", 1.06,0.06,0.62, kx, 0.34, kz, 0, "#b8bcc0");
        for(const c2 of [[-0.46,-0.24],[0.46,-0.24],[-0.46,0.24],[0.46,0.24]]){
          AP("metal", new T.CylinderGeometry(0.07,0.07,0.05,10), kx+c2[0], y0+0.07, kz+c2[1], "#3a3a36", 0, Math.PI/2);
          A("metal", 0.05,0.26,0.05, kx+c2[0], 0.20, kz+c2[1], 0, "#b8bcbc");
        }
        for(const c2 of [-0.46,0.46]) A("metal", 0.05,1.04,0.05, kx+c2, 0.92, kz-0.26, 0, "#b8bcbc");
        A("metal", 1.02,0.05,0.05, kx, 1.42, kz-0.26, 0, "#b8bcbc");
        for(let k=0;k<3;k++) A("paint", 0.24,0.20,0.26, kx-0.34+k*0.33, 0.83, kz+0.04, 0, ["#eceadf","#e4e2d6","#dfe6e4"][k]);
        for(const b2 of [[-0.30,"#2f5c8a"],[-0.06,"#b8332a"],[0.18,"#d8b43a"]])
          AP("paint", new T.CylinderGeometry(0.045,0.045,0.24,10), kx+b2[0], y0+0.49, kz-0.12, b2[1]);
        AP("metal", new T.TorusGeometry(0.20,0.02,6,14), kx+0.46, y0+1.18, kz+0.22, "#b8bcbc", Math.PI/2, 0);
        A("paint", 0.36,0.44,0.36, kx+0.46, 0.92, kz+0.22, 0, "#2f2f2e");
        AC(1.14,0.70, kx,kz, 1.45);
      })();
      // mop bucket, vacuum and an ironing board against the left return
      AP("paint", new T.CylinderGeometry(0.20,0.16,0.36,12), -2.28, y0+0.18, 5.30, "#d8b43a");
      AP("metal", new T.CylinderGeometry(0.015,0.015,1.30,6), -2.18, y0+0.68, 5.30, "#8f8a7c", 0, 0.10);
      AP("paint", new T.CylinderGeometry(0.09,0.06,0.20,10), -2.30, y0+1.30, 5.30, "#c8c4b4");
      AC(0.48,0.48, -2.28,5.30, 0.5);
      A("paint", 0.38,0.48,0.34, -2.32, 0.24, 4.10, 0, "#7a3a34");        // vacuum
      A("metal", 0.06,0.86,0.06, -2.32, 0.86, 4.22, 0, "#b8bcbc");
      A("paint", 0.24,0.10,0.18, -2.32, 1.28, 4.22, 0, "#7a3a34");
      AC(0.44,0.42, -2.32,4.10, 1.35);
      AP("paint", boxGeo(0.34,1.36,0.05,0), -2.46, y0+0.70, 2.90, "#dfe6e4", 0, 0.16);
      A("paint", 0.56,0.58,0.52, -2.30, 0.29, 6.30, 0, "#c8c4b8");        // linen hamper
      A("fabric",0.50,0.14,0.46, -2.30, 0.62, 6.30, 0, "#eceadf");
      AC(0.60,0.56, -2.30,6.30, 0.7);
      // a clipboard schedule and a folding chair nobody uses
      AP("art", boxGeo(0.02,0.34,0.26,0), -2.62, y0+1.52, 3.60, "#c8bd94");
      A("oak", 0.40,0.05,0.40, 1.90, 0.44, 2.20, 0.6, "#4b4f52");
      A("oak", 0.40,0.46,0.05, 1.90, 0.68, 2.40, 0.6, "#4b4f52");
      for(const d2 of [[-0.16,-0.16],[0.16,-0.16],[-0.16,0.16],[0.16,0.16]])
        A("metal", 0.04,0.44,0.04, 1.90+d2[0], 0.22, 2.20+d2[1], 0, "#8f9aa0");
      AC(0.46,0.50, 1.90,2.28, 0.9);
      lzone(xf,-2.6,2.6, 0.0,6.6, y0-0.5, y0+2.4, "GUEST LAUNDRY", true);
      LAMPS.push({x:xf.x(0.2,5.4), y:y0+2.30, z:xf.z(0.2,5.4), color:0xdff0ff,
                  intensity:0.50, dist:10, decay:1.4, indoor:true, flicker:true});
    }
    // fire extinguisher, both levels
    AP("paint", new T.CylinderGeometry(0.085,0.085,0.42,12), 2.50, y0+1.22, 2.70, "#b8302a");
    A("metal", 0.08,0.10,0.08, 2.50, 1.48, 2.70, 0, "#9aa1a6");
    return;
  }

  /* ---- a guest room --------------------------------------------------- */
  const doorX0=-2.35, doorX1=-1.40, doorTop=2.06;
  const winX0=-0.55, winX1=1.75, winY0=0.95, winY1=2.15;
  const pal=paletteFor(roomNo);
  // exterior stucco skin + interior liner, cut around the door and window
  function seg(x0,x1,ry0,ry1,collide){
    const w=x1-x0, h=ry1-ry0, cx=(x0+x1)/2, ccy=y0+(ry0+ry1)/2;
    if(w<=0.001||h<=0.001) return;
    lbx(xf,"stucco",   w,h,0.14, cx, ccy, 0.07, 0.3, SLATE);
    lbx(xf,"roomwall", w,h,0.05, cx, ccy, 0.175, 0.4, pal.wall);
    if(collide!==false) lcol(xf, w,0.22, cx,0.10, ccy-h/2, ccy+h/2);
  }
  seg(-3.00, doorX0, 0, wallH);
  seg(doorX0, doorX1, doorTop, wallH);
  seg(doorX1, winX0, 0, wallH);
  seg(winX0, winX1, 0, winY0);
  seg(winX0, winX1, winY1, wallH, false);
  seg(winX1, 3.00, 0, wallH);

  // window: teal frame, glass, drapes, and (in occupied rooms) a warm glow.
  // Every piece of the lining laps REVEAL past the opening it trims, and the
  // head, sill and jambs are each a different depth. Two faces that stop on
  // the same plane fight for the depth buffer and the frame buzzes.
  const winMX=(winX0+winX1)/2, winMY=y0+(winY0+winY1)/2, winW=winX1-winX0, winHh=winY1-winY0;
  lbx(xf,"teal", winW+0.24, 0.12, 0.22, winMX, y0+winY1+0.04, 0.06, 0, TEAL_D);   // head
  lbx(xf,"teal", winW+0.24, 0.14, 0.26, winMX, y0+winY0-0.05, 0,    0, TEAL_D);   // sill
  lbx(xf,"teal", 0.12, winHh, 0.20, winX0-0.04, winMY, 0.06, 0, TEAL_D);          // jambs
  lbx(xf,"teal", 0.12, winHh, 0.20, winX1+0.04, winMY, 0.06, 0, TEAL_D);
  lbx(xf,"teal", 0.07, winHh, 0.16, winMX,      winMY, 0.06, 0, TEAL_D);          // mullion
  push("glass", boxGeo(winX1-winX0, winY1-winY0, 0.03, 0),
       xf.x((winX0+winX1)/2, 0.09), y0+(winY0+winY1)/2, xf.z((winX0+winX1)/2, 0.09), xf.ry, "#bcd6de");
  // Two panels, not one sheet: how far apart they are is the first thing you
  // read about a room from the balcony.
  {
    const rnC=parseInt(roomNo,10)||0;
    const drawn=[1.00, 0.56, 0.84, 0.30, 1.00, 0.66][(rnC*17+5)%6];
    const halfW=(winX1-winX0)*0.51, cpw=halfW*drawn;
    for(const sd of [-1,1])
      lbx(xf,"curtain", cpw, (winY1-winY0)*0.99, 0.03,
          winMX + sd*(halfW-cpw/2), y0+(winY0+winY1)/2, 0.30, 0.6, pal.curtain);
    if(drawn<0.4)                              // and a valance across the top of the gap
      lbx(xf,"curtain", winX1-winX0, 0.16, 0.03, winMX, y0+winY1-0.10, 0.30, 0.6,
          pal.curtain);
  }
  if(lit){
    // The room behind the glass. A whole pane of it is what a lamp looks like;
    // a television is a small bright rectangle a long way back in the room,
    // off to one side, with the rest of the room only faintly lit by it —
    // 206 had the pane, and read as a blue square flashing in the window.
    push("winglow", boxGeo(winX1-winX0-0.06, winY1-winY0-0.06, 0.02, 0),
         xf.x((winX0+winX1)/2, 0.36), y0+(winY0+winY1)/2, xf.z((winX0+winX1)/2, 0.36),
         xf.ry, roomNo===206?"#39414a":"#ffcf8a");
    if(roomNo===206)
      push("tvwin", boxGeo(0.86, 0.56, 0.02, 0),
           xf.x((winX0+winX1)/2+0.30, 1.30), y0+winY0+0.56,
           xf.z((winX0+winX1)/2+0.30, 1.30), xf.ry, "#ffffff");
  }

  // through-wall air conditioner under the sill, and the rust streak it has
  // been leaving down the stucco for twenty summers
  push("rust", planeGeo(0.50,0.60,0), xf.x((winX0+winX1)/2-0.35,-0.005), y0+0.28,
       xf.z((winX0+winX1)/2-0.35,-0.005), xf.ry, "#6a4028");
  lbx(xf,"metal", 0.78,0.46,0.54, (winX0+winX1)/2-0.35, y0+0.60, -0.15, 0, "#9aa1a6");
  for(let i=0;i<5;i++)
    lbx(xf,"metal", 0.70,0.03,0.02, (winX0+winX1)/2-0.35, y0+0.46+i*0.07, -0.42, 0, "#5f676b");

  // white breeze-block privacy panel beside the window
  lbx(xf,"breeze", 0.95, 2.00, 0.10, 2.42, y0+1.10, -0.02, 0.55, "#efece2");
  lbx(xf,"paint",  1.03, 0.09, 0.14, 2.42, y0+2.14, -0.02, 0, WHITE);
  lbx(xf,"paint",  1.03, 0.09, 0.14, 2.42, y0+0.06, -0.02, 0, WHITE);
  // teal diamond accent, upper floor only (as on the reference elevation)
  if(level===1)
    push("teal", boxGeo(0.62,0.62,0.05,0), xf.x(-2.72,-0.03), y0+2.42, xf.z(-2.72,-0.03),
         xf.ry, TEAL, 0, Math.PI/4);

  // door: teal reveal, brass number plate, and the swinging leaf
  // Same rule as the window: the jambs lap 20 mm into the opening so the
  // stucco's cut edge is buried inside them, and the head is wider and
  // deeper than the jambs so no two faces of the frame share a plane.
  const jamH=doorTop+0.10;
  lbx(xf,"teal", 0.14, jamH+0.04, 0.26, doorX0-0.05, y0+jamH/2-0.02, 0.08, 0, TEAL_D);
  lbx(xf,"teal", 0.14, jamH+0.04, 0.26, doorX1+0.05, y0+jamH/2-0.02, 0.08, 0, TEAL_D);
  lbx(xf,"teal", doorX1-doorX0+0.26, 0.13, 0.30, (doorX0+doorX1)/2, y0+doorTop+0.055, 0.08, 0, TEAL_D);
  const plateM=new T.Mesh(new T.PlaneGeometry(0.19,0.19),
    new T.MeshStandardMaterial({map:plateTex(roomNo), roughness:0.42, metalness:0.4}));
  plateM.position.set(xf.x(-1.18,-0.005), y0+1.86, xf.z(-1.18,-0.005));
  plateM.rotation.y=xf.ry+Math.PI; scene.add(plateM);
  makeDoor(xf, doorX0+0.015, y0+0.02, 0.13, roomNo, true, roomNo===107?0.34:0);

  // shell: back-wall liner, side liners, floor, ceiling. The side liners are
  // thin skins over whatever the party wall or the wing cap happens to be, so
  // an end room never shows exterior stucco from the inside.
  lwall(xf,"roomwall", 5.40, wallH, 0.20, 0, cy, 6.70, 0.4, pal.wall);
  lbx(xf,"roomwall", 0.05, ROOM_H, 6.44, -2.67, y0+ROOM_H/2, 3.43, 0.4, pal.wall);
  lbx(xf,"roomwall", 0.05, ROOM_H, 4.06,  2.67, y0+ROOM_H/2, 2.31, 0.4, pal.wall);
  lbx(xf,"carpet", 5.40,0.04,6.42, 0, y0+0.02, 3.41, 0.5, pal.carpet);
  lbx(xf,"ceil", 5.44,0.08,6.46, 0, y0+ROOM_H, 3.40, 0.45, "#efe6d2");
  lflat(xf, -2.7,2.7, -0.05,6.60, y0);
  lzone(xf, -2.6,2.6, 0.30,6.55, y0-0.5, y0+2.4, "ROOM "+roomNo, true);
  ROOMS.push({no:roomNo, x:xf.x(0,3.4), z:xf.z(0,3.4), y:y0, lit:lit, level:level});
  // No two rooms are lit the same. Somebody left the overhead on and the
  // lamps off; next door it is the other way round; one along the row is dark
  // but for the bathroom fluorescent, and it is going. Occupied rooms get the
  // brighter half of the range, the empty ones the dimmer.
  const rn2=parseInt(roomNo,10)||0;
  const MOOD=[
    // [overhead, bedside lamp, bath overhead, vanity lamp, which one flickers]
    [0.58, 0.20, 0.16, 0.22, -1],   // everything on, the way housekeeping left it
    [0.00, 0.34, 0.14, 0.30, -1],   // lamps only
    [0.62, 0.00, 0.18, 0.00,  2],   // overhead only, and the bathroom stutters
    [0.00, 0.40, 0.00, 0.00, -1],   // one lamp by the bed
    [0.00, 0.00, 0.30, 0.00,  2],   // dark but for the bathroom, which is going
    [0.00, 0.11, 0.00, 0.15, -1],   // all but out
    [0.00, 0.00, 0.00, 0.00, -1],   // dark. Nobody has opened this one in months
    [0.00, 0.00, 0.09, 0.00,  2],   // and one where only the bathroom tube ticks over
  ];
  const md=MOOD[(lit ? rn2%3 : 3+(rn2%5))];
  // Point lights here cast no shadows, so a lamp in 104 was lighting 103 and
  // 105 straight through the party walls. With ninety-six room lamps on the
  // property and only seven real lights to hand out, a room with its own lamps
  // off was simply being lit by next door's — which is why every room looked
  // the same however they were set. Each lamp now only counts while you are in
  // the room it hangs in.
  const vol=lvol(xf, -2.72,2.72, 0.10,6.70, y0-0.6, y0+2.7);
  const LMP=[[0, 2.60, y0+ROOM_H-0.34, 0xffe2b4, 13, 1.15],
             [-2.30, 0.60, y0+1.72,    0xffd39a, 5.5, 1.5],
             [1.40, 5.30, y0+ROOM_H-0.34, 0xf6f0e2, 6, 1.55],   // white tile blows easily
             [2.42, 1.32, y0+1.04,     0xffd39a, 6, 1.45]];
  for(let i=0;i<4;i++){
    if(md[i]<=0) continue;
    LAMPS.push({x:xf.x(LMP[i][0],LMP[i][1]), y:LMP[i][2], z:xf.z(LMP[i][0],LMP[i][1]),
                color:LMP[i][3], intensity:md[i], dist:LMP[i][4], decay:LMP[i][5],
                indoor:true, vol:vol, flicker:(md[4]===i)});
  }

  furnishRoom(xf, y0, roomNo);
}

/* --- room interior: beds, dresser, TV, bath. Density is the point -----
   Any one prop is small; together they make the room feel occupied.     */
/* --- room palettes: no two neighbours are painted quite the same ------ */
const PALETTES=[
  {spread:"#8f5a4a", wall:"#ded3b6", carpet:"#6d5b46", curtain:"#c9ae66", head:"#5c4029"},
  {spread:"#5e7c6e", wall:"#d9d7c3", carpet:"#5e5949", curtain:"#b9a878", head:"#4e4033"},
  {spread:"#8a7440", wall:"#e2d4ba", carpet:"#6a5340", curtain:"#c2a05e", head:"#6a4a2e"},
  {spread:"#7a5a72", wall:"#d6d3c1", carpet:"#61503f", curtain:"#bfa86e", head:"#513a2c"},
  {spread:"#93624a", wall:"#e4dabd", carpet:"#71604a", curtain:"#cbb072", head:"#5c4029"},
  {spread:"#4f6f78", wall:"#dad5bd", carpet:"#5b5344", curtain:"#b9a06a", head:"#443a30"},
];
const paletteFor=no=>PALETTES[no%PALETTES.length];

/* --- one guest room --------------------------------------------------
   Single queen against the right-hand wall, dresser opposite, table under
   the window, bathroom in the back-right corner. Everything else keeps out
   of the 2.8 m lane that runs from the door to the bathroom door.        */
function furnishRoom(xf, y0, roomNo){
  const pal=paletteFor(roomNo), spread=pal.spread;
  const B=(name,w,h,d,x,y,z,uv,col)=>lbx(xf,name,w,h,d,x,y0+y,z,uv,col);
  const C=(w,d,x,z,h)=>lcol(xf,w,d,x,z,y0,y0+(h||1.2));
  const P=(bucket,geo,x,y,z,col,rx,rz)=>push(bucket, geo, xf.x(x,z), y0+y, xf.z(x,z), xf.ry, col, rx, rz);
  // a picture hung on a wall needs its own yaw, so it can face into the room
  const PY=(bucket,geo,x,y,z,yaw,col)=>push(bucket, geo, xf.x(x,z), y0+y, xf.z(x,z), xf.ry+yaw, col);
  // bullnose: a cylinder laid along a top edge, so counters and cases stop
  // ending in a knife edge
  const noseZ=(bucket,len,r,x,y,z,col)=>P(bucket, new T.CylinderGeometry(r,r,len,10), x,y,z, col, Math.PI/2, 0);
  const noseX=(bucket,len,r,x,y,z,col)=>P(bucket, new T.CylinderGeometry(r,r,len,10), x,y,z, col, 0, Math.PI/2);

  /* --- bathroom ---------------------------------------------------------
     Tub along the long right-hand wall, toilet in the near-left corner with
     its tank against the back wall, vanity between them. Everything is
     reachable from the 1.7 x 1.4 m of clear floor you step into.        */
  lwall(xf,"bath", 1.26,ROOM_H,0.12, 2.03, y0+ROOM_H/2, 4.42, 0.7, "#e6ebe7");
  lwall(xf,"bath", 0.14,ROOM_H,0.12, 0.23, y0+ROOM_H/2, 4.42, 0.7, "#e6ebe7");
  lwall(xf,"bath", 0.12,ROOM_H,2.18, 0.16, y0+ROOM_H/2, 5.51, 0.7, "#e6ebe7");
  lbx(xf,"teal", 0.10,ROOM_H,0.16, 1.40, y0+ROOM_H/2, 4.42, 0, TEAL_D);      // doorway reveal
  lbx(xf,"teal", 0.10,ROOM_H,0.16, 0.30, y0+ROOM_H/2, 4.42, 0, TEAL_D);
  lbx(xf,"teal", 1.20,0.10,0.16, 0.85, y0+2.10, 4.42, 0, TEAL_D);
  B("bath", 2.54,0.04,2.18, 1.43, 0.03, 5.51, 0.9, "#dfe4e0");               // tiled floor
  B("bath", 0.10,ROOM_H,2.18, 2.66, ROOM_H/2, 5.51, 0.7, "#e6ebe7");
  B("bath", 2.54,ROOM_H,0.10, 1.43, ROOM_H/2, 6.56, 0.7, "#e6ebe7");

  // tub down the right-hand wall, with the shower over it
  const tubX=2.26, tubZ=5.47;
  B("bath", 0.80,0.50,1.70, tubX, 0.25, tubZ, 0.8, "#eef0ec");
  B("bath", 0.66,0.10,1.54, tubX, 0.48, tubZ, 0.8, "#dbe2df");
  noseZ("bath", 1.70, 0.05, 1.87, 0.50, tubZ, "#eef0ec");                    // rolled rim
  noseZ("bath", 1.70, 0.05, 2.65, 0.50, tubZ, "#eef0ec");
  B("metal",0.04,0.04,1.74, tubX, 1.90, tubZ, 0, "#b9bdbd");                 // curtain rail
  B("paint",0.04,1.36,1.30, 1.89, 1.20, 5.70, 0, "#dfe9e6");                 // curtain, half drawn
  B("metal",0.20,0.05,0.05, 2.56, 1.74, 4.78, 0, "#c9cdcd");                 // shower arm
  P("bin", new T.CylinderGeometry(0.07,0.05,0.06,10), 2.42, 1.70, 4.78, "#c9cdcd", 0, 0.6);
  B("metal",0.10,0.16,0.05, 2.58, 1.06, 4.72, 0, "#c9cdcd");                 // taps and spout
  B("metal",0.06,0.06,0.16, 2.52, 0.68, 4.72, 0, "#c9cdcd");
  C(0.86,1.78, tubX,tubZ, 0.58);

  // toilet: pedestal, bowl, rim, seat, tank and lid — not a box on a box
  const toX=0.60, toZ=6.02;
  B("paint",0.22,0.34,0.26, toX, 0.17, toZ+0.16, 0, "#f4f6f3");              // pedestal
  P("paint", new T.CylinderGeometry(0.205,0.15,0.26,18), toX, 0.46, toZ, "#f4f6f3");
  P("paint", new T.TorusGeometry(0.195,0.035,8,20), toX, 0.585, toZ, "#f4f6f3", Math.PI/2, 0);
  P("paint", new T.TorusGeometry(0.20,0.028,8,20), toX, 0.625, toZ, "#eceadf", Math.PI/2, 0);  // seat
  P("paint", boxGeo(0.38,0.04,0.34,0), toX, 0.86, toZ+0.32, "#eceadf", -0.30);                // lid, up
  B("paint",0.46,0.42,0.20, toX, 0.63, toZ+0.44, 0, "#f4f6f3");              // cistern
  B("paint",0.50,0.05,0.25, toX, 0.865, toZ+0.44, 0, "#f6f7f4");
  B("metal",0.08,0.04,0.05, toX-0.20, 0.78, toZ+0.36, 0, "#caa23c");         // flush lever
  C(0.56,0.74, toX,toZ+0.14, 0.72);
  P("bin", new T.CylinderGeometry(0.055,0.055,0.11,10), 0.22, 0.72, 5.66, "#f0eee6", 0, Math.PI/2);

  // vanity on the back wall between the toilet and the tub
  const vaX=1.38, vaZ=6.30;
  B("oak",  0.84,0.74,0.44, vaX, 0.37, vaZ, 0.6, "#7a5636");
  B("paint",0.90,0.08,0.50, vaX, 0.78, vaZ, 0, "#efeee7");
  noseX("paint", 0.90, 0.045, vaX, 0.78, 6.06, "#efeee7");
  B("paint",0.36,0.09,0.28, vaX, 0.84, vaZ, 0, "#f6f7f4");
  B("metal",0.10,0.15,0.04, vaX, 0.92, vaZ+0.14, 0, "#c9cdcd");
  P("mirror", boxGeo(0.80,0.66,0.03,0), vaX, 1.42, 6.485, "#c2d2d8");
  P("lampshade", boxGeo(0.72,0.06,0.10,0), vaX, 1.84, 6.465, "#f2e9d2");     // strip light
  C(0.90,0.50, vaX,vaZ, 0.82);
  // towels, mat, soap
  B("metal",0.03,0.03,0.46, 0.22, 1.22, 4.94, 0, "#c9cdcd");
  B("paint",0.06,0.34,0.42, 0.27, 1.06, 4.94, 0, "#e8e4d6");
  B("paint",0.30,0.09,0.24, 1.90, 0.87, 6.30, 0, "#eceadf");
  B("paint",0.30,0.09,0.24, 1.90, 0.96, 6.30, 0, "#e4e2d6");
  B("paint",0.68,0.03,0.46, 1.20, 0.05, 5.44, 0, "#c8bda4");                 // bath mat
  B("paint",0.09,0.04,0.06, vaX+0.32, 0.83, vaZ-0.06, 0, "#e6d9a8");
  lzone(xf, 0.20,2.66, 4.50,6.55, y0-0.5, y0+2.4, "ROOM "+roomNo+" · BATH", true);

  /* --- one queen, headboard against the right-hand wall ---------------- */
  const bz=2.50;
  const pillow=(function(){ const g=new T.SphereGeometry(0.30,12,8); g.scale(0.95,0.40,1.50); return g; })();
  B("oak",  0.10,0.98,1.66, 2.62, 0.52, bz, 0.7, pal.head);                  // headboard
  B("oak",  0.10,0.18,1.78, 2.60, 1.07, bz, 0.7, pal.head);                  // headboard cap
  noseZ("oak", 1.78, 0.05, 2.60, 1.14, bz, pal.head);
  B("spread",2.02,0.20,1.58, 1.62, 0.19, bz, 0.42, "#3b3128");               // valance
  B("oak",  1.96,0.24,1.50, 1.62, 0.38, bz, 0.6, "#4c3b2a");                 // base
  /* Six palettes was variety in the furniture. This is variety in the person:
     whether the bed got made, how far the curtain got drawn, where the towels
     ended up, whether the chair got pushed back in.                        */
  const rnR=parseInt(roomNo,10)||0, hab=(rnR*31+7)%6;
  B(hab===3?"bedding":"spread", 2.00,0.30,1.54, 1.62, 0.62, bz, 0.42,
    hab===3?"#ddd6c4":spread);                                                // mattress/spread
  noseZ(hab===3?"bedding":"spread", 1.54, 0.075, 0.62, 0.72, bz,
        hab===3?"#ddd6c4":spread);                                            // rolled front edge
  if(hab!==3) B("spread",0.62,0.10,1.56, 0.92, 0.81, bz, 0.5, "#6d5f4a");     // folded blanket
  switch(hab){
    case 1:                                    // the near side turned back and left
      P("bedding", boxGeo(0.88,0.06,0.68,0.4), 1.28, 0.795, bz-0.40, "#efeadb", 0, -0.09);
      P("bedding", boxGeo(0.46,0.06,0.60,0.4), 1.88, 0.825, bz-0.42, "#efeadb", 0,  0.15);
      break;
    case 2:                                    // slept in, spread shoved down to the foot
      P("spread", boxGeo(0.54,0.17,1.48,0.42), 0.88, 0.845, bz, spread, 0, 0.12);
      P("bedding", boxGeo(1.06,0.05,1.28,0.4), 1.72, 0.785, bz, "#efeadb", 0, -0.03);
      break;
    case 3:                                    // stripped: bare ticking and a heap of linen
      for(let k=0;k<5;k++)
        P("bedding", boxGeo(0.30-k*0.03, 0.10, 0.34-k*0.03, 0.4),
          0.94+((k*7)%3)*0.07, 0.80+k*0.055, bz-0.30+((k*5)%4)*0.19, "#eceadf",
          ((k*3)%5-2)*0.16, ((k*7)%5-2)*0.14);
      break;
    case 4:                                    // a coat thrown down and never picked up
      P("fabric", boxGeo(0.70,0.09,0.52,0.5), 1.22, 0.805, bz+0.26, "#4a4438", 0.35, 0.05);
      P("fabric", boxGeo(0.24,0.07,0.32,0.5), 1.58, 0.800, bz+0.46, "#4a4438", 0.9, 0.12);
      break;
  }
  if(hab===5){                                 // one of them ended up on the floor
    P("bedding", pillow, 2.28, 0.84, bz+0.38, "#efeadb");
    P("bedding", pillow, 0.66, 0.10, bz-0.94, "#efeadb", 0.30, 0.12);
  }else if(hab!==3){
    P("bedding", pillow, 2.28, 0.84, bz-0.38, "#efeadb");
    P("bedding", pillow, 2.28, 0.84, bz+0.38, "#efeadb");
    if(hab===2) P("bedding", pillow, 2.14, 0.905, bz-0.30, "#e8e2d2", 0.18, 0.22);
  }else{
    P("bedding", pillow, 2.30, 0.845, bz+0.02, "#d8d2c0", 0, 0.06);           // the bare one
  }
  C(2.10,1.66, 1.62,bz, 0.74);
  // you can lie on it. Local -x is the foot of the bed, so that is where you
  // are looking; getting up fans out from there, and the first candidate that
  // clears the bed's own collider is a metre and a half off.
  addSeat(xf.x(1.46,bz), xf.z(1.46,bz), y0+0.77, Math.PI/2+xf.ry, "THE BED", true);
  P("oak", boxGeo(0.035,0.56,1.04,0), 2.646, 1.92, bz, pal.head);            // print over the bed
  PY("pic:artWide", planeGeo(0.96,0.48,0), 2.624, 1.92, bz, -Math.PI/2, "#ffffff");

  /* --- nightstands either side of the head ----------------------------- */
  for(const ns of [[1.32,"lamp"],[3.68,"phone"]]){
    const nz=ns[0];
    B("oak", 0.50,0.54,0.48, 2.42, 0.27, nz, 0.7, pal.head);
    B("oak", 0.56,0.05,0.54, 2.42, 0.56, nz, 0.7, pal.head);
    noseZ("oak", 0.54, 0.035, 2.16, 0.56, nz, pal.head);
    C(0.52,0.52, 2.42,nz, 0.60);
    if(ns[1]==="lamp"){
      B("metal",0.10,0.30,0.10, 2.42, 0.73, nz, 0, "#b8a67e");
      P("lampshade", new T.CylinderGeometry(0.15,0.20,0.24,12), 2.42, 1.00, nz, "#e8dcc0");
      B("paint",0.15,0.08,0.09, 2.24, 0.63, nz-0.14, 0, "#232323");          // clock radio
      P("clockled", boxGeo(0.06,0.03,0.01,0), 2.18, 0.64, nz-0.14, "#ff5a2a");
    }else{
      B("paint",0.16,0.05,0.24, 2.42, 0.61, nz, 0, "#2b2b2b");               // telephone
      B("paint",0.09,0.03,0.05, 2.30, 0.64, nz, 0, "#c9c4b4");
      B("paint",0.13,0.04,0.18, 2.42, 0.61, nz+0.18, 0, "#5a2320");          // Gideon bible
    }
  }
  // headboard reading light
  B("metal",0.05,0.05,0.26, 2.62, 1.44, bz-0.62, 0, "#9a9a94");
  P("lampshade", new T.CylinderGeometry(0.09,0.13,0.14,10), 2.50, 1.42, bz-0.62, "#e8dcc0");

  /* --- dresser wall, opposite the bed ---------------------------------- */
  B("oak", 0.44,0.78,1.94, -2.48, 0.39, 2.60, 0.6, "#6f4a2c");
  for(let k=0;k<3;k++) B("oak", 0.05,0.20,1.74, -2.27, 0.24+k*0.24, 2.60, 0, "#4d3520");
  B("oak", 0.50,0.06,2.00, -2.48, 0.81, 2.60, 0.6, "#7a5636");
  noseZ("oak", 2.00, 0.04, -2.25, 0.81, 2.60, "#7a5636");
  C(0.50,1.98, -2.48,2.60, 0.86);
  B("paint",0.44,0.42,0.58, -2.44, 1.05, 2.10, 0, "#2f2f2e");                // television
  B("paint",0.03,0.38,0.52, -2.215, 1.06, 2.10, 0, "#191919");               // bezel
  PY("pic:tv:"+(roomNo%4), planeGeo(0.44,0.33,0), -2.196, 1.06, 2.10, Math.PI/2, "#ffffff");
  B("metal",0.03,0.28,0.03, -2.46, 1.38, 2.32, 0, "#9a9a94");
  B("paint",0.20,0.24,0.24, -2.46, 0.96, 3.30, 0, "#2b2b2b");                // coffee maker
  B("paint",0.14,0.09,0.18, -2.42, 0.88, 3.30, 0, "#c9c4b4");
  P("bin", new T.CylinderGeometry(0.09,0.078,0.18,12), -2.48, 0.93, 3.62, "#d5d1c4");  // ice bucket
  for(const t of [-0.09,0.09])
    P("glass", new T.CylinderGeometry(0.040,0.034,0.10,10), -2.44, 0.89, 3.86+t, "#cfe0e6");
  // fridge and microwave stacked at the back of the dresser wall
  B("paint", 0.44,0.72,0.54, -2.48, 0.36, 4.30, 0, "#d8d4c8");
  B("metal", 0.03,0.58,0.05, -2.25, 0.36, 4.06, 0, "#9a9a94");
  B("paint", 0.40,0.30,0.60, -2.48, 0.87, 4.30, 0, "#2f2f2e");
  P("tvglass", boxGeo(0.03,0.16,0.34,0), -2.27, 0.88, 4.30, "#1d262b");
  C(0.48,0.66, -2.48,4.30, 1.05);
  // the mirror by the door: hung ON the wall, not IN it
  P("oak",    boxGeo(0.035,0.70,0.54,0), -2.640, 1.62, 0.90, "#5c4029");
  P("mirror", boxGeo(0.030,0.62,0.46,0), -2.616, 1.62, 0.90, "#c2d2d8");

  /* --- table and two chairs under the window --------------------------- */
  P("oak", new T.CylinderGeometry(0.42,0.42,0.05,18), 0.60, 0.72, 0.92, "#6f4a2c");
  P("oak", new T.TorusGeometry(0.42,0.032,6,20), 0.60, 0.72, 0.92, "#6f4a2c", Math.PI/2, 0);
  P("oak", new T.CylinderGeometry(0.06,0.09,0.70,10), 0.60, 0.36, 0.92, "#5c4029");
  P("oak", new T.CylinderGeometry(0.24,0.26,0.04,14), 0.60, 0.03, 0.92, "#5c4029");
  C(0.86,0.86, 0.60,0.92, 0.76);
  for(const cx2 of [-0.42, 1.62]){
    // one chair in most rooms got pulled out and turned, and stayed that way
    const outs=(hab+ (cx2<0?0:3))%6;
    const dz=(outs===1||outs===4) ? (outs===1?0.52:-0.44) : 0;
    const dx=(outs===1||outs===4) ? (cx2<0?-0.18:0.22) : 0;
    const cz2=0.92+dz, cxx=cx2+dx;
    addSeat(xf.x(cxx,cz2), xf.z(cxx,cz2), y0+0.50, xf.ry+(cx2<0?-1.15:1.15), "THE CHAIR");
    B("oak", 0.46,0.06,0.46, cxx, 0.44, cz2, 0.7, "#6f4a2c");
    B("spread",0.42,0.10,0.42, cxx, 0.51, cz2, 0.5, spread);
    for(const d of [[-0.18,-0.18],[0.18,-0.18],[-0.18,0.18],[0.18,0.18]])
      B("oak", 0.05,0.44,0.05, cxx+d[0], 0.22, cz2+d[1], 0, "#5c4029");
    B("oak", 0.05,0.46,0.44, cxx+(cx2<0?-0.20:0.20), 0.70, cz2, 0.7, "#6f4a2c");
    if(outs===2)                               // a towel left over the back of this one
      P("bedding", boxGeo(0.10,0.34,0.40,0.4), cxx+(cx2<0?-0.22:0.22), 0.78, cz2,
        "#eceadf", 0, 0.04);
    C(0.56,0.56, cxx,cz2, 0.86);
  }
  // and what else got left out on the floor of this one
  switch(hab){
    case 0: break;                             // housekeeping has been in
    case 1: P("bedding", boxGeo(0.44,0.05,0.36,0.4), -0.90, 0.028, 2.90, "#eceadf", 0, 0.10);
            break;                             // a towel, dropped where it was used
    case 2: P("bin", new T.CylinderGeometry(0.11,0.09,0.20,12), -1.60, 0.10, 4.90, "#d5d1c4");
            P("paper", planeGeo(0.16,0.20,0), -1.34, 0.008, 4.72, "#ded6c0", -Math.PI/2, 0);
            break;                             // the bin, pulled out and not put back
    case 3: for(let k=0;k<3;k++)               // the linen cart came and went
              P("bedding", boxGeo(0.34,0.07,0.28,0.4), -0.40+k*0.10, 0.04+k*0.07, 5.10,
                "#e4e2d6", 0, (k-1)*0.10);
            break;
    case 4: P("oak", boxGeo(0.34,0.09,0.24,0.5), 0.10, 0.05, 3.90, "#3f2f22", 0, 0.06);
            P("oak", boxGeo(0.30,0.08,0.22,0.5), 0.14, 0.05, 4.22, "#3f2f22", 0, -0.12);
            break;                             // shoes, kicked off and left
    default:P("art", boxGeo(0.30,0.012,0.22,0), -0.86, 0.012, 3.40, "#c9a24b", 0, 0.14);
            P("art", boxGeo(0.28,0.012,0.21,0), -0.70, 0.012, 3.72, "#3f6ea8", 0, -0.20);
            break;                             // a paper and a magazine on the carpet
  }

  /* --- back wall: luggage rack, bin, boots ----------------------------- */
  B("oak", 0.42,0.06,0.68, -2.30, 0.48, 5.50, 0.7, "#5c4029");
  B("metal",0.05,0.48,0.05, -2.30, 0.24, 5.22, 0, "#8f8a7c");
  B("metal",0.05,0.48,0.05, -2.30, 0.24, 5.78, 0, "#8f8a7c");
  P("bin", new T.CylinderGeometry(0.13,0.11,0.30,12), -2.34, 0.15, 6.24, "#4a4a46");

  /* --- trim, fittings and the ceiling ---------------------------------- */
  B("oak", 5.36,0.14,0.06,  0.00, 0.07, 0.24, 0.6, "#5a4832");               // baseboard
  B("oak", 5.36,0.14,0.06,  0.00, 0.07, 6.56, 0.6, "#5a4832");
  B("oak", 0.06,0.14,6.30, -2.64, 0.07, 3.40, 0.6, "#5a4832");
  B("oak", 0.06,0.14,4.10,  2.64, 0.07, 2.30, 0.6, "#5a4832");
  B("roomwall", 5.36,0.10,0.08, 0, ROOM_H-0.09, 0.26, 0.5, pal.wall);        // cove
  B("roomwall", 0.08,0.10,6.30, -2.64, ROOM_H-0.09, 3.40, 0.5, pal.wall);
  B("roomwall", 0.08,0.10,4.10,  2.64, ROOM_H-0.09, 2.30, 0.5, pal.wall);
  B("oak", 2.60,0.20,0.10, 0.60, 2.30, 0.24, 0.6, "#5c4029");                // curtain valance
  B("metal",2.46,0.04,0.04, 0.60, 2.16, 0.30, 0, "#9a9a94");
  B("paint", 0.14,0.20,0.03, -2.66, 1.42, 1.30, 0, "#e2ded0");               // thermostat
  B("paint", 0.10,0.14,0.03, -2.66, 1.20, 0.70, 0, "#e2ded0");               // switch
  P("art", boxGeo(0.02,0.22,0.16,0), -2.632, 1.46, 1.90, "#d8cfae");         // rate card
  B("metal", 0.03,0.05,0.16, -2.30, 1.32, 0.24, 0, "#caa23c");               // door chain
  B("metal", 0.03,0.03,0.24, -2.30, 1.52, 0.24, 0, "#caa23c");
  P("ceilfix", new T.CylinderGeometry(0.22,0.26,0.10,14), 0.0, ROOM_H-0.09, 2.60, "#e8dcc0");
  P("ceilfix", new T.CylinderGeometry(0.15,0.19,0.09,12), 1.40, ROOM_H-0.08, 5.30, "#e8dcc0");
  lbx(xf,"roomwall", 5.30,0.10,0.10, 0, y0+ROOM_H-0.05, 3.40, 0.5, pal.wall);

  /* --- the soft things that stop a room reading as a showroom ---------- */
  B("fabric", 1.70,0.03,1.10, 0.55, 0.05, bz, 0, "#7a5a4e");                 // rug beside the bed
  B("fabric", 1.42,0.015,0.86, 0.55, 0.062, bz, 0, "#a98a6e");
  B("fabric", 0.80,0.03,0.52, -1.88, 0.05, 0.46, 0, "#4a4238");              // mat inside the door
  B("spread", 0.50,0.10,0.46, -0.42, 0.60, 0.92, 0.5, spread);               // throw over a chair
  P("oak", boxGeo(0.035,0.44,0.64,0), -2.646, 1.86, 4.20, "#5c4029");        // second print
  PY("pic:artLand:room", planeGeo(0.57,0.38,0), -2.624, 1.86, 4.20, Math.PI/2, "#ffffff");
  P("gravel", new T.CylinderGeometry(0.11,0.085,0.18,12), -2.44, 0.99, 1.66, "#a35a34");
  for(const b3 of [[0,0.24,0.15],[-0.10,0.16,0.11],[0.09,0.19,0.10]])        // a plant, half alive
    P("foliage", new T.IcosahedronGeometry(b3[2],1), -2.44+b3[0], 1.10+b3[1], 1.66+b3[0]*0.6, "#57713f");
  // a sconce by the door, the kind with a pleated shade
  B("metal", 0.06,0.06,0.20, -2.62, 1.72, 0.60, 0, "#9a9a94");
  P("lampshade", new T.CylinderGeometry(0.11,0.16,0.18,12), -2.46, 1.72, 0.60, "#e8dcc0");

  /* --- what the last guest left behind --------------------------------- */
  const pick3=[(roomNo*7)%8, (roomNo*13+3)%8, (roomNo*5+6)%8];
  for(let k=0;k<3;k++){
    switch(pick3[k]){
      case 0:  // ashtray with a cigarette still going
        P("glass", new T.CylinderGeometry(0.085,0.065,0.035,12), 2.42, 0.60, 1.32, "#cfe0e6");
        P("paint", new T.CylinderGeometry(0.011,0.011,0.10,8), 2.40, 0.63, 1.30, "#efeade", 0, Math.PI/2);
        P("ember", boxGeo(0.020,0.018,0.018,0), 2.335, 0.63, 1.30, "#ff5a1e");
        push("smoke", planeGeo(0.10,0.62,0), xf.x(2.34,1.30), y0+0.95, xf.z(2.34,1.30), xf.ry, "#c8c4bc");
        push("smoke", planeGeo(0.10,0.62,0), xf.x(2.34,1.30), y0+0.95, xf.z(2.34,1.30), xf.ry+Math.PI/2, "#c8c4bc");
        break;
      case 1:  // magazines fanned on the table
        P("art", boxGeo(0.28,0.012,0.21,0), 0.52, 0.755, 0.86, "#c9a24b", 0, 0);
        P("art", boxGeo(0.27,0.012,0.20,0), 0.70, 0.767, 0.99, "#3f6ea8", 0, 0);
        P("art", boxGeo(0.26,0.012,0.19,0), 0.58, 0.779, 1.05, "#c3562f", 0, 0);
        break;
      case 2:  // an open suitcase on the rack
        B("oak", 0.40,0.18,0.62, -2.30, 0.60, 5.50, 0.6, "#4a3524");
        B("oak", 0.38,0.03,0.60, -2.30, 0.70, 5.50, 0.6, "#6a4b30");
        P("fabric", boxGeo(0.36,0.10,0.56,0), -2.30, 0.75, 5.50, "#d8d2c0");
        break;
      case 3:  // boots and a newspaper on the floor
        B("oak", 0.16,0.22,0.13, 0.30, 0.11, 3.60, 0.6, "#4a3524");
        B("oak", 0.16,0.22,0.13, 0.30, 0.11, 3.86, 0.6, "#4a3524");
        P("art", boxGeo(0.34,0.01,0.26,0), -0.60, 0.045, 4.20, "#d8d2bc", 0, 0.12);
        break;
      case 4:  // room-service tray and a bottle
        B("metal",0.34,0.02,0.28, -0.20, 0.755, 0.92, 0, "#b8bcbc");
        P("glass", new T.CylinderGeometry(0.035,0.035,0.24,10), -0.24, 0.88, 0.86, "#4a6b3a");
        P("glass", new T.CylinderGeometry(0.040,0.034,0.09,10), -0.12, 0.80, 0.98, "#cfe0e6");
        break;
      case 5:  // a hat left on the dresser
        P("fabric", new T.CylinderGeometry(0.11,0.13,0.11,14), -2.46, 0.89, 1.60, "#6a5236");
        P("fabric", new T.CylinderGeometry(0.20,0.20,0.02,16), -2.46, 0.845, 1.60, "#6a5236");
        break;
      case 6:  // guitar case against the wall
        P("oak", boxGeo(0.14,1.00,0.42,0.6), -1.20, 0.52, 6.42, "#3f2f22", 0, 0.10);
        P("metal", boxGeo(0.02,0.06,0.10,0), -1.13, 0.62, 6.36, "#c9c4b4");
        break;
      default: // a stack of towels and a coffee cup left on the dresser
        B("paint",0.28,0.08,0.24, -2.46, 0.88, 1.70, 0, "#eceadf");
        B("paint",0.28,0.08,0.24, -2.46, 0.96, 1.70, 0, "#e4e2d6");
        P("bin", new T.CylinderGeometry(0.04,0.033,0.08,10), -2.44, 0.88, 2.02, "#e8e4d6");
        break;
    }
  }
}

/* --- a whole wing: bays, walkway, balcony, railings, roof, stairs ----- */
function buildWing(cfg){
  const n=cfg.bays, halfLen=n*BAY_W/2, wLen=n*BAY_W+0.6;
  const yTop=lvlY(1)+WALL_H1;
  // The roof profile, hoisted: the gable at each end is cut from these, not
  // guessed at. It used to be a fixed isoceles triangle apexed at z 3.40 with
  // no roofLift in it, while the roof ridges at z 3.10 and sits 0.26–0.30 m
  // proud of the wall head — so the gable fell away from the slabs toward
  // both eaves and left a long wedge of daylight at each end of each wing.
  const lift=cfg.roofLift||0;
  const ridgeZ=3.10, ridgeY=yTop+1.16+lift;
  const frontEaveZ=-WALK_D-0.55, backEaveZ=7.55;
  // height of the slab centreline above the wall head, at a given local z
  const roofAt=(z)=> z<=ridgeZ
      ? 0.26+lift + (z-frontEaveZ)/(ridgeZ-frontEaveZ)*0.90
      : 1.16+lift - (z-ridgeZ)/(backEaveZ-ridgeZ)*0.86;
  const wxf=cfg.frame(0);                      // wing frame: origin at facade centre

  // ---- bays -----------------------------------------------------------
  for(let level=0; level<2; level++){
    let r=0;
    for(let i=0;i<n;i++){
      const xf=cfg.frame(-halfLen+i*BAY_W+BAY_W/2);
      if(i===cfg.stairBay){ buildBay(xf, level, "alcove", 0, false); continue; }
      const no=cfg.first+level*100+r;
      buildBay(xf, level, "room", no, cfg.lit.indexOf(no)>=0);
      r++;
    }
  }

  // ---- wing caps, gables, rear facade ---------------------------------
  for(const s of [-1,1]){
    const ex=s*halfLen;
    lwall(wxf,"stucco", 0.30, FLOOR_H+WALL_H1, 6.80, ex, BASE+(FLOOR_H+WALL_H1)/2, 3.40, 0.3, SLATE);
    // the shape is laid out in (3.40 - localZ, height above the wall head);
    // 29 cm thick, so its cheeks sit just inboard of the 30 cm end wall and
    // nothing ends up coplanar with it
    const gz0=-0.15, gz1=6.95;
    const sh=new T.Shape();
    sh.moveTo(3.40-gz1, -0.08);
    sh.lineTo(3.40-gz0, -0.08);
    sh.lineTo(3.40-gz0, roofAt(gz0));
    sh.lineTo(3.40-ridgeZ, 1.16+lift);
    sh.lineTo(3.40-gz1, roofAt(gz1));
    sh.lineTo(3.40-gz1, -0.08);
    const gg=new T.ExtrudeGeometry(sh,{depth:0.29,bevelEnabled:false});
    gg.translate(0,0,-0.145);
    push("stucco", gg, wxf.x(ex,3.40), yTop, wxf.z(ex,3.40), wxf.ry+Math.PI/2, SLATE);
  }
  lbx(wxf,"stucco", wLen, FLOOR_H+WALL_H1, 0.18, 0, BASE+(FLOOR_H+WALL_H1)/2, 6.89, 0.3, SLATE);
  lcol(wxf, wLen, 0.18, 0, 6.89, BASE, yTop);

  // ---- ground walkway + upper balcony deck ----------------------------
  // deckA/deckB trim the slab where the two wings meet, so the decks butt
  // together at the inside corner instead of overlapping and z-fighting
  const dA=(cfg.deckA!==undefined?cfg.deckA:-wLen/2), dB=(cfg.deckB!==undefined?cfg.deckB:wLen/2);
  const dLen=dB-dA, dMid=(dA+dB)/2, drop=cfg.deckDrop||0;
  lbx(wxf,"concrete", dLen, 0.30, WALK_D, dMid, BASE-0.15-drop, -WALK_D/2, 0.45, "#b6afa0");
  lflat(wxf, dA, dB, -WALK_D, 0.02, BASE);
  lbx(wxf,"concrete", dLen, 0.26, WALK_D+0.16, dMid, lvlY(1)-0.13-drop, -WALK_D/2+0.08, 0.45, "#aca596");
  lflat(wxf, dA, dB, -WALK_D, 0.02, lvlY(1));
  lzone(wxf, dA, dB, -WALK_D, 0.0, BASE-0.4,   BASE+2.4,   cfg.name+" WALKWAY");
  lzone(wxf, dA, dB, -WALK_D, 0.0, lvlY(1)-0.4, lvlY(1)+2.4, cfg.name+" BALCONY");

  // ---- teal columns + fascia beams ------------------------------------
  const colLines=[];
  for(let i=0;i<=n;i++){ const lx=-halfLen+i*BAY_W; if(lx>dA-0.02 && lx<dB+0.02) colLines.push(lx); }
  if(colLines.length && colLines[0]-dA>0.6) colLines.unshift(dA+0.12);
  if(colLines.length && dB-colLines[colLines.length-1]>0.6) colLines.push(dB-0.12);
  for(const lx of colLines){
    lbx(wxf,"teal", 0.20,FLOOR_H-0.30,0.20, lx, BASE+(FLOOR_H-0.30)/2, -WALK_D+0.24, 0, TEAL);
    lcol(wxf, 0.26,0.26, lx, -WALK_D+0.24, BASE, lvlY(1));
    lbx(wxf,"teal", 0.20,WALL_H1-0.16,0.20, lx, lvlY(1)+(WALL_H1-0.16)/2, -WALK_D+0.24, 0, TEAL);
    lcol(wxf, 0.26,0.26, lx, -WALK_D+0.24, lvlY(1), yTop);
  }
  // rolled edge on the walkway and balcony slabs
  push("concrete", new T.CylinderGeometry(0.075,0.075,dLen,10),
       wxf.x(dMid,-WALK_D), BASE-0.095-drop, wxf.z(dMid,-WALK_D), wxf.ry, "#b6afa0", 0, Math.PI/2);
  push("concrete", new T.CylinderGeometry(0.065,0.065,dLen,10),
       wxf.x(dMid,-WALK_D-0.08), lvlY(1)-0.085-drop, wxf.z(dMid,-WALK_D-0.08), wxf.ry, "#aca596", 0, Math.PI/2);
  // a worn path down the middle of the walkway, and damp blooms on the soffit
  push("soot", planeGeo(dLen-1.0, 1.30, 0), wxf.x(dMid,-WALK_D*0.55), BASE+0.012,
       wxf.z(dMid,-WALK_D*0.55), wxf.ry, "#3a3228", -Math.PI/2, 0);
  push("soot", planeGeo(dLen-1.0, 1.30, 0), wxf.x(dMid,-WALK_D*0.55), lvlY(1)+0.012,
       wxf.z(dMid,-WALK_D*0.55), wxf.ry, "#3a3228", -Math.PI/2, 0);
  for(let i=0;i<n;i+=2){
    const px=-halfLen+i*BAY_W+BAY_W*0.6;
    push("soot", planeGeo(1.5,1.2,0), wxf.x(px,-WALK_D*0.45), lvlY(1)-0.28,
         wxf.z(px,-WALK_D*0.45), wxf.ry, "#4a4236", Math.PI/2, 0);
  }

  /* ---- the small evidence that this is a corridor and not a diagram ----
     Concrete this long is poured in bays with a joint between them, and the
     joint is the first thing that tells your eye how far the walkway runs.
     Then: the dirt line that collects along the foot of any wall nobody
     hoses down, and the arc each door has scrubbed across the slab.      */
  const decJ=(y,dz)=>{
    for(let i=0;i<=n;i++){
      const jx=-halfLen+i*BAY_W;
      if(jx<dA+0.15 || jx>dB-0.15) continue;
      lbx(wxf,"concrete", 0.035, 0.03, WALK_D-0.06, jx, y+0.005, -WALK_D/2+dz, 0, "#6b6459");
    }
    // and a long joint running the length of the slab, a third of the way out
    lbx(wxf,"concrete", dLen-0.3, 0.03, 0.035, dMid, y+0.005, -WALK_D*0.36+dz, 0, "#6b6459");
  };
  decJ(BASE, 0); decJ(lvlY(1), 0.08);
  for(let i=0;i<Math.ceil(dLen/1.6);i++){
    const gx=dA+0.4+i*1.6; if(gx>dB-0.3) break;
    push("soot", planeGeo(1.9,0.56,0), wxf.x(gx,0.02), BASE+0.19, wxf.z(gx,0.02), wxf.ry, "#3a3228");
    push("soot", planeGeo(1.9,0.56,0), wxf.x(gx,0.02), lvlY(1)+0.19, wxf.z(gx,0.02), wxf.ry, "#3a3228");
  }
  for(let i=0;i<n;i++){
    const sx2=-halfLen+i*BAY_W+BAY_W/2-1.88;      // in front of each door leaf
    if(sx2<dA+0.4 || sx2>dB-0.4) continue;
    push("soot", planeGeo(1.35,1.15,0), wxf.x(sx2,-0.72), BASE+0.014,
         wxf.z(sx2,-0.72), wxf.ry, "#2e281f", -Math.PI/2, 0);
    push("soot", planeGeo(1.35,1.15,0), wxf.x(sx2,-0.72), lvlY(1)+0.014,
         wxf.z(sx2,-0.72), wxf.ry, "#2e281f", -Math.PI/2, 0);
  }
  // conduit clipped along the soffit, with one drop that never got finished
  lbx(wxf,"metal", dLen-0.6, 0.05, 0.05, dMid, lvlY(1)-0.34, -0.42, 0, "#8f9aa0");
  lbx(wxf,"metal", dLen-0.6, 0.05, 0.05, dMid, yTop-0.46,    -0.42, 0, "#8f9aa0");
  for(let i=1;i<n;i+=3){
    const cx2=-halfLen+i*BAY_W;
    if(cx2<dA+0.5 || cx2>dB-0.5) continue;
    lbx(wxf,"metal", 0.05,0.34,0.05, cx2, lvlY(1)-0.52, -0.42, 0, "#8f9aa0");
    lbx(wxf,"paint", 0.14,0.18,0.10, cx2, lvlY(1)-0.74, -0.42, 0, "#6b6f72");
  }
  lbx(wxf,"teal", dLen,0.30,0.34, dMid, lvlY(1)-0.04-drop, -WALK_D+0.24, 0, TEAL_D);
  lbx(wxf,"teal", dLen,0.26,0.34, dMid, yTop-0.14,         -WALK_D+0.24, 0, TEAL_D);

  // ---- balcony railing, X-braced like the reference elevation ---------
  // Rails run, posts punctuate. The first version emitted a top rail, a mid
  // rail and a kick per BAY_W/4 panel, each 0.16 short of its own panel, with
  // a 0.09 post covering the middle of the joint — which left 35 mm of daylight
  // either side of every post and read, down the length of a wing, as a dashed
  // line rather than a handrail. The panels are grouped into runs now and each
  // run gets one continuous rail; only the bracing and the posts are per panel.
  const gaps=cfg.railGaps||[], SEG=BAY_W/4;
  const gapped=(a,b)=>{ for(const g of gaps) if(b>g[0]+0.01 && a<g[1]-0.01) return true; return false; };
  {
    const ry=lvlY(1), rz=-WALK_D+0.24;
    const runs=[]; let cur=null;
    for(let i=0;i<n*4;i++){
      const a=-halfLen+i*SEG, b=a+SEG;
      if(gapped(a,b) || a<dA-0.02 || b>dB+0.02){ cur=null; continue; }
      if(cur && Math.abs(cur.b-a)<0.001) cur.b=b;
      else { cur={a:a, b:b}; runs.push(cur); }
    }
    for(const r of runs){
      const len=r.b-r.a, mid=(r.a+r.b)/2;
      lbx(wxf,"teal", len,0.09,0.09, mid, ry+1.02, rz, 0, TEAL);     // one top rail
      lbx(wxf,"teal", len,0.06,0.06, mid, ry+0.54, rz, 0, TEAL);     // one mid rail
      lbx(wxf,"teal", len,0.18,0.11, mid, ry+0.11, rz, 0, TEAL_D);   // one kick
      const np=Math.round(len/SEG);
      for(let k=0;k<np;k++){                                         // bracing per panel
        const pa=r.a+k*SEG, span=SEG-0.16, cx=pa+SEG/2;
        for(const d of [-1,1])
          push("teal", boxGeo(Math.hypot(span,0.84),0.045,0.045,0),
               wxf.x(cx,rz), ry+0.58, wxf.z(cx,rz), wxf.ry, TEAL, 0, d*Math.atan2(0.84,span));
      }
      for(let k=0;k<=np;k++)                                         // and a post at every joint
        lbx(wxf,"teal", 0.09,1.02,0.09, r.a+k*SEG, ry+0.51, rz, 0, TEAL);
      lcol(wxf, len+0.3, 0.34, mid, rz, ry, ry+1.14);
    }
  }
  // a short return where the outer rail turns the inside corner
  if(cfg.cornerReturn){
    const cr=cfg.cornerReturn;
    lbx(wxf,"teal", 0.09,0.09,cr[1], cr[0], lvlY(1)+1.02, -WALK_D+0.24-cr[1]/2, 0, TEAL);
    lbx(wxf,"teal", 0.06,0.06,cr[1], cr[0], lvlY(1)+0.54, -WALK_D+0.24-cr[1]/2, 0, TEAL);
    lbx(wxf,"teal", 0.09,0.18,cr[1], cr[0], lvlY(1)+0.11, -WALK_D+0.24-cr[1]/2, 0, TEAL_D);
    lbx(wxf,"teal", 0.09,1.02,0.09, cr[0], lvlY(1)+0.51, -WALK_D+0.24, 0, TEAL);
    lcol(wxf, 0.3, cr[1], cr[0], -WALK_D+0.24-cr[1]/2, lvlY(1), lvlY(1)+1.14);
  }
  // end railings so you cannot step off the ends of the balcony — except at
  // the inside corner, where the two balconies run into one another
  for(const s of [-1,1]){
    if(cfg.openEnd===s) continue;
    const ex=(s<0?dA:dB)+s*0.05;
    lbx(wxf,"teal", 0.09,0.09,WALK_D, ex, lvlY(1)+1.02, -WALK_D/2, 0, TEAL);
    lbx(wxf,"teal", 0.06,0.06,WALK_D, ex, lvlY(1)+0.54, -WALK_D/2, 0, TEAL);
    lbx(wxf,"teal", 0.09,0.18,WALK_D, ex, lvlY(1)+0.11, -WALK_D/2, 0, TEAL_D);
    for(const zz of [-0.06, -WALK_D+0.06])                // a post at each end of the return
      lbx(wxf,"teal", 0.09,1.02,0.09, ex, lvlY(1)+0.51, zz, 0, TEAL);
    for(let k=0;k<4;k++)
      lbx(wxf,"teal", 0.06,1.0,0.06, ex, lvlY(1)+0.5, -0.35-k*0.68, 0, TEAL);
    lcol(wxf, 0.3, WALK_D, ex, -WALK_D/2, lvlY(1), lvlY(1)+1.14);
  }

  // ---- roof: shallow gable, front slope carried out over the balcony --
  function slope(z0,z1,yA,yB,thick){
    const dz=z1-z0, dy=yB-yA, len=Math.hypot(dz,dy);
    push("roof", boxGeo(cfg.roofLen, thick, len, 0.30),
         wxf.x(cfg.roofOff,(z0+z1)/2), (yA+yB)/2, wxf.z(cfg.roofOff,(z0+z1)/2),
         wxf.ry, "#6d8fa6", -Math.atan2(dy,dz));
  }
  slope(frontEaveZ, ridgeZ, yTop+0.26+lift, ridgeY, 0.20);
  slope(ridgeZ, backEaveZ, ridgeY, yTop+0.30+lift, 0.20);
  lbx(wxf,"paint", cfg.roofLen, 0.24, 0.18, cfg.roofOff, yTop+0.19+lift, frontEaveZ, 0, "#e6e2d6");
  lbx(wxf,"paint", cfg.roofLen, 0.24, 0.18, cfg.roofOff, yTop+0.23+lift, backEaveZ,  0, "#e6e2d6");
}

/* --- outdoor stair -----------------------------------------------------
   Closed concrete sides that step up with the treads and a sloped soffit
   underneath, so there is nothing to see through, plus the teal pipe rail on
   posts from the reference elevation.                                    */
function buildStair(o){
  // o: {x, z} is the BOTTOM centre; the run climbs in `dir` by `sign`
  const N=16, tr=o.run/N, rs=o.rise/N, halfW=o.width/2;
  const L=Math.hypot(o.run,o.rise), tilt=Math.atan2(o.rise,o.run);
  const alongZ=(o.dir==="z");
  const mid=[ alongZ ? o.x : o.x+o.sign*o.run/2,
              alongZ ? o.z+o.sign*o.run/2 : o.z ];
  const put=(bucket,w,h,d,lx,ly,lz,uv,col)=>{
    if(alongZ) bx(bucket,w,h,d, o.x+lx, ly, o.z+o.sign*lz, uv, 0, col);
    else       bx(bucket,d,h,w, o.x+o.sign*lz, ly, o.z+lx, uv, 0, col);
  };
  // treads and risers
  for(let i=0;i<N;i++){
    const s0=i*tr+tr/2, y=BASE+(i+1)*rs;
    put("stairs", o.width, 0.08, tr+0.04, 0, y-0.04, s0, 0.7, "#b4ada0");
    // rolled nosing on every tread
    if(alongZ) push("stairs", new T.CylinderGeometry(0.045,0.045,o.width,8),
                    o.x, y-0.045, o.z+o.sign*(s0+tr/2), 0, "#c0b9ac", 0, Math.PI/2);
    else       push("stairs", new T.CylinderGeometry(0.045,0.045,o.width,8),
                    o.x+o.sign*(s0+tr/2), y-0.045, o.z, 0, "#c0b9ac", Math.PI/2, 0);
    put("stairs", o.width, rs+0.04, 0.08, 0, y-rs/2, s0-tr/2, 0.7, "#a49d90");
    // closed side walls, stepping with the treads
    for(const sd of [-1,1]){
      const h=(i+1)*rs+0.30;
      put("concrete", 0.16, h, tr+0.04, sd*(halfW+0.08), BASE-0.20+h/2, s0, 0.45, "#a8a193");
    }
  }
  // sloped soffit closing the underside of the flight
  push("concrete", boxGeo(o.width+0.34, 0.16, L+0.2, 0.45),
       mid[0], BASE+o.rise/2-0.30, mid[1], alongZ?0:Math.PI/2, "#9c968a",
       alongZ ? -tilt*o.sign : -tilt*o.sign);
  // the landing pad at the bottom
  put("concrete", o.width+0.44, 0.30, 1.20, 0, BASE-0.15, -0.55, 0.45, "#b0a99b");
  addFlat(alongZ ? o.x-halfW-0.2 : Math.min(o.x, o.x-o.sign*1.2),
          alongZ ? o.x+halfW+0.2 : Math.max(o.x, o.x-o.sign*1.2),
          alongZ ? Math.min(o.z, o.z-o.sign*1.2) : o.z-halfW-0.2,
          alongZ ? Math.max(o.z, o.z-o.sign*1.2) : o.z+halfW+0.2, BASE);
  // teal pipe handrail on posts, riding 0.95 above the nosing line
  for(const sd of [-1,1]){
    const sx=sd*(halfW+0.08);
    // The rail tilts about X when the flight runs along Z and about Z when it
    // runs along X; passing both to one push() call silently dropped the
    // second, which is what left one staircase with a level handrail.
    const rx = alongZ ? -tilt*o.sign : 0;
    const rz = alongZ ? 0 : tilt*o.sign;
    const rgeo=(t)=> alongZ ? boxGeo(t, t, L, 0) : boxGeo(L, t, t, 0);
    const rpos=[ alongZ ? o.x+sx : mid[0], 0, alongZ ? mid[1] : o.z+sx ];
    for(const rail of [[1.02,0.09],[0.52,0.06]]){        // top rail and mid rail
      push("teal", rgeo(rail[1]), rpos[0], BASE+o.rise/2+rail[0], rpos[2], 0, TEAL, rx, rz);
    }
    for(let i=0;i<N;i+=3){
      const s0=i*tr+tr/2, top=BASE+(i+1)*rs;
      put("teal", 0.07, 0.92, 0.07, sx, top+0.14+0.46, s0, 0, TEAL);
    }
    // newels at both ends
    put("teal", 0.11, 1.30, 0.11, sx, BASE+0.65, 0.10, 0, TEAL_D);
    put("teal", 0.11, 1.30, 0.11, sx, BASE+o.rise+0.55, o.run-0.10, 0, TEAL_D);
    const cx = alongZ ? o.x+sx : mid[0], cz = alongZ ? mid[1] : o.z+sx;
    const cw = alongZ ? 0.34 : o.run, cd = alongZ ? o.run : 0.34;
    addCol(cx-cw/2, cx+cw/2, cz-cd/2, cz+cd/2, BASE, BASE+o.rise+1.5);
  }
  // walkable ramp
  if(alongZ){
    const z0=Math.min(o.z,o.z+o.sign*o.run), z1=Math.max(o.z,o.z+o.sign*o.run);
    addRamp(o.x-halfW, o.x+halfW, z0, z1, "z", o.sign>0?z0:z1, o.sign>0?z1:z0, BASE, BASE+o.rise);
    addZone(o.x-halfW, o.x+halfW, z0, z1, BASE-0.5, BASE+o.rise+2.2, "STAIRWAY");
  }else{
    const x0=Math.min(o.x,o.x+o.sign*o.run), x1=Math.max(o.x,o.x+o.sign*o.run);
    addRamp(x0, x1, o.z-halfW, o.z+halfW, "x", o.sign>0?x0:x1, o.sign>0?x1:x0, BASE, BASE+o.rise);
    addZone(x0, x1, o.z-halfW, o.z+halfW, BASE-0.5, BASE+o.rise+2.2, "STAIRWAY");
  }
}

/* --- place the two wings --------------------------------------------- */
const NORTH_CX=(NORTH.x0 + NORTH.x0 + NORTH.bays*BAY_W)/2;   // = 0
const EAST_CZ =(EAST.z0  + EAST.z0  + EAST.bays*BAY_W)/2;    // = -1

buildWing({
  bays:NORTH.bays, stairBay:NORTH.stairBay, first:101, name:"WING A",
  lit:[102,105,107,108,203,206],
  railGaps:[[-1.15, 1.15], [24.2, 27.6]],   // stair head, and the inside corner
  deckA:-27.30, deckB:27.05, openEnd:1,     // the east end runs into wing B
  roofLen:NORTH.bays*BAY_W+1.6, roofOff:0.0, roofLift:0.0,
  frame:lx=>XF(NORTH_CX+lx, NORTH.z, 0)
});
buildWing({
  bays:EAST.bays, stairBay:3, first:109, name:"WING B",
  lit:[110,112,209],
  railGaps:[[EAST_CZ-(-7)-1.15, EAST_CZ-(-7)+1.15]],
  deckA:-12.35, deckB:15.30, deckDrop:0.014, openEnd:-1,
  cornerReturn:[-12.30, 0.46],              // meets wing A's rail at the corner
  roofLen:EAST.bays*BAY_W+1.6, roofOff:0.0, roofLift:0.30,
  frame:lx=>XF(EAST.x, EAST_CZ-lx, Math.PI/2)
});

buildStair({x:0.00,  z:6.20,  dir:"z", sign:1, width:1.55, run:5.10, rise:FLOOR_H});
buildStair({x:19.20, z:-7.00, dir:"x", sign:1, width:1.55, run:5.10, rise:FLOOR_H});
