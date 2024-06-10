import { IoBookmarks } from "react-icons/io5";
import stiles from "./User.module.scss"
import { Accordion, Badge, Button, Divider, IconButton, InlineEdit, Input, Message, Modal, Panel, PanelGroup, Tabs, Text } from "rsuite";
import { FaMapLocationDot } from "react-icons/fa6";
import { LuPenSquare } from "react-icons/lu";
import { MdAlternateEmail } from "react-icons/md";
import { EditAvatar } from "../../Components/EditUser/EditUser";
import { useContext, useState } from "react";
import { AuthContext } from "../../Scripts/AuthContext"
import { IoPersonRemove } from "react-icons/io5";
import { IoInformationCircleSharp, IoBookmark } from "react-icons/io5";
import axios from "axios";
import { FavoriteList } from "../../Components/FavoriteList/FavoriteList";
import { Pane } from "react-leaflet";
import { FaArrowRightLong } from "react-icons/fa6";
import { RenameForm, Rename_Security } from "../../Components/RenameForm/RenameForm";

export const User_page = () => {

    const data = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user"))

    const favorite = JSON.parse(sessionStorage.getItem("favorite_list"))
    const [isOpenAvatar, setIsOpenAvatar] = useState(false)
    const [isOpenMess, setIsOpenMess] = useState(false)
    const [isOpenRename, setIsOpenRename] = useState(false)
    const [isOpenSecRename, setIsOpenSecRename] = useState(false)
    const { isAuth, setIsAuth } = useContext(AuthContext)
    const [tabIndex, setTabIndex] = useState('info')
    const [TypeRename, setTypeRename] = useState("")

    const DeleteUser = async () => {
        const ID = data.User_KEY
        const file = data.Foto;
        setIsOpenMess(false)

        const response = await axios({
            method: "delete",
            url: "/api/user/delete_by_id",
            params: {
                UserID: ID,
                file: file
            },
            headers: {},
        })

        if (response.data) {
            localStorage.removeItem("user")
            sessionStorage.removeItem("user")
            location.href = "/"
        }

    }

    return <>

        <div className={stiles.User_fone} />
        <div className={stiles.User_info}>

            <div className={stiles.User_card}>
                <div className={stiles.User_avatar}>
                    <img src={'/api' + data.Foto} alt="" />
                    <div onClick={() => setIsOpenAvatar(true)}><LuPenSquare size={"2em"} /></div>
                </div>
                <h3>{data.User_name}</h3>
                <div className={stiles.Btn_list}>

                    <Button onClick={() => setTabIndex("favorite")} className={stiles.Button_rate} ><IoBookmarks style={{}} size={"2em"} color="red" />{favorite.length}</Button>
                    {/* <Button className={stiles.Button_rate} ><FaMapLocationDot style={{}} size={"2em"} color="orange" /> 56</Button> */}
                </div>
                <Button onClick={() => setIsOpenMess(true)} startIcon={<IoPersonRemove size={"1.5em"} />}>Удалить аккаунт</Button>
            </div>


            <Tabs vertical
                className={stiles.User_info_container}
                activeKey={tabIndex}
                onSelect={setTabIndex}
                appearance="subtle"
            >
                <Tabs.Tab title="Информация" eventKey="info" icon={<IoInformationCircleSharp size={"1.5em"} />}>
                    {/* <div className={stiles.User_info_header}>
                        <Button startIcon={<LuPenSquare />} />
                    </div> */}

                    <Panel bordered  >
                        <Text muted> <h2>Основные данные</h2></Text>
                        <div className={stiles.panel_info}>
                            <Text>Имя пользователя:<br />
                                <h4>{data.User_name}</h4>
                            </Text>
                            <Text>Логин:
                                <br />
                                <h4>{data.Login}</h4></Text>
                            <Text>День рождения:<br />
                                <h4>{data.Birthday !== null ? data.Birthday : "Нет данных"}</h4>
                            </Text>
                        </div>
                        <hr />
                        <Button onClick={() => setIsOpenRename(true)} appearance="link" className={stiles.header_panel}>Настроить основные данные <FaArrowRightLong /></Button>
                    </Panel>
                    <Panel bordered style={{ margin: "5px auto" }}>
                        <Text muted><h2>Безопасность</h2></Text>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start", gap: "5px", marginBottom: "15px" }}>
                            <Text>Электронная почта:<br /><h4>{data.Email !== null ? data.Email : "Нет данных"}</h4></Text>
                            <button onClick={() => { setIsOpenSecRename(true); setTypeRename("Email") }} className={stiles.btn_setting}>Изменить</button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start", gap: "5px", marginBottom: "15px" }}>
                            <Text>Пароль: {"•".repeat(12)}</Text>
                            <button onClick={() => { setIsOpenSecRename(true); setTypeRename("Password") }} className={stiles.btn_setting}>Изменить</button>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "start", gap: "5px", marginBottom: "15px" }}>
                            <Text>Телефон:<br /> <h4>{data.Phone !== null ? data.Phone : "Нет данных"}</h4></Text>
                            <button onClick={() => { setIsOpenSecRename(true); setTypeRename("Phone") }} className={stiles.btn_setting}>Изменить</button>
                        </div>
                    </Panel>

                </Tabs.Tab>
                <Tabs.Tab title="Избранные места" eventKey="favorite" icon={<IoBookmark size={"1.5em"} color="red" />}>
                    <FavoriteList ID={data.User_KEY} />
                </Tabs.Tab>
            </Tabs>


        </div >

        <MessRemove isOpen={isOpenMess} setIsOpen={setIsOpenMess} DeleteUser={DeleteUser} />
        <RenameForm isOpen={isOpenRename} setIsOpen={setIsOpenRename} data={data} />
        <EditAvatar isOpen={isOpenAvatar} setIsOpen={setIsOpenAvatar} UserData={data} />
        <Rename_Security isOpen={isOpenSecRename} setIsOpen={setIsOpenSecRename} data={data} type={TypeRename} />
    </>

}

const MessRemove = ({ isOpen, setIsOpen, DeleteUser }) => {

    return <Modal open={isOpen} size={"sm"} onClose={() => setIsOpen(false)} backdrop='true'>
        <Modal.Body>
            <Message centered showIcon type="warning" header={<h2>Вы уверены, что хотите удалить свой аккаунт?</h2>}>
                Это действие не может быть отменено, и вся ваша информация
                будет безвозвратно утрачена. Пожалуйста, подтвердите своё решение.
            </Message>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={DeleteUser} color="red" appearance="primary">Удалить аккаунт</Button>
            <Button appearance="subtle" onClick={() => setIsOpen(false)}>Отмена</Button>
        </Modal.Footer>
    </Modal>

}