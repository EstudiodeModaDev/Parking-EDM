import * as React from 'react';
import type { SlotUI } from '../../adapters/cells';
import {
  fetchAssignee,
  searchUnassignedCollaborators,
  assignSlotToCollaborator,
  unassignSlotFromCollaborator,
  type Assignee,
} from '../../hooks/AsignarCeldas';
import { ReservationsService } from '../../Services/ReservationsService';
import type { Worker } from '../../adapters/shared';

// Si ya lo tienes definido en otro archivo, usa ese tipo.

type Props = {
  open: boolean;
  slot: SlotUI | null;
  onClose: () => void;
  onChanged?: () => void;

  // 🔽 Solo se usan en modo "reserva" para precargar nombre/correo
  workers?: Worker[];
  workersLoading?: boolean;
};

// ===== estilos inline para abreviar
const S = {
  backdrop: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,.45)',
    zIndex: 99999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    background: '#fff',
    width: 'min(900px, 96vw)',
    maxHeight: '90vh',
    overflow: 'auto',
    borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0,0,0,.2)',
    border: '1px solid #e5e7eb',
  },
  header: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { margin: 0, fontSize: 18, fontWeight: 700 as const },
  closeBtn: {
    background: 'transparent',
    border: 0,
    fontSize: 20,
    lineHeight: 1,
    cursor: 'pointer',
  },
  body: { padding: '12px 16px', display: 'grid', gap: 10, fontSize: 14 },
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 8,
  },
  muted: { color: '#6b7280' },
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    padding: 12,
    display: 'grid',
    gap: 10,
  },
  rowBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  btnPrimary: {
    background: '#2563eb',
    color: '#fff',
    border: 0,
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  btnGhost: {
    background: 'transparent',
    border: '1px solid #e5e7eb',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  btnDanger: {
    background: '#dc2626',
    color: '#fff',
    border: 0,
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  input: {
    width: '90%',
    padding: '8px 10px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    fontSize: 14,
  },
  select: {
    width: '93%',
    padding: '8px 10px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    fontSize: 14,
    background: '#fff',
  },
  pickerPanel: {
    marginTop: 8,
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 10,
    display: 'grid',
    gap: 10,
  },
  list: { listStyle: 'none', margin: 0, padding: 0 },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderTop: '1px solid #f3f4f6',
  },
  labelCol: { display: 'grid', gap: 6 },
};

const norm = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

export default function SlotDetailsModal({
  open, slot, workers = [], workersLoading = false,
  onClose, onChanged,  
}: Props) {
  // ===== Estado asignación fija =====
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [assignee, setAssignee] = React.useState<Assignee>(null);

  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [term, setTerm] = React.useState('');
  const [results, setResults] = React.useState<Assignee[]>([]);
  const [searching, setSearching] = React.useState(false);

  // ===== Reserva puntual =====
  const todayISO = React.useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [rvDate, setRvDate] = React.useState<string>(todayISO);
  const [rvTurn, setRvTurn] = React.useState<'Manana' | 'Tarde'>('Manana');
  const [rvSaving, setRvSaving] = React.useState(false);
  const [rvError, setRvError] = React.useState<string | null>(null);
  const [rvName, setRvName] = React.useState('');
  const [rvMail, setRvMail] = React.useState('');

  // Filtro/selección de colaboradores SOLO para reserva
  const selectableWorkers = React.useMemo(() => {
    return (workers ?? []).map((w, idx) => ({
      key: String(w.id ?? w.mail ?? w.displayName ?? idx), // SIEMPRE definido
      id: w.id,
      name: w.displayName ?? '',
      email: w.mail ?? '',
      job: w.jobTitle ?? '',
    }));
  }, [workers]);

  const [colabTerm, setColabTerm] = React.useState('');
  const [selectedWorkerId, setSelectedWorkerId] = React.useState<string>('');

  const filteredWorkers = React.useMemo(() => {
    if (!colabTerm) return selectableWorkers;
    const q = norm(colabTerm);
    return selectableWorkers.filter(w =>
      norm(`${w.name} ${w.email} ${w.job}`).includes(q)
    );
  }, [selectableWorkers, colabTerm]);

  const onSelectWorker = (key: string) => {
    setSelectedWorkerId(key);
    const w = selectableWorkers.find(x => x.key === key);
    if (w) {
      setRvName(w.name || '');
      setRvMail(w.email || '');
    }
  };

  // Derivar modo de la celda
  const mode: 'fijar' | 'reserva' = React.useMemo(() => {
    const iti = String(slot?.Itinerancia ?? '').toLowerCase();
    return iti.includes('itinerante') ? 'reserva' : 'fijar';
  }, [slot?.Itinerancia]);

  // Debug
  React.useEffect(() => {
    console.log('[SlotDetailsModal]', {
      mode,
      itinerancia: slot?.Itinerancia,
      slotId: slot?.Id,
    });
  }, [mode, slot?.Itinerancia, slot?.Id]);

  // Cargar asignado actual (fijo) al abrir
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
    return () => {
      cancel = true;
    };
  }, [open, slot?.Id]);

  // Reset de campos de reserva al abrir (y cuando cambia el asignado)
  React.useEffect(() => {
    if (!open) return;
    if (assignee) {
      setRvName(assignee.name ?? '');
      setRvMail(assignee.email ?? '');
    } else {
      setRvName('');
      setRvMail('');
    }
    setRvDate(todayISO);
    setRvTurn('Manana');
    setRvError(null);
    // reset del selector de colaboradores (solo visual)
    setColabTerm('');
    setSelectedWorkerId('');
  }, [open, assignee, todayISO]);

  // Buscar candidatos (para **asignación fija**)
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

  // Asignar fijo (igual que antes)
  const onAssign = React.useCallback(
    async (candidate: Assignee) => {
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
    },
    [slot, onChanged]
  );

  // Desasignar fijo
  const onUnassign = React.useCallback(
    async () => {
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
    },
    [assignee, onChanged]
  );

  // Chequear choque
  const isBusy = React.useCallback(async (spotId: number, dateISO: string, turn: 'Manana' | 'Tarde') => {
    const res: any = await ReservationsService.getAll({
      select: ['ID'] as any,
      top: 1 as any,
      filter: `SpotId/Id eq ${spotId} and Date eq '${dateISO}' and Turn eq '${turn}' and (Status ne 'Cancelada')`,
    } as any);
    const arr = (res?.data ?? res?.value ?? []) as any[];
    return arr.length > 0;
  }, []);

  // Crear reserva puntual (usa rvName/rvMail — que pueden venir del selector)
  const onCreateReservation = React.useCallback(
    async () => {
      if (!slot) return;
      if (!rvName && !rvMail) {
        setRvError('Indica al menos nombre o correo del usuario a reservar.');
        return;
      }
      setRvSaving(true);
      setRvError(null);
      try {
        const busy = await isBusy(slot.Id, rvDate, rvTurn);
        if (busy) {
          setRvError('Ya existe una reserva para esa fecha y turno en esta celda.');
          setRvSaving(false);
          return;
        }

        await ReservationsService.create({
          SpotId: { Id: Number(slot.Id) },
          Date: rvDate,
          Turn: rvTurn,
          Status: 'Pendiente',
          NombreUsuario: rvName || rvMail,
          Title: rvMail || '',
          VehicleType: slot.TipoCelda,
        } as any);

        await onChanged?.();              // refresca la lista
        alert('Reserva creada correctamente.');
        onClose();                        // ⬅️ cerrar modal aquí
      } catch (e: any) {
        setRvError(e?.message ?? 'No fue posible crear la reserva.');
      } finally {
        setRvSaving(false);
      }
    },
    [slot, rvDate, rvTurn, rvName, rvMail, isBusy, onChanged, onClose]
  );


  // ===== Render =====
  if (!open || !slot) return null;

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div style={S.backdrop} onMouseDown={onBackdrop}>
      <div style={S.modal}>
        <header style={S.header}>
          <h3 style={S.title}>Celda {slot.Title}</h3>
          <button style={S.closeBtn} onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </header>

        <div style={S.body}>
          <div>
            <strong>Tipo:</strong> {slot.TipoCelda}
          </div>
          <div>
            <strong>Estado:</strong> {slot.Activa}
          </div>
          <div style={S.muted as React.CSSProperties}>
            <strong>Itinerancia:</strong> {slot.Itinerancia ?? '—'} &nbsp;→&nbsp;
            <strong>{mode === 'reserva' ? 'Modo Reserva (turno)' : 'Modo Asignación fija'}</strong>
          </div>

          {/* ===== Asignación fija (SIN cambios en tu flujo) ===== */}
          {mode === 'fijar' && (
            <div style={S.card}>
              <h4 style={{ margin: 0 }}>Asignación fija</h4>
              {loading && <div style={S.muted}>Cargando…</div>}
              {error && <div style={{ color: 'crimson' }}>{error}</div>}

              {!loading && (
                <>
                  {assignee ? (
                    <div style={S.rowBetween}>
                      <div>
                        <div>
                          <strong>Asignado a:</strong> {assignee.name}
                        </div>
                        {assignee.email && <div style={S.muted}>{assignee.email}</div>}
                      </div>
                      <button style={S.btnDanger} onClick={onUnassign}>
                        Desasignar
                      </button>
                    </div>
                  ) : (
                    <div style={S.rowBetween}>
                      <div style={S.muted}>Sin asignación</div>
                      <button style={S.btnPrimary} onClick={() => setPickerOpen(true)}>
                        Asignar
                      </button>
                    </div>
                  )}
                </>
              )}

              {pickerOpen && (
                <div style={S.pickerPanel}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      style={S.input}
                      placeholder="Buscar colaborador (nombre o correo)…"
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                    />
                    <button style={S.btnPrimary} onClick={doSearch} disabled={searching}>
                      {searching ? 'Buscando…' : 'Buscar'}
                    </button>
                    <button
                      style={S.btnGhost}
                      onClick={() => {
                        setPickerOpen(false);
                        setTerm('');
                        setResults([]);
                      }}
                    >
                      Cerrar
                    </button>
                  </div>

                  <ul style={S.list}>
                    {results.length === 0 && !searching && <li style={S.muted}>Sin resultados</li>}
                    {results.map((c) => (
                      <li key={c?.id} style={S.listItem}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{c?.name}</div>
                          {c?.email && <div style={S.muted}>{c.email}</div>}
                        </div>
                        <button style={S.btnPrimary} onClick={() => onAssign(c)}>
                          Asignar
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ===== Reserva puntual (con selector de colaboradores) ===== */}
          {mode === 'reserva' && (
            <div style={S.card}>
              <h4 style={{ margin: 0 }}>Reserva puntual por turno</h4>
              <div style={{ ...S.muted, marginBottom: 8 }}>
                Crea una reserva para un <strong>día</strong> y <strong>turno</strong> (AM/PM).
              </div>

              {/* Selector de colaborador SOLO para reserva */}
              <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                <label style={{ ...S.labelCol, marginBottom: 6 }}>
                  <span><strong>Colaborador</strong></span>
                  <input style={S.input} type="text" placeholder="Buscar por nombre/correo/cargo…" value={colabTerm}onChange={(e) => setColabTerm(e.target.value)}disabled={workersLoading}/>
                </label>
                <select style={S.select} value={selectedWorkerId} onChange={(e) => onSelectWorker(e.target.value)} disabled={workersLoading}>
                  <option value="">
                    {workersLoading
                    ? 'Cargando colaboradores…'
                    : filteredWorkers.length === 0
                      ? 'Sin resultados'
                      : 'Selecciona un colaborador (opcional)'}
                  </option>

                  {filteredWorkers.map((w) => (
                    <option key={w.key} value={w.key}>
                      {w.name}{w.job ? ` · ${w.job}` : ''}
                     </option>
                  ))}
                </select>
                <br />
                <small style={S.muted}>
                  Al seleccionar, se rellenan Nombre y Correo (puedes editarlos).
                </small>
              </fieldset>

              {rvError && <div style={{ color: 'crimson' }}>{rvError}</div>}

              <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                <label style={S.labelCol}>
                  <span><strong>Fecha</strong></span>
                  <input
                    type="date"
                    style={S.input}
                    value={rvDate}
                    onChange={(e) => setRvDate(e.target.value)}
                    min={todayISO}
                  />
                </label>

                <label style={S.labelCol}>
                  <span><strong>Turno</strong></span>
                  <select
                    style={S.select}
                    value={rvTurn}
                    onChange={(e) => setRvTurn(e.target.value as 'Manana' | 'Tarde')}
                  >
                    <option value="Manana">AM (06:00–12:59)</option>
                    <option value="Tarde">PM (13:00–19:00)</option>
                  </select>
                </label>

                <div style={{ display: 'grid', gap: 8 }}>
                  <label style={S.labelCol}>
                    <span><strong>Nombre</strong></span>
                    <input
                      style={S.input}
                      value={rvName}
                      onChange={(e) => setRvName(e.target.value)}
                      placeholder="Nombre del usuario"
                    />
                  </label>
                  <label style={S.labelCol}>
                    <span><strong>Correo</strong></span>
                    <input
                      style={S.input}
                      type="email"
                      value={rvMail}
                      onChange={(e) => setRvMail(e.target.value)}
                      placeholder="correo@empresa.com"
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button
                    style={S.btnGhost}
                    type="button"
                    onClick={() => {
                      setRvDate(todayISO);
                      setRvTurn('Manana');
                      setRvName(assignee?.name ?? '');
                      setRvMail(assignee?.email ?? '');
                      setRvError(null);
                      setColabTerm('');
                      setSelectedWorkerId('');
                    }}
                  >
                    Limpiar
                  </button>
                  <button style={S.btnPrimary} type="button" onClick={onCreateReservation} disabled={rvSaving}>
                    {rvSaving ? 'Creando…' : 'Crear reserva'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer style={S.footer}>
          <button style={S.btnGhost} onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}
