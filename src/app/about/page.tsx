import Link from "next/link";
import { feedbackHref } from "@/lib/pilot";

export const metadata = { title: "About & Privacy | BoardBrain" };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 text-sm text-slate-300 leading-relaxed">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white">About BoardBrain & your privacy</h1>
        <p className="text-xs text-slate-400 mt-1">An open pilot by SchoolOS and Education Trust Nasra Schools, Karachi.</p>
      </div>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">What BoardBrain is</h2>
        <p>
          A free study helper for Matric (Class 9 and 10) students preparing for the Karachi Board (BSEK) and AKU-EB
          exams. It has real Karachi Board past papers typed from the original papers, a step-by-step numerical solver,
          ready answers in Roman Urdu and board English, MCQ practice and an AI Guru for questions.
        </p>
        <p>
          This is an <b className="text-white">open pilot</b>: anyone can use it without an account while we learn what helps students most.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">What we collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li><b className="text-white">No names, no emails, no phone numbers, no accounts.</b> You do not sign up.</li>
          <li>Your practice history, Mistake Vault and streak are saved <b className="text-white">only on your own phone or computer</b> (in the browser). We cannot see them. Clearing your browser data deletes them.</li>
          <li>We count visits anonymously (which pages are used, from which country and device type) to see whether BoardBrain helps. This does not identify you.</li>
          <li>When you press 👍 or 👎 on an AI Guru answer, we count it anonymously.</li>
          <li>Each browser keeps a random number so that one device cannot use up the AI for everyone. It is not linked to you.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">About the AI Guru</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Many answers (solved numericals, ready answers, past papers) come from BoardBrain itself, without any outside AI.</li>
          <li>Other questions are answered by an AI service. Your question text is sent to it to get the answer. Please do not type personal details such as your name, phone number or address.</li>
          <li>The AI can make mistakes. Check important answers with your textbook or teacher.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">Past papers</h2>
        <p>
          Past-paper questions are typed from scans of the Board of Secondary Education Karachi annual papers. MCQ answers
          were worked out and checked by BoardBrain; questions that were unclear on the scan were left out. If you find a
          mistake, please tell us.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">Contact & feedback</h2>
        <p>
          Questions, mistakes or ideas: <a href={feedbackHref()} target="_blank" rel="noopener noreferrer" className="text-brand-emerald underline">send us feedback</a>.
        </p>
        <p className="font-nastaliq text-right text-slate-400" dir="rtl">
          ہم آپ کا نام، فون نمبر یا ای میل جمع نہیں کرتے۔ آپ کی پریکٹس صرف آپ کے اپنے فون پر محفوظ رہتی ہے۔
        </p>
      </section>

      <Link href="/student" className="inline-block px-4 py-2 rounded-xl bg-brand-emerald text-slate-950 text-xs font-bold">
        Start studying →
      </Link>
    </div>
  );
}
