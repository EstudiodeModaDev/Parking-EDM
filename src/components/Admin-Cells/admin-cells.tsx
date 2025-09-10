import * as React from 'react';
import styles from './AdminCells.module.css';
import { useAdminCells } from './useAdminCells';

const AdminCells: React.FC = () => {
  const {
    // estado base
    loading, error,
    rows, pageIndex, hasNext,
    // filtros y paginación
    search, setSearch, onSearchEnter,
    tipo, setTipo,
    itinerancia, setItinerancia,
    pageSize, setPageSize,
    nextPage, prevPage,
    // modales
    createOpen, createSaving, createError, createForm, canCreate,
    openModal, closeModal, setCreateForm, create,
    // ocupación/capacidad/turnos
    occLoading, capacidadAhora, currentTurn, hoursLabel,
    openDetails, closeDetails, open, selected, workersLoading,
  } = useAdminCells();

  // badge turnos (estética, se queda en el componente)
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
    </span>;
  };

  if (loading) return <div className={styles.wrapper}>Cargando…</div>;
  if (error)   return <div className={styles.wrapper}><div className={styles.error}>Error: {error}</div></div>;

  return (
    <section className={styles.wrapper}>
      <h3 className={styles.h3}>Listado de celdas</h3>

      {/* Capacidad hoy + horarios */}
      <div className={styles.capacityCard}>
        <div className={styles.capacityHeader}>
          <strong>Capacidad hoy</strong>
          <span className={styles.turnPill}>
            {currentTurn === 'Manana'
              ? 'Turno actual: AM'
              : currentTurn === 'Tarde'
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

        <div style={{ marginTop: 6 }}>
          <small>{hoursLabel}</small>
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

        <div className={styles.pageSizeBox}>
          <span>Itinerancia</span>
          <select
            className={styles.pageSizeSelect}
            value={itinerancia}
            onChange={(e) => setItinerancia(e.target.value as any)}
            disabled={loading}
          >
            <option value="all">Todas</option>
            <option value="Empleado Fijo">Empleado Fijo</option>
            <option value="Empleado Itinerante">Empleado Itinerante</option>
            <option value="Directivo">Directivo</option>
          </select>
        </div>

        <div className={styles.searchBox}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Buscar por código…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onSearchEnter}
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

      {/* Grid */}
      {rows.length === 0 ? (
        <div className={styles.emptyGrid}>Sin resultados.</div>
      ) : (
        <ul className={styles.cardGrid}>
          {rows.map(r => {
            const activa = r.Activa === 'Activa';
            const occ = r.__occ || {};
            const amReserved = !!occ.Manana;
            const pmReserved = !!occ.Tarde;

            const amBadge = renderTurnBadge(
              activa, amReserved, 'AM', (currentTurn === 'Manana') && amReserved, occ.PorManana
            );
            const pmBadge = renderTurnBadge(
              activa, pmReserved, 'PM', (currentTurn === 'Tarde') && pmReserved, occ.PorTarde
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
                  <button className={styles.btnLink} onClick={() => openDetails(r)} disabled={occLoading}>
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

      {/* Paginación */}
      <div className={styles.paginationBar}>
        <button className={styles.pageBtn} onClick={prevPage} disabled={pageIndex === 0}>
          ← Anterior
        </button>
        <span className={styles.pageInfo}>Página {pageIndex + 1}</span>
        <button className={styles.pageBtn} onClick={nextPage} disabled={!hasNext}>
          Siguiente →
        </button>
      </div>

      {/* Modal de creación */}
      {createOpen && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h4>Nueva celda</h4>
            {createError && <div className={styles.error}>{createError}</div>}

            <label className={styles.field}>
              <span>Código</span>
              <input
                className={styles.searchInput}
                value={createForm.Title}
                onChange={(e) => setCreateForm(f => ({ ...f, Title: e.target.value }))}
                placeholder="Ej: A-02"
              />
            </label>

            <label className={styles.field}>
              <span>Tipo</span>
              <select
                className={styles.pageSizeSelect}
                value={createForm.TipoCelda}
                onChange={(e) => setCreateForm(f => ({ ...f, TipoCelda: e.target.value as any }))}
              >
                <option value="Carro">Carro</option>
                <option value="Moto">Moto</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Estado</span>
              <select
                className={styles.pageSizeSelect}
                value={createForm.Activa}
                onChange={(e) => setCreateForm(f => ({ ...f, Activa: e.target.value as any }))}
              >
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>Itinerancia</span>
              <select
                className={styles.pageSizeSelect}
                value={createForm.Itinerancia}
                onChange={(e) => setCreateForm(f => ({ ...f, Itinerancia: e.target.value as any }))}
              >
                <option value="Empleado Fijo">Empleado Fijo</option>
                <option value="Empleado Itinerante">Empleado Itinerante</option>
                <option value="Directivo">Directivo</option>
              </select>
            </label>

            <div className={styles.modalActions}>
              <button className={styles.btnGhost} onClick={closeModal} disabled={createSaving}>Cancelar</button>
              <button className={styles.btn} onClick={create} disabled={!canCreate || createSaving}>
                {createSaving ? 'Creando…' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {open && selected && (
        // Reusa tu SlotDetailsModal existente
        <div className={styles.modalBackdrop} onClick={closeDetails}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h4>Detalles celda {selected.Title}</h4>
            {/* Aquí puedes seguir usando tu SlotDetailsModal si lo prefieres */}
            {/* <SlotDetailsModal ... /> */}
            {workersLoading ? <div>Cargando colaboradores…</div> : null}
            <button className={styles.btnGhost} onClick={closeDetails}>Cerrar</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminCells;
