import React, {Component} from 'react';
import Thumbnail from './Thumbnail'
import Plot from './Plot';

import './App.css';

export type PlotData = {
  type: string,
  data: any,
  thumbnail: string | null,
}

type AppState = {
  plots: any[],
  index: number,
}

export class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      plots: [],
      index: 0
    };

    // Expose addPlot and switchTo
    (window as any).addPlot = this.addPlot;
    (window as any).switchTo = this.switchTo;
  }

  addPlot = (plot: PlotData, noSwitch: Boolean = false) => {
    this.setState((state) => (
      {
        ...state,
        plots: [...state.plots, plot],
      }
    ));
    if (!noSwitch) {
      this.switchTo(this.state.plots.length - 1);
    }
  }

  switchTo = (index: number) => {
    this.setState((state) => (
      {
        ...state,
        index,
      }
    ));
  }

  switchToFunc = (indexFunc: (oldIndex: number, state: AppState) => number) => {
    this.setState((state) => {
        let index = indexFunc(state.index, state);
        if (index < 0 || index > this.state.plots.length - 1) { // do not switch if it causes out of bounds
          return state;
        } else {
          return {
            ...state,
            index,
          };
        }
      }
    );
  }

  updateThumbnail = (index:number, thumbnailURL:string) => {
    this.setState((state) => {
      let plots = this.state.plots.slice();
      plots[index].thumbnail = thumbnailURL;
      
      return {
        ...state,
        plots: plots,
      }
    });
  }

  copyListener = (event: ClipboardEvent) => {
    if (event.clipboardData) {
      event.clipboardData.setData('text/html', '<img src="' + encodeURI(this.state.plots[this.state.index].thumbnail) + '" />');
    }
    event.preventDefault();
  };

  deleteCurrentPlot = () => {
    this.setState((state) => {
      let plots = state.plots.slice();
      let index = state.index;
      plots.splice(state.index, 1);
      if (!plots[state.index]) {
        if (plots.length === 0) {
          index = 0;
        } else {
          index = plots.length - 1;
        }
      }
      return {
        ...state,
        index,
        plots,
      };
    });
  };

  deletePlot = (index: number) => {
    // we delete the invalid plot
    this.setState((state) => {
      let plots = state.plots.slice();
      plots.splice(index, 1);
      if (!plots[state.index]) {
        if (plots.length === 0) {
          index = 0;
        } else {
          index = plots.length - 1;
        }
      }
      return {
        ...state,
        index,
        plots,
      };
    });
  };

  keyDownListener = (event: KeyboardEvent) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    
    if (event.keyCode === 40 || event.keyCode === 39) {
      // arrow down/right
      
      // Note that we cannot call switchTo since we are getting old index and writing the index back
      this.switchToFunc((index) => (index + 1));
    } else if (event.keyCode === 38 || event.keyCode === 37) {
      // arrow up/left
      this.switchToFunc((index) => (index - 1));
    } else if (event.keyCode === 36) {
      // home
      this.switchTo(0);
    } else if (event.keyCode === 35) {
      // end
      this.switchToFunc((_, state) => (state.plots.length - 1));
    } else if (event.keyCode === 8 || event.keyCode === 46) {
      // backspace/delete
      this.deleteCurrentPlot();
    }
  }

  componentDidMount() {
    document.addEventListener('copy', this.copyListener);
    document.addEventListener('keydown', this.keyDownListener);
  }

  componentWillUnmount() {
    document.removeEventListener('copy', this.copyListener);
    document.removeEventListener('keydown', this.keyDownListener);
  }

  render = () => (
    <div className="App">
      <div className="left-panel">
        {this.state.plots.map((_, index) => <Thumbnail key={index} index={index} thumbnailURL={this.state.plots[index].thumbnail} onClick={()=>{this.switchTo(index)}} selected={index===this.state.index} />)}
      </div>
      <div className="main-plot">
        <Plot
          plot={this.state.plots[this.state.index] ? this.state.plots[this.state.index] : null}
          onThumbnailUpdate={(thumbnailURL) => this.updateThumbnail(this.state.index, thumbnailURL)}
          onInvalidPlot={(e: Error) => {
            alert("We encountered the following error while displaying plot " + (this.state.index + 1) + ": " + e.toString());
            this.deletePlot(this.state.index);
          }}
        />
      </div>
    </div>
  );

}

export default App;