import React from "react";
import { Card, CardContent, Skeleton, Box } from "@mui/material";

const EventCardSkeleton = () => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <CardContent
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Skeleton
        variant="text"
        width="60%"
        height={40}
        sx={{ mx: "auto", mb: 2 }}
      />
      <Box sx={{ mb: 2, textAlign: "center" }}>
        <Skeleton variant="text" width="40%" height={30} sx={{ mx: "auto" }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mx: "auto" }} />
      </Box>
      <Skeleton
        variant="text"
        width="80%"
        height={24}
        sx={{ mx: "auto", mb: 2 }}
      />
      <Skeleton
        variant="rectangular"
        width="40%"
        height={36}
        sx={{ mx: "auto", mb: 2 }}
      />
      <Box sx={{ mb: 2 }}>
        <Skeleton
          variant="text"
          width="30%"
          height={24}
          sx={{ mx: "auto", mb: 1 }}
        />
        <Skeleton
          variant="rectangular"
          width="60%"
          height={36}
          sx={{ mx: "auto" }}
        />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 2 }} />
    </CardContent>
  </Card>
);

export default EventCardSkeleton;
