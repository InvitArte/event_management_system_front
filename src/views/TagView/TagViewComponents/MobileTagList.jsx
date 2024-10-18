// React
import React from 'react';

// Bibliotecas de terceros
import PropTypes from 'prop-types';

// Material-UI
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
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

// Hooks propios
import { useMobileTagList } from '../../../hooks';

// Componentes genericos
import { stringToColor, adjustColor, getContrastColor } from '../../../components';

const MAX_NAME_LENGTH = 20;

const MobileTagList = ({
  tags,
  guests,
  onEditTag,
  onDeleteTag,
}) => {
  const {
    expandedTag,
    anchorEl,
    selectedTagForMenu,
    handleAccordionChange,
    handleMenuOpen,
    handleMenuClose,
  } = useMobileTagList();

  const truncateName = (name) => {
    if (name.length <= MAX_NAME_LENGTH) return { truncatedName: name, isTruncated: false };
    return { truncatedName: `${name.substring(0, MAX_NAME_LENGTH)}...`, isTruncated: true };
  };

  const renderAccordionSummary = (tag) => {
    const { truncatedName, isTruncated } = truncateName(tag.name);
    const backgroundColor = stringToColor(tag.name);
    const textColor = getContrastColor(backgroundColor);

    return (
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`tag-${tag.id}-content`}
        id={`tag-${tag.id}-header`}
        sx={{
          minHeight: '48px !important',
          padding: '0 8px',
          '& .MuiAccordionSummary-content': {
            margin: '0 !important',
            alignItems: 'center',
          },
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
          <Tooltip title={isTruncated ? tag.name : ''} arrow>
            <Typography
              noWrap
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                backgroundColor: adjustColor(backgroundColor, 20),
                color: textColor,
                padding: '2px 8px',
                borderRadius: '4px',
                flexGrow: 1,
                marginRight: '8px',
              }}
            >
              {truncatedName}
            </Typography>
          </Tooltip>
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              handleMenuOpen(event, tag);
            }}
            size="small"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      </AccordionSummary>
    );
  };

  const renderTagDetails = (tag) => {
    const tagGuests = guests.filter(guest => guest.tags.some(t => t.id === tag.id));
    const totalGuests = tagGuests.reduce((total, guest) => {
      return total + 1 + (guest.plus_ones ? guest.plus_ones.length : 0);
    }, 0);

    return (
      <List dense>
        <ListItem>
          <ListItemText primary="Número de invitados" secondary={totalGuests} />
        </ListItem>
        <ListItem>
          <Typography variant="subtitle2">Invitados asociados:</Typography>
        </ListItem>
        {tagGuests.map(guest => (
          <ListItem key={guest.id} sx={{ pl: 4 }}>
            <ListItemText
              primary={guest.fullName}
              secondary={
                guest.plus_ones && guest.plus_ones.length > 0
                  ? `+${guest.plus_ones.length} acompañante${guest.plus_ones.length > 1 ? 's' : ''}`
                  : ""
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box>
      <List disablePadding>
        {tags.map((tag) => (
          <Accordion
            key={tag.id}
            expanded={expandedTag === tag.id}
            onChange={handleAccordionChange(tag.id)}
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
            {renderAccordionSummary(tag)}
            <AccordionDetails>
              {renderTagDetails(tag)}
            </AccordionDetails>
          </Accordion>
        ))}
      </List>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          onEditTag(selectedTagForMenu);
          handleMenuClose();
        }}>
          Editar
        </MenuItem>
        <MenuItem onClick={() => {
          onDeleteTag(selectedTagForMenu);
          handleMenuClose();
        }}>
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
};

MobileTagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  guests: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    plus_ones: PropTypes.arrayOf(PropTypes.object),
    tags: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
  })).isRequired,
  onEditTag: PropTypes.func.isRequired,
  onDeleteTag: PropTypes.func.isRequired,
};

export default MobileTagList;