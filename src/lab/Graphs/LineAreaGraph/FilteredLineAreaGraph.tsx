import React from "react";
import { GraphMetric, LineAreaGraphChildProps } from "./base";
import { ComputationGraph } from "./ComputationGraph";

// filterUndefinedData performs type checking and
const filterUndefinedData = (
  data: GraphMetric[] | undefined
): GraphMetric[] | undefined =>
  data
    ? data
        .filter((elem) => elem && elem.data && elem.data.length)
        .filter((elem) =>
          elem.data.filter(
            (d) =>
              d &&
              d.date &&
              (typeof d.date === "number" || typeof d.date === "string") &&
              (typeof d.value === "number" || typeof d.value === "string")
          )
        )
    : data;

const FilteredLineAreaGraph: React.FC<LineAreaGraphChildProps> = ({
  compact = false,
  closedSeries,
  openSeries,
  eventSeries,
  height = 200,
  margin = {
    top: 20,
    left: 100,
    bottom: 20,
    right: 20,
  },
  ...rest
}) => {
  let augmentEventSeries: Array<GraphMetric> | undefined = filterUndefinedData(
    eventSeries
  );

  if (augmentEventSeries) {
    for (let i = 0; i < augmentEventSeries.length; i++) {
      for (let j = 0; j < augmentEventSeries[i].data.length; j++) {
        if (
          augmentEventSeries[i].data[j].value === 1 &&
          (j - 1 < 0 ||
            (j - 1 >= 0 && augmentEventSeries[i].data[j - 1].value === "False"))
        ) {
          augmentEventSeries[i].data[j].value = "Start";
        } else if (
          augmentEventSeries[i].data[j].value === 0 &&
          j - 1 >= 0 &&
          (augmentEventSeries[i].data[j - 1].value === "True" ||
            augmentEventSeries[i].data[j - 1].value === "Start")
        ) {
          augmentEventSeries[i].data[j].value = "End";
        } else if (augmentEventSeries[i].data[j].value === 0) {
          augmentEventSeries[i].data[j].value = "False";
        } else if (augmentEventSeries[i].data[j].value === 1) {
          augmentEventSeries[i].data[j].value = "True";
        }
      }
    }
  }
  augmentEventSeries = augmentEventSeries ?? [];
  const augmentClosedSeries: Array<GraphMetric> =
    filterUndefinedData(closedSeries) ?? [];

  const augmentOpenSeries: Array<GraphMetric> =
    filterUndefinedData(openSeries) ?? [];
  return (
    <div>
      <ComputationGraph
        closedSeries={augmentClosedSeries}
        openSeries={augmentOpenSeries}
        eventSeries={augmentEventSeries}
        height={height}
        margin={margin}
        compact={compact}
        {...rest}
      />
    </div>
  );
};

export { FilteredLineAreaGraph };
