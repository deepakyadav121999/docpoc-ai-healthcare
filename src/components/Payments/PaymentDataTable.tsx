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
  SortDescriptor,
  Spinner,
  Input,
  DatePicker,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { SearchIcon } from "../CalenderBox/SearchIcon";
import { CalendarDate, parseDate } from "@internationalized/date";
import { getLocalTimeZone } from "@internationalized/date";
import debounce from "lodash.debounce";
import type { DebouncedFunc } from "lodash";

interface Patient {
  name: string;
}

interface Doctor {
  name: string;
}

interface Payment {
  id: string;
  patient: Patient;
  doctor: Doctor;
  amount: number;
  paymentMethod: string;
  status: string;
  paymentDate: string;
  notes: string;
  code: string;
  receiptUrl: string;
}

// Define your columns here
const columns = [
  { uid: "name", name: "Patient Name", sortable: true },
  { uid: "doctorName", name: "Doctor Name", sortable: true },
  { uid: "paymentDate", name: "Payment Date", sortable: true },
  { uid: "paymentMethod", name: "Payment Method", sortable: true },
  { uid: "amount", name: "Amount", sortable: true },
  { uid: "status", name: "Status", sortable: true },
  { uid: "note", name: "Note" },
  { uid: "receipt", name: "Receipt" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "doctorName",
  "paymentDate",
  "paymentMethod",
  "amount",
  "status",
  "note",
  "receipt",
];

export default function PaymentDataTable() {
  const profile = useSelector((state: RootState) => state.profile.data);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [filterValue, setFilterValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateShow, setSelectedDateShow] = useState<string | null>(null);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "paymentDate",
    direction: "ascending",
  });

  const API_URL = process.env.API_URL;
  const hasSearchFilter = Boolean(filterValue);

  const debouncedFetchRef =
    useRef<DebouncedFunc<(searchValue: string) => void>>();
  const debouncedDateFetchRef =
    useRef<DebouncedFunc<(date: string | null) => void>>();

  const fetchPayments = useCallback(async () => {
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

      const endpoint = `${API_URL}/payments/list/${branchId}`;
      const params: any = {
        page,
        pageSize: rowsPerPage,
        from: fromDate,
        to: toDate,
        status: ["COMPLETED", "PENDING"],
        paymentMethod: ["CASH", "CARD"],
      };

      // Add search filter if available
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

      setPayments(response.data.rows || []);
      setTotalCount(response.data.count || 0);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, profile?.branchId, selectedDate, filterValue]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Initialize debounced search
  useEffect(() => {
    debouncedFetchRef.current = debounce((searchValue: string) => {
      setFilterValue(searchValue);
      setPage(1);
      // Don't call fetchPayments here, let the useEffect handle it
    }, 500);

    return () => {
      debouncedFetchRef.current?.cancel();
    };
  }, []);

  // Initialize debounced date filtering
  useEffect(() => {
    debouncedDateFetchRef.current = debounce((date: string | null) => {
      setSelectedDate(date);
      setPage(1);
      // Don't call fetchPayments here, let the useEffect handle it
    }, 500);

    return () => {
      debouncedDateFetchRef.current?.cancel();
    };
  }, []);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredPayments = [...payments];

    if (hasSearchFilter) {
      filteredPayments = filteredPayments.filter((payment) =>
        payment.patient?.name
          ?.toLowerCase()
          .includes(filterValue.toLowerCase()),
      );
    }

    return filteredPayments;
  }, [payments, filterValue]);

  const renderCell = useCallback(
    (payment: Payment, columnKey: React.Key): React.ReactNode => {
      switch (columnKey) {
        case "name":
          return (
            <p className="text-bold text-small capitalize">
              {payment.patient?.name || "N/A"}
            </p>
          );
        case "doctorName":
          return (
            <p className="text-bold text-small capitalize">
              {payment.doctor?.name || "N/A"}
            </p>
          );
        case "paymentDate":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {payment.paymentDate
                  ? new Date(payment.paymentDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-bold text-tiny text-default-400">
                {payment.paymentDate
                  ? new Date(payment.paymentDate).toLocaleTimeString()
                  : ""}
              </p>
            </div>
          );
        case "paymentMethod":
          return (
            <Chip className="capitalize" size="sm" variant="flat">
              {payment.paymentMethod || "N/A"}
            </Chip>
          );
        case "amount":
          return (
            <p className="text-bold text-small">
              ₹{payment.amount?.toFixed(2) || "0.00"}
            </p>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              size="sm"
              variant="flat"
              color={payment.status === "COMPLETED" ? "success" : "warning"}
            >
              {payment.status || "N/A"}
            </Chip>
          );
        case "note":
          return (
            <p className="text-bold text-small">{payment.notes || "N/A"}</p>
          );
        case "receipt":
          return payment.receiptUrl ? (
            <Chip
              className="capitalize"
              size="sm"
              variant="flat"
              color="success"
            >
              <a
                href={JSON.parse(payment.receiptUrl).url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </a>
            </Chip>
          ) : (
            <Chip size="sm" variant="flat">
              N/A
            </Chip>
          );
        default:
          return "N/A";
      }
    },
    [],
  );

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Payment, b: Payment) => {
      const first = a[sortDescriptor.column as keyof Payment];
      const second = b[sortDescriptor.column as keyof Payment];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor]);

  const pages = Math.ceil(totalCount / rowsPerPage) || 1;

  // Search functionality
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
    // fetchPayments will be called automatically by useEffect
  }, []);

  // Date filtering functionality
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
              label="Payment date"
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
              {`Total ${totalCount} Payments`}
            </span>
          </div>
        </div>
      </div>
    );
  }, [searchTerm, selectedDateShow, totalCount, onClear, onSearchChange]);

  return (
    <div className="relative">
      {topContent}
      <Table
        aria-label="Payment Details"
        isHeaderSticky
        bottomContent={
          <div className="py-2 px-2 flex justify-between items-center">
            <span className="w-[30%] text-small text-default-400">
              {selectedKeys === "all"
                ? "All items selected"
                : `${selectedKeys.size} of ${payments.length} selected`}
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
        }
        classNames={{ wrapper: "max-h-[482px]" }}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        bottomContentPlacement="outside"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align="start"
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={loading ? <Spinner /> : "No payments found"}
          items={sortedItems}
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
