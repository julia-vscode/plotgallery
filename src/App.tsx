import React, {Component} from 'react';
import Thumbnail from './Thumbnail'
import Plot from './Plot';

import './App.css';

export type PlotData = {
  type: string,
  data: any,
}

type AppState = {
  plots: any[],
}

export class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      plots: []
    };
    (window as any).addPlot = this.addPlot;
  }

  addPlot = (plot: PlotData) => {
    this.setState((state) => (
      {
        ...state,
        plots: [...state.plots, plot],
      }
    ));
  }

  render = () => (
    <div className="App">
      <div className="left-panel">
        {this.state.plots.map((_, index) => <Thumbnail key={index} index={index}/>)}
      </div>
      <div className="main-plot">
        <Plot plot={this.state.plots[0] ? this.state.plots[0] : null} />
      </div>
    </div>
  );

}

export default App;