import * as React from "react";
import { authService } from "./auth.service";

type LookUpProps = {
  actionURL: string;
};

type LookUpState = {
  name: { name: string };
  lookupResponse: { company: string; price: number; symbol: string };
};

export default class LookupApi extends React.Component<{}, LookUpState> {
  constructor(props: LookUpProps) {
    super(props);
    this.state = {
      name: { name: "" },
      lookupResponse: { company: "", price: 0, symbol: "" },
    };
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: { name: event.target.value } });
  };

  handleSubmit = async (event: React.MouseEvent) => {
    alert("A form was submitted: " + JSON.stringify(this.state.name));
    /* definitely store the server URL in a constant somewhere */
    await fetch("http://localhost:6969/lookup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer ' + sessionStorage.token,
        Authorization: "Bearer " + authService.currentUserValue.accessToken,
      },
      body: JSON.stringify(this.state.name),
    })
      .then((response) => response.json())
      .then((response) =>
        this.setState({
          lookupResponse: {
            company: response.companyName,
            price: response.latestPrice,
            symbol: response.symbol,
          },
        })
      );
  };

  render() {
    return (
      <div className="lookup">
        <p>
          <input
            type="text"
            value={this.state.name.name}
            name="name"
            onChange={this.handleChange}
          />
          <button onClick={this.handleSubmit}>Get Quote!</button>
        </p>
        <p>
          {this.state.lookupResponse.company !== "" && (
            <p>
              company: {this.state.lookupResponse.company}
              <p>
                price: {this.state.lookupResponse.price}
                <p>label: {this.state.lookupResponse.symbol}</p>
              </p>
            </p>
          )}
        </p>
      </div>
    );
  }
}
