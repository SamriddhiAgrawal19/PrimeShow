import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SessionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) return;

    axios.post("/api/booking/confirm-payment", { bookingId })
      .then(res => {
        console.log(res.data);
        // Navigate to MyBookings after 2 seconds (optional delay)
        setTimeout(() => navigate("/my-bookings"), 2000);
      })
      .catch(err => console.error(err));
  }, [searchParams, navigate]);

  return (
    <h1 className="text-center mt-20 text-xl font-semibold text-white">
      Payment Successful! Your booking is confirmed.
    </h1>
  );
}
