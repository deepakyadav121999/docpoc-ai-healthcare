"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
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
  DatePicker,
  Switch,
} from "@nextui-org/react";
// import { PlusIcon } from "./PlusIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { SearchIcon } from "./SearchIcon";
import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import OpaqueModal from "../common/Modal/Opaque";
import { MODAL_TYPES } from "@/constants";
import OpaqueDefaultModal from "../common/Modal/OpaqueDefaultModal";
import AddAppointment from "./AddAppointment";
import { CalendarDate, parseDate } from "@internationalized/date";
import debounce from "lodash.debounce";

import { getLocalTimeZone } from "@internationalized/date";

const statusColorMap: Record<string, ChipProps["color"]> = {
  visiting: "success",
  declined: "danger",
  unsure: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "age",
  "date",
  "time",
  "email",
  "status",
  "actions",
];

interface AppointmentsProps {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  totalAppointments: number;
  fetchAppointments: (params: FetchParams) => Promise<void>;
  userId: string | undefined;
}

interface Appointment {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  phone: string;
  email: string;
  status: string;
  lastVisit: string;
  displayPicture: string;
  isActive: string;
  json: string;
  startDateTime: string;
  endDateTime: string;
  dateTime: string;
  statusName: string;
}

interface FetchParams {
  page: number;
  pageSize: number;
  doctorId?: string;
  createdBy?: string;
  search?: string;
  date?: string;
}

export default function AppointmentTable({
  appointments,

  totalAppointments,
  fetchAppointments,
  userId,
}: AppointmentsProps) {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  // const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateShow, setSelectedDateShow] = useState<string | null>(null);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [assignedToMe, setAssignedToMe] = useState(false);
  const [createdByMe, setCreatedByMe] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);

  const debouncedFetchAppointments = useCallback(
    debounce((params: FetchParams) => {
      fetchAppointments(params).finally(() => {
        setSwitchLoading(false);
      });
    }, 500),
    [fetchAppointments],
  );

  const handleToggle = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<boolean>>,
      key: "doctorId" | "createdBy",
    ) => {
      if (switchLoading) return;

      setter((prev) => !prev);
      setSwitchLoading(true);

      // Construct the payload based on the current state of both switches
      const payload: FetchParams = {
        page,
        pageSize: rowsPerPage,
        doctorId: (key === "doctorId" ? !assignedToMe : assignedToMe)
          ? userId
          : undefined,
        createdBy: (key === "createdBy" ? !createdByMe : createdByMe)
          ? userId
          : undefined,
      };

      debouncedFetchAppointments(payload);
    },
    [
      switchLoading,
      debouncedFetchAppointments,
      page,
      rowsPerPage,
      userId,
      assignedToMe,
      createdByMe,
    ],
  );

  const getAgeFromDob = (dob: string): number => {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  function extractTime(dateTime: string): string {
    const date = new Date(dateTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${amPm}`;
  }

  const extractDate = (dateTimeString: string): string => {
    const date = dateTimeString;
    return date && date.split("T")[0];
  };

  type User = (typeof appointments)[0];
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...appointments];
    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }
    return filteredUsers;
  }, [appointments, filterValue, statusFilter]);

  const pages =
    totalAppointments > 0 ? Math.ceil(totalAppointments / rowsPerPage) : 1;

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number | string;
      const second = b[sortDescriptor.column as keyof User] as number | string;
      const cmp =
        typeof first === "string"
          ? first.localeCompare(second as string)
          : first - (second as number);
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const renderCell = useCallback(
    (user: User, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof User];
      if (columnKey === "age") {
        let age = "";
        try {
          const userJson = JSON.parse(user.json);
          const dob = userJson.dob || "";
          age = getAgeFromDob(dob).toString();
        } catch (error) {
          console.log(error);
        }
        return <p className="capitalize">{age}</p>;
      }
      if (columnKey === "time") {
        const startTime = extractTime(user.startDateTime);
        const endTime = user.endDateTime;
        return (
          <p className="capitalize">
            {startTime}-{extractTime(endTime)}
          </p>
        );
      }
      if (columnKey === "date") {
        const startDate = extractDate(user.dateTime);
        // const endDate = extractDate(user.endDateTime);
        return <p>{startDate}</p>;
      }
      if (columnKey === "email") {
        try {
          const userJson = JSON.parse(user.json || "{}");
          const email = userJson.email || "N/A";
          return <p>{email}</p>;
        } catch (err) {
          console.log(err);
        }
      }
      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: user.displayPicture }}
              description={user.email}
              name={cellValue}
            />
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="font-bold text-sm capitalize">{cellValue}</p>
              <p className="text-xs capitalize text-gray-400">{}</p>
            </div>
          );
        case "status":
          const status = user.statusName;
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[status.toLowerCase()]}
              size="sm"
              variant="flat"
            >
              {status}
            </Chip>
          );
        case "actions":
          return (
            <OpaqueModal
              modalType={{
                view: MODAL_TYPES.VIEW_APPOINTMENT,
                edit: MODAL_TYPES.EDIT_APPOINTMENT,
                delete: MODAL_TYPES.DELETE_APPOINTMENT,
              }}
              actionButtonName={"Ok"}
              modalTitle={"Appointment"}
              userId={user.id}
              onPatientDelete={() =>
                fetchAppointments({ page, pageSize: rowsPerPage })
              }
            />
          );
        default:
          return cellValue;
      }
    },
    [fetchAppointments, page, rowsPerPage],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      fetchAppointments({ page: newPage, pageSize: rowsPerPage });
    },
    [fetchAppointments, rowsPerPage],
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
      fetchAppointments({ page: 1, pageSize: Number(e.target.value) });
    },
    [fetchAppointments],
  );

  // const toggleAddAppointment = useCallback(() => {
  //   // Logic for toggling add appointment modal
  // }, []);

  // const debouncedFetchUsers = useCallback(
  //   debounce((searchValue: string) => {
  //     setFilterValue(searchValue);
  //     fetchAppointments({ page, pageSize: rowsPerPage, search: searchValue });
  //   }, 500),
  //   [fetchAppointments, page, rowsPerPage]
  // );

  // const onSearchChange = React.useCallback(
  //   (value?: string) => {
  //     setFilterValue(value || "");
  //     setPage(1);
  //     debouncedFetchUsers(value || "");
  //   },
  //   [debouncedFetchUsers]
  // );

  const debouncedFetchUsers = useCallback(
    debounce((searchValue: string) => {
      setFilterValue(searchValue);
      setPage(1);
      fetchAppointments({
        page: 1,
        pageSize: rowsPerPage,
        search: searchValue,
      });
    }, 500),
    [fetchAppointments, rowsPerPage],
  );

  const onSearchChange = React.useCallback(
    (value?: string) => {
      setFilterValue(value || "");
      debouncedFetchUsers(value || "");
    },
    [debouncedFetchUsers],
  );

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
    fetchAppointments({ page: 1, pageSize: rowsPerPage });
  }, [fetchAppointments, rowsPerPage]);

  const debouncedHandleDateChange = useCallback(
    debounce((date: CalendarDate | null) => {
      if (date) {
        const jsDate = date.toDate(getLocalTimeZone());
        const formattedDate = `${jsDate.getFullYear()}-${String(
          jsDate.getMonth() + 1,
        ).padStart(2, "0")}-${String(jsDate.getDate()).padStart(2, "0")}`;
        // setSelectedDate(formattedDate);
        setSelectedDateShow(formattedDate);
        fetchAppointments({ page, pageSize: rowsPerPage, date: formattedDate });
      } else {
        // setSelectedDate(null);
        setSelectedDateShow(null);
        fetchAppointments({ page, pageSize: rowsPerPage });
      }
    }, 500),
    [fetchAppointments, page, rowsPerPage],
  );

  const handleDateChange = (date: CalendarDate | null) => {
    debouncedHandleDateChange(date);
  };

  const topContent = useMemo(() => {
    return (
      // <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
      //   <div className="flex flex-col gap-4 w-full">
      //     <div className="flex flex-wrap sm:flex-nowrap gap-3 justify-between sm:items-end w-full items-center">
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-wrap xl:flex-nowrap  gap-3 justify-between sm:items-end w-full items-center">
            <Input
              isClearable
              className="w-full sm:w-[calc(50%-0.75rem)] h-[40px] sm:h-[45px] md:h-[50px]"
              placeholder="Search by name..."
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
            <DatePicker
              showMonthAndYearPickers
              label="Appointment date"
              className="w-full sm:w-[calc(50%-0.75rem)] h-[42px] sm:h-[46px] md:h-[51px]"
              value={selectedDateShow ? parseDate(selectedDateShow) : undefined}
              onChange={handleDateChange}
            />
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2 justify-center items-center sm:items-center sm:justify-between w-full mt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    onChange={() => handleToggle(setAssignedToMe, "doctorId")}
                    className="text-sm"
                    size="lg"
                    color="secondary"
                    isDisabled={switchLoading}
                  >
                    <p className="text-xs sm:text-sm">Assigned to Me</p>
                  </Switch>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    onChange={() => handleToggle(setCreatedByMe, "createdBy")}
                    className="text-sm"
                    size="lg"
                    color="secondary"
                    isDisabled={switchLoading}
                  >
                    <p className="text-xs sm:text-sm">Created by Me</p>
                  </Switch>
                </div>
              </div>
            </div>
            <div
              className="flex flex-col md:flex-row gap-4 md:gap-8 w-full md:justify-between"
              style={{
                flexDirection: "column",
              }}
            >
              <div className="flex gap-3">
                <Dropdown>
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
                    aria-label="Table Columns"
                    closeOnSelect={false}
                    selectedKeys={statusFilter}
                    selectionMode="multiple"
                    onSelectionChange={setStatusFilter}
                  >
                    {statusOptions.map((status) => (
                      <DropdownItem key={status.uid} className="capitalize">
                        {capitalize(status.name)}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
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
                <OpaqueDefaultModal
                  headingName="Add New Appointment"
                  child={
                    <AddAppointment
                      onUsersAdded={() =>
                        fetchAppointments({ page, pageSize: rowsPerPage })
                      }
                    />
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">
              {`Total ${totalAppointments} Appointments`}
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
                <option value="1000">15</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    );
  }, [
    onClear,
    onSearchChange,
    visibleColumns,
    statusFilter,
    filterValue,
    onRowsPerPageChange,
    totalAppointments,
    fetchAppointments,
    page,
    rowsPerPage,
    assignedToMe,
    createdByMe,
    switchLoading,
  ]);

  const paginationContent = (
    <div className="flex justify-end items-center w-full py-4">
      <Button
        isDisabled={page <= 1}
        onPress={() => setPage(page - 1)}
        size="sm"
        variant="flat"
      >
        Prev
      </Button>
      <Pagination
        page={page}
        total={pages}
        onChange={(newPage) => handlePageChange(newPage)}
        className="mx-4"
      />
      <Button
        isDisabled={page >= pages}
        onPress={() => setPage(page + 1)}
        size="sm"
        variant="flat"
      >
        Next
      </Button>
    </div>
  );

  return (
    <>
      {topContent}
      <Table
        aria-label="Example static collection table with multiple selection"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.uid === "age"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={"No Appointment Available"}
          items={sortedItems}
        >
          {(item: User) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {paginationContent}
    </>
  );
}
