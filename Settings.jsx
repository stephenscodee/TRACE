import { useEffect, useState } from 'react';
import api from '../services/api';
import { Mail, CheckCircle, XCircle } from 'lucide-react';

export default function Settings() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const response = await api.get('/email/connections');
      setConnections(response.data.connections);
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGmail = async () => {
    try {
      const response = await api.get('/email/gmail/auth');
      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error('Error connecting Gmail:', error);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.post('/email/sync', { provider: 'gmail' });
      alert('Emails sincronizados correctamente');
    } catch (error) {
      console.error('Error syncing emails:', error);
      alert('Error al sincronizar emails');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  }

  const hasGmail = connections.some(c => c.provider === 'gmail');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
        <p className="text-gray-600">Gestiona tus integraciones y preferencias</p>
      </div>

      {/* Email Integration */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Integración de Email</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Conecta tu cuenta de email para capturar automáticamente las conversaciones con clientes.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail size={24} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Gmail</p>
                {hasGmail && (
                  <p className="text-sm text-gray-500">
                    {connections.find(c => c.provider === 'gmail')?.email}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasGmail ? (
                <>
                  <CheckCircle size={20} className="text-green-500" />
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="btn btn-secondary text-sm"
                  >
                    {syncing ? 'Sincronizando...' : 'Sincronizar ahora'}
                  </button>
                </>
              ) : (
                <>
                  <XCircle size={20} className="text-gray-400" />
                  <button
                    onClick={handleConnectGmail}
                    className="btn btn-primary text-sm"
                  >
                    Conectar Gmail
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Inteligencia Artificial</h2>
        <p className="text-gray-600 mb-4 text-sm">
          La IA se usa para resumir conversaciones largas, clasificar leads y sugerir próximas acciones.
        </p>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Estado:</strong> {process.env.OPENAI_API_KEY ? 'Configurado' : 'No configurado'}
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Configura OPENAI_API_KEY en el backend para habilitar las funciones de IA.
          </p>
        </div>
      </div>
    </div>
  );
}

