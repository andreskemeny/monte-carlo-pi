import React, { Component } from 'react';
import "./App.css"
import Plot from 'react-plotly.js';

class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
      x_in_circle: [],
      y_in_circle: [],
      x_outside_circle: [],
      y_outside_circle: [],
      iterationsDefined: false,
      iterations: 0,
      in_circle: 0,
      total: 0,
      pi: 0
		};
  }

  calc = () => {
    let in_circle = 0;
    let total = 0;
    let x_in_circle = [];
    let y_in_circle = [];
    let x_outside_circle = [];
    let y_outside_circle = [];
    for (let i = 0; i < this.state.iterations; i++) {
      let x = Math.random();
      let y = Math.random();

      let distance = (x**2) + (y**2);

      if (distance <= 1) {
        in_circle += 1;
        x_in_circle.push(x);
        y_in_circle.push(y);
      } else {
        x_outside_circle.push(x);
        y_outside_circle.push(y);
      }

      total += 1;
    }

    let pi = 4 * in_circle/total;

    this.setState({
      in_circle: in_circle,
      total: total,
      pi: pi,
      x_in_circle: x_in_circle,
      y_in_circle: y_in_circle,
      x_outside_circle: x_outside_circle,
      y_outside_circle: y_outside_circle
    })
  }

  setIterations = () => {
    this.setState({
      iterationsDefined: true
    })
  }

  handleIterationsChange = (event) => {
    this.setState({ iterations: event.target.value });
  }
  
  render() {
    const {
			iterations,
			in_circle,
			total,
      pi,
      iterationsDefined,
      x_in_circle,
      y_in_circle,
      x_outside_circle,
      y_outside_circle
    } = this.state;
    
    return (
      <div>
        <div className="controls">
          <Plot
            data={[
                {
                    x: x_in_circle,
                    y: y_in_circle,
                    type: 'scatter',
                    mode: 'markers',
                    marker: {color: 'blue'},
                    name: "Inside",
                },
                {
                    x: x_outside_circle,
                    y: y_outside_circle,
                    type: 'scatter',
                    mode: 'markers',
                    marker: {color: 'red'},
                    name: "Outside",
                },
            ]}
            layout={{
                width: 800,
                height: 800,
                title: 'Trying to demonstrate estimation of Pi with Monte Carlo algorithm',
                shapes: [
                    {
                        type: 'circle',
                        xref: 'x',
                        yref: 'y',
                        x0: -1,
                        y0: -1,
                        x1: 1,
                        y1: 1,
                        line: {
                            color: 'lightblue'
                        }
                    },
                ],
                "xaxis": {"fixedrange": true, rangemode: "nonnegative"},
                "yaxis": {"fixedrange": true, rangemode: "nonnegative"},
            }}
          />
        </div>
        
        <div className="controls">
          {iterationsDefined ?
            <div style={{margin: "16px 0"}}>
              Iterations: <input disabled value={iterations} /> 
              <button className="button" onClick={this.calc}>Calculate</button>
            </div> :
            <div style={{margin: "16px 0"}}>
              Iterations: <input value={iterations} onChange={this.handleIterationsChange} /> 
              <button className="button" onClick={this.setIterations}>Set</button>
            </div>
          }
        </div>
        <div className="controls" style={{marginTop: "-16px"}}>
          <p>Points in circle: {in_circle} |</p>
          <p>&nbsp; Total Points: {total} |</p>
          <p>&nbsp; Estimation of Pi: {pi}</p>
        </div>
        <div className="controls" style={{marginTop: "-16px"}}>
          <p>
            <i style={{color: "gray"}}>
              The more iterations the more it will take to load, but the more precise the estimate will be.
            </i>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
