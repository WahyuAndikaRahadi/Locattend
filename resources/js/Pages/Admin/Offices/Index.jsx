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

export default function AdminOfficesIndex({ offices, stats, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.offices.index'), { search }, { preserveState: true });
    };

    const handleDelete = (officeId, officeName) => {
        if (confirm(`Yakin ingin menghapus kantor "${officeName}"?`)) {
            router.delete(route('admin.offices.destroy', officeId));
        }
    };

    const daysMap = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    return (
        <AuthenticatedLayout header="Manajemen Kantor">
            <Head title="Manajemen Kantor" />

            <div className="max-w-7xl mx-auto space-y-8 animate-slide-up pb-12 px-4 sm:px-6 lg:px-8">
                {/* Clean Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Daftar Kantor</h2>
                        <p className="text-slate-500 mt-2 font-medium">Kelola lokasi, geofence, dan jadwal operasional seluruh cabang.</p>
                    </div>
                    <Link 
                        href={route('admin.offices.create')} 
                        className="btn-primary"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                        Tambah Kantor
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <QuickStat 
                        label="Total Kantor" 
                        value={stats.total} 
                        color="bg-primary-600" 
                        iconColor="text-white"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>}
                    />
                    <QuickStat 
                        label="Total Anggota" 
                        value={offices.data?.reduce((acc, o) => acc + (o.users_count || 0), 0) || 0} 
                        color="bg-indigo-500" 
                        iconColor="text-white"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>}
                    />
                    <QuickStat 
                        label="Radius Rata-rata" 
                        value={`${stats.avg_radius}m`} 
                        color="bg-emerald-500" 
                        iconColor="text-white"
                        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 20l-5.447-2.724A2 2 0 013 15.487V4.513a2 2 0 011.106-1.789L9 0m0 20l5.553-2.776A2 2 0 0016 15.438V4.562a2 2 0 00-1.106-1.79L9 0m0 20V0"/></svg>}
                    />
                </div>

                {/* Filter & Actions Bar */}
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <form onSubmit={handleSearch} className="flex-1 relative w-full">
                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-primary-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama kantor atau lokasi..."
                            className="w-full pl-12 pr-4 py-3 bg-primary-50/50 border-none rounded-2xl text-slate-800 placeholder-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-medium"
                        />
                    </form>
                    <button type="submit" onClick={handleSearch} className="flex-1 md:flex-none px-10 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95">
                        Tampilkan
                    </button>
                </div>

                {/* Modern Table List */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
                                    <th className="py-6 px-8 text-xs font-black uppercase tracking-widest text-left">Informasi Kantor</th>
                                    <th className="py-6 px-6 text-xs font-black uppercase tracking-widest text-left">Koordinat & Radius</th>
                                    <th className="py-6 px-6 text-xs font-black uppercase tracking-widest text-left">Jadwal & Hari Kerja</th>
                                    <th className="py-6 px-6 text-xs font-black uppercase tracking-widest text-center">Anggota</th>
                                    <th className="py-6 px-8 text-xs font-black uppercase tracking-widest text-right">Opsi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {offices.data?.length > 0 ? offices.data.map((office) => (
                                    <tr key={office.id} className="hover:bg-primary-50/20 transition-colors animate-fade-in">
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-primary-500 border border-primary-50 shadow-sm transition-all duration-300">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-base uppercase">{office.name}</p>
                                                    <a 
                                                        href={`https://www.google.com/maps?q=${office.latitude},${office.longitude}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-primary-600 font-bold hover:underline flex items-center gap-1 mt-0.5"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                        Lihat di Maps
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-700">{office.latitude}, {office.longitude}</span>
                                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Radius {office.radius_meters}m</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-amber-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                    <span className="text-sm font-black italic">{office.working_hour_start} WIB</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {daysMap.map((day, idx) => {
                                                        const isActive = office.working_days?.includes(idx);
                                                        return (
                                                            <span 
                                                                key={day} 
                                                                className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                                                                    isActive 
                                                                    ? 'bg-primary-100 text-primary-700' 
                                                                    : 'text-slate-300'
                                                                }`}
                                                            >
                                                                {day}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-center">
                                            <span className="px-4 py-1.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-xl text-sm font-bold">
                                                {office.users_count} Orang
                                            </span>
                                        </td>
                                        <td className="py-5 px-8 text-right">
                                            <div className="flex justify-end gap-3 px-1">
                                                <Link 
                                                    href={route('admin.offices.edit', office.id)} 
                                                    className="w-10 h-10 bg-white border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 group"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(office.id, office.name)}
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
                                                <button onClick={() => setSearch('')} className="text-primary-600 mt-2 font-bold hover:underline">Reset pencarian</button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {offices.links && offices.links.length > 3 && (
                        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-400">Total {offices.total} Kantor</span>
                            <div className="flex gap-2">
                                {offices.links.map((link, i) => (
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
