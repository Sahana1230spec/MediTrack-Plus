# MediTrack+ IoT Medication Reminder & Dispenser System

## 🚀 Project Overview

MediTrack+ is a comprehensive IoT-enabled medication adherence platform that combines hardware sensors, real-time data processing, and an intuitive web dashboard to help patients maintain consistent medication schedules. The system uses ESP32-based hardware for medication detection and reminder alerts, paired with a modern web application for monitoring and analytics.

### Current Features ✅

- **Smart Medication Scheduling**: Automated reminders at configurable times (9:00 AM, 2:00 PM, 8:00 PM)
- **RFID-Based Confirmation**: Tap-to-confirm medication intake using RFID tags
- **Real-Time Display**: OLED screen shows medication status and next reminder times
- **Visual Alerts**: Multi-color LED system (Red/Green/Blue) for status indication
- **Web Dashboard**: React-based interface for viewing medication logs and adherence statistics
- **RESTful API**: FastAPI backend with SQLite database for event logging
- **Real-Time Clock**: DS3231 RTC module maintains accurate scheduling even when offline
- **Data Persistence**: Automatic logging of all medication events with timestamps

### Planned Enhancements 🔮

- **Audio Alerts**: 5V buzzer integration for audible medication reminders
- **Environmental Monitoring**: Moisture sensor for medication storage conditions
- **Mobile Notifications**: Push notifications via web app
- **Advanced Analytics**: Weekly/monthly adherence trends and insights
- **Multi-User Support**: Support for multiple patients and caregivers

## 🏗️ System Architecture

```
┌─────────────────┐    HTTP/WiFi    ┌─────────────────┐
│   ESP32 Device  │ ←────────────→  │  FastAPI Server │
│   (Hardware)    │                 │   (Backend)     │
│                 │                 │                 │
│ • RFID Reader   │                 │ • SQLite DB     │
│ • OLED Display  │                 │ • REST API      │
│ • RTC Clock     │                 │ • Event Logging │
│ • LED Alerts    │                 │ • CORS Support  │
└─────────────────┘                 └─────────────────┘
                                             │
                                             │ HTTP API
                                             ▼
                                    ┌─────────────────┐
                                    │  React Frontend │
                                    │  (Dashboard)    │
                                    │                 │
                                    │ • Event Logs    │
                                    │ • Statistics    │
                                    │ • Date Filters  │
                                    │ • Responsive UI │
                                    └─────────────────┘
```

## 🛠️ Hardware Components

### Currently Integrated Hardware ✅
- **ESP32-S 30-pin expansion board** - Main microcontroller (3.3V logic)
- **SSD1306 OLED Display** - 128x64 I2C interface for status messages
- **RC522 RFID Module + Tags** - NFC-based medication confirmation
- **DS3231 RTC Module** - Real-time clock with CR2032 backup battery
- **RGB LED Array** - 3x Red, 3x Green, 3x Blue LEDs with 1kΩ current limiting resistors
- **Breadboard & Jumper Wires** - Prototyping platform with organized connections

### Future Hardware Integration 🔧
- **5V Active Buzzer** - Audible medication reminders (compatible with 3.3V logic)
- **MH Flying Fish-2 Moisture Sensor** - Environmental monitoring for medication storage
- **Additional Sensors** - Temperature, humidity, or proximity sensors for enhanced functionality

### Hardware Specifications
- **Operating Voltage**: 3.3V logic levels throughout
- **Communication Protocols**: I2C (OLED, RTC), SPI (RFID), GPIO (LEDs, Buzzer)
- **Power Requirements**: ~400mA peak consumption via USB or external 5V supply
- **Connectivity**: Wi-Fi 802.11 b/g/n for backend communication

## 🏁 Quick Start Guide

### Prerequisites
- **Python 3.8+** with pip package manager
- **Node.js 16+** with npm
- **Arduino IDE 2.x** with ESP32 board support
- **Git** for version control

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/meditrack-plus.git
cd meditrack-plus
```

### 2. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**Backend will be available at:** `http://localhost:8000`
**API Documentation:** `http://localhost:8000/docs` (Swagger UI)

### 3. Frontend Setup (React)
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start React development server
npm start
```

**Frontend will be available at:** `http://localhost:3000`

### 4. Hardware Setup (ESP32)
1. **Install Arduino IDE Libraries:**
   - ESP32 Board Package via Board Manager
   - MFRC522 (RFID), RTClib (RTC), Adafruit SSD1306 (OLED)
   - ArduinoJson, WiFi, HTTPClient (built-in)

2. **Configure ESP32 Code:**
   ```cpp
   // Update in hardware/meditrack_esp32/meditrack_esp32.ino
   #define WIFI_SSID "Your_WiFi_Network"
   #define WIFI_PASS "Your_WiFi_Password" 
   #define BACKEND_URL "http://192.168.1.100:8000/api/log-event"
   ```

3. **Upload to ESP32:**
   - Select Board: "ESP32 Dev Module"
   - Connect via USB and upload firmware

## 📁 Project Structure

```
meditrack-plus/
├── backend/                    # FastAPI backend server
│   ├── app.py                 # Main FastAPI application
│   ├── models/                # Database models
│   ├── routers/               # API route handlers  
│   ├── requirements.txt       # Python dependencies
│   └── database.db           # SQLite database (auto-created)
│
├── frontend/                  # React web dashboard
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Application pages
│   │   ├── services/        # API integration
│   │   └── App.js          # Main React application
│   ├── package.json         # Node.js dependencies
│   └── build/              # Production build output
│
├── hardware/                 # ESP32 firmware
│   └── meditrack_esp32/
│       ├── meditrack_esp32.ino    # Main Arduino sketch
│       ├── config.h              # Hardware pin definitions
│       └── libraries_list.md     # Required Arduino libraries
│
├── docs/                    # Project documentation
│   ├── wiring_guide.md      # Hardware assembly instructions
│   ├── api_reference.md     # Backend API documentation
│   └── deployment_guide.md  # Production deployment steps
│
├── scripts/                 # Automation scripts
│   ├── start_backend.sh     # Backend startup script
│   ├── start_frontend.sh    # Frontend startup script
│   └── setup_dev.sh         # Development environment setup
│
├── README.md               # This file
├── LICENSE.md             # MIT License
├── .gitignore            # Git ignore patterns
└── requirements.txt      # Root-level Python dependencies
```

## 🔌 API Endpoints

### Medication Events
- **POST** `/api/log-event` - Log medication intake or missed event
- **GET** `/api/events` - Retrieve medication event history
- **GET** `/api/events/{date}` - Get events for specific date
- **GET** `/api/stats` - Get adherence statistics and analytics

### System Health  
- **GET** `/api/health` - Backend health check
- **GET** `/api/device-status` - ESP32 device connectivity status

Example API Request:
```json
POST /api/log-event
{
  "timestamp": "2025-09-19T14:00:00",
  "tag_uid": "ABC12345", 
  "status": "TAKEN",
  "device_id": "esp32_001"
}
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/ -v
```

### Frontend Testing  
```bash
cd frontend
npm test
```

### Hardware Testing
Use Arduino IDE Serial Monitor to debug ESP32 connectivity and sensor readings.

## 🚀 Deployment

### Production Backend (Docker)
```bash
docker build -t meditrack-backend ./backend
docker run -p 8000:8000 meditrack-backend
```

### Production Frontend
```bash
cd frontend
npm run build
# Deploy build/ directory to web server
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript formatting
- Comment hardware pin assignments clearly
- Test all API endpoints before submitting PRs

## 🐛 Troubleshooting

### Common Issues
- **ESP32 won't connect**: Check Wi-Fi credentials and network connectivity
- **OLED display blank**: Verify I2C wiring (SDA=GPIO21, SCL=GPIO22)  
- **RFID not detecting**: Ensure RC522 SPI connections and 3.3V power supply
- **Backend API errors**: Check FastAPI logs and database permissions

### Hardware Debugging
- Use multimeter to verify 3.3V power rails
- Check Arduino IDE Serial Monitor for ESP32 debug output
- Verify all jumper wire connections match pin assignments

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

