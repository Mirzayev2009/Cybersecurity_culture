import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import * as feedback from '../src/lib/student-feedback.mjs';
import {webcrypto} from 'node:crypto';

const content=JSON.parse(fs.readFileSync(new URL('../data/course-content.json',import.meta.url),'utf8'));
const id='7799b174-07cc-4d97-9237-325c9c814c44';
const request=body=>new Request('http://localhost/api/feedback',{method:'POST',body:JSON.stringify(body)});
const payload=()=>({id,contentVersion:content.version,language:'uz',choice:'own_words',message:'Menga misollar yoqdi.'});
function routeHarness(options={}){
  const source=fs.readFileSync(new URL('../src/app/api/feedback/route.ts',import.meta.url),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const calls=[];
  const context={exports:{},Response,process:{env:options.unconfigured?{}:{SUPABASE_URL:'https://example.supabase.co',SUPABASE_SECRET_KEY:'test-only-key'}},fetch:async(...args)=>{calls.push(args);return new Response(null,{status:options.status||201});},require:name=>{
    if(name.includes('course-content'))return content;
    if(name.includes('student-feedback'))return feedback;
    throw new Error('Unexpected dependency '+name);
  }};
  vm.runInNewContext(compiled,context);
  return {post:context.exports.POST,calls};
}

test('feedback choices accept a trimmed custom response and discard hidden text',()=>{
  assert.deepEqual(feedback.normalizeFeedback('own_words','  Good examples.  '),{choice:'own_words',message:'Good examples.'});
  for(const choice of feedback.FEEDBACK_CHOICES.slice(0,3))assert.deepEqual(feedback.normalizeFeedback(choice,'hidden draft'),{choice,message:''});
  for(const text of ['', '   ', null, 'x'.repeat(1001)])assert.equal(feedback.normalizeFeedback('own_words',text),null);
  assert.equal(feedback.normalizeFeedback('unknown','hello'),null);
  assert.ok(feedback.normalizeFeedback('own_words','x'.repeat(1000)));
});

test('both UUID generators produce valid retry IDs without Math.random',()=>{
  assert.equal(feedback.isFeedbackId(feedback.createFeedbackId(webcrypto)),true);
  assert.equal(feedback.isFeedbackId(feedback.createFeedbackId({getRandomValues:bytes=>webcrypto.getRandomValues(bytes)})),true);
  assert.throws(()=>feedback.createFeedbackId(null),/Secure random/);
});

test('feedback storage is separate from student identity and retry-safe',async()=>{
  const {post,calls}=routeHarness();
  const response=await post(request({...payload(),firstName:'Do not save',schoolId:123,score:0,answers:[]}));
  assert.equal(response.status,200);assert.equal((await response.json()).ok,true);
  assert.equal(calls.length,1);
  const [url,options]=calls[0];assert.match(url,/\/student_feedback\?on_conflict=id$/);
  assert.match(options.headers.Prefer,/resolution=ignore-duplicates/);
  assert.deepEqual(JSON.parse(options.body),{id,content_version:content.version,choice:'own_words',message:'Menga misollar yoqdi.',language:'uz'});
});

test('feedback validates stale versions, choices, language, ID and custom length',async()=>{
  const {post,calls}=routeHarness();
  assert.equal((await post(request({...payload(),contentVersion:'old'}))).status,409);
  for(const change of [{choice:'unknown'},{language:'invalid'},{id:'invalid'},{message:'   '},{message:'x'.repeat(1001)}])assert.equal((await post(request({...payload(),...change}))).status,400);
  assert.equal((await post(new Request('http://localhost/api/feedback',{method:'POST',body:'{'}))).status,400);
  assert.equal(calls.length,0);
});

test('feedback reports unavailable storage without claiming success',async()=>{
  const missing=routeHarness({unconfigured:true});
  assert.equal((await missing.post(request(payload()))).status,503);assert.equal(missing.calls.length,0);
  const failed=routeHarness({status:500});
  assert.equal((await failed.post(request(payload()))).status,502);
});
