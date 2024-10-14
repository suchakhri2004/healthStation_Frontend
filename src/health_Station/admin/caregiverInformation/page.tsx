import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import {
  List,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AdminNavbar from "../../../components/navbarAdmin/adminNavbar";
import AdminSidebar from "../../../components/navbarAdmin/adminSidebar";
import icon from "../../../assets/icon.png";

interface Data {
  id: number;
  ssd: number;
  firstname: string;
  lastname: string;
  sex: string;
  age: number;
  phone: string;
  caregiver: string;
  operating_area: string;
}

interface ApiResponse {
  totalCaregiven: number;
}

const Elderly: React.FC = () => {
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState<Data[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showInformation, setShowInformation] = useState<Data[]>([]);
  const [totalCaregiven, setTotalCaregiven] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuerys, setSearchQuerys] = useState<string>("");
  const [finalResult, setFinalResult] = useState<Data[]>([]);

  useEffect(() => {
    if (searchQuerys === "") {
      setFinalResult(data);
    } else {
      const filteredQuery = data.filter((datas) => {
        return Object.values(datas).some((value) =>
          value.toString().toLowerCase().includes(searchQuerys.toLowerCase())
        );
      });
      setFinalResult(filteredQuery);
    }
  }, [searchQuerys, data]);


  console.log(data);

  useEffect(() => {
    if (!searchQuery.trim()) {
      axios
        .get(`http://localhost:9999/api/users/getCaregiven`, {
          params: {
            page: page,
            limit: itemsPerPage,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setData(response.data.caregiven);
          setTotalCount(response.data.totalCaregiven);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
        });
    }
  }, [page, itemsPerPage]);

  const fistelderly = async () => {
    await axios
      .get(`http://localhost:9999/api/users/getCaregiven`, {
        params: {
          page: page,
          limit: itemsPerPage,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setData(response.data.caregiven);
        setTotalCount(response.data.totalCaregiven);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      fistelderly();
    }
  }, [page, itemsPerPage]);

  useEffect(() => {
    // เรียก API เมื่อ component ถูก mount
    axios
      .get<ApiResponse>(`http://localhost:9999/api/users/getCaregiven`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }) // ปรับ URL เป็นของคุณ
      .then((response) => {
        setTotalCaregiven(response.data.totalCaregiven); // บันทึกข้อมูล totalCaregiven ใน state
        setLoading(false);
      })
      .catch((error) => {
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
        setLoading(false);
      });
  }, []);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    setItemsPerPage(Number(event.target.value));
    setPage(1);
  };

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="h-screen">
      <AdminNavbar />
      <div className="flex">
        <div className="grid-rows-1">
          <AdminSidebar />
        </div>
        <div className=" bg-neutral-100 w-full">
          <div className="flex-initial md:bg-white"></div>
          <div className="flex-1 md:bg-neutral-100 ">
            <div className=" md:bg-white md:m-4 p-2 bg-white rounded-lg">
              <div className="text-center rounded-md">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 ">
                  <div className="text-left p-2 pr-4 md:p-4 text-2xl font-bold">
                    Search
                  </div>
                </div>
                <div className="p-0 md:pl-4 md:pb-4">
                  <form className="flex" >
                  <div className="flex flex-col items-start w-full space-y-4 ">
                      <label htmlFor="searchInput">ค้นหาประชาชน</label>
                      <input
                        className="border-2 border-b-4 flex-1 text-left p-2 bg-gray-100 w-full rounded-tr-lg rounded-tl-lg"
                        id="searchInput"
                        name="searchInput"
                        placeholder="Search"
                        value={searchQuerys}
                        onChange={(e) => setSearchQuerys(e.target.value)}
                      />
                    </div>
                    {/* <button className="border-2 flex-none rounded-lg bg-blue-500 text-white p-2 md:w-36 mt-6">
                      ค้นหา
                    </button> */}
                  </form>
                </div>
              </div>
            </div>
            <div className=" bg-neutral-100 m-4">
              <div className="bg-white rounded-lg">
                <Paper className="w-full p-4 select-none">
                  <h1 className="text-xl font-bold text-nowrap mb-4">
                    จัดการข้อมูลผู้ดูแล
                  </h1>
                  <div className="p-4">
                  <button
                        className="focus:outline-none focus:border-b-2 focus:border-blue-500 pr-4"
                      >
                        <div className="flex text-blue-500">
                          <div className="pl-4 py-2">ทั้งหมด</div>
                          <div className="pl-4 py-2">{totalCaregiven}</div>
                        </div>
                      </button>
                  </div>
                  <TableContainer
                    component={Paper}
                    className="w-full overflow-auto"
                  >
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead className="w-full ">
                        <TableRow>
                          <TableCell align="left">ลำดับ</TableCell>
                          <TableCell align="right">เลขบัตรประชาชน</TableCell>
                          <TableCell align="right">ชื่อ</TableCell>
                          <TableCell align="right">สกุล</TableCell>
                          <TableCell align="right">เพศ</TableCell>
                          <TableCell align="right">อายุ</TableCell>
                          <TableCell align="right">หมายเลขโทรศัพท์</TableCell>
                          <TableCell align="right">การอบรม Cg</TableCell>
                          <TableCell align="right">พื้นที่ปฎิบัติงาน</TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {finalResult.map((item, index) => (
                          <TableRow
                            key={item.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="left">
                              {index + 1 + (page - 1) * itemsPerPage}
                            </TableCell>
                            <TableCell align="right">{item.ssd}</TableCell>
                            <TableCell align="right">
                              {item.firstname}
                            </TableCell>
                            <TableCell align="right">{item.lastname}</TableCell>
                            <TableCell align="right">{item.sex}</TableCell>
                            <TableCell align="right">{item.age}</TableCell>
                            <TableCell align="right">{item.phone}</TableCell>
                            <TableCell align="right">{item.caregiver}</TableCell>
                            <TableCell align="right">{item.operating_area}</TableCell>
                            <TableCell align="right">
                              <Link
                                to={`/admin/userfrom/citizenInformation/showInformation/${item.id}`}
                              >
                                <button>
                                  <img
                                    src={icon}
                                    alt="icon"
                                    className="object-cover md:place-items-start bg-auto hover:bg-contain rounded-lg rotate-180"
                                  />
                                </button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div className="flex justify-between m-4">
                    <div>
                      <FormControl variant="outlined" size="small">
                        <Select
                          labelId="items-per-page-label"
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                        >
                          <MenuItem value={5}>5</MenuItem>
                          <MenuItem value={10}>10</MenuItem>
                          <MenuItem value={15}>15</MenuItem>
                          <MenuItem value={20}>20</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="">
                      <Stack spacing={2}>
                        <Pagination
                          className="pl-4"
                          count={totalPages}
                          page={page}
                          onChange={handleChangePage}
                          color="primary"
                          variant="outlined"
                          shape="rounded"
                          showFirstButton
                          showLastButton
                        />
                      </Stack>
                    </div>
                  </div>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Elderly;
