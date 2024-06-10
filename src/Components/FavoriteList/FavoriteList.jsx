import axios from "axios"
import { CardPoint } from "../Card_point/CardPoint"
import { useEffect } from "react"
import { All_Favorite_by_user } from "../../Scripts/Global"
import styles from "./FavoriteList.module.scss"
import { IconButton } from "rsuite"
import { SlReload } from "react-icons/sl";

export const FavoriteList = ({ ID }) => {

    const FavoriteList = JSON.parse(sessionStorage.getItem('AllfavoriteList'))
    const Categories = JSON.parse(sessionStorage.getItem('point_category'))

    return <div>

        <IconButton icon={<SlReload size={"1.5em"} />} onClick={() => location.reload()} />
        <div className={styles.Favorite_container}>

            {
                FavoriteList.length == 0 ? <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <h1>У вас нет избранного</h1>
                </div > :
                    FavoriteList.map((item) => <>
                        <div className={styles.Card_container}>
                            {/* <IconButton className={styles.button_remove} /> */}
                            <CardPoint data={item} categories={Categories} />
                        </div>
                    </>)
            }
        </div>

    </div>

}