import Ticket from '../Ticket'
it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'jfakfds',
    price: 20,
    userId: 'afjksl',
  })
  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})

it('implements optimistic concurency control', async done => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: 'fdjlHJa',
  })
  await ticket.save()
  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)
  firstInstance!.set({
    price: 10,
  })
  secondInstance!.set({
    price: 15,
  })
  await firstInstance!.save()
  try {
    await secondInstance!.save()
  } catch (error) {
    return done()
  }
  throw Error('This Should not run')
})
