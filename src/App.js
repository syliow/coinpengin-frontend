import "./App.css";
import { React } from "react";
import { useEffect, useState } from "react";
// import { ThemeProvider } from "styled-components";
// import { styled } from "@mui/material/styles";
// import Switch from "@mui/material/Switch";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import FormControl from "@mui/material/FormControl";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import { FormGroup, InputLabel, Typography } from "@mui/material";
// import { TextField } from "@mui/material";
// import { lightTheme, darkTheme } from "./theme";
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
import {
  TableContainer,
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Table,
  TableHead,
} from "@material-ui/core";

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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function App() {
  const [data, setData] = useState([]);
  const [coins, setCoins] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState("dark");
  const classes = useStyles();
  // const tableRef = React.createRef();

  const [coinData] = useState([
    {
      field: "name",
      title: "Coin",
    },
    {
      field: "current_price",
      title: "Price",
    },
    {
      field: "total_volume",
      title: "24h Volume",
      render: (row) => {
        return (
          <div>
            {row.total_volume.toLocaleString("en-US", {
              style: "currency",
              currency: currency,
              minimumFractionDigits: 0,
            })}
          </div>
        );
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

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  const _handleSearch = (event) => {
    setSearch(event.target.value);
    console.log(search, "hmm?");
    console.log(event.target.value, "target");

    _filterCoins(event.target.value);
  };

  //return filter coin data based on search value from res.data
  const _filterCoins = () => {
    const filteredCoins = coins.filter((coin) => {
      return coin.name.toLowerCase().includes(search.toLowerCase());
    });
    setCoins(filteredCoins);

    if (search === "") {
      setCoins(coins);
    }
    console.log(filteredCoins, "filtered coins");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (currency === "MYR") {
        axios
          .get(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=myr&order=market_cap_desc&per_page=100&page=1&sparkline=false"
          )
          .then((res) => {
            setData(res.data);
            console.log(coins, "usd coins?");
          });
      } else if (currency === "USD") {
        axios
          .get(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
          )
          .then((res) => {
            setData(res.data);
            console.log(coins, "myr coins?");
          });
      }
      setLoading(false);
    };
    fetchData();
  }, [currency]);

  console.log(coins, "hmm?");

  const handleToggle = () => {
    // if (theme === "light") {
    //   setTheme("dark");
    // } else {
    //   setTheme("light");
    // }
    // console.log("toggle on ")
    // console.log(theme,'themeee')
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Currency:</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currency}
          onChange={handleChange}
        >
          <MenuItem value={"USD"}>USD</MenuItem>
          <MenuItem value={"MYR"}>RM</MenuItem>
        </Select>
      </FormControl>
      <MaterialTable
        title="Material Table Actions"
        // tableRef={tableRef}
        icons={tableIcons}
        columns={coinData}
        data={data}
        options={{
          pageSize: 10,
          pageSizeOptions: [10, 20, 30],
        }}
      />
    </div>
  );
}

export default App;
