import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import {
  Fab,
  Link,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import RemoveIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { compareDesc, parse, subDays } from "date-fns";

const columns: GridColDef[] = [
  { field: "position", headerName: "Position", width: 250 },
  { field: "company", headerName: "Company", width: 200 },
  { field: "status", headerName: "Status", width: 90 },
  {
    field: "url",
    headerName: "URL",
    width: 150,
    renderCell: (params) => <Link href={params.value}>{params.value}</Link>,
  },
  { field: "salary", headerName: "Salary", width: 300 },
  { field: "appliedDate", headerName: "Applied Date", width: 120 },
  { field: "location", headerName: "Location", width: 200 },
  { field: "description", headerName: "Description", flex: 1 },
];

export function AppGrid() {
  const navigate = useNavigate();

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: "appliedDate",
      sort: "desc",
    },
  ]);

  const [rows, setRows] = useState(() => {
    const data = localStorage.getItem("job-offers");
    return data ? JSON.parse(data) : [];
  });

  return (
    <>
      <Paper className="h-full">
        <DataGrid
          rows={rows}
          columns={columns}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          onRowDoubleClick={(row) => {
            navigate(`/add?id=${row.id}`);
          }}
          getRowClassName={(params) => {
            const appliedDate = parse(
              params.row.appliedDate ?? "",
              "P",
              new Date()
            );

            if (compareDesc(appliedDate, subDays(new Date(), 7)) > 0) {
              return "opacity-70";
            }

            if (compareDesc(appliedDate, subDays(new Date(), 14)) > 0) {
              return "opacity-40";
            }

            return "";
          }}
        />
      </Paper>

      <Fab
        color="error"
        aria-label="add"
        sx={{
          visibility: rowSelectionModel.length > 0 ? "visible" : "hidden",
          position: "absolute",
          bottom: 80,
          right: 80,
        }}
        onClick={() => {
          const newRows = rows.filter(
            (row: { id: string }) => !rowSelectionModel.includes(row.id)
          );

          localStorage.setItem("job-offers", JSON.stringify(newRows));

          setRows(newRows);
        }}
      >
        <RemoveIcon />
      </Fab>

      <SpeedDial
        ariaLabel="SpeedDial"
        sx={{
          position: "absolute",
          bottom: 80,
          right: 20,
        }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={
            <a href="./#/add">
              <AddIcon />
            </a>
          }
          tooltipTitle="Add Single"
        />

        <SpeedDialAction
          icon={
            <a href="./#/add-multiple">
              <PlaylistAddIcon />
            </a>
          }
          tooltipTitle="Add Multiple"
        />
      </SpeedDial>
    </>
  );
}
