import { Button, Label, Modal, ModalBody, TextInput, Select, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import axios from "axios";
import { API_URL } from '../config/api';
import { toast } from "sonner";

export const ArticleFormModal = ({ fetchArticles, article }) => {
  const [show, setShow] = useState(false);

  // Select kutuları için veriler
  const [categories, setCategories] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
    authorId: ""
  });

  useEffect(() => {
    if (show) {
      // Kategorileri ve Yazarları çekiyoruz
      axios.get(`${API_URL}/category`).then(res => setCategories(res.data));
      axios.get(`${API_URL}/profiles`).then(res => setProfiles(res.data));

      if (article) {
        // Düzenleme modu
        setFormData({
          title: article.title,
          content: article.content,
          categoryId: article.category?.id || "",
          authorId: article.author?.id || ""
        });
      } else {
        // Ekleme modu (Sıfırla)
        setFormData({ title: "", content: "", categoryId: "", authorId: "" });
      }
    }
  }, [show, article]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function handleSave() {
    // Verileri sayıya çevirmemiz lazım (API number istiyor)
    const payload = {
      ...formData,
      categoryId: Number(formData.categoryId),
      authorId: Number(formData.authorId)
    };

    if (article) {
      axios.patch(`${API_URL}/article/` + article.id, payload)
        .then(() => {
          fetchArticles();
          toast.success("Makale güncellendi");
          setShow(false);
        })
        .catch((err) => toast.error("Güncelleme hatası"));
    } else {
      axios.post(`${API_URL}/article`, payload)
        .then(() => {
          fetchArticles();
          toast.success("Makale eklendi");
          setShow(false);
        })
        .catch((err) => toast.error("Ekleme hatası"));
    }
  }

  function getButton() {
    if (article == null)
      return (
        <Button className="ml-auto mb-4 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShow(true)}>
          <FaPlus className="mr-2" /> Yeni Makale Yaz
        </Button>
      );
    return (
      <Button size="xs" className="bg-amber-400 hover:bg-amber-500 text-white" onClick={() => setShow(true)}>
        <FaEdit />
      </Button>
    );
  }

  return (
    <>
      <div className="flex">{getButton()}</div>
      <Modal show={show} size="lg" onClose={() => setShow(false)} popup>
        <ModalBody className="p-6">
          <h3 className="text-2xl font-bold text-orange-600 mb-4">
            {article == null ? "Yeni Makale Oluştur" : "Makaleyi Düzenle"}
          </h3>

          <div className="space-y-4">
            {/* Başlık */}
            <div>
              <div className="mb-1"><Label value="Makale Başlığı" /></div>
              <TextInput name="title" value={formData.title} onChange={handleChange} placeholder="Örn: NestJS Nedir?" />
            </div>

            {/* Kategori Seçimi */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-1"><Label value="Kategori" /></div>
                <Select name="categoryId" value={formData.categoryId} onChange={handleChange}>
                  <option value="">Seçiniz...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </div>
              {/* Yazar Seçimi */}
              <div>
                <div className="mb-1"><Label value="Yazar" /></div>
                <Select name="authorId" value={formData.authorId} onChange={handleChange}>
                  <option value="">Seçiniz...</option>
                  {profiles.map((p) => <option key={p.id} value={p.id}>{p.username}</option>)}
                </Select>
              </div>
            </div>

            {/* İçerik */}
            <div>
              <div className="mb-1"><Label value="İçerik" /></div>
              <Textarea name="content" rows={6} value={formData.content} onChange={handleChange} placeholder="Yazını buraya yaz..." />
            </div>

            <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={handleSave}>
              {article ? "Güncelle" : "Yayınla"}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};