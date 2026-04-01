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
        <AuthenticatedLayout header="Tambah User">
            <Head title="Tambah User" />

            <div className="max-w-2xl mx-auto animate-slide-up">
                <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-dark-900">👤 Tambah User Baru</h2>
                        <Link href={route('admin.users.index')} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            ← Kembali
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-dark-700 mb-2">Nama Lengkap</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="input-field" placeholder="Nama lengkap" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-dark-700 mb-2">Email</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="input-field" placeholder="email@contoh.com" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-dark-700 mb-2">Password</label>
                                <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="input-field" placeholder="Min. 8 karakter" />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-dark-700 mb-2">Konfirmasi Password</label>
                                <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="input-field" placeholder="Ulangi password" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-dark-700 mb-2">Role</label>
                            <select value={data.role} onChange={(e) => setData('role', e.target.value)} className="input-field">
                                {roles?.map((role) => (
                                    <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                                ))}
                            </select>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-dark-700 mb-2">Kantor</label>
                            <select value={data.office_id} onChange={(e) => setData('office_id', e.target.value)} className="input-field">
                                <option value="">-- Pilih Kantor --</option>
                                {offices?.map((office) => (
                                    <option key={office.id} value={office.id}>{office.name}</option>
                                ))}
                            </select>
                            {errors.office_id && <p className="text-red-500 text-xs mt-1">{errors.office_id}</p>}
                        </div>

                        {data.role === 'karyawan' && (
                            <div>
                                <label className="block text-sm font-semibold text-dark-700 mb-2">Supervisor</label>
                                <select value={data.supervisor_id} onChange={(e) => setData('supervisor_id', e.target.value)} className="input-field">
                                    <option value="">-- Pilih Supervisor --</option>
                                    {supervisors?.map((sup) => (
                                        <option key={sup.id} value={sup.id}>{sup.name}</option>
                                    ))}
                                </select>
                                {errors.supervisor_id && <p className="text-red-500 text-xs mt-1">{errors.supervisor_id}</p>}
                            </div>
                        )}

                        <button type="submit" disabled={processing} className="btn-primary w-full">
                            {processing ? '⏳ Menyimpan...' : '💾 Simpan User'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
