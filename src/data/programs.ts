import { BodyMetricEntry, WorkoutProgram, WorkoutSession } from '../types/gym';

export const DEFAULT_PROGRAMS: WorkoutProgram[] = [
  {
    id: 'ppl-hypertrophy',
    name: { ar: 'بوش / بول / ليجز (PPL)', en: 'Push / Pull / Legs' },
    level: { ar: 'متوسط — متقدم', en: 'Intermediate' },
    daysPerWeek: 6,
    image: '/src/assets/images/program_strength_cover_1795437317983.jpg',
    description: {
      ar: 'النظام الأشهر للبناء العضلي المتوازن بتكرار كل عضلة مرتين أسبوعياً مع حجم تدريبي مدروس.',
      en: 'Classic 6-day hypertrophy split hitting every muscle group twice weekly with structured volume.',
    },
    days: [
      {
        id: 'ppl-push',
        name: { ar: 'يوم الدفع (Push)', en: 'Push Day' },
        focus: { ar: 'صدر · أكتاف · ترايسبس', en: 'Chest · Shoulders · Triceps' },
        exercises: [
          { exerciseId: 'bench-press', targetSets: 4, targetReps: '6–8', restSeconds: 150 },
          { exerciseId: 'incline-db-press', targetSets: 3, targetReps: '8–10', restSeconds: 120 },
          { exerciseId: 'overhead-press', targetSets: 3, targetReps: '8–10', restSeconds: 120 },
          { exerciseId: 'lateral-raise', targetSets: 4, targetReps: '12–15', restSeconds: 75 },
          { exerciseId: 'cable-fly', targetSets: 3, targetReps: '12–15', restSeconds: 75 },
          { exerciseId: 'tricep-pushdown', targetSets: 3, targetReps: '10–12', restSeconds: 75 },
        ],
      },
      {
        id: 'ppl-pull',
        name: { ar: 'يوم السحب (Pull)', en: 'Pull Day' },
        focus: { ar: 'ظهر · كتف خلفي · بايسبس', en: 'Back · Rear Delts · Biceps' },
        exercises: [
          { exerciseId: 'pull-ups', targetSets: 4, targetReps: '6–10', restSeconds: 120 },
          { exerciseId: 'barbell-row', targetSets: 4, targetReps: '8–10', restSeconds: 120 },
          { exerciseId: 'seated-cable-row', targetSets: 3, targetReps: '10–12', restSeconds: 90 },
          { exerciseId: 'face-pull', targetSets: 4, targetReps: '15–20', restSeconds: 60 },
          { exerciseId: 'barbell-curl', targetSets: 3, targetReps: '8–12', restSeconds: 75 },
          { exerciseId: 'incline-db-curl', targetSets: 3, targetReps: '10–12', restSeconds: 75 },
        ],
      },
      {
        id: 'ppl-legs',
        name: { ar: 'يوم الأرجل (Legs)', en: 'Leg Day' },
        focus: { ar: 'أمامي · خلفي · سمانة · بطن', en: 'Quads · Hamstrings · Calves · Core' },
        exercises: [
          { exerciseId: 'barbell-squat', targetSets: 4, targetReps: '6–8', restSeconds: 180 },
          { exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: '8–10', restSeconds: 150 },
          { exerciseId: 'leg-press', targetSets: 3, targetReps: '10–12', restSeconds: 120 },
          { exerciseId: 'leg-curl', targetSets: 3, targetReps: '12–15', restSeconds: 90 },
          { exerciseId: 'calf-raise', targetSets: 4, targetReps: '12–15', restSeconds: 60 },
          { exerciseId: 'hanging-leg-raise', targetSets: 3, targetReps: '10–15', restSeconds: 60 },
        ],
      },
    ],
  },
  {
    id: 'upper-lower-power',
    name: { ar: 'علوي / سفلي (Upper / Lower)', en: 'Upper / Lower Split' },
    level: { ar: 'جميع المستويات', en: 'All Levels' },
    daysPerWeek: 4,
    image: '/src/assets/images/program_conditioning_cover_1795437317734.jpg',
    description: {
      ar: 'توازن مثالي بين أيام التمرين والاستشفاء — 4 أيام أسبوعياً مثالية للقوة والضخامة معاً.',
      en: 'Optimal recovery-to-stimulus ratio: 4 high-output sessions per week combining heavy compounds and isolation.',
    },
    days: [
      {
        id: 'ul-upper-a',
        name: { ar: 'علوي A — قوة أساسية', en: 'Upper A — Strength Focus' },
        focus: { ar: 'صدر · ظهر · أكتاف · ذراعين', en: 'Chest · Back · Shoulders · Arms' },
        exercises: [
          { exerciseId: 'bench-press', targetSets: 4, targetReps: '5–7', restSeconds: 150 },
          { exerciseId: 'barbell-row', targetSets: 4, targetReps: '6–8', restSeconds: 150 },
          { exerciseId: 'db-shoulder-press', targetSets: 3, targetReps: '8–10', restSeconds: 120 },
          { exerciseId: 'lat-pulldown', targetSets: 3, targetReps: '10–12', restSeconds: 90 },
          { exerciseId: 'skull-crushers', targetSets: 3, targetReps: '10–12', restSeconds: 75 },
          { exerciseId: 'barbell-curl', targetSets: 3, targetReps: '10–12', restSeconds: 75 },
        ],
      },
      {
        id: 'ul-lower-a',
        name: { ar: 'سفلي A — سكوات وخلفيات', en: 'Lower A — Squat & Hinge' },
        focus: { ar: 'فخذين · سمانة · كور', en: 'Quads · Hamstrings · Calves · Core' },
        exercises: [
          { exerciseId: 'barbell-squat', targetSets: 4, targetReps: '5–7', restSeconds: 180 },
          { exerciseId: 'romanian-deadlift', targetSets: 4, targetReps: '8–10', restSeconds: 150 },
          { exerciseId: 'bulgarian-split-squat', targetSets: 3, targetReps: '10/leg', restSeconds: 90 },
          { exerciseId: 'calf-raise', targetSets: 4, targetReps: '12–15', restSeconds: 60 },
          { exerciseId: 'cable-crunch', targetSets: 3, targetReps: '12–15', restSeconds: 60 },
        ],
      },
      {
        id: 'ul-upper-b',
        name: { ar: 'علوي B — ضخامة وتفاصيل', en: 'Upper B — Hypertrophy' },
        focus: { ar: 'صدر علوي · سحب · أكتاف جانبية', en: 'Upper Chest · Width · Lateral Delts' },
        exercises: [
          { exerciseId: 'incline-db-press', targetSets: 4, targetReps: '8–10', restSeconds: 120 },
          { exerciseId: 'pull-ups', targetSets: 4, targetReps: '8–10', restSeconds: 120 },
          { exerciseId: 'weighted-dip', targetSets: 3, targetReps: '8–12', restSeconds: 90 },
          { exerciseId: 'seated-cable-row', targetSets: 3, targetReps: '10–12', restSeconds: 90 },
          { exerciseId: 'lateral-raise', targetSets: 4, targetReps: '12–15', restSeconds: 60 },
          { exerciseId: 'face-pull', targetSets: 3, targetReps: '15–20', restSeconds: 60 },
        ],
      },
      {
        id: 'ul-lower-b',
        name: { ar: 'سفلي B — ديدليفت ودفع', en: 'Lower B — Deadlift & Volume' },
        focus: { ar: 'سلسلة خلفية · دفع أرجل · بطن', en: 'Posterior Chain · Quad Volume · Core' },
        exercises: [
          { exerciseId: 'deadlift', targetSets: 3, targetReps: '5', restSeconds: 180 },
          { exerciseId: 'leg-press', targetSets: 4, targetReps: '10–12', restSeconds: 120 },
          { exerciseId: 'leg-curl', targetSets: 3, targetReps: '10–12', restSeconds: 90 },
          { exerciseId: 'calf-raise', targetSets: 4, targetReps: '15', restSeconds: 60 },
          { exerciseId: 'hanging-leg-raise', targetSets: 3, targetReps: '12', restSeconds: 60 },
        ],
      },
    ],
  },
  {
    id: 'full-body-foundation',
    name: { ar: 'فول بودي 3 أيام (Full Body)', en: 'Full Body 3-Day Foundation' },
    level: { ar: 'مبتدئ — متوسط', en: 'Beginner / Busy Schedule' },
    daysPerWeek: 3,
    image: '/src/assets/images/gym_hero_banner_1795437317671.jpg',
    description: {
      ar: 'أقصى عائد في أقل وقت — 3 جلسات أسبوعياً تركز على التمارين المركبة الأساسية.',
      en: 'Maximum efficiency in 3 days per week centered around foundational compound movements.',
    },
    days: [
      {
        id: 'fb-day-1',
        name: { ar: 'جلسة شاملة A', en: 'Full Body Session A' },
        focus: { ar: 'سكوات · بنش · تجديف · أكتاف', en: 'Squat · Bench · Row · Shoulders' },
        exercises: [
          { exerciseId: 'barbell-squat', targetSets: 3, targetReps: '6–8', restSeconds: 150 },
          { exerciseId: 'bench-press', targetSets: 3, targetReps: '6–8', restSeconds: 150 },
          { exerciseId: 'barbell-row', targetSets: 3, targetReps: '8–10', restSeconds: 120 },
          { exerciseId: 'lateral-raise', targetSets: 3, targetReps: '12–15', restSeconds: 60 },
          { exerciseId: 'cable-crunch', targetSets: 3, targetReps: '12–15', restSeconds: 60 },
        ],
      },
      {
        id: 'fb-day-2',
        name: { ar: 'جلسة شاملة B', en: 'Full Body Session B' },
        focus: { ar: 'ديدليفت · أكتاف · عقلة · ذراعين', en: 'Deadlift · OHP · Pull-Ups · Arms' },
        exercises: [
          { exerciseId: 'deadlift', targetSets: 3, targetReps: '5', restSeconds: 180 },
          { exerciseId: 'overhead-press', targetSets: 3, targetReps: '6–8', restSeconds: 120 },
          { exerciseId: 'lat-pulldown', targetSets: 3, targetReps: '10–12', restSeconds: 90 },
          { exerciseId: 'incline-db-press', targetSets: 3, targetReps: '10–12', restSeconds: 90 },
          { exerciseId: 'tricep-pushdown', targetSets: 3, targetReps: '12', restSeconds: 60 },
        ],
      },
    ],
  },
];

function daysAgoIso(days: number, hour = 18): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 30, 0, 0);
  return d.toISOString();
}

export const INITIAL_SESSIONS: WorkoutSession[] = [
  {
    id: 'seed-session-1',
    title: 'Push Day — الصدر والأكتاف',
    programId: 'ppl-hypertrophy',
    startedAt: daysAgoIso(1, 18),
    durationSeconds: 3780,
    prCount: 1,
    totalVolumeKg: 7420,
    exercises: [
      {
        id: 's1-e1',
        exerciseId: 'bench-press',
        restSeconds: 150,
        sets: [
          { id: 's1-e1-1', weight: 85, reps: 8, completed: true },
          { id: 's1-e1-2', weight: 92.5, reps: 6, completed: true, isPR: true },
          { id: 's1-e1-3', weight: 90, reps: 6, completed: true },
          { id: 's1-e1-4', weight: 85, reps: 8, completed: true },
        ],
      },
      {
        id: 's1-e2',
        exerciseId: 'incline-db-press',
        restSeconds: 120,
        sets: [
          { id: 's1-e2-1', weight: 32, reps: 10, completed: true },
          { id: 's1-e2-2', weight: 34, reps: 9, completed: true },
          { id: 's1-e2-3', weight: 34, reps: 8, completed: true },
        ],
      },
      {
        id: 's1-e3',
        exerciseId: 'overhead-press',
        restSeconds: 120,
        sets: [
          { id: 's1-e3-1', weight: 55, reps: 8, completed: true },
          { id: 's1-e3-2', weight: 57.5, reps: 7, completed: true },
          { id: 's1-e3-3', weight: 55, reps: 8, completed: true },
        ],
      },
      {
        id: 's1-e4',
        exerciseId: 'lateral-raise',
        restSeconds: 75,
        sets: [
          { id: 's1-e4-1', weight: 14, reps: 14, completed: true },
          { id: 's1-e4-2', weight: 14, reps: 14, completed: true },
          { id: 's1-e4-3', weight: 14, reps: 13, completed: true },
        ],
      },
      {
        id: 's1-e5',
        exerciseId: 'tricep-pushdown',
        restSeconds: 75,
        sets: [
          { id: 's1-e5-1', weight: 35, reps: 12, completed: true },
          { id: 's1-e5-2', weight: 35, reps: 12, completed: true },
          { id: 's1-e5-3', weight: 35, reps: 11, completed: true },
        ],
      },
    ],
  },
  {
    id: 'seed-session-2',
    title: 'Pull Day — الظهر والبايسبس',
    programId: 'ppl-hypertrophy',
    startedAt: daysAgoIso(3, 19),
    durationSeconds: 3420,
    prCount: 1,
    totalVolumeKg: 6890,
    exercises: [
      {
        id: 's2-e1',
        exerciseId: 'barbell-row',
        restSeconds: 120,
        sets: [
          { id: 's2-e1-1', weight: 80, reps: 8, completed: true },
          { id: 's2-e1-2', weight: 85, reps: 8, completed: true, isPR: true },
          { id: 's2-e1-3', weight: 85, reps: 7, completed: true },
          { id: 's2-e1-4', weight: 80, reps: 8, completed: true },
        ],
      },
      {
        id: 's2-e2',
        exerciseId: 'lat-pulldown',
        restSeconds: 90,
        sets: [
          { id: 's2-e2-1', weight: 70, reps: 10, completed: true },
          { id: 's2-e2-2', weight: 75, reps: 10, completed: true },
          { id: 's2-e2-3', weight: 75, reps: 9, completed: true },
        ],
      },
      {
        id: 's2-e3',
        exerciseId: 'seated-cable-row',
        restSeconds: 90,
        sets: [
          { id: 's2-e3-1', weight: 65, reps: 12, completed: true },
          { id: 's2-e3-2', weight: 70, reps: 10, completed: true },
          { id: 's2-e3-3', weight: 70, reps: 10, completed: true },
        ],
      },
      {
        id: 's2-e4',
        exerciseId: 'barbell-curl',
        restSeconds: 75,
        sets: [
          { id: 's2-e4-1', weight: 35, reps: 10, completed: true },
          { id: 's2-e4-2', weight: 37.5, reps: 9, completed: true },
          { id: 's2-e4-3', weight: 35, reps: 10, completed: true },
        ],
      },
    ],
  },
  {
    id: 'seed-session-3',
    title: 'Leg Day — الأرجل والسكوات',
    programId: 'ppl-hypertrophy',
    startedAt: daysAgoIso(5, 17),
    durationSeconds: 4100,
    prCount: 1,
    totalVolumeKg: 9340,
    exercises: [
      {
        id: 's3-e1',
        exerciseId: 'barbell-squat',
        restSeconds: 180,
        sets: [
          { id: 's3-e1-1', weight: 110, reps: 6, completed: true },
          { id: 's3-e1-2', weight: 120, reps: 6, completed: true, isPR: true },
          { id: 's3-e1-3', weight: 120, reps: 5, completed: true },
          { id: 's3-e1-4', weight: 110, reps: 6, completed: true },
        ],
      },
      {
        id: 's3-e2',
        exerciseId: 'romanian-deadlift',
        restSeconds: 150,
        sets: [
          { id: 's3-e2-1', weight: 100, reps: 8, completed: true },
          { id: 's3-e2-2', weight: 105, reps: 8, completed: true },
          { id: 's3-e2-3', weight: 105, reps: 8, completed: true },
        ],
      },
      {
        id: 's3-e3',
        exerciseId: 'leg-press',
        restSeconds: 120,
        sets: [
          { id: 's3-e3-1', weight: 180, reps: 12, completed: true },
          { id: 's3-e3-2', weight: 200, reps: 10, completed: true },
          { id: 's3-e3-3', weight: 200, reps: 10, completed: true },
        ],
      },
      {
        id: 's3-e4',
        exerciseId: 'calf-raise',
        restSeconds: 60,
        sets: [
          { id: 's3-e4-1', weight: 60, reps: 15, completed: true },
          { id: 's3-e4-2', weight: 60, reps: 15, completed: true },
          { id: 's3-e4-3', weight: 60, reps: 14, completed: true },
        ],
      },
    ],
  },
  {
    id: 'seed-session-4',
    title: 'Upper A — قوة أساسية',
    programId: 'upper-lower-power',
    startedAt: daysAgoIso(8, 18),
    durationSeconds: 3600,
    prCount: 0,
    totalVolumeKg: 6650,
    exercises: [
      {
        id: 's4-e1',
        exerciseId: 'bench-press',
        restSeconds: 150,
        sets: [
          { id: 's4-e1-1', weight: 85, reps: 7, completed: true },
          { id: 's4-e1-2', weight: 87.5, reps: 6, completed: true },
          { id: 's4-e1-3', weight: 87.5, reps: 6, completed: true },
        ],
      },
      {
        id: 's4-e2',
        exerciseId: 'deadlift',
        restSeconds: 180,
        sets: [
          { id: 's4-e2-1', weight: 140, reps: 5, completed: true },
          { id: 's4-e2-2', weight: 150, reps: 5, completed: true },
          { id: 's4-e2-3', weight: 150, reps: 4, completed: true },
        ],
      },
      {
        id: 's4-e3',
        exerciseId: 'db-shoulder-press',
        restSeconds: 120,
        sets: [
          { id: 's4-e3-1', weight: 26, reps: 10, completed: true },
          { id: 's4-e3-2', weight: 28, reps: 8, completed: true },
          { id: 's4-e3-3', weight: 28, reps: 8, completed: true },
        ],
      },
    ],
  },
];

function daysAgoDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export const INITIAL_BODY_METRICS: BodyMetricEntry[] = [
  { id: 'bm-1', date: daysAgoDate(28), weightKg: 81.4, bodyFatPercent: 16.8 },
  { id: 'bm-2', date: daysAgoDate(21), weightKg: 80.9, bodyFatPercent: 16.4 },
  { id: 'bm-3', date: daysAgoDate(14), weightKg: 80.5, bodyFatPercent: 16.1 },
  { id: 'bm-4', date: daysAgoDate(7), weightKg: 80.1, bodyFatPercent: 15.7 },
  { id: 'bm-5', date: daysAgoDate(1), weightKg: 79.8, bodyFatPercent: 15.4 },
];
