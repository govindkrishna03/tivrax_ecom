import { Suspense } from "react";
import CheckoutClient from "../client/CheckoutClient";

const CheckoutPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <CheckoutClient />
      </Suspense>
    </div>
  );
};

export default CheckoutPage;
