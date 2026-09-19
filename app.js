'use strict';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const STORAGE = 'pianoLearningV5';
const COURSE_SIZE = 115;
const NOTE_NAMES = ['до','до♯','ре','ре♯','ми','фа','фа♯','соль','соль♯','ля','ля♯','си'];
const FLAT_NAMES = ['до','ре♭','ре','ми♭','ми','фа','соль♭','соль','ля♭','ля','си♭','си'];
const WHITE_PC = [0,2,4,5,7,9,11];
const ROOT_PC = {до:0,ре:2,ми:4,фа:5,соль:7,ля:9,си:11};
const CHORD_INTERVALS = { major:[0,4,7], minor:[0,3,7], diminished:[0,3,6], sus2:[0,2,7], sus4:[0,5,7] };
const CHORD_LABELS = {major:'мажор',minor:'минор',diminished:'уменьшённый',sus2:'sus2',sus4:'sus4'};
const CHORD_TYPES = Object.keys(CHORD_LABELS);
const HAND_LABELS = {R:'Правая рука',L:'Левая рука',B:'Обе руки'};

const MODULES = [
  {id:'start', icon:'✦', name:'Старт и клавиатура', range:[1,10], desc:'Первые ориентиры: клавиши, пальцы, посадка и первая мелодия.'},
  {id:'rhythm', icon:'◷', name:'Ритм и пульс', range:[11,20], desc:'Счёт, длительности, паузы и ровная игра под метроном.'},
  {id:'reading', icon:'♫', name:'Нотный стан', range:[21,35], desc:'Скрипичный и басовый ключи, направление и чтение маленьких фраз.'},
  {id:'intervals', icon:'↗', name:'Расстояния между нотами', range:[36,45], desc:'Шаги, скачки, расстояния и музыкальные фразы.'},
  {id:'chords', icon:'⌬', name:'Аккорды и гармония', range:[46,60], desc:'Трезвучия, обращения и первые аккордовые последовательности.'},
  {id:'scales', icon:'≈', name:'Гаммы и пальцы', range:[61,72], desc:'Порядок нот, большой палец и ровное движение по клавиатуре.'},
  {id:'technique', icon:'✋', name:'Техника и контроль', range:[73,82], desc:'Ровность, скорость, артикуляция и контроль силы звука.'},
  {id:'hands', icon:'⇄', name:'Две руки', range:[83,92], desc:'Бас, аккорды, остинато, баланс и первая самостоятельная фраза.'},
  {id:'musicality', icon:'◌', name:'Музыкальность', range:[93,100], desc:'Фразировка, педаль, синкопы и умная практика.'},
  {id:'song', icon:'♬', name:'Песенный проект', range:[101,115], desc:'Переносим навыки на реальную музыку: фрагмент → руки → прогон.'}
];

const LESSON_TITLES = [
  'Старт: что делать на первом уроке','Белые и чёрные клавиши','Находим ДО по двум чёрным','Пять пальцев: ДО–СОЛЬ','Переставляем пальцы спокойно','Правая рука: позиция ДО–СОЛЬ','Левая рука: позиция ДО–СОЛЬ','Точки-ориентиры по всей клавиатуре','Пять пальцев вверх и вниз','Первая короткая мелодия',
  'Что такое пульс','Считаем 1–2–3–4','Долгий и короткий звук','Пауза — это тоже музыка','Ровный пульс на одной ноте','Две длительности в одной фразе','Сильная и слабая доля','Метроном: первый уверенный круг','Ритмический рисунок без смены нот','Мелодия с пульсом',
  'Нотный стан: карта высоты','Скрипичный ключ: где живёт СОЛЬ','Басовый ключ: где живёт ФА','Среднее ДО как мост между ключами','МИ на стане','СОЛЬ на стане','ФА и ЛЯ в басу','Читаем направление нот','Шаг вверх и шаг вниз','Через одну ноту','Четыре ноты без подсказки','Не путаем линию и промежуток','Читаем маленькую фразу','Правая рука читает','Левая рука читает',
  'Расстояние между нотами: что это','Секунда — один шаг между нотами','Терция — прыжок через одну','Кварта — четыре ступени','Квинта — пять ступеней','Вверх и вниз','Повтор звука против движения','Одинаковый рисунок выше','Вопрос и ответ','Мини-этюд на интервалы',
  'Что такое аккорд','Трезвучие из трёх нот','До мажор','Ля минор','Фа мажор','Соль мажор','Ми минор','Ре минор','Переход ДО–СОЛЬ','Переход ДО–ФА','Переход ДО–ЛЯ минор','Четыре аккорда по кругу','Мажор или минор на слух','Ровная аккордовая пульсация','Мелодия поверх аккорда',
  'До мажор: гамма','Ля минор: гамма','Соль мажор: гамма','Фа мажор: гамма','Каким пальцем играть правой рукой','Каким пальцем играть левой рукой','Большой палец в движении','Гамма вверх','Гамма вниз','Вверх и вниз без остановки','Арпеджио из трезвучия','Гамма как разминка',
  'Независимость пальцев','Четыре звука ровно','Чистота важнее скорости','Метроном: добавляем темп','Контроль силы удара','Легато: связная линия','Стаккато: лёгкий отрыв','Акцент на первой ноте','Три уровня громкости','Короткая техническая связка',
  'Левая рука как бас','Бас + аккорд','Простой вальсовый рисунок','Мелодия справа, бас слева','Мелодия справа, аккорд слева','Не ускоряемся при смене рук','Баланс двух рук','Повторяющийся рисунок левой руки','Держим повторяющийся рисунок','Собираем восьмитактовую фразу',
  'Фраза как предложение','Где закончить музыкальную мысль','Тише внутри фразы','Вершина фразы','Педаль: зачем она','Смена педали без каши','Нота между долями','Три ноты на один пульс',
  'Как заниматься 13 минуты','Как разбирать песню по кусочкам','Песня: понимаем схему обучения','Песня: узнаём первую ноту','Песня: первая мини-фраза правой','Песня: ещё одна мини-фраза','Песня: левая рука отдельно','Песня: соединяем два фрагмента','Песня: четыре ноты без спешки','Песня: добавляем пульс','Песня: убираем одну подсказку','Песня: играем связку целиком','Песня: аккорд и мелодия вместе','Песня: пробный прогон','Финал курса: сложный музыкальный проект'
];

const SONGS = [
  {id:'overture',title:'Stardew Valley Overture',author:'ConcernedApe',difficulty:'Очень легко',level:1,category:'Игры',icon:'🌱',colorClass:'spring',video:'https://www.youtube.com/watch?v=XeOZRuKQsCI',videoLabel:'Piano cover · Torby Brand',desc:'Первый игровой проект: спокойный темп, простые ориентиры и чтение по одной ноте.',tags:['мелодия','чтение'],fragment:[60,62,64,67,65,64,62,60]},
  {id:'spring',title:'The Valley Comes Alive — Spring',author:'Stardew Valley',difficulty:'Очень легко',level:1,category:'Игры',icon:'☀️',colorClass:'sun',video:'https://www.youtube.com/watch?v=v7Qg4c7vY4I',videoLabel:'Piano tutorial · Sheet Music Boss',desc:'Удобный ранний проект для ритма, чтения и плавного движения.',tags:['ритм','мелодия'],fragment:[60,62,64,67,64,62,60,62]},
  {id:'gymnopedie',title:'Gymnopédie No. 1',author:'Erik Satie',difficulty:'Легко',level:2,category:'Классика',icon:'🌙',colorClass:'moon',video:'https://www.youtube.com/watch?v=XvdcKJs5Z2E',videoLabel:'Easy piano tutorial · PianoSecrets',desc:'Медленная пьеса для легато, фразировки и мягкого контроля.',tags:['легато','фразировка'],fragment:[60,64,67,64,62,65,69,65]},
  {id:'canon',title:'Canon in D',author:'Johann Pachelbel',difficulty:'Средне',level:3,category:'Классика',icon:'🏛️',colorClass:'stone',video:'https://gtdb.org/video/kugiX8WLgK4',videoLabel:'Piano tutorial page · GTDB',desc:'Повторяющаяся гармония помогает почувствовать аккордовую логику.',tags:['аккорды','две руки'],fragment:[62,65,69,67,65,62,60,62]},
  {id:'river',title:'River Flows in You',author:'Yiruma',difficulty:'Средне',level:3,category:'Современная',icon:'💧',colorClass:'water',video:'https://www.youtube.com/watch?v=jWifCal6LxI',videoLabel:'Beginner piano tutorial · Pianote',desc:'Плавный повторяющийся рисунок для независимости рук.',tags:['две руки','повтор'],fragment:[62,65,69,67,65,62,65,69]},
  {id:'comptine',title:'Comptine d’un autre été',author:'Yann Tiersen',difficulty:'Средне',level:3,category:'Современная',icon:'🎞️',colorClass:'film',video:'https://www.youtube.com/watch?v=6f8qOdcCLm8',videoLabel:'Easy piano tutorial · Piano Tutorial Easy',desc:'Мелодия и повторяющийся рисунок левой руки.',tags:['ритм','две руки'],fragment:[60,64,67,64,60,64,69,67]},
  {id:'experience',title:'Experience',author:'Ludovico Einaudi',difficulty:'Средне',level:3,category:'Современная',icon:'🎹',colorClass:'violet',video:'https://www.youtube.com/watch?v=6ED0UP0st1c',videoLabel:'Easy piano tutorial · PHianonize',desc:'Постепенно добавляем повторяющийся рисунок и динамику.',tags:['остинато','динамика'],fragment:[60,64,67,72,67,64,60,64]},
  {id:'interstellar',title:'Cornfield Chase — Interstellar',author:'Hans Zimmer',difficulty:'Средне',level:3,category:'Кино',icon:'🚀',colorClass:'space',video:'https://www.youtube.com/watch?v=nfFQm82IqUc',videoLabel:'Beginner piano tutorial · Pianote',desc:'Повторяющийся пульс и спокойное соединение двух рук.',tags:['ритм','остинато'],fragment:[60,67,64,67,62,67,65,67]},
  {id:'moonlight',title:'Moonlight Sonata — I movement',author:'L. van Beethoven',difficulty:'Средне',level:3,category:'Классика',icon:'🌌',colorClass:'night',video:'https://www.youtube.com/watch?v=AtIqTiPhLvE',videoLabel:'Piano tutorial · PianoSecrets',desc:'Классический проект на ровность, арпеджио и контроль динамики.',tags:['арпеджио','динамика'],fragment:[60,63,67,63,60,62,65,62]},
  {id:'furelise',title:'Für Elise',author:'L. van Beethoven',difficulty:'Продвинуто',level:4,category:'Классика',icon:'🌹',colorClass:'rose',video:'https://www.youtube.com/watch?v=3jOsHod6zWM',videoLabel:'Slow easy piano tutorial · Toms Mucenieks',desc:'Точный повтор мотива и аккуратные смены позиций.',tags:['точность','координация'],fragment:[64,63,64,63,64,59,62,60]},
  {id:'hedwig',title:'Hedwig’s Theme',author:'John Williams',difficulty:'Продвинуто',level:4,category:'Кино',icon:'🪄',colorClass:'magic',video:'https://www.youtube.com/watch?v=WUiI5aQcTow',videoLabel:'Piano tutorial · YouTube',desc:'Более сложный проект с широкими интервалами и выразительностью.',tags:['интервалы','выразительность'],fragment:[71,72,74,71,67,71,76,74]},
  {id:'entertainer',title:'The Entertainer',author:'Scott Joplin',difficulty:'Продвинуто',level:4,category:'Классика',icon:'🎩',colorClass:'jazz',video:'https://www.youtube.com/watch?v=aNski6_7r6g',videoLabel:'Full piano tutorial · PianoSecrets',desc:'Ритмическая точность, акценты и независимость рук.',tags:['синкопа','ритм'],fragment:[64,67,69,72,69,67,64,62]},

  {id:'minecraft',title:'Minecraft Theme',author:'C418',difficulty:'Очень легко',level:1,category:'Игры',icon:'🧱',colorClass:'pixel',video:'https://app.hoffmanacademy.com/lessons/piano/minecraft-piano-tutorial-super-easy/video/',videoLabel:'Super Easy piano tutorial · Hoffman Academy',desc:'Спокойный игровой проект для чтения и ровного пульса.',tags:['мелодия','пульс'],fragment:[60,64,67,64,60,62,64,60]},
  {id:'zelda',title:'The Legend of Zelda Theme',author:'Koji Kondo',difficulty:'Легко',level:2,category:'Игры',icon:'🗡️',colorClass:'green',video:'https://www.youtube.com/watch?v=c0szv75MEU4',videoLabel:'Piano tutorial · Sheet Music Boss',desc:'Игровая мелодия с более активным движением правой руки.',tags:['мелодия','ритм'],fragment:[60,64,65,67,64,60,62,65]},
  {id:'undertale',title:'Undertale — Once Upon a Time',author:'Toby Fox',difficulty:'Легко',level:2,category:'Игры',icon:'💛',colorClass:'yellow',video:'https://www.youtube.com/watch?v=d0sH3c1mwoo',videoLabel:'Easy piano tutorial · Sheet Music Boss',desc:'Короткие фразы и удобный темп для раннего игрового проекта.',tags:['мелодия','фразы'],fragment:[60,62,65,64,60,62,64,67]},
  {id:'celeste',title:'Resurrections',author:'Lena Raine',difficulty:'Средне',level:3,category:'Игры',icon:'🏔️',colorClass:'ice',video:null,videoLabel:'Найти tutorial',desc:'Повторяющиеся фигуры и развитие координации.',tags:['паттерн','две руки'],fragment:[60,64,67,69,67,64,62,64]},
  {id:'hollowknight',title:'Hollow Knight — Dirtmouth',author:'Christopher Larkin',difficulty:'Средне',level:3,category:'Игры',icon:'🪲',colorClass:'hollow',video:null,videoLabel:'Найти tutorial',desc:'Спокойная тема для работы над фразировкой и аккордами.',tags:['аккорды','фразировка'],fragment:[60,64,67,64,60,57,60,62]},
  {id:'pokemon',title:'Pokémon Center Theme',author:'Junichi Masuda',difficulty:'Легко',level:2,category:'Игры',icon:'⚡',colorClass:'electric',video:null,videoLabel:'Найти tutorial',desc:'Короткие узнаваемые фразы для тренировки чтения.',tags:['мелодия','чтение'],fragment:[60,62,64,67,69,67,64,62]},

  {id:'clair',title:'Clair de Lune',author:'Claude Debussy',difficulty:'Продвинуто',level:4,category:'Классика',icon:'🌗',colorClass:'silver',video:'https://www.youtube.com/watch?v=ogAP1fUqERk',videoLabel:'Easy piano tutorial · PHianonize',desc:'Большой проект на легато, педаль, баланс и фразировку.',tags:['педаль','легато'],fragment:[60,64,67,72,69,65,64,60]},
  {id:'prelude',title:'Prelude in C Major',author:'J. S. Bach',difficulty:'Легко',level:2,category:'Классика',icon:'📖',colorClass:'book',video:null,videoLabel:'Найти tutorial',desc:'Арпеджио и повторяющаяся гармоническая форма.',tags:['арпеджио','аккорды'],fragment:[60,64,67,64,60,64,69,64]},
  {id:'ode',title:'Ode to Joy',author:'L. van Beethoven',difficulty:'Очень легко',level:1,category:'Классика',icon:'🎶',colorClass:'gold',video:'https://benchoom.com/free-piano-sheets/ode-to-joy/',videoLabel:'Easy piano guide · Benchoom',desc:'Одна из самых удобных первых мелодий для чтения.',tags:['мелодия','чтение'],fragment:[64,64,65,67,67,65,64,62]},
  {id:'turkish',title:'Turkish March',author:'Wolfgang Amadeus Mozart',difficulty:'Продвинуто',level:4,category:'Классика',icon:'🥁',colorClass:'red',video:'https://www.pianosecrets.co/mozart-turkish-march-rondo-alla-turca-very-slow-piano-tutorial-easy-how-to-play-synthesia/',videoLabel:'Step-by-step piano tutorial · PianoSecrets',desc:'Более быстрый классический проект на ритм и ловкость.',tags:['ритм','техника'],fragment:[64,67,69,71,69,67,65,64]},
  {id:'springvivaldi',title:'Spring — Vivaldi',author:'Antonio Vivaldi',difficulty:'Средне',level:3,category:'Классика',icon:'🌼',colorClass:'flower',video:'https://www.youtube.com/watch?v=ZSm1aZ7KNXA',videoLabel:'Easy piano tutorial · PianoSongDownload',desc:'Репетиционные короткие фразы и смена направления.',tags:['артикуляция','мелодия'],fragment:[64,67,69,71,69,67,64,62]},
  {id:'sugarplum',title:'Dance of the Sugar Plum Fairy',author:'P. I. Tchaikovsky',difficulty:'Продвинуто',level:4,category:'Классика',icon:'🍬',colorClass:'candy',video:'https://www.rhapsodypianostudio.com/latest-videos/dance-of-the-sugar-plum-fairy-piano-lesson',videoLabel:'Easy piano lesson · Rhapsody Piano Studio',desc:'Хороший поздний проект на лёгкость и точность.',tags:['ритм','стаккато'],fragment:[71,72,74,72,71,69,67,69]},
  {id:'waltz2',title:'Waltz No. 2',author:'Dmitri Shostakovich',difficulty:'Продвинуто',level:4,category:'Классика',icon:'🕺',colorClass:'dance',video:null,videoLabel:'Найти tutorial',desc:'Вальсовый рисунок, баланс и уверенная левая рука.',tags:['вальс','две руки'],fragment:[67,71,74,71,69,72,76,72]},

  {id:'kisstherain',title:'Kiss the Rain',author:'Yiruma',difficulty:'Средне',level:3,category:'Современная',icon:'🌧️',colorClass:'rain',video:'https://avirtualpiano.com/learn-piano/yiruma-kiss-the-rain-piano-tutorial-easy/',videoLabel:'Easy piano tutorial · A Virtual Piano',desc:'Плавные аккорды и мелодия поверх повторяющегося рисунка.',tags:['аккорды','легато'],fragment:[60,64,67,72,69,65,64,60]},
  {id:'unamattina',title:'Una Mattina',author:'Ludovico Einaudi',difficulty:'Средне',level:3,category:'Современная',icon:'🌅',colorClass:'dawn',video:null,videoLabel:'Найти tutorial',desc:'Остинато и контроль ровной динамики.',tags:['остинато','динамика'],fragment:[60,64,67,64,62,65,69,65]},
  {id:'nuvole',title:'Nuvole Bianche',author:'Ludovico Einaudi',difficulty:'Средне',level:3,category:'Современная',icon:'☁️',colorClass:'cloud',video:'https://www.youtube.com/watch?v=4VR-6AS0-l4',videoLabel:'Piano performance · Rousseau',desc:'Повторяющиеся рисунки и постепенное наращивание выразительности.',tags:['паттерн','динамика'],fragment:[60,64,69,64,62,65,69,65]},
  {id:'someone',title:'Someone Like You',author:'Adele',difficulty:'Легко',level:2,category:'Поп',icon:'🎤',colorClass:'pop',video:'https://pianomode.com/explore/piano-learning-tutorials/song-tutorials/easy-piano-version-of-someone-like-you-by-adele/',videoLabel:'Easy piano lesson · PianoMode',desc:'Понятная гармония и мелодия на знакомых аккордах.',tags:['аккорды','мелодия'],fragment:[60,64,67,65,64,62,60,62]},
  {id:'clocks',title:'Clocks',author:'Coldplay',difficulty:'Средне',level:3,category:'Поп',icon:'⏱️',colorClass:'clock',video:'https://hdpiano.com/lesson/clocks-easy-by-coldplay',videoLabel:'Easy full-song lesson · HDpiano',desc:'Устойчивый арпеджио-паттерн для координации.',tags:['арпеджио','ритм'],fragment:[60,67,64,67,62,69,65,69]},
  {id:'letitbe',title:'Let It Be',author:'The Beatles',difficulty:'Легко',level:2,category:'Поп',icon:'🌿',colorClass:'olive',video:null,videoLabel:'Найти tutorial',desc:'Простой аккордовый проект: бас, гармония и мелодия.',tags:['аккорды','две руки'],fragment:[60,64,67,64,62,65,69,65]},
  {id:'believer',title:'Believer',author:'Imagine Dragons',difficulty:'Средне',level:3,category:'Поп',icon:'⚡',colorClass:'ember',video:'https://www.youtube.com/watch?v=lFKwuA8oavI',videoLabel:'Easy piano tutorial · Bitesize Piano',desc:'Ритмический проект на акценты и уверенный пульс.',tags:['акценты','ритм'],fragment:[60,60,67,60,69,67,64,60]},
  {id:'skyfall',title:'Skyfall',author:'Adele',difficulty:'Средне',level:3,category:'Кино',icon:'🕶️',colorClass:'spy',video:null,videoLabel:'Найти tutorial',desc:'Медленная гармония и контроль динамики.',tags:['аккорды','динамика'],fragment:[60,63,67,65,64,60,62,64]},
  {id:'pirates',title:'He’s a Pirate',author:'Klaus Badelt / Hans Zimmer',difficulty:'Продвинуто',level:4,category:'Кино',icon:'🏴‍☠️',colorClass:'pirate',video:'https://app.hoffmanacademy.com/lessons/piano/hes-a-pirate-pirates-of-the-caribbean/video/',videoLabel:'Piano tutorial · Hoffman Academy',desc:'Энергичный поздний проект на ритм, скорость и координацию.',tags:['ритм','скорость'],fragment:[64,64,67,69,67,64,62,60]},
  {id:'howl',title:'Merry-Go-Round of Life',author:'Joe Hisaishi',difficulty:'Продвинуто',level:4,category:'Аниме',icon:'🎠',colorClass:'carousel',video:null,videoLabel:'Найти tutorial',desc:'Большой финальный проект на баланс и выразительность.',tags:['две руки','фразировка'],fragment:[60,64,67,69,67,64,62,60]},
  {id:'yourname',title:'Your Name — Sparkle',author:'RADWIMPS',difficulty:'Продвинуто',level:4,category:'Аниме',icon:'✨',colorClass:'star',video:null,videoLabel:'Найти tutorial',desc:'Выразительная мелодия с более сложной координацией.',tags:['две руки','динамика'],fragment:[64,67,69,72,71,69,67,64]}
];

const START_SEQUENCES = [
  [60],[60,62],[60,62,64],[60,64,67],[60,62,64,62,60],[62,64,65,64,62],[64,62,60,62,64],[60,64,62,65,64,60]
];
const READING_SEQUENCES = [
  [60,62,64,62,60],[64,65,67,65,64],[67,65,64,62,60],[60,64,62,65,64,60],[62,64,67,65,64,62]
];
const RHYTHM_COUNTS = [4,6,4,8,6,8,4,8,6,8];
const RHYTHM_PATTERNS = [
  [{u:0,label:'1'},{u:1,label:'2'},{u:2,label:'3'},{u:3,label:'4'}],
  [{u:0,label:'1'},{u:1.5,label:'2-and'},{u:2,label:'3'},{u:3,label:'4'}],
  [{u:0,label:'1'},{u:0.5,label:'1-and'},{u:1.5,label:'2-and'},{u:2.5,label:'3-and'},{u:3.5,label:'4-and'}],
  [{u:0,label:'1'},{u:2,label:'3'},{u:3,label:'4'}],
  [{u:0,label:'1'},{u:1,label:'2'},{u:2.5,label:'3-and'},{u:3,label:'4'},{u:3.5,label:'4-and'}],
  [{u:0,label:'1'},{u:0.5,label:'1-and'},{u:1,label:'2'},{u:2,label:'3'},{u:3,label:'4'}],
  [{u:0,label:'1'},{u:1.5,label:'2-and'},{u:2,label:'3'},{u:3.5,label:'4-and'}],
  [{u:0,label:'1'},{u:1,label:'2'},{u:2,label:'3'},{u:2.5,label:'3-and'},{u:3,label:'4'}],
  [{u:0,label:'1'},{u:1.5,label:'2-and'},{u:2.5,label:'3-and'},{u:3.5,label:'4-and'}],
  [{u:0,label:'1'},{u:0.5,label:'1-and'},{u:1.5,label:'2-and'},{u:2.5,label:'3-and'},{u:3,label:'4'}]
];
const INTERVAL_STEPS = [[60,62],[60,64],[60,65],[62,67],[64,60],[60,64],[64,67],[60,67]];
const SCALE_LIBRARY = {
  'До мажор':[60,62,64,65,67,69,71,72],
  'Ля минор':[69,71,72,74,76,77,79,81],
  'Соль мажор':[67,69,71,72,74,76,77,79],
  'Фа мажор':[65,67,69,70,72,74,76,77]
};
const CHORD_LIBRARY = [
  {root:'до',type:'major'},{root:'ля',type:'minor'},{root:'фа',type:'major'},{root:'соль',type:'major'},
  {root:'ми',type:'minor'},{root:'ре',type:'minor'},{root:'до',type:'diminished'},{root:'соль',type:'sus4'},
  {root:'ре',type:'sus2'},{root:'ми',type:'major'}
];

function moduleFor(n){ return MODULES.find(m=>n>=m.range[0]&&n<=m.range[1]) || MODULES[0]; }
function plural(n,a,b,c){const m=n%100; if(m>=11&&m<=14)return c; const x=n%10; return x===1?a:(x>=2&&x<=4?b:c)}
function noteName(midi, flats=false){const pc=((midi%12)+12)%12;return (flats?FLAT_NAMES:NOTE_NAMES)[pc]}
function octave(midi){return Math.floor(midi/12)-1}
function noteText(midi){return `${noteName(midi)}, ${octave(midi)} октава`}
function pitchClass(midi){return ((midi%12)+12)%12}
function midi(root, offset=0, oct=4){return 12*(oct+1)+ROOT_PC[root]+offset}
function chord(root,type,oct=4){return CHORD_INTERVALS[type].map(i=>midi(root,i,oct))}
function chordText(root,type){return chord(root,type).map(noteName).join(' · ')}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function xpFor(n){return n%10===0?18:n%5===0?14:10}
function sectionName(n){return moduleFor(n).name}
function nextLesson(){for(let i=1;i<=COURSE_SIZE;i++)if(!state.completed[i])return i;return null}
function completedCount(){return Object.values(state.completed).filter(Boolean).length}
function firstLockedLesson(){const n=nextLesson();return n||COURSE_SIZE+1}
function canOpenLesson(n){return n<=Math.min(COURSE_SIZE,firstLockedLesson())}
function todayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}

let state={completed:{},xp:0,streak:0,lastDay:'',todayXP:0,activeSong:null,favorites:[],mistakes:{},activityDays:{},songProgress:{}};
try{
  const old=JSON.parse(localStorage.getItem(STORAGE)||'{}');
  if(old && typeof old==='object') {
    state={...state,...old,completed:old.completed||{},favorites:old.favorites||[],mistakes:old.mistakes||{},activityDays:old.activityDays||{},songProgress:old.songProgress||{}};
    if(old.lastDay && !state.activityDays[old.lastDay]) state.activityDays[old.lastDay]=Math.max(1,Number(old.todayXP)||1);
  }
}catch{}

let mic={stream:null,ctx:null,source:null,analyser:null,freq:null,raf:0,lastMidi:null,candidateMidi:null,candidateSince:0,lastDispatch:0,lastSeen:0,lastChordSig:'',lastChordDispatch:0,ignoreScalarUntil:0};
let route='home';window.songSearch='';window.songFilter='Все';window.songCategory='Все';
let runtime=null;
let practiceState={tab:'notes',note:null,notePassed:false,chord:null,chordPassed:false,chordSeen:[],session:null,weakOnly:false,ear:null,earAnswered:false,tunerNote:null,tunerCents:null};
let songRuntime=null;
let oscillatorCtx=null;

function save(){localStorage.setItem(STORAGE,JSON.stringify(state))}
function countConsecutiveActive(){
  const days=state.activityDays||{};
  let d=new Date();let streak=0;
  while(days[todayKeyFromDate(d)]){streak++;d.setDate(d.getDate()-1)}
  return streak;
}
function todayKeyFromDate(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function ensureDay(){
  const d=todayKey();
  if(!state.activityDays)state.activityDays={};
  if(state.lastDay!==d){state.todayXP=0;state.lastDay=d;save()}
  state.streak=countConsecutiveActive();
  $('#streak').textContent=`🔥 ${state.streak} ${plural(state.streak,'день','дня','дней')}`;$('#xpTop').textContent=`${state.xp} XP`;
}
function markActive(){
  const d=todayKey();
  state.activityDays=state.activityDays||{};
  state.activityDays[d]=(state.activityDays[d]||0)+1;
  state.lastDay=d;state.streak=countConsecutiveActive();
  save();ensureDay();
}
function awardXP(amount){state.xp+=amount;state.todayXP+=amount;markActive();save()}
function completeLesson(n){if(!state.completed[n]){state.completed[n]=true;awardXP(xpFor(n));save()}}
function toast(msg,type=''){const el=$('#toast');el.textContent=msg;el.className=`toast show ${type}`;clearTimeout(toast._t);toast._t=setTimeout(()=>el.className='toast',1900)}
function go(id){if(id!=='lesson'&&metroOn){metroOn=false;stopMetronome()}if(id!=='practice')clearPracticeSessionTimer();route=id;render();window.scrollTo({top:0,behavior:'smooth'})}
function render(){ensureDay();$$('.screen').forEach(s=>s.classList.remove('active'));const view=$(`#${route}`);if(view)view.classList.add('active');$$('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===route));if(route==='home')renderHome();if(route==='course')renderCourse();if(route==='practice')renderPractice();if(route==='songs')renderSongs();if(route==='lesson')renderLesson();if(route==='song')renderSong()}
function header(title,back='home',eyebrow='PIANO LEARNING'){return `<div class="pageHead"><button class="backBtn" data-back="${back}" aria-label="Назад">‹</button><div><div class="eyebrow">${escapeHtml(eyebrow)}</div><h1>${escapeHtml(title)}</h1></div></div>`}
function bindBack(){ $$('[data-back]').forEach(b=>b.onclick=()=>go(b.dataset.back)); }


function userLevel(){
  const xp=Number(state.xp)||0;
  return Math.max(1,Math.floor(xp/100)+1);
}
function levelProgress(){
  const lvl=userLevel(),start=(lvl-1)*100;
  return Math.max(0,Math.min(100,((Number(state.xp)||0)-start)));
}
function achievementList(){
  const done=completedCount();
  const days=Object.keys(state.activityDays||{}).length;
  const songs=Object.values(state.songProgress||{}).filter(v=>v && typeof v==='object' && (Number(v.best)||0)>0).length;
  return [
    {id:'first-note',icon:'🎹',title:'Первая нота',desc:'Завершить урок 1',ok:done>=1},
    {id:'ten-lessons',icon:'🔥',title:'Разогрелся',desc:'Завершить 10 уроков',ok:done>=10},
    {id:'thirty-lessons',icon:'📚',title:'Читаю музыку',desc:'Завершить 30 уроков',ok:done>=30},
    {id:'hundred-xp',icon:'⚡',title:'100 XP',desc:'Набрать 100 XP',ok:(state.xp||0)>=100},
    {id:'seven-days',icon:'🗓️',title:'Ритм',desc:'Заниматься 7 дней',ok:days>=7},
    {id:'first-song',icon:'🎵',title:'Первая песня',desc:'Начать песенный проект',ok:songs>=1},
    {id:'course-half',icon:'🏆',title:'Половина пути',desc:'Дойти до 58 урока',ok:done>=58},
    {id:'course-master',icon:'👑',title:'Курс завершён',desc:'Завершить все 115 уроков',ok:done>=115}
  ];
}
function dailyMission(){
  const day=todayKey();
  const seed=[...day].reduce((a,c)=>a+c.charCodeAt(0),0);
  const missions=[
    {kind:'lessons',goal:1,label:'Пройти один урок',done:()=>completedCount()>0?1:0},
    {kind:'xp',goal:30,label:'Заработать 30 XP',done:()=>Math.min(30,Number(state.todayXP)||0)},
    {kind:'song',goal:1,label:'Поиграть с песней',done:()=>state.activeSong?1:0},
    {kind:'weak',goal:3,label:'Трижды потренировать слабое место',done:()=>Math.min(3,Object.keys(state.mistakes||{}).length)}
  ];
  return missions[seed%missions.length];
}
function renderAchievements(){
  const list=achievementList();
  const overlay=$('#calendarOverlay'); if(!overlay)return;
  overlay.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="achievementDialog card" role="dialog" aria-modal="true">
    <div class="calendarHead"><div><div class="sectionKicker">ДОСТИЖЕНИЯ</div><h2>Твои маленькие победы</h2><p>Открывай значки не за случайные клики, а за настоящую практику.</p></div><button class="backBtn" id="achClose">×</button></div>
    <div class="achievementGrid">${list.map(a=>`<div class="achievement ${a.ok?'unlocked':''}"><span>${a.icon}</span><div><b>${a.title}</b><small>${a.desc}</small></div>${a.ok?'<i>✓</i>':'<i>🔒</i>'}</div>`).join('')}</div>
  </div>`;
  overlay.className='calendarOverlay show';
  $('#achClose').onclick=()=>overlay.className='calendarOverlay';
  $('#calendarBackdrop').onclick=()=>overlay.className='calendarOverlay';
}
function renderDailyCard(){
  const m=dailyMission(), v=Math.min(m.goal,m.done()), pct=(v/m.goal)*100;
  return `<div class="dailyCard card"><div class="dailyTop"><div><div class="sectionKicker">ЗАДАЧА ДНЯ</div><h3>${escapeHtml(m.label)}</h3></div><span>${v}/${m.goal}</span></div><div class="progressTrack"><i style="width:${pct}%"></i></div><small>Сделай маленький шаг сегодня — прогресс сохранится автоматически.</small></div>`;
}
function renderHome(){
  const done=completedCount(), next=nextLesson(), effectiveNext=next||COURSE_SIZE, mod=moduleFor(effectiveNext), micReady=!!mic.stream;
  const lvl=userLevel(), lvlPct=levelProgress(), achievements=achievementList().filter(a=>a.ok).length;
  const weakCount=Object.keys(state.mistakes||{}).length;
  $('#home').innerHTML=`
    <div class="homeHero">
      <div class="heroTopline"><span class="heroBadge">✦</span><span class="microLabel">УЧЕБНЫЙ РЕЖИМ · УРОВЕНЬ ${lvl}</span></div>
      <div class="eyebrow">Курс от первой ноты до самостоятельной игры</div>
      <h1>Не просто смотри.<br><em>Играй.</em></h1>
      <p>Сайт ведёт тебя шаг за шагом: объясняет одну идею, показывает цель, слушает настоящий инструмент и не открывает следующий шаг, пока предыдущий не понят.</p>
      <div class="heroActions">
        <button class="primary" id="homeMic">${micReady?'✓ Микрофон подключён':'🎙 Подключить микрофон'}</button>
        <button class="secondary" id="homeStart">${done?'▶ Продолжить':'▶ Начать с нуля'}</button>
      </div>
      <div class="statusLine ${micReady?'ok':''}"><span class="statusDot"></span>${micReady?'Микрофон готов. Телефон слушает ваш синтезатор.':'Поставь телефон рядом с синтезатором. Браузер спросит доступ при первом подключении.'}</div>
      <div id="micPermission" class="permissionHint"></div>
    </div>

    ${renderDailyCard()}

    <div class="dashboardGrid">
      <div class="levelCard card">
        <div class="dashIcon">✦</div>
        <div><div class="sectionKicker">УРОВЕНЬ</div><b>Уровень ${lvl}</b><small>${state.xp} XP · ещё ${100-lvlPct} XP до следующего</small></div>
        <div class="miniProgress"><i style="width:${lvlPct}%"></i></div>
      </div>
      <button class="miniFeature card" id="openAchievements"><span>🏆</span><div><b>Достижения</b><small>${achievements} из ${achievementList().length} открыто</small></div><strong>›</strong></button>
    </div>

    <button class="nextLessonCard" id="continueCard">
      <div class="nextIcon">${mod.icon}</div>
      <div><div class="microLabel">СЛЕДУЮЩИЙ УРОК · ${effectiveNext}</div><h2>${escapeHtml(LESSON_TITLES[effectiveNext-1])}</h2><p>${escapeHtml(mod.name)}</p></div>
      <span class="arrow">›</span>
    </button>

    ${weakCount?`<button class="smartReview card" id="smartReview"><div class="smartIcon">↗</div><div><div class="sectionKicker">УМНАЯ РЕКОМЕНДАЦИЯ</div><b>Есть ${weakCount} ${plural(weakCount,'слабое место','слабых места','слабых мест')}</b><small>Приложение заметило, где ты ошибаешься чаще всего. Давай закрепим это сейчас.</small></div><span>Тренировать →</span></button>`:''}

    <div class="progressCard card">
      <div class="progressTop"><span>Прогресс курса</span><b>${done} / ${COURSE_SIZE}</b></div>
      <div class="progressTrack"><i style="width:${(done/COURSE_SIZE)*100}%"></i></div>
      <div class="progressMeta"><span>${state.xp} XP всего</span><span>+${state.todayXP} сегодня</span><button id="openCalendarInline">Календарь →</button></div>
    </div>

    <div class="homeTiles">
      <button class="tile" data-go="course"><span>▦</span><b>Курс</b><small>10 этапов · 115 уроков</small></button>
      <button class="tile" data-go="practice"><span>◎</span><b>Практика</b><small>Ноты · слух · аккорды · тюнер</small></button>
      <button class="tile" data-go="songs"><span>♪</span><b>Песни</b><small>${SONGS.length} проекта + MIDI</small></button>
    </div>
  `;
  $('#homeMic').onclick=startMic;
  $('#homeStart').onclick=()=>openLesson(done<COURSE_SIZE?(done?effectiveNext:1):COURSE_SIZE);
  $('#continueCard').onclick=()=>openLesson(effectiveNext);
  $('#openAchievements').onclick=renderAchievements;
  $('#openCalendarInline').onclick=renderCalendar;
  $('#smartReview')?.addEventListener('click',()=>{practiceState.tab='weak';go('practice')});
  $$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  refreshMicPermissionLabel();
}
function renderCourse(){
  const next=nextLesson()||COURSE_SIZE;
  $('#course').innerHTML=`${header('Путь обучения','home','КУРС · 115 УРОКОВ')}
    <div class="courseIntro card"><div><b>Открываем путь по одному шагу</b><span>Закрытые уроки видны, чтобы ты видел весь маршрут, но начать их можно только после предыдущих.</span></div><div class="courseProgress"><b>${completedCount()} / ${COURSE_SIZE}</b><small>пройдено</small></div></div>
    <div class="moduleList">${MODULES.map(m=>{const done=Object.keys(state.completed).filter(n=>+n>=m.range[0]&&+n<=m.range[1]&&state.completed[n]).length;const current=next>=m.range[0]&&next<=m.range[1];return `<section class="module"><div class="moduleHead"><div class="moduleIcon">${m.icon}</div><div><div class="microLabel">${m.range[0]}–${m.range[1]}</div><h2>${escapeHtml(m.name)}</h2><p>${escapeHtml(m.desc)}</p></div><span class="moduleCount">${done}/${m.range[1]-m.range[0]+1}</span></div><div class="lessonList">${Array.from({length:m.range[1]-m.range[0]+1},(_,j)=>{const n=m.range[0]+j,completed=!!state.completed[n],isNext=n===next,locked=n>firstLockedLesson();return `<button class="lessonRow ${completed?'done':''} ${isNext?'current':''} ${locked?'locked':''}" ${locked?'disabled':''} ${locked?'':`data-lesson="${n}"`}> <span class="lessonNum">${completed?'✓':locked?'🔒':n}</span><span class="lessonBody"><small>${lessonKind(n)}</small><b>${escapeHtml(LESSON_TITLES[n-1])}</b>${locked?'<em>Сначала пройди предыдущие уроки</em>':''}</span><span class="lessonXP">+${xpFor(n)}</span><span class="rowArrow">${locked?'': '›'}</span></button>`}).join('')}</div></section>`}).join('')}</div>`;
  bindBack();
  $$('[data-lesson]').forEach(b=>b.onclick=()=>openLesson(+b.dataset.lesson));
}
function lessonKind(n){if(n===1)return'Введение';if(n<=10)return'Клавиатура';if(n<=20)return'Ритм';if(n<=35)return'Чтение';if(n<=45)return'Интервалы';if(n<=60)return'Аккорды';if(n<=72)return'Гаммы';if(n<=82)return'Техника';if(n<=92)return'Две руки';if(n<=100)return'Музыкальность';return'Песенный проект'}

function buildLesson(n){
  const base={n,title:LESSON_TITLES[n-1],module:moduleFor(n),type:'note',objective:'',theory:'',tip:'',steps:[],meter:null,hand:null,dynamic:null};
  if(n===1){return {...base,type:'setup',objective:'Подготовить инструмент и сыграть первую ноту.',theory:'На этом курсе телефон не является клавиатурой. Он слушает ваш настоящий синтезатор через микрофон.',tip:'Сначала подключи микрофон. Затем сыграй ДО в средней октаве.',steps:[60],setup:true}}
  if(n<=10){
    const idx=n-2;
    const texts=[
      ['Научиться отличать группу из двух чёрных клавиш.','Чёрные клавиши повторяют один рисунок. Две соседние чёрные помогают быстро находить ДО слева от них.','Не ищи ДО по всей клавиатуре — сначала найди две чёрные.'],
      ['Связать ДО, РЕ и МИ с реальной клавишей.','Начни с трёх нот вокруг ДО. Ты уже видишь цель на клавиатуре и на стане.','Сначала назови ноту про себя, потом играй.'],
      ['Познакомиться с пятью пальцами правой руки.','Пальцы 1–5 образуют удобную позицию ДО–СОЛЬ.','Кисть остаётся свободной, пальцы не вытягивай.'],
      ['Потренировать переход без рывка.','Переход начинается не со скорости, а с мягкого переноса веса кисти.','Сделай движение медленнее, чем кажется нужным.'],
      ['Поставить правую руку в устойчивую позицию.','Правая рука чаще ведёт мелодию. Важно сразу чувствовать ориентир ДО–СОЛЬ.','Большой палец — 1.'],
      ['Поставить левую руку в устойчивую позицию.','Левая рука отвечает за бас и сопровождение. Начинаем с той же пятинотной позиции.','Мизинец левой — 5.'],
      ['Научиться находить ориентиры на всей клавиатуре.','ДО, ФА и СОЛЬ встречаются снова и снова. Глаз должен быстро узнавать рисунок.','Смотри на рисунок чёрных клавиш, а не на каждую клавишу отдельно.'],
      ['Играть пять нот вверх и вниз ровно.','Теперь движение идёт в обе стороны, без остановки после третьей ноты.','Одинаковый темп вверх и вниз.'],
      ['Соединить всё в первую маленькую мелодию.','Мелодия — это не просто список нот. Она должна звучать как одна короткая мысль.','Сначала медленно, потом один чистый повтор.']
    ][idx];
    const seq=START_SEQUENCES[idx] || [60,62,64,65,67,65,64,62];
    return {...base,type:'note',objective:texts[0],theory:texts[1],tip:texts[2],steps:seq,hand:idx===4?'R':idx===5?'L':'B'};
  }
  if(n<=20){
    const i=n-11, count=RHYTHM_COUNTS[i];
    const rhythmTitles=[
      'Чувствовать ровный пульс.','Научиться считать четыре доли.','Понять разницу длительностей.','Добавить тишину как часть ритма.','Играть ровно на одной ноте.','Чередовать короткий и длинный звук.','Слышать первую долю такта.','Попасть в простой метроном.','Удержать рисунок без смены нот.','Соединить ритм и мелодию.'
    ];
    return {...base,type:'rhythm',objective:rhythmTitles[i],theory:'Ритм — это порядок во времени. Здесь ноты специально простые, чтобы внимание было только на пульсе.',tip:i===3?'Пауза не пропускается: её нужно считать.':i===7?'Начни с 60 BPM. Ускорение будет позже.':'Сначала услышь пульс, потом попадай в него.',steps:Array.from({length:RHYTHM_PATTERNS[i].length},()=>60),pattern:RHYTHM_PATTERNS[i],meter:{bpm:60+Math.floor(i/2)*5}};
  }
  if(n<=35){
    const i=n-21, seq=READING_SEQUENCES[i%READING_SEQUENCES.length];
    const lessons=[
      ['Понять, что нотный стан показывает высоту.','Нота выше на стане — звук выше. Сегодня связываем картинку с реальной клавишей.'],
      ['Найти СОЛЬ в скрипичном ключе.','Скрипичный ключ закручивается вокруг линии СОЛЬ. Это главный ориентир правой руки.'],
      ['Найти ФА в басовом ключе.','Басовый ключ отмечает линию ФА. Она помогает ориентироваться в нижнем регистре.'],
      ['Связать среднее ДО с обоими ключами.','Среднее ДО соединяет правую и левую части нотной системы.'],
      ['Узнавать МИ на стане.','МИ в скрипичном ключе стоит на первой линии снизу.'],
      ['Узнавать СОЛЬ на стане.','СОЛЬ — вторая линия снизу скрипичного ключа.'],
      ['Узнавать ФА и ЛЯ в басу.','Эти ноты становятся первыми стабильными точками в басовом ключе.'],
      ['Читать направление движения.','Не нужно мгновенно вспоминать название каждой ноты — сначала научись видеть шаг вверх и вниз.'],
      ['Играть соседние ноты как шаг.','Соседняя позиция на стане обычно означает движение на одну ступень.'],
      ['Играть через одну ноту.','Расстояние через одну ступень выглядит шире и требует другого движения пальца.'],
      ['Читать четыре ноты подряд.','Теперь внимание должно прыгать от символа к символу, не возвращаясь к предыдущему.'],
      ['Не путать линию и промежуток.','Глаз должен узнавать положение ноты как целое, а не разбирать его по пикселям.'],
      ['Читать маленькую фразу целиком.','Сначала посмотри на направление и только потом начинай играть.'],
      ['Прочитать мелодию правой рукой.','Правая рука читает, а микрофон подтверждает каждый звук.'],
      ['Прочитать мелодию левой рукой.','Левая рука использует те же принципы, но в другом регистре.']
    ][i];
    return {...base,type:'reading',objective:lessons[0],theory:lessons[1],tip:'Смотри на следующую ноту заранее. Не жди, пока текущая исчезнет.',steps:seq,staff:i<7?'both':'treble',hand:i===13?'R':i===14?'L':'B'};
  }
  if(n<=45){
    const i=n-36,p=INTERVAL_STEPS[i%INTERVAL_STEPS.length];
    const titles=[
      ['Понять расстояние между нотами.','Интервал — это не название аккорда, а расстояние между двумя звуками.'],['Один шаг: секунда.','Соседние ступени звучат близко и требуют маленького движения.'],['Терция: через одну.','Терция пропускает одну ступень между началом и концом.'],['Кварта: расширяем движение.','Более широкий интервал требует уверенного ориентира, а не большой растяжки.'],['Квинта: сильный ориентир.','Квинта хорошо запоминается по ощущению расстояния.'],['Менять направление.','Один и тот же интервал можно сыграть вверх или вниз.'],['Отличать повтор от движения.','Одинаковая нота — это отсутствие движения, а не маленький интервал.'],['Переносить тот же рисунок выше.','Музыкальный рисунок можно повторять на другом уровне.'],['Слушать вопрос и ответ.','Первая фраза просит продолжения, вторая отвечает.'],['Собрать маленький этюд.','Смешиваем несколько интервалов в одной короткой последовательности.']
    ][i];
    return {...base,type:'interval',objective:titles[0],theory:titles[1],tip:'Сначала сыграй нижнюю ноту, потом верхнюю — приложение подскажет, совпало ли расстояние.',pairs:Array.from({length:i<5?3:4},()=>p)};
  }
  if(n<=60){
    const i=n-46;
    const commonTip='Сыграй три звука в одной попытке. Если клавиши не звучат одновременно, сыграй их очень быстро по очереди.';
    if(i===12){
      const earRounds=[{root:'до',type:'major'},{root:'ля',type:'minor'},{root:'фа',type:'major'},{root:'ре',type:'minor'},{root:'соль',type:'major'}];
      return {...base,type:'chordEar',objective:'Различать мажор и минор на слух.',theory:'Сначала послушай два типа трезвучий. Не ищи ответ глазами — здесь тренируем именно слух.',tip:'Нажми «Послушать» и выбери мажор или минор. После ответа прозвучит новый аккорд.',earRounds};
    }
    const plans=[
      ['Понять, что такое аккорд.','Аккорд — несколько нот, звучащих вместе. В нашем курсе начинаем с простых трезвучий.'],
      ['Увидеть трезвучие как форму.','Трезвучие состоит из основы, третьей и пятой ступени. На клавиатуре это конкретная форма.'],
      ['Сыграть ДО мажор.','До–ми–соль — первый аккорд, который стоит запомнить руками, а не только глазами.'],
      ['Сыграть ЛЯ минор.','Ля–до–ми звучит мягче, но строится по тому же принципу.'],
      ['Сыграть ФА мажор.','Фа–ля–до добавляет новую позицию, сохраняя знакомую форму.'],
      ['Сыграть СОЛЬ мажор.','Соль–си–ре вводит новый ориентир и движение руки.'],
      ['Сыграть МИ минор.','Ми–соль–си соединяет уже знакомые ноты новой формой.'],
      ['Сыграть РЕ минор.','Ре–фа–ля закрепляет минорное трезвучие.'],
      ['Переходить ДО → СОЛЬ.','Теперь важен не отдельный аккорд, а спокойная смена формы.'],
      ['Переходить ДО → ФА.','Учим руку менять положение заранее, не прыгая в последний момент.'],
      ['Переходить ДО → ЛЯ минор.','Новая смена становится частью уже знакомого движения.'],
      ['Чередовать четыре аккорда по кругу.','Последовательность превращает отдельные аккорды в настоящее сопровождение.'],
      ['Различать мажор и минор на слух.','Слух должен уметь услышать характер трезвучия без подсказки названия.'],
      ['Играть аккорд в устойчивом пульсе.','Теперь важны и форма, и время: каждый аккорд начинается вместе с пульсом.'],
      ['Положить мелодию поверх аккорда.','Гармония и мелодия должны существовать одновременно, а не мешать друг другу.']
    ];
    const [,theory]=plans[i];
    if(i===13){
      const rounds=[{root:'до',type:'major'},{root:'соль',type:'major'},{root:'фа',type:'major'},{root:'ля',type:'minor'},{root:'до',type:'major'}];
      return {...base,type:'chord',objective:plans[i][0],theory,tip:'Сначала дождись доли и сыграй весь аккорд. Ошибка по времени не двигает урок.',chordRounds:rounds.map(x=>({...x,midi:chord(x.root,x.type)})),rounds:rounds.length,chordRhythm:true,meter:{bpm:64}};
    }
    if(i===14){
      return {...base,type:'hands',objective:plans[i][0],theory,tip:'Левая рука держит простой аккорд, правая — короткую мелодию. В этом уроке важнее баланс ролей, чем скорость.',steps:[60,64,67,64,72,69,67,64],hand:'B',combo:true};
    }
    const roundSets={
      0:[{root:'до',type:'major'},{root:'ля',type:'minor'},{root:'соль',type:'major'},{root:'фа',type:'major'},{root:'ре',type:'minor'}],
      1:[{root:'до',type:'major'},{root:'до',type:'minor'},{root:'до',type:'sus4'},{root:'соль',type:'major'},{root:'ре',type:'minor'}],
      2:[{root:'до',type:'major'} ,{root:'до',type:'major'},{root:'до',type:'major'},{root:'до',type:'major'},{root:'до',type:'major'}],
      3:[{root:'ля',type:'minor'} ,{root:'ля',type:'minor'},{root:'ля',type:'minor'},{root:'ля',type:'minor'},{root:'ля',type:'minor'}],
      4:[{root:'фа',type:'major'} ,{root:'фа',type:'major'},{root:'фа',type:'major'},{root:'фа',type:'major'},{root:'фа',type:'major'}],
      5:[{root:'соль',type:'major'} ,{root:'соль',type:'major'},{root:'соль',type:'major'},{root:'соль',type:'major'},{root:'соль',type:'major'}],
      6:[{root:'ми',type:'minor'} ,{root:'ми',type:'minor'},{root:'ми',type:'minor'},{root:'ми',type:'minor'},{root:'ми',type:'minor'}],
      7:[{root:'ре',type:'minor'} ,{root:'ре',type:'minor'},{root:'ре',type:'minor'},{root:'ре',type:'minor'},{root:'ре',type:'minor'}],
      8:[{root:'до',type:'major'},{root:'соль',type:'major'},{root:'до',type:'major'},{root:'соль',type:'major'},{root:'до',type:'major'}],
      9:[{root:'до',type:'major'},{root:'фа',type:'major'},{root:'до',type:'major'},{root:'фа',type:'major'},{root:'до',type:'major'}],
      10:[{root:'до',type:'major'},{root:'ля',type:'minor'},{root:'до',type:'major'},{root:'ля',type:'minor'},{root:'до',type:'major'}],
      11:[{root:'до',type:'major'},{root:'соль',type:'major'},{root:'ля',type:'minor'},{root:'фа',type:'major'},{root:'до',type:'major'}]
    }[i] || CHORD_LIBRARY.slice(0,5);
    return {...base,type:'chord',objective:plans[i][0],theory,tip:commonTip,chordRounds:roundSets.map(x=>({...x,midi:chord(x.root,x.type)})),rounds:roundSets.length};
  }
  if(n<=72){
    const i=n-61;const scaleNames=Object.keys(SCALE_LIBRARY);const name=scaleNames[i<4?i: i%4];const seq=SCALE_LIBRARY[name];
    const titles=[
      ['Сыграть гамму ДО мажор.','Начинаем с самого простого варианта: все клавиши здесь белые.'],
      ['Сыграть гамму ЛЯ минор.','Ля минор использует знакомые белые клавиши и помогает слышать другой центр.'],
      ['Познакомиться с СОЛЬ мажор.','Одна чёрная клавиша меняет картину и требует внимания.'],
      ['Познакомиться с ФА мажор.','Теперь закрепляем одну чёрную клавишу другого места.'],
      ['Научиться играть гамму нужными пальцами.','Пальцы получают номера. Большой палец — 1, указательный — 2, средний — 3, безымянный — 4, мизинец — 5. Номера помогают повторять одно и то же движение без путаницы.'],
      ['Научиться играть гамму левой рукой.','Та же система номеров работает и слева. Важно не запоминать движение наугад, а заранее знать, каким пальцем начинается и продолжается последовательность.'],
      ['Сделать переход большого пальца.','Переход должен ощущаться как одно движение, а не как прыжок.'],
      ['Пройти гамму вверх.','Сначала равномерность, затем скорость.'],
      ['Пройти гамму вниз.','Спуск часто сложнее подъёма — не ускоряй последние ноты.'],
      ['Соединить вверх и вниз.','Гамма превращается в одно непрерывное движение.'],
      ['Разложить трезвучие как арпеджио.','Ноты аккорда звучат по одной, но форма остаётся общей.'],
      ['Использовать гамму как разминку.','Короткая чистая серия полезнее длинной быстрой серии.']
    ][i];
    const chosen=i<4?name:scaleNames[i%4];
    const steps=i===10?[60,64,67,72,67,64,60]:i===11?[60,62,64,65,67,65,64,62,60]:SCALE_LIBRARY[chosen];
    return {...base,type:'scale',objective:titles[0],theory:titles[1],tip:'Играй ровно, как по ступенькам. Если большой палец мешает — снизь темп.',steps,scaleName:chosen,hand:i%2===0?'R':'L'};
  }
  if(n<=82){
    const i=n-73;
    const sets=[
      [60,62,64,65],[60,64,62,65,64,60],[60,62,64,65,67,65,64,62],[60,64,67,64,60],[60,62,60,64,60,65],[60,62,64,62,60],[60,60,62,62,64,64],[60,64,62,65,64,60],[60,62,64,65,64,62,60],[60,64,67,65,64,62,60]
    ];
    const desc=[
      ['Играть пальцами независимо.','Каждый палец должен попадать в свою клавишу без помощи лишнего движения кисти.'],
      ['Сохранить ровность в четырёх звуках.','Ровность важнее скорости.'],
      ['Сделать чистоту главным приоритетом.','Темп не засчитывается, если появляются случайные звуки.'],
      ['Использовать метроном как опору.','Сначала медленно, затем увеличиваем темп маленькими шагами.'],
      ['Контролировать силу удара.','Одинаковая точность нужна и при мягком, и при обычном звуке.'],
      ['Играть легато.','Соседние ноты должны ощущаться связанными.'],
      ['Играть стаккато.','Звук короткий, но движение остаётся расслабленным.'],
      ['Делать аккуратный акцент.','Акцент — это выделение одной ноты, а не сильный удар всей рукой.'],
      ['Сравнить три уровня звука.','Сначала мягко, потом обычно, потом чуть ярче.'],
      ['Собрать техническую связку.','Смешиваем смену направления, ровность и короткий рисунок.']
    ][i];
    return {...base,type:'technique',objective:desc[0],theory:desc[1],tip:'Остановись, если движение стало жёстким. Правильная техника не требует борьбы.',steps:sets[i],hand:i%2?'L':'R',dynamic:i===4||i===8?['soft','normal','strong']:null};
  }
  if(n<=92){
    const i=n-83;const sets=[
      [48,55,52,55],[48,55,48,55],[48,55,60,55,52,55],[60,64,67,64,48,55],[64,67,69,67,48,55],[60,64,67,64,60,55],[64,67,69,67,64,60],[48,55,48,55,50,57],[48,55,48,55,50,57,52,59],[60,62,64,67,65,64,62,60]
    ];
    const desc=[
      ['Дать левой руке роль баса.','Нижняя нота создаёт опору, но не должна заглушать мелодию.'],
      ['Соединить бас и аккорд.','Левая рука меняет две позиции в одном устойчивом рисунке.'],
      ['Освоить простой вальсовый рисунок.','Тяжёлая первая доля, затем два лёгких ответа.'],
      ['Сыграть мелодию правой и бас левой.','Руки выполняют разные роли, поэтому каждая сначала должна быть понятна отдельно.'],
      ['Сыграть мелодию правой и аккорд левой.','Левая рука теперь держит гармонию, правая — внимание слушателя.'],
      ['Не ускоряться при смене рук.','Мозг должен сохранять один общий пульс.'],
      ['Сбалансировать две руки.','Обе руки важны, но не одинаково громкие.'],
      ['Удерживать остинато слева.','Повторяющийся рисунок освобождает внимание для мелодии.'],
      ['Держать повторяющийся рисунок ровным.','Остинато работает только тогда, когда не разваливается.'],
      ['Собрать восьмитактовую фразу.','Теперь маленькие навыки превращаются в музыкальный блок.']
    ][i];
    return {...base,type:'hands',objective:desc[0],theory:desc[1],tip:'Сначала сыграй левую идею отдельно, затем правую. Только потом соединяй.',steps:sets[i],hand:'B'};
  }
  if(n<=100){
    const i=n-93;const sets=[[60,62,64,67,65,64,62,60],[60,62,64,65,67,65,64,62],[67,65,64,62,60,62,64,65],[60,64,67,72,67,64,60],[60,62,64,67,65,64,62,60],[60,64,67,64,60,62,65,62],[60,62,60,64,60,65,60,67],[60,62,64,60,67,65,64,62],[60,64,62,65,64,60]];
    const desc=[
      ['Слышать фразу целиком.','Музыкальная фраза похожа на предложение: у неё есть направление и точка завершения.'],
      ['Выбирать естественное окончание.','Последняя нота фразы не обязана быть самой громкой.'],
      ['Делать середину тише.','Контраст внутри фразы создаёт ощущение движения.'],
      ['Делать вершину заметной.','Кульминация может быть чуть громче или выше.'],
      ['Понять, зачем нужна педаль.','Педаль соединяет звуки, но пользоваться ею нужно по смыслу.'],
      ['Менять педаль чисто.','Старая гармония должна исчезнуть до того, как появится следующая.'],
      ['Услышать синкопу.','Нота иногда приходит между привычными долями.'],
      ['Понять триоли.','Один пульс можно разделить на три равные части.']
    ][i];
    const musicalFocus=['phrase','phrase','dynamic','dynamic','pedal','pedal','syncopation','triplet'];return {...base,type:'musical',objective:desc[0],theory:desc[1],tip:'Эта часть курса тренирует не только правильную ноту, но и осознанное повторение.',steps:sets[i],musicalFocus:musicalFocus[i]};
  }
  const song=n===115?(SONGS.find(s=>s.id==='pirates')||SONGS[0]):SONGS[(n-101)%SONGS.length];
  const phase=n-101;
  const goals=[
    ['Освоить 15-минутную схему тренировки.','Разделяем время на разбор, медленную практику и чистый повтор, чтобы не играть хаотично.'],
    ['Разбирать песню маленькими кусочками.','Сложную песню проще собрать из коротких участков и соединить их позже.'],
    ['Понять формат песенного урока.','Цель показывается крупно, затем приложение ждёт именно твой звук.'],
    ['Узнать первую ноту проекта.','Имя ноты всегда написано крупно — не нужно угадывать по картинке.'],
    ['Сыграть первую мини-фразу правой рукой.','Начинаем с короткого фрагмента, а не со всей песни сразу.'],
    ['Добавить вторую мини-фразу.','Следующий кусочек открывается только после правильного предыдущего.'],
    ['Проверить левую руку отдельно.','Сначала убрать сложность и услышать сопровождение самостоятельно.'],
    ['Соединить два фрагмента.','Смена между кусочками — отдельный навык.'],
    ['Сыграть четыре ноты без спешки.','Уменьшаем скорость и добиваемся чистоты.'],
    ['Добавить ровный пульс.','Теперь ноты идут внутри времени, а не свободно.'],
    ['Убрать одну визуальную подсказку.','Начинаем больше смотреть на нотный стан и меньше — на подсвеченную клавишу.'],
    ['Сыграть связку целиком.','Несколько маленьких успехов складываются в одну фразу.'],
    ['Свести аккорд и мелодию.','Одна рука поддерживает гармонию, другая ведёт мелодию.'],
    ['Сделать пробный прогон.','Сыграй без остановки и запомни, где было сложнее всего.'],
    ['Завершить курс своей песней.','Выбери проект в библиотеке и пройди его учебный фрагмент до конца.']
  ][phase];
  const phasePlan=[
    {kind:'timer',seq:[60,62,64]}, {kind:'fragment',seq:song.fragment.slice(0,4)}, {kind:'choose',seq:[60,62,64,67]},
    {kind:'first',seq:song.fragment.slice(0,1)}, {kind:'right',seq:song.fragment.slice(0,4),hand:'R'}, {kind:'right',seq:song.fragment.slice(2,7),hand:'R'},
    {kind:'left',seq:[48,55,52,55],hand:'L'}, {kind:'join',seq:song.fragment.slice(0,6),hand:'B'}, {kind:'slow',seq:song.fragment.slice(0,4),hand:'B'},
    {kind:'rhythm',seq:song.fragment.slice(0,6),pattern:RHYTHM_PATTERNS[1],hand:'B'}, {kind:'reading',seq:song.fragment.slice(0,5),hand:'R'}, {kind:'chain',seq:song.fragment.slice(0,8),hand:'B'},
    {kind:'chord',seq:[60,64,67],hand:'B'}, {kind:'run',seq:song.fragment.concat([60,64]),hand:'B'}, {kind:'final',seq:song.fragment.concat(song.fragment.slice().reverse().slice(0,6)),hand:'B'}
  ][phase];
  return {...base,type:'song',objective:goals[0],theory:goals[1],tip:'Здесь не нужно угадывать. Сначала приложение объясняет задачу, затем показывает одну конкретную цель и ждёт твою игру.',steps:phasePlan.seq,songId:song.id,songPhase:phase,songKind:phasePlan.kind,pattern:phasePlan.pattern||null,hand:phasePlan.hand||'B'};
}
function lessonKindType(t){return t==='setup'?'Старт':t==='rhythm'?'Ритм':t==='reading'?'Чтение':t==='interval'?'Интервалы':t==='chord'?'Аккорды':t==='chordEar'?'Слух':t==='scale'?'Гаммы':t==='technique'?'Техника':t==='hands'?'Две руки':t==='musical'?'Музыкальность':t==='song'?'Песня':'Ноты'}

function openLesson(n){if(!canOpenLesson(n)){toast(`Сначала пройди урок ${firstLockedLesson()}`,'bad');return}runtime={...buildLesson(n),step:0,errors:0,passed:false,sequenceDone:false,chordRound:0,earRound:0,earAnswered:false,intervalPhase:0,intervalPair:null,heardChord:[],dynamicBaseline:null,dynamicStage:0,focusChoice:null,rhythmStart:null,chordBeatStart:null};go('lesson')}

function lessonPrereq(n){
  if(n<=10)return 'Ничего заранее знать не нужно — начинаем с самого нуля.';
  if(n<=20)return 'Ты уже знаешь клавиши и первые мелодии. Теперь добавляем время.';
  if(n<=35)return 'Ты уже умеешь находить ноты на клавиатуре и держать простой пульс.';
  if(n<=45)return 'Ты уже читаешь базовые ноты. Теперь учимся видеть расстояние между ними.';
  if(n<=60)return 'Ты уже понимаешь отдельные ноты и расстояния. Теперь собираем их в гармонию.';
  if(n<=72)return 'Ты уже знаком с аккордами. Теперь учимся двигаться по клавиатуре по порядку нот.';
  if(n<=82)return 'Ты уже знаешь базовые движения. Теперь улучшаем точность, ровность и контроль.';
  if(n<=92)return 'Ты уже умеешь играть отдельной рукой. Теперь соединяем две разные роли.';
  if(n<=100)return 'Ты уже умеешь сыграть фразу двумя руками. Теперь добавляем музыкальное выражение.';
  return 'Все основные навыки уже собраны. Теперь переносим их на настоящую музыку.';
}
function theoryForDisplay(r){
  const bank={
    setup:{title:'С чего начинается курс',body:'Тебе не нужно знать ноты заранее. Мы будем идти от клавиатуры и одного звука к чтению, ритму, аккордам и игре двумя руками. В каждом уроке сначала появляется понятная цель, потом ты играешь её на настоящем инструменте.',plain:'Главный принцип: сначала понять, затем сыграть, затем закрепить.'},
    note:{title:'Нота — это имя конкретного звука',body:'У каждой клавиши есть название, например ДО, РЕ или МИ. Одинаковые названия повторяются на разных высотах, поэтому ДО может звучать низко или высоко, но это всё равно нота ДО. В ранних упражнениях мы тренируем именно узнавание имени и положения клавиши.',plain:'Представь клавиатуру как дорогу: название ноты — это адрес, а клавиша — место, куда нужно прийти.'},
    rhythm:{title:'Ритм — это когда происходит звук',body:'Ритм отвечает не на вопрос «какую ноту сыграть?», а на вопрос «когда её сыграть и сколько держать?». Пульс можно представить как равномерные шаги. Длительность и пауза складываются в рисунок, который делает музыку узнаваемой.',plain:'Сначала счёт, потом ноты. Ошибка во времени — это тоже ошибка.'},
    reading:{title:'Нотный стан — карта высоты звука',body:'Пять линий и четыре промежутка показывают, насколько высоко или низко находится нота. Скрипичный и басовый ключи задают разные ориентиры. Тебе не нужно запомнить весь стан сразу: мы закрепляем несколько опорных нот и постепенно расширяем диапазон.',plain:'Смотри на место ноты целиком: линия или промежуток + ключ + направление движения.'},
    interval:{title:'Интервал — расстояние между двумя нотами',body:'Интервал показывает, насколько далеко друг от друга находятся два звука. ДО–РЕ — маленькое движение на соседнюю ступень, ДО–МИ — более широкий прыжок, ДО–СОЛЬ — ещё шире. Это помогает читать мелодию не по одной ноте, а видеть её движение целиком.',plain:'Представь лестницу: интервал — это количество ступеней между двумя точками.'},
    chord:{title:'Аккорд — несколько нот одновременно',body:'Когда несколько звуков звучат вместе, мы получаем аккорд. В простом трезвучии три звука образуют одну гармоническую форму. Мажор и минор используют похожую конструкцию, но между нотами меняется расстояние, поэтому характер звучания становится другим.',plain:'Не учи аккорд только названием: запомни его форму на клавиатуре и то, как он звучит.'},
    scale:{title:'Гамма — последовательность нот по порядку',body:'Гамма — это не отдельная мелодия, а набор нот, расположенных последовательно вверх или вниз. Она помогает понять тональность, привыкнуть к расстояниям и научиться правильно переносить большой палец. Поэтому в этом разделе мы сначала учим порядок нот, а уже потом скорость.',plain:'Гамма похожа на подъём по ступенькам: идём по порядку и не перескакиваем ступени случайно.'},
    technique:{title:'Техника — контроль, а не скорость',body:'Техническое упражнение нужно не для того, чтобы нажимать клавиши как можно быстрее. Мы тренируем ровность, точность, расслабление и одинаковый контроль на разных уровнях громкости. Скорость появляется позже, когда движение уже стало устойчивым.',plain:'Чисто и спокойно всегда полезнее, чем быстро и напряжённо.'},
    hands:{title:'Две руки — две роли',body:'Когда играют две руки, они не обязаны делать одно и то же. Одна может вести мелодию, другая — давать бас или аккорды. Сначала каждая часть становится понятной отдельно, затем мозг учится удерживать их одновременно внутри одного пульса.',plain:'Не пытайся выучить две руки сразу: сначала пойми роль каждой, потом соединяй.'},
    musical:{title:'Музыкальность начинается после правильных нот',body:'Правильные ноты — только основа. Дальше появляется фразировка, громкость, педаль, акценты и ощущение направления. В этом разделе ты учишься не просто попадать в клавиши, а специально решать, как должна звучать музыкальная мысль.',plain:'Хорошая игра — это не только «правильно», но и «зачем именно так».'},
    song:{title:'Песня разбирается не целиком, а слоями',body:'Большой фрагмент сначала делится на короткие кусочки. Ты узнаёшь ноту, играешь её, соединяешь несколько нот, затем добавляешь вторую руку и ритм. Подсказки постепенно можно убирать, чтобы в конце память и чтение работали самостоятельно.',plain:'Сначала маленький кусочек без спешки, потом следующий, потом соединение.'}
  };
  const k=r.type;const d=bank[k]||bank.note;return {...d,prereq:lessonPrereq(r.n)};
}

function lessonGlossary(r){
  const t=r.title.toLowerCase();
  if(t.includes('аппликат')||t.includes('каким пальцем')||r.type==='scale')return {term:'Аппликатура',text:'Это просто номера пальцев: 1 — большой, 2 — указательный, 3 — средний, 4 — безымянный, 5 — мизинец. Она нужна, чтобы одно и то же движение каждый раз получалось одинаковым.'};
  if(t.includes('остинато')||t.includes('повторяющийся рисунок'))return {term:'Повторяющийся рисунок',text:'Это короткий музыкальный узор, который левая или правая рука повторяет много раз. Пока одна рука держит этот узор, другой легче играть мелодию.'};
  if(t.includes('синкоп')||t.includes('между дол'))return {term:'Синкопа',text:'Это момент, когда важная нота звучит не на привычной сильной доле, а между долями. Поэтому сначала полезно считать ровный пульс, а уже потом добавлять такой рисунок.'};
  if(t.includes('триол'))return {term:'Триоль',text:'Вместо двух равных частей внутри пульса мы делаем три. Их нужно чувствовать как три одинаковых шага: раз-и-а, два-и-а.'};
  if(t.includes('легато')||t.includes('связно'))return {term:'Легато',text:'Ноты соединяются плавно, без лишнего промежутка между звуками. Палец меняется так, чтобы предыдущая нота не обрывалась слишком рано.'};
  if(t.includes('стаккато')||t.includes('отрыв'))return {term:'Стаккато',text:'Каждая нота короткая и отделённая от следующей. Это не означает бить сильнее — главное быстро отпустить клавишу.'};
  if(t.includes('педал'))return {term:'Педаль',text:'Правая педаль удерживает звучание после отпускания клавиш и помогает соединять гармонию. Менять её нужно вместе со сменой аккорда, иначе звук становится мутным.'};
  if(r.type==='interval')return {term:'Интервал',text:'Это расстояние между двумя звуками. Чтобы его понять, можно посчитать ступени между началом и концом: соседние ступени образуют маленькое расстояние, более далёкие — большой скачок.'};
  if(r.type==='chord'||r.type==='chordEar')return {term:'Трезвучие',text:'Три звука образуют простейший аккорд. Например, ДО–МИ–СОЛЬ — три ноты, которые вместе дают одно целое звучание.'};
  if(r.type==='rhythm')return {term:'Пульс',text:'Ровное внутреннее «тик-тик-тик», на которое накладываются все ноты и паузы. Пока пульс устойчив, ритм становится намного понятнее.'};
  return {term:'Главная идея',text:'Не нужно запомнить всё за один раз. Свяжи новое слово с конкретным движением на клавиатуре и сразу сыграй его на своём инструменте.'};
}

function renderLesson(){
  const r=runtime;if(!r)return;
  const total=r.type==='chord'?r.rounds:r.type==='chordEar'?r.earRounds.length:r.type==='interval'?r.pairs.length*2:r.type==='song'&&['timer','choose','chord'].includes(r.songKind)?1:r.steps.length;
  const progress=r.type==='interval' ? Math.min(r.step,total) : r.type==='chordEar' ? Math.min(r.earRound,total) : r.step;
  const module=r.module;
  $('#lesson').innerHTML=`
    <div class="lessonHeader">
      <button class="backBtn" data-back="course">‹</button>
      <div class="lessonHeadText"><div class="microLabel">УРОК ${r.n} · ${escapeHtml(lessonKindType(r.type))}</div><div class="miniProgress"><i style="width:${Math.max(0,Math.min(100,(progress/Math.max(total,1))*100))}%"></i></div><small>${Math.min(progress+1,total)} из ${total}</small></div>
      <button class="iconAction" id="lessonSound" title="Послушать цель">🔊</button>
    </div>
    <div class="lessonTitleBlock"><div class="lessonIcon">${module.icon}</div><div><div class="eyebrow">${escapeHtml(module.name)}</div><h1>${escapeHtml(r.title)}</h1><p>${escapeHtml(r.objective)}</p></div></div>
    ${(()=>{const d=theoryForDisplay(r),g=lessonGlossary(r);return `<div class="theory card"><div class="sectionKicker">СНАЧАЛА ПОНЯТЬ</div><div class="theoryHeadline"><span>${escapeHtml(d.title)}</span><b>${escapeHtml(d.prereq)}</b></div><p>${escapeHtml(d.body)}</p><div class="plainExplain"><strong>Простыми словами</strong><span>${escapeHtml(d.plain)}</span></div><div class="rememberStrip"><span>🧠</span><div><b>Как это запомнить</b><small>Посмотри → назови вслух → сыграй → повтори без подсказки через несколько секунд.</small></div></div><div class="glossaryMini"><span>${escapeHtml(g.term)}</span><p>${escapeHtml(g.text)}</p></div><div class="callout"><b>Запомни</b><span>${escapeHtml(r.tip)}</span></div></div>`})()}
    ${r.type==='setup'?renderSetupTask(r):r.type==='rhythm'?renderRhythmTask(r):r.type==='interval'?renderIntervalTask(r):r.type==='chord'?renderChordTask(r):r.type==='chordEar'?renderChordEarTask(r):r.type==='musical'?renderMusicalTask(r):r.type==='song'?renderSongCourseTask(r):renderSequenceTask(r)}
    <div class="lessonFooter card"><div><b>Как пройти дальше</b><span>${lessonFooterText(r)}</span></div><div class="footerBtns"><button class="ghostBtn" id="repeatTheoryBtn">↻ Объяснение</button><button class="ghostBtn" id="restartLesson">↻ С начала</button></div></div>
  `;
  bindBack();
  $('#lessonSound').onclick=()=>playTarget(r);
  $('#repeatTheoryBtn').onclick=()=>showTheory(r);$('#restartLesson').onclick=()=>{r.step=0;r.errors=0;r.passed=false;r.sequenceDone=false;r.chordRound=0;r.intervalPhase=0;r.heardChord=[];r.dynamicStage=0;r.focusChoice=null;r.rhythmStart=null;r.chordBeatStart=null;r.earAnswered=false;renderLesson()};
  if(r.type==='setup')bindSetup(r); else if(r.type==='rhythm')bindRhythm(r); else if(r.type==='interval')bindInterval(r); else if(r.type==='chord')bindChord(r); else if(r.type==='chordEar')bindChordEar(r); else if(r.type==='musical')bindMusical(r); else if(r.type==='song')bindSongCourse(r); else bindSequence(r);
}
function lessonFooterText(r){if(r.type==='setup')return'Сначала подключи микрофон и сыграй одну ноту. Дальше курс всё покажет сам.';if(r.type==='song')return r.songKind==='chord'?'Сыграй аккорд как показано. Можно нажать ноты одновременно или очень быстро по очереди.':'Сейчас показывается только одна конкретная цель. После правильного звука откроется следующая.';if(r.type==='rhythm')return'Неверное попадание не двигает счётчик. Дождись следующего удара метронома.';if(r.type==='musical')return r.sequenceDone?'После игры выбери, что ты сознательно изменил в исполнении.':'Сначала сыграй фразу. Затем приложение попросит короткую музыкальную самопроверку.';if(r.type==='interval')return'Сначала сыграй первую ноту, потом вторую. Приложение ждёт обе части.';if(r.type==='chord')return r.chordRhythm?'Сыграй весь аккорд точно вместе с пульсом.':'Все три звука должны быть услышаны в одной попытке.';if(r.type==='chordEar')return'Сначала послушай аккорд, выбери мажор или минор и только потом переходи дальше.';return'Сейчас показывается только одна цель. После правильного звука откроется следующая.'}
function renderSetupTask(r){return `<div class="task card setupTask"><div class="taskTop"><div class="taskLabel">ПОДГОТОВКА</div><span class="taskTag">без спешки</span></div><div class="setupSteps"><div class="setupItem ${mic.stream?'done':''}"><span>1</span><div><b>Микрофон</b><small>${mic.stream?'Подключён':'Нужен доступ к микрофону'}</small></div></div><div class="setupItem"><span>2</span><div><b>Одна клавиша</b><small>Цель: ДО — можно сыграть в любой октаве</small></div></div></div>${!mic.stream?'<button class="primary full" id="setupMic">🎙 Подключить микрофон</button>':''}<div class="targetCard"><div class="targetMeta"><span>ПЕРВАЯ ЦЕЛЬ</span><b>сыграй ДО</b></div>${staffSvg([60],60,'treble')}${keyboardHtml(60)}</div><div id="lessonFeedback">${feedbackMarkup('wait','Жду звук','Сыграй ДО на своём синтезаторе.')}</div></div>`}
function renderSongCourseTask(r){
  const song=SONGS.find(s=>s.id===r.songId)||SONGS[0];
  if(r.songKind==='timer') return `<div class="task card"><div class="taskTop"><div class="taskLabel">ПРАКТИКА ПЕСНИ</div><span class="taskTag">3 мини-шага</span></div><div class="focusCard"><div class="focusIcon">⏱</div><div><b>Схема на 13 минуты</b><p>5 мин — новые места · 5 мин — медленно · 5 мин — чистый прогон.</p></div></div><div class="miniCheckList"><button class="checkStep" data-selfstep="0">○ Новые места</button><button class="checkStep" data-selfstep="1">○ Медленно</button><button class="checkStep" data-selfstep="2">○ Чистый прогон</button></div><button class="primary full" id="songPlanDone">Готово → к следующей задаче</button></div>`;
  if(r.songKind==='choose'){
    const target=r.steps[0];
    return `<div class="task card"><div class="taskTop"><div class="taskLabel">УЗНАЙ НОТУ</div><span class="taskTag">выбор</span></div><div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div>${staffSvg([target],target,guessClef(target))}<div class="targetHint">Какая клавиша соответствует цели?</div><div class="choiceGrid">${[target,(target+2)%12+60,(target+4)%12+60].map((m,i)=>`<button class="choiceBtn" data-choice="${m}">${noteName(m)}</button>`).join('')}</div></div><div id="lessonFeedback">${feedbackMarkup('wait','Выбери ответ','Сначала прочитай название ноты на карточке.')}</div></div>`;
  }
  if(r.songKind==='chord') return `<div class="task card"><div class="taskTop"><div class="taskLabel">МЕЛОДИЯ + АККОРД</div><span class="taskTag">${r.step+1} / ${r.steps.length}</span></div><div class="targetCard"><div class="targetName">До мажор</div><div class="targetMeta"><span>до · ми · соль</span><b>3 звука</b></div>${staffSvg([60,64,67],null,'treble')}${keyboardHtml(60,[60,64,67])}<div class="targetHint">Сыграй все три звука. Микрофон соберёт их за одну попытку.</div></div><div id="lessonFeedback">${feedbackMarkup('wait','Жду аккорд','Сначала сыграй до, ми и соль.')}</div></div>`;
  const target=r.steps[Math.min(r.step,r.steps.length-1)];
  const hideKeyboard=r.songKind==='reading';
  return `<div class="task card"><div class="taskTop"><div class="taskLabel">${r.songKind==='rhythm'?'ИГРА С ПУЛЬСОМ':r.songKind==='slow'?'МЕДЛЕННЫЙ ПРОГОН':r.songKind==='final'?'ФИНАЛЬНЫЙ ПРОГОН':'МИНИ-ФРАГМЕНТ'}</div><span class="taskTag">${Math.min(r.step+1,r.steps.length)} / ${r.steps.length}</span></div><div class="songFocus"><div class="songMiniArt">${song.icon}</div><div><b>${escapeHtml(song.title)}</b><span>${escapeHtml(song.difficulty)} · ${escapeHtml(r.objective)}</span></div></div><div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${noteText(target)}</span><b>${r.songKind==='left'?'Левая рука':r.songKind==='right'?'Правая рука':r.hand==='B'?'Обе руки':'Правая рука'}</b></div>${staffSvg([target],target,guessClef(target))}${hideKeyboard?'':keyboardHtml(target)}<div class="targetHint">${r.songKind==='reading'?'Смотри прежде всего на нотный стан.':'Сыграй именно эту ноту на настоящем синтезаторе.'}</div></div><div id="lessonFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteName(target)}.`)}</div>${r.errors>=2?`<div class="hintBox"><b>Подсказка</b><span>Сейчас нужна ${escapeHtml(noteName(target))}. Посмотри на название и на подсвеченную клавишу.</span></div>`:''}</div>`;
}

function renderSequenceTask(r){const target=r.steps[Math.min(r.step,r.steps.length-1)];const derivedHand=(r.hand&&r.hand!=='B')?r.hand:(r.type==='hands'?(target<60?'L':'R'):'B');const handText=HAND_LABELS[derivedHand];const dynamicText=r.dynamic?({'soft':'мягко','normal':'обычно','strong':'чуть ярче'}[r.dynamic[r.dynamicStage]||'normal']):'';return `<div class="task card"><div class="taskTop"><div class="taskLabel">${r.type==='hands'?'СОЕДИНЯЕМ РУКИ':r.type==='technique'?'ТЕХНИКА':'СЫГРАЙ СЕЙЧАС'}</div><span class="taskTag">${r.step+1} / ${r.steps.length}</span></div>${r.type==='technique'&&r.dynamic?`<div class="focusStrip"><span>Сила звука</span><b>${dynamicText}</b><small>После правильной ноты следующий этап изменится.</small></div>`:''}<div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${noteText(target)}</span><b>${escapeHtml(handText)}</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}<div class="targetHint">Нужна именно эта нота. Клавиатура ниже показывает точное место.</div></div><div id="lessonFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteName(target)}.`)}</div>${r.errors>=2?`<div class="hintBox"><b>Подсказка</b><span>Нужна нота ${escapeHtml(noteName(target))}. Снизь темп и сыграй ещё раз.</span></div>`:''}</div>`}
function renderMusicalTask(r){
  if(r.sequenceDone){const focus=r.musicalFocus||'музыкальность';const opts={phrase:['Я сделал конец фразы спокойнее','Я оставил фразу одинаковой'],dynamic:['Я изменил громкость внутри фразы','Я сыграл всё одинаково'],pedal:['Я менял педаль вместе с гармонией','Я держал педаль без смены'],syncopation:['Я специально считал слабую долю','Я просто играл на слух'],triplet:['Я разделил пульс на три','Я делил пульс пополам']}[focus]||['Я изменил что-то осознанно','Я ничего не менял'];return `<div class="task card"><div class="taskTop"><div class="taskLabel">САМОПРОВЕРКА</div><span class="taskTag">последний шаг</span></div><div class="selfCheck"><div class="selfIcon">◌</div><div><b>${escapeHtml(r.objective)}</b><p>Сыграй фразу ещё раз и отметь, что ты действительно контролировал.</p></div></div><div class="choiceGrid">${opts.map((x,i)=>`<button class="choiceBtn" data-musical-choice="${i}">${escapeHtml(x)}</button>`).join('')}</div><div id="lessonFeedback">${feedbackMarkup('wait','Выбери вариант','Здесь нет «правильного» ответа — важно осознать, что ты делал.')}</div></div>`}
  const target=r.steps[Math.min(r.step,r.steps.length-1)];const focus=r.musicalFocus||'phrase';const focusText={phrase:'Думай о начале и окончании музыкальной мысли.',dynamic:'Попробуй сделать середину тише, а вершину чуть заметнее.',pedal:'Меняй гармонию — педаль должна помогать, а не смешивать всё вместе.',syncopation:'Считай ровно и специально жди слабую долю.',triplet:'Представь три равные части внутри одного пульса.'}[focus]||'Играй осознанно и не спеши.';return `<div class="task card"><div class="taskTop"><div class="taskLabel">МУЗЫКАЛЬНЫЙ ФОКУС</div><span class="taskTag">${r.step+1} / ${r.steps.length}</span></div><div class="focusStrip"><span>${escapeHtml(focus)}</span><b>${escapeHtml(focusText)}</b></div><div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${noteText(target)}</span><b>Сначала сыграй фразу</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}<div class="targetHint">После всех нот появится короткая самопроверка музыкальности.</div></div><div id="lessonFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteName(target)}.`)}</div></div>`;
}

function renderRhythmTask(r){const done=r.step,total=r.steps.length,pat=r.pattern||[];return `<div class="task card rhythmTask"><div class="taskTop"><div class="taskLabel">РИТМ</div><span class="taskTag">${done} / ${total}</span></div><div class="metronomeBox"><div><span class="bpm">${r.meter.bpm}</span><small>BPM</small></div><div class="patternLane">${pat.map((x,i)=>`<span class="rhythmBeat ${i<done?'hit':''}">${x.label}</span>`).join('')}</div><button class="secondary" id="toggleMetro">▶ Метроном</button></div><div class="targetCard"><div class="targetName">${noteName(60)}</div><div class="targetMeta"><span>Сыграй эту ноту точно в отмеченный момент</span><b>ритм важнее скорости</b></div>${staffSvg([60],60,'treble')}${keyboardHtml(60)}<div class="timingHint">${pat.map((x,i)=>`<span class="${i===done?'active':''}">${x.label}</span>`).join(' · ')}</div></div><div id="lessonFeedback">${feedbackMarkup('wait','Готово','Включи метроном или просто начни с первого удара.')}</div></div>`}
function renderIntervalTask(r){const pair=r.pairs[Math.min(Math.floor(r.step/2),r.pairs.length-1)];const phase=r.step%2;const expected=phase===0?pair[0]:pair[1];const label=phase===0?'Сначала первая нота':'Теперь вторая нота';return `<div class="task card"><div class="taskTop"><div class="taskLabel">ИНТЕРВАЛ</div><span class="taskTag">${Math.min(r.step+1,r.pairs.length*2)} / ${r.pairs.length*2}</span></div><div class="intervalBanner"><span>${escapeHtml(label)}</span><b>${phase===0?noteName(pair[0]):noteName(pair[1])}</b><small>${phase===0?'Запомни её. После неё приложение попросит вторую.':`Расстояние: ${intervalName(pair[0],pair[1])}`}</small></div>${staffSvg([pair[0],pair[1]],expected,guessClef(expected))}${keyboardHtml(expected)}<div id="lessonFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteName(expected)}.`)}</div></div>`}
function renderChordTask(r){const c=r.chordRounds[r.chordRound];const notes=c.midi;return `<div class="task card"><div class="taskTop"><div class="taskLabel">АККОРД</div><span class="taskTag">${r.chordRound+1} / ${r.rounds}</span></div><div class="targetCard"><div class="targetName">${escapeHtml(c.root)} ${CHORD_LABELS[c.type]}</div><div class="targetMeta"><span>${escapeHtml(chordText(c.root,c.type))}</span><b>3 звука · одна попытка</b></div>${r.chordRhythm?`<div class="chordPulse"><strong>${r.meter.bpm}</strong><span>BPM · следующий аккорд на следующей доле</span></div>`:''}${staffSvg(notes,null,'treble')}${keyboardHtml(notes[0],notes)}<div class="targetHint">Сыграй три ноты вместе или почти одновременно. Приложение будет собирать звуки до 0,9 секунды.</div></div><div id="lessonFeedback">${feedbackMarkup('wait','Жду аккорд',`Сыграй ${c.root} ${CHORD_LABELS[c.type]}.`)}</div>${r.errors>=2?`<div class="hintBox"><b>Подсказка</b><span>${escapeHtml(c.root)} ${CHORD_LABELS[c.type]} = ${escapeHtml(chordText(c.root,c.type))}. Нажми три нужные клавиши.</span></div>`:''}</div>`}
function feedbackMarkup(kind,title,body){return `<div class="feedback ${kind}"><span class="feedbackDot"></span><div><b>${escapeHtml(title)}</b><small>${escapeHtml(body)}</small></div></div>`}function renderChordEarTask(r){const c=r.earRounds[r.earRound];const answered=r.earAnswered===true;return `<div class="task card"><div class="taskTop"><div class="taskLabel">ТРЕНИРОВКА СЛУХА</div><span class="taskTag">${r.earRound+1} / ${r.earRounds.length}</span></div><div class="earCard"><div class="earIcon">◒</div><div><b>Послушай аккорд</b><p>Не смотри на название — сначала услышь характер звучания.</p></div><button class="primary" id="hearEarChord">${answered?'▶ Ещё раз':'▶ Послушать'}</button></div><div class="choiceGrid"><button class="choiceBtn" data-ear="major">Мажор</button><button class="choiceBtn" data-ear="minor">Минор</button></div><div id="lessonFeedback">${feedbackMarkup('wait',answered?'Ответ выбран':'Слушай внимательно',answered?'Сейчас можно перейти к следующему аккорду.':'Нажми «Послушать», затем выбери характер аккорда.')}</div>${answered?`<button class="primary full" id="earNext">Следующий аккорд →</button>`:''}</div>`}
function bindChordEar(r){const c=r.earRounds[r.earRound];$('#hearEarChord').onclick=()=>{playToneGroup(chord(c.root,c.type),.34);speak(c.type==='major'?'мажор':'минор')};$$('[data-ear]').forEach(b=>b.onclick=()=>{r.earAnswered=true;r.earCorrect=b.dataset.ear===c.type;setLessonFeedback(r.earCorrect?'good':'bad',r.earCorrect?'Верно!':'Ещё раз',r.earCorrect?'Ты правильно определил характер аккорда.':`Это ${CHORD_LABELS[c.type]}.`);renderLesson()});if($('#earNext'))$('#earNext').onclick=()=>{if(!r.earAnswered)return;r.earRound++;r.earAnswered=false;if(r.earRound>=r.earRounds.length){r.passed=true;completeLesson(r.n);renderLessonComplete(r)}else renderLesson()}}

function keyboardHtml(target,targets=[],mode='exact'){const low=48,high=84,whites=[];for(let m=low;m<=high;m++)if(WHITE_PC.includes(pitchClass(m)))whites.push(m);const width=36;const idx=new Map(whites.map((m,i)=>[m,i]));const exactTargets=targets.length?targets:(Number.isFinite(target)?[target]:[]);const isTarget=m=>mode==='pitchClass'?pitchClass(m)===pitchClass(target):exactTargets.includes(m);let html='';for(const m of whites)html+=`<button type="button" class="pKey whiteKey ${isTarget(m)?'target':''}" data-pitch="${m}" style="left:${idx.get(m)*width}px" aria-label="${escapeHtml(noteText(m))}"></button>`;for(let m=low;m<=high;m++)if(!WHITE_PC.includes(pitchClass(m))){const before=whites.findIndex(w=>w>m)-1;if(before>=0)html+=`<button type="button" class="pKey blackKey ${isTarget(m)?'target':''}" data-pitch="${m}" style="left:${before*width+24}px" aria-label="${escapeHtml(noteText(m))}"></button>`}return `<div class="keyboardWrap"><div class="keyboard" style="width:${whites.length*width}px">${html}</div></div>`}

function guessClef(m){return m<60?'bass':'treble'}

function staffSvg(notes,active,clef='treble'){
  const W=760,H=210,left=92,right=736,lineGap=13,top=62;const lineY=i=>top+i*lineGap;
  const staffBottom=lineY(4), stepGap=lineGap/2;
  const letterMap={C:0,D:1,E:2,F:3,G:4,A:5,B:6};
  const noteLetter=m=>['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][pitchClass(m)];
  const diatonicStep=m=>{const l=noteLetter(m)[0];const octaveN=octave(m);return octaveN*7+letterMap[l]};
  const refTreble=diatonicStep(64),refBass=diatonicStep(43);
  const yFor=m=>{const ref=clef==='bass'?refBass:refTreble;const pos=diatonicStep(m)-ref;return staffBottom-pos*stepGap};
  let s=`<svg class="staffSvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Нотный стан"><defs><linearGradient id="staffGlow" x1="0" x2="1"><stop offset="0" stop-color="#a68cff" stop-opacity=".85"/><stop offset="1" stop-color="#6f61ff" stop-opacity=".55"/></linearGradient></defs><rect x="0" y="0" width="760" height="210" rx="18" class="staffBg"/>`;
  for(let i=0;i<5;i++)s+=`<line x1="62" y1="${lineY(i)}" x2="738" y2="${lineY(i)}" class="staffLine"/>`;
  s+=`<text x="20" y="108" class="clef">${clef==='bass'?'𝄢':'𝄞'}</text>`;
  notes.forEach((m,i)=>{
    const x=150+i*95;const y=yFor(m);const high=y<lineY(0);const low=y>lineY(4);if(high){for(let yy=lineY(0)-lineGap;yy>=y-2;yy-=lineGap)s+=`<line x1="${x-16}" y1="${yy}" x2="${x+16}" y2="${yy}" class="ledger"/>`}if(low){for(let yy=lineY(4)+lineGap;yy<=y+2;yy+=lineGap)s+=`<line x1="${x-16}" y1="${yy}" x2="${x+16}" y2="${yy}" class="ledger"/>`}if(active===m)s+=`<circle cx="${x}" cy="${y}" r="16" class="noteHalo"/>`;s+=`<ellipse cx="${x}" cy="${y}" rx="9" ry="6.5" class="noteHead ${active===m?'active':''}"/><line x1="${x+8}" y1="${y}" x2="${x+8}" y2="${y-38}" class="stem"/><text x="${x}" y="182" text-anchor="middle" class="staffName">${escapeHtml(noteName(m))}</text>`;
  });
  return s+`</svg>`;
}

function bindSetup(r){if($('#setupMic'))$('#setupMic').onclick=startMic;$$('[data-pitch]').forEach(k=>k.onclick=()=>toast('Экранная клавиатура только показывает цель. Сыграй её на своём синтезаторе.'));}
function showTheory(r){toast(r.theory)}
let metroTimer=0,metroOn=false;
function bindRhythm(r){
  $('#toggleMetro').onclick=()=>{metroOn=!metroOn;$('#toggleMetro').textContent=metroOn?'■ Остановить':'▶ Метроном';if(metroOn)startMetronome(r.meter.bpm);else stopMetronome()};
  $$('[data-pitch]').forEach(k=>k.onclick=()=>toast('Для урока используй настоящий синтезатор.'));
}
function startMetronome(bpm){stopMetronome();const ms=60000/bpm;let beat=0;metroTimer=setInterval(()=>{if(!metroOn)return;playTone(beat%4===0?72:67,.08);beat++},ms)}
function stopMetronome(){if(metroTimer){clearInterval(metroTimer);metroTimer=0}}
function bindInterval(r){ }
function bindChord(r){ }
function bindSequence(r){ }
function bindMusical(r){
  if(r.sequenceDone){$$('[data-musical-choice]').forEach(b=>b.onclick=()=>{r.focusChoice=+b.dataset.musicalChoice;r.passed=true;completeLesson(r.n);setLessonFeedback('good','Осознанно сыграно!','Урок завершён. Музыкальность тоже тренируется через решения.');setTimeout(()=>renderLessonComplete(r),360)});}
}

function bindSongCourse(r){
  if(r.songKind==='timer'){
    const done=new Set();
    $$('.checkStep').forEach(b=>b.onclick=()=>{done.add(+b.dataset.selfstep);b.textContent=`✓ ${b.textContent.slice(2)}`;b.classList.add('done');});
    $('#songPlanDone').onclick=()=>{if(done.size<3){toast('Отметь все 3 части схемы','bad');return}r.passed=true;completeLesson(r.n);renderLessonComplete(r)};
  }else if(r.songKind==='choose'){
    $$('.choiceBtn').forEach(b=>b.onclick=()=>{const ok=+b.dataset.choice===r.steps[0];setLessonFeedback(ok?'good':'bad',ok?'Верно!':'Не совсем',ok?'Теперь можно идти дальше.':`Нужна нота ${noteName(r.steps[0])}.`);if(ok){r.passed=true;completeLesson(r.n);setTimeout(()=>renderLessonComplete(r),320)}});
  }else if(r.songKind==='chord'){
    // handled by the chord collector in onDetected
  }
}


function playTarget(r){
  if(r.type==='setup'){playTone(60);speak('Сейчас до');return}
  if(r.type==='chordEar'){const c=r.earRounds?.[r.earRound];if(c)playToneGroup(chord(c.root,c.type));return}
  if(r.type==='chord'||r.type==='song'&&r.songKind==='chord'){const c=r.chordRounds?.[r.chordRound]||{midi:[60,64,67]};playToneGroup(c.midi);return}
  if(r.type==='interval'){const p=r.pairs[Math.min(Math.floor(r.step/2),r.pairs.length-1)];playToneGroup([p[0],p[1]],.26);return}
  if(r.type==='song'&&r.songKind==='timer'){speak('Схема на пятнадцать минут');return}
  const target=r.steps[Math.min(r.step,r.steps.length-1)];if(target!=null){playTone(target);speak(`Сейчас ${noteName(target)}`)}
}
function speak(text){try{if('speechSynthesis' in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ru-RU';u.rate=.9;u.pitch=1;window.speechSynthesis.speak(u)}}catch{}}
function playPianoNote(m,when=0,duration=2.2,velocity=.8){
  if(!oscillatorCtx)oscillatorCtx=new (window.AudioContext||window.webkitAudioContext)();
  const ctx=oscillatorCtx,now=ctx.currentTime+when,f=440*Math.pow(2,(m-69)/12);
  const master=ctx.createGain(),filter=ctx.createBiquadFilter(),body=ctx.createBiquadFilter();
  filter.type='lowpass';filter.frequency.setValueAtTime(Math.min(7000,2600+f*4.5),now);filter.Q.value=.35;
  body.type='peaking';body.frequency.setValueAtTime(Math.min(2200,f*1.7),now);body.Q.value=.7;body.gain.value=2.4;
  master.gain.setValueAtTime(.0001,now);
  master.gain.exponentialRampToValueAtTime(.17*velocity,now+.008);
  master.gain.exponentialRampToValueAtTime(.105*velocity,now+.12);
  master.gain.exponentialRampToValueAtTime(.060*velocity,now+.42);
  master.gain.exponentialRampToValueAtTime(.025*velocity,now+.95);
  master.gain.exponentialRampToValueAtTime(.0001,now+duration);
  filter.connect(body).connect(master).connect(ctx.destination);

  const partials=[
    {type:'triangle',mult:1,gain:.68,detune:-1.8},
    {type:'sine',mult:2,gain:.20,detune:1.1},
    {type:'sine',mult:3,gain:.075,detune:-.7},
    {type:'sine',mult:4,gain:.035,detune:.5},
    {type:'sine',mult:6,gain:.016,detune:-.3}
  ];
  partials.forEach(p=>{
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type=p.type;o.frequency.setValueAtTime(f*p.mult,now);o.detune.value=p.detune;
    g.gain.value=p.gain;o.connect(g).connect(filter);o.start(now);o.stop(now+duration+.08);
  });
  const hammer=ctx.createOscillator(),hg=ctx.createGain(),hf=ctx.createBiquadFilter();
  hammer.type='triangle';hammer.frequency.setValueAtTime(Math.min(9000,f*5),now);
  hg.gain.setValueAtTime(.018*velocity,now);hg.gain.exponentialRampToValueAtTime(.0001,now+.045);
  hf.type='highpass';hf.frequency.value=1800;hammer.connect(hg).connect(hf).connect(master);hammer.start(now);hammer.stop(now+.06);
  const shimmer=ctx.createOscillator(),sg=ctx.createGain();
  shimmer.type='sine';shimmer.frequency.setValueAtTime(f*2.01,now+.02);sg.gain.setValueAtTime(.018*velocity,now+.02);sg.gain.exponentialRampToValueAtTime(.0001,now+.8);shimmer.connect(sg).connect(filter);shimmer.start(now+.02);shimmer.stop(now+1);
}
function playTone(m,beat=.9){try{if(!oscillatorCtx)oscillatorCtx=new (window.AudioContext||window.webkitAudioContext)();if(oscillatorCtx.state==='suspended')oscillatorCtx.resume();playPianoNote(m,0,Math.max(1.5,beat*1.8),.72)}catch{}}
function playToneGroup(notes,dur=1.4){try{if(!oscillatorCtx)oscillatorCtx=new (window.AudioContext||window.webkitAudioContext)();if(oscillatorCtx.state==='suspended')oscillatorCtx.resume();notes.forEach(m=>playPianoNote(m,0,dur,.52))}catch{}}
function intervalName(a,b){const d=Math.abs(b-a)%12;return ({0:'повтор',1:'секунда',2:'секунда',3:'терция',4:'терция',5:'кварта',6:'кварта с увеличением',7:'квинта',8:'секста',9:'секста',10:'септима',11:'септима'}[d]||'интервал')}

function handleTunerDetected(m,meta={}){const cents=Number(meta.cents)||0;practiceState.tunerNote=m;practiceState.tunerCents=cents;const n=$('#tunerNote'),o=$('#tunerOct'),c=$('#tunerCents'),needle=$('#tunerNeedle');if(n)n.textContent=noteName(m);if(o)o.textContent=`${octave(m)} октава`;if(c)c.textContent=`${cents>0?'+':''}${Math.round(cents)} cents`;if(needle)needle.style.left=`${Math.max(0,Math.min(100,50+cents/2))}%`}
function onDetected(midiValue, meta={}){
  if(route==='lesson' && runtime && !runtime.passed){if(runtime.type==='setup'){handleSetupDetected(midiValue);return}if(runtime.type==='rhythm'){handleRhythmDetected(midiValue,meta);return}if(runtime.type==='interval'){handleIntervalDetected(midiValue);return}if(runtime.type==='chordEar'){return}if(runtime.type==='chord'||runtime.type==='song'&&runtime.songKind==='chord'){handleChordDetected(midiValue);return}if(runtime.type==='song'){handleSongCourseDetected(midiValue,meta);return}handleSequenceDetected(midiValue,meta);return}
  if(route==='song' && songRuntime){handleSongDetected(midiValue);return}
  if(route==='practice'){handlePracticeDetection(midiValue,meta);}
}
function setLessonFeedback(kind,title,body){const el=$('#lessonFeedback');if(el)el.innerHTML=feedbackMarkup(kind,title,body)}
function flashKeys(midiList,good){midiList.forEach(m=>{const k=$(`[data-pitch="${m}"]`);if(k){k.classList.remove('hit','wrong');void k.offsetWidth;k.classList.add(good?'hit':'wrong');setTimeout(()=>k.classList.remove('hit','wrong'),280)}})}
function handleSetupDetected(m){if(pitchClass(m)===0){runtime.passed=true;setLessonFeedback('good','Верно!','Первая нота распознана. Курс готов.');setTimeout(()=>{completeLesson(1);toast(`Урок 1 завершён · +${xpFor(1)} XP`);renderLessonComplete(runtime)},420)}else{setLessonFeedback('bad','Попробуй ещё',`Услышана ${noteText(m)}. Сейчас нужна нота ДО. Высота октавы здесь не важна.`)}}
function handleSequenceDetected(m){const r=runtime;if(r.passed||r.sequenceDone)return;const target=r.steps[r.step];flashKeys([m],m===target);if(m===target){r.step++;r.errors=0;if(r.step>=r.steps.length&&r.type==='musical'){r.sequenceDone=true;setLessonFeedback('good','Фраза сыграна!','Теперь выполни музыкальную самопроверку.');setTimeout(renderLesson,300);return}setLessonFeedback('good','Верно!',r.step<r.steps.length?`Следующая цель: ${noteName(r.steps[r.step])}.`:'Последняя нота!');if(r.step>=r.steps.length){r.passed=true;completeLesson(r.n);setTimeout(()=>renderLessonComplete(r),360)}else setTimeout(renderLesson,360)}else{r.errors++;state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();setLessonFeedback('bad','Попробуй ещё',`Услышана ${noteText(m)}. Сейчас нужна ${noteText(target)}.`)}}
function handleRhythmDetected(m,meta){const r=runtime;if(r.passed)return;if(m!==60){r.errors++;setLessonFeedback('bad','Нужна одна нота',`Сейчас нужна ${noteName(60)}. Сначала попади в ноту, затем снова в ритм.`);return}const now=performance.now();if(r.rhythmStart==null)r.rhythmStart=now;const event=r.pattern[r.step];const due=r.rhythmStart+event.u*(60000/r.meter.bpm);const delta=Math.abs(now-due);if(r.step>0&&delta>320){setLessonFeedback('bad','Чуть мимо по времени',`Попробуй ещё раз на ${event.label}. Допуск сейчас около 0,32 с.`);flashKeys([m],false);return}flashKeys([m],true);r.step++;setLessonFeedback('good',`${r.step} из ${r.steps.length}`,r.step<r.steps.length?`Следующая цель: ${r.pattern[r.step].label}.`:'Ритм пройден.');if(r.step>=r.steps.length){r.passed=true;stopMetronome();setTimeout(()=>{completeLesson(r.n);renderLessonComplete(r)},360)}else setTimeout(renderLesson,260)}
function handleIntervalDetected(m){const r=runtime;const pair=r.pairs[Math.min(Math.floor(r.step/2),r.pairs.length-1)];const target=r.step%2===0?pair[0]:pair[1];flashKeys([m],m===target);if(m===target){r.step++;r.errors=0;const finished=r.step>=r.pairs.length*2;setLessonFeedback('good','Верно!',finished?'Интервал пройден.':r.step%2===1?'Теперь вторая нота.':'Следующий интервал.');if(finished){r.passed=true;setTimeout(()=>{completeLesson(r.n);renderLessonComplete(r)},360)}else setTimeout(renderLesson,300)}else{r.errors++;setLessonFeedback('bad','Попробуй ещё',`Сейчас нужна ${noteText(target)}.`)}}
function handleChordDetected(value){const r=runtime;if(!r||r.passed)return;const c=r.chordRounds?r.chordRounds[r.chordRound]:{root:'до',type:'major',midi:[60,64,67]};const incoming=Array.isArray(value)?value:[value];const now=performance.now();if(r.chordRhythm){const beatMs=60000/(r.meter?.bpm||64);if(r.chordBeatStart==null)r.chordBeatStart=now;const due=r.chordBeatStart+r.chordRound*beatMs;const delta=Math.abs(now-due);if(delta>420){setLessonFeedback('bad','Мимо пульса',`Сыграй аккорд ближе к доле ${r.chordRound+1}. Допуск около 0,42 с.`);r.heardChord=[];return;}}if(!Array.isArray(value)){if(!r.heardChord.length||now-r.heardChord[r.heardChord.length-1].at>900)r.heardChord=[];r.heardChord.push({m:value,at:now});}else{r.heardChord=[];incoming.forEach(m=>r.heardChord.push({m,at:now}))}const unique=[...new Set((r.heardChord||[]).map(x=>pitchClass(x.m)))],wanted=[...new Set(c.midi.map(pitchClass))],wrong=unique.find(pc=>!wanted.includes(pc));if(Array.isArray(value))flashKeys(incoming,incoming.every(m=>wanted.includes(pitchClass(m))));else flashKeys([value],wanted.includes(pitchClass(value)));if(wrong!==undefined){r.errors++;r.heardChord=[];setLessonFeedback('bad','Лишний звук',`Услышана лишняя нота ${noteName(value)}. Нужен ${c.root} ${CHORD_LABELS[c.type]}.`);return}const ok=wanted.every(pc=>unique.includes(pc));setLessonFeedback(ok?'good':'wait',ok?'Аккорд верный!':'Собираем аккорд',ok?'Все три звука совпали.':`Уже услышано ${wanted.filter(pc=>unique.includes(pc)).length} из 3.`);if(ok){r.heardChord=[];r.errors=0;if(r.type==='song'){r.passed=true;completeLesson(r.n);setTimeout(()=>renderLessonComplete(r),380);return}r.chordRound++;if(r.chordRound>=r.rounds){r.passed=true;setTimeout(()=>{completeLesson(r.n);renderLessonComplete(r)},380)}else setTimeout(renderLesson,320)}}
function handlePracticeChordDetected(notes){const c=practiceState.chord;if(!c||practiceState.chordPassed)return;const target=chord(c.root,c.type).map(pitchClass);const incoming=Array.isArray(notes)?notes:[notes];practiceState.chordSeen=practiceState.chordSeen.filter(x=>performance.now()-x.at<900);incoming.forEach(m=>practiceState.chordSeen.push({m,at:performance.now()}));const pcs=[...new Set(practiceState.chordSeen.map(x=>pitchClass(x.m)))];const good=target.every(pc=>pcs.includes(pc));if(good){practiceState.chordPassed=true;practiceState.chordSeen=[];$('#practiceChordFeedback').innerHTML=feedbackMarkup('good','Аккорд верный!','Все три звука совпали.');flashKeys(incoming,true)}else{$('#practiceChordFeedback').innerHTML=feedbackMarkup('wait','Собираем аккорд',`Совпало ${target.filter(pc=>pcs.includes(pc)).length} из 3.`);flashKeys(incoming,incoming.every(m=>target.includes(pitchClass(m))))}}

function handleDynamic(meta,m){return}

function renderLessonComplete(r){
  $('#lesson').innerHTML=`${header('Урок завершён','course','ГОТОВО')}<div class="completeHero card"><div class="completeIcon">✓</div><div class="eyebrow">Урок ${r.n}</div><h2>${escapeHtml(r.title)}</h2><p>${r.type==='song'?'Ты собрал учебный фрагмент и можешь перенести этот навык в библиотеку песен.':'Ты прошёл все цели этого урока. Теперь навык закреплён в прогрессе курса.'}</p><div class="reward">+${xpFor(r.n)} XP</div><div class="completeActions"><button class="primary" id="nextBtn">${r.n<COURSE_SIZE?'Следующий урок →':'Открыть песни'}</button><button class="secondary" id="repeatBtn">↻ Повторить</button></div></div>`;
  bindBack();$('#nextBtn').onclick=()=>r.n<COURSE_SIZE?openLesson(r.n+1):go('songs');$('#repeatBtn').onclick=()=>openLesson(r.n);
}

function renderPractice(){
  $('#practice').innerHTML=`${header('Практика','home','ТРЕНАЖЁР')}
    <div class="tabBar">
      <button class="pill ${practiceState.tab==='notes'?'active':''}" data-practice="notes">🎼 Ноты</button>
      <button class="pill ${practiceState.tab==='chords'?'active':''}" data-practice="chords">⌬ Аккорды</button>
      <button class="pill ${practiceState.tab==='ear'?'active':''}" data-practice="ear">👂 Слух</button>
      <button class="pill ${practiceState.tab==='tuner'?'active':''}" data-practice="tuner">🎛 Тюнер</button>
      <button class="pill ${practiceState.tab==='session'?'active':''}" data-practice="session">⏱ 3 минуты</button>
      <button class="pill ${practiceState.tab==='weak'?'active':''}" data-practice="weak">↗ Слабые места</button>
    </div>
    <div class="practiceIntro card"><div class="sectionKicker">УМНАЯ ПРАКТИКА</div><p>Не обязательно всегда идти по курсу. Здесь можно отдельно тренировать то, что сейчас хочется улучшить: чтение, слух, аккорды, настройку микрофона или быстрый 5-минутный разогрев.</p></div>
    <div id="practiceBody"></div>`;
  $$('[data-practice]').forEach(b=>b.onclick=()=>{practiceState.tab=b.dataset.practice;practiceState.notePassed=false;practiceState.chordPassed=false;practiceState.chordSeen=[];practiceState.earAnswered=false;renderPractice()});
  bindBack();
  if(practiceState.tab==='notes')renderPracticeNotes();
  else if(practiceState.tab==='chords')renderPracticeChords();
  else if(practiceState.tab==='ear')renderPracticeEar();
  else if(practiceState.tab==='tuner')renderPracticeTuner();
  else if(practiceState.tab==='session')renderPracticeSession();
  else renderPracticeWeak();
}
function newPracticeNote(){let pool=[60,62,64,65,67,69,71];if(practiceState.tab==='weak'){const weak=Object.entries(state.mistakes||{}).sort((a,b)=>b[1]-a[1]).map(([m])=>+m).filter(m=>pool.includes(m));if(weak.length)pool=weak}let next=pool[Math.floor(Math.random()*pool.length)];if(pool.length>1&&next===practiceState.note)next=pool[(pool.indexOf(next)+1)%pool.length];practiceState.note=next;practiceState.notePassed=false}
function renderPracticeNotes(){if(practiceState.note==null)newPracticeNote();const t=practiceState.note;$('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">ОДНА ЦЕЛЬ ЗА РАЗ</div><p>Сначала приложение показывает название, нотный стан и точную клавишу. Ты играешь на своём инструменте. Только правильная нота открывает следующую.</p></div><div class="task card"><div class="taskTop"><div class="taskLabel">ТЕКУЩАЯ ЦЕЛЬ</div><span class="taskTag">${practiceState.notePassed?'пройдена':'жду звук'}</span></div><div class="targetCard"><div class="targetName">${noteName(t)}</div><div class="targetMeta"><span>Любая октава</span><b>Сыграй на синтезаторе</b></div>${staffSvg([t],t,guessClef(t))}${keyboardHtml(t,[], 'pitchClass')}</div><div id="practiceFeedback">${feedbackMarkup(practiceState.notePassed?'good':'wait',practiceState.notePassed?'Верно!':'Жду звук',practiceState.notePassed?'Следующая цель доступна.':`Сыграй ${noteName(t)}.`)}</div><button class="primary full ${practiceState.notePassed?'':'disabled'}" id="nextPracticeNote">${practiceState.notePassed?'→ Следующая нота':'Сначала сыграй правильно'}</button><button class="ghostBtn full" id="hearPractice">🔊 Послушать цель</button></div>`;$('#nextPracticeNote').onclick=()=>{if(!practiceState.notePassed)return;newPracticeNote();renderPractice()};$('#hearPractice').onclick=()=>playTone(t)}
function renderPracticeChords(){if(!practiceState.chord)practiceState.chord={root:'до',type:'major'};const c=practiceState.chord,notes=chord(c.root,c.type),passed=practiceState.chordPassed;$('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">ТРЕНАЖЁР АККОРДОВ</div><p>Для надёжного распознавания можно нажать три нужные клавиши почти одновременно. Микрофон собирает несколько частот в одной попытке.</p></div><div class="filterRow">${CHORD_TYPES.map(t=>`<button class="pill ${c.type===t?'active':''}" data-ctype="${t}">${CHORD_LABELS[t]}</button>`).join('')}</div><div class="task card"><div class="taskTop"><div class="taskLabel">ТЕКУЩИЙ АККОРД</div><span class="taskTag">${passed?'пройден':'жду аккорд'}</span></div><div class="targetCard"><div class="targetName">${escapeHtml(c.root)} ${CHORD_LABELS[c.type]}</div><div class="targetMeta"><span>${escapeHtml(chordText(c.root,c.type))}</span><b>3 звука</b></div>${staffSvg(notes,null,'treble')}${keyboardHtml(notes[0],notes)}<div class="targetHint">Сыграй три ноты вместе. Если инструмент звучит не одновременно, сыграй их очень быстро по очереди.</div></div><div id="practiceChordFeedback">${feedbackMarkup(passed?'good':'wait',passed?'Аккорд верный!':'Жду аккорд',passed?'Все нужные звуки найдены.':`Сыграй ${c.root} ${CHORD_LABELS[c.type]}.`)}</div><button class="primary full ${passed?'':'disabled'}" id="nextPracticeChord">${passed?'→ Следующий аккорд':'Сначала сыграй правильно'}</button><button class="ghostBtn full" id="hearPracticeChord">🔊 Послушать аккорд</button></div>`;$$('[data-ctype]').forEach(b=>b.onclick=()=>{practiceState.chord.type=b.dataset.ctype;practiceState.chordPassed=false;practiceState.chordSeen=[];renderPractice()});$('#nextPracticeChord').onclick=()=>{if(!passed)return;practiceState.chord.root=Object.keys(ROOT_PC)[Math.floor(Math.random()*Object.keys(ROOT_PC).length)];practiceState.chordPassed=false;practiceState.chordSeen=[];renderPractice()};$('#hearPracticeChord').onclick=()=>playToneGroup(notes)}

function newEarTarget(){
  const pool=[60,62,64,65,67,69,71];
  let t=pool[Math.floor(Math.random()*pool.length)];
  if(practiceState.ear?.target!=null&&pool.length>1&&t===practiceState.ear.target)t=pool[(pool.indexOf(t)+1)%pool.length];
  practiceState.ear={target:t};
  practiceState.earAnswered=false;
}
function renderPracticeEar(){
  if(!practiceState.ear)newEarTarget();
  const e=practiceState.ear, answered=practiceState.earAnswered;
  const choices=[60,62,64,65,67,69,71];
  $('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">ТРЕНАЖЁР СЛУХА</div><h2>Угадай ноту только по звуку</h2><p>Сначала послушай пианинный тембр, не смотри на ноту, затем выбери её название. После ответа можно сразу взять следующую.</p></div>
    <div class="task card earPracticeCard"><div class="earHero"><div class="earPulse">♪</div><div><div class="sectionKicker">ЦЕЛЬ СКРЫТА</div><h3>${answered?'Ответ проверен':'Какую ноту ты слышишь?'}</h3><small>${answered?'Теперь можно перейти дальше.':'Нажми кнопку и слушай высоту звука.'}</small></div></div>
    <button class="primary full" id="playEarTarget">🔊 ${answered?'Послушать ещё раз':'Послушать ноту'}</button>
    <div class="earChoices">${choices.map(m=>`<button class="choiceBtn" data-ear-note="${m}">${noteName(m)}</button>`).join('')}</div>
    <div id="earPracticeFeedback">${feedbackMarkup(answered?(practiceState.earCorrect?'good':'bad'):'wait',answered?(practiceState.earCorrect?'Верно!':'Не угадал'): 'Готово к прослушиванию',answered?`Правильный ответ: ${noteName(e.target)}.`:'Сначала послушай звук.')}</div>
    ${answered?`<button class="secondary full" id="nextEarTarget">Следующая нота →</button>`:''}</div>`;
  $('#playEarTarget').onclick=()=>{playTone(e.target,1.2);speak(`слушай`);};
  $$('[data-ear-note]').forEach(b=>b.onclick=()=>{practiceState.earAnswered=true;practiceState.earCorrect=pitchClass(+b.dataset.earNote)===pitchClass(e.target);markActive();$('#earPracticeFeedback').innerHTML=feedbackMarkup(practiceState.earCorrect?'good':'bad',practiceState.earCorrect?'Верно!':'Пока нет',practiceState.earCorrect?`Это ${noteName(e.target)}.`:`Правильный ответ — ${noteName(e.target)}.`);renderPractice()});
  $('#nextEarTarget')?.addEventListener('click',()=>{newEarTarget();renderPractice()});
}
function renderPracticeTuner(){
  $('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">КАЛИБРОВКА МИКРОФОНА</div><h2>Проверь, как сайт слышит твой синтезатор</h2><p>Сыграй любую одну ноту. Здесь ничего не засчитывается — тюнер просто показывает распознанную ноту и примерное отклонение по высоте.</p></div>
    <div class="tunerCard card"><div class="tunerNote" id="tunerNote">${practiceState.tunerNote?escapeHtml(noteName(practiceState.tunerNote)):'—'}</div><div class="tunerOct" id="tunerOct">${practiceState.tunerNote!=null?`${octave(practiceState.tunerNote)} октава`:'Сыграй одну ноту'}</div><div class="tunerMeter"><i id="tunerNeedle" style="left:${Math.max(0,Math.min(100,50+(Number(practiceState.tunerCents)||0)/2))}%"></i></div><div class="tunerScale"><span>−50</span><span>точно</span><span>+50</span></div><div class="tunerCents" id="tunerCents">${practiceState.tunerCents!=null?`${practiceState.tunerCents>0?'+':''}${Math.round(practiceState.tunerCents)} cents`:'Ожидаю звук'}</div></div>
    <div id="tunerStatus">${feedbackMarkup(mic.stream?'wait':'bad',mic.stream?'Микрофон готов':'Подключи микрофон',mic.stream?'Сыграй одну ноту — тюнер покажет её сразу.':'Нажми «Подключить микрофон» на главной.')}</div>`;
}

let practiceSessionTimer=0;
function clearPracticeSessionTimer(){if(practiceSessionTimer){clearInterval(practiceSessionTimer);practiceSessionTimer=0}}
function startPracticeSession(){
  const st=practiceState.session||{};
  st.started=true;st.finished=false;st.endsAt=Date.now()+5*60*1000;st.index=0;st.correct=0;st.errors=0;st.rewarded=false;
  practiceState.session=st;practiceState.notePassed=false;clearPracticeSessionTimer();
  practiceSessionTimer=setInterval(()=>{if(Date.now()>=st.endsAt){st.finished=true;clearPracticeSessionTimer();if(!st.rewarded){awardXP(25);st.rewarded=true}renderPractice()}else updateSessionTimerUI(st)},250);
  renderPractice();
}
function updateSessionTimerUI(st){const el=$('#sessionClock');if(!el)return;const left=Math.max(0,st.endsAt-Date.now());const m=Math.floor(left/60000),sec=Math.floor(left/1000)%60;el.textContent=`${m}:${String(sec).padStart(2,'0')}`}
function renderPracticeSession(){
  if(!practiceState.session)practiceState.session={index:0,queue:Array.from({length:12},()=>[60,62,64,65,67,69,71][Math.floor(Math.random()*7)]),started:false,finished:false,endsAt:null,rewarded:false,correct:0,errors:0};
  const st=practiceState.session;
  if(st.started&&!st.finished&&st.endsAt<=Date.now()){st.finished=true;clearPracticeSessionTimer();if(!st.rewarded){awardXP(25);st.rewarded=true}}
  if(st.finished){$('#practiceBody').innerHTML=`<div class="completeHero card"><div class="completeIcon">✓</div><div class="eyebrow">3-МИНУТНАЯ РАЗМИНКА</div><h2>Сессия закончена</h2><p>Ты успел пройти ${st.correct} ${plural(st.correct,'цель','цели','целей')} и получил новый набор опыта для адаптивной практики.</p><div class="reward">+25 XP</div><div class="completeActions"><button class="primary" id="restartSession">Новая сессия</button><button class="secondary" id="backPractice">К нотам</button></div></div>`;$('#restartSession').onclick=()=>{practiceState.session=null;practiceState.note=null;practiceState.notePassed=false;renderPractice()};$('#backPractice').onclick=()=>{practiceState.tab='notes';practiceState.session=null;renderPractice()};return}
  if(!st.started){$('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">ФОКУС · 5 МИНУТ</div><h2>Одна цель за раз, без пауз между заданиями</h2><p>После правильной ноты следующая появляется автоматически. Неверная нота учитывается как ошибка, но не останавливает сессию. В конце ты увидишь результат.</p><button class="primary full" id="startSession">▶ Начать 3 минуты</button></div><div class="card focusCard"><div class="focusIcon">⏱</div><div><b>Как проходит сессия</b><p>1. Увидел ноту → 2. сыграл на синтезаторе → 3. сразу получил следующую.</p></div></div>`;$('#startSession').onclick=startPracticeSession;return}
  const left=Math.max(0,st.endsAt-Date.now());const m=Math.floor(left/60000),sec=Math.floor(left/1000)%60;const target=st.queue[st.index%st.queue.length];practiceState.note=target;
  $('#practiceBody').innerHTML=`<div class="card sessionHeader"><div><div class="sectionKicker">ФОКУС · 5 МИНУТ</div><h2>Играем без остановки</h2><p>${st.correct} правильных · ${st.errors||0} ошибок</p></div><div class="sessionTimer" id="sessionClock">${m}:${String(sec).padStart(2,'0')}</div></div><div class="task card"><div class="targetCard"><div class="targetName">${noteName(target)}</div><div class="targetMeta"><span>${noteText(target)}</span><b>Следующая цель откроется автоматически</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}</div><div id="practiceSessionFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteName(target)}.`)}</div><button class="ghostBtn full" id="hearSession">🔊 Послушать цель</button></div>`;
  $('#hearSession').onclick=()=>playTone(target);updateSessionTimerUI(st);
}

function renderPracticeWeak(){
  const mistakes=state.mistakes||{};const rows=Object.entries(mistakes).sort((a,b)=>b[1]-a[1]).slice(0,7);if(!rows.length){$('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">ПОКА НЕТ ДАННЫХ</div><p>Ошибки появятся здесь после нескольких уроков и тренировок. Приложение будет использовать их, чтобы чаще возвращать именно сложные ноты.</p><button class="primary full" id="weakStart">Тренировать ноты</button></div>`;$('#weakStart').onclick=()=>{practiceState.tab='weak';practiceState.note=null;renderPractice();};return}
  $('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">АДАПТИВНАЯ ПРАКТИКА</div><p>Здесь собраны цели, на которых ты чаще ошибался. Ноты отсортированы по числу ошибок.</p></div><div class="weakList">${rows.map(([m,c],i)=>`<button class="weakRow" data-weak="${m}"><span>${i+1}</span><div><b>${noteText(+m)}</b><small>${c} ${plural(c,'ошибка','ошибки','ошибок')}</small></div><strong>→</strong></button>`).join('')}</div>`;$$('[data-weak]').forEach(b=>b.onclick=()=>{practiceState.tab='notes';practiceState.note=+b.dataset.weak;practiceState.notePassed=false;renderPractice()})
}
function handlePracticeDetection(m,meta){
  if(practiceState.tab==='tuner'){handleTunerDetected(m,meta);return}
  if(practiceState.tab==='notes'||practiceState.tab==='weak'){const t=practiceState.note;if(pitchClass(m)===pitchClass(t)){practiceState.notePassed=true;markActive();$('#practiceFeedback').innerHTML=feedbackMarkup('good','Верно!',`Услышана нота ${noteName(m)}. Октава не важна.`);$('#practiceSessionFeedback')?.setAttribute('style','');if($('#practiceSessionFeedback'))$('#practiceSessionFeedback').innerHTML=feedbackMarkup('good','Верно!','Нажми «Следующая цель».');flashKeys([m],true)}else{state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();const el=$('#practiceFeedback')||$('#practiceSessionFeedback');if(el)el.innerHTML=feedbackMarkup('bad','Попробуй ещё',`Услышана ${noteText(m)}. Нужна нота ${noteName(t)} — высота октавы не важна.`);flashKeys([m],false)}}
  else if(practiceState.tab==='session'){const st=practiceState.session,t=practiceState.note;if(pitchClass(m)===pitchClass(t)){st.correct=(st.correct||0)+1;state.mistakes=state.mistakes||{};save();flashKeys([m],true);toast('Верно! Следующая цель','good');st.index++;practiceState.notePassed=false;setTimeout(renderPractice,220)}else{st.errors=(st.errors||0)+1;state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();if($('#practiceSessionFeedback'))$('#practiceSessionFeedback').innerHTML=feedbackMarkup('bad','Попробуй ещё',`Услышана ${noteText(m)}. Нужна ${noteText(t)}.`);flashKeys([m],false)}}
  else{const c=practiceState.chord,notes=chord(c.root,c.type),now=performance.now();practiceState.chordSeen=practiceState.chordSeen.filter(x=>now-x.at<900);practiceState.chordSeen.push({m,at:now});const pcs=[...new Set(practiceState.chordSeen.map(x=>pitchClass(x.m)))],wanted=new Set(notes.map(pitchClass));const good=[...wanted].every(p=>pcs.includes(p));if(good){practiceState.chordPassed=true;practiceState.chordSeen=[];$('#practiceChordFeedback').innerHTML=feedbackMarkup('good','Аккорд верный!','Все три звука совпали.')}else{$('#practiceChordFeedback').innerHTML=feedbackMarkup(wanted.has(pitchClass(m))?'wait':'bad',wanted.has(pitchClass(m))?'Собираем аккорд':'Лишний звук',wanted.has(pitchClass(m))?`Совпало ${pcs.filter(p=>wanted.has(p)).length} из 3.`:`Услышана ${noteName(m)} — она не входит в этот аккорд.`)}}
}

function renderSongs(){
  const filter=window.songFilter||'Все', cat=window.songCategory||'Все', q=(window.songSearch||'').trim().toLowerCase();
  const levels=['Все','Очень легко','Легко','Средне','Продвинуто','Избранное'],cats=['Все',...new Set(SONGS.map(s=>s.category))];
  const favorites=state.favorites||[];
  const list=SONGS.filter(s=>(filter==='Все'||(filter==='Избранное'&&favorites.includes(s.id))||(filter!=='Избранное'&&s.difficulty===filter))&&(cat==='Все'||cat===s.category)&&(!q||(s.title+' '+s.author+' '+s.tags.join(' ')).toLowerCase().includes(q)));
  $('#songs').innerHTML=`${header('Песни','home',`БИБЛИОТЕКА · ${SONGS.length} ПРОЕКТОВ`)}<div class="songIntro card"><div><b>Библиотека, к которой хочется возвращаться.</b><span>Начинай с лёгких проектов, открывай новые стили и переходи к полным версиям через собственный MIDI.</span></div></div><div class="songSearch"><input id="songSearch" value="${escapeHtml(window.songSearch||'')}" placeholder="Найти песню, автора или жанр…" aria-label="Поиск песни"><button id="clearSongSearch">×</button></div><div class="filterRow levelFilters">${levels.map(l=>`<button class="pill ${filter===l?'active':''}" data-song-filter="${l}">${l}</button>`).join('')}</div><div class="filterRow catFilters">${cats.map(c=>`<button class="pill ${cat===c?'active':''}" data-song-category="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('')}</div><div class="songResults"><span>${list.length} ${plural(list.length,'проект','проекта','проектов')}</span><span>${window.songSearch||cat!=='Все'||filter!=='Все'?'Фильтр активен':'Все проекты'}</span></div><div class="songGrid">${list.length?list.map(s=>`<button class="songCard ${s.colorClass}" data-song="${s.id}"><div class="songIcon">${s.icon}</div><div class="songInfo"><span class="songLevel">${s.difficulty} · ${s.category}${favorites.includes(s.id)?' · ★':''}</span><h2>${escapeHtml(s.title)}</h2><p>${escapeHtml(s.author)}</p><div class="tagLine">${s.tags.map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div></div><span class="arrow">›</span></button>`).join(''):'<div class="emptyState card"><b>Ничего не найдено</b><span>Попробуй другой запрос или сбрось фильтр.</span></div>'}</div>`;
  $('#songSearch').oninput=e=>{window.songSearch=e.target.value;clearTimeout(renderSongs._t);renderSongs._t=setTimeout(renderSongs,180)};$('#clearSongSearch').onclick=()=>{window.songSearch='';renderSongs()};
  $$('[data-song-filter]').forEach(b=>b.onclick=()=>{window.songFilter=b.dataset.songFilter;renderSongs()});$$('[data-song-category]').forEach(b=>b.onclick=()=>{window.songCategory=b.dataset.songCategory;renderSongs()});$$('[data-song]').forEach(b=>b.onclick=()=>openSong(b.dataset.song));bindBack();
}

function songStageData(s,stage){
  const f=s.fragment.slice();
  const plans=[
    {name:'Узнать',kind:'learn',desc:'Сначала знакомимся с первой нотой и её звуком.',seq:f.slice(0,1)},
    {name:'Правая рука',kind:'right',desc:'Собираем короткую мелодическую фразу.',seq:f.slice(0,4)},
    {name:'Левая рука',kind:'left',desc:'Добавляем простой басовый опорный рисунок.',seq:[48,55,52,55]},
    {name:'Вместе',kind:'join',desc:'Соединяем руки и удерживаем ровный пульс.',seq:f.slice(0,6)},
    {name:'Прогон',kind:'run',desc:'Играем учебный фрагмент без остановки.',seq:f.slice(0,8)}
  ];
  return plans[Math.max(0,Math.min(plans.length-1,stage))];
}
function songUnlockedStage(s){
  const raw=state.songProgress?.[s.id];return Math.max(0,Math.min(4,Number(raw?.stage)||0));
}
function openSong(id){
  const s=SONGS.find(x=>x.id===id);if(!s)return;
  const saved=state.songProgress?.[id];
  const stage=Math.max(0,Math.min(4,Number(saved?.stage)||0));
  const plan=songStageData(s,stage);
  songRuntime={song:s,mode:'part',stage,stageDone:false,step:0,seq:plan.seq.slice(),events:plan.seq.map((note,i)=>({note,startMs:i*560})),loaded:false,error:false,playAlong:false,startedAt:0,speed:.8};
  state.activeSong=id;save();go('song');
}
function videoEmbed(url){if(!url)return null;try{const u=new URL(url);if(u.hostname.includes('youtube.com')&&u.searchParams.get('v'))return`https://www.youtube.com/embed/${u.searchParams.get('v')}?rel=0`;return null}catch{return null}}
function videoSearchUrl(s){return `https://www.youtube.com/results?search_query=${encodeURIComponent(s.title+' piano tutorial')}`}
function videoBlock(s){const embed=videoEmbed(s.video);if(embed)return `<div class="videoWrap"><iframe loading="lazy" src="${embed}" title="${escapeHtml(s.title)} — ${escapeHtml(s.videoLabel)}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe><div class="videoCaption"><span>Видео · ${escapeHtml(s.videoLabel)}</span><a href="${escapeHtml(s.video)}" target="_blank" rel="noopener">Открыть ↗</a></div></div>`;if(s.video)return `<div class="videoExternal card"><div class="videoExternalIcon">▶</div><div><b>${escapeHtml(s.videoLabel)}</b><span>Открыть конкретный видео-урок во внешней вкладке.</span></div><a class="primary" href="${escapeHtml(s.video)}" target="_blank" rel="noopener">Смотреть ↗</a></div>`;return `<div class="videoExternal card"><div class="videoExternalIcon">▶</div><div><b>Видео-урок для этой песни</b><span>Я не подставляю выдуманную ссылку. Откроется поиск tutorial по названию.</span></div><a class="primary" href="${escapeHtml(videoSearchUrl(s))}" target="_blank" rel="noopener">Открыть ↗</a></div>`}
function renderSong(){
  const s=songRuntime.song,mode=songRuntime.mode,unlock=songUnlockedStage(s),stage=songRuntime.stage,plan=songStageData(s,stage);
  const mastery=Math.min(100,Math.round(((state.songProgress?.[s.id]?.best||0)/Math.max(1,s.fragment.length))*100));
  $('#song').innerHTML=`${header(s.title,'songs',`${s.difficulty.toUpperCase()} · ${escapeHtml(s.author)}`)}
    <div class="songHero ${s.colorClass} card"><div class="songHeroIcon">${s.icon}</div><div class="songHeroText"><div class="songLevel">${s.difficulty} · ${s.category}</div><h2>${escapeHtml(s.title)}</h2><p>${escapeHtml(s.desc)}</p><div class="songMastery"><span>Освоение учебного проекта</span><i><b style="width:${mastery}%"></b></i><strong>${mastery}%</strong></div></div><button class="favoriteBtn ${((state.favorites||[]).includes(s.id))?'active':''}" id="favoriteSong">${((state.favorites||[]).includes(s.id))?'★':'☆'}</button></div>
    ${videoBlock(s)}
    <div class="card songTeacher">
      <div class="sectionKicker">ПОШАГОВОЕ ОБУЧЕНИЕ</div>
      <p class="teacherLead">Не бросаем тебя сразу в «сыграй песню». Сначала один звук, потом маленькая фраза, затем вторая рука и только после этого прогон.</p>
      <div class="songStageRail">${[0,1,2,3,4].map(i=>{const p=songStageData(s,i),locked=i>unlock,active=i===stage;return `<button class="songStage ${active?'active':''} ${i<=unlock?'open':'locked'}" ${locked?'disabled':''} data-song-stage="${i}"><i>${locked?'🔒':i+1}</i><b>${p.name}</b><small>${p.kind==='learn'?'узнать':p.kind==='right'?'мелодия':p.kind==='left'?'бас':'соединение'}</small></button>`}).join('')}</div>
      <div class="songModeTabs"><button class="pill ${mode==='part'?'active':''}" data-song-mode="part">▶ Учить по частям</button><button class="pill ${mode==='full'?'active':''}" data-song-mode="full">🎵 Играть целиком</button></div>
      <div id="songPanel"></div>
    </div>
    <div class="card midiPanel"><div><div class="sectionKicker">ТОЧНАЯ ВЕРСИЯ ПЕСНИ</div><p>Для реального полного разбора загрузишь MIDI своей версии. Тогда сайт использует настоящие ноты и их тайминг, а не делает вид, что короткий учебный пример — вся песня.</p></div><label class="fileBtn">Выбрать MIDI<input id="midiInput" type="file" accept=".mid,.midi" hidden></label></div>`;
  bindBack();
  $$('[data-song-mode]').forEach(b=>b.onclick=()=>{songRuntime.mode=b.dataset.songMode;renderSong()});
  $$('[data-song-stage]').forEach(b=>b.onclick=()=>{const i=+b.dataset.songStage;if(i<=songUnlockedStage(s)){const p=songStageData(s,i);songRuntime.stage=i;songRuntime.step=0;songRuntime.stageDone=false;songRuntime.seq=p.seq.slice();songRuntime.events=p.seq.map((note,j)=>({note,startMs:j*560}));songRuntime.mode='part';renderSong()}});
  $('#midiInput').onchange=onMidiFile;
  $('#favoriteSong').onclick=()=>{state.favorites=state.favorites||[];if(state.favorites.includes(s.id))state.favorites=state.favorites.filter(x=>x!==s.id);else state.favorites.push(s.id);save();renderSong()};
  renderSongPanel();
}
let songAudioToken=0;
function stopSongExample(){songAudioToken++;songRuntime.playAlong=false;}
function playSongExample(offsetMs=0){const token=++songAudioToken;const seq=songRuntime.loaded?songRuntime.events.map(x=>x.note):songRuntime.seq.slice();const times=songRuntime.loaded?songRuntime.events.map(x=>x.startMs):seq.map((_,i)=>i*560);const speed=(Number($('#songSpeed')?.value||80))/100;seq.forEach((m,i)=>{const delay=offsetMs+(times[i]||0)/speed;setTimeout(()=>{if(token!==songAudioToken)return;try{if(!oscillatorCtx)oscillatorCtx=new (window.AudioContext||window.webkitAudioContext)();playPianoNote(m,0,Math.max(1.4,1.7/speed),.56)}catch{}},delay)});toast('Эталон запущен','good')}
function startSongPlayAlong(){
  if(!songRuntime.loaded)return;
  stopSongExample();
  const speed=(Number($('#songSpeed')?.value||80))/100;
  songRuntime.speed=speed;songRuntime.step=0;songRuntime.playAlong=true;songRuntime.startedAt=performance.now()+1200;
  renderSongPanel();
  const countdown=[['3',0],['2',400],['1',800],['▶',1100]];
  countdown.forEach(([label,delay])=>setTimeout(()=>{if(songRuntime.playAlong)toast(delay<1000?label:'Играй!','good')},delay));
  playSongExample(1200);
}
function renderSongPanel(){const s=songRuntime.song,completed=songRuntime.step>=songRuntime.seq.length;const target=songRuntime.seq[Math.min(songRuntime.step,songRuntime.seq.length-1)];const full=songRuntime.mode==='full';$('#songPanel').innerHTML=full?renderFullSongPanel(s,target,completed):renderPartSongPanel(s,target,completed);$('#songNextStage')?.addEventListener('click',()=>{const s=songRuntime.song;if(songRuntime.stage<4){songRuntime.stage++;const p=songStageData(s,songRuntime.stage);songRuntime.seq=p.seq.slice();songRuntime.step=0;songRuntime.stageDone=false;state.songProgress=state.songProgress||{};const cur=state.songProgress[s.id]||{};state.songProgress[s.id]={...cur,stage:songRuntime.stage,best:Math.max(cur.best||0,Math.min(songRuntime.seq.length,songRuntime.seq.length))};save();renderSong()}});$('#songRestart')?.addEventListener('click',()=>{songRuntime.step=0;songRuntime.error=false;stopSongExample();renderSongPanel()});$('#songHear')?.addEventListener('click',()=>{if(target!=null)playTone(target)});$('#songPlayExample')?.addEventListener('click',()=>playSongExample());$('#songPlayAlong')?.addEventListener('click',()=>songRuntime.playAlong?stopSongExample():startSongPlayAlong());$('#songFullRestart')?.addEventListener('click',()=>{songRuntime.step=0;stopSongExample();renderSongPanel()});$('#songSpeed')?.addEventListener('input',e=>{$('#songSpeedValue').textContent=`${e.target.value}%`;songRuntime.speed=Number(e.target.value)/100});}
function songCoachSteps(songRuntime){const loaded=songRuntime.loaded;return `<div class="songCoachSteps"><div class="songCoachStep active"><i>1</i><b>Узнай</b><span>Название ноты написано крупно.</span></div><div class="songCoachStep"><i>2</i><b>Послушай</b><span>Можно услышать эталон на фортепианном тембре.</span></div><div class="songCoachStep"><i>3</i><b>Сыграй</b><span>Микрофон проверяет именно твой звук.</span></div>${loaded?'<div class="songCoachStep"><i>4</i><b>Соедини</b><span>После ноты откроется следующая по времени.</span></div>':''}</div>`}
function renderPartSongPanel(s,target,completed){const stepNo=Math.min(songRuntime.step+1,songRuntime.seq.length);return `<div class="songLesson cardInner"><div class="songStatus"><div><span class="microLabel">ФРАГМЕНТ · ШАГ ${stepNo} ИЗ ${songRuntime.seq.length}</span><h3>${completed?'Фрагмент готов!':'Сейчас работаем только с одной нотой'}</h3></div><span class="statusEmoji">${completed?'✓':'♪'}</span></div>${songCoachSteps(songRuntime)}${completed?`<div class="feedback goodBig"><b>Этап «${escapeHtml(songStageData(s,songRuntime.stage).name)}» готов.</b><small>${songRuntime.stage<4?'Следующий этап откроется после этой проверки.':'Все этапы учебного проекта пройдены.'}</small></div><div class="actionRow"><button class="primary" id="songRestart">↻ Пройти ещё раз</button><button class="secondary" id="songPlayExample">▶ Пример</button>${songRuntime.stage<4?'<button class="primary" id="songNextStage">Следующий этап →</button>':''}</div>`:`<div class="targetCard songTargetCard"><div class="songNowBadge">СЕЙЧАС</div><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${noteText(target)}</span><b>Сыграй на синтезаторе</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}<div class="targetHint">Сначала найди ноту, потом сыграй. Неверная нота не двигает тебя дальше.</div></div><div id="songFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteName(target)}.`)}</div><div class="actionRow"><button class="secondary" id="songHear">🔊 Послушать</button><button class="ghostBtn" id="songRestart">↻ С начала</button></div>`}</div>`}
function renderFullSongPanel(s,target,completed){const loaded=songRuntime.loaded;return `<div class="songLesson cardInner"><div class="fullIntro"><div class="bigRound">${completed?'✓':'♪'}</div><div><span class="microLabel">${loaded?'ТВОЙ MIDI':'УЧЕБНЫЙ ПРОГОН'}</span><h3>${completed?'Прогон завершён':loaded?'Играем по реальному таймингу MIDI':'Пробный прогон фрагмента'}</h3><p>${loaded?'Здесь последовательность, высоты и время берутся из твоего MIDI. Скорость можно изменить, а эталон можно прослушать.':'Без MIDI приложение сознательно не притворяется полной транскрипцией песни: здесь используется короткий учебный фрагмент. Полную твою версию можно загрузить ниже.'}</p></div></div>${completed?`<div class="feedback goodBig"><b>Прогон завершён.</b><small>${loaded?'Теперь попробуй тот же фрагмент медленнее или на большей скорости.':'Это был учебный демо-фрагмент песни.'}</small></div><div class="actionRow"><button class="primary" id="songFullRestart">↻ Ещё один прогон</button><button class="secondary" id="songPlayExample">▶ Эталон</button></div>`:`<div class="targetCard"><div class="songNowBadge">${loaded?'СЛЕДУЮЩАЯ НОТА':'УЧЕБНАЯ ЦЕЛЬ'}</div><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${noteText(target)}</span><b>${loaded?`Нота ${songRuntime.step+1} из ${songRuntime.seq.length}`:'Шаг за шагом'}</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}<div id="songFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteName(target)}.`)}</div></div><div class="songSpeed"><span>Скорость</span><input id="songSpeed" type="range" min=50 max=120 value=80><b id="songSpeedValue">80%</b></div>${loaded?`<button class="primary full playAlongBtn" id="songPlayAlong">${songRuntime.playAlong?'■ Остановить режим «вместе»':'▶ Играть вместе с эталоном'}</button>`:''}<div class="actionRow"><button class="secondary" id="songHear">🔊 Эталон</button><button class="ghostBtn" id="songFullRestart">↻ С начала</button></div>`}</div>`}
function handleSongDetected(m){
  const st=songRuntime;
  if(!st||st.step>=st.seq.length)return;
  const target=st.seq[st.step];
  let timingText='',timingOk=true;
  if(st.playAlong&&st.loaded){
    const speed=st.speed||.8;
    const expected=(st.events[st.step]?.startMs||0)/speed;
    const elapsed=performance.now()-st.startedAt;
    const delta=elapsed-expected;
    timingOk=Math.abs(delta)<=520;
    timingText=delta<-120?'Чуть раньше':delta>120?'Чуть позже':'Точно в пульс';
  }
  if(m===target&&timingOk){
    flashKeys([m],true);
    markActive();
    st.step++;
    state.songProgress=state.songProgress||{};
    const prev=state.songProgress[st.song.id]||{};
    const best=Math.max(Number(prev.best)||0,st.step);
    let unlockedStage=Number(prev.stage)||0;
    if(!st.loaded&&st.mode==='part'&&st.step>=st.seq.length) unlockedStage=Math.max(unlockedStage,Math.min(4,st.stage+1));
    state.songProgress[st.song.id]={...prev,best,stage:unlockedStage};
    save();
    if(st.step===st.seq.length){
      st.playAlong=false;
      if(!st.loaded&&st.mode==='part'&&st.stage<4)toast(`Этап «${songStageData(st.song,st.stage).name}» готов · следующий открыт`,'good');
      else toast('Фрагмент готов','good');
    }else toast(st.playAlong?timingText:'Верно!','good');
    if(st.step===st.seq.length&&st.mode==='part'&&st.stage<4){renderSong();return}
    renderSongPanel();
  }else{
    flashKeys([m],false);
    $('#songFeedback').innerHTML=feedbackMarkup('bad',m===target?'По времени чуть мимо':'Попробуй ещё',m===target?`${timingText}. Нота правильная, но сыграй ближе к моменту.`:`Услышана ${noteText(m)}. Сейчас нужна ${noteText(target)}.`);
  }
}

async function onMidiFile(e){const f=e.target.files?.[0];if(!f)return;try{const buf=await f.arrayBuffer();const notes=parseMidi(buf);if(!notes.length)throw new Error();const picked=notes.slice(0,1600);songRuntime.seq=picked.map(x=>x.note);songRuntime.events=picked;songRuntime.step=0;songRuntime.loaded=true;songRuntime.mode='full';toast(`Загружено ${songRuntime.seq.length} нот`);renderSong()}catch{toast('Не удалось прочитать этот MIDI','bad')}}
function readVarLen(dv,p,end){let value=0,b=0;do{if(p>=end)throw new Error();b=dv.getUint8(p++);value=(value<<7)|(b&0x7f)}while(b&0x80);return{value,next:p}}
function parseMidi(buffer){
  const dv=new DataView(buffer);let p=0;if(dv.byteLength<14||dv.getUint32(0)!==0x4d546864)throw new Error('bad midi');const headerLen=dv.getUint32(4);const tracks=dv.getUint16(10);const rawDivision=dv.getUint16(12);const division=(rawDivision&0x8000)?96:rawDivision;p=8+headerLen;const allTempo=[{tick:0,us:500000}],events=[];
  for(let t=0;t<tracks;t++){
    if(p+8>dv.byteLength||dv.getUint32(p)!==0x4d54726b)break;p+=4;const len=dv.getUint32(p);p+=4;const end=Math.min(p+len,dv.byteLength);let tick=0,status=0;
    while(p<end){const vr=readVarLen(dv,p,end);tick+=vr.value;p=vr.next;if(p>=end)break;let st=dv.getUint8(p);if(st&0x80){status=st;p++}else st=status;const type=st>>4;
      if(type===0x8||type===0x9){if(p+2>end)break;const note=dv.getUint8(p++),vel=dv.getUint8(p++);if(type===0x9&&vel>0)events.push({tick,note,vel,channel:st&15});}
      else if(type===0xA||type===0xB||type===0xE)p+=2;else if(type===0xC||type===0xD)p+=1;else if(type===0xF){if(p>=end)break;const meta=dv.getUint8(p++);const vr2=readVarLen(dv,p,end);p=vr2.next;if(meta===0x51&&vr2.value===3&&p+3<=end){const us=(dv.getUint8(p)<<16)|(dv.getUint8(p+1)<<8)|dv.getUint8(p+2);allTempo.push({tick,us})}p+=vr2.value;if(meta===0x2f)p=end;}else break;
    }
  }
  events.sort((a,b)=>a.tick-b.tick||a.note-b.note);allTempo.sort((a,b)=>a.tick-b.tick);function tickToMs(t){let ms=0,prevTick=0,us=allTempo[0].us;for(const te of allTempo.slice(1)){if(te.tick>=t)break;ms+=(te.tick-prevTick)*us/(division||96)/1000;prevTick=te.tick;us=te.us;}ms+=(t-prevTick)*us/(division||96)/1000;return ms}
  const out=[],seen=new Set();for(const e of events){const key=`${e.tick}:${e.note}`;if(seen.has(key))continue;seen.add(key);out.push({note:e.note,startMs:tickToMs(e.tick)})}return out;
}

async function micPermission(){try{return await navigator.permissions?.query({name:'microphone'})}catch{return null}}
async function refreshMicPermissionLabel(){const el=$('#micPermission');if(!el)return;if(!window.isSecureContext){el.textContent='Микрофон работает только на защищённой странице HTTPS.';el.className='permissionHint bad';return}const p=await micPermission();if(p?.state==='denied'){el.textContent='Браузер сейчас блокирует микрофон. Нажми значок замка/настроек сайта в адресной строке → Микрофон → Разрешить, затем обнови страницу.';el.className='permissionHint bad';}else if(p?.state==='granted'){el.textContent='Разрешение уже выдано. Можно начинать урок.';el.className='permissionHint good';}else{el.textContent='Нажатие кнопки вызовет стандартный запрос браузера на доступ к микрофону.';el.className='permissionHint';}}
async function startMic(){
  if(mic.stream){toast('Микрофон уже подключён','good');return}
  if(!window.isSecureContext){toast('Открой сайт по HTTPS для доступа к микрофону','bad');return}
  if(!navigator.mediaDevices?.getUserMedia){toast('Браузер не поддерживает микрофон','bad');return}
  const p=await micPermission();if(p?.state==='denied'){toast('Микрофон заблокирован настройками сайта','bad');await refreshMicPermissionLabel();return}
  try{
    mic.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,channelCount:1}});
    mic.ctx=new (window.AudioContext||window.webkitAudioContext)();if(mic.ctx.state==='suspended')await mic.ctx.resume();mic.source=mic.ctx.createMediaStreamSource(mic.stream);mic.analyser=mic.ctx.createAnalyser();mic.analyser.fftSize=8192;mic.analyser.smoothingTimeConstant=.04;mic.source.connect(mic.analyser);mic.freq=new Float32Array(mic.analyser.frequencyBinCount);mic.lastMidi=null;mic.candidateMidi=null;mic.candidateSince=0;mic.lastDispatch=0;mic.lastSeen=0;micLoop();toast('Микрофон подключён','good');render();
  }catch(e){stopMic();if(e?.name==='NotAllowedError')toast('Запрос отклонён. Разреши микрофон в настройках сайта.','bad');else if(e?.name==='NotFoundError')toast('Микрофон не найден','bad');else toast('Не удалось подключить микрофон','bad');await refreshMicPermissionLabel();}
}
function stopMic(){if(mic.raf)cancelAnimationFrame(mic.raf);mic.stream?.getTracks().forEach(t=>t.stop());try{mic.ctx?.close()}catch{};mic={stream:null,ctx:null,source:null,analyser:null,freq:null,raf:0,lastMidi:null,candidateMidi:null,candidateSince:0,lastDispatch:0,lastSeen:0,lastChordSig:'',lastChordDispatch:0,ignoreScalarUntil:0};render()}

function detectPitch(buf,sr){
  let mean=0;
  for(let i=0;i<buf.length;i++)mean+=buf[i];
  mean/=buf.length;
  let rms=0;
  for(let i=0;i<buf.length;i++){const x=buf[i]-mean;rms+=x*x;}
  rms=Math.sqrt(rms/buf.length);
  if(rms<0.006)return null;

  const minFreq=32,maxFreq=1800;
  const minLag=Math.floor(sr/maxFreq),maxLag=Math.min(Math.floor(sr/minFreq),buf.length-2);
  let bestLag=-1,best=-1;
  const step=1;
  for(let lag=minLag;lag<=maxLag;lag+=step){
    let sum=0,energyA=0,energyB=0;
    const n=buf.length-lag;
    for(let i=0;i<n;i+=2){
      const a=buf[i]-mean,b=buf[i+lag]-mean;
      sum+=a*b;energyA+=a*a;energyB+=b*b;
    }
    const corr=sum/Math.sqrt((energyA*energyB)||1);
    if(corr>best){best=corr;bestLag=lag;}
  }
  if(bestLag<0||best<0.72)return null;

  let refined=bestLag;
  if(bestLag>minLag&&bestLag<maxLag){
    const corrAt=(lag)=>{
      let sum=0,ea=0,eb=0,n=buf.length-lag;
      for(let i=0;i<n;i+=2){const a=buf[i]-mean,b=buf[i+lag]-mean;sum+=a*b;ea+=a*a;eb+=b*b;}
      return sum/Math.sqrt((ea*eb)||1);
    };
    const y1=corrAt(bestLag-1),y2=best,y3=corrAt(bestLag+1),den=(y1-2*y2+y3);
    if(Math.abs(den)>1e-7)refined=bestLag+0.5*(y1-y3)/den;
  }
  const freq=sr/refined;
  if(!Number.isFinite(freq)||freq<minFreq||freq>maxFreq)return null;

  // Piano attacks contain strong harmonics. Prefer a nearby fundamental if its
  // octave partner also has high correlation, reducing occasional octave-up errors.
  let chosen=freq;
  const tryFreqs=[freq/2,freq,freq*2];
  const valid=tryFreqs.filter(f=>f>=minFreq&&f<=maxFreq);
  for(const f of valid){
    const lag=Math.round(sr/f);
    let sum=0,ea=0,eb=0,n=buf.length-lag;
    for(let i=0;i<n;i+=2){const a=buf[i]-mean,b=buf[i+lag]-mean;sum+=a*b;ea+=a*a;eb+=b*b;}
    const c=sum/Math.sqrt((ea*eb)||1);
    if(c>=best-0.035 && f<chosen*1.02){chosen=f;}
  }
  const exact=69+12*Math.log2(chosen/440);
  const midi=Math.round(exact);
  const cents=(exact-midi)*100;
  return {midi,confidence:best,rms,cents};
}

function micLoop(){
  if(!mic.analyser)return;
  const buf=new Float32Array(mic.analyser.fftSize);mic.analyser.getFloatTimeDomainData(buf);const now=performance.now();
  const chordContext=(route==='practice'&&practiceState.tab==='chords')||(route==='lesson'&&runtime&&(runtime.type==='chord'||runtime.type==='song'&&runtime.songKind==='chord'));
  if(chordContext&&mic.freq){mic.analyser.getFloatFrequencyData(mic.freq);const poly=detectChordPitches(mic.freq,mic.ctx.sampleRate,mic.analyser.fftSize);if(poly.length>=2){const sig=poly.join(',');if(sig!==mic.lastChordSig||now-mic.lastChordDispatch>1000){mic.lastChordSig=sig;mic.lastChordDispatch=now;mic.ignoreScalarUntil=now+220;onChordDetected(poly);}}}
  const result=now<mic.ignoreScalarUntil?null:detectPitch(buf,mic.ctx.sampleRate);
  if(result){mic.lastSeen=now;if(result.midi===mic.candidateMidi){if(!mic.candidateSince)mic.candidateSince=now;const held=now-mic.candidateSince,repeatGap=now-mic.lastDispatch;if(held>=70&&(result.midi!==mic.lastMidi||repeatGap>850)){mic.lastMidi=result.midi;mic.lastDispatch=now;onDetected(result.midi,{rms:result.rms,confidence:result.confidence})}}else{mic.candidateMidi=result.midi;mic.candidateSince=now}}
  else if(mic.lastSeen&&now-mic.lastSeen>120){mic.candidateMidi=null;mic.candidateSince=0;mic.lastMidi=null}
  mic.raf=requestAnimationFrame(micLoop)
}
function detectChordPitches(freq,sr,fftSize){
  const candidates=[];const floor=-70;for(let m=45;m<=84;m++){const f0=440*Math.pow(2,(m-69)/12);let score=0,weight=0;for(let h=1;h<=5;h++){const f=f0*h;if(f>sr/2)break;const bin=Math.max(0,Math.min(freq.length-1,Math.round(f*fftSize/sr)));const db=freq[bin];const v=Math.max(0,db-floor);const w=1/Math.sqrt(h);score+=v*w;weight+=w}if(weight) candidates.push({m,score:score/weight})}
  candidates.sort((a,b)=>b.score-a.score);const out=[];for(const c of candidates){if(out.some(m=>pitchClass(m)===pitchClass(c.m)))continue;if(c.score<15)continue;if(out.length>=3)break;out.push(c.m)}
  if(out.length<2)return [];const top=candidates[0]?.score||0;if(!top||out.some(m=>(candidates.find(x=>x.m===m)?.score||0)<top*.45))return [];return out.sort((a,b)=>a-b);
}
function onChordDetected(notes){
  if(route==='lesson'&&runtime&&!runtime.passed&&(runtime.type==='chord'||runtime.type==='song'&&runtime.songKind==='chord')){handleChordDetected(notes);return}
  if(route==='practice'&&practiceState.tab==='chords'){handlePracticeChordDetected(notes);}
}

function autocorrDiff(buf,lag){let diff=0,n=0;for(let i=0;i<buf.length-lag;i+=2){const d=buf[i]-buf[i+lag];diff+=d*d;n++}return diff/(n||1)}

function renderCalendar(){
  const overlay=$('#calendarOverlay');if(!overlay)return;const days=state.activityDays||{};const now=new Date();now.setHours(12,0,0,0);const start=new Date(now);start.setDate(start.getDate()-83);while(start.getDay()!==1)start.setDate(start.getDate()-1);let cells='';const weekday=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];const months=[];for(let i=0;i<84;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=todayKeyFromDate(d);const count=days[key]||0;const level=count>=6?4:count>=4?3:count>=2?2:count?1:0;if(d.getDate()===1)months.push({text:d.toLocaleDateString('ru-RU',{month:'short'}),i});cells+=`<span class="calCell level-${level}" title="${escapeHtml(d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'}))}: ${count} ${plural(count,'активность','активности','активностей')}"></span>`}
  overlay.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="calendarDialog card" role="dialog" aria-modal="true" aria-label="Календарь активности"><div class="calendarHead"><div><div class="sectionKicker">АКТИВНОСТЬ</div><h2>Твой ритм занятий</h2><p>Каждый квадратик — день, когда ты действительно что-то сделал в приложении.</p></div><button class="backBtn" id="calendarClose">×</button></div><div class="calendarStats"><div><b>${state.streak}</b><span>дней подряд</span></div><div><b>${Object.keys(days).length}</b><span>активных дней</span></div><div><b>${state.xp}</b><span>XP</span></div></div><div class="calendarLabels">${weekday.map(x=>`<span>${x}</span>`).join('')}</div><div class="calendarMonths">${months.map(m=>`<span style="left:${(m.i/84)*100}%">${escapeHtml(m.text)}</span>`).join('')}</div><div class="calendarGrid">${cells}</div><div class="calendarLegend"><span>меньше</span><i class="level-0"></i><i class="level-1"></i><i class="level-2"></i><i class="level-3"></i><i class="level-4"></i><span>больше</span></div></div>`;
  overlay.className='calendarOverlay show';$('#calendarClose').onclick=()=>overlay.className='calendarOverlay';$('#calendarBackdrop').onclick=()=>overlay.className='calendarOverlay';
}

window.addEventListener('beforeunload',()=>{mic.stream?.getTracks().forEach(t=>t.stop());stopMetronome()});
$$('[data-nav]').forEach(b=>b.onclick=()=>go(b.dataset.nav));$('#brand').onclick=()=>go('home');$('#streak').onclick=()=>renderCalendar();
window.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=$('#calendarOverlay');if(o?.classList.contains('show'))o.className='calendarOverlay'}});

/* ========================= PIANO LEARNING V5 ========================= */

const V5_ACHIEVEMENTS = [
 {id:'first',icon:'🎹',title:'Первая нота',desc:'Завершить первый урок',ok:()=>completedCount()>=1},
 {id:'five',icon:'🌱',title:'Первые шаги',desc:'Завершить 5 уроков',ok:()=>completedCount()>=5},
 {id:'ten',icon:'🔥',title:'Разогрев',desc:'Завершить 10 уроков',ok:()=>completedCount()>=10},
 {id:'twenty',icon:'📚',title:'В ритме',desc:'Завершить 20 уроков',ok:()=>completedCount()>=20},
 {id:'thirty',icon:'🧠',title:'Читаю музыку',desc:'Завершить 30 уроков',ok:()=>completedCount()>=30},
 {id:'fortyfive',icon:'↗️',title:'Чувствую расстояние',desc:'Завершить 45 уроков',ok:()=>completedCount()>=45},
 {id:'chords',icon:'⌬',title:'Аккорд за аккордом',desc:'Завершить 60 уроков',ok:()=>completedCount()>=60},
 {id:'scale',icon:'≈',title:'По ступенькам',desc:'Завершить 72 урока',ok:()=>completedCount()>=72},
 {id:'technique',icon:'✋',title:'Контроль',desc:'Завершить 82 урока',ok:()=>completedCount()>=82},
 {id:'hands',icon:'⇄',title:'Две руки',desc:'Дойти до 92 урока',ok:()=>completedCount()>=92},
 {id:'music',icon:'🎼',title:'Музыкальность',desc:'Дойти до 100 урока',ok:()=>completedCount()>=100},
 {id:'course',icon:'👑',title:'Финальный аккорд',desc:'Завершить все 115 уроков',ok:()=>completedCount()>=115},
 {id:'xp100',icon:'⚡',title:'100 XP',desc:'Набрать 100 XP',ok:()=>state.xp>=100},
 {id:'xp500',icon:'💎',title:'500 XP',desc:'Набрать 500 XP',ok:()=>state.xp>=500},
 {id:'xp1000',icon:'🏅',title:'1000 XP',desc:'Набрать 1000 XP',ok:()=>state.xp>=1000},
 {id:'day3',icon:'🔥',title:'Три дня',desc:'Заниматься 3 дня',ok:()=>Object.keys(state.activityDays||{}).length>=3},
 {id:'day7',icon:'🗓️',title:'Неделя',desc:'Заниматься 7 дней',ok:()=>Object.keys(state.activityDays||{}).length>=7},
 {id:'day14',icon:'🌟',title:'Две недели',desc:'Заниматься 14 дней',ok:()=>Object.keys(state.activityDays||{}).length>=14},
 {id:'song1',icon:'🎵',title:'Первая песня',desc:'Завершить первый этап песни',ok:()=>Object.values(state.songProgress||{}).some(v=>(v?.best||0)>0)},
 {id:'songs3',icon:'🎶',title:'Три мелодии',desc:'Потренироваться с 3 песнями',ok:()=>Object.keys(state.songProgress||{}).filter(k=>(state.songProgress[k]?.best||0)>0).length>=3},
 {id:'favorite',icon:'❤️',title:'Любимые',desc:'Добавить песню в избранное',ok:()=>Array.isArray(state.favorites)&&state.favorites.length>=1},
 {id:'mistake',icon:'🛠️',title:'Не сдался',desc:'Исправить ошибку и пройти дальше',ok:()=>Object.keys(state.mistakes||{}).length>=1 && completedCount()>=2},
 {id:'chordpractice',icon:'🎹',title:'Три сразу',desc:'Потренироваться с аккордами',ok:()=>Number(state.stats?.chords||0)>=1},
 {id:'earpractice',icon:'👂',title:'Слушаю',desc:'Ответить в тренировке слуха',ok:()=>Number(state.stats?.ear||0)>=1},
 {id:'tuner',icon:'🎯',title:'Точно в центр',desc:'Поймать ноту тюнером',ok:()=>Number(state.stats?.tuner||0)>=1},
 {id:'fiveOctaves',icon:'🌈',title:'Пять регистров',desc:'Сыграть ноты в 1–5 октавах',ok:()=>Object.keys(state.octavesSeen||{}).length>=5},
 {id:'perfect10',icon:'✨',title:'Чистая серия',desc:'Пройти 10 целей без ошибки',ok:()=>Number(state.stats?.perfectRun||0)>=10},
 {id:'speed',icon:'⚡',title:'Без паузы',desc:'Пройти короткую последовательность быстро',ok:()=>Number(state.stats?.fastRun||0)>=1},
 {id:'night',icon:'🌙',title:'Поздняя репетиция',desc:'Потренироваться после 22:00',ok:()=>Number(state.stats?.night||0)>=1},
 {id:'hidden',icon:'🔮',title:'Скрытый маршрут',desc:'Секретное достижение',ok:()=>Number(state.stats?.hidden||0)>=1,hidden:true}
];

function v5Stats(){state.stats=state.stats||{};state.octavesSeen=state.octavesSeen||{};return state.stats}
function achievementList(){return V5_ACHIEVEMENTS.map(a=>({...a,ok:!!a.ok()}))}
function openAchievementModal(){
 const overlay=$('#calendarOverlay');if(!overlay)return;
 const list=achievementList(),done=list.filter(a=>a.ok).length;
 overlay.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="achievementDialog card" role="dialog" aria-modal="true"><div class="calendarHead"><div><div class="sectionKicker">ДОСТИЖЕНИЯ · ${done}/${list.length}</div><h2>Твои победы</h2><p>Часть значков скрыта до выполнения условия — как в играх.</p></div><button class="backBtn" id="achClose">×</button></div><div class="achievementGrid">${list.map(a=>`<div class="achievement ${a.ok?'unlocked':''} ${a.hidden?'hiddenAchievement':''}"><span>${a.ok?a.icon:'🔒'}</span><div><b>${a.ok?a.title:'Скрытое достижение'}</b><small>${a.ok?a.desc:'Условие откроется после выполнения.'}</small></div><i>${a.ok?'✓':'?'}</i></div>`).join('')}</div></div>`;
 overlay.className='calendarOverlay show';$('#achClose').onclick=()=>overlay.className='calendarOverlay';$('#calendarBackdrop').onclick=()=>overlay.className='calendarOverlay';
}
function userLevel(){return Math.max(1,Math.floor((Number(state.xp)||0)/100)+1)}
function levelProgress(){return (Number(state.xp)||0)%100}
function openLevelModal(){
 const overlay=$('#calendarOverlay');if(!overlay)return;const lvl=userLevel();
 const rows=Array.from({length:25},(_,i)=>{const n=i+1,need=(n-1)*100,open=state.xp>=need;return `<div class="levelRow ${n===lvl?'current':''} ${open?'open':''}"><span>${open?'✓':'🔒'}</span><b>${n}</b><div><strong>Уровень ${n}</strong><small>${need} XP · ${n%5===0?'особая отметка':'новый уровень'}</small></div></div>`}).join('');
 overlay.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="levelDialog card"><div class="calendarHead"><div><div class="sectionKicker">УРОВНИ</div><h2>Путь до 25 уровня</h2><p>Каждые 100 XP открывают следующий уровень.</p></div><button class="backBtn" id="levelClose">×</button></div><div class="levelCurrent"><b>Уровень ${lvl}</b><span>${state.xp} XP · ${levelProgress()}/100 до следующего</span></div><div class="levelList">${rows}</div></div>`;
 overlay.className='calendarOverlay show';$('#levelClose').onclick=()=>overlay.className='calendarOverlay';$('#calendarBackdrop').onclick=()=>overlay.className='calendarOverlay';
}
function renderHome(){
 const done=completedCount(),next=nextLesson()||COURSE_SIZE,lvl=userLevel(),pct=levelProgress(),ach=achievementList().filter(a=>a.ok).length,days=Object.keys(state.activityDays||{}).length;
 const module=moduleFor(next), micReady=!!mic.stream;
 $('#home').innerHTML=`<div class="homeHero v5Hero"><div class="heroTopline"><span class="heroBadge">✦</span><span class="microLabel">PIANO LEARNING · УРОВЕНЬ ${lvl}</span></div><div class="eyebrow">115 последовательных уроков</div><h1>Играй.<br><em>Понимай.</em><br>Становись лучше.</h1><p>Каждый урок даёт одну новую идею, короткую практику и понятный результат. Никаких повторяющихся простыней текста.</p><div class="heroActions"><button class="primary" id="homeStart">▶ ${done?'Продолжить курс':'Начать курс'}</button><button class="secondary" id="homeMic">${micReady?'✓ Микрофон подключён':'🎙 Подключить микрофон'}</button></div><div class="statusLine ${micReady?'ok':''}"><span class="statusDot"></span>${micReady?'Микрофон готов — можно играть на настоящем инструменте.':'Для уроков с проверкой звука подключи микрофон телефона.'}</div></div>
 <div class="dashboardGrid"><button class="levelCard card clickable" id="openLevel"><div class="dashIcon">⭐</div><div><div class="sectionKicker">УРОВЕНЬ</div><b>${lvl}</b><small>${state.xp} XP · ${100-pct} до следующего</small></div><div class="miniProgress"><i style="width:${pct}%"></i></div></button><button class="miniFeature card clickable" id="openAchievements"><span>🏆</span><div><b>Достижения</b><small>${ach} из ${V5_ACHIEVEMENTS.length} открыто</small></div><strong>›</strong></button></div>
 <button class="nextLessonCard clickable" id="continueCard"><div class="nextIcon">${module.icon}</div><div><div class="microLabel">СЛЕДУЮЩИЙ УРОК · ${next}</div><h2>${escapeHtml(LESSON_TITLES[next-1])}</h2><p>${escapeHtml(module.name)} · +${xpFor(next)} XP</p></div><span class="arrow">›</span></button>
 <div class="progressCard card"><div class="progressTop"><span>Прогресс курса</span><b>${done} / ${COURSE_SIZE}</b></div><div class="progressTrack"><i style="width:${done/COURSE_SIZE*100}%"></i></div><div class="progressMeta"><span>${state.xp} XP всего</span><span>${days} активных дней</span><button id="openCalendarInline">📅 Календарь</button></div></div>
 <div class="homeTiles"><button class="tile clickable" data-go="course"><span>▦</span><b>Курс</b><small>10 этапов · 115 уроков</small></button><button class="tile clickable" data-go="practice"><span>◎</span><b>Практика</b><small>Ноты · аккорды · слух · тюнер</small></button><button class="tile clickable" data-go="songs"><span>♪</span><b>Песни</b><small>${SONGS.length} учебных проектов</small></button></div>
 <div class="weekCard card"><div class="sectionKicker">АКТИВНОСТЬ</div><div class="weekTitle"><b>Твоя неделя</b><button id="openCalendarWeek">Открыть календарь</button></div><div class="weekDots">${Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const k=todayKeyFromDate(d);const c=state.activityDays?.[k]||0;return `<div><span class="weekDot ${c?'active':''}"></span><small>${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][d.getDay()===0?6:d.getDay()-1]}</small></div>`}).join('')}</div></div>`;
 $('#homeStart').onclick=()=>openLesson(next);$('#homeMic').onclick=startMic;$('#openLevel').onclick=openLevelModal;$('#openAchievements').onclick=openAchievementModal;$('#continueCard').onclick=()=>openLesson(next);$('#openCalendarInline').onclick=renderCalendar;$('#openCalendarWeek').onclick=renderCalendar;$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
}

function octave(m){return Math.floor(m/12)-1}
function noteText(m){return `${noteName(m)}, ${octave(m)} октава`}
function v5OctaveTargets(pcList, n){
 const oct=[1,2,3,4,5],out=[];for(let i=0;i<n;i++){const pc=pcList[i%pcList.length],o=oct[i%oct.length];out.push(12*(o+1)+pc)}return out;
}
function lessonStepsFor(n){
 const pcs=[0,2,4,5,7,9,11], base=v5OctaveTargets(pcs,8);
 const low=[24,26,28,29,31,33,35,31],mid=[48,50,52,53,55,53,52,50],high=[72,74,76,77,79,77,76,74];
 if(n<=10)return n===1?[60]:v5OctaveTargets(pcs,Math.min(8,3+(n%5)));
 if(n<=35)return (n%3===0?low:mid).slice(0,6+(n%3));
 if(n<=45)return [48+(n%7),52+(n%5),55+(n%4),60+(n%3)];
 if(n>=61&&n<=72)return [24,26,28,29,31,33,35,36];
 if(n>=73&&n<=92)return (n%2?mid:high).slice(0,6);
 return base;
}
const buildLessonOriginal=buildLesson;
function buildLessonV5(n){
 const r=buildLessonOriginal(n);if(!r)return r;
 r.steps=lessonStepsFor(n);
 if(n===1){r.anyOctave=true;r.theory='Октава — это расстояние от одной ноты до следующей такой же выше или ниже. Например, ДО повторяется через одну октаву.';r.tip='Найди любое ДО на своём пятиоктавном синтезаторе. Для первого урока октава не важна.'}
 else {r.anyOctave=false;r.theory=(r.theory||'')+' В этом уроке приложение проверяет и название ноты, и указанную октаву.'}
 if(n===2){r.theory='Белые клавиши дают семь основных нот. Чёрные клавиши расположены группами по две и по три — это главные ориентиры.';r.tip='Найди две чёрные клавиши: ДО находится сразу слева от первой из них.'}
 return r;
}


function targetMatches(r,m,target){if(r.anyOctave)return pitchClass(m)===pitchClass(target);return m===target}
function handleSequenceDetected(m){const r=runtime;if(r.passed||r.sequenceDone)return;const target=r.steps[r.step];flashKeys([m],targetMatches(r,m,target));markOctaveSeen(m);if(targetMatches(r,m,target)){r.step++;r.errors=0;v5Stats().perfectRun=(v5Stats().perfectRun||0)+1;if(v5Stats().perfectRun>=10)save();if(r.step>=r.steps.length&&r.type==='musical'){r.sequenceDone=true;setLessonFeedback('good','Фраза готова','Теперь короткая самопроверка.');setTimeout(renderLesson,300);return}setLessonFeedback('good','Верно!',r.step<r.steps.length?`Следующая цель: ${noteText(r.steps[r.step])}.`:'Последняя нота!');if(r.step>=r.steps.length){r.passed=true;completeLesson(r.n);setTimeout(()=>renderLessonComplete(r),360)}else setTimeout(renderLesson,360)}else{r.errors++;v5Stats().perfectRun=0;state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();setLessonFeedback('bad','Не та нота',r.anyOctave?`Услышана ${noteText(m)}. Нужна ${noteName(target)} в любой октаве.`:`Услышана ${noteText(m)}. Сейчас нужна ${noteText(target)}.`)}}
function markOctaveSeen(m){const o=octave(m);if(o>=1&&o<=5){v5Stats();state.octavesSeen[o]=true;save()}}

function renderLesson(){
 const r=runtime;if(!r)return;const total=r.type==='chord'?r.rounds:r.type==='chordEar'?r.earRounds.length:r.type==='interval'?r.pairs.length*2:r.steps.length;const progress=r.type==='interval'?Math.min(r.step,total):r.type==='chordEar'?Math.min(r.earRound,total):r.step;r.lessonPage=r.lessonPage||1;
 const theory=theoryForDisplay(r);
 const page1=`<div class="lessonPageCard card"><div class="pageKicker">1 · ПОНЯТЬ</div><h2>${escapeHtml(theory.title)}</h2><p>${escapeHtml(theory.body)}</p><div class="lessonVisual">${r.n===1?`<div class="octaveVisual"><span>ДО</span><i>→</i><span>ДО</span><b>+ 1 октава</b></div>`:`<div class="ideaIcon">${r.module.icon}</div>`}</div><div class="lessonTip"><b>Главное</b><span>${escapeHtml(r.tip)}</span></div><button class="primary full" id="lessonNextPage">Перейти к практике →</button></div>`;
 const page2=`<div class="lessonPageCard card"><div class="pageKicker">2 · СЫГРАТЬ</div><div class="lessonMiniHead"><span>${progress}/${total}</span><b>${r.anyOctave?'Октава не важна':'Проверяем точную ноту'}</b></div>${r.type==='setup'?renderSetupTask(r):r.type==='rhythm'?renderRhythmTask(r):r.type==='interval'?renderIntervalTask(r):r.type==='chord'?renderChordTask(r):r.type==='chordEar'?renderChordEarTask(r):r.type==='musical'?renderMusicalTask(r):r.type==='song'?renderSongCourseTask(r):renderSequenceTask(r)}</div>`;
 const page3=`<div class="lessonPageCard card"><div class="pageKicker">3 · ЗАКРЕПИТЬ</div><h2>${r.passed?'Готово!':'Когда закончишь практику'}</h2><p>${r.passed?'Ты закрепил эту тему. Следующий урок откроется автоматически.':'После правильного выполнения здесь появится результат.'}</p><div class="resultPreview ${r.passed?'done':''}"><span>${r.passed?'✓':'○'}</span><div><b>${r.passed?'Урок пройден':'Практика ещё идёт'}</b><small>${r.passed?`+${xpFor(r.n)} XP · можно двигаться дальше`:'Вернись на страницу практики и сыграй цель.'}</small></div></div>${r.passed?`<button class="primary full" id="nextLessonBtn">Следующий урок →</button>`:''}<button class="ghostBtn full" id="restartLesson">↻ Начать урок заново</button></div>`;
 const pages=[page1,page2,page3];
 $('#lesson').innerHTML=`<div class="lessonHeader"><button class="backBtn" data-back="course">‹</button><div class="lessonHeadText"><div class="microLabel">УРОК ${r.n} · ${escapeHtml(lessonKindType(r.type))}</div><div class="miniProgress"><i style="width:${Math.min(100,progress/Math.max(total,1)*100)}%"></i></div><small>${Math.min(progress+1,total)} из ${total}</small></div><button class="iconAction" id="lessonSound">🔊</button></div><div class="lessonTitleBlock"><div class="lessonIcon">${r.module.icon}</div><div><div class="eyebrow">${escapeHtml(r.module.name)}</div><h1>${escapeHtml(r.title)}</h1><p>${escapeHtml(r.objective)}</p></div></div><div class="lessonPager">${pages.map((_,i)=>`<button class="pagerDot ${r.lessonPage===i+1?'active':''}" data-page="${i+1}"><span>${i+1}</span>${['Понять','Сыграть','Закрепить'][i]}</button>`).join('')}</div><div class="lessonPages">${pages.map((p,i)=>`<div class="lessonPage ${r.lessonPage===i+1?'active':''}" data-page-view="${i+1}">${p}</div>`).join('')}</div>`;
 bindBack();$('#lessonSound').onclick=()=>playTarget(r);$$('[data-page]').forEach(b=>b.onclick=()=>{r.lessonPage=+b.dataset.page;renderLesson()});$('#lessonNextPage')?.addEventListener('click',()=>{r.lessonPage=2;renderLesson()});$('#nextLessonBtn')?.addEventListener('click',()=>openLesson(Math.min(COURSE_SIZE,r.n+1)));$('#restartLesson').onclick=()=>{r.step=0;r.errors=0;r.passed=false;r.lessonPage=1;r.sequenceDone=false;r.chordRound=0;r.intervalPhase=0;r.heardChord=[];r.earAnswered=false;renderLesson()};
 if(r.lessonPage===2){if(r.type==='setup')bindSetup(r);else if(r.type==='rhythm')bindRhythm(r);else if(r.type==='interval')bindInterval(r);else if(r.type==='chord')bindChord(r);else if(r.type==='chordEar')bindChordEar(r);else if(r.type==='musical')bindMusical(r);else if(r.type==='song')bindSongCourse(r);else bindSequence(r)}
}

function renderPractice(){
 const tab=practiceState.tab||'notes';
 $('#practice').innerHTML=`${header('Практика','home','ТРЕНИРОВКА')}<div class="practiceTabs">${[['notes','Ноты'],['chords','Аккорды'],['ear','Слух'],['tuner','Тюнер'],['weak','Слабые места']].map(x=>`<button class="practiceTab ${tab===x[0]?'active':''}" data-practice="${x[0]}">${x[1]}</button>`).join('')}</div><div class="practiceExplain card"><b>${tab==='tuner'?'Тюнер — это проверка высоты звука.':tab==='chords'?'Аккорды — несколько нот одновременно.':tab==='ear'?'Здесь тренируется слух без подсказки названия.':tab==='weak'?'Здесь повторяются места, где были ошибки.':'Играешь ноту на синтезаторе — микрофон определяет её высоту.'}</b><span>${tab==='tuner'?'Сыграй одну ноту и смотри, насколько она выше или ниже точного центра.':tab==='chords'?'Нажми три ноты вместе или почти одновременно — приложение сравнит набор звуков.':tab==='ear'?'Сначала слушай, потом отвечай.':'Для проверки октавы приложение учитывает регистр только там, где он указан.'}</span></div><div id="practiceContent"></div>`;
 $$('[data-practice]').forEach(b=>b.onclick=()=>{practiceState.tab=b.dataset.practice;renderPractice()});
 const box=$('#practiceContent');
 if(tab==='notes')box.innerHTML=renderPracticeNotesV5();else if(tab==='chords')box.innerHTML=renderPracticeChordsV5();else if(tab==='ear')box.innerHTML=renderPracticeEarV5();else if(tab==='tuner')box.innerHTML=renderTunerV5();else box.innerHTML=renderWeakV5();
 bindPracticeV5(tab);
}
function randomPracticeMidi(){const pcs=[0,2,4,5,7,9,11],o=[1,2,3,4,5];return 12*(o[Math.floor(Math.random()*o.length)]+1)+pcs[Math.floor(Math.random()*pcs.length)]}
function renderPracticeNotesV5(){const n=practiceState.note??randomPracticeMidi();practiceState.note=n;return `<div class="practiceCard card"><div class="practiceTarget"><span>СЕЙЧАС</span><b>${noteName(n)}</b><small>${noteText(n)}</small></div>${staffSvg([n],n,guessClef(n))}${keyboardHtml(n)}<div id="practiceFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteText(n)}.`)}</div><div class="actionRow"><button class="secondary" id="practiceHear">🔊 Эталон</button><button class="ghostBtn" id="practiceNew">Новая нота</button></div></div>`}
function renderPracticeChordsV5(){const c=practiceState.chord||{root:'до',type:'major',midi:chord('до','major')};practiceState.chord=c;return `<div class="practiceCard card"><div class="practiceTarget"><span>АККОРД</span><b>${c.root} ${CHORD_LABELS[c.type]}</b><small>${chordText(c.root,c.type)}</small></div>${keyboardHtml(c.midi[0],c.midi)}<div id="practiceFeedback">${feedbackMarkup('wait','Жду аккорд','Сыграй все три звука вместе или почти одновременно.')}</div><div class="actionRow"><button class="secondary" id="practiceChordHear">🔊 Эталон</button><button class="ghostBtn" id="practiceChordNew">Другой аккорд</button></div></div>`}
function renderPracticeEarV5(){const e=practiceState.ear||{root:['до','ре','ми','фа','соль','ля','си'][Math.floor(Math.random()*7)],type:Math.random()>.5?'major':'minor'};practiceState.ear=e;return `<div class="practiceCard card earPracticeCard"><div class="earHero"><div class="earPulse">◒</div><div><div class="sectionKicker">ТРЕНИРОВКА СЛУХА</div><h2>Какой это аккорд?</h2><p>Сначала послушай. Название не показывается до ответа.</p></div></div><button class="primary full" id="earPlay">▶ Послушать</button><div class="earChoices"><button class="choiceBtn" data-ear-answer="major">Мажор</button><button class="choiceBtn" data-ear-answer="minor">Минор</button></div><div id="earFeedback">${feedbackMarkup('wait','Готово','Нажми «Послушать», затем выбери вариант.')}</div></div>`}
function renderTunerV5(){return `<div class="tunerCard card"><div class="sectionKicker">ТЮНЕР</div><h2>Проверь, насколько точно звучит нота</h2><p>Сыграй одну ноту. Центр шкалы означает точную высоту, слева — ниже, справа — выше.</p><div class="tunerNote" id="tunerNote">—</div><div class="tunerOct" id="tunerOct">Жду звук</div><div class="tunerMeter"><i class="tunerNeedle" id="tunerNeedle" style="left:50%"></i></div><div class="tunerScale"><span>−50¢</span><span>−25¢</span><span>0</span><span>+25¢</span><span>+50¢</span></div><div class="tunerCents" id="tunerCents">—</div></div>`}
function renderWeakV5(){const arr=Object.entries(state.mistakes||{}).sort((a,b)=>b[1]-a[1]).slice(0,8);return `<div class="practiceCard card"><h2>Слабые места</h2><p class="teacherLead">Здесь показаны ноты, на которых было больше всего ошибок.</p>${arr.length?`<div class="weakList">${arr.map(([m,c])=>`<div class="weakRow"><span>${noteText(+m)}</span><b>${c} ошибок</b></div>`).join('')}</div>`:'<div class="emptyState"><b>Пока чисто</b><span>Ошибки появятся здесь после практики — это нормально.</span></div>'}</div>`}
function bindPracticeV5(tab){
 if(tab==='notes'){$('#practiceHear').onclick=()=>playPianoNote(practiceState.note,0,2,.95);$('#practiceNew').onclick=()=>{practiceState.note=randomPracticeMidi();renderPractice()}}
 if(tab==='chords'){$('#practiceChordHear').onclick=()=>playToneGroup(practiceState.chord.midi,.38);$('#practiceChordNew').onclick=()=>{const roots=['до','ре','ми','фа','соль','ля'];const root=roots[Math.floor(Math.random()*roots.length)],types=['major','minor'];const type=types[Math.floor(Math.random()*2)];practiceState.chord={root,type,midi:chord(root,type)};renderPractice()}}
 if(tab==='ear'){$('#earPlay').onclick=()=>{playToneGroup(chord(practiceState.ear.root,practiceState.ear.type),.4);};$$('[data-ear-answer]').forEach(b=>b.onclick=()=>{const ok=b.dataset.earAnswer===practiceState.ear.type;v5Stats().ear=(v5Stats().ear||0)+1;$('#earFeedback').innerHTML=feedbackMarkup(ok?'good':'bad',ok?'Верно':'Почти',ok?'Хорошо слышишь разницу.':'Правильный ответ: '+(practiceState.ear.type==='major'?'мажор':'минор'));if(ok)setTimeout(()=>{practiceState.ear=null;renderPractice()},650);save()})}
}

function detectPitch(buf,sr){
 let mean=0;for(let i=0;i<buf.length;i++)mean+=buf[i];mean/=buf.length;let rms=0;for(let i=0;i<buf.length;i++){const x=buf[i]-mean;rms+=x*x}rms=Math.sqrt(rms/buf.length);if(rms<0.008)return null;
 const minF=27.5,maxF=1400,minLag=Math.floor(sr/maxF),maxLag=Math.min(Math.floor(sr/minF),buf.length-2);let bestLag=-1,best=-1;
 for(let lag=minLag;lag<=maxLag;lag+=2){let sum=0,ea=0,eb=0,n=buf.length-lag;for(let i=0;i<n;i+=2){const a=buf[i]-mean,b=buf[i+lag]-mean;sum+=a*b;ea+=a*a;eb+=b*b}const c=sum/Math.sqrt((ea*eb)||1);if(c>best){best=c;bestLag=lag}}
 if(bestLag<0||best<0.68)return null;
 const corr=(lag)=>{let sum=0,ea=0,eb=0,n=buf.length-lag;for(let i=0;i<n;i+=2){const a=buf[i]-mean,b=buf[i+lag]-mean;sum+=a*b;ea+=a*a;eb+=b*b}return sum/Math.sqrt((ea*eb)||1)};
 let lag=bestLag;if(bestLag>minLag+1&&bestLag<maxLag-1){const y1=corr(bestLag-2),y2=corr(bestLag),y3=corr(bestLag+2),den=y1-2*y2+y3;if(Math.abs(den)>1e-7)lag=bestLag+(y1-y3)/(2*den)}
 const raw=sr/lag;const candidates=[raw/2,raw,raw*2].filter(f=>f>=minF&&f<=maxF);let chosen=raw,bestScore=-Infinity;
 for(const f of candidates){const l=Math.max(2,Math.round(sr/f));const c=corr(l);const penalty=f>raw?0.012:0;const score=c-penalty;if(score>bestScore){bestScore=score;chosen=f}}
 const midiExact=69+12*Math.log2(chosen/440),midi=Math.round(midiExact);return {midi,confidence:best,rms,cents:(midiExact-midi)*100,freq:chosen};
}

function renderTunerUpdate(result){const n=$('#tunerNote'),o=$('#tunerOct'),c=$('#tunerCents'),needle=$('#tunerNeedle');if(!n)return;const prev=n.dataset.midi;if(prev!==String(result.midi)){n.dataset.midi=String(result.midi);n.textContent=noteName(result.midi);o.textContent=`${octave(result.midi)} октава`;v5Stats().tuner=(v5Stats().tuner||0)+1;markOctaveSeen(result.midi);save()}const cents=Math.max(-50,Math.min(50,result.cents));needle.style.left=`${50+cents}%`;c.textContent=`${result.cents>0?'+':''}${result.cents.toFixed(1)}¢`}

// Keep the original microphone loop, but make octave handling and tuner updates explicit.
const originalMicLoop=micLoop;
micLoop=function(){
 if(!mic.analyser)return;const buf=new Float32Array(mic.analyser.fftSize);mic.analyser.getFloatTimeDomainData(buf);const now=performance.now();
 const result=detectPitch(buf,mic.ctx.sampleRate);
 if(result){mic.lastSeen=now;renderTunerUpdate(result);if(result.midi===mic.candidateMidi){if(!mic.candidateSince)mic.candidateSince=now;if(now-mic.candidateSince>=80&&result.midi!==mic.lastMidi){mic.lastMidi=result.midi;mic.lastDispatch=now;onDetected(result.midi,{rms:result.rms,confidence:result.confidence,cents:result.cents})}}else{mic.candidateMidi=result.midi;mic.candidateSince=now}}
 else if(mic.lastSeen&&now-mic.lastSeen>160){mic.candidateMidi=null;mic.candidateSince=0;mic.lastMidi=null}
 // Chord spectral detector runs less often to leave CPU for the single-note detector.
 if((route==='practice'&&practiceState.tab==='chords')||(route==='lesson'&&runtime&&(runtime.type==='chord'||runtime.type==='song'&&runtime.songKind==='chord'))){if(mic.freq){mic.analyser.getFloatFrequencyData(mic.freq);const poly=detectChordPitches(mic.freq,mic.ctx.sampleRate,mic.analyser.fftSize);if(poly.length>=2)onChordDetected(poly)}}
 mic.raf=requestAnimationFrame(micLoop);
}

function handleChordDetected(value){const r=runtime;if(!r||r.passed)return;const c=r.chordRounds?.[r.chordRound];if(!c)return;const wanted=[...new Set(c.midi.map(pitchClass))],incoming=[...new Set((Array.isArray(value)?value:[value]).map(pitchClass))];const ok=wanted.every(x=>incoming.includes(x));flashKeys(Array.isArray(value)?value:c.midi,ok);if(ok){r.errors=0;r.chordRound++;v5Stats().chords=(v5Stats().chords||0)+1;save();if(r.chordRound>=r.rounds){r.passed=true;completeLesson(r.n);setTimeout(()=>renderLessonComplete(r),350)}else{setLessonFeedback('good','Аккорд верный!','Следующая форма уже готова.');setTimeout(renderLesson,300)}}else setLessonFeedback('bad','Собираем аккорд',`Нужно: ${chordText(c.root,c.type)}. Сыграй три звука вместе или почти одновременно.`)}
function handlePracticeChordDetected(value){const c=practiceState.chord;if(!c)return;const wanted=[...new Set(c.midi.map(pitchClass))],got=[...new Set((Array.isArray(value)?value:[value]).map(pitchClass))];const ok=wanted.every(x=>got.includes(x));if(ok){v5Stats().chords=(v5Stats().chords||0)+1;save();$('#practiceFeedback').innerHTML=feedbackMarkup('good','Аккорд найден','Все три звука совпали.');setTimeout(()=>{practiceState.chord=null;renderPractice()},700)}else $('#practiceFeedback').innerHTML=feedbackMarkup('wait','Слушаю…',`Совпало ${wanted.filter(x=>got.includes(x)).length} из 3.`)}

// Cleaner song progression: Знакомство → Правая → Левая → Вместе → Прогон.
function songStageData(s,stage){
 const f=(s.fragment||[60,62,64,67]).slice();
 const bases=[36,48,60,72,84];const base=bases[Math.min(4,Math.max(0,(s.level||1)-1))];const melodic=f.map(n=>base+(n-60));
 return [
  {name:'Знакомство',kind:'learn',desc:'Послушай первую ноту и найди её на клавиатуре.',seq:melodic.slice(0,1)},
  {name:'Правая рука',kind:'right',desc:'Собери короткую мелодическую фразу.',seq:melodic.slice(0,4)},
  {name:'Левая рука',kind:'left',desc:'Добавь четыре опорные басовые ноты.',seq:[base-12,base-7,base-5,base-7]},
  {name:'Вместе',kind:'join',desc:'Соедини мелодию и опору в одном пульсе.',seq:melodic.slice(0,6)},
  {name:'Прогон',kind:'run',desc:'Сыграй учебный фрагмент целиком без остановки.',seq:melodic.slice(0,8)}
 ][Math.min(4,Math.max(0,stage))];
}

// Make previews audible on phones.
function playPianoNote(m,when=0,duration=2.2,velocity=1){
 if(!oscillatorCtx)oscillatorCtx=new (window.AudioContext||window.webkitAudioContext)();const ctx=oscillatorCtx;if(ctx.state==='suspended')ctx.resume();const now=ctx.currentTime+when,f=440*Math.pow(2,(m-69)/12);const master=ctx.createGain(),filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=Math.min(7000,2200+f*5);master.gain.setValueAtTime(.0001,now);master.gain.exponentialRampToValueAtTime(.32*velocity,now+.008);master.gain.exponentialRampToValueAtTime(.12*velocity,now+.35);master.gain.exponentialRampToValueAtTime(.0001,now+duration);filter.connect(master).connect(ctx.destination);[[1,'triangle',.8],[2,'sine',.18],[3,'sine',.07],[4,'sine',.03]].forEach(([mul,type,g])=>{const o=ctx.createOscillator(),gain=ctx.createGain();o.type=type;o.frequency.value=f*mul;gain.gain.value=g;o.connect(gain).connect(filter);o.start(now);o.stop(now+duration+.05)});
}

function renderTuner(){return renderTunerV5()}

/* remove repeated explanatory blocks from old lesson renderer by using V5 renderer above */

// Ensure old initialization happens only after all V5 replacements exist.


/* ===================== PIANO LEARNING V6 AUDIO ENGINE ===================== */

const V6_PITCHY_URL = 'https://esm.sh/pitchy@4';
let v6Pitchy = null;
let v6PitchyLoading = null;
let v6PitchDetector = null;
let v6LastStable = null;
let v6StableFrames = [];
let v6LastRaw = null;
let v6Live = { midi:null, freq:null, confidence:0, cents:0, rms:0 };

async function loadV6Pitchy(){
  if(v6Pitchy) return v6Pitchy;
  if(v6PitchyLoading) return v6PitchyLoading;
  v6PitchyLoading = import(V6_PITCHY_URL).then(mod=>{
    v6Pitchy=mod;
    return mod;
  }).catch(()=>null);
  return v6PitchyLoading;
}

function v6EnsureStats(){
  state.stats=state.stats||{};
  state.octavesSeen=state.octavesSeen||{};
  return state.stats;
}

function v6MidiFromFreq(freq){
  return 69+12*Math.log2(freq/440);
}

function v6FrequencyForMidi(m){
  return 440*Math.pow(2,(m-69)/12);
}

function v6DbToLinear(db){ return Math.pow(10, db/20); }

/* Harmonic evidence helps correct the classic piano octave-up error. */
function v6HarmonicScore(freqData,sr,fftSize,midi){
  const f0=v6FrequencyForMidi(midi);
  if(f0<27||f0>1800)return 0;
  let score=0,total=0;
  for(let h=1;h<=8;h++){
    const f=f0*h;
    if(f>=sr/2)break;
    const bin=f*fftSize/sr;
    const center=Math.round(bin);
    let local=0;
    for(let d=-2;d<=2;d++){
      const i=center+d;
      if(i>=0&&i<freqData.length)local=Math.max(local,v6DbToLinear(freqData[i]));
    }
    const w=1/Math.pow(h,.72);
    score+=local*w;
    total+=w;
  }
  return total?score/total:0;
}

function v6CorrectOctave(rawMidi,freqData,sr,fftSize){
  const center=Math.round(rawMidi);
  const candidates=[center-24,center-12,center,center+12,center+24].filter(m=>m>=21&&m<=108);
  if(!freqData)return center;
  let best=center,bestScore=-Infinity;
  const rawFreq=v6FrequencyForMidi(center);
  for(const m of candidates){
    const harmonic=v6HarmonicScore(freqData,sr,fftSize,m);
    const distance=Math.abs(Math.log2(v6FrequencyForMidi(m)/rawFreq));
    const prior=distance<.01?1.18:distance===1?1.0:.86;
    const score=harmonic*prior;
    if(score>bestScore){bestScore=score;best=m;}
  }
  return best;
}

function detectPitch(buf,sr){
  let mean=0,rms=0;
  for(let i=0;i<buf.length;i++)mean+=buf[i];
  mean/=buf.length;
  for(let i=0;i<buf.length;i++){const x=buf[i]-mean;rms+=x*x;}
  rms=Math.sqrt(rms/buf.length);
  if(rms<.004)return null;

  let rawFreq=null,clarity=0;
  if(v6Pitchy?.PitchDetector){
    try{
      if(!v6PitchDetector||v6PitchDetector.inputLength!==buf.length){
        v6PitchDetector=v6Pitchy.PitchDetector.forFloat32Array(buf.length);
      }
      const [freq,c]=v6PitchDetector.findPitch(buf,sr);
      if(Number.isFinite(freq)&&freq>=27&&freq<=2100){rawFreq=freq;clarity=c||0;}
    }catch{}
  }

  /* Fallback: normalized difference with parabolic interpolation. */
  if(!rawFreq){
    const minFreq=27,maxFreq=2100;
    const minLag=Math.floor(sr/maxFreq),maxLag=Math.min(Math.floor(sr/minFreq),buf.length-2);
    let bestLag=-1,best=Infinity;
    for(let lag=minLag;lag<=maxLag;lag+=2){
      let diff=0,n=0;
      for(let i=0;i<buf.length-lag;i+=2){const a=buf[i]-mean,b=buf[i+lag]-mean;const d=a-b;diff+=d*d;n++;}
      if(diff<best){best=diff;bestLag=lag;}
    }
    if(bestLag<0)return null;
    const norm=best/(Math.max(rms*rms*(buf.length-bestLag)*.5,1e-9));
    clarity=Math.max(0,Math.min(1,1-norm));
    rawFreq=sr/bestLag;
  }

  if(clarity<.68)return null;
  let exact=v6MidiFromFreq(rawFreq);
  if(!Number.isFinite(exact))return null;
  let midi=Math.round(exact);
  const cents=(exact-midi)*100;
  if(midi<21||midi>108)return null;

  if(mic?.freq){
    midi=v6CorrectOctave(midi,mic.freq,sr,mic.analyser?.fftSize||buf.length);
  }

  const correctedFreq=v6FrequencyForMidi(midi);
  const correctedCents=(v6MidiFromFreq(rawFreq)-midi)*100;
  return {midi,confidence:clarity,rms,cents:correctedCents,rawFreq,correctedFreq};
}

function v6ChromaSpectrum(freqData,sr,fftSize){
  const pc=new Array(12).fill(0);
  const minBin=Math.max(1,Math.floor(27*fftSize/sr));
  const maxBin=Math.min(freqData.length-1,Math.ceil(2100*fftSize/sr));
  for(let bin=minBin;bin<=maxBin;bin++){
    const f=bin*sr/fftSize;
    if(f<27||f>2100)continue;
    const db=freqData[bin];
    if(!Number.isFinite(db)||db<-78)continue;
    const amp=v6DbToLinear(db);
    const midi=v6MidiFromFreq(f);
    const frac=midi-Math.floor(midi);
    const nearest=Math.round(midi);
    const p=((nearest%12)+12)%12;
    /* Nearby bins are softly distributed to reduce FFT-bin jitter. */
    const cents=Math.abs(frac-.5)*100;
    const w=Math.max(.08,1-cents/100)*amp;
    pc[p]+=w;
  }
  return pc;
}

/* Polyphonic detection: infer pitch classes from the whole spectrum, then
   compare the observed set with the requested chord. This is deliberately
   pitch-class based so inversions and different octaves work. */
function detectChordPitches(freqData,sr,fftSize){
  if(!freqData)return [];
  const chroma=v6ChromaSpectrum(freqData,sr,fftSize);
  const ranked=chroma.map((score,pc)=>({pc,score})).sort((a,b)=>b.score-a.score);
  if(!ranked.length||ranked[0].score<=0)return [];
  const top=ranked[0].score;
  const out=[];
  for(const item of ranked){
    if(item.score<top*.34)break;
    if(out.some(x=>x.pc===item.pc))continue;
    out.push(item);
    if(out.length>=4)break;
  }
  if(out.length<2)return [];
  /* Convert pitch classes to representative mid-register MIDI values. */
  return out.map(x=>60+x.pc).sort((a,b)=>a-b);
}

async function startMic(){
  if(mic.stream){toast('Микрофон уже подключён','good');return;}
  if(!window.isSecureContext){toast('Открой сайт по HTTPS для доступа к микрофону','bad');return;}
  if(!navigator.mediaDevices?.getUserMedia){toast('Браузер не поддерживает микрофон','bad');return;}
  try{
    mic.stream=await navigator.mediaDevices.getUserMedia({
      audio:{
        channelCount:1,
        echoCancellation:false,
        noiseSuppression:false,
        autoGainControl:false,
        latency:0
      }
    });
    mic.ctx=new (window.AudioContext||window.webkitAudioContext)();
    if(mic.ctx.state==='suspended')await mic.ctx.resume();
    mic.source=mic.ctx.createMediaStreamSource(mic.stream);
    mic.analyser=mic.ctx.createAnalyser();
    mic.analyser.fftSize=8192;
    mic.analyser.smoothingTimeConstant=.0;
    mic.source.connect(mic.analyser);
    mic.freq=new Float32Array(mic.analyser.frequencyBinCount);
    mic.lastMidi=null;mic.candidateMidi=null;mic.candidateSince=0;mic.lastDispatch=0;mic.lastSeen=0;
    mic.lastChordSig='';mic.lastChordDispatch=0;mic.ignoreScalarUntil=0;
    v6StableFrames=[];v6LastStable=null;
    loadV6Pitchy();
    micLoop();
    toast('Микрофон подключён — слушаю пианино','good');
    render();
  }catch(e){
    stopMic();
    if(e?.name==='NotAllowedError')toast('Разреши микрофон для этого сайта','bad');
    else if(e?.name==='NotFoundError')toast('Микрофон не найден','bad');
    else toast('Не удалось подключить микрофон','bad');
  }
}

function v6StableResult(result){
  if(!result)return null;
  const midi=result.midi;
  v6StableFrames.push({midi,confidence:result.confidence,cents:result.cents,freq:result.rawFreq});
  if(v6StableFrames.length>8)v6StableFrames.shift();
  const counts={};
  for(const x of v6StableFrames)counts[x.midi]=(counts[x.midi]||0)+1;
  const best=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
  if(!best)return null;
  const bestMidi=+best[0],count=+best[1];
  if(count<3)return null;
  const same=v6StableFrames.filter(x=>x.midi===bestMidi);
  const confidence=same.reduce((a,x)=>a+x.confidence,0)/same.length;
  const cents=same.reduce((a,x)=>a+x.cents,0)/same.length;
  return {midi:bestMidi,confidence,cents,freq:v6FrequencyForMidi(bestMidi)};
}

function v6UpdateLive(result){
  v6Live=result?{midi:result.midi,freq:result.rawFreq,confidence:result.confidence,cents:result.cents,rms:result.rms}:v6Live;
  const el=$('#micLive');
  if(!el)return;
  if(!result){el.innerHTML='<span class="micLiveDot"></span><b>Слушаю…</b><small>Сыграй одну ноту на синтезаторе</small>';return;}
  el.innerHTML=`<span class="micLiveDot good"></span><b>${noteText(result.midi)}</b><small>${Math.round(result.rawFreq)} Hz · уверенность ${Math.round(result.confidence*100)}% · ${result.cents>=0?'+':''}${Math.round(result.cents)}¢</small>`;
}

function micLoop(){
  if(!mic.analyser)return;
  const buf=new Float32Array(mic.analyser.fftSize);
  mic.analyser.getFloatTimeDomainData(buf);
  mic.analyser.getFloatFrequencyData(mic.freq);
  const now=performance.now();
  const chordContext=(route==='practice'&&practiceState.tab==='chords')||(route==='lesson'&&runtime&&(runtime.type==='chord'||runtime.type==='song'&&runtime.songKind==='chord'));

  if(chordContext){
    const poly=detectChordPitches(mic.freq,mic.ctx.sampleRate,mic.analyser.fftSize);
    if(poly.length>=2){
      const sig=poly.map(pitchClass).sort((a,b)=>a-b).join(',');
      if(sig!==mic.lastChordSig||now-mic.lastChordDispatch>650){
        mic.lastChordSig=sig;mic.lastChordDispatch=now;mic.ignoreScalarUntil=now+260;onChordDetected(poly);
      }
    }
  }

  const result=now<mic.ignoreScalarUntil?null:detectPitch(buf,mic.ctx.sampleRate);
  if(result){
    mic.lastSeen=now;
    v6UpdateLive(result);
    const stable=v6StableResult(result);
    if(stable){
      const m=stable.midi;
      if(m===mic.candidateMidi){
        if(!mic.candidateSince)mic.candidateSince=now;
        const held=now-mic.candidateSince,repeatGap=now-mic.lastDispatch;
        if(held>=110&&(m!==mic.lastMidi||repeatGap>900)){
          mic.lastMidi=m;mic.lastDispatch=now;
          markOctaveSeen(m);
          onDetected(m,{rms:result.rms,confidence:stable.confidence,cents:stable.cents,freq:result.rawFreq});
        }
      }else{
        mic.candidateMidi=m;mic.candidateSince=now;
      }
    }
  }else{
    v6UpdateLive(null);
    if(mic.lastSeen&&now-mic.lastSeen>180){
      mic.candidateMidi=null;mic.candidateSince=0;mic.lastMidi=null;v6StableFrames=[];
    }
  }
  mic.raf=requestAnimationFrame(micLoop);
}

/* Better month calendar: one month at a time, green activity cells. */
let v6CalendarDate=new Date();
function renderCalendar(){
  const overlay=$('#calendarOverlay');if(!overlay)return;
  const y=v6CalendarDate.getFullYear(),m=v6CalendarDate.getMonth();
  const monthName=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(new Date(y,m,1));
  const first=new Date(y,m,1),daysIn=new Date(y,m+1,0).getDate();
  let start=(first.getDay()+6)%7;
  const today=new Date();
  const cells=[];
  for(let i=0;i<start;i++)cells.push('<div class="calendarCell empty"></div>');
  for(let d=1;d<=daysIn;d++){
    const date=new Date(y,m,d),key=todayKeyFromDate(date),xp=Number(state.activityDays?.[key]||0);
    const isToday=date.toDateString()===today.toDateString();
    cells.push(`<div class="calendarCell ${xp?'hasActivity':''} ${isToday?'today':''}"><b>${d}</b>${xp?`<small>${xp} XP</small>`:''}</div>`);
  }
  overlay.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="calendarDialog card"><div class="calendarHead"><div><div class="sectionKicker">АКТИВНОСТЬ</div><h2>${monthName.charAt(0).toUpperCase()+monthName.slice(1)}</h2><p>Зелёный день — ты занимался или прошёл урок.</p></div><button class="backBtn" id="calClose">×</button></div><div class="calendarNav"><button id="calPrev">‹</button><strong>${monthName.charAt(0).toUpperCase()+monthName.slice(1)}</strong><button id="calNext">›</button></div><div class="calendarWeekdays">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span>${x}</span>`).join('')}</div><div class="calendarGrid">${cells.join('')}</div><div class="calendarLegend"><span><i class="legendDot"></i> активность</span><span>${Object.keys(state.activityDays||{}).filter(k=>k.startsWith(`${y}-${String(m+1).padStart(2,'0')}`)).length} активных дней</span></div></div>`;
  overlay.className='calendarOverlay show';
  $('#calClose').onclick=()=>overlay.className='calendarOverlay';$('#calendarBackdrop').onclick=()=>overlay.className='calendarOverlay';
  $('#calPrev').onclick=()=>{v6CalendarDate=new Date(y,m-1,1);renderCalendar()};
  $('#calNext').onclick=()=>{v6CalendarDate=new Date(y,m+1,1);renderCalendar()};
}

/* 50+ achievements, with only 12 hidden. */
const V6_ACHIEVEMENTS=[
 ['first','🎹','Первая нота','Завершить первый урок'],['five','🌱','Первые шаги','Завершить 5 уроков'],['ten','🔥','Разогрев','Завершить 10 уроков'],['twenty','📚','В ритме','Завершить 20 уроков'],['thirty','🧠','Читаю музыку','Завершить 30 уроков'],['forty','🎼','Музыкальная база','Завершить 40 уроков'],['fifty','🚀','Половина пути','Завершить 50 уроков'],['seventyfive','💫','Большой прогресс','Завершить 75 уроков'],['hundred','🏅','Последняя прямая','Завершить 100 уроков'],['course','👑','Финальный аккорд','Завершить весь курс'],
 ['xp100','⚡','100 XP','Набрать 100 XP'],['xp500','💎','500 XP','Набрать 500 XP'],['xp1000','🏆','1000 XP','Набрать 1000 XP'],['xp2500','🌟','2500 XP','Набрать 2500 XP'],['xp5000','💠','5000 XP','Набрать 5000 XP'],
 ['day3','🔥','Три дня','Заниматься 3 дня'],['day7','🗓️','Неделя','Заниматься 7 дней'],['day14','🌙','Две недели','Заниматься 14 дней'],['day30','☀️','Месяц','Заниматься 30 дней'],
 ['song1','🎵','Первая песня','Потренироваться с первой песней'],['songs3','🎶','Три мелодии','Потренироваться с 3 песнями'],['songs10','🎻','Репертуар','Потренироваться с 10 песнями'],['favorite','❤️','Любимые','Добавить песню в избранное'],
 ['mistake','🛠️','Не сдался','Исправить ошибку и пройти дальше'],['chords','⌬','Аккорд за аккордом','Потренироваться с аккордами'],['ear','👂','Слышу','Пройти тренировку слуха'],['tuner','🎯','Точно в центр','Поймать ноту тюнером'],['fiveOct','🌈','Пять регистров','Сыграть ноты в 1–5 октавах'],['perfect10','✨','Чистая серия','10 целей без ошибки'],['warmup','⏱️','Разогрев','Завершить 3-минутную разминку'],
 ['hidden1','🔮','?','Секрет','hidden'],['hidden2','🗝️','?','Секрет','hidden'],['hidden3','🌌','?','Секрет','hidden'],['hidden4','🪄','?','Секрет','hidden'],['hidden5','🧩','?','Секрет','hidden'],['hidden6','🛰️','?','Секрет','hidden'],['hidden7','🕰️','?','Секрет','hidden'],['hidden8','🎯','?','Секрет','hidden'],['hidden9','🦾','?','Секрет','hidden'],['hidden10','🎹','?','Секрет','hidden'],['hidden11','🌠','?','Секрет','hidden'],['hidden12','👑','?','Секрет','hidden']
];
function v6AchievementList(){
 const days=Object.keys(state.activityDays||{}).length,songs=Object.keys(state.songProgress||{}).filter(k=>(state.songProgress[k]?.best||0)>0).length;
 const s=v6EnsureStats();
 const cond={first:()=>completedCount()>=1,five:()=>completedCount()>=5,ten:()=>completedCount()>=10,twenty:()=>completedCount()>=20,thirty:()=>completedCount()>=30,forty:()=>completedCount()>=40,fifty:()=>completedCount()>=50,seventyfive:()=>completedCount()>=75,hundred:()=>completedCount()>=100,course:()=>completedCount()>=115,xp100:()=>state.xp>=100,xp500:()=>state.xp>=500,xp1000:()=>state.xp>=1000,xp2500:()=>state.xp>=2500,xp5000:()=>state.xp>=5000,day3:()=>days>=3,day7:()=>days>=7,day14:()=>days>=14,day30:()=>days>=30,song1:()=>songs>=1,songs3:()=>songs>=3,songs10:()=>songs>=10,favorite:()=>Array.isArray(state.favorites)&&state.favorites.length>=1,mistake:()=>Object.keys(state.mistakes||{}).length>=1&&completedCount()>=2,chords:()=>Number(s.chords||0)>=1,ear:()=>Number(s.ear||0)>=1,tuner:()=>Number(s.tuner||0)>=1,fiveOct:()=>Object.keys(state.octavesSeen||{}).length>=5,perfect10:()=>Number(s.perfectRun||0)>=10,warmup:()=>Number(s.warmup||0)>=1};
 return V6_ACHIEVEMENTS.map(a=>({id:a[0],icon:a[1],title:a[2],desc:a[3],hidden:a[4]==='hidden',ok:cond[a[0]]?!!cond[a[0]]():false}));
}
function achievementList(){return v6AchievementList()}

/* 3-minute warm-up. */
let v6WarmupTimer=0;
function v6StartWarmup(){
 const now=Date.now();
 practiceState.warmup={started:true,endsAt:now+180000,correct:0,errors:0,index:0,queue:[],finished:false};
 v6WarmupTimer=setInterval(()=>{if(!practiceState.warmup)return;if(Date.now()>=practiceState.warmup.endsAt){practiceState.warmup.finished=true;clearInterval(v6WarmupTimer);v6WarmupTimer=0;v6EnsureStats().warmup=(v6EnsureStats().warmup||0)+1;awardXP(25);save();renderPractice()}else{const el=$('#warmupClock');if(el){const left=Math.max(0,practiceState.warmup.endsAt-Date.now());el.textContent=`${Math.floor(left/60000)}:${String(Math.floor(left/1000)%60).padStart(2,'0')}`}}},250);
 practiceState.tab='session';practiceState.note=randomPracticeMidi();renderPractice();
}
function v6RenderWarmup(){
 const w=practiceState.warmup;
 if(!w||!w.started){return `<div class="practiceCard card warmupCard"><div class="sectionKicker">РАЗМИНКА</div><h2>3 минуты нот</h2><p>Никаких пауз: сыграй цель, получи следующую и просто разогрей руки. Ноты меняются по всему диапазону 1–5 октав.</p><button class="primary full" id="startWarmup">▶ Начать 3 минуты</button></div>`;}
 if(w.finished){return `<div class="completeHero card"><div class="completeIcon">✓</div><div class="eyebrow">РАЗМИНКА · 3 МИНУТЫ</div><h2>Разминка завершена</h2><p>${w.correct} правильных · ${w.errors} ошибок.</p><div class="reward">+25 XP</div><button class="primary full" id="restartWarmup">Новая разминка</button></div>`;}
 const target=practiceState.note??randomPracticeMidi();practiceState.note=target;
 return `<div class="card sessionHeader"><div><div class="sectionKicker">РАЗМИНКА · 3 МИНУТЫ</div><h2>Играй без остановки</h2><p>${w.correct} правильных · ${w.errors} ошибок</p></div><div class="sessionTimer" id="warmupClock">3:00</div></div><div class="practiceCard card"><div class="practiceTarget"><span>ЦЕЛЬ</span><b>${noteName(target)}</b><small>${noteText(target)}</small></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}<div id="practiceSessionFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteText(target)}.`)}</div><button class="secondary full" id="warmupHear">🔊 Эталон</button></div>`;
}

function renderPractice(){
 const tab=practiceState.tab||'notes';
 $('#practice').innerHTML=`${header('Практика','home','ТРЕНАЖЁР')}<div class="practiceTabs">${[['notes','Ноты'],['chords','Аккорды'],['ear','Слух'],['tuner','Тюнер'],['weak','Слабые места'],['session','⚡ 3 минуты']].map(x=>`<button class="practiceTab ${tab===x[0]?'active':''}" data-practice="${x[0]}">${x[1]}</button>`).join('')}</div><div class="practiceExplain card"><b>${tab==='tuner'?'Тюнер — проверка высоты звука.':tab==='chords'?'Аккорды — несколько нот одновременно.':tab==='ear'?'Здесь тренируется слух без названия ноты.':tab==='session'?'Три минуты непрерывной разминки.':'Микрофон слушает реальный звук твоего синтезатора.'}</b><span>${tab==='tuner'?'Центр шкалы = точная высота.':tab==='chords'?'Можно сыграть три ноты почти одновременно.':tab==='session'?'Цель меняется после каждой правильной ноты.':'Стабильная нота подтверждается несколькими кадрами, чтобы случайная ошибка не засчитывалась.'}</span></div><div class="micLive card" id="micLive"><span class="micLiveDot"></span><b>${mic.stream?'Слушаю…':'Микрофон не подключён'}</b><small>${mic.stream?'Сыграй одну ноту для проверки':'Нажми «Подключить микрофон» на главной'}</small></div><div id="practiceContent"></div>`;
 $$('[data-practice]').forEach(b=>b.onclick=()=>{practiceState.tab=b.dataset.practice;renderPractice()});
 const box=$('#practiceContent');
 if(tab==='notes')box.innerHTML=renderPracticeNotesV5();
 else if(tab==='chords')box.innerHTML=renderPracticeChordsV5();
 else if(tab==='ear')box.innerHTML=renderPracticeEarV5();
 else if(tab==='tuner')box.innerHTML=renderTunerV5();
 else if(tab==='session')box.innerHTML=v6RenderWarmup();
 else box.innerHTML=renderWeakV5();
 if(tab==='session'){
   if(!practiceState.warmup||!practiceState.warmup.started)$('#startWarmup').onclick=v6StartWarmup;
   else if(practiceState.warmup.finished)$('#restartWarmup').onclick=()=>{practiceState.warmup=null;practiceState.note=null;renderPractice()};
   else {$('#warmupHear').onclick=()=>playTone(practiceState.note);const left=Math.max(0,practiceState.warmup.endsAt-Date.now());$('#warmupClock').textContent=`${Math.floor(left/60000)}:${String(Math.floor(left/1000)%60).padStart(2,'0')}`}
 } else bindPracticeV5(tab);
}

function handlePracticeDetection(m,meta){
 if(practiceState.tab==='session'&&practiceState.warmup?.started&&!practiceState.warmup.finished){
   const w=practiceState.warmup,t=practiceState.note;
   if(pitchClass(m)===pitchClass(t)){w.correct++;practiceState.note=randomPracticeMidi();flashKeys([m],true);save();renderPractice();}
   else{w.errors++;state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();const el=$('#practiceSessionFeedback');if(el)el.innerHTML=feedbackMarkup('bad','Почти',`Услышана ${noteText(m)}. Нужна ${noteText(t)}.`);flashKeys([m],false);}
   return;
 }
 if(practiceState.tab==='tuner'){handleTunerDetected(m,meta);return;}
 if(practiceState.tab==='notes'||practiceState.tab==='weak'){
   const t=practiceState.note;if(t==null)return;
   const ok=pitchClass(m)===pitchClass(t);
   if(ok){practiceState.notePassed=true;markActive();$('#practiceFeedback').innerHTML=feedbackMarkup('good','Верно!',`Услышана ${noteText(m)}. Октава здесь не важна.`);flashKeys([m],true)}
   else{state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();const el=$('#practiceFeedback');if(el)el.innerHTML=feedbackMarkup('bad','Попробуй ещё',`Услышана ${noteText(m)}. Нужна ${noteName(t)}.`);flashKeys([m],false)}
   return;
 }
 /* chord and ear continue through the existing handlers */
 if(practiceState.tab==='chords'){handlePracticeChordDetected([m]);}
}

/* Soft page transitions. */
function v6Go(next){
 const old=$('.screen.active');
 if(old){old.classList.add('screenLeaving');setTimeout(()=>old.classList.remove('screenLeaving'),240)}
 go(next);
 const fresh=$('.screen.active');if(fresh){fresh.classList.remove('screenEntering');void fresh.offsetWidth;fresh.classList.add('screenEntering');setTimeout(()=>fresh.classList.remove('screenEntering'),360)}
}
$$('[data-nav]').forEach(b=>b.onclick=()=>v6Go(b.dataset.nav));
$('#brand').onclick=()=>v6Go('home');

/* Override navigation only; all existing lesson/song logic remains intact. */

ensureDay();render();
