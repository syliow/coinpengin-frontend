import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import Grid from "@material-ui/core/Grid";
import { DialogContent } from "@material-ui/core";
import { Line } from "react-chartjs-2";
import moment from "moment";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

moment().format();
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  sideBar: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
  },
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  chartContainer: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CoinInfoDialog = (props) => {
  const { open, handleClose, handleExited, coinDetails, currency } = props;
  const [priceHistory, setPriceHistory] = useState([]);
  const [days, setDays] = useState(1);
  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);

  const HistoricalChart = (id, currency, days = 365) =>
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

  const chartDays = [
    {
      label: "24 Hours",
      value: 1,
    },
    {
      label: "30 Days",
      value: 30,
    },
    {
      label: "3 Months",
      value: 90,
    },
    {
      label: "1 Year",
      value: 365,
    },
  ];

  useEffect(() => {
    const fetchPriceChart = async () => {
      const { data } = await axios.get(
        HistoricalChart(coinDetails.id, currency, days)
      );
      setPriceHistory(data.prices);
    };

    fetchPriceChart();
    //TODO
  }, [open, coinDetails.id, days]);

  return (
    <Grid className="container" style={{ backgroundColor: "black" }}>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              {coinDetails.name} Details
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {!priceHistory ? (
          <div>Loading...</div>
        ) : (
          <DialogContent>
            <Grid container style={{ backgroundColor: "" }}>
              <Grid
                xs={12}
                md={12}
                lg={4}
                style={{
                  backgroundColor: "",
                  height: "100%",
                  margin: 25,
                  paddingRight: 25,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  style={{ display: "inline-block" }}
                >
                  <img
                    src={coinDetails.image}
                    alt={coinDetails.name}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                      marginTop: "10px",
                    }}
                  />
                  {coinDetails.name}
                </Typography>
                <Typography variant="title" color="inherit" noWrap>
                  &nbsp;
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    textTransform: "uppercase",
                    display: "inline-block",
                  }}
                >
                  ({coinDetails?.symbol})
                </Typography>
                <Typography
                  style={
                    coinDetails.price_change_percentage_24h > 0
                      ? {
                          color: "#8dc647",
                          display: "inline-block",
                          marginLeft: "10px",
                        }
                      : {
                          color: "#e15241",
                          display: "inline-block",
                          marginLeft: "10px",
                        }
                  }
                >
                  {coinDetails?.price_change_percentage_24h?.toFixed(1)}%
                </Typography>
                <Typography variant="h4" component="p">
                  ${coinDetails?.current_price?.toLocaleString()}
                </Typography>

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Market Cap"
                      secondary={`$${coinDetails?.market_cap?.toLocaleString()}`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Total Supply"
                      secondary={`${
                        coinDetails?.total_supply
                          ? coinDetails?.total_supply?.toLocaleString()
                          : "-"
                      }`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Max Supply"
                      secondary={`${
                        coinDetails?.max_supply
                          ? coinDetails?.max_supply?.toLocaleString()
                          : "-"
                      }`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Circulating Supply"
                      secondary={`${coinDetails?.circulating_supply?.toLocaleString()}`}
                    />
                  </ListItem>
                </List>

                <Typography
                  variant="h5"
                  style={{
                    textTransform: "uppercase",
                    display: "inline-block",
                  }}
                >
                  {coinDetails.symbol}
                </Typography>
                <Typography variant="title" color="inherit" noWrap>
                  &nbsp;
                </Typography>
                <Typography
                  variant="h5"
                  style={{ display: "inline-block", marginTop: "20px" }}
                >
                  Price Statistics
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={`${coinDetails.name} Price`}
                      secondary={`$${coinDetails.current_price}`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="Market Cap Rank"
                      secondary={`#${coinDetails.market_cap_rank}`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="24h Low / 24h High"
                      secondary={`$${coinDetails.low_24h} / $${coinDetails.high_24h}`}
                    />
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="All-Time High"
                      secondary={`$${coinDetails.ath} `}
                    />
                    <Typography variant="subtitle">
                      {moment(coinDetails.ath_date).format("MMM Do YYYY")}
                    </Typography>
                    <Typography variant="title" color="inherit" noWrap>
                      &nbsp;
                    </Typography>
                    <Typography
                      variant="subtitle "
                      style={{ fontWeight: 600, color: "#e15241" }}
                    >
                      ({coinDetails.ath_change_percentage}%)
                    </Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemText
                      primary="All-Time Low"
                      secondary={`$${coinDetails.atl}`}
                    />
                    <Typography variant="subtitle">
                      {moment(coinDetails.atl_date).format("MMM Do YYYY")}
                    </Typography>
                    <Typography variant="title" color="inherit" noWrap>
                      &nbsp;
                    </Typography>
                    <Typography
                      variant="subtitle"
                      style={{ fontWeight: 600, color: "#8dc647" }}
                    >
                      ({coinDetails.atl_change_percentage}%)
                    </Typography>
                  </ListItem>
                </List>
              </Grid>

              <Divider orientation="vertical" flexItem style={{}} />
              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={6}
                style={{
                  // display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 25,
                  padding: 20,
                  // width:100%,
                  backgroundColor: "",
                }}
              >
                <Line
                  data={{
                    labels: priceHistory.map((coin) => {
                      let date = new Date(coin[0]);
                      let time =
                        date.getHours() > 12
                          ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                          : `${date.getHours()}:${date.getMinutes()} AM`;
                      return days === 1 ? time : date.toLocaleDateString();
                    }),

                    datasets: [
                      {
                        data: priceHistory.map((coin) => coin[1]),
                        label: `Price ( Past ${days} Days ) `,
                        borderColor: "#3b82f680",
                      },
                    ],
                  }}
                  options={{
                    elements: {
                      point: {
                        radius: 1,
                      },
                    },
                  }}
                />

                <Grid
                  md={12}
                  style={{
                    display: "flex",
                    marginTop: 20,
                    justifyContent: "space-around",
                    width: "100%",
                  }}
                >
                  {chartDays.map((day) => (
                    <Button
                      key={day.value}
                      onClick={() => {
                        console.log(day.value, "daydayday");
                        setDays(day.value);
                      }}
                      style={{
                        backgroundColor: days === day.value ? "#e15241" : "",
                      }}
                      selected={day.value === days}
                    >
                      {day.label}
                    </Button>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        )}
      </Dialog>
    </Grid>
  );
};

export default CoinInfoDialog;
