import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function LeaveIndex({ leaves }) {
    const statusStyles = {
        pending: { 
            text: 'Menunggu', 
            color: 'bg-amber-100 text-amber-700 border-amber-200', 
            dot: 'bg-amber-500',
            icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> 
        },
        approved: { 
            text: 'Disetujui', 
            color: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
            dot: 'bg-emerald-500',
            icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg> 
        },
        rejected: { 
            text: 'Ditolak', 
            color: 'bg-rose-100 text-rose-700 border-rose-200', 
            dot: 'bg-rose-500',
            icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg> 
        },
    };

    return (
        <AuthenticatedLayout header="Manajemen Izin">
            <Head title="Izin & Cuti" />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-[3.5rem] p-8 sm:p-14 shadow-2xl shadow-blue-500/20 group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.08] rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 opacity-[0.05] rounded-full blur-3xl -ml-20 -mb-20 transition-transform duration-1000 group-hover:-translate-y-10"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div className="space-y-4 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">
                                <span className="w-2 h-2 rounded-full bg-blue-300 animate-pulse"></span>
                                Leave Management
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                                Pengajuan <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Izin & Cuti</span>
                            </h1>
                            <p className="text-blue-100/80 text-lg font-medium">Kelola waktu istirahat dan keperluan mendesak Anda dengan mudah.</p>
                        </div>
                        <Link 
                            href={route('leaves.create')} 
                            className="px-10 py-5 bg-white text-blue-700 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                            Buat Pengajuan
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-4">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Riwayat Pengajuan</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">30 Hari Terakhir</span>
                        </div>
                    </div>

                    {leaves.data?.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {leaves.data.map((leave) => (
                                <div key={leave.id} className="group bg-white rounded-[3rem] p-8 sm:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 hover:border-blue-100 transition-all duration-500 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-slate-50 group-hover:bg-blue-500 transition-colors"></div>
                                    
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${statusStyles[leave.status]?.color}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[leave.status]?.dot}`}></span>
                                                {statusStyles[leave.status]?.text}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">#{leave.id}</span>
                                        </div>
                                        
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">{leave.reason}</h4>
                                            <div className="flex flex-wrap items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Durasi</p>
                                                        <p className="text-sm font-bold text-slate-700">
                                                            {new Date(leave.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                                            {' — '}
                                                            {new Date(leave.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 11h.01M7 15h.01M11 7h.01M11 11h.01M11 15h.01M15 7h.01M15 11h.01M15 15h.01"/></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tipe</p>
                                                        <p className="text-sm font-bold text-slate-700 uppercase tracking-widest">{leave.leave_type || 'Izin'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start lg:items-end gap-3 min-w-[200px]">
                                        {leave.approver ? (
                                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full lg:w-auto">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Divalidasi Oleh</p>
                                                <p className="text-xs font-bold text-slate-700">{leave.approver.name}</p>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 w-full lg:w-auto">
                                                <p className="text-[9px] font-black text-amber-600/60 uppercase tracking-widest">Menunggu Antrian</p>
                                                <p className="text-xs font-bold text-amber-700">Dalam Proses Review</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[3.5rem] p-20 text-center flex flex-col items-center gap-6 border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-inner">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-black text-slate-900 tracking-tight">Belum Ada Pengajuan</p>
                                <p className="text-slate-500 font-medium max-w-xs">Anda belum pernah melakukan pengajuan izin atau cuti sebelumnya.</p>
                            </div>
                            <Link href={route('leaves.create')} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-95">
                                Buat Izin Pertama
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {leaves.links && leaves.links.length > 3 && (
                        <div className="flex justify-center items-center gap-3 py-10">
                            {leaves.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                        link.active 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                                        : link.url 
                                            ? 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100' 
                                            : 'text-slate-300 pointer-events-none'
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
