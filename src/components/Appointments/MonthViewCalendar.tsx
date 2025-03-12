import React, { useState } from "react";

export const MonthView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const appointments = [
    { date: new Date(2023, 5, 15, 10, 0), title: "Doctor Appointment" },
    { date: new Date(2023, 5, 16, 14, 30), title: "Team Meeting" },
    { date: new Date(2023, 5, 17, 11, 0), title: "Dentist Appointment" },
  ];

  const changeMonth = (direction: "next" | "previous") => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(
      direction === "next"
        ? selectedDate.getMonth() + 1
        : selectedDate.getMonth() - 1,
    );
    setSelectedDate(newDate);
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

    const emptyCells = Array.from({ length: firstDay.getDay() }, (_, i) => (
      <div key={`empty-${i}`} className="calendar-cell"></div>
    ));

    const daysCells = Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1);
      const isToday = date.toDateString() === new Date().toDateString();
      const hasBooking = appointments.some(
        (appt) => appt.date.toDateString() === date.toDateString(),
      );
      return (
        <div
          key={i}
          className={`calendar-cell ${isToday ? "today" : ""} ${hasBooking ? "has-booking" : ""}`}
        >
          {i + 1}
        </div>
      );
    });

    return (
      <div className="calendar-grid">
        {dayHeaders}
        {emptyCells}
        {daysCells}
      </div>
    );
  };

  const getMonthYearString = () => {
    const options = { year: "numeric", month: "long" } as const;
    return selectedDate.toLocaleDateString(undefined, options);
  };

  return (
    <div className="calendar-container">
      <h2>{getMonthYearString()}</h2>
      <div className="calendar-header">
        <button onClick={() => changeMonth("previous")}>Previous</button>
        <button onClick={() => changeMonth("next")}>Next</button>
      </div>
      {renderMonthView()}
    </div>
  );
};
