import courseContent from "../../data/course-content.json";
import {createProgress,restoreProgress,validChoiceOrders} from "./course-progress.mjs";
import {FEEDBACK_CHOICES,normalizeFeedback,createFeedbackId} from "./student-feedback.mjs";

/**
 * SECOND THOUGHT course rendering and interactions.
 * The initializer scopes clicks to this app and returns React lifecycle cleanup.
 * @param {HTMLElement} root
 */
export function initializeCyberculture(root) {
const B=(en,uz)=>({en,uz});
const text={
intro:B('INTRODUCTION','KIRISH'),labs:B('FIVE LESSONS','BESHTA DARS'),missions:B('PRACTICE SCENARIOS','AMALIY VAZIYATLAR'),test:B('FINAL TEST','YAKUNIY TEST'),guide:B('FIELD GUIDE','AMALIY QO‘LLANMA'),sources:B('EVIDENCE & SOURCES','MANBALAR VA ASOSLAR'),home:B('Start here','Boshlash'),journey:B('THE JOURNEY','O‘QUV YO‘LI'),source:B('Source notes','Manbalar'),
start:B('Start learning','Darsni boshlash'),explore:B('Explore the field guide','Qo‘llanmani ko‘rish'),homeTitle:B('THEY CAN FAKE THE SIGNAL. NOT YOUR JUDGMENT.','ULAR XABARNI SOXTALASHTIRISHI MUMKIN. FIKRLASHINGIZNI EMAS.'),homeDesc:B('A hands-on experience about emotion, evidence, trust and the choices we make online. No code. No lectures disguised as slides.','Hissiyot, dalil, ishonch va internetdagi qarorlarimiz haqidagi interaktiv tajriba. Dasturlashsiz. Oddiy slaydlarsiz.'),heroSmall:B('A COURSE IN HUMAN JUDGMENT','ONGLI QAROR QABUL QILISH KURSI'),
studentLab:B('STUDENT FIELD STUDY / OFFLINE EDITION','O‘QUVCHILAR UCHUN / OFFLAYN NASHR'),startBadge:B('SIMULATED · NOTHING TO CLICK OUTSIDE','SIMULYATSIYA · TASHQI HAVOLA YO‘Q'),
heroSender:B('SCHOOL OFFICE · NEW MESSAGE','MAKTAB MA’MURIYATI · YANGI XABAR'),heroMessage:B('Important: your exam registration will expire in 8 minutes. Send the sign-in code that just arrived on your phone.','Muhim: imtihon uchun ro‘yxatingiz 8 daqiqada bekor qilinadi. Telefoningizga hozir kelgan hisobga kirish kodini yuboring.'),
heroClick:B('Send the sign-in code','Kirish kodini yuborish'),heroPause:B('Contact the school yourself','Maktab bilan o‘zingiz bog‘lanish'),heroFeedbackBad:B('A sign-in code can open your account. Keep it private and contact the school using a number you already know.','Kirish kodi hisobingizni ochishi mumkin. Uni sir saqlang va maktabning avvaldan tanish raqamiga bog‘laning.'),heroFeedbackGood:B('Yes. Use the school’s saved number or another established school contact. Do not use contact details supplied by the message.','Ha. Maktabning saqlangan raqami yoki boshqa avvaldan tanish aloqa yo‘lidan foydalaning. Xabardagi aloqa ma’lumotlariga tayanmang.'),
meta1:B('05 decision labs','05 ta qaror laboratoriyasi'),meta2:B('06 practice missions','06 ta amaliy vaziyat'),meta3:B('20 unseen questions','20 ta yangi savol'),
stage1:B('UNDERSTAND','TUSHUNISH'),stage1desc:B('Learn how attention and emotion are targeted—without blaming students.','E’tibor va hissiyotlardan qanday foydalanilishini o‘rganing — ayblashsiz.'),stage2:B('EXPERIENCE','TAJRIBA'),stage2desc:B('Make safe choices inside realistic simulations and receive meaningful feedback.','Haqiqiy hayotga yaqin vaziyatlarda xavfsiz qaror qabul qiling va izoh oling.'),stage3:B('PROVE','SINAB KO‘RISH'),stage3desc:B('Face 20 fresh situations. Your reasoning matters more than definitions.','20 ta yangi vaziyat. Ta’riflarni yodlashdan ko‘ra fikrlash muhim.'),
stats1:B('human capabilities','insoniy ko‘nikma'),stats2:B('guided scenarios','o‘quv vaziyat'),stats3:B('unseen assessment','yangi savol'),
next:B('Next lesson','Keyingi dars'),previous:B('Previous lesson','Oldingi dars'),nextM:B('Next mission','Keyingi vaziyat'),back:B('Back','Orqaga'),continue:B('Continue','Davom etish'),complete:B('Completed','Bajarildi'),pending:B('Not yet completed','Hali bajarilmadi'),
labExercise:B('DECISION EXPERIMENT / SAFE SIMULATION','QAROR TAJRIBASI / XAVFSIZ SIMULYATSIYA'),think:B('THINK ABOUT THIS','SHU HAQDA O‘YLANG'),what:B('What would you do?','Nima qilgan bo‘lardingiz?'),reason:B('Why it matters','Nima uchun muhim'),
missionIntro:B('Practice before the real world','Haqiqiy vaziyatlardan oldin mashq qiling'),missionSub:B('Six short stories. No real links, no real threats, no secret information. Explore each situation, choose an action and learn from it.','Oltita qisqa hikoya. Haqiqiy havola, tahdid yoki maxfiy ma’lumot yo‘q. Vaziyatni ko‘rib, qaror qiling va saboq oling.'),
missionProgress:B('MISSIONS COMPLETED','BAJARILGAN VAZIYATLAR'),missionAnswered:B('Your choice is saved. The lesson is in the reasoning, not in getting everything right on the first try.','Tanlovingiz saqlandi. Asosiy maqsad birinchi urinishda to‘g‘ri topish emas, sababini tushunishdir.'),
ready:B('Final test','Yakuniy test'),locked:B('The test unlocks after all five lessons and six practice scenarios.','Beshta dars va oltita amaliy vaziyat tugagach, test ochiladi.'),
examStart:B('Start the 20-question test','20 savollik testni boshlash'),examTitle:B('Final test','Yakuniy test'),examDesc:B('20 questions. Choose one answer for each. You can change your choices before submitting. Answers and explanations appear after submission.','20 ta savol. Har biriga bitta javob tanlang. Topshirishdan oldin tanlovlaringizni o‘zgartirishingiz mumkin. To‘g‘ri javoblar va izohlar topshirgach ko‘rinadi.'),
question:B('QUESTION','SAVOL'),of:B('OF','/'),answered:B('answered','javob berildi'),examPrev:B('Previous question','Oldingi savol'),examNext:B('Next question','Keyingi savol'),submit:B('Submit my answers','Javoblarni topshirish'),unanswered:B('Answer all questions before submitting.','Topshirishdan oldin barcha savollarga javob bering.'),
resultsTitle:B('YOUR RESULTS','NATIJANGIZ'),resultSubtitle:B('Keep practicing these habits. A quiz score cannot guarantee protection from future scams.','Bu odatlarni mashq qilishda davom eting. Test bali kelajakdagi firibgarliklardan himoyani kafolatlamaydi.'),score:B('CORRECT ANSWERS','TO‘G‘RI JAVOBLAR'),review:B('Review your answers','Javoblaringizni ko‘rib chiqing'),resultAction:B('Open the safety guide','Xavfsizlik qo‘llanmasini ochish'),retake:B('Try the test again','Testni qayta ishlash'),print:B('Print this summary','Natijani chop etish'),
guideTitle:B('A field guide for a changing internet','O‘zgarayotgan internet uchun amaliy qo‘llanma'),guideDesc:B('The tools will change. These habits should travel with you.','Vositalar o‘zgaradi. Bu odatlar esa siz bilan qolishi kerak.'),guideNote:B('For students: if a situation involves money, threats, private images or account access, involve a trusted adult early. No one deserves blame for being deceived.','O‘quvchilar uchun: vaziyat pul, tahdid, shaxsiy tasvir yoki hisobga kirish bilan bog‘liq bo‘lsa, ishonchli kattadan tezroq yordam so‘rang. Aldangan odamni ayblash to‘g‘ri emas.'),
sourcesTitle:B('The evidence behind the experience','Tajriba asosidagi manbalar'),sourcesDesc:B('Designed using public safety guidance and research on learning, manipulation and verification. This is an educational simulation, not a security scanner or professional certification.','Ochiq xavfsizlik yo‘riqnomalari, manipulyatsiya va ta’lim bo‘yicha tadqiqotlarga tayangan. Bu xavfsizlik skaneri ham, rasmiy sertifikat ham emas.'),
privacy:B('Progress stays in this browser. Registration and feedback are sent only when you submit their forms. No analytics.','O‘quv jarayoni shu brauzerda qoladi. Ro‘yxat ma’lumotlari va fikr faqat o‘z formasini yuborganingizda jo‘natiladi. Tahliliy kuzatuv yo‘q.'),
restart:B('Reset local progress','Mahalliy natijalarni tozalash'),resetConfirm:B('Reset labs, missions and test answers stored in this browser?','Brauzerda saqlangan laboratoriya, vaziyat va test natijalari o‘chirilsinmi?'),
noFear:B('We do not teach fear. We teach a response.','Biz qo‘rquvni emas, to‘g‘ri harakatni o‘rgatamiz.'),
notWeak:B('Your emotions are not a weakness. They are human. Manipulation works by pushing normal reactions into rushed decisions.','Hissiyotlaringiz zaiflik emas. Bu tabiiy holat. Manipulyatsiya oddiy his-tuyg‘ular orqali shoshma-shosharlikka undaydi.'),
unlock:B('FINISH ALL LABS AND MISSIONS TO UNLOCK','OCHISH UCHUN BARCHA MASHQLARNI TUGATING'),
voicePlay:B('Play simulated voice note','Sun’iy ovozli xabarni eshitish'),voiceStop:B('Stop playback','To‘xtatish'),voiceNote:B('This uses your device’s text-to-speech voice, not a cloned person. The transcript is always available.','Bu qurilmangizdagi matnni ovozga aylantirish tizimidan foydalanadi, haqiqiy inson ovozini ko‘chirmaydi. Matn doim mavjud.'),
facilitator:B('COORDINATOR NOTES','KOORDINATOR UCHUN'),
labCompleted:B('Practiced — you tried the activity.','Mashq bajarildi — faoliyatni sinab ko‘rdingiz.'),
needInteract:B('Try the activity and read its feedback to complete this lesson.','Darsni tugatish uchun mashqni sinab ko‘ring va izohni o‘qing.'),
resultReviewCorrect:B('Correct answer','To‘g‘ri javob'),resultReviewWrong:B('Review this answer','Bu javobni ko‘rib chiqing'),
testOverview:B('Choose a numbered question to review or change your answer before submitting.','Topshirishdan oldin savol raqamini bosib javobingizni ko‘rishingiz yoki o‘zgartirishingiz mumkin.'),
finishedM:B('All six scenarios practiced. If you have finished the five lessons, the final test is ready.','Oltita vaziyatni mashq qildingiz. Beshta dars ham tugagan bo‘lsa, yakuniy test tayyor.'),
footer:B('SECOND THOUGHT / LEARN · TEST · REPEAT','IKKINCHI FIKR / O‘RGAN · SINOV · TAKRORLA')
};
const CATS=[B('Pause under pressure','Shoshilmang'),B('Check the facts','Dalilni tekshiring'),B('Check who is asking','Kimligini tekshiring'),B('Protect your accounts','Hisobni himoyalang'),B('Get help','Yordam so‘rang')];
const LABS=[
 {title:B('The moment before a click','Bosishdan oldingi lahza'),subtitle:B('Why urgency changes the way we think.','Shoshilinchlik fikrlashimizga qanday ta’sir qiladi.'),name:CATS[0],teach:B('Fear, excitement, belonging and curiosity are ordinary human experiences. Scammers exploit them by shrinking the time we feel we have to think.','Qo‘rquv, hayajon, jamoaga tegishlilik va qiziqish — tabiiy hissiyotlar. Firibgarlar o‘ylash uchun vaqtimiz yo‘qdek tuyulishidan foydalanadi.'),extra:B('The clue is not that you feel something. The clue is when someone uses that feeling to rush you into a sensitive action. Pause before acting; slowing down is a skill.','Muammo hissiyotning o‘zida emas. Kimdir shu hissiyot orqali sizni maxfiy yoki xavfli qarorga shoshirayotganiga e’tibor bering. Harakatdan oldin bir lahza to‘xtang.'),principle:B('Strong judgment starts by noticing pressure, not by pretending you have no emotions.','To‘g‘ri qaror hissiyotsizlikdan emas, bosimni payqashdan boshlanadi.')},
 {title:B('Proof is not a screenshot','Dalil — shunchaki skrinshot emas'),subtitle:B('Learn to check a claim outside the claim itself.','Xabarni uning o‘zidan tashqarida tekshirishni o‘rganing.'),name:CATS[1],teach:B('A polished website, an official logo or hundreds of reposts can all appear convincing. Appearance and repetition are not proof. Ask who originated a claim and what independent evidence supports it.','Chiroyli sayt, rasmiy logotip yoki yuzlab ulashishlar ishonchli ko‘rinishi mumkin. Tashqi ko‘rinish va takrorlanish dalil emas. Xabar kimdan chiqqanini va mustaqil dalillarni tekshiring.'),extra:B('Leave the suspicious page. Open the organization’s genuine app or a website you already know. Compare the original notice and its date. A top search result or advert can be fake too.','Shubhali sahifadan chiqing. Tashkilotning haqiqiy ilovasi yoki avvaldan tanish saytini oching. Dastlabki e’lon va uning sanasini solishtiring. Qidiruvdagi birinchi natija yoki reklama ham soxta bo‘lishi mumkin.'),principle:B('A claim is not verified just because many copies of it exist.','Bir xabarning ko‘p nusxasi bo‘lishi uning to‘g‘riligini isbotlamaydi.')},
 {title:B('When a familiar voice lies','Tanish ovoz aldaganda'),subtitle:B('Identity needs independent confirmation in the AI era.','AI davrida shaxsni mustaqil tekshirish zarur.'),name:CATS[2],teach:B('AI can help create plausible text, images, audio and video. Old clues like spelling mistakes or strange-looking faces can be absent. An unexpected request must be verified independently, even if it sounds familiar.','AI ishonarli matn, rasm, audio va video yaratishi mumkin. Imlo xatosi yoki g‘alati yuz kabi eski belgilar bo‘lmasligi mumkin. Tanish eshitilsa ham, kutilmagan so‘rovni mustaqil tekshirish kerak.'),extra:B('Call back using a number you already know. Contact a person through an established channel. For family emergencies, an agreed private verification phrase can be an extra layer—not the only one.','Oldindan bilgan raqamingizga qayta qo‘ng‘iroq qiling. Odamga avvaldan ishonchli kanal orqali murojaat qiling. Oilada oldindan kelishilgan maxfiy ibora qo‘shimcha himoya bo‘lishi mumkin, ammo yagona tekshiruv emas.'),principle:B('The question is not “does it look real?” It is “what independently confirms it?”','Savol “haqiqiyga o‘xshaydimi?” emas, “buni mustaqil nima tasdiqlaydi?” bo‘lsin.')},
 {title:B('Protect what matters','Muhim narsalarni himoyalang'),subtitle:B('Security as a small collection of repeatable habits.','Xavfsizlik — takrorlanadigan oddiy odatlar.'),name:CATS[3],teach:B('Good judgment is stronger when basic protections are already in place. Different passwords, an extra sign-in check called two-step verification, official updates and careful sharing reduce risk.','Asosiy himoya oldindan yoqilgan bo‘lsa, oqilona qaror yanada foydali bo‘ladi. Alohida parollar, ikki bosqichli tasdiqlash deb ataladigan qo‘shimcha kirish tekshiruvi, rasmiy yangilanishlar va ehtiyotkor ulashish xavfni kamaytiradi.'),extra:B('Remember: a one-time sign-in code is a key, not an identity test for a stranger. A password manager can help generate and store unique passwords. Keep sign-in codes private. Ask a trusted adult for help with real account settings if needed.','Esda tuting: bir martalik kirish kodi — kalit, notanish odam uchun shaxsni tekshirish vositasi emas. Parol menejeri takrorlanmas parollar yaratish va saqlashga yordam beradi. Kirish kodlarini sir saqlang. Haqiqiy hisob sozlamalarida zarur bo‘lsa, ishonchli kattadan yordam so‘rang.'),principle:B('Protection works through habits, not one magical application.','Himoya birgina mo‘jizaviy ilovadan emas, odatlardan boshlanadi.')},
 {title:B('After something goes wrong','Xato yuz bergandan keyin'),subtitle:B('Recover quickly, ask for help and reject shame.','Tezroq tiklaning, yordam so‘rang, uyalmang.'),name:CATS[4],teach:B('Even thoughtful people make mistakes. What matters next is reducing harm: stop engaging, secure affected accounts through official channels, preserve appropriate evidence and seek help.','Ehtiyotkor insonlar ham xato qilishi mumkin. Keyingi qadam muhim: aloqani to‘xtatish, rasmiy kanal orqali hisobni himoyalash, kerakli dalillarni saqlash va yordam so‘rash.'),extra:B('Clicking a link is different from installing a file, entering a password or sending money. Different events require different responses. Threats or blackmail should never be handled alone by a student.','Havolani ochish, fayl o‘rnatish, parol kiritish yoki pul yuborish — turli holatlar. Har biriga mos chora kerak. Tahdid yoki shantajga o‘quvchi yolg‘iz qarshi turmasligi kerak.'),principle:B('Reporting is a strength. Shame is a tool scammers can exploit.','Xabar berish — kuchlilik belgisi. Uyaltirishdan firibgarlar ham foydalanishi mumkin.')}
];
const MISSIONS=courseContent.missions;
const EXAM=courseContent.exam;
const SOURCES=[
 {name:'NIST — Creating a Culture of Security',desc:B('Interactive, realistic, actionable and testable education over repetitive lectures.','Oddiy ma’ruzadan ko‘ra interaktiv, hayotiy va baholanadigan ta’lim.'),url:'https://www.nist.gov/blogs/manufacturing-innovation-blog/creating-culture-security'},
 {name:'UK Stop! Think Fraud — Recognise the tactics',desc:B('Authority, urgency, emotion and other common manipulation patterns.','Obro‘, shoshilinchlik, hissiyot va boshqa manipulyatsiyalar.'),url:'https://stopthinkfraud.campaign.gov.uk/how-to-spot-fraud/recognise-the-tactics/'},
 {name:'FTC — How to Avoid a Scam',desc:B('Scam recognition, independent checks and reporting.','Firibgarlikni aniqlash, mustaqil tekshirish va xabar berish.'),url:'https://consumer.ftc.gov/articles/how-avoid-scam'},
 {name:'FBI — AI-generated voice and messaging impersonation (2025)',desc:B('Familiar-sounding voices are not sufficient identity evidence; verify using a known channel.','Tanish ovoz shaxsni isbotlamaydi; ishonchli kanal orqali tekshiring.'),url:'https://www.fbi.gov/investigate/cyber/alerts/2025/senior-us-officials-impersonated-in-malicious-messaging-campaign'},
 {name:'FBI IC3 — Generative AI and financial fraud (2024)',desc:B('Examples of generated messages, identity documents and video used in fraud.','Firibgarlikda sun’iy matn, hujjat va videodan foydalanish misollari.'),url:'https://www.ic3.gov/PSA/2024/PSA241203'},
 {name:'CISA — Secure Our World: Four Ways to Stay Safe',desc:B('Phishing, MFA, unique passwords and updates.','Fishing, ko‘p bosqichli tasdiqlash, noyob parollar va yangilanishlar.'),url:'https://www.cisa.gov/sites/default/files/2024-09/Secure-Our-World-4-Easy-Ways-Stay-Safe-Online-Tip-Sheet.pdf'},
 {name:'Stanford / Cambridge et al. — Psychological inoculation (2022)',desc:B('Controlled studies on teaching people to recognize manipulation techniques.','Manipulyatsiyani tanish ko‘nikmasi bo‘yicha nazoratli tadqiqotlar.'),url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC9401631/'},
 {name:'Simchon et al. — Meta-analysis on inoculation (2025)',desc:B('Evidence for gains in distinguishing credible from manipulative content, with limitations.','Ishonchli va manipulyativ mazmunni farqlashdagi o‘sish va cheklovlar.'),url:'https://pubmed.ncbi.nlm.nih.gov/41151144/'},
 {name:'Civic Online Reasoning — Lateral reading study (2021)',desc:B('Students learn to leave a site and check independent sources.','O‘quvchilar saytdan chiqib, mustaqil manbalarni tekshirishni o‘rganadi.'),url:'https://link.springer.com/article/10.1186/s41235-021-00291-4'},
 {name:'UNICEF Uzbekistan — Protecting Children Online (2025)',desc:B('Child privacy, wellbeing, online harm and child-centered support.','Bolalar maxfiyligi, farovonligi va internetda himoya qilish.'),url:'https://www.unicef.org/uzbekistan/en/stories/protecting-children-online'},
 {name:'UZCERT — Questions & Answers',desc:B('Uzbekistan-specific reporting routes for phishing, hacked accounts and financial fraud.','O‘zbekistonda fishing, buzilgan hisob va moliyaviy firibgarlik bo‘yicha yordam yo‘llari.'),url:'https://uzcert.uz/en/questions-answers/'},
 {name:'Government of Uzbekistan — Telegram and suspicious app warning',desc:B('Local examples involving unfamiliar APK files and messaging-platform scams.','Notanish APK-fayllar va messenjer firibgarligi haqida mahalliy ogohlantirish.'),url:'https://gov.uz/en/bekobod/news/view/233523'}
];
const STORAGE='second-thought-offline-v1';
const initial=()=>createProgress(courseContent.version);
let state=initial();try{state=restoreProgress(JSON.parse(localStorage.getItem(STORAGE)),courseContent.version);}catch{}
function newChoiceOrders(){return EXAM.map(q=>{const order=q.o.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}return order;});}
if(!validChoiceOrders(state.choiceOrders,EXAM))state.choiceOrders=newChoiceOrders();
try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{}
let directoryPromise;
function loadDirectory(){return directoryPromise??=fetch('/uzbekistan-schools.json').then(r=>{if(!r.ok)throw new Error('Directory unavailable');return r.json();});}
let view='home';
let feedbackSending=false,feedbackError='';
let disposed=false;
const S=document.getElementById('screen'),rail=document.getElementById('rail');
const l=x=>x&&typeof x==='object'&&Object.hasOwn(x,'en')?(x[state.lang]||x.en):String(x??'');
const t=key=>l(text[key]);
const e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const E=x=>e(l(x));
const doneLabs=()=>Object.values(state.labs).filter(Boolean).length;
const doneMissions=()=>Object.keys(state.missionAnswers).length;
const doneTest=()=>Object.keys(state.quizAnswers).length;
const canTest=()=>doneLabs()===5&&doneMissions()===6;
const overall=()=>Math.round((doneLabs()+doneMissions()+(state.submitted?20:doneTest()))/31*100);
const pick=(lab)=>state.labAnswers[lab]===undefined?null:Number(state.labAnswers[lab]);
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{}}
function navigate(v){view=v;if(v==='test'&&!canTest()&&!state.submitted){view='locked';}if(v==='registration'&&(!state.submitted||resultStats().total<16)){view='results';}render();window.scrollTo({top:0,behavior:'instant'});rail.classList.remove('mobileopen');document.getElementById('overlay').classList.remove('show');}
const foot=()=>`<footer class="footer"><span>${e(t('footer'))} · 2026</span><span>${e(t('privacy'))}</span></footer>`;
const kicker=(s)=>`<div class="section-kicker">${e(s)}</div>`;
function navrender(){
 const uz=state.lang==='uz';
 const items=[
  {v:'home',glyph:'⌂',name:t('home')},
  {v:'feedback',glyph:'?',name:uz?'Fikr bildirish':'Share feedback'},
  {v:'lab-0',glyph:'01',name:l(CATS[0]),complete:state.labs[0]},
  {v:'lab-1',glyph:'02',name:l(CATS[1]),complete:state.labs[1]},
  {v:'lab-2',glyph:'03',name:l(CATS[2]),complete:state.labs[2]},
  {v:'lab-3',glyph:'04',name:l(CATS[3]),complete:state.labs[3]},
  {v:'lab-4',glyph:'05',name:l(CATS[4]),complete:state.labs[4]},
  {v:'missions',glyph:'◎',name:uz?'Amaliy vaziyatlar':'Practice scenarios',note:`${doneMissions()}/6`},
  {v:'test',glyph:'✓',name:uz?'Yakuniy sinov':'Final assessment',note:state.submitted?'✓':`${doneTest()}/20`},
  {v:'guide',glyph:'▤',name:uz?'Foydali qo‘llanma':'Safety guide'},
  {v:'sources',glyph:'↗',name:t('source')}
 ];
 let out=`<div class="navcaption">${uz?'BOSH SAHIFA':'WELCOME'}</div>`;
 items.forEach(it=>{
  if(it.v==='lab-0')out+=`<div class="navcaption navchapter"><span class="nav-chapter-num">01</span>${uz?'BILIB OLING · 5 DARS':'LEARN · 5 LESSONS'}</div>`;
  if(it.v==='missions')out+=`<div class="navcaption navchapter"><span class="nav-chapter-num">02</span>${uz?'MASHQ QILING':'PRACTICE'}</div>`;
  if(it.v==='test')out+=`<div class="navcaption navchapter"><span class="nav-chapter-num">03</span>${uz?'BILIMNI SINANG':'CHECK YOUR SKILLS'}</div>`;
  if(it.v==='guide')out+=`<div class="navcaption navchapter"><span class="nav-chapter-num">?</span>${uz?'YORDAM':'REFERENCE'}</div>`;
  const active=it.v===view||(view==='locked'&&it.v==='test')||(view==='results'&&it.v==='test');
  out+=`<button type="button" class="navitem ${active?'active':''} ${it.complete?'isdone':''}" data-action="navigate" data-value="${it.v}" title="${e(it.name)}" ${active?'aria-current="page"':''}><span class="navglyph">${it.complete?'✓':it.glyph}</span><span class="nav-text">${e(it.name)}</span>${it.note?`<span class="nav-index">${it.note}</span>`:''}</button>`;
 });
 document.getElementById('sideNav').innerHTML=out;
 document.getElementById('headProgress').textContent=overall()+'% '+(uz?'bajarildi':'complete');
 const prog=document.getElementById('headProgressBar');if(prog)prog.style.width=overall()+'%';
 const label=view.startsWith('lab-')?`${uz?'DARS':'LESSON'} ${Number(view.slice(4))+1} / 5 · ${l(LABS[Number(view.slice(4))].name)}`:view==='home'?(uz?'Bosh sahifa':'Home'):view==='results'?t('resultsTitle'):view==='locked'?t('test'):view==='missions'?(uz?'Amaliy vaziyatlar':'Scenarios'):view==='test'?(uz?'Yakuniy sinov':'Assessment'):view==='guide'?t('guide'):view==='feedback'?(uz?'Fikr bildirish':'Share feedback'):view==='sources'?t('sources'):view;
 document.getElementById('breadcrumb').textContent=label;
 document.querySelectorAll('.lang-switch button').forEach(b=>{b.classList.toggle('selected',b.dataset.value===state.lang);b.setAttribute('aria-pressed',String(b.dataset.value===state.lang));});
 document.getElementById('brandCaption').textContent=uz?'KIBERXAVFSIZLIK MADANIYATI':'CYBERSECURITY CULTURE';
 document.getElementById('railFooter').innerHTML=uz?'KOD YOZISH EMAS.<br>TO‘G‘RI QAROR QILISH.<br><span style="color:#f7ab87">2026 / O‘QUV TAJRIBASI</span>':'NO CODE REQUIRED.<br>BETTER DECISIONS.<br><span style="color:#f7ab87">2026 / STUDENT LAB</span>';
 rail.classList.toggle('collapsed',!!state.collapsed);
 const c=document.querySelector('.collapsebtn');if(c){c.setAttribute('aria-label',uz?(state.collapsed?'Menyuni ochish':'Menyuni yig‘ish'):(state.collapsed?'Expand menu':'Collapse menu'));c.title=c.getAttribute('aria-label');}
}
function home(){
 const uz=state.lang==='uz', tr=(x,y)=>e(uz?y:x);
 const nextLab=LABS.findIndex((_,i)=>!state.labs[i]);
 const nextView=nextLab>=0?`lab-${nextLab}`:doneMissions()<6?'missions':state.submitted?'results':'test';
 const mainButton=nextLab>=0?(doneLabs()?'continue':'start'):doneMissions()<6?'missions':state.submitted?'resultsTitle':'examStart';
 const feedback=state.homeAnswer?`<div class="specimen-feedback ${state.homeAnswer==='safe'?'good':'caution'}" role="status"><b>${tr(state.homeAnswer==='safe'?'Good instinct':'Notice the pressure',state.homeAnswer==='safe'?'To‘g‘ri yo‘nalish':'Shoshilishga e’tibor bering')}</b><p>${e(t(state.homeAnswer==='safe'?'heroFeedbackGood':'heroFeedbackBad'))}</p></div>`:'';
 const journey=[
  {n:'01',title:tr('Learn the basics','Bilib oling'),desc:tr('5 short lessons on staying safe online.','Internet xavfsizligi haqida 5 ta qisqa dars.'),counter:`${doneLabs()}/5`,to:doneLabs()<5?`lab-${Math.max(0,nextLab)}`:'lab-0',done:doneLabs()===5},
  {n:'02',title:tr('Put it into practice','Mashq qiling'),desc:tr('Try your choices in 6 everyday situations.','6 ta hayotiy vaziyatda qaror qiling.'),counter:`${doneMissions()}/6`,to:'missions',done:doneMissions()===6},
  {n:'03',title:tr('Take the final test','Yakuniy testni ishlang'),desc:tr('20 questions. Aim for at least 16 correct.','20 ta savol. Kamida 16 tasiga to‘g‘ri javob bering.'),counter:state.submitted?'✓':`${doneTest()}/20`,to:state.submitted?'results':'test',done:state.submitted}
 ];
 const labDescriptions=[
  tr('Understand how urgency and excitement affect choices.','Qo‘rquv, hayajon va shoshilish qarorga qanday ta’sir qiladi?'),
  tr('Separate claims from evidence.','Xabar bilan dalilning farqini aniqlang.'),
  tr('Verify identities and requests independently.','Shaxs va so‘rovni mustaqil tekshirishni o‘rganing.'),
  tr('Protect your accounts and personal information.','Hisoblar va shaxsiy ma’lumotlarni asrang.'),
  tr('Know what to do when something goes wrong.','Muammo yuz bersa, qanday harakat qilishni biling.')
 ];
 return `<div class="view landing">
 ${updateNotice()}
 <section class="welcome" aria-labelledby="homeMainTitle">
  <div class="welcome-left">
   <h1 id="homeMainTitle"><span>${tr('Spot the scam.','Aldovni payqang.')}</span><em>${tr('Keep control.','O‘zingizni asrang.')}</em></h1>
   <p class="welcome-description">${tr('Practice spotting suspicious messages and protecting your accounts in real-life situations.','Shubhali xabarlarni tekshirish va hisoblaringizni himoyalashni hayotiy vaziyatlarda mashq qiling.')}</p>
   <div class="hero-action"><button class="primary hero-primary" data-action="navigate" data-value="${nextView}">${e(t(mainButton))}<span aria-hidden="true">→</span></button></div>
   <p class="reassurance">${tr('No experience needed. All examples are safe to try.','Tajriba talab qilinmaydi. Barcha mashqlar xavfsiz.')}</p>
  </div>
  <div class="demo-card" aria-label="${tr('Interactive example','Interaktiv namuna')}">
   <div class="demo-top"><span class="demo-live">${tr('Would you trust this message?','Bu xabarga ishonasizmi?')}</span></div>
   <div class="demo-content"><div class="demo-heading"><div class="chat-avatar">M</div><div><b>${e(t('heroSender'))}</b><small>${tr('New message · Sample','Yangi xabar · Namuna')}</small></div><span class="demo-time">08:47</span></div>
   <div class="demo-message">${e(t('heroMessage'))}</div>
   <p class="demo-question">${tr('A fictional message asks for your sign-in code. What do you do?','Xayoliy xabar kirish kodingizni so‘ramoqda. Nima qilasiz?')}</p><p class="smallnote">${chooseOne()}</p>
   <div class="demo-buttons"><button data-action="homeChoice" data-value="risky" class="demo-choice ${state.homeAnswer==='risky'?'selected':''}" aria-pressed="${state.homeAnswer==='risky'}">${e(t('heroClick'))}</button><button data-action="homeChoice" data-value="safe" class="demo-choice ${state.homeAnswer==='safe'?'selected':''}" aria-pressed="${state.homeAnswer==='safe'}">${e(t('heroPause'))}</button></div>
   ${feedback}<div class="demo-safe">${tr('Practice only. No real codes or accounts.','Bu faqat mashq. Haqiqiy kod yoki hisob ishlatilmaydi.')}</div></div>
  </div>
  <section class="registration-goal" aria-labelledby="registrationGoalTitle">
   <strong class="registration-score" aria-label="${tr('At least 16 out of 20 correct answers','20 ta savoldan kamida 16 ta to‘g‘ri javob')}">16<span>/20</span></strong>
   <div><h2 id="registrationGoalTitle">${tr('Pass the test. Then register.','Testdan o‘ting. Ro‘yxatdan o‘ting.')}</h2><p>${tr('Finish the lessons and practice. Score at least 16/20 on the final test to register your school details.','Dars va mashqlarni tugating. Yakuniy testdan kamida 16/20 ball oling, so‘ng maktab ma’lumotlaringiz bilan ro‘yxatdan o‘ting.')}</p></div>
  </section>
 </section>
 <section class="path-section" aria-labelledby="pathTitle"><div class="section-topline"><h2 id="pathTitle">${tr('Start here. Finish in three steps.','Boshlash uchun 3 qadam.')}</h2><div class="path-progress"><strong>${overall()}%</strong><span>${tr('complete','bajarildi')}</span><div class="path-progress-track"><i style="width:${overall()}%"></i></div></div></div>
 <div class="path-cards">${journey.map(j=>`<button class="path-card ${j.done?'path-done':''}" data-action="navigate" data-value="${j.to}"><span class="path-card-top"><span class="path-step">${j.n} / 03</span><span class="path-counter">${j.counter} ${j.done?'✓':''}</span></span><strong>${j.title}</strong><span class="path-desc">${j.desc}</span><span class="path-open">${tr('Open section','Bo‘limni ochish')} <span aria-hidden="true">↗</span></span></button>`).join('')}</div></section>
 <details class="skills-section"><summary>${tr('Browse all 5 lessons','Barcha 5 ta darsni ko‘rish')}</summary>
 <div class="skills-grid">${LABS.map((lab,i)=>`<button class="skill-card" data-action="navigate" data-value="lab-${i}"><span class="skill-index">0${i+1}</span><strong>${E(lab.name)}</strong><span class="skill-description">${labDescriptions[i]}</span><span class="skill-bottom">${state.labs[i]?tr('Completed ✓','Bajarilgan ✓'):tr('Open lesson ↗','Darsni ochish ↗')}</span></button>`).join('')}</div></details>
 <div class="bottom-pledge"><p>${tr('Not sure what to do with a suspicious message?','Shubhali xabar kelsa, nima qilishni bilmayapsizmi?')}</p><button class="textbtn" data-action="navigate" data-value="guide">${tr('Read the safety guide','Qo‘llanmani ko‘rish')} ↗</button></div>
 ${foot()}</div>`;
}
function response(idx,good,explanation){return `<div class="response ${good?'':'warn'}" role="status"><strong>${good?(state.lang==='uz'?'To‘g‘ri javob':'Correct answer'):(state.lang==='uz'?'Izohni ko‘rib chiqing':'Read the explanation')}</strong><p>${e(explanation)}</p></div>`;}
const cb=(label,index,selected,action,mode='choice',letter=index)=>`<button class="${mode} ${selected?'selected':''}" data-action="${action}" data-value="${index}" aria-pressed="${selected?'true':'false'}">${mode==='choice'?`<span class="letter">${String.fromCharCode(65+letter)}</span>`:''}<b>${e(label)}</b></button>`;
function chooseOne(){return state.lang==='uz'?'Bitta javobni tanlang.':'Choose one answer.';}
function updateNotice(){return state.migrationNotice?`<div class="alertbox" role="status"><p>${state.lang==='uz'?'Mashqlar yangilandi. O‘qishni boshidan boshlang. Avval yuborgan ro‘yxat ma’lumotlaringiz saqlanib qoladi.':'The activities have been updated. Start a fresh attempt. Any registration you already submitted remains saved.'}</p><button class="textbtn" data-action="dismissUpdate">${state.lang==='uz'?'Tushunarli':'Got it'}</button></div>`:'';}
function decision(idx){const q=courseContent.labDecisions[idx],answer=pick(idx);return `<p class="interact-kicker">${E(q.q)}</p><p class="smallnote">${chooseOne()}</p><div class="choice-grid" role="group" aria-label="${chooseOne()}">${q.o.map((x,i)=>cb(l(x),i,answer===i,'labChoice')).join('')}</div>${answer!==null?response(idx,answer===q.a,l(q.feedback[answer])):''}`;}
function lessonExample(idx){
 const examples={
  1:B('An old notice can be real and still have the wrong deadline. Check the year and current official notice. If a report says 8 of 80 pupils shared a code, a headline saying “all pupils” does not match it.','Eski e’lon haqiqiy bo‘lsa ham, muddati eskirgan bo‘lishi mumkin. Yil va hozirgi rasmiy e’lonni tekshiring. Hisobotda 80 o‘quvchidan 8 nafari kod ulashgan deyilsa, “barcha o‘quvchilar” degan sarlavha unga mos emas.'),
  2:B('A QR code can open a web address. Scanning it does not prove the site is approved or safe. Before entering information, check the organizer’s official route that you already know.','QR kod veb-manzilni ochishi mumkin. Ochilgani sayt ma’qullangan yoki xavfsiz ekanini isbotlamaydi. Ma’lumot kiritishdan oldin tashkilotchining avvaldan tanish rasmiy yo‘lidan tekshiring.'),
  3:B('Two-step verification adds an extra sign-in check beyond your password, for example an approval in an authenticator app. Turn it on in the genuine service’s security settings with trusted help if needed. It does not block every fake website.','Ikki bosqichli tasdiqlash paroldan tashqari yana bir kirish tekshiruvini qo‘shadi, masalan tasdiqlash ilovasidagi ruxsat. Uni haqiqiy xizmatning xavfsizlik sozlamalarida, zarur bo‘lsa ishonchli yordam bilan yoqing. Bu barcha soxta saytlarni to‘smaydi.')
 };return examples[idx]?`<div class="scene"><strong>${state.lang==='uz'?'Qisqa misol':'A short example'}</strong><p>${E(examples[idx])}</p></div>`:'';
}
function labWidget(idx){
 if(idx===0){const emotions=state.labChecks[0]||[],feelings=[B('Fear','Qo‘rquv'),B('Urgency','Shoshilish'),B('Curiosity','Qiziqish'),B('Relief','Yengillik')];
 return `<div class="scene"><div class="sender">${state.lang==='uz'?'XAYOLIY MAKTAB XABARI':'FICTIONAL SCHOOL MESSAGE'}</div><p>${state.lang==='uz'?'“Besh daqiqada hisobga kirish kodini yubormasangiz, ertangi imtihon ro‘yxatingiz bekor bo‘ladi.” Maktabning avvaldan saqlangan raqami sizda bor.':'“Send your account sign-in code within five minutes or lose your place in tomorrow’s exam.” You have the school’s number saved from before this message.'}</p></div><p class="smallnote">${state.lang==='uz'?'Fikrlab ko‘ring — sezgan hissiyotlaringizni tanlang. Bu baholanmaydi.':'Reflection — choose any feelings you notice. This is not scored.'}</p><div class="chips">${feelings.map((f,i)=>`<button class="chip ${emotions.includes(i)?'selected':''}" data-action="emotion" data-value="${i}" aria-pressed="${emotions.includes(i)}">${E(f)}</button>`).join('')}</div>${decision(idx)}`;
 }
 if(idx===1){const checked=state.labChecks[1]||[];const checks=[
 {h:B('It has a university seal.','Unda universitet muhri bor.'),d:B('A seal can be copied. Appearance is not independent proof.','Muhrni ko‘chirish mumkin. Ko‘rinish mustaqil dalil emas.')},
 {h:B('The page says “98% trusted.”','Sahifada “98% ishonchli” deyilgan.'),d:B('A page can give itself a trust score.','Sahifa o‘ziga o‘zi ishonchlilik bahosi qo‘yishi mumkin.')},
 {h:B('The known official website confirms the offer.','Tanish rasmiy sayt taklifni tasdiqlaydi.'),d:B('This is useful when the address was already known and the details match.','Manzil avvaldan tanish bo‘lib, tafsilotlar mos kelsa, bu foydali dalil.')},
 {h:B('Classmates shared the screenshot.','Sinfdoshlar skrinshotni ulashgan.'),d:B('Sharing can repeat the same unverified source.','Ulashish o‘sha tekshirilmagan manbani takrorlashi mumkin.')}];
 return `<div class="scene"><p>${state.lang==='uz'?'Grant sahifasi hujjat va to‘lov so‘ramoqda. Universitetning rasmiy sayti oldingi darsdan sizda saqlangan.':'A scholarship page asks for an ID and a fee. You have the university’s official website saved from an earlier lesson.'}</p></div><p class="smallnote">${state.lang==='uz'?'Dalillarni ko‘rib chiqing — istalgan kartani oching. Bu savol emas, izlanish mashqi.':'Explore the evidence — open any card. This is an unscored exploration.'}</p><div class="evidence-list">${checks.map((x,i)=>`<button class="evidence ${checked.includes(i)?'selected':''}" data-action="evidence" data-value="${i}" aria-expanded="${checked.includes(i)}"><span><b>${E(x.h)}</b>${checked.includes(i)?`<small>${E(x.d)}</small>`:''}</span><span class="plus">${checked.includes(i)?'−':'+'}</span></button>`).join('')}</div>${decision(idx)}`;
 }
 if(idx===2){const heights=[12,30,50,24,70,39,58,14,44,64,26,75,35,42,16,47,68,21,52,35,18,57,42,26,70,31,50,15,34,60,21,46,33];
 return `<div class="scene"><div class="sender">${state.lang==='uz'?'OVOZLI XABAR · NOTANISH RAQAM':'VOICE MESSAGE · UNKNOWN NUMBER'}</div><p class="smallnote">${state.lang==='uz'?'Opangizning odatdagi raqami sizda avvaldan saqlangan.':'You already have your sister’s usual number saved.'}</p><div class="waveform" aria-hidden="true">${heights.map(h=>`<i style="height:${h}%"></i>`).join('')}</div><p><b>${state.lang==='uz'?'Xabar matni:':'Transcript:'}</b> ${state.lang==='uz'?'“Men opangman. Shoshilinch yordam kerak. Eski raqamga qo‘ng‘iroq qilma. Pulni yangi kartaga o‘tkaz.”':'“It’s your sister. I need urgent help. Do not call my old number. Send the money to this new card.”'}</p><button class="secondary" data-action="playVoice">▶ ${e(t('voicePlay'))}</button> <button class="textbtn" data-action="stopVoice">${e(t('voiceStop'))}</button><p class="smallnote">${e(t('voiceNote'))}</p></div>${decision(idx)}`;
 }
 if(idx===3){const enabled=state.labChecks[3]||[],protections=[
 {t:B('Different passwords','Alohida parollar'),d:B('Use a different strong password for each account. A password manager can help.','Har bir hisobga boshqa kuchli parol qo‘ying. Parol menejeri yordam beradi.')},
 {t:B('Two-step verification','Ikki bosqichli tasdiqlash'),d:B('Add an extra sign-in check where offered. Keep sign-in codes private.','Mavjud bo‘lsa, qo‘shimcha kirish tekshiruvini yoqing. Kirish kodlarini sir saqlang.')},
 {t:B('Official updates','Rasmiy yangilanishlar'),d:B('Update through the genuine app store or device settings.','Haqiqiy ilova do‘koni yoki qurilma sozlamalari orqali yangilang.')},
 {t:B('Careful sharing','Ehtiyotkor ulashish'),d:B('Hide phone numbers, ID numbers and other private details before posting.','Ulashishdan oldin telefon, ID raqami va boshqa shaxsiy ma’lumotni yoping.')}];
 return `<p class="smallnote">${state.lang==='uz'?'Odatlar ro‘yxati — to‘rttalasini ko‘rib chiqing. Bu bitta javobli test emas. Haqiqiy sozlamalaringiz o‘zgarmaydi.':'Habit checklist — explore all four. This is not a single-answer test. These controls do not change real settings.'}</p><div class="protect-grid">${protections.map((x,i)=>`<button class="protection ${enabled.includes(i)?'selected':''}" data-action="protection" data-value="${i}" aria-pressed="${enabled.includes(i)}"><span class="check">${enabled.includes(i)?'✓':'+'}</span><b>${E(x.t)}</b><small>${E(x.d)}</small></button>`).join('')}</div><p class="smallnote">${enabled.length}/4 ${state.lang==='uz'?'odat ko‘rib chiqildi':'habits explored'}</p><div class="meterline"><div style="width:${enabled.length*25}%"></div></div>${enabled.length===4?response(idx,true,l(B('You explored all four habits. Use trusted help to apply them to real settings later.','To‘rtta odatni ko‘rib chiqdingiz. Keyin ularni haqiqiy sozlamalarda ishonchli yordam bilan qo‘llang.'))):''}`;
 }
 const incident=state.labChecks[4];
 const scenarios=[B('I only opened a link','Faqat havola ochdim'),B('I entered a password or code','Parol yoki kod kiritdim'),B('I sent money','Pul yubordim'),B('Someone is threatening me','Menga tahdid qilishmoqda'),B('I installed an unknown app','Notanish ilova o‘rnatdim')];
 const steps=[
 [B('Close the suspicious page without following more instructions.','Shubhali sahifani ko‘rsatmalariga amal qilmasdan yoping.'),B('Do not install files or enter information. Keep your browser and device updated. A page visit alone does not establish whether a device is safe.','Fayl o‘rnatmang va ma’lumot kiritmang. Brauzer va qurilmani yangilab turing. Faqat sahifa ochilganiga qarab qurilma xavfsizligini aniqlab bo‘lmaydi.'),B('Report the link to the platform or a trusted adult.','Havolani platformaga yoki ishonchli kattaga bildiring.')],
 [B('Open the genuine service directly. Ask a trusted adult for help if needed.','Haqiqiy xizmatni mustaqil oching. Zarur bo‘lsa, ishonchli kattadan yordam so‘rang.'),B('Change any exposed password and any reused copies. Review devices signed in and close unfamiliar sessions. A shared code may already have allowed a sign-in.','Oshkor bo‘lgan parol va boshqa joyda qayta ishlatilgan nusxalarini almashtiring. Hisobga kirgan qurilmalarni tekshirib, begonalarini uzing. Ulashilgan kod hisobga kirish imkonini allaqachon bergan bo‘lishi mumkin.'),B('Enable two-step verification. Follow the service’s genuine recovery instructions if you cannot sign in. Changing a password may not close every session.','Ikki bosqichli tasdiqlashni yoqing. Kira olmasangiz, xizmatning haqiqiy tiklash yo‘riqnomasiga amal qiling. Parolni almashtirish barcha kirgan qurilmalarni avtomatik uzmasligi mumkin.')],
 [B('Tell a trusted adult promptly and contact the bank or payment provider through its genuine app or known number.','Tezda ishonchli kattaga ayting va bank yoki to‘lov xizmatiga haqiqiy ilovasi yoki tanish raqami orqali bog‘laning.'),B('Keep transaction details, messages and payment time. Ask the provider what can be done.','To‘lov ma’lumotlari, xabarlar va to‘lov vaqtini saqlang. Xizmatdan nima qilish mumkinligini so‘rang.'),B('Report through official channels. Do not pay unknown recovery helpers; refunds are not guaranteed.','Rasmiy kanallar orqali xabar bering. Notanish “pul qaytaruvchilar”ga to‘lamang; pulning qaytishi kafolatlanmaydi.')],
 [B('Tell a trusted adult now. You are not to blame and do not have to handle threats alone.','Hozir ishonchli kattaga ayting. Ayb sizda emas, tahdidga yolg‘iz qarshi turishingiz shart emas.'),B('Stop engaging. Do not pay, retaliate or forward private images.','Aloqani to‘xtating. Pul to‘lamang, javoban tahdid qilmang va shaxsiy rasmlarni tarqatmang.'),B('With adult help, keep threatening messages and account details, report the account and seek official support. Do not copy or download private images.','Katta odam yordami bilan tahdidli xabar va akkaunt ma’lumotlarini saqlang, shikoyat qiling va rasmiy yordam so‘rang. Shaxsiy rasmlarni ko‘chirmang yoki yuklab olmang.')],
 [B('Stop following the sender’s instructions and tell a trusted adult what you installed.','Yuboruvchining ko‘rsatmalariga amal qilishni to‘xtating va nima o‘rnatganingizni ishonchli kattaga ayting.'),B('Get help from a trusted technician or the device’s official support to check the device and remove suspicious software safely.','Qurilmani tekshirish va shubhali dasturni xavfsiz olib tashlash uchun ishonchli mutaxassis yoki qurilmaning rasmiy yordam xizmatiga murojaat qiling.'),B('If an account may be affected, use another trusted device with adult help to follow the service’s genuine recovery instructions. Do not install a cleaner sent by the suspicious sender.','Hisobga zarar yetgan bo‘lishi mumkin bo‘lsa, katta odam yordami bilan boshqa ishonchli qurilmadan haqiqiy tiklash yo‘riqnomasiga amal qiling. Shubhali yuboruvchi bergan “tozalovchi”ni o‘rnatmang.')]
 ];
 return `<p class="smallnote">${state.lang==='uz'?'Yordam qadamlarini ko‘rish uchun hodisani tanlang. Bu baholanmaydi.':'Choose an incident to see the help steps. This is not scored.'}</p><div class="incident-tabs">${scenarios.map((x,i)=>`<button data-action="incident" data-value="${i}" class="${incident===i?'selected':''}" aria-pressed="${incident===i}">${E(x)}</button>`).join('')}</div>${incident!==undefined?`<div class="scene"><ol class="recovery-steps">${steps[incident].map(x=>`<li>${E(x)}</li>`).join('')}</ol><button class="primary" data-action="recoveryDone">${state.lang==='uz'?'Bu qadamlarni tushundim':'I understand these steps'} ↗</button></div>`:`<div class="scene"><p>${state.lang==='uz'?'Hodisa tanlasangiz, yordam qadamlari shu yerda chiqadi.':'Select an incident to see the help steps.'}</p></div>`}${state.labs[4]?response(idx,true,l(B('Asking for help is a useful safety habit.','Yordam so‘rash — foydali xavfsizlik odati.'))):''}`;
}
function labPage(idx){const lab=LABS[idx],uz=state.lang==='uz';return `<div class="view lesson-view">
 <div class="lesson-intro"><div><div class="lesson-step-label">${uz?'01 / BILIB OLING':'01 / LEARN'} <span>· ${uz?'DARS':'LESSON'} ${idx+1} / 5</span></div><h2>${E(lab.title)}</h2><p class="lede">${E(lab.subtitle)}</p></div><div class="lesson-count">0${idx+1}<small>/ 05</small></div></div>
 <div class="lesson-progress"><span style="width:${(idx+(state.labs[idx]?1:0))*20}%"></span></div>
 <div class="lab-layout"><div class="teaching"><div class="micro-label">${uz?'1-QADAM · TUSHUNIB OLING':'STEP 1 · UNDERSTAND'}</div><h3>${E(lab.name)}</h3><p>${E(lab.teach)}</p><p>${E(lab.extra)}</p>${lessonExample(idx)}<div class="principle"><strong>${uz?'Asosiy qoida:':'Main principle:'}</strong><p>${E(lab.principle)}</p></div><p class="smallnote">${uz?'Bu mashqda haqiqiy hisob, pul yoki shaxsiy ma’lumotlardan foydalanilmaydi.':'These activities use no real accounts, money, or personal data.'}</p></div>
 <div class="simulation"><div class="simulation-head"><span>${uz?'2-QADAM · AMALDA SINANG':'STEP 2 · TRY IT YOURSELF'}</span><span class="sim-count">${state.labs[idx]?'✓':String(idx+1).padStart(2,'0')} / 05</span></div><div class="simulation-body">${labWidget(idx)}</div></div></div>
 <div class="mini-progress"><div><span>${state.labs[idx]?'✓ '+t('labCompleted'):'○ '+t('needInteract')}</span></div><span>${doneLabs()}/5 ${uz?'DARS BAJARILDI':'LESSONS COMPLETE'}</span></div>
 <div class="lab-footer"><button class="secondary" data-action="navigate" data-value="${idx===0?'home':`lab-${idx-1}`}">← ${e(t(idx===0?'home':'previous'))}</button><button class="primary" data-action="navigate" data-value="${idx===4?'missions':`lab-${idx+1}`}" ${!state.labs[idx]?'disabled':''}>${e(idx===4?t('missions'):t('next'))} →</button></div>${foot()}</div>`;}
function missionsPage(){const i=state.missionIndex||0,m=MISSIONS[i],answer=state.missionAnswers[i],correct=answer===m.correct;
 return `<div class="view">${kicker(t('missions'))}<h2>${e(t('missionIntro'))}</h2><p class="lede">${e(t('missionSub'))}</p><div class="mini-progress"><span>${e(t('missionProgress'))}</span><b>${doneMissions()} / 06</b></div>
 <div class="mission-layout"><div class="mission-list">${MISSIONS.map((x,j)=>`<button data-action="missionSelect" data-value="${j}" class="${i===j?'active':''} ${state.missionAnswers[j]!==undefined?'complete':''}"><span>${String(j+1).padStart(2,'0')} / 06 ${state.missionAnswers[j]!==undefined?'✓':''}</span><b>${E(x.title)}</b></button>`).join('')}</div>
 <div class="mission-card"><div class="micro-label">${state.lang==='uz'?'VAZIYAT':'MISSION'} ${String(i+1).padStart(2,'0')} / ${E(m.tag)}</div><h3>${E(m.title)}</h3><div class="scene"><div class="sender">${state.lang==='uz'?'SIMULYATSIYA XABARI':'SIMULATED MESSAGE'} <span class="timestamp"> / ${state.lang==='uz'?'NAMUNA':'NOT REAL'}</span></div><p>${E(m.scene)}</p></div><p class="interact-kicker">${E(m.question)}</p><p class="smallnote">${chooseOne()}</p><div class="choice-grid" role="group" aria-label="${chooseOne()}">${m.choices.map((x,j)=>cb(l(x),j,answer===j,'missionChoice')).join('')}</div>
 ${answer!==undefined?`${response(i,correct,l(m.feedback[answer]))}<p class="smallnote">${e(t('missionAnswered'))}</p>`:''}<div class="exam-actions"><span class="caption">${doneMissions()}/6 ${e(t('missionProgress'))}</span>${i<5?`<button class="primary" data-action="missionSelect" data-value="${i+1}" ${answer===undefined?'disabled':''}>${e(t('nextM'))} ↗</button>`:`<button class="primary" data-action="navigate" data-value="test" ${!canTest()?'disabled':''}>${e(t('ready'))} ↗</button>`}</div></div></div>
 ${doneMissions()===6?`<div class="alertbox">${e(t('finishedM'))}</div>`:''}<div class="cta-row"><button class="secondary" data-action="navigate" data-value="lab-4">← ${e(t('previous'))}</button>${canTest()?`<button class="primary" data-action="navigate" data-value="test">${e(t('examStart'))} ↗</button>`:''}</div>${foot()}</div>`;
}
function lockedPage(){return `<div class="view" style="max-width:900px">${kicker(t('test'))}<h2>${e(t('examTitle'))}</h2><p class="lede">${e(t('locked'))}</p><div class="stats"><div class="stat"><b>${doneLabs()}/5</b><span>${e(t('labs'))}</span></div><div class="stat"><b>${doneMissions()}/6</b><span>${e(t('missions'))}</span></div><div class="stat"><b>20</b><span>${e(t('stats3'))}</span></div></div><div class="cta-row"><button class="primary" data-action="navigate" data-value="${doneLabs()<5?`lab-${LABS.findIndex((_,i)=>!state.labs[i])}`:'missions'}">${e(t('continue'))} ↗</button></div>${foot()}</div>`;}
function testPage(){if(!canTest()&&!state.submitted)return lockedPage();if(state.submitted)return resultsPage();const n=state.quizIndex||0,q=EXAM[n];const ans=state.quizAnswers[n];return `<div class="view">
 <div class="exam-header"><div>${kicker('20 / '+t('test'))}<h2>${e(t('examTitle'))}</h2><p class="lede">${e(t('examDesc'))}</p></div><div style="min-width:135px;text-align:right"><div class="eyebrow">${e(t('answered'))}</div><span style="font:46px var(--serif)">${doneTest()}<small style="font:14px var(--mono)"> / 20</small></span></div></div>
 <div class="meterline" style="margin:20px 0"><div style="width:${doneTest()*5}%"></div></div><div class="exam-nav" aria-label="${state.lang==='uz'?'Savollar bo‘ylab o‘tish':'Question navigation'}">${EXAM.map((_,i)=>`<button data-action="question" data-value="${i}" class="${i===n?'current':''} ${state.quizAnswers[i]!==undefined?'answered':''}" aria-label="${state.lang==='uz'?'Savol':'Question'} ${i+1}" ${i===n?'aria-current="step"':''}>${String(i+1).padStart(2,'0')}</button>`).join('')}</div>
 <div class="exam-card"><div class="micro-label">${e(t('question'))} ${String(n+1).padStart(2,'0')} ${e(t('of'))} 20 &nbsp; / &nbsp; ${E(CATS[q.cat])}</div><h3>${E(q.q)}</h3><p class="smallnote">${chooseOne()}</p><div class="choice-grid" role="group" aria-label="${chooseOne()}">${state.choiceOrders[n].map((i,position)=>cb(l(q.o[i]),i,ans===i,'answer','choice',position)).join('')}</div></div>
 <div class="exam-actions"><button class="secondary" data-action="question" data-value="${Math.max(0,n-1)}" ${n===0?'disabled':''}>← ${e(t('examPrev'))}</button>${n<19?`<button class="primary" data-action="question" data-value="${n+1}">${e(t('examNext'))} ↗</button>`:`<button class="primary" data-action="submit" ${doneTest()!==20?'disabled':''}>${e(t('submit'))} ↗</button>`}</div><p class="smallnote" style="margin-top:16px">${e(doneTest()<20?t('testOverview'):t('examDesc'))}</p>${doneTest()===20&&n!==19?`<button class="primary" data-action="submit">${e(t('submit'))} ↗</button>`:''}${foot()}</div>`;}
function resultStats(){const total=EXAM.filter((q,i)=>state.quizAnswers[i]===q.a).length,catScore=CATS.map((_,i)=>EXAM.filter((q,j)=>q.cat===i&&state.quizAnswers[j]===q.a).length);return {total,catScore};}
function feedbackMessage(){
 if(feedbackError==='invalid')return state.lang==='uz'?'Bitta variant tanlang. O‘z javobingizni yozsangiz, 1–1000 ta belgi ishlating.':'Choose one option. For your own response, write 1–1000 characters.';
 if(feedbackError==='stale')return state.lang==='uz'?'Kurs yangilandi. Sahifani qayta yuklang.':'The course has changed. Please reload the page.';
 if(feedbackError)return state.lang==='uz'?'Fikr yuborilmadi. Javobingiz hali shu yerda. Keyinroq qayta urinib ko‘ring.':'Your feedback could not be sent. Your response is still here. Please try again later.';
 return '';
}
function studentFeedback(standalone=false,forRegistration=false){
 const uz=state.lang==='uz';
 const heading=standalone?'h1':'h2';
 const help=forRegistration?(uz?'Ro‘yxatdan o‘tishdan oldin bitta javob tanlang yoki o‘z fikringizni yozing. Har qanday fikrni qabul qilamiz. Javobingiz ballingizni o‘zgartirmaydi.':'Before registering, choose one answer or write your own thoughts. All opinions are welcome. Your answer does not change your score.'):(uz?'Bitta javob tanlang yoki o‘z fikringizni yozing. Ro‘yxatdan o‘tish uchun fikr bildirish shart. Javobingiz ballingizni o‘zgartirmaydi.':'Choose one answer or write your own thoughts. Feedback is required before registration. Your answer does not change your score.');
 if(state.feedbackSubmitted)return `<section class="student-feedback hide-print" aria-labelledby="feedbackTitle"><${heading} id="feedbackTitle">${uz?'Fikringiz uchun rahmat!':'Thanks for your feedback!'}</${heading}><p>${uz?'Javobingiz yuborildi. U kursni yaxshilashga yordam beradi.':'Your response has been sent. It will help us improve the course.'}</p></section>`;
 const options=[B('It helped a lot. I feel more confident online.','Ancha yordam berdi. Internetda o‘zimni ishonchliroq his qilyapman.'),B('It has not made much difference for me yet.','Hozircha men uchun katta o‘zgarish bo‘lmadi.'),B('I feel more confused and need more help.','Yana ham chalkashdim va ko‘proq yordam kerak.'),B('I want to explain in my own words','O‘z fikrimni yozmoqchiman')];
 return `<section class="student-feedback hide-print" aria-labelledby="feedbackTitle"><${heading} id="feedbackTitle">${uz?'Bu kurs sizga yordam berdimi?':'Did this course help you?'}</${heading}><p id="feedbackHelp">${help}</p><form id="feedback-form"><fieldset aria-describedby="feedbackHelp" ${feedbackSending?'disabled':''}><legend>${uz?'Bitta variant tanlang':'Choose one option'}</legend><div class="feedback-options">${options.map((option,i)=>`<label class="feedback-option"><input id="feedback-option-${FEEDBACK_CHOICES[i]}" type="radio" name="feedbackChoice" value="${FEEDBACK_CHOICES[i]}" ${state.feedbackChoice===FEEDBACK_CHOICES[i]?'checked':''} required><span>${E(option)}</span></label>`).join('')}</div>${state.feedbackChoice==='own_words'?`<div class="feedback-own"><label for="feedbackText">${uz?'O‘z javobingiz':'Your own response'}</label><textarea id="feedbackText" name="feedbackText" rows="4" maxlength="1000" required aria-describedby="feedbackTextHelp">${e(state.feedbackText)}</textarea><p id="feedbackTextHelp" class="smallnote">${uz?'1000 tagacha belgi. Ism, parol yoki boshqa shaxsiy ma’lumot yozmang.':'Up to 1,000 characters. Leave out names, passwords and other private details.'}</p></div>`:''}</fieldset><p id="feedback-status" role="status" aria-live="polite">${e(feedbackMessage())}</p><button class="primary" type="submit" ${feedbackSending?'disabled':''}>${feedbackSending?(uz?'Yuborilmoqda…':'Sending…'):(forRegistration?(uz?'Fikrni saqlash va davom etish':'Save feedback & continue'):(uz?'Fikrni yuborish':'Send feedback'))}</button></form></section>`;
}
function resultsPage(){if(!state.submitted)return testPage();const {total,catScore}=resultStats();return `<div class="view">${kicker(state.lang==='uz'?'SINOV / SIZNING NATIJANGIZ':'ASSESSMENT / YOUR RESULTS')}<div class="result-hero"><div class="result-summary"><div class="micro-label">${e(t('score'))}</div><h2>${e(t('resultsTitle'))}</h2><p class="result-note">${e(t('resultSubtitle'))}</p></div><div class="result-score">${total}<small>/ 20</small></div></div>
 ${registrationCallout(total)}
 ${studentFeedback()}
 <div class="result-bars">${CATS.map((x,i)=>`<div class="result-bar"><b>${E(x)}</b><div class="bar"><span style="width:${catScore[i]*25}%"></span></div><span class="caption">${catScore[i]} / 4</span></div>`).join('')}</div>
 <h2 class="review-title">${e(t('review'))}</h2><p class="lede" style="font-size:16px">${state.lang==='uz'?'Xato — fikrlashni mashq qilish imkoniyati. Har bir vaziyat izohini ochib ko‘ring.':'A missed question is an opportunity to strengthen a habit. Open each item to review the reasoning.'}</p>
 <div class="review-list">${EXAM.map((q,i)=>{const good=state.quizAnswers[i]===q.a;return `<details class="review-item"><summary><span class="${good?'ok':'no'}">${good?'✓':'○'}</span><span style="flex:1">${String(i+1).padStart(2,'0')}. ${E(q.q)}</span><span class="caption">${good?e(t('resultReviewCorrect')):e(t('resultReviewWrong'))} &nbsp; ＋</span></summary><p><b>${state.lang==='uz'?'Sizning javobingiz:':'Your answer:'}</b> ${E(q.o[state.quizAnswers[i]])}</p><p><b>${state.lang==='uz'?'Tavsiya etilgan javob:':'Recommended response:'}</b> ${E(q.o[q.a])}</p><p>${E(q.why)}</p></details>`}).join('')}</div>
 <div class="alertbox">${e(t('resultSubtitle'))} ${state.lang==='uz'?'Bitta sinov yangi tahdidlarga doimiy tayyorlikni isbotlamaydi. Yaxshi odatlarni muntazam mashq qiling.':'One assessment cannot establish permanent readiness for future threats. Revisit the habits and practice again later.'}</div>
 <div class="cta-row hide-print"><button class="primary" data-action="navigate" data-value="guide">${e(t('resultAction'))} ↗</button><button class="secondary" data-action="print">${e(t('print'))}</button><button class="secondary" data-action="retake">${e(t('retake'))}</button></div>${foot()}</div>`;}
function registrationCallout(total){
 if(state.registered||state.previousRegistrationConfirmed)return `<div class="registration-callout">${state.lang==='uz'?(state.registered?'Ro‘yxatdan o‘tdingiz.':'Avval yuborgan ro‘yxat ma’lumotlaringiz saqlangan.'):(state.registered?'Registration complete.':'Your earlier registration is saved.')}</div>`;
 return `<div class="registration-callout">${total>=16?`<p>${state.lang==='uz'?'Kamida 16/20 ball oldingiz. Endi maktab ma’lumotlaringiz bilan ro‘yxatdan o‘ting.':'You met the 16/20 requirement. Register your school details now.'}</p><button class="primary" data-action="navigate" data-value="registration">${state.lang==='uz'?'Ro‘yxatdan o‘tish':'Register now'}</button>`:(state.lang==='uz'?'Ro‘yxatdan o‘tish uchun kamida 16/20 ball kerak. Izohlarni o‘qib, qayta urinib ko‘ring.':'Registration requires at least 16/20. Review the explanations and try again.')}</div>`;
}
function registrationPage(){
 if(!state.submitted||resultStats().total<16)return resultsPage();
 const uz=state.lang==='uz';
 if(state.registered||state.previousRegistrationConfirmed)return `<div class="view registration-view"><h2>${uz?'Ro‘yxatdan o‘tdingiz':'Registration complete'}</h2><p>${uz?'Avval yuborgan ro‘yxat ma’lumotlaringiz saqlangan.':'Your earlier registration is saved.'}</p><button class="secondary" data-action="navigate" data-value="results">${e(t('resultsTitle'))}</button></div>`;
 if(!state.feedbackSubmitted)return `<div class="view feedback-view registration-view"><p class="registration-step">${uz?'1 / 2-bosqich · Fikringiz':'Step 1 of 2 · Your feedback'}</p>${studentFeedback(true,true)}<button class="secondary" data-action="navigate" data-value="results">${uz?'Natijaga qaytish':'Back to results'}</button></div>`;
 return `<div class="view registration-view"><p class="registration-step">${uz?'2 / 2-bosqich · Maktab ma’lumotlari':'Step 2 of 2 · School details'}</p><h2 id="registrationTitle" tabindex="-1">${uz?'O‘zingiz haqingizda':'Your school details'}</h2><p class="lede">${resultStats().total}/20 · ${uz?'Ro‘yxatga ism, familiya, sinf, maktab va ball saqlanadi.':'Your name, class, school and score will be saved.'}</p><form id="registration-form" class="registration-form">
 <label>${uz?'Viloyat':'Region'}<select name="regionId" required><option value="">${uz?'Viloyatni tanlang':'Choose region'}</option></select></label>
 <label>${uz?'Tuman yoki shahar':'District or city'}<select name="districtId" required disabled><option value="">${uz?'Tumanni tanlang':'Choose district'}</option></select></label>
 <label>${uz?'Maktab':'School'}<select name="schoolId" required disabled><option value="">${uz?'Maktabni tanlang':'Choose school'}</option></select></label>
 <label>${uz?'Sinf':'Class'}<input name="className" maxlength="20" placeholder="9-A" required></label>
 <label>${uz?'Ism':'First name'}<input name="firstName" maxlength="80" autocomplete="given-name" required></label>
 <label>${uz?'Familiya':'Last name'}<input name="lastName" maxlength="80" autocomplete="family-name" required></label>
 <div id="registration-status" role="status" aria-live="polite"></div><button class="primary" type="submit">${uz?'Ro‘yxatdan o‘tish':'Submit registration'}</button></form></div>`;
}
function fillSelect(select,items){const placeholder=select.options[0].textContent;select.innerHTML=`<option value="">${e(placeholder)}</option>`+items.map(item=>`<option value="${item.id}">${e(item.name)}</option>`).join('');select.disabled=items.length===0;}
async function prepareRegistration(){
 const form=S.querySelector('#registration-form');if(!form)return;
 const status=form.querySelector('#registration-status');
 try{
  const directory=await loadDirectory();if(!form.isConnected)return;
  const region=form.elements.namedItem('regionId'),district=form.elements.namedItem('districtId'),school=form.elements.namedItem('schoolId');
  fillSelect(region,directory.regions);
  region.addEventListener('change',()=>{fillSelect(district,directory.districts.filter(x=>x.regionId===Number(region.value)));fillSelect(school,[]);});
  district.addEventListener('change',()=>fillSelect(school,directory.schools.filter(x=>x.districtId===Number(district.value))));
  form.addEventListener('submit',async ev=>{
   ev.preventDefault();if(!state.feedbackSubmitted){render();return;}if(!form.reportValidity())return;
   const attempt=state;
   const button=form.querySelector('button[type=submit]');button.disabled=true;status.textContent=state.lang==='uz'?'Saqlanmoqda…':'Saving…';
   const values=Object.fromEntries(new FormData(form));
   const body={...values,regionId:Number(values.regionId),districtId:Number(values.districtId),schoolId:Number(values.schoolId),contentVersion:courseContent.version,answers:EXAM.map((_,i)=>state.quizAnswers[i])};
   try{const response=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const result=await response.json();if(disposed||state!==attempt)return;if(response.status===409)throw new Error(state.lang==='uz'?'Savollar yangilandi. Sahifani qayta yuklang va yangi testni tugating.':'The questions have changed. Reload and complete the updated test.');if(!response.ok||result.ok!==true)throw new Error(result.error||'Registration failed');state.registered=true;save();render();}
   catch(error){status.textContent=error.message;button.disabled=false;}
  });
 }catch{status.textContent=state.lang==='uz'?'Maktablar ro‘yxati yuklanmadi. Sahifani qayta oching.':'School list unavailable. Please reload.';}
}
function guidePage(){
 const cards=[
 {h:B('01 / PAUSE','01 / TO‘XTANG'),body:B('Notice your emotional state. What is this message trying to make you feel? If it pushes an urgent sensitive action, slow down.','Hissiyotingizni payqang. Bu xabar qanday his uyg‘otmoqchi? Maxfiy harakatga shoshirsa, sekinlashing.')},
 {h:B('02 / VERIFY','02 / TEKSHIRING'),body:B('Leave the suspicious message. Find the person, institution or original claim through an independent, previously trusted source.','Shubhali xabardan chiqing. Odamni, tashkilotni yoki asl xabarni alohida avvaldan ishonchli manba orqali toping.')},
 {h:B('03 / PROTECT','03 / HIMOYALANG'),body:B('Use different passwords, add two-step verification, update genuine apps, keep sign-in codes private and hide personal details before posting.','Alohida parollar ishlating, ikki bosqichli tasdiqlashni yoqing, haqiqiy ilovalarni yangilang, kirish kodlarini sir saqlang va ulashishdan oldin shaxsiy ma’lumotlarni yoping.')},
 {h:B('04 / RESPOND','04 / CHORA KO‘RING'),body:B('If you slipped, act quickly rather than hiding it. Use genuine account support, report the problem and involve a trusted adult.','Xato bo‘lsa, yashirmasdan tez harakat qiling. Rasmiy xizmatga murojaat qiling, xabar bering va ishonchli kattani jalb qiling.')}
 ];
 const stages=[
 {when:B('Before students begin','Boshlashdan oldin'),action:B('Explain: “This is a simulation, not a trap. You are not the weak link. Nobody should reveal passwords, real codes or private stories.”','“Bu tuzoq emas, simulyatsiya. Siz zaif emassiz. Hech kim haqiqiy parol, kod yoki shaxsiy voqeasini aytishi shart emas”, deb tushuntiring.')},
 {when:B('During the labs','Laboratoriyalarda'),action:B('Ask what emotion the scene activates before talking about the technology. Give students time to choose; discuss why a safe action works.','Texnologiyadan oldin vaziyat qanday hissiyot uyg‘otishini so‘rang. Tanlash uchun vaqt bering va xavfsiz qaror sababini muhokama qiling.')},
 {when:B('During practice','Amaliyotda'),action:B('Pair students to explain their choices. Encourage different hypotheses, but verify facts independently. Never publicly shame a wrong answer.','O‘quvchilar qarorini juftlikda tushuntirsin. Turli fikrga imkon bering, ammo faktni mustaqil tekshiring. Noto‘g‘ri javobni omma oldida uyat qilmang.')},
 {when:B('During the assessment','Yakuniy sinovda'),action:B('Give quiet, independent time. The 20 questions use fresh contexts and show explanations only after submission. A qualifying score is saved only if the student submits registration.','20 ta yangi vaziyatga mustaqil javob berish uchun sokin vaqt ajrating. Izohlar topshirgandan keyin chiqadi. Yetarli ball faqat o‘quvchi ro‘yxatdan o‘tish formasini yuborsa saqlanadi.')},
 {when:B('After the session','Mashg‘ulotdan keyin'),action:B('Debrief one hard situation. Encourage a trusted reporting route at school, revisit habits later, and use results only to guide learning—not to label students.','Bitta murakkab vaziyatni muhokama qiling. Maktabda ishonchli xabar berish yo‘lini belgilang, odatlarni qayta mashq qiling; natijadan o‘quvchini yorliqlash uchun foydalanmang.')}
 ];
 return `<div class="view">${kicker(t('guide'))}<h2 style="max-width:870px">${e(t('guideTitle'))}</h2><p class="lede">${e(t('guideDesc'))}</p><div class="guide-grid">${cards.map(x=>`<div class="guide-card"><div class="micro-label">HABIT / ${E(x.h)}</div><h3>${E(x.h).split(' / ')[1]||E(x.h)}</h3><p>${E(x.body)}</p></div>`).join('')}</div>
 <div class="alertbox">${e(t('guideNote'))}</div><div class="divider"></div>${kicker(t('facilitator'))}<h2 style="max-width:810px">${state.lang==='uz'?'O‘quvchiga hurmat — metodikaning bir qismi.':'Make students feel capable, not exposed.'}</h2><p class="lede">${state.lang==='uz'?'Muhokama qo‘rquvdan emas, fikrlashdan boshlansin. Faoliyat o‘quvchini odam sifatida qadrlashi, maxfiylikni saqlashi va yordam so‘rashni odatiy holga aylantirishi kerak.':'Start with curiosity, not intimidation. The experience should protect privacy and make help-seeking normal.'}</p>
 <div style="margin-top:25px">${stages.map((x,i)=>`<div class="teaching-row"><b>${String(i+1).padStart(2,'0')} / ${E(x.when)}</b><p>${E(x.action)}</p></div>`).join('')}</div>
 ${kicker(state.lang==='uz'?'O‘ZBEKISTONDA YORDAM':'IF SOMETHING REALLY HAPPENS IN UZBEKISTAN')}<h2>${state.lang==='uz'?'Rasmiy yordam yo‘llari':'Use verified local reporting routes'}</h2>
 <p class="lede" style="font-size:16px">${state.lang==='uz'?'UZCERT ko‘rsatmalariga ko‘ra, soxta sahifalar va fishing haqida xizmatga murojaat qilish mumkin. Moliyaviy firibgarlikda bank bilan tez bog‘lanish va IIVga xabar berish muhim. Ishlatishdan oldin aloqa ma’lumotlarini rasmiy sahifada tekshiring.':'UZCERT publishes routes for reporting phishing and hacked accounts; for financial fraud, contact the bank/payment provider promptly and the relevant authorities. Verify current contact details on official pages before using them.'}</p>
 <div class="cta-row"><a class="secondary" href="https://uzcert.uz/en/questions-answers/" target="_blank" rel="noopener noreferrer">UZCERT Q&A ↗</a><a class="secondary" href="https://gov.uz/oz/iiv/pages/murojaat-qilish-tartibi" target="_blank" rel="noopener noreferrer">UZ MIA / IIV ↗</a></div>
 <div class="divider"></div><div class="cta-row"><button class="primary" data-action="navigate" data-value="${doneLabs()<5?`lab-${LABS.findIndex((_,i)=>!state.labs[i])}`:doneMissions()<6?'missions':'test'}">${e(t('continue'))} ↗</button><button class="textbtn" data-action="navigate" data-value="sources">${e(t('source'))} ↗</button></div>${foot()}</div>`;
}
function sourcesPage(){return `<div class="view">${kicker(t('sources'))}<h2 style="max-width:830px">${e(t('sourcesTitle'))}</h2><p class="lede">${e(t('sourcesDesc'))}</p><div class="alertbox">${state.lang==='uz'?'Eslatma: manbalar ilmiy va rasmiy yo‘riqnoma bo‘lsa ham, bu kursdagi vaziyatlar muallif tomonidan yaratilgan simulyatsiyalardir. Xavfsiz odatlarni mustahkamlash mumkin, ammo hech qanday 20 savollik sinov kelajakdagi barcha tahdidlarga tayyorlikni kafolatlamaydi.':'Method note: the scenarios are original teaching simulations informed by these sources, not real intercepted messages. Research suggests that practice can improve judgments, but evidence of transfer to every real-world future threat is limited. A 20-question score is an educational snapshot, not proof of immunity.'}</div>
 <div class="source-list">${SOURCES.map((x,i)=>`<a class="source-item" href="${e(x.url)}" rel="noopener noreferrer" target="_blank"><div><span>${String(i+1).padStart(2,'0')} &nbsp; ${e(x.name)} ↗</span><small>${E(x.desc)}</small></div><span class="caption">SOURCE ${String(i+1).padStart(2,'0')}</span></a>`).join('')}</div>
 <div class="divider"></div>${kicker('PRIVACY / REGISTRATION')}<h3 style="margin-top:19px">${state.lang==='uz'?'Ma’lumotlaringizni o‘zingiz yuborasiz.':'You choose when to submit your details.'}</h3><p style="max-width:650px">${e(t('privacy'))} ${state.lang==='uz'?'Manba havolalari faqat siz ularni bossangiz internetda ochiladi.':'External source links open only when you choose to click them.'}</p><button class="secondary" data-action="reset">${e(t('restart'))}</button>${foot()}</div>`;}
function render(){
 if(disposed)return;
 document.documentElement.lang=state.lang;
 document.title=state.lang==='uz'?'SECOND THOUGHT — Kiberxavfsizlik madaniyati':'SECOND THOUGHT — Cybersecurity Culture Lab';
 navrender();
 if(view==='home')S.innerHTML=home();
 else if(view.startsWith('lab-'))S.innerHTML=labPage(Number(view.slice(4)));
 else if(view==='missions')S.innerHTML=missionsPage();
 else if(view==='locked')S.innerHTML=lockedPage();
 else if(view==='test')S.innerHTML=testPage();
 else if(view==='results')S.innerHTML=resultsPage();
 else if(view==='registration')S.innerHTML=registrationPage();
 else if(view==='guide')S.innerHTML=guidePage();
 else if(view==='feedback')S.innerHTML=`<div class="view feedback-view">${studentFeedback(true)}${foot()}</div>`;
 else if(view==='sources')S.innerHTML=sourcesPage();
 else S.innerHTML=home();
 if(view==='registration')prepareRegistration();
}
function playVoice(){
 if(!('speechSynthesis'in window)){alert(state.lang==='uz'?'Ushbu brauzerda ovozli o‘qish ishlamaydi. Matnni o‘qing.':'Speech playback is unavailable on this browser. Please read the transcript.');return;}
 try{window.speechSynthesis.cancel();const msg=new SpeechSynthesisUtterance(state.lang==='uz'?'Men opangman. Shoshilinch yordam kerak. Eski raqamga qo‘ng‘iroq qilma. Pulni yangi kartaga o‘tkaz.':'It is your sister. I need urgent help. Do not call my old number. Send the money to this new card.');msg.lang=state.lang==='uz'?'uz-UZ':'en-US';msg.rate=.93;window.speechSynthesis.speak(msg);}catch{}
}
const handleClick = ev=>{
 const btn=ev.target.closest('[data-action]');if(!btn)return;
 const a=btn.dataset.action,v=btn.dataset.value;
 if(a==='dismissUpdate'){state.migrationNotice=false;save();render();return;}
 if(a==='navigate'){navigate(v);return;}
 if(a==='collapse'){state.collapsed=!state.collapsed;save();render();return;}
 if(a==='menu'){rail.classList.add('mobileopen');document.getElementById('overlay').classList.add('show');return;}
 if(a==='closemenu'){rail.classList.remove('mobileopen');document.getElementById('overlay').classList.remove('show');return;}
 if(a==='lang'){state.lang=v==='uz'?'uz':'en';state.langUserSelected=true;save();render();return;}
 if(a==='homeChoice'){state.homeAnswer=v;save();render();return;}
 if(a==='emotion'){const arr=new Set(state.labChecks[0]||[]),n=Number(v);if(arr.has(n)){arr.delete(n);}else{arr.add(n);}state.labChecks[0]=[...arr];save();render();return;}
 if(a==='evidence'){const arr=new Set(state.labChecks[1]||[]),n=Number(v);if(arr.has(n)){arr.delete(n);}else{arr.add(n);}state.labChecks[1]=[...arr];save();render();return;}
 if(a==='labChoice'){const idx=Number(view.slice(4));state.labAnswers[idx]=Number(v);state.labs[idx]=true;save();render();return;}
 if(a==='protection'){const arr=new Set(state.labChecks[3]||[]),n=Number(v);if(arr.has(n)){arr.delete(n);}else{arr.add(n);}state.labChecks[3]=[...arr];state.labs[3]=arr.size===4;save();render();return;}
 if(a==='incident'){state.labChecks[4]=Number(v);save();render();return;}
 if(a==='recoveryDone'){state.labs[4]=true;save();render();return;}
 if(a==='missionSelect'){state.missionIndex=Number(v);save();render();return;}
 if(a==='missionChoice'){state.missionAnswers[state.missionIndex]=Number(v);save();render();return;}
 if(a==='question'){state.quizIndex=Number(v);save();render();return;}
 if(a==='answer'){state.quizAnswers[state.quizIndex]=Number(v);save();render();return;}
 if(a==='submit'){if(doneTest()!==20)return;state.submitted=true;save();navigate('results');return;}
 if(a==='retake'){state.quizAnswers={};state.quizIndex=0;state.submitted=false;state.choiceOrders=newChoiceOrders();save();navigate('test');return;}
 if(a==='print'){window.print();return;}
 if(a==='reset'){if(confirm(t('resetConfirm'))){const preferences={lang:state.lang,langUserSelected:state.langUserSelected,collapsed:state.collapsed,previousRegistrationConfirmed:state.registered||state.previousRegistrationConfirmed};state={...initial(),...preferences};state.choiceOrders=newChoiceOrders();save();navigate('home');}return;}
 if(a==='playVoice'){playVoice();return;}
 if(a==='stopVoice'){if('speechSynthesis'in window)window.speechSynthesis.cancel();return;}
};
const handleKeyDown = ev=>{if(ev.key==='Escape'){rail.classList.remove('mobileopen');document.getElementById('overlay').classList.remove('show');if('speechSynthesis'in window)window.speechSynthesis.cancel();}};
const handleFeedbackChange=ev=>{
 if(ev.target.name!=='feedbackChoice'||!FEEDBACK_CHOICES.includes(ev.target.value)||feedbackSending||state.feedbackSubmitted)return;
 if(state.feedbackChoice!==ev.target.value)state.feedbackId='';
 state.feedbackChoice=ev.target.value;feedbackError='';save();render();document.getElementById(`feedback-option-${state.feedbackChoice}`)?.focus?.();
};
const handleFeedbackInput=ev=>{if(ev.target.id==='feedbackText'&&!feedbackSending&&!state.feedbackSubmitted){const next=ev.target.value.slice(0,1000);if(next!==state.feedbackText)state.feedbackId='';state.feedbackText=next;save();}};
const handleFeedbackSubmit=async ev=>{
 if(ev.target.id!=='feedback-form')return;
 ev.preventDefault();if(feedbackSending||state.feedbackSubmitted)return;
 const response=normalizeFeedback(state.feedbackChoice,state.feedbackText);
 if(!response){feedbackError='invalid';render();return;}
 try{if(!state.feedbackId)state.feedbackId=createFeedbackId();}
 catch{feedbackError='send';render();return;}
 const attempt=state;
 const continuingRegistration=view==='registration';
 const payload={id:state.feedbackId,contentVersion:courseContent.version,language:state.lang,...response};
 feedbackSending=true;feedbackError='';save();render();
 try{
  const result=await fetch('/api/feedback',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  if(disposed||state!==attempt)return;
  if(!result.ok){feedbackError=result.status===409?'stale':'send';return;}
  const confirmation=await result.json();if(disposed||state!==attempt)return;if(confirmation.ok!==true){feedbackError='send';return;}
  state.feedbackSubmitted=true;save();
 }catch{if(!disposed&&state===attempt)feedbackError='send';}
 finally{feedbackSending=false;if(!disposed){if(state!==attempt)feedbackError='';if(state===attempt&&state.feedbackSubmitted&&continuingRegistration&&view==='registration'){navigate('registration');document.getElementById('registrationTitle')?.focus?.();}else render();}}
};
root.addEventListener('click', handleClick);
root.addEventListener('change',handleFeedbackChange);
root.addEventListener('input',handleFeedbackInput);
root.addEventListener('submit',handleFeedbackSubmit);
document.addEventListener('keydown', handleKeyDown);
render();

return () => {
  disposed=true;
  root.removeEventListener('click', handleClick);
  root.removeEventListener('change',handleFeedbackChange);
  root.removeEventListener('input',handleFeedbackInput);
  root.removeEventListener('submit',handleFeedbackSubmit);
  document.removeEventListener('keydown', handleKeyDown);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};
}
