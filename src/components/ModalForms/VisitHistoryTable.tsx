import React from "react";
import {
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { users } from "./data";
import { SVGIconProvider } from "@/constants/svgIconProvider";

export const VisitHistoryTable = () => {
  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(3);

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const lowerCaseFilter = filterValue.toLowerCase();
      return (
        user.date.toLowerCase().includes(lowerCaseFilter) ||
        user.doctor.toLowerCase().includes(lowerCaseFilter)
      );
    });
  }, [filterValue]);

  const pages = Math.ceil(filteredUsers.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [page, filteredUsers]);

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  return (
    <>
      <div className="flex w-full justify-center" style={{ marginBottom: 5 }}>
        <Input
          isClearable
          className="w-full sm:max-w-[100%]"
          placeholder="Search by date or doctor.."
          startContent={<SVGIconProvider iconName="search" />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
      </div>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="date">DATE</TableColumn>
          <TableColumn key="doctor">DOCTOR</TableColumn>
          <TableColumn key="report">REPORT</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.doctor}>
              {(columnKey) => (
                <TableCell>
                  {columnKey === "report" ? (
                    <a
                      href={getKeyValue(item, columnKey)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <SVGIconProvider iconName="download" />
                    </a>
                  ) : (
                    getKeyValue(item, columnKey)
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
