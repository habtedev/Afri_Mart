import { loadEnvConfig } from '@next/env'
import { cwd } from 'process'
// Ensure env vars from .env.local are loaded before any DB code uses them
loadEnvConfig(cwd())

import data from '@/lib/data'
import { connectToDatabase } from '.'
import Product from './models/product.mode'
import User from './models/user.model'

const main = async () => {
    try {
            const { products, users } = data
            await connectToDatabase(process.env.MONGODB_URI)
     // seed users
    await User.deleteMany()
    const createdUser = await User.insertMany(users)  

    // seed products
    await Product.deleteMany()
    const createdProducts = await Product.insertMany(products)

    // log result 
    console.log({ createdProducts, createdUser, messsage:  'seeded sucessfully'})
    process.exit(0)

    } catch (error) {
         console.log({error})
         throw new Error('Error seeding product data')
    }
}

// Invoke the seeding routine when this script is run
void main()