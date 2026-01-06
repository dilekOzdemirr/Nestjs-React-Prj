import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config/api';
import { Toaster } from 'sonner';
import {
    FaBook, FaSignOutAlt, FaUser, FaSearch,
    FaMusic, FaFootballBall, FaFilm, FaLaptop, FaBrain, FaHeartbeat, FaTh
} from 'react-icons/fa';

// Kategori ikonları ve renkleri
const categoryConfig = {
    'Müzik': { icon: FaMusic, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-100', text: 'text-purple-600' },
    'Spor': { icon: FaFootballBall, color: 'from-green-500 to-emerald-500', bg: 'bg-green-100', text: 'text-green-600' },
    'Film': { icon: FaFilm, color: 'from-red-500 to-rose-500', bg: 'bg-red-100', text: 'text-red-600' },
    'Teknoloji': { icon: FaLaptop, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-100', text: 'text-blue-600' },
    'Psikoloji': { icon: FaBrain, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-100', text: 'text-amber-600' },
    'Sağlık': { icon: FaHeartbeat, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-100', text: 'text-pink-600' },
};

const ReaderPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
        fetchCategories();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/article`);
            setArticles(response.data);
        } catch (error) {
            console.error('Makaleler yüklenemedi:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_URL}/category`);
            setCategories(response.data);
        } catch (error) {
            console.error('Kategoriler yüklenemedi:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Filtreleme
    const filteredArticles = articles.filter(article => {
        const matchesCategory = selectedCategory === null ||
            article.categories?.some(cat => cat.id === selectedCategory);
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
                            <FaBook /> BlogApp
                        </h1>

                        {/* Arama */}
                        <div className="flex-1 max-w-md mx-8">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                    placeholder="Makale ara..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full">
                                <FaUser className="text-amber-600" />
                                <span className="font-medium text-gray-700">{user?.username}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                            >
                                <FaSignOutAlt /> Çıkış
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Kategori Bar */}
            <div className="bg-white border-b sticky top-[72px] z-40">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
                        {/* Tümü */}
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${selectedCategory === null
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <FaTh /> Tümü
                        </button>

                        {categories.map((category) => {
                            const config = categoryConfig[category.name] || { icon: FaBook, bg: 'bg-gray-100', text: 'text-gray-600' };
                            const Icon = config.icon;
                            const isSelected = selectedCategory === category.id;

                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${isSelected
                                        ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                                        : `${config.bg} ${config.text} hover:opacity-80`
                                        }`}
                                >
                                    <Icon /> {category.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="text-center py-20 bg-white/60 rounded-3xl">
                        <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500">Makale bulunamadı</h3>
                        <p className="text-gray-400 mt-2">Farklı bir kategori veya arama terimi deneyin</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredArticles.map((article) => {
                            const primaryCategory = article.categories?.[0];
                            const config = primaryCategory
                                ? categoryConfig[primaryCategory.name] || { color: 'from-gray-500 to-gray-600' }
                                : { color: 'from-gray-500 to-gray-600' };

                            return (
                                <Link
                                    key={article.id}
                                    to={`/article/${article.id}`}
                                    className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Makale Görseli */}
                                    <div className={`h-48 bg-gradient-to-br ${config.color} relative overflow-hidden`}>
                                        {article.image ? (
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FaBook className="text-6xl text-white/30" />
                                            </div>
                                        )}

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        {/* Kategoriler */}
                                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                            {article.categories?.slice(0, 2).map((cat) => {
                                                const catConfig = categoryConfig[cat.name] || { icon: FaBook };
                                                const CatIcon = catConfig.icon;
                                                return (
                                                    <span
                                                        key={cat.id}
                                                        className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1"
                                                    >
                                                        <CatIcon className="text-xs" />
                                                        {cat.name}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Makale İçeriği */}
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                            {article.content}
                                        </p>

                                        {/* Yazar */}
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold">
                                                {article.author?.username?.charAt(0)?.toUpperCase() || 'A'}
                                            </div>
                                            <span>{article.author?.username || 'Anonim'}</span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ReaderPage;
