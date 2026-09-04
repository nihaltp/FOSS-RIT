---
name: "AttendX"
description: "Intelligent Face Recognition Attendance System built with FastAPI, YOLOv11-Pose, DeepFace, and MediaPipe liveness detection."
repo_url: "https://github.com/AJ-2007-sys/AttendX-Facial-Recognition-Attendance-System"
tech_stack: ["Python", "FastAPI", "YOLOv11", "DeepFace", "MediaPipe", "SQLite", "OpenCV", "JavaScript"]
author: "AJ-2007-sys"
author_name: "Amal Jayaprakash"
is_verified_student: true
batch: "2028"
featured: true
---

# AttendX - Intelligent Face Recognition Attendance System

AttendX is a modern, real-time Face Recognition Attendance System powered by FastAPI, YOLOv11, DeepFace (VGG-Face), and MediaPipe. It features automated student enrollment, blink-based anti-spoofing liveness verification, continuous session-based attendance tracking, and a glassmorphic dashboard interface.

### Key Highlights
- **Real-Time Pipeline:** Concurrent face detection & recognition with YOLOv11-Pose and DeepFace.
- **Anti-Spoofing:** MediaPipe Face Landmarker computes Eye Aspect Ratio (EAR) for blink-based liveness verification.
- **Modern Web Dashboard:** Pure HTML5/Vanilla JS/CSS3 glassmorphic interface streaming video and receiving bounding boxes via WebSockets.
- **Session-Based Attendance:** Tracks logs grouped by class/session periods with full SQLite data management.
