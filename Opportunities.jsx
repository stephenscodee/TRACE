import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    stage: 'nuevo',
    value: '',
    probability: 0,
    estimated_close_date: '',
    description: ''
  });
  const [clients, setClients] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [oppsRes, pipelineRes, clientsRes] = await Promise.all([
        api.get('/opportunities?status=abierta'),
        api.get('/opportunities/pipeline/summary'),
        api.get('/clients')
      ]);
      setOpportunities(oppsRes.data.opportunities);
      setPipeline(pipelineRes.data.summary);
      setClients(clientsRes.data.clients);
    } catch (error) {
      console.error('Error loading opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/opportunities', {
        ...formData,
        value: parseFloat(formData.value) || 0
      });
      setShowModal(false);
      setFormData({
        client_id: '',
        title: '',
        stage: 'nuevo',
        value: '',
        probability: 0,
        estimated_close_date: '',
        description: ''
      });
      loadData();
    } catch (error) {
      console.error('Error creating opportunity:', error);
    }
  };

  const stages = ['nuevo', 'calificado', 'propuesta', 'negociacion', 'cierre'];

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pipeline</h1>
          <p className="text-gray-600">Gestiona tus oportunidades de venta</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Oportunidad
        </button>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageData = pipeline.find(s => s.stage === stage) || { count: 0, total_value: 0 };
          return (
            <div key={stage} className="card">
              <h3 className="font-semibold text-gray-700 mb-2 capitalize">{stage}</h3>
              <p className="text-2xl font-bold text-primary-600">{stageData.count}</p>
              {stageData.total_value > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  €{stageData.total_value.toLocaleString()}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Opportunities List */}
      <div className="card">
        {opportunities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="mb-4">No hay oportunidades aún</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              Crear primera oportunidad
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Título</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Etapa</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Valor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Cierre</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link
                        to={`/clients/${opp.client_id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {opp.client_name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 font-medium">{opp.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 capitalize">
                        {opp.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {opp.value > 0 ? `€${opp.value.toLocaleString()}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {opp.estimated_close_date
                        ? format(new Date(opp.estimated_close_date), 'dd MMM yyyy')
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Nueva Oportunidad</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente *
                </label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company ? `- ${client.company}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Etapa
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="input"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor (€)
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="input"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probabilidad (%)
                  </label>
                  <input
                    type="number"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                    className="input"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha estimada de cierre
                </label>
                <input
                  type="date"
                  value={formData.estimated_close_date}
                  onChange={(e) => setFormData({ ...formData, estimated_close_date: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input h-24 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn btn-primary">
                  Crear Oportunidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

