"use client";
import { useRef } from "react";

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
  Spinner,
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
// import debounce from "lodash.debounce";
import { getLocalTimeZone } from "@internationalized/date";
import { Switch } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchAppointments } from "@/store/slices/appointmentsSlice";
import debounce from "lodash.debounce";
import type { DebouncedFunc } from "lodash";
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

// interface appointments {
//   id: string;
//   name: string;
//   age: number;
//   bloodGroup: string;
//   phone: string;
//   email: string;
//   status: string;
//   lastVisit: string;
//   displayPicture: string;
//   isActive: string;
//   json: string;
//   startDateTime: string;
//   endDateTime: string;
//   dateTime: string;
//   statusName: string;
// }
const AWS_URL = process.env.NEXT_PUBLIC_AWS_URL;

export default function AppointmentTable() {
  const [appointmentMessage, setAppointmentMessage] = useState<{
    success?: string;
    error?: string;
  }>({});
  const dispatch = useDispatch<AppDispatch>();
  const { onClose } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateShow, setSelectedDateShow] = useState<string | null>(null);
  const [assignedToMe, setAssignedToMe] = useState(false);
  const [createdByMe, setCreatedByMe] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  // const [addAppointmentModelToggle, setAddAppointmentModelToggle] =
  //   useState(false);
  console.log(appointmentMessage);

  const profile = useSelector((state: RootState) => state.profile.data);
  const appointments = useSelector(
    (state: RootState) => state.appointments.data,
  );
  const loading = useSelector((state: RootState) => state.appointments.loading);
  // const error = useSelector((state: RootState) => state.appointments.error);
  const totalAppointments = useSelector(
    (state: RootState) => state.appointments.total,
  );

  const debouncedFetchRef =
    useRef<DebouncedFunc<(searchValue: string) => void>>();
  const debouncedDateFetchRef =
    useRef<DebouncedFunc<(date: string | null) => void>>();

  useEffect(() => {
    localStorage.setItem("page", String(page));
  }, [page]);

  useEffect(() => {
    localStorage.setItem("rowsPerPage", String(rowsPerPage));
  }, [rowsPerPage]);

  // const fetchUsers = useCallback(() => {

  //   if (!profile) return;

  //   const params: any = {
  //     page,
  //     pageSize: rowsPerPage,
  //     from: "2024-12-01T00:00:00.000Z",
  //     to: "2025-12-31T23:59:59.999Z",
  //     branchId: profile.branchId, // Ensure branchId is included
  //   };

  //   if (selectedDate) {
  //     params.from = selectedDate;
  //     params.to = selectedDate;
  //   }

  //   if (filterValue && searchTerm) {
  //     params.name = filterValue;
  //   }

  //   if (assignedToMe && profile.id) {
  //     params.doctorId = profile.id;
  //   }

  //   if (createdByMe && profile.id) {
  //     params.createdBy = profile.id;
  //   }

  //   dispatch(fetchAppointments(params));
  // }, [page, rowsPerPage, filterValue, selectedDate, assignedToMe, createdByMe, profile, dispatch]);

  const fetchUsers = useCallback(() => {
    if (!profile) return;

    const params: any = {
      page,
      pageSize: rowsPerPage,
      // from: "2024-12-01T00:00:00.000Z",
      // to: "2040-12-31T23:59:59.999Z",
      branchId: profile.branchId,
    };

    if (selectedDate) {
      params.from = selectedDate;
      params.to = selectedDate;
    }

    if (filterValue && searchTerm) {
      params.name = filterValue;
    }

    if (assignedToMe && profile.id) {
      params.doctorId = profile.id;
    }

    if (createdByMe && profile.id) {
      params.createdBy = profile.id;
    }

    console.log("Fetching users with params:", params); // Debugging line

    dispatch(fetchAppointments(params));
  }, [
    page,
    rowsPerPage,
    filterValue,
    selectedDate,
    assignedToMe,
    createdByMe,
    profile,
    dispatch,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // const getAgeFromDob = (dob: string): number => {
  //   const birthDate = new Date(dob);
  //   const currentDate = new Date();
  //   let age = currentDate.getFullYear() - birthDate.getFullYear();
  //   const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  //   if (
  //     monthDifference < 0 ||
  //     (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
  //   ) {
  //     age--;
  //   }
  //   return age;
  // };

  const getAgeFromDob = (dob: string): string => {
    try {
      const birthDate = new Date(dob);
      const currentDate = new Date();

      // Check if date is valid
      if (isNaN(birthDate.getTime())) return "N/A";

      // Check if date is in future
      if (birthDate > currentDate) {
        return "N/A";
      }

      let age = currentDate.getFullYear() - birthDate.getFullYear();
      const monthDifference = currentDate.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      // Handle negative ages (shouldn't happen due to future check)
      return age >= 0 ? age.toString() : "N/A";
    } catch (error) {
      console.error("Error calculating age from DOB:", error);
      return "N/A";
    }
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
  // const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  // const filteredItems = useMemo(() => {
  //   let filteredUsers = [...appointments];
  //   if (hasSearchFilter) {
  //     filteredUsers = filteredUsers.filter((user) =>
  //       user.name.toLowerCase().includes(filterValue.toLowerCase()),
  //     );
  //   }
  //   if (
  //     statusFilter !== "all" &&
  //     Array.from(statusFilter).length !== statusOptions.length
  //   ) {
  //     filteredUsers = filteredUsers.filter((user) =>
  //       Array.from(statusFilter).includes(user.status),
  //     );
  //   }
  //   return filteredUsers;
  // }, [filterValue, statusFilter, appointments]);

  const pages =
    totalAppointments > 0 ? Math.ceil(totalAppointments / rowsPerPage) : 1;

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

  const renderCell = useCallback(
    (user: User, columnKey: React.Key) => {
      const cellValue = user[columnKey as keyof User];
      if (columnKey === "age") {
        let age = "";
        try {
          const userJson = JSON.parse(user.json);
          const dob = userJson.dob || "";
          age = getAgeFromDob(dob).toString();
        } catch (err) {
          console.log(err);
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
        return <p>{startDate}</p>;
      }
      if (columnKey === "email") {
        try {
          const userJson = JSON.parse(user.json || "{}");
          const email = userJson.email || "N/A";

          return <p>{email}</p>;
        } catch (error) {
          console.log(error);
        }
      }
      switch (columnKey) {
        case "name":
          const gender = user.gender || "unknown"; // Directly access the gender property
          const placeholderImage =
            gender.toLowerCase() === "male"
              ? `${AWS_URL}/docpoc-images/user-male.jpg`
              : `${AWS_URL}/docpoc-images/user-female.jpg`;
          const avatarSrc = user.patient?.displayPicture || placeholderImage;

          return (
            <User
              avatarProps={{ radius: "lg", src: avatarSrc }}
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
              onPatientDelete={fetchUsers}
            />
          );
        default:
          return cellValue;
      }
    },
    [fetchUsers],
  );

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

  // const debouncedFetchUsers = useCallback(
  //   debounce((searchValue: string) => {
  //     setFilterValue(searchValue);
  //     fetchUsers();
  //   }, 500),
  //   [fetchUsers],
  // );

  // const onSearchChange = React.useCallback((value?: string) => {

  //   setPage(1);
  // }, []);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce is initialized once and uses latest fetchUsers
  useEffect(() => {
    debouncedFetchRef.current = debounce((searchValue: string) => {
      setFilterValue(searchValue);
      fetchUsers();
    }, 500);

    return () => {
      debouncedFetchRef.current?.cancel();
    };
  }, [fetchUsers]);

  const onSearchChange = (value?: string) => {
    const val = value || "";
    setSearchTerm(val);
    setPage(1);
    debouncedFetchRef.current?.(val);
  };

  const onClear = useCallback(() => {
    debouncedFetchRef.current?.cancel(); // ✅ No more TS error
    setFilterValue("");
    setSearchTerm("");
    setPage(1);
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    debouncedDateFetchRef.current = debounce((date: string | null) => {
      setSelectedDate(date);
      setPage(1);
      fetchUsers();
    }, 500);

    return () => {
      debouncedDateFetchRef.current?.cancel();
    };
  }, [fetchUsers]);

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
  const handleDateChange = (date: CalendarDate | null) => {
    if (date) {
      const jsDate = date.toDate(getLocalTimeZone());
      const formattedDate = `${jsDate.getFullYear()}-${String(jsDate.getMonth() + 1).padStart(2, "0")}-${String(jsDate.getDate()).padStart(2, "0")}`;
      setSelectedDateShow(formattedDate);
      debouncedDateFetchRef.current?.(formattedDate); // 🔥 Debounced
    } else {
      setSelectedDateShow(null);
      debouncedDateFetchRef.current?.(null); // 🔥 Debounced clear
    }
  };

  const handleModalClose = () => {
    onClose();

    // alert("modal is closed")
  };

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
  // const handleToggle = useCallback(
  //   (setter: React.Dispatch<React.SetStateAction<boolean>>, key: 'doctorId' | 'createdBy') => {
  //     if (switchLoading || loading) return; // Prevent toggling if loading

  //     setter((prev) => !prev);
  //     setSwitchLoading(true);

  //     // Update the state that fetchUsers relies on
  //     if (key === 'doctorId') {
  //       setAssignedToMe((prev) => !prev);
  //     } else if (key === 'createdBy') {
  //       setCreatedByMe((prev) => !prev);
  //     }

  //     // Introduce a delay before calling fetchUsers
  //     setTimeout(() => {
  //       fetchUsers();
  //       setSwitchLoading(false); // Reset loading state after delay
  //     }, 1000); // Adjust the delay as needed
  //   },
  //   [switchLoading, loading, fetchUsers]
  // );

  // const handleToggle = useCallback(
  //   (setter: React.Dispatch<React.SetStateAction<boolean>>, key: 'doctorId' | 'createdBy') => {
  //     if (switchLoading || loading) return; // Prevent toggling if loading

  //     setter((prev) => !prev);
  //     setSwitchLoading(true);

  //     // Update the state that fetchUsers relies on
  //     if (key === 'doctorId') {
  //       setAssignedToMe((prev) => !prev);
  //     } else if (key === 'createdBy') {
  //       setCreatedByMe((prev) => !prev);
  //     }

  //     // Simulate a delay to manage switch loading state
  //     setTimeout(() => {
  //       setSwitchLoading(false); // Reset loading state after delay
  //     }, 1000); // Adjust the delay as needed
  //   },
  //   [switchLoading, loading]
  // );

  const handleToggle = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<boolean>>,
      //  key: "doctorId" | "createdBy"
    ) => {
      if (switchLoading || loading) return; // Prevent toggling if already loading

      setSwitchLoading(true); // Set loading state to true
      setter((prev) => !prev); // Toggle the state

      // Call fetchUsers after state update
      fetchUsers();

      // Re-enable the switch after 10 seconds
      setTimeout(() => {
        setSwitchLoading(false);
      }, 1000); // 10 seconds delay
    },
    [switchLoading, loading, fetchUsers],
  );

  const topContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-wrap xl:flex-nowrap  gap-3 justify-between sm:items-end w-full items-center">
            {/* sm:flex-nowrap */}
            <Input
              isClearable
              className="w-full sm:w-[calc(50%-0.75rem)] h-[40px] sm:h-[45px] md:h-[50px]"
              placeholder="Search by name..."
              startContent={<SearchIcon />}
              value={searchTerm}
              onClear={onClear}
              onValueChange={onSearchChange}
            />
            <DatePicker
              showMonthAndYearPickers
              label="Appointment date"
              className="w-full sm:w-[calc(50%-0.75rem)] h-[42px] sm:h-[46px] md:h-[51px]"
              // value={selectedDateShow ? parseDate(selectedDateShow) : undefined}
              value={
                selectedDateShow && /^\d{4}-\d{2}-\d{2}$/.test(selectedDateShow)
                  ? parseDate(selectedDateShow)
                  : undefined
              }
              onChange={handleDateChange}
            />

            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2 justify-center items-center sm:items-center sm:justify-between w-full mt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    // onChange={() => setAssignedToMe((prev) => !prev)}
                    onChange={() =>
                      handleToggle(
                        setAssignedToMe,
                        //  "doctorId"
                      )
                    }
                    className="text-sm"
                    size="lg"
                    color="secondary"
                    isDisabled={switchLoading || loading}
                  >
                    <p className="text-xs sm:text-sm">Assigned to Me</p>
                  </Switch>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    // onChange={() => setCreatedByMe((prev) => !prev)}
                    onChange={() =>
                      handleToggle(
                        setCreatedByMe,
                        //  "createdBy"
                      )
                    }
                    className="text-sm"
                    size="lg"
                    color="secondary"
                    isDisabled={switchLoading || loading}
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
                      onUsersAdded={fetchUsers}
                      onClose={handleModalClose}
                      onMessage={(message) => {
                        setAppointmentMessage(message);
                        // Auto-close only on success after 3 seconds
                        if (message.success) {
                          setTimeout(() => handleModalClose(), 3000);
                        }
                      }}
                    />
                  }
                  onClose={handleModalClose}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">
              {`Total ${totalAppointments && totalAppointments} Appointments`}
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
        {/* <TableBody
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
        </TableBody> */}

        <TableBody
          emptyContent={
            loading ? (
              <div className="flex justify-center items-center h-[200px]">
                <Spinner size="sm" label="Loading..." color="secondary" />
              </div>
            ) : (
              "No Appointment Available"
            )
          }
          items={loading ? [] : sortedItems} // Show empty table when loading
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
