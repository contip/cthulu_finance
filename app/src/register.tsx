import React from "react";
import { useForm } from "react-hook-form";

type RegisterState = {
  username: string,
  hash: string,
  confirm: string
}

export class RegisterForm extends React.Component<{}, RegisterState> {
  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      hash: '',
      confirm: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log("i am changin the dang state of things");
    console.log(this.state);
    this.setState({ username: event.target.value });
  }

  handleSubmit(event: React.FormEvent) {
    if (this.state.confirm !== this.state.hash){
      alert("passwords don't matched!!");
    }
    else {
      console.log(JSON.stringify(this.state));
      console.log(this.state.confirm);
      alert('A form was submitted: ' + JSON.stringify(this.state));
      fetch('http://localhost:6969/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.state)
      }).then(response => response.json())
      .then(response => console.log("registration successful!"));
      };
    
  }

  render()
  {
  return (
    <form onSubmit={this.handleSubmit}>
      <input name="username" placeholder="User Name" required={true} maxLength={20} onChange={this.handleChange}/>
      <p>
      <input name="hash" type="password" placeholder="Password" />
      </p>
      <p>
      <input name="confirm" type="password" placeholder="Password (again)" />
      </p>
      <input type="submit" value="Register!" />
    </form>
  );
      }
}