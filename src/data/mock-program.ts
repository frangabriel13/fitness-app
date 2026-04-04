import type { Microcycle, Program } from '@/types';

// --- Microciclos reutilizables ---

const MICROCYCLE_HIPERTROFIA_4D: Microcycle = {
  id: 'micro_001',
  daysPerWeek: 4,
  trainingDays: [
    {
      id: 'day_001',
      dayNumber: 1,
      name: 'Pecho y Tríceps',
      exercises: [
        {
          id: 'ex_001',
          order: 1,
          agonistMuscle: 'Pectoral mayor',
          exerciseName: 'Press banca con barra',
          sets: 4,
          repRange: '8-10',
          targetRir: 2,
          restSeconds: 120,
        },
        {
          id: 'ex_002',
          order: 2,
          agonistMuscle: 'Pectoral mayor (porción clavicular)',
          exerciseName: 'Press inclinado con mancuernas',
          sets: 3,
          repRange: '10-12',
          targetRir: 2,
          restSeconds: 90,
        },
        {
          id: 'ex_003',
          order: 3,
          agonistMuscle: 'Pectoral mayor',
          exerciseName: 'Aperturas en polea',
          sets: 3,
          repRange: '12-15',
          targetRir: 1,
          restSeconds: 60,
        },
        {
          id: 'ex_004',
          order: 4,
          agonistMuscle: 'Tríceps braquial',
          exerciseName: 'Fondos en paralelas',
          sets: 3,
          repRange: '8-12',
          targetRir: 2,
          restSeconds: 90,
        },
        {
          id: 'ex_005',
          order: 5,
          agonistMuscle: 'Tríceps braquial (cabeza larga)',
          exerciseName: 'Extensión de tríceps en polea con cuerda',
          sets: 3,
          repRange: '12-15',
          targetRir: 1,
          restSeconds: 60,
        },
      ],
    },
    {
      id: 'day_002',
      dayNumber: 2,
      name: 'Espalda y Bíceps',
      exercises: [
        {
          id: 'ex_006',
          order: 1,
          agonistMuscle: 'Dorsal ancho',
          exerciseName: 'Dominadas',
          sets: 4,
          repRange: '6-10',
          targetRir: 2,
          restSeconds: 120,
        },
        {
          id: 'ex_007',
          order: 2,
          agonistMuscle: 'Dorsal ancho',
          exerciseName: 'Remo con barra',
          sets: 4,
          repRange: '8-10',
          targetRir: 2,
          restSeconds: 90,
        },
        {
          id: 'ex_008',
          order: 3,
          agonistMuscle: 'Trapecio medio / Romboides',
          exerciseName: 'Remo en polea baja (agarre neutro)',
          sets: 3,
          repRange: '10-12',
          targetRir: 2,
          restSeconds: 90,
        },
        {
          id: 'ex_009',
          order: 4,
          agonistMuscle: 'Bíceps braquial',
          exerciseName: 'Curl con barra',
          sets: 3,
          repRange: '8-12',
          targetRir: 2,
          restSeconds: 60,
        },
        {
          id: 'ex_010',
          order: 5,
          agonistMuscle: 'Bíceps braquial (cabeza larga)',
          exerciseName: 'Curl inclinado con mancuernas',
          sets: 3,
          repRange: '10-12',
          targetRir: 1,
          restSeconds: 60,
        },
      ],
    },
    {
      id: 'day_003',
      dayNumber: 3,
      name: 'Piernas (Cuádriceps)',
      exercises: [
        {
          id: 'ex_011',
          order: 1,
          agonistMuscle: 'Cuádriceps',
          exerciseName: 'Sentadilla con barra',
          sets: 4,
          repRange: '6-8',
          targetRir: 2,
          restSeconds: 180,
        },
        {
          id: 'ex_012',
          order: 2,
          agonistMuscle: 'Cuádriceps',
          exerciseName: 'Prensa de piernas',
          sets: 3,
          repRange: '10-12',
          targetRir: 2,
          restSeconds: 120,
        },
        {
          id: 'ex_013',
          order: 3,
          agonistMuscle: 'Cuádriceps (recto femoral)',
          exerciseName: 'Extensión de cuádriceps',
          sets: 3,
          repRange: '12-15',
          targetRir: 1,
          restSeconds: 60,
        },
        {
          id: 'ex_014',
          order: 4,
          agonistMuscle: 'Gastrocnemio / Sóleo',
          exerciseName: 'Elevación de talones de pie',
          sets: 4,
          repRange: '12-15',
          targetRir: 1,
          restSeconds: 60,
        },
      ],
    },
    {
      id: 'day_004',
      dayNumber: 4,
      name: 'Hombros y Piernas (Isquios)',
      exercises: [
        {
          id: 'ex_015',
          order: 1,
          agonistMuscle: 'Deltoides anterior',
          exerciseName: 'Press militar con barra',
          sets: 4,
          repRange: '8-10',
          targetRir: 2,
          restSeconds: 120,
        },
        {
          id: 'ex_016',
          order: 2,
          agonistMuscle: 'Deltoides lateral',
          exerciseName: 'Elevaciones laterales',
          sets: 4,
          repRange: '12-15',
          targetRir: 1,
          restSeconds: 60,
        },
        {
          id: 'ex_017',
          order: 3,
          agonistMuscle: 'Deltoides posterior',
          exerciseName: 'Pájaros en polea',
          sets: 3,
          repRange: '12-15',
          targetRir: 1,
          restSeconds: 60,
        },
        {
          id: 'ex_018',
          order: 4,
          agonistMuscle: 'Isquiotibiales',
          exerciseName: 'Peso muerto rumano',
          sets: 4,
          repRange: '8-10',
          targetRir: 2,
          restSeconds: 120,
        },
        {
          id: 'ex_019',
          order: 5,
          agonistMuscle: 'Isquiotibiales',
          exerciseName: 'Curl femoral acostado',
          sets: 3,
          repRange: '10-12',
          targetRir: 1,
          restSeconds: 60,
        },
      ],
    },
  ],
};

const MICROCYCLE_FUERZA_3D: Microcycle = {
  id: 'micro_002',
  daysPerWeek: 3,
  trainingDays: [
    {
      id: 'day_f01',
      dayNumber: 1,
      name: 'Tren Superior (Empuje)',
      exercises: [
        {
          id: 'ex_f01',
          order: 1,
          agonistMuscle: 'Pectoral mayor',
          exerciseName: 'Press banca con barra',
          sets: 5,
          repRange: '5-6',
          targetRir: 2,
          restSeconds: 180,
        },
        {
          id: 'ex_f02',
          order: 2,
          agonistMuscle: 'Deltoides anterior',
          exerciseName: 'Press militar con barra',
          sets: 4,
          repRange: '6-8',
          targetRir: 2,
          restSeconds: 150,
        },
        {
          id: 'ex_f03',
          order: 3,
          agonistMuscle: 'Tríceps braquial',
          exerciseName: 'Press francés con barra Z',
          sets: 3,
          repRange: '8-10',
          targetRir: 2,
          restSeconds: 90,
        },
      ],
    },
    {
      id: 'day_f02',
      dayNumber: 2,
      name: 'Tren Inferior',
      exercises: [
        {
          id: 'ex_f04',
          order: 1,
          agonistMuscle: 'Cuádriceps',
          exerciseName: 'Sentadilla con barra',
          sets: 5,
          repRange: '5-6',
          targetRir: 2,
          restSeconds: 180,
        },
        {
          id: 'ex_f05',
          order: 2,
          agonistMuscle: 'Isquiotibiales',
          exerciseName: 'Peso muerto rumano',
          sets: 4,
          repRange: '6-8',
          targetRir: 2,
          restSeconds: 150,
        },
        {
          id: 'ex_f06',
          order: 3,
          agonistMuscle: 'Cuádriceps',
          exerciseName: 'Prensa de piernas',
          sets: 3,
          repRange: '8-10',
          targetRir: 2,
          restSeconds: 120,
        },
        {
          id: 'ex_f07',
          order: 4,
          agonistMuscle: 'Gastrocnemio / Sóleo',
          exerciseName: 'Elevación de talones sentado',
          sets: 3,
          repRange: '12-15',
          targetRir: 1,
          restSeconds: 60,
        },
      ],
    },
    {
      id: 'day_f03',
      dayNumber: 3,
      name: 'Tren Superior (Tirón)',
      exercises: [
        {
          id: 'ex_f08',
          order: 1,
          agonistMuscle: 'Dorsal ancho',
          exerciseName: 'Dominadas lastradas',
          sets: 5,
          repRange: '5-6',
          targetRir: 2,
          restSeconds: 180,
        },
        {
          id: 'ex_f09',
          order: 2,
          agonistMuscle: 'Dorsal ancho',
          exerciseName: 'Remo con barra',
          sets: 4,
          repRange: '6-8',
          targetRir: 2,
          restSeconds: 150,
        },
        {
          id: 'ex_f10',
          order: 3,
          agonistMuscle: 'Bíceps braquial',
          exerciseName: 'Curl con barra',
          sets: 3,
          repRange: '8-10',
          targetRir: 2,
          restSeconds: 90,
        },
      ],
    },
  ],
};

const MICROCYCLE_DEFAULT: Microcycle = {
  id: 'micro_default',
  daysPerWeek: 3,
  trainingDays: [
    {
      id: 'day_d01',
      dayNumber: 1,
      name: 'Full Body A',
      exercises: [
        {
          id: 'ex_d01',
          order: 1,
          agonistMuscle: 'Cuádriceps',
          exerciseName: 'Sentadilla goblet',
          sets: 3,
          repRange: '10-12',
          targetRir: 2,
          restSeconds: 90,
        },
        {
          id: 'ex_d02',
          order: 2,
          agonistMuscle: 'Pectoral mayor',
          exerciseName: 'Press banca con mancuernas',
          sets: 3,
          repRange: '10-12',
          targetRir: 2,
          restSeconds: 90,
        },
        {
          id: 'ex_d03',
          order: 3,
          agonistMuscle: 'Dorsal ancho',
          exerciseName: 'Remo con mancuerna',
          sets: 3,
          repRange: '10-12',
          targetRir: 2,
          restSeconds: 90,
        },
      ],
    },
    {
      id: 'day_d02',
      dayNumber: 2,
      name: 'Full Body B',
      exercises: [
        {
          id: 'ex_d04',
          order: 1,
          agonistMuscle: 'Isquiotibiales',
          exerciseName: 'Peso muerto rumano con mancuernas',
          sets: 3,
          repRange: '10-12',
          targetRir: 2,
          restSeconds: 90,
        },
        {
          id: 'ex_d05',
          order: 2,
          agonistMuscle: 'Deltoides anterior',
          exerciseName: 'Press militar con mancuernas',
          sets: 3,
          repRange: '10-12',
          targetRir: 2,
          restSeconds: 90,
        },
        {
          id: 'ex_d06',
          order: 3,
          agonistMuscle: 'Dorsal ancho',
          exerciseName: 'Jalón al pecho',
          sets: 3,
          repRange: '10-12',
          targetRir: 2,
          restSeconds: 90,
        },
      ],
    },
    {
      id: 'day_d03',
      dayNumber: 3,
      name: 'Full Body C',
      exercises: [
        {
          id: 'ex_d07',
          order: 1,
          agonistMuscle: 'Cuádriceps',
          exerciseName: 'Zancadas con mancuernas',
          sets: 3,
          repRange: '10-12',
          targetRir: 2,
          restSeconds: 90,
        },
        {
          id: 'ex_d08',
          order: 2,
          agonistMuscle: 'Pectoral mayor',
          exerciseName: 'Aperturas con mancuernas',
          sets: 3,
          repRange: '12-15',
          targetRir: 1,
          restSeconds: 60,
        },
        {
          id: 'ex_d09',
          order: 3,
          agonistMuscle: 'Bíceps braquial',
          exerciseName: 'Curl con mancuernas',
          sets: 3,
          repRange: '10-12',
          targetRir: 2,
          restSeconds: 60,
        },
      ],
    },
  ],
};

/**
 * Copia del microciclo de hipertrofia con IDs únicos para Carlos (trainer como cliente).
 * Evita colisión de workout log keys con prog_001 (Ana García), que comparte la misma estructura.
 */
const MICROCYCLE_HIPERTROFIA_4D_CARLOS: Microcycle = (() => {
  let n = 1;
  return {
    id: 'micro_003',
    daysPerWeek: 4,
    trainingDays: MICROCYCLE_HIPERTROFIA_4D.trainingDays.map((day, di) => ({
      ...day,
      id: `day_c0${di + 1}`,
      exercises: day.exercises.map((ex) => ({
        ...ex,
        id: `ex_c${String(n++).padStart(2, '0')}`,
      })),
    })),
  };
})();

// --- Programas ---

/** Template: plantilla del trainer, no asignada a ningún cliente */
export const MOCK_TEMPLATE_HIPERTROFIA: Program = {
  id: 'tmpl_001',
  name: 'Hipertrofia 4 días',
  totalWeeks: 8,
  clientId: null,
  trainerId: 'user_trainer_001',
  type: 'template',
  originTemplateId: null,
  microcycle: MICROCYCLE_HIPERTROFIA_4D,
  createdAt: '2024-02-01T10:00:00Z',
  updatedAt: '2024-02-01T10:00:00Z',
};

/** Asignado a Ana García (clonado de tmpl_001) */
export const MOCK_PROGRAM_ANA: Program = {
  id: 'prog_001',
  name: 'Hipertrofia',
  totalWeeks: 8,
  clientId: 'user_client_002',
  trainerId: 'user_trainer_001',
  type: 'assigned',
  originTemplateId: 'tmpl_001',
  microcycle: MICROCYCLE_HIPERTROFIA_4D,
  createdAt: '2024-06-05T10:00:00Z',
  updatedAt: '2024-06-05T10:00:00Z',
};

/** Asignado a Luis Rodríguez */
export const MOCK_PROGRAM_LUIS: Program = {
  id: 'prog_002',
  name: 'Fuerza 3 días',
  totalWeeks: 6,
  clientId: 'user_client_003',
  trainerId: 'user_trainer_001',
  type: 'assigned',
  originTemplateId: null,
  microcycle: MICROCYCLE_FUERZA_3D,
  createdAt: '2024-08-20T10:00:00Z',
  updatedAt: '2024-08-20T10:00:00Z',
};

/** Asignado a Carlos (trainer como su propio cliente) */
export const MOCK_PROGRAM_CARLOS: Program = {
  id: 'prog_003',
  name: 'Hipertrofia (Personal)',
  totalWeeks: 8,
  clientId: 'user_client_001',
  trainerId: 'user_trainer_001',
  type: 'assigned',
  originTemplateId: 'tmpl_001',
  microcycle: MICROCYCLE_HIPERTROFIA_4D_CARLOS,
  createdAt: '2024-03-01T10:00:00Z',
  updatedAt: '2024-03-01T10:00:00Z',
};

/** Rutina por defecto para clientes sin trainer */
export const MOCK_PROGRAM_DEFAULT: Program = {
  id: 'prog_default_001',
  name: 'Rutina General',
  totalWeeks: 4,
  clientId: 'user_client_004',
  trainerId: 'system',
  type: 'assigned',
  originTemplateId: null,
  microcycle: MICROCYCLE_DEFAULT,
  createdAt: '2025-01-20T16:00:00Z',
  updatedAt: '2025-01-20T16:00:00Z',
};

// --- Colecciones ---

export const MOCK_PROGRAMS: Program[] = [
  MOCK_TEMPLATE_HIPERTROFIA,
  MOCK_PROGRAM_ANA,
  MOCK_PROGRAM_LUIS,
  MOCK_PROGRAM_CARLOS,
  MOCK_PROGRAM_DEFAULT,
];

export const MOCK_PROGRAMS_MAP: Record<string, Program> = Object.fromEntries(
  MOCK_PROGRAMS.map((p) => [p.id, p])
);

/**
 * @deprecated Usar MOCK_PROGRAM_ANA o MOCK_PROGRAMS_MAP['prog_001'] en su lugar.
 * Mantenido temporalmente para compatibilidad.
 */
export const MOCK_PROGRAM: Program = MOCK_PROGRAM_ANA;
