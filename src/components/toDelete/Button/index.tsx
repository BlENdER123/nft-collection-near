import cls from "classnames";
import PropTypes from "prop-types";

import { ButtonProps } from "../../../types";

export default function Button({ className, ...rest }: ButtonProps) {
  return (
    <button
      className={cls("btn", className, {
        "btn--disabled": rest.disabled,
      })}
      {...rest}
    />
  );
}

Button.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  className: null,
  disabled: null,
};
