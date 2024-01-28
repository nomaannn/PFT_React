import React, { useState } from 'react'
import './style.css'
import Input from '../Input/Input'
import Button from '../Button/Button'
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, db, provider } from '../../firebase'
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function SignUpSignIn() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [cpassword, setCpassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [switchLogin, setSwitchLogin] = useState(true)

    const navigate = useNavigate()


    const signUpUsingEmail = () => {
        setLoading(true)
        console.log(name, email, password, cpassword)

        if (name !== '' && email !== '' && password !== '' && cpassword !== '') {
            if (password === cpassword) {
                createUserWithEmailAndPassword(auth, email, password)

                    .then((userCredential) => {
                        // Signed up 
                        const user = userCredential.user;
                        console.log("user >>>", user)
                        toast.success("User created Successfuly!!")
                        createDoc(user)
                        navigate('/dashboard')
                        setName("")
                        setEmail("")
                        setPassword("")
                        setCpassword("")
                        setLoading(false)
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        toast.error(errorMessage)
                        setLoading(false)
                    });
            } else {
                toast.error("Password and Confirm Password should be same")
                setLoading(false)
            }
        } else {
            toast.error("All Fields are mandatory!!")
            setLoading(false)
        }

    }



    const loginUsingEmail = () => {
        if (email !== '' && password !== '') {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    console.log("user >>>", user)
                    toast.success("logged In Successfully!!")


                    setEmail("")
                    setPassword("")
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage)
                });
        } else {
            toast.error("All Fields are mandatory!!")
            setLoading(false)
        }

    }



    const signUpUsingGoogle = () => {
        setLoading(true)
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                setLoading(false)
                toast.success("Login Successfully!!")
                createDoc(user)
                navigate('/dashboard')
                console.log("user>>", user)
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                toast.error(errorMessage)
                setLoading(false)
            });

    }


    const createDoc = async (user) => {
        setLoading(true);
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);

        if (!userData.exists()) {
            const { displayName, email, photoURL } = user;
            const createdAt = new Date();

            try {
                await setDoc(userRef, {
                    name: displayName ? displayName : name,
                    email,
                    photoURL: photoURL ? photoURL : "",
                    createdAt,
                });
                toast.success("Account Created!");
                setLoading(false);
            } catch (error) {
                toast.error(error.message);
                console.error("Error creating user document: ", error);
                setLoading(false);
            }
        }
    };

    return (
        <>

            {
                switchLogin ? <div className='signup_wrapper'>
                    <h2 className='title'>Sign Up on <span >Financely .</span></h2>
                    <form >
                        <Input
                            label={"Enter Full Name"}
                            type={"text"}
                            state={name}
                            setState={setName}
                            placeholder={"Enter Full Name"}
                        />
                        <Input
                            label={"Enter Email Address"}
                            type={"email"}
                            state={email}
                            setState={setEmail}
                            placeholder={"Enter Email Address"}
                        />
                        <Input
                            label={"Password"}
                            type={"password"}
                            state={password}
                            setState={setPassword}
                            placeholder={"Enter Password"}
                        />
                        <Input
                            label={"Confirm Password"}
                            type={"password"}
                            state={cpassword}
                            setState={setCpassword}
                            placeholder={"Enter Confirm Password"}
                        />
                        <Button
                            disabled={loading}
                            text={loading ? "Loading ..." : "Sign Up using Email and Password"}
                            onClick={signUpUsingEmail} />
                        <p style={{ textAlign: "center" }}>or</p>
                        <Button
                            text="Sign Up using Google"
                            blue={true}
                            onClick={signUpUsingGoogle}
                        />
                    </form>
                    <p style={{ textAlign: "center" }}>Already have a account <span onClick={() => setSwitchLogin(false)} className='loginToggle'>Login</span></p>
                </div>
                    :
                    <div className='signup_wrapper'>
                        <h2 className='title'>Login on <span >Financely .</span></h2>
                        <form >

                            <Input
                                label={"Enter Email Address"}
                                type={"email"}
                                state={email}
                                setState={setEmail}
                                placeholder={"Enter Email Address"}
                            />
                            <Input
                                label={"Password"}
                                type={"password"}
                                state={password}
                                setState={setPassword}
                                placeholder={"Enter Password"}
                            />

                            <Button
                                disabled={loading}
                                text={loading ? "Loading ..." : "Login using Email and Password"}
                                onClick={loginUsingEmail} />
                            <p style={{ textAlign: "center" }}>or</p>
                            <Button
                                text="Login using Google"
                                blue={true}
                                onClick={signUpUsingGoogle}
                            />
                        </form>
                        <p style={{ textAlign: "center" }}>Create account <span onClick={() => setSwitchLogin(true)} className='loginToggle'>Sign Up</span></p>
                    </div>
            }






        </>
    )
}

export default SignUpSignIn