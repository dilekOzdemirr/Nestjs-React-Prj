import { Button, Modal, ModalBody, Table } from "flowbite-react";
import { ProfileFormModal } from "./ProfileFormModal";
import { FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export const ProfileRow = ({ fetchProfiles, profile }) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      
      <Modal show={showDelete} size="md" onClose={() => setShowDelete(false)} popup>
        
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bu profili silmek istediğinize emin misiniz?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="red"
                onClick={() => {
                  axios.delete("http://localhost:3000/profiles/" + profile.id)
                    .then(() => {
                      fetchProfiles();
                      setShowDelete(false);
                      toast.success("Profil silindi");
                    })
                    .catch(() => toast.error("Bir hata oluştu"));
                }}
              >
                Evet, eminim
              </Button>
              <Button color="alternative" onClick={() => setShowDelete(false)}>
                Hayır, iptal
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* Tablo Satırı */}
      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
        <Table.Cell className="text-center w-12 px-3">{profile.id}</Table.Cell>
      <Table.Cell className="w-20 px-4 py-1"> 
        <div className="flex justify-center">
            <img src={profile.photo} alt="Profil" className="w-10 h-10 rounded-full object-cover"/>
        </div>
      </Table.Cell>
        <Table.Cell className="text-sm font-semibold px-4 pl-40">{profile.username}</Table.Cell>
        <Table.Cell className="px-4 ml-8 pl-30">{profile.email}</Table.Cell>
        <Table.Cell className="text-center w-28 px-3">
            
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {profile.profileType ? profile.profileType.name : '-'}
            </span>
        </Table.Cell>
        <Table.Cell lassName="text-center w-24 px-3">
          <div className="flex gap-2">
            {/* Düzenleme  */}
            <ProfileFormModal fetchProfiles={fetchProfiles} profile={profile} />
            
            {/* Silme Butonu */}
            <Button size="xs" color="failure" onClick={() => setShowDelete(true)}>
              <FaTrash />
            </Button>
          </div>
        </Table.Cell>
      </Table.Row>
    </>
  );
};

