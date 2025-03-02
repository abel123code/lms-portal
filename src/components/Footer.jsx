import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="w-full py-6 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                {/* <Image src="/placeholder.svg" alt="LMS Logo" width={32} height={32} /> */}
                <p className="text-center text-sm leading-loose text-gray-600 dark:text-gray-400 md:text-left">
                    © 2023 TuitionLMS. All rights reserved.
                </p>
                </div>
                <nav className="flex gap-4 sm:gap-6">
                <p className="text-sm hover:underline underline-offset-4">
                    Email: binghengabellee@gmail.com
                </p>
                <Link 
                    className="text-sm hover:underline underline-offset-4" 
                    href="https://www.linkedin.com/in/abel-lee01" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >
                    LinkedIn Profile
                </Link>

                {/* <Link className="text-sm hover:underline underline-offset-4" href="#">
                    About Us
                </Link>
                <Link className="text-sm hover:underline underline-offset-4" href="#">
                    Privacy Policy
                </Link>
                <Link className="text-sm hover:underline underline-offset-4" href="#">
                    Terms of Service
                </Link>
                <Link className="text-sm hover:underline underline-offset-4" href="#">
                    Contact
                </Link> */}
                </nav>
            </div>
        </div>
    </footer>
  )
}

export default Footer