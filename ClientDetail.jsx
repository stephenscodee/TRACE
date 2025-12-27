import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { format } from 'date-fns';
import { Mail, Phone, MessageSquare, Plus, Edit } from 'lucide-react';

export default function ClientDetail() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [interactions, setInteractions] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    loadClient();
  }, [id]);

  const loadClient = async () => {
    try {
      const response = await api.get(`/clients/${id}`);
      setClient(response.data.client);
      setInteractions(response.data.interactions);
      setOpportunities(response.data.opportunities);
    } catch (error) {
      console.error('Error loading client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await api.post('/interactions', {
        client_id: id,
        type: 'nota',
        title: 'Nota rápida',
        content: noteContent
      });
      setNoteContent('');
      setShowNoteModal(false);
      loadClient();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Cargando...</div>;
  }

  if (!client) {
    return <div className="text-center py-12 text-gray-500">Cliente no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/clients" className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-block">
            ← Volver a clientes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
          {client.company && (
            <p className="text-gray-600 mt-1">{client.company}</p>
          )}
        </div>
        <button
          onClick={() => setShowNoteModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Nota
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Info */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Información</h2>
            <div className="space-y-3">
              {client.email && (
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <span className="text-gray-700">{client.email}</span>
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <span className="text-gray-700">{client.phone}</span>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-500">Estado:</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                  client.status === 'cliente' ? 'bg-green-100 text-green-700' :
                  client.status === 'oportunidad' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {client.status}
                </span>
              </div>
              {client.notes && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Notas:</p>
                  <p className="text-gray-700">{client.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Opportunities */}
          {opportunities.length > 0 && (
            <div className="card mt-6">
              <h2 className="text-xl font-semibold mb-4">Oportunidades</h2>
              <div className="space-y-3">
                {opportunities.map((opp) => (
                  <Link
                    key={opp.id}
                    to={`/opportunities?client=${id}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{opp.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {opp.value > 0 && `€${opp.value.toLocaleString()} • `}
                      {opp.stage}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Timeline</h2>
            {interactions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No hay interacciones aún</p>
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="btn btn-primary mt-4"
                >
                  Añadir primera nota
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {interactions.map((interaction) => (
                  <div
                    key={interaction.id}
                    className="border-l-2 border-primary-200 pl-4 pb-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          interaction.type === 'email' ? 'bg-blue-100 text-blue-700' :
                          interaction.type === 'llamada' ? 'bg-green-100 text-green-700' :
                          interaction.type === 'nota' ? 'bg-gray-100 text-gray-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {interaction.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {format(new Date(interaction.created_at), "dd MMM yyyy 'a las' HH:mm")}
                        </span>
                      </div>
                      {interaction.created_by_name && (
                        <span className="text-xs text-gray-400">
                          {interaction.created_by_name}
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {interaction.title || interaction.type}
                    </h3>
                    {interaction.summary && (
                      <p className="text-sm text-gray-600 mb-2">{interaction.summary}</p>
                    )}
                    {interaction.content && (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {interaction.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Nueva Nota</h2>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenido
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="input h-32 resize-none"
                  placeholder="Escribe tu nota aquí..."
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowNoteModal(false);
                    setNoteContent('');
                  }}
                  className="flex-1 btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="flex-1 btn btn-primary">
                  Guardar Nota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

