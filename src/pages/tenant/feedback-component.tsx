"use client"

import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

interface Feedback {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  routeId: string
  message: string
  rating: number
  createdAt: string
  user: {
    userId: string
    name: string
    email: string
  }
  route: {
    routeId: string
    name: string
  }
}

export default function RouteFeedbackPage({ params }: { params: { routeId: string } }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [routeFilter, setRouteFilter] = useState<string>('all')
  const [availableRoutes, setAvailableRoutes] = useState<{routeId: string, name: string}[]>([])

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `https://n7gjzkm4-3001.euw.devtunnels.ms/api/feedback/route/${params.routeId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        )
        
        setFeedbacks(response.data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const routes = response.data.reduce((acc: any[], feedback: Feedback) => {
          if (!acc.some(r => r.routeId === feedback.route.routeId)) {
            acc.push({
              routeId: feedback.route.routeId,
              name: feedback.route.name
            })
          }
          return acc
        }, [])
        setAvailableRoutes(routes)
      } catch (err) {
        console.error('Error fetching feedbacks:', err)
        setError('Failed to load feedbacks')
        setFeedbacks([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeedbacks()
  }, [params.routeId])

  const filteredFeedbacks = routeFilter === 'all' 
    ? feedbacks 
    : feedbacks.filter(feedback => feedback.route.routeId === routeFilter)

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[250px]" />
        </div>
        
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-[150px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-4 rounded-full" />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Route Feedbacks</h1>
        
        {availableRoutes.length > 0 && (
          <Select value={routeFilter} onValueChange={setRouteFilter}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter by route" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Routes</SelectItem>
              {availableRoutes.map(route => (
                <SelectItem key={route.routeId} value={route.routeId}>
                  {route.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No feedbacks available for this route
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFeedbacks.map(feedback => (
            <Card key={feedback._id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{feedback.user.name}</CardTitle>
                    <p className="text-sm text-gray-500">{feedback.user.email}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-700">{feedback.message}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Route: {feedback.route.name}</span>
                    <span>
                      {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}