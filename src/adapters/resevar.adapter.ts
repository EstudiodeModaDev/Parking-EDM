import type { TurnType, VehicleType } from "./shared";


export type ReserveArgs = {
  vehicle: VehicleType;
  turn: TurnType;        // 'Dia' => valida ambos horarios
  dateISO: string;       // 'YYYY-MM-DD'
  userEmail: string;
};

export type ReserveResult =
    |{ ok: true; message: string; reservation: any }
    |{ ok: false; message: string };