import cls from "classnames";
import PropTypes from "prop-types";

import settingsBtn from "../../../images/Vector.svg";
import { ButtonProps } from "../../../types";
import classes from "./index.module.scss";

export default function SettingsButton({ disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={cls(classes.btn, { "btn--disabled": disabled })}
      {...rest}
    >
      <img src={settingsBtn} alt={"settings"} />
    </button>
  );
}

SettingsButton.propTypes = {
  disabled: PropTypes.bool,
};

SettingsButton.defaultProps = {
  disabled: false,
};
