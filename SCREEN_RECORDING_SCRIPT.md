# Screen Recording Script for GraphPilot Demo

## Recommended Recording Flow (2-4 minutes)

### 0:00 - Introduction (20 seconds)
- Open browser to https://graph-pilot.vercel.app
- Introduce GraphPilot: "GraphPilot is an AI-powered engineering dependency intelligence platform"
- Explain the problem: "Understanding service dependencies and cascade failures in microservice architectures"

### 0:20 - Dashboard (25 seconds)
- Show the dashboard overview
- Highlight key metrics: 25 services, 6 teams, 8 incidents, 10 databases
- Point to system health banner
- Show recent incidents with severity indicators
- Show critical services section
- Mention: "The dashboard gives immediate visibility into the engineering system"

### 0:45 - Graph Explorer (35 seconds)
- Navigate to /explorer
- Show service list with search
- Select a service (e.g., "Payment Service")
- Show service details panel
- Toggle to graph view
- Demonstrate React Flow visualization with zoom/pan
- Show dependencies and dependents lists
- Mention: "The graph visualization makes dependencies immediately understandable"

### 1:20 - Impact Analysis (40 seconds)
- Navigate to /impact
- Select "Payment Service" from dropdown
- Set depth to 4 hops
- Click "Analyze Impact"
- Show affected services with hop-based color coding
- Explain: "This shows cascade failure scenarios - if Payment Service fails, 8 services are affected across 4 hops"
- Mention hop indicators and criticality badges

### 2:00 - Incidents (30 seconds)
- Navigate to /incidents
- Show active vs resolved incidents separation
- Point to severity-based left border indicators
- Show incident details with affected services
- Mention: "Incidents are tracked with severity and status, showing which services are affected"

### 2:30 - AI Assistant (30 seconds)
- Navigate to /assistant
- Show suggested questions
- Ask: "What services could be affected if Payment Service fails?"
- Show AI response based on actual graph data
- Mention: "The AI Assistant answers questions using the actual CognoDB graph data"
- Ask: "How many incidents have we had recently?"
- Show response

### 3:00 - Why Graph Database (30 seconds)
- Return to README or explain verbally
- Explain: "GraphPilot uses CognoDB because engineering dependencies are graph-shaped problems"
- Mention: "Multi-hop traversals, bidirectional relationships, incident propagation"
- Show the impact analysis query example from README
- Explain: "In a relational database, this would require recursive CTEs or multiple joins"

### 3:30 - Conclusion (30 seconds)
- Summarize key features
- Mention: "110 nodes, 273 relationships, 8 relationship types"
- Show the data model diagram
- Final statement: "GraphPilot demonstrates why graph databases are essential for understanding complex engineering systems"

## Recording Tips

1. **Use the live production application**: https://graph-pilot.vercel.app
2. **Clear browser cache** before recording for fresh load
3. **Use 1080p resolution** or higher
4. **Speak clearly and at a moderate pace**
5. **Mouse movements should be deliberate and visible**
6. **Zoom in on important UI elements** when explaining
7. **Keep the recording under 4 minutes** for engagement
8. **Test the flow once before final recording**

## Recording Tools

- **Windows**: Xbox Game Bar (Win+G), OBS Studio, or Loom
- **Mac**: QuickTime Player, OBS Studio, or CleanShot X
- **Browser**: Loom Chrome extension (easiest option)

## After Recording

1. Save as MP4 format
2. Upload to YouTube (unlisted) or Google Drive
3. Add the link to your submission
4. Include the link in the README if desired
