import { useContext } from "react"
import { Avatar, Button, Divider, Drawer } from "rsuite"
import { AuthContext } from "../../Scripts/AuthContext"
import { useLocation } from "react-router-dom"
import styles from "./Drawer.module.scss"
import { ImProfile } from "react-icons/im";
import { MdAddLocationAlt } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
export const Drawers = ({ isOpen, setIsOpen }) => {

    const data = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user")) || {}
    const { isAuth, setIsAuth } = useContext(AuthContext)


    const ID = data.User_KEY;

    const Exit_User = () => {

        setIsAuth(false)
        sessionStorage.removeItem("favorite_list")
        sessionStorage.removeItem("user");
        localStorage.removeItem("user")
        setIsOpen(false)
        if (location.pathname.includes(ID)) {
            window.location.href = "/Места"
        } else {
            location.reload();
        }
        // if (locations.pathname === "/user_info" || locations.pathname === '/user_info/favorite') {
        //     navigation("/")
        // }
        // // sessionStorage.removeItem('search_point')
    }

    return <Drawer open={isOpen} onClose={() => setIsOpen(false)} backdrop="static" size={"xs"}>
        <Drawer.Body>
            <div className={styles.User_info}>
                <Avatar src={`/api${data.Foto}`} style={{ outline: "5px solid #0087D1", outlineOffset: "5px" }} size="xxl" circle />
                <h1>{data.User_name}</h1>
            </div>
            <Divider></Divider>
            <div className={styles.btn_menu}>
                <button className={styles.Button} onClick={() => window.location.href = `/${data.User_KEY}/profile`}><ImProfile size={'1.5em'} /> Профиль</button>
                <button className={styles.Button} onClick={() => window.location.href = `/${data.User_KEY}/addPoint`}><MdAddLocationAlt size={'1.5em'} />Добавить место</button>
                <button className={styles.Button} onClick={Exit_User}><IoMdExit size={'1.5em'} />Выйти</button>
            </div>

        </Drawer.Body>
    </Drawer>

}