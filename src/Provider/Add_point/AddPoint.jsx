import { useParams } from "react-router-dom"
import styles from "./AddPoint.module.scss"
import { Button, ButtonGroup, Carousel, Divider, Heading, IconButton, Input, InputPicker, RadioTile, RadioTileGroup, SelectPicker, Steps, Table, Tabs, Text } from "rsuite"
import { MdAddAPhoto } from "react-icons/md"
import { TiDelete } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { useMediaQuery } from "rsuite/esm/useMediaQuery/useMediaQuery";
import { Add_point, Get_all_city, SubjectOfDistrict } from "../../Scripts/Global";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";

export const AddPoint = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const { userID } = useParams()

    const [Categories, setCategories] = useState(1)
    const [Name, setName] = useState('')
    const [City, setCity] = useState('')
    const [Adress, setAdress] = useState('')
    const [Coord, setCoord] = useState(0)
    const [Description_point, setDescription_point] = useState({})
    const [images, setImages] = useState([]);


    const [step, setStep] = useState(0);
    const onChange = nextStep => {
        setStep(nextStep < 0 ? 0 : nextStep > 3 ? 3 : nextStep);
    };

    const onNext = () => onChange(step + 1);
    const onPrevious = () => onChange(step - 1);

    const uploadImgPoint = async (Point_key) => {

        const files = images;
        let imag = files.map((file, index) => {
            const append = file.name.split('.').pop(); // Get the file extension
            const newName = `${Point_key}_${index}.${append}`;
            return new File([file], newName, { type: file.type });
        });
        const imgFile = new FormData()
        imag.forEach((image) => {
            imgFile.append('file', image)
        })
        // images

        const { data } = await axios({
            method: "post",
            url: `/api/images/point/upload`,
            data: imgFile,
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (data.valid) {
            location.reload();
        }
    };


    const SubmitePoint = async () => {
        const dataPoint = new FormData()
        dataPoint.append('Name_point', Name)
        dataPoint.append('Adress_point', Adress)
        dataPoint.append('Categories_Point', Categories)
        dataPoint.append('City', City)
        dataPoint.append('Coordinates_type_point', 'Point')
        dataPoint.append('Coordinates_point', Coord)
        dataPoint.append('Description_point', JSON.stringify(Description_point))

        const res = await Add_point(dataPoint);
        if (res.status) {
            alert(images.length)
            if (images.length >= 1) {
                alert(res.ID)
                uploadImgPoint(res.ID)
            }
        } else {
            alert(false)
        }
    }

    const cases = () => {
        switch (step) {
            case 0:
                return <Category_Selection onNext={onNext} Categories={Categories} setCategiries={setCategories} />
                break;

            case 1:
                return <Basic_Information
                    onNext={onNext}
                    onPrevious={onPrevious}
                    setName={setName}
                    Name={Name}
                    City={City}
                    Adress={Adress}
                    Coord={Coord}
                    setAdres={setAdress}
                    setCityID={setCity}
                    setCoord={setCoord}
                />
                break;
            case 2:
                return <Additional_Information onNext={onNext}
                    onPrevious={onPrevious} Description_point={Description_point} setDescription_point={setDescription_point} images={images} setImages={setImages} />
                break;
            case 3:
                return <Finale onPrevious={onPrevious} SubmitePoint={SubmitePoint} />
                break;
        }
    }

    return <>

        <div className={styles.Title_img} />
        <div className={styles.form_container}>

            <div style={{ width: "100%", }}>

                <Steps current={step} >
                    <Steps.Item title="Выбор категории" />
                    <Steps.Item title="Основная информация" />
                    <Steps.Item title="Дополнительная информация" />
                    <Steps.Item title="Завершение" />
                </Steps>
                <div style={{ width: "100%", padding: "10px", margin: "25px auto" }}>
                    {cases()}
                </div>
                {/* <ButtonGroup>
                    <Button onClick={onPrevious} disabled={step === 0}>
                        Previous
                    </Button>
                    <Button onClick={onNext} disabled={step === 3}>
                        Next
                    </Button>
                </ButtonGroup> */}

            </div>
        </div >

    </>

}

const Category_Selection = ({ onNext, setCategiries, Categiries }) => {

    const Category = JSON.parse(sessionStorage.getItem('point_category'))
    const data = Category.map(({ ID, Name_Categories }) => ({ label: Name_Categories, value: ID }))
    return <div >
        <div style={{ textAlign: "center" }}>
            <h1>
                Пожалуйста, выберите категорию, которая наилучшим образом описывает ваше туристическое место. Это поможет другим пользователям легко найти его.
            </h1>
            <RadioTileGroup value={Categiries} onChange={(v, e) => setCategiries(v)} style={{ display: "grid", overflow: "auto", gridTemplateColumns: "repeat(4 ,200px)", margin: "15px auto 0" }}>
                {
                    Category.map(({ Name_Categories, ID, Type_Point, icon }) => {
                        return <RadioTile
                            icon={<img width={25} src={icon == (null || '') ? '/Location.png' : `/api${icon}`} />}
                            label={""} value={ID}
                            style={{ textAlign: "left" }}
                        >
                            <Text style={{ fontSize: "13px" }}>{Name_Categories}</Text>
                        </RadioTile>
                    })
                }
            </RadioTileGroup>
        </div>
        <Button appearance="primary" style={{ float: "right" }} endIcon={<BsChevronCompactRight />} onClick={onNext}>Далее</Button>
        {/* <Button appearance="primary" style={{ float: "left" }} endIcon={<BsChevronCompactLeft />} onClick={onNext}>Назад</Button> */}

    </div>

}


const Basic_Information = ({ onNext, onPrevious, setName, setAdres, setCoord, setCityID, Name, Citys, Adress, Coord }) => {
    const [data, setData] = useState([])
    const [District, setDistrict] = useState([])
    const [Subject, setSubject] = useState([])
    const [City, setCity] = useState([])

    useEffect(() => {
        const timer = setTimeout(async () => {
            const dataAll = await Get_all_city()
            setData(dataAll)
            setDistrict([...new Set(dataAll.map(({ District }) => District))].map((district) => {
                return { label: district, value: district }
            }))
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    const SubOnChange = (v, e) => {
        const uniqueSubjects = [...new Set(data
            .filter((item) => item.District === v)
            .map(({ Subject }) => Subject))];

        setSubject(uniqueSubjects.map((subject) => ({ label: subject, value: subject })));
    }

    const CityOnChange = (v, e) => {
        setCity(data.filter((item) => item.Subject === v)
            .map(({ Name, ID }) => { return { label: Name, value: ID } }))
    }

    const MapClickHandler = ({ setMarkerPosition }) => {
        useMapEvents({
            click(e) {
                setMarkerPosition([e.latlng.lat, e.latlng.lng]);
                setCoord(JSON.stringify([e.latlng.lat, e.latlng.lng]))
            }
        });
        return null;
    };
    const [markerPosition, setMarkerPosition] = useState(null);
    const myCoord = JSON.parse(sessionStorage.getItem('MyCoords'))
    return <>
        <h1 style={{ textAlign: "center" }}>
            Пожалуйста, введите основную информацию, которая наилучшим образом описывает ваше туристическое место. Это поможет другим пользователям легко найти его.
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "50% 45%", gap: "15px" }}>
            <div>
                <div style={{ display: "flex", gap: "5px", flexDirection: "column", marginBottom: "5px" }}>
                    <Text muted>Название места:<Input value={Name} onChange={setName} /></Text>
                    <Text muted>Адрес:<Input value={Adress} onChange={setAdres} /></Text>
                </div>
                <div>
                    <Text muted>Выбор города:</Text>
                    <div style={{ display: "grid", gridTemplateColumns: "200px 200px 200px" }}>
                        <SelectPicker label="Округ" className={styles.SelectCity} data={District} onChange={SubOnChange} />
                        <SelectPicker label="Область" className={styles.SelectCity} data={Subject} onChange={CityOnChange} />
                        <SelectPicker value={Citys} label="Город" className={styles.SelectCity} data={City} onChange={(v, e) => setCityID(v)} />
                    </div>
                </div>
                <Button appearance="primary" style={{ float: "right" }} endIcon={<BsChevronCompactRight />} onClick={onNext}>Далее</Button>
                {/* <Button appearance="primary" style={{ float: "left" }} startIcon={<BsChevronCompactLeft />} onClick={onPrevious}>Назад</Button> */}
            </div>

            <div style={{ height: '300px', width: '100%' }}>
                <Text style={{ display: "flex", alignItems: "center" }}>Координаты:<Input value={markerPosition} readOnly /></Text>
                <MapContainer center={[myCoord.lat, myCoord.lon]} zoom={15} style={{ height: '100%', width: '100%', cursor: "pointer" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[myCoord.lat, myCoord.lon]} icon={new Icon({
                        iconUrl: "/UserLocation.png",
                        iconSize: [38, 38],
                    })} />
                    <MapClickHandler setMarkerPosition={setMarkerPosition} />
                    {markerPosition && <Marker position={markerPosition} />}
                </MapContainer>
            </div>

        </div>

    </>

}

// const imgInput = () => {

//     const [activeIndex, setActiveIndex] = useState(0);
//     const { userID } = useParams()



//     return <div className={styles.img_menu}>
//         <div style={{ position: "relative", borderRadius: "15px", boxShadow: "0 0 6px 0 gray" }}>
//             <div className={styles.Uploade_container}>
//                 {PrevImages.map((image, index) => (
//                     <div key={index}>
//                         <img
//                             key={index}
//                             src={image.previewURL}
//                             alt={`Preview ${index}`}
//                         />
//                         <TiDelete className={styles.RemoveImgBtn} size={'1.5em'} onClick={() => HandimgRemove(index)} />

//                     </div>

//                 ))}
//                 <IconButton
//                     className={styles.Uploade_btn}
//                     icon={<MdAddAPhoto size={'2.5em'} />}
//                     onClick={() => refInp.current.click()}
//                 />
//                 <input
//                     type="file"
//                     onChange={Handimg}
//                     style={{ display: "none" }}
//                     multiple
//                     ref={refInp}
//                     accept="image/*,.png,.jpg,.web,.jpeg"
//                 />
//                 {console.log(images)}
//             </div>
//         </div>

//     </div >
// }

import { RiDeleteBack2Line } from "react-icons/ri";
import { MdOutlineEdit } from "react-icons/md";
import axios from "axios";

const Additional_Information = ({ onNext, onPrevious, Description_point, setDescription_point, images, setImages }) => {

    const formDescription = useRef(null);
    const [name, setKey] = useState("")
    const [value, setValue] = useState("")

    const add_Description = (e) => {
        e.preventDefault()
        const formData = new FormData(formDescription.current);
        const name = formData.get('name');
        const text = formData.get('text');
        setDescription_point((prevDescription) => ({
            ...prevDescription,
            [name]: text
        }));
        setKey('')
        setValue('')
    }

    const deleteDescription = (key) => {
        setDescription_point((prevDescription) => {
            const newDescription = { ...prevDescription };
            delete newDescription[key];
            return newDescription;
        });
        if (name === key) {
            setKey('')
            setValue('')
        }

    };

    const editDescription = (key) => {
        setKey(key)
        setValue(Description_point[key])
    }

    const refInp = useRef(null);

    const [PrevImages, setPrevImages] = useState([]);

    const Handimg = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(file => ({
            file,
            previewURL: URL.createObjectURL(file)
        }));

        // Assuming you have useState hooks defined for PrevImages and images
        setPrevImages(prevState => [...prevState, ...previews]);
        setImages(prevState => [...prevState, ...files]);
    }

    const HandimgRemove = (indexImg) => {
        const ImagesArr = images;
        const PrevImagesArr = PrevImages;
        setImages(ImagesArr.filter((file, index) => index !== indexImg))
        setPrevImages(PrevImagesArr.filter((file, index) => index !== indexImg))
    }

    return <>
        <div style={{ display: "grid", gridTemplateColumns: "40% 60%", gridAutoRows: "100%", gap: "25px", height: "100vh" }}>
            <div>
                <Heading level={1}>Описание места</Heading>
                <form ref={formDescription} onSubmit={add_Description} style={{ display: 'grid', gridTemplateColumns: "100%", gridTemplateRows: "50px 200px 25px", gap: "15px" }}>
                    <Text >
                        Название :<br />
                        <input style={{ width: "150px" }} required type="text" name="name" value={name} onChange={(e) => setKey(e.target.value)} />
                    </Text>
                    <Text>
                        Описание: <br />
                        <textarea required rows={10} cols={50} name="text" value={value} onChange={(e) => setValue(e.target.value)} />
                    </Text>
                    <Button type="submit">Добавить</Button>
                </form>
                {/* <Text muted>Описание:<Input as="textarea" rows={4} style={{ width: "400px" }} /></Text> */}
                <table>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th>Описание</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(Description_point).map(([key, value]) => {
                            return <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                                <td><IconButton onClick={() => deleteDescription(key)} icon={<RiDeleteBack2Line color="red" />} /></td>
                                <td><IconButton onClick={() => editDescription(key)} icon={<MdOutlineEdit color="black" />} /></td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className={styles.img_menu}>
                <div style={{ position: "relative", borderRadius: "15px", boxShadow: "0 0 6px 0 gray" }}>
                    <div className={styles.Uploade_container}>
                        {PrevImages.map((image, index) => (
                            <div key={index}>
                                <img
                                    key={index}
                                    src={image.previewURL}
                                    alt={`Preview ${index}`}
                                />
                                <TiDelete className={styles.RemoveImgBtn} size={'1.5em'} onClick={() => HandimgRemove(index)} />

                            </div>

                        ))}
                        <IconButton
                            className={styles.Uploade_btn}
                            icon={<MdAddAPhoto size={'2.5em'} />}
                            onClick={() => refInp.current.click()}
                        />
                        <input
                            type="file"
                            onChange={Handimg}
                            style={{ display: "none" }}
                            multiple
                            ref={refInp}
                            accept="image/*,.png,.jpg,.web,.jpeg"
                        />
                        {console.log(images)}
                    </div>
                </div>

            </div >
        </div>
        <Button appearance="primary" style={{ float: "right" }} endIcon={<BsChevronCompactRight />} onClick={onNext}>Далее</Button>
        {/* <Button appearance="primary" style={{ float: "left" }} startIcon={<BsChevronCompactLeft />} onClick={onPrevious}>Назад</Button> */}
    </>

}

const Finale = ({ onPrevious, SubmitePoint }) => {
    return <>
        <h1>
            Пожалуйста, введите основную информацию, которая наилучшим образом описывает ваше туристическое место. Это поможет другим пользователям легко найти его.
        </h1>
        <div style={{ margin: "15px auto" }}>
            <Button onClick={SubmitePoint}>Сохранить место</Button>
        </div>
        {/* <Button appearance="primary" style={{ float: "left" }} startIcon={<BsChevronCompactLeft />} onClick={onPrevious}>Назад</Button> */}
    </>

}


