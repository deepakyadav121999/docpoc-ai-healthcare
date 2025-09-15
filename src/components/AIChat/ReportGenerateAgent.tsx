"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, Textarea } from "@nextui-org/react";

interface ReportGenerateAgentProps {
  onGenerateReport: (input: string, files: File[]) => void;
  isGenerating?: boolean;
}

const ReportGenerateAgent: React.FC<ReportGenerateAgentProps> = ({
  onGenerateReport,
  isGenerating = false,
}) => {
  const [inputText, setInputText] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current) {
        clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB

    Array.from(files).forEach((file) => {
      const isValidType =
        file.type.startsWith("image/") || file.type === "application/pdf";
      const isValidSize = file.size <= maxSize;

      if (isValidType && isValidSize) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any existing timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Add a small delay to prevent flickering
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragOver(false);
    }, 100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear any existing timeout
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
    }

    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // const handleClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   fileInputRef.current?.click();
  // };

  const handleGenerate = () => {
    if (inputText.trim() || uploadedFiles.length > 0) {
      onGenerateReport(inputText, uploadedFiles);
      setInputText("");
      setUploadedFiles([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 sm:mb-4">
          📊 Report Generate Agent
        </h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-2">
          Generate comprehensive reports from text descriptions or uploaded
          documents
        </p>
      </div>

      {/* Input Area */}
      <div className="mb-4 sm:mb-6">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Describe what kind of report you need... (e.g., 'Generate a patient summary report for last month' or 'Create a financial report from the uploaded invoices')"
          minRows={3}
          maxRows={6}
          variant="bordered"
          color="primary"
          classNames={{
            base: "w-full",
            input: "text-xs sm:text-sm",
            inputWrapper:
              "border-gray-300 hover:border-gray-400 focus-within:border-blue-500",
          }}
        />
      </div>

      {/* File Upload Area */}
      <div
        className={`relative block w-full appearance-none rounded-lg sm:rounded-xl border border-dashed border-gray-4 bg-gray-2 px-2 sm:px-4 py-3 sm:py-4 dark:border-dark-3 dark:bg-dark-2 text-center transition-colors cursor-pointer hover:border-primary dark:hover:border-primary ${
          isDragOver ? "border-primary bg-blue-50 dark:bg-blue-900/20" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={(e) => handleFileUpload(e.target.files)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
        />

        <div className="flex flex-col items-center justify-center">
          <span className="flex h-10 w-10 sm:h-13.5 sm:w-13.5 items-center justify-center rounded-full border border-stroke bg-white dark:border-dark-3 dark:bg-gray-dark">
            <svg
              width="16"
              height="16"
              className="sm:w-5 sm:h-5"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99019 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82232 7.12794 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82232 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z"
                fill="#5750F1"
              />
              <path
                d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.2887 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.9271 4.67354 18.0279C5.39602 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0766 17.9271 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67418 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z"
                fill="#5750F1"
              />
            </svg>
          </span>
          <p className="mt-2 text-xs sm:text-body-sm font-medium">
            <span className="text-primary">Click to upload</span> or drag and
            drop
          </p>
          <p className="mt-1 text-xs sm:text-body-xs">
            Images and PDFs up to 10MB
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-3 sm:mt-4">
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2">
            Uploaded Files:
          </h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  {file.type.startsWith("image/") ? (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-gray-700 text-xs sm:text-sm truncate block">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="mt-6 sm:mt-8 text-center">
        <Button
          onClick={handleGenerate}
          disabled={
            (!inputText.trim() && uploadedFiles.length === 0) || isGenerating
          }
          color="primary"
          size="lg"
          className="w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold"
          isLoading={isGenerating}
          startContent={
            !isGenerating ? (
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clipRule="evenodd"
                />
              </svg>
            ) : undefined
          }
        >
          {isGenerating ? "Generating Report..." : "Generate Report"}
        </Button>
      </div>

      {/* Help Text */}
      <div className="mt-4 sm:mt-6 text-center px-2">
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          💡 <strong>Tip:</strong> You can provide text descriptions, upload
          documents, or both to generate comprehensive reports
        </p>
      </div>
    </div>
  );
};

export default ReportGenerateAgent;
