"use client";
import React, { useState, useEffect } from "react";
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
} from "@nextui-org/react";
import { PlusIcon } from "./PlusIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { SearchIcon } from "./SearchIcon";
import { columns, users, statusOptions } from "./data";
import { capitalize } from "./utils";
import OpaqueModal from "../common/Modal/Opaque";
import { MODAL_TYPES } from "@/constants";
import OpaqueDefaultModal from "../common/Modal/OpaqueDefaultModal";
import { Spinner } from "@nextui-org/react";
import AddEmployee from "./AddEmployee";
import debounce from 'lodash.debounce';
import axios from "axios";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  inactive: "warning",
  blacklisted: "danger",
};




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
interface Employee {
  id: string;
  name: string;
  age: number;
  bloodGroup: string;
  phone: string;
  email: string;
  status: string;
  lastVisit: string;
  displayPicture: string;
  isActive:string;
  json:string;

}

type User = (typeof users)[0];

export default function DataTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])  
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  const [users, setUsers] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const[branchId, setBranchId] = useState('')

  const fetchUsers = async (searchName = "", selectedStatuses: string[] = []) => {
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
      setBranchId(fetchedBranchId)

      const endpoint = `http://127.0.0.1:3037/DocPOC/v1/user/list/${fetchedBranchId}`;
      const params: any = {};
        params.page = page;
        params.pageSize = rowsPerPage;
        params.from = '2024-12-04T03:32:25.812Z';
        params.to = '2024-12-11T03:32:25.815Z';
      const response = await axios.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUsers(response.data.rows || response.data);
      setTotalUsers(response.data.count || response.data.length);
    } catch (err) {
      setError("Failed to fetch users.");
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

type User = (typeof users)[0];
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

  // Apply the status filter
  if (
    statusFilter !== "all" &&
    Array.from(statusFilter).length > 0 // Ensure there are selected statuses
  ) {
    filteredUsers = filteredUsers.filter((user) => {
      const userStatus = user.isActive ? "active" : "inactive"; // Map isActive to "active" or "inactive"
      return Array.from(statusFilter).includes(userStatus); // Check if it matches selected statuses
    });
  }


  return filteredUsers;
}, [users, filterValue, statusFilter]);
const handleStatusFilterChange = (selected: Selection) => {
  setStatusFilter(selected);
};

  const pages = Math.ceil(totalUsers / rowsPerPage);

  const items = filteredItems;

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


    if (columnKey === "age") {
  
      let age = "";
      try {
        const userJson = JSON.parse(user.json);
        const dob = userJson.dob || ""; 
        age = getAgeFromDob(dob).toString(); 
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
  
      return <p className="capitalize">{age}</p>;
    }



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
        const status = user.isActive ? "Active" : "Inactive";
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
            view: MODAL_TYPES.VIEW_EMPLOYEE,
            edit: MODAL_TYPES.EDIT_EMPLOYEE,
            delete: MODAL_TYPES.DELETE_EMPLOYEE,
          }}
          actionButtonName={"Ok"}
          modalTitle={"Employee"}
          userId={user.id}
          onPatientDelete={fetchUsers}
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
  const debouncedFetchUser = React.useMemo(
    () => debounce((value: string) => fetchUsers(value), 500),
    [fetchUsers]
  );

  const onSearchChange = React.useCallback((value?: string) => {
    setFilterValue(value || "");
    setPage(1);
    debouncedFetchUser(value || "");
  }, [debouncedFetchUser]);

  // const onSearchChange = React.useCallback((value?: string) => {
  //   if (value) {
  //     setFilterValue(value|| " ");
  //     setPage(1);
  //   } else {
  //     setFilterValue("");
  //   }
  // }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

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
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                  style={{minHeight: 55}}
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
                onSelectionChange={handleStatusFilterChange}
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
                  style={{minHeight: 55}}
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
            <OpaqueDefaultModal headingName="Add New Employee" child={<AddEmployee onUsersAdded={fetchUsers} />} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalUsers} users
          </span>
          <label className="flex items-center text-default-400 text-small">
            {/* Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select> */}
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
      <TableBody emptyContent={loading?" ":"No users found"} items={sortedItems}>
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
