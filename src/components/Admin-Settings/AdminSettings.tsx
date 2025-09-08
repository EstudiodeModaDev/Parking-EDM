import * as React from 'react';
import styles from './AdminSettings.module.css';
import type { SettingsPort, SettingsForm, SettingsRecord } from '../../adapters/settings';

const DEFAULTS: SettingsForm = { VisibleDays: 3, MaxAdvanceHours: 72, MaxUserTurns: 3 };
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Number.isFinite(v) ? v : min));

type Props = {
  port: SettingsPort;
  initial?: Partial<SettingsForm>;
};

const AdminSettings: React.FC<Props> = ({ port, initial }) => {
  const [form, setForm] = React.useState<SettingsForm>({
    VisibleDays: initial?.VisibleDays ?? DEFAULTS.VisibleDays,
    MaxAdvanceHours: initial?.MaxAdvanceHours ?? DEFAULTS.MaxAdvanceHours,
    MaxUserTurns: initial?.MaxUserTurns ?? DEFAULTS.MaxUserTurns,
  });

  const [base, setBase] = React.useState<SettingsRecord | null>(null);
  const [loading, setLoading] = React.useState<boolean>(!initial);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [okMsg, setOkMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rec = await port.getOne();
        if (cancelled) return;
        setBase(rec);
        setForm({
          VisibleDays: rec.VisibleDays ?? DEFAULTS.VisibleDays,
          MaxAdvanceHours: rec.MaxAdvanceHours ?? DEFAULTS.MaxAdvanceHours,
          MaxUserTurns: rec.MaxUserTurns ?? DEFAULTS.MaxUserTurns,
        });
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'No se pudieron cargar los ajustes.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [port]);

  const errors = React.useMemo(() => {
    const e: Partial<Record<keyof SettingsForm, string>> = {};
    const cap = (form.VisibleDays || 0) * 24;

    if (form.VisibleDays < 1) e.VisibleDays = 'Debe ser ≥ 1 día.';
    if (form.MaxAdvanceHours < 1) e.MaxAdvanceHours = 'Debe ser ≥ 1 hora.';
    else if (form.MaxAdvanceHours > cap) e.MaxAdvanceHours = `No debe exceder ${cap} horas (${form.VisibleDays}×24).`;

    if (form.MaxUserTurns < 1) e.MaxUserTurns = 'Debe ser ≥ 1 turno.';
    else if (form.MaxUserTurns > 6) e.MaxUserTurns = 'Máximo recomendado: 6 turnos.';

    return e;
  }, [form]);

  const hasErrors = Object.keys(errors).length > 0;

  const dirty = React.useMemo(() => {
    if (!base) return false;
    return (
      form.VisibleDays !== base.VisibleDays ||
      form.MaxAdvanceHours !== base.MaxAdvanceHours ||
      form.MaxUserTurns !== base.MaxUserTurns
    );
  }, [form, base]);

  const onChangeNumber =
    (key: keyof SettingsForm, min: number, max: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      setForm(f => ({ ...f, [key]: clamp(v, min, max) }));
      setOkMsg(null);
      setError(null);
    };

  const restoreDefaults = () => {
    setForm(DEFAULTS);
    setOkMsg(null);
    setError(null);
  };

  const save = async () => {
    if (!base || hasErrors || !dirty) return;
    setSaving(true);
    setError(null);
    setOkMsg(null);
    try {
      const changes: Partial<SettingsForm> = {};
      (['VisibleDays', 'MaxAdvanceHours', 'MaxUserTurns'] as const).forEach(k => {
        if (form[k] !== base[k]) changes[k] = form[k];
      });
      await port.update(base.ID, changes);
      setBase({ ...base, ...form });
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
      <div className={styles.card}>
        <h2 className={styles.title}>Parámetros de Reservas</h2>

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
            <small className={styles.hint}>Cuántos días hacia adelante se muestran en “Disponibilidad”.</small>
            {errors.VisibleDays && <div className={styles.error}>{errors.VisibleDays}</div>}
          </div>
        </div>


        {error && <div className={styles.error}>{error}</div>}
        {okMsg && <div className={styles.ok}>{okMsg}</div>}

        <div className={styles.actions}>
          <button className={styles.button} onClick={save} disabled={saving || hasErrors || !dirty}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
          <button className={styles.buttonGhost} type="button" onClick={restoreDefaults} disabled={saving} title="Restaurar 7 / 72 / 3">
            Restaurar por defecto
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
