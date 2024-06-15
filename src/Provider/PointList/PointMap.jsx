import { Circle, CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet"
import stiles from "./PointList.module.scss"
import "leaflet/dist/leaflet.css"
import { Carousel, IconButton, Loader, Placeholder, Rate } from "rsuite"
import { HiMiniUser } from "react-icons/hi2";
import { HiOutlineHome } from "react-icons/hi2";
import { useContext, useEffect, useState } from "react";
import { Icon } from "leaflet";
import { Loadered } from "../../Components/Loader/Loader"
import data_city from '../../assets/russian-cities.json'
import { AuthContext } from "../../Scripts/AuthContext";
import { Delete_Favorite_point, Put_Favorite_point } from "../../Scripts/Global";
import { UserAuth } from "../../Components/UserAuth/UserAuth";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import { Favorite_button } from "../../Components/Favorite_Button/FavoriteButton";
import { CardPoint } from "../../Components/Card_point/CardPoint";

export const PointMap = ({ data, city }) => {
    const myCoord = JSON.parse(sessionStorage.getItem("MyCoords"))
    const mycor = [myCoord.lat, myCoord.lon]
    const [isLoader, setIsLoader] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoader(false)
        }, 2000)
        // return () => clearTimeout(timer)
    }, [data])

    const Categories = JSON.parse(sessionStorage.getItem("point_category")) || []
    const Citys = JSON.parse(sessionStorage.getItem("search_point")) || []
    const city_latlon = data_city.find(({ subject, name }) => subject === Citys.Subject && name === Citys.CityName).coords
    return <div style={{ width: "100%", height: "90vh" }}>
        {
            isLoader ? <Placeholder.Graph active style={{ width: "100%", height: "100%" }} /> :
                <MapContainer
                    center={[city_latlon.lat, city_latlon.lon]}
                    zoom={13}
                    className={stiles.Maps}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={mycor} icon={new Icon({
                        iconUrl: "/UserLocation.png",
                        iconSize: [38, 38],
                    })} />

                    {
                        data.map((item) => {
                            var categories = Categories.find(({ ID }) => ID === item.Categories_Point)
                            if (categories.icon !== (null || "")) {
                                var img = `api/` + categories.icon
                            } else {
                                var img = "/Location.png"
                            }

                            return (
                                item.Coordinates_type_point === "Point" ? <>

                                    <Marker key={item.ID}
                                        position={JSON.parse(item.Coordinates_point)}
                                        icon={new Icon({
                                            iconUrl: img,
                                            iconSize: [35, 35],
                                        })}
                                    >
                                        <Popup>
                                            <div style={{ width: "250px" }}>
                                                <CardPoint data={item} categories={categories} />
                                            </div>
                                            {/* <PopupMarcer data={item} categories={categories.Name_Categoriess} /> */}
                                        </Popup>
                                        <CircleMarker radius={22} key={item.ID} center={JSON.parse(item.Coordinates_point)} pathOptions={{ color: "#1c5777" }}>

                                        </CircleMarker>

                                    </Marker>

                                </>
                                    : <Polyline key={item.ID} pathOptions={{ color: "red" }} positions={JSON.parse(item.Coordinates_point)} >
                                        <Popup>
                                            <div style={{ width: "250px" }}>
                                                <CardPoint data={item} categories={categories} />
                                            </div>
                                        </Popup>
                                    </Polyline>

                            )
                        })
                    }

                </MapContainer >
        }
    </div>

}

const PopupMarcer = ({ data, categories }) => {

    const imgList = data.Foto_point;

    return <figure className={stiles.PopupMacer_container}>

        <Favorite_button data={data} />

        <Carousel style={{ width: "100%", height: "100px" }} shape="bar" autoplay>
            {imgList === (null || '') ? <img src={"/NotImage.jpg"} alt="" /> :
                Array.isArray(JSON.parse(imgList)) ? JSON.parse(imgList).map((item, index) => {
                    return <img src={"/api" + item || "/NotImage.jpg"} alt="" onClick={() => alert('d')} />
                }) : <img src={"/NotImage.jpg"} alt="" onClick={() => alert('d')} />}
        </Carousel>
        <figcaption>
            <h4>{data.Name_point}</h4>
            <p>{categories}</p>
            <Rate value={data.Rating_point} allowHalf readOnly color="orange" size="xs" />
            <pre>{data.Adress_point}</pre>
        </figcaption>


    </figure>

}