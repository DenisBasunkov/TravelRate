import { BiLogoVk, BiLogoInstagram, BiLogoTelegram } from "react-icons/bi";
import { FaTelegramPlane } from "react-icons/fa";
import stiles from "./Footer.module.scss"
import { Text } from "rsuite"

export const Footer = () => {

    const HrefSite = (url) => {
        window.open(url)
    }

    return <div className={stiles.Footer_container}>
        <div className={stiles.Footer_con_info} >
            <p style={{ gridArea: "text" }}><h4>Travel Raters</h4> это ваш надежный источник для планирования незабываемых путешествий. Мы стремимся предоставить актуальную и достоверную информацию, чтобы каждый ваш отдых был полон ярких впечатлений и положительных эмоций.</p>
            <div style={{ gridArea: "list" }}>
                <h4>Контакты</h4>
                <ul>
                    <li>Электронная почта: support@travelraters.com</li>
                    <li>Телефон: +1 (800) 123-4567</li>
                    <li>Адрес: 1234 Main Street, Suite 500, Anytown, USA</li>
                </ul>
            </div>
        </div>
        <div style={{ backgroundColor: "gray", width: "100%", height: "1px" }} />
        <div className={stiles.Footer_con_div}>
            <Text muted size={"md"}>© 2024 Travel Raters. Все права защищены.</Text>
            <div></div>
            <div style={{ display: "flex", justifyContent: "right", gap: "15px" }}>
                <button className={stiles.button_sochial} onClick={() => HrefSite("https://vk.com/d.basunkov")}>
                    <BiLogoVk size={"1.5em"} />
                </button>
                <button className={stiles.button_sochial}>
                    <BiLogoInstagram size={"1.5em"} />
                </button>
                <button className={stiles.button_sochial}>
                    <FaTelegramPlane size={"1.5em"} />
                </button>
            </div>
        </div>
    </div>

}