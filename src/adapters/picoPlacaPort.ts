// src/adapters/picoPlacaPort.ts
import { PicoyPlacaService } from '../Services/PicoyPlacaService';

export type PicoPlacaRow = {
  ID: string;       
  Title: string;    // Dia Lunes = 1, Martes = 2, Miercoles =3 ... Viernes = 5
  Moto: string;     // ej: "6,9" Excluciones  moto
  Carro: string;    // ej: "6,9" Excluciones carro
};

export type PicoPlacaPort = {
  getAll: () => Promise<PicoPlacaRow[]>;
  update: (id: string, changes: Partial<Pick<PicoPlacaRow,'Moto'|'Carro'>>) => Promise<void>;
};

export function makePicoPlacaPort(): PicoPlacaPort {
  return {
    async getAll() {
      const items = await PicoyPlacaService.getAll();
      const data = items.data
      return (data as any[]).map(i => ({
        ID: String(i.ID),
        Title: String(i.Title ?? ''),
        Moto: String(i.Moto ?? ''),
        Carro: String(i.Carro ?? ''),
      })).sort((a,b) => Number(a.Title) - Number(b.Title));
    },
    async update(id, changes) {
      const payload: any = {};
      if (changes.Moto !== undefined)  payload.Moto  = changes.Moto;
      if (changes.Carro !== undefined) payload.Carro = changes.Carro;
      await PicoyPlacaService.update(id, payload);
    },
  };
}
