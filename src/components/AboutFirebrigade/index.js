import Image from 'next/image';
import React from 'react';
import "./style.css";

const AboutFirebrigade = () => {
    return (
        <section className='container my-5 responsive-height d-flex flex-column justify-content-center'>

            <div className='row align-items-center justify-content-between'>
                <div className='col-12 col-md-6 mb-4 mb-md-0'>
                    <div>
                        <label className='d-block mb-3'>We Provide the Best Rescue System in Canada</label>
                        <h1 className='fw-bold'>
                            <span className='border-primary border-bottom border-4'>
                                About
                            </span>
                            &nbsp;
                            <span className='text-primary'>
                                Firebrigade
                            </span>
                        </h1>
                        <ul className='mt-3'>
                            <li>At RapidAid, protection is fundamental. Our system ensures your safety with state-of-the-art technology and a community-driven approach.</li>
                            <li>Our platform brings together community members to report and respond to emergencies swiftly, making sure help is always at hand.</li>
                        </ul>

                        <h3 className='mt-4 fw-bold'>
                            Precautionary Tips
                        </h3>
                        <ul className='mt-2'>
                            <li>Always have a fire extinguisher readily available to tackle small fires.</li>
                            <li>In case of smoke or chemical exposure, use masks to protect your respiratory system.</li>
                            <li>Good ventilation can prevent the buildup of harmful fumes and smoke.</li>
                            <li>Regularly check safety equipment and stay informed about safety procedures.</li>
                        </ul>
                    </div>
                </div>
                <div className='col-12 col-md-6 text-center position-relative'>
                    <Image
                        src="/images/about.png"
                        width={400}
                        height={400}
                        className='img-fluid rounded'
                        alt='About Firebrigade'
                    >

                    </Image>
                    <div className='box position-absolute'>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutFirebrigade;
