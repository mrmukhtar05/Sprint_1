import { useState } from "react";
import PageHeader from "../components/PageHeader";
import api from "../api/api";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();

  const formElement = e.currentTarget;

  setLoading(true);
  setError("");

  const form = new FormData(formElement);
  const data = Object.fromEntries(form.entries());

  try {
    const response = await api.post("/contact", data);

    console.log("Contact response:", response.data);

    formElement.reset();
    setSubmitted(true);
  } catch (err) {
    console.error("Contact submit error:", err);

    setError(
      err.response?.data?.message ||
      "Could not send your message. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <PageHeader title="Contact" subtitle="Got a question? We'd love to hear from you." />
      <main className="mx-auto w-full max-w-[1200px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-black tracking-[0.3em] text-[var(--gold)]">GET IN TOUCH</p>
            <h1 className="mt-3 text-4xl font-black uppercase sm:text-5xl">LET'S TALK.</h1>
            <p className="mt-6 max-w-[500px] leading-7 text-[var(--muted)]">
              Have a question about an item, your order, or anything else? Send us a message and we'll get back to you.
            </p>
            <div className="mt-10 grid gap-5">
              {[['EMAIL','support@vintagevault.com'],['LOCATION','India'],['RESPONSE TIME','Usually within 24–48 hours']].map(([label,value]) => (
                <div key={label} className="border border-[var(--border)] bg-[var(--surface)] p-5">
                  <p className="text-xs font-black tracking-widest text-[var(--gold)]">{label}</p>
                  <p className="mt-2 font-bold">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
            {submitted ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                <div className="text-5xl text-[var(--gold)]">✓</div>
                <h2 className="mt-5 text-3xl font-black">MESSAGE SENT</h2>
                <p className="mt-3 text-[var(--muted)]">Thanks for contacting Vintage Vault.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 bg-[var(--gold)] px-6 py-3 font-black text-black">SEND ANOTHER MESSAGE</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5">
                {[['NAME','name','text','Your name'],['EMAIL','email','email','you@example.com'],['SUBJECT','subject','text','How can we help?']].map(([label,name,type,placeholder]) => (
                  <div key={name}>
                    <label className="text-xs font-black tracking-widest">{label}</label>
                    <input name={name} type={type} required placeholder={placeholder} className="mt-2 w-full border border-[var(--border)] bg-[var(--black)] px-4 py-3 outline-none transition focus:border-[var(--gold)]" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-black tracking-widest">MESSAGE</label>
                  <textarea name="message" required rows="6" placeholder="Write your message..." className="mt-2 w-full resize-none border border-[var(--border)] bg-[var(--black)] px-4 py-3 outline-none transition focus:border-[var(--gold)]" />
                </div>
                {error && <p className="border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
                <button disabled={loading} type="submit" className="mt-2 w-full bg-[var(--gold)] px-6 py-4 font-black text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? "SENDING..." : "SEND MESSAGE →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
