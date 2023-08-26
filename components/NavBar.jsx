import Link from 'next/link'
import { useState } from 'react'
import {
  FaHome,
  FaPlus,
  FaImages,
  FaTachometerAlt,
  FaBars,
} from 'react-icons/fa'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='bg-white p-4 border fixed top-0 left-0 w-full z-10 shadow-sm hover:shadow-lg'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center'>
          <div className='text-black text-2xl ml-4'>
            NFT{` `}
            <span className='text-2xl font-semibold text-pink-500'>
              MarketPlace
            </span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-pink-500 lg:hidden'
          >
            <FaBars />
          </button>
          <ul className='lg:flex lg:gap-3 lg:mr-4 space-x-0 lg:space-x-4 mt-4 lg:mt-0 hidden'>
            <li className='mb-2 lg:mb-0'>
              <Link
                href='/'
                className='text-pink-500 hover:text-pink-300 flex items-center space-x-2'
              >
                <FaHome />
                <span>Home</span>
              </Link>
            </li>
            <li className='mb-2 lg:mb-0'>
              <Link
                href='/create-nft'
                className='text-pink-500 hover:text-pink-300 flex items-center space-x-2'
              >
                <FaPlus />
                <span>Create NFT</span>
              </Link>
            </li>
            <li className='mb-2 lg:mb-0'>
              <Link
                href='/my-nfts'
                className='text-pink-500 hover:text-pink-300 flex items-center space-x-2'
              >
                <FaImages />
                <span>My NFTs</span>
              </Link>
            </li>
            <li className='mb-2 lg:mb-0'>
              <Link
                href='/creator-dashboard'
                className='text-pink-500 hover:text-pink-300 flex items-center space-x-2'
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>
            </li>
          </ul>
        </div>

        <div
          className={`transition-max-height duration-700 overflow-hidden ${
            isOpen ? 'max-h-96' : 'max-h-0'
          } lg:max-h-full`}
        >
          <ul className='lg:hidden space-x-0 lg:space-x-4 mt-4 lg:mt-0'>
            <li className='mb-2 lg:mb-0'>
              <Link
                href='/'
                className='text-pink-500 hover:text-pink-300 flex items-center space-x-2'
                onClick={() => setIsOpen(false)}
              >
                <FaHome />
                <span>Home</span>
              </Link>
            </li>
            <li className='mb-2 lg:mb-0'>
              <Link
                href='/create-nft'
                className='text-pink-500 hover:text-pink-300 flex items-center space-x-2'
                onClick={() => setIsOpen(false)}
              >
                <FaPlus />
                <span>Create NFT</span>
              </Link>
            </li>
            <li className='mb-2 lg:mb-0'>
              <Link
                href='/my-nfts'
                className='text-pink-500 hover:text-pink-300 flex items-center space-x-2'
                onClick={() => setIsOpen(false)}
              >
                <FaImages />
                <span>My NFTs</span>
              </Link>
            </li>
            <li className='mb-2 lg:mb-0'>
              <Link
                href='/creator-dashboard'
                className='text-pink-500 hover:text-pink-300 flex items-center space-x-2'
                onClick={() => setIsOpen(false)}
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
