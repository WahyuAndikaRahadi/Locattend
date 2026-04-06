import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SupervisorLeaves({ pendingLeaves, processedLeaves }) {
    const [processing, setProcessing] = useState(null);

    const handleApprove = (leaveId) => {
        setProcessing(leaveId);
        router.post(route('supervisor.leaves.approve', leaveId), {}, {
            onFinish: () => setProcessing(null),
        });
    };

    const handleReject = (leaveId) => {
        setProcessing(leaveId);
        router.post(route('supervisor.leaves.reject', leaveId), {}, {
            onFinish: () => setProcessing(null),
        });
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            approved: 'bg-emerald-100 text-emerald-700',
            rejected: 'bg-rose-100 text-rose-700',
            pending: 'bg-amber-100 text-amber-700',
        };
        const labels = {
            approved: 'Disetujui',
            rejected: 'Ditolak',
            pending: 'Menunggu',
        };
        return (
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const getDayCount = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return diff;
    };

    return (
        <AuthenticatedLayout header="Persetujuan Izin">
            <Head title="Persetujuan Izin" />

            <div className="space-y-8 animate-slide-up">
                {/* Page Header */}
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Persetujuan Izin</h2>
                    <p className="text-slate-500 mt-1 font-medium">Kelola dan tinjau pengajuan izin dari anggota tim Anda.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">{pendingLeaves?.length || 0}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menunggu</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">
                                    {processedLeaves?.filter(l => l.status === 'approved').length || 0}
                                </p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Disetujui</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900">
                                    {processedLeaves?.filter(l => l.status === 'rejected').length || 0}
                                </p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ditolak</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pending Requests */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <span className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </span>
                                Menunggu Persetujuan
                            </h3>
                            {pendingLeaves?.length > 0 && (
                                <span className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    {pendingLeaves.length} Pengajuan
                                </span>
                            )}
                        </div>

                        {pendingLeaves?.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {pendingLeaves.map((leave) => (
                                    <div key={leave.id} className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden group relative">
                                        {/* Decorative background flare */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                                        
                                        <div className="relative z-10">
                                            {/* User info & date */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-700 font-black text-xl shadow-inner border border-white">
                                                        {leave.user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">{leave.user?.name}</h4>
                                                        <p className="text-slate-400 font-semibold text-sm">{leave.user?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Durasi</p>
                                                        <p className="text-sm font-black text-slate-900">
                                                            {new Date(leave.start_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})} — {new Date(leave.end_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                                                        </p>
                                                    </div>
                                                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Duration badge */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                    {getDayCount(leave.start_date, leave.end_date)} Hari
                                                </span>
                                                <span className="inline-flex items-center px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold">
                                                    Diajukan {new Date(leave.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>

                                            {/* Reason */}
                                            <div className="bg-slate-50/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 mb-6">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Keperluan / Alasan</p>
                                                <p className="text-slate-700 font-medium italic leading-relaxed">"{leave.reason}"</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => handleApprove(leave.id)}
                                                    disabled={processing === leave.id}
                                                    className="flex-1 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {processing === leave.id ? (
                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                                    )}
                                                    {processing === leave.id ? 'Memproses' : 'Setujui Izin'}
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(leave.id)}
                                                    disabled={processing === leave.id}
                                                    className="flex-1 py-3.5 bg-white border border-rose-100 text-rose-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white hover:-translate-y-0.5 transition-all active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {processing === leave.id ? (
                                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                                                    )}
                                                    {processing === leave.id ? 'Memproses' : 'Tolak Izin'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-16 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                                <div className="opacity-40 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-6">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                    </div>
                                    <p className="text-lg font-black uppercase tracking-widest text-slate-900">Semua beres!</p>
                                    <p className="text-slate-500 font-medium mt-2">Tidak ada pengajuan izin yang menunggu persetujuan.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Processed History */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <span className="w-10 h-10 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                </span>
                                Riwayat
                            </h3>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/30">
                            <div className="space-y-4">
                                {processedLeaves?.length > 0 ? processedLeaves.map((leave) => (
                                    <div key={leave.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-sm group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                            {leave.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-900 truncate">{leave.user?.name}</p>
                                            <p className="text-[10px] font-semibold text-slate-400">
                                                {new Date(leave.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} — {new Date(leave.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <StatusBadge status={leave.status} />
                                    </div>
                                )) : (
                                    <div className="py-12 text-center opacity-30 flex flex-col items-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                        </div>
                                        <p className="italic font-black text-sm tracking-widest text-slate-500 uppercase">Belum ada riwayat</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
