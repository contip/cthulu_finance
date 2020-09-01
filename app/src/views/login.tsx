import React, { useState } from "react";
import { authService } from "../components/auth.service";
import { useHistory } from "react-router-dom";
import { IAuthCall } from "../data/interfaces";
import { Urls } from "../data/constants";
import ApiCall from "../components/api-call";
import { useSnackbar } from "notistack";
import InputForm from "../components/input-form";

export default function LoginForm() {
  let [nameInput, setNameInput] = useState<string>("");
  let [passInput, setPassInput] = useState<string>("");
  let [validName, setValidName] = useState<boolean>(false);
  let [validPass, setValidPass] = useState<boolean>(false);
  let { enqueueSnackbar, closeSnackbar } = useSnackbar();
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
      enqueueSnackbar(response.message, { variant: "error" });
      setNameInput("");
      setPassInput("");
    } else {
      authService.login(response);
      history.push("/");
    }
  }

  return (
    <div id="LoginForm">
      <InputForm
        {...{
          onSubmit: handleSubmit,
          buttonValidators: [
            validName,
            validPass,
            nameInput.length > 0 && passInput.length > 0,
          ],
          inputs: [
            {
              label: "Username",
              value: nameInput,
              onChange: handleChange,
              name: "username",
              validatorListener: setValidName,
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
          ],
        }}
      ></InputForm>
    </div>
  );
}
