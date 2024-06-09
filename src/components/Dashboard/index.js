"use client"

import React from 'react'
import withAuth from '../HOC/WithAuth'
import Hero from '../Hero'
import Header from '../Header'
import Footer from '../Footer'

const Dashboard = ({ user }) => {
    return (
        <div>
            <Header currUser={user} />
            <Hero />
            <Footer />
        </div>
    )
}

export default withAuth(Dashboard)