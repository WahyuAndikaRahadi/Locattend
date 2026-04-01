import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function AdminOfficesIndex({ offices }) {
    const handleDelete = (officeId, officeName) => {
        if (confirm(`Yakin ingin menghapus kantor "${officeName}"?`)) {
            router.delete(route('admin.offices.destroy', officeId));
        }
    };

    return (
        <AuthenticatedLayout header="Kelola Kantor">
            <Head title="Kelola Kantor" />

            <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-dark-900">🏢 Manajemen Kantor</h2>
                    <Link href={route('admin.offices.create')} className="btn-primary">
                        + Tambah Kantor
                    </Link>
                </div>

                {offices.data?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offices.data.map((office) => (
                            <div key={office.id} className="glass-card p-6 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                        <span className="text-2xl">🏢</span>
                                    </div>
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-700">
                                        {office.users_count} user
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-dark-900 mb-2">{office.name}</h3>
                                <div className="space-y-1 text-sm text-dark-500 mb-4">
                                    <p>📍 Lat: {office.latitude}</p>
                                    <p>📍 Lng: {office.longitude}</p>
                                    <p>📏 Radius: {office.radius_meters}m</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('admin.offices.edit', office.id)} className="flex-1 text-center text-sm py-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors font-medium">
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(office.id, office.name)}
                                        className="flex-1 text-center text-sm py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-medium"
                                    >
                                        🗑️ Hapus
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-12 text-center">
                        <span className="text-5xl block mb-3">🏢</span>
                        <p className="text-dark-500 mb-4">Belum ada data kantor</p>
                        <Link href={route('admin.offices.create')} className="btn-primary">
                            + Tambah Kantor Pertama
                        </Link>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
