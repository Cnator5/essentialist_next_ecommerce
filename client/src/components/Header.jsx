// 'use client'
// import { useEffect, useState, useRef } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { usePathname, useRouter } from 'next/navigation'
// import { FaRegCircleUser } from "react-icons/fa6";
// import useMobile from '../hooks/useMobile';
// import { BsCart4 } from "react-icons/bs";
// import { useSelector } from 'react-redux';
// import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
// import UserMenu from './UserMenu';
// import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
// import { useGlobalContext } from '../providers/GlobalProvider';
// import DisplayCartItem from './DisplayCartItem';
// import Dropdown from './Dropdown';
// import { BsSearch } from 'react-icons/bs';
// import { FaMapMarkerAlt } from 'react-icons/fa';
// import { HiPhone, HiMail } from 'react-icons/hi';
// import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
// import SideBar from './SideBar';
// import logo from '/public/assets/logo.jpg'
// import Search from './Search'

// const Header = () => {
//     const [isMobile] = useMobile()
//     const pathname = usePathname()
//     const isSearchPage = pathname === "/search"
//     const router = useRouter()
//     const user = useSelector((state) => state?.user)
//     const [openUserMenu, setOpenUserMenu] = useState(false)
//     const cartItem = useSelector(state => state.cartItem.cart)
//     const { totalPrice, totalQty } = useGlobalContext()
//     const [openCartSection, setOpenCartSection] = useState(false)
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//     const [categoryDropdown, setCategoryDropdown] = useState(null)
//     const [isHeaderVisible, setIsHeaderVisible] = useState(true)
//     const [prevScrollPos, setPrevScrollPos] = useState(0)
//     const [offersDropdownOpen, setOffersDropdownOpen] = useState(false)
//     const offersDropdownRef = useRef(null)
//     const [offersDropdownMobileOpen, setOffersDropdownMobileOpen] = useState(false)
//     const offersDropdownMobileRef = useRef(null)
//     const headerRef = useRef(null)
//     const searchBarRef = useRef(null)
//     const [isClient, setIsClient] = useState(false);

//     useEffect(() => {
//         setIsClient(true);
//     }, []);

//     const redirectToLoginPage = () => {
//         router.push("/login")
//     }
//     const redirectToBrandsPage = () => {
//         router.push("/brands")
//     }
//     const handleCloseUserMenu = () => {
//         setOpenUserMenu(false)
//     }
//     const handleMobileUser = () => {
//         if (!user._id) {
//             router.push("/login")
//             return
//         }
//         router.push("/user")
//     }
//     const handleMobileMenuNavigate = () => {
//         setMobileMenuOpen(false)
//     }
//     useEffect(() => {
//         const handleScroll = () => {
//             const currentScrollPos = window.scrollY
//             const isScrollingUp = prevScrollPos > currentScrollPos
//             setIsHeaderVisible(isScrollingUp)
//             setPrevScrollPos(currentScrollPos)
//         }
//         window.addEventListener('scroll', handleScroll)
//         return () => window.removeEventListener('scroll', handleScroll)
//     }, [prevScrollPos])
//     useEffect(() => {
//         setMobileMenuOpen(false)
//     }, [pathname])
//     useEffect(() => {
//         const handler = (e) => {
//             if (!e.target.closest('.desktop-dropdown')) {
//                 setCategoryDropdown(null);
//             }
//         };
//         if (categoryDropdown) {
//             document.addEventListener('mousedown', handler);
//         }
//         return () => document.removeEventListener('mousedown', handler);
//     }, [categoryDropdown]);
//     useEffect(() => {
//         const handler = (e) => {
//             if (offersDropdownRef.current && !offersDropdownRef.current.contains(e.target)) {
//                 setOffersDropdownOpen(false)
//             }
//         }
//         if (offersDropdownOpen) {
//             document.addEventListener('mousedown', handler)
//         }
//         return () => document.removeEventListener('mousedown', handler)
//     }, [offersDropdownOpen])
//     useEffect(() => {
//         const handler = (e) => {
//             if (offersDropdownMobileRef.current && !offersDropdownMobileRef.current.contains(e.target)) {
//                 setOffersDropdownMobileOpen(false)
//             }
//         }
//         if (offersDropdownMobileOpen) {
//             document.addEventListener('mousedown', handler)
//         }
//         return () => document.removeEventListener('mousedown', handler)
//     }, [offersDropdownMobileOpen])
//     const headerStyle = {
//         transition: 'transform 0.5s ease-in-out',
//         position: 'relative',
//         width: '100%',
//         zIndex: 40
//     };
//     const showSidebar = !pathname.includes('/dashboard');

//     return (
//         <header 
//             ref={headerRef} 
//             className="bg-white shadow" 
//             style={headerStyle}
//         >
//             <div className="bg-pink-400 text-white  px-2 py-1 sm:px-1 flex flex-col lg:flex-row items-center justify-between text-xs sm:text-sm">
//                 <div className="flex items-center justify-center lg:justify-start w-full lg:w-auto gap-4">
//                     <div className="flex items-center">
//                         <HiPhone className="mr-1" />
//                         <span className=" sm:flex">+237 655 22 55 69</span>
//                     </div>
//                     <div className="flex items-center">
//                         <HiMail className="mr-1" />
//                         <span className=" sm:flex">esssmakeup@gmail.com</span>
//                     </div>
//                 </div>
//                 <div className="font-medium text-center w-full lg:w-auto py-1 lg:py-0">
//                     Welcome To Essentialist Makeup Store
//                 </div>
//                 <div className="flex items-center justify-center lg:justify-end w-full lg:w-auto gap-2 sm:gap-4 mt-1 lg:mt-0">
//                     <div className="flex items-center cursor-pointer hover:text-purple-200 text-xs sm:text-sm">
//                         <FaMapMarkerAlt className="mr-1" />
//                         <span className="hidden sm:inline">Bonamoussadi, Carrefour Maçon, Douala, Cameroon</span>
//                         <span className="inline sm:hidden">Store</span>
//                     </div>
//                 </div>
//             </div>
//             <nav className="bg-black text-white px-2 sm:px-4 ">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center flex-shrink-0">
//                         <Link href="/" className="flex items-center h-full">
//                             <Image
//                                 src={logo}
//                                 width={130}
//                                 height={40}
//                                 alt="logo"
//                                 className="hidden lg:block"
//                                 style={{ maxWidth: "100%", objectFit: "contain", height: "auto" }}
//                                 priority
//                             />
//                             <Image
//                                 src={logo}
//                                 width={120}
//                                 height={60}
//                                 alt="logo"
//                                 className="lg:hidden"
//                                 style={{ maxWidth: "100%", objectFit: "contain", height: "auto" }}
//                                 priority
//                             />
//                         </Link> 
//                     </div>
//                     {!(isSearchPage && isMobile) && (
//                         <div 
//                             ref={searchBarRef} 
//                             className="flex-1 px-3  block"
//                             style={{ 
//                                 transition: 'all 0.3s ease',
//                                 transform: isHeaderVisible ? 'scale(1)' : 'scale(0.9)',
//                             }}
//                         >
//                             <Search />
//                         </div>
//                     )}
//                     <div className="hidden lg:flex items-center gap-8">
//                         {user?._id ? (
//                             <div className="relative">
//                                 <div onClick={() => setOpenUserMenu(prev => !prev)} className="flex select-none items-center gap-1 cursor-pointer text-bold text-lg">
//                                     <span>Account</span>
//                                     {openUserMenu
//                                         ? <GoTriangleUp size={22} />
//                                         : <GoTriangleDown size={22} />}
//                                 </div>
//                                 {openUserMenu && (
//                                     <div className='absolute right-0 top-9 z-50'>
//                                         <div className='bg-white text-black rounded p-3 min-w-40 shadow-lg'>
//                                             <UserMenu close={handleCloseUserMenu} />
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             <button onClick={redirectToLoginPage} className='text-lg px-2'>Login</button>
//                         )}
//                         <button
//                             onClick={() => setOpenCartSection(true)}
//                             className="flex items-center gap-2 bg-pink-400 hover:bg-yellow-400 px-4 py-2 rounded text-white transition-colors duration-200"
//                         >
//                             <div className="animate-bounce">
//                                 <BsCart4 size={24} />
//                             </div>
//                             <div className="font-semibold text-sm text-left">
//                                 {isClient && cartItem[0] ? (
//                                     <>
//                                         <p>{totalQty} Items</p>
//                                         <p>{DisplayPriceInRupees(totalPrice)}</p>
//                                     </>
//                                 ) : (
//                                     <p>My Cart</p>
//                                 )}
//                             </div>
//                         </button>
//                     </div>
//                     <div className="lg:hidden flex items-center gap-2">
//                         <button
//                             className="text-white mx-1"
//                             onClick={() => setOpenCartSection(true)}
//                             aria-label="Cart"
//                         >
//                             <BsCart4 size={24} />
//                             {isClient && totalQty > 0 && (
//                                 <span className="ml-1 text-xs bg-pink-400 px-2 py-0.5 rounded-full font-bold">
//                                     {totalQty}
//                                 </span>
//                             )}
//                         </button>
//                         <button
//                             className="text-white mx-1"
//                             onClick={handleMobileUser}
//                             aria-label="Account"
//                         >
//                             <FaRegCircleUser size={24} />
//                         </button>
//                         <button
//                             className="text-white mx-1"
//                             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                             aria-label="Menu"
//                         >
//                             {mobileMenuOpen ? (
//                                 <RiCloseLine size={30} />
//                             ) : (
//                                 <RiMenu3Line size={30} />
//                             )}
//                         </button>
//                     </div>
//                 </div>
//             </nav>
//             <div className="hidden lg:block bg-black text-white border-t border-purple-800">
//                 <div className="max-w-screen-2xl mx-auto px-4">
//                     <ul className="flex justify-center space-x-20 py-2">
//                         <div className="flex items-center justify-between hover:text-purple-400 cursor-pointer">
//                             <Link href="/">HOME</Link>
//                         </div>
//                         <li>
//                             <div className="flex text-black items-center hover:text-black">
//                                 <Dropdown />
//                             </div>
//                         </li>
//                         <li>
//                          <Link href="/brands" className="block text-white px-2 py-2 hover:text-purple-400">BRANDS</Link>
//                         </li>
//                         <li>
//                          <Link href="/new-arrival" className="block text-white px-2 py-2 hover:text-purple-400">NEW & HOT</Link>
//                         </li>
//                         <div className="flex items-center hover:text-purple-400 cursor-pointer">
//                             <Link href="/contact">CONTACT US</Link>
//                         </div>
//                         <div 
//                             className="relative flex items-center cursor-pointer"
//                             ref={offersDropdownRef}
//                             onMouseEnter={() => setOffersDropdownOpen(true)}
//                             onMouseLeave={() => setOffersDropdownOpen(false)}
//                         >
//                             <button 
//                                 className="flex items-center gap-1 text-white px-2 py-2 hover:text-pink-400 focus:outline-none"
//                                 onClick={() => setOffersDropdownOpen((o) => !o)}
//                                 type="button"
//                                 aria-haspopup="true"
//                                 aria-expanded={offersDropdownOpen ? 'true' : 'false'}
//                             >
//                                 SALES & OFFERS 
//                                 <GoTriangleDown className="ml-1" />
//                             </button>
//                             {offersDropdownOpen && (
//                                 <div className="absolute top-full right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
//                                     <Link 
//                                         href="/offers" 
//                                         className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors"
//                                         onClick={() => setOffersDropdownOpen(false)}
//                                     >
//                                         Offers
//                                     </Link>
//                                     <Link 
//                                         href="/clearance" 
//                                         className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors"
//                                         onClick={() => setOffersDropdownOpen(false)}
//                                     >
//                                         Clearance
//                                     </Link>
//                                 </div>
//                             )}
//                         </div>
//                     </ul>
//                 </div>
//             </div>
//             <div
//                 className={`lg:hidden fixed top-0 left-0 w-full h-screen z-50 bg-opacity-80 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} flex overflow-y-auto bg-black`}
//             >     
//                 <div className="w-full bg-black text-black h-full flex flex-col overflow-y-auto">
//                     <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
//                         <Link href="/" onClick={() => setMobileMenuOpen(false)}>
//                             <Image
//                                 src={logo}
//                                 width={120}
//                                 height={60}
//                                 alt="logo"
//                                 style={{ maxWidth: "100%", objectFit: "contain", height: "auto" }}
//                                 priority
//                             />
//                         </Link>
//                         <button
//                             className="text-black"
//                             onClick={() => setMobileMenuOpen(false)}
//                             aria-label="Close Menu"
//                         >
//                             <RiCloseLine size={30} />
//                         </button>
//                     </div>
//                     <div className="block bg-white text-black font-bold">
//                         <div className="block text-black ">
//                             <ul className="flex flex-col ">
//                                 <li>
//                                     <Link href="/" className="block text-black px-4 hover:text-purple-400 border-gray-700" onClick={() => setMobileMenuOpen(false)}>HOME</Link>
//                                 </li>
//                                 <li>
//                                     <Link href="/brands" className="block text-black px-4 py-4 hover:text-purple-400  border-gray-700" onClick={() => setMobileMenuOpen(false)}>BRANDS</Link>
//                                 </li>
//                                 <li>
//                                     <Link href="/new-arrival" className="block text-black px-4 py-4 hover:text-purple-400  border-gray-700" onClick={() => setMobileMenuOpen(false)}>NEW & HOT</Link>
//                                 </li>
//                                 <li>
//                                     <Link href="/contact" className="block text-black px-4 py-4 hover:text-purple-400  border-gray-700" onClick={() => setMobileMenuOpen(false)}>CONTACT US</Link>
//                                 </li>
//                                 <li ref={offersDropdownMobileRef} className="relative border-b border-gray-700">
//                                     <button
//                                         className="w-full flex items-center justify-between px-4 py-4 text-black hover:text-pink-400 focus:outline-none"
//                                         onClick={() => setOffersDropdownMobileOpen((open) => !open)}
//                                         aria-haspopup="true"
//                                         aria-expanded={offersDropdownMobileOpen ? "true" : "false"}
//                                         type="button"
//                                     >
//                                         SALES & OFFERS
//                                         <GoTriangleDown className={`ml-2 transform transition-transform ${offersDropdownMobileOpen ? 'rotate-180' : ''}`} />
//                                     </button>
//                                     {offersDropdownMobileOpen && (
//                                         <div className="bg-white rounded shadow-lg text-black mt-1 absolute left-4 w-40 z-50">
//                                             <Link
//                                                 href="/offers"
//                                                 className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors"
//                                                 onClick={() => {
//                                                     setOffersDropdownMobileOpen(false)
//                                                     setMobileMenuOpen(false)
//                                                 }}
//                                             >
//                                                 Offers
//                                             </Link>
//                                             <Link
//                                                 href="/clearance"
//                                                 className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors"
//                                                 onClick={() => {
//                                                     setOffersDropdownMobileOpen(false)
//                                                     setMobileMenuOpen(false)
//                                                 }}
//                                             >
//                                                 Clearance
//                                             </Link>
//                                         </div>
//                                     )}
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                     {showSidebar && (
//                         <div className="border-b border-purple-800">
//                             <SideBar isMobile={true} onNavigate={handleMobileMenuNavigate} />
//                         </div>
//                     )}
//                 </div>
//                 <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
//             </div>
//             {openCartSection && (
//                 <DisplayCartItem close={() => setOpenCartSection(false)} />
//             )}
//         </header>
//     )
// }

// export default Header









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
import { useGlobalContext } from '../providers/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';
import Dropdown from './Dropdown';
import { BsSearch } from 'react-icons/bs';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { HiPhone, HiMail } from 'react-icons/hi';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { BiTimeFive } from 'react-icons/bi';
import SideBar from './SideBar';
import logo from '/public/assets/logo.jpg'
import Search from './Search'

const Header = () => {
    // State management
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
        { title: 'CONTACT US', path: '/contact' }
    ], []);

    // Calculate next delivery date and countdown
    const calculateDeliveryDate = useCallback(() => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // If tomorrow is Sunday (0) or Saturday (6), set to Monday
        if (tomorrow.getDay() === 0) { // Sunday
            tomorrow.setDate(tomorrow.getDate() + 1); // Set to Monday
        } else if (tomorrow.getDay() === 6) { // Saturday
            tomorrow.setDate(tomorrow.getDate() + 2); // Set to Monday
        }
        
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        setDeliveryDate(tomorrow.toLocaleDateString('en-US', options));
        
        // Calculate remaining time until midnight
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const timeRemaining = endOfDay.getTime() - now.getTime();
        
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        setDeliveryTime(`${hours}h ${minutes}m`);
        setDeliverySeconds(seconds);
    }, []);

    // Update seconds counter every second
    useEffect(() => {
        const secondsInterval = setInterval(() => {
            setDeliverySeconds(prevSeconds => {
                if (prevSeconds <= 0) {
                    // When seconds reach 0, recalculate the full time
                    calculateDeliveryDate();
                    return 59;
                }
                return prevSeconds - 1;
            });
        }, 1000);
        
        return () => clearInterval(secondsInterval);
    }, [calculateDeliveryDate]);

    // Handlers
    const redirectToLoginPage = useCallback(() => {
        router.push("/login")
    }, [router]);

    const handleCloseUserMenu = useCallback(() => {
        setOpenUserMenu(false)
    }, []);

    const handleMobileUser = useCallback(() => {
        if (!user?._id) {
            router.push("/login")
            return
        }
        router.push("/user")
    }, [router, user]);

    const handleMobileMenuNavigate = useCallback(() => {
        setMobileMenuOpen(false)
    }, []);

    const toggleCartSection = useCallback(() => {
        setOpenCartSection(prev => !prev)
    }, []);

    const toggleUserMenu = useCallback(() => {
        setOpenUserMenu(prev => !prev)
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setMobileMenuOpen(prev => !prev)
    }, []);

    // Effects
    useEffect(() => {
        setIsClient(true);
        calculateDeliveryDate();
        
        // Update delivery time every minute
        const minuteInterval = setInterval(calculateDeliveryDate, 60000);
        return () => clearInterval(minuteInterval);
    }, [calculateDeliveryDate]);

    // Handle scroll for header visibility
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY
            const isScrollingUp = prevScrollPos > currentScrollPos || currentScrollPos < 10
            
            // Add some debouncing to prevent flickering
            if (isScrollingUp !== isHeaderVisible) {
                setIsHeaderVisible(isScrollingUp)
            }
            setPrevScrollPos(currentScrollPos)
        }
        
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [prevScrollPos, isHeaderVisible]);

    useEffect(() => {
        setMobileMenuOpen(false)
    }, [pathname]);

    useEffect(() => {
        const handler = (e) => {
            if (!e.target.closest('.desktop-dropdown')) {
                setCategoryDropdown(null);
            }
        };
        
        if (categoryDropdown) {
            document.addEventListener('mousedown', handler);
        }
        return () => document.removeEventListener('mousedown', handler);
    }, [categoryDropdown]);

    useEffect(() => {
        const handler = (e) => {
            if (offersDropdownRef.current && !offersDropdownRef.current.contains(e.target)) {
                setOffersDropdownOpen(false)
            }
        }
        
        if (offersDropdownOpen) {
            document.addEventListener('mousedown', handler)
        }
        return () => document.removeEventListener('mousedown', handler)
    }, [offersDropdownOpen]);

    useEffect(() => {
        const handler = (e) => {
            if (offersDropdownMobileRef.current && !offersDropdownMobileRef.current.contains(e.target)) {
                setOffersDropdownMobileOpen(false)
            }
        }
        
        if (offersDropdownMobileOpen) {
            document.addEventListener('mousedown', handler)
        }
        return () => document.removeEventListener('mousedown', handler)
    }, [offersDropdownMobileOpen]);

    // Style and render conditions
    const headerStyle = {
        transition: 'transform 0.3s ease-in-out',
        position: 'sticky',
        top: isHeaderVisible ? '0' : '-100%',
        width: '100%',
        zIndex: 40
    };
    
    const showSidebar = !pathname.includes('/dashboard');

    return (
        <header 
            ref={headerRef} 
            className="bg-white shadow" 
            style={headerStyle}
        >
            <div className="bg-pink-400 text-white px-2 py-1 sm:px-1 flex flex-col lg:flex-row items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center justify-center lg:justify-start w-full lg:w-auto gap-4">
                    <div className="flex items-center">
                        <HiPhone className="mr-1" />
                        <span className="sm:flex">+237 655 22 55 69</span>
                    </div>
                    <div className="flex items-center">
                        <HiMail className="mr-1" />
                        <span className="sm:flex">esssmakeup@gmail.com</span>
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
                        <Link href="/" className="flex items-center h-full" prefetch>
                            <Image
                                src={logo}
                                width={130}
                                height={40}
                                alt="logo"
                                className="hidden lg:block"
                                style={{ maxWidth: "100%", objectFit: "contain", height: "auto" }}
                                priority
                            />
                            <Image
                                src={logo}
                                width={120}
                                height={60}
                                alt="logo"
                                className="lg:hidden"
                                style={{ maxWidth: "100%", objectFit: "contain", height: "auto" }}
                                priority
                            />
                        </Link> 
                    </div>
                    {!(isSearchPage && isMobile) && (
                        <div 
                            ref={searchBarRef} 
                            className="flex-1 px-3 block"
                            style={{ 
                                transition: 'all 0.3s ease',
                                transform: isHeaderVisible ? 'scale(1)' : 'scale(0.9)',
                            }}
                        >
                            <Search />
                        </div>
                    )}
                    <div className="hidden lg:flex items-center gap-8">
                        {user?._id ? (
                            <div className="relative">
                                <div onClick={toggleUserMenu} className="flex select-none items-center gap-1 cursor-pointer text-bold text-lg">
                                    <span>Account</span>
                                    {openUserMenu
                                        ? <GoTriangleUp size={22} />
                                        : <GoTriangleDown size={22} />}
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
                            <button onClick={redirectToLoginPage} className='text-lg px-2 hover:text-pink-400 transition-colors'>Login</button>
                        )}
                        <button
                            onClick={toggleCartSection}
                            className="flex items-center gap-2 bg-pink-400 hover:bg-yellow-400 px-4 py-2 rounded text-white transition-colors duration-200"
                            aria-label="Shopping Cart"
                        >
                            <div className="animate-bounce">
                                <BsCart4 size={24} />
                            </div>
                            <div className="font-semibold text-sm text-left">
                                {isClient && cartItem[0] ? (
                                    <>
                                        <p>{totalQty} Items</p>
                                        <p>{DisplayPriceInRupees(totalPrice)}</p>
                                    </>
                                ) : (
                                    <p>My Cart</p>
                                )}
                            </div>
                        </button>
                    </div>
                    <div className="lg:hidden flex items-center gap-2">
                        <button
                            className="text-white mx-1 relative"
                            onClick={toggleCartSection}
                            aria-label="Cart"
                        >
                            <BsCart4 size={24} />
                            {isClient && totalQty > 0 && (
                                <span className="absolute -top-2 -right-2 text-xs bg-pink-400 px-2 py-0.5 rounded-full font-bold">
                                    {totalQty}
                                </span>
                            )}
                        </button>
                        <button
                            className="text-white mx-1"
                            onClick={handleMobileUser}
                            aria-label="Account"
                        >
                            <FaRegCircleUser size={24} />
                        </button>
                        <button
                            className="text-white mx-1"
                            onClick={toggleMobileMenu}
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? (
                                <RiCloseLine size={30} />
                            ) : (
                                <RiMenu3Line size={30} />
                            )}
                        </button>
                    </div>
                </div>
            </nav>
            <div className="hidden lg:block bg-black text-white border-t border-purple-800">
                <div className="max-w-screen-2xl mx-auto px-4">
                    <ul className="flex justify-center space-x-20 py-2">
                        {navLinks.map(link => (
                            <li key={link.path} className="flex items-center justify-between hover:text-purple-400 cursor-pointer">
                                <Link href={link.path} prefetch>{link.title}</Link>
                            </li>
                        ))}
                        <li>
                            <div className="flex text-black items-center hover:text-black">
                                <Dropdown />
                            </div>
                        </li>
                        <li 
                            className="relative flex items-center cursor-pointer"
                            ref={offersDropdownRef}
                        >
                            <button 
                                className="flex items-center gap-1 text-white px-2 py-2 hover:text-pink-400 focus:outline-none"
                                onClick={() => setOffersDropdownOpen((o) => !o)}
                                onMouseEnter={() => setOffersDropdownOpen(true)}
                                onMouseLeave={() => setOffersDropdownOpen(false)}
                                type="button"
                                aria-haspopup="true"
                                aria-expanded={offersDropdownOpen ? 'true' : 'false'}
                            >
                                SALES & OFFERS 
                                <GoTriangleDown className={`ml-1 transform transition-transform ${offersDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {offersDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                                    <Link 
                                        href="/offers" 
                                        className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                                        onClick={() => setOffersDropdownOpen(false)}
                                        prefetch
                                    >
                                        Offers
                                    </Link>
                                    <Link 
                                        href="/clearance" 
                                        className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                                        onClick={() => setOffersDropdownOpen(false)}
                                        prefetch
                                    >
                                        Clearance
                                    </Link>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
            <div
                className={`lg:hidden fixed top-0 left-0 w-full h-screen z-50 bg-opacity-80 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} flex overflow-y-auto bg-black`}
                style={{ backdropFilter: 'blur(5px)' }}
            >     
                <div 
                    className="bg-black text-black h-full flex flex-col overflow-y-auto"
                    style={{ width: '80%' }} // Making sidebar 80% width on mobile
                >
                    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} prefetch>
                            <Image
                                src={logo}
                                width={120}
                                height={60}
                                alt="logo"
                                style={{ maxWidth: "100%", objectFit: "contain", height: "auto" }}
                                priority
                            />
                        </Link>
                        <button
                            className="text-black"
                            onClick={() => setMobileMenuOpen(false)}
                            aria-label="Close Menu"
                        >
                            <RiCloseLine size={30} />
                        </button>
                    </div>
                    <div className="block bg-white text-black font-bold">
                        <div className="block text-black">
                            <ul className="flex flex-col">
                                {navLinks.map(link => (
                                    <li key={link.path} className="border-b border-gray-700">
                                        <Link 
                                            href={link.path} 
                                            className="block text-black px-4 py-4 hover:text-purple-400 transition-colors" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            prefetch
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                                <li ref={offersDropdownMobileRef} className="relative border-b border-gray-700">
                                    <button
                                        className="w-full flex items-center justify-between px-4 py-4 text-black hover:text-pink-400 focus:outline-none transition-colors"
                                        onClick={() => setOffersDropdownMobileOpen((open) => !open)}
                                        aria-haspopup="true"
                                        aria-expanded={offersDropdownMobileOpen ? "true" : "false"}
                                        type="button"
                                    >
                                        SALES & OFFERS
                                        <GoTriangleDown className={`ml-2 transform transition-transform ${offersDropdownMobileOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {offersDropdownMobileOpen && (
                                        <div className="bg-white rounded shadow-lg text-black mt-1 absolute left-4 w-40 z-50">
                                            <Link
                                                href="/offers"
                                                className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                                                onClick={() => {
                                                    setOffersDropdownMobileOpen(false)
                                                    setMobileMenuOpen(false)
                                                }}
                                                prefetch
                                            >
                                                Offers
                                            </Link>
                                            <Link
                                                href="/clearance"
                                                className="block px-4 py-2 hover:bg-pink-50 hover:text-pink-700 transition-colors"
                                                onClick={() => {
                                                    setOffersDropdownMobileOpen(false)
                                                    setMobileMenuOpen(false)
                                                }}
                                                prefetch
                                            >
                                                Clearance
                                            </Link>
                                        </div>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                    {showSidebar && (
                        <div className="border-b border-purple-800">
                            <SideBar isMobile={true} onNavigate={handleMobileMenuNavigate} />
                        </div>
                    )}
                </div>
                <div 
                    className="flex-1" 
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ touchAction: 'none' }}
                />
            </div>
            {openCartSection && (
                <DisplayCartItem close={() => setOpenCartSection(false)} />
            )}
        </header>
    )
}

export default Header