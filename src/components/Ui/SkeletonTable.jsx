import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Skeleton,
  Box,
} from "@mui/material";

const SkeletonTable = ({
  rowsNum = 5,
  columnsNum = 3,
  height = 400,
  showCheckbox = false,
  showActions = false,
}) => {
  return (
    <Paper style={{ height: height, width: "100%" }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {showCheckbox && (
              <TableCell padding="checkbox">
                <Checkbox disabled />
              </TableCell>
            )}
            {[...Array(columnsNum)].map((_, index) => (
              <TableCell key={index}>
                <Skeleton animation="wave" height={20} width="80%" />
              </TableCell>
            ))}
            {showActions && (
              <TableCell>
                <Skeleton animation="wave" height={20} width="80%" />
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(rowsNum)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {showCheckbox && (
                <TableCell padding="checkbox">
                  <Checkbox disabled />
                </TableCell>
              )}
              {[...Array(columnsNum)].map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton animation="wave" height={20} />
                </TableCell>
              ))}
              {showActions && (
                <TableCell>
                  <Skeleton animation="wave" height={20} width={40} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderTop: "1px solid rgba(224, 224, 224, 1)",
        }}
      >
        <Skeleton animation="wave" height={20} width={100} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Skeleton animation="wave" height={20} width={30} sx={{ mr: 1 }} />
          <Skeleton animation="wave" height={20} width={30} sx={{ mr: 1 }} />
          <Skeleton animation="wave" height={20} width={30} sx={{ mr: 1 }} />
          <Skeleton animation="wave" height={20} width={30} />
        </Box>
      </Box>
    </Paper>
  );
};

export default SkeletonTable;
