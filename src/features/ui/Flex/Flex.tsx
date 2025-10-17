import React, { type CSSProperties } from "react";
import styles from "./Flex.module.css";

export type FlexProps = {
  flexDirection?: CSSProperties["flexDirection"];
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  gap?: CSSProperties["gap"];
  flexWrap?: CSSProperties["flexWrap"];
  flex?: CSSProperties["flex"];
  margin?: CSSProperties["margin"];
  padding?: CSSProperties["padding"];
  children: React.ReactNode;
  style?: CSSProperties;
};

export default function Flex({
  flexDirection = "row",
  alignItems = "center",
  justifyContent = "center",
  gap = "8px",
  flexWrap = "wrap",
  flex = "0 1 auto",
  margin = "8px",
  padding = "0px",
  children,
  style = {},
}: FlexProps): React.JSX.Element {
  return (
    <div
      style={{
        ...style,
        flexDirection,
        alignItems,
        justifyContent,
        gap,
        flexWrap,
        flex,
        margin,
        padding,
      }}
      className={styles.container}
    >
      {children}
    </div>
  );
}
