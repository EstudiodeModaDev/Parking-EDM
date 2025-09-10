import * as React from 'react';
import { useCeldas } from '../../hooks/useCeldas';
import { useSettingsHours } from '../../hooks/useSettingsHours';
import { useTodayOccupancy } from '../../hooks/useTodayOccupancy.ts';
import { deriveHoursLabels, getCurrentTurnFromHours } from '../../adapters/time.ts';
import type { SlotUI } from '../../adapters/cells';
import { useWorkers } from '../../hooks/useWorkers';

export const useAdminCells = () => {
  const c = useCeldas(); //Funciones del hook general de de celdas
  
  const s = useSettingsHours(); //Use de las configuraciones de horarios
  
  const occ = useTodayOccupancy(); //Ocupacion actual
 
  const { workers, loading: workersLoading } = useWorkers();  // colaboradores 

  // mezcla ocupación a cada fila (solo para render)
  const rowsWithOcc: (SlotUI & { __occ?: ReturnType<typeof useTodayOccupancy>['occByTurn'][number] })[] =
    c.rows.map(r => ({ ...r, __occ: occ.occByTurn[r.Id] }));

  // turno actual calculado por horarios
  const currentTurn = React.useMemo(
    () => getCurrentTurnFromHours(s.hours!),
    [s.hours]
  );

  // etiquetas de horarios (“Mañana 06:00–12:59 · Tarde 13:00–19:00”)
  const hoursLabel = React.useMemo(
    () => {
      const h = deriveHoursLabels(s.hours!);
      return `Mañana: ${h.amStart}–${h.amEnd} · Tarde: ${h.pmStart}–${h.pmEnd}`;
    },
    [s.hours]
  );

  // tarjeta de capacidad (usa turnos + ocupación)
  const capacidadAhora = React.useMemo(() => {
    const activas = rowsWithOcc.filter(r => r.Activa === 'Activa');

    const isReservedNow = (slotId: number) => {
      const f = occ.occByTurn[slotId] || {};
      if (!currentTurn) return !!(f.Manana || f.Tarde);
      return currentTurn === 'Manana' ? !!f.Manana : !!f.Tarde;
    };

    const totalCarros = activas.filter(s => s.TipoCelda === 'Carro').length;
    const ocupadosCarros = activas.filter(s => s.TipoCelda === 'Carro' && isReservedNow(s.Id)).length;
    const libresCarros = Math.max(0, totalCarros - ocupadosCarros);

    const totalMotos = activas.filter(s => s.TipoCelda === 'Moto').length;
    const ocupadosMotos = activas.filter(s => s.TipoCelda === 'Moto' && isReservedNow(s.Id)).length;
    const libresMotos = Math.max(0, totalMotos - ocupadosMotos);

    return { turno: currentTurn, totalCarros, libresCarros, totalMotos, libresMotos };
  }, [rowsWithOcc, occ.occByTurn, currentTurn]);

  // modal de detalles simple (puedes reemplazar por tu SlotDetailsModal)
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<SlotUI | null>(null);
  const openDetails = (row: SlotUI) => { setSelected(row); setOpen(true); };
  const closeDetails = () => { setSelected(null); setOpen(false); };

  // auto-refresh 5 min, pausando con visibilitychange
  React.useEffect(() => {
    const T = 5 * 60 * 1000;
    let id: number | null = null;

    const tick = () => {
      c.reloadAll();
      occ.reload();
    };

    const start = () => { if (id == null) id = window.setInterval(tick, T); };
    const stop  = () => { if (id != null) { window.clearInterval(id); id = null; } };

    if (!document.hidden) start();
    const onVis = () => (document.hidden ? stop() : (tick(), start()));
    document.addEventListener('visibilitychange', onVis);

    return () => { stop(); document.removeEventListener('visibilitychange', onVis); };
  }, [c.reloadAll, occ.reload]);

  // handlers de UI
  const onSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); c.reloadAll(); }
  };

  return {
    // base
    loading: c.loading || s.loading || occ.loading,
    error: c.error || s.error || null,
    // filas con ocupación
    rows: rowsWithOcc,
    // filtros/paginación
    search: c.search, setSearch: c.setSearch, onSearchEnter,
    tipo: c.tipo, setTipo: c.setTipo,
    itinerancia: c.itinerancia, setItinerancia: c.setItinerancia,
    pageSize: c.pageSize, setPageSize: c.setPageSize,
    pageIndex: c.pageIndex, hasNext: c.hasNext,
    nextPage: c.nextPage, prevPage: c.prevPage,
    // create
    createOpen: c.createOpen, createSaving: c.createSaving, createError: c.createError,
    createForm: c.createForm, canCreate: c.canCreate,
    openModal: c.openModal, closeModal: c.closeModal,
    setCreateForm: c.setCreateForm, create: c.create,
    // ocupación/capacidad/turnos
    occLoading: occ.loading,
    capacidadAhora,
    currentTurn,
    hoursLabel,
    // detalles
    open, selected, openDetails, closeDetails,
    workers, workersLoading,
  };
};
