/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import axios from "axios";

const referenceOptions = [
  { value: "reference", label: "Reference" },
  { value: "customer", label: "Customer" },
  { value: "amount", label: "Amount" },
  { value: "payment_method", label: "Payment Method" },
  { value: "chapa_reference", label: "Chapa Reference" },
  { value: "merchant_reference", label: "Merchant Reference" },
  { value: "type", label: "Type" },
  { value: "date", label: "Date" },
];

export default function TransactionHistoryPage() {
  const [] = useState(referenceOptions[0].value);
  const [] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    per_page: 10,
    current_page: 1,
    first_page_url: "",
    next_page_url: "",
    prev_page_url: "",
  });
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  // Route name cache: { [ref_id]: routeName }
  const [routeNames, setRouteNames] = useState<{ [ref_id: string]: string }>(
    {}
  );

  // Helper to fetch transactions by URL (for pagination)
  const fetchTransactions = (
    url = "https://n7gjzkm4-3002.euw.devtunnels.ms/api/bookings/transactions"
    // "http://localhost:3006/api/payment/getAllTransactions"
  ) => {
    setLoading(true);
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const txs = Array.isArray(res.data?.transactions)
          ? res.data.transactions
          : [];
        setTransactions(txs);
        setPagination({
          per_page: res.data?.data?.pagination?.per_page || 10,
          current_page: res.data?.data?.pagination?.current_page || 1,
          first_page_url: res.data?.data?.pagination?.first_page_url || "",
          next_page_url: res.data?.data?.pagination?.next_page_url || "",
          prev_page_url: res.data?.data?.pagination?.prev_page_url || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Fetch route name for a transaction by ref_id
  const fetchRouteName = async (ref_id: string) => {
    if (!ref_id || routeNames[ref_id]) return; // Already fetched or invalid
    try {
      // 1. Get booking by ref_id
      // data looks like this {
      //   "_id": "683446614358a8b65e481a45",
      //   "userId": "682f97aaff780855b0260680",
      //   "routeId": {
      //     "_id": "682f994203b5302e980b2de4",
      //     "routeName": "Addis Ababa to Mekele",
      //     "plateNumber": "A87955",
      //     "departureTime": "2025-05-30T08:00:00.000Z",
      //     "arrivalTime": "2025-06-02T18:00:00.000Z"
      //   },
      //   "bookedSeats": [
      //     25
      //   ],
      //   "status": "attended",
      //   "totalPrice": 1500,
      //   "createdAt": "2025-05-26T10:45:53.558Z",
      //   "updatedAt": "2025-05-26T12:22:27.182Z",
      //   "transactionId": "683446614358a8b65e481a45",
      //   "paymentReferenceId": "APD6stWfPUvu7"
      // }
      // console.log({ref_id})
      const bookingRes = await axios.get(
        `https://n7gjzkm4-3002.euw.devtunnels.ms/api/bookings/reference/${ref_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const bookingData = bookingRes.data;
      const routeName = bookingData.routeId.routeName;
      const route_id = bookingData?.routeId?._id || "null";

      console.log({ bookingData, routeName, route_id });
      if (!routeName) {
        setRouteNames((prev) => ({ ...prev, [ref_id]: "N/A" }));
        return;
      } else {
        setRouteNames((prev) => ({ ...prev, [ref_id]: routeName }));
      }

      // 2. Get route name by route_id
      // const routeRes = await axios.get(`http://localhost:3002/api/routes/${route_id}`);
      // // const routeName = routeRes.data?.routeName || "N/A";
      // setRouteNames((prev) => ({ ...prev, [ref_id]: routeName }));
    } catch {
      setRouteNames((prev) => ({ ...prev, [ref_id]: "N/A" }));
    }
  };

  // When transactions change, fetch route names for visible transactions
  useEffect(() => {
    transactions.forEach((tx) => {
      if (tx.ref_id && !routeNames[tx.ref_id]) {
        fetchRouteName(tx.ref_id);
      }
    });
    // eslint-disable-next-line
  }, [transactions]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className='w-full'>
      <h1 className='text-3xl font-bold mb-6'>Transactions</h1>
      <div className='flex flex-wrap gap-3 items-center mb-6'>
        {/* ...existing filter/search UI... */}
      </div>

      {/* Table Header */}
      <div className='overflow-x-auto'>
        <table className='min-w-full text-left text-sm text-white table-fixed'>
          <thead>
            <tr className='bg-[#181C23] border-b border-[#23272F]'>
              <th className='px-4 py-1 font-semibold text-left !text-normal'>
                STATUS
              </th>
              <th className='px-4 py-1 font-semibold text-left !text-normal'>
                CUSTOMER
              </th>
              <th className='px-4 py-1 font-semibold text-left !text-normal'>
                ROUTE NAME
              </th>
              <th className='px-4 py-1 font-semibold text-left !text-normal'>
                AMOUNT
              </th>
              <th className='px-4 py-1 font-semibold text-left !text-normal'>
                PAYMENT METHOD
              </th>
              <th className='px-4 py-1 font-semibold text-left !text-normal'>
                CHAPA REFERENCE
              </th>
              <th className='px-4 py-1 font-semibold text-left !text-normal'>
                MERCHANT REFERENCE
              </th>
              <th className='px-4 py-1 font-semibold text-left !text-normal'>
                TYPE
              </th>
              <th className='px-4 py-1 font-semibold text-left !text-normal'>
                DATE
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className='text-center py-6'>
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={9} className='text-center py-6'>
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx, idx) => (
                <tr
                  key={tx.ref_id || idx}
                  className='border-b border-[#23272F] align-top cursor-pointer hover:bg-[#23272F]'
                  onClick={() => setSelectedTx(tx)}
                >
                  <td className='px-4 py-3'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tx.status?.toLowerCase() === "success"
                          ? "bg-green-900 text-green-300"
                          : tx.status?.toLowerCase() === "refunded"
                          ? "bg-cyan-900 text-cyan-300"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {(tx.first_name || "") +
                      (tx.last_name ? " " + tx.last_name : "") || "N/A"}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {routeNames[tx.ref_id] || (
                      <span className='text-gray-500'>Loading...</span>
                    )}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {tx.currency || "ETB"}{" "}
                    {Number(tx.amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  {/* ...rest of your columns... */}
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {tx.payment_method || "N/A"}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <span className='truncate max-w-[140px] block'>
                        {tx.ref_id}
                      </span>
                      <button
                        className='ml-1'
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(tx.ref_id);
                        }}
                        title='Copy'
                      >
                        <svg
                          width='14'
                          height='14'
                          fill='currentColor'
                          className='inline text-gray-400 hover:text-white'
                        >
                          <path d='M3 3v10h10V3H3zm9 9H4V4h8v8zm-1-7H5v6h6V5z' />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <span className='truncate max-w-[160px] block'>
                        {tx.merchant_reference || "N/A"}
                      </span>
                      <button
                        className='ml-1'
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(
                            tx.merchant_reference || ""
                          );
                        }}
                        title='Copy'
                      >
                        <svg
                          width='14'
                          height='14'
                          fill='currentColor'
                          className='inline text-gray-400 hover:text-white'
                        >
                          <path d='M3 3v10h10V3H3zm9 9H4V4h8v8zm-1-7H5v6h6V5z' />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {tx.type || "API"}
                  </td>
                  <td className='px-4 py-3 whitespace-nowrap'>
                    {tx.created_at
                      ? new Date(tx.created_at)
                          .toLocaleString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .replace(",", "")
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className='flex justify-end items-center gap-4 mt-4'>
        <button
          className='px-4 py-2 rounded bg-[#181C23] border border-[#23272F] text-white disabled:opacity-50'
          disabled={!pagination.prev_page_url}
          onClick={() => fetchTransactions(pagination.prev_page_url)}
        >
          &laquo; Previous
        </button>
        <span className='text-white'>Page {pagination.current_page}</span>
        <button
          className='px-4 py-2 rounded bg-[#181C23] border border-[#23272F] text-white disabled:opacity-50'
          disabled={!pagination.next_page_url}
          onClick={() => fetchTransactions(pagination.next_page_url)}
        >
          Next &raquo;
        </button>
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'>
          <div className='bg-[#181C23] rounded-lg shadow-lg w-full max-w-lg p-8 relative'>
            <button
              className='absolute top-4 right-4 text-gray-400 hover:text-white text-2xl'
              onClick={() => setSelectedTx(null)}
              title='Close'
            >
              &times;
            </button>
            <div className='mb-4 flex items-center justify-between'>
              <div>
                <div className='text-lg text-gray-400'>Total Amount</div>
                <div className='text-2xl font-bold'>
                  {selectedTx.currency || "ETB"}{" "}
                  {Number(selectedTx.amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedTx.status?.toLowerCase() === "success"
                    ? "bg-green-900 text-green-300"
                    : selectedTx.status?.toLowerCase() === "refunded"
                    ? "bg-cyan-900 text-cyan-300"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {selectedTx.status?.toUpperCase()}
              </span>
            </div>
            <div className='space-y-3'>
              <DetailRow
                label='Customer Name'
                value={selectedTx.first_name || "N/A"}
              />
              <DetailRow
                label='Customer Email'
                value={selectedTx.email || "N/A"}
              />
              <DetailRow
                label='Transaction Reference'
                value={selectedTx.ref_id}
                copy
              />
              <DetailRow
                label='Payment Processor Reference'
                value={selectedTx.processor_reference || "-"}
              />
              <DetailRow
                label='Channel'
                value={
                  <span className='inline-flex items-center gap-2'>
                    {selectedTx.payment_method ? (
                      <span className='bg-yellow-900 text-yellow-300 px-2 py-1 rounded text-xs font-semibold'>
                        Test
                      </span>
                    ) : (
                      "-"
                    )}{" "}
                  </span>
                }
              />
              <DetailRow
                label='Chapa Fees'
                value={`ETB ${Number(selectedTx.charge || 0).toLocaleString(
                  undefined,
                  { minimumFractionDigits: 2 }
                )}`}
              />
              <DetailRow
                label='Amount Received'
                value={`ETB ${(
                  Number(selectedTx.amount || 0) -
                  Number(selectedTx.charge || 0)
                ).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                bold
              />
              <DetailRow
                label='Refund Amount'
                value={`ETB ${Number(
                  selectedTx.refund_amount || 0
                ).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
              />
              <DetailRow label='Who Paid Fees?' value='You' />
              <DetailRow
                label='Settled?'
                value={
                  <span className='bg-red-900 text-red-300 px-3 py-1 rounded-full text-xs font-semibold'>
                    NO
                  </span>
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for detail rows
function DetailRow({
  label,
  value,
  copy = false,
  bold = false,
}: {
  label: string;
  value: any;
  copy?: boolean;
  bold?: boolean;
}) {
  return (
    <div className='flex items-center gap-4 border-b border-[#23272F] py-2'>
      <div className='w-1/3 text-gray-400'>{label}</div>
      <div
        className={`flex-1 flex items-center gap-2 ${
          bold ? "font-bold text-lg" : ""
        }`}
      >
        <span className='truncate'>{value}</span>
        {copy && value && (
          <button
            className='ml-1'
            onClick={() => navigator.clipboard.writeText(value)}
            title='Copy'
          >
            <svg
              width='14'
              height='14'
              fill='currentColor'
              className='inline text-gray-400 hover:text-white'
            >
              <path d='M3 3v10h10V3H3zm9 9H4V4h8v8zm-1-7H5v6h6V5z' />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
