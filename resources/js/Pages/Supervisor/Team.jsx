import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function SupervisorTeam({ teamMembers, attendanceChart, statusDistribution, pendingLeaves }) {
    const statusStyles = {
        hadir: { text: 'Hadir', color: 'bg-accent-100 text-accent-700' },
        hampir_terlambat: { text: 'Hampir Terlambat', color: 'bg-amber-100 text-amber-700' },
        terlambat: { text: 'Terlambat', color: 'bg-red-100 text-red-700' },
        belum_absen: { text: 'Belum Absen', color: 'bg-dark-100 text-dark-500' },
    };

    const handleApprove = (leaveId) => {
        router.post(route('supervisor.leaves.approve', leaveId));
    };

    const handleReject = (leaveId) => {
        router.post(route('supervisor.leaves.reject', leaveId));
    };

    return (
        <AuthenticatedLayout header="Dashboard Tim">
            <Head title="Dashboard Tim" />

            <div className="space-y-6 animate-slide-up">
                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart - 7 Day Attendance */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-dark-900 mb-4">📊 Absensi 7 Hari Terakhir</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceChart} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#687091' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#687091' }} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Bar dataKey="hadir" name="Hadir" fill="#10B981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="hampir_terlambat" name="Hampir Terlambat" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="terlambat" name="Terlambat" fill="#EF4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Donut Chart - Monthly Distribution */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold text-dark-900 mb-4">🍩 Distribusi Status Bulan Ini</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {statusDistribution?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: 'none',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Legend */}
                        <div className="flex justify-center gap-4 mt-2">
                            {statusDistribution?.map((item) => (
                                <div key={item.name} className="flex items-center gap-2 text-sm">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-dark-600">{item.name}: {item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Members */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-dark-900 mb-4">👥 Anggota Tim</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {teamMembers?.map((member) => (
                            <div key={member.id} className="bg-white rounded-xl border border-dark-100 p-4 hover:shadow-md transition-all duration-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {member.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-dark-900 truncate">{member.name}</p>
                                        <p className="text-xs text-dark-400 truncate">{member.email}</p>
                                    </div>
                                    <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles[member.today_status]?.color}`}>
                                        {statusStyles[member.today_status]?.text}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!teamMembers || teamMembers.length === 0) && (
                            <p className="text-dark-400 col-span-full text-center py-8">Belum ada anggota tim</p>
                        )}
                    </div>
                </div>

                {/* Pending Leave Requests */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-dark-900 mb-4">📝 Pengajuan Izin Pending</h3>
                    {pendingLeaves?.length > 0 ? (
                        <div className="space-y-4">
                            {pendingLeaves.map((leave) => (
                                <div key={leave.id} className="bg-white rounded-xl border border-dark-100 p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-dark-900">{leave.user?.name}</span>
                                                <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
                                                    ⏳ Pending
                                                </span>
                                            </div>
                                            <p className="text-sm text-dark-600 mb-1">{leave.reason}</p>
                                            <p className="text-xs text-dark-400">
                                                📅 {new Date(leave.start_date).toLocaleDateString('id-ID')} — {new Date(leave.end_date).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleApprove(leave.id)} className="btn-success text-sm">
                                                ✅ Setuju
                                            </button>
                                            <button onClick={() => handleReject(leave.id)} className="btn-danger text-sm">
                                                ❌ Tolak
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-dark-400 text-center py-8">Tidak ada pengajuan izin yang menunggu persetujuan</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
