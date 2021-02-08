import React, { useState } from 'react'
import useRequest from './../../hooks/useRequest'
import Router from 'next/router'

const NewTicket = () => {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: ticket => {
      Router.push('/')
    },
  })
  const onBlur = () => {
    const value = parseFloat(price)
    if (isNaN(value)) {
      return
    }
    setPrice(value.toFixed(2))
  }
  const onSubmit = e => {
    e.preventDefault()
    doRequest()
  }
  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='form-control'
            type='text'
            name='title'
            id='title'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='price'>Price</label>
          <input
            className='form-control'
            value={price}
            onChange={e => setPrice(e.target.value)}
            onBlur={onBlur}
            name='price'
            id='price'
          />
        </div>
        {errors}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  )
}

export default NewTicket
