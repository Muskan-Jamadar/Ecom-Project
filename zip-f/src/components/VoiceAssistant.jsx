// import { useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const PAGE_ROUTES = {
//   home: "/",
//   search: "/search",
//   cart: "/cart",
//   wishlist: "/wishlist",
//   deals: "/deals",
//   compare: "/compare",
// };

// export default function VoiceAssistant({
//   setQuery,
//   setMinPrice,
//   setMaxPrice,
//   setRating,
//   setSort,
//   onLogout,
// }) {
//   const navigate = useNavigate();
//   const recognitionRef = useRef(null);

//   const startVoice = async () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Voice recognition not supported");
//       return;
//     }

//     try {
//       await navigator.mediaDevices.getUserMedia({ audio: true });
//     } catch {
//       alert("Microphone permission required");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognitionRef.current = recognition;

//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.continuous = false;

//     recognition.onstart = () =>
//       window.dispatchEvent(new CustomEvent("voice-listening", { detail: true }));

//     recognition.onend = () =>
//       window.dispatchEvent(new CustomEvent("voice-listening", { detail: false }));

//     recognition.onresult = async (e) => {
//       const text = e.results[0][0].transcript.trim().toLowerCase();
//       recognition.stop();

//       try {
//         const res = await fetch("http://localhost:5000/ai/voice-command", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ text }),
//         });
//         const ai = await res.json();

//         // 1️⃣ Handle logout first
//         if (ai.action === "navigate" && ai.page) {
//           const pageKey = ai.page.trim().toLowerCase();

//           if (pageKey === "logout") {
//             if (onLogout) onLogout();
//             else navigate("/"); // fallback
//             return;
//           }

//           // 2️⃣ Navigate to valid page
//           if (PAGE_ROUTES[pageKey]) {
//             navigate(PAGE_ROUTES[pageKey]);
//             return;
//           }
//         }

//         // 3️⃣ Search fallback
//         if (ai.action === "search") {
//           setQuery(ai.query || text);
//           setMinPrice(ai.price_min || "");
//           setMaxPrice(ai.price_max || "");
//           setRating(ai.rating || "");
//           setSort(ai.sort_by || "");
//           navigate("/search");
//           return;
//         }

//         console.warn("Unrecognized voice command:", ai);
//       } catch (err) {
//         console.error("Voice command error:", err);
//       }
//     };

//     recognition.start();
//   };

//   // Make globally accessible for Navbar buttons
//   useEffect(() => {
//     window.startVoiceSearch = startVoice;
//     return () => {
//       window.startVoiceSearch = null;
//     };
//   }, []);

//   return null;
// }



import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PAGE_ROUTES = {
  home: "/",
  search: "/search",
  cart: "/cart",
  wishlist: "/wishlist",
  deals: "/deals",
  compare: "/compare",
};

export default function VoiceAssistant({
  setQuery,
  setMinPrice,
  setMaxPrice,
  setRating,
  setSort,
  setCategory,
  onLogout,
}) {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  const startVoice = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition not supported");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      alert("Microphone permission required");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () =>
      window.dispatchEvent(
        new CustomEvent("voice-listening", { detail: true })
      );

    recognition.onend = () =>
      window.dispatchEvent(
        new CustomEvent("voice-listening", { detail: false })
      );

    recognition.onresult = async (e) => {
      const text = e.results[0][0].transcript.trim().toLowerCase();
      recognition.stop();

      try {
        const res = await fetch("http://localhost:5000/ai/voice-command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        const ai = await res.json();

        /* -------- NAVIGATION -------- */
        if (ai.action === "navigate" && ai.page) {
          const pageKey = ai.page.toLowerCase();

          if (pageKey === "logout") {
            onLogout?.();
            return;
          }

          if (PAGE_ROUTES[pageKey]) {
            navigate(PAGE_ROUTES[pageKey]);
            return;
          }
        }

        /* -------- SEARCH (ONLY SEARCH PAGE USES THIS) -------- */
        if (ai.action === "search") {
          if (setQuery) setQuery(ai.query || text);
          if (setMinPrice) setMinPrice(ai.price_min || "");
          if (setMaxPrice) setMaxPrice(ai.price_max || "");
          if (setRating) setRating(ai.rating || "");
          if (setSort) setSort(ai.sort_by || "");
          if (setCategory) setCategory(ai.category || "");

          navigate("/search");
        }
      } catch (err) {
        console.error("Voice command error:", err);
      }
    };

    recognition.start();
  };

  /* 🌍 GLOBAL MIC ACCESS */
  useEffect(() => {
    window.startVoiceSearch = startVoice;
    return () => {
      window.startVoiceSearch = null;
    };
  }, []);

  return null;
}
