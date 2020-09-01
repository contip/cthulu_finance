import React, { useState } from "react";
import { authService } from "../components/auth.service";
import { useHistory } from "react-router-dom";
import { Urls } from "../data/constants";
import ApiCall from "../components/api-call";
import { useSnackbar } from "notistack";
import { IAuthCall } from "../data/interfaces";
import InputForm from "../components/input-form";

export default function Register() {
  let [nameInput, setNameInput] = useState<string>("");
  let [passInput, setPassInput] = useState<string>("");
  let [confirmPassInput, setConfirmPassInput] = useState<string>("");
  let [validName, setValidName] = useState<boolean>(false);
  let [validLookup, setValidLookup] = useState<boolean>(false);
  let [validPass, setValidPass] = useState<boolean>(false);
  let [validConfirm, setValidConfirm] = useState<boolean>(false);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
  let history = useHistory();

  async function handleSubmit() {
    closeSnackbar();
    if (passInput !== confirmPassInput) {
      enqueueSnackbar("Error submitting: Passwords must match!", {variant: "error"})
      return;
    }
    let payload: IAuthCall = {url: Urls.register, auth: false, body: { username: nameInput, password: passInput }};
    let response = await ApiCall(payload);
    if (response.code) {  /* should not be possible */
      enqueueSnackbar(response.message, {variant: "error"})
      setNameInput("");
      setPassInput("");
      setConfirmPassInput("");
    }
    else {
      authService.newUser(response);
      history.push("/");
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.name) {
      case "username":
        setNameInput(event.target.value);
        break;
      case "password":
        setPassInput(event.target.value);
        break;
      default:
        /* otherwise it is the confirm pass input */
        setConfirmPassInput(event.target.value);
        break;
    }
  }

  async function handleBlur(event: React.ChangeEvent<HTMLInputElement>) {
    /* call api function for username availability check */
    if (nameInput.length > 0) {
      closeSnackbar();
      let payload: IAuthCall = {
        url: Urls.available,
        auth: false,
        body: { username: nameInput },
      };
      let response = await ApiCall(payload);
      setValidLookup(response);
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
    <InputForm
      {...{
        onSubmit: handleSubmit,
            buttonValidators: [validName, validPass, validConfirm, validLookup, 
            nameInput.length > 0 && passInput.length > 0 && confirmPassInput.length > 0],
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
              // "isPasswordMatch",
              "required",
              "matchRegexp:^[A-Za-z0-9!@#$%^&*]+$",
              "maxStringLength:19",
            ],
            errorMessages: [
              // "passwords must match!",
              "this field is required!",
              "only letters, digits, and '!@#$%^&*' are allowed!",
              "19 character maximum!",
            ],
          },
        ],
      }}
    ></InputForm>
  );
}
