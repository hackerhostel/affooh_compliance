const MainPageLayout = ({ leftColumn, rightColumn }) => {
  return (
    <div className="grid grid-cols-5 h-screen">
      {/* Left Column (1 part) */}
      <div className="col-span-1">
        {leftColumn}
      </div>
      {/* Right Column (4 parts) */}
      <div className="col-span-4">
        {rightColumn}
      </div>
    </div>
  );
}

export default MainPageLayout;