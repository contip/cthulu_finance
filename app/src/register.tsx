import React, { IframeHTMLAttributes, useState } from "react";
import { useForm } from "react-hook-form";

interface IFormInput {
  username: string;
  hash: string;
  confirm: string;
  valid: boolean;
}

export default function App() {
  
  const [ username, setUsername ] = useState('');
  const [ hash, setHash ] = useState('');
  const [ confirm, setConfirm ] = useState('');
  const [ valid, setValid ] = useState(false);
  const [ changed, setChanged ] = useState(false);
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit = (data: IFormInput) => {
    if (data.confirm !== data.hash){
      alert("passwords don't matched!!");
      return;
    }
    else {

      if (valid) {
        if (data.confirm === "" || data.hash === "")
        {
          alert("u must entered a pw!!!");
          return;
        }
        console.log(JSON.stringify(data));
        console.log(data.confirm);
        alert('A form was submitted: ' + JSON.stringify(data));
        fetch('http://localhost:6969/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(response => console.log("registration successful!"));
        }
      else {
        alert("u must enter valid user name!")  
        return;
      }
        
        ;}
    }
  
    const userNameChange = (event: React.ChangeEvent<HTMLInputElement>, ) => {
        console.log('i am in the user name change handler');
        console.log(event);
        setUsername(event.target.value);
        setChanged(false);
        console.log(username);

    }

    const userNameCheck = (event: any) => {
      fetch('http://localhost:6969/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "username": username, "hash":"" })
      }).then(response => response.json())
      .then(response => 
        {
          if (response["VALID"])
          {
            setValid(true);
            setChanged(true);
          }
          else {
            setValid(false);
            setChanged(true);
        }})
    

    }
    
    const userPassChange = (event: React.ChangeEvent<HTMLInputElement>, ) => {
        console.log('i am in the user pass change handler');
        console.log(event);
        setHash(event.target.value);
        console.log(hash);

    }

    const confirmChange = (event: React.ChangeEvent<HTMLInputElement>, ) => {
        console.log('i am in the confirm pass change handler');
        console.log(event);
        setConfirm(event.target.value);
        console.log(confirm);

    }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name="username" placeholder="User Name" ref={register({ required:
         true, maxLength: 20 })} onChange={userNameChange} onBlur={userNameCheck} />
      <p>
        {valid && changed && <p>this user name is available lol </p>}
        {!valid && changed && <p>this user name is NOT available lol </p>}
      <input name="hash" type="password" placeholder="Password" ref={register({ pattern: 
        /^[A-Za-z]+$/i })} onChange={userPassChange} />
      </p>
      <p>
      <input name="confirm" type="password" placeholder="Password (again)" ref={register({ 
        pattern: /^[A-Za-z]+$/i })} onChange={confirmChange} />
      </p>
      <input type="submit" value="Register!" />
    </form>
  );
}