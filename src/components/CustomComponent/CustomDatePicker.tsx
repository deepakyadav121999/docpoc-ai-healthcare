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
  const [dropdownPosition, setDropdownPosition] = useState<"top" | "bottom">(
    "bottom",
  );

  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Calculate optimal dropdown position
  const calculateDropdownPosition = () => {
    if (!pickerRef.current || !inputRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Responsive height based on screen size
    const isSmallScreen = viewportWidth < 640; // sm breakpoint
    const dropdownHeight = isSmallScreen ? 240 : 280; // Smaller height for mobile

    const spaceBelow = viewportHeight - inputRect.bottom;
    const spaceAbove = inputRect.top;

    // Add buffer for better UX
    const buffer = 20;

    // If not enough space below but enough space above, position above
    if (
      spaceBelow < dropdownHeight + buffer &&
      spaceAbove > dropdownHeight + buffer
    ) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }
  };

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

  // Calculate position when opening
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        calculateDropdownPosition();
      }, 10);
    }
  }, [isOpen]);

  // Recalculate on window resize (real-time positioning)
  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        calculateDropdownPosition();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const formatDateDDMMYYYY = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const formatInputValue = (value: string): string => {
    // Remove all non-numeric characters except /
    let cleaned = value.replace(/[^\d/]/g, "");

    // Remove extra slashes
    cleaned = cleaned.replace(/\/+/g, "/");

    // Split by '/' and limit each part
    const parts = cleaned.split("/");

    if (parts.length === 1) {
      // Only day part
      if (parts[0].length > 2) {
        parts[0] = parts[0].substring(0, 2);
      }
      return parts[0];
    } else if (parts.length === 2) {
      // Day and month parts
      if (parts[0].length > 2) {
        parts[0] = parts[0].substring(0, 2);
      }
      if (parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
      }
      return `${parts[0]}/${parts[1]}`;
    } else if (parts.length >= 3) {
      // Day, month, and year parts
      if (parts[0].length > 2) {
        parts[0] = parts[0].substring(0, 2);
      }
      if (parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
      }
      if (parts[2].length > 4) {
        parts[2] = parts[2].substring(0, 4);
      }

      // Only return up to 3 parts (DD/MM/YYYY)
      return `${parts[0]}/${parts[1]}/${parts[2]}`;
    }

    return cleaned;
  };

  const parseManualDate = (dateString: string): Date | null => {
    // Handle DD/MM/YYYY format with strict validation
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
        // Additional check: ensure date is not in the future for DOB
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        if (date > today) {
          return null; // Reject future dates
        }

        return date;
      }
    }

    return null;
  };

  const handleManualDateInput = (value: string) => {
    // Allow empty input
    if (!value.trim()) {
      setSelectedDate(null);
      onChange(null);
      return;
    }

    // Only process complete dates (DD/MM/YYYY format)
    if (value.length === 10) {
      const parsedDate = parseManualDate(value);
      if (parsedDate && parsedDate <= maxDate) {
        setSelectedDate(parsedDate);
        setCurrentDate(parsedDate);
        onChange(parsedDate);
      } else if (parsedDate && parsedDate > maxDate) {
        // Date is valid but in the future - don't accept it
        console.log("Future date not allowed for date of birth");
      }
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
    if (date > maxDate) return;

    setSelectedDate(date);
    setCurrentDate(date);
    setInputValue(formatDateDDMMYYYY(date));
    onChange(date);
    setIsOpen(false);
    setView("calendar");
    setIsTyping(false);
  };

  // Fixed navigation handlers with proper event handling
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
    setCurrentDate(newDate);
  };

  const handleYearChange = (
    direction: "prev" | "next",
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleMonthSelect = (month: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
    setView("calendar");
  };

  const handleYearSelect = (year: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setView("calendar");
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

  const isDisabled = (date: Date | null): boolean => {
    if (!date) return false;
    return date > maxDate;
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Real input for focus/blur management */}
      <input
        ref={inputRef}
        placeholder="DD/MM/YYYY"
        className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-dark text-gray-900 dark:text-white cursor-pointer hover:border-purple-800 focus:border-purple-800 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition-all duration-200 text-base outline-none ${
          isOpen
            ? "border-purple-800 ring-2 ring-purple-200 dark:ring-purple-800"
            : "border-gray-300 dark:border-gray-600"
        }`}
        style={{
          fontSize: "16px",
          minHeight: "39px",
          height: "39px",
          touchAction: "manipulation",
        }}
        value={inputValue}
        readOnly={false}
        onFocus={() => {
          setIsTyping(false);
          setIsOpen(true);
        }}
        onClick={() => {
          // Always open calendar on click, even if input already has focus
          setIsTyping(false);
          setIsOpen(true);
        }}
        onChange={(e) => {
          setIsTyping(true);
          // Format and validate input as user types
          const formattedValue = formatInputValue(e.target.value);
          setInputValue(formattedValue);

          // Only try to parse if it looks like a complete date (DD/MM/YYYY)
          if (formattedValue.length === 10) {
            handleManualDateInput(formattedValue);
          } else if (formattedValue.length === 0) {
            // Handle empty input
            setSelectedDate(null);
            onChange(null);
          }
        }}
        onKeyDown={(e) => {
          // Allow navigation keys, backspace, delete
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

          // Allow numbers and forward slash
          const isNumberOrSlash = /^[0-9/]$/.test(e.key);

          if (!allowedKeys.includes(e.key) && !isNumberOrSlash) {
            e.preventDefault();
          }
        }}
        onBlur={(e) => {
          // Only close if not clicking on calendar elements
          const relatedTarget = e.relatedTarget as HTMLElement;
          if (!relatedTarget || !pickerRef.current?.contains(relatedTarget)) {
            if (!isTyping) {
              setTimeout(() => setIsOpen(false), 150);
            }
          }
        }}
        aria-label={placeholder}
      />

      {/* Calendar icon overlay - Updated design */}
      <div
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ zIndex: 2 }}
      >
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

      {/* Calendar Dropdown - Smart Positioning */}
      {isOpen && (
        <div
          className={`absolute left-0 w-56 sm:w-64 md:w-80 bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl dark:shadow-2xl z-[9999] overflow-hidden max-h-[60vh] sm:max-h-none ${
            dropdownPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
          }`}
        >
          {/* Header */}
          <div className="p-2 sm:p-4 bg-gradient-to-r">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  type="button"
                  onClick={(e) => handleViewChange("month", e)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold hover:bg-white/20 rounded-lg transition-colors"
                >
                  {months[currentDate.getMonth()]}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleViewChange("year", e)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="px-1 sm:px-2 md:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold hover:bg-white/20 rounded-lg transition-colors"
                >
                  {currentDate.getFullYear()}
                </button>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={(e) =>
                    view === "calendar"
                      ? handleMonthChange("prev", e)
                      : handleYearChange("prev", e)
                  }
                  onMouseDown={(e) => e.preventDefault()}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4 "
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
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg
                    className="w-4 h-4 "
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
          <div className="p-2 sm:p-4">
            {view === "calendar" && (
              <div>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-0.5 sm:mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-0.5 sm:py-1"
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
                      disabled={!date || isDisabled(date)}
                      className={` 
                         w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-xs sm:text-sm rounded-full transition-all duration-200 flex items-center justify-center font-medium
                          ${!date ? "invisible" : ""}
                          ${isToday(date!) && !isSelected(date!) ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 ring-1 ring-purple-300 dark:ring-purple-700" : ""}
                          ${isSelected(date!) ? "bg-purple-500 text-white shadow-lg transform scale-105" : ""}
                          ${!isSelected(date!) && !isToday(date!) && date ? "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300" : ""}
                          ${isDisabled(date!) ? "text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50" : ""}
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
              <div className="grid grid-cols-3 gap-2">
                {monthRange.map((month) => (
                  <button
                    type="button"
                    key={month}
                    onClick={(e) => handleMonthSelect(month, e)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`
                    px-1.5   sm:px-3 py-2.5 text-xs sm:text-sm rounded-lg transition-all duration-200 font-medium
                      ${currentDate.getMonth() === month ? "bg-purple-500 text-white shadow-md transform scale-105" : "hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300"}
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
                    type="button"
                    key={year}
                    onClick={(e) => handleYearSelect(year, e)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`
                      px-1.5 sm:px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium
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

export default CustomDatePicker;
