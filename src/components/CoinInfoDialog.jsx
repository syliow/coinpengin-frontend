import React from "react";
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
import Box from "@material-ui/core/Box";
import { DialogContent } from "@material-ui/core";
import moment from "moment";

moment().format();
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CoinInfoDialog = (props) => {
  const { open, handleClose, handleExited, coinDetails } = props;
  const classes = useStyles();
  // const [open, setOpen] = React.useState(false);

  return (
    <div>
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

        <DialogContent>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            mb={1}
            style={{ gap: "10px" }}
          >
            <Box flex={2}>
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
                style={{ textTransform: "uppercase", display: "inline-block" }}
              >
                ({coinDetails?.symbol})
              </Typography>
              <Typography
                style={
                  coinDetails.price_change_percentage_24h > 0
                    ? { color: "#8dc647", display: "inline-block", marginLeft: "10px" }
                    : { color: "#e15241", display: "inline-block", marginLeft: "10px" }
                }
              >
                {coinDetails?.price_change_percentage_24h?.toFixed(1)}%
              </Typography>
              <Typography variant="h4" component="p">
                ${coinDetails?.current_price?.toLocaleString()}
              </Typography>
            </Box>

            <Box flex={2}>
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
            </Box>

            <Box flex={2}>
              <Box display="flex" flexDirection="row">
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
                <Typography variant="h5" style={{ display: "inline-block", marginTop:"20px" }}>
                  {" "}
                  Price Statistics
                </Typography>
              </Box>
              <Typography variant="subtitle1">Price Today</Typography>
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
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoinInfoDialog;
