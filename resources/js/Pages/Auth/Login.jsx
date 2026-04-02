import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans selection:bg-primary-500 selection:text-white">
            <Head title="Masuk" />

            {/* Left Section: Branding & Visuals */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 relative overflow-hidden items-center justify-center p-12">
                {/* Decorative circles */}
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-400/20 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                <div className="relative z-10 max-w-lg text-white">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-900/40">
                             <span className="text-primary-700 font-black text-3xl">L</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter">Locattend</h1>
                            <p className="text-primary-100 font-medium opa-80">Sistem HR GeoTrack</p>
                        </div>
                    </div>
                    
                    <h2 className="text-5xl font-extrabold leading-tight mb-6">
                        Kelola absensi tim Anda di mana saja, kapan saja.
                    </h2>
                    <p className="text-xl text-primary-100 leading-relaxed opacity-90">
                        Pelacakan absensi berbasis lokasi yang kuat untuk bisnis modern. Cepat, aman, dan dapat diandalkan.
                    </p>
                </div>
                
                {/* Bottom decorative pattern */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Right Section: Login Form */}
            <div className="flex-1 md:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 bg-white">
                <div className="w-full max-w-sm">
                    {/* Mobile Logo Only */}
                    <div className="md:hidden flex flex-col items-center mb-12">
                         <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-4">
                             <span className="text-white font-bold text-2xl">L</span>
                        </div>
                        <h1 className="text-2xl font-bold text-dark-900 tracking-tight">Locattend</h1>
                        <p className="text-sm text-dark-400">Sistem HR GeoTrack</p>
                    </div>

                    <div className="text-left mb-10">
                        <h2 className="text-3xl font-extrabold text-dark-900 tracking-tight">Masuk</h2>
                        <p className="text-dark-500 mt-2">Masukkan kredensial Anda untuk mengakses dashboard.</p>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 rounded-xl bg-accent-50 text-accent-700 text-sm font-semibold border border-accent-100 animate-fade-in">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-dark-700 mb-2 ml-1" htmlFor="email">
                                Alamat Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.email ? 'border-red-300 ring-red-100' : 'border-slate-200 ring-slate-100'} rounded-2xl text-dark-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 font-medium`}
                                placeholder="nama@perusahaan.com"
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-500 font-semibold ml-1">❌ {errors.email}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2 ml-1">
                                <label className="text-sm font-bold text-dark-700" htmlFor="password">
                                    Kata Sandi
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                                    >
                                        Lupa Kata Sandi?
                                    </Link>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.password ? 'border-red-300 ring-red-100' : 'border-slate-200 ring-slate-100'} rounded-2xl text-dark-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all duration-300 font-medium`}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="mt-2 text-sm text-red-500 font-semibold ml-1">❌ {errors.password}</p>}
                        </div>

                        <div className="flex items-center ml-1">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500/20 transition-all cursor-pointer bg-slate-50"
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-3 text-sm font-medium text-dark-500 group-hover:text-dark-700 transition-colors">
                                    Tetap masuk
                                </span>
                            </label>
                        </div>

                        <div className="pt-2">
                            <button 
                                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/25 transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg" 
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sedang masuk...
                                    </span>
                                ) : 'Masuk'}
                            </button>
                        </div>

                        <div className="text-center pt-8 border-t border-slate-100">
                            <p className="text-sm text-dark-500 font-medium">
                                Belum punya akun?{' '}
                                <Link
                                    href={route('register')}
                                    className="font-bold text-primary-600 hover:text-primary-700 hover:underline transition-all"
                                >
                                    Buat Akun
                                </Link>
                            </p>
                        </div>
                    </form>

                    <footer className="mt-12 text-center">
                        <p className="text-xs text-slate-400 font-medium">
                            &copy; {new Date().getFullYear()} Tim Locattend. Dibuat dengan dedikasi.
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
