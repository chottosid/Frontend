import React from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapComponent = ({ userLocation, assistants, selectedAssistant, onAssistantSelect }) => {
    const mapStyles = {
        height: "400px",
        width: "100%"
    };

    const defaultCenter = userLocation || {
        lat: 12.9716,
        lng: 77.5946
    };

    const assistantIcon = {
        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: { width: 40, height: 40 }
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapStyles}
                zoom={14}
                center={defaultCenter}
            >
                {assistants?.map(assistant => (
                    <Marker
                        key={assistant.id}
                        position={assistant.location}
                        icon={assistantIcon}
                        onClick={() => onAssistantSelect(assistant)}
                    >
                        {selectedAssistant?.id === assistant.id && (
                            <InfoWindow onCloseClick={() => onAssistantSelect(null)}>
                                <div>
                                    <h6>{assistant.name}</h6>
                                    <p>Rating: {assistant.rating}⭐</p>
                                    <p>Distance: {assistant.distance}</p>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;