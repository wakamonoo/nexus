"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import NavBar from "@/components/layout/navBar";
import { SiCloudinary, SiMongodb, SiRender, SiVercel } from "react-icons/si";
import { useEffect, useState } from "react";
import GcashLogo from "@/assets/GCash_logo.svg";
import Image from "next/image";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function HeroFund() {
  const [payPalAmount, setPayPalAmount] = useState("");
  const [gCashAmount, setGCashAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const paypalID = process.env.NEXT_PUBLIC_PAYPAL_ID;
  const searchParams = useSearchParams();

  useEffect(() => {
    const isSuccess = searchParams.get("success");
    if (isSuccess === "true") {
      Swal.fire({
        title: "Success",
        text: `Thank you! Your GCash donation was received!`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-hulk)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold !text-[var(--color-hulk)]",
          htmlContainer: "text-sm",
        },
      });

      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (isSuccess === "false") {
      Swal.fire({
        title: "Error",
        text: "Unable to create GCash payment. Please try again.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold !text-[var(--color-accent)]",
          htmlContainer: "text-sm",
        },
      });

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  const handleGCashInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (!raw) {
      setGCashAmount("");
      setDisplayAmount("");
      return;
    }

    const amount = (parseInt(raw, 10) / 100).toFixed(2);
    setDisplayAmount(amount);
    setGCashAmount(raw);
  };

  const handleGCashPayment = async () => {
    if (!gCashAmount || gCashAmount <= 1999) {
      Swal.fire({
        title: "Invalid Amount",
        text: "Sorry paymongo has ₱20.00 minimum policy.",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-zeus)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold !text-[var(--color-zeus)]",
          htmlContainer: "text-sm",
        },
      });
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/payment/gcashDonate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseInt(gCashAmount, 10),
        }),
      });

      const data = await res.json();
      const redirectUrl = data?.data?.attributes?.redirect?.checkout_url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        Swal.fire({
          title: "Error",
          text:
            data?.errors?.[0]?.detail ||
            "Unable to create GCash payment. Please try again.",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          background: "var(--color-text)",
          color: "var(--color-bg)",
          iconColor: "var(--color-accent)",
          customClass: {
            popup: "rounded-2xl shadow-lg",
            title: "text-lg font-bold !text-[var(--color-accent)]",
            htmlContainer: "text-sm",
          },
        });
      }
    } catch (err) {
      console.error("GCash error:", err);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold !text-[var(--color-accent)]",
          htmlContainer: "text-sm",
        },
      });
    }
  };
  return (
    <>
      <NavBar />
      <div className="bg-brand w-full py-16 p-4">
        <div>
          <h1 className="text-2xl py-4 text-accent text-center">
            Why I Need Your Support
          </h1>
          <p className="text-base text-justify">
            At the moment, this website runs entirely on free-tier services,
            meaning every part of it is built and maintained with limited
            resources. As the developer behind this project, I’ve poured time
            and effort into making it functional and meaningful, but keeping it
            alive and improving it long-term requires more than just time, it
            needs a bit of funding support too.
          </p>
          <br />
          <ul className="text-base text-justify list-disc list-inside">
            Your donations will directly help me sustain and grow this platform
            by covering essential costs like:
            <li className="text-vibe flex gap-2 p-2">
              <SiRender className="text-2xl" />
              <p>
                <strong>Render</strong> - for stable and reliable server-side
                hosting
              </p>
            </li>
            <li className="text-vibe flex gap-2 p-2">
              <SiMongodb className="text-2xl" />
              <p>
                <strong>MongoDB</strong> - for maintaining a secure and scalable
                database
              </p>
            </li>
            <li className="text-vibe flex gap-2 p-2">
              <SiCloudinary className="text-2xl" />
              <p>
                <strong>Cloudinary</strong> - for cloud-based image and media
                storage
              </p>
            </li>
            <li className="text-vibe flex gap-2 p-2">
              <SiVercel className="text-2xl" />
              <p>
                <strong>Vercel</strong> - for acquiring a proper custom domain
                and deployment resources
              </p>
            </li>
          </ul>
          <br />
          <p className="text-base text-justify">
            Every small contribution helps keep the site running smoothly and
            ensures I can continue improving it, from better performance and new
            features to a more polished experience for everyone.
            <br />
            <br />
            If you’ve found this site useful, enjoyable, or worth supporting,
            consider donating through <strong>PayPal</strong> or{" "}
            <strong>GCash</strong>. Your support means a lot, it keeps the
            project alive and helps it grow.
          </p>
        </div>
        <div className="p-4 bg-second rounded flex flex-col gap-2 items-center justify-center mt-6">
          <div className="flex items-center justify-center gap-2 w-full bg-text p-2 rounded">
            <span className="text-vibe text-base">$</span>
            <input
              id="donation_amount"
              type="number"
              placeholder="Enter amount in USD"
              step="0.01"
              value={payPalAmount}
              onChange={(e) => setPayPalAmount(e.target.value)}
              className="w-64 outline-none text-panel text-base text-center font-bold"
            />
          </div>

          <PayPalScriptProvider
            options={{ "client-id": paypalID, currency: "USD" }}
          >
            <PayPalButtons
              className="w-full"
              style={{ layout: "vertical", shape: "pill", color: "gold" }}
              createOrder={(data, actions) =>
                actions.order.create({
                  purchase_units: [
                    {
                      amount: { value: payPalAmount || 1 },
                    },
                  ],
                })
              }
              onApprove={(data, actions) =>
                actions.order.capture().then((details) => {
                  Swal.fire({
                    title: "Success",
                    text: `Thank you, ${details.payer.name.given_name}! your donation was received!`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                    background: "var(--color-text)",
                    color: "var(--color-bg)",
                    iconColor: "var(--color-hulk)",
                    customClass: {
                      popup: "rounded-2xl shadow-lg",
                      title: "text-lg font-bold !text-[var(--color-hulk)]",
                      htmlContainer: "text-sm",
                    },
                  });
                })
              }
              onError={(err) => {
                console.error("Paypal checkout failed", err);
                Swal.fire({
                  title: "Error",
                  text: "Donation failed. Please try again.",
                  icon: "error",
                  timer: 2000,
                  showConfirmButton: false,
                  background: "var(--color-text)",
                  color: "var(--color-bg)",
                  iconColor: "var(--color-accent)",
                  customClass: {
                    popup: "rounded-2xl shadow-lg",
                    title: "text-lg font-bold !text-[var(--color-accent)]",
                    htmlContainer: "text-sm",
                  },
                });
              }}
            />
          </PayPalScriptProvider>
        </div>

        <div className="p-4 bg-second rounded flex flex-col gap-2 items-center justify-center mt-6">
          <div className="flex items-center justify-center gap-2 w-full bg-text p-2 rounded">
            <span className="text-vibe text-base">₱</span>
            <input
              id="donation_amount"
              type="number"
              inputMode="numeric"
              placeholder="Enter amount in PHP"
              step="1"
              value={displayAmount}
              onChange={handleGCashInput}
              className="w-64 text-panel outline-none text-base text-center font-bold"
            />
          </div>
          <button
            onClick={handleGCashPayment}
            className="bg-panel cursor-pointer p-2 w-full rounded-full flex items-center justify-center gap-2"
          >
            <Image
              src={GcashLogo}
              alt="file"
              width={0}
              height={0}
              sizes="100vw"
              className="w-24 h-auto object-cover"
            />
            <p className="text-xs text-vibe font-bold">via paymongo</p>
          </button>
          <p className="text-vibe text-sm font-bold opacity-70">
            or directly at:
          </p>
          <p className="font-bold">09934937214</p>
        </div>
      </div>
    </>
  );
}
