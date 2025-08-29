"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Selection,
  Spinner,
  Input,
  DatePicker,
} from "@nextui-org/react";
import { columns, statusOptions } from "./data";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { SearchIcon } from "../CalenderBox/SearchIcon";
import { CalendarDate, parseDate } from "@internationalized/date";
import { getLocalTimeZone } from "@internationalized/date";
import debounce from "lodash.debounce";
import type { DebouncedFunc } from "lodash";

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "doctorName",
  "reportDate",
  "note",
  "report",
];

interface Report {
  id: string;
  patientName: string;
  doctorName: string;
  reportDate: string;
  name: string;
  documentUrl: string;
  additionalNotes?: string;
  [key: string]: any;
}

export default function ReportDataTable() {
  const profile = useSelector((state: RootState) => state.profile.data);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter] = useState<Selection>("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateShow, setSelectedDateShow] = useState<string | null>(null);

  const API_URL = process.env.API_URL;
  const hasSearchFilter = Boolean(filterValue);

  const debouncedFetchRef =
    useRef<DebouncedFunc<(searchValue: string) => void>>();
  const debouncedDateFetchRef =
    useRef<DebouncedFunc<(date: string | null) => void>>();

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const branchId = profile?.branchId;

      if (!branchId) {
        throw new Error("Branch ID not available");
      }

      // Set default date range (adjust as needed)
      let fromDate = "2022-01-01T05:19:15.544Z";
      let toDate = "3000-05-02T05:19:15.545Z";

      // Use selected date if available
      if (selectedDate) {
        fromDate = selectedDate;
        toDate = selectedDate;
      }

      const endpoint = `${API_URL}/reports/list/${branchId}`;

      const params: any = {
        page,
        pageSize: rowsPerPage,
        from: fromDate,
        to: toDate,
        reportType: ["MEDICAL_REPORT", "INVOICE"],
      };

      // Add search filter if available - fix the condition
      if (filterValue) {
        params.name = filterValue;
      }

      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setReports(response.data.rows || []);
      setTotalCount(response.data.count || 0);
    } catch (err) {
      // setError("Failed to fetch reports");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, profile?.branchId, selectedDate, filterValue]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Initialize debounced search - fix the implementation
  useEffect(() => {
    debouncedFetchRef.current = debounce((searchValue: string) => {
      setFilterValue(searchValue);
      setPage(1);
      // Don't call fetchReports here, let the useEffect handle it
    }, 500);

    return () => {
      debouncedFetchRef.current?.cancel();
    };
  }, []);

  // Initialize debounced date filtering - fix the implementation
  useEffect(() => {
    debouncedDateFetchRef.current = debounce((date: string | null) => {
      setSelectedDate(date);
      setPage(1);
      // Don't call fetchReports here, let the useEffect handle it
    }, 500);

    return () => {
      debouncedDateFetchRef.current?.cancel();
    };
  }, []);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredReports = [...reports];

    if (hasSearchFilter) {
      filteredReports = filteredReports.filter((report) =>
        report.patientName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredReports = filteredReports.filter((report) =>
        Array.from(statusFilter).includes(report.status),
      );
    }

    return filteredReports;
  }, [reports, filterValue, statusFilter]);

  const pages = Math.ceil(totalCount / rowsPerPage) || 1;

  const renderCell = useCallback((report: Report, columnKey: React.Key) => {
    const cellValue = report[columnKey as keyof Report];

    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {/* {report.name} */}
              {report.patientName}
            </p>
            {/* <p className="text-bold text-tiny capitalize text-default-400">
              {report.patientName}
            </p> */}
          </div>
        );
      case "doctorName":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {report.doctorName}
            </p>
            {/* <p className="text-bold text-tiny capitalize text-default-400">
            {report.doctorName}
            </p> */}
          </div>
        );
      case "reportDate":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {new Date(report.reportDate).toLocaleDateString()}
            </p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {new Date(report.reportDate).toLocaleTimeString()}
            </p>
          </div>
        );
      // case "note":
      //   return (
      //     <div className="flex flex-col">
      //       <p className="text-bold text-small capitalize">
      //         {report.additionalNotes || "N/A"}
      //       </p>
      //     </div>
      //   );

      case "note":
        const note = report.additionalNotes || "N/A";
        const truncatedNote =
          note.length > 10 ? `${note.substring(0, 10)}...` : note;
        return (
          <div className="flex flex-col">
            <p
              className="text-bold text-small capitalize"
              // title={note}
            >
              {truncatedNote}
            </p>
          </div>
        );
      case "report":
        return (
          <Chip className="capitalize" size="sm" variant="flat" color="success">
            <a
              href={JSON.parse(report.documentUrl).url}
              target="_blank"
              rel="noopener noreferrer"
              // className="text-blue-500 hover:underline"
            >
              View Report
            </a>
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  // Search functionality - fix the implementation
  const onSearchChange = (value?: string) => {
    const val = value || "";
    setSearchTerm(val);
    setPage(1);
    debouncedFetchRef.current?.(val);
  };

  const onClear = useCallback(() => {
    debouncedFetchRef.current?.cancel();
    setFilterValue("");
    setSearchTerm("");
    setPage(1);
    // fetchReports will be called automatically by useEffect
  }, []);

  // Date filtering functionality - fix the implementation
  const handleDateChange = (date: CalendarDate | null) => {
    if (date) {
      const jsDate = date.toDate(getLocalTimeZone());
      const formattedDate = `${jsDate.getFullYear()}-${String(jsDate.getMonth() + 1).padStart(2, "0")}-${String(jsDate.getDate()).padStart(2, "0")}`;
      setSelectedDateShow(formattedDate);
      debouncedDateFetchRef.current?.(formattedDate);
    } else {
      setSelectedDateShow(null);
      debouncedDateFetchRef.current?.(null);
    }
  };

  const topContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-wrap xl:flex-nowrap gap-3 justify-between sm:items-end w-full items-center">
            <Input
              isClearable
              className="w-full sm:w-[calc(50%-0.75rem)] h-[40px] sm:h-[45px] md:h-[50px]"
              placeholder="Search by patient name..."
              startContent={<SearchIcon />}
              value={searchTerm}
              onClear={onClear}
              onValueChange={onSearchChange}
            />
            <DatePicker
              showMonthAndYearPickers
              label="Report date"
              className="w-full sm:w-[calc(50%-0.75rem)] h-[42px] sm:h-[46px] md:h-[51px]"
              value={
                selectedDateShow && /^\d{4}-\d{2}-\d{2}$/.test(selectedDateShow)
                  ? parseDate(selectedDateShow)
                  : undefined
              }
              onChange={handleDateChange}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">
              {`Total ${totalCount} Reports`}
            </span>
          </div>
        </div>
      </div>
    );
  }, [searchTerm, selectedDateShow, totalCount, onClear, onSearchChange]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${reports.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [selectedKeys, reports.length, page, pages]);

  return (
    <div className="relative">
      {topContent}
      <Table
        aria-label="Report Details"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={loading ? <Spinner /> : "No reports found"}
          items={filteredItems}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-10 z-50">
          <Spinner size="lg" />
        </div>
      )}
      <style>
        {`
          :root {
            --calendar-background-color: #ecf0f1;
            --dark-background: #122031;
          }
          
          .dark {
            --calendar-background-color: var(--dark-background);
          }    
        `}
      </style>
    </div>
  );
}
