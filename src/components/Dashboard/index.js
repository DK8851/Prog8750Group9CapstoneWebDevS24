"use client"

import React from 'react'
import withAuth from '../HOC/WithAuth'
import Hero from '../Hero'
import Header from '../Header'
import Footer from '../Footer'
import AboutFirebrigade from '../AboutFirebrigade'
import Services from '../Services'
import Facts from '../Facts'

const Dashboard = ({ user }) => {
    return (
        <div>
            <Header currUser={user} />
            <Hero />
            <AboutFirebrigade />
            <Services />
            <Facts />
            <Footer />
        </div>
    )
}

export default withAuth(Dashboard)