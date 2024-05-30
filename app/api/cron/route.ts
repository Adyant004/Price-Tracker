import { generateEmailBody, sendEmail } from "@/lib/Nodemailer";
import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { scrapeAmazonProduct } from "@/lib/scrappers";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function GET() {
    try {
        connectToDB();
        const products = await Product.find({});

        if(!products) throw new Error('No product found');

        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                const scrappedProduct = await scrapeAmazonProduct(currentProduct.url);

                if(!scrappedProduct) throw new Error('No product found');

                const updatedPriceHistory : any = [
                    ...currentProduct.priceHistory,
                    { price: scrappedProduct.currentPrice }
                ]
    
                const product = {
                    ...scrappedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice: getAveragePrice(updatedPriceHistory)
                }

                const updatedProduct = await Product.findOneAndUpdate(
                    {url: product.url},
                    product,
                );

                //2
                const emailNotifType = getEmailNotifType(scrappedProduct,currentProduct);

                if(emailNotifType && updatedProduct.users.length > 0){
                    const productInfo = {
                        title: updatedProduct.title,
                        url: updatedProduct.url
                    }

                    const emailContent = await generateEmailBody(productInfo,emailNotifType);
                    const userEmails = updatedProduct.users.map((user: any) => user.email);

                    await sendEmail(emailContent,userEmails);
                }

                return updatedProduct;
            })
        )

        return NextResponse.json({
            message: 'OK', data: updatedProducts
        })
    } catch (error : any) {
        throw new Error(error.message);
    }
}