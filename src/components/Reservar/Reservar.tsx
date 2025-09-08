// src/components/Availability/Availability.tsx
import * as React from 'react';
import styles from './Availabitity.module.css';
import { useReservar } from '../../hooks/useReservar';
import { toISODate } from '../../utils/date';

import { Modal } from '../Modals/modals';
import { useToast } from '../Toast/ToasProvider';
import type { TurnType, VehicleType } from '../../adapters/shared';


const Availability: React.FC<{ userEmail: string, userName:string }> = ({ userEmail, userName }) => {
  const { minDate, maxDate, reservar, loading, error } = useReservar(userEmail, userName);
  

  const minISO = React.useMemo(() => toISODate(minDate), [minDate]);
  const maxISO = React.useMemo(() => toISODate(maxDate), [maxDate]);

  const [vehicle, setVehicle] = React.useState<VehicleType>('Carro');
  const [turn, setTurn] = React.useState<TurnType>('Manana');
  const [date, setDate] = React.useState<string>('');

  // modal
  const [open, setOpen] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [modalError, setModalError] = React.useState<string | null>(null);
  const reservarDisabled = !date || !minISO || !maxISO;

  React.useEffect(() => {
    if (!minISO || !maxISO) return;
    const today = new Date().toISOString().slice(0,10);
    const clamp = (iso: string, a: string, b: string) => iso < a ? a : iso > b ? b : iso;
    setDate(prev => prev || clamp(today, minISO, maxISO));
  }, [minISO, maxISO]);

  //Notificaciones
  const toast = useToast();
  async function confirmReserva() {
    try {
      setSubmitLoading(true);
      setModalError(null);
      const res = await reservar({ vehicle, turn, dateISO: date, userEmail});
      

      if (res.ok) {
        setOpen(false);
        toast.success(res.message);         
      } else {
        setModalError(res.message);
        toast.error(res.message);           
      }
    } catch (e: any) {
      const msg = e?.message ?? 'Error inesperado al reservar';
      setModalError(msg);
      toast.error(msg);
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading) return <div className={styles.wrapper}>Cargando…</div>;
  if (error)   return <div className={styles.wrapper}><div className={styles.error}>Error: {error}</div></div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <label className={styles.label}>
          Fecha:
          <input
            className={styles.input}
            type="date"
            min={minISO || undefined}
            max={maxISO || undefined}
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </label>

        <label className={styles.label}>
          Turno:
          <select
            className={styles.select}
            value={turn}
            onChange={e => setTurn(e.target.value as TurnType)}
          >
            <option value="Manana">Mañana (6:00–12:00)</option>
            <option value="Tarde">Tarde (1:00–6:00)</option>
            <option value="Dia">Día completo</option>
          </select>
        </label>

        <label className={styles.label}>
          Vehículo:
          <select
            className={styles.select}
            value={vehicle}
            onChange={e => setVehicle(e.target.value as VehicleType)}
          >
            <option value="Carro">Carro</option>
            <option value="Moto">Moto</option>
          </select>
        </label>

        <button
          className={styles.button}
          onClick={() => setOpen(true)}
          disabled={reservarDisabled}
        >
          Reservar
        </button>
      </div>

      {/* Modal de confirmación */}
      <Modal
      open={open}
      title="Confirmar reserva"
      onClose={() => !submitLoading && setOpen(false)}
      onConfirm={confirmReserva}
      confirmText={submitLoading ? 'Guardando…' : 'Confirmar'}
      cancelText="Cancelar"
      showTerms
      settingsItemId="1"           // el mismo item que ya usas
      termsField="TerminosyCondiciones" // nombre exacto de la columna en Settings
      >
        <p><strong>Fecha:</strong> {date}</p>
        <p><strong>Turno:</strong> {turn === 'Dia' ? 'Día completo' : turn}</p>
        <p><strong>Vehículo:</strong> {vehicle}</p>

        {modalError && <p style={{ color: 'red', marginTop: '8px' }}>{modalError}</p>}
    </Modal>

    </div>
  );
};

export default Availability;
