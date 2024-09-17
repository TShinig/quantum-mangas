import { Link, useLoaderData } from "@remix-run/react";

export const loader = async () => {
  const txt = 'Obras';

  return txt;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();
  
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
            <Link to="/">Inicio</Link>
            <Link to="/obras">Obras</Link>
            <Link to="/listas">Listas</Link>
            <img src="https://vulcannovel.com.br/wp-content/uploads/2023/07/capa_vulcan_o_unico_fazendeiro_da_torre.png" className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </nav>
      
      <div>
        {data}
      </div>
    </div>
  )
}