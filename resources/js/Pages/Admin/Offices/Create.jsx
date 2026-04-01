import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function AdminOfficesCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        latitude: '',
        longitude: '',
        radius_meters: 100,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.offices.store'));
    };

    return (
        <AuthenticatedLayout header="Tambah Kantor">
            <Head title="Tambah Kantor" />

            <div className="max-w-2xl mx-auto animate-slide-up">
                <div className="glass-card p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-dark-900">🏢 Tambah Kantor Baru</h2>
                        <Link href={route('admin.offices.index')} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                            ← Kembali
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-dark-700 mb-2">Nama Kantor</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="input-field" placeholder="Kantor Pusat Jakarta" />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-dark-700 mb-2">Latitude</label>
                                <input type="number" step="0.0000001" value={data.latitude} onChange={(e) => setData('latitude', e.target.value)} className="input-field" placeholder="-6.1751000" />
                                {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-dark-700 mb-2">Longitude</label>
                                <input type="number" step="0.0000001" value={data.longitude} onChange={(e) => setData('longitude', e.target.value)} className="input-field" placeholder="106.8650000" />
                                {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-dark-700 mb-2">Radius (meter)</label>
                            <input type="number" min="10" max="10000" value={data.radius_meters} onChange={(e) => setData('radius_meters', parseInt(e.target.value))} className="input-field" />
                            <p className="text-xs text-dark-400 mt-1">Radius geofence untuk validasi absensi GPS (10-10000 meter)</p>
                            {errors.radius_meters && <p className="text-red-500 text-xs mt-1">{errors.radius_meters}</p>}
                        </div>

                        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                            <p className="text-sm text-primary-700">
                                💡 <strong>Tip:</strong> Anda bisa mendapatkan koordinat dari Google Maps. Klik kanan pada lokasi kantor, lalu salin koordinat Latitude dan Longitude.
                            </p>
                        </div>

                        <button type="submit" disabled={processing} className="btn-primary w-full">
                            {processing ? '⏳ Menyimpan...' : '💾 Simpan Kantor'}
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
