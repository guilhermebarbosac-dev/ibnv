import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Contatos } from './pages/Contatos';
import { QuemSomos } from './pages/QuemSomos';
import { TrilhoCrescimento } from './pages/TrilhoCrescimento';
import { Downloads } from './pages/Downloads';
import { Generosidade } from './pages/Generosidade';
import { Redes } from './pages/Redes';
import { Agenda } from './pages/Agenda';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DynamicForm } from './pages/DynamicForm';
import { ToastProvider } from './components/context/ToastContext';
import { ToastContainer } from './components/ui/ToastContainer';
import { Estudos } from './pages/Estudos';
import { Estudo } from './pages/Estudo';
import { IbnvMusic } from './pages/IbnvMusic';
import { Oracao } from './pages/Oracao';
import { EncontreCelula } from './pages/EncontreCelula';

export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contatos" element={<Contatos />} />
            <Route path="quem-somos" element={<QuemSomos />} />
            <Route path="trilho-crescimento" element={<TrilhoCrescimento />} />
            <Route path="downloads" element={<Downloads />} />
            <Route path="generosidade" element={<Generosidade />} />
            <Route path="redes" element={<Redes />} />
            <Route path="estudos" element={<Estudos />} />
            <Route path="estudos/:id" element={<Estudo />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="music" element={<IbnvMusic />} />
            <Route path="oracao" element={<Oracao />} />
            <Route path="encontre-celula" element={<EncontreCelula />} />
          </Route>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/formulario/:formId" element={<DynamicForm />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </ToastProvider>
  );
}

