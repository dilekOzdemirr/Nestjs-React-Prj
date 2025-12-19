import { Table } from "flowbite-react";
import  {ProfileRow}  from "./ProfileRow";
import { useEffect, useState } from "react";
import { ProfileFormModal } from "./ProfileFormModal";
import axios from "axios";

const ProfileTable = () => {
  const [profiles, setProfiles] = useState([]);

  function fetchProfiles() {
    axios.get("http://localhost:3000/profiles")
        .then((res) => setProfiles(res.data))
        .catch(err => console.error(err));
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div className="p-4">
      
      <ProfileFormModal fetchProfiles={fetchProfiles} profile={null} />
      
      <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <Table hoverable>
            <Table.Head>
            <Table.HeadCell className="text-center text-sm font-semibold w-12 px-3" >ID</Table.HeadCell>
            <Table.HeadCell className="text-center text-sm font-semibold w-20 px-3" >Fotoğraf</Table.HeadCell>
            <Table.HeadCell className="text-sm font-semibold px-3  pr-40">Kullanıcı Adı</Table.HeadCell>
            <Table.HeadCell className="text-sm font-semibold px-3  pr-40">Email</Table.HeadCell>
            <Table.HeadCell className="text-center text-sm font-semibold w-28 px-3">Profil Tipi</Table.HeadCell>
            <Table.HeadCell className="text-center text-sm font-semibold w-24 px-3">İşlemler</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
            {profiles.map((p) => (
                <ProfileRow
                    key={p.id}
                    fetchProfiles={fetchProfiles}
                    profile={p}
                />
            ))}
            </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ProfileTable;