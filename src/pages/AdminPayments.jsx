
import "./AdminPayments.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiX } from "react-icons/fi";
import { supabase } from "../lib/supabase"; // make sure this path is correct

// ==============================
// ADMIN EMAIL
// ==============================
const ADMIN_EMAILS = [
  "evijecarif57@gmail.com",
];

function AdminPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // =====================================================
  // CHECK IF USER IS ADMIN
  // =====================================================
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          console.log("No user found");
          navigate("/login");
          return;
        }

        console.log("Logged in as:", user.email);

        const userEmail = user.email?.toLowerCase().trim();
        const isAllowed = ADMIN_EMAILS.some(
          (email) => email.toLowerCase().trim() === userEmail
        );

        if (!isAllowed) {
          console.log("Access denied. Not admin.");
          navigate("/member-home");
          return;
        }

        console.log("✅ Admin access granted");
        setIsAdmin(true);
        loadPayments();
      } catch (err) {
        console.error(err);
        navigate("/member-home");
      }
    };

    checkAdmin();
  }, [navigate]);
  // =====================================================
  // LOAD PENDING PAYMENTS
  // =====================================================
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("payment_requests")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setMessage("Unable to load payments.");
    } else {
      setPayments(data || []);
    }

    setLoading(false);
  };

  // =====================================================
  // CONFIRM PAYMENT
  // =====================================================
  const confirmPayment = async (payment) => {
    if (processing) return;

    try {
      setProcessing(payment.id);
      setMessage("");

      // 1. Update payment status
      const { error: updateError } = await supabase
        .from("payment_requests")
        .update({ status: "confirmed" })
        .eq("id", payment.id);

      if (updateError) throw updateError;

      // 2. Activate the plan for the user
      if (payment.plan === "pack_5") {
        // Add 5 extra chat credits
        const { data: profile } = await supabase
          .from("profiles")
          .select("extra_chat_credits")
          .eq("id", payment.user_id)
          .maybeSingle();

        await supabase
          .from("profiles")
          .update({
            extra_chat_credits: (profile?.extra_chat_credits || 0) + 5,
          })
          .eq("id", payment.user_id);
      }

      if (payment.plan === "monthly") {
        // Activate premium for 30 days
        const premiumUntil = new Date();
        premiumUntil.setDate(premiumUntil.getDate() + 30);

        await supabase
          .from("profiles")
          .update({
            premium_until: premiumUntil.toISOString(),
          })
          .eq("id", payment.user_id);
      }

      // 3. Create a notification for the user
      await supabase.from("notifications").insert({
        user_id: payment.user_id,
        type: "payment_confirmed",
        title: "🎉 Payment Confirmed!",
        message:
          payment.plan === "pack_5"
            ? "Your Chat Pack has been activated. You received +5 chat credits!"
            : "Your Monthly Premium has been activated for 30 days. Enjoy unlimited chats!",
        is_read: false,
      });

      setMessage("Payment confirmed successfully!");
      loadPayments(); // refresh list
    } catch (err) {
      console.error(err);
      setMessage("Failed to confirm payment.");
    } finally {
      setProcessing(null);
    }
  };

  // =====================================================
  // REJECT PAYMENT
  // =====================================================
  const rejectPayment = async (payment) => {
    if (processing) return;

    try {
      setProcessing(payment.id);

      await supabase
        .from("payment_requests")
        .update({ status: "rejected" })
        .eq("id", payment.id);

      setMessage("Payment rejected.");
      loadPayments();
    } catch (err) {
      console.error(err);
      setMessage("Failed to reject payment.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="admin-payments-page">
      <header className="admin-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h1>Admin - Payment Requests</h1>
      </header>

      <main className="admin-main">
        {message && <div className="admin-message">{message}</div>}

        {loading ? (
          <p>Loading payments...</p>
        ) : payments.length === 0 ? (
          <div className="empty-state">
            <p>No pending payments</p>
          </div>
        ) : (
          <div className="payments-list">
            {payments.map((payment) => (
              <div key={payment.id} className="payment-card">
                <div className="payment-info">
                  <h3>
                    {payment.plan === "pack_5"
                      ? "Chat Pack (5 chats)"
                      : "Monthly Unlimited"}
                  </h3>
                  <p>
                    <strong>Amount:</strong> {payment.amount} {payment.currency}
                  </p>
                  <p>
                    <strong>Email:</strong> {payment.user_email}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(payment.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="payment-actions">
                  <button
                    className="confirm-btn"
                    onClick={() => confirmPayment(payment)}
                    disabled={processing === payment.id}
                  >
                    <FiCheck /> Confirm
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => rejectPayment(payment)}
                    disabled={processing === payment.id}
                  >
                    <FiX /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPayments;