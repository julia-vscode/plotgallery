import React from 'react';
import { Vega, VegaLite } from 'react-vega';
import { vega } from 'vega-embed';
import { compile, TopLevelSpec } from 'vega-lite';
import { PlotData } from './App';
import './Plot.css';

export type PlotProps = {
    plot: PlotData | null,
    onThumbnailUpdate: (thumbnailURL: string) => void,
    onInvalidPlot: (e: Error) => void,
}

const Plot = ({plot, onThumbnailUpdate, onInvalidPlot} : PlotProps) => {
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
            new vega.View(vega.parse(compile(plot.data as TopLevelSpec).spec)).initialize().toCanvas().then(canvas =>
              (onThumbnailUpdate(canvas.toDataURL()))
            );
          } catch (e) {
            console.warn("Error generating thumbnail for a vega-lite plot:", e);
          }
        }
        return (
          <VegaLite spec={plot.data} className="vegalite-plot" onError={onInvalidPlot} />
        );
        
      case "image":
        if (!plot.thumbnail) {
          onThumbnailUpdate(plot.data.toString());
        }
        return <img src={plot.data} alt="Plot"></img>
      default:
        return <p>Unsupported plot type: {plot.type}</p>
    }
  }
  return null;
}

export default Plot;
