import { useEffect, useState } from "react";
import axios from "axios";
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const CarFAQs = ({ carId }) => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [showAll, setShowAll] = useState(false); // Track whether to show all FAQs
  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    if (!carId) return;

    const fetchFAQs = async () => {
      try {
        const res = await axios.get(`${API_BASE}/cars/getFAQs/${carId}`);
        setFaqs(res.data.faqs || []);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };

    fetchFAQs();
  }, [carId]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqsToShow = showAll ? faqs : faqs.slice(0, 5);

  return (
    <div className="mt-6 max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqsToShow.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg shadow-sm bg-white"
          >
            <button
                className="w-full flex justify-between items-center p-4 font-medium text-left focus:outline-none focus:ring-0"
                onClick={() => toggleFAQ(index)}
                >
                {faq.q}
                {openIndex === index ? (
                    <MinusIcon className="w-5 h-5 text-gray-700" />
                ) : (
                    <PlusIcon className="w-5 h-5 text-gray-700" />
                )}
            </button>
            {openIndex === index && (
              <div className="p-4 pt-0 text-gray-600">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {faqs.length > 5 && (
        <button
          className="mt-3 text-purple-700 font-medium hover:underline"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default CarFAQs;
