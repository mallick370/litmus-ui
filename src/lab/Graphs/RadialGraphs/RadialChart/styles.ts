import { makeStyles, Theme } from "@material-ui/core";
import { LegendTableOrientation } from "./RadialChart";

interface StyleProps {
  width: number;
  height: number;
  circleOrient?: number;
  alignLegendTable?: LegendTableOrientation;
  legendTableHeight?: number;
  innerRadius: number;
  outerRadius: number;
  arcWidth: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  radialChartRoot: (props: StyleProps) => ({
    width: props.width,
    height: props.height,
    position: "relative",
    transition: "0.5s",
  }),
  rectBase: {
    fill: theme.palette.background.paper,
  },

  radialFont: {
    textAlign: "left",
    fontStyle: "normal",
    fontFamily: "Ubuntu",
  },
  centerDataFont: {
    fontStyle: "normal",
    fontFamily: "Ubuntu",
    background: "transparent",
    wordWrap: "break-word",
    whiteSpace: "initial",
    textAlign: "center",
    lineHeight: "1.5rem",
    margin: theme.spacing(1, 0),
    alignContent: "flex-start",
  },
  centerValue: {
    maxWidth: "8rem",
    minWidth: "6rem",
    fontSize: "1.5rem",
    fontWeight: 500,
    color: theme.palette.text.primary,
  },

  centerText: {
    width: "6rem",
    fontSize: "1rem",
    fontWeight: 300,
    color: theme.palette.text.hint,
  },

  centerDataContainer: (props: StyleProps) => ({
    position: "absolute",
    top:
      props.circleOrient === 1
        ? props.innerRadius * 2
        : props.innerRadius + props.arcWidth,
    left: props.alignLegendTable === "bottom" ? "50%" : "25%",
    transform: "translate(-50%, -50%)",
  }),

  legendTableArea: (props: StyleProps) => ({
    display: "flex",
    width: props.alignLegendTable === "bottom" ? props.width : props.width / 2,
    height:
      props.alignLegendTable === "bottom"
        ? props.legendTableHeight
        : props.outerRadius * 2,
    alignItems:
      props.circleOrient === 1
        ? props.alignLegendTable === "right"
          ? "flex-end"
          : "center"
        : "center",
  }),

  legendTableChild: (props: StyleProps) => ({
    width: "inherit",
    height: props.legendTableHeight,
    transform:
      props.circleOrient === 1
        ? props.alignLegendTable === "right"
          ? "translate(0,-25%)"
          : "unset"
        : "unset",
  }),

  figureWithLegendTable: (props: StyleProps) => ({
    display: props.alignLegendTable === "bottom" ? "inline-block" : "flex",
  }),
}));
export { useStyles };
