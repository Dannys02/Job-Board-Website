import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function EmployerDashboard() {
  const { user, logout }    = useAuth();
  const navigate            = useNavigate();
  const [jobs, setJobs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await api.get('/employer/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Yakin ingin menghapus lowongan ini?')) return;
    try {
      await api.delete(`/employer/jobs/${id}`);
      setMessage('Lowongan berhasil dihapus.');
      // Hapus dari state tanpa fetch ulang
      setJobs(jobs.filter((j) => j.id !== id));
    } catch (err) {
      setMessage('Gagal menghapus lowongan.');
    }
  }

  async function handleLogout() {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate('/login');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-lg text-blue-600">Job Board</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Halo, {user?.name}</span>
          <button
            onClick={() => navigate('/employer/jobs/create')}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            + Posting Lowongan
          </button>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Ringkasan */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="font-semibold text-lg mb-1">Dashboard Employer</h2>
          <p className="text-gray-500 text-sm">
            Total lowongan: <span className="font-medium text-gray-800">{jobs.length}</span>
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
            {message}
          </div>
        )}

        {/* Tabel lowongan */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Lowongan Saya</h2>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Memuat...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Belum ada lowongan.{' '}
              <button
                onClick={() => navigate('/employer/jobs/create')}
                className="text-blue-600 hover:underline"
              >
                Buat sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{job.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {job.type} · {job.location}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                      job.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  {/* Aksi */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/employer/jobs/${job.id}/applicants`)}
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                    >
                      Pelamar
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;