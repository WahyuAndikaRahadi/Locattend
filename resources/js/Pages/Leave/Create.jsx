import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function LeaveCreate() {
    const { data, setData, post, processing, errors } = useForm({
        leave_type: 'izin',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('leaves.store'));
    };

    return (
        <AuthenticatedLayout header="Pengajuan Baru">
            <Head title="Ajukan Izin" />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-[3.5rem] p-8 sm:p-14 shadow-2xl shadow-blue-500/20 group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.08] rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 opacity-[0.05] rounded-full blur-3xl -ml-20 -mb-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black text-white tracking-tight leading-none">Form Pengajuan</h1>
                            <p className="text-blue-100/80 text-lg font-medium italic">"Kesehatan dan keseimbangan kerja adalah prioritas."</p>
                        </div>
                        <Link href={route('leaves.index')} className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">
                            ← Kembali ke Riwayat
                        </Link>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-[3.5rem] p-8 sm:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Type Selector */}
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Tipe Pengajuan</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className={`relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 ${
                                    data.leave_type === 'izin' 
                                    ? 'border-amber-500 bg-amber-50 shadow-xl shadow-amber-500/10' 
                                    : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="leave_type" 
                                        value="izin" 
                                        checked={data.leave_type === 'izin'} 
                                        onChange={(e) => setData('leave_type', e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                        data.leave_type === 'izin' ? 'bg-amber-500 text-white' : 'bg-white text-slate-400'
                                    }`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    </div>
                                    <div>
                                        <p className={`font-black uppercase tracking-widest text-xs ${data.leave_type === 'izin' ? 'text-amber-700' : 'text-slate-500'}`}>Izin Darurat</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Sakit, keperluan mendesak, dll.</p>
                                    </div>
                                    {data.leave_type === 'izin' && (
                                        <div className="absolute top-4 right-4">
                                            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                        </div>
                                    )}
                                </label>

                                <label className={`relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 flex items-center gap-4 ${
                                    data.leave_type === 'cuti' 
                                    ? 'border-blue-500 bg-blue-50 shadow-xl shadow-blue-500/10' 
                                    : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
                                }`}>
                                    <input 
                                        type="radio" 
                                        name="leave_type" 
                                        value="cuti" 
                                        checked={data.leave_type === 'cuti'} 
                                        onChange={(e) => setData('leave_type', e.target.value)}
                                        className="sr-only"
                                    />
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                        data.leave_type === 'cuti' ? 'bg-blue-500 text-white' : 'bg-white text-slate-400'
                                    }`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    </div>
                                    <div>
                                        <p className={`font-black uppercase tracking-widest text-xs ${data.leave_type === 'cuti' ? 'text-blue-700' : 'text-slate-500'}`}>Cuti Tahunan</p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Liburan, istirahat panjang, dll.</p>
                                    </div>
                                    {data.leave_type === 'cuti' && (
                                        <div className="absolute top-4 right-4">
                                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Date Picker Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Tanggal Mulai</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    </div>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-bold text-sm"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                {errors.start_date && <p className="text-rose-500 text-[10px] font-black uppercase px-2">{errors.start_date}</p>}
                            </div>

                            <div className="space-y-4">
                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Tanggal Selesai</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    </div>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-bold text-sm"
                                        min={data.start_date || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                {errors.end_date && <p className="text-rose-500 text-[10px] font-black uppercase px-2">{errors.end_date}</p>}
                            </div>
                        </div>

                        {/* Reason Section */}
                        <div className="space-y-4">
                            <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Alasan Pengajuan</label>
                            <textarea
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                rows={4}
                                className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium text-lg resize-none min-h-[150px]"
                                placeholder="Jelaskan alasan detail pengajuan Anda di sini..."
                                maxLength={500}
                            />
                            <div className="flex justify-between px-4">
                                <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest">{errors.reason}</p>
                                <p className={`text-[10px] font-black uppercase tracking-widest ${data.reason.length >= 450 ? 'text-rose-500' : 'text-slate-400'}`}>
                                    {data.reason.length} / 500 Karakter
                                </p>
                            </div>
                        </div>

                        {/* Submit Section */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="flex-[2] py-6 px-10 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {processing ? (
                                    <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                )}
                                {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                            </button>
                            <Link 
                                href={route('leaves.index')} 
                                className="flex-1 py-6 px-10 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all text-center"
                            >
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
