# MediTrack+ IoT Medication Reminder System

An ESP32-based medication reminder system with web dashboard for tracking medication adherence.

## Current Status

### Software 
- **Backend**: FastAPI server with SQLite database
- **Frontend**: React dashboard for viewing logs
- **Hardware Code**: ESP32 firmware written but not uploaded yet

### Hardware (Not Wired)
- ESP32-S 30-pin development board
- SSD1306 OLED display (128x64, I2C)
- RC522 RFID module + tags
- DS3231 RTC module with CR2032 battery
- 3 Red, 3 Green, 3 Blue LEDs with 1kΩ resistors
- 5V buzzer
- MH Flying Fish-2 moisture sensor
- Breadboard and jumper wires

## Quick Start (Software Only)

### 1. Run Backend
```bash
cd backend
python app.py
# Server starts at http://localhost:8000
```

### 2. Run Frontend  
```bash
cd frontend
npm install
npm start
# Dashboard opens at http://localhost:3000
```

### 3. Test API
Visit `http://localhost:8000/docs` to see API endpoints and test manually.

## Project Structure
```
MediTrack+/
├── backend/          # FastAPI server
├── frontend/         # React dashboard  
├── hardware/         # ESP32 code (ready to upload)
├── templates/        # Web assets
├── static/          # Static files
├── venv/            # Python environment
├── .env             # Configuration
└── run.bat         # Backend startup script
```

## Next Steps

1. **Wire Hardware**: Connect components to ESP32 breadboard
2. **Upload Firmware**: Flash ESP32 with medication reminder code  
3. **Test Integration**: Verify WiFi communication between hardware and backend

## Hardware Wiring

ESP32 connections needed:
- OLED: SDA→D21, SCL→D22
- RTC: SDA→D21, SCL→D22 (shared I2C)
- RFID: SS→D5, SCK→D18, MOSI→D23, MISO→D19, RST→D4
- LEDs: Red→D2, Green→D16, Blue→D17 (with 1kΩ resistors)
- Buzzer: Positive→D13

All components use 3.3V power from ESP32.