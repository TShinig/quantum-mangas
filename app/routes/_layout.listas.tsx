import { Link, useLoaderData } from "@remix-run/react";

export const loader = async () => {
  const txt = 'Listas';

  return txt;
};

export default function Page() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      {data}
    </div>
  )
}