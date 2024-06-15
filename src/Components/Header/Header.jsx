import { useContext, useEffect, useState } from "react"
import stiles from "./Header.module.scss"
import { AuthContext } from "../../Scripts/AuthContext"
import { Avatar, Badge, Divider, Nav, Navbar } from "rsuite"
import { UserAuth } from "../UserAuth/UserAuth"
import { Get_all_type } from "../../Scripts/Global"
import { Drawers } from "../Drawer/Drawer"
import { ImProfile } from "react-icons/im"
import { IoMdExit } from "react-icons/io"
import { MdAddLocationAlt } from "react-icons/md"
import { FaMapLocationDot } from "react-icons/fa6";

export const Header = () => {

    const { isAuth, setIsAuth } = useContext(AuthContext)
    const [isOpenAuth, setIsOpenAuth] = useState(false)
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const UserData = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user')) || {}

    const AuthOpen = () => {
        setIsOpenAuth(true)
    }

    const DrawerOpen = () => {
        setIsOpenDrawer(true)
    }

    const favor = JSON.parse(sessionStorage.getItem("favorite_list"))

    const ID = UserData.User_KEY;

    const Exit_User = () => {
        setIsAuth(false)
        sessionStorage.removeItem("favorite_list")
        sessionStorage.removeItem("user");
        localStorage.removeItem("user")
        if (location.pathname.includes(ID)) {
            window.location.href = "/Места"
        } else {
            location.reload();
        }
    }

    // return <div className={stiles.Header_container} style>
    // display: grid;
    // grid-template-columns: .5fr 2fr .2fr;
    // align-items: center;
    //     <div style={{ alignItems: "center", display: "flex", fontSize: "25px", textDecoration: "none", color: "aliceblue" }}>
    //         <img src="/logo.svg" width={80} alt="" />
    //         <h4 onClick={() => window.location.href = "/"}>Travel Raters</h4>
    //     </div>
    //     <div className={stiles.Header_nav_btn}>

    //         <a className={stiles.nav_btn} href={`/Места`}>Места</a>

    //     </div>

    //     <div>
    //         {
    //             !isAuth ? <button onClick={AuthOpen} className={stiles.User_button}>Вход</button>
    //                 : <Avatar style={{ outline: "2px solid #fff", outlineOffset: "2px" }} onClick={DrawerOpen} circle size="md" src={"/api" + UserData.Foto} />
    //         }
    //     </div>

    //     <UserAuth isOpen={isOpenAuth} setIsOpen={setIsOpenAuth} />
    //     <Drawers isOpen={isOpenDrawer} setIsOpen={setIsOpenDrawer} />
    // </div>

    return <Navbar className={stiles.Header_container} appearance="subtle">
        <Navbar.Brand href="/" style={{ alignItems: "center", display: "flex", fontSize: "25px", textDecoration: "none", color: "aliceblue" }}><img src="/logo.svg" width={80} alt="" />
            <h4>Travel Raters</h4>
        </Navbar.Brand>
        <Nav pullRight className={stiles.NavMenu}>
            {/* onClick={DrawerOpen} */}
            {
                !isAuth ? <Nav.Item onClick={AuthOpen} className={stiles.NavSign}>Вход</Nav.Item>
                    : <Nav.Menu className={stiles.disNav} placement="bottomEnd" noCaret title={<Avatar style={{ outline: "2px solid #fff", outlineOffset: "2px" }} circle size="md" src={"/api" + UserData.Foto} />}>
                        <Nav.Item onClick={() => window.location.href = `/${UserData.User_KEY}/profile`} icon={<ImProfile size={'1.5em'} />}>Профиль</Nav.Item>
                        <Nav.Item onClick={Exit_User} icon={<IoMdExit size={'1.5em'} />}>Выйти</Nav.Item>

                    </Nav.Menu>
            }
        </Nav>
        <Nav
            className={stiles.NavMenu}
            appearance="default"
        >
            <Nav.Item className={stiles.NavBtn} href="/Места" icon={<FaMapLocationDot size={"1.5em"} />}>Места</Nav.Item>
            {
                isAuth ? <Nav.Item className={stiles.NavBtn} href={`/${UserData.User_KEY}/addPoint`} icon={<MdAddLocationAlt size={'1.5em'} />}>Добавить место</Nav.Item> : null
            }

        </Nav>

        <UserAuth isOpen={isOpenAuth} setIsOpen={setIsOpenAuth} />
        <Drawers isOpen={isOpenDrawer} setIsOpen={setIsOpenDrawer} />
    </Navbar>

}