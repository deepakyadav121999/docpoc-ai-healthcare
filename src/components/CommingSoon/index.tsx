import React from "react";
import { ScrollShadow } from "@nextui-org/react";
import { Content } from "./content";
import CountDown from "./countDown";
// import ConfettiExplosion from "react-confetti-explosion";

export default function CommingSoonPage(props: { content: string }) {
  return (
    <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
      <div
        className="flex flex-col justify-center items-center w-full"
        style={{ marginBottom: 20, marginTop: -10 }}
      >
        <CountDown />
      </div>
      <ScrollShadow hideScrollBar className="w-[700px] h-[700px]">
        <Content content={props.content} />
      </ScrollShadow>
    </div>
  );
}
