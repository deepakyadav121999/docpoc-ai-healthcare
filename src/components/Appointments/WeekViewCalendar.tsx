import React, { useState } from "react";

export const WeekView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const appointments = [
    { date: new Date(2023, 5, 15, 10, 0), title: "Doctor Appointment" },
    { date: new Date(2023, 5, 16, 14, 30), title: "Team Meeting" },
    { date: new Date(2023, 5, 17, 11, 0), title: "Dentist Appointment" },
  ];

  const renderWeekView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayHeaders = days.map((day) => (
      <div key={day} className="calendar-cell-disabled">
        {day}
      </div>
    ));

    const weekCells = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const isToday = date.toDateString() === new Date().toDateString();
      const hasBooking = appointments.some(
        (appt) => appt.date.toDateString() === date.toDateString()
      );
      return (
        <div
          key={i}
          className={`calendar-cell ${isToday ? "today" : ""} ${hasBooking ? "has-booking" : ""}`}
        >
          {date.getDate()}
        </div>
      );
    });

    return (
      <div className="calendar-grid">
        {dayHeaders}
        {weekCells}
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <h2>Week View</h2>
      {renderWeekView()}
    </div>
  );
};
