import React from "react";
import {ScrollShadow} from "@nextui-org/react";
import { Content } from "../CommingSoon/content";

export default function ShadowScrollDefault(props:{content: any, height?: string | number, width?: string | number}) {
  return (
    <ScrollShadow className="w-[100%] h-[200px]">
      <Content content={props.content}/>
    </ScrollShadow>
  );
}
