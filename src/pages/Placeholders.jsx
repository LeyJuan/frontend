export function ExplorarPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      <header className="bg-red-600 px-4 pt-4 pb-4">
        <h1 className="text-[18px] font-black text-white">Explorar</h1>
      </header>
      <div className="flex flex-col items-center justify-center flex-1 text-gray-400 gap-3">
        <p className="text-5xl">🔍</p>
        <p className="text-lg font-bold text-gray-600">Próximamente</p>
      </div>
    </div>
  )
}

export function MapaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      <header className="bg-red-600 px-4 pt-4 pb-4">
        <h1 className="text-[18px] font-black text-white">Mapa</h1>
      </header>
      <div className="flex flex-col items-center justify-center flex-1 text-gray-400 gap-3">
        <p className="text-5xl">🗺️</p>
        <p className="text-lg font-bold text-gray-600">Próximamente</p>
      </div>
    </div>
  )
}

export function AlertasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white pb-28">
      <header className="bg-red-600 px-4 pt-4 pb-4">
        <h1 className="text-[18px] font-black text-white">Alertas</h1>
      </header>
      <div className="flex flex-col items-center justify-center flex-1 text-gray-400 gap-3">
        <p className="text-5xl">🔔</p>
        <p className="text-lg font-bold text-gray-600">Próximamente</p>
      </div>
    </div>
  )
}