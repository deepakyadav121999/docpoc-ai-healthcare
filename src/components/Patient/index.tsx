"use client";
import React, { useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Button,

} from "@nextui-org/react";

import { ChevronDownIcon } from "./ChevronDownIcon";
import { SearchIcon } from "./SearchIcon";
import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import OpaqueModal from "../common/Modal/Opaque";
import { MODAL_TYPES } from "@/constants";
import { Spinner } from "@nextui-org/react";
import OpaqueDefaultModal from "../common/Modal/OpaqueDefaultModal";
import AddPatient from "./AddPatient";
import { useEffect } from "react";
const statusColorMap: Record<string, ChipProps["color"]> = {
  Active: "success",
  Inactive: "warning",
  Blacklisted: "danger",
};
import debounce from 'lodash.debounce';


const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "age",
  'bloodGroup',
  "phone",
  "email",
  "status",
  "actions",
  "lastVisit"
];


interface Patient {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  phone: string;
  email: string;
  status: string;
  lastVisit: string;
  displayPicture: string;

}

export default function App() {

  const [users, setUsers] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalPatient, setTotalPatient] = useState(0)

  const fetchPatients = async (searchName = "", selectedStatuses: string[] = []) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint = searchName
        ? `http://127.0.0.1:3037/DocPOC/v1/patient/name/${searchName}`
        : "http://127.0.0.1:3037/DocPOC/v1/patient/list/12a1c77b-39ed-47e6-b6aa-0081db2c1469";


      const params: any = {};


      if (selectedStatuses.length) {
        params.status = selectedStatuses;

      } else {

        params.page = page;
        params.pageSize = rowsPerPage;
        params.from = '2024-12-04T03:32:25.812Z';
        params.to = '2024-12-11T03:32:25.815Z';
        params.notificationStatus = ['Whatsapp notifications paused', 'SMS notifications paused'];
      }

      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setUsers(response.data.rows || response.data);
      setTotalPatient(response.data.count || response.data.length);

    } catch (err) {
      setError("Failed to fetch patients.");
    } finally {
      setLoading(false);
    }
  };


  // http://127.0.0.1:3037/DocPOC/v1/patient/?status[]=Inactive


  useEffect(() => {

    fetchPatients();

  }, [page, rowsPerPage]);

  const refreshPatients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const response = await axios.get("http://127.0.0.1:3037/DocPOC/v1/patient/list/12a1c77b-39ed-47e6-b6aa-0081db2c1469", {
        params: {
          page: page,
          pageSize: rowsPerPage,
          from: '2024-12-04T03:32:25.812Z',
          to: '2024-12-11T03:32:25.815Z',
          status: ['Active', 'Inactive'],
          notificationStatus: ['Whatsapp notifications paused', 'SMS notifications paused']
        },
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      setUsers(response.data.rows);
      setTotalPatient(response.data.count);
    } catch (err) {
      setError("Failed to fetch patients.");
    } finally {
      setLoading(false);
    }
  };




  type User = (typeof users)[0];





  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });


  const hasSearchFilter = Boolean(filterValue);




  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const pages = Math.ceil(totalPatient / rowsPerPage);

  const items = filteredItems

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number;
      const second = b[sortDescriptor.column as keyof User] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.displayPicture }}
            description={user.email}
            name={cellValue}
          >
            {user.email}
          </User>
        );
      case "lastVisit":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-400">
              {user.lastVisit}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <OpaqueModal
            modalType={{
              view: MODAL_TYPES.VIEW_PATIENT,
              edit: MODAL_TYPES.EDIT_PATIENT,
              delete: MODAL_TYPES.DELETE_PATIENT,
            }}
            actionButtonName={"Ok"}
            modalTitle={"Patient"}
            patientId={user.id}
            onPatientDelete={refreshPatients}
          />
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );



  const debouncedFetchPatients = React.useMemo(
    () => debounce((value: string) => fetchPatients(value), 500),
    [fetchPatients]
  );

  const onSearchChange = React.useCallback((value?: string) => {
    setFilterValue(value || "");
    setPage(1);
    debouncedFetchPatients(value || "");
  }, [debouncedFetchPatients]);


  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);
  const onStatusFilterChange = (selected: Selection) => {
    const selectedStatuses = Array.from(selected) as string[];
    setStatusFilter(selected);  // Update the filter state
    setPage(1);                  // Reset pagination to the first page
    fetchPatients(filterValue, selectedStatuses);
  };


  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">

        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                  style={{ minHeight: 55 }}
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Status Filter"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={onStatusFilterChange}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>

            </Dropdown> */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                  style={{ minHeight: 55 }}
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            {/* <Calendar /> */}
            <OpaqueDefaultModal headingName="Add New Patient" child={<AddPatient onPatientAdded={refreshPatients} />} />

          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalPatient} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${users.length} selected`}
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
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <div className="relative">
    
      <Table
        aria-label="Appointment Details"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[482px] ",
        }}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
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
        
        <TableBody emptyContent={""} items={sortedItems}>
          {(item) => (

            <TableRow key={item.id}>

              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}

        </TableBody>
      </Table>
      <div>
          {loading && (
            <div className="absolute inset-0 flex justify-center items-center  z-50">
              <Spinner />
            </div>
          )}
        </div>
    </div>
  );
}
