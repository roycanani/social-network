import { useState, useEffect } from "react"
import { getUsers } from "../users/users"
import { User } from "../model"

export const useUsers = () => {
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getUsers()
                if (!response.data) {
                    throw new Error("Failed to fetch users")
                }
                setAllUsers(response.data)
            } catch (error: any) {
                setError(error?.message)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    return { allUsers, loading, error }
}