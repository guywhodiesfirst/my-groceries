import { useState } from 'react'
import './Navbar.css'
import ShoppingCart from '../Modals/ShoppingCart/ShoppingCart'

export default function Navbar() {
    const [cartIsOpen, setCartIsOpen] = useState(false)
    
    return (
        <nav className="navbar">
            <h1 className='navbar--logo'>my.groceries</h1>
            <ul className="navbar--menu">
                <li onClick={() => setCartIsOpen(true)}>Cart</li>
                <li><a href="/catalog">Browse catalog</a></li>
                <li><a href="/account">Manage account</a></li>
                <li><a href="/login">Sign in</a></li>
            </ul>
            {cartIsOpen && (
                <ShoppingCart
                    isOpen={cartIsOpen}
                    onClose={() => setCartIsOpen(false)}
                />
            )}
        </nav>
    )
}