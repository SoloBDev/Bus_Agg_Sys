import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Logo } from "../components/logo";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col w-full">
      {/* Full-width header */}
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 lg:px-8 py-6">
        <div className="mx-auto flex h-16 items-center justify-between w-full max-w-7xl">
          <Logo />
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Full-width main content */}
      <main className="flex-1 w-full">
        <section className="w-full grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="mx-auto flex flex-col items-start gap-2 px-4 sm:px-6 lg:px-8 w-full max-w-7xl">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-6xl mb-4 w-full">
              Ethiopian Aggregated Bus System
            </h1>
            <p className="text-lg text-muted-foreground w-full">
              <span className='max-w-5xl w-[200px]' >A comprehensive platform for managing bus operations across
              Ethiopia. Streamlined booking, efficient fleet management, and
              real-time tracking Software as a Service (SaaS) Platform.</span>
            </p>
          </div>
          <div className="mx-auto flex gap-4 justify-center items-center w-full max-w-7xl mt-8">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Full-width footer */}
      <footer className="w-full text-center mt-auto py-6 bg-background/50">
        <div className="mx-auto flex justify-center gap-6 mb-4 text-regular w-full max-w-7xl">
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary">
            Privacy & Terms
          </Link>
          <Link to="/language" className="text-sm text-muted-foreground hover:text-primary">
            Language
          </Link>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
            Contact Us
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">Powered By S4Y Development</p>
      </footer>
    </div>
  );
}