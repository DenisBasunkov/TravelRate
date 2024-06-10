import { Divider } from "rsuite";
import { CardPoint } from "../../Components/Card_point/CardPoint";
import stiles from "./PointList.module.scss"
import { useState } from "react";

export const ListPoint = ({ arr, currentPage, setCurrentPage }) => {


    const [postPerPage, setPostPerPage] = useState(9);

    const lastPointIndex = currentPage * postPerPage;
    const firstPostIndex = lastPointIndex - postPerPage;
    const currentData = arr.slice(firstPostIndex, lastPointIndex);
    const Categories = JSON.parse(sessionStorage.getItem("point_category")) || []

    return <div style={{ width: "100%" }}>
        {currentData.length <= 0 ? (
            <div style={{ height: "25vh", margin: "0px auto" }}>
                <h1>Нет данных</h1>
            </div>
        ) : (
            <div>
                <div className={stiles.List_card_point}>
                    {currentData.map((item) => {
                        var categories = Categories.find(({ ID }) => ID === item.Categories_Point)
                        return < CardPoint key={item.ID} data={item} categories={categories} />
                    }
                    )}
                </div>
                {
                    postPerPage >= arr.length ? <Divider>
                        <button className={stiles.ButtonPagination} onClick={() => { setPostPerPage(9); StartList.current.scrollIntoView({ behavior: 'smooth' }); }}>Вернуть назад</button>
                    </Divider>
                        : <Divider>
                            <button className={stiles.ButtonPagination} onClick={() => { setPostPerPage(postPerPage + 9) }}>Далее</button>
                            {
                                postPerPage <= 9 ? null :
                                    <button className={stiles.ButtonPagination} onClick={() => { setPostPerPage(postPerPage - 9) }}>Назад</button>
                            }
                        </Divider>
                }

                {/* <Pagination
    size="lg"
    boundaryLinks
    maxButtons={10}
    next
    ellipsis
    prev
    // limitOptions={[10, 20, 30]}
    total={arr.length}
    // onChangeLimit={setPostPerPage}
    limit={postPerPage}
    activePage={currentPage}
    onChangePage={(page) => {
        StartList.current.scrollIntoView({ behavior: 'smooth' });
        setCurrentPage(page);
    }}
    layout={['|', '-', 'skip', '|', 'pager', '|', '-', '|']}
/> */}
                {/* 'limit', */}
            </div >
        )}
    </div >


}