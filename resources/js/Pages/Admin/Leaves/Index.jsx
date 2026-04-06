import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function AdminLeaves({ pendingLeaves, processedLeaves }) {
    const handleApprove = (leaveId) => {
        router.post(route('supervisor.leaves.approve', leaveId));
    };

    const handleReject = (leaveId) => {
        router.post(route('supervisor.leaves.reject', leaveId));
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            approved: 'bg-emerald-100 text-emerald-700',
            rejected: 'bg-rose-100 text-rose-700',
            pending: 'bg-amber-100 text-amber-700',
        };
        return (
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout header="Persetujuan Izin Supervisor">
            <Head title="Persetujuan Izin" />

            <div className="max-w-7xl mx-auto space-y-8 animate-slide-up pb-12 px-4 sm:px-6 lg:px-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Manajemen Izin Supervisor</h2>
                    <p className="text-slate-500 mt-2 font-medium text-lg">Kelola dan tinjau seluruh pengajuan izin dari para Supervisor di semua cabang.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pending Requests */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <span className="w-10 h-10 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                </span>
                                Menunggu Persetujuan
                            </h3>
                            <span className="px-4 py-1.5 bg-amber-100 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                {pendingLeaves?.length || 0} Pengajuan
                            </span>
                        </div>

                        {pendingLeaves?.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {pendingLeaves.map((leave) => (
                                    <div key={leave.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden group relative">
                                        {/* Decorative background flare */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-[1.5rem] flex items-center justify-center text-slate-700 font-black text-2xl shadow-inner border border-white">
                                                        {leave.user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2">{leave.user?.name}</h4>
                                                        <p className="text-slate-400 font-bold text-sm">{leave.user?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Durasi</p>
                                                        <p className="text-sm font-black text-slate-900 uppercase">
                                                            {new Date(leave.start_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})} — {new Date(leave.end_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                                                        </p>
                                                    </div>
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-3xl border border-slate-100 mb-8">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Keperluan / Alasan</p>
                                                <p className="text-slate-700 font-medium italic leading-relaxed">"{leave.reason}"</p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <button 
                                                    onClick={() => handleApprove(leave.id)}
                                                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 hover:-translate-y-0.5 transition-all active:scale-95"
                                                >
                                                    Setujui Izin
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(leave.id)}
                                                    className="flex-1 py-4 bg-white border border-rose-100 text-rose-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white hover:-translate-y-0.5 transition-all active:scale-95 shadow-sm"
                                                >
                                                    Tolak Pengajuan
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}                            </div>
                        ) : (
                            <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                                <div className="opacity-40 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-6">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                    </div>
                                    <p className="text-lg font-black uppercase tracking-widest text-slate-900">Semua Terproses</p>
                                    <p className="text-slate-500 font-medium mt-2">Seluruh pengajuan izin supervisor telah ditinjau.</p>
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
                                Riwayat Terakhir
                            </h3>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30">
                            <div className="space-y-6">
                                {processedLeaves?.length > 0 ? processedLeaves.map((leave) => (
                                    <div key={leave.id} className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                            {leave.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-slate-900 truncate tracking-tight">{leave.user?.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 italic">
                                                {new Date(leave.updated_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                        <StatusBadge status={leave.status} />
                                    </div>
                                )) : (
                                    <div className="py-10 text-center opacity-20 italic font-bold text-sm tracking-widest">
                                        Belum ada riwayat.
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
