import { useTheme } from "@material-ui/core";
import { Arc, Group, ParentSize } from "@visx/visx";
import React, { useState } from "react";
import { LegendData, LegendTable } from "../../LegendTable";
import { RadialChartMetric, RadialGraphProps } from "../base";
import { useStyles } from "./styles";

export type LegendTableOrientation = "bottom" | "right" | undefined;

export interface RadialChartProps extends RadialGraphProps {
  // Height of the Legent Table as number
  legendTableHeight?: number;

  // Boolean for enabling/disabling the corresponding Legend Table
  showLegend?: boolean;

  // Array of object of RadialChartMetric data for plotting the chart
  radialData: RadialChartMetric[];

  // Boolean for enabling/disabling the center heading
  showCenterHeading?: boolean;

  // Increase in the size of the radial arcs on hover
  circleExpandOnHover?: number;

  // For the orientation of the LegendTable either "right" or "bottom"
  alignLegendTable?: LegendTableOrientation;
}
export interface RadialChartChildProps extends RadialChartProps {
  // Width of the parent component automatically calcuated by the child
  width: number;

  // Height of the parent component automatically calcuated by the child
  height: number;
}

const RadialChartChild = ({
  width,
  height,
  radialData,
  arcWidth = 20,
  semiCircle = false,
  legendTableHeight = 150,
  showLegend = true,
  heading,
  circleExpandOnHover = 5,
  alignLegendTable = "bottom",
  showCenterHeading = true,
  unit = "",
  className,
}: RadialChartChildProps) => {
  const { palette } = useTheme();

  let legendData: Array<LegendData> = [{ data: [] }];
  const [centerValue, setcenterValue] = useState<string>("0");
  const [centerText, setCenterText] = useState<string>(heading ?? "");
  const [currentHovered, setcurrentHovered] = useState<string>("");
  const radialFigurWidth = alignLegendTable === "bottom" ? width : width / 2;
  const circleOrient = semiCircle ? 1 : 2;

  const scalerArc: number = circleOrient * Math.PI;
  const startAngle: number = -(Math.PI / 2);
  let currentAngle: number = startAngle;
  const outerRadius =
    (circleOrient === 1
      ? radialFigurWidth <= height * 2
        ? radialFigurWidth
        : height * 2
      : Math.min(radialFigurWidth, height)) *
      0.5 -
    arcWidth;
  const innerRadius = outerRadius - arcWidth;
  const classes = useStyles({
    width,
    height,
    circleOrient,
    alignLegendTable,
    legendTableHeight,
    innerRadius,
    outerRadius,
    arcWidth,
  });
  const total = radialData
    ? radialData.reduce(
        (previousValue, currentValue) => previousValue + currentValue.value,
        0
      )
    : NaN;
  const radialArc: RadialChartMetric[] = radialData
    ? radialData.map((elem) => {
        return {
          value: (total ? elem.value / total : 0) * scalerArc,
          label: elem.label,
          baseColor: elem.baseColor,
        };
      })
    : [{ value: NaN, label: "" }];
  if (centerValue === "0" && total > 0) {
    setcenterValue(total.toString());
    if (showCenterHeading) {
      setCenterText(`${heading}`);
    }
  }
  legendData = legendData.splice(0);

  if (radialData) {
    radialData.map((element, index) => {
      if (element.value !== undefined)
        legendData[index] = {
          data: [element.label ?? "", element.value.toString()],
          baseColor: element.baseColor,
        };
    });
  }
  return width < 10 ? null : (
    <div className={`${classes.radialChartRoot} ${className}`}>
      <div className={classes.figureWithLegendTable}>
        <svg width={radialFigurWidth} height={outerRadius * 2}>
          <rect
            width={radialFigurWidth}
            height={outerRadius * 2}
            className={classes.rectBase}
          />

          <Group
            top={circleOrient === 1 ? innerRadius * 2 : outerRadius}
            left={radialFigurWidth / 2}
          >
            {total > 0 &&
              radialArc &&
              radialArc.map((elem, i) => (
                <g key={`${elem.label}-arc-group`}>
                  <Arc
                    id={`${elem.label}-arc`}
                    data={elem.value}
                    innerRadius={
                      currentHovered === `${elem.label}-arc`
                        ? innerRadius - circleExpandOnHover
                        : innerRadius
                    }
                    outerRadius={
                      currentHovered === `${elem.label}-arc`
                        ? outerRadius + circleExpandOnHover
                        : outerRadius
                    }
                    fill={elem.baseColor}
                    startAngle={currentAngle}
                    endAngle={(currentAngle += elem.value)}
                    onMouseEnter={(e) => {
                      setcenterValue(radialData[i].value.toString());
                      if (showCenterHeading) {
                        setCenterText(`${heading}`);
                      }
                      setcurrentHovered(
                        e.currentTarget.getAttribute("id")?.toString() ?? ""
                      );
                    }}
                    onMouseLeave={() => {
                      setcenterValue(total.toString());
                      if (showCenterHeading) {
                        setCenterText(`${heading}`);
                      }
                      setcurrentHovered("");
                    }}
                    opacity={
                      currentHovered === ""
                        ? 1
                        : currentHovered === `${elem.label}-arc`
                        ? 1
                        : 0.7
                    }
                  />
                </g>
              ))}

            {(currentAngle = Math.PI)}
            {(total === 0 || Number.isNaN(total)) && (
              <Arc
                cornerRadius={2}
                padAngle={0.02}
                data
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                fill={palette.disabledBackground}
                startAngle={startAngle}
                endAngle={circleOrient === 1 ? Math.PI / 2 : 2 * Math.PI}
              />
            )}
          </Group>
        </svg>
        {showLegend && (
          <div className={classes.legendTableArea}>
            <div className={classes.legendTableChild}>
              <LegendTable data={legendData} />
            </div>
          </div>
        )}
      </div>

      <div className={classes.centerDataContainer}>
        <p className={`${classes.centerValue} ${classes.centerDataFont}`}>
          {`${centerValue} ${unit}`}
        </p>

        {showCenterHeading && (
          <p className={`${classes.centerText} ${classes.centerDataFont}`}>
            {centerText}
          </p>
        )}
      </div>
    </div>
  );
};
const RadialChart: React.FC<RadialChartProps> = ({ ...rest }) => {
  return (
    <ParentSize>
      {({ width, height }) =>
        width > 0 &&
        height > 0 && (
          <RadialChartChild width={width} height={height} {...rest} />
        )
      }
    </ParentSize>
  );
};

export { RadialChart };
