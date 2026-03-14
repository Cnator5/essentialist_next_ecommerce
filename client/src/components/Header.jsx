'use client'
import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { BsCart4 } from "react-icons/bs";
import { useSelector } from 'react-redux';
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from './UserMenu';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import DisplayCartItem from './DisplayCartItem';
import Dropdown from './Dropdown';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { HiPhone, HiMail } from 'react-icons/hi';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { BiTimeFive } from 'react-icons/bi';
import SideBar from './SideBar';
import Search from './Search'
import { useGlobalContext } from '@/providers/ReactQueryProvider'

const Header = () => {
    const [isMobile] = useMobile()
    const pathname = usePathname()
    const isSearchPage = pathname === "/search"
    const router = useRouter()
    const user = useSelector((state) => state?.user)
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const { totalPrice, totalQty } = useGlobalContext()
    const [openCartSection, setOpenCartSection] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [categoryDropdown, setCategoryDropdown] = useState(null)
    const [isHeaderVisible, setIsHeaderVisible] = useState(true)
    const [prevScrollPos, setPrevScrollPos] = useState(0)
    const [offersDropdownOpen, setOffersDropdownOpen] = useState(false)
    const offersDropdownRef = useRef(null)
    const [offersDropdownMobileOpen, setOffersDropdownMobileOpen] = useState(false)
    const offersDropdownMobileRef = useRef(null)
    const headerRef = useRef(null)
    const searchBarRef = useRef(null)
    const [isClient, setIsClient] = useState(false);
    const [deliveryDate, setDeliveryDate] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [deliverySeconds, setDeliverySeconds] = useState(0);

    const navLinks = useMemo(() => [
        { title: 'HOME', path: '/' },
        { title: 'BRANDS', path: '/brands' },
        { title: 'NEW & HOT', path: '/new-arrival' },
        { title: 'BLOG', path: '/blog' },
        { title: 'CONTACT US', path: '/contact' }
    ], []);

    const calculateDeliveryDate = useCallback(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (tomorrow.getDay() === 0) {
            tomorrow.setDate(tomorrow.getDate() + 1);
        } else if (tomorrow.getDay() === 6) {
            tomorrow.setDate(tomorrow.getDate() + 2);
        }
        
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        setDeliveryDate(tomorrow.toLocaleDateString('en-US', options));
        
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const timeRemaining = endOfDay.getTime() - now.getTime();
        
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        setDeliveryTime(`${hours}h ${minutes}m`);
        setDeliverySeconds(seconds);
    }, []);

    useEffect(() => {
        const secondsInterval = setInterval(() => {
            setDeliverySeconds(prevSeconds => {
                if (prevSeconds <= 0) {
                    calculateDeliveryDate();
                    return 59;
                }
                return prevSeconds - 1;
            });
        }, 1000);
        return () => clearInterval(secondsInterval);
    }, [calculateDeliveryDate]);

    const handleCloseUserMenu = useCallback(() => setOpenUserMenu(false), []);

    const handleMobileUser = useCallback(() => {
        if (!user?._id) {
            router.push("/login")
            return
        }
        router.push("/user")
    }, [router, user]);

    const handleMobileMenuNavigate = useCallback(() => setMobileMenuOpen(false), []);
    const toggleCartSection = useCallback(() => setOpenCartSection(prev => !prev), []);
    const toggleUserMenu = useCallback(() => setOpenUserMenu(prev => !prev), []);
    const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);

    useEffect(() => {
        setIsClient(true);
        calculateDeliveryDate();
        const minuteInterval = setInterval(calculateDeliveryDate, 60000);
        return () => clearInterval(minuteInterval);
    }, [calculateDeliveryDate]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY
            const isScrollingUp = prevScrollPos > currentScrollPos || currentScrollPos < 10
            if (isScrollingUp !== isHeaderVisible) {
                setIsHeaderVisible(isScrollingUp)
            }
            setPrevScrollPos(currentScrollPos)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [prevScrollPos, isHeaderVisible]);

    useEffect(() => { setMobileMenuOpen(false) }, [pathname]);

    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest('.desktop-dropdown')) setCategoryDropdown(null);
        };
        if (categoryDropdown) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [categoryDropdown]);

    useEffect(() => {
        const handler = (e) => {
            if (offersDropdownRef.current && !offersDropdownRef.current.contains(e.target)) setOffersDropdownOpen(false)
        }
        if (offersDropdownOpen) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [offersDropdownOpen]);

    const headerStyle = {
        transition: 'transform 0.3s ease-in-out',
        position: 'sticky',
        width: '100%',
        zIndex: 40
    };
    
    const showSidebar = !pathname.includes('/dashboard');

    return (
        <header ref={headerRef} className="bg-white shadow" style={headerStyle}>
            <div className="bg-pink-400 text-white px-2 py-1 sm:px-1 flex flex-col lg:flex-row items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center justify-center lg:justify-start w-full lg:w-auto gap-4">
                    <div className="flex items-center">
                        <HiPhone className="mr-1" />
                        <span>+237 655 22 55 69</span>
                    </div>
                    <div className="flex items-center">
                        <HiMail className="mr-1" />
                        <span>esssmakeup@gmail.com</span>
                    </div>
                </div>
                <div className="font-medium text-center w-full lg:w-auto py-1 lg:py-0 flex items-center justify-center">
                    <BiTimeFive className="mr-1 animate-pulse" />
                    <span>
                        Order now and get it on {deliveryDate} - {deliveryTime} 
                        <span className="inline-flex items-center ml-1 font-bold">
                            <span className="bg-white text-pink-600 px-1 rounded animate-pulse">
                                {deliverySeconds}s
                            </span>
                            <span className="ml-1">left!</span>
                        </span>
                    </span>
                </div>
                <div className="flex items-center justify-center lg:justify-end w-full lg:w-auto gap-2 sm:gap-4 mt-1 lg:mt-0">
                    <div className="flex items-center cursor-pointer hover:text-purple-200 text-xs sm:text-sm">
                        <FaMapMarkerAlt className="mr-1" />
                        <span className="hidden sm:inline">Bonamoussadi, Carrefour Maçon, Douala, Cameroon</span>
                        <span className="inline sm:hidden">Store</span>
                    </div>
                </div>
            </div>

            <nav className="bg-black text-white px-2 sm:px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center flex-shrink-0">
                        <Link href="/" className="flex items-center h-full" prefetch={true}>
                            {/* DESKTOP LOGO OPTIMIZED */}
                            <Image
                                src="/assets/logo.jpg"
                                width={130}
                                height={40}
                                alt="logo"
                                className="hidden lg:block"
                                style={{ maxWidth: "100%", objectFit: "contain", height: "auto" }}
                                priority={true}
                                fetchPriority="high"
                                unoptimized={true}
                            />
                            {/* MOBILE LOGO OPTIMIZED */}
                            <Image
                                src="/assets/logo.jpg"
                                width={120}
                                height={60}
                                alt="logo"
                                className="lg:hidden"
                                style={{ maxWidth: "100%", objectFit: "contain", height: "auto" }}
                                priority={true}
                                fetchPriority="high"
                                unoptimized={true}
                            />
                        </Link> 
                    </div>
                    {!(isSearchPage && isMobile) && (
                        <div ref={searchBarRef} className="flex-1 px-3 block">
                            <Search />
                        </div>
                    )}

                    <div className="flex flex-wrap">
                        <Link href="/orders" prefetch={true} className="text-base sm:text-lg px-2 no-underline hover:underline hover:text-pink-300 hidden lg:flex items-center">
                            My Orders
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-2">
                        {user?._id ? (
                            <div className="relative">
                                <div onClick={toggleUserMenu} className="flex select-none items-center gap-1 cursor-pointer text-lg font-bold">
                                    <span>Account</span>
                                    {openUserMenu ? <GoTriangleUp size={22} /> : <GoTriangleDown size={22} />}
                                </div>
                                {openUserMenu && (
                                    <div className='absolute right-0 top-9 z-50'>
                                        <div className='bg-white text-black rounded p-3 min-w-40 shadow-lg'>
                                            <UserMenu close={handleCloseUserMenu} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" prefetch={true} className='text-lg px-2 hover:text-pink-400 transition-colors'>
                                Login
                            </Link>
                        )}
                        <button onClick={toggleCartSection} className="flex items-center gap-2 bg-pink-400 hover:bg-yellow-400 px-4 py-2 rounded text-white transition-colors duration-200">
                            <div className="animate-bounce"><BsCart4 size={24} /></div>
                            <div className="font-semibold text-sm text-left">
                                {isClient && cartItem[0] ? (
                                    <>
                                        <p>{totalQty} Items</p>
                                        <p>{DisplayPriceInRupees(totalPrice)}</p>
                                    </>
                                ) : <p>My Cart</p>}
                            </div>
                        </button>
                    </div>

                    <div className="lg:hidden flex items-center gap-2">
                        <button className="text-white mx-1 relative" onClick={toggleCartSection}>
                            <BsCart4 size={24} />
                            {isClient && totalQty > 0 && (
                                <span className="absolute -top-2 -right-2 text-xs bg-pink-400 px-2 py-0.5 rounded-full font-bold">{totalQty}</span>
                            )}
                        </button>
                        <button className="text-white mx-1" onClick={handleMobileUser}>
                            <FaRegCircleUser size={24} />
                        </button>
                        <button className="text-white mx-1" onClick={toggleMobileMenu}>
                            {mobileMenuOpen ? <RiCloseLine size={30} /> : <RiMenu3Line size={30} />}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="hidden lg:block bg-black text-white border-t border-purple-800">
                <div className="max-w-screen-2xl mx-auto px-4">
                    <ul className="flex justify-center space-x-20">
                        {navLinks.map(link => (
                            <li key={link.path} className="flex items-center justify-between hover:text-purple-400 cursor-pointer">
                                <Link href={link.path} prefetch={true}>{link.title}</Link>
                            </li>
                        ))}
                        <li><Dropdown /></li>
                        <li className="relative flex items-center cursor-pointer" ref={offersDropdownRef} onMouseEnter={() => setOffersDropdownOpen(true)} onMouseLeave={() => setOffersDropdownOpen(false)}>
                            <button className="flex items-center gap-1 text-white px-2 py-2 hover:text-pink-400 focus:outline-none" onClick={() => setOffersDropdownOpen((o) => !o)} type="button">
                                SALES & OFFERS 
                                <GoTriangleDown className={`ml-1 transform transition-transform ${offersDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {offersDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                                    <Link href="/offers" prefetch={true} className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors" onClick={() => setOffersDropdownOpen(false)}>Offers</Link>
                                    <Link href="/clearance" prefetch={true} className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors" onClick={() => setOffersDropdownOpen(false)}>Clearance</Link>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>

            <div className={`lg:hidden fixed top-0 left-0 w-full h-screen z-50 bg-opacity-80 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} flex overflow-y-auto bg-black`} style={{ backdropFilter: 'blur(5px)' }}>     
                <div className="bg-black text-black h-full flex flex-col overflow-y-auto" style={{ width: '80%' }}>
                    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} prefetch={true}>
                            <Image src="/assets/logo.jpg" width={120} height={60} alt="logo" style={{ maxWidth: "100%", objectFit: "contain", height: "auto" }} priority={true} unoptimized={true} />
                        </Link>
                        <button className="text-black" onClick={() => setMobileMenuOpen(false)}><RiCloseLine size={30} /></button>
                    </div>
                    <div className="block bg-white text-black font-bold">
                        <ul className="flex flex-col">
                            {navLinks.map(link => (
                                <li key={link.path} className="border-b border-gray-700">
                                    <Link href={link.path} prefetch={true} className="block text-black px-4 py-4 hover:text-purple-400 transition-colors" onClick={() => setMobileMenuOpen(false)}>{link.title}</Link>
                                </li>
                            ))}
                            <li ref={offersDropdownMobileRef} className="relative border-b border-gray-700">
                                <button className="w-full flex items-center justify-between px-4 py-4 text-black hover:text-pink-400 focus:outline-none transition-colors" onClick={() => setOffersDropdownMobileOpen((open) => !open)} type="button">
                                    SALES & OFFERS
                                    <GoTriangleDown className={`ml-2 transform transition-transform ${offersDropdownMobileOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {offersDropdownMobileOpen && (
                                    <div className="bg-white rounded shadow-lg text-black mt-1 absolute left-4 w-40 z-50">
                                        <Link href="/offers" prefetch={true} className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors" onClick={() => { setOffersDropdownMobileOpen(false); setMobileMenuOpen(false); }}>Offers</Link>
                                        <Link href="/clearance" prefetch={true} className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors" onClick={() => { setOffersDropdownMobileOpen(false); setMobileMenuOpen(false); }}>Clearance</Link>
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                    {showSidebar && <div className="border-b border-purple-800"><SideBar isMobile={true} onNavigate={handleMobileMenuNavigate} /></div>}
                </div>
                <div className="flex-1" onClick={() => setMobileMenuOpen(false)} style={{ touchAction: 'none' }} />
            </div>
            {openCartSection && <DisplayCartItem close={() => setOpenCartSection(false)} />}
        </header>
    )
}

export default Header