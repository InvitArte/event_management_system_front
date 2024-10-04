// React
import React from "react";

// Material-UI
import { Skeleton, Box, Paper, Typography } from "@mui/material";

const ConfigSectionSkeleton = () => {
  return (
    <Paper elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        <Skeleton width="40%" />
      </Typography>
      <Box>
        {[...Array(5)].map((_, index) => (
          <Box key={index} display="flex" alignItems="center" mb={2}>
            <Skeleton
              variant="rectangular"
              width={24}
              height={24}
              sx={{ mr: 2 }}
            />
            <Skeleton width="60%" />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ConfigSectionSkeleton;
