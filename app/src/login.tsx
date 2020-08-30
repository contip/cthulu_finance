import React, { useState } from "react";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { IAuthCall, ICallError, IUser } from "./interfaces";
import { Urls } from "./constants";
import ApiCall from "./api";

export default function LoginForm() {
  let [nameInput, setNameInput] = useState<string>("");
  let [passInput, setPassInput] = useState<string>("");
  // let [validName, setValidName] = useState<boolean>(false);
  // let [validPass, setValidPass] = useState<boolean>(false);
  let history = useHistory();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "username") {
      setNameInput(event.target.value);
    }
    else {
      setPassInput(event.target.value);
    }
  }

  async function handleSubmit() {  /* needs no parameters since can use state */
    let payload: IAuthCall = {url: Urls.login, auth: false, body: {
      username: nameInput,
      password: passInput,
    }};
    let response = await ApiCall(payload);
    /* already checked for 401.. if invalid, already will have redirected */
    

  }


  /* change input to TextFields and impose validation using library */
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
          // validatorListener={setValidName} // if input is currently invalid and displaying error message, set invalid state
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
          // validatorListener={setValidPass} // if input is currently invalid and displaying error message, set invalid state
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
        <Button type="submit">Submit</Button>

      </ValidatorForm>
    </div>
    // <div>
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <input
    //       name="username"
    //       placeholder="User Name"
    //       ref={register({ required: true, maxLength: 20 })}
    //     />
    //     <p>
    //       <input
    //         name="password"
    //         type="password"
    //         placeholder="Password"
    //         ref={register({ required: true, pattern: /^[A-Za-z]+$/i })}
    //       />
    //     </p>
    //     <input type="submit" value="Login!" />
    //   </form>
    // </div>
  );
}
