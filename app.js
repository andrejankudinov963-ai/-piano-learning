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
  'Старт: что делать на первом уроке','Октава: как устроена клавиатура','Находим ДО по двум чёрным','Пять пальцев: ДО–СОЛЬ','Переставляем пальцы спокойно','Правая рука: позиция ДО–СОЛЬ','Левая рука: позиция ДО–СОЛЬ','Точки-ориентиры по всей клавиатуре','Пять пальцев вверх и вниз','Первая короткая мелодия',
  'Что такое пульс','Считаем 1–2–3–4','Долгий и короткий звук','Пауза — это тоже музыка','Ровный пульс на одной ноте','Две длительности в одной фразе','Сильная и слабая доля','Метроном: первый уверенный круг','Ритмический рисунок без смены нот','Мелодия с пульсом',
  'Нотный стан: карта высоты','Скрипичный ключ: где живёт СОЛЬ','Басовый ключ: где живёт ФА','Среднее ДО как мост между ключами','МИ на стане','СОЛЬ на стане','ФА и ЛЯ в басу','Читаем направление нот','Шаг вверх и шаг вниз','Через одну ноту','Четыре ноты без подсказки','Не путаем линию и промежуток','Читаем маленькую фразу','Правая рука читает','Левая рука читает',
  'Расстояние между нотами: что это','Секунда — один шаг между нотами','Терция — прыжок через одну','Кварта — четыре ступени','Квинта — пять ступеней','Вверх и вниз','Повтор звука против движения','Одинаковый рисунок выше','Вопрос и ответ','Мини-этюд на интервалы',
  'Что такое аккорд','Трезвучие из трёх нот','До мажор','Ля минор','Фа мажор','Соль мажор','Ми минор','Ре минор','Переход ДО–СОЛЬ','Переход ДО–ФА','Переход ДО–ЛЯ минор','Четыре аккорда по кругу','Мажор или минор на слух','Ровная аккордовая пульсация','Мелодия поверх аккорда',
  'До мажор: гамма','Ля минор: гамма','Соль мажор: гамма','Фа мажор: гамма','Каким пальцем играть правой рукой','Каким пальцем играть левой рукой','Большой палец в движении','Гамма вверх','Гамма вниз','Вверх и вниз без остановки','Арпеджио из трезвучия','Гамма как разминка',
  'Независимость пальцев','Четыре звука ровно','Чистота важнее скорости','Метроном: добавляем темп','Контроль силы удара','Легато: связная линия','Стаккато: лёгкий отрыв','Акцент на первой ноте','Три уровня громкости','Короткая техническая связка',
  'Левая рука как бас','Бас + аккорд','Простой вальсовый рисунок','Мелодия справа, бас слева','Мелодия справа, аккорд слева','Не ускоряемся при смене рук','Баланс двух рук','Повторяющийся рисунок левой руки','Держим повторяющийся рисунок','Собираем восьмитактовую фразу',
  'Фраза как предложение','Где закончить музыкальную мысль','Тише внутри фразы','Вершина фразы','Педаль: зачем она','Смена педали без каши','Нота между долями','Три ноты на один пульс',
  'Как заниматься 13 минут','Как разбирать песню по кусочкам','Песня: понимаем схему обучения','Песня: узнаём первую ноту','Песня: первая мини-фраза правой','Песня: ещё одна мини-фраза','Песня: левая рука отдельно','Песня: соединяем два фрагмента','Песня: четыре ноты без спешки','Песня: добавляем пульс','Песня: убираем одну подсказку','Песня: играем связку целиком','Песня: аккорд и мелодия вместе','Песня: пробный прогон','Финал курса: сложный музыкальный проект'
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


/* V7 library expansion: 50 song projects. These entries intentionally carry
   no invented 'exact' transcription. Use the per-song MIDI importer for the
   precise arrangement you want to teach. */
SONGS.push(
  {id:'unravel',title:'unravel',author:'TK from Ling tosite sigure',difficulty:'Средне',level:3,category:'Аниме',icon:'🕸️',colorClass:'shadow',video:null,videoLabel:'Найти tutorial',desc:'Один из самых узнаваемых аниме-проектов. Для точного разбора загрузите MIDI нужной аранжировки.',tags:['аниме','мелодия'],fragment:[64,67,69,71,69,67,64,62]},
  {id:'gurenge',title:'Gurenge',author:'LiSA',difficulty:'Средне',level:3,category:'Аниме',icon:'🔥',colorClass:'ember',video:null,videoLabel:'Найти tutorial',desc:'Энергичный проект с акцентами. Точную партию можно загрузить через MIDI.',tags:['аниме','ритм'],fragment:[64,64,67,69,67,64,62,60]},
  {id:'bluebird',title:'Blue Bird',author:'Ikimono-gakari',difficulty:'Средне',level:3,category:'Аниме',icon:'🐦',colorClass:'sky',video:null,videoLabel:'Найти tutorial',desc:'Быстрая мелодия для тренировки ровности и координации.',tags:['аниме','скорость'],fragment:[67,69,71,72,71,69,67,65]},
  {id:'crossingfield',title:'Crossing Field',author:'LiSA',difficulty:'Средне',level:3,category:'Аниме',icon:'⚔️',colorClass:'blade',video:null,videoLabel:'Найти tutorial',desc:'Мелодический проект с устойчивым пульсом и переходами.',tags:['аниме','мелодия'],fragment:[64,67,69,72,71,69,67,64]},
  {id:'cruelangel',title:'A Cruel Angel’s Thesis',author:'Yoko Takahashi',difficulty:'Средне',level:3,category:'Аниме',icon:'👼',colorClass:'angel',video:null,videoLabel:'Найти tutorial',desc:'Классика аниме-опенингов. Точная версия зависит от аранжировки.',tags:['аниме','ритм'],fragment:[60,62,64,67,69,67,64,62]},
  {id:'hikaranara',title:'Hikaru Nara',author:'Goose house',difficulty:'Средне',level:3,category:'Аниме',icon:'🌸',colorClass:'sakura',video:null,videoLabel:'Найти tutorial',desc:'Светлый проект на лёгкую артикуляцию и быстрые смены.',tags:['аниме','артикуляция'],fragment:[62,64,67,69,67,65,64,62]},
  {id:'againfma',title:'Again',author:'YUI',difficulty:'Средне',level:3,category:'Аниме',icon:'🔁',colorClass:'again',video:null,videoLabel:'Найти tutorial',desc:'Мелодия с чётким пульсом и запоминающимися фразами.',tags:['аниме','ритм'],fragment:[64,65,67,69,67,65,64,60]},
  {id:'onesummersday',title:'One Summer’s Day',author:'Joe Hisaishi',difficulty:'Продвинуто',level:4,category:'Кино',icon:'🌤️',colorClass:'summer',video:null,videoLabel:'Найти tutorial',desc:'Выразительная тема для фразировки, баланса и педали.',tags:['кино','педаль'],fragment:[60,64,67,72,69,65,64,60]},
  {id:'windforest',title:'The Path of the Wind',author:'Joe Hisaishi',difficulty:'Средне',level:3,category:'Кино',icon:'🌬️',colorClass:'wind',video:null,videoLabel:'Найти tutorial',desc:'Плавная тема для легато и мягкой динамики.',tags:['кино','легато'],fragment:[60,62,64,67,65,64,62,60]},
  {id:'zeldalullaby',title:'Zelda’s Lullaby',author:'Koji Kondo',difficulty:'Средне',level:3,category:'Игры',icon:'🪽',colorClass:'hyrule',video:null,videoLabel:'Найти tutorial',desc:'Спокойная игровая тема для чтения и фразировки.',tags:['игры','мелодия'],fragment:[62,65,67,69,67,65,62,60]},
  {id:'dragonborn',title:'Dragonborn Comes',author:'The Elder Scrolls V: Skyrim',difficulty:'Средне',level:3,category:'Игры',icon:'🐉',colorClass:'dragon',video:null,videoLabel:'Найти tutorial',desc:'Тема для басовой опоры и мощного пульса.',tags:['игры','бас'],fragment:[60,60,67,65,64,62,60,55]},
  {id:'lastofus',title:'The Last of Us — Theme',author:'Gustavo Santaolalla',difficulty:'Продвинуто',level:4,category:'Игры',icon:'🎸',colorClass:'lastofus',video:null,videoLabel:'Найти tutorial',desc:'Медленный выразительный проект на повторяющиеся рисунки.',tags:['игры','фразировка'],fragment:[60,64,67,69,67,64,62,60]},
  {id:'beneathmask',title:'Beneath the Mask',author:'Shoji Meguro',difficulty:'Средне',level:3,category:'Игры',icon:'🎭',colorClass:'mask',video:null,videoLabel:'Найти tutorial',desc:'Спокойный грув для контроля пульса и аккордов.',tags:['игры','аккорды'],fragment:[60,64,67,65,64,62,60,62]},
  {id:'tloztheme',title:'The Legend of Zelda — Main Theme',author:'Koji Kondo',difficulty:'Средне',level:3,category:'Игры',icon:'🟩',colorClass:'zelda',video:null,videoLabel:'Найти tutorial',desc:'Энергичная тема для ритма и смены регистров.',tags:['игры','ритм'],fragment:[64,67,69,72,71,69,67,64]}
)

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
 <div class="dashboardGrid"><button class="levelCard card clickable" id="openLevel"><div class="dashIcon">⭐</div><div><div class="sectionKicker">УРОВЕНЬ</div><b>${lvl}</b><small>${state.xp} XP · ${100-pct} до следующего</small></div><div class="miniProgress"><i style="width:${pct}%"></i></div></button><button class="miniFeature card clickable" id="openAchievements"><span>🏆</span><div><b>Достижения</b><small>${ach} из ${v6AchievementList().length} открыто</small></div><strong>›</strong></button></div>
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

/* Initial render is intentionally deferred until ALL version layers are initialized.
   V10 wraps renderHome() below; calling render earlier triggers the temporal-dead-zone
   error "Cannot access 'V10_BASE_RENDER_HOME' before initialization". */


/* =======================================================================
   PIANO LEARNING V7 — FINAL EXPERIENCE LAYER
   This is one app.js file. No external patch file is required.
   ======================================================================= */

/* ---------- 1) More useful lesson theory, same page structure ---------- */
LESSON_TITLES[1] = 'Октава: как устроена клавиатура';
LESSON_TITLES[2] = 'Находим ДО по двум чёрным клавишам';

const V7_THEORY_EXTRA = {
  octave: 'Октава — это расстояние от одной ноты до такой же ноты выше или ниже. Между, например, ДО и следующим ДО находится 12 полутонов и семь белых нот: ДО, РЕ, МИ, ФА, СОЛЬ, ЛЯ, СИ. На пятиоктавном синтезаторе ты увидишь один и тот же рисунок снова и снова, только выше или ниже.',
  black: 'Чёрные клавиши идут группами по две и по три. Это не случайный рисунок: он повторяется на каждой октаве и помогает быстро определить белые клавиши вокруг него. ДО всегда находится непосредственно слева от группы из двух чёрных клавиш.',
  finger: 'Номера пальцев нужны не ради красивых цифр, а чтобы повторять одно и то же движение без путаницы. Большой палец — 1, указательный — 2, средний — 3, безымянный — 4, мизинец — 5.',
  pulse: 'Пульс можно представить как ровные шаги: 1–2–3–4. Ноты могут быть короткими, длинными или попадать между шагами, но внутренний счёт остаётся устойчивым.',
  staff: 'Нотный стан показывает не клавишу напрямую, а высоту звука. Чем выше положение ноты на стане, тем выше её звучание; ключ задаёт ориентиры, по которым мы читаем эти позиции.',
  interval: 'Интервалы помогают видеть не отдельные символы, а движение между ними. Если следующая нота рядом, это небольшой шаг; если она заметно выше или ниже, глаз должен заранее подготовиться к скачку.',
  chord: 'В трезвучии три звука образуют одну гармоническую форму. В мажоре между корнем и средней нотой четыре полутона, в миноре — три. Именно это небольшое изменение заметно меняет характер звучания.',
  scale: 'Гамма — это последовательность ступеней внутри тональности. Она нужна не только для скорости: она учит порядок нот, подготовку большого пальца и ощущение направления.',
  technique: 'Техника — это способ сделать движение предсказуемым. Сначала мозг и пальцы учатся повторять одинаковый жест, и только после этого можно безопасно добавлять темп.',
  hands: 'Когда работают две руки, им не обязательно повторять одно и то же. Обычно правая ведёт мелодию, а левая даёт бас или гармонию. Поэтому полезно сначала понимать роль каждой руки отдельно.',
  musical: 'Музыкальность начинается там, где ты специально решаешь, что слушатель должен услышать впереди, а что — оставить фоном. Громкость, фразировка, акцент и педаль работают вместе, а не по отдельности.',
  song: 'Песню удобнее изучать слоями: услышать, понять маленький кусок, сыграть одной рукой, добавить вторую, соединить с ритмом и только потом играть целиком. Так новая информация не перегружает память.'
};

const V7_BASE_THEORY = window.theoryForDisplay;
window.theoryForDisplay = function(r){
  const d = V7_BASE_THEORY ? V7_BASE_THEORY(r) : {title:r.title,body:r.theory||'',plain:r.tip||'',prereq:''};
  const t = (r.title||'').toLowerCase();
  let extra = '';
  if(r.n===2) extra = V7_THEORY_EXTRA.octave;
  else if(/чёрн|две чёрн|три чёрн/.test(t)) extra = V7_THEORY_EXTRA.black;
  else if(/пальц|апплик/.test(t) || r.type==='scale') extra = V7_THEORY_EXTRA.finger;
  else if(/пульс|дол|метроном|ритм/.test(t) || r.type==='rhythm') extra = V7_THEORY_EXTRA.pulse;
  else if(/нотн|ключ|линия|промеж|стан|читать|чита/.test(t) || r.type==='reading') extra = V7_THEORY_EXTRA.staff;
  else if(/интервал|секунд|терц|кварт|квинт|движен|скач/.test(t) || r.type==='interval') extra = V7_THEORY_EXTRA.interval;
  else if(/аккорд|мажор|минор|трезвуч/.test(t) || r.type==='chord' || r.type==='chordEar') extra = V7_THEORY_EXTRA.chord;
  else if(r.type==='technique') extra = V7_THEORY_EXTRA.technique;
  else if(r.type==='hands') extra = V7_THEORY_EXTRA.hands;
  else if(r.type==='musical') extra = V7_THEORY_EXTRA.musical;
  else if(r.type==='song') extra = V7_THEORY_EXTRA.song;
  if(r.n===2){
    d.title='Что такое октава?';
    d.body='На пианино одна и та же последовательность из семи белых нот повторяется снова и снова. Расстояние от ДО до следующего ДО называется одной октавой. Поэтому ДО 2-й и ДО 4-й — это одна и та же нота по имени, но разные регистры: четвёртый ДО звучит выше второго.';
    d.plain='Сначала найди группу из двух чёрных клавиш. Слева от неё — ДО. Сдвинься к следующему такому же ДО — ты перешёл на одну октаву.';
  }
  if(extra && !d.body.includes(extra)) d.body = `${d.body||''} ${extra}`.trim();
  return d;
};

/* ---------- 2) Course targets are deliberate across octaves 1–5 ---------- */
const V7_BASE_BUILD_LESSON = window.buildLesson;
function v7CourseSteps(n, original){
  const pcs=[0,2,4,5,7,9,11];
  const o = x => 12*(x+1);
  const mk = (oct, pc) => o(oct)+pc;
  if(n===2) return [mk(4,0),mk(5,0),mk(3,0),mk(4,0)];
  if(n===3) return [mk(3,0),mk(4,0),mk(5,0)];
  if(n>=4 && n<=10){
    const octs=[4,5,3,4,5,2,4];
    return Array.from({length:Math.min(6, 3+(n%4))},(_,i)=>mk(octs[(n+i)%octs.length],pcs[(n+i)%pcs.length]));
  }
  if(n>=11 && n<=20){
    const oct=(n%4)+1;
    return [mk(oct,0),mk(oct,2),mk(oct,4),mk(oct,5),mk(oct,7),mk(oct,4)].slice(0,4+(n%3));
  }
  if(n>=21 && n<=35){
    const octs=[2,3,4,5];
    return Array.from({length:5+(n%3)},(_,i)=>mk(octs[(n+i)%octs.length],pcs[(n+i)%pcs.length]));
  }
  if(n>=36 && n<=45){
    return [mk(2,0),mk(2,4),mk(3,7),mk(4,0),mk(5,7)].slice(0,3+(n%3));
  }
  if(n>=46 && n<=60){
    const oct=2+(n%3);
    if(n===48) return chord('до','major',oct);
    if(n===49) return chord('ля','minor',oct);
    return original.steps && original.steps.length ? original.steps.map((m,i)=>m-(60-mk(oct,0))) : [mk(oct,0),mk(oct,4),mk(oct,7)];
  }
  if(n>=61 && n<=72){
    const oct=1+((n-61)%5);
    if(original.steps?.length) return original.steps.map(m=>m + (mk(oct,0)-60));
  }
  if(n>=73 && n<=92){
    const oct=1+((n-73)%5);
    return (original.steps||[60,62,64,65]).map((m,i)=>m + (mk(oct,0)-60));
  }
  if(n>=93 && n<=100){
    const oct=2+((n-93)%4);
    return (original.steps||[60,62,64,67]).map(m=>m + (mk(oct,0)-60));
  }
  return original.steps;
}
window.buildLesson = function(n){
  const r = V7_BASE_BUILD_LESSON(n);
  if(!r) return r;
  r.steps = v7CourseSteps(n,r) || r.steps;
  if(n===2){
    r.title='Октава: как устроена клавиатура';
    r.objective='Понять, что такое октава, научиться находить одинаковые ноты на разной высоте и увидеть повторяющийся рисунок клавиатуры.';
    r.theory='Октава — это расстояние от одной ноты до следующей такой же. На клавиатуре этот рисунок повторяется: семь белых нот и группы из двух и трёх чёрных клавиш.';
    r.tip='Сначала найди две чёрные клавиши. Слева от первой находится ДО. Следующее ДО через семь белых нот — это уже новая октава.';
    r.anyOctave=false;
    r.steps=[60,72,48,60];
  }
  return r;
};

/* ---------- 3) Retry after mistakes instead of trapping the lesson ---------- */
const V7_BASE_SEQUENCE_TASK = window.renderSequenceTask;
window.renderSequenceTask = function(r){
  const target=r.steps[Math.min(r.step,r.steps.length-1)];
  const derivedHand=(r.hand&&r.hand!=='B')?r.hand:(r.type==='hands'?(target<60?'L':'R'):'B');
  const handText=HAND_LABELS[derivedHand];
  const dynamicText=r.dynamic?({'soft':'мягко','normal':'обычно','strong':'чуть ярче'}[r.dynamic[r.dynamicStage]||'normal']):'';
  const retry=r.errors>=3;
  return `<div class="task card">
    <div class="taskTop"><div class="taskLabel">${r.type==='hands'?'СОЕДИНЯЕМ РУКИ':r.type==='technique'?'ТЕХНИКА':'СЫГРАЙ СЕЙЧАС'}</div><span class="taskTag">${r.step+1} / ${r.steps.length}</span></div>
    ${r.type==='technique'&&r.dynamic?`<div class="focusStrip"><span>Сила звука</span><b>${dynamicText}</b><small>После правильной ноты следующий этап изменится.</small></div>`:''}
    <div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${noteText(target)}</span><b>${escapeHtml(handText)}</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}<div class="targetHint">Здесь важны и название, и октава. Сыграй именно указанную клавишу.</div></div>
    <div id="lessonFeedback">${feedbackMarkup(r.errors?'bad':'wait',r.errors?'Нужна ещё одна попытка':'Жду звук',r.errors?`Сыграй ${noteText(target)} ещё раз.`:`Сыграй ${noteText(target)}.`)}</div>
    ${r.errors>=2?`<div class="hintBox"><b>Подсказка</b><span>Нужна ${escapeHtml(noteText(target))}. Посмотри на подсвеченную клавишу и сравни её с рисунком чёрных клавиш.</span></div>`:''}
    ${retry?`<div class="retryAction card"><div><b>Три ошибки — это не конец</b><small>Сбрось текущую попытку и спокойно сыграй цель ещё раз.</small></div><button class="secondary" id="retryLessonAttempt">↻ Попробовать ещё раз</button></div>`:''}
  </div>`;
};

const V7_BASE_RENDER_LESSON = window.renderLesson;
window.renderLesson = function(){
  V7_BASE_RENDER_LESSON();
  const b=$('#retryLessonAttempt');
  if(b) b.onclick=()=>{runtime.errors=0;runtime.sequenceDone=false;runtime.passed=false;renderLesson();};
};

/* ---------- 4) Exact octave everywhere it is explicitly shown ---------- */
const V7_BASE_HANDLE_PRACTICE = window.handlePracticeDetection;
window.handlePracticeDetection = function(m,meta){
  if(practiceState.tab==='notes'||practiceState.tab==='weak'){
    const t=practiceState.note;
    if(t==null)return;
    const ok=m===t;
    if(ok){
      practiceState.notePassed=true;
      markActive();
      state.stats=state.stats||{};
      state.stats.notes=(state.stats.notes||0)+1;
      v6EnsureStats().perfectRun=(v6EnsureStats().perfectRun||0)+1;
      save();
      const el=$('#practiceFeedback');
      if(el)el.innerHTML=feedbackMarkup('good','Верно!',`Распознано ${noteText(m)} — точное совпадение.`);
      flashKeys([m],true);
    }else{
      v6EnsureStats().perfectRun=0;
      state.mistakes=state.mistakes||{};
      state.mistakes[m]=(state.mistakes[m]||0)+1;
      save();
      const el=$('#practiceFeedback');
      if(el)el.innerHTML=feedbackMarkup('bad','Попробуй ещё',`Услышано ${noteText(m)}. Нужно ${noteText(t)}.`);
      flashKeys([m],false);
    }
    return;
  }
  if(practiceState.tab==='session'&&practiceState.warmup?.started&&!practiceState.warmup.finished){
    const w=practiceState.warmup,t=practiceState.note;
    if(m===t){w.correct++;w.index++;practiceState.note=randomPracticeMidi();v6EnsureStats().perfectRun=(v6EnsureStats().perfectRun||0)+1;save();flashKeys([m],true);renderPractice();}
    else{w.errors++;v6EnsureStats().perfectRun=0;state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();const el=$('#practiceSessionFeedback');if(el)el.innerHTML=feedbackMarkup('bad','Почти',`Услышано ${noteText(m)}. Нужно ${noteText(t)}.`);flashKeys([m],false);}
    return;
  }
  if(practiceState.tab==='tuner'){handleTunerDetected(m,meta);return;}
  if(practiceState.tab==='chords'){handlePracticeChordDetected([m]);return;}
  return V7_BASE_HANDLE_PRACTICE ? V7_BASE_HANDLE_PRACTICE(m,meta) : undefined;
};

/* ---------- 5) Ear training gets clear selectable modes ---------- */
practiceState.earMode=practiceState.earMode||'note';
practiceState.earType=practiceState.earType||'majorMinor';
let v7EarRound=null;
function v7NewEarNote(){
  const pcs=[0,2,4,5,7,9,11];
  let pc=pcs[Math.floor(Math.random()*pcs.length)];
  let n=12*(4+1)+pc;
  if(v7EarRound?.target===n)n=12*(4+1)+pcs[(pcs.indexOf(pc)+1)%pcs.length];
  v7EarRound={target:n};
}
function v7NewEarChord(){
  const roots=Object.keys(ROOT_PC), types=['major','minor','diminished','sus2','sus4'];
  const root=roots[Math.floor(Math.random()*roots.length)];
  const type=practiceState.earType==='majorMinor' ? (Math.random()>.5?'major':'minor') : types[Math.floor(Math.random()*types.length)];
  v7EarRound={root,type,midi:chord(root,type,4)};
}
function v7RenderEar(){
  const mode=practiceState.earMode||'note';
  if(mode==='note' && !v7EarRound?.target) v7NewEarNote();
  if(mode==='chord' && !v7EarRound?.midi) v7NewEarChord();
  const e=v7EarRound;
  if(mode==='note'){
    const choices=[0,2,4,5,7,9,11].map(pc=>60+pc);
    return `<div class="practiceCard card earPracticeCard">
      <div class="sectionKicker">СЛУХ · НОТЫ</div><h2>Узнай ноту по звучанию</h2>
      <p>Название скрыто до твоего ответа. Сначала слушай, затем выбирай одну из семи нот.</p>
      <button class="primary full" id="v7EarPlay">🔊 Послушать ноту</button>
      <div class="earChoices">${choices.map(m=>`<button class="choiceBtn" data-v7-ear-note="${m}">${noteName(m)}</button>`).join('')}</div>
      <div class="earHint">В этой тренировке октава не важна: важен сам характер ноты.</div>
    </div>`;
  }
  const typeButtons=practiceState.earType==='majorMinor' ? ['major','minor'] : ['major','minor','diminished','sus2','sus4'];
  return `<div class="practiceCard card earPracticeCard">
    <div class="sectionKicker">СЛУХ · АККОРДЫ</div><h2>${practiceState.earType==='majorMinor'?'Мажор или минор?':'Какой это аккорд?'}</h2>
    <p>Здесь название и ноты скрыты. Слушай весь аккорд целиком, а не отдельную ноту.</p>
    <div class="earModeRow"><button class="pill ${practiceState.earType==='majorMinor'?'active':''}" data-v7-ear-type="majorMinor">Мажор / минор</button><button class="pill ${practiceState.earType==='all'?'active':''}" data-v7-ear-type="all">Все типы</button></div>
    <button class="primary full" id="v7EarPlay">🔊 Послушать аккорд</button>
    <div class="earChoices">${typeButtons.map(t=>`<button class="choiceBtn" data-v7-ear-chord="${t}">${CHORD_LABELS[t]}</button>`).join('')}</div>
    <div id="v7EarFeedback">${feedbackMarkup('wait','Готово','Выбери ответ после прослушивания.')}</div>
  </div>`;
}
function bindV7Ear(){
  $('#v7EarPlay')?.addEventListener('click',()=>{
    if(practiceState.earMode==='note') playTone(v7EarRound.target,1.35);
    else playToneGroup(v7EarRound.midi);
  });
  $$('[data-v7-ear-type]').forEach(b=>b.onclick=()=>{practiceState.earType=b.dataset.v7EarType;v7EarRound=null;renderPractice();});
  $$('[data-v7-ear-note]').forEach(b=>b.onclick=()=>{
    const ok=pitchClass(+b.dataset.v7EarNote)===pitchClass(v7EarRound.target);
    v6EnsureStats().ear=(v6EnsureStats().ear||0)+1;markActive();save();
    toast(ok?'Верно!':'Не угадал',ok?'good':'');
    $('#practiceContent').insertAdjacentHTML('beforeend','');
    renderPractice();
    setTimeout(()=>{$('#v7EarFeedback')?.replaceChildren();},0);
  });
  $$('[data-v7-ear-chord]').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.v7EarChord===v7EarRound.type;
    v6EnsureStats().ear=(v6EnsureStats().ear||0)+1;markActive();save();
    const wrap=$('#v7EarFeedback');if(wrap)wrap.innerHTML=feedbackMarkup(ok?'good':'bad',ok?'Верно!':'Пока нет',`Правильный ответ: ${CHORD_LABELS[v7EarRound.type]}.`);
    if(ok)setTimeout(()=>{v7EarRound=null;renderPractice();},650);
  });
}
const V7_BASE_RENDER_PRACTICE = window.renderPractice;
window.renderPractice = function(){
  if((practiceState.tab||'notes')==='ear'){
    $('#practice').innerHTML=`${header('Практика','home','ТРЕНАЖЁР')}<div class="practiceTabs">${[['notes','Ноты'],['chords','Аккорды'],['ear','Слух'],['tuner','Тюнер'],['weak','Слабые места'],['session','⚡ 3 минуты']].map(x=>`<button class="practiceTab ${practiceState.tab===x[0]?'active':''}" data-practice="${x[0]}">${x[1]}</button>`).join('')}</div><div class="practiceExplain card"><b>Тренируем слух отдельно от игры.</b><span>Выбери режим: отдельные ноты или разные типы аккордов.</span></div><div class="earModeGrid"><button class="earModeCard ${practiceState.earMode==='note'?'active':''}" id="v7EarModeNote"><span>♪</span><b>Ноты</b><small>Определять высоту одной ноты на слух</small></button><button class="earModeCard ${practiceState.earMode==='chord'?'active':''}" id="v7EarModeChord"><span>⌬</span><b>Аккорды</b><small>Различать мажор, минор и другие типы</small></button></div><div id="practiceContent">${v7RenderEar()}</div>`;
    $$('[data-practice]').forEach(b=>b.onclick=()=>{practiceState.tab=b.dataset.practice;renderPractice();});
    $('#v7EarModeNote').onclick=()=>{practiceState.earMode='note';v7EarRound=null;renderPractice();};
    $('#v7EarModeChord').onclick=()=>{practiceState.earMode='chord';v7EarRound=null;renderPractice();};
    bindV7Ear();
    return;
  }
  V7_BASE_RENDER_PRACTICE();
};

/* ---------- 6) Full five-octave visual keyboard + auto-centering ---------- */
window.keyboardHtml = function(target,targets=[],mode='exact'){
  const low=24,high=84,width=34;
  const whites=[];
  for(let m=low;m<=high;m++) if(WHITE_PC.includes(pitchClass(m))) whites.push(m);
  const idx=new Map(whites.map((m,i)=>[m,i]));
  const exactTargets=targets.length?targets:(Number.isFinite(target)?[target]:[]);
  const isTarget=m=>mode==='pitchClass'?pitchClass(m)===pitchClass(target):exactTargets.includes(m);
  let html='';
  for(const m of whites){
    html+=`<button type="button" class="pKey whiteKey ${isTarget(m)?'target':''}" data-pitch="${m}" style="left:${idx.get(m)*width}px" aria-label="${escapeHtml(noteText(m))}"><span class="keyNoteLabel">${pitchClass(m)===0?noteText(m):''}</span></button>`;
  }
  for(let m=low;m<=high;m++) if(!WHITE_PC.includes(pitchClass(m))){
    const before=whites.findIndex(w=>w>m)-1;
    if(before>=0) html+=`<button type="button" class="pKey blackKey ${isTarget(m)?'target':''}" data-pitch="${m}" style="left:${before*width+23}px" aria-label="${escapeHtml(noteText(m))}"></button>`;
  }
  const targetValue=Number.isFinite(target)?target:exactTargets[0];
  return `<div class="keyboardWrap fullRangeKeyboard" data-autofocus-midi="${Number.isFinite(targetValue)?targetValue:''}"><div class="keyboard" style="width:${whites.length*width}px">${html}</div></div>`;
};
function v7CenterKeyboard(){
  const wraps=$$('.fullRangeKeyboard');
  wraps.forEach(w=>{
    const m=Number(w.dataset.autofocusMidi);if(!Number.isFinite(m))return;
    const key=w.querySelector(`[data-pitch="${m}"]`);if(!key)return;
    const left=key.offsetLeft+key.offsetWidth/2;
    w.scrollLeft=Math.max(0,left-w.clientWidth/2);
  });
}
const V7_BASE_RENDER = window.render;
window.render = function(){V7_BASE_RENDER();requestAnimationFrame(v7CenterKeyboard);};

/* ---------- 7) Octave-aware audio engine: MPM + spectrum cross-check ---------- */
function v7DbToAmp(db){ return Math.pow(10,Math.max(-100,db)/20); }
function v7SpectrumAmp(freqData,sr,fftSize,f){
  if(!freqData||!Number.isFinite(f)||f<=0||f>=sr/2)return 0;
  const bin=f*fftSize/sr;
  const center=Math.round(bin);
  let best=0;
  for(let d=-2;d<=2;d++){
    const i=center+d;
    if(i>=1&&i<freqData.length) best=Math.max(best,v7DbToAmp(freqData[i]));
  }
  return best;
}
function v7SpectralScore(freqData,sr,fftSize,midi){
  const f0=v6FrequencyForMidi(midi);
  if(f0<27||f0>1000)return -Infinity;
  let score=0, weight=0;
  for(let h=1;h<=10;h++){
    const f=f0*h;if(f>=sr/2)break;
    const a=v7SpectrumAmp(freqData,sr,fftSize,f);
    const w=(1/Math.pow(h,.78));
    score += Math.log1p(a*40)*w;
    weight += w;
  }
  /* Odd partials are very useful for rejecting the common octave-up false
     positive when the fundamental is weaker than the second harmonic. */
  for(const h of [3,5,7,9]){
    const f=f0*h;if(f>=sr/2)break;
    score += Math.log1p(v7SpectrumAmp(freqData,sr,fftSize,f)*40)*.65;
  }
  return weight?score/weight:score;
}
function v7FindMidiFromCandidates(rawMidi,freqData,sr,fftSize){
  const center=Math.round(rawMidi);
  const candidates=[];
  for(let shift=-2;shift<=2;shift++){
    for(const octShift of [-24,-12,0,12,24]){
      const m=center+shift+octShift;
      if(m>=24&&m<=84)candidates.push(m);
    }
  }
  const unique=[...new Set(candidates)];
  let best=center,bestScore=-Infinity;
  for(const m of unique){
    const spectral=v7SpectralScore(freqData,sr,fftSize,m);
    const freqPenalty=Math.abs(m-center)*.035;
    const score=spectral-freqPenalty;
    if(score>bestScore){bestScore=score;best=m;}
  }
  return best;
}
function v7DetectPitch(buf,sr){
  let mean=0;for(let i=0;i<buf.length;i++)mean+=buf[i];mean/=buf.length;
  let rms=0;for(let i=0;i<buf.length;i++){const x=buf[i]-mean;rms+=x*x;}rms=Math.sqrt(rms/buf.length);
  if(rms<0.0035)return null;
  let rawFreq=null,clarity=0;
  if(v6Pitchy?.PitchDetector){
    try{
      if(!v6PitchDetector||v6PitchDetector.inputLength!==buf.length)v6PitchDetector=v6Pitchy.PitchDetector.forFloat32Array(buf.length);
      const res=v6PitchDetector.findPitch(buf,sr);
      if(Number.isFinite(res?.[0])){rawFreq=res[0];clarity=Number(res[1])||0;}
    }catch{}
  }
  if(!rawFreq){
    /* YIN-like normalized difference fallback. */
    let bestTau=-1,best=Infinity;
    const minTau=Math.floor(sr/1100),maxTau=Math.min(Math.floor(sr/27),buf.length-2);
    for(let tau=minTau;tau<=maxTau;tau+=2){
      let diff=0,n=0;
      for(let i=0;i<buf.length-tau;i+=2){const d=(buf[i]-mean)-(buf[i+tau]-mean);diff+=d*d;n++;}
      const v=diff/(n||1);if(v<best){best=v;bestTau=tau;}
    }
    if(bestTau<0)return null;
    rawFreq=sr/bestTau;
    clarity=Math.max(0,Math.min(1,1-best/(rms*rms*2+1e-9)));
  }
  if(!Number.isFinite(rawFreq)||rawFreq<27||rawFreq>1100||clarity<.54)return null;
  const rawMidi=v6MidiFromFreq(rawFreq);
  let midi=Math.round(rawMidi);
  if(mic?.freq) midi=v7FindMidiFromCandidates(rawMidi,mic.freq,sr,mic.analyser?.fftSize||buf.length);
  if(midi<24||midi>84)return null;
  const exactMidi=v6MidiFromFreq(rawFreq);
  const cents=(exactMidi-midi)*100;
  return {midi,confidence:clarity,rms,cents,rawFreq,correctedFreq:v6FrequencyForMidi(midi)};
}
window.detectPitch=v7DetectPitch;

/* One stable note, but with octave agreement across frames. */
v6StableFrames=[];
function v7StableResult(result){
  if(!result)return null;
  v6StableFrames.push({midi:result.midi,confidence:result.confidence,cents:result.cents,freq:result.rawFreq});
  if(v6StableFrames.length>10)v6StableFrames.shift();
  const counts=new Map();
  for(const x of v6StableFrames)counts.set(x.midi,(counts.get(x.midi)||0)+1);
  const ranked=[...counts.entries()].sort((a,b)=>b[1]-a[1]);
  if(!ranked.length)return null;
  const [m,count]=ranked[0];
  if(count<3)return null;
  const same=v6StableFrames.filter(x=>x.midi===m);
  return {midi:m,confidence:same.reduce((a,x)=>a+x.confidence,0)/same.length,cents:same.reduce((a,x)=>a+x.cents,0)/same.length,freq:same.reduce((a,x)=>a+x.freq,0)/same.length};
}
function v7UpdateMicLive(result){
  v6UpdateLive(result);
  const el=$('#micLive');
  if(!el||!result)return;
  el.innerHTML=`<span class="micLiveDot good"></span><b>${escapeHtml(noteText(result.midi))}</b><small>${Math.round(result.rawFreq)} Hz · ${Math.round(result.confidence*100)}% · ${result.cents>=0?'+':''}${Math.round(result.cents)}¢</small>`;
}
window.micLoop=function(){
  if(!mic.analyser)return;
  const buf=new Float32Array(mic.analyser.fftSize);
  mic.analyser.getFloatTimeDomainData(buf);
  mic.analyser.getFloatFrequencyData(mic.freq);
  const now=performance.now();
  const chordContext=(route==='practice'&&practiceState.tab==='chords')||(route==='lesson'&&runtime&&(runtime.type==='chord'||runtime.type==='song'&&runtime.songKind==='chord'));
  if(chordContext&&mic.freq){
    const poly=v7DetectChordPitches(mic.freq,mic.ctx.sampleRate,mic.analyser.fftSize);
    if(poly.length>=2){
      const sig=poly.map(pitchClass).sort((a,b)=>a-b).join(',');
      if(sig!==mic.lastChordSig||now-mic.lastChordDispatch>700){mic.lastChordSig=sig;mic.lastChordDispatch=now;mic.ignoreScalarUntil=now+240;onChordDetected(poly);}
    }
  }
  const result=now<mic.ignoreScalarUntil?null:v7DetectPitch(buf,mic.ctx.sampleRate);
  if(result){
    mic.lastSeen=now;v7UpdateMicLive(result);
    const stable=v7StableResult(result);
    if(stable){
      const m=stable.midi;
      if(m===mic.candidateMidi){
        if(!mic.candidateSince)mic.candidateSince=now;
        if(now-mic.candidateSince>=120&&(m!==mic.lastMidi||now-mic.lastDispatch>950)){
          mic.lastMidi=m;mic.lastDispatch=now;markOctaveSeen(m);onDetected(m,{rms:result.rms,confidence:stable.confidence,cents:stable.cents,freq:stable.freq});
        }
      }else{mic.candidateMidi=m;mic.candidateSince=now;}
    }
  }else if(mic.lastSeen&&now-mic.lastSeen>180){
    mic.candidateMidi=null;mic.candidateSince=0;mic.lastMidi=null;v6StableFrames=[];
  }
  mic.raf=requestAnimationFrame(window.micLoop);
};

/* More reliable polyphonic chord estimation using harmonic combs. */
function v7DetectChordPitches(freqData,sr,fftSize){
  if(!freqData)return [];
  const candidates=[];
  for(let m=36;m<=84;m++){
    const f=v6FrequencyForMidi(m);
    let score=0,weight=0;
    for(let h=1;h<=7;h++){
      const fh=f*h;if(fh>=sr/2)break;
      const a=v7SpectrumAmp(freqData,sr,fftSize,fh);
      const w=1/Math.pow(h,.78);
      score+=Math.log1p(a*36)*w;weight+=w;
    }
    candidates.push({m,score:weight?score/weight:0});
  }
  candidates.sort((a,b)=>b.score-a.score);
  const top=candidates[0]?.score||0;if(top<=0)return [];
  const out=[];
  for(const c of candidates){
    if(c.score<top*.56)break;
    if(out.some(m=>pitchClass(m)===pitchClass(c.m)))continue;
    out.push(c.m);
    if(out.length>=5)break;
  }
  return out.length>=2?out.sort((a,b)=>a-b):[];
}
window.detectChordPitches=v7DetectChordPitches;

/* ---------- 8) MIDI import persists the exact chosen song arrangement ---------- */
state.songMidi=state.songMidi||{};
const V7_BASE_ON_MIDI_FILE = window.onMidiFile;
window.onMidiFile = async function(e){
  const f=e.target.files?.[0];if(!f)return;
  try{
    const buf=await f.arrayBuffer();
    const notes=parseMidi(buf);
    if(!notes.length)throw new Error('empty');
    const picked=notes.slice(0,2400);
    if(!songRuntime?.song)throw new Error('no song');
    const id=songRuntime.song.id;
    state.songMidi[id]={seq:picked.map(x=>x.note),events:picked,name:f.name,loadedAt:Date.now()};
    songRuntime.seq=state.songMidi[id].seq.slice();
    songRuntime.events=state.songMidi[id].events.slice();
    songRuntime.step=0;songRuntime.loaded=true;songRuntime.mode='full';
    state.songProgress=state.songProgress||{};
    const prev=state.songProgress[id]||{};
    state.songProgress[id]={...prev,source:'midi',best:Math.max(Number(prev.best)||0,0)};
    save();toast(`MIDI загружен · ${picked.length} нот`,'good');renderSong();
  }catch(err){toast('Не удалось прочитать MIDI','bad');}
};

const V7_BASE_OPEN_SONG=window.openSong;
window.openSong=function(id){
  V7_BASE_OPEN_SONG(id);
  const saved=state.songMidi?.[id];
  if(saved&&songRuntime){
    songRuntime.seq=saved.seq.slice();songRuntime.events=saved.events.slice();songRuntime.loaded=true;songRuntime.mode='full';songRuntime.step=0;
    setTimeout(()=>renderSong(),0);
  }
};

/* Flowkey-like stage descriptions, while keeping the existing five-stage UI. */
window.songStageData=function(s,stage){
  const midi=s.fragment?.slice?.()||[60,62,64,67];
  const base=12*((Math.min(5,Math.max(1,Number(s.level)||1))+1));
  const melody=midi.map(n=>base+(n-60));
  const bass=[base-12,base-7,base-5,base-7];
  const plans=[
    {name:'Послушать',kind:'listen',desc:'Сначала услышь характер фрагмента и найди его первую опорную ноту.',seq:melody.slice(0,1)},
    {name:'Правая рука',kind:'right',desc:'Разбери мелодию маленькими группами и играй только в своём темпе.',seq:melody.slice(0,4)},
    {name:'Левая рука',kind:'left',desc:'Освой опору отдельно. Она должна быть спокойнее мелодии и не торопить её.',seq:bass},
    {name:'Две руки',kind:'join',desc:'Соедини партии на сниженной скорости. Сначала точность, потом темп.',seq:melody.slice(0,6)},
    {name:'Исполнение',kind:'run',desc:'Сыграй весь доступный фрагмент без остановки и посмотри итог.',seq:melody.slice(0,8)}
  ];
  return plans[Math.max(0,Math.min(4,stage))];
};

/* Add an explicit accuracy banner to every song page. */
const V7_BASE_RENDER_SONG=window.renderSong;
window.renderSong=function(){
  V7_BASE_RENDER_SONG();
  const root=$('#song');if(!root||!songRuntime?.song)return;
  const exact=!!songRuntime.loaded;
  const old=root.querySelector('.midiPanel');
  if(old){
    const p=old.querySelector('p');if(p)p.textContent=exact?'Точная партия загружена из MIDI. Используются реальные ноты и тайминг выбранного файла.':'Встроенный пример — только учебный ориентир. Чтобы учить именно настоящую партию этой песни, загрузите MIDI нужной аранжировки.';
  }
  v7CenterKeyboard();
};

/* ---------- 9) Visual polish ---------- */
(function(){
  if(document.documentElement.dataset.v7Styled)return;
  document.documentElement.dataset.v7Styled='1';
})();

/* Ensure the final renderer and microphone start from a known state. */
window.addEventListener('load',()=>{setTimeout(()=>{window.render();v7CenterKeyboard();},40);});


/* ========================================================================
   PIANO LEARNING V8 — FINAL INTEGRATION LAYER
   Goals:
   - one reliable mono-note detector with octave calibration + harmonic checks
   - target-driven chord recognition with temporal accumulation
   - separate microphone-check room + remembered permission/reconnect
   - retry after the first mistake; hint after 3 retries
   - 54 Steam-style achievements, exactly 14 hidden
   - one-month green activity calendar with XP intensity
   - same lesson page layout, but title-matched and beginner-friendly theory
   - 50-song library; copyrighted arrangements are never presented as exact
     unless the learner supplies a MIDI arrangement
   ======================================================================== */

const V8_STORAGE_AUDIO = 'pianoLearningV8Audio';
const V8_MIC_RANGE = {min: 24, max: 84}; // C2–C7, 61-key range
const V8_DEFAULT_FFT = 16384;

function v8AudioProfile(){
  let p = state.audioProfile;
  if(!p || typeof p!=='object') p = state.audioProfile = {};
  if(!Number.isFinite(p.octaveOffset)) p.octaveOffset = 0;
  if(typeof p.autoReconnect !== 'boolean') p.autoReconnect = false;
  if(typeof p.calibrated !== 'boolean') p.calibrated = false;
  return p;
}

function v8Clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function v8DbToAmp(db){return Math.pow(10,Math.max(-120,db)/20);}
function v8FreqForMidi(m){return 440*Math.pow(2,(m-69)/12);}
function v8MidiForFreq(f){return 69+12*Math.log2(f/440);}

/* ------------------------------------------------------------------------
   1. Lesson theory: same page, better content
   ------------------------------------------------------------------------ */
const V8_KNOWLEDGE = {
  1:{title:'Как работать с курсом',body:'Ты играешь на своём синтезаторе, а телефон только слушает звук. Сначала мы понимаем одну идею, потом сразу проверяем её на клавишах.',tip:'Не спеши. Здесь важнее понять, что именно слушает микрофон.'},
  2:{title:'Октава — одна и та же нота выше или ниже',body:'Октава — это расстояние от одной ноты до следующей такой же. Например, ДО повторяется через 12 клавиш: ДО → ДО. Поэтому на синтезаторе несколько ДО, но они находятся в разных октавах.',tip:'Найди группу из двух чёрных клавиш. ДО находится прямо слева от этой группы. Следующее ДО через 12 клавиш — новая октава.'},
  3:{title:'Почему ДО легко найти по двум чёрным',body:'Рисунок чёрных клавиш повторяется: сначала группа из двух, потом группа из трёх. Белая клавиша слева от пары — ДО. Это самый удобный ориентир в начале.',tip:'Сначала ищи рисунок 2 чёрных, и только потом название белой клавиши.'},
  4:{title:'Пять пальцев образуют удобную позицию',body:'Пять соседних белых клавиш удобно играть пятью пальцами. Номера пальцев всегда одинаковые: 1 — большой, 5 — мизинец.',tip:'Старайся не заваливать кисть и не зажимать плечо.'},
  5:{title:'Смена позиции начинается спокойно',body:'Палец не обязан растягиваться далеко. Когда позиция меняется, рука мягко переносится туда, где нужны следующие клавиши.',tip:'Сначала делай переход медленно и без напряжения.'},
  6:{title:'Правая рука обычно ведёт мелодию',body:'В простой пьесе правая рука часто играет основную мелодию. Поэтому ей полезно сразу видеть ближайшие ноты и держать ровный темп.',tip:'Большой палец — 1, указательный — 2, средний — 3, безымянный — 4, мизинец — 5.'},
  7:{title:'Левая рука часто даёт опору',body:'Левая рука нередко играет бас или аккорды. Она должна быть спокойной и устойчивой, чтобы не мешать мелодии.',tip:'Мизинец левой руки — 5, большой палец — 1.'},
  8:{title:'Ориентиры работают на всей клавиатуре',body:'Тебе не нужно запоминать каждую клавишу отдельно. Повторяющийся рисунок чёрных клавиш позволяет находить одни и те же ноты в разных регистрах.',tip:'Ищи знакомый рисунок, а не считай клавиши одну за другой.'},
  9:{title:'Пять нот вверх и вниз',body:'Ровное движение вверх и вниз готовит руку к гаммам и мелодиям. Смысл упражнения — одинаковое качество движения в обе стороны.',tip:'Не ускоряйся на спуске: темп должен оставаться тем же.'},
  10:{title:'Первая мелодия — это маленькая мысль',body:'Мелодия состоит не просто из отдельных нот. Ноты идут в определённом направлении и образуют короткую музыкальную фразу.',tip:'Сыграй сначала медленно и послушай всю фразу целиком.'},
  11:{title:'Пульс — ровные шаги музыки',body:'Пульс — это равномерные доли, которые можно представить как внутренние шаги: раз, два, три, четыре. На этот каркас накладываются ноты и паузы.',tip:'Попробуй тихо считать «раз‑два‑три‑четыре» вместе с игрой.'},
  12:{title:'Счёт 1–2–3–4 создаёт каркас',body:'Четырёхдольный метр помогает понимать, где ты находишься внутри такта. Сильная первая доля — удобная точка отсчёта.',tip:'Не сбивайся после правильной ноты: продолжай внутренний счёт.'},
  13:{title:'Долгий и короткий звук',body:'Длительность отвечает за то, как долго нота звучит. Две одинаковые ноты могут восприниматься совсем по-разному, если одну держать дольше другой.',tip:'Сначала хлопни длительности, потом сыграй их.'},
  14:{title:'Пауза тоже занимает время',body:'Пауза — это не «ничего». Это запланированное место в ритме, которое тоже нужно считать. Поэтому после короткой ноты можно сознательно ничего не играть.',tip:'Не перескакивай через паузу: продолжай считать.'},
  15:{title:'Ровная нота тренирует внутренний пульс',body:'Если оставить одну клавишу, всё внимание переносится на время. Так легче заметить, ускоряешься ты или замедляешься.',tip:'Слушай промежутки между ударами, а не только сами ноты.'},
  16:{title:'Разные длительности создают рисунок',body:'Музыкальный ритм появляется из сочетания длинных и коротких звуков. Даже без смены высоты ритм уже может быть узнаваемым.',tip:'Сначала проговори рисунок словами, потом играй.'},
  17:{title:'Сильная и слабая доля',body:'Внутри такта доли ощущаются не одинаково. Первая часто воспринимается сильнее, а остальные помогают удерживать движение.',tip:'Подчёркивай первую долю только слегка, без сильного удара.'},
  18:{title:'Метроном показывает ровный пульс',body:'Метроном не учит играть быстрее. Он даёт стабильный темп, с которым можно сравнить свою игру и заметить ускорения.',tip:'Начинай медленно: чистая игра важнее скорости.'},
  19:{title:'Один рисунок можно удерживать без смены нот',body:'Когда высота звука не меняется, ты учишься удерживать только время. Это одна из основ ровной игры.',tip:'Старайся не «догонять» метроном после ошибки.'},
  20:{title:'Ритм и мелодия работают вместе',body:'Теперь высота и время должны совпадать. Правильная нота в неправильный момент всё равно звучит иначе.',tip:'Следи за двумя вещами: какая нота и когда она появляется.'},
  21:{title:'Нотный стан показывает высоту',body:'Пять линий и четыре промежутка помогают записать, какая нота выше или ниже. Положение ноты на стане связано с её высотой.',tip:'Сначала смотри на положение ноты, потом вспоминай её название.'},
  22:{title:'Скрипичный ключ даёт ориентир СОЛЬ',body:'В скрипичном ключе завиток проходит через линию СОЛЬ. От этой точки проще находить остальные соседние ноты.',tip:'Запомни одну линию — и строй вокруг неё остальные ноты.'},
  23:{title:'Басовый ключ даёт ориентир ФА',body:'В басовом ключе две точки окружают линию ФА. Это главный ориентир для нижнего регистра.',tip:'Сначала найди ФА, потом отсчитывай соседние ноты.'},
  24:{title:'Среднее ДО соединяет два ключа',body:'Среднее ДО находится между двумя нотными системами и помогает связать правую и левую части клавиатуры.',tip:'Запомни среднее ДО как общий мост между руками.'},
  25:{title:'МИ на первой линии скрипичного ключа',body:'В скрипичном ключе нота МИ находится на первой линии снизу. Это простой ориентир рядом с ДО.',tip:'Смотри именно на линию, а не на свободное место между линиями.'},
  26:{title:'СОЛЬ на второй линии скрипичного ключа',body:'СОЛЬ — вторая линия снизу скрипичного ключа. Это один из самых полезных ориентиров для начинающего чтения.',tip:'Свяжи линию СОЛЬ с рисунком самого ключа.'},
  27:{title:'ФА и ЛЯ в басовом ключе',body:'После того как найден ФА, соседние позиции становятся намного понятнее. Так мы постепенно расширяем чтение баса.',tip:'Не пытайся помнить весь ключ сразу — держи один ориентир.'},
  28:{title:'Направление нот можно увидеть сразу',body:'Перед тем как вспоминать каждое название, посмотри: ноты идут вверх, вниз или повторяются. Это помогает читать быстрее.',tip:'Сначала смотри на движение фразы глазами.'},
  29:{title:'Шаг вверх и шаг вниз',body:'Соседние позиции на стане показывают движение на одну ступень. Такое движение обычно ощущается как небольшой шаг.',tip:'Представь лестницу: одна ступень вверх — одна ступень вниз.'},
  30:{title:'Через одну ноту — уже прыжок',body:'Когда между двумя нотами есть одна ступень, движение становится шире. Это уже не соседний шаг.',tip:'Посмотри, сколько ступеней между началом и концом.'},
  31:{title:'Четыре ноты читаем как маленький рисунок',body:'Хорошее чтение — это не бесконечное угадывание. Глаз постепенно привыкает видеть несколько нот одной фразой.',tip:'Смотри на следующую ноту заранее.'},
  32:{title:'Линия и промежуток — разные позиции',body:'Нота на линии и нота между линиями означают разные ступени. Положение нужно считывать целиком.',tip:'Не путай линию с соседним промежутком.'},
  33:{title:'Маленькая фраза читается целиком',body:'Перед началом быстро посмотри на всю фразу: направление, повторы и скачки. Это уменьшает число остановок.',tip:'Сначала смотри, потом играй.'},
  34:{title:'Правая рука читает движение заранее',body:'Когда правая рука играет мелодию, глаз уже должен искать следующую ноту. Так игра становится плавнее.',tip:'Не жди исчезновения текущей ноты.'},
  35:{title:'Левая рука читает нижний регистр',body:'Левая рука использует тот же принцип: ориентир, положение, направление и только потом движение пальца.',tip:'Читай глазами раньше, чем двигается рука.'},
  36:{title:'Интервал — расстояние между двумя нотами',body:'Интервал отвечает на вопрос «насколько далеко одна нота от другой». Это помогает узнавать рисунок мелодии даже до запоминания названий.',tip:'Представь лестницу и посчитай ступени.'},
  37:{title:'Секунда — соседний шаг',body:'Секунда соединяет соседние ступени. На слух это небольшое движение вверх или вниз.',tip:'Сыграй две соседние ноты и почувствуй маленький шаг.'},
  38:{title:'Терция — прыжок через одну ступень',body:'В терции между нотами остаётся одна ступень. Такой интервал часто встречается в мелодиях и аккордах.',tip:'Не тяни руку: ориентируйся на форму.'},
  39:{title:'Кварта — более широкий интервал',body:'Кварта охватывает четыре ступени. Чем шире расстояние, тем полезнее заранее видеть конечную ноту.',tip:'Сначала запомни две точки, потом сыграй их.'},
  40:{title:'Квинта — сильный ориентир',body:'Квинта охватывает пять ступеней и часто встречается в басах и простых гармониях.',tip:'Сыграй ДО–СОЛЬ и запомни ширину формы.'},
  41:{title:'Один интервал можно играть вверх и вниз',body:'Расстояние остаётся тем же, даже если направление меняется. Так полезно тренировать форму, а не только порядок нот.',tip:'Попробуй один и тот же интервал в обе стороны.'},
  42:{title:'Повтор звука — это отсутствие движения',body:'Если две ноты одинаковые, расстояние между ними равно нулю. Это полезно отличать от очень маленького интервала.',tip:'Послушай, что звук не меняется по высоте.'},
  43:{title:'Один рисунок можно перенести выше',body:'Музыкальная идея сохраняет форму, даже когда начинается с другой ноты. Так мозг учится видеть шаблоны.',tip:'Смотри на форму, а не только на названия.'},
  44:{title:'Вопрос и ответ в мелодии',body:'Музыкальная фраза может звучать незавершённо, а следующая — давать ощущение ответа. Так строится музыкальный диалог.',tip:'Послушай первую фразу до конца прежде, чем играть вторую.'},
  45:{title:'Интервалы собираются в фразу',body:'Теперь несколько расстояний соединяются в один рисунок. Задача — перестать видеть отдельные прыжки и начать видеть движение.',tip:'Сначала найди общую форму, потом детали.'},
  46:{title:'Аккорд — несколько нот вместе',body:'Аккорд состоит из нескольких звуков, которые звучат одновременно и создают общее гармоническое ощущение.',tip:'Слушай аккорд как одно целое, даже если в нём три ноты.'},
  47:{title:'Трезвучие состоит из трёх нот',body:'Самый простой аккорд в нашем курсе — трезвучие: первая, третья и пятая ступени. Изменяя расстояние между ними, получаем разные характеры.',tip:'Сначала запомни форму из трёх клавиш.'},
  48:{title:'До мажор: ДО–МИ–СОЛЬ',body:'До мажор — одно из самых удобных первых трезвучий. Три белые клавиши образуют понятную форму.',tip:'Проверь, чтобы все три ноты звучали вместе.'},
  49:{title:'Ля минор: ЛЯ–ДО–МИ',body:'Ля минор использует знакомые белые клавиши, но начинает форму с ЛЯ. Минорная форма отличается от мажорной расстоянием внутри трезвучия.',tip:'Запомни не только названия, но и форму.'},
  50:{title:'Фа мажор: ФА–ЛЯ–ДО',body:'Фа мажор добавляет ещё одну знакомую форму. Задача — научиться переставлять руку без рывка.',tip:'Сначала поставь три ноты, потом нажми их вместе.'},
  51:{title:'Соль мажор: СОЛЬ–СИ–РЕ',body:'Соль мажор переносит знакомый принцип на другую основу. Так появляется чувство, что аккорды — это формы, которые можно двигать.',tip:'Смотри на интервалы между пальцами.'},
  52:{title:'Ми минор: МИ–СОЛЬ–СИ',body:'Ми минор снова использует трезвучие из первой, третьей и пятой ступеней своей основы.',tip:'Сравни его форму с ЛЯ минором.'},
  53:{title:'Ре минор: РЕ–ФА–ЛЯ',body:'Ре минор помогает закрепить принцип минорного трезвучия на новой ноте.',tip:'Сыграй форму сразу тремя пальцами.'},
  54:{title:'Переход между аккордами',body:'В сопровождении важен не только отдельный аккорд, но и переход к следующему. Рука должна заранее понимать, куда она движется.',tip:'Готовь следующую форму чуть раньше смены.'},
  55:{title:'До → Фа: меняем форму без прыжка',body:'Переход становится проще, когда пальцы знают расстояние до следующей формы.',tip:'Не поднимай руку высоко над клавишами.'},
  56:{title:'До → Ля минор: знакомая опора',body:'Знакомые ноты могут образовывать новую гармоническую форму. Сравни движение с предыдущими переходами.',tip:'Старайся запомнить расстояние между аккордами.'},
  57:{title:'Четыре аккорда превращаются в сопровождение',body:'Когда последовательность повторяется по кругу, мозг начинает запоминать её как одно движение.',tip:'Не останавливайся между аккордами.'},
  58:{title:'Мажор и минор можно различать на слух',body:'Мажор и минор имеют разный характер. Сначала слушай общее ощущение, не пытаясь вычислять каждую ноту.',tip:'Сравни два аккорда несколько раз подряд.'},
  59:{title:'Аккорд тоже живёт внутри пульса',body:'Аккорд нужно поставить в нужный момент, а не просто сыграть когда удобно. Так гармония становится частью ритма.',tip:'Считай доли и меняй аккорд на одну и ту же точку.'},
  60:{title:'Мелодия и аккорд существуют одновременно',body:'Когда одна рука играет мелодию, а другая — аккорд, важно не дать аккомпанементу перекрыть главную линию.',tip:'Мелодия обычно должна звучать заметнее сопровождения.'},
  61:{title:'Гамма — ноты по порядку',body:'Гамма — последовательность нот от одной ступени до повторения той же ноты выше. Она помогает чувствовать порядок звуков и ориентироваться в тональности.',tip:'Сначала запомни порядок нот, потом аппликатуру.'},
  62:{title:'Ля минор: знакомый белый ряд',body:'Естественная ля минорная гамма использует только белые клавиши. Это удобный следующий шаг после До мажора.',tip:'Играй медленно и слушай каждую ступень.'},
  63:{title:'Соль мажор добавляет один чёрный ключ',body:'В соль мажоре появляется ФА-диез. Это хороший пример того, что гаммы не всегда состоят только из белых клавиш.',tip:'Не бойся чёрной клавиши: сначала назови её, потом сыграй.'},
  64:{title:'Фа мажор добавляет Си-бемоль',body:'В фа мажоре используется Си-бемоль. Это показывает, зачем в музыке нужны бемоли и диезы.',tip:'Учись видеть знак как подсказку высоты.'},
  65:{title:'Аппликатура — номера пальцев',body:'Аппликатура подсказывает, каким пальцем удобнее играть. Она нужна не для красоты, а чтобы движение оставалось предсказуемым.',tip:'Если аппликатура указана, сначала следуй ей.'},
  66:{title:'Аппликатура левой руки',body:'Левая рука использует те же номера 1–5, но движется в противоположную сторону от правой в тех же рисунках.',tip:'Не зеркаль номера по памяти — называй палец правильно.'},
  67:{title:'Большой палец помогает менять позицию',body:'В гаммах большой палец часто используется для перехода в следующую позицию. Важно проводить его мягко, не ломая движение кисти.',tip:'Переход большого пальца делай незаметным.'},
  68:{title:'Гамма вверх',body:'Движение вверх должно оставаться ровным после смены пальцев. Это тренирует координацию и чувство расстояния.',tip:'Следи за тем, чтобы переход большого пальца не замедлял руку.'},
  69:{title:'Гамма вниз',body:'На спуске логика аппликатуры меняется, поэтому полезно тренировать его отдельно.',tip:'Слушай равномерность каждой ноты.'},
  70:{title:'Вверх и вниз одним движением',body:'Теперь важно связать два направления без остановки в верхней точке.',tip:'Не делай паузу на самой высокой ноте.'},
  71:{title:'Арпеджио — ноты аккорда по очереди',body:'Арпеджио раскладывает аккорд во времени: вместо трёх одновременных нот мы играем их последовательно.',tip:'Сначала узнай форму аккорда, потом разложи её.'},
  72:{title:'Гамма как короткая разминка',body:'Гаммы полезны не потому, что их нужно быстро играть. Они подготавливают пальцы и внимание к ровному движению.',tip:'Сделай несколько спокойных повторов вместо одного быстрого.'},
  73:{title:'Независимость пальцев',body:'Каждый палец должен двигаться точно, не заставляя соседние пальцы лишний раз напрягаться.',tip:'Минимальное движение обычно даёт больше контроля.'},
  74:{title:'Ровность важнее скорости',body:'Когда ноты звучат неравномерно, ускорение это только подчёркивает. Сначала одинаковое качество, потом темп.',tip:'Поставь темп, в котором ты не ошибаешься.'},
  75:{title:'Чистота важнее рекорда',body:'Техническое упражнение должно быть предсказуемым. Ошибка из-за спешки учит плохому движению так же быстро, как правильная игра — хорошему.',tip:'Останови ускорение и вернись к чистому темпу.'},
  76:{title:'Метроном помогает измерить темп',body:'Здесь метроном становится не наказанием, а измерителем. Ты можешь постепенно добавлять скорость только после стабильных повторов.',tip:'Повышай темп маленькими шагами.'},
  77:{title:'Сила удара меняет звучание',body:'Сильнее нажатие обычно создаёт более яркий звук, слабее — более мягкий. Это один из способов управлять выражением.',tip:'Не путай громкость с напряжением руки.'},
  78:{title:'Легато — связное движение',body:'При легато соседние ноты воспринимаются как одна плавная линия. Важно не оставлять лишних дыр между звуками.',tip:'Слушай именно переход от ноты к ноте.'},
  79:{title:'Стаккато — короткий отрыв',body:'Стаккато означает короткий звук и быстрое отпускание клавиши. Это не требует удара сильнее.',tip:'Работай отпускающим движением, а не силой.'},
  80:{title:'Акцент — одна нота заметнее остальных',body:'Акцент помогает направить внимание слушателя. Он должен быть осознанным, а не просто громким.',tip:'Сыграй соседние ноты одинаково и выдели только одну.'},
  81:{title:'Три уровня громкости',body:'Попробуй сыграть одну и ту же фразу мягко, обычно и ярче. Так появляется контроль динамики.',tip:'Меняй силу постепенно, а не рывком.'},
  82:{title:'Техническая связка объединяет навыки',body:'Здесь соединяются ровность, аппликатура, движение и контроль силы. Именно так упражнение превращается в полезную технику.',tip:'Лучше три чистых повторения, чем один рекордный.'},
  83:{title:'Левая рука может держать бас',body:'Бас задаёт нижнюю опору гармонии. Даже одна нота слева способна сделать мелодию устойчивее.',tip:'Играй бас спокойнее мелодии.'},
  84:{title:'Бас и аккорд',body:'Левая рука может чередовать басовую ноту и аккорд. Такой рисунок встречается во множестве сопровождений.',tip:'Сохраняй одинаковое расстояние по времени между элементами.'},
  85:{title:'Вальсовый рисунок 1–2–3',body:'В простом вальсовом сопровождении первая доля чаще получает бас, а следующие две — аккордовую опору.',tip:'Не делай первую долю слишком громкой.'},
  86:{title:'Мелодия справа, бас слева',body:'Теперь руки выполняют разные роли. Главная задача — не путать их движения и удерживать общий пульс.',tip:'Представь, что левая рука — фундамент, а правая — голос.'},
  87:{title:'Мелодия справа, аккорд слева',body:'Аккорд должен поддерживать мелодию и не перекрывать её. Это первый шаг к настоящему сопровождению.',tip:'Сначала сыграй мелодию, потом добавь аккорд.'},
  88:{title:'Не ускоряемся при смене рук',body:'Мозг часто ускоряет момент, когда обе руки начинают что-то делать. Поэтому смены нужно тренировать медленно.',tip:'Считай вслух первые несколько повторов.'},
  89:{title:'Баланс двух рук',body:'Обе руки могут быть правильными, но одна всё равно может звучать слишком громко. Баланс решает, что слушатель услышит первым.',tip:'Сделай ведущую руку чуть заметнее.'},
  90:{title:'Повторяющийся рисунок левой руки',body:'Если левая рука повторяет один шаблон, тебе проще направить внимание на мелодию. Поэтому такие рисунки часто используются в песнях.',tip:'Доведи рисунок до автоматизма медленным повтором.'},
  91:{title:'Удерживаем остинато',body:'Остинато — повторяющийся музыкальный рисунок. Он может продолжаться несколько тактов почти без изменений.',tip:'Не ускоряй повторяющийся рисунок из-за интересной мелодии сверху.'},
  92:{title:'Собираем восьмитактовую фразу',body:'Большая фраза строится из маленьких частей. Теперь руки и форма начинают работать как одно целое.',tip:'Раздели фразу на две половины и соедини.'},
  93:{title:'Фраза похожа на предложение',body:'Музыкальная фраза имеет начало, движение и окончание. Поэтому все ноты не должны звучать одинаково.',tip:'Ищи место, куда музыка стремится.'},
  94:{title:'Где заканчивается музыкальная мысль',body:'Конец фразы часто чувствуется по замедлению, длительной ноте или гармоническому завершению.',tip:'Не обрывай последнюю ноту раньше времени.'},
  95:{title:'Тише внутри фразы',body:'Небольшое уменьшение громкости внутри фразы может сделать последующую вершину заметнее. Динамика — это направление, а не только громкость.',tip:'Попробуй сделать середину чуть спокойнее.'},
  96:{title:'Вершина фразы',body:'Вершина — момент, к которому ведёт музыкальное движение. Она может быть самой заметной по высоте, силе или плотности.',tip:'Сделай вершину осознанно, а не случайно.'},
  97:{title:'Педаль соединяет звучание',body:'Правая педаль продлевает звучание после отпускания клавиш. Она помогает связывать гармонию и делать фразу более цельной.',tip:'Меняй педаль вместе со сменой гармонии.'},
  98:{title:'Смена педали без «каши»',body:'Если слишком долго держать педаль, разные гармонии смешиваются. Чистая смена педали оставляет звук связным, но понятным.',tip:'Слушай момент смены аккорда.'},
  99:{title:'Синкопа — акцент между долями',body:'Синкопа переносит ощущение акцента с привычной сильной доли на слабую или промежуточную.',tip:'Сначала удержи ровный пульс, потом размести ноту между ударами.'},
  100:{title:'Три ноты внутри одного пульса',body:'Триоль делит привычный пульс на три равные части. Важно почувствовать равенство этих трёх звуков.',tip:'Считай «раз-и-а» ровно, без ускорения.'},
  101:{title:'Занятие лучше строить маленькими блоками',body:'Короткая сессия работает лучше, когда в ней есть одна понятная цель. Мы будем чередовать понимание, игру и короткую проверку.',tip:'Заканчивай сессию на чистом повторе, а не на усталости.'},
  102:{title:'Песню проще разбирать кусочками',body:'Вместо всей песни сразу берём несколько тактов. Каждый маленький фрагмент легче повторить и исправить.',tip:'Не переходи дальше, пока текущий кусок не стал спокойным.'},
  103:{title:'Схема обучения песни',body:'Сначала слушаем и понимаем фрагмент, затем учим руки отдельно, после этого соединяем и играем в общем темпе.',tip:'Каждый этап нужен для своей задачи.'},
  104:{title:'Первая нота задаёт ориентир',body:'В хорошем разборе первая нота нужна не для угадайки, а чтобы привязать фрагмент к реальной клавише и положению рук.',tip:'После первой ноты сразу ищи следующую глазами.'},
  105:{title:'Первая мини‑фраза правой руки',body:'Короткая мелодическая фраза должна запоминаться как единое движение. Здесь не нужна скорость.',tip:'Повтори её несколько раз с одинаковым темпом.'},
  106:{title:'Следующая мини‑фраза',body:'Новый фрагмент осваивается тем же способом: маленькая цель, медленная игра и соединение с предыдущей.',tip:'Сначала отдельный кусок, потом стык.'},
  107:{title:'Левая рука отдельно',body:'Перед соединением нужно точно знать, что делает левая рука. Это убирает лишнюю нагрузку с памяти.',tip:'Играй левую партию отдельно до уверенного повторения.'},
  108:{title:'Соединяем два фрагмента',body:'Теперь связываем уже знакомые куски. Самое трудное место обычно находится на стыке, поэтому его полезно повторять отдельно.',tip:'Сделай несколько повторов только на переходе.'},
  109:{title:'Четыре ноты без спешки',body:'Перед тем как играть большой кусок, убедись, что маленькая группа нот звучит чисто и ровно.',tip:'Точность сначала, скорость потом.'},
  110:{title:'Добавляем пульс',body:'После запоминания нот появляется время. Мелодия должна двигаться внутри устойчивого пульса, а не просто следовать за памятью.',tip:'Сыграй медленно и считай доли.'},
  111:{title:'Убираем одну подсказку',body:'Подсказки полезны как опора, но навык закрепляется, когда ты постепенно перестаёшь ими пользоваться.',tip:'Смотри на ноты, а не на подсвеченную клавишу.'},
  112:{title:'Играем связку целиком',body:'Теперь несколько маленьких фрагментов превращаются в одну непрерывную музыкальную мысль.',tip:'Не останавливайся после каждого знакомого кусочка.'},
  113:{title:'Аккорд и мелодия вместе',body:'Мелодия остаётся ведущей, а аккорд поддерживает её гармонией. Обе части должны идти внутри одного времени.',tip:'Держи аккомпанемент спокойнее мелодии.'},
  114:{title:'Пробный прогон',body:'Прогон нужен не для идеальности, а чтобы увидеть, где именно возникают ошибки в настоящем движении песни.',tip:'Не возвращайся на каждом промахе: отмечай место и продолжай.'},
  115:{title:'Финальный музыкальный проект',body:'В финале объединяются чтение, ритм, аккорды, техника и музыкальность. Теперь ты уже не просто нажимаешь правильные клавиши — ты собираешь произведение целиком.',tip:'Сначала точность и структура, потом выразительность и темп.'}
};

function theoryForDisplay(r){
  const d=V8_KNOWLEDGE[r.n] || {title:r.title,body:'В этом уроке новая идея сразу связана с практикой. Сначала пойми правило, затем сыграй его на инструменте и проверь себя.',tip:'Связывай каждую новую идею с конкретным движением на клавиатуре.'};
  return {title:d.title,body:d.body,plain:d.tip,tip:d.tip,prereq:lessonPrereq(r.n)};
}

function lessonGlossary(r){
  const n=r.n;
  const map={
    2:['Октава','Расстояние от одной ноты до такой же ноты выше или ниже. Между ними 12 полутонов.'],
    11:['Пульс','Ровные доли, на которые опираются все ноты и паузы.'],
    13:['Длительность','Сколько времени нота должна звучать.'],
    14:['Пауза','Место в ритме, где мы специально не играем.'],
    18:['Метроном','Устройство или программа, которая задаёт ровный темп.'],
    36:['Интервал','Расстояние по высоте между двумя нотами.'],
    46:['Аккорд','Несколько звуков, звучащих одновременно.'],
    47:['Трезвучие','Аккорд из трёх звуков.'],
    65:['Аппликатура','Номера пальцев, которыми удобно играть ноты.'],
    71:['Арпеджио','Ноты аккорда, сыгранные последовательно.'],
    77:['Динамика','Изменение громкости и силы звучания.'],
    78:['Легато','Плавная связная игра без лишних промежутков.'],
    79:['Стаккато','Короткая отделённая игра с быстрым отпусканием клавиш.'],
    91:['Остинато','Короткий повторяющийся музыкальный рисунок.'],
    97:['Педаль','Педаль удерживает звучание и помогает соединять гармонию.'],
    99:['Синкопа','Ритмический акцент между привычными сильными долями.'],
    100:['Триоль','Три равные ноты внутри времени, где обычно ожидаются две.']
  };
  const v=map[n]; if(v)return {term:v[0],text:v[1]};
  return {term:'Главная мысль',text:'Пойми правило, сразу сыграй его и только потом переходи дальше.'};
}

/* ------------------------------------------------------------------------
   2. Retry logic: immediately after first mistake, hint after 3 retries
   ------------------------------------------------------------------------ */
function v8RetryState(r){
  if(!r.retryCount)r.retryCount=0;
  return r.retryCount;
}
function v8RecordLessonError(r,m,target){
  r.errors=(r.errors||0)+1;
  r.retryCount=(r.retryCount||0)+1;
  state.mistakes=state.mistakes||{};
  state.mistakes[m]=(state.mistakes[m]||0)+1;
  v6EnsureStats().perfectRun=0;
  save();
  const msg=r.anyOctave
    ? `Услышана ${noteText(m)}. Нужна нота ${noteName(target)} — октава здесь не важна.`
    : `Услышана ${noteText(m)}. Нужна ${noteText(target)}.`;
  setLessonFeedback('bad','Попробуй ещё',msg);
}

function renderSequenceTask(r){
  const target=r.steps[Math.min(r.step,r.steps.length-1)];
  const derivedHand=(r.hand&&r.hand!=='B')?r.hand:(r.type==='hands'?(target<60?'L':'R'):'B');
  const handText=HAND_LABELS[derivedHand];
  const retries=v8RetryState(r);
  const hint=retries>=3;
  return `<div class="task card">
    <div class="taskTop"><div class="taskLabel">${r.type==='hands'?'СОЕДИНЯЕМ РУКИ':r.type==='technique'?'ТЕХНИКА':'СЫГРАЙ СЕЙЧАС'}</div><span class="taskTag">${r.step+1} / ${r.steps.length}</span></div>
    <div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${noteText(target)}</span><b>${escapeHtml(handText)}</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}<div class="targetHint">Здесь важны и название, и октава. Сыграй именно указанную клавишу.</div></div>
    <div id="lessonFeedback">${feedbackMarkup(r.errors?'bad':'wait',r.errors?'Попробуй ещё':'Жду звук',r.errors?`Сыграй ${noteText(target)} ещё раз.`:`Сыграй ${noteText(target)}.`)}</div>
    ${retries>=1?`<div class="retryAction card"><div><b>Новая попытка</b><small>Сбрось текущую попытку и сыграй цель ещё раз.</small></div><button class="secondary" id="retryLessonAttempt">↻ Попробовать ещё раз</button></div>`:''}
    ${hint?`<div class="hintBox"><b>Подсказка</b><span>Ищи ${escapeHtml(noteText(target))}. На клавиатуре ниже подсвечена точная клавиша.</span></div>`:''}
  </div>`;
}

function handleSequenceDetected(m){
  const r=runtime;if(!r||r.passed||r.sequenceDone)return;
  const target=r.steps[r.step];
  const ok=r.anyOctave?pitchClass(m)===pitchClass(target):m===target;
  flashKeys([m],ok);markOctaveSeen(m);
  if(ok){
    r.step++;r.errors=0;r.retryCount=0;
    v6EnsureStats().perfectRun=(v6EnsureStats().perfectRun||0)+1;
    save();
    if(r.step>=r.steps.length&&r.type==='musical'){
      r.sequenceDone=true;setLessonFeedback('good','Фраза готова','Теперь сделай короткую музыкальную самопроверку.');setTimeout(renderLesson,260);return;
    }
    if(r.step>=r.steps.length){r.passed=true;completeLesson(r.n);setTimeout(()=>renderLessonComplete(r),330);return;}
    setLessonFeedback('good','Верно!',`Следующая цель: ${r.anyOctave?noteName(r.steps[r.step]):noteText(r.steps[r.step])}.`);
    setTimeout(renderLesson,240);
  }else{
    v8RecordLessonError(r,m,target);
    renderLesson();
  }
}

/* Preserve the exact lesson structure; only content and task copy are changed. */
function renderLesson(){
  const r=runtime;if(!r)return;
  const total=r.type==='chord'?r.rounds:r.type==='chordEar'?r.earRounds.length:r.type==='interval'?r.pairs.length*2:r.steps.length;
  const progress=r.type==='interval'?Math.min(r.step,total):r.type==='chordEar'?Math.min(r.earRound,total):r.step;
  r.lessonPage=r.lessonPage||1;
  const theory=theoryForDisplay(r), glossary=lessonGlossary(r);
  const page1=`<div class="lessonPageCard card"><div class="pageKicker">1 · ПОНЯТЬ</div><h2>${escapeHtml(theory.title)}</h2><p>${escapeHtml(theory.body)}</p><div class="lessonVisual">${r.n===2?`<div class="octaveVisual"><span>ДО 3</span><i>→</i><span>ДО 4</span><b>12 полутонов</b></div>`:`<div class="ideaIcon">${r.module.icon}</div>`}</div><div class="lessonTip"><b>Главное</b><span>${escapeHtml(theory.tip)}</span></div><div class="glossaryMini"><span>${escapeHtml(glossary.term)}</span><p>${escapeHtml(glossary.text)}</p></div><button class="primary full" id="lessonNextPage">Перейти к практике →</button></div>`;
  let task='';
  if(r.type==='setup')task=renderSetupTask(r);else if(r.type==='rhythm')task=renderRhythmTask(r);else if(r.type==='interval')task=renderIntervalTask(r);else if(r.type==='chord')task=renderChordTask(r);else if(r.type==='chordEar')task=renderChordEarTask(r);else if(r.type==='musical')task=renderMusicalTask(r);else if(r.type==='song')task=renderSongCourseTask(r);else task=renderSequenceTask(r);
  const page2=`<div class="lessonPageCard card"><div class="pageKicker">2 · СЫГРАТЬ</div><div class="lessonMiniHead"><span>${progress}/${total}</span><b>${r.anyOctave?'Октава не важна':'Нужна точная октава'}</b></div>${task}<div class="retryGate">${r.errors>=1?'После ошибки можно сразу нажать «Попробовать ещё раз». После трёх таких попыток появится подсказка.':'Если ошибёшься, появится отдельная кнопка новой попытки.'}</div></div>`;
  const page3=`<div class="lessonPageCard card"><div class="pageKicker">3 · ЗАКРЕПИТЬ</div><div class="resultPreview"><div class="resultIcon">✓</div><h2>${r.passed?'Навык закреплён':'Что должно получиться'}</h2><p>${r.passed?'Ты прошёл текущую цель и можешь двигаться дальше.':'К концу урока ты должен уметь выполнить именно то, что написано в его названии.'}</p><div class="resultPoints"><span><b>1</b>${escapeHtml(theory.title)}</span><span><b>2</b>Точное действие на клавиатуре</span><span><b>3</b>Самостоятельное повторение</span></div><button class="primary full" id="nextLessonBtn">${r.passed?(r.n<COURSE_SIZE?'Следующий урок →':'Открыть песни'):'Вернуться к практике →'}</button></div></div>`;
  const pages=[page1,page2,page3];
  $('#lesson').innerHTML=`<div class="lessonHeader"><button class="backBtn" data-back="course">‹</button><div class="lessonHeadText"><div class="microLabel">УРОК ${r.n} · ${escapeHtml(lessonKindType(r.type))}</div><div class="miniProgress"><i style="width:${Math.max(0,Math.min(100,(progress/Math.max(total,1))*100))}%"></i></div><small>${Math.min(progress+1,total)} из ${total}</small></div><button class="iconAction" id="lessonSound">🔊</button></div><div class="lessonTitleBlock"><div class="lessonIcon">${r.module.icon}</div><div><div class="eyebrow">${escapeHtml(r.module.name)}</div><h1>${escapeHtml(r.title)}</h1><p>${escapeHtml(r.objective)}</p></div></div><div class="lessonPager">${pages.map((_,i)=>`<button class="pagerDot ${r.lessonPage===i+1?'active':''}" data-page="${i+1}"><span>${i+1}</span>${['Понять','Сыграть','Закрепить'][i]}</button>`).join('')}</div><div class="lessonPages">${pages.map((p,i)=>`<div class="lessonPage ${r.lessonPage===i+1?'active':''}" data-page-view="${i+1}">${p}</div>`).join('')}</div>`;
  bindBack();$('#lessonSound').onclick=()=>playTarget(r);
  $$('[data-page]').forEach(b=>b.onclick=()=>{r.lessonPage=+b.dataset.page;renderLesson()});
  $('#lessonNextPage')?.addEventListener('click',()=>{r.lessonPage=2;renderLesson()});
  $('#nextLessonBtn')?.addEventListener('click',()=>{if(r.passed){r.n<COURSE_SIZE?openLesson(r.n+1):go('songs')}else{r.lessonPage=2;renderLesson()}});
  const retry=$('#retryLessonAttempt');
  if(retry)retry.onclick=()=>{r.errors=0;r.sequenceDone=false;r.retryCount=r.retryCount||0;renderLesson()};
  if(r.lessonPage===2){if(r.type==='setup')bindSetup(r);else if(r.type==='rhythm')bindRhythm(r);else if(r.type==='interval')bindInterval(r);else if(r.type==='chord')bindChord(r);else if(r.type==='chordEar')bindChordEar(r);else if(r.type==='musical')bindMusical(r);else if(r.type==='song')bindSongCourse(r);else bindSequence(r)}
}

/* Lesson 2: explicitly about octaves, not black-key groups. */
const V8_BUILD_BASE=buildLesson;
function buildLesson(n){
  const r=V8_BUILD_BASE(n);
  if(!r)return r;
  if(n===1){r.title=LESSON_TITLES[0];r.anyOctave=true;r.steps=[60];r.objective='Подключить микрофон и научиться находить ДО на клавиатуре.';}
  if(n===2){r.title='Октава: как устроена клавиатура';r.objective='Понять, что такое октава, и научиться находить одинаковые ноты на разной высоте.';r.theory=V8_KNOWLEDGE[2].body;r.tip=V8_KNOWLEDGE[2].tip;r.steps=[60,72,48,60];r.anyOctave=false;}
  return r;
}

/* ------------------------------------------------------------------------
   3. Microphone engine
   ------------------------------------------------------------------------ */
let v8LastRawResult=null;
let v8PitchQueue=[];
let v8LastAnalysis=0;

function v8SpectrumAt(freqData,sr,fftSize,f){
  if(!freqData||!Number.isFinite(f)||f<=0||f>=sr/2)return 0;
  const bin=f*fftSize/sr, c=Math.round(bin);
  let best=0;
  for(let d=-3;d<=3;d++){
    const i=c+d;if(i>0&&i<freqData.length){best=Math.max(best,v8DbToAmp(freqData[i]));}
  }
  return best;
}
function v8LocalNoise(freqData,sr,fftSize,f){
  const bin=Math.round(f*fftSize/sr);let sum=0,n=0;
  for(let d=-10;d<=10;d++){const i=bin+d;if(i>1&&i<freqData.length){sum+=v8DbToAmp(freqData[i]);n++;}}
  return sum/(n||1);
}
function v8HarmonicSalience(freqData,sr,fftSize,midi){
  const f0=v8FreqForMidi(midi);if(f0<55||f0>2200)return -Infinity;
  let score=0,ws=0,odd=0,even=0;
  const hs=[1,2,3,4,5,6,7,8,9];
  for(const h of hs){const f=f0*h;if(f>=sr/2)break;const a=v8SpectrumAt(freqData,sr,fftSize,f);const noise=v8LocalNoise(freqData,sr,fftSize,f);const ratio=a/(noise+.000001);const s=Math.log1p(Math.max(0,ratio-1));const w=1/Math.pow(h,.72);score+=s*w;ws+=w;if(h%2)odd+=s*w;else even+=s*w;}
  const oddSupport=odd/(odd+even+.0001);
  /* Odd-harmonic support is a strong discriminator against octave-up errors. */
  return (score/(ws||1)) + oddSupport*.65;
}
function v8AutocorrAtFreq(buf,sr,f){
  if(f<55||f>2200)return 0;const lag=Math.round(sr/f);if(lag<2||lag>=buf.length-2)return 0;
  let ab=0,aa=0,bb=0,n=0;
  const step=2;
  for(let i=0;i<buf.length-lag;i+=step){const a=buf[i],b=buf[i+lag];ab+=a*b;aa+=a*a;bb+=b*b;n++;}
  return n?ab/Math.sqrt((aa*bb)||1):0;
}
function v8SelectPitch(buf,sr,freqData,fftSize,rawMidi){
  const center=Math.round(rawMidi), cands=[];
  for(let sem=-1;sem<=1;sem++){
    for(const os of [-24,-12,0,12,24]){const m=center+sem+os;if(m>=V8_MIC_RANGE.min&&m<=V8_MIC_RANGE.max)cands.push(m);}
  }
  const unique=[...new Set(cands)];let best=center,bestScore=-Infinity;
  for(const m of unique){
    const spectral=v8HarmonicSalience(freqData,sr,fftSize,m); 
    const corr=Math.max(-1,Math.min(1,v8AutocorrAtFreq(buf,sr,v8FreqForMidi(m))));
    const corrNorm=(corr+1)/2;
    const prior=Math.exp(-Math.abs(m-center)/2.2)*.06;
    const score=spectral*.68+corrNorm*.32+prior;
    if(score>bestScore){bestScore=score;best=m;}
  }
  return best;
}

function v8DetectPitchRaw(buf,sr){
  let mean=0;for(const x of buf)mean+=x;mean/=buf.length;
  let rms=0;for(const x of buf){const y=x-mean;rms+=y*y;}rms=Math.sqrt(rms/buf.length);
  if(rms<.0025)return null;
  for(let i=0;i<buf.length;i++)buf[i]-=mean;
  let rawFreq=null,clarity=0;
  if(v6Pitchy?.PitchDetector){
    try{
      if(!v6PitchDetector||v6PitchDetector.inputLength!==buf.length)v6PitchDetector=v6Pitchy.PitchDetector.forFloat32Array(buf.length);
      const res=v6PitchDetector.findPitch(buf,sr);if(Number.isFinite(res?.[0])){rawFreq=res[0];clarity=Number(res[1])||0;}
    }catch{}
  }
  if(!Number.isFinite(rawFreq)){
    let bestLag=-1,best=Infinity;const minLag=Math.floor(sr/2200),maxLag=Math.min(Math.floor(sr/55),buf.length-2);
    for(let lag=minLag;lag<=maxLag;lag+=2){let d=0,n=0;for(let i=0;i<buf.length-lag;i+=2){const q=buf[i]-buf[i+lag];d+=q*q;n++;}const v=d/(n||1);if(v<best){best=v;bestLag=lag;}}
    if(bestLag<0)return null;rawFreq=sr/bestLag;clarity=Math.max(0,Math.min(1,1-best/(rms*rms*2+1e-9)));
  }
  if(!Number.isFinite(rawFreq)||rawFreq<55||rawFreq>2200||clarity<.42)return null;
  const rawMidi=v8MidiForFreq(rawFreq);
  const midi=Math.round(rawMidi);
  const physical=v8SelectPitch(buf,sr,mic.freq,mic.analyser?.fftSize||buf.length,midi);
  const profile=v8AudioProfile();
  const corrected=v8Clamp(physical + Math.round(profile.octaveOffset||0),21,108);
  const correctedExact=corrected;
  const cents=(v8MidiForFreq(rawFreq)-physical)*100;
  const result={midi:correctedExact,physicalMidi:physical,rawMidi,cents,rawFreq,confidence:clarity,rms,octaveOffset:profile.octaveOffset||0};
  v8LastRawResult=result;
  return result;
}

function detectPitch(buf,sr){return v8DetectPitchRaw(buf,sr)}

/* Target-driven chord detection: evaluate each required pitch class rather
   than trying to guess a random chord from the spectrum. */
function v8PcEvidence(freqData,sr,fftSize,pc){
  let best=-Infinity,bestMidi=null;
  for(let oct=1;oct<=6;oct++){
    const m=12*(oct+1)+pc;if(m<V8_MIC_RANGE.min||m>108)continue;
    const s=v8HarmonicSalience(freqData,sr,fftSize,m);if(s>best){best=s;bestMidi=m;}
  }
  return {score:best,midi:bestMidi};
}
function v8ChordEvidence(freqData,sr,fftSize,pcs){
  const all=Array.from({length:12},(_,pc)=>({pc,score:v8PcEvidence(freqData,sr,fftSize,pc).score})).sort((a,b)=>b.score-a.score);
  const top=all[0]?.score||0;
  const target=pcs.map(pc=>{const x=v8PcEvidence(freqData,sr,fftSize,pc);return {pc,score:x.score,normalized:top>0?x.score/top:0};});
  return {target,all,top};
}

let v8ChordState={signature:'',hits:0,lastAt:0,lastScores:null};
function v8ResetChordState(){v8ChordState={signature:'',hits:0,lastAt:0,lastScores:null};}
function v8ChordTargetFromContext(){
  if(route==='practice'&&practiceState.tab==='chords'&&practiceState.chord){return chord(practiceState.chord.root,practiceState.chord.type).map(pitchClass);}
  if(route==='lesson'&&runtime&&(runtime.type==='chord'||(runtime.type==='song'&&runtime.songKind==='chord'))){const c=runtime.chordRounds?.[runtime.chordRound];if(c)return c.midi.map(pitchClass);}
  return null;
}
function v8AcceptChord(pcs){
  const sig=[...new Set(pcs)].sort((a,b)=>a-b).join(',');
  const now=performance.now();
  if(v8ChordState.signature!==sig||now-v8ChordState.lastAt>900){v8ChordState.signature=sig;v8ChordState.hits=0;}
  v8ChordState.hits++;v8ChordState.lastAt=now;
  return v8ChordState.hits>=2;
}

function onChordDetected(notes){
  /* Backward-compatible entry point for any old code path. */
  if(route==='lesson'&&runtime&&!runtime.passed&&(runtime.type==='chord'||runtime.type==='song'&&runtime.songKind==='chord'))handleChordDetected(notes);
  if(route==='practice'&&practiceState.tab==='chords')handlePracticeChordDetected(notes);
}

function handlePracticeChordDetected(notes){
  const c=practiceState.chord;if(!c||practiceState.chordPassed)return;
  const wanted=[...new Set(chord(c.root,c.type).map(pitchClass))];
  const incoming=[...new Set((Array.isArray(notes)?notes:[notes]).map(pitchClass))];
  const good=wanted.every(pc=>incoming.includes(pc));
  if(good){practiceState.chordPassed=true;v6EnsureStats().chords=(v6EnsureStats().chords||0)+1;markActive();save();flashKeys(notes,true);const el=$('#practiceFeedback');if(el)el.innerHTML=feedbackMarkup('good','Аккорд совпал ✓','Все нужные звуки найдены. Следующий аккорд откроется автоматически.');setTimeout(()=>{practiceState.chordPassed=false;practiceState.chordSeen=[];practiceState.chord.root=Object.keys(ROOT_PC)[Math.floor(Math.random()*Object.keys(ROOT_PC).length)];renderPractice()},520);return;}
  const count=wanted.filter(pc=>incoming.includes(pc)).length;const el=$('#practiceFeedback');if(el)el.innerHTML=feedbackMarkup('wait','Слушаю',`Совпало ${count} из ${wanted.length}. Нужно сыграть весь аккорд.`);
}

/* Exact octave comparison is now a calibrated physical pitch comparison. */
function targetMatches(r,m,target){return r.anyOctave?pitchClass(m)===pitchClass(target):m===target}
function handleChordDetected(value){
  const r=runtime;if(!r||r.passed)return;
  const c=r.chordRounds?.[r.chordRound]||{root:'до',type:'major',midi:[60,64,67]};
  const wanted=[...new Set(c.midi.map(pitchClass))];
  const incoming=[...new Set((Array.isArray(value)?value:[value]).map(pitchClass))];
  const ok=wanted.every(pc=>incoming.includes(pc));
  if(ok){
    flashKeys(Array.isArray(value)?value:c.midi,true);r.errors=0;r.retryCount=0;v6EnsureStats().chords=(v6EnsureStats().chords||0)+1;save();
    setLessonFeedback('good','Аккорд совпал ✓','Все три звука совпали. Следующий аккорд откроется автоматически.');
    setTimeout(()=>{r.chordRound++;if(r.chordRound>=r.rounds){r.passed=true;completeLesson(r.n);renderLessonComplete(r);}else renderLesson()},500);
  }else{
    const got=wanted.filter(pc=>incoming.includes(pc)).length;v8RecordLessonError(r,Array.isArray(value)?value[0]:value,c.midi[0]);
    setLessonFeedback('bad','Пока не совпало',`Совпало ${got} из ${wanted.length}. Сыграй весь аккорд вместе.`);renderLesson();
  }
}

/* ------------------------------------------------------------------------
   4. Microphone loop, calibration room and reconnect
   ------------------------------------------------------------------------ */
function v8UpdateLive(result){
  const el=$('#micLive');if(!el)return;
  if(!result){el.innerHTML='<span class="micLiveDot"></span><b>Слушаю…</b><small>Сыграй одну ноту на синтезаторе</small>';return;}
  el.innerHTML=`<span class="micLiveDot good"></span><b>${escapeHtml(noteText(result.midi))}</b><small>${Math.round(result.rawFreq)} Hz · ${Math.round(result.confidence*100)}% · ${result.cents>=0?'+':''}${Math.round(result.cents)}¢</small>`;
}
function v8DispatchStable(result,now){
  v8PitchQueue.push(result);if(v8PitchQueue.length>8)v8PitchQueue.shift();
  const counts=new Map();for(const x of v8PitchQueue)counts.set(x.midi,(counts.get(x.midi)||0)+1);
  const ranked=[...counts.entries()].sort((a,b)=>b[1]-a[1]);if(!ranked.length)return;
  const [m,count]=ranked[0];if(count<3)return;
  const same=v8PitchQueue.filter(x=>x.midi===m);
  if(mic.candidateMidi!==m){mic.candidateMidi=m;mic.candidateSince=now;return;}
  if(now-mic.candidateSince<90)return;
  const repeatGap=now-(mic.lastDispatch||0);if(mic.lastMidi===m&&repeatGap<650)return;
  mic.lastMidi=m;mic.lastDispatch=now;markOctaveSeen(m);onDetected(m,{confidence:same.reduce((a,x)=>a+x.confidence,0)/same.length,cents:same.reduce((a,x)=>a+x.cents,0)/same.length,freq:result.rawFreq});
}

function v8EvaluateChordFrame(){
  const pcs=v8ChordTargetFromContext();if(!pcs||!mic.freq)return false;
  const e=v8ChordEvidence(mic.freq,mic.ctx.sampleRate,mic.analyser.fftSize,pcs);
  const minTarget=Math.min(...e.target.map(x=>x.normalized));
  const strongExtras=e.all.filter(x=>!pcs.includes(x.pc)&&x.score>e.top*.72);
  const enough=minTarget>=.43 && strongExtras.length===0;
  v8ChordState.lastScores=e;
  if(enough){const accepted=v8AcceptChord(pcs);if(accepted){
    const midi=pcs.map(pc=>60+pc);onChordDetected(midi);v8ResetChordState();return true;
  }}else{if(performance.now()-v8ChordState.lastAt>900)v8ResetChordState();}
  return false;
}

function micLoop(){
  if(!mic.analyser)return;
  const now=performance.now();
  if(now-v8LastAnalysis<34){mic.raf=requestAnimationFrame(micLoop);return;}
  v8LastAnalysis=now;
  if(!mic.timeBuf||mic.timeBuf.length!==mic.analyser.fftSize)mic.timeBuf=new Float32Array(mic.analyser.fftSize);
  mic.analyser.getFloatTimeDomainData(mic.timeBuf);mic.analyser.getFloatFrequencyData(mic.freq);
  const chordContext=!!v8ChordTargetFromContext();
  if(chordContext){v8EvaluateChordFrame();mic.raf=requestAnimationFrame(micLoop);return;}
  const result=v8DetectPitchRaw(new Float32Array(mic.timeBuf),mic.ctx.sampleRate);
  if(result){mic.lastSeen=now;v8UpdateLive(result);v8DispatchStable(result,now);}else if(mic.lastSeen&&now-mic.lastSeen>180){v8PitchQueue=[];mic.candidateMidi=null;mic.candidateSince=0;mic.lastMidi=null;}
  mic.raf=requestAnimationFrame(micLoop);
}

async function startMic(options={}){
  const silent=!!options.silent;
  if(mic.stream){if(!silent)toast('Микрофон уже подключён','good');return true;}
  if(!window.isSecureContext){if(!silent)toast('Открой сайт по HTTPS для доступа к микрофону','bad');return false;}
  if(!navigator.mediaDevices?.getUserMedia){if(!silent)toast('Браузер не поддерживает микрофон','bad');return false;}
  try{
    mic.stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:false,noiseSuppression:false,autoGainControl:false,latency:0}});
    mic.ctx=new (window.AudioContext||window.webkitAudioContext)();if(mic.ctx.state==='suspended')await mic.ctx.resume();
    mic.source=mic.ctx.createMediaStreamSource(mic.stream);mic.analyser=mic.ctx.createAnalyser();mic.analyser.fftSize=V8_DEFAULT_FFT;mic.analyser.smoothingTimeConstant=.03;mic.freq=new Float32Array(mic.analyser.frequencyBinCount);mic.timeBuf=new Float32Array(mic.analyser.fftSize);
    mic.lastMidi=null;mic.candidateMidi=null;mic.candidateSince=0;mic.lastDispatch=0;mic.lastSeen=0;
    v8PitchQueue=[];v8ResetChordState();
    v8AudioProfile().autoReconnect=true;save();
    loadV6Pitchy();micLoop();
    if(!silent)toast('Микрофон подключён — слушаю пианино','good');
    render();return true;
  }catch(e){stopMic();if(!silent){if(e?.name==='NotAllowedError')toast('Разреши микрофон для этого сайта','bad');else if(e?.name==='NotFoundError')toast('Микрофон не найден','bad');else toast('Не удалось подключить микрофон','bad');}return false;}
}

function v8StopMicForOverlay(){return !!mic.stream}
function v8CloseMicCheck(){const o=$('#v8MicCheck');if(o)o.remove();}
function v8MicCheckRender(){
  let o=$('#v8MicCheck');if(!o){o=document.createElement('div');o.id='v8MicCheck';o.className='v8MicCheck';document.body.appendChild(o);}
  const p=v8AudioProfile(), raw=v8LastRawResult, detected=raw?.midi ?? null, offset=Number(p.octaveOffset)||0;
  const calStep=Number(o.dataset.calStep||0);
  const labels=['Сыграй ДО 4-й октавы','Сыграй ДО 3-й октавы','Сыграй ДО 5-й октавы'];
  const expected=[60,48,72][calStep];
  const observed=raw?.physicalMidi;
  const detectedText=raw?`${noteText(raw.midi)} · исходно ${noteText(raw.physicalMidi)}`:'Жду звук';
  o.innerHTML=`<div class="v8MicBackdrop" id="v8MicBackdrop"></div><div class="v8MicPanel"><div class="v8MicHead"><div><div class="sectionKicker">НАСТРОЙКА ЗВУКА</div><h2>Проверить микрофон</h2><p>Эта отдельная страница нужна только для проверки распознавания. Здесь мы не проходим уроки.</p></div><button class="backBtn" id="v8MicClose">×</button></div><div class="v8MicStatus ${mic.stream?'connected':''}"><span class="micLiveDot ${mic.stream?'good':''}"></span><b>${mic.stream?'Микрофон подключён':'Микрофон не подключён'}</b><small>${mic.stream?'Сыграй одну ноту — экран покажет, что реально услышано.':'Нажми подключить, затем сыграй любую ноту.'}</small></div>${mic.stream?`<div class="v8Detected"><span>Сейчас услышано</span><strong>${escapeHtml(detectedText)}</strong><small>${raw?`${Math.round(raw.rawFreq)} Hz · уверенность ${Math.round(raw.confidence*100)}%`:''}</small></div><div class="v8Calibration card"><div class="sectionKicker">КАЛИБРОВКА ОКТАВЫ</div><h3>${labels[calStep]||'Калибровка готова'}</h3><p>${calStep<3?'Сыграй указанную ноту и нажми «Подтвердить», чтобы запомнить смещение октавы для твоего синтезатора.':'Готово. Проверка пройдена.'}</p>${calStep<3?`<button class="primary full" id="v8ConfirmCal" ${observed==null?'disabled':''}>✓ Подтвердить ${noteText(expected)}</button>`:`<div class="calDone">Сохранено смещение: <b>${offset>0?'+':''}${offset} полутонов</b></div>`}<button class="ghostBtn full" id="v8ResetCal">Сбросить калибровку</button></div>`:`<button class="primary full" id="v8MicConnect">🎙 Подключить микрофон</button>`}<div class="v8MicTips"><b>Чтобы распознавание было стабильным</b><span>Телефон лучше ставить рядом с динамиком синтезатора, но не вплотную к нему. Убери лишние источники звука и не играй слишком тихо.</span></div></div>`;
  o.classList.add('show');
  $('#v8MicClose').onclick=v8CloseMicCheck;$('#v8MicBackdrop').onclick=v8CloseMicCheck;
  $('#v8MicConnect')?.addEventListener('click',async()=>{await startMic();v8MicCheckRender()});
  $('#v8ResetCal')?.addEventListener('click',()=>{const ap=v8AudioProfile();ap.octaveOffset=0;ap.calibrated=false;save();o.dataset.calStep='0';v8MicCheckRender()});
  $('#v8ConfirmCal')?.addEventListener('click',()=>{const obs=v8LastRawResult?.physicalMidi;if(obs==null)return;const ap=v8AudioProfile();const candidate=Math.round(expected-obs);ap.octaveOffset=v8Clamp(candidate,-24,24);ap.calibrated=true;save();o.dataset.calStep=String(calStep+1);if(calStep+1>=3){toast(`Калибровка сохранена: ${ap.octaveOffset>0?'+':''}${ap.octaveOffset} полутонов`,'good')}v8MicCheckRender()});
}
function openMicCheck(){v8MicCheckRender()}

/* ------------------------------------------------------------------------
   5. Practice room: no live mic diagnostics on every practice tab
   ------------------------------------------------------------------------ */
function renderPractice(){
  const tab=practiceState.tab||'notes';
  $('#practice').innerHTML=`${header('Практика','home','ТРЕНИРОВКА')}<div class="practiceTabs">${[['notes','Ноты'],['chords','Аккорды'],['ear','Слух'],['tuner','Тюнер'],['weak','Слабые места'],['session','⚡ 3 минуты']].map(x=>`<button class="practiceTab ${tab===x[0]?'active':''}" data-practice="${x[0]}">${x[1]}</button>`).join('')}</div><div class="practiceTopActions"><button class="secondary" id="openMicCheck">🎙 Проверить микрофон</button><span>${mic.stream?'Микрофон подключён':'Микрофон не подключён'}</span></div><div class="practiceExplain card"><b>${tab==='tuner'?'Тюнер — это проверка точности высоты одной ноты.':tab==='chords'?'Аккорды — несколько нот одновременно.':tab==='ear'?'Тренируем слух отдельно от микрофона.':tab==='weak'?'Повторяем места, где было больше ошибок.':tab==='session'?'Три минуты непрерывной разминки.':'Играешь ноту — микрофон проверяет её название и точную октаву.'}</b><span>${tab==='tuner'?'Сыграй одну ноту и смотри, ближе ли она к центру.':tab==='chords'?'Нажми три нужные ноты вместе или почти одновременно.':tab==='ear'?'Есть отдельные режимы для нот и типов аккордов.':tab==='session'?'Ноты меняются после правильного ответа.':'Если октава не совпадает, сначала открой отдельную проверку микрофона.'}</span></div><div id="practiceContent"></div>`;
  $$('[data-practice]').forEach(b=>b.onclick=()=>{practiceState.tab=b.dataset.practice;renderPractice()});
  $('#openMicCheck').onclick=openMicCheck;
  const box=$('#practiceContent');
  if(tab==='notes')box.innerHTML=renderPracticeNotesV5();else if(tab==='chords')box.innerHTML=renderPracticeChordsV5();else if(tab==='ear')box.innerHTML=renderPracticeEarV5();else if(tab==='tuner')box.innerHTML=renderTunerV5();else if(tab==='session')box.innerHTML=v6RenderWarmup();else box.innerHTML=renderWeakV5();
  bindPracticeV5(tab);
  if(tab==='ear'){
    /* Keep the existing selectable ear modes from V7 when available. */
    setTimeout(()=>{const noteMode=$('#v7EarModeNote'),chordMode=$('#v7EarModeChord');noteMode?.addEventListener('click',()=>{});chordMode?.addEventListener('click',()=>{});},0);
  }
}

/* Exact octave in practice notes, with full range. */
function handlePracticeDetection(m,meta){
  if(practiceState.tab==='notes'||practiceState.tab==='weak'){
    const t=practiceState.note;if(t==null)return;const ok=m===t;const el=$('#practiceFeedback');
    if(ok){practiceState.notePassed=true;markActive();state.stats=state.stats||{};state.stats.notes=(state.stats.notes||0)+1;v6EnsureStats().perfectRun=(v6EnsureStats().perfectRun||0)+1;save();if(el)el.innerHTML=feedbackMarkup('good','Верно!',`Распознано ${noteText(m)} — точное совпадение.`);flashKeys([m],true)}
    else{v6EnsureStats().perfectRun=0;state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();if(el)el.innerHTML=feedbackMarkup('bad','Попробуй ещё',`Услышано ${noteText(m)}. Нужно ${noteText(t)}.`);flashKeys([m],false)}return;
  }
  if(practiceState.tab==='tuner'){handleTunerDetected(m,meta);return;}
  if(practiceState.tab==='session'&&practiceState.warmup?.started&&!practiceState.warmup.finished){const w=practiceState.warmup,t=practiceState.note;if(m===t){w.correct++;w.index++;practiceState.note=randomPracticeMidi();save();flashKeys([m],true);renderPractice()}else{w.errors++;state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();const e=$('#practiceSessionFeedback');if(e)e.innerHTML=feedbackMarkup('bad','Почти',`Услышано ${noteText(m)}. Нужно ${noteText(t)}.`);flashKeys([m],false)}return;}
  if(practiceState.tab==='chords')return;
}

/* ------------------------------------------------------------------------
   6. Calendar + activity colors
   ------------------------------------------------------------------------ */
let v8CalendarDate=new Date();
function v8MonthXP(y,m){let total=0;for(const [k,v] of Object.entries(state.activityDays||{}))if(k.startsWith(`${y}-${String(m+1).padStart(2,'0')}`))total+=Number(v)||0;return total}
function renderCalendar(){
  const overlay=$('#calendarOverlay');if(!overlay)return;
  const y=v8CalendarDate.getFullYear(),m=v8CalendarDate.getMonth(),first=new Date(y,m,1),daysIn=new Date(y,m+1,0).getDate();
  const monthName=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(first);const start=(first.getDay()+6)%7;const maxXP=Math.max(1,...Object.entries(state.activityDays||{}).filter(([k])=>k.startsWith(`${y}-${String(m+1).padStart(2,'0')}`)).map(([,v])=>Number(v)||0));
  let cells='';for(let i=0;i<start;i++)cells+='<div class="v8CalCell empty"></div>';
  for(let d=1;d<=daysIn;d++){const date=new Date(y,m,d),key=todayKeyFromDate(date),xp=Number(state.activityDays?.[key]||0),ratio=xp/maxXP;const level=xp?Math.min(4,Math.max(1,Math.ceil(ratio*4))):0;const today=date.toDateString()===new Date().toDateString();cells+=`<div class="v8CalCell level-${level} ${today?'today':''}" title="${escapeHtml(date.toLocaleDateString('ru-RU',{day:'numeric',month:'long'}))}: ${xp} XP"><b>${d}</b>${xp?`<small>${xp}</small>`:''}</div>`}
  const active=Object.keys(state.activityDays||{}).filter(k=>k.startsWith(`${y}-${String(m+1).padStart(2,'0')}`)).length;
  overlay.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="calendarDialog card v8CalendarDialog"><div class="calendarHead"><div><div class="sectionKicker">АКТИВНОСТЬ</div><h2>${monthName.charAt(0).toUpperCase()+monthName.slice(1)}</h2><p>Зелёный = занимался. Более насыщенный зелёный = больше XP за день.</p></div><button class="backBtn" id="calendarClose">×</button></div><div class="v8CalendarNav"><button id="v8CalPrev">‹</button><strong>${monthName.charAt(0).toUpperCase()+monthName.slice(1)}</strong><button id="v8CalNext">›</button></div><div class="calendarWeekdays">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span>${x}</span>`).join('')}</div><div class="v8CalendarGrid">${cells}</div><div class="calendarLegend"><span>нет активности</span><i class="level-1"></i><i class="level-2"></i><i class="level-3"></i><i class="level-4"></i><span>больше XP</span></div><div class="calendarMonthStat"><b>${active}</b> активных дней · <b>${v8MonthXP(y,m)} XP</b> в этом месяце</div></div>`;
  overlay.className='calendarOverlay show';$('#calendarClose').onclick=()=>overlay.className='calendarOverlay';$('#calendarBackdrop').onclick=()=>overlay.className='calendarOverlay';$('#v8CalPrev').onclick=()=>{v8CalendarDate=new Date(y,m-1,1);renderCalendar()};$('#v8CalNext').onclick=()=>{v8CalendarDate=new Date(y,m+1,1);renderCalendar()};
}

/* ------------------------------------------------------------------------
   7. Steam-style 54 achievements: 40 visible + 14 hidden
   ------------------------------------------------------------------------ */
const V8_ACHIEVEMENTS=[
 ['firstLaunch','🚪','Добро пожаловать','Открыть сайт и заглянуть в обучение'],
 ['practiceOpen','◎','На тренировку','Открыть раздел практики'],
 ['micConnected','🎙️','На связи','Один раз успешно подключить микрофон'],
 ['firstNote','🎹','Первая нота','Завершить первый урок'],
 ['fiveLessons','🌱','Первые шаги','Завершить 5 уроков'],
 ['tenLessons','🔥','Разогрев','Завершить 10 уроков'],
 ['twentyLessons','📚','В ритме','Завершить 20 уроков'],
 ['thirtyLessons','🧠','Читаю музыку','Завершить 30 уроков'],
 ['fortyLessons','🎼','Музыкальная база','Завершить 40 уроков'],
 ['fiftyLessons','🚀','Половина пути','Завершить 50 уроков'],
 ['seventyFiveLessons','💫','Большой прогресс','Завершить 75 уроков'],
 ['hundredLessons','🏅','Последняя прямая','Завершить 100 уроков'],
 ['course','👑','Финальный аккорд','Завершить все 115 уроков'],
 ['xp100','⚡','100 XP','Набрать 100 XP'],
 ['xp500','💎','500 XP','Набрать 500 XP'],
 ['xp1000','🌟','1000 XP','Набрать 1000 XP'],
 ['xp2500','💠','2500 XP','Набрать 2500 XP'],
 ['xp5000','🔷','5000 XP','Набрать 5000 XP'],
 ['day3','🔥','Три дня','Заниматься 3 дня'],
 ['day7','🗓️','Неделя','Заниматься 7 дней'],
 ['day14','🌙','Две недели','Заниматься 14 дней'],
 ['day30','☀️','Месяц','Заниматься 30 дней'],
 ['songs1','🎵','Первая песня','Открыть прогресс в одной песне'],
 ['songs3','🎶','Три мелодии','Потренироваться в 3 песнях'],
 ['songs10','🎻','Репертуар','Потренироваться в 10 песнях'],
 ['favorite','❤️','Коллекционер','Добавить песню в избранное'],
 ['mistake','🛠️','Не сдался','Исправить ошибку и пройти урок'],
 ['chord1','⌬','Первый аккорд','Правильно распознать аккорд'],
 ['ear1','👂','Слышу','Пройти ответ в тренировке слуха'],
 ['tuner1','🎯','В центре','Поймать ноту тюнером'],
 ['fiveOct','🌈','Пять регистров','Сыграть ноты в 1–5 октавах'],
 ['perfect10','✨','Чистая серия','10 целей подряд без ошибки'],
 ['warmup','⏱️','Разогрев 3:00','Завершить трёхминутную разминку'],
 ['lessonPulse','◷','Чувствую пульс','Завершить урок 15'],
 ['lessonReading','♫','Читаю стан','Завершить урок 35'],
 ['lessonIntervals','↗','Вижу расстояние','Завершить урок 45'],
 ['lessonChords','⌬','Гармония','Завершить урок 60'],
 ['lessonScales','≈','По ступенькам','Завершить урок 72'],
 ['lessonHands','⇄','Две руки','Завершить урок 92'],
 ['lessonMusicality','◌','Музыкальность','Завершить урок 100'],
 ['lessonSongProject','♬','Песенный проект','Завершить урок 110'],
 /* 14 hidden */
 ['h1','🔮','?','hidden'],['h2','🗝️','?','hidden'],['h3','🌌','?','hidden'],['h4','🪄','?','hidden'],['h5','🧩','?','hidden'],['h6','🛰️','?','hidden'],['h7','🕰️','?','hidden'],['h8','🎯','?','hidden'],['h9','🦾','?','hidden'],['h10','🎹','?','hidden'],['h11','🌠','?','hidden'],['h12','🧭','?','hidden'],['h13','🪐','?','hidden'],['h14','👑','?','hidden']
];
function v8UnlockedSongCount(){return Object.values(state.songProgress||{}).filter(v=>(Number(v?.best)||0)>0).length}
function v8Stats(){state.stats=state.stats||{};return state.stats}
function v8AchievementList(){
  const days=Object.keys(state.activityDays||{}).length,songs=v8UnlockedSongCount(),stats=v8Stats();
  const completed=completedCount();
  const visible={
    firstLaunch:true,practiceOpen:(stats.practiceOpen||0)>=1,micConnected:!!state.audioProfile?.autoReconnect,firstNote:completed>=1,fiveLessons:completed>=5,tenLessons:completed>=10,twentyLessons:completed>=20,thirtyLessons:completed>=30,fortyLessons:completed>=40,fiftyLessons:completed>=50,seventyFiveLessons:completed>=75,hundredLessons:completed>=100,course:completed>=115,xp100:state.xp>=100,xp500:state.xp>=500,xp1000:state.xp>=1000,xp2500:state.xp>=2500,xp5000:state.xp>=5000,day3:days>=3,day7:days>=7,day14:days>=14,day30:days>=30,songs1:songs>=1,songs3:songs>=3,songs10:songs>=10,favorite:(state.favorites||[]).length>=1,mistake:Object.keys(state.mistakes||{}).length>=1&&completed>=2,chord1:(stats.chords||0)>=1,ear1:(stats.ear||0)>=1,tuner1:(stats.tuner||0)>=1,fiveOct:Object.keys(state.octavesSeen||{}).filter(o=>o>=1&&o<=5).length>=5,perfect10:(stats.perfectRun||0)>=10,warmup:(stats.warmup||0)>=1,lessonPulse:completed>=15,lessonReading:completed>=35,lessonIntervals:completed>=45,lessonChords:completed>=60,lessonScales:completed>=72,lessonHands:completed>=92,lessonMusicality:completed>=100,lessonSongProject:completed>=110
  };
  const hiddenFns={
    h1:()=>completed>=10&&(stats.perfectRun||0)>=5,
    h2:()=>days>=7&&completed>=20,
    h3:()=>Object.keys(state.octavesSeen||{}).length>=5&&(stats.notes||0)>=50,
    h4:()=>songs>=5&&(stats.chords||0)>=5,
    h5:()=>completed>=35&&Object.keys(state.mistakes||{}).length>=10,
    h6:()=>completed>=60&&state.xp>=3000,
    h7:()=>completed>=80&&days>=14,
    h8:()=>completed>=100&&(stats.perfectRun||0)>=10,
    h9:()=>songs>=10&&days>=10,
    h10:()=>completed>=115,
    h11:()=>Number(stats.warmup||0)>=3,
    h12:()=>Number(stats.ear||0)>=25,
    h13:()=>Number(stats.chords||0)>=25,
    h14:()=>completed>=115&&days>=30&&songs>=10
  };
  return V8_ACHIEVEMENTS.map(a=>({id:a[0],icon:a[1],title:a[2],desc:a[3],hidden:a[3]==='hidden',ok:a[3]==='hidden'?!!hiddenFns[a[0]]():!!visible[a[0]]}));
}
function achievementList(){return v8AchievementList()}
function openAchievementModal(){
  const overlay=$('#calendarOverlay');if(!overlay)return;const list=v8AchievementList(),done=list.filter(x=>x.ok).length;
  overlay.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="achievementDialog card v8AchievementDialog"><div class="calendarHead"><div><div class="sectionKicker">ДОСТИЖЕНИЯ · ${done}/${list.length}</div><h2>Как в игре</h2><p>Открытые достижения становятся яркими. Закрытые видны, а 14 секретных скрывают своё условие до разблокировки.</p></div><button class="backBtn" id="achClose">×</button></div><div class="achievementGrid">${list.map(a=>`<div class="achievement ${a.ok?'unlocked':''} ${a.hidden?'hiddenAchievement':''}"><span>${a.ok?a.icon:(a.hidden?'?':a.icon)}</span><div><b>${a.hidden&&!a.ok?'Скрытое достижение':a.title}</b><small>${a.hidden&&!a.ok?'Условие скрыто до разблокировки.':a.desc}</small></div><i>${a.ok?'✓':(a.hidden?'?':'🔒')}</i></div>`).join('')}</div></div>`;
  overlay.className='calendarOverlay show';$('#achClose').onclick=()=>overlay.className='calendarOverlay';$('#calendarBackdrop').onclick=()=>overlay.className='calendarOverlay';
}

/* ------------------------------------------------------------------------
   8. Home polish + blue weekly activity
   ------------------------------------------------------------------------ */
function renderHome(){
  const done=completedCount(),next=nextLesson()||COURSE_SIZE,lvl=userLevel(),pct=levelProgress(),ach=v8AchievementList().filter(a=>a.ok).length,days=Object.keys(state.activityDays||{}).length;
  const module=moduleFor(next),micReady=!!mic.stream;const maxWeekXP=Math.max(1,...Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return Number(state.activityDays?.[todayKeyFromDate(d)]||0)}));
  $('#home').innerHTML=`<div class="homeHero v5Hero"><div class="heroTopline"><span class="heroBadge">✦</span><span class="microLabel">PIANO LEARNING · УРОВЕНЬ ${lvl}</span></div><div class="eyebrow">115 последовательных уроков</div><h1>Играй.<br><em>Понимай.</em><br>Становись лучше.</h1><p>Каждый урок даёт одну новую идею, короткую практику и понятный результат.</p><div class="heroActions"><button class="primary" id="homeStart">▶ ${done?'Продолжить курс':'Начать курс'}</button><button class="secondary" id="homeMic">${micReady?'✓ Микрофон подключён':'🎙 Подключить микрофон'}</button></div><div class="statusLine ${micReady?'ok':''}"><span class="statusDot"></span>${micReady?'Микрофон готов — можно играть на настоящем инструменте.':'Для проверки звука подключи микрофон один раз.'}</div></div><div class="dashboardGrid"><button class="levelCard card clickable" id="openLevel"><div class="dashIcon">⭐</div><div><div class="sectionKicker">УРОВЕНЬ</div><b>${lvl}</b><small>${state.xp} XP · ${100-pct} до следующего</small></div><div class="miniProgress"><i style="width:${pct}%"></i></div></button><button class="miniFeature card clickable" id="openAchievements"><span>🏆</span><div><b>Достижения</b><small>${ach} из ${v8AchievementList().length} открыто</small></div><strong>›</strong></button></div><button class="nextLessonCard clickable" id="continueCard"><div class="nextIcon">${module.icon}</div><div><div class="microLabel">СЛЕДУЮЩИЙ УРОК · ${next}</div><h2>${escapeHtml(LESSON_TITLES[next-1])}</h2><p>${escapeHtml(module.name)} · +${xpFor(next)} XP</p></div><span class="arrow">›</span></button><div class="progressCard card"><div class="progressTop"><span>Прогресс курса</span><b>${done} / ${COURSE_SIZE}</b></div><div class="progressTrack"><i style="width:${done/COURSE_SIZE*100}%"></i></div><div class="progressMeta"><span>${state.xp} XP всего</span><span>${days} активных дней</span><button id="openCalendarInline">📅 Календарь</button></div></div><div class="homeTiles"><button class="tile clickable" data-go="course"><span>▦</span><b>Курс</b><small>10 этапов · 115 уроков</small></button><button class="tile clickable" data-go="practice"><span>◎</span><b>Практика</b><small>Ноты · аккорды · слух · тюнер</small></button><button class="tile clickable" data-go="songs"><span>♪</span><b>Песни</b><small>${SONGS.length} учебных проектов</small></button></div><div class="weekCard card v8WeekCard"><div class="sectionKicker">АКТИВНОСТЬ</div><div class="weekTitle"><b>Твоя неделя</b><button id="openCalendarWeek">Открыть календарь</button></div><div class="weekDots">${Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const k=todayKeyFromDate(d),xp=Number(state.activityDays?.[k]||0),ratio=xp/maxWeekXP;return `<div><span class="weekDot v8Blue level-${xp?Math.min(4,Math.max(1,Math.ceil(ratio*4))):0}"></span><small>${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][d.getDay()===0?6:d.getDay()-1]}</small></div>`}).join('')}</div></div>`;
  $('#homeStart').onclick=()=>openLesson(next);$('#homeMic').onclick=()=>{if(mic.stream)openMicCheck();else startMic()};$('#openLevel').onclick=openLevelModal;$('#openAchievements').onclick=openAchievementModal;$('#continueCard').onclick=()=>openLesson(next);$('#openCalendarInline').onclick=renderCalendar;$('#openCalendarWeek').onclick=renderCalendar;$$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
  v8Stats().firstLaunch=1;save();
}

/* ------------------------------------------------------------------------
   9. 50-song library: add 14 more projects. Exact arrangements remain
      user-MIDI based for copyrighted songs.
   ------------------------------------------------------------------------ */
const V8_MORE_SONGS=[
 {id:'unravel',title:'Tokyo Ghoul — Unravel',author:'TK from Ling tosite sigure',difficulty:'Средне',level:3,category:'Аниме',icon:'🕷️',colorClass:'night',video:null,videoLabel:'Piano tutorial',desc:'Аниме-проект для мелодии, ритма и координации.',tags:['аниме','мелодия'],arrangementRequired:true},
 {id:'yourlie',title:'Your Lie in April — Hikaru Nara',author:'Goose house',difficulty:'Средне',level:3,category:'Аниме',icon:'🌸',colorClass:'rose',video:null,videoLabel:'Piano tutorial',desc:'Энергичный проект с мелодией и движением.',tags:['аниме','ритм'],arrangementRequired:true},
 {id:'spiritedaway',title:'Spirited Away — One Summer’s Day',author:'Joe Hisaishi',difficulty:'Легко',level:2,category:'Кино',icon:'🌊',colorClass:'water',video:null,videoLabel:'Piano tutorial',desc:'Спокойный проект на легато и фразировку.',tags:['кино','легато'],arrangementRequired:true},
 {id:'totoro',title:'My Neighbor Totoro — Path of the Wind',author:'Joe Hisaishi',difficulty:'Легко',level:2,category:'Кино',icon:'🌿',colorClass:'spring',video:null,videoLabel:'Piano tutorial',desc:'Мелодичный проект для ровного пульса.',tags:['кино','мелодия'],arrangementRequired:true},
 {id:'interstellarMain',title:'Interstellar — Main Theme',author:'Hans Zimmer',difficulty:'Продвинуто',level:4,category:'Кино',icon:'🪐',colorClass:'space',video:null,videoLabel:'Piano tutorial',desc:'Проект на остинато и постепенное наращивание динамики.',tags:['кино','остинато'],arrangementRequired:true},
 {id:'journey',title:'Journey — Apotheosis',author:'Austin Wintory',difficulty:'Средне',level:3,category:'Игры',icon:'🏜️',colorClass:'sun',video:null,videoLabel:'Piano tutorial',desc:'Игровая музыка для работы с атмосферой и фразировкой.',tags:['игры','атмосфера'],arrangementRequired:true},
 {id:'celesteRes',title:'Celeste — First Steps',author:'Lena Raine',difficulty:'Средне',level:3,category:'Игры',icon:'🏔️',colorClass:'violet',video:null,videoLabel:'Piano tutorial',desc:'Ритм и короткие повторяющиеся мотивы.',tags:['игры','ритм'],arrangementRequired:true},
 {id:'ori',title:'Ori and the Blind Forest — Restoring the Light',author:'Gareth Coker',difficulty:'Продвинуто',level:4,category:'Игры',icon:'✨',colorClass:'magic',video:null,videoLabel:'Piano tutorial',desc:'Выразительный проект на динамику и координацию.',tags:['игры','динамика'],arrangementRequired:true},
 {id:'hades',title:'Hades — Good Riddance',author:'Darren Korb',difficulty:'Средне',level:3,category:'Игры',icon:'🔥',colorClass:'rose',video:null,videoLabel:'Piano tutorial',desc:'Мелодия и аккорды с мягким пульсом.',tags:['игры','аккорды'],arrangementRequired:true},
 {id:'portal',title:'Portal — Still Alive',author:'Jonathan Coulton',difficulty:'Средне',level:3,category:'Игры',icon:'🟠',colorClass:'water',video:null,videoLabel:'Piano tutorial',desc:'Песенный проект на ритмическую стабильность.',tags:['игры','пульс'],arrangementRequired:true},
 {id:'bachMinuet',title:'Minuet in G Major',author:'J. S. Bach / attributed to Petzold',difficulty:'Легко',level:2,category:'Классика',icon:'🎼',colorClass:'stone',video:null,videoLabel:'Piano tutorial',desc:'Классическая пьеса для фразировки и координации.',tags:['классика','фразировка'],arrangementRequired:false},
 {id:'chopinPrelude4',title:'Prelude in E Minor, Op. 28 No. 4',author:'Frédéric Chopin',difficulty:'Средне',level:3,category:'Классика',icon:'🕯️',colorClass:'moon',video:null,videoLabel:'Piano tutorial',desc:'Короткая классическая пьеса на выразительность и аккорды.',tags:['классика','аккорды'],arrangementRequired:false},
 {id:'swan',title:'The Swan — Le Cygne',author:'Camille Saint-Saëns',difficulty:'Продвинуто',level:4,category:'Классика',icon:'🦢',colorClass:'water',video:null,videoLabel:'Piano tutorial',desc:'Плавная мелодия для работы над легато.',tags:['классика','легато'],arrangementRequired:false},
 {id:'greensleeves',title:'Greensleeves',author:'Traditional',difficulty:'Легко',level:2,category:'Традиционное',icon:'🍃',colorClass:'spring',video:null,videoLabel:'Piano tutorial',desc:'Знакомая мелодия для чтения и ровного пульса.',tags:['традиционное','мелодия'],arrangementRequired:false}
];
for(const s of V8_MORE_SONGS){if(!SONGS.some(x=>x.id===s.id))SONGS.push(s)}

/* Prevent false claims of exact copyrighted notes in the built-in demo. */
const V8_BASE_SONG_STAGE=window.songStageData;
function songStageData(s,stage){
  const f=(s.fragment&&s.fragment.length?s.fragment:[60,62,64,67,65,64,62,60]).slice();
  const base=12*(Math.min(6,Math.max(2,Number(s.level)||2)));
  const melody=f.map(n=>base+(n-60));
  const bass=[Math.max(24,base-12),Math.max(24,base-7),Math.max(24,base-5),Math.max(24,base-7)];
  return [
    {name:'Послушать',kind:'listen',desc:'Сначала услышь характер короткого фрагмента и найди его первую опорную ноту.',seq:melody.slice(0,1)},
    {name:'Правая рука',kind:'right',desc:'Разбери небольшую мелодическую группу и играй в своём темпе.',seq:melody.slice(0,4)},
    {name:'Левая рука',kind:'left',desc:'Освой опору отдельно, чтобы она не мешала мелодии.',seq:bass},
    {name:'Две руки',kind:'join',desc:'Соедини партии сначала медленно, затем постепенно прибавь темп.',seq:melody.slice(0,6)},
    {name:'Исполнение',kind:'run',desc:'Сыграй учебный фрагмент целиком. Для точной аранжировки можно загрузить MIDI.',seq:melody.slice(0,8)}
  ][Math.max(0,Math.min(4,stage))];
}

/* Make exact-ness explicit in song pages. */
const V8_BASE_RENDER_SONG=window.renderSong;
function renderSong(){
  V8_BASE_RENDER_SONG();
  const s=songRuntime?.song,root=$('#song');if(!s||!root)return;
  const panel=root.querySelector('.midiPanel');if(panel){const p=panel.querySelector('p');if(p)p.textContent=s.arrangementRequired?'Для этой песни встроенный фрагмент является учебным ориентиром. Для точного обучения конкретной аранжировке загрузите MIDI этой версии — тогда сайт использует реальные ноты и тайминг.':'Можно загрузить MIDI своей версии, чтобы учить точную последовательность нот и тайминг.';}
}

/* ------------------------------------------------------------------------
   10. Mic remembered after the first successful permission
   ------------------------------------------------------------------------ */
async function v8TryAutoReconnect(){
  try{
    const p=v8AudioProfile();if(!p.autoReconnect||mic.stream||!navigator.permissions?.query)return;
    const perm=await navigator.permissions.query({name:'microphone'});if(perm.state==='granted')await startMic({silent:true});
  }catch{}
}

/* Track practice-open and keep browser permission separate from the stream. */
function go(id){
  if(id!=='lesson'&&metroOn){metroOn=false;stopMetronome()}
  if(id!=='practice')clearPracticeSessionTimer();route=id;render();window.scrollTo({top:0,behavior:'smooth'});
  if(id==='practice'){v8Stats().practiceOpen=(v8Stats().practiceOpen||0)+1;save();}
}

window.addEventListener('load',()=>setTimeout(v8TryAutoReconnect,700));
window.addEventListener('beforeunload',()=>{mic.stream?.getTracks().forEach(t=>t.stop());stopMetronome()});

/* ------------------------------------------------------------------------
   11. Visual additions for V8
   ------------------------------------------------------------------------ */
(function(){
  if(document.getElementById('v8Style'))return;
  const st=document.createElement('style');st.id='v8Style';st.textContent=`
    .practiceTopActions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:10px 0 16px}.practiceTopActions>span{font-size:12px;color:var(--muted,#98a0b3)}
    .v8MicCheck{position:fixed;inset:0;z-index:9999;display:none}.v8MicCheck.show{display:block}.v8MicBackdrop{position:absolute;inset:0;background:rgba(3,7,16,.72);backdrop-filter:blur(10px)}
    .v8MicPanel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(760px,94vw);max-height:92vh;overflow:auto;background:#101522;border:1px solid rgba(255,255,255,.09);border-radius:28px;padding:24px;box-shadow:0 30px 90px rgba(0,0,0,.45)}
    .v8MicHead{display:flex;justify-content:space-between;gap:18px}.v8MicHead h2{margin:.25rem 0}.v8MicHead p{margin:0;color:var(--muted,#98a0b3)}.v8MicStatus,.v8Detected,.v8Calibration,.v8MicTips{margin-top:16px;padding:16px;border-radius:20px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07)}
    .v8MicStatus{display:grid;grid-template-columns:auto 1fr;column-gap:10px}.v8MicStatus small{grid-column:2}.v8Detected strong{display:block;font-size:26px;margin:7px 0}.v8Detected small{color:var(--muted,#98a0b3)}
    .v8Calibration h3{margin:.4rem 0}.v8Calibration p{color:var(--muted,#98a0b3)}.calDone{padding:12px;border-radius:14px;background:rgba(58,197,121,.12)}
    .v8MicTips{display:flex;flex-direction:column;gap:6px}.v8MicTips span{color:var(--muted,#98a0b3)}
    .v8CalendarDialog{max-width:760px}.v8CalendarNav{display:flex;align-items:center;justify-content:space-between;margin:12px 0 14px}.v8CalendarNav button{width:42px;height:42px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.05);color:inherit;font-size:27px;cursor:pointer}.v8CalendarGrid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px}.v8CalCell{min-height:62px;border-radius:14px;padding:8px;background:rgba(255,255,255,.04);border:1px solid transparent;display:flex;flex-direction:column;justify-content:space-between}.v8CalCell.today{border-color:rgba(255,255,255,.3)}.v8CalCell small{font-size:10px;opacity:.8}.v8CalCell.level-1{background:rgba(44,194,116,.18);border-color:rgba(44,194,116,.14)}.v8CalCell.level-2{background:rgba(44,194,116,.31);border-color:rgba(44,194,116,.2)}.v8CalCell.level-3{background:rgba(44,194,116,.48);border-color:rgba(44,194,116,.28)}.v8CalCell.level-4{background:rgba(44,194,116,.68);border-color:rgba(44,194,116,.35);color:#f4fff8}.v8CalCell.empty{background:transparent;border:none}.v8CalendarDialog .calendarLegend{display:flex;align-items:center;gap:8px;margin-top:14px}.v8CalendarDialog .calendarLegend i{width:20px;height:20px;border-radius:6px;display:block}.v8CalendarDialog .calendarLegend .level-1{background:rgba(44,194,116,.18)}.v8CalendarDialog .calendarLegend .level-2{background:rgba(44,194,116,.31)}.v8CalendarDialog .calendarLegend .level-3{background:rgba(44,194,116,.48)}.v8CalendarDialog .calendarLegend .level-4{background:rgba(44,194,116,.68)}.calendarMonthStat{margin-top:14px;color:var(--muted,#98a0b3)}
    .weekDot.v8Blue.level-0{background:rgba(89,139,255,.12)}.weekDot.v8Blue.level-1{background:rgba(89,139,255,.25)}.weekDot.v8Blue.level-2{background:rgba(89,139,255,.45)}.weekDot.v8Blue.level-3{background:rgba(89,139,255,.68)}.weekDot.v8Blue.level-4{background:rgba(89,139,255,.95)}
    .v8AchievementDialog{max-width:900px}.achievementGrid{max-height:70vh;overflow:auto}
    .retryAction{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px}.retryAction small{display:block;color:var(--muted,#98a0b3)}.retryGate{margin-top:12px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.035);font-size:12px;color:var(--muted,#98a0b3)}
    @media(max-width:640px){.v8MicPanel{padding:18px;border-radius:22px}.v8CalCell{min-height:48px;padding:6px}.practiceTopActions{flex-direction:column;align-items:stretch}.retryAction{flex-direction:column;align-items:stretch}.retryAction button{width:100%}}
  `;document.head.appendChild(st);
})();

/* ========================================================================
   PIANO LEARNING V9 — AUDIO + COURSE QUALITY PASS
   This is the final in-file layer: no external patch file is required.
   ======================================================================== */

/* ------------------------------------------------------------------------
   1. Audio engine: YIN/MPM ensemble + octave resolver + calibration
   ------------------------------------------------------------------------ */
const V9_YIN_URL = 'https://esm.sh/@audio/pitch-yin@1.0.0';
let v9YinFn = null;
let v9YinLoading = null;
let v9AudioBooted = false;
let v9Stable = [];
let v9LastAnalysisAt = 0;
let v9LastPhysicalResult = null;
let v9ChordFrames = [];
let v9ChordCooldown = 0;

function v9LoadYin(){
  if(v9YinFn) return Promise.resolve(v9YinFn);
  if(v9YinLoading) return v9YinLoading;
  v9YinLoading = import(V9_YIN_URL).then(mod=>{
    v9YinFn = mod.default || mod.yin || mod;
    return v9YinFn;
  }).catch(()=>null);
  return v9YinLoading;
}

function v9BandPeak(freqData,sr,fftSize,f,half=2){
  if(!freqData || !Number.isFinite(f) || f<=0 || f>=sr/2) return 0;
  const bin=f*fftSize/sr, c=Math.round(bin);
  let peak=0;
  for(let d=-half; d<=half; d++){
    const i=c+d;
    if(i>0 && i<freqData.length) peak=Math.max(peak,Math.pow(10,freqData[i]/20));
  }
  return peak;
}

function v9BandMedian(freqData,sr,fftSize,f,width=9){
  if(!freqData || !Number.isFinite(f) || f<=0 || f>=sr/2) return 1e-8;
  const bin=Math.round(f*fftSize/sr), vals=[];
  for(let d=-width; d<=width; d++){
    if(Math.abs(d)<=2) continue;
    const i=bin+d;
    if(i>0 && i<freqData.length) vals.push(Math.pow(10,freqData[i]/20));
  }
  vals.sort((a,b)=>a-b);
  return vals.length ? vals[Math.floor(vals.length/2)] : 1e-8;
}

function v9FundamentalEvidence(freqData,sr,fftSize,midi){
  const f0=v8FreqForMidi(midi);
  if(f0<55 || f0>2200 || f0>=sr/2) return -Infinity;
  const weights=[4.2,2.4,1.55,1.0,.72,.52,.36,.24];
  let score=0, total=0, fundamentalRatio=0;
  for(let h=1; h<=8; h++){
    const f=f0*h;
    if(f>=sr/2) break;
    const peak=v9BandPeak(freqData,sr,fftSize,f,Math.abs(f)<180?3:2);
    const noise=v9BandMedian(freqData,sr,fftSize,f,Math.abs(f)<180?12:8);
    const ratio=peak/(noise+1e-7);
    const evidence=Math.max(0,Math.log1p(Math.max(0,ratio-1)));
    score += evidence*weights[h-1];
    total += weights[h-1];
    if(h===1) fundamentalRatio=ratio;
  }
  /* The true fundamental deserves a large bonus. This is what resolves
     the classic "C4 reported as C3" ambiguity when a note is harmonic-rich. */
  const fundamentalBonus=Math.max(0,Math.log1p(Math.max(0,fundamentalRatio-1)))*1.8;
  return score/(total||1)+fundamentalBonus;
}

function v9Autocorr(buf,sr,f){
  if(!buf || !Number.isFinite(f) || f<55 || f>2200) return -1;
  const lag=Math.round(sr/f);
  if(lag<2 || lag>=buf.length-2) return -1;
  let ab=0,aa=0,bb=0,n=0;
  for(let i=0;i<buf.length-lag;i+=2){
    const a=buf[i],b=buf[i+lag];
    ab+=a*b; aa+=a*a; bb+=b*b; n++;
  }
  return n ? ab/Math.sqrt((aa*bb)||1) : -1;
}

function v9ResolveOctave(buf,sr,rawMidi,freqData,fftSize){
  if(!Number.isFinite(rawMidi)) return null;
  const center=Math.round(rawMidi);
  const candidates=[];
  for(let delta=-24;delta<=24;delta+=12){
    for(let sem=-1;sem<=1;sem++){
      const m=center+delta+sem;
      if(m>=21 && m<=108) candidates.push(m);
    }
  }
  const unique=[...new Set(candidates)];
  let best=null;
  for(const midi of unique){
    const spectral=v9FundamentalEvidence(freqData,sr,fftSize,midi);
    const corr=v9Autocorr(buf,sr,v8FreqForMidi(midi));
    const corrNorm=(corr+1)/2;
    const distance=Math.abs(midi-rawMidi);
    const prior=Math.exp(-distance/2.8)*.10;
    const score=spectral*.74+corrNorm*.26+prior;
    if(!best || score>best.score) best={midi,score,spectral,corr};
  }
  return best;
}

function v9FallbackAutocorrelation(buf,sr){
  const minF=55,maxF=2200,minLag=Math.floor(sr/maxF),maxLag=Math.min(Math.floor(sr/minF),buf.length-2);
  let bestLag=-1,best=-Infinity;
  for(let lag=minLag;lag<=maxLag;lag+=2){
    let ab=0,aa=0,bb=0;
    for(let i=0;i<buf.length-lag;i+=2){const a=buf[i],b=buf[i+lag];ab+=a*b;aa+=a*a;bb+=b*b;}
    const c=ab/Math.sqrt((aa*bb)||1);
    if(c>best){best=c;bestLag=lag;}
  }
  if(bestLag<0) return null;
  return {freq:sr/bestLag,clarity:Math.max(0,Math.min(1,(best-.25)/.70))};
}

function v9AnalyzePitch(buf,sr){
  if(!buf || !buf.length || !mic.freq) return null;
  let mean=0;
  for(const x of buf) mean+=x;
  mean/=buf.length;
  let rms=0;
  for(let i=0;i<buf.length;i++){const y=buf[i]-mean;rms+=y*y;}
  rms=Math.sqrt(rms/buf.length);
  if(rms<.003) return null;
  const work=new Float32Array(buf.length);
  for(let i=0;i<buf.length;i++) work[i]=buf[i]-mean;

  let mpmFreq=null,mpmClarity=0;
  try{
    if(v6PitchDetector===null || !v6PitchDetector || v6PitchDetector.inputLength!==work.length){
      if(v6Pitchy?.PitchDetector) v6PitchDetector=v6Pitchy.PitchDetector.forFloat32Array(work.length);
    }
    if(v6PitchDetector){
      const res=v6PitchDetector.findPitch(work,sr);
      if(Number.isFinite(res?.[0])){mpmFreq=res[0];mpmClarity=Number(res[1])||0;}
    }
  }catch{}

  let yinFreq=null,yinClarity=0;
  try{
    if(v9YinFn){
      const res=v9YinFn(work,{fs:sr,minFreq:55,maxFreq:2200});
      if(res && Number.isFinite(res.freq)){yinFreq=res.freq;yinClarity=Number(res.clarity)||0;}
    }
  }catch{}

  if(!Number.isFinite(mpmFreq) && !Number.isFinite(yinFreq)){
    const fb=v9FallbackAutocorrelation(work,sr);
    if(fb){mpmFreq=fb.freq;mpmClarity=fb.clarity;}
  }
  if(!Number.isFinite(mpmFreq) && !Number.isFinite(yinFreq)) return null;

  const freqs=[
    Number.isFinite(mpmFreq)?{f:mpmFreq,c:mpmClarity,w:1}:null,
    Number.isFinite(yinFreq)?{f:yinFreq,c:yinClarity,w:1}:null
  ].filter(Boolean);

  /* If estimators agree, use their weighted mean. If they differ by a
     perfect octave, keep the spectrum-based resolver in charge. */
  const meanFreq=freqs.reduce((a,x)=>a+x.f*x.w,0)/freqs.reduce((a,x)=>a+x.w,0);
  const rawMidi=69+12*Math.log2(meanFreq/440);
  const fftSize=mic.analyser?.fftSize||buf.length;
  const resolved=v9ResolveOctave(work,sr,rawMidi,mic.freq,fftSize);
  if(!resolved) return null;

  const rawCandidates=freqs.map(x=>69+12*Math.log2(x.f/440));
  const estimatorAgreement=rawCandidates.length===1?1:Math.max(0,1-Math.min(2,Math.abs(rawCandidates[0]-rawCandidates[1]))/2);
  const confidence=Math.max(.05,Math.min(1,.55*Math.max(mpmClarity,yinClarity,.35)+.45*estimatorAgreement));
  const physicalMidi=resolved.midi;
  const profile=v8AudioProfile();
  const offset=Math.round(Number(profile.octaveOffset)||0);
  const corrected=v8Clamp(physicalMidi+offset,21,108);
  const exactMidi=Math.round(corrected);
  const exactFreq=v8FreqForMidi(exactMidi);
  const cents=(Math.log2(meanFreq/exactFreq))*1200;

  const result={
    midi:exactMidi,
    physicalMidi,
    rawMidi,
    rawFreq:meanFreq,
    confidence,
    cents,
    rms,
    octaveOffset:offset,
    mpmFreq,
    yinFreq,
    octaveScore:resolved.score
  };
  v9LastPhysicalResult=result;
  return result;
}

function detectPitch(buf,sr){return v9AnalyzePitch(buf,sr)}

function v9StableDispatch(result,now){
  v9Stable.push(result);
  if(v9Stable.length>7)v9Stable.shift();
  const groups=new Map();
  for(const x of v9Stable){const m=Math.round(x.midi);groups.set(m,(groups.get(m)||0)+1);}
  const ranked=[...groups.entries()].sort((a,b)=>b[1]-a[1]);
  if(!ranked.length)return;
  const [m,count]=ranked[0];
  if(count<3)return;
  const same=v9Stable.filter(x=>Math.round(x.midi)===m);
  const avgConf=same.reduce((a,x)=>a+x.confidence,0)/same.length;
  if(mic.candidateMidi!==m){mic.candidateMidi=m;mic.candidateSince=now;return;}
  if(now-mic.candidateSince<70)return;
  if(mic.lastMidi===m && now-(mic.lastDispatch||0)<500)return;
  mic.lastMidi=m;mic.lastDispatch=now;
  markOctaveSeen(m);
  onDetected(m,{
    confidence:avgConf,
    cents:same.reduce((a,x)=>a+x.cents,0)/same.length,
    freq:result.rawFreq,
    physicalMidi:result.physicalMidi,
    rawMidi:result.rawMidi
  });
}

/* ------------------------------------------------------------------------
   2. Target-driven chord recognizer
   ------------------------------------------------------------------------ */
function v9PitchClassSpectrum(freqData,sr,fftSize,pc){
  let best=-Infinity;
  for(let midi=24+pc; midi<=96; midi+=12){
    const f=v8FreqForMidi(midi);
    const fundamental=v9BandPeak(freqData,sr,fftSize,f,3);
    const local=v9BandMedian(freqData,sr,fftSize,f,10);
    const fundamentalRatio=fundamental/(local+1e-7);
    let score=Math.log1p(Math.max(0,fundamentalRatio-1))*4;
    const hs=[2,3,4,5];
    const ws=[1.4,.95,.65,.45];
    for(let i=0;i<hs.length;i++){
      const ff=f*hs[i];
      if(ff>=sr/2)break;
      const a=v9BandPeak(freqData,sr,fftSize,ff,2);
      const n=v9BandMedian(freqData,sr,fftSize,ff,8);
      score+=Math.log1p(Math.max(0,a/(n+1e-7)-1))*ws[i];
    }
    if(score>best)best=score;
  }
  return best;
}

function v9ChordFrame(targetPCs){
  if(!mic.freq || !mic.ctx || !mic.analyser)return null;
  const scores=Array.from({length:12},(_,pc)=>v9PitchClassSpectrum(mic.freq,mic.ctx.sampleRate,mic.analyser.fftSize,pc));
  const wanted=[...new Set(targetPCs)];
  const targetScores=wanted.map(pc=>scores[pc]);
  const maxTarget=Math.max(...targetScores);
  const medianOther=[...scores].filter((_,pc)=>!wanted.includes(pc)).sort((a,b)=>a-b);
  const otherMedian=medianOther.length?medianOther[Math.floor(medianOther.length/2)]:0;
  const threshold=Math.max(.48,maxTarget*.42);
  return {scores,wanted,targetScores,maxTarget,otherMedian,complete:targetScores.every(s=>s>=threshold)};
}

function v9ResetChordFrames(){v9ChordFrames=[]}

function v9ChordPoll(){
  const target=v8ChordTargetFromContext();
  if(!target || performance.now()<v9ChordCooldown)return false;
  const frame=v9ChordFrame(target);if(!frame)return false;
  v9ChordFrames.push(frame);
  if(v9ChordFrames.length>5)v9ChordFrames.shift();
  const allTargetStrong=v9ChordFrames.length>=3 && frame.wanted.every(pc=>{
    let hits=0;
    for(const f of v9ChordFrames)if(f.scores[pc]>=Math.max(.48,f.maxTarget*.42))hits++;
    return hits>=3;
  });
  if(!allTargetStrong)return false;
  const midi=frame.wanted.map(pc=>60+pc);
  v9ChordCooldown=performance.now()+850;
  v9ResetChordFrames();
  onChordDetected(midi);
  return true;
}

function handlePracticeChordDetected(notes){
  const c=practiceState.chord;if(!c||practiceState.chordPassed)return;
  const wanted=[...new Set(chord(c.root,c.type).map(pitchClass))];
  const incoming=[...new Set((Array.isArray(notes)?notes:[notes]).map(Number).map(pitchClass))];
  const count=wanted.filter(pc=>incoming.includes(pc)).length;
  const feedback=$('#practiceFeedback');
  if(wanted.every(pc=>incoming.includes(pc))){
    practiceState.chordPassed=true;
    practiceState.chordSeen=[];
    v6EnsureStats().chords=(v6EnsureStats().chords||0)+1;
    markActive();save();
    flashKeys(Array.isArray(notes)?notes:[],true);
    if(feedback)feedback.innerHTML=feedbackMarkup('good','Аккорд совпал ✓','Все нужные звуки найдены. Следующий аккорд открывается автоматически.');
    setTimeout(()=>{
      const roots=Object.keys(ROOT_PC);
      const types=['major','minor','diminished','sus2','sus4'];
      const root=roots[Math.floor(Math.random()*roots.length)];
      const type=types[Math.floor(Math.random()*types.length)];
      practiceState.chord={root,type,midi:chord(root,type)};
      practiceState.chordPassed=false;practiceState.chordSeen=[];save();renderPractice();
    },620);
  }else if(feedback){
    feedback.innerHTML=feedbackMarkup('wait','Жду весь аккорд',`Совпало ${count} из ${wanted.length}. Удерживай все три звука вместе или почти одновременно.`);
  }
}

function handleChordDetected(value){
  const r=runtime;if(!r||r.passed)return;
  const c=r.chordRounds?.[r.chordRound];if(!c)return;
  const wanted=[...new Set(c.midi.map(pitchClass))];
  const incoming=[...new Set((Array.isArray(value)?value:[value]).map(Number).map(pitchClass))];
  const count=wanted.filter(pc=>incoming.includes(pc)).length;
  if(wanted.every(pc=>incoming.includes(pc))){
    flashKeys(Array.isArray(value)?value:c.midi,true);
    r.errors=0;r.retryCount=0;r.heardChord=[];save();
    setLessonFeedback('good','Аккорд совпал ✓','Все три звука совпали. Следующий аккорд открывается автоматически.');
    setTimeout(()=>{
      r.chordRound++;
      if(r.chordRound>=r.rounds){r.passed=true;completeLesson(r.n);renderLessonComplete(r);}
      else renderLesson();
    },620);
  }else{
    const m=Array.isArray(value)?value[0]:value;
    if(Number.isFinite(m))v8RecordLessonError(r,m,c.midi[0]);
    setLessonFeedback('wait','Жду весь аккорд',`Совпало ${count} из ${wanted.length}. Сыграй все звуки вместе.`);
    renderLesson();
  }
}

/* ------------------------------------------------------------------------
   3. Final microphone loop + persistent permission
   ------------------------------------------------------------------------ */
function micLoop(){
  if(!mic.analyser)return;
  const now=performance.now();
  if(now-v9LastAnalysisAt<38){mic.raf=requestAnimationFrame(micLoop);return;}
  v9LastAnalysisAt=now;
  if(!mic.timeBuf || mic.timeBuf.length!==mic.analyser.fftSize)mic.timeBuf=new Float32Array(mic.analyser.fftSize);
  mic.analyser.getFloatTimeDomainData(mic.timeBuf);
  mic.analyser.getFloatFrequencyData(mic.freq);

  if(v8ChordTargetFromContext()){
    v9ChordPoll();
    mic.raf=requestAnimationFrame(micLoop);
    return;
  }

  const result=v9AnalyzePitch(mic.timeBuf,mic.ctx.sampleRate);
  if(result){
    mic.lastSeen=now;
    v9LastPhysicalResult=result;
    /* Diagnostics are shown only in the dedicated mic-check room. */
    const check=$('#v9DetectedValue');
    if(check)check.textContent=noteText(result.midi);
    v9StableDispatch(result,now);
  }else if(mic.lastSeen && now-mic.lastSeen>220){
    v9Stable=[];mic.candidateMidi=null;mic.candidateSince=0;mic.lastMidi=null;
  }
  mic.raf=requestAnimationFrame(micLoop);
}

async function startMic(options={}){
  const silent=!!options.silent;
  if(mic.stream){if(!silent)toast('Микрофон уже подключён','good');return true;}
  if(!window.isSecureContext){if(!silent)toast('Открой сайт по HTTPS для доступа к микрофону','bad');return false;}
  if(!navigator.mediaDevices?.getUserMedia){if(!silent)toast('Браузер не поддерживает микрофон','bad');return false;}
  try{
    mic.stream=await navigator.mediaDevices.getUserMedia({audio:{
      channelCount:1,
      echoCancellation:false,
      noiseSuppression:false,
      autoGainControl:false,
      latency:0,
      sampleRate:44100
    }});
    mic.ctx=new (window.AudioContext||window.webkitAudioContext)();
    if(mic.ctx.state==='suspended')await mic.ctx.resume();
    mic.source=mic.ctx.createMediaStreamSource(mic.stream);
    mic.analyser=mic.ctx.createAnalyser();
    mic.analyser.fftSize=8192;
    mic.analyser.smoothingTimeConstant=0;
    mic.analyser.minDecibels=-100;
    mic.analyser.maxDecibels=-5;
    mic.freq=new Float32Array(mic.analyser.frequencyBinCount);
    mic.timeBuf=new Float32Array(mic.analyser.fftSize);
    mic.source.connect(mic.analyser);
    mic.lastMidi=null;mic.candidateMidi=null;mic.candidateSince=0;mic.lastDispatch=0;mic.lastSeen=0;
    v9Stable=[];v9ResetChordFrames();
    const ap=v8AudioProfile();ap.autoReconnect=true;
    if(ap.engineVersion!==9){ap.engineVersion=9;ap.octaveOffset=0;ap.calibrated=false;ap.calOffsets=[];}
    save();
    v9AudioBooted=true;
    loadV6Pitchy();v9LoadYin();
    micLoop();
    if(!silent)toast('Микрофон подключён — слушаю пианино','good');
    render();
    return true;
  }catch(e){
    stopMic();
    if(!silent){
      if(e?.name==='NotAllowedError')toast('Разреши микрофон для этого сайта','bad');
      else if(e?.name==='NotFoundError')toast('Микрофон не найден','bad');
      else toast('Не удалось подключить микрофон','bad');
    }
    return false;
  }
}

/* ------------------------------------------------------------------------
   4. Dedicated microphone room with three-point octave calibration
   ------------------------------------------------------------------------ */
function v9MicRoomState(){
  const o=v8AudioProfile();
  if(!Array.isArray(o.calOffsets))o.calOffsets=[];
  if(!Number.isFinite(o.octaveOffset))o.octaveOffset=0;
  return o;
}

function closeMicCheck(){const o=$('#v9MicRoom');if(o)o.remove()}

function renderMicCheck(){
  let o=$('#v9MicRoom');
  if(!o){o=document.createElement('div');o.id='v9MicRoom';document.body.appendChild(o)}
  const ap=v9MicRoomState();
  const step=Math.min(3,Math.max(0,Number(o.dataset.step)||0));
  const expected=[60,48,72][step];
  const raw=v9LastPhysicalResult;
  const samePC=raw && pitchClass(raw.physicalMidi)===pitchClass(expected);
  const offsetCandidate=raw && samePC ? Math.round(expected-raw.physicalMidi) : null;
  const goodOffset=Number.isFinite(offsetCandidate)&&Math.abs(offsetCandidate)<=24&&offsetCandidate%12===0;
  const shown=raw?noteText(raw.midi):'Жду звук';
  o.innerHTML=`<div class="v9MicBackdrop" id="v9MicBackdrop"></div><section class="v9MicPanel" role="dialog" aria-modal="true">
    <div class="v9MicHeader"><div><div class="sectionKicker">НАСТРОЙКА</div><h2>Проверить микрофон</h2><p>Здесь мы проверяем именно звук. Уроки и практика сюда не вмешиваются.</p></div><button class="backBtn" id="v9MicClose">×</button></div>
    <div class="v9MicStatus"><span class="micLiveDot ${mic.stream?'good':''}"></span><div><b>${mic.stream?'Микрофон подключён':'Микрофон отключён'}</b><small>${mic.stream?'Сыграй ноту ниже — сайт попробует определить её точно.':'Нажми кнопку подключения.'}</small></div></div>
    ${mic.stream?`<div class="v9MicDetected"><span>Сейчас слышу</span><strong id="v9DetectedValue">${escapeHtml(shown)}</strong><small>${raw?`${Math.round(raw.rawFreq)} Hz · ${Math.round(raw.confidence*100)}% · без калибровки ${noteText(raw.physicalMidi)}`:'Жду стабильный звук'}</small></div>
      <div class="v9CalStep"><div class="sectionKicker">ШАГ ${step+1} ИЗ 3</div><h3>${step<3?`Сыграй ${noteText(expected)}`:'Готово'}</h3><p>${step<3?'Сыграй эту ноту один раз и дождись, пока сайт её стабильно услышит. Затем нажми «Зафиксировать».':'Калибровка сохранена. Теперь сайт может компенсировать стабильное смещение октавы твоего инструмента/микрофона.'}</p>
      ${step<3?`<div class="v9CalObserved ${samePC?'good':'bad'}"><b>${raw?`Увидел: ${noteText(raw.physicalMidi)}`:'Пока ничего'}</b><span>${goodOffset?`Предлагаемое смещение: ${offsetCandidate>0?'+':''}${offsetCandidate} полутона`:'Нужна та же нота по названию, иначе фиксация отключена.'}</span></div><button class="primary full" id="v9ConfirmCal" ${goodOffset?'':'disabled'}>✓ Зафиксировать</button>`:`<div class="v9Done">✓ Смещение: <b>${ap.octaveOffset>0?'+':''}${ap.octaveOffset} полутона</b></div>`}</div>
      <button class="ghostBtn full" id="v9ResetCal">Сбросить калибровку</button>`:`<button class="primary full" id="v9Connect">🎙 Подключить микрофон</button>`}
    <div class="v9MicTips"><b>Для Tesler KB-6130</b><span>Поставь iPhone рядом с динамиком синтезатора, но не вплотную. В комнате должно быть как можно меньше других звуков.</span><span>Один раз дай браузеру разрешение. При следующем входе сайт попробует подключиться автоматически, когда браузер уже хранит разрешение.</span></div>
  </section>`;
  o.className='v9MicRoom show';
  $('#v9MicClose').onclick=closeMicCheck;$('#v9MicBackdrop').onclick=closeMicCheck;
  $('#v9Connect')?.addEventListener('click',async()=>{await startMic();renderMicCheck()});
  $('#v9ResetCal')?.addEventListener('click',()=>{ap.octaveOffset=0;ap.calibrated=false;ap.calOffsets=[];save();o.dataset.step='0';renderMicCheck()});
  $('#v9ConfirmCal')?.addEventListener('click',()=>{
    if(!goodOffset)return;
    ap.calOffsets=ap.calOffsets||[];ap.calOffsets.push(offsetCandidate);
    if(ap.calOffsets.length>=3){
      const sorted=[...ap.calOffsets].sort((a,b)=>a-b);ap.octaveOffset=sorted[Math.floor(sorted.length/2)];ap.calibrated=true;
    }
    save();
    o.dataset.step=String(step+1);
    renderMicCheck();
  });
}
function openMicCheck(){renderMicCheck()}

async function v9AutoReconnect(){
  try{
    const ap=v8AudioProfile();
    if(!ap.autoReconnect || mic.stream)return;
    if(!navigator.permissions?.query)return;
    const p=await navigator.permissions.query({name:'microphone'});
    if(p.state==='granted')await startMic({silent:true});
  }catch{}
}

/* ------------------------------------------------------------------------
   5. Lesson 2 + retries
   ------------------------------------------------------------------------ */
const V9_BASE_BUILD_LESSON=window.buildLesson;
function buildLesson(n){
  if(n===2){
    const base=V9_BASE_BUILD_LESSON(n);
    return {...base,
      title:'Октава: как устроена клавиатура',
      objective:'Понять, что такое октава, и научиться находить одинаковую ноту выше и ниже.',
      theory:'Октава — это путь от одной ноты до следующей такой же. От ДО до следующего ДО — 12 шагов по клавишам. Поэтому на клавиатуре несколько ДО: они называются одинаково, но находятся в разных октавах и звучат по-разному.',
      tip:'Нашёл две чёрные клавиши? ДО находится слева от них. Найди ещё одно ДО через 12 клавиш — это уже другая октава.',
      steps:[48,60,72,60],
      hand:'B',
      anyOctave:false
    };
  }
  return V9_BASE_BUILD_LESSON(n);
}

function v9BindRetry(){
  const btn=$('#retryLessonAttempt');
  if(btn)btn.onclick=()=>{
    if(!runtime)return;
    runtime.errors=0;
    runtime.retryResetAt=Date.now();
    renderLesson();
  };
}

const V9_BASE_RENDER_LESSON=window.renderLesson;
function renderLesson(){
  V9_BASE_RENDER_LESSON();
  const r=runtime;if(!r)return;
  if(r.n===2){
    const h=$('#lesson h1');if(h)h.textContent='Октава: как устроена клавиатура';
    const p=$('#lesson .lessonTitleBlock p');if(p)p.textContent='Понять, что такое октава, найти одинаковые ноты и увидеть связь с группами чёрных клавиш.';
    const visual=$('#lesson .octaveVisual');
    if(visual){visual.innerHTML='<span>ДО 3</span><i>12 клавиш</i><span>ДО 4</span><b>Одна и та же нота, но выше</b>';}
  }
  v9BindRetry();
  /* The same page layout remains; page 2 is where the instrument is played. */
}

/* ------------------------------------------------------------------------
   6. Full 61-key keyboard with touch scrolling + octave jump controls
   ------------------------------------------------------------------------ */
function keyboardHtml(target,targets=[],mode='exact'){
  const low=36,high=96; // C2–C7: the full 61-key range of the Tesler KB-6130
  const whites=[];
  for(let m=low;m<=high;m++)if(WHITE_PC.includes(pitchClass(m)))whites.push(m);
  const width=42, idx=new Map(whites.map((m,i)=>[m,i]));
  const exactTargets=targets.length?targets:(Number.isFinite(target)?[target]:[]);
  const isTarget=m=>mode==='pitchClass'?pitchClass(m)===pitchClass(target):exactTargets.includes(m);
  let html='';
  for(const m of whites){
    html+=`<button type="button" class="pKey whiteKey ${isTarget(m)?'target':''}" data-pitch="${m}" style="left:${idx.get(m)*width}px" aria-label="${escapeHtml(noteText(m))}"></button>`;
  }
  for(let m=low;m<=high;m++)if(!WHITE_PC.includes(pitchClass(m))){
    const before=whites.findIndex(w=>w>m)-1;
    if(before>=0)html+=`<button type="button" class="pKey blackKey ${isTarget(m)?'target':''}" data-pitch="${m}" style="left:${before*width+28}px" aria-label="${escapeHtml(noteText(m))}"></button>`;
  }
  const targetOct=Number.isFinite(target)?octave(target):4;
  return `<div class="v9KeyboardBlock" data-key-target="${Number.isFinite(target)?target:''}">
    <div class="v9KeyboardNav"><button type="button" data-kb-left>‹</button><span>Клавиатура · 5+ октав</span><button type="button" data-kb-right>›</button></div>
    <div class="v9KeyboardViewport" tabindex="0"><div class="keyboard" style="width:${whites.length*width}px;height:210px">${html}</div></div>
    <div class="v9OctaveRail">${[2,3,4,5,6].map(o=>`<button type="button" data-kb-oct="${o}" class="${o===targetOct?'active':''}">Октава ${o}</button>`).join('')}</div>
  </div>`;
}

function v9BindKeyboards(){
  $$('.v9KeyboardBlock').forEach(block=>{
    const vp=$('.v9KeyboardViewport',block);if(!vp||vp.dataset.bound==='1')return;
    vp.dataset.bound='1';
    const target=Number(block.dataset.keyTarget);
    const centerTarget=()=>{
      if(!Number.isFinite(target))return;
      const key=$(`.pKey[data-pitch="${target}"]`,block);
      if(key)key.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    };
    $('[data-kb-left]',block)?.addEventListener('click',()=>{vp.scrollBy({left:-vp.clientWidth*.82,behavior:'smooth'})});
    $('[data-kb-right]',block)?.addEventListener('click',()=>{vp.scrollBy({left:vp.clientWidth*.82,behavior:'smooth'})});
    $$('[data-kb-oct]',block).forEach(b=>b.addEventListener('click',()=>{
      const o=+b.dataset.kbOct;
      const m=12*(o+1);
      const key=$(`.pKey[data-pitch="${m}"]`,block);
      if(key)key.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    }));
    requestAnimationFrame(centerTarget);
    setTimeout(centerTarget,180);
  });
}

/* ------------------------------------------------------------------------
   7. Practice: separate mic check + ear submodes + 3-minute warmup
   ------------------------------------------------------------------------ */
function renderPractice(){
  const tab=practiceState.tab||'notes';
  $('#practice').innerHTML=`${header('Практика','home','ТРЕНИРОВКА')}
    <div class="practiceTabs">${[['notes','Ноты'],['chords','Аккорды'],['ear','Слух'],['tuner','Тюнер'],['weak','Слабые места'],['session','⚡ 3 минуты']].map(x=>`<button class="practiceTab ${tab===x[0]?'active':''}" data-practice="${x[0]}">${x[1]}</button>`).join('')}</div>
    <div class="practiceTopActions"><button class="secondary" id="openMicCheck">🎙 Проверить микрофон</button><span>${mic.stream?'Микрофон подключён':'Подключение потребуется только один раз.'}</span></div>
    <div class="practiceExplain card"><b>${tab==='tuner'?'Тюнер показывает, насколько высота одной сыгранной ноты близка к точной.':tab==='chords'?'Аккорд — несколько звуков одновременно. Здесь проверяется полный набор нот.':tab==='ear'?'Выбери отдельную тренировку слуха: ноты или аккорды.':tab==='weak'?'Повторяем то, на чём было больше всего ошибок.':tab==='session'?'Три минуты непрерывной разминки на настоящем инструменте.':'Сыграй цель — микрофон проверит ноту и октаву.'}</b><span>${tab==='tuner'?'Центр = точно по высоте, влево — ниже, вправо — выше.':tab==='chords'?'Все нужные звуки должны быть услышаны. После полного совпадения следующий аккорд откроется автоматически.':tab==='ear'?'Внутри режима можно отдельно тренировать определение одной ноты или характера мажор/минор.':'Кнопка проверки микрофона находится отдельно, чтобы учебный экран оставался чистым.'}</span></div>
    <div id="practiceContent"></div>`;
  $$('[data-practice]').forEach(b=>b.onclick=()=>{practiceState.tab=b.dataset.practice;renderPractice()});
  $('#openMicCheck').onclick=openMicCheck;
  const box=$('#practiceContent');
  if(tab==='notes')box.innerHTML=renderPracticeNotesV5();
  else if(tab==='chords')box.innerHTML=renderPracticeChordsV5();
  else if(tab==='ear')box.innerHTML=renderPracticeEarV9();
  else if(tab==='tuner')box.innerHTML=renderTunerV5();
  else if(tab==='session')box.innerHTML=v6RenderWarmup();
  else box.innerHTML=renderWeakV5();
  bindPracticeV5(tab);
  v9BindKeyboards();
  if(tab==='ear')v9BindEar();
}

function renderPracticeEarV9(){
  const mode=practiceState.earMode||'note';
  const noteTarget=practiceState.earNote||[60,62,64,65,67,69,71][Math.floor(Math.random()*7)];
  const chordTarget=practiceState.earChord||{root:'до',type:'major'};
  practiceState.earNote=noteTarget;practiceState.earChord=chordTarget;
  return `<div class="earModeGrid"><button class="earMode ${mode==='note'?'active':''}" data-ear-mode="note"><b>🎵 Узнавать ноты</b><span>Слушай звук и выбирай ДО–СИ.</span></button><button class="earMode ${mode==='chord'?'active':''}" data-ear-mode="chord"><b>🎹 Узнавать аккорды</b><span>Слушай трезвучие и определяй характер.</span></button></div>${mode==='note'?`<div class="practiceCard card"><div class="earHero"><div class="earPulse">●</div><div><div class="sectionKicker">СЛУХ · НОТЫ</div><h2>Какая это нота?</h2><p>Сначала слушай, затем выбери название.</p></div></div><button class="primary full" id="v9EarPlay">▶ Послушать</button><div class="choiceGrid">${['до','ре','ми','фа','соль','ля','си'].map(x=>`<button class="choiceBtn" data-ear-note-answer="${x}">${x}</button>`).join('')}</div><div id="v9EarFeedback">${feedbackMarkup('wait','Готово','Нажми «Послушать», затем выбери ноту.')}</div></div>`:`<div class="practiceCard card"><div class="earHero"><div class="earPulse">◒</div><div><div class="sectionKicker">СЛУХ · АККОРДЫ</div><h2>Мажор или минор?</h2><p>Не смотри на название — слушай общий характер трезвучия.</p></div></div><button class="primary full" id="v9ChordEarPlay">▶ Послушать аккорд</button><div class="choiceGrid"><button class="choiceBtn" data-ear-chord-answer="major">Мажор</button><button class="choiceBtn" data-ear-chord-answer="minor">Минор</button></div><div id="v9EarFeedback">${feedbackMarkup('wait','Готово','Послушай аккорд и выбери вариант.')}</div></div>`}`;
}
function v9BindEar(){
  $$('[data-ear-mode]').forEach(b=>b.onclick=()=>{practiceState.earMode=b.dataset.earMode;renderPractice()});
  $('#v9EarPlay')?.addEventListener('click',()=>{
    playTone(practiceState.earNote);
  });
  $$('[data-ear-note-answer]').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.earNoteAnswer===noteName(practiceState.earNote);
    const e=$('#v9EarFeedback');if(e)e.innerHTML=feedbackMarkup(ok?'good':'bad',ok?'Верно!':'Почти',ok?`Это ${noteName(practiceState.earNote)}.`:`Правильный ответ: ${noteName(practiceState.earNote)}.`);
    if(ok){v6EnsureStats().ear=(v6EnsureStats().ear||0)+1;practiceState.earNote=[60,62,64,65,67,69,71][Math.floor(Math.random()*7)];save();setTimeout(renderPractice,650)}
  });
  $('#v9ChordEarPlay')?.addEventListener('click',()=>playToneGroup(chord(practiceState.earChord.root,practiceState.earChord.type),.42));
  $$('[data-ear-chord-answer]').forEach(b=>b.onclick=()=>{
    const ok=b.dataset.earChordAnswer===practiceState.earChord.type;
    const e=$('#v9EarFeedback');if(e)e.innerHTML=feedbackMarkup(ok?'good':'bad',ok?'Верно!':'Ещё раз',ok?'Ты услышал характер аккорда.':`Это ${practiceState.earChord.type==='major'?'мажор':'минор'}.`);
    if(ok){v6EnsureStats().ear=(v6EnsureStats().ear||0)+1;practiceState.earChord={root:Object.keys(ROOT_PC)[Math.floor(Math.random()*Object.keys(ROOT_PC).length)],type:Math.random()>.5?'major':'minor'};save();setTimeout(renderPractice,650)}
  });
}

/* ------------------------------------------------------------------------
   8. Steam-style achievements: 54 total, exactly 14 hidden
   ------------------------------------------------------------------------ */
const V9_ACHIEVEMENTS=[
 ['welcome','🚪','Первый вход','Открыть Piano Learning и начать обучение'],
 ['practice','◎','На тренировку','Открыть раздел «Практика»'],
 ['mic','🎙️','На связи','Успешно подключить микрофон'],
 ['firstNote','🎹','Первая нота','Завершить первый урок'],
 ['fiveLessons','🌱','Пять шагов','Завершить 5 уроков'],
 ['tenLessons','🔥','Первые десять','Завершить 10 уроков'],
 ['twentyLessons','📚','Втянулся','Завершить 20 уроков'],
 ['thirtyLessons','🧠','Уже читаю','Завершить 30 уроков'],
 ['fortyLessons','🎼','Музыкальная база','Завершить 40 уроков'],
 ['fiftyLessons','🚀','Пятьдесят','Завершить 50 уроков'],
 ['seventyFiveLessons','💫','Большой путь','Завершить 75 уроков'],
 ['hundredLessons','🏅','Сто уроков','Завершить 100 уроков'],
 ['course','👑','Финальный аккорд','Завершить все 115 уроков'],
 ['xp100','⚡','100 XP','Набрать 100 XP'],
 ['xp500','💎','500 XP','Набрать 500 XP'],
 ['xp1000','🌟','1000 XP','Набрать 1000 XP'],
 ['xp2500','💠','2500 XP','Набрать 2500 XP'],
 ['xp5000','🔷','5000 XP','Набрать 5000 XP'],
 ['day3','🔥','Три дня подряд','Заниматься 3 дня подряд'],
 ['day7','🗓️','Неделя ритма','Заниматься 7 дней подряд'],
 ['day14','🌙','Две недели','Заниматься 14 дней подряд'],
 ['day30','☀️','Месяц в ритме','Заниматься 30 дней подряд'],
 ['song1','🎵','Первая песня','Начать прогресс хотя бы в одной песне'],
 ['song3','🎶','Три песни','Потренироваться хотя бы в 3 песнях'],
 ['song10','🎻','Репертуар','Потренироваться хотя бы в 10 песнях'],
 ['favorite','❤️','Любимая полка','Добавить песню в избранное'],
 ['mistake','🛠️','Сделал вывод','Исправить ошибку и пройти урок'],
 ['chord1','⌬','Первый аккорд','Правильно распознать аккорд'],
 ['ear1','👂','Слышу','Правильно ответить в тренировке слуха'],
 ['tuner1','🎯','В центре','Поймать ноту тюнером'],
 ['fiveOct','🌈','Пять регистров','Сыграть ноты во всех пяти учебных регистрах'],
 ['perfect10','✨','Чистая серия','10 целей подряд без ошибки'],
 ['warmup','⏱️','Разогрев 3:00','Завершить разминку на 3 минуты'],
 ['pulse','◷','Чувствую пульс','Завершить урок 15'],
 ['reading','♫','Читаю стан','Завершить урок 35'],
 ['intervals','↗','Вижу расстояние','Завершить урок 45'],
 ['harmony','⌬','Гармония','Завершить урок 60'],
 ['scales','≈','По ступенькам','Завершить урок 72'],
 ['hands','⇄','Две руки','Завершить урок 92'],
 ['musicality','◌','Музыкальность','Завершить урок 100'],
 /* 14 hidden — only these hide their names/conditions */
 ['h1','🔮','hidden','hidden'],['h2','🗝️','hidden','hidden'],['h3','🌌','hidden','hidden'],['h4','🪄','hidden','hidden'],['h5','🧩','hidden','hidden'],['h6','🛰️','hidden','hidden'],['h7','🕰️','hidden','hidden'],['h8','🎯','hidden','hidden'],['h9','🦾','hidden','hidden'],['h10','🎹','hidden','hidden'],['h11','🌠','hidden','hidden'],['h12','🧭','hidden','hidden'],['h13','🪐','hidden','hidden'],['h14','👑','hidden','hidden']
];

function v9AchievementList(){
  const st=v8Stats(),completed=completedCount(),days=countConsecutiveActive(),songCount=v8UnlockedSongCount();
  const visible={
    welcome:true,
    practice:(st.practiceOpen||0)>=1,
    mic:!!state.audioProfile?.autoReconnect,
    firstNote:completed>=1,
    fiveLessons:completed>=5,
    tenLessons:completed>=10,
    twentyLessons:completed>=20,
    thirtyLessons:completed>=30,
    fortyLessons:completed>=40,
    fiftyLessons:completed>=50,
    seventyFiveLessons:completed>=75,
    hundredLessons:completed>=100,
    course:completed>=115,
    xp100:state.xp>=100,
    xp500:state.xp>=500,
    xp1000:state.xp>=1000,
    xp2500:state.xp>=2500,
    xp5000:state.xp>=5000,
    day3:days>=3,
    day7:days>=7,
    day14:days>=14,
    day30:days>=30,
    song1:songCount>=1,
    song3:songCount>=3,
    song10:songCount>=10,
    favorite:(state.favorites||[]).length>=1,
    mistake:Object.keys(state.mistakes||{}).length>=1&&completed>=2,
    chord1:(st.chords||0)>=1,
    ear1:(st.ear||0)>=1,
    tuner1:(st.tuner||0)>=1,
    fiveOct:Object.keys(state.octavesSeen||{}).filter(x=>x>=1&&x<=5).length>=5,
    perfect10:(st.perfectRun||0)>=10,
    warmup:(st.warmup||0)>=1,
    pulse:completed>=15,reading:completed>=35,intervals:completed>=45,harmony:completed>=60,scales:completed>=72,hands:completed>=92,musicality:completed>=100
  };
  const hidden={
    h1:completed>=12&&(st.perfectRun||0)>=7,
    h2:completed>=25&&days>=7,
    h3:Object.keys(state.octavesSeen||{}).length>=5&&(st.notes||0)>=75,
    h4:songCount>=5&&(st.chords||0)>=10,
    h5:completed>=40&&Object.values(state.mistakes||{}).reduce((a,b)=>a+(Number(b)||0),0)>=25,
    h6:completed>=60&&state.xp>=3000,
    h7:completed>=80&&days>=14,
    h8:completed>=100&&(st.perfectRun||0)>=15,
    h9:songCount>=10&&days>=10,
    h10:completed>=115,
    h11:(st.warmup||0)>=5,
    h12:(st.ear||0)>=30,
    h13:(st.chords||0)>=30,
    h14:completed>=115&&days>=30&&songCount>=10
  };
  return V9_ACHIEVEMENTS.map(a=>({id:a[0],icon:a[1],title:a[2],desc:a[3],hidden:a[3]==='hidden',ok:a[3]==='hidden'?!!hidden[a[0]]:!!visible[a[0]]}));
}
function achievementList(){return v9AchievementList()}
function renderAchievements(){
  const list=v9AchievementList(),done=list.filter(a=>a.ok).length,overlay=$('#calendarOverlay');if(!overlay)return;
  overlay.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="achievementDialog card v9AchievementDialog"><div class="calendarHead"><div><div class="sectionKicker">ДОСТИЖЕНИЯ · ${done}/${list.length}</div><h2>Твои достижения</h2><p>40 открытых по условию и 14 секретных. Видимые достижения показывают цель даже до разблокировки.</p></div><button class="backBtn" id="achClose">×</button></div><div class="achievementGrid">${list.map(a=>`<div class="achievement ${a.ok?'unlocked':''} ${a.hidden?'hiddenAchievement':''}"><span>${a.ok?a.icon:(a.hidden?'?':a.icon)}</span><div><b>${a.hidden&&!a.ok?'Скрытое достижение':a.title}</b><small>${a.hidden&&!a.ok?'Условие скрыто до разблокировки.':a.desc}</small></div><i>${a.ok?'✓':(a.hidden?'?':'🔒')}</i></div>`).join('')}</div></div>`;
  overlay.className='calendarOverlay show';$('#achClose').onclick=()=>overlay.className='calendarOverlay';$('#calendarBackdrop').onclick=()=>overlay.className='calendarOverlay';
}

/* ------------------------------------------------------------------------
   9. One-month green calendar + blue weekly activity
   ------------------------------------------------------------------------ */
let v9CalendarDate2=new Date();
function renderCalendar(){
  const overlay=$('#calendarOverlay');if(!overlay)return;
  const y=v9CalendarDate2.getFullYear(),m=v9CalendarDate2.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0),daysIn=last.getDate(),start=(first.getDay()+6)%7;
  const monthName=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(first);
  const monthPrefix=`${y}-${String(m+1).padStart(2,'0')}`;
  const values=Object.entries(state.activityDays||{}).filter(([k])=>k.startsWith(monthPrefix)).map(([,v])=>Number(v)||0);
  const max=Math.max(1,...values);
  let cells='';for(let i=0;i<start;i++)cells+='<div class="v9CalCell empty"></div>';
  for(let d=1;d<=daysIn;d++){
    const date=new Date(y,m,d),key=todayKeyFromDate(date),xp=Number(state.activityDays?.[key]||0);
    const level=xp?Math.min(4,Math.max(1,Math.ceil((xp/max)*4))):0;
    const today=date.toDateString()===new Date().toDateString();
    cells+=`<div class="v9CalCell level-${level} ${today?'today':''}" title="${escapeHtml(date.toLocaleDateString('ru-RU',{day:'numeric',month:'long'}))}"><b>${d}</b>${xp?`<small>${xp} XP</small>`:''}</div>`;
  }
  const active=values.filter(v=>v>0).length,total=values.reduce((a,b)=>a+b,0);
  overlay.innerHTML=`<div class="calendarBackdrop" id="calendarBackdrop"></div><div class="calendarDialog card v9CalendarDialog"><div class="calendarHead"><div><div class="sectionKicker">АКТИВНОСТЬ</div><h2>${monthName.charAt(0).toUpperCase()+monthName.slice(1)}</h2><p>Зелёный день означает занятие. Чем больше XP, тем насыщеннее зелёный.</p></div><button class="backBtn" id="calendarClose">×</button></div><div class="v9CalendarNav"><button id="v9CalPrev">‹</button><strong>${monthName.charAt(0).toUpperCase()+monthName.slice(1)}</strong><button id="v9CalNext">›</button></div><div class="calendarWeekdays">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span>${x}</span>`).join('')}</div><div class="v9CalendarGrid">${cells}</div><div class="calendarLegend"><span>меньше XP</span><i class="level-1"></i><i class="level-2"></i><i class="level-3"></i><i class="level-4"></i><span>больше XP</span></div><div class="calendarMonthStat"><b>${active}</b> активных дней · <b>${total} XP</b></div></div>`;
  overlay.className='calendarOverlay show';
  $('#calendarClose').onclick=()=>overlay.className='calendarOverlay';$('#calendarBackdrop').onclick=()=>overlay.className='calendarOverlay';
  $('#v9CalPrev').onclick=()=>{v9CalendarDate2=new Date(y,m-1,1);renderCalendar()};
  $('#v9CalNext').onclick=()=>{v9CalendarDate2=new Date(y,m+1,1);renderCalendar()};
}

/* Blue intensity for home week. */
const V9_BASE_RENDER_HOME=window.renderHome;
function renderHome(){
  V9_BASE_RENDER_HOME();
  const week=$('#home .weekDots');
  if(week){
    week.querySelectorAll('.weekDot').forEach((dot,i)=>{dot.classList.add('v9Blue');});
  }
}

/* ------------------------------------------------------------------------
   10. Song library presentation + safer exact-arrangement wording
   ------------------------------------------------------------------------ */
const V9_BASE_RENDER_SONGS=window.renderSongs;
function renderSongs(){
  V9_BASE_RENDER_SONGS();
  const intro=$('#songs .songIntro');
  if(intro){
    const b=$('b',intro),s=$('span',intro);
    if(b)b.textContent='Библиотека, в которую хочется возвращаться';
    if(s)s.textContent='Начинай с лёгких проектов, открывай новые стили и постепенно переходи к более сложным песням.';
  }
}

/* ------------------------------------------------------------------------
   11. Render hooks and cache bust
   ------------------------------------------------------------------------ */
const V9_BASE_GO=window.go;
function go(id){V9_BASE_GO(id);setTimeout(v9BindKeyboards,0);}

window.addEventListener('load',()=>{
  setTimeout(()=>{v9LoadYin();v9AutoReconnect();},500);
  setTimeout(v9BindKeyboards,100);
});
/* ========================================================================
   PIANO LEARNING V10 — FINAL QUALITY PASS
   - robust monophonic pitch detection ensemble (YIN + McLeod + SWIPE + local YIN)
   - target-aware octave verification; no arithmetic averaging of Hz estimators
   - NNLS chroma-assisted chord recognition with temporal voting
   - immediate retry button + hint after 3 failed retries
   - exact 54 achievements / 14 hidden
   - one-month green calendar + blue weekly activity
   - 61-key keyboard C2-C7 with real touch scrolling + jump controls
   - lesson theory/title synchronization from V8_KNOWLEDGE
   - separate mic-check room + permission-based reconnect
   ======================================================================== */

const V10_PITCH_URL='https://esm.sh/@audio/pitch@2.0.4';
const V10_MIR_CHROMA_URL='https://esm.sh/@audio/mir-chroma@1.1.2';
let v10PitchLib=null,v10PitchLoading=null;
let v10Chroma=null,v10ChromaLoading=null;
let v10Frame=0,v10LastAt=0,v10YinWarm=0,v10SwipeWarm=0;
let v10StableHistory=[];
let v10ChordHistory=[];
let v10ChordCooldown=0;
let v10LastDetected=null;

function v10LoadPitch(){
  if(v10PitchLib)return Promise.resolve(v10PitchLib);
  if(v10PitchLoading)return v10PitchLoading;
  v10PitchLoading=import(V10_PITCH_URL).then(m=>{v10PitchLib=m;return m}).catch(()=>null);
  return v10PitchLoading;
}
function v10LoadChroma(){
  if(v10Chroma)return Promise.resolve(v10Chroma);
  if(v10ChromaLoading)return v10ChromaLoading;
  v10ChromaLoading=import(V10_MIR_CHROMA_URL).then(m=>{v10Chroma=m.default||m.chroma||m;return v10Chroma}).catch(()=>null);
  return v10ChromaLoading;
}
function v10Freq(m){return 440*Math.pow(2,(m-69)/12)}
function v10Midi(f){return 69+12*Math.log2(f/440)}
function v10Db(db){return Math.pow(10,Math.max(-120,db)/20)}
function v10Clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function v10Rms(buf){let s=0;for(let i=0;i<buf.length;i++)s+=buf[i]*buf[i];return Math.sqrt(s/(buf.length||1))}

/* Local YIN fallback. The external package is preferred, but this keeps the
   site functional if a CDN is temporarily unavailable. */
function v10YinLocal(input,fs,minFreq=55,maxFreq=2200,threshold=.14){
  const N=input.length;
  if(N<1024)return null;
  const maxTau=Math.min(Math.floor(fs/minFreq),Math.floor(N/2)-1);
  const minTau=Math.max(2,Math.floor(fs/maxFreq));
  const diff=new Float64Array(maxTau+1);
  let total=0;
  for(let tau=1;tau<=maxTau;tau++){
    let d=0;
    const end=N-tau;
    for(let i=0;i<end;i+=2){const q=input[i]-input[i+tau];d+=q*q}
    diff[tau]=d;total+=d;
  }
  if(total<=0)return null;
  const cmnd=new Float64Array(maxTau+1);cmnd[0]=1;
  let run=0;
  for(let tau=1;tau<=maxTau;tau++){
    run+=diff[tau];cmnd[tau]=diff[tau]*tau/(run||1);
  }
  let tau0=-1;
  for(let tau=minTau;tau<maxTau;tau++){
    if(cmnd[tau]<threshold){
      while(tau+1<maxTau&&cmnd[tau+1]<cmnd[tau])tau++;
      tau0=tau;break;
    }
  }
  if(tau0<0){
    let best=tau0,bv=Infinity;
    for(let tau=minTau;tau<=maxTau;tau++)if(cmnd[tau]<bv){bv=cmnd[tau];best=tau}
    if(best<0||bv>.42)return null;tau0=best;
  }
  let t=tau0;
  if(t>minTau&&t<maxTau){
    const a=cmnd[t-1],b=cmnd[t],c=cmnd[t+1];
    const den=a-2*b+c;
    if(Math.abs(den)>1e-9)t+=.5*(a-c)/den;
  }
  const clarity=v10Clamp(1-(cmnd[tau0]||1),0,1);
  if(!Number.isFinite(t)||t<=0)return null;
  return {freq:fs/t,clarity};
}

function v10Periodicity(buf,fs,f){
  if(!Number.isFinite(f)||f<40||f>4000)return 0;
  const lag=Math.round(fs/f);
  if(lag<2||lag>=buf.length-2)return 0;
  let ab=0,aa=0,bb=0,n=0;
  const start=Math.max(0,buf.length-(lag*14+lag));
  for(let i=start;i<buf.length-lag;i+=2){const a=buf[i],b=buf[i+lag];ab+=a*b;aa+=a*a;bb+=b*b;n++}
  return n?ab/Math.sqrt((aa*bb)||1):0;
}
function v10SpectralAt(freqData,sr,fftSize,f,half=3){
  if(!freqData||f<=0||f>=sr/2)return 0;
  const c=Math.round(f*fftSize/sr);let best=0;
  for(let d=-half;d<=half;d++){const i=c+d;if(i>0&&i<freqData.length)best=Math.max(best,v10Db(freqData[i]))}
  return best;
}
function v10NoiseAt(freqData,sr,fftSize,f,width=10){
  if(!freqData||f<=0||f>=sr/2)return 1e-7;
  const c=Math.round(f*fftSize/sr),a=[];
  for(let d=-width;d<=width;d++){
    if(Math.abs(d)<=2)continue;
    const i=c+d;if(i>1&&i<freqData.length)a.push(v10Db(freqData[i]));
  }
  if(!a.length)return 1e-7;
  a.sort((x,y)=>x-y);return a[Math.floor(a.length/2)]||1e-7;
}
function v10HarmonicScore(freqData,sr,fftSize,midi){
  const f0=v10Freq(midi);if(f0<45||f0>2400||f0>=sr/2)return -10;
  const weights=[5.2,2.2,1.35,.88,.58,.4,.28,.2];
  let score=0,total=0;
  let fund=0,harm=0;
  for(let h=1;h<=8;h++){
    const f=f0*h;if(f>=sr/2)break;
    const a=v10SpectralAt(freqData,sr,fftSize,f,Math.abs(f)<160?4:3);
    const n=v10NoiseAt(freqData,sr,fftSize,f,Math.abs(f)<160?12:9);
    const s=Math.log1p(Math.max(0,a/(n+1e-7)-1));
    score+=s*weights[h-1];total+=weights[h-1];
    if(h===1)fund=s;else harm+=s/(h-1);
  }
  const fundamentalBias=fund*1.7-Math.max(0,harm*.055);
  return score/(total||1)+fundamentalBias;
}
function v10EstimatorSupport(mid,est){
  let s=0;
  for(const e of est){
    const d=Math.abs(mid-e.midi);
    const cents=d*100;
    if(cents<35)s+=e.w;
    else if(cents<80)s+=e.w*.6;
    else if(cents<125)s+=e.w*.18;
  }
  return s;
}
function v10CandidateScore(mid,buf,sr,freqData,fftSize,est){
  const corr=v10Periodicity(buf,sr,v10Freq(mid));
  const corr2=v10Periodicity(buf,sr,v10Freq(mid)*2);
  const corrHalf=v10Periodicity(buf,sr,v10Freq(mid)/2);
  const harmonic=v10HarmonicScore(freqData,sr,fftSize,mid);
  const support=v10EstimatorSupport(mid,est);
  /* True fundamental should explain the waveform itself. Penalise candidates
     that only look good because their second harmonic is another note. */
  const subPenalty=Math.max(0,corrHalf-corr)*.45;
  return {score:corr*1.45+corr2*.12+harmonic*.48+support*.74-subPenalty,corr,harmonic,support};
}

function v10ChoosePitch(buf,sr,freqData,fftSize,est){
  const candidates=new Set();
  for(const e of est){
    const c=Math.round(e.midi);
    for(let d=-24;d<=24;d+=12)for(let s=-1;s<=1;s++){
      const m=c+d+s;if(m>=21&&m<=108)candidates.add(m)
    }
  }
  /* Search all semitones in the practical 61-key area as a safety net. */
  for(let m=36;m<=96;m++)candidates.add(m);
  let best=null;
  for(const m of candidates){
    const x=v10CandidateScore(m,buf,sr,freqData,fftSize,est);
    const dist=Math.min(...est.map(e=>Math.abs(m-e.midi)));
    const prior=Math.exp(-dist/7)*.05;
    const score=x.score+prior;
    if(!best||score>best.score)best={midi:m,...x,score}
  }
  return best;
}

function v10RawPitch(buf,sr){
  const rms=v10Rms(buf);if(rms<.0018)return null;
  let mean=0;for(const x of buf)mean+=x;mean/=buf.length;
  const work=new Float32Array(buf.length);for(let i=0;i<buf.length;i++)work[i]=buf[i]-mean;
  const est=[];
  const lib=v10PitchLib;
  try{
    if(lib?.yin){const r=lib.yin(work,{fs:sr,threshold:.14,minFreq:55,maxFreq:2200});if(r?.freq)est.push({midi:v10Midi(r.freq),freq:r.freq,clarity:Number(r.clarity)||0,w:.9})}
  }catch{}
  try{
    if(lib?.mcleod){const r=lib.mcleod(work,{fs:sr,threshold:.82,minFreq:55,maxFreq:2200});if(r?.freq)est.push({midi:v10Midi(r.freq),freq:r.freq,clarity:Number(r.clarity)||0,w:.62})}
  }catch{}
  /* SWIPE is excellent on clean instrumental signals but more expensive. Run
     every third analysis frame, then keep its result in the ensemble briefly. */
  if(v10Frame%3===0){
    try{
      if(lib?.swipe){const r=lib.swipe(work,{fs:sr,minFreq:55,maxFreq:2200,threshold:.12});if(r?.freq){est.push({midi:v10Midi(r.freq),freq:r.freq,clarity:Number(r.clarity)||0,w:.78});v10SwipeWarm={midi:v10Midi(r.freq),freq:r.freq,clarity:Number(r.clarity)||0,w:.42,until:v10Frame+4}}}
    }catch{}
  }else if(v10SwipeWarm&&v10SwipeWarm.until>=v10Frame)est.push(v10SwipeWarm);
  if(v10Frame%2===0){
    const r=v10YinLocal(work,sr,55,2200,.15);if(r)est.push({midi:v10Midi(r.freq),freq:r.freq,clarity:r.clarity,w:.52})
  }
  if(!est.length)return null;
  est.sort((a,b)=>(b.clarity*b.w)-(a.clarity*a.w));
  const fftSize=mic.analyser?.fftSize||16384;
  const best=v10ChoosePitch(work,sr,mic.freq,fftSize,est);
  if(!best)return null;
  const top=est[0];
  const agreement=est.reduce((acc,e)=>acc+Math.max(0,1-Math.abs(e.midi-best.midi)/2)*e.w,0)/(est.reduce((a,e)=>a+e.w,0)||1);
  const confidence=v10Clamp(.25+top.clarity*.42+agreement*.28+Math.max(0,best.corr)*.2,0,1);
  const exactMidi=Math.round(best.midi);
  return {midi:exactMidi,rawMidi:top.midi,rawFreq:top.freq,confidence,rms,cents:(v10Midi(top.freq)-exactMidi)*100,estimates:est,bestScore:best.score,physicalMidi:exactMidi,octaveOffset:0};
}

function v10TargetFromContext(){
  if(route==='lesson'&&runtime){
    if(runtime.type==='chord'||runtime.type==='song'&&runtime.songKind==='chord')return null;
    if(runtime.steps?.length&&!runtime.sequenceDone&&!runtime.passed)return runtime.steps[Math.min(runtime.step||0,runtime.steps.length-1)];
  }
  if(route==='song'&&songRuntime?.seq?.length&&songRuntime.step<songRuntime.seq.length)return songRuntime.seq[songRuntime.step];
  if(route==='practice'&&(practiceState.tab==='notes'||practiceState.tab==='weak')&&Number.isFinite(practiceState.note))return practiceState.note;
  if(route==='practice'&&practiceState.tab==='session'&&practiceState.warmup?.started&&!practiceState.warmup.finished&&Number.isFinite(practiceState.note))return practiceState.note;
  return null;
}

function v10TargetScore(buf,sr,freqData,fftSize,target){
  const candidates=[target,target-12,target+12,target-24,target+24].filter(m=>m>=21&&m<=108);
  const es=[];
  const y=v10RawPitch(buf,sr);
  if(y?.estimates)es.push(...y.estimates);
  const scored=candidates.map(m=>({m,score:v10CandidateScore(m,buf,sr,freqData,fftSize,es).score}));
  scored.sort((a,b)=>b.score-a.score);
  const best=scored[0], wanted=scored.find(x=>x.m===target);
  return {best,bestList:scored,wanted};
}

/* Target-driven correction is especially useful for a known lesson target:
   compare the exact target with neighbouring octaves instead of trusting one
   instantaneous detector choice. */
function v10AnalyzePitch(buf,sr){
  if(!mic.freq)return null;
  const base=v10RawPitch(buf,sr);if(!base)return null;
  const target=v10TargetFromContext();
  const targetInfo=Number.isFinite(target)?v10TargetScore(buf,sr,mic.freq,mic.analyser?.fftSize||16384,target):null;
  let midi=base.midi;
  if(targetInfo){
    const b=targetInfo.best,w=targetInfo.wanted;
    /* Don't force the answer, but when the exact target explains the frame
       nearly as well as the global winner, prefer the target. */
    if(w && b && w.score>=b.score-.16)midi=target;
    /* When pitch class agrees, only octave is in dispute. Use candidate
       evidence to choose among the three octaves. */
    if(pitchClass(midi)===pitchClass(target)&&w && b){
      if(w.score>=b.score-.08)midi=target;
    }
  }
  base.midi=v10Clamp(Math.round(midi),21,108);
  base.physicalMidi=base.midi;
  base.cents=(v10Midi(base.rawFreq)-base.midi)*100;
  v10LastDetected=base;
  return base;
}

function v10StableDispatch(result,now){
  if(!result)return;
  v10StableHistory.push({m:result.midi,t:now,r:result});
  if(v10StableHistory.length>8)v10StableHistory.shift();
  const counts=new Map();
  for(const x of v10StableHistory)counts.set(x.m,(counts.get(x.m)||0)+1);
  const rank=[...counts.entries()].sort((a,b)=>b[1]-a[1])[0];
  if(!rank||rank[1]<3)return;
  const m=rank[0],same=v10StableHistory.filter(x=>x.m===m),conf=same.reduce((a,x)=>a+x.r.confidence,0)/same.length;
  if(mic.candidateMidi!==m){mic.candidateMidi=m;mic.candidateSince=now;return}
  if(now-mic.candidateSince<75)return;
  if(mic.lastMidi===m&&now-(mic.lastDispatch||0)<420)return;
  mic.lastMidi=m;mic.lastDispatch=now;markOctaveSeen(m);
  onDetected(m,{confidence:conf,cents:result.cents,freq:result.rawFreq,physicalMidi:result.physicalMidi,rawMidi:result.rawMidi});
}

/* ------------------------------------------------------------------------
   Chords: NNLS chroma + direct target verification
   ------------------------------------------------------------------------ */
function v10ChordTarget(){
  if(route==='practice'&&practiceState.tab==='chords'&&practiceState.chord)return chord(practiceState.chord.root,practiceState.chord.type).map(pitchClass);
  if(route==='lesson'&&runtime&&runtime.type==='chord'){
    const c=runtime.chordRounds?.[runtime.chordRound];if(c)return c.midi.map(pitchClass);
  }
  return null;
}
function v10FallbackChroma(freqData,sr,fftSize){
  const bins=new Float64Array(12);
  if(!freqData)return bins;
  for(let i=1;i<freqData.length;i++){
    const f=i*sr/fftSize;if(f<55||f>2200)continue;
    const a=Math.pow(v10Db(freqData[i]),2);if(!a)continue;
    const pc=((Math.round(69+12*Math.log2(f/440))%12)+12)%12;
    bins[pc]+=a;
  }
  let sum=0;for(const x of bins)sum+=x;
  if(sum)for(let i=0;i<12;i++)bins[i]/=sum;
  return bins;
}
function v10ChordFrame(buf,sr,targetPCs){
  let chromaVec=null;
  try{if(v10Chroma)chromaVec=v10Chroma(buf,{fs:sr,method:'nnls',iterations:18,minFreq:55,maxFreq:2200})}catch{}
  if(!chromaVec)chromaVec=v10FallbackChroma(mic.freq,sr,mic.analyser.fftSize);
  const wanted=[...new Set(targetPCs)];
  const wantedVals=wanted.map(pc=>Number(chromaVec[pc])||0);
  const minWanted=Math.min(...wantedVals);
  const sum=wantedVals.reduce((a,b)=>a+b,0);
  const targetShare=sum/Math.max(.000001,wanted.length);
  const top=Math.max(...Array.from(chromaVec).map(Number));
  const complete=minWanted>=.075 && targetShare>=.11;
  return {complete,minWanted,targetShare,top,wanted,chroma:Array.from(chromaVec)};
}

function v10ChordLoop(){
  const target=v10ChordTarget();if(!target||!mic.timeBuf||performance.now()<v10ChordCooldown)return false;
  const f=v10ChordFrame(mic.timeBuf,mic.ctx.sampleRate,target);
  v10ChordHistory.push(f);if(v10ChordHistory.length>7)v10ChordHistory.shift();
  const stable=f.wanted.every(pc=>{
    let n=0;for(const x of v10ChordHistory)if(x.chroma[pc]>=.075)n++;return n>=4;
  });
  if(stable&&f.complete){
    v10ChordCooldown=performance.now()+700;v10ChordHistory=[];
    onChordDetected(f.wanted.map(pc=>60+pc));
    return true;
  }
  return false;
}

/* Final microphone loop. Diagnostics are rendered only on the mic room. */
function v10MicLoop(){
  if(!mic.analyser)return;
  const now=performance.now();
  if(now-v10LastAt<42){mic.raf=requestAnimationFrame(v10MicLoop);return}
  v10LastAt=now;v10Frame++;
  if(!mic.timeBuf||mic.timeBuf.length!==mic.analyser.fftSize)mic.timeBuf=new Float32Array(mic.analyser.fftSize);
  mic.analyser.getFloatTimeDomainData(mic.timeBuf);mic.analyser.getFloatFrequencyData(mic.freq);
  if(v10ChordTarget()){
    v10ChordLoop();mic.raf=requestAnimationFrame(v10MicLoop);return;
  }
  const r=v10AnalyzePitch(mic.timeBuf,mic.ctx.sampleRate);
  const diag=$('#v10DetectedValue');
  if(r){
    mic.lastSeen=now;v10LastDetected=r;
    if(diag)diag.textContent=noteText(r.midi);
    const sub=$('#v10DetectedMeta');if(sub)sub.textContent=`${Math.round(r.rawFreq)} Hz · уверенность ${Math.round(r.confidence*100)}%`;
    v10StableDispatch(r,now);
  }else if(mic.lastSeen&&now-mic.lastSeen>250){v10StableHistory=[];mic.candidateMidi=null;mic.lastMidi=null;mic.candidateSince=0}
  mic.raf=requestAnimationFrame(v10MicLoop);
}

async function v10StartMic(options={}){
  const silent=!!options.silent;
  if(mic.stream){if(!silent)toast('Микрофон уже подключён','good');return true}
  if(!window.isSecureContext){if(!silent)toast('Открой сайт по HTTPS для микрофона','bad');return false}
  if(!navigator.mediaDevices?.getUserMedia){if(!silent)toast('Браузер не поддерживает микрофон','bad');return false}
  try{
    mic.stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:false,noiseSuppression:false,autoGainControl:false,latency:0}});
    mic.ctx=new (window.AudioContext||window.webkitAudioContext)();if(mic.ctx.state==='suspended')await mic.ctx.resume();
    mic.source=mic.ctx.createMediaStreamSource(mic.stream);mic.analyser=mic.ctx.createAnalyser();mic.analyser.fftSize=16384;mic.analyser.smoothingTimeConstant=0;mic.analyser.minDecibels=-105;mic.analyser.maxDecibels=-3;
    mic.freq=new Float32Array(mic.analyser.frequencyBinCount);mic.timeBuf=new Float32Array(mic.analyser.fftSize);
    mic.source.connect(mic.analyser);mic.lastMidi=null;mic.candidateMidi=null;mic.candidateSince=0;mic.lastDispatch=0;mic.lastSeen=0;
    v10StableHistory=[];v10ChordHistory=[];
    state.audioProfile=state.audioProfile||{};state.audioProfile.autoReconnect=true;state.audioProfile.engineVersion=10;state.audioProfile.octaveOffset=0;state.audioProfile.calibrated=false;save();
    await v10LoadPitch();await v10LoadChroma();
    cancelAnimationFrame(mic.raf);mic.raf=requestAnimationFrame(v10MicLoop);
    if(!silent)toast('Микрофон подключён — слушаю пианино','good');
    render();return true;
  }catch(e){try{mic.stream?.getTracks().forEach(t=>t.stop())}catch{}mic.stream=null;mic.ctx=null;mic.analyser=null;mic.freq=null;if(!silent){if(e?.name==='NotAllowedError')toast('Разреши микрофон для этого сайта','bad');else toast('Не удалось подключить микрофон','bad')}return false}
}

/* Keep the original public API used throughout the old app. */
function startMic(options={}){return v10StartMic(options)}
function detectPitch(buf,sr){return v10AnalyzePitch(buf,sr)}
function micLoop(){return v10MicLoop()}

/* ------------------------------------------------------------------------
   Retry: first error => retry button, third retry => hint
   ------------------------------------------------------------------------ */
const V10_BASE_RENDER_SEQ=window.renderSequenceTask;
function renderSequenceTask(r){
  const target=r.steps[Math.min(r.step,r.steps.length-1)];
  const retries=Number(r.retryCount||0);
  const hand=(r.hand&&r.hand!=='B')?r.hand:(r.type==='hands'?(target<60?'L':'R'):'B');
  return `<div class="task card"><div class="taskTop"><div class="taskLabel">${r.type==='hands'?'СОЕДИНЯЕМ РУКИ':r.type==='technique'?'ТЕХНИКА':'СЫГРАЙ СЕЙЧАС'}</div><span class="taskTag">${r.step+1} / ${r.steps.length}</span></div><div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${escapeHtml(noteText(target))}</span><b>${escapeHtml(HAND_LABELS[hand])}</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}<div class="targetHint">Сыграй именно указанную клавишу. Октава учитывается.</div></div><div id="lessonFeedback">${feedbackMarkup(r.errors?'bad':'wait',r.errors?'Попробуй ещё':'Жду звук',r.errors?`Услышано не то, что нужно. Цель: ${noteText(target)}.`:`Сыграй ${noteText(target)}.`)}</div>${retries>=1?`<div class="retryAction card"><div><b>Можно начать новую попытку</b><small>Нажми кнопку и сыграй эту же цель ещё раз.</small></div><button class="secondary" id="retryLessonAttempt">↻ Попробовать ещё раз</button></div>`:''}${retries>=3?`<div class="hintBox"><b>Подсказка</b><span>Найди группу из двух чёрных клавиш. ДО находится слева от неё. Потом проверь номер октавы.</span></div>`:''}</div>`;
}
window.renderSequenceTask=renderSequenceTask;
const V10_BASE_HANDLE_SEQ=window.handleSequenceDetected;
function handleSequenceDetected(m){return V10_BASE_HANDLE_SEQ(m)}

/* ------------------------------------------------------------------------
   Full keyboard. 61 keys, C2-C7. Touch scrolling is isolated in its own
   viewport so page scrolling does not interfere with it.
   ------------------------------------------------------------------------ */
function keyboardHtml(target,targets=[],mode='exact'){
  const low=36,high=96,width=36,wh=[];
  for(let m=low;m<=high;m++)if(WHITE_PC.includes(pitchClass(m)))wh.push(m);
  const idx=new Map(wh.map((m,i)=>[m,i]));
  const exact=targets.length?targets:(Number.isFinite(target)?[target]:[]);
  const isTarget=m=>mode==='pitchClass'?pitchClass(m)===pitchClass(target):exact.includes(m);
  let html='';
  for(const m of wh)html+=`<button type="button" class="pKey whiteKey ${isTarget(m)?'target':''}" data-pitch="${m}" style="left:${idx.get(m)*width}px" aria-label="${escapeHtml(noteText(m))}"><span>${noteName(m)}</span></button>`;
  for(let m=low;m<=high;m++)if(!WHITE_PC.includes(pitchClass(m))){const before=wh.findIndex(w=>w>m)-1;if(before>=0)html+=`<button type="button" class="pKey blackKey ${isTarget(m)?'target':''}" data-pitch="${m}" style="left:${before*width+23}px" aria-label="${escapeHtml(noteText(m))}"></button>`}
  const ot=Number.isFinite(target)?octave(target):4;
  return `<div class="v10KeyboardBlock" data-key-target="${Number.isFinite(target)?target:''}"><div class="v10KbHeader"><b>61 клавиша · C2–C7</b><span>Нужная клавиша автоматически по центру</span></div><div class="v10KbViewport" tabindex="0"><div class="keyboard v10FullKeyboard" style="width:${wh.length*width}px;height:210px">${html}</div></div><div class="v10KbControls"><button type="button" data-kb-prev>‹</button>${[2,3,4,5,6,7].map(o=>`<button type="button" data-kb-oct="${o}" class="${o===ot?'active':''}">${o}</button>`).join('')}<button type="button" data-kb-next>›</button></div></div>`;
}
function v10BindKeyboard(){
  $$('.v10KeyboardBlock').forEach(b=>{
    if(b.dataset.bound==='1')return;b.dataset.bound='1';
    const vp=$('.v10KbViewport',b),target=Number(b.dataset.keyTarget);
    const center=m=>{const k=$(`.pKey[data-pitch="${m}"]`,b);if(k)k.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});};
    if(Number.isFinite(target))setTimeout(()=>center(target),60);
    $('[data-kb-prev]',b)?.addEventListener('click',()=>vp.scrollBy({left:-vp.clientWidth*.82,behavior:'smooth'}));
    $('[data-kb-next]',b)?.addEventListener('click',()=>vp.scrollBy({left:vp.clientWidth*.82,behavior:'smooth'}));
    $$('[data-kb-oct]',b).forEach(x=>x.addEventListener('click',()=>center(12*(Number(x.dataset.kbOct)+1))));
    /* Drag to scroll on desktop and touch, in addition to native horizontal scrolling. */
    let down=false,x0=0,s0=0;
    vp.addEventListener('pointerdown',e=>{down=true;x0=e.clientX;s0=vp.scrollLeft;vp.setPointerCapture?.(e.pointerId);vp.classList.add('dragging')});
    vp.addEventListener('pointermove',e=>{if(!down)return;vp.scrollLeft=s0-(e.clientX-x0)});
    vp.addEventListener('pointerup',()=>{down=false;vp.classList.remove('dragging')});vp.addEventListener('pointercancel',()=>{down=false;vp.classList.remove('dragging')});
  });
}

/* ------------------------------------------------------------------------
   Course content — use the knowledge map as the canonical theory source.
   ------------------------------------------------------------------------ */
for(let i=1;i<=115;i++)if(V8_KNOWLEDGE?.[i]?.title)LESSON_TITLES[i-1]=V8_KNOWLEDGE[i].title;
const V10_BASE_BUILD=window.buildLesson;
function buildLesson(n){
  const r=V10_BASE_BUILD(n);if(!r)return r;
  const k=V8_KNOWLEDGE?.[n];
  if(k){r.title=k.title;r.theory=k.body;r.tip=k.tip;r.objective=`После урока ты должен уметь: ${k.title.toLowerCase()}.`}
  if(n===2){r.type='note';r.title='Октава: одна и та же нота выше или ниже';r.objective='Понять, что такое октава, и уверенно находить одну и ту же ноту в разных октавах.';r.theory='Октава — это путь от одной ноты до следующей такой же. Например: ДО → ДО. Между ними 12 клавиш. Поэтому ДО встречается на клавиатуре несколько раз: имя одно, высота разная.';r.tip='Найди две чёрные клавиши. Белая клавиша слева от них — ДО. Следующее ДО через 12 клавиш — та же нота в другой октаве.';r.steps=[60,72,48,60];r.anyOctave=false}
  return r;
}
window.buildLesson=buildLesson;

/* ------------------------------------------------------------------------
   Final lesson renderer wrapper: keeps existing 3-page structure and binds
   retry + keyboard after every render.
   ------------------------------------------------------------------------ */
const V10_BASE_RENDER_LESSON=window.renderLesson;
function renderLesson(){
  V10_BASE_RENDER_LESSON();
  const r=runtime;if(!r)return;
  $('#lessonNextPage')?.addEventListener('click',()=>{r.lessonPage=2;renderLesson()});
  const retry=$('#retryLessonAttempt');
  if(retry)retry.onclick=()=>{r.errors=0;r.sequenceDone=false;r.retryCount=(r.retryCount||0)+1;renderLesson()};
  v10BindKeyboard();
}
window.renderLesson=renderLesson;

/* ------------------------------------------------------------------------
   Final practice renderer: no diagnostics here; mic check is separate.
   ------------------------------------------------------------------------ */
const V10_BASE_RENDER_PRACTICE=window.renderPractice;
function renderPractice(){
  V10_BASE_RENDER_PRACTICE();
  v10BindKeyboard();
}
window.renderPractice=renderPractice;

/* ------------------------------------------------------------------------
   Microphone room: simple, visual, separate from practice tabs.
   */
function v10MicRoom(){
  let o=$('#v10MicRoom');if(!o){o=document.createElement('div');o.id='v10MicRoom';document.body.appendChild(o)}
  const connected=!!mic.stream;
  const r=v10LastDetected;
  const cal=state.audioProfile||{};
  o.innerHTML=`<div class="v10MicBack" id="v10MicBack"></div><section class="v10MicPanel"><div class="v10MicHead"><div><div class="sectionKicker">ЗВУК</div><h2>Проверить микрофон</h2><p>Отдельная комната для проверки: здесь видно, какую ноту реально услышал сайт.</p></div><button class="backBtn" id="v10MicClose">×</button></div><div class="v10MicLive ${connected?'connected':''}"><span class="v10Dot"></span><div><b>${connected?'Микрофон подключён':'Микрофон не подключён'}</b><small>${connected?'Сыграй одну ноту и смотри результат ниже.':'Нажми кнопку подключения.'}</small></div></div>${connected?`<div class="v10Detected"><span>Сейчас слышу</span><strong id="v10DetectedValue">${r?escapeHtml(noteText(r.midi)):'Жду звук'}</strong><small id="v10DetectedMeta">${r?`${Math.round(r.rawFreq)} Hz · уверенность ${Math.round(r.confidence*100)}%`:'—'}</small></div><div class="v10Cal card"><div class="sectionKicker">ПРОВЕРКА ДИАПАЗОНА</div><p>Для точной проверки сыграй по очереди ДО разных октав. Сайт не добавляет к каждой ноте произвольный сдвиг.</p><div class="v10TestRow">${[48,60,72].map(m=>`<button type="button" class="secondary" onclick="window.__v10Test=${m}">ДО ${octave(m)}</button>`).join('')}</div><small>Разрешение микрофона браузер обычно сохраняет для этого сайта. Сам поток звука создаётся заново после перезагрузки, поэтому сайт подключит его автоматически, когда разрешение уже выдано.</small></div><button class="ghostBtn full" id="v10ResetAudio">Сбросить аудио-настройки</button>`:`<button class="primary full" id="v10MicConnect">🎙 Подключить микрофон</button>`}<div class="v10Tips"><b>Tesler KB-6130</b><span>Поставь iPhone рядом с динамиком, но не вплотную. Выключи лишние источники звука. flowkey также рекомендует менять положение телефона, если отдельные ноты плохо слышны. </span></div></section>`;
  o.className='v10MicRoom show';
  $('#v10MicClose').onclick=()=>o.remove();$('#v10MicBack').onclick=()=>o.remove();
  $('#v10MicConnect')?.addEventListener('click',async()=>{await startMic();v10MicRoom()});
  $('#v10ResetAudio')?.addEventListener('click',()=>{state.audioProfile={autoReconnect:true,engineVersion:10,octaveOffset:0,calibrated:false};save();v10LastDetected=null;toast('Аудио-настройки сброшены','good');v10MicRoom()});
}
function openMicCheck(){v10MicRoom()}

/* ------------------------------------------------------------------------
   Achievements: exactly 54, 40 visible + 14 hidden.
   ------------------------------------------------------------------------ */
const V10_ACH=[
 ['welcome','🚪','Первый вход','Открыть Piano Learning'],['practice','◎','На тренировку','Открыть раздел «Практика»'],['mic','🎙️','На связи','Успешно подключить микрофон'],['first','🎹','Первая нота','Завершить первый урок'],['l5','🌱','Пять шагов','Завершить 5 уроков'],['l10','🔥','Первые десять','Завершить 10 уроков'],['l20','📚','Втянулся','Завершить 20 уроков'],['l30','🧠','Уже читаю','Завершить 30 уроков'],['l40','🎼','Музыкальная база','Завершить 40 уроков'],['l50','🚀','Пятьдесят','Завершить 50 уроков'],['l75','💫','Большой путь','Завершить 75 уроков'],['l100','🏅','Сто уроков','Завершить 100 уроков'],['course','👑','Финальный аккорд','Завершить все 115 уроков'],['xp100','⚡','100 XP','Набрать 100 XP'],['xp500','💎','500 XP','Набрать 500 XP'],['xp1k','🌟','1000 XP','Набрать 1000 XP'],['xp2k5','💠','2500 XP','Набрать 2500 XP'],['xp5k','🔷','5000 XP','Набрать 5000 XP'],['d3','🔥','Три дня подряд','Заниматься 3 дня подряд'],['d7','🗓️','Неделя ритма','Заниматься 7 дней подряд'],['d14','🌙','Две недели','Заниматься 14 дней подряд'],['d30','☀️','Месяц в ритме','Заниматься 30 дней подряд'],['song1','🎵','Первая песня','Потренироваться в 1 песне'],['song3','🎶','Три песни','Потренироваться в 3 песнях'],['song10','🎻','Репертуар','Потренироваться в 10 песнях'],['fav','❤️','Любимая полка','Добавить песню в избранное'],['mistake','🛠️','Сделал вывод','Исправить ошибку и завершить урок'],['chord','⌬','Первый аккорд','Правильно сыграть аккорд'],['ear','👂','Слышу','Правильно ответить в слуховом тренажёре'],['tuner','🎯','В центре','Поймать ноту тюнером'],['oct5','🌈','Пять регистров','Сыграть ноты во всех 5 регистрах'],['perfect10','✨','Чистая серия','10 целей подряд без ошибки'],['warmup','⏱️','Разогрев','Завершить разминку 3:00'],['pulse','◷','Чувствую пульс','Завершить урок 15'],['reading','♫','Читаю стан','Завершить урок 35'],['intervals','↗','Вижу расстояние','Завершить урок 45'],['harmony','⌬','Гармония','Завершить урок 60'],['scales','≈','По ступенькам','Завершить урок 72'],['hands','⇄','Две руки','Завершить урок 92'],['musicality','◌','Музыкальность','Завершить урок 100'],
 ['h1','🔮','hidden','hidden'],['h2','🗝️','hidden','hidden'],['h3','🌌','hidden','hidden'],['h4','🪄','hidden','hidden'],['h5','🧩','hidden','hidden'],['h6','🛰️','hidden','hidden'],['h7','🕰️','hidden','hidden'],['h8','🎯','hidden','hidden'],['h9','🦾','hidden','hidden'],['h10','🎹','hidden','hidden'],['h11','🌠','hidden','hidden'],['h12','🧭','hidden','hidden'],['h13','🪐','hidden','hidden'],['h14','👑','hidden','hidden']
];
function v10AchList(){
  const done=completedCount(),days=countConsecutiveActive(),songs=v8UnlockedSongCount(),s=v6EnsureStats();
  const vis={welcome:true,practice:(s.practiceOpen||0)>0,mic:!!state.audioProfile?.autoReconnect,first:done>=1,l5:done>=5,l10:done>=10,l20:done>=20,l30:done>=30,l40:done>=40,l50:done>=50,l75:done>=75,l100:done>=100,course:done>=115,xp100:state.xp>=100,xp500:state.xp>=500,xp1k:state.xp>=1000,xp2k5:state.xp>=2500,xp5k:state.xp>=5000,d3:days>=3,d7:days>=7,d14:days>=14,d30:days>=30,song1:songs>=1,song3:songs>=3,song10:songs>=10,fav:(state.favorites||[]).length>=1,mistake:Object.keys(state.mistakes||{}).length>0&&done>=2,chord:(s.chords||0)>=1,ear:(s.ear||0)>=1,tuner:(s.tuner||0)>=1,oct5:Object.keys(state.octavesSeen||{}).filter(o=>o>=1&&o<=5).length>=5,perfect10:(s.perfectRun||0)>=10,warmup:(s.warmup||0)>=1,pulse:done>=15,reading:done>=35,intervals:done>=45,harmony:done>=60,scales:done>=72,hands:done>=92,musicality:done>=100};
  const hid={h1:done>=10&&(s.perfectRun||0)>=5,h2:done>=20&&days>=7,h3:(s.notes||0)>=50,h4:songs>=5&&(s.chords||0)>=5,h5:done>=35&&Object.keys(state.mistakes||{}).length>=10,h6:done>=60&&state.xp>=3000,h7:done>=80&&days>=14,h8:done>=100&&(s.perfectRun||0)>=10,h9:songs>=10&&days>=10,h10:done>=115,h11:(s.warmup||0)>=3,h12:(s.ear||0)>=25,h13:(s.chords||0)>=25,h14:done>=115&&days>=30&&songs>=10};
  hid.h3=(s.notes||0)>=75&&Object.keys(state.octavesSeen||{}).length>=5;
  return V10_ACH.map(a=>({id:a[0],icon:a[1],title:a[2],desc:a[3],hidden:a[3]==='hidden',ok:a[3]==='hidden'?!!hid[a[0]]:!!vis[a[0]]}));
}
function openAchievementModal(){
  const list=v10AchList(),done=list.filter(a=>a.ok).length,o=$('#calendarOverlay');if(!o)return;
  o.innerHTML=`<div class="v10OverlayBack" id="v10AchBack"></div><div class="v10AchDialog card"><div class="calendarHead"><div><div class="sectionKicker">ДОСТИЖЕНИЯ · ${done}/${list.length}</div><h2>Как в Steam</h2><p>40 обычных достижений видны сразу. Только 14 секретных скрывают название и условие.</p></div><button class="backBtn" id="v10AchClose">×</button></div><div class="v10AchGrid">${list.map(a=>`<article class="achievement ${a.ok?'unlocked':''} ${a.hidden?'hiddenAchievement':''}"><span>${a.ok?a.icon:(a.hidden?'?':a.icon)}</span><div><b>${a.hidden&&!a.ok?'Скрытое достижение':a.title}</b><small>${a.hidden&&!a.ok?'Условие скрыто до разблокировки.':a.desc}</small></div><i>${a.ok?'✓':a.hidden?'?':'🔒'}</i></article>`).join('')}</div></div>`;
  o.className='calendarOverlay show';$('#v10AchClose').onclick=()=>o.className='calendarOverlay';$('#v10AchBack').onclick=()=>o.className='calendarOverlay';
}
function achievementList(){return v10AchList()}

/* ------------------------------------------------------------------------
   Calendar + blue week
   ------------------------------------------------------------------------ */
let v10CalDate=new Date();
function renderCalendar(){
  const o=$('#calendarOverlay');if(!o)return;
  const y=v10CalDate.getFullYear(),m=v10CalDate.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0),start=(first.getDay()+6)%7,n=last.getDate(),prefix=`${y}-${String(m+1).padStart(2,'0')}`;
  const vals=Object.entries(state.activityDays||{}).filter(([k])=>k.startsWith(prefix)).map(([,v])=>Number(v)||0),max=Math.max(1,...vals),active=vals.filter(v=>v>0).length,total=vals.reduce((a,b)=>a+b,0);
  const month=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(first);let cells='';for(let i=0;i<start;i++)cells+='<div class="v10CalCell empty"></div>';
  for(let d=1;d<=n;d++){const dt=new Date(y,m,d),k=todayKeyFromDate(dt),xp=Number(state.activityDays?.[k]||0),lev=xp?Math.min(4,Math.max(1,Math.ceil(xp/max*4))):0,today=dt.toDateString()===new Date().toDateString();cells+=`<div class="v10CalCell level-${lev} ${today?'today':''}"><b>${d}</b>${xp?`<small>${xp} XP</small>`:''}</div>`}
  o.innerHTML=`<div class="v10OverlayBack" id="v10CalBack"></div><div class="v10CalDialog card"><div class="calendarHead"><div><div class="sectionKicker">АКТИВНОСТЬ</div><h2>${month[0].toUpperCase()+month.slice(1)}</h2><p>Зелёный = занимался. Чем больше XP за день, тем насыщеннее зелёный.</p></div><button class="backBtn" id="v10CalClose">×</button></div><div class="v10CalNav"><button id="v10CalPrev">‹</button><strong>${month[0].toUpperCase()+month.slice(1)}</strong><button id="v10CalNext">›</button></div><div class="v10WeekNames">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span>${x}</span>`).join('')}</div><div class="v10CalGrid">${cells}</div><div class="v10Legend"><span>меньше XP</span><i class="level-1"></i><i class="level-2"></i><i class="level-3"></i><i class="level-4"></i><span>больше XP</span></div><div class="v10CalStat"><b>${active}</b> активных дней · <b>${total} XP</b></div></div>`;
  o.className='calendarOverlay show';$('#v10CalClose').onclick=()=>o.className='calendarOverlay';$('#v10CalBack').onclick=()=>o.className='calendarOverlay';$('#v10CalPrev').onclick=()=>{v10CalDate=new Date(y,m-1,1);renderCalendar()};$('#v10CalNext').onclick=()=>{v10CalDate=new Date(y,m+1,1);renderCalendar()};
}

const V10_BASE_RENDER_HOME=window.renderHome;
function renderHome(){
  V10_BASE_RENDER_HOME();
  const week=$('#home .weekDots');if(week)week.querySelectorAll('.weekDot').forEach(d=>{d.classList.add('v10Blue')});
}
window.renderHome=renderHome;

/* ------------------------------------------------------------------------
   Song library: 50 entries already present. Make the learning flow explain
   the exact-arrangement requirement without pretending the built-in demo is
   a copyrighted transcription.
   ------------------------------------------------------------------------ */
const V10_BASE_RENDER_SONGS=window.renderSongs;
function renderSongs(){V10_BASE_RENDER_SONGS();const intro=$('#songs .songIntro');if(intro){const b=$('b',intro),s=$('span',intro);if(b)b.textContent='Библиотека, в которую хочется возвращаться';if(s)s.textContent='Начинай с лёгких проектов, открывай новые стили и постепенно переходи к более сложным песням.'}}
window.renderSongs=renderSongs;

/* ------------------------------------------------------------------------
   Global visual polish and route transition.
   ------------------------------------------------------------------------ */
(function(){if(document.getElementById('v10Style'))return;const s=document.createElement('style');s.id='v10Style';s.textContent=`
    .screen{animation:v10ScreenIn .28s ease both}@keyframes v10ScreenIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    .bottomNav button,.primary,.secondary,.ghostBtn,.practiceTab,.lessonRow,.tile,.clickable{transition:transform .18s ease,box-shadow .18s ease,filter .18s ease}.bottomNav button:hover,.primary:hover,.secondary:hover,.ghostBtn:hover,.practiceTab:hover,.lessonRow:hover,.tile:hover,.clickable:hover{transform:translateY(-2px);filter:brightness(1.06)}
    .v10KeyboardBlock{margin-top:16px}.v10KbHeader{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:9px;font-size:12px}.v10KbHeader span{opacity:.65}.v10KbViewport{overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain;touch-action:pan-x;border-radius:18px;cursor:grab;scrollbar-width:thin;background:rgba(0,0,0,.12)}.v10KbViewport.dragging{cursor:grabbing}.v10FullKeyboard{position:relative;min-width:2460px}.v10FullKeyboard .pKey{position:absolute;top:0;border:0}.v10FullKeyboard .whiteKey{height:210px;width:36px;background:#f7f7fb;border-radius:0 0 7px 7px;border-right:1px solid #cfd1d8;color:#444}.v10FullKeyboard .whiteKey span{position:absolute;bottom:5px;left:0;right:0;font-size:8px;opacity:.45}.v10FullKeyboard .blackKey{height:128px;width:23px;background:#171923;border-radius:0 0 5px 5px;z-index:2;box-shadow:0 3px 5px rgba(0,0,0,.28)}.v10FullKeyboard .target{box-shadow:0 0 0 3px #6d7cff,0 0 22px rgba(109,124,255,.7)}.v10KbControls{display:flex;gap:6px;overflow-x:auto;padding-top:8px}.v10KbControls button{min-width:40px;height:34px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.05);color:inherit;border-radius:10px}.v10KbControls button.active{background:rgba(90,126,255,.2);border-color:rgba(90,126,255,.5)}
    .v10MicRoom{position:fixed;inset:0;z-index:12000}.v10MicBack,.v10OverlayBack{position:absolute;inset:0;background:rgba(5,8,18,.75);backdrop-filter:blur(12px)}.v10MicPanel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(760px,94vw);max-height:92vh;overflow:auto;padding:24px;border-radius:28px;background:#101521;border:1px solid rgba(255,255,255,.08);box-shadow:0 35px 100px rgba(0,0,0,.5)}.v10MicHead{display:flex;justify-content:space-between;gap:16px}.v10MicHead h2{margin:5px 0}.v10MicHead p{margin:0;opacity:.7}.v10MicLive,.v10Detected,.v10Cal,.v10Tips{margin-top:14px;padding:16px;border-radius:18px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07)}.v10MicLive{display:grid;grid-template-columns:10px 1fr;column-gap:10px}.v10Dot{width:10px;height:10px;border-radius:50%;background:#777;box-shadow:0 0 0 5px rgba(255,255,255,.04);margin-top:5px}.v10MicLive.connected .v10Dot{background:#42d77c;box-shadow:0 0 0 5px rgba(66,215,124,.12)}.v10MicLive small{grid-column:2;opacity:.65}.v10Detected strong{display:block;font-size:30px;margin:7px 0}.v10Detected small,.v10Tips span,.v10Cal small{opacity:.65}.v10TestRow{display:flex;gap:8px;overflow:auto;margin:10px 0}.v10AchDialog,.v10CalDialog{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(900px,94vw);max-height:90vh;overflow:auto;padding:22px;border-radius:26px}.v10AchGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;max-height:68vh;overflow:auto}.v10AchGrid .achievement{display:flex;gap:10px;align-items:center}.v10CalNav{display:flex;justify-content:space-between;align-items:center;margin:12px 0}.v10CalNav button{width:42px;height:42px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:inherit;font-size:26px}.v10WeekNames,.v10CalGrid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.v10WeekNames span{text-align:center;font-size:11px;opacity:.6}.v10CalCell{min-height:62px;border-radius:12px;padding:7px;background:rgba(255,255,255,.04);display:flex;flex-direction:column;justify-content:space-between}.v10CalCell.today{outline:2px solid rgba(255,255,255,.35)}.v10CalCell.level-1{background:rgba(46,196,118,.17)}.v10CalCell.level-2{background:rgba(46,196,118,.34)}.v10CalCell.level-3{background:rgba(46,196,118,.52)}.v10CalCell.level-4{background:rgba(46,196,118,.72)}.v10CalCell.empty{background:transparent}.v10CalCell small{font-size:9px}.v10Legend{display:flex;align-items:center;gap:7px;margin-top:12px;font-size:11px;opacity:.75}.v10Legend i{width:18px;height:18px;border-radius:5px}.v10Legend .level-1{background:rgba(46,196,118,.17)}.v10Legend .level-2{background:rgba(46,196,118,.34)}.v10Legend .level-3{background:rgba(46,196,118,.52)}.v10Legend .level-4{background:rgba(46,196,118,.72)}.v10CalStat{margin-top:12px;opacity:.75}.weekDot.v10Blue.level-0{background:rgba(72,132,255,.12)}.weekDot.v10Blue.level-1{background:rgba(72,132,255,.28)}.weekDot.v10Blue.level-2{background:rgba(72,132,255,.47)}.weekDot.v10Blue.level-3{background:rgba(72,132,255,.68)}.weekDot.v10Blue.level-4{background:rgba(72,132,255,.95)}
    @media(max-width:700px){.v10MicPanel,.v10AchDialog,.v10CalDialog{padding:16px;border-radius:20px}.v10AchGrid{grid-template-columns:1fr}.v10KbHeader{flex-direction:column;align-items:flex-start}.v10FullKeyboard{min-width:2460px}}
  `;document.head.appendChild(s)})()

/* Replace the old achievement drawer hook used by home. */
window.openAchievementModal=openAchievementModal;

/* Keep the app's route renderer and keyboard binding synchronized. */
const V10_BASE_GO=window.go;
function go(id){V10_BASE_GO(id);setTimeout(v10BindKeyboard,80)}
window.go=go;

/* Remembered permission: browser permission is persistent; the media stream
   is intentionally recreated on each page load. */
window.addEventListener('load',async()=>{
  await v10LoadPitch();await v10LoadChroma();
  try{
    const p=state.audioProfile||{};
    if(p.autoReconnect && navigator.permissions?.query){const perm=await navigator.permissions.query({name:'microphone'});if(perm.state==='granted'&&!mic.stream)await v10StartMic({silent:true})}
  }catch{}
  setTimeout(v10BindKeyboard,120);
});
/* ========================================================================
   PIANO LEARNING V11 — AUDIO + UX FINAL PASS
   1) Stop octave drift: no Hz averaging; use HPS + YIN/MPM/SWIPE/pYIN
      ensemble plus harmonic comb scoring and octave-pair comparison.
   2) Target-aware validation never forces a target; it only resolves the
      octave when the measured pitch class is the same.
   3) Chords require all target pitch classes to be stable across frames and
      then auto-advance.
   4) Retry appears after the first mistake; hint appears after 3 retries.
   5) 54 achievements = 40 visible + 14 hidden.
   6) Mic check remains a separate room with permission auto-reconnect.
   ======================================================================== */
(function(){
  'use strict';

  const V11={
    pitchLib:null,
    hpsLib:null,
    frame:0,
    lastHps:null,
    hpsUntil:0,
    lastPitch:null,
    stable:[],
    chordHistory:[],
    chordCooldown:0,
    micStarted:false
  };
  window.__V11=V11;

  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function freqForMidi(m){return 440*Math.pow(2,(m-69)/12)}
  function midiForFreq(f){return 69+12*Math.log2(f/440)}
  function dbToLin(db){return Math.pow(10,db/20)}
  function median(a){if(!a.length)return -100;const b=a.slice().sort((x,y)=>x-y);const m=Math.floor(b.length/2);return b.length%2?b[m]:(b[m-1]+b[m])/2}

  async function loadPitch(){
    if(V11.pitchLib)return V11.pitchLib;
    try{V11.pitchLib=await import('https://esm.sh/@audio/pitch@2.0.4?bundle')}catch(e){V11.pitchLib=null}
    return V11.pitchLib;
  }
  async function loadHps(){
    if(V11.hpsLib)return V11.hpsLib;
    try{V11.hpsLib=await import('https://esm.sh/@audio/pitch-hps@1.0.1?bundle')}catch(e){V11.hpsLib=null}
    return V11.hpsLib;
  }

  function windowed(src){
    const out=new Float32Array(src.length);
    const n=src.length;
    let mean=0;for(let i=0;i<n;i++)mean+=src[i];mean/=n;
    for(let i=0;i<n;i++){
      const x=src[i]-mean;
      const w=0.5*(1-Math.cos(2*Math.PI*i/(n-1)));
      out[i]=x*w;
    }
    return out;
  }

  function peakDb(freqData,sr,fftSize,f){
    if(!freqData||!Number.isFinite(f)||f<=0)return -120;
    const center=f*fftSize/sr;
    const span=Math.max(2,Math.ceil(center*.018));
    const lo=Math.max(1,Math.floor(center-span));
    const hi=Math.min(freqData.length-2,Math.ceil(center+span));
    let best=-120;
    for(let i=lo;i<=hi;i++)if(freqData[i]>best)best=freqData[i];
    return best;
  }
  function localNoiseDb(freqData,sr,fftSize,f){
    if(!freqData)return -100;
    const center=f*fftSize/sr;
    const span=Math.max(5,Math.ceil(center*.055));
    const vals=[];
    const lo=Math.max(2,Math.floor(center-span));
    const hi=Math.min(freqData.length-2,Math.ceil(center+span));
    for(let i=lo;i<=hi;i++){
      if(Math.abs(i-center)<=Math.max(2,Math.ceil(center*.018)))continue;
      vals.push(freqData[i]);
    }
    return median(vals);
  }
  function prominence(freqData,sr,fftSize,f){
    const p=peakDb(freqData,sr,fftSize,f),n=localNoiseDb(freqData,sr,fftSize,f);
    return Math.max(0,p-n);
  }

  function spectralNoteScore(midi,freqData,sr,fftSize){
    const f0=freqForMidi(midi);
    if(f0<35||f0>sr/2)return -Infinity;
    const weights=[1.65,.52,.92,.35,.68,.22,.48,.16,.32];
    let score=0,used=0,odd=0,even=0,fund=0;
    for(let h=1;h<=9;h++){
      const f=f0*h;if(f>=sr*.49)break;
      const p=prominence(freqData,sr,fftSize,f);
      const q=Math.min(45,p)/45;
      const w=weights[h-1]||.15;
      score+=q*w;used+=w;
      if(h===1)fund=q;
      else if(h%2===1)odd+=q/(h===3?1:1.4);
      else even+=q/(h===2?1:1.7);
    }
    /* A real piano note usually leaves energy at f, 3f, 5f. An octave-high
       false candidate mainly sees the original note's 2f,4f,6f, so the odd
       harmonic fingerprint is a strong octave discriminator. */
    const sub=prominence(freqData,sr,fftSize,f0/2);
    const score2=(score/Math.max(used,.001)) + fund*.85 + odd*.18 + even*.06 - sub*.008;
    return score2;
  }

  function spectralOctavePairScore(midi,freqData,sr,fftSize){
    const base=spectralNoteScore(midi,freqData,sr,fftSize);
    const up=spectralNoteScore(midi+12,freqData,sr,fftSize);
    const down=spectralNoteScore(midi-12,freqData,sr,fftSize);
    let adjusted=base;
    if(Number.isFinite(up)){
      const f=freqForMidi(midi);
      const sub=prominence(freqData,sr,fftSize,f/2);
      if(sub>7 && up>base-.3)adjusted-=Math.min(1.1,sub*.02);
    }
    if(Number.isFinite(down)){
      const f=freqForMidi(midi);
      const fundamental=prominence(freqData,sr,fftSize,f);
      if(fundamental>10 && base<down-.25)adjusted-=.35;
    }
    return adjusted;
  }

  function estimatorSupport(midi,est){
    let s=0;
    for(const e of est){
      const d=Math.abs(midi-e.midi);
      if(d<=.35)s+=e.w;
      else if(d<=.75)s+=e.w*.72;
      else if(d<=1.25)s+=e.w*.18;
    }
    return s;
  }

  function robustCandidateSet(est,target){
    const set=new Set();
    const addAround=m=>{for(let d=-2;d<=2;d++)for(let o=-24;o<=24;o+=12){const x=Math.round(m)+o+d;if(x>=36&&x<=96)set.add(x)}};
    est.forEach(e=>addAround(e.midi));
    if(Number.isFinite(target))for(let o=-24;o<=24;o+=12){const x=target+o;if(x>=36&&x<=96)set.add(x)}
    if(set.size<12)for(let m=36;m<=96;m++)set.add(m);
    return [...set];
  }

  function octaveResolve(candidates){
    const map=new Map(candidates.map(x=>[x.midi,x]));
    let result=candidates.slice();
    for(let m=36;m<=84;m++){
      const a=map.get(m),b=map.get(m+12);if(!a||!b)continue;
      const diff=a.score-b.score;
      /* If two adjacent octaves are otherwise ambiguous, require a useful
         spectral margin before changing the winner. */
      if(Math.abs(diff)<.16)continue;
      if(diff>0)b.score-=Math.min(.28,diff*.18);
      else a.score-=Math.min(.28,(-diff)*.18);
    }
    result.sort((a,b)=>b.score-a.score);
    return result[0];
  }

  function runEstimator(fn,buf,opts){
    try{
      const r=fn?.(buf,opts);
      if(r&&Number.isFinite(r.freq)&&r.freq>30&&r.freq<3000)return r;
    }catch(e){}
    return null;
  }

  function rawEstimates(buf,sr){
    const lib=V11.pitchLib;
    const est=[];
    const opts={fs:sr,minFreq:40,maxFreq:3000};
    const y=runEstimator(lib?.yin,buf,{...opts,threshold:.11});
    if(y)est.push({midi:midiForFreq(y.freq),freq:y.freq,clarity:Number(y.clarity)||0,w:.95,kind:'YIN'});
    const m=runEstimator(lib?.mcleod,buf,{...opts,threshold:.78});
    if(m)est.push({midi:midiForFreq(m.freq),freq:m.freq,clarity:Number(m.clarity)||0,w:.72,kind:'MPM'});
    const sw=runEstimator(lib?.swipe,buf,{...opts,threshold:.10});
    if(sw)est.push({midi:midiForFreq(sw.freq),freq:sw.freq,clarity:Number(sw.clarity)||0,w:.88,kind:'SWIPE'});
    if(V11.frame%3===0){
      const py=runEstimator(lib?.pyin,buf,{...opts,threshold:.1});
      if(py)est.push({midi:midiForFreq(py.freq),freq:py.freq,clarity:Number(py.clarity)||0,w:.92,kind:'pYIN'});
    }
    if(V11.frame%8===0){
      const local=localYin(buf,sr,55,2200,.12);
      if(local)est.push({midi:midiForFreq(local.freq),freq:local.freq,clarity:local.clarity,w:.48,kind:'localYIN'});
    }
    if(V11.frame%2===0){
      const hr=runEstimator(V11.hpsLib?.default||V11.hpsLib?.hps||V11.hpsLib?.HPS,buf,{...opts,harmonics:5,cents:10,threshold:.07});
      if(hr){const e={midi:midiForFreq(hr.freq),freq:hr.freq,clarity:Number(hr.clarity)||0,w:.96,kind:'HPS'};est.push(e);V11.lastHps=e;V11.hpsUntil=V11.frame+3}
    }else if(V11.lastHps&&V11.hpsUntil>=V11.frame)est.push({...V11.lastHps,w:.55});
    return est.filter(e=>Number.isFinite(e.midi)).slice(0,9);
  }

  function localYin(buf,sr,minFreq,maxFreq,threshold){
    const n=buf.length;
    let rms=0;for(let i=0;i<n;i++)rms+=buf[i]*buf[i];rms=Math.sqrt(rms/n);
    if(rms<.0012)return null;
    const minTau=Math.max(2,Math.floor(sr/maxFreq));
    const maxTau=Math.min(Math.floor(n/2),Math.ceil(sr/minFreq));
    const span=maxTau-minTau+1;
    const d=new Float64Array(span);
    let run=0;
    for(let tau=minTau;tau<=maxTau;tau++){
      let sum=0;
      for(let i=0;i<n-tau;i+=4){const x=buf[i]-buf[i+tau];sum+=x*x}
      d[tau-minTau]=sum/Math.max(1,Math.floor((n-tau+3)/4));
      run+=d[tau-minTau];
    }
    let acc=0,bestTau=-1,best=1;
    for(let i=0;i<span;i++){
      acc+=d[i];
      const cmnd=acc?(d[i]*i/acc):1;
      if(cmnd<best){best=cmnd;bestTau=minTau+i}
      if(bestTau>0&&cmnd<threshold&&i>(bestTau-minTau)+2)break;
    }
    if(bestTau<0||best>=.65)return null;
    let tau=bestTau;
    const i=tau-minTau;
    if(i>0&&i<span-1){
      const y0=d[i-1],y1=d[i],y2=d[i+1],den=(y0-2*y1+y2);if(Math.abs(den)>1e-9)tau+=(y0-y2)/(2*den)
    }
    const f=sr/tau;
    if(f<minFreq||f>maxFreq)return null;
    return {freq:f,clarity:clamp(1-best,0,1)};
  }

  function analyze(buf,sr){
    if(!mic.freq||!mic.analyser)return null;
    const rms=v11Rms(buf);
    if(rms<.0014)return null;
    const w=windowed(buf);
    const est=rawEstimates(w,sr);
    if(!est.length)return null;
    const target=v10TargetFromContext?.() ?? null;
    const fftSize=mic.analyser.fftSize;
    const cands=robustCandidateSet(est,target);
    const scored=[];
    for(const m of cands){
      const spectral=spectralOctavePairScore(m,mic.freq,sr,fftSize);
      const support=estimatorSupport(m,est);
      const exactTarget=Number.isFinite(target)&&pitchClass(m)===pitchClass(target);
      const targetBoost=exactTarget?0.035:0;
      const score=spectral*1.15+support*.28+targetBoost;
      scored.push({midi:m,spectral,support,score});
    }
    const best=octaveResolve(scored);
    if(!best)return null;
    const topEst=est.slice().sort((a,b)=>(b.clarity*b.w)-(a.clarity*a.w))[0];
    const agreement=est.reduce((a,e)=>a+(Math.max(0,1-Math.min(12,Math.abs(e.midi-best.midi))/2.0))*e.w,0)/Math.max(.01,est.reduce((a,e)=>a+e.w,0));
    const spectralConf=clamp(best.spectral/2.5,0,1);
    const confidence=clamp(.18+(topEst.clarity||0)*.34+agreement*.24+spectralConf*.24,0,1);
    const rawMidi=Math.round(topEst.midi);
    const rawFreq=topEst.freq;
    const cents=(midiForFreq(rawFreq)-best.midi)*100;
    return {midi:best.midi,physicalMidi:best.midi,rawMidi,rawFreq,confidence,rms,cents,estimates:est,spectral:best.spectral,target,engineVersion:11};
  }

  function v11ResetStability(){V11.stable=[];mic.candidateMidi=null;mic.candidateSince=0;mic.lastMidi=null;mic.lastDispatch=0}

  function stableDispatch(r,now){
    if(!r)return;
    V11.stable.push(r);if(V11.stable.length>7)V11.stable.shift();
    const counts=new Map();
    for(const x of V11.stable)counts.set(x.midi,(counts.get(x.midi)||0)+1);
    const ranked=[...counts.entries()].sort((a,b)=>b[1]-a[1]);
    const top=ranked[0];if(!top||top[1]<3)return;
    const same=V11.stable.filter(x=>x.midi===top[0]);
    const conf=same.reduce((a,x)=>a+x.confidence,0)/Math.max(1,same.length);
    if(mic.candidateMidi!==top[0]){mic.candidateMidi=top[0];mic.candidateSince=now;return}
    if(now-mic.candidateSince<65)return;
    if(mic.lastMidi===top[0]&&now-(mic.lastDispatch||0)<380)return;
    mic.lastMidi=top[0];mic.lastDispatch=now;markOctaveSeen(top[0]);
    onDetected(top[0],{confidence:conf,cents:r.cents,freq:r.rawFreq,physicalMidi:r.physicalMidi});
  }

  function chordScoreForPC(pc,chroma){return Number(chroma?.[pc])||0}
  function targetChordPCs(){
    if(route==='practice'&&practiceState.tab==='chords'&&practiceState.chord)return [...new Set(chord(practiceState.chord.root,practiceState.chord.type).map(pitchClass))];
    if(route==='lesson'&&runtime&&runtime.type==='chord'){const c=runtime.chordRounds?.[runtime.chordRound];if(c)return [...new Set(c.midi.map(pitchClass))]}
    return null;
  }
  function chordFrame(buf,sr,targetPCs){
    let chromaVec=null;
    try{
      const fn=V11.pitchLib?.chroma||V11.hpsLib?.chroma;
      if(fn)chromaVec=fn(buf,{fs:sr,method:'nnls',iterations:24,minFreq:55,maxFreq:2400});
    }catch(e){}
    try{
      if(!chromaVec&&window.__audioMirChroma)chromaVec=window.__audioMirChroma(buf,{fs:sr,method:'nnls',iterations:24,minFreq:55,maxFreq:2400})
    }catch(e){}
    if(!chromaVec)chromaVec=v10FallbackChroma(mic.freq,sr,mic.analyser.fftSize);
    const wanted=[...new Set(targetPCs)];
    const vals=wanted.map(pc=>chordScoreForPC(pc,chromaVec));
    const minWanted=Math.min(...vals),avg=vals.reduce((a,b)=>a+b,0)/Math.max(1,vals.length);
    const outside=Array.from(chromaVec).filter((_,i)=>!wanted.includes(i)).sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0);
    return {chroma:Array.from(chromaVec),wanted,minWanted,avg,outside,complete:minWanted>=.07&&avg>=.105};
  }

  async function loadChordLib(){
    if(window.__audioMirChroma)return;
    try{const m=await import('https://esm.sh/@audio/mir-chroma@1.1.2?bundle');window.__audioMirChroma=m.default||m.chroma||null}catch(e){window.__audioMirChroma=null}
  }

  function chordLoopV11(){
    const wanted=targetChordPCs();
    if(!wanted||!mic.timeBuf||performance.now()<V11.chordCooldown)return;
    const f=chordFrame(mic.timeBuf,mic.ctx.sampleRate,wanted);
    V11.chordHistory.push(f);if(V11.chordHistory.length>8)V11.chordHistory.shift();
    const stable=wanted.every(pc=>{
      let n=0;for(const x of V11.chordHistory)if((x.chroma[pc]||0)>=.07)n++;
      return n>=4;
    });
    const noMajorFalseHit=f.outside<.50;
    if(stable&&f.complete&&noMajorFalseHit){
      V11.chordCooldown=performance.now()+750;V11.chordHistory=[];
      const representative=wanted.map(pc=>60+pc);
      onChordDetected(representative);
    }
  }

  function micLoopV11(){
    if(!mic.analyser){return}
    const now=performance.now();
    if(now-(mic.__v11At||0)<45){mic.raf=requestAnimationFrame(micLoopV11);return}
    mic.__v11At=now;V11.frame++;
    if(!mic.timeBuf||mic.timeBuf.length!==mic.analyser.fftSize)mic.timeBuf=new Float32Array(mic.analyser.fftSize);
    mic.analyser.getFloatTimeDomainData(mic.timeBuf);mic.analyser.getFloatFrequencyData(mic.freq);
    if(targetChordPCs()){
      chordLoopV11();
      mic.raf=requestAnimationFrame(micLoopV11);return;
    }
    const r=analyze(mic.timeBuf,mic.ctx.sampleRate);
    const diag=$('#v10DetectedValue'),meta=$('#v10DetectedMeta');
    if(r){
      V11.lastPitch=r;v10LastDetected=r;mic.lastSeen=now;
      if(diag)diag.textContent=noteText(r.midi);
      if(meta)meta.textContent=`${Math.round(r.rawFreq)} Hz · уверенность ${Math.round(r.confidence*100)}%`;
      stableDispatch(r,now);
    }else if(mic.lastSeen&&now-mic.lastSeen>260){v11ResetStability()}
    mic.raf=requestAnimationFrame(micLoopV11);
  }

  async function startMicV11(options={}){
    const silent=!!options.silent;
    if(mic.stream){cancelAnimationFrame(mic.raf);v11ResetStability();V11.chordHistory=[];mic.raf=requestAnimationFrame(micLoopV11);if(!silent)toast('Микрофон уже подключён','good');return true}
    if(!window.isSecureContext){if(!silent)toast('Открой сайт по HTTPS для микрофона','bad');return false}
    try{
      await loadPitch();await loadHps();await loadChordLib();
      mic.stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
      mic.ctx=new (window.AudioContext||window.webkitAudioContext)();if(mic.ctx.state==='suspended')await mic.ctx.resume();
      mic.source=mic.ctx.createMediaStreamSource(mic.stream);mic.analyser=mic.ctx.createAnalyser();
      mic.analyser.fftSize=16384;mic.analyser.smoothingTimeConstant=0;mic.analyser.minDecibels=-105;mic.analyser.maxDecibels=-3;
      mic.freq=new Float32Array(mic.analyser.frequencyBinCount);mic.timeBuf=new Float32Array(mic.analyser.fftSize);mic.source.connect(mic.analyser);
      state.audioProfile=state.audioProfile||{};state.audioProfile.autoReconnect=true;state.audioProfile.engineVersion=11;state.audioProfile.octaveOffset=0;state.audioProfile.calibrated=false;save();
      v11ResetStability();V11.chordHistory=[];V11.frame=0;V11.lastHps=null;V11.micStarted=true;
      cancelAnimationFrame(mic.raf);mic.raf=requestAnimationFrame(micLoopV11);
      if(!silent)toast('Микрофон подключён — новый режим распознавания активен','good');
      render();return true;
    }catch(e){
      try{mic.stream?.getTracks().forEach(t=>t.stop())}catch{}
      mic.stream=null;mic.ctx=null;mic.analyser=null;mic.freq=null;
      if(!silent)toast(e?.name==='NotAllowedError'?'Разреши микрофон для этого сайта':'Не удалось подключить микрофон','bad');
      return false;
    }
  }

  /* ---------- Exact retry flow ---------- */
  function renderSequenceTaskV11(r){
    const target=r.steps[Math.min(r.step,r.steps.length-1)];
    const retryCount=Number(r.retryCount||0);
    const showRetry=Number(r.errors||0)>=1;
    const showHint=retryCount>=3;
    const hand=(r.hand&&r.hand!=='B')?r.hand:(r.type==='hands'?(target<60?'L':'R'):'B');
    const dynamicText=r.dynamic?({'soft':'мягко','normal':'обычно','strong':'чуть ярче'}[r.dynamic[r.dynamicStage]||'normal']||'обычно'):'';
    return `<div class="task card"><div class="taskTop"><div class="taskLabel">${r.type==='hands'?'СОЕДИНЯЕМ РУКИ':r.type==='technique'?'ТЕХНИКА':'СЫГРАЙ СЕЙЧАС'}</div><span class="taskTag">${r.step+1} / ${r.steps.length}</span></div>${r.type==='technique'&&r.dynamic?`<div class="focusStrip"><span>Сила звука</span><b>${dynamicText}</b></div>`:''}<div class="targetCard"><div class="targetName">${escapeHtml(noteName(target))}</div><div class="targetMeta"><span>${escapeHtml(noteText(target))}</span><b>${escapeHtml(HAND_LABELS[hand])}</b></div>${staffSvg([target],target,guessClef(target))}${keyboardHtml(target)}<div class="targetHint">Нужна именно эта клавиша. Сайт проверяет и ноту, и октаву.</div></div><div id="lessonFeedback">${feedbackMarkup(r.errors?'bad':'wait',r.errors?'Не совпало': 'Жду звук',r.errors?`Сейчас нужна ${escapeHtml(noteText(target))}. Сыграй ещё раз.`:`Сыграй ${escapeHtml(noteText(target))}.`)}</div>${showRetry?`<div class="retryAction card v11Retry"><div><b>Попробовать ещё раз</b><small>Начни эту же цель заново. После третьей попытки появится подсказка.</small></div><button class="secondary" id="retryLessonAttempt">↻ Попробовать ещё раз</button></div>`:''}${showHint?`<div class="hintBox"><b>Подсказка</b><span>На клавиатуре найди нужную ноту именно в указанном регистре. Можно воспользоваться автоматическим переходом к цели.</span></div>`:''}</div>`;
  }
  window.renderSequenceTask=renderSequenceTaskV11;

  function handleSequenceDetectedV11(m){
    const r=runtime;if(!r||r.passed||r.sequenceDone)return;
    const target=r.steps[r.step];if(target==null)return;
    const ok=r.anyOctave?pitchClass(m)===pitchClass(target):m===target;
    markOctaveSeen(m);flashKeys([m],ok);
    if(ok){
      r.step++;r.errors=0;r.retryCount=0;
      const s=v6EnsureStats();s.perfectRun=(s.perfectRun||0)+1;s.notes=(s.notes||0)+1;save();
      setLessonFeedback('good','Верно!',r.step<r.steps.length?`Следующая цель: ${noteText(r.steps[r.step])}.`:'Последняя нота!');
      if(r.step>=r.steps.length){
        r.passed=true;completeLesson(r.n);
        setTimeout(()=>renderLessonComplete(r),360);
      }else setTimeout(renderLesson,300);
    }else{
      r.errors=(r.errors||0)+1;
      state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;
      save();
      setLessonFeedback('bad','Не та нота',r.anyOctave?`Услышана ${noteText(m)}. Нужна ${noteName(target)} в любой октаве.`:`Услышана ${noteText(m)}. Нужна ${noteText(target)}.`);
      renderLesson();
    }
  }
  window.handleSequenceDetected=handleSequenceDetectedV11;

  function renderLessonV11(){
    const old=window.__v11OldRenderLesson;
    if(old)old();
    const retry=$('#retryLessonAttempt');
    if(retry)retry.onclick=()=>{runtime.errors=0;runtime.retryCount=(runtime.retryCount||0)+1;renderLesson()};
    v10BindKeyboard?.();
  }
  if(!window.__v11OldRenderLesson)window.__v11OldRenderLesson=window.renderLesson;
  window.renderLesson=function(){window.__v11OldRenderLesson();const retry=$('#retryLessonAttempt');if(retry)retry.onclick=()=>{runtime.errors=0;runtime.retryCount=(runtime.retryCount||0)+1;renderLesson()};v10BindKeyboard?.()};

  /* ---------- Practice exact note / warmup ---------- */
  const oldPracticeDetection=window.handlePracticeDetection;
  window.handlePracticeDetection=function(m,meta){
    if(practiceState.tab==='notes'||practiceState.tab==='weak'||practiceState.tab==='session'){
      const t=practiceState.note;if(!Number.isFinite(t))return;
      const isWarm=practiceState.tab==='session'&&practiceState.warmup?.started&&!practiceState.warmup?.finished;
      if(m===t){
        if(isWarm){practiceState.warmup.correct++;practiceState.warmup.index++;practiceState.note=randomPracticeMidi();markOctaveSeen(m);save();renderPractice();return}
        practiceState.notePassed=true;markOctaveSeen(m);v6EnsureStats().notes=(v6EnsureStats().notes||0)+1;v6EnsureStats().perfectRun=(v6EnsureStats().perfectRun||0)+1;save();
        const el=$('#practiceFeedback');if(el)el.innerHTML=feedbackMarkup('good','Верно!',`Точно ${noteText(m)}.`);flashKeys([m],true);return;
      }
      v6EnsureStats().perfectRun=0;state.mistakes=state.mistakes||{};state.mistakes[m]=(state.mistakes[m]||0)+1;save();
      const el=$('#practiceFeedback')||$('#practiceSessionFeedback');if(el)el.innerHTML=feedbackMarkup('bad','Попробуй ещё',`Услышано ${noteText(m)}. Нужно ${noteText(t)}.`);flashKeys([m],false);return;
    }
    return oldPracticeDetection?.(m,meta);
  };

  /* ---------- Chords: full-match gate + automatic next target ---------- */
  function exactPracticeChord(notes){
    const c=practiceState.chord;if(!c||practiceState.chordPassed)return;
    const wanted=[...new Set(chord(c.root,c.type).map(pitchClass))];
    const got=[...new Set((Array.isArray(notes)?notes:[notes]).map(pitchClass))];
    const complete=wanted.every(pc=>got.includes(pc));
    const wrong=got.some(pc=>!wanted.includes(pc));
    if(complete&&!wrong){
      practiceState.chordPassed=true;practiceState.chordSeen=[];v6EnsureStats().chords=(v6EnsureStats().chords||0)+1;save();
      const el=$('#practiceChordFeedback');if(el)el.innerHTML=feedbackMarkup('good','Аккорд совпал ✓','Все три ноты найдены. Переходим к следующему.');
      flashKeys(notes,true);
      setTimeout(()=>{
        const roots=Object.keys(ROOT_PC),types=CHORD_TYPES;practiceState.chord={root:roots[Math.floor(Math.random()*roots.length)],type:types[Math.floor(Math.random()*types.length)]};practiceState.chordPassed=false;practiceState.chordSeen=[];renderPractice();
      },520);
      return;
    }
    const matched=wanted.filter(pc=>got.includes(pc)).length;
    const el=$('#practiceChordFeedback');if(el)el.innerHTML=feedbackMarkup('wait','Собираем аккорд',`${matched} из ${wanted.length}. Нужны все звуки одновременно или почти одновременно.`);
    flashKeys(notes,!wrong);
  }
  window.handlePracticeChordDetected=exactPracticeChord;

  /* ---------- Achievements: exact 54, visible 40 + hidden 14 ---------- */
  function achievementListV11(){return (typeof v10AchList==='function'?v10AchList():[]).map(x=>x)}
  function openAchievementsV11(){
    const list=achievementListV11(),o=$('#calendarOverlay');if(!o)return;
    const hiddenCount=list.filter(x=>x.hidden).length,visibleCount=list.length-hiddenCount,done=list.filter(x=>x.ok).length;
    o.innerHTML=`<div class="v11OverlayBack" id="v11AchBack"></div><section class="v11AchDialog"><div class="v11Head"><div><span>ДОСТИЖЕНИЯ</span><h2>${done} / ${list.length}</h2><p>${visibleCount} обычных открыты сразу. ${hiddenCount} секретных скрывают условие до разблокировки.</p></div><button id="v11AchClose">×</button></div><div class="v11AchTabs"><b>Все ${list.length}</b><span>Обычные ${visibleCount}</span><span>Скрытые ${hiddenCount}</span></div><div class="v11AchGrid">${list.map(a=>`<article class="v11Achievement ${a.ok?'on':''} ${a.hidden?'secret':''}"><i>${a.ok?a.icon:(a.hidden?'?':a.icon)}</i><div><b>${a.hidden&&!a.ok?'Секретное достижение':a.title}</b><small>${a.hidden&&!a.ok?'Условие скрыто. Разблокируй его самостоятельно.':a.desc}</small></div><strong>${a.ok?'✓':a.hidden?'?':'🔒'}</strong></article>`).join('')}</div></section>`;
    o.className='calendarOverlay show';$('#v11AchClose').onclick=()=>o.className='calendarOverlay';$('#v11AchBack').onclick=()=>o.className='calendarOverlay';
  }
  window.openAchievementModal=openAchievementsV11;

  /* ---------- Calendar: single month + green intensity ---------- */
  let v11CalDate=new Date();
  function renderCalendarV11(){
    const o=$('#calendarOverlay');if(!o)return;
    const y=v11CalDate.getFullYear(),m=v11CalDate.getMonth(),first=new Date(y,m,1),last=new Date(y,m+1,0),start=(first.getDay()+6)%7,n=last.getDate();
    const vals=[];for(let d=1;d<=n;d++)vals.push(Number(state.activityDays?.[todayKeyFromDate(new Date(y,m,d))]||0));
    const max=Math.max(1,...vals),active=vals.filter(x=>x>0).length,total=vals.reduce((a,b)=>a+b,0);
    const month=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(first);let cells='';
    for(let i=0;i<start;i++)cells+='<div class="v11CalCell empty"></div>';
    for(let d=1;d<=n;d++){
      const dt=new Date(y,m,d),xp=Number(state.activityDays?.[todayKeyFromDate(dt)]||0),level=xp?Math.min(4,Math.max(1,Math.ceil(xp/max*4))):0,today=dt.toDateString()===new Date().toDateString();
      cells+=`<div class="v11CalCell l${level} ${today?'today':''}" title="${escapeHtml(dt.toLocaleDateString('ru-RU',{day:'numeric',month:'long'}))}: ${xp} XP"><b>${d}</b>${xp?`<small>${xp} XP</small>`:''}</div>`;
    }
    const title=month.charAt(0).toUpperCase()+month.slice(1);
    o.innerHTML=`<div class="v11OverlayBack" id="v11CalBack"></div><section class="v11CalDialog"><div class="v11Head"><div><span>АКТИВНОСТЬ</span><h2>${title}</h2><p>Зелёный день — ты занимался. Чем больше XP, тем насыщеннее цвет.</p></div><button id="v11CalClose">×</button></div><div class="v11CalNav"><button id="v11CalPrev">‹</button><strong>${title}</strong><button id="v11CalNext">›</button></div><div class="v11Week">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<span>${x}</span>`).join('')}</div><div class="v11CalGrid">${cells}</div><div class="v11Legend"><span>меньше XP</span><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i><span>больше XP</span></div><div class="v11CalTotal"><b>${active}</b> активных дней · <b>${total} XP</b></div></section>`;
    o.className='calendarOverlay show';$('#v11CalClose').onclick=()=>o.className='calendarOverlay';$('#v11CalBack').onclick=()=>o.className='calendarOverlay';$('#v11CalPrev').onclick=()=>{v11CalDate=new Date(y,m-1,1);renderCalendarV11()};$('#v11CalNext').onclick=()=>{v11CalDate=new Date(y,m+1,1);renderCalendarV11()};
  }
  window.renderCalendar=renderCalendarV11;

  /* ---------- Lesson theory synchronization ---------- */
  const V11_BASE_BUILD=window.buildLesson;
  window.buildLesson=function(n){
    const r=V11_BASE_BUILD(n);if(!r)return r;
    const k=V8_KNOWLEDGE?.[n];
    if(k){r.title=k.title;r.theory=k.body;r.tip=k.tip;r.objective=`После урока ты должен уметь: ${k.title.toLowerCase()}.`}
    if(n===2){
      r.title='Октава: одна и та же нота выше или ниже';
      r.theory='Представь лестницу из клавиш. ДО встречается снова через 12 клавиш. Это и есть октава: нота повторяется, но звучит выше или ниже. На одной клавиатуре таких повторов несколько.';
      r.tip='Найди две чёрные клавиши. Белая клавиша слева от них — ДО. От неё до следующего ДО ровно 12 клавиш.';
      r.objective='Понять, что такое октава, найти ДО и отличать одну октаву от другой.';
    }
    return r;
  };

  /* ---------- Separate microphone room ---------- */
  window.openMicCheck=function(){
    let o=$('#v11MicRoom');if(!o){o=document.createElement('div');o.id='v11MicRoom';document.body.appendChild(o)}
    const connected=!!mic.stream,det=V11.lastPitch||v10LastDetected;
    o.innerHTML=`<div class="v11MicBack" id="v11MicBack"></div><section class="v11MicPanel"><header><div><span>ДИАГНОСТИКА</span><h2>Проверить микрофон</h2><p>Здесь можно отдельно проверить, какую ноту и октаву сайт слышит. В обычной практике эти технические цифры не мешают.</p></div><button id="v11MicClose">×</button></header><div class="v11MicStatus ${connected?'on':''}"><i></i><div><b>${connected?'Микрофон подключён':'Микрофон не подключён'}</b><small>${connected?'Сыграй одну ноту на синтезаторе.':'Нажми кнопку подключения ниже.'}</small></div></div>${connected?`<div class="v11Readout"><span>Сейчас слышу</span><strong id="v10DetectedValue">${det?escapeHtml(noteText(det.midi)):'Жду звук'}</strong><small id="v10DetectedMeta">${det?`${Math.round(det.rawFreq)} Hz · уверенность ${Math.round(det.confidence*100)}%`:'—'}</small></div><div class="v11Calibrate"><span>КАЛИБРОВКА ОКТАВЫ</span><h3>Проверить 3 контрольные ноты</h3><p>По очереди сыграй ДО низкой, средней и высокой высоты. Это помогает проверить, не путает ли микрофон гармоники с фундаментальной частотой.</p><button id="v11CalStart" class="primary">Начать проверку</button><div id="v11CalBody"></div></div>`:`<button id="v11MicConnect" class="primary full">🎙 Подключить микрофон</button>`}<button id="v11MicReset" class="ghostBtn full">Сбросить аудио-настройки</button><div class="v11MicTip"><b>Tesler KB-6130</b><span>У этой модели 61 клавиша и нет USB-MIDI, поэтому сайт слушает акустический сигнал. Поставь iPhone рядом с динамиком, но не вплотную.</span></div></section>`;
    o.className='v11MicRoom show';
    $('#v11MicClose').onclick=()=>o.remove();$('#v11MicBack').onclick=()=>o.remove();
    $('#v11MicConnect')?.addEventListener('click',async()=>{await startMic();openMicCheck()});
    $('#v11MicReset')?.addEventListener('click',()=>{state.audioProfile={autoReconnect:true,engineVersion:11,octaveOffset:0,calibrated:false};save();toast('Аудио-настройки сброшены','good');openMicCheck()});
    $('#v11CalStart')?.addEventListener('click',()=>v11StartCalibration());
  };

  let v11Calibration=null;
  function v11StartCalibration(){
    const o=$('#v11CalBody');if(!o)return;
    v11Calibration={i:0,results:[]};
    const targets=[48,60,72];
    function renderStep(){const t=targets[v11Calibration.i];if(t==null){finish();return}o.innerHTML=`<div class="v11CalStep"><b>Шаг ${v11Calibration.i+1} из 3</b><strong>Сыграй ${noteText(t)}</strong><small>Сайт сравнит реальные частоты с ожидаемой нотой.</small><button class="secondary" id="v11CalHear">🔊 Услышать эталон</button><button class="secondary" id="v11CalSkip">Показать результат</button></div>`;$('#v11CalHear').onclick=()=>playTone(t);$('#v11CalSkip').onclick=()=>{v11Calibration.results.push({target:t,heard:V11.lastPitch?.midi??null});v11Calibration.i++;renderStep()}}
    function finish(){state.audioProfile=state.audioProfile||{};state.audioProfile.calibrated=true;save();o.innerHTML=`<div class="v11CalDone"><b>Проверка завершена</b><span>${v11Calibration.results.map(x=>`${noteText(x.target)} → ${x.heard?noteText(x.heard):'нет стабильного сигнала'}`).join('<br>')}</span><small>Калибровка не подменяет распознавание: она нужна как быстрый тест системы.</small></div>`}
    renderStep();
  }

  /* ---------- Keyboard: full 61 keys, easier navigation ---------- */
  const baseKeyboardHtml=window.keyboardHtml;
  window.keyboardHtml=function(target,targets=[],mode='exact'){
    return baseKeyboardHtml(target,targets,mode);
  };

  /* ---------- Start / loop / detector overrides ---------- */
  window.startMic=startMicV11;
  window.detectPitch=analyze;
  window.micLoop=micLoopV11;

  /* Ensure auto-reconnect upgrades old v10 streams to v11 loop. */
  window.addEventListener('load',async()=>{
    await loadPitch();await loadHps();await loadChordLib();
    setTimeout(()=>{if(mic.stream){cancelAnimationFrame(mic.raf);v11ResetStability();V11.chordHistory=[];mic.raf=requestAnimationFrame(micLoopV11)}},650);
  });

  /* ---------- Visual fixes ---------- */
  if(!document.getElementById('v11Style')){
    const s=document.createElement('style');s.id='v11Style';s.textContent=`
      .v11Retry{display:flex;justify-content:space-between;gap:14px;align-items:center;margin-top:12px;padding:14px;border-radius:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}.v11Retry small{display:block;opacity:.65;margin-top:4px}.v11Retry button{white-space:nowrap}
      .v11OverlayBack,.v11MicBack{position:absolute;inset:0;background:rgba(5,8,18,.78);backdrop-filter:blur(12px)}.v11AchDialog,.v11CalDialog,.v11MicPanel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(900px,94vw);max-height:90vh;overflow:auto;padding:24px;border-radius:28px;background:#101521;border:1px solid rgba(255,255,255,.08);box-shadow:0 35px 100px rgba(0,0,0,.5)}.v11Head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.v11Head>div>span,.v11MicPanel header>div>span{font-size:11px;letter-spacing:.12em;opacity:.58}.v11Head h2,.v11MicPanel h2{margin:6px 0}.v11Head p,.v11MicPanel header p{margin:0;opacity:.68}.v11Head button,.v11MicPanel header button{width:40px;height:40px;border:0;border-radius:12px;background:rgba(255,255,255,.06);color:inherit;font-size:26px}.v11AchTabs{display:flex;gap:8px;margin:14px 0;flex-wrap:wrap}.v11AchTabs>*{padding:7px 10px;border-radius:999px;background:rgba(255,255,255,.05);font-size:12px}.v11AchGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;max-height:65vh;overflow:auto}.v11Achievement{display:grid;grid-template-columns:44px 1fr 24px;gap:10px;align-items:center;padding:12px;border-radius:16px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06)}.v11Achievement.on{background:rgba(52,211,153,.10);border-color:rgba(52,211,153,.22)}.v11Achievement i{width:38px;height:38px;display:grid;place-items:center;border-radius:11px;background:rgba(255,255,255,.06);font-style:normal}.v11Achievement b,.v11Achievement small{display:block}.v11Achievement small{margin-top:3px;opacity:.62}.v11Achievement strong{opacity:.7;text-align:center}.v11CalNav{display:flex;justify-content:space-between;align-items:center;margin:14px 0}.v11CalNav button{width:44px;height:44px;border-radius:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.05);color:inherit;font-size:28px}.v11Week,.v11CalGrid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.v11Week span{text-align:center;font-size:11px;opacity:.58}.v11CalCell{min-height:66px;padding:7px;border-radius:12px;background:rgba(255,255,255,.04);display:flex;flex-direction:column;justify-content:space-between}.v11CalCell.empty{background:transparent}.v11CalCell.today{outline:2px solid rgba(255,255,255,.35)}.v11CalCell.l1{background:rgba(46,196,118,.16)}.v11CalCell.l2{background:rgba(46,196,118,.32)}.v11CalCell.l3{background:rgba(46,196,118,.50)}.v11CalCell.l4{background:rgba(46,196,118,.72)}.v11CalCell small{font-size:9px;opacity:.78}.v11Legend{display:flex;align-items:center;gap:7px;margin-top:12px;font-size:11px;opacity:.72}.v11Legend i{width:18px;height:18px;border-radius:5px}.v11Legend .l1{background:rgba(46,196,118,.16)}.v11Legend .l2{background:rgba(46,196,118,.32)}.v11Legend .l3{background:rgba(46,196,118,.50)}.v11Legend .l4{background:rgba(46,196,118,.72)}.v11CalTotal{margin-top:12px;opacity:.72}.v11MicPanel header{display:flex;justify-content:space-between;gap:16px}.v11MicStatus,.v11Readout,.v11Calibrate,.v11MicTip{margin-top:14px;padding:16px;border-radius:18px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07)}.v11MicStatus{display:grid;grid-template-columns:11px 1fr;gap:10px}.v11MicStatus i{width:10px;height:10px;border-radius:50%;background:#777;margin-top:5px}.v11MicStatus.on i{background:#42d77c;box-shadow:0 0 0 5px rgba(66,215,124,.12)}.v11MicStatus small{display:block;opacity:.62;margin-top:3px}.v11Readout strong{display:block;font-size:32px;margin:8px 0}.v11Readout small,.v11Calibrate p,.v11MicTip span{opacity:.64}.v11Calibrate>span{font-size:10px;letter-spacing:.13em;opacity:.55}.v11Calibrate h3{margin:6px 0}.v11Calibrate p{margin:0 0 12px}.v11CalStep,.v11CalDone{margin-top:12px;padding:14px;border-radius:14px;background:rgba(255,255,255,.04)}.v11CalStep>*{display:block;margin-bottom:8px}.v11CalStep small{opacity:.62}.v11MicTip b{display:block;margin-bottom:5px}.full{width:100%}
      @media(max-width:700px){.v11AchDialog,.v11CalDialog,.v11MicPanel{padding:16px;border-radius:20px}.v11AchGrid{grid-template-columns:1fr}.v11Retry{align-items:stretch;flex-direction:column}.v11Retry button{width:100%}.v11CalCell{min-height:54px;padding:6px}.v11CalCell small{font-size:8px}}
    `;document.head.appendChild(s)
  }
})();


/* V11 final startup: all renderer wrappers and audio helpers are initialized now. */
try {
  ensureDay();
  if (typeof window.render === 'function') window.render();
  else render();
} catch (e) {
  console.error('Piano Learning startup failed:', e);
}
