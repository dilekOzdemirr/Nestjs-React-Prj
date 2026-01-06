import { Button, Modal, ModalBody, Table, Badge } from "flowbite-react";
import { ArticleFormModal } from "./ArticleFormModal";
import { FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState } from "react";
import axios from "axios";
import { API_URL } from '../config/api';
import { toast } from "sonner";

export const ArticleRow = ({ fetchArticles, article }) => {
  const [showDelete, setShowDelete] = useState(false);

  // Kategori yoksa hata vermesin diye kontrol
  const categoryName = article.categories && article.categories.length > 0
    ? article.categories[0].name
    : "Kategorisiz";

  return (
    <>
      {/* Silme Onay Modalı */}
      <Modal show={showDelete} size="md" onClose={() => setShowDelete(false)} popup>
        <ModalBody>
          <div className="text-center p-4">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-orange-400" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              "{article.title}" başlıklı yazıyı silmek istiyor musun?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => {
                axios.delete(`${API_URL}/article/` + article.id)
                  .then(() => { fetchArticles(); setShowDelete(false); toast.success("Silindi!"); })
                  .catch(() => toast.error("Hata oluştu"));
              }}>
                Evet, Sil
              </Button>
              <Button color="gray" onClick={() => setShowDelete(false)}>İptal</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      <Table.Row className="bg-white border-b hover:bg-orange-50 transition-colors">
        <Table.Cell className="font-bold text-orange-600">#{article.id}</Table.Cell>

        {/* Başlık ve İçerik Özeti */}
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
          <div className="text-base">{article.title}</div>
          <div className="text-xs text-gray-400 truncate max-w-[200px]">{article.content}</div>
        </Table.Cell>

        {/* Yazar Bilgisi */}
        <Table.Cell>
          <div className="flex items-center gap-2">
            {article.author?.photo && (
              <img src={article.author.photo} className="w-6 h-6 rounded-full object-cover" alt="yazar" />
            )}
            <span className="text-sm">{article.author?.username || "Bilinmiyor"}</span>
          </div>
        </Table.Cell>

        {/* Kategori */}
        <Table.Cell>
          <Badge color="warning" className="w-fit">{categoryName}</Badge>
        </Table.Cell>

        {/* İşlemler */}
        <Table.Cell>
          <div className="flex gap-2">
            <ArticleFormModal fetchArticles={fetchArticles} article={article} />
            <Button size="xs" color="failure" onClick={() => setShowDelete(true)}>
              <FaTrash />
            </Button>
          </div>
        </Table.Cell>
      </Table.Row>
    </>
  );
};