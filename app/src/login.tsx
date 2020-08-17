import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { authService } from "./auth.service";
import { useHistory } from "react-router-dom";

interface IFormInput {
  username: string;
  password: string;
}

export default function LoginForm() {
  let [currentUser, setCurrentUser] = useState<string | null>();
  let history = useHistory();

  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit = async (data: IFormInput) => {
    /* on submit i want to make sure the fields in the form aren't blank, then
     * i want to submit the data in those fields to server/auth/login
     * on success i want to redirect to the USER OVERVIEW page
     * on failure i want to alert INVALID USERNAME / PASSWORD and then reload the login page
     */

    /* if the user is somehow already logged in, redirect their ass to the 
      main app page */
    if (authService.currentUserValue) {
      alert("your ass is already logged in!  redirecting u");
      return history.push("/test");
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
        history.push("/test");
      } else {
        console.log("current user aint been set and is: " + currentUser);
        setCurrentUser(null);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          name="username"
          placeholder="User Name"
          ref={register({ required: true, maxLength: 20 })}
        />
        <p>
          <input
            name="password"
            type="password"
            placeholder="Password"
            ref={register({ required: true, pattern: /^[A-Za-z]+$/i })}
          />
        </p>
        <input type="submit" value="Login!" />
      </form>
    </div>
  );
}
