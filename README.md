<a name="readme-top"></a>

# 🌍 Geo Sentiment Analyzer

A **full-stack, cloud-native application** that ingests, analyzes, and visualizes **global news sentiment in real time** using AWS, Node.js, and React.

---

## 📌 About The Project

**Geo Sentiment Analyzer** is designed to process live global news data, perform real-time **sentiment analysis**, and present insights through an **interactive geographic dashboard**.

The application consumes data from the **GDELT API**, applies NLP-based sentiment scoring, stores results using a serverless database, and visualizes trends using charts and heatmaps.

This project demonstrates:
- Cloud-native architecture
- Real-time data ingestion
- Scalable backend services
- Interactive frontend visualization

---

## 🧠 Architecture Overview

- **Backend**  
  Built with **Node.js and Express**, deployed on **AWS Elastic Beanstalk** for scalable data ingestion and sentiment processing.

- **Database**  
  **AWS DynamoDB** is used for fast, serverless storage of processed sentiment data.

- **Frontend**  
  A **React.js dashboard** hosted on **AWS S3** that renders charts, heatmaps, and analytics in real time.

---

## 🛠️ Built With

### ☁ Cloud & Infrastructure
- AWS S3  
- AWS Elastic Beanstalk  
- AWS DynamoDB  

### ⚙ Backend
- Node.js  
- Express.js  

### 🎨 Frontend
- React.js  

### 📊 Data & Visualization
- GDELT API  
- D3.js  
- Chart.js  
- Leaflet.js (Geographic Heatmaps)

---

## ✨ Features

✅ Real-time ingestion of global news data  
✅ NLP-based sentiment analysis (Positive / Neutral / Negative)  
✅ Interactive geographic heatmap  
✅ Dynamic pie charts for sentiment distribution  
✅ Bar charts for top news sources  
✅ Serverless and scalable AWS architecture  
✅ Cloud deployment-ready solution  

---

## ⚡ Getting Started

Follow these steps to set up and run the project locally or deploy it on AWS.

---

## 📦 Prerequisites

- Node.js & npm installed  
- AWS account  
- AWS CLI configured with appropriate permissions  

---

## 🔧 Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/[username]/[repo-name].git
