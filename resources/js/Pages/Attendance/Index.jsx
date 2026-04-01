import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useCallback, lazy, Suspense } from 'react';

// Import dinamis untuk komponen peta yang sudah kamu pisahkan
// Pastikan path './Partials/MapSection' sesuai dengan lokasi file baru kamu
const MapSection = lazy(() => import('./Partials/MapSection'));

export default function AttendanceIndex({ office, todayAttendance, recentAttendances }) {
    const [position, setPosition] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [gettingLocation, setGettingLocation] = useState(false);
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        latitude: '',
        longitude: '',
    });

    const getLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation tidak didukung oleh browser Anda.');
            return;
        }

        setGettingLocation(true);
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = {
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                };
                setPosition(coords);
                setData(coords);
                setGettingLocation(false);
            },
            (err) => {
                console.error(err);
                setLocationError('Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin diberikan.');
                setGettingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [setData]);

    const handleClockIn = (e) => {
        e.preventDefault();
        if (!position) {
            setLocationError('Silakan ambil lokasi terlebih dahulu.');
            return;
        }
        post(route('attendance.clockIn'));
    };

    const statusLabels = {
        hadir: { text: 'Hadir', color: 'bg-accent-100 text-accent-700' },
        hampir_terlambat: { text: 'Hampir Terlambat', color: 'bg-amber-100 text-amber-700' },
        terlambat: { text: 'Terlambat', color: 'bg-red-100 text-red-700' },
    };

    return (
        <AuthenticatedLayout header="Absensi">
            <Head title="Absensi" />

            <div className="max-w-4xl mx-auto space-y-6">
                {todayAttendance ? (
                    <div className="glass-card p-8 text-center animate-slide-up">
                        <div className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent-500/30">
                            <span className="text-4xl">✅</span>
                        </div>
                        <h2 className="text-2xl font-bold text-dark-900 mb-2">Anda Sudah Absen Hari Ini</h2>
                        <p className="text-dark-500 mb-4">Jam Masuk: {todayAttendance.clock_in_time}</p>
                        <span className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${statusLabels[todayAttendance.status]?.color}`}>
                            {statusLabels[todayAttendance.status]?.text}
                        </span>
                    </div>
                ) : (
                    <div className="animate-slide-up space-y-6">
                        <div className="glass-card p-6">
                            <h2 className="text-xl font-bold text-dark-900 mb-4">📍 Absensi GPS</h2>
                            <p className="text-dark-500 mb-6">Ambil lokasi Anda lalu klik Clock In untuk melakukan absensi.</p>

                            {/* Map Container */}
                            <div className="w-full h-72 sm:h-96 bg-dark-100 rounded-2xl mb-6 overflow-hidden relative border border-dark-200">
                                {position ? (
                                    <Suspense fallback={
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                                <p className="text-sm text-dark-500">Memuat Peta...</p>
                                            </div>
                                        </div>
                                    }>
                                        <MapSection position={position} office={office} />
                                    </Suspense>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-dark-400 bg-dark-50">
                                        <div className="text-center">
                                            <span className="text-4xl block mb-2 opacity-50">🗺️</span>
                                            <p className="text-sm">Klik "Ambil Lokasi" untuk menampilkan peta</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    onClick={getLocation}
                                    disabled={gettingLocation}
                                    className="bg-white hover:bg-dark-50 text-dark-700 font-bold py-3 px-6 rounded-xl border border-dark-200 transition-all flex-1"
                                >
                                    {gettingLocation ? '⏳ Mencari...' : '📍 Ambil Lokasi'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleClockIn}
                                    disabled={!position || processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                                >
                                    {processing ? '⏳ Memproses...' : '✅ Clock In'}
                                </button>
                            </div>
                            
                            {/* Error Message */}
                            {(locationError || errors.location || errors.attendance) && (
                                <p className="mt-4 text-sm text-red-600 font-medium">
                                    ❌ {locationError || errors.location || errors.attendance}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Recent History Table */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-dark-900 mb-4">📋 Riwayat Terakhir</h3>
                    {recentAttendances?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-dark-100">
                                        <th className="text-left py-3 px-4 text-dark-600">Tanggal</th>
                                        <th className="text-left py-3 px-4 text-dark-600">Jam</th>
                                        <th className="text-left py-3 px-4 text-dark-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentAttendances.map((att) => (
                                        <tr key={att.id} className="border-b border-dark-50 hover:bg-dark-50/50">
                                            <td className="py-3 px-4">{att.date}</td>
                                            <td className="py-3 px-4 font-mono">{att.clock_in_time}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusLabels[att.status]?.color}`}>
                                                    {statusLabels[att.status]?.text}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-dark-400 text-center py-4 italic text-sm">Belum ada riwayat absen.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}