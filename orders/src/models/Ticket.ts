import { OrderStatus } from '@saileshbrotickets/common'
import mongoose, { Model, Schema, Document } from 'mongoose'
import Order from './Order'

interface TicketAttrs {
  title: string
  price: number
}

export interface TicketDoc extends Document<TicketAttrs> {
  title: string
  price: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new Schema<TicketDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs)
}
ticketSchema.methods.isReserved = async function (): Promise<boolean> {
  // make sure that the ticket is not already been reserved
  // run query to look at all orders.
  // find an order where the ticket is assoc and the order
  // status is not cancelled
  const order = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  })
  return !!order
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export default Ticket
