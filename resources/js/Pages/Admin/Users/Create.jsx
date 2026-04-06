import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function AdminUsersCreate({ roles, offices, supervisors }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'karyawan',
        office_id: '',
        supervisor_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout header="Tambah Pengguna">
            <Head title="Tambah Pengguna" />

            <div className="max-w-3xl mx-auto pb-12 animate-slide-up px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Karyawan Baru</h2>
                        <p className="text-slate-500 font-medium mt-1 text-sm">Pendaftaran akses personil baru ke sistem Locattend.</p>
                    </div>
                    <Link 
                        href={route('admin.users.index')} 
                        className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm hover:border-slate-200 hover:text-slate-600 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                    </Link>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden">
                    <div className="p-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Nama Lengkap</label>
                                        <input 
                                            type="text" 
                                            value={data.name} 
                                            onChange={(e) => setData('name', e.target.value)} 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-800 placeholder-slate-300 shadow-inner" 
                                            placeholder="Masukkan Nama Lengkap" 
                                        />
                                        {errors.name && <p className="text-rose-500 text-xs font-bold mt-2 ml-1 animate-fade-in">⚠️ {errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Alamat Email</label>
                                        <input 
                                            type="email" 
                                            value={data.email} 
                                            onChange={(e) => setData('email', e.target.value)} 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-800 placeholder-slate-300 shadow-inner" 
                                            placeholder="contoh: nama@email.com" 
                                        />
                                        {errors.email && <p className="text-rose-500 text-xs font-bold mt-2 ml-1 animate-fade-in">⚠️ {errors.email}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Kata Sandi</label>
                                        <input 
                                            type="password" 
                                            value={data.password} 
                                            onChange={(e) => setData('password', e.target.value)} 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-800 placeholder-slate-300 shadow-inner" 
                                            placeholder="Min. 8 Karakter" 
                                        />
                                        {errors.password && <p className="text-rose-500 text-xs font-bold mt-2 ml-1 animate-fade-in">⚠️ {errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Konfirmasi Sandi</label>
                                        <input 
                                            type="password" 
                                            value={data.password_confirmation} 
                                            onChange={(e) => setData('password_confirmation', e.target.value)} 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-800 placeholder-slate-300 shadow-inner" 
                                            placeholder="Ulangi Kata Sandi" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-50" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Pilih Otoritas / Role</label>
                                    <select 
                                        value={data.role} 
                                        onChange={(e) => setData('role', e.target.value)} 
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-800 shadow-inner appearance-none"
                                    >
                                        {roles?.map((role) => (
                                            <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                                        ))}
                                    </select>
                                    {errors.role && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">⚠️ {errors.role}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Kantor Penempatan</label>
                                    <select 
                                        value={data.office_id} 
                                        onChange={(e) => {
                                            const newOfficeId = e.target.value;
                                            setData((prev) => ({
                                                ...prev,
                                                office_id: newOfficeId,
                                                supervisor_id: '' // reset supervisor when office changes
                                            }));
                                        }} 
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-800 shadow-inner appearance-none"
                                    >
                                        <option value="">-- Tidak Memilih Kantor --</option>
                                        {offices?.map((office) => (
                                            <option key={office.id} value={office.id}>{office.name}</option>
                                        ))}
                                    </select>
                                    {errors.office_id && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">⚠️ {errors.office_id}</p>}
                                </div>

                                {data.role === 'karyawan' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Supervisor Pendamping</label>
                                        <select 
                                            value={data.supervisor_id} 
                                            onChange={(e) => setData('supervisor_id', e.target.value)} 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-800 shadow-inner appearance-none"
                                        >
                                            <option value="">-- Pilih Supervisor (Opsional) --</option>
                                            {(data.office_id ? supervisors?.filter(sup => sup.office_id == data.office_id) : supervisors)?.map((sup) => (
                                                <option key={sup.id} value={sup.id}>{sup.name}</option>
                                            ))}
                                        </select>
                                        {errors.supervisor_id && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">⚠️ {errors.supervisor_id}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6">
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-3xl transition-all shadow-2xl shadow-primary-500/30 text-lg flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                                            Simpan Akses Pengguna
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
