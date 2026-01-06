import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaPen, FaBook } from 'react-icons/fa';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasyonlar
        if (formData.password !== formData.confirmPassword) {
            toast.error('Şifreler eşleşmiyor!');
            return;
        }

        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
        if (!passwordRegex.test(formData.password)) {
            toast.error('Şifre en az 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir!');
            return;
        }

        if (!formData.role) {
            toast.error('Lütfen bir rol seçin!');
            return;
        }

        setLoading(true);

        try {
            const user = await register(
                formData.username,
                formData.email,
                formData.password,
                formData.role
            );
            toast.success('Kayıt başarılı!');

            if (user.role === 'writer') {
                navigate('/writer');
            } else {
                navigate('/reader');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Kayıt başarısız!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 py-8">
            {/* Dekoratif arka plan */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
            </div>

            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Logo/Başlık */}
                <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
                        📚 BlogApp
                    </h1>
                    <p className="text-gray-600 mt-2">Topluluğumuza katıl!</p>
                </div>

                {/* Register Formu */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                        Kayıt Ol
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Kullanıcı Adı */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kullanıcı Adı
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    placeholder="Kullanıcı adınız"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Adresi
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    placeholder="ornek@email.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Şifre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                En az 6 karakter, 1 büyük harf, 1 küçük harf, 1 rakam, 1 özel karakter
                            </p>
                        </div>

                        {/* Şifre Tekrar */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Şifre Tekrar
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Rol Seçimi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Hesap Türü
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Yazar */}
                                <label
                                    className={`cursor-pointer flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${formData.role === 'writer'
                                            ? 'border-orange-500 bg-orange-50 shadow-lg'
                                            : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="writer"
                                        checked={formData.role === 'writer'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${formData.role === 'writer' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        <FaPen className="text-xl" />
                                    </div>
                                    <span className={`font-semibold ${formData.role === 'writer' ? 'text-orange-600' : 'text-gray-700'}`}>
                                        Yazar
                                    </span>
                                    <span className="text-xs text-gray-500 text-center mt-1">
                                        Makale yaz ve paylaş
                                    </span>
                                </label>

                                {/* Okuyucu */}
                                <label
                                    className={`cursor-pointer flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${formData.role === 'reader'
                                            ? 'border-amber-500 bg-amber-50 shadow-lg'
                                            : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="reader"
                                        checked={formData.role === 'reader'}
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 ${formData.role === 'reader' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        <FaBook className="text-xl" />
                                    </div>
                                    <span className={`font-semibold ${formData.role === 'reader' ? 'text-amber-600' : 'text-gray-700'}`}>
                                        Okuyucu
                                    </span>
                                    <span className="text-xs text-gray-500 text-center mt-1">
                                        Makaleleri keşfet
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Kayıt Butonu */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <FaUserPlus />
                                    Kayıt Ol
                                </>
                            )}
                        </button>
                    </form>

                    {/* Giriş Linki */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Zaten hesabın var mı?{' '}
                            <Link
                                to="/login"
                                className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                            >
                                Giriş Yap
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
