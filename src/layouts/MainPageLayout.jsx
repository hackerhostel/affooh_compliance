import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline/index.js";
import React, { useState } from "react";

const MainPageLayout = ({
  title,
  leftColumn,
  rightColumn,
  subText,
  onAction,
}) => {
  const [isLeftColumnVisible, setIsLeftColumnVisible] = useState(true);

  const hideLeftColumn = () => setIsLeftColumnVisible(false);
  const showLeftColumn = () => setIsLeftColumnVisible(true);

  return (
    <div className="grid grid-cols-5 h-full">
      {isLeftColumnVisible && (
        <div className="col-span-1">
          <div className="p-4 border-r border-gray-300 relative">
            <div className="my-3">
              <div className="text-2xl font-medium">{title}</div>
              {subText && (
                <div
                  className={"flex gap-1 items-center mr-5"}
                  onClick={onAction}
                >
                  <PlusCircleIcon
                    className={"w-6 h-6 text-pink-500 cursor-pointer"}
                  />
                  <span className="font-thin text-xs text-gray-600">
                    {subText}
                  </span>
                </div>
              )}
            </div>
            {leftColumn}

            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
              <ChevronDoubleLeftIcon
                onClick={hideLeftColumn}
                className={"w-4 h-4 text-pink-500 cursor-pointer"}
              />
            </div>
          </div>
        </div>
      )}
      <div className={isLeftColumnVisible ? "col-span-4" : "col-span-5"}>
        <div className={"w-full h-full flex-grow flex"}>
          {!isLeftColumnVisible && (
            <div
              className={"flex gap-1 items-center ml-2 mr-2"}
              onClick={showLeftColumn}
            >
              <ChevronDoubleRightIcon
                className={"w-4 h-4 text-pink-500 cursor-pointer"}
              />
            </div>
          )}
          <div className={"w-full h-full flex-grow"}>{rightColumn}</div>
        </div>
      </div>
    </div>
  );
};

export default MainPageLayout;
