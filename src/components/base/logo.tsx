
import { Link } from "react-router-dom";
import TitleBrand from "./titleBrand";

export default function Logo() {
    const logoSrc = "/logo/logo-8-2-37.svg";
    return (
        <Link to="/">
            <div className="flex items-center gap-2">
                <img src={logoSrc} alt="logo" width={36} height={36} />
                <div className="hidden md:block items-center">
                    <TitleBrand size="h4" align="left"  lineHeight="normal" tracking="normal">Wiki Truth</TitleBrand>
                </div>
            </div>
        </Link>
    );
}


