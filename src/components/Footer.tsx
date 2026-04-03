import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} We Compare AI — The independent AI comparison platform. 100+ tools tracked in real-time by AI agents.
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">About Us</Link>
            <span>|</span>
            <Link href="/methodology" className="hover:text-foreground transition-colors">Methodology</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <span>|</span>
            <Link href="/research/compliance" className="hover:text-foreground transition-colors">Compliance</Link>
            <span>|</span>
            <span>Built by Jigar Acharya &amp; Saurabh Gera</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
