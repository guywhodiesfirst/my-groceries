import { useContext, useState } from 'react'
import './Navbar.css'
import ShoppingCart from '../Modals/ShoppingCart/ShoppingCart'
import { Context } from '../../App'
import { useNavigate } from 'react-router'

export default function Navbar() {
    const [cartIsOpen, setCartIsOpen] = useState(false);
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const navigate = useNavigate()

    const handleSignOut = () => {
        if(isAuthenticated) {
            localStorage.removeItem("access_token")
            setIsAuthenticated(false)
            navigate('catalog')
        }
    }

    return (
        <nav className="navbar">
            <h1 className='navbar--logo'>my.groceries</h1>
            <ul className="navbar--menu">
                <li onClick={() => setCartIsOpen(true)}>Cart</li>
                <li><a href="/catalog">Browse catalog</a></li>
                {isAuthenticated && <li><a href="/account">Manage account</a></li>}
                {isAuthenticated ? <li onClick={handleSignOut}>Sign out</li> : <li><a href="/login">Sign in</a></li>}
            </ul>
            {cartIsOpen && (
                <ShoppingCart
                    isOpen={cartIsOpen}
                    onClose={() => setCartIsOpen(false)}
                />
            )}
        </nav>
    );
}