import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SupervisorSchedule({ dailyData, monthlyData, selectedDate, selectedMonth, totalMembers }) {
    const [activeTab, setActiveTab] = useState('daily');
    const [date, setDate] = useState(selectedDate);
    const [month, setMonth] = useState(selectedMonth);
    const [filterName, setFilterName] = useState('Semua Karyawan');
    const [filterStatus, setFilterStatus] = useState('Semua Status');

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

    const formatDuration = (minutes) => {
        if (!minutes) return '—';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}j ${m > 0 ? `${m}m` : ''}`.trim();
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

    const allMembers = activeTab === 'daily' ? (dailyData || []) : (monthlyData || []);
    const uniqueMembers = Array.from(new Set(allMembers.map(m => m.name))).filter(Boolean);

    const filteredRiwayat = allMembers.filter(member => {
        const matchName = filterName === 'Semua Karyawan' || member.name === filterName;
        let matchStatus = true;
        
        if (filterStatus !== 'Semua Status' && activeTab === 'daily') {
            if (filterStatus === 'Hadir') matchStatus = member.status === 'hadir' && !member.is_late;
            else if (filterStatus === 'Terlambat') matchStatus = member.status === 'hadir' && member.is_late;
            else if (filterStatus === 'Izin') matchStatus = member.status === 'izin';
            else if (filterStatus === 'Alpha') matchStatus = member.status === 'alpha';
            else if (filterStatus === 'Libur') matchStatus = member.status === 'libur';
        }
        
        return matchName && matchStatus;
    });

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
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {activeTab === 'monthly' ? (
                            <a
                                href={route('supervisor.export-presensi', { bulan: month })}
                                className="px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all duration-300 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                Export Excel
                            </a>
                        ) : (
                            <button
                                disabled
                                title="Pilih mode Bulanan untuk export"
                                className="px-5 py-2.5 rounded-2xl text-sm font-bold shadow-sm flex items-center gap-2 bg-slate-100 text-slate-400 cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                Export Excel
                            </button>
                        )}
                        <div className="flex items-center gap-1 bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm">
                            <button
                                onClick={() => setActiveTab('daily')}
                                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 flex items-center gap-2 ${
                                    activeTab === 'daily'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                Harian
                            </button>
                            <button
                                onClick={() => setActiveTab('monthly')}
                                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 flex items-center gap-2 ${
                                    activeTab === 'monthly'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                Bulanan
                            </button>
                        </div>
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
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">{dailyStats.hadir}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hadir</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">{dailyStats.terlambat}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Terlambat</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">{dailyStats.izin}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Izin</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-slate-900">{dailyStats.alpha}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alpha</p>
                                    </div>
                                </div>
                            </div>
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



                        {/* Note */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <p className="text-sm text-blue-700 font-medium">
                                <span className="font-bold">Catatan:</span> Karyawan yang terlambat tetap dihitung sebagai <strong>Hadir</strong>. 
                                Kolom "Terlambat" menunjukkan berapa kali mereka datang melebihi jam masuk kantor.
                            </p>
                        </div>
                    </div>
                )}

                {/* ========== SECTION RIWAYAT PRESENSI ========== */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/30 overflow-hidden mt-8">
                    <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Riwayat Presensi</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">
                                {activeTab === 'daily' ? `Tanggal: ${formatDate(date)}` : `Bulan: ${formatMonthLabel(month)}`}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none pr-10 cursor-pointer relative"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                            >
                                <option value="Semua Karyawan">Semua Karyawan</option>
                                {uniqueMembers.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            {activeTab === 'daily' && (
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none pr-10 cursor-pointer relative"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                >
                                    <option value="Semua Status">Semua Status</option>
                                    <option value="Hadir">Hadir</option>
                                    <option value="Terlambat">Terlambat</option>
                                    <option value="Izin">Izin</option>
                                    <option value="Alpha">Alpha</option>
                                    <option value="Libur">Libur</option>
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Nama Karyawan</th>
                                    {activeTab === 'daily' ? (
                                        <>
                                            <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                                            <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Jam Masuk</th>
                                            <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Jam Keluar</th>
                                            <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Durasi Kerja</th>
                                            <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Tugas Dikerjakan</th>
                                            <th className="text-left px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Keterangan</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Total Hadir</th>
                                            <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Total Terlambat</th>
                                            <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Total Izin</th>
                                            <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Total Alpha</th>
                                            <th className="text-center px-4 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Total Libur</th>

                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredRiwayat.length > 0 ? (
                                    filteredRiwayat.map((member) => {
                                        if (activeTab === 'daily') {
                                            const isPresent = member.status === 'hadir';
                                            return (
                                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm font-bold text-slate-900">{member.name}</p>
                                                        <p className="text-xs text-slate-400">{member.email}</p>
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        {member.status === 'hadir' && !member.is_late && <span className="inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">Hadir</span>}
                                                        {member.status === 'hadir' && member.is_late && <span className="inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest bg-amber-100 text-amber-700">Terlambat</span>}
                                                        {member.status === 'izin' && <span className="inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest bg-sky-100 text-sky-700">Izin</span>}
                                                        {member.status === 'alpha' && <span className="inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest bg-red-100 text-red-700">Alpha</span>}
                                                        {member.status === 'libur' && <span className="inline-flex px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-100 text-slate-700">Libur</span>}
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        {isPresent ? <span className="text-sm font-bold text-slate-700 font-mono">{member.clock_in_time ? formatTime(member.clock_in_time) : "—"}</span> : <span className="text-sm text-slate-300">—</span>}
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        {isPresent ? <span className="text-sm font-bold text-slate-700 font-mono">{member.clock_out_time ? formatTime(member.clock_out_time) : "—"}</span> : <span className="text-sm text-slate-300">—</span>}
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        {isPresent && member.duration_minutes ? <span className="text-sm font-bold text-slate-700 font-mono">{formatDuration(member.duration_minutes)}</span> : <span className="text-sm text-slate-300">—</span>}
                                                    </td>
                                                    <td className="px-4 py-5 text-center">
                                                        {isPresent && member.work_report ? <p className="text-sm text-slate-600 truncate max-w-[200px] mx-auto" title={member.work_report}>{member.work_report}</p> : <span className="text-sm text-slate-300">—</span>}
                                                    </td>
                                                    <td className="px-4 py-5">
                                                        {member.status === 'hadir' && !member.is_late && <span className="text-sm text-slate-300">—</span>}
                                                        {member.status === 'hadir' && member.is_late && <span className="text-sm text-orange-500 font-medium italic">Terlambat</span>}
                                                        {member.status === 'izin' && <span className="text-sm text-slate-500 italic">"{member.leave_reason || "—"}"</span>}
                                                        {(member.status === 'alpha' || member.status === 'libur') && <span className="text-sm text-slate-300">—</span>}
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            const total = (member.hadir || 0) + (member.alpha || 0) + (member.izin || 0) + (member.libur || 0);

                                            
                                            return (
                                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm font-bold text-slate-900">{member.name}</p>
                                                        <p className="text-xs text-slate-400">{member.email}</p>
                                                    </td>
                                                    <td className="px-4 py-5 text-center"><span className="text-sm font-black text-slate-700">{member.hadir || 0}</span></td>
                                                    <td className="px-4 py-5 text-center"><span className="text-sm font-black text-slate-700">{member.terlambat || 0}</span></td>
                                                    <td className="px-4 py-5 text-center"><span className="text-sm font-black text-slate-700">{member.izin || 0}</span></td>
                                                    <td className="px-4 py-5 text-center"><span className="text-sm font-black text-slate-700">{member.alpha || 0}</span></td>
                                                    <td className="px-4 py-5 text-center"><span className="text-sm font-black text-slate-700">{member.libur || 0}</span></td>

                                                </tr>
                                            );
                                        }
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={activeTab === 'daily' ? 7 : 6} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                                    </svg>
                                                </div>
                                                <p className="font-black uppercase tracking-[0.2em] text-[10px] text-slate-300">Tidak ada data untuk filter ini</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
