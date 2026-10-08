import { useLocation } from "react-router-dom";

function Policies() {
  const { pathname } = useLocation();

  const policyData = {
    "/shipping-policy": {
      title: "Shipping Policy",
      content: (
        <>
          <p>
            We aim to deliver your orders safely and on time. Orders are
            processed after successful payment confirmation.
          </p>

          <p>
            Delivery time may vary depending on your location and product
            availability. You will receive order and delivery updates when
            available.
          </p>
        </>
      ),
    },

    "/privacy-policy": {
      title: "Privacy Policy",
      content: (
        <>
          <p>
            At Rivana, we respect your privacy and are committed to protecting
            your personal information.
          </p>

          <p>
            Information such as your name, email, address, and order details
            may be collected when you use our website. This information is
            used to provide and improve our services.
          </p>

          <p>
            We do not use your personal information for purposes unrelated to
            providing our services.
          </p>
        </>
      ),
    },

    "/return-policy": {
      title: "Cancellation, Return & Exchange Policy",
      content: (
        <>
          <p>
            We want you to have a smooth shopping experience. If you receive
            an eligible product that you are not satisfied with, you may
            request a return or exchange according to our policy.
          </p>

          <p>
            Products should be returned in their original condition with
            tags and packaging intact.
          </p>

          <p>
            Return and exchange requests are subject to product eligibility
            and availability.
          </p>
        </>
      ),
    },

    "/terms": {
      title: "Terms of Services",
      content: (
        <>
          <p>
            By using the Rivana website, you agree to follow these terms and
            use the website responsibly.
          </p>

          <p>
            Product prices, descriptions, availability, and other information
            may change from time to time.
          </p>

          <p>
            Orders are subject to product availability and successful payment
            confirmation.
          </p>

          <p>
            Users are responsible for providing accurate information while
            creating an account or placing an order.
          </p>

          <p>
             Rivana may update these terms when required. Changes will be
            reflected on this page.
          </p>
        </>
      ),
    },
  };

  const policy = policyData[pathname];

  if (!policy) {
    return <div>Policy not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#fffaf7] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-semibold text-gray-800">
          {policy.title}
        </h1>

        <div className="space-y-6 leading-7 text-gray-600">
          {policy.content}
        </div>
      </div>
    </div>
  );
}

export default Policies;