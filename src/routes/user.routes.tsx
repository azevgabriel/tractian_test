import { BrowserRouter, Routes, Route } from 'react-router-dom';

// PAGES
import { Home } from '../pages/Home';

export const UserRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};
