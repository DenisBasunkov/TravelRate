import { Button, Carousel, Divider, IconButton, Message, Rate, Text, useToaster } from "rsuite"
import stiles from "./Card_point.module.scss"
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import { useContext, useEffect, useState } from "react";
import { MdOpenInNew } from "react-icons/md";
import { AuthContext } from "../../Scripts/AuthContext";
import { UserAuth } from "../UserAuth/UserAuth";
import { Delete_Favorite_point, Put_Favorite_point } from "../../Scripts/Global";

import { MyMessage } from "../Message/Message"
import { Favorite_button } from "../Favorite_Button/FavoriteButton";
import axios from "axios";

export const CardPoint = ({ data, categories }) => {
    const storedList = JSON.parse(sessionStorage.getItem("favorite_list"));
    const getFavoriteList = () => {
        if (storedList) {
            return storedList;
        }
        return [];
    };

    const [list, setList] = useState([])
    // setList(await getFavoriteList())

    // const [isFavorite, setIsFavorite] = useState(() => {
    //     return (list.find((item) => item.Point === data.ID) !== undefined);
    // })

    const toaster = useToaster()
    const { isAuth } = useContext(AuthContext)
    const imgList = data.Foto_point;
    const ID = data.ID

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
        All_comment_foto_by_point();
    }, [])

    const [isAuthUser, setIsAuthUser] = useState(false)

    const mess = (type, text) => {
        return <Message showIcon type={type} >
            {text}
        </Message>
    }

    const Set_favorite = (ID) => {
        if (isAuth) {
            const userJson = localStorage.getItem("user") || sessionStorage.getItem("user");
            if (userJson) {
                const UserId = JSON.parse(userJson).User_KEY;
                if (!isFavorite) {
                    Put_Favorite_point(ID, UserId, data);
                    setIsFavorite(true);
                    toaster.push(mess("success", "Добавленно в избранное"), { placement: "bottomStart", duration: 3000 });
                } else {
                    const list = getFavoriteList()
                    Delete_Favorite_point(list.find((item) => item.Point === ID));
                    setIsFavorite(false);
                    toaster.push(mess("success", "Удалено из избранного"), { placement: "bottomStart", duration: 3000 });
                }
            }
        } else {
            setIsAuthUser(true)
        }
    };

    return <figure className={stiles.Card_container} >

        <Carousel className={stiles.Card_img} shape="bar"  >
            {AllImg.length == 0 ? <img src={"/NotImage.jpg"} alt="" /> :
                Array.isArray(AllImg) ? AllImg.slice(0, 6).map((item, index) => {
                    return <img src={"/api" + item || "/NotImage.jpg"} alt="" key={index} onClick={() => window.location.href = `/point/${data.ID}`} />
                }) : <img src={"/NotImage.jpg"} alt="" onClick={() => window.location.href = `/point/${data.ID}`} />}
        </Carousel>
        <div style={{
            position: " absolute",
            top: " 6px",
            right: "0px",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            padding: "0 10px",
            justifyContent: "right",
            alignItems: "center"
        }}>

            <Favorite_button data={data} />
        </div>
        {/* 
        <div style={{
            position: " absolute",
            top: "6px",
            left: "10px",
        }}>
            <Rate value={data.Rating_point} allowHalf readOnly size="sm" color="orange" />
        </div> */}
        {/* <h4><Rate value={data.Rating_point} readOnly size="xs" plaintext /></h4> */}

        <figcaption className={stiles.Card_point_info} onClick={() => window.location.href = `/point/${data.ID}`}>
            <h3 > {data.Name_point}</h3>
            {/* <p > {categories.Name_Categories}</p> */}
            {/* style={{ display: "flex", alignItems: "center" }} */}
            <div style={{
                position: "absolute",
                top: "-20px", right: "25px",
                backgroundColor: "#fff",
                boxShadow: "0 0 6px 0 hsla(0,0%,0%,.5)",
                padding: "5px",
                borderRadius: "100px"
            }}>
                <img src={categories.icon !== (null || "") ? (`/api/${categories.icon}`) : '/Location.png'} width={30} />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <Rate value={data.Rating_point.toFixed(1)} allowHalf readOnly size="xs" color="orange" />
                <Text muted><Rate value={data.Rating_point.toFixed(1)} readOnly size="xs" plaintext /></Text>
            </div>
            <div>
                <Divider style={{ margin: "7.5px" }}></Divider>
                <pre>{data.Adress_point}</pre>
            </div>
        </ figcaption>

    </figure >

}