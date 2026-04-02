import type { ClientProfile, TrainerProfile, User } from '@/types';

// --- Trainer ---

export const MOCK_TRAINER: TrainerProfile = {
  id: 'user_trainer_001',
  role: 'trainer',
  email: 'carlos@fitcoach.com',
  phone: '+54 11 5555-0001',
  photoUrl: null,
  birthday: '1990-03-15',
  displayName: 'Carlos Mendez',
  createdAt: '2024-01-10T10:00:00Z',
  biography:
    'Entrenador certificado con 8 años de experiencia en hipertrofia y fuerza. Especialista en programación del entrenamiento basada en evidencia científica.',
  specialties: ['Hipertrofia', 'Fuerza', 'Recomposición corporal'],
  clientIds: ['user_client_001', 'user_client_002', 'user_client_003'],
  invitationCode: 'FIT2024',
};

// --- Clientes ---

/** Carlos como su propio cliente */
export const MOCK_CLIENT_CARLOS: ClientProfile = {
  id: 'user_client_001',
  role: 'client',
  email: 'carlos@fitcoach.com',
  phone: '+54 11 5555-0001',
  photoUrl: null,
  birthday: '1990-03-15',
  displayName: 'Carlos Mendez',
  createdAt: '2024-01-10T10:00:00Z',
  trainerId: 'user_trainer_001',
  activeProgramId: 'prog_003',
  heightCm: 178,
  weightKg: 82,
  goal: 'Mantener fuerza y masa muscular',
};

export const MOCK_CLIENT_ANA: ClientProfile = {
  id: 'user_client_002',
  role: 'client',
  email: 'ana.garcia@gmail.com',
  phone: '+54 11 5555-0002',
  photoUrl: null,
  birthday: '1995-07-22',
  displayName: 'Ana García',
  createdAt: '2024-06-01T14:30:00Z',
  trainerId: 'user_trainer_001',
  activeProgramId: 'prog_001',
  heightCm: 165,
  weightKg: 58,
  goal: 'Tonificar y ganar fuerza',
};

export const MOCK_CLIENT_LUIS: ClientProfile = {
  id: 'user_client_003',
  role: 'client',
  email: 'luis.rodriguez@gmail.com',
  phone: '+54 11 5555-0003',
  photoUrl: null,
  birthday: '1998-11-05',
  displayName: 'Luis Rodríguez',
  createdAt: '2024-08-15T09:00:00Z',
  trainerId: 'user_trainer_001',
  activeProgramId: 'prog_002',
  heightCm: 175,
  weightKg: 70,
  goal: 'Ganar masa muscular',
};

/** Cliente independiente sin trainer */
export const MOCK_CLIENT_MARIA: ClientProfile = {
  id: 'user_client_004',
  role: 'client',
  email: 'maria.lopez@gmail.com',
  phone: '+54 11 5555-0004',
  photoUrl: null,
  birthday: '1992-02-14',
  displayName: 'María López',
  createdAt: '2025-01-20T16:00:00Z',
  trainerId: null,
  activeProgramId: 'prog_default_001',
  heightCm: 160,
  weightKg: 55,
  goal: 'Mantenimiento',
};

// --- Colecciones ---

export const MOCK_USERS: User[] = [
  MOCK_TRAINER,
  MOCK_CLIENT_CARLOS,
  MOCK_CLIENT_ANA,
  MOCK_CLIENT_LUIS,
  MOCK_CLIENT_MARIA,
];

export const MOCK_USERS_MAP: Record<string, User> = Object.fromEntries(
  MOCK_USERS.map((u) => [u.id, u])
);

/** Usuario por defecto al iniciar la app (vista típica de cliente) */
export const DEFAULT_USER_ID = 'user_client_002';
