import Header from "@/components/Header";

export default function HomePage() {

  const currUser = null;
  const priceLink = '/pricing';
  return (
    <div>
      <Header currUser={currUser} priceLink={priceLink} />
    </div>
  );
}