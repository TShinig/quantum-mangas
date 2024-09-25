import { NavLink, Outlet } from "@remix-run/react";
import { useEffect, useLayoutEffect } from "react";

export default function layout() {

  function changeTheme(theme?: string) {
    if (theme) {
      localStorage.theme = theme;
    } else {
      localStorage.removeItem('theme');
    }
  }

  useEffect(() => {
    function checkUserData() {
      const theme = localStorage.getItem('theme');

      if(theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    checkUserData();
    window.addEventListener('storage', checkUserData)

    return () => {
      window.removeEventListener('storage', checkUserData)
    }
  }, [])

return (
  <div className="bg-neutral-900 min-h-screen text-gray-100">
    <nav className="bg-white dark:bg-neutral-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img
            src="https://vulcannovel.com.br/wp-content/uploads/2023/07/capa_vulcan_o_unico_fazendeiro_da_torre.png"
            className="h-8 w-8"
            alt="Logo"
          />
          <div className="text-white text-lg font-bold">
            Quantum Mangás.
          </div>
        </div>
        <div className="flex items-center space-x-12">
          <NavLink to="/" className={({ isActive }) => isActive ? "font-bold" : undefined}>Inicio</NavLink>
          <NavLink to="/obras" className={({ isActive }) => isActive ? "font-bold" : undefined}>Obras</NavLink>
          <NavLink to="/listas" className={({ isActive }) => isActive ? "font-bold" : undefined}>Listas</NavLink>
          <img
            src="https://vulcannovel.com.br/wp-content/uploads/2023/07/capa_vulcan_o_unico_fazendeiro_da_torre.png"
            className="h-8 w-8 rounded-full"
            alt="Perfil"
          />
        </div>
      </div>
      <button onClick={e => changeTheme('light')}>Light</button>
      <button onClick={e => changeTheme('dark')}>Dark</button>
      <button onClick={e => changeTheme()}>System</button>
    </nav>
    <Outlet />
  </div>
)
}