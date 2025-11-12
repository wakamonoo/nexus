"use client";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import NavBar from "@/components/layout/navBar";
import RegularButtons from "@/components/buttons/regBtns";

export default function Recommendations() {
  const contact = useRef();
  const ejssid = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const ejstid = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const ejspk = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(ejssid, ejstid, contact.current, ejspk).then(
      () => {
        Swal.fire({
          toast: true,
          position: "bottom-start",
          title: "Message sent!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "var(--color-secondary)",
          iconColor: "var(--color-hulk)",
          customClass: {
            popup:
              "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
            title:
              "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
          },
        });
        contact.current.reset();
      },
      (error) => {
        Swal.fire({
          toast: true,
          position: "bottom-start",
          title: "Message not sent, please try again later!",
          icon: "error",
          timer: 2000,
          showConfirmButton: false,
          background: "var(--color-secondary)",
          iconColor: "var(--color-accent)",
          customClass: {
            popup:
              "!w-full !max-w-xs !inline-flex !items-center !justify-center !border-1 !border-[var(--color-panel)] !text-normal !rounded-lg !shadow-lg !px-4 !py-2",
            title:
              "!text-base !font-semibold !text-[var(--color-text)] !leading-4.5",
          },
        });
        console.error("emailjs error:", error);
      }
    );
  };

  return (
    <>
      <NavBar />
      <div className="bg-brand w-full py-16 p-2 sm:px-4 md:px-8 lg:px-16 xl:px-32">
        <h1 className="text-2xl py-4 text-accent text-center">
          Feedback & Suggestions
        </h1>
        <p className="text-normal font-normal text-base text-justify">
          Found an issue or have an idea to enhance the platform? We value your
          feedback, it helps us refine features, resolve issues, and shape
          upcoming improvements. Every suggestion, report, and insight you share
          contributes to building a better, more seamless experience for
          everyone in the Nexus community.
        </p>
        <div className="py-4">
          <form
            ref={contact}
            onSubmit={sendEmail}
            className="flex flex-col gap-2"
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
            <RegularButtons type="submit">
              <p className="font-bold text-normal text-base">Send</p>
            </RegularButtons>
          </form>
        </div>
        <p className="flex justify-center py-4 text-xs text-vibe">
          or reach me on
        </p>
        <div className="flex gap-2 items-center justify-center">
          <a href="https://www.facebook.com/joven.serdanbataller">
            <FaFacebook className="text-4xl cursor-pointer text-vibe hover:text-[var(--color-text)] active:text-[var(--color-text)]" />
          </a>
          <a href="https://www.instagram.com/wakamonoooo/">
            <FaInstagram className="text-4xl cursor-pointer text-vibe hover:text-[var(--color-text)] active:text-[var(--color-text)]" />
          </a>
          <a href="https://www.linkedin.com/in/joven-bataller-085761350/">
            <FaLinkedin className="text-4xl cursor-pointer text-vibe hover:text-[var(--color-text)] active:text-[var(--color-text)]" />
          </a>
          <a href="https://github.com/wakamonoo">
            <FaGithub className="text-4xl cursor-pointer text-vibe hover:text-[var(--color-text)] active:text-[var(--color-text)]" />
          </a>
        </div>
      </div>
    </>
  );
}