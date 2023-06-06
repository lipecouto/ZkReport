import logo from './logo.svg';

import {Route, Routes, BrowserRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import RelatorioBuilder from './pages/Personal';
import PdfTest from './components/Pdf/pdfViewer';
function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={''} />
        <Route path='/builder' element={<RelatorioBuilder/>} />
        <Route path='/pdfviewer' element={<PdfTest/>} />
      </Routes>
    </BrowserRouter>  
  );
}

export default App;
