import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { NavbarComponent } from "./components/Navbar";
import { HomePage } from "./pages/Home";

function MainContent() {
  return (
    <div className="mt-20">
      <HomePage />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="sticky top-0 flex m-0 z-10">
        <NavbarComponent />
      </div>
      <div className="App flex m-0">
        <div className="flex-1 md:ml-4">
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
