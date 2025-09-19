#include <WiFi.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h>
#include <RTClib.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Pins
#define SS_PIN    21    // RC522 SDA pin
#define RST_PIN   22    // RC522 RST pin
#define BUZZER_PIN 27
#define LED_RED   14
#define LED_GREEN 12
#define LED_BLUE  13

// OLED
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET    -1
#define OLED_ADDR     0x3C

// Servo (optional if used for dispensing)
// #include <Servo.h>
// #define SERVO_PIN 17
// Servo dispenser;

const char* ssid = "JioFiber-80_5G";
const char* password = "12345678";

const char* backendHost = "http://192.168.29.119:8000";
 // Change to your backend IP

MFRC522 mfrc522(SS_PIN, RST_PIN);  // RFID
RTC_DS3231 rtc;                    // RTC

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

String lastUID = "";

void setup() {
  Serial.begin(115200);
  delay(1000);

  // WiFi connect
  WiFi.begin(ssid, password);
  display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDR);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0, 0);
  display.println("Connecting WiFi...");
  display.display();

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  display.clearDisplay();
  display.println("WiFi connected!");
  display.display();
  Serial.println("WiFi connected");

  // Initialize RFID
  SPI.begin();
  mfrc522.PCD_Init();

  // Initialize RTC
  if (!rtc.begin()) {
    Serial.println("RTC not found");
    display.println("RTC not found!");
    display.display();
    while (1) delay(10);
  }
  if (rtc.lostPower()) {
    Serial.println("RTC lost power, setting time!");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }

  // Initialize LEDs and buzzer
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);

  ledStatus("Ready");
}

void loop() {
  // Check RFID card presence
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    delay(100);
    return;
  }

  String uid = getUID();
  if (uid == lastUID) {
    delay(1000); // Debounce same card
    return;
  }
  lastUID = uid;
  Serial.print("UID: "); Serial.println(uid);

  displayMessage("Card UID: " + uid);
  ledStatus("Reading");

  bool valid = authenticateUser(uid);

  if (valid) {
    dispensedPillProcedure(uid);
  } else {
    errorProcedure("Invalid RFID!");
  }

  delay(3000);
  ledStatus("Ready");
}

// Get UID string from RFID
String getUID() {
  String uidStr = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uidStr += String(mfrc522.uid.uidByte[i], HEX);
  }
  uidStr.toUpperCase();
  return uidStr;
}

// Display message on OLED
void displayMessage(String msg) {
  display.clearDisplay();
  display.setCursor(0, 0);
  display.setTextSize(1);
  display.print(msg);
  display.display();
}

// Set LEDs and buzzer for status
void ledStatus(String status) {
  if (status == "Ready") {
    digitalWrite(LED_RED, LOW);
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_BLUE, LOW);
    noTone(BUZZER_PIN);
  } else if (status == "Reading") {
    digitalWrite(LED_RED, LOW);
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_BLUE, HIGH);
    noTone(BUZZER_PIN);
  } else if (status == "Error") {
    digitalWrite(LED_RED, HIGH);
    digitalWrite(LED_GREEN, LOW);
    digitalWrite(LED_BLUE, LOW);
    tone(BUZZER_PIN, 1000);
  } else if (status == "Dispensed") {
    digitalWrite(LED_RED, LOW);
    digitalWrite(LED_GREEN, HIGH);
    digitalWrite(LED_BLUE, HIGH);
    tone(BUZZER_PIN, 2000, 200);
  }
}

// Authenticate UID with backend
bool authenticateUser(String uid) {
  if (WiFi.status() != WL_CONNECTED) return false;
  HTTPClient http;
  String url = String(backendHost) + "/api/auth/check_uid?uid=" + uid;
  http.begin(url);
  int code = http.GET();
  if (code == 200) {
    String res = http.getString();
    http.end();
    return (res == "true"); // Backend returns "true" or "false"
  }
  http.end();
  return false;
}

// Pill dispensing procedure
void dispensedPillProcedure(String uid) {
  displayMessage("Authorized!");
  ledStatus("Dispensed");
  // TODO: Add servo motor code here to dispense pill if available

  // Log dispensing event to backend
  sendLog(uid, true);

  delay(1000);
  displayMessage("Pill Dispensed");
  delay(1000);
  noTone(BUZZER_PIN);
}

// Error procedure
void errorProcedure(String errmsg) {
  displayMessage(errmsg);
  ledStatus("Error");
  sendLog(lastUID, false);
  delay(1000);
  noTone(BUZZER_PIN);
}

// Send dispensing log to backend
void sendLog(String uid, bool dispensed) {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin(String(backendHost) + "/api/logs");
  http.addHeader("Content-Type", "application/json");
  String payload = "{\"user_uid\":\"" + uid + "\",\"pill_dispensed\":" + (dispensed ? "true" : "false") + ",\"device_id\":\"SmartPill+\"}";
  int code = http.POST(payload);
  if (code > 0) {
    Serial.println("Log sent");
  } else {
    Serial.println("Error sending log");
  }
  http.end();
}
