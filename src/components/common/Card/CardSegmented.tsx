import React from "react";
import { Link, Image } from "@nextui-org/react";

export default function CardSegmented(props: {
  data: {
    img?: {
      url: string;
      height?: string | number;
      width?: string | number;
      paddingTop?: string | number;
    };
    headrTitle?: string;
    headrSubTitle?: string;
    bodyContent: any;
    footerUrl?: string;
    footerUrlText?: string;
  };
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 2xl:gap-7.5 md:grid-cols-1">
      {(props.data.headrSubTitle ||
        props.data.headrTitle ||
        props.data.img) && (
        <div className="flex gap-3">
          <div>
            {props.data.img && (
              <Image
                alt="section logo"
                radius="sm"
                src={props.data.img.url}
                style={{
                  height: props.data.img?.height || 200,
                  width: props.data.img?.width || 200,
                  paddingTop: props.data.img?.paddingTop || 0,
                }}
              />
            )}
          </div>
          <div className="flex flex-col">
            {props.data.headrTitle && (
              <p className="text-md">{props.data.headrTitle}</p>
            )}
            {props.data.headrSubTitle && (
              <p className="text-small text-default-500">
                {props.data.headrSubTitle}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-col">{props.data.bodyContent}</div>
      {props.data.footerUrl && (
        <div className="flex flex-col">
          <Link isExternal showAnchorIcon href={props.data.footerUrl}>
            {props.data.footerUrlText}
          </Link>
        </div>
      )}
    </div>
  );
}
