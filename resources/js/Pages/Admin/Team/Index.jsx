import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminTeam({ teamMembers, attendanceChart, statusDistribution, pendingLeaves }) {
    const statusStyles = {
        hadir: { text: 'Hadir', color: 'bg-emerald-100 text-emerald-700' },
        izin: { text: 'Izin', color: 'bg-amber-100 text-amber-700' },
        alpha: { text: 'Alpha', color: 'bg-slate-100 text-slate-500' },
    };

    const handleApprove = (leaveId) => {
        // We'll point to a general leaf approval or specific admin approval route
        router.post(route('supervisor.leaves.approve', leaveId));
    };

    const handleReject = (leaveId) => {
        router.post(route('supervisor.leaves.reject', leaveId));
    };

    return (
        <AuthenticatedLayout header="Monitor Tim Supervisor">
            <Head title="Monitor Tim" />

            <div className="max-w-7xl mx-auto space-y-8 animate-slide-up pb-12 px-4 sm:px-6 lg:px-8">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Performa Para Supervisor</h2>
                        <p className="text-slate-500 mt-2 font-medium text-lg">Pantau kehadiran dan pengajuan izin seluruh Supervisor dalam satu dashboard.</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart - 7 Day Attendance */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30">
                        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">📊</span>
                            Absensi 7 Hari Terakhir
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceChart} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #f1f5f9',
                                            borderRadius: '20px',
                                            boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                                            padding: '12px 16px'
                                        }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '20px' }} />
                                    <Bar dataKey="hadir" name="Hadir" fill="#10b981" radius={[6, 6, 0, 0]} barSize={15} />
                                    <Bar dataKey="izin" name="Izin" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={15} />
                                    <Bar dataKey="alpha" name="Alpha" fill="#94a3b8" radius={[6, 6, 0, 0]} barSize={15} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Donut Chart - Monthly Distribution */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30">
                        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">🍩</span>
                            Distribusi Bulan Ini
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
                                        cx="50%"
                                        cy="55%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                        stroke="none"
                                    >
                                        {statusDistribution?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: 'none',
                                            borderRadius: '20px',
                                            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Legend */}
                        <div className="flex flex-wrap justify-center gap-6 mt-2">
                            {statusDistribution?.map((item) => (
                                <div key={item.name} className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.name}: <span className="text-slate-900">{item.value}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Team Members List */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">👥</span>
                                Daftar Supervisor
                            </h3>
                            <span className="px-5 py-2 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest">{teamMembers?.length || 0} Anggota</span>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            {teamMembers?.map((member) => (
                                <div key={member.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 font-black text-lg shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                                            {member.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-slate-900 tracking-tight">{member.name}</p>
                                            <p className="text-xs text-slate-400 font-bold tracking-wide">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="hidden sm:inline-block text-[10px] font-black text-slate-300 uppercase tracking-widest">Status Hari Ini</span>
                                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl ${statusStyles[member.today_status]?.color}`}>
                                            {statusStyles[member.today_status]?.text}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!teamMembers || teamMembers.length === 0) && (
                                <div className="py-16 text-center opacity-30 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-3xl mb-3">🔭</p>
                                    <p className="text-sm font-black uppercase tracking-widest">Belum ada supervisor terdaftar</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
