import { useState } from "react";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";

const SidebarItem = ({ item, pageName, setPageName, isActive }: any) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    setPageName(updatedPageName);
    setTimeout(() => setLoading(false), 1000);  
  };

  return (
    <li>
      <Link
        href={item.route}
        onClick={handleClick}
        className={`relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out ${
          isActive
            ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
            : "text-dark-4 hover:bg-gray-2 dark:text-gray-5 dark:hover:bg-white/10"
        }`}
      >
        {item.icon}
        {item.label}
        {loading && (
        <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 24 24"><path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25"/><path fill="currentColor" d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"><animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path></svg>
        )}
      </Link>

      {item.children && (
        <div className={`${pageName !== item.label.toLowerCase() && "hidden"}`}>
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
