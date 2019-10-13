import React, {Component} from 'react';
import Thumbnail from './Thumbnail'
import Plot from './Plot';

import './App.css';


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

  addPlot = (data: any) => {
    this.setState((state) => (
      {
        ...state,
        plots: [...state.plots, data],
      }
    ));
  }

  render = () => (
    <div className="App">
      <div className="left-panel">
        {this.state.plots.map((_, index) => <Thumbnail key={index} index={index}/>)}
      </div>
      <div className="main-plot">
        <Plot data={this.state.plots[0] ? this.state.plots[0] : {}} />
      </div>
    </div>
  );

}

export default App;
