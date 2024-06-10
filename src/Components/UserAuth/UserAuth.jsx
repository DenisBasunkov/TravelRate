import { useContext, useState } from "react"
import { Avatar, Button, Carousel, Checkbox, Input, InputGroup, Modal, Text } from "rsuite"
import { FaRegCircleUser } from "react-icons/fa6";
import { IoIosLock } from "react-icons/io";
import { HiEye, HiEyeOff } from "react-icons/hi";
import stiles from "./UserAuth.module.scss"
import { AuthContext } from "../../Scripts/AuthContext";
import { CreateUser, FindeUser } from "../../Scripts/Global";
import axios from "axios";


export const UserAuth = ({ isOpen, setIsOpen }) => {

    const [Index, setIndex] = useState(0)

    const { setIsAuth } = useContext(AuthContext)

    const OnClose = () => {
        setIsOpen(false)
        setIndex(0)
    }

    const [UserAuth, setUserAuth] = useState({
        Login: "",
        Password: ""
    })

    const [Registration, setRegistration] = useState({
        User_name: "",
        Login: "",
        Password: ""
    })

    const [isSave, setIsSave] = useState(true)

    const SignIn = async (e) => {
        e.preventDefault();
        const isData = await FindeUser(UserAuth, isSave)
        if (isData) {
            setIsAuth(true)
            location.reload();
        } else {
            alert("Oib,rf ")
            // toaster.push(message, { placement: "topStart", duration: 5000 })
        }
    }

    const SignUp = async (e) => {
        e.preventDefault()
        const isData = await CreateUser(Registration)
        if (isData) {
            setIsAuth(true)
            location.reload();
        } else {
            alert("Oib,rf ")
            // toaster.push(message, { placement: "topStart", duration: 5000 })
        }
    }

    const Auth = (setIndex) => {

        const [isPassword, setIsPassword] = useState(false)

        return <div className={stiles.div_container}>
            <h1 style={{ textAlign: "center" }}>Авторизация</h1>
            <form style={{ gap: "25px" }} onSubmit={SignIn}>
                <InputGroup className={stiles.InputBlock} inside >
                    <InputGroup.Addon><FaRegCircleUser size={"1.5em"} /></InputGroup.Addon>
                    <Input required onChange={(val) => setUserAuth({ ...UserAuth, Login: val })} value={UserAuth.Login} name="Login" className={stiles.InputText} placeholder="Логин" />
                </InputGroup>
                <InputGroup inside className={stiles.InputBlock}>
                    <InputGroup.Addon><IoIosLock size={"1.5em"} /></InputGroup.Addon>
                    <Input required onChange={(val) => setUserAuth({ ...UserAuth, Password: val })} value={UserAuth.Password} name="Password" className={stiles.InputText} type={isPassword ? 'text' : 'password'} placeholder="Пароль" />
                    <InputGroup.Button onClick={() => setIsPassword(!isPassword)}>{isPassword ? <HiEye size={"1.5em"} /> : <HiEyeOff size={"1.5em"} />}</InputGroup.Button>
                </InputGroup>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Checkbox name="IsAnother" checked={isSave} onChange={(val, check) => setIsSave(check)}>Чужой комтьютер</Checkbox>
                    <Button appearance="link" onClick={() => setIndex(2)}>Забыл пароль</Button>
                </div>
                <button className={stiles.Auth_Button_Active}>Войти</button>
            </form>
            <button className={stiles.Auth_Button_Unactive} onClick={() => setIndex(1)}>Регистрация</button>
        </div>
    }

    const Register = (setIndex) => {

        const [isPassword, setIsPassword] = useState(false)

        return <div className={stiles.div_container}>
            <h1 style={{ textAlign: "center" }}>Регистрация</h1>
            <form style={{ gap: "25px" }} method="get" onSubmit={SignUp}>
                <InputGroup className={stiles.InputBlock} inside >
                    {/* <InputGroup.Addon><FaRegCircleUser size={"1.5em"} /></InputGroup.Addon> */}
                    <Input onChange={(val) => setRegistration({ ...Registration, User_name: val })} className={stiles.InputText} placeholder="Имя пользователя" />
                </InputGroup>
                <InputGroup className={stiles.InputBlock} inside >
                    <InputGroup.Addon><FaRegCircleUser size={"1.5em"} /></InputGroup.Addon>
                    <Input onChange={(val) => setRegistration({ ...Registration, Login: val })} className={stiles.InputText} placeholder="Логин" />
                </InputGroup>
                <InputGroup inside className={stiles.InputBlock}>
                    <InputGroup.Addon><IoIosLock size={"1.5em"} /></InputGroup.Addon>
                    <Input onChange={(val) => setRegistration({ ...Registration, Password: val })} className={stiles.InputText} type={isPassword ? 'text' : 'password'} placeholder="Пароль" />
                    <InputGroup.Button onClick={() => setIsPassword(!isPassword)}>{isPassword ? <HiEye size={"1.5em"} /> : <HiEyeOff size={"1.5em"} />}</InputGroup.Button>
                </InputGroup>
                <button className={stiles.Auth_Button_Active}>Регистрация</button>
            </form>
            <button className={stiles.Auth_Button_Unactive} onClick={() => setIndex(0)}>Авторизация</button>
        </div>
    }


    const ForgotPassword = (setIndex) => {

        const [Login, setLogin] = useState('')
        const [Email, setEmail] = useState('')
        const [isSuccess, setIsSuccess] = useState(false)
        const sendEmail = async (e) => {
            e.preventDefault()
            const responce = await axios({
                method: "get",
                url: "/api/user/rename_Password",
                params: {
                    Login: Login,
                    Email: Email
                },
                headers: {},
            })
            if (responce.data) {
                setIsSuccess(responce.data)
            }
        }
        return <div className={stiles.div_container}>
            <h1>Востановление пароля</h1>
            <form onSubmit={sendEmail} className={stiles.SendMail_container}>
                <Text muted style={{ width: "100%", margin: "0 auto" }}>
                    Введите логин пользователя:
                    <input className={stiles.inputSend} onChange={(e) => { setLogin(e.target.value); setUserAuth({ ...UserAuth, Login: e.target.value }) }} placeholder="Логин" required type="text" />
                </Text>
                <Text muted style={{ width: "100%", margin: "0 auto" }}>
                    Введите электронную почту на которую прийдет новый пароль:
                    <input className={stiles.inputSend} onChange={(e) => setEmail(e.target.value)} placeholder="Электронная почта" required type="email" />
                </Text>
                <button >Отправить запрос</button>
            </form>

            {
                isSuccess ? <div>
                    <form onSubmit={SignIn} className={stiles.SendMail_container}>
                        <Text muted style={{ width: "100%", margin: "0 auto" }}>
                            Введите новый пароль
                            <input className={stiles.inputSend} type="text" onChange={(e) => setUserAuth({ ...UserAuth, Password: e.target.value })} />
                        </Text>
                        <button>Войти</button>
                    </form>
                </div> :
                    null
            }

        </div>

    }

    return <Modal open={isOpen} size={"450px"}>
        <Modal.Header onClose={OnClose}></Modal.Header>
        <Modal.Body>
            <Carousel style={{ width: "90%", margin: "0px auto", backgroundColor: "white" }} activeIndex={Index} onSelect={() => none} shape="bar">

                {Auth(setIndex)}

                {Register(setIndex)}

                {ForgotPassword(setIndex)}

            </Carousel>
        </Modal.Body>
    </Modal>
}
