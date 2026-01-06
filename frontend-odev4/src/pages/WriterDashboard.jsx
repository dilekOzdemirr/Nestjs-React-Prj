import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config/api';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import {
    FaPen, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaUser,
    FaMusic, FaFootballBall, FaFilm, FaLaptop, FaBrain, FaHeartbeat
} from 'react-icons/fa';

// Kategori ikonları
const categoryIcons = {
    'Müzik': FaMusic,
    'Spor': FaFootballBall,
    'Film': FaFilm,
    'Teknoloji': FaLaptop,
    'Psikoloji': FaBrain,
    'Sağlık': FaHeartbeat,
};

const WriterDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        categoryIds: [],
        image: ''
    });

    useEffect(() => {
        fetchMyArticles();
        fetchCategories();
    }, []);

    const fetchMyArticles = async () => {
        try {
            const response = await axios.get(`${API_URL}/article`);
            // Sadece kendi makalelerimi filtrele
            const myArticles = response.data.filter(
                article => article.author?.id === user?.id
            );
            setArticles(myArticles);
        } catch (error) {
            console.error('Makaleler yüklenemedi:', error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.categoryIds.length === 0) {
            toast.error('En az bir kategori seçmelisiniz!');
            return;
        }

        try {
            const payload = {
                title: formData.title,
                content: formData.content,
                authorId: user.id,
                categoryIds: formData.categoryIds,
                image: formData.image
            };

            if (editingArticle) {
                await axios.patch(`${API_URL}/article/${editingArticle.id}`, payload);
                toast.success('Makale güncellendi!');
            } else {
                await axios.post(`${API_URL}/article`, payload);
                toast.success('Makale yayınlandı!');
            }

            setShowModal(false);
            setEditingArticle(null);
            setFormData({ title: '', content: '', categoryIds: [], image: '' });
            fetchMyArticles();
        } catch (error) {
            toast.error('Bir hata oluştu!');
        }
    };

    const handleEdit = (article) => {
        setEditingArticle(article);
        setFormData({
            title: article.title,
            content: article.content,
            categoryIds: article.categories?.map(c => c.id) || [],
            image: article.image || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu makaleyi silmek istediğinize emin misiniz?')) {
            try {
                await axios.delete(`${API_URL}/article/${id}`);
                toast.success('Makale silindi!');
                fetchMyArticles();
            } catch (error) {
                toast.error('Silme işlemi başarısız!');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleCategory = (categoryId) => {
        setFormData(prev => ({
            ...prev,
            categoryIds: prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent flex items-center gap-2">
                        <FaPen /> Yazar Paneli
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
                            <FaUser className="text-orange-600" />
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
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Yeni Makale Butonu */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Makalelerim</h2>
                    <button
                        onClick={() => {
                            setEditingArticle(null);
                            setFormData({ title: '', content: '', categoryIds: [], image: '' });
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-amber-600 transition-all"
                    >
                        <FaPlus /> Yeni Makale Yaz
                    </button>
                </div>

                {/* Makaleler Grid */}
                {articles.length === 0 ? (
                    <div className="text-center py-20 bg-white/60 rounded-3xl">
                        <FaPen className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-500">Henüz makale yazmadınız</h3>
                        <p className="text-gray-400 mt-2">İlk makalenizi yazarak başlayın!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                {/* Makale Görseli */}
                                <div className="h-48 bg-gradient-to-br from-orange-400 to-amber-400 relative">
                                    {article.image ? (
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaPen className="text-6xl text-white/50" />
                                        </div>
                                    )}
                                    {/* Kategoriler */}
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                        {article.categories?.map((cat) => {
                                            const Icon = categoryIcons[cat.name] || FaPen;
                                            return (
                                                <span
                                                    key={cat.id}
                                                    className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1"
                                                >
                                                    <Icon className="text-orange-500" />
                                                    {cat.name}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Makale İçeriği */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                        {article.content}
                                    </p>

                                    {/* Aksiyonlar */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(article)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors"
                                        >
                                            <FaEdit /> Düzenle
                                        </button>
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Makale Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                {editingArticle ? 'Makaleyi Düzenle' : 'Yeni Makale Yaz'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Başlık */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Makale Başlığı
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                        placeholder="Başlık girin..."
                                        required
                                    />
                                </div>

                                {/* Görsel URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Görsel URL (Opsiyonel)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>

                                {/* Kategoriler */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Kategoriler
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {categories.map((category) => {
                                            const Icon = categoryIcons[category.name] || FaPen;
                                            const isSelected = formData.categoryIds.includes(category.id);
                                            return (
                                                <button
                                                    key={category.id}
                                                    type="button"
                                                    onClick={() => toggleCategory(category.id)}
                                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${isSelected
                                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                        : 'border-gray-200 hover:border-orange-300'
                                                        }`}
                                                >
                                                    <Icon className={isSelected ? 'text-orange-500' : 'text-gray-400'} />
                                                    <span className="font-medium">{category.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* İçerik */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Makale İçeriği
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none"
                                        rows={8}
                                        placeholder="Makalenizi yazın..."
                                        required
                                    />
                                </div>

                                {/* Butonlar */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-amber-600 transition-all"
                                    >
                                        {editingArticle ? 'Güncelle' : 'Yayınla'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WriterDashboard;
