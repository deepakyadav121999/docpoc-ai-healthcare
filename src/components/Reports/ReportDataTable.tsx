// "use client";
// import React from "react";
// import {
//   Table,
//   TableHeader,
//   TableColumn,
//   TableBody,
//   TableRow,
//   TableCell,
//   Chip,
//   Selection,
//   SortDescriptor,
// } from "@nextui-org/react";
// import { columns, users, statusOptions } from "./data";

// const INITIAL_VISIBLE_COLUMNS = [
//   "name",
//   "doctorName",
//   "reportDate",
//   "note",
//   "report",
// ];

// type User = (typeof users)[0];

// export default function ReportDataTable() {
//   const [filterValue, setFilterValue] = React.useState("");
//   const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
//     new Set([]),
//   );
//   const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
//     new Set(INITIAL_VISIBLE_COLUMNS),
//   );
//   const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);
//   const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
//     column: "reportDate",
//     direction: "ascending",
//   });
//   const [page, setPage] = React.useState(1);

//   const hasSearchFilter = Boolean(filterValue);

//   const headerColumns = React.useMemo(() => {
//     if (visibleColumns === "all") return columns;

//     return columns.filter((column) =>
//       Array.from(visibleColumns).includes(column.uid),
//     );
//   }, [visibleColumns]);

//   const filteredItems = React.useMemo(() => {
//     let filteredUsers = [...users];

//     if (hasSearchFilter) {
//       filteredUsers = filteredUsers.filter((user) =>
//         user.name.toLowerCase().includes(filterValue.toLowerCase()),
//       );
//     }
//     if (
//       statusFilter !== "all" &&
//       Array.from(statusFilter).length !== statusOptions.length
//     ) {
//       // Uncomment and adjust this if you need to filter by status
//       // filteredUsers = filteredUsers.filter((user) =>
//       //   Array.from(statusFilter).includes(user.status),
//       // );
//     }

//     return filteredUsers;
//   }, [users, filterValue, statusFilter]);

//   const items = React.useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;

//     return filteredItems.slice(start, end);
//   }, [page, filteredItems, rowsPerPage]);

//   const sortedItems = React.useMemo(() => {
//     return [...items].sort((a: User, b: User) => {
//       const first = a[sortDescriptor.column as keyof User] as string;
//       const second = b[sortDescriptor.column as keyof User] as string;
//       const cmp = first < second ? -1 : first > second ? 1 : 0;

//       return sortDescriptor.direction === "descending" ? -cmp : cmp;
//     });
//   }, [sortDescriptor, items]);

//   const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
//     const cellValue = user[columnKey as keyof User];

//     switch (columnKey) {
//         case "name":
//             return (
//               <div className="flex flex-col">
//                 <p className="text-bold text-small capitalize">{cellValue}</p>
//                 <p className="text-bold text-tiny capitalize text-default-400">
//                   {user.name}
//                 </p>
//               </div>
//             );
//             case "doctorName":
//                 return (
//                   <div className="flex flex-col">
//                     <p className="text-bold text-small capitalize">{cellValue}</p>
//                     <p className="text-bold text-tiny capitalize text-default-400">
//                       {user.doctorName}
//                     </p>
//                   </div>
//                 );

//             case "reportDate":
//                 return (
//                   <div className="flex flex-col">
//                     <p className="text-bold text-small capitalize">{cellValue}</p>
//                     <p className="text-bold text-tiny capitalize text-default-400">
//                       {user.reportDate}
//                     </p>
//                   </div>
//                 );
//       case "report":
//         return (
//           <Chip
//             className="capitalize"
//             size="sm"
//             variant="flat"
//           >
//             {cellValue}
//           </Chip>
//         );
//       default:
//         return cellValue;
//     }
//   }, []);

//   return (
//     <div>
//       <Table
//         aria-label="Appointment Details"
//         classNames={{
//           wrapper: "max-h-[482px] ",
//         }}
//         sortDescriptor={sortDescriptor}
//         onSelectionChange={setSelectedKeys}
//         onSortChange={setSortDescriptor}
//         style={{ backgroundColor: "var(--calendar-background-color)" }}
//       >
//         <TableHeader columns={headerColumns}>
//           {(column) => (
//             <TableColumn
//               key={column.uid}
//               align={column.uid === "actions" ? "center" : "start"}
//               allowsSorting={column.sortable}
//             >
//               {column.name}
//             </TableColumn>
//           )}
//         </TableHeader>
//         <TableBody emptyContent={"No users found"} items={sortedItems}>
//           {(item) => (
//             <TableRow key={item.id}>
//               {(columnKey) => (
//                 <TableCell key={columnKey}>{renderCell(item, columnKey)}</TableCell>
//               )}
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//       <style>
//         {`
//       :root {
//         --calendar-background-color: #ecf0f1;
//         --dark-background: #122031;
//       }

//       .dark {
//         --calendar-background-color: var(--dark-background);
//       }

//       .table-custom {
//         background-color: var(--calendar-background-color);
//       }`}
//       </style>
//     </div>
//   );
// }

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
import { columns, statusOptions } from "./data";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
// import debounce from "lodash.debounce";

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
  const [filterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter] = useState<Selection>("all");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "reportDate",
    direction: "ascending",
  });

  const API_URL = process.env.API_URL;
  const hasSearchFilter = Boolean(filterValue);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const branchId = profile?.branchId;

      if (!branchId) {
        throw new Error("Branch ID not available");
      }

      // Set default date range (adjust as needed)
      const fromDate = "2025-01-01T05:19:15.544Z";
      const toDate = "2025-05-02T05:19:15.545Z";

      //  const endpoint = searchName
      //     ? `${API_URL}/DocPOC/v1/reports/name/${searchName}`
      //     : `${API_URL}/DocPOC/v1/reports/list/${branchId} `;
      const endpoint = `${API_URL}/reports/list/${branchId}`;

      const params = {
        page,
        pageSize: rowsPerPage,
        from: fromDate,
        to: toDate,
        reportType: ["MEDICAL_REPORT", "INVOICE"],
      };

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
  }, [page, rowsPerPage, profile?.branchId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Report, b: Report) => {
      const first = a[sortDescriptor.column as keyof Report] as string;
      const second = b[sortDescriptor.column as keyof Report] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

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

  // const onRowsPerPageChange = useCallback(
  //   (e: React.ChangeEvent<HTMLSelectElement>) => {
  //     setRowsPerPage(Number(e.target.value));
  //     setPage(1);
  //   },
  //   [],
  // );

  // const debouncedFetchReports = useMemo(
  //   () => debounce((value: string) => fetchReports(), 500),
  //   [fetchReports],
  // );

  // const onSearchChange = useCallback(
  //   (value?: string) => {
  //     setFilterValue(value || "");
  //     setPage(1);
  //     debouncedFetchReports(value || "");
  //   },
  //   [debouncedFetchReports],
  // );

  // const onClear = useCallback(() => {
  //   setFilterValue("");
  //   setPage(1);
  // }, []);

  // const onStatusFilterChange = (selected: Selection) => {
  //   // const selectedStatuses = Array.from(selected) as string[];
  //   setStatusFilter(selected);
  //   setPage(1);
  //   // You can add status filtering logic here if needed
  // };

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
      <Table
        aria-label="Report Details"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[482px]",
        }}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        style={{ backgroundColor: "var(--calendar-background-color)" }}
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
