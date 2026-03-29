import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function CreateJob() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        category_id: "",
        title: "",
        description: "",
        type: "full-time",
        location: "",
        salary_min: "",
        salary_max: "",
        deadline: ""
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.post("/employer/jobs", form);
            navigate("/employer/dashboard");
        } catch (err) {
            const errors = err.response?.data?.errors;
            if (errors) {
                setError(Object.values(errors)[0][0]);
            } else {
                setError(
                    err.response?.data?.message || "Gagal membuat lowongan."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate("/employer/dashboard")}
                    className="text-blue-600 text-sm mb-6 hover:underline"
                >
                    ← Kembali ke Dashboard
                </button>

                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-xl font-bold mb-6">
                        Posting Lowongan Baru
                    </h1>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Judul Posisi
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Kategori
                            </label>
                            <select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-sm"
                                required
                            >
                                <option value="">Pilih kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Tipe Pekerjaan
                            </label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-sm"
                            >
                                <option value="full-time">Full Time</option>
                                <option value="part-time">Part Time</option>
                                <option value="freelance">Freelance</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Lokasi
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-sm"
                                required
                            />
                        </div>

                        {/* Salary range dalam satu baris */}
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">
                                    Gaji Min (opsional)
                                </label>
                                <input
                                    type="number"
                                    name="salary_min"
                                    value={form.salary_min}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium mb-1">
                                    Gaji Max (opsional)
                                </label>
                                <input
                                    type="number"
                                    name="salary_max"
                                    value={form.salary_max}
                                    onChange={handleChange}
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Deadline (opsional)
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                value={form.deadline}
                                onChange={handleChange}
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Deskripsi Pekerjaan
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={6}
                                className="w-full border rounded px-3 py-2 text-sm"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Menyimpan..." : "Posting Lowongan"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateJob;
