import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

export default function AttendanceHistory({ attendances }) {
    const statusLabels = {
        hadir: { text: 'Hadir', color: 'bg-accent-100 text-accent-700' },
        hampir_terlambat: { text: 'Hampir Terlambat', color: 'bg-amber-100 text-amber-700' },
        terlambat: { text: 'Terlambat', color: 'bg-red-100 text-red-700' },
    };

    return (
        <AuthenticatedLayout header="Riwayat Absensi">
            <Head title="Riwayat Absensi" />

            <div className="max-w-4xl mx-auto animate-slide-up">
                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-dark-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-dark-900">📋 Riwayat Absensi</h2>
                            <Link href={route('attendance.index')} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                                ← Kembali ke Absensi
                            </Link>
                        </div>
                    </div>

                    {attendances.data?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-dark-50/50 border-b border-dark-100">
                                        <th className="text-left py-3 px-6 font-semibold text-dark-600">Tanggal</th>
                                        <th className="text-left py-3 px-6 font-semibold text-dark-600">Jam Masuk</th>
                                        <th className="text-left py-3 px-6 font-semibold text-dark-600">Status</th>
                                        <th className="text-left py-3 px-6 font-semibold text-dark-600">Koordinat</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances.data.map((att, index) => (
                                        <tr key={att.id} className="border-b border-dark-50 hover:bg-primary-50/30 transition-colors" style={{ animationDelay: `${index * 50}ms` }}>
                                            <td className="py-3 px-6 text-dark-700 font-medium">
                                                {new Date(att.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="py-3 px-6 text-dark-700 font-mono">{att.clock_in_time}</td>
                                            <td className="py-3 px-6">
                                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusLabels[att.status]?.color}`}>
                                                    {statusLabels[att.status]?.text}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-dark-400 text-xs font-mono">
                                                {att.lat_in}, {att.long_in}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-dark-400">
                            <span className="text-4xl block mb-2">📋</span>
                            <p>Belum ada riwayat absensi</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {attendances.links && attendances.links.length > 3 && (
                        <div className="p-4 border-t border-dark-100 flex justify-center gap-1">
                            {attendances.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                        link.active
                                            ? 'bg-primary-600 text-white'
                                            : link.url
                                            ? 'text-dark-600 hover:bg-dark-100'
                                            : 'text-dark-300 cursor-default'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
