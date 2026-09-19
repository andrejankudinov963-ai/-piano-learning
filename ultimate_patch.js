/* Piano Learning Ultimate v4 — UX, navigation, achievements, calendar and audio-recognition patch */
(function(){
  const P=window.PianoUltimate={};
  const orig={renderPractice:window.renderPractice,renderSong:window.renderSong};
  const esc=window.escapeHtml||((s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])));
  const $=window.$||((s)=>document.querySelector(s)); const $$=window.$$||((s)=>[...document.querySelectorAll(s)]);

  /* ---------- visual interaction ---------- */
  function decorate3D(){
    $$('button, .tile, .songCard, .lessonRow, .miniFeature, .nextLessonCard').forEach(el=>{
      if(el.dataset.pl3d)return; el.dataset.pl3d='1'; el.classList.add('pl3d');
      if(!el.getAttribute('data-depth'))el.setAttribute('data-depth','1');
      el.addEventListener('pointermove',e=>{
        if(e.pointerType==='touch')return;
        const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        el.style.setProperty('--rx',`${(-y*5).toFixed(2)}deg`);el.style.setProperty('--ry',`${(x*6).toFixed(2)}deg`);
      });
      el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')});
    });
  }
  function bindGlobal(){
    decorate3D();
    $$('.bottomNav [data-nav], [data-nav]').forEach(b=>{b.onclick=()=>go(b.dataset.nav)});
    $('#brand')?.addEventListener('click',()=>go('home'));
    $('#streak')?.addEventListener('click',renderCalendar);
  }

  /* ---------- richer achievements ---------- */
  window.achievementList=function(){
    const done=completedCount(), days=Object.keys(state.activityDays||{}).length;
    const songs=Object.values(state.songProgress||{}).filter(v=>v&&Number(v.best)>0).length;
    const xp=Number(state.xp)||0, weak=Object.values(state.mistakes||{}).reduce((a,b)=>a+Number(b||0),0);
    const level=userLevel();
    const arr=[
      ['first-note','🎹','Первая нота','Завершить урок 1',done>=1,false],
      ['five','🌱','Первые пять','Завершить 5 уроков',done>=5,false],
      ['ten','🔥','Разогрев','Завершить 10 уроков',done>=10,false],
      ['twenty','🧭','Нашёл ритм','Завершить 20 уроков',done>=20,false],
      ['thirty','📖','Читаю музыку','Завершить 30 уроков',done>=30,false],
      ['fifty','🎼','Музыкальный скелет','Завершить 50 уроков',done>=50,false],
      ['seventyfive','⚡','Серьёзный темп','Завершить 75 уроков',done>=75,false],
      ['hundred','🏆','Последняя прямая','Завершить 100 уроков',done>=100,false],
      ['master','👑','Курс завершён','Завершить все 115 уроков',done>=115,false],
      ['xp100','💫','Первая сотня','Набрать 100 XP',xp>=100,false],
      ['xp500','💎','Полтысячи','Набрать 500 XP',xp>=500,false],
      ['xp1000','🚀','Ты в потоке','Набрать 1000 XP',xp>=1000,false],
      ['level5','5️⃣','Уровень 5','Достичь 5 уровня',level>=5,false],
      ['level10','🔟','Десятый уровень','Достичь 10 уровня',level>=10,false],
      ['level15','🔮','Высшая лига','Достичь 15 уровня',level>=15,false],
      ['level20','🌌','Далеко зашёл','Достичь 20 уровня',level>=20,false],
      ['level25','🏅','Выпускник','Достичь 25 уровня',level>=25,false],
      ['streak3','🔥','Три дня подряд','Заниматься 3 дня подряд',(state.streak||0)>=3,false],
      ['streak7','🔥','Неделя в ритме','Заниматься 7 дней подряд',(state.streak||0)>=7,false],
      ['streak30','☀️','Месяц без паузы','Заниматься 30 дней подряд',(state.streak||0)>=30,true],
      ['song1','🎵','Первая песня','Открыть первый этап песни',songs>=1,false],
      ['song5','🎧','Репертуар','Начать 5 песенных проектов',songs>=5,false],
      ['song10','🎤','Сцена открыта','Начать 10 песенных проектов',songs>=10,true],
      ['mistakes10','🧠','Ошибка → навык','Совершить 10 ошибок и потом вернуться к ним',weak>=10,false],
      ['clean','✨','Чистый проход','Пройти урок без ошибки',false,true],
      ['speed','⚡','Не сбился','Завершить ритмический урок',false,true],
      ['ear','👂','Слышать глазами не надо','Успешно пройти тренировку слуха',false,true],
      ['chord','⌬','Три сразу','Правильно распознать аккорд',false,true],
      ['octaves','🗺️','Пять этажей','Сыграть ноты в пяти разных октавах',false,true],
      ['midnight','🌙','Ещё один прогон','Потренироваться поздним вечером',false,true]
    ].map(x=>({id:x[0],icon:x[1],title:x[2],desc:x[3],ok:x[4],hidden:x[5]}));
    return arr;
  };
  window.renderAchievements=function(){
    const list=achievementList(), unlocked=list.filter(a=>a.ok).length;
    const overlay=$('#calendarOverlay');if(!overlay)return;
    overlay.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="achievementDialog card" role="dialog" aria-modal="true" aria-label="Достижения">
      <div class="dialogTop"><div><div class="sectionKicker">ДОСТИЖЕНИЯ · ${unlocked}/${list.length}</div><h2>Коллекция навыков</h2><p>Часть значков открыто показывает цель. Скрытые появляются только после выполнения.</p></div><button class="closeBtn" id="achClose">×</button></div>
      <div class="achievementGrid">${list.map(a=>a.ok?`<div class="achievement unlocked"><span>${a.icon}</span><div><b>${a.title}</b><small>${a.desc}</small></div><i>✓</i></div>`:a.hidden?`<div class="achievement hiddenAch"><span>?</span><div><b>Скрытое достижение</b><small>Условие откроется после выполнения.</small></div><i>🔒</i></div>`:`<div class="achievement"><span>${a.icon}</span><div><b>${a.title}</b><small>${a.desc}</small></div><i>🔒</i></div>`).join('')}</div>
    </div>`;
    overlay.className='calendarOverlay show';
    $('#achClose').onclick=()=>overlay.className='calendarOverlay';$('#calendarBackdrop').onclick=()=>overlay.className='calendarOverlay';decorate3D();
  };

  /* ---------- calendar + level ---------- */
  function levelDialog(){
    const o=$('#calendarOverlay');if(!o)return;const lvl=userLevel(),xp=Number(state.xp)||0;
    o.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="levelDialog card" role="dialog" aria-modal="true"><div class="dialogTop"><div><div class="sectionKicker">ПРОГРЕСС</div><h2>Уровни Piano Learning</h2><p>Каждые 100 XP открывают следующий уровень. Ничего не сбрасывается.</p></div><button class="closeBtn" id="levelClose">×</button></div><div class="levelHero"><div class="levelOrb">${lvl}</div><div><b>Уровень ${lvl}</b><span>${xp} XP · ${100-(xp%100||0)} XP до следующего</span></div></div><div class="levelList">${Array.from({length:25},(_,i)=>{const n=i+1,need=(n-1)*100;return `<div class="levelRow ${n<=lvl?'reached':''} ${n===lvl?'current':''}"><span>${n}</span><div><b>Уровень ${n}</b><small>${need} XP</small></div>${n<=lvl?'<i>✓</i>':'<i>🔒</i>'}</div>`}).join('')}</div></div>`;
    o.className='calendarOverlay show';$('#levelClose').onclick=()=>o.className='calendarOverlay';$('#calendarBackdrop').onclick=()=>o.className='calendarOverlay';
  }
  window.renderCalendar=function(){
    const overlay=$('#calendarOverlay');if(!overlay)return;const days=state.activityDays||{};const now=new Date();now.setHours(12,0,0,0);const start=new Date(now);start.setDate(start.getDate()-140);while(start.getDay()!==1)start.setDate(start.getDate()-1);
    let cells='';for(let i=0;i<147;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=todayKeyFromDate(d),c=Number(days[key]||0),level=c>=6?4:c>=4?3:c>=2?2:c?1:0;cells+=`<span class="calCell level-${level}" title="${esc(d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'}))}: ${c}"></span>`}
    overlay.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="calendarDialog card" role="dialog" aria-modal="true" aria-label="Календарь активности"><div class="dialogTop"><div><div class="sectionKicker">АКТИВНОСТЬ</div><h2>Календарь занятий</h2><p>Зелёные клетки — дни, когда ты реально занимался.</p></div><button class="closeBtn" id="calendarClose">×</button></div><div class="calendarStats"><div><b>${state.streak||0}</b><span>дней подряд</span></div><div><b>${Object.keys(days).length}</b><span>активных дней</span></div><div><b>${state.xp||0}</b><span>XP</span></div></div><div class="calendarGrid">${cells}</div><div class="calendarLegend"><span>меньше</span><i class="level-0"></i><i class="level-1"></i><i class="level-2"></i><i class="level-3"></i><i class="level-4"></i><span>больше</span></div></div>`;
    overlay.className='calendarOverlay show';$('#calendarClose').onclick=()=>overlay.className='calendarOverlay';$('#calendarBackdrop').onclick=()=>overlay.className='calendarOverlay';
  };

  /* ---------- home: cleaner hierarchy ---------- */
  window.renderHome=function(){
    const done=completedCount(),next=nextLesson()||COURSE_SIZE,lvl=userLevel(),pct=levelProgress(),ach=achievementList().filter(a=>a.ok).length,micReady=!!mic.stream;
    $('#home').innerHTML=`<div class="homeHero ultimateHero"><div class="heroOrb">🎹</div><div class="eyebrow">PIANO LEARNING · ПУТЬ ОТ НУЛЯ</div><h1>Учись. Играй.<br><em>Слышишь — значит умеешь.</em></h1><p>Один понятный шаг за раз: короткое объяснение → интерактив → результат.</p><div class="heroActions"><button class="primary pl3d" id="homeMic">${micReady?'✓ Микрофон готов':'🎙 Подключить микрофон'}</button><button class="secondary pl3d" id="homeStart">▶ ${done?'Продолжить курс':'Начать курс'}</button></div><div class="statusLine ${micReady?'ok':''}"><span class="statusDot"></span>${micReady?'Синтезатор слушается через микрофон.':'Поставь телефон рядом с инструментом и разреши микрофон.'}</div></div>
      <div class="quickStats"><button class="quickStat pl3d" id="homeLevel"><span>✦</span><div><small>УРОВЕНЬ</small><b>${lvl}</b><em>${state.xp} XP</em></div><i>›</i></button><button class="quickStat pl3d" id="openAchievements"><span>🏆</span><div><small>ДОСТИЖЕНИЯ</small><b>${ach}/${achievementList().length}</b><em>Открыть коллекцию</em></div><i>›</i></button><button class="quickStat pl3d" id="openCalendar"><span>🔥</span><div><small>СЕРИЯ</small><b>${state.streak||0} ${plural(state.streak||0,'день','дня','дней')}</b><em>Открыть календарь</em></div><i>›</i></button></div>
      <button class="continueCard pl3d" id="continueCard"><div class="continueArt">${moduleFor(next).icon}</div><div><small>СЛЕДУЮЩИЙ УРОК · ${next}</small><h2>${esc(LESSON_TITLES[next-1])}</h2><p>${esc(moduleFor(next).name)}</p></div><strong>Продолжить →</strong></button>
      <div class="progressCard card"><div class="progressTop"><span>Прогресс курса</span><b>${done} / ${COURSE_SIZE}</b></div><div class="progressTrack"><i style="width:${done/COURSE_SIZE*100}%"></i></div><div class="progressMeta"><span>${state.xp} XP всего</span><span>+${state.todayXP} сегодня</span><button id="openCalendarInline">Календарь →</button></div></div>
      <div class="homeTiles"><button class="tile pl3d" data-go="course"><span>▦</span><b>Курс</b><small>115 уроков · 10 этапов</small></button><button class="tile pl3d" data-go="practice"><span>◎</span><b>Практика</b><small>Ноты · аккорды · слух · тюнер</small></button><button class="tile pl3d" data-go="songs"><span>♪</span><b>Песни</b><small>${SONGS.length} проектов · MIDI</small></button></div>`;
    $('#homeMic').onclick=startMic;$('#homeStart').onclick=()=>openLesson(next);$('#continueCard').onclick=()=>openLesson(next);$('#openAchievements').onclick=renderAchievements;$('#openCalendar').onclick=renderCalendar;$('#openCalendarInline').onclick=renderCalendar;$('#homeLevel').onclick=levelDialog;$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));refreshMicPermissionLabel();decorate3D();
  };

  /* ---------- course: less clutter + octave-aware curriculum ---------- */
  window.renderCourse=function(){
    const next=nextLesson()||COURSE_SIZE;$('#course').innerHTML=`${header('Путь обучения','home','КУРС · 115 УРОКОВ')}<div class="courseHero card"><div><div class="sectionKicker">ТВОЙ МАРШРУТ</div><h2>От первой клавиши до уверенной игры</h2><p>Каждый урок — одна идея. Не 10 подсказок на одном экране.</p></div><div class="courseBigProgress"><b>${completedCount()}</b><span>/ ${COURSE_SIZE}</span></div></div><div class="courseMap">${MODULES.map((m,mi)=>{const total=m.range[1]-m.range[0]+1,done=Object.keys(state.completed).filter(n=>+n>=m.range[0]&&+n<=m.range[1]&&state.completed[n]).length,current=next>=m.range[0]&&next<=m.range[1];return `<section class="module compactModule"><div class="moduleHead"><div class="moduleIcon">${m.icon}</div><div><small>ЭТАП ${mi+1} · ${m.range[0]}–${m.range[1]}</small><h2>${esc(m.name)}</h2><p>${esc(m.desc)}</p></div><span class="moduleCount">${done}/${total}</span></div><div class="lessonList">${Array.from({length:total},(_,j)=>{const n=m.range[0]+j,c=!!state.completed[n],locked=n>firstLockedLesson(),isNext=n===next;return `<button class="lessonRow ${c?'done':''} ${isNext?'current':''} ${locked?'locked':''} pl3d" ${locked?'disabled':''} ${locked?'':`data-lesson="${n}"`}><span class="lessonNum">${c?'✓':locked?'🔒':n}</span><span class="lessonBody"><small>${esc(lessonKind(n))}</small><b>${esc(LESSON_TITLES[n-1])}</b></span><span class="lessonXP">+${xpFor(n)}</span><span class="rowArrow">${locked?'':'›'}</span></button>`}).join('')}</div></section>`}).join('')}</div>`;bindBack();$$('[data-lesson]').forEach(b=>b.onclick=()=>openLesson(+b.dataset.lesson));decorate3D();
  };

  /* ---------- lesson pages: 3-step carousel ---------- */
  const oldLesson=window.renderLesson;
  window.renderLesson=function(){
    const rootBefore=$('#lesson'); if(rootBefore) rootBefore.dataset.paged='0';
    oldLesson();
    const root=$('#lesson');if(!root||root.dataset.paged==='1')return;root.dataset.paged='1';
    const nodes=[...root.children];const headerNode=nodes.find(n=>n.classList.contains('lessonHeader'));const titleNode=nodes.find(n=>n.classList.contains('lessonTitleBlock'));const theory=nodes.find(n=>n.classList.contains('theory'));const task=nodes.find(n=>n.classList.contains('task'));const footer=nodes.find(n=>n.classList.contains('lessonFooter'));
    if(!task)return;
    root.innerHTML='';const rail=document.createElement('div');rail.className='lessonPager';rail.innerHTML='<button class="pagerDot active" data-page="0">1<span>Понять</span></button><i></i><button class="pagerDot" data-page="1">2<span>Сыграть</span></button><i></i><button class="pagerDot" data-page="2">3<span>Закрепить</span></button>';
    const pages=document.createElement('div');pages.className='lessonPages';
    const p1=document.createElement('section');p1.className='lessonPage active';if(headerNode)p1.append(headerNode);if(titleNode)p1.append(titleNode);if(theory)p1.append(theory);
    const p2=document.createElement('section');p2.className='lessonPage';p2.append(task);
    const p3=document.createElement('section');p3.className='lessonPage';if(footer)p3.append(footer);const tip=document.createElement('div');tip.className='resultCard card';tip.innerHTML='<span>✓</span><div><b>Готово? Закрепи навык.</b><small>После выполнения возвращайся сюда: следующий урок откроется автоматически.</small></div>';p3.append(tip);
    pages.append(p1,p2,p3);root.append(rail,pages);
    const show=i=>{pages.querySelectorAll('.lessonPage').forEach((p,j)=>p.classList.toggle('active',j===i));rail.querySelectorAll('.pagerDot').forEach((b,j)=>b.classList.toggle('active',j===i));pages.scrollIntoView({behavior:'smooth',block:'start'})};rail.querySelectorAll('.pagerDot').forEach(b=>b.onclick=()=>show(+b.dataset.page));
    task.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{}));decorate3D();
  };

  /* ---------- practice: varied notes, no infinite C, less repeated copy ---------- */
  window.newPracticeNote=function(){
    const pcs=[0,2,4,5,7,9,11], octs=[3,4,5];let pool=[];for(const o of octs)for(const pc of pcs)pool.push(12*(o+1)+pc);
    let n=pool[Math.floor(Math.random()*pool.length)];if(practiceState.note!=null&&pool.length>1&&n===practiceState.note)n=pool[(pool.indexOf(n)+1)%pool.length];practiceState.note=n;practiceState.notePassed=false;
  };
  const oldPracticeDetection=window.handlePracticeDetection;
  window.handlePracticeDetection=function(m,meta){
    if(practiceState.tab==='session'){
      const t=practiceState.note;if(t!=null&&pitchClass(m)===pitchClass(t)){const st=practiceState.session;st.correct=(st.correct||0)+1;markActive();st.index++;practiceState.notePassed=false;renderPractice();return}
    }
    return oldPracticeDetection(m,meta);
  };

  /* ---------- octave-tolerant / octave-accurate matching ---------- */
  window.handleSequenceDetected=function(m){
    const r=runtime;if(!r||r.passed||r.sequenceDone)return;const target=r.steps[r.step];
    const strict=r.strictOctave===true;const ok=strict?m===target:pitchClass(m)===pitchClass(target);
    flashKeys([m],ok);if(ok){r.step++;r.errors=0;setLessonFeedback('good','Верно!',r.step<r.steps.length?`Следующая цель: ${noteText(r.steps[r.step])}.`:'Последняя нота!');if(r.step>=r.steps.length){if(r.type==='musical'){r.sequenceDone=true;setTimeout(renderLesson,300);return}r.passed=true;completeLesson(r.n);setTimeout(()=>renderLessonComplete(r),360)}else setTimeout(renderLesson,280)}else{r.errors++;state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();setLessonFeedback('bad','Почти',strict?`Услышана ${noteText(m)}. Нужна ${noteText(target)}.`:`Услышана ${noteName(m)}. Нужна нота ${noteName(target)} — октава здесь не важна.`)}};

  /* ---------- robust pitch detector ---------- */
  window.detectPitch=function(buf,sr){
    let mean=0;for(let i=0;i<buf.length;i++)mean+=buf[i];mean/=buf.length;let rms=0;for(let i=0;i<buf.length;i++){const x=buf[i]-mean;rms+=x*x}rms=Math.sqrt(rms/buf.length);if(rms<0.0045)return null;
    const minFreq=27.5,maxFreq=1760,minLag=Math.max(2,Math.floor(sr/maxFreq)),maxLag=Math.min(Math.floor(sr/minFreq),buf.length-2);
    let bestLag=-1,best=-Infinity;
    for(let lag=minLag;lag<=maxLag;lag+=2){let sum=0,ea=0,eb=0,n=buf.length-lag;for(let i=0;i<n;i+=2){const a=buf[i]-mean,b=buf[i+lag]-mean;sum+=a*b;ea+=a*a;eb+=b*b}const c=sum/Math.sqrt((ea*eb)||1);if(c>best){best=c;bestLag=lag}}
    if(bestLag<0||best<0.48)return null;
    const corr=(lag)=>{let sum=0,ea=0,eb=0,n=buf.length-lag;for(let i=0;i<n;i+=2){const a=buf[i]-mean,b=buf[i+lag]-mean;sum+=a*b;ea+=a*a;eb+=b*b}return sum/Math.sqrt((ea*eb)||1)};
    let lag=bestLag;if(bestLag>minLag+1&&bestLag<maxLag-1){const y1=corr(bestLag-1),y2=corr(bestLag),y3=corr(bestLag+1),den=y1-2*y2+y3;if(Math.abs(den)>1e-7)lag=bestLag+.5*(y1-y3)/den}
    let f=sr/lag;
    /* Piano octave correction: compare f, f/2 and f*2. Prefer the candidate whose harmonics explain the waveform without blindly choosing the strongest harmonic. */
    const candidates=[f/2,f,f*2].filter(x=>x>=minFreq&&x<=maxFreq);let chosen=f,bestScore=-Infinity;
    for(const cf of candidates){let score=0;for(let h=1;h<=6;h++){const l=Math.round(sr/(cf*h));if(l<2||l>=buf.length-2)continue;score+=corr(l)*(1/(h**.72))}const sub=cf/2>=minFreq?corr(Math.round(sr/(cf/2))):0;score-=Math.max(0,sub-.75)*.8;if(score>bestScore){bestScore=score;chosen=cf}}
    const exact=69+12*Math.log2(chosen/440),m=Math.round(exact);if(m<21||m>108)return null;return {midi:m,confidence:Math.max(0,Math.min(1,best)),rms,cents:(exact-m)*100};
  };
  window.handleChordDetected=function(value){
    const r=runtime;if(!r||r.passed)return;const c=r.chordRounds?r.chordRounds[r.chordRound]:{root:'до',type:'major',midi:[60,64,67]};const incoming=Array.isArray(value)?value:[value],now=performance.now();r.heardChord=r.heardChord||[];r.heardChord=r.heardChord.filter(x=>now-x.at<1400);incoming.forEach(m=>r.heardChord.push({m,at:now}));const unique=[...new Set(r.heardChord.map(x=>pitchClass(x.m)))],wanted=[...new Set(c.midi.map(pitchClass))];const ok=wanted.every(pc=>unique.includes(pc));const wrong=unique.find(pc=>!wanted.includes(pc));if(wrong!==undefined&&incoming.length>1){r.heardChord=[];setLessonFeedback('bad','Лишняя нота',`Нужен ${c.root} ${CHORD_LABELS[c.type]}.`);return}setLessonFeedback(ok?'good':'wait',ok?'Аккорд распознан':'Собираем аккорд',ok?'Все нужные звуки услышаны.':`Совпало ${wanted.filter(pc=>unique.includes(pc)).length} из ${wanted.length}.`);flashKeys(incoming,ok);if(ok){r.heardChord=[];r.errors=0;r.chordRound++;if(r.chordRound>=r.rounds){r.passed=true;setTimeout(()=>{completeLesson(r.n);renderLessonComplete(r)},360)}else setTimeout(renderLesson,300)}};

  /* ---------- better piano preview sound ---------- */
  window.playPianoNote=function(m,when=0,duration=2.4,velocity=.9){
    if(!oscillatorCtx)oscillatorCtx=new (window.AudioContext||window.webkitAudioContext)();const ctx=oscillatorCtx;if(ctx.state==='suspended')ctx.resume();const now=ctx.currentTime+when,f=440*Math.pow(2,(m-69)/12),master=ctx.createGain(),body=ctx.createBiquadFilter();body.type='lowpass';body.frequency.value=Math.min(7200,2400+f*5);body.Q.value=.25;master.gain.setValueAtTime(.0001,now);master.gain.exponentialRampToValueAtTime(.22*velocity,now+.006);master.gain.exponentialRampToValueAtTime(.12*velocity,now+.11);master.gain.exponentialRampToValueAtTime(.055*velocity,now+.48);master.gain.exponentialRampToValueAtTime(.0001,now+duration);body.connect(master).connect(ctx.destination);
    const ps=[{mul:1,g:.72,type:'triangle'},{mul:2,g:.18,type:'sine'},{mul:3,g:.07,type:'sine'},{mul:4,g:.035,type:'sine'},{mul:5,g:.018,type:'sine'}];ps.forEach(p=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type=p.type;o.frequency.value=f*p.mul;g.gain.value=p.g;o.connect(g).connect(body);o.start(now);o.stop(now+duration+.05)});
    const hammer=ctx.createOscillator(),hg=ctx.createGain();hammer.type='triangle';hammer.frequency.value=Math.min(8500,f*5.3);hg.gain.setValueAtTime(.028*velocity,now);hg.gain.exponentialRampToValueAtTime(.0001,now+.055);hammer.connect(hg).connect(master);hammer.start(now);hammer.stop(now+.07);
  };
  window.playTone=function(m,beat=.9){try{if(!oscillatorCtx)oscillatorCtx=new (window.AudioContext||window.webkitAudioContext)();oscillatorCtx.resume();playPianoNote(m,0,Math.max(1.8,beat*2),.95)}catch{}};
  window.playToneGroup=function(notes,dur=1.8){try{if(!oscillatorCtx)oscillatorCtx=new (window.AudioContext||window.webkitAudioContext)();oscillatorCtx.resume();notes.forEach((m,i)=>playPianoNote(m,i*.018,dur,.82))}catch{}};

  /* Remove robot-like “Слушай” label from ear UI and vary ear targets across octaves. */
  window.newEarTarget=function(){const pcs=[0,2,4,5,7,9,11],o=[3,4,5];let t=12*(o[Math.floor(Math.random()*o.length)]+1)+pcs[Math.floor(Math.random()*pcs.length)];if(practiceState.ear?.target===t)t=12*(4)+pcs[(pcs.indexOf(pitchClass(t))+1)%pcs.length];practiceState.ear={target:t};practiceState.earAnswered=false};

  /* Song learning vocabulary + staged flow. */
  window.songStageData=function(s,stage){
    const base=(s.fragment||[60,62,64,67,65,64,62,60]).slice();
    const bases=[48,60,72];const shift=bases[(SONGS.indexOf(s)+1)%3]-(base[0]||60);const seq=base.map(n=>n+shift);
    const plans=[
      {name:'Знакомство',kind:'learn',desc:'Увидь первую ноту и услышь, как начинается фрагмент.',seq:seq.slice(0,1)},
      {name:'Мелодия',kind:'right',desc:'Собери короткую линию правой рукой.',seq:seq.slice(0,4)},
      {name:'Опора',kind:'left',desc:'Добавь басовый рисунок и почувствуй пульс.',seq:seq.slice(0,4).map(n=>n-12)},
      {name:'Вместе',kind:'join',desc:'Соедини мелодию и опору медленно.',seq:seq.slice(0,6)},
      {name:'Прогон',kind:'run',desc:'Сыграй весь учебный фрагмент без остановки.',seq:seq.slice(0,8)}
    ];return plans[Math.max(0,Math.min(4,stage))];
  };
  window.songCoachSteps=function(){return `<div class="songCoachSteps clean"><div class="songCoachStep active"><i>1</i><b>Увидь</b><span>Нота показана на стане и клавиатуре.</span></div><div class="songCoachStep"><i>2</i><b>Услышь</b><span>Нажми «Послушать» — эталон будет достаточно громким.</span></div><div class="songCoachStep"><i>3</i><b>Сыграй</b><span>После правильного звука откроется следующая нота.</span></div></div>`};

  /* Patch practice rendering to remove repeated “умная практика” and create varied queues. */
  window.renderPractice=function(){orig.renderPractice();const body=$('#practice');if(!body)return;const intro=body.querySelector('.practiceIntro');if(intro)intro.innerHTML='<div class="sectionKicker">ПРАКТИКА</div><p>Отдельный тренажёр. Здесь можно заниматься независимо от курса.</p>';decorate3D()};

  /* Fix Start-from-zero semantics: always continue means next unfinished; explicit reset is only inside settings/lesson restart. */
  window.openLesson=window.openLesson;

  /* Re-render and decorate after overrides are installed. */
  bindGlobal();
  ensureDay();render();
})();
