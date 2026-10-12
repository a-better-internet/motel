const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const p=await b.newPage();
  const fails=[]; p.on('requestfailed',r=>fails.push(r.url()));
  for(const [src,out,foot] of [['cover.html','_cover.pdf',false],['guide.html','_body.pdf',true]]){
    await p.goto('file://'+__dirname+'/'+src,{waitUntil:'networkidle'});
    await p.evaluate(()=>document.fonts.ready);
    const fam=await p.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight).join(', '));
    console.log(src,'fonts:',fam);
    await p.pdf({path:__dirname+'/'+out, format:'Letter', printBackground:true, preferCSSPageSize:true,
      displayHeaderFooter:foot, headerTemplate:'<div></div>',
      footerTemplate:'<div style="width:100%;font-family:Helvetica,Arial,sans-serif;font-size:7px;letter-spacing:1.4px;color:#9a8f82;padding:0 0.78in;display:flex;justify-content:space-between;"><span>LOW DESERT ENGINE · A FIELD GUIDE</span><span><span class="pageNumber"></span></span></div>'});
  }
  console.log('failed requests',fails.length, fails.slice(0,3));
  await b.close();
})();
