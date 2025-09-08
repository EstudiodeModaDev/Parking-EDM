import * as React from 'react';
import styles from './AdminCells.module.css';
import type { SlotUI } from '../../adapters/cells';
import {
  fetchAssignee,
  searchUnassignedCollaborators,
  assignSlotToCollaborator,
  unassignSlotFromCollaborator,
  type Assignee
} from '../../hooks/AsignarCeldas';


type Props = {
  open: boolean;
  slot: SlotUI | null;
  onClose: () => void;
  onChanged?: () => void; 
};

export default function SlotDetailsModal({ open, slot, onClose, onChanged }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [assignee, setAssignee] = React.useState<Assignee>(null);

  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [term, setTerm] = React.useState('');
  const [results, setResults] = React.useState<Assignee[]>([]);
  const [searching, setSearching] = React.useState(false);

  // Cargar asignado actual
  React.useEffect(() => {
    if (!open || !slot) return;
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const a = await fetchAssignee(slot.Id);
        if (!cancel) setAssignee(a);
      } catch (e: any) {
        if (!cancel) setError(e?.message ?? 'Error al cargar asignación');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [open, slot?.Id]);

  const doSearch = React.useCallback(async () => {
    setSearching(true);
    setError(null);
    try {
      const res = await searchUnassignedCollaborators(term);
      setResults(res);
    } catch (e: any) {
      setError(e?.message ?? 'Error buscando colaboradores');
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [term]);

  const onAssign = React.useCallback(async (candidate: Assignee) => {
    if (!candidate || !slot) return;
    setLoading(true);
    setError(null);
    try {
      await assignSlotToCollaborator(candidate.id, slot.Id, slot.Title);
      setAssignee(candidate);
      setPickerOpen(false);
      setTerm('');
      setResults([]);
      await onChanged?.();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo asignar la celda');
    } finally {
      setLoading(false);
    }
  }, [slot, onChanged]);

  const onUnassign = React.useCallback(async () => {
    if (!assignee) return;
    setLoading(true);
    setError(null);
    try {
      
      await unassignSlotFromCollaborator(assignee.id);
      setAssignee(null);
      await onChanged?.();
    } catch (e: any) {
      setError(e?.message ?? 'No se pudo desasignar la celda');
    } finally {
      setLoading(false);
    }
  }, [assignee, onChanged]);

  if (!open || !slot) return null;

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.backdrop} onMouseDown={onBackdrop}>
      <div className={styles.modal}>
        <header className={styles.modalHeader}>
          <h3 className={styles.title}>Celda {slot.Title}</h3>
          <button className={styles.close} onClick={onClose} aria-label="Cerrar">×</button>
        </header>

        <div className={styles.modalBody}>
          <p><strong>Tipo:</strong> {slot.TipoCelda}</p>
          <p><strong>Estado:</strong> {slot.Activa}</p>

          <div className={styles.cardAssignBlock}>
            <h4>Asignación</h4>
            {loading && <div className={styles.muted}>Cargando…</div>}
            {error && <div className={styles.error}>{error}</div>}

            {!loading && (
              <>
                {assignee ? (
                  <div className={styles.assignedRow}>
                    <div>
                      <div><strong>Asignado a:</strong> {assignee.name}</div>
                      {assignee.email && <div className={styles.muted}>{assignee.email}</div>}
                    </div>
                    <button className={styles.btnDanger} onClick={onUnassign}>Desasignar</button>
                  </div>
                ) : (
                  <div className={styles.assignedRow}>
                    <div className={styles.muted}>Sin asignación</div>
                    <button className={styles.btnPrimary} onClick={() => setPickerOpen(true)}>
                      Asignar
                    </button>
                  </div>
                )}
              </>
            )}

            {pickerOpen && (
              <div className={styles.pickerPanel}>
                <div className={styles.pickerHeader}>
                  <input
                    className={styles.searchInput}
                    placeholder="Buscar colaborador (nombre o correo)…"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                  />
                  <button className={styles.btnPrimary} onClick={doSearch} disabled={searching}>
                    {searching ? 'Buscando…' : 'Buscar'}
                  </button>
                  <button className={styles.btnGhost} onClick={() => { setPickerOpen(false); setTerm(''); setResults([]); }}>
                    Cerrar
                  </button>
                </div>

                <ul className={styles.resultList}>
                  {results.length === 0 && !searching && <li className={styles.muted}>Sin resultados</li>}
                  {results.map(c => (
                    <li key={c?.id} className={styles.resultItem}>
                      <div>
                        <div className={styles.resultName}>{c?.name}</div>
                        {c?.email && <div className={styles.resultEmail}>{c.email}</div>}
                      </div>
                      <button className={styles.btnPrimary} onClick={() => onAssign(c)}>Asignar</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <footer className={styles.modalFooter}>
          <button className={styles.btnGhost} onClick={onClose}>Cerrar</button>
        </footer>
      </div>
    </div>
  );
}
