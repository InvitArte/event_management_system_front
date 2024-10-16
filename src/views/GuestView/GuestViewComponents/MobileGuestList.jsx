import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  IconButton,
  Checkbox,
  Box,
  Button,
  Menu,
  MenuItem,
  Grid,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon
} from '@mui/icons-material';

import { useMobileGuestList } from '../../../hooks';
import { stringToColor, adjustColor, getContrastColor } from '../../../components';

const MAX_NAME_LENGTH = 20;

const MobileGuestList = ({
  guests,
  onEditGuest,
  onDeleteGuest,
  onBulkActionComplete,
  visibleColumns,
}) => {
  const {
    page,
    expandedGuest,
    anchorEl,
    selectedGuestForMenu,
    selectedGuests,
    paginatedGuests,
    totalPages,
    handleAccordionChange,
    handleSelectGuest,
    handleBulkValidate,
    handleMenuOpen,
    handleMenuClose,
    handlePageChange,
    setSelectedGuests
  } = useMobileGuestList(guests, onBulkActionComplete);

  const handleEditClick = () => {
    onEditGuest(selectedGuestForMenu);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    onDeleteGuest(selectedGuestForMenu);
    handleMenuClose();
  };

  const renderChips = (items, colorFunc) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {items?.map(item => {
        const backgroundColor = colorFunc ? colorFunc(item.name) : undefined;
        const textColor = backgroundColor ? getContrastColor(backgroundColor) : undefined;
        return (
          <Chip
            key={item.id}
            label={item.name}
            size="small"
            style={{
              backgroundColor: backgroundColor ? adjustColor(backgroundColor, 20) : undefined,
              color: textColor,
            }}
          />
        );
      })}
    </Box>
  );

  const truncateName = (name) => {
    if (name.length <= MAX_NAME_LENGTH) return { truncatedName: name, isTruncated: false };
    return { truncatedName: `${name.substring(0, MAX_NAME_LENGTH)}...`, isTruncated: true };
  };

  const renderAccordionSummary = (guest, isCompanion = false) => {
    const { truncatedName, isTruncated } = truncateName(guest.fullName);
    guest.isTruncated = isTruncated;

    return (
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`guest-${guest.id}-content`}
        id={`guest-${guest.id}-header`}
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
          {!isCompanion && (
            <Grid item>
              <Checkbox
                checked={selectedGuests.some(g => g.id === guest.id)}
                onChange={() => handleSelectGuest(guest)}
                onClick={(event) => event.stopPropagation()}
                sx={{ p: 0 }}
              />
            </Grid>
          )}
          <Grid item xs>
            <Tooltip title={isTruncated ? guest.fullName : ''} arrow>
              <Typography
                noWrap
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  paddingLeft: isCompanion ? 2 : 0,
                }}
              >
                {isCompanion ? `↳ ${truncatedName}` : truncatedName}
              </Typography>
            </Tooltip>
          </Grid>
          {!isCompanion && visibleColumns.validated && (
            <Grid item>
              {guest.validated ? (
                <CheckCircleIcon color="primary" fontSize="small" />
              ) : (
                <CancelIcon color="disable" fontSize="small" />
              )}
            </Grid>
          )}
          {!isCompanion && (
            <Grid item>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  handleMenuOpen(event, guest);
                }}
                size="small"
                sx={{ p: 0 }}
              >
                <MoreVertIcon />
              </IconButton>
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
    );
  };

  const renderGuestDetails = (guest, isCompanion = false, mainGuestTags = []) => (
    <List dense>
      {visibleColumns.fullName && guest.isTruncated && (
        <ListItem>
          <ListItemText primary="Nombre Completo" secondary={guest.fullName} />
        </ListItem>
      )}
      {visibleColumns.email && !isCompanion && (
        <ListItem>
          <ListItemText primary="Email" secondary={guest.email} />
        </ListItem>
      )}
      {visibleColumns.phone && !isCompanion && (
        <ListItem>
          <ListItemText primary="Teléfono" secondary={guest.phone} />
        </ListItem>
      )}
      {visibleColumns.menu && (
        <ListItem>
          <ListItemText primary="Menú" secondary={guest.menu} />
        </ListItem>
      )}
      {visibleColumns.allergy && guest.allergies && guest.allergies.length > 0 && (
        <ListItem>
          <Box>
            <Typography variant="body2">Alergias</Typography>
            {renderChips(guest.allergies)}
          </Box>
        </ListItem>
      )}
      {visibleColumns.needs_hotel && (
        <ListItem>
          <ListItemText primary="Necesita hotel" secondary={guest.needs_hotel ? 'Sí' : 'No'} />
        </ListItem>
      )}
      {visibleColumns.needs_transport && (
        <ListItem>
          <ListItemText primary="Necesita transporte" secondary={guest.needs_transport ? 'Sí' : 'No'} />
        </ListItem>
      )}
      {visibleColumns.needs_transport_back && (
        <ListItem>
          <ListItemText primary="Necesita transporte de vuelta" secondary={guest.needs_transport_back ? 'Sí' : 'No'} />
        </ListItem>
      )}
      {visibleColumns.disability && (
        <ListItem>
          <ListItemText primary="Discapacidad" secondary={guest.disability ? 'Sí' : 'No'} />
        </ListItem>
      )}
      {visibleColumns.tags && (
        (guest.tags && guest.tags.length > 0) || (isCompanion && mainGuestTags.length > 0)
      ) && (
        <ListItem>
          <Box>
            <Typography variant="body2">
              {isCompanion && !guest.tags?.length ? "Etiquetas del invitado principal" : "Etiquetas"}
            </Typography>
            {renderChips(guest.tags?.length ? guest.tags : mainGuestTags, stringToColor)}
          </Box>
        </ListItem>
      )}
    </List>
  );

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBulkValidate}
        disabled={selectedGuests.length === 0}
        fullWidth
        sx={{ mb: 2, textTransform: 'uppercase' }}
      >
        Validar Seleccionados ({selectedGuests.length})
      </Button>
      <List disablePadding>
        {paginatedGuests.map((guest) => (
          <React.Fragment key={guest.id}>
            <Accordion
              expanded={expandedGuest === guest.id}
              onChange={handleAccordionChange(guest.id)}
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
              {renderAccordionSummary(guest)}
              <AccordionDetails>
                {renderGuestDetails(guest)}
              </AccordionDetails>
            </Accordion>
            {guest.companions.map((companion) => (
              <Accordion
                key={companion.id}
                expanded={expandedGuest === companion.id}
                onChange={handleAccordionChange(companion.id)}
                sx={{
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: 0,
                  },
                  boxShadow: 'none',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                }}
              >
                {renderAccordionSummary(companion, true)}
                <AccordionDetails>
                  {renderGuestDetails(companion, true, guest.tags)}
                </AccordionDetails>
              </Accordion>
            ))}
          </React.Fragment>
        ))}
      </List>
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <IconButton
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="body2">
          Página {page} de {totalPages}
        </Typography>
        <IconButton
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRightIcon />
        </IconButton>
        <IconButton
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
        >
          <LastPageIcon />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Editar</MenuItem>
        <MenuItem onClick={handleDeleteClick}>Eliminar</MenuItem>
      </Menu>
    </Box>
  );
};

MobileGuestList.propTypes = {
  guests: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    fullName: PropTypes.string.isRequired,
    validated: PropTypes.bool.isRequired,
    email: PropTypes.string,
    phone: PropTypes.string,
    menu: PropTypes.string,
    allergies: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
    needs_hotel: PropTypes.bool,
    needs_transport: PropTypes.bool,
    needs_transport_back: PropTypes.bool,
    disability: PropTypes.bool,
    accommodation_plan: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
    companions: PropTypes.arrayOf(PropTypes.object),
  })).isRequired,
  onEditGuest: PropTypes.func.isRequired,
  onDeleteGuest: PropTypes.func.isRequired,
  onBulkActionComplete: PropTypes.func.isRequired,
  visibleColumns: PropTypes.objectOf(PropTypes.bool).isRequired,
};

export default MobileGuestList;