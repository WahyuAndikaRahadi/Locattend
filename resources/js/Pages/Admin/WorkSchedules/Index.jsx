import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function WorkSchedulesIndex({ offices }) {
    const [editingOfficeId, setEditingOfficeId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        office_id: '',
        clock_in_time: '',
        clock_out_time: '',
    });

    const handleEditClick = (office) => {
        if (office.work_schedule) {
            setData({
                office_id: office.id,
                clock_in_time: office.work_schedule.clock_in_time.substring(0, 5),
                clock_out_time: office.work_schedule.clock_out_time.substring(0, 5),
            });
        } else {
            setData({
                office_id: office.id,
                clock_in_time: '',
                clock_out_time: '',
            });
        }
        setEditingOfficeId(office.id);
        setShowForm(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.workSchedules.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
                setEditingOfficeId(null);
            },
        });
    };

    const handleCancel = () => {
        reset();
        setShowForm(false);
        setEditingOfficeId(null);
    };

    return (
        <AuthenticatedLayout header="Jadwal Kerja Kantor">
            <Head title="Jadwal Kerja Kantor" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Jadwal Kerja Kantor</h1>
                            <p className="text-slate-500 font-medium text-sm mt-1">Kelola jam masuk dan jam pulang untuk setiap kantor</p>
                        </div>
                    </div>
                </div>

                {/* Work Schedules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offices.map((office) => (
                        <div key={office.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg hover:shadow-xl transition">
                            {/* Office Header */}
                            <div className="mb-6 pb-6 border-b border-slate-100">
                                <h3 className="text-lg font-black text-slate-900 mb-2">{office.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                    <span>{office.latitude}, {office.longitude}</span>
                                </div>
                            </div>

                            {/* Schedule Display or Form */}
                            {editingOfficeId === office.id && showForm ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                                            Jam Masuk *
                                        </label>
                                        <input
                                            type="time"
                                            value={data.clock_in_time}
                                            onChange={(e) => setData({ ...data, clock_in_time: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {errors.clock_in_time && (
                                            <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.clock_in_time}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-600 mb-2">
                                            Jam Pulang *
                                        </label>
                                        <input
                                            type="time"
                                            value={data.clock_out_time}
                                            onChange={(e) => setData({ ...data, clock_out_time: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        {errors.clock_out_time && (
                                            <p className="text-xs text-rose-500 mt-1 font-semibold">{errors.clock_out_time}</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                    Simpan
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 transition"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {/* Display Schedule */}
                                    {office.work_schedule ? (
                                        <div className="space-y-4 mb-6">
                                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Jam Masuk</p>
                                                <p className="text-2xl font-black text-blue-900 font-mono">{office.work_schedule.clock_in_time.substring(0, 5)}</p>
                                            </div>
                                            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                                                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Jam Pulang</p>
                                                <p className="text-2xl font-black text-emerald-900 font-mono">{office.work_schedule.clock_out_time.substring(0, 5)}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-6 text-center">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Jadwal belum diatur</p>
                                        </div>
                                    )}

                                    {/* Edit Button */}
                                    <button
                                        onClick={() => handleEditClick(office)}
                                        className="w-full px-4 py-2.5 bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-slate-200 transition flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        Edit Jadwal
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {offices.length === 0 && (
                    <div className="bg-white rounded-[2rem] p-20 text-center border border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v6m2 0a2 2 0 012 2v6a2 2 0 01-2 2" /></svg>
                        </div>
                        <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">Belum ada kantor yang terdaftar</p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
