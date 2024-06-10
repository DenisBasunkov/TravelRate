import { useContext, useEffect, useState } from "react"
import stiles from "./Header.module.scss"
import { AuthContext } from "../../Scripts/AuthContext"
import { Avatar } from "rsuite"
import { UserAuth } from "../UserAuth/UserAuth"
import { Get_all_type } from "../../Scripts/Global"
import { Drawers } from "../Drawer/Drawer"

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

    return <div className={stiles.Header_container}>
        <div style={{ alignItems: "center", display: "flex", fontSize: "25px", textDecoration: "none", color: "aliceblue" }}>
            <img src="/logo.svg" width={80} alt="" />
            <h4 onClick={() => window.location.href = "/"}>Travel Raters</h4>
        </div>
        <div className={stiles.Header_nav_btn}>

            <a className={stiles.nav_btn} href={`/Места`}>Места</a>

        </div>
        <div>
            {
                !isAuth ? <button onClick={AuthOpen} className={stiles.User_button}>Вход</button>
                    : <Avatar style={{ outline: "2px solid #fff", outlineOffset: "2px" }} onClick={DrawerOpen} circle size="md" src={"/api" + UserData.Foto} />
            }
        </div>
        <UserAuth isOpen={isOpenAuth} setIsOpen={setIsOpenAuth} />
        <Drawers isOpen={isOpenDrawer} setIsOpen={setIsOpenDrawer} />
    </div>

}