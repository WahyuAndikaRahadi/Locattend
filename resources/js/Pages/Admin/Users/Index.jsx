import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const QuickStat = ({ label, value, icon, color, iconColor }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 leading-none">{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} ${iconColor} shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                {icon}
            </div>
        </div>
    </div>
);

export default function AdminUsersIndex({ users, filters, stats, offices, roles, supervisors }) {
    const [filterData, setFilterData] = useState({
        search: filters?.search || '',
        role: filters?.role || '',
        office_id: filters?.office_id || '',
        supervisor_id: filters?.supervisor_id || '',
    });

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filterData, [key]: value };
        setFilterData(newFilters);
        router.get(route('admin.users.index'), newFilters, { 
            preserveState: true,
            preserveScroll: true,
            replace: true 
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), filterData, { preserveState: true });
    };

    const handleDelete = (userId, userName) => {
        if (confirm(`Yakin ingin menghapus user "${userName}"?`)) {
            router.delete(route('admin.users.destroy', userId));
        }
    };

    const roleBadge = {
        admin: 'bg-rose-50 text-rose-600 border-rose-100',
        supervisor: 'bg-amber-50 text-amber-600 border-amber-100',
        karyawan: 'bg-blue-50 text-blue-600 border-blue-100',
    };

    return (
        <AuthenticatedLayout header="Manajemen Pengguna">
            <Head title="Manajemen Pengguna" />

            <div className="max-w-7xl mx-auto space-y-8 animate-slide-up pb-12 px-4 sm:px-6 lg:px-8">
                {/* Clean Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Daftar Pengguna</h2>
                        <p className="text-slate-500 mt-2 font-medium">Kelola hak akses dan informasi seluruh anggota tim.</p>
                    </div>
                    <Link 
                        href={route('admin.users.create')} 
                        className="btn-primary"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                        Tambah Baru
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <QuickStat 
                        label="Total Anggota" 
                        value={stats.total} 
                        color="bg-primary-600" 
                        iconColor="text-white"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>}
                    />
                    <QuickStat 
                        label="Admin" 
                        value={stats.admins} 
                        color="bg-rose-500" 
                        iconColor="text-white"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                    />
                    <QuickStat 
                        label="Supervisor" 
                        value={stats.supervisors} 
                        color="bg-amber-500" 
                        iconColor="text-white"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
                    />
                    <QuickStat 
                        label="Karyawan Aktif" 
                        value={stats.karyawan} 
                        color="bg-emerald-500" 
                        iconColor="text-white"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>}
                    />
                </div>

                {/* Advanced Filter Bar */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="flex-1 relative">
                            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-primary-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            </span>
                            <input
                                type="text"
                                value={filterData.search}
                                onChange={(e) => setFilterData({...filterData, search: e.target.value})}
                                placeholder="Cari nama karyawan atau email..."
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-medium"
                            />
                        </form>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:w-3/5">
                            {/* Role Filter */}
                            <select 
                                value={filterData.role}
                                onChange={(e) => handleFilterChange('role', e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary-100 transition-all cursor-pointer appearance-none"
                            >
                                <option value="">Semua Hak Akses</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.name}>{role.name.toUpperCase()}</option>
                                ))}
                            </select>

                            {/* Office Filter */}
                            <select 
                                value={filterData.office_id}
                                onChange={(e) => handleFilterChange('office_id', e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary-100 transition-all cursor-pointer appearance-none"
                            >
                                <option value="">Semua Lokasi</option>
                                {offices.map(office => (
                                    <option key={office.id} value={office.id}>{office.name}</option>
                                ))}
                            </select>

                            {/* Manager Filter */}
                            <select 
                                value={filterData.supervisor_id}
                                onChange={(e) => handleFilterChange('supervisor_id', e.target.value)}
                                className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-primary-100 transition-all cursor-pointer appearance-none"
                            >
                                <option value="">Semua Manager</option>
                                {supervisors.map(sup => (
                                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                                ))}
                            </select>
                        </div>

                        <button 
                            type="button" 
                            onClick={() => {
                                const reset = { search: '', role: '', office_id: '', supervisor_id: '' };
                                setFilterData(reset);
                                router.get(route('admin.users.index'), reset);
                            }} 
                            className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Modern Table List */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
                                    <th className="py-6 px-8 text-xs font-black uppercase tracking-widest text-left uppercase">Profil Pengguna</th>
                                    <th className="py-6 px-6 text-xs font-black uppercase tracking-widest text-left uppercase">Hak Akses</th>
                                    <th className="py-6 px-6 text-xs font-black uppercase tracking-widest text-left uppercase">Lokasi Kerja</th>
                                    <th className="py-6 px-6 text-xs font-black uppercase tracking-widest text-left uppercase">Manager</th>
                                    <th className="py-6 px-8 text-xs font-black uppercase tracking-widest text-right uppercase">Opsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {users.data?.length > 0 ? users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-primary-50/20 transition-colors animate-fade-in">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-primary-500 border border-primary-50 shadow-sm transition-all duration-300">
                                                    {user.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base">{user.name}</p>
                                                    <p className="text-sm text-slate-400 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 font-medium">
                                            {user.roles?.map((r) => (
                                                <span key={r.name} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border ${roleBadge[r.name] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                                    {r.name}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="py-5 px-6 font-bold text-slate-700">
                                            {user.office?.name || '-'}
                                        </td>
                                        <td className="py-5 px-6 font-bold text-slate-700">
                                            {user.supervisor?.name || <span className="text-slate-300 font-medium">None</span>}
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex justify-end gap-3 px-1">
                                                <Link 
                                                    href={route('admin.users.edit', user.id)} 
                                                    className="w-10 h-10 bg-white border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 group"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    className="w-10 h-10 bg-white border border-rose-100 rounded-xl flex items-center justify-center text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95 group"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="py-20 text-center">
                                            <div className="flex flex-col items-center opacity-30">
                                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-500">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                                </div>
                                                <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Tidak ada data ditemukan</p>
                                                <button onClick={() => {
                                                    const reset = { search: '', role: '', office_id: '', supervisor_id: '' };
                                                    setFilterData(reset);
                                                    router.get(route('admin.users.index'), reset);
                                                }} className="text-primary-600 mt-2 font-bold hover:underline">Reset filter</button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-400">Total {users.total} Pengguna</span>
                            <div className="flex gap-2">
                                {users.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`h-10 px-4 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                                            link.active 
                                            ? 'bg-primary-600 text-white shadow-xl shadow-primary-500/30' 
                                            : link.url 
                                                ? 'bg-white text-slate-600 border border-slate-200 hover:bg-primary-50 hover:text-primary-600' 
                                                : 'text-slate-200 pointer-events-none'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
