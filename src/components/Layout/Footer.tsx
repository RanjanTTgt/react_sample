import { Link } from "react-router-dom";
import { Copyright } from ".";

export const Footer = () =>{
    return(
        <div className="footer-bottom position-fixed bottom-0 w-100">
            <div className="row">
                <Copyright />
                <div className="col-sm-6 text-end">
                    <Link to={"#"}>Terms & Conditions</Link> | <Link to={"#"}>Privacy Policy</Link>
                </div>
            </div>
        </div>
    )
}
