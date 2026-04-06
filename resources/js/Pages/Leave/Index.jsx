import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function LeaveIndex({ leaves }) {
    const statusStyles = {
        pending: { text: 'Pending', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
        approved: { text: 'Disetujui', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg> },
        rejected: { text: 'Ditolak', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg> },
    };

    return (
        <AuthenticatedLayout header="Izin / Cuti">
            <Head title="Izin / Cuti" />

            <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        Pengajuan Izin / Cuti
                    </h2>
                    <Link href={route('leaves.create')} className="btn-primary">
                        + Ajukan Baru
                    </Link>
                </div>

                {/* Leave Cards */}
                {leaves.data?.length > 0 ? (
                    <div className="space-y-4">
                        {leaves.data.map((leave) => (
                            <div key={leave.id} className="glass-card p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${statusStyles[leave.status]?.color}`}>
                                                {statusStyles[leave.status]?.icon}
                                                {statusStyles[leave.status]?.text}
                                            </span>
                                        </div>
                                        <p className="text-dark-900 font-bold mb-2">{leave.reason}</p>
                                        <div className="flex items-center gap-4">
                                            <p className="text-xs text-dark-400 font-medium flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                {new Date(leave.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                {' '} — {' '}
                                                {new Date(leave.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        {leave.approver && (
                                            <p className="text-xs text-dark-400 mt-1">
                                                Diproses oleh: {leave.approver.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-16 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-6">Belum ada riwayat pengajuan</p>
                        <Link href={route('leaves.create')} className="btn-primary">
                            + Ajukan Izin Pertama
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {leaves.links && leaves.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {leaves.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                    link.active ? 'bg-primary-600 text-white' : link.url ? 'text-dark-600 hover:bg-dark-100' : 'text-dark-300'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
