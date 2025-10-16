import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route , useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favourite from './pages/Favourite'
import Footer from './components/Footer'
import {Toaster} from 'react-hot-toast'
//import { Layout } from 'lucide-react'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddShows from './pages/admin/AddShows'
import ListBooking from './pages/admin/ListBooking'
import Listshows from './pages/admin/Listshows'
//import TestToken from './components/testToken'

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  return (
    <>
    <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movie/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/favourite' element={<Favourite />} />
        <Route path = '/admin/*' element = {<Layout />  } >
          <Route index element = {<Dashboard />} />
          <Route path = "add-shows" element = {<AddShows />}/>
          <Route path = "list-shows" element = {<Listshows />} />
          <Route path = "list-bookings" element = {<ListBooking />} />

        </Route>

      </Routes>
       {!isAdminRoute && <Footer />}
      </>
      
  )
}

export default App
