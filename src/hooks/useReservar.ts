import * as React from 'react';
import { SettingsService } from '../Services/SettingsService';
import { ReservationsService } from '../Services/ReservationsService';
import { ParkingSlotsService } from '../Services/ParkingSlotsService';
import { MicrosoftTeamsService } from '../Services/MicrosoftTeamsService';
import { addDays } from '../utils/date';

import type { IGetAllOptions } from '../Models/CommonModels';
import type { ReserveArgs, ReserveResult } from '../adapters/resevar.adapter';
import type { TurnType } from '../adapters/shared';
import type { DynamicPostMessageRequest } from '../Models/MicrosoftTeamsModel';

export type UseReservarReturn = {
  maxDate: Date | null;
  minDate: Date | null;
  loading: boolean;
  error: string | null;
  reservar: (args: ReserveArgs) => Promise<ReserveResult>;
};

type UseReservarOptions = {
  /** Se ejecuta tras crear la(s) reserva(s) con éxito (útil para recargar Mis Reservas) */
  onAfterReserve?: () => void | Promise<void>;
};

const MOTO_CAPACITY = 4 as const;

const nameFromEmail = (mail?: string) =>
  (mail?.split('@')[0] ?? 'Usuario')
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

export function useReservar(userMail: string, userName: string, opts?: UseReservarOptions): UseReservarReturn {
  const [maxDate, setMaxDate] = React.useState<Date | null>(null);
  const [minDate, setMinDate] = React.useState<Date | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Ventana de fechas visibles (Settings.VisibleDays)
  React.useEffect(() => {
    const hoy = new Date();
    (async () => {
      try {
        setLoading(true);
        const res = await SettingsService.get('1');
        const days: number = res?.data?.VisibleDays ?? 3;
        setMaxDate(addDays(hoy, days));
        setMinDate(hoy);
      } catch (err: any) {
        setError(err?.message ?? 'Error cargando configuración');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Notificación por Teams
  const notifyReservation = React.useCallback(
    async (slot: string, dateReserve: string, turnLabel: string, username: string, userEmail: string, vehicleType: string) => {
      const body: DynamicPostMessageRequest = {
        recipient: userEmail,
        messageBody: 
            `Reserva confirmada,
            Hola ${username} tu reserva ha sido creada.
            Fecha: ${dateReserve}. 
            Celda: ${slot}.
            Vehículo: ${vehicleType}.
            Horario: ${turnLabel}.`,
      };
      return MicrosoftTeamsService.PostMessageToConversation(body, 'Flow Bot', 'Chat with Flow bot');
    },
    []
  );


  const countReservations = React.useCallback(async (
    slotId: number | string,
    dateISO: string,
    turn: Exclude<TurnType, 'Dia'>
  ) => {
    const options: IGetAllOptions = {
      filter:
        `SpotId eq ${slotId} and ` +
        `Date eq '${dateISO}' and ` +
        `Turn eq '${turn}' and ` +
        `(Status ne 'Cancelada')`,
    };
    const r = await ReservationsService.getAll(options as any);
    const rows = (r as any)?.data ?? (r as any)?.value ?? [];
    return Array.isArray(rows) ? rows.length : 0;
  }, []);

  const reservar = React.useCallback(async ({ vehicle, turn, dateISO }: ReserveArgs): Promise<ReserveResult> => {
    // 1) Traer celdas activas por tipo
    const slotsRes = await ParkingSlotsService.getAll({
      filter: `(Activa eq 'Activa' or Activa eq true) and TipoCelda eq '${vehicle}'`,
    } as any);

    const slots = (slotsRes as any)?.data ?? (slotsRes as any)?.value ?? [];
    if (!Array.isArray(slots) || slots.length === 0) {
      return { ok: false, message: `No existen celdas activas para ${vehicle}.` };
    }

    // 2) Turnos a validar
    const turnsToCheck: Exclude<TurnType, 'Dia'>[] =
      turn === 'Dia' ? ['Manana', 'Tarde'] : [turn as Exclude<TurnType, 'Dia'>];

    for (const slot of slots) {
      const slotId = slot.ID ?? slot.Id ?? slot.id;
      if (slotId == null) continue;

      // 3) Validar cupo por turno
      let available = true;
      for (const t of turnsToCheck) {
        const count = await countReservations(slotId, dateISO, t);
        if (vehicle === 'Carro') {
          if (count >= 1) { available = false; break; }
        } else {
          if (count >= MOTO_CAPACITY) { available = false; break; }
        }
      }
      if (!available) continue;

      // 4) Crear la(s) reserva(s)
      const turnsToCreate =
        (turn === 'Dia' ? (['Manana', 'Tarde'] as const) : [turn]) as readonly Exclude<TurnType, 'Dia'>[];

      try {
        let lastCreated: any = null;

        for (const t of turnsToCreate) {
          const payload = {
            Title: userMail,
            Date: dateISO,
            Turn: t,
            SpotId: { Id: Number(slotId) }, // Lookup
            VehicleType: vehicle,
            Status: 'Activa',
            NombreUsuario: userName
          };

          const createRes = await ReservationsService.create(payload as any);
          const created = (createRes as any)?.data ?? (createRes as any)?.value ?? createRes;
          lastCreated = created;
        }

        // Refrescar listas en el consumidor si corresponde
        await opts?.onAfterReserve?.();

        // Datos para mensaje / retorno
        const code = slot.Title ?? slot.Code ?? slot.Name ?? slotId;
        const turnLabel =
          turn === 'Dia'
            ? 'Día completo'
            : turnsToCreate.length === 1
              ? String(turnsToCreate[0])
              : 'Mañana y Tarde';

        // Notificar por Teams
        const username = nameFromEmail(userMail);
        try {
          await notifyReservation(String(code), dateISO, turnLabel, username, userMail, vehicle);
        } catch (e) {
          // No cortar el flujo por un fallo de notificación
          console.warn('[useReservar] Teams notification failed:', e);
        }

        const successMsg =
          turn === 'Dia'
            ? `Reserva de día completo creada en celda ${code} para ${dateISO}.`
            : `Reserva creada en celda ${code} para ${dateISO} (${turn}).`;

        return { ok: true, message: successMsg, reservation: lastCreated };
      } catch {
        // Si falla este slot, intentamos con el siguiente
        continue;
      }
    }

    // 5) Si ningún slot tuvo cupo
    const turnoTexto = turn === 'Dia' ? 'día completo' : String(turn).toLowerCase();
    return { ok: false, message: `No hay parqueaderos disponibles para ${vehicle} el ${dateISO} en ${turnoTexto}.` };
  }, [countReservations, userMail, opts, notifyReservation]);

  return {
    minDate,
    maxDate,
    loading,
    error,
    reservar,
  };
}
