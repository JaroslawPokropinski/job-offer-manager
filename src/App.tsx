import { Box, createTheme, ThemeProvider } from "@mui/material";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { AppGrid } from "./pages/AppGrid";
import { AddSingle } from "./pages/AddSingle";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { setDefaultOptions } from "date-fns";
import { pl } from "date-fns/locale/pl";
import { AddMultiple } from "./pages/AddMultiple";

setDefaultOptions({ locale: pl });

const theme = createTheme({
  defaultColorScheme: "dark",
  colorSchemes: {
    dark: true,
  },
});

const router = createHashRouter([
  {
    path: "/",
    element: <AppGrid />,
  },
  {
    path: "/add",
    element: <AddSingle />,
  },
  {
    path: "/add-multiple",
    element: <AddMultiple />,
  },
]);

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            position: "relative",
            padding: 1,
            width: "100vw",
            height: "100vh",
            border: "none",
            bgcolor: "background.default",
            color: "text.primary",
          }}
        >
          <RouterProvider router={router} />
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default App;
