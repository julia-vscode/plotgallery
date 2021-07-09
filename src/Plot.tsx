import React from 'react';

import Plotly from 'plotly.js'
import PlotlyPlot from 'react-plotly.js';
import { Vega, VegaLite } from 'react-vega';
import { vega } from 'vega-embed';
import { compile, TopLevelSpec } from 'vega-lite';
import { PlotData } from './App';
import './Plot.css';

export type PlotProps = {
    plot: PlotData | null,
    onThumbnailUpdate: (thumbnailURL: string) => void,
    onInvalidPlot: (e: Error) => void,
    zoomFactor: Number,
}

const Plot = ({plot, onThumbnailUpdate, onInvalidPlot, zoomFactor} : PlotProps) => {
  if (plot) {
    // For developers: comment/uncomment the code below to hide/expose vega
    (window as any).vega = vega;
    switch (plot.type) {
      case "vega":
        if (!plot.thumbnail) {
          // render a thumbnail if there is no thumbnail in the plot object
          try {
            let view = new vega.View(vega.parse(plot.data)).initialize();
            if ((view.width() as any) === "container" || (view.height() as any) === "container") { // The reason that we need to cast both return values to any is that although in function types they return a number, they do return string "container" in the case of "container" width/height
              view.width(1000);
              view.height(500);
            }
            view.toImageURL("png").then(onThumbnailUpdate);
          } catch (e) {
            console.warn("Error generating thumbnail for a vega plot:", e);
          }
        }
        return (
          <Vega spec={plot.data} className="vega-plot" onError={onInvalidPlot} />
        );
      case "vega-lite":
        if (!plot.thumbnail) {
          try {
            let view = new vega.View(vega.parse(compile(plot.data as TopLevelSpec).spec)).initialize();
            if ((view.width() as any) === "container" || (view.height() as any) === "container") { // The reason that we need to cast both return values to any is that although in function types they return a number, they do return string "container" in the case of "container" width/height
              view.width(1000);
              view.height(500);
            }
            view.toImageURL("png").then(onThumbnailUpdate);
          } catch (e) {
            console.warn("Error generating thumbnail for a vega-lite plot:", e);
          }
        }
        return (
          <VegaLite spec={plot.data} className="vegalite-plot" onError={onInvalidPlot} />
        );
      case "plotly":
        let plotData = JSON.parse(plot.data);
        
        if (!plot.thumbnail) {
          Plotly.newPlot(document.createElement('div'), plotData.data, plotData.layout).then(function(gd) {
            Plotly.toImage(gd, {height: 500, width: 500, format: 'png'}).then(onThumbnailUpdate);
          });
        }

        plotData.layout["autosize"] = true;

        return (<PlotlyPlot
          style={{width: "100%", height: "100%"}}
          data={plotData.data}
          layout={plotData.layout}
          config={{responsive: true}}
        />);
      case "image":
        if (!plot.thumbnail) {
          onThumbnailUpdate(plot.data.toString());
        }
        return <img src={plot.data} style={{transform: `scale(${zoomFactor})`, transformOrigin: "top left"}} alt="Plot"></img>
      default:
        console.warn("Invalid plot type " + plot.type + " with data " + plot.data.toString());
        return <p>Unsupported plot type: {plot.type}</p>
    }
  }
  return null;
}

export default Plot;
