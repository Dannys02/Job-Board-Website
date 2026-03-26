import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function JobDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [cv, setCv] = useState(null); // file CV
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchJob();
    }, [id]);

    async function fetchJob() {
        try {
            const res = await api.get(`/jobs/${id}`);
            setJob(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleApply(e) {
        e.preventDefault();
        setApplying(true);

        try {
            // Pakai FormData karena ada file upload CV
            const formData = new FormData();
            formData.append("cv", cv);
            formData.append("cover_letter", coverLetter);

            await api.post(`/jobs/${id}/apply`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setMessage("Lamaran berhasil dikirim!");
            setShowForm(false);
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Gagal mengirim lamaran."
            );
        } finally {
            setApplying(false);
        }
    }

    if (loading) return <div className="text-center py-20">Memuat...</div>;
    if (!job)
        return (
            <div className="text-center py-20">Lowongan tidak ditemukan.</div>
        );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Tombol kembali */}
                <button
                    onClick={() => navigate(-1)}
                    className="text-blue-600 text-sm mb-6 hover:underline"
                >
                    ← Kembali
                </button>

                {/* Card detail job */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {job.title}
                            </h1>
                            <p className="text-gray-500 mt-1">
                                {job.company?.name} · {job.location}
                            </p>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            {job.type}
                        </span>
                    </div>

                    {/* Info ringkas */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 border-t pt-4">
                        <span>📂 {job.category?.name}</span>
                        {job.salary_min && (
                            <span>
                                💰 Rp{" "}
                                {Number(job.salary_min).toLocaleString("id-ID")}
                                {job.salary_max &&
                                    ` - Rp ${Number(
                                        job.salary_max
                                    ).toLocaleString("id-ID")}`}
                            </span>
                        )}
                        {job.deadline && (
                            <span>📅 Deadline: {job.deadline}</span>
                        )}
                    </div>

                    {/* Deskripsi lowongan */}
                    <div className="prose max-w-none text-gray-700 text-sm leading-relaxed">
                        <h2 className="font-semibold text-base mb-2">
                            Deskripsi Pekerjaan
                        </h2>
                        <p className="whitespace-pre-line">{job.description}</p>
                    </div>

                    {/* Pesan sukses/gagal */}
                    {message && (
                        <div className="mt-4 p-3 rounded bg-green-100 text-green-700 text-sm">
                            {message}
                        </div>
                    )}

                    {/* Tombol apply — hanya tampil untuk seeker */}
                    {user?.role === "seeker" && !message && (
                        <div className="mt-6">
                            {!showForm ? (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700"
                                >
                                    Lamar Sekarang
                                </button>
                            ) : (
                                <form
                                    onSubmit={handleApply}
                                    className="space-y-4 border-t pt-4"
                                >
                                    <h3 className="font-semibold">
                                        Form Lamaran
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Upload CV (PDF)
                                        </label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={e =>
                                                setCv(e.target.files[0])
                                            }
                                            className="w-full text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Cover Letter (opsional)
                                        </label>
                                        <textarea
                                            value={coverLetter}
                                            onChange={e =>
                                                setCoverLetter(e.target.value)
                                            }
                                            rows={4}
                                            className="w-full border rounded px-3 py-2 text-sm"
                                            placeholder="Ceritakan mengapa kamu cocok untuk posisi ini..."
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={applying}
                                            className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {applying
                                                ? "Mengirim..."
                                                : "Kirim Lamaran"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-5 py-2 rounded text-sm border hover:bg-gray-50"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Kalau belum login, tampilkan ajakan login */}
                    {!user && (
                        <div className="mt-6 p-4 bg-gray-50 rounded text-sm text-gray-600 text-center">
                            <a
                                href="/login"
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Login
                            </a>{" "}
                            untuk melamar pekerjaan ini.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobDetail;
