# Sprint 4 Schedule

| Activity | Predecessor | Duration (days) |
|----------|-------------|-----------------|
| A        |             | 3               |
| B        | A           | 2               |
| C        | B           | 1               |
| D        | B           | 1               |
| E        | C           | 2               |
| F        | E           | 1               |
| G        | E           | 2               |
| H        |             | 2               |
| I        | H           | 2               |
| J        | I           | 1               |

# Activity Descriptions

- **A**: <KAN-37>: Work on the front-end interface for viewing study analytics for standard users.
- **B**: <KAN-37-1>: Refine the analytics UI and ensure accurate data visualization.
- **C**: <KAN-37-2>: Integrate real-time data updates into the analytics dashboard.
- **D**: <KAN-37-3>: Backend logic for tracking and storing study analytics.
- **E**: <KAN-38>: Develop backend services for premium users to view and compare their study analytics.
- **F**: <KAN-38-1>: Optimize data retrieval for the analytics feature.
- **G**: <KAN-38-2>: Handle performance optimization for large data sets.
- **H**: <KAN-28>: Enhance backend security for study location access control.
- **I**: <KAN-28-1>: Integrate security features with the existing database.
- **J**: <KAN-28-2>: Address database integration issues.

# Sprint Schedule Network Graph

```mermaid
graph TD
    A[Work on the front-end interface for viewing study analytics for standard users]
    B[Refine the analytics UI and ensure accurate data visualization]
    C[Integrate real-time data updates into the analytics dashboard]
    D[Backend logic for tracking and storing study analytics]
    E[Develop backend services for premium users to view and compare their study analytics]
    F[Optimize data retrieval for the analytics feature]
    G[Handle performance optimization for large data sets]
    H[Enhance backend security for study location access control]
    I[Integrate security features with the existing database]
    J[Address database integration issues]

    A --> B
    B --> C
    B --> D
    C --> E
    E --> F
    E --> G
    H --> I
    I --> J
    ``` 

Critical Path Analysis
The critical path includes all tasks that directly affect the project's completion time. To determine this, we need to look for the longest sequence of dependent tasks. Here’s the critical path identified:

A: Work on the front-end interface for viewing study analytics for standard users (3 days)
B: Refine the analytics UI and ensure accurate data visualization (2 days)
C: Integrate real-time data updates into the analytics dashboard (1 day)
E: Develop backend services for premium users to view and compare their study analytics (2 days)
G: Handle performance optimization for large data sets (2 days)

The critical path is A -> B -> C -> E -> G, which totals 10 days.

```mermaid 
graph TD
    A[Work on the front-end interface for viewing study analytics for standard users]
    B[Refine the analytics UI and ensure accurate data visualization]
    C[Integrate real-time data updates into the analytics dashboard]
    E[Develop backend services for premium users to view and compare their study analytics]
    G[Handle performance optimization for large data sets]

    A --> B
    B --> C
    C --> E
    E --> G
    ```


Work Habit Modifications
Based on the critical path analysis, our team has prioritized critical tasks (A, B, C, E, and G) to ensure timely completion by allocating additional support and resources to these tasks. We have also adopted parallel processing for non-critical tasks (D, F, H, I, and J) to maintain overall project progress without interfering with the critical path. Additionally, we increased the frequency of check-ins and stand-ups to monitor the progress of critical tasks closely and promptly address any blockers.

Optimized Sprint Schedule Network Graph
The optimized network graph focuses on the critical path while ensuring parallel processing for non-critical tasks.

```mermaid
graph TD
    A[Work on the front-end interface for viewing study analytics for standard users]
    B[Refine the analytics UI and ensure accurate data visualization]
    C[Integrate real-time data updates into the analytics dashboard]
    E[Develop backend services for premium users to view and compare their study analytics]
    G[Handle performance optimization for large data sets]

    A --> B
    B --> C
    C --> E
    E --> G
    
    H[Enhance backend security for study location access control] --> I[Integrate security features with the existing database]
    I --> J[Address database integration issues]
    E --> F[Optimize data retrieval for the analytics feature]
    F --> G
    C --> D[Backend logic for tracking and storing study analytics]
```



