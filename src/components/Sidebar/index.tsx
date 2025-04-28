// "use client";

// import React from "react";
// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import SidebarItem from "@/components/Sidebar/SidebarItem";
// import ClickOutside from "@/components/ClickOutside";
// import useLocalStorage from "@/hooks/useLocalStorage";
// import { SVGIconProvider } from "@/constants/svgIconProvider";
// import { useState } from "react";
// import LogoutModal from "../common/Modal/LogoutModal";
// import { useDisclosure } from "@nextui-org/react";

// const menuGroups = [
//   {
//     name: "MAIN MENU",
//     menuItems: [
//       {
//         icon: <SVGIconProvider iconName="dashboard" />,
//         label: "Dashboard",
//         route: "/",
//       },
//       {
//         icon: <SVGIconProvider iconName="calendar" />,
//         label: "Appointments",
//         route: "/appointment",
//       },
//       {
//         icon: <SVGIconProvider iconName="rupee" />,
//         label: "Payments",
//         route: "/payment/overview",
//       },
//       {
//         icon: <SVGIconProvider iconName="patient" />,
//         label: "Patients",
//         route: "/patient",
//       },
//       {
//         icon: <SVGIconProvider iconName="employee" />,
//         label: "Employees",
//         route: "/employee",
//       },

//       {
//         icon: <SVGIconProvider iconName="growth" />,
//         label: "Network Boost",
//         route: "#",
//         children: [
//           { label: "User Groups", route: "/comingSoon" },
//           { label: "Channels", route: "/comingSoon" },
//           { label: "Set Promotions", route: "/comingSoon" },
//         ],

//       },
//       {
//         icon: <SVGIconProvider iconName="reminder" />,
//         label: "Reminders",
//         route: "/reminders",
//       }
//     ],
//   },
//   {
//     name: "OTHERS",
//     menuItems: [
//       {
//         icon: <SVGIconProvider iconName="setting" />,
//         label: "Settings",
//         route: "/settings",
//       },
//       {
//         icon: <SVGIconProvider iconName="pie-circle" />,
//         label: "Clinic/Hospital",
//         route: "/clinic",
//       },
//       {
//         icon: <SVGIconProvider iconName="sign-out" />,
//         label: "Sign Out",
//         route: "/auth/signout",
//       },
//     ],
//   },
// ];

// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (arg: boolean) => void;
// }

// const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {

//   const pathname = usePathname();
//   const router = useRouter()
//   const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [loadingItem, setLoadingItem] = useState<string | null>(null);

//   const handleSignOutClick = () => {
//     onOpen(); // Open the modal when "Sign Out" is clicked
//   };

//   const handleLogout = () => {
//     // Perform logout logic and redirect to the signout route
//     window.location.href = "/auth/signout";
//   };

//   const handleMenuItemClick = async (route: string, label: string) => {
//     setLoadingItem(label); // Set the loading state for the clicked menu item
//     await router.push(route); // Navigate to the new route
//     setLoadingItem(null); // Reset the loading state after navigation
//   };
//   return (
//     <>
//       <ClickOutside onClick={() => setSidebarOpen(false)}>
//         <aside
//           className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${sidebarOpen
//             ? "translate-x-0 duration-300 ease-linear"
//             : "-translate-x-full"
//             }`}
//         >
//           {/* <!-- SIDEBAR HEADER --> */}
//           <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
//             <Link href="/">
//               <Image
//                 width={65}
//                 height={65}
//                 src={"/images/logo/logo-dark.png"}
//                 alt="Logo"
//                 priority
//                 className="dark:hidden"
//                 style={{ width: "auto", height: "auto" }}
//               />
//               <Image
//                 width={65}
//                 height={65}
//                 src={"/images/logo/logo-dark.png"}
//                 alt="Logo"
//                 priority
//                 className="hidden dark:block"
//                 style={{ width: "auto", height: "auto" }}
//               />
//             </Link>

//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="block lg:hidden"
//             >
//               <svg
//                 className="fill-current"
//                 width="20"
//                 height="18"
//                 viewBox="0 0 20 18"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
//                   fill=""
//                 />
//               </svg>
//             </button>
//           </div>
//           {/* <!-- SIDEBAR HEADER --> */}

//           <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
//             {/* <!-- Sidebar Menu --> */}
//             <nav className="mt-1 px-4 lg:px-6">
//               {menuGroups.map((group, groupIndex) => (
//                 <div key={groupIndex}>
//                   <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
//                     {group.name}
//                   </h3>

//                   <ul className="mb-6 flex flex-col gap-2">
//                     {group.menuItems.map((menuItem, menuIndex) => {
//                       const isActive =
//                         pathname === menuItem.route ||
//                         (menuItem.children &&
//                           menuItem.children.some(
//                             (child) => pathname === child.route
//                           ));

//                     return menuItem.label === "Sign Out" ? (
//                         <li key={menuIndex}>
//                           <button
//                             onClick={handleSignOutClick}
//                           className={`relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out  w-full ${
//                               isActive
//                                 ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
//                                 : "text-dark-4 hover:bg-gray-2 dark:text-gray-5 dark:hover:bg-white/10"
//                             }`}
//                           >
//                             {menuItem.icon}
//                             <span className="text-md font-medium">{menuItem.label}</span>
//                           </button>
//                         </li>
//                       ) : (
//                         <SidebarItem
//                           key={menuIndex}
//                           item={menuItem}
//                           isActive={isActive}
//                           pageName={pageName}
//                           setPageName={setPageName}
//                           loading={loadingItem === menuItem.label} // Pass loading state to SidebarItem
//                           onClick={() => handleMenuItemClick(menuItem.route, menuItem.label)}
//                         />
//                       );
//                     })}

//                   </ul>
//                 </div>
//               ))}
//             </nav>
//             {/* <!-- Sidebar Menu --> */}
//           </div>
//         </aside>
//       </ClickOutside>
//       <LogoutModal
//         isOpen={isOpen}
//         onClose={onClose}
//         loading={false}
//         onLogout={handleLogout}
//       />
//     </>
//   );
// };

// export default Sidebar;

"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "@/components/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import LogoutModal from "../common/Modal/LogoutModal";
import { useDisclosure } from "@nextui-org/react";
import { useEffect } from "react";
const menuGroups = [
  {
    name: "MAIN MENU",
    menuItems: [
      {
        icon: <SVGIconProvider iconName="dashboard" />,
        label: "Dashboard",
        route: "/",
      },
      {
        icon: <SVGIconProvider iconName="calendar" />,
        label: "Appointments",
        route: "/appointment",
      },
      {
        icon: <SVGIconProvider iconName="rupee" />,
        label: "Payments",
        route: "/payment/overview",
      },
      {
        icon: <SVGIconProvider iconName="smalldocument" />,
        label: "Reports",
        route: "/reports",
      },

      {
        icon: <SVGIconProvider iconName="patient" />,
        label: "Patients",
        route: "/patient",
      },
      {
        icon: <SVGIconProvider iconName="employee" />,
        label: "Employees",
        route: "/employee",
      },
      {
        icon: <SVGIconProvider iconName="growth" />,
        label: "Network Boost",
        route: "#",
        children: [
          { label: "User Groups", route: "/comingSoon" },
          { label: "Channels", route: "/comingSoon" },
          { label: "Set Promotions", route: "/comingSoon" },
        ],
      },
      {
        icon: <SVGIconProvider iconName="reminder" />,
        label: "Reminders",
        route: "/reminders",
      },
     
    ],
  },
  {
    name: "OTHERS",
    menuItems: [
      {
        icon: <SVGIconProvider iconName="setting" />,
        label: "Settings",
        route: "/settings",
      },
      {
        icon: <SVGIconProvider iconName="pie-circle" />,
        label: "Clinic/Hospital",
        route: "/clinic",
      },
      {
        icon: <SVGIconProvider iconName="sign-out" />,
        label: "Sign Out",
        route: "/auth/signout",
      },
    ],
  },
];

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingItem, setLoadingItem] = useState<string | null>(null); // Track which menu item is loading

  const [isDarkMode, setIsDarkMode] = useState(false);

  
  useEffect(() => {
    const rootElement = document.documentElement;

    // Function to update the theme state
    const updateDarkMode = () => {
      setIsDarkMode(rootElement.classList.contains("dark"));
    };

   
    updateDarkMode();

    // MutationObserver to watch for changes to the "class" attribute of the <html> tag
    const observer = new MutationObserver(() => {
      updateDarkMode();
    });

    // Observe the class attribute on the <html> element
    observer.observe(rootElement, { attributes: true, attributeFilter: ["class"] });

    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSignOutClick = () => {
    onOpen(); // Open the modal when "Sign Out" is clicked
  };

  const handleLogout = () => {
    // Perform logout logic and redirect to the signout route
    window.location.href = "/auth/signout";
  };

  const handleMenuItemClick = async (route: string, label: string) => {
    setLoadingItem(label); // Set the loading state for the clicked menu item
    await router.push(route); // Navigate to the new route
    setLoadingItem(null); // Reset the loading state after navigation
  };

  useEffect(() => {
    const header = document.querySelector("header");
    const sidebar = document.querySelector("aside"); // Select the sidebar

    if (header) {
      // Only modify z-index when modal is open
      if (isOpen) {
        header.classList.remove("z-999");
        header.classList.add("z-0");
      } else {
        header.classList.remove("z-0");
        header.classList.add("z-999");
      }
    }

    if (sidebar) {
      // Check if the sidebar element exists
      if (isOpen) {
        sidebar.classList.remove("z-9999");
        sidebar.classList.add("z-0");
      } else {
        sidebar.classList.remove("z-0");
        sidebar.classList.add("z-9999");
      }
    }
  }, [isOpen]);

  return (
    <>
      <ClickOutside onClick={() => setSidebarOpen(false)}>
        <aside
          className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
            sidebarOpen
              ? "translate-x-0 duration-300 ease-linear"
              : "-translate-x-full"
          }`}
        >
          {/* <!-- SIDEBAR HEADER --> */}
          <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
            <Link href="/">
              <Image
                width={65}
                height={65}
                src={
                isDarkMode?
                  "https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/logo-dark.png"  // Dark mode logo
                  :"https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/logo-icon.png"  // Light mode logo
              }
                alt="Logo"
                priority
                className="dark:hidden"
                style={{ width: "auto", height: "auto" }}
              />
              <Image
                width={65}
                height={65}
                src={
                  isDarkMode?
                    "https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/logo-dark.png"  // Dark mode logo
                    :"https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/logo-icon.png"  // Light mode logo
                }
                alt="Logo"
                priority
                className="hidden dark:block"
                style={{ width: "auto", height: "auto" }}
              />
            </Link>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="block lg:hidden"
            >
              <svg
                className="fill-current"
                width="20"
                height="18"
                viewBox="0 0 20 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                  fill=""
                />
              </svg>
            </button>
          </div>
          {/* <!-- SIDEBAR HEADER --> */}

          <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
            {/* <!-- Sidebar Menu --> */}
            <nav className="mt-1 px-4 lg:px-6">
              {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                    {group.name}
                  </h3>

                  <ul className="mb-6 flex flex-col gap-2">
                    {group.menuItems.map((menuItem, menuIndex) => {
                      const isActive =
                        pathname === menuItem.route ||
                        (menuItem.children &&
                          menuItem.children.some(
                            (child) => pathname === child.route,
                          ));

                      return menuItem.label === "Sign Out" ? (
                        <li key={menuIndex}>
                          <button
                            onClick={handleSignOutClick}
                            className={`relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out w-full ${
                              isActive
                                ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
                                : "text-dark-4 hover:bg-gray-2 dark:text-gray-5 dark:hover:bg-white/10"
                            }`}
                          >
                            {menuItem.icon}
                            <span className="text-md font-medium">
                              {menuItem.label}
                            </span>
                          </button>
                        </li>
                      ) : (
                        <SidebarItem
                          key={menuIndex}
                          item={menuItem}
                          isActive={isActive}
                          pageName={pageName}
                          setPageName={setPageName}
                          loading={loadingItem === menuItem.label} // Pass loading state to SidebarItem
                          onClick={() =>
                            handleMenuItemClick(menuItem.route, menuItem.label)
                          } // Handle click
                        />
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
            {/* <!-- Sidebar Menu --> */}
          </div>
        </aside>
      </ClickOutside>
      <LogoutModal
        isOpen={isOpen}
        onClose={onClose}
        loading={false}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Sidebar;
