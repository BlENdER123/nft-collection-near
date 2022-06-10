import PropTypes from "prop-types";
import React from "react";

import { SearchInputProps } from "../../../types";
import classes from "./index.module.scss";

export default function SearchInput({ onChange }: SearchInputProps) {
  return (
    <div className={classes["search-input-wrapper"]}>
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.3">
          <path
            d="M0.00262209 8.22438C0.18212 12.8016 3.59258 16.1789 8.25954 16.3567C12.8816 16.5344 16.337 12.4905 16.5164 8.17994C16.6959 3.60275 12.6124 0.180962 8.25954 0.00320715C3.63746 -0.130109 0.18212 3.91382 0.00262209 8.22438C-0.0422524 9.64642 2.20147 9.64642 2.24635 8.22438C2.56047 0.580911 13.9137 0.580911 14.2278 8.22438C14.3625 11.5573 11.4008 14.0459 8.21466 14.1792C4.84907 14.3125 2.3361 11.3795 2.20147 8.22438C2.1566 6.80234 -0.087127 6.7579 0.00262209 8.22438Z"
            fill="#41444E"
          />
          <path
            d="M13.7082 13.9343C15.5032 15.7119 17.2982 17.4894 19.0931 19.267C19.0931 18.7337 19.0931 18.2005 19.0931 17.7116C18.9585 17.8449 18.8239 17.9783 18.6893 18.1116C19.2278 18.1116 19.7663 18.1116 20.2599 18.1116C18.4649 16.334 16.6699 14.5565 14.8749 12.7789C14.8749 13.3122 14.8749 13.8455 14.8749 14.3343C15.0096 14.201 15.1442 14.0676 15.2788 13.9343C16.3109 12.9122 14.6954 11.3569 13.7082 12.379C13.5736 12.5123 13.439 12.6456 13.3043 12.7789C12.8556 13.2233 12.8556 13.9343 13.3043 14.3343C15.0993 16.1118 16.8943 17.8894 18.6893 19.6669C19.138 20.1113 19.856 20.1113 20.2599 19.6669C20.3945 19.5336 20.5291 19.4003 20.6638 19.267C21.1125 18.8226 21.1125 18.1116 20.6638 17.7116C18.8688 15.9341 17.0738 14.1565 15.2788 12.379C14.2467 11.3569 12.6761 12.9567 13.7082 13.9343Z"
            fill="#41444E"
          />
        </g>
      </svg>
      <input
        type="text"
        className={classes["search-input"]}
        placeholder="Search name or paste address"
        onChange={(event) => onChange(event)}
      />
    </div>
  );
}

SearchInput.propTypes = {
  onChange: PropTypes.func,
};

SearchInput.defaultProps = {
  onChange: () => {},
};