import React, { useState, useEffect } from 'react';
import api from './api/apiService';

export default function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/clients')
      .then((res) => {
        setClients(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch clients:', err);
        setLoading(false);
      });
  }, []);

  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 font-poppins">Loading clients...</div>;
  }

  return (
    <div className="p-8 font-poppins">
      <h1 className="text-3xl font-bold text-custom-dark mb-6 font-poppins">Client Management</h1>

      <input
        type="text"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border border-custom-dark rounded w-full max-w-sm font-nunito"
      />

      <table className="min-w-full bg-white border rounded shadow overflow-x-auto">
        <thead className="bg-custom-medium text-white">
          <tr>
            <th className="text-left px-4 py-2">Client Name</th>
            <th className="text-left px-4 py-2">Contact Person</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-left px-4 py-2">Phone</th>
            <th className="text-left px-4 py-2">Last Contact</th>
            <th className="text-left px-4 py-2">Projects</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id} className="border-t hover:bg-gray-100 transition">
              <td className="px-4 py-2">{client.name}</td>
              <td className="px-4 py-2">{client.contact}</td>
              <td className="px-4 py-2">{client.email}</td>
              <td className="px-4 py-2">{client.phone}</td>
              <td className="px-4 py-2">{client.lastContact}</td>
              <td className="px-4 py-2">
                {Array.isArray(client.projects)
                  ? client.projects.map((p, idx) => (
                      <span key={idx} className="inline-block bg-custom-mint text-white px-2 py-1 rounded text-sm mr-1 mb-1">
                        {p}
                      </span>
                    ))
                  : client.projects}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
