"use client";
import React, { useState, useEffect } from "react";

export const AppointmentCalendar: React.FC = () => {
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">(
    "month"
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<
    Array<{ date: Date; title: string; description?: string }>
  >([
    { date: new Date(2023, 5, 15, 10, 0), title: "Doctor Appointment" },
    { date: new Date(2023, 5, 16, 14, 30), title: "Team Meeting" },
    { date: new Date(2023, 5, 17, 11, 0), title: "Dentist Appointment" },
  ]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    date: Date;
    hasBooking: boolean;
  }>({ date: new Date(), hasBooking: false });

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
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

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
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === new Date().toDateString();
      const hasBooking = appointments.some(
        (appt) => appt.date.toDateString() === date.toDateString()
      );
      daysCells.push(
        <div
          key={i}
          className={`calendar-cell ${isToday ? "today" : ""} ${hasBooking ? "has-booking" : ""}`}
          onClick={() => selectDate(year, month, i)}
        >
          {i}
        </div>
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
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

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
      const isToday = date.toDateString() === new Date().toDateString();
      const hasBooking = appointments.some(
        (appt) => appt.date.toDateString() === date.toDateString()
      );
      weekCells.push(
        <div
          key={i}
          className={`calendar-cell ${isToday ? "today" : ""} ${hasBooking ? "has-booking" : ""}`}
          onClick={() =>
            selectDate(date.getFullYear(), date.getMonth(), date.getDate())
          }
        >
          {date.getDate()}
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
        const time = new Date(selectedDate);
        time.setHours(hour, minute);
        const isCurrentTime =
          time.getHours() === currentTime.getHours() &&
          time.getMinutes() <= currentTime.getMinutes() &&
          time.getMinutes() + 30 > currentTime.getMinutes() &&
          time.toDateString() === currentTime.toDateString();
        const hasBooking = appointments.some(
          (appt) =>
            appt.date.getFullYear() === time.getFullYear() &&
            appt.date.getMonth() === time.getMonth() &&
            appt.date.getDate() === time.getDate() &&
            appt.date.getHours() === time.getHours() &&
            appt.date.getMinutes() === time.getMinutes()
        );
        const booking = appointments.find(
          (appt) =>
            appt.date.getFullYear() === time.getFullYear() &&
            appt.date.getMonth() === time.getMonth() &&
            appt.date.getDate() === time.getDate() &&
            appt.date.getHours() === time.getHours() &&
            appt.date.getMinutes() === time.getMinutes()
        );
        dayCells.push(
          <div
            key={`${hour}-${minute}`}
            className={`time-slot ${isCurrentTime ? "current-time" : ""} ${hasBooking ? "has-booking" : ""}`}
            onClick={() => openModal(time.getTime(), !!hasBooking)}
          >
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {booking ? ` - ${booking.title}` : ""}
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

  const openModal = (timestamp: number, hasBooking: boolean) => {
    setModalVisible(true);
    const date = new Date(timestamp);
    setModalData({ date, hasBooking });
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
    setAppointments([...appointments, { date: dateTime, title, description }]);
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
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2 id="modalTitle">
              {modalData.hasBooking ? "View Appointment" : "Book Appointment"}
            </h2>
            <form id="appointmentForm" onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="appointmentTitle"
                placeholder="Appointment Title"
                required
              />
              <input
                type="datetime-local"
                name="appointmentDateTime"
                required
              />
              <textarea
                name="appointmentDescription"
                placeholder="Description"
              ></textarea>
              <button type="submit">Book Appointment</button>
            </form>
          </div>
        </div>
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
          color: white;
        }

        .calendar-cell.has-booking {
          border: 2px solid var(--secondary-color);
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
          display: flex;
          justify-content: center;
          align-items: center;
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
          border: 2px solid var(--highlight-color);
        }

        .time-slot.current-time {
          background-color: var(--primary-color);
          color: white;
        }

        .modal {
          display: none;
          position: fixed;
          z-index: 1;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0,0,0,0.4);
        }

        .modal-content {
          background-color: var(--calendar-background-color);
          margin: 15% auto;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 10px 10px 20px var(--shadow-color),
                      -10px -10px 20px var(--shadow-color);
          max-width: 500px;
          width: 100%;
        }

        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
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
