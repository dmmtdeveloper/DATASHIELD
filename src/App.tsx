import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import UniverseAdministration from './pages/UniverseAdministration/UniverseAdministration';
import DataDiscovery from './pages/DataDiscovery/DataDiscovery';
import AttributeCatalog from './pages/AttributeCatalog/AttributeCatalog';
import BatchExecution from './pages/BatchExecution/BatchExecution';
import OnlineExecution from './pages/OnlineExecution/OnlineExecution';
import AuditTrail from './pages/AuditTrail/AuditTrail';
import Settings from './pages/Settings/Settings';

// Componentes temporales para las rutas restantes
// const BatchExecution = () => <div className="card p-6"><h2 className="text-2xl font-bold mb-4">Ejecución Batch</h2><p>En desarrollo...</p></div>;
// const OnlineExecution = () => <div className="card p-6"><h2 className="text-2xl font-bold mb-4">Ejecución Online</h2><p>En desarrollo...</p></div>;
// const AuditTrail = () => <div className="card p-6"><h2 className="text-2xl font-bold mb-4">Auditoría</h2><p>En desarrollo...</p></div>;
const Monitoring = () => <div className="card p-6"><h2 className="text-2xl font-bold mb-4">Monitoreo</h2><p>En desarrollo...</p></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/discovery" element={<DataDiscovery />} />
                  <Route path="/universe" element={<UniverseAdministration />} />
                  <Route path="/catalog" element={<AttributeCatalog />} />
                  <Route path="/batch" element={<BatchExecution />} />
                  <Route path="/online" element={<OnlineExecution />} />
                  <Route path="/audit" element={<AuditTrail />} />
                  <Route path="/monitoring" element={<Monitoring />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;