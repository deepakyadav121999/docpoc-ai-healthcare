// import Link from "next/link";
// import Image from "next/image";
// import { Chat } from "@/types/chat";

// const chatData: Chat[] = [
//   {
//     active: true,
//     avatar: "/images/user/user-01.png",
//     name: "Jag Singh",
//     text: "Surgery: molar cavity filling",
//     time: "42 min",
//     textCount: 3,
//     dot: 3,
//   },
//   {
//     active: true,
//     avatar: "/images/user/user-02.png",
//     name: "Bukun Sarkar",
//     text: "Regular checkup: dental flossing and cleaning",
//     time: "10:54 AM",
//     textCount: 0,
//     dot: 1,
//   },
//   {
//     active: null,
//     avatar: "/images/user/user-04.png",
//     name: "Aman Jha",
//     text: "Consult: Feeling pain in lower back after accident",
//     time: "11:30 AM",
//     textCount: 0,
//     dot: 3,
//   },
//   {
//     active: true,
//     avatar: "/images/user/user-01.png",
//     name: "Jag Singh",
//     text: "Surgery: molar cavity filling",
//     time: "2:00 PM",
//     textCount: 3,
//     dot: 3,
//   },
//   {
//     active: true,
//     seen: true,
//     avatar: "/images/user/user-05.png",
//     name: "Henry Deco",
//     text: "Surgery: Stiches removal post surgery",
//     time: "Thu",
//     textCount: 2,
//     dot: 6,
//   },
//   {
//     active: false,
//     avatar: "/images/user/user-06.png",
//     name: "Jubin Jack",
//     text: "Full Checkup: routine body checkup",
//     time: "Thu",
//     textCount: 0,
//     dot: 3,
//   },
// ];

// const ChatCard = () => {
//   return (
//     <div className="col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4">
//       <h4 className="mb-5.5 px-7.5 text-body-2xlg font-bold text-dark dark:text-white">
//         Upcoming Appointments
//       </h4>

//       <div style={{ overflowY: "scroll", maxHeight: 450 }}>
//         {chatData.map((chat, key) => (
//           <Link
//             href="/"
//             className="flex items-center gap-4.5 px-7.5 py-3 hover:bg-gray-1 dark:hover:bg-dark-2"
//             key={key}
//           >
//             {/* <div className="relative h-14 w-14 rounded-full">
//               <Image
//                 width={56}
//                 height={56}
//                 src={chat.avatar}
//                 alt="User"
//                 style={{
//                   width: "auto",
//                   height: "auto",
//                 }}
//               />
//               <span
//                 className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-dark-2 ${
//                   chat.active === true
//                     ? "bg-green"
//                     : chat.active === false
//                       ? `bg-red-light`
//                       : "bg-orange-light"
//                 }`}
//               ></span>
//             </div> */}

//             <div className="flex flex-1 items-center justify-between">
//               <div>
//                 <h5 className="font-medium text-dark dark:text-white">
//                   {chat.name}
//                 </h5>
//                 <p>
//                   <span
//                     className={`mb-px text-body-sm font-medium ${chat.seen ? "dark:text-dark-3" : "text-dark-3 dark:text-dark-6"}`}
//                   >
//                     {chat.text}
//                   </span>
//                   <span className="text-xs"> . {chat.time}</span>
//                 </p>
//               </div>
//               {chat.textCount !== 0 && (
//                 <div className="flex items-center justify-center rounded-full bg-primary px-2 py-0.5">
//                   <span className="text-sm font-medium text-white">
//                     {" "}
//                     {chat.textCount}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChatCard;

// import Link from "next/link";
import Image from "next/image";
import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Chat } from "@/types/chat";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/components/CalenderBox/ChevronDownIcon";
import AppointmentListModal from "@/components/common/Modal/AppointmentListModal";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Appointment {
  id: string;
  name: string;
  type: string;
  patient: {
    id: string;
    name: string;
    gender: string; // Added to match ChatCard's requirements
    displayPicture: string | null;
  };
  visitType: {
    id: string;
    name: string;
  };
  startDateTime: string;
  statusName: string;
}

interface ChatCardProps {
  appointments?: Appointment[];
  onRefresh?: () => void;
}

type TimeFilter = "today" | "thisWeek" | "thisMonth";

const AWS_URL = process.env.NEXT_PUBLIC_AWS_URL;
const API_URL = process.env.API_URL;

const ChatCard: React.FC<ChatCardProps> = ({
  appointments = [],
  onRefresh,
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // State for separate API data
  const [filteredApiData, setFilteredApiData] = useState<Appointment[]>([]);
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(false);

  // Get user profile data
  const profile = useSelector((state: RootState) => state.profile.data);
  const branchId = profile?.branchId;

  // Use ref for throttling to avoid dependency issues
  const lastFetchTimeRef = useRef<number>(0);
  const THROTTLE_DELAY = 2000;

  // Fetch filtered appointments from API
  const fetchFilteredAppointments = useCallback(
    async (filter: TimeFilter) => {
      if (!branchId) return;

      const now = Date.now();
      // Check throttling using ref
      if (now - lastFetchTimeRef.current < THROTTLE_DELAY) {
        console.log("API call throttled, using existing data");
        return;
      }

      setIsLoadingFiltered(true);
      lastFetchTimeRef.current = now;

      try {
        const token = localStorage.getItem("docPocAuth_token");
        if (!token) return;

        const currentTime = new Date();
        let fromDate: Date;
        let toDate: Date;

        // Set date ranges based on filter - always start from CURRENT TIME
        switch (filter) {
          case "today":
            fromDate = new Date(currentTime); // From current time (e.g., 12:14 PM)
            toDate = new Date(currentTime);
            toDate.setHours(23, 59, 59, 999); // End of today
            break;

          case "thisWeek":
            fromDate = new Date(currentTime); // From current time (e.g., 12:14 PM)
            toDate = new Date(currentTime);
            toDate.setDate(currentTime.getDate() + (6 - currentTime.getDay())); // End of this week
            toDate.setHours(23, 59, 59, 999);
            break;

          case "thisMonth":
            fromDate = new Date(currentTime); // From current time (e.g., 12:14 PM)
            toDate = new Date(
              currentTime.getFullYear(),
              currentTime.getMonth() + 1,
              0,
            ); // End of this month
            toDate.setHours(23, 59, 59, 999);
            break;

          default:
            fromDate = new Date(currentTime);
            toDate = new Date(currentTime.getFullYear(), 11, 31); // End of year
            toDate.setHours(23, 59, 59, 999);
        }

        console.log(`Filter: ${filter}`);
        console.log(`Current time: ${currentTime.toISOString()}`);
        console.log(`From: ${fromDate.toISOString()}`);
        console.log(`To: ${toDate.toISOString()}`);

        const response = await axios.get(
          `${API_URL}/appointment/list/${branchId}`,
          {
            params: {
              page: 1,
              pageSize: 1000,
              from: fromDate.toISOString(),
              to: toDate.toISOString(),
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        setFilteredApiData(response.data.rows || []);
      } catch (error) {
        console.error("Error fetching filtered appointments:", error);
        // Fallback to existing appointments if API fails
        setFilteredApiData([]);
      } finally {
        setIsLoadingFiltered(false);
      }
    },
    [branchId],
  ); // Removed lastFetchTime from dependencies

  // Trigger API call when filter changes or branchId changes
  useEffect(() => {
    if (branchId) {
      fetchFilteredAppointments(timeFilter);
    }
  }, [timeFilter, branchId, fetchFilteredAppointments]);

  // Use API data if available, otherwise use existing filtered logic
  const displayAppointments =
    filteredApiData.length > 0 ? filteredApiData : appointments;

  // Additional client-side filtering to ensure no past appointments show
  const filteredAppointments = useMemo(() => {
    const now = new Date();
    return displayAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.startDateTime);
      return appointmentDate > now; // Only future appointments
    });
  }, [displayAppointments]);

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    onOpen();
  };

  // Transform API data to chat format
  const transformAppointmentsToChats = (): Chat[] => {
    if (!filteredAppointments.length || filteredAppointments.length === 0) {
      // Better no appointments message based on filter
      const noAppointmentMessage = () => {
        switch (timeFilter) {
          case "today":
            return "No appointments today";
          case "thisWeek":
            return "No appointments this week";
          case "thisMonth":
            return "No appointments this month";
          default:
            return "No upcoming appointments";
        }
      };

      return [
        {
          active: null,
          avatar: `${AWS_URL}/docpoc-images/user-male.jpg`, // Fallback to default user image
          name: noAppointmentMessage(),
          text: "Schedule new appointments to see them here",
          time: "",
          textCount: 0,
          dot: 0,
        },
      ];
    }

    return filteredAppointments.map((appointment) => {
      const patientName = appointment.patient?.name || "Unknown Patient";
      const visitType = appointment.visitType?.name || "Appointment";
      const appointmentName = appointment.name || "No details provided";

      // Determine status color
      let active: boolean | null = null;
      if (appointment.statusName === "Visiting") active = true;
      if (appointment.statusName === "Cancelled") active = false;

      // Format time
      // const date = new Date(appointment.startDateTime);
      // const now = new Date();
      // const timeDiff = now.getTime() - date.getTime();
      // const hoursDiff = timeDiff / (1000 * 60 * 60);

      // let timeDisplay: string;
      // if (hoursDiff < 24) {
      //   timeDisplay = date.toLocaleTimeString([], {
      //     hour: "2-digit",
      //     minute: "2-digit",
      //   });
      // } else {
      //   timeDisplay = date.toLocaleDateString([], { weekday: "short" });
      // }

      let timeDisplay = "";
      try {
        if (appointment.startDateTime) {
          const date = new Date(appointment.startDateTime);
          const now = new Date();
          const timeDiff = now.getTime() - date.getTime();
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          if (hoursDiff < 24) {
            timeDisplay = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          } else {
            timeDisplay = date.toLocaleDateString([], { weekday: "short" });
          }
        }
      } catch (e) {
        console.error("Error formatting date:", e);
      }

      const placeholderImage =
        appointment.patient?.gender.toLowerCase() === "male"
          ? `${AWS_URL}/docpoc-images/user-male.jpg`
          : `${AWS_URL}/docpoc-images/user-female.jpg`;
      const avatarSrc = appointment.patient?.displayPicture || placeholderImage;

      return {
        active,
        avatar: avatarSrc,
        name: patientName,
        text: `${visitType}: ${appointmentName}`,
        time: timeDisplay,
        textCount: 0,
        dot: 3,
        appointmentData: appointment, // Store original appointment data
      };
    });
  };

  const getFilterLabel = () => {
    switch (timeFilter) {
      case "today":
        return "Today";
      case "thisWeek":
        return "This Week";
      case "thisMonth":
        return "This Month";
      default:
        return "Today";
    }
  };

  const chatData = transformAppointmentsToChats();
  const hasScroll = chatData.length > 5;
  return (
    <div className="col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4">
      <div className="mb-5.5 px-7.5">
        <h4 className="text-body-2xlg font-bold text-dark dark:text-white mb-3">
          Upcoming Appointments
        </h4>
        <div className="flex justify-end items-center gap-2">
          {isLoadingFiltered && <Spinner size="sm" className="text-gray-500" />}
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                size="sm"
                endContent={<ChevronDownIcon className="text-small" />}
                className="text-xs min-w-unit-20 h-8 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-0"
                disabled={isLoadingFiltered}
              >
                {getFilterLabel()}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Time filter"
              onAction={(key) => {
                setTimeFilter(key as TimeFilter);
              }}
              selectedKeys={[timeFilter]}
              selectionMode="single"
            >
              <DropdownItem key="today" onClick={(e) => e.stopPropagation()}>
                Today
              </DropdownItem>
              <DropdownItem key="thisWeek" onClick={(e) => e.stopPropagation()}>
                This Week
              </DropdownItem>
              <DropdownItem
                key="thisMonth"
                onClick={(e) => e.stopPropagation()}
              >
                This Month
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div
        style={{
          maxHeight: 450,
          overflowY: hasScroll ? "auto" : "visible",
          paddingRight: hasScroll ? "4px" : "0",
        }}
      >
        {chatData.map((chat, key) => (
          <div
            className={`flex items-center gap-4.5 px-7.5 py-3 ${
              chat.appointmentData
                ? "hover:bg-gray-1 dark:hover:bg-dark-2 cursor-pointer"
                : "cursor-default"
            }`}
            key={key}
            onClick={() => {
              if (chat.appointmentData) {
                handleAppointmentClick(chat.appointmentData);
              }
            }}
          >
            {/* Avatar Image with Status Indicator */}
            <div className="relative h-14 w-14 rounded-full min-w-[56px]">
              <Image
                width={56}
                height={56}
                src={chat.avatar}
                alt={chat.name}
                className="h-full w-full object-cover rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `${AWS_URL}/docpoc-images/user-male.jpg`;
                }}
              />
              {chat.active !== null && (
                <span
                  className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-dark-2 ${
                    chat.active === true
                      ? "bg-green"
                      : chat.active === false
                        ? "bg-red-light"
                        : "bg-orange-light"
                  }`}
                ></span>
              )}
            </div>

            <div className="flex flex-1 items-center justify-between overflow-hidden">
              <div className="min-w-0 flex-1">
                <h5 className="font-medium text-dark dark:text-white truncate max-w-[120px]">
                  {chat.name}
                </h5>
                <p className="truncate max-w-[180px]">
                  <span
                    className={`mb-px text-body-sm font-medium ${chat.seen ? "dark:text-dark-3" : "text-dark-3 dark:text-dark-6"}`}
                  >
                    {chat.text}
                  </span>
                  {chat.time && (
                    <span className="text-xs whitespace-nowrap">
                      {" "}
                      . {chat.time}
                    </span>
                  )}
                </p>
              </div>
              {chat.textCount !== 0 && (
                <div className="flex items-center justify-center rounded-full bg-primary px-2 py-0.5">
                  <span className="text-sm font-medium text-white">
                    {chat.textCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentListModal
          isOpen={isOpen}
          onClose={onClose}
          startTime={selectedAppointment.startDateTime}
          endTime={selectedAppointment.startDateTime} // Using same time as it's a single appointment
          onRefresh={() => {
            onRefresh?.();
            // Also refresh our filtered data - reset throttle to allow immediate refresh
            lastFetchTimeRef.current = 0;
            fetchFilteredAppointments(timeFilter);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default ChatCard;
