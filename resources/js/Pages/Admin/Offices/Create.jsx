import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const DAYS_OF_WEEK = [
    { id: 1, name: 'Senin' },
    { id: 2, name: 'Selasa' },
    { id: 3, name: 'Rabu' },
    { id: 4, name: 'Kamis' },
    { id: 5, name: 'Jumat' },
    { id: 6, name: 'Sabtu' },
    { id: 0, name: 'Minggu' },
];

function LocationMarker({ position, setPosition }) {
    const map = useMap();
    
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition(lat.toFixed(7), lng.toFixed(7));
        },
    });

    useEffect(() => {
        if (position[0] && position[1]) {
            map.flyTo(position, 18, {
                duration: 1.5
            });
        }
    }, [position, map]);

    return position[0] === null ? null : (
        <Marker 
            position={position} 
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const marker = e.target;
                    const { lat, lng } = marker.getLatLng();
                    setPosition(lat.toFixed(7), lng.toFixed(7));
                }
            }}
        />
    );
}

function MapSearch({ onSelect }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length < 3) {
                setResults([]);
                return;
            }

            setSearching(true);
            try {
                // Focused on Indonesia results using Bounding Box and prioritizing local results
                const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10&lang=en&bbox=94.1,-11.1,141.2,6.1&lat=-6.175&lon=106.827`);
                const data = await res.json();
                
                // Extra safety: Filter out any results that might still be outside Indonesia
                const filtered = (data.features || []).filter(f => 
                    f.properties.country === 'Indonesia' || 
                    f.properties.countrycode === 'ID' ||
                    !f.properties.country // assume local if country is missing from some levels
                ).slice(0, 6);
                
                setResults(filtered);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setSearching(false);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div className="absolute top-6 left-6 z-[10] w-72 sm:w-80">
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-blue-500">
                    {searching ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    )}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari wilayah/tempat..."
                    className="w-full pl-12 pr-10 py-4 bg-white border-none rounded-2xl shadow-2xl text-slate-900 font-bold placeholder-slate-300 focus:ring-4 focus:ring-blue-100 transition-all text-sm"
                />
                
                {query && (
                    <button 
                        type="button"
                        onClick={() => { setQuery(''); setResults([]); }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-500"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                )}
                
                {results.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-50 overflow-hidden divide-y divide-slate-50 z-[20]">
                        {results.map((res, i) => {
                            const p = res.properties;
                            const mainName = p.name || p.street || '';
                            const subName = [p.city, p.state, p.country].filter(Boolean).join(', ');
                            
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const [lon, lat] = res.geometry.coordinates;
                                        onSelect(lat, lon);
                                        setQuery(mainName);
                                        setResults([]);
                                    }}
                                    className="w-full p-4 text-left hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                                >
                                    <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    </div>
                                    <div className="flex flex-col gap-0.5 overflow-hidden">
                                        <span className="text-xs font-black text-slate-800 line-clamp-1">{mainName}</span>
                                        <span className="text-[10px] font-bold text-slate-400 line-clamp-1 italic">{subName}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminOfficesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        latitude: '',
        longitude: '',
        radius_meters: 200,
        working_hour_start: '08:30',
        working_days: [1, 2, 3, 4, 5, 6],
    });

    const [mapCenter, setMapCenter] = useState([-6.1751, 106.8650]); // Default Jakarta

    const setCoordinates = (lat, lng) => {
        setData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates(latitude.toFixed(7), longitude.toFixed(7));
                setMapCenter([latitude, longitude]);
            }, (error) => {
                alert('Gagal mendapatkan lokasi: ' + error.message);
            });
        } else {
            alert('Geolokasi tidak didukung oleh browser ini.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.offices.store'));
    };

    const markerPosition = useMemo(() => {
        if (data.latitude && data.longitude) {
            return [parseFloat(data.latitude), parseFloat(data.longitude)];
        }
        return [null, null];
    }, [data.latitude, data.longitude]);

    return (
        <AuthenticatedLayout header="Tambah Kantor Baru">
            <Head title="Tambah Kantor" />

            <div className="max-w-6xl mx-auto pb-12 animate-slide-up px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Daftarkan Cabang</h2>
                        <p className="text-slate-500 font-medium mt-1">Pilih lokasi di peta atau masukkan koordinat secara manual.</p>
                    </div>
                    <Link 
                        href={route('admin.offices.index')} 
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm hover:border-slate-200 hover:text-slate-600 transition-all shadow-xl shadow-slate-100/30"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Side: Form */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
                            <div className="p-8 flex-1">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Kantor / Cabang</label>
                                        <input 
                                            type="text" 
                                            value={data.name} 
                                            onChange={(e) => setData('name', e.target.value)} 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-900 placeholder-slate-300 shadow-inner" 
                                            placeholder="Contoh: Kantor Pusat Jakarta" 
                                        />
                                        {errors.name && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">⚠️ {errors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Garis Lintang (Latitude)</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-300 font-bold text-xs uppercase">Lat</span>
                                                <input 
                                                    type="number" 
                                                    step="0.0000001" 
                                                    value={data.latitude} 
                                                    onChange={(e) => setData('latitude', e.target.value)} 
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-900 placeholder-slate-300 shadow-inner tabular-nums" 
                                                    placeholder="-6.175100" 
                                                />
                                            </div>
                                            {errors.latitude && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">⚠️ {errors.latitude}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Garis Bujur (Longitude)</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-300 font-bold text-xs uppercase">Lng</span>
                                                <input 
                                                    type="number" 
                                                    step="0.0000001" 
                                                    value={data.longitude} 
                                                    onChange={(e) => setData('longitude', e.target.value)} 
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-900 placeholder-slate-300 shadow-inner tabular-nums" 
                                                    placeholder="106.865000" 
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Jam Masuk Kantor</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-primary-500">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                </div>
                                                <input 
                                                    type="time" 
                                                    value={data.working_hour_start} 
                                                    onChange={(e) => setData('working_hour_start', e.target.value)} 
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-black text-slate-900 placeholder-slate-300 shadow-inner tabular-nums" 
                                                />
                                            </div>
                                            {errors.working_hour_start && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">⚠️ {errors.working_hour_start}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <div className="flex items-center justify-between mb-2 ml-1">
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Hari Kerja</label>
                                                <button 
                                                    type="button"
                                                    onClick={() => setData('working_days', [1, 2, 3, 4, 5, 6])}
                                                    className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                                                >
                                                    Pilih Sen - Sab
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {DAYS_OF_WEEK.map((day) => (
                                                    <button
                                                        key={day.id}
                                                        type="button"
                                                        onClick={() => {
                                                            const current = [...data.working_days];
                                                            const index = current.indexOf(day.id);
                                                            if (index === -1) {
                                                                current.push(day.id);
                                                            } else {
                                                                current.splice(index, 1);
                                                            }
                                                            setData('working_days', current);
                                                        }}
                                                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                                                            data.working_days.includes(day.id)
                                                                ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200'
                                                                : 'bg-white border-slate-200 text-slate-400 hover:border-primary-200 hover:text-primary-500'
                                                        }`}
                                                    >
                                                        {day.name}
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.working_days && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">⚠️ {errors.working_days}</p>}
                                        </div>
                                    </div>

                                    <div className="bg-primary-50/50 p-6 rounded-3xl border border-primary-100/50 relative overflow-hidden group">
                                        <label className="block text-[10px] font-black text-primary-400 uppercase tracking-widest mb-4 text-center">Radius Jangkauan Absensi (Meter)</label>
                                        <div className="flex items-center gap-6 relative z-10">
                                            <input 
                                                type="range" 
                                                min="10" 
                                                max="1000" 
                                                value={data.radius_meters} 
                                                onChange={(e) => setData('radius_meters', parseInt(e.target.value))} 
                                                className="flex-1 h-2 bg-primary-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                            />
                                            <div className="w-20 px-4 py-2 bg-white rounded-xl border border-primary-100 text-center shadow-sm">
                                                <span className="text-lg font-black text-primary-600 tabular-nums">{data.radius_meters}</span>
                                            </div>
                                        </div>
                                        {errors.radius_meters && <p className="text-rose-500 text-xs font-bold mt-2 text-center">⚠️ {errors.radius_meters}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Map */}
                        <div className="flex flex-col gap-6 h-[500px] lg:h-auto">
                            <div className="flex-1 relative rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
                                <MapContainer 
                                    center={mapCenter} 
                                    zoom={13} 
                                    scrollWheelZoom={true} 
                                    className="h-full w-full"
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <LocationMarker position={markerPosition} setPosition={setCoordinates} />
                                </MapContainer>
                                
                                {/* Search Sidebar */}
                                <MapSearch onSelect={(lat, lon) => {
                                    setCoordinates(lat.toFixed(7), lon.toFixed(7));
                                    setMapCenter([lat, lon]);
                                }} />

                                {/* Map Floating Controls */}
                                <div className="absolute top-6 right-6 z-[10] flex flex-col gap-3">
                                    <button 
                                        onClick={(e) => { e.preventDefault(); handleGetCurrentLocation(); }}
                                        type="button"
                                        className="p-4 bg-white text-blue-600 rounded-2xl shadow-2xl hover:bg-blue-50 transition-colors border border-blue-100 group flex items-center gap-2 font-black text-xs uppercase tracking-widest"
                                        title="Gunakan Lokasi Saya Saat Ini"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                        Lokasi Saya
                                    </button>
                                </div>
                                
                                <div className="absolute bottom-10 left-10 right-10 z-[1000]">
                                    <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white shadow-2xl flex items-center gap-5">
                                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        </div>
                                        <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                                            Geser marker biru pada peta atau klik dimanapun untuk menentukan titik koordinat kantor secara presisi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary-500/20 text-base flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5 font-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            {processing ? 'Menyimpan...' : 'Simpan Lokasi Kantor'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
