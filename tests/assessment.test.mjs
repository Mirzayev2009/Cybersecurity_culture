import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {PASS_SCORE,QUESTION_COUNT,validAnswers,scoreAnswers} from '../src/lib/assessment.mjs';
import {createProgress,restoreProgress,validChoiceOrders} from '../src/lib/course-progress.mjs';

const read = path => JSON.parse(fs.readFileSync(new URL(path,import.meta.url),'utf8'));
const content = read('../data/course-content.json');
const key = read('../data/answer-key.json');
const directory = read('../data/uzbekistan-schools.json');

test('bilingual content has complete choices, feedback and balanced coverage', () => {
  assert.equal(content.exam.length,QUESTION_COUNT);
  assert.equal(new Set(content.exam.map(q=>q.id)).size,20);
  assert.deepEqual(content.exam.map(q=>q.a),key);
  assert.deepEqual([0,1,2,3,4].map(cat=>content.exam.filter(q=>q.cat===cat).length),[4,4,4,4,4]);
  for(const lang of ['en','uz']){
    for(const q of content.exam){
      assert.ok(q.q[lang].trim() && q.why[lang].trim());
      assert.equal(q.o.length,4);
      assert.equal(new Set(q.o.map(o=>o[lang].trim())).size,4);
      assert.ok(q.o.every(o=>o[lang].trim()));
      assert.ok(Number.isInteger(q.a) && q.a>=0 && q.a<4);
    }
    const longest=content.exam.filter(q=>q.o[q.a][lang].length===Math.max(...q.o.map(o=>o[lang].length))).length;
    assert.ok(longest<20,`${lang}: choosing the longest option must not solve every item`);
    console.log(`${lang}: correct answer longest in ${longest}/20 items`);
    assert.equal(content.missions.length,6);
    for(const m of content.missions){
      assert.ok(m.scene[lang] && m.question[lang]);
      assert.equal(m.choices.length,3);
      assert.equal(m.feedback.length,3);
      assert.equal(new Set(m.choices.map(o=>o[lang])).size,3);
      assert.equal(new Set(m.feedback.map(o=>o[lang])).size,3);
      assert.ok(m.correct>=0 && m.correct<3);
    }
    for(const q of content.labDecisions){assert.equal(q.o.length,3);assert.equal(q.feedback.length,3);assert.ok(q.feedback.every(f=>f[lang]));}
  }
});

test('scoring boundaries and input validation use canonical choices',()=>{
  assert.equal(scoreAnswers(key,key),20);
  assert.equal(scoreAnswers(key.map(a=>(a+1)%4),key),0);
  for(const count of [15,16]){
    const answers=key.map((a,i)=>i<count?a:(a+1)%4);
    assert.equal(scoreAnswers(answers,key),count);
    assert.equal(scoreAnswers(answers,key)>=PASS_SCORE,count===16);
  }
  for(const invalid of [null,{},[],key.slice(1),[...key,0],key.map(String),key.map(()=>-1),key.map(()=>4),key.map(()=>0.5)]) assert.equal(validAnswers(invalid),false);
  const sparse=Array(20);assert.equal(validAnswers(sparse),false);
  assert.equal(validAnswers(key),true);
});

test('legacy attempts restart without losing preferences or registration history',()=>{
  const prior={lang:'en',langUserSelected:true,collapsed:true,labs:{0:true},labAnswers:{0:1},labChecks:{0:[1]},missionAnswers:{0:1},quizAnswers:Object.fromEntries(key.map((a,i)=>[i,a])),submitted:true,registered:true,homeAnswer:'safe',choiceOrders:[]};
  const migrated=restoreProgress(prior,content.version);
  assert.equal(migrated.contentVersion,content.version);
  assert.equal(migrated.lang,'en');assert.equal(migrated.collapsed,true);
  assert.equal(migrated.previousRegistrationConfirmed,true);
  assert.equal(migrated.registered,false);assert.equal(migrated.submitted,false);
  assert.equal(migrated.migrationNotice,true);
  for(const name of ['labs','labAnswers','labChecks','missionAnswers','quizAnswers'])assert.deepEqual(migrated[name],{});
  assert.equal(migrated.choiceOrders,null);assert.equal(migrated.homeAnswer,'');
  assert.equal(restoreProgress(migrated,content.version).previousRegistrationConfirmed,true);
  const automaticLanguage=restoreProgress({...prior,langUserSelected:false},content.version);
  assert.equal(automaticLanguage.lang,'uz');
});

test('same-version answers and shuffle keep their identities across reloads',()=>{
  const orders=content.exam.map(()=>[3,1,0,2]);
  const state={...createProgress(content.version),quizAnswers:{0:2,4:1},choiceOrders:orders,labChecks:{4:4}};
  const restored=restoreProgress(JSON.parse(JSON.stringify(state)),content.version);
  assert.deepEqual(restored.quizAnswers,{0:2,4:1});
  assert.deepEqual(restored.choiceOrders,orders);assert.equal(restored.labChecks[4],4);
  assert.equal(validChoiceOrders(orders,content.exam),true);
  for(const bad of [null,[],content.exam.map(()=>[0,0,1,2]),content.exam.map(()=>[0,1,2,4])])assert.equal(validChoiceOrders(bad,content.exam),false);
  const sparse=[0,1,2];sparse.length=4;
  assert.equal(validChoiceOrders(content.exam.map(()=>sparse),content.exam),false);
});

function routeHarness(){
  const source=fs.readFileSync(new URL('../src/app/api/register/route.ts',import.meta.url),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const calls=[];
  const context={exports:{},Response,process:{env:{SUPABASE_URL:'https://example.supabase.co',SUPABASE_SECRET_KEY:'test-only-key'}},console:{error(){}},fetch:async(...args)=>{calls.push(args);return new Response(null,{status:201});},require:name=>{
    if(name.includes('uzbekistan-schools'))return directory;
    if(name.includes('answer-key'))return key;
    if(name.includes('course-content'))return content;
    if(name.includes('assessment.mjs'))return {PASS_SCORE,validAnswers,scoreAnswers};
    throw new Error('Unexpected dependency '+name);
  }};
  vm.runInNewContext(compiled,context);
  return {post:context.exports.POST,calls};
}
function submission(correct=20){
  const school=directory.schools[0],district=directory.districts.find(d=>d.id===school.districtId);
  return {contentVersion:content.version,regionId:district.regionId,districtId:district.id,schoolId:school.id,className:'5-A',firstName:'Test',lastName:'Student',answers:key.map((a,i)=>i<correct?a:(a+1)%4)};
}
const request=body=>new Request('http://localhost/api/register',{method:'POST',body:JSON.stringify(body)});

test('registration rejects stale versions before scoring or writing',async()=>{
  const {post,calls}=routeHarness();
  for(const version of [undefined,'old-version']){
    const response=await post(request({...submission(),contentVersion:version}));
    assert.equal(response.status,409);
    assert.equal((await response.json()).code,'CONTENT_VERSION_MISMATCH');
  }
  assert.equal(calls.length,0);
});

test('registration enforces 15/20 versus 16/20 and ignores a client score',async()=>{
  const {post,calls}=routeHarness();
  assert.equal((await post(request({...submission(15),score:20}))).status,403);
  assert.equal(calls.length,0);
  const response=await post(request({...submission(16),score:0}));
  assert.equal(response.status,200);assert.equal((await response.json()).score,16);
  assert.equal(calls.length,1);
  const [url,options]=calls[0];assert.match(url,/\/rest\/v1\/registrations$/);
  const saved=JSON.parse(options.body);assert.equal(saved.score,16);
  assert.equal(options.method,'POST');assert.equal('answers' in saved,false);
});

test('registration preserves malformed-body and twenty-integer validation',async()=>{
  const {post,calls}=routeHarness();
  assert.equal((await post(new Request('http://localhost/api/register',{method:'POST',body:'{'}))).status,400);
  for(const answers of [null,[],key.map(String),key.map(()=>4)])assert.equal((await post(request({...submission(),answers}))).status,400);
  assert.equal(calls.length,0);
});
