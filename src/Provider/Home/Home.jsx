import { Button, Carousel, Heading, HeadingGroup, List, Panel, Tag, Text } from "rsuite"
import stiles from "./Home.module.scss"
import { useEffect, useRef, useState } from "react"
import { Scroll_to_info } from "../../Scripts/Global"
import axios from "axios"

export const Home = () => {

    const block_info = useRef(null)
    const [city, setCity] = useState([])
    const [category, setCategory] = useState([])
    const [dataPoint, setDataPoint] = useState(null);



    setTimeout(() => {
        get_point()
        setCity(JSON.parse(sessionStorage.getItem('city')))
        setCategory(JSON.parse(sessionStorage.getItem('point_category')))
    }, 100)


    const get_point = async () => {

        if (city.length != 0) {
            const { data } = await axios({
                method: "get",
                url: "/api/point_type/all",
                params: {
                    CityName: city.name,
                    SubjectName: city.subject
                }
            })
            setDataPoint(data)
        } else {
            setDataPoint(null)
        }


    }

    const [activeIndex, setActiveIndex] = useState(0);

    return <>
        <div className={stiles.Title_container}>

            <div className={stiles.Title_text}>
                <HeadingGroup >
                    <Heading style={{ fontSize: "50px", color: "white" }}>Travel Raters</Heading>
                    {/* <Text style={{ color: "white" }}>Откройте мир с нами</Text> */}
                    <Text size={'1.25em'} style={{ width: "100%", color: "white" }}>
                        Добро пожаловать на Travel Raters, ваш надежный гид по самым захватывающим путешествиям и уникальным местам на планете! Мы помогаем вам находить лучшие направления, от уютных уголков до всемирно известных достопримечательностей, предоставляя объективные обзоры, полезные советы и вдохновляющие истории путешественников.
                    </Text>
                    <button className={stiles.Title_button} onClick={() =>
                        // Scroll_to_info(block_info)
                        location.href = "/Места"
                    }>В путь</button>
                </HeadingGroup>
            </div>

        </div>

        <div style={{ width: "100%", margin: "0 auto" }}>
            {
                dataPoint == null ? null
                    : <div>
                        <div style={{ textAlign: "center", margin: "25px 0", fontWeight: "700" }}>
                            <h1>Популярные места: {city.subject} - {city.name}</h1>
                        </div>

                        <Carousel style={{ height: "600px", }}
                            shape="bar"
                            activeIndex={activeIndex}
                            onSelect={index => {
                                setActiveIndex(index);
                            }}
                        >
                            {
                                dataPoint.map((item, index) => {
                                    return <div key={index} style={{
                                        backgroundImage: `linear-gradient(rgba(0, 0, 0, .4), rgba(0, 0, 0, .4)),url("/api/${JSON.parse(item.Foto_point)[0]}")`,
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        color: "#fff"
                                    }}>
                                        <div style={{
                                            padding: "40px 25px",
                                            display: "grid", gridTemplateColumns: "50% 50%",
                                            alignItems: "center",
                                            gridAutoRows: "100%",
                                            backdropFilter: "blur(5px)",
                                            height: "100%",
                                        }}>

                                            <div style={{
                                                height: "100%",
                                                width: "100%", padding: "15px 25px",
                                                backgroundImage: `linear-gradient(rgba(0, 0, 0, .0), rgba(0, 0, 0, .0)),url("/api/${JSON.parse(item.Foto_point)[0]}")`,
                                                backgroundPosition: "center",
                                                backgroundSize: "cover",
                                                borderRadius: "5px"
                                            }}>

                                            </div>
                                            <div style={{ padding: "15px 25px", }}>
                                                <Panel bordered>
                                                    <h1>{item.Name_point}</h1>
                                                    <br />
                                                    <Tag>
                                                        <address style={{ fontSize: "15px" }}>{item.Adress_point}</address>
                                                    </Tag>
                                                    {/* <div style={{ display: "flex", alignItems: "center" }}>
                                            <img src={`/api/${category.find(items => items.ID === item.Categories_Point).icon}`} alt="" />
                                            <p>{category.find(items => items.ID === item.Categories_Point).Name_Categories}</p>
                                        </div> */}
                                                    <div style={{ margin: "15px 0", float: "right" }}>
                                                        <button onClick={() => location.href = `/point/${item.ID}`} className={stiles.button_read}>Подробнее</button>
                                                    </div>
                                                </Panel>
                                            </div>

                                        </div>


                                    </div>
                                })
                            }
                        </Carousel>
                    </div>
            }
        </div >


        {/* 
        <div style={{ margin: "25px auto", width: "90%" }} ref={block_info}>

            <div style={{ display: "flex" }}>
                {/* <img src="/avatar2.png" width={350} alt="" style={{ borderRadius: "500px", border: "5px solid gray" }} /> */}


        {/* </div > */}
        {/* <Carousel shape="dot">

        </Carousel>
        </div > * /} */}

    </>
}