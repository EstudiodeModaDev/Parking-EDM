// src/hooks/useMisReservas.ts
import * as React from 'react';
import { ReservationsService } from '../Services/ReservationsService';
import type { IGetAllOptions } from '../Models/CommonModels';
import { last30Days } from '../utils/date';
import type { ReservationUI } from '../adapters/reservations';

const normalizeResult = (res: any) => {
  const ok = ('ok' in res) ? res.ok : (('success' in res) ? res.success : true);
  const data = ('value' in res) ? res.value : (('data' in res) ? res.data : res);
  return { ok, data, errorMessage: res?.errorMessage };
};

const mapToUI = (r: any): ReservationUI => {
  const dateStr = String(r.Date ?? r.date ?? r.Fecha ?? r.fecha ?? '').slice(0, 10);
  const spotId = Number(r['SpotId#Id'] ?? r.SpotId?.Id ?? r.SpotId ?? 0);
  const spotTitle = String(
    r.SpotId?.Value ??
    r['SpotId/Title'] ??
    r.Spot ??
    (spotId ? String(spotId) : '')
  );

  const ui: ReservationUI & { __UserMail?: string } = {
    Id: Number(r.ID ?? r.Id ?? r.id ?? 0),
    Date: /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? dateStr : '',
    Turn: String(r.Turn ?? r.Turno ?? r.turn ?? ''),
    SpotId: spotId,
    Spot: spotTitle,
    VehicleType: String(r.VehicleType ?? r.Vehiculo ?? r.vehicleType ?? ''),
    Status: String(r.Status ?? r.Estado ?? r.status ?? ''),
    User: String(r.NombreUsuario)
  };

  // Guardamos el mail si viene (para admins mostrar quién es)
  const mail = r.Title ?? r.title ?? r.Usuario ?? r.UserMail ?? r.Correo ?? null;
  if (mail) ui.__UserMail = String(mail);

  return ui;
};

type FilterMode = 'upcoming-active' | 'history';

export type UseMisReservasReturn = {
  rows: ReservationUI[];
  loading: boolean;
  error: string | null;

  range: { from: string; to: string };
  setRange: React.Dispatch<React.SetStateAction<{ from: string; to: string }>>;
  rangeInvalid: boolean;
  applyRange: () => void;

  pageSize: number;
  setPageSize: (n: number) => void;
  pageIndex: number;
  hasNext: boolean;
  nextPage: () => void;
  prevPage: () => void;

  reload: () => void;
  cancelReservation: (id: number) => Promise<void>;

  filterMode: FilterMode;
  setFilterMode: (m: FilterMode) => void;
};

export function useMisReservas(userMail: string, isAdmin = false): UseMisReservasReturn {
  const [allRows, setAllRows] = React.useState<ReservationUI[]>([]);
  const [filteredRows, setFilteredRows] = React.useState<ReservationUI[]>([]);
  const [rows, setRows] = React.useState<ReservationUI[]>([]);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [range, setRange] = React.useState(last30Days);
  const rangeInvalid = !range.from || !range.to || range.from > range.to;

  const [pageSize, _setPageSize] = React.useState(20);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [hasNext, setHasNext] = React.useState(false);

  // Si es admin, por defecto muestro "all", si no, "upcoming-active"
  const [filterMode, setFilterMode] = React.useState<FilterMode>('upcoming-active');

  const mailSafe = (userMail ?? '').replace(/'/g, "''");
  const today = new Date().toISOString().slice(0, 10);

  const applyClientFilter = React.useCallback((source: ReservationUI[]) => {
    let data = source;

    if (filterMode === 'upcoming-active') {
      data = source.filter(r => r.Status === 'Activa' && r.Date >= today);
    } else if (filterMode === 'history') {
      data = source.filter(r => r.Date < today );
    }

    setFilteredRows(data);

    const firstSlice = data.slice(0, pageSize);
    setRows(firstSlice);
    setPageIndex(0);
    setHasNext(data.length > pageSize);
  }, [filterMode, pageSize, today]);

  const fetchAllForRange = React.useCallback(async () => {
    if (!isAdmin && !mailSafe) {
      setAllRows([]);
      setFilteredRows([]);
      setRows([]);
      setError('No hay email de usuario para cargar las reservas.');
      return;
    }
    if (rangeInvalid) {
      setError('Rango de fechas inválido.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const MAX_FETCH = 2000;

      // construimos el filtro
      const parts: string[] = [
        `Date ge '${range.from}'`,
        `Date le '${range.to}'`,
      ];
      if (!isAdmin) {
        parts.unshift(`Title eq '${mailSafe}'`);
      }
      const filter = parts.join(' and ');

      const options: IGetAllOptions = {
        filter,
        orderBy: ['Date desc'],
        // para admins incluimos Title para mostrar quién es el dueño
        select: isAdmin
          ? (['ID','Date','Turn','SpotId','SpotId#Id','VehicleType','Status','Title', 'NombreUsuario'] as any)
          : (['ID','Date','Turn','SpotId','SpotId#Id','VehicleType','Status','Title'] as any),
        top: MAX_FETCH,
      };

      const res: any = await ReservationsService.getAll(options as any);
      const { ok, data, errorMessage } = normalizeResult(res);
      if (!ok) throw new Error(errorMessage || 'No se pudieron cargar las reservas');
      console.log(data)
      const items = Array.isArray(data) ? data : [];
      const ui = items.map(mapToUI);

      setAllRows(ui);
      applyClientFilter(ui);
    } catch (e: any) {
      console.error('[useReservations] fetchAllForRange error:', e);
      setAllRows([]);
      setFilteredRows([]);
      setRows([]);
      setError(e?.message ?? 'Error al cargar');
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, mailSafe, range.from, range.to, rangeInvalid, applyClientFilter]);

  const applyRange = React.useCallback(() => {
    if (rangeInvalid) {
      setError('El rango seleccionado es inválido. "Desde" no puede ser mayor que "Hasta".');
      return;
    }
    fetchAllForRange();
  }, [rangeInvalid, fetchAllForRange]);

  const setPageSize = React.useCallback((n: number) => {
    const size = Number.isFinite(n) && n > 0 ? Math.floor(n) : 20;
    _setPageSize(size);

    const slice = filteredRows.slice(0, size);
    setRows(slice);
    setPageIndex(0);
    setHasNext(filteredRows.length > size);
  }, [filteredRows]);

  const nextPage = React.useCallback(() => {
    if (loading) return;
    const next = pageIndex + 1;
    const start = next * pageSize;
    const end = start + pageSize;
    if (start >= filteredRows.length) return;
    setRows(filteredRows.slice(start, end));
    setPageIndex(next);
    setHasNext(end < filteredRows.length);
  }, [loading, pageIndex, pageSize, filteredRows]);

  const prevPage = React.useCallback(() => {
    if (loading || pageIndex === 0) return;
    const prev = pageIndex - 1;
    const start = prev * pageSize;
    const end = start + pageSize;
    setRows(filteredRows.slice(start, end));
    setPageIndex(prev);
    setHasNext(filteredRows.length > end);
  }, [loading, pageIndex, pageSize, filteredRows]);

  const reload = React.useCallback(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    setRows(filteredRows.slice(start, end));
    setHasNext(end < filteredRows.length);
  }, [filteredRows, pageIndex, pageSize]);

  const cancelReservation = React.useCallback(async (id: number) => {
    if (!id) {
      alert('ID de reserva inválido');
      return;
    }
    try {
      setLoading(true);
      const res: any = await ReservationsService.update(String(id), { Status: 'Cancelada' });
      const ok = ('ok' in res) ? res.ok : (('success' in res) ? res.success : true);
      if (!ok) throw new Error(res?.errorMessage || 'No se pudo cancelar la reserva');
      await fetchAllForRange();
    } catch (e: any) {
      console.error('[useReservations] cancelReservation error:', e);
      alert('No se pudo cancelar la reserva: ' + (e?.message ?? 'error desconocido'));
    } finally {
      setLoading(false);
    }
  }, [fetchAllForRange]);

  // re-filtrar cuando cambie el modo
  React.useEffect(() => {
    applyClientFilter(allRows);
  }, [filterMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // si cambia isAdmin en caliente, ajusta modo por UX (opcional)
  React.useEffect(() => {
    setFilterMode('upcoming-active');
  }, [isAdmin]);

  // Carga inicial
  React.useEffect(() => {
    let cancel = false;
    (async () => { if (!cancel) await fetchAllForRange(); })();
    return () => { cancel = true; };
  }, [fetchAllForRange]);

  return {
    rows,
    loading,
    error,

    range,
    setRange,
    rangeInvalid,
    applyRange,

    pageSize,
    setPageSize,
    pageIndex,
    hasNext,
    nextPage,
    prevPage,

    reload,
    cancelReservation,

    filterMode,
    setFilterMode,
  };
}
