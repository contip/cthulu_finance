import React from "react";
import { useForm } from "react-hook-form";

interface IFormInput {
  username: string;
  hash: string;
  confirm: string;
}

export default function App() {
  
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit = (data: IFormInput) => {
    if (data.confirm !== data.hash){
      alert("passwords don't matched!!");
    }
    else {
      console.log(JSON.stringify(data));
      console.log(data.confirm);
      alert('A form was submitted: ' + JSON.stringify(data));
      fetch('http://localhost:6969/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      }).then(response => response.json())
      .then(response => console.log("registration successful!"));
      };
    }
  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name="username" placeholder="User Name" ref={register({ required:
         true, maxLength: 20 })} />
      <p>
      <input name="hash" type="password" placeholder="Password" ref={register({ pattern: 
        /^[A-Za-z]+$/i })} />
      </p>
      <p>
      <input name="confirm" type="password" placeholder="Password (again)" ref={register({ 
        pattern: /^[A-Za-z]+$/i })} />
      </p>
      <input type="submit" value="Register!" />
    </form>
  );
}