import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';

const StatusBadge = ({ status }) => {
    const styles = {
        hadir: 'bg-accent-100 text-accent-700',
        hampir_terlambat: 'bg-amber-100 text-amber-700',
        terlambat: 'bg-red-100 text-red-700',
    };
    const labels = {
        hadir: 'Hadir',
        hampir_terlambat: 'Hampir Terlambat',
        terlambat: 'Terlambat',
    };
    return (
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-dark-100 text-dark-600'}`}>
            {labels[status] || status}
        </span>
    );
};

function KaryawanDashboard({ todayAttendance, pendingLeavesCount, office }) {
    return (
        <div className="space-y-6 animate-slide-up">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <span className="text-2xl">📍</span>
                        </div>
                        <div>
                            <p className="text-sm text-dark-500 font-medium">Status Hari Ini</p>
                            {todayAttendance ? (
                                <StatusBadge status={todayAttendance.status} />
                            ) : (
                                <p className="text-lg font-bold text-dark-900">Belum Absen</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <span className="text-2xl">🕐</span>
                        </div>
                        <div>
                            <p className="text-sm text-dark-500 font-medium">Jam Masuk</p>
                            <p className="text-lg font-bold text-dark-900">
                                {todayAttendance ? todayAttendance.clock_in_time : '--:--'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <span className="text-2xl">📝</span>
                        </div>
                        <div>
                            <p className="text-sm text-dark-500 font-medium">Izin Pending</p>
                            <p className="text-lg font-bold text-dark-900">{pendingLeavesCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-bold text-dark-900 mb-4">Aksi Cepat</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {!todayAttendance && (
                        <Link href={route('attendance.index')} className="btn-primary text-center">
                            📍 Clock In Sekarang
                        </Link>
                    )}
                    <Link href={route('leaves.create')} className="btn-secondary text-center">
                        📝 Ajukan Izin/Cuti
                    </Link>
                    <Link href={route('attendance.history')} className="btn-secondary text-center">
                        📋 Lihat Riwayat
                    </Link>
                </div>
            </div>

            {/* Office Info */}
            {office && (
                <div className="glass-card p-6">
                    <h3 className="text-lg font-bold text-dark-900 mb-2">🏢 Kantor</h3>
                    <p className="text-dark-600">{office.name}</p>
                    <p className="text-sm text-dark-400 mt-1">Radius: {office.radius_meters}m</p>
                </div>
            )}
        </div>
    );
}

function SupervisorDashboard({ todayAttendance, pendingLeavesCount, teamCount, teamPresentToday, teamPendingLeaves }) {
    return (
        <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div>
                            <p className="text-sm text-dark-500 font-medium">Total Tim</p>
                            <p className="text-2xl font-bold text-dark-900">{teamCount || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg shadow-accent-500/20">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div>
                            <p className="text-sm text-dark-500 font-medium">Hadir Hari Ini</p>
                            <p className="text-2xl font-bold text-dark-900">{teamPresentToday || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <span className="text-2xl">📝</span>
                        </div>
                        <div>
                            <p className="text-sm text-dark-500 font-medium">Izin Pending</p>
                            <p className="text-2xl font-bold text-dark-900">{teamPendingLeaves || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <span className="text-2xl">📍</span>
                        </div>
                        <div>
                            <p className="text-sm text-dark-500 font-medium">Status Saya</p>
                            {todayAttendance ? (
                                <StatusBadge status={todayAttendance.status} />
                            ) : (
                                <p className="text-sm font-bold text-dark-900">Belum Absen</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href={route('supervisor.team')} className="btn-primary text-center">
                    👥 Lihat Dashboard Tim
                </Link>
                <Link href={route('attendance.index')} className="btn-secondary text-center">
                    📍 Clock In
                </Link>
            </div>
        </div>
    );
}

function AdminDashboard({ totalUsers, totalOffices, todayTotalAttendance, totalPendingLeaves }) {
    return (
        <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <span className="text-2xl">👤</span>
                        </div>
                        <div>
                            <p className="text-sm text-dark-500 font-medium">Total User</p>
                            <p className="text-2xl font-bold text-dark-900">{totalUsers || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg shadow-accent-500/20">
                            <span className="text-2xl">🏢</span>
                        </div>
                        <div>
                            <p className="text-sm text-dark-500 font-medium">Total Kantor</p>
                            <p className="text-2xl font-bold text-dark-900">{totalOffices || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div>
                            <p className="text-sm text-dark-500 font-medium">Absensi Hari Ini</p>
                            <p className="text-2xl font-bold text-dark-900">{todayTotalAttendance || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20">
                            <span className="text-2xl">📝</span>
                        </div>
                        <div>
                            <p className="text-sm text-dark-500 font-medium">Izin Pending</p>
                            <p className="text-2xl font-bold text-dark-900">{totalPendingLeaves || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href={route('admin.users.index')} className="btn-primary text-center">
                    👤 Kelola User
                </Link>
                <Link href={route('admin.offices.index')} className="btn-secondary text-center">
                    🏢 Kelola Kantor
                </Link>
            </div>
        </div>
    );
}

export default function Dashboard(props) {
    const { role } = props;

    return (
        <AuthenticatedLayout header={`Dashboard ${role === 'admin' ? 'Admin' : role === 'supervisor' ? 'Supervisor' : 'Karyawan'}`}>
            <Head title="Dashboard" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-dark-900">
                    Selamat Datang, {usePage().props.auth.user.name}! 👋
                </h2>
                <p className="text-dark-500 mt-1">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {role === 'admin' && <AdminDashboard {...props} />}
            {role === 'supervisor' && <SupervisorDashboard {...props} />}
            {role === 'karyawan' && <KaryawanDashboard {...props} />}
        </AuthenticatedLayout>
    );
}
