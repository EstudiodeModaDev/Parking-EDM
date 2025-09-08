import * as React from 'react';
import { ParkingSlotsService } from '../Services/ParkingSlotsService';
import type { IGetAllOptions } from '../Models/CommonModels';
import type { SlotUI } from '../adapters/cells';
import { normalizeResult } from './utils';
import { ColaboradoresFijosService } from '../Services/ColaboradoresFijosService';

const mapToUI = (r: any): SlotUI => ({
  Id: Number(r.ID ?? r.Id ?? r.id ?? 0),
  Title: String(r.Title ?? r.title ?? ''),
  TipoCelda: (r.TipoCelda ?? r.tipoCelda ?? '-') as any,
  Activa: (r.Activa ?? r.estado ?? '-') as any,
  Raw: r,
});

export type UseParkingSlotsReturn = {
  rows: SlotUI[];
  loading: boolean;
  error: string | null;

  // búsqueda, filtro y paginación en cliente
  search: string;
  setSearch: (s: string) => void;

  tipo: 'all' | 'Carro' | 'Moto';
  setTipo: (t: 'all' | 'Carro' | 'Moto') => void;

  pageSize: number;
  setPageSize: (n: number) => void;
  pageIndex: number;
  hasNext: boolean;
  nextPage: () => void;
  prevPage: () => void;

  // acciones
  reloadAll: () => Promise<void>;
  toggleEstado: (slotId: number, currentStatus: 'Activa' | 'No Activa' | string) => Promise<void>;
  getUnassignedSlots: () => Promise<SlotUI[]>;
};

export function useCeldas(): UseParkingSlotsReturn {
  const [allRows, setAllRows] = React.useState<SlotUI[]>([]);
  const [rows, setRows] = React.useState<SlotUI[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // búsqueda (por Title), filtro por tipo y paginación
  const [search, setSearch] = React.useState('');
  const [tipo, setTipo] = React.useState<'all' | 'Carro' | 'Moto'>('all');

  const [pageSize, _setPageSize] = React.useState(20);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [hasNext, setHasNext] = React.useState(false);

  // Trae TODO (aplicando filtros de servidor) y pagina en cliente
  const reloadAll = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const MAX_FETCH = 2000;

      const term = search.trim();
      const options: IGetAllOptions = {
        orderBy: ['Title asc'] as any,
        top: MAX_FETCH as any,
      };

      // Construir filtro OData
      const filters: string[] = [];
      if (term) {
        const termSafe = term.replace(/'/g, "''");
        filters.push(`substringof('${termSafe}', Title)`);
      }
      if (tipo !== 'all') {
        filters.push(`TipoCelda eq '${tipo}'`);
      }
      if (filters.length) {
        (options as any).filter = filters.join(' and ');
      }

      const res: any = await ParkingSlotsService.getAll(options);
      const { ok, data, errorMessage } = normalizeResult(res);
      if (!ok) throw new Error(errorMessage || 'No se pudieron cargar las celdas');

      const items = Array.isArray(data) ? data : [];
      const ui = items.map(mapToUI);

      setAllRows(ui);

      // Primera página
      const firstSlice = ui.slice(0, pageSize);
      setRows(firstSlice);
      setPageIndex(0);
      setHasNext(ui.length > pageSize);
    } catch (e: any) {
      console.error('[useParkingSlotsCSR] reloadAll error:', e);
      setAllRows([]);
      setRows([]);
      setError(e?.message ?? 'Error al cargar celdas');
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }, [search, pageSize, tipo]);

  // Cambiar tamaño de página (cliente)
  const setPageSize = React.useCallback((n: number) => {
    const size = Number.isFinite(n) && n > 0 ? Math.floor(n) : 20;
    _setPageSize(size);
    const slice = allRows.slice(0, size);
    setRows(slice);
    setPageIndex(0);
    setHasNext(allRows.length > size);
  }, [allRows]);

  // Siguiente página (cliente)
  const nextPage = React.useCallback(() => {
    if (loading) return;
    const next = pageIndex + 1;
    const start = next * pageSize;
    const end = start + pageSize;
    if (start >= allRows.length) return;
    setRows(allRows.slice(start, end));
    setPageIndex(next);
    setHasNext(end < allRows.length);
  }, [loading, pageIndex, pageSize, allRows]);

  // Página anterior (cliente)
  const prevPage = React.useCallback(() => {
    if (loading || pageIndex === 0) return;
    const prev = pageIndex - 1;
    const start = prev * pageSize;
    const end = start + pageSize;
    setRows(allRows.slice(start, end));
    setPageIndex(prev);
    setHasNext(allRows.length > end);
  }, [loading, pageIndex, pageSize, allRows]);

  // Toggle de estado in-place + persistencia
  const toggleEstado = React.useCallback(async (slotId: number, currentStatus: 'Activa' | 'No Activa' | string) => {
    if (!slotId) { alert('ID inválido'); return; }
    try {
      setLoading(true);
      const nuevo: 'Activa' | 'No Activa' = currentStatus === 'Activa' ? 'No Activa' : 'Activa';

      const res: any = await ParkingSlotsService.update(String(slotId), { Activa: nuevo } as any);
      const ok = ('ok' in res) ? res.ok : (('success' in res) ? res.success : true);
      if (!ok) throw new Error(res?.errorMessage || 'No se pudo actualizar el estado');

      setAllRows(prev => prev.map(r => r.Id === slotId ? { ...r, Activa: nuevo } : r));
      setRows(prev => prev.map(r => r.Id === slotId ? { ...r, Activa: nuevo } : r));
    } catch (e: any) {
      console.error('[useParkingSlotsCSR] toggleEstado error:', e);
      alert(e?.message ?? 'No se pudo actualizar el estado');
    } finally {
      setLoading(false);
    }
  }, []);

  const mapSlotToUI = (r: any): SlotUI => ({
    Id: Number(r.ID ?? r.Id ?? r.id ?? 0),
    Title: String(r.Title ?? r.title ?? ''),
    TipoCelda: (r.TipoCelda ?? r.tipoCelda ?? '-') as any,
    Activa: (r.Activa ?? r.estado ?? '-') as any,
    Raw: r,
  });

  const norm = (s: unknown) => String(s ?? '').trim().toUpperCase();

  const getUnassignedSlots = React.useCallback(async (): Promise<SlotUI[]> => {
    const slotsRes: any = await ParkingSlotsService.getAll({
      select: ['ID','Title','TipoCelda','Activa'] as any,
      orderBy: ['Title asc'] as any,
      top: 2000 as any,
      filter: `Activa eq 'Activa'`,
    });
    const { ok: okSlots, data: dataSlots, errorMessage: errSlots } = normalizeResult(slotsRes);
    if (!okSlots) throw new Error(errSlots || 'No se pudieron cargar las celdas');
    const slots: SlotUI[] = (Array.isArray(dataSlots) ? dataSlots : []).map(mapSlotToUI);

    const collRes: any = await ColaboradoresFijosService.getAll({
      select: ['ID','SpotAsignado','CodigoCelda'] as any,
      top: 2000 as any,
    });
    const { ok: okColl, data: dataColl, errorMessage: errColl } = normalizeResult(collRes);
    if (!okColl) throw new Error(errColl || 'No se pudieron cargar colaboradores');

    const assignedCodes = new Set<string>(
      (Array.isArray(dataColl) ? dataColl : [])
        .map((r: any) => norm(r.Celda ?? r.CodigoCelda ?? r.CeldaCodigo ?? r.CeldaTitle))
        .filter(Boolean)
    );

    return slots.filter(s => !assignedCodes.has(norm(s.Title)));
  }, []);

  // Carga inicial
  React.useEffect(() => {
    let cancel = false;
    (async () => { if (!cancel) await reloadAll(); })();
    return () => { cancel = true; };
  }, [reloadAll]);

  // Recargar automáticamente al cambiar el filtro de tipo
  React.useEffect(() => {
    reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  return {
    rows,
    loading,
    error,

    search,
    setSearch,

    tipo,
    setTipo,

    pageSize,
    setPageSize,
    pageIndex,
    hasNext,
    nextPage,
    prevPage,

    reloadAll,
    toggleEstado,
    getUnassignedSlots
  };
}
