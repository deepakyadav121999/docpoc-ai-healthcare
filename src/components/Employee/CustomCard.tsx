import React from 'react'
import {Spacer, Card} from "@nextui-org/react";

const CustomCard = () => {
  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
    <div className="h-24 rounded-lg bg-default-300" />
    <div className="mt-6 space-y-3">
      <div className="h-3 w-3/5 rounded-lg bg-default-200" />
      <div className="h-3 w-4/5 rounded-lg bg-default-200" />
      {/* <div className="h-3 w-2/5 rounded-lg bg-default-300" /> */}
    </div>
  </div>
  )
}

export default CustomCard