import * as React from 'react';
import styles from './AdminSettings.module.css';
import type { SettingsPort, SettingsForm, SettingsRecord } from '../../adapters/settings';
import PicoPlacaAdmin from '../PicoPlaca/PicoPlaca'; // ← sin espacios en la ruta

const DEFAULTS: SettingsForm = { VisibleDays: 3, TyC: "" };

// Clamp genérico para números
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Number.isFinite(v) ? v : min));

// Normaliza a string primitiva
const s = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

type Props = {
  port: SettingsPort;
  initial?: Partial<SettingsForm>;
};

const AdminSettings: React.FC<Props> = ({ port, initial }) => {
  // Estado del formulario
  const [form, setForm] = React.useState<SettingsForm>({
    VisibleDays: initial?.VisibleDays ?? DEFAULTS.VisibleDays,
    TyC: s(initial?.TyC ?? DEFAULTS.TyC),
  });

  // Estado base (lo que viene de backend)
  const [base, setBase] = React.useState<SettingsRecord | null>(null);

  // UI states
  const [loading, setLoading] = React.useState<boolean>(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [okMsg, setOkMsg] = React.useState<string | null>(null);

  // Evita que el useEffect pise el formulario múltiples veces
  const loadedRef = React.useRef(false);

  // Cargar una sola vez desde el puerto
  React.useEffect(() => {
    if (loadedRef.current) return; // ya cargado
    let cancelled = false;

    (async () => {
      try {
        const rec = await port.getOne();
        if (cancelled) return;

        setBase(rec);
        setForm(prev => ({
          VisibleDays: rec.VisibleDays ?? (prev.VisibleDays ?? DEFAULTS.VisibleDays),
          TyC: prev.TyC && prev.TyC !== DEFAULTS.TyC ? prev.TyC : s(rec.TyC ?? DEFAULTS.TyC),
        }));
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'No se pudieron cargar los ajustes.');
      } finally {
        if (!cancelled) {
          loadedRef.current = true;
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, []); // ← sin deps: carga una sola vez

  // Validaciones
  const errors = React.useMemo(() => {
    const e: Partial<Record<keyof SettingsForm, string>> = {};
    if (form.VisibleDays < 1) e.VisibleDays = 'Debe ser ≥ 1 día.';
    // Si quieres obligar TyC, descomenta:
    // if (!form.TyC.trim()) e.TyC = 'Los términos no pueden estar vacíos.';
    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  // Handlers
  const onChangeNumber =
    (key: keyof SettingsForm, min: number, max: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      setForm(f => ({ ...f, [key]: clamp(v, min, max) }));
      setOkMsg(null);
      setError(null);
    };

  const onChangeText =
    (key: 'TyC') =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const v = e.target.value ?? '';
      setForm(f => ({ ...f, [key]: v }));
      setOkMsg(null);
      setError(null);
    };

  // Guardar solo cambios
  const save = async () => {
    if (!base || hasErrors) return;
    setSaving(true);
    setError(null);
    setOkMsg(null);

    try {
      const prev: Partial<SettingsForm> = {
        VisibleDays: base.VisibleDays ?? DEFAULTS.VisibleDays,
        TyC: s(base.TyC ?? DEFAULTS.TyC),
      };

      const changes: Partial<SettingsForm> = {};
      if (form.VisibleDays !== prev.VisibleDays) changes.VisibleDays = form.VisibleDays;
      if (form.TyC !== prev.TyC) changes.TyC = form.TyC;

      if (Object.keys(changes).length === 0) {
        setOkMsg('No hay cambios por guardar.');
        return;
      }

      await port.update(base.ID, changes);
      setBase({ ...base, ...changes });
      setOkMsg('Ajustes guardados correctamente.');
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? 'No se pudo guardar los ajustes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Cargando ajustes…</div>;

  return (
  <div className={styles.wrapper}>
    {/* Card única */}
    <div className={styles.card}>
      <h2 className={styles.title}>Parámetros de Reservas</h2>

      {/* VisibleDays */}
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="VisibleDays">Días máximos visibles</label>
          <input
            id="VisibleDays"
            className={styles.input}
            type="number"
            min={1}
            max={60}
            value={form.VisibleDays}
            onChange={onChangeNumber('VisibleDays', 1, 60)}
          />
          <small className={styles.hint}>
            Cuántos días hacia adelante se muestran en “Disponibilidad”.
          </small>
          {errors.VisibleDays && <div className={styles.error}>{errors.VisibleDays}</div>}
        </div>
      </div>

      {/* TyC */}
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="TyC">Términos y condiciones</label>
          <textarea
            id="TyC"
            className={styles.textarea}
            value={form.TyC}
            onChange={onChangeText('TyC')}
            rows={12}
            placeholder="Escribe los términos y condiciones…"
          />
          <small className={styles.hint}>
            Términos y condiciones del parqueadero de Estudio de Moda.
          </small>
        </div>
      </div>

      {/* Pico y Placa justo DEBAJO de TyC */}
      <hr className={styles.divider} />
      <h3 className={styles.subtitle}>Pico y Placa</h3>
      <PicoPlacaAdmin />

      {error && <div className={styles.error}>{error}</div>}
      {okMsg && <div className={styles.ok}>{okMsg}</div>}

      <div className={styles.actions}>
        <button className={styles.button} onClick={save} disabled={saving || hasErrors}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </div>
  </div>
);
};

export default AdminSettings;
