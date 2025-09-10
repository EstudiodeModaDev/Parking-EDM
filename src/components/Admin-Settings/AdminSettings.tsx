import * as React from 'react';
import styles from './AdminSettings.module.css';
import type { SettingsPort, SettingsForm, SettingsRecord } from '../../adapters/settings';


const DEFAULTS: SettingsForm = { VisibleDays: 3, TyC: "" , InicioManana: 7, InicioTarde: 12, FinalManana: 12, FinalTarde: 18};

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
    InicioManana: initial?.InicioManana ?? DEFAULTS.InicioManana,
    FinalManana: initial?.FinalManana ?? DEFAULTS.FinalManana,
    InicioTarde: initial?.InicioTarde ?? DEFAULTS.InicioTarde,
    FinalTarde: initial?.FinalTarde ?? DEFAULTS.FinalTarde
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
          InicioManana: rec.InicioManana ?? (prev.InicioManana ?? DEFAULTS.InicioManana),
          FinalManana: rec.FinalManana ?? (prev.FinalManana ?? DEFAULTS.FinalManana),
          InicioTarde: rec.InicioTarde ?? (prev.InicioTarde ?? DEFAULTS.InicioTarde),
          FinalTarde: rec.FinalTarde ?? (prev.FinalTarde ?? DEFAULTS.FinalTarde),
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
      if (form.InicioManana !== prev.InicioManana) changes.InicioManana = form.InicioManana;
      if (form.FinalManana !== prev.FinalManana) changes.FinalManana = form.FinalManana;
      if (form.InicioTarde !== prev.InicioTarde) changes.InicioTarde = form.InicioTarde;
      if (form.FinalTarde !== prev.FinalTarde) changes.FinalTarde = form.FinalTarde;

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
          
          <label className={styles.label} htmlFor="VisibleDays">Días máximos visibles
              <span title="Con cuanto tiempo de antelación permite reservar la aplicación" style={{cursor:'help'}}>ℹ️</span>
          </label>
          <input id="VisibleDays" className={styles.input} type="number" min={1} max={60} value={form.VisibleDays} onChange={onChangeNumber('VisibleDays', 1, 60)} />
          {errors.VisibleDays && <div className={styles.error}>{errors.VisibleDays}</div>}
        </div>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="TyC">Términos y condiciones
            <span title="Términos y condiciones del parqueadero de Estudio de Moda." style={{cursor:'help'}}>ℹ️</span>
          </label>
          <textarea id="TyC" className={styles.textarea} value={form.TyC} onChange={onChangeText('TyC')} rows={12} placeholder="Escribe los términos y condiciones…"/>
        </div>
      </div>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="Horarios">Horarios Parqueaderos
            <span title="A que hora (Exacta) inician y finalizan los turnos del parqueadero" style={{cursor:'help'}}>ℹ️</span>
          </label>
          <div className={styles.horarioswrap}>
            <label className={styles.horItem} htmlFor="InicioManana">
              <span className={styles.horTitle}>Inicio mañana</span>
              <input id="InicioManana" className={styles.horarios} type="number" value={form.InicioManana} onChange={onChangeNumber('InicioManana', 1, 12)} min={1} max={12}/>
            </label>

            <label className={styles.horItem} htmlFor="FinalManana">
              <span className={styles.horTitle}>Final mañana</span>
              <input id="FinalManana" className={styles.horarios} type="number" value={form.FinalManana} onChange={onChangeNumber('FinalManana', 1, 12)} min={1} max={12}/>
            </label>

            <label className={styles.horItem} htmlFor="InicioTarde">
              <span className={styles.horTitle}>Inicio Tarde</span>
              <input id="InicioTarde" className={styles.horarios} type="number" value={form.InicioTarde} onChange={onChangeNumber('InicioTarde', 12, 23)} min={12} max={23}/>
            </label>

            <label className={styles.horItem} htmlFor="FinalTarde">
              <span className={styles.horTitle}>Final Tarde</span>
              <input id="FinalTarde" className={styles.horarios} type="number" value={form.FinalTarde} onChange={onChangeNumber('FinalTarde', 12, 23)} min={12} max={23}/>
            </label>
          </div>

        </div>
      </div>

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
