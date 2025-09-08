import type { VehicleType } from '../adapters/shared';
import { ColaboradoresFijosService } from '../Services/ColaboradoresFijosService';
import { normalizeResult } from './utils';

/** Representa a la persona asignada o candidata a asignación */
export type Assignee = {
  id: number;
  name: string;
  email?: string;
} | null;

const MAX = 2000;
const norm = (s: unknown) => String(s ?? '').trim().toLowerCase();


//Funcion para saber quien tiene asignado x slot
export async function fetchAssignee(slotId: number): Promise<Assignee> {
  if (!slotId) return null;

  const res: any = await ColaboradoresFijosService.getAll({
    select: ['ID', 'Title', 'DisplayName', 'Email', 'EMail', 'SpotAsignado', 'Tipodevehiculo'] as any,
    top: 1 as any,
    filter: `SpotAsignado eq ${Number(slotId)}` as any,
  });

  const { ok, data, errorMessage } = normalizeResult(res);
  if (!ok) throw new Error(errorMessage || 'No se pudo consultar la asignación');

  const rows = Array.isArray(data) ? data : [];
  if (rows.length === 0) return null;

  const r = rows[0];
  return {
    id: Number(r.ID ?? r.Id ?? r.id),
    name: String(r.Title ?? ''),
    email: (r.Correo ?? '') || undefined,
  };
}

//Asignación
export async function assignSlotToCollaborator(slotId: number, collaboratorId: number, slotTitle: string): Promise<void> {
  if (!slotId || !collaboratorId) {
    throw new Error('Parámetros inválidos para asignación.');
  }

  const res: any = await ColaboradoresFijosService.update(String(collaboratorId), { SpotAsignado: Number(slotId), CodigoCelda: slotTitle } as any,);

  const { ok, errorMessage } = normalizeResult(res);
  if (!ok) throw new Error(errorMessage || 'No se pudo realizar la asignación');
}


//Desasignar una celda
export async function unassignSlotFromCollaborator(slotId: number): Promise<void> {
  if (!slotId) throw new Error('ID de celda inválido.');
  const current = await fetchAssignee(slotId);
  if (!current) return; 

  const res: any = await ColaboradoresFijosService.update(
    String(current.id),
    { SpotAsignado: null, CodigoCelda: null} as any 
  );

  const { ok, errorMessage } = normalizeResult(res);
  if (!ok) throw new Error(errorMessage || 'No se pudo desasignar la celda');
}

//Buscar colaboradores sin asignar
export async function searchUnassignedCollaborators(term: string, vehicleType?:  VehicleType): Promise<Assignee[]> {
  const termSafe = (term || '').replace(/'/g, "''");
  const filters: string[] = [];

  filters.push('(SpotAsignado eq null or SpotAsignado eq 0)');

  if (termSafe) {
    filters.push(
      `(substringof('${termSafe}', Title) or substringof('${termSafe}', Correo))`
    );
  }

  // Filtro por tipo de vehículo (si existe columna TipoVehiculo)
  if (vehicleType) {
    filters.push(`Tipodevehiculo eq '${vehicleType}'`);
  }

  const filterStr = filters.join(' and ');

  const res: any = await ColaboradoresFijosService.getAll({
    select: ['ID', 'Title', 'DisplayName', 'Email', 'EMail', 'SpotAsignado', 'Tipodevehiculo'] as any,
    top: MAX as any,
    orderBy: ['Title asc'] as any,
    filter: filterStr as any,
  });

  const { ok, data, errorMessage } = normalizeResult(res);
  if (!ok) throw new Error(errorMessage || 'No se pudo buscar colaboradores');

  const rows = Array.isArray(data) ? data : [];

  // Defensa extra en cliente por si el backend no filtra TipoVehiculo
  const rowsFiltered = vehicleType
    ? rows.filter((r: any) => norm(r.Tipodevehiculo) === norm(vehicleType))
    : rows;

  return rowsFiltered.map((r: any) => ({
    id: Number(r.ID ?? r.Id ?? r.id),
    name: String(r.DisplayName ?? r.Title ?? ''),
    email: (r.Email ?? r.EMail ?? '') || undefined,
  }));
}
