import { useRef, useState } from "react"
import { Avatar, Button, ButtonGroup, ButtonToolbar, IconButton, Loader, Modal, Timeline } from "rsuite"
import { MdAddAPhoto } from "react-icons/md";
import styles from "./EditUser.module.scss"
import axios from "axios";
import { MdRadioButtonChecked } from "react-icons/md";

export const EditAvatar = ({ isOpen, setIsOpen, UserData }) => {

    const refAvatar = useRef(null)

    const [Image, setImage] = useState(null)
    const [PrevImage, setPrevImage] = useState(null)
    const [isLoadingFile, setIsLoadingFile] = useState(false)

    const HandelImg = (e) => {
        setImage(null)
        setPrevImage(null)
        const images = e.target.files[0];
        const previews = {
            e,
            previewURL: URL.createObjectURL(images)
        };
        setImage(images)
        setPrevImage(previews)
    }

    const handleUploadChange = async () => {
        setIsLoadingFile(true)
        const timer = setTimeout(async () => {
            try {
                const User = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"))
                const append = Image.name.split('.').pop();
                const newName = `${User.User_KEY}.${append}`
                const img = new File([Image], newName, { type: Image.type })
                const formData = new FormData();
                formData.append('file', img);

                const response = await axios({
                    method: "post",
                    url: `/api/images/avatar/upload`,
                    data: formData,
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                const f = response.data
                if (sessionStorage.getItem("user")) {
                    User.Foto = f.newPath
                    sessionStorage.setItem("user", JSON.stringify(User))
                } else {
                    User.Foto = f.newPath
                    localStorage.setItem("user", JSON.stringify(User))
                }

                setIsLoadingFile(!f.valid)
            } catch (err) {
                setIsLoadingFile(false)
            } finally {
                location.reload();
            }
        }, 500)
        return () => clearTimeout(timer)

    };

    return <Modal open={isOpen} onClose={() => setIsOpen(false)} size={'xs'} overflow={false}>
        <input type="file" style={{ display: "none" }} ref={refAvatar} onChange={HandelImg} accept="image/*,.png,.jpg,.web,.jpeg" />
        <Modal.Body style={{ height: "60vh" }}>
            {
                isLoadingFile ? <Loader size="lg" center backdrop inverse content="Загрузка изображения..." /> : <div style={{ display: "flex", flexDirection: "column", gap: "25px", alignItems: "center", justifyContent: "center" }}>
                    <div className={styles.Img_container}>
                        {
                            PrevImage != null ? <img src={PrevImage.previewURL} /> :
                                <img src={`/api${UserData.Foto}`} />
                        }
                        <div className={styles.btn_upload} onClick={() => refAvatar.current.click()}  ><MdAddAPhoto size={"2.5em"} /></div>
                    </div>
                    <div >
                        <h3>Пожалуйста, выберите новую аватарку для вашего профиля. </h3>
                        <Timeline style={{ paddingTop: "15px" }} isItemActive={Timeline.ACTIVE_FIRST}>
                            <Timeline.Item >
                                Поддерживаемые форматы: PNG, JPG, WEB, JPEG.
                            </Timeline.Item>
                            <Timeline.Item >
                                Максимальный размер файла: 5 МБ.
                            </Timeline.Item>
                            <Timeline.Item >
                                Имя картинки не должно содержать точек.
                            </Timeline.Item>
                        </Timeline>
                        <div style={{ margin: "15px auto 0", float: "right", gap: "5px", display: "flex" }} >

                            <Button appearance="primary" onClick={handleUploadChange}>Звгрузить</Button>
                            <Button onClick={() => setIsOpen(false)}>Отмена</Button>

                        </div>
                    </div>
                </div>
            }
        </Modal.Body>
    </Modal >
}