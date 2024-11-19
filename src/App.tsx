import { Box, createTheme, ThemeProvider } from "@mui/material";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { setDefaultOptions } from "date-fns";
import { pl } from "date-fns/locale/pl";

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
    lazy: () =>
      import("./pages/AppGrid").then(({ AppGrid }) => ({ Component: AppGrid })),
  },
  {
    path: "/add",
    lazy: () =>
      import("./pages/AddSingle").then(({ AddSingle }) => ({
        Component: AddSingle,
      })),
  },
  {
    path: "/add-multiple",
    lazy: () =>
      import("./pages/AddMultiple").then(({ AddMultiple }) => ({
        Component: AddMultiple,
      })),
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
