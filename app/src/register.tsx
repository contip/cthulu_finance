import * as React from 'react';

type registerProps = {
    submitURL: string
}

type registerState = {
    userName: string;
    userPass: string;
    response: boolean;
}

export default class Register extends React.Component<{}, registerState> {
    constructor(props: registerProps) {
        super(props)
        this.state = {
            userName: '',
            userPass: '',
            response: false
        };
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({name: {name: event.target.value}});
    }

    handleSubmit = (event: React.MouseEvent) => {
        alert('A form was submitted: ' + JSON.stringify(this.state.name));
        fetch('http://localhost:6969/lookup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.name)
        }).then(response => response.json())
        .then(response => this.setState({
            lookupResponse: { company: response.companyName, price: response.latestPrice, symbol: response.symbol }
        }));

    }

    render() {
        return (
                <div className='lookup'>
                <p>
                    <input type="text" value={this.state.name.name} name="name" onChange={this.handleChange} />
                    <button onClick={this.handleSubmit}>Get Quote!</button>
                </p>
                <p>
                    {this.state.lookupResponse.company != '' &&
                    <p>company: {this.state.lookupResponse.company}
                    <p>price: {this.state.lookupResponse.price}
                    <p>label: {this.state.lookupResponse.symbol}</p></p></p>}
                    </p>
                    </div>
        );
    }
}

