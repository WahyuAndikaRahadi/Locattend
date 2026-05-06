import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState, useCallback, lazy, Suspense, useEffect } from 'react';

const MapSection = lazy(() => import('./Partials/MapSection'));

export default function AttendanceIndex({ office, workSchedule, todayAttendance, recentAttendances }) {
    const [position, setPosition] = useState(null);
    const [locationError, setLocationError] = useState('');
    const [gettingLocation, setGettingLocation] = useState(false);
    const [showClockOutModal, setShowClockOutModal] = useState(false);
    const [canClockOutEnabled, setCanClockOutEnabled] = useState(false);
    const [clockOutMessage, setClockOutMessage] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const { errors } = usePage().props;

    // Digital Clock Effect
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

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
                setLocationError('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
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

    const formatTime = (date) => {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };

    const formatDateFull = (date) => {
        return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    const statusConfig = {
        hadir: { label: 'Hadir', color: 'bg-emerald-500 text-white', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg> },
        izin: { label: 'Izin', color: 'bg-amber-500 text-white', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
        alpha: { label: 'Alpha', color: 'bg-slate-500 text-white', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg> },
    };

    return (
        <AuthenticatedLayout header="Presensi Harian">
            <Head title="Presensi" />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
                {/* Hero Status Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-[3.5rem] p-8 sm:p-14 shadow-2xl shadow-blue-600/20 group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.08] rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 opacity-[0.05] rounded-full blur-3xl -ml-20 -mb-20 transition-transform duration-1000 group-hover:-translate-y-10"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="text-center lg:text-left space-y-6 max-w-xl animate-slide-down">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                System GPS Active
                            </div>
                            
                            {todayAttendance ? (
                                <div className="space-y-4">
                                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                                        Selamat, Presensi Anda <br/>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Sudah Tercatat!</span>
                                    </h1>
                                    <p className="text-blue-100/80 text-lg font-medium">Lanjutkan pekerjaan Anda dengan semangat hari ini.</p>
                                </div>
                            ) : position ? (
                                <div className="space-y-4">
                                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                                        Lokasi Anda <br/>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-white">Berhasil Terdeteksi!</span>
                                    </h1>
                                    <p className="text-blue-100/80 text-lg font-medium">Koordinat terkunci. Silakan submit presensi Anda sekarang.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                                        Siap Untuk <br/>
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Mulai Bekerja?</span>
                                    </h1>
                                    <p className="text-blue-100/80 text-lg font-medium">Verifikasi lokasi Anda untuk melakukan Clock In.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-6 animate-fade-in">
                            {/* Digital Clock Widget */}
                            <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col items-center min-w-[280px] hover:bg-white/20 transition-all duration-500">
                                <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.4em] mb-2">Waktu Lokal</span>
                                <div className="text-5xl font-black text-white tracking-tighter mb-1 font-mono">
                                    {formatTime(currentTime)}
                                </div>
                                <div className="text-xs font-bold text-blue-100/60 uppercase tracking-widest text-center">
                                    {formatDateFull(currentTime)}
                                </div>
                            </div>
                            
                            {todayAttendance && !todayAttendance.clock_out_time && (
                                <button
                                    onClick={() => {
                                        checkCanClockOut();
                                        setShowClockOutModal(true);
                                    }}
                                    className="w-full px-8 py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95"
                                >
                                    <span className="flex items-center justify-center gap-3">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        Clock Out Sekarang
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Interactive Map Panel */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white rounded-[3rem] p-3 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden group">
                            <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100">
                                {position ? (
                                    <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Loading Map Database...</div>}>
                                        <MapSection position={position} office={office} />
                                    </Suspense>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300">
                                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-inner">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                        </div>
                                        <p className="font-black uppercase tracking-[0.2em] text-[10px]">Menunggu Verifikasi Koordinat</p>
                                    </div>
                                )}
                                
                                {/* Floating Location Info */}
                                <div className="absolute bottom-6 left-6 right-6 z-[400]">
                                    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Penempatan</p>
                                                <h4 className="font-black text-slate-900 tracking-tight">{office.name}</h4>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex flex-col items-end">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Radius Aman</p>
                                            <p className="font-black text-blue-600 uppercase tracking-widest text-xs">{office.radius_meters} Meter</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Attendance Control & Status */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Attendance Form */}
                        {!todayAttendance ? (
                            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                                        {position ? 'Lokasi Terverifikasi' : 'Ambil Lokasi GPS'}
                                    </h3>
                                    <p className="text-slate-500 font-medium">
                                        {position ? 'Koordinat Anda sudah terkunci dan siap dikirim.' : 'Klik tombol di bawah untuk memvalidasi posisi Anda.'}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {!position ? (
                                        <button
                                            onClick={getLocation}
                                            disabled={gettingLocation}
                                            className="w-full flex items-center justify-center gap-4 py-5 px-8 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {gettingLocation ? (
                                                <svg className="w-5 h-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            )}
                                            {gettingLocation ? 'Sinkronisasi...' : 'Dapatkan Lokasi Sekarang'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleClockIn}
                                            disabled={processing}
                                            className="w-full flex items-center justify-center gap-4 py-6 px-8 rounded-[1.8rem] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {processing ? (
                                                <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            ) : (
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            )}
                                            {processing ? 'Mendaftarkan...' : 'Kirim Presensi Sekarang'}
                                        </button>
                                    )}
                                    
                                    {position && (
                                        <button
                                            onClick={() => setPosition(null)}
                                            className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest py-2 hover:text-slate-600 transition-colors"
                                        >
                                            Reset Lokasi
                                        </button>
                                    )}
                                </div>

                                {(locationError || errors.location || errors.attendance) && (
                                    <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 text-rose-600">
                                        <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest mb-1">Verifikasi Gagal</p>
                                            <p className="text-sm font-bold">{locationError || errors.location || errors.attendance}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Status Details Card */
                            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-10 animate-fade-in relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sudah Tercatat</h3>
                                        <p className="text-slate-500 font-medium italic">Anda aktif bekerja hari ini</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jam Masuk</span>
                                        <span className="text-xl font-black text-slate-900 font-mono tracking-tighter">{todayAttendance.clock_in_time}</span>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jam Keluar</span>
                                        <span className="text-xl font-black text-slate-900 font-mono tracking-tighter">{todayAttendance.clock_out_time || '--:--'}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl">
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Status Kehadiran</span>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusConfig[todayAttendance.status]?.color}`}>
                                            {statusConfig[todayAttendance.status]?.label}
                                        </span>
                                    </div>
                                    {todayAttendance.is_late && (
                                        <div className="flex items-center justify-between p-5 bg-rose-50 border border-rose-100 rounded-2xl">
                                            <span className="text-xs font-black text-rose-400 uppercase tracking-widest">Keterlambatan</span>
                                            <span className="text-xs font-black text-rose-600 uppercase tracking-widest">{todayAttendance.late_minutes} Menit</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {/* Work Schedule Summary Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h4 className="text-xl font-black tracking-tight">Jadwal Hari Ini</h4>
                                </div>
                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">Jam Kerja</span>
                                        <span className="text-sm font-black font-mono">{workSchedule?.clock_in || '08:00'} - {workSchedule?.clock_out || '17:00'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">Toleransi</span>
                                        <span className="text-sm font-black font-mono">15 Menit</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent History List View */}
                <div className="bg-white rounded-[3.5rem] p-10 sm:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">Riwayat Presensi</h3>
                            <p className="text-slate-500 font-medium mt-1">Aktivitas kehadiran Anda dalam 30 hari terakhir.</p>
                        </div>
                        <Link href={route('attendance.history')} className="px-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] border border-slate-200 transition-all active:scale-95">
                            Buka Laporan Lengkap
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentAttendances?.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {recentAttendances.slice(0, 5).map((att) => (
                                    <div key={att.id} className="group p-6 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 rounded-[2.5rem] border border-transparent hover:border-slate-100 transition-all duration-500 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex flex-col items-center justify-center shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                    {new Date(att.date).toLocaleDateString('id-ID', { month: 'short' })}
                                                </span>
                                                <span className="text-xl font-black text-slate-900 leading-none">
                                                    {new Date(att.date).getDate()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">
                                                    {new Date(att.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                        att.status === 'hadir' ? (att.is_late ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700') : 'bg-slate-200 text-slate-600'
                                                    }`}>
                                                        {att.status} {att.is_late && '• Terlambat'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 md:gap-12 overflow-x-auto pb-2 md:pb-0">
                                            <div className="flex flex-col gap-1 shrink-0">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clock In</span>
                                                <span className="text-sm font-black text-slate-700 font-mono">{att.clock_in_time ? att.clock_in_time.substring(0, 5) : '--:--'}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 shrink-0">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clock Out</span>
                                                <span className="text-sm font-black text-slate-700 font-mono">{att.clock_out_time ? att.clock_out_time.substring(0, 5) : '--:--'}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 shrink-0">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Durasi</span>
                                                <span className="text-sm font-black text-slate-700 font-mono">
                                                    {att.duration_minutes ? `${Math.floor(att.duration_minutes / 60)}j ${att.duration_minutes % 60}m` : '--'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center flex flex-col items-center gap-4">
                                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center border-4 border-white shadow-inner">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-300 italic">Data histori belum tersedia</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Clock Out Modal Revamped - Even More Premium */}
            {showClockOutModal && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 sm:p-10">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setShowClockOutModal(false)}></div>
                    <div className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-[4rem] p-10 sm:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white/50 overflow-hidden animate-slide-up">
                        {/* Artistic blobs for modal */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                        
                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 bg-red-600 text-white rounded-[2rem] flex items-center justify-center shadow-lg">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Laporan Selesai</h3>
                                    <p className="text-slate-500 font-semibold text-lg">Waktunya istirahat, apa pencapaian Anda hari ini?</p>
                                </div>
                            </div>

                            <form onSubmit={handleClockOutSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">Deskripsi Pekerjaan *</label>
                                    <textarea
                                        value={clockOutData.work_report}
                                        onChange={(e) => setClockOutData({ work_report: e.target.value })}
                                        placeholder="Contoh: Menyelesaikan modul absensi GPS, memperbaiki bug pada layout dashboard, dan rapat koordinasi tim."
                                        className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium text-lg resize-none min-h-[180px]"
                                    />
                                    <div className="flex justify-between px-2">
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                            {clockOutErrors.work_report}
                                        </p>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${clockOutData.work_report.length >= 20 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                            {clockOutData.work_report.length} / 20 Karakter
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowClockOutModal(false)}
                                        className="flex-1 px-8 py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                                    >
                                        Nanti Saja
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={clockOutProcessing || clockOutData.work_report.length < 20}
                                        className="flex-[2] px-8 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {clockOutProcessing ? 'Memproses Keluar...' : 'Selesaikan Pekerjaan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}