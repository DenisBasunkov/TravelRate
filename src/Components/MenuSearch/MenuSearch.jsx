import { InputPicker, Stack } from "rsuite";
import { NameBySubject, SubjectOfDistrict } from "../../Scripts/Global";
import { useEffect, useState } from "react";
import styles from "./MenuSearch.module.scss"

export const MenuSearch = ({ set_name }) => {

    const initialCity = sessionStorage.getItem("search_point")
        ? JSON.parse(sessionStorage.getItem("search_point"))["CityName"]
        : '';

    const initialDistrict = sessionStorage.getItem("search_point")
        ? JSON.parse(sessionStorage.getItem("search_point"))["Subject"]
        : '';

    const [text, setText] = useState(initialCity);
    const [district, setDistrict] = useState(initialDistrict);
    const [Subject_name, setSubject_name] = useState([]);

    useEffect(() => {
        if (district) {
            setSubject_name(NameBySubject(district));
        } else {
            setSubject_name([]);
        }
    }, [district]);

    return <div className={styles.menu_filter}>


        <div>
            Регион:
            <InputPicker
                placement="auto"
                value={district}
                className={styles.select_block}
                placeholder="Куда отравимся?"
                groupBy="role"
                data={SubjectOfDistrict() || []}
                onClean={() => {
                    setDistrict([]);
                    setSubject_name([]);
                    setText("")
                    set_name('')
                    sessionStorage.removeItem("search_point")
                }}
                onChange={(e) => {
                    setDistrict(e);
                    setSubject_name(NameBySubject(e))

                }}

            />
        </div>
        <div style={{ color: "white" }}>
            Город:
            <InputPicker
                placement="auto"
                className={styles.select_block}
                placeholder="Куда отравимся?"
                data={Subject_name}
                groupBy="role"
                value={text}
                onClean={() => setText('')}
                onChange={(e) => {
                    setText(e)
                }}

            />
        </div>
        <div style={{ width: "150px" }}>
            <button
                className={styles.Menu_filter_btn}
                disabled={text == '' || Array.isArray(text) ? true : false}
                onClick={() => {
                    sessionStorage.setItem("search_point", JSON.stringify({ CityName: text, Subject: district }))
                    set_name({ CityName: text, Subject: district })
                }}
            >Поиск</button>
        </div>

    </div >

}