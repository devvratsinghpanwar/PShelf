"use client";

import  { useState } from "react";
import { MobileNavHeader, Navbar } from "../components/ui/resizable-navbar";
import { NavBody } from "../components/ui/resizable-navbar";
import { NavItems } from "../components/ui/resizable-navbar";
import { MobileNav } from "../components/ui/resizable-navbar";
import { MobileNavMenu } from "../components/ui/resizable-navbar";
import { MobileNavToggle } from "../components/ui/resizable-navbar";
import { NavbarLogo } from "../components/ui/resizable-navbar";
import { NavbarButton } from "../components/ui/resizable-navbar";

export const NavbarComponent = () => {
  const [mobileNavVisible, setMobileNavVisible] = useState<boolean>(false);

  const navItems = [
    { name: "Home", link: "#" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Services", link: "#" },
    { name: "Contact", link: "#" },
  ];

  const toggleMobileNav = () => {
    setMobileNavVisible(!mobileNavVisible);
  };

  return (
    <Navbar>
      {/* Desktop Navbar */}
      <NavBody visible={true}>
        <NavbarLogo />
        <NavItems items={navItems} />
        <NavbarButton href="#" variant="primary">
          Sign Up
        </NavbarButton>
      </NavBody>

      {/* Mobile Navbar */}
      <MobileNav visible={mobileNavVisible}>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={mobileNavVisible} onClick={toggleMobileNav} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileNavVisible} onClose={toggleMobileNav}>
          {navItems.map((item, idx) => (
            <a key={idx} href={item.link} className="text-sm text-black">
              {item.name}
            </a>
          ))}
          <NavbarButton href="#" variant="primary">
            Sign Up
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
};
