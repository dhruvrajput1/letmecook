import { Link } from "react-router-dom"

function Footer() {

    const currYear = new Date().getFullYear();

    return (
        <div className="flex justify-center m-auto">
            <p className="text-sm text-white text-center">
                &copy; Copyright {currYear}. All Rights Reserved by <Link className="text-pink-500 hover:text-orange-500 " target="_blank" to="https://dhruvrajput.netlify.app">Dhruv Rajput</Link>.
            </p>
        </div>

    )
}

export default Footer;