import { NavLink } from 'react-router-dom'
import { Home, Plus, MapPin } from 'lucide-react'

const LINKS = [
  { to: '/',             label: 'Inicio',        Icon: Home   },
  { to: '/nuevo-reporte',label: 'Crear reporte', Icon: Plus   },
  { to: '/mapa',         label: 'Mapa',          Icon: MapPin },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full bg-red-600 border-t border-red-700 flex items-stretch px-4 pb-4 pt-2 z-50">
      {LINKS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all
             ${isActive
               ? 'text-white bg-red-700/60'
               : 'text-red-200 hover:text-white'}`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-white" />
              )}
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[10px] font-semibold">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
