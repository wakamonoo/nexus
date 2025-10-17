"use client";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import NavBar from "@/components/layout/navBar";
import { SiCloudinary, SiMongodb, SiRender, SiVercel } from "react-icons/si";
import { useState } from "react";
import QR from "@/assets/gcash.jpg";
import Image from "next/image";
import Swal from "sweetalert2";

export default function HeroFund() {
  const [amount, setAmount] = useState("");
  const paypalID = process.env.NEXT_PUBLIC_PAYPAL_ID;
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
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-vibe font-bold mb-2">
              Help the cause with GCash:
            </p>
            <Image
              src={QR}
              alt="file"
              width={0}
              height={0}
              sizes="100vw"
              className="w-32 h-auto object-cover"
            />
          </div>
          <p className="text-sm text-vibe font-bold mb-2">or via PayPal:</p>
          <div className="flex items-center justify-center gap-2 w-full bg-text p-2 rounded">
            <span className="text-vibe text-base">$</span>
            <input
              id="donation_amount"
              type="number"
              placeholder="Enter amount in USD"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-64 text-panel outline-none text-base text-center font-bold"
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
                      amount: { value: amount || 1 },
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
      </div>
    </>
  );
}
