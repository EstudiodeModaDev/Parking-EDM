import * as React from 'react';
import { ReservationsService } from '../Services/ReservationsService';

type TurnFlags = { Manana?: boolean; Tarde?: boolean; PorManana?: string; PorTarde?: string };

export const useTodayOccupancy = () => {
  const [occByTurn, setOccByTurn] = React.useState<Record<number, TurnFlags>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const reload = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const todayISO = (d => {
        const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
        return `${y}-${m}-${day}`;
      })(new Date());

      const res: any = await ReservationsService.getAll({
        select: ['SpotId','Date','Status','Turn','NombreUsuario'] as any,
        top: 5000 as any,
        filter: `Date eq '${todayISO}' and (Status ne 'Cancelada')`,
      } as any);

      const items = (res?.data ?? res?.value ?? res) ?? [];
      const map: Record<number, TurnFlags> = {};

      for (const r of items) {
        const spot = Number(r?.SpotId?.Id ?? r?.SpotId ?? r?.spotId ?? r?.spotid ?? NaN);
        if (Number.isNaN(spot)) continue;

        const turnRaw = String(r?.Turn ?? '').toLowerCase();
        if (!map[spot]) map[spot] = {};

        if (turnRaw === 'manana' || turnRaw === 'mañana') {
          map[spot].Manana = true;
          map[spot].PorManana = r?.NombreUsuario ?? '';
        } else if (turnRaw === 'tarde') {
          map[spot].Tarde = true;
          map[spot].PorTarde = r?.NombreUsuario ?? '';
        } else {
          map[spot].Manana = true;
          map[spot].Tarde = true;
          map[spot].PorManana = r?.NombreUsuario ?? '';
          map[spot].PorTarde = r?.NombreUsuario ?? '';
        }
      }
      setOccByTurn(map);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo cargar ocupación');
      setOccByTurn({});
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { reload(); }, [reload]);

  return { occByTurn, loading, error, reload };
};
