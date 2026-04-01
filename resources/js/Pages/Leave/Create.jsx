import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function LeaveCreate() {
    const { data, setData, post, processing, errors } = useForm({
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
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-dark-900">📝 Form Pengajuan Izin</h2>
                        <Link href={route('leaves.index')} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            ← Kembali
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <button type="submit" disabled={processing} className="btn-primary flex-1">
                                {processing ? '⏳ Mengirim...' : '📤 Kirim Pengajuan'}
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
