import { NavLink, Outlet } from "@remix-run/react";

export default function layout() {
  return (
    <div className="bg-neutral-900 min-h-screen text-gray-100">
      <nav className="bg-neutral-900 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="https://vulcannovel.com.br/wp-content/uploads/2023/07/capa_vulcan_o_unico_fazendeiro_da_torre.png" className="h-8 w-8" />
            <div className="text-white text-lg font-bold">
              Quantum Mangás
            </div>
          </div>
          <div className="flex items-center space-x-12">
            <NavLink to="/" className={({isActive}) => isActive ? "font-bold" : undefined}>Inicio</NavLink>
            <NavLink to="/obras" className={({isActive}) => isActive ? "font-bold" : undefined}>Obras</NavLink>
            <NavLink to="/listas" className={({isActive}) => isActive ? "font-bold" : undefined}>Listas</NavLink>
            <img src="https://vulcannovel.com.br/wp-content/uploads/2023/07/capa_vulcan_o_unico_fazendeiro_da_torre.png" className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}