# 📌 SmartPresence – AI Powered Automated Attendance System

SmartPresence is an AI-driven automated attendance system designed for **offline classrooms (CCTV)** and **online classes (Zoom/Google Meet/Teams)**.  
It leverages **YOLOv11** for face detection and **DeepFace** for face recognition, ensuring accurate, scalable, and proxy-free attendance tracking.  
The system notifies students of their attendance in real-time and alerts teachers/admins in case of anomalies or system downtime.

---

## 🚀 Features

- **Dual Mode Support**
  - **Offline Mode:** Works with CCTV-enabled classrooms. Captures random snapshots during lectures for attendance.
  - **Online Mode:** Integrates with Zoom/Meet; triggers random webcam checks to verify student presence.
  
- **AI-Powered Face Recognition**
  - **YOLOv11** → Face Detection  
  - **DeepFace (Facenet, ArcFace, VGG-Face)** → Face Recognition  
  - Embeddings stored in MongoDB for fast vector search.

- **Notifications**
  - Real-time updates to students (Present/Absent).
  - Alerts for attendance <75%.
  - SMS/Push notifications via Twilio/MSG91/Firebase.

- **Fault Tolerance**
  - Heartbeat checks & monitoring ensure system uptime.
  - Auto-alert to teacher if system goes down → switch to manual override.

- **Analytics Dashboard**
  - Attendance trends, defaulter lists, and insights.
  - Multi-role access: Student, Teacher, Admin.

---

## 🛠️ Tech Stack

### **Frontend**
- Web App: React.js + Tailwind CSS  
- Mobile App: React Native (for student/teacher notifications)

### **Backend**
- Node.js (Express.js) REST APIs  
- Notification Service: Firebase Cloud Messaging + Twilio/MSG91  
- Message Queue: Kafka / RabbitMQ (for async processing)

### **AI/ML**
- YOLOv11 (PyTorch/ONNX Runtime) → Face Detection  
- DeepFace (TensorFlow/Keras) → Face Recognition & Embeddings  
- OpenCV → Image preprocessing

### **Databases**
- **MongoDB Atlas** → Face embeddings, snapshots, raw attendance events  
- **SQL (PostgreSQL/MySQL)** → Structured attendance summaries, analytics reports  
- **Hybrid Approach** → MongoDB for recognition, SQL for reporting (auto-synced via ETL)

### **Infrastructure**
- Docker → Containerized services  
- Kubernetes (K8s) → Orchestration & auto-scaling  
- Redis → Caching frequently used embeddings  
- Cloud: AWS / GCP / Azure (GPU nodes for inference, S3 for image storage)

---

## 🔄 Workflow

### **Offline Mode (CCTV)**
1. Teacher enters class details (subject, room no).  
2. System connects to CCTV (RTSP feed).  
3. Captures 3 snapshots at random intervals during the lecture.  
4. YOLOv11 → detects faces.  
5. DeepFace → generates embeddings, matches with student DB (MongoDB).  
6. Attendance marked → Updates SQL/Mongo + notifies students.  
7. Unmatched faces stored in secondary DB → teacher alerted.

### **Online Mode (Zoom/Meet/Teams)**
1. Teacher enters online class link.  
2. System accesses participant list (API) + triggers random webcam snapshots for attendees.  
3. YOLOv11 + DeepFace → recognition against DB.  
4. Attendance updated + real-time notifications sent.  
5. Alerts generated for absentees/unmatched faces.

---

## 📊 Scalability & Reliability

- **Sleep–Wake Cycle:**  
  System processes only during snapshot intervals → saves compute/bandwidth.  
- **Kubernetes Auto-Scaling:**  
  Automatically scales YOLO/DeepFace containers across GPUs when multiple classes run in parallel.  
- **Auto-Synchronization:**  
  - Offline data buffered locally → synced once network restores.  
  - MongoDB → SQL sync via Kafka Connect / ETL for analytics.  
- **System Monitoring:**  
  Heartbeat checks, Prometheus + Alertmanager → teacher notified if system down.

---

## ⚠️ Challenges Solved

- **Proxy Attendance Prevention:** Randomized multi-snapshot verification.  
- **Scalability:** Containerized microservices, cloud-native design.  
- **Privacy & Security:** Encrypted embeddings, role-based access, GDPR/IT Act compliance.  
- **Low Connectivity:** Offline-first design with auto-sync.  

---

## 📈 Future Enhancements

- Add **liveness detection** (blink, smile, head movement) to prevent spoofing.  
- Extend to **corporate offices & online exams**.  
- Integrate with **institution ERP systems**.  
- Add **student engagement analytics** (gaze tracking, participation metrics).  

---

## 👥 Stakeholders & Benefits

- **Students:** Fair & transparent attendance, real-time updates, early alerts if <75%.  
- **Teachers:** Saves 10–15 mins per class, manual override option, reduced disputes.  
- **Admins:** Central dashboard, defaulter tracking, trend insights.  
- **Institutions:** Cost-effective, scalable, modernizes academic processes.  

---

## 🏗️ Installation (Prototype Level)

```bash
# Clone repo
git clone https://github.com/yourusername/smartpresence.git
cd smartpresence

# Backend setup
cd backend
npm install
npm start

# AI Services (YOLO/DeepFace)
python ai_service.py

# Frontend setup
cd frontend
npm install
npm run dev
