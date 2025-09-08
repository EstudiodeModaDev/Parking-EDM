// src/components/AdminCells/ClientListCards.tsx
import * as React from 'react';
import styles from './AdminCells.module.css';
import { useCeldas } from '../../hooks/useCeldas';
import SlotDetailsModal from './SlotDetailsModal';
import type { SlotUI } from '../../adapters/cells';

const ClientListCards: React.FC = () => {
  const {
    rows, loading, error,
    search, setSearch,
    tipo, setTipo,
    pageSize, setPageSize, pageIndex, hasNext, nextPage, prevPage,
    reloadAll, toggleEstado,
  } = useCeldas();

  const [selected, setSelected] = React.useState<SlotUI | null>(null);
  const [open, setOpen] = React.useState(false);

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); reloadAll(); }
  };

  const openDetails = (slot: SlotUI) => { setSelected(slot); setOpen(true); };
  const closeDetails = () => { setOpen(false); setSelected(null); };

  return (
    <section className={styles.wrapper}>
      <h3 className={styles.h3}>Celdas</h3>

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
            placeholder="Buscar por Title…"
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
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {loading && <div style={{ marginTop: 8 }}>Cargando…</div>}
      {error && <div style={{ marginTop: 8, color: 'crimson' }}>{error}</div>}

      {!loading && !error && (
        <>
          <div className={styles.cardsGrid}>
            {rows.length === 0 ? (
              <div className={styles.emptyCell}>Sin resultados.</div>
            ) : rows.map(r => {
              const activa = r.Activa === 'Activa';
              return (
                <div key={r.Id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardCode}>{r.Title}</div>
                    <span className={`${styles.badge} ${activa ? styles.badgeOk : styles.badgeWarn}`}>
                      {r.Activa}
                    </span>
                  </div>
                  <div className={styles.cardMeta}>
                    <div><strong>Tipo:</strong> {r.TipoCelda}</div>
                  </div>

                  <div className={styles.cardActions}>
                    <button className={styles.btnPrimary} onClick={() => openDetails(r)}>
                      Ver detalle
                    </button>
                    <button
                      className={activa ? styles.btnDanger : styles.btnSuccess}
                      onClick={() => toggleEstado(r.Id, r.Activa)}
                      disabled={loading}
                    >
                      {activa ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

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

      <SlotDetailsModal
        open={open}
        slot={selected}
        onClose={closeDetails}
        onChanged={reloadAll}
      />
    </section>
  );
};

export default ClientListCards;
