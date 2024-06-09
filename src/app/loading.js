import Image from "next/image";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center">
      <div className="position-relative">
        <div className="spinner-border spinner-border-purple position-absolute top-50 start-50 translate-middle" role="status"></div>
        <Image src="/images/logo.png" priority property="true" width="100" height="100" className="rounded-circle position-absolute top-50 start-50 translate-middle" alt="make poster logo" style={{ height: "7rem", width: "7rem" }} />
      </div>
    </div>

  );
}