import React from "react";
import {Card, CardFooter, Image, Button} from "@nextui-org/react";

export default function CardBlurred(props:{label:string, img:{url:string, height?:string | number, width?:string | number, paddingTop?: string | number}}) {
  return (
    <Card
      isFooterBlurred
      radius="lg"
      className="border-none"
    >
      <div style={{height: (props.img?.height || 200), width:(props.img?.width || 200), paddingTop: (props.img?.paddingTop || 0)}}>
      <Image
        alt="Woman listing to music"
        className="object-cover"
        src={props.img.url}
      />
      </div>
      <CardFooter style={{minHeight: 80}}className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
        <p className="">{props.label}</p>
        <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
          Buy Credit
        </Button>
      </CardFooter>
    </Card>
  );
}
