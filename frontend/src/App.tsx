import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import ProductDisplay from "./components/productDisplay";
import { SidebarDemo } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { SidebarProvider } from "./components/ui/sidebar";

function MainContent() {
  return (
    <div>
      <ProductDisplay />
      <ProductDisplay />
      <ProductDisplay />
      <ProductDisplay />
    </div>
  );
}

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="App flex m-0">
          <SidebarDemo />
          <div className="flex-1 md:ml-4">
            <Header />
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;
