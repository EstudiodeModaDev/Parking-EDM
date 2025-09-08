import * as React from 'react';
import { ColaboradoresFijosService } from '../Services/ColaboradoresFijosService';
import type { IGetAllOptions } from '../Models/CommonModels';
import type { Collaborator, NewCollaborator } from '../adapters/colaboradores';
import { normalizeResult } from './utils';
import type { ColaboradoresFijos } from '../Models/ColaboradoresFijosModel';

const mapToCollaborator = (r: any): Collaborator => ({
  id: Number(r.ID ?? r.Id ?? r.id ?? 0),
  nombre: String(r.Title ?? r.title ?? ''),
  correo: String(r.Correo ?? r.correo ?? '-'),
  tipoVehiculo: (r.Tipodevehiculo ?? r.tipoVehiculo) as any,
  placa: String(r.Placa ?? r.placa ?? ''),
  CodigoCelda: String(r.CodigoCelda)
});

export type UseCollaboratorsReturn = {
  rows: Collaborator[];
  loading: boolean;
  error: string | null;

  search: string;
  setSearch: (s: string) => void;

  pageSize: number;
  setPageSize: (n: number) => void;
  pageIndex: number;
  hasNext: boolean;
  nextPage: () => void;
  prevPage: () => void;

  reloadAll: () => Promise<void>;
  addCollaborator: (c: NewCollaborator) => Promise<void>;
  deleteCollaborator: (id: string) => Promise<void>
};

export function useCollaborators(): UseCollaboratorsReturn {
    const [allRows, setAllRows] = React.useState<Collaborator[]>([]);
    const [rows, setRows] = React.useState<Collaborator[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [search, setSearch] = React.useState('');
    const [pageSize, _setPageSize] = React.useState(20);
    const [pageIndex, setPageIndex] = React.useState(0);
    const [hasNext, setHasNext] = React.useState(false);

    const deleteCollaborator = React.useCallback(async (id: string | number): Promise<void> => {
        if (!id) return;
        try {
            setLoading(true);
            setError(null);
            await ColaboradoresFijosService.delete(String(id));
            

            setAllRows(prevAll => {
                const nextAll = prevAll.filter(r => String(r.id) !== String(id));
                // recalcular la página actual de forma segura
                const start = Math.min(pageIndex * pageSize, Math.max(0, nextAll.length - 1));
                const clampedStart = Math.floor(start / pageSize) * pageSize; // por si quedó fuera de rango
                setRows(nextAll.slice(clampedStart, clampedStart + pageSize));
                setPageIndex(clampedStart / pageSize);
                setHasNext(clampedStart + pageSize < nextAll.length);
                return nextAll;
            });
        } catch (e: any) {
            console.error('[deleteCollaborator] error:', e);
            setError(e?.message ?? 'Error al eliminar colaborador');
            throw e; // re-lanza si el caller quiere manejarlo
        } finally {
            setLoading(false);
        }
    }, [pageIndex, pageSize]);


  const addCollaborator = React.useCallback(async (c: NewCollaborator) => {
    try {
      setLoading(true);

      const newCollab: ColaboradoresFijos = {
        Title: c.nombre,
        Correo: c.correo,
        Tipodevehiculo: c.tipoVehiculo,
        Placa: c.placa,
        //SpotAsignado: c.IdSpot,
        CodigoCelda: c.codigoCelda
      };

      const res: any = await ColaboradoresFijosService.create(newCollab as any);
      const { ok, data, errorMessage } = normalizeResult(res);
      if (!ok) throw new Error(errorMessage || 'No se pudo crear el colaborador');

      const created = Array.isArray(data) ? data[0] : data;

      const ui: Collaborator = created
        ? {
            id: Number(created.ID ?? created.Id ?? created.id ?? Date.now()),
            nombre: String(created.Title ?? c.nombre),
            correo: String(created.Correo ?? c.correo),
            tipoVehiculo: (created.Tipodevehiculo ?? c.tipoVehiculo) as any,
            placa: String(created.Placa ?? c.placa),
          }
        : {
            id: Date.now(),
            nombre: c.nombre,
            correo: c.correo,
            tipoVehiculo: c.tipoVehiculo as any,
            placa: c.placa,
          };


      setAllRows(prev => {
        const nextAll = [ui, ...prev];
        // Mantén la página 0 coherente con el nuevo arreglo
        setRows(nextAll.slice(0, pageSize));
        setHasNext(nextAll.length > pageSize);
        setPageIndex(0);
        return nextAll;
      });
    } catch (e: any) {
      console.error('[useCollaborators] addCollaborator error:', e);
      setError(e?.message ?? 'No se pudo agregar el colaborador');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  const reloadAll = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const MAX_FETCH = 2000;

      const term = search.trim();
      const options: IGetAllOptions = {
        top: MAX_FETCH as any,
        // opcional: select/orderBy si tu servicio lo soporta
        // select: ['ID','Title','Correo','Tipodevehiculo','Placa'] as any,
        // orderBy: ['Title asc'] as any,
      };
      if (term) {
        const termSafe = term.replace(/'/g, "''");
        (options as any).filter = `substringof('${termSafe}', Title)`;
      }

      const res: any = await ColaboradoresFijosService.getAll(options);
      const { ok, data, errorMessage } = normalizeResult(res);
      if (!ok) throw new Error(errorMessage || 'No se pudieron cargar los colaboradores');

      const items = Array.isArray(data) ? data : [];
      const ui = items.map(mapToCollaborator);

      setAllRows(ui);
      setRows(ui.slice(0, pageSize));
      setPageIndex(0);
      setHasNext(ui.length > pageSize);
    } catch (e: any) {
      console.error('[useCollaborators] reloadAll error:', e);
      setAllRows([]);
      setRows([]);
      setError(e?.message ?? 'Error al cargar colaboradores');
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }, [search, pageSize]);

  const setPageSize = React.useCallback((n: number) => {
    const size = Number.isFinite(n) && n > 0 ? Math.floor(n) : 20;
    _setPageSize(size);
    const slice = allRows.slice(0, size);
    setRows(slice);
    setPageIndex(0);
    setHasNext(allRows.length > size);
  }, [allRows]);

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

  const prevPage = React.useCallback(() => {
    if (loading || pageIndex === 0) return;
    const prev = pageIndex - 1;
    const start = prev * pageSize;
    const end = start + pageSize;
    setRows(allRows.slice(start, end));
    setPageIndex(prev);
    setHasNext(allRows.length > end);
  }, [loading, pageIndex, pageSize, allRows]);

  React.useEffect(() => {
    let cancel = false;
    (async () => { if (!cancel) await reloadAll(); })();
    return () => { cancel = true; };
  }, [reloadAll]);

  return {
    rows,
    loading,
    error,

    search,
    setSearch,

    pageSize,
    setPageSize,
    pageIndex,
    hasNext,
    nextPage,
    prevPage,

    reloadAll,
    addCollaborator,
    deleteCollaborator
  };
}
