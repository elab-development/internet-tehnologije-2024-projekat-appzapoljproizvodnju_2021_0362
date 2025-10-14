import { Link } from "react-router-dom";

function Footer() {
    return(
        <section>
            <footer>
                <ul>
                    <li><strong>-NAVIGACIONI MENI-</strong></li>
                    <li><Link to="/">-Početna-</Link></li>
                    <li><Link to="/vrste">-Vrste-</Link></li>
                    <li><Link to="/nalog">-Nalog-</Link></li>
                    <li><Link to="/prognoza">-Prognoza-</Link></li>
                    <li><Link to="/kalendar">-Kalendar-</Link></li>
                </ul>
                <ul>
                    <li><strong>-DRUŠTVENE MREŽE-</strong></li>
                    <li><a href="https://www.facebook.com/" target="_blank">-Facebook-</a></li>
                    <li><a href="https://www.x.com/" target="_blank">-Twitter/X-</a></li>
                    <li><a href="https://www.tiktok.com/" target="_blank">-TikTok-</a></li>
                    <li><a href="https://www.instagram.com/" target="_blank">-Instagram-</a></li>
                    <li><a href="https://www.youtube.com/" target="_blank">-YouTube-</a></li>
                    <li><a href="https://www.reddit.com/" target="_blank">-Reddit-</a></li>
                </ul>
                <ul>
                    <li><Link to="/o-nama">-O NAMA-</Link></li>
                    <li><Link to="">-066 123 4567-</Link></li>
                </ul>
                <div>&copy; {new Date().getFullYear()} To-mate-o</div>
            </footer>
        </section>
    );
}

export default Footer