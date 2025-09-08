import type { IGetAllOptions } from "../Models/CommonModels";
import { UsuariosService } from "./UsuariosService";

export class SharedServices{
    
    public static async getRole(userEmail: string): Promise<string> {
    if (!userEmail) return "Usuario";

    // Escapar comillas simples para evitar romper el filtro
    const emailSafe = String(userEmail).replace(/'/g, "''");

    const options: IGetAllOptions = {
        // Busca por Title == email (ajusta si tu columna es otra)
        filter: `Title eq '${emailSafe}'`,
        select: ['ID', 'Title', 'Rol'] as any,
        top: 1 as any,                      
    };

    try {
        const res: any = await UsuariosService.getAll(options);

        const data = Array.isArray(res?.data) ? res.data
                    : Array.isArray(res?.value) ? res.value
                    : Array.isArray(res)        ? res
                    : [];

        const first = data[0];
        if (!first) return "Usuario";

        // Mapea con tolerancia de mayúsculas/minúsculas
        const rol = first.Rol;

        return rol ?? "Usuario";
    } catch (err) {
        console.error('[UsuariosService.getRole] error:', err);
        return "Usuario"; // o relanza si prefieres: throw err;
    }
    }
}