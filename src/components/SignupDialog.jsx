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
import axios from "axios";

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
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    // email: yup.string().email("Email is invalid").required("Email is required"),
    // password: yup
    //   .string()
    //   .min(8, "Password must be at least 8 characters")
    //   .required("Password is required"),
    // confirmPassword: yup
    //   .string()
    //   .oneOf([yup.ref("password"), null], "Passwords must match")
    //   .required("Confirm password is required"),
    // acceptTerms: yup
    //   .boolean()
    //   .oneOf([true], "You must accept the terms and conditions to sign up")
    //   .required("You must accept the terms and conditions to sign up"),
  });

  const _handleSubmitForm = () => {
    console.log("HELLO");
    console.log(formRef.current.values, "form ref current");
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const _onSubmitRefundRequest = async (values) => {
    try {
      console.log("SUBMIT FORM OPEN");
      console.log(values);
      let requestBody = {};
      requestBody = {
        ...values,
      };
      await axios.post("/api/users/signup", requestBody);
      console.log("API SUBMITTED OK");
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
        {({ handleSubmit, isSubmitting, handleChange }) => {
          return (
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
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
                        label="First Name"
                        autoFocus
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
                        autoComplete="lname"
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
                        // autoComplete="current-password"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        required
                        fullWidth
                        name="confirm-password"
                        label="Confirm Password"
                        type="password"
                        id="password"
                        // autoComplete="current-password"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox value="allowExtraEmails" color="primary" />
                        }
                        label="I agree to the terms and conditions."
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
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
