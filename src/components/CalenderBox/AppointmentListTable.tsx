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
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Spinner,
} from "@nextui-org/react";
// import { PlusIcon } from "./PlusIcon";
// import { ChevronDownIcon } from "./ChevronDownIcon";
import { SearchIcon } from "./SearchIcon";
import { columns } from "./data";
// import { capitalize } from "./utils";
import OpaqueModal from "../common/Modal/OpaqueList";
import { MODAL_TYPES } from "@/constants";
// import OpaqueDefaultModal from "../common/Modal/OpaqueDefaultModal";
// import AddAppointment from "./AddAppointment";
import axios from "axios";
// import Appointments from "@/app/appointment/page";
// import { CalendarDate } from "@internationalized/date";
// import debounce from "lodash.debounce";

// import {  getLocalTimeZone } from "@internationalized/date";

import { useSelector } from "react-redux";
import { RootState } from "@/store";

const statusColorMap: Record<string, ChipProps["color"]> = {
  visiting: "success",
  declined: "danger",
  unsure: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "age",
  // "date",
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
interface AppointmentListTableProps {
  startTime: string; // Add startTime prop
  endTime: string;
  onRefresh: () => void; // Add endTime prop
}

export default function AppointmentListTable({
  startTime,
  endTime,
  onRefresh,
}: AppointmentListTableProps) {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const profile = useSelector((state: RootState) => state.profile.data);

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const [visibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = React.useState<boolean>(true);
  // const [tempDate, setTempDate] = useState<string | null>(null);

  // const [addAppointmentModelToggle, setAddAppointmentModelToggle] =
  //   useState(false);

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  // const [currentPage, setCurrentPage] = useState(1);

  const [appointments, setAppointments] = React.useState<appointments[]>([]);
  // const [loading, setLoading] = React.useState<boolean>(true);
  // const [error, setError] = React.useState<string | null>(null);
  const [totalappointments, setTotalappointments] = React.useState(0);
  // const [totalUsers, setTotalUsers] = React.useState(0);
  const [selectedDate] = useState<string | null>(null);
  // const [selectedDateShow, setSelectedDateShow] = useState<string | null>(null);
  // const [statusCache, setStatusCache] = React.useState<Record<string, string>>(
  //   {},
  // );

  useEffect(() => {
    localStorage.setItem("page", String(page));
  }, [page]);

  useEffect(() => {
    localStorage.setItem("rowsPerPage", String(rowsPerPage));
  }, [rowsPerPage]);

  const extractDate = (dateTimeString: string): string => {
    const date = dateTimeString;
    return date && date.split("T")[0];
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

  const singleDate =
    appointments.length > 0 ? extractDate(appointments[0].startDateTime) : null;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");

      const fetchedBranchId = profile?.branchId;

      const endpoint = `${API_URL}/appointment/timeslot/${fetchedBranchId}`;

      // const utcStartTime = convertLocalToUTC(startTime);
      // const utcEndTime = convertLocalToUTC(endTime);

      const params: any = {
        page: page,
        pageSize: rowsPerPage,
        startDateTime: startTime,
        endDateTime: endTime,
        // status: ["visiting"],
        from: startTime,
        end: startTime,
      };

      if (filterValue) {
        params.name = filterValue; // API should accept a "search" parameter for filtering
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
      // setTotalUsers(total);
      // console.log(total)
    } catch (err) {
      // setError(`Failed to fetch patients., ${err}||""`);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, filterValue, selectedDate, singleDate]);
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

  type User = (typeof appointments)[0];
  // const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

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
        console.error("Error parsing JSON:", error);
      }

      return <p className="text-xs sm:text-sm ">{age}</p>;
    }
    if (columnKey === "time") {
      const startTime = extractTime(user.startDateTime);
      // console.log(startTime);

      const endTime = user.endDateTime;
      return (
        <p className="text-xs sm:text-sm ">
          {startTime}-{extractTime(endTime)}
        </p>
      );
    }
    // if (columnKey === "date") {
    //   const startDate = extractDate(user.dateTime);

    //   const endDate = extractDate(user.endDateTime)

    //   return   <p className="text-xs sm:text-sm ">
    //   {startDate}
    // </p>
    // }

    if (columnKey === "email") {
      try {
        const userJson = JSON.parse(user.json || "{}");
        const email = userJson.email || "N/A"; // Fallback to "N/A" if email is missing
        return <p className="text-xs sm:text-sm ">{email}</p>;
      } catch (error) {
        console.error("Error parsing JSON:", error);
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
            // onPatientDelete={fetchUsers}
            onPatientDelete={() => {
              fetchUsers(); // Refresh local data
              onRefresh(); // Refresh parent data
            }}
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

  // const toggleAddAppointment = useCallback(() => {
  //   setAddAppointmentModelToggle((prev) => !prev);
  // }, []);

  //  const debouncedFetchUser = React.useMemo(
  //      () => debounce((value: string) => searchAppointments(), 500),
  //      [fetchUsers]
  //    );

  // const debouncedFetchUsers = useCallback(
  //   debounce((searchValue: string) => {
  //     setFilterValue(searchValue);
  //     fetchUsers();
  //   }, 500), // Adjust debounce time as needed
  //   [],
  // );

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

  // const handleDateChange = (date: CalendarDate | null) => {
  //   if (date) {
  //     const jsDate = date.toDate(getLocalTimeZone());
  //     const formattedDate = `${jsDate.getFullYear()}-${String(jsDate.getMonth() + 1).padStart(2, "0")}-${String(jsDate.getDate()).padStart(2, "0")}`;
  //     setSelectedDate(formattedDate);
  //     setSelectedDateShow(formattedDate);
  //   } else {
  //     setSelectedDate(null);
  //     setSelectedDateShow(null);
  //   }
  // };

  // const handleDateBlur = () => {
  //   if (!selectedDateShow) {
  //     setSelectedDate(null);
  //     setSelectedDateShow(null);
  //   } else {
  //     setSelectedDate(selectedDateShow);
  //     setPage(1);
  //     fetchUsers();
  //   }
  // };

  // const datePickerValueRef = React.useRef<string | null>(null);

  const topContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-wrap sm:flex-nowrap gap-3 justify-between  sm:items-end w-full items-center">
            <Input
              isClearable
              className="w-full sm:w-[calc(50%-0.75rem)] h-[40px] sm:h-[45px] md:h-[50px]"
              placeholder="Search by name..."
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
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
          // emptyContent={"No Appointment Available"}
          // items={sortedItems}
          emptyContent={
            loading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" color="primary" />
              </div>
            ) : (
              "No Appointment Available"
            )
          }
          items={loading ? [] : sortedItems}
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
