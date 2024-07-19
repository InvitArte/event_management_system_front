import React from "react";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const SkeletonTable = ({ rowsNum = 5, columnsNum = 6 }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          {[...Array(columnsNum)].map((_, index) => (
            <TableCell key={index}>
              <Skeleton animation="wave" height={20} width="80%" />
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {[...Array(rowsNum)].map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {[...Array(columnsNum)].map((_, colIndex) => (
              <TableCell key={colIndex}>
                <Skeleton animation="wave" height={20} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SkeletonTable;
