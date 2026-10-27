import Hero from "../components/home/Hero";
import EditorialShowcase from "../components/home/EditorialShowcase";
import CategoryShowcase from "../components/home/CategoryShowcase";
import CollectionsShowcase from "../components/home/CollectionsShowcase";
import FeaturedProducts from "../components/home/FeaturedProducts";
import BrandStory from "../components/home/BrandStory";
import MaterialsRail from "../components/home/MaterialsRail";
import LifestyleCampaign from "../components/home/LifestyleCampaign";
import JournalPreview from "../components/home/JournalPreview";
import Newsletter from "../components/Newsletter";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export default function Home() {
  useDocumentMeta({
    title: "UXT.com",
    description:
      "UXT.com — furniture that transforms the way you experience space. Considered design, honest materials and craftsmanship for timeless contemporary interiors.",
    path: "/",
  });

  return (
    <>
      <Hero />
      <EditorialShowcase />
      <CategoryShowcase />
      <CollectionsShowcase />
      <FeaturedProducts />
      <BrandStory />
      <MaterialsRail />
      <LifestyleCampaign />
      <JournalPreview />
      <Newsletter />
    </>
  );
}
