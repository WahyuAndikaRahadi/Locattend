import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-dark-950 overflow-hidden font-sans selection:bg-primary-500 selection:text-white">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] animate-pulse-soft"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent-600/20 blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-6 py-12 sm:px-0">
                <div className="flex flex-col items-center mb-8 animate-fade-in">
                    <Link href="/" className="group transform transition-transform duration-300 hover:scale-110">
                        <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl group-hover:shadow-primary-500/20 group-hover:border-primary-500/50 transition-all">
                            <ApplicationLogo className="h-12 w-12 fill-current text-white" />
                        </div>
                    </Link>
                    <h1 className="mt-6 text-3xl font-extrabold text-white tracking-tight">Locattend</h1>
                    <p className="mt-2 text-dark-400 text-center">Smart Attendance & Location Management</p>
                </div>

                <div className="glass-card-dark p-8 shadow-2xl animate-slide-up">
                    {children}
                </div>

                <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <p className="text-sm text-dark-500">
                        &copy; {new Date().getFullYear()} Locattend Team. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
