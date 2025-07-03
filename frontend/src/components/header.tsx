"use client";
import { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "./ui/sidebar";
import { IconMenu2 } from "@tabler/icons-react";
import { SidebarDemo } from "./Sidebar";

export default function Header() {
  return (
    <div className="sticky top-0 w-full flex items-center justify-center">
      <Navbar />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { setOpen } = useSidebar();

  const handleMobileMenuToggle = () => {
    setOpen(true);
    <SidebarDemo />
  };

  return (
    <div className={cn("w-full px-4", className)}>
      <Menu setActive={setActive}>
        <div className={cn(
          "flex items-center w-full",
          isMobile ? "justify-start text-lg" : "justify-between text-2xl"
        )}>
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={handleMobileMenuToggle}
                className="md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle sidebar"
              >
                <IconMenu2 className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </button>
            )}
            <HoveredLink href="/#">Predictive Shelf</HoveredLink>
          </div>
        </div>
        {!isMobile && (
          <>
            <MenuItem setActive={setActive} active={active} item="Enquiry">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/orders">Report Shortage</HoveredLink>
                <HoveredLink href="/stock-summary">Stock Summary</HoveredLink>
                <HoveredLink href="/trends">Sales Trend</HoveredLink>
                <HoveredLink href="/events">Upcoming Events</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Services">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/hr">HR</HoveredLink>
                <HoveredLink href="/warehouse">Purchase</HoveredLink>
                <HoveredLink href="/service-portal">Manager</HoveredLink>
                <HoveredLink href="/branding">Branding</HoveredLink>
              </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Pricing">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/individual">Individual</HoveredLink>
                <HoveredLink href="/team">Team</HoveredLink>
                <HoveredLink href="/enterprise">Enterprise</HoveredLink>
              </div>
            </MenuItem>
          </>
        )}
      </Menu>
    </div>
  );
}
