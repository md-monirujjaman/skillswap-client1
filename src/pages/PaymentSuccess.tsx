import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  const proposal_id = searchParams.get("proposal_id");
  const [status, setStatus] = useState("Processing your payment...");
  const [taskName, setTaskName] = useState("");
  const [workerName, setWorkerName] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!session_id || !proposal_id) {
       setStatus("Invalid payment session.");
       return;
    }

    axios.post("/api/payment/confirm-session", { session_id, proposal_id })
      .then(res => {
        if (res.data.success || res.data.message === "Already processed") {
          setStatus("Payment Successful!");
          setTaskName(res.data.task?.title || "your task");
          setWorkerName(res.data.proposal?.freelancer_email || "the freelancer");
          setAmount(res.data.proposal?.proposed_budget || 0);
        }
      })
      .catch(err => {
        setStatus("Payment verification failed. Please contact support.");
      });

  }, [session_id, proposal_id]);

  return (
    <div className="max-w-xl mx-auto mt-20 bg-white dark:bg-gray-900 mx-4 p-10 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">{status}</h1>
        {status === "Payment Successful!" && (
          <p className="text-gray-500 max-w-md mx-auto font-medium">
            Your transaction has been processed securely. 
          </p>
        )}
      </div>

      {status === "Payment Successful!" && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
           <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
             <div className="text-sm text-gray-500 dark:text-gray-400 font-medium font-medium">Amount Paid</div>
             <div className="text-2xl font-bold text-gray-900 dark:text-white">${amount}</div>
           </div>
           <div className="space-y-3 text-sm">
             <div className="flex justify-between">
               <span className="text-gray-500 dark:text-gray-400 font-medium">Task Title</span>
               <span className="font-semibold text-gray-900 dark:text-white">{taskName}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-500 dark:text-gray-400 font-medium">Worker</span>
               <span className="font-semibold text-gray-900 dark:text-white">{workerName}</span>
             </div>
           </div>
        </div>
      )}

      <div className="text-center">
        <Link to="/dashboard/client" className="inline-block bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-md font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
