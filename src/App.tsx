//Import Generales
import { useEffect, useMemo, useState } from 'react';
import './App.css';

//Imports tipos
//import type { IGetAllOptions } from './Models/CommonModels';

//Imports services
import { Office365UsersService } from './Services/Office365UsersService';
import { SharedServices } from './Services/sharedService';
import { makeSettingsPortSingle } from './adapters/settings';
//import { UsuariosService } from './Services/UsuariosService';


//Imports de componentes
import Availability from './components/Reservar/Reservar';
import MisReservas from './components/Mis-Reservas/mis-reservas';
import AdminCells from './components/Admin-Cells/admin-cells';
import AdminSettings from './components/Admin-Settings/AdminSettings';
import ColaboradoresInscritos from './components/Colaboradores-Permanentes/Colaboradores';
import { ToastProvider } from './components/Toast/ToasProvider';
import Reportes from './components/Reportes/reportes';
import { UsuariosService } from './Services/UsuariosService';
import type { IGetAllOptions } from './Models/CommonModels';

//Pestañas del nav
const NAVS = [
  { key: 'misreservas', label: 'Reservas', visible: 'admin' },
  { key: 'celdas', label: 'Celdas', visible: 'admin' },
  { key: 'admin', label: 'Administración', visible: 'admin' },
  { key: 'colaboradores', label: 'Colaboradores', visible: 'admin' },
  { key: 'reportes', label: 'Reportes', visible: 'admin' },
] as const;

type NavKey = typeof NAVS[number]['key'];

//Info del usuario
type User = {
  displayName?: string;
  mail?: string;
  jobTitle?: string;
} | null;


//Cambiar tipo de usuario
export async function changeUser(userEmail: string) {
  const email = (userEmail ?? '').trim();
  if (!email) throw new Error('userEmail requerido');

  // Escapar comillas simples para OData
  const emailSafe = email.replace(/'/g, "''");

  const opt: IGetAllOptions = {
    filter: `Title eq '${emailSafe}'`,
    top: 1 as any,
};

  // 1) Buscar usuario
  const res = await UsuariosService.getAll(opt as any);
  const rows = (res as any)?.data ?? (res as any)?.value ?? [];
  const user = Array.isArray(rows) ? rows[0] : null;
  if (!user) throw new Error(`Usuario no encontrado: ${email}`);

  // 2) Tomar ID y rol actual
  const id = user.ID ?? user.Id ?? user.id;
  if (id == null) throw new Error('El usuario no tiene ID');

  const currentRol = String(user.Rol ?? user.rol ?? '').toLowerCase();
  const nextRol = currentRol === 'admin' ? 'Usuario' : 'admin';

  // 3) Actualizar
  const upd = await UsuariosService.update(String(id), { Rol: nextRol } as any);
  const ok = ('ok' in upd) ? upd.ok : (('success' in upd) ? upd.success : true);

  return { ok, id, email, before: currentRol, after: nextRol };
}


export default function App() {
  const [selected, setSelected] = useState<NavKey>('celdas'); //Default Selected
  const [user, setUser] = useState<User>(null); //UserINfo
  const [userLoading, setUserLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null); //UserRole

  const settingsPort = useMemo(() => makeSettingsPortSingle(), []);

  //Cargar perfil
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
        const role = await SharedServices.getRole(mail);
        if (!cancel) setUserRole(role);
      } catch (e) {
        console.error(e);
        if (!cancel) setUserRole(null);
      }
    })();
    return () => { cancel = true; };
  }, [user?.mail]);

  const handleNavClick = (key: NavKey) => setSelected(key);

  // ====== GUARDAS DE VISUALIZACIÓN ======

  // 1) Aún cargando usuario/rol
  if (userLoading || userRole === null) {
    return (
      <div className="center muted" style={{ padding: 24 }}>
        Cargando permisos…
      </div>
    );
  }

  // 2) No es admin → mostrar solo Reservar y Mis Reservas, sin navegación admin
  if (userRole !== 'admin') {
    return (
      <ToastProvider>
        <div className="page">
          {/* Sección de usuario */}
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
                        <div className="userMail">{userRole ?? '—'}</div>
                        {user.jobTitle && <div className="userTitle">{user.jobTitle}</div>}
                      </>
                    ) : (
                      <div className="errorText">No se pudo cargar el usuario</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          {/* Sección principal */}
          <main className="main">
            {user?.mail ? (
              <>
                <div className="center">
                  <h2>Reservar Parqueadero</h2>
                  <Availability userEmail={user.mail} userName={user.displayName!} />
                </div>

                <MisReservas userMail={user.mail} isAdmin={false} />
              </>
            ) : (
              <div className="center muted" style={{ padding: 24 }}>
                No pudimos cargar tu usuario. Intenta recargar.
              </div>
            )}
          </main>
        </div>
      </ToastProvider>
    );
  }



  const visibleNavs = NAVS; 

  return (
    <ToastProvider>
      <div className="page">
        {/* Sección de usuario */}
        <div className="section userCard">
          <div className="avatar">
            {user?.displayName ? user.displayName[0] : <span>?</span>}
          </div>
          <div className="userInfo">
            {user ? (
              <>
                <div className="userName">{user.displayName}</div>
                <div className="userMail">{user.mail}</div>
                <div className="userMail">admin</div>
                {user.jobTitle && <div className="userTitle">{user.jobTitle}</div>}
              </>
            ) : (
              <div className="errorText">No se pudo cargar el usuario</div>
            )}
          </div>
        </div>

        {/* Navegación */}
        <nav className="nav">
          {visibleNavs.map((nav) => (
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

          <button onClick={() => changeUser(user?.mail!)}>Cambiar</button>
        {/* Contenido */}
        <main className="main">
          {selected === 'misreservas' && user?.mail && (
            <MisReservas userMail={user.mail} isAdmin />
          )}

          {selected === 'celdas' && <AdminCells />}

          {selected === 'admin' && (
            <div className="center">
              <h2>Administración</h2>
              <AdminSettings port={settingsPort} />
            </div>
          )}

          {selected === 'colaboradores' && (
            <div className="center">
              <h2>Colaboradores</h2>
              <ColaboradoresInscritos />
            </div>
          )}

          {selected === 'reportes' && <Reportes></Reportes>}
        </main>
      </div>
    </ToastProvider>
  );
}
