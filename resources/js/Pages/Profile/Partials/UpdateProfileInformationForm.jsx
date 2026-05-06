import InputError from '@/Components/InputError';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Informasi Personal</h2>
                <p className="mt-2 text-slate-500 font-medium">Perbarui nama akun dan alamat email terdaftar Anda.</p>
            </header>

            <form onSubmit={submit} className="space-y-8">
                <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Nama Lengkap</label>
                    <input
                        id="name"
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-bold text-lg"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="px-2" message={errors.name} />
                </div>

                <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Alamat Email</label>
                    <input
                        id="email"
                        type="email"
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-bold text-lg"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="px-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 mt-6">
                        <p className="text-sm font-bold text-amber-800">
                            Email Anda belum terverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-2 underline text-amber-900 hover:text-amber-700 transition-colors"
                            >
                                Klik di sini untuk mengirim ulang link verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-xs font-black text-emerald-600 uppercase tracking-widest">
                                Link verifikasi baru telah dikirim ke email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                    <button 
                        disabled={processing}
                        className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                    >
                        {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        Simpan Perubahan
                    </button>

                    {recentlySuccessful && (
                        <div className="flex items-center gap-2 text-emerald-500 animate-fade-in">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Berhasil Disimpan</span>
                        </div>
                    )}
                </div>
            </form>
        </section>
    );
}
