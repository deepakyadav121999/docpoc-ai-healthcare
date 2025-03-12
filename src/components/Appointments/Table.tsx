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
// import { PlusIcon } from "./PlusIcon";

import { ChevronDownIcon } from "../CalenderBox/ChevronDownIcon";

import { SearchIcon } from "../CalenderBox/SearchIcon";
// import {users } from "./data";
import { columns,  statusOptions, users } from "../CalenderBox/data";
import { capitalize } from "../CalenderBox/utils";
import OpaqueModal from "../common/Modal/Opaque";
import { MODAL_TYPES } from "@/constants";
import OpaqueDefaultModel from "../common/Modal/OpaqueDefaultModal";

const statusColorMap: Record<string, ChipProps["color"]> = {
  visiting: "success",
  declined: "danger",
  unsure: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "name",
  "age",
  "time",
  "email",
  "status",
  "actions",
];

type User = (typeof users)[0];

export default function AppointmentTable() {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
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

  const hasSearchFilter = filterValue.length > 0;

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column:any) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
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
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredUsers;
  }, [filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number | string;
      const second = b[sortDescriptor.column as keyof User] as number | string;

      const cmp =
        typeof first === "string"
          ? first.localeCompare(second as string)
          : first - (second as number);

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          />
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="font-bold text-sm capitalize">{cellValue}</p>
            {/* <p className="text-xs capitalize text-gray-400">{user.team}</p> */}
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
              view: MODAL_TYPES.VIEW_APPOINTMENT,
              edit: MODAL_TYPES.EDIT_APPOINTMENT,
              delete: MODAL_TYPES.DELETE_APPOINTMENT,
            }}
            actionButtonName={"Ok"}
            modalTitle={"Appointment"}
            userId=""
            onPatientDelete={()=>{}}
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

  const onSearchChange = useCallback((value?: string) => {
    setFilterValue(value || "");
    setPage(1);
  }, []);

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
              onClear={onClear}
              onValueChange={onSearchChange}
            />
            <DatePicker
              showMonthAndYearPickers
              label="Appointment date"
              className="max-w-[284px]"
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
                  {statusOptions.map((status:any) => (
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
                  {columns.map((column:any) => (
                    <DropdownItem key={column.uid} className="capitalize">
                      {capitalize(column.name)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <OpaqueDefaultModel child="" headingName=""/>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-default-400 text-small">
              Total {users.length} users
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
          {(column:any) => (
            <TableColumn key={column.uid} allowsSorting={column.uid === "age"}>
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
      {addAppointmentModelToggle && (
        <OpaqueModal
          modalType={{
            view: MODAL_TYPES.VIEW_APPOINTMENT,
            edit: MODAL_TYPES.EDIT_APPOINTMENT,
            delete: MODAL_TYPES.DELETE_APPOINTMENT,
          }}
          actionButtonName={"Ok"}
          modalTitle={"Appointment"}
          onPatientDelete ={ () => {}}
          userId ={""} 
        />
      )}
    </>
  );
}
