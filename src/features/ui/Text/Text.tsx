import React from "react";
import styles from "./Text.module.css";

export type TextVariant =
  | "body"
  | "subtitle"
  | "title"
  | "caption"
  | "overline";
export type TextWeight = "regular" | "medium" | "bold";
export type TextAlign = "left" | "center" | "right";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  weight?: TextWeight;
  align?: TextAlign;
  muted?: boolean;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3";
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  weight = "regular",
  align = "left",
  muted = false,
  as: Component = "p",
  className = "",
  ...props
}) => {
  const classes = [
    styles.text,
    styles[`text--${variant}`],
    styles[`text--${weight}`],
    styles[`text--${align}`],
    muted ? styles["text--muted"] : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
