import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminUsersIndex({ users, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search }, { preserveState: true });
    };

    const handleDelete = (userId, userName) => {
        if (confirm(`Yakin ingin menghapus user "${userName}"?`)) {
            router.delete(route('admin.users.destroy', userId));
        }
    };

    const roleBadge = {
        admin: 'bg-red-100 text-red-700',
        supervisor: 'bg-amber-100 text-amber-700',
        karyawan: 'bg-primary-100 text-primary-700',
    };

    return (
        <AuthenticatedLayout header="Kelola User">
            <Head title="Kelola User" />

            <div className="max-w-6xl mx-auto space-y-6 animate-slide-up">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-dark-900">👤 Manajemen User</h2>
                    <Link href={route('admin.users.create')} className="btn-primary">
                        + Tambah User
                    </Link>
                </div>

                {/* Search */}
                <div className="glass-card p-4">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama atau email..."
                            className="input-field flex-1"
                        />
                        <button type="submit" className="btn-primary">🔍 Cari</button>
                    </form>
                </div>

                {/* Table */}
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-dark-50/50 border-b border-dark-100">
                                    <th className="text-left py-3 px-6 font-semibold text-dark-600">Nama</th>
                                    <th className="text-left py-3 px-6 font-semibold text-dark-600">Email</th>
                                    <th className="text-left py-3 px-6 font-semibold text-dark-600">Role</th>
                                    <th className="text-left py-3 px-6 font-semibold text-dark-600">Kantor</th>
                                    <th className="text-left py-3 px-6 font-semibold text-dark-600">Supervisor</th>
                                    <th className="text-right py-3 px-6 font-semibold text-dark-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data?.map((user) => (
                                    <tr key={user.id} className="border-b border-dark-50 hover:bg-primary-50/30 transition-colors">
                                        <td className="py-3 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                    {user.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <span className="font-medium text-dark-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-dark-500">{user.email}</td>
                                        <td className="py-3 px-6">
                                            {user.roles?.map((r) => (
                                                <span key={r.name} className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${roleBadge[r.name] || 'bg-dark-100 text-dark-600'}`}>
                                                    {r.name}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="py-3 px-6 text-dark-500">{user.office?.name || '-'}</td>
                                        <td className="py-3 px-6 text-dark-500">{user.supervisor?.name || '-'}</td>
                                        <td className="py-3 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('admin.users.edit', user.id)} className="text-primary-600 hover:text-primary-800 text-xs font-medium px-2 py-1 rounded hover:bg-primary-50 transition-colors">
                                                    ✏️ Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                                >
                                                    🗑️ Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="p-4 border-t border-dark-100 flex justify-center gap-1">
                            {users.links.map((link, i) => (
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
            </div>
        </AuthenticatedLayout>
    );
}
