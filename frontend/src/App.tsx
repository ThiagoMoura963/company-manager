import { Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage/index.tsx';
import ListPage from './pages/ListPage/index.tsx';

function App() {
  return (
    <Routes>
      <Route path="/empresas/cadastrar" element={<RegisterPage />} />
      <Route path="/empresas" element={<ListPage />} />
    </Routes>
  );
}

export default App;
