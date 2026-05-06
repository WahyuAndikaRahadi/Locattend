import InputError from '@/Components/InputError';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } =
        useForm({
            current_password: '',
            password: '',
            password_confirmation: '',
        });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Update Password</h2>
                <p className="mt-2 text-slate-500 font-medium">Gunakan password yang unik untuk menjaga keamanan akun Anda.</p>
            </header>

            <form onSubmit={updatePassword} className="space-y-8">
                <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Password Saat Ini</label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        type="password"
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-bold text-lg"
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="px-2" />
                </div>

                <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Password Baru</label>
                    <input
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-bold text-lg"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="px-2" />
                </div>

                <div className="space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Konfirmasi Password</label>
                    <input
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        type="password"
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-bold text-lg"
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="px-2" />
                </div>

                <div className="flex items-center gap-6 pt-4">
                    <button 
                        disabled={processing}
                        className="px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                    >
                        {processing && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        Update Password
                    </button>

                    {recentlySuccessful && (
                        <div className="flex items-center gap-2 text-emerald-500 animate-fade-in">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Password Diperbarui</span>
                        </div>
                    )}
                </div>
            </form>
        </section>
    );
}
