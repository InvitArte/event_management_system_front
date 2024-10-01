import React from "react";
import PropTypes from "prop-types";
import {
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Grid,
  Tooltip,
  Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import QrCodeIcon from "@mui/icons-material/QrCode";

const CONTACTS_PER_PAGE = 5;
const MAX_NAME_LENGTH = 20;

const MobileContactList = ({
  contacts,
  onEditContact,
  onDeleteContact,
  onGenerateQR,
}) => {
  const [expandedContact, setExpandedContact] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedContactForMenu, setSelectedContactForMenu] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [paginatedContacts, setPaginatedContacts] = React.useState([]);

  React.useEffect(() => {
    const startIndex = (page - 1) * CONTACTS_PER_PAGE;
    const endIndex = startIndex + CONTACTS_PER_PAGE;
    setPaginatedContacts(contacts.slice(startIndex, endIndex));
  }, [contacts, page]);

  const handleAccordionChange = (contactId) => (event, isExpanded) => {
    setExpandedContact(isExpanded ? contactId : null);
  };

  const handleMenuOpen = (event, contact) => {
    setAnchorEl(event.currentTarget);
    setSelectedContactForMenu(contact);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContactForMenu(null);
  };

  const handleEditClick = () => {
    onEditContact(selectedContactForMenu);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    onDeleteContact(selectedContactForMenu);
    handleMenuClose();
  };

  const handleGenerateQRClick = () => {
    onGenerateQR(selectedContactForMenu);
    handleMenuClose();
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    setExpandedContact(null);
  };

  const truncateName = (name) => {
    if (name.length <= MAX_NAME_LENGTH) return { truncatedName: name, isTruncated: false };
    return { truncatedName: `${name.substring(0, MAX_NAME_LENGTH)}...`, isTruncated: true };
  };

  const renderAccordionSummary = (contact) => {
    const { truncatedName, isTruncated } = truncateName(contact.name);
    contact.isTruncated = isTruncated;

    return (
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`contact-${contact.id}-content`}
        id={`contact-${contact.id}-header`}
        sx={{
          minHeight: '48px !important',
          padding: '0 8px',
          '& .MuiAccordionSummary-content': {
            margin: '0 !important',
            alignItems: 'center',
          },
        }}
      >
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs>
            <Tooltip title={isTruncated ? contact.name : ''} arrow>
              <Typography 
                noWrap 
                sx={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                }}
              >
                {truncatedName}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item>
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                handleMenuOpen(event, contact);
              }}
              size="small"
              sx={{ p: 0 }}
            >
              <MoreVertIcon />
            </IconButton>
          </Grid>
        </Grid>
      </AccordionSummary>
    );
  };

  const renderContactDetails = (contact) => (
    <List dense>
      {contact.isTruncated && (
        <ListItem>
          <ListItemText primary="Nombre completo" secondary={contact.name} />
        </ListItem>
      )}
      <ListItem>
        <ListItemText primary="Email" secondary={contact.email} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Teléfono" secondary={contact.phone} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Descripción" secondary={contact.description} />
      </ListItem>
    </List>
  );

  return (
    <Box>
      <List disablePadding>
        {paginatedContacts.map((contact) => (
          <Accordion
            key={contact.id}
            expanded={expandedContact === contact.id}
            onChange={handleAccordionChange(contact.id)}
            sx={{
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              },
              boxShadow: 'none',
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            {renderAccordionSummary(contact)}
            <AccordionDetails>
              {renderContactDetails(contact)}
            </AccordionDetails>
          </Accordion>
        ))}
      </List>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(contacts.length / CONTACTS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Editar</MenuItem>
        <MenuItem onClick={handleGenerateQRClick}>Exportar contacto</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Borrar</MenuItem>
      </Menu>
    </Box>
  );
};

MobileContactList.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    description: PropTypes.string,
  })).isRequired,
  onEditContact: PropTypes.func.isRequired,
  onDeleteContact: PropTypes.func.isRequired,
  onGenerateQR: PropTypes.func.isRequired,
};

export default MobileContactList;