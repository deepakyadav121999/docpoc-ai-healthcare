import Link from "next/link";
import Image from "next/image";
import { Chat } from "@/types/chat";

const chatData: Chat[] = [
  {
    active: true,
    avatar: "/images/user/user-01.png",
    name: "Jag Singh",
    text: "Surgery: molar cavity filling",
    time: "42 min",
    textCount: 3,
    dot: 3,
  },
  {
    active: true,
    avatar: "/images/user/user-02.png",
    name: "Bukun Sarkar",
    text: "Regular checkup: dental flossing and cleaning",
    time: "10:54 AM",
    textCount: 0,
    dot: 1,
  },
  {
    active: null,
    avatar: "/images/user/user-04.png",
    name: "Aman Jha",
    text: "Consult: Feeling pain in lower back after accident",
    time: "11:30 AM",
    textCount: 0,
    dot: 3,
  },
  {
    active: true,
    avatar: "/images/user/user-01.png",
    name: "Jag Singh",
    text: "Surgery: molar cavity filling",
    time: "2:00 PM",
    textCount: 3,
    dot: 3,
  },
  {
    active: true,
    seen: true,
    avatar: "/images/user/user-05.png",
    name: "Henry Deco",
    text: "Surgery: Stiches removal post surgery",
    time: "Thu",
    textCount: 2,
    dot: 6,
  },
  {
    active: false,
    avatar: "/images/user/user-06.png",
    name: "Jubin Jack",
    text: "Full Checkup: routine body checkup",
    time: "Thu",
    textCount: 0,
    dot: 3,
  },
];

const ChatCard = () => {
  return (
    <div className="col-span-12 rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-4">
      <h4 className="mb-5.5 px-7.5 text-body-2xlg font-bold text-dark dark:text-white">
        Upcoming Appointments
      </h4>

      <div style={{overflowY:"scroll", maxHeight:450}}>
        {chatData.map((chat, key) => (
          <Link
            href="/"
            className="flex items-center gap-4.5 px-7.5 py-3 hover:bg-gray-1 dark:hover:bg-dark-2"
            key={key}
          >
            {/* <div className="relative h-14 w-14 rounded-full">
              <Image
                width={56}
                height={56}
                src={chat.avatar}
                alt="User"
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
              <span
                className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-dark-2 ${
                  chat.active === true
                    ? "bg-green"
                    : chat.active === false
                      ? `bg-red-light`
                      : "bg-orange-light"
                }`}
              ></span>
            </div> */}

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-dark dark:text-white">
                  {chat.name}
                </h5>
                <p>
                  <span
                    className={`mb-px text-body-sm font-medium ${chat.seen ? "dark:text-dark-3" : "text-dark-3 dark:text-dark-6"}`}
                  >
                    {chat.text}
                  </span>
                  <span className="text-xs"> . {chat.time}</span>
                </p>
              </div>
              {chat.textCount !== 0 && (
                <div className="flex items-center justify-center rounded-full bg-primary px-2 py-0.5">
                  <span className="text-sm font-medium text-white">
                    {" "}
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
