import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AttendanceHistory({ attendances }) {
    const formatDuration = (minutes) => {
        if (!minutes) return '—';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}j ${m > 0 ? `${m}m` : ''}`.trim();
    };

    // Calculate simple stats from current page
    const stats = {
        total: attendances.data?.length || 0,
        present: attendances.data?.filter(a => a.status === 'hadir').length || 0,
        late: attendances.data?.filter(a => a.status === 'hadir' && a.is_late).length || 0,
        leave: attendances.data?.filter(a => a.status === 'izin').length || 0,
    };

    return (
        <AuthenticatedLayout header="Riwayat Absensi">
            <Head title="Riwayat Absensi" />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
                {/* Hero Header Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-[3.5rem] shadow-2xl shadow-blue-500/20">
                    {/* Artistic backgrounds */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-[0.05] rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 opacity-[0.08] rounded-full blur-3xl -ml-20 -mb-20"></div>
                    
                    <div className="relative z-10 p-10 sm:p-14 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                Attendance Logs
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                                Riwayat <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Presensi Saya</span>
                            </h2>
                            <p className="text-blue-100 text-lg font-medium opacity-80 max-w-lg leading-relaxed">
                                Pantau konsistensi dan durasi kerja Anda dari waktu ke waktu untuk menjaga produktivitas.
                            </p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Total', value: stats.total, color: 'bg-white/20 border-white/30 text-white' },
                                { label: 'Hadir', value: stats.present, color: 'bg-emerald-500/30 border-emerald-400/40 text-emerald-100' },
                                { label: 'Terlambat', value: stats.late, color: 'bg-rose-500/30 border-rose-400/40 text-rose-100' },
                                { label: 'Izin', value: stats.leave, color: 'bg-amber-500/30 border-amber-400/40 text-amber-100' },
                            ].map((stat, i) => (
                                <div key={i} className={`${stat.color} backdrop-blur-xl p-6 rounded-3xl border flex flex-col items-center justify-center min-w-[100px] sm:min-w-[120px] shadow-lg shadow-black/10 transition-transform hover:scale-105`}>
                                    <h4 className="text-3xl font-black mb-1 tracking-tighter">{stat.value}</h4>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-slide-up">
                    <div className="p-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Kehadiran</h3>
                            <p className="text-slate-500 font-medium text-sm mt-1">Data riwayat tersusun berdasarkan tanggal terbaru.</p>
                        </div>
                    </div>

                    {attendances.data?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50">
                                        <th className="text-left px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hari & Tanggal</th>
                                        <th className="text-center px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                        <th className="text-center px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Check-In</th>
                                        <th className="text-center px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Check-Out</th>
                                        <th className="text-center px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Durasi Kerja</th>
                                        <th className="text-left px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {attendances.data.map((att) => {
                                        const isPresent = att.status === 'hadir';
                                        return (
                                            <tr key={att.id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white transition-all duration-500">
                                                            <span className="text-[10px] font-black uppercase tracking-tighter opacity-60 leading-none">
                                                                {new Date(att.date).toLocaleDateString('id-ID', { month: 'short' })}
                                                            </span>
                                                            <span className="text-lg font-black leading-none mt-1">
                                                                {new Date(att.date).toLocaleDateString('id-ID', { day: 'numeric' })}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900 leading-tight tracking-tight">
                                                                {new Date(att.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                                {new Date(att.date).toLocaleDateString('id-ID', { year: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-8 text-center">
                                                    {att.status === 'hadir' && !att.is_late && <span className="inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">Hadir</span>}
                                                    {att.status === 'hadir' && att.is_late && <span className="inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">Terlambat</span>}
                                                    {att.status === 'izin' && <span className="inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">Izin</span>}
                                                    {att.status === 'alpha' && <span className="inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100">Alpha</span>}
                                                    {att.status === 'libur' && <span className="inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-100">Libur</span>}
                                                </td>
                                                <td className="px-6 py-8 text-center">
                                                    {isPresent ? <span className="text-sm font-black text-slate-700 font-mono tracking-tighter">{att.clock_in_time ? att.clock_in_time.substring(0, 5) : "—"}</span> : <span className="text-xs text-slate-300">—</span>}
                                                </td>
                                                <td className="px-6 py-8 text-center">
                                                    {isPresent ? <span className="text-sm font-black text-slate-700 font-mono tracking-tighter">{att.clock_out_time ? att.clock_out_time.substring(0, 5) : "—"}</span> : <span className="text-xs text-slate-300">—</span>}
                                                </td>
                                                <td className="px-6 py-8 text-center">
                                                    {isPresent && att.duration_minutes ? (
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-slate-600 font-black text-[10px] tracking-tight">
                                                            <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                            {formatDuration(att.duration_minutes)}
                                                        </div>
                                                    ) : <span className="text-xs text-slate-300">—</span>}
                                                </td>
                                                <td className="px-6 py-8 max-w-[250px]">
                                                    {att.status === 'hadir' && att.is_late && (
                                                        <div className="flex items-center gap-2 text-rose-500">
                                                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                            <span className="text-xs font-bold italic tracking-tight">Terlambat {att.late_minutes}m</span>
                                                        </div>
                                                    )}
                                                    {att.status === 'izin' && <p className="text-xs text-slate-500 font-medium leading-relaxed truncate group-hover:text-slate-900 transition-colors" title={att.leave_reason}>"{att.leave_reason || "—"}"</p>}
                                                    {att.status === 'hadir' && !att.is_late && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-200">Excellent</span>}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-32 text-slate-400 flex flex-col items-center">
                            <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mb-8 border-4 border-white shadow-inner">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            </div>
                            <p className="font-black uppercase tracking-[0.3em] text-sm text-slate-300 italic">Belum ada riwayat absensi terdaftar</p>
                        </div>
                    )}

                    {/* Modern Pagination */}
                    {attendances.links && attendances.links.length > 3 && (
                        <div className="p-10 border-t border-slate-50 flex justify-center gap-3">
                            {attendances.links.map((link, i) => {
                                let label = link.label;
                                if (label.includes('Previous')) label = '← Prev';
                                if (label.includes('Next')) label = 'Next →';
                                
                                return (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            link.active
                                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 ring-4 ring-blue-600/10'
                                                : link.url
                                                ? 'bg-slate-50 text-slate-500 hover:bg-white hover:text-blue-600 border border-slate-100 hover:shadow-lg'
                                                : 'text-slate-300 cursor-not-allowed opacity-50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: label }}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
