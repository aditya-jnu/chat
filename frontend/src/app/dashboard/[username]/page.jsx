import React from 'react'

export default function page({ params }) {
    const { username} = params;
    return (
        <div>
            <h1 className="text-3xl font-bold">Welcome, {username}!</h1>
        </div>
    )
}
