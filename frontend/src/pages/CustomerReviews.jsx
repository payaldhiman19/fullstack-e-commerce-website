import { useState } from "react";
import { Star, MessageCircle, CheckCircle } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    initials: "PS",
    product: "Kurta Set",
    rating: 5,
    date: "12 Oct 2026",
    comment:
      "The kurta set is beautiful! The fabric feels comfortable, and the fitting is perfect. The color looks exactly like the pictures.",
  },
  {
    id: 2,
    name: "Ananya Verma",
    initials: "AV",
    product: "Saree",
    rating: 5,
    date: "8 Oct 2026",
    comment:
      "Loved the quality and finishing. It looks elegant and is perfect for festive occasions. Definitely worth the price.",
  },
  {
    id: 3,
    name: "Neha Gupta",
    initials: "NG",
    product: "Juttis",
    rating: 4,
    date: "4 Oct 2026",
    comment:
      "Really pretty design and comfortable to wear. The packaging was also nice. Would love to explore more styles.",
  },
  {
    id: 4,
    name: "Mehak Singh",
    initials: "MS",
    product: "Dress",
    rating: 5,
    date: "29 Sep 2026",
    comment:
      "The dress looks even better in person. The material is soft, and the overall design feels premium.",
  },
  {
    id: 5,
    name: "Simran Kaur",
    initials: "SK",
    product: "Suit Set",
    rating: 4,
    date: "24 Sep 2026",
    comment:
      "Beautiful ethnic wear with lovely detailing. The outfit was comfortable and made for a great festive look.",
  },
  {
    id: 6,
    name: "Aditi Mehra",
    initials: "AM",
    product: "Co-ord Set",
    rating: 5,
    date: "18 Sep 2026",
    comment:
      "Stylish, comfortable, and easy to dress up. I really liked the design and the overall look.",
  },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={15}
          className={
            star <= rating
              ? "fill-[#d97762] text-[#d97762]"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  const [filter, setFilter] = useState("All");

  const filteredReviews =
    filter === "All"
      ? reviews
      : reviews.filter((review) => review.rating === Number(filter));

  return (
    <main className="min-h-screen bg-[#fcfaf8] text-[#292522]">
      {/* Hero */}
      <section className="bg-[#f3e9e2] px-5 py-16 text-center sm:py-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#a65e4d]">
          The Rivana Experience
        </p>

        <h1 className="font-serif text-4xl sm:text-5xl">
          Love, in Every Detail
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
          Discover what customers think about their favourite styles,
          special occasions, and shopping experience with Rivana.
        </p>

        <div className="mt-7 flex items-center justify-center gap-3">
          <Stars rating={5} />
          <span className="text-sm font-medium">Customer love, one review at a time</span>
        </div>
      </section>

      {/* Review summary */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-6 rounded-2xl border border-[#eee5df] bg-white p-6 sm:grid-cols-3 sm:p-8">
          <div className="flex flex-col items-center justify-center border-b border-gray-100 pb-6 text-center sm:border-b-0 sm:border-r sm:pb-0">
            <p className="font-serif text-5xl">4.8</p>
            <div className="my-3">
              <Stars rating={5} />
            </div>
            <p className="text-sm text-gray-500">Overall customer rating</p>
          </div>

          <div className="flex flex-col items-center justify-center border-b border-gray-100 pb-6 text-center sm:border-b-0 sm:border-r sm:pb-0">
            <MessageCircle size={27} className="mb-3 text-[#b76e59]" />
            <p className="font-serif text-3xl">Happy Customers</p>
            <p className="mt-2 text-sm text-gray-500">
              Sharing their style stories
            </p>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <CheckCircle size={27} className="mb-3 text-[#b76e59]" />
            <p className="font-serif text-3xl">Made with Care</p>
            <p className="mt-2 text-sm text-gray-500">
              Every detail matters to us
            </p>
          </div>
        </div>

        {/* Reviews heading and filters */}
        <div className="mt-14 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#a65e4d]">
              Kind Words
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
              Customer Reviews
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              A little feedback goes a long way.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "5", "4"].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  filter === option
                    ? "border-[#292522] bg-[#292522] text-white"
                    : "border-gray-200 bg-white hover:border-[#b76e59]"
                }`}
              >
                {option === "All" ? "All Reviews" : `${option} Stars`}
              </button>
            ))}
          </div>
        </div>

        {/* Review cards */}
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-[#eee5df] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3e9e2] font-medium text-[#9b5d4c]">
                    {review.initials}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      {review.name}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">
                      {review.date}
                    </p>
                  </div>
                </div>

                <Stars rating={review.rating} />
              </div>

              <div className="mt-5 inline-block rounded-full bg-[#f8f1ed] px-3 py-1 text-xs text-[#9b5d4c]">
                {review.product}
              </div>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                “{review.comment}”
              </p>

              <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
                <CheckCircle size={14} className="text-green-700" />
                Customer feedback
              </div>
            </article>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <p className="py-12 text-center text-gray-500">
            No reviews found.
          </p>
        )}
      </section>

      {/* Bottom banner */}
      <section className="mx-5 mb-12 rounded-2xl bg-[#292522] px-6 py-12 text-center text-white sm:mx-8">
        <h2 className="font-serif text-3xl sm:text-4xl">
          Your Style Story Matters
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-300">
          Thank you for making Rivana part of your everyday moments
          and special celebrations.
        </p>
      </section>
    </main>
  );
}