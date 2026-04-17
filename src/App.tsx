import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Landing from '@/pages/Landing'

// Lazy-load the map page so maplibre-gl (~800 kB) is only fetched when needed
const MapView = lazy(() => import('@/pages/MapView'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/map"
          element={
            <Suspense fallback={<div className="h-screen bg-[#09090f]" />}>
              <MapView />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
