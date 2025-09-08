import * as React from 'react';
import styles from './modalAgregarColaborador.module.css';
import type { NewCollaborator } from '../../adapters/colaboradores';
import type { SlotUI } from '../../adapters/cells';
// Si ya tienes VehicleType en tus adapters, usa esa import y borra la siguiente línea:
// import type { VehicleType } from '../../adapters/shared';
export type VehicleType = 'Carro' | 'Moto';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (c: NewCollaborator) => void;
  /** Lista de celdas sin asignar (no lookup) */
  slots?: SlotUI[];
  /** Estado de carga de las celdas */
  slotsLoading?: boolean;
};

const initialForm: NewCollaborator = {
  nombre: '',
  correo: '',
  tipoVehiculo: 'Carro',
  placa: '',
  // Para listas sin lookup guardamos texto/código y opcionalmente el id de slot
  codigoCelda: '',
  IdSpot: '', // si en tu modelo es number, cambia a 0 y tipa acorde
};

const ModalAgregarColaborador: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
 // slots = [],
 // slotsLoading = false,
}) => {
  const [form, setForm] = React.useState<NewCollaborator>(initialForm);

  React.useEffect(() => {
    if (isOpen) setForm(initialForm);
  }, [isOpen]);

  if (!isOpen) return null;

  // Al seleccionar una celda por código (Title), también llenamos IdSpot si existe
  /*const handleCeldaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const codigo = e.target.value;
    const slot = slots.find(s => s.Title === codigo);
    setForm(f => ({
      ...f,
      codigoCelda: codigo,
      IdSpot: slot ? String(slot.Id) : '', // ajusta a number si tu modelo lo requiere
    }));
  };*/

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.(form);
    onClose();
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>Agregar colaborador</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        <form className={styles.body} onSubmit={handleSubmit}>
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

         {/*} <label className={styles.label}>
            Celda (sin asignar)
            <select
              className={styles.select}
              value={form.codigoCelda}
              onChange={handleCeldaChange}
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
          </label>*/}

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
