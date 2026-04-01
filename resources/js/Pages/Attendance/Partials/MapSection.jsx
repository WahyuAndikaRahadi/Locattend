import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icon marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function MapSection({ position, office }) {
    return (
        <MapContainer
            center={[position.latitude, position.longitude]}
            zoom={17}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle
                center={[parseFloat(office.latitude), parseFloat(office.longitude)]}
                radius={parseInt(office.radius_meters)}
                pathOptions={{ color: '#1b6af5', fillColor: '#338bff', fillOpacity: 0.15 }}
            />
            <Marker position={[parseFloat(office.latitude), parseFloat(office.longitude)]}>
                <Popup>🏢 {office.name}</Popup>
            </Marker>
            <Marker position={[position.latitude, position.longitude]}>
                <Popup>📍 Lokasi Anda</Popup>
            </Marker>
        </MapContainer>
    );
}