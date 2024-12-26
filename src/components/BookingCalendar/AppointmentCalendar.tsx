"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddAppointment from "../CalenderBox/AddAppointment";
import OpaqueDefaultModal from "../common/Modal/OpaqueDefaultModal";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

const API_URL = process.env.API_URL;
export const AppointmentCalendar: React.FC = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [loading, setLoading] = useState(false)
  const [totalAppointments, setTotalAppointments] = useState(0)
  const [appointmentsByDate, setAppointmentsByDate] = useState<{ [key: string]: number }>({});
  
  const [appointments, setAppointments] = useState<
    Array<{ date: Date; title: string; description?: string; startDateTime: Date; endDateTime: Date; }>
  >([
  ]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [resulst, setResults] = useState([])
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
    
      const hospitalEndpoint = `${API_URL}/hospital`;
      const hospitalResponse = await axios.get(hospitalEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!hospitalResponse.data || hospitalResponse.data.length === 0) {
        return;
      }

      const fetchedHospitalId = hospitalResponse.data[0].id;
      const branchEndpoint = `${API_URL}/hospital/branches/${fetchedHospitalId}`;
      const branchResponse = await axios.get(branchEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!branchResponse.data || branchResponse.data.length === 0) {
        return;
      }

      const fetchedBranchId = branchResponse.data[0]?.id;

      const endpoint = `${API_URL}/appointment/list/${fetchedBranchId}`;

      const params: any = {
        page,
        pageSize: rowsPerPage,
        from: "2024-12-01T00:00:00.000Z", // Start of the month
        to: "2024-12-31T23:59:59.999Z", // End of the month
      };

      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });


      const grouped: { [key: string]: number } = {};
      const appointmentList = response.data.rows.map((appointment: any) => {

        const startDateTime = (appointment.startDateTime);
        const endDateTime = (appointment.endDateTime);
        console.log(startDateTime);



        const date = startDateTime.split("T")[0]; // Extract UTC date
        grouped[date] = (grouped[date] || 0) + 1;
        console.log(date)
        return {
          startDateTime,
          endDateTime,
          title: appointment.name || "Appointment",
        };
      });

      setAppointmentsByDate(grouped);
      setAppointments(appointmentList);
      setTotalAppointments(response.data.count || response.data.rows.length);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments()
  }, [])
   useEffect(() => {
      const header = document.querySelector("header");
      if (header) {
        // Only modify z-index when modal is open
        if (isOpen) {
          header.classList.remove("z-999");
          header.classList.add("z-0");
        } else {
          header.classList.remove("z-0");
          header.classList.add("z-999");
        }
      }
    }, [isOpen]);

  //  if(loading===false){
  //   console.log(totalAppointments)
  //  } 
  // console.log(appointments);
  // let abc = resulst && resulst.map((item: any) => { return (item.startDateTime) })
  // console.log(abc)
  // console.log(resulst)

  const router = useRouter();
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">(
    "month"
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    date: Date;
    startTime: string; // Store the clicked start time
    endTime: string; 
    hasBooking: boolean;
  }>({ date: new Date(), startTime: "", endTime: "", hasBooking: false });

  useEffect(() => {
    renderCalendar();
  }, [currentView, selectedDate]);

  const changeView = (view: "month" | "week" | "day") => {
    setCurrentView(view);
  };

  const changeMonth = (direction: "next" | "previous") => {
    const newDate = new Date(selectedDate);
    if (direction === "next") {
      newDate.setMonth(selectedDate.getMonth() + 1);
    } else {
      newDate.setMonth(selectedDate.getMonth() - 1);
    }
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    switch (currentView) {
      case "month":
        return renderMonthView();
      case "week":
        return renderWeekView();
      case "day":
        return renderDayView();
    }
  };


  const renderMonthView = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(Date.UTC(year, month, 1));
    const lastDay = new Date(Date.UTC(year, month + 1, 0));
    const daysInMonth = lastDay.getUTCDate();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayHeaders = days.map((day) => (
      <div key={day} className="calendar-cell-disabled">
        {day}
      </div>
    ));

    const emptyCells = [];
    for (let i = 0; i < firstDay.getDay(); i++) {
      emptyCells.push(<div key={`empty-${i}`} className="calendar-cell"></div>);
    }

    const daysCells = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(Date.UTC(year, month, i));
      const dateKey = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const isToday =
        new Date().toISOString().split("T")[0] === dateKey; // Compare in UTC
      const hasBooking = appointmentsByDate[dateKey] > 0;

      daysCells.push(
        <>
          <div
            key={i}
            className={`calendar-cell ${isToday ? "today" : ""} ${hasBooking ? "has-booking" : ""}`}
            onClick={() => selectDate(year, month, i)}
          >
            <div className="h-2/3 flex justify-center items-center" ><p>{i}</p></div>
            {appointmentsByDate[dateKey] && (
              <div className="flex justify-end items-end text-sm   h-1/3 ">
                <p>{`${appointmentsByDate[dateKey]} appo...`}</p>
              </div>
            )}
          </div>

        </>
      );
    }

    return (
      <div className="calendar-grid">
        {dayHeaders}
        {emptyCells}
        {daysCells}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(Date.UTC(
      selectedDate.getUTCFullYear(),
      selectedDate.getUTCMonth(),
      selectedDate.getUTCDate() - selectedDate.getUTCDay()
    ))

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayHeaders = days.map((day) => (
      <div key={day} className="calendar-cell-disabled" >
        {day}
      </div>
    ));

    const weekCells = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateKey = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const isToday = new Date().toISOString().split("T")[0] === dateKey; // Compare in UTC
      const hasBooking = appointmentsByDate[dateKey] > 0;

      weekCells.push(
        <div
          key={i}
          className={`calendar-cell ${isToday ? "today" : ""} ${hasBooking ? "has-booking" : ""}`}
          onClick={() => {
            setSelectedDate(new Date(date));
            changeView("day");
          }}
        >
          <div className="h-2/3 flex justify-center items-center">
            <p>{date.getDate()}</p>
          </div>
          {appointmentsByDate[dateKey] && (
            <div className="flex justify-end items-end text-sm h-1/3">
              <p>{`${appointmentsByDate[dateKey]} appo...`}</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="calendar-grid">
        {dayHeaders}
        {weekCells}
      </div>
    );
  };

  const renderDayView = () => {
    const dayCells = [];
    const currentTime = new Date();

    for (let hour = 8; hour < 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // const time = new Date(selectedDate);
        // time.setHours(hour, minute);

        const timeSlotStart = new Date(selectedDate);
        timeSlotStart.setHours(hour, minute, 0, 0);
        const timeSlotEnd = new Date(timeSlotStart);
        timeSlotEnd.setMinutes(timeSlotStart.getMinutes() + 30);
        const isCurrentTime =
          timeSlotStart <= currentTime &&
          timeSlotEnd > currentTime &&
          timeSlotStart.toDateString() === currentTime.toDateString();
        const hasBooking = appointments.some(
          (appt) =>
            timeSlotStart >= new Date(appt.startDateTime) &&
            timeSlotStart < new Date(appt.endDateTime)
        );
        const booking = appointments.find(
          (appt) =>
            timeSlotStart >= new Date(appt.startDateTime) &&
            timeSlotStart < new Date(appt.endDateTime)
        );
        const overlappingAppointments = appointments.filter(
          (appt) =>
            new Date(appt.startDateTime) < timeSlotEnd &&
            new Date(appt.endDateTime) > timeSlotStart
        );


        const slotDuration = timeSlotEnd.getTime() - timeSlotStart.getTime();
        let borderPercentage = 0;
        overlappingAppointments.forEach((appt) => {
          const apptStart = new Date(appt.startDateTime).getTime();
          const apptEnd = new Date(appt.endDateTime).getTime();
  
          const overlapStart = Math.max(apptStart, timeSlotStart.getTime());
          const overlapEnd = Math.min(apptEnd, timeSlotEnd.getTime());
          const overlapDuration = overlapEnd - overlapStart;
  
          if (overlapDuration > 0) {
            borderPercentage += (overlapDuration / slotDuration) * 100;
          }
        });
  
        // Cap border percentage at 100%
        borderPercentage = Math.min(borderPercentage, 100);
  
        const gradientBorder = `linear-gradient(to right, var(--secondary-color) ${borderPercentage}%, transparent ${borderPercentage}%)`;
   let displayTime = "";
      if (booking) {
        const bookingStart = new Date(booking.startDateTime);
        const bookingEnd = new Date(booking.endDateTime);

        if (timeSlotStart <= bookingStart && timeSlotEnd >= bookingEnd) {
          // The appointment fully overlaps the slot
          displayTime = `${bookingStart.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${bookingEnd.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        } else if (timeSlotStart <= bookingStart) {
          // The appointment starts during this slot
          displayTime = `${bookingStart.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${timeSlotEnd.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        } else if (timeSlotEnd >= bookingEnd) {
          // The appointment ends during this slot
          displayTime = `${timeSlotStart.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${bookingEnd.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        }
      }
        
        dayCells.push(
          <div
            key={`${hour}-${minute}`}
            className={`time-slot ${isCurrentTime ? "current-time" : ""} ${hasBooking ? "has-booking" : ""} flex justify-between p-1 gap-1`}
            style={{
              borderBottom: borderPercentage > 0 ? "3px solid transparent" : "none",
              borderImageSource: borderPercentage > 0 ? gradientBorder : "none",
              borderImageSlice: "0 0 1 0",
            }}

            onClick={() =>
              !hasBooking && openModal(selectedDate.getTime(), false, timeSlotStart, timeSlotEnd)
            }
          >
            <div className="flex w-2/4 items-center text-center justify-end ">
              <p> {timeSlotStart.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}</p>

            </div>

            {/* ${timeSlotStart.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} */}
            <div className="flex w-2/4 justify-center items-center gap-1">
              {/* <p className=" ">
                 {booking ? `
                 - ${timeSlotEnd.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
                ` : ""}
                </p> */}
                {booking && (
              <p className="text-sm">{displayTime}</p>)
                }
                 <p className="text-sm">{ booking && booking.title}</p> 
          
             

            </div>

          </div>
        );
      }
    }

    return <div className="day-view">{dayCells}</div>;
  };

  const selectDate = (year: number, month: number, day: number) => {
    setSelectedDate(new Date(year, month, day));
    changeView("day");
  };

  const openModal = (timestamp: number, hasBooking: boolean, startTime: Date, endTime: Date) => {
    if (!hasBooking) {
      setModalVisible(true);
      setModalData({
        date: new Date(timestamp),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        hasBooking,
      });
      onOpen()
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (
      form.elements.namedItem("appointmentTitle") as HTMLInputElement
    ).value;
    const dateTime = new Date(
      (form.elements.namedItem("appointmentDateTime") as HTMLInputElement).value
    );
    const description = (
      form.elements.namedItem("appointmentDescription") as HTMLTextAreaElement
    ).value;
    // setAppointments([...appointments, { date: dateTime, title, description }]);
    setModalVisible(false);
    renderCalendar();
  };


  const getMonthYearString = () => {
    const options = { year: "numeric", month: "long" } as const;
    return selectedDate.toLocaleDateString(undefined, options);
  };

  return (
    <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
      <div className="calendar-container">
        <h2>{getMonthYearString()}</h2>
        <div className="calendar-header">
          <div className="view-selector">
            <button
              className={`view-button ${currentView === "month" ? "active" : ""}`}
              onClick={() => changeView("month")}
            >
              Month
            </button>
            <button
              className={`view-button ${currentView === "week" ? "active" : ""}`}
              onClick={() => changeView("week")}
            >
              This Week
            </button>
            <button
              className={`view-button ${currentView === "day" ? "active" : ""}`}
              onClick={() => changeView("day")}
            >
              Today
            </button>
          </div>
          {currentView === "month" && (
            <div className="navigation-buttons">
              <button className="nav-button" onClick={() => changeMonth("previous")}>
                Previous
              </button>
              <button className="nav-button" onClick={() => changeMonth("next")}>
                Next
              </button>
            </div>
          )}
        </div>
        <div id="calendar-view">{renderCalendar()}</div>

        {modalVisible && (
         
             <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        style={{ maxWidth: 800, maxHeight: 600, overflowY: "scroll", marginTop: "10%" }}
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-50",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
               <p>Add New Appointment</p>
              </ModalHeader>
              <ModalBody>
               <AddAppointment onUsersAdded={fetchAppointments}/>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
            
        
        )}

        <style>{`
        :root {
          --primary-color: #015e75;
          --secondary-color: #2ecc71;
          --calendar-background-color: #ecf0f1;
          --shadow-color: #bdc3c7;
          --highlight-color: rgb(87 80 241);
          --text-color: #34495e;
          --dark-shadow: #081d29;
          --light-shadow: #ffffff;
          --calendar-cell-color-dark: #001e3b;
          --calendar-cell-color: #dfecf0;
          --dark-background: #001429;
        }
        
        .dark {
          --calendar-background-color: var(--dark-background);
          --calendar-cell-color: var(--calendar-cell-color-dark);
          --text-color: var(--text-primary);
          --shadow-color: var(--shadow-dark);
          --light-shadow: var(--dark-shadow);
          --highlight-color: var(--primary-dark);
        }

        .calendar-container {
          background-color: var(--calendar-background-color);
          border-radius: 20px;
          padding: 30px;
          max-width: 1200px;
          width: 70%;
        }

        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        h2 {
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
        }

        .calendar-title {
          font-size: 24px;
          font-weight: bold;
        }

        .view-selector {
          display: flex;
          gap: 10px;
        }
        
        .view-button {
          padding: 10px 15px;
          border: none;
          border-radius: 10px;
          background-color: var(--bg-color);
          color: var(--text-color);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            5px 5px 10px var(--shadow-color),
            -5px -5px 10px var(--light-shadow);
        }
        
        .view-button:hover, .view-button.active {
          box-shadow: inset 5px 5px 10px var(--shadow-color),
                      inset -5px -5px 10px var(--light-shadow);
        }
        
        .view-button.active {
          color: var(--highlight-color);
        }

        .navigation-buttons {
          display: flex;
          gap: 10px;
        }

        .nav-button {
          padding: 10px 15px;
          border: none;
          border-radius: 10px;
          background-color: var(--bg-color);
          color: var(--text-color);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            5px 5px 10px var(--shadow-color),
            -5px -5px 10px var(--light-shadow);
        }

        .nav-button:hover {
          box-shadow: inset 5px 5px 10px var(--shadow-color),
                      inset -5px -5px 10px var(--light-shadow);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }

        .calendar-cell {
          aspect-ratio: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--calendar-cell-color);
          font-size: 18px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            5px 5px 10px var(--shadow-color),
            -5px -5px 10px var(--light-shadow);
        }


        .calendar-cell-disabled {
          aspect-ratio: 1;
          display: flex;
          max-height: 130px;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          border-radius: 10px;
          transition: all 0.3s ease;
          box-shadow: 
            1px 1px 5px var(--shadow-color),
            -1px -1px 5px var(--light-shadow);
        }

        .calendar-cell:hover {
          box-shadow: inset 5px 5px 10px var(--shadow-color),
          inset -5px -5px 10px var(--light-shadow);
        }

        .calendar-cell.today {
          background-color: var(--primary-color);
          color:white;
        }

        .calendar-cell.has-booking {
          border: 2px solid var(--secondary-color);
        display:flex;
        flex-direction:column;
        padding:1px;
        
        }

        .calendar-cell.current-time {
          background-color: var(--highlight-color);
          color: white;
        }

        .day-view {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .time-slot {
          padding:5px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-color: transparent;
          background-color: var(--calendar-cell-color);
          font-size: 18px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 50px;
          box-shadow: 
            2px 2px 6px var(--shadow-color),
            -2px -2px 6px var(--light-shadow);
        }

        .time-slot:hover {
          box-shadow: inset 1px 1px 3px var(--shadow-color),
                      inset -1px -1px 6px var(--shadow-color);
                     
        }

        .time-slot.has-booking {
        background-color: var(--primary-color);
         color:white;
           padding-bottom: 5px;
           border-radius: 10px;
           border: none;
           border-bottom-width: 1.5px;
           border-bottom-style: solid;
           border-image-source: linear-gradient(to right, var(--secondary-color) 50%, transparent 50%);
           border-image-slice: 0 0 1 0; /* Apply gradient only on the bottom */
        }
        .time-slot.current-time {
          // background-color: var(--primary-color);
          // color: white;
        }

       .modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  float: right;
  font-size: 1.5em;
  font-weight: bold;
  cursor: pointer;
}

        .close:hover,
        .close:focus {
          color: black;
          text-decoration: none;
          cursor: pointer;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        button[type="submit"] {
          padding: 10px 15px;
          border: none;
          border-radius: 10px;
          background-color: var(--primary-color);
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        button[type="submit"]:hover {
          background-color: #2980b9;
        }


      `}</style>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
