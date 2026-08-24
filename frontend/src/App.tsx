import { Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage/index.tsx';
import ListPage from './pages/ListPage/index.tsx';
import EditPage from './pages/EditPage/index.tsx';

function App() {
  return (
    <Routes>
      <Route path="/empresas/cadastrar" element={<RegisterPage />} />
      <Route path="/empresas" element={<ListPage />} />
      <Route path="/empresas/editar/:id" element={<EditPage />} />
    </Routes>
  );
}

export default App;
