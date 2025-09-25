"use client";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

export default function Reco() {
  const contact = useRef();
  const ejssid = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const ejstid = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const ejspk = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(ejssid, ejstid, contact.current, ejspk).then(
      () => {
        Swal.fire({
          title: "Success",
          text: "Message sent!",
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
        contact.current.reset();
      },
      (error) => {
        Swal.fire({
          title: "Error",
          text: "Message not sent, kindly try again!",
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
        console.error("emailjs error:", error);
      }
    );
  };

  return (
    <div className="pt-16 p-2">
      <h1 className="text-4xl py-4 text-accent">— Feedback & Suggestions</h1>
      <p className="text-normal font-normal text-base">
        Found a bug? Have a feature idea or a question?
      </p>
      <form
        ref={contact}
        onSubmit={sendEmail}
        className="flex flex-col gap-2 py-4 p-2"
      >
        <input
          name="name"
          required
          type="text"
          placeholder="Name"
          className="bg-second w-full p-2 rounded text-normal text-base"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className="bg-second w-full p-2 rounded text-normal text-base"
        />
        <input
          type="text"
          name="title"
          required
          placeholder="Subject"
          className="bg-second w-full p-2 rounded text-normal text-base"
        />
        <textarea
          name="message"
          required
          placeholder="Message..."
          className="bg-second w-full h-32 p-2 text-normal text-base"
        />
        <button
          type="submit"
          className="font-bold bg-accent p-4 rounded cursor-pointer hover:bg-[var(--color-text)] transition-colors duration-300 focus:bg-[var(--color-text)] group"
        >
          <p className="transition-colors duration-300 group-hover:text-[var(--color-accent)]">
            Send
          </p>
        </button>
      </form>
    </div>
  );
}
