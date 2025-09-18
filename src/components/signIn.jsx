"use client";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { googleSignUp } from "@/firebase/firebaseConfig";
import { auth } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";
import Swal from "sweetalert2";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://nexus-po8x.onrender.com"
    : "http://localhost:4000";

export default function SignIn({ setShowSignIn }) {
  const { isLogged, adminBtn, refreshUserData } = useContext(UserContext);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSignIn = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    
    setIsProcessing(true);
    
    try {
      if (isLogged) {
        // Handle logout
        await auth.signOut();
        Swal.fire({
          title: "Success",
          text: "Logout complete!",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: "var(--color-text)",
          color: "var(--color-bg)",
          iconColor: "var(--color-hulk)",
          customClass: {
            popup: "rounded-2xl shadow-lg",
            title: "text-lg font-bold text-[var(--color-hulk)]",
            htmlContainer: "text-sm",
          },
        });
        setShowSignIn(false);
      } else {
        // Handle login
        const { user, token, error } = await googleSignUp();
        
        if (error) {
          Swal.fire({
            title: "Error",
            text: "Login failed!",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
            background: "var(--color-text)",
            color: "var(--color-bg)",
            iconColor: "var(--color-accent)",
            customClass: {
              popup: "rounded-2xl shadow-lg",
              title: "text-lg font-bold text-[var(--color-accent)]",
              htmlContainer: "text-sm",
            },
          });
          return;
        }

        if (user && token) {
          try {
            const response = await fetch(`${BASE_URL}/api/users/signup`, {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                token,
              }),
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Wait a moment for Firebase auth state to propagate
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Refresh user data to ensure everything is up to date
            await refreshUserData();

            Swal.fire({
              title: "Success",
              text: "Login complete!",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
              background: "var(--color-text)",
              color: "var(--color-bg)",
              iconColor: "var(--color-hulk)",
              customClass: {
                popup: "rounded-2xl shadow-lg",
                title: "text-lg font-bold text-[var(--color-hulk)]",
                htmlContainer: "text-sm",
              },
            });
            
            setShowSignIn(false);
          } catch (err) {
            console.error("Signup error:", err);
            Swal.fire({
              title: "Error",
              text: "Login failed!",
              icon: "error",
              timer: 2000,
              showConfirmButton: false,
              background: "var(--color-text)",
              color: "var(--color-bg)",
              iconColor: "var(--color-accent)",
              customClass: {
                popup: "rounded-2xl shadow-lg",
                title: "text-lg font-bold text-[var(--color-accent)]",
                htmlContainer: "text-sm",
              },
            });
          }
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      Swal.fire({
        title: "Error",
        text: "Authentication failed!",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        background: "var(--color-text)",
        color: "var(--color-bg)",
        iconColor: "var(--color-accent)",
        customClass: {
          popup: "rounded-2xl shadow-lg",
          title: "text-lg font-bold text-[var(--color-accent)]",
          htmlContainer: "text-sm",
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowSignIn(false);
        }
      }}
      className="inset-0 z-50 backdrop-blur-xs flex items-center justify-center fixed"
    >
      <div className="flex relative justify-center bg-red-600 w-[350px] sm:w-[400px] md:w-[450px] h-[350px] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden">
        <button className="absolute cursor-pointer top-4 right-4 text-2xl sm:text-3xl md:text-4xl font-bold duration-200 hover:scale-110 active:scale-110">
          <MdClose onClick={() => setShowSignIn(false)} />
        </button>
        <div className="flex flex-col items-center justify-center gap-4">
          <button
            onClick={handleSignIn}
            disabled={isProcessing}
            className={`bg-accent px-4 py-2 rounded-full ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <p>
              {isProcessing 
                ? (isLogged ? "Logging out..." : "Signing in...") 
                : (isLogged ? "Logout" : "Sign in with Google")
              }
            </p>
          </button>
          {adminBtn && !isProcessing && (
            <button
              onClick={() => router.push("/admin")}
              className="bg-accent px-4 py-2 rounded-full"
            >
              Go to Admin Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
}