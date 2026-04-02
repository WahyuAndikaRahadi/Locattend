import { Head, useForm, Link } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6 selection:bg-primary-500 selection:text-white">
            <Head title="Lupa Kata Sandi" />

            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/30 mb-4 animate-bounce-slow">
                        <span className="text-white font-bold text-2xl">L</span>
                    </div>
                    <h1 className="text-3xl font-black text-dark-900 tracking-tighter">Locattend</h1>
                </div>

                <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-dark-900">Atur Ulang Kata Sandi</h2>
                        <p className="text-dark-500 text-sm mt-3 leading-relaxed">
                            Tidak masalah. Cukup masukkan alamat email Anda dan kami akan mengirimkan tautan pemulihan untuk memilih yang baru.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 rounded-2xl bg-accent-50 text-accent-700 text-sm font-bold border border-accent-100 text-center animate-fade-in">
                            ✅ {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-dark-600 uppercase tracking-widest mb-2 ml-1" htmlFor="email">
                                Email Terdaftar
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.email ? 'border-red-300' : 'border-slate-200'} rounded-2xl text-dark-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium`}
                                placeholder="nama@perusahaan.com"
                                isFocused={true}
                                required
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-500 font-semibold ml-1">❌ {errors.email}</p>}
                        </div>

                        <div className="pt-2">
                            <button 
                                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/25 transform transition-all active:scale-[0.98] disabled:opacity-50 text-base" 
                                disabled={processing}
                            >
                                {processing ? 'Mengirim Tautan...' : 'Kirim Tautan Atur Ulang'}
                            </button>
                        </div>

                        <div className="text-center pt-4">
                            <Link
                                href={route('login')}
                                className="text-sm font-bold text-slate-400 hover:text-primary-600 transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                                </svg>
                                Kembali ke Masuk
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
