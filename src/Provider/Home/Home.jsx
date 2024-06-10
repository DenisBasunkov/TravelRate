import { Carousel, Heading, HeadingGroup, Text } from "rsuite"
import stiles from "./Home.module.scss"
import { useRef } from "react"
import { Scroll_to_info } from "../../Scripts/Global"

export const Home = () => {

    const block_info = useRef(null)

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