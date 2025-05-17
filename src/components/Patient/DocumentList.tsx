import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
} from "@nextui-org/react";
import { SVGIconProvider } from "@/constants/svgIconProvider";

interface DocumentListProps {
  documents: Record<string, string>; // Assuming documents is an object with key-value pairs
}
const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const documentEntries = useMemo(
    () => Object.entries(documents || {}),
    [documents],
  );
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 3; // Set the number of documents per page

  // Paginated data
  const pages = Math.ceil(documentEntries.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return documentEntries.slice(start, end);
  }, [page, documentEntries]);

  if (!documentEntries.length) {
    return (
      <p className="text-sm text-center text-foreground/70">
        No documents to display.
      </p>
    );
  }

  return (
    <div
      className="flex w-full justify-center px-2 sm:px-4"
      style={{ marginBottom: 5 }}
    >
      <Table
        aria-label="Documents table with pagination"
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
          <TableColumn key="name">DOCUMENT NAME</TableColumn>
          <TableColumn key="action">ACTION</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {([name, url]) => (
            <TableRow key={name}>
              <TableCell>{name}</TableCell>
              <TableCell>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <SVGIconProvider iconName="download" />
                </a>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default DocumentList;
