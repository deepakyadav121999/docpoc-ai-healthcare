import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { Spinner } from "@nextui-org/react";
import { useRef } from "react";
import EnhancedModal from "../common/Modal/EnhancedModal";

interface VisitData {
  key?: string;
  date: string;
  doctor?: string;
  name?: string;
  report?: string;
  url?: string;
  code?: string;
  amount?: number;
  id?: string; // Added for reports
  reportType?: string; // Added for reports
}

interface VisitHistoryTableProps {
  patientId: string;
  viewMode: string; // "history" or "documents"
  uploadedDocuments: VisitData[];
  onDocumentNameUpdate?: (item: VisitData, newName: string) => void;
  onReceiptNameUpdate?: (item: VisitData, newName: string) => void;
}

const API_URL = process.env.API_URL;

const TABS = [
  { label: "Documents", value: "documents" },
  { label: "Reports", value: "reports" },
  { label: "Receipts", value: "receipts" },
];

export const VisitHistoryTable: React.FC<VisitHistoryTableProps> = ({
  patientId,
  viewMode,
  uploadedDocuments = [],
  // onDocumentNameUpdate,
  // onReceiptNameUpdate,
}) => {
  const [page, setPage] = useState<number>(1);
  const [filterValue, setFilterValue] = useState<string>("");
  const [rowsPerPage] = useState<number>(3);
  const [tab, setTab] = useState<string>("documents");

  const [tableData, setTableData] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const editInputRef = useRef<HTMLInputElement>(null);

  // Add modal state at the top of the component
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<{
    success?: string;
    error?: string;
  }>({});

  // Focus the input when editingRow changes
  useEffect(() => {
    if (editingRow !== null && editInputRef.current) {
      editInputRef.current.focus();
      // Additional scroll handling for mobile
      setTimeout(() => {
        if (editInputRef.current) {
          editInputRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 200);
    }
  }, [editingRow]);

  // Helper to format date
  const formatDateToDDMMYYYY = (dateTimeString: string): string => {
    if (!dateTimeString || dateTimeString === "N/A") return "N/A";
    const dateObj = new Date(dateTimeString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const DOCUMENT_BASE_URL =
    "https://docpoc-assets.s3.ap-south-1.amazonaws.com/";

  // Parse uploadedDocuments for "documents" tab
  const parseDocuments = (docs: any): VisitData[] => {
    if (!docs) return [];
    if (Array.isArray(docs)) return docs;
    let docObj;
    try {
      docObj = typeof docs === "string" ? JSON.parse(docs) : docs;
    } catch {
      return [];
    }
    return Object.entries(docObj).map(([key, value]: any) => {
      let parsedValue;
      try {
        parsedValue = typeof value === "string" ? JSON.parse(value) : value;
      } catch {
        parsedValue = value;
      }

      let url = "";
      if (parsedValue.url && typeof parsedValue.url === "string") {
        url = parsedValue.url;
      } else if (parsedValue.report && typeof parsedValue.report === "string") {
        if (parsedValue.report.startsWith("http")) {
          url = parsedValue.report;
        } else if (
          parsedValue.report.endsWith(".pdf") ||
          parsedValue.report.endsWith(".jpg") ||
          parsedValue.report.endsWith(".jpeg") ||
          parsedValue.report.endsWith(".png")
        ) {
          url = DOCUMENT_BASE_URL + parsedValue.report;
        }
      } else if (
        parsedValue.report &&
        typeof parsedValue.report === "object" &&
        parsedValue.report.url
      ) {
        url = parsedValue.report.url;
      }

      const name = parsedValue.name || parsedValue.doctor || key;

      return {
        key, // Add key here
        name,
        date: formatDateToDDMMYYYY(parsedValue.date),
        url,
        report: parsedValue.report,
      };
    });
  };

  // Fetch reports
  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint = `${API_URL}/reports/patient/${patientId}`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.map((item: any) => {
        let url = "";
        try {
          url = item.documentUrl ? JSON.parse(item.documentUrl).url : "";
        } catch {
          url = "";
        }
        return {
          name: item.name || item.reportType || "Report",
          date: formatDateToDDMMYYYY(item.reportDate),
          url,
          id: item.id, // Add id
          reportType: item.reportType, // Add reportType
        };
      });
      setTableData(data);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to load reports.");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch receipts
  const fetchReceipts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint = `${API_URL}/payments/patient/${patientId}`;
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.map((item: any) => {
        let url = "";
        try {
          url = item.receiptUrl ? JSON.parse(item.receiptUrl).url : "";
        } catch {
          url = "";
        }
        return {
          code: item.code,
          date: formatDateToDDMMYYYY(item.paymentDate),
          amount: item.amount,
          url,
        };
      });
      setTableData(data);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Failed to load receipts.");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // Update document name in backend (now implemented)
  const updateDocumentNameInBackend = async (idx: number, newName: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      // Fetch current patient data to get the full documents array
      const patientRes = await axios.get(`${API_URL}/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const documents = patientRes.data.documents;
      let docArr: any[] = [];
      try {
        docArr =
          typeof documents === "string" ? JSON.parse(documents) : documents;
      } catch {
        docArr = [];
      }
      // Update the name at the correct index
      if (Array.isArray(docArr) && docArr[idx]) {
        docArr[idx].name = newName;
        docArr[idx].doctor = newName;
      }
      // PATCH the updated documents array
      await axios.patch(
        `${API_URL}/patient`,
        {
          id: patientId,
          documents: JSON.stringify(docArr),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Update local tableData
      setTableData((prev) =>
        prev.map((doc, i) =>
          i === idx ? { ...doc, name: newName, doctor: newName } : doc,
        ),
      );
      setEditingRow(null);
      setModalMessage({ success: "Document name updated successfully!" });
      setModalOpen(true);
    } catch (err) {
      console.log(err);
      setModalMessage({
        error: "Failed to update document name. Please try again.",
      });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Add updateReportNameInBackend function:
  const updateReportNameInBackend = async (idx: number, newName: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      // Get the report id and reportType from tableData[idx]
      const report = tableData[idx];
      if (!report || !report.id || !report.reportType)
        throw new Error("Missing report id or type");
      await axios.patch(
        `${API_URL}/reports/${report.id}`,
        {
          id: report.id,
          reportType: report.reportType,
          name: newName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Update local tableData
      setTableData((prev) =>
        prev.map((doc, i) => (i === idx ? { ...doc, name: newName } : doc)),
      );
      setEditingRow(null);
      setModalMessage({ success: "Report name updated successfully!" });
      setModalOpen(true);
    } catch (err) {
      console.log(err);
      setModalMessage({
        error: "Failed to update report name. Please try again.",
      });
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Main effect for tab switching
  useEffect(() => {
    setPage(1);
    setError(null);
    if (tab === "documents") {
      setLoading(false);
      setTableData(parseDocuments(uploadedDocuments));
    } else if (tab === "reports") {
      fetchReports();
    } else if (tab === "receipts") {
      fetchReceipts();
    }
    // eslint-disable-next-line
  }, [tab, uploadedDocuments, patientId]);

  // For history mode, keep old logic
  useEffect(() => {
    if (viewMode === "history" && patientId) {
      setTab("");
      setLoading(true);
      setError(null);
      const fetchVisitData = async () => {
        const token = localStorage.getItem("docPocAuth_token");
        const endpoint = `${API_URL}/appointment/visits/patient/${patientId}`;
        try {
          const response = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const formattedData = response.data.map((item: any) => ({
            date: formatDateToDDMMYYYY(item.dateTime),
            doctor: item.doctorName,
            report: "#",
          }));
          setTableData(formattedData);
        } catch (error: any) {
          setError(error?.response?.data?.message || "Failed to load data.");
          setTableData([]);
        } finally {
          setLoading(false);
        }
      };
      fetchVisitData();
    }
  }, [viewMode, patientId]);

  // Filtering
  const filteredData = useMemo(() => {
    const lowerCaseFilter = filterValue.toLowerCase();
    return tableData.filter((row) => {
      return (
        (row.name && row.name.toLowerCase().includes(lowerCaseFilter)) ||
        (row.code && row.code.toLowerCase().includes(lowerCaseFilter)) ||
        (row.date && row.date.toLowerCase().includes(lowerCaseFilter)) ||
        (row.doctor && row.doctor.toLowerCase().includes(lowerCaseFilter))
      );
    });
  }, [filterValue, tableData]);

  const pages = Math.ceil(filteredData.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredData.slice(start, end);
  }, [page, filteredData, rowsPerPage]);

  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  // Table columns based on tab
  let columns: { key: string; label: string }[] = [];
  if (viewMode === "history") {
    columns = [
      { key: "date", label: "DATE" },
      { key: "doctor", label: "NAME" },
      { key: "report", label: "REPORT" },
    ];
  } else if (tab === "documents") {
    columns = [
      { key: "name", label: "DOCUMENT" },
      { key: "date", label: "DATE" },
      { key: "url", label: "VIEW" },
    ];
  } else if (tab === "reports") {
    columns = [
      { key: "name", label: "REPORT" },
      { key: "date", label: "DATE" },
      { key: "url", label: "VIEW" },
    ];
  } else if (tab === "receipts") {
    columns = [
      { key: "code", label: "RECEIPT" },
      { key: "date", label: "DATE" },
      { key: "amount", label: "AMOUNT" },
      { key: "url", label: "VIEW" },
    ];
  }

  // Empty state messages
  let emptyMsg = "No data found.";
  if (viewMode === "history") emptyMsg = "No previous visits found.";
  else if (tab === "documents") emptyMsg = "No uploaded documents found.";
  else if (tab === "reports") emptyMsg = "No reports found.";
  else if (tab === "receipts") emptyMsg = "No receipts found.";

  return (
    <>
      <style jsx>{`
        /* Mobile-specific styles for edit input fields */
        @media (max-width: 768px) {
          .edit-input-container {
            position: relative;
            z-index: 10;
          }

          .edit-input-container input:focus {
            position: relative;
            z-index: 20;
            background: white !important;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            min-width: 120px !important;
          }

          /* Ensure the table cell can accommodate the input */
          .table-cell-edit {
            min-width: 140px;
            position: relative;
          }
        }

        /* Ensure smooth scrolling behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      <div className="flex w-full justify-between items-center mb-4">
        {/* Only show dropdown for documents mode, not for history mode */}
        {viewMode !== "history" && (
          <Select
            selectedKeys={[tab]}
            onSelectionChange={(keys) => setTab(Array.from(keys)[0] as string)}
            className="max-w-xs"
            aria-label="Select document type"
          >
            {TABS.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </Select>
        )}
        <Input
          isClearable
          className={`${viewMode === "history" ? "w-full" : "w-full max-w-[97%] sm:max-w-md"}`}
          placeholder={`Search by ${tab === "receipts" ? "code/date/amount" : "name/date"}..`}
          startContent={<SVGIconProvider iconName="search" />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={(value) => onSearchChange(value as string)}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          {tab === "documents"
            ? "No uploaded documents found."
            : tab === "reports"
              ? "No reports found."
              : tab === "receipts"
                ? "No receipts found."
                : emptyMsg}
        </div>
      ) : (
        <Table
          aria-label="Patient Data Table"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px] max-w-[95%] sm:max-w-[100%] mx-auto",
          }}
        >
          <TableHeader>
            {columns.map((col) => (
              <TableColumn key={col.key}>{col.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {items.map((item, idx) => {
              // Calculate the real index in tableData for editingRow logic
              const realIdx = (page - 1) * rowsPerPage + idx;
              return (
                <TableRow key={realIdx}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={col.key === "name" ? "table-cell-edit" : ""}
                    >
                      {col.key === "name" && tab === "documents" ? (
                        <div className="flex items-center gap-2 edit-input-container">
                          <input
                            ref={
                              editingRow === String(realIdx)
                                ? editInputRef
                                : undefined
                            }
                            value={
                              editingRow === String(realIdx)
                                ? editValue
                                : item.name || ""
                            }
                            disabled={editingRow !== String(realIdx)}
                            onChange={(e) => {
                              if (editingRow === String(realIdx))
                                setEditValue(e.target.value);
                            }}
                            className={
                              editingRow === String(realIdx)
                                ? "border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                                : "border-none bg-transparent text-sm cursor-default focus:outline-none focus:ring-0 px-2 py-1"
                            }
                            style={{ minWidth: 80 }}
                          />
                          {editingRow === String(realIdx) ? (
                            <>
                              {editValue !== item.name &&
                                editValue.trim() !== "" && (
                                  <button
                                    onClick={() =>
                                      updateDocumentNameInBackend(
                                        realIdx,
                                        editValue,
                                      )
                                    }
                                    className="text-green-600 font-bold px-2"
                                  >
                                    Save
                                  </button>
                                )}
                              <button
                                onClick={() => setEditingRow(null)}
                                className="text-gray-400 px-2"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingRow(String(realIdx));
                                setEditValue(item.name || "");
                                setTimeout(() => {
                                  if (editInputRef.current) {
                                    editInputRef.current.focus();
                                    // Scroll the input into view on mobile
                                    editInputRef.current.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                      inline: "nearest",
                                    });
                                  }
                                }, 150);
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <SVGIconProvider iconName="edit" />
                            </button>
                          )}
                        </div>
                      ) : col.key === "name" && tab === "reports" ? (
                        <div className="flex items-center gap-2 edit-input-container">
                          <input
                            ref={
                              editingRow === `report-${realIdx}`
                                ? editInputRef
                                : undefined
                            }
                            value={
                              editingRow === `report-${realIdx}`
                                ? editValue
                                : item.name || ""
                            }
                            disabled={editingRow !== `report-${realIdx}`}
                            onChange={(e) => {
                              if (editingRow === `report-${realIdx}`)
                                setEditValue(e.target.value);
                            }}
                            className={
                              editingRow === `report-${realIdx}`
                                ? "border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                                : "border-none bg-transparent text-sm cursor-default focus:outline-none focus:ring-0 px-2 py-1"
                            }
                            style={{ minWidth: 80 }}
                          />
                          {editingRow === `report-${realIdx}` ? (
                            <>
                              {editValue !== item.name &&
                                editValue.trim() !== "" && (
                                  <button
                                    onClick={() =>
                                      updateReportNameInBackend(
                                        realIdx,
                                        editValue,
                                      )
                                    }
                                    className="text-green-600 font-bold px-2"
                                  >
                                    Save
                                  </button>
                                )}
                              <button
                                onClick={() => setEditingRow(null)}
                                className="text-gray-400 px-2"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingRow(`report-${realIdx}`);
                                setEditValue(item.name || "");
                                setTimeout(() => {
                                  if (editInputRef.current) {
                                    editInputRef.current.focus();
                                    // Scroll the input into view on mobile
                                    editInputRef.current.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                      inline: "nearest",
                                    });
                                  }
                                }, 150);
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <SVGIconProvider iconName="edit" />
                            </button>
                          )}
                        </div>
                      ) : col.key === "url" ? (
                        item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <SVGIconProvider iconName="eye" />
                          </a>
                        ) : (
                          "-"
                        )
                      ) : (
                        getKeyValue(item, col.key)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <EnhancedModal
        isOpen={modalOpen}
        loading={false}
        modalMessage={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};
