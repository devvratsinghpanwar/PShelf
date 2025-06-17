import "./App.css";
import Header from "./components/header";
import ProductDisplay from "./components/productDisplay";
import { SidebarDemo } from "./components/Sidebar";

function MainContent() {

  return (
    <div>
      <Header />
      <ProductDisplay />
      <ProductDisplay />
      <ProductDisplay />
      <ProductDisplay />
    </div>
  );
}

function App() {
  return (
    <div className="App flex flex-row">
      <div>
        <SidebarDemo />
      </div>
      <div className="flex-1 ml-4">
          <MainContent />
      </div>
    </div>
  );
}

export default App;
