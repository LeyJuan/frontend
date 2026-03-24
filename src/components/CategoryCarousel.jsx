import { useRef } from 'react'
import { CATEGORIAS } from '../mock/data'

export default function CategoryCarousel({ activa = 'todos', onChange }) {
  const trackRef = useRef(null)
  const drag     = useRef({ active: false, startX: 0, scrollStart: 0 })

  const onDown = (e) => {
    drag.current = { active: false, startX: e.clientX, scrollStart: trackRef.current.scrollLeft }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }
  const onMove = (e) => {
    const d = drag.current.startX - e.clientX
    if (Math.abs(d) > 4) drag.current.active = true
    if (drag.current.active) trackRef.current.scrollLeft = drag.current.scrollStart + d
  }
  const onUp = () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  return (
    <div className="bg-white border-b border-gray-100 py-4">
      <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-gray-400 px-4 mb-3">
        Categorías
      </p>
      <div
        ref={trackRef}
        className="flex gap-5 px-4 overflow-x-auto select-none cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: 'none' }}
        onMouseDown={onDown}
      >
        {CATEGORIAS.map((cat) => {
          const isActive = activa === cat.id
          return (
            <div
              key={cat.id}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
              onClick={() => { if (!drag.current.active) onChange?.(cat.id) }}
            >
              {/* Anillo exterior */}
              <div className={`p-[3px] rounded-full transition-all duration-250 ${
                isActive
                  ? 'bg-gradient-to-tr from-red-600 via-red-400 to-orange-400 shadow-md shadow-red-200'
                  : 'bg-gray-200'
              }`}>
                <div className="w-14 h-14 rounded-full bg-white border-2 border-white flex items-center justify-center">
                  <span className="text-[24px]" style={{
                    filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform .2s',
                    display: 'block',
                  }}>
                    {cat.emoji}
                  </span>
                </div>
              </div>
              {/* Etiqueta */}
              <span className={`text-[10.5px] font-semibold text-center leading-tight max-w-[64px] transition-colors ${
                isActive ? 'text-red-600' : 'text-gray-400'
              }`}>
                {cat.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
