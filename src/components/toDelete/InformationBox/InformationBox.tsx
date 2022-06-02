import { Argument } from "classnames";
import React from 'react';

import styles from './InformationBox.module.scss';

export function InformationBox(props: {  icon: React.ReactNode; theme?: "warning" | "error" | "neutral"; size?: "large" | "medium" | "small"; error?: boolean; className?: Argument; children: React.ReactNode; }) {
  const BASE_THEME = styles.InformationBox;
  let theme = styles.InformationBox__neutral;
  const propsTheme = props.theme;
  if (propsTheme === `warning`) theme = styles.InformationBox__warning;
  if (propsTheme === `error`) theme = styles.InformationBox__error;
  if (propsTheme === `neutral`) theme = styles.InformationBox__neutral;
  if (props.error === true) theme = styles.InformationBox__error;
  let size = styles.InformationBox__large;
  if (props.size === `large`) size = styles.InformationBox__large;
  if (props.size === `medium`) size = styles.InformationBox__medium;
  if (props.size === `small`) size = styles.InformationBox__small;
  let finalStyle;
  if (props.className)
    finalStyle = BASE_THEME + ` ` + props.className + ` ` + theme + ` ` + size;
  else finalStyle = BASE_THEME + ` ` + theme + ` ` + size;
  
  return (<div className={finalStyle}>
    {props.icon && <div className={styles.InformationBox__icon}>{props.icon}</div>}
    {props.children}
  </div>)
  
}