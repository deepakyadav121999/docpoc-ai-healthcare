"use client";

import React, { useCallback, useMemo, useState, useEffect } from "react";
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
  useDisclosure,
} from "@nextui-org/react";
import { PlusIcon } from "./PlusIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";

import { SearchIcon } from "./SearchIcon";
import { columns, statusOptions } from "./data";
import { capitalize } from "./utils";
import OpaqueModal from "../common/Modal/Opaque";
import { MODAL_TYPES } from "@/constants";
import OpaqueDefaultModal from "../common/Modal/OpaqueDefaultModal";
import AddAppointment from "./AddAppointment";
import axios from "axios";
import Appointments from "@/app/appointment/page";
import { CalendarDate, parseDate } from "@internationalized/date";
import debounce from "lodash.debounce";
import { DateInput } from "@nextui-org/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import { color } from "framer-motion";
import { Switch } from "@nextui-org/react";

import { useSelector } from "react-redux";
import { RootState } from "../../store";

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
interface appointments {
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

// type User = (typeof Appointments)[0];
const API_URL = process.env.API_URL;

export default function AppointmentTable() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [tempDate, setTempDate] = useState<string | null>(null);

  // const [rowsPerPage, setRowsPerPage] = useState<number>(
  //   parseInt(localStorage.getItem("rowsPerPage") || "5", 10) // Retrieve rowsPerPage from local storage
  // );
  // const [page, setPage] = useState<number>(
  //   parseInt(localStorage.getItem("page") || "1", 10) // Retrieve page from local storage
  // );

  const [addAppointmentModelToggle, setAddAppointmentModelToggle] =
    useState(false);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [appointments, setAppointments] = React.useState<appointments[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [totalappointments, setTotalappointments] = React.useState(0);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateShow, setSelectedDateShow] = useState<string | null>(null);
  const [statusCache, setStatusCache] = React.useState<Record<string, string>>(
    {},
  );
  const [assignedToMe, setAssignedToMe] = useState(false); // Toggle for "Assigned to Me"
  const [createdByMe, setCreatedByMe] = useState(false);
  const profile = useSelector((state: RootState) => state.profile.data);

  useEffect(() => {
    localStorage.setItem("page", String(page));
  }, [page]);

  useEffect(() => {
    localStorage.setItem("rowsPerPage", String(rowsPerPage));
  }, [rowsPerPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const profileEndpoint = `${API_URL}/auth/profile`;
      // const profileResponse = await axios.get(profileEndpoint, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      // })

      // const userProfile = localStorage.getItem("userProfile");

      // // Parse the JSON string if it exists
      // const parsedUserProfile = userProfile ? JSON.parse(userProfile) : null;

      const userId = profile?.id;
      // Extract the branchId from the user profile
      const fetchedBranchId = profile?.branchId;

      const endpoint = `${API_URL}/appointment/list/${fetchedBranchId}`;

      const params: any = {
        page: page, // Use currentPage here
        pageSize: rowsPerPage,
        from: "2024-12-01T00:00:00.000Z", // Start of the month
        to: "2025-12-31T23:59:59.999Z", // End of the month
        status: ["visiting", "declind"],
        // Use currentRowsPerPage here
      };

      if (selectedDate) {
        params.from = selectedDate;
        params.to = selectedDate;
      }

      if (filterValue) {
        params.name = filterValue; // API should accept a "search" parameter for filtering
      }

      if (assignedToMe && userId) {
        params.doctorId = userId; // Assign the doctorId parameter
      }
      if (createdByMe && userId) {
        params.createdBy = userId; // Assign the createdBy parameter
      }

      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      setAppointments(response.data.rows || response.data);
      const total = response.data.count || response.data.length;
      setTotalappointments(total);
      setTotalUsers(total);
      // console.log(total)
    } catch (err) {
      setError("Failed to fetch patients.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignedToMeToggle = useCallback(() => {
    setAssignedToMe((prev) => !prev);
    // setPage(1); // Reset to the first page
    fetchUsers(); // Fetch users with the new filter
  }, []);

  const handleCreatedByMeToggle = useCallback(() => {
    setCreatedByMe((prev) => !prev);
    // setPage(1); // Reset to the first page
    fetchUsers(); // Fetch users with the new filter
  }, []);

  useEffect(() => {
    if (profile) {
      fetchUsers();
    }
  }, [page, rowsPerPage, filterValue, selectedDate, assignedToMe, createdByMe]);
  console.log(totalappointments);
  const getAgeFromDob = (dob: string): number => {
    const birthDate = new Date(dob);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    // Adjust age if the birthday hasn't occurred yet this year
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

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zero to minutes if needed
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
  }, [filterValue, statusFilter]);

  const pages =
    totalappointments > 0 ? Math.ceil(totalappointments / rowsPerPage) : 1;

  const sortedItems = useMemo(() => {
    return [...appointments].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number | string;
      const second = b[sortDescriptor.column as keyof User] as number | string;

      const cmp =
        typeof first === "string"
          ? first.localeCompare(second as string)
          : first - (second as number);

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, appointments]);

  const renderCell = useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    if (columnKey === "age") {
      let age = "";
      try {
        const userJson = JSON.parse(user.json);
        // console.log(userJson.dob)
        const dob = userJson.dob || "";
        age = getAgeFromDob(dob).toString();
        // console.log(age)
      } catch (error) {
        // console.error("Error parsing JSON:", error);
      }

      return <p className="capitalize">{age}</p>;
    }
    if (columnKey === "time") {
      const startTime = extractTime(user.startDateTime);
      // console.log(startTime);

      const endTime = user.endDateTime;
      return (
        <p className="capitalize">
          {startTime}-{extractTime(endTime)}
        </p>
      );
    }
    if (columnKey === "date") {
      const startDate = extractDate(user.dateTime);

      const endDate = extractDate(user.endDateTime);

      return <p>{startDate}</p>;
    }

    if (columnKey === "email") {
      try {
        const userJson = JSON.parse(user.json || "{}");
        const email = userJson.email || "N/A"; // Fallback to "N/A" if email is missing
        return <p>{email}</p>;
      } catch (error) {
        // console.error("Error parsing JSON:", error);
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
      case "role":
        return (
          <div className="flex flex-col">
            <p className="font-bold text-sm capitalize">{cellValue}</p>
            <p className="text-xs capitalize text-gray-400">{}</p>
          </div>
        );
      case "status":
        // const status = user.startDateTime ? "visiting" : "declined";
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
            onPatientDelete={fetchUsers}
          />
        );
      default:
        return cellValue;
    }
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const toggleAddAppointment = useCallback(() => {
    setAddAppointmentModelToggle((prev) => !prev);
  }, []);

  //  const debouncedFetchUser = React.useMemo(
  //      () => debounce((value: string) => searchAppointments(), 500),
  //      [fetchUsers]
  //    );

  const debouncedFetchUsers = useCallback(
    debounce((searchValue: string) => {
      setFilterValue(searchValue);
      fetchUsers();
    }, 500), // Adjust debounce time as needed
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    setFilterValue(value || "");
    setPage(1);
    // fetchUsers();
    //  debouncedFetchUser(value || "");
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    // setSelectedDate(null);
    setPage(1);
  }, []);

  const handleDateChange = (date: CalendarDate | null) => {
    if (date) {
      const jsDate = date.toDate(getLocalTimeZone());
      const formattedDate = `${jsDate.getFullYear()}-${String(jsDate.getMonth() + 1).padStart(2, "0")}-${String(jsDate.getDate()).padStart(2, "0")}`;
      setSelectedDate(formattedDate);
      setSelectedDateShow(formattedDate);
    } else {
      setSelectedDate(null);
      setSelectedDateShow(null);
    }
  };

  const handleDateBlur = () => {
    if (!selectedDateShow) {
      setSelectedDate(null);
      setSelectedDateShow(null);
    } else {
      setSelectedDate(selectedDateShow);
      setPage(1);
      fetchUsers();
    }
  };

  const datePickerValueRef = React.useRef<string | null>(null);

  const topContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col gap-4 w-full">
          {/* <div className="flex justify-between gap-3 items-end"> */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 justify-between  sm:items-end w-full items-center">
            <Input
              isClearable
              // className="w-full sm:max-w-[44%] "
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
              // className="max-w-[284px]"
              className="w-full sm:w-[calc(50%-0.75rem)] h-[42px] sm:h-[46px] md:h-[51px]"
              // value={selectedDate ? parseDate(selectedDate) : undefined}

              value={selectedDateShow ? parseDate(selectedDateShow) : undefined}
              onChange={handleDateChange}
              // onBlur={handleDateBlur}
            />

            <div className="flex flex-wrap gap-2">
              <div className="flex flex-col gap-2 justify-center items-center sm:items-center sm:justify-between w-full mt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    // isSelected={assignedToMe}
                    onChange={handleAssignedToMeToggle}
                    className="text-sm"
                    size="lg"
                    color="secondary"
                  >
                    <p className=" text-xs sm:text-sm">Assigned to Me</p>
                  </Switch>
                  {/* <span className="text-sm text-gray-500">
                Show appointments assigned to me.
              </span> */}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    // isSelected={createdByMe}
                    onChange={handleCreatedByMeToggle}
                    className="text-sm"
                    size="lg"
                    color="secondary"
                  >
                    <p className=" text-xs sm:text-sm">Created by Me</p>
                  </Switch>
                  {/* <span className="text-sm text-gray-500">
                Show appointments I have created.
              </span> */}
                </div>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row gap-4 md:gap-8 w-full md:justify-between"
              style={{
                flexDirection: "column", // Stack dropdowns and buttons for smaller screens (640-898px)
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
                  child={<AddAppointment onUsersAdded={fetchUsers} />}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">
              {`Total ${totalappointments && totalappointments} Appointments`}
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

// onChange={(date) => {
//   if (date) {
//     const jsDate = date.toDate(getLocalTimeZone());

//     // Extract the local date in YYYY-MM-DD format
//     const formattedDate = `${jsDate.getFullYear()}-${String(jsDate.getMonth() + 1).padStart(2, '0')}-${String(jsDate.getDate()).padStart(2, '0')}`;

//     setTempDate(formattedDate); // Update `tempDate`
//     console.log("onChange - Temp Date Updated:", formattedDate);
//     setSelectedDateShow(formattedDate)
//     // Store the immediate value in a local variable for `onBlur`
//     datePickerValueRef.current = formattedDate;
//   } else {
//     setTempDate(null); // Clear `tempDate`
//     console.log("onChange - Temp Date Cleared");

//     // Clear the local variable
//     datePickerValueRef.current = null;
//     setSelectedDateShow(null);
//     setSelectedDate(null);
//   }
// }}
// onBlur={() => {
//   const currentTempDate = datePickerValueRef.current; // Access the most recent value
//   console.log("onBlur - Current Temp Date:", currentTempDate);
//   if (!selectedDateShow) {
//     setSelectedDate(null);
//     setSelectedDateShow(null)
//     setTempDate(null);
//   }
//   if (currentTempDate) {
//     // Fetch for the selected date
//     setTempDate(currentTempDate);
//     setSelectedDate(currentTempDate);
//     setSelectedDateShow(currentTempDate)
//     setPage(1); // Reset to the first page
//     // fetchUsers(); // Fetch appointments for the selected date
//     console.log("onBlur - Fetch Triggered with Date:", currentTempDate);
//   } else {
//     // Fetch all appointments if the date is cleared
//     setSelectedDate(null);
//     setSelectedDateShow(null)
//     setTempDate(null);
//     setPage(1);
//     // fetchUsers(); // Fetch all appointments
//     console.log("onBlur - Fetch Triggered for All Appointments");
//   }
// }}

{
  /*{addAppointmentModelToggle && (
        <OpaqueModal
        modalType={{
          view: MODAL_TYPES.VIEW_APPOINTMENT,
          edit: MODAL_TYPES.EDIT_APPOINTMENT,
          delete: MODAL_TYPES.DELETE_APPOINTMENT,
        }}
        actionButtonName={"Ok"}
        modalTitle={"Appointment"}
        userId="123"  
        onPatientDelete={refreshUsers}
      />
      )} */
}
