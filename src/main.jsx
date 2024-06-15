import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import "./assets/_module.scss"
import 'rsuite/dist/rsuite-no-reset.min.css';
import { App } from './Provider/App/App'
import { AuthContext, AuthProvider } from './Scripts/AuthContext';
import { Get_all_category, Get_all_type, MyLatLon, Users, get_all_tag } from './Scripts/Global';
import { CustomProvider, DatePicker } from 'rsuite';
import { ruRU, enUS, enGB } from 'rsuite/esm/locales';
import axios from 'axios';


window.onload = () => {

  MyLatLon()
  Get_all_type()
  Get_all_category()
  get_all_tag()
  Users()
}

const Calendar = {
  sunday: 'Su',
  monday: 'Mo',
  tuesday: 'Tu',
  wednesday: 'We',
  thursday: 'Th',
  friday: 'Fr',
  saturday: 'Sa',
  ok: 'OK',
  today: 'Today',
  yesterday: 'Yesterday',
  hours: 'Hours',
  minutes: 'Minutes',
  seconds: 'Seconds',
  /**
   * Format of the string is based on Unicode Technical Standard #35:
   * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
   **/
  formattedMonthPattern: 'MMM yyyy',
  formattedDayPattern: 'dd MMM yyyy',
  dateLocale: enUS
};

const locale = {
  dateLocale: ruRU,
  Pagination: {
    more: 'More',
    prev: 'Предыдушая',
    next: 'Следующая',
    first: 'Первая',
    last: 'Последняя',
    limit: '{0} записей',
    // total: 'Total Rows: {0}',
    skip: 'Перейти к{0}'
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CustomProvider locale={locale}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </CustomProvider>
  </React.StrictMode>
)
