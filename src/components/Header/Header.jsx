import React, { useEffect } from 'react'
import './style.css'
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { toast } from 'react-toastify';


function Header() {

    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate()


    useEffect(() => {
        if (user) {
            console.log(user)
            navigate("/dashboard")
        }
    }, [user, loading])

    const logout = () => {
        signOut(auth).then(() => {
            toast.success("Logout Successfully!!")
            navigate("/")
        }).catch((error) => {
            toast.error(error.message)
        });
    }
    return (
        <div className='navbar'>
            <p className='logo'>Financely .</p>
            {

                user && <div className='logout_wrapper'>
                    <img src={user.photoURL} alt='#' height={30} />
                    <p className='logo link' onClick={logout}>Logout</p>
                </div>
            }
        </div>
    )
}

export default Header