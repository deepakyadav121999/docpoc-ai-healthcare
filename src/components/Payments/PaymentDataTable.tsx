"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
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
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

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
  // const [filterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  // const [statusFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "paymentDate",
    direction: "ascending",
  });

  const API_URL = process.env.API_URL;

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const branchId = profile?.branchId;

      if (!branchId) {
        throw new Error("Branch ID not available");
      }

      const endpoint = `${API_URL}/payments/list/${branchId}`;
      const params = {
        page,
        pageSize: rowsPerPage,
        from: "2022-01-01T05:19:15.544Z",
        to: "3000-05-02T05:19:15.545Z",
        status: ["COMPLETED", "PENDING"],
        paymentMethod: ["CASH", "CARD"],
      };

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
  }, [page, rowsPerPage, profile?.branchId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const headerColumns = useMemo(() => {
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

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
    return [...payments].sort((a: Payment, b: Payment) => {
      const first = a[sortDescriptor.column as keyof Payment];
      const second = b[sortDescriptor.column as keyof Payment];
      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [payments, sortDescriptor]);

  const pages = Math.ceil(totalCount / rowsPerPage) || 1;

  return (
    <div className="relative">
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
