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

    const statusConfig = {
        hadir: { label: 'Hadir', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg> },
        izin: { label: 'Izin', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
        alpha: { label: 'Alpha', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg> },
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout header="Absensi">
            <Head title="Absensi" />

            <div className="max-w-4xl mx-auto space-y-6">
                {todayAttendance ? (
                    <div className="bg-white rounded-[2.5rem] p-10 text-center border border-slate-100 shadow-2xl shadow-blue-500/10 animate-fade-in relative overflow-hidden group">
                        {/* Decorative background element */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                        <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                        
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20 group-hover:rotate-6 transition-transform">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Presensi Berhasil!</h2>
                            <p className="text-slate-500 font-medium mb-6">Kamu telah tercatat masuk untuk hari ini.</p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    <span className="text-sm font-black text-slate-700 ont-mono">{todayAttendance.clock_in_time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-sm ${statusConfig[todayAttendance.status]?.color}`}>
                                        {statusConfig[todayAttendance.status]?.label}
                                    </span>
                                    {office?.working_hour_start && todayAttendance.clock_in_time > office.working_hour_start && (
                                        <span className="inline-flex px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-sm bg-rose-50 text-rose-500 border border-rose-100 italic">
                                            Terlambat
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-slide-up space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="bg-white rounded-[2.5rem] p-8 border border-white shadow-2xl shadow-blue-500/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Absensi GPS</h2>
                                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Validasi Lokasi Kerja</p>
                                    </div>
                                </div>

                                {/* Map Container */}
                                <div className="w-full h-80 sm:h-96 bg-slate-50 rounded-[2rem] mb-8 overflow-hidden relative border border-slate-100 shadow-inner group">
                                    {position ? (
                                        <Suspense fallback={
                                            <div className="flex items-center justify-center h-full">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Memuat Peta...</p>
                                                </div>
                                            </div>
                                        }>
                                            <MapSection position={position} office={office} />
                                        </Suspense>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300">
                                            <div className="text-center group-hover:scale-105 transition-transform duration-500">
                                                <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-4 border border-slate-200">
                                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Ambil Lokasi Terlebih Dahulu</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={getLocation}
                                        disabled={gettingLocation}
                                        className="bg-white hover:bg-slate-50 text-slate-700 font-black text-xs uppercase tracking-[0.15em] py-4 px-8 rounded-2xl border border-slate-200 transition-all flex-1 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {gettingLocation ? (
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        )}
                                        {gettingLocation ? 'Mencari...' : 'Ambil Lokasi'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleClockIn}
                                        disabled={!position || processing}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-[0.15em] py-4 px-8 rounded-2xl transition-all shadow-xl shadow-blue-500/25 flex-1 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {processing ? (
                                            <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        ) : (
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
                                        )}
                                        {processing ? 'Memproses...' : 'Submit Presensi'}
                                    </button>
                                </div>
                                
                                {/* Error Message */}
                                {(locationError || errors.location || errors.attendance) && (
                                    <div className="px-6 py-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <p className="text-sm font-bold">{locationError || errors.location || errors.attendance}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent History Table */}
                {/* Riwayat Absensi Terintegrasi */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Riwayat Presensi</h3>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg">
                            30 Hari Terakhir
                        </span>
                    </div>

                    {recentAttendances?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hari & Tanggal</th>
                                        <th className="text-center px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu Masuk</th>
                                        <th className="text-center px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentAttendances.map((att) => (
                                        <tr key={att.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 leading-tight">
                                                        {new Date(att.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-400 mt-0.5">
                                                        {new Date(att.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-xl font-black text-sm font-mono border border-slate-100 group-hover:border-blue-200 transition-colors">
                                                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                        {att.clock_in_time.substring(0, 5)}
                                                    </div>
                                                    {office?.working_hour_start && att.clock_in_time > office.working_hour_start && (
                                                        <span className="text-[9px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md">
                                                            Terlambat
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm ${statusConfig[att.status]?.color}`}>
                                                    {statusConfig[att.status]?.icon}
                                                    {statusConfig[att.status]?.label}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">Belum ada riwayat presensi</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}