import { BrowserRouter as Router, Routes, Route } from "react-router";
import { useMemo } from "react";
import HomePage from "@/react-app/pages/Home";
import AdminPage from "@/react-app/pages/Admin";

export default function App() {
  const basename = useMemo(() => "/web/", []); // <-- ¡Agrega esta línea!

  return (
    <Router basename={basename}> // <-- ¡Modifica esta línea!
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}