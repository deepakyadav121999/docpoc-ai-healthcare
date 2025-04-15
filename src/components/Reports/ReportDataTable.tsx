"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Selection,
  SortDescriptor,
} from "@nextui-org/react";
import { columns, users, statusOptions } from "./data";

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "doctorName",
  "reportDate",
  "note",
  "report",
];

type User = (typeof users)[0];

export default function ReportDataTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "reportDate",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      // Uncomment and adjust this if you need to filter by status
      // filteredUsers = filteredUsers.filter((user) =>
      //   Array.from(statusFilter).includes(user.status),
      // );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as string;
      const second = b[sortDescriptor.column as keyof User] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
        case "name":
            return (
              <div className="flex flex-col">
                <p className="text-bold text-small capitalize">{cellValue}</p>
                <p className="text-bold text-tiny capitalize text-default-400">
                  {user.name}
                </p>
              </div>
            );
            case "doctorName":
                return (
                  <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{cellValue}</p>
                    <p className="text-bold text-tiny capitalize text-default-400">
                      {user.doctorName}
                    </p>
                  </div>
                );


            case "reportDate":
                return (
                  <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{cellValue}</p>
                    <p className="text-bold text-tiny capitalize text-default-400">
                      {user.reportDate}
                    </p>
                  </div>
                );
      case "report":
        return (
          <Chip
            className="capitalize"
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
      <Table
        aria-label="Appointment Details"
        classNames={{
          wrapper: "max-h-[482px] ",
        }}
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
        <TableBody emptyContent={"No users found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell key={columnKey}>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <style>
        {`
      :root {
        --calendar-background-color: #ecf0f1;
        --dark-background: #122031;
      }
      
      .dark {
        --calendar-background-color: var(--dark-background);
      }    
      
      .table-custom {
        background-color: var(--calendar-background-color);
      }`}
      </style>
    </div>
  );
}