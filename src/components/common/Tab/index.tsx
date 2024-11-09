import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { TOOL_TIP_COLORS } from "@/constants";

export default function TabDefault(props: {
  color: TOOL_TIP_COLORS;
  options: { [key: string]: { name: string; screen: any } };
  itemsArray?: any[];
}) {
  return (
    <div className="flex flex-wrap gap-4 justify-center w-full px-4">
      <Tabs
        key={props.color}
        color={props.color}
        aria-label="Tabs colors"
        radius="full"
        className="bg-[var(--background-color)] dark:bg-gray-800 rounded-full p-2 shadow-[2px_2px_6px_var(--shadow-color),-2px_-2px_6px_var(--light-shadow)] dark:shadow-[2px_2px_6px_rgba(0,0,0,0.5),-2px_-2px_6px_rgba(0,0,0,0.5)]"
      >
        {Object.entries(props.options).map(([key, item], index) => (
          <Tab key={index} title={item.name} className="w-full">
            {item.screen}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
