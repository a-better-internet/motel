"use strict";
/* LOW DESERT MOTEL · 05-sky.js
   sky dome, stars, sun, moon, clouds, traffic
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   5 · SKY DOME, STARS, SUN & MOON  (ported from the Project 76 sandbox)
   ---------------------------------------------------------------------- */
let skyDome, skyCtx, skyTex;
const skyImg={top:new T.Color(), mid:new T.Color(), low:new T.Color(), hz:new T.Color()};
const _skyMix=new T.Color();   // scratch for the interpolated gradient stops
(function buildSky(){
  const c=cvs(16,256); skyCtx=c.getContext("2d");
  skyTex=setSRGB(new T.CanvasTexture(c));
  skyDome=new T.Mesh(new T.SphereGeometry(2400,26,18),
    new T.MeshBasicMaterial({map:skyTex, side:T.BackSide, fog:false, depthWrite:false}));
  scene.add(skyDome);
})();
/* --- stars -------------------------------------------------------------
   A single field of identical white dots reads as static and flat. Real sky
   has depth because it has three things this does now: a magnitude
   distribution (a handful of bright stars, a great many faint ones), colour
   temperature (blue-white through orange), and the Milky Way running across
   it. Each magnitude class is its own Points layer so it can carry its own
   pixel size and its own twinkle phase, and the whole lot hangs off a tilted
   pivot that wheels with the clock, the way the sky actually turns.       */
let starSky, starPivot;
const STAR_LAYERS=[];
function starSprite(cross){
  const c=cvs(64,64), x=c.getContext("2d");
  if(cross){                                    // diffraction spikes, bright stars only
    x.strokeStyle="rgba(255,255,255,0.30)"; x.lineWidth=1.4;
    x.beginPath(); x.moveTo(32,5); x.lineTo(32,59); x.moveTo(5,32); x.lineTo(59,32); x.stroke();
  }
  const g=x.createRadialGradient(32,32,0,32,32,30);
  g.addColorStop(0.00,"rgba(255,255,255,1)");
  g.addColorStop(0.14,"rgba(255,255,255,0.92)");
  g.addColorStop(0.30,"rgba(255,255,255,0.30)");
  g.addColorStop(0.62,"rgba(255,255,255,0.06)");
  g.addColorStop(1.00,"rgba(255,255,255,0)");
  x.globalCompositeOperation="lighter";
  x.fillStyle=g; x.fillRect(0,0,64,64);
  return setSRGB(new T.CanvasTexture(c));
}
(function buildStars(){
  const R=2250;
  // the galactic plane: a great circle tilted off the celestial equator
  const gi=1.05, GA=V3(Math.cos(gi),Math.sin(gi),0).normalize();   // pole of the band
  const GU=V3(0,0,1).cross(GA).normalize(), GV=GA.clone().cross(GU).normalize();
  // B through M, weighted the way the naked-eye sky is: mostly white and straw
  const TINT=[[0.66,0.76,1.00],[0.80,0.87,1.00],[1.00,1.00,1.00],[1.00,1.00,1.00],
              [1.00,0.96,0.86],[1.00,0.90,0.74],[1.00,0.80,0.62],[1.00,0.68,0.52]];
  const tex=starSprite(false), texX=starSprite(true);
  // pos on the dome, optionally pulled toward the galactic plane
  function place(pos,i,band){
    let d;
    if(band){                                   // within a few degrees of the plane
      const a=rnd()*Math.PI*2, off=(rnd()+rnd()+rnd()-1.5)*band;
      d=GU.clone().multiplyScalar(Math.cos(a)).addScaledVector(GV,Math.sin(a))
         .addScaledVector(GA,off).normalize();
    }else{
      const th=rnd()*Math.PI*2, ph=Math.acos(2*rnd()-1);
      d=V3(Math.sin(ph)*Math.cos(th), Math.cos(ph), Math.sin(ph)*Math.sin(th));
    }
    pos[i*3]=d.x*R; pos[i*3+1]=d.y*R; pos[i*3+2]=d.z*R;
  }
  function layer(n, size, gamma, lo, opacity, sprite, band, sat){
    const pos=new Float32Array(n*3), col=new Float32Array(n*3);
    for(let i=0;i<n;i++){
      place(pos,i, band);
      const t=TINT[(rnd()*TINT.length)|0], b=lo+(1-lo)*Math.pow(rnd(), gamma);
      col[i*3]  =(1+(t[0]-1)*sat)*b;
      col[i*3+1]=(1+(t[1]-1)*sat)*b;
      col[i*3+2]=(1+(t[2]-1)*sat)*b;
    }
    const g=new T.BufferGeometry();
    g.setAttribute("position", new T.BufferAttribute(pos,3));
    g.setAttribute("color",    new T.BufferAttribute(col,3));
    const pts=new T.Points(g, new T.PointsMaterial({map:sprite, vertexColors:true,
      size:size, sizeAttenuation:false, transparent:true, opacity:0, depthWrite:false,
      fog:false, blending:T.AdditiveBlending, toneMapped:false}));
    pts.frustumCulled=false;
    STAR_LAYERS.push({p:pts, base:opacity, ph:rnd()*9, sp:0.6+rnd()*1.5});
    return pts;
  }
  starSky=new T.Group();
  starSky.add(layer(2400, 2.8, 2.6, 0.22, 0.92, tex,  0,     0.75));  // the faint majority
  starSky.add(layer( 900, 3.0, 2.3, 0.24, 0.80, tex,  0.30,  0.80));  // thicker on the band
  starSky.add(layer( 320, 5.4, 1.7, 0.42, 1.00, tex,  0,     0.95));  // second magnitude
  starSky.add(layer(  52,10.0, 1.0, 0.68, 1.00, texX, 0,     1.00));  // the named ones
  // the galactic haze only just shows — a suggestion of the band, not a stripe
  starSky.add(layer( 420,22.0, 1.4, 0.10, 0.075, tex, 0.22,  0.30));
  starPivot=new T.Group();
  starPivot.rotation.x=0.96;                     // the pole, ~35 deg above the horizon
  starPivot.add(starSky); scene.add(starPivot);
})();
let sunDisc, moonDisc;
const SUN_HIGH=new T.Color(0xfff4d6), SUN_LOW=new T.Color(0xff6f28);
(function buildCelestials(){
  const disc=stops=>{
    const c=cvs(128,128), x=c.getContext("2d");
    const g=x.createRadialGradient(64,64,0,64,64,64);
    for(const s of stops) g.addColorStop(s[0],s[1]);
    x.fillStyle=g; x.fillRect(0,0,128,128);
    return setSRGB(new T.CanvasTexture(c));
  };
  const mk=(tex,size)=>{
    const sp=new T.Sprite(new T.SpriteMaterial({map:tex, transparent:true, depthWrite:false,
      fog:false, blending:T.AdditiveBlending}));
    sp.scale.set(size,size,1); scene.add(sp); return sp;
  };
  sunDisc=mk(disc([[0,"rgba(255,255,255,1)"],[0.16,"rgba(255,246,220,0.96)"],
    [0.30,"rgba(255,198,124,0.42)"],[0.60,"rgba(255,150,80,0.12)"],[1,"rgba(255,140,70,0)"]]), 320);
  moonDisc=mk(disc([[0,"rgba(255,255,255,1)"],[0.30,"rgba(226,236,255,0.9)"],
    [0.42,"rgba(160,185,230,0.22)"],[1,"rgba(120,150,210,0)"]]), 150);
})();
const _celDir=new T.Vector3();
function placeCelestial(sp, ang, sign, zBias){
  _celDir.set(Math.cos(ang)*sign, Math.sin(ang)*sign, zBias*sign).normalize();
  sp.position.copy(camera.position).addScaledVector(_celDir, 1800);
  return _celDir.y;
}

/* --- clouds, birds and the odd car on the highway ---------------------- */
const CLOUDS=[], CIRRUS=[], ALTO=[], BIRDS=[], BALLOONS=[], WHITE_C=new T.Color(0xffffff);
let VULTURE=null;              // one bird, a long way up, and not always there
const NIGHT_HAZE=new T.Color(0x0a1020);        // haze colour once the sun is gone
(function buildSky2(){
  // A cumulus is a row of lobes on a flat base, lit from above and shaded
  // underneath. Drawing it that way — mass, then a shaded base, then sunlit
  // tops, then cutting the base flat — reads as weather rather than as fog.
  // One generative model rather than four recognisable archetypes: every cloud
  // picks its own point in a four-axis space — how far it spreads, how much it
  // towers, how broken it is, how much its top shears downwind — so no two
  // read as the same shape. The silhouette is then eroded with a tiling noise
  // field instead of punched with circles, which is what was leaving those
  // negative-space holes: subtracting a proportion of alpha thins the soft rim
  // into wisps and barely touches the solid core, which is how a cloud edge
  // actually behaves.
  const CLOUD_NOISE=(function(){
    const N=256, c=cvs(N,N), x=c.getContext("2d"), img=x.createImageData(N,N);
    const h=(i,j)=>{ const k=Math.sin(i*127.1+j*311.7)*43758.5453; return k-Math.floor(k); };
    const oct=(u,v,f)=>{                              // tiling value noise
      const uu=u*f, vv=v*f, i0=Math.floor(uu), j0=Math.floor(vv);
      const fu=uu-i0, fv=vv-j0, su=fu*fu*(3-2*fu), sv=fv*fv*(3-2*fv);
      const m=(a,b,t)=>a+(b-a)*t, w=(a)=>((a%f)+f)%f;
      const a=h(w(i0),w(j0)), b=h(w(i0+1),w(j0)), cc=h(w(i0),w(j0+1)), d=h(w(i0+1),w(j0+1));
      return m(m(a,b,su), m(cc,d,su), sv);
    };
    for(let j2=0;j2<N;j2++) for(let i2=0;i2<N;i2++){
      const u=i2/N, v=j2/N;
      let n=oct(u,v,4)*0.5+oct(u,v,8)*0.28+oct(u,v,16)*0.14+oct(u,v,32)*0.08;
      n=Math.pow(Math.max(0,(n-0.30)/0.70), 1.9);     // mostly gentle, sometimes a real bite
      const o=(j2*N+i2)*4;
      img.data[o]=img.data[o+1]=img.data[o+2]=0;
      img.data[o+3]=Math.min(255, n*255);
    }
    x.putImageData(img,0,0);
    return c;
  })();
  function cumulusTex(seed){
    let sd=seed*9301+7;
    const r2=()=>{ sd=(sd*9301+49297)%233280; return sd/233280; };
    // the four axes, drawn independently for every cloud
    const spread=0.35+r2()*0.65, tower=Math.pow(r2(),1.7), rag=Math.pow(r2(),1.5),
          shear=(r2()-0.5)*1.7*tower;
    const W=448, H=Math.round(180+tower*210), M=26, IW=W-M*2;
    const base=H-M-12;
    const c=cvs(W,H), x=c.getContext("2d");
    const lobes=[];
    const put=(lx,ly,lr)=>{
      const r=Math.min(lr, lx-M, W-M-lx, ly-M, base+12-ly+lr*0.9);
      if(r>13) lobes.push({x:lx, y:ly, r:r});   // pellets read as debris, drop them
    };
    // the heap along the base: a hump curve with its own skew and wobble
    const n=Math.round(5+spread*9+rag*6), skew=(r2()-0.5)*0.9, cxx=M+IW*(0.30+r2()*0.40);
    for(let i=0;i<n;i++){
      if(rag>0.45 && r2()<rag*0.34) continue;            // broken ones lose lobes
      const t=n>1?i/(n-1):0.5;
      const hump=Math.pow(Math.sin(t*Math.PI), 0.7+skew*0.5);
      const lr=(15+hump*(26+spread*22))*(1-rag*0.34)+r2()*14;
      put(M+IW*0.05+t*IW*0.90+(r2()-0.5)*20*(1+rag),
          base-lr*0.5-hump*(8+tower*26)*r2()-rag*r2()*lr*0.34, lr);
    }
    // and, if it is building, a stack of rounded tiers leaning downwind. The
    // old version tapered by 20% a tier and finished on a 10 px lobe, and then
    // scattered a few small ones above that — which is what the horns poking
    // out of the tops were. Tiers now barely narrow, and the stack is closed
    // by a cap lobe wider than anything beneath it, so the silhouette always
    // rolls over into a dome. Nothing is ever drawn above the cap.
    if(tower>0.18){
      const tiers=2+Math.round(tower*2.6);
      let y=base-30-tower*20, r=34+tower*26, lean=0;
      for(let lvl=0; lvl<tiers && y>M+r*1.35; lvl++){
        lean += shear*r*0.26;
        const cl=2+((r2()*2)|0);
        for(let k=0;k<cl;k++)
          put(cxx+lean+(k-(cl-1)/2)*r*0.52, y+(r2()-0.5)*r*0.10, r*(0.88+r2()*0.16));
        y -= r*(0.40+r2()*0.09);
        r *= 0.91-r2()*0.05;
      }
      put(cxx+lean, y+r*0.30, r*1.14);                   // the cap
    }
    // Nothing floats free of the mass. The ends of the base heap used to land
    // small and clear of their neighbours, which read as pellets beside the
    // cloud rather than part of it.
    if(lobes.length>4){
      let bigI=0; for(let i=1;i<lobes.length;i++) if(lobes[i].r>lobes[bigI].r) bigI=i;
      const big=lobes[bigI];
      for(let i=lobes.length-1;i>=0;i--){
        const L=lobes[i]; if(L===big) continue;
        let touch=false;
        for(const O of lobes)
          if(O!==L && Math.hypot(O.x-L.x, O.y-L.y) < (O.r+L.r)*0.62){ touch=true; break; }
        if(!touch) lobes.splice(i,1);
      }
    }
    for(const L of lobes){                                    // the mass
      const g=x.createRadialGradient(L.x, L.y-L.r*0.16, L.r*0.10, L.x, L.y, L.r);
      g.addColorStop(0.00,"rgba(255,255,255,1.00)");
      g.addColorStop(0.58,"rgba(255,255,255,0.94)");
      g.addColorStop(0.86,"rgba(255,255,255,0.44)");
      g.addColorStop(1.00,"rgba(255,255,255,0)");
      x.fillStyle=g; x.beginPath(); x.arc(L.x,L.y,L.r,0,7); x.fill();
    }
    // erode with noise at two scales — organic, never a circular hole
    x.globalCompositeOperation="destination-out";
    for(const pass of [[1.0+r2()*0.7, 0.34+rag*0.30], [2.3+r2()*1.6, 0.20+rag*0.24]]){
      const sw=256/pass[0], sh=256/pass[0];
      x.globalAlpha=pass[1];
      x.drawImage(CLOUD_NOISE, r2()*(256-sw), r2()*(256-sh), sw, sh, 0, 0, W, H);
    }
    x.globalAlpha=1;
    x.globalCompositeOperation="source-atop";               // shaded underside
    const sg=x.createLinearGradient(0, base-70-tower*40, 0, base+10);
    sg.addColorStop(0,"rgba(150,166,192,0)");
    sg.addColorStop(0.62,"rgba(126,142,172,0.46)");
    sg.addColorStop(1,"rgba(104,120,152,0.74)");
    x.fillStyle=sg; x.fillRect(0,0,W,H);
    x.globalCompositeOperation="lighter";                   // sunlit tops
    for(const L of lobes){
      const hx=L.x-L.r*0.22, hy=L.y-L.r*0.50, hr=L.r*0.76;
      const g=x.createRadialGradient(hx,hy,0,hx,hy,hr);
      g.addColorStop(0,"rgba(255,252,240,0.30)");
      g.addColorStop(1,"rgba(255,252,240,0)");
      x.fillStyle=g; x.beginPath(); x.arc(hx,hy,hr,0,7); x.fill();
    }
    x.globalCompositeOperation="destination-out";           // the base, cut soft
    const cutTop=base-(10+rag*22);
    const eg=x.createLinearGradient(0, cutTop, 0, base+20);
    eg.addColorStop(0,"rgba(0,0,0,0)"); eg.addColorStop(0.55,"rgba(0,0,0,0.55)");
    eg.addColorStop(1,"rgba(0,0,0,1)");
    x.fillStyle=eg; x.fillRect(0,cutTop,W,H-cutTop);
    x.globalCompositeOperation="source-over";
    const tex=setSRGB(new T.CanvasTexture(c));
    if(r2()<0.5){ tex.wrapS=T.RepeatWrapping; tex.repeat.x=-1; tex.offset.x=1; }
    return {tex:tex, aspect:H/W, tower:tower, spread:spread};
  }
  function cirrusTex(seed){
    const W=512, H=128, c=cvs(W,H), x=c.getContext("2d");
    let sd=seed*4133+11;
    const r2=()=>{ sd=(sd*9301+49297)%233280; return sd/233280; };
    const dir=r2()<0.5?1:-1, dens=22+((r2()*22)|0);
    x.lineCap="round";
    for(let i=0;i<dens;i++){
      const y0c=22+r2()*84, len=70+r2()*260, x0c=18+r2()*(W-len-36);
      x.strokeStyle="rgba(255,255,255,"+(0.04+r2()*0.12).toFixed(3)+")";
      x.lineWidth=1.2+r2()*6;
      x.beginPath(); x.moveTo(x0c,y0c);
      x.bezierCurveTo(x0c+len*0.3, y0c-dir*(6+r2()*14), x0c+len*0.7, y0c+dir*(5+r2()*11),
                      x0c+len, y0c-dir*2);
      x.stroke();
    }
    return setSRGB(new T.CanvasTexture(c));
  }
  // Distance is what keeps a cloud from looming. Cumulus bases sit around a
  // mile up, not two hundred metres, and the big ones belong out near the
  // horizon where a sprite's flatness does not show.
  // They drift along x, so z is what sets how close one can ever come. Keeping
  // a floor under |z| is what stops a big one from ending up overhead, and the
  // bigger it is the further out it starts.
  for(let i=0;i<44;i++){
    const t=cumulusTex(i*37+3);
    const m=new T.SpriteMaterial({map:t.tex, transparent:true, depthWrite:false,
      fog:false, opacity:0.0});
    const sp=new T.Sprite(m);
    const big=Math.max(t.tower, t.spread*0.8);
    const sc=240+big*1250+Math.random()*260;
    sp.scale.set(sc, sc*t.aspect, 1);
    const zMin=420+big*820, zMax=zMin+700+big*900;
    const oz=(Math.random()<0.5?-1:1)*(zMin+Math.random()*(zMax-zMin));
    sp.position.set((Math.random()*2-1)*2100, 600+big*760+Math.random()*420, oz);
    // They are pinned to the camera in x and z. Loose in the world they drifted
    // past the 2400 m sky dome and the far plane and vanished mid-sky; at this
    // altitude and distance the parallax you lose by pinning them is nothing.
    scene.add(sp); CLOUDS.push({s:sp, sp:1.2+Math.random()*1.8, ox:sp.position.x, oz:oz});
  }
  // altocumulus: a raft of small flecks in rows, pitched between the cumulus
  // tops and the cirrus. It is the deck that gives the sky a middle distance.
  function altoTex(seed){
    const W=512, H=256, c=cvs(W,H), x=c.getContext("2d");
    let sd=seed*7717+29;
    const r2=()=>{ sd=(sd*9301+49297)%233280; return sd/233280; };
    const rows=5+((r2()*4)|0), tilt=(r2()-0.5)*0.24;
    for(let r=0;r<rows;r++){
      const ry=30+r*((H-60)/rows)+(r2()-0.5)*14;
      const n=9+((r2()*9)|0);
      for(let k=0;k<n;k++){
        const fx=20+r2()*(W-40), fy=ry+(fx-W/2)*tilt+(r2()-0.5)*12;
        const fw=8+r2()*26, fh=fw*(0.34+r2()*0.26);
        const g=x.createRadialGradient(fx,fy-fh*0.2,0, fx,fy,fw);
        g.addColorStop(0.00,"rgba(255,255,255,"+(0.34+r2()*0.34).toFixed(2)+")");
        g.addColorStop(0.55,"rgba(248,250,255,0.26)");
        g.addColorStop(1.00,"rgba(236,242,252,0)");
        x.fillStyle=g;
        x.save(); x.translate(fx,fy); x.scale(1, fh/fw); x.beginPath();
        x.arc(0,0,fw,0,7); x.fill(); x.restore();
      }
    }
    x.globalCompositeOperation="destination-out";     // fade the raft at its edges
    const eg=x.createRadialGradient(W/2,H/2,H*0.22, W/2,H/2,W*0.52);
    eg.addColorStop(0,"rgba(0,0,0,0)"); eg.addColorStop(1,"rgba(0,0,0,1)");
    x.fillStyle=eg; x.fillRect(0,0,W,H);
    return setSRGB(new T.CanvasTexture(c));
  }
  for(let i=0;i<14;i++){
    const m=new T.SpriteMaterial({map:altoTex(i*61+7), transparent:true, depthWrite:false,
      fog:false, opacity:0.0});
    const sp=new T.Sprite(m), sc=900+Math.random()*700;
    sp.scale.set(sc, sc*0.5, 1);
    const oz=(Math.random()<0.5?-1:1)*(600+Math.random()*1700);
    sp.position.set((Math.random()*2-1)*2200, 1400+Math.random()*700, oz);
    scene.add(sp); ALTO.push({s:sp, sp:1.0+Math.random()*1.0, ox:sp.position.x, oz:oz});
  }
  for(let i=0;i<14;i++){
    const m=new T.SpriteMaterial({map:cirrusTex(i*53+9), transparent:true, depthWrite:false,
      fog:false, opacity:0.0});
    const sp=new T.Sprite(m), sc=1400+Math.random()*900;
    sp.scale.set(sc, sc*0.25, 1);
    const oz=(Math.random()<0.5?-1:1)*(700+Math.random()*1500);
    sp.position.set((Math.random()*2-1)*2200, 2200+Math.random()*900, oz);
    scene.add(sp); CIRRUS.push({s:sp, sp:0.9+Math.random()*0.8, ox:sp.position.x, oz:oz});
  }
  /* --- balloons ---------------------------------------------------------
     They were four to nine kilometres out and three hundred metres tall,
     which put most of them past the far plane — so they came and went, and
     the ones you could see were clipped by it. They are real size now, about
     nineteen metres across and twenty-six tall, flying at a hundred to three
     hundred metres, seven hundred to eighteen hundred metres out. That is a
     shape a degree or so wide: small, unmistakable, and properly far away.
     They still only fade in once you have walked away from the motel.      */
  const BALLOON_SKINS=[["#c3311f","#f1ead6","#13405e"],["#e0a52a","#3f6ea8","#f1ead6"],
                       ["#4f7a4a","#e0d24a","#c3562f"]];
  for(let i=0;i<5;i++){
    const pal2=BALLOON_SKINS[i%BALLOON_SKINS.length], c=cvs(128,180), x=c.getContext("2d");
    for(let k=0;k<9;k++){                         // gores, alternating colours
      const a0=Math.PI*(k/9), a1=Math.PI*((k+1)/9);
      x.fillStyle=pal2[k%pal2.length];
      x.beginPath();
      for(let t=0;t<=12;t++){                     // an envelope, not a circle
        const u=t/12, w=Math.sin(Math.PI*(0.22+u*0.78))*62;
        x.lineTo(64+Math.cos(a0)*w, 8+u*118);
      }
      for(let t=12;t>=0;t--){
        const u=t/12, w=Math.sin(Math.PI*(0.22+u*0.78))*62;
        x.lineTo(64+Math.cos(a1)*w, 8+u*118);
      }
      x.closePath(); x.fill();
    }
    x.globalCompositeOperation="source-atop";     // shade the far side
    const sg2=x.createLinearGradient(0,0,128,0);
    sg2.addColorStop(0,"rgba(40,46,62,0.36)"); sg2.addColorStop(0.45,"rgba(40,46,62,0)");
    sg2.addColorStop(1,"rgba(40,46,62,0.46)");
    x.fillStyle=sg2; x.fillRect(0,0,128,180);
    x.globalCompositeOperation="source-over";
    x.strokeStyle="rgba(60,54,44,0.75)"; x.lineWidth=1.4;
    for(const bx3 of [54,74]){ x.beginPath(); x.moveTo(bx3,124); x.lineTo(64,150); x.stroke(); }
    x.fillStyle="#7a5636"; x.fillRect(56,150,16,13);      // the basket
    x.fillStyle="#5c4029"; x.fillRect(56,150,16,3);
    const sp=new T.Sprite(new T.SpriteMaterial({map:setSRGB(new T.CanvasTexture(c)),
      transparent:true, depthWrite:false, fog:false, opacity:0}));
    const sc=16+Math.random()*7;                       // metres across the envelope
    sp.scale.set(sc, sc*1.40, 1);
    const a=Math.random()*Math.PI*2, d=620+Math.random()*900;
    sp.position.set(Math.cos(a)*d, 105+Math.random()*195, Math.sin(a)*d+10);
    scene.add(sp); BALLOONS.push({s:sp, sp:0.55+Math.random()*0.8, ph:Math.random()*6});
  }

  const bc=cvs(64,32), bx2=bc.getContext("2d");
  bx2.strokeStyle="rgba(20,16,12,0.85)"; bx2.lineWidth=3; bx2.beginPath();
  bx2.moveTo(6,22); bx2.quadraticCurveTo(20,6,32,18); bx2.quadraticCurveTo(44,6,58,22); bx2.stroke();
  const btex=setSRGB(new T.CanvasTexture(bc));
  for(let i=0;i<6;i++){
    const sp=new T.Sprite(new T.SpriteMaterial({map:btex, transparent:true, depthWrite:false, opacity:0.8}));
    sp.scale.set(7,3.5,1); scene.add(sp);
    BIRDS.push({s:sp, r:70+Math.random()*90, a:Math.random()*6.28, sp:0.12+Math.random()*0.10,
                y:44+Math.random()*36, cx:(Math.random()-0.5)*180, cz:60+(Math.random()-0.5)*180});
  }

  /* --- and one turkey vulture, most of a mile up ----------------------
     Not one of the six. A vulture soars: it holds a wing in a shallow V,
     it teeters, it turns on a thermal for minutes at a time without a
     single flap, and then the thermal is finished and it slides off to
     find another. So it gets its own silhouette — broad plank wings with
     the primaries slotted like fingers, a small head and a short wedge of
     tail — and its own clock, which has it out of the sky more often than
     in it.                                                             */
  const vc=cvs(128,64), vx=vc.getContext("2d");
  vx.fillStyle="rgba(24,19,15,0.92)";
  vx.beginPath();                                  // the port wing, and the V
  vx.moveTo(64,30); vx.lineTo(26,18); vx.lineTo(10,21); vx.lineTo(9,27);
  vx.lineTo(28,31); vx.lineTo(60,36); vx.closePath(); vx.fill();
  vx.beginPath();                                  // starboard
  vx.moveTo(64,30); vx.lineTo(102,18); vx.lineTo(118,21); vx.lineTo(119,27);
  vx.lineTo(100,31); vx.lineTo(68,36); vx.closePath(); vx.fill();
  for(const q of [-1,1]) for(let k=0;k<4;k++){     // slotted primaries
    const bx3=64+q*(30+k*5.5), by=19+k*1.9;
    vx.beginPath(); vx.moveTo(bx3, by+2);
    vx.lineTo(bx3+q*13, by-3+k*1.2); vx.lineTo(bx3+q*13, by-0.6+k*1.2);
    vx.lineTo(bx3, by+4.4); vx.closePath(); vx.fill();
  }
  vx.beginPath(); vx.ellipse(64,31,7,5,0,0,7); vx.fill();            // body
  vx.beginPath(); vx.ellipse(64,23.5,2.6,3.2,0,0,7); vx.fill();      // head
  vx.beginPath();                                                    // tail
  vx.moveTo(58,35); vx.lineTo(70,35); vx.lineTo(66,47); vx.lineTo(62,47);
  vx.closePath(); vx.fill();
  const vtex=setSRGB(new T.CanvasTexture(vc));
  {
    const sp=new T.Sprite(new T.SpriteMaterial({map:vtex, transparent:true,
                          depthWrite:false, fog:false, opacity:0}));
    sp.scale.set(1,1,1); scene.add(sp);
    VULTURE={s:sp, on:false, t:14+Math.random()*40, a:Math.random()*6.28,
             r:110, y:190, cx:0, cz:0, sp:0.12, drift:0, fade:0};
  }
})();

/* --- traffic: something passes on the highway every so often ----------- */
const TRAFFIC=[];
// the soft dot every lamp on a vehicle is drawn with — the traffic's and,
// further down, the headlamps of whatever you are driving
const GLOW_TEX=(function(){
  const c=cvs(64,64), x=c.getContext("2d");
  const g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,"rgba(255,255,255,1)"); g.addColorStop(0.25,"rgba(255,244,214,0.65)");
  g.addColorStop(1,"rgba(255,230,170,0)");
  x.fillStyle=g; x.fillRect(0,0,64,64); return setSRGB(new T.CanvasTexture(c));
})();
(function buildTraffic(){
  const glowTex=GLOW_TEX;
  const BODY=["#8a3a2a","#2c3f63","#a7a69a","#3a4d38"];
  function vehicle(kind, col){
    const ent=[], m4=(x,y,z)=>new T.Matrix4().makeTranslation(x,y,z);
    const paint=new T.Color(col), dark=new T.Color(0x181715), chrome=new T.Color(0xb8b0a0);
    const glass=new T.Color(0x20303a);
    const add=(g,x,y,z,c)=>ent.push({geo:g, matrix:m4(x,y,z), color:c});
    if(kind===2){                                      // tractor and trailer
      add(boxGeo(2.34,0.34,5.0,0.4), 0,0.52,2.2, dark);
      add(boxGeo(2.30,1.30,2.60,0.4), 0,1.30,3.6, paint);
      add(boxGeo(2.10,0.70,0.14,0.4), 0,1.70,4.92, glass);
      add(boxGeo(2.16,0.16,2.30,0.4), 0,1.98,3.6, paint);
      add(boxGeo(2.44,2.80,9.40,0.35), 0,2.20,-3.4, new T.Color(0xd8d4c8));
      add(boxGeo(2.48,0.20,9.30,0.35), 0,3.62,-3.4, chrome);
      for(const w of [[-1.12,4.3],[1.12,4.3],[-1.12,-1.2],[1.12,-1.2],[-1.12,-6.4],[1.12,-6.4]]){
        const g=new T.CylinderGeometry(0.52,0.52,0.34,14);
        ent.push({geo:g, matrix:new T.Matrix4().compose(new T.Vector3(w[0],0.52,w[1]),
          new T.Quaternion().setFromEuler(new T.Euler(0,0,Math.PI/2)), new T.Vector3(1,1,1)), color:dark});
      }
    }else{                                             // sedan or pickup
      add(boxGeo(2.04,0.30,4.22,0.4), 0,0.39,0, dark);
      add(boxGeo(1.98,0.52,4.10,0.4), 0,0.67,0, paint);
      add(boxGeo(1.82,0.18,1.26,0.4), 0,0.89,1.24, paint);
      add(boxGeo(2.06,0.28,0.22,0.4), 0,0.53,2.14, chrome);
      add(boxGeo(2.06,0.28,0.22,0.4), 0,0.53,-2.14, chrome);
      if(kind===1){
        add(boxGeo(1.82,0.16,1.06,0.4), 0,0.90,0.58, paint);
        add(boxGeo(1.52,0.44,1.26,0.4), 0,1.20,0.58, glass);
        add(boxGeo(1.44,0.14,1.10,0.4), 0,1.41,0.56, paint);
        add(boxGeo(0.13,0.40,2.02,0.4), -0.92,1.12,-1.12, paint);
        add(boxGeo(0.13,0.40,2.02,0.4),  0.92,1.12,-1.12, paint);
        add(boxGeo(1.94,0.40,0.13,0.4), 0,1.12,-2.15, paint);
      }else{
        add(boxGeo(1.82,0.16,0.98,0.4), 0,0.88,-1.34, paint);
        add(boxGeo(1.50,0.42,1.48,0.4), 0,1.21,-0.06, glass);
        add(boxGeo(1.40,0.14,1.24,0.4), 0,1.40,-0.08, paint);
      }
      for(const w of [[-0.90,1.56],[0.90,1.56],[-0.90,-1.56],[0.90,-1.56]]){
        const g=new T.CylinderGeometry(0.36,0.36,0.30,14);
        ent.push({geo:g, matrix:new T.Matrix4().compose(new T.Vector3(w[0],0.36,w[1]),
          new T.Quaternion().setFromEuler(new T.Euler(0,0,Math.PI/2)), new T.Vector3(1,1,1)), color:dark});
      }
    }
    const mesh=new T.Mesh(mergeEntries(ent),
      new T.MeshStandardMaterial({vertexColors:true, roughness:0.44, metalness:0.28}));
    mesh.castShadow=true;
    const g=new T.Group(); g.add(mesh);
    const nose=(kind===2?5.1:2.25), tail=(kind===2?-8.2:-2.25);
    /* A lamp is a small bright rectangle; the glow is a separate, much
       dimmer thing behind it. These were three-metre sprites, which is why
       a car coming the other way was a pair of headlight-shaped clouds. */
    const lamps=[];
    const hy=(kind===2?1.25:0.80), ty2=(kind===2?1.10:0.80);
    for(const lx of [-0.72,0.72]){
      const hm=new T.Mesh(new T.PlaneGeometry(0.30,0.18),
        new T.MeshBasicMaterial({color:0xfff0c8, transparent:true, opacity:0,
          depthWrite:false, fog:false, toneMapped:false}));
      hm.position.set(lx, hy, nose+0.02);
      g.add(hm); lamps.push({s:hm, head:true});
      const hs=new T.Sprite(new T.SpriteMaterial({map:glowTex, transparent:true,
        depthWrite:false, blending:T.AdditiveBlending, opacity:0}));
      hs.scale.set(1.15,1.15,1); hs.position.set(lx, hy, nose+0.06);
      g.add(hs); lamps.push({s:hs, head:true, soft:true});
      const tm=new T.Mesh(new T.PlaneGeometry(0.34,0.14),
        new T.MeshBasicMaterial({color:0xff2a12, transparent:true, opacity:0,
          depthWrite:false, fog:false, toneMapped:false, side:T.DoubleSide}));
      tm.position.set(lx, ty2, tail-0.02);
      g.add(tm); lamps.push({s:tm, head:false});
      const ts=new T.Sprite(new T.SpriteMaterial({map:glowTex, transparent:true,
        depthWrite:false, blending:T.AdditiveBlending, opacity:0, color:0xff3418}));
      ts.scale.set(0.62,0.62,1); ts.position.set(lx, ty2, tail-0.06);
      g.add(ts); lamps.push({s:ts, head:false, soft:true});
    }
    scene.add(g);
    /* Something moving at thirty metres a second is a solid object. The
       extents are kept in the vehicle's own frame — nose and tail down its
       length, hw across it — and turned into a world AABB every frame by
       updateTraffic, because which way round nose and tail land in x depends
       on which way the thing is going. */
    return {g:g, lamps:lamps, kind:kind, nose:nose, tail:tail,
            hw:(kind===2?1.26:1.05), ht:(kind===2?3.70:1.50),
            col:{x0:0,x1:0,z0:0,z1:0,y0:0,y1:0}};
  }
  // The wrap moved out to 1500 m so nothing is seen appearing, which spread
  // three cars over four kilometres of road. Sixteen puts them past the old
  // sighting rate by about a fifth.
  /* +x is east and +z is north, so the right-hand side of an eastbound car
     is the NORTH half of the road — the motel's side. Eastbound therefore
     belongs at ROADZ+2.2 and westbound at ROADZ-2.2; they were the other way
     round, which is two lanes of oncoming traffic passing on the wrong side
     of each other. */
  const lanes=[[ROADZ+2.2, 1], [ROADZ-2.2, -1]];
  for(let i=0;i<16;i++){
    const kind=[0,1,0,2,1,0][i%6];
    const v=vehicle(kind, BODY[(i*3+((i/4)|0))%BODY.length]);
    const ln=lanes[i%2];
    v.dir=ln[1]; v.z=ln[0];
    v.x=-1500+(i/16)*3000+Math.random()*140;
    v.speed=(kind===2?19:26)+Math.random()*6;
    v.g.rotation.y = v.dir>0 ? Math.PI/2 : -Math.PI/2;
    TRAFFIC.push(v);
  }
})();
function updateTraffic(dt, dark){
  for(const v of TRAFFIC){
    v.x += v.speed*v.dir*dt;
    // wrap well past the fog, so nothing is ever seen appearing or vanishing
    if(v.x> 1500) v.x=-1500;
    if(v.x<-1500) v.x= 1500;
    const gy=Terrain.heightAt(v.x, v.z)+0.02;
    v.g.position.set(v.x, gy, v.z);
    // the shell's world box, for carHits — nose leads, whichever way it runs
    const c=v.col;
    c.x0=v.x+(v.dir>0 ? v.tail : -v.nose);
    c.x1=v.x+(v.dir>0 ? v.nose : -v.tail);
    c.z0=v.z-v.hw; c.z1=v.z+v.hw;
    c.y0=gy;       c.y1=gy+v.ht;
    const lit=dark>0.04;                       // no lamp draws at all by day
    for(const L of v.lamps){
      L.s.visible=lit;
      if(!lit) continue;
      // the lens is bright and small; the bloom behind it is faint and small
      L.s.material.opacity = L.soft ? dark*(L.head?0.34:0.22)
                                    : dark*(L.head?0.98:0.90);
    }
  }
}

/* --- moths at the sconces, dust lifting off the lot -------------------- */
const MOTHS=[], DUST=[];
(function buildMotes(){
  const soft=(inner,outer)=>{
    const c=cvs(32,32), x=c.getContext("2d");
    const g=x.createRadialGradient(16,16,0,16,16,16);
    g.addColorStop(0,inner); g.addColorStop(0.5,outer); g.addColorStop(1,"rgba(0,0,0,0)");
    x.fillStyle=g; x.fillRect(0,0,32,32);
    return setSRGB(new T.CanvasTexture(c));
  };
  const mothTex=soft("rgba(236,226,196,0.95)","rgba(180,164,128,0.5)");
  const dustTex=soft("rgba(214,190,150,0.55)","rgba(190,164,124,0.22)");
  for(let i=0;i<8;i++){
    const sp=new T.Sprite(new T.SpriteMaterial({map:mothTex, transparent:true, depthWrite:false, opacity:0}));
    sp.scale.set(0.09,0.09,1); scene.add(sp);
    MOTHS.push({s:sp, a:Math.random()*6.28, r:0.30+Math.random()*0.55,
                sp:1.6+Math.random()*2.2, ph:Math.random()*6.28});
  }
  for(let i=0;i<10;i++){
    const sp=new T.Sprite(new T.SpriteMaterial({map:dustTex, transparent:true, depthWrite:false, opacity:0}));
    const sc=1.6+Math.random()*3.4; sp.scale.set(sc,sc*0.7,1); scene.add(sp);
    DUST.push({s:sp, p:new T.Vector3(), v:0.7+Math.random()*1.4, life:Math.random()});
  }
})();

/* --- the cycle itself --------------------------------------------------- */
const DayNight=(function(){
  const DUR=414;                                   // seconds for a full 24 h
  const P={
    dayLight:new T.Color(0xffeed0), setLight:new T.Color(0xff9b4c), nightLight:new T.Color(0x8ea6d4),
    dayHemi:new T.Color(0xffe7c4),  nightHemi:new T.Color(0x18243a),
    dayGround:new T.Color(0x4a2a18),nightGround:new T.Color(0x080a12),
    daySkyTop:new T.Color(0x21406e), daySkyMid:new T.Color(0x86a2b6),
    daySkyLow:new T.Color(0xd8a072), daySkyHz:new T.Color(0xc37946),
    setSkyTop:new T.Color(0x2a2246), setSkyMid:new T.Color(0x8a3f4e),
    setSkyLow:new T.Color(0xd8623a), setSkyHz:new T.Color(0x5a1e2c),
    nightTop:new T.Color(0x040611),  nightMid:new T.Color(0x0b1428),
    nightLow:new T.Color(0x16203c),  nightHz:new T.Color(0x24304f),
  };
  // start late afternoon so the player watches the desert go over into night
  const s={t:0.478, sunHeight:0, hemiIntensity:1, sunIntensity:1,
           nightAmount:0, sunsetAmount:0, dark:0, hour:0, paused:false};
  return {
    DUR:DUR, P:P, state:s,
    setHour(h){ s.t=(((h-6)/24)%1+1)%1; },
    nudge(d){ s.t=(s.t+d+1)%1; },
    tick(dt){
      if(!s.paused) s.t=(s.t+dt/DUR)%1;
      const ang=s.t*Math.PI*2;
      s.sunHeight=Math.sin(ang);
      const day=smoothstep(0.12,0.35,s.sunHeight);
      const set=smoothstep(-0.22,0.12,s.sunHeight)*(1-smoothstep(0.15,0.35,s.sunHeight));
      const tw =smoothstep(-0.50,-0.05,s.sunHeight)*(1-day);
      // twilight lingers: a desert dusk is a long warm band, not a light switch
      s.nightAmount=1-smoothstep(-0.50,-0.02,s.sunHeight);
      s.sunsetAmount=set+tw*0.6;
      s.dark=1-smoothstep(-0.14,0.24,s.sunHeight);   // drives every artificial light
      s.hour=((s.t*24)+6)%24;
      // a real moon, not a token one: enough raking light for the strata and
      // cliff faces to keep reading across the valley at night
      s.sunIntensity=Math.max(0.04, day*1.12+set*0.68) + s.nightAmount*0.34;
      s.hemiIntensity=Math.max(0.15, day*0.70+set*0.46+(1-s.nightAmount)*0.32);
      return s;
    },
    paint(){
      const day=smoothstep(0.05,0.4,s.sunHeight);
      const set=smoothstep(-0.42,0.06,s.sunHeight)*(1-smoothstep(0.35,0.58,s.sunHeight));
      const night=1-smoothstep(-0.42,0.06,s.sunHeight);
      const tot=day+set+night||1;
      const mix=(o,a,b,c)=>{ o.r=(a.r*day+b.r*set+c.r*night)/tot;
                             o.g=(a.g*day+b.g*set+c.g*night)/tot;
                             o.b=(a.b*day+b.b*set+c.b*night)/tot; };
      mix(skyImg.top,P.daySkyTop,P.setSkyTop,P.nightTop);
      mix(skyImg.mid,P.daySkyMid,P.setSkyMid,P.nightMid);
      mix(skyImg.low,P.daySkyLow,P.setSkyLow,P.nightLow);
      mix(skyImg.hz ,P.daySkyHz ,P.setSkyHz ,P.nightHz );
      const g=skyCtx.createLinearGradient(0,0,0,256);
      g.addColorStop(0,   "#"+skyImg.top.getHexString());
      g.addColorStop(0.19,"#"+_skyMix.copy(skyImg.top).lerp(skyImg.mid,0.20).getHexString());
      g.addColorStop(0.33,"#"+_skyMix.copy(skyImg.top).lerp(skyImg.mid,0.56).getHexString());
      g.addColorStop(0.42,"#"+skyImg.mid.getHexString());
      g.addColorStop(0.58,"#"+_skyMix.copy(skyImg.mid).lerp(skyImg.low,0.34).getHexString());
      g.addColorStop(0.72,"#"+skyImg.low.getHexString());
      g.addColorStop(1,   "#"+skyImg.hz .getHexString());
      skyCtx.fillStyle=g; skyCtx.fillRect(0,0,16,256); skyTex.needsUpdate=true;
    }
  };
})();
scene.fog=new T.Fog(0xc37946, 185, 1460);
scene.background=new T.Color(0xc37946);
