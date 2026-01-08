
import { Link } from "react-router-dom";

export default function Logo() {
    const logoSrc = "/logo/logo-2.svg";
    return (
        <Link to="https://wikitruth.eth.limo">
            <div className="flex items-center gap-2">
                <img src={logoSrc} alt="logo" width={36} height={36} />
                <div className="hidden md:block items-center">
                    <h5 className="text-theme text-sm md:text-base lg:text-lg font-brand">Wiki Truth</h5>
                </div>
            </div>
        </Link>
    );
}


