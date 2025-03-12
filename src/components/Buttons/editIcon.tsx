import React from "react";

export const EditIcon = ({
  fill = "currentColor",
  size = 24,
  height = 24,
  width = 24,
  ...props
}) => {
  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 21v-3.75L15.04 5.21a1.5 1.5 0 012.12 0l1.63 1.63a1.5 1.5 0 010 2.12L6.75 21H3zm15.04-16.04a.5.5 0 00-.71 0L4 18.29V20h1.71L19 6.71a.5.5 0 000-.71l-1.63-1.63a.5.5 0 00-.33-.13.5.5 0 00-.04.01z"
        fill="#FF8C00" // Deep Orange Color
      />
      <path
        d="M15.04 5.21L3 18.25V21h2.75l12.04-12.04a1.5 1.5 0 000-2.12l-1.63-1.63a1.5 1.5 0 00-2.12 0z"
        fill="#FF8C00" // Deep Orange Color
      />
      <path
        d="M18 4l2 2"
        stroke="#FF8C00" // Deep Orange Color
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 19h14v2H5v-2z"
        fill="#FF8C00" // Deep Orange Color
      />
    </svg>
  );
};
