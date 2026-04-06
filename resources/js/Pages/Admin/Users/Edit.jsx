import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function AdminUsersEdit({ user, currentRole, roles, offices, supervisors }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: currentRole || 'karyawan',
        office_id: user.office_id || '',
        supervisor_id: user.supervisor_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
        <AuthenticatedLayout header="Edit Profil Pengguna">
            <Head title={`Edit ${user.name}`} />

            <div className="max-w-3xl mx-auto pb-12 animate-slide-up px-4 sm:px-6">
                {/* Visual Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">
                            {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none mb-2">{user.name}</h2>
                            <p className="text-slate-500 font-medium text-sm">Sesuaikan otoritas dan informasi personil di sistem.</p>
                        </div>
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
                        <form onSubmit={handleSubmit} className="space-y-8 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 text-left">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Nama Lengkap</label>
                                        <input 
                                            type="text" 
                                            value={data.name} 
                                            onChange={(e) => setData('name', e.target.value)} 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 shadow-inner" 
                                        />
                                        {errors.name && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">⚠️ {errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Email Aktif</label>
                                        <input 
                                            type="email" 
                                            value={data.email} 
                                            onChange={(e) => setData('email', e.target.value)} 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 shadow-inner" 
                                        />
                                        {errors.email && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">⚠️ {errors.email}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4 text-left">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">
                                            Ubah Password <span className="text-slate-300 font-medium lowercase">(Opsional)</span>
                                        </label>
                                        <input 
                                            type="password" 
                                            value={data.password} 
                                            onChange={(e) => setData('password', e.target.value)} 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 shadow-inner" 
                                            placeholder="Isi jika ingin mengganti" 
                                        />
                                        {errors.password && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">⚠️ {errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Konfirmasi Ulang</label>
                                        <input 
                                            type="password" 
                                            value={data.password_confirmation} 
                                            onChange={(e) => setData('password_confirmation', e.target.value)} 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 shadow-inner" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-50" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Otoritas / Role</label>
                                    <select 
                                        value={data.role} 
                                        onChange={(e) => setData('role', e.target.value)} 
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.2em] bg-[right_1.25rem_center] bg-no-repeat"
                                    >
                                        {roles?.map((role) => (
                                            <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                                        ))}
                                    </select>
                                    {errors.role && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">⚠️ {errors.role}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Penempatan Kantor</label>
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
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.2em] bg-[right_1.25rem_center] bg-no-repeat"
                                    >
                                        <option value="">-- Tidak Memilih Kantor --</option>
                                        {offices?.map((office) => (
                                            <option key={office.id} value={office.id}>{office.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {data.role === 'karyawan' && (
                                    <div className="md:col-span-2">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Supervisor Pendamping</label>
                                        <select 
                                            value={data.supervisor_id} 
                                            onChange={(e) => setData('supervisor_id', e.target.value)} 
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all font-bold text-slate-800 shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.2em] bg-[right_1.25rem_center] bg-no-repeat"
                                        >
                                            <option value="">-- Pilih Supervisor (Opsional) --</option>
                                            {(data.office_id ? supervisors?.filter(sup => sup.office_id == data.office_id) : supervisors)?.map((sup) => (
                                                <option key={sup.id} value={sup.id}>{sup.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6">
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-3xl transition-all shadow-2xl shadow-blue-500/20 text-lg flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Memperbarui...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            Perbarui Data Pengguna
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
