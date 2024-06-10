import { useContext, useEffect, useRef, useState } from "react"
import { Get_comment_by_point_id } from "../../Scripts/Global"
import { Accordion, Avatar, Button, Divider, Heading, HeadingGroup, IconButton, Input, Modal, Radio, RadioGroup, Rate, Text, Uploader } from "rsuite"
import { FaFrown, FaMeh, FaSmile } from "react-icons/fa"
import styles from './CommentList.module.scss';
import _ from "lodash";
import { BiCommentAdd } from "react-icons/bi";

export const CommentList = ({ ID }) => {
    const [dataComment, setDataComment] = useState([])
    const [stateDataComment, setStateDataComment] = useState([])
    const { isAuth } = useContext(AuthContext)
    const ComItems = ['Date_Reviews', 'Rating_Reviews'];
    const [orderBy, setOrderBy] = useState(['asc', 'asc'])

    useEffect(() => {
        const timer = setTimeout(async () => {
            setDataComment(await Get_comment_by_point_id(ID))
            setStateDataComment(await Get_comment_by_point_id(ID))
            // ((dataComment, ComItems, orderBy))
        }, 2000)

        return () => { clearTimeout(timer); }
    }, [ID])

    const CommentOrderBy = () => {
        setDataComment(_.orderBy(dataComment, ComItems, orderBy))
    }

    const [DateOrBy, setDateOrBy] = useState('all')
    const [RateOrBy, setRateOrBy] = useState('all')

    const DateOrderBy = (v, e) => {
        if (v == 'all') {
            setDataComment(stateDataComment)
        } else {
            setDataComment(_.orderBy(dataComment, ['Date_Reviews'], [v]))
        }
        setDateOrBy(v)
        setRateOrBy('all')
        // setOrderBy([orderBy[0], v])
        // CommentOrderBy()
    }
    const RatingOrderBy = (v, e) => {
        if (v == 'all') {
            setDataComment(stateDataComment)
        } else {
            setDataComment(_.orderBy(dataComment, ['Rating_Reviews'], [v]))
        }
        setDateOrBy('all')
        setRateOrBy(v)
        // setOrderBy([v, orderBy[1]])
        // CommentOrderBy()
    }

    const RadioLabel = ({ children }) => <label style={{ padding: 7 }}>{children}</label>;

    const AddComment = () => {
        if (isAuth) {
            setIsOpen(true)
        } else {
            setIsAuthUser(true)
        }
    }
    const [IsOpen, setIsOpen] = useState(false)
    const [isAuthUser, setIsAuthUser] = useState(false)
    // console.log(dataComment)
    return <div className={styles.CommentList_container}>

        <div style={{ display: "flex", gap: "15px" }}>

            <RadioGroup value={DateOrBy} onChange={DateOrderBy} inline appearance="picker">
                <RadioLabel>Дата:</RadioLabel>
                <Radio value={'all'}>Неважно</Radio>
                <Radio value={"asc"}>По возрастанию</Radio>
                <Radio value={"desc"}>По убыванию</Radio>
            </RadioGroup>
            <RadioGroup value={RateOrBy} onChange={RatingOrderBy} inline appearance="picker">
                <RadioLabel>Рейтинг:</RadioLabel>
                <Radio value={'all'}>Неважно</Radio>
                <Radio value={"asc"}>По возрастанию</Radio>
                <Radio value={"desc"}>По убыванию</Radio>
            </RadioGroup>

            <Button onClick={AddComment} className={styles.AddCommentBtn} startIcon={<BiCommentAdd size={'1.5em'} />}>Добавить отзыв</Button>

        </div>
        <div>
            {
                dataComment?.map((item) => {
                    return <CommentCard data={item} />
                })
            }
        </div>
        <AddComment_Form isOpen={IsOpen} setIsOpen={setIsOpen} PointID={ID} />
        <UserAuth isOpen={isAuthUser} setIsOpen={setIsAuthUser} />

    </div>
}

const Character = (value, index) => {
    // unselected character
    if (value < index + 1) {
        return <FaMeh />
    }
    if (value < 3) {
        return <FaFrown style={{ color: 'red' }} />
    }
    if (value < 4) {
        return <FaMeh style={{ color: '#F4CA1D' }} />
    }
    return <FaSmile style={{ color: 'green' }} />
};
import { FaRegCircle } from "react-icons/fa";
import { Loadered } from "../Loader/Loader";
import { AuthContext } from "../../Scripts/AuthContext";
import { UserAuth } from "../UserAuth/UserAuth";
import { FaUserSlash } from "react-icons/fa";
const CommentCard = ({ data }) => {

    const [imgUrl, setImgUrl] = useState('')
    const [isOpenFill, setIsOpenFill] = useState(false)

    const Fotos = (data.Foto)
    // console.log(data)
    return <div className={styles.CommentCard_container}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Avatar style={data.User_name != null ? { backgroundColor: '#' + (Math.random().toString(16) + '000000').substring(2, 8).toUpperCase() } : { backgroundColor: "gray" }} src={`/api/${data.Avatar}`} circle size={data.User_name == null ? "md" : "lg"} >{data.User_name == null ? <FaUserSlash /> : data.User_name[0]}</Avatar>
                {data.User_name == null ? <Text muted>Пользователь удален</Text> : <Heading>{data.User_name}</Heading>}


            </div>
            {/* <Text muted>{data.User}</Text> */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Text muted>{data.Date_Reviews}</Text>
                <Rate value={data.Rating_Reviews} readOnly color="orange" size="sm" renderCharacter={Character} />
            </div>
        </div>
        <div style={{ marginLeft: "6.5%" }}>
            {data.Text_Reviews}
            {
                Fotos == (null || '') ? null :
                    Array.isArray(JSON.parse(Fotos)) ? <div className={styles.CommentCard_img}>{JSON.parse(Fotos).map((item) => {
                        return <img src={`/api/${item}`} onClick={() => { setImgUrl(`/api/${item}`); setIsOpenFill(true) }} alt="" />
                    })}
                    </div> : null

            }
            <ImageFill isOpen={isOpenFill} setIsOpen={setIsOpenFill} imgUrl={imgUrl} />
        </div>
    </div >
    {/* <Text>{data.Key_Reviews}</Text> */ }
}
import { MdAddAPhoto } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import axios from "axios";
import { ImageFill } from "../ImageFill/ImageFill";
const AddComment_Form = ({ isOpen, setIsOpen, PointID }) => {
    const user = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user"));
    const [RateValue, setRateValue] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState([]);
    const [PrevImages, setPrevImages] = useState([]);
    const refInp = useRef(null);

    const handleChange = async (Comment_key) => {

        const files = images;
        let imag = files.map((file, index) => {
            const append = file.name.split('.').pop(); // Get the file extension
            const newName = `${Comment_key}_${PointID}_${index}.${append}`;
            return new File([file], newName, { type: file.type });
        });
        const imgFile = new FormData()
        imag.forEach((image) => {
            imgFile.append('file', image)
        })
        // images

        const { data } = await axios({
            method: "post",
            url: `/api/images/comments/upload`,
            data: imgFile,
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (data.valid) {
            location.reload();
        }
    };

    const Handimg = (file) => {
        const images = Array.from(file.target.files);
        const previews = images.map(file => {
            return {
                file,
                previewURL: URL.createObjectURL(file)
            };
        });
        // setPrevImages(prevState => [...prevState, ...previews])
        setPrevImages(previews)
        console.log(images.filter((file, insex) => insex !== 1))
        setImages(images)
    }

    const HandimgRemove = (indexImg) => {
        const ImagesArr = images;
        const PrevImagesArr = PrevImages;
        setImages(ImagesArr.filter((file, index) => index !== indexImg))
        setPrevImages(PrevImagesArr.filter((file, index) => index !== indexImg))
    }

    const SubmitComment = async () => {
        var resp;
        const formData = new FormData();
        formData.append('User', user?.User_KEY);
        formData.append('PointID', PointID)
        formData.append('Rating_Reviews', RateValue);
        formData.append('Text_Reviews', comment);
        try {
            const response = await axios({
                method: "put",
                url: '/api/coments/',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            resp = response.data;
            if (resp.action) {
                if (images.length != 0) {
                    await handleChange(resp.ID)
                } else {
                    location.reload()
                }
                // console.log(data)
            }
            // Дополнительная логика после успешной отправки данных
        } catch (error) {
            console.error('Error uploading data', error);
            // Логика обработки ошибок
        }

    };

    return (
        <Modal open={isOpen} onClose={() => setIsOpen(false)} size={'calc(50%)'}>
            <Modal.Header style={{ fontWeight: "800" }}>
                <h3>
                    Написать отзыв
                </h3>
            </Modal.Header>
            <Modal.Body>
                <div style={{ padding: "10px 5px", display: "flex", flexDirection: "row", alignItems: "center", gap: "5px" }}>
                    <Text muted>Рейтинг:</Text>
                    <Rate value={RateValue} onChange={setRateValue} renderCharacter={Character} />
                </div>
                <div style={{ padding: "0 5px", }}>
                    <Text muted>Добавить комментарий:</Text>
                    <Input
                        as="textarea"
                        rows={3}

                        placeholder="Textarea"
                        value={comment}
                        onChange={setComment}
                    />
                </div>
                <div style={{ padding: "10px 5px", }}>
                    <Text muted>Добавить фото:</Text>
                    <div className={styles.Uploade_container}>
                        {PrevImages.map((image, index) => (
                            <div key={index}>
                                <img
                                    key={index}
                                    src={image.previewURL}
                                    alt={`Preview ${index}`}
                                />
                                <TiDelete className={styles.RemoveImgBtn} size={'1.5em'} onClick={() => HandimgRemove(index)} />

                            </div>

                        ))}
                        <IconButton
                            className={styles.Uploade_btn}
                            icon={<MdAddAPhoto size={'2.5em'} />}
                            onClick={() => refInp.current.click()}
                        />
                        <input
                            type="file"
                            onChange={Handimg}
                            style={{ display: "none" }}
                            multiple
                            ref={refInp}
                            accept="image/*,.png,.jpg,.web,.jpeg"
                        />
                    </div>
                </div>

                <button className={styles.btn_submite} onClick={SubmitComment}>Добавить отзыв</button>
            </Modal.Body>
        </Modal >
    );
}

{/* <Uploader
                    multiple listType="picture"
                    action="/api/images/"
                    // autoUpload={Upload}
                    accept="image/*,.png,.jpg,.web,.jpeg"
                    onChange={Handimg}
                >
                    <button>
                        <MdAddAPhoto size={'1.5em'} />
                    </button>
                </Uploader> */}
{/* <button onClick={handleChange} style={{ width: "100px", height: "100px" }}>
                    <MdAddAPhoto size={'1.5em'} />
                </button> */}