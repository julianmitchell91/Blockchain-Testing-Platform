import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProblemPage from "./pages/ProblemPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="problem/:id" element={<ProblemPage />} />
      </Route>
    </Routes>
  );
}

export default App;
