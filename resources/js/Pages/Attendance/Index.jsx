import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useCallback, lazy, Suspense } from 'react';

// Import dinamis untuk komponen peta yang sudah kamu pisahkan
// Pastikan path './Partials/MapSection' sesuai dengan lokasi file baru kamu
const MapSection = lazy(() => import('./Partials/MapSection'));

export default function AttendanceIndex({ office, workSchedule, todayAttendance, recentAttendances }) {
    const [position, setPosition] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [gettingLocation, setGettingLocation] = useState(false);
    const [showClockOutModal, setShowClockOutModal] = useState(false);
    const [canClockOutEnabled, setCanClockOutEnabled] = useState(false);
    const [clockOutMessage, setClockOutMessage] = useState('');
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        latitude: '',
        longitude: '',
    });

    const { data: clockOutData, setData: setClockOutData, post: postClockOut, processing: clockOutProcessing, errors: clockOutErrors } = useForm({
        work_report: '',
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

    // Check if can clock out
    const checkCanClockOut = useCallback(() => {
        fetch(route('attendance.canClockOut'))
            .then(res => res.json())
            .then(data => {
                setCanClockOutEnabled(data.canClockOut);
                setClockOutMessage(data.message);
            })
            .catch(err => console.error('Error checking clock out status:', err));
    }, []);

    const handleClockOutSubmit = (e) => {
        e.preventDefault();
        postClockOut(route('attendance.clockOut'), {
            onSuccess: () => {
                setShowClockOutModal(false);
                setClockOutData({ work_report: '' });
            },
        });
    };

    const statusConfig = {
        hadir: { label: 'Hadir', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> },
        izin: { label: 'Izin', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        alpha: { label: 'Alpha', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg> },
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const formatDuration = (minutes) => {
        if (!minutes) return '—';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}j ${m > 0 ? `${m}m` : ''}`.trim();
    };

    // Render clock out modal
    const renderClockOutModal = () => {
        if (!showClockOutModal) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl">
                    <div className="mb-6">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Clock Out</h3>
                        <p className="text-slate-500 font-medium text-sm">Silakan isi laporan pekerjaan Anda hari ini sebelum clock out.</p>
                    </div>

                    <form onSubmit={handleClockOutSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                                Pekerjaan yang Dilakukan *
                            </label>
                            <textarea
                                value={clockOutData.work_report}
                                onChange={(e) => setClockOutData({ work_report: e.target.value })}
                                placeholder="Tuliskan ringkasan pekerjaan Anda (minimal 20 karakter)..."
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows="4"
                            />
                            {clockOutErrors.work_report && (
                                <p className="text-xs text-rose-500 mt-1 font-semibold">{clockOutErrors.work_report}</p>
                            )}
                            <p className="text-xs text-slate-400 mt-1">
                                {clockOutData.work_report.length} / 20 karakter (minimal)
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowClockOutModal(false)}
                                className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 font-black text-sm uppercase tracking-wider rounded-xl hover:bg-slate-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={clockOutProcessing || clockOutData.work_report.length < 20}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:from-green-500 hover:to-emerald-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {clockOutProcessing ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Clock Out
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
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
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Presensi Tercatat!</h2>
                            <p className="text-slate-500 font-medium mb-6">Status presensi Anda untuk hari ini:</p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                                <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className="text-sm font-black text-slate-700 font-mono">{todayAttendance.clock_in_time}</span>
                                </div>
                                {todayAttendance.clock_out_time ? (
                                    <div className="px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="text-sm font-black text-emerald-700 font-mono">{todayAttendance.clock_out_time}</span>
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
                                <span className={`inline-flex px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-sm ${statusConfig[todayAttendance.status]?.color}`}>
                                    {statusConfig[todayAttendance.status]?.label}
                                </span>
                                {todayAttendance.is_late && (
                                    <span className="inline-flex px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-sm bg-rose-50 text-rose-600 border border-rose-100">
                                        Terlambat – {todayAttendance.late_minutes} menit
                                    </span>
                                )}
                                {todayAttendance.clock_out_time && (
                                    <span className="inline-flex px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-sm bg-sky-50 text-sky-600 border border-sky-100">
                                        Durasi: {Math.floor(todayAttendance.duration_minutes / 60)}h {todayAttendance.duration_minutes % 60}m
                                    </span>
                                )}
                            </div>

                            {!todayAttendance.clock_out_time && (
                                <button
                                    onClick={() => {
                                        checkCanClockOut();
                                        setShowClockOutModal(true);
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:from-amber-500 hover:to-orange-500 transition shadow-lg"
                                >
                                    Clock Out
                                </button>
                            )}
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
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Riwayat Presensi</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                30 Hari Terakhir
                            </p>
                        </div>
                    </div>

                    {recentAttendances?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Tanggal</th>
                                        <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Jam Masuk</th>
                                        <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Jam Keluar</th>
                                        <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Durasi Kerja</th>
                                        <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Tugas Dikerjakan</th>
                                        <th className="text-left px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentAttendances.map((att) => {
                                        const isPresent = att.status === 'hadir';
                                        return (
                                            <tr key={att.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-bold text-slate-900 leading-tight">
                                                        {new Date(att.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                                                    </p>
                                                    <p className="text-xs font-medium text-slate-400 mt-0.5">
                                                        {new Date(att.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-5 text-center">
                                                    {att.status === 'hadir' && !att.is_late && <span className="inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">Hadir</span>}
                                                    {att.status === 'hadir' && att.is_late && <span className="inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest bg-amber-100 text-amber-700">Terlambat</span>}
                                                    {att.status === 'izin' && <span className="inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest bg-sky-100 text-sky-700">Izin</span>}
                                                    {att.status === 'alpha' && <span className="inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest bg-red-100 text-red-700">Alpha</span>}
                                                    {att.status === 'libur' && <span className="inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-100 text-slate-700">Libur</span>}
                                                </td>
                                                <td className="px-4 py-5 text-center">
                                                    {isPresent ? <span className="text-sm font-bold text-slate-700 font-mono">{att.clock_in_time ? att.clock_in_time.substring(0, 5) : "—"}</span> : <span className="text-sm text-slate-300">—</span>}
                                                </td>
                                                <td className="px-4 py-5 text-center">
                                                    {isPresent ? <span className="text-sm font-bold text-slate-700 font-mono">{att.clock_out_time ? att.clock_out_time.substring(0, 5) : "—"}</span> : <span className="text-sm text-slate-300">—</span>}
                                                </td>
                                                <td className="px-4 py-5 text-center">
                                                    {isPresent && att.duration_minutes ? <span className="text-sm font-bold text-slate-700 font-mono">{formatDuration(att.duration_minutes)}</span> : <span className="text-sm text-slate-300">—</span>}
                                                </td>
                                                <td className="px-4 py-5 text-center">
                                                    {isPresent && att.work_report ? <p className="text-sm text-slate-600 truncate max-w-[200px] mx-auto" title={att.work_report}>{att.work_report}</p> : <span className="text-sm text-slate-300">—</span>}
                                                </td>
                                                <td className="px-4 py-5">
                                                    {att.status === 'hadir' && !att.is_late && <span className="text-sm text-slate-300">—</span>}
                                                    {att.status === 'hadir' && att.is_late && <span className="text-sm text-orange-500 font-medium italic">Terlambat – {att.late_minutes}m</span>}
                                                    {att.status === 'izin' && <span className="text-sm text-slate-500 italic">"{att.leave_reason || "—"}"</span>}
                                                    {(att.status === 'alpha' || att.status === 'libur') && <span className="text-sm text-slate-300">—</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-20 text-center flex flex-col items-center text-slate-400">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            </div>
                            <p className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-300">Belum ada riwayat presensi</p>
                        </div>
                    )}
                </div>

                {/* Clock Out Modal */}
                {renderClockOutModal()}
            </div>
        </AuthenticatedLayout>
    );
}