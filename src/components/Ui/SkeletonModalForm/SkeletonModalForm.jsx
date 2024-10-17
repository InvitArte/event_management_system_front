// React y hooks
import React from 'react';

// Bibliotecas de terceros
import PropTypes from 'prop-types';

// Material-UI
import { Skeleton, Grid } from '@mui/material';

const SkeletonModalForm = ({ fields = 4, longFields = 1 }) => {
  const renderFields = () => {
    const skeletons = [];
    for (let i = 0; i < fields; i++) {
      skeletons.push(
        <Grid item xs={12} sm={6} key={`field-${i}`}>
          <Skeleton variant="rounded" height={56} />
        </Grid>
      );
    }
    for (let i = 0; i < longFields; i++) {
      skeletons.push(
        <Grid item xs={12} key={`long-field-${i}`}>
          <Skeleton variant="rounded" height={100} />
        </Grid>
      );
    }
    return skeletons;
  };

  return (
    <Grid container spacing={3}>
      {renderFields()}
    </Grid>
  );
};

SkeletonModalForm.propTypes = {
  fields: PropTypes.number,
  longFields: PropTypes.number,
};

export default SkeletonModalForm;