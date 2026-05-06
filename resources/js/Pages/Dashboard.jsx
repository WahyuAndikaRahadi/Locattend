import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const AdminDashboard = ({ stats, attendanceTrends, officeStats }) => {
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
    
    return (
        <div className="space-y-12 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Total Karyawan', value: stats.total_employees, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'blue' },
                    { label: 'Hadir Hari Ini', value: stats.present_today, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'emerald' },
                    { label: 'Terlambat', value: stats.late_today, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'rose' },
                    { label: 'Izin / Cuti', value: stats.on_leave_today, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 hover:scale-105 transition-all duration-500 group">
                        <div className={`w-14 h-14 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:rotate-6 transition-transform`}>
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon}/></svg>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Tren Kehadiran</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">7 Hari Terakhir</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jumlah Hadir</span>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={attendanceTrends}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" strokeOpacity={0.5} />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800, textAnchor: 'middle'}} 
                                    dy={15} 
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} 
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '24px', 
                                        border: 'none', 
                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.12)', 
                                        padding: '20px',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '6 6' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#3b82f6" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorCount)" 
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Office Stats */}
                <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Distribusi Kantor</h3>
                    <div className="flex-1 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={officeStats}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="count"
                                >
                                    {officeStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" align="center" iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SupervisorDashboard = ({ teamStats, pendingLeaves }) => {
    return (
        <div className="space-y-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Total Anggota Tim', value: teamStats.total_members, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'indigo' },
                    { label: 'Hadir Hari Ini', value: teamStats.present_today, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'emerald' },
                    { label: 'Menunggu Review', value: pendingLeaves, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 hover:scale-105 transition-all duration-500 group">
                        <div className={`w-16 h-16 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:rotate-6 transition-transform`}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={stat.icon}/></svg>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h4>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[3.5rem] p-10 sm:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Persetujuan Pending</h3>
                        <p className="text-slate-500 font-medium mt-1 italic">Segera proses pengajuan izin anggota tim Anda.</p>
                    </div>
                    <Link href={route('supervisor.leaves.index')} className="px-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 transition-all active:scale-95">
                        Lihat Semua
                    </Link>
                </div>
                
                {pendingLeaves > 0 ? (
                    <div className="flex items-center gap-6 p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 animate-pulse">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-amber-900 tracking-tight">Ada {pendingLeaves} pengajuan menunggu</h4>
                            <p className="text-amber-700/70 font-bold uppercase text-[10px] tracking-widest">Persetujuan Supervisor Diperlukan</p>
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-3xl flex items-center justify-center border-4 border-white shadow-inner">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        </div>
                        <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-300 italic">Tidak ada antrian persetujuan</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const KaryawanDashboard = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href={route('attendance.index')} className="group bg-white p-10 sm:p-14 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 hover:border-blue-200 transition-all duration-500 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-500/10 transition-colors"></div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-inner">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <h4 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Presensi Hari Ini</h4>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium italic opacity-80">"Disiplin adalah jembatan antara tujuan dan pencapaian."</p>
                    <div className="mt-8 flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-widest">
                        Buka Halaman Presensi
                        <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                    </div>
                </div>
            </Link>

            <div className="grid grid-cols-1 gap-8">
                <Link href={route('leaves.index')} className="group bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-all duration-500 flex items-center gap-8">
                    <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Izin & Cuti</h4>
                        <p className="text-slate-500 text-sm font-medium">Ajukan atau cek status izin Anda.</p>
                    </div>
                </Link>

                <Link href={route('supervisor.employees.index')} className="group bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-all duration-500 flex items-center gap-8">
                    <div className="w-16 h-16 bg-amber-50 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <div>
                        <h4 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Monitor Tim</h4>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">Pantau aktivitas dan kehadiran tim.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default function Dashboard(props) {
    const { role } = props;
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout header={`Dashboard ${role === 'admin' ? 'Admin' : role === 'supervisor' ? 'Supervisor' : 'Karyawan'}`}>
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
                {/* Hero Welcome Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-10 sm:p-14 rounded-[3.5rem] shadow-2xl shadow-blue-500/20 group">
                    {/* Background Blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-[0.08] rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-150"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 opacity-[0.05] rounded-full blur-3xl -ml-20 -mb-20 transition-transform duration-1000 group-hover:-translate-y-10"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="max-w-2xl animate-slide-down">
                            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                                Selamat Datang Kembali, <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">{user.name}!</span>
                            </h2>
                            <p className="text-blue-100 text-lg font-medium opacity-80 leading-relaxed">
                                Aplikasi <span className="font-black text-white">Locattend</span> siap membantu Anda mengelola 
                                dan memantau kehadiran hari ini dengan presisi.
                            </p>
                        </div>
                        <div className="flex flex-col items-center sm:items-end gap-4 animate-fade-in">
                            <div className="px-8 py-6 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col items-center sm:items-end gap-1 group/date transition-all hover:bg-white/20">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    </div>
                                    <span className="text-2xl font-black text-white tracking-tighter">
                                        {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                                <span className="text-[10px] font-black text-blue-200 uppercase tracking-[0.3em]">
                                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {role === 'admin' && <AdminDashboard {...props} />}
                    {role === 'supervisor' && <SupervisorDashboard {...props} />}
                    {role === 'karyawan' && <KaryawanDashboard {...props} />}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
