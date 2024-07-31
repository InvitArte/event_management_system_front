import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TableSortLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeIcon from "@mui/icons-material/QrCode";

const ContactTable = ({
  contacts,
  onRowClick,
  sortModel,
  onSortModelChange,
  onDeleteContact,
  onGenerateQR,
}) => {
  const columns = [
    { field: "name", headerName: "Nombre" },
    { field: "email", headerName: "Email" },
    { field: "phone", headerName: "Teléfono" },
    { field: "description", headerName: "Descripción" },
  ];

  const handleSort = (field) => {
    const isAsc = sortModel[0]?.field === field && sortModel[0]?.sort === "asc";
    onSortModelChange([{ field, sort: isAsc ? "desc" : "asc" }]);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="contact table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.field}>
                <TableSortLabel
                  active={sortModel[0]?.field === column.field}
                  direction={
                    sortModel[0]?.field === column.field
                      ? sortModel[0].sort
                      : "asc"
                  }
                  onClick={() => handleSort(column.field)}
                >
                  {column.headerName}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: "pointer",
              }}
              hover
              onClick={() => onRowClick(contact)}
            >
              {columns.map((column) => (
                <TableCell key={`${contact.id}-${column.field}`}>
                  {contact[column.field]}
                </TableCell>
              ))}
              <TableCell align="center">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onGenerateQR(contact);
                  }}
                  size="small"
                >
                  <QrCodeIcon />
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteContact(contact);
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ContactTable.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
  onRowClick: PropTypes.func.isRequired,
  sortModel: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      sort: PropTypes.oneOf(["asc", "desc"]).isRequired,
    })
  ).isRequired,
  onSortModelChange: PropTypes.func.isRequired,
  onDeleteContact: PropTypes.func.isRequired,
  onGenerateQR: PropTypes.func.isRequired,
};

export default ContactTable;
