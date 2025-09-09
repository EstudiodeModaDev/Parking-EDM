import type { VehicleType } from "./shared";

export type SlotUI = {
  Id: number;
  Title: string;
  TipoCelda: 'Carro' | 'Moto' | string;
  Activa: 'Activa' | 'No Activa' | string;
  Raw: any; // por si necesitas más campos luego
};

export type TurnFlags = { Manana?: boolean; Tarde?: boolean };

export type CreateForm = { Title: string; TipoCelda: VehicleType; Activa: 'Activa' | 'Inactiva'; Itinerancia: 'Empleado Fijo' | 'Empleado Itinerante' | 'Directivo' };