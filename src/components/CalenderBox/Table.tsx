"use client"

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
import debounce from 'lodash.debounce';
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
  endDateTime: string

}

// type User = (typeof Appointments)[0];

export default function AppointmentTable() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addAppointmentModelToggle, setAddAppointmentModelToggle] =
    useState(false);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);


  const [appointments, setAppointments] = React.useState<appointments[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [totalappointments, setTotalappointments] = React.useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
     
    
      const hospitalEndpoint = "http://127.0.0.1:3037/DocPOC/v1/hospital";
      const hospitalResponse = await axios.get(hospitalEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!hospitalResponse.data || hospitalResponse.data.length === 0) {
        return;
      }

      const fetchedHospitalId = hospitalResponse.data[0].id;
      const branchEndpoint = `http://127.0.0.1:3037/DocPOC/v1/hospital/branches/${fetchedHospitalId}`;
      const branchResponse = await axios.get(branchEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!branchResponse.data || branchResponse.data.length === 0) {
        return;
      }

      const fetchedBranchId = branchResponse.data[0]?.id;

      const endpoint =`http://127.0.0.1:3037/DocPOC/v1/appointment/list/${fetchedBranchId}`;


      const params: any = {
       page:page,
      pageSize: rowsPerPage,

      }
      if (selectedDate) {
        const startOfDay = new Date(selectedDate).toISOString(); // Convert to ISO string
        const endOfDay = new Date(new Date(selectedDate).setHours(23, 59, 59, 999)).toISOString();
        params.from = startOfDay;
        params.to = endOfDay;
      }


      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setAppointments(response.data.rows || response.data);
      setTotalappointments(response.data.count);

    } catch (err) {
      setError("Failed to fetch patients.");
    } finally {
      setLoading(false);
    }
  };
  const searchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint =
        "http://127.0.0.1:3037/DocPOC/v1/appointment/list/12a1c77b-39ed-47e6-b6aa-0081db2c1469"; // Replace with actual search endpoint
      const response = await axios.get(endpoint, {
        params: {
           page,
          pageSize: 1000, 
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAppointments(response.data.rows || []);
      setTotalappointments(response.data.count || response.data.rows.length);
      setPage(1); // Reset to the first page
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {

      fetchUsers();
    
  }, [page, rowsPerPage]);

  const getAgeFromDob = (dob: string): number => {
    const birthDate = new Date(dob);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();

    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  function extractTime(dateTime: string): string {
    const date = new Date(dateTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    hours = hours % 12 || 12;
  
    // Add leading zero to minutes if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${hours}:${formattedMinutes} ${amPm}`;
  }
  const extractDate = (dateTimeString: string): string => {
    const date = (dateTimeString);
    return date &&  date.split("T")[0];
  };

  type User = (typeof appointments)[0];
  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...appointments];

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
  }, [filterValue, statusFilter]);

  const pages = Math.ceil(totalappointments / rowsPerPage);


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

      return <p className="capitalize">{age}</p>;
    }
    if (columnKey === "time") {
      const startTime = extractTime(user.startDateTime);
      console.log(startTime);
      
      const endTime = user.endDateTime;
      return <p className="capitalize">{startTime}-{extractTime(endTime)}</p>;

    }
    if (columnKey === "date") {
      const startDate = extractDate(user.startDateTime);

      const endDate = extractDate(user.endDateTime)

      return <p>{startDate} - {endDate}</p>;
    }

    if (columnKey === "email") {
      try {
        const userJson = JSON.parse(user.json || "{}");
        const email = userJson.email || "N/A"; // Fallback to "N/A" if email is missing
        return <p>{email}</p>;
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
            <p className="text-xs capitalize text-gray-400">{ }</p>
          </div>
        );
      case "status":
        const status = user.startDateTime ? "visiting" : "declined";
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

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const toggleAddAppointment = useCallback(() => {
    setAddAppointmentModelToggle((prev) => !prev);
  }, []);


//  const debouncedFetchUser = React.useMemo(
//      () => debounce((value: string) => searchAppointments(), 500),
//      [fetchUsers]
//    );
 
   const onSearchChange = React.useCallback((value?: string) => {
     setFilterValue(value || "");
     setPage(1);
    //  debouncedFetchUser(value || "");
   },[]);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex flex-col justify-center items-center w-full">
        <div className="flex flex-col gap-4 w-full">
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
            <DatePicker
              showMonthAndYearPickers
              label="Appointment date"
              className="max-w-[284px]"
              onBlur={(date) => {
                if (date && date instanceof Date && !isNaN(date.getTime())) {
                  setSelectedDate(date.toISOString().split('T')[0]);
                  setPage(1);
                  fetchUsers();
                } else {
                  setSelectedDate(null);
                  setPage(1);
                  fetchUsers();
                }
              }}
            />
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
              <OpaqueDefaultModal headingName="Add New Appointment" child={<AddAppointment onUsersAdded={fetchUsers}/>} />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">
              Total {totalappointments} Appointments
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
  }, [onClear, onSearchChange, visibleColumns, statusFilter, filterValue, onRowsPerPageChange]);


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
        onChange={handlePageChange}
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
            <TableColumn
              key={column.uid}
              allowsSorting={column.uid === "age"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems}>
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
      {/*{addAppointmentModelToggle && (
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
      )} */}
    </>
  );
}
