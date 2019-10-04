import React, {Component} from 'react';
import Thumbnail from './Thumbnail'

import './App.css';


type AppState = {
  plots: number[],
}

export class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      plots: []
    };
    (window as any).addPlot = this.addPlot;
  }

  addPlot = (plotIndex: number) => {
    this.setState((state) => (
      {
        ...state,
        plots: [...state.plots, plotIndex],
      }
    ));
  }

  render = () => (
    <div className="App">
      <div className="left-panel">
        {this.state.plots.map((index) => <Thumbnail key={index} index={index}/>)}
      </div>
      <div className="main-plot">
        The main plot.
      </div>
    </div>
  );

}

export default App;
