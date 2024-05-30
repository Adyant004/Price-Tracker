"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react";

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidUrlFromAmazon = (url : string) => {
    try {
      const parsedURL = new URL(url);
      const hostname = parsedURL.hostname;

      if(
        hostname.includes('amazon.com') ||
        hostname.includes('amazon.') || 
        hostname.endsWith('amazon')
      ) {
        return true;
      }
    } catch (error) {
      return false;
    }
     return false;
  }

    const handleSubmit = async (e : FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const isValidLink = isValidUrlFromAmazon(searchPrompt);

      if(!isValidLink) {
        setSearchPrompt('');
        return alert('Please provide a valid amazon link');
      }
      try {
        setIsLoading(true);

        await scrapeAndStoreProduct(searchPrompt);
        alert('Link Added!');
        const productViewElement = document.getElementById('productView');
        console.log(productViewElement)
        if (productViewElement) {
          productViewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.warn('Element with id "productView" not found.');
        }
        setSearchPrompt('');

      } catch (error: any) {
        throw new Error(error.message)
      } finally {
        setIsLoading(false);
      }
    }
  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
        <input value={searchPrompt} onChange={(e) => setSearchPrompt(e.target.value)} type="text" placeholder="Enter Amazon product link" className="searchbar-input" />

        <button disabled={searchPrompt === '' || isLoading} type="submit" className="searchbar-btn">
            {
              isLoading ? 'Searching...' : 'Search'
            }
        </button>
    </form>
  )
}

export default SearchBar
