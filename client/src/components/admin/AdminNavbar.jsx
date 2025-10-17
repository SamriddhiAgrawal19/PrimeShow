import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { UserButton } from '@clerk/clerk-react';
import { UserPlus } from 'lucide-react'; 

const AdminNavbar = () => {
    const navigate = useNavigate();

    return (
        <div className='flex items-center justify-between px-6 md:px-10 border-b border-gray-300/30 h-16'>
            <Link to="/admin/dashboard" >
                <img src={assets.logo1} alt="logo" className="w-36 h-auto mt-2" />
            </Link>

            <div className="flex items-center gap-4">
                <UserButton afterSignOutUrl="/"> 
                    <UserButton.MenuItems>
                        <UserButton.AddAccount label="Add Account" labelIcon={<UserPlus width={15} />} />
                    </UserButton.MenuItems>
                </UserButton>
            </div>
        </div>
    )
}

export default AdminNavbar