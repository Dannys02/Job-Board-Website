import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function Home() {
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // State untuk filter
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [type, setType] = useState("");

    // Ambil jobs dan categories saat pertama kali halaman dibuka
    useEffect(() => {
        fetchJobs();
        fetchCategories();
    }, []);

    async function fetchJobs() {
        setLoading(true);
        try {
            // Kirim filter sebagai query params ke Laravel
            const res = await api.get("/jobs", {
                params: {
                    search: search || undefined,
                    category_id: categoryId || undefined,
                    type: type || undefined
                }
            });
            setJobs(res.data.data); // data.data karena Laravel paginate
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCategories() {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    // Jalankan filter saat tombol search diklik
    function handleSearch(e) {
        e.preventDefault();
        fetchJobs();
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-blue-600 text-white py-12 px-4 text-center">
                <h1 className="text-3xl font-bold mb-2">
                    Temukan Pekerjaan Impianmu
                </h1>
                <p className="text-blue-100">Ribuan lowongan menanti kamu</p>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Filter Bar */}
                <form
                    onSubmit={handleSearch}
                    className="bg-white rounded-lg shadow p-4 mb-8 flex flex-wrap gap-3"
                >
                    <input
                        type="text"
                        placeholder="Cari posisi..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 border rounded px-3 py-2 text-sm min-w-[150px]"
                    />

                    <select
                        value={categoryId}
                        onChange={e => setCategoryId(e.target.value)}
                        className="border rounded px-3 py-2 text-sm"
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="border rounded px-3 py-2 text-sm"
                    >
                        <option value="">Semua Tipe</option>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="freelance">Freelance</option>
                        <option value="internship">Internship</option>
                    </select>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded text-sm font-medium hover:bg-blue-700"
                    >
                        Cari
                    </button>
                </form>

                {/* Job List */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        Memuat lowongan...
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Tidak ada lowongan ditemukan.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <Link
                                key={job.id}
                                to={`/jobs/${job.id}`}
                                className="block bg-white rounded-lg shadow p-5 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="font-semibold text-lg text-gray-800">
                                            {job.title}
                                        </h2>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {job.company?.name} · {job.location}
                                        </p>
                                    </div>
                                    {/* Badge tipe pekerjaan */}
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                        {job.type}
                                    </span>
                                </div>

                                <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                                    <span>{job.category?.name}</span>
                                    {job.salary_min && (
                                        <span>
                                            Rp{" "}
                                            {Number(
                                                job.salary_min
                                            ).toLocaleString("id-ID")}
                                        </span>
                                    )}
                                    {job.deadline && (
                                        <span>Deadline: {job.deadline}</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
