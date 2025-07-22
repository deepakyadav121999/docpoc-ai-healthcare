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

interface VisitData {
  key?: string;
  date: string;
  doctor?: string;
  name?: string;
  report?: string;
  url?: string;
  code?: string;
  amount?: number;
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

  // Focus the input when editingRow changes
  useEffect(() => {
    if (editingRow && editInputRef.current) {
      editInputRef.current.focus();
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

  // Update document name in backend (placeholder)
  const updateDocumentNameInBackend = async (
    item: VisitData,
    newName: string,
  ) => {
    // TODO: Implement PATCH to backend to update document name in patient documents JSON
    // Example: await axios.patch(`${API_URL}/patient`, { id: patientId, documents: ... })
    setTableData((prev) =>
      prev.map((doc) =>
        doc.key === item.key ? { ...doc, name: newName, doctor: newName } : doc,
      ),
    );
    setEditingRow(null);
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
      {viewMode !== "history" && (
        <div className="flex w-full justify-between items-center mb-4">
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
          <Input
            isClearable
            className="w-full max-w-[97%] sm:max-w-md"
            placeholder={`Search by ${tab === "receipts" ? "code/date/amount" : "name/date"}..`}
            startContent={<SVGIconProvider iconName="search" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={(value) => onSearchChange(value as string)}
          />
        </div>
      )}
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
          {emptyMsg}
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
          <TableBody items={tableData}>
            {(item: VisitData) => (
              <TableRow key={item.key || item.name || item.code || item.date}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.key === "name" && tab === "documents" ? (
                      <div className="flex items-center gap-2">
                        <input
                          value={
                            editingRow === item.key
                              ? editValue
                              : item.name || ""
                          }
                          disabled={editingRow !== item.key}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                          style={{ minWidth: 80 }}
                        />
                        {editingRow === item.key ? (
                          <>
                            {editValue !== item.name &&
                              editValue.trim() !== "" && (
                                <button
                                  onClick={() =>
                                    updateDocumentNameInBackend(item, editValue)
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
                              setEditingRow(item.key || "");
                              setEditValue(item.name || "");
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <SVGIconProvider iconName="edit" />
                          </button>
                        )}
                      </div>
                    ) : col.key === "name" && tab === "reports" ? (
                      <span>{item.name}</span>
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
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
};
