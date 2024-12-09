# 🚗 Fleet Management and Supervision System  

## 📖 Description  
This project is a **vehicle fleet management and supervision system** designed to streamline the operations of fleet-based organizations. It integrates **vehicle data acquisition**, **real-time GPS tracking**, and a **web-based interface** to manage, monitor, and optimize fleet performance.

---

## 🌟 Features  
- **Vehicle Management**:  
  - Add, update, delete, and view vehicle details such as license plate, model, year, mileage, GPS position, and engine parameters.  
- **Real-Time Monitoring**:  
  - Monitor vehicles' GPS positions and key engine metrics in real time.  
- **Maintenance Management**:  
  - Schedule and manage both preventive and curative maintenance interventions.  
  - Receive maintenance suggestions based on vehicle mileage.  
- **Fuel Management**:  
  - Track fuel supply operations with details like date, quantity, and associated costs.  
  - Automatically calculate fuel quantities based on predefined prices for diesel and gasoline.  
- **User-Friendly Interface**:  
  - Responsive and intuitive web application built with **React** and styled with **Chakra UI**.  
- **Firebase Integration**:  
  - Leverages Firebase for real-time data storage and retrieval.  

---

## 📽️ Demo  

![System Demonstration](./demo_video.mp4)  

> The demo video provides a complete walkthrough of the system, showcasing all major functionalities, including login, dashboard, vehicle management, maintenance, and fuel management.  

**How to view the video:**  
Ensure the video file (`demo_video.mp4`) is in the root directory of this repository. Simply click on the file in the GitHub repo or download it locally to play.  

---

## 🛠️ Tech Stack  

### Frontend  
- **React JS**  
- **Chakra UI**  

### Backend & Database  
- **Firebase**  

### Tools and Frameworks  
- **Node-RED**: For processing GPS and OBD-II data.  
- **Python**: For OBD-II data acquisition using pyobd.  
- **SIM808 Module**: For GPS and GSM data collection.  

### Communication Protocols  
- **ELM327**: For OBD-II vehicle data acquisition.  

---

## 🚀 How to Run  

1. Clone the repository:  
   ```bash
   git clone https://github.com/FendiYassine/Fleet_management__and_supervision_system.git
   cd Fleet_management__and_supervision_system
2. Install dependencies for the React application:
   ```bash
    npm install
3. Configure Firebase by adding your firebaseConfig object to the code.
4. Start the React application:
   ```bash
    npm run start

5. Set up Node-RED with the provided flow files to process GPS and OBD-II data.
6. Deploy the application and monitor the system.

## 📈 Project Highlights
* Provides real-time insights into fleet performance and vehicle health.
* Improves operational efficiency with predictive maintenance.
* Environmentally conscious design with minimal hardware power consumption.

## 👤 Author  

**Yassine Fendi**  
- [GitHub](https://github.com/FendiYassine)  
- [LinkedIn](https://www.linkedin.com/in/yassine-fendi-25141a241/)  
- [Email](mailto:yassine.fendi@edu.dsti.institute)  

---

## 🤝 Contributions  

Contributions are welcome! Feel free to fork the repository and submit a pull request.  


 
