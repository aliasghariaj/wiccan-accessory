export default function Collections() {
  const collections = [
    {
      title: "Bone",
      subtitle: "استخوان و افسانه",
    },
    {
      title: "Chainmail",
      subtitle: "زنجیرهای دست‌ساز",
    },
    {
      title: "Crystal",
      subtitle: "سنگ‌های طبیعی",
    },
    {
      title: "Moon Ritual",
      subtitle: "جادوی ماه",
    },
  ];

  return (
    <section className="bg-[#090909] py-28">
      <div className="mx-auto max-w-7xl px-8">

        <h2 className="mb-16 text-center text-5xl font-bold">
          Collection Worlds
        </h2>

        <div className="grid gap-8 md:grid-cols-2">

          {collections.map((collection) => (
            <div
              key={collection.title}
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-10
                transition
                duration-300
                hover:scale-105
                hover:border-yellow-600
              "
            >
              <h3 className="mb-4 text-3xl font-bold">

                {collection.title}

              </h3>

              <p className="opacity-70">

                {collection.subtitle}

              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}