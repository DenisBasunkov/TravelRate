import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"
import { Point_By_id, Scroll_to_info, Users, get_city_by_ID } from "../../Scripts/Global";
import { Accordion, Button, Carousel, Divider, Dropdown, Header, Heading, HeadingGroup, IconButton, Loader, Modal, Nav, Navbar, Rate, Tabs, Tag, TagGroup, TagInput, TagPicker, Text, Toggle, Uploader, Whisper } from "rsuite";
import styles from './PointPage.module.scss'
import { ImageFill } from "../../Components/ImageFill/ImageFill";
import { MdOutlineArrowBackIos } from "react-icons/md";

export const PointPage = () => {

    const { pointID } = useParams()
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(async () => {
            try {
                const result = await Point_By_id(pointID); // Предполагается, что это асинхронная функция
                setData(result);
            } catch (error) {
                console.error('Error fetching point data:', error);
            } finally {
                setIsLoading(false);
            }
        }, 1000)
        return () => clearTimeout(timer)
        // fetchData(); // Загружаем данные
    }, [pointID]);
    var imgList;
    if (data) {
        imgList = data.Foto_point;
    }
    return <>
        <div className={styles.Title_container} />
        <div>
            <div style={{ width: "90%", padding: "10px 15px 0" }}>
                <Button appearance="ghost" onClick={() => { window.history.back() }} startIcon={<MdOutlineArrowBackIos />}> Назад</Button>
            </div>
            {isLoading ? (
                <Loader center inverse backdrop size="lg" />
            ) : (!data ? 'Data not found' : <Card data={data} />
            )}
        </div>

    </>

}

import { IoIosMore } from "react-icons/io";
import { IoImages } from "react-icons/io5";
import { TfiCommentAlt } from "react-icons/tfi";
import { MdMoreHoriz } from "react-icons/md";
import { Favorite_button } from "../../Components/Favorite_Button/FavoriteButton";
import { AuthContext } from "../../Scripts/AuthContext";
import { CommentList } from "../../Components/CommentList/CommentList";
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import { FaHashtag } from "react-icons/fa";
import axios from "axios";
import { BiImageAdd } from "react-icons/bi";

const Card = ({ data }) => {

    const categories = JSON.parse(sessionStorage.getItem("point_category"))
    const imgList = data.Foto_point;
    const ID = data.ID;
    const [isOpenFill, setIsOpenFill] = useState(false)
    const [imgUrl, setImgUrl] = useState(null)
    const refImgList = useRef(null)
    const [indexCarusel, setIndexCarusel] = useState(0)
    const [indexTab, setIndexTab] = useState(0)

    const { isAuth } = useContext(AuthContext)
    const [City, setCity] = useState({})
    const [Tags, setTags] = useState([])


    const get_tag_by_ID = async () => {
        const { data } = await axios({
            method: "get",
            url: "/api/point_type/get_tag_by_ID",
            params: { ID: ID }
        })
        setTags(data)
    }

    const [AllImg, setAllImg] = useState([])

    const All_comment_foto_by_point = async () => {
        const { data } = await axios({
            method: "get",
            url: "/api/coments/All_comment_foto_by_point",
            params: { ID: ID }
        })
        setAllImg([...JSON.parse(imgList), ...JSON.parse(data)])
    }

    useEffect(() => {
        const timer = setTimeout(async () => {
            setCity(await get_city_by_ID(data.City))
            await get_tag_by_ID()
            await All_comment_foto_by_point()
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    const description = JSON.parse(data.Description_point)
    const ArrayDescription = Object.keys(description).filter((item) => item !== "Описание")
    const AllDescription = Object.keys(description)

    const renderToggle = props => (
        <IconButton {...props} icon={<MdMoreHoriz size={"1.5em"} />} circle style={{
            boxShadow: "0px 2px 6px 0px hsla(0, 0%, 0%, .4)"
        }} />
    );

    const [isOpenAddTag, setIsOpenAddTag] = useState(false)

    return <div style={{ paddingBottom: "25px" }}>

        <AddTag isOpen={isOpenAddTag} setIsOpen={setIsOpenAddTag} pointId={ID} />

        <div className={styles.Title_point_info}>
            <div className={styles.Prew_img}>

                <Carousel activeIndex={indexCarusel}
                    onSelect={(index) => setIndexCarusel(index)}
                    className={styles.Carusel_img}
                >
                    {
                        Array.isArray(AllImg) ? AllImg.slice(0, 4).map((item, index) => {
                            return <img onClick={() => { setImgUrl("/api" + item); setIsOpenFill(true) }} src={"/api" + item || "/NotImage.jpg"} style={{ height: "100%" }} alt="" key={index} />
                        }) : <img src="/NotImage.jpg" style={{ width: "100%", height: "100%" }} />
                    }
                </Carousel>
                <div className={styles.imgMenu} >
                    {
                        Array.isArray(AllImg) ? AllImg.slice(0, 4).map((item, index) => {
                            return <Button style={indexCarusel !== index ? { outline: "none", } : { boxShadow: "none", outline: "2.5px solid #0087D1", outlineOffset: "5px" }} onClick={() => setIndexCarusel(index)}><img src={"/api" + item || "/NotImage.jpg"} style={{ height: "100%" }} alt="" key={index} /></Button>
                        }) : null
                    }
                    <Button onClick={() => { Scroll_to_info(refImgList); setIndexTab(0) }}><IoIosMore size={"2em"} /></Button>
                </div>
            </div>
            {/* Info */}
            <div style={{ padding: "50px 0px", position: "relative" }}>
                <div style={{ position: "absolute", top: "6px", right: "6px", display: "flex", gap: "5px" }}>

                    <Favorite_button data={data} />
                    {
                        isAuth ? <Dropdown renderToggle={renderToggle} placement="bottomEnd">
                            <Dropdown.Item icon={<FaHashtag />} onClick={() => { setIsOpenAddTag(true); }}>
                                <Heading>Добавить Теги</Heading>
                            </Dropdown.Item>
                            {/* <Dropdown.Item icon={<FaHashtag />} onClick={() => { setIsOpenAddTag(true); setAddTagtype("") }}>
                                <Heading>Добавить существующий Тег</Heading>
                            </Dropdown.Item> */}
                        </Dropdown> : null
                    }



                </div>
                <HeadingGroup>
                    <Heading level="1" style={{ fontSize: "45px" }}>{data.Name_point}</Heading>
                    <br />
                    <Text muted>{categories.find(({ ID }) => ID == data.Categories_Point).Name_Categories}</Text>
                </HeadingGroup>

                <hr />
                <div style={{ margin: "15px 0px", gap: "5px", display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex" }}>

                        <Rate
                            value={data.Rating_point}
                            allowHalf readOnly
                            size="xs" color="orange"
                        />
                        <Text>
                            {data.Rating_point}(5)
                        </Text>
                    </div>
                    <Text muted
                        className={styles.RefCommentsBtn}
                        onClick={() => { Scroll_to_info(refImgList); setIndexTab(1) }}
                    >Отзывов о месте <sup>({data.Koll_Rating})</sup> </Text>
                </div>
                <div>
                    <Text muted>Адрес:</Text>
                    <Text>{City.Subject} г. {City.Name}</Text>
                    <Text ><address>{data.Adress_point}</address></Text>
                </div>
                <hr />

                {/* <div className={styles.description_container}>
                    {
                        !description['Описание'] ? null :
                            <div>
                                <Text>{description["Описание"]}</Text>
                            </div>
                    }
                </div> */}
                <div>
                    <TagGroup style={{ margin: "5px" }}>
                        {Tags.map((item) => {
                            return <Tag key={item.ID} color={item.Color} style={{ fontSize: "20px", boxShadow: "0 0 6px 0 gray" }} size="lg"><FaHashtag size={".7em"} />{item.Tag_Name}</Tag>
                        })}
                    </TagGroup>
                    <Accordion defaultActiveKey={0}>
                        {
                            AllDescription.map((item, index) => {
                                return <Accordion.Panel key={index} eventKey={index + 1} header={<Text muted>{item}</Text>} >
                                    <p>{description[item]}</p>
                                </Accordion.Panel>
                            })
                        }

                    </Accordion>
                </div>
            </div>
            {/*  */}

        </div>

        <div style={{ width: "90%", margin: "0 auto" }}>
            <Divider></Divider>
            <MapPoint data={data} />
            <Divider></Divider>
        </div>

        <Tabs activeKey={indexTab} onSelect={setIndexTab} className={styles.TabsNav} appearance="subtle" ref={refImgList}>
            <Tabs.Tab eventKey={0} title="Галерея" icon={<IoImages size={"1.5em"} />}>
                {imgList === (null || '') ? null :
                    <div className={styles.ingList}>
                        {
                            Array.isArray(AllImg) ? AllImg.map((item, index) => {
                                return <Button onClick={() => { setImgUrl("/api" + item); setIsOpenFill(true) }} className={styles.imgList_card}><img src={"/api" + item || "/NotImage.jpg"} style={{ width: "100%" }} alt="" key={index} /></Button>
                            }) : null
                        }

                        {/* <button className={styles.imgList_btn} ><BiImageAdd size={"3em"} /></button> */}

                        <ImageFill isOpen={isOpenFill} setIsOpen={setIsOpenFill} imgUrl={imgUrl} />
                    </div>
                }
            </Tabs.Tab>
            <Tabs.Tab eventKey={1} title={<Text>Отзывов о месте <sup>({data.Koll_Rating})</sup> </Text>} icon={<TfiCommentAlt size={"1.5em"} />}>
                <CommentList ID={data.ID} />
            </Tabs.Tab>
        </Tabs>

    </div>

}

const AddTag = ({ isOpen, setIsOpen, pointId }) => {

    close = () => {
        setIsOpen(false)
    }


    const [addTagtype, setAddTagtype] = useState("new")

    const ID = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user"))

    const dataTags = JSON.parse(sessionStorage.getItem("all_tag")).map(({ Tag_Name, ID }) => ({ label: Tag_Name, value: ID }))

    const RefForm = useRef(null)

    const typeAddTag = () => {
        switch (addTagtype) {
            case "new":
                return <TagInput trigger={['Enter', 'Comma']} style={{ padding: "10px" }} placeholder="Напишите текст нового тега" name="Tagname" block />
            default:
                return <TagPicker style={{ padding: "10px" }} data={dataTags} color="red" name="Tagname" block placeholder="Выберите Тег из списка" size="lg" />

        }
    }

    const TagSubmit = async (e) => {
        e.preventDefault()
        const datas = new FormData(RefForm.current)
        if (datas.get("Tagname") != (null || '')) {
            datas.append("ID", pointId)
            datas.append("IDUser", ID.User_KEY)
            datas.append("typeTag", addTagtype)
            const { data } = await axios({
                method: "put",
                url: "/api/point_type/put_tag_by_ID",
                data: datas,
            })
            if (data.status) {
                alert(data.mess)
                location.reload()
            }
        } else {
            alert("Пое не должно быть пустым")
        }

        // alert(data.get("Tagname"))
        // alert(data.get("TagInput"))
    }

    return <Modal open={isOpen} backdrop="static" onClose={close}>
        <Modal.Header >
            <h1>Добавить теги</h1>
        </Modal.Header>
        <Modal.Body>
            <Toggle
                unCheckedChildren="Из списка"
                checkedChildren="Новые"
                defaultChecked
                onChange={(v, e) => { v ? setAddTagtype("new") : setAddTagtype('') }}
                size={"lg"}
            />
            <form onSubmit={TagSubmit} ref={RefForm} style={{ padding: "10px 15px" }}>
                {/* <TagInput name="TagInput" /> */}
                {
                    typeAddTag()
                }
                <Button appearance="primary" style={{ margin: "15px 0px" }} type="submit">Добавить</Button>
            </form>
        </Modal.Body>
        {/* <h1>{JSON.stringify(AllTag)}</h1> */}

    </Modal>

}


const MapPoint = ({ data }) => {
    const myCoord = JSON.parse(sessionStorage.getItem("MyCoords"))
    const Categories = JSON.parse(sessionStorage.getItem("point_category")) || []
    const [img, setImg] = useState('')
    useEffect(() => {
        const timer = setTimeout(() => {
            var categories = Categories.find(({ ID }) => ID === data.Categories_Point)
            if (categories.icon !== (null || "")) {
                setImg(`/api${categories.icon}`)
            } else {
                setImg("/Location.png")
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [])
    return <div style={{ width: "100%", height: "700px" }}>

        <MapContainer center={JSON.parse(data.Coordinates_point)} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[myCoord.lat, myCoord.lon]} icon={new Icon({
                iconUrl: "/UserLocation.png",
                iconSize: [38, 38],
            })} />
            {
                data.Coordinates_type_point === "Point" ? <>
                    <Marker key={data.ID}
                        position={JSON.parse(data.Coordinates_point)}
                        icon={new Icon({
                            iconUrl: img || '/Location.png',
                            iconSize: [35, 35],
                        })}
                    >
                        <Popup>
                            <h1>
                                {data.Name_point}
                            </h1>
                        </Popup>
                        <CircleMarker radius={22} key={data.ID} center={JSON.parse(data.Coordinates_point)} pathOptions={{ color: "#1c5777" }}>

                        </CircleMarker>

                    </Marker>
                </>
                    : <Polyline key={data.ID} pathOptions={{ color: "red" }} positions={JSON.parse(data.Coordinates_point)} >
                        <Popup>
                            {data.Name_point}
                        </Popup>
                    </Polyline>
            }
            {/* <Marker position={[myCoord.lat, myCoord.lon]} icon={new Icon({
                iconUrl: "/UserLocation.png",
                iconSize: [38, 38],
            })} /> */}
        </MapContainer>
    </div>

}