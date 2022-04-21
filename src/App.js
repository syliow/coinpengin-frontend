import "./App.css";
import { React } from "react";
import { useEffect, useState } from "react";
import Switch from "@material-ui/core/Switch";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import SignupDialog from "./components/SignupDialog";
import {
  TableContainer,
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Table,
  TableHead,
  Typography,
  ListItemText,
  TextField,
  Box,
  Button,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import LoginDialog from "./components/LoginDialog";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const currencyOptions = [
  { label: "USD", value: "USD" },
  { label: "RM", value: "MYR" },
];

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const NightModeSwitch = withStyles({
  switchBase: {
    color: "orange",
    "&$checked": {
      color: " #0B0B45",
    },
    "&$checked + $track": {
      backgroundColor: "black",
    },
  },
  checked: {},
  track: {},
})(Switch);

function App() {
  const [data, setData] = useState([]);
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [favourite, setFavorite] = useState([]);
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  // const [handleSignup , setHandleSignup] = useState(false);
  const theme = createTheme({
    palette: {
      type: darkMode ? "dark" : "light",
    },
  });
  const classes = useStyles();
  // const tableRef = React.createRef();

  const handleChangeCurrency = (event) => {
    setCurrency(event.target.value);
    console.log(currency, "hmm");
    console.log(event.target.value, "hmm 2");
  };

  const handleAddCoinToFavourite = (coin) => {
    setFavorite(coin);
  };

  const handleLogin = (event) => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const handleSignup = () => {
    setOpenSignup(true);
  };

  const handleCloseSignUp = () => {
    setOpenSignup(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currency === "MYR") {
        axios
          .get(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=myr&order=market_cap_desc&per_page=100&page=1&sparkline=false"
          )
          .then((res) => {
            setCurrency("MYR");
            setData(res.data);
          });
      } else if (currency === "USD") {
        axios
          .get(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
          )
          .then((res) => {
            setCurrency("USD");
            setData(res.data);
          });
      }
      setLoading(false);
    };
    fetchData();
  }, [currency]);

  const [coinData] = useState([
    {
      title: "#",
      field: "index",
      render: (rowData) => <div>{rowData.tableData.id + 1}</div>,
    },
    {
      field: "name",
      title: "Coin",

      render: (rowData) => {
        return (
          <Box>
            <img
              src={rowData.image}
              alt={rowData.name}
              style={{ width: "20px", height: "20px" }}
            />
            <Typography style={{}}>{rowData.name}</Typography>
          </Box>
        );
      },
    },
    {
      field: "current_price",
      title: "Price",
      allign: "center",
      render: (row) => {
        // console.log(currency, "why");

        return <div>${row.current_price}</div>;
      },
    },
    {
      field: "price_change_percentage_24h",
      title: "24h Change",
      render: (row) => {
        return (
          <div>
            <Typography
              style={
                row.price_change_percentage_24h > 0
                  ? { color: "#8dc647" }
                  : { color: "#e15241" }
              }
            >
              {row.price_change_percentage_24h.toFixed(1)}%
            </Typography>
          </div>
        );
      },
    },
    {
      field: "total_volume",
      title: "24h Volume",
      render: (row) => {
        if (currency === "USD") {
          return (
            <div>
              {row.total_volume.toLocaleString("en-RM", {
                style: "currency",
                currency: currency,
                minimumFractionDigits: 0,
              })}
            </div>
          );
        } else {
          return (
            <div>
              {row.total_volume.toLocaleString("en-US", {
                style: "currency",
                currency: currency,
                minimumFractionDigits: 0,
              })}
            </div>
          );
        }
      },
    },
    {
      field: "market_cap",
      title: "Market Cap",
      render: (row) => {
        return (
          <div>
            {row.market_cap.toLocaleString("en-US", {
              style: "currency",
              currency: currency,
              minimumFractionDigits: 0,
            })}
          </div>
        );
      },
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <div className="login-signup">
              <Button
                variant="contained"
                color="primary"
                className="login-button"
                allign="right"
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="primary"
                className="signup-button"
                allign="right"
                onClick={handleSignup}
              >
                Signup
              </Button>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <Paper style={{ height: "100vh" }}>
        <div style={{ maxWidth: "100%" }}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currency}
              onChange={handleChangeCurrency}
            >
              {currencyOptions.map((option) => (
                <MenuItem value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Typography>
              {darkMode === true ? "Dark Mode" : "Light Mode"}
            </Typography>

            <NightModeSwitch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              name="checkedA"
              inputProps={{ "aria-label": "secondary checkbox" }}
            />
          </Box>
          {currency}
          <MaterialTable
            title="Cryptocurrency Prices by Market Cap"
            // tableRef={tableRef}
            icons={tableIcons}
            columns={coinData}
            data={data}
            options={{
              pageSize: 10,
              pageSizeOptions: [10, 20, 30],
            }}
            actions={[
              {
                icon: () => <FavoriteBorderIcon />,
                tooltip: "Favorite",
                onClick: (event, rowData) => {
                  handleAddCoinToFavourite(rowData);
                },
              },
            ]}
          />
        </div>
      </Paper>

      <SignupDialog
        open={openSignup}
        handleClose={handleCloseSignUp}
        // handleExited ={handleExitSignUp}
      />

      <LoginDialog open={openLogin} handleClose={handleCloseLogin} />
    </ThemeProvider>
  );
}

export default App;
