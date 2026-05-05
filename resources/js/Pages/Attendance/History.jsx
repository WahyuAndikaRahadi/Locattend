import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function AttendanceHistory({ attendances }) {
    const statusLabels = {
        hadir: { text: 'Hadir', color: 'bg-accent-100 text-accent-700' },
        hampir_terlambat: { text: 'Hampir Terlambat', color: 'bg-amber-100 text-amber-700' },
        terlambat: { text: 'Terlambat', color: 'bg-red-100 text-red-700' },
    };
    const formatDuration = (minutes) => {
        if (!minutes) return '—';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}j ${m > 0 ? `${m}m` : ''}`.trim();
    };

    return (
        <AuthenticatedLayout header="Riwayat Absensi">
            <Head title="Riwayat Absensi" />

            <div className="max-w-6xl mx-auto animate-slide-up">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                📋 Riwayat Absensi
                            </h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                Seluruh Riwayat Presensi Anda
                            </p>
                        </div>
                        <Link href={route('attendance.index')} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Kembali
                        </Link>
                    </div>

                    {attendances.data?.length > 0 ? (
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
                                    {attendances.data.map((att) => {
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
                        <div className="text-center py-20 text-slate-400 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                            </div>
                            <p className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-300">Belum ada riwayat absensi</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {attendances.links && attendances.links.length > 3 && (
                        <div className="p-6 border-t border-slate-50 flex justify-center gap-2">
                            {attendances.links.map((link, i) => {
                                // Clean up the label for Prev/Next
                                let label = link.label;
                                if (label.includes('Previous')) label = '←';
                                if (label.includes('Next')) label = '→';
                                
                                return (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                            link.active
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                : link.url
                                                ? 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                                : 'text-slate-300 cursor-not-allowed'
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
