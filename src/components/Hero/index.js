import React from 'react'
import "./style.css"
import RoundButton from '../RoundButton'

const Hero = () => {
    return (
        <div className="vh-100 bg-image d-flex justify-content-center align-items-center">
            <div class="overlay"></div>
            <div className="text-content text-center text-white">
                <h1 className='hero-header'>
                    <span className='text-primary'>
                        Saving
                    </span> Lives
                    <br />
                    Protecting <span className='text-primary'>
                        Properties
                    </span>
                </h1>
                <p className='hero-subheader'>Community Members Saved 6000+ Lives & 9200 Acres of Forest from Fire</p>
                <div className='d-flex flex-column flex-md-row justify-content-center m-2'>
                    <RoundButton text="Read More" />
                    <RoundButton text="Call Now" variant='white' textColor="text-dark" newclass="ms-0 ms-md-3 mt-2 mt-md-0" />
                </div>
            </div>
        </div>
    )
}

export default Hero