// hooks/useWorkers.ts
import * as React from 'react';
import { Office365UsersService } from '../Services/Office365UsersService';

export type Worker = {
  id: string;
  displayName: string;
  mail?: string;
  jobTitle?: string;
};

const cache: { data: Worker[] | null; promise: Promise<Worker[]> | null } = {
  data: null,
  promise: null,
};

const norm = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

function mapRaw(u: any, i: number): Worker {
  const id =
    u.id ?? u.Id ?? u.userId ?? u.userPrincipalName ?? u.Mail ?? u.mail ?? i;
  return {
    id: String(id),
    displayName: String(u.displayName ?? u.DisplayName ?? u.Name ?? '—'),
    mail: u.mail ?? u.userPrincipalName ?? u.Mail ?? '',
    jobTitle: u.jobTitle ?? u.JobTitle ?? '',
  };
}

async function fetchWorkers(): Promise<Worker[]> {
  if (cache.data) return cache.data;
  if (!cache.promise) {
    cache.promise = Office365UsersService.SearchUserV2()
      .then((res: any) => {
        const arr = Array.isArray(res?.data.value) ? res.data.value
                  : Array.isArray(res?.value) ? res.value
                  : [];
        const mapped = arr.map(mapRaw);
        cache.data = mapped;
        return mapped;
      })
      .finally(() => { cache.promise = null; });
  }
  return cache.promise;
}

export function useWorkers() {
  const [workers, setWorkers] = React.useState<Worker[]>(cache.data ?? []);
  const [loading, setLoading] = React.useState(!cache.data);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancel = false;

    // ✅ si ya hay cache, úsalo y sal:
    if (cache.data) {
      setWorkers(cache.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchWorkers()
      .then((data) => { if (!cancel) setWorkers(data); })
      .catch((e) => { if (!cancel) setError(e?.message ?? 'Error cargando usuarios'); })
      .finally(() => { if (!cancel) setLoading(false); });

    return () => { cancel = true; };
  }, []);

  // Filtro local normalizado (por si lo quieres usar fuera también)
  const filter = React.useCallback((term: string) => {
    if (!term) return workers;
    const q = norm(term);
    return workers.filter((w) =>
      norm(`${w.displayName} ${w.jobTitle ?? ''}`).includes(q)
    );
  }, [workers]);

  // ✅ refresh que fuerza carga (e.g., antes de abrir el modal)
  const refresh = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ignora cache y fuerza una nueva promesa
      cache.data = null;
      const data = await fetchWorkers();
      setWorkers(data);
    } catch (e: any) {
      setError(e?.message ?? 'Error recargando usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  return { workers, loading, error, filter, refresh };
}
