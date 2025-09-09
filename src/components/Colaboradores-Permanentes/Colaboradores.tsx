import * as React from 'react';
import styles from './colaboradores.module.css';
import ModalAgregarColaborador from '../AgregarColaborador/ModalAgregarColaborador';
import ModalVerColaborador from '../DetallesColaborador/ModalVerColaborador';
import type { VehicleType } from '../../adapters/shared';
import type { Collaborator } from '../../adapters/colaboradores';
import type { SlotUI } from '../../adapters/cells';
import { useCollaborators } from '../../hooks/useColaboradores';
import { useCeldas } from '../../hooks/useCeldas';
import { useWorkers } from '../../hooks/useCoworkers';

const ColaboradoresInscritos: React.FC = () => {
  // Hook de colaboradores
  const {rows, loading, error, search, pageSize, pageIndex, hasNext,
    setSearch, setPageSize, nextPage, prevPage, reloadAll, addCollaborator, deleteCollaborator
  } = useCollaborators();
  const { workers, loading: workersLoading } = useWorkers(); // ✅

  // Hook de celdas
  const { getUnassignedSlots } = useCeldas();

  // Estado modals
  const [isOpenAdd, setIsOpenAdd] = React.useState(false);
  const [isOpenDetails, setIsOpenDetails] = React.useState(false);
  const [selected, setSelected] = React.useState<Collaborator | null>(null);

  // Estado para celdas libres (para el modal)
  const [freeSlots, setFreeSlots] = React.useState<SlotUI[]>([]);
  const [slotsLoading, setSlotsLoading] = React.useState(false);

  // Filtro de vehículo en cliente (no crea métodos nuevos)
  const [vehicleFilter, setVehicleFilter] = React.useState<'all' | VehicleType>('all');

  // Métodos modal Agregar
  const openAddModal = async () => {
    try {
      setSlotsLoading(true);
      const free = await getUnassignedSlots();
      setFreeSlots(free);
      setIsOpenAdd(true);
    } catch (e) {
      console.error('[Colaboradores] getUnassignedSlots error:', e);
      setFreeSlots([]);
      setIsOpenAdd(true); // igual abre el modal, pero sin opciones
    } finally {
      setSlotsLoading(false);
    }
  };
  const closeAddModal = () => setIsOpenAdd(false);

  const closeDetails = () => { setIsOpenDetails(false); setSelected(null); };

  // Filtrado por vehículo (cliente)
  const viewRows = React.useMemo(
    () => vehicleFilter === 'all' ? rows : rows.filter(r => r.tipoVehiculo === vehicleFilter),
    [rows, vehicleFilter]
  );

  // Buscar con Enter (si quieres mínimo 2 chars, agrega el if)
  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      reloadAll();
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h1 className={styles.title}>Colaboradores inscritos</h1>

        <div className={styles.topBarGrid}>
          {/* IZQUIERDA: segmentación por vehículo */}
          <div className={styles.groupLeft}>
            <div className={styles.segmented}>
              <button
                type="button"
                className={`${styles.segmentBtn} ${vehicleFilter === 'all' ? styles.segmentBtnActive : ''}`}
                onClick={() => setVehicleFilter('all')}
                disabled={loading}
                title="Ver todos"
              >
                Todos
              </button>
              <button
                type="button"
                className={`${styles.segmentBtn} ${vehicleFilter === 'Carro' ? styles.segmentBtnActive : ''}`}
                onClick={() => setVehicleFilter('Carro')}
                disabled={loading}
                title="Solo Carro"
              >
                Carro
              </button>
              <button
                type="button"
                className={`${styles.segmentBtn} ${vehicleFilter === 'Moto' ? styles.segmentBtnActive : ''}`}
                onClick={() => setVehicleFilter('Moto')}
                disabled={loading}
                title="Solo Moto"
              >
                Moto
              </button>
            </div>
          </div>

          {/* CENTRO: búsqueda */}
          <div className={styles.groupCenter}>
            <div className={styles.searchForm}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Buscar por nombre, correo o placa…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={onSearchKeyDown}
              />
              {search && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() => setSearch('')}
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* DERECHA: acción primaria */}
          <div className={styles.groupRight}>
            <button className={styles.button} type="button" onClick={openAddModal}>
              Agregar colaborador
            </button>
          </div>
        </div>

        {/* Estados */}
        {loading && <div className={styles.info}>Cargando…</div>}
        {error && <div className={styles.error}>{error}</div>}

        {/* Tabla */}
        {!loading && !error && (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.theadRow}>
                    <th className={styles.th} style={{ textAlign: 'center' }}>Nombre</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>Correo electrónico</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>Tipo de vehículo</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>Placa del vehículo</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>Celda Asignada</th>
                    <th className={styles.th} style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {viewRows.map((c) => (
                    <tr key={c.id}>
                      <td className={styles.td}>{c.nombre}</td>
                      <td className={styles.td}>{c.correo}</td>
                      <td className={styles.td}>{c.tipoVehiculo}</td>
                      <td className={styles.td}>{c.placa}</td>
                      <td className={styles.td}>{c.CodigoCelda}</td>
                      <td className={styles.td}>
                       
                        <button
                          type='button'
                          className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                          title="Eliminar colaborador"
                          aria-label={`Eliminar ${c.nombre}`}
                          onClick={() => deleteCollaborator(String(c.id))}
                          disabled={loading}>
                               <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M9 3h6a1 1 0 0 1 1 1v1h4v2H4V5h4V4a1 1 0 0 1 1-1zm2 0v1h2V3h-2zM6 9h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9zm4 2v8h2v-8h-2zm-4 0h2v8H8v-8zm8 0h2v8h-2v-8z"/>
                              </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className={styles.paginationBar}>
              <div className={styles.paginationLeft}>
                <button
                  className={styles.pageBtn}
                  onClick={prevPage}
                  disabled={pageIndex === 0}
                >
                  ← Anterior
                </button>
                <button
                  className={styles.pageBtn}
                  onClick={nextPage}
                  disabled={!hasNext}
                >
                  Siguiente →
                </button>
                <span className={styles.pageInfo}>
                  Página {pageIndex + 1}
                </span>
              </div>

              <div className={styles.paginationRight}>
                <label className={styles.pageSizeLabel}>
                  Filas por página
                  <select
                    className={styles.pageSizeSelect}
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value) || 10)}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </label>
              </div>
            </div>
          </>
        )}

        {/* MODAL: Agregar colaborador */}
        <ModalAgregarColaborador
          isOpen={isOpenAdd}
          onClose={closeAddModal}
          onSave={async (c) => { await addCollaborator(c); closeAddModal(); }}
          slots={freeSlots}
          slotsLoading={slotsLoading}
          workers={workers}
          workersLoading= {workersLoading}
        />

        {/* MODAL: Ver detalles */}
        <ModalVerColaborador
          isOpen={isOpenDetails}
          onClose={closeDetails}
          collaborator={selected as any}
        />
      </div>
    </section>
  );
};

export default ColaboradoresInscritos;
