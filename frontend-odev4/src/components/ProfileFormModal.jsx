import { Button, Label, Modal, ModalBody, TextInput, Select, FileInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";

export const ProfileFormModal = ({ fetchProfiles, profile }) => {
  const [show, setShow] = useState(false);
  
  
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileTypeId: "",
    photo: null
  });

  
  useEffect(() => {
    if (show) {
      // tipleri cektik
      axios.get('http://localhost:3000/profileTypes')
        .then(res => setTypes(res.data));

      if (profile) {
        // Düzenleme modunda da dolduruyorr
        setFormData({
            username: profile.username,
            email: profile.email,
            profileTypeId: profile.profileType?.id || "",
            password: "",
            confirmPassword: "",
            photo: null
        });
      } else {
        // Ekleme modunda sıfırlıyo ilk
        setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            profileTypeId: "",
            photo: null
        });
      }
    }
  }, [show, profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  function handleSave() {
    
    if (!profile || formData.password) {
         if (formData.password !== formData.confirmPassword) {
             toast.error("HATA: Şifreler uyuşmuyor!");
             return;
         }
         const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;
         if (!passwordRegex.test(formData.password)) {
             toast.error("Şifre kurallara uymuyor! (1 Büyük, 1 Küçük, 1 Sayı, 1 Sembol)");
             return;
         }
    }

    
    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('profileTypeId', formData.profileTypeId);
    
    if (formData.password) {
        data.append('password', formData.password);
        data.append('confirmPassword', formData.confirmPassword);
    }
    if (formData.photo) {
        data.append('photo', formData.photo);
    }

    
    if (profile) {
      axios.patch("http://localhost:3000/profiles/" + profile.id, data)
        .then(() => {
          fetchProfiles();
          toast.success("Profil başarıyla güncellendi");
          setShow(false);
        })
        .catch((error) => toast.error(error.response?.data?.message || "Güncelleme hatası"));
    } else {
      axios.post("http://localhost:3000/profiles", data)
        .then(() => {
          fetchProfiles();
          toast.success("Profil başarıyla eklendi");
          setShow(false);
        })
        .catch((error) => toast.error(error.response?.data?.message || "Ekleme hatası"));
    }
  }

  function getButton() {
    if (profile == null)
      return (
        <Button className="ml-auto mb-2" onClick={() => setShow(true)}>
          <FaPlus className="mr-2"/> Yeni Profil Ekle
        </Button>
      );
    return (
      <Button size="xs" color="warning" onClick={() => setShow(true)}>
        <FaEdit />
      </Button>
    );
  }

  return (
    <>
      <div className="flex">{getButton()}</div>
      <Modal show={show} size="md" onClose={() => setShow(false)} popup>
        
        <ModalBody>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                {profile == null ? "Yeni Profil Ekle" : "Profili Güncelle"}
            </h3>
            
            <div>
              <div className="mb-2 block"><Label value="Kullanıcı Adı" /></div>
              <TextInput name="username" value={formData.username} onChange={handleChange} />
            </div>

            <div>
              <div className="mb-2 block"><Label value="Email" /></div>
              <TextInput name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div>
                <div className="mb-2 block"><Label value="Profil Tipi" /></div>
                <Select name="profileTypeId" value={formData.profileTypeId} onChange={handleChange}>
                    <option value="">Seçiniz...</option>
                    {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </Select>
            </div>

            <div>
              <div className="mb-2 block"><Label value="Şifre" /></div>
              <TextInput type="password" name="password" value={formData.password} onChange={handleChange} placeholder={profile ? "Değişmeyecekse boş bırak" : ""} />
            </div>

            <div>
              <div className="mb-2 block"><Label value="Şifre Tekrar" /></div>
              <TextInput type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </div>

            <div>
                <div className="mb-2 block"><Label value="Fotoğraf" /></div>
                <FileInput name="photo" onChange={handleFileChange} />
            </div>

            <div className="w-full">
              <Button onClick={handleSave}>{profile ? "Güncelle" : "Kaydet"}</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
