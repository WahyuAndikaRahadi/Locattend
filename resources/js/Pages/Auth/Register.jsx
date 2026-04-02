import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 font-sans selection:bg-primary-500 selection:text-white">
            <Head title="Buat Akun" />

            {/* Left Section: Branding & Visuals (Same as Login for consistency) */}
            <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/10 blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-400/20 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                <div className="relative z-10 max-w-lg text-white text-center">
                    <div className="flex flex-col items-center gap-6 mb-12">
                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary-900/40 transform -rotate-6">
                            <span className="text-primary-700 font-black text-5xl">L</span>
                        </div>
                        <div>
                            <h1 className="text-5xl font-black tracking-tighter">Locattend</h1>
                            <p className="text-primary-100 font-medium text-lg mt-2 font-mono tracking-widest uppercase">Intelijen GeoTrack</p>
                        </div>
                    </div>
                    
                    <h2 className="text-4xl font-extrabold leading-tight mb-8">
                        Bergabunglah dengan ribuan perusahaan yang menggunakan Locattend hari ini.
                    </h2>
                </div>
            </div>

            {/* Right Section: Register Form */}
            <div className="flex-1 md:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 md:p-16 lg:p-20 bg-white">
                <div className="w-full max-w-sm">
                    {/* Mobile Logo Only */}
                    <div className="md:hidden flex flex-col items-center mb-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 mb-4">
                            <span className="text-white font-bold text-2xl">L</span>
                        </div>
                        <h1 className="text-2xl font-bold text-dark-900 tracking-tight">Locattend</h1>
                    </div>

                    <div className="text-left mb-8">
                        <h2 className="text-3xl font-extrabold text-dark-900 tracking-tight">Akun Baru</h2>
                        <p className="text-dark-500 mt-2">Isi informasi Anda untuk memulai.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-dark-600 uppercase tracking-wider mb-2 ml-1" htmlFor="name">
                                Nama Lengkap
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={data.name}
                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.name ? 'border-red-300 ring-red-100' : 'border-slate-200 ring-slate-100'} rounded-2xl text-dark-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium`}
                                placeholder="misal: Alexander Graham"
                                autoComplete="name"
                                autoFocus
                                required
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500 font-semibold ml-1">❌ {errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-dark-600 uppercase tracking-wider mb-2 ml-1" htmlFor="email">
                                Alamat Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.email ? 'border-red-300 ring-red-100' : 'border-slate-200 ring-slate-100'} rounded-2xl text-dark-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium`}
                                placeholder="nama@perusahaan.com"
                                autoComplete="username"
                                required
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500 font-semibold ml-1">❌ {errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-dark-600 uppercase tracking-wider mb-2 ml-1" htmlFor="password">
                                Kata Sandi
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.password ? 'border-red-300 ring-red-100' : 'border-slate-200 ring-slate-100'} rounded-2xl text-dark-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium`}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500 font-semibold ml-1">❌ {errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-dark-600 uppercase tracking-wider mb-2 ml-1" htmlFor="password_confirmation">
                                Konfirmasi Kata Sandi
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className={`w-full px-5 py-4 bg-slate-50 border ${errors.password_confirmation ? 'border-red-300 ring-red-100' : 'border-slate-200 ring-slate-100'} rounded-2xl text-dark-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium`}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                required
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            {errors.password_confirmation && <p className="mt-1 text-sm text-red-500 font-semibold ml-1">❌ {errors.password_confirmation}</p>}
                        </div>

                        <div className="pt-4">
                            <button 
                                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/25 transform transition-all active:scale-[0.98] disabled:opacity-50 text-lg" 
                                disabled={processing}
                            >
                                {processing ? 'Membuat Akun...' : 'Lanjutkan'}
                            </button>
                        </div>

                        <div className="text-center pt-6">
                            <p className="text-sm text-dark-500 font-medium">
                                Sudah punya akun?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-bold text-primary-600 hover:text-primary-700 transition-all underline"
                                >
                                    Masuk
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
