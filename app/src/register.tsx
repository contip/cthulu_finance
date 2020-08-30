import React, { useState } from 'react';
import { authService } from './auth.service';
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Urls } from "./constants";
import ApiCall from "./api";
import { useSnackbar } from "notistack";
import { IAuthCall } from './interfaces';

export default function Register() {
  let [nameInput, setNameInput] = useState<string>("");
  let [passInput, setPassInput] = useState<string>("");
  let [confirmPassInput, setConfirmPassInput] = useState<string>("");
  let [validName, setValidName] = useState<boolean>(false);
  let [validPass, setValidPass] = useState<boolean>(false);
  let [validConfirm, setValidConfirm] = useState<boolean>(false);
  let {enqueueSnackbar, closeSnackbar} = useSnackbar();
  let history = useHistory();

  async function handleSubmit() {

  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    switch (event.target.name) {
      case "username":
        setNameInput(event.target.value);
        break;
      case "password":
        setPassInput(event.target.value);
        break;
      default:  /* otherwise it is the confirm pass input */
        setConfirmPassInput(event.target.value)
        break;
    }
  }

  async function handleBlur(event: React.ChangeEvent<HTMLInputElement>) {
    /* call api function for username availability check */
    let payload: IAuthCall = {url: Urls.available, auth:false, body: {username: nameInput}};
    let response = await ApiCall(payload);
    setValidName(response);
  }

  return(
    <div id="RegisterForm">
      <ValidatorForm
        onSubmit={handleSubmit}
        onError={(errors) => {
          console.log(errors);
        }}
      >
        <TextValidator
          label="Username"
          onChange={handleChange}
          name="username"
          validatorListener={setValidName}
          value={nameInput}
          validators={[
            "required",
            "matchRegexp:^[A-Za-z0-9]+$",
            "maxStringLength:15",
          ]}
          errorMessages={[
            "this field is required!",
            "alphabetical letters and digits only!",
            "15 character maximum!",
          ]}
          variant="outlined"
        />

        <TextValidator
          label="Password"
          onChange={handleChange}
          name="password"
          type="password"
          validatorListener={setValidPass}
          value={passInput}
          validators={[
            "required",
            "matchRegexp:^[A-Za-z0-9!@#$%^&*]+$",
            "maxStringLength:19",
          ]}
          errorMessages={[
            "this field is required!",
            "only letters, digits, and '!@#$%^&*' are allowed!",
            "19 character maximum!",
          ]}
          variant="outlined"
        />
        {validName &&
          validPass &&
          nameInput.length > 0 &&
          passInput.length > 0 && <Button type="submit">Submit</Button>}
      </ValidatorForm>
    </div>
  )


}