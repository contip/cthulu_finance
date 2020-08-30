import React, { useState } from "react";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

export default function LoginForm() {
  let [nameInput, setNameInput] = useState<string>("");
  let [passInput, setPassInput] = useState<string>("");
  let [validName, setValidName] = useState<boolean>(false);
  let [validPass, setValidPass] = useState<boolean>(false);
  let history = useHistory();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.name === "username") {
      setNameInput(event.target.value);
    }
    else {
      setPassInput(event.target.value);
    }
  }

  function handleSubmit() {  /* needs no parameters since can use state */

  }
  const onSubmit = async (data: ILoginInput) => {
    /* on submit i want to make sure the fields in the form aren't blank, then
     * i want to submit the data in those fields to server/auth/login
     * on success i want to redirect to the USER OVERVIEW page
     * on failure i want to alert INVALID USERNAME / PASSWORD and then reload the login page
     */

    /* if the user is somehow already logged in, redirect their ass to the 
      main app page */
    if (authService.currentUserValue) {
      alert("your ass is already logged in!  redirecting u");
      return history.push("/");
    }
    /* before submitting, check if either of the input fields are blank */
    if (data.username === "" || data.password === "") {
      alert("user name / password cannot be blank!");
      return;
    } else {
      /* if the username and password fields are filled out, submit the post request to auth/login */
      /* call the login function of authservice) */
      await authService.login(data);
      if (authService.currentUserValue !== null) {
        console.log(
          "the current user been set and is: " +
            JSON.stringify(authService.currentUserValue)
        );
        console.log(
          "localstorage.getitem(currentuser) is:" +
            localStorage.getItem("currentUser")
        );
        history.push("/");
      } else {
        console.log("current user aint been set and is: " + currentUser);
        setCurrentUser(null);
      }
    }
  };

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
          validatorListener={setValidName} // if input is currently invalid and displaying error message, set invalid state
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
          validatorListener={setValidPass} // if input is currently invalid and displaying error message, set invalid state
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
