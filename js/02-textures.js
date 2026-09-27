"use strict";
/* LOW DESERT MOTEL · 02-textures.js
   every canvas-drawn texture in the world
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   2 · TEXTURE FACTORIES  (base fill -> noise dots -> strokes)
   ---------------------------------------------------------------------- */
function noiseDots(x,w,h,n,colors){
  for(let i=0;i<n;i++){
    x.fillStyle=colors[(Math.random()*colors.length)|0];
    x.fillRect(Math.random()*w, Math.random()*h, 1+Math.random()*2, 1+Math.random()*2);
  }
}
const TEX={};

TEX.stucco=(function(){                       // slate-periwinkle motel walls
  const c=cvs(256,256), x=c.getContext("2d");
  x.fillStyle="#8e9cb4"; x.fillRect(0,0,256,256);
  noiseDots(x,256,256,2600,["rgba(255,255,255,0.06)","rgba(0,0,0,0.06)","rgba(120,140,170,0.10)"]);
  for(let i=0;i<70;i++){                       // trowel swirls
    x.strokeStyle="rgba(255,255,255,"+(0.02+Math.random()*0.05).toFixed(3)+")";
    x.lineWidth=1+Math.random()*3; x.beginPath();
    const px=Math.random()*256, py=Math.random()*256;
    x.arc(px,py,6+Math.random()*22, Math.random()*6, Math.random()*6); x.stroke();
  }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.track=(function(){                        // a two-track, drawn once and tiled
  const c=cvs(64,64), x=c.getContext("2d");
  const g=x.createLinearGradient(0,0,64,0);
  g.addColorStop(0.00,"rgba(150,126,92,0)");   g.addColorStop(0.14,"rgba(150,126,92,0.40)");
  g.addColorStop(0.50,"rgba(150,126,92,0.16)");g.addColorStop(0.86,"rgba(150,126,92,0.40)");
  g.addColorStop(1.00,"rgba(150,126,92,0)");
  x.fillStyle=g; x.fillRect(0,0,64,64);
  for(const u of [0.28,0.72]){                 // the two ruts
    const rg=x.createLinearGradient((u-0.10)*64,0,(u+0.10)*64,0);
    rg.addColorStop(0,"rgba(78,60,40,0)"); rg.addColorStop(0.5,"rgba(78,60,40,0.50)");
    rg.addColorStop(1,"rgba(78,60,40,0)");
    x.fillStyle=rg; x.fillRect((u-0.10)*64,0,0.20*64,64);
  }
  for(let i=0;i<240;i++){                      // gravel kicked up along it
    x.fillStyle="rgba(216,196,158,"+(Math.random()*0.22).toFixed(2)+")";
    x.fillRect(Math.random()*64, Math.random()*64, 2,2);
  }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.chalk=(function(){                        // sun-killed paint over pitted steel
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#ece7dd"; x.fillRect(0,0,128,128);
  noiseDots(x,128,128,1700,["rgba(255,255,255,0.30)","rgba(90,74,58,0.16)","rgba(150,120,86,0.14)"]);
  for(let i=0;i<26;i++){                       // where the paint has come away
    x.fillStyle="rgba(120,92,62,"+(0.06+Math.random()*0.12).toFixed(3)+")";
    x.beginPath(); x.ellipse(Math.random()*128, Math.random()*128,
      3+Math.random()*13, 2+Math.random()*8, Math.random()*3, 0, 7); x.fill();
  }
  for(let i=0;i<20;i++){                       // rust running down from the seams
    x.strokeStyle="rgba(122,74,44,"+(0.05+Math.random()*0.10).toFixed(3)+")";
    x.lineWidth=1+Math.random()*4; x.beginPath();
    const px=Math.random()*128, py=Math.random()*128;
    x.moveTo(px,py); x.lineTo(px+(Math.random()-0.5)*6, py+8+Math.random()*34); x.stroke();
  }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.stuccoOff=(function(){                    // office / lower massing, same family
  const c=cvs(256,256), x=c.getContext("2d");
  x.fillStyle="#93a0b6"; x.fillRect(0,0,256,256);
  noiseDots(x,256,256,2200,["rgba(255,255,255,0.07)","rgba(0,0,0,0.05)"]);
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.concrete=(function(){                     // walkway slab, curbs, pool deck
  const c=cvs(256,256), x=c.getContext("2d");
  x.fillStyle="#b7b3ab"; x.fillRect(0,0,256,256);
  noiseDots(x,256,256,4000,["rgba(0,0,0,0.07)","rgba(255,255,255,0.09)","rgba(90,80,70,0.08)"]);
  x.strokeStyle="rgba(90,84,74,0.35)"; x.lineWidth=1.5;
  x.beginPath(); x.moveTo(0,128.5); x.lineTo(256,128.5); x.stroke();
  x.beginPath(); x.moveTo(128.5,0); x.lineTo(128.5,256); x.stroke();
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.asphalt=(function(){                      // parking lot + highway
  // A lot that has been down sixty summers is not one flat grey. It has
  // patches darker than the rest where it was cut and made good, ravelling
  // at the edges where the binder gave up, alligator cracking in the wheel
  // paths, sealed cracks standing proud, bleached aggregate where the sun
  // gets it, and stains under wherever anything ever parked.
  const c=cvs(512,512), x=c.getContext("2d");
  const rnd2=(function(){ let sd=20997; return ()=>{ sd=(sd*1103515245+12345)%2147483648;
    return sd/2147483648; }; })();
  x.fillStyle="#34302b"; x.fillRect(0,0,512,512);
  // Nothing big goes in the tile. A patch a third of a tile across repeats
  // every 1.6 m and the whole lot reads as a chequerboard, which is exactly
  // what happened; everything at that scale is a world-space decal instead.
  for(let i=0;i<40;i++){                       // just a wash, to break the flatness
    const r=14+rnd2()*34;
    x.fillStyle="rgba(150,142,126,"+(0.015+rnd2()*0.028).toFixed(3)+")";
    x.beginPath(); x.arc(rnd2()*512, rnd2()*512, r, 0, 7); x.fill();
  }
  noiseDots(x,512,512,24000,["rgba(255,255,255,0.05)","rgba(0,0,0,0.26)",
                             "rgba(168,158,140,0.07)","rgba(120,112,98,0.05)"]);
  for(let i=0;i<300;i++){                      // the aggregate that has ravelled out
    const px=rnd2()*512, py=rnd2()*512, r=0.8+rnd2()*2.2;
    x.fillStyle="rgba("+(120+rnd2()*70|0)+","+(112+rnd2()*60|0)+","+(98+rnd2()*50|0)+",0.34)";
    x.beginPath(); x.arc(px,py,r,0,7); x.fill();
    x.fillStyle="rgba(10,9,8,0.30)";
    x.beginPath(); x.arc(px+r*0.5,py+r*0.5,r*0.8,0,7); x.fill();
  }
  // alligator cracking: a patch of cells, not a scatter of lines
  for(let i=0;i<5;i++){
    const cx=rnd2()*512, cy=rnd2()*512, R=40+rnd2()*60;
    for(let k=0;k<34;k++){
      x.strokeStyle="rgba(16,15,14,"+(0.20+rnd2()*0.24).toFixed(3)+")";
      x.lineWidth=0.6+rnd2()*0.7;
      const a=rnd2()*Math.PI*2, r0=rnd2()*R;
      let px=cx+Math.cos(a)*r0, py=cy+Math.sin(a)*r0;
      x.beginPath(); x.moveTo(px,py);
      for(let j=0;j<3;j++){
        px+=(rnd2()-0.5)*26; py+=(rnd2()-0.5)*26;
        if(Math.hypot(px-cx,py-cy)>R*1.15) break;
        x.lineTo(px,py);
      }
      x.stroke();
    }
  }
  for(let i=0;i<20;i++){                       // long cracks, most of them sealed
    const sealed=rnd2()<0.55;
    let px=rnd2()*512, py=rnd2()*512;
    x.strokeStyle= sealed ? "rgba(20,19,18,0.66)" : "rgba(14,13,12,0.34)";
    x.lineWidth= sealed ? 2.2+rnd2()*2.4 : 0.7+rnd2()*0.8;
    x.lineCap="round"; x.beginPath(); x.moveTo(px,py);
    for(let k=0;k<7;k++){ px+=(rnd2()-0.5)*90; py+=(rnd2()-0.5)*90; x.lineTo(px,py); }
    x.stroke();
    if(sealed){                                // the tar stands proud and shines
      x.strokeStyle="rgba(120,116,108,0.14)"; x.lineWidth=0.9; x.stroke();
    }
  }
  for(let i=0;i<14;i++){                       // whatever leaked out of whatever parked
    const px=rnd2()*512, py=rnd2()*512, r=7+rnd2()*22;
    const g=x.createRadialGradient(px,py,0,px,py,r);
    g.addColorStop(0,"rgba(10,9,8,"+(0.30+rnd2()*0.30).toFixed(2)+")");
    g.addColorStop(0.6,"rgba(14,13,12,0.16)");
    g.addColorStop(1,"rgba(14,13,12,0)");
    x.fillStyle=g; x.beginPath(); x.arc(px,py,r,0,7); x.fill();
  }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.roofMetal=(function(){                    // standing-seam ribbed roof
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#5f829a"; x.fillRect(0,0,128,128);
  for(let u=0;u<128;u+=16){
    x.fillStyle="rgba(255,255,255,0.16)"; x.fillRect(u,0,2,128);
    x.fillStyle="rgba(0,0,0,0.22)";       x.fillRect(u+3,0,2,128);
  }
  noiseDots(x,128,128,600,["rgba(0,0,0,0.08)","rgba(255,255,255,0.06)"]);
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.roofGreen=(function(){                    // office roof — the green one
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#416b56"; x.fillRect(0,0,128,128);
  for(let u=0;u<128;u+=16){
    x.fillStyle="rgba(255,255,255,0.13)"; x.fillRect(u,0,2,128);
    x.fillStyle="rgba(0,0,0,0.26)";       x.fillRect(u+3,0,2,128);
  }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.breeze=(function(){                       // decorative concrete screen block
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#e7e4da"; x.fillRect(0,0,128,128);
  x.fillStyle="#9a968b";
  for(let gy=0;gy<128;gy+=32) for(let gx=0;gx<128;gx+=32){
    x.save(); x.translate(gx+16,gy+16); x.rotate(Math.PI/4);
    x.fillRect(-9,-9,18,18); x.restore();
    x.fillStyle="#e7e4da"; x.save(); x.translate(gx+16,gy+16); x.rotate(Math.PI/4);
    x.fillRect(-5.5,-5.5,11,11); x.restore(); x.fillStyle="#9a968b";
  }
  noiseDots(x,128,128,900,["rgba(0,0,0,0.05)","rgba(255,255,255,0.08)"]);
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.carpet=(function(){                       // room carpet — tired brown loop
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#6d5b46"; x.fillRect(0,0,128,128);
  noiseDots(x,128,128,4200,["rgba(0,0,0,0.16)","rgba(196,172,138,0.14)","rgba(120,96,66,0.2)"]);
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.roomWall=(function(){                     // painted drywall, orange-peel roll
  const c=cvs(256,256), x=c.getContext("2d");
  x.fillStyle="#ded3bc"; x.fillRect(0,0,256,256);
  noiseDots(x,256,256,4200,["rgba(255,255,255,0.11)","rgba(150,138,116,0.09)","rgba(120,108,86,0.05)"]);
  for(let i=0;i<520;i++){                     // roller stipple
    x.fillStyle="rgba(255,255,255,"+(0.03+Math.random()*0.06).toFixed(3)+")";
    x.beginPath(); x.arc(Math.random()*256, Math.random()*256, 1+Math.random()*3.2, 0, 7); x.fill();
  }
  for(let i=0;i<40;i++){                       // faint scuffs at skirting height
    x.strokeStyle="rgba(120,104,80,"+(0.03+Math.random()*0.05).toFixed(3)+")";
    x.lineWidth=1+Math.random()*2; x.beginPath();
    const px=Math.random()*256, py=Math.random()*256;
    x.moveTo(px,py); x.lineTo(px+(Math.random()-0.5)*40, py+(Math.random()-0.5)*8); x.stroke();
  }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.ceilTile=(function(){                     // sprayed popcorn ceiling
  const c=cvs(256,256), x=c.getContext("2d");
  x.fillStyle="#e6dcc6"; x.fillRect(0,0,256,256);
  for(let i=0;i<5200;i++){
    const px=Math.random()*256, py=Math.random()*256, r=0.8+Math.random()*2.4;
    x.fillStyle="rgba(255,255,255,"+(0.10+Math.random()*0.24).toFixed(2)+")";
    x.beginPath(); x.arc(px,py,r,0,7); x.fill();
    x.fillStyle="rgba(150,138,112,"+(0.06+Math.random()*0.14).toFixed(2)+")";
    x.beginPath(); x.arc(px+r*0.5,py+r*0.5,r*0.7,0,7); x.fill();
  }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.lino=(function(){                         // speckled terrazzo, office floor
  const c=cvs(256,256), x=c.getContext("2d");
  x.fillStyle="#b9ae95"; x.fillRect(0,0,256,256);
  for(let i=0;i<3400;i++){
    const px=Math.random()*256, py=Math.random()*256, r=0.9+Math.random()*3.0;
    x.fillStyle=["rgba(90,74,54,0.55)","rgba(240,236,224,0.6)","rgba(150,110,74,0.45)",
                 "rgba(70,86,78,0.35)"][(Math.random()*4)|0];
    x.beginPath(); x.arc(px,py,r,0,7); x.fill();
  }
  x.strokeStyle="rgba(110,98,78,0.35)"; x.lineWidth=2;
  for(let u=0;u<=256;u+=128){ x.beginPath();x.moveTo(u,0);x.lineTo(u,256);x.stroke();
                              x.beginPath();x.moveTo(0,u);x.lineTo(256,u);x.stroke(); }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.bathTile=(function(){                     // glossy square wall tile
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#dfe3df"; x.fillRect(0,0,128,128);
  noiseDots(x,128,128,900,["rgba(255,255,255,0.10)","rgba(120,130,126,0.10)"]);
  x.strokeStyle="rgba(140,150,146,0.8)"; x.lineWidth=2;
  for(let u=0;u<=128;u+=32){ x.beginPath(); x.moveTo(u,0);x.lineTo(u,128);x.stroke();
                             x.beginPath(); x.moveTo(0,u);x.lineTo(128,u);x.stroke(); }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.oak=(function(){                          // furniture wood
  const c=cvs(256,64), x=c.getContext("2d");
  x.fillStyle="#6f4a2c"; x.fillRect(0,0,256,64);
  for(let i=0;i<150;i++){
    x.fillStyle="rgba("+(180+Math.random()*40|0)+",140,90,"+(0.04+Math.random()*0.13).toFixed(3)+")";
    x.fillRect(Math.random()*256, Math.random()*64, 30+Math.random()*90, 1);
  }
  x.strokeStyle="rgba(40,26,14,0.45)"; x.lineWidth=1;
  for(let y=0;y<64;y+=16){ x.beginPath(); x.moveTo(0,y+0.5); x.lineTo(256,y+0.5); x.stroke(); }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.spread=(function(){                       // motel bedspread — brick/teal grid
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#8f5a4a"; x.fillRect(0,0,128,128);
  x.strokeStyle="rgba(226,206,168,0.55)"; x.lineWidth=2;
  for(let u=0;u<=128;u+=21){ x.beginPath();x.moveTo(u,0);x.lineTo(u,128);x.stroke();
                             x.beginPath();x.moveTo(0,u);x.lineTo(128,u);x.stroke(); }
  x.strokeStyle="rgba(95,191,178,0.4)"; x.lineWidth=1;
  for(let u=10;u<=128;u+=21){ x.beginPath();x.moveTo(u,0);x.lineTo(u,128);x.stroke(); }
  noiseDots(x,128,128,900,["rgba(0,0,0,0.08)"]);
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.curtain=(function(){                      // office & room drapes — gold pleat
  const c=cvs(64,128), x=c.getContext("2d");
  x.fillStyle="#cbb066"; x.fillRect(0,0,64,128);
  for(let u=0;u<64;u+=8){
    x.fillStyle="rgba(0,0,0,0.16)"; x.fillRect(u,0,3,128);
    x.fillStyle="rgba(255,246,210,0.22)"; x.fillRect(u+4,0,2,128);
  }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.sand=(function(){                         // desert ground grain (P76 recipe)
  const c=cvs(256,256), x=c.getContext("2d");
  x.fillStyle="#b9a075"; x.fillRect(0,0,256,256);
  for(let i=0;i<13000;i++){
    const px=Math.random()*256, py=Math.random()*256, r=Math.random();
    if(r<0.03){ x.fillStyle="rgba(40,28,16,0.35)"; x.fillRect(px,py,2,2); }
    else if(r<0.06){ x.fillStyle="rgba(220,190,140,0.30)"; x.fillRect(px,py,1,1); }
    else { x.fillStyle="rgba(0,0,0,"+(Math.random()*0.12).toFixed(2)+")"; x.fillRect(px,py,1,1); }
  }
  for(let i=0;i<44;i++){
    const px=Math.random()*256, py=Math.random()*256, sz=8+Math.random()*22;
    x.fillStyle="rgba("+(Math.random()<0.5?"60,40,20":"180,150,100")+","+(0.06+Math.random()*0.08).toFixed(2)+")";
    x.beginPath(); x.arc(px,py,sz,0,7); x.fill();
  }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.gravel=(function(){                       // xeriscape beds by the office
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#8a5f45"; x.fillRect(0,0,128,128);
  for(let i=0;i<2400;i++){
    x.fillStyle="rgba("+(120+Math.random()*90|0)+","+(80+Math.random()*60|0)+","+(60+Math.random()*40|0)+",0.7)";
    x.beginPath(); x.arc(Math.random()*128, Math.random()*128, 0.7+Math.random()*1.8, 0, 7); x.fill();
  }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.pooltile=(function(){                     // waterline tile band
  const c=cvs(128,64), x=c.getContext("2d");
  x.fillStyle="#2d87ab"; x.fillRect(0,0,128,64);
  x.strokeStyle="rgba(255,255,255,0.5)"; x.lineWidth=2;
  for(let u=0;u<=128;u+=16){ x.beginPath();x.moveTo(u,0);x.lineTo(u,64);x.stroke(); }
  x.beginPath();x.moveTo(0,32);x.lineTo(128,32);x.stroke();
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.plaster=(function(){                      // pool shell — white marcite
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#cbe2e8"; x.fillRect(0,0,128,128);
  noiseDots(x,128,128,2000,["rgba(255,255,255,0.35)","rgba(120,170,185,0.14)"]);
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.caustic=(function(){                       // scrolling water light pattern
  const c=cvs(256,256), x=c.getContext("2d");
  x.fillStyle="#000000"; x.fillRect(0,0,256,256);
  x.globalCompositeOperation="lighter";
  for(let i=0;i<120;i++){
    const px=Math.random()*256, py=Math.random()*256, r=10+Math.random()*34;
    const g=x.createRadialGradient(px,py,0,px,py,r);
    g.addColorStop(0,"rgba(190,246,255,0.42)");
    g.addColorStop(0.55,"rgba(90,200,240,0.14)");
    g.addColorStop(1,"rgba(0,0,0,0)");
    x.fillStyle=g; x.beginPath(); x.arc(px,py,r,0,7); x.fill();
  }
  for(let i=0;i<70;i++){                        // thin caustic filaments
    x.strokeStyle="rgba(210,250,255,"+(0.05+Math.random()*0.16).toFixed(3)+")";
    x.lineWidth=1+Math.random()*2.5; x.beginPath();
    let px=Math.random()*256, py=Math.random()*256; x.moveTo(px,py);
    for(let k=0;k<6;k++){ px+=(Math.random()-0.5)*70; py+=(Math.random()-0.5)*70; x.lineTo(px,py); }
    x.stroke();
  }
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

TEX.ripple=(function(){                        // tiling normal map: fine wind chop
  const N=128, c=cvs(N,N), x=c.getContext("2d"), img=x.createImageData(N,N);
  // integer wave numbers so the field wraps exactly at the texture edge
  const W=[[3,1,1.00,1.7],[1,4,0.80,0.4],[5,3,0.55,2.9],[2,7,0.35,5.1],[9,2,0.22,3.3],[6,9,0.16,1.1]];
  const K=2*Math.PI/N;
  const h=(u,v)=>{ let a=0; for(const w of W) a+=w[2]*Math.sin((w[0]*u+w[1]*v)*K+w[3]); return a; };
  for(let v=0;v<N;v++) for(let u=0;u<N;u++){
    const dx=(h(u+1,v)-h(u-1,v))*0.5, dz=(h(u,v+1)-h(u,v-1))*0.5;
    const L=Math.hypot(-dx,-dz,1.6), i=(v*N+u)*4;
    img.data[i]  =Math.round((-dx/L*0.5+0.5)*255);
    img.data[i+1]=Math.round(( 1.6/L*0.5+0.5)*255);
    img.data[i+2]=Math.round((-dz/L*0.5+0.5)*255);
    img.data[i+3]=255;
  }
  x.putImageData(img,0,0);
  const t=new T.CanvasTexture(c);                // data, not colour — no sRGB
  t.wrapS=t.wrapT=T.RepeatWrapping; t.repeat.set(3.2,2.0);
  return t;
})();

TEX.soot=(function(){                         // soft stain halo for soffits and walls
  const c=cvs(64,64), x=c.getContext("2d");
  const g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,"rgba(255,255,255,0.9)"); g.addColorStop(0.45,"rgba(255,255,255,0.35)");
  g.addColorStop(1,"rgba(255,255,255,0)");
  x.fillStyle=g; x.fillRect(0,0,64,64);
  for(let i=0;i<200;i++){ x.fillStyle="rgba(255,255,255,"+(Math.random()*0.25).toFixed(2)+")";
    x.fillRect(Math.random()*64, Math.random()*64, 1,1); }
  return setSRGB(new T.CanvasTexture(c));
})();

TEX.streak=(function(){                       // rust bleeding down from a fitting
  const c=cvs(64,128), x=c.getContext("2d");
  x.clearRect(0,0,64,128);
  for(let i=0;i<26;i++){
    const px=8+Math.random()*48, w2=1+Math.random()*5, h2=30+Math.random()*96;
    const g=x.createLinearGradient(0,0,0,h2);
    g.addColorStop(0,"rgba(255,255,255,0.85)"); g.addColorStop(1,"rgba(255,255,255,0)");
    x.fillStyle=g; x.fillRect(px,0,w2,h2);
  }
  return setSRGB(new T.CanvasTexture(c));
})();

/* --- the seven maps that were missing -----------------------------------
   A survey of the built scene found 70% of its triangles on materials with no
   map at all — foliage alone is 45% of the world and was flat colour. These
   all multiply a vertex colour, so every one of them averages close to white:
   they add grain, not tint. And because most pushes leave uvScale at 0, a map
   here stretches 0..1 over whatever face it lands on, so none of them has a
   direction or a feature you could measure against.                        */
TEX.leafskin=(function(){                     // every plant in the desert
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#ffffff"; x.fillRect(0,0,128,128);
  noiseDots(x,128,128,900,["rgba(70,90,50,0.20)","rgba(255,255,255,0.20)",
                           "rgba(40,60,35,0.14)"]);
  for(let i=0;i<40;i++){                      // the mottle a dry leaf has
    const r=6+Math.random()*16;
    x.fillStyle="rgba(90,105,70,"+(0.04+Math.random()*0.07)+")";
    x.beginPath(); x.ellipse(Math.random()*128, Math.random()*128, r, r*0.7,
                             Math.random()*3, 0, 7); x.fill();
  }
  for(let i=0;i<16;i++){                      // and the odd dead patch
    x.fillStyle="rgba(150,130,80,"+(0.05+Math.random()*0.09)+")";
    x.beginPath(); x.arc(Math.random()*128, Math.random()*128, 2+Math.random()*5, 0, 7);
    x.fill();
  }
  return rep(setSRGB(new T.CanvasTexture(c)), 1, 1);
})();
TEX.trim=(function(){                         // painted steel, brushed and chipped
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#ffffff"; x.fillRect(0,0,128,128);
  for(let i=0;i<150;i++){                     // the brush, all one way
    x.strokeStyle="rgba("+(Math.random()<0.5?"255,255,255,":"120,120,110,")+
                  (0.04+Math.random()*0.07)+")";
    x.lineWidth=0.5+Math.random()*1.4; x.beginPath();
    const y0=Math.random()*128; x.moveTo(0,y0);
    x.lineTo(128, y0+(Math.random()-0.5)*4); x.stroke();
  }
  noiseDots(x,128,128,300,["rgba(255,255,255,0.16)","rgba(110,105,95,0.14)"]);
  for(let i=0;i<22;i++){                      // chips, down to the primer
    x.fillStyle="rgba(120,108,92,"+(0.14+Math.random()*0.2)+")";
    x.beginPath(); x.arc(Math.random()*128, Math.random()*128, 0.8+Math.random()*2.2, 0, 7);
    x.fill();
  }
  return rep(setSRGB(new T.CanvasTexture(c)), 1, 1);
})();
TEX.enamel=(function(){                       // eggshell paint on anything flat
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#ffffff"; x.fillRect(0,0,128,128);
  noiseDots(x,128,128,1400,["rgba(255,255,255,0.16)","rgba(130,125,115,0.10)"]);
  for(let i=0;i<10;i++){                      // orange peel, and a bit of dirt
    x.fillStyle="rgba(140,132,118,"+(0.03+Math.random()*0.05)+")";
    x.beginPath(); x.ellipse(Math.random()*128, Math.random()*128,
                             8+Math.random()*22, 6+Math.random()*16,
                             Math.random()*3, 0, 7); x.fill();
  }
  return rep(setSRGB(new T.CanvasTexture(c)), 1, 1);
})();
TEX.galv=(function(){                         // galvanised, with its spangle
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#ffffff"; x.fillRect(0,0,128,128);
  for(let i=0;i<34;i++){                      // the crystals
    const px=Math.random()*128, py=Math.random()*128, r=5+Math.random()*13;
    x.fillStyle="rgba("+(Math.random()<0.5?"255,255,255,":"120,126,130,")+
                (0.05+Math.random()*0.09)+")";
    x.beginPath();
    for(let k=0;k<6;k++){ const a=k*1.047+Math.random()*0.3, rr=r*(0.6+Math.random()*0.5);
      const qx=px+Math.cos(a)*rr, qy=py+Math.sin(a)*rr;
      k?x.lineTo(qx,qy):x.moveTo(qx,qy); }
    x.closePath(); x.fill();
  }
  noiseDots(x,128,128,500,["rgba(255,255,255,0.14)","rgba(105,112,116,0.15)"]);
  for(let i=0;i<26;i++){                      // scratches
    x.strokeStyle="rgba(255,255,255,"+(0.06+Math.random()*0.12)+")";
    x.lineWidth=0.4+Math.random()*0.8; x.beginPath();
    const px=Math.random()*128, py=Math.random()*128, a=Math.random()*6, L=4+Math.random()*22;
    x.moveTo(px,py); x.lineTo(px+Math.cos(a)*L, py+Math.sin(a)*L); x.stroke();
  }
  return rep(setSRGB(new T.CanvasTexture(c)), 1, 1);
})();
TEX.weave=(function(){                        // curtains, vinyl, bedding, coats
  const c=cvs(96,96), x=c.getContext("2d");
  x.fillStyle="#ffffff"; x.fillRect(0,0,96,96);
  for(let i=0;i<96;i+=2){
    x.fillStyle="rgba(120,114,104,0.07)"; x.fillRect(i,0,1,96);
    x.fillStyle="rgba(255,255,255,0.22)"; x.fillRect(0,i,96,1);
  }
  noiseDots(x,96,96,700,["rgba(255,255,255,0.14)","rgba(110,104,96,0.13)"]);
  return rep(setSRGB(new T.CanvasTexture(c)), 1, 1);
})();
TEX.rubber=(function(){                       // tyres, hose, mats
  const c=cvs(96,96), x=c.getContext("2d");
  x.fillStyle="#ffffff"; x.fillRect(0,0,96,96);
  noiseDots(x,96,96,1800,["rgba(255,255,255,0.22)","rgba(60,58,55,0.18)"]);
  for(let i=0;i<18;i++){                      // the bloom old rubber gets
    x.fillStyle="rgba(210,208,200,"+(0.04+Math.random()*0.07)+")";
    x.beginPath(); x.arc(Math.random()*96, Math.random()*96, 3+Math.random()*9, 0, 7);
    x.fill();
  }
  return rep(setSRGB(new T.CanvasTexture(c)), 1, 1);
})();

TEX.haze=(function(){                         // a soft edge, so a shaft of light
  const c=cvs(128,128), x=c.getContext("2d");   // has no rectangle around it
  x.clearRect(0,0,128,128);
  const g=x.createRadialGradient(64,64,2, 64,64,63);
  g.addColorStop(0,"rgba(255,255,255,1)");
  g.addColorStop(0.45,"rgba(255,255,255,0.55)");
  g.addColorStop(1,"rgba(255,255,255,0)");
  x.fillStyle=g; x.fillRect(0,0,128,128);
  noiseDots(x,128,128,300,["rgba(255,255,255,0.10)","rgba(0,0,0,0.06)"]);
  return setSRGB(new T.CanvasTexture(c));
})();

TEX.paper=(function(){                        // a page of something, face down
  const c=cvs(96,128), x=c.getContext("2d");
  x.fillStyle="#e4dcc6"; x.fillRect(0,0,96,128);
  noiseDots(x,96,128,420,["rgba(140,118,84,0.10)","rgba(255,255,255,0.20)"]);
  x.fillStyle="#39342c";
  for(let r=0;r<24;r++){                       // typed lines, broken up
    const y=10+r*4.8; if(y>122) break;
    x.globalAlpha=0.22+Math.random()*0.34;
    x.fillRect(9, y, 30+Math.random()*48, 1.5);
    if(Math.random()<0.6) x.fillRect(46+Math.random()*20, y, Math.random()*28, 1.5);
  }
  x.globalAlpha=1;
  for(let i=0;i<5;i++){                        // damp stains, forty summers of them
    x.fillStyle="rgba(150,118,72,"+(0.05+Math.random()*0.10).toFixed(3)+")";
    x.beginPath(); x.ellipse(Math.random()*96, Math.random()*128,
      6+Math.random()*22, 5+Math.random()*16, Math.random()*3, 0, 7); x.fill();
  }
  return setSRGB(new T.CanvasTexture(c));
})();

TEX.siding=(function(){                       // corrugated aluminium, chalked out
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#cfc9bb"; x.fillRect(0,0,128,128);
  for(let i=0;i<128;i+=8){                     // the ribs, lit on one side
    x.fillStyle="rgba(255,255,255,0.34)"; x.fillRect(i,0,3,128);
    x.fillStyle="rgba(84,76,64,0.22)";    x.fillRect(i+4,0,3,128);
  }
  noiseDots(x,128,128,1300,["rgba(255,255,255,0.22)","rgba(96,78,58,0.14)"]);
  for(let i=0;i<16;i++){                       // rust weeping out of the rivets
    x.strokeStyle="rgba(128,72,40,"+(0.06+Math.random()*0.14).toFixed(3)+")";
    x.lineWidth=1+Math.random()*3; x.beginPath();
    const px=Math.random()*128, py=Math.random()*100;
    x.moveTo(px,py); x.lineTo(px+(Math.random()-0.5)*4, py+10+Math.random()*28); x.stroke();
  }
  const t=new T.CanvasTexture(c); t.wrapS=t.wrapT=T.RepeatWrapping; return setSRGB(t);
})();

TEX.checker=(function(){                     // the snack bar floor: checkered, gone
  const c=cvs(256,256), x=c.getContext("2d");
  x.fillStyle="#b9b2a0"; x.fillRect(0,0,256,256);
  for(let i=0;i<8;i++) for(let k=0;k<8;k++){   // the checker, half of it worn off
    if(((i+k)&1)===0) continue;
    x.fillStyle="rgba(46,44,42,"+(0.50+Math.random()*0.34).toFixed(2)+")";
    x.fillRect(i*32, k*32, 32, 32);
  }
  for(let i=0;i<64;i++){                       // where the traffic wore through
    const r=10+Math.random()*44;
    x.fillStyle="rgba(178,170,152,"+(0.10+Math.random()*0.22).toFixed(2)+")";
    x.beginPath(); x.arc(Math.random()*256, Math.random()*256, r, 0, 7); x.fill();
  }
  for(let i=0;i<26;i++){                       // cracks, following the joints and not
    x.strokeStyle="rgba(28,25,22,"+(0.24+Math.random()*0.34).toFixed(2)+")";
    x.lineWidth=0.7+Math.random()*1.6; x.beginPath();
    let px=Math.random()*256, py=Math.random()*256;
    x.moveTo(px,py);
    for(let k=0;k<5;k++){ px+=(Math.random()-0.5)*70; py+=(Math.random()-0.5)*70; x.lineTo(px,py); }
    x.stroke();
  }
  for(let i=0;i<40;i++){                       // droppings, and grit
    x.fillStyle=Math.random()<0.5?"rgba(232,228,216,0.55)":"rgba(70,62,52,0.34)";
    x.beginPath(); x.arc(Math.random()*256, Math.random()*256, 1+Math.random()*4, 0, 7); x.fill();
  }
  noiseDots(x,256,256,2600,["rgba(255,255,255,0.08)","rgba(30,27,24,0.14)"]);
  const t=new T.CanvasTexture(c); t.wrapS=t.wrapT=T.RepeatWrapping; return setSRGB(t);
})();
TEX.sidewalk=(function(){                     // poured walk: aggregate, joints, stains
  const c=cvs(256,256), x=c.getContext("2d");
  x.fillStyle="#6a665c"; x.fillRect(0,0,256,256);  // reads pale in sun; anything lighter blows out
  for(let i=0;i<5200;i++){                     // the aggregate showing through
    const g=(92+Math.random()*64)|0;
    x.fillStyle="rgba("+g+","+((g-8)|0)+","+((g-22)|0)+","+(0.10+Math.random()*0.30).toFixed(2)+")";
    x.beginPath(); x.arc(Math.random()*256, Math.random()*256, 0.5+Math.random()*1.9, 0, 7); x.fill();
  }
  for(let i=0;i<22;i++){                       // where the float dragged
    x.strokeStyle="rgba(255,255,255,"+(0.02+Math.random()*0.05).toFixed(3)+")";
    x.lineWidth=2+Math.random()*7; x.beginPath();
    const y0s=Math.random()*256;
    x.moveTo(0,y0s); x.bezierCurveTo(90,y0s+(Math.random()-0.5)*26, 170,y0s+(Math.random()-0.5)*26,
                                     256,y0s+(Math.random()-0.5)*16);
    x.stroke();
  }
  // The control joint runs ACROSS the walk, one per slab. u maps along the
  // road here, so a cross joint is a column, not a row.
  x.fillStyle="rgba(78,72,64,0.46)"; x.fillRect(0,0,3.0,256);
  x.fillStyle="rgba(255,255,255,0.09)"; x.fillRect(3.0,0,1.6,256);
  x.fillStyle="rgba(78,72,64,0.20)"; x.fillRect(253,0,3,256);
  for(let i=0;i<7;i++){                        // cracks wandering off the joint
    x.strokeStyle="rgba(66,60,52,"+(0.12+Math.random()*0.20).toFixed(3)+")";
    x.lineWidth=0.7+Math.random()*1.3; x.beginPath();
    let px=Math.random()<0.5?4:252, py=Math.random()*256;
    x.moveTo(px,py);
    for(let k=0;k<4;k++){ px+=(px<128?1:-1)*(6+Math.random()*26); py+=(Math.random()-0.5)*40; x.lineTo(px,py); }
    x.stroke();
  }
  for(let i=0;i<16;i++){                       // oil, gum, forty summers
    x.fillStyle="rgba("+(90+Math.random()*40|0)+","+(84+Math.random()*34|0)+","
      +(76+Math.random()*30|0)+","+(0.05+Math.random()*0.13).toFixed(3)+")";
    x.beginPath(); x.ellipse(Math.random()*256, Math.random()*256,
      5+Math.random()*30, 4+Math.random()*20, Math.random()*3, 0, 7); x.fill();
  }
  noiseDots(x,256,256,2200,["rgba(255,255,255,0.10)","rgba(60,56,50,0.12)"]);
  const t=new T.CanvasTexture(c); t.wrapS=t.wrapT=T.RepeatWrapping; return setSRGB(t);
})();

TEX.brick=(function(){                        // a wall that has been leaned on
  const c=cvs(256,256), x=c.getContext("2d");
  x.fillStyle="#4c423c"; x.fillRect(0,0,256,256);          // mortar
  const bw=64, bh=32;
  for(let r=0;r<8;r++){
    const off=(r%2)?bw/2:0;
    for(let i=-1;i<5;i++){
      const px=i*bw+off+2.5, py=r*bh+2.5, t=Math.random();
      x.fillStyle="rgb("+(104+t*54|0)+","+(54+t*30|0)+","+(46+t*24|0)+")";
      x.fillRect(px,py,bw-5,bh-5);
      x.fillStyle="rgba(255,235,210,0.06)"; x.fillRect(px,py,bw-5,2);
      x.fillStyle="rgba(20,12,10,0.16)";    x.fillRect(px,py+bh-7,bw-5,2);
    }
  }
  noiseDots(x,256,256,3000,["rgba(0,0,0,0.16)","rgba(255,230,200,0.06)","rgba(70,40,30,0.18)"]);
  for(let i=0;i<24;i++){                     // smoke and years on it
    x.fillStyle="rgba(28,20,16,"+(0.03+Math.random()*0.09).toFixed(3)+")";
    x.beginPath(); x.ellipse(Math.random()*256, Math.random()*256,
      14+Math.random()*60, 8+Math.random()*34, Math.random()*3, 0, 7); x.fill();
  }
  const t=new T.CanvasTexture(c); t.wrapS=t.wrapT=T.RepeatWrapping; return setSRGB(t);
})();

TEX.plank=(function(){                        // board floor, scuffed down the middle
  const c=cvs(256,256), x=c.getContext("2d");
  const bh=32;
  for(let r=0;r<8;r++){
    const t=Math.random();
    x.fillStyle="rgb("+(120+t*44|0)+","+(84+t*30|0)+","+(52+t*22|0)+")";
    x.fillRect(0,r*bh,256,bh);
    for(let g=0;g<16;g++){                   // grain
      x.strokeStyle="rgba(58,38,22,"+(0.05+Math.random()*0.13).toFixed(3)+")";
      x.lineWidth=0.7+Math.random()*1.4; x.beginPath();
      const y0g=r*bh+2+Math.random()*(bh-4);
      x.moveTo(0,y0g);
      for(let k=1;k<=4;k++) x.lineTo(k*64, y0g+(Math.random()-0.5)*4);
      x.stroke();
    }
    x.fillStyle="rgba(30,18,10,0.55)"; x.fillRect(0,r*bh,256,1.6);        // the joint
    for(let n=0;n<2;n++){                    // butt ends, staggered
      const px=Math.random()*256;
      x.fillStyle="rgba(30,18,10,0.45)"; x.fillRect(px,r*bh,1.6,bh);
    }
  }
  noiseDots(x,256,256,1800,["rgba(0,0,0,0.10)","rgba(255,236,200,0.06)"]);
  const t=new T.CanvasTexture(c); t.wrapS=t.wrapT=T.RepeatWrapping; return setSRGB(t);
})();

TEX.rock=(function(){                         // desert stone: grain, grit, lichen
  const c=cvs(128,128), x=c.getContext("2d");
  x.fillStyle="#7a6551"; x.fillRect(0,0,128,128);
  for(let i=0;i<20;i++){                       // bedding, banded and uneven
    x.fillStyle="rgba("+(88+Math.random()*70|0)+","+(70+Math.random()*52|0)+","
      +(56+Math.random()*44|0)+","+(0.10+Math.random()*0.22).toFixed(3)+")";
    x.beginPath(); x.ellipse(Math.random()*128, Math.random()*128,
      10+Math.random()*44, 3+Math.random()*13, Math.random()*3, 0, 7); x.fill();
  }
  noiseDots(x,128,128,3600,["rgba(255,244,226,0.16)","rgba(38,28,20,0.20)",
                            "rgba(146,118,88,0.20)","rgba(92,72,54,0.22)"]);
  for(let i=0;i<34;i++){                       // cracks
    x.strokeStyle="rgba(34,26,19,"+(0.08+Math.random()*0.20).toFixed(3)+")";
    x.lineWidth=0.6+Math.random()*1.6; x.beginPath();
    let px=Math.random()*128, py=Math.random()*128; x.moveTo(px,py);
    for(let k=0;k<4;k++){ px+=(Math.random()-0.5)*26; py+=(Math.random()-0.5)*26; x.lineTo(px,py); }
    x.stroke();
  }
  for(let i=0;i<26;i++){                       // lichen, on the shaded faces
    x.fillStyle="rgba("+(150+Math.random()*60|0)+","+(160+Math.random()*50|0)+",90,"
      +(0.05+Math.random()*0.13).toFixed(3)+")";
    x.beginPath(); x.arc(Math.random()*128, Math.random()*128, 2+Math.random()*9, 0, 7); x.fill();
  }
  const t=new T.CanvasTexture(c); t.wrapS=t.wrapT=T.RepeatWrapping; return setSRGB(t);
})();

TEX.chain=(function(){                        // chain-link, alpha-cut
  const c=cvs(64,64), x=c.getContext("2d");
  x.clearRect(0,0,64,64);
  x.strokeStyle="rgba(158,164,168,0.9)"; x.lineWidth=1.7; x.lineCap="round";
  for(let i=-64;i<128;i+=16){
    x.beginPath(); x.moveTo(i,0); x.lineTo(i+64,64); x.stroke();
    x.beginPath(); x.moveTo(i,64); x.lineTo(i+64,0); x.stroke();
  }
  const t=new T.CanvasTexture(c); t.wrapS=t.wrapT=T.RepeatWrapping; return setSRGB(t);
})();

TEX.stair=(function(){                        // stair tread nosing
  const c=cvs(64,64), x=c.getContext("2d");
  x.fillStyle="#b4ada0"; x.fillRect(0,0,64,64);
  noiseDots(x,64,64,900,["rgba(0,0,0,0.10)","rgba(255,255,255,0.10)"]);
  return rep(setSRGB(new T.CanvasTexture(c)),1,1);
})();

// numbered brass door plates, one per room
function plateTex(num){
  const c=cvs(96,96), x=c.getContext("2d");
  x.fillStyle="#c9a24b"; x.fillRect(0,0,96,96);
  x.fillStyle="rgba(255,255,255,0.18)"; x.fillRect(0,0,96,10);
  x.fillStyle="#2a2318";
  x.font="700 46px Oswald, sans-serif"; x.textAlign="center"; x.textBaseline="middle";
  x.fillText(String(num), 48, 52);
  return setSRGB(new T.CanvasTexture(c));
}

/* ---- printed faces -------------------------------------------------
   Text fitted to a board, a canvas turned into a sign texture, and the
   panel that carries one. These live here rather than with the signage
   because the motel, the office, the Canteen and half the desert all
   raise signs of their own, and every one of them is built before the
   signage file loads.                                                */
function fitText(x, str, maxW, size, cx, cy){
  x.textAlign="center"; x.textBaseline="middle";
  let s=size;
  do{ x.font="700 "+s+"px Oswald, sans-serif"; s-=1; }
  while(x.measureText(str).width>maxW && s>6);
  x.fillText(str, cx, cy);
}
// The bar's own hand: a serif, set in title case, and never allowed to come
// closer than its own padding to the edge of the board it is painted on.
function fitSerif(x, str, maxW, size, cx, cy, weight){
  x.textAlign="center"; x.textBaseline="middle";
  let s=size;
  do{ x.font=(weight||"700")+" "+s+"px Georgia, 'Times New Roman', Times, serif"; s-=1; }
  while(x.measureText(str).width>maxW && s>6);
  x.fillText(str, cx, cy);
  return s+1;
}
function signTex(w,h,draw){
  const c=cvs(w,h), x=c.getContext("2d");
  draw(x,w,h);
  return setSRGB(new T.CanvasTexture(c));
}
function signPanel(w,h,tex,x,y,z,ry,lit){
  // Every printed face in this world is a plane standing a couple of
  // centimetres proud of the board behind it. Depth precision falls off with
  // the square of the distance — with near at 0.24 a 24-bit buffer resolves
  // about a centimetre at 200 m and four at 400 — so past a couple of hundred
  // metres the board and its own face are the same depth and the pair flicker
  // against each other. That is the pole sign and the GAS · FOOD · ICE board
  // breaking up as you drive away from them. polygonOffset biases in depth
  // units rather than world units, so the face wins at every range.
  const opts={map:tex, polygonOffset:true, polygonOffsetFactor:-2, polygonOffsetUnits:-4};
  const m=new T.Mesh(new T.PlaneGeometry(w,h),
    lit ? new T.MeshBasicMaterial(Object.assign({toneMapped:false}, opts))
        : new T.MeshStandardMaterial(Object.assign({roughness:0.8}, opts)));
  m.position.set(x,y,z); m.rotation.y=ry; scene.add(m);
  return m;
}
