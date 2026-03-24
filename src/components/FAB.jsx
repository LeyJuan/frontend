import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function FAB() {
  const nav = useNavigate()
  return (
    <button
      onClick={() => nav('/nuevo-reporte')}
      className="fixed z-40 bottom-[84px] right-[calc(50%-215px+18px)] w-14 h-14 rounded-[18px] bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-300 active:scale-90 transition-transform border-2 border-red-500"
      aria-label="Nuevo reporte"
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  )
}
