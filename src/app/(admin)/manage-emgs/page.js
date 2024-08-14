import BG from "@/components/Bg";
import RecordList from "@/components/Records";
import React from "react";

const EmgPage = () => {
  return (
    <div>
      <BG />
      <div className="container py-3">
        <h2 className="text-center fw-bolder">Manage Emergency</h2>
      </div>
      <RecordList deleteAccess={true}/>
    </div>
  );
};

export default EmgPage;
