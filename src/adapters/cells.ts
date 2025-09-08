export type SlotUI = {
  Id: number;
  Title: string;
  TipoCelda: 'Carro' | 'Moto' | string;
  Activa: 'Activa' | 'No Activa' | string;
  Raw: any; // por si necesitas más campos luego
};

export type TurnFlags = { Manana?: boolean; Tarde?: boolean };