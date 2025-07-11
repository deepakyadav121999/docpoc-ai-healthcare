"use client";
import React, { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  ChipProps,
  SortDescriptor,
} from "@nextui-org/react";
import { ReminderOverview } from "./types";
import { format } from "date-fns";

const statusColorMap: Record<string, ChipProps["color"]> = {
  Active: "success",
  InActive: "danger",
};

const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "ENABLED ON", uid: "enabledOn", sortable: true },
  { name: "TOTAL TRIGGERS", uid: "totalTriggers" },
  { name: "ACTIVATED CHANNEL", uid: "activatedChannel" },
  { name: "STATUS", uid: "status", sortable: true },
];

interface DataTableProps {
  data: ReminderOverview[];
  loading: boolean;
  error: string | null;
}

export default function DataTable({ data, loading, error }: DataTableProps) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });

  const sortedItems = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a: ReminderOverview, b: ReminderOverview) => {
      const first = a[sortDescriptor.column as keyof ReminderOverview] as any;
      const second = b[sortDescriptor.column as keyof ReminderOverview] as any;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, data]);

  const renderCell = React.useCallback(
    (item: ReminderOverview, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof ReminderOverview];

      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "enabledOn":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {format(new Date(cellValue as string), "dd/MM/yyyy")}
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[item.status]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Table
        aria-label="Reminder Overview"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        style={{ backgroundColor: "var(--calendar-background-color)" }}
      >
        <TableHeader columns={columns}>
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
        <TableBody emptyContent={"No reminders found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
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
