import { useEffect, useMemo, useState } from 'react';
import './App.css';

import { Office365UsersService } from './Services/Office365UsersService';
import { SharedServices } from './Services/sharedService';
import { makeSettingsPortSingle } from './adapters/settings';

import Availability from './components/Reservar/Reservar';
import MisReservas from './components/Mis-Reservas/mis-reservas';
import AdminCells from './components/Admin-Cells/admin-cells';
import AdminSettings from './components/Admin-Settings/AdminSettings';
import ColaboradoresInscritos from './components/Colaboradores-Permanentes/Colaboradores';
import { ToastProvider } from './components/Toast/ToasProvider';
import Reportes from './components/Reportes/reportes';
import PicoPlacaAdmin from './components/PicoPlaca/PicoPlaca';

import { UsuariosService } from './Services/UsuariosService';
import type { IGetAllOptions } from './Models/CommonModels';

// NAV solo para admin
const NAVS_ADMIN = [
  { key: 'misreservas', label: 'Reservas' },
  { key: 'celdas', label: 'Celdas' },
  { key: 'admin', label: 'Administración' },
  { key: 'pyp', label: 'Pico y placa' },
  { key: 'colaboradores', label: 'Colaboradores' },
  { key: 'reportes', label: 'Reportes' },
] as const;
type AdminNavKey = typeof NAVS_ADMIN[number]['key'];
type NavKey = AdminNavKey;

// Info del usuario
type User = {
  displayName?: string;
  mail?: string;
  jobTitle?: string;
} | null;

// Cambiar tipo de usuario
export async function changeUser(userEmail: string) {
  const email = (userEmail ?? '').trim();
  if (!email) throw new Error('userEmail requerido');
  const emailSafe = email.replace(/'/g, "''");

  const opt: IGetAllOptions = { filter: `Title eq '${emailSafe}'`, top: 1 as any };
  const res = await UsuariosService.getAll(opt as any);
  const rows = (res as any)?.data ?? (res as any)?.value ?? [];
  const user = Array.isArray(rows) ? rows[0] : null;
  if (!user) throw new Error(`Usuario no encontrado: ${email}`);

  const id = user.ID ?? user.Id ?? user.id;
  if (id == null) throw new Error('El usuario no tiene ID');

  const currentRol = String(user.Rol ?? user.rol ?? '').toLowerCase();
  const nextRol = currentRol === 'admin' ? 'Usuario' : 'admin';

  const upd = await UsuariosService.update(String(id), { Rol: nextRol } as any);
  const ok = ('ok' in upd) ? upd.ok : (('success' in upd) ? upd.success : true);
  return { ok, id, email, before: currentRol, after: nextRol };
}

export default function App() {
  const [selected, setSelected] = useState<NavKey>('misreservas'); // default para admin
  const [user, setUser] = useState<User>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null); // 'admin' | 'usuario' | null

  const settingsPort = useMemo(() => makeSettingsPortSingle(), []);

  // Cargar perfil
  useEffect(() => {
    let cancel = false;
    setUserLoading(true);
    (async () => {
      try {
        const res = await Office365UsersService.MyProfile_V2('displayName,mail,jobTitle');
        if (cancel) return;
        if (!res?.success) throw new Error(res?.errorMessage || 'MyProfile_V2 no fue ok');
        setUser({
          displayName: res.data?.displayName ?? res.value?.DisplayName,
          mail: res.data?.mail ?? res.value?.userPrincipalName ?? res.value?.Mail,
          jobTitle: res.data?.jobTitle ?? res.value?.JobTitle,
        });
      } catch (e) {
        if (!cancel) setUser(null);
        console.error(e);
      } finally {
        if (!cancel) setUserLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  // Reset rol si cambia el mail
  useEffect(() => { setUserRole(null); }, [user?.mail]);

  // Cargar rol
  useEffect(() => {
    const mail = user?.mail;
    if (!mail) return;
    let cancel = false;
    (async () => {
      try {
        const role = await SharedServices.getRole(mail); // devuelve 'admin' o 'usuario'
        if (!cancel) {
          setUserRole(role);
          // Si es admin y no hay selección válida, deja 'misreservas' por defecto
          if (role === 'admin') setSelected(prev => prev ?? 'misreservas');
        }
      } catch (e) {
        console.error(e);
        if (!cancel) setUserRole('usuario'); // fallback conservador: sin nav
      }
    })();
    return () => { cancel = true; };
  }, [user?.mail]);

  const isAdmin = userRole === 'admin';
  const handleNavClick = (key: NavKey) => setSelected(key);

  // ====== Loading ======
  if (userLoading || userRole === null) {
    return (
      <div className="center muted" style={{ padding: 24 }}>
        Cargando permisos…
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="page">
        {/* ===== HEADER ÚNICO ===== */}
        <div className="section userCard">
          <div className="userRow">
            <div className="brand">
              <h1>PARKING EDM</h1>
            </div>

            <div className="userCluster">
              <div className="avatar">
                {user?.displayName ? user.displayName[0] : <span>?</span>}
              </div>
              <div className="userInfo">
                {user ? (
                  <>
                    <div className="userName">{user.displayName}</div>
                    <div className="userMail">{user.mail}</div>
                    <div className="userMail">{isAdmin ? 'admin' : 'usuario'}</div>
                    {user.jobTitle && <div className="userTitle">{user.jobTitle}</div>}
                  </>
                ) : (
                  <div className="errorText">No se pudo cargar el usuario</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <button onClick={() => changeUser(user?.mail!)}>Cambiar usuario</button>
        {/* ===== NAV SOLO PARA ADMIN ===== */}
        {isAdmin && (
          <nav className="nav">
            {NAVS_ADMIN.map((nav) => (
              <button
                key={nav.key}
                onClick={() => handleNavClick(nav.key)}
                className="navBtn"
                style={{
                  background: selected === nav.key ? '#38bdf8' : '#fff',
                  color: selected === nav.key ? '#fff' : '#2563eb',
                  boxShadow: selected === nav.key ? '0 2px 8px #38bdf855' : 'none',
                }}
              >
                {nav.label}
              </button>
            ))}
          </nav>
        )}

        {/* ===== MAIN ===== */}
        <main className="main">
          {/* Usuario (NO admin): no hay nav; muestra Reservar + Mis Reservas en la misma página */}
          {!isAdmin && user?.mail && (
            <>
              <div className="center">
                <h2>Reservar Parqueadero</h2>
                <Availability userEmail={user.mail} userName={user.displayName!} />
              </div>
              <MisReservas userMail={user.mail} isAdmin={false} />
            </>
          )}

          {/* Admin: contenido según pestaña */}
          {isAdmin && selected === 'misreservas' && user?.mail && (
            <MisReservas userMail={user.mail} isAdmin />
          )}

          {isAdmin && selected === 'celdas' && <AdminCells />}

          {isAdmin && selected === 'admin' && (
            <div className="center">
              <h2>Administración</h2>
              <AdminSettings port={settingsPort} />
            </div>
          )}

          {isAdmin && selected === 'colaboradores' && (
            <div className="center">
              <h2>Colaboradores</h2>
              <ColaboradoresInscritos />
            </div>
          )}

          {isAdmin && selected === 'reportes' && <Reportes />}

          {isAdmin && selected === 'pyp' && (
            <div className="center">
              <h2>Pico y placa</h2>
              <PicoPlacaAdmin />
            </div>
          )}
        </main>
      </div>
    </ToastProvider>
  );
}
