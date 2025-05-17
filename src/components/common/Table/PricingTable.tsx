import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { GLOBAL_ACTION_ICON_COLOR, TOOL_TIP_COLORS } from "@/constants";

// interface Colors {
//   rowColor:
//     | "default"
//     | "primary"
//     | "secondary"
//     | "success"
//     | "warning"
//     | "danger";
// }

interface PricingTableProps {
  tableHeader: string[];
  tableData: string[][];
  tableFooterText?: string;
}

const PricingTable: React.FC<PricingTableProps> = ({
  tableHeader,
  tableData,
  tableFooterText,
}) => {
  // const [selectedColor, setSelectedColor] = React.useState<TOOL_TIP_COLORS>(
  //   TOOL_TIP_COLORS.success,
  // );

  const selectedColor = TOOL_TIP_COLORS.success;
  return (
    <div className="flex flex-col gap-3" style={{ marginTop: -30 }}>
      <Table
        color={selectedColor}
        selectionMode="single"
        defaultSelectedKeys={["1"]}
        aria-label="Example static collection table"
        style={{ minHeight: 200 }}
      >
        <TableHeader>
          {tableHeader.map((header, index) => (
            <TableColumn key={index}> {header}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {tableData.map((row, cellIndex) => (
            <TableRow key={cellIndex}>
              {row.map((cell, index) => (
                <TableCell key={index}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tableFooterText && (
        <div>
          {" "}
          <h4>{tableFooterText}</h4>{" "}
          <a
            style={{ color: GLOBAL_ACTION_ICON_COLOR }}
            target="_blank"
            href="https://slicedinvoices.com/pdf/wordpress-pdf-invoice-plugin-sample.pdf"
          >
            Click here to get invoices!
          </a>
        </div>
      )}
    </div>
  );
};

export default PricingTable;
