import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Users, TrendingUp, Mail, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeOpportunities: 0,
    recentInteractions: 0,
    pendingReminders: 0
  });
  const [recentClients, setRecentClients] = useState([]);
  const [recentInteractions, setRecentInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [clientsRes, opportunitiesRes, interactionsRes] = await Promise.all([
        api.get('/clients'),
        api.get('/opportunities?status=abierta'),
        api.get('/interactions?limit=10')
      ]);

      setStats({
        totalClients: clientsRes.data.clients.length,
        activeOpportunities: opportunitiesRes.data.opportunities.length,
        recentInteractions: interactionsRes.data.interactions.length,
        pendingReminders: 0 // TODO: implement reminders
      });

      setRecentClients(clientsRes.data.clients.slice(0, 5));
      setRecentInteractions(interactionsRes.data.interactions.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Vista general de tu CRM</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Clientes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>
            <Users className="text-primary-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Oportunidades</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeOpportunities}</p>
            </div>
            <TrendingUp className="text-primary-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Interacciones</p>
              <p className="text-3xl font-bold text-gray-900">{stats.recentInteractions}</p>
            </div>
            <Mail className="text-primary-500" size={32} />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Recordatorios</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingReminders}</p>
            </div>
            <Clock className="text-primary-500" size={32} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Clientes Recientes</h2>
          <div className="space-y-3">
            {recentClients.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay clientes aún</p>
            ) : (
              recentClients.map((client) => (
                <Link
                  key={client.id}
                  to={`/clients/${client.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      {client.company && (
                        <p className="text-sm text-gray-500">{client.company}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      client.status === 'cliente' ? 'bg-green-100 text-green-700' :
                      client.status === 'oportunidad' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
          <Link
            to="/clients"
            className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-700"
          >
            Ver todos los clientes →
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            {recentInteractions.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay actividad aún</p>
            ) : (
              recentInteractions.map((interaction) => (
                <div key={interaction.id} className="p-3 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {interaction.client_name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {format(new Date(interaction.created_at), 'dd MMM')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {interaction.title || interaction.type}
                  </p>
                  {interaction.summary && (
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {interaction.summary}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

