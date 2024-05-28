import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function HomePage() {

  const currUser = null;
  const priceLink = '/pricing';
  return (
    <div>
      <Header currUser={currUser} priceLink={priceLink} />
      <Hero />
      <Footer />
    </div>
  );
}