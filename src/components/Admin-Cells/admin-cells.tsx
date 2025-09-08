// src/components/AdminCells/ClientList.tsx
import * as React from 'react';
import styles from './AdminCells.module.css';
import { useCeldas } from '../../hooks/useCeldas';
import { Modal } from '../Modals/modals';

import {
  fetchAssignee,
  searchUnassignedCollaborators,
  assignSlotToCollaborator,
  unassignSlotFromCollaborator,
  type Assignee,
} from '../../hooks/AsignarCeldas';
import { ReservationsService } from '../../Services/ReservationsService';

// ---- Configuración de franjas horarias ----
const AM_START = { h: 6, m: 0 };    // 06:00
const AM_END   = { h: 12, m: 59 };  // 12:59
const PM_START = { h: 13, m: 0 };   // 13:00
const PM_END   = { h: 19, m: 0 };   // 19:00

type TurnFlags = { Manana?: boolean; Tarde?: boolean; PorManana?: string; PorTarde?: string };

function isNowInRange(start: {h:number;m:number}, end: {h:number;m:number}) {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const a = start.h * 60 + start.m;
  const b = end.h * 60 + end.m;
  return mins >= a && mins <= b;
}

function getCurrentTurn(): 'Manana' | 'Tarde' | null {
  if (isNowInRange(AM_START, AM_END)) return 'Manana';
  if (isNowInRange(PM_START, PM_END)) return 'Tarde';
  return null;
}

const ClientList: React.FC = () => {
  const {
    rows, loading, error, search, tipo, pageSize, pageIndex, hasNext,
    setSearch, setTipo, setPageSize, nextPage, prevPage, reloadAll, toggleEstado,
  } = useCeldas();

  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  // Estado de asignación para el modal
  const [assignLoading, setAssignLoading] = React.useState(false);
  const [assignError, setAssignError] = React.useState<string | null>(null);
  const [assignee, setAssignee] = React.useState<Assignee>(null);

  // Buscador del picker
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [term, setTerm] = React.useState('');
  const [results, setResults] = React.useState<Assignee[]>([]);
  const [searching, setSearching] = React.useState(false);

  // Ocupación por turno para HOY: { [slotId]: { Manana?: true, Tarde?: true } }
  const [occByTurn, setOccByTurn] = React.useState<Record<number, TurnFlags>>({});
  const [occLoading, setOccLoading] = React.useState(false);

  const selected = React.useMemo(
    () => rows.find(r => r.Id === selectedId) ?? null,
    [rows, selectedId]
  );

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); reloadAll(); }
  };

  const openDetails = (id: number) => { setSelectedId(id); setOpen(true); };
  const closeDetails = () => {
    setOpen(false);
    setSelectedId(null);
    setAssignError(null);
    setAssignee(null);
    setPickerOpen(false);
    setTerm('');
    setResults([]);
  };

  // Cargar ocupación de hoy (no canceladas) y mapear por turno
  const loadTodayOccupancy = React.useCallback(async () => {
    try {
      setOccLoading(true);
      const todayISO = new Date().toISOString().slice(0, 10);
      const res: any = await ReservationsService.getAll({
        select: ['SpotId','Date','Status','Turn', 'NombreUsuario'] as any,
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

        if (turnRaw === 'manana' || turnRaw === 'mañana'){ map[spot].Manana = true; map[spot].PorManana = r.NombreUsuario}
        else if (turnRaw === 'tarde'){map[spot].Tarde = true; map[spot].PorTarde = r.NombreUsuario}
        else { // por si guardaste 'Dia'
          map[spot].Manana = true;
          map[spot].Tarde = true;
          map[spot].PorManana = r.NombreUsuario
          map[spot].PorTarde = r.NombreUsuario
        }
      }
      setOccByTurn(map);
    } catch (e) {
      console.error('[ClientList] loadTodayOccupancy error:', e);
      setOccByTurn({});
    } finally {
      setOccLoading(false);
    }
  }, []);

  React.useEffect(() => { loadTodayOccupancy(); }, [loadTodayOccupancy]);

  // Cargar asignación al abrir modal
  React.useEffect(() => {
    if (!open || !selectedId) return;
    let cancel = false;
    (async () => {
      try {
        setAssignLoading(true);
        setAssignError(null);
        const a = await fetchAssignee(selectedId);
        if (!cancel) setAssignee(a);
      } catch (e: any) {
        if (!cancel) setAssignError(e?.message ?? 'Error al cargar asignación');
      } finally {
        if (!cancel) setAssignLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [open, selectedId]);

  const doSearch = React.useCallback(async () => {
    setSearching(true);
    setAssignError(null);
    try {
      const vehicleType = selected?.TipoCelda === 'Carro' || selected?.TipoCelda === 'Moto'
        ? (selected!.TipoCelda as 'Carro' | 'Moto')
        : undefined;

      const res = await searchUnassignedCollaborators(term, vehicleType);
      setResults(res);
    } catch (e: any) {
      setAssignError(e?.message ?? 'Error buscando colaboradores');
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [term, selected]);

  const onAssign = React.useCallback(async (candidate: Assignee) => {
    if (!candidate || !selected) return;
    setAssignLoading(true);
    setAssignError(null);
    try {
      await assignSlotToCollaborator(selected.Id, candidate.id, selected.Title);
      setAssignee(candidate);
      setPickerOpen(false);
      setTerm('');
      setResults([]);
      await reloadAll();
    } catch (e: any) {
      setAssignError(e?.message ?? 'No se pudo asignar la celda');
    } finally {
      setAssignLoading(false);
    }
  }, [selected, reloadAll]);

  const onUnassign = React.useCallback(async () => {
    if (!assignee || !selected) return;
    setAssignLoading(true);
    setAssignError(null);
    try {
      await unassignSlotFromCollaborator(selected.Id);
      setAssignee(null);
      await reloadAll();
    } catch (e: any) {
      setAssignError(e?.message ?? 'No se pudo desasignar la celda');
    } finally {
      setAssignLoading(false);
    }
  }, [assignee, selected, reloadAll]);

  const onConfirmToggle = async () => {
    if (!selected) return;
    await toggleEstado(selected.Id, selected.Activa);
    await reloadAll();
  };

  // Render de badge por turno
  const renderTurnBadge = (
    activa: boolean,
    reserved: boolean,
    turnLabel: 'AM' | 'PM',
    isCurrentTurn: boolean,
    who?: string | null
  ) => {
    let cls = styles.badge;
    let text = 'Disponible';

    if (!activa) { cls = `${styles.badge} ${styles.badgeInactive}`; text = 'Inactiva'; }
    else if (reserved) {
      if (isCurrentTurn) { cls = `${styles.badge} ${styles.badgeInUse}`; text = 'En uso'; }
      else { cls = `${styles.badge} ${styles.badgeReserved}`; text = 'Reservada'; }
    } else { cls = `${styles.badge} ${styles.badgeFree}`; text = 'Disponible'; }

    return <span className={cls}>
      <span className={styles.badgeLine}>{turnLabel}: {text}  </span>
      {who && <small className={styles.badgeWho}>{who}</small>}
    </span>
  };

  return (
    <section className={styles.wrapper}>
      <h3 className={styles.h3}>Listado de celdas</h3>

      {/* Filtros */}
      <div className={styles.filtersBar}>
        <div className={styles.pageSizeBox}>
          <span>Tipo de celda</span>
          <select
            className={styles.pageSizeSelect}
            value={tipo}
            onChange={(e) => setTipo(e.target.value as 'all' | 'Carro' | 'Moto')}
            disabled={loading}
          >
            <option value="all">Todas</option>
            <option value="Carro">Carro</option>
            <option value="Moto">Moto</option>
          </select>
        </div>

        <div className={styles.searchBox}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar por código…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onSearchKeyDown}
          />
        </div>

        <div className={styles.pageSizeBox}>
          <span>Registros por página</span>
          <select
            className={styles.pageSizeSelect}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value) || 20)}
            disabled={loading}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {loading && <div style={{ marginTop: 8 }}>Cargando…</div>}
      {error && <div style={{ marginTop: 8, color: 'crimson' }}>{error}</div>}

      {!loading && !error && (
        <>
          {rows.length === 0 ? (
            <div className={styles.emptyGrid}>Sin resultados.</div>
          ) : (
            <ul className={styles.cardGrid}>
              {rows.map(r => {
                const activa = r.Activa === 'Activa';
                const occ = occByTurn[r.Id] || {};
                const amReserved = !!occ.Manana;
                const pmReserved = !!occ.Tarde;

                const amBadge = renderTurnBadge(
                  activa, amReserved, 'AM', (getCurrentTurn() === 'Manana') && amReserved, occ.PorManana
                );

                const pmBadge = renderTurnBadge(
                  activa, pmReserved, 'PM', (getCurrentTurn() === 'Tarde') && pmReserved, occ.PorTarde
                );

                return (
                  <li key={r.Id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div className={styles.celdaTitle}>
                        <span className={styles.cardCode}>{r.Title}</span>
                        <br />
                        <span className={styles.metaLabel}>Tipo: {r.TipoCelda}</span>
                      </div>
                      <button className={styles.btnPrimary} onClick={() => openDetails(r.Id)} disabled={loading || occLoading}> {/*Boton detalles*/}
                        Detalles
                      </button>
                      <div className={styles.badgeGroup}>
                        {amBadge}
                        {pmBadge}
                      </div>
                    </div>

                  </li>
                );
              })}
            </ul>
          )}

          <div className={styles.paginationBar}>
            <button className={styles.pageBtn} onClick={prevPage} disabled={loading || pageIndex === 0}>
              ← Anterior
            </button>
            <span className={styles.pageInfo}>Página {pageIndex + 1}</span>
            <button className={styles.pageBtn} onClick={nextPage} disabled={loading || !hasNext}>
              Siguiente →
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      <Modal
        open={open}
        title="Detalle de celda"
        onClose={closeDetails}
        onConfirm={onConfirmToggle}
        confirmText={selected?.Activa === 'Activa' ? 'Desactivar celda' : 'Activar celda'}
        cancelText="Cerrar"
      >
        {selected ? (
          <div style={{ display: 'grid', gap: 12, fontSize: 14 }}>
            <div><strong>Código:</strong> {selected.Title}</div>
            <div><strong>Tipo:</strong> {selected.TipoCelda}</div>
            <div>
              <strong>Estado:</strong>{' '}
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontSize: 12,
                  background: selected.Activa === 'Activa' ? '#dcfce7' : '#fee2e2',
                  color: selected.Activa === 'Activa' ? '#166534' : '#991b1b',
                }}
              >
                {selected.Activa}
              </span>
            </div>

            <hr style={{ border: 0, borderTop: '1px solid #e5e7eb' }} />

            <div>
              <h4 style={{ margin: '4px 0 8px' }}>Asignación</h4>
              {assignLoading && <div className={styles.muted}>Cargando…</div>}
              {assignError && <div className={styles.error}>{assignError}</div>}

              {!assignLoading && (
                <>
                  {assignee ? (
                    <div className={styles.assignedRow}>
                      <div>
                        <div><strong>Asignado a:</strong> {assignee.name}</div>
                        {assignee.email && <div className={styles.muted}>{assignee.email}</div>}
                      </div>
                      <button className={styles.btnDanger} onClick={onUnassign} disabled={assignLoading}>
                        Desasignar
                      </button>
                    </div>
                  ) : (
                    <div className={styles.assignedRow}>
                      <div className={styles.muted}>
                        {selected?.Activa === 'Activa' ? 'Sin asignación' : 'La celda está inactiva'}
                      </div>
                      <button
                        className={styles.btnPrimary}
                        onClick={() => setPickerOpen(true)}
                        disabled={assignLoading || selected?.Activa !== 'Activa'}
                        title={selected?.Activa !== 'Activa' ? 'Activa la celda para asignar' : undefined}
                      >
                        Asignar
                      </button>
                    </div>
                  )}
                </>
              )}

              {pickerOpen && (
                <div className={styles.pickerPanel}>
                  <div className={styles.pickerHeader}>
                    <input
                      className={styles.searchInput}
                      placeholder="Buscar colaborador (nombre o correo)…"
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                    />
                    <button className={styles.btnPrimary} onClick={doSearch} disabled={searching}>
                      {searching ? 'Buscando…' : 'Buscar'}
                    </button>
                    <button
                      className={styles.btnGhost}
                      onClick={() => { setPickerOpen(false); setTerm(''); setResults([]); }}
                    >
                      Cerrar
                    </button>
                  </div>

                  <ul className={styles.resultList}>
                    {results.length === 0 && !searching && <li className={styles.muted}>Sin resultados</li>}
                    {results.map(c => (
                      <li key={c?.id} className={styles.resultItem}>
                        <div>
                          <div className={styles.resultName}>{c?.name}</div>
                          {c?.email && <div className={styles.resultEmail}>{c.email}</div>}
                        </div>
                        <button className={styles.btnPrimary} onClick={() => onAssign(c)} disabled={assignLoading}>
                          Asignar
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>Cargando…</div>
        )}
      </Modal>
    </section>
  );
};

export default ClientList;
