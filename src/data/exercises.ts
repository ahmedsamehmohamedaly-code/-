import { Exercise } from '../types/gym';

export const DEFAULT_EXERCISES: Exercise[] = [
  // CHEST
  {
    id: 'bench-press',
    name: { ar: 'بنش برس بالبار (مستوي)', en: 'Barbell Bench Press' },
    muscle: 'chest',
    secondaryMuscles: ['shoulders', 'arms'],
    equipment: 'barbell',
    cues: {
      ar: [
        'اسحب لوحي الكتف للخلف والأسفل على البنش وثبت قدميك بالأرض.',
        'أنزل البار ببطء نحو أسفل الصدر بزاوية مرفق 45 درجة.',
        'ادفع للأعلى بقوة مع الحفاظ على ثبات المعصم.',
      ],
      en: [
        'Retract and depress shoulder blades onto the bench with feet planted.',
        'Lower the bar with control to the lower chest at a 45° elbow tuck.',
        'Drive feet into the floor and press explosively while keeping wrists stacked.',
      ],
    },
  },
  {
    id: 'incline-db-press',
    name: { ar: 'بنش مائل بالدمبل', en: 'Incline Dumbbell Press' },
    muscle: 'chest',
    secondaryMuscles: ['shoulders', 'arms'],
    equipment: 'dumbbell',
    cues: {
      ar: [
        'اضبط زاوية البنش على 30 إلى 45 درجة لاستهداف أعلى الصدر.',
        'أنزل الدمبلز حتى تشعر بتمدد كامل للصدر دون رفع الكتفين.',
        'ادفع للأعلى في قوس طفيف دون تصادم الدمبلز بقوة.',
      ],
      en: [
        'Set bench angle to 30°–45° to bias upper clavicular chest fibers.',
        'Lower dumbbells deep for a full stretch without shoulders rolling forward.',
        'Press up in a slight arc without clanking weights at lockout.',
      ],
    },
  },
  {
    id: 'cable-fly',
    name: { ar: 'تفتيح بالكابل للصدر', en: 'Cable Chest Fly' },
    muscle: 'chest',
    secondaryMuscles: ['shoulders'],
    equipment: 'cable',
    cues: {
      ar: [
        'تقدم خطوة للأمام وثبت جذعك مع ثني بسيط في المرفق.',
        'اجلب اليدين معاً أمام الصدر واعصر العضلة لثانية.',
        'عد ببطء مع التحكم في الوزن لتجنب شد الكتف الأمامي.',
      ],
      en: [
        'Take a staggered stance with a soft, locked elbow bend.',
        'Bring handles together across the sternum and squeeze for 1 second.',
        'Control the eccentric stretch back without letting shoulders protract.',
      ],
    },
  },
  {
    id: 'weighted-dip',
    name: { ar: 'متوازي للصدر (Dips)', en: 'Chest Dips' },
    muscle: 'chest',
    secondaryMuscles: ['arms', 'shoulders'],
    equipment: 'bodyweight',
    cues: {
      ar: [
        'أمل جذعك للأمام قليلاً وافتح المرفقين بدرجة خفيفة.',
        'انزل حتى يصل المرفق لمستوى الكتف أو أعمق قليلاً.',
        'ادفع للأعلى مع إبقاء الكتفين بعيدين عن الأذنين.',
      ],
      en: [
        'Lean torso slightly forward to shift load onto the lower chest.',
        'Lower until elbows reach roughly 90 degrees with control.',
        'Press up smoothly without locking out violently.',
      ],
    },
  },

  // BACK
  {
    id: 'deadlift',
    name: { ar: 'ديدليفت تقليدي (Deadlift)', en: 'Conventional Deadlift' },
    muscle: 'back',
    secondaryMuscles: ['legs', 'core'],
    equipment: 'barbell',
    cues: {
      ar: [
        'قف والبار فوق منتصف القدم وأمسك به بعرض الكتفين.',
        'خذ نفساً عميقاً لشد البطن وارفع الصدر مع فرد الظهر.',
        'ادفع الأرض بقدميك وارفع البار ملاصقاً للساقين.',
      ],
      en: [
        'Stand with barbell over mid-foot and grip just outside your shins.',
        'Brace core hard, pull slack out of the bar, and keep spine neutral.',
        'Push the floor away with your legs while dragging the bar up your shins.',
      ],
    },
  },
  {
    id: 'pull-ups',
    name: { ar: 'عقلة قبضة واسعة (Pull-Ups)', en: 'Pull-Ups' },
    muscle: 'back',
    secondaryMuscles: ['arms', 'core'],
    equipment: 'bodyweight',
    cues: {
      ar: [
        'ابدأ من تعليق كامل مع سحب الكتفين للأسفل قبل ثني المرفق.',
        'اسحب مرفقيك نحو الجانبين حتى يتجاوز الذقن العقلة.',
        'انزل ببطء وتحكم كامل في المرحلة السلبية.',
      ],
      en: [
        'Start from a dead hang, depress scapulae, then initiate the pull.',
        'Drive elbows down toward your hips until chin clears the bar.',
        'Lower with a controlled 2-second eccentric back to full extension.',
      ],
    },
  },
  {
    id: 'barbell-row',
    name: { ar: 'تجديف بالبار (Barbell Row)', en: 'Bent-Over Barbell Row' },
    muscle: 'back',
    secondaryMuscles: ['arms', 'core'],
    equipment: 'barbell',
    cues: {
      ar: [
        'أمل الجذع للأمام بزاوية 45 درجة مع الحفاظ على استقامة الظهر.',
        'اسحب البار نحو أسفل البطن مع ضم لوحي الكتف.',
        'تجنب استخدام مرجحة الظهر لرفع الوزن.',
      ],
      en: [
        'Hinge hips back to a 45° torso angle with a braced, flat back.',
        'Row the barbell into your lower ribs/belly button, squeezing shoulder blades.',
        'Avoid jerking the torso upward to cheat the weight.',
      ],
    },
  },
  {
    id: 'lat-pulldown',
    name: { ar: 'سحب أمامي للظهر (Lat Pulldown)', en: 'Lat Pulldown' },
    muscle: 'back',
    secondaryMuscles: ['arms'],
    equipment: 'cable',
    cues: {
      ar: [
        'ثبت الفخذين جيداً وأمل جذعك للخلف قليلاً.',
        'اسحب البار لأعلى الصدر بالتركيز على عضلات اللاتس.',
        'افرد ذراعيك بالكامل للأعلى في نهاية كل عدة.',
      ],
      en: [
        'Lock knees firmly under pads and lean back slightly.',
        'Pull bar down to upper chest by driving elbows toward your sides.',
        'Allow a full upward scapular stretch at the top of every rep.',
      ],
    },
  },
  {
    id: 'seated-cable-row',
    name: { ar: 'سحب أرضي جالس (Cable Row)', en: 'Seated Cable Row' },
    muscle: 'back',
    secondaryMuscles: ['arms'],
    equipment: 'cable',
    cues: {
      ar: [
        'حافظ على استقامة الظهر وثبات الجذع طوال الحركة.',
        'اسحب المقبض نحو البطن مع إرجاع الكتفين للخلف.',
        'اترك الكتفين يتمددان للأمام ببطء قبل العدة التالية.',
      ],
      en: [
        'Keep torso upright and stable without excessive rocking.',
        'Pull handle into your abdomen while squeezing mid-back together.',
        'Let shoulder blades protract slightly on the return for full stretch.',
      ],
    },
  },

  // LEGS
  {
    id: 'barbell-squat',
    name: { ar: 'سكوات بالبار (Back Squat)', en: 'Barbell Back Squat' },
    muscle: 'legs',
    secondaryMuscles: ['core', 'back'],
    equipment: 'barbell',
    cues: {
      ar: [
        'ضع البار على أعلى الظهر وافتح قدميك بعرض الكتفين أو أوسع قليلاً.',
        'انزل بالورك للخلف والأسفل مع توجيه الركبتين نحو أصابع القدم.',
        'ادفع للأعلى من منتصف القدم مع الحفاظ على ارتفاع الصدر.',
      ],
      en: [
        'Position bar on upper traps with stance shoulder-width, toes angled slightly out.',
        'Break at hips and knees together, descending until hip crease passes knees.',
        'Drive through mid-foot with chest proud and core braced.',
      ],
    },
  },
  {
    id: 'romanian-deadlift',
    name: { ar: 'ديدليفت روماني (RDL)', en: 'Romanian Deadlift' },
    muscle: 'legs',
    secondaryMuscles: ['back'],
    equipment: 'barbell',
    cues: {
      ar: [
        'اثنِ الركبتين ثنية خفيفة وثابتة طوال التمرين.',
        'ادفع الورك للخلف مع بقاء البار ملاصقاً للفخذ والساق.',
        'توقف عند أقصى تمدد للعضلة الخلفية ثم ادفع الورك للأمام.',
      ],
      en: [
        'Maintain a soft, fixed knee bend throughout the entire set.',
        'Push hips straight back while keeping the bar shaved against your thighs.',
        'Stop at peak hamstring tension (mid-shin) and drive hips forward.',
      ],
    },
  },
  {
    id: 'leg-press',
    name: { ar: 'دفع الأرجل (Leg Press)', en: '45° Leg Press' },
    muscle: 'legs',
    secondaryMuscles: [],
    equipment: 'machine',
    cues: {
      ar: [
        'ضع قدميك في منتصف المنصة ولا ترفع أسفل الظهر عن المقعد.',
        'أنزل الوزن بأقصى مدى مريح دون التواء الحوض.',
        'ادفع للأعلى بدون قفل الركبتين بالكامل.',
      ],
      en: [
        'Place feet shoulder-width on the sled and keep lower back glued to the pad.',
        'Lower sled deep without letting hips curl off the seat.',
        'Press up smoothly, stopping just shy of knee lockout.',
      ],
    },
  },
  {
    id: 'bulgarian-split-squat',
    name: { ar: 'سكوات بلغاري بالدمبل', en: 'Bulgarian Split Squat' },
    muscle: 'legs',
    secondaryMuscles: ['core'],
    equipment: 'dumbbell',
    cues: {
      ar: [
        'ضع مشط القدم الخلفية على البنش وتقدم بالقدم الأمامية بمسافة مريحة.',
        'انزل عمودياً مع ميل خفيف للأمام للتركيز على عضلات الفخذ والمؤخرة.',
        'ادفع بكعب القدم الأمامية للصعود.',
      ],
      en: [
        'Rest rear foot laces on a bench with front foot far enough for vertical shin.',
        'Lower hips straight down with a slight torso lean for glute/quad balance.',
        'Drive forcefully through the front heel to stand.',
      ],
    },
  },
  {
    id: 'leg-curl',
    name: { ar: 'رفرفة خلفي على الجهاز', en: 'Lying Leg Curl' },
    muscle: 'legs',
    secondaryMuscles: [],
    equipment: 'machine',
    cues: {
      ar: [
        'اضبط المحور عند مستوى الركبة وثبت الحوض على المقعد.',
        'اثنِ الركبة بقوة ثم انزل ببطء لمدة 3 ثوانٍ.',
        'لا ترفع الورك عن البنش أثناء السحب.',
      ],
      en: [
        'Align knee joint with the machine pivot and keep hips pressed down.',
        'Curl pad smoothly toward glutes, pause briefly, then lower in 3 seconds.',
        'Avoid lifting hips off the pad to finish the rep.',
      ],
    },
  },
  {
    id: 'calf-raise',
    name: { ar: 'سمانة واقف (Calf Raise)', en: 'Standing Calf Raise' },
    muscle: 'legs',
    secondaryMuscles: [],
    equipment: 'machine',
    cues: {
      ar: [
        'انزل بالكعب لأسفل نقطة ممكنة مع توقف ثانية في الأسفل.',
        'ارتفع على أطراف الأصابع واعصر عضلة السمانة في الأعلى.',
        'تجنب الارتداد السريع للاستفادة الكاملة.',
      ],
      en: [
        'Drop heels into a deep stretch and pause 1 second at the bottom.',
        'Rise onto the balls of your feet and hold peak contraction.',
        'Avoid bouncing out of the bottom stretch.',
      ],
    },
  },

  // SHOULDERS
  {
    id: 'overhead-press',
    name: { ar: 'ضغط أكتاف بالبار (OHP)', en: 'Overhead Barbell Press' },
    muscle: 'shoulders',
    secondaryMuscles: ['arms', 'core'],
    equipment: 'barbell',
    cues: {
      ar: [
        'شد عضلات البطن والأرداف لحماية أسفل الظهر.',
        'ادفع البار عمودياً للأعلى بمحاذاة الوجه ثم أدخل الرأس تحت البار.',
        'أمسك البار بقبضة أوسع قليلاً من الكتفين.',
      ],
      en: [
        'Squeeze glutes and brace abs tight before initiating the press.',
        'Press straight up past your chin, shifting torso slightly forward at lockout.',
        'Grip just outside shoulder width with forearms vertical.',
      ],
    },
  },
  {
    id: 'lateral-raise',
    name: { ar: 'رفرفة جانبي بالدمبل', en: 'Dumbbell Lateral Raise' },
    muscle: 'shoulders',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    cues: {
      ar: [
        'ارفع الدمبلز للجانبين بزاوية 30 درجة للأمام (مستوى لوح الكتف).',
        'قد الحركة بالمرفق وليس بالرسغ وتوقف عند مستوى الكتف.',
        'تحكم في النزول وتجنب هز الجذع.',
      ],
      en: [
        'Raise dumbbells slightly forward in the scapular plane (30° angle).',
        'Lead with elbows up to shoulder height without shrugging traps.',
        'Lower slowly with control instead of dropping the weights.',
      ],
    },
  },
  {
    id: 'face-pull',
    name: { ar: 'سحب للوجه بالحبل (Face Pull)', en: 'Cable Face Pull' },
    muscle: 'shoulders',
    secondaryMuscles: ['back'],
    equipment: 'cable',
    cues: {
      ar: [
        'اسحب الحبل نحو الجبهة مع تدوير الكتفين للخارج.',
        'تأكد أن المعصمين والمرفقين على خط واحد في نهاية الحركة.',
        'اثبت ثانية عند الانقباض لتقوية الكتف الخلفي.',
      ],
      en: [
        'Pull rope toward forehead while externally rotating shoulders.',
        'Finish in a double-biceps pose with thumbs pointing backward.',
        'Hold peak squeeze for 1 second to target rear delts and rotator cuff.',
      ],
    },
  },
  {
    id: 'db-shoulder-press',
    name: { ar: 'ضغط أكتاف جالس بالدمبل', en: 'Seated Dumbbell Press' },
    muscle: 'shoulders',
    secondaryMuscles: ['arms'],
    equipment: 'dumbbell',
    cues: {
      ar: [
        'اضبط البنش عمودياً بزاوية 80-85 درجة.',
        'أبقِ المرفقين للأمام قليلاً بدلاً من فتحهما للخلف.',
        'ادفع الدمبلز للأعلى في مسار متوازن.',
      ],
      en: [
        'Set backrest slightly reclined (80°–85°) for comfortable shoulder mechanics.',
        'Keep elbows slightly tucked forward rather than flared straight out.',
        'Press overhead smoothly to near-lockout without arching lower back.',
      ],
    },
  },

  // ARMS
  {
    id: 'barbell-curl',
    name: { ar: 'بايسبس بالبار (EZ/Straight)', en: 'Barbell Bicep Curl' },
    muscle: 'arms',
    secondaryMuscles: [],
    equipment: 'barbell',
    cues: {
      ar: [
        'ثبت المرفقين بجانب الجذع دون دفعهما للأمام كثيراً.',
        'ارفع البار بعصر عضلة البايسبس في الأعلى.',
        'انزل ببطء مع فرد الذراع بالكامل تقريباً.',
      ],
      en: [
        'Pin elbows at your sides and avoid swinging the torso.',
        'Curl bar up smoothly and squeeze biceps at the top.',
        'Control the negative down to a full arm extension.',
      ],
    },
  },
  {
    id: 'incline-db-curl',
    name: { ar: 'بايسبس على بنش مائل', en: 'Incline Dumbbell Curl' },
    muscle: 'arms',
    secondaryMuscles: [],
    equipment: 'dumbbell',
    cues: {
      ar: [
        'استلقِ على بنش مائل 45 درجة مع تدلي الذراعين للأسفل.',
        'اثنِ الساعد للأعلى دون تحريك الكوع للأمام.',
        'يحقق تمدداً قوياً للرأس الطويل للبايسبس.',
      ],
      en: [
        'Sit on a 45° incline bench and let arms hang vertically behind torso.',
        'Curl without bringing elbows forward to maximize long-head stretch.',
        'Lower all the way down between every rep.',
      ],
    },
  },
  {
    id: 'tricep-pushdown',
    name: { ar: 'ترايسبس بالكابل (Rope/Bar)', en: 'Cable Tricep Pushdown' },
    muscle: 'arms',
    secondaryMuscles: [],
    equipment: 'cable',
    cues: {
      ar: [
        'ثبت المرفقين بجانب الجسم ومِل للأمام قليلاً.',
        'ادفع الحبل للأسفل وافتح اليدين للخارج في النهاية.',
        'اسمح للساعد بالصعود حتى أقصى ثني للمرفق.',
      ],
      en: [
        'Lock elbows beside ribs with a slight forward lean.',
        'Extend forearms fully and split the rope apart at lockout.',
        'Allow full elbow flexion at the top for complete stretch.',
      ],
    },
  },
  {
    id: 'skull-crushers',
    name: { ar: 'فرنساوي بالبار المتعرج (Skull Crusher)', en: 'EZ-Bar Skull Crusher' },
    muscle: 'arms',
    secondaryMuscles: [],
    equipment: 'barbell',
    cues: {
      ar: [
        'أمل الذراعين للخلف قليلاً للحفاظ على الشد المستمر للترايسبس.',
        'أنزل البار خلف الجبهة أو أعلى الرأس بتحكم.',
        'ادفع للأعلى بتحريك مفصل المرفق فقط.',
      ],
      en: [
        'Angle upper arms slightly behind vertical for constant tricep tension.',
        'Lower EZ-bar just behind the crown of your head under control.',
        'Extend elbows cleanly back to the starting angle.',
      ],
    },
  },

  // CORE
  {
    id: 'hanging-leg-raise',
    name: { ar: 'رفع الأرجل معلق (Hanging Raise)', en: 'Hanging Leg Raise' },
    muscle: 'core',
    secondaryMuscles: [],
    equipment: 'bodyweight',
    cues: {
      ar: [
        'تعلق بثبات وتجنب تأرجح الجسم للأمام والخلف.',
        'ارفع الركبتين أو الساقين مع لف الحوض للأعلى لاستهداف البطن.',
        'انزل ببطء للحفاظ على التوتر العضلي.',
      ],
      en: [
        'Hang from bar with shoulders engaged to prevent swinging.',
        'Curl pelvis upward toward ribs as knees/legs rise past hip height.',
        'Lower legs slowly back to dead hang without momentum.',
      ],
    },
  },
  {
    id: 'cable-crunch',
    name: { ar: 'طحن بطن بالكابل (Cable Crunch)', en: 'Kneeling Cable Crunch' },
    muscle: 'core',
    secondaryMuscles: [],
    equipment: 'cable',
    cues: {
      ar: [
        'اركع على الأرض وأمسك الحبل بجانب الرأس.',
        'قوس الظهر للأسفل بسحب القفص الصدري نحو الحوض، وليس بثني الورك.',
        'احفظ الحوض ثابتاً طوال الحركة.',
      ],
      en: [
        'Kneel with rope anchored beside your temples.',
        'Flex spine downward by bringing ribs toward pelvis without hinging hips.',
        'Hold peak abdominal contraction for 1 second before returning.',
      ],
    },
  },
];
