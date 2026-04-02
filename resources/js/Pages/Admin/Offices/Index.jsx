import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

const OfficeStat = ({ label, value, icon, color }) => (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white shadow-xl shadow-slate-200/20 flex items-center justify-between group overflow-hidden relative transition-all hover:shadow-2xl hover:-translate-y-1">
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700`}></div>
        <div className="relative z-10 text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-900 leading-none tracking-tighter">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-3xl flex items-center justify-center text-white shadow-lg ${color} relative z-10 transition-transform group-hover:rotate-6`}>
            {icon}
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

    return (
        <AuthenticatedLayout header="Manajemen Cabang">
            <Head title="Manajemen Cabang" />

            <div className="max-w-7xl mx-auto space-y-10 animate-slide-up pb-20 px-4">
                {/* Visual Action Header & Search */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pt-4">
                    <div className="text-left">
                        <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Lokasi Cabang</h2>
                        <p className="text-slate-500 mt-4 text-lg font-medium max-w-2xl">Visualisasi titik operasional dan pengaturan geofencing absensi berbasis lokasi.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                        <form onSubmit={handleSearch} className="relative flex-1 sm:w-80 group">
                            <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-slate-400 transition-colors group-focus-within:text-blue-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama kantor..."
                                className="w-full pl-14 pr-4 py-5 bg-white border-none rounded-[1.75rem] text-slate-900 shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-blue-100 transition-all font-bold placeholder-slate-300"
                            />
                        </form>
                        <Link 
                            href={route('admin.offices.create')} 
                            className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.75rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                            Daftarkan Cabang
                        </Link>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <OfficeStat 
                        label="Total Kantor" 
                        value={stats.total} 
                        color="bg-gradient-to-br from-blue-600 to-blue-500" 
                        icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>}
                    />
                    <OfficeStat 
                        label="Total Anggota" 
                        value={offices.data?.reduce((acc, o) => acc + (o.users_count || 0), 0) || 0} 
                        color="bg-gradient-to-br from-indigo-600 to-indigo-500" 
                        icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>}
                    />
                    <OfficeStat 
                        label="Radius Rata-rata" 
                        value={`${stats.avg_radius}m`} 
                        color="bg-gradient-to-br from-emerald-600 to-emerald-500" 
                        icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 20l-5.447-2.724A2 2 0 013 15.487V4.513a2 2 0 011.106-1.789L9 0m0 20l5.553-2.776A2 2 0 0016 15.438V4.562a2 2 0 00-1.106-1.79L9 0m0 20V0"/></svg>}
                    />
                </div>

                {/* Offices Grid */}
                {offices.data?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {offices.data.map((office) => (
                            <div key={office.id} className="group bg-white rounded-[3.5rem] border border-white shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full text-left">
                                 {/* Card Header */}
                                <div className="h-44 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_2px,transparent_2px)] [background-size:24px_24px]"></div>
                                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600 opacity-5 rounded-full blur-3xl"></div>
                                    
                                    <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center text-blue-600 shadow-2xl border border-white group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 relative z-10">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    </div>
                                    <span className="absolute top-6 right-6 px-5 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform overflow-hidden">
                                        <span className="relative z-10">{office.users_count} Anggota</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700"></div>
                                    </span>
                                </div>
                                
                                <div className="p-10 flex flex-col flex-1 relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
                                    
                                    <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter leading-tight break-words relative z-10 group-hover:text-blue-600 transition-colors uppercase">{office.name}</h3>
                                    
                                    <div className="space-y-4 flex-1 relative z-10">
                                        <div className="flex items-center gap-5 p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm group-hover:border-blue-100 group-hover:shadow-md transition-all">
                                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">GPS Koordinat</p>
                                                <p className="text-sm font-black text-slate-800 tabular-nums">{office.latitude}, {office.longitude}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-5 p-5 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/30 shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1.5">Geofence Radius</p>
                                                <p className="text-lg font-black text-indigo-600 tabular-nums">{office.radius_meters} <span className="text-[10px] uppercase font-bold text-indigo-400 ml-1">Meter</span></p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-slate-50 relative z-10">
                                        <div className="flex gap-4">
                                            <Link 
                                                href={route('admin.offices.edit', office.id)} 
                                                className="flex-1 py-5 bg-slate-100 text-slate-900 rounded-3xl text-center font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 border border-slate-200"
                                            >
                                                Ubah Konfigurasi
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(office.id, office.name)}
                                                className="w-16 h-16 bg-white border border-rose-100 text-rose-500 rounded-3xl flex items-center justify-center hover:text-white transition-all shadow-sm active:scale-95 group/del px-4"
                                            >
                                                <svg className="w-7 h-7 group-hover/del:scale-110 transition-transform text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                            </button>
                                        </div>
                                        
                                        <a 
                                            href={`https://www.google.com/maps?q=${office.latitude},${office.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-5 bg-blue-600 text-white rounded-3xl text-center font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                            Lihat di Google Maps
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-24 text-center rounded-[4rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                        <div className="w-24 h-24 bg-slate-50 flex items-center justify-center rounded-[2.5rem] text-slate-200 mx-auto mb-8">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                        </div>
                        <p className="text-3xl font-black text-slate-900 mb-2">Lokasi Tidak Ditemukan</p>
                        <p className="text-slate-400 font-bold mb-10">Coba gunakan kata kunci pencarian yang berbeda.</p>
                        <button onClick={() => setSearch('')} className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl">Reset Pencarian</button>
                    </div>
                )}

                {/* Pagination */}
                {offices.links && offices.links.length > 3 && (
                    <div className="flex justify-center gap-3 pt-10">
                        {offices.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`h-14 min-w-[3.5rem] px-5 flex items-center justify-center rounded-3xl text-[10px] font-black transition-all ${
                                    link.active 
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 translate-y-[-2px]' 
                                    : link.url 
                                        ? 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 shadow-sm' 
                                        : 'text-slate-200 pointer-events-none opacity-50'
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
