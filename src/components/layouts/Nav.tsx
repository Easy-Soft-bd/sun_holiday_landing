"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Info, FileText, Ticket, MapPin, Mail, Hotel, ChevronDown } from 'lucide-react';
import Logo from '../common/Logo';

const Nav = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        {
            name: "About",
            href: "/about",
            icon: Info,
            submenu: [
                { name: "Our Story", href: "/about/story" },
                { name: "Team", href: "/about/team" },
                { name: "Careers", href: "/about/careers" }
            ]
        },
        {
            name: "Visa",
            href: "/visa",
            icon: FileText,
            submenu: [
                { name: "Tourist Visa", href: "/visa/tourist" },
                { name: "Business Visa", href: "/visa/business" }
            ]
        },
        { name: "Ticket", href: "/tickets", icon: Ticket },
        {
            name: "Tour",
            href: "/tours",
            icon: MapPin,
            submenu: [
                { name: "Popular Destinations", href: "/tour/popular" },
                { name: "Custom Tours", href: "/tour/custom" }
            ]
        },
        { name: "Contact", href: "/contact", icon: Mail },
        {
            name: "Resort",
            href: "/resorts",
            icon: Hotel,
            submenu: [
                { name: "Beach Resorts", href: "/resort/beach" },
                { name: "City Hotels", href: "/resort/city" }
            ]
        },
    ];

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
        setOpenSubmenu(null);
    };

    const toggleSubmenu = (name: string) => {
        setOpenSubmenu(openSubmenu === name ? null : name);
    };

    return (
        <>
            {/* Main Navbar */}
            <nav className="fixed top-0 z-50 w-full border-b border-gray-200/20 bg-base-100/20 backdrop-blur-md shadow">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Logo width={55} height={55} showText={false} />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <div key={link.name} className="relative group">
                                        <Link
                                            href={link.href}
                                            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-base-content/80 hover:text-primary transition-colors rounded-lg hover:bg-base-200"
                                        >
                                            <Icon size={18} className="opacity-70 group-hover:text-primary group-hover:opacity-100" />
                                            {link.name}
                                            {link.submenu && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />}
                                        </Link>

                                        {/* Desktop Submenu */}
                                        {link.submenu && (
                                            <div className="absolute left-0 top-full pt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                                <div className="bg-base-100 rounded-xl shadow-2xl border border-base-200 py-2 overflow-hidden">
                                                    {link.submenu.map((sublink) => (
                                                        <Link
                                                            key={sublink.name}
                                                            href={sublink.href}
                                                            className="block px-4 py-2.5 text-sm text-base-content hover:bg-primary hover:text-primary-content transition-colors"
                                                        >
                                                            {sublink.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* CTA & Mobile Toggle */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/services"
                                className="btn btn-primary btn-sm md:btn-md rounded-full px-6 shadow-lg shadow-primary/20 text-white border-none"
                            >
                                Our Services
                            </Link>

                            <button
                                onClick={toggleDrawer}
                                className="lg:hidden btn btn-ghost btn-square"
                                aria-label="Toggle menu"
                            >
                                <Menu size={24} className="text-base-content" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            {isDrawerOpen && (
                <div className="fixed inset-0 bg-base-content/20 backdrop-blur-sm z-50 lg:hidden" onClick={toggleDrawer} />
            )}

            {/* Mobile Drawer */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-xs bg-base-100 z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b border-base-200">
                        <Logo width={35} height={35} />
                        <button onClick={toggleDrawer} className="btn btn-ghost btn-circle btn-sm">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <ul className="menu menu-vertical w-full gap-2 p-0">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isSubmenuOpen = openSubmenu === link.name;

                                return (
                                    <li key={link.name}>
                                        {link.submenu ? (
                                            <>
                                                <button
                                                    onClick={() => toggleSubmenu(link.name)}
                                                    className="flex items-center justify-between py-3 px-4 active:bg-primary/10"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon size={20} className="text-primary" />
                                                        <span className="font-bold text-base-content">{link.name}</span>
                                                    </div>
                                                    <ChevronDown size={18} className={`transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                {isSubmenuOpen && (
                                                    <ul className="bg-base-200 rounded-lg mx-2 mb-2">
                                                        {link.submenu.map((sublink) => (
                                                            <li key={sublink.name}>
                                                                <Link href={sublink.href} onClick={toggleDrawer} className="py-3 px-6 text-sm font-medium">
                                                                    {sublink.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </>
                                        ) : (
                                            <Link href={link.href} onClick={toggleDrawer} className="flex items-center gap-3 py-3 px-4">
                                                <Icon size={20} className="text-primary" />
                                                <span className="font-bold text-base-content">{link.name}</span>
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="p-6 border-t border-base-200">
                        <Link href="/services" className="btn btn-primary w-full rounded-full text-white" onClick={toggleDrawer}>
                            Our Services
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Nav;