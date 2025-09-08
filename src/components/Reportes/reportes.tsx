// src/components/Reporteria/Reporteria.tsx
import { useReporteria } from '../../hooks/useReportes';
import { exportRowsToExcel } from '../../utils/exportExcel';
import styles from './reporteria.module.css';

export default function Reporteria() {
  const {
    loading, error, rows, aforoPct, capacidadTotal,
    filters, onChange, loadReservas,
  } = useReporteria();

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.title}>Reportería de Parqueadero</h2>
        <div className={styles.aforo}>
          Aforo (periodo filtrado): <strong>{aforoPct}%</strong>
          {!!capacidadTotal && (
            <span className={styles.aforoCap}>
              (Capacidad total: {capacidadTotal} vehiculos)
            </span>
          )}
        </div>
      </header>

      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.field}>
          <label>Desde</label>
          <input
            type="date"
            value={filters.desde}
            onChange={(e) => onChange({ desde: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label>Hasta</label>
          <input
            type="date"
            value={filters.hasta}
            onChange={(e) => onChange({ hasta: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label>Persona (correo o nombre)</label>
          <input
            type="text"
            placeholder="ej: juan@empresa.com"
            value={filters.persona}
            onChange={(e) => onChange({ persona: e.target.value })}
          />
        </div>
        <div className={styles.field}>
          <label>Tipo de vehículo</label>
          <select
            value={filters.tipoVehiculo}
            onChange={(e) => onChange({ tipoVehiculo: e.target.value as any })}
          >
            <option value="">Todos</option>
            <option value="Carro">Carro</option>
            <option value="Moto">Moto</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btn}
            onClick={() => loadReservas()}
            disabled={loading}
          >
            Aplicar filtros
          </button>
          <button
            className={styles.btnPrimary}
            onClick={() => exportRowsToExcel(rows, 'reporte-parqueadero.xlsx')}
            disabled={loading || rows.length === 0}
          >
            Exportar a Excel
          </button>
        </div>
      </div>

      {/* Estado */}
      {loading && <div className={styles.info}>Cargando…</div>}
      {error && <div className={styles.error}>{error}</div>}

      {/* Tabla */}
      {!loading && !error && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Turno</th>
                <th>Celda</th>
                <th>Vehículo</th>
                <th>Usuario</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.empty}>Sin resultados</td>
                </tr>
              ) : rows.map(r => (
                <tr key={r.Id}>
                  <td>{r.Fecha}</td>
                  <td>{r.Turno}</td>
                  <td>{r.Celda}</td>
                  <td>{r.TipoVehiculo}</td>
                  <td>{r.Usuario}</td>
                  <td>{r.Estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
