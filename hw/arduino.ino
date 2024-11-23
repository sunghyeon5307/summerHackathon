const int trigPin1 = 9;   // 엑셀 초음파 센서 Trig 핀
const int echoPin1 = 10;  // 엑셀 초음파 센서 Echo 핀
const int trigPin2 = 11;  // 브레이크 초음파 센서 Trig 핀
const int echoPin2 = 12;  // 브레이크 초음파 센서 Echo 핀
const int greenLedPin = 2;  // 초록색 LED를 2번 핀에 연결
const int redLedPin = 3;    // 빨간색 LED를 3번 핀에 연결

const float maxDistance = 4.5; // 페달을 누르지 않았을 때의 최대 거리 (cm)
const float minDistance = 0.1;  // 페달을 완전히 눌렀을 때의 최소 거리 (cm)
const float maxSpeed = 200.0;   // 최대 속도 (km/h)
const float maxBrake = 800.0;   // 최대 감속도 (km/h/s)
const float smoothingFactor = 0.4; // 속도 평활화 계수 (0.0 ~ 1.0)

float currentSpeed = 0.0; // 현재 속도
int receivedValue = 0; // 파이썬에서 받은 첫 번째 값
int receivedValue2 = 0; // 파이썬에서 받은 두 번째 값 (stop 테이블의 value)

void setup() {
  Serial.begin(9600);
  pinMode(trigPin1, OUTPUT);
  pinMode(echoPin1, INPUT);
  pinMode(trigPin2, OUTPUT);
  pinMode(echoPin2, INPUT);
  pinMode(greenLedPin, OUTPUT);
  pinMode(redLedPin, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    int commaIndex = data.indexOf(',');
    if (commaIndex != -1) {
      receivedValue = data.substring(0, commaIndex).toInt();
      receivedValue2 = data.substring(commaIndex + 1).toInt();
      Serial.print("Received values from Python: ");
      Serial.print(receivedValue);
      Serial.print(", ");
      Serial.println(receivedValue2);
    }
  }

  if (receivedValue == 0 && receivedValue2 == 0) {
    // 정상 작동 모드

    float accelDistance = measureDistance(trigPin1, echoPin1);
    float brakeDistance = measureDistance(trigPin2, echoPin2);
    
    float accelPosition = calculatePedalPosition(accelDistance);
    float brakePosition = calculatePedalPosition(brakeDistance);
    
    float targetAcceleration = calculateAcceleration(accelPosition);
    float targetDeceleration = calculateDeceleration(brakePosition);
    
    float targetSpeed = currentSpeed + targetAcceleration - targetDeceleration;
    if (targetSpeed < 0) targetSpeed = 0;
    if (targetSpeed > maxSpeed) targetSpeed = maxSpeed;
    
    currentSpeed = currentSpeed + smoothingFactor * (targetSpeed - currentSpeed);

    if(currentSpeed < 1) {
      digitalWrite(redLedPin, HIGH);
      digitalWrite(greenLedPin, LOW);
    }
    else{
      digitalWrite(greenLedPin, HIGH);
      digitalWrite(redLedPin, LOW);
    }
  } 
  else if (receivedValue == 1 && receivedValue2 == 0) {
    // 브레이크 작동 안함, LED 초록색
    digitalWrite(greenLedPin, HIGH);
    digitalWrite(redLedPin, LOW);

    float accelDistance = measureDistance(trigPin1, echoPin1);
    float accelPosition = calculatePedalPosition(accelDistance);
    float targetAcceleration = calculateAcceleration(accelPosition);
    
    float targetSpeed = currentSpeed + targetAcceleration;
    if (targetSpeed < 0) targetSpeed = 0;
    if (targetSpeed > maxSpeed) targetSpeed = maxSpeed;
    
    currentSpeed = currentSpeed + smoothingFactor * (targetSpeed - currentSpeed);
  }
  else if (receivedValue == 1 && receivedValue2 == 1) {
    // LED 빨간색, 엑셀 작동 안함, 속도 0
    digitalWrite(greenLedPin, LOW);
    digitalWrite(redLedPin, HIGH);
    currentSpeed = 0;
  }

  Serial.println(currentSpeed);
  delay(100);
}

// 기존의 다른 함수들 (measureDistance, calculatePedalPosition, calculateAcceleration, calculateDeceleration)은 그대로 유지

float measureDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  return duration * 0.034 / 2;  // cm로 변환
}

float calculatePedalPosition(float distance) {
  if (distance > maxDistance) distance = maxDistance;
  if (distance < minDistance) distance = minDistance;
  
  return (maxDistance - distance) / (maxDistance - minDistance);
}

float calculateAcceleration(float pedalPosition) {
  return maxSpeed * pedalPosition / 10.0; // 10초 동안 최대 속도에 도달
}

float calculateDeceleration(float pedalPosition) {
  return maxBrake * pedalPosition / 5.0; // 5초 동안 최대 감속
}