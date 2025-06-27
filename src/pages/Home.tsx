import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Autocomplete } from "../components/forms/Autocomplete";
import { MuiDateTimeField } from "../components/forms/DateTimeField";
import { TextField } from "../components/forms/TextField";
import Button from "@mui/material/Button";

interface Data {
  id: string;
  type: string;
  image: string;
  description: string;
  location: string;
  date: string;
  status: string;
  [key: string]: any;
}

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "type", label: "ประเภท", minWidth: 100 },
  { id: "image", label: "รูปภาพ", minWidth: 100 },
  { id: "description", label: "รายละเอียดสิ่งของ", minWidth: 170 },
  {
    id: "location",
    label: "สถานที่พบหรือคาดว่าหาย",
    minWidth: 170,
  },
  {
    id: "date",
    label: "วันที่ที่พบหรือหาย",
    minWidth: 170,
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "status",
    label: "สถานะ",
    minWidth: 100,
  },
];

const Home = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<Data[]>([]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const form = useForm({
    defaultValues: {
      type: "",
      status: "",
      date_range: "",
      keyword: "",
    },
  });

  function onSubmit(data: typeof form.formState.defaultValues) {
    console.log("onSubmit", data);
  }

  return (
    <>
      <div className="w-full mb-4">
        <span className="text-2xl font-medium">ค้นหา</span>
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-2 mb-2">
            <div className="grow">
              <Controller
                control={form.control}
                name="type"
                render={({ field }) => (
                  <Autocomplete
                    placeholder="ประเภทของรายการ"
                    options={[]}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="grow">
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Autocomplete placeholder="สถานะ" options={[]} {...field} />
                )}
              />
            </div>
            <div className="grow">
              <Controller
                control={form.control}
                name="date_range"
                render={({ field }) => (
                  <MuiDateTimeField
                    placeholder="วันที่เริ่มต้น - สิ้นสุด"
                    {...field}
                  />
                )}
              />
            </div>
            <div className="grow">
              <Controller
                control={form.control}
                name="keyword"
                render={({ field }) => (
                  <TextField placeholder="ค้นหาจากคำสำคัญ" {...field} />
                )}
              />
            </div>
            <div className="grow-0">
              <Button type="submit" variant="outlined">
                ค้นหา
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer
          sx={{
            minHeight: "calc(100vh - 386px)",
            maxHeight: "calc(100vh - 386px)",
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ||
              rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              ) : (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default Home;
