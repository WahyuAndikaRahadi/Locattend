import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;
    const role = usePage().props.auth.role || 'karyawan';

    const roleLabel = {
        admin: 'Administrator',
        supervisor: 'Supervisor',
        karyawan: 'Karyawan',
    };

    return (
        <AuthenticatedLayout header="Pengaturan Profil">
            <Head title="Profil Saya" />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
                {/* Profile Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-[3.5rem] shadow-2xl shadow-blue-500/20">
                    {/* Artistic backgrounds */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-[0.05] rounded-full blur-3xl -mr-64 -mt-64"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 opacity-[0.08] rounded-full blur-3xl -ml-32 -mb-32"></div>
                    
                    <div className="relative z-10 p-10 sm:p-14">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            {/* Large Avatar */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-700"></div>
                                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white/20 backdrop-blur-2xl rounded-[3rem] flex items-center justify-center text-white font-black text-5xl sm:text-6xl border border-white/30 shadow-2xl relative z-10">
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </div>
                            </div>

                            <div className="text-center md:text-left space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">
                                    {roleLabel[role]}
                                </div>
                                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
                                    {user.name}
                                </h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                                    <div className="flex items-center gap-2 text-blue-100/70 font-bold">
                                        <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-100/70 font-bold">
                                        <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                        <span className="text-sm">Bergabung {new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="bg-white rounded-[3.5rem] p-10 sm:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    <div className="bg-white rounded-[3.5rem] p-10 sm:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100">
                        <UpdatePasswordForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
