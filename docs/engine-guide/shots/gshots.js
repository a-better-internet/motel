/* shots for the engine guide. usage: node gshots.js shots.json
   each shot: {n, cam:[x,y,z], at:[x,y,z], hour, doors:0..1, w, h}
   or {n, mode:"sit", go:[x,z,y], hour}  — sit in the nearest seat, normal loop
   or {n, mode:"car", car:i, hour, sim:steps, steer:-1..1, front:[dx,dy,dz]} */
const {boot}=require('./h.js'); const fs=require('fs');
const SHOTS=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
(async()=>{
  const {b,p,errs}=await boot('test.html',+(process.argv[3]||1280),+(process.argv[4]||720));
  await p.evaluate(()=>{ const t=document.getElementById('toast'); if(t) t.style.display='none';
    window._raf=window.requestAnimationFrame; });
  await p.waitForTimeout(3000);
  for(const s of SHOTS){
    const t0=Date.now();
    if(!s.mode){
      await p.evaluate(s=>{
        MOTEL.dayNight.setHour(s.hour); MOTEL.dayNight.state.paused=true;
        const [cx,cy,cz]=s.cam, [tx,ty,tz]=s.at;
        MOTEL.go(cx,cz,Math.atan2(-(tx-cx),-(tz-cz)), s.feet===undefined?cy-1.66:s.feet);
        const o=s.doors===undefined?1:s.doors;
        for(const d of MOTEL.doors){ d.open=o; d.target=o; d.ajar=o; d.g.rotation.y=d.base+d.swing*o; }
      }, s);
      await p.waitForTimeout(s.settle||5000);
      await p.evaluate(()=>{ window.requestAnimationFrame=()=>0; });
      await p.waitForTimeout(700);
      await p.evaluate(s=>{
        const C=MOTEL.camera; const [cx,cy,cz]=s.cam, [tx,ty,tz]=s.at;
        if(s.fov){ C.fov=s.fov; C.updateProjectionMatrix(); }
        C.position.set(cx,cy,cz); C.up.set(0,1,0); C.lookAt(tx,ty,tz);
        C.updateMatrixWorld(true); MOTEL.renderer.render(MOTEL.scene, C);
      }, s);
    }else if(s.mode==="sit"){
      await p.evaluate(s=>{
        MOTEL.dayNight.setHour(s.hour); MOTEL.dayNight.state.paused=true;
        if(!started) begin();
        if(s.label){ const q=MOTEL.seats.find(z=>z.label===s.label); s.go=[q.x,q.z,q.y-0.45]; }
        MOTEL.go(s.go[0], s.go[1], s.yaw||0, s.go[2]);
        MOTEL.sit();
        if(s.pitch!==undefined) MOTEL.player.pitch=s.pitch;
      }, s);
      await p.waitForTimeout(6000);
      await p.evaluate(s=>{ if(s.pitch!==undefined) MOTEL.player.pitch=s.pitch; }, s);
      await p.waitForTimeout(1500);
      await p.evaluate(()=>{ window.requestAnimationFrame=()=>0; });
      await p.waitForTimeout(700);
      await p.evaluate(()=>{ MOTEL.renderer.render(MOTEL.scene, MOTEL.camera); });
    }else if(s.mode==="car"){
      const info=await p.evaluate(s=>{
        MOTEL.dayNight.setHour(s.hour); MOTEL.dayNight.state.paused=true;
        const c=MOTEL.cars[s.car];
        MOTEL.go(c.g.position.x-2.2, c.g.position.z, 0, 0);
        MOTEL.enterCar(c);
        MOTEL.keys.KeyW=true; if(s.steer>0) MOTEL.keys.KeyA=true; if(s.steer<0) MOTEL.keys.KeyD=true;
        MOTEL.sim(s.sim||120);
        MOTEL.keys.KeyW=false; MOTEL.keys.KeyA=false; MOTEL.keys.KeyD=false;
        MOTEL.keys.KeyS=!!s.brake; MOTEL.sim(s.coast||0); MOTEL.keys.KeyS=false;
        MOTEL.setStepAlpha(1);
        const bp=MOTEL.drivingNow().veh.body.position;
        return [bp.x,bp.y,bp.z, MOTEL.drivingNow().veh.speed];
      }, s);
      console.log('car at', info.map(v=>v.toFixed(2)).join(' '));
      await p.waitForTimeout(5000);
      await p.evaluate(()=>{ MOTEL.keys.Space=true; });
      await p.waitForTimeout(2500);
      await p.evaluate(()=>{ window.requestAnimationFrame=()=>0; });
      await p.waitForTimeout(700);
      await p.evaluate(s=>{
        const car=MOTEL.drivingNow(); MOTEL.showCar(car);
        const C=MOTEL.camera;
        if(s.front){
          const g=car.g, q=g.quaternion;
          const off=new THREE.Vector3(...s.front).applyQuaternion(q);
          C.position.copy(g.position).add(off); C.up.set(0,1,0);
          const look=new THREE.Vector3(...(s.look||[0,0.3,0])).applyQuaternion(q).add(g.position);
          C.lookAt(look);
        }
        C.updateMatrixWorld(true); MOTEL.renderer.render(MOTEL.scene, C);
      }, s);
    }
    await p.screenshot({path:'out/'+s.n+'.png', timeout:180000, animations:'disabled'});
    console.log(s.n, ((Date.now()-t0)/1000).toFixed(0)+'s');
    await p.evaluate(()=>{ window.requestAnimationFrame=window._raf; requestAnimationFrame(frame);
      if(MOTEL.drivingNow()){ MOTEL.keys.Space=false; MOTEL.exitCar(); }
      if(MOTEL.seatedNow()) MOTEL.sit(); MOTEL.dayNight.state.paused=false; });
    await p.waitForTimeout(800);
  }
  console.log('errors', JSON.stringify(errs.slice(0,4)));
  await b.close();
})();
