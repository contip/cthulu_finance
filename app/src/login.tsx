import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface IFormInput {
  username: string;
  password: string;
}

export default function Login() {
  
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit = (data: IFormInput) => {
      /* on submit i want to make sure the fields in the form aren't blank, then
      * i want to submit the data in those fields to server/auth/login
      * on success i want to redirect to the USER OVERVIEW page
      * on failure i want to alert INVALID USERNAME / PASSWORD and then reload the login page
      */ 
     /* before submitting, check if either of the input fields are blank */
     if (data.username === '' || data.password === '') {
         alert("user name / password cannot be blank!");
         return;
     }
     else {
         /* if the username and password fields are filled out, submit the post request to auth/login */
         fetch('http://localhost:6969/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(response => {
            if (!response.access_token) {
                /* bad login... alert user and reload login form */
                alert("invalid username / password!  plz tried again");
                /* call service_unauthorized()  -- general function to drop user from whatever they are accessing and bring to the login page */
                return;
            }
            else {
                sessionStorage.setItem("token", response.access_token); 
                console.log(sessionStorage.token)
            }
        })
     }
    }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name="username" placeholder="User Name" ref={register({ required:
         true, maxLength: 20 })} />
      <p>
      <input name="password" type="password" placeholder="Password" ref={register({ required: true, pattern: 
        /^[A-Za-z]+$/i })} />
      </p>
      <input type="submit" value="Login!" />
    </form>
  );
}