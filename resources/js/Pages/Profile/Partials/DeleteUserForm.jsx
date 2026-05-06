import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="mb-10">
                <h2 className="text-3xl font-black text-rose-600 tracking-tight">Hapus Akun</h2>
                <p className="mt-2 text-slate-500 font-medium">
                    Setelah akun Anda dihapus, semua sumber daya dan data di dalamnya akan dihapus secara permanen.
                    Harap unduh data apa pun yang ingin Anda simpan sebelum menghapus akun.
                </p>
            </header>

            <button 
                onClick={confirmUserDeletion}
                className="px-10 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-600/30 transition-all active:scale-95"
            >
                Hapus Akun Saya
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-10 sm:p-14 bg-white rounded-[3.5rem] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-rose-600"></div>
                    
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center shadow-inner shrink-0">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Konfirmasi Penghapusan</h2>
                            <p className="text-slate-500 font-medium italic mt-1 text-sm">Tindakan ini tidak dapat dibatalkan.</p>
                        </div>
                    </div>

                    <p className="text-slate-600 font-medium leading-relaxed mb-8">
                        Apakah Anda yakin ingin menghapus akun Anda? Harap masukkan password Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun Anda secara permanen.
                    </p>

                    <div className="space-y-4 mb-10">
                        <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Password Anda</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white transition-all text-slate-700 font-bold text-lg"
                            placeholder="••••••••"
                        />
                        <InputError message={errors.password} className="px-2" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 px-8 py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-[2] px-8 py-5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {processing ? 'Menghapus...' : 'Hapus Akun Sekarang'}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
