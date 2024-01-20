import { useDispatch } from "react-redux"
import authService from "../../appwrite/auth"
import { logout } from "../../store/authSlice"
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../index";

function LogoutBtn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        authService.logout()
            .then(() => {
                dispatch(logout());
                    
                <div className="w-full py-8 mt-4 text-center">
                    <Container>
                        <div className="flex flex-wrap">
                            <div className="p-2 w-full">
                                <h1 className="text-8xl font-bold hover:text-gray-500">
                                    Welcome to Bloggy
                                </h1>

                                <h2 className="text-6xl font-bold hover:text-gray-500 mt-40">
                                    Where you can write your daily blogs
                                </h2>
                            </div>
                        </div>
                    </Container>
                </div>

                navigate("/");


            })
    }

    return (
        <Link onClick={logoutHandler} className=" px-4 flex py-2 text-white  mx-2 hover:text-pink-400  ">Logout</Link>
    )
}

export default LogoutBtn