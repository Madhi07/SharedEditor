import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import Image from 'next/image'
import Link from 'next/link'
import { FaChartLine, FaSignOutAlt, FaUser } from 'react-icons/fa'

export default function LoggedInPopover({ onLogout }) {
    return (
        <Popover className="relative block">
            <PopoverButton
                className="inline-flex rounded-full w-6 h-6 overflow-hidden cursor-pointer items-center justify-center hover:opacity-90 outline-none border-none"
            >

                <FaUser className='w-full h-full object-cover' />
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
                className="flex flex-col bg-dark-card-primary z-20 p-2 shadow rounded-md w-48 text-left text-white border border-dark-border-primary"
            >
                <Link
                    href={'/dashboard/agents/chats'}
                    className='p-2 rounded-md hover:bg-gray-50/5 inline-flex items-center hover:text-secondary'
                >
                    <FaChartLine className='mr-2' />
                    Dashboard
                </Link>
                <button
                    type="button"
                    onClick={onLogout}
                    className='p-2 rounded-md hover:bg-gray-50/5 inline-flex items-center hover:text-secondary'
                >
                    <FaSignOutAlt className='mr-2' />
                    Logout
                </button>
            </PopoverPanel>
        </Popover>
    )
}
