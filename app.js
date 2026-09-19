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
  {id:'intervals', icon:'↗', name:'Интервалы и движение', range:[36,45], desc:'Шаги, скачки, расстояния и музыкальные фразы.'},
  {id:'chords', icon:'⌬', name:'Аккорды и гармония', range:[46,60], desc:'Трезвучия, обращения и первые аккордовые последовательности.'},
  {id:'scales', icon:'≈', name:'Гаммы и аппликатура', range:[61,72], desc:'Порядок нот, большой палец и ровное движение по клавиатуре.'},
  {id:'technique', icon:'✋', name:'Техника и контроль', range:[73,82], desc:'Ровность, скорость, артикуляция и контроль силы звука.'},
  {id:'hands', icon:'⇄', name:'Две руки', range:[83,92], desc:'Бас, аккорды, остинато, баланс и первая самостоятельная фраза.'},
  {id:'musicality', icon:'◌', name:'Музыкальность', range:[93,100], desc:'Фразировка, педаль, синкопы и умная практика.'},
  {id:'song', icon:'♬', name:'Песенный проект', range:[101,115], desc:'Переносим навыки на реальную музыку: фрагмент → руки → прогон.'}
];

const LESSON_TITLES = [
  'Старт: что делать на первом уроке','Белые и чёрные клавиши','Находим ДО по двум чёрным','Пять пальцев: ДО–СОЛЬ','Переставляем пальцы спокойно','Правая рука: позиция ДО–СОЛЬ','Левая рука: позиция ДО–СОЛЬ','Точки-ориентиры по всей клавиатуре','Пять пальцев вверх и вниз','Первая короткая мелодия',
  'Что такое пульс','Считаем 1–2–3–4','Долгий и короткий звук','Пауза — это тоже музыка','Ровный пульс на одной ноте','Две длительности в одной фразе','Сильная и слабая доля','Метроном: первый уверенный круг','Ритмический рисунок без смены нот','Мелодия с пульсом',
  'Нотный стан: карта высоты','Скрипичный ключ: где живёт СОЛЬ','Басовый ключ: где живёт ФА','Среднее ДО как мост между ключами','МИ на стане','СОЛЬ на стане','ФА и ЛЯ в басу','Читаем направление нот','Шаг вверх и шаг вниз','Через одну ноту','Четыре ноты без подсказки','Не путаем линию и промежуток','Читаем маленькую фразу','Правая рука читает','Левая рука читает',
  'Что такое интервал','Секунда — один шаг','Терция — через одну','Кварта — шире ладони','Квинта — сильный ориентир','Вверх и вниз','Повтор звука против движения','Одинаковый рисунок выше','Вопрос и ответ','Мини-этюд на интервалы',
  'Что такое аккорд','Трезвучие из трёх нот','До мажор','Ля минор','Фа мажор','Соль мажор','Ми минор','Ре минор','Переход ДО–СОЛЬ','Переход ДО–ФА','Переход ДО–ЛЯ минор','Четыре аккорда по кругу','Мажор или минор на слух','Ровная аккордовая пульсация','Мелодия поверх аккорда',
  'До мажор: гамма','Ля минор: гамма','Соль мажор: гамма','Фа мажор: гамма','Аппликатура правой руки','Аппликатура левой руки','Большой палец в движении','Гамма вверх','Гамма вниз','Вверх и вниз без остановки','Арпеджио из трезвучия','Гамма как разминка',
  'Независимость пальцев','Четыре звука ровно','Чистота важнее скорости','Метроном: добавляем темп','Контроль силы удара','Легато: связная линия','Стаккато: лёгкий отрыв','Акцент на первой ноте','Три уровня громкости','Короткая техническая связка',
  'Левая рука как бас','Бас + аккорд','Простой вальсовый рисунок','Мелодия справа, бас слева','Мелодия справа, аккорд слева','Не ускоряемся при смене рук','Баланс двух рук','Остинато левой руки','Держим повторяющийся рисунок','Собираем восьмитактовую фразу',
  'Фраза как предложение','Где закончить музыкальную мысль','Тише внутри фразы','Вершина фразы','Педаль: зачем она','Смена педали без каши','Синкопа без паники','Триоли: три внутри пульса',
  'Как заниматься 15 минут','Как разбирать песню по кусочкам','Песня: понимаем схему обучения','Песня: узнаём первую ноту','Песня: первая мини-фраза правой','Песня: ещё одна мини-фраза','Песня: левая рука отдельно','Песня: соединяем два фрагмента','Песня: четыре ноты без спешки','Песня: добавляем пульс','Песня: убираем одну подсказку','Песня: играем связку целиком','Песня: аккорд и мелодия вместе','Песня: пробный прогон','Финал курса: сыграй свою песню'
];

const SONGS = [
  {id:'overture',title:'Stardew Valley Overture',author:'ConcernedApe',difficulty:'Очень легко',level:1,category:'Игры',icon:'🌱',colorClass:'spring',video:'https://www.youtube.com/watch?v=XeOZRuKQsCI',videoLabel:'Piano cover · Torby Brand',desc:'Первый игровой проект: спокойный темп, простые ориентиры и чтение по одной ноте.',tags:['мелодия','чтение'],fragment:[60,62,64,67,65,64,62,60]},
  {id:'spring',title:'The Valley Comes Alive — Spring',author:'Stardew Valley',difficulty:'Очень легко',level:1,category:'Игры',icon:'☀️',colorClass:'sun',video:'https://www.youtube.com/watch?v=8sh31m-QBvU4',videoLabel:'Piano tutorial · Sheet Music Boss',desc:'Удобный ранний проект для ритма, чтения и плавного движения.',tags:['ритм','мелодия'],fragment:[60,62,64,67,64,62,60,62]},
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
  {id:'zelda',title:'The Legend of Zelda Theme',author:'Koji Kondo',difficulty:'Легко',level:2,category:'Игры',icon:'🗡️',colorClass:'green',video:null,videoLabel:'Найти проверенный tutorial',desc:'Игровая мелодия с более активным движением правой руки.',tags:['мелодия','ритм'],fragment:[60,64,65,67,64,60,62,65]},
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
  {id:'believer',title:'Believer',author:'Imagine Dragons',difficulty:'Средне',level:3,category:'Поп',icon:'⚡',colorClass:'ember',video:null,videoLabel:'Найти tutorial',desc:'Ритмический проект на акценты и уверенный пульс.',tags:['акценты','ритм'],fragment:[60,60,67,60,69,67,64,60]},
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
function todayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}

let state={completed:{},xp:0,streak:0,lastDay:'',todayXP:0,activeSong:null,favorites:[],mistakes:{}};
try{
  const old=JSON.parse(localStorage.getItem(STORAGE)||'{}');
  if(old && typeof old==='object') state={...state,...old,completed:old.completed||{}};
}catch{}

let mic={stream:null,ctx:null,source:null,analyser:null,freq:null,raf:0,lastMidi:null,candidateMidi:null,candidateSince:0,lastDispatch:0,lastSeen:0,lastChordSig:'',lastChordDispatch:0,ignoreScalarUntil:0};
let route='home';window.songSearch='';window.songFilter='Все';window.songCategory='Все';
let runtime=null;
let practiceState={tab:'notes',note:null,notePassed:false,chord:null,chordPassed:false,chordSeen:[],session:null,weakOnly:false};
let songRuntime=null;
let oscillatorCtx=null;

function save(){localStorage.setItem(STORAGE,JSON.stringify(state))}
function ensureDay(){const d=todayKey();if(state.lastDay!==d){state.streak=state.lastDay&&Math.abs((new Date(d)-new Date(state.lastDay))/86400000)===1?state.streak+1:1;state.lastDay=d;state.todayXP=0;save()}$('#streak').textContent=`🔥 ${state.streak} ${plural(state.streak,'день','дня','дней')}`;$('#xpTop').textContent=`${state.xp} XP`}
function awardXP(amount){state.xp+=amount;state.todayXP+=amount;save();ensureDay()}
function completeLesson(n){if(!state.completed[n]){state.completed[n]=true;awardXP(xpFor(n));save()}}
function toast(msg,type=''){const el=$('#toast');el.textContent=msg;el.className=`toast show ${type}`;clearTimeout(toast._t);toast._t=setTimeout(()=>el.className='toast',1900)}
function go(id){if(id!=='lesson'&&metroOn){metroOn=false;stopMetronome()}if(id!=='practice')clearPracticeSessionTimer();route=id;render();window.scrollTo({top:0,behavior:'smooth'})}
function render(){ensureDay();$$('.screen').forEach(s=>s.classList.remove('active'));const view=$(`#${route}`);if(view)view.classList.add('active');$$('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===route));if(route==='home')renderHome();if(route==='course')renderCourse();if(route==='practice')renderPractice();if(route==='songs')renderSongs();if(route==='lesson')renderLesson();if(route==='song')renderSong()}
function header(title,back='home',eyebrow='PIANO LEARNING'){return `<div class="pageHead"><button class="backBtn" data-back="${back}" aria-label="Назад">‹</button><div><div class="eyebrow">${escapeHtml(eyebrow)}</div><h1>${escapeHtml(title)}</h1></div></div>`}
function bindBack(){ $$('[data-back]').forEach(b=>b.onclick=()=>go(b.dataset.back)); }

function renderHome(){
  const done=completedCount(), next=nextLesson(), effectiveNext=next||COURSE_SIZE, mod=moduleFor(effectiveNext), micReady=!!mic.stream;
  $('#home').innerHTML=`
    <div class="homeHero">
      <div class="heroBadge">✦</div>
      <div class="eyebrow">Курс от первой ноты до песни</div>
      <h1>Не просто смотри.<br><em>Играй.</em></h1>
      <p>Приложение сначала объясняет одну конкретную вещь, потом показывает цель на стане и клавиатуре, а дальше ждёт именно твой звук через микрофон.</p>
      <div class="heroActions">
        <button class="primary" id="homeMic">${micReady?'✓ Микрофон подключён':'🎙 Подключить микрофон'}</button>
        <button class="secondary" id="homeStart">${done?'▶ Продолжить курс':'▶ Начать с нуля'}</button>
      </div>
      <div class="statusLine ${micReady?'ok':''}"><span class="statusDot"></span>${micReady?'Микрофон готов. Телефон слушает ваш синтезатор.':'Поставь телефон рядом с синтезатором. Разрешение понадобится один раз.'}</div>
    </div>

    <div class="onboarding card">
      <div class="sectionKicker">КАК ВСЁ РАБОТАЕТ</div>
      <div class="onboardGrid">
        <div><span class="stepNum">1</span><b>Подключи микрофон</b><small>Телефон слушает настоящий инструмент.</small></div>
        <div><span class="stepNum">2</span><b>Открой следующий урок</b><small>Одна новая идея за раз, без одинаковых заданий.</small></div>
        <div><span class="stepNum">3</span><b>Сыграй цель</b><small>Неверная нота не двигает тебя дальше.</small></div>
      </div>
    </div>

    <button class="nextLessonCard" id="continueCard">
      <div class="nextIcon">${mod.icon}</div>
      <div><div class="microLabel">СЛЕДУЮЩИЙ УРОК · ${effectiveNext}</div><h2>${escapeHtml(LESSON_TITLES[effectiveNext-1])}</h2><p>${escapeHtml(mod.name)}</p></div>
      <span class="arrow">›</span>
    </button>

    <div class="progressCard card">
      <div class="progressTop"><span>Прогресс курса</span><b>${done} / ${COURSE_SIZE}</b></div>
      <div class="progressTrack"><i style="width:${(done/COURSE_SIZE)*100}%"></i></div>
      <div class="progressMeta"><span>${state.xp} XP всего</span><span>+${state.todayXP} сегодня</span></div>
    </div>

    <div class="homeTiles">
      <button class="tile" data-go="course"><span>▦</span><b>Курс</b><small>10 логичных этапов</small></button>
      <button class="tile" data-go="practice"><span>◎</span><b>Практика</b><small>Нота или аккорд за раз</small></button>
      <button class="tile" data-go="songs"><span>♪</span><b>Песни</b><small>${SONGS.length} учебных проекта</small></button>
    </div>
  `;
  $('#homeMic').onclick=startMic;
  $('#homeStart').onclick=()=>openLesson(done<COURSE_SIZE?(done?effectiveNext:1):COURSE_SIZE);
  $('#continueCard').onclick=()=>openLesson(effectiveNext);
  $$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
}

function renderCourse(){
  const next=nextLesson()||COURSE_SIZE;
  $('#course').innerHTML=`${header('Путь обучения','home','КУРС · 115 УРОКОВ')}
    <div class="courseIntro card"><div><b>Каждый блок учит новому навыку</b><span>Уроки можно повторять в любое время, а следующий открывается естественно через прогресс.</span></div><div class="courseProgress"><b>${completedCount()} / ${COURSE_SIZE}</b><small>пройдено</small></div></div>
    <div class="moduleList">${MODULES.map(m=>{const done=Object.keys(state.completed).filter(n=>+n>=m.range[0]&&+n<=m.range[1]&&state.completed[n]).length;const current=next>=m.range[0]&&next<=m.range[1];return `<section class="module"><div class="moduleHead"><div class="moduleIcon">${m.icon}</div><div><div class="microLabel">${m.range[0]}–${m.range[1]}</div><h2>${escapeHtml(m.name)}</h2><p>${escapeHtml(m.desc)}</p></div><span class="moduleCount">${done}/${m.range[1]-m.range[0]+1}</span></div><div class="lessonList">${Array.from({length:m.range[1]-m.range[0]+1},(_,j)=>{const n=m.range[0]+j,completed=!!state.completed[n],isNext=n===next;return `<button class="lessonRow ${completed?'done':''} ${isNext?'current':''}" data-lesson="${n}"><span class="lessonNum">${completed?'✓':n}</span><span class="lessonBody"><small>${lessonKind(n)}</small><b>${escapeHtml(LESSON_TITLES[n-1])}</b></span><span class="lessonXP">+${xpFor(n)}</span><span class="rowArrow">›</span></button>`}).join('')}</div></section>`}).join('')}</div>`;
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
      ['Сыграть гамму ДО мажор.','Начинаем с самой прозрачной аппликатуры: все белые клавиши.'],
      ['Сыграть гамму ЛЯ минор.','Ля минор использует знакомые белые клавиши и помогает слышать другой центр.'],
      ['Познакомиться с СОЛЬ мажор.','Одна чёрная клавиша меняет картину и требует внимания.'],
      ['Познакомиться с ФА мажор.','Теперь закрепляем одну чёрную клавишу другого места.'],
      ['Понять аппликатуру правой руки.','Большой палец не нужно растягивать — он подныривает под рукой.'],
      ['Понять аппликатуру левой руки.','Движение большого пальца работает зеркально.'],
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
  const song=SONGS[(n-101)%SONGS.length];
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
    {kind:'first',seq:song.fragment.slice(0,1)}, {kind:'right',seq:song.fragment.slice(0,4)}, {kind:'right',seq:song.fragment.slice(2,7)},
    {kind:'left',seq:[48,55,52,55]}, {kind:'join',seq:song.fragment.slice(0,6)}, {kind:'slow',seq:song.fragment.slice(0,4)},
    {kind:'rhythm',seq:song.fragment.slice(0,6),pattern:RHYTHM_PATTERNS[1]}, {kind:'reading',seq:song.fragment.slice(0,5)}, {kind:'chain',seq:song.fragment.slice(0,8)},
    {kind:'chord',seq:[60,64,67]}, {kind:'run',seq:song.fragment.concat([60,64])}, {kind:'final',seq:song.fragment.concat([67,65,64,60])}
  ][phase];
  return {...base,type:'song',objective:goals[0],theory:goals[1],tip:'Здесь не нужно угадывать. Сначала приложение объясняет задачу, затем показывает одну конкретную цель и ждёт твою игру.',steps:phasePlan.seq,songId:song.id,songPhase:phase,songKind:phasePlan.kind,pattern:phasePlan.pattern||null};
}
function lessonKindType(t){return t==='setup'?'Старт':t==='rhythm'?'Ритм':t==='reading'?'Чтение':t==='interval'?'Интервалы':t==='chord'?'Аккорды':t==='chordEar'?'Слух':t==='scale'?'Гаммы':t==='technique'?'Техника':t==='hands'?'Две руки':t==='musical'?'Музыкальность':t==='song'?'Песня':'Ноты'}

function openLesson(n){runtime={...buildLesson(n),step:0,errors:0,passed:false,sequenceDone:false,chordRound:0,earRound:0,earAnswered:false,intervalPhase:0,intervalPair:null,heardChord:[],dynamicBaseline:null,dynamicStage:0,focusChoice:null,rhythmStart:null,chordBeatStart:null};go('lesson')}

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
    <div class="theory card"><div class="sectionKicker">СНАЧАЛА ПОНЯТЬ</div><p>${escapeHtml(r.theory)}</p><div class="callout"><b>Запомни</b><span>${escapeHtml(r.tip)}</span></div></div>
    ${r.type==='setup'?renderSetupTask(r):r.type==='rhythm'?renderRhythmTask(r):r.type==='interval'?renderIntervalTask(r):r.type==='chord'?renderChordTask(r):r.type==='chordEar'?renderChordEarTask(r):r.type==='musical'?renderMusicalTask(r):r.type==='song'?renderSongCourseTask(r):renderSequenceTask(r)}
    <div class="lessonFooter card"><div><b>Как пройти дальше</b><span>${lessonFooterText(r)}</span></div><div class="footerBtns"><button class="ghostBtn" id="repeatTheoryBtn">↻ Объяснение</button><button class="ghostBtn" id="restartLesson">↻ С начала</button></div></div>
  `;
  bindBack();
  $('#lessonSound').onclick=()=>playTarget(r);
  $('#repeatTheoryBtn').onclick=()=>showTheory(r);$('#restartLesson').onclick=()=>{r.step=0;r.errors=0;r.passed=false;r.sequenceDone=false;r.chordRound=0;r.intervalPhase=0;r.heardChord=[];r.dynamicStage=0;r.focusChoice=null;r.rhythmStart=null;r.chordBeatStart=null;r.earAnswered=false;renderLesson()};
  if(r.type==='setup')bindSetup(r); else if(r.type==='rhythm')bindRhythm(r); else if(r.type==='interval')bindInterval(r); else if(r.type==='chord')bindChord(r); else if(r.type==='chordEar')bindChordEar(r); else if(r.type==='musical')bindMusical(r); else if(r.type==='song')bindSongCourse(r); else bindSequence(r);
}
function lessonFooterText(r){if(r.type==='setup')return'Сначала подключи микрофон и сыграй одну ноту. Дальше курс всё покажет сам.';if(r.type==='song')return r.songKind==='chord'?'Сыграй аккорд как показано. Можно нажать ноты одновременно или очень быстро по очереди.':'Сейчас показывается только одна конкретная цель. После правильного звука откроется следующая.';if(r.type==='rhythm')return'Неверное попадание не двигает счётчик. Дождись следующего удара метронома.';if(r.type==='musical')return r.sequenceDone?'После игры выбери, что ты сознательно изменил в исполнении.':'Сначала сыграй фразу. Затем приложение попросит короткую музыкальную самопроверку.';if(r.type==='interval')return'Сначала сыграй первую ноту, потом вторую. Приложение ждёт обе части.';if(r.type==='chord')return r.chordRhythm?'Сыграй весь аккорд точно вместе с пульсом.':'Все три звука должны быть услышаны в одной попытке.';if(r.type==='chordEar')return'Сначала послушай аккорд, выбери мажор или минор и только потом переходи дальше.';return'Сейчас показывается только одна цель. После правильного звука откроется следующая.'}
function renderSetupTask(r){return `<div class="task card setupTask"><div class="taskTop"><div class="taskLabel">ПОДГОТОВКА</div><span class="taskTag">без спешки</span></div><div class="setupSteps"><div class="setupItem ${mic.stream?'done':''}"><span>1</span><div><b>Микрофон</b><small>${mic.stream?'Подключён':'Нужен доступ к микрофону'}</small></div></div><div class="setupItem"><span>2</span><div><b>Одна клавиша</b><small>Цель: ДО, ${octave(60)} октава</small></div></div></div>${!mic.stream?'<button class="primary full" id="setupMic">🎙 Подключить микрофон</button>':''}<div class="targetCard"><div class="targetMeta"><span>ПЕРВАЯ ЦЕЛЬ</span><b>сыграй ДО</b></div>${staffSvg([60],60,'treble')}${keyboardHtml(60)}</div><div id="lessonFeedback">${feedbackMarkup('wait','Жду звук','Сыграй ДО на своём синтезаторе.')}</div></div>`}
function renderSongCourseTask(r){
  const song=SONGS.find(s=>s.id===r.songId)||SONGS[0];
  if(r.songKind==='timer') return `<div class="task card"><div class="taskTop"><div class="taskLabel">ПРАКТИКА ПЕСНИ</div><span class="taskTag">3 мини-шага</span></div><div class="focusCard"><div class="focusIcon">⏱</div><div><b>Схема на 15 минут</b><p>5 мин — новые места · 5 мин — медленно · 5 мин — чистый прогон.</p></div></div><div class="miniCheckList"><button class="checkStep" data-selfstep="0">○ Новые места</button><button class="checkStep" data-selfstep="1">○ Медленно</button><button class="checkStep" data-selfstep="2">○ Чистый прогон</button></div><button class="primary full" id="songPlanDone">Готово → к следующей задаче</button></div>`;
  if(r.songKind==='choose'){
    const target=r.steps[0];
    return `<div class="task card"><div class="taskTop"><div class="taskLabel">УЗНАЙ НОТУ</div><span class="taskTag">выбор</span></div><div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div>${staffSvg([target],target,guessClef(target))}<div class="targetHint">Какая клавиша соответствует цели?</div><div class="choiceGrid">${[target,(target+2)%12+60,(target+4)%12+60].map((m,i)=>`<button class="choiceBtn" data-choice="${m}">${noteName(m)}</button>`).join('')}</div></div><div id="lessonFeedback">${feedbackMarkup('wait','Выбери ответ','Сначала прочитай название ноты на карточке.')}</div></div>`;
  }
  if(r.songKind==='chord') return `<div class="task card"><div class="taskTop"><div class="taskLabel">МЕЛОДИЯ + АККОРД</div><span class="taskTag">${r.step+1} / ${r.steps.length}</span></div><div class="targetCard"><div class="targetName">До мажор</div><div class="targetMeta"><span>до · ми · соль</span><b>3 звука</b></div>${staffSvg([60,64,67],null,'treble')}${keyboardHtml(60,[60,64,67])}<div class="targetHint">Сыграй все три звука. Микрофон соберёт их за одну попытку.</div></div><div id="lessonFeedback">${feedbackMarkup('wait','Жду аккорд','Сначала сыграй до, ми и соль.')}</div></div>`;
  const target=r.steps[Math.min(r.step,r.steps.length-1)];
  const hideKeyboard=r.songKind==='reading';
  return `<div class="task card"><div class="taskTop"><div class="taskLabel">${r.songKind==='rhythm'?'ИГРА С ПУЛЬСОМ':r.songKind==='slow'?'МЕДЛЕННЫЙ ПРОГОН':r.songKind==='final'?'ФИНАЛЬНЫЙ ПРОГОН':'МИНИ-ФРАГМЕНТ'}</div><span class="taskTag">${Math.min(r.step+1,r.steps.length)} / ${r.steps.length}</span></div><div class="songFocus"><div class="songMiniArt">${song.icon}</div><div><b>${escapeHtml(song.title)}</b><span>${escapeHtml(song.difficulty)} · ${escapeHtml(r.objective)}</span></div></div><div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${noteText(target)}</span><b>${r.songKind==='left'?'Левая рука':r.songKind==='right'?'Правая рука':'Сейчас сыграй'}</b></div>${staffSvg([target],target,guessClef(target))}${hideKeyboard?'':keyboardHtml(target)}<div class="targetHint">${r.songKind==='reading'?'Смотри прежде всего на нотный стан.':'Сыграй именно эту ноту на настоящем синтезаторе.'}</div></div><div id="lessonFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteName(target)}.`)}</div>${r.errors>=2?`<div class="hintBox"><b>Подсказка</b><span>Сейчас нужна ${escapeHtml(noteName(target))}. Посмотри на название и на подсвеченную клавишу.</span></div>`:''}</div>`;
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

function keyboardHtml(target,targets=[]){const low=48,high=84,whites=[];for(let m=low;m<=high;m++)if(WHITE_PC.includes(pitchClass(m)))whites.push(m);const width=36;const idx=new Map(whites.map((m,i)=>[m,i]));const exactTargets=targets.length?targets:(Number.isFinite(target)?[target]:[]);let html='';for(const m of whites)html+=`<button type="button" class="pKey whiteKey ${exactTargets.includes(m)?'target':''}" data-pitch="${m}" style="left:${idx.get(m)*width}px" aria-label="${escapeHtml(noteText(m))}"></button>`;for(let m=low;m<=high;m++)if(!WHITE_PC.includes(pitchClass(m))){const before=whites.findIndex(w=>w>m)-1;if(before>=0)html+=`<button type="button" class="pKey blackKey ${exactTargets.includes(m)?'target':''}" data-pitch="${m}" style="left:${before*width+24}px" aria-label="${escapeHtml(noteText(m))}"></button>`}return `<div class="keyboardWrap"><div class="keyboard" style="width:${whites.length*width}px">${html}</div></div>`}

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
function playTone(m,beat=.16){
  try{if(!oscillatorCtx)oscillatorCtx=new (window.AudioContext||window.webkitAudioContext)();const now=oscillatorCtx.currentTime;const o=oscillatorCtx.createOscillator(),g=oscillatorCtx.createGain();o.type='sine';o.frequency.value=440*Math.pow(2,(m-69)/12);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.13,now+.02);g.gain.exponentialRampToValueAtTime(.0001,now+beat);o.connect(g).connect(oscillatorCtx.destination);o.start(now);o.stop(now+beat+.03)}catch{}}
function playToneGroup(notes,dur=.42){notes.forEach((m,i)=>setTimeout(()=>playTone(m,dur*.8),i*14))}
function intervalName(a,b){const d=Math.abs(b-a)%12;return ({0:'повтор',1:'секунда',2:'секунда',3:'терция',4:'терция',5:'кварта',6:'кварта с увеличением',7:'квинта',8:'секста',9:'секста',10:'септима',11:'септима'}[d]||'интервал')}

function onDetected(midiValue, meta={}){
  if(route==='lesson' && runtime && !runtime.passed){if(runtime.type==='setup'){handleSetupDetected(midiValue);return}if(runtime.type==='rhythm'){handleRhythmDetected(midiValue,meta);return}if(runtime.type==='interval'){handleIntervalDetected(midiValue);return}if(runtime.type==='chordEar'){return}if(runtime.type==='chord'||runtime.type==='song'&&runtime.songKind==='chord'){handleChordDetected(midiValue);return}if(runtime.type==='song'){handleSongCourseDetected(midiValue,meta);return}handleSequenceDetected(midiValue,meta);return}
  if(route==='song' && songRuntime){handleSongDetected(midiValue);return}
  if(route==='practice'){handlePracticeDetection(midiValue,meta);}
}
function setLessonFeedback(kind,title,body){const el=$('#lessonFeedback');if(el)el.innerHTML=feedbackMarkup(kind,title,body)}
function flashKeys(midiList,good){midiList.forEach(m=>{const k=$(`[data-pitch="${m}"]`);if(k){k.classList.remove('hit','wrong');void k.offsetWidth;k.classList.add(good?'hit':'wrong');setTimeout(()=>k.classList.remove('hit','wrong'),280)}})}
function handleSetupDetected(m){if(m===60){runtime.passed=true;setLessonFeedback('good','Верно!','Первая нота распознана. Курс готов.');setTimeout(()=>{completeLesson(1);toast(`Урок 1 завершён · +${xpFor(1)} XP`);renderLessonComplete(runtime)},420)}else{setLessonFeedback('bad','Попробуй ещё',`Услышана ${noteText(m)}. Сейчас нужна ДО, 4 октава.`)}}
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
  $('#practice').innerHTML=`${header('Практика','home','ТРЕНАЖЁР')}<div class="tabBar"><button class="pill ${practiceState.tab==='notes'?'active':''}" data-practice="notes">🎼 Ноты</button><button class="pill ${practiceState.tab==='chords'?'active':''}" data-practice="chords">⌬ Аккорды</button><button class="pill ${practiceState.tab==='session'?'active':''}" data-practice="session">⏱ 5 минут</button><button class="pill ${practiceState.tab==='weak'?'active':''}" data-practice="weak">↗ Слабые места</button></div><div id="practiceBody"></div>`;
  $$('[data-practice]').forEach(b=>b.onclick=()=>{practiceState.tab=b.dataset.practice;practiceState.notePassed=false;practiceState.chordPassed=false;practiceState.chordSeen=[];renderPractice()});
  bindBack();
  if(practiceState.tab==='notes')renderPracticeNotes(); else if(practiceState.tab==='chords')renderPracticeChords(); else if(practiceState.tab==='session')renderPracticeSession(); else renderPracticeWeak();
}
function newPracticeNote(){let pool=[60,62,64,65,67,69,71];if(practiceState.tab==='weak'){const weak=Object.entries(state.mistakes||{}).sort((a,b)=>b[1]-a[1]).map(([m])=>+m).filter(m=>pool.includes(m));if(weak.length)pool=weak}let next=pool[Math.floor(Math.random()*pool.length)];if(pool.length>1&&next===practiceState.note)next=pool[(pool.indexOf(next)+1)%pool.length];practiceState.note=next;practiceState.notePassed=false}
function renderPracticeNotes(){if(practiceState.note==null)newPracticeNote();const t=practiceState.note;$('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">ОДНА ЦЕЛЬ ЗА РАЗ</div><p>Сначала приложение показывает название, нотный стан и точную клавишу. Ты играешь на своём инструменте. Только правильная нота открывает следующую.</p></div><div class="task card"><div class="taskTop"><div class="taskLabel">ТЕКУЩАЯ ЦЕЛЬ</div><span class="taskTag">${practiceState.notePassed?'пройдена':'жду звук'}</span></div><div class="targetCard"><div class="targetName">${noteName(t)}</div><div class="targetMeta"><span>${noteText(t)}</span><b>Сыграй на синтезаторе</b></div>${staffSvg([t],t,guessClef(t))}${keyboardHtml(t)}</div><div id="practiceFeedback">${feedbackMarkup(practiceState.notePassed?'good':'wait',practiceState.notePassed?'Верно!':'Жду звук',practiceState.notePassed?'Следующая цель доступна.':`Сыграй ${noteName(t)}.`)}</div><button class="primary full ${practiceState.notePassed?'':'disabled'}" id="nextPracticeNote">${practiceState.notePassed?'→ Следующая нота':'Сначала сыграй правильно'}</button><button class="ghostBtn full" id="hearPractice">🔊 Послушать цель</button></div>`;$('#nextPracticeNote').onclick=()=>{if(!practiceState.notePassed)return;newPracticeNote();renderPractice()};$('#hearPractice').onclick=()=>playTone(t)}
function renderPracticeChords(){if(!practiceState.chord)practiceState.chord={root:'до',type:'major'};const c=practiceState.chord,notes=chord(c.root,c.type),passed=practiceState.chordPassed;$('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">ТРЕНАЖЁР АККОРДОВ</div><p>Для надёжного распознавания можно нажать три нужные клавиши почти одновременно. Микрофон собирает несколько частот в одной попытке.</p></div><div class="filterRow">${CHORD_TYPES.map(t=>`<button class="pill ${c.type===t?'active':''}" data-ctype="${t}">${CHORD_LABELS[t]}</button>`).join('')}</div><div class="task card"><div class="taskTop"><div class="taskLabel">ТЕКУЩИЙ АККОРД</div><span class="taskTag">${passed?'пройден':'жду аккорд'}</span></div><div class="targetCard"><div class="targetName">${escapeHtml(c.root)} ${CHORD_LABELS[c.type]}</div><div class="targetMeta"><span>${escapeHtml(chordText(c.root,c.type))}</span><b>3 звука</b></div>${staffSvg(notes,null,'treble')}${keyboardHtml(notes[0],notes)}<div class="targetHint">Сыграй три ноты вместе. Если инструмент звучит не одновременно, сыграй их очень быстро по очереди.</div></div><div id="practiceChordFeedback">${feedbackMarkup(passed?'good':'wait',passed?'Аккорд верный!':'Жду аккорд',passed?'Все нужные звуки найдены.':`Сыграй ${c.root} ${CHORD_LABELS[c.type]}.`)}</div><button class="primary full ${passed?'':'disabled'}" id="nextPracticeChord">${passed?'→ Следующий аккорд':'Сначала сыграй правильно'}</button><button class="ghostBtn full" id="hearPracticeChord">🔊 Послушать аккорд</button></div>`;$$('[data-ctype]').forEach(b=>b.onclick=()=>{practiceState.chord.type=b.dataset.ctype;practiceState.chordPassed=false;practiceState.chordSeen=[];renderPractice()});$('#nextPracticeChord').onclick=()=>{if(!passed)return;practiceState.chord.root=Object.keys(ROOT_PC)[Math.floor(Math.random()*Object.keys(ROOT_PC).length)];practiceState.chordPassed=false;practiceState.chordSeen=[];renderPractice()};$('#hearPracticeChord').onclick=()=>playToneGroup(notes)}
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
  if(st.finished){$('#practiceBody').innerHTML=`<div class="completeHero card"><div class="completeIcon">✓</div><div class="eyebrow">5-МИНУТНАЯ СЕССИЯ</div><h2>Сессия закончена</h2><p>Ты успел пройти ${st.correct} ${plural(st.correct,'цель','цели','целей')} и получил новый набор опыта для адаптивной практики.</p><div class="reward">+25 XP</div><div class="completeActions"><button class="primary" id="restartSession">Новая сессия</button><button class="secondary" id="backPractice">К нотам</button></div></div>`;$('#restartSession').onclick=()=>{practiceState.session=null;practiceState.note=null;practiceState.notePassed=false;renderPractice()};$('#backPractice').onclick=()=>{practiceState.tab='notes';practiceState.session=null;renderPractice()};return}
  if(!st.started){$('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">ФОКУС · 5 МИНУТ</div><h2>Одна цель за раз, без пауз между заданиями</h2><p>После правильной ноты следующая появляется автоматически. Неверная нота учитывается как ошибка, но не останавливает сессию. В конце ты увидишь результат.</p><button class="primary full" id="startSession">▶ Начать 5 минут</button></div><div class="card focusCard"><div class="focusIcon">⏱</div><div><b>Как проходит сессия</b><p>1. Увидел ноту → 2. сыграл на синтезаторе → 3. сразу получил следующую.</p></div></div>`;$('#startSession').onclick=startPracticeSession;return}
  const left=Math.max(0,st.endsAt-Date.now());const m=Math.floor(left/60000),sec=Math.floor(left/1000)%60;const target=st.queue[st.index%st.queue.length];practiceState.note=target;
  $('#practiceBody').innerHTML=`<div class="card sessionHeader"><div><div class="sectionKicker">ФОКУС · 5 МИНУТ</div><h2>Играем без остановки</h2><p>${st.correct} правильных · ${st.errors||0} ошибок</p></div><div class="sessionTimer" id="sessionClock">${m}:${String(sec).padStart(2,'0')}</div></div><div class="task card"><div class="targetCard"><div class="targetName">${noteName(target)}</div><div class="targetMeta"><span>${noteText(target)}</span><b>Следующая цель откроется автоматически</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}</div><div id="practiceSessionFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteName(target)}.`)}</div><button class="ghostBtn full" id="hearSession">🔊 Послушать цель</button></div>`;
  $('#hearSession').onclick=()=>playTone(target);updateSessionTimerUI(st);
}

function renderPracticeWeak(){
  const mistakes=state.mistakes||{};const rows=Object.entries(mistakes).sort((a,b)=>b[1]-a[1]).slice(0,7);if(!rows.length){$('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">ПОКА НЕТ ДАННЫХ</div><p>Ошибки появятся здесь после нескольких уроков и тренировок. Приложение будет использовать их, чтобы чаще возвращать именно сложные ноты.</p><button class="primary full" id="weakStart">Тренировать ноты</button></div>`;$('#weakStart').onclick=()=>{practiceState.tab='weak';practiceState.note=null;renderPractice();};return}
  $('#practiceBody').innerHTML=`<div class="card explainer"><div class="sectionKicker">АДАПТИВНАЯ ПРАКТИКА</div><p>Здесь собраны цели, на которых ты чаще ошибался. Ноты отсортированы по числу ошибок.</p></div><div class="weakList">${rows.map(([m,c],i)=>`<button class="weakRow" data-weak="${m}"><span>${i+1}</span><div><b>${noteText(+m)}</b><small>${c} ${plural(c,'ошибка','ошибки','ошибок')}</small></div><strong>→</strong></button>`).join('')}</div>`;$$('[data-weak]').forEach(b=>b.onclick=()=>{practiceState.tab='notes';practiceState.note=+b.dataset.weak;practiceState.notePassed=false;renderPractice()})
}
function handlePracticeDetection(m,meta){
  if(practiceState.tab==='notes'||practiceState.tab==='weak'){const t=practiceState.note;if(m===t){practiceState.notePassed=true;$('#practiceFeedback').innerHTML=feedbackMarkup('good','Верно!',`Услышана ${noteText(m)}.`);$('#practiceSessionFeedback')?.setAttribute('style','');if($('#practiceSessionFeedback'))$('#practiceSessionFeedback').innerHTML=feedbackMarkup('good','Верно!','Нажми «Следующая цель».');flashKeys([m],true)}else{state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();const el=$('#practiceFeedback')||$('#practiceSessionFeedback');if(el)el.innerHTML=feedbackMarkup('bad','Попробуй ещё',`Услышана ${noteText(m)}. Нужна ${noteText(t)}.`);flashKeys([m],false)}}
  else if(practiceState.tab==='session'){const st=practiceState.session,t=practiceState.note;if(m===t){st.correct=(st.correct||0)+1;state.mistakes=state.mistakes||{};save();flashKeys([m],true);toast('Верно! Следующая цель','good');st.index++;practiceState.notePassed=false;setTimeout(renderPractice,220)}else{st.errors=(st.errors||0)+1;state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();if($('#practiceSessionFeedback'))$('#practiceSessionFeedback').innerHTML=feedbackMarkup('bad','Попробуй ещё',`Услышана ${noteText(m)}. Нужна ${noteText(t)}.`);flashKeys([m],false)}}
  else{const c=practiceState.chord,notes=chord(c.root,c.type),now=performance.now();practiceState.chordSeen=practiceState.chordSeen.filter(x=>now-x.at<900);practiceState.chordSeen.push({m,at:now});const pcs=[...new Set(practiceState.chordSeen.map(x=>pitchClass(x.m)))],wanted=new Set(notes.map(pitchClass));const good=[...wanted].every(p=>pcs.includes(p));if(good){practiceState.chordPassed=true;practiceState.chordSeen=[];$('#practiceChordFeedback').innerHTML=feedbackMarkup('good','Аккорд верный!','Все три звука совпали.')}else{$('#practiceChordFeedback').innerHTML=feedbackMarkup(wanted.has(pitchClass(m))?'wait':'bad',wanted.has(pitchClass(m))?'Собираем аккорд':'Лишний звук',wanted.has(pitchClass(m))?`Совпало ${pcs.filter(p=>wanted.has(p)).length} из 3.`:`Услышана ${noteName(m)} — она не входит в этот аккорд.`)}}
}

function renderSongs(){
  const filter=window.songFilter||'Все', cat=window.songCategory||'Все', q=(window.songSearch||'').trim().toLowerCase();
  const levels=['Все','Очень легко','Легко','Средне','Продвинуто','Избранное'],cats=['Все',...new Set(SONGS.map(s=>s.category))];
  const favorites=state.favorites||[];
  const list=SONGS.filter(s=>(filter==='Все'||(filter==='Избранное'&&favorites.includes(s.id))||(filter!=='Избранное'&&s.difficulty===filter))&&(cat==='Все'||cat===s.category)&&(!q||(s.title+' '+s.author+' '+s.tags.join(' ')).toLowerCase().includes(q)));
  $('#songs').innerHTML=`${header('Песни','home',`БИБЛИОТЕКА · ${SONGS.length} ПРОЕКТОВ`)}<div class="songIntro card"><div><b>Библиотека, к которой хочется возвращаться</b><span>Начинай с лёгких проектов, открывай новые стили и переходи к полным версиям через собственный MIDI.</span></div></div><div class="songSearch"><input id="songSearch" value="${escapeHtml(window.songSearch||'')}" placeholder="Найти песню, автора или жанр…" aria-label="Поиск песни"><button id="clearSongSearch">×</button></div><div class="filterRow levelFilters">${levels.map(l=>`<button class="pill ${filter===l?'active':''}" data-song-filter="${l}">${l}</button>`).join('')}</div><div class="filterRow catFilters">${cats.map(c=>`<button class="pill ${cat===c?'active':''}" data-song-category="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join('')}</div><div class="songResults"><span>${list.length} ${plural(list.length,'проект','проекта','проектов')}</span><span>${window.songSearch||cat!=='Все'||filter!=='Все'?'Фильтр активен':'Все проекты'}</span></div><div class="songGrid">${list.length?list.map(s=>`<button class="songCard ${s.colorClass}" data-song="${s.id}"><div class="songIcon">${s.icon}</div><div class="songInfo"><span class="songLevel">${s.difficulty} · ${s.category}${favorites.includes(s.id)?' · ★':''}</span><h2>${escapeHtml(s.title)}</h2><p>${escapeHtml(s.author)}</p><div class="tagLine">${s.tags.map(t=>`<span>${escapeHtml(t)}</span>`).join('')}</div></div><span class="arrow">›</span></button>`).join(''):'<div class="emptyState card"><b>Ничего не найдено</b><span>Попробуй другой запрос или сбрось фильтр.</span></div>'}</div>`;
  $('#songSearch').oninput=e=>{window.songSearch=e.target.value;clearTimeout(renderSongs._t);renderSongs._t=setTimeout(renderSongs,180)};$('#clearSongSearch').onclick=()=>{window.songSearch='';renderSongs()};
  $$('[data-song-filter]').forEach(b=>b.onclick=()=>{window.songFilter=b.dataset.songFilter;renderSongs()});$$('[data-song-category]').forEach(b=>b.onclick=()=>{window.songCategory=b.dataset.songCategory;renderSongs()});$$('[data-song]').forEach(b=>b.onclick=()=>openSong(b.dataset.song));bindBack();
}

function openSong(id){const s=SONGS.find(x=>x.id===id);if(!s)return;songRuntime={song:s,mode:'part',step:0,seq:s.fragment.slice(),loaded:false,error:false};state.activeSong=id;save();go('song')}
function videoEmbed(url){if(!url)return null;try{const u=new URL(url);if(u.hostname.includes('youtube.com')&&u.searchParams.get('v'))return`https://www.youtube.com/embed/${u.searchParams.get('v')}?rel=0`;return null}catch{return null}}
function videoSearchUrl(s){return `https://www.youtube.com/results?search_query=${encodeURIComponent(s.title+' piano tutorial')}`}
function videoBlock(s){const embed=videoEmbed(s.video);if(embed)return `<div class="videoWrap"><iframe loading="lazy" src="${embed}" title="${escapeHtml(s.title)} — ${escapeHtml(s.videoLabel)}" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe><div class="videoCaption"><span>Видео · ${escapeHtml(s.videoLabel)}</span><a href="${escapeHtml(s.video)}" target="_blank" rel="noopener">Открыть ↗</a></div></div>`;if(s.video)return `<div class="videoExternal card"><div class="videoExternalIcon">▶</div><div><b>${escapeHtml(s.videoLabel)}</b><span>Открыть конкретный видео-урок во внешней вкладке.</span></div><a class="primary" href="${escapeHtml(s.video)}" target="_blank" rel="noopener">Смотреть ↗</a></div>`;return `<div class="videoExternal card"><div class="videoExternalIcon">▶</div><div><b>Видео-урок для этой песни</b><span>Я не подставляю выдуманную ссылку. Откроется поиск tutorial по названию.</span></div><a class="primary" href="${escapeHtml(videoSearchUrl(s))}" target="_blank" rel="noopener">Открыть ↗</a></div>`}
function renderSong(){const s=songRuntime.song;const mode=songRuntime.mode;$('#song').innerHTML=`${header(s.title,'songs',`${s.difficulty.toUpperCase()} · ${escapeHtml(s.author)}`)}<div class="songHero ${s.colorClass} card"><div class="songHeroIcon">${s.icon}</div><div class="songHeroText"><div class="songLevel">${s.difficulty} · ${s.category}</div><h2>${escapeHtml(s.title)}</h2><p>${escapeHtml(s.desc)}</p></div><button class="favoriteBtn ${((state.favorites||[]).includes(s.id))?'active':''}" id="favoriteSong">${((state.favorites||[]).includes(s.id))?'★':'☆'}</button></div>${videoBlock(s)}<div class="card songTeacher"><div class="sectionKicker">КАК МЫ УЧИМ ПЕСНЮ</div><div class="roadMap">${['Познакомиться','Правая рука','Левая рука','Вместе','Прогон'].map((x,i)=>`<span class="${i===0?'active':''}"><i>${i+1}</i>${x}</span>`).join('')}</div><div class="songModeTabs"><button class="pill ${mode==='part'?'active':''}" data-song-mode="part">▶ Учить по частям</button><button class="pill ${mode==='full'?'active':''}" data-song-mode="full">🎵 Играть целиком</button></div><div id="songPanel"></div></div><div class="card midiPanel"><div><div class="sectionKicker">ПОЛНАЯ ВЕРСИЯ ИЗ MIDI</div><p>Загрузив свой MIDI-файл, ты можешь учить именно ту версию песни, которую хочешь играть. Файл читается локально в браузере.</p></div><label class="fileBtn">Выбрать MIDI<input id="midiInput" type="file" accept=".mid,.midi" hidden></label></div>`;bindBack();$$('[data-song-mode]').forEach(b=>b.onclick=()=>{songRuntime.mode=b.dataset.songMode;if(songRuntime.mode==='full'&&!songRuntime.loaded)songRuntime.seq=s.fragment.slice();renderSong()});$('#midiInput').onchange=onMidiFile;$('#favoriteSong').onclick=()=>{state.favorites=state.favorites||[];if(state.favorites.includes(s.id))state.favorites=state.favorites.filter(x=>x!==s.id);else state.favorites.push(s.id);save();renderSong()};renderSongPanel()}
function renderSongPanel(){const s=songRuntime.song,completed=songRuntime.step>=songRuntime.seq.length;const target=songRuntime.seq[Math.min(songRuntime.step,songRuntime.seq.length-1)];const full=songRuntime.mode==='full';$('#songPanel').innerHTML=full?renderFullSongPanel(s,target,completed):renderPartSongPanel(s,target,completed);$('#songRestart')?.addEventListener('click',()=>{songRuntime.step=0;songRuntime.error=false;renderSongPanel()});$('#songHear')?.addEventListener('click',()=>{if(target!=null)playTone(target)});$('#songFullRestart')?.addEventListener('click',()=>{songRuntime.step=0;renderSongPanel()});}
function renderPartSongPanel(s,target,completed){return `<div class="songLesson cardInner"><div class="songStatus"><div><span class="microLabel">ШАГ ${Math.min(songRuntime.step+1,songRuntime.seq.length)} ИЗ ${songRuntime.seq.length}</span><h3>${completed?'Фрагмент готов!':'Сейчас нужна одна конкретная нота'}</h3></div><span class="statusEmoji">${completed?'✓':'♪'}</span></div>${completed?`<div class="feedback goodBig"><b>Отлично. Фрагмент сыгран.</b><small>Теперь попробуй его ещё раз или перейди к режиму целиком.</small></div><button class="primary full" id="songRestart">↻ Пройти фрагмент ещё раз</button>`:`<div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${noteText(target)}</span><b>Сыграй на синтезаторе</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}<div class="targetHint">Нужна именно эта нота. Приложение не перейдёт дальше, пока она не прозвучит.</div></div><div id="songFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteName(target)}.`)}</div><div class="actionRow"><button class="secondary" id="songHear">🔊 Послушать</button><button class="ghostBtn" id="songRestart">↻ С начала</button></div>`}</div>`}
function renderFullSongPanel(s,target,completed){return `<div class="songLesson cardInner"><div class="fullIntro"><div class="bigRound">${completed?'✓':'♪'}</div><div><span class="microLabel">${songRuntime.loaded?'ТВОЙ MIDI':'ПРОБНЫЙ ПРОГОН'}</span><h3>${completed?'Прогон завершён':'Играем по ноте за раз'}</h3><p>${songRuntime.loaded?'Приложение читает загруженную последовательность.':'Для точного разбора своей версии загрузите MIDI. Приложение прочитает порядок нот локально и проведёт тебя по нему.'}</p></div></div>${completed?`<button class="primary full" id="songFullRestart">↻ Ещё один прогон</button>`:`<div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${noteText(target)}</span><b>${songRuntime.loaded?`Нота ${songRuntime.step+1} из ${songRuntime.seq.length}`:'Держи пульс'}</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}<div id="songFeedback">${feedbackMarkup('wait','Жду звук',`Сыграй ${noteName(target)}.`)}</div></div><div class="actionRow"><button class="secondary" id="songHear">🔊 Послушать</button><button class="ghostBtn" id="songFullRestart">↻ С начала</button></div>`}</div>`}
function handleSongDetected(m){const st=songRuntime;if(!st||st.step>=st.seq.length)return;const target=st.seq[st.step];if(m===target){flashKeys([m],true);st.step++;toast(st.step===st.seq.length?'Фрагмент готов':'Верно!','good');renderSongPanel()}else{$('#songFeedback').innerHTML=feedbackMarkup('bad','Попробуй ещё',`Услышана ${noteText(m)}. Сейчас нужна ${noteText(target)}.`);flashKeys([m],false)}}

async function onMidiFile(e){const f=e.target.files?.[0];if(!f)return;try{const buf=await f.arrayBuffer();const notes=parseMidi(buf);if(!notes.length)throw new Error();songRuntime.seq=notes.slice(0,1200).map(x=>x.note);songRuntime.step=0;songRuntime.loaded=true;songRuntime.mode='full';toast(`Загружено ${songRuntime.seq.length} нот`);renderSong()}catch{toast('Не удалось прочитать этот MIDI','bad')}}
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

async function startMic(){
  if(mic.stream){toast('Микрофон уже подключён','good');return}
  if(!navigator.mediaDevices?.getUserMedia){toast('Браузер не поддерживает микрофон','bad');return}
  try{
    mic.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,channelCount:1}});
    mic.ctx=new (window.AudioContext||window.webkitAudioContext)();mic.source=mic.ctx.createMediaStreamSource(mic.stream);mic.analyser=mic.ctx.createAnalyser();mic.analyser.fftSize=8192;mic.analyser.smoothingTimeConstant=.04;mic.source.connect(mic.analyser);mic.freq=new Float32Array(mic.analyser.frequencyBinCount);mic.lastMidi=null;mic.candidateMidi=null;mic.candidateSince=0;mic.lastDispatch=0;mic.lastSeen=0;micLoop();toast('Микрофон подключён','good');render();
  }catch(e){stopMic();toast('Доступ к микрофону не выдан','bad')}
}
function stopMic(){if(mic.raf)cancelAnimationFrame(mic.raf);mic.stream?.getTracks().forEach(t=>t.stop());try{mic.ctx?.close()}catch{};mic={stream:null,ctx:null,source:null,analyser:null,freq:null,raf:0,lastMidi:null,candidateMidi:null,candidateSince:0,lastDispatch:0,lastSeen:0,lastChordSig:'',lastChordDispatch:0,ignoreScalarUntil:0};render()}
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

window.addEventListener('beforeunload',()=>{mic.stream?.getTracks().forEach(t=>t.stop());stopMetronome()});
$$('[data-nav]').forEach(b=>b.onclick=()=>go(b.dataset.nav));$('#brand').onclick=()=>go('home');
ensureDay();render();
