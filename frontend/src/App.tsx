import { Route, Routes } from 'react-router-dom';
import CompanyForm from './pages/CompanyForm/index.tsx';

function App() {
  return (
    <Routes>
      <Route path="/empresas/cadastrar" element={<CompanyForm />} />
    </Routes>
  );
}

export default App;
