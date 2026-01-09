<a name="readme-top"></a>

# 🌍 Geo Sentiment Analyzer

A **full-stack, cloud-native application** that ingests, analyzes, and visualizes  
**global news sentiment in real time** using **Node.js, React.js, AWS**, and the **GDELT API**.

---

## 📌 About The Project

**Geo Sentiment Analyzer** is designed to process live global news data, perform real-time  
**sentiment analysis**, and present insights through an **interactive geographic dashboard**.

The application fetches news from the **GDELT API**, applies NLP-based sentiment scoring,  
and visualizes trends using charts and geographic representations.

This project demonstrates:
- Cloud-native architecture
- Real-time data ingestion
- Scalable backend services
- Interactive frontend visualization

---

## 🧠 Architecture Overview

### 🔹 Backend
- Built with **Node.js & Express**
- REST APIs for sentiment data
- Deployed on **AWS Elastic Beanstalk**

### 🔹 Database
- **AWS DynamoDB**
- Serverless, scalable storage for sentiment data

### 🔹 Frontend
- Built with **React.js**
- Hosted on **AWS S3**
- Displays charts, analytics, and sentiment results

### 📊 Data & Visualization
- GDELT API
- Chart.js
- D3.js
- Leaflet.js (for geographic visualization)

---

## 📂 Folder Structure (Actual Project Structure)
```
📁 CLOUD
├── 📁 Backend
│ ├── 📁 models
│ │ └── TopicData.js
│ ├── 📁 routes
│ │ └── api.js
│ └── 📄 server.js
│
├── 📁 frontend
│ ├── 📁 public
│ │ ├── favicon.ico
│ │ ├── index.html
│ │ ├── manifest.json
│ │ └── robots.txt
│ │
│ ├── 📁 src
│ │ ├── 📁 components
│ │ ├── App.js
│ │ ├── App.css
│ │ ├── index.js
│ │ └── index.css
│ │
│ ├── 📄 package.json
│ └── 📄 package-lock.json
│
├── 📄 README.md ⭐ (ROOT LEVEL – GitHub reads this)
├── 📄 .gitignore
└── 📄 package.json (if applicable)
```
---
## 🛠️ Setup & Installation

### ✅ Prerequisites
Before setting up the project, make sure you have:
- **Node.js (v16 or higher)**
- **npm (Node Package Manager)**
- **AWS Account**
- **AWS CLI configured**
- **Git**
  
### 🔽 Step 1: Clone the Repository**
```sh
git clone https://github.com/Harsh64041/Geo-Sentiment-Analyzer.git
cd Geo-Sentiment-Analyzer
```
### 📦 Step 2: Install Dependencies**
- **Backend Dependencies**
```sh
cd Backend
npm install
```
- **Frontend Dependencies**
 ```sh
cd ../frontend
npm install
```
### 🛢️ Step 3: Set Up AWS DynamoDB
- **Log in to AWS Management Console**
- **Navigate to DynamoDB**
- **Create a new table with the following details:**
- Table Name: GeoSentimentTable
- Partition Key: id (String)
- **Configure AWS CLI on your systemx:**
```sh
aws configure
```
### **Enter Credentials:**
- AWS Access Key ID
- AWS Secret Access Key
- Region (e.g. ap-south-1)
- Output format: json
- **Create a .env file inside the Backend folder:**
```sh
PORT=5000
AWS_REGION=ap-south-1
DYNAMODB_TABLE_NAME=GeoSentimentTable
```

### ▶️ Step 4: Run the Application
- **Start Backend Server**
```sh
cd Backend
npm start
```
- **Backend will run at:**
```sh
http://localhost:5000
```

- **Start Frontend Application**
```sh
cd frontend
npm start
```
- **Frontend will run at:**
```sh
http://localhost:3000
```
---
### 🔮 Future Enhancements

🚀 Advanced NLP & Deep Learning Models – Improve sentiment accuracy using transformer-based models (BERT, RoBERTa).

🗺️ Interactive Global Sentiment Map – Visualize real-time sentiment trends using Leaflet and Mapbox.

📊 Real-Time Analytics Dashboard – Display sentiment trends, spikes, and historical analysis.

🔔 Alert & Notification System – Trigger alerts for sudden sentiment changes across regions.

☁️ Enhanced Cloud Scalability – Optimize performance using AWS Lambda and auto-scaling services.

### 🤝 Contribution
- Fork the repository.
- Create a feature branch (git checkout -b feature-branch).
- Commit your changes (git commit -m "Add new feature").
- Push to the branch (git push origin feature-branch).
- Open a Pull Request.

### 📧 Contact & Support

For any queries or support, feel free to reach out:

For any queries, reach out to:
- 👤 Harsh Vardhan Sharma
- 📩 Email: harshvardhans809@gmail.com
- 🔗 LinkedIn: [Connect with me](www.linkedin.com/in/harshvardhan-sharma-246919297)
- 🌍 GitHub: [Project Repository](https://github.com/Harsh64041/Geo-Sentiment-Analyzer)
