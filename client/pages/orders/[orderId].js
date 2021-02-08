import React, { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/useRequest'
import Router from 'next/router'
const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      Router.push('/orders')
    },
  })
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }
    findTimeLeft()
    const interval = setInterval(findTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [])
  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }
  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey='pk_test_qdysRqn7siRcRjbiOIuxtZVE00gtvoLfsT'
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}
OrderShow.getInitialProps = async ({ context, client }) => {
  const { orderId } = context.query
  const { data: order } = await client.get(`/api/orders/${orderId}`)
  return { order }
}
export default OrderShow
