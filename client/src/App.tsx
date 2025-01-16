import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Testimonials from './pages/Testimonials';
import AppointmentManager from './pages/Admin/AppointmentManager';
import { ServiceManager } from './pages/Admin/ServiceManager';
import TestimonialManager from './pages/Admin/TestimonialManager';
import Navbar from './components/Navbar';
import { NotificationProvider } from './components/NotificationProvider';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <NotificationProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/team" element={<Team />} />
              <Route path="/testimonials" element={<Testimonials />} />
              
              {/* Rotas Protegidas */}
              <Route
                path="/admin/appointments"
                element={
                  <ProtectedRoute>
                    <AppointmentManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ProtectedRoute>
                    <ServiceManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/testimonials"
                element={
                  <ProtectedRoute>
                    <TestimonialManager />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </NotificationProvider>
    </Router>
  );
}

export default App;