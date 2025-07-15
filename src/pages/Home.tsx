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
import { TextField } from "../components/forms/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import Box from "@mui/material/Box";
import { ItemStatusLabels, type ItemStatus } from "../enums/itemStatusEnum";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "../components/forms/DateRange";
import { ItemTypeLabels, type ItemType } from "../enums/itemTypeEnum";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useLoadingContext } from "../contexts/LoadingContext";
import SearchIcon from "@mui/icons-material/Search";
import { useFullScreenDialogContext } from "../contexts/FullScreenDialogContext";
import { rederDataPreview } from "../components/DataPreview/DataPreview";
import { ItemStatusLookups, ItemTypeLookups } from "../hooks/lookup";

dayjs.extend(utc);
dayjs.extend(timezone);

const apiUrl = import.meta.env.VITE_API_URL;
const TIMEZONE = "Asia/Bangkok";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: any) => string;
}

const columns: readonly Column[] = [
  {
    id: "type",
    label: "ประเภท",
    minWidth: 120,
    format: (value: ItemType) => {
      return ItemTypeLabels[value];
    },
  },
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
  const { setLoading } = useLoadingContext();
  const { setOpenDialogFullScreen, setComponentRender, setDataRow } =
    useFullScreenDialogContext();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<DataItemInfo[]>([]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    const data = form.getValues();
    filterItem(data, rowsPerPage, newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rpp = +event.target.value;
    const p = 0;

    setRowsPerPage(rpp);
    setPage(p);

    const data = form.getValues();
    filterItem(data, rpp, p + 1);
  };

  const form = useForm<FormType>({
    defaultValues: {
      type: null,
      status: null,
      date_range: [],
      keyword: "",
    },
  });

  const onSubmit = (data: FormType) => {
    filterItem(data);
  };

  const filterItem = (data: FormType, rpp?: number, p?: number) => {
    const start = data?.date_range?.[0];
    const end = data?.date_range?.[1];

    const params: FilterItemParam = {
      type:
        data?.type && typeof data.type === "object"
          ? data.type.value
          : undefined,
      status:
        data?.status && typeof data.status === "object"
          ? data.status.value
          : undefined,
      startDate: start
        ? dayjs(start).tz(TIMEZONE).startOf("day").format()
        : undefined,
      endDate: end ? dayjs(end).tz(TIMEZONE).endOf("day").format() : undefined,
      keyword: data?.keyword || undefined,
      page: p || 1,
      limit: rpp || 10,
    };

    setLoading(true);
    axios
      .post<DataItemInfo[]>(`${apiUrl}/filter-item`, params, {
        withCredentials: true,
      })
      .then((res) => {
        setRows(res.data);
      })
      .catch()
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios
      .get<DataItemInfo[]>(`${apiUrl}/all-item`, { withCredentials: true })
      .then((res) => {
        setRows(res.data);
      })
      .catch()
      .finally(() => {
        setLoading(false);
      });
  };

  const previewDataRow = (dataRow: DataItemInfo) => () => {
    document.activeElement instanceof HTMLElement &&
      document.activeElement.blur();
    setComponentRender?.(rederDataPreview());
    setDataRow(dataRow);
    setOpenDialogFullScreen(true);
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
                    options={ItemTypeLookups()}
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
                    options={ItemStatusLookups()}
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
              <Button
                type="submit"
                variant="contained"
                color="warning"
                startIcon={<SearchIcon />}
              >
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
              {/* ||
              rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .length === 0 */}
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              ) : (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      className="cursor-pointer"
                      onClick={previewDataRow(row)}
                    >
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
          labelRowsPerPage="แสดงข้อมูลต่อหน้า:"
          labelDisplayedRows={({ from, to, count }) =>
            `แสดง ${from} จากทั้งหมด ${count !== -1 ? count : `มากกว่า ${to}`}`
          }
        />
      </Paper>
    </>
  );
};

export default Home;
