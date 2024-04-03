import PendingRequests from '@/components/delivery-boys/PendingRequests'
import AddDeliveryPerson from '@/components/delivery-boys/AddDeliveryPerson'
import AssignedDeliveryBoys from '@/components/delivery-boys/AssignedDeliveryBoys'
import React from 'react'

const DeliveryBoys = () => {
  return (
    <>
    <div className='flex'>

    <div className='w-2/3'>
        <AssignedDeliveryBoys />
    </div>
    <div className='w-1/3'>
        <AddDeliveryPerson />
        <PendingRequests />
    </div>
    </div>
    </>
  )
}

export default DeliveryBoys