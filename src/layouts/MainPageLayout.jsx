import {PlusCircleIcon} from "@heroicons/react/24/outline/index.js";
import React from "react";

const MainPageLayout = ({title, leftColumn, rightColumn, subText}) => {
  return (
    <div className="grid grid-cols-5 h-full">
      {/* Left Column (1 part) */}
      <div className="col-span-1">
          <div className="pl-4 my-3 flex justify-between">
              <span className="text-2xl font-medium">{title}</span>
              {subText && (
                  <div className={"flex gap-1 items-center mr-5"}>
                      <PlusCircleIcon className={"w-6 h-6 text-pink-500"}/>
                      <span className="font-thin text-xs text-gray-600">{subText}</span>
                  </div>
              )}
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