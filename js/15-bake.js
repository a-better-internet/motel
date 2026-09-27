"use strict";
/* LOW DESERT MOTEL · 15-bake.js
   glow materials, then merge and bake every bucket
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   12 · MATERIALS FOR THE GLOWING BUCKETS, THEN BAKE EVERYTHING
   ---------------------------------------------------------------------- */
const GLOW=[];   // {m, kind}
let TVWIN_MAT=null;   // the one window with a television still on behind it
function glowMat(opts, kind){
  const m=new T.MeshStandardMaterial(Object.assign({roughness:0.5, metalness:0.0}, opts));
  GLOW.push({m:m, base:m.emissive?m.emissive.clone():new T.Color(0), kind:kind, baseInt:m.emissiveIntensity||1});
  return m;
}
function basicGlowMat(color, kind, blend){
  const m=new T.MeshBasicMaterial({color:color, transparent:true, opacity:0.0, toneMapped:false,
    depthWrite:false, blending:blend||T.NormalBlending});
  GLOW.push({m:m, kind:kind, basic:true});
  return m;
}
bucketOf("glass",  ()=>new T.MeshStandardMaterial({color:0xffffff, transparent:true, opacity:0.34,
                          roughness:0.07, metalness:0.25, side:T.DoubleSide}));
bucketOf("mirror", ()=>new T.MeshStandardMaterial({color:0xffffff, metalness:0.45, roughness:0.08,
                          emissive:0x39505c, emissiveIntensity:0.42}));
bucketOf("art",    ()=>new T.MeshStandardMaterial({color:0xffffff, roughness:0.7}));
bucketOf("bin",    ()=>new T.MeshStandardMaterial({map:TEX.enamel, roughness:0.9}));
bucketOf("bell",   ()=>new T.MeshStandardMaterial({color:0xffffff, roughness:0.3, metalness:0.75}));
bucketOf("rules",  ()=>new T.MeshStandardMaterial({color:0xffffff, roughness:0.85}));
bucketOf("clockface",()=>new T.MeshStandardMaterial({color:0xffffff, roughness:0.6}));
bucketOf("tvglass",()=>new T.MeshStandardMaterial({color:0xffffff, roughness:0.14, metalness:0.4,
                          emissive:0x0a1014}));
bucketOf("signlit",()=>new T.MeshStandardMaterial({color:0xffffff, roughness:0.7}));
bucketOf("lampshade",()=>glowMat({color:0xffffff, emissive:0xffd98a, emissiveIntensity:0.35}, "warm"));
bucketOf("ceilfix", ()=>glowMat({color:0xffffff, emissive:0xffe9c4, emissiveIntensity:0.30}, "warm"));
bucketOf("winglow", ()=>glowMat({color:0xffffff, emissive:0xffcf8a, emissiveIntensity:0.15}, "warm"));
bucketOf("tvwin",   ()=>{ TVWIN_MAT=new T.MeshBasicMaterial({color:0x000000, toneMapped:false});
                          return TVWIN_MAT; });
bucketOf("iceglow", ()=>glowMat({color:0xffffff, emissive:0x6fd2ff, emissiveIntensity:0.25}, "cool"));
bucketOf("vendglow",()=>glowMat({color:0xffffff, emissive:0xffc46a, emissiveIntensity:0.25}, "warm"));
bucketOf("niche",   ()=>glowMat({color:0xffffff, emissive:0x9fe8ff, emissiveIntensity:0.6}, "pool"));
bucketOf("bedding", ()=>new T.MeshStandardMaterial({color:0xffffff, roughness:0.98}));
bucketOf("clockled",()=>glowMat({color:0xffffff, emissive:0xff5a2a, emissiveIntensity:0.9}, "warm"));
bucketOf("neonbox", ()=>glowMat({color:0xffffff, emissive:0xff3a2a, emissiveIntensity:0.5}, "warm"));
bucketOf("fabric",  ()=>new T.MeshStandardMaterial({map:TEX.weave,  roughness:0.96}));
// Boulders were flat-shaded dodecahedra in the foliage bucket — twelve faces
// and one colour. They get their own stone map, and enough facets to read as
// rock rather than as dice.
bucketOf("rock",    ()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.rock,
                          roughness:0.97, metalness:0.0, flatShading:true}));
bucketOf("brick",   ()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.brick, roughness:0.95}));
bucketOf("walk",    ()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.sidewalk, roughness:0.96}));
// the diner car's own three
bucketOf("quilt",    ()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.quilt,
                          roughness:0.42, metalness:0.55}));
bucketOf("hexfloor", ()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.hexfloor,
                          roughness:0.88}));
bucketOf("dinertile",()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.dinertile,
                          roughness:0.52}));
bucketOf("checker", ()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.checker, roughness:0.92}));
// Cave marks have to be LIT, not emissive: the whole point is that you cannot
// see them until the torch is on them.
bucketOf("ochre",   ()=>new T.MeshStandardMaterial({color:0xffffff, roughness:1.0,
                          transparent:true, opacity:0.86, depthWrite:false}));
// soot sits at 0.16 and is meant to be barely there; forty years of fryer
// smoke up a wall is not barely there
bucketOf("grease",  ()=>new T.MeshBasicMaterial({color:0xffffff, transparent:true,
                          opacity:0.40, depthWrite:false}));
bucketOf("plank",   ()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.plank, roughness:0.72}));
bucketOf("baize",   ()=>new T.MeshStandardMaterial({color:0xffffff, roughness:0.98}));
// Fairy lights. A basic material takes its colour straight from the vertex
// and ignores the lighting entirely, which is exactly what a lit bulb does.
bucketOf("xmas",    ()=>new T.MeshBasicMaterial({vertexColors:true, toneMapped:false}));
bucketOf("paper",   ()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.paper,
                          roughness:0.97, side:T.DoubleSide}));
bucketOf("siding",  ()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.siding,
                          roughness:0.86, metalness:0.10}));
// everything left out in the sun for forty years: chalky, no shine left on it
bucketOf("weathered",()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.chalk,
                          roughness:0.95, metalness:0.04}));
bucketOf("track",   ()=>new T.MeshStandardMaterial({color:0xffffff, map:TEX.track,
                          transparent:true, roughness:1, depthWrite:false}));
bucketOf("soot",    ()=>new T.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.16,
                          map:TEX.soot, depthWrite:false, side:T.DoubleSide}));
bucketOf("rust",    ()=>new T.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.30,
                          map:TEX.streak, depthWrite:false, side:T.DoubleSide}));
bucketOf("ember",   ()=>glowMat({color:0xffffff, emissive:0xff4a12, emissiveIntensity:1.6}, "warm"));
// dust hanging in a shaft of daylight: bright at noon, gone after dark
bucketOf("haze",    ()=>{ const m=new T.MeshBasicMaterial({color:0xfff0d2, map:TEX.haze,
                          transparent:true, opacity:0, depthWrite:false, side:T.DoubleSide,
                          blending:T.AdditiveBlending, toneMapped:false});
                          GLOW.push({m:m, basic:true, day:true, max:0.055}); return m; });
bucketOf("smoke",   ()=>new T.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.10,
                          side:T.DoubleSide, depthWrite:false, toneMapped:false}));
// the pool of light a lit machine throws onto the slab in front of it
bucketOf("floorglow",()=>{ const m=new T.MeshBasicMaterial({color:0xffffff, map:TEX.soot,
                          transparent:true, opacity:0, depthWrite:false, side:T.DoubleSide,
                          blending:T.AdditiveBlending, toneMapped:false});
                          GLOW.push({m:m, kind:"warm", basic:true, max:0.34}); return m; });
bucketOf("zapper",  ()=>glowMat({color:0xffffff, emissive:0x8f5cff, emissiveIntensity:0.7}, "cool"));

/* --- picture slots: one bucket, one image, one draw call each ---------
   The canvas art below is the fallback. Name a URL in IMAGES (top of file)
   against the same key and it replaces the art at the same aspect ratio. */
const picMat=(key,long,draw,opts)=>new T.MeshStandardMaterial(Object.assign(
  {color:0xffffff, roughness:0.74, map:artTex(key,long,draw)}, opts||{}));
function washBG(x,W,H,a,b){
  const g=x.createLinearGradient(0,0,0,H); g.addColorStop(0,a); g.addColorStop(1,b);
  x.fillStyle=g; x.fillRect(0,0,W,H);
}
function mesaArt(x,W,H){                       // the print every motel has
  washBG(x,W,H,"#cfa26a","#efd7ae");
  x.fillStyle="#f2e2b6"; x.beginPath(); x.arc(W*0.70,H*0.34,H*0.13,0,7); x.fill();
  for(const L of [[0.62,"#8d5a44"],[0.72,"#a06a4c"],[0.82,"#b98a62"]]){
    x.fillStyle=L[1]; x.beginPath(); x.moveTo(0,H);
    for(let i=0;i<=14;i++){
      const u=i/14, top=H*L[0]+Math.sin(u*7.1+L[0]*9)*H*0.07-Math.sin(u*2.2)*H*0.05;
      x.lineTo(u*W, top);
    }
    x.lineTo(W,H); x.closePath(); x.fill();
  }
  x.strokeStyle="rgba(60,40,26,0.5)"; x.lineWidth=Math.max(2,H*0.012);
  x.strokeRect(H*0.02,H*0.02,W-H*0.04,H-H*0.04);
}
function capArt(x,W,H,title,sub,a,b,c){        // a park-poster kind of thing
  washBG(x,W,H,a,b);
  x.fillStyle=c; x.beginPath(); x.moveTo(0,H*0.96);
  x.lineTo(W*0.28,H*0.40); x.lineTo(W*0.48,H*0.70); x.lineTo(W*0.70,H*0.30);
  x.lineTo(W,H*0.74); x.lineTo(W,H*0.96); x.closePath(); x.fill();
  x.fillStyle="rgba(20,16,12,0.72)"; x.fillRect(0,H*0.78,W,H*0.22);
  x.fillStyle="#f1ead6"; fitText(x,title, W*0.86, H*0.13, W/2, H*0.865);
  x.fillStyle="#d9c27a"; fitText(x,sub,   W*0.70, H*0.075, W/2, H*0.955);
}
// Six gig posters, each its own slot, so you can hang your own six. The
// canvas art below is what is up until you name a URL against poster:0..5.
const POSTER_BG=["#c8202a","#f0a01e","#1d6f4e","#2b2f7a","#d24a12","#151515"];
const POSTER_FG=["#f4e8c8","#151515","#f2ecd6","#f0c93a","#f7eede","#e8402a"];
const POSTER_NAMES=[["The","Desert","Rats"],["Salt","Flats","Revue"],["Duo","De","Nada"],
                    ["Black","Mesa","Boys"],["Low","Beam","Tonight"],["Night","Shift",""]];
const posterArt=i=>(x,W,H)=>{
  x.fillStyle=POSTER_BG[i]; x.fillRect(0,0,W,H);
  x.fillStyle=POSTER_FG[i];
  for(let k=0;k<7;k++){                       // a screen-printed shape behind the type
    x.globalAlpha=0.10+((k*7)%5)*0.04;
    x.beginPath();
    x.arc(W*(0.2+((k*13)%7)/9), H*(0.25+((k*29)%5)/7), W*(0.10+((k*17)%60)/260), 0, 7);
    x.fill();
  }
  x.globalAlpha=1; x.textAlign="center";
  POSTER_NAMES[i].forEach((line,k)=>{
    if(!line) return;
    fitSerif(x, line, W*(k===1?0.86:0.76), H*(k===1?0.19:0.13), W/2, H*(0.30+k*0.20), "900");
  });
  x.font="700 "+Math.round(H*0.045)+"px 'JetBrains Mono', monospace";
  x.fillText("The Rusty Canteen", W/2, H*0.90);
  x.globalAlpha=0.5; x.fillRect(W*0.18, H*0.935, W*0.64, Math.max(1,H*0.006)); x.globalAlpha=1;
  for(let k=0;k<90;k++){                      // sun and cigarettes
    x.fillStyle="rgba(0,0,0,"+(Math.random()*0.10).toFixed(3)+")";
    x.fillRect(Math.random()*W, Math.random()*H, 1+Math.random()*3, 1+Math.random()*3);
  }
};
for(let k=0;k<6;k++) bucketOf("pic:poster:"+k,
  ()=>picMat("poster:"+k, 700, posterArt(k), {side:T.DoubleSide, roughness:0.92}));
// the one thing anybody who worked a dish this far out would have pinned up
const believeArt=(x,W,H)=>{
  const g=x.createLinearGradient(0,0,0,H);
  g.addColorStop(0,"#1c2b3c"); g.addColorStop(0.62,"#3c5468"); g.addColorStop(1,"#20303c");
  x.fillStyle=g; x.fillRect(0,0,W,H);
  for(let i=0;i<220;i++){                     // stars in the upper half
    x.fillStyle="rgba(228,238,246,"+(0.12+Math.random()*0.5).toFixed(2)+")";
    x.fillRect(Math.random()*W, Math.random()*H*0.56, 1, 1);
  }
  const cx=W*0.50, cy=H*0.36, r=W*0.24;
  x.save();                                   // the beam, under the saucer
  x.globalAlpha=0.20; x.fillStyle="#cfe6f2";
  x.beginPath(); x.moveTo(cx-r*0.30, cy+r*0.18); x.lineTo(cx+r*0.30, cy+r*0.18);
  x.lineTo(cx+r*1.05, H*0.70); x.lineTo(cx-r*1.05, H*0.70); x.closePath(); x.fill();
  x.restore();
  x.fillStyle="#11181f";                      // hull
  x.beginPath(); x.ellipse(cx, cy+r*0.10, r, r*0.26, 0, 0, 7); x.fill();
  x.beginPath(); x.ellipse(cx, cy-r*0.10, r*0.46, r*0.28, 0, 0, 7); x.fill();
  for(let i=-3;i<=3;i++){                     // lamps along the rim
    x.fillStyle=(i%2)?"#ffd27a":"#9fe8ff";
    x.beginPath(); x.arc(cx+i*r*0.27, cy+r*0.22, r*0.045, 0, 7); x.fill();
  }
  x.fillStyle="#0d1418";                      // a treeline to give it scale
  x.beginPath(); x.moveTo(0,H*0.80);
  for(let i=0;i<=26;i++){
    const u=i/26, t=H*0.80-Math.abs(Math.sin(u*11.3))*H*0.055-((i*7)%3)*H*0.012;
    x.lineTo(u*W, t);
  }
  x.lineTo(W,H); x.lineTo(0,H); x.closePath(); x.fill();
  // Letter-spaced by hand, and sized to fit: seventeen characters plus
  // their tracking runs well past a 5:7 canvas at any font picked by eye,
  // so measure the whole line and come down until it sits inside the page.
  x.fillStyle="#eef3f6"; x.textAlign="center"; x.textBaseline="middle";
  const word="I WANT TO BELIEVE", inner=W*0.86;
  let fs=Math.round(H*0.075), s2=0, tw=0;
  do{
    fs-=1; s2=fs*0.20; tw=0;
    x.font="700 "+fs+"px Helvetica, Arial, sans-serif";
    for(const ch of word) tw+=x.measureText(ch).width+s2;
    tw-=s2;
  } while(tw>inner && fs>7);
  let px=(W-tw)/2;
  for(const ch of word){ const cw=x.measureText(ch).width;
                         x.fillText(ch, px+cw/2, H*0.90); px+=cw+s2; }
  for(let k=0;k<70;k++){                      // sun and damp
    x.fillStyle="rgba(0,0,0,"+(Math.random()*0.10).toFixed(3)+")";
    x.fillRect(Math.random()*W, Math.random()*H, 1+Math.random()*4, 1+Math.random()*4);
  }
};
bucketOf("pic:believe", ()=>picMat("believe", 700, believeArt,
  {side:T.DoubleSide, roughness:0.94}));
// the pass board: what the dish was pointed at, plotted by hand and left up
const passArt=(x,W,H)=>{
  x.fillStyle="#17201f"; x.fillRect(0,0,W,H);
  x.strokeStyle="rgba(120,168,150,0.22)"; x.lineWidth=1;
  for(let i=1;i<16;i++){ x.beginPath(); x.moveTo(W*i/16,0); x.lineTo(W*i/16,H); x.stroke(); }
  for(let i=1;i<10;i++){ x.beginPath(); x.moveTo(0,H*i/10); x.lineTo(W,H*i/10); x.stroke(); }
  x.strokeStyle="rgba(150,200,178,0.55)"; x.lineWidth=2;
  x.strokeRect(W*0.06, H*0.16, W*0.88, H*0.66);
  x.strokeStyle="#e8b44a"; x.lineWidth=3;     // the arc of a pass
  x.beginPath();
  for(let i=0;i<=40;i++){
    const u=i/40, px=W*0.06+u*W*0.88, py=H*0.82-Math.sin(u*Math.PI)*H*0.58;
    i?x.lineTo(px,py):x.moveTo(px,py);
  }
  x.stroke();
  x.fillStyle="#e8b44a";
  for(let i=1;i<8;i++){ const u=i/8;
    x.beginPath(); x.arc(W*0.06+u*W*0.88, H*0.82-Math.sin(u*Math.PI)*H*0.58, 3, 0, 7); x.fill(); }
  x.fillStyle="#9fd3bd"; x.textAlign="left"; x.textBaseline="middle";
  x.font="600 "+Math.round(H*0.075)+"px Helvetica, Arial, sans-serif";
  x.fillText("ELEVATION \u00b7 AZIMUTH", W*0.06, H*0.085);
  x.textAlign="right"; x.fillText("PASS 4417", W*0.94, H*0.085);
  x.font="500 "+Math.round(H*0.055)+"px Helvetica, Arial, sans-serif";
  x.textAlign="center";
  for(let i=0;i<=8;i+=2)
    x.fillText(String(i*45).padStart(3,"0"), W*0.06+(i/8)*W*0.88, H*0.92);
  for(let k=0;k<50;k++){
    x.fillStyle="rgba(0,0,0,"+(Math.random()*0.12).toFixed(3)+")";
    x.fillRect(Math.random()*W, Math.random()*H, 1+Math.random()*5, 1+Math.random()*3);
  }
};
bucketOf("pic:passboard", ()=>picMat("passboard", 768, passArt,
  {side:T.DoubleSide, roughness:0.86}));
bucketOf("pic:artWide",       ()=>picMat("artWide", 768, mesaArt));
bucketOf("pic:artLand:room",  ()=>picMat("artLand:room", 640,
  (x,W,H)=>capArt(x,W,H,"CARLSBAD CAVERNS","NEW MEXICO","#2b3f5c","#6d5f7a","#1d2733")));
bucketOf("pic:artLand:office",()=>picMat("artLand:office", 768,
  (x,W,H)=>capArt(x,W,H,"THE PAINTED DESERT","ARIZONA","#7e4a2c","#e0b271","#5a2f1e")));
bucketOf("pic:artPort",       ()=>picMat("artPort", 640,
  (x,W,H)=>capArt(x,W,H,"ROUTE 66","THE MOTHER ROAD","#1e3a52","#b98a52","#12202b")));
const tvArt=(x,W,H)=>{                    // the fallback: a set showing nothing
  x.fillStyle="#101619"; x.fillRect(0,0,W,H);
  for(let i=0;i<2400;i++){ const g=Math.random()*46|0;
    x.fillStyle="rgb("+(g+10)+","+(g+14)+","+(g+18)+")";
    x.fillRect(Math.random()*W, Math.random()*H, 2,2); }
  const gl=x.createLinearGradient(0,0,W*0.6,H); gl.addColorStop(0,"rgba(210,225,235,0.16)");
  gl.addColorStop(0.5,"rgba(210,225,235,0.03)"); gl.addColorStop(1,"rgba(0,0,0,0)");
  x.fillStyle=gl; x.fillRect(0,0,W,H);
};
// four screens, dealt out across the rooms, so no two sets down a walkway are
// showing the same thing
for(let k=0;k<4;k++) bucketOf("pic:tv:"+k,
  ()=>picMat("tv:"+k, 512, tvArt, {roughness:0.18, metalness:0.35}));
const brochureArt=(title,tint)=>(x,W,H)=>{
  x.fillStyle="#efe9d8"; x.fillRect(0,0,W,H);
  x.fillStyle=tint; x.fillRect(0,0,W,H*0.44);
  x.fillStyle="rgba(255,255,255,0.22)";
  for(let i=0;i<5;i++) x.fillRect(0,H*(0.10+i*0.06),W,H*0.02);
  x.fillStyle="#f1ead6"; fitText(x,title, W*0.84, H*0.075, W/2, H*0.34);
  x.fillStyle=tint;     fitText(x,"OPEN DAILY", W*0.74, H*0.05, W/2, H*0.54);
  x.fillStyle="#8a8272";
  for(let i=0;i<7;i++) x.fillRect(W*0.12, H*(0.62+i*0.045), W*(0.30+Math.random()*0.46), H*0.014);
};
const BROCHURE_ART=[["CAVERNS TOUR","#2f6c82"],["TRADING POST","#9c4a24"],
                    ["GHOST TOWN","#4f6b3a"],["INDIAN CITY","#8a5a1e"],
                    ["LAKE CRUISES","#2f5c8a"],["GUN MUSEUM","#7a3a3a"],
                    ["SNAKE FARM","#6b8a3a"],["MERAMEC CAVERNS","#2f6c82"],
                    ["PETRIFIED FOREST","#8a5a1e"],["JACKRABBIT","#9c4a24"]];
for(let k=0;k<10;k++) bucketOf("pic:brochure:"+k,
  ()=>picMat("brochure:"+k, 384, brochureArt(BROCHURE_ART[k][0], BROCHURE_ART[k][1])));
bucketOf("pic:postcard",   ()=>picMat("postcard", 384, (x,W,H)=>{
  washBG(x,W,H,"#6fb8d6","#e6cf9e");
  x.fillStyle="#9c6a44"; x.fillRect(0,H*0.56,W,H*0.44);
  x.fillStyle="#c3562f"; fitText(x,"GREETINGS", W*0.82, H*0.09, W/2, H*0.24);
  x.fillStyle="#13405e"; fitText(x,"FROM NEW MEXICO", W*0.86, H*0.06, W/2, H*0.36);
  x.strokeStyle="#f1ead6"; x.lineWidth=Math.max(2,W*0.03); x.strokeRect(0,0,W,H);
}));
const vendArt=(head,tint,rows)=>(x,W,H)=>{
  x.fillStyle="#1a1c1e"; x.fillRect(0,0,W,H);
  x.fillStyle=tint; x.fillRect(0,0,W,H*0.20);
  x.fillStyle="#f6f1e2"; fitText(x,head, W*0.80, H*0.085, W/2, H*0.105);
  for(let r=0;r<rows;r++) for(let c2=0;c2<4;c2++){
    const bw=W*0.19, bh=H*(0.62/rows)*0.72;
    x.fillStyle=["#c3562f","#3f6ea8","#4f7a4a","#c9a24b","#8a3f6e"][(r*4+c2)%5];
    x.fillRect(W*0.06+c2*(bw+W*0.045), H*0.26+r*(H*0.62/rows), bw, bh);
  }
  x.fillStyle="#2a2d30"; x.fillRect(W*0.06,H*0.90,W*0.88,H*0.07);
};
// a machine front is a picture that lights up: the same texture drives the
// emissive channel, so the artwork itself is what glows after dark
const picGlowMat=(key,long,draw,kind)=>{
  const tex=artTex(key,long,draw);
  const m=new T.MeshStandardMaterial({color:0xffffff, roughness:0.58, map:tex,
    emissive:0xffffff, emissiveMap:tex, emissiveIntensity:0});
  GLOW.push({m:m, base:new T.Color(0xffffff), kind:kind||"warm", baseInt:0.22});
  return m;
};
bucketOf("pic:vendFront:snack", ()=>picGlowMat("vendFront:snack", 512, vendArt("SNACKS","#b8332a",5)));
bucketOf("pic:vendFront:soda",  ()=>picGlowMat("vendFront:soda", 512, vendArt("ICE COLD","#2f5c8a",3), "cool"));

const BAKED=bakeBuckets(scene);
buildColGrid();                     // everything solid is in place by now

/* --- roof-mounted swamp coolers and vents, added after the bake ------ */
(function rooftopClutter(){
  const g=[], metalC=new T.Color(0x9aa1a6);
  const m4=(x,y,z,w,h,d)=>({geo:boxGeo(w,h,d,0.4),
    matrix:new T.Matrix4().makeTranslation(x,y,z), color:metalC});
  const yTop=lvlY(1)+WALL_H1;
  for(let i=1;i<NORTH.bays;i+=2) g.push(m4(-27+i*BAY_W, yTop+1.30, NORTH.z+4.2, 1.0,0.8,1.0));
  for(let i=1;i<EAST.bays;i+=2)  g.push(m4(EAST.x+4.2, yTop+1.60, EAST.z0+i*BAY_W, 1.0,0.8,1.0));
  const mesh=new T.Mesh(mergeEntries(g), new T.MeshStandardMaterial({vertexColors:true,
    roughness:0.45, metalness:0.6}));
  mesh.castShadow=true; scene.add(mesh);
})();
