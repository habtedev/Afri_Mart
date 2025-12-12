import { loadEnvConfig } from '@next/env'
import { cwd } from 'process'
// Ensure env vars from .env.local are loaded before any DB code uses them
loadEnvConfig(cwd())

import data from '@/lib/data'
import { connectToDatabase } from '.'
import Product from './models/product.mode'

const main = async () => {
    try {
            const { products } = data
            await connectToDatabase(process.env.MONGODB_URI)

    // clean up existing product
    await Product.deleteMany()

    // insert new product
    const createdProducts = await Product.insertMany(products)
    console.log({ createdProducts, messsage: 'product seeded sucessfully'})
    process.exit(0)

    } catch (error) {
         console.log({error})
         throw new Error('Error seeding product data')
    }
}

// Invoke the seeding routine when this script is run
void main()