import { Route, Routes } from "react-router";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import Navigation from "./components/Navigation";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<ProfilePage />} />
        <Route path="/edit" element={<EditProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
