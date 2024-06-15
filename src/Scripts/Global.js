import axios from "axios";
import dataCity from "../assets/russian-cities.json"
import { useContext, useState } from "react";
import data from "../assets/russian-cities.json"
import { AuthContext } from "./AuthContext";

//Плавный скрол к определенной точке
export const Scroll_to_info = (id_name) => {
    id_name.current?.scrollIntoView({ behavior: "smooth" });
}

//Определение координат пользователя и определение города пользователя
export const MyLatLon = () => {
    const success = (position) => {
        const coords = { "lat": position.coords.latitude, "lon": position.coords.longitude }
        const data = dataCity.filter(cur => Math.abs(cur.coords.lat - coords.lat) <= 0.1 && Math.abs(cur.coords.lon - coords.lon) <= 0.1)[0];
        const MyLocation = data
        sessionStorage.setItem("city", JSON.stringify(MyLocation))
        sessionStorage.setItem("MyCoords", JSON.stringify(coords))
    }
    const error = (err) => {
        console.error(err);
    }
    navigator.geolocation.getCurrentPosition(success, error)
}


export const get_Favorite_by_user = async (User_ID) => {

    try {
        const response = await axios({
            method: "get",
            url: "/api/favorite/User_ID",
            params: {
                User_ID: User_ID
            },
            headers: {},
        })
        const data = response.data;
        sessionStorage.setItem("favorite_list", JSON.stringify(data))
        // console.log(data)
        // return data;
        // sessionStorage.setItem("all_points", JSON.stringify(data))

    } catch (err) {

    }

}

//Поиск пользователя
export const FindeUser = async (data, checked) => {
    try {
        const response = await axios({
            method: "get",
            url: "/api/user/finde",
            params: data,
        });
        const userData = response.data;
        if (typeof userData === 'object') {
            if (!checked) {
                localStorage.setItem("user", JSON.stringify(userData));
                sessionStorage.removeItem("user");
            } else {
                sessionStorage.setItem("user", JSON.stringify(userData));
                localStorage.removeItem("user");
            }
            await get_Favorite_by_user(userData.User_KEY)
            await All_Favorite_by_user(userData.User_KEY)
            // sessionStorage.setItem('favorite_list', JSON.stringify([]));
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
};

//Создание Пользователя
export const CreateUser = async (dataPut) => {
    try {
        const response = await axios({
            method: "put",
            url: "/api/user/create",
            params: dataPut,
            headers: {},
        })
        const userData = response.data;
        if (userData.action) {
            const isData = await FindeUser(dataPut, true)
            if (isData) {
                return true
            }
        }
    } catch (err) {
        console.error(err)
        alert(err)
    }
}


//Получение типов поинтов
export const Get_all_type = async () => {

    try {
        const response = await axios({
            method: "get",
            url: "/api/point_type/get_type",
            params: {},
            headers: {},
        })
        const data = response.data;
        sessionStorage.setItem("point_type", JSON.stringify(data))
    } catch (err) {
        console.error(err)
        alert(err)
    }

}

//Получение категорий типов
export const Get_all_category = async () => {

    try {
        const response = await axios({
            method: "get",
            url: "/api/point_type/get_category",
            params: {},
            headers: {},
        })
        const data = response.data;
        sessionStorage.setItem("point_category", JSON.stringify(data))
    } catch (err) {
        console.error(err)
        alert(err)
    }

}

export const Array_type = () => {

    const pointTypeData = JSON.parse(sessionStorage.getItem("point_type")) || [];
    const pointCategoryData = JSON.parse(sessionStorage.getItem("point_category")) || [];

    return pointCategoryData.map((item) => {
        // const role = 
        return {
            label: item.Name_Categories,
            value: item.ID,
            role: pointTypeData.filter(({ ID }) => item.Type_Point == ID).map(({ Name_Type }) => { return Name_Type })
        };
    });

}

//Облости
export const SubjectOfDistrict = () => {
    const dataPiket = new Set(data.map(({ district, subject }) => {
        return JSON.stringify({ label: subject, value: subject, role: district })
    }))
    return Array.from(dataPiket).map(e => JSON.parse(e))
}

//Города в области
export const NameBySubject = (subject_name) => {
    return data.map(({ district, name, subject }) => {
        return ({ label: name, value: name, role: subject })
    }).filter((item) => subject_name === item.role)
}

//Получение списка мест по городу и области
export const Get_all_point = async (CityName, SubjectName) => {

    try {
        const response = await axios({
            method: "get",
            url: "/api/point_type/all",
            params: {
                CityName: CityName,
                SubjectName: SubjectName
            },
            headers: {},
        })
        const data = response.data;
        return data;
        // sessionStorage.setItem("all_points", JSON.stringify(data))

    } catch (err) {

    }

}

//
export const Put_Favorite_point = async (Point_ID, User_ID, datas) => {

    try {
        const response = await axios({
            method: "put",
            url: "/api/favorite/",
            params: {
                Point_ID: Point_ID,
                User_ID: User_ID
            },
            headers: {},
        })
        const data = response.data;
        if (data.statys) {

            const items = JSON.parse(sessionStorage.getItem('favorite_list'));
            items.push(data.data);
            sessionStorage.setItem('favorite_list', JSON.stringify(items));

            const Favoriteitems = JSON.parse(sessionStorage.getItem('AllfavoriteList'));
            Favoriteitems.push(datas);
            sessionStorage.setItem('AllfavoriteList', JSON.stringify(Favoriteitems));

        }
        // console.log(data)
        // return data;
        // sessionStorage.setItem("all_points", JSON.stringify(data))

    } catch (err) {

    }

}

export const Delete_Favorite_point = async (data) => {

    const ID = data.Data_Key
    const Point = data.Point

    try {
        const response = await axios({
            method: "delete",
            url: "/api/favorite/",
            params: {
                Data_Key: ID
            },
            headers: {},
        })
        const data = response.data;
        if (data.statys) {
            const items = JSON.parse(sessionStorage.getItem('favorite_list'));
            sessionStorage.setItem('favorite_list', JSON.stringify(items.filter((item) => item.Data_Key !== ID)));

            const list_favorite = JSON.parse(sessionStorage.getItem("AllfavoriteList"));
            sessionStorage.setItem("AllfavoriteList", JSON.stringify(list_favorite.filter((item) => item.ID !== Point)))
        }
        // console.log(data)



        // return data;
        // sessionStorage.setItem("all_points", JSON.stringify(data))

    } catch (err) {

    }

}


export const All_Favorite_by_user = async (User_ID) => {

    try {
        const response = await axios({
            method: "get",
            url: "/api/favorite/get_favorite_by_User",
            params: {
                User_ID: User_ID
            },
            headers: {},
        })
        const data = response.data;
        sessionStorage.setItem("AllfavoriteList", JSON.stringify(data))
        // console.log(data)
        // return data;
        // sessionStorage.setItem("all_points", JSON.stringify(data))

    } catch (err) {

    }

}

export const Point_By_id = async (Point_ID) => {

    try {
        const response = await axios({
            method: "get",
            url: "/api/point_type/point",
            params: {
                id: Point_ID
            },
            headers: {},
        })
        const data = response.data;
        return data[0];
    } catch (err) {

    }
}

export const Users = () => {
    const data = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user"))
    if (data) {
        get_Favorite_by_user(data.User_KEY)
    }
}

export const get_city_by_ID = async (ID) => {
    const CityID = ID
    try {
        const response = await axios({
            method: "get",
            url: "/api/point_type/city",
            params: {
                ID: CityID
            },
            headers: {},
        })
        const data = response.data;
        // alert(JSON.stringify(data[0]))
        return data[0];
    } catch (err) {

    }
}

export const Get_comment_by_point_id = async (ID) => {
    try {
        const response = await axios({
            method: "get",
            url: "/api/coments/by_point_id",
            params: {
                PointID: ID
            }
        })

        const data = response.data;
        return data

    } catch (err) {

    }
}

export const Get_all_city = async () => {
    try {
        const response = await axios({
            method: "get",
            url: "/api/point_type/All_city",
        })

        const data = response.data;
        return data

    } catch (err) {

    }
}

export const Add_point = async (pointData) => {
    try {
        const response = await axios({
            method: "put",
            url: "/api/point_type/Add_point",
            data: pointData
        })
        const res = response.data
        return res
    } catch (err) {

    }
}

export const get_all_tag = async () => {
    const { data } = await axios({
        method: "get",
        url: "/api/point_type/get_all_tag"
    })
    sessionStorage.setItem("all_tag", JSON.stringify(data))
}
