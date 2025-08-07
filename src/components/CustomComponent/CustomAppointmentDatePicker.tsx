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
  // const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
  //   "bottom",
  // );

  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate optimal dropdown position
  // const calculateDropdownPosition = () => {
  //   if (!pickerRef.current || !inputRef.current) return;

  //   const inputRect = inputRef.current.getBoundingClientRect();
  //   const viewportHeight = window.innerHeight;
  //   const viewportWidth = window.innerWidth;

  //   // Responsive height based on screen size
  //   const isSmallScreen = viewportWidth < 640; // sm breakpoint
  //   const dropdownHeight = isSmallScreen ? 240 : 280; // Smaller height for mobile

  //   const spaceBelow = viewportHeight - inputRect.bottom;
  //   const spaceAbove = inputRect.top;

  //   // Add buffer for better UX
  //   const buffer = 20;

  //   // If not enough space below but enough space above, position above
  //   if (
  //     spaceBelow < dropdownHeight + buffer &&
  //     spaceAbove > dropdownHeight + buffer
  //   ) {
  //     // setDropdownPosition("top");
  //   } else {
  //     // setDropdownPosition("bottom");
  //   }
  // };

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

  // const isValidFutureDate = (date: Date): boolean => {
  //   // NEW VALIDATION: Allow today and future dates, block only past dates
  //   const selectedDateOnly = new Date(
  //     date.getFullYear(),
  //     date.getMonth(),
  //     date.getDate(),
  //   );
  //   const todayDateOnly = new Date();
  //   todayDateOnly.setHours(0, 0, 0, 0);
  //   selectedDateOnly.setHours(0, 0, 0, 0);

  //   // Use date strings for most reliable comparison
  //   const selectedDateStr = selectedDateOnly.toDateString();
  //   const todayDateStr = todayDateOnly.toDateString();

  //   // Allow today and future dates, block only past dates
  //   const isValid = selectedDateOnly >= todayDateOnly;

  //   console.log("NEW VALIDATION - Date check:", {
  //     selectedDateStr,
  //     todayDateStr,
  //     selectedTimestamp: selectedDateOnly.getTime(),
  //     todayTimestamp: todayDateOnly.getTime(),
  //     isValid: isValid,
  //     rule: "Allow today and future, block only past",
  //   });

  //   return isValid;
  // };

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
        // BYPASS: Let AddAppointment handle all validation
        setSelectedDate(parsedDate);
        setCurrentDate(parsedDate);
        onChange(parsedDate);
        setInternalError("");
        onValidationChange?.(true, "");
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
    console.log("DEBUG - handleDateSelect called with:", {
      date: date.toDateString(),
      dateTime: date.getTime(),
      localTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // BYPASS internal validation - let AddAppointment handle all validation
    console.log(
      "BYPASS - Skipping internal date validation, letting AddAppointment handle it",
    );

    console.log("DEBUG - Date accepted, calling onChange");
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
    // BYPASS: Let AddAppointment handle all validation, don't disable any dates here
    return false;
  };

  const displayError = internalError || errorMessage;

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      <style jsx>{`
        @media (max-width: 640px) {
          .calendar-dropdown {
            width: 270px !important;
            max-height: 320px !important;
          }
        }

        @media (max-width: 375px) {
          .calendar-dropdown {
            width: 250px !important;
            max-height: 300px !important;
          }
        }
      `}</style>

      {/* Label */}
      {label && labelPlacement === "outside" && (
        <label
          className={`block text-sm font-medium mb-1.5 ${disabled ? "text-gray-400 dark:text-gray-600" : "text-gray-700 dark:text-gray-300"}`}
        >
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
            ${disabled ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700 cursor-not-allowed" : currentColorClass.bg + " " + currentColorClass.text} 
            ${!disabled && displayError ? "border-red-500 ring-red-200" : !disabled && isOpen ? `${currentColorClass.focusBorder} ${currentColorClass.focusRing} ring-2` : !disabled ? currentColorClass.border : ""}
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
          className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${disabled ? "opacity-40" : ""}`}
          style={{ zIndex: 2 }}
        >
          <div className="w-7 h-7 ">
            <div className="w-7 h-7  rounded flex items-center justify-center">
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100%"
                viewBox="0 0 106 85"
                enable-background="new 0 0 106 85"
                className={disabled ? "text-gray-400 dark:text-gray-600" : ""}
              >
                <path
                  fill="#6B46C1"
                  opacity="1.000000"
                  stroke="none"
                  d="
M87.052551,48.958462 
	C87.052246,64.920227 85.911621,66.052727 70.328026,66.052475 
	C59.345100,66.052292 48.361992,66.089104 37.379311,66.037216 
	C30.396797,66.004227 27.007994,62.611965 26.962055,55.639244 
	C26.907337,47.333702 26.949165,39.027527 26.949165,30.382895 
	C46.890579,30.382895 66.602852,30.382895 87.052551,30.382895 
	C87.052551,36.310120 87.052551,42.388348 87.052551,48.958462 
M41.602688,35.989021 
	C40.781628,37.342010 39.774170,38.634853 39.301304,40.100208 
	C39.209881,40.383511 41.178314,41.772690 42.252831,41.847927 
	C43.074741,41.905479 44.820839,40.408886 44.714146,40.097393 
	C44.213169,38.634769 43.213863,37.342838 41.602688,35.989021 
M55.805172,41.842262 
	C57.213512,41.070751 58.747818,40.443726 59.930149,39.412968 
	C60.184555,39.191174 59.418148,36.987656 58.675228,36.633102 
	C57.695133,36.165371 55.295719,36.380909 55.211823,36.722065 
	C54.845982,38.209778 55.098022,39.849434 55.805172,41.842262 
M69.011421,38.608643 
	C70.102013,39.735405 71.079262,41.039349 72.364670,41.861546 
	C72.677216,42.061466 74.581696,40.780437 74.722694,39.995152 
	C74.915184,38.923046 74.091545,36.663845 73.752594,36.673302 
	C72.210381,36.716316 70.685371,37.376350 69.011421,38.608643 
M38.985924,51.395561 
	C40.339760,52.217060 41.633549,53.224358 43.099731,53.698215 
	C43.381992,53.789436 44.771542,51.818768 44.846840,50.743061 
	C44.904343,49.921532 43.406620,48.175922 43.094433,48.282845 
	C41.631683,48.783852 40.339851,49.783905 38.985924,51.395561 
M56.608780,54.009804 
	C57.761860,52.913849 59.077038,51.926495 59.941063,50.636875 
	C60.130173,50.354618 58.815987,48.420853 58.006657,48.272873 
	C56.932701,48.076508 54.663128,48.908485 54.670670,49.260845 
	C54.703503,50.794796 55.375980,52.315056 56.608780,54.009804 
M71.608025,48.012077 
	C70.783684,49.361179 69.779579,50.648540 69.278145,52.108543 
	C69.170609,52.421650 70.924911,53.929661 71.745972,53.868755 
	C72.826347,53.788605 74.799919,52.391636 74.706345,52.098869 
	C74.239807,50.639351 73.221558,49.356190 71.608025,48.012077 
z"
                />
                <path
                  fill="#6B46C1"
                  opacity="1.000000"
                  stroke="none"
                  d="
M66.644653,12.026896 
	C67.725540,11.648741 68.834976,11.324877 68.880600,10.889513 
	C69.127220,8.536592 69.029655,5.507633 72.314468,6.218799 
	C73.822449,6.545277 74.794601,9.346641 76.519257,11.729735 
	C84.931206,13.023575 87.252861,15.402603 86.842850,23.671885 
	C66.987061,23.671885 47.115269,23.671885 27.256739,23.671885 
	C26.574755,15.577951 29.680370,12.292706 37.003189,11.995294 
	C39.197338,9.582918 40.826015,7.792256 42.454693,6.001595 
	C43.618343,7.726607 44.781994,9.451620 46.521122,12.029726 
	C52.256397,12.029726 59.219303,12.029726 66.644653,12.026896 
z"
                />
                <path
                  fill="#D8D8D9"
                  opacity="1.000000"
                  stroke="none"
                  d="
M41.997581,35.989494 
	C43.213863,37.342838 44.213169,38.634769 44.714146,40.097393 
	C44.820839,40.408886 43.074741,41.905479 42.252831,41.847927 
	C41.178314,41.772690 39.209881,40.383511 39.301304,40.100208 
	C39.774170,38.634853 40.781628,37.342010 41.997581,35.989494 
z"
                />
                <path
                  fill="#DADADC"
                  opacity="1.000000"
                  stroke="none"
                  d="
M55.465431,41.638088 
	C55.098022,39.849434 54.845982,38.209778 55.211823,36.722065 
	C55.295719,36.380909 57.695133,36.165371 58.675228,36.633102 
	C59.418148,36.987656 60.184555,39.191174 59.930149,39.412968 
	C58.747818,40.443726 57.213512,41.070751 55.465431,41.638088 
z"
                />
                <path
                  fill="#D8D8D9"
                  opacity="1.000000"
                  stroke="none"
                  d="
M69.082794,38.211555 
	C70.685371,37.376350 72.210381,36.716316 73.752594,36.673302 
	C74.091545,36.663845 74.915184,38.923046 74.722694,39.995152 
	C74.581696,40.780437 72.677216,42.061466 72.364670,41.861546 
	C71.079262,41.039349 70.102013,39.735405 69.082794,38.211555 
z"
                />
                <path
                  fill="#D8D8D9"
                  opacity="1.000000"
                  stroke="none"
                  d="
M38.986446,51.000626 
	C40.339851,49.783905 41.631683,48.783852 43.094433,48.282845 
	C43.406620,48.175922 44.904343,49.921532 44.846840,50.743061 
	C44.771542,51.818768 43.381992,53.789436 43.099731,53.698215 
	C41.633549,53.224358 40.339760,52.217060 38.986446,51.000626 
z"
                />
                <path
                  fill="#DADADC"
                  opacity="1.000000"
                  stroke="none"
                  d="
M56.212437,53.925049 
	C55.375980,52.315056 54.703503,50.794796 54.670670,49.260845 
	C54.663128,48.908485 56.932701,48.076508 58.006657,48.272873 
	C58.815987,48.420853 60.130173,50.354618 59.941063,50.636875 
	C59.077038,51.926495 57.761860,52.913849 56.212437,53.925049 
z"
                />
                <path
                  fill="#D8D8D9"
                  opacity="1.000000"
                  stroke="none"
                  d="
M72.002739,48.011520 
	C73.221558,49.356190 74.239807,50.639351 74.706345,52.098869 
	C74.799919,52.391636 72.826347,53.788605 71.745972,53.868755 
	C70.924911,53.929661 69.170609,52.421650 69.278145,52.108543 
	C69.779579,50.648540 70.783684,49.361179 72.002739,48.011520 
z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {displayError && !disabled && (
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
