import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function SupervisorTeam({ teamMembers, attendanceChart, statusDistribution }) {
    const { notifications } = usePage().props;
    const pendingCount = notifications?.pendingLeavesCount || 0;

    const statusStyles = {
        hadir: { text: 'Hadir', color: 'bg-emerald-100 text-emerald-700' },
        izin: { text: 'Izin', color: 'bg-amber-100 text-amber-700' },
        alpha: { text: 'Alpha', color: 'bg-slate-100 text-slate-700' },
    };

    return (
        <AuthenticatedLayout header="Dashboard Tim">
            <Head title="Dashboard Tim" />

            <div className="space-y-6 animate-slide-up">
                {/* Pending Leaves Alert Banner */}
                {pendingCount > 0 && (
                    <Link
                        href={route('supervisor.leaves.index')}
                        className="block bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center animate-pulse">
                                    <span className="text-xl">📝</span>
                                </div>
                                <div>
                                    <p className="font-bold text-amber-900">
                                        {pendingCount} pengajuan izin menunggu persetujuan
                                    </p>
                                    <p className="text-sm text-amber-600">Klik untuk meninjau dan memproses</p>
                                </div>
                            </div>
                            <svg className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </Link>
                )}

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
                                    <Bar dataKey="izin" name="Izin" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="alpha" name="Alpha" fill="#94a3b8" radius={[4, 4, 0, 0]} />
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
                    <div className="flex flex-col gap-3">
                        {teamMembers?.map((member) => (
                            <div key={member.id} className="bg-white rounded-xl border border-dark-100 p-4 hover:shadow-md transition-all duration-200 flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                                        {member.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-dark-900 leading-tight">{member.name}</p>
                                        <p className="text-xs text-dark-400 mt-0.5 leading-tight">{member.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="hidden sm:inline-block text-[10px] font-bold text-dark-400 uppercase tracking-wider">Status Hari Ini</span>
                                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[member.today_status]?.color}`}>
                                        {statusStyles[member.today_status]?.text}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {(!teamMembers || teamMembers.length === 0) && (
                            <div className="w-full text-center py-12 bg-dark-50/30 rounded-xl border border-dashed border-dark-100">
                                <p className="text-3xl mb-3">👥</p>
                                <p className="text-sm font-semibold text-dark-400 uppercase tracking-widest">Belum ada anggota tim</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
