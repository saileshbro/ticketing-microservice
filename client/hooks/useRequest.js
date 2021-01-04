import { useState } from 'react'
import axois from 'axios'
/**
 * useRequest hook
 * @param {{url:string,method: "get"|"post";body: object;onSuccess:Function}} props
 */
const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)
  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axois[method](url, body)
      if (onSuccess) {
        return onSuccess(response.data)
      }
      return response.data
    } catch (error) {
      setErrors(
        <div className='alert alert-danger'>
          <h4>Ooops...</h4>
          <ul className='my-0'>
            {error.response.data.errors.map(err => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>,
      )
    }
  }
  return { doRequest, errors }
}

export default useRequest
