import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as progress from '../src/lib/course-progress.mjs';
import * as feedback from '../src/lib/student-feedback.mjs';
import {webcrypto} from 'node:crypto';

const content=JSON.parse(fs.readFileSync(new URL('../data/course-content.json',import.meta.url),'utf8'));
const source=fs.readFileSync(new URL('../src/lib/cyberculture.js',import.meta.url),'utf8').replace(/^import .+;\r?\n/gm,'').replace('export function initializeCyberculture','function initializeCyberculture');
const storageKey='second-thought-offline-v1';
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function harness(initial,storage,options={}){
  const saved=storage||new Map(initial?[[storageKey,JSON.stringify(initial)]]:[]);
  const elements=new Map();
  function element(id){if(!elements.has(id))elements.set(id,{innerHTML:'',textContent:'',style:{},dataset:{},attrs:{},classList:{toggle(){},add(){},remove(){}},setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},querySelector(){return null;}});return elements.get(id);}
  const listeners={};
  const root={addEventListener(type,callback){listeners[type]=callback;},removeEventListener(type,callback){if(listeners[type]===callback)delete listeners[type];}};
  const document={getElementById:element,documentElement:{},querySelector:()=>element('collapse'),querySelectorAll:()=>[],addEventListener(){},removeEventListener(){}};
  const context={courseContent:content,...progress,...feedback,createFeedbackId:()=>feedback.createFeedbackId(Object.hasOwn(options,'crypto')?options.crypto:webcrypto),fetch:options.fetch|| (async()=>Response.json({ok:true})),document,window:{scrollTo(){}},localStorage:{getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)},confirm:()=>true,console};
  const dispose=vm.runInNewContext(source+'\ninitializeCyberculture(root);',{...context,root});
  return {dispose,click(action,value){listeners.click({target:{closest:()=>({dataset:{action,value:String(value??'')}})}});},changeFeedback(value){listeners.change({target:{name:'feedbackChoice',value}});},typeFeedback(value){listeners.input({target:{id:'feedbackText',value}});},async submitFeedback(){await listeners.submit({target:{id:'feedback-form'},preventDefault(){}});},html:()=>element('screen').innerHTML,state:()=>JSON.parse(saved.get(storageKey)),storage:saved,document};
}
const completed=()=>({...progress.createProgress(content.version),lang:'en',langUserSelected:true,labs:{0:true,1:true,2:true,3:true,4:true},missionAnswers:Object.fromEntries(content.missions.map((m,i)=>[i,m.correct]))});

test('all practice choices show their own bilingual feedback and count attempts',()=>{
  const app=harness();app.click('lang','en');
  for(let i=0;i<6;i++){
    app.click('navigate','missions');app.click('missionSelect',i);
    assert.ok(app.html().includes(escape(content.missions[i].question.en)));
    for(let j=0;j<3;j++){
      app.click('missionChoice',j);
      assert.ok(app.html().includes(escape(content.missions[i].feedback[j].en)));
      assert.equal(app.state().missionAnswers[i],j);
      app.click('lang','uz');
      assert.ok(app.html().includes(escape(content.missions[i].feedback[j].uz)));
      app.click('lang','en');
    }
  }
  assert.equal(Object.keys(app.state().missionAnswers).length,6);
});

test('lesson reflections stay unscored and single decisions complete after an attempt',()=>{
  const app=harness();app.click('lang','en');
  app.click('navigate','lab-0');app.click('emotion',0);
  assert.equal(app.state().labs[0],undefined);
  assert.match(app.html(),/This is not scored/);
  for(let i=0;i<3;i++){
    app.click('navigate',`lab-${i}`);
    for(let j=0;j<3;j++){
      app.click('labChoice',j);
      assert.ok(app.html().includes(escape(content.labDecisions[i].feedback[j].en)));
      assert.equal(app.state().labs[i],true);
    }
  }
  app.click('navigate','lab-3');
  for(let i=0;i<3;i++)app.click('protection',i);
  assert.equal(app.state().labs[3],false);
  app.click('protection',3);assert.equal(app.state().labs[3],true);
  app.click('navigate','lab-4');app.click('incident',4);
  assert.match(app.html(),/trusted technician/);
  assert.equal(app.state().labs[4],undefined);
  app.click('recoveryDone');assert.equal(app.state().labs[4],true);
});

test('final explanations wait for submission and canonical answers survive language and reload',()=>{
  const app=harness(completed());app.click('navigate','test');
  assert.ok(!app.html().includes(escape(content.exam[0].why.en)));
  assert.match(app.html(),/Choose one answer/);
  for(let i=0;i<20;i++){
    app.click('question',i);app.click('answer',content.exam[i].a);
  }
  const orders=app.state().choiceOrders;
  app.click('lang','uz');app.click('question',0);
  assert.ok(app.html().includes(`data-value="${content.exam[0].a}" aria-pressed="true"`));
  const reloaded=harness(undefined,app.storage);reloaded.click('navigate','test');
  assert.deepEqual(reloaded.state().choiceOrders,orders);
  assert.equal(reloaded.state().quizAnswers[0],content.exam[0].a);
  reloaded.click('lang','en');reloaded.click('submit');
  assert.match(reloaded.html(),/20<small>\/ 20/);
  assert.ok(reloaded.html().includes(escape(content.exam[0].why.en)));
  assert.match(reloaded.html(),/data-value="registration"/);
  reloaded.click('retake');
  assert.equal(Object.keys(reloaded.state().quizAnswers).length,0);
  assert.equal(reloaded.state().submitted,false);
});

test('15/20 cannot register and 16/20 can register in the rendered results',()=>{
  for(const score of [15,16]){
    const app=harness({...completed(),submitted:true,quizAnswers:Object.fromEntries(content.exam.map((q,i)=>[i,i<score?q.a:(q.a+1)%4]))});
    app.click('navigate','results');
    assert.equal(app.html().includes('data-value="registration"'),score===16);
    const categoryTotal=[0,1,2,3,4].map(cat=>content.exam.filter((q,i)=>q.cat===cat&&app.state().quizAnswers[i]===q.a).length).reduce((a,b)=>a+b,0);
    assert.equal(categoryTotal,score);
  }
});

test('results place registration directly after the score and feedback before explanations',()=>{
  for(const score of [15,16,20]){
    const app=harness({...completed(),submitted:true,quizAnswers:Object.fromEntries(content.exam.map((q,i)=>[i,i<score?q.a:(q.a+1)%4]))});
    app.click('navigate','results');
    const html=app.html();
    const scorePosition=html.indexOf('class="result-score"');
    const registration=html.indexOf('class="registration-callout"');
    const feedback=html.indexOf('class="student-feedback');
    const breakdown=html.indexOf('class="result-bars"');
    const explanations=html.indexOf('class="review-list"');
    assert.ok(scorePosition<registration && registration<feedback && feedback<breakdown && breakdown<explanations);
    assert.equal((html.match(/class="registration-callout"/g)||[]).length,1);
    assert.equal(html.includes('data-value="registration"'),score>=16);
  }
});

test('students can open the three choices and write-in option without completing the course',()=>{
  const app=harness();app.click('lang','en');
  assert.ok(app.document.getElementById('sideNav').innerHTML.includes('data-value="feedback"'));
  const nav=app.document.getElementById('sideNav').innerHTML;
  assert.ok(nav.indexOf('data-value="feedback"')<nav.indexOf('data-value="lab-0"'));
  app.click('navigate','feedback');
  assert.match(app.html(),/<h1 id="feedbackTitle">Did this course help you/);
  assert.equal((app.html().match(/name="feedbackChoice"/g)||[]).length,4);
  assert.match(app.html(),/It helped a lot/);
  assert.equal(app.state().submitted,false);
  app.changeFeedback('own_words');assert.match(app.html(),/textarea id="feedbackText"/);
  app.typeFeedback('The examples helped me.');app.click('lang','uz');
  assert.match(app.html(),/Bu kurs sizga yordam berdimi/);
  assert.equal(app.state().feedbackText,'The examples helped me.');
});

test('old progress shows update notice, stays locked and remembers past registration',()=>{
  const app=harness({...completed(),contentVersion:'old',registered:true,submitted:true,quizAnswers:Object.fromEntries(content.exam.map((q,i)=>[i,q.a]))});
  assert.match(app.html(),/activities have been updated/);
  assert.equal(Object.keys(app.state().labs).length,0);
  app.click('navigate','test');assert.match(app.html(),/unlocks after/);
  app.click('navigate','home');app.click('dismissUpdate');
  assert.ok(!app.html().includes('activities have been updated'));
  const registered=harness({...completed(),previousRegistrationConfirmed:true,submitted:true,quizAnswers:Object.fromEntries(content.exam.map((q,i)=>[i,q.a]))});
  registered.click('navigate','results');assert.match(registered.html(),/Your earlier registration is saved/);
  assert.ok(!registered.html().includes('data-value="registration"'));
  registered.click('reset');assert.equal(registered.state().previousRegistrationConfirmed,true);
  assert.equal(registered.state().lang,'en');
});

const finished=()=>({...completed(),submitted:true,quizAnswers:Object.fromEntries(content.exam.map((q,i)=>[i,(q.a+1)%4]))});

test('feedback offers three opinions and a custom response for every score',()=>{
  const app=harness(finished());app.click('navigate','results');
  assert.equal((app.html().match(/name="feedbackChoice"/g)||[]).length,4);
  assert.match(app.html(),/Answering is optional and does not affect your score/);
  assert.ok(!app.html().includes('<textarea'));
  app.changeFeedback('own_words');assert.match(app.html(),/<textarea/);
  app.typeFeedback('I liked the practice. </textarea><script>bad</script>');
  app.click('lang','uz');assert.match(app.html(),/Bu kurs sizga yordam berdimi/);
  assert.ok(!app.html().includes('<script>bad'));
  app.click('navigate','guide');app.click('navigate','results');
  assert.equal(app.state().feedbackChoice,'own_words');
  const reloaded=harness(undefined,app.storage);reloaded.click('navigate','results');
  assert.equal(reloaded.state().feedbackText,app.state().feedbackText);
});

test('feedback requires a custom response and never sends a hidden draft',async()=>{
  const calls=[];
  const app=harness(finished(),undefined,{fetch:async(url,options)=>{calls.push([url,JSON.parse(options.body)]);return Response.json({ok:true});}});
  app.click('navigate','results');app.changeFeedback('own_words');app.typeFeedback('   ');
  await app.submitFeedback();assert.equal(calls.length,0);assert.match(app.html(),/1–1000 characters/);
  app.typeFeedback('My personal draft');app.changeFeedback('no_change');
  assert.ok(!app.html().includes('<textarea'));
  await app.submitFeedback();assert.equal(calls.length,1);
  assert.equal(calls[0][0],'/api/feedback');assert.equal(calls[0][1].message,'');
  assert.equal('answers' in calls[0][1],false);assert.equal('score' in calls[0][1],false);
  assert.equal(app.state().feedbackSubmitted,true);assert.match(app.html(),/Thanks for your feedback/);
  await app.submitFeedback();assert.equal(calls.length,1);
});

test('failed feedback keeps its draft and retry ID until storage is confirmed',async()=>{
  const calls=[];
  const app=harness(finished(),undefined,{fetch:async(_,options)=>{calls.push(JSON.parse(options.body));return calls.length===1?Response.json({code:'FEEDBACK_UNAVAILABLE'},{status:503}):Response.json({ok:true});}});
  app.click('navigate','results');app.changeFeedback('own_words');app.typeFeedback('Please add more examples.');
  await app.submitFeedback();assert.equal(app.state().feedbackSubmitted,false);
  assert.match(app.html(),/response is still here/);
  assert.equal(app.state().feedbackText,'Please add more examples.');
  await app.submitFeedback();assert.equal(app.state().feedbackSubmitted,true);
  assert.equal(calls[0].id,calls[1].id);
  const reload=harness(undefined,app.storage);reload.click('navigate','results');
  assert.match(reload.html(),/Thanks for your feedback/);
  assert.ok(!reload.html().includes('id="feedback-form"'));
});

test('editing failed feedback creates a new submission identity',async()=>{
  const calls=[];
  const app=harness(finished(),undefined,{fetch:async(_,options)=>{calls.push(JSON.parse(options.body));return Response.json({code:'FEEDBACK_SAVE_FAILED'},{status:502});}});
  app.click('navigate','results');app.changeFeedback('own_words');app.typeFeedback('First response');
  await app.submitFeedback();app.typeFeedback('Changed response');await app.submitFeedback();
  assert.notEqual(calls[0].id,calls[1].id);
  app.changeFeedback('more_confident');await app.submitFeedback();
  assert.notEqual(calls[1].id,calls[2].id);assert.equal(calls[2].message,'');
});

test('a late feedback response cannot mark a reset attempt as submitted',async()=>{
  let release;
  const waiting=new Promise(resolve=>{release=resolve;});
  const app=harness(finished(),undefined,{fetch:()=>waiting});
  app.click('navigate','results');app.changeFeedback('no_change');
  const pending=app.submitFeedback();
  app.click('reset');
  release(Response.json({ok:true}));await pending;
  assert.equal(app.state().feedbackSubmitted,false);
  assert.equal(app.state().feedbackId,'');assert.equal(app.state().feedbackChoice,'');
  assert.equal(app.state().submitted,false);
  assert.ok(!app.html().includes('Thanks for your feedback'));
});

test('a response body arriving after cleanup cannot overwrite a remounted course',async()=>{
  let release;
  const waiting=new Promise(resolve=>{release=resolve;});
  const app=harness(finished(),undefined,{fetch:async()=>({ok:true,json:()=>waiting})});
  app.click('navigate','results');app.changeFeedback('no_change');
  const pending=app.submitFeedback();await Promise.resolve();await Promise.resolve();
  app.dispose();
  const next=harness(undefined,app.storage);next.click('reset');
  const saved=app.storage.get(storageKey);
  release({ok:true});await pending;
  assert.equal(app.storage.get(storageKey),saved);
  assert.equal(next.state().feedbackSubmitted,false);
});

test('feedback supports LAN crypto and fails gently if secure randomness is unavailable',async()=>{
  const lanCrypto={getRandomValues:bytes=>webcrypto.getRandomValues(bytes)};
  const app=harness(finished(),undefined,{crypto:lanCrypto});
  app.click('navigate','results');app.changeFeedback('no_change');await app.submitFeedback();
  assert.equal(app.state().feedbackSubmitted,true);
  assert.equal(feedback.isFeedbackId(app.state().feedbackId),true);
  let calls=0;
  const unavailable=harness(finished(),undefined,{crypto:null,fetch:async()=>{calls++;return Response.json({ok:true});}});
  unavailable.click('navigate','results');unavailable.changeFeedback('own_words');unavailable.typeFeedback('Please add examples.');
  await unavailable.submitFeedback();
  assert.equal(calls,0);assert.equal(unavailable.state().feedbackSubmitted,false);
  assert.equal(unavailable.state().feedbackText,'Please add examples.');
  assert.match(unavailable.html(),/response is still here/);
});
