import {
  CSSProperties,
  MouseEventHandler,
  ReactChild,
  ReactFragment,
  ReactPortal,
} from 'react';

import styles from './Button.module.scss';

export default function Button(props: {
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
  style?: CSSProperties | undefined;
  theme?: 'transparent' | "light";
  size?: 'icon' | 'small' | 'medium' | 'large';
  error?: boolean;
  id?: string;
  className?: string;
  disabled?: boolean;
  icon?: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined;
  children:
    | boolean
    | ReactChild
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) {
  const BASE_THEME = styles.Button;
  let theme = styles.Button__neutral;
  const propsTheme = props.theme;
  if (propsTheme === `transparent`) theme = styles.Button__transparent;
  if (propsTheme === `light`) theme = styles.Button__light;
  if (props.error === true) theme = styles.Button__error;
  let size = styles.Button__medium;
  if (props.size === `large`) size = styles.Button__large;
  let finalStyle;
  if (props.className)
    finalStyle = BASE_THEME + ` ` + props.className + ` ` + theme + ` ` + size;
  else finalStyle = BASE_THEME + ` ` + theme + ` ` + size;
  return (
    <button
      onClick={props.onClick}
      id={props.id}
      style={props.style}
      disabled={props.disabled}
      className={finalStyle}
    >
      {props.icon && <div className={styles.Button__icon}>{props.icon}</div>}
      <span>{props.children}</span>
    </button>
  );
}
