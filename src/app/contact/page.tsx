import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the AI Compare team. We'd love to hear your feedback, suggestions, or questions.",
};

export default function ContactPage() {
  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Contact Us
          </h1>
          <p className="mt-2 text-muted-foreground">
            Have a question, suggestion, or feedback? We&apos;d love to hear
            from you.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
