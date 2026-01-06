import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config/api';
import { toast, Toaster } from 'sonner';
import {
    FaArrowLeft, FaUser, FaComment, FaPaperPlane, FaTrash,
    FaMusic, FaFootballBall, FaFilm, FaLaptop, FaBrain, FaHeartbeat, FaBook
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

const ArticleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [article, setArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchArticle();
        fetchComments();
    }, [id]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/article/${id}`);
            setArticle(response.data);
        } catch (error) {
            console.error('Makale yüklenemedi:', error);
            toast.error('Makale bulunamadı!');
            navigate('/reader');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${API_URL}/comment?articleId=${id}`);
            // Sadece bu makaleye ait yorumları filtrele
            const articleComments = response.data.filter(
                comment => comment.article?.id === parseInt(id)
            );
            setComments(articleComments);
        } catch (error) {
            console.error('Yorumlar yüklenemedi:', error);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            toast.error('Yorum boş olamaz!');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(`${API_URL}/comment`, {
                content: newComment,
                articleId: parseInt(id),
                authorId: user.id
            });
            toast.success('Yorum eklendi!');
            setNewComment('');
            fetchComments();
        } catch (error) {
            toast.error('Yorum eklenemedi!');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
            try {
                await axios.delete(`${API_URL}/comment/${commentId}`);
                toast.success('Yorum silindi!');
                fetchComments();
            } catch (error) {
                toast.error('Yorum silinemedi!');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!article) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100">
            <Toaster position="top-right" richColors />

            {/* Hero Section */}
            <div className="relative">
                {/* Background Image */}
                <div className="h-[400px] relative overflow-hidden">
                    {article.image ? (
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-500"></div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                </div>

                {/* Back Button */}
                <Link
                    to="/reader"
                    className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-lg text-white rounded-full hover:bg-white/30 transition-colors z-10"
                >
                    <FaArrowLeft /> Geri Dön
                </Link>

                {/* Title Section */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="container mx-auto">
                        {/* Kategoriler */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {article.categories?.map((cat) => {
                                const Icon = categoryIcons[cat.name] || FaBook;
                                return (
                                    <span
                                        key={cat.id}
                                        className="px-4 py-1.5 bg-white/20 backdrop-blur-lg rounded-full text-sm font-medium text-white flex items-center gap-2"
                                    >
                                        <Icon /> {cat.name}
                                    </span>
                                );
                            })}
                        </div>

                        {/* Başlık */}
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
                            {article.title}
                        </h1>

                        {/* Yazar Bilgisi */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                {article.author?.username?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div>
                                <p className="text-white font-semibold text-lg">
                                    {article.author?.username || 'Anonim'}
                                </p>
                                <p className="text-white/60 text-sm">Yazar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Makale İçeriği */}
                    <article className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                                {article.content}
                            </p>
                        </div>
                    </article>

                    {/* Yorumlar Bölümü */}
                    <section className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                            <FaComment className="text-orange-500" />
                            Yorumlar ({comments.length})
                        </h2>

                        {/* Yorum Yazma Formu */}
                        <form onSubmit={handleSubmitComment} className="mb-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none"
                                        rows={3}
                                        placeholder="Düşüncelerinizi paylaşın..."
                                    />
                                    <div className="flex justify-end mt-3">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                                        >
                                            {submitting ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                            ) : (
                                                <>
                                                    <FaPaperPlane /> Gönder
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Yorumlar Listesi */}
                        {comments.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <FaComment className="text-5xl mx-auto mb-4 opacity-50" />
                                <p>Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="flex gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {comment.author?.username?.charAt(0)?.toUpperCase() || 'A'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-gray-800">
                                                    {comment.author?.username || 'Anonim'}
                                                </span>
                                                {user?.id === comment.author?.id && (
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-gray-600">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ArticleDetailPage;
