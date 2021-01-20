import { OrderStatus } from '@saileshbrotickets/common'
import mongoose, { Model, Schema, Document } from 'mongoose'
import Order from './Order'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
interface TicketAttrs {
  title: string
  price: number
  id: string
}

export interface TicketDoc extends Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>
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

ticketSchema.set('versionKey', 'version')
ticketSchema.plugin(updateIfCurrentPlugin)
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  })
}
ticketSchema.statics.findByEvent = (event: {
  id: string
  version: number
}): Promise<TicketDoc | null> => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  })
}
ticketSchema.methods.isReserved = async function (): Promise<boolean> {
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
