import Image from "next/image";
import React from "react";

let all_services = [
  {
    icon: "/images/rescue_team/1.png",
    title: "Row bobby",
    desc: "Fire Fighter",
  },
  {
    icon: "/images/rescue_team/2.png",
    title: "Liza Rajan",
    desc: "Rescue Doctor",
  },
  {
    icon: "/images/rescue_team/3.png",
    title: "Richal Mob",
    desc: "First Aid Officer",
  },
];

const RescueTeam = ({ teams, title }) => {
  all_services = teams || all_services;
  return (
    <section className=" bg-light py-4 mb-3">
      <div className="container responsive-height d-flex flex-column justify-content-center">
        <label className="d-block mb-1 text-center">
          {title ? title : "Rescue"} Team are always ready to help and care
        </label>
        <h1 className="fw-bold text-center">
          <span className="border-primary border-bottom border-4">
            {title ? title : "Rescue"}
          </span>
          &nbsp;
          <span className="text-primary">Team</span>
        </h1>
        <div className="row my-3 align-items-center justify-content-center">
          {all_services.map((service, idx) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 mt-5 mb-md-0">
              <div className="card-container">
                <div className="d-flex flex-column text-center align-items-center position-relative">
                  <Image src={service.icon} width={250} height={300} rounded />
                  <div className="position-absolute top-100 start-50 w-75 translate-middle bg-white px-2 py-1 shadow-lg">
                    <h5 className="fw-bold mt-2">{service.title}</h5>
                    <label className="text-primary mb-1">{service.desc}</label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RescueTeam;
