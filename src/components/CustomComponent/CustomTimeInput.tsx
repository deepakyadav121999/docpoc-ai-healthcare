"use client";
import React, { useState, useRef, useEffect } from "react";
// import { SVGIconProvider } from "@/constants/svgIconProvider";

interface CustomTimeInputProps {
  value: string;
  onChange: (time: string) => void;
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
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const CustomTimeInput: React.FC<CustomTimeInputProps> = ({
  value,
  onChange,
  placeholder = "Select Time",
  className = "",
  label = "Select Time",
  labelPlacement = "outside",
  color = "secondary",
  isRequired = false,
  errorMessage = "",
  isInvalid = false,
  disabled = false,
  startContent,
  endContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isTyping, setIsTyping] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const currentColorClass = isInvalid
    ? colorClasses.danger
    : colorClasses[color];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const formatTime = (hours: number, minutes: number): string => {
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const parseTime = (
    timeString: string,
  ): { hours: number; minutes: number } | null => {
    if (!timeString || timeString.trim() === "") {
      return null;
    }

    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = timeString.match(timeRegex);

    if (match) {
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      return { hours, minutes };
    }

    return null;
  };

  const handleManualInput = (inputValue: string) => {
    setInputValue(inputValue);

    const parsed = parseTime(inputValue);
    if (parsed) {
      onChange(formatTime(parsed.hours, parsed.minutes));
    }
  };

  const handleDigitalTimeSelect = (hours: number, minutes: number) => {
    const formattedTime = formatTime(hours, minutes);
    setInputValue(formattedTime);
    onChange(formattedTime);

    // Don't auto-close - let user manually close when ready
  };

  const generateDigitalTimeOptions = () => {
    const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
    const periods = ["AM", "PM"];

    return { hours, minutes, periods };
  };

  return (
    <div className={`relative w-full ${className}`} ref={pickerRef}>
      {/* Label */}
      {label && labelPlacement === "outside" && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative w-full">
        <input
          ref={inputRef}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full px-3 py-2 pr-10 border rounded-lg transition-all duration-200 text-base outline-none
            ${currentColorClass.bg} ${currentColorClass.text} 
            ${isInvalid ? "border-red-500 ring-red-200" : isOpen ? `${currentColorClass.focusBorder} ${currentColorClass.focusRing} ring-2` : currentColorClass.border}
          `}
          style={{
            fontSize: "16px",
            minHeight: "44px",
            height: "44px",
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
              handleManualInput(e.target.value);
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

        {/* Start Content */}
        {startContent && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {startContent}
          </div>
        )}

        {/* End Content - Time Picker Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {endContent}

          {/* Time Picker Icon */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!disabled) {
                setIsOpen(!isOpen);
              }
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            title="Time Picker"
          >
            <div className="w-4 h-4 text-purple-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12,6 12,12 16,14"></polyline>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="text-red-600 text-sm mt-1 px-1">{errorMessage}</div>
      )}

      {/* Time Picker Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl dark:shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Select Time</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Digital Clock View */}
          <div className="p-2 sm:p-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {/* Hours Column */}
              <div className="flex-1">
                <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  Hours
                </div>
                <div className="space-y-1 max-h-32 sm:max-h-40 overflow-y-auto">
                  {generateDigitalTimeOptions().hours.map((hour) => (
                    <button
                      key={hour}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const currentTime = parseTime(inputValue) || {
                          hours: 12,
                          minutes: 0,
                        };
                        const isPM = currentTime.hours >= 12;
                        const newHours = hour + (isPM ? 12 : 0);
                        handleDigitalTimeSelect(newHours, currentTime.minutes);
                      }}
                      className={`w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 ${(() => {
                        const currentTime = parseTime(inputValue);
                        if (!currentTime)
                          return "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300";
                        const displayHour = currentTime.hours % 12 || 12;
                        return hour === displayHour
                          ? "bg-purple-500 text-white hover:bg-purple-600"
                          : "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300";
                      })()}`}
                    >
                      {hour.toString().padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes Column */}
              <div className="flex-1">
                <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  Minutes
                </div>
                <div className="space-y-1 max-h-32 sm:max-h-40 overflow-y-auto">
                  {generateDigitalTimeOptions().minutes.map((minute) => (
                    <button
                      key={minute}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const currentTime = parseTime(inputValue) || {
                          hours: 12,
                          minutes: 0,
                        };
                        handleDigitalTimeSelect(currentTime.hours, minute);
                      }}
                      className={`w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 ${(() => {
                        const currentTime = parseTime(inputValue);
                        if (!currentTime)
                          return "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300";
                        return minute === currentTime.minutes
                          ? "bg-purple-500 text-white hover:bg-purple-600"
                          : "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300";
                      })()}`}
                    >
                      {minute.toString().padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>

              {/* AM/PM Column */}
              <div className="flex-1">
                <div className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                  AM/PM
                </div>
                <div className="space-y-1">
                  {generateDigitalTimeOptions().periods.map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const currentTime = parseTime(inputValue) || {
                          hours: 12,
                          minutes: 0,
                        };
                        let newHours = currentTime.hours;
                        if (period === "PM" && currentTime.hours < 12) {
                          newHours = currentTime.hours + 12;
                        } else if (period === "AM" && currentTime.hours >= 12) {
                          newHours = currentTime.hours - 12;
                        }
                        handleDigitalTimeSelect(newHours, currentTime.minutes);
                      }}
                      className={`w-full px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-lg transition-all duration-200 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 ${(() => {
                        const currentTime = parseTime(inputValue);
                        if (!currentTime)
                          return "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300";
                        const isPM = currentTime.hours >= 12;
                        const currentPeriod = isPM ? "PM" : "AM";
                        return period === currentPeriod
                          ? "bg-purple-500 text-white hover:bg-purple-600"
                          : "text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300";
                      })()}`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Done Button */}
            <div className="mt-3 sm:mt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTimeInput;
