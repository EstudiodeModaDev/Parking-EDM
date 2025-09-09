// settingsPort.ts
import { SettingsService } from '../Services/SettingsService';
import type { IOperationResult } from '@pa-client/power-code-sdk/lib/';

// Tu modelo de UI (lo que el componente necesita)
export type SettingsForm = {
  VisibleDays: number;
  TyC: string
};

// Lo que el componente recibirá de "getOne": campos + ID
export type SettingsRecord = SettingsForm & { ID: string };

// Helper para extraer el valor del IOperationResult<T>
// Ajusta las propiedades (.value/.record/.data) según tu SDK real
function unwrap<T>(res: IOperationResult<T>): T {
  return (res as any).value ?? (res as any).record ?? (res as any).data ?? (res as any);
}


export type SettingsPort = {
  getOne: () => Promise<SettingsRecord>;
  update: (id: string, changes: Partial<SettingsForm>) => Promise<void>;
};

export function makeSettingsPortSingle(): SettingsPort {
  return {
    async getOne() {
      const res = await SettingsService.getAll({ top: 1 });
      const list = unwrap(res) as any[];
      if (!list || !list.length) {
        // crea con los nombres REALES de la fuente
        const created = await SettingsService.create({
          VisibleDays: 7,
          MaxAdvanceHours: 72,
          MaxUserTurns: 3,
          TerminosyCondiciones: ""   // <- importante
        } as any);
        const rec = unwrap(created) as any;
        return {
          ID: String(rec.ID),
          VisibleDays: Number(rec.VisibleDays ?? 7),
          TyC: String(rec.TerminosyCondiciones ?? "")
        };
      }

      const rec = list[0];
      return {
        ID: String(rec.ID),
        VisibleDays: Number(rec.VisibleDays ?? 7),
        TyC: String(rec.TerminosyCondiciones ?? "")
      };
    },

    async update(id, changes) {
      // mapear nombres de UI -> nombres reales del backend
      const payload: any = {};
      if (changes.VisibleDays !== undefined) payload.VisibleDays = changes.VisibleDays;
      if (changes.TyC !== undefined) payload.TerminosyCondiciones = changes.TyC;

      const res = await SettingsService.update(id, payload);
      unwrap(res);
    },
  };
}