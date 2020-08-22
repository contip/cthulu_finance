import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { authService } from "./auth.service";

interface IFormInput {
  username: string;
  hash: string;
  confirm: string;
  valid: boolean;
}

export default function Register() {
  let history = useHistory();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valid, setValid] = useState(false);
  const [changed, setChanged] = useState(false);
  const { register, handleSubmit } = useForm<IFormInput>();
  const updateUserName = async (text: string) => {
    console.log('i have been called to update username state and it not workin');
    await setUsername(text);
  }
  const onSubmit = async (data: IFormInput) => {
    /* if the user is somehow already logged in, redirect their ass to the 
      main app page */
    if (authService.currentUserValue) {
      alert("your ass is already logged in!  redirecting u");
      return history.push("/");
    }
    /* if confirm password field doesn't match pw field, notify user and reset
     * the passwod and confirm password field states */
    if (data.confirm !== data.hash) {
      alert("passwords don't matched!!");  // this should be a reusable error component
      updateUserName('anusbreath')
      console.log("current value of username state is:", username);
      return;
    } else {
      if (valid) {
        if (data.confirm === "" || data.hash === "") {
          alert("all fields are required!");
          return;
        }
        // console.log(JSON.stringify(data));
        // console.log(data.confirm);
        alert("A form was submitted: " + JSON.stringify(data));
        await fetch("http://localhost:6969/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then(async (response) => {
            await authService.newUser(response);
            //currentUserSubject.next(user);
            //sessionStorage.setItem("token", response.access_token);
            //console.log(sessionStorage);
            history.push("/");
          });
      } else {
        alert("u must enter valid user name!");
        return;
      }
    }
  };

  const userNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('i am in the user name change handler');
    // console.log(event);
    setUsername(event.target.value);
    setChanged(false);
    console.log(username);
  };

  /* prevent from sending requests if form is empty */
  const userNameCheck = async (event: any) => {
    await fetch("http://localhost:6969/auth/available", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        if (response) {
          setValid(true);
        } else {
          setValid(false);
        }
        setChanged(true);
      });
  };


  const userPassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("i am in the user pass change handler");
    console.log(event);
    setPassword(event.target.value);
    console.log(password);
  };

  const confirmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("i am in the confirm pass change handler");
    console.log(event);
    setConfirm(event.target.value);
    console.log(confirm);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="username"
        placeholder="User Name"
        ref={register({ required: true, maxLength: 20 })}
        onChange={userNameChange}
        onBlur={userNameCheck}
      />
      <p>
        {valid && changed && <p>this user name is available lol </p>}
        {!valid && changed && <p>this user name is NOT available lol </p>}
        <input
          name="password"
          type="password"
          placeholder="Password"
          ref={register({ pattern: /^[A-Za-z]+$/i })}
          onChange={userPassChange}
        />
      </p>
      <p>
        <input
          name="confirm"
          type="password"
          placeholder="Password (again)"
          ref={register({
            pattern: /^[A-Za-z]+$/i,
          })}
          onChange={confirmChange}
        />
      </p>
      <input type="submit" value="Register!" />
    </form>
  );
}
