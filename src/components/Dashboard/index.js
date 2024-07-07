"use client";

import React from "react";
import withAuth from "../HOC/WithAuth";
import Hero from "../Hero";
import Header from "../Header";
import Footer from "../Footer";
import AboutFirebrigade from "../AboutFirebrigade";
import Services from "../Services";
import Facts from "../Facts";
import RescueTeam from "../RescueTeam";

const Dashboard = ({ user, userRole }) => {
  return (
    <div>
      <Header currUser={user} userRole={userRole} />
      <Hero />
      <AboutFirebrigade />
      <Services />
      <Facts />
      <RescueTeam />
      <Footer />
    </div>
  );
};

export default withAuth(Dashboard);
