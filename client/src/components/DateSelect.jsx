import { ChevronRightIcon, ChevronLeftIcon } from 'lucide-react'
import React, { useState } from 'react'
import BlurCircle from './BlurCircle'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const DateSelect = ({ dateTime, movieId }) => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);

    const onBookHandler = () => {
        if (!selected) {
            return toast("Please select a date");
        }
        navigate(`/movies/${movieId}/${selected}`);
        window.scrollTo(0, 0);
    };

    return (
        <div id="dateSelect" className="pt-30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
                <BlurCircle top="-100px" left="-100px" />
                <BlurCircle top="-100px" right="0px" />

                <div>
                    <p className="text-lg font-semibold">Select Date</p>
                    <div className="flex items-center gap-6 text-sm mt-5">
                        <ChevronLeftIcon width={28} />
                        <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
                            {Object.keys(dateTime).map(date => {
                                const isSelected = selected === date;
                                return (
                                    <button
                                        key={date}
                                        onClick={() => setSelected(date)}
                                        className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer transition-colors duration-200 ${
                                            isSelected
                                                ? "bg-primary text-white"
                                                : "text-white border-primary/20 border hover:bg-primary/20"
                                        }`}
                                    >
                                        <span>{new Date(date).getDate()}</span>
                                        <span>
                                            {new Date(date).toLocaleDateString("en-US", {
                                                month: "short"
                                            })}
                                        </span>
                                    </button>
                                );
                            })}
                        </span>
                        <ChevronRightIcon width={28} />
                    </div>
                </div>

                <button
                    onClick={onBookHandler}
                    className="px-4 py-2 bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
                >
                    Buy Tickets
                </button>
            </div>
        </div>
    );
};

export default DateSelect;
