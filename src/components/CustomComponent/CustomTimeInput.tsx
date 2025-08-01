"use client";
import React, { useState, useRef, useEffect } from "react";
// import { SVGIconProvider } from "@/constants/svgIconProvider";

// Add CSS for animations
const clockStyles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

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
  //   variant = "bordered",
  color = "secondary",
  isRequired = false,
  errorMessage = "",
  isInvalid = false,
  disabled = false,
  startContent,
  endContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<"digital" | "analog">("digital");
  const [inputValue, setInputValue] = useState(value);
  const [isTyping, setIsTyping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<"hour" | "minute" | null>(null);

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
        setView("digital");
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
    setIsOpen(false);
    setView("digital");
  };

  //   const handleAnalogTimeSelect = (hours: number, minutes: number) => {
  //     const formattedTime = formatTime(hours, minutes);
  //     setInputValue(formattedTime);
  //     onChange(formattedTime);
  //     setIsOpen(false);
  //     setView("digital");
  //   };

  const generateDigitalTimeOptions = () => {
    const hours = Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i));
    const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
    const periods = ["AM", "PM"];

    return { hours, minutes, periods };
  };

  const getAnalogClockPosition = (hours: number, minutes: number) => {
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;
    const minuteAngle = minutes * 6;

    const hourRadius = 60;
    const minuteRadius = 80;

    const hourX = Math.sin(((hourAngle - 90) * Math.PI) / 180) * hourRadius;
    const hourY = Math.cos(((hourAngle - 90) * Math.PI) / 180) * hourRadius;

    const minuteX =
      Math.sin(((minuteAngle - 90) * Math.PI) / 180) * minuteRadius;
    const minuteY =
      Math.cos(((minuteAngle - 90) * Math.PI) / 180) * minuteRadius;

    return { hourX, hourY, minuteX, minuteY };
  };

  const handleAnalogClockMouseDown = (
    event: React.MouseEvent<SVGSVGElement>,
  ) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const clickX = event.clientX - rect.left - centerX;
    const clickY = event.clientY - rect.top - centerY;

    const distance = Math.sqrt(clickX * clickX + clickY * clickY);

    if (distance > 30 && distance < 90) {
      setIsDragging(true);
      if (distance > 60) {
        setDragType("minute");
      } else {
        setDragType("hour");
      }
    }
  };

  const handleAnalogClockMouseMove = (
    event: React.MouseEvent<SVGSVGElement>,
  ) => {
    if (!isDragging || !dragType) return;

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const mouseX = event.clientX - rect.left - centerX;
    const mouseY = event.clientY - rect.top - centerY;

    const angle = (Math.atan2(mouseY, mouseX) * 180) / Math.PI + 90;
    const normalizedAngle = angle < 0 ? angle + 360 : angle;

    const currentTime = parseTime(inputValue) || { hours: 12, minutes: 0 };

    if (dragType === "minute") {
      const minutes = Math.round(normalizedAngle / 6) % 60;
      const formattedTime = formatTime(currentTime.hours, minutes);
      setInputValue(formattedTime);
      onChange(formattedTime);
    } else {
      const hours = Math.round(normalizedAngle / 30) % 12;
      const isPM = currentTime.hours >= 12;
      const newHours = hours + (isPM ? 12 : 0);
      const formattedTime = formatTime(newHours, currentTime.minutes);
      setInputValue(formattedTime);
      onChange(formattedTime);
    }
  };

  const handleAnalogClockMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", handleAnalogClockMouseUp);
      document.addEventListener("mousemove", (e) => {
        if (isDragging && dragType) {
          const rect = pickerRef.current?.getBoundingClientRect();
          if (rect) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const mouseX = e.clientX - rect.left - centerX;
            const mouseY = e.clientY - rect.top - centerY;

            const angle = (Math.atan2(mouseY, mouseX) * 180) / Math.PI + 90;
            const normalizedAngle = angle < 0 ? angle + 360 : angle;

            const currentTime = parseTime(inputValue) || {
              hours: 12,
              minutes: 0,
            };

            if (dragType === "minute") {
              const minutes = Math.round(normalizedAngle / 6) % 60;
              const formattedTime = formatTime(currentTime.hours, minutes);
              setInputValue(formattedTime);
              onChange(formattedTime);
            } else {
              const hours = Math.round(normalizedAngle / 30) % 12;
              const isPM = currentTime.hours >= 12;
              const newHours = hours + (isPM ? 12 : 0);
              const formattedTime = formatTime(newHours, currentTime.minutes);
              setInputValue(formattedTime);
              onChange(formattedTime);
            }
          }
        }
      });
      return () => {
        document.removeEventListener("mouseup", handleAnalogClockMouseUp);
      };
    }
  }, [isDragging, dragType, inputValue, onChange]);

  const currentTime = parseTime(inputValue) || { hours: 12, minutes: 0 };
  const { hourX, hourY, minuteX, minuteY } = getAnalogClockPosition(
    currentTime.hours,
    currentTime.minutes,
  );

  return (
    <div className={`relative w-full ${className}`} ref={pickerRef}>
      <style>{clockStyles}</style>
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
                if (!isOpen) {
                  setView("digital");
                  setIsOpen(true);
                } else if (view === "digital") {
                  setView("analog");
                } else {
                  setIsOpen(false);
                }
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
        <div className="absolute top-full left-0 mt-2 w-full max-w-xs sm:max-w-sm md:max-w-md bg-white dark:bg-gray-dark border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl dark:shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {view === "digital" ? "Select Time" : "Analog Clock"}
                </span>
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
          {view === "digital" && (
            <div className="p-4">
              <div className="flex space-x-4">
                {/* Hours Column */}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hours
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
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
                          handleDigitalTimeSelect(
                            newHours,
                            currentTime.minutes,
                          );
                        }}
                        className="w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300"
                      >
                        {hour.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minutes Column */}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minutes
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
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
                        className="w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300"
                      >
                        {minute.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AM/PM Column */}
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                          } else if (
                            period === "AM" &&
                            currentTime.hours >= 12
                          ) {
                            newHours = currentTime.hours - 12;
                          }
                          handleDigitalTimeSelect(
                            newHours,
                            currentTime.minutes,
                          );
                        }}
                        className="w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-300"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analog Clock View */}
          {view === "analog" && (
            <div className="p-4">
              <div className="flex justify-center">
                <div className="relative">
                  {/* Outer glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full blur-lg opacity-20"></div>

                  <svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    className={`cursor-pointer relative z-10 ${isDragging ? "select-none" : ""}`}
                    onMouseDown={handleAnalogClockMouseDown}
                    onMouseMove={handleAnalogClockMouseMove}
                    onClick={(e) => {
                      if (!isDragging) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;

                        const clickX = e.clientX - rect.left - centerX;
                        const clickY = e.clientY - rect.top - centerY;

                        const distance = Math.sqrt(
                          clickX * clickX + clickY * clickY,
                        );

                        if (distance > 30 && distance < 90) {
                          const angle =
                            (Math.atan2(clickY, clickX) * 180) / Math.PI + 90;
                          const normalizedAngle =
                            angle < 0 ? angle + 360 : angle;

                          const currentTime = parseTime(inputValue) || {
                            hours: 12,
                            minutes: 0,
                          };

                          if (distance > 60) {
                            // Minute hand
                            const minutes =
                              Math.round(normalizedAngle / 6) % 60;
                            const formattedTime = formatTime(
                              currentTime.hours,
                              minutes,
                            );
                            setInputValue(formattedTime);
                            onChange(formattedTime);
                          } else {
                            // Hour hand
                            const hours = Math.round(normalizedAngle / 30) % 12;
                            const isPM = currentTime.hours >= 12;
                            const newHours = hours + (isPM ? 12 : 0);
                            const formattedTime = formatTime(
                              newHours,
                              currentTime.minutes,
                            );
                            setInputValue(formattedTime);
                            onChange(formattedTime);
                          }
                        }
                      }
                    }}
                  >
                    {/* Clock face with gradient */}
                    <defs>
                      <linearGradient
                        id="clockFace"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#f8fafc" />
                        <stop offset="100%" stopColor="#e2e8f0" />
                      </linearGradient>
                      <linearGradient
                        id="hourHand"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#374151" />
                        <stop offset="100%" stopColor="#1f2937" />
                      </linearGradient>
                      <linearGradient
                        id="minuteHand"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#6b7280" />
                        <stop offset="100%" stopColor="#4b5563" />
                      </linearGradient>
                      <linearGradient
                        id="activeHand"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>

                    {/* Clock face */}
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="url(#clockFace)"
                      stroke="#cbd5e1"
                      strokeWidth="3"
                    />

                    {/* Inner circle for depth */}
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />

                    {/* Hour markers with better styling */}
                    {Array.from({ length: 12 }, (_, i) => {
                      const angle = ((i * 30 - 90) * Math.PI) / 180;
                      const x1 = 100 + 70 * Math.cos(angle);
                      const y1 = 100 + 70 * Math.sin(angle);
                      const x2 = 100 + 80 * Math.cos(angle);
                      const y2 = 100 + 80 * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#94a3b8"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      );
                    })}

                    {/* Minute markers */}
                    {Array.from({ length: 60 }, (_, i) => {
                      if (i % 5 === 0) return null; // Skip hour markers
                      const angle = ((i * 6 - 90) * Math.PI) / 180;
                      const x1 = 100 + 75 * Math.cos(angle);
                      const y1 = 100 + 75 * Math.sin(angle);
                      const x2 = 100 + 80 * Math.cos(angle);
                      const y2 = 100 + 80 * Math.sin(angle);
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="#cbd5e1"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Hour numbers with better styling */}
                    {Array.from({ length: 12 }, (_, i) => {
                      const angle = ((i * 30 - 90) * Math.PI) / 180;
                      const x = 100 + 60 * Math.cos(angle);
                      const y = 100 + 60 * Math.sin(angle);
                      const number = i === 0 ? 12 : i;
                      return (
                        <text
                          key={i}
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-sm font-bold fill-gray-700 dark:fill-gray-300"
                          style={{ fontSize: "14px", fontWeight: "600" }}
                        >
                          {number}
                        </text>
                      );
                    })}

                    {/* Hour hand with shadow */}
                    <line
                      x1="100"
                      y1="100"
                      x2={100 + hourX}
                      y2={100 + hourY}
                      stroke={
                        dragType === "hour"
                          ? "url(#activeHand)"
                          : "url(#hourHand)"
                      }
                      strokeWidth="4"
                      strokeLinecap="round"
                      filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
                    />

                    {/* Minute hand with shadow */}
                    <line
                      x1="100"
                      y1="100"
                      x2={100 + minuteX}
                      y2={100 + minuteY}
                      stroke={
                        dragType === "minute"
                          ? "url(#activeHand)"
                          : "url(#minuteHand)"
                      }
                      strokeWidth="3"
                      strokeLinecap="round"
                      filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))"
                    />

                    {/* Center dot with gradient */}
                    <circle cx="100" cy="100" r="4" fill="url(#activeHand)" />
                    <circle cx="100" cy="100" r="2" fill="white" />

                    {/* Dragging indicator with animation */}
                    {isDragging && (
                      <circle
                        cx="100"
                        cy="100"
                        r="85"
                        fill="none"
                        stroke="url(#activeHand)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.6"
                        style={{ animation: "spin 2s linear infinite" }}
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* Current time display with better styling */}
              <div className="text-center mt-6">
                <div className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  {formatTime(currentTime.hours, currentTime.minutes)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  {isDragging
                    ? `Drag to set ${dragType === "hour" ? "hour" : "minute"}`
                    : "Click or drag the hands to set time"}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomTimeInput;
