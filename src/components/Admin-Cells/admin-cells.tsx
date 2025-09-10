import * as React from 'react';
import styles from './AdminCells.module.css';
import { useCeldas } from '../../hooks/useCeldas';
import { Modal } from '../Modals/modals';
import SlotDetailsModal from './SlotDetailsModal';
import { fetchAssignee, type Assignee } from '../../hooks/AsignarCeldas';
import { ReservationsService } from '../../Services/ReservationsService';
import type { SlotUI } from '../../adapters/cells';
import { useWorkers } from '../../hooks/useWorkers';

// ---- Configuración de franjas horarias ----
const AM_START = { h: 6, m: 0 };    // 06:00
const AM_END   = { h: 12, m: 59 };  // 12:59
const PM_START = { h: 13, m: 0 };   // 13:00
const PM_END   = { h: 19, m: 0 };   // 19:00

type TurnFlags = { Manana?: boolean; Tarde?: boolean; PorManana?: string; PorTarde?: string };

// Verificar si está dentro del rango
function isNowInRange(start: {h:number;m:number}, end: {h:number;m:number}) {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const a = start.h * 60 + start.m;
  const b = end.h * 60 + end.m;
  return mins >= a && mins <= b;
}

// Turno actual
function getCurrentTurn(): 'Manana' | 'Tarde' | null {
  if (isNowInRange(AM_START, AM_END)) return 'Manana';
  if (isNowInRange(PM_START, PM_END)) return 'Tarde';
  return null;
}

const ClientList: React.FC = () => {
  const {
    rows, loading, error, search, tipo, pageSize, pageIndex, hasNext, createOpen, createSaving, createError, createForm, canCreate,
    setSearch, setTipo, setPageSize, nextPage, prevPage, reloadAll, setCreateForm, openModal, closeModal, create,
  } = useCeldas();

  const { workers, loading: workersLoading } = useWorkers();

  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  // Estado de asignación para el modal
  const [assignLoading, setAssignLoading] = React.useState(false);
  const [assignError, setAssignError] = React.useState<string | null>(null);
  const [assignee, setAssignee] = React.useState<Assignee>(null);

  // Buscador del picker
  const [results, setResults] = React.useState<Assignee[]>([]);

  console.log(assignLoading, assignError, assignee, results)

  const [selected, setSelected] = React.useState<SlotUI | null>(null);

  // Ocupación por turno para HOY: { [slotId]: { Manana?: true, Tarde?: true } }
  const [occByTurn, setOccByTurn] = React.useState<Record<number, TurnFlags>>({});
  const [occLoading, setOccLoading] = React.useState(false);

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); reloadAll(); }
  };

  const openDetails = (row: SlotUI) => { setSelected(row); setOpen(true); setSelectedId(row.Id); };
  const closeDetails = () => {
    setOpen(false);
    setSelectedId(null);
    setAssignError(null);
    setAssignee(null);
    setResults([]);
  };

  // Cargar ocupación de HOY (no canceladas) y mapear por turno
  const loadTodayOccupancy = React.useCallback(async () => {
    try {
      setOccLoading(true);
      const todayISO = new Date().toISOString().slice(0, 10);
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
          // por si guardaste 'Dia'
          map[spot].Manana = true;
          map[spot].Tarde = true;
          map[spot].PorManana = r?.NombreUsuario ?? '';
          map[spot].PorTarde = r?.NombreUsuario ?? '';
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

  // ---- Tarjeta de capacidad "hoy" (1 moto = 1 celda) usando turno actual ----
  const capacidadAhora = React.useMemo(() => {
    const activas = rows.filter(r => r.Activa === 'Activa');
    const current = getCurrentTurn(); // 'Manana' | 'Tarde' | null

    const isReservedNow = (slotId: number) => {
      const f = occByTurn[slotId] || {};
      if (!current) {
        // fuera de horario: ocupada si tuvo reserva en cualquiera de los turnos de hoy
        return !!(f.Manana || f.Tarde);
      }
      return current === 'Manana' ? !!f.Manana : !!f.Tarde;
    };

    // Carros
    const totalCarros = activas.filter(s => s.TipoCelda === 'Carro').length;
    const ocupadosCarros = activas.filter(s => s.TipoCelda === 'Carro' && isReservedNow(s.Id)).length;
    const libresCarros = Math.max(0, totalCarros - ocupadosCarros);

    // Motos (1 slot = 1 moto)
    const totalMotos = activas.filter(s => s.TipoCelda === 'Moto').length;
    const ocupadosMotos = activas.filter(s => s.TipoCelda === 'Moto' && isReservedNow(s.Id)).length;
    const libresMotos = Math.max(0, totalMotos - ocupadosMotos);

    return {
      turno: current, // 'Manana' | 'Tarde' | null
      totalCarros, libresCarros,
      totalMotos, libresMotos
    };
  }, [rows, occByTurn]);

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
      <span className={styles.badgeLine}>{turnLabel}: {text}</span>
      {who && <small className={styles.badgeWho}>{who}</small>}
    </span>
  };

  return (
    <section className={styles.wrapper}>
      <h3 className={styles.h3}>Listado de celdas</h3>

      {/* Tarjeta de capacidad hoy */}
      <div className={styles.capacityCard}>
        <div className={styles.capacityHeader}>
          <strong>Capacidad hoy</strong>
          <span className={styles.turnPill}>
            {capacidadAhora.turno === 'Manana'
              ? 'Turno actual: AM'
              : capacidadAhora.turno === 'Tarde'
              ? 'Turno actual: PM'
              : 'Fuera de horario'}
          </span>
        </div>

        <div className={styles.capacityGrid}>
          <div className={styles.capacityItem}>
            <div className={styles.capacityLabel}>Carros disponibles</div>
            <div className={styles.capacityValue}>
              {capacidadAhora.libresCarros}
              <span className={styles.capacityTotal}>/ {capacidadAhora.totalCarros}</span>
            </div>
          </div>

          <div className={styles.capacityItem}>
            <div className={styles.capacityLabel}>Motos disponibles</div>
            <div className={styles.capacityValue}>
              {capacidadAhora.libresMotos}
              <span className={styles.capacityTotal}>/ {capacidadAhora.totalMotos}</span>
            </div>
            <div className={styles.capacityNote}>(motos cuentan 1 por celda)</div>
          </div>
        </div>
      </div>

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
            onChange={(e) => setPageSize(Number(e.target.value) || 50)}
            disabled={loading}
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className={styles.actionsRight}>
          <button
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnAdd}`}
            onClick={openModal}
            disabled={loading}
          >
            Añadir celda
          </button>
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
                        <br />
                        <span className={styles.metaLabel}>Itinerancia: {r.Itinerancia}</span>
                      </div>
                      <button className={styles.btnLink} onClick={() => openDetails(r)} disabled={loading || occLoading}>
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

      {/* Modal de creación de celda */}
      <Modal
        open={createOpen}
        title="Añadir celda"
        onClose={closeModal}
        onConfirm={create}
        confirmText={createSaving ? 'Creando…' : 'Crear'}
        cancelText="Cancelar"
      >
        <div style={{ display: 'grid', gap: 12, fontSize: 14 }}>
          {createError && (
            <div style={{ color: 'crimson', fontSize: 13 }}>{createError}</div>
          )}

          <label style={{ display: 'grid', gap: 6 }}>
            <span><strong>Código del celda</strong></span>
            <input
              className={styles.searchInput}
              value={createForm.Title}
              onChange={(e) => setCreateForm(f => ({ ...f, Title: e.target.value }))}
              placeholder="Ej: A-02"
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span><strong>Tipo de celda</strong></span>
            <select
              className={styles.pageSizeSelect}
              value={createForm.TipoCelda}
              onChange={(e) => setCreateForm(f => ({ ...f, TipoCelda: e.target.value as 'Carro' | 'Moto' }))}
            >
              <option value="Carro">Carro</option>
              <option value="Moto">Moto</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span><strong>Estado</strong></span>
            <select
              className={styles.pageSizeSelect}
              value={createForm.Activa}
              onChange={(e) => setCreateForm(f => ({ ...f, Activa: e.target.value as 'Activa' | 'Inactiva' }))}
            >
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span><strong>Itinerancia</strong></span>
            <select
              className={styles.pageSizeSelect}
              value={createForm.Itinerancia}
              onChange={(e) => setCreateForm(f => ({
                ...f,
                Itinerancia: e.target.value as 'Empleado Fijo' | 'Empleado Itinerante' | 'Directivo'
              }))}
            >
              <option value="Empleado Fijo">Empleado Fijo</option>
              <option value="Empleado Itinerante">Empleado Itinerante</option>
              <option value="Directivo">Directivo</option>
            </select>
          </label>

          {!canCreate && (
            <small className={styles.muted}>
              Completa el código y el tipo para habilitar “Crear”.
            </small>
          )}
        </div>
      </Modal>

      {/* Detalles */}
      <SlotDetailsModal
        open={open}
        slot={selected}
        onClose={closeDetails}
        onChanged={reloadAll}
        workers={workers}
        workersLoading={workersLoading}
      />
    </section>
  );
};

export default ClientList;
