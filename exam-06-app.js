/* Zac's Knowledge Tracker — Version .06 guided tutor. No timed assessment. */
(()=>{
'use strict';
const BANK=window.EXAM06_REVISION_BANK||{};
const HOME='zac-v06-guided-progress-v1', HISTORY='zac-v06-guided-history-v1';
const SUBJECTS={
 english:{name:'English — The Giver',summary:'Characters, themes, short passages, important moments, symbols and TEEL writing.',tip:'A good answer goes beyond retelling. Name the idea, explain its meaning, support it with a detail from the novel, and link to Lowry’s message.'},
 science:{name:'Science — Semester 2',summary:'Electricity; cells, microscopy and digestion; fair tests and data skills.',tip:'Ask what each diagram or term actually shows. For calculations, write the formula, substitute values and give a unit.'},
 humanities:{name:'Humanities — Japan & Aztecs',summary:'Events, dates, key vocabulary, source analysis, consequences and TEEL arguments.',tip:'To evaluate significance, state what changed, use a precise historical fact, then explain who was affected and for how long.'},
 french:{name:'French — Everyday language',summary:'Family, school, routines, appearance, aller, time, grammar and reading.',tip:'Identify the subject first. Check verb form, adjective agreement, pronouns and word order. For the near future, use aller + infinitive.'},
 maths:{name:'Maths — Exam booklet skills',summary:'Number, algebra, ratios, graphs, probability, statistics, geometry and measurement.',tip:'Write down the formula, substitute carefully, solve one line at a time and include units when needed.'}
};
const TOPICS={
 'Characters & relationships':'Describe who a character is AND how their choices matter to the novel.',
 'Themes & ideas':'Ask: what does Lowry suggest about freedom, memory, love or control?',
 'Quotations & symbolism':'A quotation or symbol needs an explanation of its effect, not just identification.',
 'TEEL essay structure':'TEEL = Topic → Explain → Evidence → Link. Each sentence has a distinct job.',
 'Short passage analysis':'Read the passage once for meaning, then spot a technique, select evidence and explain its effect.',
 'Cells & organelles':'Cell structures each have jobs; compare plant, animal and fungal cells without assuming every cell is identical.',
 'Microscopy & magnification':'Total magnification = eyepiece × objective. Begin focusing with low power.',
 'Digestion & dentition':'Trace food through the organs, then connect tooth or digestive structures to their functions.',
 'Static electricity & charges':'Electrons move; protons stay in the nucleus. Like charges repel and unlike charges attract.',
 'Circuits, series & parallel':'Follow the current path. Series has one route; parallel has separate branches. V = I × R.',
 'Scientific investigations':'Independent = deliberately changed; dependent = measured; controls = kept the same.',
 'Japan: key events & terms':'Perry arrived in 1853; the Convention of Kanagawa followed in 1854. Modernisation developed over time.',
 'Japan: evaluating significance':'Distinguish American pressure from Japanese decisions during later reform and modernisation.',
 'Aztec conquest: events & impacts':'The conquest ended in 1521. Disease, warfare, alliances, religion and colonial rule all matter.',
 'Source analysis & significance':'Ask who created the source, when, why, and what it can or cannot prove.',
 'TEEL historical arguments':'Topic: judgement; Explain: why; Evidence: historical event or fact; Link: answer the question.',
 'Family & appearance':'Learn noun gender and adjective agreement: sportif / sportive, mon / ma / mes.',
 'School & marks':'Know subject names and how to describe preferences and marks out of twenty.',
 'Daily routine & leisure':'Use reflexive pronouns for daily routine: je me lève, tu te lèves, il se lève.',
 'Near future: aller':'Conjugate aller (vais, vas, va, allons, allez, vont), then add an infinitive.',
 'Time & meeting arrangements':'et quart = quarter past; moins le quart = quarter to; à = at (for times).',
 'Grammar, negatives & sentence building':'ne / n’ goes before the conjugated verb; pas goes after it.',
 'Reading a short passage':'Use names, time expressions, negatives and verb forms to locate the answer in the text.',
 'Integers, indices & fractions':'Check negative signs and order of operations. For same-base indices, use exponent rules.',
 'Algebra & equations':'Do the same operation to both sides. Expand brackets before collecting like terms.',
 'Ratio, percentages & rates':'Convert quantities to the same units. Write the calculation and check what the question asks.',
 'Statistics & probability':'Organise the data before calculating. Probability needs a numerator and the correct denominator.',
 'Measurement, geometry & graphs':'Formula → Substitute → Solve → Units. Check lengths vs areas vs volumes.'
};
const $=id=>document.getElementById(id);
const getLocal=(k)=>{try{return localStorage.getItem(k)}catch{return null}};
const removeLocal=(k)=>{try{localStorage.removeItem(k)}catch{}};
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function getJSON(key,fallback){try{const data=JSON.parse(localStorage.getItem(key));return data??fallback}catch{return fallback}}
function setJSON(key,v){try{localStorage.setItem(key,JSON.stringify(v));return true}catch(e){console.warn('Local progress save unavailable',e);return false}}
function show(page){for(const id of ['homeView','introView','questionView','resultView','dashboardView'])$(id).hidden=id!==page;window.scrollTo({top:0,behavior:'instant'})}
const clean=s=>String(s??'').normalize('NFKC').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[’‘`]/g,"'").replace(/[‐‑–—-]/g,' ').replace(/\b3rd\b/g,'third').replace(/\b2nd\b/g,'second').replace(/\b1st\b/g,'first')
  .replace(/[^\p{L}\p{N} '+Ωω]/gu,' ').replace(/\s+/g,' ').trim();
// Only compare against explicitly approved equivalents. Do not use fuzzy edit distance,
// substring matching, or drop negative words (ne / pas).
function matchShort(answer,accepted){const value=clean(answer);return !!value&&accepted.some(a=>clean(a)===value)}
function matchNumeric(input,q){let s=String(input??'').normalize('NFKC').trim().replace(/−/g,'-').replace(/,/g,'');
 s=s.replace(/\s*(?:cm²|m²|cm³|m³|cm|mm|km|ohms?|Ω|×|x|%|L\/100\s*km|L)\s*$/i,'').trim();
 if(!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(s))return false;
 return Math.abs(Number(s)-Number(q.answer))<=Number(q.tolerance??1e-8);
}
function isCorrect(q,a){if(a===null||a===undefined)return false;
 if(q.type==='mc')return Number(a)===Number(q.answer);
 if(q.type==='blocks')return Array.isArray(a)&&a.length===q.answer.length&&a.every((x,i)=>x===q.answer[i]);
 if(q.type==='short')return matchShort(a,q.answer);
 if(q.type==='number')return matchNumeric(a,q);
 return false;
}
function expected(q){if(q.type==='mc')return q.options[q.answer];if(q.type==='blocks')return q.answer.map(i=>q.blocks[i]).join(' → ');if(q.type==='short')return q.answer[0];return String(q.answer)+(q.unit?' '+q.unit:'')}
function responseText(q,a){if(a===null||a===undefined)return '(not answered)';if(q.type==='mc')return q.options[a]??String(a);if(q.type==='blocks')return a.map(i=>q.blocks[i]).join(' → ');return String(a)}
let selectedSubject='english',selectedTopic='all',active=null,reviewRecord=null,chosen=null,placed=[],attempts=0,hintLevel=0,lastSubmitted='',solved=false,nudgeHandle=null;
function idsFor(subject,topic){return BANK[subject].filter(q=>topic==='all'||q.area===topic).map(q=>q.id)}
function getQ(id){for(const [subject,qs] of Object.entries(BANK)){const q=qs.find(item=>item.id===id);if(q)return q}return null}
function currentQ(){return active&&getQ(active.ids[active.cursor])}
function saveDraft(){if(active)setJSON(HOME,active)}
function clearNudge(){if(nudgeHandle){clearTimeout(nudgeHandle);nudgeHandle=null}}
function nudgeLater(){clearNudge();const id=currentQ()?.id;nudgeHandle=setTimeout(()=>{if(currentQ()?.id!==id||solved||$('questionView').hidden)return;
 const box=$('gentleNudge');if(box){box.textContent='Take your time. There is no time limit. If you feel stuck, try “Show a hint” or look at the topic reminder.';box.hidden=false}},50000)}
// Reporting uses existing per-question mastery records and does not alter saved attempts.
// First correct attempt with zero hints = one independent mark; later success = supported.
function sessionMetrics(session){
 const result={total:0,independent:0,supported:0,revisit:0,areas:{}};
 if(!session||!Array.isArray(session.ids))return result;
 const responses=session.responses||{};
 for(const id of session.ids){
  const q=getQ(id),r=responses[id];if(!q||!r?.completed)continue;
  const a=result.areas[q.area]||(result.areas[q.area]={total:0,independent:0,supported:0,revisit:0});
  const key=r.mastery==='independent'?'independent':r.mastery==='with-support'?'supported':'revisit';
  result[key]++;result.total++;a[key]++;a.total++;
 }
 result.percent=result.total?Math.round(result.independent/result.total*100):null;
 return result;
}
function sameStudent(a,b){return String(a??'').trim().toLocaleLowerCase()===String(b??'').trim().toLocaleLowerCase()}
function subjectHistory(subject,student){return getJSON(HISTORY,[]).filter(s=>s?.subject===subject&&sameStudent(s.student,student)&&Array.isArray(s.ids)&&s.responses)
 .sort((a,b)=>Date.parse(a.completed||a.created||0)-Date.parse(b.completed||b.created||0));}
function sameQuestionSet(a,b){if(!Array.isArray(a?.ids)||!Array.isArray(b?.ids)||a.ids.length!==b.ids.length)return false;
 return a.ids.slice().sort().join('\u001f')===b.ids.slice().sort().join('\u001f');}
// A topic profile uses the latest COMPLETED attempt for each activity in this browser.
// Unpractised activities are missing observations, NOT incorrect answers.
function latestTopicProfile(subject,student){
 const prior=subjectHistory(subject,student),latest=new Map();
 for(const session of prior)for(const id of session.ids){const q=getQ(id),r=session.responses[id];if(q&&r?.completed)latest.set(id,r)}
 const areas={};for(const q of BANK[subject]||[]){
  const a=areas[q.area]||(areas[q.area]={total:0,attempted:0,independent:0,supported:0,revisit:0});a.total++;
  const r=latest.get(q.id);if(!r)continue;
  a.attempted++;a[r.mastery==='independent'?'independent':r.mastery==='with-support'?'supported':'revisit']++;
 }
 return areas;
}
function topicPercent(a){return a?.attempted?Math.round(a.independent/a.attempted*100):null;}
function radarMarkup(title,profile,denominatorKey='attempted'){
 const areas=Object.keys(profile),n=areas.length;
 if(!n)return '<p class="muted">No topic data yet.</p>';
 const size=850,cx=425,cy=256,r=147,labR=207;
 const at=(i,rad)=>{const theta=-Math.PI/2+i*2*Math.PI/n;return [cx+rad*Math.cos(theta),cy+rad*Math.sin(theta)]};
 let parts=[];
 for(const tick of [25,50,75,100]){
  const pts=areas.map((_,i)=>at(i,r*tick/100).map(v=>v.toFixed(1)).join(',')).join(' ');
  parts.push(`<polygon points="${pts}" fill="none" stroke="#dce6f0" stroke-width="1.2"/>`);
  parts.push(`<text x="${cx+5}" y="${(cy-r*tick/100-5).toFixed(1)}" font-size="11" fill="#62758d">${tick}%</text>`);
 }
 const observations=areas.map((area,i)=>{const a=profile[area],count=a?.[denominatorKey]||0;
  const p=count?Math.round(a.independent/count*100):null;
  return {i,area,point:p===null?null:at(i,r*p/100),pct:p,count};});
 observations.forEach(o=>{
  const end=at(o.i,r);parts.push(`<line x1="${cx}" y1="${cy}" x2="${end[0].toFixed(1)}" y2="${end[1].toFixed(1)}" stroke="#e3eaf2" stroke-width="1"/>`);
 });
 const complete=observations.every(o=>o.pct!==null);
 if(complete){const pts=observations.map(o=>o.point.map(v=>v.toFixed(1)).join(',')).join(' ');
  parts.push(`<polygon points="${pts}" fill="#2f83c0" fill-opacity=".16" stroke="#2675ae" stroke-width="2.7" stroke-linejoin="round"/>`);
 }else for(let i=0;i<n;i++){const a=observations[i],b=observations[(i+1)%n];if(a.point&&b.point){parts.push(`<line x1="${a.point[0].toFixed(1)}" y1="${a.point[1].toFixed(1)}" x2="${b.point[0].toFixed(1)}" y2="${b.point[1].toFixed(1)}" stroke="#2675ae" stroke-width="2.7"/>`);}}
 for(const o of observations){
  if(o.point)parts.push(`<circle cx="${o.point[0].toFixed(1)}" cy="${o.point[1].toFixed(1)}" r="5.2" fill="#2475ac" stroke="white" stroke-width="1.7"><title>${escapeHTML(o.area)}: ${o.pct}% independent (${o.count} attempted)</title></circle>`);
  const [x,y]=at(o.i,labR),cos=Math.cos(-Math.PI/2+o.i*2*Math.PI/n),anchor=cos>.2?'start':cos<-.2?'end':'middle';
  const words=o.area.split(/\s+/),chunks=[];let chunk='';for(const word of words){if((chunk+' '+word).trim().length>20&&chunk){chunks.push(chunk);chunk=word}else chunk+=(chunk?' ':'')+word}if(chunk)chunks.push(chunk);
  const start=y-(chunks.length-1)*9;
  parts.push(`<text x="${x.toFixed(1)}" y="${start.toFixed(1)}" text-anchor="${anchor}" font-size="12" font-weight="600" fill="#244562">${chunks.map((txt,j)=>`<tspan x="${x.toFixed(1)}" dy="${j?'16':'0'}">${escapeHTML(txt)}</tspan>`).join('')}<tspan x="${x.toFixed(1)}" dy="16" fill="${o.pct===null?'#8795a4':'#2475ac'}" font-size="11">${o.pct===null?'not practised':o.pct+'%'}</tspan></text>`);
 }
 const missed=observations.filter(o=>o.pct===null).length;
 return `<div class="radar-section"><h3>${escapeHTML(title)}</h3><svg class="radar-svg" role="img" aria-label="Topic radar chart of first-attempt independent understanding; ${missed} topics not yet attempted" viewBox="0 0 ${size} 525" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg><p class="radar-note">Each plotted value is the percentage solved correctly on the first attempt without hints, among <strong>activities attempted</strong> in that topic. ${missed?missed+' unpractised topic(s) remain unscored and are not treated as zero. ':''}See the table below for question counts and assisted learning.</p></div>`;
}
function stackedBar(a){const total=a.total||a.attempted||0;if(!total)return '—';
 return `<div class="topic-meter" role="img" aria-label="${a.independent} independent, ${a.supported} with help, ${a.revisit} revisit"><span class="independent" style="width:${(a.independent/total*100).toFixed(1)}%"></span><span class="supported" style="width:${(a.supported/total*100).toFixed(1)}%"></span><span class="revisit" style="width:${(a.revisit/total*100).toFixed(1)}%"></span></div>`;}
function topicTable(profile,mode){const isCumulative=mode==='cumulative';
 return `<div class="history"><table><thead><tr><th>Topic</th><th>Independent mark</th><th>With help</th><th>Revisit</th>${isCumulative?'<th>Coverage</th>':''}<th>Progress</th></tr></thead><tbody>${Object.entries(profile).map(([area,a])=>{
  const denominator=isCumulative?a.attempted:a.total;
  return `<tr><td>${escapeHTML(area)}</td><td>${denominator?`${a.independent}/${denominator} (${Math.round(a.independent/denominator*100)}%)`:'Not practised'}</td><td>${a.supported}</td><td>${a.revisit}</td>${isCumulative?`<td>${a.attempted}/${a.total}</td>`:''}<td>${stackedBar({...a,total:denominator})}</td></tr>`
 }).join('')}</tbody></table></div><div class="topic-legend"><span><i class="legend-dot" style="background:#267fb2"></i>Independent</span><span><i class="legend-dot" style="background:#b5a06c"></i>With help</span><span><i class="legend-dot" style="background:#cc8181"></i>Revisit</span></div>`;
}
function trendMarkup(session){
 const history=subjectHistory(session.subject,session.student).filter(s=>sameQuestionSet(s,session)).slice(-10);
 if(history.length<2)return `<div class="trend-section"><h3>Progress across comparable sessions</h3><p class="trend-note">Finish these same activities in another revision session to compare independent marks fairly. Different topic sets are not placed on the same trend line.</p></div>`;
 const points=history.map((s,i)=>({session:s,metrics:sessionMetrics(s),index:i+1}));
 const w=810,h=280,left=54,right=32,top=30,bottom=62;
 const x=i=>left+(points.length===1?0:i/(points.length-1))*(w-left-right),y=v=>h-bottom-(v/100)*(h-top-bottom);
 let svg=['<svg class="trend-svg" role="img" aria-label="Historical trend of first-attempt marks on an identical set of activities" viewBox="0 0 810 280" xmlns="http://www.w3.org/2000/svg">'];
 for(const t of [0,25,50,75,100])svg.push(`<line x1="${left}" y1="${y(t)}" x2="${w-right}" y2="${y(t)}" stroke="#dce6ef"/><text x="${left-10}" y="${y(t)+4}" text-anchor="end" font-size="12" fill="#556b84">${t}%</text>`);
 const line=points.map((p,i)=>`${x(i).toFixed(1)},${y(p.metrics.percent??0).toFixed(1)}`).join(' ');
 svg.push(`<polyline points="${line}" stroke="#2578ae" stroke-width="3" fill="none" stroke-linejoin="round"/>`);
 points.forEach((p,i)=>{const cx=x(i),cy=y(p.metrics.percent??0);svg.push(`<circle cx="${cx}" cy="${cy}" r="5.5" fill="#2279b5" stroke="white" stroke-width="1.8"><title>${escapeHTML(new Date(p.session.completed).toLocaleString())}: ${p.metrics.independent}/${p.metrics.total} independent</title></circle><text x="${cx}" y="${h-bottom+21}" text-anchor="middle" font-size="12" fill="#586b82">#${i+1}</text><text x="${cx}" y="${Math.max(cy-11,16)}" text-anchor="middle" font-size="11" font-weight="700" fill="#205c90">${p.metrics.percent??0}%</text>`)});
 svg.push('</svg>');
 return `<div class="trend-section"><h3>Progress across comparable sessions</h3>${svg.join('')}<p class="trend-note">Last ${points.length} completed sessions by ${escapeHTML(session.student)} answering the <strong>same ${session.ids.length} activities</strong>. The trend reports independent first-try marks; helped responses remain recorded separately. Practice attempts are not formal exams.</p></div>`;
}
function renderDashboard(subject,student){
 show('dashboardView');const history=subjectHistory(subject,student),profile=latestTopicProfile(subject,student);
 const all=Object.values(profile),attempted=all.reduce((s,a)=>s+a.attempted,0),independent=all.reduce((s,a)=>s+a.independent,0),helped=all.reduce((s,a)=>s+a.supported,0),revisit=all.reduce((s,a)=>s+a.revisit,0),available=all.reduce((s,a)=>s+a.total,0);
 $('dashboardTitle').textContent=(SUBJECTS[subject]?.name||subject)+' — topic radar';
 $('dashboardMeta').textContent=`${student} · latest completed response to each activity · ${history.length} finished session(s)`;
 $('dashboardStats').innerHTML=`<div class="mark-summary"><div class="mark-tile"><strong>${independent}/${attempted||0}</strong><span>Independent marks across practised activities${attempted?' · '+Math.round(independent/attempted*100)+'%':''}</span></div><div class="mark-tile"><strong>${helped}</strong><span>Activities understood with help</span></div><div class="mark-tile"><strong>${attempted}/${available}</strong><span>Different activities covered</span></div></div><div class="section-notice">The radar uses the <strong>latest completed attempt per activity</strong>, not the best-ever result. A topic with no attempts is left unscored. Repeat an activity without hints to demonstrate independent understanding.</div>`;
 $('dashboardRadar').innerHTML=radarMarkup('Independent understanding by topic',profile,'attempted');
 $('dashboardTopics').innerHTML=`<h3>Topic marks, assistance and coverage</h3>${topicTable(profile,'cumulative')}`;
 $('dashboardRecent').innerHTML=history.length?`<h3>Recent guided sessions</h3><div class="history"><table><thead><tr><th>Date</th><th>Topic</th><th>Independent mark</th><th>With help</th><th>Revisit</th></tr></thead><tbody>${history.slice(-10).reverse().map(s=>{const m=sessionMetrics(s);return `<tr><td>${escapeHTML(new Date(s.completed).toLocaleDateString())}</td><td>${escapeHTML(s.topic==='all'?'All topics':s.topic)}</td><td>${m.independent}/${m.total}${m.percent===null?'':' ('+m.percent+'%)'}</td><td>${m.supported}</td><td>${m.revisit}</td></tr>`}).join('')}</tbody></table></div>`:'<p class="muted">No completed sessions for this subject yet. Study one topic to begin building a radar profile.</p>';
 $('dashboardHome').onclick=displayHome;
 $('dashboardExport').onclick=()=>download(`zac06-${subject}-progress.json`,{schema:'zac06-topic-profile-v1',student,subject,generated:new Date().toISOString(),profile,sessions:history,definitions:{independent:'First correct attempt, zero hints',supported:'Correct following hints or retry',revisit:'Answer revealed or skipped'}});
}

function displayHome(){show('homeView');clearNudge();const sums=Object.keys(SUBJECTS).map(sub=>{const cfg=SUBJECTS[sub],areas=[...new Set(BANK[sub].map(q=>q.area))];return `<article class="subject"><div class="subject-head"><span class="sq">${escapeHTML(sub.toUpperCase())}</span><strong>${escapeHTML(cfg.name)}</strong></div><div class="stats">${areas.length} topics · ${BANK[sub].length} guided questions</div><p>${escapeHTML(cfg.summary)}</p><div class="actions"><button class="btn" data-subject="${sub}">Choose topic →</button><button class="btn alt" data-radar="${sub}">Radar &amp; marks</button></div></article>`}).join('');$('subjectCards').innerHTML=sums;
 $('subjectCards').querySelectorAll('[data-subject]').forEach(btn=>btn.onclick=()=>openSubject(btn.dataset.subject));
 $('subjectCards').querySelectorAll('[data-radar]').forEach(btn=>btn.onclick=()=>{
 const subject=btn.dataset.radar,all=getJSON(HISTORY,[]).filter(h=>h.subject===subject),saved=getLocal('zac-v06-student')||'Zac';
 const name=all.some(h=>sameStudent(h.student,saved))?saved:(all.at(-1)?.student||saved);renderDashboard(subject,name);
 });
 const draft=getJSON(HOME,null);const resume=$('resumePanel');if(draft&&Array.isArray(draft.ids)&&draft.ids.length&&draft.cursor<draft.ids.length){resume.hidden=false;resume.innerHTML=`<h2>Continue where you left off</h2><p>${escapeHTML(SUBJECTS[draft.subject]?.name||draft.subject)} · ${escapeHTML(draft.topic==='all'?'All topics':draft.topic)} · Activity ${draft.cursor+1} of ${draft.ids.length}</p><div class="actions"><button class="btn" id="resumeNow">Resume guided revision</button><button class="btn alt" id="discardDraft">Discard unfinished session</button></div>`;
 $('resumeNow').onclick=()=>{active=draft;renderQuestion()};$('discardDraft').onclick=()=>{if(confirm('Discard this unfinished practice session? Completed history will stay saved.')){removeLocal(HOME);displayHome()}};}else{resume.hidden=true;resume.innerHTML=''}
 const history=getJSON(HISTORY,[]);$('history').innerHTML=history.length?`<div class="history"><table><thead><tr><th>Subject / topic</th><th>Completed</th><th>Independent mark</th><th>With help</th><th>Revisit</th><th>Open</th></tr></thead><tbody>${history.slice().reverse().map(h=>`<tr><td>${escapeHTML(SUBJECTS[h.subject]?.name||h.subject)}<div class="small muted">${escapeHTML(h.topic==='all'?'All topics':h.topic)}</div></td><td>${escapeHTML(new Date(h.completed).toLocaleDateString())}</td><td>${sessionMetrics(h).independent}/${sessionMetrics(h).total} (${sessionMetrics(h).percent??0}%)</td><td>${sessionMetrics(h).supported}</td><td>${sessionMetrics(h).revisit}</td><td><button class="btn alt" data-review="${escapeHTML(h.id)}">Review</button></td></tr>`).join('')}</tbody></table></div>`:'<p class="muted">No completed guided sessions in this browser yet.</p>';
 $('history').querySelectorAll('[data-review]').forEach(b=>b.onclick=()=>{const h=history.find(x=>x.id===b.dataset.review);if(h)renderResult(h)});
 $('downloadAllBtn').onclick=()=>download('zac-version-06-guided-revision-history.json',{schema:'zac06-guided-history-v1',sessions:history});
}
function openSubject(s){if(!SUBJECTS[s])return;selectedSubject=s;selectedTopic='all';$('introTitle').textContent=SUBJECTS[s].name;
 $('introSummary').textContent='Choose one manageable topic at a time. You can return to the other topics later.';
 $('introTips').innerHTML=`<div class="tips"><h3>Tutor reminder</h3><p>${escapeHTML(SUBJECTS[s].tip)}</p></div>`;
 const areas=[...new Set(BANK[s].map(q=>q.area))];$('topicPicker').innerHTML=`<fieldset class="topic-grid"><legend class="subheading">Choose what to study</legend><label class="topic-choice"><input type="radio" name="topicPick" value="all"> <span>All topics <small>(${BANK[s].length} questions — optional, long)</small></span></label>${areas.map((area,i)=>`<label class="topic-choice"><input type="radio" name="topicPick" value="${escapeHTML(area)}" ${i===0?'checked':''}><span>${escapeHTML(area)} <small>(${idsFor(s,area).length} activities)</small></span></label>`).join('')}</fieldset>`;
 selectedTopic=areas[0];const describeTopic=()=>{$('introSummary').textContent=selectedTopic==='all'?'All areas are available. This is a long session; studying one topic at a time usually works better.':'Today’s learning goal: '+(TOPICS[selectedTopic]||SUBJECTS[s].tip)};describeTopic();$('topicPicker').querySelectorAll('input[name="topicPick"]').forEach(input=>input.onchange=()=>{selectedTopic=input.value;describeTopic()});
 $('studentName').value=getLocal('zac-v06-student')||'Zac';show('introView');
}
function start(){const name=$('studentName').value.trim()||'Student';try{localStorage.setItem('zac-v06-student',name)}catch{}
 active={id:'v06-guided-'+Date.now()+'-'+Math.random().toString(16).slice(2,8),version:'guided.06',subject:selectedSubject,topic:selectedTopic,student:name,created:new Date().toISOString(),ids:idsFor(selectedSubject,selectedTopic),cursor:0,responses:{},studyMode:'tutor-led, untimed',schemaVersion:1};
 attempts=0;hintLevel=0;saveDraft();renderQuestion();}
function renderQuestion(){if(!active)return displayHome();if(active.cursor>=active.ids.length)return finish();
 const q=currentQ();if(!q)return displayHome();show('questionView');solved=!!active.responses[q.id]?.completed;attempts=active.responses[q.id]?.attempts||0;hintLevel=active.responses[q.id]?.hints||0;chosen=null;placed=[];lastSubmitted='';
 $('subjectLabel').textContent=SUBJECTS[active.subject]?.name||active.subject;$('areaLabel').textContent=q.area;
 $('stepCount').textContent=`Activity ${active.cursor+1} of ${active.ids.length}`;$('progressFill').style.width=(active.cursor/active.ids.length*100).toFixed(1)+'%';
 $('readingSource').innerHTML=q.passage?`<div class="source"><div class="label">Read this first</div><p>${escapeHTML(q.passage)}</p></div>`:'';
 $('visualArea').innerHTML=q.visual?`<div class="diagram">${makeDiagram(q.visual)}</div>`:'';
 $('questionText').textContent=q.q;const remember=TOPICS[q.area]||SUBJECTS[active.subject].tip;
 $('conceptReminder').textContent=remember;$('hintText').hidden=true;$('hintText').innerHTML='';$('feedback').innerHTML='';$('gentleNudge').hidden=true;
 $('confidencePanel').hidden=true;$('checkBtn').hidden=false;$('revealBtn').hidden=false;$('nextBtn').hidden=true;
 $('hintBtn').hidden=false;$('hintBtn').textContent='Show a hint';$('checkBtn').disabled=true;
 const ctrl=$('answerControl');ctrl.innerHTML='';
 if(q.type==='mc'){
   ctrl.innerHTML=q.options.map((option,i)=>`<button type="button" class="choice" data-choice="${i}" aria-pressed="false"><span class="letter">${'ABCD'[i]||i+1}.</span>${escapeHTML(option)}</button>`).join('');
   ctrl.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{chosen=Number(b.dataset.choice);ctrl.querySelectorAll('[data-choice]').forEach(c=>{let on=c===b;c.classList.toggle('selected',on);c.setAttribute('aria-pressed',String(on))});updateCheck()});
 }else if(q.type==='blocks'){
   ctrl.innerHTML='<p class="muted small">Choose the blocks in the correct order. Tap a placed block to remove it.</p><div id="blockBank" class="bank"></div><p class="subheading">Your answer</p><div id="blockPlaced" class="placed"></div><button class="btn muted-btn" id="clearBlocks" type="button" style="margin-top:9px">Start order again</button>';
   $('clearBlocks').onclick=()=>{placed=[];drawBlocks(q)};drawBlocks(q);
 }else{
   const isNum=q.type==='number';ctrl.innerHTML=`<label for="writtenInput" class="small muted">${isNum?'Enter your number'+(q.unit?' (unit: '+escapeHTML(q.unit)+')':''):'Type a short answer in your own words'}</label><div><input class="number-input" id="writtenInput" type="text" inputmode="${isNum?'decimal':'text'}" autocomplete="off" spellcheck="${!isNum}" aria-label="Your answer" placeholder="${isNum?'e.g. 12.5':'Your short answer'}"></div><p class="numhint">${isNum?'Units, rounding and small numerical differences are handled appropriately.':'Different valid spellings, apostrophes, capitalisation and approved equivalent wording are accepted.'}</p>`;
   $('writtenInput').oninput=()=>{chosen=$('writtenInput').value;updateCheck()};
 }
 $('hintBtn').onclick=showHint;$('checkBtn').onclick=check;$('revealBtn').onclick=reveal;$('nextBtn').onclick=advance;
 if(solved){showSolvedReview(q,active.responses[q.id]);}else{nudgeLater()}
}
function drawBlocks(q){$('blockBank').innerHTML=q.blocks.map((text,i)=>placed.includes(i)?'':`<button type="button" class="tile" data-add="${i}">${escapeHTML(text)}</button>`).join('')||'<span class="empty">All blocks placed.</span>';
 $('blockPlaced').innerHTML=placed.map((i,n)=>`<button type="button" class="tile placed-tile" data-remove="${n}"><span class="letter">${n+1}.</span> ${escapeHTML(q.blocks[i])}<span class="remove">×</span></button>`).join('')||'<span class="empty">Your sequence will appear here.</span>';
 $('blockBank').querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{placed.push(Number(b.dataset.add));chosen=placed.slice();drawBlocks(q);updateCheck()});
 $('blockPlaced').querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{placed.splice(Number(b.dataset.remove),1);chosen=placed.slice();drawBlocks(q);updateCheck()});}
function updateCheck(){const q=currentQ();if(!q)return;const has=q.type==='blocks'?Array.isArray(chosen)&&chosen.length===q.blocks.length:q.type==='mc'?chosen!==null:String(chosen??'').trim().length>0;
 $('checkBtn').disabled=!has||JSON.stringify(chosen)===lastSubmitted;
}
function showHint(){if(!active||solved)return;const q=currentQ();hintLevel++;const record=active.responses[q.id]||{attempts:0,hints:0};record.hints=hintLevel;active.responses[q.id]=record;saveDraft();
 const reminder=TOPICS[q.area]||SUBJECTS[active.subject].tip;
 const message=hintLevel===1?(q.hint||reminder):`Next clue: ${q.explain}`;
 $('hintText').innerHTML=`<h3>${hintLevel===1?'A small hint':'Tutor explanation'}</h3><p>${escapeHTML(message)}</p>`;$('hintText').hidden=false;
 $('hintBtn').textContent=hintLevel===1?'Another hint':'Review hint again';$('gentleNudge').hidden=true;
}
function mistakeMessage(q,a){const chosenText=responseText(q,a);
 if(q.type==='mc'){
   const misconceptions={english:'That choice points to a different character, event or interpretation rather than the evidence or meaning being tested.',science:'That choice gives the wrong structure, function, formula or causal relationship. Check which concept each option describes.',humanities:'That choice does not fit the historical event, date, cause or significance being asked about. Keep the chronology and consequences separate.',french:'That choice does not match the requested meaning or grammatical form. Recheck the subject, verb ending, negation and adjective agreement.',maths:'That option comes from a different operation, formula, unit or interpretation. Check the order of steps and what quantity is required.'};
   return `<p>You chose <strong>${escapeHTML(chosenText)}</strong>.</p><p><strong>What this misses:</strong> ${escapeHTML(misconceptions[active.subject]||'This does not match the question.')}</p><p><strong>The correct reasoning is:</strong> ${escapeHTML(q.explain)}</p><p><strong>Use this to try again:</strong> ${escapeHTML(q.hint||TOPICS[q.area]||SUBJECTS[active.subject].tip)}</p>`;
 }
 if(q.type==='blocks'){let wrongAt=(a||[]).findIndex((x,i)=>x!==q.answer[i]);return `<p>Look again at <strong>step ${wrongAt+1}</strong>. The idea is to follow a logical sequence rather than just include every correct phrase.</p><p><strong>Remember:</strong> ${escapeHTML(q.hint||TOPICS[q.area]||q.explain)}</p>`;}
 if(q.type==='number')return `<p>You entered <strong>${escapeHTML(chosenText)}</strong>. The calculation or rounding is not quite right yet.</p><p><strong>Recheck the method:</strong> ${escapeHTML(q.explain)}</p>`;
 return `<p>You wrote <strong>${escapeHTML(chosenText)}</strong>. This is not one of the accepted answers for this concept.</p><p><strong>What to check:</strong> ${escapeHTML(q.explain)}</p><p class="small">Capitalisation, punctuation, accents and approved equivalent wording do not affect marking.</p>`;
}
function getRecord(q){return active.responses[q.id]||(active.responses[q.id]={attempts:0,hints:hintLevel,completed:false,confidence:null});}
function check(){if(!active||solved||$('checkBtn').disabled)return;const q=currentQ();const rec=getRecord(q);rec.attempts=(rec.attempts||0)+1;attempts=rec.attempts;rec.hints=hintLevel;
 const a=q.type==='blocks'?placed.slice():chosen;rec.lastTried=a;lastSubmitted=JSON.stringify(a);
 if(isCorrect(q,a)){
   rec.completed=true;rec.response=a;rec.mastery=(attempts===1&&hintLevel===0)?'independent':'with-support';solved=true;
   $('feedback').innerHTML=`<div class="feedback" role="status"><h3>${rec.mastery==='independent'?'You got it.':'That’s it — you worked it out.'}</h3><p><strong>Why this answer works:</strong> ${escapeHTML(q.explain)}</p><div class="expected">${escapeHTML(expected(q))}</div><p class="small muted">${rec.mastery==='with-support'?'Using hints and trying again is how learning works.':'Can you explain the reason in your own words?'}</p></div>`;
   finishQuestion(q,rec);
 }else{
   rec.wrongAttempts=(rec.wrongAttempts||0)+1;$('feedback').innerHTML=`<div class="feedback wrong" role="status"><h3>Not quite. Let’s work through it.</h3>${mistakeMessage(q,a)}<p><strong>Next step:</strong> ${rec.attempts===1?'Use the clue and try a different answer.':'You can try again, ask for a deeper hint, or view the model answer.'}</p></div>`;
   $('checkBtn').disabled=true;
   if(!q.hint && hintLevel===0){$('hintText').innerHTML=`<h3>Remember</h3><p>${escapeHTML(TOPICS[q.area]||SUBJECTS[active.subject].tip)}</p>`;$('hintText').hidden=false}
 }
 saveDraft();
}
function reveal(){if(!active||solved)return;const q=currentQ(),rec=getRecord(q);rec.completed=true;rec.mastery='revisit';rec.response=rec.lastTried??null;rec.hints=hintLevel;solved=true;
 $('feedback').innerHTML=`<div class="feedback" role="status"><h3>Here’s the worked answer</h3><div class="expected">${escapeHTML(expected(q))}</div><p><strong>Why:</strong> ${escapeHTML(q.explain)}</p><p class="small muted">This is marked “revisit”, not “failed”. You can practise it again later.</p></div>`;
 finishQuestion(q,rec);saveDraft();
}
function finishQuestion(q,rec){clearNudge();$('gentleNudge').hidden=true;$('checkBtn').hidden=true;$('revealBtn').hidden=true;$('hintBtn').hidden=true;$('nextBtn').hidden=false;
 $('nextBtn').textContent=active.cursor===active.ids.length-1?'See what you learnt →':'Next activity →';$('confidencePanel').hidden=false;
 $('confidenceBtns').innerHTML=[['got','Got it'],['nearly','Nearly'],['not','Not yet']].map(([id,label])=>`<button type="button" class="conf-btn ${rec.confidence===id?'active':''}" data-confidence="${id}">${label}</button>`).join('');
 $('confidenceBtns').querySelectorAll('button').forEach(b=>b.onclick=()=>{rec.confidence=b.dataset.confidence;saveDraft();finishQuestion(q,rec)});
 const control=$('answerControl');control.querySelectorAll('button,input').forEach(e=>e.disabled=true);}
function showSolvedReview(q,rec){solved=true;chosen=rec.response;let txt=rec.mastery==='revisit'?'Worked answer reviewed.':rec.mastery==='independent'?'Solved independently.':'Solved with support.';
 $('feedback').innerHTML=`<div class="feedback" role="status"><h3>${txt}</h3><p>${escapeHTML(q.explain)}</p><div class="expected">${escapeHTML(expected(q))}</div></div>`;finishQuestion(q,rec)}
function advance(){if(!active||!solved)return;active.cursor++;saveDraft();if(active.cursor>=active.ids.length){finish()}else{renderQuestion()}}
function finish(){if(!active)return;clearNudge();const session={...active,completed:new Date().toISOString()};const history=getJSON(HISTORY,[]);if(!history.some(r=>r.id===session.id))history.push(session);setJSON(HISTORY,history);removeLocal(HOME);active=null;renderResult(session)}
function renderResult(session){reviewRecord=session;show('resultView');const resultEntries=session.ids.map(id=>({q:getQ(id),rec:session.responses[id]||{}})).filter(x=>x.q);
 const stats={independent:0,'with-support':0,revisit:0};for(const {rec} of resultEntries){if(stats[rec.mastery]!==undefined)stats[rec.mastery]++}
 $('resultTitle').textContent=`${SUBJECTS[session.subject]?.name||session.subject} — what you practised`;
 $('resultMeta').textContent=`${session.student} · ${session.topic==='all'?'All topics':session.topic} · ${new Date(session.completed).toLocaleString()}`;
 const summary=sessionMetrics(session);
 $('resultScore').textContent=`Independent mark: ${summary.independent}/${summary.total} (${summary.percent??0}%)`;
 const areas=[...new Set(resultEntries.map(x=>x.q.area))];$('resultAreas').innerHTML=`<div class="grid">${[['independent','Understood independently'],['with-support','Worked out with help'],['revisit','Revisit later']].map(([k,name])=>`<div class="statcard"><strong>${stats[k]}</strong><div>${name}</div></div>`).join('')}</div><h3 style="margin-top:22px">Topic review</h3><div class="history"><table><thead><tr><th>Topic</th><th>Independent</th><th>With help</th><th>Revisit</th></tr></thead><tbody>${areas.map(area=>{const items=resultEntries.filter(r=>r.q.area===area);return `<tr><td>${escapeHTML(area)}</td><td>${items.filter(x=>x.rec.mastery==='independent').length}</td><td>${items.filter(x=>x.rec.mastery==='with-support').length}</td><td>${items.filter(x=>x.rec.mastery==='revisit').length}</td></tr>`}).join('')}</tbody></table></div>`;
 const sessionProfile=summary.areas;
 $('resultRadar').innerHTML=radarMarkup('This session: independent marks by topic',sessionProfile,'total');
 $('resultTrend').innerHTML=trendMarkup(session);
 $('resultReview').innerHTML=resultEntries.map(({q,rec},i)=>`<div class="review"><div class="stepnum">${i+1} · ${escapeHTML(q.area)}</div><strong>${escapeHTML(q.q)}</strong><p class="${rec.mastery==='revisit'?'wrongtxt':'correcttxt'}">${rec.mastery==='independent'?'Understood independently':rec.mastery==='with-support'?'Learnt with support':'Revisit this idea'}</p><p class="small">Your final attempt: ${escapeHTML(responseText(q,rec.response??rec.lastTried))}</p><p><strong>Model:</strong> ${escapeHTML(expected(q))}</p><p class="small muted">${escapeHTML(q.explain)}</p></div>`).join('');
 $('resultHome').onclick=displayHome;$('exportResult').onclick=()=>download('zac06-'+session.subject+'-'+session.id+'.json',{schema:'zac06-guided-session-v1',session});
 let weak=resultEntries.filter(({rec})=>rec.mastery!=='independent'||rec.confidence==='not'||rec.confidence==='nearly').map(({q})=>q.id);
 const btn=$('retryWeak');if(weak.length){btn.hidden=false;btn.textContent=`Practise ${weak.length} activities again`;
 btn.onclick=()=>{active={id:'v06-review-'+Date.now(),version:'guided.06',subject:session.subject,topic:'Review of difficult questions',student:session.student,created:new Date().toISOString(),ids:weak,cursor:0,responses:{},studyMode:'tutor-led review',schemaVersion:1};saveDraft();renderQuestion()}}else{btn.hidden=true}
}
function download(filename,obj){const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function makeDiagram(kind){
 const head=(name)=>`<svg role="img" aria-label="${name}" viewBox="0 0 530 255" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="528" height="253" rx="9" fill="#fff" stroke="#d7e4f0"/>`,end='</svg>';
 const t=(x,y,s,sz=15)=>`<text x="${x}" y="${y}" font-size="${sz}" fill="#183b66" font-family="Arial,sans-serif">${s}</text>`;
 const line=(x1,y1,x2,y2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#2f6198" stroke-width="3"/>`;
 const rect=(x,y,w,h,fill='#e8f3fc')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${fill}" stroke="#2f6198" stroke-width="2.5"/>`;
 const oval=(x,y,rx,ry,fill='#b6dfc2')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="#2f6198" stroke-width="2"/>`;
 if(kind==='cell')return head('Diagram of a plant cell with labelled nucleus and chloroplasts')+rect(78,32,370,179,'#d9edca')+rect(89,43,347,158,'#edf7e7')+oval(260,119,49,38,'#d7c1ec')+t(249,125,'N')+[[147,75],[357,84],[160,162],[374,157]].map(([x,y])=>oval(x,y,30,14,'#8bc97f')+t(x-5,y+5,'C',13)).join('')+t(92,228,'Plant cell: N = nucleus; C = chloroplasts')+end;
 if(kind==='microscope')return head('Simple light microscope with eyepiece A')+rect(222,33,68,24)+t(301,51,'A – eyepiece')+rect(237,57,32,55)+`<path d="M258 112Q330 118 326 169Q320 191 291 197" fill="none" stroke="#2f6198" stroke-width="17"/>`+line(188,164,285,164)+oval(205,153,14,7,'#e3a1a8')+rect(166,212,195,20)+t(18,94,'Objective lens')+line(160,96,231,120)+t(19,189,'Stage')+line(72,183,186,166)+end;
 if(kind==='digestion')return head('Simplified human digestion sequence')+[['Mouth',45],['Oesophagus',128],['Stomach',244],['Small intestine',350],['Large intestine',466]].map(([n,x],i)=>rect(x-36,96,i===1?100:90,60,['#e5f1fd','#f7eecf','#f2d9dd','#e4efd9','#e8e3f9'][i])+t(x-24,123,n.length>12?12:14,n.length>12?10:14)).join('')+t(31,64,'Path of food through the digestive system')+line(0,0,0,0)+end;
 if(kind==='teeth')return head('Three tooth types: incisors, canines and molars')+['Incisor','Canine','Molar'].map((x,i)=>{const ox=106+i*146;return `<path d="M${ox-38} 75 L${ox+30} 75 L${ox+26} 143 L${ox+7} 193 L${ox-5} 146 L${ox-25} 192 Z" fill="#f9f6ed" stroke="#2f6198" stroke-width="3"/>`+t(ox-35,226,x)}).join('')+end;
 if(kind==='atom')return head('Atom structure: positive nucleus and negative electrons')+oval(265,127,50,45,'#eac0c5')+t(244,124,'p⁺')+t(272,153,'n⁰')+`<ellipse cx="265" cy="127" rx="180" ry="83" fill="none" stroke="#6495ba" stroke-width="2"/><ellipse cx="265" cy="127" rx="85" ry="113" fill="none" stroke="#6495ba" stroke-width="2"/>`+oval(88,127,12,12,'#b4d2f0')+t(83,131,'−')+oval(348,50,12,12,'#b4d2f0')+t(344,54,'−')+end;
 if(kind==='series'||kind==='parallel'){let s=head(kind==='series'?'Simple series circuit':'Simple parallel circuit')+t(24,31,kind==='series'?'One path for the current':'Two branches for the current');s+=rect(50,100,47,45,'#e3efce')+t(57,127,'12 V');if(kind==='series'){s+=line(96,123,210,123)+line(305,123,420,123)+`<circle cx="225" cy="123" r="23" stroke="#2f6198" fill="#fff4ce" stroke-width="3"/><circle cx="290" cy="123" r="23" stroke="#2f6198" fill="#fff4ce" stroke-width="3"/>`+t(213,128,'1')+t(283,128,'2')+line(420,123,420,208)+line(420,208,73,208)+line(73,208,73,146)}else{s+=line(97,123,167,123)+line(167,70,167,185)+line(167,70,430,70)+line(167,185,430,185)+line(430,70,430,185)+`<circle cx="287" cy="70" r="20" fill="#fff4ce" stroke="#2f6198" stroke-width="3"/><circle cx="287" cy="185" r="20" fill="#fff4ce" stroke="#2f6198" stroke-width="3"/>`+t(281,76,'1')+t(280,190,'2')}return s+end}
 if(kind==='iv')return head('Voltage against current: straight and curved lines')+line(76,205,455,205)+line(76,205,76,31)+t(8,43,'V (V)')+t(437,229,'I (A)')+`<path d="M76 205L220 53" stroke="#267b58" stroke-width="4" fill="none"/><path d="M76 205Q290 188 439 37" stroke="#ce793b" stroke-width="4" fill="none"/>`+t(226,57,'Ohmic (straight)')+t(303,80,'Non-Ohmic (curved)')+end;
 if(kind==='venn')return head('Venn diagram: cafe 42 only, both 17, shop 7 only, neither 9')+`<circle cx="220" cy="133" r="93" fill="#e2f0ff" stroke="#2f6198" stroke-width="3"/><circle cx="314" cy="133" r="93" fill="#fce9d7" fill-opacity=".7" stroke="#c17a35" stroke-width="3"/>`+t(133,31,'Café')+t(354,31,'Shop')+t(166,143,'42',23)+t(261,143,'17',23)+t(347,143,'7',23)+t(450,206,'9',20)+t(20,231,'Total: 75')+end;
 if(kind==='twoway')return head('Homework two-way table: English and Maths')+t(183,41,'Maths Yes')+t(326,41,'Maths No')+t(14,109,'English Yes')+t(14,174,'English No')+rect(161,61,140,68)+rect(302,61,140,68)+rect(161,130,140,68)+rect(302,130,140,68)+t(213,101,'59',22)+t(353,101,'11',22)+t(213,172,'14',22)+t(353,172,'23',22)+t(10,241,'Total students: 107')+end;
 if(kind==='stemleaf')return head('Stem and leaf: key 1|2 means 12')+t(98,44,'Stem')+t(255,44,'Leaf')+line(227,50,227,214)+t(110,91,'1')+t(253,91,'2  8  9')+t(110,127,'2')+t(253,127,'1  3  5')+t(110,163,'3')+t(253,163,'0  2')+t(110,199,'4')+t(253,199,'0')+t(18,240,'Key: 1|2 = 12')+end;
 if(kind==='triangle')return head('Right triangle with perpendicular sides 3 and 4 centimetres')+`<path d="M137 198V49L345 198Z" fill="#e2f0ff" stroke="#2f6198" stroke-width="3"/><path d="M137 175H160V198" fill="none" stroke="#2f6198" stroke-width="2"/>`+t(113,122,'3 cm')+t(230,221,'4 cm')+t(271,101,'c = ?')+end;
 if(kind==='composite')return head('Rectangle 35 by 25 centimetres with two half-circles removed')+`<path d="M110 49H420A80 80 0 0 0 420 209H110A80 80 0 0 0 110 49Z" fill="#e2f0ff" stroke="#2f6198" stroke-width="3"/>`+t(234,37,'35 cm')+t(26,127,'25 cm')+t(156,130,'remove 2 semicircles')+end;
 return '';
}
$('introBack').onclick=displayHome;$('startBtn').onclick=start;$('leaveBtn').onclick=()=>{saveDraft();displayHome()};
if(Object.keys(BANK).length===5&&Object.values(BANK).every(a=>a.length)){displayHome()}else{$('subjectCards').textContent='Question bank missing. Upload exam-06-bank.js beside exam-06.html and exam-06-app.js.'}
window.ZAC06_TEST={clean,matchShort,isCorrect,expected,sessionMetrics,latestTopicProfile,radarMarkup,trendMarkup,sameQuestionSet,subjectCounts:Object.fromEntries(Object.entries(BANK).map(([k,v])=>[k,v.length]))};
})();
