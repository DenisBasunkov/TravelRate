import { Button, Carousel, IconButton, Message, Rate, useToaster } from "rsuite"
import stiles from "./Card_point.module.scss"
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import { useContext, useEffect, useState } from "react";
import { MdOpenInNew } from "react-icons/md";
import { AuthContext } from "../../Scripts/AuthContext";
import { UserAuth } from "../UserAuth/UserAuth";
import { Delete_Favorite_point, Put_Favorite_point } from "../../Scripts/Global";

import { MyMessage } from "../Message/Message"
import { Favorite_button } from "../Favorite_Button/FavoriteButton";

export const CardPoint = ({ data, categories }) => {

    const getFavoriteList = () => {
        const storedList = JSON.parse(sessionStorage.getItem("favorite_list"));
        if (storedList) {
            return storedList;
        }
        return [];
    };



    const [list, setList] = useState(getFavoriteList())
    // useEffect(() => {

    // }, [])

    const [isFavorite, setIsFavorite] = useState(() => {
        return (list.find((item) => item.Point === data.ID) !== undefined);
    })

    const toaster = useToaster()
    const { isAuth } = useContext(AuthContext)
    const imgList = data.Foto_point;

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

        <div style={{
            position: " absolute",
            top: " 6px",
            right: "10px"
        }}>
            <Favorite_button data={data} />
        </div>


        <Carousel className={stiles.Card_img} shape="bar" autoplayInterval={4000} >
            {imgList === (null || '') ? <img src={"/NotImage.jpg"} alt="" /> :
                Array.isArray(JSON.parse(imgList)) ? JSON.parse(imgList).map((item, index) => {
                    return <img src={"/api" + item || "/NotImage.jpg"} alt="" key={index} onClick={() => window.location.href = `/point/${data.ID}`} />
                }) : <img src={"/NotImage.jpg"} alt="" onClick={() => window.location.href = `/point/${data.ID}`} />}
        </Carousel>

        <figcaption className={stiles.Card_point_info} onClick={() => window.location.href = `/point/${data.ID}`}>
            <h3>{data.Name_point}</h3>
            <p>{categories.Name_Categories}</p>
            <div style={{ display: 'flex', alignItems: "center" }}>
                <Rate value={data.Rating_point} allowHalf readOnly size="xs" color="orange" />
                <h4><Rate value={data.Rating_point} readOnly size="xs" plaintext /></h4>
            </div>
            <pre>{data.Adress_point}</pre>
        </figcaption>

    </figure >

}