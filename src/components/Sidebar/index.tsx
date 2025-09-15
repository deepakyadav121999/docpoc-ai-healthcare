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
import { useChat } from "@/components/Context/ChatContext";
import { getChatSessions } from "@/api/doku-chat";
const menuGroups = [
  {
    name: "AI ASSISTANT",
    menuItems: [
      {
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
          </svg>
        ),
        label: "New Chat",
        route: "/",
        isNewChat: true,
      },
      {
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ),
        label: "History",
        route: "/history",
      },
      {
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        ),
        label: "Back to App",
        route: "https://portal.docpoc.app",
        isExternal: true,
      },
    ],
  },
  {
    name: "ACCOUNT",
    menuItems: [
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
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { startNewChat } = useChat();
  // const [isNavigating, setIsNavigating] = useState(false);

  const loadChatHistory = async () => {
    try {
      console.log("Loading chat history...");
      const sessions = await getChatSessions(10, 0);
      console.log("Chat sessions loaded:", sessions);
      setChatHistory(sessions || []);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      setChatHistory([]);
    }
  };

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
    observer.observe(rootElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

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

  // const handleMenuItemClick = async (route: string, label: string) => {
  //   setLoadingItem(label); // Set the loading state for the clicked menu item
  //   await router.push(route); // Navigate to the new route
  //   setLoadingItem(null); // Reset the loading state after navigation
  // };

  const handleMenuItemClick = async (
    route: string,
    label: string,
    isNewChat: boolean = false,
    isExternal: boolean = false,
  ) => {
    console.log("handleMenuItemClick called with:", {
      route,
      label,
      isNewChat,
      isExternal,
      currentPath: pathname,
    });

    if (pathname === route && !isNewChat) {
      console.log("Already on the same route, skipping navigation");
      return; // Don't navigate if already on the same route
    }

    setLoadingItem(label);
    console.log("Loading state set for:", label);

    if (isExternal) {
      // Handle external link
      console.log("Opening external link:", route);
      window.open(route, "_blank");
      setLoadingItem(null);
    } else if (isNewChat) {
      // Handle new chat creation
      try {
        console.log("Starting new chat...");
        startNewChat();
        console.log("New chat started successfully");
        // Clear loading state immediately after starting new chat
        setLoadingItem(null);
        console.log("Loading state cleared");

        // Only navigate if we're not already on the home page
        if (pathname !== "/") {
          console.log("Navigating to home page...");
          await router.push("/");
          console.log("Navigation completed");
        } else {
          console.log("Already on home page, no navigation needed");
        }
      } catch (error) {
        console.error("Navigation error:", error);
        setLoadingItem(null);
      }
    } else {
      try {
        console.log("Navigating to route:", route);
        await router.push(route);
        console.log("Navigation completed");
      } catch (error) {
        console.error("Navigation error:", error);
        setLoadingItem(null);
      }
    }
  };

  // Alternative solution for route change detection
  useEffect(() => {
    // This will run when the pathname changes, indicating navigation completion
    setLoadingItem(null);
    // setIsNavigating(false);
  }, [pathname]);

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
          className={`absolute left-0 top-0 z-9999 flex h-screen w-72 sm:w-80 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
            sidebarOpen
              ? "translate-x-0 duration-300 ease-linear"
              : "-translate-x-full"
          }`}
        >
          {/* <!-- SIDEBAR HEADER --> */}
          <div className="flex items-center justify-between gap-2 px-4 sm:px-6 py-5.5 lg:py-6.5 xl:py-10">
            <Link href="/">
              <Image
                width={65}
                height={65}
                src={
                  isDarkMode
                    ? "https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/logo-dark.png" // Dark mode logo
                    : "https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/logo-icon.png" // Light mode logo
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
                  isDarkMode
                    ? "https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/logo-dark.png" // Dark mode logo
                    : "https://docpoc-assets.s3.ap-south-1.amazonaws.com/docpoc-images/logo-icon.png" // Light mode logo
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
            <nav className="mt-1 px-3 sm:px-4 lg:px-6">
              {menuGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                    {group.name}
                  </h3>

                  <ul className="mb-6 flex flex-col gap-2">
                    {group.menuItems.map(
                      (
                        menuItem: {
                          icon: React.ReactNode;
                          label: string;
                          route: string;
                          children?: Array<{ label: string; route: string }>;
                          isNewChat?: boolean;
                          isExternal?: boolean;
                        },
                        menuIndex,
                      ) => {
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
                        ) : menuItem.label === "History" ? (
                          <li key={menuIndex}>
                            <button
                              onClick={() => {
                                setShowHistory(!showHistory);
                                if (!showHistory) {
                                  loadChatHistory();
                                }
                              }}
                              className={`relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out w-full ${
                                showHistory
                                  ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
                                  : "text-dark-4 hover:bg-gray-2 dark:text-gray-5 dark:hover:bg-white/10"
                              }`}
                            >
                              {menuItem.icon}
                              <span className="text-md font-medium">
                                {menuItem.label}
                              </span>
                              <svg
                                className={`w-4 h-4 ml-auto transition-transform duration-200 ${
                                  showHistory ? "rotate-180" : ""
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            {showHistory && (
                              <div className="ml-4 mt-2 space-y-2">
                                <div className="text-xs text-gray-500 dark:text-gray-400 px-3.5">
                                  Recent Conversations
                                </div>
                                {chatHistory.length > 0 ? (
                                  chatHistory.slice(0, 5).map((chat, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => {
                                        // Handle chat selection
                                        console.log("Selected chat:", chat);
                                        // TODO: Load the selected chat conversation
                                        // This would require implementing a function to load chat messages
                                        // For now, just close the history panel
                                        setShowHistory(false);
                                      }}
                                      className="w-full text-left px-3.5 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                    >
                                      <div className="truncate">
                                        {chat.title ||
                                          chat.sessionId ||
                                          "Untitled Chat"}
                                      </div>
                                      <div className="text-xs text-gray-400 dark:text-gray-500">
                                        {chat.timestamp
                                          ? new Date(
                                              chat.timestamp,
                                            ).toLocaleDateString()
                                          : "Unknown date"}
                                      </div>
                                    </button>
                                  ))
                                ) : (
                                  <div className="text-xs text-gray-400 dark:text-gray-500 px-3.5 py-2">
                                    No recent chats
                                  </div>
                                )}
                              </div>
                            )}
                          </li>
                        ) : menuItem.label === "New Chat" ? (
                          <li key={menuIndex}>
                            <button
                              onClick={() =>
                                handleMenuItemClick(
                                  menuItem.route,
                                  menuItem.label,
                                  menuItem.isNewChat || false,
                                  menuItem.isExternal || false,
                                )
                              }
                              disabled={loadingItem === menuItem.label}
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
                              {loadingItem === menuItem.label && (
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                                </div>
                              )}
                            </button>
                          </li>
                        ) : (
                          <SidebarItem
                            key={menuIndex}
                            item={menuItem}
                            isActive={isActive}
                            pageName={pageName}
                            setPageName={setPageName}
                            loading={loadingItem === menuItem.label}
                            onClick={() =>
                              handleMenuItemClick(
                                menuItem.route,
                                menuItem.label,
                                menuItem.isNewChat || false,
                                menuItem.isExternal || false,
                              )
                            }
                          />
                        );
                      },
                    )}
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
