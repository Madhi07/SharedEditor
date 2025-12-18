import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { FaChartLine, FaHome, FaSignOutAlt, FaUser, FaUserCircle } from 'react-icons/fa'

export default function LoggedInPopover({ onLogout }) {
    return (
        <Popover className="relative block">
            <PopoverButton
                className="inline-flex bg-light-card-primary rounded-full p-2 overflow-hidden cursor-pointer items-center justify-center hover:bg-light-bg-primary outline-none border-none"
            >
                <FaUser className='text-lg' />
                {/* <Image
                    quality={100}
                    alt="User profile"
                    width={1024}
                    height={1024}
                    src="http://localhost:3000/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fuxpilot-auth.appspot.com%2Favatars%2Favatar-5.jpg&w=1080&q=100"
                    className='w-full h-full object-cover'
                /> */}
            </PopoverButton>
            <PopoverPanel
                transition
                anchor={{
                    to: 'bottom end',
                    gap: 10
                }}

                className="flex flex-col dark:bg-dark-card-primary bg-light-card-primary z-20 p-2 shadow rounded-md w-52 text-left dark:text-dark-text-primary text-light-text-primary border dark:border-dark-border-primary border-light-border-primary"
            >
                <Link
                    href={'/'}
                    className='p-2 rounded-md dark:hover:bg-dark-bg-primary hover:bg-light-bg-primary inline-flex items-center hover:text-secondary'
                >
                    <FaHome className='mr-2' />
                    Home
                </Link>
                {/* <Link
                    href={'/dashboard/profile'}
                    className='p-2 rounded-md dark:hover:bg-dark-bg-primary hover:bg-light-bg-primary inline-flex items-center hover:text-secondary'
                >
                    <FaUserCircle className='mr-2' />
                    Profile
                </Link> */}
                <button
                    type="button"
                    onClick={onLogout}
                    className='p-2 rounded-md dark:hover:bg-dark-bg-primary hover:bg-light-bg-primary inline-flex items-center hover:text-secondary'
                >
                    <FaSignOutAlt className='mr-2' />
                    Logout
                </button>
            </PopoverPanel>
        </Popover>
    )
}
