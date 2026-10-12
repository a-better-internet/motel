// shared boot for every probe: one chromium, the game loaded, HUD hidden
const {chromium}=require('playwright');
exports.boot=async(page='test.html', vw=900, vh=520)=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-sandbox']});
  const p=await b.newPage({viewport:{width:vw,height:vh}});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  p.on('console',m=>{ if(m.type()==='error'&&!/net::|CERT|Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await p.goto('file://'+__dirname+'/'+page,{waitUntil:'load',timeout:240000});
  await p.waitForFunction('window.MOTEL && window.MOTEL.renderer',null,{timeout:180000});
  await p.evaluate(()=>{document.querySelectorAll('#keys,#cluster,#plan,#mast,#prompt,#hud,#boot')
    .forEach(e=>e&&(e.style.display='none'));});
  return {b,p,errs};
};
