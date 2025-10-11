import React from 'react'
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'

const Favourite= () => {
  return dummyShowsData.length > 0 ? (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>

      <BlurCircle top = '150px' left = '0px'/>
      <BlurCircle top = '50px' right = '50px'/>
      <h1 className = 'text-lg font-medium my-4'>Your Favourite Movies</h1>
        {dummyShowsData.map((show) => (
          <MovieCard movie={show} key={show.id} />
        ))}
    </div>
  ):(
    <div className ='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl font-bold text-center'>No Movies Available</h1>
    </div>
  )
}

export default Favourite

