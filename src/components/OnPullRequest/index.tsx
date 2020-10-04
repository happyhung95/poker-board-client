import React from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

export const OnPullRequest = () => (
  <div className="flex justify-center my-2 py-2">
    <Loader type="Bars" color="#cbd5e0" height={40} width={40} />
  </div>
)
