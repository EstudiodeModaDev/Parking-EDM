// src/hooks/useReporteria.ts
import * as React from 'react';
import { ReservationsService } from '../Services/ReservationsService';
import { ParkingSlotsService } from '../Services/ParkingSlotsService';
import type { Filtros, ReservaUI } from '../adapters/reportes.adapter';
import { todayISO } from '../utils/date';
import { normalizeResult } from './utils';


const MOTO_CAPACITY = 1;


export function useReporteria() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // datos
  const [rows, setRows] = React.useState<ReservaUI[]>([]);

  // aforo
  const [capacidadTotal, setCapacidadTotal] = React.useState<number>(0);
  const [aforoPct, setAforoPct] = React.useState<number>(0);

  // filtros
  const [filters, setFilters] = React.useState<Filtros>({
    desde: todayISO(),
    hasta: todayISO(),
    persona: '',
    tipoVehiculo: '',
  });

  const onChange = (patch: Partial<Filtros>) =>
    setFilters(prev => ({ ...prev, ...patch }));

  // Carga capacidad total (carros=1, motos=4 por celda)
  const loadCapacidad = React.useCallback(async () => {
    const res = await ParkingSlotsService.getAll({
      select: ['ID', 'Title', 'TipoCelda', 'Activa'] as any,
      top: 2000 as any,
      filter: `Activa eq 'Activa'`,
    } as any);

    const items = normalizeResult(res);
    let carros = 0;
    let motos = 0;
    for (const r of items.data) {
      const tipo = String(r.TipoCelda ?? r.tipoCelda ?? '').toLowerCase();
      if (tipo === 'carro') carros += 1;
      else if (tipo === 'moto') motos += 1;
    }
    const capacidad = carros * 1 + motos * MOTO_CAPACITY; //Numero de vehiculos que se pueden alojar
    setCapacidadTotal(capacidad);
  }, []);

  // Carga reservas con filtros
  const loadReservas = React.useCallback(async () => {
    const { desde, hasta, persona, tipoVehiculo } = filters;

    const parts: string[] = [
      `(Status ne 'Cancelada')`,
      `Date ge '${desde}'`,
      `Date le '${hasta}'`,
    ];
    if (tipoVehiculo) parts.push(`VehicleType eq '${tipoVehiculo}'`);

    const res = await ReservationsService.getAll({
      select: ['ID', 'Title', 'Date', 'Turn', 'SpotId', 'VehicleType', 'Status'] as any,
      orderBy: ['Date asc', 'Turn asc'] as any,
      top: 2000 as any,
      filter: parts.join(' and '),
      expand: ['SpotId'] as any, // si tu conector lo soporta
    } as any);

    const items = normalizeResult(res);

    const mapped: ReservaUI[] = items.data.map((r: any) => ({
      Id: Number(r.ID ?? r.Id ?? 0),
      Fecha: String(r.Date ?? '').slice(0, 10),
      Turno: String(r.Turn ?? ''),
      Celda:
        r.SpotId?.Title ??
        r.Spot?.Title ??
        r.SpotName ??
        String(r.SpotId?.Id ?? r.SpotId ?? ''),
      SpotId: Number(r.SpotId?.Id ?? r.SpotId ?? 0),
      TipoVehiculo: (r.VehicleType ?? '') as any,
      Usuario: String(r.Title ?? ''),
      Estado: String(r.Status ?? ''),
    }));

    const personaTerm = persona.trim().toLowerCase();
    const filtered = personaTerm
      ? mapped.filter(m => m.Usuario.toLowerCase().includes(personaTerm))
      : mapped;

    setRows(filtered);
  }, [filters]);

  

  // Aforo: unidades equivalentes / capacidad
  React.useEffect(() => {
    if (!capacidadTotal || capacidadTotal <= 0) {
      setAforoPct(0);
      return;
    }
    let unidades = 0;
    for (const r of rows) {
      const tv = String(r.TipoVehiculo).toLowerCase();
      if (tv === 'carro') unidades += 1;
      else if (tv === 'moto') unidades += 1
      else unidades += 1;
    }
    const pct = Math.min(100, Math.round(   (unidades / capacidadTotal) * 100));
    setAforoPct(Number.isFinite(pct) ? pct : 0);
  }, [rows, capacidadTotal]);

  // Carga inicial
  React.useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        await loadCapacidad();
        await loadReservas();
      } catch (e: any) {
        if (!cancel) setError(e?.message ?? 'Error cargando reportería');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-cargar al cambiar filtros
  React.useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        await loadReservas();
      } catch (e: any) {
        if (!cancel) setError(e?.message ?? 'Error cargando reservas');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, [loadReservas]);

  return {
    // estado
    loading, error, rows, aforoPct, capacidadTotal,
    // filtros
    filters, setFilters, onChange,
    // loaders (por si quieres forzar recargas)
    loadReservas, loadCapacidad,
  };
}
