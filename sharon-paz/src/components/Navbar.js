
// Import pages
import { Link } from "react-router-dom";

function Navbar(){
    return (
        <nav>
            <ul>
                <li><Link to="/student">כניסה כתלמיד</Link></li>
                <li><Link to="/admin">כניסה כמנהל</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;