import React, { Component } from 'react';
import "./App.css"
import Plot from 'react-plotly.js';
import axios from "axios";

class App extends Component {
  constructor(props) {
		super(props);
		this.state = {
      coords_x_in_circle: [],
      coords_y_in_circle: [],
      coords_x_outside_circle: [],
      coords_y_outside_circle: [],
      calculating: false,
      iterations: 0,
      in_circle: 0,
      pi: 0
		};
  }

  calc = () => {
    this.setState({
      calculating: true
    });

    let data = {
			iterations: parseInt(this.state.iterations)
    };

    axios
			.post(
				"https://5hanl732i4.execute-api.us-east-1.amazonaws.com/prod/calc",
				data
			)
			.then(res => {
        const {
          pi,
          coords_x_in_circle,
          coords_y_in_circle,
          coords_x_outside_circle,
          coords_y_outside_circle,
          in_circle
        } = res.data;

        this.setState({
          pi: pi,
          in_circle: in_circle,
          coords_x_in_circle: coords_x_in_circle,
          coords_y_in_circle: coords_y_in_circle,
          coords_x_outside_circle: coords_x_outside_circle,
          coords_y_outside_circle: coords_y_outside_circle,
          calculating: false
        });
      })
      .catch(err => {
        console.log(err)
        this.setState({
          calculating: false
        });
      });
  }

  handleIterationsChange = (event) => {
    this.setState({ iterations: event.target.value });
  }
  
  render() {
    const {
			iterations,
      pi,
      calculating,
      coords_x_in_circle,
      coords_y_in_circle,
      coords_x_outside_circle,
      coords_y_outside_circle,
      in_circle
    } = this.state;
    
    return (
      <div>
        <div className="controls">
          <Plot
            data={[
              {
                x: coords_x_in_circle,
                y: coords_y_in_circle,
                type: 'scatter',
                mode: 'markers',
                marker: {color: 'blue'},
                name: "Inside",
              },
              {
                x: coords_x_outside_circle,
                y: coords_y_outside_circle,
                type: 'scatter',
                mode: 'markers',
                marker: {color: 'red'},
                name: "Outside",
              },
            ]}
            layout={{
              width: 800,
              height: 800,
              title: 'Estimating Pi using the Monte Carlo Simulation',
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
          {calculating ?
            <div style={{margin: "16px 0"}}>
              Iterations: <input value={iterations} disabled /> 
              <button className="button" disabled>Calculating...</button>
            </div> :
            <div style={{margin: "16px 0"}}>
              Iterations: <input value={iterations} onChange={this.handleIterationsChange} /> 
              <button className="button" onClick={this.calc}>Calculate</button>
            </div>
          }
        </div>

        <div className="controls" style={{marginTop: "-16px"}}>
          <p>Points in circle: {in_circle} |</p>
          <p>&nbsp; Total Points: {iterations} |</p>
          <p>&nbsp; Estimation of Pi: {pi}</p>
        </div>
        
        <div className="controls" style={{marginTop: "-16px"}}>
          <p>
            <i style={{color: "gray"}}>
              The more iterations the more it will take to load, but the more precise the estimate will be.
              <br />
              The max amount of points displayed in the plot is 10,000 because of performance issues.
            </i>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
