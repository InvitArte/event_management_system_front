import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
  Pagination,
  Grid,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { stringToColor, adjustColor, getContrastColor } from '../../../components/Utils/TagColors';

const GUESTS_PER_PAGE = 10;
const MAX_NAME_LENGTH = 20;

const MobileGuestList = ({
  guests,
  onEditGuest,
  onDeleteGuest,
  onBulkActionComplete,
  selectedGuests,
  setSelectedGuests,
  visibleColumns,
}) => {
  const [page, setPage] = useState(1);
  const [expandedGuest, setExpandedGuest] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGuestForMenu, setSelectedGuestForMenu] = useState(null);

  const flattenedGuests = useMemo(() => {
    const flattened = guests.flatMap(guest => [
      guest,
      ...(guest.companions || []).map(companion => ({
        ...companion,
        isCompanion: true,
        mainGuestId: guest.id
      }))
    ]);
    console.log('[MobileGuestList] Flattened guests:', flattened.length);
    return flattened;
  }, [guests]);

  const paginatedGuests = useMemo(() => {
    const startIndex = (page - 1) * GUESTS_PER_PAGE;
    const endIndex = startIndex + GUESTS_PER_PAGE;
    const paginated = flattenedGuests.slice(startIndex, endIndex);
    console.log('[MobileGuestList] Paginated guests:', paginated.length, 'for page:', page);
    return paginated;
  }, [flattenedGuests, page]);

  useEffect(() => {
    console.log('[MobileGuestList] Guests updated:', guests.length);
    console.log('[MobileGuestList] Flattened guests:', flattenedGuests.length);
    console.log('[MobileGuestList] Paginated guests:', paginatedGuests.length, 'for page:', page);
  }, [guests, flattenedGuests, paginatedGuests, page]);

  const handleAccordionChange = (guestId) => (event, isExpanded) => {
    console.log('[MobileGuestList] Accordion changed for guest:', guestId, 'Expanded:', isExpanded);
    setExpandedGuest(isExpanded ? guestId : null);
  };

  const handleSelectGuest = useCallback((guest) => {
    console.log('[MobileGuestList] Selecting guest:', guest.id, guest.fullName);
    setSelectedGuests((prev) => {
      const isSelected = prev.some((g) => g.id === guest.id);
      if (isSelected) {
        return prev.filter((g) => g.id !== guest.id && g.mainGuestId !== guest.id);
      } else {
        const newSelection = [...prev, guest];
        if (!guest.isCompanion && guest.companions) {
          newSelection.push(...guest.companions);
        }
        return newSelection;
      }
    });
  }, [setSelectedGuests]);

  const handleBulkValidate = useCallback(() => {
    console.log('[MobileGuestList] Bulk validating', selectedGuests.length, 'guests');
    onBulkActionComplete('validate', selectedGuests.map(guest => guest.id));
    setSelectedGuests([]);
  }, [selectedGuests, onBulkActionComplete, setSelectedGuests]);

  const handleMenuOpen = (event, guest) => {
    console.log('[MobileGuestList] Opening menu for guest:', guest.id);
    setAnchorEl(event.currentTarget);
    setSelectedGuestForMenu(guest);
  };

  const handleMenuClose = () => {
    console.log('[MobileGuestList] Closing menu');
    setAnchorEl(null);
    setSelectedGuestForMenu(null);
  };

  const handleEditClick = () => {
    console.log('[MobileGuestList] Editing guest:', selectedGuestForMenu.id);
    onEditGuest(selectedGuestForMenu);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    console.log('[MobileGuestList] Deleting guest:', selectedGuestForMenu.id);
    onDeleteGuest(selectedGuestForMenu);
    handleMenuClose();
  };

  const handlePageChange = (event, newPage) => {
    console.log('[MobileGuestList] Changing to page:', newPage);
    setPage(newPage);
    setExpandedGuest(null);
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

  const renderAccordionSummary = (guest) => {
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
          {!guest.isCompanion && (
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
                  paddingLeft: guest.isCompanion ? 2 : 0,
                }}
              >
                {guest.isCompanion ? `↳ ${truncatedName}` : truncatedName}
              </Typography>
            </Tooltip>
          </Grid>
          {!guest.isCompanion && visibleColumns.validated && (
            <Grid item>
              {guest.validated ? (
                <CheckCircleIcon color="primary" fontSize="small" />
              ) : (
                <CancelIcon color="disable" fontSize="small" />
              )}
            </Grid>
          )}
          {!guest.isCompanion && (
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
  
  const renderGuestDetails = (guest) => (
    <List dense>
      {visibleColumns.fullName && guest.isTruncated && (
        <ListItem>
          <ListItemText primary="Nombre Completo" secondary={guest.fullName} />
        </ListItem>
      )}
      {!guest.isCompanion && visibleColumns.email && (
        <ListItem>
          <ListItemText primary="Email" secondary={guest.email} />
        </ListItem>
      )}
      {!guest.isCompanion && visibleColumns.phone && (
        <ListItem>
          <ListItemText primary="Teléfono" secondary={guest.phone} />
        </ListItem>
      )}
      {visibleColumns.menu && (
        <ListItem>
          <ListItemText primary="Menú" secondary={guest.menu} />
        </ListItem>
      )}
      {visibleColumns.allergy && (
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
      {!guest.isCompanion && visibleColumns.tags && (
        <ListItem>
          <Box>
            <Typography variant="body2">Etiquetas</Typography>
            {renderChips(guest.tags, stringToColor)}
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
        onClick={() => {
          console.log('[MobileGuestList] Bulk validate clicked for', selectedGuests.length, 'guests');
          handleBulkValidate();
        }}
        disabled={selectedGuests.length === 0}
        fullWidth
        sx={{ mb: 2, textTransform: 'uppercase' }}
      >
        Validar Seleccionados ({selectedGuests.length})
      </Button>
      <List disablePadding>
        {paginatedGuests.map((guest) => (
          <Accordion
            key={`${guest.id}-${guest.isCompanion ? 'companion' : 'main'}`}
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
        ))}
      </List>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(flattenedGuests.length / GUESTS_PER_PAGE)}
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
        <MenuItem onClick={handleDeleteClick}>Eliminar</MenuItem>
      </Menu>
    </Box>
  );
};

MobileGuestList.propTypes = {
  guests: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    fullName: PropTypes.string.isRequired,
    isMainGuest: PropTypes.bool.isRequired,
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
  selectedGuests: PropTypes.array.isRequired,
  setSelectedGuests: PropTypes.func.isRequired,
  visibleColumns: PropTypes.objectOf(PropTypes.bool).isRequired,
};

export default MobileGuestList;