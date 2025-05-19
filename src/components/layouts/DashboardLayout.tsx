
import React from "react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { NavLink, useLocation } from "react-router-dom";
import { Calculator, FileText, File, User, Home } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-white/80 backdrop-blur-sm flex items-center px-6 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">Invoice Master</h1>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const { pathname } = useLocation();
  const { collapsed } = useSidebar();

  const isActive = (path: string) => pathname === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center px-3 py-2 rounded-md ${
      isActive ? "bg-primary text-primary-foreground" : "text-slate-600 hover:bg-slate-100"
    }`;
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/invoices", label: "Invoices", icon: FileText },
    { path: "/create-invoice", label: "New Invoice", icon: File },
    { path: "/clients", label: "Clients", icon: User },
  ];

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} bg-white/90 backdrop-blur-sm border-r py-4`} collapsible="icon">
      <SidebarTrigger className="absolute right-3 top-3" />
      
      <SidebarContent className="pt-8">
        <nav className="space-y-2 px-2">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={getNavClass} end>
              <item.icon className="h-5 w-5 mr-2" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
};

const useSidebar = () => {
  // This is a simplified hook - in a real app, you would use the actual context
  const [collapsed, setCollapsed] = React.useState(false);
  
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return {
    collapsed,
    setCollapsed
  };
};

export default DashboardLayout;
