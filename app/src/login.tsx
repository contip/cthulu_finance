import React, { useState } from "react";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { IAuthCall } from "./interfaces";
import { Urls } from "./constants";
import ApiCall from "./api";
import { useSnackbar } from "notistack";


export default function LoginForm() {
  let [nameInput, setNameInput] = useState<string>("");
  let [passInput, setPassInput] = useState<string>("");
  let [validName, setValidName] = useState<boolean>(false);
  let [validPass, setValidPass] = useState<boolean>(false);
  let {enqueueSnackbar, closeSnackbar} = useSnackbar();
  let history = useHistory();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "username") {
      setNameInput(event.target.value);
    } else {
      setPassInput(event.target.value);
    }
  }

  async function handleSubmit() {
    let payload: IAuthCall = {
      url: Urls.login,
      auth: false,
      body: { username: nameInput, password: passInput },
    };
    let response = await ApiCall(payload);
    if (response.code) {
      enqueueSnackbar(response.message, {variant: "error"})
      setNameInput("");
      setPassInput("");
    }
    else {
      authService.login(response)
      history.push("/");
    }
  }

  return (
    <div id="LoginForm">
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
  );
}
