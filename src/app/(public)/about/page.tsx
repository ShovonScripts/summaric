import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenIcon, SparkIcon, UsersIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "আমাদের কথা",
  description:
    "অনুচ্ছেদ একটি বাংলা বই-সারসংক্ষেপের ডেমো প্রকল্প—সময়ের সম্মান রেখে গভীর পাঠের জন্য।",
};

const PRINCIPLES = [
  {
    title: "পাঠক আগে",
    description:
      "প্রতিটি সিদ্ধান্ত পাঠকের সময় ও মনোযোগকে কেন্দ্র করে। লেখা সহজ, কিন্তু ভাবনা হালকা নয়।",
    icon: UsersIcon,
  },
  {
    title: "বইয়ের প্রতি শ্রদ্ধা",
    description:
      "সারসংক্ষেপ মূল বইয়ের বিকল্প নয়। আমরা বইয়ের যুক্তি ও দ্বিধাকে সংক্ষেপে ধরার চেষ্টা করি।",
    icon: BookOpenIcon,
  },
  {
    title: "বাছাইয়ের সাহস",
    description:
      "সব বই একসঙ্গে নয়। বিষয়, সময় আর পাঠকের আগ্রহ ধরে ছোট কিন্তু যত্নশীল সংগ্রহ তৈরি করা হয়।",
    icon: SparkIcon,
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-paper-deep">
        <div className="container-shell py-14 sm:py-20">
          <p className="text-sm text-gold-ink">আমাদের কথা</p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,5.5vw,4.8rem)] font-semibold leading-[1.12] text-ink">
            বইয়ের ভেতরের কথাটা, একটু বেশি সময় নিয়ে।
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted sm:text-lg sm:leading-9">
            অনুচ্ছেদ একটি ডেমো প্রকল্প—বাংলা বইয়ের সারসংক্ষেপকে তাড়াহুড়োর
            তালিকা নয়, বরং একটি শান্ত পাঠের অভিজ্ঞতা হিসেবে ভাবা হয়েছে।
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <h2 className="section-title text-ink">কেন অনুচ্ছেদ?</h2>
            <div className="prose-bn mt-6 max-w-xl text-[1.02rem] leading-9 text-muted">
              <p>
                অনেক সময় আমরা বই কিনি, কিন্তু পড়া শুরু করতে দেরি হয়ে যায়।
                আবার কিছু বই এত বড় যে শুরু করার সাহসই জোগাড় হয় না। এই
                ফাঁকটুকু ভরাট করার জন্যই সংক্ষিপ্ত কিন্তু গভীর পাঠ।
              </p>
              <p>
                আমাদের লক্ষ্য দ্রুত পড়া নয়—কম সময়ে বেশি বোঝা। প্রতিটি
                সারসংক্ষেপে বইয়ের মূল প্রশ্ন, কেন্দ্রীয় যুক্তি আর পাঠকের
                জন্য কাজে লাগতে পারে এমন একটি ভাবনা থাকে।
              </p>
            </div>
          </div>

          <div className="border border-line bg-surface p-7 sm:p-9">
            <p className="font-display text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.45] text-ink">
              “একটি ভালো সারসংক্ষেপ পাঠককে বই থেকে দূরে সরায় না—বইয়ের কাছে
              নিয়ে যায়।”
            </p>
            <p className="mt-5 text-sm text-muted">
              অনুচ্ছেদের সম্পাদকীয় নীতি
            </p>
            <div className="mt-8 border-t border-line pt-5 text-xs leading-6 text-faint">
              এই সাইটের সব বই, লেখক ও সারসংক্ষেপ ডেমো প্রকল্পের জন্য তৈরি
              কল্পিত উপাদান।
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper-deep section-pad">
        <div className="container-shell">
          <h2 className="section-title text-ink">যে তিনটি জিনিসে আপস নেই।</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => {
              const Icon = principle.icon;
              return (
                <div
                  key={principle.title}
                  className="border-t border-line pt-6"
                >
                  <Icon className="size-5 text-gold-ink" />
                  <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {principle.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-shell">
          <div className="flex flex-col gap-6 border border-line bg-surface p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <p className="text-sm text-gold-ink">পরের ধাপ</p>
              <h2 className="mt-2 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-semibold text-ink">
                সংগ্রহ ঘুরে দেখতে পারেন।
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-7 text-muted">
                এখন ১২টি নমুনা সারসংক্ষেপ রয়েছে। পরবর্তী ধাপে লাইব্রেরি,
                অ্যাকাউন্ট ও সম্পূর্ণ সারসংক্ষেপ যুক্ত হবে।
              </p>
            </div>
            <Link href="/books" className="btn-primary w-fit shrink-0">
              বইয়ের সংগ্রহ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
