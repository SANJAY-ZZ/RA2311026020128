# Notification System Design
## Stage 1 – API Design

The system exposes simple REST APIs to create and fetch notifications.

## 1. Create Notification
POST /notifications

Request:
{
  "userId": "123",
  "type": "Event",
  "message": "Test notification"
}

Response:
{
  "message": "Notification created",
  "data": {
    "id": 1777700000000,
    "userId": "123",
    "type": "Event",
    "message": "Test notification",
    "isRead": false,
    "timestamp": "2026-05-02T07:00:00Z"
  }
}

## 2. Get Notifications
GET /notifications

Response:
{
  "notifications": [ ... ]
}

The APIs follow a simple REST structure and use JSON for communication.  
For this implementation, notifications are stored in memory for simplicity.

## Stage 2 – Database Design
For production use, a relational database like PostgreSQL or MySQL is suitable.

## Table: notifications
- id (Primary Key)
- userId (string)
- type (Event / Result / Placement)
- message (text)
- isRead (boolean)
- timestamp (datetime)

## Possible issues as data grows
- Large number of notifications per user  
- Slower reads when fetching unread notifications  

## Improvements
- Add index on userId  
- Add index on isRead + timestamp  
- Archive old notifications periodically  

## Stage 3 – Query Optimization
Original query:

SELECT * FROM notifications  
WHERE userId = ? AND isRead = false  
ORDER BY timestamp DESC;

## Problems
- Can become slow with large data  
- Sorting large datasets is expensive  
- Without indexing, full table scan happens  

## Optimized solution
Create a composite index:

CREATE INDEX idx_notifications  
ON notifications (userId, isRead, timestamp DESC);

## Result
- Faster filtering by userId  
- Efficient retrieval of unread notifications  
- Reduced query execution time  

## Stage 4 – Performance Improvements

As usage increases, fetching all notifications every time is inefficient.

## Solutions
1. Pagination  
GET /notifications?page=1&limit=10  

2. Caching  
- Use Redis to store recent notifications  

3. Lazy Loading  
- Load notifications only when user opens the section  

## Trade-offs
- Pagination reduces load but adds extra logic  
- Caching improves speed but needs cache invalidation  

## Stage 5 – Bulk Notification Handling
When sending notifications to many users (e.g., placements), synchronous processing can fail.

## Problem
- Sending emails or push notifications one by one is slow  
- Failures can stop the entire process  

## Solution: Asynchronous processing
Use a queue system like Kafka or RabbitMQ.


## Flow
1. API receives request  
2. Push job to queue  
3. Worker processes:
   - send email  
   - save notification  
   - push to app  

## Benefits
- Non-blocking system  
- Better scalability  
- Handles failures gracefully  

## Stage 6 – Priority Inbox

Users should see the most important notifications first.

## Approach
Assign priority based on:

- Type (Placement > Result > Event)  
- Recency (newer notifications are more important)  

## Logic
- Fetch unread notifications  
- Sort based on priority + timestamp  
- Return top 10 notifications  

## Optimization
- Use a priority queue (heap)  
- Maintain only top N results  

## Benefit
Efficient even when number of notifications is large  

## Conclusion
The system is designed to be simple and scalable.  
It can handle increasing data through indexing, caching, and asynchronous processing while maintaining good performance.