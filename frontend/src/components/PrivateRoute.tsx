import React from 'react'
import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
    children: React.ReactNode
    allowedRoles?: string[]
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null

    if (!token || !user) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export default PrivateRoute
