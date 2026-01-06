import { Table } from "flowbite-react";
import { ArticleRow } from "./ArticleRow";
import { useEffect, useState } from "react";
import { ArticleFormModal } from "./ArticleFormModal";
import axios from "axios";
import { API_URL } from '../config/api';

const ArticleTable = () => {
  const [articles, setArticles] = useState([]);

  function fetchArticles() {
    axios.get(`${API_URL}/article`)
      .then((res) => setArticles(res.data))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Makale Listesi</h2>
        <ArticleFormModal fetchArticles={fetchArticles} article={null} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-orange-200 shadow-sm">
        <Table hoverable>
          <Table.Head className="bg-orange-100 text-orange-700">
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Başlık</Table.HeadCell>
            <Table.HeadCell>Yazar</Table.HeadCell>
            <Table.HeadCell>Kategori</Table.HeadCell>
            <Table.HeadCell>İşlemler</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {articles.map((a) => (
              <ArticleRow key={a.id} fetchArticles={fetchArticles} article={a} />
            ))}
            {articles.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center py-4 text-gray-500">
                  Henüz hiç makale eklenmemiş.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ArticleTable;