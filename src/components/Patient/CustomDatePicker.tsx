"use client";
import React, { useState, useRef, useEffect } from "react";

interface CustomDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  maxDate?: Date;
  className?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select Date",
  maxDate = new Date(),
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [view, setView] = useState<"calendar" | "year" | "month">("calendar");
  const [yearRange, setYearRange] = useState<number[]>([]);
  const [monthRange, setMonthRange] = useState<number[]>([]);

  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setView("calendar");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Generate year range (current year - 100 to current year + 10)
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 100; i <= currentYear + 10; i++) {
      years.push(i);
    }
    setYearRange(years);

    // Generate month range (1-12)
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(i);
    }
    setMonthRange(months);
  }, []);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = (date: Date): (Date | null)[] => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    if (date > maxDate) return;

    setSelectedDate(date);
    setCurrentDate(date);
    onChange(date);
    setIsOpen(false);
    setView("calendar");
  };

  const handleMonthChange = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleYearChange = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
    setView("calendar");
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setView("calendar");
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date | null): boolean => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isDisabled = (date: Date | null): boolean => {
    if (!date) return false;
    return date > maxDate;
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Real input for focus/blur management */}
      <input
        ref={inputRef}
        className={`w-full h-11 px-3 py-2 border border-gray-300 dark:border-dark-4 rounded-lg bg-white dark:bg-gray-dark text-gray-900 dark:text-white cursor-pointer hover:border-purple-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors${isOpen ? " ring-2 ring-purple-500" : ""}`}
        value={selectedDate ? formatDate(selectedDate) : ""}
        placeholder={placeholder}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
        aria-label={placeholder}
      />
      {/* Calendar icon overlay */}
      <div
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ zIndex: 2 }}
      >
        <svg
          className="w-5 h-5 text-gray-400 dark:text-gray-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-gray-dark border border-gray-200 dark:border-dark-4 rounded-lg shadow-lg dark:shadow-[0_4px_32px_rgba(0,0,0,0.7)] z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setView("month")}
                  onMouseDown={(e) => e.preventDefault()}
                  className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-2 rounded-md transition-colors"
                >
                  {months[currentDate.getMonth()]}
                </button>
                <button
                  onClick={() => setView("year")}
                  onMouseDown={(e) => e.preventDefault()}
                  className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-2 rounded-md transition-colors"
                >
                  {currentDate.getFullYear()}
                </button>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() =>
                    view === "calendar"
                      ? handleMonthChange("prev")
                      : handleYearChange("prev")
                  }
                  className="p-1 hover:bg-gray-100 dark:hover:bg-dark-2 rounded-md transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    view === "calendar"
                      ? handleMonthChange("next")
                      : handleYearChange("next")
                  }
                  className="p-1 hover:bg-gray-100 dark:hover:bg-dark-2 rounded-md transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Body */}
          <div className="p-4">
            {view === "calendar" && (
              <div>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays(currentDate).map((date, index) => (
                    <button
                      key={index}
                      onClick={() => date && handleDateSelect(date)}
                      disabled={!date || isDisabled(date)}
                      className={`
                        w-8 h-8 text-sm rounded-md transition-colors
                        ${!date ? "invisible" : ""}
                        ${isToday(date!) ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 font-semibold" : ""}
                        ${isSelected(date!) ? "bg-purple-600 text-white font-semibold" : ""}
                        ${!isSelected(date!) && !isToday(date!) && date ? "hover:bg-gray-100 dark:hover:bg-dark-2 text-gray-700 dark:text-gray-200" : ""}
                        ${isDisabled(date!) ? "text-gray-300 dark:text-gray-600 cursor-not-allowed" : ""}
                        ${date && date.getMonth() !== currentDate.getMonth() ? "text-gray-400 dark:text-gray-600" : ""}
                      `}
                    >
                      {date ? date.getDate() : ""}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Month Selection */}
            {view === "month" && (
              <div className="grid grid-cols-3 gap-2">
                {monthRange.map((month) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(month)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`
                      px-3 py-2 text-sm rounded-md transition-colors
                      ${currentDate.getMonth() === month ? "bg-purple-600 text-white font-semibold" : "hover:bg-gray-100 dark:hover:bg-dark-2 text-gray-700 dark:text-gray-200"}
                    `}
                  >
                    {months[month]}
                  </button>
                ))}
              </div>
            )}

            {/* Year Selection */}
            {view === "year" && (
              <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                {yearRange.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`
                      px-3 py-2 text-sm rounded-md transition-colors
                      ${currentDate.getFullYear() === year ? "bg-purple-600 text-white font-semibold" : "hover:bg-gray-100 dark:hover:bg-dark-2 text-gray-700 dark:text-gray-200"}
                    `}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;
