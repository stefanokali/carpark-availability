import React from "react";
import { Marker, Tooltip, Popup } from "react-leaflet";
import L from "leaflet";
import { Icon } from "leaflet";
import "./CarparkIcon.css";

const CarparkIcon = ({ availableLots, lat, lon, carparkName }) => {
  const customIcon = new Icon({
    iconUrl: require("../img/320px-HD_transparent_picture.png"),
    iconSize: [35, 35],
  });

  return (
    <Marker position={[lat, lon]} icon={customIcon} opacity={1}>
      <Tooltip
        direction="center"
        offset={[0, 0]}
        opacity={1}
        permanent={true}
        className={
          "label" +
          (availableLots < 30
            ? availableLots < 5
              ? " red-icon"
              : " orange-icon"
            : " green-icon")
        }
      >
        {availableLots}
        <Popup>{carparkName}</Popup>
      </Tooltip>
    </Marker>
  );
};

export default CarparkIcon;
