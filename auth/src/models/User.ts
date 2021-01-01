import { Model, model, Schema, Document } from 'mongoose'
import PasswordManager from '../services/password_manager'
// interface that describes the properties
// that are required to create a new User
interface UserAttrs {
  email: string
  password: string
}
// An interface that describes the properties
// that a User Model has
interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}
// an interface that describes the properties
// that a User Document has
interface UserDoc extends Document {
  email: string
  password: string
}
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
      },
    },
  },
)
userSchema.statics.build = (attrs: UserAttrs) => new User(attrs)
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'))
    this.set('password', hashed)
  }
  next()
})

const User = model<UserDoc, UserModel>('User', userSchema)
export default User
