"use client";

import { useEffect } from "react";

import { Crisp } from "crisp-sdk-web";

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("c3f23d0e-632f-40c0-804e-b96526a1bdf8");
  }, []);
};
export default CrispChat;