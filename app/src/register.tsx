import React, { useState } from "react";
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
  const [hash, setHash] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valid, setValid] = useState(false);
  const [changed, setChanged] = useState(false);
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit = async (data: IFormInput) => {
    /* if the user is somehow already logged in, redirect their ass to the 
      login page */
    if (authService.currentUserValue)
    {
      alert("your ass is already logged in!  redirecting u")
      return history.push("/test");
    }
    if (data.confirm !== data.hash) {
      alert("passwords don't matched!!");
      return;
    } else {
      if (valid) {
        if (data.confirm === "" || data.hash === "") {
          alert("u must entered a pw!!!");
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
          .then((response) => {
            sessionStorage.setItem("token", response.access_token);
            console.log(sessionStorage.token);
          });
        history.push("/test");
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

  const userNameCheck = async (event: any) => {
    await fetch("http://localhost:6969/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, hash: "" }),
    })
      .then((response) => response.json())
      .then((response) => {
        /* i think this qualifies as a magic string */
        if (response.id === -1) {
          setValid(true);
          setChanged(true);
        } else {
          setValid(false);
          setChanged(true);
        }
      });
  };

  const userPassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("i am in the user pass change handler");
    console.log(event);
    setHash(event.target.value);
    console.log(hash);
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
          name="hash"
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
