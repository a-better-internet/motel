"use strict";
/* LOW DESERT MOTEL · 18-hud.js
   compass, clock, vacancy, the painted site plan
   Loaded as a classic script, in order, sharing one global scope with
   its siblings — see index.html. */
/* ----------------------------------------------------------------------
   15 · HUD
   ---------------------------------------------------------------------- */
(function compass(){
  const svg=document.getElementById("gaugeSvg"), NS="http://www.w3.org/2000/svg";
  const cx=100, cy=100, R=82, mk=(n,a)=>{const e=document.createElementNS(NS,n);
    for(const k in a) e.setAttribute(k,a[k]); svg.appendChild(e); return e;};
  mk("circle",{cx:cx,cy:cy,r:R,fill:"none",stroke:"rgba(255,179,36,0.28)","stroke-width":2});
  mk("circle",{cx:cx,cy:cy,r:R-26,fill:"none",stroke:"rgba(255,179,36,0.12)","stroke-width":1});
  for(let a=0;a<360;a+=15){
    const big=a%45===0, rad=(a-90)*Math.PI/180;
    mk("line",{x1:cx+Math.cos(rad)*(R-2), y1:cy+Math.sin(rad)*(R-2),
               x2:cx+Math.cos(rad)*(R-(big?13:7)), y2:cy+Math.sin(rad)*(R-(big?13:7)),
               stroke:big?"#ffb324":"rgba(255,179,36,0.5)","stroke-width":big?2:1});
  }
  const g=mk("g",{id:"rose"});
  ["N","E","S","W"].forEach((L,i)=>{
    const rad=(i*90-90)*Math.PI/180;
    const t=document.createElementNS(NS,"text");
    t.setAttribute("x",cx+Math.cos(rad)*(R-26)); t.setAttribute("y",cy+Math.sin(rad)*(R-26)+5);
    t.setAttribute("text-anchor","middle"); t.setAttribute("fill", L==="N"?"#ff7a1a":"#a6741a");
    t.setAttribute("font-family","Oswald, sans-serif"); t.setAttribute("font-size","16");
    t.textContent=L; g.appendChild(t);
  });
  mk("polygon",{id:"needle",points:"100,54 94,72 106,72",fill:"#ff7a1a"});
})();
const hud={ hdg:document.getElementById("hdgNum"), card:document.getElementById("hdgCard"),
            where:document.getElementById("where"), clock:document.getElementById("clock"),
            vac:document.getElementById("vac"), barV:document.getElementById("barV"),
            rose:document.getElementById("rose") };
const CARD=["N","NE","E","SE","S","SW","W","NW"];
const OCCUPIED=ROOMS.filter(r=>r.lit).length, TOTAL=ROOMS.length;
hud.vac.textContent=(TOTAL-OCCUPIED)+" / "+TOTAL+" OPEN";
hud.barV.style.width=Math.round((TOTAL-OCCUPIED)/TOTAL*100)+"%";

let _toastT=null;
function toast(text,color){
  const el=document.getElementById("toast");
  el.textContent=text; el.style.color=color||"#ffb324"; el.classList.add("show");
  clearTimeout(_toastT); _toastT=setTimeout(()=>el.classList.remove("show"),1400);
}
function updateHUD(){
  // the camera looks down -Z at yaw 0, so -Z reads as north and +X as east
  let head=player.yaw;
  if(droneMode) head=droneYaw+Math.PI;
  else if(driving){                      // the compass follows the bonnet
    head=carYaw(driving.veh.body.quaternion)+Math.PI;
  }
  let deg=(-head*180/Math.PI)%360; if(deg<0) deg+=360;
  hud.hdg.textContent=Math.round(deg).toString().padStart(3,"0");
  hud.card.textContent=CARD[Math.round(deg/45)%8];
  hud.rose.setAttribute("transform","rotate("+(-deg)+" 100 100)");
  const h=DayNight.state.hour, hi=Math.floor(h), mi=Math.floor((h-hi)*60);
  hud.clock.textContent=(hi<10?"0":"")+hi+":"+(mi<10?"0":"")+mi;
  const hx=droneMode?dronePos.x:player.pos.x, hz=droneMode?dronePos.z:player.pos.z;
  if(droneMode){ hud.where.textContent="DRONE  ·  "+Math.round(dronePos.y-surfaceY(hx,hz,dronePos.y))+" M AGL"; return; }
  const z=zoneAt(hx, hz, player.feetY);
  if(driving){
    hud.where.textContent=(z||(Math.abs(hz-ROADZ)<9?"ROUTE 66":"OPEN DESERT"))+
      "  ·  "+Math.round(driving.veh.speed*2.237)+" MPH";
    return;
  }
  hud.where.textContent = z ||
    (Math.abs(hz-ROADZ)<9 ? "ROUTE 66" : "OPEN DESERT");
}

/* --- painted site plan ------------------------------------------------ */
const planCv=document.getElementById("planCv"), planX=planCv.getContext("2d");
const PLAN={x0:-54,x1:42,z0:-52,z1:28};
function px(x){ return (x-PLAN.x0)/(PLAN.x1-PLAN.x0)*planCv.width; }
function pz(z){ return (z-PLAN.z0)/(PLAN.z1-PLAN.z0)*planCv.height; }
function rectP(x0,x1,z0,z1,fill,stroke){
  planX.beginPath(); planX.rect(px(x0),pz(z0),px(x1)-px(x0),pz(z1)-pz(z0));
  if(fill){ planX.fillStyle=fill; planX.fill(); }
  if(stroke){ planX.strokeStyle=stroke; planX.lineWidth=1; planX.stroke(); }
}
function drawPlan(){
  planX.clearRect(0,0,planCv.width,planCv.height);
  planX.fillStyle="rgba(13,10,5,0.55)"; planX.fillRect(0,0,planCv.width,planCv.height);
  rectP(-52,40,ROADZ+8,26,"rgba(255,179,36,0.06)","rgba(255,179,36,0.18)");   // lot
  rectP(-340,340,ROADZ-4.5,ROADZ+4.5,"rgba(255,179,36,0.10)",null);          // highway
  rectP(-27.3,27.3,14,20.9,"rgba(95,191,178,0.34)","rgba(255,179,36,0.5)");  // north wing
  rectP(27,33.9,-16,14,"rgba(95,191,178,0.34)","rgba(255,179,36,0.5)");      // east wing
  rectP(OFFICE.x0,OFFICE.x1,OFFICE.z0,OFFICE.z1,"rgba(65,107,86,0.5)","rgba(255,179,36,0.5)");
  rectP(POOL.deck.x0,POOL.deck.x1,POOL.deck.z0,POOL.deck.z1,null,"rgba(111,227,255,0.35)");
  rectP(POOL.x0,POOL.x1,POOL.z0,POOL.z1,"rgba(111,227,255,0.55)","rgba(111,227,255,0.9)");
  rectP(-40.4,-35.6,-31.3,-29.7,"rgba(226,72,45,0.6)",null);                 // pole sign
  const X=px(player.pos.x), Z=pz(player.pos.z);
  planX.save(); planX.translate(X,Z); planX.rotate(-player.yaw);
  planX.beginPath(); planX.moveTo(0,-6); planX.lineTo(4.4,5); planX.lineTo(-4.4,5); planX.closePath();
  planX.fillStyle=player.feetY>2 ? "#ff7a1a" : "#ffb324"; planX.fill();
  planX.restore();
  if(player.feetY>2){
    planX.fillStyle="#ff7a1a"; planX.font="8px 'JetBrains Mono', monospace";
    planX.fillText("2F", X+7, Z+3);
  }
}
