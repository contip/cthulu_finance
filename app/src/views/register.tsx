import React, { useState } from "react";
import { authService } from "../components/auth.service";
import { useHistory } from "react-router-dom";
import { Urls } from "../data/constants";
import { fetchCall } from "../components/helpers";
import { useSnackbar } from "notistack";
import { IAuthCall } from "../data/interfaces";
import InputForm from "../components/input-form";
import logo from "../img/login.png";

/* simple registration form using validated mui text inputs */
export default function Register(): JSX.Element {
  let [nameInput, setNameInput] = useState<string>("");
  let [passInput, setPassInput] = useState<string>("");
  let [confirmPassInput, setConfirmPassInput] = useState<string>("");
  let [validName, setValidName] = useState<boolean>(false);
  let [validLookup, setValidLookup] = useState<boolean>(false);
  let [validPass, setValidPass] = useState<boolean>(false);
  let [validConfirm, setValidConfirm] = useState<boolean>(false);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let history = useHistory();

  /* handles call to server for new user registration */
  async function handleSubmit() {
    /* close any active persistent snackbars (availability notifications) */
    closeSnackbar();
    if (passInput !== confirmPassInput) {
      /* if mismatched passwords, snow snack, reset state, and don't do fetch */
      enqueueSnackbar("Error submitting: Passwords must match!", {
        variant: "error",
      });
      setPassInput("");
      setConfirmPassInput("");
      return;
    }
    let payload: IAuthCall = {
      url: Urls.register,
      auth: false,
      body: { username: nameInput, password: passInput },
    };
    let response = await fetchCall(payload);
    if (response.code) {
      enqueueSnackbar(response.message, { variant: "error" });
      setNameInput("");
      setPassInput("");
      setConfirmPassInput("");
    } else {
      authService.newUser(response);
      history.push("/");
      enqueueSnackbar(`Welcome, ${response.userData.username}. Good luck!`, {
        variant: "success",
      });
    }
  }

  /* updates state according to change registered in given input field */
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.name) {
      case "username":
        setNameInput(event.target.value);
        break;
      case "password":
        setPassInput(event.target.value);
        break;
      default:
        setConfirmPassInput(event.target.value);
        break;
    }
  }

  /* checks if given username is available on input field blur */
  async function handleBlur(event: React.ChangeEvent<HTMLInputElement>) {
    /* do nothing if input field is blank */
    if (nameInput.length > 0) {
      closeSnackbar();
      let payload: IAuthCall = {
        url: Urls.available,
        auth: false,
        body: { username: nameInput },
      };
      let response = await fetchCall(payload);
      setValidLookup(response);
      /* sever returns boolean indicating availability; show related snack */
      if (response) {
        enqueueSnackbar(`Username ${nameInput} is available!`, {
          variant: "info",
          persist: true,
        });
      } else {
        enqueueSnackbar(`Username not available!`, {
          variant: "warning",
          persist: true,
        });
      }
    }
  }

  return (
    <div style={{ textAlign: "center" }}>
     <img style={{maxWidth: "50%"}} src={logo}/>
      <InputForm
        {...{
          onSubmit: handleSubmit,
          buttonValidators: [
            validName,
            validPass,
            validConfirm,
            validLookup,
            nameInput.length > 0 &&
              passInput.length > 0 &&
              confirmPassInput.length > 0,
          ],
          inputs: [
            {
              label: "Username",
              value: nameInput,
              onChange: handleChange,
              name: "username",
              validatorListener: setValidName,
              onBlur: handleBlur as any,
              validators: [
                "required",
                "matchRegexp:^[A-Za-z0-9]+$",
                "maxStringLength:15",
              ],
              errorMessages: [
                "this field is required!",
                "alphabetical letters and digits only!",
                "15 character maximum!",
              ],
            },
            {
              label: "Password",
              type: "password",
              value: passInput,
              onChange: handleChange,
              name: "password",
              validatorListener: setValidPass,
              validators: [
                "required",
                "matchRegexp:^[A-Za-z0-9!@#$%^&*]+$",
                "maxStringLength:19",
              ],
              errorMessages: [
                "this field is required!",
                "only letters, digits, and '!@#$%^&*' are allowed!",
                "19 character maximum!",
              ],
            },
            {
              label: "Password (again)",
              type: "password",
              value: confirmPassInput,
              onChange: handleChange,
              name: "repeatPassword",
              validatorListener: setValidConfirm,
              validators: [
                "required",
                "matchRegexp:^[A-Za-z0-9!@#$%^&*]+$",
                "maxStringLength:19",
              ],
              errorMessages: [
                "this field is required!",
                "only letters, digits, and '!@#$%^&*' are allowed!",
                "19 character maximum!",
              ],
            },
          ],
        }}
      ></InputForm>
    </div>
  );
}
