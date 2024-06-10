import { useEffect, useState } from "react"
import { Loadered } from "../../Components/Loader/Loader"
import { Footer } from "../../Components/Footer/Footer"
import { Header } from "../../Components/Header/Header"
import { RouterProvider, createBrowserRouter, useNavigate, useParams } from "react-router-dom"
import { Home } from "../Home/Home"
import { Get_all_type, MyLatLon } from "../../Scripts/Global"
import { PointList } from "../PointList/PointList"
import { AddPoint } from "../Add_point/AddPoint"
import { User_page } from "../User/User"
import { PointPage } from "../PointPage/PointPage"


export const App = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/:pointType",
            element: <PointList />
        },
        {
            path: "/:userID/profile",
            element: <User_page />
        },
        {
            path: "/:userID/addPoint",
            element: <AddPoint />
        },
        {
            path: "/point/:pointID",
            element: <PointPage />
        }
    ])



    return <>

        <Header />
        <RouterProvider router={router} />
        <Footer />
    </>

}