import { useRef, useState } from "react"
import { Button, IconButton, InlineEdit, Message, Modal, Panel, Progress, Text, toaster, useToaster } from "rsuite"
import stiles from "./RenameForm.module.scss"
import axios from "axios"


export const RenameForm = ({ isOpen, setIsOpen, data }) => {

    const toaster = useToaster();
    const [UserName, setUserName] = useState(data.User_name)
    const [UserLogin, setUserLogin] = useState(data.Login)
    const [UserBirthday, setUserBirthday] = useState(data.Birthday)
    const formRef = useRef(null);
    const ID = data.User_KEY
    const [isLoad, setIsload] = useState(false)

    const submit = async (e) => {
        setIsload(true)
        e.preventDefault()
        const dr = formRef.current
        const dataForm = new FormData(dr)
        dataForm.append('rename_type', "basic")
        dataForm.append('UserID', ID)

        const { data } = await axios({
            method: "put",
            url: "/api/user/rename_user",
            data: dataForm
        })
        if (data.status) {
            toaster.push(message(data.message, "success"), { placement: "bottomStart", duration: 3000 })
            const response = await axios({
                method: "get",
                url: "/api/user/by_id",
                params: {
                    ID: ID
                }
            })
            setTimeout(() => {
                if (sessionStorage.getItem("user")) {
                    sessionStorage.setItem("user", JSON.stringify(response.data[0]))
                } else {
                    localStorage.setItem("user", JSON.stringify(response.data[0]))
                }
                location.reload();
            }, 1000)

        } else {
            setTimeout(() => {
                setIsload(false)
                toaster.push(message(data.message, "error"), { placement: "bottomStart", duration: 3000 })
            }, 1000)

        }


        // alert(dataForm.get("UserName"))
        // alert(dataForm.get("Login"))
        // alert(dataForm.get("Birthday"))
    }
    const exit = () => { setIsOpen(false) }
    return <Modal open={isOpen} onClose={exit}>
        <Modal.Title style={{ textAlign: "center" }}><h1>Настройка основных данных</h1></Modal.Title>
        <Modal.Body>
            <form ref={formRef} className={stiles.Form_container} onSubmit={submit}>
                <Text className={stiles.input_div}>Имя пользователя:
                    <input type="text" name="UserName" defaultValue={data.User_name} />
                </Text>
                <Text className={stiles.input_div}>Логин:
                    <input type="text" name="Login" defaultValue={data.Login} />
                </Text>
                <Text className={stiles.input_div}>День рождения:
                    <input type="date" name="Birthday" defaultValue={data.Birthday} />
                </Text>
                <div className={stiles.button_container}>
                    <Button loading={isLoad} type="submit" className={stiles.button_form}>Сохранить</Button>
                    <button type="button" className={stiles.button_form} onClick={exit}>Отмена</button>
                </div>
            </form>
        </Modal.Body>
    </Modal>

}

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export const Rename_Security = ({ isOpen, setIsOpen, data, type }) => {

    const UserData = data[type]
    const formRef = useRef(null);
    const ID = data.User_KEY
    const [isLoad, setIsload] = useState(false)
    const [isPassword, setIsPassword] = useState({ oldIsPassword: true, NewPassword: true, DoubleIsPassword: true })
    const [errorPassword, setErrorPassword] = useState({
        oldIsPassword: { isError: false, messenge: '' },
        NewPassword: { isError: false, messenge: '' },
        DoubleIsPassword: { isError: false, messenge: '' }
    })
    const [lengthPass, setLengthPass] = useState(0)

    // const Is = () => {
    //     setIsPassword({ ...isPassword, oldIsPassword: !isPassword.oldIsPassword })
    // }

    const Closed = () => {
        setIsOpen(false)
        setLengthPass(0);
        setErrorPassword({
            oldIsPassword: { isError: false, messenge: '' },
            NewPassword: { isError: false, messenge: '' },
            DoubleIsPassword: { isError: false, messenge: '' }
        })
        setIsload(false)
    }

    const ReanamePassword = async () => {
        setIsload(true)
        const form = formRef.current;
        const dataPass = new FormData(form);
        dataPass.append('rename_type', "password")
        dataPass.append('UserID', ID)

        const { data } = await axios({
            method: "put",
            url: "/api/user/rename_user",
            data: dataPass
        })

        if (!data.status) {
            switch (data.pass) {
                case 1:
                    setErrorPassword((prevstate) => ({
                        ...prevstate,
                        oldIsPassword: { isError: true, messenge: data.message },
                    }))
                    break;
                default:
                    toaster.push(message(data.message, "error"), { placement: "bottomStart", duration: 4000 })
                    break;
            }
            setIsload(false)
        } else {
            setIsload(false)
            toaster.push(message(data.message, "success"), { placement: "bottomStart", duration: 3000 })
            const response = await axios({
                method: "get",
                url: "/api/user/by_id",
                params: {
                    ID: ID
                }
            })
            setTimeout(() => {
                if (sessionStorage.getItem("user")) {
                    sessionStorage.setItem("user", JSON.stringify(response.data[0]))
                } else {
                    localStorage.setItem("user", JSON.stringify(response.data[0]))
                }
                location.reload();
            }, 1000)

        }
    }

    const RenameMail = async () => {
        setIsload(true)
        const form = formRef.current;
        const dataPass = new FormData(form);
        dataPass.append('rename_type', "Email")
        dataPass.append('UserID', ID)

        const { data } = await axios({
            method: "put",
            url: "/api/user/rename_user",
            data: dataPass
        })
        if (data.status) {
            setIsload(false)
            toaster.push(message(data.message, "success"), { placement: "bottomStart", duration: 3000 })
            const response = await axios({
                method: "get",
                url: "/api/user/by_id",
                params: {
                    ID: ID
                }
            })
            setTimeout(() => {
                if (sessionStorage.getItem("user")) {
                    sessionStorage.setItem("user", JSON.stringify(response.data[0]))
                } else {
                    localStorage.setItem("user", JSON.stringify(response.data[0]))
                }
                location.reload();
            }, 1000)
        }

    }

    const Valid_password = (e) => {
        const text = e.target.value
        setLengthPass(text.length * 10)
        const form = formRef.current;
        const dataPass = new FormData(form);
        const pass = dataPass.get("DoublePassword")
        if (text.length == 0) {
            setErrorPassword((prevstate) => ({
                ...prevstate,
                NewPassword: { isError: false, messenge: 'Пароли не совпадают' },
                DoubleIsPassword: { isError: false, messenge: 'Пароли не совпадают' }
            }))

        } else {
            if (text.length < 5) {
                setErrorPassword((prevstate) => ({
                    ...prevstate,
                    NewPassword: { isError: true, messenge: 'Пароль слишком короткий' },
                }))
            }
            if (text.length > 5) {
                setErrorPassword((prevstate) => ({
                    ...prevstate,
                    NewPassword: { isError: false, messenge: 'Пароль слишком короткий' },
                }))
            }
        }
        if (pass !== e.target.value) {

            setErrorPassword((prevstate) => ({
                ...prevstate,
                DoubleIsPassword: { isError: true, messenge: 'Пароли не совпадают' }
            }))
        } else {
            setErrorPassword((prevstate) => ({
                ...prevstate,
                DoubleIsPassword: { isError: false, messenge: 'Пароли не совпадают' }
            }))
        }

    }

    const valid_Double_password = (e) => {
        const form = formRef.current;
        const dataPass = new FormData(form);
        const pass = dataPass.get("Password")
        if (pass !== e.target.value) {

            setErrorPassword((prevstate) => ({
                ...prevstate,
                DoubleIsPassword: { isError: true, messenge: 'Пароли не совпадают' }
            }))
        } else {
            setErrorPassword((prevstate) => ({
                ...prevstate,
                DoubleIsPassword: { isError: false, messenge: 'Пароли не совпадают' }
            }))
        }
    }

    const RenamePhone = async () => {
        // setIsload(true)
        const form = formRef.current;
        const dataPass = new FormData(form);
        dataPass.append('rename_type', "Phone")
        dataPass.append('UserID', ID)

        const { data } = await axios({
            method: "put",
            url: "/api/user/rename_user",
            data: dataPass
        })
        if (data.status) {
            setIsload(false)
            toaster.push(message(data.message, "success"), { placement: "bottomStart", duration: 3000 })
            const response = await axios({
                method: "get",
                url: "/api/user/by_id",
                params: {
                    ID: ID
                }
            })
            setTimeout(() => {
                if (sessionStorage.getItem("user")) {
                    sessionStorage.setItem("user", JSON.stringify(response.data[0]))
                } else {
                    localStorage.setItem("user", JSON.stringify(response.data[0]))
                }
                location.reload();
            }, 1000)
        }

    }

    const submit = (e) => {
        e.preventDefault()
        switch (type) {
            case "Password":
                ReanamePassword()
                break;
            case "Email":
                RenameMail()
                break;
            case "Phone":
                RenamePhone()
                break;

            default:
                break;
        }
    }

    const typeForm = (type) => {
        switch (type) {
            case "Email":
                return <div className={stiles.input_div}>
                    <h2>Замена электронной почты</h2>
                    <Panel bordered>
                        <Text className={stiles.input_div}>
                            Введите электонную почту
                            <input type="email" placeholder="e-Mail" required name={type} defaultValue={UserData} />
                        </Text>
                    </Panel>
                </div>

            case "Password":
                return <div className={stiles.input_div}>
                    <h1>Замена пароля</h1>
                    <Panel bordered>
                        <Text className={stiles.input_div}>
                            Введите старый пароль
                            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "90% 10%", gap: "5px" }}>
                                <input placeholder="Старый пароль" required type={isPassword.oldIsPassword ? "password" : "text"} name={"OldPassword"} />
                                <IconButton icon={isPassword.oldIsPassword ? <FaRegEyeSlash /> : < FaRegEye />} onClick={() => setIsPassword({ ...isPassword, oldIsPassword: !isPassword.oldIsPassword })} />
                            </div>
                            <label style={{ color: "red", fontSize: "12px" }}>{errorPassword.oldIsPassword.isError ? errorPassword.oldIsPassword.messenge : null}</label>
                        </Text >
                        <Text className={stiles.input_div}>
                            Введите новый пароль
                            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "90% 10%", gap: "5px" }}>
                                <input onChange={Valid_password} placeholder="Новый пароль" required type={isPassword.NewPassword ? "password" : "text"} name={"Password"} />
                                <IconButton icon={isPassword.NewPassword ? <FaRegEyeSlash /> : < FaRegEye />} onClick={() => {
                                    setIsPassword({ ...isPassword, NewPassword: !isPassword.NewPassword })
                                }} />
                            </div>
                            <Progress.Line percent={lengthPass} status={errorPassword.NewPassword.isError ? "fail" : "success"} showInfo={lengthPass == 0 ? false : !errorPassword.NewPassword.isError} />
                            <label style={{ color: "red", fontSize: "12px" }}>{errorPassword.NewPassword.isError ? errorPassword.NewPassword.messenge : null}</label>
                        </Text>
                        <Text className={stiles.input_div}>
                            Введите пароль повторно
                            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "90% 10%", gap: "5px" }}>
                                <input onChange={valid_Double_password} placeholder="Повтор пароля" required type={isPassword.DoubleIsPassword ? "password" : "text"} name={"DoublePassword"} />
                                <IconButton icon={isPassword.DoubleIsPassword ? <FaRegEyeSlash /> : < FaRegEye />} onClick={() => setIsPassword({ ...isPassword, DoubleIsPassword: !isPassword.DoubleIsPassword })} />
                            </div>
                            <label style={{ color: "red", fontSize: "12px" }}>{errorPassword.DoubleIsPassword.isError ? errorPassword.DoubleIsPassword.messenge : null}</label>
                        </Text>
                    </Panel>
                </div>
            case "Phone":
                return <div className={stiles.input_div}>
                    <h1>Замена телефона</h1>
                    <Panel bordered>
                        <Text className={stiles.input_div}>
                            Введите номер телефона<br />Пример ввода: "+7(000)-000-0000"
                            <input
                                type="tel"
                                pattern="\+[0-9]{1}\([0-9]{3}\)-[0-9]{3}-[0-9]{4}"
                                placeholder="+7(000)-000-0000"
                                required
                                name={type}
                                defaultValue={UserData}
                            />
                        </Text>
                    </Panel>
                </div>
            default:
                break;
        }
    }

    return <Modal open={isOpen} onClose={Closed} size={"450px"}>
        <Modal.Body>
            <form ref={formRef} className={stiles.Form_container} onSubmit={submit} >
                {typeForm(type)}
                <div className={stiles.button_container}>
                    <Button loading={isLoad} type="submit" className={stiles.button_form}>Сохранить</Button>
                    <button type="button" className={stiles.button_form} onClick={Closed}>Отмена</button>
                </div>
            </form>
        </Modal.Body>

    </Modal>

}

const message = (mess_text, type) => {
    return <Message type={type} showIcon closable>
        <Text muted>{mess_text}</Text>
    </Message>
}