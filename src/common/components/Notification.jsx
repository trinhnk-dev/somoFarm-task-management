import { onMessageListener, requestForToken } from 'features/firebase'
import React, { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const Notification = () => {
  const [notification, setNotification] = useState({ title: '', body: '' })
  const notify = () => toast(<ToastDisplay />)
  function ToastDisplay() {
    return (
      <div>
        <p>
          <b style={{ fontSize: '16px' }}>{notification?.title}</b>
        </p>
        <p style={{ fontSize: '14px' }}>{notification?.body}</p>
      </div>
    )
  }

  useEffect(() => {
    if (notification?.title) {
      notify()
    }
  }, [notification])

  requestForToken()

  onMessageListener()
    .then((payload) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      })
    })
    .catch((err) => console.log('failed: ', err))

  return <Toaster position="top-right" />
}

export default Notification
