import { to } from '@/lib/url'

export function Breadcrumbs({ crumbs }: { crumbs: { name: string; path: string }[] }) {
  const all = [{ name: 'Inicio', path: '/' }, ...crumbs]
  return (
    <nav aria-label="Migas de pan" className="text-sm text-mist">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {all.map((c, i) => {
          const last = i === all.length - 1
          return (
            <li key={c.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-moon-100">
                  {c.name}
                </span>
              ) : (
                <>
                  <a href={to(c.path)} className="transition-colors duration-200 hover:text-starlight">
                    {c.name}
                  </a>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
