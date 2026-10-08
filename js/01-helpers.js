"use strict";
/* LOW DESERT MOTEL · 01-helpers.js
   rng, geometry, merge buckets, the push() pipeline
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   1 · HELPERS
   ---------------------------------------------------------------------- */
const T = THREE;
const V3 = (x,y,z)=>new T.Vector3(x||0,y||0,z||0);
const clamp = (v,a,b)=>v<a?a:v>b?b:v;
const lerp  = (a,b,t)=>a+(b-a)*t;
const smoothstep=(e0,e1,x)=>{const t=clamp((x-e0)/(e1-e0),0,1);return t*t*(3-2*t);};

function mat(color, opts){
  return new T.MeshStandardMaterial(Object.assign({color:color, roughness:0.92, metalness:0.0}, opts||{}));
}
function cvs(w,h){ const c=document.createElement("canvas"); c.width=w; c.height=h; return c; }
function setSRGB(t){ try{ t.colorSpace=T.SRGBColorSpace; }catch(e){ t.encoding=T.sRGBEncoding; } return t; }
function rep(t,x,y){ t.wrapS=t.wrapT=T.RepeatWrapping; t.repeat.set(x,y); return t; }
// draw a slot's fallback art at exactly the slot's aspect ratio
function artTex(key, long, draw){
  const a=SLOT[key.split(":")[0]], W=a[0]>=a[1]?long:Math.round(long*a[0]/a[1]),
        H=a[1]>=a[0]?long:Math.round(long*a[1]/a[0]);
  const c=cvs(W,H), x=c.getContext("2d");
  x.fillStyle="#ffffff"; x.fillRect(0,0,W,H);
  draw(x,W,H);
  return hosted(key, setSRGB(new T.CanvasTexture(c)),
                {aspect:a[0]/a[1], animated:key.indexOf("tv")===0});
}
// swap in the hosted picture for this slot, if one has been named. The canvas
// art stays up until it arrives, and stays up for good if it never does —
// a picture the browser will not give us CORS for simply fails quietly.
/* --- animated screens --------------------------------------------------
   Two obvious approaches quietly do nothing. An <img> that is not actually
   painted in the document never advances a GIF's frames in Chrome, and a
   WebGL texture never changes unless something re-uploads it. So the GIF is
   decoded here, in full, from its own bytes: header, colour tables, graphic
   control blocks, LZW. That needs nothing from the browser but the bytes, it
   behaves the same in every engine, and it gives us each frame's real delay.
   Underneath it all the screens run procedural static, so a set is never a
   still photograph of snow even when the network gives us nothing.        */
const ANIM=[], STATIC_TILES=[];
/* Everything in the world that changes with the time of day registers here
   and 19-loop.js walks it once a frame: {m, kind} ramps a material's
   emissive, {m, basic:true} ramps its opacity, and `blink` on top of that
   makes a beacon rather than a lamp. It is declared this early because the
   desert files build lamps and they load a long way before 15-bake.       */
const GLOW=[];
(function buildStatic(){
  for(let k=0;k<6;k++){
    const c=cvs(128,96), x=c.getContext("2d");
    x.fillStyle="#0d1315"; x.fillRect(0,0,128,96);
    for(let i=0;i<2600;i++){
      const g=(Math.random()*70)|0;
      x.fillStyle="rgb("+(g+8)+","+(g+12)+","+(g+16)+")";
      x.fillRect(Math.random()*128, Math.random()*96, 1+Math.random()*2, 1);
    }
    STATIC_TILES.push(c);
  }
})();
function drawStatic(c, t){
  const x=c.getContext("2d"), W=c.width, H=c.height;
  x.globalAlpha=1; x.globalCompositeOperation="source-over";
  x.drawImage(STATIC_TILES[(t*14|0)%STATIC_TILES.length], 0,0,W,H);
  const y=((t*0.22)%1.35-0.18)*H;                    // the frame rolling through
  const g=x.createLinearGradient(0,y,0,y+H*0.16);
  g.addColorStop(0,"rgba(255,255,255,0)"); g.addColorStop(0.5,"rgba(210,228,238,0.14)");
  g.addColorStop(1,"rgba(255,255,255,0)");
  x.fillStyle=g; x.fillRect(0,y,W,H*0.16);
}
function coverBlit(c, src, iw, ih){
  if(!iw || !ih) return false;
  const g=c.getContext("2d"), want=c.width/c.height, have=iw/ih;
  let sw=iw, sh=ih, sx=0, sy=0;
  if(have>want){ sw=ih*want; sx=(iw-sw)/2; } else { sh=iw/want; sy=(ih-sh)/2; }
  try{ g.drawImage(src, sx,sy,sw,sh, 0,0,c.width,c.height); return true; }
  catch(e){ return false; }
}

/* --- a GIF decoder, because we cannot rely on the browser animating one -- */
function gifLZW(minCode, data, count){
  const out=new Uint8Array(count);
  const clear=1<<minCode, eoi=clear+1;
  const prefix=new Int32Array(4096), suffix=new Uint8Array(4096), stack=new Uint8Array(4096);
  for(let i=0;i<clear;i++){ prefix[i]=-1; suffix[i]=i; }
  let size=minCode+1, next=eoi+1, bit=0, oi=0, prev=-1, sp=0;
  const bits=data.length*8;
  while(oi<count){
    if(bit+size>bits) break;
    let code=0;
    for(let i=0;i<size;i++){ code |= ((data[bit>>3]>>(bit&7))&1)<<i; bit++; }
    if(code===eoi) break;
    if(code===clear){ size=minCode+1; next=eoi+1; prev=-1; continue; }
    if(prev===-1){ out[oi++]=suffix[code]; prev=code; continue; }
    let cur=code;
    if(code>=next){ stack[sp++]=suffix[prev]; cur=prev; }
    while(cur>=clear){ stack[sp++]=suffix[cur]; cur=prefix[cur]; }
    stack[sp++]=suffix[cur];
    if(next<4096){
      prefix[next]=prev; suffix[next]=suffix[cur]; next++;
      if(next===(1<<size) && size<12) size++;
    }
    while(sp>0 && oi<count) out[oi++]=stack[--sp];
    prev=code;
  }
  return out;
}
function gifDecode(buf){
  const d=new Uint8Array(buf); let p=0;
  if(d.length<13 || d[0]!==71 || d[1]!==73 || d[2]!==70) return null;   // "GIF"
  const u16=()=>{ const v=d[p]|(d[p+1]<<8); p+=2; return v; };
  p=6; const W=u16(), H=u16(), f=d[p++]; p+=2;
  let gct=null;
  if(f&0x80){ const n=2<<(f&7); gct=d.subarray(p,p+n*3); p+=n*3; }
  const frames=[]; let delay=10, tIdx=-1, disp=0;
  while(p<d.length){
    const b=d[p++];
    if(b===0x3B) break;
    if(b===0x21){                                   // extension
      const label=d[p++], blocks=[];
      while(p<d.length && d[p]!==0){ const n=d[p++]; blocks.push(d.subarray(p,p+n)); p+=n; }
      p++;
      if(label===0xF9 && blocks.length){
        const g=blocks[0];
        disp=(g[0]>>2)&7; delay=(g[1]|(g[2]<<8)); tIdx=(g[0]&1)?g[3]:-1;
      }
      continue;
    }
    if(b===0x2C){                                   // image descriptor
      const ix=u16(), iy=u16(), iw=u16(), ih=u16(), lf=d[p++];
      let ct=gct;
      if(lf&0x80){ const n=2<<(lf&7); ct=d.subarray(p,p+n*3); p+=n*3; }
      const inter=!!(lf&0x40), minCode=d[p++];
      let total=0, start=p;
      while(p<d.length && d[p]!==0){ total+=d[p]; p+=d[p]+1; }
      const data=new Uint8Array(total); let o=0, q=start;
      while(q<d.length && d[q]!==0){ const n=d[q++]; data.set(d.subarray(q,q+n),o); o+=n; q+=n; }
      p++;
      if(!ct || iw<=0 || ih<=0) continue;
      frames.push({x:ix, y:iy, w:iw, h:ih, ct:ct, t:tIdx, disp:disp, inter:inter,
                   delay:Math.max(20, (delay||10)*10), px:gifLZW(minCode, data, iw*ih)});
      continue;
    }
    break;
  }
  return frames.length ? {w:W, h:H, frames:frames} : null;
}
// compose the frames onto a canvas, honouring each one's disposal
function gifFrames(gif){
  const c=cvs(gif.w, gif.h), x=c.getContext("2d");
  const out=[], img=x.createImageData(gif.w, gif.h);
  let prev=null;
  for(const fr of gif.frames){
    if(prev===2) x.clearRect(0,0,gif.w,gif.h);      // restore to background
    const sub=x.createImageData(fr.w, fr.h), sd=sub.data;
    for(let j=0;j<fr.h;j++){
      // interlaced rows come in four passes
      let row=j;
      if(fr.inter){
        const q=fr.h;
        if(j < Math.ceil(q/8))                 row=j*8;
        else if(j < Math.ceil(q/8)+Math.ceil((q-4)/8)) row=(j-Math.ceil(q/8))*8+4;
        else if(j < Math.ceil(q/8)+Math.ceil((q-4)/8)+Math.ceil((q-2)/4))
             row=(j-Math.ceil(q/8)-Math.ceil((q-4)/8))*4+2;
        else row=(j-Math.ceil(q/8)-Math.ceil((q-4)/8)-Math.ceil((q-2)/4))*2+1;
      }
      for(let i=0;i<fr.w;i++){
        const idx=fr.px[j*fr.w+i], o=(row*fr.w+i)*4;
        if(idx===fr.t){ sd[o+3]=0; continue; }
        sd[o]=fr.ct[idx*3]; sd[o+1]=fr.ct[idx*3+1]; sd[o+2]=fr.ct[idx*3+2]; sd[o+3]=255;
      }
    }
    const tmp=cvs(fr.w, fr.h); tmp.getContext("2d").putImageData(sub,0,0);
    x.drawImage(tmp, fr.x, fr.y);
    const keep=cvs(gif.w, gif.h);
    keep.getContext("2d").drawImage(c,0,0);
    out.push({c:keep, delay:fr.delay});
    prev=fr.disp;
  }
  return out;
}
const IMG_STATUS={};
function dropNoise(tex){
  for(let i=0;i<ANIM.length;i++) if(ANIM[i].tex===tex && ANIM[i].noise) ANIM.splice(i--,1);
}
function playGif(key, url, tex){
  fetch(url, {mode:"cors", cache:"force-cache"})
    .then(r=>{ if(!r.ok) throw 0; return r.arrayBuffer(); })
    .then(buf=>{
      const gif=gifDecode(buf);
      if(!gif) throw 1;
      const fr=gifFrames(gif);
      if(!fr.length) throw 2;
      dropNoise(tex);
      IMG_STATUS[key]="gif:"+fr.length+"f";
      let i=0;
      const step=()=>{
        const f=fr[i%fr.length];
        if(coverBlit(tex.image, f.c, gif.w, gif.h)) tex.needsUpdate=true;
        i++; setTimeout(step, f.delay);
      };
      step();
    })
    .catch(e=>{
      if(IMAGE_PROXY && url.indexOf(IMAGE_PROXY)!==0){
        playGif(key, IMAGE_PROXY+encodeURIComponent(url), tex); return;
      }
      IMG_STATUS[key]="static (gif unavailable)";
      console.warn("[motel] could not fetch "+url+
        " — the screens fall back to procedural static. If this is a CORS "+
        "refusal the host has to send Access-Control-Allow-Origin.");
    });
}
function hosted(key, tex, opt){
  opt=opt||{};
  const url=IMAGES[key];
  if(opt.animated){                       // moving from the first frame, always
    ANIM.push({tex:tex, c:tex.image, noise:true});
    IMG_STATUS[key]="static";
  }
  if(!url) return tex;
  if(opt.animated){ playGif(key, url, tex); return tex; }
  new T.TextureLoader().load(url, t=>{
    IMG_STATUS[key]="loaded";
    tex.image=t.image; setSRGB(tex);
    // cover-crop to the slot, so a picture at any shape lands square and
    // nothing is ever stretched
    const iw=t.image.naturalWidth||t.image.width, ih=t.image.naturalHeight||t.image.height;
    if(opt.aspect && iw && ih){
      const want=opt.aspect, have=iw/ih;
      if(have>want){ const r=want/have; tex.repeat.set(r,1); tex.offset.set((1-r)/2,0); }
      else         { const r=have/want; tex.repeat.set(1,r); tex.offset.set(0,(1-r)/2); }
    }
    tex.needsUpdate=true;
  }, undefined, ()=>{ IMG_STATUS[key]="failed"; });
  return tex;
}
function tickAnim(now){
  for(let i=0;i<ANIM.length;i++){
    const a=ANIM[i];
    if(a.noise){ drawStatic(a.c, now); a.tex.needsUpdate=true; continue; }
    if(coverBlit(a.c, a.img, a.img.naturalWidth, a.img.naturalHeight)) a.tex.needsUpdate=true;
    else ANIM.splice(i--,1);
  }
}
// deterministic little PRNG so the scene is identical every load
let _seed = 1337;
function rnd(){ _seed = (_seed*1664525 + 1013904223) & 0x7fffffff; return _seed/0x7fffffff; }
function rr(a,b){ return a + rnd()*(b-a); }
function pick(a){ return a[(rnd()*a.length)|0]; }

/* --- box geometry with world-scaled UVs -------------------------------
   BoxGeometry lays its 24 verts out as +X,-X,+Y,-Y,+Z,-Z (4 verts each), so
   each face's 0..1 UV can be rescaled by that face's real dimensions. This is
   what lets many differently-sized boxes merge into one mesh and still share a
   tiling texture at a consistent scale.                                  */
function boxGeo(w,h,d,uvScale){
  const g=new T.BoxGeometry(w,h,d);
  if(uvScale){
    const a=g.attributes.uv, s=uvScale;
    const dims=[[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]];
    for(let f=0;f<6;f++) for(let i=0;i<4;i++){
      const k=f*4+i;
      a.setXY(k, a.getX(k)*dims[f][0]*s, a.getY(k)*dims[f][1]*s);
    }
    a.needsUpdate=true;
  }
  return g;
}

// An icosahedron is twenty flat facets and shades like a cut gem, which is
// what made every bush out there read as a pile of pebbles. Its corners all
// lie on a sphere, so pointing each normal straight out from the centre makes
// the same twenty triangles shade as a smooth ball — a soft lump for a fifth
// of the cost of subdividing it. Cached by radius; mergeEntries only reads.
const _BLOBS=new Map();
function blobGeo(r){
  const k=r.toFixed(3);
  let g=_BLOBS.get(k);
  if(g) return g;
  g=new T.IcosahedronGeometry(r,0);
  const pos=g.attributes.position, nrm=new Float32Array(pos.count*3);
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i), y=pos.getY(i), z=pos.getZ(i), L=Math.hypot(x,y,z)||1;
    nrm[i*3]=x/L; nrm[i*3+1]=y/L; nrm[i*3+2]=z/L;
  }
  g.setAttribute("normal", new T.BufferAttribute(nrm,3));
  _BLOBS.set(k,g);
  return g;
}

// A rock: an icosahedron with every vertex pushed in or out, so no two are
// the same lump. IcosahedronGeometry is NOT indexed — every triangle carries
// its own copy of each corner — so the radial factor has to be shared per
// corner or the rock comes apart into shards, and the squash is per rock.
function rockGeo(s, seed){
  const g=new T.IcosahedronGeometry(s, 1), pos=g.attributes.position;
  let sd2=seed*9301+4;
  const r3=()=>{ sd2=(sd2*9301+49297)%233280; return sd2/233280; };
  const squash=0.62+r3()*0.34;                // one rock, one profile
  const seen=new Map();
  for(let i=0;i<pos.count;i++){
    const k=pos.getX(i).toFixed(3)+","+pos.getY(i).toFixed(3)+","+pos.getZ(i).toFixed(3);
    let f=seen.get(k);
    if(f===undefined){ f=0.76+r3()*0.44; seen.set(k,f); }
    pos.setXYZ(i, pos.getX(i)*f, pos.getY(i)*f*squash, pos.getZ(i)*f);
}
  pos.needsUpdate=true; g.computeVertexNormals();
  return g;
}

/* A tiled map on a flat eighty metres across reads as a tiled map however
   subtle you make the tile, because the eye finds the period. The body of
   the slab keeps one box, but the surface you actually look at is laid as
   seven-metre tiles, each with its own UV offset and one of four quarter
   turns — the same map, with the period broken.                        */
const TILE=7.4, UVS=0.62;
const lotTop=(x0,x1,z0,z1)=>{
  let sd=(Math.round(Math.abs(x0)*131+Math.abs(z0)*77)|0)*7919 % 2147483647;
  const rr2=()=>{ sd=(sd*1103515245+12345)&0x7fffffff; return sd/0x7fffffff; };
  for(let x=x0; x<x1-0.02; x+=TILE) for(let z=z0; z<z1-0.02; z+=TILE){
    const w=Math.min(TILE, x1-x), d=Math.min(TILE, z1-z);
    if(w<0.06||d<0.06) continue;
    const g=new T.PlaneGeometry(w,d), a=g.attributes.uv;
    const ou=rr2()*97, ov=rr2()*97, rot=(rr2()*4)|0;
    for(let i=0;i<a.count;i++){
      let u=a.getX(i)*w*UVS, v=a.getY(i)*d*UVS;
      for(let k=0;k<rot;k++){ const t=u; u=v; v=-t; }
      a.setXY(i, u+ou, v+ov);
    }
    a.needsUpdate=true;
    push("asphalt", g, x+w/2, 0.002, z+d/2, 0, "#ffffff", -Math.PI/2, 0);
  }
};

/* A STAIN IS NEVER THE SAME STAIN TWICE.
   planeGeo hands every instance the same 0..1 UVs, so one streak map used
   forty times down a wall is forty identical rectangles — which is exactly
   what it looked like.

   THE FIRST FIX WAS WRONG AND IT TOOK TWO ROUNDS TO SEE WHY. It took an
   arbitrary WINDOW out of the map, and the map was given a soft margin on
   all four sides so "a crop can never land on a cut". But a soft margin
   only protects a crop that INCLUDES the map's edge. Nine crops in ten come
   out of the middle, where the content is at full strength, and there the
   crop boundary IS the cut — which is the hard horizontal line across the
   top of every stain in the building.

   A crop can only be safe if the thing inside it already fades to nothing
   before the boundary. So the maps are now GRIDS OF CELLS, each cell one
   complete blob or streak cluster that falls to zero alpha well inside its
   own cell, and this picks ONE WHOLE CELL — never a free-floating window.
   Four cells and a mirror give eight variants, and the size, the aspect
   and the vertex colour of each instance do the rest. The 0.4% inset keeps
   bilinear filtering from reaching into the neighbouring cell. */
let _cellN=0;
function cellGeo(w,h,cols,rows,seed){
  const g=new T.PlaneGeometry(w,h), a=g.attributes.uv;
  let sd=((seed===undefined||seed===0) ? (++_cellN)*2654435761 : seed*9781)&0x7fffffff;
  const r=()=>{ sd=(sd*1103515245+12345)&0x7fffffff; return sd/0x7fffffff; };
  const ci=Math.min(cols-1, Math.floor(r()*cols)), ri=Math.min(rows-1, Math.floor(r()*rows));
  const su=1/cols, sv=1/rows, ins=0.004, flip=r()<0.5;
  for(let i=0;i<a.count;i++){
    let u=a.getX(i); if(flip) u=1-u;
    a.setXY(i, (ci+ins)*su+u*su*(1-ins*2), (ri+ins)*sv+a.getY(i)*sv*(1-ins*2));
  }
  a.needsUpdate=true;
  return g;
}
// every decal in the world goes through this; both maps behind it are 2x2 grids
function streakGeo(w,h,seed){ return cellGeo(w,h,2,2,seed); }

// flat panel with world-scaled UVs, for alpha-cut things like chain-link
function planeGeo(w,h,uvScale){
  const g=new T.PlaneGeometry(w,h);
  if(uvScale){ const a=g.attributes.uv;
    for(let i=0;i<a.count;i++) a.setXY(i, a.getX(i)*w*uvScale, a.getY(i)*h*uvScale);
    a.needsUpdate=true; }
  return g;
}

/* --- geometry merging: position + normal + uv + vertex colour ---------- */
function mergeEntries(entries){
  let vtot=0, itot=0;
  for(const e of entries){
    const p=e.geo.attributes.position;
    vtot+=p.count; itot += e.geo.index ? e.geo.index.count : p.count;
  }
  const P=new Float32Array(vtot*3), N=new Float32Array(vtot*3),
        U=new Float32Array(vtot*2), C=new Float32Array(vtot*3);
  const IDX = vtot>65535 ? new Uint32Array(itot) : new Uint16Array(itot);
  const v=new T.Vector3(), n=new T.Vector3(), nm=new T.Matrix3();
  const white=new T.Color(0xffffff);
  let vo=0, io=0;
  for(const e of entries){
    const g=e.geo, pos=g.attributes.position, nor=g.attributes.normal, uv=g.attributes.uv;
    const col=e.color||white;
    nm.getNormalMatrix(e.matrix);
    for(let i=0;i<pos.count;i++){
      v.set(pos.getX(i),pos.getY(i),pos.getZ(i)).applyMatrix4(e.matrix);
      P[(vo+i)*3]=v.x; P[(vo+i)*3+1]=v.y; P[(vo+i)*3+2]=v.z;
      if(nor){ n.set(nor.getX(i),nor.getY(i),nor.getZ(i)).applyMatrix3(nm).normalize(); }
      else n.set(0,1,0);
      N[(vo+i)*3]=n.x; N[(vo+i)*3+1]=n.y; N[(vo+i)*3+2]=n.z;
      if(uv){ U[(vo+i)*2]=uv.getX(i); U[(vo+i)*2+1]=uv.getY(i); }
      C[(vo+i)*3]=col.r; C[(vo+i)*3+1]=col.g; C[(vo+i)*3+2]=col.b;
    }
    if(g.index){ for(let k=0;k<g.index.count;k++) IDX[io++]=vo+g.index.getX(k); }
    else       { for(let k=0;k<pos.count;k++)    IDX[io++]=vo+k; }
    vo+=pos.count;
  }
  const bg=new T.BufferGeometry();
  bg.setAttribute("position", new T.BufferAttribute(P,3));
  bg.setAttribute("normal",   new T.BufferAttribute(N,3));
  bg.setAttribute("uv",       new T.BufferAttribute(U,2));
  bg.setAttribute("color",    new T.BufferAttribute(C,3));
  bg.setIndex(new T.BufferAttribute(IDX,1));
  bg.computeBoundingSphere();
  return bg;
}

/* --- named merge buckets ---------------------------------------------
   Everything static is pushed into a bucket keyed by material; at the end
   each bucket bakes down to exactly one mesh. Keeps the whole motel — walls,
   walkways, roofs, railings, furniture — inside a couple of dozen draws. */
const BUCKETS = new Map();
const NO_SHADOW_IN = new Set(["pooltile","plaster"]);
function bucketOf(name, makeMat){
  let b=BUCKETS.get(name);
  if(!b){ b={entries:[], makeMat:makeMat, mat:null}; BUCKETS.set(name,b); }
  if(makeMat && !b.makeMat) b.makeMat=makeMat;
  return b;
}
const _q=new T.Quaternion(), _s=new T.Vector3(1,1,1), _e=new T.Euler();
// Euler order YXZ so a local tilt (rx) is applied *before* the wing rotation (ry)
function push(name, geo, x,y,z, ry, color, rx, rz){
  if(typeof ry==="string"){ color=ry; ry=0; }      // tolerate an omitted rotation argument
  _e.set(rx||0, ry||0, rz||0, "YXZ");
  _q.setFromEuler(_e);
  const m=new T.Matrix4().compose(new T.Vector3(x,y,z), _q, _s);
  bucketOf(name).entries.push({geo:geo, matrix:m, color:color?new T.Color(color):null});
}
// convenience: axis-aligned box straight into a bucket
function bx(name, w,h,d, x,y,z, uvScale, ry, color){
  push(name, boxGeo(w,h,d,uvScale===undefined?0.35:uvScale), x,y,z, ry||0, color);
}
function cyl(name, rt,rb,h,seg, x,y,z, color, rx,ry,rz){
  push(name, new T.CylinderGeometry(rt,rb,h,seg||14), x,y,z, ry||0, color, rx||0, rz||0);
}
/* WHAT IS ALLOWED TO CAST A SHADOW.

   three.js draws every castShadow mesh into the depth map whatever its
   material, and for a single-sided material it draws the BACK faces. Two
   consequences had been shaping every shadow in the world:

   * Anything flat shadows itself. A plane's back face is its front face, so
     a plane in the depth map sits exactly on the surface being shaded. The
     car park's visible surface is a layer of planes (lotTop breaks up the
     tiling), and so is every stain, soot patch, tyre mark and rug edge. The
     only thing holding that acne off was a large normalBias — 4.6 cm — and
     a large normalBias is precisely what lifts a shadow off the foot of
     whatever casts it: an 11 cm gap under a post at an evening sun, more on
     the textured lot. A flat thing lying on a surface has no shadow worth
     casting, so entries thinner than FLAT_T are split into a second mesh
     that receives but does not cast.
   * Transparent and additive materials cast solid shadows. The light-shaft
     haze, the candle-pool floorglow, smoke, soot, every window pane: each
     was printing an opaque shadow. Anything transparent, additive or not
     writing depth does not cast at all. */
const FLAT_T=0.012;
const noCast=m=> !!(m.transparent || m.blending===T.AdditiveBlending || m.depthWrite===false);
function isFlat(geo){
  if(!geo.boundingBox) geo.computeBoundingBox();
  const b=geo.boundingBox;
  return Math.min(b.max.x-b.min.x, b.max.y-b.min.y, b.max.z-b.min.z) < FLAT_T;
}
/* A LAMPSHADE IS A TUBE. Every shade in the world was a closed cylinder,
   which puts a flat disc across the mouth of it: from a chair or from under
   a ceiling rose what you saw was a lid of glowing cream with no bulb, no
   inside and no falloff — a sticker, and the brightest flat area in the room.
   A shade is open at both ends; the lampshade bucket is double-sided so its
   inside shows, lit by the lamp standing in it, and shadeBulb() hangs the
   bulb where you would look for it. */
function shadeGeo(rt, rb, h, seg){ return new T.CylinderGeometry(rt, rb, h, seg||14, 1, true); }
const shadeBulb=(r)=>new T.SphereGeometry(r||0.032, 10, 8);
// a runner's top: L long in x, W across in z, lying flat; u in repeats of
// `rep` metres along it and v 0..1 across, so the border stays on the edges
function runnerGeo(L, W, rep){
  const g=new T.PlaneGeometry(L, W), uv=g.attributes.uv, pos=g.attributes.position;
  for(let i=0;i<uv.count;i++) uv.setXY(i, (pos.getX(i)/L+0.5)*L/(rep||2), uv.getY(i));
  uv.needsUpdate=true;
  g.rotateX(-Math.PI/2);
  return g;
}
/* ...and a ceiling fitting is a bowl. The flush drums had flat bottoms, and
   a flat disc facing straight down at the lamp under it takes the full
   light and the full glow at once: the brightest, flattest, whitest thing in
   every room. A frosted half-dome hung from its rim: y=0 is the rim and it
   bulges down by `drop`, so its shading runs from the lit crown to the rim. */
function domeGeo(r, drop, seg){
  const g=new T.SphereGeometry(r, seg||18, 7, 0, Math.PI*2, Math.PI/2, Math.PI/2);
  g.scale(1, drop/r, 1);
  return g;
}
function bakeBuckets(scene){
  const out=[];
  for(const [name,b] of BUCKETS){
    if(!b.entries.length) continue;
    const m=b.makeMat ? b.makeMat() : mat(0xffffff);
    m.vertexColors=true; b.mat=m;
    const solid=[], flat=[];
    if(noCast(m)) flat.push(...b.entries);
    else for(const e of b.entries) (isFlat(e.geo) ? flat : solid).push(e);
    for(const [ents, cast] of [[solid,true],[flat,false]]){
      if(!ents.length) continue;
      const mesh=new T.Mesh(mergeEntries(ents), m);
      mesh.castShadow=cast;
      // a 100 mm ledge is a couple of shadow texels wide however fine the map
      // gets, so the waterline band opts out of receiving altogether
      mesh.receiveShadow = !NO_SHADOW_IN.has(name);
      mesh.name="bucket:"+name+(cast?"":(solid.length?":flat":""));
      scene.add(mesh); out.push(mesh);
    }
    b.entries.length=0;
  }
  return out;
}
