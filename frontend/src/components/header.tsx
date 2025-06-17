const Header = () => {
  return (
    <div className="bg-[#0071ce] rounded-xl shadow-lg p-1 gap-2">
      <div className="flex items-center justify-between h-24 mb-5 w-full">
        {/* Left section (Sidebar button / "hello") */}
        <div className="text-white">hello</div>

        {/* Center section (Title & Subtitle) */}
        <header className="text-center mx-auto">
          <h1 className="text-4xl font-bold text-amber-400">
            Predictive Shelf Dashboard
          </h1>
          <p className="text-white text-sm">
            A hyper-local demand forecasting tool for Walmart.
          </p>
        </header>

        {/* Right section (optional - keeps layout balanced) */}
        <div className="w-[3rem]">{/* Spacer or future content */}</div>
      </div>
    </div>
  );
};

export default Header;
