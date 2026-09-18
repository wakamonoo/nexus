"use client";
import NavBar from "@/components/layout/essentials/navBar";
import { useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { SiCloudinary, SiMongodb, SiRender, SiVercel } from "react-icons/si";
import { useState } from "react";
import QR from "@/assets/gcash.jpg";
import Image from "next/image";
import Swal from "sweetalert2";

const listItemClass =
  "relative pl-5 before:absolute before:left-1 before:top-[0.75em] before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-accent/60";

const sections = [
  {
    number: "01",
    title: "Why I Need Your Support",
    content: (
      <p>
        Nexus is independently built and maintained as a fan project. The
        platform currently relies on free-tier services, but keeping it
        available and improving it over time comes with ongoing costs
      </p>
    ),
  },
  {
    number: "02",
    title: "What Your Support Helps With",
    content: (
      <>
        <p>
          Donations help cover the services and infrastracture that keep Nexus
          running, including
        </p>
        <ul className="space-y-2">
          <li className={listItemClass}>
            <SiRender className="shrink-0 text-xl" />
            <span>
              <strong>Render</strong> — server-side hosting
            </span>
          </li>
          <li className={listItemClass}>
            <SiMongodb className="shrink-0 text-xl" />
            <span>
              <strong>MongoDB</strong> — database infrastracture
            </span>
          </li>
          <li className={listItemClass}>
            <SiCloudinary className="shrink-0 text-xl" />
            <span>
              <strong>Cloudinary</strong> — image and media storage
            </span>
          </li>
          <li className={listItemClass}>
            <SiVercel className="shrink-0 text-xl" />
            <span>
              <strong>Vercel</strong> — deployment and web infrastracture
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "03",
    title: "Support the Project",
    content: (
      <>
        <p>
          If you've found Nexus useful or simply want to help keep the project
          going, you can support its development through GCash, PayPal or Ko-fi.
        </p>
        <p>
          Every contribution, regardless of size, helps with hosting,
          infrastracture, and future improvements.
        </p>
      </>
    ),
  },
];

export default function HeroFund() {
  const [amount, setAmount] = useState("");
  const paypalID = process.env.NEXT_PUBLIC_PAYPAL_ID;

  useEffect(() => {
    const container = document.getElementById("kofi-widget");

    if (!container) return;

    const script = document.createElement("script");

    script.src = "https://storage.ko-fi.com/cdn/widget/Widget_2.js";
    script.type = "text/javascript";
    script.onload = () => {
      if (window.kofiwidget2) {
        window.kofiwidget2.init(
          "support Nexus on kofi",
          "#ed1d24",
          "U5F225NGUC",
        );

        container.innerHTML = window.kofiwidget2.getHTML();
      }
    };

    container.appendChild(script);

    return () => {
      script.remove();
      container.html = "";
    };
  }, []);

  return (
    <>
      <NavBar />
      <div className="bg-brand w-full pt-22 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <header className="mb-12 border-b border-panel pb-10">
          <h1 className="text-2xl font-bold tracking-tight text-vobe">
            Support Nexus
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 opacity-60">
            Help keep the platform running and support its continued
            decelopment.
          </p>
        </header>
        <div className="mb-10 rounded-xl border border-accent/15 bg-accent/4 p-4">
          <p className="text-sm leading-7 opacity-60">
            Nexus is an independent fan project. Your support helps cover the
            infrastracture's needs to keep the platform available and growing.
          </p>
        </div>
        <div className="divide-y divide-(--color-panel)">
          {sections.map((section) => (
            <section
              key={section.number}
              className="grid grid-cols-[110px_1fr] py-8"
            >
              <div>
                <span className="text-sm font-bold tracking-[0.2em] text-accent/60">
                  {section.number}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="mb4 text-lg font-semibold tracking-tight text-vibe">
                  {section.title}
                </h2>
                <div className="space-y-4 text-base leading-tight text-vibe">
                  {section.content}
                </div>
              </div>
            </section>
          ))}
          <section className="grid grid-cols-[70px_1fr] md:grid-cols-[110px_1fr] gap-4 py-8">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-accent/60">
                04
              </span>
            </div>

            <div className="min-w-0">
              <h2 className="mb4 text-lg font-semibold tracking-tight text-vibe">
                Donate
              </h2>
              <div className="flex flex-col items-center gap-6 rounded-xl border border-panel bg-second p-4 md:flex-row md:items-start md:justify-center">
                <div className="flex flex-col items-center">
                  <p className="mb-3 text-sm font-semibold text-vibe">GCash</p>
                  <Image
                    src={QR}
                    alt="file"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-32 h-auto object-cover"
                  />
                </div>
                <div className="hidden h-32 w-px bg-panel md:block" />
                <div className="flex w-full max-w-xs flex-col items-center">
                  <p className="mb-3 text-sm font-semibold text-vibe">PayPal</p>
                  <div className="mb-2 flex w-full items-center gap-2 rounded bg-text p-2">
                    <span className="text-base text-vibe">$</span>
                    <input
                      id="donation_amount"
                      type="number"
                      placeholder="Enter amount in USD"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full text-panel outline-none text-base text-center font-bold"
                    />
                  </div>
                  <div className="relative z-0 w-full">
                    <PayPalScriptProvider
                      options={{ "client-id": paypalID, currency: "USD" }}
                    >
                      <PayPalButtons
                        className="w-full"
                        style={{
                          layout: "vertical",
                          shape: "pill",
                          color: "gold",
                        }}
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
                              toast: true,
                              position: "bottom-start",
                              title: `Thank you, ${details.payer.name.given_name}! your donation was received!`,
                              icon: "success",
                              timer: 2000,
                              showConfirmButton: false,
                              background: "var(--color-secondary)",
                              iconColor: "var(--color-hulk)",
                              customClass: {
                                popup:
                                  "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
                                title:
                                  "!text-base !font-semibold !text-(--color-text) !leading-4.5",
                              },
                            });
                          })
                        }
                        onError={(err) => {
                          console.error("Paypal checkout failed", err);
                          Swal.fire({
                            toast: true,
                            position: "bottom-start",
                            title: "Donation failed, kindly try again!",
                            icon: "error",
                            timer: 2000,
                            showConfirmButton: false,
                            background: "var(--color-secondary)",
                            iconColor: "var(--color-accent)",
                            customClass: {
                              popup:
                                "!w-full !max-w-xs !inline-flex !items-center !justify-center !border !border-(--color-panel) !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
                              title:
                                "!text-base !font-semibold !text-(--color-text) !leading-4.5",
                            },
                          });
                        }}
                      />
                    </PayPalScriptProvider>
                  </div>
                </div>
                <div className="hidden h-32 w-px bg-panel md:block" />
                <div className="flex min-w-32 flex-col items-center">
                  <p className="mb-3 text-sm font-semibold text-vibe">Ko-fi</p>
                  <div id="kofi-widget" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
