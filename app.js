const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const NOTES = [
  {n:'до', pc:0}, {n:'до-диез', pc:1}, {n:'ре', pc:2}, {n:'ре-диез', pc:3},
  {n:'ми', pc:4}, {n:'фа', pc:5}, {n:'фа-диез', pc:6}, {n:'соль', pc:7},
  {n:'соль-диез', pc:8}, {n:'ля', pc:9}, {n:'ля-диез', pc:10}, {n:'си', pc:11}
];
const WHITE = ['до','ре','ми','фа','соль','ля','си'];
const PC = Object.fromEntries(NOTES.map(x=>[x.pc,x.n]));
const ROOTS = WHITE;
const ROOT_PC = {до:0,ре:2,ми:4,фа:5,соль:7,ля:9,си:11};
const TYPE_INTERVALS = {
  'мажор':[0,4,7], 'минор':[0,3,7], 'уменьшённый':[0,3,6], 'sus4':[0,5,7]
};
const CHORD_FINGERINGS = {
  right:['1','3','5'], left:['5','3','1']
};

const TITLES = [
'Первые семь нот','Находим до и соль','Правильная посадка','Положение рук','Первые пять пальцев','Ориентиры на клавиатуре','Ровный счёт 1–2–3–4','Сильная и слабая доля','Первые ритмы','Первая короткая мелодия',
'До–ре–ми','Ми–ре–до','Пять нот в движении','Пять нот без остановки','Слушаем и повторяем','Паузы','Длинная и короткая нота','Метроном без страха','Мини-мелодия №2','Как запоминать маленький фрагмент',
'Правая рука: пять пальцев','Левая рука: пять пальцев','Перенос руки','Прыжок через ноту','Фраза из четырёх нот','Легато','Стаккато','Тише и громче','Акцент','Мини-мелодия №3',
'Что такое нотный стан','Скрипичный ключ','Басовый ключ','Ноты правой руки','Ноты левой руки','Ориентиры: до и соль','Читаем ноты по шагам','Ритм прямо на нотном стане','Читаем маленькую фразу','Мини-мелодия №4',
'Что такое аккорд','До мажор','Соль мажор','Фа мажор: аккорд','Ре мажор','Ля минор','Ми минор','Ре минор','Переход До–Соль','Четыре первых аккорда',
'Мажор и минор','Форма мажорного аккорда','Форма минорного аккорда','Уменьшённый аккорд','Sus2: что это','Sus4: что это','Обращения аккордов','Как двигать аккорды без прыжков','Аккордовая последовательность','Аккорды под мелодию',
'Гамма до мажор','Гамма соль мажор','Гамма ре мажор','Гамма ля минор','Гамма ми минор','Гамма фа мажор','Гамма си-бемоль мажор','Аппликатура гамм','Гамма вверх и вниз','Гамма как разминка',
'Арпеджио','Разложенный аккорд','Переход большого пальца','Независимость пальцев','Равномерность','Ускоряем только после чистоты','Метроном и скорость','Динамика в гаммах','Арпеджио двумя руками','Техническая связка',
'Левая рука как бас','Бас + аккорд','Вальсовый ритм','Бас–аккорд без паузы','Остинато','Левая рука в мелодии','Мелодия + гармония','Баланс двух рук','Простое сопровождение','Мини-композиция',
'Синкопа','Триоли','Ритмические связки','Педаль: зачем она','Педаль без грязи','Фразировка','Музыкальное предложение','Как тренироваться 15 минут','Как учить песню по кусочкам','Подготовка к итоговой песне',
'Итоговая песня: знакомство с Let It Be','Let It Be: аккорды','Let It Be: правая рука','Let It Be: левая рука','Let It Be: соединяем руки','Let It Be: первая часть','Let It Be: припев','Let It Be: смены аккордов','Let It Be: медленно вместе','Let It Be: игра без подсказок','Let It Be: динамика','Let It Be: педаль','Let It Be: полный разбор','Let It Be: контрольная игра','Финал: сыграй Let It Be целиком'
];

const SONGS = [
 {id:'spring',name:'Spring — The Valley Comes Alive',level:'Средняя',video:'8sh31m-QBvU',desc:'Весенняя тема Stardew Valley. Видео — только пример звучания; обучение идёт внутри приложения.',tags:['мелодия','две руки','аккорды']},
 {id:'bigworld',name:'Spring — It’s A Big World Outside',level:'Средняя',video:'MdHPSCbcEgE',desc:'Пиано-версия весенней темы.',tags:['мелодия','ритм']},
 {id:'spring_synthesia',name:'The Valley Comes Alive — Synthesia',level:'Средняя',video:'v7Qg4c7vY4I',desc:'Визуальный пример исполнения.',tags:['две руки','визуализация']},
 {id:'flower',name:'Flower Dance',level:'Средняя',video:null,desc:'Одна из самых узнаваемых тем игры.',tags:['мелодия','аккорды']},
 {id:'rain',name:'Rain',level:'Средняя',video:null,desc:'Спокойная тема для работы над легато и динамикой.',tags:['легато','динамика']},
 {id:'winter',name:'Winter Festival',level:'Средняя',video:null,desc:'Тема для тренировки мягкой мелодии.',tags:['мелодия','ритм']},
 {id:'summer',name:'Summer',level:'Средняя',video:null,desc:'Летняя тема для спокойного двухручного исполнения.',tags:['две руки']},
 {id:'fall',name:'Fall',level:'Средняя',video:null,desc:'Осенняя тема с удобной практикой мелодии.',tags:['мелодия']},
 {id:'ghost',name:'Ghost Synth',level:'Продвинутая',video:null,desc:'Более атмосферная тема для работы с ритмом.',tags:['ритм','две руки']},
 {id:'mines',name:'Mines',level:'Продвинутая',video:null,desc:'Ритмичная тема для координации.',tags:['ритм','аккорды']},
 {id:'nightmarket',name:'Night Market',level:'Средняя',video:null,desc:'Спокойная мелодия для фразировки.',tags:['фразировка']},
 {id:'dance_moonlight',name:'Dance of the Moonlight Jellies',level:'Средняя',video:null,desc:'Мягкая тема для педали и динамики.',tags:['педаль','динамика']},
 {id:'gus',name:'Gus’ Theme',level:'Средняя',video:null,desc:'Тема для простого аккомпанемента.',tags:['аккорды','бас']},
 {id:'elevator',name:'Elevator',level:'Продвинутая',video:null,desc:'Ритмическая тема для координации.',tags:['ритм']},
 {id:'saloon',name:'The Stardrop Saloon',level:'Средняя',video:null,desc:'Тема для работы с аккордовым сопровождением.',tags:['аккорды','ритм']},
 {id:'ancient',name:'Ancient',level:'Продвинутая',video:null,desc:'Атмосферная тема для более свободной игры.',tags:['динамика','две руки']}
];

const state = JSON.parse(localStorage.getItem('pianoLearningV5') || '{"completed":{},"xp":0,"streak":0,"last":"","todayXP":0}');
let mic = {stream:null,ctx:null,analyser:null,raf:null,stableMidi:null,stableSince:0,lastHandled:null,lastHandledAt:0,silentFrames:0,lastChordSig:'',lastChordAt:0};
let lessonRuntime = null;

function save(){localStorage.setItem('pianoLearningV5',JSON.stringify(state));}
function today(){return new Date().toISOString().slice(0,10);}
function touch(){const d=today();if(state.last!==d){if(state.last){const diff=Math.round((new Date(d)-new Date(state.last))/86400000);state.streak=diff===1?state.streak+1:1}else state.streak=1;state.last=d;state.todayXP=0;save()}}
function dayWord(n){const a=Math.abs(n)%100,b=a%10;return a>10&&a<20?'дней':b===1?'день':b>=2&&b<=4?'дня':'дней'}
function streakText(){return `🔥 ${state.streak} ${dayWord(state.streak)}`}
function completedCount(){return Object.keys(state.completed).length}
function xpFor(i){return i>=111?25:(i%10===0?15:(i%5===0?12:10))}
function noteName(midi){return PC[((midi%12)+12)%12] || 'неизвестная нота'}
function octave(midi){return Math.floor(midi/12)-1}
function displayNote(midi){return `${noteName(midi)}, ${octave(midi)} октава`}
function midiFor(root,offset=0){return 60+ROOT_PC[root]+offset}
function chord(root,type,octaveBase=60){const ints=TYPE_INTERVALS[type];return ints.map(i=>octaveBase+ROOT_PC[root]+i)}
function chordText(root,type){return chord(root,type).map(noteName).join(' · ')}
function chordLabel(root,type){return `${root} ${type}`}
function typeForTitle(t){
 if(/аккорд|мажор|минор|sus|уменьш/.test(t)) return 'chord';
 if(/гамма|аппликатура гамм/.test(t)) return 'scale';
 if(/арпеджио|разложенный/.test(t)) return 'arpeggio';
 if(/ритм|доля|паузы|триоли|синкоп/.test(t)) return 'rhythm';
 if(/посадка/.test(t)) return 'posture';
 if(/рук|пальц|двумя руками|двух рук|баланс/.test(t)) return 'hands';
 if(/нотн|скрипич|басовый|читаем|ориентир/.test(t)) return 'reading';
 if(/^Let It Be/.test(t) || /Финал/.test(t)) return 'song';
 return 'note';
}
function lessonTheory(i,title,type){
 const basics={
  note:'Сегодня берём одну маленькую задачу и сразу переносим её на настоящий синтезатор. Сначала пойми идею, потом сыграй её несколько раз без экрана.',
  posture:'Главное — не идеальная поза, а отсутствие лишнего напряжения. Сядь прямо и свободно, держи стопы на полу, плечи расслабь, а локти примерно на уровне клавиш.',
  hands:'Пальцы слегка согнуты, кисть продолжает линию предплечья. Не дави на клавиши всей рукой: звук должен появляться от точного движения пальца.',
  rhythm:'Ритм — это не скорость. Сначала учимся чувствовать ровный пульс, затем добавляем рисунок. Если сбился, остановись и снова считай вслух.',
  reading:'Нотный стан — это карта высоты звука. Сегодня нам не нужно запоминать всё сразу: берём один ориентир и связываем его с реальной клавишей.',
  chord:'Аккорд — несколько нот, звучащих одновременно. Трезвучие строится из трёх звуков: основы, третьей ступени и пятой. Сначала пойми форму, потом сыграй её на своём синтезаторе.',
  scale:'Гамма — последовательность ступеней. Она нужна не ради заучивания списка нот, а чтобы рука привыкала к расстояниям и аппликатуре.',
  arpeggio:'Арпеджио — это аккорд, сыгранный по очереди. Оно помогает одновременно слышать гармонию и контролировать движение руки.',
  song:'Видео здесь только для того, чтобы услышать и увидеть общий результат. Само обучение происходит внутри приложения: нотный стан, маленький фрагмент, проверка микрофоном и постепенное соединение рук.'
 };
 return basics[type] || basics.note;
}
function lessonPractice(i,title,type){
 if(type==='note') return 'Сыграй последовательность из трёх–семи нот на своём синтезаторе. Приложение не засчитает неверную ноту и после трёх ошибок покажет подсказку.';
 if(type==='posture') return 'Проверь посадку, поставь руки в удобное положение и сыграй короткую последовательность. Урок считается выполненным только после успешной проверки.';
 if(type==='hands') return 'Сначала сыграй задание отдельно каждой рукой, затем повтори двумя руками. Темп выбирай медленный: точность важнее скорости.';
 if(type==='rhythm') return 'Сначала простучи ритм пальцами по столу, затем сыграй его на одной ноте синтезатора. Микрофон проверит сам звук.';
 if(type==='reading') return 'Посмотри на ноты на стане и сыграй их на синтезаторе. Экран не заменяет клавиатуру: проверяется именно звук из микрофона.';
 if(type==='chord') return 'На стане появится аккорд. Сыграй все его ноты одновременно на своём синтезаторе. При ошибке приложение покажет, что услышало.';
 if(type==='scale') return 'Сыграй гамму вверх, затем вниз. После этого повтори её медленнее, стараясь сделать звук ровным.';
 if(type==='arpeggio') return 'Сыграй ноты аккорда по одной. Следи, чтобы между ними не было случайных лишних звуков.';
 if(type==='song') return 'Разбирай фрагмент по одной руке, затем соединяй. После каждого этапа приложение проверяет сыгранные ноты через микрофон.';
 return 'Выполни задание на своём синтезаторе.';
}
function lessonInfo(i){const title=TITLES[i-1],type=typeForTitle(title);return {i,title,type,theory:lessonTheory(i,title,type),practice:lessonPractice(i,title,type)};}

function renderShell(active){touch();$('#streak').textContent=streakText();$$('.screen').forEach(s=>s.classList.remove('active'));const el=$(`#${active}`);if(el)el.classList.add('active');$$('nav button').forEach(b=>b.classList.toggle('active',b.dataset.nav===active));}
function go(id){renderShell(id);if(id==='home')home();if(id==='course')course();if(id==='practice')practice();if(id==='songs')songs();if(id==='lesson' && lessonRuntime)renderLesson();if(id==='song'){} window.scrollTo({top:0,behavior:'smooth'});}

function header(title,back='home'){return `<div class="pageHead"><button class="iconBtn" data-back="${back}">‹</button><div><small>PIANO LEARNING</small><h1>${title}</h1></div></div>`}
function home(){const done=completedCount(),next=Math.min(115,done+1);$('#home').innerHTML=`<div class="hero"><div class="logoMark">🎹</div><small>ПОЛНЫЙ ПУТЬ ОТ НУЛЯ</small><h1>Научись играть<br><em>по-настоящему.</em></h1><p>115 уроков с теорией, практикой, нотным станом, проверкой через микрофон, аккордами, двумя руками и песнями.</p><button class="primary" id="micHome">🎙 Подключить микрофон</button><div class="micState" id="micState">Для проверки нужен микрофон телефона рядом с синтезатором.</div></div><div class="progressCard"><div><span>Прогресс курса</span><b>${done} / 115</b></div><div class="bar"><i style="width:${done/115*100}%"></i></div><small>${state.xp} XP</small></div><button class="nextCard" id="continue"><div class="emoji">🎹</div><div><small>СЛЕДУЮЩИЙ УРОК</small><h2>${TITLES[next-1]}</h2><p>Урок ${next} из 115</p></div><span>›</span></button><div class="homeGrid"><button data-go="course">📚<b>Курс</b><small>115 уроков</small></button><button data-go="practice">🎯<b>Практика</b><small>Ноты и аккорды</small></button><button data-go="songs">🎵<b>Песни</b><small>16 тем Stardew Valley</small></button></div>`;$('#continue').onclick=()=>openLesson(next);$('#micHome').onclick=startMic;$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));updateMicState();}

function course(){const done=completedCount();$('#course').innerHTML=`${header('Полный курс')}<div class="courseIntro"><b>115 уроков</b><span>От первых нот до игры двумя руками</span></div><div class="lessonList">${TITLES.map((t,idx)=>{const n=idx+1,ok=!!state.completed[n];return `<button class="lessonRow ${ok?'done':''}" data-lesson="${n}"><span class="lessonNum">${ok?'✓':n}</span><div><small>${sectionFor(n)}</small><b>${t}</b><em>${xpFor(n)} XP</em></div><span>›</span></button>`}).join('')}</div>`;$$('[data-lesson]').forEach(b=>b.onclick=()=>openLesson(+b.dataset.lesson));$$('[data-back]').forEach(b=>b.onclick=()=>go(b.dataset.back));}
function sectionFor(n){if(n<=20)return 'База';if(n<=40)return 'Руки и чтение';if(n<=60)return 'Аккорды';if(n<=75)return 'Гаммы и техника';if(n<=90)return 'Две руки';if(n<=100)return 'Музыкальность';return 'Итоговая песня';}

function openLesson(n){lessonRuntime={...lessonInfo(n),step:0,errors:0,showHint:false,sequence:makeSequence(n,typeForTitle(TITLES[n-1])),heard:null,success:false};go('lesson');}
function makeSequence(n,type){
 if(n===1)return [60,62,64,65,67,69,71];
 if(n===2||n===6||n===36)return [60,67,60,67,60];
 if(type==='note'||type==='reading')return [60,62,64,62,60];
 if(type==='rhythm')return [60,60,60,60,60,60,60,60];
 if(type==='scale')return [60,62,64,65,67,69,71,72,71,69,67,65,64,62,60];
 if(type==='arpeggio')return [60,64,67,64,60,64,67,72];
 if(type==='chord')return null;
 if(type==='song')return [60,60,64,62,60,67,67,64];
 if(type==='hands')return [60,62,64,65,67,67,65,64,62,60];
 if(type==='posture')return [60,62,64];
 return [60,62,64,65,67];
}
function renderLesson(){const r=lessonRuntime;if(!r)return;const n=r.i,type=r.type,title=r.title;const total=r.sequence?r.sequence.length:1;const target=r.sequence?r.sequence[r.step]:null;const progressText=type==='chord'?`Шаг ${r.step+1} из 5`:`Шаг ${Math.min(r.step+1,total)} из ${total}`;const targetLabel=type==='chord'?r.chordLabel:displayNote(target);$('#lesson').innerHTML=`<div class="lessonTop"><button class="iconBtn" id="lessonBack">‹</button><div class="lessonProgress"><span>УРОК ${n} / 115</span><b>${progressText}</b><div class="bar"><i style="width:${((r.step)/(type==='chord'?5:total))*100}%"></i></div></div></div><div class="lessonTitle"><span class="lessonEmoji">${visualEmoji(type)}</span><div><small>${sectionFor(n)}</small><h1>${title}</h1></div></div><div class="theoryCard"><div class="theoryLabel">ТЕОРИЯ</div><p>${r.theory}</p>${specialTip(n)}</div>${type==='posture'?postureBlock():''}<div class="staffCard"><div class="staffHeader"><span>НОТНЫЙ СТАН</span><small>${type==='chord'?'Сыграй все ноты одновременно':'Сыграй показанную ноту на синтезаторе'}</small></div><div id="staff">${staffSvg(type==='chord'?r.chordMidi:[target],r.heard)}</div><div class="targetLine"><b>${targetLabel||''}</b><small>${type==='chord'?r.chordNotes:'Слушаем только настоящий синтезатор'}</small></div></div>${piano(48,84)}<div class="practiceCard"><div class="practiceLabel">ПРАКТИКА</div><p>${r.practice}</p><div class="detector" id="lessonFeedback"><span class="dot"></span><b>${r.success?'Верно!':'Жду звук синтезатора'}</b><small>${r.heard?`Услышано: ${displayNote(r.heard)}`:'Сыграй на синтезаторе — клавиши на экране нажимать не нужно.'}</small></div>${r.showHint&&!r.success?`<div class="hint"><b>Подсказка после 3 ошибок</b><span>Нужна нота: ${displayNote(target)}</span></div>`:''}</div><div class="lessonActions"><button class="secondary" id="repeatExplain">↺ Повторить объяснение</button>${r.success?`<button class="primary" id="nextStep">${r.step+1 >= (type==='chord'?5:total)?'✓ Завершить урок':'Следующий шаг →'}</button>`:`<button class="primary" id="micLesson">🎙 Проверить микрофон</button>`}</div>`;$('#lessonBack').onclick=()=>go('course');$('#repeatExplain').onclick=()=>window.scrollTo({top:document.querySelector('.theoryCard').offsetTop-20,behavior:'smooth'});$('#micLesson').onclick=startMic;if(r.success)$('#nextStep').onclick=advanceLesson;updateMicState();if(type==='chord')setupChordLesson();}
function specialTip(n){if([42,43,44,45,46,47,48,51,52,53,54,55,56,57,58,59,60].includes(n))return `<div class="tip"><b>💡 Важный приём</b><span>Для обычного трезвучия правой рукой чаще всего используют пальцы 1–3–5, а левой 5–3–1. Это не магическая формула для любой ситуации, но отличный старт для базовых аккордов.</span></div>`;if([36,68,75].includes(n))return `<div class="tip"><b>💡 Лайфхак</b><span>Не пытайся выучить всю последовательность одним куском. Запомни маленькую группу, сыграй её несколько раз, затем добавь следующую.</span></div>`;return ''}
function visualEmoji(type){return {note:'🎹',posture:'🧍',hands:'👐',rhythm:'🥁',reading:'🎼',chord:'🎼',scale:'〰️',arpeggio:'✨',song:'🎵'}[type]||'🎹'}
function postureBlock(){return `<div class="posture"><div class="postureArt">🧍‍♂️<span>🎹</span></div><div><b>Быстрая проверка</b><p>Стопы на полу · плечи свободны · локти примерно на уровне клавиш · кисти не провалены · ты не тянешься к клавиатуре.</p></div></div>`}

function staffSvg(midis,heard){const width=760,height=190;const lines=[50,68,86,104,122];const minMidi=60,maxMidi=84;function y(m){const diatonic=[0,2,4,5,7,9,11];const oct=Math.floor(m/12)-1;const pc=((m%12)+12)%12;const idx=diatonic.indexOf(pc);const step=(oct-4)*7+(idx<0?diatonic.findIndex(x=>x>=pc):idx);return 122-step*9;}const targets=midis.filter(Boolean);const wrong=heard&&targets.length&&!targets.includes(heard);const noteColor=heard?(targets.includes(heard)?'#48d597':'#ff5d6c'):'#e8edf7';let circles=targets.map((m,i)=>`<circle cx="${260+i*46}" cy="${y(m)}" r="10" fill="#e8edf7" stroke="#111318" stroke-width="2"/>`).join('');if(heard)circles+=`<circle cx="260" cy="${y(heard)}" r="9" fill="${noteColor}" stroke="#fff" stroke-width="2"/><text x="282" y="${y(heard)+5}" fill="${noteColor}" font-size="15" font-weight="700">${noteName(heard)}</text>`;return `<svg viewBox="0 0 ${width} ${height}" class="staffSvg" aria-label="Нотный стан"><g>${lines.map(y=>`<line x1="60" y1="${y}" x2="700" y2="${y}"/>`).join('')}<text x="76" y="104" font-size="58">𝄞</text>${circles}</g><text x="60" y="160" fill="#8991a3" font-size="13">Цель показана на стане. Играй её на своём синтезаторе.</text></svg>`}

function piano(lo=48,hi=84){const whites=[];let x=0;for(let m=lo;m<=hi;m++){if([1,3,6,8,10].includes(m%12))continue;whites.push({m,x});x+=30}const total=x;let html=`<div class="keyboard" style="--w:${total}px">`;for(const k of whites)html+=`<button class="pkey white" data-midi="${k.m}" style="left:${k.x}px"></button>`;for(const k of whites){const b=k.m+1;if(b<=hi&&[1,3,6,8,10].includes(b%12))html+=`<button class="pkey black" data-midi="${b}" style="left:${k.x+20}px"></button>`;}return html+'</div>'}
function postureCheck(){return `<div class="checkGrid">${['Стопы стоят на полу','Плечи расслаблены','Локти примерно на уровне клавиш','Кисти свободные','Не тянусь к клавиатуре'].map((x,i)=>`<label><input type="checkbox" data-posture="${i}"><span>${x}</span></label>`).join('')}</div>`}

function setupChordLesson(){if(lessonRuntime.step===0||!lessonRuntime.chordMidi){const roots=['до','соль','фа','ля','ре'];const types=['мажор','мажор','мажор','минор','минор'];const idx=(lessonRuntime.i+lessonRuntime.step)%roots.length;const root=roots[idx];const type=types[idx];lessonRuntime.chordRoot=root;lessonRuntime.chordType=type;lessonRuntime.chordMidi=chord(root,type);lessonRuntime.chordLabel=chordLabel(root,type);lessonRuntime.chordNotes=chordText(root,type);renderLesson();}}
function advanceLesson(){const r=lessonRuntime;const total=r.type==='chord'?5:r.sequence.length;if(r.step+1>=total){completeLesson(r.i);return}r.step++;r.errors=0;r.showHint=false;r.heard=null;r.success=false;if(r.type==='chord'){r.chordMidi=null}renderLesson();}
function completeLesson(n){state.completed[n]=true;const xp=xpFor(n);state.xp+=xp;state.todayXP+=xp;save();lessonRuntime=null;go('course');}

async function startMic(){if(mic.stream){stopMic();return}try{mic.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});mic.ctx=new (window.AudioContext||window.webkitAudioContext)();const src=mic.ctx.createMediaStreamSource(mic.stream);mic.analyser=mic.ctx.createAnalyser();mic.analyser.fftSize=4096;mic.analyser.smoothingTimeConstant=.15;src.connect(mic.analyser);$('#micState')&&($('#micState').textContent='🎙 Микрофон слушает синтезатор');updateMicState();detectPitch()}catch(e){$('#micState')&&($('#micState').textContent='Не удалось получить доступ к микрофону. Проверь разрешение браузера.');}}
function stopMic(){if(mic.stream)mic.stream.getTracks().forEach(t=>t.stop());if(mic.ctx)mic.ctx.close();cancelAnimationFrame(mic.raf);mic={stream:null,ctx:null,analyser:null,raf:null,stableMidi:null,stableSince:0,lastHandled:null,lastHandledAt:0,silentFrames:0,lastChordSig:'',lastChordAt:0};updateMicState()}
function updateMicState(){const text=mic.stream?'🎙 Микрофон подключён':'Микрофон не подключён';['micState','micStatus'].forEach(id=>{const el=$('#'+id);if(el)el.textContent=text})}
function detectPitch(){if(!mic.analyser)return;const time=new Float32Array(mic.analyser.fftSize);mic.analyser.getFloatTimeDomainData(time);let rms=0;for(const v of time)rms+=v*v;rms=Math.sqrt(rms/time.length);if(rms<.010){mic.silentFrames++;if(mic.silentFrames>5){mic.stableMidi=null;mic.lastHandled=null} }else{mic.silentFrames=0;const r=lessonRuntime;if(r&&r.type==='chord'){const detected=detectPolyphonic(time,mic.ctx.sampleRate);if(detected.length>=2){const sig=detected.map(x=>x%12).join(',');if(sig!==mic.lastChordSig||performance.now()-mic.lastChordAt>800){mic.lastChordSig=sig;mic.lastChordAt=performance.now();handleChordHeard(detected)}}}else{const midi=detectMonophonic(time,mic.ctx.sampleRate);if(midi!==null){if(mic.stableMidi!==midi){mic.stableMidi=midi;mic.stableSince=performance.now()}else if(performance.now()-mic.stableSince>140 && (mic.lastHandled!==midi || performance.now()-mic.lastHandledAt>700)){mic.lastHandled=midi;mic.lastHandledAt=performance.now();handleHeard(midi)}}}}
const p=window.practiceChord;if(p&&mic.stream){const detected=detectPolyphonic(time,mic.ctx.sampleRate);if(detected.length>=2){const sig=detected.map(x=>x%12).join(',');if(sig!==mic.lastChordSig||performance.now()-mic.lastChordAt>800){mic.lastChordSig=sig;mic.lastChordAt=performance.now();handlePracticeChordHeard(detected)}}}
if(window.songPractice&&mic.stream){const midi=detectMonophonic(time,mic.ctx.sampleRate);if(midi!==null){if(window.songPractice.last!==midi){window.songPractice.last=midi;handleSongHeard(midi)}}}
mic.raf=requestAnimationFrame(detectPitch)}
function detectMonophonic(buf,sampleRate){let bestLag=0,best=-Infinity;const minLag=Math.floor(sampleRate/1100),maxLag=Math.min(Math.floor(sampleRate/50),Math.floor(buf.length*.75));for(let lag=minLag;lag<=maxLag;lag+=2){let corr=0,n=0;for(let i=0;i<buf.length-lag;i+=4){corr+=buf[i]*buf[i+lag];n++}corr/=Math.max(1,n);if(corr>best){best=corr;bestLag=lag}}if(!bestLag||best<.002)return null;const freq=sampleRate/bestLag;if(freq<55||freq>1400)return null;return Math.round(69+12*Math.log2(freq/440))}
function fftReal(input){const n=input.length;const re=new Float32Array(input),im=new Float32Array(n);for(let i=1,j=0;i<n;i++){let bit=n>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j){const t=re[i];re[i]=re[j];re[j]=t}}for(let len=2;len<=n;len<<=1){const ang=-2*Math.PI/len,wr=Math.cos(ang),wi=Math.sin(ang);for(let i=0;i<n;i+=len){let ur=1,ui=0,half=len>>1;for(let j=0;j<half;j++){const p=i+j,q=p+half;const tr=re[q]*ur-im[q]*ui,ti=re[q]*ui+im[q]*ur;re[q]=re[p]-tr;im[q]=im[p]-ti;re[p]+=tr;im[p]+=ti;const nur=ur*wr-ui*wi;ui=ur*wi+ui*wr;ur=nur}}}return {re,im}}
function detectPolyphonic(buf,sampleRate){const n=2048;const input=new Float32Array(n);for(let i=0;i<n;i++){const v=buf[i]||0;input[i]=v*(.5-.5*Math.cos(2*Math.PI*i/(n-1)))}const {re,im}=fftReal(input);const peaks=[];for(let k=2;k<n/2-2;k++){const mag=Math.hypot(re[k],im[k]);if(mag>Math.hypot(re[k-1],im[k-1])&&mag>=Math.hypot(re[k+1],im[k+1]))peaks.push({k,mag,f:k*sampleRate/n})}peaks.sort((a,b)=>b.mag-a.mag);const candidates=[];for(const p of peaks){if(p.f<55||p.f>1100)continue;const midi=Math.round(69+12*Math.log2(p.f/440));if(midi<36||midi>96)continue;const pc=midi%12;if(!candidates.some(x=>x.midi%12===pc))candidates.push({midi,mag:p.mag});if(candidates.length>=12)break}const scored=candidates.map(c=>{let score=c.mag;for(const h of [2,3,4]){const hf=440*Math.pow(2,(c.midi-69)/12)*h;const k=Math.round(hf*n/sampleRate);if(k>1&&k<n/2)score+=Math.hypot(re[k],im[k])*.35}return {...c,score}}).sort((a,b)=>b.score-a.score);return scored.slice(0,5).map(x=>x.midi).sort((a,b)=>a-b)}

function handleHeard(midi){const r=lessonRuntime;if(r){const target=r.sequence[r.step];r.heard=midi;if(midi===target){r.success=true;r.errors=0}else{r.success=false;r.errors++;if(r.errors>=3)r.showHint=true}renderLesson();return}if(window.practiceTarget!==undefined){const p=$('#practiceFeedback');if(!p)return;if(midi===window.practiceTarget){p.innerHTML=`<span class="dot good"></span><b>Верно!</b><small>Услышано: ${displayNote(midi)}</small>`;window.practiceReady=true;$('#practiceStaff').innerHTML=staffSvg([window.practiceTarget],midi)}else{p.innerHTML=`<span class="dot bad"></span><b>Неверно</b><small>Услышано: ${displayNote(midi)}</small>`;$('#practiceStaff').innerHTML=staffSvg([window.practiceTarget],midi)}}}
function handleChordHeard(detected){const r=lessonRuntime;if(!r||r.type!=='chord')return;const target=r.chordMidi||[];const pcs=new Set(detected.map(x=>x%12));const good=target.every(x=>pcs.has(x%12));r.heard=detected[0]||null;if(good){r.success=true;r.errors=0}else{r.success=false;r.errors++;if(r.errors>=3)r.showHint=true}renderLesson()}
function handlePracticeChordHeard(detected){const p=window.practiceChord;if(!p)return;const target=p.midi||[];const pcs=new Set(detected.map(x=>x%12));const good=target.every(x=>pcs.has(x%12));const el=$('#chordPracticeFeedback');if(!el)return;if(good){el.innerHTML='<span class="dot good"></span><b>Верно!</b><small>Аккорд распознан через микрофон.</small>'}else{p.errors++;if(p.errors>=3){el.innerHTML=`<span class="dot bad"></span><b>Неверно</b><small>После трёх ошибок: ${chordLabel(p.root,p.type)} — ${chordText(p.root,p.type)}</small>`}else{el.innerHTML=`<span class="dot bad"></span><b>Неверно</b><small>Попробуй ещё раз. Ошибка ${p.errors} из 3.</small>`}}}
function handleSongHeard(midi){const s=window.songPractice;if(!s)return;const target=s.seq[s.step];const el=$('#songFeedback');if(!el)return;if(midi===target){s.step++;if(s.step>=s.seq.length){el.innerHTML='<span class="dot good"></span><b>Фрагмент сыгран!</b><small>Теперь можешь сыграть его ещё раз или перейти к полной версии.</small>';s.last=null}else{el.innerHTML=`<span class="dot good"></span><b>Верно!</b><small>Следующая нота: ${displayNote(s.seq[s.step])}</small>`;$('#songStaff').innerHTML=staffSvg([s.seq[s.step]],null)}}else{el.innerHTML=`<span class="dot bad"></span><b>Неверно</b><small>Услышано: ${displayNote(midi)}. Нужна другая нота.</small>`}}

function practice(){renderShell('practice');$('#practice').innerHTML=`${header('Практика')}<div class="practiceTabs"><button class="active" data-pt="notes">🎼 Ноты</button><button data-pt="chords">🎹 Аккорды</button></div><div id="practiceBody"></div>`;$$('[data-pt]').forEach(b=>b.onclick=()=>{$$('[data-pt]').forEach(x=>x.classList.remove('active'));b.classList.add('active');practiceBody(b.dataset.pt)});practiceBody('notes');$$('[data-back]').forEach(b=>b.onclick=()=>go(b.dataset.back));}
function practiceBody(tab){if(tab==='notes'){window.practiceTarget=60;window.practiceReady=false;$('#practiceBody').innerHTML=`<div class="theoryCard"><div class="theoryLabel">КАК ЭТО РАБОТАЕТ</div><p>Нотный стан показывает цель. Виртуальная клавиатура ничего не проверяет. Ты должен сыграть ноту на своём синтезаторе, а микрофон телефона услышит её.</p></div><div class="staffCard"><div class="staffHeader"><span>ЦЕЛЬ</span><small>Не нажимай клавиши на экране</small></div><div id="practiceStaff">${staffSvg([window.practiceTarget],null)}</div><div class="targetLine"><b>${displayNote(window.practiceTarget)}</b><small>Сыграй на своём синтезаторе</small></div></div><div class="detector" id="practiceFeedback"><span class="dot"></span><b>Жду звук</b><small>Подключи микрофон и сыграй ноту</small></div><button class="primary" id="newPracticeNote">🎲 Новая нота</button>`;$('#newPracticeNote').onclick=()=>{const pcs=[60,62,64,65,67,69,71];window.practiceTarget=pcs[Math.floor(Math.random()*pcs.length)];window.practiceReady=false;$('#practiceStaff').innerHTML=staffSvg([window.practiceTarget],null);$('#practiceFeedback').innerHTML='<span class="dot"></span><b>Жду звук</b><small>Сыграй новую ноту на синтезаторе</small>'}}else{let currentType='мажор';window.practiceChord={root:'до',type:currentType,midi:chord('до',currentType),errors:0,shown:false};$('#practiceBody').innerHTML=`<div class="theoryCard"><div class="theoryLabel">ПРАКТИКА АККОРДОВ</div><p>Выбирай только тип упражнения. Конкретный аккорд приложение выбирает само. Сначала попробуй без подсказки.</p></div><div class="chordTypes">${['мажор','минор','уменьшённый','sus4'].map((t,i)=>`<button class="${i===0?'active':''}" data-ctype="${t}">${t}</button>`).join('')}</div><div class="staffCard"><div class="staffHeader"><span id="practiceChordTitle">СЫГРАЙ АККОРД</span><small>Ноты на стане — ориентир, а не виртуальная клавиатура</small></div><div id="practiceChordStaff">${staffSvg(window.practiceChord.midi,null)}</div><div class="targetLine"><b id="practiceChordName">До мажор</b><small id="practiceChordNotes">${chordText('до','мажор')}</small></div></div><div class="detector" id="chordPracticeFeedback"><span class="dot"></span><b>Жду аккорд</b><small>Сыграй три ноты одновременно</small></div><button class="primary" id="nextPracticeChord">🎲 Следующий аккорд</button>`;$$('[data-ctype]').forEach(b=>b.onclick=()=>{$$('[data-ctype]').forEach(x=>x.classList.remove('active'));b.classList.add('active');currentType=b.dataset.ctype;newPracticeChord()});$('#nextPracticeChord').onclick=newPracticeChord;function newPracticeChord(){const root=ROOTS[Math.floor(Math.random()*ROOTS.length)];window.practiceChord={root,type:currentType,midi:chord(root,currentType),errors:0,shown:false};$('#practiceChordName').textContent=chordLabel(root,currentType);$('#practiceChordNotes').textContent='Попробуй сначала без подсказки';$('#practiceChordStaff').innerHTML=staffSvg(window.practiceChord.midi,null);$('#chordPracticeFeedback').innerHTML='<span class="dot"></span><b>Жду аккорд</b><small>Сыграй все ноты одновременно</small>'}}}

function songs(){renderShell('songs');$('#songs').innerHTML=`${header('Песни')}<div class="songIntro"><b>16 тем Stardew Valley</b><span>Видео — пример звучания. Настоящее обучение: нотный стан + маленькие фрагменты + проверка микрофоном.</span></div><div class="songList">${SONGS.map(s=>`<button class="songRow" data-song="${s.id}"><span class="songIcon">🎵</span><div><small>${s.level}</small><b>${s.name}</b><span>${s.tags.join(' · ')}</span></div><span>›</span></button>`).join('')}</div>`;$$('[data-song]').forEach(b=>b.onclick=()=>openSong(b.dataset.song));$$('[data-back]').forEach(b=>b.onclick=()=>go(b.dataset.back));}
function openSong(id){const s=SONGS.find(x=>x.id===id);renderShell('song');$('#song').innerHTML=`${header(s.name,'songs')}<div class="songHero"><div class="songEmoji">🎵</div><div><small>УЧЕБНАЯ ПЕСНЯ</small><h2>${s.name}</h2><p>${s.desc}</p></div></div>${s.video?`<div class="video"><iframe src="https://www.youtube.com/embed/${s.video}?rel=0" title="${s.name}" allow="accelerometer;autoplay;encrypted-media;picture-in-picture" allowfullscreen></iframe></div>`:`<div class="videoPlaceholder"><b>Видео для этой темы</b><p>Можно добавить конкретную ссылку позже. Обучение ниже работает независимо от видео.</p></div>`}<div class="songLesson"><div class="theoryLabel">КАК БУДЕМ УЧИТЬ</div><p>Видео не учит тебя вместо приложения. Сначала показываем короткий фрагмент на стане, затем объясняем, какая рука играет, какие ноты и аккорды используются, и проверяем исполнение через микрофон.</p><div class="songMap"><span>1. теория</span><span>2. правая</span><span>3. левая</span><span>4. вместе</span><span>5. целиком</span></div><div class="songActions"><button class="secondary" id="playPart">▶ Сыграть часть песни</button><button class="primary" id="playFull">🎵 Сыграть песню полностью</button></div><div class="songStaff" id="songStaff">${staffSvg([60,64,67],null)}</div><div class="songTarget"><b>Учебный фрагмент</b><span>до · ми · соль — пример аккорда, который приложение проверяет на твоём синтезаторе.</span></div><div class="detector" id="songFeedback"><span class="dot"></span><b>Готов к практике</b><small>Нажми «Сыграть часть песни», чтобы начать проверку.</small></div></div>`;$('#playPart').onclick=()=>startSongPractice(s);$('#playFull').onclick=()=>startSongFull(s);$$('[data-back]').forEach(b=>b.onclick=()=>go(b.dataset.back));}
function startSongPractice(s){window.songPractice={step:0,seq:[60,62,64,67,65,64,62,60]};$('#songFeedback').innerHTML='<span class="dot"></span><b>Сыграй первый звук</b><small>Приложение проверит микрофон</small>';$('#songStaff').innerHTML=staffSvg([60],null)}
function startSongFull(s){window.songPractice={step:0,seq:[60,62,64,67,65,64,62,60,60,64,67,72]};$('#songFeedback').innerHTML='<span class="dot"></span><b>Полная учебная дорожка</b><small>Играй по одной ноте. Ошибка не завершает песню.</small>';$('#songStaff').innerHTML=staffSvg([60],null)}

$$('nav button').forEach(b=>b.onclick=()=>go(b.dataset.nav));$('#brand')?.addEventListener('click',()=>go('home'));
window.addEventListener('popstate',()=>go('home'));
touch();home();
