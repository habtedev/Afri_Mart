import { IUserInput } from '@/types'
import { Document, Model, Types, model, models, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends Document, IUserInput {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: 'User' },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
    paymentMethod: { type: String },
    address: {
      fullName: { type: String },
      street: { type: String },
      city: { type: String },
      province: { type: String },
      postalCode: { type: String },
      country: { type: String },
      phone: { type: String },
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  if (this.password) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }
})

// Add method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

const User = (models.User as Model<IUser>) || model<IUser>('User', userSchema)
export default User
