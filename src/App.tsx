import { useState, useEffect } from "react";
import Plot, { PlotParams } from "react-plotly.js";
import Form from "./components/Form/Form";
import { calculateIntersection } from "./utils/calculateIntersection";
import { Intersection, Segment } from "./global.types";

type IData = PlotParams["data"];

const App = () => {
  const [plotData, setPlotData] = useState<IData>([]);
  const [intersection, setIntersection] = useState<Intersection | null>(null);

  useEffect(() => {
    if (intersection) {
      setPlotData((previousPlotData) => {
        const newPlotData = [...previousPlotData];
        if (intersection.type === "point") {
          newPlotData.push({
            x: [intersection.x],
            y: [intersection.y],
            type: "scatter",
            mode: "markers",
            name: "Punkt przecięcia",
          });
        } else {
          newPlotData.push({
            x: [intersection.start.x, intersection.end.x],
            y: [intersection.start.y, intersection.end.y],
            type: "scatter",
            mode: "lines",
            name: "Odcinek wspólny",
          });
        }
        return newPlotData;
      });
    }
  }, [intersection]);

  const calc = (segment1: Segment, segment2: Segment) => {
    const result = calculateIntersection(segment1, segment2);
    if (result === null) {
      setIntersection(null);
    } else {
      setIntersection(result);
    }
  };

  const updatePlot = (segment1: Segment, segment2: Segment) => {
    setPlotData([
      {
        x: [segment1.start.x, segment1.end.x],
        y: [segment1.start.y, segment1.end.y],
        type: "scatter",
        mode: "lines",
        name: "Segment 1",
      },
      {
        x: [segment2.start.x, segment2.end.x],
        y: [segment2.start.y, segment2.end.y],
        type: "scatter",
        mode: "lines",
        name: "Segment 2",
      },
    ]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: "24px",
      }}
    >
      <Form
        onSuccess={({ segment1, segment2 }) => {
          updatePlot(segment1, segment2);
          calc(segment1, segment2);
        }}
      />
      <div>
        {intersection ? (
          <div>
            <p>Odcinki przecinają się: TAK</p>
            <p>
              {intersection.type === "point"
                ? `Punkt przecięcia: (${intersection.x}, ${intersection.y})`
                : `Przecięcie na odcinku: (${intersection.start.x}, ${intersection.start.y}) - (${intersection.end.x}, ${intersection.end.y})`}
            </p>
          </div>
        ) : (
          <p>Odcinki nie przecinają się</p>
        )}
      </div>
      <Plot
        data={plotData}
        layout={{ autosize: true }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default App;
