import Image from 'next/image'
import React from 'react'
import RoundButton from '../RoundButton'


const all_services = [
    {
        icon: "/images/icons/1.png",
        title: "Operation Force",
        desc: "The Special Operations Task is a multifaceted is staffed with Homeland Security."
    },
    {
        icon: "/images/icons/2.png",
        title: "Fire Suppression",
        desc: "The Special Operations Task is a multifaceted is staffed with Homeland Security."
    },
    {
        icon: "/images/icons/3.png",
        title: "Medical Services",
        desc: "The Special Operations Task is a multifaceted is staffed with Homeland Security."
    },
    {
        icon: "/images/icons/4.png",
        title: "Rescue Services",
        desc: "The Special Operations Task is a multifaceted is staffed with Homeland Security."
    },
    {
        icon: "/images/icons/5.png",
        title: "Ambulance Services",
        desc: "The Special Operations Task is a multifaceted is staffed with Homeland Security."
    },
    {
        icon: "/images/icons/6.png",
        title: "Fire Investigation",
        desc: "The Special Operations Task is a multifaceted is staffed with Homeland Security."
    },
    {
        icon: "/images/icons/7.png",
        title: "Fire Fightings",
        desc: "The Special Operations Task is a multifaceted is staffed with Homeland Security."
    },
    {
        icon: "/images/icons/8.png",
        title: "Community Safety",
        desc: "The Special Operations Task is a multifaceted is staffed with Homeland Security."
    }
]

const Services = () => {
    return (
        <section className=' bg-light py-4'>
            <div className='container responsive-height d-flex flex-column justify-content-center'>
                <label className='d-block mb-1 text-center'>We Provide the Best Rescue System in Canada</label>
                <h1 className='fw-bold text-center'>
                    <span className='border-primary border-bottom border-4'>
                        Services &
                    </span>
                    &nbsp;
                    <span className='text-primary'>
                        Facilities
                    </span>
                </h1>
                <div className='row my-3 align-items-center justify-content-between'>

                    {
                        all_services.map((service, idx) => (
                            <div className='col-12 col-sm-6 col-md-4 col-lg-3 mb-4 mt-5 mb-md-0'>
                                <div className='card-container'>
                                    <div className='d-flex flex-column text-center align-items-center'>
                                        <Image src={service.icon} width={100} height={100} rounded />
                                        <h5 className='fw-bold mt-2'>{service.title}</h5>
                                        <label>
                                            {service.desc}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='my-5 d-flex justify-content-center '>
                    <RoundButton text="View More" />
                </div>
            </div>
        </section>
    )
}

export default Services