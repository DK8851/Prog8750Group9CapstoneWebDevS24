import Image from 'next/image';
import React from 'react';
import "./style.css";

const Facts = () => {
    return (
        <section className=' bg-img'>
            <div className='container responsive-height d-flex flex-column justify-content-center'>
                <div className='row align-items-center justify-content-between'>
                    <div className='col-12 my-5 col-md-6 text-center'>
                        <Image
                            src="/images/man.png"
                            width={400}
                            height={400}
                            className='img-fluid rounded'
                            alt='About Firebrigade'
                        >

                        </Image>
                    </div>
                    <div className='col-12 col-md-6 mb-4 mb-md-0 text-white'>
                        <div>
                            <label className='d-block mb-3'>Youth Fire Stop Prevention & Intervention Program.</label>
                            <h1 className='fw-bold'>
                                <span className='border-primary border-bottom border-4'>
                                    Few
                                </span>
                                &nbsp;
                                <span className='text-primary'>
                                    Facts
                                </span>
                            </h1>
                            <div className='mt-3'>
                                <span>
                                    Every live, every property we save does matter, consectetur adipisicing elit, sed
                                    do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                    minim veniam, quis nostrud.
                                </span>
                            </div>

                            <div className='row row-cols-2 my-4'>
                                <div className='col d-flex flex-column align-items-center p-4 border-bottom border-end'>
                                    <h1 className='fw-bold'>404</h1>
                                    <label>Emergencies</label>
                                </div>
                                <div className='col d-flex flex-column align-items-center p-4 border-bottom'>
                                    <h1 className='fw-bold'>501</h1>
                                    <label>Traffic Crashes</label>
                                </div>
                                <div className='col d-flex flex-column align-items-center p-4 border-end'>
                                    <h1 className='fw-bold'>401</h1>
                                    <label>Fire Emergencies</label>
                                </div>
                                <div className='col d-flex flex-column align-items-center p-4 '>
                                    <h1 className='fw-bold'>99</h1>
                                    <label>Year of Experience</label>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Facts;
