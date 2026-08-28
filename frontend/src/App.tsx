import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Explorer from './pages/Explorer'
import Impact from './pages/Impact'
import Incidents from './pages/Incidents'
import Assistant from './pages/Assistant'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#fafafa]">
        <Navbar />
        <main className="container mx-auto px-4 lg:px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/assistant" element={<Assistant />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
