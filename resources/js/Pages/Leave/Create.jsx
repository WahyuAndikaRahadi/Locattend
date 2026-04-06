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
        <AuthenticatedLayout header="Ajukan Izin / Cuti">
            <Head title="Ajukan Izin" />

            <div className="max-w-2xl mx-auto animate-slide-up">
                <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            </div>
                            Form Pengajuan
                        </h2>
                        <Link href={route('leaves.index')} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            ← Kembali
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex gap-4 p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="leave_type" 
                                    value="izin" 
                                    checked={data.leave_type === 'izin'} 
                                    onChange={(e) => setData('leave_type', e.target.value)}
                                    className="w-5 h-5 text-amber-600 focus:ring-amber-500 border-slate-300"
                                />
                                <span className={`text-sm font-black uppercase tracking-widest ${data.leave_type === 'izin' ? 'text-amber-700' : 'text-slate-400 group-hover:text-slate-600'}`}>Izin</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="leave_type" 
                                    value="cuti" 
                                    checked={data.leave_type === 'cuti'} 
                                    onChange={(e) => setData('leave_type', e.target.value)}
                                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                                />
                                <span className={`text-sm font-black uppercase tracking-widest ${data.leave_type === 'cuti' ? 'text-indigo-700' : 'text-slate-400 group-hover:text-slate-600'}`}>Cuti</span>
                            </label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-dark-700 mb-2">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="input-field"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-dark-700 mb-2">Tanggal Selesai</label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="input-field"
                                    min={data.start_date || new Date().toISOString().split('T')[0]}
                                />
                                {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-dark-700 mb-2">Alasan</label>
                            <textarea
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                rows={4}
                                className="input-field resize-none"
                                placeholder="Jelaskan alasan izin/cuti Anda..."
                                maxLength={500}
                            />
                            <p className="text-xs text-dark-400 mt-1">{data.reason.length}/500 karakter</p>
                            {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" disabled={processing} className="btn-primary flex-1 flex items-center justify-center gap-2">
                                {processing ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                )}
                                {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                            </button>
                            <Link href={route('leaves.index')} className="btn-secondary">
                                Batal
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
