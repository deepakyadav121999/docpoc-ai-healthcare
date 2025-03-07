"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddAppointment from "../CalenderBox/AddAppointment";
import OpaqueDefaultModal from "../common/Modal/OpaqueDefaultModal";
import NewAppointment from "./NewAppointment";
import AppointmentList from "../common/Modal/AppointmentListModal";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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

  const profile = useSelector((state: RootState) => state.profile.data);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [loading, setLoading] = useState(false)
  const [totalAppointments, setTotalAppointments] = useState(0)
  const [appointmentsByDate, setAppointmentsByDate] = useState<{ [key: string]: number }>({});
   
  const [isAppointmentDetailsModalOpen, setIsAppointmentDetailsModalOpen] = useState(false);
const [selectedAppointments, setSelectedAppointments] = useState<
  Array<{ title: string; startDateTime: string; endDateTime: string; description?: string }>
>([]);

  const [appointments, setAppointments] = useState<
    Array<{ date: Date; title: string; description?: string; startDateTime: Date; endDateTime: Date; }>
  >([
  ]);
  const [selectedStartTime, setSelectedStartTime] = useState<string>("");
  const [selectedEndTime, setSelectedEndTime] = useState<string>("");

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [resulst, setResults] = useState([])

  const handleModalClose = () => {

    setIsAppointmentDetailsModalOpen(false)
    // onClose();

  };
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
    
      // const hospitalEndpoint = `${API_URL}/hospital`;
      // const hospitalResponse = await axios.get(hospitalEndpoint, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // });
      // if (!hospitalResponse.data || hospitalResponse.data.length === 0) {
      //   return;
      // }

      // const fetchedHospitalId = hospitalResponse.data[0].id;
      // const branchEndpoint = `${API_URL}/hospital/branches/${fetchedHospitalId}`;
      // const branchResponse = await axios.get(branchEndpoint, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // });

      // if (!branchResponse.data || branchResponse.data.length === 0) {
      //   return;
      // }

      // const profileEndpoint = `${API_URL}/auth/profile`;
      // const profileResponse = await axios.get(profileEndpoint,{
      //  headers:{
      //    Authorization: `Bearer ${token}`,
      //    "Content-Type": "application/json",
      //  },
      // })

      // const fetchedBranchId = profileResponse.data?.branchId;
      // const userProfile = localStorage.getItem("userProfile");

      // // Parse the JSON string if it exists
      // const parsedUserProfile = userProfile ? JSON.parse(userProfile) : null;
  
      // Extract the branchId from the user profile
    


      const fetchedBranchId = profile?.branchId;

      const endpoint = `${API_URL}/appointment/list/${fetchedBranchId}`;

      const params: any = {
        page,
        pageSize: rowsPerPage,
        from: "2024-12-01T00:00:00.000Z", // Start of the month
        to: "2025-12-31T23:59:59.999Z", // End of the month
        status:["visiting","declind"]
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
        const header = document.querySelector("header");
        if (isOpen || isAppointmentDetailsModalOpen ) {
          header?.classList.remove("z-999");
          header?.classList.add("z-0");
        } 
        // else if(isNotificationOpen) {
        //     header?.classList.remove("z-999");
        //   header?.classList.add("z-0");
        // }
        else{
          header?.classList.remove("z-0");
          header?.classList.add("z-999");
        }
      }, [isOpen,isAppointmentDetailsModalOpen]);

  useEffect(() => {
   if(profile){
    fetchAppointments()
   }
      
    
    
  }, [])
 

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
  const [AppointmentListModal, setAppointmentListModal] = useState<boolean>(false);
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
                <p className="text-sm">{`${appointmentsByDate[dateKey]} appo...`}</p>
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
      const timeSlotStart = new Date(selectedDate);
      timeSlotStart.setHours(hour, minute, 0, 0);
      const timeSlotEnd = new Date(timeSlotStart);
      timeSlotEnd.setMinutes(timeSlotStart.getMinutes() + 30);

      const isCurrentTime =
        timeSlotStart <= currentTime &&
        timeSlotEnd > currentTime &&
        timeSlotStart.toDateString() === currentTime.toDateString();

      // Determine if the time slot is fully or partially booked
      const fullyBooked = appointments.some(
        (appt) =>
          new Date(appt.startDateTime) <= timeSlotStart &&
          new Date(appt.endDateTime) >= timeSlotEnd
      );

      const partiallyBooked = appointments.some(
        (appt) =>
          new Date(appt.startDateTime) < timeSlotEnd &&
          new Date(appt.endDateTime) > timeSlotStart
      );

      const booking = appointments.find(
        (appt) =>
          new Date(appt.startDateTime) < timeSlotEnd &&
          new Date(appt.endDateTime) > timeSlotStart
      );

      const overlappingAppointments = appointments.filter(
        (appt) =>
          new Date(appt.startDateTime) < timeSlotEnd &&
          new Date(appt.endDateTime) > timeSlotStart
      );

      const slotDuration = timeSlotEnd.getTime() - timeSlotStart.getTime();
      let gradientStartPercentage = 0;
      let gradientEndPercentage = 0;

      overlappingAppointments.forEach((appt) => {
        const apptStart = new Date(appt.startDateTime).getTime();
        const apptEnd = new Date(appt.endDateTime).getTime();

        const overlapStart = Math.max(apptStart, timeSlotStart.getTime());
        const overlapEnd = Math.min(apptEnd, timeSlotEnd.getTime());
        const overlapDuration = overlapEnd - overlapStart;

        if (overlapDuration > 0) {
          const startOffset =
            ((overlapStart - timeSlotStart.getTime()) / slotDuration) * 100;
          const endOffset =
            ((overlapEnd - timeSlotStart.getTime()) / slotDuration) * 100;

          gradientStartPercentage = Math.min(
            gradientStartPercentage || startOffset,
            startOffset
          );
          gradientEndPercentage = Math.max(
            gradientEndPercentage || endOffset,
            endOffset
          );
        }
      });

      const gradientBorder = `linear-gradient(to right, transparent ${gradientStartPercentage}%, var(--secondary-color) ${gradientStartPercentage}%, var(--secondary-color) ${gradientEndPercentage}%, transparent ${gradientEndPercentage}%)`;

      let displayTime = "";
      if (booking) {
        const bookingStart = new Date(booking.startDateTime);
        const bookingEnd = new Date(booking.endDateTime);

        if (timeSlotStart <= bookingStart && timeSlotEnd >= bookingEnd) {
          displayTime = `${bookingStart.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${bookingEnd.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        } else if (timeSlotStart <= bookingStart) {
          displayTime = `${bookingStart.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} - ${timeSlotEnd.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        } else if (timeSlotEnd >= bookingEnd) {
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
          className={`time-slot ${
            isCurrentTime ? "current-time" : ""
          } ${fullyBooked ? "has-booking" : ""} 
           ${
            partiallyBooked ? "partially-booking" : ""
          } flex justify-between p-1 gap-1`}
          style={{
            borderBottom: partiallyBooked
              ? "3px solid transparent"
              : "none",
            borderImageSource: partiallyBooked ? gradientBorder : "none",
            borderImageSlice: "0 0 1 0",
          }}
          onClick={() =>
            // !fullyBooked &&
            openModal(
              selectedDate.getTime(),
              fullyBooked || partiallyBooked,
              timeSlotStart,
              timeSlotEnd
            )
          }
        >
          <div className="flex w-2/4 items-center text-center justify-end ">
            <p>
              {timeSlotStart.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex w-2/4 justify-center items-center gap-1">
            {booking && <p className="text-sm">{displayTime}</p>}
            <p className="text-sm ">{booking && booking.title}</p>
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

    else {
      // Find appointments for the selected time slot
      setIsAppointmentDetailsModalOpen(true);
      const overlappingAppointments = appointments.filter(
        (appt) =>
          new Date(appt.startDateTime) < endTime &&
          new Date(appt.endDateTime) > startTime
      );
  
      // Set the selected appointments and open the details modal
      // setSelectedAppointments(
      //   overlappingAppointments.map((appt) => ({
      //     title: appt.title,
      //     startDateTime: appt.startDateTime.toString(),
      //     endDateTime: appt.endDateTime.toString(),
      //     description: appt.description,
      //   }))
      // );

      // setIsAppointmentDetailsModalOpen(true);
      setSelectedAppointments([]); // Clear previous appointments
      // Pass the startTime and endTime to the modal
      setSelectedStartTime(startTime.toISOString());
      setSelectedEndTime(endTime.toISOString());
   
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
            <div className="navigation-buttons ">
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

        <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="calendar-container">
        {modalVisible && (
         
             <Modal
        backdrop="blur"
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
              
                    <NewAppointment onUsersAdded={fetchAppointments}
                    startDateTime={modalData.startTime} 
                    endDateTime={modalData.endTime} 
                    date={modalData.date} 
                    />
                
               
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

         {/* <AppointmentList
        isOpen={isAppointmentDetailsModalOpen}
        onClose={handleModalClose}
        appointments={selectedAppointments}


      /> */}
        <AppointmentList
      isOpen={isAppointmentDetailsModalOpen}
      onClose={handleModalClose}
      startTime={selectedStartTime} // Pass startTime
      endTime={selectedEndTime} // Pass endTime
    />
       </div>
       </div>
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
          // background-color: var(--calendar-background-color);
          // border-radius: 20px;
          // padding: 30px;
          // max-width: 1200px;
          // width: 70%;
           background-color: var(--calendar-background-color);
  border-radius: 20px;
  padding: 20px;
  width: 68%; /* Full width by default */
  max-width: 1200px; /* Maximum width for larger screens */
  margin: 0 auto; /* Center the container */
  overflow: hidden; /
        }
.calendar-view {
  overflow-x: auto; /* Allow horizontal scrolling if needed */
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
            min-width: 270px;
        }

        .calendar-cell {
          aspect-ratio: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--calendar-cell-color);
          font-size: 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            2px 2px 6px var(--shadow-color),
            -2px -2px 6px var(--light-shadow);
        }


        .calendar-cell-disabled {
          aspect-ratio: 1;
          display: flex;
          // max-height: 130px;
          justify-content: center;
          align-items: center;
          font-size: 14px;
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
       .calendar-cell.has-booking p {
         white-space: nowrap; /* Prevent text wrapping */
           overflow: hidden; /* Hide overflow */
            text-overflow: ellipsis; /* Add ellipsis for overflow */
            font-size: 12px; /* Smaller font size for appointment text */
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
          font-size: 14px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 40px;
          box-shadow: 
            2px 2px 6px var(--shadow-color),
            -2px -2px 6px var(--light-shadow);
        }

        .time-slot:hover {
          box-shadow: inset 1px 1px 3px var(--shadow-color),
                      inset -1px -1px 6px var(--shadow-color);
                     
        }
        .time-slot p {
          white-space: nowrap; /* Prevent text wrapping */
          overflow: hidden; /* Hide overflow */
          text-overflow: ellipsis; /* Add ellipsis for overflow */
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

.time-slot.partially-booking {
 
  cursor: pointer;
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

.time-slot.has-booking {
  // cursor: not-allowed;
  // pointer-events: none;
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


           @media (max-width: 1024px) {
  .calendar-container {
    width: 90%; /* Reduce width on smaller screens */
    padding: 20px; /* Adjust padding */
  }

  .calendar-header {
    // flex-direction: column; /* Stack header elements */
    align-items: flex-start;
  }

  .view-selector {
    flex-wrap: wrap; /* Allow wrapping of view buttons */
    gap: 5px; /* Reduce gap between buttons */
  }

  .navigation-buttons {
    flex-wrap: wrap;
    gap: 5px;
  }

  .calendar-grid {
    gap: 5px; /* Reduce gap between calendar cells */
  }

  .calendar-cell {
    font-size: 14px; /* Smaller font size for cells */
  }
}

@media (max-width: 768px) {
  .calendar-container {
    width: 95%; /* Further reduce width */
    padding: 15px; /* Adjust padding */
  }

  h2 {
    font-size: 20px; /* Reduce header font size */
  }

  .view-button {
    font-size: 12px; /* Smaller buttons for smaller screens */
    padding: 8px 10px;
  }

  .nav-button {
    font-size: 12px;
    padding: 8px 10px;
  }

  .calendar-grid {
    gap: 5px;
  }

  .calendar-cell {
    font-size: 12px;
  }
   
}

@media (max-width: 480px) {
  .calendar-container {
    width: 100%; /* Take full width */
    padding: 10px; /* Minimal padding */
  }

  .calendar-header {
    // flex-direction: column;
    align-items: center;
    justify-content:center;
    gap: 1px;
  }

  .view-selector {
    // flex-direction: column; /* Stack view buttons vertically */
    gap: 3px;
  }

  .navigation-buttons {
    flex-direction: flex; /* Stack navigation buttons vertically */
    gap: 3px;
  }

  .calendar-grid {
    gap: 2px; /* Minimal gap */
  }

  .calendar-cell {
    font-size: 10px; /* Smallest font size for readability */
    padding: 5px; /* Reduce padding */
  }

  .modal-content {
    width: 100%; /* Use full width for modal on small screens */
    max-width: none;
    padding: 15px;
  }
}
@media (max-width: 768px) {
  .calendar-container {
    padding: 10px; /* Reduce padding */
  }

  .calendar-grid {
    gap: 3px; /* Reduce gap between cells */
  }

  .calendar-cell {
    font-size: 12px; /* Smaller font size */
    padding: 3px; /* Reduce padding */
  }

  .calendar-cell.has-booking p {
    font-size: 10px; /* Smaller font size for appointment text */
  }
     .time-slot {
    padding: 3px; /* Reduce padding */
    font-size: 12px; /* Smaller font size */
    min-height: 30px; /* Reduce height */
  }

  .time-slot.has-booking p,
  .time-slot.partially-booking p {
    font-size: 10px; /* Smaller font size for appointment text */
  }
}

@media (max-width: 480px) {
  .calendar-container {
    padding: 5px; /* Minimal padding */
  }

  .calendar-grid {
    gap: 2px; /* Minimal gap */
  }

  .calendar-cell {
    font-size: 10px; /* Smallest font size */
    padding: 2px; /* Minimal padding */
  }

  .calendar-cell.has-booking p {
    font-size: 8px; /* Smallest font size for appointment text */
  }
     .time-slot {
    padding: 5px; /* Minimal padding */
    font-size: 10px; /* Smallest font size */
    min-height: 30px; /* Minimal height */
  }

  .time-slot.has-booking p,
  .time-slot.partially-booking p {
    font-size: 8px; /* Smallest font size for appointment text */
  }
}

      `}</style>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
