import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { authService } from "./auth.service";

interface IRegisterInput {
  username: string;
  password: string;
  confirm: string;
  valid: boolean;
}

/* controls the registration form and handles submitting and receiving
 * requests from the server for registering new users to the db */
export default function Register() {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valid, setValid] = useState(false);
  /* username availability notification (i.e. 'this name is available') hidden
   * until user has changed username field, thereafter message shown */
  const [changed, setChanged] = useState(false);
  const { register, handleSubmit } = useForm<IRegisterInput>();

  /* if registration successful or if logged-in user attempts to access
   * page, redirects them to the root (home) route */
  useEffect(() => {
    if (authService.currentUserValue) {
      return history.push("/");
    }
  });

  const onSubmit = async (data: IRegisterInput) => {
    /* TODO: the following validation checks should go in a separate
     * validateSubmit function */
    if (!valid) {
      alert("pls entered a valid username!");
      setUsername("");
      return;
    }
    if (!data.username || !data.password || !data.confirm) {
      alert("all field must be fill in!!!");
      return;
    }
    if (data.confirm !== data.password) {
      alert("passwords don't matched!!");
      setPassword("");
      setConfirm("");
      return;
    }
    /* server expects only 'username' and 'password' fields in req body, so
     * strip confirm field (pw already confirmed) */
    const { confirm, ...toSubmit } = data;
    alert("A form was submitted: " + JSON.stringify(toSubmit));
    /* TODO: server api urls should be defined in a constant */
    let response = await fetch("http://localhost:6969/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toSubmit),
    });
    if (response.status == 400) {
      alert("Error!  Registration attempt unsuccessful!");
      return;
    }
    await authService.newUser(await response.json());
  };

  /* queries server to determine whether or not current username state is a
   * valid username for new user */
  const userNameCheck = async (event: any) => {
    /* if form is empty, do nothing */
    if (!username) {
      return;
    }
    let response = await fetch("http://localhost:6969/auth/available", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username }),
    });
    setValid(await response.json());
    setChanged(true);
  };

  /* updates component username state whenever username form input is updated */
  const userNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    /* TODO: the setter functions for updating username, password, and confirm
     * state should be combined into one general setter function */
    setUsername(event.target.value);
    /* make availability notification disappear while user is typing */
    setChanged(false);
  };

  /* updates component password state whenever form input is changed */
  const userPassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  /* updates component confirm state whenever form input is changed */
  const confirmChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirm(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="username"
        placeholder="User Name"
        value={username}
        ref={register({ maxLength: 20 })}
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
          value={password}
          ref={register({ pattern: /^[A-Za-z]+$/i })}
          onChange={userPassChange}
        />
      </p>
      <p>
        <input
          name="confirm"
          type="password"
          placeholder="Password (again)"
          value={confirm}
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
