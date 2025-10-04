# 📚 DokiDoki - Daily Practice for UPSC Aspirants

<div align="center">

![Dokidoki](./frontend/assets/icon-dokidoki.png)

**A mobile learning platform that makes UPSC preparation consistent, structured, and engaging through daily challenges and peer collaboration**

[View Demo](https://drive.google.com/file/d/101ob04JJUx6V6F71mdY42SS1czxjd0k-/view?usp=sharing)

</div>

---

## 🎯 Overview

DokiDoki helps UPSC aspirants build consistent study habits through daily practice. The app delivers **one Prelims (MCQ)** and **one Mains (descriptive)** question every day at 1 AM UTC, encouraging disciplined preparation with an integrated streak and points system. Learners can attempt multiple-choice questions in-app, upload handwritten answers, and share their notes with the community for real-time feedback.

## ✨ Key Features

### 📅 Daily Question Flow
- Automated delivery of Prelims and Mains questions at 1 AM UTC
- **Prelims**: Multiple-choice questions for conceptual testing
- **Mains**: Descriptive questions requiring written answers
- GitHub Actions + Node.js cron jobs for scheduling
- Fresh content every day to maintain momentum

### 🔥 Streak & Points System
- Build daily practice streaks with automatic reset after 24+ hour gaps
- Earn 2 points for every correct Prelims answer
- Track current streak, longest streak, and total points
- Visual indicators and motivational messages

### 📝 Answer Submissions
- **Prelims**: In-app MCQ selection with instant grading and explanations
- **Mains**: Upload handwritten answer copies via camera or gallery
- Multiple image uploads with cropping and optimization
- Full-screen viewer with zoom and pan
- Complete submission history with timestamps

### 👥 Community & Feedback
- Share handwritten Mains answers as posts
- Peers can provide live comments and feedback
- Learn from different approaches to the same question
- Like system and engagement tracking
- Sort posts by recency or popularity
- 10 posts per page with pagination

### 🔔 Push Notifications
- Custom notification service built with GitHub Actions + Expo
- Daily question reminders
- Streak maintenance alerts
- Community feedback notifications

### 🗄️ Data Infrastructure
**Firestore Collections:**
- `users/{uid}` - User profiles, streaks, points, and progress
- `daily_prelims_questions/{date}` - Daily MCQ questions with options and explanations
- `daily_mains_questions/{date}` - Daily descriptive questions
- `submissions/{uid}/{date}` - User answer submissions with verdicts
- `posts/{postId}` - Community posts with images and likes
- `comments/{postId}/{commentId}` - Real-time feedback on posts

**Local Storage:**
- AsyncStorage for theme preference and auth tokens
- Designed to handle 10,000+ users

### 🎨 UI/UX
- Clean, card-based interface with minimal distractions
- Dark/Light theme with persistent preference
- Redux state management for user progress, questions, and theme
- React Native Reanimated for smooth animations
- Haptic feedback on interactions

### 📊 Dashboard
- Current streak, total points, and practice stats
- Quick access to daily challenges
- Archive of all previous questions
- Community feed with latest posts
- Motivational messages based on streak status

### 📚 Question Archive
- Access all past Prelims and Mains questions
- Navigate by date
- Review previous submissions and verdicts
- Visual indicators for attempted questions

### 🔐 Authentication
- Firebase Authentication with email/password
- Persistent sessions via AsyncStorage
- Custom usernames with stats
- Separate flows for logged-in and logged-out states

### 📧 Support
- In-app email integration for bug reports
- Direct feedback submission from dashboard

## 🏗️ Technical Stack

### Frontend
- React Native with Expo
- TypeScript
- Redux Toolkit for state management
- React Navigation (Stack & Auth navigators)
- AsyncStorage for local persistence
- React Native Reanimated + Gesture Handler

### Backend & DevOps
- Firebase Firestore database
- GitHub Actions for scheduled jobs
- Node.js cron scripts (1 AM UTC daily)
- Expo Push Notification Service
- Cloudinary for image optimization
- Firebase Storage for uploads

### Scalability
- Firestore indexes for fast queries
- Pagination for large datasets
- Image compression and optimization
- Built for 10,000+ concurrent users

## 🎯 Product Philosophy

**Consistency Over Intensity** - Daily practice becomes second nature

**Collaborative Learning** - Peers learn from and improve each other's work through feedback

**Accountability Through Gamification** - Streaks and points create positive reinforcement

**Mobile-First** - Study anywhere, anytime

## 🚀 Getting Started

1. Download the app (Android/iOS)
2. Create account with email
3. Answer today's Prelims and Mains questions
4. Build your streak with daily practice
5. Share answers and get peer feedback

## 🎓 Target Users

- UPSC aspirants preparing for civil services
- Competitive exam candidates
- Learners who thrive with accountability
- Those who prefer peer-based learning

## 💡 Why DokiDoki?

✅ Automated daily questions at 1 AM UTC
✅ Streak system for habit formation
✅ Instant feedback with explanations
✅ Peer learning through shared notes and live comments
✅ Complete submission tracking
✅ Handwriting support for descriptive answers
✅ Custom push notifications
✅ Scalable infrastructure (10,000+ users)
✅ Dark/Light theme
✅ Complete question archive

## 📱 Platforms

- **Android**: EAS Build (APK for testing, production builds)
- **iOS**: TestFlight and App Store
- **Cross-Platform**: Single Expo codebase

## 🏆 Development Highlights

- Full-stack development (mobile client + backend services)
- DevOps automation with GitHub Actions
- Real-time comments and feedback system
- Scalable Firestore schema design
- Custom Expo push notification service
- Product design and gamification logic

## 🤝 Team

Made with ❤️ by the **DokiDoki** team

### Contact

- **Report Issues**: In-app feedback button
- **Email**: [dokidoki.cse@gmail.com](mailto:dokidoki.cse@gmail.com)

---

<div align="center">

**DokiDoki helps learners stay accountable with daily practice, while fostering a collaborative community where peers learn from and improve each other's work.**

*Practice daily. Track progress. Learn together.*

</div>
