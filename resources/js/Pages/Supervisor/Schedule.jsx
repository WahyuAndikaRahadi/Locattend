import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SupervisorSchedule({ dailyData, monthlyData, selectedDate, selectedMonth, totalMembers }) {
    const [activeTab, setActiveTab] = useState('daily');
    const [date, setDate] = useState(selectedDate);
    const [month, setMonth] = useState(selectedMonth);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        router.get(route('supervisor.schedule'), { date: newDate, month }, { preserveState: true, replace: true });
    };

    const handleMonthChange = (newMonth) => {
        setMonth(newMonth);
        router.get(route('supervisor.schedule'), { date, month: newMonth }, { preserveState: true, replace: true });
    };

    const goToday = () => {
        const today = new Date().toISOString().split('T')[0];
        handleDateChange(today);
    };

    const goPrevDay = () => {
        const d = new Date(date);
        d.setDate(d.getDate() - 1);
        handleDateChange(d.toISOString().split('T')[0]);
    };

    const goNextDay = () => {
        const d = new Date(date);
        d.setDate(d.getDate() + 1);
        handleDateChange(d.toISOString().split('T')[0]);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('id-ID', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '-';
        return timeStr.substring(0, 5);
    };

    const formatMonthLabel = (monthStr) => {
        const [year, month] = monthStr.split('-');
        const d = new Date(year, month - 1, 1);
        return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    };

    const isToday = date === new Date().toISOString().split('T')[0];

    // Daily stats
    const dailyStats = {
        hadir: dailyData?.filter(d => d.status === 'hadir').length || 0,
        izin: dailyData?.filter(d => d.status === 'izin').length || 0,
        alpha: dailyData?.filter(d => d.status === 'alpha').length || 0,
        terlambat: dailyData?.filter(d => d.is_late).length || 0,
    };

    // Monthly totals
    const monthlyTotals = {
        hadir: monthlyData?.reduce((sum, m) => sum + m.hadir, 0) || 0,
        izin: monthlyData?.reduce((sum, m) => sum + m.izin, 0) || 0,
        alpha: monthlyData?.reduce((sum, m) => sum + m.alpha, 0) || 0,
        terlambat: monthlyData?.reduce((sum, m) => sum + m.terlambat, 0) || 0,
    };

    const statusConfig = {
        hadir: { label: 'Hadir', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
        izin: { label: 'Izin', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
        alpha: { label: 'Alpha', color: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
    };

    return (
        <AuthenticatedLayout header="Jadwal Tim">
            <Head title="Jadwal Tim" />

            <div className="space-y-6 animate-slide-up">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Jadwal Tim</h2>
                        <p className="text-slate-500 mt-1 font-medium">Pantau kehadiran harian dan rekap bulanan anggota tim.</p>
                    </div>
                    <div className="flex items-center gap-1 bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm">
                        <button
                            onClick={() => setActiveTab('daily')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeTab === 'daily'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            📅 Harian
                        </button>
                        <button
                            onClick={() => setActiveTab('monthly')}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeTab === 'monthly'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            📊 Bulanan
                        </button>
                    </div>
                </div>

                {/* ========== DAILY VIEW ========== */}
                {activeTab === 'daily' && (
                    <div className="space-y-6">
                        {/* Date Navigation */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={goPrevDay}
                                        className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <div className="text-center min-w-[200px]">
                                        <p className="text-lg font-black text-slate-900">{formatDate(date)}</p>
                                        {isToday && (
                                            <span className="inline-flex px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                Hari Ini
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={goNextDay}
                                        className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => handleDateChange(e.target.value)}
                                        className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {!isToday && (
                                        <button
                                            onClick={goToday}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                                        >
                                            Hari Ini
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Daily Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                        <span className="text-lg">✅</span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">{dailyStats.hadir}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hadir</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                        <span className="text-lg">⏰</span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">{dailyStats.terlambat}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Terlambat</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                        <span className="text-lg">📝</span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">{dailyStats.izin}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Izin</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                        <span className="text-lg">❌</span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">{dailyStats.alpha}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alpha</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Daily Attendance Table */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/80">
                                            <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Karyawan</th>
                                            <th className="text-center px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="text-center px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Jam Masuk</th>
                                            <th className="text-left px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {dailyData?.map((member) => (
                                            <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-bold text-sm group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white transition-all">
                                                            {member.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{member.name}</p>
                                                            <p className="text-xs text-slate-400">{member.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    <span className={`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${statusConfig[member.status]?.color}`}>
                                                        {statusConfig[member.status]?.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-center">
                                                    {member.clock_in_time ? (
                                                        <div className="flex items-center justify-center gap-2">
                                                            <span className="text-sm font-black text-slate-900 font-mono">
                                                                {formatTime(member.clock_in_time)}
                                                            </span>
                                                            {member.is_late && (
                                                                <span className="inline-flex px-2 py-0.5 bg-orange-100 text-orange-600 rounded-md text-[9px] font-black uppercase tracking-wider">
                                                                    Terlambat
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-300 text-sm">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {member.leave_reason && (
                                                        <p className="text-sm text-slate-500 italic max-w-xs truncate">"{member.leave_reason}"</p>
                                                    )}
                                                    {member.status === 'alpha' && (
                                                        <p className="text-sm text-slate-400 italic">Tidak hadir, tidak ada izin</p>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {(!dailyData || dailyData.length === 0) && (
                                <div className="p-12 text-center text-slate-400">
                                    <p className="text-4xl mb-3">👥</p>
                                    <p className="font-bold">Belum ada anggota tim</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========== MONTHLY VIEW ========== */}
                {activeTab === 'monthly' && (
                    <div className="space-y-6">
                        {/* Month Selector */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            const [y, m] = month.split('-').map(Number);
                                            const prev = new Date(y, m - 2, 1);
                                            handleMonthChange(`${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`);
                                        }}
                                        className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <p className="text-lg font-black text-slate-900 min-w-[180px] text-center capitalize">
                                        {formatMonthLabel(month)}
                                    </p>
                                    <button
                                        onClick={() => {
                                            const [y, m] = month.split('-').map(Number);
                                            const next = new Date(y, m, 1);
                                            handleMonthChange(`${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`);
                                        }}
                                        className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                                <input
                                    type="month"
                                    value={month}
                                    onChange={(e) => handleMonthChange(e.target.value)}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Monthly Summary Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 shadow-lg shadow-emerald-500/20">
                                <p className="text-3xl font-black text-white">{monthlyTotals.hadir}</p>
                                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mt-1">Total Hadir</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-5 shadow-lg shadow-orange-400/20">
                                <p className="text-3xl font-black text-white">{monthlyTotals.terlambat}</p>
                                <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mt-1">Total Terlambat</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-5 shadow-lg shadow-amber-400/20">
                                <p className="text-3xl font-black text-white">{monthlyTotals.izin}</p>
                                <p className="text-amber-100 text-xs font-bold uppercase tracking-widest mt-1">Total Izin</p>
                            </div>
                            <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl p-5 shadow-lg shadow-slate-500/20">
                                <p className="text-3xl font-black text-white">{monthlyTotals.alpha}</p>
                                <p className="text-slate-200 text-xs font-bold uppercase tracking-widest mt-1">Total Alpha</p>
                            </div>
                        </div>

                        {/* Monthly Recap Table */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/80">
                                            <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Karyawan</th>
                                            <th className="text-center px-4 py-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span>✅</span>
                                                    <span>Hadir</span>
                                                </div>
                                            </th>
                                            <th className="text-center px-4 py-4 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span>⏰</span>
                                                    <span>Terlambat</span>
                                                </div>
                                            </th>
                                            <th className="text-center px-4 py-4 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span>📝</span>
                                                    <span>Izin</span>
                                                </div>
                                            </th>
                                            <th className="text-center px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span>❌</span>
                                                    <span>Alpha</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {monthlyData?.map((member) => {
                                            const total = member.hadir + member.izin + member.alpha;
                                            const hadirPercentage = total > 0 ? Math.round((member.hadir / total) * 100) : 0;

                                            return (
                                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center text-slate-600 font-bold text-sm group-hover:from-blue-500 group-hover:to-indigo-600 group-hover:text-white transition-all">
                                                                {member.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-slate-900 truncate">{member.name}</p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                                                                        <div
                                                                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                                                                            style={{ width: `${hadirPercentage}%` }}
                                                                        ></div>
                                                                    </div>
                                                                    <span className="text-[10px] font-bold text-slate-400">{hadirPercentage}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        <span className="inline-flex items-center justify-center w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl font-black text-base">
                                                            {member.hadir}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-base ${
                                                            member.terlambat > 0
                                                                ? 'bg-orange-50 text-orange-600'
                                                                : 'bg-slate-50 text-slate-300'
                                                        }`}>
                                                            {member.terlambat}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-base ${
                                                            member.izin > 0
                                                                ? 'bg-amber-50 text-amber-600'
                                                                : 'bg-slate-50 text-slate-300'
                                                        }`}>
                                                            {member.izin}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-base ${
                                                            member.alpha > 0
                                                                ? 'bg-red-50 text-red-500'
                                                                : 'bg-slate-50 text-slate-300'
                                                        }`}>
                                                            {member.alpha}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {(!monthlyData || monthlyData.length === 0) && (
                                <div className="p-12 text-center text-slate-400">
                                    <p className="text-4xl mb-3">👥</p>
                                    <p className="font-bold">Belum ada anggota tim</p>
                                </div>
                            )}
                        </div>

                        {/* Note */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                            <span className="text-blue-500 text-lg mt-0.5">💡</span>
                            <p className="text-sm text-blue-700 font-medium">
                                <span className="font-bold">Catatan:</span> Karyawan yang terlambat tetap dihitung sebagai <strong>Hadir</strong>. 
                                Kolom "Terlambat" menunjukkan berapa kali mereka datang melebihi jam masuk kantor.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
