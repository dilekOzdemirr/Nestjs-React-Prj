import ProfileTable from './components/ProfileTable';
import { Toaster } from 'sonner';

function App() {
  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Profil Yönetimi Sistemi
      </h1>
      
      
      <ProfileTable />

     
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;