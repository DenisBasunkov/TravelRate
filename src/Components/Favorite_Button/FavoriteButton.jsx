import { useContext, useEffect, useState } from "react";
import { RiHeartLine, RiHeartFill } from "react-icons/ri";
import { IconButton, Message, useToaster } from "rsuite";
import { AuthContext } from "../../Scripts/AuthContext";
import { Delete_Favorite_point, Put_Favorite_point, Users } from "../../Scripts/Global";
import { UserAuth } from "../UserAuth/UserAuth";
import stiles from "./FavoriteButton.module.scss"

export const Favorite_button = ({ data }) => {

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

    const [isAuthUser, setIsAuthUser] = useState(false)

    useEffect(() => {
        setList(getFavoriteList())
        setIsFavorite(list.find((item) => item.Point === data.ID) !== undefined)
    }, [])

    window.addEventListener("unload", () => {
        Users()
        setList(getFavoriteList())
    })

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

    return <>
        < UserAuth isOpen={isAuthUser} setIsOpen={setIsAuthUser} />
        <IconButton
            onClick={() => Set_favorite(data.ID)}
            icon={isFavorite ? <RiHeartFill size={"1.5em"} color="red" /> : <RiHeartLine size={"1.5em"} />}
            className={stiles.Favorite_button} />

    </>

}