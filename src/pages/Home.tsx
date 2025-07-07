import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import React, { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Autocomplete } from "../components/forms/Autocomplete";
import { MuiDateTimeField } from "../components/forms/DateTimeField";
import { TextField } from "../components/forms/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import Box from "@mui/material/Box";
import { ItemStatusLabels, type ItemStatus } from "../enums/itemStatusEnum";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "../components/forms/DateRange";

const apiUrl = import.meta.env.VITE_API_URL;

interface Data {
  id: string;
  type: LookupType | null;
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
  format?: (value: any) => string;
}

const columns: readonly Column[] = [
  { id: "type", label: "ประเภท", minWidth: 100 },
  { id: "imageUrl", label: "รูปภาพ", minWidth: 100 },
  { id: "description", label: "รายละเอียดสิ่งของ", minWidth: 170 },
  {
    id: "location",
    label: "สถานที่พบหรือคาดว่าหาย",
    minWidth: 170,
  },
  {
    id: "datetime",
    label: "วันที่ที่พบหรือหาย",
    minWidth: 170,
    format: (value: any) => {
      return new Date(value).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      });
    },
  },
  {
    id: "status",
    label: "สถานะ",
    minWidth: 100,
    format: (value: ItemStatus) => {
      return ItemStatusLabels[value];
    },
  },
];

interface FormType {
  type: LookupType | null;
  status: LookupType | null;
  date_range: Date[];
  keyword: string;
}

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

  const form = useForm<FormType>({
    defaultValues: {
      type: null,
      status: null,
      date_range: [new Date(), new Date()],
      keyword: "",
    },
  });

  const onSubmit = (data: typeof form.formState.defaultValues) => {
    const params: any = {
      type: data?.type || undefined,
      status:
        data?.status && typeof data.status === "object"
          ? data.status.value
          : undefined,
      startDate: data?.date_range?.[0],
      endDate: data?.date_range?.[1],
      keyword: data?.keyword || undefined,
      page: page + 1,
      limit: rowsPerPage,
    };
    axios
      .post(`${apiUrl}/filter-item`, params, { withCredentials: true })
      .then((res) => {
        setRows(res.data);
      })
      .catch()
      .finally();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`${apiUrl}/all-item`, { withCredentials: true })
      .then((res) => {
        setRows(res.data);
      })
      .catch()
      .finally();
  };

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
                    options={[
                      { label: "ของที่หาย", value: "lost" },
                      { label: "ของที่พบ", value: "found" },
                    ]}
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
                  <Autocomplete
                    placeholder="สถานะ"
                    options={[
                      { label: "กำลังรอดำเนินการ", value: "pending" },
                      { label: "จับคู่สำเร็จ", value: "matched" },
                      { label: "คืนแล้ว", value: "returned" },
                      { label: "หมดอายุ", value: "expired" },
                      { label: "ยกเลิกแล้ว", value: "cancelled" },
                      { label: "กำลังตรวจสอบ", value: "reviewing" },
                    ]}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="grow">
              <Controller
                control={form.control}
                name="date_range"
                render={({ field }) => (
                  <DateRange
                    placeholder="วันที่เริ่มต้น - สิ้นสุด"
                    {...field}
                  />
                  // <MuiDateTimeField
                  //   placeholder="วันที่เริ่มต้น - สิ้นสุด"
                  //   {...field}
                  // />
                  // <DateRange
                  //   editableDateInputs={true}
                  //   onChange={(item) => onChange([item.selection])}
                  //   moveRangeOnFirstSelection={false}
                  //   // ranges={state}
                  // />
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
                            {column.id === "imageUrl" ? (
                              <Box
                                component="img"
                                src={value}
                                sx={{ width: 50 }}
                              ></Box>
                            ) : column?.format ? (
                              column?.format(value)
                            ) : (
                              value
                            )}
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
