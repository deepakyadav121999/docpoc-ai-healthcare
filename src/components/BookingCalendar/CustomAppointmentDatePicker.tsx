"use client";
import React, { useState, useRef, useEffect } from "react";

interface CustomAppointmentDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  labelPlacement?: "inside" | "outside" | "outside-left";
  variant?: "flat" | "bordered" | "faded" | "underlined";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  isRequired?: boolean;
  errorMessage?: string;
  isInvalid?: boolean;
  disabled?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const CustomAppointmentDatePicker: React.FC<
  CustomAppointmentDatePickerProps
> = ({
  value,
  onChange,
  placeholder = "Select Date",
  className = "",
  label = "Select Date",
  labelPlacement = "outside",
  // variant = "bordered",
  color = "secondary",
  isRequired = false,
  errorMessage = "",
  isInvalid = false,
  disabled = false,
  onValidationChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [inputValue, setInputValue] = useState(
    value
      ? (() => {
          const year = value.getFullYear();
          const month = String(value.getMonth() + 1).padStart(2, "0");
          const day = String(value.getDate()).padStart(2, "0");
          return `${day}/${month}/${year}`;
        })()
      : "",
  );
  const [view, setView] = useState<"calendar" | "year" | "month">("calendar");
  const [yearRange, setYearRange] = useState<number[]>([]);
  const [monthRange, setMonthRange] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [internalError, setInternalError] = useState("");

  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get today's date (for minimum date validation)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  // Color mappings for NextUI-like styling
  const colorClasses = {
    default: {
      border: "border-gray-300 dark:border-gray-600",
      focusBorder: "border-gray-500 dark:border-gray-400",
      focusRing: "ring-gray-200 dark:ring-gray-800",
      text: "text-gray-900 dark:text-white",
      bg: "bg-white dark:bg-gray-dark",
    },
    primary: {
      border: "border-gray-300 dark:border-gray-600",
      focusBorder: "border-blue-500 dark:border-blue-400",
      focusRing: "ring-blue-200 dark:ring-blue-800",
      text: "text-gray-900 dark:text-white",
      bg: "bg-white dark:bg-gray-dark",
    },
    secondary: {
      border: "border-gray-300 dark:border-gray-600",
      focusBorder: "border-purple-500 dark:border-purple-400",
      focusRing: "ring-purple-200 dark:ring-purple-800",
      text: "text-gray-900 dark:text-white",
      bg: "bg-white dark:bg-gray-dark",
    },
    success: {
      border: "border-gray-300 dark:border-gray-600",
      focusBorder: "border-green-500 dark:border-green-400",
      focusRing: "ring-green-200 dark:ring-green-800",
      text: "text-gray-900 dark:text-white",
      bg: "bg-white dark:bg-gray-dark",
    },
    warning: {
      border: "border-gray-300 dark:border-gray-600",
      focusBorder: "border-yellow-500 dark:border-yellow-400",
      focusRing: "ring-yellow-200 dark:ring-yellow-800",
      text: "text-gray-900 dark:text-white",
      bg: "bg-white dark:bg-gray-dark",
    },
    danger: {
      border: "border-red-300 dark:border-red-600",
      focusBorder: "border-red-500 dark:border-red-400",
      focusRing: "ring-red-200 dark:ring-red-800",
      text: "text-gray-900 dark:text-white",
      bg: "bg-white dark:bg-gray-dark",
    },
  };

  const currentColorClass =
    isInvalid || internalError ? colorClasses.danger : colorClasses[color];

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
    // Generate year range (current year to current year + 10)
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 10; i++) {
      years.push(i);
    }
    setYearRange(years);

    // Generate month range (0-11)
    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(i);
    }
    setMonthRange(months);
  }, []);

  const formatDateDDMMYYYY = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const formatInputValue = (value: string): string => {
    let cleaned = value.replace(/[^\d/]/g, "");
    cleaned = cleaned.replace(/\/+/g, "/");

    const parts = cleaned.split("/");

    if (parts.length === 1) {
      if (parts[0].length > 2) {
        parts[0] = parts[0].substring(0, 2);
      }
      return parts[0];
    } else if (parts.length === 2) {
      if (parts[0].length > 2) {
        parts[0] = parts[0].substring(0, 2);
      }
      if (parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
      }
      return `${parts[0]}/${parts[1]}`;
    } else if (parts.length >= 3) {
      if (parts[0].length > 2) {
        parts[0] = parts[0].substring(0, 2);
      }
      if (parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
      }
      if (parts[2].length > 4) {
        parts[2] = parts[2].substring(0, 4);
      }

      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }

    return cleaned;
  };

  const parseManualDate = (dateString: string): Date | null => {
    const ddMMyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = dateString.match(ddMMyyyyRegex);

    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // Month is 0-indexed
      const year = parseInt(match[3], 10);

      // Additional validation for realistic ranges
      if (
        day < 1 ||
        day > 31 ||
        month < 0 ||
        month > 11 ||
        year < 1900 ||
        year > 2100
      ) {
        return null;
      }

      const date = new Date(year, month, day);

      // Validate the date (handles leap years, month lengths, etc.)
      if (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
      ) {
        return date;
      }
    }

    return null;
  };

  const isValidFutureDate = (date: Date): boolean => {
    // Create fresh Date objects for comparison
    const selectedDate = new Date(date);
    const today = new Date();

    // Reset time components to midnight for accurate date comparison
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Compare dates (>= allows today's date)
    return selectedDate >= today;
  };

  const handleManualDateInput = (value: string) => {
    setInternalError(""); // Clear internal error when user starts typing

    if (!value.trim()) {
      setSelectedDate(null);
      onChange(null);
      onValidationChange?.(true, "");
      return;
    }

    // Allow partial typing without showing errors immediately
    if (value.length < 10) {
      onValidationChange?.(true, "");
      return;
    }

    if (value.length === 10) {
      const parsedDate = parseManualDate(value);
      if (parsedDate) {
        if (isValidFutureDate(parsedDate)) {
          setSelectedDate(parsedDate);
          setCurrentDate(parsedDate);
          onChange(parsedDate);
          setInternalError("");
          onValidationChange?.(true, "");
        } else {
          const errorMsg = "Cannot select past dates";
          setInternalError(errorMsg);
          setSelectedDate(null);
          onChange(null);
          onValidationChange?.(false, errorMsg);
        }
      } else {
        const errorMsg = "Invalid date format. Please use DD/MM/YYYY";
        setInternalError(errorMsg);
        setSelectedDate(null);
        onChange(null);
        onValidationChange?.(false, errorMsg);
      }
    } else if (value.length > 10) {
      // Prevent typing more than 10 characters
      return;
    }
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
    if (!isValidFutureDate(date)) {
      setInternalError("Cannot select past dates");
      return;
    }

    setSelectedDate(date);
    setCurrentDate(date);
    setInputValue(formatDateDDMMYYYY(date));
    onChange(date);
    setIsOpen(false);
    setView("calendar");
    setIsTyping(false);
    setInternalError("");
  };

  const handleMonthChange = (
    direction: "prev" | "next",
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }

    // Don't allow navigating to past months
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const newMonth = new Date(newDate);
    newMonth.setDate(1);
    newMonth.setHours(0, 0, 0, 0);

    if (newMonth >= currentMonth) {
      setCurrentDate(newDate);
    }
  };

  const handleYearChange = (
    direction: "prev" | "next",
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const newDate = new Date(currentDate);
    const currentYear = new Date().getFullYear();

    if (direction === "prev") {
      if (newDate.getFullYear() > currentYear) {
        newDate.setFullYear(newDate.getFullYear() - 1);
        setCurrentDate(newDate);
      }
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
      setCurrentDate(newDate);
    }
  };

  const handleMonthSelect = (month: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const newDate = new Date(currentDate);
    newDate.setMonth(month);

    // Check if this month is valid (not in the past)
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const selectedMonth = new Date(newDate);
    selectedMonth.setDate(1);
    selectedMonth.setHours(0, 0, 0, 0);

    if (selectedMonth >= currentMonth) {
      setCurrentDate(newDate);
      setView("calendar");
    }
  };

  const handleYearSelect = (year: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const currentYear = new Date().getFullYear();
    if (year >= currentYear) {
      const newDate = new Date(currentDate);
      newDate.setFullYear(year);
      setCurrentDate(newDate);
      setView("calendar");
    }
  };

  const handleViewChange = (
    newView: "calendar" | "year" | "month",
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setView(newView);
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

  const isDateDisabled = (date: Date | null): boolean => {
    if (!date) return false;
    return !isValidFutureDate(date);
  };

  const displayError = internalError || errorMessage;

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <style jsx>{`
        @media (max-width: 640px) {
          .calendar-dropdown {
            right: 0 !important;
            left: auto !important;
            width: calc(100vw - 2rem) !important;
            max-width: 320px !important;
          }
        }

        @media (max-width: 375px) {
          .calendar-dropdown {
            width: calc(100vw - 1rem) !important;
            max-width: 300px !important;
          }
        }
      `}</style>

      {/* Label */}
      {label && labelPlacement === "outside" && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        <input
          ref={inputRef}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 pr-10 border rounded-lg transition-all duration-200 text-base outline-none
            ${currentColorClass.bg} ${currentColorClass.text} 
            ${displayError ? "border-red-500 ring-red-200" : isOpen ? `${currentColorClass.focusBorder} ${currentColorClass.focusRing} ring-2` : currentColorClass.border}
          `}
          style={{
            fontSize: "16px",
            minHeight: "39px",
            height: "39px",
            touchAction: "manipulation",
          }}
          value={inputValue}
          readOnly={false}
          onFocus={() => {
            if (!disabled) {
              setIsTyping(false);
              setIsOpen(true);
            }
          }}
          onClick={() => {
            if (!disabled) {
              setIsTyping(false);
              setIsOpen(true);
            }
          }}
          onChange={(e) => {
            if (!disabled) {
              setIsTyping(true);
              const formattedValue = formatInputValue(e.target.value);
              setInputValue(formattedValue);

              // Always call handleManualDateInput to handle validation
              handleManualDateInput(formattedValue);
            }
          }}
          onKeyDown={(e) => {
            if (!disabled) return;

            const allowedKeys = [
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
              "End",
              "Tab",
            ];

            const isNumberOrSlash = /^[0-9/]$/.test(e.key);

            if (!allowedKeys.includes(e.key) && !isNumberOrSlash) {
              e.preventDefault();
            }
          }}
          onBlur={(e) => {
            const relatedTarget = e.relatedTarget as HTMLElement;
            if (!relatedTarget || !pickerRef.current?.contains(relatedTarget)) {
              if (!isTyping) {
                setTimeout(() => setIsOpen(false), 150);
              }
            }
          }}
          aria-label={placeholder}
        />

        {/* Calendar icon */}
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ zIndex: 2 }}
        >
          <div className="w-5 h-5 text-purple-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {displayError && (
        <div className="text-red-600 text-sm mt-1 px-1">{displayError}</div>
      )}

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <div className="calendar-dropdown absolute top-full left-0 mt-2 w-full max-w-xs sm:max-w-sm md:w-80 bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl dark:shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 sm:p-4 bg-gradient-to-r">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  type="button"
                  onClick={(e) => handleViewChange("month", e)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold hover:bg-white/20 rounded-lg transition-colors"
                >
                  {months[currentDate.getMonth()]}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleViewChange("year", e)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-semibold hover:bg-white/20 rounded-lg transition-colors"
                >
                  {currentDate.getFullYear()}
                </button>
              </div>
              <div className="flex items-center space-x-0.5 sm:space-x-1">
                <button
                  type="button"
                  onClick={(e) =>
                    view === "calendar"
                      ? handleMonthChange("prev", e)
                      : handleYearChange("prev", e)
                  }
                  onMouseDown={(e) => e.preventDefault()}
                  className="p-1 sm:p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
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
                  type="button"
                  onClick={(e) =>
                    view === "calendar"
                      ? handleMonthChange("next", e)
                      : handleYearChange("next", e)
                  }
                  onMouseDown={(e) => e.preventDefault()}
                  className="p-1 sm:p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
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
          <div className="p-3 sm:p-4">
            {view === "calendar" && (
              <div>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
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
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                  {generateCalendarDays(currentDate).map((date, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (date) {
                          handleDateSelect(date);
                        }
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      disabled={!date || isDateDisabled(date)}
                      className={`
                        w-6 h-6 sm:w-8 sm:h-8 text-xs sm:text-sm rounded-full transition-all duration-200 flex items-center justify-center font-medium
                        ${!date ? "invisible" : ""}
                        ${isToday(date!) && !isSelected(date!) ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 ring-1 ring-purple-300 dark:ring-purple-700" : ""}
                        ${isSelected(date!) ? "bg-purple-500 text-white shadow-lg transform scale-105" : ""}
                        ${!isSelected(date!) && !isToday(date!) && date && !isDateDisabled(date!) ? "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300" : ""}
                        ${isDateDisabled(date!) ? "text-gray-500 dark:text-gray-600 cursor-not-allowed opacity-50" : ""}
                        ${date && date.getMonth() !== currentDate.getMonth() ? "text-gray-400 dark:text-gray-600 opacity-60" : ""}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {monthRange.map((month) => {
                  const currentYear = new Date().getFullYear();
                  const currentMonth = new Date().getMonth();
                  const isCurrentOrFutureMonth =
                    currentDate.getFullYear() > currentYear ||
                    (currentDate.getFullYear() === currentYear &&
                      month >= currentMonth);

                  return (
                    <button
                      type="button"
                      key={month}
                      onClick={(e) => handleMonthSelect(month, e)}
                      onMouseDown={(e) => e.preventDefault()}
                      disabled={!isCurrentOrFutureMonth}
                      className={`
                        px-2 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-200 font-medium
                        ${currentDate.getMonth() === month ? "bg-purple-500 text-white shadow-md transform scale-105" : ""}
                        ${currentDate.getMonth() !== month && isCurrentOrFutureMonth ? "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300" : ""}
                        ${!isCurrentOrFutureMonth ? "text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50" : ""}
                      `}
                    >
                      {months[month]}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Year Selection */}
            {view === "year" && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 sm:max-h-60 overflow-y-auto">
                {yearRange.map((year) => (
                  <button
                    type="button"
                    key={year}
                    onClick={(e) => handleYearSelect(year, e)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`
                      px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 font-medium
                      ${currentDate.getFullYear() === year ? "bg-purple-500 text-white shadow-md transform scale-105" : "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300"}
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

export default CustomAppointmentDatePicker;
