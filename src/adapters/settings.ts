// settingsPort.ts
import { SettingsService } from '../Services/SettingsService';
import type { IOperationResult } from '@pa-client/power-code-sdk/lib/';

// Tu modelo de UI (lo que el componente necesita)
export type SettingsForm = {
  VisibleDays: number;
  TyC: string;
  InicioManana: number,
  FinalManana: number,
  InicioTarde: number,
  FinalTarde: number
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
          TerminosyCondiciones: "",
          InicioHorarioMa_x00f1_ana: 7, //Inicio horario mañana
          FinalMa_x00f1_ana: 12, //Final horario mañana
          InicioTarde: 12,
          FinalTarde: 18
        } as any);
        const rec = unwrap(created) as any;
        return {
          ID: String(rec.ID),
          VisibleDays: Number(rec.VisibleDays ?? 7),
          TyC: String(rec.TerminosyCondiciones ?? ""),
          InicioManana: Number(rec.InicioHorarioMa_x00f1_ana),
          FinalManana: Number(rec.FinalMa_x00f1_ana),
          InicioTarde: Number(rec.InicioTarde),
          FinalTarde: Number(rec.FinalTarde),
        };
      }

      const rec = list[0];
      return {
          ID: String(rec.ID),
          VisibleDays: Number(rec.VisibleDays ?? 7),
          TyC: String(rec.TerminosyCondiciones ?? ""),
          InicioManana: Number(rec.InicioHorarioMa_x00f1_ana),
          FinalManana: Number(rec.FinalMa_x00f1_ana),
          InicioTarde: Number(rec.InicioTarde),
          FinalTarde: Number(rec.FinalTarde),
      };
    },

    async update(id, changes) {
      // mapear nombres de UI -> nombres reales del backend
      const payload: any = {};
      if (changes.VisibleDays !== undefined) payload.VisibleDays = changes.VisibleDays;
      if (changes.TyC !== undefined) payload.TerminosyCondiciones = changes.TyC;
      if (changes.InicioManana !== undefined) payload.InicioHorarioMa_x00f1_ana = changes.InicioManana;
      if (changes.FinalManana !== undefined) payload. FinalMa_x00f1_ana = changes.FinalManana;
      if (changes.InicioTarde !== undefined) payload.InicioTarde = changes.InicioTarde;
      if (changes.FinalTarde !== undefined) payload.FinalTarde = changes.FinalTarde;

      const res = await SettingsService.update(id, payload);
      unwrap(res);
    },
  };
}