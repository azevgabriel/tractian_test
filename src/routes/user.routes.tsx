import { BrowserRouter, Routes, Route } from 'react-router-dom';

// PAGES
import { Login } from '../pages/Login';

export const UserRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};
