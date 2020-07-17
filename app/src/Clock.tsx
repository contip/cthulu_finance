import * as React from 'react';
// set the clock state with one field: current time

type ClockState = {
    time: Date
}

export default class Clock extends React.Component<{}, ClockState> {
    
    constructor({}) {
        super({});
        this.state = {
            time: new Date()
        };
    }
    tick = () => {
        this.setState({
            time: new Date()
        });
    }

    componentDidMount() {
        setInterval(() => {
            this.tick();
          }, 1000);
    }

    render() {
        return (
            <div className='clock'><h4>the current time is: {this.state.time.toLocaleTimeString()}</h4></div>        
        )

    }    
    }
    