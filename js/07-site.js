"use strict";
/* LOW DESERT MOTEL · 07-site.js
   highway, curbs, lot, landscape beds, desert scatter
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   7 · SITE — highway, curbs, parking lot, landscape beds
   ---------------------------------------------------------------------- */
const matStucco   =()=>new T.MeshStandardMaterial({map:TEX.stucco,   roughness:0.94});
const matStuccoOff=()=>new T.MeshStandardMaterial({map:TEX.stuccoOff,roughness:0.94});
const matConcrete =()=>new T.MeshStandardMaterial({map:TEX.concrete, roughness:0.95});
const matAsphalt  =()=>new T.MeshStandardMaterial({map:TEX.asphalt,  roughness:0.98});
const matRoof     =()=>new T.MeshStandardMaterial({map:TEX.roofMetal,roughness:0.55, metalness:0.35});
const matRoofG    =()=>new T.MeshStandardMaterial({map:TEX.roofGreen,roughness:0.55, metalness:0.35});
const matBreeze   =()=>new T.MeshStandardMaterial({map:TEX.breeze,   roughness:0.9});
const matTeal     =()=>new T.MeshStandardMaterial({map:TEX.trim,     roughness:0.62, metalness:0.12});
const matPaint    =()=>new T.MeshStandardMaterial({map:TEX.enamel,   roughness:0.75});
const matMetal    =()=>new T.MeshStandardMaterial({map:TEX.galv,     roughness:0.38, metalness:0.62});
const matCarpet   =()=>new T.MeshStandardMaterial({map:TEX.carpet,   roughness:0.99});
const matRoomWall =()=>new T.MeshStandardMaterial({map:TEX.roomWall, roughness:0.93});
const matCeil     =()=>new T.MeshStandardMaterial({map:TEX.ceilTile, roughness:0.99});
const matLino     =()=>new T.MeshStandardMaterial({map:TEX.lino,     roughness:0.72});
const matBath     =()=>new T.MeshStandardMaterial({map:TEX.bathTile, roughness:0.55, metalness:0.0});
const matOak      =()=>new T.MeshStandardMaterial({map:TEX.oak,      roughness:0.72});
const matSpread   =()=>new T.MeshStandardMaterial({map:TEX.spread,   roughness:0.95});
const matCurtain  =()=>new T.MeshStandardMaterial({map:TEX.curtain,  roughness:0.95, side:T.DoubleSide});
const matGravel   =()=>new T.MeshStandardMaterial({map:TEX.gravel,   roughness:1.0});
const matStairT   =()=>new T.MeshStandardMaterial({map:TEX.stair,    roughness:0.94});
const matPoolTile =()=>new T.MeshStandardMaterial({map:TEX.pooltile, roughness:0.22, metalness:0.06});
const matPlaster  =()=>new T.MeshStandardMaterial({map:TEX.plaster,  roughness:0.35});
const matFoliage  =()=>new T.MeshStandardMaterial({map:TEX.leafskin, roughness:0.9});

bucketOf("stucco",matStucco);   bucketOf("stuccoOff",matStuccoOff);
bucketOf("concrete",matConcrete); bucketOf("asphalt",matAsphalt);
bucketOf("roof",matRoof);        bucketOf("roofG",matRoofG);
bucketOf("breeze",matBreeze);    bucketOf("teal",matTeal);
bucketOf("paint",matPaint);      bucketOf("metal",matMetal);
bucketOf("carpet",matCarpet);    bucketOf("roomwall",matRoomWall);
bucketOf("ceil",matCeil);        bucketOf("lino",matLino);
bucketOf("bath",matBath);        bucketOf("oak",matOak);
bucketOf("spread",matSpread);    bucketOf("curtain",matCurtain);
bucketOf("gravel",matGravel);    bucketOf("stairs",matStairT);
bucketOf("pooltile",matPoolTile);bucketOf("plaster",matPlaster);
bucketOf("foliage",matFoliage);

const TEAL="#4fb3a8", TEAL_D="#2f8b83", CREAM="#ded6c2", WHITE="#eeeae0",
      SLATE="#8e9cb4", NAVY="#13405e", BRASS="#caa23c", RUST="#9c5232";

(function buildSite(){
  // ---- highway ---------------------------------------------------------
  const roadW=9.0, ROAD_L=3400;                 // past the far fog, both ways
  bx("asphalt", ROAD_L, 0.30, roadW, 0, -0.15, ROADZ, 0.42);
  for(let x=-900;x<900;x+=8){                                   // centre dashes
    bx("paint", 3.0, 0.02, 0.16, x, 0.012, ROADZ, 0, 0, "#d9c27a");
  }
  bx("paint", ROAD_L, 0.02, 0.14, 0, 0.012, ROADZ-roadW/2+0.5, 0, 0, "#cbbb92");
  bx("paint", ROAD_L, 0.02, 0.14, 0, 0.012, ROADZ+roadW/2-0.5, 0, 0, "#cbbb92");
  // gravel shoulders either side, so the asphalt does not end in a knife edge
  bx("gravel", ROAD_L, 0.26, 2.6, 0, -0.13, ROADZ-roadW/2-1.3, 0.42, 0, "#9b8a70");
  bx("gravel", ROAD_L, 0.26, 1.2, 0, -0.13, ROADZ+roadW/2+0.6, 0.42, 0, "#9b8a70");
  // shoulder + sidewalk + painted curb between highway and lot
  const WALK_W=2.55;                            // it was 3.2 and read as a runway
  bx("walk", ROAD_L, 0.30, WALK_W, 0, 0.11, ROADZ+roadW/2+WALK_W/2, 0.62);
  addFlat(-340,340, ROADZ+roadW/2, ROADZ+roadW/2+WALK_W, 0.26);
  bx("paint", ROAD_L, 0.30, 0.42, 0, 0.15, ROADZ+roadW/2+WALK_W+0.10, 0, 0, "#d6c07a");

  // ---- parking lot -----------------------------------------------------
  const L={x0:LOT.x0, x1:LOT.x1, z0:ROADZ+roadW/2+WALK_W+0.30, z1:LOT.z1}, D=POOL.deck;
  const lot=(x0,x1,z0,z1)=>{
    if(x1-x0<0.05 || z1-z0<0.05) return;
    bx("asphalt", x1-x0, 0.30, z1-z0, (x0+x1)/2, -0.16, (z0+z1)/2, 0.62);
    lotTop(x0,x1,z0,z1);
    addFlat(x0,x1,z0,z1, 0);
  };
  lot(L.x0, L.x1, L.z0, D.z0);
  lot(L.x0, L.x1, D.z1, L.z1);
  lot(L.x0, D.x0, D.z0, D.z1);
  lot(D.x1, L.x1, D.z0, D.z1);
  addZone(L.x0,L.x1,L.z0,L.z1, -1, 2.4, "PARKING LOT");
  /* The asphalt map carries its own cracking and patching, but a texture tile
     is 2.4 m across and a lot has things on it much bigger than that: whole
     bays gone dark where they were dug up and made good, the ruts down the
     driving lanes, the dark patch under wherever a car stands all summer, and
     the scuffs where they swing in. These go on in world scale so they read
     at the size of the lot rather than the size of the tile.             */
  (function lotWear(){
    let sd=88317; const r2=()=>{ sd=(sd*1103515245+12345)%2147483648; return sd/2147483648; };
    const on=(x,z)=> x>L.x0+1 && x<L.x1-1 && z>L.z0+1 && z<L.z1-1 &&
                     !(x>D.x0-1&&x<D.x1+1&&z>D.z0-1&&z<D.z1+1);
    let laid=0;
    for(let i=0;i<220 && laid<120;i++){
      const x=L.x0+r2()*(L.x1-L.x0), z=L.z0+r2()*(L.z1-L.z0);
      if(!on(x,z)) continue;
      laid++;
      const q=r2();
      if(q<0.30){                                   // a bay cut out and made good
        push("soot", planeGeo(2.2+r2()*3.6, 2.0+r2()*3.0, 0), x, 0.012+laid*0.0006, z,
             r2()*6, "#2a2722", -Math.PI/2, 0);
      }else if(q<0.55){                             // bleached where the sun gets it
        push("soot", planeGeo(2.6+r2()*4.4, 2.2+r2()*3.4, 0), x, 0.012+laid*0.0006, z,
             r2()*6, "#b8ae98", -Math.PI/2, 0);
      }else if(q<0.80){                             // whatever leaked out of whatever parked
        push("soot", planeGeo(0.9+r2()*1.3, 1.5+r2()*1.6, 0), x, 0.012+laid*0.0006, z,
             r2()*6, "#211e1a", -Math.PI/2, 0);
      }else{                                        // a scuff where they swing in
        const a=r2()*Math.PI*2;
        for(let k=0;k<5;k++)
          push("soot", planeGeo(0.24, 1.5+r2()*0.8, 0), x+Math.cos(a)*k*0.9,
               0.012+laid*0.0006+k*0.0001, z+Math.sin(a)*k*0.9, a+k*0.13,
               "#1d1b18", -Math.PI/2, 0);
      }
    }
    // and the ruts down the two driving lanes, which is where it wears most
    for(const lz of [-31.0, -21.6]){
      for(let i=0;i<26;i++)
        push("soot", planeGeo(3.4, 0.55, 0), L.x0+3+i*3.2, 0.0138, lz+((i*7)%3-1)*0.16,
             ((i*5)%5-2)*0.02, "#242119", -Math.PI/2, 0);
    }
  })();
  // sand shoulder between the asphalt edge and the graded sub-base
  bx("asphalt", 700, 0.20, 3.4, 0, -0.14, L.z0-1.7, 0.42);

  // stall stripes: two ranks facing the road, one rank along the east wing
  const stripe=(x,z,len,horiz)=>{
    if(horiz) bx("paint", len, 0.02, 0.11, x, 0.008, z, 0, 0, "#6a5b2e");
    else      bx("paint", 0.11, 0.02, len, x, 0.008, z, 0, 0, "#6a5b2e");
  };
  for(let x=-46;x<=34;x+=2.9) stripe(x, -36.2, 5.4, false);      // south rank
  bx("paint", 82, 0.02, 0.10, -6, 0.008, -33.5, 0, 0, "#6d5d30");
  for(let x=-46;x<=34;x+=2.9) stripe(x, -27.0, 5.4, false);      // second rank
  bx("paint", 82, 0.02, 0.10, -6, 0.008, -24.3, 0, 0, "#6d5d30");
  for(let x=-24;x<=-4;x+=2.9)  stripe(x, 9.0, 4.2, false);       // courtyard, west of the stair
  for(let z=-21;z<=-7;z+=2.9)  stripe(21.4, z, 5.0, true);       // alongside wing B
  // accessible stall by the office: blue field with a white hatched aisle

  // ---- xeriscape bed along the office / street frontage ---------------
  bx("gravel", 16.5, 0.22, 4.0, -38.5, -0.02, -14.2, 0.22);
  bx("concrete", 16.5, 0.30, 0.3, -38.5, 0.06, -12.15, 0.3, 0, "#8a6a4c");
  bx("concrete", 16.5, 0.30, 0.3, -38.5, 0.06, -16.25, 0.3, 0, "#8a6a4c");
})();

/* --- desert dressing: cacti, sage, rocks, poles ------------------------ */
(function scatterDesert(){
  const inLot=(x,z)=>(x>LOT.x0-8&&x<LOT.x1+8&&z>ROADZ-14&&z<LOT.z1+8) ||
                     (x>-99&&x<-50&&z>-42&&z<27);          // and the bar's lot
  // Nothing grows on the highway, and nothing rolls onto it either. The lot
  // test only covers the motel's own frontage; the road runs out to the edge
  // of the world, so the carriageway, both shoulders and the walk need their
  // own exclusion or boulders end up sitting in the fast lane.
  const onRoad=z=>Math.abs(z-ROADZ)<11.5;
  // Everything out in the desert that has a floor or a roof on it. A saguaro
  // came up through the middle of the snack bar because scatterDesert runs
  // long before any of these is built and cannot ask the zone list.
  const KEEP_CLEAR=[
    [-214,-198,-166,-150],   // the snack bar
    [-182,-166,-146,-130],   // the drive-in projection room
    [-190,-156,-188,-176],   // and its screen
    [-370,-342,-260,-232],   // the trailer
    [-166,-124,-380,-338],   // the filling station
    [ 148, 206,-462,-406],   // the motel that did not make it
    [-276,-248, 104, 132],   // the windmill and its stock tank
    [-654,-606, -90, -46],   // the burying ground
    [-580,-552,  22,  50],   // the adit bench and its spoil fan
    [-300,-200,-700,-600],   // the tracking station's pad
    [ 872, 932, -100,  -46],   // the diner car and its apron
  ];
  const built=(x,z)=>{
    for(const r of KEEP_CLEAR) if(x>r[0]&&x<r[1]&&z>r[2]&&z<r[3]) return true;
    return false;
  };
  // A saguaro has a domed top and elbowed arms; it is not a ten-sided tube
  // with a flat lid and a stick glued to the side. Sixteen sides so the
  // silhouette is round, a hemisphere on every growing tip, and the arms
  // turn a real corner out and then up.
  function saguaroArm(x,y,z, sd, up, green){
    cyl("foliage", 0.20,0.23,0.62,12, x+sd*0.42, y, z, green, 0,0,Math.PI/2);   // out
    push("foliage", new T.SphereGeometry(0.215,10,6), x+sd*0.70, y, z, 0, green);
    cyl("foliage", 0.185,0.215,up,12, x+sd*0.70, y+up/2, z, green);             // and up
    push("foliage", new T.SphereGeometry(0.187,10,6), x+sd*0.70, y+up, z, 0, green);
  }
  for(let i=0;i<180;i++){
    const a=rnd()*Math.PI*2, r=70+rnd()*430;
    const x=Math.cos(a)*r, z=Math.sin(a)*r+10;
    if(inLot(x,z)||onRoad(z)||built(x,z)) continue;
    const y=Terrain.heightAt(x,z);
    if(y>26) continue;
    const green=pick(["#4f6b3a","#57713f","#465f34"]);
    if(rnd()<0.72){
      const h=2.4+rnd()*2.8, rt=0.30+rnd()*0.06, rb=rt+0.08;
      cyl("foliage", rt,rb,h,14, x, y+h/2, z, green);
      addCol(x-rb, x+rb, z-rb, z+rb, y, y+h);       // you cannot drive through it
      push("foliage", new T.SphereGeometry(rt,12,7), x, y+h, z, 0, green);      // the crown
      const arms=rnd()<0.75?2:1;
      for(let k=0;k<arms;k++){
        const sd=k===0?1:-1, hy=y+h*(0.40+rnd()*0.24);
        saguaroArm(x, hy, z, sd, 0.9+rnd()*0.9, green);
      }
    }else{                                         // barrel cactus, squat and ribbed
      const br=0.40+rnd()*0.26;
      const g2=new T.SphereGeometry(br, 12, 8); g2.scale(1, 0.80, 1);
      push("foliage", g2, x, y+br*0.70, z, rnd()*6, green);
      addCol(x-br*0.8, x+br*0.8, z-br*0.8, z+br*0.8, y, y+br*1.3);
      push("foliage", new T.SphereGeometry(br*0.30,10,6), x, y+br*1.38, z, 0, green);
    }
  }
  /* ---- the rest of the flora ------------------------------------------
     One green is not a desert. A creosote is not a smooth ball either — it
     is mostly gaps, with twigs sticking out of a thin crown. Five more
     species go in alongside it, all built from the same leaning-stem
     primitive so a branch can grow off the end of another branch.        */
  // a tapered stem of length h rising from (x,y,z), leaning `lean` radians
  // toward azimuth `a`. Returns its tip, so the next segment starts there.
  function stem(bk, rt,rb,h,seg, x,y,z, col, lean, a){
    const si=Math.sin(lean), co=Math.cos(lean);
    // A cylinder's own axis, after the YXZ euler push() composes from
    // (rx=lean, ry=a), is (+sin a · sin lean, cos lean, +cos a · sin lean).
    // Offsetting the centre by the NEGATIVE of its horizontal part — which is
    // what this did — leaves every joint sin(lean)·h to one side of the one
    // before it and returns a tip that is not on the segment at all. That gap
    // is what has been reading as "fragmented polygons" in every plant out
    // here, and as a dead tree in pieces at the burying ground.
    const dx=Math.sin(a)*si, dz=Math.cos(a)*si;
    cyl(bk, rt,rb,h,seg, x+dx*h/2, y+co*h/2, z+dz*h/2, col, lean, a, 0);
    return [x+dx*h, y+co*h, z+dz*h];
  }
  const GREENS=["#4f6b3a","#57713f","#465f34","#5d6b45","#6b7448"];
  const GREYGRN=["#6e7a56","#7a8460","#63704c","#808a66"];
  const STRAW=["#9a8f70","#8a7f63","#a89a76","#7d7357"];
  const DEADW=["#7e755e","#6f6754","#877d64"];      // a dead bush, not a white one

  // Every one of these is built end-to-end out of cylinders, and a cylinder
  // has two flat cut ends on it. Without something at each joint the result is
  // a scatter of sawn logs rather than a plant, which is exactly what the
  // first cholla looked like. A ball at each joint fixes it; an icosahedron
  // is a ball at this size and costs 20 triangles instead of seventy.
  function knuckle(x,y,z,r,col){ push("foliage", blobGeo(r), x,y,z, 0, col); }

  // mesquite: a low wide crown on two or three thick trunks. It replaces the
  // ocotillo as the thing with a silhouette you read from a distance, and it
  // is made of masses rather than wires, so it survives being small on screen.
  function mesquite(x,y,z,sc){
    const bark="#6a5a46", leaf=pick(["#4e5f3a","#586a42","#465736"]);
    const trunks=2+((rnd()*2)|0);
    const tops=[];
    for(let k=0;k<trunks;k++){
      const a=(k/trunks)*Math.PI*2+rnd(), lean=0.18+rnd()*0.22;
      const H2=(0.85+rnd()*0.55)*sc;
      const t1=stem("foliage", 0.085*sc, 0.135*sc, H2*0.6, 7, x,y,z, bark, lean*0.5, a);
      knuckle(t1[0],t1[1],t1[2], 0.090*sc, bark);
      const t2=stem("foliage", 0.062*sc, 0.085*sc, H2*0.5, 6, t1[0],t1[1],t1[2], bark,
                    lean, a+(rnd()-0.5)*0.8);
      tops.push(t2);
    }
    for(const t of tops){                              // the crown, one mass per trunk
      const n=7+((rnd()*4)|0);
      const put=[[t[0], t[1]+0.10*sc, t[2], (0.21+rnd()*0.06)*sc]];
      push("foliage", blobGeo(put[0][3]), put[0][0], put[0][1], put[0][2], rnd()*6, leaf);
      for(let b=1;b<n;b++){
        const from=put[(rnd()*put.length)|0], rad=(0.15+rnd()*0.08)*sc;
        const a=rnd()*Math.PI*2, up=rnd()*0.7;
        const d=(from[3]+rad)*(0.50+rnd()*0.28);
        const px=from[0]+Math.cos(a)*d*(1-up*0.5);
        const py=from[1]+d*up*0.8;
        const pz=from[2]+Math.sin(a)*d*(1-up*0.5);
        push("foliage", blobGeo(rad), px, py, pz, rnd()*6, leaf);
        put.push([px,py,pz,rad]);
      }
    }
    for(let k=0;k<3+((rnd()*3)|0);k++)                 // seed pods under it
      push("foliage", blobGeo(0.045*sc), x+(rnd()-0.5)*1.1*sc, y+0.05*sc,
           z+(rnd()-0.5)*1.1*sc, rnd()*6, "#8a7f63");
  }
  // cholla: a stout trunk that forks into short fat joints, each one shorter
  // than the last and balled at its end, so the whole thing reads as one mass
  // rather than a dropped bundle of sticks. The pale sleeve is the spines.
  function cholla(x,y,z,sc){
    const col=pick(["#6f7c48","#78854f","#657342"]), SPINE="#bdbb9a";
    function joint(px,py,pz, r, L, lean, a, depth){
      const r2=r*0.82;
      const t=stem("foliage", r2, r, L, 7, px,py,pz, col, lean, a);
      if(depth>0)                                // the spines, on the fat joints
        cyl("foliage", r2*1.45, r*1.45, L*0.88, 6,
            (px+t[0])/2, (py+t[1])/2, (pz+t[2])/2, SPINE, lean, a, 0);
      knuckle(t[0],t[1],t[2], r2*1.18, col);
      if(depth<=0) return;
      for(let k=0;k<2;k++)
        joint(t[0],t[1],t[2], r2, L*(0.74+rnd()*0.14),
              0.32+rnd()*0.32, a+(k-0.5)*1.4+(rnd()-0.5)*0.6, depth-1);
    }
    knuckle(x, y+0.05*sc, z, 0.115*sc, col);
    joint(x, y+0.02*sc, z, 0.105*sc, 0.44*sc, 0.05, rnd()*6, 2);
    for(let i=0;i<2+((rnd()*3)|0);i++)           // the joints that dropped off
      push("foliage", new T.CylinderGeometry(0.055*sc,0.070*sc,0.17*sc,6),
           x+(rnd()-0.5)*0.9*sc, y+0.05*sc, z+(rnd()-0.5)*0.9*sc, rnd()*6,
           "#9a9878", Math.PI/2, (rnd()-0.5)*0.6);
  }
  // prickly pear: flat pads, each growing off the rim of the last
  function pricklyPear(x,y,z,sc){
    const col=pick(["#5f7a42","#6b8449","#56703b"]);
    const pad=(px,py,pz,w,tilt,face)=>{
      const g=new T.SphereGeometry(w,10,6); g.scale(1.0, 1.22, 0.17);
      push("foliage", g, px,py,pz, face, col, tilt, 0);
      push("foliage", blobGeo(w*0.30), px, py-w*0.92, pz, 0, col);   // where it joins
      return [px+Math.sin(face)*0.02, py+w*1.05*Math.cos(tilt), pz+Math.cos(face)*0.02];
    };
    const n=3+((rnd()*4)|0), face=rnd()*Math.PI*2;
    let base=[x,y+0.22*sc,z];
    for(let k=0;k<n;k++){
      const w=(0.26+rnd()*0.16)*sc;
      const t=pad(base[0]+(rnd()-0.5)*0.30*sc, base[1], base[2]+(rnd()-0.5)*0.30*sc,
                  w, (rnd()-0.5)*0.5, face+(rnd()-0.5)*1.2);
      if(rnd()<0.6) base=t; else base=[x+(rnd()-0.5)*0.5*sc, y+0.22*sc, z+(rnd()-0.5)*0.5*sc];
    }
  }
  // yucca / sotol: a rosette of stiff blades and, sometimes, a spent stalk
  function yucca(x,y,z,sc){
    const col=pick(["#5a6b44","#667552","#4f6038"]);
    // a blade five centimetres wide is one pixel at thirty metres; these are
    // twice that and there is a mass in the middle holding them together
    push("foliage", blobGeo(0.17*sc), x, y+0.14*sc, z, rnd()*6, col);
    const n=12+((rnd()*6)|0);
    for(let i=0;i<n;i++){
      const a=(i/n)*Math.PI*2+rnd()*0.3, lean=0.35+rnd()*0.80, L=(0.42+rnd()*0.46)*sc;
      const si=Math.sin(lean), co=Math.cos(lean);
      push("foliage", boxGeo(0.105*sc, L, 0.030*sc, 0),
           x+Math.sin(a)*si*L/2, y+0.10*sc+co*L/2, z+Math.cos(a)*si*L/2,
           a, col, lean, 0);
    }
    if(rnd()<0.45){
      const H=(1.3+rnd()*1.2)*sc;
      const t=stem("foliage", 0.022*sc,0.038*sc, H, 5, x,y+0.02*sc,z, "#9a8f70", 0.05, rnd()*6);
      // the spent flower, which is a thin dry panicle up the top half of the
      // stalk — not five cream beach balls stacked on the end of it
      for(let k=0;k<9;k++){
        const u=k/8, r2=0.030*sc*(1.0-u*0.45);
        push("foliage", blobGeo(r2),
             t[0]+(rnd()-0.5)*0.10*sc*(1-u*0.5), t[1]-0.42*H*(1-u),
             t[2]+(rnd()-0.5)*0.10*sc*(1-u*0.5), 0, k%2?"#a89a76":"#94886a");
      }
    }
  }
  // bunch grass, and the dead version of it
  function tussock(x,y,z,sc,col){
    push("foliage", blobGeo(0.13*sc), x, y+0.09*sc, z, rnd()*6, col);
    const n=8+((rnd()*5)|0);
    for(let i=0;i<n;i++){
      const a=rnd()*Math.PI*2, lean=0.25+rnd()*0.70, L=(0.24+rnd()*0.30)*sc;
      const si=Math.sin(lean), co=Math.cos(lean);
      push("foliage", boxGeo(0.055*sc, L, 0.022*sc, 0),
           x+Math.sin(a)*si*L/2, y+0.06*sc+co*L/2, z+Math.cos(a)*si*L/2, a, col, lean, 0);
    }
  }
  // creosote / sage: ONE crown, not a scatter of chips. The lumps overlap
  // into a single mound and the twigs come out from under it. Spread over
  // eighty centimetres they read as debris, which is what they were doing.
  function sagebush(x,y,z,sc){
    const col=pick(["#556040","#5e6a46","#4c583a","#63704c","#586348"]);
    const dead=rnd()<0.13;
    // lumps packed into a low, wide dome. Sized up a row at a time they
    // stacked into a snowman; scattered through the volume they mass.
    const H=(0.34+rnd()*0.16)*sc;
    const n=8+((rnd()*4)|0);
    const put=[[x, y+0.12*sc, z, (0.15+rnd()*0.04)*sc]];
    push("foliage", blobGeo(put[0][3]), put[0][0], put[0][1], put[0][2], rnd()*6,
         dead?pick(DEADW):col);
    for(let b=1;b<n;b++){
      const from=put[(rnd()*put.length)|0];
      const rad=(0.12+rnd()*0.05)*sc;
      const a=rnd()*Math.PI*2, up=rnd()*0.9;
      const d=(from[3]+rad)*(0.52+rnd()*0.30);          // close enough to merge
      const px=from[0]+Math.cos(a)*d*(1-up*0.5);
      const py=Math.min(y+0.12*sc+H, Math.max(y+0.10*sc, from[1]+d*up));
      const pz=from[2]+Math.sin(a)*d*(1-up*0.5);
      push("foliage", blobGeo(rad), px, py, pz, rnd()*6, dead?pick(DEADW):col);
      put.push([px,py,pz,rad]);
    }
    for(let k=0;k<3+((rnd()*3)|0);k++)                   // the twigs, under the crown
      stem("foliage", 0.024*sc,0.038*sc, (0.20+rnd()*0.24)*sc, 5,
           x+(rnd()-0.5)*0.22*sc, y+0.02, z+(rnd()-0.5)*0.22*sc,
           pick(STRAW), 0.55+rnd()*0.50, rnd()*Math.PI*2);
  }

  // biased toward the near field: at 400 m nothing of a bush survives but a
  // dot, so the budget is better spent where you can walk up to it
  const near=()=>{ const u=rnd(); return 46+395*u*u; };
  for(let i=0;i<900;i++){                                 // sage / creosote
    const a=rnd()*Math.PI*2, r=near();
    const x=Math.cos(a)*r, z=Math.sin(a)*r+10;
    if(inLot(x,z)||onRoad(z)||built(x,z)) continue;
    const y=Terrain.heightAt(x,z); if(y>32) continue;
    sagebush(x,y,z, 0.85+rnd()*0.55);
  }
  for(let i=0;i<820;i++){                                 // the other five
    const a=rnd()*Math.PI*2, r=near();
    const x=Math.cos(a)*r, z=Math.sin(a)*r+10;
    if(inLot(x,z)||onRoad(z)||built(x,z)) continue;
    const y=Terrain.heightAt(x,z); if(y>30) continue;
    const q=rnd();
    if(q<0.12)      mesquite(x,y,z, 0.9+rnd()*0.6);
    else if(q<0.34) cholla(x,y,z, 0.85+rnd()*0.55);
    else if(q<0.56) pricklyPear(x,y,z, 0.9+rnd()*0.6);
    else if(q<0.72) yucca(x,y,z, 0.9+rnd()*0.6);
    else            tussock(x,y,z, 0.9+rnd()*0.7,
                            rnd()<0.45?pick(STRAW):pick(["#7a7f4e","#6d7346"]));
  }
  // rocks: an icosahedron with every vertex pushed in or out, so no two are
  // the same lump, and a stone map over the top of it
  // IcosahedronGeometry is NOT indexed — every triangle carries its own copy
  // of each corner. The first version looked up a shared radial factor but
  // then multiplied Y by a SECOND random factor drawn per copy, so the three
  // copies of a corner went to three different places and the rock came apart
  // into shards with gaps between them. Both factors are shared now, and the
  // squash is per-rock rather than per-vertex.
  for(let i=0;i<170;i++){
    const a=rnd()*Math.PI*2, r=64+rnd()*430;
    const x=Math.cos(a)*r, z=Math.sin(a)*r+10;
    if(inLot(x,z)||onRoad(z)||built(x,z)) continue;
    const y=Terrain.heightAt(x,z);
    const s=0.5+rnd()*2.6;
    push("rock", rockGeo(s, i*13+5), x, y+s*0.22, z, rnd()*6,
      pick(["#d8c6ac","#c6b298","#e2d0b6","#b9a68e"]), rnd()*0.4-0.2, rnd()*0.4-0.2);
    // rockGeo jitters out to about 1.2x, and anything over half a metre is
    // something you hit rather than something you drive over
    if(s>0.55) addCol(x-s*0.95, x+s*0.95, z-s*0.95, z+s*0.95, y, y+s*1.1);
  }
  for(let i=0;i<130;i++){                       // and the small stuff, scattered
    const a=rnd()*Math.PI*2, r=40+rnd()*470;
    const x=Math.cos(a)*r, z=Math.sin(a)*r+10;
    if(inLot(x,z)||onRoad(z)||built(x,z)) continue;
    const s=0.13+rnd()*0.26;
    push("rock", rockGeo(s, i*29+11), x, Terrain.heightAt(x,z)+s*0.30, z, rnd()*6,
      pick(["#d8c6ac","#c6b298","#b9a68e"]), rnd()*0.6-0.3, rnd()*0.6-0.3);
  }
  /* ---- and the same again, sparser, out to a mile and a half ---------
     Everything used to stop at about five hundred metres, so past that the
     floor read as bare ground and the distance stopped selling itself. These
     are simpler — fewer segments, one detail level down — because at that
     range nothing of them survives but the silhouette.                   */
  for(let i=0;i<300;i++){                                   // far cacti
    const a=rnd()*Math.PI*2, r=470+rnd()*980;
    const x=Math.cos(a)*r, z=Math.sin(a)*r+10;
    if(onRoad(z)||built(x,z)) continue;
    const y=Terrain.heightAt(x,z); if(y>30) continue;
    const green=pick(["#4f6b3a","#57713f","#465f34"]);
    if(rnd()<0.74){
      const h=2.6+rnd()*2.6, rt=0.30+rnd()*0.06;
      cyl("foliage", rt,rt+0.08,h,10, x, y+h/2, z, green);
      push("foliage", new T.SphereGeometry(rt,8,5), x, y+h, z, 0, green);
      if(rnd()<0.6){
        const sd=rnd()<0.5?1:-1, hy=y+h*0.46, up=0.9+rnd()*0.8;
        cyl("foliage", 0.20,0.22,0.60,8, x+sd*0.40, hy, z, green, 0,0,Math.PI/2);
        cyl("foliage", 0.185,0.21,up,8, x+sd*0.68, hy+up/2, z, green);
        push("foliage", new T.SphereGeometry(0.19,8,5), x+sd*0.68, hy+up, z, 0, green);
      }
    }else{
      const br=0.40+rnd()*0.26, g3=new T.SphereGeometry(br,10,6); g3.scale(1,0.80,1);
      push("foliage", g3, x, y+br*0.70, z, rnd()*6, green);
    }
  }
  for(let i=0;i<520;i++){                                   // far sage
    const a=rnd()*Math.PI*2, r=450+rnd()*1050;
    const x=Math.cos(a)*r, z=Math.sin(a)*r+10;
    if(onRoad(z)||built(x,z)) continue;
    const y=Terrain.heightAt(x,z); if(y>36) continue;
    const col=pick(["#6a6a3c","#75754a","#5e6036","#7d7a4d"]);
    const rad=0.34+rnd()*0.40;
    push("foliage", blobGeo(rad), x, y+rad*0.68, z, rnd()*6, col);
    if(rnd()<0.5){
      const r2b=0.26+rnd()*0.30;
      push("foliage", blobGeo(r2b),
           x+(rnd()-0.5)*0.7, y+r2b*0.72, z+(rnd()-0.5)*0.7, rnd()*6, col);
    }
  }
  for(let i=0;i<380;i++){                                   // far rocks
    const a=rnd()*Math.PI*2, r=460+rnd()*1060;
    const x=Math.cos(a)*r, z=Math.sin(a)*r+10;
    if(onRoad(z)||built(x,z)) continue;
    const sc=0.7+rnd()*3.2;
    const fy=Terrain.heightAt(x,z);
    push("rock", rockGeo(sc, i*17+3), x, fy+sc*0.22, z, rnd()*6,
      pick(["#d8c6ac","#c6b298","#e2d0b6","#b9a68e"]), rnd()*0.4-0.2, rnd()*0.4-0.2);
    addCol(x-sc*0.95, x+sc*0.95, z-sc*0.95, z+sc*0.95, fy, fy+sc*1.1);
  }

  // Power poles along the highway. A crossarm runs ACROSS the line, and the
  // wires hang off it at its ends — both of those were laid out along the
  // line instead, which made the arm a stub pointing the way the road goes
  // and put all three wires on the same z, collinear, rendering as one.
  // The birds perch on the outer lanes, so that is also why some of them sat
  // in mid-air with nothing under them.
  const POLE_Z=ROADZ-7.4, POLE_X0=-704, POLE_DX=44, LANE=1.05;
  const tops=[];
  for(let x=POLE_X0;x<=704;x+=POLE_DX){
    const y=Terrain.heightAt(x,POLE_Z);
    cyl("oak", 0.17,0.21,8.2,8, x, y+4.1, POLE_Z, "#5b4632");
    addCol(x-0.26, x+0.26, POLE_Z-0.26, POLE_Z+0.26, y, y+8.2);
    bx("oak", 0.16,0.16,2.4, x, y+7.5, POLE_Z, 0.4, 0, "#5b4632");
    bx("oak", 0.14,0.14,1.7, x, y+6.7, POLE_Z, 0.4, 0, "#5b4632");
    for(const sg of [-1,0,1])                       // an insulator under each wire
      cyl("glass", 0.055,0.075,0.14,7, x, y+7.66, POLE_Z+sg*LANE, "#7e8c86");
    tops.push({x:x, y:y+7.5, z:POLE_Z});
  }
  const pts=[];
  for(let i=1;i<tops.length;i++){
    const a=tops[i-1], b=tops[i];
    for(const sg of [-1,0,1]){
      let prev=null;
      for(let k=0;k<=6;k++){
        const f=k/6, sag=Math.sin(f*Math.PI)*1.1;
        const p=new T.Vector3(lerp(a.x,b.x,f), lerp(a.y,b.y,f)-sag, a.z+sg*LANE);
        if(prev) pts.push(prev,p);
        prev=p;
      }
    }
  }
  const wg=new T.BufferGeometry().setFromPoints(pts);
  scene.add(new T.LineSegments(wg, new T.LineBasicMaterial({color:0x1a1712})));

  // The wire carries no birds. Two rounds of trying to seat them on it were
  // two rounds too many; the line reads better bare, and the vultures
  // overhead are the living things on this road now.
})();

/* --- what the road leaves behind: nobody stopped, it just accumulates ---- */
(function(){
  // Sit on whatever is actually underfoot: out here that is the terrain, but a
  // few of these land on the graded slab or a kerb, which is higher.
  const TG=(x,z)=>{ const t=Terrain.heightAt(x,z);
                    const f=surfaceY(x, z, t+0.8);
                    return (f>t && f<t+0.8) ? f : t; };
  // Junk blows off the road, not into the lot or through somebody's wall, so
  // everything here is checked against the footprints it could land inside.
  const KEEPOUT=[[-96,-60,-34,-10],[-46,46,-44,26],[-620,-520,0,70]];
  const clear=(x,z)=>{
    if(Math.abs(z-ROADZ)<6.0) return false;            // the travelled lanes
    for(const k of KEEPOUT) if(x>k[0]&&x<k[1]&&z>k[2]&&z<k[3]) return false;
    return true;
  };
  // shredded truck tyre, the tread peeled off it in a long curl
  for(const q of [[-142, ROADZ+9.6, 0.6],[236, ROADZ-9.2, 2.3],[-402, ROADZ+8.4, 1.1]]){
    if(!clear(q[0],q[1])) continue;
    const y=TG(q[0],q[1]);
    push("tyre", new T.TorusGeometry(0.50,0.17,6,14), q[0], y+0.17, q[1], q[2],
         "#22201e", Math.PI/2, 0.22);
    for(let i=0;i<5;i++)
      push("tyre", boxGeo(0.62,0.035,0.20,0), q[0]+0.55+i*0.55, y+0.035+((i*3)%2)*0.05,
           q[1]+Math.sin(i*1.3)*0.34, q[2]+i*0.22, "#26231f", 0, Math.sin(i*2.1)*0.30);
  }
  // a hubcap, a boot with nobody in it, and a can that has been here for years
  for(let i=0;i<22;i++){
    const rx=-660+((i*137)%1320), rz=ROADZ+(((i*47)%2)?1:-1)*(7.5+((i*31)%9));
    if(!clear(rx,rz)) continue;
    const y=TG(rx,rz);
    const k=i%4;
    if(k===0) cyl("metal", 0.17,0.17,0.035,12, rx, y+0.03, rz, "#8e9298", 1.4+i, 0, 0.3);
    else if(k===1){ push("tyre", boxGeo(0.26,0.10,0.11,0), rx, y+0.05, rz, i*1.1, "#4a3a2a", 0, 0.1);
                    push("tyre", boxGeo(0.10,0.13,0.10,0), rx+0.10, y+0.10, rz, i*1.1, "#4a3a2a"); }
    else if(k===2) cyl("metal", 0.033,0.033,0.12,10, rx, y+0.033, rz, "#9aa0a2", Math.PI/2, i, 0);
    else push("paper", boxGeo(0.20,0.006,0.26,0), rx, y+0.014, rz, i*0.9, "#cfc6ac", 0.04, 0.03);
  }
  // a mattress somebody threw out of a truck, bleached to nothing
  {
    const mx=-196, mz=ROADZ+16.5, y=TG(mx,mz);
    push("spread", boxGeo(1.95,0.26,1.35,1.2), mx, y+0.14, mz, 0.7, "#8e8672", 0.05, 0.03);
    push("spread", boxGeo(1.70,0.10,1.15,1.2), mx+0.10, y+0.30, mz-0.06, 0.62, "#7d7565",
         0.04, 0.02);                                 // the ticking, sagged off one side
    for(let i=0;i<4;i++)                              // springs through it
      push("metal", new T.TorusGeometry(0.06,0.008,4,8), mx-0.6+i*0.42, y+0.36,
           mz+Math.sin(i*2.0)*0.4, 0.7, "#6f6a62", Math.PI/2, 0);
  }
  // a refrigerator standing in the open desert with its door hanging off
  {
    const fx=312, fz=ROADZ+34, y=TG(fx,fz), ry=0.85;
    bx("siding", 0.74,1.62,0.68, fx, y+0.81, fz, ry, 0, "#cfc9ba");
    bx("siding", 0.05,1.52,0.62, fx+Math.cos(ry)*0.40+0.10, y+0.80,
       fz-Math.sin(ry)*0.40+0.24, ry+1.05, 0, "#c6bfae");
    bx("weathered", 0.70,0.30,0.64, fx, y+0.22, fz, ry, 0, "#7a4a2c");
    addCol(fx-0.5,fx+0.5, fz-0.5,fz+0.5, y, y+1.7);
  }
  // A payphone on the shoulder with the receiver hanging down the wall. It is
  // the loudest thing out here and it has not rung in years.
  {
    const px=-58.0, pz=ROADZ+7.0, y=TG(px,pz), ry=Math.PI;
    cyl("metal", 0.055,0.065,2.05,8, px, y+1.02, pz, "#8b9096");
    bx("siding", 0.66,1.16,0.34, px, y+1.52, pz, ry, 0, "#2f4f5e");   // the hood
    bx("siding", 0.60,0.26,0.30, px, y+2.14, pz, ry, 0, "#2f4f5e");
    bx("paint", 0.46,0.90,0.05, px, y+1.52, pz+0.18, ry, 0, "#c9c2b2"); // the faceplate
    bx("metal", 0.30,0.16,0.04, px-0.02, y+1.74, pz+0.21, ry, 0, "#6f767a"); // coin slot
    for(let r=0;r<4;r++) for(let c2=0;c2<3;c2++)                        // the keypad
      cyl("paint", 0.022,0.022,0.012,8, px-0.08+c2*0.075, y+1.52-r*0.075, pz+0.215,
          "#d8d2c2", Math.PI/2, 0, 0);
    bx("bin", 0.10,0.30,0.09, px+0.26, y+1.34, pz+0.16, ry, 0, "#1f1c19"); // the handset,
    bx("bin", 0.08,0.10,0.07, px+0.26, y+1.16, pz+0.16, ry, 0, "#1f1c19"); // off the hook
    for(let k=0;k<7;k++)                                                // on its cord
      push("metal", new T.TorusGeometry(0.030,0.010,5,9), px+0.26, y+1.05-k*0.085,
           pz+0.16, 0, "#4b5054", Math.PI/2, 0);
    cyl("metal", 0.12,0.15,0.05,10, px, y+2.34, pz, "#6f767a");
    cyl("lampshade", 0.10,0.13,0.07,10, px, y+2.28, pz, "#e8dcc0");
    addCol(px-0.35,px+0.35, pz-0.25,pz+0.25, y, y+2.2);
  }
  // a speed sign nobody has obeyed, shot through twice
  for(const q of [[-268, ROADZ+6.9, Math.PI],[424, ROADZ-8.1, 0]]){
    const y=TG(q[0],q[1]);
    cyl("metal", 0.035,0.035,2.35,8, q[0], y+1.17, q[1], "#8b9096");
    bx("paint", 0.62,0.78,0.045, q[0], y+2.05, q[1], q[2], 0, "#d8d2c2");
    for(let i=0;i<2;i++)
      cyl("bin", 0.035,0.035,0.06,8, q[0]+((i)?0.14:-0.09), y+2.05+((i)?0.18:-0.12),
          q[1], "#26231e", Math.PI/2, q[2], 0);
    addCol(q[0]-0.14,q[0]+0.14, q[1]-0.14,q[1]+0.14, y, y+2.3);
  }
})();
