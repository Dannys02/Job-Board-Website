import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "seeker" // default role
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = useAuth();
    const navigate = useNavigate();

    // Update field form secara dinamis tanpa buat handler satu per satu
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/register", form);
            
            // Langsung login setelah register berhasil
            login(res.data.user, res.data.token);
            
            // Redirect berdasarkan role yang dipilih
            const role = res.data.user.role;
            if (role === "employer") navigate("/employer/dashboard");
            else navigate("/seeker/dashboard");
        } catch (err) {
            // Ambil pesan error pertama dari Laravel validation
            const errors = err.response?.data?.errors;
            if (errors) {
                const firstError = Object.values(errors)[0][0];
                setError(firstError);
            } else {
                setError(err.response?.data?.message || "Register gagal");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Register
                </h1>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Nama
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Konfirmasi Password
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    {/* Pilih role saat register */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Daftar sebagai
                        </label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full border bg-white rounded px-3 py-2 text-sm"
                        >
                            <option value="seeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Loading" : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Sudah punya akun?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
