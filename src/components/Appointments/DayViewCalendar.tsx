import React from "react";

export const DayView: React.FC = () => {
  const appointments = [
    { date: new Date(2023, 5, 15, 10, 0), title: "Doctor Appointment" },
    { date: new Date(2023, 5, 16, 14, 30), title: "Team Meeting" },
  ];

  const renderDayView = () => {
    const dayCells = Array.from({ length: 26 }, (_, i) => {
      const hour = 8 + Math.floor(i / 2);
      const minute = (i % 2) * 30;
      const time = new Date();
      time.setHours(hour, minute, 0, 0);
      const hasBooking = appointments.some(
        (appt) => appt.date.getHours() === time.getHours() && appt.date.getMinutes() === time.getMinutes()
      );
      return (
        <div
          key={`${hour}-${minute}`}
          className={`time-slot ${hasBooking ? "has-booking" : ""}`}
        >
          {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      );
    });

    return <div className="day-view">{dayCells}</div>;
  };

  return (
    <div className="calendar-container">
      <h2>Day View</h2>
      {renderDayView()}
    </div>
  );
};
