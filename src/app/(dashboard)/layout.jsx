import Navbar from "@/components/Nav";
import Sidebar from "@/components/SideBar";
import { getServerSideUserSession } from "@/lib/services/auth/auth.serverSideSession";

export default async function DashboardLayout ({children})
{
    const user = await getServerSideUserSession();
    // console.log( user )
    
    return (
        <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar userRole={ user?.user?.role } />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar user={ user?.user } />
                <main className="flex-1 overflow-y-auto">
                    { children }
                </main>
            </div>
        </div>
    );
}
