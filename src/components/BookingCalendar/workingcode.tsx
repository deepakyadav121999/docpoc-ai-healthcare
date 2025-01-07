 // const renderDayView = () => {
  //   const dayCells = [];
  //   const currentTime = new Date();

  //   for (let hour = 8; hour < 21; hour++) {
  //     for (let minute = 0; minute < 60; minute += 30) {
  //       // const time = new Date(selectedDate);
  //       // time.setHours(hour, minute);

  //       const timeSlotStart = new Date(selectedDate);
  //       timeSlotStart.setHours(hour, minute, 0, 0);
  //       const timeSlotEnd = new Date(timeSlotStart);
  //       timeSlotEnd.setMinutes(timeSlotStart.getMinutes() + 30);
  //       const isCurrentTime =
  //         timeSlotStart <= currentTime &&
  //         timeSlotEnd > currentTime &&
  //         timeSlotStart.toDateString() === currentTime.toDateString();
  //       const hasBooking = appointments.some(
  //         (appt) =>
  //           timeSlotStart >= new Date(appt.startDateTime) &&
  //           timeSlotStart < new Date(appt.endDateTime)
  //       );
  //       const booking = appointments.find(
  //         (appt) =>
  //           timeSlotStart >= new Date(appt.startDateTime) &&
  //           timeSlotStart < new Date(appt.endDateTime)
  //       );
  //       const overlappingAppointments = appointments.filter(
  //         (appt) =>
  //           new Date(appt.startDateTime) < timeSlotEnd &&
  //           new Date(appt.endDateTime) > timeSlotStart
  //       );


  //       const slotDuration = timeSlotEnd.getTime() - timeSlotStart.getTime();
  //       let borderPercentage = 0;
  //       overlappingAppointments.forEach((appt) => {
  //         const apptStart = new Date(appt.startDateTime).getTime();
  //         const apptEnd = new Date(appt.endDateTime).getTime();
  
  //         const overlapStart = Math.max(apptStart, timeSlotStart.getTime());
  //         const overlapEnd = Math.min(apptEnd, timeSlotEnd.getTime());
  //         const overlapDuration = overlapEnd - overlapStart;
  
  //         if (overlapDuration > 0) {
  //           borderPercentage += (overlapDuration / slotDuration) * 100;
  //         }
  //       });
  
  //       // Cap border percentage at 100%
  //       borderPercentage = Math.min(borderPercentage, 100);
  
  //       const gradientBorder = `linear-gradient(to right, var(--secondary-color) ${borderPercentage}%, transparent ${borderPercentage}%)`;
  //  let displayTime = "";
  //     if (booking) {
  //       const bookingStart = new Date(booking.startDateTime);
  //       const bookingEnd = new Date(booking.endDateTime);

  //       if (timeSlotStart <= bookingStart && timeSlotEnd >= bookingEnd) {
  //         // The appointment fully overlaps the slot
  //         displayTime = `${bookingStart.toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         })} - ${bookingEnd.toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         })}`;
  //       } else if (timeSlotStart <= bookingStart) {
  //         // The appointment starts during this slot
  //         displayTime = `${bookingStart.toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         })} - ${timeSlotEnd.toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         })}`;
  //       } else if (timeSlotEnd >= bookingEnd) {
  //         // The appointment ends during this slot
  //         displayTime = `${timeSlotStart.toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         })} - ${bookingEnd.toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         })}`;
  //       }
  //     }
        
  //       dayCells.push(
  //         <div
  //           key={`${hour}-${minute}`}
  //           className={`time-slot ${isCurrentTime ? "current-time" : ""} ${hasBooking ? "has-booking" : ""} flex justify-between p-1 gap-1`}
  //           style={{
  //             borderBottom: borderPercentage > 0 ? "3px solid transparent" : "none",
  //             borderImageSource: borderPercentage > 0 ? gradientBorder : "none",
  //             borderImageSlice: "0 0 1 0",
  //           }}

  //           onClick={() =>
  //             !hasBooking && openModal(selectedDate.getTime(), false, timeSlotStart, timeSlotEnd)
  //           }
  //         >
  //           <div className="flex w-2/4 items-center text-center justify-end ">
  //             <p> {timeSlotStart.toLocaleTimeString([], {
  //               hour: "2-digit",
  //               minute: "2-digit",
  //             })}</p>

  //           </div>

  //           {/* ${timeSlotStart.toLocaleTimeString([], {
  //               hour: "2-digit",
  //               minute: "2-digit",
  //             })} */}
  //           <div className="flex w-2/4 justify-center items-center gap-1">
  //             {/* <p className=" ">
  //                {booking ? `
  //                - ${timeSlotEnd.toLocaleTimeString([], {
  //               hour: "2-digit",
  //               minute: "2-digit",
  //             })}
  //               ` : ""}
  //               </p> */}
  //               {booking && (
  //             <p className="text-sm">{displayTime}</p>)
  //               }
  //                <p className="text-sm">{ booking && booking.title}</p> 
          
             

  //           </div>

  //         </div>
  //       );
  //     }
  //   }

  //   return <div className="day-view">{dayCells}</div>;
  // };

  // working 02
// const renderDayView = () => {
//   const dayCells = [];
//   const currentTime = new Date();

//   for (let hour = 8; hour < 21; hour++) {
//     for (let minute = 0; minute < 60; minute += 30) {
//       const timeSlotStart = new Date(selectedDate);
//       timeSlotStart.setHours(hour, minute, 0, 0);
//       const timeSlotEnd = new Date(timeSlotStart);
//       timeSlotEnd.setMinutes(timeSlotStart.getMinutes() + 30);

//       const isCurrentTime =
//         timeSlotStart <= currentTime &&
//         timeSlotEnd > currentTime &&
//         timeSlotStart.toDateString() === currentTime.toDateString();

//       const hasBooking = appointments.some(
//         (appt) =>
//           timeSlotStart >= new Date(appt.startDateTime) &&
//           timeSlotStart < new Date(appt.endDateTime)
//       );

//       const booking = appointments.find(
//         (appt) =>
//           timeSlotStart >= new Date(appt.startDateTime) &&
//           timeSlotStart < new Date(appt.endDateTime)
//       );

//       const overlappingAppointments = appointments.filter(
//         (appt) =>
//           new Date(appt.startDateTime) < timeSlotEnd &&
//           new Date(appt.endDateTime) > timeSlotStart
//       );

//       const slotDuration = timeSlotEnd.getTime() - timeSlotStart.getTime();
//       let gradientStartPercentage = 0;
//       let gradientEndPercentage = 0;

//       overlappingAppointments.forEach((appt) => {
//         const apptStart = new Date(appt.startDateTime).getTime();
//         const apptEnd = new Date(appt.endDateTime).getTime();

//         const overlapStart = Math.max(apptStart, timeSlotStart.getTime());
//         const overlapEnd = Math.min(apptEnd, timeSlotEnd.getTime());
//         const overlapDuration = overlapEnd - overlapStart;

//         if (overlapDuration > 0) {
//           const startOffset =
//             ((overlapStart - timeSlotStart.getTime()) / slotDuration) * 100;
//           const endOffset =
//             ((overlapEnd - timeSlotStart.getTime()) / slotDuration) * 100;

//           gradientStartPercentage = Math.min(
//             gradientStartPercentage || startOffset,
//             startOffset
//           );
//           gradientEndPercentage = Math.max(
//             gradientEndPercentage || endOffset,
//             endOffset
//           );
//         }
//       });

//       const gradientBorder = `linear-gradient(to right, transparent ${gradientStartPercentage}%, var(--secondary-color) ${gradientStartPercentage}%, var(--secondary-color) ${gradientEndPercentage}%, transparent ${gradientEndPercentage}%)`;

//       let displayTime = "";
//       if (booking) {
//         const bookingStart = new Date(booking.startDateTime);
//         const bookingEnd = new Date(booking.endDateTime);

//         if (timeSlotStart <= bookingStart && timeSlotEnd >= bookingEnd) {
//           displayTime = `${bookingStart.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })} - ${bookingEnd.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}`;
//         } else if (timeSlotStart <= bookingStart) {
//           displayTime = `${bookingStart.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })} - ${timeSlotEnd.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}`;
//         } else if (timeSlotEnd >= bookingEnd) {
//           displayTime = `${timeSlotStart.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })} - ${bookingEnd.toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}`;
//         }
//       }

//       dayCells.push(
//         <div
//           key={`${hour}-${minute}`}
//           className={`time-slot ${isCurrentTime ? "current-time" : ""} ${
//             hasBooking ? "has-booking" : ""
//           } flex justify-between p-1 gap-1`}
//           style={{
//             borderBottom: gradientStartPercentage < gradientEndPercentage ? "3px solid transparent" : "none",
//             borderImageSource:
//               gradientStartPercentage < gradientEndPercentage
//                 ? gradientBorder
//                 : "none",
//             borderImageSlice: "0 0 1 0",
//           }}
//           onClick={() =>
//             !hasBooking &&
//             openModal(selectedDate.getTime(), false, timeSlotStart, timeSlotEnd)
//           }
//         >
//           <div className="flex w-2/4 items-center text-center justify-end ">
//             <p>
//               {timeSlotStart.toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </p>
//           </div>

//           <div className="flex w-2/4 justify-center items-center gap-1">
//             {booking && <p className="text-sm">{displayTime}</p>}
//             <p className="text-sm">{booking && booking.title}</p>
//           </div>
//         </div>
//       );
//     }
//   }

//   return <div className="day-view">{dayCells}</div>;
// };