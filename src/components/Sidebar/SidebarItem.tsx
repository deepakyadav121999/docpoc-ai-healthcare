import { useState,useEffect } from "react";
import Link from "next/link";
import SidebarDropdown from "@/components/Sidebar/SidebarDropdown";
import { Spinner } from "@nextui-org/spinner";
const SidebarItem = ({ item, pageName, setPageName, isActive }: any) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (pageName !== item.label.toLowerCase()) {
      setLoading(true);
      setPageName(item.label.toLowerCase());
    }
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
          <div className="">
            <Spinner size="sm" />
          </div>
        )}
      </Link>

      {item.children && (
        <div className={`${pageName !== item.label.toLowerCase() && "hidden"}transition-all duration-300`}
        onAnimationEnd={() => setLoading(false)}>
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li> 
  );
};

export default SidebarItem; 
