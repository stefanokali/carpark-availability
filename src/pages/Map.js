import React from "react";
import { apiLTA, apiHDB } from "../api/api";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./Map.css";
import "leaflet/dist/leaflet.css";
import Detail from "../components/Detail";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon } from "leaflet";
import hdbCarparkLocations from "../data/hdbCarparkLocations";
import CarparkIcon from "../components/CarparkIcon";

let initialLoad = true;

const Map = () => {
  const [ltaCarparks, setLtaCarparks] = useState([]);
  const [hdbCarparks, setHdbCarparks] = useState([]);

  useEffect(() => {
    if (initialLoad) {
      apiLTAGet();
      apiHDBGet();
      initialLoad = false;
    }
  }, []);

  const apiLTAGet = async () => {
    try {
      const response = await apiLTA.get("", {
        headers: {
          AccountKey: process.env.REACT_APP_API_KEY_LTA,
        },
      });
      setLtaCarparks(response.data.value);
    } catch (error) {
      console.log(error.message);
    }
  };

  const apiHDBGet = async () => {
    try {
      const response = await apiHDB.get("");
      const hdbCarparksAvailabilities = response.data.items[0].carpark_data;

      //Combining info from carpark location and availability
      const combinedHdbCarparkData = hdbCarparkLocations.map(
        (hdbCarparkLocation) => {
          const filterResult = hdbCarparksAvailabilities.filter(
            (hdbCarparksAvailability) =>
              hdbCarparksAvailability.carpark_number ==
              hdbCarparkLocation.car_park_no
          );

          if (filterResult.length > 0) {
            const newHdbCarparkLocation = {
              ...hdbCarparkLocation,
              lot_type: filterResult[0].carpark_info[0].lot_type,
              lots_available: filterResult[0].carpark_info[0].lots_available,
              total_lots: filterResult[0].carpark_info[0].total_lots,
            };

            return newHdbCarparkLocation;
          } else {
            return hdbCarparkLocation;
          }
        }
      );
      setHdbCarparks(combinedHdbCarparkData);
    } catch (error) {
      console.log(error.message);
    }
  };

  const createCustomClusterIcon = (cluster) => {
    const allChildMarkers = cluster.getAllChildMarkers();
    const total = allChildMarkers.reduce((sum, marker) => {
      const available = parseFloat(marker.options.children.props.children[0]);
      return sum + available;
    }, 0);

    return L.divIcon({
      html: "<b class='cluster-icon'>" + total + "</b>",
      className: ""
    });
  };

  return (
    <div className="flex-container">
      <div className="flex-child-map">
        <MapContainer
          center={[1.368791033335324, 103.80777095700411]}
          zoom={12}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup
            showCoverageOnHover={false}
            iconCreateFunction={createCustomClusterIcon}
          >
            {ltaCarparks.map((carpark) => {
              const coord = carpark.Location.split(" ");
              const lat = coord[0];
              const lon = coord[1];

              if (lat && lon && carpark.Agency != "HDB") {
                return (
                  <CarparkIcon
                    availableLots={carpark.AvailableLots}
                    lat={lat}
                    lon={lon}
                    carparkName={carpark.Development}
                  />
                );
              }
            })}

            {hdbCarparks.map((carpark) => {
              if (carpark && carpark.lots_available) {
                const lat = carpark.lat;
                const lon = carpark.lon;

                if (lat && lon) {
                  return (
                    <CarparkIcon
                      availableLots={carpark.lots_available}
                      lat={lat}
                      lon={lon}
                      carparkName={carpark.address}
                    />
                  );
                }
              }
            })}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
      <div className="flex-child-detail">
        <Detail />
      </div>
    </div>
  );
};

export default Map;
