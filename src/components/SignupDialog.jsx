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
import * as yup from "yup";
import { Formik } from "formik";
import PersonIcon from "@material-ui/icons/Person";
import FormHelperText from "@material-ui/core/FormHelperText";
import { axiosInstance } from "../config";
import Alert from "../components/Alert";

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

const SignupDialog = (props) => {
  const { open, handleClose, handleExited } = props;
  const [checked, setChecked] = useState(false);
  const formRef = useRef(null);
  const classes = useStyles();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const formValidation = yup.object().shape({
    firstName: yup
      .string()
      .required("First name is required")
      .matches(/^[a-zA-Z]*$/, "First name must be letters only"),
    lastName: yup
      .string()
      .required("Last name is required")
      .matches(/^[a-zA-Z]*$/, "Last name must be letters only"),
    email: yup.string().email("Email is invalid").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const _handleSubmitForm = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const _onSubmitRefundRequest = async (values) => {
    try {
      let requestBody = {};
      requestBody = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };
      await axiosInstance.post("/api/users/register", requestBody);
      Alert("success", "Registration Successful");
      handleClose();
    } catch (error) {
      console.log(error);
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
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <PersonIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign up
                </Typography>
                <form
                  className={classes.form}
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="fname"
                        name="firstName"
                        variant="outlined"
                        required
                        fullWidth
                        id="firstName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        label="First Name"
                        autoFocus
                        helperText={touched.firstName ? errors.firstName : ""}
                        error={touched.firstName && Boolean(errors.firstName)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={touched.lastName ? errors.lastName : ""}
                        error={touched.lastName && Boolean(errors.lastName)}
                      />
                    </Grid>
                    <Grid item xs={12}>
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
                        // autoComplete="email"
                      />
                    </Grid>
                    <Grid item xs={12}>
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
                        // autoComplete="current-password"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        helperText={
                          touched.confirmPassword ? errors.confirmPassword : ""
                        }
                        error={
                          touched.confirmPassword &&
                          Boolean(errors.confirmPassword)
                        }
                        // autoComplete="current-password"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormHelperText error>
                        {errors.termsCheck ? errors.termsCheck.message : " "}
                      </FormHelperText>
                    </Grid>
                  </Grid>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    loading={isSubmitting}
                    onClick={_handleSubmitForm}
                  >
                    Sign Up
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Link
                        href="#"
                        variant="body2"
                        onClick={_handleSubmitForm}
                      >
                        Already have an account? Sign in
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </div>
              <Box mt={5}></Box>
            </Container>
          );
        }}
      </Formik>
    </Dialog>
  );
};
export default SignupDialog;
