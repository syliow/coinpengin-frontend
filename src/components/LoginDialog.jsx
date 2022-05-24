import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  FormLabel,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Formik } from "formik";
import axios from "axios";
import * as yup from "yup";
import Alert from "../components/Alert";
import LinearProgress from "@material-ui/core/LinearProgress";
import { axiosInstance } from "../config";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginDialog = (props) => {
  const { open, handleClose, handleExited } = props;
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const formRef = useRef(null);

  const initialValues = {
    email: "",
    password: "",
  };

  const formValidation = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email")
      .required("Please enter your email."),
    password: yup.string().required("Please enter your password."),
  });

  const handleResetPassword = () => {
    //open new dialog if password reset is required
  };

  const _handleSubmitForm = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const _onSubmitRefundRequest = async (values) => {
    try {
      console.log(values, "erm ?");
      let requestBody = {};
      requestBody = {
        email: values.email,
        password: values.password,
      };
      setIsLoading(true);
      const { data } = await axiosInstance.post(
        "/api/users/login",
        requestBody
      );

      if (data) {
        await axiosInstance
          .get("/api/users/get", {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then(function (response) {
            window.localStorage.setItem("token", JSON.stringify(data.token));
            Alert("success", "Login Successful");
          });

        window.location.reload();
        setIsLoading(false);
      }

      handleClose();
    } catch (error) {
      setIsLoading(false);
      Alert("error", "Invalid email or password");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onExited={handleExited}
      aria-labelledby="form-dialog-title"
    >
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={_onSubmitRefundRequest}
        validationSchema={formValidation}
        innerRef={formRef}
      >
        {({
          handleSubmit,
          isSubmitting,
          handleChange,
          handleBlur,
          touched,
          errors,
        }) => {
          return (
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              {isLoading ? <LinearProgress /> : ""}
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <ExitToAppIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <form
                  className={classes.form}
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.email ? errors.email : ""}
                    error={touched.email && Boolean(errors.email)}
                    autoFocus
                  />
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={touched.password ? errors.password : ""}
                    error={touched.password && Boolean(errors.password)}
                    style={{ marginTop: "10px" }}
                  />
                  {/* <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  /> */}
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    loading={isSubmitting}
                    onClick={_handleSubmitForm}
                    disabled={isLoading === true ? true : false}
                  >
                    Sign In
                  </Button>
                  {/* <Grid container>
                    <Grid item xs>
                      <Link
                        href="#"
                        variant="body2"
                        onClick={handleResetPassword}
                      >
                        Forgot password?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link href="#" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid> */}
                </form>
              </div>
            </Container>
          );
        }}
      </Formik>
    </Dialog>
  );
};
export default LoginDialog;
