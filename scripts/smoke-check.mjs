import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

// Exercise the compiled app over HTTP without allowing any live database writes.
const content=JSON.parse(fs.readFileSync('data/course-content.json','utf8'));
const directory=JSON.parse(fs.readFileSync('data/uzbekistan-schools.json','utf8'));
const port=3101;
const base=`http://127.0.0.1:${port}`;
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{
  env:{...process.env,SUPABASE_URL:'',SUPABASE_SECRET_KEY:''},
  stdio:['ignore','pipe','pipe'],
  windowsHide:true,
});
let output='';
let timer;
try{
  await new Promise((resolve,reject)=>{
    timer=setTimeout(()=>reject(new Error('Production test server did not start in 20 seconds')),20000);
    child.once('error',reject);
    child.once('exit',code=>reject(new Error(`Production test server exited with ${code}: ${output.slice(-500)}`)));
    child.stderr.on('data',chunk=>{output+=chunk;});
    child.stdout.on('data',chunk=>{output+=chunk;if(output.includes('Ready in'))resolve();});
  });
  clearTimeout(timer);
  const page=await fetch(base,{signal:AbortSignal.timeout(10000)});
  assert.equal(page.status,200);
  const html=await page.text();
  const assets=[...new Set([...html.matchAll(/(?:src|href)="([^" ]+\.(?:js|css)(?:\?[^" ]*)?)"/g)].map(m=>m[1]).filter(path=>path.startsWith('/_next/')))];
  assert.ok(assets.length>0,'The production page must reference compiled assets');
  for(const asset of assets)assert.equal((await fetch(base+asset,{signal:AbortSignal.timeout(10000)})).status,200,asset);

  const post=async(path,body,status)=>{
    const response=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
    assert.equal(response.status,status,`${path}: ${JSON.stringify(await response.json())}`);
  };
  await post('/api/register',{contentVersion:'outdated'},409);
  await post('/api/feedback',{contentVersion:'outdated'},409);
  await post('/api/feedback',{contentVersion:content.version,choice:'invalid'},400);
  await post('/api/feedback',{id:'f762000d-24ed-45d6-9a97-3c68ae6c4bb2',contentVersion:content.version,choice:'no_change',message:'',language:'uz'},503);

  const school=directory.schools[0];
  const district=directory.districts.find(d=>d.id===school.districtId);
  const form={contentVersion:content.version,regionId:district.regionId,districtId:district.id,schoolId:school.id,className:'5-A',firstName:'Local',lastName:'Test'};
  for(const score of [15,16])await post('/api/register',{...form,answers:content.exam.map((q,i)=>i<score?q.a:(q.a+1)%4)},score===15?403:503);
  console.log(`Production HTTP checks passed: home, ${assets.length} assets, stale versions, feedback validation, 15/20 rejection, and safe unconfigured-storage responses.`);
}finally{
  clearTimeout(timer);
  if(child.pid && child.exitCode===null && child.signalCode===null){const stopped=once(child,'exit');child.kill();await stopped;}
}
