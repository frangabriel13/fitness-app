// --- Modelo de Usuario ---

export type UserRole = 'trainer' | 'client';

/** Campos compartidos por todo usuario */
export interface UserBase {
  id: string;
  email: string;
  phone: string;
  photoUrl: string | null;
  birthday: string; // YYYY-MM-DD
  displayName: string;
  createdAt: string; // ISO datetime
}

/** Perfil de entrenador */
export interface TrainerProfile extends UserBase {
  role: 'trainer';
  biography: string;
  specialties: string[];
  clientIds: string[]; // IDs de ClientProfile vinculados
  invitationCode: string; // Código que comparte con clientes
  activeProgramId: string | null; // Rutina personal del entrenador
}

/** Perfil de cliente */
export interface ClientProfile extends UserBase {
  role: 'client';
  trainerId: string | null; // null = cliente independiente
  activeProgramId: string | null; // Máximo un programa activo
  heightCm: number | null;
  weightKg: number | null;
  goal: string | null; // Ej: "Ganar masa muscular"
}

/** Unión discriminada por `role` */
export type User = TrainerProfile | ClientProfile;
