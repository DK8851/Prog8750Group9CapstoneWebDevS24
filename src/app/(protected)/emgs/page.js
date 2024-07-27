import BG from "@/components/Bg";
import RecordList from "@/components/Records";
import React from "react";

const EmgPage = () => {
  return (
    <div>
      <BG />
      <div className="container py-3">
        <h2 className="text-center fw-bolder">Emergency</h2>
      </div>
      <RecordList />
    </div>
  );
};

export default EmgPage;
