import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DetailsAsset } from '../pages/DetailsAsset';

// PAGES
import { Home } from '../pages/Home';

export const UserRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ativo/:id" element={<DetailsAsset />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};
