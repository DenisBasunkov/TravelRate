import { useParams } from "react-router-dom"
import stiles from "./PointList.module.scss"
import { useEffect, useRef, useState } from "react"
import { Accordion, Button, CheckPicker, Checkbox, CheckboxGroup, Divider, Heading, HeadingGroup, InputPicker, Loader, Notification, Pagination, Panel, Placeholder, Rate, Tabs, Text } from "rsuite"
import axios from "axios"
import { Array_type, Get_all_point, NameBySubject, Scroll_to_info, SubjectOfDistrict } from "../../Scripts/Global"
import { CardPoint } from "../../Components/Card_point/CardPoint"
import { ListPoint } from "./List_point"
import { PointMap } from "./PointMap"
import { PiListDashesBold, PiMapTrifoldDuotone } from "react-icons/pi";
import { MenuSearch } from "../../Components/MenuSearch/MenuSearch"
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export const PointList = () => {

    const initialCity = sessionStorage.getItem("search_point")
        ? JSON.parse(sessionStorage.getItem("search_point"))["CityName"]
        : '';

    const initialDistrict = sessionStorage.getItem("search_point")
        ? JSON.parse(sessionStorage.getItem("search_point"))["Subject"]
        : '';

    const { pointType } = useParams();
    const StartList = useRef(null);

    const [arr, setArr] = useState([]);
    const [arr2, setArr2] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [selectedFilter, setSelectedFilter] = useState([]);
    const [selectedFilterRating, setSelectedFilterRating] = useState([]);

    const MyCity = sessionStorage.getItem("city")
        ? JSON.parse(sessionStorage.getItem("city"))["name"]
        : '';
    const MyDistrict = sessionStorage.getItem("city")
        ? JSON.parse(sessionStorage.getItem("city"))["subject"]
        : '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/point_type/');
                setArr(response.data);
                setArr2(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {

        filterItemsCombined();
        sessionStorage.setItem("FilterType", JSON.stringify(selectedFilter));
        sessionStorage.setItem("FilterRate", JSON.stringify(selectedFilterRating));
    }, [selectedFilter, selectedFilterRating]);

    useEffect(() => {
        filterItemsCombined();
    }, []);

    const handleFilter = (selectedCategory) => {
        setSelectedFilter(prevSelectedFilter =>
            prevSelectedFilter.includes(selectedCategory)
                ? prevSelectedFilter.filter((el) => el !== selectedCategory)
                : [...prevSelectedFilter, selectedCategory]
        );

    };

    const handleFilterRating = (selectedCategory) => {
        setSelectedFilterRating(prevSelectedFilterRating =>
            prevSelectedFilterRating.includes(selectedCategory)
                ? prevSelectedFilterRating.filter((el) => el !== selectedCategory)
                : [...prevSelectedFilterRating, selectedCategory]
        );

    };

    const filterItemsCombined = () => {
        setCurrentPage(1)
        let tempItems = arr2;

        if (selectedFilterRating.length > 0) {
            tempItems = tempItems.filter(({ Rating_point }) =>
                selectedFilterRating.some(rating => Rating_point >= rating && Rating_point < (rating + 1))
            );
        }

        if (selectedFilter.length > 0) {
            tempItems = tempItems.filter(({ Categories_Point }) =>
                selectedFilter.includes(Categories_Point)
            );
        }

        setArr(tempItems);
    };

    const Rate_Array = Array.from({ length: 5 }, (_, index) => ({
        label: <Rate size="xs" defaultValue={index + 1} readOnly color="yellow" />,
        value: index + 1
    }));

    const [text, setText] = useState(initialCity);
    const [district, setDistrict] = useState(initialDistrict);
    const [Subject_name, setSubject_name] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState('')
    const sessionData = sessionStorage.getItem("search_point")

    useEffect(() => {
        if (sessionData !== null) {
            setData(JSON.parse(sessionData))
        }
    }, [])
    // useEffect(() => {
    //     if (district) {
    //         setSubject_name(NameBySubject(district));
    //     } else {
    //         setSubject_name([]);
    //     }
    // }, [district]);
    const get_Name = (datas) => {
        if (datas.CityName !== '') {
            setData(datas)
        }
    }

    useEffect(() => {
        if (typeof data !== 'string') {
            setLoading(true);
            // Обновляем загрузку через 2 секунды
            const timer = setTimeout(() => {
                Get_all_point(data.CityName, data.Subject).then((items) => {
                    setArr(items);
                    setArr2(items);
                    setLoading(false); // Останавливаем загрузку
                });
            }, 2000);
            return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
        }
    }, [data]);

    const [TabLoader, setTabLoader] = useState(false)

    return (
        <div style={{ marginBottom: "25px" }}>
            <div className={stiles.Title_block}>
                <div className={stiles.Title_info}>
                    {
                        loading ? (
                            null
                        ) : (typeof data === 'string' ? (
                            <h1>Выбирай город и ищи лучшие места.</h1>
                        ) : (
                            <h1>{data.Subject + " - " + data.CityName}</h1>
                        ))
                    }
                </div>
            </div>
            <div className={stiles.Title_menu} ref={StartList}>
                <MenuSearch set_name={get_Name} />
            </div>
            <div>
                {
                    loading ? (
                        <div style={{
                            width: "90%",
                            margin: "0 auto"
                        }} >
                            {/* <Placeholder.Paragraph graph="image" active rows={15} rowHeight={10} /> */}
                            <Placeholder.Paragraph graph="image" active
                                rows={5}
                                rowSpacing={15}
                            />
                            <br />
                            <Placeholder.Paragraph graph="image" active
                                rows={5}
                                rowSpacing={25}
                            />

                            {/* < Loader size="lg" center backdrop inverse speed="fast" /> */}
                        </div >
                    ) : (
                        typeof data === 'string' ? (
                            <div style={{
                                width: "80%",
                                margin: "15px auto",
                                padding: "15px 0px",
                            }} >

                                <div style={{ display: "flex", margin: "0 auto", justifyContent: "center" }}>
                                    {/* <Heading level={1}>Вы находитесь в: </Heading> */}
                                    <Heading level={1}>Желаете посмотреть места в вашем районе:</Heading>
                                    <button
                                        className={stiles.btn_mySity}
                                        onClick={() => {
                                            get_Name({ CityName: MyCity, Subject: MyDistrict });
                                            sessionStorage.setItem("search_point", JSON.stringify({ CityName: MyCity, Subject: MyDistrict }));
                                            location.reload()
                                        }}
                                    ><Heading level={1}> {MyDistrict} - {MyCity}?</Heading>
                                    </button>
                                </div>

                            </div>
                        ) : (
                            <div className={stiles.List_container}>
                                <Panel className={stiles.Filter_list_container}>

                                    <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
                                        <Divider><Text muted>Категории</Text></Divider>
                                        <CheckboxGroup style={{ width: "100%" }}>
                                            {
                                                Array_type().map((item, idx) => {
                                                    var categories = JSON.parse(sessionStorage.getItem("point_category")).find(({ ID }) => ID === item.value)
                                                    return <Checkbox
                                                        key={idx}
                                                        value={item.value}
                                                        onChange={handleFilter}
                                                        style={{ display: "flex", alignItems: "center", flexDirection: "row" }}
                                                    ><p style={{ display: "flex", alignItems: "center", flexDirection: "row" }}><img src={categories.icon !== (null || "") ? (`api/${categories.icon}`) : '/Location.png'} width={25} /> {item.label}</p></Checkbox>
                                                })
                                            }
                                        </CheckboxGroup>
                                    </div>
                                    <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }} bodyFill>
                                        <Divider><Text muted>Рейтинг</Text></Divider>
                                        <CheckboxGroup>
                                            <Checkbox value={0} onChange={handleFilterRating}><Rate size="xs" defaultValue={0} readOnly color="yellow" /></Checkbox>
                                            {
                                                Rate_Array.map((item, ind) => {
                                                    return <Checkbox key={ind} value={item.value} onChange={handleFilterRating}>{item.label}</Checkbox>
                                                })
                                            }
                                        </CheckboxGroup>
                                    </div>
                                </Panel>
                                <Tabs
                                    appearance="subtle"
                                    defaultActiveKey="1"
                                    className={stiles.Tabs_container}
                                    onSelect={() => {
                                        setTabLoader(true);
                                        setTimeout(() => { setTabLoader(false) }, 100)
                                    }}
                                >
                                    <Tabs.Tab eventKey="1" title="Список" icon={<PiListDashesBold size={"1.5em"} />}>
                                        {
                                            TabLoader ? <div>
                                                <Placeholder.Graph active style={{ width: "100%", height: "100%" }} />
                                            </div> : <ListPoint arr={arr} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                                        }
                                    </Tabs.Tab>
                                    <Tabs.Tab eventKey="2" title="Карта" icon={<PiMapTrifoldDuotone size={"1.5em"} />}>
                                        {
                                            TabLoader ? null : <PointMap data={arr} city={sessionData} />
                                        }

                                    </Tabs.Tab>
                                </Tabs>
                            </div>
                        ))
                }
            </div>
        </div >
    );
}