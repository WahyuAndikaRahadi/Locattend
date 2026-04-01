import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function LeaveIndex({ leaves }) {
    const statusStyles = {
        pending: { text: 'Pending', color: 'bg-amber-100 text-amber-700', icon: '⏳' },
        approved: { text: 'Disetujui', color: 'bg-accent-100 text-accent-700', icon: '✅' },
        rejected: { text: 'Ditolak', color: 'bg-red-100 text-red-700', icon: '❌' },
    };

    return (
        <AuthenticatedLayout header="Izin / Cuti">
            <Head title="Izin / Cuti" />

            <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-dark-900">📝 Pengajuan Izin / Cuti</h2>
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
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[leave.status]?.color}`}>
                                                {statusStyles[leave.status]?.icon} {statusStyles[leave.status]?.text}
                                            </span>
                                        </div>
                                        <p className="text-dark-900 font-medium mb-1">{leave.reason}</p>
                                        <p className="text-sm text-dark-500">
                                            📅 {new Date(leave.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            {' '} — {' '}
                                            {new Date(leave.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
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
                    <div className="glass-card p-12 text-center">
                        <span className="text-5xl block mb-3">📝</span>
                        <p className="text-dark-500 mb-4">Belum ada pengajuan izin/cuti</p>
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
