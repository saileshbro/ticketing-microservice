import nats from 'node-nats-streaming'
import TicketCreatedPublsher from './events/ticket_created_publisher'
console.clear()
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})
stan.on('connect', () => {
  console.log('Publisher connected to NATS')
  const publisher = new TicketCreatedPublsher(stan)
  publisher.publish({
    id: '7842',
    title: 'concert',
    price: 29,
  })
})
