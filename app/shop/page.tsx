import Container from "@/components/common/Container";
import ProductCard from "@/components/product/ProductCard";

const allProducts = [
  {
    image: "/images/products/wiccan-necklace.jpg",
    title: "Sacred Grove",
    code: "WI-001",
    material: "Bone • Wood • Leather",
    price: "1,950,000 تومان",
  },
  {
    image: "/images/products/gothic-necklace.jpg",
    title: "Midnight Lace",
    code: "GT-001",
    material: "Silver • Onyx",
    price: "2,100,000 تومان",
  },
  {
    image: "/images/products/mermaid-necklace.jpg",
    title: "Siren's Pearl",
    code: "MM-001",
    material: "Pearl • Silver",
    price: "2,100,000 تومان",
  },
  {
    image: "/images/products/grunge-necklace.jpg",
    title: "Flannel Nights",
    code: "GR-001",
    material: "Leather • Chain",
    price: "1,750,000 تومان",
  },
  {
    image: "/images/products/decorative-item.jpg",
    title: "Crystal Cluster",
    code: "DC-001",
    material: "Amethyst • Wood",
    price: "1,600,000 تومان",
  },
];

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#090909] pt-32 pb-24 text-white">
      <Container>

        <h1 className="mb-16 text-center text-5xl font-bold">
          فروشگاه
        </h1>

        <div className="grid w-full justify-items-center gap-10 md:grid-cols-2 xl:grid-cols-3">
          {allProducts.map((product) => (
            <ProductCard key={product.code} {...product} />
          ))}
        </div>

      </Container>
    </main>
  );
}