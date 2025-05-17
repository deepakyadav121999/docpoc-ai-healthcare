"use client";
import React from "react";

// import General from "./General";
import Clinic from "../Clinic/Clinic";

export default function App() {
  // const tabKeys = {
  //   General: {
  //     name: "General",
  //     screen: (
  //       <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
  //         {" "}
  //         <div className="flex flex-col w-full">
  //           {" "}
  //           <General />{" "}
  //         </div>
  //       </div>
  //     ),
  //   },
  //   Usages: {
  //     name: "Usages",
  //     screen: (
  //       <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
  //         {" "}
  //         <div className="flex flex-col w-full">
  //           {" "}
  //           <UsagesHeader />
  //         </div>
  //         <div className="flex flex-col w-full" style={{marginTop: 20}}>
  //           {" "}
  //           <Usages />
  //         </div>
  //       </div>
  //     ),
  //   },
  //   Website: {
  //     name: "Go Premium",
  //     screen: (
  //       <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
  //         {" "}
  //         <div className="flex flex-col w-full">
  //           {" "}
  //           <UsagesHeader />
  //         </div>
  //       </div>
  //     ),
  //   },
  // };

  return (
    <>
      <Clinic />
    </>
  );
}
