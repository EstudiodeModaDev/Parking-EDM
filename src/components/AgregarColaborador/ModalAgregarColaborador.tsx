import * as React from 'react';
import styles from './modalAgregarColaborador.module.css';
import type { NewCollaborator } from '../../adapters/colaboradores';
import type { SlotUI } from '../../adapters/cells';
import type { Worker } from '../../adapters/shared';
import { nameProve } from '../../Services/NameService';

// Si ya tienes este tipo en otra parte, usa ese y borra esta definición.
export type VehicleType = 'Carro' | 'Moto';


type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (c: NewCollaborator) => void;

  // Opcional: celdas sin asignar, si más adelante las reactivas en el modal
  slots?: SlotUI[];
  slotsLoading?: boolean;

  // Lista de colaboradores para el dropdown
  workers?: Worker[];
  workersLoading?: boolean;
};

const initialForm: NewCollaborator = {
  nombre: '',
  correo: '',
  tipoVehiculo: 'Carro',
  placa: '',
  codigoCelda: '',
  IdSpot: '',
};

const norm = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

const ModalAgregarColaborador: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  workers = [],
  workersLoading = false,
  // slots = [],
  // slotsLoading = false,
}) => {
  // ==== HOOKS (siempre arriba, sin returns antes) ====
  const [form, setForm] = React.useState<NewCollaborator>(initialForm);
  const [colabTerm, setColabTerm] = React.useState('');
  const [selectedWorkerId, setSelectedWorkerId] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setColabTerm('');
      setSelectedWorkerId('');
    }
  }, [isOpen]);

  const filteredWorkers = React.useMemo(() => {
    if (!colabTerm) return workers;
    const q = norm(colabTerm);
    return workers.filter(w =>
      norm(`${w.displayName} ${w.mail ?? ''} ${w.jobTitle ?? ''}`).includes(q)
    );
  }, [workers, colabTerm]);

  const onSelectWorker = async (id: string) => {
    setSelectedWorkerId(id);
    const w = workers.find(x => String(x.id) === String(id));

    if (!w) {
      setForm(f => ({ ...f, nombre: "", correo: "" }));
      return;
    }

    // valida asíncrono
    let nombre = w.displayName || "";
    try {
      const ok = await nameProve(nombre);
      if (!ok) nombre = "";
    } catch (e) {
      console.error("nameProve error:", e);
      // decide qué hacer en fallo: aquí lo dejamos en vacío
      nombre = "";
    }

    setForm(f => ({
      ...f,
      nombre,
      correo: w.mail || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(form);
    onClose();
  };

  // guard de render (después de declarar hooks)
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>Agregar colaborador</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        <form className={styles.body} onSubmit={handleSubmit}>
          {/* === Colaborador con búsqueda + dropdown === */}
          <fieldset className={styles.fieldset}>
            <label className={styles.label}>Colaborador</label>

            <div className={styles.comboColab}>
              <input
                className={styles.input}
                type="text"
                placeholder="Buscar por nombre, correo o cargo…"
                value={colabTerm}
                onChange={(e) => setColabTerm(e.target.value)}
                disabled={workersLoading}
              />

              <select
                className={styles.select}
                value={selectedWorkerId}
                onChange={(e) => onSelectWorker(e.target.value)}
                disabled={workersLoading}
              >
                <option value="" disabled>
                  {workersLoading
                    ? 'Cargando colaboradores…'
                    : filteredWorkers.length === 0
                      ? 'Sin resultados'
                      : 'Selecciona un colaborador'}
                </option>
                {filteredWorkers.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.displayName}
                    {w.mail ? ` · ${w.mail}` : ''}
                    {w.jobTitle ? ` · ${w.jobTitle}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <small className={styles.hint}>
              Al seleccionar un colaborador, llenamos automáticamente Nombre y Correo (puedes editarlos).
            </small>
          </fieldset>

          {/* === Datos editables/confirmables === */}
          <label className={styles.label}>
            Nombre
            <input
              className={styles.input}
              type="text"
              value={form.nombre}
              onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
              required
            />
          </label>

          <label className={styles.label}>
            Correo electrónico
            <input
              className={styles.input}
              type="email"
              value={form.correo}
              onChange={(e) => setForm(f => ({ ...f, correo: e.target.value }))}
              required
            />
          </label>

          <label className={styles.label}>
            Tipo de vehículo
            <select
              className={styles.select}
              value={form.tipoVehiculo}
              onChange={(e) => setForm(f => ({ ...f, tipoVehiculo: e.target.value as VehicleType }))}
            >
              <option value="Carro">Carro</option>
              <option value="Moto">Moto</option>
            </select>
          </label>

          <label className={styles.label}>
            Placa del vehículo
            <input
              className={styles.input}
              type="text"
              value={form.placa}
              onChange={(e) => setForm(f => ({ ...f, placa: e.target.value.toUpperCase() }))}
              placeholder="Ej: ABC123"
              required
            />
          </label>

          {/* Si luego activas celdas sin asignar, reusa tu bloque anterior:
          <label className={styles.label}>
            Celda (sin asignar)
            <select
              className={styles.select}
              value={form.codigoCelda}
              onChange={(e) => {
                const codigo = e.target.value;
                const slot = slots.find(s => s.Title === codigo);
                setForm(f => ({
                  ...f,
                  codigoCelda: codigo,
                  IdSpot: slot ? String(slot.Id) : '',
                }));
              }}
              required
              disabled={slotsLoading}
            >
              <option value="" disabled>
                {slotsLoading ? 'Cargando…' : 'Selecciona una celda'}
              </option>
              {slots.map(s => (
                <option key={s.Id} value={s.Title}>
                  {s.Title}{s.TipoCelda ? ` · ${s.TipoCelda}` : ''}
                </option>
              ))}
            </select>
          </label>
          */}

          <div className={styles.actions}>
            <button type="button" className={styles.btnGhost} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.btnPrimary}>Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgregarColaborador;
