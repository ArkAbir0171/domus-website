import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import styles from './Map.module.css'
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import { useState, useMemo, useRef, useEffect } from 'react'
import { useMapStore } from '../../store';
import { isEqualFloat } from '../../Utils/floatComparison';

const CustomMarker = ({ draggable, position, address }) => {

  const markerPosition = useMapStore((state) => state.markerPosition);
  const setMarkerPosition = useMapStore((state) => state.setMarkerPosition);




  const draggableMarkerReference = useRef(null)
  const dragEvents = useMemo(() => ({
    dragend() {
      const marker = draggableMarkerReference.current
      if (marker) setMarkerPosition({lat: marker.getLatLng()?.lat, lng: marker.getLatLng()?.lng} )
    }
  }), []);

  if (draggable) {
    return (
      <Marker draggable={true} position={markerPosition} ref={draggableMarkerReference} eventHandlers={dragEvents}>
        <Popup>{address}</Popup>
      </Marker>
    )

  }
  return (
    <Marker position={position}>   <Popup>{address}</Popup>  </Marker>
  )
}

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center);
  return null;
}


const Map = ({ draggable, position, address }) => {

  
  const markerPosition = useMapStore((state) => state.markerPosition);
  let positionOfDhaka = { lat: 23.7104000, lng: 90.4074400 };
  
  const [zoom, setZoom] = useState(null);
  console.log(position, markerPosition);
  
  useEffect(() => {
    if(position && !isEqualFloat(positionOfDhaka.lat, position.lat) && !isEqualFloat(positionOfDhaka.lng, position.lng)) setZoom(18);
    else setZoom(14);
  }, [])
  
  return (
    zoom &&
    <MapContainer className={styles.map} center={markerPosition} zoom={zoom} scrollWheelZoom={true}>
      <ChangeView center={markerPosition} zoom={zoom}/>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CustomMarker draggable={draggable} position={position ? position : positionOfDhaka} address={address} />
    </MapContainer>
  )
}

export default Map;