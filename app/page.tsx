import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { getAllProducts } from "@/lib/actions";
import Image from "next/image";
import React from "react";

const Home = async() => {

  const allProducts = await getAllProducts();

  return (
    <>
      <section className="px-6 md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-6">
          <div className="flex flex-col justify-center">
            {/* <p className="small-text">
              Smart Shopping Starts Here
              <Image
                src={"/assets/icons/arrow-right.svg"}
                alt="Arrow Right"
                width={16}
                height={16}
              />
            </p> */}

            <h1 className="head-text">
                Harness the Potential of {" "}
              <span className="text-primary">Web Scraping</span>
            </h1>

            <p className="mt-6">
            Robust, self-service analytics for product and growth to boost conversion, engagement, and retention.
            </p>

            <SearchBar />
          </div>
          <HeroCarousel />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">History</h2>

        <div id="productView" className="flex flex-wrap gap-x-8 gap-y-16">
          {
            allProducts?.length === 0 ? 'No products available!' : ''
          }
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
