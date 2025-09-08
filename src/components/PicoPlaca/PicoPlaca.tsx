// src/components/PicoPlaca/PicoPlacaAdmin.tsx
import * as React from 'react';
import styles from './PicoPlacaAdmin.module.css';
import { makePicoPlacaPort, type PicoPlacaRow } from '../../adapters/picoPlacaPort';

const port = makePicoPlacaPort();

const DAY_LABEL: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo',
};

const dayLabel = (title: string) => {
  const n = Number(title);
  return Number.isFinite(n) && DAY_LABEL[n] ? DAY_LABEL[n] : `Día ${title}`;
};

// Valida formato: dígitos 0-9 separados por comas, espacios opcionales. Ej: "6,9" | "0,2,4,6,8"
const VALID_PLATE_PATTERN = /^(\s*[0-9]\s*(,\s*[0-9]\s*)*)?$/;

function normalize(v: string) {
  return v.replace(/\s+/g, '').replace(/\./g, ','); // quita espacios; cambia "." por ","
}

function isValidPattern(v: string) {
  return VALID_PLATE_PATTERN.test(v);
}

const PicoPlacaAdmin: React.FC = () => {
  const [rows, setRows] = React.useState<PicoPlacaRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await port.getAll();
        setRows(data);
      } catch (e: any) {
        setError(e?.message ?? 'No se pudo cargar Pico y Placa');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const editCell = (id: string, key: 'Moto' | 'Carro', value: string) => {
    setRows(prev => prev.map(r => (r.ID === id ? { ...r, [key]: value } : r)));
    setOk(null);
    setError(null);
  };

  const saveRow = async (row: PicoPlacaRow) => {
    const Moto = normalize(row.Moto);
    const Carro = normalize(row.Carro);

    // Validaciones
    if (!isValidPattern(Moto) || !isValidPattern(Carro)) {
      setError('Formato inválido. Usa dígitos separados por comas. Ej: "6,9" o "0,2,4,6,8".');
      return;
    }

    setSavingId(row.ID);
    setError(null);
    setOk(null);
    try {
      await port.update(row.ID, { Moto, Carro });
      setRows(prev => prev.map(r => (r.ID === row.ID ? { ...r, Moto, Carro } : r)));
      setOk(`Fila ${row.Title} guardada.`);
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo guardar la fila.');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <div>Cargando Pico y Placa…</div>;

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.title}>Pico y Placa Medellín</h2>

        {error && <div className={styles.error}>{error}</div>}
        {ok && <div className={styles.ok}>{ok}</div>}

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Día</th>
                <th>Moto (dígitos)</th>
                <th>Carro (dígitos)</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const motoBad = !isValidPattern(normalize(r.Moto));
                const carroBad = !isValidPattern(normalize(r.Carro));
                return (
                  <tr key={r.ID}>
                    <td className={styles.day}>{dayLabel(r.Title)}</td>
                    <td>
                      <input
                        className={`${styles.input} ${motoBad ? styles.bad : ''}`}
                        value={r.Moto}
                        onChange={e => editCell(r.ID, 'Moto', e.target.value)}
                        placeholder="ej: 6,9"
                      />
                    </td>
                    <td>
                      <input
                        className={`${styles.input} ${carroBad ? styles.bad : ''}`}
                        value={r.Carro}
                        onChange={e => editCell(r.ID, 'Carro', e.target.value)}
                        placeholder="ej: 6,9"
                      />
                    </td>
                    <td>
                      <button
                        className={styles.button}
                        onClick={() => saveRow(r)}
                        disabled={savingId === r.ID || motoBad || carroBad}
                        title="Guardar cambios de esta fila"
                      >
                        {savingId === r.ID ? 'Guardando…' : 'Guardar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className={styles.hint}>
          Formato: dígitos 0–9 separados por comas. Ejemplos: <code>6,9</code>, <code>0,2,4,6,8</code>.
        </p>
      </div>
    </section>
  );
};

export default PicoPlacaAdmin;
