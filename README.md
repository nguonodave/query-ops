# Profile Dashboard

## Overview
A profile dashboard that displays user information and learning statistics by fetching data from a GraphQL API. The project features a login system and interactive SVG data visualizations.

## Key Features
- **Secure Authentication**: Login with username/email and password to obtain JWT
- **Profile Information**: Displays user data fetched from GraphQL endpoint
- **Data Visualizations**: 
  - Interactive SVG graphs showing learning progress
  - Custom statistics about XP, projects, and achievements
- **Responsive UI**: Clean interface designed with pure HTML/CSS/JS

## Technical Details
- Built with vanilla JavaScript (no frameworks)
- Uses GraphQL API for data fetching (`/api/graphql-engine/v1/graphql`)
- JWT authentication for secure data access
- SVG for all data visualizations
- Hosted on Vercel: [query-ops.vercel.app](https://query-ops.vercel.app)

## Setup
1. Open `index.html` in a browser
2. Login with your platform credentials
3. View your personalized learning dashboard

## Requirements Met
- Implemented all required GraphQL query types (normal, nested, with arguments)
- Created 3 SVG statistical graphs
- Complete authentication flow with error handling
- Responsive UI design