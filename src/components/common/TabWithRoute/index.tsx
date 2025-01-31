"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import { GLOBAL_TAB_NAVIGATOR_ACTIVE, TOOL_TIP_COLORS } from "@/constants";
import { useRouter } from "next/navigation";

interface TabOption {
  screen: string;
  name: string;
}

interface TableDefaultProps {
  options: Record<string, TabOption>;
  color: TOOL_TIP_COLORS;
  current?: string;
}

const TabDefaultWithRoute: React.FC<TableDefaultProps> = ({ options, current }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isNext, setIsNext] = React.useState('');
  const handleTabClick = (path: string) => {
    router.push(path); // Correct client-side navigation
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center w-full px-4">
      <div
        aria-label="Tabs colors"
        className="bg-[var(--background-color)] dark:bg-gray-800 rounded-full p-2 shadow-[2px_2px_6px_var(--shadow-color),-2px_-2px_6px_var(--light-shadow)] dark:shadow-[2px_2px_6px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(0,0,0,0.5)] tab_buttons"
      >
        {Object.entries(options).map(([key, item], index) => (
          <Button
            key={index}
            style={{
              margin: 5,
              backgroundColor: current === item.screen ? GLOBAL_TAB_NAVIGATOR_ACTIVE : '',
            }}
            isLoading= {isLoading && isNext === item.screen}
            className="dark:bg-gray-800 rounded-full p-2 shadow-[2px_2px_6px_var(--shadow-color),-2px_-2px_6px_var(--light-shadow)] dark:shadow-[2px_2px_6px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(0,0,0,0.5)] text-medium px-5 m-0 "
            onClick={async () => {setIsNext(item.screen), setIsLoading(true), handleTabClick(item.screen)}} // Use router.push() instead
          >
            {item.name}
          </Button>
        ))}
      </div>

      <style>
      {`
          /* Adjustments for mobile screens */
          @media (max-width: 500px) {
            .tab_buttons {
              display: flex;
              // flex-direction: column; /* Switch to column layout */
              align-items: center; 
              padding: 2px;
              // border-radius: 13px /* Center all items */
            }

            /* Smaller button and text size for small screens */
            .tab_buttons button {
              font-size: 0.7rem; /* Reduced font size */
              padding: 0.3rem 0.6rem; /* Reduced padding for smaller buttons */
              margin: 4px 0; /* Add spacing between buttons */
            }
          }
        `}
     
      </style>
    </div>
  );
};

export default TabDefaultWithRoute;
