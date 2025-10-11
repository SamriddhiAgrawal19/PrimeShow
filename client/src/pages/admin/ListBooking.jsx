import React from 'react'
import { dummyBookingData } from '../../assets/assets';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import dateFormat from '../../lib/DateFormat';
import Title from '../../components/admin/Title';

const ListBooking = () => {
    const currency = import.meta.env.VITE_CURRENCY;
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const getAllbookings = async () => {
        setBookings(dummyBookingData)
        setLoading(false)
    }
    useEffect(() => {
        getAllbookings();
    }, []);

  return !loading ? (
    <>
    <Title text1 = "List" text2 = "Bookings" />
    <div className = "max-w-4xl mt-6 overflow-x-auto mx-auto">
        <table className = "w-full border-collapse rounded-md overflow-hidden text-nowrap">
            <thead>
                <tr className = "bg-primary/20 text-left text-white">
                    <th className = "p-2 font-medium pl-5">User Name</th>
                    <th className = "p-2 font-medium">Movie Name</th>
                    <th className = "p-2 font-medium">Show Time</th>
                    <th className = "p-2 font-medium">Seats</th>
                    <th className = "p-2 font-medium">Amount</th>
                </tr>
            </thead>
            <tbody className = "text-sm font-light">
                {bookings.map((item , index) => (
                    <tr key = {index} className = "border-b border-primary/20 hover:bg-primary/10 text-white bg-primary/8">
                        <td className = "p-2 pl-5">{item.user.firstName} {item.user.name}</td>
                        <td className = "p-2">{item.show.movie.title}</td>
                        <td className = "p-2">{dateFormat(item.show.showDateTime)}</td>
                        <td className = "p-2">{Object.keys(item.bookedSeats).map(seat=>item.bookedSeats[seat]).join(",")}</td>
                        <td className = "p-2">{currency} {currency}{item.amount}</td>
                    </tr>
                ))}
            </tbody>
            </table>

            </div>
      
    </>
  ) : (
    <Loading />
  );
}

export default ListBooking
