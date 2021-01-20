import { OrderStatus } from '@saileshbrotickets/common'
import mongoose, { Model, Schema, Document } from 'mongoose'
import { TicketDoc } from './Ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
interface OrderAttrs {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

interface OrderDoc extends Document<OrderAttrs> {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
  version: number
}

interface OrderModel extends Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new Schema<OrderDoc>(
  {
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    userId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  },
)
orderSchema.set('versiionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema)

export default Order
