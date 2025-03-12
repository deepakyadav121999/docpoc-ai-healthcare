// import React from "react";
// import {
//   Input,
//   Pagination,
//   Table,
//   TableBody,
//   TableCell,
//   TableColumn,
//   TableHeader,
//   TableRow,
//   getKeyValue,
// } from "@nextui-org/react";
// import { users } from "./data";
// import { SVGIconProvider } from "@/constants/svgIconProvider";
// import axios from "axios";
// export const VisitHistoryTable =  ({ patientId }) => {
//   const [page, setPage] = React.useState(1);
//   const [filterValue, setFilterValue] = React.useState("");
//   const [rowsPerPage, setRowsPerPage] = React.useState(3);
//   const [visitData, setVisitData] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);

//   React.useEffect(() => {
//     const fetchVisitData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(
//           `http://127.0.0.1:3037/DocPOC/v1/appointment/visits/patient/${patientId}`
//         );
//         const formattedData = response.data.map((item:any) => ({
//           date: new Date(item.dateTime).toLocaleDateString(), // Extract and format the dateTime
//           doctor: item.doctorName, // Extract doctorName
//           report: "#", // Keeping the report section as is for now
//         }));
//         setVisitData(formattedData);
//       } catch (error) {
//         console.error("Error fetching visit data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (patientId) {
//       fetchVisitData();
//     }
//   }, [patientId]);

//   // const filteredUsers = React.useMemo(() => {
//   //   return users.filter((user) => {
//   //     const lowerCaseFilter = filterValue.toLowerCase();
//   //     return (
//   //       user.date.toLowerCase().includes(lowerCaseFilter) ||
//   //       user.doctor.toLowerCase().includes(lowerCaseFilter)
//   //     );
//   //   });
//   // }, [filterValue]);

//   const filteredVisits = React.useMemo(() => {
//     const lowerCaseFilter = filterValue.toLowerCase();
//     return visitData.filter((visit) => {
//       return (
//         visit.date.toLowerCase().includes(lowerCaseFilter) ||
//         visit.doctor.toLowerCase().includes(lowerCaseFilter)
//       );
//     });
//   }, [filterValue, visitData]);

//   // const pages = Math.ceil(filteredUsers.length / rowsPerPage);
//   const pages = Math.ceil(filteredVisits.length / rowsPerPage);

//   // const items = React.useMemo(() => {
//   //   const start = (page - 1) * rowsPerPage;
//   //   const end = start + rowsPerPage;
//   //   return filteredUsers.slice(start, end);
//   // }, [page, filteredUsers]);
//   const items = React.useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;
//     return filteredVisits.slice(start, end);
//   }, [page, filteredVisits]);

//   const onSearchChange = React.useCallback((value?: string) => {
//     if (value) {
//       setFilterValue(value);
//       setPage(1);
//     } else {
//       setFilterValue("");
//     }
//   }, []);

//   const onClear = React.useCallback(() => {
//     setFilterValue("");
//     setPage(1);
//   }, []);

//   return (
//     <>
//       <div className="flex w-full justify-center" style={{ marginBottom: 5 }}>
//         <Input
//           isClearable
//           className="w-full sm:max-w-[100%]"
//           placeholder="Search by date or doctor.."
//           startContent={<SVGIconProvider iconName="search" />}
//           value={filterValue}
//           onClear={() => onClear()}
//           onValueChange={onSearchChange}
//         />
//       </div>
//       <Table
//         aria-label="Example table with client side pagination"
//         bottomContent={
//           <div className="flex w-full justify-center">
//             <Pagination
//               isCompact
//               showControls
//               showShadow
//               color="secondary"
//               page={page}
//               total={pages}
//               onChange={(page) => setPage(page)}
//             />
//           </div>
//         }
//         classNames={{
//           wrapper: "min-h-[222px]",
//         }}
//       >
//         <TableHeader>
//           <TableColumn key="date">DATE</TableColumn>
//           <TableColumn key="doctor">DOCTOR</TableColumn>
//           <TableColumn key="report">REPORT</TableColumn>
//         </TableHeader>
//         <TableBody items={items}>
//           {(item) => (
//             <TableRow key={item.doctor}>
//               {(columnKey) => (
//                 <TableCell>
//                   {columnKey === "report" ? (
//                     <a
//                       href={getKeyValue(item, columnKey)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <SVGIconProvider iconName="download" />
//                     </a>
//                   ) : (
//                     getKeyValue(item, columnKey)
//                   )}
//                 </TableCell>
//               )}
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </>
//   );
// };

// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import {
//   Input,
//   Pagination,
//   Table,
//   TableBody,
//   TableCell,
//   TableColumn,
//   TableHeader,
//   TableRow,
//   getKeyValue,
// } from "@nextui-org/react";
// import axios from "axios";
// import { SVGIconProvider } from "@/constants/svgIconProvider";
// import { Spinner, user } from "@nextui-org/react";

// // Define type for visit data
// interface VisitData {
//   date: string; // Formatted date string
//   doctor: string; // Doctor's name
//   report: string; // Report placeholder (can be updated later)
// }

// interface VisitHistoryTableProps {
//   patientId: string; // patientId must be a string
// }
// const API_URL = process.env.API_URL;
// export const VisitHistoryTable: React.FC<VisitHistoryTableProps> = ({ patientId }) => {
//   const [page, setPage] = useState<number>(1);
//   const [filterValue, setFilterValue] = useState<string>("");
//   const [rowsPerPage, setRowsPerPage] = useState<number>(3);
//   const [visitData, setVisitData] = useState<VisitData[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const formatDateToDDMMYYYY = (dateTimeString: string): string => {
//     const dateObj = new Date(dateTimeString);
//     const day = String(dateObj.getDate()).padStart(2, "0");
//     const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
//     const year = dateObj.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   // Fetch visit data from the API
//   useEffect(() => {
//     const fetchVisitData = async () => {

//       const token = localStorage.getItem("docPocAuth_token");
//       const endpoint = `${API_URL}/appointment/visits/patient/${patientId}`;

//       try {
//         setLoading(true);
//         const response = await axios.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//      const formattedData = response.data.map((item: any) => ({
//           date: formatDateToDDMMYYYY(item.dateTime), // Format date to dd/mm/yyyy
//           doctor: item.doctorName, // Extract doctorName
//           report: "#", // Placeholder for report (can be updated later)
//         }));
//         setVisitData(formattedData);
//       } catch (error) {
//         console.error("Error fetching visit data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (patientId) {
//       fetchVisitData();
//     }
//   }, [patientId]);

//   // Filtered data based on the search input
//   const filteredVisits = useMemo(() => {
//     const lowerCaseFilter = filterValue.toLowerCase();
//     return visitData.filter((visit) => {
//       return (
//         visit.date.toLowerCase().includes(lowerCaseFilter) ||
//         visit.doctor.toLowerCase().includes(lowerCaseFilter)
//       );
//     });
//   }, [filterValue, visitData]);

//   // Paginated data
//   const pages = Math.ceil(filteredVisits.length / rowsPerPage);
//   const items = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;
//     return filteredVisits.slice(start, end);
//   }, [page, filteredVisits]);

//   // Handle search input change
//   const onSearchChange = useCallback((value: string) => {
//     if (value) {
//       setFilterValue(value);
//       setPage(1);
//     } else {
//       setFilterValue("");
//     }
//   }, []);

//   // Clear search input
//   const onClear = useCallback(() => {
//     setFilterValue("");
//     setPage(1);
//   }, []);

//   return (
//     <>
//      <div>
//           {loading && (
//             // <div className="absolute inset-0 flex justify-center items-center bg-gray-900  z-50">
//               <Spinner />
//             // </div>
//           )}
//         </div>
//       <div className="flex w-full justify-center" style={{ marginBottom: 5 }}>
//         <Input
//           isClearable
//           className="w-full sm:max-w-[100%]"
//           placeholder="Search by date or doctor.."
//           startContent={<SVGIconProvider iconName="search" />}
//           value={filterValue}
//           onClear={() => onClear()}
//           onValueChange={(value) => onSearchChange(value as string)}
//         />
//       </div>
//       {loading ? (
//         <div className="flex justify-center items-center">
//           <SVGIconProvider iconName="spinner" />
//         </div>
//       ) : (
//         <Table
//           aria-label="Example table with client side pagination"
//           bottomContent={
//             <div className="flex w-full justify-center">
//               <Pagination
//                 isCompact
//                 showControls
//                 showShadow
//                 color="secondary"
//                 page={page}
//                 total={pages}
//                 onChange={(page) => setPage(page)}
//               />
//             </div>
//           }
//           classNames={{
//             wrapper: "min-h-[222px]",
//           }}
//         >
//           <TableHeader>
//             <TableColumn key="date">DATE</TableColumn>
//             <TableColumn key="doctor">DOCTOR</TableColumn>
//             <TableColumn key="report">REPORT</TableColumn>
//           </TableHeader>
//           <TableBody items={items}>
//             {(item: VisitData) => (
//               <TableRow key={item.date + item.doctor}>
//                 {(columnKey) => (
//                   <TableCell>
//                     {columnKey === "report" ? (
//                       <a
//                         href={getKeyValue(item, columnKey)}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <SVGIconProvider iconName="download" />
//                       </a>
//                     ) : (
//                       getKeyValue(item, columnKey)
//                     )}
//                   </TableCell>
//                 )}
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       )}
//     </>
//   );
// };

import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import axios from "axios";
import { SVGIconProvider } from "@/constants/svgIconProvider";
import { Spinner, user } from "@nextui-org/react";

// Define type for visit data
interface VisitData {
  date: string; // Formatted date string
  doctor: string; // Doctor's name
  report: string; // Report placeholder (can be updated later)
}

interface VisitHistoryTableProps {
  patientId: string; // patientId must be a string
}
const API_URL = process.env.API_URL;
export const VisitHistoryTable: React.FC<VisitHistoryTableProps> = ({
  patientId,
}) => {
  const [page, setPage] = useState<number>(1);
  const [filterValue, setFilterValue] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(3);
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const formatDateToDDMMYYYY = (dateTimeString: string): string => {
    const dateObj = new Date(dateTimeString);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fetch visit data from the API
  useEffect(() => {
    const fetchVisitData = async () => {
      const token = localStorage.getItem("docPocAuth_token");
      const endpoint = `${API_URL}/appointment/visits/patient/${patientId}`;

      try {
        setLoading(true);
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const formattedData = response.data.map((item: any) => ({
          date: formatDateToDDMMYYYY(item.dateTime), // Format date to dd/mm/yyyy
          doctor: item.doctorName, // Extract doctorName
          report: "#", // Placeholder for report (can be updated later)
        }));
        setVisitData(formattedData);
      } catch (error) {
        console.error("Error fetching visit data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchVisitData();
    }
  }, [patientId]);

  // Filtered data based on the search input
  const filteredVisits = useMemo(() => {
    const lowerCaseFilter = filterValue.toLowerCase();
    return visitData.filter((visit) => {
      return (
        visit.date.toLowerCase().includes(lowerCaseFilter) ||
        visit.doctor.toLowerCase().includes(lowerCaseFilter)
      );
    });
  }, [filterValue, visitData]);

  // Paginated data
  const pages = Math.ceil(filteredVisits.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredVisits.slice(start, end);
  }, [page, filteredVisits]);

  // Handle search input change
  const onSearchChange = useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  // Clear search input
  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  return (
    <>
      <div>{loading && <Spinner />}</div>
      <div
        className="flex w-full justify-center px-2 sm:px-4"
        style={{ marginBottom: 5 }}
      >
        <Input
          isClearable
          className="w-full max-w-[97%] sm:max-w-md"
          placeholder="Search by date or doctor.."
          startContent={<SVGIconProvider iconName="search" />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={(value) => onSearchChange(value as string)}
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <SVGIconProvider iconName="spinner" />
        </div>
      ) : (
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
            wrapper: "min-h-[222px] max-w-[95%] sm:max-w-[100%] mx-auto",
          }}
        >
          <TableHeader>
            <TableColumn key="date">DATE</TableColumn>
            <TableColumn key="doctor">DOCTOR</TableColumn>
            <TableColumn key="report">REPORT</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {(item: VisitData) => (
              <TableRow key={item.date + item.doctor}>
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
      )}
    </>
  );
};
