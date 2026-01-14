import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const requestOtp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    setDemoOtp(null);

    try {
      const res = await fetch("https://senapransakti.onrender.com/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP request failed");
      }

      if (data.demoOtp) {
        setDemoOtp(data.demoOtp);
        toast.success("Demo OTP generated");
      } else {
        toast.success("OTP sent to your email");
      }

      setStep(2);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://senapransakti.onrender.com/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const role = payload.role;

      login(data.token, role);
      toast.success(`Logged in as ${role}`);

      if (role === "ADMIN" || role === "COMMANDER") {
        navigate("/dashboard");
      } else if (role === "MEDIC") {
        navigate("/alerts");
      } else {
        navigate("/unauthorized");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-zinc-800 shadow-2xl space-y-6">

        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-bold">🔐 Secure Login</h2>
          <p className="text-gray-400 text-sm">
            Senapransakti Authorized Access Portal
          </p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              className="w-full p-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Email (admin@test.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={requestOtp}
              disabled={loading}
              className="w-full bg-white text-black p-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Requesting OTP..." : "Request OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">

            {/* Demo OTP visible only in demo mode */}
            {demoOtp && (
              <div className="bg-yellow-900/40 border border-yellow-500 text-yellow-300 p-2 rounded text-sm text-center">
                Demo OTP: <b>{demoOtp}</b>
              </div>
            )}

            <input
              className="w-full p-3 bg-black border border-zinc-700 rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-500 text-black p-3 rounded-lg font-semibold hover:bg-green-400 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center">
          © 2026 Senapransakti Secure Access System
        </p>
      </div>
    </div>
  );
}
