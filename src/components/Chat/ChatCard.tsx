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

import Link from "next/link";
import Image from "next/image";
import { Chat } from "@/types/chat";

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
}

const AWS_URL = process.env.NEXT_PUBLIC_AWS_URL;

const ChatCard: React.FC<ChatCardProps> = ({ appointments = [] }) => {
  // Transform API data to chat format
  const transformAppointmentsToChats = (): Chat[] => {
    if (!appointments.length || appointments.length === 0) {
      return [
        {
          active: null,
          avatar: "",
          name: "No upcoming appointments",
          text: "",
          time: "",
          textCount: 0,
          dot: 0,
        },
      ];
    }

    return appointments.map((appointment) => {
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
      };
    });
  };

  const chatData = transformAppointmentsToChats();
  const hasScroll = chatData.length > 5;
  return (
    <div className="col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4">
      <h4 className="mb-5.5 px-7.5 text-body-2xlg font-bold text-dark dark:text-white">
        Upcoming Appointments
      </h4>

      <div
        style={{
          maxHeight: 450,
          overflowY: hasScroll ? "auto" : "visible",
          paddingRight: hasScroll ? "4px" : "0",
        }}
      >
        {chatData.map((chat, key) => (
          <Link
            href="/"
            className="flex items-center gap-4.5 px-7.5 py-3 hover:bg-gray-1 dark:hover:bg-dark-2"
            key={key}
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

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-dark dark:text-white truncate">
                  {chat.name}
                </h5>
                <p className="truncate">
                  <span
                    className={`mb-px text-body-sm font-medium ${chat.seen ? "dark:text-dark-3" : "text-dark-3 dark:text-dark-6"}`}
                  >
                    {chat.text}
                  </span>
                  {chat.time && (
                    <span className="text-xs  whitespace-nowrap">
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
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
