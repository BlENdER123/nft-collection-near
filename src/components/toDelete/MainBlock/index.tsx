import "./index.scss";

import { FormHelperText } from "@mui/material";
import cls from "classnames";
import PropTypes from "prop-types";
import React, { LegacyRef } from "react";

import { MainBlockProps } from "../../../types";

function MainBlock(
  {
    button,
    class: className,
    classHeader,
    classTitle,
    content,
    error,
    footer,
    helperText,
    normalTitle,
    smallTitle,
    title,
    ...rest
  }: MainBlockProps,
  ref: LegacyRef<HTMLDivElement>,
) {
  return (
    <div className="mainblock-wrapper">
      <div
        className={cls("mainblock", className)}
        style={{
          borderColor: error ? "var(--error)" : "var(--mainblock-border-color)",
        }}
        ref={ref}
        {...rest}
      >
        {(title || button) && (
          <div className={cls("mainblock-header", classHeader)}>
            <h2
              className={cls("mainblock-title", classTitle, {
                "mainblock-title--normal": normalTitle,
                "mainblock-title--small": smallTitle,
              })}
            >
              {title}
            </h2>
            {button}
          </div>
        )}
        {content}
        {footer}
      </div>
      {helperText && (
        <FormHelperText
          error={error}
          style={{
            textAlign: "center",
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </div>
  );
}

export default React.forwardRef(MainBlock);
