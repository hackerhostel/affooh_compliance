const MainPageLayout = ({ title, leftColumn, rightColumn }) => {
  return (
    <div className="grid grid-cols-5 h-full">
      {/* Left Column (1 part) */}
      <div className="col-span-1">
        <div className="pl-4 my-3">
          <span className="text-2xl font-medium">{title}</span>
        </div>
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