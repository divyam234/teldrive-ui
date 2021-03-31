import { Suspense } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import Loader from "./Loader";
import { Button, Box, Typography } from "@mui/material";

export const QueryBoundaries = ({ children }) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary onReset={reset}>
        <Suspense fallback={<Loader />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);

const ErrorView = ({ error, resetErrorBoundary }) => {
  return (
    <Box>
      <Typography>{error.message}</Typography>
      <Button title="Retry" onClick={resetErrorBoundary} />
    </Box>
  );
};