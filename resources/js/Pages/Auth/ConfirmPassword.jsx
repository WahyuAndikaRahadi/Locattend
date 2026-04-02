import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6 selection:bg-primary-500 selection:text-white">
            <Head title="Konfirmasi Kata Sandi" />

            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/30 mb-4 animate-bounce-slow">
                        <span className="text-white font-bold text-2xl">L</span>
                    </div>
                    <h1 className="text-3xl font-black text-dark-900 tracking-tighter">Locattend</h1>
                </div>

                <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-dark-900">Pemeriksaan Keamanan</h2>
                        <p className="text-dark-500 text-sm mt-3 leading-relaxed">
                            Ini adalah area aman aplikasi. Harap konfirmasi kata sandi Anda sebelum melanjutkan.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-dark-600 uppercase tracking-widest mb-2 ml-1" htmlFor="password">
                                Konfirmasi Kata Sandi
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.password ? 'border-red-300' : 'border-slate-200'} rounded-2xl text-dark-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium`}
                                placeholder="••••••••"
                                autoFocus
                                required
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="mt-2 text-sm text-red-500 font-semibold ml-1">❌ {errors.password}</p>}
                        </div>

                        <div className="pt-2">
                            <button 
                                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/25 transform transition-all active:scale-[0.98] disabled:opacity-50 text-base" 
                                disabled={processing}
                            >
                                {processing ? 'Memverifikasi...' : 'Konfirmasi Identitas'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
